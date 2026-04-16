/**
 * GAPOSA POLSKA — Main JavaScript
 * Polish Distributor of Gaposa Italiana
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──────────────────────────────────
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('navbar--solid');
      navbar.classList.remove('navbar--transparent');
    } else {
      navbar.classList.remove('navbar--solid');
      navbar.classList.add('navbar--transparent');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ── Mobile nav ───────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-close');

  const openMobileNav = () => {
    mobileNav.classList.add('mobile-nav--open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove('mobile-nav--open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

  // close on backdrop click
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  // ── Scroll reveal ────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Animated counters ────────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── Contact form ─────────────────────────────────────────────
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span style="opacity:0.7">Wysyłanie…</span>';

      // Simulate send (replace with real endpoint later)
      await new Promise(r => setTimeout(r, 1400));

      submitBtn.innerHTML = '✓ Wiadomość wysłana!';
      submitBtn.style.background = '#2a9d8f';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  // ── Active nav link highlighting (for single page) ───────────
  const navLinks = document.querySelectorAll('.navbar__menu a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.navbar__menu a[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ── Hero parallax (subtle) ───────────────────────────────────
  const heroBg = document.querySelector('.hero__bg');

  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${y * 0.2}px)`;
      }
    }, { passive: true });
  }

  // ── Smooth scrolling for anchor links ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        closeMobileNav && closeMobileNav();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
