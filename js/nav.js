const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

burger?.addEventListener('click', () => {
  links?.classList.toggle('open');
});
