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
