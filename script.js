/* ============================================================
   FLAVIAN — SCRIPT.JS
   ============================================================ */

// ── CUSTOM CURSOR + SPARKLE TRAIL ──────────────────────────
const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursorDot);

const SPARKLES = ['✦', '✧', '★', '✸', '·', '°', '✶', '✹', '✺', '⁺', '×'];
const COLORS   = ['#00e87d', '#ffcc44', '#ff6eb4', '#00d4ff', '#b388ff'];

let lastSparkle = 0;

document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top  = e.clientY + 'px';

  const now = Date.now();
  if (now - lastSparkle < 55) return;
  lastSparkle = now;

  const sp = document.createElement('div');
  sp.className = 'sparkle';
  sp.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
  sp.style.cssText = [
    'left:'      + (e.clientX + (Math.random() - 0.5) * 22) + 'px',
    'top:'       + (e.clientY + (Math.random() - 0.5) * 22) + 'px',
    'color:'     + COLORS[Math.floor(Math.random() * COLORS.length)],
    'font-size:' + (8 + Math.floor(Math.random() * 9)) + 'px',
  ].join(';');

  document.body.appendChild(sp);
  setTimeout(() => sp.remove(), 760);
});

// ── PAGE TRANSITIONS ───────────────────────────────────────
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
  if (!href.endsWith('.html')) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 260);
  });
});

// ── VISITOR COUNTER ────────────────────────────────────────
function initCounter() {
  const el = document.getElementById('counter-display');
  if (!el) return;

  const BASE = 4217;
  let visits = parseInt(localStorage.getItem('flv_visits') || '0', 10);
  visits++;
  localStorage.setItem('flv_visits', String(visits));

  const total = BASE + visits;
  // Animate counting up from 0
  const target = total;
  const duration = 1200;
  const start = Date.now();

  function tick() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = String(current).padStart(7, '0');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── MOOD / PLAYING ROTATION ────────────────────────────────
function initMoodRotation() {
  const el = document.getElementById('mood-playing');
  if (!el) return;

  const tracks = [
    'Pokémon Emerald OST',
    'Undertale OST',
    'Ocarina of Time OST',
    'Dark Souls OST',
    'Dean Blunt — ZUSHI',
    'Floating Points × Pharoah Sanders',
  ];

  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % tracks.length;
    el.style.transition = 'opacity 0.3s';
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = tracks[idx];
      el.style.opacity = '1';
    }, 310);
  }, 4500);
}

// ── WEBAMP ─────────────────────────────────────────────────
// Replace track1.mp3 … track5.mp3 with your real files
// Webamp will show an error skin if files don't exist — that's fine for now
function initWebamp() {
  if (typeof Webamp === 'undefined') {
    console.warn('Webamp not loaded');
    return;
  }

  const wa = new Webamp({
    initialTracks: [
      {
        metaData: { artist: '—', title: 'track 01' },
        url: 'track1.mp3',
        duration: 180,
      },
      {
        metaData: { artist: '—', title: 'track 02' },
        url: 'track2.mp3',
        duration: 210,
      },
      {
        metaData: { artist: '—', title: 'track 03' },
        url: 'track3.mp3',
        duration: 195,
      },
      {
        metaData: { artist: '—', title: 'track 04' },
        url: 'track4.mp3',
        duration: 225,
      },
      {
        metaData: { artist: '—', title: 'track 05' },
        url: 'track5.mp3',
        duration: 240,
      },
    ],
    initialWindowLayout: {
      main: {
        position: {
          x: Math.max(10, window.innerWidth - 310),
          y: Math.max(10, window.innerHeight - 470),
        },
      },
      equalizer: {
        position: {
          x: Math.max(10, window.innerWidth - 310),
          y: Math.max(10, window.innerHeight - 350),
        },
      },
      playlist: {
        position: {
          x: Math.max(10, window.innerWidth - 310),
          y: Math.max(10, window.innerHeight - 580),
        },
        size: [0, 3],
      },
    },
  });

  wa.renderWhenReady(document.body).then(() => {
    // Apply tilt after render — purely cosmetic
    const el = document.getElementById('webamp');
    if (el) {
      el.style.transform = 'rotate(-2.5deg)';
      el.style.transformOrigin = '140px 60px';
    }
  }).catch((err) => {
    console.warn('Webamp render error:', err);
  });
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCounter();
  initMoodRotation();
});

window.addEventListener('load', () => {
  initWebamp();
});
