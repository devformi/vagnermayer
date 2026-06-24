const form = document.querySelector("[data-capture-form]");
const phoneInput = document.querySelector('input[name="whatsapp"]');
const statusEl = document.querySelector("[data-form-status]");
const modal = document.querySelector("[data-success-modal]");
const closeModal = document.querySelector("[data-close-modal]");

const formatBrazilPhone = (value) => {
  let digits = value.replace(/\D/g, "").slice(0, 13);

  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 11);
  const area = digits.slice(0, 2);
  const first = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
  const second = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);

  let output = area ? `(${area}` : "";
  if (area.length === 2) output += ") ";
  if (first) output += first;
  if (second) output += `-${second}`;

  return output;
};

phoneInput?.addEventListener("input", () => {
  phoneInput.value = formatBrazilPhone(phoneInput.value);
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton.textContent;
  const formData = new FormData(form);
  const phone = String(formData.get("whatsapp") || "").trim();
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    whatsapp: phone ? `55 ${phone}` : "",
    pais: "🇧🇷 Brasil",
    email: String(formData.get("email") || "").trim(),
    origem: document.body.dataset.origin || "lista-de-espera",
    pagina: window.location.href,
  };

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  statusEl.textContent = "Enviando seu cadastro...";
  statusEl.dataset.state = "loading";

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Lead request failed");

    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = submitLabel;
    statusEl.textContent = "";
    statusEl.dataset.state = "";
    modal.hidden = false;
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Tentar novamente";
    statusEl.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
    statusEl.dataset.state = "error";
  }
});

closeModal?.addEventListener("click", () => {
  modal.hidden = true;
});
