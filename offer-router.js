const ACERVO_OFFERS = {
  base: {
    key: "base",
    label: "Condição especial do acervo",
    shortLabel: "Condição especial",
    price: "R$697",
    cash: "ou R$697 à vista",
    oldPrice: "",
    badge: "",
    offerCode: "",
    checkoutUrl: "https://pay.hotmart.com/N106233144K?bid=1784322765550"
  },
  "pos-lancamento": {
    key: "pos-lancamento",
    aliases: ["pos", "lancamento", "promo", "dvq3p234"],
    label: "Promoção pós lançamento",
    shortLabel: "Promoção pós lançamento",
    price: "R$597",
    cash: "R$597 à vista",
    oldPrice: "De R$697 à vista",
    badge: "tempo limitado",
    offerCode: "dvq3p234",
    checkoutUrl: "https://pay.hotmart.com/N106233144K?off=dvq3p234&bid=1784322792263"
  },
  equiti: {
    key: "equiti",
    aliases: ["parceria-equiti", "parceria", "jbc0cb5i"],
    label: "Parceria Equiti",
    shortLabel: "Parceria Equiti",
    price: "R$397",
    cash: "R$397 à vista",
    oldPrice: "De R$697 à vista",
    badge: "condição de parceria",
    offerCode: "jbc0cb5i",
    checkoutUrl: "https://pay.hotmart.com/N106233144K?off=jbc0cb5i&bid=1784322747150"
  },
  "ex-alunos": {
    key: "ex-alunos",
    aliases: ["ex-aluno", "exalunos", "alunos", "0y5lwd6u"],
    label: "Promoção para ex-alunos",
    shortLabel: "Promoção para ex-alunos",
    price: "R$497",
    cash: "R$497 à vista",
    oldPrice: "De R$697 à vista",
    badge: "condição para ex-alunos",
    offerCode: "0y5lwd6u",
    checkoutUrl: "https://pay.hotmart.com/N106233144K?off=0y5lwd6u&bid=1784322823950"
  }
};

function resolveAcervoOffer() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get("oferta") || params.get("offer") || params.get("plano") || params.get("off") || "").trim().toLowerCase();

  if (!raw) return ACERVO_OFFERS.base;

  const direct = ACERVO_OFFERS[raw];
  if (direct) return direct;

  return Object.values(ACERVO_OFFERS).find((offer) => offer.aliases && offer.aliases.includes(raw)) || ACERVO_OFFERS.base;
}

function buildCheckoutHref(offer) {
  return offer.key === "base" ? "checkout-acervo.html" : `checkout-acervo.html?oferta=${encodeURIComponent(offer.key)}`;
}

function applyAcervoOffer() {
  const offer = resolveAcervoOffer();
  window.AcervoOffer = offer;

  document.querySelectorAll("a[href^='checkout-acervo']").forEach((link) => {
    link.setAttribute("href", buildCheckoutHref(offer));
  });

  document.querySelectorAll("[data-offer-label]").forEach((element) => {
    element.textContent = element.dataset.offerLabel === "short" ? offer.shortLabel : offer.label;
  });

  document.querySelectorAll("[data-offer-price]").forEach((element) => {
    element.textContent = offer.price;
  });

  document.querySelectorAll("[data-offer-cash]").forEach((element) => {
    element.textContent = offer.cash;
  });

  document.querySelectorAll("[data-offer-old-price]").forEach((element) => {
    element.textContent = offer.oldPrice;
    element.hidden = !offer.oldPrice;
  });

  document.querySelectorAll("[data-offer-badge]").forEach((element) => {
    element.textContent = offer.badge;
    element.hidden = !offer.badge;
  });

  const fallback = document.querySelector(".checkout-direct-link");
  if (fallback) fallback.setAttribute("href", offer.checkoutUrl);
}

applyAcervoOffer();
