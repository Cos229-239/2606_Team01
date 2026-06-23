// ============================================================
// starfield.js
// ------------------------------------------------------------
// Animated parallax star background for BetterEveryDay.
//
// HOW IT WORKS:
//   1. A <canvas id="star-canvas"> sits fixed behind the app.
//   2. Stars are split into 6 depth layers — far stars move
//      slowly, close stars move fast, creating parallax depth.
//   3. Cosmic mist blobs add nebula-like colour in the BG.
//   4. Settings (scroll, mouse-look) are read from localStorage
//      and updated instantly via a "starfield-update" event.
//   5. Mood themes are read from localStorage key "active-mood"
//      and updated via a "mood-change" event fired by
//      CongruencePage when the user selects a mood.
//      Each mood has its own:
//        - background colour
//        - star colour palette
//        - mist tint colours
//        - twinkle speed (calm vs energetic)
//        - star density / brightness multiplier
// ============================================================

(function () {

  // ── Canvas setup ────────────────────────────────────────────────────────
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  // ── Determine if this window is the timer window ─────────────────────────
  const IS_TIMER = window.location.pathname.includes('/timer');

  // ── Active check ─────────────────────────────────────────────────────────
  function isActive() {
    if (IS_TIMER) {
      return (localStorage.getItem('timer-background') ?? 'starfield') === 'starfield';
    }
    return (localStorage.getItem('background-mode') ?? 'starfield') === 'starfield';
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  const rng  = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function hexToRGB(hex) {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  // Linearly interpolate between two [r,g,b] arrays by factor t (0–1)
  function lerpRGB(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }

  function lerpValue(a, b, t) { return a + (b - a) * t; }

  // ── Mood theme definitions ───────────────────────────────────────────────
  const MOOD_THEMES = {

    default: {
      bg:         [7, 4, 26],
      stars:      [
        '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
        '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
        '#fffef5','#fffef5','#fff8e8','#ffefc0',
        '#cce0ff','#cce0ff','#b8d4ff',
        '#ffd090','#ffb870','#ff9060',
      ],
      mist:       [[60,30,140],[20,60,160],[100,20,100],[30,80,130],[80,20,120]],
      twinkleMin: 0.3,
      twinkleMax: 1.2,
      alphaBoost: 1.0,
    },

    Focused: {
      bg:         [3, 6, 24],
      stars:      [
        '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
        '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
        '#e8f0ff','#e8f0ff','#e8f0ff','#e8f0ff',
        '#cce0ff','#cce0ff','#cce0ff',
        '#b8d4ff','#b8d4ff','#a0c8ff',
      ],
      mist:       [[20,40,160],[10,30,140],[30,60,180],[15,50,155],[25,45,170]],
      twinkleMin: 0.6,
      twinkleMax: 1.8,
      alphaBoost: 1.15,
    },

    Planning: {
      bg:         [16, 10, 4],
      stars:      [
        '#ffffff','#ffffff','#ffffff','#ffffff',
        '#fffef0','#fffef0','#fffef0',
        '#fff8d0','#fff8d0','#fff8d0',
        '#ffefc0','#ffefc0','#ffefc0',
        '#ffd090','#ffd090','#ffb870',
        '#ffcc60','#ffaa40','#ff9830',
      ],
      mist:       [[120,60,10],[140,50,5],[100,70,15],[130,45,8],[110,65,12]],
      twinkleMin: 0.2,
      twinkleMax: 0.7,
      alphaBoost: 0.95,
    },

    Recharge: {
      bg:         [2, 14, 10],
      stars:      [
        '#ffffff','#ffffff','#ffffff','#ffffff',
        '#e0fff5','#e0fff5','#e0fff5',
        '#c0ffe8','#c0ffe8','#c0ffe8',
        '#a0ffd8','#a0ffd8',
        '#80ffcc','#80ffcc',
        '#60ffbc','#40ffac',
        '#b8ffec','#d0fff8',
      ],
      mist:       [[0,100,80],[10,120,90],[0,80,100],[5,110,85],[15,95,75]],
      twinkleMin: 0.15,
      twinkleMax: 0.5,
      alphaBoost: 0.85,
    },
  };

  // ── Active theme state ───────────────────────────────────────────────────
  let activeMoodKey = localStorage.getItem('active-mood') || 'Focused';
  let currentTheme  = MOOD_THEMES[activeMoodKey] || MOOD_THEMES.default;
  let targetTheme   = currentTheme;
  let themeT        = 1.0;
  const THEME_SPEED = 0.008;

  window.addEventListener('mood-change', () => {
    const newMoodKey = localStorage.getItem('active-mood') || 'Focused';
    const newTheme   = MOOD_THEMES[newMoodKey] || MOOD_THEMES.default;
    if (newMoodKey !== activeMoodKey) {
      activeMoodKey = newMoodKey;
      currentTheme  = targetTheme;
      targetTheme   = newTheme;
      themeT        = 0;
      stars      = makeStars();
      cosmicMist = makeCosmicMist();
    }
    setTimeout(applyScreenTint, 50);
  });

  function getThemeBg() {
    return lerpRGB(currentTheme.bg, targetTheme.bg, themeT);
  }

  // ── User settings ─────────────────────────────────────────────────────────
  // scrollSpeed is in px/s (same unit as cityscape).
  // Positive = rightward, negative = leftward.
  // Stored in localStorage as 'star-scroll-speed'.
  let optScroll    = localStorage.getItem('star-scroll')    === 'true';
  let optMouseLook = localStorage.getItem('star-mouselook') !== 'false';
  let scrollSpeed  = parseFloat(localStorage.getItem('star-scroll-speed') || '40');
  let scrollX      = 0;

  function reloadSettings() {
    optScroll    = localStorage.getItem('star-scroll')    === 'true';
    optMouseLook = localStorage.getItem('star-mouselook') !== 'false';
    scrollSpeed  = parseFloat(localStorage.getItem('star-scroll-speed') || '40');
    if (!optScroll) scrollX = 0;
    applyScreenTint();
  }

  window.addEventListener('starfield-update', reloadSettings);

  // Re-read settings when the window regains focus (cross-window sync for timer)
  window.addEventListener('focus', reloadSettings);

  // Also sync via storage events (fires in other tabs when localStorage changes)
  window.addEventListener('storage', (e) => {
    const starKeys = ['star-scroll','star-mouselook','star-scroll-speed',
                      'tint-default-h','tint-default-s','active-mood',
                      'background-mode','timer-background'];
    const moodKeys = ['Focused','Planning','Recharge'].flatMap(m =>
      [`tint-${m}-enabled`,`tint-${m}-h`,`tint-${m}-s`]);
    if ([...starKeys, ...moodKeys].includes(e.key ?? '')) {
      reloadSettings();
      syncVisibility();
      // If mood changed in another tab, trigger mood-change event locally
      if (e.key === 'active-mood') {
        window.dispatchEvent(new CustomEvent('mood-change'));
      }
    }
  });

  // ── Screen tint overlay ───────────────────────────────────────────────────
  function applyScreenTint() {
    const tintEl = document.getElementById('screen-tint');
    if (!tintEl) return;

    if (!isActive()) {
      tintEl.style.opacity = '0';
      return;
    }

    const mood        = localStorage.getItem('active-mood') || 'Focused';
    const moodEnabled = localStorage.getItem(`tint-${mood}-enabled`) === 'true';

    let hue, strength;
    if (moodEnabled && mood !== 'default') {
      hue      = parseFloat(localStorage.getItem(`tint-${mood}-h`) || '0');
      strength = parseFloat(localStorage.getItem(`tint-${mood}-s`) || '0');
    } else {
      hue      = parseFloat(localStorage.getItem('tint-default-h') || '0');
      strength = parseFloat(localStorage.getItem('tint-default-s') || '0');
    }

    if (strength <= 0) {
      tintEl.style.opacity = '0';
    } else {
      tintEl.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
      tintEl.style.opacity          = String(Math.min(0.35, strength * 0.35));
    }
  }
  applyScreenTint();

  // ── Star layer config ─────────────────────────────────────────────────────
  const LAYERS = [
    { count: 280, minR: 0.3, maxR: 0.7, speed: 0.4, alpha: 0.35 },
    { count: 180, minR: 0.5, maxR: 1.0, speed: 1.0, alpha: 0.55 },
    { count: 100, minR: 0.8, maxR: 1.5, speed: 1.8, alpha: 0.72 },
    { count: 55,  minR: 1.2, maxR: 2.2, speed: 3.0, alpha: 0.85 },
    { count: 22,  minR: 1.8, maxR: 3.0, speed: 5.0, alpha: 0.95 },
    { count:  8,  minR: 2.5, maxR: 4.0, speed: 8.0, alpha: 1.0  },
  ];

  function makeStars() {
    const theme = targetTheme;
    return LAYERS.map(l =>
      Array.from({ length: l.count }, () => {
        const rgb = hexToRGB(pick(theme.stars));
        return {
          x:            rng(0, 1),
          y:            rng(0, 1),
          r:            rng(l.minR, l.maxR),
          colorFrom:    rgb,
          alpha:        rng(l.alpha * 0.7, l.alpha),
          twinkle:      rng(0, Math.PI * 2),
          twinkleSpeed: rng(theme.twinkleMin, theme.twinkleMax),
          speed:        l.speed,
        };
      })
    );
  }

  function makeCosmicMist() {
    const theme = targetTheme;
    return Array.from({ length: 4 }, () => ({
      x:     rng(0, 1),
      y:     rng(0, 1),
      rx:    rng(350, 600),
      ry:    rng(200, 320),
      color: pick(theme.mist),
      a:     rng(0.022, 0.048),
      speed: rng(0.04, 0.10),
    }));
  }

  // ── Declare stars/cosmicMist before resize() is called ───────────────────
  let stars      = makeStars();
  let cosmicMist = makeCosmicMist();

  // ── Resize ────────────────────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars      = makeStars();
    cosmicMist = makeCosmicMist();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Visibility control ────────────────────────────────────────────────────
  function syncVisibility() {
    const on = isActive();
    canvas.style.display = on ? 'block' : 'none';
    applyScreenTint();
  }
  window.addEventListener('background-update',       syncVisibility);
  window.addEventListener('timer-background-update', syncVisibility);
  syncVisibility();

  // ── Mouse parallax ────────────────────────────────────────────────────────
  let mx = 0, my = 0, smx = 0, smy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Black Hole ────────────────────────────────────────────────────────────
  // A singularity that grows as the timer counts down. Adapted from the
  // standalone blackhole.js prototype to share this file's ctx/t/rng.
  //
  //   - Position: centered on the timer screen (no mouse-follow here).
  //   - Scale:    driven by countdown progress — bigger as time runs out.
  //   - Lensing:  stars near the hole are displaced/swallowed for the
  //               gravitational-lens look; jets + accretion disk render
  //               on top.
  let optBlackHole = false;

  let bhX = 0, bhY = 0;
  let bhTargetX = 0, bhTargetY = 0;
  let bhActive     = false;
  let bhSpawning   = false;
  let bhDespawning = false;
  let bhScale      = 0; // 0→1 visual scale, driven by timer progress

  const BH_STRENGTH   = 18000;
  const BH_RADIUS     = 38;
  const BH_INNER_MASK = 34;
  const BH_ACCRETION  = 72;
  const BH_LENS_OUTER = 260;
  const BH_SMOOTH     = 0.09;
  const BH_MIN_SCALE  = 0.18; // smallest the hole gets once the timer starts
  const BH_MAX_GROW   = 1.6;  // extra scale multiplier reached at 0:00

  let bhDiskAngle = 0;
  const BH_DISK_SPIN = 0.8;

  const bhJets = [];
  const BH_JET_COUNT = 60;

  function spawnBHJetParticle() {
    const side = Math.random() < 0.5 ? 1 : -1;
    const spread = rng(-0.18, 0.18);
    const jetAngle = bhDiskAngle + Math.PI * 0.5 * side + spread;
    return {
      x: bhX, y: bhY,
      vx: Math.cos(jetAngle) * rng(60, 160),
      vy: Math.sin(jetAngle) * rng(60, 160),
      age: 0,
      life: rng(0.6, 1.4),
      alpha: rng(0.4, 0.8),
      r: rng(0.8, 2.2),
      hue: rng(180, 260),
    };
  }

  function tickBHJets(dt) {
    if (bhActive && bhScale > 0.5 && optBlackHoleJetsOn) {
      const toSpawn = Math.floor(rng(0, 3));
      for (let i = 0; i < toSpawn; i++) {
        if (bhJets.length < BH_JET_COUNT) bhJets.push(spawnBHJetParticle());
      }
    }
    for (let i = bhJets.length - 1; i >= 0; i--) {
      const p = bhJets[i];
      p.age += dt;
      if (p.age >= p.life) { bhJets.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const f = 1 - p.age / p.life;
      ctx.save();
      ctx.globalAlpha = f * f * p.alpha * bhScale;
      ctx.fillStyle = `hsl(${p.hue}, 100%, ${60 + f * 30}%)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.5 + f * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Given a star's real screen position, returns the lensed (apparent)
  // position, or hidden:true if it's been swallowed by the event horizon.
  function lensedPosition(px, py) {
    if (!optBlackHole || bhScale < 0.01) return { x: px, y: py, hidden: false };

    const dx = px - bhX;
    const dy = py - bhY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

    if (dist < BH_INNER_MASK * bhScale) return { x: px, y: py, hidden: true };
    if (dist > BH_LENS_OUTER) return { x: px, y: py, hidden: false };

    const strength = BH_STRENGTH * bhScale;
    const falloff  = Math.max(0, 1 - dist / BH_LENS_OUTER);
    const deflect  = (strength / (dist * dist)) * falloff * falloff;

    const nx = dx / dist;
    const ny = dy / dist;

    const swirlStrength = deflect * 0.35;
    const tx = -ny;
    const ty =  nx;

    const ringBoost = dist < BH_RADIUS * 3 * bhScale
      ? (1 + (BH_RADIUS * 3 * bhScale - dist) / (BH_RADIUS * 2 * bhScale)) * 2.5
      : 1;

    const totalDeflect = deflect * ringBoost;

    return {
      x: px + nx * totalDeflect + tx * swirlStrength,
      y: py + ny * totalDeflect + ty * swirlStrength,
      hidden: false,
    };
  }

  function drawBlackHole(dt) {
    if (!optBlackHole && bhScale < 0.01) return;

    bhX += (bhTargetX - bhX) * BH_SMOOTH * (1 + (1 - bhScale) * 2);
    bhY += (bhTargetY - bhY) * BH_SMOOTH * (1 + (1 - bhScale) * 2);

    // Scale animation: spawn/despawn in, then track timer progress while active.
    if (bhSpawning) {
      bhScale = Math.min(bhTargetScale(), bhScale + dt * 1.8);
      if (bhScale >= bhTargetScale() - 0.001) bhSpawning = false;
    } else if (bhDespawning) {
      bhScale = Math.max(0, bhScale - dt * 2.2);
      if (bhScale <= 0) { bhScale = 0; bhDespawning = false; }
    } else if (bhActive) {
      // Smoothly track the growth target as the timer ticks down.
      bhScale += (bhTargetScale() - bhScale) * Math.min(1, dt * 2);
    }

    if (bhScale < 0.005) return;

    bhDiskAngle += BH_DISK_SPIN * dt;
    const s = bhScale;
    const r = BH_RADIUS * s;
    const cx = bhX, cy = bhY;

    const ringR = r * 1.15;
    const ringOuter = r * 2.8;
    ctx.save();
    const lensGlow = ctx.createRadialGradient(cx, cy, ringR * 0.9, cx, cy, ringOuter);
    lensGlow.addColorStop(0,   `rgba(255,255,255,${0.28 * s})`);
    lensGlow.addColorStop(0.2, `rgba(200,230,255,${0.18 * s})`);
    lensGlow.addColorStop(0.5, `rgba(140,190,255,${0.08 * s})`);
    lensGlow.addColorStop(1,   `rgba(100,150,255,0)`);
    ctx.fillStyle = lensGlow;
    ctx.beginPath(); ctx.arc(cx, cy, ringOuter, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(bhDiskAngle);

    const diskOuter = BH_ACCRETION * s;
    const diskGrad = ctx.createRadialGradient(0, 0, r * 0.9, 0, 0, diskOuter);
    diskGrad.addColorStop(0,   `rgba(255,160,40,${0.55 * s})`);
    diskGrad.addColorStop(0.2, `rgba(255,100,20,${0.35 * s})`);
    diskGrad.addColorStop(0.45,`rgba(200,60,10,${0.18 * s})`);
    diskGrad.addColorStop(0.7, `rgba(120,20,60,${0.08 * s})`);
    diskGrad.addColorStop(1,   `rgba(60,0,40,0)`);

    ctx.scale(1, 0.28);
    ctx.fillStyle = diskGrad;
    ctx.beginPath(); ctx.arc(0, 0, diskOuter, 0, Math.PI * 2); ctx.fill();

    const isco = ctx.createRadialGradient(0, 0, r * 0.95, 0, 0, r * 1.35);
    isco.addColorStop(0,   `rgba(255,255,200,${0.9 * s})`);
    isco.addColorStop(0.4, `rgba(255,200,80,${0.6 * s})`);
    isco.addColorStop(1,   `rgba(255,100,10,0)`);
    ctx.fillStyle = isco;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2); ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(bhDiskAngle + Math.PI);
    ctx.scale(1, 0.28);
    const diskBack = ctx.createRadialGradient(0, 0, r, 0, 0, diskOuter * 0.75);
    diskBack.addColorStop(0,   `rgba(255,80,10,${0.25 * s})`);
    diskBack.addColorStop(0.5, `rgba(160,20,30,${0.12 * s})`);
    diskBack.addColorStop(1,   `rgba(80,0,20,0)`);
    ctx.fillStyle = diskBack;
    ctx.beginPath(); ctx.arc(0, 0, diskOuter * 0.75, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    ctx.save();
    const shadowGrad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.05);
    shadowGrad.addColorStop(0,   `rgba(0,0,0,1)`);
    shadowGrad.addColorStop(0.7, `rgba(0,0,0,0.97)`);
    shadowGrad.addColorStop(1,   `rgba(0,0,0,0)`);
    ctx.fillStyle = shadowGrad;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    const photonR = r * 1.5;
    ctx.save();
    ctx.strokeStyle = `rgba(200,230,255,${0.22 * s * (0.7 + 0.3 * Math.sin(t * 3.1))})`;
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath(); ctx.arc(cx, cy, photonR, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${0.10 * s * (0.6 + 0.4 * Math.sin(t * 2.3 + 1))})`;
    ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.arc(cx, cy, photonR * 1.08, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    tickBHJets(dt);

    ctx.save();
    const warpGrad = ctx.createRadialGradient(cx, cy, r * 1.5, cx, cy, BH_LENS_OUTER * 0.65 * s);
    warpGrad.addColorStop(0,   `rgba(80,60,180,${0.07 * s})`);
    warpGrad.addColorStop(0.4, `rgba(40,30,120,${0.04 * s})`);
    warpGrad.addColorStop(1,   `rgba(20,10,60,0)`);
    ctx.fillStyle = warpGrad;
    ctx.beginPath(); ctx.arc(cx, cy, BH_LENS_OUTER * 0.65 * s, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function activateBlackHole() {
    bhSpawning   = true;
    bhDespawning = false;
    bhActive     = true;
  }

  function deactivateBlackHole() {
    bhDespawning = true;
    bhSpawning   = false;
    bhActive     = false;
  }

  // ── Timer black hole bridge (only relevant on the timer window) ─────────
  // The timer countdown reports its progress (0 = just started, 1 = done)
  // via localStorage + a "timer-progress" event so it works across windows.
  let optBlackHoleEnabled = localStorage.getItem('timer-blackhole') !== 'false';
  let optBlackHoleJetsOn  = localStorage.getItem('timer-blackhole-jets') !== 'false';
  let bhTimerRunning      = false;
  let bhTimerProgress     = 0; // 0..1, 1 = nearly finished

  // The hole's target scale grows from BH_MIN_SCALE up to BH_MIN_SCALE +
  // BH_MAX_GROW as the countdown approaches zero.
  function bhTargetScale() {
    if (!bhTimerRunning) return 0;
    return BH_MIN_SCALE + bhTimerProgress * BH_MAX_GROW;
  }

  function reloadBHSettings() {
    optBlackHoleEnabled = localStorage.getItem('timer-blackhole') !== 'false';
    optBlackHoleJetsOn  = localStorage.getItem('timer-blackhole-jets') !== 'false';
  }

  function applyTimerProgress(running, progress) {
    bhTimerRunning  = running;
    bhTimerProgress = Math.max(0, Math.min(1, progress));

    if (!IS_TIMER || !optBlackHoleEnabled) {
      if (bhActive) deactivateBlackHole();
      return;
    }

    optBlackHole = true;

    // Center the black hole on the timer screen.
    bhTargetX = window.innerWidth  / 2;
    bhTargetY = window.innerHeight / 2;

    if (running && !bhActive) {
      activateBlackHole();
    } else if (!running && bhActive) {
      deactivateBlackHole();
    }
  }

  window.addEventListener('timer-progress', e => {
    const detail = e.detail || {};
    applyTimerProgress(!!detail.running, Number(detail.progress) || 0);
  });

  // Cross-window sync: TimerPage writes these on every tick.
  window.addEventListener('storage', e => {
    if (e.key === 'timer-running' || e.key === 'timer-progress-value') {
      const running  = localStorage.getItem('timer-running') === 'true';
      const progress = parseFloat(localStorage.getItem('timer-progress-value') || '0');
      applyTimerProgress(running, progress);
    }
    if (e.key === 'timer-blackhole' || e.key === 'timer-blackhole-jets') {
      reloadBHSettings();
    }
  });
  window.addEventListener('timer-blackhole-update', reloadBHSettings);

  // On the timer window, pick up whatever state is already in localStorage
  // (covers the case where the window opens mid-countdown).
  if (IS_TIMER) {
    applyTimerProgress(
      localStorage.getItem('timer-running') === 'true',
      parseFloat(localStorage.getItem('timer-progress-value') || '0')
    );
  }

  // ── Main draw loop ────────────────────────────────────────────────────────
  // scrollSpeed (px/s) is converted to a normalised per-frame delta
  // by dividing by W, keeping the existing wrapping math intact.
  let t   = 0;
  const DT = 0.016; // fixed timestep (~60fps), matches original

  function draw() {
    t += DT;

    if (themeT < 1) themeT = Math.min(1, themeT + THEME_SPEED);

    // Scroll / mouse-look
    if (optScroll) {
      scrollX += (scrollSpeed * DT) / W; // px/s → normalised units
      smx += (0 - smx) * 0.05;
      smy += ((optMouseLook ? my : 0) - smy) * 0.05;
    } else {
      smx += ((optMouseLook ? mx : 0) - smx) * 0.05;
      smy += ((optMouseLook ? my : 0) - smy) * 0.05;
    }

    // Background
    const [br, bg, bb] = getThemeBg();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgb(${br},${bg},${bb})`;
    ctx.fillRect(0, 0, W, H);

    // Cosmic mist
    const alphaBoost = lerpValue(currentTheme.alphaBoost, targetTheme.alphaBoost, themeT);
    cosmicMist.forEach(n => {
      const ox = smx * n.speed * W * 0.10 - scrollX * n.speed * W;
      const oy = smy * n.speed * H * 0.10;
      const cx = n.x * W + ox;
      const cy = n.y * H + oy;
      const [r, g, b] = n.color;
      const mistAlpha = n.a * alphaBoost;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.rx);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${mistAlpha})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${mistAlpha * 0.3})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.save();
      ctx.scale(1, n.ry / n.rx);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Stars
    stars.forEach(layer => {
      layer.forEach(s => {
        const ox = smx * s.speed * W * 0.04 - scrollX * s.speed * W;
        const oy = smy * s.speed * H * 0.04;
        let px = ((s.x * W + ox) % W + W) % W;
        let py = ((s.y * H + oy) % H + H) % H;

        if (optBlackHole) {
          const lensed = lensedPosition(px, py);
          if (lensed.hidden) return;
          px = lensed.x;
          py = lensed.y;
        }

        const tw = 0.75 + 0.25 * Math.sin(t * s.twinkleSpeed + s.twinkle);

        ctx.globalAlpha = Math.min(1, s.alpha * tw * alphaBoost);
        const [r, g, b] = s.colorFrom;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r * Math.min(2.0, tw), 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 2.0) {
          ctx.globalAlpha = Math.min(0.6, s.alpha * tw * 0.2 * alphaBoost);
          ctx.beginPath();
          ctx.arc(px, py, s.r * Math.min(3.5, tw * 2.5), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.globalAlpha = 1;

    // Black hole renders on top of the stars (timer screen only)
    drawBlackHole(DT);

    requestAnimationFrame(draw);
  }

  draw();

})();
