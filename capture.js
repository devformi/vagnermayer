const form = document.querySelector("[data-capture-form]");
const phoneInput = document.querySelector('input[name="whatsapp"]');
const countrySelect = document.querySelector('select[name="pais"]');
const statusEl = document.querySelector("[data-form-status]");
const modal = document.querySelector("[data-success-modal]");
const closeModal = document.querySelector("[data-close-modal]");

const phoneCountries = [["AC","247",6],["AD","376",9],["AE","971",12],["AF","93",9],["AG","1",10],["AI","1",10],["AL","355",9],["AM","374",8],["AO","244",9],["AR","54",11],["AS","1",10],["AT","43",13],["AU","61",12],["AW","297",7],["AX","358",12],["AZ","994",9],["BA","387",9],["BB","1",10],["BD","880",10],["BE","32",9],["BF","226",8],["BG","359",12],["BH","973",8],["BI","257",8],["BJ","229",10],["BL","590",9],["BM","1",10],["BN","673",7],["BO","591",9],["BQ","599",7],["BR","55",11],["BS","1",10],["BT","975",8],["BW","267",10],["BY","375",11],["BZ","501",11],["CA","1",10],["CC","61",12],["CD","243",10],["CF","236",8],["CG","242",9],["CH","41",12],["CI","225",10],["CK","682",5],["CL","56",11],["CM","237",9],["CN","86",12],["CO","57",11],["CR","506",10],["CU","53",10],["CV","238",7],["CW","599",8],["CX","61",12],["CY","357",8],["CZ","420",12],["DE","49",15],["DJ","253",8],["DK","45",8],["DM","1",10],["DO","1",10],["DZ","213",9],["EC","593",11],["EE","372",10],["EG","20",10],["EH","212",9],["ER","291",7],["ES","34",9],["ET","251",9],["FI","358",12],["FJ","679",11],["FK","500",5],["FM","691",7],["FO","298",6],["FR","33",9],["GA","241",8],["GB","44",10],["GD","1",10],["GE","995",9],["GF","594",9],["GG","44",10],["GH","233",9],["GI","350",8],["GL","299",6],["GM","220",7],["GN","224",9],["GP","590",9],["GQ","240",9],["GR","30",12],["GT","502",11],["GU","1",10],["GW","245",9],["GY","592",7],["HK","852",11],["HN","504",11],["HR","385",9],["HT","509",8],["HU","36",9],["ID","62",17],["IE","353",10],["IL","972",12],["IM","44",10],["IN","91",13],["IO","246",7],["IQ","964",10],["IR","98",10],["IS","354",9],["IT","39",12],["JE","44",10],["JM","1",10],["JO","962",9],["JP","81",17],["KE","254",10],["KG","996",10],["KH","855",10],["KI","686",8],["KM","269",7],["KN","1",10],["KP","850",10],["KR","82",14],["KW","965",8],["KY","1",10],["KZ","7",14],["LA","856",10],["LB","961",8],["LC","1",10],["LI","423",9],["LK","94",9],["LR","231",9],["LS","266",8],["LT","370",8],["LU","352",11],["LV","371",8],["LY","218",9],["MA","212",9],["MC","377",9],["MD","373",8],["ME","382",9],["MF","590",9],["MG","261",9],["MH","692",7],["MK","389",8],["ML","223",8],["MM","95",10],["MN","976",10],["MO","853",8],["MP","1",10],["MQ","596",9],["MR","222",8],["MS","1",10],["MT","356",8],["MU","230",10],["MV","960",10],["MW","265",9],["MX","52",10],["MY","60",10],["MZ","258",9],["NA","264",9],["NC","687",6],["NE","227",8],["NF","672",6],["NG","234",14],["NI","505",8],["NL","31",11],["NO","47",8],["NP","977",11],["NR","674",7],["NU","683",7],["NZ","64",10],["OM","968",9],["PA","507",11],["PE","51",9],["PF","689",9],["PG","675",8],["PH","63",13],["PK","92",12],["PL","48",10],["PM","508",9],["PR","1",10],["PS","970",10],["PT","351",9],["PW","680",7],["PY","595",11],["QA","974",11],["RE","262",9],["RO","40",9],["RS","381",12],["RU","7",14],["RW","250",9],["SA","966",10],["SB","677",7],["SC","248",7],["SD","249",9],["SE","46",12],["SG","65",11],["SH","290",5],["SI","386",8],["SJ","47",8],["SK","421",9],["SL","232",8],["SM","378",10],["SN","221",9],["SO","252",9],["SR","597",7],["SS","211",9],["ST","239",7],["SV","503",11],["SX","1",10],["SY","963",9],["SZ","268",9],["TA","290",4],["TC","1",10],["TD","235",8],["TG","228",8],["TH","66",13],["TJ","992",9],["TK","690",7],["TL","670",8],["TM","993",8],["TN","216",8],["TO","676",7],["TR","90",13],["TT","1",10],["TV","688",7],["TW","886",11],["TZ","255",9],["UA","380",10],["UG","256",9],["US","1",10],["UY","598",13],["UZ","998",9],["VA","39",12],["VC","1",10],["VE","58",10],["VG","1",10],["VI","1",10],["VN","84",10],["VU","678",7],["WF","681",9],["WS","685",10],["XK","383",12],["YE","967",9],["YT","262",9],["ZA","27",10],["ZM","260",9],["ZW","263",10]];
const phoneMasks = Object.fromEntries(
  phoneCountries.map(([iso, ddi, max]) => [iso, { ddi, max: Math.min(max, 15), placeholder: "Telefone local", group: [3, 3, 3, 3, 3] }])
);

