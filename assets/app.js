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

// Language Switcher Logic
const initLangSwitcher = () => {
  const langButtons = document.querySelectorAll('.lang-btn');
  if (!langButtons.length) return;

  const setLanguage = (lang) => {
    if (lang === 'es') {
      document.body.classList.add('lang-es');
    } else {
      document.body.classList.remove('lang-es');
    }
    localStorage.setItem('tenkai_lang', lang);
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langTarget === lang);
    });
  };

  const savedLang = localStorage.getItem('tenkai_lang') || 'en';
  setLanguage(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.langTarget;
      setLanguage(targetLang);
    });
  });
};

initLangSwitcher();



