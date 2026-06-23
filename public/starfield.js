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

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    // Rebuild stars when window resizes so density stays correct
    stars = makeStars();
    cosmicMist = makeCosmicMist();
  });

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

  // ── Mood theme definitions ───────────────────────────────────────────────
  // Each mood maps to a visual personality for the starfield.
  // bg          : canvas background colour [r,g,b]
  // stars       : weighted list of star hex colours (more repeats = more common)
  // mist        : array of [r,g,b] nebula tint options
  // twinkleMin  : minimum twinkle speed multiplier
  // twinkleMax  : maximum twinkle speed multiplier
  // alphaBoost  : overall star brightness multiplier
  const MOOD_THEMES = {

    // Default — deep space purple/blue, neutral
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

    // Focused — sharp cold blue-white, crisp and clear, minimal distraction
    // Fast subtle twinkle simulates high-alertness / sharp mental state
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
      twinkleMin: 0.6,   // faster twinkle = alert, sharp
      twinkleMax: 1.8,
      alphaBoost: 1.15,  // slightly brighter = high clarity
    },

    // Planning — amber/gold tones, organised and thoughtful
    // Slower twinkle = steady, methodical thinking
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
      twinkleMin: 0.2,   // slow, calm twinkle = thoughtful
      twinkleMax: 0.7,
      alphaBoost: 0.95,
    },

    // Recharge — soft green/teal, restorative and calm
    // Very slow twinkle = restful, low stimulation
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
      twinkleMin: 0.15,  // very slow, gentle twinkle = restful
      twinkleMax: 0.5,
      alphaBoost: 0.85,  // slightly dimmer = softer on the eyes
    },
  };

  // ── Active theme state ───────────────────────────────────────────────────
  // currentTheme  : the theme object currently being displayed
  // targetTheme   : the theme we are transitioning toward
  // themeT        : transition progress 0 → 1  (0 = currentTheme, 1 = targetTheme)
  // THEME_SPEED   : how fast the transition completes (per frame at 60fps)
  let activeMoodKey   = localStorage.getItem('active-mood') || 'default';
  let currentTheme    = MOOD_THEMES[activeMoodKey] || MOOD_THEMES.default;
  let targetTheme     = currentTheme;
  let themeT          = 1.0; // start fully settled
  const THEME_SPEED   = 0.008; // ~125 frames (~2 sec) to fully transition

  // Read mood change fired by CongruencePage when user selects a mood
  window.addEventListener('mood-change', () => {
    const newMoodKey = localStorage.getItem('active-mood') || 'default';
    const newTheme   = MOOD_THEMES[newMoodKey] || MOOD_THEMES.default;

    // Only start a transition if the theme actually changed
    if (newMoodKey !== activeMoodKey) {
      activeMoodKey = newMoodKey;
      currentTheme  = targetTheme; // freeze whatever colour we're at now as the start
      targetTheme   = newTheme;
      themeT        = 0;           // restart transition from 0
      // Rebuild stars with new palette
      stars      = makeStars();
      cosmicMist = makeCosmicMist();
    }
  });

  // Returns the interpolated value between currentTheme and targetTheme
  // at the current transition progress (themeT)
  function getThemeBg() {
    return lerpRGB(currentTheme.bg, targetTheme.bg, themeT);
  }

  // ── User settings ─────────────────────────────────────────────────────────
  // These are written by AppearancePage.tsx and read here
  let optScroll    = localStorage.getItem('star-scroll')    === 'true';
  let optMouseLook = localStorage.getItem('star-mouselook') !== 'false'; // default on
  let scrollSpeed  = parseFloat(localStorage.getItem('star-scroll-speed') || '3');
  let scrollX      = 0;
  const BASE_SCROLL_RATE = 0.00006;

  // Re-read settings whenever AppearancePage fires this event
  window.addEventListener('starfield-update', () => {
    optScroll    = localStorage.getItem('star-scroll')    === 'true';
    optMouseLook = localStorage.getItem('star-mouselook') !== 'false';
    scrollSpeed  = parseFloat(localStorage.getItem('star-scroll-speed') || '3');
    if (!optScroll) scrollX = 0;
    applyScreenTint();
  });

  // ── Screen tint overlay ──────────────────────────────────────────────────
  // Reads tint settings from localStorage and applies them to #screen-tint div.
  // Called on init, on starfield-update, and on mood-change.
  //
  // localStorage keys used:
  //   tint-default-h      : default hue (0-360)
  //   tint-default-s      : default strength/opacity (0-1)
  //   tint-<mood>-h       : per-mood hue override
  //   tint-<mood>-s       : per-mood strength override
  //   tint-<mood>-enabled : "true" if per-mood override is active
  function applyScreenTint() {
    const tintEl = document.getElementById('screen-tint');
    if (!tintEl) return;

    const mood        = localStorage.getItem('active-mood') || 'default';
    const moodEnabled = localStorage.getItem(`tint-${mood}-enabled`) === 'true';

    let hue, strength;
    if (moodEnabled && mood !== 'default') {
      hue      = parseFloat(localStorage.getItem(`tint-${mood}-h`)   || '0');
      strength = parseFloat(localStorage.getItem(`tint-${mood}-s`)   || '0');
    } else {
      hue      = parseFloat(localStorage.getItem('tint-default-h')   || '0');
      strength = parseFloat(localStorage.getItem('tint-default-s')   || '0');
    }

    if (strength <= 0) {
      tintEl.style.opacity = '0';
    } else {
      tintEl.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
      tintEl.style.opacity          = String(Math.min(0.35, strength * 0.35));
    }
  }

  // Apply tint when mood changes too
  window.addEventListener('mood-change', () => {
    // small delay so localStorage is updated before we read it
    setTimeout(applyScreenTint, 50);
  });

  // Init tint on load
  applyScreenTint();

  // ── Star layer config ─────────────────────────────────────────────────────
  // Each layer has different size, speed and brightness.
  // Lower speed = further away (background), higher speed = closer (foreground).
  const LAYERS = [
    { count: 280, minR: 0.3, maxR: 0.7, speed: 0.4, alpha: 0.35 }, // far background
    { count: 180, minR: 0.5, maxR: 1.0, speed: 1.0, alpha: 0.55 },
    { count: 100, minR: 0.8, maxR: 1.5, speed: 1.8, alpha: 0.72 },
    { count: 55,  minR: 1.2, maxR: 2.2, speed: 3.0, alpha: 0.85 },
    { count: 22,  minR: 1.8, maxR: 3.0, speed: 5.0, alpha: 0.95 },
    { count:  8,  minR: 2.5, maxR: 4.0, speed: 8.0, alpha: 1.0  }, // close foreground
  ];

  // Build all stars using the current mood theme's star colour palette
  function makeStars() {
    const theme = targetTheme;
    return LAYERS.map(l =>
      Array.from({ length: l.count }, () => {
        const color = pick(theme.stars);
        const rgb   = hexToRGB(color);
        return {
          x:            rng(0, 1),
          y:            rng(0, 1),
          r:            rng(l.minR, l.maxR),
          colorFrom:    [...rgb],
          // Twinkle speed uses the mood's range so calm moods twinkle slowly
          alpha:        rng(l.alpha * 0.7, l.alpha),
          twinkle:      rng(0, Math.PI * 2),
          twinkleSpeed: rng(theme.twinkleMin, theme.twinkleMax),
          speed:        l.speed,
        };
      })
    );
  }

  // Build cosmic mist blobs using the current mood theme's mist colours
  function makeCosmicMist() {
    const theme = targetTheme;
    return Array.from({ length: 4 }, () => ({
      x:     rng(0, 1),
      y:     rng(0, 1),
      rx:    rng(350, 600),
      ry:    rng(200, 320),
      color: pick(theme.mist),  // mood-tinted nebula
      a:     rng(0.022, 0.048),
      speed: rng(0.04, 0.10),
    }));
  }

  let stars      = makeStars();
  let cosmicMist = makeCosmicMist();

  // ── Mouse parallax ────────────────────────────────────────────────────────
  // mx/my are raw mouse position (-1 to 1 from centre)
  // smx/smy are smoothed versions (lerped each frame for fluid motion)
  let mx = 0, my = 0, smx = 0, smy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Main draw loop ────────────────────────────────────────────────────────
  let t  = 0;
  const DT = 0.016; // fixed timestep (~60fps)

  function draw() {
    t += DT;

    // ── Advance theme transition ────────────────────────────────────────
    // themeT moves from 0 to 1; once at 1 the transition is complete
    if (themeT < 1) {
      themeT = Math.min(1, themeT + THEME_SPEED);
    }

    // ── Scroll / mouse-look ─────────────────────────────────────────────
    if (optScroll) {
      // Auto-scroll mode: advance scrollX each frame, suppress horizontal mouse
      scrollX += BASE_SCROLL_RATE * scrollSpeed;
      smx += (0 - smx) * 0.05;
      smy += ((optMouseLook ? my : 0) - smy) * 0.05;
    } else {
      // Mouse-look mode: stars drift toward mouse position
      smx += ((optMouseLook ? mx : 0) - smx) * 0.05;
      smy += ((optMouseLook ? my : 0) - smy) * 0.05;
    }

    // ── Background fill ─────────────────────────────────────────────────
    // Colour interpolates between current and target mood theme
    const [br, bg, bb] = getThemeBg();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgb(${br},${bg},${bb})`;
    ctx.fillRect(0, 0, W, H);

    // ── Cosmic mist (nebula blobs behind stars) ──────────────────────────
    // Each blob is a soft radial gradient, offset by parallax + scroll
    cosmicMist.forEach(n => {
      const ox = smx * n.speed * W * 0.10 - scrollX * n.speed * W;
      const oy = smy * n.speed * H * 0.10;
      const cx = n.x * W + ox;
      const cy = n.y * H + oy;

      // Interpolate mist colour toward target theme mist over time
      // (mist colour itself doesn't change per-blob, but alphaBoost shifts)
      const [r, g, b] = n.color;
      const mistAlpha  = n.a * lerpValue(currentTheme.alphaBoost, targetTheme.alphaBoost, themeT);

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.rx);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${mistAlpha})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${mistAlpha * 0.3})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.save();
      ctx.scale(1, n.ry / n.rx); // squish to ellipse
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy * (n.rx / n.ry), n.rx, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // ── Stars ────────────────────────────────────────────────────────────
    // Each star's brightness pulses (twinkle) at its own speed.
    // alphaBoost from the mood theme makes calm moods dimmer, sharp ones brighter.
    const alphaBoost = lerpValue(currentTheme.alphaBoost, targetTheme.alphaBoost, themeT);

    stars.forEach(layer => {
      layer.forEach(s => {
        // Apply parallax offset + scroll offset, then wrap around screen edges
        const ox = smx * s.speed * W * 0.04 - scrollX * s.speed * W;
        const oy = smy * s.speed * H * 0.04;
        const px = ((s.x * W + ox) % W + W) % W;
        const py = ((s.y * H + oy) % H + H) % H;

        // Twinkle: oscillates between 0.75 and 1.0 brightness
        const tw = 0.75 + 0.25 * Math.sin(t * s.twinkleSpeed + s.twinkle);

        ctx.globalAlpha = Math.min(1, s.alpha * tw * alphaBoost);
        const [r, g, b] = s.colorFrom;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r * Math.min(2.0, tw), 0, Math.PI * 2);
        ctx.fill();

        // Larger stars also get a soft glow halo
        if (s.r > 2.0) {
          ctx.globalAlpha = Math.min(0.6, s.alpha * tw * 0.2 * alphaBoost);
          ctx.beginPath();
          ctx.arc(px, py, s.r * Math.min(3.5, tw * 2.5), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  // Simple scalar lerp helper (used for alphaBoost interpolation)
  function lerpValue(a, b, t) {
    return a + (b - a) * t;
  }

  draw();

})();