phoneMasks.BR = {
  ...phoneMasks.BR,
  placeholder: "(11) 99999-9999",
  format: (digits) => {
    const area = digits.slice(0, 2);
    const first = digits.length > 10 ? digits.slice(2, 7) : digits.slice(2, 6);
    const second = digits.length > 10 ? digits.slice(7, 11) : digits.slice(6, 10);
    let value = area ? `(${area}` : "";
    if (area.length === 2) value += ") ";
    if (first) value += first;
    if (second) value += `-${second}`;
    return value;
  },
};
phoneMasks.US = {
  ...phoneMasks.US,
  placeholder: "(555) 555-5555",
  format: (digits) => {
    const area = digits.slice(0, 3);
    const first = digits.slice(3, 6);
    const second = digits.slice(6, 10);
    let value = area ? `(${area}` : "";
    if (area.length === 3) value += ") ";
    if (first) value += first;
    if (second) value += `-${second}`;
    return value;
  },
};

const regionNames = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["pt-BR"], { type: "region" })
  : null;

const getCountryName = (iso) => {
  try {
    return regionNames?.of(iso) || iso;
  } catch (error) {
    return iso;
  }
};

const getCountryFlag = (iso) => iso
  .replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)));

const populateCountrySelect = () => {
  if (!countrySelect) return;
  const sortedCountries = phoneCountries
    .map(([iso, ddi]) => ({ iso, ddi, name: getCountryName(iso) }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  countrySelect.innerHTML = sortedCountries
    .map(({ iso, ddi, name }) => {
      const selected = iso === "BR" ? " selected" : "";
      return `<option value="${iso}"${selected}>${getCountryFlag(iso)} ${name} +${ddi}</option>`;
    })
    .join("");
};

const groupPhone = (digits, groups) => {
  let cursor = 0;
  return groups
    .map((size) => {
      const chunk = digits.slice(cursor, cursor + size);
      cursor += size;
      return chunk;
    })
    .filter(Boolean)
    .join(" ");
};

const getPhoneConfig = () => phoneMasks[countrySelect?.value || "BR"] || phoneMasks.BR;

const applyPhoneMask = () => {
  if (!phoneInput) return;
  const config = getPhoneConfig();
  const digits = phoneInput.value.replace(/\D/g, "").slice(0, config.max);
  phoneInput.placeholder = config.placeholder;
  phoneInput.value = config.format ? config.format(digits) : groupPhone(digits, config.group);
};

const getPhoneWithDdi = () => {
  const config = getPhoneConfig();
  const localPhone = phoneInput.value.trim();
  const digits = localPhone.replace(/\D/g, "");
  if (!digits) return "";
  return `${config.ddi} ${localPhone}`;
};

const getSelectedCountryLabel = () => {
  const option = countrySelect?.selectedOptions?.[0];
  return option ? option.textContent.replace(/\s\+\d+$/, "").trim() : "🇧🇷 Brasil";
};

populateCountrySelect();
phoneInput?.addEventListener("input", applyPhoneMask);
countrySelect?.addEventListener("change", () => {
  phoneInput.value = "";
  applyPhoneMask();
});
applyPhoneMask();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton.textContent;
  const formData = new FormData(form);
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    whatsapp: getPhoneWithDdi(),
    pais: getSelectedCountryLabel(),
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
    populateCountrySelect();
    applyPhoneMask();
    submitButton.disabled = false;
    submitButton.textContent = submitLabel;
    statusEl.textContent = "";
    statusEl.dataset.state = "";
    window.dispatchEvent(new CustomEvent("leadSubmitted", { detail: payload }));
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
