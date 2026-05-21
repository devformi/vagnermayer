const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("in");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
