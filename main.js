// ===== LOADER =====
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
  loaderFill.style.width = progress + '%';
}, 80);

// ===== CURSOR (desktop only) =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX - 3 + 'px';
  cursorDot.style.top = mouseY - 3 + 'px';
});
function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX - 18 + 'px';
  cursor.style.top = curY - 18 + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .car-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  menuBtn.classList.toggle('open', menuOpen);
  mobileOverlay.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

function closeMenu() {
  menuOpen = false;
  menuBtn.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobileOverlay.addEventListener('click', (e) => {
  if (e.target === mobileOverlay) closeMenu();
});

// ===== LAZY LOAD IMAGES =====
const lazyImgs = document.querySelectorAll('img.lazy');
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.onload = () => img.classList.add('loaded');
      img.onerror = () => {
        img.style.display = 'none';
        const wrap = img.parentElement;
        if (!wrap.querySelector('.img-fallback')) {
          const fb = document.createElement('div');
          fb.className = 'img-fallback';
          fb.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#12121e,#1a1a30);color:#8888a8;font-size:12px;letter-spacing:3px;font-family:Playfair Display,serif;font-weight:700;';
          fb.textContent = 'BMW';
          wrap.appendChild(fb);
        }
      };
      imgObserver.unobserve(img);
    }
  });
}, { rootMargin: '200px' });

lazyImgs.forEach(img => imgObserver.observe(img));

// ===== FILTER CARS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const carCards = document.querySelectorAll('.car-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    carCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.section-header, .car-card, .testi-card, .about-text, .about-visual, .contact-left, .contact-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

// ===== MODAL =====
function openModal(name, price, spec, img) {
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalSpec').textContent = spec;
  document.getElementById('modalImg').src = img;
  document.getElementById('modalImg').alt = name;
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== FORM SUBMIT =====
function submitForm() {
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const model = document.getElementById('fModel').value;
  if (!name || !phone || !model) {
    showToast('Lengkapi nama, nomor WA, dan pilihan model dulu ya!', 'error');
    return;
  }
  const msg = `Halo BMW Prestige! Saya ${name} tertarik dengan ${model}. Nomor WA: ${phone}`;
  window.open(`https://wa.me/6281394987839?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('Yeay! Cek WhatsApp kamu ya!', 'success');
  document.getElementById('fName').value = '';
  document.getElementById('fPhone').value = '';
  document.getElementById('fModel').value = '';
  document.getElementById('fMsg').value = '';
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  document.querySelector('.toast')?.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:28px;right:20px;background:${type==='success'?'#00c6ff':'#ff4444'};color:${type==='success'?'#050507':'#fff'};padding:14px 22px;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;z-index:99999;box-shadow:0 12px 32px rgba(0,0,0,0.3);transform:translateY(20px);opacity:0;transition:all 0.3s ease;max-width:90vw;`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateY(0)'; t.style.opacity = '1'; });
  setTimeout(() => { t.style.transform = 'translateY(20px)'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 4000);
}

// ===== PARALLAX + CAR ANIMATION =====
const heroEl        = document.getElementById('hero');
const layerBg       = document.getElementById('layerBg');
const layerGrid     = document.getElementById('layerGrid');
const layerGlow     = document.getElementById('layerGlow');
const carScene      = document.getElementById('heroCarScene');
const heroContent   = document.getElementById('heroContent');
const heroRoad      = document.getElementById('heroRoad');
const speedLines    = document.getElementById('speedLines');
const scrollHint    = document.getElementById('scrollHint');

let lastScrollY = 0;
let ticking = false;
let speedTimeout = null;

function getHeroProgress() {
  // 0 = top of hero, 1 = hero fully scrolled past
  const heroH = heroEl.offsetHeight;
  return Math.min(Math.max(window.scrollY / heroH, 0), 1);
}

function applyParallax() {
  const scrollY = window.scrollY;
  const heroH = heroEl.offsetHeight;

  // Only apply inside hero
  if (scrollY > heroH * 1.2) {
    ticking = false;
    return;
  }

  const progress = scrollY / heroH; // 0 → 1

  // BG layer — slowest, drifts backward
  layerBg.style.transform = `translateY(${scrollY * 0.15}px)`;

  // Grid layer — slightly faster
  layerGrid.style.transform = `translateY(${scrollY * 0.25}px)`;

  // Glow follows car
  layerGlow.style.transform = `translateY(${scrollY * 0.1}px)`;

  // Road lines — move opposite (road rushing toward viewer)
  heroRoad.style.transform = `translateY(${scrollY * -0.05}px)`;

  // Car — the star of the show
  // Starts at right side, as you scroll: moves left + slightly scales up (zooms in) + slight tilt
  const carMoveX = progress * 80;   // moves 0 → 80px to the right (giving "passing by" feel)
  const carMoveY = progress * -30;  // rises slightly
  const carScale = 1 + progress * 0.06; // grows a little = zoom in feel
  const carTilt  = progress * -1.5; // slight tilt (neg = nose down like accelerating)

  if (window.innerWidth > 768) {
    carScene.style.transform = `translateX(${carMoveX}px) translateY(${carMoveY}px) scale(${carScale}) rotate(${carTilt}deg)`;
  } else {
    // Mobile: just vertical float
    carScene.style.transform = `translateY(${scrollY * 0.12}px)`;
  }

  // Content — moves up slightly (standard parallax)
  heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
  heroContent.style.opacity = Math.max(1 - progress * 2.2, 0);

  // Scroll hint fades out
  if (scrollHint) scrollHint.style.opacity = Math.max(1 - progress * 8, 0);

  // Speed lines — appear when scroll velocity is high
  const velocity = Math.abs(scrollY - lastScrollY);
  if (velocity > 6) {
    speedLines.classList.add('active');
    clearTimeout(speedTimeout);
    speedTimeout = setTimeout(() => speedLines.classList.remove('active'), 200);
  }

  lastScrollY = scrollY;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(applyParallax);
    ticking = true;
  }
}, { passive: true });

// Initial call
applyParallax();

// ===== SCROLL HINT HIDE ON INTERACTION =====
window.addEventListener('scroll', () => {
  if (scrollHint && window.scrollY > 80) {
    scrollHint.style.display = 'none';
  }
}, { once: true });
