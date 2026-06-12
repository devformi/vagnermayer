const required = ["nome", "whatsapp", "email"];

const normalizePhoneForSheet = (value) => String(value || "").trim().replace(/^\+/, "");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return response.status(500).json({ ok: false, message: "Lead webhook is not configured." });
  }

  let lead = request.body || {};

  if (typeof lead === "string") {
    try {
      lead = JSON.parse(lead || "{}");
    } catch (error) {
      return response.status(400).json({ ok: false });
    }
  }
  const missing = required.filter((field) => !String(lead[field] || "").trim());

  if (missing.length) {
    return response.status(400).json({ ok: false, missing });
  }

  const payload = {
    data: new Date().toISOString(),
    nome: String(lead.nome).trim(),
    whatsapp: normalizePhoneForSheet(lead.whatsapp),
    pais: String(lead.pais || "").trim(),
    email: String(lead.email).trim(),
    origem: String(lead.origem || "pre-cadastro").trim(),
    pagina: String(lead.pagina || "").trim(),
  };

  const sheetResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!sheetResponse.ok) {
    return response.status(502).json({ ok: false });
  }

  return response.status(200).json({ ok: true });
};
