// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

revealEls.forEach(el => el.classList.add('pre'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('pre');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Stagger children timing
document.querySelectorAll('.reveal-stagger').forEach(group => {
  const items = group.children;
  Array.from(items).forEach((item, i) => {
    item.style.transitionDelay = `${i * 70}ms`;
  });
});

// ============ NAV BACKGROUND ON SCROLL ============
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 12) {
    nav.style.boxShadow = '0 8px 30px -12px rgba(0,0,0,0.5)';
  } else {
    nav.style.boxShadow = 'none';
  }
  lastScroll = y;
}, { passive: true });

// ============ SMOOTH ANCHOR SCROLL (offset for sticky nav) ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId === '#' || targetId === '#top') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

// ============ SUBTLE PARALLAX ON BACKDROP GLOWS ============
const reducedMotion = document.documentElement.classList.contains('reduced-motion');

if (!reducedMotion) {
  const glow1 = document.querySelector('.glow-1');
  const glow2 = document.querySelector('.glow-2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (glow1) glow1.style.transform = `translateY(${y * 0.08}px)`;
    if (glow2) glow2.style.transform = `translateY(${y * -0.05}px)`;
  }, { passive: true });
}

// ============ SCROLL PROGRESS BAR ============
const navProgress = document.getElementById('navProgress');
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (navProgress) navProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// ============ ACTIVE NAV LINK ON SCROLL ============
const navLinkEls = document.querySelectorAll('.nav-links a');
const sections = Array.from(navLinkEls)
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`.nav-links a[href="${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(sec => sectionObserver.observe(sec));

// ============ CURSOR-FOLLOW SPOTLIGHT (desktop only) ============
const cursorGlow = document.getElementById('cursorGlow');
const supportsHover = window.matchMedia('(hover: hover)').matches;

if (cursorGlow && supportsHover && !reducedMotion) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let curX = glowX;
  let curY = glowY;

  window.addEventListener('mousemove', (e) => {
    glowX = e.clientX;
    glowY = e.clientY;
    cursorGlow.classList.add('active');
  });

  window.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));

  function animateGlow() {
    curX += (glowX - curX) * 0.12;
    curY += (glowY - curY) * 0.12;
    cursorGlow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

// ============ 3D TILT ON CARDS ============
if (supportsHover && !reducedMotion) {
  const tiltEls = document.querySelectorAll('.card, .skill-card');

  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) * 4;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ============ MAGNETIC BUTTONS ============
if (supportsHover && !reducedMotion) {
  const magneticEls = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ============ PROJECT FILTER TABS ============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

// ============ START A PROJECT FORM -> MAILTO ============
const projectForm = document.getElementById('projectForm');
const formNote = document.getElementById('formNote');

if (projectForm) {
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const service = document.getElementById('fService').value;
    const overview = document.getElementById('fOverview').value.trim();

    const subject = `Project Inquiry — ${service}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Service Required: ${service}\n\n` +
      `Project Overview:\n${overview}`;

    const mailtoLink = `mailto:hisrawaheed@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    if (formNote) formNote.textContent = (document.documentElement.lang === "ur" && typeof UR_META !== "undefined") ? UR_META.formNote : "Opening your email app with this brief pre-filled…";
  });
}

// ============ V2 ADDITIONS ============

// Spotlight follows mouse on cards
document.querySelectorAll('.card, .skill-card, .service-card, .layer-card, .stat, .task-card').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Portrait 3D tilt
(function () {
  const ring = document.querySelector('.photo-ring');
  if (!ring || !window.matchMedia('(hover: hover)').matches || document.documentElement.classList.contains('reduced-motion')) return;
  ring.addEventListener('mousemove', (e) => {
    const r = ring.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ring.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  });
  ring.addEventListener('mouseleave', () => { ring.style.transform = ''; });
})();

