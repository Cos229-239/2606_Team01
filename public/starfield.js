// ── Starry Parallax Background ─────────────────────────────────────────────
// Extracted and adapted from Universe project for BetterEveryDay
(function () {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); stars = makeStars(); cosmicMist = makeCosmicMist(); });

  // helpers
  const rng  = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  function hexToRGB(hex) {
    const h = hex.replace('#','');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }

  // ── Star config ──────────────────────────────────────────────────────────
  const STAR_COLORS = [
    '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    '#ffffff','#ffffff','#ffffff','#ffffff','#ffffff',
    '#fffef5','#fffef5','#fffef5','#fffef5',
    '#fff8e8','#fff8e8','#fff8e8',
    '#ffefc0','#ffefc0',
    '#cce0ff','#cce0ff',
    '#b8d4ff','#ffd090','#ffb870','#ff9060',
  ];

  const LAYERS = [
    { count: 280, minR: 0.3, maxR: 0.7, speed: 0.4, alpha: 0.35 },
    { count: 180, minR: 0.5, maxR: 1.0, speed: 1.0, alpha: 0.55 },
    { count: 100, minR: 0.8, maxR: 1.5, speed: 1.8, alpha: 0.72 },
    { count: 55,  minR: 1.2, maxR: 2.2, speed: 3.0, alpha: 0.85 },
    { count: 22,  minR: 1.8, maxR: 3.0, speed: 5.0, alpha: 0.95 },
    { count:  8,  minR: 2.5, maxR: 4.0, speed: 8.0, alpha: 1.0  },
  ];

  function makeStars() {
    return LAYERS.map(l =>
      Array.from({ length: l.count }, () => {
        const color = pick(STAR_COLORS);
        const rgb = hexToRGB(color);
        return {
          x: rng(0, 1), y: rng(0, 1),
          r: rng(l.minR, l.maxR),
          color, colorFrom: [...rgb], colorTo: [...rgb],
          alpha: rng(l.alpha * 0.7, l.alpha),
          twinkle: rng(0, Math.PI * 2),
          twinkleSpeed: rng(0.3, 1.2),
          speed: l.speed,
        };
      })
    );
  }

  // ── Cosmic mist ──────────────────────────────────────────────────────────
  const MIST_PALETTE = [
    [60,30,140],[20,60,160],[100,20,100],[30,80,130],[80,20,120],
    [40,20,160],[70,40,130],[20,50,140],[90,10,110],[50,60,150],
  ];
  function makeCosmicMist() {
    return Array.from({ length: 4 }, () => ({
      x: rng(0,1), y: rng(0,1),
      rx: rng(350,600), ry: rng(200,320),
      color: pick(MIST_PALETTE),
      a: rng(0.022, 0.048),
      speed: rng(0.04, 0.10),
    }));
  }

  let stars = makeStars();
  let cosmicMist = makeCosmicMist();

  // ── Mouse parallax ───────────────────────────────────────────────────────
  let mx = 0, my = 0, smx = 0, smy = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── BG color (matches app --bg-base) ────────────────────────────────────
  const BG = [7, 4, 26];

  let t = 0;
  const DT = 0.016;

  function draw() {
    t += DT;
    smx += (mx - smx) * 0.05;
    smy += (my - smy) * 0.05;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = `rgb(${BG[0]},${BG[1]},${BG[2]})`;
    ctx.fillRect(0, 0, W, H);

    // Cosmic mist
    cosmicMist.forEach(n => {
      const ox = smx * n.speed * W * 0.10;
      const oy = smy * n.speed * H * 0.10;
      const cx = n.x * W + ox, cy = n.y * H + oy;
      const [r, g, b] = n.color;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.rx);
      grad.addColorStop(0,   `rgba(${r},${g},${b},${n.a})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${n.a * 0.3})`);
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
        const ox = smx * s.speed * W * 0.04;
        const oy = smy * s.speed * H * 0.04;
        const px = ((s.x * W + ox) % W + W) % W;
        const py = ((s.y * H + oy) % H + H) % H;
        const tw = 0.75 + 0.25 * Math.sin(t * s.twinkleSpeed + s.twinkle);
        ctx.globalAlpha = Math.min(1, s.alpha * tw);
        const [r, g, b] = s.colorFrom;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r * Math.min(2.0, tw), 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 2.0) {
          ctx.globalAlpha = Math.min(0.6, s.alpha * tw * 0.2);
          ctx.beginPath();
          ctx.arc(px, py, s.r * Math.min(3.5, tw * 2.5), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
})();
