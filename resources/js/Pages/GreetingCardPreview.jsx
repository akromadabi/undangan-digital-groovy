import React, { useEffect, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';

/* ─────────────────────────────────────────────────────────
   WEB AUDIO API SYNTHESIZER (100% Safe, Offline & IDM-Proof)
   ───────────────────────────────────────────────────────── */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playSynthesizedSound(type, isMuted) {
    if (isMuted) return;
    try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'lift') {
            // Soft high frequency sweep
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.65);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
            osc.start(now);
            osc.stop(now + 0.65);
        } else if (type === 'burst') {
            // Deep bass explosion thud
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(20, now + 0.8);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);

            // Add high crackle overlay shortly after
            setTimeout(() => playSynthesizedSound('crackle', isMuted), 50);
        } else if (type === 'crackle') {
            // High frequency short sizzle
            const sizzleOsc = ctx.createOscillator();
            const sizzleGain = ctx.createGain();
            sizzleOsc.connect(sizzleGain);
            sizzleGain.connect(ctx.destination);

            sizzleOsc.type = 'sawtooth';
            sizzleOsc.frequency.setValueAtTime(12000, now);
            sizzleOsc.frequency.exponentialRampToValueAtTime(500, now + 0.2);
            sizzleGain.gain.setValueAtTime(0.04, now);
            sizzleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            sizzleOsc.start(now);
            sizzleOsc.stop(now + 0.2);
        }
    } catch (err) {
        console.error("Synthesized sound blocked/failed:", err);
    }
}

/* ─────────────────────────────────────────────────────────
   STILL WITH YOU — Full Premium Fireworks & Float Wishes Render
   ───────────────────────────────────────────────────────── */