// Count-up stats
(function () {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
      const t0 = performance.now(), dur = 1400;
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();

// Button ripple
document.querySelectorAll('.btn-primary, .btn-ghost, .filter-btn').forEach(btn => {
  if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.addEventListener('click', (e) => {
    const r = btn.getBoundingClientRect();
    const d = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.width = s.style.height = d + 'px';
    s.style.left = (e.clientX - r.left - d / 2) + 'px';
    s.style.top = (e.clientY - r.top - d / 2) + 'px';
    btn.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });
});

// Back to top
(function () {
  const b = document.getElementById('toTop');
  if (!b) return;
  window.addEventListener('scroll', () => b.classList.toggle('show', window.scrollY > 600), { passive: true });
  b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


// ============ THEME + LANGUAGE (English / Urdu) ============
(function () {
  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const metaTheme = document.getElementById('metaTheme');
  const metaDesc = document.querySelector('meta[name="description"]');
  const themeBtn = document.getElementById('themeToggle');
  const langBtn = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');

  // remember the English originals once, so switching back is lossless
  document.querySelectorAll('[data-i18n]').forEach(el => { el.dataset.en = el.innerHTML; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.dataset.enPh = el.getAttribute('placeholder'); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.dataset.enAria = el.getAttribute('aria-label'); });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.dataset.enAlt = el.getAttribute('alt'); });
  const enTitle = document.title;
  const enDesc = metaDesc ? metaDesc.getAttribute('content') : '';

  /* ---------- theme ---------- */
  function applyTheme(theme, animate) {
    if (animate && !root.classList.contains('reduced-motion')) {
      root.classList.add('theme-anim');
      setTimeout(() => root.classList.remove('theme-anim'), 500);
    }
    root.setAttribute('data-theme', theme);
    if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#F4F5EF' : '#0A0D10');
    if (themeBtn) {
      const lbl = theme === 'light' ? UR_META.themeAria_light : UR_META.themeAria_dark;
      themeBtn.setAttribute('aria-label', lbl);
      themeBtn.setAttribute('title', lbl);
    }
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
    store.set('hk_theme', next);
  });

  /* ---------- language ---------- */
  function setLang(lang) {
    const ur = lang === 'ur';
    root.lang = ur ? 'ur' : 'en';
    root.dir = ur ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      el.innerHTML = ur && UR[k] !== undefined ? UR[k] : el.dataset.en;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.dataset.i18nPh;
      el.setAttribute('placeholder', ur && UR_ATTR[k] !== undefined ? UR_ATTR[k] : el.dataset.enPh);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const k = el.dataset.i18nAria;
      el.setAttribute('aria-label', ur && UR_ATTR[k] !== undefined ? UR_ATTR[k] : el.dataset.enAria);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const k = el.dataset.i18nAlt;
      el.setAttribute('alt', ur && UR_ATTR[k] !== undefined ? UR_ATTR[k] : el.dataset.enAlt);
    });
    document.title = ur ? UR_META.title : enTitle;
    if (metaDesc) metaDesc.setAttribute('content', ur ? UR_META.description : enDesc);
    if (langLabel) langLabel.textContent = ur ? UR_META.langLabel_ur : UR_META.langLabel_en;
    if (langBtn) langBtn.setAttribute('aria-label', ur ? UR_META.langAria_ur : UR_META.langAria_en);
    const note = document.getElementById('formNote');
    if (note) note.textContent = '';
  }
  // first paint: apply saved language without animation
  if (root.lang === 'ur') setLang('ur'); else setLang('en');

  if (langBtn) langBtn.addEventListener('click', () => {
    const next = root.lang === 'ur' ? 'en' : 'ur';
    store.set('hk_lang', next);
    if (root.classList.contains('reduced-motion')) { setLang(next); return; }
    document.body.classList.add('lang-fade');
    setTimeout(() => { setLang(next); document.body.classList.remove('lang-fade'); }, 180);
  });
})();

