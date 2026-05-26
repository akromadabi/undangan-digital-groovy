/* ═══════════════════════════════════════════════════════
   COSMIC DRIFT — app.js
   Deep Space Greeting Card — Full Interactivity
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   CONFIG — Tweak here for different greetings
   ──────────────────────────────────────── */
const CONFIG = {
    greeting:   'Selamat Ulang Tahun',
    recipient:  'Bunda Tercinta',
    sender:     'Dari Ananda, dengan sepenuh cinta',
    message:    `Di antara milyaran bintang yang bertebaran di galaksi ini, tidak satupun yang bisa menandingi cahaya cintamu yang menerangi hidupku setiap hari. Terima kasih sudah menjadi bintang <strong>paling terang</strong> di semestaku. Semoga setiap hari dipenuhi kebahagiaan yang tak terbatas, seperti luasnya jagad raya ini. ✨`,
    coordText:  '03°22\'14"S  116°44\'09"E  ALT: 408KM',
    starCount:  180,
    audioEnabled: true,
};

/* ────────────────────────────────────────
   FLOATING MESSAGE SNIPPETS
   ──────────────────────────────────────── */
const FLOAT_MESSAGES = [
    'Semesta menyaksiakan betapa aku mencintaimu 🌙',
    '"Cintamu adalah gravitasi yang mengorbitkan hidupku"',
    '∞ untuk selamanya',
    'Di antara bintang-bintang, kaulah yang paling terang ✦',
    'You are my favorite constellation',
    'Cahayamu menembus jarak jutaan tahun cahaya 💙',
    'من أنت إلا نور في حياتي',
    '사랑해 — I love you across all galaxies',
    'Every star was made to find you ✨',
    'Perjalanan kita belum selesai... masih ada milyaran galaksi 🌌',
];

/* ────────────────────────────────────────
   STATE
   ──────────────────────────────────────── */
const S = {
    opened: false,
    audioCtx: null,
    audioNodes: {},
    isPlaying: false,
    mouseX: 0,
    mouseY: 0,
    rocketLaunched: false,
    constellationDrawn: false,
    customMessages: [],
    shootingStarTimeout: null,
};

/* ────────────────────────────────────────
   DOM
   ──────────────────────────────────────── */
let D = {};

/* ─── Canvas contexts ─── */
let starCtx, nebulaCtx, dustCtx, constCtx, fxCtx;
let W, H;

/* ─── Stars pool ─── */
let stars   = [];
let nebulas  = [];
let constellationLines = [];
let shootingStars = [];
let floatBubbles = [];

