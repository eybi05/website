const root = document.documentElement;
const btn = document.getElementById('themeToggle');
const icon = btn?.querySelector('.btn-theme__icon');

const stored = localStorage.getItem('ico-theme');
if (stored) root.setAttribute('data-theme', stored);

function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('ico-theme', t);
  if (icon) icon.textContent = t === 'dark' ? '☀' : '☾';
}

// Init icon
const current = root.getAttribute('data-theme') || 'dark';
if (icon) icon.textContent = current === 'dark' ? '☀' : '☾';

btn?.addEventListener('click', () => {
  const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(t);
});
