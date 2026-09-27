export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/submit") {
      if (request.method !== "POST") {
        return Response.json(
          { success: false, message: "Method not allowed." },
          { status: 405, headers: { Allow: "POST" } }
        );
      }

      const form = await request.formData();
      const clean = (v, max) => String(v || "").trim().slice(0, max);

      const name = clean(form.get("name"), 120);
      const email = clean(form.get("email"), 160).toLowerCase();
      const phone = clean(form.get("phone"), 30);
      const service = clean(form.get("service"), 80);
      const budget = clean(form.get("budget"), 80);
      const contactPreference = clean(form.get("contactPreference"), 40);
      const message = clean(form.get("message"), 4000);

      if (!name || !email || !phone || !service || !budget || !contactPreference || !message) {
        return Response.json(
          { success: false, message: "Please complete all required fields." },
          { status: 400 }
        );
      }

      if (!env.VAROMA_DB) {
        return Response.json(
          { success: false, message: "Lead database is not connected yet." },
          { status: 503 }
        );
      }

      await env.VAROMA_DB.prepare(
        "CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, service TEXT NOT NULL, budget TEXT NOT NULL, contact_preference TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New Lead', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"
      ).run();

      const result = await env.VAROMA_DB.prepare(
        "INSERT INTO leads (name, email, phone, service, budget, contact_preference, message) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, email, phone, service, budget, contactPreference, message).run();

      const leadId = result.meta?.last_row_id ?? null;

      // D1 is the source of truth. Email notification is best-effort.
      // The webhook URL and secret are Cloudflare runtime secrets, not stored in GitHub.
      if (env.GMAIL_WEBHOOK_URL && env.GMAIL_WEBHOOK_SECRET) {
        const notify = fetch(env.GMAIL_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            secret: env.GMAIL_WEBHOOK_SECRET,
            leadId,
            name,
            email,
            phone,
            service,
            budget,
            contactPreference,
            message
          })
        }).then(async (response) => {
          if (!response.ok) {
            console.error("Gmail notification failed:", response.status, await response.text());
          }
        }).catch((error) => {
          console.error("Gmail notification error:", error);
        });

        ctx.waitUntil(notify);
      } else {
        console.warn("Gmail notification is not configured yet.");
      }

      return Response.json({
        success: true,
        leadId,
        message: "Thank you! Your inquiry has been received."
      });
    }


    if (url.pathname === "/api/admin/login") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      if (!env.ADMIN_PASSWORD) return Response.json({ success: false, message: "Admin password is not configured." }, { status: 503 });
      const body = await request.json().catch(() => ({}));
      if (String(body.password || "") !== env.ADMIN_PASSWORD) {
        return Response.json({ success: false, message: "Invalid password." }, { status: 401 });
      }
      return Response.json({ success: true, message: "Signed in." });
    }

    if (url.pathname === "/api/admin/leads") {
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
      await ensureQuotesTable(env.VAROMA_DB);
      const result = await env.VAROMA_DB.prepare("SELECT l.*, q.quote_number, q.total AS quote_total, q.status AS quote_status FROM leads l LEFT JOIN quotes q ON q.id = (SELECT q2.id FROM quotes q2 WHERE q2.lead_id = l.id ORDER BY q2.id DESC LIMIT 1) ORDER BY l.id DESC LIMIT 100").all();
      return Response.json({ success: true, leads: result.results || [] });
    }

    if (url.pathname === "/api/admin/quote") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });

      const body = await request.json().catch(() => ({}));
      const leadId = Number(body.leadId);
      const items = Array.isArray(body.items) ? body.items : [];
      const discount = Math.max(0, Number(body.discount) || 0);
      const taxPercent = Math.max(0, Math.min(100, Number(body.taxPercent) || 0));
      const validityDays = Math.max(1, Math.min(365, Number(body.validityDays) || 7));
      const notes = String(body.notes || "").trim().slice(0, 2000);
      const cleanItems = items.map(item => ({
        description: String(item.description || "").trim().slice(0, 200),
        qty: Math.max(0, Number(item.qty) || 0),
        rate: Math.max(0, Number(item.rate) || 0)
      })).filter(item => item.description && item.qty > 0);

      if (!Number.isInteger(leadId) || leadId < 1 || !cleanItems.length) {
        return Response.json({ success: false, message: "Lead and quote items are required." }, { status: 400 });
      }

      await ensureQuotesTable(env.VAROMA_DB);
      const lead = await env.VAROMA_DB.prepare("SELECT id,name,email,phone,service,budget FROM leads WHERE id = ?").bind(leadId).first();
      if (!lead) return Response.json({ success: false, message: "Lead not found." }, { status: 404 });

      const subtotal = Math.round(cleanItems.reduce((sum, item) => sum + item.qty * item.rate, 0) * 100) / 100;
      const appliedDiscount = Math.round(Math.min(discount, subtotal) * 100) / 100;
      const taxable = Math.max(0, subtotal - appliedDiscount);
      const taxAmount = Math.round(taxable * taxPercent / 100 * 100) / 100;
      const total = Math.round((taxable + taxAmount) * 100) / 100;
      const quoteNumber = "VS-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();

      const inserted = await env.VAROMA_DB.prepare(
        "INSERT INTO quotes (quote_number,lead_id,customer_name,customer_email,customer_phone,items_json,subtotal,discount,tax_percent,tax_amount,total,validity_days,notes,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'Draft')"
      ).bind(quoteNumber, lead.id, lead.name, lead.email, lead.phone, JSON.stringify(cleanItems), subtotal, appliedDiscount, taxPercent, taxAmount, total, validityDays, notes).run();

      const quoteId = inserted.meta?.last_row_id ?? null;
      let status = "Draft";
      let message = "Quotation saved as draft.";

      if (env.GMAIL_WEBHOOK_URL && env.GMAIL_WEBHOOK_SECRET) {
        try {
          const response = await fetch(env.GMAIL_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "quote",
              secret: env.GMAIL_WEBHOOK_SECRET,
              quoteId,
              quoteNumber,
              customer: { name: lead.name, email: lead.email, phone: lead.phone },
              items: cleanItems,
              subtotal,
              discount: appliedDiscount,
              taxPercent,
              taxAmount,
              total,
              validityDays,
              notes
            })
          });
          const result = await response.json().catch(() => ({}));
          if (response.ok && result.success) {
            status = "Sent";
            message = "Quotation created and emailed to the customer.";
          } else {
            console.error("Quote email failed:", response.status, result);
          }
        } catch (error) {
          console.error("Quote email error:", error);
        }
      }

      await env.VAROMA_DB.prepare("UPDATE quotes SET status = ?, sent_at = CASE WHEN ? = 'Sent' THEN CURRENT_TIMESTAMP ELSE sent_at END WHERE id = ?").bind(status, status, quoteId).run();
      return Response.json({ success: true, quoteId, quoteNumber, total, status, message });
    }

    return env.ASSETS.fetch(request);
  }
};

async function adminAuthorized(request, env) {
  const header = request.headers.get("Authorization") || "";
  return !!env.ADMIN_PASSWORD && header === "Bearer " + env.ADMIN_PASSWORD;
}

async function ensureQuotesTable(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quote_number TEXT NOT NULL UNIQUE, lead_id INTEGER NOT NULL, customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT NOT NULL, items_json TEXT NOT NULL, subtotal REAL NOT NULL, discount REAL NOT NULL DEFAULT 0, tax_percent REAL NOT NULL DEFAULT 0, tax_amount REAL NOT NULL DEFAULT 0, total REAL NOT NULL, validity_days INTEGER NOT NULL DEFAULT 7, notes TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'Draft', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, sent_at TEXT)").run();
}
