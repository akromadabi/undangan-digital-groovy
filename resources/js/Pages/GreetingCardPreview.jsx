import React, { useEffect, useRef, useState, useMemo } from 'react';
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
        } else if (type === 'click') {
            // Short mechanical wood click
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'sip') {
            // Coffee sipping sound (suction + bubble)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
            gainNode.gain.setValueAtTime(0.04, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            
            // Add air bubble crackle
            setTimeout(() => {
                playSynthesizedSound('crackle', false);
            }, 80);
        } else if (type === 'meow') {
            // High pitch cat meow sweep
            osc.type = 'sine';
            osc.frequency.setValueAtTime(650, now);
            osc.frequency.quadraticRampToValueAtTime(900, now + 0.15);
            osc.frequency.exponentialRampToValueAtTime(750, now + 0.3);
            gainNode.gain.setValueAtTime(0.06, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'purr') {
            // Low purr vibration (sine modulated at 15Hz)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(75, now);
            
            // Simple gain modulation (LFO)
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(15, now); // 15Hz purr rate
            lfoGain.gain.setValueAtTime(0.03, now);
            
            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain); // Modulate main volume
            
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.linearRampToValueAtTime(0.08, now + 0.8);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
            
            lfo.start(now);
            osc.start(now);
            lfo.stop(now + 1.0);
            osc.stop(now + 1.0);
        } else if (type === 'shutter') {
            // Camera click + whirr print
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
            
            // Print motor whirr shortly after
            setTimeout(() => {
                try {
                    const ctx = getAudioContext();
                    const now = ctx.currentTime;
                    const motorOsc = ctx.createOscillator();
                    const motorGain = ctx.createGain();
                    motorOsc.connect(motorGain);
                    motorGain.connect(ctx.destination);
                    
                    motorOsc.type = 'triangle';
                    motorOsc.frequency.setValueAtTime(120, now);
                    motorOsc.frequency.linearRampToValueAtTime(240, now + 0.7);
                    
                    motorGain.gain.setValueAtTime(0.05, now);
                    motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
                    motorOsc.start(now);
                    motorOsc.stop(now + 0.7);
                } catch (e) {}
            }, 150);
        }
    } catch (err) {
        console.error("Synthesized sound blocked/failed:", err);
    }
}



/* ─────────────────────────────────────────────────────────
   LOFI LOVE BEATS — Full Premium Turntable & Cozy Cafe Render
   ───────────────────────────────────────────────────────── */