// ============ LIVING BACKGROUND: glowing grid cells + cursor trail + parallax ============
(function () {
  const backdrop = document.querySelector('.grid-backdrop');
  if (!backdrop) return;
  const root = document.documentElement;

  // scroll parallax for the floating boxes
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { root.style.setProperty('--sy', (-window.scrollY) + 'px'); ticking = false; });
  }, { passive: true });

  if (root.classList.contains('reduced-motion')) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'grid-canvas';
  backdrop.insertBefore(canvas, backdrop.querySelector('.grid-lines').nextSibling);
  const ctx = canvas.getContext('2d');
  const CELL = 64, OFF = -2;                      // matches the CSS grid (inset:-2px, 64px)
  const hover = window.matchMedia('(hover: hover)').matches;
  let W = 0, H = 0, dpr = 1, cols = 0, rows = 0;
  const pulses = [];                               // random twinkling cells
  const trail = new Map();                         // cells lit by the cursor, key -> strength
  let mx = -1e4, my = -1e4, lastSpawn = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1;
  }
  resize();
  window.addEventListener('resize', resize);

  if (hover) window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mx = my = -1e4; });

  const AMBER = '245,166,35', TEAL = '45,212,191';
  const cellRect = (c, r) => [OFF + c * CELL + 1, OFF + r * CELL + 1, CELL - 1, CELL - 1];

  function spawn(t) {
    // bias spawns toward the upper, visible part of the grid
    const c = Math.floor(Math.random() * cols);
    const r = Math.floor(Math.pow(Math.random(), 1.25) * rows);
    pulses.push({ c, r, t0: t, life: 2200 + Math.random() * 2200, col: Math.random() < .62 ? AMBER : TEAL, max: .10 + Math.random() * .12 });
  }

  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const light = root.getAttribute('data-theme') === 'light';
    const k = light ? 1.3 : 1;
    ctx.clearRect(0, 0, W, H);

    if (t - lastSpawn > (W < 760 ? 520 : 260) && pulses.length < (W < 760 ? 6 : 16)) { spawn(t); lastSpawn = t; }

    // twinkling cells
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i], a = (t - p.t0) / p.life;
      if (a >= 1) { pulses.splice(i, 1); continue; }
      if (a < 0) continue;                                   // shockwave cells waiting for their turn
      const s = Math.sin(a * Math.PI);                       // fade in, fade out
      const [x, y, w, h] = cellRect(p.c, p.r);
      ctx.fillStyle = `rgba(${p.col},${(p.max * s * k).toFixed(3)})`;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = `rgba(${p.col},${(p.max * 2.2 * s * k).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
    }

    // cursor: light the cells under/near the pointer, then let them fade slowly
    if (hover && mx > -1000) {
      const cc = Math.floor((mx - OFF) / CELL), cr = Math.floor((my - OFF) / CELL);
      for (let dc = -2; dc <= 2; dc++) for (let dr = -2; dr <= 2; dr++) {
        const d = Math.hypot(dc, dr);
        if (d > 2.3) continue;
        const key = (cc + dc) + ',' + (cr + dr);
        const v = Math.max(trail.get(key) || 0, 1 - d / 2.6);
        trail.set(key, v);
      }
    }
    trail.forEach((v, key) => {
      const nv = v - 0.012;
      if (nv <= 0) { trail.delete(key); return; }
      trail.set(key, nv);
      const [c, r] = key.split(',').map(Number);
      const [x, y, w, h] = cellRect(c, r);
      const warm = ((c + r) & 1) === 0 ? AMBER : TEAL;
      ctx.fillStyle = `rgba(${warm},${(nv * .13 * k).toFixed(3)})`;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = `rgba(${warm},${(nv * .42 * k).toFixed(3)})`;
      ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
    });
  }
  requestAnimationFrame(frame);

  // a click sends a small shockwave of lit cells outward
  window.addEventListener('click', (e) => {
    const cc = Math.floor((e.clientX - OFF) / CELL), cr = Math.floor((e.clientY - OFF) / CELL);
    const now = performance.now();
    for (let dc = -4; dc <= 4; dc++) for (let dr = -4; dr <= 4; dr++) {
      const d = Math.hypot(dc, dr);
      if (d > 4.2 || pulses.length > 60) continue;
      pulses.push({ c: cc + dc, r: cr + dr, t0: now + d * 90, life: 900, col: d % 2 < 1 ? AMBER : TEAL, max: .26 - d * .03 });
    }
  });
})();


// ============ MOBILE MENU ============
(function () {
  const navEl = document.querySelector('.nav');
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!navEl || !toggle || !links) return;

  function setOpen(open) {
    links.classList.toggle('open', open);
    navEl.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });

  // close after choosing a link
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });

  // close with Escape or by tapping outside the navbar
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function (e) { if (!navEl.contains(e.target)) setOpen(false); });

  // reset when the screen becomes wide again
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();