/* ═══════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    cacheDOM();
    fillContent();
    resizeCanvases();
    initStars();
    initNebula();
    initConstellation();
    requestAnimationFrame(renderLoop);
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('deviceorientation', onGyro);
    D.cover.addEventListener('click', onCoverClick);
    D.openBtn.addEventListener('click', openCard);
    D.launchBtn.addEventListener('click', startRocketLaunch);
    D.writeBtn.addEventListener('click', openWriteModal);
    D.audioBtn.addEventListener('click', toggleAudio);
    D.modalCancel.addEventListener('click', closeWriteModal);
    D.modalSend.addEventListener('click', sendCustomMessage);
    D.rocketClose.addEventListener('click', closeRocketOverlay);
    D.fxCanvas.addEventListener('click', onCanvasClick);
    startCoordsTick();
});

function cacheDOM() {
    D.cover           = document.getElementById('cd-cover');
    D.openBtn         = document.getElementById('cd-open-btn');
    D.main            = document.getElementById('cd-main');
    D.messageCard     = document.getElementById('cd-message-card');
    D.launchBtn       = document.getElementById('cd-launch-btn');
    D.writeBtn        = document.getElementById('cd-write-btn');
    D.audioBtn        = document.getElementById('cd-audio-btn');
    D.writeModal      = document.getElementById('cd-write-modal');
    D.modalName       = document.getElementById('cd-modal-name');
    D.modalMsg        = document.getElementById('cd-modal-msg');
    D.modalSend       = document.getElementById('cd-modal-send');
    D.modalCancel     = document.getElementById('cd-modal-cancel');
    D.rocketOverlay   = document.getElementById('cd-rocket-overlay');
    D.rocket          = document.getElementById('cd-rocket');
    D.launchLog       = document.getElementById('cd-launch-log');
    D.launchBar       = document.getElementById('cd-launch-bar');
    D.rocketClose     = document.getElementById('cd-rocket-close');
    D.orbitMsg        = document.getElementById('cd-orbit-msg');
    D.toast           = document.getElementById('cd-toast');
    D.coords          = document.getElementById('cd-coords');
    D.starCanvas      = document.getElementById('cd-stars');
    D.nebulaCanvas    = document.getElementById('cd-nebula');
    D.dustCanvas      = document.getElementById('cd-dust');
    D.constCanvas     = document.getElementById('cd-constellations');
    D.fxCanvas        = document.getElementById('cd-effects');

    starCtx   = D.starCanvas.getContext('2d');
    nebulaCtx = D.nebulaCanvas.getContext('2d');
    dustCtx   = D.dustCanvas.getContext('2d');
    constCtx  = D.constCanvas.getContext('2d');
    fxCtx     = D.fxCanvas.getContext('2d');
}

function fillContent() {
    const g = document.getElementById('cd-greeting');
    const r = document.getElementById('cd-recipient');
    const m = document.getElementById('cd-message');
    const se = document.getElementById('cd-sender');
    if (g)  g.textContent  = CONFIG.greeting;
    if (r)  r.textContent  = CONFIG.recipient;
    if (m)  m.innerHTML    = CONFIG.message;
    if (se) se.textContent = CONFIG.sender;
}

/* ═══════════════════════════════════════════════════
   RESIZE
   ═══════════════════════════════════════════════════ */
function resizeCanvases() {
    W = window.innerWidth;
    H = window.innerHeight;
    [D.starCanvas, D.nebulaCanvas, D.dustCanvas, D.constCanvas, D.fxCanvas].forEach(c => {
        c.width  = W;
        c.height = H;
    });
}

function onResize() {
    resizeCanvases();
    initStars();
    initNebula();
    if (S.constellationDrawn) drawConstellation(1);
}

/* ═══════════════════════════════════════════════════
   STARS
   ═══════════════════════════════════════════════════ */
function initStars() {
    stars = [];
    for (let i = 0; i < CONFIG.starCount; i++) {
        stars.push(makeStar());
    }
}

function makeStar() {
    const tier = Math.random();
    let size, speed, brightness;
    if (tier < 0.6) { size = Math.random() * .8 + .3; speed = .008 + Math.random() * .006; brightness = .4 + Math.random() * .4; }
    else if (tier < 0.9) { size = Math.random() * 1.2 + .7; speed = .012 + Math.random() * .008; brightness = .6 + Math.random() * .4; }
    else { size = Math.random() * 2 + 1.5; speed = .018 + Math.random() * .01; brightness = .85 + Math.random() * .15; }

    const hueOpts = [0, 200, 220, 260, 300, 40];
    const hue = hueOpts[Math.floor(Math.random() * hueOpts.length)];

    return {
        x: Math.random() * W,
        y: Math.random() * H,
        size,
        speed,
        brightness,
        twinkleSpeed: .015 + Math.random() * .025,
        twinklePhase: Math.random() * Math.PI * 2,
        hue,
        parallaxDepth: .15 + Math.random() * .85,
        baseX: 0,
        baseY: 0,
        isSpecial: Math.random() < 0.04, // 4% are clickable / constellation nodes
        specialLabel: '',
    };
}

