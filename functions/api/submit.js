export async function onRequestPost(context) {
  const form = await context.request.formData();
  const clean = (v, max) => String(v || "").trim().slice(0, max);

  const name = clean(form.get("name"), 120);
  const email = clean(form.get("email"), 160).toLowerCase();
  const phone = clean(form.get("phone"), 30);
  const service = clean(form.get("service"), 80);
  const budget = clean(form.get("budget"), 80);
  const contactPreference = clean(form.get("contactPreference"), 40);
  const message = clean(form.get("message"), 4000);

  if (!name || !email || !phone || !service || !budget || !contactPreference || !message) {
    return Response.json({ success: false, message: "Please complete all required fields." }, { status: 400 });
  }

  if (!context.env.VAROMA_DB) {
    return Response.json({ success: false, message: "Lead database is not connected yet." }, { status: 503 });
  }

  await context.env.VAROMA_DB.prepare(
    "CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, service TEXT NOT NULL, budget TEXT NOT NULL, contact_preference TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'New Lead', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"
  ).run();

  const result = await context.env.VAROMA_DB.prepare(
    "INSERT INTO leads (name, email, phone, service, budget, contact_preference, message) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(name, email, phone, service, budget, contactPreference, message).run();

  return Response.json({
    success: true,
    leadId: result.meta?.last_row_id ?? null,
    message: "Thank you! Your inquiry has been received."
  });
}
