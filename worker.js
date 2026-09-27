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

    return env.ASSETS.fetch(request);
  }
};
