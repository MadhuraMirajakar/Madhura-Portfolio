// =============================================
//   MADHURA PRADEEP MIRAJAKAR — Portfolio JS v2
// =============================================

/* ---- PARTICLE CANVAS ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function random(min, max) { return Math.random() * (max - min) + min; }

  const COLORS = ['#C4622D', '#7C3AED', '#2563EB', '#0D9488', '#D97706'];

  function createParticle() {
    return {
      x: random(0, W), y: random(0, H),
      r: random(1.2, 3.2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: random(-0.3, 0.3), vy: random(-0.3, 0.3),
      alpha: random(0.15, 0.55)
    };
  }

  for (let i = 0; i < 70; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connecting lines
    ctx.globalAlpha = 0.07;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = '#C4622D';
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- DARK MODE TOGGLE ---- */
// Run immediately so theme applies before paint (no flash)
(function() {
  var saved = localStorage.getItem('portfolio-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark-mode');
  }
})();

// Wire button after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('themeToggle');
  if (!btn) { console.warn('themeToggle button not found'); return; }

  btn.addEventListener('click', function() {
    var html = document.documentElement;
    var isDark = html.classList.contains('dark-mode');
    if (isDark) {
      html.classList.remove('dark-mode');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      html.classList.add('dark-mode');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---- MOBILE NAV ---- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---- ACTIVE NAV HIGHLIGHT ---- */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a');
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObserver.observe(s));

/* ---- PROJECT ACCORDION ---- */
function toggleProject(header) {
  const card   = header.closest('.project-card');
  const isOpen = card.classList.contains('open');
  document.querySelectorAll('.project-card.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) {
    card.classList.add('open');
    setTimeout(() => {
      const top = card.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 100);
  }
}

/* ---- SCROLL REVEAL ---- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${i * 0.075}s`;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll([
  '.skill-card', '.contact-card', '.project-card',
  '.about-card', '.about-text', '.stat-item',
  '.info-card', '.reveal'
].join(',')).forEach(el => revealObs.observe(el));

/* ---- COUNT UP ANIMATION ---- */
const countObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 40);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => countObs.observe(el));

/* ---- PHOTO FALLBACK ---- */
window.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('profilePhoto');
  const ph  = document.getElementById('photoPlaceholder');
  if (img && img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    if (ph) ph.style.display = 'flex';
  }
});
