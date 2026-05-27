const fs = require('fs');
const path = require('path');

const filePath = 'c:\\laragon\\www\\Undangan Digital\\resources\\js\\Pages\\GreetingCardPreview.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The starting marker of CosmicDriftFull
const startMarker = 'function CosmicDriftFull({ card }) {';
// The ending marker of CosmicDriftFull
const endMarker = 'function GreetingCardPreviewContent({ card }) {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find start or end marker!');
    process.exit(1);
}

// Extract the target content to be replaced
const originalBlock = content.substring(startIndex, endIndex);

const replacementBlock = `function CosmicDriftFull({ card }) {
    const starsRef      = useRef(null);
    const nebulaRef     = useRef(null);
    const constRef      = useRef(null);
    const audioCtxRef   = useRef(null);
    const masterGainRef = useRef(null);

    const [opened, setOpened]                 = useState(false);
    const [isPlaying, setIsPlaying]           = useState(false);
    const [warpActive, setWarpActive]         = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [bubbles, setBubbles]               = useState([]);
    const [coords, setCoords]                 = useState('03°22\\\'14"S  116°44\\\'09"E  ALT: 408KM');
    const [activePhoto, setActivePhoto]       = useState(null);

    const typeGreeting = {
        anniversary: 'Selamat Aniversari',
        birthday:    'Selamat Ulang Tahun',
        graduation:  'Selamat Wisuda',
        wedding:     'Selamat Menikah',
    };

    // Dynamically compile user wishes for the floating bubbles
    const floatMessages = useMemo(() => {
        let msgs = [];
        if (card.messages && card.messages.length > 0) {
            card.messages.forEach(m => {
                if (!m) return;
                // Split by major punctuation to get beautiful short chunks
                const parts = m.split(/[.\\n;!]+/).map(p => p.trim()).filter(p => p.length > 6 && p.length < 50);
                if (parts.length > 0) {
                    msgs.push(...parts);
                } else {
                    if (m.length < 50) msgs.push(m);
                }
            });
        }
        msgs = [...new Set(msgs)];
        if (msgs.length === 0) {
            msgs.push(
                \`Selamat \${card.type_label || 'Hari Spesial'} ✨\`,
                \`Untuk \${card.recipient_name} tercinta ❤️\`,
                \`Dari \${card.sender_name} ✨\`
            );
        }
        return msgs;
    }, [card.messages, card.recipient_name, card.sender_name, card.type_label]);

    // ── Stars canvas (Perspective 3D & Radial Warp Speed & Stardust Trail) ──
    useEffect(() => {
        if (!opened) return;
        const canvas = starsRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        // 3D Star fields
        const numStars = 220;
        const stars = Array.from({ length: numStars }, () => ({
            x: Math.random() * W - W / 2,
            y: Math.random() * H - H / 2,
            z: Math.random() * W,
            size: Math.random() * 1.5 + 0.4,
            hue: [195, 205, 220, 260, 45][Math.floor(Math.random() * 5)],
            brightness: 0.5 + Math.random() * 0.5,
        }));

        let mouseX = W / 2, mouseY = H / 2;
        const dustParticles = [];

        const onMouse = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Emit stardust
            dustParticles.push({
                x: mouseX,
                y: mouseY,
                vx: (Math.random() - 0.5) * 1.6,
                vy: (Math.random() - 0.5) * 1.6 - 0.6,
                alpha: 1.0,
                decay: 0.015 + Math.random() * 0.01,
                color: \`hsla(\${[190, 220, 260, 325][Math.floor(Math.random() * 4)]}, 85%, 75%, \`,
                size: Math.random() * 3 + 1.2
            });
            if (dustParticles.length > 60) dustParticles.shift();
        };
        window.addEventListener('mousemove', onMouse);

        const shootingStars = [];
        const handleClick = (e) => {
            if (e.target.closest('button,input,textarea,a,img')) return;
            const rect = canvas.getBoundingClientRect();
            shootingStars.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                vx: Math.cos(-Math.PI / 6) * (9 + Math.random() * 6),
                vy: Math.sin(-Math.PI / 6) * (9 + Math.random() * 6),
                life: 1,
                decay: 0.02 + Math.random() * 0.012,
                tail: [],
            });
        };
        canvas.addEventListener('click', handleClick);

        let currentSpeed = warpActive ? 32 : 0.45;

        const draw = () => {
            animId = requestAnimationFrame(draw);
            
            // Motion blur during warp speed, normal space color otherwise
            ctx.fillStyle = warpActive ? 'rgba(2, 8, 23, 0.16)' : '#020817';
            ctx.fillRect(0, 0, W, H);

            // Interpolate speed smoothly
            if (warpActive) {
                currentSpeed += (45 - currentSpeed) * 0.08;
            } else {
                currentSpeed += (0.45 - currentSpeed) * 0.12;
            }

            const mx = (mouseX / W - 0.5) * 20;
            const my = (mouseY / H - 0.5) * 20;

            // Draw projected 3D stars
            stars.forEach(s => {
                s.z -= currentSpeed;
                if (s.z <= 0) {
                    s.z = W;
                    s.x = Math.random() * W - W / 2;
                    s.y = Math.random() * H - H / 2;
                }

                const k = 400 / s.z;
                const px = s.x * k + W / 2 + mx * (1 - s.z / W);
                const py = s.y * k + H / 2 + my * (1 - s.z / W);

                if (px < 0 || px > W || py < 0 || py > H) return;

                if (currentSpeed > 2.5) {
                    // Warp speed lines stretching radially outward
                    const prevK = 400 / (s.z + currentSpeed * 1.4);
                    const ppx = s.x * prevK + W / 2 + mx * (1 - (s.z + currentSpeed * 1.4) / W);
                    const ppy = s.y * prevK + H / 2 + my * (1 - (s.z + currentSpeed * 1.4) / W);

                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(ppx, ppy);
                    ctx.strokeStyle = \`hsla(\${s.hue}, 90%, 88%, \${s.brightness * 0.85})\`;
                    ctx.lineWidth = s.size * 1.8;
                    ctx.stroke();
                } else {
                    // Normal floating twinkling stars
                    ctx.beginPath();
                    ctx.arc(px, py, s.size * (1 + 0.12 * Math.sin(Date.now() * 0.004 + s.z)), 0, Math.PI * 2);
                    ctx.fillStyle = \`hsla(\${s.hue}, 80%, 92%, \${s.brightness})\`;
                    ctx.fill();

                    if (s.size > 1.2) {
                        const g = ctx.createRadialGradient(px, py, 0, px, py, s.size * 3.5);
                        g.addColorStop(0, \`hsla(\${s.hue}, 80%, 85%, \${s.brightness * 0.25})\`);
                        g.addColorStop(1, 'transparent');
                        ctx.beginPath();
                        ctx.arc(px, py, s.size * 3.5, 0, Math.PI * 2);
                        ctx.fillStyle = g;
                        ctx.fill();
                    }
                }
            });

            // Draw interactive stardust trail
            for (let i = dustParticles.length - 1; i >= 0; i--) {
                const d = dustParticles[i];
                d.x += d.vx;
                d.y += d.vy;
                d.alpha -= d.decay;
                if (d.alpha <= 0) {
                    dustParticles.splice(i, 1);
                    continue;
                }
                const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.size * 2.8);
                g.addColorStop(0, d.color + d.alpha * 0.35 + ')');
                g.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = g;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = d.color + d.alpha + ')';
                ctx.fill();
            }

            // Shooting stars
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                ss.tail.push({ x: ss.x, y: ss.y });
                if (ss.tail.length > 14) ss.tail.shift();
                ss.x += ss.vx; ss.y += ss.vy; ss.life -= ss.decay;
                if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
                for (let j = 0; j < ss.tail.length - 1; j++) {
                    const a = (j / ss.tail.length) * ss.life * 0.6;
                    ctx.beginPath();
                    ctx.moveTo(ss.tail[j].x, ss.tail[j].y);
                    ctx.lineTo(ss.tail[j+1].x, ss.tail[j+1].y);
                    ctx.strokeStyle = \`rgba(255,255,255,\${a})\`;
                    ctx.lineWidth = a * 1.8; ctx.stroke();
                }
                ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(255,255,255,\${ss.life})\`; ctx.fill();
            }
        };
        draw();

        // Spawn periodic shooting star
        let sTimer = setTimeout(function spawn() {
            if (currentSpeed < 2) {
                shootingStars.push({
                    x: Math.random() * W * 0.7,
                    y: Math.random() * H * 0.4,
                    vx: Math.cos(-Math.PI / 6) * (9 + Math.random() * 5),
                    vy: Math.sin(-Math.PI / 6) * (9 + Math.random() * 5),
                    life: 1, decay: 0.018 + Math.random() * 0.01, tail: [],
                });
            }
            sTimer = setTimeout(spawn, 8000 + Math.random() * 7000);
        }, 8000);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(sTimer);
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('resize', onResize);
        };
    }, [opened, warpActive]);

    // ── Nebula canvas ──
    useEffect(() => {
        if (!opened) return;
        const canvas = nebulaRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const blobs = [
            { cx: W*0.3, cy: H*0.3, rx: W*0.55, ry: H*0.55, hue: 220, alpha: 0.12, t: 0, speed: 0.0003 },
            { cx: W*0.7, cy: H*0.6, rx: W*0.5,  ry: H*0.5,  hue: 270, alpha: 0.09, t: 1, speed: 0.0004 },
            { cx: W*0.5, cy: H*0.5, rx: W*0.65, ry: H*0.65, hue: 200, alpha: 0.07, t: 2, speed: 0.0002 },
            { cx: W*0.2, cy: H*0.7, rx: W*0.35, ry: H*0.35, hue: 310, alpha: 0.06, t: 3, speed: 0.0005 },
        ];

        const draw = () => {
            animId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H);
            blobs.forEach(b => {
                b.t += b.speed;
                const wobble = Math.sin(b.t) * 0.1;
                const rx = b.rx * (1 + wobble);
                const ry = b.ry * (1 - wobble * 0.5);
                const g = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, Math.max(rx, ry));
                g.addColorStop(0,   \`hsla(\${b.hue},80%,50%,\${b.alpha})\`);
                g.addColorStop(0.4, \`hsla(\${b.hue+20},70%,35%,\${b.alpha*0.5})\`);
                g.addColorStop(1,   'transparent');
                ctx.save();
                ctx.translate(b.cx, b.cy);
                ctx.scale(rx / Math.max(rx,ry), ry / Math.max(rx,ry));
                ctx.beginPath(); ctx.arc(0, 0, Math.max(rx,ry), 0, Math.PI*2);
                ctx.fillStyle = g; ctx.fill();
                ctx.restore();
            });
        };
        draw();

        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
    }, [opened]);

    // ── Constellation canvas ──
    useEffect(() => {
        if (!opened || !contentVisible) return;
        const canvas = constRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let W = canvas.width  = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', onResize);

        const pattern = [[0.38,0.35],[0.44,0.29],[0.50,0.27],[0.56,0.29],[0.62,0.35],[0.50,0.48],[0.38,0.35],[0.50,0.48],[0.62,0.35]];
        const nodes   = pattern.map(([rx,ry]) => ({ x: rx*W, y: ry*H }));
        const lines   = nodes.slice(1).map((_, i) => ({ from: i, to: i+1, progress: 0 }));
        let totalProg = 0;

        const draw = () => {
            animId = requestAnimationFrame(draw);
            if (totalProg < 1) totalProg = Math.min(1, totalProg + 0.004);
            ctx.clearRect(0, 0, W, H);

            lines.forEach((line, i) => {
                const startAt = i / lines.length;
                const endAt   = (i+1) / lines.length;
                if (totalProg < startAt) return;
                line.progress = Math.min(1, (totalProg - startAt) / (endAt - startAt));

                const a = nodes[line.from], b = nodes[line.to];
                const ex = a.x + (b.x - a.x) * line.progress;
                const ey = a.y + (b.y - a.y) * line.progress;
                ctx.save();
                ctx.strokeStyle = 'rgba(96,165,250,0.35)';
                ctx.lineWidth = 1.2;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(96,165,250,0.6)';
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey); ctx.stroke();
                ctx.restore();
            });

            nodes.forEach((n, i) => {
                const prog = i === 0 ? 1 : (lines[i-1]?.progress ?? 0);
                if (prog <= 0) return;
                ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI*2);
                ctx.fillStyle = 'rgba(96,165,250,0.8)';
                ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(96,165,250,1)';
                ctx.fill();
            });
        };
        draw();

        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
    }, [opened, contentVisible]);

    // ── Floating wishes bubbles ──
    useEffect(() => {
        if (!opened || !contentVisible) return;
        let idx = 0;
        const spawn = () => {
            if (floatMessages.length === 0) return;
            const msg = floatMessages[idx % floatMessages.length];
            idx++;
            const id  = Math.random().toString(36).slice(2);
            const dur = 10 + Math.random() * 6;
            setBubbles(prev => [...prev, {
                id, msg,
                left: Math.random() > 0.5 ? \`\${4 + Math.random()*16}%\` : \`\${64 + Math.random()*18}%\`,
                bottom: \`\${10 + Math.random()*28}vh\`,
                dur,
            }]);
            setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), dur * 1000 + 500);
        };

        // Spawn initial bubbles staggered
        floatMessages.forEach((_, i) => {
            setTimeout(spawn, i * 1600);
        });

        const intv = setInterval(spawn, 6000);
        return () => clearInterval(intv);
    }, [opened, contentVisible, floatMessages]);

    // ── Live coordinates ticker ──
    useEffect(() => {
        let tick = 0;
        const intv = setInterval(() => {
            tick++;
            setCoords(\`03°22'\${14 + (tick%6)}"S  116°44'\${9 + (tick%9)}"E  ALT: \${408 + (tick%3)}KM\`);
        }, 1800);
        return () => clearInterval(intv);
    }, []);

    // ── Web Audio ambient (with Warp Sweep Sound Effect) ──
    const startAudio = (withWarp = false) => {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        if (audioCtxRef.current) return;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 3);
        master.connect(ctx.destination);
        masterGainRef.current = master;

        // Base celestial oscillators
        [[55,0.16,'sine'],[82,0.09,'sine'],[110,0.05,'triangle']].forEach(([freq,g,type]) => {
            const osc = ctx.createOscillator();
            const gn  = ctx.createGain();
            osc.type = type; osc.frequency.value = freq; gn.gain.value = g;
            osc.connect(gn); gn.connect(master); osc.start();
        });

        // Space pink noise
        const bufSz = ctx.sampleRate * 4;
        const buf   = ctx.createBuffer(1, bufSz, ctx.sampleRate);
        const data  = buf.getChannelData(0);
        for (let i = 0; i < bufSz; i++) data[i] = (Math.random() * 2 - 1);
        const ns = ctx.createBufferSource();
        ns.buffer = buf; ns.loop = true;
        const bpf = ctx.createBiquadFilter();
        bpf.type = 'bandpass'; bpf.frequency.value = 220; bpf.Q.value = 0.4;
        const ng = ctx.createGain(); ng.gain.value = 0.06;
        ns.connect(bpf); bpf.connect(ng); ng.connect(master); ns.start();

        // Warp sound sweep
        if (withWarp) {
            const warpOsc = ctx.createOscillator();
            const warpGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            warpOsc.type = 'sawtooth';
            filter.type = 'lowpass';
            
            filter.frequency.setValueAtTime(40, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 1.3);
            filter.frequency.exponentialRampToValueAtTime(75, ctx.currentTime + 2.3);

            warpGain.gain.setValueAtTime(0, ctx.currentTime);
            warpGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.4);
            warpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

            warpOsc.frequency.setValueAtTime(45, ctx.currentTime);
            warpOsc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 1.6);

            warpOsc.connect(filter);
            filter.connect(warpGain);
            warpGain.connect(master);
            warpOsc.start(ctx.currentTime);
            warpOsc.stop(ctx.currentTime + 2.7);
        }

        const ping = () => {
            const po = ctx.createOscillator();
            const pe = ctx.createGain();
            po.type = 'sine';
            po.frequency.value = [528,432,396,639][Math.floor(Math.random()*4)];
            pe.gain.setValueAtTime(0, ctx.currentTime);
            pe.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
            pe.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
            po.connect(pe); pe.connect(master); po.start(ctx.currentTime); po.stop(ctx.currentTime + 4);
            setTimeout(ping, 10000 + Math.random() * 8000);
        };
        ping();

        setIsPlaying(true);
    };

    const toggleAudio = () => {
        if (!audioCtxRef.current) { startAudio(false); return; }
        const master = masterGainRef.current;
        if (isPlaying) {
            master.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            setIsPlaying(false);
        } else {
            master.gain.linearRampToValueAtTime(0.5, audioCtxRef.current.currentTime + 1);
            setIsPlaying(true);
        }
    };

    // ── Open card with Warp Transition ──
    const handleOpen = () => {
        try {
            const el = document.documentElement;
            if (el.requestFullscreen) el.requestFullscreen();
        } catch(e) {}
        setOpened(true);
        setWarpActive(true);
        startAudio(true);
        setTimeout(() => {
            setWarpActive(false);
            setContentVisible(true);
        }, 2200);
    };

    const greeting = typeGreeting[card.type] || 'Pesan Spesial';

    return (
        <div style={{ position:'fixed', inset:0, background:'#020817', overflow:'hidden', userSelect:'none', cursor:'crosshair' }}>
            {/* Canvas layers */}
            <canvas ref={starsRef}  style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'auto' }} />
            <canvas ref={nebulaRef} style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', mixBlendMode:'screen' }} />
            <canvas ref={constRef}  style={{ position:'fixed', inset:0, zIndex:3, pointerEvents:'none' }} />

            {/* HUD corners */}
            {opened && contentVisible && (
                <>
                    <div style={{ position:'fixed', top:14, left:14, zIndex:40, pointerEvents:'none' }}>
                        <div style={{ width:16, height:16, borderTop:'2px solid rgba(96,165,250,.3)', borderLeft:'2px solid rgba(96,165,250,.3)' }} />
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.45rem', letterSpacing:'2.5px', color:'rgba(96,165,250,.3)', marginTop:'0.3rem', lineHeight:1.8 }}>
                            COSMIC DRIFT v1.2<br/>SECTOR: ANDROMEDA-7
                        </div>
                    </div>
                    <div style={{ position:'fixed', top:14, right:14, zIndex:40, pointerEvents:'none', textAlign:'right' }}>
                        <div style={{ width:16, height:16, borderTop:'2px solid rgba(96,165,250,.3)', borderRight:'2px solid rgba(96,165,250,.3)', marginLeft:'auto' }} />
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.45rem', letterSpacing:'2.5px', color:'rgba(96,165,250,.3)', marginTop:'0.3rem', lineHeight:1.8 }}>
                            STATUS: LIVE<br/><span style={{ color:'rgba(34,211,238,.45)' }}>● SIGNAL ACQUIRED</span>
                        </div>
                    </div>
                    <div style={{ position:'fixed', bottom:20, left:14, zIndex:40, pointerEvents:'none' }}>
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.42rem', letterSpacing:'2px', color:'rgba(96,165,250,.28)', lineHeight:1.8, marginBottom:'0.3rem' }}>
                            KLIK LAYAR → BINTANG JATUH<br/>CONSTELLATION: ❤ ACTIVE
                        </div>
                        <div style={{ width:16, height:16, borderBottom:'2px solid rgba(96,165,250,.3)', borderLeft:'2px solid rgba(96,165,250,.3)' }} />
                    </div>
                    <div style={{ position:'fixed', bottom:20, right:14, zIndex:40, pointerEvents:'none', textAlign:'right' }}>
                        <div style={{ fontFamily:'Orbitron,monospace', fontSize:'0.42rem', letterSpacing:'2px', color:'rgba(96,165,250,.28)', lineHeight:1.8, marginBottom:'0.3rem' }}>
                            NEBULA: ONLINE<br/>{coords}
                        </div>
                        <div style={{ width:16, height:16, borderBottom:'2px solid rgba(96,165,250,.3)', borderRight:'2px solid rgba(96,165,250,.3)', marginLeft:'auto' }} />
                    </div>
                </>
            )}

            {/* Floating wishes bubbles */}
            {opened && contentVisible && bubbles.map(b => (
                <div key={b.id} style={{
                    position:'fixed', zIndex:20, left:b.left, bottom:b.bottom, pointerEvents:'none',
                    fontFamily:'Exo 2,sans-serif', fontSize:'clamp(0.62rem,1.8vw,0.8rem)',
                    color:'rgba(255,255,255,.88)', maxWidth:'min(280px,72vw)', lineHeight:1.75,
                    textAlign:'center', padding:'0.6rem 1rem',
                    background:'rgba(10,22,40,.6)', border:'1px solid rgba(96,165,250,.22)',
                    borderRadius:16, backdropFilter:'blur(8px)',
                    animation: \`cdBubble \${b.dur}s ease-in-out forwards\`,
                }}>{b.msg}</div>
            ))}

            {/* Floating Polaroid Satellites */}
            {opened && contentVisible && card.photos && card.photos.map((pUrl, index) => {
                const positions = [
                    { top: '13vh', left: '7vw', rotate: -6 },
                    { bottom: '16vh', right: '7vw', rotate: 5 },
                    { top: '15vh', right: '8vw', rotate: -4 },
                    { bottom: '18vh', left: '6vw', rotate: 7 },
                ];
                const pos = positions[index % positions.length];
                return (
                    <div 
                        key={index}
                        style={{
                            position: 'fixed',
                            zIndex: 15,
                            top: pos.top,
                            bottom: pos.bottom,
                            left: pos.left,
                            right: pos.right,
                            animation: \`cdPolaroidDrift \${8 + index * 2}s ease-in-out infinite alternate\`,
                            pointerEvents: 'auto',
                        }}
                    >
                        <div 
                            onClick={() => setActivePhoto(pUrl)}
                            style={{
                                width: 'clamp(90px, 16vw, 130px)',
                                background: 'rgba(5, 13, 31, 0.65)',
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(96, 165, 250, 0.25)',
                                borderRadius: '12px',
                                padding: '6px 6px 20px 6px',
                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.15)',
                                cursor: 'pointer',
                                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s, box-shadow 0.3s',
                                transform: \`rotate(\${pos.rotate}deg)\`,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = \`scale(1.12) rotate(\${pos.rotate * 0.4}deg) translateY(-6px)\`;
                                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.6)';
                                e.currentTarget.style.boxShadow = '0 0 35px rgba(34, 211, 238, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = \`rotate(\${pos.rotate}deg)\`;
                                e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.25)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.15)';
                            }}
                        >
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '8px', marginBottom: '8px' }}>
                                <img src={pUrl} alt="Celestial moment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(34, 211, 238, 0.04) 50%, rgba(0,0,0,0) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
                            </div>
                            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.45rem', letterSpacing: '1px', color: 'rgba(96, 165, 250, 0.6)', display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                                <span>SAT-CAM\${index + 1}</span>
                                <span>ONLINE</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* COVER */}
            {!opened && (
                <div style={{ position:'fixed', inset:0, zIndex:900, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 50% 50%, #0a1628 0%, #020817 70%)' }}>
                    {[180,300,440].map(s => (
                        <div key={s} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:\`1px solid rgba(\${s===180?'59,130,246':s===300?'168,85,247':'34,211,238'},.\${s===180?25:s===300?15:10})\`, animation:'cdRing 4s ease-in-out infinite', animationDelay:\`\${(s-180)/260*0.7}s\` }} />
                    ))}
                    <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem' }}>
                        <div style={{ width:60, height:60, borderRadius:'50%', background:'radial-gradient(circle at 35% 35%, #4f8ef7, #1a3a8f 60%, #0a1a4a)', boxShadow:'0 0 30px rgba(59,130,246,.7)', animation:'cdPlanet 6s ease-in-out infinite' }} />
                        <div>
                            <p style={{ fontFamily:'Orbitron,monospace', fontSize:'0.52rem', letterSpacing:'6px', textTransform:'uppercase', color:'#22d3ee', opacity:0.7 }}>A Message From The Universe</p>
                            <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'clamp(1.8rem,7vw,3rem)', fontWeight:900, background:'linear-gradient(135deg,#60a5fa,#a78bfa,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:3, filter:'drop-shadow(0 0 18px rgba(96,165,250,.5))', lineHeight:1.1, marginTop:'0.5rem' }}>COSMIC<br/>DRIFT</h1>
                            <p style={{ fontFamily:'Exo 2,sans-serif', fontStyle:'italic', fontSize:'0.85rem', color:'rgba(255,255,255,.5)', maxWidth:270, lineHeight:1.7, marginTop:'0.75rem' }}>Sebuah surat cinta melewati bintang-bintang, khusus untuk <strong style={{ color:'#c4b5fd' }}>{card.recipient_name}</strong></p>
                        </div>
                        <button onClick={handleOpen} style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', padding:'0.9rem 2.4rem', background:'linear-gradient(135deg,#3b82f6,#7c3aed)', border:'none', borderRadius:100, fontFamily:'Orbitron,monospace', fontSize:'0.75rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', cursor:'pointer', boxShadow:'0 0 30px rgba(59,130,246,.5)', animation:'cdBtnGlow 3s ease-in-out infinite' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:16,height:16 }}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Buka Pesanmu
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN CARD */}
            {opened && contentVisible && (
                <div style={{ 
                    position:'fixed', inset:0, zIndex:10, display:'flex', alignItems:'center', justifyItems:'center', justifyContent:'center', pointerEvents:'none',
                    animation: 'cdContentFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}>
                    <div style={{
                        background:'rgba(5,13,31,.78)', backdropFilter:'blur(24px) saturate(1.5)',
                        border:'1px solid rgba(96,165,250,.2)', borderRadius:24,
                        padding:'clamp(1.5rem,5vw,2.2rem) clamp(1.5rem,6vw,2.8rem)',
                        maxWidth:'min(480px,90vw)', width:'100%', textAlign:'center',
                        boxShadow:'0 0 60px rgba(59,130,246,.12), 0 25px 60px rgba(0,0,0,.7)',
                        pointerEvents:'auto',
                    }}>
                        <p style={{ fontFamily:'Orbitron,monospace', fontSize:'0.48rem', letterSpacing:'5px', textTransform:'uppercase', color:'#22d3ee', opacity:0.65, marginBottom:'1rem' }}>✦ TRANSMISI DARI GALAKSI M31 ✦</p>
                        <h2 style={{ fontFamily:'Dancing Script,cursive', fontSize:'clamp(2rem,7vw,3rem)', background:'linear-gradient(135deg,#60a5fa,#c4b5fd,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', filter:'drop-shadow(0 0 12px rgba(96,165,250,.4))', lineHeight:1.2 }}>{greeting}</h2>
                        <p style={{ fontFamily:'Orbitron,monospace', fontSize:'0.6rem', letterSpacing:'3px', color:'rgba(196,181,253,.7)', marginTop:'0.35rem', marginBottom:'1rem' }}>{card.recipient_name}</p>
                        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(96,165,250,.3),transparent)', margin:'0 0 1rem' }} />
                        <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '4px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(96,165,250,0.3) transparent' }}>
                            <p style={{ fontFamily:'Exo 2,sans-serif', fontStyle:'italic', fontSize:'clamp(0.82rem,2.3vw,0.95rem)', lineHeight:1.85, color:'rgba(255,255,255,.78)', marginBottom:'1rem' }}>
                                {card.messages?.[0] || \`Di antara milyaran bintang yang bertebaran di galaksi ini, tidak satupun yang bisa menandingi cahaya yang kau pancarkan. Terima kasih sudah menjadi bintang paling terang di semestaku.\`}
                            </p>
                            {card.messages?.slice(1).map((msg, i) => (
                                <p key={i} style={{ fontFamily:'Exo 2,sans-serif', fontStyle:'italic', fontSize:'clamp(0.82rem,2.3vw,0.95rem)', lineHeight:1.85, color:'rgba(255,255,255,.78)', marginBottom:'1rem' }}>
                                    {msg}
                                </p>
                            ))}
                        </div>
                        <p style={{ fontFamily:'Orbitron,monospace', fontSize:'0.68rem', letterSpacing:'3px', color:'#fbbf24', opacity:0.8, marginTop:'1rem', marginBottom:'1.5rem' }}>— {card.sender_name}</p>

                        {/* Action buttons */}
                        <div style={{ display:'flex', gap:'0.7rem', justifyContent:'center', flexWrap:'wrap' }}>
                            <button onClick={toggleAudio} style={{ display:'inline-flex', alignItems:'center', gap:'0.4rem', padding:'0.65rem 1.3rem', borderRadius:100, fontFamily:'Orbitron,monospace', fontSize:'0.62rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', cursor:'pointer', border:'1px solid rgba(168,85,247,.25)', background:'rgba(168,85,247,.15)', color:'#c4b5fd' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:13,height:13 }}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                                {isPlaying ? 'Pause Audio' : 'Space Audio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activePhoto && (
                <div 
                    onClick={() => setActivePhoto(null)}
                    style={{
                        position:'fixed', inset:0, zIndex:1000,
                        background:'rgba(2,8,23,.92)', backdropFilter:'blur(16px)',
                        display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem',
                        animation: 'fadeIn 0.3s ease-out'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position:'relative',
                            background:'rgba(5,13,31,.85)',
                            border:'1px solid rgba(34,211,238,.3)',
                            borderRadius:24, padding:'12px',
                            maxWidth:'min(500px,90vw)', width:'100%',
                            boxShadow:'0 0 50px rgba(34,211,238,.25)',
                            animation: 'scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        <button 
                            onClick={() => setActivePhoto(null)}
                            style={{
                                position:'absolute', top:-16, right:-16,
                                background:'rgba(5,13,31,.9)', border:'1px solid rgba(34,211,238,.4)',
                                borderRadius:'50%', width:36, height:36,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                color:'#22d3ee', cursor:'pointer', fontSize:'1rem',
                                boxShadow:'0 0 15px rgba(34,211,238,.3)'
                            }}
                        >
                            ✕
                        </button>
                        <div style={{ borderRadius:16, overflow:'hidden', border:'1px solid rgba(255,255,255,.08)' }}>
                            <img src={activePhoto} alt="Zoomed celestial capture" style={{ width:'100%', height:'auto', display:'block', maxHeight:'70vh', objectFit:'contain' }} />
                        </div>
                        <div style={{ marginTop: '12px', fontFamily: 'Orbitron, monospace', fontSize: '0.52rem', letterSpacing: '2px', color: 'rgba(34, 211, 238, 0.7)', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
                            <span>ENCRYPTED VISUAL TRANSMISSION</span>
                            <span>SECURED</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Fonts + keyframes */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:ital,wght@0,400;0,600;1,400&family=Dancing+Script:wght@700&display=swap');
                @keyframes cdRing { 0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.04);opacity:1} }
                @keyframes cdPlanet { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(5deg)} }
                @keyframes cdBtnGlow { 0%,100%{box-shadow:0 0 30px rgba(59,130,246,.5)}50%{box-shadow:0 0 50px rgba(124,58,237,.7)} }
                @keyframes cdBubble { 0%{opacity:0;transform:translateY(0) scale(.92)}8%{opacity:1;transform:translateY(-6px) scale(1)}90%{opacity:.9;transform:translateY(-80px) scale(1)}100%{opacity:0;transform:translateY(-100px) scale(.95)} }
                @keyframes cdContentFadeIn { 0%{opacity:0;transform:scale(0.9) translateY(18px);filter:blur(8px)}100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)} }
                @keyframes cdPolaroidDrift { 0%{transform:translateY(0px) translateX(0px)}50%{transform:translateY(-10px) translateX(4px)}100%{transform:translateY(4px) translateX(-3px)} }
                @keyframes fadeIn { 0%{opacity:0}100%{opacity:1} }
                @keyframes scaleIn { 0%{opacity:0;transform:scale(0.85) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>
        </div>
    );
}

`;

const updatedContent = content.substring(0, startIndex) + replacementBlock + content.substring(endIndex);
fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully updated CosmicDriftFull!');
