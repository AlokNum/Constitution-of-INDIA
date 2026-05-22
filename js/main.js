/**
 * Samvidhan — Core Interactions
 * Improvements: proper mobile nav, scroll reveal, slider auto-rotate, smooth UX
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll behaviour ─────────────────────────────────────────── */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('header-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile navigation ──────────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  const openNav  = () => {
    navToggle.classList.add('active');
    navMenu.classList.add('open');
    navMenu.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');
    navMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (navToggle && navMenu) {
    navToggle.setAttribute('aria-label', 'Toggle navigation');
    navToggle.setAttribute('aria-controls', 'nav-menu');
    navMenu.setAttribute('aria-expanded', 'false');

    navToggle.addEventListener('click', () => {
      navMenu.classList.contains('open') ? closeNav() : openNav();
    });

    // Close on any nav link click
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    // Close on overlay click outside menu
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeNav();
    });

    // Close mobile nav when viewport widens past breakpoint
    const mq = window.matchMedia('(min-width: 861px)');
    mq.addEventListener('change', e => { if (e.matches) closeNav(); });
  }

  /* ── Screenshot Showcase Slider ─────────────────────────────────────── */
  const tabs   = Array.from(document.querySelectorAll('.control-tab'));
  const slides = Array.from(document.querySelectorAll('.screenshot-slide'));
  let current = 0;
  let timer   = null;
  const DELAY = 5000;

  const showSlide = idx => {
    if (idx < 0 || idx >= slides.length) return;
    tabs[current]?.classList.remove('active');
    slides[current]?.classList.remove('active');
    current = idx;
    tabs[current]?.classList.add('active');
    slides[current]?.classList.add('active');
  };

  const next = () => showSlide((current + 1) % slides.length);

  const startAuto = () => { stopAuto(); timer = setInterval(next, DELAY); };
  const stopAuto  = () => { if (timer) { clearInterval(timer); timer = null; } };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      showSlide(i);
      stopAuto();
      startAuto(); // reset timer
    });
  });

  if (slides.length) { showSlide(0); startAuto(); }

  // Pause on hover
  const sliderEl = document.querySelector('.showcase-slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', stopAuto);
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  /* ── Scroll Reveal ──────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback — just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Animated stat counters ─────────────────────────────────────────── */
  const statEls = document.querySelectorAll('.stat-item h3[data-target]');
  if ('IntersectionObserver' in window && statEls.length) {
    const countUp = (el) => {
      const target = +el.dataset.target;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => io.observe(el));
  }

  /* ── Staggered feature card reveal ─────────────────────────────────── */
  const featureCards = document.querySelectorAll('.feature-card');
  if ('IntersectionObserver' in window && featureCards.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(featureCards).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    featureCards.forEach(card => {
      card.classList.add('reveal');
      io.observe(card);
    });
  }

  /* ── Active nav highlight on scroll ────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (sections.length && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          active?.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

});