function renderStars(dt) {
    starCtx.clearRect(0, 0, W, H);

    const px = (S.mouseX / W - .5) * 28;
    const py = (S.mouseY / H - .5) * 28;

    stars.forEach(s => {
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = .5 + .5 * Math.sin(s.twinklePhase);
        const alpha = s.brightness * (.5 + .5 * twinkle);

        const ox = px * s.parallaxDepth;
        const oy = py * s.parallaxDepth;

        const x = s.x + ox;
        const y = s.y + oy;

        // Glow for bright stars
        if (s.size > 1.2) {
            const grad = starCtx.createRadialGradient(x, y, 0, x, y, s.size * 3);
            grad.addColorStop(0, `hsla(${s.hue},80%,90%,${alpha * .7})`);
            grad.addColorStop(1, 'transparent');
            starCtx.beginPath();
            starCtx.arc(x, y, s.size * 3, 0, Math.PI * 2);
            starCtx.fillStyle = grad;
            starCtx.fill();
        }

        // Core
        starCtx.beginPath();
        starCtx.arc(x, y, s.size, 0, Math.PI * 2);
        starCtx.fillStyle = `hsla(${s.hue},60%,95%,${alpha})`;
        starCtx.fill();

        // Cross spike for large stars
        if (s.size > 1.8) {
            starCtx.save();
            starCtx.globalAlpha = alpha * .5;
            starCtx.strokeStyle = `hsla(${s.hue},60%,95%,1)`;
            starCtx.lineWidth = .5;
            const spike = s.size * 4;
            starCtx.beginPath();
            starCtx.moveTo(x - spike, y); starCtx.lineTo(x + spike, y);
            starCtx.moveTo(x, y - spike); starCtx.lineTo(x, y + spike);
            starCtx.stroke();
            starCtx.restore();
        }
    });

    // Shooting stars
    renderShootingStars();
}

/* ─── Shooting Stars ─── */
function spawnShootingStar(x, y) {
    const angle = -Math.PI / 6 + (Math.random() - .5) * .4;
    const speed = 8 + Math.random() * 8;
    shootingStars.push({
        x: x ?? Math.random() * W * .7,
        y: y ?? Math.random() * H * .4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: .018 + Math.random() * .012,
        tail: [],
    });
}

