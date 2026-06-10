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
let lastScrollY = window.scrollY;
let headerHovering = false;
const HEADER_HIDE_AFTER = 120;
const HEADER_SCROLL_DELTA = 8;

function updateHeader() {
  if (!header) return;
  const currentScrollY = Math.max(window.scrollY, 0);
  const scrollDelta = currentScrollY - lastScrollY;
  const mobileMenuOpen = mobileNav?.classList.contains('open');

  header.classList.toggle('scrolled', currentScrollY > 40);

  if (currentScrollY <= HEADER_HIDE_AFTER || mobileMenuOpen || headerHovering) {
    header.classList.remove('header-hidden');
  } else if (scrollDelta > HEADER_SCROLL_DELTA) {
    header.classList.add('header-hidden');
  } else if (scrollDelta < -HEADER_SCROLL_DELTA) {
    header.classList.remove('header-hidden');
  }

  lastScrollY = currentScrollY;
}

if (header) {
  header.addEventListener('mouseenter', () => {
    headerHovering = true;
    header.classList.add('header-visible');
  });
  header.addEventListener('mouseleave', () => {
    headerHovering = false;
    header.classList.remove('header-visible');
    updateHeader();
  });
}

window.addEventListener('scroll', updateHeader, { passive: true });

// ═══ HAMBURGER ═══
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileNav = document.getElementById('mobile-nav');
hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  header.classList.remove('header-hidden');
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

// ═══ OFFER CAROUSELS ═══
document.querySelectorAll('[data-offer-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.offer-carousel-track');
  const cards = Array.from(carousel.querySelectorAll('.offer-card'));
  const prev = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const current = carousel.querySelector('[data-carousel-current]');
  const total = carousel.querySelector('[data-carousel-total]');
  const dots = document.createElement('div');
  dots.className = 'slider-dots offer-slider-dots';
  cards.forEach((card, cardIndex) => {
    const dot = document.createElement('button');
    dot.className = `dot${cardIndex === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Pokaż produkt ${cardIndex + 1}`);
    dot.addEventListener('click', () => { index = cardIndex; updateCarousel(); });
    dots.appendChild(dot);
  });
  if (next) next.before(dots);
  let index = 0;

  function visibleCards() {
    return 1;
  }

  function updateCarousel() {
    const visible = visibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(index, maxIndex);
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === maxIndex;
    if (current) current.textContent = String(index + 1).padStart(2, '0');
    if (total) total.textContent = String(cards.length).padStart(2, '0');
    dots.querySelectorAll('.dot').forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  }

  if (prev) prev.addEventListener('click', () => { index -= 1; updateCarousel(); });
  if (next) next.addEventListener('click', () => { index += 1; updateCarousel(); });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && index > 0) { index -= 1; updateCarousel(); }
    if (event.key === 'ArrowRight' && index < cards.length - visibleCards()) { index += 1; updateCarousel(); }
  });
  carousel.setAttribute('tabindex', '0');
  window.addEventListener('resize', updateCarousel, { passive: true });
  updateCarousel();
});

// Build consistent description/specification tabs for every offer card.
document.querySelectorAll('.offer-card').forEach((card, index) => {
  const copy = card.querySelector('.offer-card-copy');
  const description = copy?.querySelector(':scope > p');
  const specs = copy?.querySelector(':scope > .offer-specs');
  const actions = copy?.querySelector(':scope > .offer-card-actions');
  if (!copy || !description || !specs || !actions) return;

  if (card.classList.contains('offer-card-set')) {
    specs.remove();
    description.classList.add('product-desc');
    return;
  }

  const descriptionId = `offer-description-${index + 1}`;
  const specsId = `offer-specs-${index + 1}`;
  const tabs = document.createElement('div');
  tabs.className = 'product-tabs offer-product-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Informacje o produkcie');
  tabs.innerHTML = `
    <button class="tab-btn active" data-tab="${descriptionId}" role="tab" aria-selected="true">Opis</button>
    <button class="tab-btn" data-tab="${specsId}" role="tab" aria-selected="false">Specyfikacja</button>
  `;

  const descriptionPanel = document.createElement('div');
  descriptionPanel.className = 'tab-panel active offer-tab-panel';
  descriptionPanel.id = descriptionId;
  description.classList.add('product-desc');
  descriptionPanel.appendChild(description);

  const specsPanel = document.createElement('div');
  specsPanel.className = 'tab-panel offer-tab-panel';
  specsPanel.id = specsId;
  specs.classList.add('offer-spec-grid');
  specsPanel.appendChild(specs);

  const compatibleControllers = card.dataset.compatibleControllers;
  let compatiblePanel = null;
  if (compatibleControllers) {
    const compatibleId = `offer-compatible-${index + 1}`;
    const compatibleButton = document.createElement('button');
    compatibleButton.className = 'tab-btn';
    compatibleButton.dataset.tab = compatibleId;
    compatibleButton.setAttribute('role', 'tab');
    compatibleButton.setAttribute('aria-selected', 'false');
    compatibleButton.textContent = 'Dopasowane centrale';
    tabs.appendChild(compatibleButton);

    compatiblePanel = document.createElement('div');
    compatiblePanel.className = 'tab-panel offer-tab-panel';
    compatiblePanel.id = compatibleId;
    const compatibleGrid = document.createElement('div');
    compatibleGrid.className = 'compatible-controllers';
    const controllerLinks = {
      QC40F: 'products/qc40f.html',
      QC600S: 'products/qc600s.html'
    };
    compatibleControllers.split(';').forEach(controller => {
      const [name, image] = controller.split(',');
      const item = document.createElement('a');
      item.className = 'compatible-controller';
      item.href = controllerLinks[name] || 'produkty.html#centrale';
      item.setAttribute('aria-label', `Zobacz centralę sterującą ${name}`);
      item.innerHTML = `
        <span class="compatible-controller-image"><img src="${image}" alt="" /></span>
        <strong>${name}</strong>
        <span class="compatible-controller-link">Zobacz</span>
      `;
      compatibleGrid.appendChild(item);
    });
    compatiblePanel.appendChild(compatibleGrid);
  }

  copy.insertBefore(tabs, actions);
  copy.insertBefore(descriptionPanel, actions);
  copy.insertBefore(specsPanel, actions);
  if (compatiblePanel) copy.insertBefore(compatiblePanel, actions);
});

// ═══ PRODUCT TABS ═══
document.querySelectorAll('.product-tabs').forEach(tabGroup => {
  const btns = tabGroup.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      const slide = btn.closest('.offer-card') || btn.closest('.product-slide') || btn.closest('.product-info-col');
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
