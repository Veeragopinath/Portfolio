// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  gsap.from('header', { duration: 1, y: '-100%', ease: 'bounce' });
  gsap.from('.profile-pic', { duration: 1.5, opacity: 0, scale: 0.5, ease: 'elastic' });
  gsap.from('h1', { duration: 1, opacity: 0, y: -50, delay: 1 });
  gsap.from('h2, h3', { duration: 1, opacity: 0, x: -50, delay: 1.5, stagger: 0.3 });
  gsap.from('p, ul', { duration: 1, opacity: 0, x: 50, delay: 2, stagger: 0.3 });
});
