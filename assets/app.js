const header = document.querySelector('.site-header');
const button = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');

const closeMenu = () => {
  nav.classList.remove('open');
  button.setAttribute('aria-expanded', 'false');
};

button.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  button.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), { passive: true });


