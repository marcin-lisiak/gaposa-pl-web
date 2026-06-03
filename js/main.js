// ═══ HERO SLIDER ═══
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrevBtn = document.getElementById('hero-prev');
const heroNextBtn = document.getElementById('hero-next');
const heroProgressFill = document.getElementById('hero-progress-fill');
const heroCurrentLabel = document.getElementById('hero-slide-current');
let heroIndex = 0;
let heroInterval = null;
const HERO_DELAY = 6000;

function heroGoTo(index) {
  heroSlides[heroIndex].classList.remove('active');
  heroIndex = ((index % heroSlides.length) + heroSlides.length) % heroSlides.length;
  heroSlides[heroIndex].classList.add('active');
  heroDots.forEach((d, i) => d.classList.toggle('active', i === heroIndex));
  if (heroCurrentLabel) heroCurrentLabel.textContent = String(heroIndex + 1).padStart(2, '0');
  resetHeroProgress();
}

function resetHeroProgress() {
  if (!heroProgressFill) return;
  heroProgressFill.style.transition = 'none';
  heroProgressFill.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroProgressFill.style.transition = `width ${HERO_DELAY}ms linear`;
      heroProgressFill.style.width = '100%';
    });
  });
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroInterval = setInterval(() => heroGoTo(heroIndex + 1), HERO_DELAY);
  resetHeroProgress();
}

function stopHeroAutoPlay() {
  clearInterval(heroInterval);
  heroInterval = null;
  if (heroProgressFill) {
    heroProgressFill.style.transition = 'none';
    heroProgressFill.style.width = '0%';
  }
}

// Navigation
if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => { heroGoTo(heroIndex - 1); startHeroAutoPlay(); });
if (heroNextBtn) heroNextBtn.addEventListener('click', () => { heroGoTo(heroIndex + 1); startHeroAutoPlay(); });
heroDots.forEach(dot => dot.addEventListener('click', () => { heroGoTo(Number(dot.dataset.slide)); startHeroAutoPlay(); }));

// Pause on hover
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mouseenter', stopHeroAutoPlay);
  heroSection.addEventListener('mouseleave', startHeroAutoPlay);
}

// Keyboard navigation
if (heroSection) {
  heroSection.setAttribute('tabindex', '0');
  heroSection.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { heroGoTo(heroIndex - 1); startHeroAutoPlay(); }
    if (e.key === 'ArrowRight') { heroGoTo(heroIndex + 1); startHeroAutoPlay(); }
  });
}

// Start auto-play
if (heroSlides.length > 1) startHeroAutoPlay();



// ═══ HEADER SCROLL ═══
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ═══ HAMBURGER ═══
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburgerBtn.classList.toggle('open', isOpen);
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
});
mobileNav.querySelectorAll('a, .btn').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });
});

// ═══ PRODUCT SLIDER ═══
const slides = document.querySelectorAll('.product-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const currentLabel = document.getElementById('slide-current');
const totalLabel = document.getElementById('slide-total');
let currentIndex = 0;
const total = slides.length;
if (totalLabel) totalLabel.textContent = String(total).padStart(2, '0');

function goToSlide(index) {
  const prev = currentIndex;
  slides[prev].classList.add('exit-left');
  slides[prev].classList.remove('active');
  currentIndex = index;
  slides[currentIndex].classList.remove('exit-left');
  slides[currentIndex].classList.add('active');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
    d.setAttribute('aria-selected', String(i === currentIndex));
  });
  if (prevBtn) prevBtn.disabled = currentIndex === 0;
  if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
  if (currentLabel) currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
  setTimeout(() => slides[prev].classList.remove('exit-left'), 500);
}
if (slides[0]) slides[0].classList.add('active');
if (prevBtn) prevBtn.disabled = true;
if (nextBtn && total <= 1) nextBtn.disabled = true;
if (prevBtn) prevBtn.addEventListener('click', () => { if (currentIndex > 0) goToSlide(currentIndex - 1); });
if (nextBtn) nextBtn.addEventListener('click', () => { if (currentIndex < total - 1) goToSlide(currentIndex + 1); });
dots.forEach(dot => dot.addEventListener('click', () => goToSlide(Number(dot.dataset.index))));

const sliderEl = document.getElementById('product-slider');
if (sliderEl) {
  sliderEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && currentIndex > 0) goToSlide(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < total - 1) goToSlide(currentIndex + 1);
  });
}

// ═══ PRODUCT TABS ═══
document.querySelectorAll('.product-tabs').forEach(tabGroup => {
  const btns = tabGroup.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      const slide = btn.closest('.product-slide') || btn.closest('.product-info-col');
      const allPanels = (slide || document).querySelectorAll('.tab-panel');
      const allBtns = tabGroup.querySelectorAll('.tab-btn');
      allBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      allPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
});