function LofiLoveFull({ card }) {
    const audioRef = useRef(null);
    const rainCanvasRef = useRef(null);
    
    // Stage: 'door_intro' -> 'opened'
    const [stage, setStage] = useState('door_intro'); 
    const [doorOpened, setDoorOpened] = useState(false);
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [theme, setTheme] = useState('sunset'); // 'sunset' | 'midnight' | 'cozy'
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);
    const [lightboxFlipped, setLightboxFlipped] = useState(false);
    const [floatingNotes, setFloatingNotes] = useState([]);
    
    // Interactive vinyl state
    const [vinylMounted, setVinylMounted] = useState(false);
    const [mountingProgress, setMountingProgress] = useState(false);
    
    // Interactive vinyl swipe gesture detector
    const [swipeStart, setSwipeStart] = useState(null);
    const [swipeDetected, setSwipeDetected] = useState(false);

    const handleSwipeStart = (e) => {
        if (mountingProgress || candleBlowStage !== 'lit') return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setSwipeStart({ x: clientX, y: clientY });
        setSwipeDetected(false);
    };

    const handleSwipeMove = (e) => {
        if (!swipeStart || swipeDetected || mountingProgress || candleBlowStage !== 'lit') return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const dx = clientX - swipeStart.x;
        const dy = clientY - swipeStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 25) { // 25px swipe threshold
            setSwipeDetected(true);
            setSwipeStart(null);
            if (!vinylMounted) {
                handleMountVinyl();
            } else if (!isPlaying) {
                handleTogglePlay();
            }
        }
    };

    const handleSwipeEnd = () => {
        setSwipeStart(null);
    };

    const handleOpenDoor = () => {
        if (doorOpened) return;
        setDoorOpened(true);
        playSynthesizedSound('lift', false);
        setTimeout(() => {
            setStage('opened');
        }, 1800);
    };
    
    // Cozy Candle and Room overrides
    const [candleOn, setCandleOn] = useState(true);
    const [lightningActive, setLightningActive] = useState(false);
    
    // VU Needles rotations state
    const [leftVuRotate, setLeftVuRotate] = useState(-40);
    const [rightVuRotate, setRightVuRotate] = useState(-40);

    // --- NEW Cozy Room State ---
    const [timeString, setTimeString] = useState('20:00:00');
    const [coffeeLevel, setCoffeeLevel] = useState(3); // 3 = full, 2 = 2/3, 1 = 1/3, 0 = empty
    const [coffeeRefilling, setCoffeeRefilling] = useState(false);
    const [catMood, setCatMood] = useState('sleep'); // 'sleep' | 'wake' | 'purr'
    const [catEmojiBursts, setCatEmojiBursts] = useState([]);
    const [blindsClosed, setBlindsClosed] = useState(false);
    const [rpm, setRpm] = useState(33); // 33 | 45
    const [volume, setVolume] = useState(0.85); // 0.0 to 1.0
    const [printedPolaroids, setPrintedPolaroids] = useState([]);
    const [snapCount, setSnapCount] = useState(0);
    const [printingPolaroid, setPrintingPolaroid] = useState(false);
    const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
    const [candleBlowStage, setCandleBlowStage] = useState('unlit'); // 'unlit' | 'lighting' | 'lit'

    const quotesPool = [
        "Kamu adalah nada terindah dalam lofi hidupku. ✨",
        "Secangkir kopi hangat, rintik hujan, dan senyummu. ❤️",
        "Bersamamu, setiap detik terasa menenangkan seperti beat lofi. 🎶",
        "Terima kasih telah menemani hari-hariku yang sederhana ini. ☕",
        "Cinta kita berputar selaras piringan hitam ini. 💿",
        "Di kehangatan sunset maupun tenangnya midnight, pilihanku tetap kamu. 🌇",
        "Kamu adalah melodi lofi terfavorit yang ingin kuputar selamanya. 🎧"
    ];

    // Digital clock updater
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            setTimeString(`${hh}:${mm}:${ss}`);
        };
        updateClock();
        const clockInterval = setInterval(updateClock, 1000);
        return () => clearInterval(clockInterval);
    }, []);

    // Apply Volume & RPM (playbackRate) dynamically to audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.playbackRate = rpm === 45 ? 1.25 : 1.0;
        }
    }, [volume, rpm, isPlaying]);

    const mainMessage = card.messages?.[0] || 'Di kehangatan malam ini, semoga setiap nada lofi ini membisikkan doa kebahagiaan untukmu. Selamat menikmati hari spesialmu!';

    const calendarDate = useMemo(() => {
        const now = new Date();
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
            dayNum: now.getDate(),
            month: months[now.getMonth()]
        };
    }, []);

    // Coffee auto refilling effect
    useEffect(() => {
        if (coffeeLevel === 0 && !coffeeRefilling) {
            setCoffeeRefilling(true);
            const timer = setTimeout(() => {
                playSynthesizedSound('crackle', false);
                setCoffeeLevel(3);
                setCoffeeRefilling(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [coffeeLevel, coffeeRefilling]);

    // Slideshow for photos inside window
    useEffect(() => {
        if (stage !== 'opened' || blindsClosed || !card.photos || card.photos.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentPhotoIdx(prev => (prev + 1) % card.photos.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [stage, blindsClosed, card.photos]);

    // Raindrop Canvas Effect
    useEffect(() => {
        const canvas = rainCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', handleResize);

        const drops = [];
        const maxDrops = 40;

        for (let i = 0; i < maxDrops; i++) {
            drops.push({
                x: Math.random() * width,
                y: Math.random() * height,
                len: Math.random() * 10 + 5,
                speed: Math.random() * 1.6 + 1.1,
                opacity: Math.random() * 0.12 + 0.04
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1.0;
            
            drops.forEach(d => {
                ctx.strokeStyle = theme === 'midnight' 
                    ? `rgba(34, 211, 238, ${d.opacity * 1.8})` 
                    : `rgba(255, 255, 255, ${d.opacity})`;
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - 1, d.y + d.len);
                ctx.stroke();

                d.y += d.speed;
                d.x -= 0.12;
                if (d.y > height) {
                    d.y = -d.len;
                    d.x = Math.random() * width;
                }
                if (d.x < 0) {
                    d.x = width;
                }
            });

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, [theme, stage]);

    // Typewriter message effect
    useEffect(() => {
        if (stage !== 'opened' || !vinylMounted) return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);

        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                setTypingDone(true);
                clearInterval(interval);
            }
        }, 45);

        return () => clearInterval(interval);
    }, [stage, vinylMounted, mainMessage]);

    // Floating note visuals
    useEffect(() => {
        if (!isPlaying) {
            setFloatingNotes([]);
            return;
        }
        const interval = setInterval(() => {
            const symbols = ['🎵', '🎶', '💖', '✨', '🎧'];
            const symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const id = Math.random();
            const startX = 35 + Math.random() * 25; // floating directly above the record player
            
            setFloatingNotes(prev => [...prev, {
                id,
                symbol,
                x: startX,
                scale: 0.6 + Math.random() * 0.5,
                rotate: Math.random() * 60 - 30,
            }]);

            setTimeout(() => {
                setFloatingNotes(prev => prev.filter(item => item.id !== id));
            }, 3000);
        }, 800);

        return () => clearInterval(interval);
    }, [isPlaying]);

    // VU Needles Swing Loop
    useEffect(() => {
        if (!isPlaying) {
            // soft return to zero
            const interval = setInterval(() => {
                setLeftVuRotate(prev => prev > -40 ? prev - 1.5 : -40);
                setRightVuRotate(prev => prev > -40 ? prev - 1.5 : -40);
            }, 30);
            return () => clearInterval(interval);
        }

        let animationFrameId;
        let time = 0;

        const updateNeedles = () => {
            time += 0.15;
            
            // Generate rhythmic bouncing math values simulating lofi rhythm
            const baseSwing = Math.sin(time * 0.8) * Math.cos(time * 0.3);
            const peakFactorLeft = Math.random() > 0.85 ? 18 : 0;
            const peakFactorRight = Math.random() > 0.82 ? 22 : 0;

            const leftTarget = -12 + (baseSwing * 18) + (Math.random() * 8) + peakFactorLeft;
            const rightTarget = -15 + (baseSwing * 22) + (Math.random() * 6) + peakFactorRight;

            // clamp swing between -40 and +25 degrees
            setLeftVuRotate(prev => prev + (leftTarget - prev) * 0.22);
            setRightVuRotate(prev => prev + (rightTarget - prev) * 0.22);

            animationFrameId = requestAnimationFrame(updateNeedles);
        };

        updateNeedles();

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying]);

    // Lightning Flash Scheduler
    useEffect(() => {
        if (stage !== 'opened' || theme !== 'midnight') return;
        
        const scheduleLightning = () => {
            const delay = 12000 + Math.random() * 15000; // random interval
            return setTimeout(() => {
                setLightningActive(true);
                // soft thunder synthesized sizzle sound
                playSynthesizedSound('burst', isMuted);
                
                setTimeout(() => {
                    setLightningActive(false);
                    scheduleLightning();
                }, 220); // lightning flash length
            }, delay);
        };

        const timer = scheduleLightning();
        return () => clearTimeout(timer);
    }, [stage, theme, isMuted]);

    // Visibility tab change handler
    useEffect(() => {
        const handleVisibility = () => {
            if (document.hidden) {
                if (isPlaying && audioRef.current) {
                    audioRef.current.pause();
                }
            } else {
                if (isPlaying && audioRef.current && !isMuted) {
                    audioRef.current.play().catch(() => {});
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [isPlaying, isMuted]);

    // Playback control
    const handleTogglePlay = () => {
        if (!vinylMounted || !audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            setIsMuted(true);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsMuted(false);
            }).catch(() => {
                setIsPlaying(true);
                setIsMuted(false);
            });
        }
    };

    const handleOpenEnvelope = () => {
        playSynthesizedSound('crackle', false);
        setEnvelopeOpen(true);
        setTimeout(() => {
            setStage('opened');
        }, 1200);
    };

    // Slide-out and mount vinyl animation
    const handleMountVinyl = () => {
        if (mountingProgress || vinylMounted) return;
        setMountingProgress(true);
        playSynthesizedSound('lift', isMuted);
        
        setTimeout(() => {
            setVinylMounted(true);
            setMountingProgress(false);
            // auto play music on record mount
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().then(() => {
                        setIsPlaying(true);
                        setIsMuted(false);
                    }).catch(() => {});
                }
            }, 600);
        }, 1200); // match slide-out animation length
    };

    // Color theme styles
    const themeStyles = {
        sunset: {
            bg: 'bg-gradient-to-b from-[#1b0e14] via-[#2f1b21] to-[#120a0d]',
            cardBg: 'bg-rose-950/40 border-rose-900/30',
            textColor: 'text-rose-100',
            subText: 'text-rose-300/70',
            buttonActive: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            buttonInactive: 'bg-white/5 text-white/50 border-white/10',
            neonGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]',
            lightColor: 'bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.8)]',
            windowReflect: 'rgba(251,113,133,0.06)'
        },
        midnight: {
            bg: 'bg-gradient-to-b from-[#0b0c16] via-[#161730] to-[#05060b]',
            cardBg: 'bg-cyan-950/40 border-cyan-900/30',
            textColor: 'text-cyan-100',
            subText: 'text-cyan-300/70',
            buttonActive: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
            buttonInactive: 'bg-white/5 text-white/50 border-white/10',
            neonGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
            lightColor: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]',
            windowReflect: 'rgba(6,182,212,0.06)'
        },
        cozy: {
            bg: 'bg-gradient-to-b from-[#1b1513] via-[#2d211a] to-[#0e0a08]',
            cardBg: 'bg-amber-950/40 border-amber-900/30',
            textColor: 'text-amber-100',
            subText: 'text-amber-300/70',
            buttonActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            buttonInactive: 'bg-white/5 text-white/50 border-white/10',
            neonGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
            lightColor: 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]',
            windowReflect: 'rgba(251,191,36,0.06)'
        }
    }[theme];

    return (
        <div className={`fixed inset-0 overflow-hidden flex flex-col items-center justify-center select-none ${themeStyles.bg} transition-colors duration-1000`}>
            <audio ref={audioRef} src="/stillwithyou/music/music.mp3" loop />
            
            {/* Dynamic lightning flash overlay */}
            <div className={`absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-75 ${lightningActive ? 'opacity-35' : 'opacity-0'}`} />

            {/* Raindrops Canvas */}
            <canvas ref={rainCanvasRef} className="absolute inset-0 pointer-events-none z-10 opacity-70" />

            {/* Candle light ambient mood glow overlay (aligned to bottom-right where candle stands) */}
            <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000 ${candleOn && stage === 'opened' && candleBlowStage === 'lit' ? 'opacity-100' : 'opacity-0'}`}
                style={{ background: 'radial-gradient(circle at 85% 85%, rgba(251,191,36,0.09) 0%, rgba(251,191,36,0.03) 45%, transparent 70%)' }}
            />

            {/* Custom Interactive Elements Style */}
            <style>{`
                @keyframes steam {
                    0% { transform: translateY(0) scaleX(1); opacity: 0; }
                    15% { opacity: 0.6; }
                    50% { transform: translateY(-25px) scaleX(1.4); opacity: 0.3; }
                    100% { transform: translateY(-50px) scaleX(0.7); opacity: 0; }
                }
                @keyframes bulbPulse {
                    0%, 100% { opacity: 0.6; filter: brightness(0.9); }
                    50% { opacity: 1; filter: brightness(1.25); }
                }
                @keyframes noteRise {
                    0% { transform: translateY(0) scale(0.6) rotate(0deg); opacity: 0; }
                    15% { opacity: 0.95; }
                    80% { opacity: 0.95; }
                    100% { transform: translateY(-120px) scale(1.15) rotate(var(--rot)); opacity: 0; }
                }
                @keyframes catBreathe {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.04) translateY(-0.6px); }
                }
                @keyframes catPurrBreathe {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.08) translateY(-1.2px) scaleX(1.02); }
                }
                @keyframes swingTail {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(18deg) translateY(-1.5px); }
                }
                @keyframes swingTailFast {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(28deg) translateY(-2px); }
                }
                @keyframes wiggleEar {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-15deg); }
                }
                @keyframes flameWobble {
                    0%, 100% { transform: translate(-50%, 0) scale(1) rotate(-1deg); }
                    50% { transform: translate(-50%, 0) scale(1.08, 0.94) rotate(2.2deg); }
                }
                @keyframes flameFlickerWild {
                    0%, 100% { transform: translate(-50%, 0) scale(1.15, 0.85) rotate(-3deg); filter: brightness(1.2); }
                    20% { transform: translate(-50%, 0) scale(0.85, 1.25) rotate(7deg); filter: brightness(0.9); }
                    40% { transform: translate(-50%, 0) scale(1.4, 0.7) rotate(-9deg); filter: brightness(1.3); }
                    60% { transform: translate(-50%, 0) scale(0.7, 1.45) rotate(9deg); filter: brightness(0.8); }
                    80% { transform: translate(-50%, 0) scale(1.25, 0.75) rotate(-6deg); filter: brightness(1.1); }
                }
                @keyframes slideVinyl {
                    0% { transform: translate(-150px, 80px) rotate(-120deg) scale(0.6); opacity: 0.4; }
                    100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
                }
                @keyframes neonFlicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 0.95; filter: drop-shadow(0 0 10px rgba(244,63,94,0.4)); }
                    20%, 24%, 55% { opacity: 0.3; filter: none; }
                }
                @keyframes floatDust {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.4; }
                    90% { opacity: 0.4; }
                    100% { transform: translateY(-80px) translateX(15px); opacity: 0; }
                }
                @keyframes cameraFlash {
                    0% { opacity: 0; }
                    10% { opacity: 0.95; }
                    40% { opacity: 0.95; }
                    100% { opacity: 0; }
                }
                @keyframes printPolaroidAnim {
                    0% { transform: translateY(-20px) scale(0.3); opacity: 0; }
                    100% { transform: translateY(60px) scale(1) rotate(-8deg); opacity: 1; }
                }
                @keyframes emojiFloat {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(-50px) translateX(var(--emoji-x)) scale(1.2); opacity: 0; }
                }
                .steam-line {
                    animation: steam 3s ease-out infinite;
                }
                .bulb-glow {
                    animation: bulbPulse 2s ease-in-out infinite;
                }
                .floating-note {
                    animation: noteRise 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .envelop-glow {
                    box-shadow: 0 0 25px rgba(244,63,94,0.12);
                    animation: bulbPulse 3s ease-in-out infinite;
                }
                .vinyl-mount-animate {
                    animation: slideVinyl 1.1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .neon-glow-sign {
                    animation: neonFlicker 6s ease-in-out infinite;
                }
                .dust-mote {
                    animation: floatDust 8s ease-in-out infinite;
                }
                .camera-flash-active {
                    animation: cameraFlash 0.55s ease-out forwards;
                }
                .print-polaroid-effect {
                    animation: printPolaroidAnim 1.4s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .emoji-floater {
                    animation: emojiFloat 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                .flame-intro {
                    animation: flameWobble 0.15s ease-in-out infinite;
                    background: radial-gradient(circle at 50% 80%, #ffffff 0%, #fcd34d 40%, #f97316 75%, transparent 100%);
                    box-shadow: 0 0 20px rgba(251,191,36,0.95), 0 0 35px rgba(249,115,22,0.6);
                }
                .flame-blowing {
                    animation: flameFlickerWild 0.08s infinite;
                    background: radial-gradient(circle at 50% 80%, #ffffff 0%, #fb923c 30%, #ef4444 70%, transparent 100%);
                    box-shadow: 0 0 35px rgba(239,68,68,0.95), 0 0 55px rgba(249,115,22,0.8);
                }
                .scrollbar-thin::-webkit-scrollbar {
                    height: 4px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 99px;
                }
                @keyframes candleGlowPulse {
                    0%, 100% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.15), 0 0 45px rgba(251, 191, 36, 0.04); filter: brightness(0.97); }
                    50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.32), 0 0 65px rgba(251, 191, 36, 0.15); filter: brightness(1.03); }
                }
                .candle-bathed-card {
                    animation: candleGlowPulse 2.4s ease-in-out infinite;
                }
                @keyframes roomGlowPulse {
                    0%, 100% { opacity: 0.88; }
                    50% { opacity: 1; }
                }
                .candle-room-glow {
                    animation: roomGlowPulse 2s ease-in-out infinite;
                }
                .cafe-door-container {
                    perspective: 1200px;
                    overflow: hidden;
                }
                .cafe-door {
                    transition: transform 1.8s cubic-bezier(0.25, 1, 0.3, 1), opacity 1.8s cubic-bezier(0.25, 1, 0.3, 1);
                    transform-style: preserve-3d;
                }
                .cafe-door-left {
                    transform-origin: left center;
                }
                .cafe-door-right {
                    transform-origin: right center;
                }
                .cafe-door-left.open {
                    transform: rotateY(-115deg) scale(1.05);
                    opacity: 0;
                }
                .cafe-door-right.open {
                    transform: rotateY(115deg) scale(1.05);
                    opacity: 0;
                }
                .room-view-transition {
                    transition: filter 1.8s cubic-bezier(0.25, 1, 0.3, 1), transform 1.8s cubic-bezier(0.25, 1, 0.3, 1), opacity 1.8s cubic-bezier(0.25, 1, 0.3, 1);
                }
                .room-view-blurred {
                    filter: blur(6px);
                    transform: scale(0.96);
                    opacity: 0.45;
                    pointer-events: none;
                }
                .room-view-clear {
                    filter: blur(0px);
                    transform: scale(1);
                    opacity: 1;
                }
            `}</style>

            {/* String Lights at Top */}
            <div className="absolute top-0 left-0 right-0 h-10 flex justify-around items-center px-8 z-20 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-0.5 h-3.5 bg-neutral-800" />
                        <div 
                            className={`w-3.5 h-3.5 rounded-full ${themeStyles.lightColor} ${isPlaying ? 'bulb-glow' : 'opacity-55'}`}
                            style={{ animationDelay: `${i * 0.4}s` }}
                        />
                    </div>
                ))}
            </div>

            {/* Double doors overlay for Cafe Entry */}
            {(stage === 'door_intro' || (stage === 'opened' && !doorOpened)) && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden cafe-door-container"
                >
                    {/* Left Door */}
                    <div 
                        onClick={handleOpenDoor}
                        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#1c0f0b] via-[#2d1b15] to-[#1e100c] border-r-2 border-[#120805] shadow-2xl flex items-center justify-end p-6 cursor-pointer select-none cafe-door cafe-door-left pointer-events-auto ${
                            doorOpened ? 'open' : ''
                        }`}
                        style={{ 
                            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85), 5px 0 15px rgba(0,0,0,0.6)'
                        }}
                    >
                        {/* Door Pane Details - Glass Panel */}
                        <div className="w-[85%] h-[75%] border-4 border-[#120805] bg-black/10 backdrop-blur-[3px] rounded shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                            {/* Glass highlights */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                            {/* Wooden Grids */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#120805]" />
                            <div className="absolute left-0 right-0 top-1/2 h-1 bg-[#120805]" />
                            
                            {/* Welcome Sign Hanging on Left Door Glass */}
                            <div className="absolute top-[22%] left-1/2 -translate-x-1/2 bg-[#fefbf6] text-[#3a2218] border-2 border-[#543527] px-4 py-2.5 rounded shadow-lg transform rotate-[-3deg] text-center font-mono select-none pointer-events-none border-dashed animate-pulse">
                                <span className="text-[10px] font-bold tracking-widest block uppercase text-rose-800">☕ COZY CAFE</span>
                                <span className="text-[12px] font-black tracking-wider block text-neutral-900 mt-0.5">BUKA / OPEN</span>
                                <span className="text-[7px] text-neutral-500 font-bold block mt-1 uppercase tracking-wide">Ketuk Pintu</span>
                            </div>
                        </div>

                        {/* Door Handle (Brass) */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                            {/* Plate */}
                            <div className="w-3.5 h-20 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 rounded border border-amber-800 shadow-md flex flex-col justify-between py-1.5 px-0.5">
                                <div className="w-1 h-1 rounded-full bg-amber-900 mx-auto" />
                                <div className="w-1.5 h-10 bg-gradient-to-r from-amber-500 to-amber-400 rounded-sm border border-amber-600 shadow mx-auto" />
                                <div className="w-1 h-1 rounded-full bg-amber-900 mx-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Right Door */}
                    <div 
                        onClick={handleOpenDoor}
                        className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#1c0f0b] via-[#2d1b15] to-[#1e100c] border-l-2 border-[#120805] shadow-2xl flex items-center justify-start p-6 cursor-pointer select-none cafe-door cafe-door-right pointer-events-auto ${
                            doorOpened ? 'open' : ''
                        }`}
                        style={{ 
                            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85), -5px 0 15px rgba(0,0,0,0.6)'
                        }}
                    >
                        {/* Door Pane Details - Glass Panel */}
                        <div className="w-[85%] h-[75%] border-4 border-[#120805] bg-black/10 backdrop-blur-[3px] rounded shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                            {/* Glass highlights */}
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-white/10 pointer-events-none" />
                            {/* Wooden Grids */}
                            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-[#120805]" />
                            <div className="absolute left-0 right-0 top-1/2 h-1 bg-[#120805]" />
                        </div>

                        {/* Door Handle (Brass) */}
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                            {/* Plate */}
                            <div className="w-3.5 h-20 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700 rounded border border-amber-800 shadow-md flex flex-col justify-between py-1.5 px-0.5">
                                <div className="w-1 h-1 rounded-full bg-amber-900 mx-auto" />
                                <div className="w-1.5 h-10 bg-gradient-to-r from-amber-500 to-amber-400 rounded-sm border border-amber-600 shadow mx-auto" />
                                <div className="w-1 h-1 rounded-full bg-amber-900 mx-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Floor Mat / Prompt Sign */}
                    <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-55 text-center pointer-events-none transition-all duration-[1200ms] ${
                        doorOpened ? 'opacity-0 scale-90 -translate-y-4' : 'opacity-100'
                    }`}>
                        <div className="bg-[#120805]/95 border border-amber-900/40 rounded-full px-5 py-2.5 shadow-xl backdrop-blur-sm">
                            <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest uppercase animate-pulse">
                                🚪 KETUK PINTU UNTUK MASUK KAFE
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Dark Room overlay when candle is unlit */}
            {(stage === 'opened' || stage === 'door_intro') && (
                <div 
                    className={`absolute inset-0 transition-opacity duration-1000 z-20 flex flex-col items-center justify-center bg-[#07070a] ${
                        stage === 'door_intro'
                            ? (doorOpened ? 'opacity-0 pointer-events-none' : 'opacity-[0.82] pointer-events-none')
                            : candleBlowStage === 'lit' 
                                ? 'opacity-0 pointer-events-none' 
                                : candleBlowStage === 'lighting' 
                                    ? 'opacity-60' 
                                    : 'opacity-98'
                    }`}
                >
                    {/* Guidance Text in the dark */}
                    {candleBlowStage === 'unlit' && stage === 'opened' && (
                        <div className="text-center px-4 max-w-xs animate-in fade-in duration-1000">
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-950/40 border border-amber-900/40 px-3 py-1 rounded-full font-mono tracking-widest uppercase shadow-sm animate-pulse">
                                🕯️ MOMEN SPESIAL 🕯️
                            </span>
                            <h2 className="text-lg font-bold text-white mt-4 font-mono tracking-wide leading-snug">
                                {card.title}
                            </h2>
                            <p className="text-[10px] text-neutral-400 font-mono mt-2.5 tracking-widest uppercase leading-relaxed animate-bounce">
                                👇 NYALAKAN LILIN DI SEBELAH KANAN UNTUK MEMULAI
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ SCENE 2: COZY LOFI ROOM & TURNTABLE ═══ */}
            {(stage === 'opened' || stage === 'door_intro') && (
                <div className={`absolute inset-0 z-10 flex flex-col items-center justify-between p-6 room-view-transition ${
                    stage === 'door_intro' && !doorOpened ? 'room-view-blurred' : 'room-view-clear'
                }`}>
                    
                    {/* Camera flash overlay */}
                    <div id="camera-flash-overlay" className="absolute inset-0 bg-white pointer-events-none z-50 opacity-0" />

                    {/* Ambient warm dust particles floating around */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                        {[...Array(8)].map((_, i) => (
                            <div 
                                key={i} 
                                className="absolute w-1.5 h-1.5 bg-white/10 rounded-full dust-mote"
                                style={{
                                    left: `${10 + i * 12}%`,
                                    bottom: `${15 + Math.random() * 55}%`,
                                    animationDelay: `${i * 0.9}s`,
                                    animationDuration: `${7 + Math.random() * 5}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Header: Cozy Cafe neon sign */}
                    <div className="text-center w-full mt-6 relative z-30">
                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 border border-rose-900/40 px-3 py-1 rounded-full font-mono tracking-widest uppercase shadow-sm neon-glow-sign">
                            ☕ COZY LOFI CAFE ☕
                        </span>
                        <h1 className="text-xl font-bold text-white mt-3.5 font-mono tracking-wide">
                            {card.title}
                        </h1>
                    </div>

                    {/* INTERACTIVE TURNTABLE / DESK AREA */}
                    <div className="relative my-auto flex flex-col items-center justify-center scale-[0.93] md:scale-100">
                        
                        {/* Wooden shelf above window holding clock & calendar */}
                        <div className="absolute top-[-129px] md:top-[-179px] w-[320px] md:w-[390px] h-2 bg-amber-900/90 border-b border-amber-950 rounded shadow-md -z-10 flex justify-between items-end px-3">
                            {/* Retro Digital Clock */}
                            <div className="bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded text-[7px] font-mono text-emerald-400 font-bold tracking-widest shadow-inner scale-[0.8] origin-bottom-left flex items-center gap-1 mb-0.5">
                                <span>⏱️</span>
                                <span>{timeString}</span>
                            </div>
                            {/* Retro Calendar Card */}
                            <div className="w-7 h-7 bg-neutral-100 rounded-sm border border-neutral-300 shadow flex flex-col items-center justify-center scale-[0.75] origin-bottom-right rotate-[-4deg] transform translate-y-[-2px] mb-0.5">
                                <div className="w-full bg-rose-500 text-[4px] text-white font-mono font-bold text-center py-0.5 rounded-t-xs leading-none">
                                    {calendarDate.month}
                                </div>
                                <div className="text-[10px] font-bold text-neutral-800 font-sans tracking-tighter leading-none mt-0.5">
                                    {calendarDate.dayNum}
                                </div>
                            </div>
                        </div>

                        {/* Cozy Window Frame Backdrop behind player (Tirai Lebih Besar Menampilkan Foto Slideshow) */}
                        <div 
                            onClick={() => {
                                playSynthesizedSound('click', false);
                                setBlindsClosed(!blindsClosed);
                            }}
                            className="absolute top-[-120px] md:top-[-170px] w-[320px] md:w-[390px] h-[180px] md:h-[250px] border-4 border-neutral-800 bg-neutral-950/70 rounded-t-xl overflow-hidden -z-10 flex cursor-pointer group relative"
                            style={{ 
                                boxShadow: `inset 0 0 20px rgba(0,0,0,0.9), 0 4px 10px rgba(0,0,0,0.5)`, 
                                borderColor: '#171717' 
                            }}
                            title="Tarik Tirai Jendela (Ketuk untuk melihat foto)"
                        >
                            {/* 1. Photos Slideshow in Background */}
                            {card.photos && card.photos.length > 0 ? (
                                <div className="absolute inset-0 z-0">
                                    <img 
                                        key={currentPhotoIdx}
                                        src={card.photos[currentPhotoIdx]} 
                                        alt="Window memory" 
                                        className="w-full h-full object-cover animate-in fade-in duration-1000"
                                        style={{ filter: theme === 'midnight' ? 'brightness(0.65) contrast(1.05)' : 'brightness(0.85)' }}
                                    />
                                </div>
                            ) : (
                                /* Fallback window view reflection */
                                <div className="absolute inset-0 bg-neutral-950 z-0" />
                            )}

                            {/* Glass reflections and sliding droplets overlay */}
                            <div className="absolute inset-0 z-10 pointer-events-none flex">
                                <div className="flex-1 border-r border-neutral-800/60 relative" style={{ backgroundColor: themeStyles.windowReflect }}>
                                    <div className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-white/20 blur-[0.5px]" />
                                    <div className="absolute top-4 left-6 w-0.5 h-2 bg-white/30 rounded-full animate-pulse" />
                                    <div className="absolute top-10 left-10 w-[1px] h-3 bg-white/20 rounded-full animate-bounce" />
                                </div>
                                <div className="flex-1 relative" style={{ backgroundColor: themeStyles.windowReflect }}>
                                    <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-white/10 blur-[0.5px]" />
                                    <div className="absolute top-8 right-8 w-0.5 h-2 bg-white/20 rounded-full animate-pulse" />
                                    <div className="absolute top-2 right-12 w-[1px] h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>

                            {/* Blinds overlay (Covers the photos and reflections when down) */}
                            <div 
                                className="absolute inset-x-0 top-0 bg-amber-955/95 flex flex-col justify-between border-b-2 border-amber-900 transition-all duration-700 z-20 shadow-md"
                                style={{ height: blindsClosed ? '100%' : '12px' }}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-full h-[1px] bg-amber-900/60" />
                                ))}
                            </div>
                            
                            {/* Blinds rope string */}
                            <div className="absolute right-3 top-0 bottom-0 w-1 flex flex-col items-center z-30">
                                <div className="w-[1px] bg-neutral-400 flex-1" />
                                <div className="w-2 h-2.5 bg-amber-700 rounded shadow-md group-hover:scale-110 transition-transform" />
                            </div>

                            {/* Instruction label overlay */}
                            <div className="absolute bottom-2 inset-x-0 text-center z-25 opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <span className="text-[6px] text-white/90 bg-neutral-900/80 border border-white/10 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
                                    {blindsClosed ? "💡 KETUK JENDELA UNTUK MELIHAT FOTO" : "💡 KETUK UNTUK MENUTUP TIRAI"}
                                </span>
                            </div>
                        </div>

                        {/* Left Side Desk Items Stack (Sleeping Cat & Polaroid Camera) */}
                        <div className={`absolute left-[-42px] md:-left-24 bottom-1 top-auto flex flex-col justify-end items-center gap-3 transition-opacity duration-1000 ${candleBlowStage === 'unlit' || candleBlowStage === 'lighting' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            
                            {/* Polaroid Camera */}
                            <div 
                                onClick={() => {
                                    if (printingPolaroid) return;
                                    playSynthesizedSound('shutter', false);
                                    setPrintingPolaroid(true);
                                    
                                    const flashOverlay = document.getElementById('camera-flash-overlay');
                                    if (flashOverlay) {
                                        flashOverlay.classList.remove('camera-flash-active');
                                        void flashOverlay.offsetWidth;
                                        flashOverlay.classList.add('camera-flash-active');
                                    }

                                    setTimeout(() => {
                                        const totalPhotos = card.photos && card.photos.length > 0 ? card.photos.length : 0;
                                        const photoUrl = totalPhotos > 0 
                                            ? card.photos[snapCount % totalPhotos] 
                                            : '/stillwithyou/images/lofi_love.jpg';
                                        
                                        const randomQuote = quotesPool[Math.floor(Math.random() * quotesPool.length)];

                                        setPrintedPolaroids(prev => [
                                            {
                                                id: Math.random(),
                                                photoUrl: photoUrl,
                                                quote: randomQuote,
                                                label: `MEM_0${totalPhotos > 0 ? (snapCount % totalPhotos) + 1 : 1}`,
                                                date: calendarDate
                                            },
                                            ...prev.slice(0, 2)
                                        ]);
                                        setSnapCount(prev => prev + 1);
                                        setPrintingPolaroid(false);
                                    }, 800);
                                }}
                                className="cursor-pointer flex flex-col items-center group z-35 relative scale-90 md:scale-100"
                                title="Ambil Foto Polaroid Baru"
                            >
                                <div className="w-10 h-7 bg-neutral-800 border border-neutral-700 rounded flex flex-col justify-between p-0.5 shadow-md relative group-hover:scale-105 transition-transform">
                                    <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-300 rounded-t-xs" />
                                    <div className="absolute top-0.5 right-1 w-1.5 h-1 bg-neutral-950 border border-neutral-600 rounded-xs" />
                                    <div className="w-4 h-4 bg-neutral-950 border border-neutral-700 rounded-full mx-auto mt-1 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500/80 rounded-full animate-pulse" />
                                    </div>
                                    <div className="absolute top-[-2px] right-2 w-1.5 h-1 bg-rose-500 rounded-t-xs" />
                                </div>
                                <span className="text-[6px] text-white/20 tracking-wider font-mono mt-1 group-hover:text-white/40">CAMERA</span>
                                {/* Instruction Tooltip */}
                                <div className="absolute left-10 md:left-12 top-1 bg-neutral-900/90 border border-white/10 rounded px-1.5 py-0.5 text-[5px] text-neutral-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-40">
                                    📸 KETUK UNTUK MENJEPRET FOTO
                                </div>
                            </div>

                            {/* Interactive Sleeping Cat (Shifted to Left Side Stack) */}
                            <div 
                                onClick={() => {
                                    playSynthesizedSound('meow', false);
                                    setCatMood('wake');
                                    
                                    const newEmojis = [...Array(3)].map((_, i) => ({
                                        id: Math.random(),
                                        char: ['🐾', '💖', '✨', '🐾'][Math.floor(Math.random() * 4)],
                                        x: (Math.random() * 40 - 20)
                                    }));
                                    setCatEmojiBursts(prev => [...prev, ...newEmojis]);
                                    
                                    setTimeout(() => {
                                        setCatMood('purr');
                                        playSynthesizedSound('purr', false);
                                        
                                        setTimeout(() => {
                                            setCatMood('sleep');
                                        }, 2000);
                                    }, 800);
                                }}
                                className="relative cursor-pointer transform scale-[0.68] origin-bottom z-30 group transition-all duration-300 active:scale-95"
                                title="Elus Kucing Cozy"
                            >
                                {/* Floating Emojis */}
                                <div className="absolute inset-x-0 bottom-12 h-16 pointer-events-none overflow-visible">
                                    {catEmojiBursts.map(e => (
                                        <span 
                                            key={e.id}
                                            className="absolute emoji-floater text-xs"
                                            style={{ 
                                                left: '40%', 
                                                '--emoji-x': `${e.x}px` 
                                            }}
                                        >
                                            {e.char}
                                        </span>
                                    ))}
                                </div>

                                <div className="relative w-20 h-12">
                                    <div className={`absolute bottom-0 right-0 w-15 h-9 bg-neutral-800 rounded-full shadow-md transition-all duration-500 ${
                                        catMood === 'purr' 
                                            ? 'animate-[catPurrBreathe_1.5s_ease-in-out_infinite] bg-neutral-750' 
                                            : 'animate-[catBreathe_3.2s_ease-in-out_infinite]'
                                    }`} />
                                    <div className="absolute bottom-4 right-8 w-7.5 h-7.5 bg-neutral-800 rounded-full border-b border-black/10">
                                        <div className="absolute -top-1 left-0.5 w-2 h-2.5 bg-neutral-800 rounded-tl-full rotate-[-12deg] origin-bottom animate-[wiggleEar_2.5s_ease-in-out_infinite]" />
                                        <div className="absolute -top-1 right-2 w-2 h-2.5 bg-neutral-800 rounded-tr-full rotate-[12deg] origin-bottom animate-[wiggleEar_2.5s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }} />
                                        {catMood === 'sleep' ? (
                                            <>
                                                <div className="absolute top-3.5 left-1.5 w-1.5 h-0.5 bg-neutral-950/60 rounded-full" />
                                                <div className="absolute top-3.5 right-2.5 w-1.5 h-0.5 bg-neutral-950/60 rounded-full" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="absolute top-3 left-1.5 w-2 h-1 bg-rose-400 rounded-full shadow-sm animate-pulse" />
                                                <div className="absolute top-3 right-2 w-2 h-1 bg-rose-400 rounded-full shadow-sm animate-pulse" />
                                            </>
                                        )}
                                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-0.5 bg-neutral-950 rounded-full" />
                                    </div>
                                    <div className={`absolute bottom-1 right-[-4px] w-7 h-3 bg-neutral-800 rounded-full origin-left ${
                                        catMood === 'wake' 
                                            ? 'animate-[swingTailFast_0.8s_ease-in-out_infinite]' 
                                            : 'animate-[swingTail_2.2s_ease-in-out_infinite]'
                                    }`} />
                                </div>
                            </div>
                        </div>

                        {/* Printed Polaroid Cards container */}
                        {printedPolaroids.length > 0 && (
                            <div className={`absolute left-[-45px] md:left-[-160px] top-2 flex flex-col gap-2 z-40 pointer-events-auto scale-90 md:scale-100 transition-opacity duration-1000 ${candleBlowStage === 'unlit' || candleBlowStage === 'lighting' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                                {printedPolaroids.map((item, idx) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => {
                                            playSynthesizedSound('click', false);
                                            setActivePhoto(item.photoUrl); 
                                            setLightboxFlipped(false);
                                        }}
                                        className="w-16 h-18 bg-[#fcfbf9] p-1 border border-neutral-300 shadow-lg rounded print-polaroid-effect cursor-pointer transform hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-between"
                                        style={{ 
                                            animationDelay: `${idx * 0.1}s`,
                                            zIndex: 10 - idx
                                        }}
                                    >
                                        <img 
                                            src={item.photoUrl} 
                                            alt="Printed memory" 
                                            className="w-full h-8 object-cover rounded-xs border border-neutral-200" 
                                        />
                                        <div className="text-[5px] text-neutral-850 font-mono leading-none tracking-tight text-center px-0.5 line-clamp-2 mt-0.5">
                                            "{item.quote}"
                                        </div>
                                        <div className="text-[3px] text-neutral-500 font-mono text-right scale-[0.8] origin-bottom-right leading-none">
                                            {item.date.dayNum} {item.date.month}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Turntable Base Body */}
                        <div className={`relative p-5 bg-neutral-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center ${themeStyles.neonGlow} transition-all duration-1000 ${candleBlowStage === 'unlit' || candleBlowStage === 'lighting' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ width: '250px', height: '250px' }}>
                            
                            {/* Glowing LED Status Indicator */}
                            <div 
                                className={`absolute top-[10px] right-[52px] w-1.5 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px] z-20 ${
                                    isPlaying 
                                        ? 'bg-emerald-400 shadow-emerald-400/80' 
                                        : 'bg-rose-500 shadow-rose-500/80 animate-pulse'
                                }`}
                            />

                            {/* Floating Notes overlay wrapper */}
                            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-[2.5rem]">
                                {floatingNotes.map(n => (
                                    <span 
                                        key={n.id}
                                        className="absolute floating-note text-lg opacity-0"
                                        style={{ 
                                            left: `${n.x}%`, 
                                            bottom: '95px', 
                                            transform: `scale(${n.scale})`,
                                            '--rot': `${n.rotate}deg`
                                        }}
                                    >
                                        {n.symbol}
                                    </span>
                                ))}
                            </div>

                            {/* Platter (Empty when vinyl not mounted) */}
                            <div 
                                onMouseDown={handleSwipeStart}
                                onMouseMove={handleSwipeMove}
                                onMouseUp={handleSwipeEnd}
                                onMouseLeave={handleSwipeEnd}
                                onTouchStart={handleSwipeStart}
                                onTouchMove={handleSwipeMove}
                                onTouchEnd={handleSwipeEnd}
                                className={`relative rounded-full aspect-square border-2 border-neutral-850 bg-neutral-950 flex items-center justify-center shadow-inner transition-colors ${
                                    !vinylMounted && candleBlowStage === 'lit' 
                                        ? 'cursor-grab active:cursor-grabbing hover:bg-neutral-900' 
                                        : ''
                                }`} 
                                style={{ width: '210px' }}
                                title={!vinylMounted && candleBlowStage === 'lit' ? 'Geser/putar piringan dengan mouse/jari untuk menyalakan radio' : ''}
                            >
                                
                                {/* Metal details inside the platter */}
                                <div className="absolute inset-8 rounded-full border border-neutral-900 pointer-events-none" />
                                <div className="absolute inset-20 rounded-full border border-neutral-900 pointer-events-none" />
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600 border border-neutral-800 shadow" />
                                
                                {/* Mount Vinyl Record */}
                                {vinylMounted && (
                                    <div 
                                        onClick={handleTogglePlay}
                                        className={`absolute inset-0 rounded-full border-4 border-neutral-955 bg-neutral-955 flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl ${
                                            isPlaying 
                                                ? (rpm === 45 ? 'animate-[spin_7.5s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]') 
                                                : ''
                                        } ${mountingProgress ? 'vinyl-mount-animate' : ''}`}
                                        style={{ 
                                            backgroundImage: 'radial-gradient(circle, #333 8%, #111 9%, #111 20%, #222 21%, #222 35%, #111 36%, #111 50%, #2c2c2c 51%, #111 52%, #111 72%, #333 73%, #111 74%)' 
                                        }}
                                    >
                                        <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                                        <div className="absolute inset-10 rounded-full border border-white/5 pointer-events-none" />
                                        <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />
                                        
                                        {/* Label Center */}
                                        <div className="w-14 h-14 rounded-full bg-rose-600 border border-neutral-900 shadow-inner flex items-center justify-center relative z-10">
                                            <span className="text-xl" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}>❤️</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Controls Panel bottom-side: Volume knob, VU Meter, RPM speed switch */}
                            <div className="absolute bottom-3 inset-x-5 flex justify-between items-center z-20">
                                
                                {/* Volume Knob */}
                                <div 
                                    onClick={() => {
                                        playSynthesizedSound('click', false);
                                        setVolume(prev => prev >= 0.8 ? 0.2 : prev + 0.3); // cycle volume 0.2 -> 0.5 -> 0.8
                                    }}
                                    className="cursor-pointer flex flex-col items-center"
                                    title="Sesuaikan Volume"
                                >
                                    <div 
                                        className="w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 shadow-inner relative flex items-center justify-center transition-transform duration-300"
                                        style={{ transform: `rotate(${(volume * 270) - 135}deg)` }}
                                    >
                                        <div className="absolute top-0.5 w-[1.5px] h-1.5 bg-rose-500 rounded-full" />
                                    </div>
                                    <span className="text-[5px] text-white/40 font-mono scale-[0.8] mt-0.5">VOL</span>
                                </div>

                                {/* Dual Needle VU Meter */}
                                <div className="w-24 h-6 bg-neutral-950 border border-white/5 rounded px-1.5 flex justify-between items-center overflow-hidden shadow-inner">
                                    {/* Left VU */}
                                    <div className="relative w-8 h-4 border-b border-white/5 overflow-hidden flex justify-center">
                                        <div className="absolute top-1 left-0 right-0 h-0.5 bg-rose-900/35 border-t border-rose-500/25" />
                                        <div className="absolute w-[1.2px] h-4 bg-amber-400 origin-bottom"
                                            style={{ 
                                                bottom: '-2px', 
                                                left: '50%',
                                                transform: `rotate(${leftVuRotate}deg)`,
                                                transition: isPlaying ? 'none' : 'transform 0.4s ease'
                                            }}
                                        />
                                        <span className="absolute bottom-0.5 left-0.5 text-[5px] text-white/30 font-mono scale-[0.8] origin-bottom-left">L</span>
                                    </div>
                                    
                                    {/* Right VU */}
                                    <div className="relative w-8 h-4 border-b border-white/5 overflow-hidden flex justify-center">
                                        <div className="absolute top-1 left-0 right-0 h-0.5 bg-rose-900/35 border-t border-rose-500/25" />
                                        <div className="absolute w-[1.2px] h-4 bg-amber-400 origin-bottom"
                                            style={{ 
                                                bottom: '-2px', 
                                                left: '50%', 
                                                transform: `rotate(${rightVuRotate}deg)`,
                                                transition: isPlaying ? 'none' : 'transform 0.4s ease'
                                            }}
                                        />
                                        <span className="absolute bottom-0.5 right-0.5 text-[5px] text-white/30 font-mono scale-[0.8] origin-bottom-right">R</span>
                                    </div>
                                </div>

                                {/* RPM switch */}
                                <div 
                                    onClick={() => {
                                        playSynthesizedSound('click', false);
                                        setRpm(prev => prev === 33 ? 45 : 33);
                                    }}
                                    className="cursor-pointer flex flex-col items-center bg-transparent border-0 outline-none p-0"
                                    title="Pilih RPM Kecepatan"
                                >
                                    <div className="w-5 h-5 bg-neutral-950 border border-neutral-700 rounded shadow-inner flex items-center justify-center text-[7px] font-mono font-bold text-white/80 active:scale-95 transition-all">
                                        {rpm}
                                    </div>
                                    <span className="text-[5px] text-white/40 font-mono scale-[0.8] mt-0.5">RPM</span>
                                </div>
                            </div>

                            {/* Interactive Tonearm Needle */}
                            <div 
                                onClick={handleTogglePlay}
                                className={`absolute cursor-pointer ${vinylMounted ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}
                                style={{ 
                                    top: '12px', 
                                    right: '12px', 
                                    zIndex: 20,
                                    transform: isPlaying ? 'rotate(23deg)' : 'rotate(0deg)', 
                                    transformOrigin: '40px 10px', 
                                    transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' 
                                }}
                            >
                                <svg width="50" height="90" viewBox="0 0 50 90" fill="none">
                                    <circle cx="40" cy="10" r="8" fill="#525252" stroke="#374151" strokeWidth="1.5" />
                                    <circle cx="40" cy="10" r="3" fill="#1f2937" />
                                    <path d="M40 10 L30 50 L14 78" stroke="#d4d4d4" strokeWidth="3.5" strokeLinecap="round" />
                                    <path d="M40 10 L30 50 L14 78" stroke="#a3a3a3" strokeWidth="1.2" strokeLinecap="round" />
                                    <rect x="7" y="76" width="10" height="12" rx="1.5" transform="rotate(-15 7 76)" fill="#262626" stroke="#525252" strokeWidth="1" />
                                    <circle cx="10" cy="82" r="1.5" fill="#f43f5e" />
                                </svg>
                            </div>
                        </div>

                        {/* Interactive Candle Centerpiece (Right side centerpiece) */}
                        <div 
                            onClick={() => {
                                if (candleBlowStage !== 'unlit') return;
                                setCandleBlowStage('lighting');
                                playSynthesizedSound('lift', false);
                                
                                setTimeout(() => {
                                    setCandleBlowStage('lit');
                                    playSynthesizedSound('burst', false);
                                }, 1000);
                            }}
                            className="absolute right-[-45px] md:-right-26 bottom-1 cursor-pointer group flex flex-col items-center justify-center p-8 z-40"
                            style={{
                                pointerEvents: candleBlowStage === 'unlit' ? 'auto' : 'none'
                            }}
                        >
                            {/* Candle Flame */}
                            {candleBlowStage === 'lighting' && (
                                <div className="relative w-8 h-12 mb-1.5 transition-all duration-700 animate-pulse">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-11 rounded-full flame-blowing" />
                                </div>
                            )}
                            {candleBlowStage === 'lit' && (
                                <div className="relative w-8 h-12 mb-1.5 animate-in zoom-in-50 duration-500">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-9 rounded-full flame-intro" />
                                </div>
                            )}

                            {/* Candle Body */}
                            <div className="w-5 h-20 bg-amber-100/90 rounded-t-md shadow-lg border-b-4 border-amber-200/50 flex flex-col justify-start items-center relative">
                                {candleBlowStage !== 'unlit' && <div className="w-0.5 h-3 bg-neutral-900 absolute -top-3" />}
                                <div className="absolute top-2 left-1 w-1.5 h-5 bg-amber-200/60 rounded-full" />
                                <div className="absolute top-4 right-1 w-1 h-3 bg-amber-200/60 rounded-full" />
                            </div>
                            
                            {/* Candle Stand */}
                            <div className="w-12 h-2 bg-neutral-700 rounded-full shadow border-b border-neutral-850" />
                        </div>
                        
                        {/* Playback instruction hint */}
                        {vinylMounted && (
                            <p className="mt-4 text-[9px] text-white/35 font-mono uppercase tracking-wider text-center animate-in fade-in">
                                {isPlaying ? '💿 Piringan Hitam Berputar...' : '💿 Sentuh Piringan/Jarum untuk Memutar'}
                            </p>
                        )}
                    </div>

                    {/* BOTTOM PANEL: MESSAGE BOARD & MUSIC CONTROL */}
                    <div className={`w-full max-w-sm flex flex-col space-y-4 transition-opacity duration-1000 ${candleBlowStage === 'unlit' || candleBlowStage === 'lighting' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        
                        {/* Typewriter message sheet */}
                        <div className={`p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-700 flex flex-col space-y-3 text-left ${themeStyles.cardBg} ${vinylMounted ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-2 pointer-events-none'}`}>
                            
                            <div className="text-[10px] font-bold tracking-widest text-neutral-400 font-mono flex items-center justify-between border-b border-white/5 pb-2">
                                <span>✦ DARI: {card.sender_name}</span>
                                <span className={themeStyles.textColor}>● LOFI STATION</span>
                            </div>

                            {/* Message content */}
                            <div className="text-xs font-mono leading-relaxed text-white/90 min-h-[65px] max-h-[105px] overflow-y-auto pr-1">
                                {vinylMounted ? (
                                    <>
                                        {displayText}
                                        {!typingDone && <span className="animate-pulse font-bold text-rose-400">_</span>}
                                    </>
                                ) : (
                                    <span className="text-white/30 italic font-mono text-[9px] leading-relaxed block">👋 Geser/putar piringan hitam di atas dengan mouse/jari untuk menyalakan radio & membaca pesan...</span>
                                )}
                            </div>

                            {/* Photos slide layout - Polaroid list */}
                            {card.photos && card.photos.length > 0 && vinylMounted && (
                                <div className="flex gap-3.5 overflow-x-auto pt-2 border-t border-white/5 pr-1 scrollbar-thin">
                                    {card.photos.map((url, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => {
                                                setActivePhoto(url);
                                                setLightboxFlipped(false);
                                            }}
                                            className="w-12 h-14 bg-[#fcfbf9] p-0.5 border border-amber-800/10 shadow-md rounded flex-shrink-0 cursor-pointer transform hover:scale-105 transition-all duration-300"
                                            style={{ transform: `rotate(${(idx % 2 === 0 ? -3.5 : 3.5)}deg)` }}
                                        >
                                            <img src={url} alt="" className="w-full h-9 object-cover rounded-xs" />
                                            <div className="text-[5px] text-center text-neutral-500 font-mono mt-1 font-bold">MEM_0{idx+1}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CONTROLS: Light Themes & Quick toggle */}
                        <div className="flex items-center justify-between bg-neutral-900/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl gap-3">
                            <span className="text-[10px] font-bold text-neutral-400 font-mono tracking-wider uppercase ml-1">
                                Suasana:
                            </span>
                            
                            <div className="flex items-center gap-1.5 ml-auto">
                                {[
                                    { key: 'sunset', label: '🌇 Sunset' },
                                    { key: 'midnight', label: '🌧️ Midnight' },
                                    { key: 'cozy', label: '☕ Cozy' }
                                ].map(opt => {
                                    const active = theme === opt.key;
                                    return (
                                        <button
                                            key={opt.key}
                                            onClick={() => setTheme(opt.key)}
                                            type="button"
                                            className={`px-3 py-1.5 border rounded-xl text-[10px] font-bold font-mono transition-all duration-500 ${
                                                active ? themeStyles.buttonActive : themeStyles.buttonInactive
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* LIGHTBOX FOR POLAROID WITH 3D FLIP CAPABILITY */}
            {activePhoto && (
                <div 
                    onClick={() => setActivePhoto(null)} 
                    className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300"
                    style={{ perspective: '1200px' }}
                >
                    {/* Double-sided Flip Card Container */}
                    <div 
                        onClick={e => e.stopPropagation()} 
                        className="relative max-w-xs w-full aspect-[4/5] cursor-pointer"
                        style={{
                            transform: lightboxFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        {/* FRONT SIDE (POLAROID PHOTO) */}
                        <div className="absolute inset-0 bg-[#fcfbf9] border border-amber-800/10 p-4 pb-6 rounded-lg shadow-2xl flex flex-col items-center backface-hidden"
                            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                            <div className="relative w-full aspect-square bg-[#0f172a] rounded overflow-hidden border border-slate-200/25">
                                <img src={activePhoto} alt="Lofi moment" className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="pt-4 text-center w-full font-serif text-amber-950 flex-1 flex flex-col justify-center">
                                <div className="text-xl font-bold" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                    Kenangan Terindah
                                </div>
                                <div className="text-[8px] font-mono mt-1 text-amber-800/50 uppercase tracking-widest font-bold">
                                    🔄 KETUK UNTUK MEMBALIK
                                </div>
                            </div>
                        </div>

                        {/* BACK SIDE (LOVE LETTER / MESSAGES) */}
                        <div className="absolute inset-0 bg-[#f7f4ea] border border-amber-800/10 p-5 rounded-lg shadow-2xl flex flex-col justify-between text-left backface-hidden"
                            style={{ 
                                backfaceVisibility: 'hidden', 
                                WebkitBackfaceVisibility: 'hidden', 
                                transform: 'rotateY(180deg)',
                                backgroundImage: 'radial-gradient(circle, rgba(239,234,220,0.4) 0%, rgba(222,215,198,0.3) 100%)'
                            }}>
                            
                            {/* Vintage stationary decor */}
                            <div className="border-b border-amber-800/10 pb-2.5 flex justify-between items-center text-[9px] font-mono text-amber-800/60 uppercase font-bold tracking-wider">
                                <span>💌 Cozy Love Letter</span>
                                <span>No. 01</span>
                            </div>

                            {/* Full typed message */}
                            <div className="flex-1 font-mono text-[11px] leading-relaxed text-amber-950/90 py-5 overflow-y-auto" style={{ fontFamily: 'monospace' }}>
                                {mainMessage}
                            </div>

                            {/* Sign off details */}
                            <div className="border-t border-amber-800/10 pt-3 text-right">
                                <div className="text-[10px] font-bold text-amber-950/80 font-mono">— Dari: {card.sender_name}</div>
                                <div className="text-[8px] text-amber-800/40 font-mono mt-0.5">🔄 KETUK UNTUK KEMBALI</div>
                            </div>
                        </div>
                    </div>

                    {/* Instruction helper */}
                    <div className="mt-6 flex gap-4 text-xs font-bold font-mono tracking-widest text-neutral-400 uppercase pointer-events-none">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxFlipped(!lightboxFlipped); }} className="px-4 py-2 border border-neutral-700/65 rounded-xl pointer-events-auto bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 transition-all">
                            🔄 Balik Kartu
                        </button>
                        <button type="button" onClick={() => setActivePhoto(null)} className="px-4 py-2 border border-neutral-700/65 rounded-xl pointer-events-auto bg-neutral-900 text-neutral-300 hover:bg-neutral-800 active:scale-95 transition-all">
                            Tutup [X]
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   STILL WITH YOU — Full Premium Fireworks & Float Wishes Render
   ───────────────────────────────────────────────────────── */
function StillWithYouFull({ card }) {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    
    // Gate state: 'closed' | 'prologue' | 'countdown' | 'opened'
    const [gateState, setGateState] = useState('closed');
    const [prologueIdx, setPrologueIdx] = useState(0);
    const [countdownVal, setCountdownVal] = useState(3);
    const [countdownGreet, setCountdownGreet] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    
    // Wishes Float State
    const [floatingItems, setFloatingItems] = useState([]);

    const prologueTexts = [
        "Di setiap detik waktu yang berputar...",
        "Ada kisah indah yang senantiasa menetap...",
        "Mari mulai hitung mundur... ❤️"
    ];
    
    const typeGreetingText = {
        anniversary: `Happy Anniversary\n${card.recipient_name} my love 💗`,
        birthday:    `Happy Birthday\n${card.recipient_name} 🎂`,
        graduation:  `Selamat Wisuda\n${card.recipient_name} 🎓`,
        wedding:     `Selamat Menikah\n${card.recipient_name} 💍`,
    };

    const typeTitleText = {
        anniversary: "Happy Anniversary",
        birthday:    "Happy Birthday",
        graduation:  "Selamat Wisuda",
        wedding:     "Selamat Menikah",
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

        // Drag and click rocket launcher
        let isPointerDown = false;
        let lastLaunch = 0;

        const handlePointerDown = (e) => {
            if (e.target.closest('button') || e.target.closest('.spty-float-item')) return;
            isPointerDown = true;
            launchRocket(e.clientX, e.clientY);
        };

        const handlePointerMove = (e) => {
            if (!isPointerDown) return;
            const now = Date.now();
            if (now - lastLaunch < 250) return; // limit to 4 launches per second during drag
            lastLaunch = now;
            if (e.target.closest('button') || e.target.closest('.spty-float-item')) return;
            launchRocket(e.clientX, e.clientY);
        };

        const handlePointerUp = () => {
            isPointerDown = false;
        };

        window.addEventListener('pointerdown', handlePointerDown);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

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
            window.removeEventListener('pointerdown', handlePointerDown);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [gateState, isMuted]);

    // Floating Wishes & Images Engine
    useEffect(() => {
        if (gateState !== 'opened') return;
        const messages = (card.messages || []).filter(Boolean);
        const photos = (card.photos || []).filter(Boolean);

        const spawnItem = () => {
            const isPhoto = photos.length > 0 && Math.random() < 0.48;
            // Keep text items more centered so they don't get cut off on the screen edges
            const left = isPhoto ? (15 + Math.random() * 70) : (22 + Math.random() * 56);
            const duration = 8 + Math.random() * 5;
            const id = Math.random().toString();
            const rotX = (Math.random() - 0.5) * 20;
            const rotY = (Math.random() - 0.5) * 20;
            const rotZ = (Math.random() - 0.5) * 15;

            let content = '';
            let shape = '';
            let size = null;

            if (isPhoto) {
                content = photos[Math.floor(Math.random() * photos.length)];
                shape = Math.random() < 0.5 ? 'shape-circle' : 'shape-heart';
                size = Math.floor(65 + Math.random() * 95); // random size from 65px to 160px
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
                shape,
                size
            };

            setFloatingItems(prev => [...prev, newItem]);

            // Auto clean
            setTimeout(() => {
                setFloatingItems(prev => prev.filter(x => x.id !== id));
            }, duration * 1000 + 500);
        };

        // Initial spawn
        spawnItem();
        spawnItem();
        spawnItem();
        setTimeout(spawnItem, 800);
        setTimeout(spawnItem, 1600);

        const engine = setInterval(spawnItem, 2500);
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

        if (audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        }

        setGateState('prologue');
        setPrologueIdx(0);
    };

    // Effect to cycle prologue texts and run the countdown
    useEffect(() => {
        if (gateState !== 'prologue') return;
        
        const timer = setInterval(() => {
            setPrologueIdx(prev => {
                if (prev < prologueTexts.length - 1) {
                    return prev + 1;
                } else {
                    clearInterval(timer);
                    // Start countdown sequence
                    setGateState('countdown');
                    setCountdownVal(3);
                    let val = 3;
                    const cTimer = setInterval(() => {
                        val--;
                        if (val > 0) {
                            setCountdownVal(val);
                        } else if (val === 0) {
                            setCountdownGreet(true);
                            // Keep greeting text for 1.5s before opening fully and burst fireworks
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
                            }, 1500);
                        } else {
                            clearInterval(cTimer);
                        }
                    }, 1000);
                    return prev;
                }
            });
        }, 2000);
        
        return () => clearInterval(timer);
    }, [gateState]);

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
        <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#09090b', fontFamily: "'Outfit', sans-serif", touchAction: 'none' }}>
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
                    <div key={item.id} className="absolute spty-float-item" style={{
                        left: `${item.left}%`,
                        bottom: '-120px',
                        animation: `floatUp ${item.duration}s linear forwards`,
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, opacity',
                    }}>
                        {item.type === 'text' ? (
                            <div className="spty-float-rotator" style={{
                                transform: `rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`,
                                transformStyle: 'preserve-3d',
                            }}>
                                <div className="spty-float-scaler text-center" style={{
                                    fontFamily: "'Dancing Script', cursive",
                                    fontSize: 'clamp(1.1rem, 4vw, 1.8rem)',
                                    color: '#ffb8d2',
                                    padding: '0.6rem 1.2rem',
                                    background: 'rgba(15, 10, 15, 0.55)',
                                    backdropFilter: 'blur(8px)',
                                    WebkitBackdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255, 101, 163, 0.35)',
                                    borderRadius: '20px',
                                    boxShadow: '0 0 15px rgba(255, 101, 163, 0.2), inset 0 0 10px rgba(255, 101, 163, 0.1)',
                                    textShadow: '0 0 8px rgba(255, 101, 163, 0.6)',
                                    width: item.content.length > 40 ? '280px' : item.content.length > 20 ? '200px' : 'max-content',
                                    minWidth: item.content.length > 20 ? '200px' : '120px',
                                    maxWidth: '280px',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word',
                                    lineHeight: '1.5',
                                }}>
                                    {item.content}
                                </div>
                            </div>
                        ) : (
                            <div className="spty-float-rotator" style={{
                                transform: `rotateX(${item.rotX}deg) rotateY(${item.rotY}deg) rotateZ(${item.rotZ}deg)`,
                                transformStyle: 'preserve-3d',
                            }}>
                                <div className="spty-float-scaler">
                                    <img src={item.content} className={`block ${item.shape === 'shape-circle' ? 'rounded-full' : 'shape-heart'}`} style={{
                                        width: `${item.size}px`,
                                        height: `${item.size}px`,
                                        objectFit: 'cover',
                                        border: '2px solid rgba(255, 101, 163, 0.5)',
                                        boxShadow: '0 0 20px rgba(255, 101, 163, 0.4)',
                                        animation: 'pulseGlow 2s ease-in-out infinite alternate',
                                    }} alt="" />
                                </div>
                            </div>
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

            {/* Prologue Overlay Screen */}
            {gateState === 'prologue' && (
                <div className="fixed inset-0 z-45 flex items-center justify-center bg-[#050508]/95 transition-opacity duration-700">
                    <div key={prologueIdx} style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 15px rgba(255, 101, 163, 0.7)' }} className="text-[#ff65a3] text-3xl sm:text-4xl text-center px-6 leading-relaxed max-w-lg animate-fadeInOut">
                        {prologueTexts[prologueIdx]}
                    </div>
                </div>
            )}

            {/* Countdown Overlay Screen */}
            {gateState === 'countdown' && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#050508]/90 transition-opacity duration-500">
                    {!countdownGreet ? (
                        <div key={countdownVal} style={{ fontFamily: "'Fredoka', sans-serif" }} className="text-[#ff65a3] font-bold drop-shadow-[0_0_30px_rgba(255,101,163,0.8)] animate-countdownScale text-9xl">
                            {countdownVal}
                        </div>
                    ) : (
                        <div style={{ fontFamily: "'Dancing Script', cursive", textShadow: '0 0 20px rgba(255, 101, 163, 0.9)' }} className="text-center text-[#ff65a3] font-bold leading-normal animate-countdownScale text-[clamp(1.8rem,6.5vw,3.5rem)] max-w-lg px-6 whitespace-pre-line">
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
                        }} className="text-[clamp(2.2rem,7.5vw,4.5rem)] font-bold text-white leading-tight mb-4 whitespace-pre-line">
                            {(!card.title || card.title === "Kartu Ucapan") ? (typeTitleText[card.type] || "Kartu Ucapan") : card.title}
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
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(15px) scale(0.96); filter: blur(5px); }
                    12%, 88% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                    100% { opacity: 0; transform: translateY(-15px) scale(1.04); filter: blur(5px); }
                }
                .animate-fadeInOut {
                    animation: fadeInOut 2.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .spty-float-item {
                    pointer-events: auto;
                    cursor: pointer;
                }
                .spty-float-item:hover {
                    animation-play-state: paused !important;
                    z-index: 999;
                }
                .spty-float-rotator {
                    transform-style: preserve-3d;
                }
                .spty-float-scaler {
                    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
                }
                .spty-float-item:hover .spty-float-scaler,
                .spty-float-item:active .spty-float-scaler {
                    transform: scale(1.12) translateZ(30px);
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
    
    const [scene, setScene] = useState('envelope'); // 'envelope' | 'envelope-opening' | 'letter' | 'letter-folding' | 'book'
    const opened = true;
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

        const getMatrixText = () => {
            const recipient = (card.recipient_name || 'Anita').toUpperCase();
            switch (card.type) {
                case 'birthday':
                    return Array.from(`HAPPY BIRTHDAY ${recipient} 🎂 🎉 💫   `);
                case 'anniversary':
                    return Array.from(`HAPPY ANNIVERSARY ${recipient} 💖 💑 💍   `);
                case 'graduation':
                    return Array.from(`CONGRATULATIONS ${recipient} 🎓 🎉 ✨   `);
                case 'wedding':
                    return Array.from(`HAPPY WEDDING ${recipient} 💍 💑 💖   `);
                default:
                    return Array.from(`HAPPY SPESIAL FOR ${recipient} 💝 ✨ 💖   `);
            }
        };
        const letters = getMatrixText();
        const fontSize = 18;
        let columns = Math.floor(width / 36);
        let drops = Array(columns).fill(0).map(() => Math.random() * -100);
        let columnOffsets = Array(columns).fill(0).map(() => Math.floor(Math.random() * letters.length));

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 36);
            drops = Array(columns).fill(0).map(() => Math.random() * -100);
            columnOffsets = Array(columns).fill(0).map(() => Math.floor(Math.random() * letters.length));
        };
        window.addEventListener('resize', resize);

        const draw = () => {
            animId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, width, height);

            ctx.font = `600 ${fontSize}px 'Fredoka', sans-serif`;

            for (let i = 0; i < drops.length; i++) {
                const x = i * 36;
                const headGrid = Math.floor(drops[i]);
                const trailLength = 10;

                for (let j = 0; j < trailLength; j++) {
                    const yGrid = headGrid - j;
                    if (yGrid < 0) continue;
                    
                    const y = yGrid * fontSize;
                    if (y > height + fontSize) continue;

                    const charIndex = (yGrid + (columnOffsets[i] || 0)) % letters.length;
                    const char = letters[charIndex];

                    if (char && char.trim() !== '') {
                        if (j === 0) {
                            ctx.globalAlpha = 1.0;
                            ctx.fillStyle = '#ffffff';
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = '#ff4d80';
                        } else {
                            const opacity = 1 - (j / trailLength);
                            ctx.globalAlpha = opacity * 0.85;
                            const hue = 330 + (Math.random() - 0.5) * 10; // Pink variations
                            ctx.fillStyle = `hsl(${hue}, 100%, 75%)`;
                            ctx.shadowBlur = 4;
                            ctx.shadowColor = `hsl(${hue}, 100%, 65%)`;
                        }
                        ctx.fillText(char, x, y);
                    }
                }

                drops[i] += 0.16; // Slower speed to make it elegant and readable

                if ((headGrid - trailLength) * fontSize > height && Math.random() > 0.98) {
                    drops[i] = 0;
                    columnOffsets[i] = Math.floor(Math.random() * letters.length);
                }
            }

            // Reset canvas states for other potential uses
            ctx.globalAlpha = 1.0;
            ctx.shadowBlur = 0;
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [opened, card.recipient_name, card.type]);

    // Typewriter dynamic looping effect
    const messages = (card.messages || []).filter(Boolean);
    const romanticLines = useMemo(() => {
        if (messages.length > 0) {
            const items = [...messages];
            while (items.length < 4) {
                items.push(items[items.length - 1] || "With Love ❤️");
            }
            return items;
        }
        
        switch (card.type) {
            case 'birthday':
                return [
                    `Selamat ulang tahun untukmu yang paling istimewa dan bersinar... 🎂\nHari ini adalah hari spesial di mana doaku mengalir paling deras untukmu.`,
                    `Semoga setiap impian dan harapan besarmu terwujud menjadi kenyataan indah. 🌟\nTerima kasih telah selalu menghiasi dunia ini dengan kebaikan dan tawa hangatmu.`,
                    `Semoga kebahagiaan sejati, kesehatan prima, dan kesuksesan selalu menyertaimu. 💗\nKamu adalah berkah luar biasa yang patut mendapatkan segala kebaikan di dunia.`,
                    `Selamat hari kelahiran! Mari rayakan hari indahmu ini dengan senyuman terbaik. 🥳🎉\nSemoga hari-harimu ke depan selalu dipenuhi dengan keberkahan dan tawa ceria.`
                ];
            case 'graduation':
                return [
                    `Selamat atas kelulusan dan pencapaian luar biasamu hari ini! 🎓\nSemua kerja keras, tetesan keringat, dan perjuangan panjangmu kini terbayar dengan sangat indah.`,
                    `Hari ini menandai awal dari babak baru perjalanan hebat dalam hidupmu. 🌟\nGantungkan mimpimu setinggi langit, dan melangkahlah maju dengan penuh keyakinan.`,
                    `Kami semua sangat bangga atas dedikasi, ketekunan, dan gelar yang kini berhasil kau raih. 👨‍🎓👩‍🎓\nSemoga ini menjadi batu loncatan menuju masa depan yang cerah.`,
                    `Semoga ilmu yang didapat membawa berkah dan menuntunmu ke puncak kesuksesan! 🚀🌠\nSelamat bersenang-senang merayakan pencapaian luar biasa ini.`
                ];
            case 'wedding':
                return [
                    `Selamat menempuh hidup baru dan selamat berbahagia untuk kalian berdua! 💍\nHari ini, dua hati dan dua takdir telah dipersatukan dalam ikatan janji suci yang sakral.`,
                    `Semoga bahtera rumah tangga yang kalian bangun selalu dipenuhi cinta dan kedamaian. 💖\nSaling melengkapi di kala kurang, dan saling menguatkan di kala menghadapi ujian.`,
                    `Jadikan setiap hari sebagai lembaran kisah cinta baru yang penuh kasih sayang. 💞\nSaling menghormati, setia menemani, dan berkatalah dengan kelembutan hati.`,
                    `Selamat menempuh bahtera keluarga baru, semoga sakinah, mawaddah, warahmah. 💑🌸\nSemoga cinta kalian abadi hingga akhir hayat memisahkan.`
                ];
            case 'anniversary':
            default:
                return [
                    `Hai orang ter-istimewa yang paling kucintai di dunia ini... 💗\nSelamat hari jadi kebersamaan kita yang penuh dengan warna dan kehangatan.`,
                    `Setiap detik yang telah kita lalui bersama adalah lembaran terbaik yang sangat kusyukuri. ✨\nTerima kasih telah mengajariku arti kenyamanan dan ketulusan.`,
                    `Dalam senyuman manis dan tatapan matamu, aku selalu menemukan alasan terbaik untuk bahagia. 💕\nBersamamu, perjalanan hidup ini terasa jauh lebih indah dan bermakna.`,
                    `Terima kasih telah setia menemani dan selalu ada di sisiku melewati segala musim. 👩‍❤️‍👨\nMari kita rajut dan tulis ribuan kisah cinta indah lainnya bersama selamanya! 📖💫`
                ];
        }
    }, [messages, card.type]);

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
            // Slower typing speed (100ms instead of 70ms) to make it more readable
            timer = setTimeout(() => {
                setTypewriterText(currentMsg.substring(0, charIdx + 1));
                setCharIdx(prev => prev + 1);
            }, 100);
        }

        if (!isDeleting && charIdx === currentMsg.length) {
            // Wait longer at the end of text (4500ms instead of 3500ms) for better readability
            clearTimeout(timer);
            timer = setTimeout(() => setIsDeleting(true), 4500);
        } else if (isDeleting && charIdx === 0) {
            clearTimeout(timer);
            setIsDeleting(false);
            setCurrentMsgIdx(prev => (prev + 1) % romanticLines.length);
        }

        return () => clearTimeout(timer);
    }, [opened, charIdx, isDeleting, currentMsgIdx, romanticLines]);

    const handleOpenEnvelope = () => {
        setScene('envelope-opening');
        // Play click transition sound
        playSynthesizedSound('lift', isMuted);
        
        // Start background music!
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        }
        
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
        
        // Wait 1.0s for the flap-open & seal-break animations before revealing the letter
        setTimeout(() => {
            setScene('letter');
        }, 1000);
    };

    const handleOpenBook = () => {
        setScene('letter-folding');
        // Play flip transition sound
        playSynthesizedSound('burst', isMuted);
        
        // Wait 800ms for folding animation to resolve before showing the 3D book
        setTimeout(() => {
            setScene('book');
        }, 800);
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

    const typeTitleText = {
        anniversary: "Happy Anniversary",
        birthday:    "Happy Birthday",
        graduation:  "Selamat Wisuda",
        wedding:     "Selamat Menikah",
    };

    // Folds structure: 4 folds (8 pages/faces). Fold 0 (Front: Cover, Back: Page 1), Fold 1 (Front: Page 2, Back: Page 3), Fold 2 (Front: Page 4, Back: Page 5), Fold 3 (Front: Page 6, Back: Back Cover)
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
            back: {
                title: 'Growing Together 🌱',
                body: romanticLines[4] || 'Setiap langkah tumbuh kembang yang kita lalui menjadi saksi kedewasaan cinta kita...',
                illIdx: 4
            }
        },
        {
            front: {
                title: 'Endless Horizons 🌅',
                body: romanticLines[5] || 'Menatap ufuk masa depan dengan senyuman terindah dan keyakinan bersamamu...',
                illIdx: 5
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
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

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
            <div className={`absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] z-20 text-center transition-all duration-1000 ${scene === 'book' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-[20px] scale-95'}`} style={{
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

            {/* 3D Perspective Workspace Container */}
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none" style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}>
                
                {/* Envelope Wrapper */}
                <div 
                    className="absolute pointer-events-auto transition-all-3d"
                    style={{
                        left: '50%',
                        top: '50%',
                        transformStyle: 'preserve-3d',
                        zIndex: (scene === 'envelope' || scene === 'envelope-opening') ? 40 : 10,
                        transform: (scene === 'envelope' || scene === 'envelope-opening')
                            ? 'translate(-50%, -50%) translateY(0) scale(1) translateZ(0)'
                            : 'translate(-50%, -50%) translateY(240px) scale(0.7) translateZ(-150px) rotateX(15deg)',
                        opacity: (scene === 'envelope' || scene === 'envelope-opening') ? 1 : 0,
                        pointerEvents: (scene === 'envelope' || scene === 'envelope-opening') ? 'auto' : 'none'
                    }}
                >
                    {/* The 3D Envelope */}
                    <div 
                        onClick={scene === 'envelope' ? handleOpenEnvelope : undefined}
                        className="relative w-[300px] h-[190px] cursor-pointer rounded-xl bg-gradient-to-br from-[#4c1125] to-[#1e050d] border border-[#ff4d80]/30 flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-300"
                        style={{
                            boxShadow: '0 25px 55px rgba(0,0,0,0.7), 0 0 35px rgba(255, 77, 128, 0.2)',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Back Pocket Background (inside envelope) */}
                        <div className="absolute inset-0 rounded-xl bg-[#2e0915] z-0" />

                        {/* Top Flap (closes over the front) */}
                        <div className={`absolute top-0 left-0 w-0 h-0 border-t-[90px] border-t-[#3b0d1c] border-x-[150px] border-x-transparent origin-top z-40 transition-all duration-[850ms] ${scene !== 'envelope' ? 'envelope-flap-open' : ''}`} style={{ transformOrigin: 'top' }} />

                        {/* Left Flap */}
                        <div className="absolute inset-0 border-l-[150px] border-l-[#3b0d1c] border-y-[95px] border-y-transparent z-30 pointer-events-none rounded-l-xl" />

                        {/* Right Flap */}
                        <div className="absolute inset-0 border-r-[150px] border-r-[#3b0d1c] border-y-[95px] border-y-transparent z-30 pointer-events-none rounded-r-xl" />

                        {/* Bottom Flap */}
                        <div className="absolute inset-0 border-b-[95px] border-b-[#2f0a17] border-x-[150px] border-x-transparent z-30 pointer-events-none rounded-b-xl" />

                        {/* Wax Seal / Glow Seal */}
                        <div className={`absolute z-50 flex flex-col items-center justify-center transition-all duration-700 ${scene !== 'envelope' ? 'opacity-0 scale-50 -translate-y-12 rotate-45 pointer-events-none' : ''}`}>
                            <div className="w-16 h-16 rounded-full bg-[#ff4d80]/15 border border-[#ff4d80]/40 flex items-center justify-center animate-pulseRing absolute" />
                            <div className="w-16 h-16 rounded-full bg-[#ff4d80] flex items-center justify-center shadow-[0_0_25px_rgba(255,77,128,0.9)] z-10 hover:scale-110 active:scale-90 transition-transform">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white animate-heartBeat">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </div>
                            <span className="text-[10px] text-[#ffb8d2] font-bold tracking-widest uppercase mt-4 text-center select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                Ketuk Segel 💗
                            </span>
                        </div>
                    </div>
                </div>

                {/* Love Letter Wrapper */}
                <div 
                    className="absolute pointer-events-auto transition-all-3d w-[90vw] max-w-[400px]"
                    style={{
                        left: '50%',
                        top: '50%',
                        transformStyle: 'preserve-3d',
                        zIndex: (scene === 'letter' || scene === 'letter-folding') ? 45 : 20,
                        transform: (scene === 'letter')
                            ? 'translate(-50%, -50%) translateY(0) scale(1) translateZ(0)'
                            : (scene === 'envelope' || scene === 'envelope-opening')
                            ? 'translate(-50%, -50%) translateY(80px) scale(0.65) translateZ(-80px)' // sits slightly inside/below the envelope
                            : 'translate(-50%, -50%) translateY(-200px) scale(0.15) rotateY(-180deg) rotateZ(-10deg) translateZ(-200px)', // folded/shrunk/flipped
                        opacity: (scene === 'letter') ? 1 : 0,
                        pointerEvents: (scene === 'letter') ? 'auto' : 'none'
                    }}
                >
                    <div 
                        className="w-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
                        style={{
                            background: '#fffaf0',
                            backgroundImage: 'linear-gradient(rgba(139, 90, 66, 0.08) 1px, transparent 1px)',
                            backgroundSize: '100% 24px',
                            border: '2px solid rgba(255, 77, 128, 0.3)',
                            boxShadow: '0 25px 55px rgba(0,0,0,0.55), inset 0 0 20px rgba(139, 90, 66, 0.05)',
                            minHeight: '380px',
                        }}
                    >
                        {/* Header */}
                        <div className="text-right text-[10px] text-[#8b5a42] font-mono tracking-widest border-b border-[#8b5a42]/20 pb-2 mb-4">
                            DEDIKASI KHUSUS ✉️
                        </div>

                        {/* Letter Body */}
                        <div className="flex-1 flex flex-col justify-center py-4">
                            <h3 style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl sm:text-3xl font-bold text-[#4c1125] mb-4">
                                Teruntuk {card.recipient_name} tercinta,
                            </h3>
                            <p style={{ fontFamily: "'Dancing Script', cursive", lineHeight: '1.8' }} className="text-lg sm:text-xl text-[#3d2218] font-bold">
                                {card.type === 'birthday' ? (
                                    `Di hari yang indah ini, saat semesta merayakan hari kelahiranmu, kusembahkan kotak memori kecil ini khusus untukmu. Semoga kebahagiaan dan keberkahan selalu menyertai setiap langkahmu...`
                                ) : card.type === 'wedding' ? (
                                    `Selamat menempuh hidup baru. Dua takdir kini telah menyatu dalam janji suci. Semoga pernikahan ini dipenuhi keberkahan, sakinah, mawaddah, dan warahmah selamanya...`
                                ) : card.type === 'graduation' ? (
                                    `Selamat atas keberhasilan dan kelulusan hebatmu hari ini. Semua perjuanganmu kini berbuah manis. Semoga ini menjadi awal masa depanmu yang sangat gemilang...`
                                ) : (
                                    `Selamat hari jadi kebersamaan kita yang penuh warna. Terima kasih telah selalu menjadi pelipur lara dan pelengkap terindah dalam hidupku. Ini adalah rangkuman kisah kita...`
                                )}
                            </p>
                            <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-right text-base sm:text-lg text-[#8b5a42] mt-6 font-semibold">
                                Dari: {card.sender_name} 💖
                            </p>
                        </div>

                        {/* Footer Button */}
                        <div className="border-t border-[#8b5a42]/15 pt-4 mt-4 text-center">
                            <button 
                                onClick={handleOpenBook}
                                className="px-6 py-3 rounded-full text-white text-xs font-semibold tracking-wider uppercase border-none bg-gradient-to-r from-[#ff4d80] to-[#ff66a3] hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(255,77,128,0.4)] cursor-pointer"
                            >
                                Buka Album Memori 📖
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3D Book Wrapper */}
                <div 
                    className="absolute pointer-events-auto transition-all-3d w-[90vw] max-w-[440px] h-[55vh] max-h-[500px] min-h-[380px]"
                    style={{
                        left: '50%',
                        top: '52%', // Visual balance alignment
                        transformStyle: 'preserve-3d',
                        zIndex: scene === 'book' ? 50 : 15,
                        transform: scene === 'book'
                            ? `translate(${flipped.length === 0 ? '-50%' : flipped.length === folds.length ? '50%' : '0%'}, -50%) scale(1) rotateY(0deg) translateZ(0)`
                            : (scene === 'letter-folding')
                            ? 'translate(0%, -50%) scale(0.65) rotateY(90deg) translateZ(-50px)'
                            : 'translate(-50%, -50%) translateY(100px) scale(0.2) rotateY(180deg) translateZ(-200px)', // hidden far back and flipped
                        opacity: scene === 'book' ? 1 : 0,
                        pointerEvents: scene === 'book' ? 'auto' : 'none'
                    }}
                >
                    {/* The 3D Book Layout */}
                    <div className="w-full h-full relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.65)] rounded-lg">
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
                                                <h2 style={{ fontFamily: "'Dancing Script', cursive" }} className="text-3xl sm:text-4xl font-bold mb-1">
                                                    {(!card.title || card.title === "Kartu Ucapan") ? (typeTitleText[card.type] || "Kartu Ucapan") : card.title}
                                                </h2>
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
            </div>


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
                @keyframes fadeIn {
                    0% { opacity: 0; transform: scale(0.95) translate(-50%, -48%); }
                    100% { opacity: 1; transform: scale(1) translate(-50%, -50%); }
                }
                @keyframes slideUpLetter {
                    0% { opacity: 0; transform: translate(-50%, 10vh); filter: blur(5px); }
                    100% { opacity: 1; transform: translate(-50%, -50%); filter: blur(0); }
                }
                .transition-all-3d {
                    transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.0s cubic-bezier(0.25, 1, 0.5, 1), z-index 1.2s;
                }
                .envelope-flap-open {
                    transform: rotateX(180deg) !important;
                    z-index: 5 !important;
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
   SCRATCH-OFF POLAROID IMAGE COMPONENT (Usap-usap Sakura)
   ───────────────────────────────────────────────────────── */
function ScratchPolaroidImage({ src, onScratch }) {
    const canvasRef = useRef(null);
    const [isCleared, setIsCleared] = useState(false);
    const leavesRef = useRef([]);
    const isDrawingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || 140;
            canvas.height = rect.height || 140;

            // Re-initialize 32 leaves structured beautifully in grids
            const tempLeaves = [];
            const leafCount = 32;
            for (let i = 0; i < leafCount; i++) {
                const col = i % 4;
                const row = Math.floor(i / 4);
                // Grid positioning with randomized natural offsets
                const px = col * (canvas.width / 3.5) + 12 + (Math.random() - 0.5) * 15;
                const py = row * (canvas.height / 7.5) + 12 + (Math.random() - 0.5) * 15;
                const sizeX = 14 + Math.random() * 12;
                const sizeY = 8 + Math.random() * 8;
                const rot = Math.random() * Math.PI * 2;

                tempLeaves.push({
                    id: i,
                    x: px,
                    y: py,
                    startX: px,
                    startY: py,
                    rX: sizeX,
                    rY: sizeY,
                    rotation: rot,
                    vx: 0,
                    vy: 0,
                    rotSpeed: 0,
                    isFalling: false,
                    opacity: 1
                });
            }
            leavesRef.current = tempLeaves;
        };

        const drawSakuraPetal = (x, y, rX, rY, rotation) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-rX, -rY * 1.5, -rX * 1.5, rY * 0.5, 0, rY * 1.5);
            ctx.bezierCurveTo(rX * 1.5, rY * 0.5, rX, -rY * 1.5, 0, 0);
            
            const petalGrad = ctx.createRadialGradient(-rX * 0.2, -rY * 0.2, 0, 0, 0, rY * 1.5);
            petalGrad.addColorStop(0, '#ffffff'); // pure light core
            petalGrad.addColorStop(0.3, '#fbcfe8'); // pink-200
            petalGrad.addColorStop(1, '#f472b6'); // pink-400
            
            ctx.fillStyle = petalGrad;
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(219, 39, 119, 0.5)'; // pink-600 outline
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Vein details
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, rY * 0.9);
            ctx.strokeStyle = 'rgba(219, 39, 119, 0.25)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
        };

        resizeCanvas();
        const t = setTimeout(resizeCanvas, 150);

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const leaves = leavesRef.current;
            if (leaves.length === 0) {
                animId = requestAnimationFrame(loop);
                return;
            }

            // Draw background mist (decays as leaves fall)
            const leafCount = leaves.length;
            const activeLeaves = leaves.filter(l => !l.isFalling).length;
            const mistOpacity = (activeLeaves / leafCount) * 0.45;
            ctx.fillStyle = `rgba(253, 242, 245, ${mistOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            leaves.forEach(leaf => {
                if (leaf.isFalling) {
                    leaf.y += leaf.vy;
                    leaf.x += leaf.vx;
                    leaf.vy += 0.14; // gravity!
                    leaf.rotation += leaf.rotSpeed;

                    if (leaf.y > canvas.height + 25) {
                        leaf.opacity = 0;
                    } else if (leaf.y > canvas.height - 40) {
                        leaf.opacity = Math.max(0, leaf.opacity - 0.05); // fade out at bottom edge
                    }
                }

                if (leaf.opacity > 0) {
                    ctx.save();
                    ctx.globalAlpha = leaf.opacity;
                    drawSakuraPetal(leaf.x, leaf.y, leaf.rX, leaf.rY, leaf.rotation);
                    ctx.restore();
                }
            });

            // Draw rounded instruction label overlay in the middle of leaf cover
            const clearedCount = leaves.filter(l => l.isFalling).length;
            const clearedPercent = (clearedCount / leafCount) * 100;

            if (clearedPercent < 60) {
                ctx.save();
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, 0.92 - (clearedPercent / 60) * 0.92)})`;
                ctx.shadowColor = 'rgba(219, 39, 119, 0.15)';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.roundRect(canvas.width / 2 - 50, canvas.height / 2 - 18, 100, 36, 8);
                ctx.fill();

                ctx.fillStyle = `rgba(219, 39, 119, ${Math.max(0, 1 - (clearedPercent / 60))})`;
                ctx.font = 'bold 9px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('Sapu Daun Sakura 🌸', canvas.width / 2, canvas.height / 2 - 6);
                ctx.font = '7px sans-serif';
                ctx.fillStyle = `rgba(140, 109, 98, ${Math.max(0, 1 - (clearedPercent / 60))})`;
                ctx.fillText('Buka Foto Kenangan ✨', canvas.width / 2, canvas.height / 2 + 8);
                ctx.restore();
            } else {
                // Auto trigger remaining leaves to fall! Staggered waterfall effect!
                leaves.forEach((l, idx) => {
                    if (!l.isFalling) {
                        setTimeout(() => {
                            l.isFalling = true;
                            l.vy = 1.2 + Math.random() * 2;
                            l.vx = (Math.random() - 0.5) * 1.5;
                            l.rotSpeed = (Math.random() - 0.5) * 0.05;
                        }, (idx % 8) * 45);
                    }
                });
            }

            // Check if all leaves have fully faded out
            const anyVisible = leaves.some(l => l.opacity > 0);
            if (!anyVisible && leaves.length > 0) {
                setIsCleared(true);
                return; // stop loop
            }

            animId = requestAnimationFrame(loop);
        };

        loop();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(t);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [src]);

    const handlePointerDown = (e) => {
        isDrawingRef.current = true;
        handlePointerMove(e);
    };

    const handlePointerMove = (e) => {
        if (!isDrawingRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        // Check distance to all static leaves and trigger fall!
        let swipedAny = false;
        const leaves = leavesRef.current;
        leaves.forEach(leaf => {
            if (!leaf.isFalling) {
                const dist = Math.hypot(leaf.x - mouseX, leaf.y - mouseY);
                if (dist < 32) { // 32px swipe brush
                    leaf.isFalling = true;
                    leaf.vy = 1.5 + Math.random() * 2;
                    leaf.vx = (Math.random() - 0.5) * 1.6;
                    leaf.rotSpeed = (Math.random() - 0.5) * 0.07;
                    swipedAny = true;
                }
            }
        });

        if (swipedAny && onScratch) {
            onScratch();
        }
    };

    const handlePointerUp = () => {
        isDrawingRef.current = false;
    };

    return (
        <div className="relative w-full h-full select-none" style={{ touchAction: 'none' }}>
            <img src={src} alt="" className="w-full h-full object-cover block pointer-events-none" />
            
            {!isCleared && (
                <canvas
                    ref={canvasRef}
                    onMouseDown={handlePointerDown}
                    onMouseMove={handlePointerMove}
                    onMouseUp={handlePointerUp}
                    onMouseLeave={handlePointerUp}
                    onTouchStart={handlePointerDown}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handlePointerUp}
                    className="absolute inset-0 w-full h-full z-10 cursor-crosshair transition-opacity duration-500 rounded-sm"
                />
            )}
        </div>
    );
}

// Helper to render high-fidelity 3D red braided satin rope
const renderRope = (d, className = "", extraStyle = {}) => {
    if (!d) return null;
    return (
        <g className={className} style={extraStyle}>
            {/* 1. Drop Shadow Layer */}
            <path d={d} fill="none" stroke="rgba(61, 34, 24, 0.22)" strokeWidth="6.5" strokeLinecap="round" filter="url(#ropeShadow)" />
            {/* 2. Deep Crimson Border */}
            <path d={d} fill="none" stroke="#7f1d1d" strokeWidth="4.8" strokeLinecap="round" />
            {/* 3. Vibrant Crimson Core */}
            <path d={d} fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            {/* 4. Pink Twisted Fiber Strand */}
            <path d={d} fill="none" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="3 3" strokeLinecap="round" opacity="0.85" />
            {/* 5. Specular Silk Highlight */}
            <path d={d} fill="none" stroke="#ffffff" strokeWidth="0.4" strokeDasharray="1 5" strokeLinecap="round" opacity="0.9" />
        </g>
    );
};

// Predefined default placeholder images matching the elegant rose gold / vintage aesthetic
const fallbackPhotos = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600', // Romantic roses
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600', // Hands holding
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', // Warm golden sunset
];

/* ─────────────────────────────────────────────────────────
   ETHEREAL WHISPERS — Premium 5-Scene Sinematik Romantic Render
   ───────────────────────────────────────────────────────── */
function EtherealWhispersFull({ card }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    
    // Scenes: 'envelope' | 'envelope-opening' | 'prologue' | 'scroll' | 'eternity-knot'
    const [scene, setScene] = useState('envelope');
    const [isMuted, setIsMuted] = useState(true);
    const [activePhoto, setActivePhoto] = useState(null);
    
    // 3D Envelope Tilt State
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleEnvelopeMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 20, y: -y * 20 }); // up to 20deg tilt
    };
    const handleEnvelopeMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };
    
    // Typewriter State
    const [typewriterText, setTypewriterText] = useState('');
    const [currentMsgIdx, setCurrentMsgIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    
    // Particle bursts
    const [sealSplashes, setSealSplashes] = useState([]);
    
    // Scrapbook Leaf Sweep Canvas State & Refs
    const scrapbookCanvasRef = useRef(null);
    const [isScrapbookCleared, setIsScrapbookCleared] = useState(false);
    const scrapbookLeavesRef = useRef([]);
    const isScrapbookDrawingRef = useRef(false);
    const lastPointerRef = useRef({ x: null, y: null, t: 0 });
    
    // Drag-and-Tie Rope State & Cinematic Curtain Refs/States
    const [dragOffset, setDragOffset] = useState(0);
    const [isDraggingRope, setIsDraggingRope] = useState(false);
    const startYRef = useRef(0);
    const dragOffsetRef = useRef(0);
    const [curtainActive, setCurtainActive] = useState(false);
    const [curtainOpen, setCurtainOpen] = useState(false);
    const [scrollSubScene, setScrollSubScene] = useState('letter'); // 'letter' | 'scrapbook'
    // Scrapbook Polaroid State
    const [activePolaroidIdx, setActivePolaroidIdx] = useState(1); // Middle one initially at top
    
    // Scene 5 Love Ribbon State
    const [isRibbonTied, setIsRibbonTied] = useState(false);
    const [knotBurstActive, setKnotBurstActive] = useState(false);
    const [floatingCelebrationItems, setFloatingCelebrationItems] = useState([]);
    
    // Orientation check
    const [isLandscapeLocked, setIsLandscapeLocked] = useState(false);
    const [dismissWarning, setDismissWarning] = useState(false);
    
    // Draggable Rope Coordinates calculations (Memoized to strictly secure against TDZ/Minification reference issues)
    const leftEndX = useMemo(() => isRibbonTied ? 100 : Math.min(100, 85 + (dragOffset * 0.3)), [isRibbonTied, dragOffset]);
    const leftEndY = useMemo(() => isRibbonTied ? 50 : 68 + dragOffset * 0.7, [isRibbonTied, dragOffset]);
    const rightEndX = useMemo(() => isRibbonTied ? 100 : Math.max(100, 115 - (dragOffset * 0.3)), [isRibbonTied, dragOffset]);
    const rightEndY = useMemo(() => isRibbonTied ? 50 : 68 + dragOffset * 0.7, [isRibbonTied, dragOffset]);
    const beadY = useMemo(() => isRibbonTied ? 50 : 68 + dragOffset * 0.7, [isRibbonTied, dragOffset]);
    
    const messages = useMemo(() => (card.messages || []).filter(Boolean), [card.messages]);
    const photos = useMemo(() => (card.photos || []).filter(Boolean), [card.photos]);
    
    const displayPhotos = useMemo(() => {
        const result = [...photos];
        while (result.length < 3) {
            result.push(fallbackPhotos[result.length % fallbackPhotos.length]);
        }
        return result.slice(0, 3); // exactly 3 photos
    }, [photos]);
    
    // Check orientation on mobile
    useEffect(() => {
        const checkOrientation = () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            setIsLandscapeLocked(isMobile && window.innerHeight > window.innerWidth);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);
    
    // Audio chime synthesizer
    const playChimeNote = (pitchOffset = 0) => {
        if (isMuted) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const now = ctx.currentTime;
            
            const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51]; // C5 to E6
            const baseFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
            const freq = baseFreq * (1 + pitchOffset);
            
            const osc = ctx.createOscillator();
            const overtone = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filterNode = ctx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            overtone.type = 'triangle';
            overtone.frequency.setValueAtTime(freq * 1.5, now);
            
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(2200, now);
            filterNode.frequency.exponentialRampToValueAtTime(120, now + 1.4);
            
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
            
            osc.connect(gainNode);
            overtone.connect(gainNode);
            gainNode.connect(filterNode);
            filterNode.connect(ctx.destination);
            
            osc.start(now);
            overtone.start(now);
            osc.stop(now + 1.4);
            overtone.stop(now + 1.4);
        } catch (e) {
            console.warn("Chime failed:", e);
        }
    };
    
    // Main audio backsound
    const audioRef = useRef(null);
    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };
    
    // Canvas Falling Petals
    useEffect(() => {
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
        
        class Petal {
            constructor() {
                this.reset();
                this.y = Math.random() * height;
            }
            reset() {
                this.x = Math.random() * width;
                this.y = -20;
                this.radiusX = 7 + Math.random() * 7;
                this.radiusY = 4 + Math.random() * 4;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.015;
                this.speedY = 0.6 + Math.random() * 1;
                this.speedX = -0.4 + Math.random() * 0.8;
                this.swing = Math.random() * 15;
                this.swingSpeed = 0.008 + Math.random() * 0.015;
                this.swingAngle = Math.random() * Math.PI;
                this.opacity = 0.55 + Math.random() * 0.4;
                
                const pinks = [
                    'rgba(255, 174, 185, ',
                    'rgba(255, 192, 203, ',
                    'rgba(255, 182, 193, ',
                    'rgba(245, 218, 226, ',
                    'rgba(255, 209, 225, '
                ];
                this.colorBase = pinks[Math.floor(Math.random() * pinks.length)];
            }
            update(mouseX, mouseY) {
                this.y += this.speedY;
                this.swingAngle += this.swingSpeed;
                this.x += this.speedX + Math.sin(this.swingAngle) * 0.4;
                this.rotation += this.rotationSpeed;
                
                if (mouseX !== null && mouseY !== null) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 130) {
                        const force = (130 - dist) / 130;
                        const angle = Math.atan2(dy, dx);
                        this.x += Math.cos(angle) * force * 4.5;
                        this.y += Math.sin(angle) * force * 2.5;
                    }
                }
                
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                ctx.beginPath();
                ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.colorBase + this.opacity + ')';
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(255, 182, 193, 0.35)';
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(-this.radiusX, 0);
                ctx.quadraticCurveTo(0, -this.radiusY * 0.15, this.radiusX, 0);
                ctx.strokeStyle = 'rgba(255, 90, 150, 0.25)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        const petals = Array.from({ length: 40 }, () => new Petal());
        
        let mouseX = null;
        let mouseY = null;
        
        const handlePointerMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        const handlePointerLeave = () => {
            mouseX = null;
            mouseY = null;
        };
        
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerLeave);
        
        const loop = () => {
            animId = requestAnimationFrame(loop);
            ctx.clearRect(0, 0, width, height);
            petals.forEach(p => {
                p.update(mouseX, mouseY);
                p.draw();
            });
        };
        loop();
        
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerLeave);
        };
    }, []);
    
    // Scrapbook Leaf-Sweep Physics Canvas Layer Effect
    useEffect(() => {
        if (scene !== 'scroll' || !isTypingComplete) return;
        const canvas = scrapbookCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let time = 0;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || 576;
            canvas.height = rect.height || 460;

            // Generate organic pile of 56 leaves overlapping Polaroid positions beautifully
            const tempLeaves = [];
            const leafCount = 56;
            
            // Coordinates matching Polaroid centers inside the 3D grid
            const clusters = [
                { cx: canvas.width * 0.25, cy: canvas.height * 0.40 },
                { cx: canvas.width * 0.50, cy: canvas.height * 0.35 },
                { cx: canvas.width * 0.75, cy: canvas.height * 0.40 }
            ];

            for (let i = 0; i < leafCount; i++) {
                const cluster = clusters[i % clusters.length];
                const px = cluster.cx + (Math.random() - 0.5) * (canvas.width * 0.22);
                const py = cluster.cy + (Math.random() - 0.5) * (canvas.height * 0.45);
                const sizeX = 14 + Math.random() * 12;
                const sizeY = 8 + Math.random() * 8;
                const rot = Math.random() * Math.PI * 2;

                tempLeaves.push({
                    id: i,
                    x: Math.max(15, Math.min(canvas.width - 15, px)),
                    y: Math.max(15, Math.min(canvas.height - 15, py)),
                    rX: sizeX,
                    rY: sizeY,
                    baseRotation: rot,
                    rotation: rot,
                    vx: 0,
                    vy: 0,
                    rotSpeed: 0,
                    isFalling: false,
                    opacity: 1
                });
            }
            scrapbookLeavesRef.current = tempLeaves;
        };

        const drawSakuraPetal = (x, y, rX, rY, rotation) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-rX, -rY * 1.5, -rX * 1.5, rY * 0.5, 0, rY * 1.5);
            ctx.bezierCurveTo(rX * 1.5, rY * 0.5, rX, -rY * 1.5, 0, 0);
            
            const petalGrad = ctx.createRadialGradient(-rX * 0.2, -rY * 0.2, 0, 0, 0, rY * 1.5);
            petalGrad.addColorStop(0, '#ffffff'); 
            petalGrad.addColorStop(0.3, '#fbcfe8'); 
            petalGrad.addColorStop(1, '#f472b6'); 
            
            ctx.fillStyle = petalGrad;
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(219, 39, 119, 0.45)'; 
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, rY * 0.9);
            ctx.strokeStyle = 'rgba(219, 39, 119, 0.22)';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            
            ctx.restore();
        };

        resizeCanvas();
        const t = setTimeout(resizeCanvas, 150);

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const leaves = scrapbookLeavesRef.current;
            if (leaves.length === 0) {
                animId = requestAnimationFrame(loop);
                return;
            }

            time++;

            const leafCount = leaves.length;
            const activeLeaves = leaves.filter(l => !l.isFalling).length;
            const mistOpacity = (activeLeaves / leafCount) * 0.45;
            ctx.fillStyle = `rgba(253, 242, 245, ${mistOpacity})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            leaves.forEach(leaf => {
                if (leaf.isFalling) {
                    leaf.y += leaf.vy;
                    leaf.x += leaf.vx;
                    leaf.vy += 0.14; 
                    leaf.vx *= 0.98; 
                    leaf.rotation += leaf.rotSpeed;

                    if (leaf.y > canvas.height + 25) {
                        leaf.opacity = 0;
                    } else if (leaf.y > canvas.height - 40) {
                        leaf.opacity = Math.max(0, leaf.opacity - 0.05); 
                    }
                } else {
                    const swayOffset = Math.sin(time * 0.03 + leaf.id * 1.5) * 0.08;
                    leaf.rotation = leaf.baseRotation + swayOffset;
                }

                if (leaf.opacity > 0) {
                    ctx.save();
                    ctx.globalAlpha = leaf.opacity;
                    drawSakuraPetal(leaf.x, leaf.y, leaf.rX, leaf.rY, leaf.rotation);
                    ctx.restore();
                }
            });

            const clearedCount = leaves.filter(l => l.isFalling).length;
            const clearedPercent = (clearedCount / leafCount) * 100;

            if (clearedPercent >= 60) {
                leaves.forEach((l, idx) => {
                    if (!l.isFalling) {
                        setTimeout(() => {
                            l.isFalling = true;
                            l.vy = 1.0 + Math.random() * 2;
                            l.vx = (Math.random() - 0.5) * 1.5;
                            l.rotSpeed = (Math.random() - 0.5) * 0.05;
                        }, (idx % 8) * 45);
                    }
                });
            }

            const anyVisible = leaves.some(l => l.opacity > 0);
            if (!anyVisible && leaves.length > 0) {
                setIsScrapbookCleared(true);
                return; 
            }

            animId = requestAnimationFrame(loop);
        };

        loop();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(t);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [scene, isTypingComplete, scrollSubScene]);

    const handleScrapbookPointerDown = (e) => {
        isScrapbookDrawingRef.current = true;
        const canvas = scrapbookCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        lastPointerRef.current = { x: mouseX, y: mouseY, t: performance.now() };
        handleScrapbookPointerMove(e);
    };

    const handleScrapbookPointerMove = (e) => {
        if (!isScrapbookDrawingRef.current) return;
        const canvas = scrapbookCanvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const now = performance.now();

        const prev = lastPointerRef.current;
        const dt = now - prev.t;
        const dx = mouseX - prev.x;
        const dy = mouseY - prev.y;
        
        const dragVx = dt > 0 ? (dx / dt) * 12 : 0;
        const dragVy = dt > 0 ? (dy / dt) * 12 : 0;

        lastPointerRef.current = { x: mouseX, y: mouseY, t: now };

        let swipedAny = false;
        const leaves = scrapbookLeavesRef.current;
        leaves.forEach(leaf => {
            if (!leaf.isFalling) {
                const dist = Math.hypot(leaf.x - mouseX, leaf.y - mouseY);
                if (dist < 42) { 
                    leaf.isFalling = true;
                    const angle = Math.atan2(leaf.y - mouseY, leaf.x - mouseX);
                    
                    leaf.vx = dragVx * 0.45 + Math.cos(angle) * 1.5 + (Math.random() - 0.5) * 1.5;
                    leaf.vy = Math.max(1.5, dragVy * 0.45 + Math.sin(angle) * 1.5 + 1.2 + Math.random() * 2);
                    leaf.rotSpeed = (Math.random() - 0.5) * 0.12 + (dragVx * 0.02);
                    
                    swipedAny = true;
                }
            }
        });

        if (swipedAny) {
            playChimeNote(0.1);
        }
    };

    const handleScrapbookPointerUp = () => {
        isScrapbookDrawingRef.current = false;
    };

    // Typewriter
    useEffect(() => {
        if (scene !== 'scroll') return;
        if (messages.length === 0) {
            setTypewriterText("Dengan segenap ketulusan hati, kusembahkan kartu ucapan penuh kehangatan ini khusus untukmu. Semoga hari-harimu selalu diisi kebahagiaan... ❤️");
            setIsTypingComplete(true);
            return;
        }
        
        const currentMsg = messages[currentMsgIdx];
        if (!currentMsg) return;
        
        if (charIdx < currentMsg.length) {
            const t = setTimeout(() => {
                setTypewriterText(prev => prev + currentMsg[charIdx]);
                setCharIdx(prev => prev + 1);
            }, 45 + Math.random() * 30);
            return () => clearTimeout(t);
        } else {
            if (currentMsgIdx < messages.length - 1) {
                const t = setTimeout(() => {
                    setTypewriterText('');
                    setCharIdx(0);
                    setCurrentMsgIdx(prev => prev + 1);
                }, 3300);
                return () => clearTimeout(t);
            } else {
                setIsTypingComplete(true);
            }
        }
    }, [scene, currentMsgIdx, charIdx, messages]);
    
    // Break wax seal (Scene 1)
    const handleBreakSeal = (e) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const symbols = ["🌸", "💖", "✨", "❤️", "💕"];
        const bursts = Array.from({ length: 22 }, (_, idx) => {
            const angle = (idx / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const speed = 4 + Math.random() * 6;
            return {
                id: Math.random().toString(),
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2.5,
                size: 15 + Math.random() * 12,
                opacity: 1,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12
            };
        });
        
        setSealSplashes(bursts);
        
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        }
        playChimeNote();
        setScene('envelope-opening');
        
        const startTime = Date.now();
        const pInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed > 3800) {
                clearInterval(pInterval);
                setSealSplashes([]);
            } else {
                setSealSplashes(prev => prev.map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy + 0.05, // slower gravity for slow-motion effect
                    vx: p.vx * 0.985, // less friction to float longer
                    rot: p.rot + p.rotSpeed,
                    opacity: Math.max(0, 1 - (elapsed / 3800))
                })));
            }
        }, 16);
        
        setTimeout(() => {
            setScene('eternity-knot'); // Go directly to love knot as Scene 2!
            setTimeout(playChimeNote, 250);
        }, 1300);
    };
    
    // Proceed to scroll letter scene manually with cinematic silk curtains transition
    const handleProceedToScroll = () => {
        playChimeNote(0.2);
        setCurtainActive(true);
        // Slowly slide curtain closed to cover the screen, swap scene to scroll, then open it back up
        setTimeout(() => {
            setScene('scroll');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                setCurtainOpen(true);
            }, 60);
        }, 500);

        // Reset curtain state after completion
        setTimeout(() => {
            setCurtainActive(false);
            setCurtainOpen(false);
        }, 2000);
    };

    // Ribbon tying mechanism (Scene 5)
    const handleTieRibbon = () => {
        if (isRibbonTied) return;
        setIsRibbonTied(true);
        setKnotBurstActive(true);
        playChimeNote(0.4);
        playChimeNote(0.6);
        
        // Massive burst of 30 flowers, hearts and glitters flying all over the page
        const symbols = ["🌸", "💖", "🌸", "❤️", "💕", "✨", "🤍", "🕊️"];
        const bursts = Array.from({ length: 32 }, (_, idx) => {
            const id = Math.random().toString();
            const angle = (idx / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
            const left = 30 + Math.random() * 40;
            const size = 18 + Math.random() * 16;
            const duration = 2.8 + Math.random() * 1.8;
            return { id, symbol: symbols[Math.floor(Math.random() * symbols.length)], left, size, duration, angle };
        });
        
        setFloatingCelebrationItems(bursts);
        
        setTimeout(() => {
            setKnotBurstActive(false);
        }, 1500);
    };

    // Drag-and-Tie Rope gesture event handlers
    const handleRopeDragStart = (e) => {
        if (isRibbonTied || isDraggingRope) return;

        // Prevent text selection and HTML5 image/graphics drag
        if (e.cancelable) {
            e.preventDefault();
        }

        // Support both PointerEvent and TouchEvent coordinates
        let startY = e.clientY;
        if (e.touches && e.touches.length > 0) {
            startY = e.touches[0].clientY;
        } else if (e.nativeEvent && e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
            startY = e.nativeEvent.touches[0].clientY;
        }

        if (startY === undefined || startY === null) return;

        setIsDraggingRope(true);
        startYRef.current = startY;
        dragOffsetRef.current = dragOffset;

        const handlePointerMove = (moveEvent) => {
            let currentY = moveEvent.clientY;
            if (moveEvent.touches && moveEvent.touches.length > 0) {
                currentY = moveEvent.touches[0].clientY;
            } else if (moveEvent.nativeEvent && moveEvent.nativeEvent.touches && moveEvent.nativeEvent.touches.length > 0) {
                currentY = moveEvent.nativeEvent.touches[0].clientY;
            }

            if (currentY === undefined || currentY === null) return;

            const deltaY = currentY - startYRef.current;
            const offset = Math.max(0, Math.min(130, deltaY));
            setDragOffset(offset);
            dragOffsetRef.current = offset;
        };

        const handlePointerUp = () => {
            setIsDraggingRope(false);
            
            // Clean up all bound events from window
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('touchend', handlePointerUp);
            window.removeEventListener('touchcancel', handlePointerUp);

            const finalOffset = dragOffsetRef.current;
            if (finalOffset >= 90) {
                // Success! Trigger knot tying
                handleTieRibbon();
            } else {
                // Smoothly animate back to 0 (Spring back)
                let current = finalOffset;
                const step = () => {
                    current -= 6;
                    if (current <= 0) {
                        setDragOffset(0);
                        dragOffsetRef.current = 0;
                    } else {
                        setDragOffset(current);
                        dragOffsetRef.current = current;
                        requestAnimationFrame(step);
                    }
                };
                requestAnimationFrame(step);
            }
        };

        // Bind all event types for maximum cross-device coverage
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
        window.addEventListener('touchcancel', handlePointerUp);
    };

    // Interactive Glass Heart Button (Kirim Cinta)
    const handleTapGlassHeart = () => {
        playChimeNote(0.3);
        const symbols = ["💖", "❤️", "💕", "✨", "🌸"];
        const bursts = Array.from({ length: 16 }, (_, idx) => {
            const angle = (idx / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const speed = 2 + Math.random() * 3.5;
            return {
                id: Math.random().toString(),
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                x: window.innerWidth / 2,
                y: window.innerHeight / 2 - 50,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.2, // upward launch
                size: 15 + Math.random() * 15,
                opacity: 1,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 6
            };
        });
        
        setSealSplashes(bursts);
        
        const startTime = Date.now();
        const pInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            if (elapsed > 3800) {
                clearInterval(pInterval);
                setSealSplashes([]);
            } else {
                setSealSplashes(prev => prev.map(p => ({
                    ...p,
                    x: p.x + p.vx,
                    y: p.y + p.vy,
                    vy: p.vy - 0.035, // floating slowly upwards against gravity
                    vx: p.vx * 0.98,  // smooth drift friction
                    rot: p.rot + p.rotSpeed,
                    opacity: Math.max(0, 1 - (elapsed / 3800))
                })));
            }
        }, 16);
    };
    
    const typeGreetingTitle = {
        anniversary: "Happy Anniversary",
        birthday:    "Happy Birthday",
        graduation:  "Selamat Wisuda",
        wedding:     "Selamat Menikah",
    };
    
    return (
        <div ref={containerRef} className="relative w-full min-h-screen overflow-x-hidden select-none bg-[#fdf8f5] text-[#3d2218] pb-24" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <audio ref={audioRef} src="/stillwithyou/music/music.mp3" loop />
            
            {/* Cinematic Silk Curtain Transition Overlay */}
            {curtainActive && (
                <div className="fixed inset-0 z-[999] pointer-events-none flex select-none">
                    {/* Left Curtain half */}
                    <div 
                        className="w-1/2 h-full bg-gradient-to-r from-[#faebf0] via-[#fbcfe8] to-[#f5dae2] shadow-[4px_0_15px_rgba(0,0,0,0.15)] transition-transform duration-[1200ms] ease-in-out origin-left border-r border-[#faebf0]/30"
                        style={{
                            transform: curtainOpen ? 'translateX(-100%)' : 'translateX(0%)'
                        }}
                    />
                    {/* Right Curtain half */}
                    <div 
                        className="w-1/2 h-full bg-gradient-to-l from-[#faebf0] via-[#fbcfe8] to-[#f5dae2] shadow-[-4px_0_15px_rgba(0,0,0,0.15)] transition-transform duration-[1200ms] ease-in-out origin-right border-l border-[#faebf0]/30"
                        style={{
                            transform: curtainOpen ? 'translateX(100%)' : 'translateX(0%)'
                        }}
                    />
                </div>
            )}
            
            {/* Soft Ambient Rose Gold Vignette */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle, rgba(250, 235, 240, 0.6) 0%, rgba(245, 218, 226, 0.45) 60%, rgba(253, 248, 245, 0.9) 100%)',
            }} />
            
            {/* Falling sakura/rose petals canvas layer */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[60]" />
            
            {/* Seal Burst Sparkles overlay */}
            {sealSplashes.map(p => (
                <div key={p.id} className="absolute pointer-events-none z-[100] text-center" style={{
                    left: `${p.x}px`,
                    top: `${p.y}px`,
                    fontSize: `${p.size}px`,
                    opacity: p.opacity,
                    transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
                }}>
                    {p.symbol}
                </div>
            ))}
            
            {/* Floating Celebration items from Ribbon Seal */}
            <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
                {floatingCelebrationItems.map(item => (
                    <div key={item.id} className="absolute text-center drop-shadow-[0_2px_8px_rgba(255,182,193,0.55)]" style={{
                        left: `${item.left}%`,
                        bottom: '80px',
                        fontSize: `${item.size}px`,
                        animation: `ewRiseUp ${item.duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                    }}>
                        {item.symbol}
                    </div>
                ))}
            </div>
            
            {/* Sound Button */}
            {scene !== 'envelope' && scene !== 'envelope-opening' && (
                <div className="fixed top-5 right-5 z-[90] flex gap-3">
                    <button onClick={toggleMute} className="w-11 h-11 rounded-full flex items-center justify-center transition-all bg-white/70 border border-[#f5dae2] text-[#e5654b] shadow-md hover:scale-105 active:scale-95 backdrop-blur-sm cursor-pointer">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            {isMuted ? (
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            ) : (
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            )}
                        </svg>
                    </button>
                </div>
            )}
            
            {/* ── SCENE 1: ENVELOPE GATE SCREEN (With 3D Parallax Mouse Tilt & Entrance Scale Animation) ── */}
            {(scene === 'envelope' || scene === 'envelope-opening') && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#fdf8f5] transition-all duration-1000 ${scene === 'envelope-opening' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                    <div className="w-full max-w-md animate-scaleIn select-none">
                        <div 
                            onMouseMove={handleEnvelopeMouseMove}
                            onMouseLeave={handleEnvelopeMouseLeave}
                            className="relative w-full h-[460px] flex flex-col justify-between items-center text-center p-8 bg-white/60 border border-white/85 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden transition-transform duration-200"
                            style={{
                                transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                        {/* Soft gold stamped border decor */}
                        <div className="absolute inset-3 border border-[#faebf0] rounded-[22px] pointer-events-none" />
                        
                        <div className="relative z-10 mt-6" style={{ transform: 'translateZ(30px)' }}>
                            <span style={{ fontFamily: "'Parisienne', cursive" }} className="block text-4xl text-[#e5654b] mb-1 font-semibold">
                                Ethereal Whispers
                            </span>
                            <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#e5654b]/30 to-transparent mx-auto my-3" />
                            <p className="text-xs text-[#8c6d62] uppercase tracking-[0.25em] font-medium">Special Love Invitation</p>
                        </div>
                        
                        {/* 3D Wax Seal Envelope Button */}
                        <div className="relative w-[180px] h-[120px] flex items-center justify-center my-6" style={{ transform: 'translateZ(50px)' }}>
                            <div className="absolute inset-0 bg-[#faebf0] rounded-xl border border-white/60 shadow-lg flex items-center justify-center overflow-hidden">
                                <div className="absolute top-0 left-0 w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-t-[60px] border-t-white/40 origin-top transition-transform duration-700" style={{
                                    transform: scene === 'envelope-opening' ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                    zIndex: 5
                                }} />
                                <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[90px] border-l-white/20 border-r-[90px] border-r-white/20 border-b-[60px] border-b-white/30 z-[3]" />
                            </div>
                            
                            {/* Golden Wax Seal */}
                            <button
                                onClick={handleBreakSeal}
                                disabled={scene === 'envelope-opening'}
                                className="absolute z-10 w-16 h-16 rounded-full shadow-[0_4px_12px_rgba(229,101,75,0.35)] transition-all hover:scale-108 active:scale-95 flex items-center justify-center cursor-pointer select-none outline-none"
                                style={{
                                    background: 'radial-gradient(circle at 35% 35%, #ffe6a3 0%, #d4af37 50%, #aa7c11 90%, #855f05 100%)',
                                    border: '2px solid rgba(255, 255, 255, 0.4)',
                                    touchAction: 'none'
                                }}
                            >
                                <div className="absolute -inset-2.5 rounded-full border border-[#d4af37]/35 animate-pulseRing pointer-events-none" />
                                <div className="w-11 h-11 rounded-full border border-[#aa7c11]/40 flex items-center justify-center bg-black/5">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#855f05]/60 filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </div>
                            </button>
                        </div>
                        
                        <div className="relative z-10 mb-6 max-w-[260px]" style={{ transform: 'translateZ(30px)' }}>
                            <p className="text-xs text-[#8c6d62]/80 leading-relaxed font-light">
                                Ketuk segel lilin emas untuk memecahkan dan membuka persembahan cinta untukmu,
                            </p>
                            <span className="block text-sm font-semibold text-[#e5654b] mt-1.5">{card.recipient_name}</span>
                        </div>
                    </div>
                </div>
                </div>
            )}
            

            
            {/* ── SCENE 4: MAIN SCROLL FLOW (SCROLL LETTER & SCRAPBOOK WITH SCRATCH-OFF) ── */}
            {scene === 'scroll' && (
                <div className={scrollSubScene === 'letter'
                    ? "fixed inset-0 z-30 flex flex-col items-center justify-center p-4 overflow-y-auto"
                    : "relative w-full flex flex-col items-center justify-start px-4 pt-10 z-30 pb-28"
                }>
                    
                    {/* ── SUB-SCENE 4.1: SCROLL LETTER ── */}
                    {scrollSubScene === 'letter' && (
                        <div className="w-full flex flex-col items-center animate-fadeInFast">
                            <div className="relative w-full max-w-xl bg-[#fffcf9] border border-[#f5dae2]/60 rounded-3xl p-8 sm:p-12 shadow-xl overflow-hidden" style={{
                                backgroundImage: 'radial-gradient(rgba(229,101,75,0.02) 1px, transparent 0)',
                                backgroundSize: '16px 16px',
                                boxShadow: '0 20px 45px rgba(229,101,75,0.06), inset 0 0 40px rgba(250,235,240,0.4)',
                            }}>
                                {/* Corner Gold decors */}
                                <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#e5654b]/30 rounded-tl-lg" />
                                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#e5654b]/30 rounded-tr-lg" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#e5654b]/30 rounded-bl-lg" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#e5654b]/30 rounded-br-lg" />
                                
                                {/* Letter Header */}
                                <div className="text-center mb-8">
                                    <span style={{ fontFamily: "'Parisienne', cursive" }} className="text-3xl text-[#e5654b]">
                                        {typeGreetingTitle[card.type] || "Happy Anniversary"}
                                    </span>
                                    <div className="text-[10px] font-semibold text-[#8c6d62] uppercase tracking-[0.2em] mt-1.5">
                                        Teruntuk {card.recipient_name}
                                    </div>
                                </div>
                                
                                {/* Writing Parchment Body */}
                                <div className="min-h-[180px] flex flex-col justify-center py-2 text-center">
                                    <h3 style={{ fontFamily: "'Dancing Script', cursive" }} className="text-2xl font-bold text-[#e5654b] mb-4 text-center">
                                        Teruntuk {card.recipient_name} tercinta,
                                    </h3>
                                    <p style={{ fontFamily: "'Dancing Script', cursive", lineHeight: '1.8' }} className="text-xl text-[#5c3e35] font-bold whitespace-pre-line leading-relaxed min-h-[120px] text-center">
                                        {typewriterText}
                                        {!isTypingComplete && (
                                            <span className="inline-block w-[2px] h-[1.1em] bg-[#e5654b] ml-1 align-middle animate-blink" />
                                        )}
                                    </p>
                                    <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-center text-lg text-[#e5654b] mt-8 font-semibold">
                                        Dari: {card.sender_name} 🌸
                                    </p>
                                </div>
                                
                                {/* Interactive Love Button */}
                                <div className="flex flex-col items-center justify-center border-t border-[#f5dae2] pt-8 mt-6">
                                    <button
                                        onClick={handleTapGlassHeart}
                                        className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/90 border border-[#f5dae2] shadow-[0_4px_12px_rgba(229,101,75,0.15)] hover:scale-110 active:scale-95 duration-200 cursor-pointer"
                                    >
                                        <span className="absolute inset-0 rounded-full bg-[#faebf0]/30 animate-ping pointer-events-none" />
                                        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#e5654b] drop-shadow-[0_2px_4px_rgba(229,101,75,0.25)]">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </button>
                                    <span className="text-[10px] text-[#8c6d62] uppercase tracking-wider mt-2.5 font-medium">Kirim Cinta 💗</span>
                                </div>
                            </div>

                            {/* Conditional Navigation Buttons (appears after typewriter finishes typing) */}
                            {isTypingComplete && (
                                <div className="flex mt-8 w-full max-w-xl justify-center animate-fadeInFast select-none">
                                    <button
                                        onClick={() => {
                                            playChimeNote(0.15);
                                            setScrollSubScene('scrapbook');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="relative group px-8 py-3.5 rounded-full bg-gradient-to-r from-[#e5654b] to-[#f08060] text-white text-sm font-semibold tracking-wide shadow-[0_6px_20px_rgba(229,101,75,0.3)] hover:shadow-[0_10px_25px_rgba(229,101,75,0.45)] hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer overflow-hidden border-none"
                                    >
                                        <div className="btn-shine-effect" />
                                        <span className="flex items-center gap-2">
                                            <span>Buka Jurnal Memori</span>
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:translate-x-1">
                                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* ── SUB-SCENE 4.2: REDESIGNED MEMORY SCRAPBOOK ── */}
                    {scrollSubScene === 'scrapbook' && (
                        <div className="w-full flex flex-col items-center animate-fadeInFast">
                            <div className="w-full max-w-xl text-center">
                                <h2 style={{ fontFamily: "'Parisienne', cursive" }} className="text-4xl text-[#e5654b] mb-1">Our Memory Jurnal</h2>
                                <p className="text-[10px] tracking-[3px] uppercase text-[#8c6d62] mb-10">Jalinan Scrapbook Memori Fisik</p>
                                
                                {/* The Scattered Scrapbook Workspace */}
                                <div className="relative w-full h-[460px] bg-[#fffaf5] rounded-3xl border border-[#faebf0] shadow-inner overflow-hidden p-6">
                                    
                                    {/* Scrapbook texture overlay (vintage grid) */}
                                    <div className="absolute inset-0 pointer-events-none opacity-5" style={{
                                        backgroundImage: 'radial-gradient(#3d2218 1px, transparent 1px)',
                                        backgroundSize: '18px 18px'
                                    }} />
                                    
                                    {/* Scattered dried rose petals & gold pins decor */}
                                    <div className="absolute top-8 left-[10%] text-2xl rotate-12 opacity-80 select-none">🌸</div>
                                    <div className="absolute bottom-10 left-[8%] text-xl -rotate-45 opacity-60 select-none">🌸</div>
                                    <div className="absolute bottom-24 right-[12%] text-2xl rotate-90 opacity-70 select-none">🌸</div>
                                    <div className="absolute top-10 right-[15%] text-lg -rotate-12 opacity-40 select-none">🌸</div>
                                    
                                    {/* Aesthetic Handwritten Note on Scrapbook */}
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/70 border border-[#f5dae2]/40 rounded-lg px-4 py-2 text-[10px] text-[#8c6d62]/80 uppercase tracking-widest font-semibold shadow-sm select-none" style={{ fontFamily: "'Dancing Script', cursive", transform: 'translateX(-50%) rotate(-2deg)' }}>
                                        "Sapu daun sakura di atas untuk membuka kenangan... 🌸"
                                    </div>
                                    
                                    {/* 3 Layered scattered Polaroid Photos */}
                                    {displayPhotos.map((url, idx) => {
                                        const isActive = activePolaroidIdx === idx;
                                        
                                        const scrapStyles = [
                                            {
                                                left: '10%',
                                                top: '24%',
                                                transform: isActive 
                                                    ? 'rotate(0deg) scale(1.12) translateZ(40px)' 
                                                    : 'rotate(-10deg) scale(0.92) translateZ(0)',
                                                zIndex: isActive ? 40 : 10,
                                                washi: 'left-1/3 -top-2.5 rotate-[-12deg]'
                                            },
                                            {
                                                left: '37%',
                                                top: '19%',
                                                transform: isActive 
                                                    ? 'rotate(0deg) scale(1.12) translateZ(40px)' 
                                                    : 'rotate(4deg) scale(0.95) translateZ(0)',
                                                zIndex: isActive ? 40 : 20,
                                                washi: 'left-1/3 -top-3 rotate-[3deg]'
                                            },
                                            {
                                                left: '64%',
                                                top: '24%',
                                                transform: isActive 
                                                    ? 'rotate(0deg) scale(1.12) translateZ(40px)' 
                                                    : 'rotate(12deg) scale(0.90) translateZ(0)',
                                                zIndex: isActive ? 40 : 15,
                                                washi: 'left-1/3 -top-2.5 rotate-[15deg]'
                                            }
                                        ];
                                        
                                        const style = scrapStyles[idx];
                                        
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => {
                                                    playChimeNote();
                                                    if (isActive) {
                                                        setActivePhoto(url);
                                                    } else {
                                                        setActivePolaroidIdx(idx);
                                                    }
                                                }}
                                                className={`absolute w-[125px] sm:w-[145px] bg-white rounded-lg p-2.5 pb-8 shadow-[0_8px_20px_rgba(0,0,0,0.12)] border border-gray-100 cursor-pointer select-none transition-all duration-500 ease-out transform-style-3d hover:shadow-[0_15px_30px_rgba(229,101,75,0.18)] ${
                                                    isActive ? 'ring-2 ring-[#e5654b]/30 font-semibold' : 'hover:scale-98 opacity-90'
                                                }`}
                                                style={{
                                                    left: style.left,
                                                    top: style.top,
                                                    transform: style.transform,
                                                    zIndex: style.zIndex,
                                                }}
                                            >
                                                {/* Golden Clip Pin decoration overlay */}
                                                {idx === 1 && (
                                                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-30 w-7 h-5 flex items-center justify-center bg-transparent pointer-events-none">
                                                        <div className="w-1.5 h-6 rounded-full border-2 border-[#d4af37] bg-[#fdf8f5] shadow-xs" />
                                                    </div>
                                                )}
                                                
                                                {/* Vintage patterned washi tape decor */}
                                                {idx !== 1 && (
                                                    <div className={`absolute z-30 w-12 h-3.5 bg-[#f5dae2]/55 border border-white/60 shadow-xs pointer-events-none ${style.washi}`} style={{
                                                        backgroundImage: 'repeating-linear-gradient(45deg, #faebf0, #faebf0 4px, #fdf8f5 4px, #fdf8f5 8px)'
                                                    }} />
                                                )}
                                                
                                                {/* Photo Inner container (Daun di luar bingkai, jadi foto bersih) */}
                                                <div className="w-full aspect-square rounded-sm overflow-hidden bg-gray-50 border border-gray-100 relative group">
                                                    <img src={url} alt="Memory Jurnal" className="w-full h-full object-cover block pointer-events-none" />
                                                    
                                                    {/* Zoom Hover indicator */}
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 flex items-center justify-center py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                        <span className="text-[7px] text-white tracking-wider uppercase font-semibold">Perbesar 🔍</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Retro handwritten caption label */}
                                                <div style={{ fontFamily: "'Dancing Script', cursive" }} className="text-center text-[10px] text-[#8c6d62] font-bold mt-2 truncate w-full select-none">
                                                    Memory {idx + 1}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Unified Interactive Leaf-Sweep Canvas Overlay */}
                                    {!isScrapbookCleared && (
                                        <canvas
                                            ref={scrapbookCanvasRef}
                                            onMouseDown={handleScrapbookPointerDown}
                                            onMouseMove={handleScrapbookPointerMove}
                                            onMouseUp={handleScrapbookPointerUp}
                                            onMouseLeave={handleScrapbookPointerUp}
                                            onTouchStart={handleScrapbookPointerDown}
                                            onTouchMove={handleScrapbookPointerMove}
                                            onTouchEnd={handleScrapbookPointerUp}
                                            className="absolute inset-0 w-full h-full z-[45] cursor-crosshair transition-opacity duration-700 pointer-events-auto rounded-3xl"
                                            style={{ touchAction: 'none' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons for Scrapbook */}
                            <div className="flex gap-4 mt-8 w-full max-w-xl justify-center animate-fadeInFast select-none">
                                <button
                                    onClick={() => {
                                        playChimeNote(-0.05);
                                        setScrollSubScene('letter');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="relative group px-6 py-3 rounded-full border border-[#e5654b]/35 bg-white/80 text-[#e5654b] text-sm font-semibold tracking-wide shadow-sm hover:bg-[#faebf0]/40 hover:border-[#e5654b] hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    <div className="btn-shine-effect" />
                                    <span className="flex items-center gap-2">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:-translate-x-1">
                                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                                        </svg>
                                        <span>Kembali ke Surat</span>
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        playChimeNote(0.1);
                                        setIsRibbonTied(false);
                                        setKnotBurstActive(false);
                                        setFloatingCelebrationItems([]);
                                        setIsScrapbookCleared(false);
                                        setScrollSubScene('letter');
                                        setScene('envelope');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="relative group px-6 py-3 rounded-full bg-[#faebf0] border border-[#f5dae2] text-[#e5654b] text-sm font-semibold tracking-wide shadow-sm hover:bg-[#fbd3e0] hover:shadow-md hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    <div className="btn-shine-effect" />
                                    <span className="flex items-center gap-2">
                                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-500 group-hover:rotate-180">
                                            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                        </svg>
                                        <span>Putar Ulang</span>
                                    </span>
                                </button>
                            </div>

                            {/* ── ROMANTIC SIGNATURE FOOTER ── */}
                            <div className="w-full max-w-xl mt-20 text-center animate-fadeIn pb-12 border-t border-[#f5dae2] pt-8">
                                <span style={{ fontFamily: "'Parisienne', cursive" }} className="block text-4xl text-[#e5654b] mb-2">Tied Forever with Love</span>
                                <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-xl text-[#8c6d62] font-semibold">
                                    Dari: {card.sender_name} • Untuk: {card.recipient_name} 🌸
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* ── SCENE 2: DEDICATED FULLSCREEN LOVE RED THREAD (THE ETERNITY KNOT) ── */}
            {scene === 'eternity-knot' && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-[#fdf8f5] overflow-y-auto animate-fadeIn select-none">
                    {/* Soft Ambient Rose Gold Vignette */}
                    <div className="absolute inset-0 pointer-events-none z-0" style={{
                        background: 'radial-gradient(circle, rgba(250, 235, 240, 0.75) 0%, rgba(245, 218, 226, 0.6) 60%, rgba(253, 248, 245, 0.95) 100%)',
                    }} />



                    <div className="relative z-20 w-full max-w-md flex flex-col items-center text-center">
                        <div className="mb-6">
                            <span style={{ fontFamily: "'Parisienne', cursive" }} className="block text-4xl text-red-600 mb-1">Eternity Thread</span>
                            <p className="text-[10px] tracking-[3px] uppercase text-[#8c6d62] font-semibold">Pita Simpul Cinta Abadi</p>
                        </div>
                        
                        {/* Interactive Rope Knot SVG Box */}
                        <div 
                            onPointerDown={handleRopeDragStart}
                            onTouchStart={handleRopeDragStart}
                            draggable="false"
                            className={`w-64 h-36 relative flex items-center justify-center mb-8 bg-white/40 border border-white/50 rounded-2xl shadow-sm backdrop-blur-xs p-4 select-none cursor-grab active:cursor-grabbing touch-none ${isDraggingRope ? 'scale-102 ring-2 ring-red-300/35 shadow-md' : ''}`}
                            style={{ 
                                userSelect: 'none', 
                                WebkitUserSelect: 'none',
                                transform: `translateY(${dragOffset * 0.25}px)`,
                                transition: isDraggingRope ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.15), scale 0.3s, box-shadow 0.3s'
                            }}
                        >
                            <svg viewBox="0 0 200 100" className="w-full h-full select-none" draggable="false" style={{ overflow: 'visible', userSelect: 'none', WebkitUserSelect: 'none' }}>
                                <defs>
                                    {/* Soft drop shadow filter for 3D depth */}
                                    <filter id="ropeShadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0.5" dy="1.5" stdDeviation="1.2" floodColor="#3d2218" floodOpacity="0.25" />
                                    </filter>
                                    {/* Radial gradient for realistic gold bead */}
                                    <radialGradient id="goldBead" cx="35%" cy="35%" r="65%">
                                        <stop offset="0%" stopColor="#fff2cc" />
                                        <stop offset="30%" stopColor="#ffd966" />
                                        <stop offset="75%" stopColor="#e6b800" />
                                        <stop offset="100%" stopColor="#b38f00" />
                                    </radialGradient>
                                </defs>

                                {/* Left loose dangling / tied thread path */}
                                {renderRope(
                                    isRibbonTied 
                                        ? "M 10 80 Q 60 45, 100 50" 
                                        : `M 10 80 Q ${40 + dragOffset * 0.3} ${90 + dragOffset * 0.3}, ${leftEndX} ${leftEndY}`,
                                    isDraggingRope ? "" : "transition-all duration-[600ms] ease-out"
                                )}

                                {/* Right loose dangling / tied thread path */}
                                {renderRope(
                                    isRibbonTied 
                                        ? "M 190 80 Q 140 45, 100 50" 
                                        : `M 190 80 Q ${160 - dragOffset * 0.3} ${90 + dragOffset * 0.3}, ${rightEndX} ${rightEndY}`,
                                    isDraggingRope ? "" : "transition-all duration-[600ms] ease-out"
                                )}

                                {/* Flowing ribbon ends hanging down (Only visible when tied) */}
                                {renderRope(
                                    "M 100 50 Q 80 80, 70 95",
                                    `transition-all duration-[1500ms] ease-out ${isRibbonTied ? 'opacity-100' : 'opacity-0'}`
                                )}
                                {renderRope(
                                    "M 100 50 Q 120 80, 130 95",
                                    `transition-all duration-[1500ms] ease-out ${isRibbonTied ? 'opacity-100' : 'opacity-0'}`
                                )}
                                
                                {/* The Elegant Love Knot Bow loops */}
                                {isRibbonTied && (
                                    <>
                                        {renderRope(
                                            "M 100 50 C 80 20, 50 35, 70 55 C 80 65, 90 55, 100 50",
                                            "animate-scaleIn origin-center",
                                            { animationDelay: '100ms' }
                                        )}
                                        {renderRope(
                                            "M 100 50 C 120 20, 150 35, 130 55 C 120 65, 110 55, 100 50",
                                            "animate-scaleIn origin-center",
                                            { animationDelay: '200ms' }
                                        )}
                                    </>
                                )}
                                
                                {/* Gold Knot Center Core (3D Spherical Bead, follows drag) */}
                                <circle 
                                    cx="100" 
                                    cy={beadY} 
                                    r={isRibbonTied ? "7.5" : "5.5"} 
                                    fill={isRibbonTied ? "url(#goldBead)" : "#ffd966"} 
                                    stroke={isRibbonTied ? "#b38f00" : "#aa7c11"}
                                    strokeWidth="1.5"
                                    className={`filter drop-shadow-[0_2px_4px_rgba(61,34,24,0.25)] ${isDraggingRope ? "" : "transition-all duration-[600ms] ease-out"}`}
                                />
                            </svg>
                            
                            {/* Sparkle ring animation on tie */}
                            {knotBurstActive && (
                                <div className="absolute w-16 h-16 rounded-full border-2 border-red-500/40 animate-ping z-20 pointer-events-none" />
                            )}
                        </div>

                        {/* Interactive Blessing Card / Book */}
                        <div className={`w-full bg-[#fffcf9] border border-[#f5dae2]/60 rounded-3xl p-8 shadow-xl overflow-hidden text-center flex flex-col items-center transition-all duration-1000 transform ${
                            isRibbonTied ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-55 translate-y-4'
                        }`} style={{
                            backgroundImage: 'radial-gradient(rgba(229,101,75,0.015) 1px, transparent 0)',
                            backgroundSize: '14px 14px',
                            boxShadow: '0 20px 40px rgba(229,101,75,0.05)',
                        }}>
                            {!isRibbonTied ? (
                                <div className="py-4 flex flex-col items-center">
                                    <p className="text-xs text-[#8c6d62] leading-relaxed font-light mb-6 px-4">
                                        Sentuh dan seret manik-manik emas ke bawah secara sakral untuk mengikat benang takdir cinta kita berdua selamanya.
                                    </p>
                                    
                                    {/* Draggable indicator arrow/finger animation */}
                                    <div className="flex flex-col items-center gap-1.5 animate-bounceIllustrate">
                                        <span className="text-xl">👇</span>
                                        <span className="text-[8px] uppercase tracking-widest text-red-500 font-semibold">Tarik Ke Bawah</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-scaleIn">
                                    <span style={{ fontFamily: "'Parisienne', cursive" }} className="block text-3xl text-red-600 mb-4 pointer-events-none">Eternity Love Tied</span>
                                    
                                    <p style={{ fontFamily: "'Dancing Script', cursive", lineHeight: '1.8' }} className="text-xl text-[#3d2218] font-bold px-2 whitespace-pre-line leading-relaxed">
                                        "Semoga ikatan cinta dan benang takdir senantiasa merajut hati kita menjadi satu simpul abadi, melangkah berdua mengarungi waktu hingga ke jannah-Nya... 💗"
                                    </p>
                                    
                                    <div className="h-[1px] w-20 bg-red-600/35 mx-auto mt-6 mb-5" />
                                    
                                    <button
                                        onClick={handleProceedToScroll}
                                        className="relative group px-8 py-3.5 rounded-full text-white text-sm font-semibold tracking-wide bg-gradient-to-r from-red-500 to-red-600 hover:shadow-[0_6px_20px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-98 transition-all duration-300 cursor-pointer overflow-hidden border-none"
                                    >
                                        <div className="btn-shine-effect" />
                                        <span className="flex items-center gap-2">
                                            <span>Buka Lembaran Kisah</span>
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform duration-300 group-hover:translate-x-1">
                                                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Restart / Reset journey button */}
                        {isRibbonTied && (
                            <button
                                onClick={() => {
                                    playChimeNote(0.1);
                                    setIsRibbonTied(false);
                                    setKnotBurstActive(false);
                                    setFloatingCelebrationItems([]);
                                    setScene('envelope');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="mt-8 text-xs text-[#8c6d62]/70 hover:text-red-500 tracking-widest uppercase transition-colors"
                            >
                                Putar Ulang Perjalanan ↺
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {/* ── PHOTO ZOOM PREVIEW MODAL ── */}
            {activePhoto && (
                <div onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeInFast">
                    <div className="relative max-w-sm w-full bg-white p-3 pb-12 rounded-lg shadow-2xl animate-scaleIn">
                        <button onClick={() => setActivePhoto(null)} className="absolute -top-12 right-0 text-white border border-white/20 bg-white/10 px-3 py-1 rounded-full text-xs tracking-wider uppercase font-medium cursor-pointer">
                            Tutup [X]
                        </button>
                        <div className="w-full aspect-square overflow-hidden bg-gray-50 border border-gray-150 rounded shadow-inner">
                            <img src={activePhoto} alt="Scrapbook Capture" className="w-full h-full object-cover block" />
                        </div>
                        <div style={{ fontFamily: "'Dancing Script', cursive" }} className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center text-xs text-[#8c6d62] font-bold">
                            "Kenangan Termanis Kita ❤️"
                        </div>
                    </div>
                </div>
            )}
            
            {/* Screen Portrait locked Alert */}
            {isLandscapeLocked && !dismissWarning && (
                <div className="fixed inset-0 z-[9999] bg-[#fdf8f5] flex flex-col items-center justify-center text-center p-6 text-[#3d2218]">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#e5654b] mb-6 animate-rotatePhone">
                        <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3-3H7V4h10v14z"/>
                    </svg>
                    <h2 className="text-xl font-bold mb-2">Disarankan Putar Layar Anda</h2>
                    <p className="text-sm text-gray-500 max-w-xs mb-8">Gunakan mode landscape (horizontal) untuk menikmati pertunjukan visual terbaik.</p>
                    <button onClick={() => setDismissWarning(true)} className="px-6 py-2.5 rounded-full text-white text-xs font-semibold tracking-wider uppercase border-none bg-[#e5654b] hover:bg-[#c24b33] transition-all">
                        Tetap Lanjutkan ➔
                    </button>
                </div>
            )}
            
            <style>{`
                @keyframes ewRiseUp {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.95; }
                    90% { opacity: 0.95; }
                    100% { transform: translateY(-110vh) rotate(45deg); opacity: 0; }
                }
                @keyframes ewRiseLantern {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    8% { opacity: 1; }
                    90% { opacity: 0.85; }
                    100% { transform: translateY(-120vh) translateX(var(--sway-offset, 15px)); opacity: 0; }
                }
                .animate-fadeInFast {
                    animation: fadeIn 0.35s ease-out forwards;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes scaleIn {
                    0% { transform: scale(0.92); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes sway {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(3deg) scale(1.03); }
                }
                .animate-sway {
                    animation: sway 15s ease-in-out infinite;
                }
                .btn-shine-effect {
                    position: absolute;
                    inset: 0;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
                    transform: translateX(-150%) skewX(-25deg);
                    pointer-events: none;
                }
                .group:hover .btn-shine-effect {
                    animation: btnShine 0.85s ease-out;
                }
                @keyframes btnShine {
                    0% { transform: translateX(-150%) skewX(-25deg); }
                    100% { transform: translateX(250%) skewX(-25deg); }
                }
            `}</style>
        </div>
    );
}



function DetailedRocketSVG({ glowColor = "rgba(34,211,238,0.85)", isIgnited = false }) {
    return (
        <svg viewBox="0 0 64 120" style={{ width: '100%', height: '100%' }}>
            <defs>
                <linearGradient id="cdNoseGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                </linearGradient>
                <linearGradient id="cdBodyGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="35%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="cdFinGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="cdNozzleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <linearGradient id="cdWindowBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="100%" stopColor="#0c4a6e" />
                </linearGradient>
                <filter id="cdGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            
            {/* Fin Shadows */}
            <path d="M20,95 L8,95 C11,85 17,75 22,70 Z" fill="rgba(15,23,42,0.15)" />
            <path d="M44,95 L56,95 C53,85 47,75 42,70 Z" fill="rgba(15,23,42,0.15)" />

            {/* Side Fin Left */}
            <path d="M22,70 C16,72 8,85 8,96 C14,97 20,95 22,92 Z" fill="url(#cdFinGradient)" />
            {/* Side Fin Right */}
            <path d="M42,70 C48,72 56,85 56,96 C50,97 44,95 42,92 Z" fill="url(#cdFinGradient)" />

            {/* Center Fin (Stabilizer) */}
            <path d="M30,92 L34,92 L35,102 L29,102 Z" fill="url(#cdNozzleGradient)" />

            {/* Nozzle */}
            <path d="M26,92 L38,92 L36,99 L28,99 Z" fill="url(#cdNozzleGradient)" />

            {/* Main Rocket Cylinder Body */}
            <path d="M22,42 L42,42 C43,62 43,80 42,92 L22,92 C21,80 21,62 22,42 Z" fill="url(#cdBodyGradient)" />

            {/* Nose Cone */}
            <path d="M32,6 C37,18 42,30 42,42 L22,42 C22,30 27,18 32,6 Z" fill="url(#cdNoseGradient)" />

            {/* Metallic Panel lines */}
            <line x1="32" y1="42" x2="32" y2="92" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="22" y1="62" x2="42" y2="62" stroke="rgba(15,23,42,0.18)" strokeWidth="1" />
            <line x1="22" y1="78" x2="42" y2="78" stroke="rgba(15,23,42,0.18)" strokeWidth="1" />

            {/* Window */}
            <circle cx="32" cy="56" r="7" fill="url(#cdWindowBg)" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cdGlow)" />
            <path d="M28,52 A5,5 0 0 1 35,54" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Warning indicator light */}
            <circle cx="32" cy="85" r="1.5" fill="#f43f5e" />
        </svg>
    );
}



function CosmicDriftFull({ card }) {
    const starsRef      = useRef(null);
    const nebulaRef     = useRef(null);
    const constRef      = useRef(null);
    const audioCtxRef   = useRef(null);
    const masterGainRef = useRef(null);
    
    // Web Audio active synthesis tracking refs
    const audioTimerRef = useRef(null);
    const droneNodesRef = useRef([]);

    const [opened, setOpened]                 = useState(false);
    const [isPlaying, setIsPlaying]           = useState(false);
    const [warpActive, setWarpActive]         = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [bubbles, setBubbles]               = useState([]);
    const [coords, setCoords]                 = useState('03°22\'14"S  116°44\'09"E  ALT: 408KM');
    const [activePhoto, setActivePhoto]       = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [launchState, setLaunchState]       = useState('cover');

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
                const parts = m.split(/[.\n;!]+/).map(p => p.trim()).filter(p => p.length > 3 && p.length < 50);
                if (parts.length > 0) {
                    msgs.push(...parts);
                } else {
                    if (m.length < 50) msgs.push(m);
                }
            });
        }
        
        // Also add the primary wish strings in the mix
        msgs.push(
            `Selamat ${card.type_label || 'Hari Spesial'} ✨`,
            `Untuk ${card.recipient_name} tercinta ❤️`,
            `Dari ${card.sender_name} ✨`
        );
        
        return [...new Set(msgs)];
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
                color: `hsla(${[190, 220, 260, 325][Math.floor(Math.random() * 4)]}, 85%, 75%, `,
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
            ctx.fillStyle = warpActive ? 'rgba(2, 8, 23, 0.14)' : '#020817';
            ctx.fillRect(0, 0, W, H);

            // Interpolate speed smoothly
            if (warpActive) {
                currentSpeed += (80 - currentSpeed) * 0.08;
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
                    // Warp speed lines stretching radially outward (even longer with higher speed)
                    const prevK = 400 / (s.z + currentSpeed * 2.2);
                    const ppx = s.x * prevK + W / 2 + mx * (1 - (s.z + currentSpeed * 2.2) / W);
                    const ppy = s.y * prevK + H / 2 + my * (1 - (s.z + currentSpeed * 2.2) / W);

                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(ppx, ppy);
                    // Dynamically shifting colors during warp speeds
                    ctx.strokeStyle = `hsla(${(s.hue + Date.now() * 0.08) % 360}, 95%, 85%, ${s.brightness * 0.9})`;
                    ctx.lineWidth = s.size * 2.2;
                    ctx.stroke();
                } else {
                    // Normal floating twinkling stars
                    ctx.beginPath();
                    ctx.arc(px, py, s.size * (1 + 0.12 * Math.sin(Date.now() * 0.004 + s.z)), 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, 80%, 92%, ${s.brightness})`;
                    ctx.fill();

                    if (s.size > 1.2) {
                        const g = ctx.createRadialGradient(px, py, 0, px, py, s.size * 3.5);
                        g.addColorStop(0, `hsla(${s.hue}, 80%, 85%, ${s.brightness * 0.25})`);
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
                    ctx.strokeStyle = `rgba(255,255,255,${a})`;
                    ctx.lineWidth = a * 1.8; ctx.stroke();
                }
                ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${ss.life})`; ctx.fill();
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

    // ── Nebula canvas & Rotating Spiral Galaxy ──
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

        // Generate Spiral Galaxy particles
        const numGalaxyStars = 1200;
        const galaxyStars = [];
        for (let i = 0; i < numGalaxyStars; i++) {
            const rVal = Math.pow(Math.random(), 2.2); // Concentrated near the core
            const arm = Math.random() < 0.5 ? 0 : 1;
            const tightness = 4.2; // Number of arm wraps
            const theta = (arm * Math.PI) + (rVal * tightness) + (Math.random() - 0.5) * 0.48;
            const size = Math.random() * 1.4 + 0.35;
            
            // Color mapping based on distance from core
            let hue, sat = 90, light = 88;
            if (rVal < 0.12) {
                hue = 45; // Bright gold/white core
                light = 95;
            } else if (rVal < 0.45) {
                hue = 195 + Math.random() * 20; // Cyan arms
            } else if (rVal < 0.8) {
                hue = 300 + Math.random() * 30; // Magenta / Pink arms
            } else {
                hue = 245 + Math.random() * 20; // Deep Violet outskirts
                sat = 75;
                light = 75;
            }
            
            const orbitSpeed = 0.00035 + (0.00025 * (1 - rVal));
            
            galaxyStars.push({
                rVal,
                theta,
                size,
                hue,
                sat,
                light,
                brightness: 0.45 + Math.random() * 0.55,
                orbitSpeed
            });
        }

        const blobs = [
            { cx: W*0.3, cy: H*0.3, rx: W*0.55, ry: H*0.55, hue: 220, alpha: 0.12, t: 0, speed: 0.0003 },
            { cx: W*0.7, cy: H*0.6, rx: W*0.5,  ry: H*0.5,  hue: 270, alpha: 0.09, t: 1, speed: 0.0004 },
            { cx: W*0.5, cy: H*0.5, rx: W*0.65, ry: H*0.65, hue: 200, alpha: 0.07, t: 2, speed: 0.0002 },
            { cx: W*0.2, cy: H*0.7, rx: W*0.35, ry: H*0.35, hue: 310, alpha: 0.06, t: 3, speed: 0.0005 },
        ];

        // Inclination / Tilt properties
        const inclination = 62 * (Math.PI / 180); // 62 degrees 3D tilt
        const rotationAngle = -28 * (Math.PI / 180); // Angle of galaxy on screen
        const cosInc = Math.cos(inclination);
        const sinInc = Math.sin(inclination);
        const cosRot = Math.cos(rotationAngle);
        const sinRot = Math.sin(rotationAngle);

        const draw = () => {
            animId = requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H);
            
            // Draw ambient nebula blobs
            blobs.forEach(b => {
                b.t += b.speed;
                const wobble = Math.sin(b.t) * 0.1;
                const rx = b.rx * (1 + wobble);
                const ry = b.ry * (1 - wobble * 0.5);
                const g = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, Math.max(rx, ry));
                g.addColorStop(0,   `hsla(${b.hue},80%,50%,${b.alpha})`);
                g.addColorStop(0.4, `hsla(${b.hue+20},70%,35%,${b.alpha*0.5})`);
                g.addColorStop(1,   'transparent');
                ctx.save();
                ctx.translate(b.cx, b.cy);
                ctx.scale(rx / Math.max(rx,ry), ry / Math.max(rx,ry));
                ctx.beginPath(); ctx.arc(0, 0, Math.max(rx,ry), 0, Math.PI*2);
                ctx.fillStyle = g; ctx.fill();
                ctx.restore();
            });

            // Draw Galaxy Core Glow
            const galaxyCenterX = W * 0.5;
            const galaxyCenterY = H * 0.42;
            const maxRadius = Math.min(W, H) * 0.42;

            const coreGlow = ctx.createRadialGradient(galaxyCenterX, galaxyCenterY, 0, galaxyCenterX, galaxyCenterY, maxRadius * 0.22);
            coreGlow.addColorStop(0, 'rgba(255, 245, 220, 0.45)');
            coreGlow.addColorStop(0.2, 'rgba(167, 139, 250, 0.2)');
            coreGlow.addColorStop(0.5, 'rgba(34, 211, 238, 0.08)');
            coreGlow.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(galaxyCenterX, galaxyCenterY, maxRadius * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = coreGlow;
            ctx.fill();

            // Draw Galaxy Stars
            galaxyStars.forEach(s => {
                s.theta += s.orbitSpeed;
                const currentR = s.rVal * maxRadius;
                
                // 2D position in coordinate plane
                const x2D = currentR * Math.cos(s.theta);
                const y2D = currentR * Math.sin(s.theta);
                
                // Project Y coordinate for 3D tilt
                const xTilted = x2D;
                const yTilted = y2D * cosInc;
                
                // Rotate on screen plane & offset to center
                const finalX = xTilted * cosRot - yTilted * sinRot + galaxyCenterX;
                const finalY = xTilted * sinRot + yTilted * cosRot + galaxyCenterY;

                if (finalX >= 0 && finalX <= W && finalY >= 0 && finalY <= H) {
                    ctx.beginPath();
                    ctx.arc(finalX, finalY, s.size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${s.brightness})`;
                    ctx.fill();
                    
                    if (s.size > 1.15 && Math.random() < 0.1) {
                        ctx.beginPath();
                        ctx.arc(finalX, finalY, s.size * 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, ${s.light}%, ${s.brightness * 0.12})`;
                        ctx.fill();
                    }
                }
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

    // ── Floating wishes bubbles (Spawning a lot, flying all over the screen) ──
    useEffect(() => {
        if (!opened || !contentVisible) return;
        let idx = 0;
        const spawn = () => {
            if (floatMessages.length === 0) return;
            const msg = floatMessages[idx % floatMessages.length];
            idx++;
            const id  = Math.random().toString(36).slice(2);
            const dur = 9 + Math.random() * 5; // Float duration 9s - 14s
            setBubbles(prev => [...prev, {
                id, msg,
                left: `${3 + Math.random() * 92}%`, // Scatter completely across full screen width
                bottom: `-12vh`, // Start below the viewport
                dur,
                scale: 0.82 + Math.random() * 0.4,
                drift: (Math.random() - 0.5) * 80
            }]);
            setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), dur * 1000 + 500);
        };

        // Stagger spawn initial batch of messages (14 bubbles)
        for (let i = 0; i < 14; i++) {
            setTimeout(spawn, i * 350);
        }

        // Spawn a new bubble quickly (every 750ms) to create a rich stardust stream
        const intv = setInterval(spawn, 750);
        return () => clearInterval(intv);
    }, [opened, contentVisible, floatMessages]);

    // ── Rotating alternating photos timer ──
    useEffect(() => {
        if (!opened || !contentVisible || !card.photos || card.photos.length === 0) return;
        const interval = setInterval(() => {
            setCurrentPhotoIndex(prev => (prev + 1) % card.photos.length);
        }, 6200); // Shift photo every 6.2s
        return () => clearInterval(interval);
    }, [opened, contentVisible, card.photos]);

    // ── Live coordinates ticker ──
    useEffect(() => {
        let tick = 0;
        const intv = setInterval(() => {
            tick++;
            setCoords(`03°22'${14 + (tick%6)}"S  116°44'${9 + (tick%9)}"E  ALT: ${408 + (tick%3)}KM`);
        }, 1800);
        return () => clearInterval(intv);
    }, []);

    // ── Cleanup function for Web Audio ──
    const cleanupAudioNodes = () => {
        if (audioTimerRef.current) {
            clearTimeout(audioTimerRef.current);
            audioTimerRef.current = null;
        }
        if (droneNodesRef.current) {
            droneNodesRef.current.forEach(node => {
                try { node.stop(); } catch (e) {}
                try { node.disconnect(); } catch (e) {}
            });
            droneNodesRef.current = [];
        }
    };

    // Auto cleanup audio on unmount
    useEffect(() => {
        return () => {
            cleanupAudioNodes();
            if (audioCtxRef.current) {
                try { audioCtxRef.current.close(); } catch (e) {}
            }
        };
    }, []);

    // ── Start Audio Engine (Stellar Odyssey Theme only) ──
    const startAudio = (withWarp = false) => {
        if (!window.AudioContext && !window.webkitAudioContext) return;
        if (audioTimerRef.current) return;

        let ctx = audioCtxRef.current;
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            audioCtxRef.current = ctx;
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Setup master gain
        let master = masterGainRef.current;
        if (!master) {
            master = ctx.createGain();
            master.gain.setValueAtTime(0, ctx.currentTime);
            master.connect(ctx.destination);
            masterGainRef.current = master;
        }

        // Fade in master volume
        master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);

        // 1. Warp transition sweep sound effect
        if (withWarp) {
            try {
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
            } catch (e) {}
        }

        // 2. Warm Celestial Space Drone (Loops forever)
        try {
            cleanupAudioNodes(); // Safety clear
            droneNodesRef.current = [];
            
            [65.41, 98.00, 130.81].forEach(freq => {
                const osc = ctx.createOscillator();
                const gn = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gn.gain.setValueAtTime(0.08, ctx.currentTime);
                osc.connect(gn);
                gn.connect(master);
                osc.start();
                droneNodesRef.current.push(osc);
            });
        } catch (e) {}

        // 3. Space Chimes Sequencer (Inspired by Interstellar theme)
        // Progression: Am -> F -> C -> G
        const chords = [
            [220.00, 261.63, 329.63, 440.00], // Am (A3, C4, E4, A4)
            [174.61, 261.63, 349.23, 440.00], // F (F3, C4, F4, A4)
            [261.63, 329.63, 392.00, 523.25], // C (C4, E4, G4, C5)
            [196.00, 293.66, 392.00, 493.88]  // G (G3, D4, G4, B4)
        ];

        let chordIdx = 0;
        let noteIdx = 0;

        const playStep = () => {
            if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;

            try {
                const now = ctx.currentTime;
                const currentChord = chords[chordIdx];
                const freq = currentChord[noteIdx % currentChord.length];

                const synthOsc = ctx.createOscillator();
                const synthGain = ctx.createGain();

                synthOsc.type = 'triangle';
                synthOsc.frequency.setValueAtTime(freq, now);

                synthGain.gain.setValueAtTime(0, now);
                synthGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
                synthGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

                const delayNode = ctx.createDelay();
                delayNode.delayTime.setValueAtTime(0.28, now);
                const feedbackNode = ctx.createGain();
                feedbackNode.gain.setValueAtTime(0.4, now);

                synthOsc.connect(synthGain);
                synthGain.connect(master);

                synthGain.connect(delayNode);
                delayNode.connect(feedbackNode);
                feedbackNode.connect(master);
                feedbackNode.connect(delayNode);

                synthOsc.start(now);
                synthOsc.stop(now + 1.8);
            } catch (e) {}

            noteIdx++;
            if (noteIdx % 8 === 0) {
                chordIdx = (chordIdx + 1) % chords.length;
            }

            audioTimerRef.current = setTimeout(playStep, 380);
        };
        playStep();

        setIsPlaying(true);
    };

    const toggleAudio = () => {
        let ctx = audioCtxRef.current;
        if (!ctx) {
            startAudio(false);
            return;
        }

        const master = masterGainRef.current;
        if (!master) return;

        if (isPlaying) {
            master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
            setIsPlaying(false);
        } else {
            master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);
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
        setLaunchState('launching');
        startAudio(true);
        
        // Launching rocket for 1.2s
        setTimeout(() => {
            setLaunchState('warp');
            setWarpActive(true);
            
            // Swirling wormhole warp speed for 1.8s (this preserves the warp lines!)
            setTimeout(() => {
                setWarpActive(false);
                setLaunchState('target'); // target planet lockdown appears
                
                // Rocket crashes towards planet for 1.2s
                setTimeout(() => {
                    setLaunchState('explosion');
                    // Play synth crash explosion sound
                    if (audioCtxRef.current && masterGainRef.current) {
                        try {
                            const ctx = audioCtxRef.current;
                            const master = masterGainRef.current;
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            const filter = ctx.createBiquadFilter();
                            osc.type = 'sawtooth';
                            filter.type = 'lowpass';
                            filter.frequency.setValueAtTime(1000, ctx.currentTime);
                            filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.8);
                            gain.gain.setValueAtTime(0.45, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
                            osc.connect(filter);
                            filter.connect(gain);
                            gain.connect(master);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.8);
                        } catch(e) {}
                    }
                    
                    // Impact flash covers screen for 0.8s, then reveals main screen
                    setTimeout(() => {
                        setLaunchState('active');
                        setContentVisible(true);
                    }, 800);
                    
                }, 1200);
                
            }, 1800);
            
        }, 1200);
    };

    return (
        <div style={{ position:'fixed', inset:0, background:'#020817', overflow:'hidden', userSelect:'none', cursor:'crosshair' }}>
            {/* Canvas layers */}
            <canvas ref={starsRef}  style={{ position:'fixed', inset:0, zIndex:1, pointerEvents:'auto' }} />
            <canvas ref={nebulaRef} style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', mixBlendMode:'screen' }} />
            <canvas ref={constRef}  style={{ position:'fixed', inset:0, zIndex:3, pointerEvents:'none' }} />

            {/* Sci-Fi scanline grid overlay */}
            {opened && contentVisible && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 5,
                    pointerEvents: 'none',
                    background: 'linear-gradient(rgba(34, 211, 238, 0.015) 50%, rgba(0,0,0,0) 50%)',
                    backgroundSize: '100% 4px',
                }} />
            )}

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
                <div 
                    key={b.id} 
                    className="cosmic-float-item"
                    style={{
                        position:'fixed', 
                        zIndex:20, 
                        left:b.left, 
                        bottom:b.bottom, 
                        pointerEvents:'auto',
                        animation: `cdBubble ${b.dur}s ease-in-out forwards`,
                        '--cd-scale': b.scale,
                        '--cd-drift': `${b.drift}px`,
                        '--cd-drift-half': `${b.drift / 2}px`,
                    }}
                >
                    <div className="cosmic-bubble-content text-center" style={{
                        fontFamily:'"Exo 2", sans-serif', 
                        fontSize:'clamp(0.72rem, 2vw, 0.92rem)',
                        fontWeight: 600,
                        color:'rgba(255, 255, 255, 0.95)',
                        textShadow: '0 0 10px rgba(96, 165, 250, 0.6)',
                        maxWidth:'min(300px, 75vw)', 
                        lineHeight:1.75,
                        padding:'0.65rem 1.2rem',
                        background:'rgba(5, 13, 31, 0.68)', 
                        border:'1px solid rgba(96, 165, 250, 0.25)',
                        borderRadius:20, 
                        backdropFilter:'blur(12px)',
                        boxShadow: '0 0 15px rgba(96, 165, 250, 0.2)',
                        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.3s',
                    }}>
                        ✦ {b.msg} ✦
                    </div>
                </div>
            ))}

            {/* Alternating Shooting Star Photo Gallery */}
            {opened && contentVisible && card.photos && card.photos.length > 0 && (
                <div 
                    key={currentPhotoIndex}
                    style={{
                        position: 'fixed',
                        zIndex: 30,
                        top: '50%',
                        left: '50%',
                        marginLeft: '-110px', // Center offset (half of width 220px)
                        marginTop: '-135px',  // Center offset (half of height 270px)
                        pointerEvents: 'auto',
                        // Triggers alternating shooting star trajectories based on index!
                        animation: `cdShootDirection${currentPhotoIndex % 4} 6.2s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                    }}
                >
                    <div 
                        onClick={() => setActivePhoto(card.photos[currentPhotoIndex])}
                        style={{
                            position: 'relative',
                            width: '220px',
                            background: 'rgba(5, 13, 31, 0.72)',
                            backdropFilter: 'blur(20px)',
                            border: '1.5px solid rgba(34, 211, 238, 0.45)',
                            borderRadius: '16px',
                            padding: '8px 8px 24px 8px',
                            boxShadow: '0 0 40px rgba(34, 211, 238, 0.35)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.06) rotate(1deg)';
                            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.8)';
                            e.currentTarget.style.boxShadow = '0 0 50px rgba(34, 211, 238, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.45)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(34, 211, 238, 0.35)';
                        }}
                    >
                        {/* 3D Optical Illusion Planetary Ring */}
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left: '-24px',
                            right: '-24px',
                            height: '60px',
                            border: '3px solid rgba(34, 211, 238, 0.52)',
                            borderTopColor: 'transparent', // cuts off top edge to simulate card wrapping in 3D
                            borderRadius: '50%',
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none',
                            boxShadow: '0 5px 15px rgba(34, 211, 238, 0.35)',
                            animation: 'cdRingPulse 4s ease-in-out infinite alternate',
                            zIndex: 10,
                        }} />

                        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', marginBottom: '10px' }}>
                            <img src={card.photos[currentPhotoIndex]} alt="Celestial capture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {/* Subtle pixel scanlines overlay */}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(34, 211, 238, 0.05) 50%, rgba(0,0,0,0) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none' }} />
                        </div>
                        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.52rem', letterSpacing: '2px', color: 'rgba(34, 211, 238, 0.85)', display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
                            <span>SAT-CAM {currentPhotoIndex + 1}</span>
                            <span>ZOOM ACTIVE</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Rocket flight animation element (Target state) */}
            {launchState === 'target' && (
                <div className="fixed z-[950] animate-rocketCrash" style={{
                    left: '50%',
                    marginLeft: '-25px',
                    width: '50px',
                    height: '90px',
                    pointerEvents: 'none',
                }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', transform: 'rotate(135deg)' }}>
                        <DetailedRocketSVG isIgnited={true} />
                        {/* Rocket Engine Fire/Flame */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '14px',
                            height: '30px',
                            background: 'linear-gradient(to bottom, #ff9730, #ff3b30, transparent)',
                            borderRadius: '50%',
                            animation: 'cdRocketFlame 0.15s infinite alternate',
                            boxShadow: '0 0 15px #ff7e47, 0 0 30px #ff3b30',
                        }} />
                    </div>
                </div>
            )}

            {/* Rocket traveling in Warp tunnel */}
            {launchState === 'warp' && (
                <>
                    {/* Wormhole Vortex background & Concentric Warp Rings */}
                    <div className="fixed inset-0 z-[920] pointer-events-none overflow-hidden" style={{ background: '#020617' }}>
                        <div className="absolute inset-0" style={{
                            background: 'radial-gradient(circle at 50% 50%, #03001e 0%, #7303c0 50%, #ec38bc 80%, #020617 100%)',
                            opacity: 0.45,
                            filter: 'blur(35px)',
                            animation: 'cdWormholeTunnelGlow 6s ease-in-out infinite alternate',
                        }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1000px] max-h-[1000px] pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="absolute top-1/2 left-1/2 rounded-full border border-cyan-400/20"
                                    style={{
                                        transform: 'translate(-50%, -50%)',
                                        boxShadow: '0 0 30px rgba(34,211,238,0.1), inset 0 0 30px rgba(34,211,238,0.1)',
                                        animation: `cdWormholeRing 2s linear infinite`,
                                        animationDelay: `${i * 0.4}s`,
                                    }}
                                />
                            ))}
                        </div>
                        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{
                            background: 'conic-gradient(from 0deg, transparent, rgba(34,211,238,0.15) 25%, rgba(167,139,250,0.15) 50%, rgba(236,72,153,0.15) 75%, transparent 100%)',
                            transform: 'translate(-50%, -50%) rotate(0deg)',
                            animation: 'cdWormholeSpiral 3s linear infinite',
                            filter: 'blur(8px)',
                        }} />
                    </div>

                    {/* Traveling Rocket */}
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[950] pointer-events-none" style={{
                        width: '36px',
                        height: '68px',
                        animation: 'cdRocketWarpTravel 1.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                    }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <DetailedRocketSVG isIgnited={true} />
                            <div style={{
                                position: 'absolute',
                                bottom: '-18px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '10px',
                                height: '22px',
                                background: 'linear-gradient(to bottom, #ff9730, transparent)',
                                borderRadius: '50%',
                                boxShadow: '0 0 12px #ff9730',
                                animation: 'cdRocketFlame 0.15s infinite alternate',
                            }} />
                        </div>
                    </div>
                </>
            )}

            {/* Target Planet Lockdown (Target state visual overlay) */}
            {launchState === 'target' && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[930] flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-[140px] h-[140px] rounded-full" style={{
                        background: 'radial-gradient(circle at 30% 30%, #ec4899, #7c3aed 60%, #030712)',
                        boxShadow: '0 0 45px rgba(236, 72, 153, 0.65), 0 0 90px rgba(124, 58, 237, 0.4)',
                        animation: 'cdTargetPlanetReveal 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                    }} />
                    <div className="absolute w-[200px] h-[200px] border border-red-500/35 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="absolute text-[8px] font-mono tracking-[4px] text-red-500 font-bold uppercase mt-44 animate-pulse">
                        IMPACT IMMINENT
                    </div>
                </div>
            )}

            {/* Screen Impact Explosion Flash & Shockwave */}
            {launchState === 'explosion' && (
                <div className="fixed inset-0 z-[990] pointer-events-none flex items-center justify-center">
                    {/* Planet Shards flying apart */}
                    <div className="absolute w-[140px] h-[140px] flex items-center justify-center">
                        {[...Array(6)].map((_, i) => {
                            const angle = (i / 6) * Math.PI * 2;
                            const tx = Math.cos(angle) * 220;
                            const ty = Math.sin(angle) * 220;
                            const rot = Math.random() * 360 + 180;
                            return (
                                <div 
                                    key={i} 
                                    style={{
                                        position: 'absolute',
                                        width: '45px',
                                        height: '45px',
                                        background: 'radial-gradient(circle at 30% 30%, #ec4899, #7c3aed 70%)',
                                        clipPath: i % 3 === 0 ? 'polygon(0 0, 100% 0, 50% 100%)' : i % 3 === 1 ? 'polygon(50% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 100% 50%, 0 100%)',
                                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.7)',
                                        animation: 'cdPlanetShatter 0.8s cubic-bezier(0.1, 0.8, 0.2, 1) forwards',
                                        '--tx': `${tx}px`,
                                        '--ty': `${ty}px`,
                                        '--rot': `${rot}deg`,
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="rounded-full border-[8px] border-[#22d3ee]/80" style={{
                        animation: 'cdShockwave 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                    }} />
                    <div className="absolute inset-0 bg-white" style={{
                        animation: 'cdFlash 0.8s ease-out forwards',
                    }} />
                </div>
            )}

            {/* COVER SCREEN */}
            {launchState !== 'active' && launchState !== 'explosion' && (
                <div style={{ 
                    position:'fixed', inset:0, zIndex:900, 
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', 
                    background: launchState === 'target' ? 'transparent' : 'radial-gradient(ellipse at 50% 50%, #0a1628 0%, #020817 70%)',
                    transition: 'background 1s ease-in-out, opacity 0.5s ease-in-out',
                    opacity: launchState === 'warp' ? 0 : 1,
                    pointerEvents: launchState === 'cover' ? 'auto' : 'none',
                }}>
                    {/* Planet orbits */}
                    {launchState === 'cover' && [180,300,440].map(s => (
                        <div key={s} style={{ position:'absolute', width:s, height:s, borderRadius:'50%', border:`1px solid rgba(${s===180?'59,130,246':s===300?'168,85,247':'34,211,238'},.${s===180?25:s===300?15:10})`, animation:'cdRing 4s ease-in-out infinite', animationDelay:`${(s-180)/260*0.7}s` }} />
                    ))}
                    
                    {/* Cover text & launch button (fades and scale-shrinks out upon ignition) */}
                    <div style={{ 
                        position:'relative', zIndex:2, textAlign:'center', padding:'2rem', 
                        display:'flex', flexDirection:'column', alignItems:'center', gap:'1.5rem',
                        transition: 'opacity 0.6s ease-in-out, transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                        opacity: launchState === 'cover' ? 1 : 0,
                        transform: launchState === 'cover' ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-40px)',
                    }}>
                        {/* Rocket sitting on Launchpad (instead of simple planet) */}
                        <div style={{
                            position: 'relative',
                            width: '140px',
                            height: '180px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            animation: launchState === 'cover' ? 'cdRocketHover 3s ease-in-out infinite' : launchState === 'launching' ? 'cdLaunchPadShake 0.1s infinite' : 'none',
                        }}>
                            {/* Launch Pad Base */}
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                width: '100px',
                                height: '12px',
                                background: '#1e293b',
                                border: '2.5px solid #38bdf8',
                                borderRadius: '4px',
                                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                                zIndex: 5,
                                overflow: 'hidden',
                            }}>
                                {/* Hazard Stripes */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: 'linear-gradient(45deg, #f59e0b 25%, transparent 25%, transparent 50%, #f59e0b 50%, #f59e0b 75%, transparent 75%, transparent)',
                                    backgroundSize: '10px 10px',
                                    opacity: 0.25,
                                }} />
                            </div>

                            {/* Gantry Tower on the right */}
                            <div style={{
                                position: 'absolute',
                                bottom: '6px',
                                right: '16px',
                                width: '18px',
                                height: '115px',
                                background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)',
                                borderLeft: '1.5px solid #475569',
                                borderRight: '1.5px solid #475569',
                                zIndex: 4,
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                            }}>
                                {/* Gantry Truss diagonals */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundImage: 'linear-gradient(45deg, transparent 45%, #ef4444 48%, #ef4444 52%, transparent 55%), linear-gradient(-45deg, transparent 45%, #ef4444 48%, #ef4444 52%, transparent 55%)',
                                    backgroundSize: '18px 24px',
                                    opacity: 0.35,
                                }} />
                                {/* Flashing Amber Beacon Light at top of tower */}
                                <div style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: '#f59e0b',
                                    boxShadow: '0 0 10px #f59e0b',
                                    animation: 'cdWarningBeacon 0.5s infinite alternate',
                                }} />
                            </div>

                            {/* Top Support Arm (clamps rocket) */}
                            <div style={{
                                position: 'absolute',
                                bottom: '80px',
                                right: '28px',
                                width: '36px',
                                height: '6px',
                                background: '#334155',
                                border: '1px solid #64748b',
                                borderRadius: '2px',
                                transform: launchState === 'launching' ? 'rotate(75deg) translate(8px, -8px)' : 'rotate(0deg)',
                                transformOrigin: 'right center',
                                transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                                zIndex: 11,
                            }} />

                            {/* Bottom Support Arm (clamps rocket) */}
                            <div style={{
                                position: 'absolute',
                                bottom: '40px',
                                right: '28px',
                                width: '36px',
                                height: '6px',
                                background: '#334155',
                                border: '1px solid #64748b',
                                borderRadius: '2px',
                                transform: launchState === 'launching' ? 'rotate(75deg) translate(8px, -8px)' : 'rotate(0deg)',
                                transformOrigin: 'right center',
                                transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                                zIndex: 11,
                            }} />
                            
                            {/* The Rocket vector illustration */}
                            <div style={{ 
                                position: 'absolute', 
                                bottom: '8px', 
                                width: '54px', 
                                height: '120px',
                                zIndex: 10,
                                animation: launchState === 'launching' ? 'cdLiftoffShoot 1.2s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards' : 'none',
                            }}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <DetailedRocketSVG isIgnited={launchState === 'launching'} />
                                    
                                    {/* Engine Flame (flies with rocket) */}
                                    {launchState === 'launching' && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-28px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '16px',
                                            height: '35px',
                                            background: 'linear-gradient(to bottom, #ff9730, #ff3b30, transparent)',
                                            borderRadius: '50%',
                                            boxShadow: '0 0 15px #ff9730, 0 0 30px #ff3b30',
                                            animation: 'cdRocketFlame 0.1s infinite alternate',
                                            zIndex: 1
                                        }} />
                                    )}
                                </div>
                            </div>

                            {/* Heavy Billowing Launch Smoke (stays on ground) */}
                            {launchState === 'launching' && (
                                <div style={{ position: 'absolute', bottom: '6px', width: '100%', height: '20px', zIndex: 12 }}>
                                    <div className="cd-smoke cd-smoke-l1" />
                                    <div className="cd-smoke cd-smoke-l2" />
                                    <div className="cd-smoke cd-smoke-r1" />
                                    <div className="cd-smoke cd-smoke-r2" />
                                </div>
                            )}

                            {/* Launch Pad Venting Smoke / Gas (cover mode) */}
                            {launchState === 'cover' && (
                                <div style={{ position: 'absolute', bottom: '6px', display: 'flex', gap: '40px', zIndex: 1 }}>
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/25 animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/25 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
                                </div>
                            )}
                        </div>

                        <div>
                            <p style={{ fontFamily:'Orbitron,monospace', fontSize:'0.52rem', letterSpacing:'6px', textTransform:'uppercase', color:'#22d3ee', opacity:0.7 }}>A Message From The Universe</p>
                            <h1 style={{ fontFamily:'Orbitron,monospace', fontSize:'clamp(1.8rem,7vw,3rem)', fontWeight:900, background:'linear-gradient(135deg,#60a5fa,#a78bfa,#67e8f9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:3, filter:'drop-shadow(0 0 18px rgba(96,165,250,.5))', lineHeight:1.1, marginTop:'0.5rem' }}>COSMIC<br/>DRIFT</h1>
                            <p style={{ fontFamily:'Exo 2,sans-serif', fontStyle:'italic', fontSize:'0.85rem', color:'rgba(255,255,255,.5)', maxWidth:270, lineHeight:1.7, marginTop:'0.75rem' }}>Sebuah surat cinta melewati bintang-bintang, khusus untuk <strong style={{ color:'#c4b5fd' }}>{card.recipient_name}</strong></p>
                        </div>
                        <button onClick={handleOpen} style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', padding:'0.9rem 2.4rem', background:'linear-gradient(135deg,#3b82f6,#7c3aed)', border:'none', borderRadius:100, fontFamily:'Orbitron,monospace', fontSize:'0.75rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', cursor:'pointer', boxShadow:'0 0 30px rgba(59,130,246,.5)', animation:'cdBtnGlow 3s ease-in-out infinite' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:16,height:16 }} className="animate-bounce"><path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 2C6.5 2 2 6.5 2 12c0 3.5 1.5 6.5 4 8.5M19.5 7.5c1.5-1.25 2.5-3.5 2.5-3.5s-2.25 1-3.5 2.5M22 2s-3.5.5-6 3.5M16 12l-6-6-4 4 6 6 4-4zM7 17l-3 3"/></svg>
                            Luncurkan Roket 🚀
                        </button>
                    </div>
                </div>
            )}

            {/* Futuristic Mute/Unmute HUD with Visualizer Wave */}
            {opened && contentVisible && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    pointerEvents: 'auto',
                    animation: 'cdContentFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(5, 12, 33, 0.76)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(34, 211, 238, 0.35)',
                    borderRadius: '100px',
                    padding: '0.65rem 1.6rem',
                    boxShadow: '0 0 25px rgba(34, 211, 238, 0.25)',
                }}>
                    <button 
                        onClick={toggleAudio} 
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            border: 'none',
                            background: 'transparent',
                            fontFamily: 'Orbitron, monospace',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            color: '#22d3ee',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:14, height:14 }}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                        {isPlaying ? 'MUTE AUDIO' : 'UNMUTE AUDIO'}
                    </button>

                    {/* Interactive Equalizer Visualizer Waves */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '14px', borderLeft: '1px solid rgba(34, 211, 238, 0.25)', paddingLeft: '12px', marginLeft: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                            <div 
                                key={i} 
                                style={{
                                    width: '2.5px',
                                    background: 'linear-gradient(to top, #3b82f6, #22d3ee)',
                                    borderRadius: '1px',
                                    height: isPlaying ? '100%' : '3px',
                                    transformOrigin: 'bottom center',
                                    animation: isPlaying ? `cdEqPulse 0.5s ease-in-out infinite alternate` : 'none',
                                    animationDelay: `${i * 0.1}s`,
                                }} 
                            />
                        ))}
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
                            boxShadow:'0 0 50px rgba(34, 211, 238,.25)',
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
                                boxShadow:'0 0 15px rgba(34, 211, 238,.3)'
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
                @keyframes cdEqPulse {
                    0% { transform: scaleY(0.25); }
                    100% { transform: scaleY(1.0); }
                }
                @keyframes cdRing { 0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.04);opacity:1} }
                @keyframes cdPlanet { 0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(5deg)} }
                @keyframes cdBtnGlow { 0%,100%{box-shadow:0 0 30px rgba(59,130,246,.5)}50%{box-shadow:0 0 50px rgba(124,58,237,.7)} }
                
                @keyframes cdBubble { 
                    0% {
                        opacity: 0;
                        transform: translateY(15vh) translateX(0) scale(var(--cd-scale, 1));
                    }
                    12% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 0.95;
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-120vh) translateX(var(--cd-drift, 30px)) scale(var(--cd-scale, 1));
                    }
                }

                @keyframes cdRingPulse {
                    0% { transform: rotate(-15deg) scale(0.96); opacity: 0.6; filter: drop-shadow(0 0 4px rgba(34, 211, 238, 0.4)); }
                    100% { transform: rotate(-15deg) scale(1.04); opacity: 0.95; filter: drop-shadow(0 0 12px rgba(34, 211, 238, 0.7)); }
                }

                .cosmic-float-item {
                    cursor: pointer;
                }
                .cosmic-float-item:hover {
                    animation-play-state: paused !important;
                    z-index: 99 !important;
                }
                .cosmic-float-item:hover .cosmic-bubble-content {
                    transform: scale(1.12);
                    border-color: rgba(34, 211, 238, 0.65) !important;
                    box-shadow: 0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.2) !important;
                }
                
                @keyframes cdContentFadeIn { 0%{opacity:0;transform:scale(0.9) translateY(18px);filter:blur(8px)}100%{opacity:1;transform:scale(1) translateY(0);filter:blur(0)} }
                
                @keyframes cdShootDirection0 {
                    0% {
                        transform: translate3d(-40vw, -40vh, 0) scale(0.01) rotate(-35deg);
                        opacity: 0;
                        filter: blur(4px) brightness(2.5);
                    }
                    14% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(-4deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    82% {
                        transform: translate3d(2vw, 2vh, 0) scale(1.06) rotate(-2deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    100% {
                        transform: translate3d(40vw, 40vh, 0) scale(4.0) rotate(15deg);
                        opacity: 0;
                        filter: blur(6px) brightness(2);
                    }
                }
                
                @keyframes cdShootDirection1 {
                    0% {
                        transform: translate3d(40vw, -40vh, 0) scale(0.01) rotate(35deg);
                        opacity: 0;
                        filter: blur(4px) brightness(2.5);
                    }
                    14% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(4deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    82% {
                        transform: translate3d(-2vw, 2vh, 0) scale(1.06) rotate(2deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    100% {
                        transform: translate3d(-40vw, 40vh, 0) scale(4.0) rotate(-15deg);
                        opacity: 0;
                        filter: blur(6px) brightness(2);
                    }
                }
                
                @keyframes cdShootDirection2 {
                    0% {
                        transform: translate3d(-40vw, 40vh, 0) scale(0.01) rotate(-145deg);
                        opacity: 0;
                        filter: blur(4px) brightness(2.5);
                    }
                    14% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(-6deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    82% {
                        transform: translate3d(2vw, -2vh, 0) scale(1.06) rotate(-4deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    100% {
                        transform: translate3d(40vw, -40vh, 0) scale(4.0) rotate(15deg);
                        opacity: 0;
                        filter: blur(6px) brightness(2);
                    }
                }
                
                @keyframes cdShootDirection3 {
                    0% {
                        transform: translate3d(40vw, 40vh, 0) scale(0.01) rotate(145deg);
                        opacity: 0;
                        filter: blur(4px) brightness(2.5);
                    }
                    14% {
                        transform: translate3d(0, 0, 0) scale(1) rotate(6deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    82% {
                        transform: translate3d(-2vw, -2vh, 0) scale(1.06) rotate(4deg);
                        opacity: 1;
                        filter: blur(0px) brightness(1);
                    }
                    100% {
                        transform: translate3d(-40vw, -40vh, 0) scale(4.0) rotate(-15deg);
                        opacity: 0;
                        filter: blur(6px) brightness(2);
                    }
                }

                @keyframes fadeIn { 0%{opacity:0}100%{opacity:1} }
                @keyframes scaleIn { 0%{opacity:0;transform:scale(0.85) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)} }

                @keyframes cdWarningBeacon {
                    0% { opacity: 0.3; filter: drop-shadow(0 0 1px #f59e0b); }
                    100% { opacity: 1; filter: drop-shadow(0 0 8px #f59e0b); }
                }

                .cd-smoke {
                    position: absolute;
                    background: radial-gradient(circle, rgba(203,213,225,0.7) 0%, rgba(148,163,184,0.3) 50%, rgba(71,85,105,0) 70%);
                    border-radius: 50%;
                    pointer-events: none;
                }
                .cd-smoke-l1 {
                    width: 50px;
                    height: 50px;
                    left: 20px;
                    bottom: 0px;
                    animation: cdSmokeLeft1 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .cd-smoke-l2 {
                    width: 40px;
                    height: 40px;
                    left: 35px;
                    bottom: 5px;
                    animation: cdSmokeLeft2 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .cd-smoke-r1 {
                    width: 50px;
                    height: 50px;
                    right: 20px;
                    bottom: 0px;
                    animation: cdSmokeRight1 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .cd-smoke-r2 {
                    width: 40px;
                    height: 40px;
                    right: 35px;
                    bottom: 5px;
                    animation: cdSmokeRight2 1.0s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes cdSmokeLeft1 {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; filter: blur(2px); }
                    15% { opacity: 0.8; }
                    100% { transform: translate(-65px, -25px) scale(1.8); opacity: 0; filter: blur(14px); }
                }
                @keyframes cdSmokeLeft2 {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; filter: blur(2px); }
                    15% { opacity: 0.7; }
                    100% { transform: translate(-45px, -40px) scale(1.5); opacity: 0; filter: blur(12px); }
                }
                @keyframes cdSmokeRight1 {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; filter: blur(2px); }
                    15% { opacity: 0.8; }
                    100% { transform: translate(65px, -25px) scale(1.8); opacity: 0; filter: blur(14px); }
                }
                @keyframes cdSmokeRight2 {
                    0% { transform: translate(0, 0) scale(0.5); opacity: 0; filter: blur(2px); }
                    15% { opacity: 0.7; }
                    100% { transform: translate(45px, -40px) scale(1.5); opacity: 0; filter: blur(12px); }
                }

                @keyframes cdWormholeTunnelGlow {
                    0% { transform: scale(1) rotate(0deg); opacity: 0.4; }
                    100% { transform: scale(1.15) rotate(10deg); opacity: 0.6; }
                }

                @keyframes cdWormholeRing {
                    0% { width: 0px; height: 0px; opacity: 0; border-color: rgba(34, 211, 238, 0.05); }
                    10% { opacity: 0.8; }
                    80% { opacity: 0.5; border-color: rgba(167, 139, 250, 0.35); }
                    100% { width: 900px; height: 900px; opacity: 0; border-color: rgba(236, 72, 153, 0); }
                }

                @keyframes cdWormholeSpiral {
                    0% { transform: translate(-50%, -50%) rotate(0deg) scale(0.9); }
                    50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.1); }
                    100% { transform: translate(-50%, -50%) rotate(360deg) scale(0.9); }
                }

                @keyframes cdRocketFlame {
                    0% { height: 25px; opacity: 0.8; }
                    100% { height: 40px; opacity: 1; }
                }

                @keyframes cdRocketHover {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes cdLaunchPadShake {
                    0%, 100% { transform: translate(0, 0); }
                    25% { transform: translate(-1.5px, 1.5px); }
                    50% { transform: translate(1.5px, -1.5px); }
                    75% { transform: translate(-1.5px, -1.5px); }
                }

                @keyframes cdLiftoffShoot {
                    0% { transform: translateY(0) scale(1); filter: blur(0px); }
                    20% { transform: translateY(-12px) scale(1); filter: blur(0px); }
                    100% { transform: translateY(-130vh) scale(0.25); filter: blur(2px); }
                }

                @keyframes cdRocketWarpTravel {
                    0% { transform: translate3d(-50%, 130px, 0) scale(1.6) rotate(0deg); opacity: 0; filter: blur(4px); }
                    12% { transform: translate3d(-50%, 25px, 0) scale(1.0) rotate(0deg); opacity: 1; filter: blur(0px); }
                    30% { transform: translate3d(calc(-50% + 15px), -5px, 0) scale(0.8) rotate(4deg); }
                    55% { transform: translate3d(calc(-50% - 15px), -25px, 0) scale(0.5) rotate(-6deg); }
                    80% { transform: translate3d(calc(-50% + 5px), -45px, 0) scale(0.25) rotate(2deg); opacity: 0.8; }
                    100% { transform: translate3d(-50%, -85px, 0) scale(0.01) rotate(0deg); opacity: 0; filter: blur(6px); }
                }

                @keyframes cdRocketCrash {
                    0% { transform: translate3d(-35vw, -35vh, 0) scale(0.1) rotate(135deg); opacity: 0; filter: blur(3px); }
                    15% { opacity: 1; filter: blur(0px); }
                    100% { transform: translate3d(-20px, -20px, 0) scale(0.8) rotate(135deg); opacity: 1; }
                }

                @keyframes cdTargetPlanetReveal {
                    0% { transform: scale(0.1); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }

                @keyframes cdPlanetShatter {
                    0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.15); opacity: 0; }
                }

                @keyframes cdShockwave {
                    0% { width: 0px; height: 0px; opacity: 1; border-width: 30px; }
                    100% { width: 1000px; height: 1000px; opacity: 0; border-width: 1px; filter: blur(6px); }
                }

                @keyframes cdFlash {
                    0% { opacity: 1; background: #ffffff; }
                    25% { opacity: 0.85; background: #22d3ee; }
                    100% { opacity: 0; background: transparent; }
                }
            `}</style>
        </div>
    );
}


function RetroArcadeFull({ card }) {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const bgmIntervalRef = useRef(null);
    const heroXRef = useRef(80);
    const heroYRef = useRef(240);
    const heroVyRef = useRef(0);
    const blockBounceRef = useRef(0);
    const isJumpingRef = useRef(false);
    const particlesRef = useRef([]);

    // Scrolling gameplay variables
    const scrollXRef = useRef(0);
    const scoreRef = useRef(0);
    const coinsRef = useRef(0);
    const walkFrameRef = useRef(0);

    const [credit, setCredit] = useState(0);
    const [gameStage, setGameStage] = useState('cover'); // 'cover' | 'playing' | 'revealed'
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);

    const mainMessage = card.messages?.[0] || 'HAPPY LEVEL UP! Semoga hari-harimu selalu seru dan penuh keceriaan seperti game retro klasik ini!';

    // Sound Synthesis (Web Audio API)
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playCoinSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        } catch(e) {}
    };

    const playJumpSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.15);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch(e) {}
    };

    const playBumpSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(120, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch(e) {}
    };

    const playVictorySound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                gain.gain.setValueAtTime(0.06, now + idx * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.1);
                osc.stop(now + idx * 0.1 + 0.35);
            });
        } catch(e) {}
    };

    const startBgm = () => {
        if (bgmIntervalRef.current) clearInterval(bgmIntervalRef.current);
        const ctx = initAudio();
        let step = 0;
        
        // Classic upbeat 8-bit Mario-style arpeggio progression with triangle bassline
        const melody = [
            329.63, 329.63, 0, 329.63, 0, 261.63, 329.63, 0,
            392.00, 0, 0, 0, 196.00, 0, 0, 0,
            261.63, 0, 0, 196.00, 0, 0, 164.81, 0,
            220.00, 0, 246.94, 0, 233.08, 220.00, 0, 0
        ];
        
        const bass = [
            130.81, 130.81, 130.81, 130.81, 196.00, 196.00, 196.00, 196.00,
            164.81, 164.81, 164.81, 164.81, 220.00, 220.00, 220.00, 246.94
        ];
        
        bgmIntervalRef.current = setInterval(() => {
            if (isMuted || gameStage === 'cover') return;
            try {
                const now = ctx.currentTime;
                
                // Melody pulse/square channel
                const freq = melody[step % melody.length];
                if (freq > 0) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.02, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.2);
                }
                
                // Bass triangle channel (every 2 steps)
                if (step % 2 === 0) {
                    const bassFreq = bass[Math.floor(step / 2) % bass.length];
                    const bassOsc = ctx.createOscillator();
                    const bassGain = ctx.createGain();
                    bassOsc.type = 'triangle';
                    bassOsc.frequency.setValueAtTime(bassFreq, now);
                    bassGain.gain.setValueAtTime(0.03, now);
                    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    bassOsc.connect(bassGain);
                    bassGain.connect(ctx.destination);
                    bassOsc.start(now);
                    bassOsc.stop(now + 0.4);
                }
                
                step++;
            } catch(e){}
        }, 150); // Faster tempo for arcade hype!
    };

    const stopBgm = () => {
        if (bgmIntervalRef.current) {
            clearInterval(bgmIntervalRef.current);
            bgmIntervalRef.current = null;
        }
    };

    // Handle Mute Toggle
    const handleMuteToggle = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (!nextMute) {
            initAudio();
            if (gameStage !== 'cover') {
                startBgm();
            }
        } else {
            stopBgm();
        }
    };

    // Insert Coin Trigger
    const handleInsertCoin = () => {
        playCoinSound();
        setCredit(c => c + 1);
        setTimeout(() => {
            setGameStage('playing');
            if (!isMuted) startBgm();
        }, 600);
    };

    // Game loop (Canvas)
    useEffect(() => {
        if (gameStage !== 'playing') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        canvas.width = 480;
        canvas.height = 320;

        heroXRef.current = 80;
        heroYRef.current = 240;
        heroVyRef.current = 0;
        isJumpingRef.current = false;
        particlesRef.current = [];

        scrollXRef.current = 0;
        scoreRef.current = 0;
        coinsRef.current = 0;
        walkFrameRef.current = 0;

        const levelEnd = 2200; // Point where scrolling stops
        const blockX = 2440;   // Block level position
        const blockY = 160;
        const blockW = 32;
        const blockH = 32;

        let hasHitBlock = false;

        const coins = [
            { x: 300, y: 180, collected: false },
            { x: 340, y: 160, collected: false },
            { x: 380, y: 180, collected: false },
            { x: 650, y: 170, collected: false },
            { x: 690, y: 150, collected: false },
            { x: 730, y: 170, collected: false },
            { x: 1000, y: 180, collected: false },
            { x: 1040, y: 180, collected: false },
            { x: 1250, y: 150, collected: false },
            { x: 1290, y: 130, collected: false },
            { x: 1330, y: 150, collected: false },
            { x: 1550, y: 180, collected: false },
            { x: 1600, y: 180, collected: false },
            { x: 1850, y: 160, collected: false },
            { x: 1890, y: 140, collected: false },
            { x: 1930, y: 160, collected: false },
        ];

        const spikes = [
            { x: 500, y: 260 },
            { x: 880, y: 260 },
            { x: 1150, y: 260 },
            { x: 1480, y: 260 },
            { x: 1750, y: 260 },
            { x: 2100, y: 260 },
        ];

        const clouds = [
            { x: 100, y: 50, w: 50, speed: 0.2 },
            { x: 300, y: 80, w: 70, speed: 0.15 },
            { x: 600, y: 40, w: 60, speed: 0.25 },
            { x: 900, y: 70, w: 80, speed: 0.18 },
            { x: 1200, y: 60, w: 50, speed: 0.2 },
            { x: 1500, y: 90, w: 75, speed: 0.15 },
            { x: 1800, y: 50, w: 65, speed: 0.22 },
            { x: 2100, y: 80, w: 85, speed: 0.17 },
            { x: 2400, y: 60, w: 55, speed: 0.2 },
        ];

        const update = () => {
            // Apply gravity to jump
            if (isJumpingRef.current) {
                heroYRef.current += heroVyRef.current;
                heroVyRef.current += 0.8; // gravity
                if (heroYRef.current >= 240) {
                    heroYRef.current = 240;
                    isJumpingRef.current = false;
                    heroVyRef.current = 0;
                }
            }

            // Game progress (scrolling or final run to the block)
            if (scrollXRef.current < levelEnd) {
                // Scroll level
                scrollXRef.current += 2.2;
                walkFrameRef.current += 0.16;

                // Auto-jump spike logic
                spikes.forEach(spike => {
                    const screenSpikeX = spike.x - scrollXRef.current;
                    if (screenSpikeX > 80 && screenSpikeX < 145 && !isJumpingRef.current) {
                        isJumpingRef.current = true;
                        heroVyRef.current = -11.5;
                        playJumpSound();
                    }
                });

                // Spikes points score bonus
                spikes.forEach(spike => {
                    if (!spike.passed) {
                        const screenSpikeX = spike.x - scrollXRef.current;
                        if (screenSpikeX < 80) {
                            spike.passed = true;
                            scoreRef.current += 200;
                        }
                    }
                });

                // Collect coins logic
                coins.forEach(coin => {
                    if (!coin.collected) {
                        const screenCoinX = coin.x - scrollXRef.current;
                        const dx = (heroXRef.current + 12) - (screenCoinX + 8);
                        const dy = (heroYRef.current + 8) - (coin.y + 8);
                        const dist = Math.sqrt(dx*dx + dy*dy);
                        if (dist < 24) {
                            coin.collected = true;
                            playCoinSound();
                            scoreRef.current += 100;
                            coinsRef.current += 1;
                            // sparkle particles
                            for (let i = 0; i < 5; i++) {
                                particlesRef.current.push({
                                    x: screenCoinX + 8,
                                    y: coin.y + 8,
                                    vx: (Math.random() - 0.5) * 3,
                                    vy: (Math.random() - 0.5) * 3,
                                    size: Math.random() * 2 + 1.5,
                                    color: '#fbbf24',
                                    life: 1,
                                    decay: 0.05
                                });
                            }
                        }
                    }
                });
            } else {
                // Scrolling stopped, hero walks to the Golden Mystery Block
                const screenBlockX = blockX - scrollXRef.current; // blockX = 2440, scrollX = 2200 => screenBlockX = 240
                
                if (!hasHitBlock) {
                    if (heroXRef.current < screenBlockX) {
                        heroXRef.current += 2.0;
                        walkFrameRef.current += 0.16;
                    } else {
                        // Under the block! Trigger jump
                        if (!isJumpingRef.current) {
                            isJumpingRef.current = true;
                            heroVyRef.current = -12.0;
                            playJumpSound();
                        }
                    }
                }
            }

            // Collision check with block (bottom check)
            if (isJumpingRef.current && heroVyRef.current < 0 && !hasHitBlock) {
                const screenBlockX = blockX - scrollXRef.current;
                const headX = heroXRef.current + 12;
                const headY = heroYRef.current;
                if (headX >= screenBlockX && headX <= screenBlockX + blockW && headY <= blockY + blockH && headY >= blockY) {
                    // HIT!
                    hasHitBlock = true;
                    heroVyRef.current = 3; // Bounce back down
                    blockBounceRef.current = -12;
                    playVictorySound();

                    // Massive explosion of retro colored particles!
                    const pCols = ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#ec4899', '#a78bfa'];
                    for (let i = 0; i < 70; i++) {
                        particlesRef.current.push({
                            x: screenBlockX + 16,
                            y: blockY + 16,
                            vx: (Math.random() - 0.5) * 9,
                            vy: (Math.random() - 0.8) * 11,
                            size: Math.random() * 5 + 2.5,
                            color: pCols[Math.floor(Math.random() * pCols.length)],
                            life: 1.5,
                            decay: 0.015 + Math.random() * 0.015
                        });
                    }

                    // Proceed to revealed stage shortly
                    setTimeout(() => {
                        setGameStage('revealed');
                        stopBgm();
                    }, 2500);
                }
            }

            // Animate block bounce back
            if (blockBounceRef.current < 0) {
                blockBounceRef.current += 1.5;
            } else {
                blockBounceRef.current = 0;
            }

            // Update particles
            particlesRef.current.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // gravity
                p.life -= p.decay;
                if (p.life <= 0) {
                    particlesRef.current.splice(idx, 1);
                }
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Sky (Midnight arcade purple/blue)
            ctx.fillStyle = '#090715';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw clouds with parallax scrolling speed
            clouds.forEach(c => {
                const screenCloudX = (c.x - scrollXRef.current * c.speed) % (canvas.width + 120);
                const x = (screenCloudX < -60) ? canvas.width + 60 + screenCloudX : screenCloudX - 60;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
                ctx.fillRect(x, c.y, c.w, 16);
                ctx.fillRect(x + 10, c.y - 8, c.w - 20, 8);
                ctx.fillRect(x + 5, c.y + 16, c.w - 10, 6);
            });

            // Draw ground (pixelated green line)
            ctx.fillStyle = '#10b981';
            ctx.fillRect(0, 260, canvas.width, 60);
            ctx.fillStyle = '#047857';
            ctx.fillRect(0, 260, canvas.width, 6);

            // Draw spikes
            spikes.forEach(spike => {
                const screenSpikeX = spike.x - scrollXRef.current;
                if (screenSpikeX > -30 && screenSpikeX < canvas.width + 30) {
                    ctx.fillStyle = '#94a3b8'; // iron grey
                    for (let s = 0; s < 3; s++) {
                        const sx = screenSpikeX + s * 10;
                        ctx.beginPath();
                        ctx.moveTo(sx, 260);
                        ctx.lineTo(sx + 5, 244);
                        ctx.lineTo(sx + 10, 260);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            });

            // Draw coins
            coins.forEach(coin => {
                if (!coin.collected) {
                    const screenCoinX = coin.x - scrollXRef.current;
                    if (screenCoinX > -20 && screenCoinX < canvas.width + 20) {
                        ctx.fillStyle = '#fbbf24';
                        const coinWidth = 8 + 4 * Math.sin(Date.now() / 100);
                        ctx.beginPath();
                        ctx.ellipse(screenCoinX + 8, coin.y + 8, coinWidth / 2, 8, 0, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.fillStyle = '#d97706';
                        ctx.beginPath();
                        ctx.ellipse(screenCoinX + 8, coin.y + 8, Math.max(1, (coinWidth - 4) / 2), 5, 0, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            });

            // Draw Mystery Block
            const screenBlockX = blockX - scrollXRef.current;
            if (screenBlockX > -50 && screenBlockX < canvas.width + 50) {
                ctx.save();
                ctx.translate(0, blockBounceRef.current);
                ctx.fillStyle = hasHitBlock ? '#475569' : '#fbbf24';
                ctx.fillRect(screenBlockX, blockY, blockW, blockH);
                if (!hasHitBlock) {
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(screenBlockX, blockY, blockW, blockH);
                    ctx.fillStyle = '#78350f';
                    ctx.font = 'bold 20px "Courier New", monospace';
                    ctx.fillText('?', screenBlockX + 10, blockY + 23);
                }
                ctx.restore();
            }

            // Draw Hero (Cute 8-bit character)
            // walk leg movement offsets
            const legOffset = (!isJumpingRef.current && Math.floor(walkFrameRef.current) % 2 === 0) ? 2 : -2;
            
            ctx.fillStyle = '#ef4444'; // Red shirt
            ctx.fillRect(heroXRef.current + 4, heroYRef.current, 16, 20);
            ctx.fillStyle = '#f59e0b'; // Head skin
            ctx.fillRect(heroXRef.current + 6, heroYRef.current - 10, 12, 10);
            ctx.fillStyle = '#000000'; // Eyes
            ctx.fillRect(heroXRef.current + 14, heroYRef.current - 8, 2, 2);
            ctx.fillStyle = '#1e3a8a'; // Pants
            ctx.fillRect(heroXRef.current + 4, heroYRef.current + 20, 16, 4);
            // Feet with walking offset
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(heroXRef.current + 3 + legOffset, heroYRef.current + 24, 6, 2);
            ctx.fillRect(heroXRef.current + 13 - legOffset, heroYRef.current + 24, 6, 2);

            // Draw particles
            particlesRef.current.forEach(p => {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            ctx.globalAlpha = 1.0;

            // Draw HUD
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px "Courier New", monospace';
            ctx.fillText(`SCORE: ${String(scoreRef.current).padStart(6, '0')}`, 15, 20);
            ctx.fillText(`COINS: ${String(coinsRef.current).padStart(2, '0')}`, 380, 20);
        };

        const loop = () => {
            update();
            draw();
            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
        };
    }, [gameStage]);

    // Typewriter message
    useEffect(() => {
        if (gameStage !== 'revealed') return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);
        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [gameStage]);

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center p-4 bg-[#04020d] text-white select-none">
            {/* CRT TV Filter Bezel */}
            <div className="absolute inset-0 pointer-events-none z-50 crt-screen" style={{
                background: 'radial-gradient(circle, transparent 70%, rgba(0,0,0,0.65) 100%)',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)'
            }} />
            <div className="absolute inset-0 pointer-events-none z-50 scanlines" />

            {/* Mute Button */}
            <button 
                onClick={handleMuteToggle} 
                style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 60,
                    border: '2px solid #10b981', background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981', padding: '0.4rem 0.8rem', fontFamily: 'monospace',
                    fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px'
                }}
            >
                {isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}
            </button>

            {/* COVER SCREEN */}
            {gameStage === 'cover' && (
                <div className="relative flex flex-col items-center justify-center text-center p-6 border-4 border-dashed border-purple-500 bg-[#0d0726]/90 rounded-2xl max-w-sm w-full z-10"
                    style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}>
                    <div style={{ fontSize: '3rem', animation: 'bounceArcade 1s infinite alternate' }}>🎮</div>
                    <h1 className="text-3xl font-extrabold tracking-wider text-green-400 mb-2 mt-4" style={{ fontFamily: 'monospace', textShadow: '0 0 10px #10b981' }}>
                        RETRO ARCADE
                    </h1>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#c084fc', marginBottom: '2rem' }}>
                        INSERT COIN TO START THE MISSION
                    </p>

                    <button 
                        onClick={handleInsertCoin}
                        className="px-6 py-3 bg-[#fbbf24] text-amber-950 font-bold border-4 border-amber-600 rounded-lg active:scale-95 transition-transform"
                        style={{ fontFamily: 'monospace', fontSize: '1rem', boxShadow: '0 4px 0 #b45309' }}
                    >
                        🪙 INSERT COIN
                    </button>
                    
                    <div className="mt-4 text-xs text-slate-400" style={{ fontFamily: 'monospace' }}>
                        CREDITS: {credit}
                    </div>
                </div>
            )}

            {/* PLAYING SCREEN */}
            {gameStage === 'playing' && (
                <div className="relative flex flex-col items-center justify-center z-10 border-4 border-[#334155] rounded-xl overflow-hidden bg-[#090d16]">
                    <div className="w-full bg-[#1e293b] px-4 py-1 text-center font-bold tracking-widest text-[#fbbf24] border-b-2 border-slate-600 text-xs" style={{ fontFamily: 'monospace' }}>
                        MISSION 1: BREAK THE BLOCK
                    </div>
                    <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                </div>
            )}

            {/* REVEALED CONTENT */}
            {gameStage === 'revealed' && (
                <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-center bg-[#07050f]/95 border-2 border-purple-500 rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
                    style={{ boxShadow: '0 0 35px rgba(168,85,247,0.3)' }}>
                    <div className="text-center w-full mb-4">
                        <div className="inline-block px-3 py-1 bg-red-600/30 border border-red-500 text-red-300 font-bold text-xs rounded mb-2" style={{ fontFamily: 'monospace' }}>
                            ★ HIGH SCORE ACQUIRED ★
                        </div>
                        <h2 className="text-2xl font-black text-yellow-400" style={{ fontFamily: 'monospace' }}>
                            {card.title}
                        </h2>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a78bfa', marginTop: '4px' }}>
                            FOR: {card.recipient_name}
                        </p>
                    </div>

                    {/* Photos in Polaroid Frames */}
                    {card.photos && card.photos.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 my-4">
                            {card.photos.map((p, idx) => (
                                <div key={idx} 
                                    onClick={() => setActivePhoto(p)}
                                    className="p-2 bg-slate-900 border border-slate-700 rounded-lg cursor-pointer transform hover:scale-105 transition-transform"
                                    style={{ width: '120px' }}
                                >
                                    <img src={p} alt="Polaroid capture" className="w-full h-24 object-cover rounded" />
                                    <div className="text-[0.5rem] font-mono text-center text-slate-500 mt-1">PIC_00{idx+1}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Score Typing Box */}
                    <div className="w-full p-4 bg-[#110c24] border border-purple-900 rounded-xl font-mono text-xs leading-relaxed text-[#22d3ee] min-h-[100px] border-dashed">
                        {displayText}
                        {!typingDone && <span className="animate-pulse">_</span>}
                    </div>

                    {/* Sender Sign */}
                    <div className="mt-5 text-right w-full font-mono text-xs text-amber-400">
                        — FROM: {card.sender_name}
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activePhoto && (
                <div onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
                    <div onClick={(e)=>e.stopPropagation()} className="relative max-w-lg w-full bg-slate-950 p-2 border border-slate-700 rounded-2xl">
                        <button onClick={() => setActivePhoto(null)} className="absolute -top-10 right-0 text-white font-mono text-sm border border-white/30 bg-white/10 px-2 py-1 rounded">CLOSE [X]</button>
                        <img src={activePhoto} alt="Zoomed capture" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
                    </div>
                </div>
            )}

            {/* Styling */}
            <style>{`
                @keyframes bounceArcade { 
                    0% { transform: translateY(0) scale(1); } 
                    100% { transform: translateY(-8px) scale(1.05); } 
                }
                .scanlines {
                    background: linear-gradient(
                        rgba(18, 16, 16, 0) 50%, 
                        rgba(0, 0, 0, 0.25) 50%
                    );
                    background-size: 100% 4px;
                }
                .crt-screen::before {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 0; left: 0; bottom: 0; right: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    z-index: 2;
                    background-size: 100% 2px, 3px 100%;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
}


function CyberpunkFull({ card }) {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const ambientHumRef = useRef(null);
    const holdIntervalRef = useRef(null);
    const scanOscRef = useRef(null);
    const scanGainRef = useRef(null);

    const [decryptProgress, setDecryptProgress] = useState(0);
    const [gameStage, setGameStage] = useState('cover'); // 'cover' | 'decrypted'
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);
    const [laserY, setLaserY] = useState(0);

    const mainMessage = card.messages?.[0] || 'DECRYPTION COMPLETE. Accessing high-priority birthday greetings. May your next cycle be full of high-tech adventures and positive energy!';

    // Sound Synthesis (Web Audio API)
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const startAmbientHum = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'sawtooth';
            osc.frequency.value = 55; // Low A hum
            
            filter.type = 'lowpass';
            filter.frequency.value = 120;
            
            gain.gain.value = 0.05;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            ambientHumRef.current = { osc, gain };
        } catch(e){}
    };

    const stopAmbientHum = () => {
        if (ambientHumRef.current) {
            try {
                ambientHumRef.current.osc.stop();
            } catch(e){}
            ambientHumRef.current = null;
        }
    };

    const playSuccessChime = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(880, now); // A5
            osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.4); // A6
            
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(440, now); // A4
            osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.45); // E6

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc1.stop(now + 0.8);
            osc2.start(now);
            osc2.stop(now + 0.8);
        } catch(e){}
    };

    const startScanSynth = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = 100;
            gain.gain.value = 0.02;
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            
            scanOscRef.current = osc;
            scanGainRef.current = gain;
        } catch(e){}
    };

    const updateScanSynth = (prog) => {
        if (scanOscRef.current && scanGainRef.current) {
            const ctx = initAudio();
            const freq = 100 + (prog * 6); // Sweep from 100Hz up to 700Hz
            scanOscRef.current.frequency.setValueAtTime(freq, ctx.currentTime);
            scanGainRef.current.gain.setValueAtTime(0.02 + (prog * 0.0006), ctx.currentTime);
        }
    };

    const stopScanSynth = () => {
        if (scanOscRef.current) {
            try {
                scanOscRef.current.stop();
            } catch(e){}
            scanOscRef.current = null;
        }
        scanGainRef.current = null;
    };

    // Scan Hold interaction
    const handleScanStart = (e) => {
        e.preventDefault();
        initAudio();
        startScanSynth();
        
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        let curProg = 0;
        
        holdIntervalRef.current = setInterval(() => {
            curProg += 4;
            if (curProg >= 100) {
                curProg = 100;
                setDecryptProgress(100);
                clearInterval(holdIntervalRef.current);
                stopScanSynth();
                playSuccessChime();
                setTimeout(() => {
                    setGameStage('decrypted');
                    startAmbientHum();
                }, 500);
            } else {
                setDecryptProgress(curProg);
                updateScanSynth(curProg);
            }
        }, 60);
    };

    const handleScanEnd = () => {
        if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
        }
        stopScanSynth();
        setDecryptProgress(0);
    };

    const handleMuteToggle = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (!nextMute) {
            initAudio();
            if (gameStage === 'decrypted') {
                startAmbientHum();
            }
        } else {
            stopAmbientHum();
            stopScanSynth();
        }
    };

    // Cyber Node Grid Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const nodes = Array.from({ length: 45 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            r: Math.random() * 2 + 1
        }));

        let mouse = { x: null, y: null };
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        const loop = () => {
            ctx.fillStyle = '#030712';
            ctx.fillRect(0, 0, W, H);

            // Draw grid lines (subtle background grid)
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.04)';
            ctx.lineWidth = 1;
            const gridSz = 40;
            for (let x = 0; x < W; x += gridSz) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
            }
            for (let y = 0; y < H; y += gridSz) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
            }

            // Draw nodes
            ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > W) n.vx *= -1;
                if (n.y < 0 || n.y > H) n.vy *= -1;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw connection lines
            ctx.lineWidth = 0.8;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
                    if (dist < 100) {
                        ctx.strokeStyle = 'rgba(6, 182, 212, ' + (1 - dist / 100) * 0.15 + ')';
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null) {
                    const distMouse = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
                    if (distMouse < 140) {
                        ctx.strokeStyle = 'rgba(236, 72, 153, ' + (1 - distMouse / 140) * 0.35 + ')';
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Laser scan sweep line (cover animation)
    useEffect(() => {
        if (gameStage !== 'cover') return;
        let dir = 1;
        let y = 0;
        const intv = setInterval(() => {
            y += dir * 2.5;
            if (y > 100 || y < 0) dir *= -1;
            setLaserY(y);
        }, 30);
        return () => clearInterval(intv);
    }, [gameStage]);

    // Typewriter message
    useEffect(() => {
        if (gameStage !== 'decrypted') return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);
        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 35);
        return () => clearInterval(interval);
    }, [gameStage]);

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center p-4 bg-[#030712] text-cyan-400 select-none">
            {/* Cyberpunk canvas background grid */}
            <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

            {/* Mute Button */}
            <button 
                onClick={handleMuteToggle} 
                style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 60,
                    border: '1px solid rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.1)',
                    color: '#22d3ee', padding: '0.4rem 0.8rem', fontFamily: 'monospace',
                    fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px', textShadow: '0 0 5px #06b6d4'
                }}
            >
                {isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}
            </button>

            {/* DECRYPT SCANNER LAYER */}
            {gameStage === 'cover' && (
                <div className="relative flex flex-col items-center justify-center text-center p-6 border border-cyan-500/30 bg-slate-950/85 backdrop-blur-md rounded-2xl max-w-sm w-full z-10"
                    style={{ boxShadow: '0 0 35px rgba(6,182,212,0.15)' }}>
                    
                    {/* Laser line overlay inside the box */}
                    <div style={{
                        position: 'absolute', left: 0, right: 0, height: '2px',
                        background: '#ec4899', boxShadow: '0 0 10px #ec4899',
                        top: `${laserY}%`, pointerEvents: 'none', transition: 'top 0.05s linear'
                    }} />

                    <h1 className="text-2xl font-bold tracking-widest text-cyan-300 mb-2" style={{ fontFamily: 'monospace', textShadow: '0 0 8px #06b6d4' }}>
                        SECURE TERMINAL
                    </h1>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(34, 211, 238, 0.6)', marginBottom: '2rem' }}>
                        HOLD SCANNER FOR BIOMETRIC ACCESS
                    </p>

                    {/* Fingerprint scan trigger */}
                    <div className="relative w-28 h-28 rounded-full border-2 border-cyan-500/40 bg-[#070e22] flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform"
                        onMouseDown={handleScanStart}
                        onMouseUp={handleScanEnd}
                        onMouseLeave={handleScanEnd}
                        onTouchStart={handleScanStart}
                        onTouchEnd={handleScanEnd}
                        style={{
                            boxShadow: decryptProgress > 0 ? '0 0 25px rgba(236,72,153,0.5)' : 'none',
                            borderColor: decryptProgress > 0 ? '#ec4899' : 'rgba(6, 182, 212, 0.4)'
                        }}
                    >
                        <div className="text-5xl" style={{ opacity: decryptProgress > 0 ? 1.0 : 0.5 }}>
                            👤
                        </div>
                        {/* Ring progress border */}
                        {decryptProgress > 0 && (
                            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                <circle cx="56" cy="56" r="52" fill="transparent" stroke="#ec4899" strokeWidth="4"
                                    strokeDasharray={2 * Math.PI * 52}
                                    strokeDashoffset={2 * Math.PI * 52 * (1 - decryptProgress / 100)}
                                />
                            </svg>
                        )}
                    </div>

                    <div className="mt-6 w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-cyan-500/20">
                        <div className="bg-pink-500 h-full transition-all duration-75" style={{ width: `${decryptProgress}%` }} />
                    </div>

                    <div className="mt-2 text-xs font-mono text-cyan-300">
                        DECRYPTING: {decryptProgress}%
                    </div>
                </div>
            )}

            {/* DECRYPTED REVEALED WRAPPER */}
            {gameStage === 'decrypted' && (
                <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-center bg-slate-950/90 border border-cyan-500/40 backdrop-blur-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
                    style={{ boxShadow: '0 0 45px rgba(6,182,212,0.25)' }}>
                    
                    <div className="text-center w-full mb-4">
                        <div className="inline-block px-3 py-1 bg-pink-500/20 border border-pink-500 text-pink-300 font-bold text-xs rounded mb-2" style={{ fontFamily: 'monospace' }}>
                            [ ACCESS GRANTED ]
                        </div>
                        <h2 className="text-2xl font-black text-cyan-300" style={{ fontFamily: 'monospace', textShadow: '0 0 10px rgba(6,182,212,0.5)' }}>
                            {card.title}
                        </h2>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(34, 211, 238, 0.7)', marginTop: '4px' }}>
                            RECIPIENT_ID: {card.recipient_name}
                        </p>
                    </div>

                    {/* Digital Glitched Photo gallery */}
                    {card.photos && card.photos.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4 my-4">
                            {card.photos.map((p, idx) => (
                                <div key={idx} 
                                    onClick={() => setActivePhoto(p)}
                                    className="p-1 border border-cyan-500/30 rounded bg-slate-900 cursor-pointer overflow-hidden transform hover:scale-105 transition-transform"
                                    style={{ width: '110px' }}
                                >
                                    <div className="relative">
                                        <img src={p} alt="Secure content capture" className="w-full h-24 object-cover rounded" />
                                        <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none mix-blend-overlay" />
                                    </div>
                                    <div className="text-[0.55rem] font-mono text-center text-cyan-500/60 mt-1">FRAME_DATA_0{idx+1}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Console Typewriter */}
                    <div className="w-full p-4 bg-[#020617] border border-cyan-500/30 rounded-xl font-mono text-xs leading-relaxed text-cyan-300 min-h-[120px] shadow-inner"
                        style={{ borderLeft: '3px solid #ec4899' }}>
                        <span style={{ color: '#ec4899', marginRight: '5px' }}>$</span>
                        {displayText}
                        {!typingDone && <span className="animate-ping">|</span>}
                    </div>

                    {/* Sign-off */}
                    <div className="mt-5 text-right w-full font-mono text-xs text-pink-400">
                        // SENDER_SIGN: {card.sender_name}
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activePhoto && (
                <div onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <div onClick={(e)=>e.stopPropagation()} className="relative max-w-lg w-full bg-slate-950 p-2 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                        <button onClick={() => setActivePhoto(null)} className="absolute -top-10 right-0 text-cyan-400 font-mono text-sm border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded">CLOSE [X]</button>
                        <img src={activePhoto} alt="Decrypted capture" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
                    </div>
                </div>
            )}
        </div>
    );
}


function BioluminescentFull({ card }) {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const ambientHumRef = useRef(null);
    const harpTimeoutRef = useRef(null);

    const [gameStage, setGameStage] = useState('cover'); // 'cover' | 'opened'
    const [hatchSpin, setHatchSpin] = useState(0);
    const [chestOpen, setChestOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);

    const mainMessage = card.messages?.[0] || 'MESSAGE FOUND IN THE DEEP: Semoga keindahan rahasia samudera menyertai setiap langkah perjalanan hebatmu di tahun yang baru ini!';

    // Sound Synthesis (Web Audio API)
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playHatchCreakAndSteam = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            // 1. Heavy creak osc
            const creakOsc = ctx.createOscillator();
            const creakGain = ctx.createGain();
            creakOsc.type = 'sawtooth';
            creakOsc.frequency.setValueAtTime(80, now);
            creakOsc.frequency.linearRampToValueAtTime(35, now + 0.8);
            creakGain.gain.setValueAtTime(0, now);
            creakGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
            creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            creakOsc.connect(creakGain);
            creakGain.connect(ctx.destination);
            creakOsc.start(now);
            creakOsc.stop(now + 0.8);

            // 2. Steam hiss (noise)
            const bufferSize = ctx.sampleRate * 1.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2000, now);
            filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);
            
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(now);
            noise.stop(now + 1.5);
        } catch(e){}
    };

    const playSonarPing = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1450, now);

            filter.type = 'bandpass';
            filter.Q.value = 15;
            filter.frequency.setValueAtTime(1450, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 3.0);
        } catch(e){}
    };

    const playBubblePop = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.08);
        } catch(e){}
    };

    const playChestOpenSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            // Wooden friction/latch creak
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(70, now + 0.6);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.6);
            
            // Success chime magic harp splash
            setTimeout(() => {
                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const oscH = ctx.createOscillator();
                    const gainH = ctx.createGain();
                    oscH.type = 'sine';
                    oscH.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
                    gainH.gain.setValueAtTime(0, ctx.currentTime);
                    gainH.gain.linearRampToValueAtTime(0.04, ctx.currentTime + idx * 0.08 + 0.01);
                    gainH.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.6);
                    oscH.connect(gainH);
                    gainH.connect(ctx.destination);
                    oscH.start(ctx.currentTime + idx * 0.08);
                    oscH.stop(ctx.currentTime + idx * 0.08 + 0.6);
                });
            }, 100);
        } catch(e){}
    };

    // Ambient Deep Sea sound loops
    const startAmbientHum = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            
            // Low water rumble
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 65;
            gain.gain.value = 0.08;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            ambientHumRef.current = { osc, gain };

            // Start playing periodic harp drone arpeggios
            const playHarpCascade = () => {
                if (isMuted) return;
                const baseNotes = [130.81, 164.81, 196.00, 220.00, 261.63, 329.63, 392.00];
                const root = baseNotes[Math.floor(Math.random() * baseNotes.length)];
                const chords = [1, 1.2, 1.5, 1.8, 2.0]; // intervals
                
                chords.forEach((mult, idx) => {
                    const hOsc = ctx.createOscillator();
                    const hGain = ctx.createGain();
                    hOsc.type = 'sine';
                    hOsc.frequency.setValueAtTime(root * mult, ctx.currentTime + idx * 0.15);
                    hGain.gain.setValueAtTime(0, ctx.currentTime);
                    hGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + idx * 0.15 + 0.02);
                    hGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 1.8);
                    
                    hOsc.connect(hGain);
                    hGain.connect(ctx.destination);
                    hOsc.start(ctx.currentTime + idx * 0.15);
                    hOsc.stop(ctx.currentTime + idx * 0.15 + 2.0);
                });
                
                harpTimeoutRef.current = setTimeout(playHarpCascade, 9000 + Math.random() * 6000);
            };
            
            // Initial delay before first ambient harp loop
            harpTimeoutRef.current = setTimeout(playHarpCascade, 3000);
        } catch(e){}
    };

    const stopAmbientHum = () => {
        if (ambientHumRef.current) {
            try {
                ambientHumRef.current.osc.stop();
            } catch(e){}
            ambientHumRef.current = null;
        }
        if (harpTimeoutRef.current) {
            clearTimeout(harpTimeoutRef.current);
            harpTimeoutRef.current = null;
        }
    };

    const handleMuteToggle = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (!nextMute) {
            initAudio();
            if (gameStage === 'opened') {
                startAmbientHum();
            }
        } else {
            stopAmbientHum();
        }
    };

    const handleHatchClick = () => {
        playHatchCreakAndSteam();
        setHatchSpin(360);
        setTimeout(() => {
            setGameStage('opened');
            startAmbientHum();
        }, 1200);
    };

    const handleChestClick = () => {
        if (chestOpen) return;
        setChestOpen(true);
        playChestOpenSound();
    };

    // Bioluminescent Canvas (Jellyfish + Bubbles + Ripples)
    useEffect(() => {
        if (gameStage !== 'opened') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Neon Jellyfish objects
        const jellies = Array.from({ length: 6 }, (_, i) => ({
            x: Math.random() * W,
            y: H * 0.4 + Math.random() * H * 0.4,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.2 - Math.random() * 0.4,
            size: 20 + Math.random() * 15,
            hue: [180, 280, 310, 45][i % 4], // neon cyan, purple, pink, yellow
            wobbleSpeed: 0.02 + Math.random() * 0.02,
            t: Math.random() * 10,
            tentacles: Array.from({ length: 5 }, () => ({ length: 40 + Math.random() * 30, phase: Math.random() * Math.PI }))
        }));

        // Bubble particles
        const bubbles = Array.from({ length: 30 }, () => ({
            x: Math.random() * W,
            y: H + Math.random() * 100,
            r: Math.random() * 4 + 1.5,
            speed: 0.8 + Math.random() * 1.2,
            wobble: Math.random() * 10,
            wobbleSpeed: 0.02 + Math.random() * 0.03
        }));

        // Ripples
        let ripples = [];

        const handleCanvasClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            
            ripples.push({ x: cx, y: cy, r: 0, maxR: 120, alpha: 0.8 });
            playSonarPing();
            playBubblePop();

            // Push jellies away from click point
            jellies.forEach(j => {
                const dist = Math.hypot(j.x - cx, j.y - cy);
                if (dist < 150) {
                    const angle = Math.atan2(j.y - cy, j.x - cx);
                    j.vx += Math.cos(angle) * 2.5;
                    j.vy += Math.sin(angle) * 1.5;
                }
            });
        };
        canvas.addEventListener('click', handleCanvasClick);

        const loop = () => {
            ctx.fillStyle = '#02101b';
            ctx.fillRect(0, 0, W, H);

            // Draw deep ocean light gradient beams
            const lightGrad = ctx.createLinearGradient(W/2, 0, W/2, H);
            lightGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
            lightGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.01)');
            lightGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = lightGrad;
            ctx.fillRect(0, 0, W, H);

            // Update & Draw Bubbles
            ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
            ctx.lineWidth = 1.2;
            bubbles.forEach(b => {
                b.y -= b.speed;
                b.wobble += b.wobbleSpeed;
                const bx = b.x + Math.sin(b.wobble) * 3;
                if (b.y < -20) {
                    b.y = H + Math.random() * 50;
                    b.x = Math.random() * W;
                }
                ctx.beginPath();
                ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
                ctx.stroke();

                // Small shine spot on bubble
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath();
                ctx.arc(bx - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25, 0, Math.PI*2);
                ctx.fill();
            });

            // Update & Draw Ripples
            ripples.forEach((r, idx) => {
                r.r += 2.5;
                r.alpha -= 0.015;
                if (r.alpha <= 0) {
                    ripples.splice(idx, 1);
                    return;
                }
                ctx.strokeStyle = 'rgba(6, 182, 212, ' + r.alpha + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
                ctx.stroke();
            });

            // Update & Draw Jellyfish
            jellies.forEach(j => {
                j.t += j.wobbleSpeed;
                j.x += j.vx;
                j.y += j.vy;

                // Friction
                j.vx *= 0.96;
                if (Math.abs(j.vy) > 0.4) j.vy *= 0.97;

                // Wrap or bounce boundaries
                if (j.x < -j.size) j.x = W + j.size;
                if (j.x > W + j.size) j.x = -j.size;
                if (j.y < -j.size) j.y = H + j.size;
                if (j.y > H + j.size) j.y = -j.size;

                const wobble = Math.sin(j.t);
                const currentWidth = j.size * (1 + wobble * 0.12);
                const currentHeight = j.size * (1 - wobble * 0.15);

                // Draw Jellyfish Tentacles (Bezier curves that sway)
                ctx.strokeStyle = 'hsla(' + j.hue + ', 90%, 75%, 0.45)';
                ctx.lineWidth = 1.8;
                j.tentacles.forEach((t, idx) => {
                    const txOffset = ((idx - 2) * currentWidth) * 0.3;
                    const startX = j.x + txOffset;
                    const startY = j.y + currentHeight * 0.3;

                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    // Bezier points swaying with sine waves
                    const cp1x = startX + Math.sin(j.t + t.phase) * 12;
                    const cp1y = startY + t.length * 0.35;
                    const cp2x = startX + Math.cos(j.t * 0.8 + t.phase) * 16;
                    const cp2y = startY + t.length * 0.7;
                    const endX = startX + Math.sin(j.t * 0.6 + t.phase) * 20;
                    const endY = startY + t.length;

                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
                    ctx.stroke();
                });

                // Draw Glowing Head/Cap
                const grad = ctx.createRadialGradient(j.x, j.y - currentHeight * 0.2, 0, j.x, j.y, currentWidth);
                grad.addColorStop(0, 'hsla(' + j.hue + ', 95%, 85%, 0.85)');
                grad.addColorStop(0.5, 'hsla(' + j.hue + ', 80%, 60%, 0.6)');
                grad.addColorStop(1, 'transparent');
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(j.x, j.y, currentWidth, currentHeight, 0, 0, Math.PI * 2);
                ctx.fill();
            });

            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('click', handleCanvasClick);
            window.removeEventListener('resize', handleResize);
        };
    }, [gameStage]);

    // Typewriter message inside pearl bubble
    useEffect(() => {
        if (!chestOpen) return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);
        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [chestOpen]);

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center bg-[#020b14] text-cyan-200 select-none">
            {/* Viewport content canvas */}
            {gameStage === 'opened' && (
                <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }} />
            )}

            {/* Mute Button */}
            <button 
                onClick={handleMuteToggle} 
                style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 60,
                    border: '1px solid rgba(6, 182, 212, 0.4)', background: 'rgba(6, 182, 212, 0.1)',
                    color: '#06b6d4', padding: '0.4rem 0.8rem', fontFamily: 'monospace',
                    fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px', textShadow: '0 0 4px #06b6d4'
                }}
            >
                {isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}
            </button>

            {/* COVER SCREEN: Submarine cabin viewport door lock */}
            {gameStage === 'cover' && (
                <div className="relative flex flex-col items-center justify-center text-center p-8 z-10 w-full h-full"
                    style={{ background: 'radial-gradient(circle, #021a2c 0%, #010811 90%)' }}>
                    
                    {/* Viewport Frame */}
                    <div className="relative w-80 h-80 rounded-full border-[10px] border-[#083344] bg-[#02111d] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3),inset_0_0_30px_rgba(0,0,0,0.9)]">
                        {/* Rivets */}
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="absolute w-3 h-3 rounded-full bg-cyan-400/40" style={{
                                transform: `rotate(${i * 45}deg) translateY(-145px)`
                            }} />
                        ))}

                        {/* Hatch locking steering wheel lever */}
                        <div 
                            onClick={handleHatchClick}
                            className="relative w-44 h-44 rounded-full border-8 border-cyan-600 flex items-center justify-center cursor-pointer hover:border-cyan-400 active:scale-95 transition-all duration-1000"
                            style={{ 
                                transform: `rotate(${hatchSpin}deg)`,
                                boxShadow: '0 0 25px rgba(6,182,212,0.4)',
                                background: 'radial-gradient(circle, #033043 30%, #021526 80%)'
                            }}
                        >
                            {/* Wheel Spokes */}
                            <div className="absolute w-2 h-full bg-cyan-600" />
                            <div className="absolute h-2 w-full bg-cyan-600" />
                            <div className="absolute w-12 h-12 rounded-full bg-cyan-500 border-4 border-cyan-700 flex items-center justify-center">
                                <span className="text-xl">🔒</span>
                            </div>
                        </div>

                        <div className="mt-4 text-[0.62rem] font-mono tracking-[4px] text-cyan-300 animate-pulse">
                            CLICK WHEEL TO DIVE
                        </div>
                    </div>

                    <div className="mt-8">
                        <h1 className="text-3xl font-extrabold tracking-[8px] text-cyan-400" style={{ fontFamily: 'monospace', textShadow: '0 0 10px #06b6d4' }}>
                            BIOLUMINESCENT
                        </h1>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#0891b2', marginTop: '6px' }}>
                            SUBSEA VIEWPORT ACCESS MODULE
                        </p>
                    </div>
                </div>
            )}

            {/* OPENED DEEP SEA WRAPPER */}
            {gameStage === 'opened' && (
                <div className="absolute inset-0 flex flex-col items-center justify-between p-6 z-10 pointer-events-none">
                    
                    {/* Header HUD */}
                    <div className="text-center w-full mt-4">
                        <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs rounded mb-1" style={{ fontFamily: 'monospace' }}>
                            ✦ DEEP OCEAN VIEWPORT ACTIVE ✦
                        </div>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'rgba(6, 182, 212, 0.5)' }}>
                            TAP WATER TO SEND SONAR PING
                        </p>
                    </div>

                    {/* TREASURE CHEST IN THE ABYSS */}
                    <div className="w-full flex flex-col items-center justify-center pointer-events-auto mb-16">
                        {!chestOpen ? (
                            <div 
                                onClick={handleChestClick}
                                className="flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-transform"
                            >
                                <div className="text-7xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] animate-bounce" style={{ animationDuration: '3s' }}>
                                    📦
                                </div>
                                <div className="mt-3 px-4 py-1.5 bg-[#021526]/80 border border-teal-500/30 rounded text-cyan-300" style={{ 
                                    fontFamily: 'monospace', fontSize: '0.55rem', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' 
                                }}>
                                    Open Subsea Chest
                                </div>
                            </div>
                        ) : (
                            // Pearl Bubble revealed
                            <div className="relative max-w-sm w-full flex flex-col items-center justify-center p-6 rounded-full border border-cyan-300/40 bg-cyan-950/75 backdrop-blur-md text-center"
                                style={{
                                    boxShadow: '0 0 50px rgba(6,182,212,0.4), inset 0 0 30px rgba(255,255,255,0.1)',
                                    aspectRatio: '1/1',
                                    animation: 'pearlBubbleFloating 6s ease-in-out infinite'
                                }}
                            >
                                <div className="w-full max-h-[85%] overflow-y-auto flex flex-col items-center justify-center px-4">
                                    <h2 className="text-xl font-bold text-cyan-200" style={{ fontFamily: 'monospace', textShadow: '0 0 8px rgba(6,182,212,0.5)' }}>
                                        {card.title}
                                    </h2>
                                    <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#a5f3fc', margin: '4px 0 10px 0' }}>
                                        TO: {card.recipient_name}
                                    </p>

                                    {/* Moments Images inside Pearl */}
                                    {card.photos && card.photos.length > 0 && (
                                        <div className="flex justify-center gap-2 mb-3">
                                            {card.photos.map((p, idx) => (
                                                <div key={idx} 
                                                    onClick={() => setActivePhoto(p)}
                                                    className="w-14 h-14 border border-cyan-300/30 rounded-full overflow-hidden cursor-pointer transform hover:scale-110 transition-transform"
                                                >
                                                    <img src={p} alt="Sea moment" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Pearl Typewriter text */}
                                    <div className="font-mono text-[0.7rem] leading-relaxed text-cyan-100 max-h-[100px] overflow-y-auto pr-1">
                                        {displayText}
                                        {!typingDone && <span className="animate-pulse">|</span>}
                                    </div>

                                    <div className="mt-4 text-xs font-mono text-amber-400">
                                        — {card.sender_name}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activePhoto && (
                <div onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <div onClick={(e)=>e.stopPropagation()} className="relative max-w-lg w-full bg-[#02101b] p-2 border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                        <button onClick={() => setActivePhoto(null)} className="absolute -top-10 right-0 text-cyan-400 font-mono text-sm border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 rounded">CLOSE [X]</button>
                        <img src={activePhoto} alt="Sea capture" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
                    </div>
                </div>
            )}

            {/* Keyframe animations */}
            <style>{`
                @keyframes pearlBubbleFloating {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-12px) scale(1.02); }
                }
            `}</style>
        </div>
    );
}


function MysticForestFull({ card }) {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    const cricketIntervalRef = useRef(null);

    const [scrollState, setScrollState] = useState('closed'); // 'closed' | 'untied' | 'open'
    const [isMuted, setIsMuted] = useState(true);
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [activePhoto, setActivePhoto] = useState(null);
    const [activeLanternMsg, setActiveLanternMsg] = useState(null);

    const mainMessage = card.messages?.[0] || 'PESAN DARI HUTAN MISTIK: Semoga keajaiban dan cahaya lentera harapan menerangi jalan hidupmu dengan penuh kebahagiaan dan kesuksesan!';

    // Sound Synthesis (Web Audio API)
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    const playMagicChime = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            // Magical arpeggiated sweep
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 E5 G5 C6 E6 G6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.05 + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.5);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.5);
            });
        } catch(e){}
    };

    const playScrollRustle = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            // White noise rustle
            const bufferSize = ctx.sampleRate * 0.6;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
            noise.stop(now + 0.6);
        } catch(e){}
    };

    const playLanternChime = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(659.25, now); // E5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.4); // A5
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now);
            osc.stop(now + 1.2);
        } catch(e){}
    };

    const startCricketLoop = () => {
        if (isMuted) return;
        const ctx = initAudio();
        
        cricketIntervalRef.current = setInterval(() => {
            if (isMuted) return;
            try {
                const now = ctx.currentTime;
                // Fast cricket chirps: 3 bursts of 15ms high pitch sine sweeps
                for (let i = 0; i < 3; i++) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(4200, now + i * 0.05);
                    osc.frequency.exponentialRampToValueAtTime(3200, now + i * 0.05 + 0.02);
                    
                    gain.gain.setValueAtTime(0.008, now + i * 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.02);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + i * 0.05);
                    osc.stop(now + i * 0.05 + 0.03);
                }
            } catch(e){}
        }, 1800 + Math.random() * 800);
    };

    const stopCricketLoop = () => {
        if (cricketIntervalRef.current) {
            clearInterval(cricketIntervalRef.current);
            cricketIntervalRef.current = null;
        }
    };

    const handleMuteToggle = () => {
        const nextMute = !isMuted;
        setIsMuted(nextMute);
        if (!nextMute) {
            initAudio();
            if (scrollState === 'open') {
                startCricketLoop();
            }
        } else {
            stopCricketLoop();
        }
    };

    const handleUntieRibbon = () => {
        playScrollRustle();
        setScrollState('untied');
    };

    const handleUnrollScroll = () => {
        playMagicChime();
        setScrollState('open');
        startCricketLoop();
    };

    // Mystic Forest Fireflies Canvas
    useEffect(() => {
        if (scrollState !== 'open') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Firefly particle objects
        const fireflies = Array.from({ length: 25 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            angle: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.4,
            r: Math.random() * 2.5 + 1.2,
            wobble: Math.random() * 10,
            pulseSpeed: 0.01 + Math.random() * 0.02,
            pulsePhase: Math.random() * Math.PI
        }));

        let mouse = { x: null, y: null };
        const sparkles = [];

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;

            // Spawn sparkles on move
            if (Math.random() < 0.3) {
                sparkles.push({
                    x: mouse.x,
                    y: mouse.y,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5 - 0.3,
                    alpha: 1.0,
                    size: Math.random() * 3 + 1,
                    decay: 0.02 + Math.random() * 0.015
                });
            }
        };
        canvas.addEventListener('mousemove', handleMouseMove);

        const loop = () => {
            // Draw background night forest gradient
            const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
            bgGrad.addColorStop(0, '#06130b'); // Dark pine green
            bgGrad.addColorStop(1, '#020704');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            // Draw Fireflies
            fireflies.forEach(f => {
                f.angle += (Math.random() - 0.5) * 0.15;
                f.x += Math.cos(f.angle) * f.speed;
                f.y += Math.sin(f.angle) * f.speed;

                // Bounce edges
                if (f.x < 0 || f.x > W) f.angle = Math.PI - f.angle;
                if (f.y < 0 || f.y > H) f.angle = -f.angle;

                f.wobble += f.pulseSpeed;
                const brightness = 0.45 + 0.45 * Math.sin(f.wobble + f.pulsePhase);

                // Glow ring
                const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 5);
                g.addColorStop(0, 'rgba(163, 230, 53, ' + brightness * 0.45 + ')');
                g.addColorStop(1, 'transparent');
                
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r * 5, 0, Math.PI * 2);
                ctx.fill();

                // Firefly core
                ctx.fillStyle = 'rgba(217, 249, 157, ' + brightness + ')';
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Update & Draw Sparkles
            sparkles.forEach((s, idx) => {
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.02; // gravity
                s.alpha -= s.decay;
                if (s.alpha <= 0) {
                    sparkles.splice(idx, 1);
                    return;
                }
                ctx.fillStyle = 'rgba(253, 224, 71, ' + s.alpha + ')';
                ctx.fillRect(s.x, s.y, s.size, s.size);
            });

            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, [scrollState]);

    // Typewriter message when scroll is open
    useEffect(() => {
        if (scrollState !== 'open') return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);
        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 40);
        return () => clearInterval(interval);
    }, [scrollState]);

    const handleLanternClick = (msg) => {
        playLanternChime();
        setActiveLanternMsg(msg);
        setTimeout(() => setActiveLanternMsg(null), 5000);
    };

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center bg-[#030a05] text-[#d9f99d] select-none">
            {/* Forest canvas background */}
            {scrollState === 'open' && (
                <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />
            )}

            {/* Mute Button */}
            <button 
                onClick={handleMuteToggle} 
                style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 60,
                    border: '1px solid rgba(163, 230, 53, 0.4)', background: 'rgba(163, 230, 53, 0.1)',
                    color: '#a3e635', padding: '0.4rem 0.8rem', fontFamily: 'monospace',
                    fontSize: '0.7rem', cursor: 'pointer', borderRadius: '4px', textShadow: '0 0 4px #a3e635'
                }}
            >
                {isMuted ? 'UNMUTE AUDIO' : 'MUTE AUDIO'}
            </button>

            {/* SCROLL CLOSED / UNTIED LAYER */}
            {scrollState !== 'open' && (
                <div className="relative flex flex-col items-center justify-center text-center p-8 z-10 w-full h-full bg-[#030a05]/95">
                    
                    {/* Ancient Scroll visual representation */}
                    <div className="relative flex flex-col items-center justify-center p-6 border border-[#a3e635]/20 bg-[#0d1c10]/90 rounded-2xl max-w-sm w-full"
                        style={{ boxShadow: '0 0 25px rgba(163,230,53,0.1)' }}>
                        <div className="text-6xl mb-6">📜</div>
                        <h1 className="text-xl font-bold tracking-widest text-[#a3e635] mb-2" style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 8px rgba(163,230,53,0.3)' }}>
                            MAGICAL SCROLL
                        </h1>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'rgba(163, 230, 53, 0.6)', marginBottom: '2rem' }}>
                            {scrollState === 'closed' ? 'UNTIE THE SCROLL TO DISCOVER ITS MESSAGE' : 'THE SCROLL IS READY TO BE UNROLLED'}
                        </p>

                        {scrollState === 'closed' ? (
                            <button 
                                onClick={handleUntieRibbon}
                                className="px-5 py-2.5 bg-red-800 border border-red-500 hover:bg-red-700 text-white rounded-md text-xs font-bold tracking-widest active:scale-95 transition-all"
                                style={{ fontFamily: 'monospace', boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}
                            >
                                🎗 UNTIE RIBBON
                            </button>
                        ) : (
                            <button 
                                onClick={handleUnrollScroll}
                                className="px-5 py-2.5 bg-lime-700 border border-lime-500 hover:bg-lime-600 text-white rounded-md text-xs font-bold tracking-widest active:scale-95 transition-all"
                                style={{ fontFamily: 'monospace', boxShadow: '0 0 10px rgba(163, 230, 53, 0.4)' }}
                            >
                                📜 UNROLL SCROLL
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* UNROLLED SCROLL WRAPPER */}
            {scrollState === 'open' && (
                <div className="relative z-10 max-w-md w-full flex flex-col items-center justify-center p-6 overflow-y-auto max-h-[95vh] text-center">
                    
                    {/* Parchment scroll background */}
                    <div className="w-full flex flex-col items-center justify-center bg-[#fefcbf] border-y-[12px] border-[#a16207] border-x border-[#ca8a04] shadow-[0_0_35px_rgba(0,0,0,0.6)] p-6 rounded-md text-[#78350f]"
                        style={{
                            backgroundImage: 'radial-gradient(#fef9c3 30%, #fef08a 100%)',
                            animation: 'scrollOpenAnim 0.8s ease-out forwards'
                        }}
                    >
                        <div className="w-full">
                            <div className="inline-block px-3 py-1 bg-amber-800/10 border border-amber-800/30 text-amber-900 font-bold text-xs rounded mb-2" style={{ fontFamily: 'monospace' }}>
                                ✦ ANCIENT WISH SCROLL ✦
                            </div>
                            <h2 className="text-2xl font-black text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                                {card.title}
                            </h2>
                            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#b45309', margin: '4px 0 12px 0' }}>
                                RECIPIENT: {card.recipient_name}
                            </p>
                        </div>

                        {/* Moments Gallery */}
                        {card.photos && card.photos.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3 my-4">
                                {card.photos.map((p, idx) => (
                                    <div key={idx} 
                                        onClick={() => setActivePhoto(p)}
                                        className="p-1 border-2 border-[#a16207]/30 bg-white/70 shadow-sm rounded cursor-pointer overflow-hidden transform hover:scale-105 transition-transform"
                                        style={{ width: '90px', transform: `rotate(${(idx % 2 === 0 ? -2 : 2)}deg)` }}
                                    >
                                        <img src={p} alt="Moment capture" className="w-full h-16 object-cover rounded" />
                                        <div className="text-[0.45rem] font-mono text-center text-amber-800/60 mt-1">MOMENT_0{idx+1}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Typewriter message */}
                        <div className="w-full p-4 bg-amber-500/10 border border-amber-700/20 rounded-xl font-mono text-xs leading-relaxed text-[#78350f] min-h-[110px] shadow-inner text-left"
                            style={{ borderLeft: '3px solid #b45309' }}>
                            {displayText}
                            {!typingDone && <span className="animate-pulse">_</span>}
                        </div>

                        {/* Sign-off */}
                        <div className="mt-5 text-right w-full font-mono text-xs text-amber-800">
                            — SENDER: {card.sender_name}
                        </div>
                    </div>

                    {/* Sky Lanterns Floating overlay in the background/edges */}
                    <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
                        {/* Interactive floating lanterns (drawn with html elements for easier clicks) */}
                        {[...Array(4)].map((_, i) => (
                            <div 
                                key={i}
                                onClick={() => handleLanternClick(card.messages?.[i % card.messages.length] || mainMessage)}
                                className="absolute pointer-events-auto cursor-pointer rounded-t-full bg-amber-500/30 border border-amber-400 flex items-center justify-center text-center text-[0.5rem]"
                                style={{
                                    width: '45px', height: '65px',
                                    bottom: '-80px',
                                    left: `${15 + i * 22}%`,
                                    animation: `lanternFloat ${12 + i * 4}s linear infinite`,
                                    animationDelay: `${i * 3}s`,
                                    boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
                                }}
                            >
                                <div className="text-amber-200 mt-2 font-mono">🏮</div>
                            </div>
                        ))}
                    </div>

                    {/* Lantern wish popup banner */}
                    {activeLanternMsg && (
                        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 p-4 border border-amber-300 bg-amber-950/90 text-amber-200 rounded-xl max-w-xs font-mono text-xs shadow-2xl animate-bounce"
                            style={{ borderLeft: '4px solid #f59e0b' }}
                        >
                            🏮 "{activeLanternMsg}"
                        </div>
                    )}
                </div>
            )}

            {/* LIGHTBOX MODAL */}
            {activePhoto && (
                <div onClick={() => setActivePhoto(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
                    <div onClick={(e)=>e.stopPropagation()} className="relative max-w-lg w-full bg-[#1c1917] p-2 border border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)]">
                        <button onClick={() => setActivePhoto(null)} className="absolute -top-10 right-0 text-amber-400 font-mono text-sm border border-amber-500/30 bg-amber-500/10 px-2 py-1 rounded">CLOSE [X]</button>
                        <img src={activePhoto} alt="Scroll capture" className="w-full h-auto rounded-lg max-h-[80vh] object-contain" />
                    </div>
                </div>
            )}

            {/* Keyframe animations */}
            <style>{`
                @keyframes scrollOpenAnim {
                    0% { transform: scaleY(0.01); opacity: 0; }
                    100% { transform: scaleY(1); opacity: 1; }
                }
                @keyframes lanternFloat {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% { transform: translateY(-110vh) rotate(15deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}


function BalloonPopFull({ card }) {
    const canvasRef = useRef(null);
    const audioCtxRef = useRef(null);
    
    // Alur Stage: 'envelope' -> 'cover' -> 'igniting' -> 'launching' -> 'journey' -> 'opened'
    const [stage, setStage] = useState('envelope');
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [activePhoto, setActivePhoto] = useState(null);
    const [revealedPhotos, setRevealedPhotos] = useState([]);
    
    // Efek pemicu pemantik pembakar (burner fire)
    const [burnerActive, setBurnerActive] = useState(false);
    const [balloonLaunch, setBalloonLaunch] = useState(false);
    
    // State untuk scene perjalanan udara (Journey Scene)
    const [journeyPoppedCount, setJourneyPoppedCount] = useState(0);
    const [journeyBalloons, setJourneyBalloons] = useState([
        { id: 0, text: 'KASIH SAYANG 💖', color: 'gold', x: 25, bottom: -100, speed: 0.9, wSpeed: 0.005, popped: false, delay: 0.2 },
        { id: 1, text: 'KEBAHAGIAAN 🌸', color: 'gold', x: 50, bottom: -120, speed: 0.8, wSpeed: 0.004, popped: false, delay: 1.2 },
        { id: 2, text: 'IMPIAN INDAH 🎓', color: 'gold', x: 75, bottom: -100, speed: 1.0, wSpeed: 0.006, popped: false, delay: 0.6 }
    ]);
    const [activeJourneyText, setActiveJourneyText] = useState('');
    const [partingClouds, setPartingClouds] = useState(false);
    
    // Form balon harapan kustom di scene utama
    const [wishText, setWishText] = useState('');
    const [wishColor, setWishColor] = useState('pink'); // 'pink' | 'blue' | 'yellow' | 'green' | 'purple'
    const [wishBalloonActive, setWishBalloonActive] = useState(false);
    
    // Efek mengetik pesan ucapan
    const [displayText, setDisplayText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    
    const mainMessage = card.messages?.[0] || 'Semoga hari-harimu selalu dipenuhi keindahan, kebahagiaan, tawa, dan semua impian indahmu menjadi kenyataan!';

    // Sintesis Suara Web Audio API
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    };

    // Suara gemuruh api pembakar balon
    const playBurnerSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            // Noise buffer untuk menduplikasi suara hembusan api gas
            const bufferSize = ctx.sampleRate * 2.0;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(220, now);
            filter.frequency.exponentialRampToValueAtTime(380, now + 0.3);
            filter.frequency.linearRampToValueAtTime(120, now + 1.8);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.24, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            noise.start(now);
            noise.stop(now + 1.9);
        } catch(e){}
    };

    const playPopSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.07);
            
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.09);
        } catch(e){}
    };

    const playChimeSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.05 + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.4);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.4);
            });
        } catch(e){}
    };

    const playLaunchSound = () => {
        if (isMuted) return;
        try {
            const ctx = initAudio();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
        } catch(e){}
    };

    // Alur pembakaran dan peluncuran balon cover
    const handleStartBurner = () => {
        setIsMuted(false);
        setStage('igniting');
        setBurnerActive(true);
        playBurnerSound();

        // 1.5 detik pembakaran: mengembang
        setTimeout(() => {
            setStage('launching');
            setBalloonLaunch(true);
            playLaunchSound();
        }, 1600);

        // 3.8 detik: Balon meluncur terbang keluar layar, pindah ke Journey Scene
        setTimeout(() => {
            setStage('journey');
        }, 3900);
    };

    // Buka amplop surat dan mulai alur cover balon udara
    const handleOpenEnvelope = () => {
        setIsMuted(false);
        setEnvelopeOpen(true);
        playChimeSound();
        setTimeout(() => {
            setStage('cover');
            setEnvelopeOpen(false);
        }, 1500);
    };

    // Efek transpirasi layar awan ketika 3 balon journey pecah
    useEffect(() => {
        if (stage === 'journey' && journeyPoppedCount === 3) {
            // Tutup awan tirai
            setPartingClouds(true);
            
            const t1 = setTimeout(() => {
                setStage('opened');
            }, 1000); // Ganti scene di balik awan
            
            const t2 = setTimeout(() => {
                setPartingClouds(false); // Buka awan tirai kembali
            }, 2300);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        }
    }, [journeyPoppedCount, stage]);

    // Letuskan balon di Journey Scene
    const handlePopJourneyBalloon = (id, text, e) => {
        e.stopPropagation();
        setJourneyBalloons(prev => prev.map(jb => jb.id === id ? { ...jb, popped: true } : jb));
        playPopSound();
        playChimeSound();
        
        setActiveJourneyText(text);
        setJourneyPoppedCount(prev => prev + 1);

        // Tutup spanduk teks setelah 3 detik
        setTimeout(() => {
            setActiveJourneyText(prev => prev === text ? '' : prev);
        }, 3000);
    };

    // Loop pergerakan naik balon-balon di Journey Scene
    useEffect(() => {
        if (stage !== 'journey') return;
        let active = true;

        const updateFrame = () => {
            if (!active) return;
            setJourneyBalloons(prev => prev.map(jb => {
                if (jb.popped) return jb;
                // Gerak naik perlahan
                let nextBottom = jb.bottom + jb.speed;
                // Jika melewati atas layar, ulang dari bawah
                if (nextBottom > window.innerHeight + 120) {
                    nextBottom = -120;
                }
                return { ...jb, bottom: nextBottom };
            }));
            requestAnimationFrame(updateFrame);
        };
        
        const animFrame = requestAnimationFrame(updateFrame);
        return () => {
            active = false;
            cancelAnimationFrame(animFrame);
        };
    }, [stage]);

    // Efek mengetik ucapan di scene utama
    useEffect(() => {
        if (stage !== 'opened') return;
        let idx = 0;
        setDisplayText('');
        setTypingDone(false);
        const interval = setInterval(() => {
            if (idx < mainMessage.length) {
                setDisplayText(prev => prev + mainMessage.charAt(idx));
                idx++;
            } else {
                clearInterval(interval);
                setTypingDone(true);
            }
        }, 35);
        return () => clearInterval(interval);
    }, [stage]);

    // Engine Fisika & Partikel Canvas (Scene Utama)
    const balloonsRef = useRef([]);
    const particlesRef = useRef([]);
    const cloudsRef = useRef([]);
    const floatingTextsRef = useRef([]);

    useEffect(() => {
        if (stage !== 'opened') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        const handleResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // Skema warna balon pastel
        const colors = {
            pink:   { fill: 'rgba(244, 180, 196, 0.85)', stroke: 'rgba(235, 140, 160, 0.95)', highlight: 'rgba(255, 255, 255, 0.4)' },
            blue:   { fill: 'rgba(186, 230, 253, 0.85)', stroke: 'rgba(125, 211, 252, 0.95)', highlight: 'rgba(255, 255, 255, 0.4)' },
            yellow: { fill: 'rgba(254, 240, 138, 0.85)', stroke: 'rgba(253, 224, 71, 0.95)', highlight: 'rgba(255, 255, 255, 0.4)' },
            green:  { fill: 'rgba(187, 247, 208, 0.85)', stroke: 'rgba(134, 239, 172, 0.95)', highlight: 'rgba(255, 255, 255, 0.4)' },
            purple: { fill: 'rgba(233, 213, 255, 0.85)', stroke: 'rgba(216, 180, 254, 0.95)', highlight: 'rgba(255, 255, 255, 0.4)' },
            gold:   { fill: 'rgba(251, 191, 36, 0.88)', stroke: 'rgba(245, 158, 11, 0.98)', highlight: 'rgba(255, 255, 255, 0.55)' }
        };

        const colorKeys = Object.keys(colors);

        // Setup Awan fajar melayang lambat
        cloudsRef.current = Array.from({ length: 5 }, (_, i) => ({
            x: Math.random() * W,
            y: 40 + Math.random() * (H * 0.4),
            scale: 0.6 + Math.random() * 0.8,
            speed: 0.12 + Math.random() * 0.15
        }));

        // Inisialisasi Balon
        const photosList = card.photos || [];
        const initialBalloons = [];

        // 1. Balon Foto (Khusus - Glow Emas)
        photosList.forEach((photoUrl, idx) => {
            initialBalloons.push({
                id: `photo-${idx}`,
                photoUrl: photoUrl,
                x: W * 0.15 + Math.random() * (W * 0.7),
                y: H + 100 + idx * 220,
                baseX: 0,
                amplitude: 15 + Math.random() * 20,
                phase: Math.random() * Math.PI * 2,
                wobble: 0.007 + Math.random() * 0.008,
                vy: 0.75 + Math.random() * 0.45,
                radiusX: 25,
                radiusY: 34,
                colorKey: 'gold',
                isPhoto: true,
                photoIndex: idx,
                popped: false
            });
        });

        // 2. Balon Dekoratif Biasa
        const regularCount = Math.max(5, 12 - photosList.length);
        for (let i = 0; i < regularCount; i++) {
            initialBalloons.push({
                id: `reg-${i}`,
                x: Math.random() * W,
                y: H + 100 + Math.random() * (H + 200),
                baseX: 0,
                amplitude: 12 + Math.random() * 15,
                phase: Math.random() * Math.PI * 2,
                wobble: 0.006 + Math.random() * 0.007,
                vy: 0.9 + Math.random() * 0.7,
                radiusX: 20 + Math.random() * 6,
                radiusY: 27 + Math.random() * 8,
                colorKey: colorKeys[i % (colorKeys.length - 1)],
                isPhoto: false,
                popped: false
            });
        }

        balloonsRef.current = initialBalloons;
        particlesRef.current = [];
        floatingTextsRef.current = [];

        const loop = () => {
            // Background gradasi langit fajar pastel
            const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
            skyGrad.addColorStop(0, '#e0f2fe');
            skyGrad.addColorStop(0.5, '#bae6fd');
            skyGrad.addColorStop(1, '#f3e8ff');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, W, H);

            // Awan
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            cloudsRef.current.forEach(c => {
                c.x += c.speed;
                if (c.x > W + 200) {
                    c.x = -200;
                    c.y = 40 + Math.random() * (H * 0.4);
                }

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.scale(c.scale, c.scale);
                ctx.beginPath();
                ctx.arc(0, 0, 30, 0, Math.PI * 2);
                ctx.arc(25, -10, 35, 0, Math.PI * 2);
                ctx.arc(55, 0, 30, 0, Math.PI * 2);
                ctx.arc(25, 15, 25, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            });

            // Update & Render Balon
            balloonsRef.current.forEach(b => {
                if (b.popped) return;

                b.y -= b.vy;
                b.phase += b.wobble;
                
                if (b.baseX === 0) b.baseX = b.x;
                b.x = b.baseX + Math.sin(b.phase) * b.amplitude;

                if (b.y < -100) {
                    b.y = H + 100;
                    b.baseX = Math.random() * W;
                    b.x = b.baseX;
                    b.vy = 0.8 + Math.random() * 0.7;
                    b.phase = Math.random() * Math.PI * 2;
                }

                // Tali Balon
                ctx.beginPath();
                ctx.moveTo(b.x, b.y + b.radiusY);
                ctx.bezierCurveTo(
                    b.x - 5 * Math.sin(b.phase), b.y + b.radiusY + 15,
                    b.x + 5 * Math.sin(b.phase), b.y + b.radiusY + 35,
                    b.x, b.y + b.radiusY + 55
                );
                ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Badan Balon
                const c = colors[b.colorKey] || colors.pink;
                ctx.save();
                ctx.translate(b.x, b.y);

                if (b.isPhoto) {
                    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
                    ctx.shadowBlur = 15;
                } else if (b.isWish) {
                    ctx.shadowColor = 'rgba(236, 72, 153, 0.45)';
                    ctx.shadowBlur = 12;
                }

                ctx.beginPath();
                ctx.ellipse(0, 0, b.radiusX, b.radiusY, 0, 0, Math.PI * 2);
                ctx.fillStyle = c.fill;
                ctx.fill();

                ctx.shadowBlur = 0;
                ctx.strokeStyle = c.stroke;
                ctx.lineWidth = 1.8;
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(-4, b.radiusY - 2);
                ctx.lineTo(4, b.radiusY - 2);
                ctx.lineTo(0, b.radiusY + 4);
                ctx.closePath();
                ctx.fillStyle = c.stroke;
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(-b.radiusX * 0.35, -b.radiusY * 0.35, b.radiusX * 0.25, b.radiusY * 0.25, -Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = c.highlight;
                ctx.fill();

                if (b.isPhoto) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('📷', 0, 2);
                } else if (b.isWish) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                    ctx.font = '11px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✨', 0, 2);
                }

                ctx.restore();
            });

            // Update & Render Partikel Ledakan
            particlesRef.current.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.angle += p.rotationSpeed;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particlesRef.current.splice(idx, 1);
                    return;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;

                if (p.shape === 'heart') {
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-p.size, -p.size, -p.size * 2, p.size / 3, 0, p.size * 1.5);
                    ctx.bezierCurveTo(p.size * 2, p.size / 3, p.size, -p.size, 0, 0);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                ctx.restore();
            });
            ctx.globalAlpha = 1.0;

            // Update & Render Teks Melayang
            floatingTextsRef.current.forEach((t, idx) => {
                t.y -= t.speed;
                t.alpha -= t.decay;

                if (t.alpha <= 0) {
                    floatingTextsRef.current.splice(idx, 1);
                    return;
                }

                ctx.save();
                ctx.globalAlpha = t.alpha;
                ctx.shadowColor = 'rgba(255,255,255,0.85)';
                ctx.shadowBlur = 10;
                
                ctx.font = 'bold 12px monospace';
                const textWidth = ctx.measureText(t.text).width;
                
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.strokeStyle = t.strokeColor;
                ctx.lineWidth = 1.2;
                
                if (ctx.roundRect) {
                    ctx.beginPath();
                    ctx.roundRect(t.x - textWidth/2 - 10, t.y - 14, textWidth + 20, 24, 8);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.rect(t.x - textWidth/2 - 10, t.y - 14, textWidth + 20, 24);
                    ctx.fill();
                    ctx.stroke();
                }

                ctx.fillStyle = '#0f172a';
                ctx.textAlign = 'center';
                ctx.fillText(t.text, t.x, t.y + 2);
                ctx.restore();
            });
            ctx.globalAlpha = 1.0;

            animId = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, [stage]);

    // Handle klik letusan balon utama
    const handleCanvasClick = (e) => {
        if (stage !== 'opened') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
            const b = balloonsRef.current[i];
            if (b.popped) continue;

            const dx = clickX - b.x;
            const dy = clickY - b.y;
            if ((dx * dx) / (b.radiusX * b.radiusX) + (dy * dy) / (b.radiusY * b.radiusY) <= 1.35) {
                b.popped = true;
                playPopSound();

                const colorsList = ['#ff8fa3', '#f472b6', '#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f59e0b'];
                const count = 30 + Math.floor(Math.random() * 15);
                for (let k = 0; k < count; k++) {
                    particlesRef.current.push({
                        x: b.x,
                        y: b.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6 - 2,
                        gravity: 0.08 + Math.random() * 0.05,
                        size: 4 + Math.random() * 6,
                        color: colorsList[Math.floor(Math.random() * colorsList.length)],
                        angle: Math.random() * Math.PI * 2,
                        rotationSpeed: (Math.random() - 0.5) * 0.15,
                        shape: Math.random() < 0.35 ? 'heart' : 'rectangle',
                        alpha: 1.0,
                        decay: 0.015 + Math.random() * 0.01
                    });
                }

                if (b.isPhoto) {
                    playChimeSound();
                    setActivePhoto(b.photoUrl);
                    if (!revealedPhotos.includes(b.photoUrl)) {
                        setRevealedPhotos(prev => [...prev, b.photoUrl]);
                    }
                    setTimeout(() => {
                        b.popped = false;
                        b.y = window.innerHeight + 100;
                        b.baseX = Math.random() * window.innerWidth;
                        b.x = b.baseX;
                    }, 6000);
                } else if (b.isWish) {
                    playChimeSound();
                    floatingTextsRef.current.push({
                        x: b.x,
                        y: b.y,
                        text: `🎈 ${b.text}`,
                        speed: 0.8 + Math.random() * 0.4,
                        alpha: 1.0,
                        decay: 0.008,
                        strokeColor: '#f472b6'
                    });
                } else {
                    const generalWishes = ['🌈 Kebahagiaan', '💖 Cinta', '🌸 Damai', '🎂 HBD!', '🎓 Sukses!', '🎉 Selamat!', '🍀 Keberuntungan'];
                    floatingTextsRef.current.push({
                        x: b.x,
                        y: b.y,
                        text: generalWishes[Math.floor(Math.random() * generalWishes.length)],
                        speed: 0.7 + Math.random() * 0.4,
                        alpha: 1.0,
                        decay: 0.012,
                        strokeColor: '#38bdf8'
                    });
                    
                    setTimeout(() => {
                        b.popped = false;
                        b.y = window.innerHeight + 100;
                        b.baseX = Math.random() * window.innerWidth;
                        b.x = b.baseX;
                    }, 4000);
                }
                break;
            }
        }
    };

    // Menerbangkan balon harapan baru
    const handleLaunchWish = (e) => {
        e.preventDefault();
        if (!wishText.trim()) return;

        playLaunchSound();
        
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        balloonsRef.current.push({
            id: `wish-${Date.now()}`,
            text: wishText,
            x: w * 0.2 + Math.random() * (w * 0.6),
            y: h + 50,
            baseX: 0,
            amplitude: 15 + Math.random() * 15,
            phase: Math.random() * Math.PI * 2,
            wobble: 0.007 + Math.random() * 0.007,
            vy: 1.0 + Math.random() * 0.5,
            radiusX: 23,
            radiusY: 31,
            colorKey: wishColor,
            isPhoto: false,
            isWish: true,
            popped: false
        });

        setWishText('');
        setWishBalloonActive(true);
        setTimeout(() => setWishBalloonActive(false), 4000);
    };

    // Kelas gaya dinamis berdasarkan kondisi peluncuran balon udara
    const hotAirStyle = {
        transform: balloonLaunch
            ? 'translateY(-135vh) scale(1.1)'
            : burnerActive
                ? 'scale(1.1)'
                : 'scale(1.0)',
        transition: balloonLaunch
            ? 'transform 2.8s cubic-bezier(0.25, 1, 0.5, 1)'
            : burnerActive
                ? 'transform 0.6s ease-out'
                : 'transform 0.4s ease',
        animation: burnerActive && !balloonLaunch
            ? 'shakeBalloon 0.22s ease-in-out infinite'
            : 'floatOrg 7s ease-in-out infinite',
    };

    return (
        <div className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center bg-[#e0f2fe] text-slate-800 select-none">
            {/* Active Physics Canvas */}
            {stage === 'opened' && (
                <canvas 
                    ref={canvasRef} 
                    onClick={handleCanvasClick} 
                    style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }} 
                />
            )}

            {/* Mute/Unmute */}
            <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-xl border border-sky-400/20 bg-sky-100/50 backdrop-blur-md text-xs font-semibold tracking-wider text-sky-800 shadow-md hover:bg-sky-200/50 active:scale-95 transition-all"
            >
                {isMuted ? '🔇 MUTE' : '🔊 UNMUTE'}
            </button>

            {/* ═══ SCENE 1: AMPLOP SURAT INTERAKTIF ═══ */}
            {stage === 'envelope' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, #fce7f3 0%, #ede9fe 35%, #dbeafe 70%, #e0f2fe 100%)' }}>

                    {/* Awan dekorasi latar - setiap awan punya jalur berbeda */}
                    <div className="absolute rounded-full blur-md bg-white/60" style={{ top: '48px', left: '24px', width: '112px', height: '56px', animation: 'cloudDrift1 9s ease-in-out infinite' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/50" style={{ top: '112px', right: '40px', width: '144px', height: '72px', animation: 'cloudDrift2 11s ease-in-out infinite 1.2s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/45" style={{ bottom: '80px', left: '40px', width: '176px', height: '88px', animation: 'cloudDrift1 13s ease-in-out infinite 2.5s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/55" style={{ bottom: '112px', right: '24px', width: '96px', height: '48px', animation: 'cloudDrift2 8s ease-in-out infinite 0.7s' }}/>

                    {/* Balon dan ikon dekoratif - masing-masing jalur unik */}
                    <div className="absolute opacity-70" style={{ left: '16px', top: '25%', animation: 'driftLeft 5s cubic-bezier(0.45,0.05,0.55,0.95) infinite', fontSize: '36px' }}>🎈</div>
                    <div className="absolute opacity-60" style={{ right: '24px', top: '32%', animation: 'driftRight 6.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite 0.6s', fontSize: '28px' }}>🎀</div>
                    <div className="absolute opacity-50" style={{ left: '32px', bottom: '32%', animation: 'driftLeft 7.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite 1.8s', fontSize: '24px' }}>💌</div>
                    <div className="absolute opacity-55" style={{ right: '16px', bottom: '25%', animation: 'driftRight 5.5s cubic-bezier(0.45,0.05,0.55,0.95) infinite 0.3s', fontSize: '22px' }}>🌸</div>

                    {/* AMPLOP UTAMA */}
                    <div
                        onClick={handleOpenEnvelope}
                        className="relative cursor-pointer select-none"
                        style={{
                            animation: envelopeOpen ? 'none' : 'floatOrg 5.5s ease-in-out infinite',
                            filter: 'drop-shadow(0 24px 48px rgba(168,85,247,0.18)) drop-shadow(0 8px 16px rgba(236,72,153,0.15))'
                        }}
                    >
                        <svg width="260" height="188" viewBox="0 0 260 188" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="transition-transform duration-300 hover:scale-[1.03]">
                            {/* Badan amplop */}
                            <rect x="4" y="46" width="252" height="138" rx="14" fill="url(#envBodyGradA)" stroke="url(#envBorderGradA)" strokeWidth="1.5"/>
                            {/* Garis lipatan bawah */}
                            <path d="M4 184 L84 112" stroke="rgba(216,180,254,0.4)" strokeWidth="1" fill="none"/>
                            <path d="M256 184 L176 112" stroke="rgba(216,180,254,0.4)" strokeWidth="1" fill="none"/>
                            <path d="M4 62 L130 118 L256 62" stroke="rgba(216,180,254,0.25)" strokeWidth="1" fill="none"/>
                            {/* Tutup amplop (flap) - animasi membuka */}
                            <path
                                d="M4 46 L130 14 L256 46 L130 115 Z"
                                fill="url(#envFlapGradA)"
                                stroke="rgba(216,180,254,0.3)"
                                strokeWidth="1"
                                style={{
                                    transformOrigin: '130px 46px',
                                    transform: envelopeOpen ? 'rotateX(175deg)' : 'rotateX(0deg)',
                                    transition: 'transform 0.9s ease-in-out',
                                    transformBox: 'fill-box'
                                }}
                            />
                            {/* Hiasan hati samar */}
                            <text x="88" y="170" fontSize="26" opacity="0.07">💕</text>
                            <text x="158" y="155" fontSize="18" opacity="0.06">💖</text>
                            <defs>
                                <linearGradient id="envBodyGradA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fdf4ff"/>
                                    <stop offset="100%" stopColor="#fce7f3"/>
                                </linearGradient>
                                <linearGradient id="envBorderGradA" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#e879f9" stopOpacity="0.4"/>
                                    <stop offset="100%" stopColor="#f472b6" stopOpacity="0.3"/>
                                </linearGradient>
                                <linearGradient id="envFlapGradA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f3e8ff"/>
                                    <stop offset="100%" stopColor="#fbcfe8"/>
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Segel Lilin Hati */}
                        <div className="absolute left-1/2 -translate-x-1/2"
                            style={{ bottom: '42px', animation: envelopeOpen ? 'none' : 'sealGlow 2.2s ease-in-out infinite' }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'radial-gradient(circle at 38% 36%, #fb7185 0%, #f43f5e 45%, #be123c 80%, #9f1239 100%)',
                                    boxShadow: '0 0 16px rgba(244,63,94,0.55), 0 0 32px rgba(244,63,94,0.25), inset 0 2px 4px rgba(255,255,255,0.25)',
                                    border: '2px solid rgba(251,113,133,0.6)'
                                }}>
                                <span className="text-2xl" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.25))' }}>❤️</span>
                            </div>
                        </div>

                        {/* Balon muncul dari amplop saat terbuka */}
                        {envelopeOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2"
                                style={{ top: '-52px', animation: 'balloonEmerge 0.9s ease-out forwards' }}>
                                <span style={{ fontSize: '52px', display: 'block', filter: 'drop-shadow(0 4px 12px rgba(236,72,153,0.4))' }}>🎈</span>
                            </div>
                        )}
                    </div>

                    {/* Teks ajakan interaksi */}
                    <div className="mt-7 text-center px-6">
                        <p className="text-sm font-bold tracking-widest uppercase font-mono"
                            style={{ color: envelopeOpen ? '#7c3aed' : '#be185d', animation: 'floatHotAir 3s ease-in-out infinite' }}>
                            {envelopeOpen ? '✨ Membuka Surat...' : '💌 Sentuh untuk Membuka'}
                        </p>
                    </div>

                    {/* Judul kartu */}
                    <div className="mt-8 text-center px-8">
                        <h1 className="text-2xl font-black text-slate-800 tracking-wide"
                            style={{ fontFamily: '"Outfit", sans-serif', textShadow: '0 2px 12px rgba(255,255,255,0.95)' }}>
                            {card.title}
                        </h1>
                        <p className="mt-1.5 text-xs font-semibold text-violet-700/70 font-mono tracking-widest">
                            Untuk: {card.recipient_name}
                        </p>
                    </div>
                </div>
            )}

            {/* ═══ SCENE 2: BALON UDARA — NYALAKAN PEMBAKAR ═══ */}
            {(stage === 'cover' || stage === 'igniting' || stage === 'launching') && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
                    style={{ background: 'radial-gradient(ellipse at 50% 25%, #fce7f3 0%, #e0f2fe 55%, #dbeafe 100%)' }}>

                    {/* Awan latar belakang */}
                    <div className="absolute rounded-full blur-sm bg-white/65" style={{ top: '56px', left: '16px', width: '128px', height: '64px', animation: 'floatHotAir 8s ease-in-out infinite' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/55" style={{ top: '144px', right: '24px', width: '160px', height: '80px', animation: 'floatHotAir 10s ease-in-out infinite 1.2s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/50" style={{ bottom: '112px', left: '40px', width: '144px', height: '72px', animation: 'floatHotAir 9s ease-in-out infinite 0.5s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/45" style={{ bottom: '64px', right: '32px', width: '112px', height: '56px', animation: 'floatHotAir 7s ease-in-out infinite 2s' }}/>

                    {/* BALON UDARA + API PEMBAKAR */}
                    <div style={hotAirStyle} className="flex flex-col items-center relative">

                        {/* Api Pembakar — hanya tampil saat burnerActive */}
                        {burnerActive && !balloonLaunch && (
                            <div className="absolute flex justify-center items-end"
                                style={{ bottom: '38px', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                                {/* Api utama */}
                                <div style={{ animation: 'flameFlicker 0.18s ease-in-out infinite', transformOrigin: 'center bottom' }}>
                                    <svg width="32" height="48" viewBox="0 0 32 48" fill="none">
                                        <path d="M16 46C7 36 3 24 9 14C11 9 14 14 16 9C18 4 17 0 21 5C26 12 29 22 25 34C22 40 19 46 16 46Z" fill="url(#flameOutA)"/>
                                        <path d="M16 44C11 34 10 24 14 17C15 14 16 18 16 14C17 10 18 14 19 17C22 24 22 34 16 44Z" fill="url(#flameInA)"/>
                                        <defs>
                                            <linearGradient id="flameOutA" x1="0.5" y1="0" x2="0.5" y2="1">
                                                <stop offset="0%" stopColor="#fef08a"/>
                                                <stop offset="35%" stopColor="#f97316"/>
                                                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1"/>
                                            </linearGradient>
                                            <linearGradient id="flameInA" x1="0.5" y1="0" x2="0.5" y2="1">
                                                <stop offset="0%" stopColor="#ffffff"/>
                                                <stop offset="50%" stopColor="#fef08a"/>
                                                <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                {/* Api sekunder */}
                                <div style={{ animation: 'flameFlicker 0.22s ease-in-out infinite 0.06s', transformOrigin: 'center bottom', marginLeft: '-6px' }}>
                                    <svg width="22" height="36" viewBox="0 0 22 36" fill="none">
                                        <path d="M11 34C5 26 3 18 7 11C9 7 10 11 11 7C12 3 13 7 14 11C17 18 17 26 11 34Z" fill="url(#flameSecA)"/>
                                        <defs>
                                            <linearGradient id="flameSecA" x1="0.5" y1="0" x2="0.5" y2="1">
                                                <stop offset="0%" stopColor="#fef9c3"/>
                                                <stop offset="60%" stopColor="#fb923c"/>
                                                <stop offset="100%" stopColor="#dc2626" stopOpacity="0"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* SVG Balon Udara */}
                        <svg width="176" height="240" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className="drop-shadow-[0_20px_48px_rgba(125,211,252,0.45)]">
                            {balloonLaunch && <ellipse cx="50" cy="60" rx="50" ry="55" fill="rgba(251,191,36,0.12)"/>}
                            {burnerActive && !balloonLaunch && <ellipse cx="50" cy="56" rx="47" ry="52" fill="rgba(251,146,60,0.10)"/>}
                            <path d="M50 5C25 5 5 25 5 50C5 68 18 84 32 94C38 98 42 105 44 110H56C58 105 62 98 68 94C82 84 95 68 95 50C95 25 75 5 50 5Z" fill="url(#hotAirMainA)"/>
                            <path d="M50 5C40 5 32 25 32 50C32 68 38 84 44 110H56C62 84 68 68 68 50C68 25 60 5 50 5Z" fill="url(#hotAirStripeA)"/>
                            <path d="M26 18C20 26 16 38 18 48" stroke="rgba(255,255,255,0.55)" strokeWidth="5" strokeLinecap="round"/>
                            <line x1="43" y1="110" x2="43" y2="128" stroke="#64748b" strokeWidth="1.2"/>
                            <line x1="57" y1="110" x2="57" y2="128" stroke="#64748b" strokeWidth="1.2"/>
                            <line x1="50" y1="110" x2="50" y2="128" stroke="#64748b" strokeWidth="0.8"/>
                            <rect x="40" y="128" width="20" height="10" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="1"/>
                            <line x1="40" y1="133" x2="60" y2="133" stroke="#78350f" strokeWidth="0.8"/>
                            <rect x="47" y="108" width="6" height="5" rx="1" fill="#94a3b8"/>
                            <defs>
                                <linearGradient id="hotAirMainA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={burnerActive ? '#fb923c' : '#f472b6'}/>
                                    <stop offset="50%" stopColor={burnerActive ? '#ef4444' : '#ec4899'}/>
                                    <stop offset="100%" stopColor={burnerActive ? '#dc2626' : '#db2777'}/>
                                </linearGradient>
                                <linearGradient id="hotAirStripeA" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#fed7aa"/>
                                    <stop offset="50%" stopColor="#f97316"/>
                                    <stop offset="100%" stopColor="#ea580c"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Tombol / Status */}
                    <div className="mt-6 flex flex-col items-center gap-2">
                        {stage === 'cover' && (
                            <button
                                onClick={handleStartBurner}
                                className="px-7 py-3.5 rounded-2xl font-black text-sm text-white active:scale-95 transition-all flex items-center gap-2.5"
                                style={{
                                    background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                                    boxShadow: '0 8px 28px rgba(234,88,12,0.45), 0 2px 8px rgba(0,0,0,0.15)',
                                    letterSpacing: '0.06em'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>🔥</span>
                                <span>Nyalakan Balon Udara</span>
                            </button>
                        )}
                        {stage === 'igniting' && (
                            <div className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider flex items-center gap-2 animate-pulse"
                                style={{ background: 'rgba(254,215,170,0.9)', color: '#c2410c', border: '1.5px solid #fb923c' }}>
                                <span>🔥</span> Membakar... Bersiap Terbang!
                            </div>
                        )}
                        {stage === 'launching' && (
                            <div className="px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider flex items-center gap-2 animate-pulse"
                                style={{ background: 'rgba(186,230,253,0.9)', color: '#0369a1', border: '1.5px solid #38bdf8' }}>
                                <span>🚀</span> Meluncur ke Langit!
                            </div>
                        )}
                    </div>

                    {/* Judul */}
                    <div className="mt-8 text-center px-8">
                        <h1 className="text-2xl font-black text-sky-900 tracking-wide"
                            style={{ fontFamily: '"Outfit", sans-serif', textShadow: '0 2px 12px rgba(255,255,255,0.95)' }}>
                            {card.title}
                        </h1>
                        <p className="mt-1.5 text-xs font-semibold text-sky-700/70 font-mono tracking-widest">
                            Untuk: {card.recipient_name}
                        </p>
                    </div>
                </div>
            )}

            {/* ═══ SCENE 3: PERJALANAN UDARA — PECAHKAN 3 BALON EMAS ═══ */}
            {stage === 'journey' && (
                <div className="absolute inset-0 z-10 overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, #0284c7 0%, #0ea5e9 25%, #38bdf8 55%, #bae6fd 80%, #e0f9ff 100%)' }}>

                    {/* Matahari */}
                    <div className="absolute rounded-full" style={{
                        top: '36px', right: '52px', width: '52px', height: '52px',
                        background: 'radial-gradient(circle at 40% 40%, #fef9c3 0%, #fef08a 40%, rgba(253,224,71,0.3) 70%, transparent 100%)',
                        boxShadow: '0 0 40px rgba(254,240,138,0.6)'
                    }}/>

                    {/* Awan latar */}
                    <div className="absolute rounded-full blur-sm bg-white/55" style={{ top: '80px', left: '8px', width: '130px', height: '65px', animation: 'floatHotAir 9s ease-in-out infinite' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/45" style={{ top: '160px', right: '4px', width: '150px', height: '75px', animation: 'floatHotAir 11s ease-in-out infinite 1.5s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/40" style={{ top: '260px', left: '30px', width: '110px', height: '55px', animation: 'floatHotAir 8s ease-in-out infinite 0.8s' }}/>
                    <div className="absolute rounded-full blur-sm bg-white/35" style={{ top: '360px', right: '16px', width: '90px', height: '45px', animation: 'floatHotAir 12s ease-in-out infinite 2s' }}/>

                    {/* Instruksi atas */}
                    <div className="absolute top-6 left-0 right-0 flex justify-center" style={{ zIndex: 5 }}>
                        <div className="px-5 py-2 rounded-full font-bold text-xs tracking-widest"
                            style={{
                                background: 'rgba(255,255,255,0.22)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255,255,255,0.45)',
                                color: 'white',
                                textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                            }}>
                            🎈 Pecahkan 3 Balon Emas! ({journeyPoppedCount}/3)
                        </div>
                    </div>

                    {/* Banner teks setelah balon dipecah */}
                    {activeJourneyText && (
                        <div className="absolute left-0 right-0 flex justify-center" style={{ top: '64px', zIndex: 20 }}>
                            <div className="px-5 py-2.5 rounded-2xl font-black text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(251,191,36,0.97), rgba(245,158,11,0.97))',
                                    color: '#451a03',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(251,191,36,0.5)',
                                    boxShadow: '0 8px 24px rgba(245,158,11,0.4)',
                                    animation: 'journeyTextPop 0.35s ease-out'
                                }}>
                                ✨ {activeJourneyText}
                            </div>
                        </div>
                    )}

                    {/* Balon-balon emas journey */}
                    {journeyBalloons.map(jb => (
                        <div
                            key={jb.id}
                            onClick={e => handlePopJourneyBalloon(jb.id, jb.text, e)}
                            style={{
                                position: 'absolute',
                                left: `${jb.x}%`,
                                bottom: `${jb.bottom}px`,
                                pointerEvents: jb.popped ? 'none' : 'auto',
                                cursor: jb.popped ? 'default' : 'pointer',
                                opacity: jb.popped ? 0 : 1,
                                transition: jb.popped ? 'opacity 0.18s ease' : 'none',
                                zIndex: 10
                            }}
                        >
                            <div style={{ transform: 'translateX(-50%)', animation: `journeySway ${3.2 + jb.id * 0.65}s ease-in-out infinite ${jb.id * 0.45}s` }}>
                                <svg width="72" height="98" viewBox="0 0 72 98" fill="none"
                                    style={{ filter: 'drop-shadow(0 0 14px rgba(251,191,36,0.75)) drop-shadow(0 0 28px rgba(251,191,36,0.3))' }}>
                                    <ellipse cx="36" cy="38" rx="32" ry="36" fill={`url(#goldGrad${jb.id})`}/>
                                    <ellipse cx="36" cy="38" rx="32" ry="36" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5"/>
                                    <ellipse cx="24" cy="24" rx="10" ry="13" fill="rgba(255,255,255,0.38)" transform="rotate(-18 24 24)"/>
                                    <path d="M32 74 L36 74 L34 82 Z" fill="#d97706"/>
                                    <path d="M34 74 Q30 84 34 94" stroke="#92400e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                                    <defs>
                                        <radialGradient id={`goldGrad${jb.id}`} cx="0.38" cy="0.32" r="0.68">
                                            <stop offset="0%" stopColor="#fef9c3"/>
                                            <stop offset="30%" stopColor="#fef08a"/>
                                            <stop offset="65%" stopColor="#fbbf24"/>
                                            <stop offset="100%" stopColor="#b45309"/>
                                        </radialGradient>
                                    </defs>
                                </svg>
                                <div style={{
                                    position: 'absolute', top: '22px', left: '50%',
                                    transform: 'translateX(-50%)', width: '62px', textAlign: 'center',
                                    pointerEvents: 'none'
                                }}>
                                    <span style={{ fontSize: '6.5px', fontWeight: '900', color: 'rgba(120,53,15,0.85)', lineHeight: '1.2', letterSpacing: '0.02em', display: 'block' }}>
                                        {jb.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Hiasan balon kecil di kejauhan */}
                    <div className="absolute opacity-40" style={{ right: '24px', bottom: '80px', animation: 'floatHotAir 7s ease-in-out infinite', fontSize: '30px' }}>🎈</div>
                    <div className="absolute opacity-25" style={{ left: '16px', bottom: '160px', animation: 'floatHotAir 9s ease-in-out infinite 2s', fontSize: '22px' }}>🎈</div>
                </div>
            )}

            {/* OPENED SCENE: Langit & Papan Ucapan */}
            {stage === 'opened' && (
                <div className="absolute inset-0 flex flex-col items-center justify-between p-5 z-10 pointer-events-none">
                    
                    <div className="text-center w-full mt-4 flex flex-col items-center">
                        <div className="px-3 py-1 bg-white/70 backdrop-blur-md border border-sky-300/30 text-sky-900 font-bold text-[10px] tracking-widest uppercase rounded-full shadow-sm" style={{ fontFamily: 'monospace' }}>
                            🎈 Ketuk Balon untuk Meletuskannya! 🎈
                        </div>
                        {card.photos && card.photos.length > 0 && (
                            <p className="text-[10px] text-sky-800/60 mt-1 font-semibold">
                                Petunjuk: Balon 📷 menyimpan foto kenangan khusus!
                            </p>
                        )}
                    </div>

                    {/* PAPAN UCAPAN (GLASSMORPHISM BOARD) */}
                    <div className="w-full max-w-sm flex flex-col items-center pointer-events-auto mb-16 mt-auto">
                        <div className="w-full bg-white/60 backdrop-blur-lg border border-white/50 p-5 rounded-2xl shadow-xl flex flex-col space-y-4 text-center">
                            
                            <div>
                                <div className="text-xs uppercase font-extrabold tracking-widest text-sky-700 font-mono">
                                    ✦ {card.type_label} ✦
                                </div>
                                <h2 className="text-xl font-black text-slate-800 mt-1 font-outfit">
                                    {card.title}
                                </h2>
                                <div className="h-0.5 w-16 bg-sky-400 mx-auto mt-2.5 rounded-full" />
                            </div>

                            <div className="text-xs font-bold text-sky-800/80 bg-sky-100/50 py-1 px-3 rounded-full inline-block mx-auto font-mono">
                                Kepada: {card.recipient_name}
                            </div>

                            {/* Teks Pesan Efek Mengetik */}
                            <div className="w-full p-4 bg-white/40 border border-white/30 rounded-xl font-mono text-xs leading-relaxed text-slate-700 text-left min-h-[96px] max-h-[140px] overflow-y-auto shadow-inner">
                                {displayText}
                                {!typingDone && <span className="animate-pulse font-bold text-sky-600">|</span>}
                            </div>

                            {/* Galeri Thumbnail Foto yang Berhasil Diletuskan */}
                            {revealedPhotos.length > 0 && (
                                <div className="space-y-1.5 border-t border-slate-200/50 pt-3">
                                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 text-left">
                                        Foto Kenangan Terbuka ({revealedPhotos.length}/{card.photos.length})
                                    </div>
                                    <div className="flex gap-2.5 overflow-x-auto py-1 pr-1">
                                        {revealedPhotos.map((url, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => setActivePhoto(url)}
                                                className="w-12 h-14 bg-white p-0.5 border border-slate-200 shadow-sm rounded flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform"
                                                style={{ transform: `rotate(${(idx % 2 === 0 ? -2 : 2)}deg)` }}
                                            >
                                                <img src={url} alt="" className="w-full h-10 object-cover rounded-xs" />
                                                <div className="text-[5px] text-center text-slate-400 font-mono mt-0.5">PIC_0{idx+1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pengirim */}
                            <div className="text-xs font-bold text-slate-500 text-right w-full border-t border-slate-200/50 pt-2.5">
                                — Dari: <span className="text-sky-700 font-outfit">{card.sender_name}</span>
                            </div>

                            {/* Form Terbangkan Balon Baru */}
                            <form onSubmit={handleLaunchWish} className="border-t border-slate-200/50 pt-3 flex flex-col space-y-2">
                                <div className="text-[10px] font-bold text-slate-500 flex items-center justify-between">
                                    <span>Tulis Harapan & Terbangkan Balon:</span>
                                    {wishBalloonActive && <span className="text-emerald-600 animate-pulse text-[9px]">🎈 Balon Mengudara!</span>}
                                </div>
                                <div className="flex gap-1.5">
                                    <input 
                                        type="text" 
                                        maxLength={40}
                                        value={wishText}
                                        onChange={e => setWishText(e.target.value)}
                                        placeholder="cth: Semoga bahagia selalu..."
                                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400 text-xs transition-colors"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!wishText.trim()}
                                        className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:hover:bg-sky-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1"
                                    >
                                        <span>Terbangkan</span>
                                        <span>🎈</span>
                                    </button>
                                </div>
                                <div className="flex justify-center gap-2 pt-1">
                                    {['pink', 'blue', 'yellow', 'green', 'purple'].map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setWishColor(color)}
                                            className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                                                wishColor === color ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent opacity-75'
                                            }`}
                                            style={{
                                                background: {
                                                    pink:   '#f4b4c4',
                                                    blue:   '#bae6fd',
                                                    yellow: '#fef08a',
                                                    green:  '#bbf7d0',
                                                    purple: '#e9d5ff'
                                                }[color]
                                            }}
                                        />
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL POLAROID */}
            {activePhoto && (
                <div 
                    onClick={() => setActivePhoto(null)} 
                    className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6 animate-in fade-in duration-300"
                >
                    <div 
                        onClick={e => e.stopPropagation()} 
                        className="relative max-w-sm w-full bg-[#fcfbf9] border border-amber-800/10 p-4 rounded-xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-500"
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(251,191,36,0.15)',
                            transform: 'rotate(-1.5deg)'
                        }}
                    >
                        <div className="relative w-full aspect-square bg-[#0f172a] rounded-lg overflow-hidden border border-slate-200/30">
                            <img src={activePhoto} alt="Captured memory" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="pt-5 pb-1 text-center w-full font-serif text-amber-900 tracking-wider">
                            <div className="text-xl font-bold" style={{ fontFamily: '"Dancing Script", cursive' }}>
                                Kenangan Indah
                            </div>
                            <div className="text-[10px] font-mono mt-1 text-amber-800/60 uppercase tracking-widest">
                                * CAPTURED MOMENT *
                            </div>
                        </div>

                        <button 
                            onClick={() => setActivePhoto(null)} 
                            className="mt-4 px-4 py-1.5 rounded-lg border border-amber-800/20 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-[10px] tracking-wider transition-all"
                        >
                            TUTUP FOTO [X]
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ TIRAI AWAN TRANSISI ═══ */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 35 }}>
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, left: 0, width: '51%',
                    background: 'linear-gradient(135deg, #7dd3fc 0%, #bae6fd 40%, #e0f2fe 80%, #f0f9ff 100%)',
                    transform: partingClouds ? 'translateX(0)' : 'translateX(-102%)',
                    transition: 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px'
                }}>
                    <span style={{ fontSize: '72px', opacity: 0.4, filter: 'blur(6px)' }}>☁️</span>
                </div>
                <div style={{
                    position: 'absolute', top: 0, bottom: 0, right: 0, width: '51%',
                    background: 'linear-gradient(225deg, #7dd3fc 0%, #bae6fd 40%, #e0f2fe 80%, #f0f9ff 100%)',
                    transform: partingClouds ? 'translateX(0)' : 'translateX(102%)',
                    transition: 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '12px'
                }}>
                    <span style={{ fontSize: '72px', opacity: 0.4, filter: 'blur(6px)' }}>☁️</span>
                </div>
            </div>

            <style>{`
                /* ── Apungan Organik (multi-axis) ── */
                @keyframes floatHotAir {
                    0%   { transform: translateY(0px)   translateX(0px); }
                    30%  { transform: translateY(-14px) translateX(4px); }
                    50%  { transform: translateY(-22px) translateX(0px); }
                    70%  { transform: translateY(-14px) translateX(-4px); }
                    100% { transform: translateY(0px)   translateX(0px); }
                }
                @keyframes floatOrg {
                    0%   { transform: translateY(0px)   translateX(0px)  rotate(0deg)   scale(1); }
                    15%  { transform: translateY(-10px) translateX(5px)  rotate(0.8deg) scale(1.01); }
                    35%  { transform: translateY(-22px) translateX(8px)  rotate(1.8deg) scale(1.02); }
                    50%  { transform: translateY(-26px) translateX(2px)  rotate(0.6deg) scale(1.015); }
                    65%  { transform: translateY(-18px) translateX(-6px) rotate(-1.2deg) scale(1.01); }
                    80%  { transform: translateY(-8px)  translateX(-7px) rotate(-1.8deg) scale(1.005); }
                    100% { transform: translateY(0px)   translateX(0px)  rotate(0deg)   scale(1); }
                }
                /* Awan melayang ke kiri-kanan */
                @keyframes cloudDrift1 {
                    0%   { transform: translateX(0px)   translateY(0px); }
                    40%  { transform: translateX(18px)  translateY(-10px); }
                    70%  { transform: translateX(24px)  translateY(-6px); }
                    100% { transform: translateX(0px)   translateY(0px); }
                }
                @keyframes cloudDrift2 {
                    0%   { transform: translateX(0px)   translateY(0px); }
                    40%  { transform: translateX(-20px) translateY(-8px); }
                    70%  { transform: translateX(-14px) translateY(-14px); }
                    100% { transform: translateX(0px)   translateY(0px); }
                }
                /* Dekorasi melayang kiri + rotate */
                @keyframes driftLeft {
                    0%   { transform: translateY(0px)   translateX(0px)  rotate(0deg); }
                    20%  { transform: translateY(-16px) translateX(-6px) rotate(-4deg); }
                    45%  { transform: translateY(-28px) translateX(4px)  rotate(3deg); }
                    65%  { transform: translateY(-18px) translateX(-8px) rotate(-2deg); }
                    85%  { transform: translateY(-6px)  translateX(-2px) rotate(1deg); }
                    100% { transform: translateY(0px)   translateX(0px)  rotate(0deg); }
                }
                /* Dekorasi melayang kanan + rotate */
                @keyframes driftRight {
                    0%   { transform: translateY(0px)   translateX(0px) rotate(0deg); }
                    25%  { transform: translateY(-12px) translateX(8px) rotate(4deg); }
                    50%  { transform: translateY(-24px) translateX(4px) rotate(-2deg); }
                    75%  { transform: translateY(-10px) translateX(10px) rotate(3deg); }
                    100% { transform: translateY(0px)   translateX(0px) rotate(0deg); }
                }
                /* ── Guncangan Balon Udara ── */
                @keyframes shakeBalloon {
                    0%   { transform: scale(1.10) rotate(-2.8deg) translateX(-4px) translateY(0px); }
                    12%  { transform: scale(1.13) rotate( 3.5deg) translateX( 6px) translateY(-3px); }
                    24%  { transform: scale(1.10) rotate(-2.2deg) translateX(-3px) translateY( 2px); }
                    36%  { transform: scale(1.14) rotate( 4deg)   translateX( 7px) translateY(-4px); }
                    48%  { transform: scale(1.10) rotate(-1.8deg) translateX(-5px) translateY( 1px); }
                    60%  { transform: scale(1.12) rotate( 3deg)   translateX( 5px) translateY(-2px); }
                    72%  { transform: scale(1.10) rotate(-2.5deg) translateX(-4px) translateY( 3px); }
                    84%  { transform: scale(1.13) rotate( 3.2deg) translateX( 6px) translateY(-3px); }
                    100% { transform: scale(1.10) rotate(-2.8deg) translateX(-4px) translateY(0px); }
                }
                /* ── Segel Lilin ── */
                @keyframes sealGlow {
                    0%   { transform: translateX(-50%) scale(1)    rotate(0deg);   box-shadow: 0 0 16px rgba(244,63,94,0.5),  0 0 32px rgba(244,63,94,0.2); }
                    25%  { transform: translateX(-50%) scale(1.06) rotate(3deg);   box-shadow: 0 0 26px rgba(244,63,94,0.75), 0 0 52px rgba(244,63,94,0.38); }
                    50%  { transform: translateX(-50%) scale(1.04) rotate(-2deg);  box-shadow: 0 0 22px rgba(244,63,94,0.65), 0 0 44px rgba(244,63,94,0.30); }
                    75%  { transform: translateX(-50%) scale(1.07) rotate(2.5deg); box-shadow: 0 0 28px rgba(244,63,94,0.80), 0 0 56px rgba(244,63,94,0.40); }
                    100% { transform: translateX(-50%) scale(1)    rotate(0deg);   box-shadow: 0 0 16px rgba(244,63,94,0.5),  0 0 32px rgba(244,63,94,0.2); }
                }
                /* ── Balon keluar dari amplop ── */
                @keyframes balloonEmerge {
                    0%   { transform: translateX(-50%) translateY(30px) scale(0.3) rotate(-12deg); opacity: 0; }
                    30%  { transform: translateX(-50%) translateY(-18px) scale(1.18) rotate(6deg); opacity: 1; }
                    50%  { transform: translateX(-50%) translateY(-8px) scale(0.95) rotate(-3deg); opacity: 1; }
                    65%  { transform: translateX(-50%) translateY(-14px) scale(1.06) rotate(2deg); opacity: 1; }
                    80%  { transform: translateX(-50%) translateY(-8px) scale(0.99) rotate(-1deg); opacity: 1; }
                    100% { transform: translateX(-50%) translateY(-6px) scale(1) rotate(0deg); opacity: 1; }
                }
                /* ── Nyala Api Pembakar ── */
                @keyframes flameFlicker {
                    0%   { transform: scaleX(1.00) scaleY(1.00) rotate(-4deg)  translateY(0px);  opacity: 0.95; }
                    10%  { transform: scaleX(1.20) scaleY(0.88) rotate( 3deg)  translateY(-3px); opacity: 1.00; }
                    22%  { transform: scaleX(0.85) scaleY(1.22) rotate(-2deg)  translateY( 2px); opacity: 0.90; }
                    35%  { transform: scaleX(1.15) scaleY(0.92) rotate( 5deg)  translateY(-2px); opacity: 1.00; }
                    50%  { transform: scaleX(0.90) scaleY(1.18) rotate(-3deg)  translateY( 3px); opacity: 0.92; }
                    65%  { transform: scaleX(1.12) scaleY(0.95) rotate( 2deg)  translateY(-1px); opacity: 0.98; }
                    80%  { transform: scaleX(0.88) scaleY(1.15) rotate(-4deg)  translateY( 2px); opacity: 0.88; }
                    100% { transform: scaleX(1.00) scaleY(1.00) rotate(-4deg)  translateY(0px);  opacity: 0.95; }
                }
                /* ── Banner Teks Journey ── */
                @keyframes journeyTextPop {
                    0%   { transform: scale(0.4) translateY(18px) rotate(-5deg); opacity: 0; }
                    40%  { transform: scale(1.12) translateY(-5px) rotate(2deg); opacity: 1; }
                    58%  { transform: scale(0.96) translateY(2px) rotate(-1deg); opacity: 1; }
                    72%  { transform: scale(1.04) translateY(-1px) rotate(0.5deg); opacity: 1; }
                    85%  { transform: scale(0.99) translateY(1px) rotate(0deg); opacity: 1; }
                    100% { transform: scale(1)    translateY(0)   rotate(0deg); opacity: 1; }
                }
                /* ── Goyangan Balon Emas Journey (3-axis) ── */
                @keyframes journeySway {
                    0%   { transform: translateX(0px)   translateY(0px)  rotate(0deg); }
                    18%  { transform: translateX(14px)  translateY(-8px) rotate(3.5deg); }
                    36%  { transform: translateX(20px)  translateY(-4px) rotate(4.5deg); }
                    54%  { transform: translateX(10px)  translateY( 6px) rotate(2deg); }
                    72%  { transform: translateX(-8px)  translateY(-3px) rotate(-2.5deg); }
                    88%  { transform: translateX(-4px)  translateY( 2px) rotate(-1deg); }
                    100% { transform: translateX(0px)   translateY(0px)  rotate(0deg); }
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
        og_image_url:   card?.og_image_url || '',
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
                
                {/* Open Graph / Facebook / WhatsApp */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${normalizedCard.title} — Untuk ${normalizedCard.recipient_name}`} />
                <meta property="og:description" content={`Kartu ucapan spesial untuk ${normalizedCard.recipient_name} dari ${normalizedCard.sender_name}`} />
                {normalizedCard.og_image_url && <meta property="og:image" content={normalizedCard.og_image_url} />}
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${normalizedCard.title} — Untuk ${normalizedCard.recipient_name}`} />
                <meta name="twitter:description" content={`Kartu ucapan spesial untuk ${normalizedCard.recipient_name} dari ${normalizedCard.sender_name}`} />
                {normalizedCard.og_image_url && <meta name="twitter:image" content={normalizedCard.og_image_url} />}

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Fredoka:wght@400;600&family=Outfit:wght@300;400;600&family=Parisienne&display=swap" rel="stylesheet" />
            </Head>

            {normalizedCard.template === 'stillwithyou' ? (
                <StillWithYouFull card={normalizedCard} />
            ) : normalizedCard.template === 'giftforanita' ? (
                <GiftForAnitaFull card={normalizedCard} />
            ) : normalizedCard.template === 'etherealwhispers' ? (
                <EtherealWhispersFull card={normalizedCard} />
            ) : normalizedCard.template === 'cosmicdrift' ? (
                <CosmicDriftFull card={normalizedCard} />
            ) : normalizedCard.template === 'balloonpop' ? (
                <BalloonPopFull card={normalizedCard} />
            ) : normalizedCard.template === 'lofilove' ? (
                <LofiLoveFull card={normalizedCard} />
            ) : (
                <StillWithYouFull card={normalizedCard} />
            )}
        </>
    );
}

export default function GreetingCardPreview({ card: initialCard }) {
    const [card, setCard] = useState(initialCard);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data && e.data.type === 'UPDATE_GREETING_CARD_PREVIEW') {
                const d = e.data.card;
                setCard(prev => ({
                    ...prev,
                    title: d.title || prev?.title || 'Kartu Ucapan',
                    template: d.template || prev?.template || 'stillwithyou',
                    type: d.type || prev?.type || 'anniversary',
                    recipient_name: d.recipient_name !== undefined ? d.recipient_name : (d.recipientName !== undefined ? d.recipientName : prev?.recipient_name),
                    sender_name: d.sender_name !== undefined ? d.sender_name : (d.senderName !== undefined ? d.senderName : prev?.sender_name),
                    photo_url: d.photo_url !== undefined ? d.photo_url : (d.photoUrl !== undefined ? d.photoUrl : prev?.photo_url),
                    photos: d.photos || prev?.photos || [],
                    messages: d.messages || prev?.messages || []
                }));
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        setCard(initialCard);
    }, [initialCard]);

    return (
        <ErrorBoundary>
            <GreetingCardPreviewContent card={card} />
        </ErrorBoundary>
    );
}
