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

const videoCarousels = new Map();

document.querySelectorAll(".video-testimonials").forEach(carousel => {
  const cards = Array.from(carousel.querySelectorAll(".video-card"));
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

  videoCarousels.set(carousel, moveVideoCards);
  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("is-next")) moveVideoCards(1);
      if (card.classList.contains("is-prev")) moveVideoCards(-1);
    });
  });
  renderVideoCards();
});

window.moveVideoTestimonial = (button, direction) => {
  const carousel = button.closest(".video-testimonials");
  const moveVideoCards = videoCarousels.get(carousel);
  if (moveVideoCards) moveVideoCards(direction);
};
