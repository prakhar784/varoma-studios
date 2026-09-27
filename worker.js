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
      const session = await createAdminSession(env.ADMIN_PASSWORD);
      return new Response(JSON.stringify({ success: true, message: "Signed in." }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": adminCookie(session)
        }
      });
    }


    if (url.pathname === "/api/admin/logout") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      return new Response(JSON.stringify({ success: true, message: "Signed out." }), {
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": adminLogoutCookie()
        }
      });
    }

    if (url.pathname === "/api/project/track" && request.method === "GET") {
      const quoteNumber = cleanParam(url.searchParams.get("quote"), 80);
      const email = cleanParam(url.searchParams.get("email"), 160).toLowerCase();
      if (!quoteNumber || !email) return Response.json({ success: false, message: "Quotation number and customer email are required." }, { status: 400 });
      await ensureQuotesTable(env.VAROMA_DB);
      const project = await env.VAROMA_DB.prepare("SELECT quote_number,customer_name,customer_email,service_name,project_status,project_updated_at FROM quotes WHERE quote_number = ? AND lower(customer_email) = ?").bind(quoteNumber,email).first();
      if (!project) return Response.json({ success: false, message: "Project not found. Check the quotation number and email." }, { status: 404 });
      return Response.json({ success: true, project });
    }

    if (url.pathname === "/api/payment/quote" && request.method === "GET") {
      const quoteNumber = cleanParam(url.searchParams.get("quote"), 80);
      if (!quoteNumber) return Response.json({ success: false, message: "Quote number is required." }, { status: 400 });
      await ensureQuotesTable(env.VAROMA_DB);
      const quote = await env.VAROMA_DB.prepare("SELECT quote_number,customer_name,customer_email,items_json,subtotal,discount,tax_percent,tax_amount,total,validity_days,notes,status,payment_status,payment_reference,payment_submitted_at FROM quotes WHERE quote_number = ?").bind(quoteNumber).first();
      if (!quote) return Response.json({ success: false, message: "Quotation not found." }, { status: 404 });
      return Response.json({ success: true, quote });
    }

    if (url.pathname === "/api/payment/submit" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const quoteNumber = cleanParam(body.quoteNumber, 80);
      const reference = cleanParam(body.reference, 120);
      if (!quoteNumber || !reference) return Response.json({ success: false, message: "Quote number and payment reference are required." }, { status: 400 });
      await ensureQuotesTable(env.VAROMA_DB);
      const quote = await env.VAROMA_DB.prepare("SELECT id,quote_number,payment_status FROM quotes WHERE quote_number = ?").bind(quoteNumber).first();
      if (!quote) return Response.json({ success: false, message: "Quotation not found." }, { status: 404 });
      if (quote.payment_status === "Paid") return Response.json({ success: false, message: "This quotation is already marked as paid." }, { status: 409 });
      await env.VAROMA_DB.prepare("UPDATE quotes SET payment_status='Payment Submitted', payment_reference=?, payment_submitted_at=CURRENT_TIMESTAMP WHERE id=?").bind(reference, quote.id).run();
      return Response.json({ success: true, message: "Payment reference submitted. Varoma Studios will verify the payment." });
    }

    if (url.pathname === "/api/admin/leads") {
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
      await ensureQuotesTable(env.VAROMA_DB);
      const result = await env.VAROMA_DB.prepare("SELECT l.*, q.quote_number, q.total AS quote_total, q.status AS quote_status, q.payment_status, q.payment_reference, q.payment_submitted_at, q.paid_at, q.project_status, q.project_updated_at FROM leads l LEFT JOIN quotes q ON q.id = (SELECT q2.id FROM quotes q2 WHERE q2.lead_id = l.id ORDER BY q2.id DESC LIMIT 1) ORDER BY l.id DESC LIMIT 100").all();
      return Response.json({ success: true, leads: result.results || [] });
    }

    if (url.pathname === "/api/admin/project-status") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
      const body = await request.json().catch(() => ({}));
      const quoteNumber = cleanParam(body.quoteNumber, 80);
      const projectStatus = ["Payment Pending", "Planning", "Development", "Testing", "Delivered"].includes(body.status) ? body.status : null;
      if (!quoteNumber || !projectStatus) return Response.json({ success: false, message: "Quotation number and valid project status are required." }, { status: 400 });
      await ensureQuotesTable(env.VAROMA_DB);
      const result = await env.VAROMA_DB.prepare("UPDATE quotes SET project_status=?, project_updated_at=CURRENT_TIMESTAMP WHERE quote_number=?").bind(projectStatus,quoteNumber).run();
      if (!result.meta?.changes) return Response.json({ success: false, message: "Quotation not found." }, { status: 404 });
      return Response.json({ success: true, message: "Project status updated." });
    }

    if (url.pathname === "/api/admin/payment-status") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
      const body = await request.json().catch(() => ({}));
      const quoteNumber = cleanParam(body.quoteNumber, 80);
      const paymentStatus = ["Pending", "Payment Submitted", "Paid"].includes(body.status) ? body.status : null;
      if (!quoteNumber || !paymentStatus) return Response.json({ success: false, message: "Quote number and valid payment status are required." }, { status: 400 });
      await ensureQuotesTable(env.VAROMA_DB);
      const result = await env.VAROMA_DB.prepare("UPDATE quotes SET payment_status=?, paid_at=CASE WHEN ?='Paid' THEN CURRENT_TIMESTAMP ELSE paid_at END WHERE quote_number=?").bind(paymentStatus, paymentStatus, quoteNumber).run();
      if (!result.meta?.changes) return Response.json({ success: false, message: "Quotation not found." }, { status: 404 });
      return Response.json({ success: true, message: "Payment status updated." });
    }

    if (url.pathname === "/api/admin/quote") {
      if (request.method !== "POST") return Response.json({ success: false, message: "Method not allowed." }, { status: 405 });
      if (!(await adminAuthorized(request, env))) return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });

      const body = await request.json().catch(() => ({}));
      const leadId = Number(body.leadId);
      const items = Array.isArray(body.items) ? body.items : [];
      const discountPercent = Math.max(0, Math.min(100, Number(body.discountPercent) || 0));
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
      const appliedDiscount = Math.round(subtotal * discountPercent / 100 * 100) / 100;
      const taxable = Math.max(0, subtotal - appliedDiscount);
      const taxAmount = Math.round(taxable * taxPercent / 100 * 100) / 100;
      const total = Math.round((taxable + taxAmount) * 100) / 100;
      const quoteNumber = "VS-" + new Date().getFullYear() + "-" + crypto.randomUUID().slice(0, 8).toUpperCase();

      const inserted = await env.VAROMA_DB.prepare(
        "INSERT INTO quotes (quote_number,lead_id,customer_name,customer_email,customer_phone,items_json,subtotal,discount,tax_percent,tax_amount,total,validity_days,notes,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'Draft')"
      ).bind(quoteNumber, lead.id, lead.name, lead.email, lead.phone, JSON.stringify(cleanItems), subtotal, appliedDiscount, taxPercent, taxAmount, total, validityDays, notes).run();

      const quoteId = inserted.meta?.last_row_id ?? null;
      await env.VAROMA_DB.prepare("UPDATE quotes SET service_name=? WHERE id=?").bind(lead.service,quoteId).run();
      const paymentUrl = new URL("/payment.html?quote=" + encodeURIComponent(quoteNumber), request.url).toString();
      const trackingUrl = new URL("/tracking.html?quote=" + encodeURIComponent(quoteNumber), request.url).toString();
      let status = "Draft";
      let message = "Quotation saved as draft.";

      if (env.GMAIL_WEBHOOK_URL && env.GMAIL_WEBHOOK_SECRET) {
        const notifyQuote = fetch(env.GMAIL_WEBHOOK_URL, {
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
            discountPercent,
            taxPercent,
            taxAmount,
            total,
            validityDays,
            notes: notes + "\n\nPayment link: " + paymentUrl + "\nProject tracking: " + trackingUrl,
            paymentUrl,
            trackingUrl
          })
        }).then(async response => {
          const result = await response.json().catch(() => ({}));
          if (response.ok && result.success) {
            await env.VAROMA_DB.prepare("UPDATE quotes SET status='Sent', sent_at=CURRENT_TIMESTAMP WHERE id=?").bind(quoteId).run();
          } else {
            console.error("Quote email failed:", response.status, result);
          }
        }).catch(error => {
          console.error("Quote email error:", error);
        });
        ctx.waitUntil(notifyQuote);
      }

      return Response.json({
        success: true,
        quoteId,
        quoteNumber,
        total,
        status: "Draft",
        paymentUrl,
        message: "Quotation created successfully. Email notification is being processed."
      });
    }

    return env.ASSETS.fetch(request);
  }
};

