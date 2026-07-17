const HOTMART_OFFER_CODE = "dvq3p234";
const HOTMART_CHECKOUT_URL = "https://pay.hotmart.com/N106233144K?off=dvq3p234";
let checkoutAudioContext;
let checkoutAudioEnabled = false;
let pendingCheckoutTone = null;

function unlockCheckoutAudio() {
  if (checkoutAudioEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  checkoutAudioContext = checkoutAudioContext || new AudioContext();
  checkoutAudioContext.resume().then(() => {
    checkoutAudioEnabled = true;
    if (pendingCheckoutTone) {
      const tone = pendingCheckoutTone;
      pendingCheckoutTone = null;
      playCheckoutTone(tone);
    }
  }).catch(() => {});
}

function playCheckoutTone(type = "toast") {
  if (!checkoutAudioEnabled || !checkoutAudioContext) {
    pendingCheckoutTone = type;
    return;
  }

  const now = checkoutAudioContext.currentTime;
  const gain = checkoutAudioContext.createGain();
  gain.connect(checkoutAudioContext.destination);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "exit" ? 0.065 : 0.04, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (type === "exit" ? 0.42 : 0.22));

  const notes = type === "exit" ? [392, 523.25] : [659.25, 783.99];
  notes.forEach((frequency, index) => {
    const oscillator = checkoutAudioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + index * 0.08);
    oscillator.connect(gain);
    oscillator.start(now + index * 0.08);
    oscillator.stop(now + index * 0.08 + (type === "exit" ? 0.32 : 0.15));
  });
}

["pointerdown", "keydown", "touchstart", "wheel", "scroll"].forEach((eventName) => {
  window.addEventListener(eventName, unlockCheckoutAudio, { once: true, passive: true });
});

function mountInlineCheckout() {
  const target = document.querySelector("#hotmart-inline-checkout");
  const fallback = document.querySelector(".checkout-direct-link");
  if (!target) return;

  const mount = () => {
    if (!window.checkoutElements || typeof window.checkoutElements.init !== "function") {
      target.innerHTML = '<div class="checkout-loading">Checkout seguro indisponível no preview local.</div>';
      if (fallback) fallback.classList.add("is-visible");
      return;
    }

    try {
      window.checkoutElements
        .init("inlineCheckout", {
          offer: HOTMART_OFFER_CODE,
          locale: "pt_BR"
        })
        .mount("#hotmart-inline-checkout");
    } catch (error) {
      target.innerHTML = '<div class="checkout-loading">Não foi possível carregar o checkout embutido agora.</div>';
      if (fallback) fallback.classList.add("is-visible");
    }
  };

  window.setTimeout(mount, 300);
}

function startCheckoutToasts() {
  const toast = document.querySelector(".checkout-page-toast");
  if (!toast) return;

  const events = [
    ["17 pessoas viram esta página nos últimos 21 minutos.", "Agora"],
    ["13 pessoas tomaram essa decisão nos últimos 39 minutos.", "Decisão"],
    ["24 pessoas viram esta página nos últimos 47 minutos.", "Agora"],
    ["16 pessoas tomaram essa decisão nos últimos 52 minutos.", "Decisão"],
    ["19 pessoas viram esta página nos últimos 18 minutos.", "Agora"],
    ["12 pessoas tomaram essa decisão nos últimos 34 minutos.", "Decisão"]
  ];
  let index = 0;
  let dismissedUntilNext = false;

  function render() {
    dismissedUntilNext = false;
    const [text, label] = events[index];
    toast.innerHTML = `<button class="checkout-toast-close" type="button" aria-label="Fechar aviso">×</button><strong>${label}</strong><span>${text}</span>`;
    const close = toast.querySelector(".checkout-toast-close");
    if (close) {
      close.addEventListener("click", () => {
        dismissedUntilNext = true;
        toast.classList.remove("is-visible");
      });
    }
    toast.classList.add("is-visible");
    playCheckoutTone("toast");
    index = (index + 1) % events.length;
    window.setTimeout(() => {
      if (!dismissedUntilNext) toast.classList.remove("is-visible");
    }, 4200);
  }

  window.setTimeout(() => {
    render();
    window.setInterval(render, 11200);
  }, 2600);
}

function startCheckoutCountdown() {
  const timeEl = document.querySelector("[data-checkout-countdown]");
  const progressEl = document.querySelector("[data-checkout-progress]");
  if (!timeEl || !progressEl) return;

  const totalSeconds = 15 * 60;
  const storageKey = "acervoCheckoutCountdownEndsAt";
  const now = Date.now();
  let endsAt = Number(window.localStorage.getItem(storageKey));

  if (!endsAt || Number.isNaN(endsAt) || endsAt <= now) {
    endsAt = now + totalSeconds * 1000;
    window.localStorage.setItem(storageKey, String(endsAt));
  }

  function render() {
    const currentTime = Date.now();
    let remaining = Math.max(Math.ceil((endsAt - currentTime) / 1000), 0);

    if (remaining <= 0) {
      endsAt = currentTime + totalSeconds * 1000;
      window.localStorage.setItem(storageKey, String(endsAt));
      remaining = totalSeconds;
    }

    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");
    timeEl.textContent = `${minutes}:${seconds}`;
    progressEl.style.transform = `scaleX(${remaining / totalSeconds})`;

    window.setTimeout(render, 1000);
  }

  render();
}

function startExitIntent() {
  const overlay = document.querySelector("[data-exit-overlay]");
  if (!overlay) return;

  const closeButtons = overlay.querySelectorAll("[data-exit-close], [data-exit-continue]");
  let hasShown = false;

  function showExit() {
    if (hasShown || window.innerWidth < 981) return;
    hasShown = true;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    playCheckoutTone("exit");
  }

  function hideExit() {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("mouseout", (event) => {
    if (event.clientY <= 6 && !event.relatedTarget) showExit();
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", hideExit);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) hideExit();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideExit();
  });
}

mountInlineCheckout();
startCheckoutToasts();
startCheckoutCountdown();
startExitIntent();

if (window.fbq) window.fbq("track", "InitiateCheckout");