function renderShootingStars() {
    shootingStars = shootingStars.filter(ss => ss.life > 0);
    shootingStars.forEach(ss => {
        ss.tail.push({ x: ss.x, y: ss.y, life: ss.life });
        if (ss.tail.length > 20) ss.tail.shift();

        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;

        // Draw tail
        for (let i = 0; i < ss.tail.length - 1; i++) {
            const t  = ss.tail[i];
            const t1 = ss.tail[i + 1];
            const alpha = (i / ss.tail.length) * ss.life * .8;
            starCtx.beginPath();
            starCtx.moveTo(t.x, t.y);
            starCtx.lineTo(t1.x, t1.y);
            starCtx.strokeStyle = `rgba(255,255,255,${alpha})`;
            starCtx.lineWidth = alpha * 2;
            starCtx.stroke();
        }

        // Head
        starCtx.beginPath();
        starCtx.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(255,255,255,${ss.life})`;
        starCtx.fill();
    });
}

// Random shooting star every 8-15s
function scheduleShootingStar() {
    const delay = 8000 + Math.random() * 7000;
    setTimeout(() => {
        spawnShootingStar();
        scheduleShootingStar();
    }, delay);
}

/* ═══════════════════════════════════════════════════
   NEBULA (multi-layer animated blobs)
   ═══════════════════════════════════════════════════ */
function initNebula() {
    nebulas = [
        { cx: W * .3, cy: H * .3, rx: W * .55, ry: H * .55, hue: 220, alpha: .12, speed: .0003 },
        { cx: W * .7, cy: H * .6, rx: W * .5,  ry: H * .5,  hue: 270, alpha: .09, speed: .0004 },
        { cx: W * .5, cy: H * .5, rx: W * .65, ry: H * .65, hue: 200, alpha: .07, speed: .0002 },
        { cx: W * .2, cy: H * .7, rx: W * .35, ry: H * .35, hue: 310, alpha: .06, speed: .0005 },
    ];
    nebulas.forEach(n => { n.t = Math.random() * Math.PI * 2; });
}

let nebulaT = 0;
function renderNebula() {
    nebulaCtx.clearRect(0, 0, W, H);
    nebulaT += .002;

    const px = (S.mouseX / W - .5) * 14;
    const py = (S.mouseY / H - .5) * 14;

    nebulas.forEach((n, i) => {
        n.t += n.speed;
        const wobble = Math.sin(n.t) * 0.12;
        const rx = n.rx * (1 + wobble);
        const ry = n.ry * (1 - wobble * .5);
        const cx = n.cx + px * (i % 2 === 0 ? .3 : -.3);
        const cy = n.cy + py * (i % 2 === 0 ? .2 : -.2);

        const grad = nebulaCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        grad.addColorStop(0,   `hsla(${n.hue},80%,50%,${n.alpha})`);
        grad.addColorStop(.4,  `hsla(${n.hue + 20},70%,35%,${n.alpha * .5})`);
        grad.addColorStop(1,   'transparent');

        nebulaCtx.save();
        nebulaCtx.translate(cx, cy);
        nebulaCtx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
        nebulaCtx.beginPath();
        nebulaCtx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
        nebulaCtx.fillStyle = grad;
        nebulaCtx.fill();
        nebulaCtx.restore();
    });
}

/* ─── Dust / stardust particles ─── */
let dustParticles = [];
function initDust() {
    dustParticles = Array.from({ length: 60 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.2 + .2,
        vy: -(Math.random() * .25 + .05),
        vx: (Math.random() - .5) * .15,
        alpha: Math.random() * .4 + .05,
        hue: [200, 260, 310, 40][Math.floor(Math.random() * 4)],
    }));
}

function renderDust() {
    dustCtx.clearRect(0, 0, W, H);
    dustParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }

        const grad = dustCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        grad.addColorStop(0, `hsla(${p.hue},80%,70%,${p.alpha})`);
        grad.addColorStop(1, 'transparent');

        dustCtx.beginPath();
        dustCtx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        dustCtx.fillStyle = grad;
        dustCtx.fill();
    });
}

/* ═══════════════════════════════════════════════════
   CONSTELLATION — Drawing lines between stars
   ═══════════════════════════════════════════════════ */
const CONSTELLATION_PATTERNS = [
    // Heart shape (9 nodes)
    [
        [.38, .35], [.44, .29], [.50, .27], [.56, .29], [.62, .35],
        [.50, .48], [.38, .35], [.50, .48], [.62, .35]
    ],
];

let constellationProgress = 0;
let constNodes = [];

function initConstellation() {
    const pattern = CONSTELLATION_PATTERNS[0];
    constNodes = pattern.map(([rx, ry]) => ({
        x: rx * W,
        y: ry * H,
        drawn: false,
    }));
    constellationLines = [];
    for (let i = 1; i < constNodes.length; i++) {
        constellationLines.push({ from: i - 1, to: i, progress: 0 });
    }
}

function animateConstellation(dt) {
    if (!S.constellationDrawn) {
        constellationProgress = Math.min(1, constellationProgress + dt * .0006);
        constellationLines.forEach((line, i) => {
            const startAt = i / constellationLines.length;
            const endAt   = (i + 1) / constellationLines.length;
            if (constellationProgress >= startAt) {
                line.progress = Math.min(1, (constellationProgress - startAt) / (endAt - startAt));
            }
        });
        if (constellationProgress >= 1) S.constellationDrawn = true;
    }
}

function drawConstellation(forceProgress) {
    constCtx.clearRect(0, 0, W, H);

    const px = (S.mouseX / W - .5) * 10;
    const py = (S.mouseY / H - .5) * 10;

    constellationLines.forEach(line => {
        const prog = forceProgress ?? line.progress;
        if (prog <= 0) return;

        const a = constNodes[line.from];
        const b = constNodes[line.to];

        const ax = a.x + px * .25;
        const ay = a.y + py * .25;
        const bx = b.x + px * .25;
        const by = b.y + py * .25;

        const ex = ax + (bx - ax) * prog;
        const ey = ay + (by - ay) * prog;

        constCtx.save();
        constCtx.strokeStyle = 'rgba(96,165,250,0.35)';
        constCtx.lineWidth = 1;
        constCtx.shadowBlur = 8;
        constCtx.shadowColor = 'rgba(96,165,250,0.6)';
        constCtx.beginPath();
        constCtx.moveTo(ax, ay);
        constCtx.lineTo(ex, ey);
        constCtx.stroke();
        constCtx.restore();
    });

    // Draw nodes
    constNodes.forEach((n, i) => {
        const lineIdx = i - 1;
        const prog = forceProgress ?? (lineIdx < 0 ? 1 : (constellationLines[lineIdx]?.progress ?? 0));
        if (prog <= 0 && i > 0) return;

        const nx = n.x + px * .25;
        const ny = n.y + py * .25;

        constCtx.beginPath();
        constCtx.arc(nx, ny, 3, 0, Math.PI * 2);
        constCtx.fillStyle = 'rgba(96,165,250,0.8)';
        constCtx.shadowBlur = 12;
        constCtx.shadowColor = 'rgba(96,165,250,1)';
        constCtx.fill();
    });
}

/* ═══════════════════════════════════════════════════
   RENDER LOOP
   ═══════════════════════════════════════════════════ */
let lastT = 0;
function renderLoop(t) {
    const dt = t - lastT;
    lastT = t;

    renderStars(dt);
    renderNebula();
    renderDust();
    if (S.opened) {
        animateConstellation(dt);
        drawConstellation();
    }

    requestAnimationFrame(renderLoop);
}

/* ═══════════════════════════════════════════════════
   OPEN CARD
   ═══════════════════════════════════════════════════ */
function openCard(e) {
    e?.stopPropagation();
    if (S.opened) return;
    S.opened = true;

    D.cover.classList.add('hidden');
    initDust();
    scheduleShootingStar();

    setTimeout(() => {
        D.messageCard.classList.add('visible');
        spawnFloatingMessages();
    }, 700);

    if (CONFIG.audioEnabled) startAmbientAudio();
}

function onCoverClick() {
    // Only open if user clicks anywhere on cover (not button — button has its own handler)
}

/* ═══════════════════════════════════════════════════
   FLOATING MESSAGE BUBBLES
   ═══════════════════════════════════════════════════ */
function spawnFloatingMessages() {
    FLOAT_MESSAGES.forEach((msg, i) => {
        setTimeout(() => spawnOneBubble(msg), i * 2200);
    });
    // Repeat cycle every 25s
    setInterval(() => {
        FLOAT_MESSAGES.forEach((msg, i) => {
            setTimeout(() => spawnOneBubble(msg), i * 2200);
        });
        S.customMessages.forEach((msg, i) => {
            setTimeout(() => spawnOneBubble(msg), (FLOAT_MESSAGES.length + i) * 2200);
        });
    }, 25000);
}

function spawnOneBubble(msg) {
    const el = document.createElement('div');
    el.className = 'cd-letter-bubble';
    el.innerHTML = msg;

    const side = Math.random() > .5;
    el.style.setProperty('--dur', `${8 + Math.random() * 5}s`);
    el.style.setProperty('--delay', '0s');
    el.style.setProperty('--travel', `-${120 + Math.random() * 80}px`);
    el.style.left  = side ? `${5 + Math.random() * 20}%` : `${55 + Math.random() * 30}%`;
    el.style.bottom = `${10 + Math.random() * 25}vh`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 14000);
}

/* ═══════════════════════════════════════════════════
   WEB AUDIO — DEEP SPACE AMBIENT
   ═══════════════════════════════════════════════════ */
function startAmbientAudio() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    S.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    buildAmbientGraph();
    S.isPlaying = true;
    updateAudioBtn();
}

function buildAmbientGraph() {
    const ctx = S.audioCtx;

    // Master gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(.0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 4);
    master.connect(ctx.destination);
    S.audioNodes.master = master;

    // Deep sub drone
    makeDrone(ctx, 55,  .18, 'sine', master);
    makeDrone(ctx, 82,  .10, 'sine', master);
    makeDrone(ctx, 110, .06, 'triangle', master);

    // Space pad (slow-filtered noise)
    const bufSize = ctx.sampleRate * 4;
    const buffer  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 220;
    bpf.Q.value = .4;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = .05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(bpf.frequency);
    lfo.start();

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = .06;
    noiseSource.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();
    S.audioNodes.noiseSource = noiseSource;

    // Soft melodic ping every ~12s
    schedulePing(ctx, master);
}

function makeDrone(ctx, freq, gain, type, dest) {
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(dest);
    osc.start();

    // Slow vibrato
    const vib = ctx.createOscillator();
    const vibG = ctx.createGain();
    vib.frequency.value = .08 + Math.random() * .06;
    vibG.gain.value = 0.8;
    vib.connect(vibG);
    vibG.connect(osc.frequency);
    vib.start();
}

function schedulePing(ctx, dest) {
    const pingOsc = ctx.createOscillator();
    const pingEnv = ctx.createGain();
    pingOsc.type = 'sine';
    pingOsc.frequency.value = [528, 432, 396, 639][Math.floor(Math.random() * 4)];
    pingEnv.gain.setValueAtTime(0, ctx.currentTime);
    pingEnv.gain.linearRampToValueAtTime(.12, ctx.currentTime + .02);
    pingEnv.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + 4);
    pingOsc.connect(pingEnv);
    pingEnv.connect(dest);
    pingOsc.start(ctx.currentTime);
    pingOsc.stop(ctx.currentTime + 4.5);

    setTimeout(() => schedulePing(ctx, dest), 10000 + Math.random() * 8000);
}

function toggleAudio() {
    if (!S.audioCtx) {
        startAmbientAudio();
        return;
    }
    if (S.isPlaying) {
        S.audioNodes.master?.gain.setValueAtTime(0, S.audioCtx.currentTime);
        S.isPlaying = false;
    } else {
        S.audioNodes.master?.gain.setValueAtTime(.0, S.audioCtx.currentTime);
        S.audioNodes.master?.gain.linearRampToValueAtTime(.55, S.audioCtx.currentTime + 1.5);
        S.isPlaying = true;
    }
    updateAudioBtn();
}

function updateAudioBtn() {
    if (!D.audioBtn) return;
    const label = D.audioBtn.querySelector('.cd-audio-label');
    if (label) label.textContent = S.isPlaying ? 'Pause Audio' : 'Space Audio';
    D.audioBtn.classList.toggle('is-playing', S.isPlaying);
}

/* ═══════════════════════════════════════════════════
   CANVAS CLICK — SHOOT STAR + STAR TIP
   ═══════════════════════════════════════════════════ */
function onCanvasClick(e) {
    if (!S.opened) return;
    const rect = D.fxCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnShootingStar(x, y);
    showToast('✦ Bintang Jatuh!');

    // Ripple click effect
    spawnClickRipple(fxCtx, x, y);
}

function spawnClickRipple(ctx, x, y) {
    let r = 0;
    let alpha = .7;
    const draw = () => {
        if (alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        r += 3;
        alpha -= .03;
        requestAnimationFrame(draw);
    };
    draw();
}

/* ═══════════════════════════════════════════════════
   MOUSE / GYRO
   ═══════════════════════════════════════════════════ */
function onMouseMove(e) {
    S.mouseX = e.clientX;
    S.mouseY = e.clientY;
}
function onGyro(e) {
    S.mouseX = W / 2 + (e.gamma || 0) * 8;
    S.mouseY = H / 2 + ((e.beta || 45) - 45) * 6;
}

/* ═══════════════════════════════════════════════════
   WRITE MODAL
   ═══════════════════════════════════════════════════ */
function openWriteModal() {
    D.writeModal.classList.add('open');
}
function closeWriteModal() {
    D.writeModal.classList.remove('open');
}
function sendCustomMessage() {
    const name = D.modalName.value.trim();
    const msg  = D.modalMsg.value.trim();
    if (!msg) return;

    const full = name ? `${name}: "${msg}"` : `"${msg}"`;
    S.customMessages.push(full);
    spawnOneBubble(full);
    showToast('Pesanmu melayang ke semesta ✨');
    closeWriteModal();
    D.modalName.value = '';
    D.modalMsg.value  = '';
}

/* ═══════════════════════════════════════════════════
   ROCKET LAUNCH SEQUENCE
   ═══════════════════════════════════════════════════ */
const LAUNCH_LOGS = [
    'SISTEM: Menyiapkan roket cinta...',
    'BAHAN BAKAR: Penuh — Cinta tak terbatas ♾️',
    'KOORDINAT: Bintang Terdekat — 4.24 Tahun Cahaya',
    'T-3: Mesin Dinyalakan 🔥',
    'T-2: Semua Sistem Normal ✅',
    'T-1: Pemuatan Pesan Rahasia...',
    '🚀 PELUNCURAN! MISI CINTA DIMULAI',
];

function startRocketLaunch() {
    if (S.rocketLaunched) return;

    D.rocketOverlay.classList.add('active');
    D.launchBar.style.width = '0%';

    let step = 0;
    const runStep = () => {
        if (step >= LAUNCH_LOGS.length) {
            launchRocket();
            return;
        }
        D.launchLog.textContent = LAUNCH_LOGS[step];
        D.launchBar.style.width = `${((step + 1) / LAUNCH_LOGS.length) * 100}%`;
        step++;
        setTimeout(runStep, step === LAUNCH_LOGS.length - 1 ? 500 : 900);
    };
    runStep();
}

function launchRocket() {
    S.rocketLaunched = true;
    D.rocket.classList.add('launching');

    // Spawn many shooting stars during launch
    for (let i = 0; i < 12; i++) {
        setTimeout(() => spawnShootingStar(), i * 200);
    }

    setTimeout(() => {
        D.orbitMsg.classList.add('visible');
    }, 2800);
}

function closeRocketOverlay() {
    D.rocketOverlay.classList.remove('active');
    D.orbitMsg.classList.remove('visible');

    // Reset rocket
    setTimeout(() => {
        D.rocket.classList.remove('launching');
        S.rocketLaunched = false;
    }, 600);
}

/* ═══════════════════════════════════════════════════
   COORDINATES TICKER
   ═══════════════════════════════════════════════════ */
function startCoordsTick() {
    if (!D.coords) return;
    let tick = 0;
    setInterval(() => {
        tick++;
        // Slightly vary last digits for "live telemetry" feel
        const lat = `03°22'${14 + (tick % 6)}"S`;
        const lon = `116°44'${9 + (tick % 9)}"E`;
        const alt = `ALT: ${408 + (tick % 3)}KM`;
        D.coords.textContent = `${lat}  ${lon}  ${alt}`;
    }, 1800);
    D.coords.textContent = CONFIG.coordText;
}

/* ═══════════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════════ */
function showToast(msg) {
    if (!D.toast) return;
    D.toast.textContent = msg;
    D.toast.classList.add('show');
    setTimeout(() => D.toast.classList.remove('show'), 2800);
}
