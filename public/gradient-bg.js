// ============================================================
// gradient-bg.js
// ------------------------------------------------------------
// Simple customizable gradient background for BetterEveryDay.
//
// HOW IT WORKS:
//   1. A <div id="gradient-bg"> sits fixed behind the app,
//      same layer as the star/city canvases.
//   2. Settings (two colours + angle) are read from localStorage
//      and applied as a CSS linear-gradient.
//   3. Settings update instantly via the "gradient-update" event,
//      fired by AppearancePage when the user tweaks a control.
//   4. Mode switching (which background is active) is shared
//      with starfield.js / cityscape.js via "background-update"
//      and "timer-background-update" events, plus storage events
//      for cross-window sync (e.g. the floating timer window).
//
// BUG FIX: the timer window sets timer-background via its own
// React state, which fires CustomEvents in that same window.
// But when the gradient colours/angle change from the main
// window, those arrive only as storage events — we must call
// applyGradient() (not just syncVisibility) when gradient keys
// change so the colours actually update live.
// ============================================================

(function () {

  const el = document.getElementById('gradient-bg');
  if (!el) return;

  const IS_TIMER = window.location.pathname.includes('/timer');

  function isActive() {
    if (IS_TIMER) return (localStorage.getItem('timer-background') ?? 'starfield') === 'gradient';
    return (localStorage.getItem('background-mode') ?? 'starfield') === 'gradient';
  }

  function hslStr(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Reads the two gradient colour stops, preferring a per-mood override
  // (set on the Appearance page) when the active mood has one enabled —
  // same pattern cityscape.js uses for its own mood-based palette.
  function readColours() {
    const mood = localStorage.getItem('active-mood') || 'Focused';
    const moodEnabled = mood !== 'default' && localStorage.getItem(`gradient-mood-${mood}-enabled`) === 'true';

    const prefix = moodEnabled ? `gradient-mood-${mood}-` : 'gradient-';

    return {
      h1: parseFloat(localStorage.getItem(`${prefix}h1`) ?? '220'),
      s1: parseFloat(localStorage.getItem(`${prefix}s1`) ?? '70'),
      l1: parseFloat(localStorage.getItem(`${prefix}l1`) ?? '18'),
      h2: parseFloat(localStorage.getItem(`${prefix}h2`) ?? '280'),
      s2: parseFloat(localStorage.getItem(`${prefix}s2`) ?? '60'),
      l2: parseFloat(localStorage.getItem(`${prefix}l2`) ?? '8'),
    };
  }

  function applyGradient() {
    const { h1, s1, l1, h2, s2, l2 } = readColours();
    const angle = parseFloat(localStorage.getItem('gradient-angle') ?? '160');

    el.style.background = `linear-gradient(${angle}deg, ${hslStr(h1, s1, l1)}, ${hslStr(h2, s2, l2)})`;
  }

  // ── Visibility control ────────────────────────────────────────────────────
  function syncVisibility() {
    const on = isActive();
    el.style.display = on ? 'block' : 'none';
    if (on) {
      applyGradient();
      // Gradient mode has its own colours — make sure the screen tint
      // overlay (used by starfield/city) stays switched off.
      const tintEl = document.getElementById('screen-tint');
      if (tintEl) tintEl.style.opacity = '0';
    }
  }

  window.addEventListener('background-update',       syncVisibility);
  window.addEventListener('timer-background-update', syncVisibility);

  // In-window gradient colour/angle changes (from AppearancePage in same tab)
  window.addEventListener('gradient-update', () => {
    if (isActive()) applyGradient();
  });

  // In-window mood changes (from CongruencePage in same tab) — re-apply so
  // any enabled per-mood gradient override takes effect immediately.
  window.addEventListener('mood-change', () => {
    if (isActive()) applyGradient();
  });

  // Re-sync when window regains focus (cross-window, e.g. timer window)
  window.addEventListener('focus', syncVisibility);

  // Cross-tab/window sync via storage events.
  // Split into two cases so we can apply colours even if visibility hasn't changed.
  const MODE_KEYS   = new Set(['background-mode', 'timer-background']);
  const COLOUR_KEYS = new Set([
    'gradient-h1', 'gradient-s1', 'gradient-l1',
    'gradient-h2', 'gradient-s2', 'gradient-l2',
    'gradient-angle',
  ]);

  window.addEventListener('storage', (e) => {
    const k = e.key ?? '';
    if (MODE_KEYS.has(k)) {
      syncVisibility();
    } else if (k === 'active-mood') {
      // Mood changed in another window — re-apply colours if a per-mood
      // override is enabled for the new mood.
      if (isActive()) applyGradient();
    } else if (COLOUR_KEYS.has(k) || k.startsWith('gradient-mood-')) {
      // Colour/angle (global or per-mood) changed; update the gradient if
      // we're currently visible AND re-run syncVisibility in case mode
      // also just became gradient
      syncVisibility();
      if (isActive()) applyGradient();
    }
  });

  syncVisibility();

})();
