// Navigation Menu (Header) NAVBAR TOGGLE
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.main-nav a');

navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
  siteHeader.classList.toggle('menu-open');
  navToggle.classList.toggle('open'); // <— NEW: animates to “X”

  if (mainNav.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
});

// Close nav if clicking a link that stays on same page
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        mainNav.classList.toggle('open');
        navToggle.classList.toggle('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Smooth NavBar shadow animation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  });
