function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = Math.floor(ease * target);
    el.textContent = prefix + val.toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