function StillWithYouFull({ card }) {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    
    // Gate state: 'closed' | 'countdown' | 'opened'
    const [gateState, setGateState] = useState('closed');
    const [countdownVal, setCountdownVal] = useState(3);
    const [countdownGreet, setCountdownGreet] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    
    // Wishes Float State
    const [floatingItems, setFloatingItems] = useState([]);
    
    const typeGreetingText = {
        anniversary: `Happy Anniversary\n${card.recipient_name} my love 💗`,
        birthday:    `Happy Birthday\n${card.recipient_name} 🎂`,
        graduation:  `Selamat Wisuda\n${card.recipient_name} 🎓`,
        wedding:     `Selamat Menikah\n${card.recipient_name} 💍`,
    };
    
    const colors = [
        'hsl(330, 100%, 65%)', // hot pink
        'hsl(340, 90%, 60%)',  // deep rose
        'hsl(45, 100%, 60%)',  // warm gold
        'hsl(190, 100%, 60%)', // neon cyan
        'hsl(270, 90%, 65%)',  // violet purple
        'hsl(300, 100%, 75%)', // soft magenta
    ];

    // Auto layout dimensions & orientation warning
    const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
    const [dismissWarning, setDismissWarning] = useState(false);
    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsLandscapeLocked(isMobile && window.innerHeight > window.innerWidth);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Canvas Fireworks Simulation logic
    useEffect(() => {
        if (gateState !== 'opened') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const fireworks = [];
        const particles = [];

        class Particle {
            constructor(x, y, color, speed, angle, type = 'normal') {
                this.x = x;
                this.y = y;
                this.color = color;
                this.alpha = 1;
                this.decay = type === 'heart' ? 0.012 + Math.random() * 0.008 : 0.015 + Math.random() * 0.015;
                this.friction = 0.96;
                this.gravity = 0.09;
                
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                
                this.trail = [];
                this.trailLength = type === 'heart' ? 3 : 5;
            }
            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.trailLength) {
                    this.trail.shift();
                }
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }
            draw() {
                if (this.alpha <= 0) return;
                ctx.save();
                if (this.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = this.alpha * 0.35;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        class Rocket {
            constructor(startX, startY, targetX, targetY, color) {
                this.x = startX;
                this.y = startY;
                this.tx = targetX;
                this.ty = targetY;
                this.color = color;
                
                const angle = Math.atan2(targetY - startY, targetX - startX);
                const distance = Math.hypot(targetX - startX, targetY - startY);
                this.speed = distance / 60; // Travel in roughly 60 frames (1s)
                
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
                
                this.trail = [];
            }
            update() {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 10) this.trail.shift();
                this.x += this.vx;
                this.y += this.vy;
            }
            draw() {
                ctx.save();
                if (this.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.strokeStyle = this.color;
                    ctx.globalAlpha = 0.5;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
            hasArrived() {
                return this.vy >= 0 || this.y <= this.ty;
            }
        }

        const createExplosion = (x, y, color) => {
            playSynthesizedSound('burst', isMuted);
            const randType = Math.random();
            if (randType < 0.28) {
                // Heart Parametric Equation explosion
                const steps = 60;
                for (let i = 0; i < steps; i++) {
                    const angle = (i / steps) * Math.PI * 2;
                    const rX = 16 * Math.pow(Math.sin(angle), 3);
                    const rY = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
                    const speed = 0.25 + Math.random() * 0.05;
                    const p = new Particle(x, y, color, speed * 12, angle, 'heart');
                    p.vx = rX * speed;
                    p.vy = rY * speed;
                    particles.push(p);
                }
            } else if (randType < 0.55) {
                // Perfect Double Concentric Ring
                const numParticles = 80;
                for (let i = 0; i < numParticles; i++) {
                    const angle = (i / numParticles) * Math.PI * 2;
                    const speed1 = 4.5 + Math.random() * 0.5;
                    const speed2 = 2.2 + Math.random() * 0.3;
                    particles.push(new Particle(x, y, color, speed1, angle));
                    particles.push(new Particle(x, y, color, speed2, angle));
                }
            } else {
                // Classic Chrysanthemum Starburst
                const numParticles = 75;
                for (let i = 0; i < numParticles; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 1.5 + Math.random() * 6.5;
                    particles.push(new Particle(x, y, color, speed, angle));
                }
            }
        };

        const launchRocket = (tx, ty) => {
            const startX = width / 2 + (Math.random() - 0.5) * (width * 0.4);
            const startY = height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            playSynthesizedSound('lift', isMuted);
            fireworks.push(new Rocket(startX, startY, tx, ty, color));
        };

        // Tap/click handler
        const handlePointer = (e) => {
            if (e.target.closest('button')) return;
            launchRocket(e.clientX, e.clientY);
        };
        window.addEventListener('pointerdown', handlePointer);

        // Simulation ticker loop
        const loop = () => {
            animId = requestAnimationFrame(loop);
            ctx.fillStyle = 'rgba(9, 9, 11, 0.18)';
            ctx.fillRect(0, 0, width, height);

            // Rockets update
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const f = fireworks[i];
                f.update();
                f.draw();
                if (f.hasArrived()) {
                    createExplosion(f.x, f.y, f.color);
                    fireworks.splice(i, 1);
                }
            }

            // Particles update
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                }
            }
        };
        loop();

        // Auto launch interval
        const autoLaunch = setInterval(() => {
            if (Math.random() < 0.72) {
                const tx = width * 0.15 + Math.random() * (width * 0.7);
                const ty = height * 0.15 + Math.random() * (height * 0.45);
                launchRocket(tx, ty);
            }
        }, 1300);

        // Export helper globally so countdown can trigger initial massive explosions
        window.__triggerExplosion = (x, y, color) => createExplosion(x, y, color);

        return () => {
            cancelAnimationFrame(animId);
            clearInterval(autoLaunch);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointerdown', handlePointer);
        };
    }, [gateState, isMuted]);

    // Floating Wishes & Images Engine
    useEffect(() => {
        if (gateState !== 'opened') return;
        const messages = (card.messages || []).filter(Boolean);
        const photos = (card.photos || []).filter(Boolean);

        const spawnItem = () => {
            const isPhoto = photos.length > 0 && Math.random() < 0.38;
            const left = 10 + Math.random() * 80;
            const duration = 8 + Math.random() * 5;
            const id = Math.random().toString();
            const rotX = (Math.random() - 0.5) * 20;
            const rotY = (Math.random() - 0.5) * 20;
            const rotZ = (Math.random() - 0.5) * 15;

            let content = '';
            let shape = '';

            if (isPhoto) {
                content = photos[Math.floor(Math.random() * photos.length)];
                shape = Math.random() < 0.5 ? 'shape-circle' : 'shape-heart';
            } else if (messages.length > 0) {
                content = messages[Math.floor(Math.random() * messages.length)];
            } else {
                content = "With Love ❤️";
            }

            const newItem = {
                id,
                type: isPhoto ? 'image' : 'text',
                content,
                left,
                duration,
                rotX,
                rotY,
                rotZ,
                shape
            };

            setFloatingItems(prev => [...prev, newItem]);

            // Auto clean
            setTimeout(() => {
                setFloatingItems(prev => prev.filter(x => x.id !== id));
            }, duration * 1000 + 500);
        };

        // Initial spawn
        setTimeout(spawnItem, 600);
        setTimeout(spawnItem, 1300);
        setTimeout(spawnItem, 2100);

        const engine = setInterval(spawnItem, 3200);
        return () => clearInterval(engine);
    }, [gateState, card.messages, card.photos]);

    const handleOpenStart = () => {
        // Auto enter fullscreen upon user gesture
        try {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) docEl.requestFullscreen();
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
            else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
            else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
        } catch (e) {
            console.warn("Fullscreen request blocked or failed:", e);
        }

        setGateState('countdown');
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        }

        // Run countdown sequence
        let val = 3;
        const timer = setInterval(() => {
            val--;
            if (val > 0) {
                setCountdownVal(val);
            } else if (val === 0) {
                setCountdownGreet(true);
                // Trigger massive synch explosions!
                setTimeout(() => {
                    setGateState('opened');
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    if (window.__triggerExplosion) {
                        window.__triggerExplosion(w * 0.25, h * 0.35, colors[0]);
                        window.__triggerExplosion(w * 0.75, h * 0.35, colors[1]);
                        setTimeout(() => {
                            window.__triggerExplosion(w * 0.5, h * 0.22, colors[2]);
                            window.__triggerExplosion(w * 0.5, h * 0.44, colors[3]);
                        }, 250);
                    }
                }, 100);
            } else {
                clearInterval(timer);
            }
        }, 1000);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#09090b', fontFamily: "'Outfit', sans-serif" }}>
            <audio ref={audioRef} src="/stillwithyou/music/music.mp3" loop />
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
                zIndex: 0,
                background: 'radial-gradient(circle, rgba(255, 101, 163, 0.06) 0%, rgba(9, 9, 11, 0) 70%)',
            }} />

            {/* Firework Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 mix-blend-lighten" />

            {/* Wishes Floating Container */}
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
                {floatingItems.map(item => (
                    <div key={item.id} className="absolute pointer-events-none" style={{
                        left: `${item.left}%`,
                        bottom: '-120px',
                        animation: `floatUp ${item.duration}s linear forwards`,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, opacity',
                    }}>
                        {item.type === 'text' ? (
                            <div className="text-center" style={{
                                transform: `rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`,
                                fontFamily: "'Dancing Script', cursive",
                                fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
                                color: '#ffb8d2',
                                padding: '0.6rem 1.4rem',
                                background: 'rgba(15, 10, 15, 0.55)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 101, 163, 0.35)',
                                borderRadius: '30px',
                                boxShadow: '0 0 15px rgba(255, 101, 163, 0.2), inset 0 0 10px rgba(255, 101, 163, 0.1)',
                                textShadow: '0 0 8px rgba(255, 101, 163, 0.6)',
                                whiteSpace: 'nowrap',
                            }}>
                                {item.content}
                            </div>
                        ) : (
                            <img src={item.content} className={`block ${item.shape === 'shape-circle' ? 'rounded-full' : 'shape-heart'}`} style={{
                                transform: `rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`,
                                width: 'clamp(70px, 15vw, 110px)',
                                height: 'clamp(70px, 15vw, 110px)',
                                objectFit: 'cover',
                                border: '2px solid rgba(255, 101, 163, 0.5)',
                                boxShadow: '0 0 20px rgba(255, 101, 163, 0.4)',
                                animation: 'pulseGlow 2s ease-in-out infinite alternate',
                            }} alt="" />
                        )}
                    </div>
                ))}
            </div>

            {/* Sound Control */}
            {gateState === 'opened' && (
                <div className="absolute top-5 right-5 z-50 flex gap-3">
                    <button onClick={toggleMute} className="w-11 h-11 rounded-full flex items-center justify-center transition-all bg-[#121218]/50 border border-white/10 backdrop-blur-md hover:scale-105 active:scale-95">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                            {isMuted ? (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            ) : (
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            )}
                        </svg>
                    </button>
                </div>
            )}

            {/* Start Gate Overlay Screen */}
            {gateState === 'closed' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060609]/95 transition-opacity duration-700">
                    <div className="w-full max-w-sm px-6 py-10 rounded-3xl text-center shadow-2xl bg-[#121218]/65 border border-white/10 backdrop-blur-xl">
                        <h1 style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 12px rgba(255, 101, 163, 0.8)' }} className="text-4xl font-bold mb-3 text-[#ff65a3]">
                            Special Gift For You
                        </h1>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                            Sebuah persembahan kecil yang penuh warna dan kehangatan khusus untukmu, <span className="text-[#ffb8d2] font-semibold">{card.recipient_name}</span>.
                        </p>
                        <button onClick={handleOpenStart} className="relative w-20 h-20 inline-flex items-center justify-center cursor-pointer outline-none bg-transparent border-none focus:outline-none mb-3" style={{ WebkitTapHighlightColor: 'transparent' }}>
                            <div className="absolute inset-0 rounded-full animate-pulseRing bg-[#ff65a3]/15" />
                            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#ff65a3] drop-shadow-[0_0_10px_rgba(255,101,163,0.8)] animate-heartBeat">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </button>
                        <span style={{ fontFamily: "'Fredoka', sans-serif" }} className="block uppercase text-xs font-semibold tracking-widest mt-2 text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                            Buka 💗
                        </span>
                    </div>
                </div>
            )}

            {/* Countdown Overlay Screen */}
            {gateState === 'countdown' && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050508]/90 transition-opacity duration-500">
                    {!countdownGreet ? (
                        <div style={{ fontFamily: "'Fredoka', sans-serif" }} className="text-[#ff65a3] font-bold drop-shadow-[0_0_30px_rgba(255,101,163,0.8)] animate-countdownScale text-9xl">
                            {countdownVal}
                        </div>
                    ) : (
                        <div style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 20px rgba(255,101,163,0.9)' }} className="text-center text-[#ff65a3] font-bold leading-normal animate-countdownScale text-4xl sm:text-6xl max-w-lg px-6 whitespace-pre-line">
                            {typeGreetingText[card.type] || `Selamat Spesial\nUntuk ${card.recipient_name} 💗`}
                        </div>
                    )}
                </div>
            )}

            {/* Persistent Anniversary Title Screen */}
            {gateState === 'opened' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-6">
                    <div className="text-center max-w-xl transition-all duration-1000 transform translate-y-0 scale-100 opacity-100 animate-fadeIn">
                        <h2 style={{
                            fontFamily: "'Dancing Script', cursive",
                            textShadow: '0 0 15px rgba(255, 101, 163, 0.9), 0 0 30px rgba(255, 101, 163, 0.5), 0 0 45px rgba(255, 101, 163, 0.3)'
                        }} className="text-5xl sm:text-7xl font-bold text-white leading-tight mb-4 whitespace-pre-line">
                            {card.title}
                        </h2>
                        <p style={{ letterSpacing: '4px' }} className="font-light text-xs sm:text-sm uppercase text-white/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            Untuk {card.recipient_name} dari {card.sender_name} 💗
                        </p>
                    </div>
                </div>
            )}

            {/* Screen Portrait locked Alert */}
            {isLandscapeLocked && !dismissWarning && (
                <div id="portrait-warning" className="fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center text-center p-6 text-white">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff65a3] mb-6 animate-rotatePhone">
                        <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3-3H7V4h10v14z"/>
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Disarankan Putar Layar Anda</h2>
                    <p className="text-sm text-gray-400 max-w-xs mb-8">Gunakan mode landscape (horizontal) untuk menikmati pertunjukan kembang api terbaik.</p>
                    <button onClick={() => setDismissWarning(true)} className="px-6 py-2.5 rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-white/20 bg-white/10 backdrop-blur hover:bg-white/20 active:scale-95 transition-all">
                        Tetap Lanjutkan ➔
                    </button>
                </div>
            )}

            <style>{`
                @keyframes floatUp {
                    0% { transform: translateX(-50%) translateY(10vh) translateZ(0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateX(-50%) translateY(-110vh) translateZ(0); opacity: 0; }
                }
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 15px rgba(255, 101, 163, 0.3); border-color: rgba(255, 101, 163, 0.4); }
                    100% { box-shadow: 0 0 25px rgba(255, 101, 163, 0.7); border-color: rgba(255, 255, 255, 0.9); }
                }
                @keyframes countdownScale {
                    0% { transform: scale(0.3); opacity: 0; filter: blur(10px); }
                    30% { transform: scale(1.1); opacity: 1; filter: blur(0); }
                    80% { transform: scale(1); opacity: 1; filter: blur(0); }
                    100% { transform: scale(1.5); opacity: 0; filter: blur(5px); }
                }
                @keyframes pulseRing {
                    0% { transform: scale(0.6); opacity: 1; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes heartBeat {
                    0%, 100% { transform: scale(1); }
                    30% { transform: scale(1.15); }
                    45% { transform: scale(1.05); }
                    60% { transform: scale(1.2); }
                }
                @keyframes rotatePhone {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-90deg); }
                }
                .animate-countdownScale {
                    animation: countdownScale 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .animate-pulseRing {
                    animation: pulseRing 1.2s infinite ease-in-out;
                }
                .animate-heartBeat {
                    animation: heartBeat 1.2s infinite ease-in-out;
                }
                .animate-rotatePhone {
                    animation: rotatePhone 2s infinite ease-in-out;
                }
                .animate-fadeIn {
                    animation: fadeIn 2s ease-out forwards;
                }
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .shape-heart {
                    clip-path: path("M 50 93 C 3 59 0 30 25 16 C 40 10 50 16 50 23 C 50 16 60 10 75 16 C 100 30 97 59 50 93 Z");
                    -webkit-clip-path: path("M 50 93 C 3 59 0 30 25 16 C 40 10 50 16 50 23 C 50 16 60 10 75 16 C 100 30 97 59 50 93 Z");
                }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   GIFT FOR ANITA — Premium 3D Memory Book & Rain Matrix Render
   ───────────────────────────────────────────────────────── */
function GiftForAnitaFull({ card }) {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    
    const [opened, setOpened] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [flipped, setFlipped] = useState([]);
    
    // Typewriter state variables
    const [typewriterText, setTypewriterText] = useState('');
    const [currentMsgIdx, setCurrentMsgIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    // Orientation Warning state
    const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
    const [dismissWarning, setDismissWarning] = useState(false);
    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsLandscapeLocked(isMobile && window.innerHeight > window.innerWidth);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    // Ambient floating hearts generator state
    const [ambientHearts, setAmbientHearts] = useState([]);
    useEffect(() => {
        if (!opened) return;
        const hearts = ["❤️", "💖", "💗", "💕", "🌸", "💍"];
        const pinks = ['#ff4d80', '#ff66a3', '#ff99c2', '#ffd1e1'];

        const spawnHeart = () => {
            const id = Math.random().toString();
            const char = hearts[Math.floor(Math.random() * hearts.length)];
            const left = Math.random() * 95;
            const duration = 5 + Math.random() * 4;
            const delay = Math.random() * 2;
            const color = pinks[Math.floor(Math.random() * pinks.length)];

            const newHeart = { id, char, left, duration, delay, color };
            setAmbientHearts(prev => [...prev, newHeart]);

            // Auto clean
            setTimeout(() => {
                setAmbientHearts(prev => prev.filter(h => h.id !== id));
            }, (duration + delay) * 1000 + 500);
        };

        // Spawn initial bunch
        for (let i = 0; i < 8; i++) {
            setTimeout(spawnHeart, i * 400);
        }

        const interval = setInterval(spawnHeart, 1300);
        return () => clearInterval(interval);
    }, [opened]);

    // Matrix Rain canvas animation
    useEffect(() => {
        if (!opened) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 14);
            drops = Array(columns).fill(0).map(() => Math.random() * -100);
        };
        window.addEventListener('resize', resize);

        const letters = "HAPPY1STANNIVERSARYMYLOVEANITAPRECIUS💖💫✨💍💗".split("");
        const fontSize = 14;
        let columns = Math.floor(width / fontSize);
        let drops = Array(columns).fill(0).map(() => Math.random() * -100);

        const draw = () => {
            animId = requestAnimationFrame(draw);
            ctx.fillStyle = 'rgba(7, 6, 10, 0.08)';
            ctx.fillRect(0, 0, width, height);

            ctx.font = `600 ${fontSize}px 'Fredoka', sans-serif`;

            for (let i = 0; i < drops.length; i++) {
                const char = letters[Math.floor(Math.random() * letters.length)];
                const hue = 330 + (Math.random() - 0.5) * 20; // Pink variations
                
                ctx.fillStyle = `hsla(${hue}, 100%, 75%, 0.85)`;
                ctx.shadowBlur = 4;
                ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
                
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.985) {
                    drops[i] = 0;
                }
                drops[i] += 0.85;
            }
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [opened]);

    // Typewriter dynamic looping effect
    const messages = (card.messages || []).filter(Boolean);
    const romanticLines = messages.length > 0 ? messages : [
        "Hai orang ter-istimewa di hatiku... 💗",
        "Selamat satu tahun kebersamaan kita! ✨",
        "Setiap detik bersamamu adalah lembaran terindah.",
        "Dalam senyummu, aku menemukan alasan untuk bahagia. 💕",
        "Terima kasih telah selalu ada di sisiku, sayang. 👩‍❤️‍👨",
        "Mari kita tulis ribuan kisah indah lainnya bersama! 📖💫",
    ];

    useEffect(() => {
        if (!opened) return;
        const currentMsg = romanticLines[currentMsgIdx];
        let timer;

        if (isDeleting) {
            timer = setTimeout(() => {
                setTypewriterText(currentMsg.substring(0, charIdx - 1));
                setCharIdx(prev => prev - 1);
            }, 30);
        } else {
            timer = setTimeout(() => {
                setTypewriterText(currentMsg.substring(0, charIdx + 1));
                setCharIdx(prev => prev + 1);
            }, 70);
        }

        if (!isDeleting && charIdx === currentMsg.length) {
            // Wait at the end of text
            clearTimeout(timer);
            timer = setTimeout(() => setIsDeleting(true), 3500);
        } else if (isDeleting && charIdx === 0) {
            clearTimeout(timer);
            setIsDeleting(false);
            setCurrentMsgIdx(prev => (prev + 1) % romanticLines.length);
        }

        return () => clearTimeout(timer);
    }, [opened, charIdx, isDeleting, currentMsgIdx, romanticLines]);

    const handleOpen = () => {
        // Auto enter fullscreen upon user gesture
        try {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) docEl.requestFullscreen();
            else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
            else if (docEl.mozRequestFullScreen) docEl.mozRequestFullScreen();
            else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
        } catch (e) {
            console.warn("Fullscreen request blocked or failed:", e);
        }

        setOpened(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };

    const flipPage = (i) => {
        setFlipped(prev => [...new Set([...prev, i])]);
    };
    const unflipPage = (i) => {
        setFlipped(prev => prev.filter(p => p !== i));
    };

    // Dynamically compile exactly 3 folds (6 faces) memory pages utilizing multiple photos uploaded!
    const photos = (card.photos || []).filter(Boolean);
    const placeholderIllustrations = ["🌸", "💕", "🦄", "💫", "✨", "💍"];

    const getIllustration = (idx) => {
        if (photos[idx]) {
            return (
                <div className="polaroid-frame p-2 bg-white shadow-md border border-gray-200/50 rounded flex flex-col items-center justify-center transition-all hover:scale-105 hover:rotate-1 max-w-[150px] mx-auto my-1">
                    <img src={photos[idx]} className="w-[130px] h-[115px] object-cover rounded-sm mb-1.5" alt="Memory" />
                    <span style={{ fontSize: '9px' }} className="text-gray-500 font-sans tracking-wide">Our Memory 💖</span>
                </div>
            );
        }
        return <div className="page-illustration text-3xl my-2 animate-bounceIllustrate">{placeholderIllustrations[idx % placeholderIllustrations.length]}</div>;
    };

    // Folds structure: 3 pages. Fold 0 (Front: Cover, Back: Page 1), Fold 1 (Front: Page 2, Back: Page 3), Fold 2 (Front: Page 4, Back: Back Cover)
    const folds = [
        {
            front: 'cover',
            back: {
                title: 'A Beautiful Journey 🌸',
                body: romanticLines[0] || 'Perjalanan cinta terindah dimulai saat kau menyambutku hangat...',
                illIdx: 0
            }
        },
        {
            front: {
                title: 'The Unseen Bonding 💕',
                body: romanticLines[1] || 'Dalam heningku, senyummu menjadi pelipur lara termanis...',
                illIdx: 1
            },
            back: {
                title: 'Perfect Synergy 🔗',
                body: romanticLines[2] || 'Sinergi rasa yang menorehkan jutaan harmoni indah bersamamu...',
                illIdx: 2
            }
        },
        {
            front: {
                title: 'The Pure Promise 💍',
                body: romanticLines[3] || 'Mari kita jaga ikatan romansa murni ini hingga akhir waktu...',
                illIdx: 3
            },
            back: 'back-cover'
        }
    ];

    return (
        <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#07060a', fontFamily: "'Outfit', sans-serif" }}>
            <audio ref={audioRef} src="/stillwithyou/music/music.mp3" loop />
            
            {/* Ambient Stars Glow Background */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(255, 77, 128, 0.05) 0%, rgba(7, 6, 10, 0) 80%)',
            }} />

            {/* Rain matrix canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 opacity-30" />

            {/* Ambient floating hearts */}
            {opened && ambientHearts.map(h => (
                <div key={h.id} className="absolute pointer-events-none z-10 text-xl opacity-0" style={{
                    left: `${h.left}%`,
                    color: h.color,
                    animation: `floatHeart ${h.duration}s ease-in-out ${h.delay}s infinite`,
                }}>
                    {h.char}
                </div>
            ))}

            {/* Floating controls */}
            {opened && (
                <div className="absolute top-5 right-5 z-50 flex gap-3">
                    <button onClick={toggleMute} className="w-11 h-11 rounded-full flex items-center justify-center transition-all bg-[#120f16]/55 border border-[#ff4d80]/20 backdrop-blur-md hover:scale-105 active:scale-95">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                            {isMuted ? (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            ) : (
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            )}
                        </svg>
                    </button>
                </div>
            )}

            {/* Typewriter Banner */}
            <div className={`absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] z-20 text-center transition-all duration-1000 ${opened ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-[20px] scale-95'}`} style={{
                background: 'rgba(18, 15, 22, 0.55)',
                border: '1px solid rgba(255, 77, 128, 0.3)',
                borderRadius: '20px',
                padding: '1.2rem 2rem',
                boxShadow: '0 15px 35px rgba(255, 77, 128, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 8px rgba(255, 77, 128, 0.5)' }} className="text-[#ffd1e1] text-lg sm:text-2xl min-h-[2.2rem] inline-block font-semibold">
                    {typewriterText}
                </span>
                <span className="inline-block w-[2px] h-[1.2em] bg-[#ff4d80] ml-1 align-middle animate-blink" />
            </div>

            {/* Book Display System */}
            {opened && (
                <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[440px] h-[55vh] max-h-[500px] min-h-[380px] z-10 transition-all duration-1000 scale-100 opacity-100" style={{ perspective: '1500px' }}>
                    <div className="w-full h-full relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-lg">
                        {folds.map((fold, idx) => {
                            const isFlipped = flipped.includes(idx);
                            const zIndex = folds.length + 2 - idx;
                            return (
                                <div key={idx} className="absolute inset-0 transform-style-3d origin-left transition-transform duration-[1200ms] ease-in-out" style={{
                                    transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                                    zIndex: isFlipped ? idx + 2 : zIndex,
                                    cursor: 'pointer',
                                }}>
                                    {/* Front Face */}
                                    <div className="absolute inset-0 rounded-lg p-5 sm:p-7 flex flex-col items-center justify-center text-center backface-hidden" style={{
                                        background: fold.front === 'cover' ? 'linear-gradient(135deg, #4c1125 0%, #1e050d 100%)' : '#fffaf0',
                                        border: '2px solid rgba(255, 77, 128, 0.2)',
                                        color: fold.front === 'cover' ? '#ffb8d2' : '#2c1810',
                                        boxShadow: 'inset 3px 0 20px rgba(0,0,0,0.08), 5px 0 15px rgba(0,0,0,0.1)',
                                    }} onClick={() => !isFlipped && flipPage(idx)}>
                                        {fold.front === 'cover' ? (
                                            <div className="text-center">
                                                <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff4d80] drop-shadow-[0_0_15px_rgba(255,77,128,0.8)] mx-auto mb-4 animate-pulseBeat">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                </svg>
                                                <h2 style={{ fontFamily: "'Dancing Script', cursive" }} className="text-3xl sm:text-4xl font-bold mb-1">{card.title}</h2>
                                                <p className="text-[10px] sm:text-xs tracking-[3px] uppercase text-white/60">Our Story Book</p>
                                                <span className="text-[10px] text-white/30 block mt-8">Ketuk untuk membuka 💗</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col justify-between">
                                                <div style={{ letterSpacing: '2px' }} className="text-[10px] uppercase text-[#8b5a42] border-b border-[#8b5a42]/15 pb-1.5 font-semibold">
                                                    {fold.front.title}
                                                </div>
                                                <div className="flex-1 flex flex-col items-center justify-center py-2">
                                                    <p style={{ fontFamily: "'Dancing Script', cursive", lineHeight: '1.7' }} className="text-base sm:text-xl text-[#3d2218] font-bold">
                                                        "{fold.front.body}"
                                                    </p>
                                                    {getIllustration(fold.front.illIdx)}
                                                </div>
                                                <div className="flex justify-between text-[10px] text-[#9c7b6c] border-t border-[#8b5a42]/15 pt-1.5">
                                                    <span>Halaman {idx * 2 + 1}</span>
                                                    <span>Ketuk →</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Back Face */}
                                    <div className="absolute inset-0 rounded-lg p-5 sm:p-7 flex flex-col items-center justify-center text-center backface-hidden transform-rotateY-180" style={{
                                        background: fold.back === 'back-cover' ? 'linear-gradient(135deg, #1e050d 0%, #4c1125 100%)' : '#fffaf0',
                                        border: '2px solid rgba(255, 77, 128, 0.2)',
                                        color: fold.back === 'back-cover' ? '#ffb8d2' : '#2c1810',
                                        boxShadow: 'inset -3px 0 20px rgba(0,0,0,0.08), -5px 0 15px rgba(0,0,0,0.1)',
                                    }} onClick={() => isFlipped && unflipPage(idx)}>
                                        {fold.back === 'back-cover' ? (
                                            <div className="text-center">
                                                <svg viewBox="0 0 24 24" className="w-14 h-14 fill-[#ffd1e1] mx-auto mb-4 animate-pulseBeat">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                </svg>
                                                <h2 style={{ fontFamily: "'Dancing Script', cursive" }} className="text-3xl font-bold mb-1">Love You, {card.recipient_name}</h2>
                                                <p className="text-[10px] tracking-[2px] uppercase text-white/50">Always & Forever</p>
                                                <span className="text-[10px] text-white/30 block mt-4 font-semibold">Dari: {card.sender_name}</span>
                                                <span className="text-[9px] text-white/20 block mt-8 font-light">Ketuk untuk mengulang</span>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col justify-between">
                                                <div style={{ letterSpacing: '2px' }} className="text-[10px] uppercase text-[#8b5a42] border-b border-[#8b5a42]/15 pb-1.5 font-semibold">
                                                    {fold.back.title}
                                                </div>
                                                <div className="flex-1 flex flex-col items-center justify-center py-2">
                                                    <p style={{ fontFamily: "'Dancing Script', cursive", lineHeight: '1.7' }} className="text-base sm:text-xl text-[#3d2218] font-bold">
                                                        "{fold.back.body}"
                                                    </p>
                                                    {getIllustration(fold.back.illIdx)}
                                                </div>
                                                <div className="flex justify-between text-[10px] text-[#9c7b6c] border-t border-[#8b5a42]/15 pt-1.5">
                                                    <span>← Kembali</span>
                                                    <span>Halaman {idx * 2 + 2}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Swipe Instructions indicator */}
                    <div className="absolute bottom-[-55px] left-1/2 transform -translate-x-1/2 text-gray-400 text-xs flex items-center gap-2 tracking-widest uppercase opacity-75 font-semibold">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current animate-swipeHand">
                            <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74C16 4.47 13.53 2 10.5 2S5 4.47 5 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.27A2.5 2.5 0 0 0 11 12.5v-5a1.5 1.5 0 0 1 3 0v5h1.75l3.54 1.77c.4.2.71.53.84.95.14.42.11.88-.09 1.25l-.84 1.4c-.25.42-.71.68-1.2.68H13c-2.21 0-4-1.79-4-4V12H7v2.5A4.5 4.5 0 0 0 11.5 19H18c1.3 0 2.47-.83 2.89-2.06l.84-2.52a3.033 3.033 0 0 0-1.89-3.55z" />
                        </svg>
                        <span>Buka lembaran halaman</span>
                    </div>
                </div>
            )}

            {/* Opening Overlay Screen */}
            {!opened && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#060609]/96 transition-opacity duration-700">
                    <div className="w-full max-w-sm px-6 py-10 rounded-3xl text-center shadow-2xl bg-[#121018]/65 border border-[#ff4d80]/20 backdrop-blur-xl">
                        <h1 style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 10px rgba(255, 77, 128, 0.8)' }} className="text-4xl font-bold mb-3 text-[#ff4d80]">
                            Special Gift Box 🎁
                        </h1>
                        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                            Ada sebuah kotak memori penuh keajaiban khusus yang telah dirangkai untukmu, <span className="text-[#ffb8d2] font-semibold">{card.recipient_name}</span>.
                        </p>
                        <button onClick={handleOpen} className="relative w-20 h-20 inline-flex items-center justify-center cursor-pointer outline-none bg-transparent border-none focus:outline-none mb-3" style={{ WebkitTapHighlightColor: 'transparent' }}>
                            <div className="absolute inset-0 rounded-full animate-pulseRing bg-[#ff4d80]/15" />
                            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-[#ff4d80] drop-shadow-[0_0_12px_rgba(255,77,128,0.8)] animate-bounceGift">
                                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.67C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h16v6z" />
                            </svg>
                        </button>
                        <span style={{ fontFamily: "'Fredoka', sans-serif" }} className="block uppercase text-xs font-semibold tracking-widest mt-2 text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                            Buka Hadiah 💗
                        </span>
                    </div>
                </div>
            )}

            {/* Screen Orientation warning lock */}
            {isLandscapeLocked && !dismissWarning && (
                <div id="orientation-lock" className="fixed inset-0 z-[99999] bg-[#07060a] flex flex-col items-center justify-center text-center p-6 text-white">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#ff4d80] mb-6 animate-rotatePhone">
                        <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3-3H7V4h10v14z"/>
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Disarankan Putar Layar Anda</h2>
                    <p className="text-sm text-gray-400 max-w-xs mb-8">Gunakan mode landscape (horizontal) untuk membuka buku memori secara maksimal.</p>
                    <button onClick={() => setDismissWarning(true)} className="px-6 py-2.5 rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-[#ff4d80]/30 bg-white/5 backdrop-blur hover:bg-white/10 active:scale-95 transition-all">
                        Tetap Lanjutkan ➔
                    </button>
                </div>
            )}

            <style>{`
                @keyframes floatHeart {
                    0% { transform: translateY(110vh) scale(0) rotate(0deg); opacity: 0; }
                    15% { opacity: 0.65; }
                    90% { opacity: 0.65; }
                    100% { transform: translateY(-10vh) scale(1.2) rotate(360deg); opacity: 0; }
                }
                @keyframes bounceGift {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.08); }
                }
                @keyframes pulseCircle {
                    0% { transform: scale(0.6); opacity: 1; }
                    100% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                @keyframes pulseBeat {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                @keyframes bounceIllustrate {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-8px); }
                }
                @keyframes swipeHand {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(8px); }
                }
                @keyframes rotatePhone {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-90deg); }
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .transform-rotateY-180 {
                    transform: rotateY(180deg);
                }
                .animate-blink {
                    animation: blink 0.8s infinite;
                }
                .animate-pulseBeat {
                    animation: pulseBeat 1.5s infinite alternate;
                }
                .animate-bounceIllustrate {
                    animation: bounceIllustrate 2s ease-in-out infinite alternate;
                }
                .animate-swipeHand {
                    animation: swipeHand 1.5s infinite ease-in-out;
                }
                .animate-rotatePhone {
                    animation: rotatePhone 2s infinite ease-in-out;
                }
                .animate-bounceGift {
                    animation: bounceGift 1.2s infinite ease-in-out;
                }
                .polaroid-frame {
                    background: #ffffff;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
                    transform: rotate(-1deg);
                }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   ROOT PREVIEW PAGE (Safe React Error Boundary Wrapper)
   ───────────────────────────────────────────────────────── */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '30px', background: '#fff', color: '#721c24', border: '5px solid #f5c6cb', borderRadius: '12px', margin: '20px', fontFamily: 'monospace', maxWidth: '800px' }}>
                    <h2 style={{ margin: '0 0 10px 0', color: '#721c24' }}>React Rendering Error occurred:</h2>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', background: '#f8d7da', padding: '10px', borderRadius: '6px' }}>
                        {this.state.error && this.state.error.toString()}
                    </p>
                    <h3 style={{ margin: '20px 0 10px 0' }}>Stack Trace:</h3>
                    <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '6px', overflowX: 'auto', fontSize: '12px', lineHeight: '1.6' }}>
                        {this.state.error && this.state.error.stack}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}

function GreetingCardPreviewContent({ card }) {
    // Graceful data normalizer to secure preview against undefined fields or bad JSON formats
    const normalizedCard = {
        ...card,
        recipient_name: card?.recipient_name || 'Nama Penerima',
        sender_name:    card?.sender_name || 'Nama Pengirim',
        title:          card?.title || 'Kartu Ucapan',
        template:       card?.template || 'stillwithyou',
        type:           card?.type || 'anniversary',
        type_label:     card?.type_label || 'Ucapan Spesial',
        photo_url:      card?.photo_url || '',
        photos:         Array.isArray(card?.photos)
            ? card.photos
            : (typeof card?.photos === 'string'
                ? (() => {
                    try {
                        const parsed = JSON.parse(card.photos);
                        return Array.isArray(parsed) ? parsed : [card.photos];
                    } catch {
                        return [card.photos];
                    }
                })()
                : (card?.photo_url ? [card.photo_url] : [])),
        messages:       Array.isArray(card?.messages)
            ? card.messages
            : (typeof card?.messages === 'string'
                ? (() => {
                    try {
                        const parsed = JSON.parse(card.messages);
                        return Array.isArray(parsed) ? parsed : [card.messages];
                    } catch {
                        return [card.messages];
                    }
                })()
                : [])
    };

    return (
        <>
            <Head>
                <title>{`${normalizedCard.title} — Untuk ${normalizedCard.recipient_name}`}</title>
                <meta name="description" content={`Kartu ucapan spesial untuk ${normalizedCard.recipient_name} dari ${normalizedCard.sender_name}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Fredoka:wght@400;600&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet" />
            </Head>

            {normalizedCard.template === 'stillwithyou' ? (
                <StillWithYouFull card={normalizedCard} />
            ) : (
                <GiftForAnitaFull card={normalizedCard} />
            )}
        </>
    );
}

export default function GreetingCardPreview({ card }) {
    return (
        <ErrorBoundary>
            <GreetingCardPreviewContent card={card} />
        </ErrorBoundary>
    );
}
