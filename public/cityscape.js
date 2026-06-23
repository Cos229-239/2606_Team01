// ============================================================
// cityscape.js  — BetterEveryDay procedural city background
// ============================================================
// OPTIMIZATIONS vs previous version:
//   - Loop pauses itself (cancelAnimationFrame) when not active.
//     Restarts instantly on background-update / timer-background-update.
//     Only ONE canvas animates at a time.
//   - Real dt from performance.now() with 50ms cap.
//   - Buildings pre-rendered onto offscreen canvases per layer
//     so the expensive per-building draw only runs on resize,
//     not every frame. Each frame just blits two copies with offset.
//   - Planes use real dt (were already doing this).
//   - canvas hint: alpha:false so browser skips alpha compositing.
// ============================================================

(function () {

  const canvas = document.getElementById('city-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.style.willChange = 'transform';
  let W, H;

  const HORIZON   = 0.70;
  const FAR_BASE  = 0.58;
  const MID_BASE  = 0.65;
  const NEAR_BASE = HORIZON;

  // ── Timer window detection ─────────────────────────────────────────────
  const IS_TIMER = window.location.pathname.includes('/timer');

  // ── Active check ──────────────────────────────────────────────────────
  function isActive() {
    if (IS_TIMER) {
      return (localStorage.getItem('timer-background') ?? 'starfield') === 'city';
    }
    return (localStorage.getItem('background-mode') ?? 'starfield') === 'city';
  }

  // ── Visibility + loop control ─────────────────────────────────────────
  let rafId = null;

  function syncVisibility() {
    const on = isActive();
    canvas.style.display = on ? 'block' : 'none';
    const starCanvas = document.getElementById('star-canvas');
    if (starCanvas) starCanvas.style.display = on ? 'none' : 'block';
    applyCityTint();

    if (on && rafId === null) {
      lastNow = performance.now();
      rafId = requestAnimationFrame(draw);
    } else if (!on && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('background-update',       syncVisibility);
  window.addEventListener('timer-background-update', syncVisibility);

  // ── City settings ─────────────────────────────────────────────────────
  let cityScrollSpeed = parseFloat(localStorage.getItem('city-scroll-speed') || '40');

  window.addEventListener('cityscape-update', () => {
    cityScrollSpeed = parseFloat(localStorage.getItem('city-scroll-speed') || '40');
    applyCityTint();
  });

  // ── City screen tint ──────────────────────────────────────────────────
  function applyCityTint() {
    if (!isActive()) return;
    const tintEl = document.getElementById('screen-tint');
    if (!tintEl) return;
    const hue      = parseFloat(localStorage.getItem('city-tint-h') || '30');
    const strength = parseFloat(localStorage.getItem('city-tint-s') || '0');
    if (strength <= 0) {
      tintEl.style.opacity = '0';
    } else {
      tintEl.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
      tintEl.style.opacity = String(Math.min(0.35, strength * 0.35));
    }
  }
  applyCityTint();

  // ── RNG ───────────────────────────────────────────────────────────────
  function makeRng(seed) {
    let s = seed >>> 0;
    return function () {
      s += 0x6D2B79F5;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const rng  = (a, b, r) => a + r() * (b - a);
  const irng = (a, b, r) => Math.floor(rng(a, b + 1, r));

  // ── SKY ───────────────────────────────────────────────────────────────
  function drawSky() {
    const skyH = H * HORIZON;
    const g = ctx.createLinearGradient(0, 0, 0, skyH);
    g.addColorStop(0.00, '#08051a');
    g.addColorStop(0.25, '#130a2e');
    g.addColorStop(0.50, '#2e0f4a');
    g.addColorStop(0.70, '#3a0f35');
    g.addColorStop(0.82, '#8a2a18');
    g.addColorStop(0.92, '#d06010');
    g.addColorStop(1.00, '#e87820');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, skyH);
    ctx.fillStyle = '#06040e';
    ctx.fillRect(0, skyH, W, H - skyH);
    const bloom = ctx.createRadialGradient(W*0.5, skyH, 0, W*0.5, skyH, W*0.55);
    bloom.addColorStop(0,   'rgba(230,110,20,0.28)');
    bloom.addColorStop(0.5, 'rgba(180,70,10,0.08)');
    bloom.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = bloom;
    ctx.fillRect(0, skyH*0.80, W, skyH*0.20);
  }

  // ── MOON ──────────────────────────────────────────────────────────────
  const MOON_X = 0.78, MOON_Y = 0.12, MOON_R = 42;
  function drawMoon() {
    const mx = MOON_X*W, my = MOON_Y*H, mr = MOON_R;
    const halo = ctx.createRadialGradient(mx, my, mr*0.6, mx, my, mr*3.5);
    halo.addColorStop(0,   'rgba(215,205,175,0.18)');
    halo.addColorStop(0.5, 'rgba(195,185,150,0.06)');
    halo.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(mx, my, mr*3.5, 0, Math.PI*2); ctx.fill();
    const size = mr*3;
    const oc = document.createElement('canvas');
    oc.width = oc.height = size*2;
    const oc2 = oc.getContext('2d');
    const cx = size, cy = size;
    const lit = oc2.createRadialGradient(cx+mr*0.15, cy-mr*0.2, 0, cx, cy, mr);
    lit.addColorStop(0,   '#fffbee');
    lit.addColorStop(0.5, '#f0e8c8');
    lit.addColorStop(1,   '#c8bfa0');
    oc2.fillStyle = lit;
    oc2.beginPath(); oc2.arc(cx, cy, mr, 0, Math.PI*2); oc2.fill();
    oc2.globalCompositeOperation = 'destination-out';
    oc2.fillStyle = 'rgba(0,0,0,1)';
    oc2.beginPath(); oc2.arc(cx-mr*0.72, cy-mr*0.04, mr*0.90, 0, Math.PI*2); oc2.fill();
    ctx.drawImage(oc, mx-cx, my-cy);
  }

  // ── STARS ─────────────────────────────────────────────────────────────
  let stars = [];
  function buildStars() {
    const r = makeRng(0xDEADBEEF);
    stars = Array.from({ length: 220 }, () => ({
      x: r(), y: r()*0.60,
      radius: rng(0.3, 1.5, r),
      alpha:  rng(0.25, 0.85, r),
      twinkle: r()*Math.PI*2,
      twinkleSpeed: rng(0.3, 1.2, r),
    }));
  }
  function drawStars(t) {
    stars.forEach(s => {
      const fade = Math.max(0, 1 - Math.max(0, s.y-0.42)/0.18);
      const tw   = 0.72 + 0.28*Math.sin(t*s.twinkleSpeed+s.twinkle);
      ctx.globalAlpha = s.alpha*tw*fade;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(s.x*W, s.y*H, s.radius, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ── CLOUDS ────────────────────────────────────────────────────────────
  let clouds = [];
  function buildClouds() {
    const r = makeRng(0xC10DBABE);
    clouds = [];
    function makeCloud(layer, yFrac, wMin, wMax, hMin, hMax, sMin, sMax, pMin, pMax) {
      const w = rng(wMin,wMax,r), h = rng(hMin,hMax,r);
      const nPuffs = irng(pMin,pMax,r);
      const puffs = Array.from({length:nPuffs}, () => ({
        dx: rng(-w*0.42,w*0.42,r), dy: rng(-h*0.28,h*0.28,r),
        rx: rng(w*0.22,w*0.50,r),  ry: rng(h*0.38,h*0.72,r),
      }));
      return { x:r()*W*2.2, y:yFrac*H, w, h, layer, puffs, speed:rng(sMin,sMax,r) };
    }
    for (let i=0;i<7;i++) clouds.push(makeCloud(0,rng(0.06,0.20,r),100,240,16,34,0.06,0.14,4,7));
    for (let i=0;i<5;i++) clouds.push(makeCloud(1,rng(0.26,0.44,r),200,420,32,64,0.15,0.28,5,9));
    for (let i=0;i<3;i++) clouds.push(makeCloud(2,rng(0.46,0.60,r),300,640,48,92,0.26,0.48,6,11));
  }
  function drawCloud(c, scrollX) {
    const span = W + c.w*2;
    const x = ((c.x - scrollX*c.speed) % span + span) % span - c.w;
    let cr,cg,cb,ca;
    if      (c.layer===0){[cr,cg,cb,ca]=[178,168,218,0.22];}
    else if (c.layer===1){[cr,cg,cb,ca]=[222,162,182,0.32];}
    else                 {[cr,cg,cb,ca]=[255,162,112,0.44];}
    c.puffs.forEach(p => {
      const px=x+p.dx, py=c.y+p.dy;
      const maxR=Math.max(p.rx,p.ry);
      const g=ctx.createRadialGradient(px,py-p.ry*0.22,0,px,py,maxR);
      g.addColorStop(0,    `rgba(${cr},${cg},${cb},${ca})`);
      g.addColorStop(0.45, `rgba(${cr},${cg},${cb},${ca*0.5})`);
      g.addColorStop(1,    `rgba(${cr},${cg},${cb},0)`);
      ctx.save();
      ctx.translate(px,py);
      ctx.scale(1, p.ry/p.rx);
      ctx.fillStyle=g;
      ctx.beginPath(); ctx.arc(0,0,p.rx,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }
  function drawClouds(scrollX) {
    [0,1,2].forEach(layer => clouds.filter(c=>c.layer===layer).forEach(c=>drawCloud(c,scrollX)));
  }

  // ── BUILDINGS ─────────────────────────────────────────────────────────
  // Building metadata is generated once; geometry is pre-rendered to
  // offscreen canvases per layer so each frame only does 2 drawImage calls.
  const BUILD_LAYERS = [
    { seed:0xFA45C001, yBase:FAR_BASE,  minH:0.07, maxH:0.20, minW:20,  maxW:55,
      speed:0.14, fillBase:[18,12,38],  edgeLight:[60,40,110],
      winOpacity:0.42, winColor:[255,210,140], winSize:2, winGap:5 },
    { seed:0xD1DC17A0, yBase:MID_BASE,  minH:0.13, maxH:0.32, minW:35,  maxW:95,
      speed:0.38, fillBase:[12,8,28],   edgeLight:[80,55,140],
      winOpacity:0.55, winColor:[255,222,162], winSize:3, winGap:6 },
    { seed:0xBEEFC17A, yBase:NEAR_BASE, minH:0.22, maxH:0.50, minW:60,  maxW:150,
      speed:0.80, fillBase:[8,5,18],    edgeLight:[100,70,165],
      winOpacity:0.66, winColor:[255,238,185], winSize:4, winGap:8 },
  ];

  let builtLayers = []; // { cfg, totalWidth, offscreen (canvas), buildings }

  function drawDish(cx2, bx, roofY, er, eg, eb) {
    const mastH=14, mx2=bx, baseY=roofY, topY=roofY-mastH;
    cx2.strokeStyle=`rgba(${er},${eg},${eb},0.55)`; cx2.lineWidth=1;
    cx2.beginPath(); cx2.moveTo(mx2,baseY); cx2.lineTo(mx2,topY); cx2.stroke();
    const dW=16,dH=9,lx=mx2-dW*0.5,rx=mx2+dW*0.5,ry=topY-2,cy2=ry+dH;
    cx2.strokeStyle=`rgba(${er+25},${eg+18},${eb+35},0.80)`; cx2.lineWidth=1.5;
    cx2.beginPath(); cx2.moveTo(lx,ry); cx2.quadraticCurveTo(mx2,cy2,rx,ry); cx2.stroke();
    cx2.strokeStyle=`rgba(${er},${eg},${eb},0.50)`; cx2.lineWidth=1;
    cx2.beginPath(); cx2.moveTo(lx,ry); cx2.lineTo(rx,ry); cx2.stroke();
    const focalY=ry-dH*0.7;
    cx2.beginPath(); cx2.moveTo(mx2,ry+dH*0.4); cx2.lineTo(mx2,focalY); cx2.stroke();
    cx2.fillStyle=`rgba(${er+40},${eg+30},${eb+50},0.85)`;
    cx2.beginPath(); cx2.arc(mx2,focalY,1.8,0,Math.PI*2); cx2.fill();
  }

  // Draw a single building onto a given canvas context (offscreen or main)
  function drawBuilding(b, cfg, cx2, ox) {
    const x=b.x+ox, yTop=b.yTop, yBase=b.yBase, w=b.w, bH=b.bH;
    const [br,bg,bb]=cfg.fillBase, s=b.shade, [er,eg,eb]=cfg.edgeLight;
    cx2.save();
    cx2.beginPath(); cx2.rect(x, yTop-60, w+2, bH+60); cx2.clip();
    cx2.fillStyle=`rgb(${br+s},${bg+s},${bb+s})`;
    if (b.shape===2) {
      const taper=Math.min(w*0.10,8);
      cx2.beginPath();
      cx2.moveTo(x-taper,yBase); cx2.lineTo(x+w+taper,yBase);
      cx2.lineTo(x+w,yTop); cx2.lineTo(x,yTop);
      cx2.closePath(); cx2.fill();
    } else { cx2.fillRect(x,yTop,w,bH); }
    const rim=cx2.createLinearGradient(x,0,x+w,0);
    rim.addColorStop(0,    `rgba(${er},${eg},${eb},0.28)`);
    rim.addColorStop(0.07, `rgba(${er},${eg},${eb},0.07)`);
    rim.addColorStop(0.93, `rgba(${er},${eg},${eb},0.04)`);
    rim.addColorStop(1,    `rgba(${er},${eg},${eb},0.22)`);
    cx2.fillStyle=rim; cx2.fillRect(x,yTop,w,bH);
    cx2.fillStyle=`rgba(${er},${eg},${eb},0.32)`; cx2.fillRect(x,yTop,w,1.5);
    const [wr,wg,wb3]=cfg.winColor;
    const gapX=(w-8-b.winCols*cfg.winSize)/Math.max(1,b.winCols-1);
    const gapY=(bH-14-b.winRows*cfg.winSize)/Math.max(1,b.winRows-1);
    for (let col=0;col<b.winCols;col++) {
      for (let row=0;row<b.winRows;row++) {
        if (!b.windowStates[col*b.winRows+row]) continue;
        const wx=x+4+col*(cfg.winSize+gapX);
        const wy=yTop+7+row*(cfg.winSize+gapY);
        const ws=cfg.winSize;
        cx2.fillStyle=`rgba(${wr},${wg},${wb3},${cfg.winOpacity})`;
        cx2.fillRect(wx,wy,ws,ws);
        cx2.strokeStyle=`rgba(${er+30},${eg+20},${eb+40},0.70)`;
        cx2.lineWidth=1; cx2.strokeRect(wx-1,wy-1,ws+2,ws+2);
      }
    }
    const parapetH=b.hasParapet?6:0;
    if (b.hasParapet) {
      cx2.fillStyle=`rgb(${br+s+6},${bg+s+4},${bb+s+9})`;
      cx2.fillRect(x,yTop-parapetH,w,parapetH);
      cx2.fillStyle=`rgba(${er},${eg},${eb},0.28)`;
      cx2.fillRect(x,yTop-parapetH,w,1);
    }
    const roofY=yTop-parapetH;
    if (b.hasAntenna) {
      const ax=x+w*0.48, mH=22+(b.shade%16);
      cx2.strokeStyle=`rgba(${er},${eg},${eb},0.65)`; cx2.lineWidth=1;
      cx2.beginPath(); cx2.moveTo(ax,roofY); cx2.lineTo(ax,roofY-mH); cx2.stroke();
      cx2.beginPath(); cx2.moveTo(ax-5,roofY-mH*0.65); cx2.lineTo(ax+5,roofY-mH*0.65); cx2.stroke();
      cx2.fillStyle='rgba(255,55,55,0.92)';
      cx2.beginPath(); cx2.arc(ax,roofY-mH,1.8,0,Math.PI*2); cx2.fill();
    }
    if (b.hasDish) drawDish(cx2, x+w*0.5, roofY, er, eg, eb);
    cx2.restore();
  }

  // Build metadata arrays + pre-render each layer to an offscreen canvas
  function buildLayers_fn() {
    builtLayers = BUILD_LAYERS.map(cfg => {
      const r = makeRng(cfg.seed);
      const totalWidth = W * 3;
      const buildings = [];
      let x = 0;
      while (x < totalWidth) {
        const w   = rng(cfg.minW, cfg.maxW, r);
        const bH  = rng(cfg.minH, cfg.maxH, r) * H;
        const yBase = cfg.yBase * H;
        const yTop  = yBase - bH;
        const shade = irng(0, 14, r);
        const shape = irng(0, 4, r);
        const winCols = Math.max(1, Math.floor((w-8)  / (cfg.winSize+cfg.winGap)));
        const winRows = Math.max(1, Math.floor((bH-14) / (cfg.winSize+cfg.winGap)));
        if (winCols<2||winRows<2){x+=w+rng(1,5,r);continue;}
        const windowStates = Array.from({length:winCols*winRows}, ()=>r()>0.36);
        const hasParapet = r()>0.38, hasAntenna = r()>0.82;
        const hasTank = r()>0.80, hasDish = r()>0.94;
        const stepW=w*rng(0.35,0.65,r), stepH=bH*rng(0.22,0.42,r), stepX=(w-stepW)*rng(0.1,0.9,r);
        buildings.push({x, yTop, yBase, w, bH, shade, shape,
                        winCols, winRows, windowStates,
                        hasParapet, hasAntenna, hasTank, hasDish,
                        stepW, stepH, stepX});
        x += w + rng(1,5,r);
      }

      // Pre-render all buildings for this layer onto an offscreen canvas
      const oc = document.createElement('canvas');
      oc.width  = totalWidth;
      oc.height = H;
      const oc2 = oc.getContext('2d');
      buildings.forEach(b => drawBuilding(b, cfg, oc2, 0));

      return { cfg, buildings, totalWidth, offscreen: oc };
    });
  }

  // Each frame: just blit the offscreen canvas twice (seamless tiling)
  function drawBuildingLayer(layerData, scrollX) {
    const { cfg, totalWidth, offscreen } = layerData;
    const offset = -((scrollX * cfg.speed % totalWidth) + totalWidth) % totalWidth;
    ctx.drawImage(offscreen, offset, 0);
    ctx.drawImage(offscreen, offset + totalWidth, 0);
  }

  // ── ROAD ──────────────────────────────────────────────────────────────
  function drawRoad(scrollX) {
    const roadY=H*HORIZON, roadH=H-roadY;
    const asphalt=ctx.createLinearGradient(0,roadY,0,H);
    asphalt.addColorStop(0,'#0c0a1e'); asphalt.addColorStop(1,'#07061a');
    ctx.fillStyle=asphalt; ctx.fillRect(0,roadY,W,roadH);
    ctx.fillStyle='rgba(245,160,48,0.30)'; ctx.fillRect(0,roadY,W,2);
    const refl=ctx.createLinearGradient(0,roadY,0,H);
    refl.addColorStop(0,  'rgba(160,90,30,0.15)');
    refl.addColorStop(0.6,'rgba(80,40,10,0.05)');
    refl.addColorStop(1,  'rgba(0,0,0,0)');
    ctx.fillStyle=refl; ctx.fillRect(0,roadY,W,roadH);
    const dashLen=38,dashGap=30,dashCycle=dashLen+dashGap;
    const phase=scrollX%dashCycle;
    ctx.strokeStyle='rgba(255,230,140,0.35)'; ctx.lineWidth=2;
    ctx.setLineDash([dashLen,dashGap]);
    ctx.lineDashOffset=phase;
    ctx.beginPath(); ctx.moveTo(0,roadY+roadH*0.40); ctx.lineTo(W,roadY+roadH*0.40); ctx.stroke();
    ctx.lineDashOffset=phase+dashCycle*0.5;
    ctx.beginPath(); ctx.moveTo(0,roadY+roadH*0.72); ctx.lineTo(W,roadY+roadH*0.72); ctx.stroke();
    ctx.setLineDash([]);
    const sidewalkH=Math.max(8,roadH*0.12);
    ctx.fillStyle='#0e0b20'; ctx.fillRect(0,H-sidewalkH,W,sidewalkH);
    ctx.fillStyle='rgba(130,90,200,0.18)'; ctx.fillRect(0,H-sidewalkH,W,1.5);
  }

  // ── AIRPLANES ─────────────────────────────────────────────────────────
  let planes = [], nextPlaneIn = 0;
  function spawnPlane() {
    const speed=20+Math.random()*25, dir=Math.random()>0.5?1:-1;
    const blinkPeriod=0.8+Math.random()*0.6;
    planes.push({ x:dir>0?-80:W+80, y:H*(0.05+Math.random()*0.20),
                  speed, dir, tailLen:160+Math.random()*200,
                  alpha:0.50+Math.random()*0.32, age:0,
                  maxAge:(W+160)/speed,
                  blinkPeriod, blinkPhase:Math.random()*blinkPeriod });
  }
  function updatePlanes(dt) {
    nextPlaneIn-=dt;
    if (nextPlaneIn<=0){spawnPlane();nextPlaneIn=30+Math.random()*60;}
    planes=planes.filter(p=>p.age<p.maxAge);
    planes.forEach(p=>{p.x+=p.dir*p.speed*dt;p.age+=dt;});
  }
  function drawPlanes() {
    planes.forEach(p => {
      const fadein  = Math.min(1, p.age/3.5);
      const fadeout = Math.max(0, 1-(p.age-(p.maxAge-5))/5);
      const alpha   = p.alpha*fadein*fadeout;
      const tailX   = p.x-p.dir*p.tailLen;
      const g=ctx.createLinearGradient(p.x,p.y,tailX,p.y);
      g.addColorStop(0,  `rgba(255,255,255,${alpha*0.88})`);
      g.addColorStop(0.3,`rgba(245,240,230,${alpha*0.44})`);
      g.addColorStop(1,  'rgba(230,225,215,0)');
      ctx.strokeStyle=g; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(tailX,p.y); ctx.stroke();
      const g2=ctx.createLinearGradient(p.x,p.y,tailX,p.y);
      g2.addColorStop(0,'rgba(255,255,255,'+alpha*0.13+')');
      g2.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=g2; ctx.lineWidth=9;
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(tailX,p.y); ctx.stroke();
      // Body dot
      ctx.fillStyle=`rgba(255,255,255,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,2,0,Math.PI*2); ctx.fill();
      // Blinking nav light
      const blinkT=(p.age+p.blinkPhase)%p.blinkPeriod;
      if (blinkT<p.blinkPeriod*0.35) {
        const lx=p.x+p.dir*5, ly=p.y-3;
        const glow=ctx.createRadialGradient(lx,ly,0,lx,ly,7);
        glow.addColorStop(0,   `rgba(255,60,60,${alpha*0.9})`);
        glow.addColorStop(0.4, `rgba(255,30,30,${alpha*0.35})`);
        glow.addColorStop(1,   'rgba(255,0,0,0)');
        ctx.fillStyle=glow;
        ctx.beginPath(); ctx.arc(lx,ly,7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,100,100,${alpha})`;
        ctx.beginPath(); ctx.arc(lx,ly,1.8,0,Math.PI*2); ctx.fill();
      }
    });
  }

  // ── RESIZE & INIT ─────────────────────────────────────────────────────
  function resize() {
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    buildLayers_fn();
    buildClouds();
    buildStars();
  }
  window.addEventListener('resize', resize);
  resize();

  // ── MAIN LOOP ─────────────────────────────────────────────────────────
  let scrollX=0, t=0, lastNow=performance.now();

  function draw(now) {
    const dt=Math.min((now-lastNow)/1000, 0.05);
    lastNow=now;
    t+=dt;
    scrollX+=cityScrollSpeed*dt;
    updatePlanes(dt);

    drawSky();
    drawMoon();
    drawStars(t);
    drawClouds(scrollX);

    // Far layer
    drawBuildingLayer(builtLayers[0], scrollX);
    ctx.fillStyle='#06040e';
    ctx.fillRect(0, H*FAR_BASE, W, H*(1-FAR_BASE));

    // Mid layer
    drawBuildingLayer(builtLayers[1], scrollX);
    ctx.fillStyle='#06040e';
    ctx.fillRect(0, H*MID_BASE, W, H*(1-MID_BASE));

    drawRoad(scrollX);
    drawBuildingLayer(builtLayers[2], scrollX);
    drawPlanes();

    rafId = requestAnimationFrame(draw);
  }

  nextPlaneIn=20+Math.random()*35;
  syncVisibility(); // kicks off rAF only if active

})();
