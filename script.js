document.addEventListener('DOMContentLoaded', function() {

// ── COUNTER ANIMASI DI HERO ──
const heroStats = document.querySelector('.hero-stats');

const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-target]').forEach(function(el) {
      const target = parseInt(el.getAttribute('data-target'));
      const step = target / 50;
      let current = 0;
      const interval = setInterval(function() {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + '+';
        if (current >= target) clearInterval(interval);
      }, 25);
    });
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

if (heroStats) counterObserver.observe(heroStats);

// ── DARK MODE TOGGLE ──
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

if (localStorage.getItem('darkMode') === 'true') {
  html.classList.add('dark');
  darkToggle.textContent = '☀️';
}

darkToggle.addEventListener('click', function() {
  html.classList.toggle('dark');
  const isDark = html.classList.contains('dark');
  darkToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
});

// ── ACTIVE LINK DI NAVBAR SAAT SCROLL ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', function() {
  let current = '';
  sections.forEach(function(sec) {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navLinks.forEach(function(link) {
    link.classList.remove('act');
    if (link.getAttribute('href') === '#' + current) link.classList.add('act');
  });
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hbg');
const mobileMenu = document.getElementById('mobm');

hamburger.addEventListener('click', function() {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() { mobileMenu.classList.remove('open'); });
});

// ── FILTER KATEGORI PRODUK ──
const catTabs = document.querySelectorAll('.cat-tab');
catTabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    catTabs.forEach(function(t) { t.classList.remove('on'); });
    tab.classList.add('on');
    const selectedCat = tab.getAttribute('data-cat');
    document.querySelectorAll('.prod-card').forEach(function(card) {
      if (selectedCat === 'all' || card.getAttribute('data-c') === selectedCat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── FORM KIRIM PESAN ──
document.getElementById('sendBtn').addEventListener('click', function() {
  const nama  = document.getElementById('f-nama').value.trim();
  const wa    = document.getElementById('f-wa').value.trim();
  const pesan = document.getElementById('f-msg').value.trim();

  if (!nama || !wa || !pesan) {
    alert('Mohon isi Nama, No. WhatsApp, dan Pesan terlebih dahulu.');
    return;
  }

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 4500);

  document.getElementById('f-nama').value = '';
  document.getElementById('f-wa').value   = '';
  document.getElementById('f-prod').value = '';
  document.getElementById('f-msg').value  = '';
});

}); // end DOMContentLoaded
