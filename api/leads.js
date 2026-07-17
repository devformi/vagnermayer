const required = ["nome", "whatsapp", "email"];
const crypto = require("crypto");

const normalizePhoneForSheet = (value) => String(value || "").trim().replace(/^\+/, "");
const normalizeForHash = (value) => String(value || "").trim().toLowerCase();
const normalizePhoneForHash = (value) => String(value || "").replace(/\D/g, "");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const getIp = (request) => {
  const forwardedFor = request.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.socket?.remoteAddress || "";
};

const sendMetaLeadEvent = async (request, payload) => {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) return;

  const email = normalizeForHash(payload.email);
  const phone = normalizePhoneForHash(payload.whatsapp);
  const userData = {
    client_ip_address: getIp(request),
    client_user_agent: request.headers["user-agent"] || "",
  };

  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];

  try {
    await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: payload.pagina,
            user_data: userData,
            custom_data: {
              content_name: payload.origem,
            },
          },
        ],
      }),
    });
  } catch (error) {
    console.error("Meta Lead event failed", error);
  }
};

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

  await sendMetaLeadEvent(request, payload);

  return response.status(200).json({ ok: true });
};
