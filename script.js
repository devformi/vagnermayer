const observer = new IntersectionObserver((entries, activeObserver) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("in");
    activeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 45}ms`);
  observer.observe(el);
});

const tapes = document.querySelector(".page-tapes");
let tapeTicking = false;

function updateTapes() {
  if (!tapes) return;
  const rect = tapes.getBoundingClientRect();
  const progress = window.scrollY + rect.top;
  const shift = (window.scrollY - progress) * 0.12;
  tapes.style.setProperty("--tape-top-shift", `${shift}px`);
  tapes.style.setProperty("--tape-bottom-shift", `${-shift}px`);
  tapeTicking = false;
}

function requestTapeUpdate() {
  if (tapeTicking) return;
  tapeTicking = true;
  requestAnimationFrame(updateTapes);
}

window.addEventListener("scroll", requestTapeUpdate, { passive: true });
window.addEventListener("resize", requestTapeUpdate);
requestTapeUpdate();

document.querySelectorAll(".video-testimonials").forEach(carousel => {
  const cards = Array.from(carousel.querySelectorAll(".video-card"));
  const prevButton = carousel.querySelector("[data-video-prev]");
  const nextButton = carousel.querySelector("[data-video-next]");
  let activeIndex = cards.findIndex(card => card.classList.contains("is-active"));
  if (activeIndex < 0) activeIndex = 0;

  function renderVideoCards() {
    cards.forEach((card, index) => {
      const video = card.querySelector("video");
      if (video && index !== activeIndex) video.pause();
      card.classList.remove("is-active", "is-prev", "is-next");
      if (index === activeIndex) card.classList.add("is-active");
      if (index === (activeIndex + 1) % cards.length) card.classList.add("is-next");
      if (index === (activeIndex - 1 + cards.length) % cards.length) card.classList.add("is-prev");
    });
  }

  function moveVideoCards(direction) {
    activeIndex = (activeIndex + direction + cards.length) % cards.length;
    renderVideoCards();
  }

  prevButton?.addEventListener("click", () => moveVideoCards(-1));
  nextButton?.addEventListener("click", () => moveVideoCards(1));
  renderVideoCards();
});