async function adminAuthorized(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\\s*)varoma_admin=([^;]+)/);
  if (!match) return false;
  return verifyAdminSession(decodeURIComponent(match[1]), env.ADMIN_PASSWORD);
}

async function createAdminSession(password) {
  const expires = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const payload = String(expires);
  const signature = await signSession(payload, password);
  return payload + "." + signature;
}

async function verifyAdminSession(token, password) {
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return false;
  const expires = Number(parts[0]);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  return (await signSession(parts[0], password)) === parts[1];
}

async function signSession(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function adminCookie(value) {
  return "varoma_admin=" + encodeURIComponent(value) + "; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=Strict";
}

function adminLogoutCookie() {
  return "varoma_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict";
}

async function ensureQuotesTable(db) {
  await db.prepare("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quote_number TEXT NOT NULL UNIQUE, lead_id INTEGER NOT NULL, customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT NOT NULL, items_json TEXT NOT NULL, subtotal REAL NOT NULL, discount REAL NOT NULL DEFAULT 0, tax_percent REAL NOT NULL DEFAULT 0, tax_amount REAL NOT NULL DEFAULT 0, total REAL NOT NULL, validity_days INTEGER NOT NULL DEFAULT 7, notes TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'Draft', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, sent_at TEXT, payment_status TEXT NOT NULL DEFAULT 'Pending', payment_reference TEXT, payment_submitted_at TEXT, paid_at TEXT, service_name TEXT NOT NULL DEFAULT '', project_status TEXT NOT NULL DEFAULT 'Payment Pending', project_updated_at TEXT)").run();
  for (const sql of [
    "ALTER TABLE quotes ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'Pending'",
    "ALTER TABLE quotes ADD COLUMN payment_reference TEXT",
    "ALTER TABLE quotes ADD COLUMN payment_submitted_at TEXT",
    "ALTER TABLE quotes ADD COLUMN paid_at TEXT",
    "ALTER TABLE quotes ADD COLUMN service_name TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE quotes ADD COLUMN project_status TEXT NOT NULL DEFAULT 'Payment Pending'",
    "ALTER TABLE quotes ADD COLUMN project_updated_at TEXT"
  ]) {
    try { await db.prepare(sql).run(); } catch (_) {}
  }
}

function cleanParam(v, max) {
  return String(v || "").trim().slice(0, max);
}