// ═══ KONFIGURATOR ═══
const products = {
  garażowa: { 
    maly: { name:'BBS 100TKF 1', desc:'Idealny siłownik do małych i średnich bram garażowych w domach jednorodzinnych.', specs:['100 Nm','230V AC','IP44','Precyzja'], match:95 },
    sredni: { name:'BBS 100TKF 1 + Centrala', desc:'Zestaw do większych bram garażowych z zaawansowanym sterowaniem.', specs:['100 Nm','Centrala','Safe-Link'], match:92 },
    duzy: { name:'BBS 100TKF 1 Premium', desc:'Najmocniejszy zestaw do bram rezydencjalnych o dużej wadze.', specs:['120 Nm','Centrala','Soft-Start'], match:88 } 
  },
  przemysłowa: { 
    maly: { name:'BBS 100TKF 1', desc:'Idealny siłownik do standardowych bram segmentowych w magazynach.', specs:['100 Nm','400V AC','IP54','400 kg'], match:95 },
    sredni: { name:'BBS 100TKF 1 + QC40F', desc:'Kompletny zestaw napędowy do bram szybkobieżnych w halach produkcyjnych.', specs:['100 Nm','Centrala QC40F','IP54','21 obr/min'], match:94 },
    duzy: { name:'BBS 100TKF Industrial Plus', desc:'System napędowy do najcięższych bram przemysłowych i przeładunkowych.', specs:['400V AC','Praca ciągła','IP54','400 kg'], match:97 } 
  },
  automatyka: { 
    maly: { name:'Centrala QC40F Basic', desc:'Podstawowy moduł sterujący do napędów 3-fazowych.', specs:['400V AC','IP54'], match:93 },
    sredni: { name:'Centrala QC40F Pro', desc:'Zaawansowana centrala sterująca z obsługą zabezpieczeń OSE/8k2.', specs:['3~ 400V','IP54','Safe-Link'], match:96 },
    duzy: { name:'Zestaw QC40F Multi', desc:'Zintegrowane sterowanie wieloma bramami z obsługą semaforów.', specs:['400V AC','Obsługa śluz','IP54'], match:98 } 
  }
};

let selectedType = null;
let selectedSize = null;

const configTypeEl = document.getElementById('config-type');
const configSizeEl = document.getElementById('config-size');
const configStep2Label = document.getElementById('config-step2-label');
const configResultEl = document.getElementById('config-result');
const configEmpty = document.getElementById('config-empty');
const configOutput = document.getElementById('config-output');

function showResult() {
  if (!selectedType || !selectedSize) return;
  const p = products[selectedType]?.[selectedSize];
  if (!p) return;
  document.getElementById('cr-name').textContent = p.name;
  document.getElementById('cr-desc').textContent = p.desc;
  const chips = document.getElementById('cr-chips');
  chips.innerHTML = p.specs.map(s => `<span class="config-chip">${s}</span>`).join('');
  configEmpty.style.display = 'none';
  configOutput.style.display = 'block';
  configResultEl.classList.add('has-result');
  // Animate match bar
  const fill = document.getElementById('cr-match');
  fill.style.width = '0%';
  setTimeout(() => { fill.style.width = p.match + '%'; }, 50);
}

if (configTypeEl) {
  configTypeEl.querySelectorAll('.config-option').forEach(btn => {
    btn.addEventListener('click', () => {
      configTypeEl.querySelectorAll('.config-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.dataset.type;
      selectedSize = null;
      configSizeEl.querySelectorAll('.config-option').forEach(b => b.classList.remove('selected'));
      configSizeEl.style.opacity = '1';
      configSizeEl.style.pointerEvents = 'auto';
      configStep2Label.style.opacity = '1';
      configOutput.style.display = 'none';
      configEmpty.style.display = 'block';
      configResultEl.classList.remove('has-result');
    });
  });
}

if (configSizeEl) {
  configSizeEl.querySelectorAll('.config-option').forEach(btn => {
    btn.addEventListener('click', () => {
      configSizeEl.querySelectorAll('.config-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
      showResult();
    });
  });
}

// ═══ SCROLL REVEAL ═══
const revealEls = document.querySelectorAll('.reveal:not(.hero .reveal)');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ═══ CONTACT FORM ═══
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('contact-submit');
    btn.textContent = 'Wysłano ✓';
    btn.disabled = true;
    btn.style.background = '#2d8a4e';
    btn.style.borderColor = '#2d8a4e';
    setTimeout(() => {
      btn.textContent = 'Wyślij zapytanie';
      btn.disabled = false;
      btn.style.background = '';
      btn.style.borderColor = '';
      contactForm.reset();
    }, 3500);
  });
}
