import { useEffect, useRef, useMemo } from 'react';

const PARTICLE_MAP = {
    snow:     { name: 'Salju' },
    sakura:   { name: 'Sakura' },
    leaves:   { name: 'Daun' },
    rose:     { name: 'Mawar' },
    stars:    { name: 'Bintang' },
    hearts:   { name: 'Hati' },
    confetti: { name: 'Confetti' },
    butterfly:{ name: 'Kupu-kupu' },
    flower:   { name: 'Bunga' },
    sparkle:  { name: 'Sparkle' },
    birds:    { name: 'Burung' },
};

const SPEED_MAP = { slow: 22, normal: 15, fast: 9 };

export default function ParticleEffect({ type = 'snow', count = 30, speed = 'normal' }) {
    if (!PARTICLE_MAP[type]) return null;

    const baseDur = SPEED_MAP[speed] || 15;

    const birdsList = useMemo(() => {
        if (type !== 'birds') return [];
        return Array.from({ length: count }, (_, i) => {
            const scale = (0.2 + Math.random() * 0.65).toFixed(2);
            const opacity = (0.2 + parseFloat(scale) * 0.6).toFixed(2);
            const delay = (Math.random() * 35).toFixed(1);
            const dur = (baseDur + Math.random() * 8 - 4).toFixed(1);
            const pathType = Math.floor(Math.random() * 3);
            const topStart = Math.round(55 + Math.random() * 35);
            const topEnd = Math.round(5 + Math.random() * 25);
            const leftStart = Math.round(5 + Math.random() * 40);
            const leftEnd = Math.round(55 + Math.random() * 40);
            const flapDur = (0.15 + (1 - parseFloat(scale)) * 0.35).toFixed(2);
            return {
                id: i,
                scale,
                opacity,
                delay,
                dur,
                pathType,
                topStart,
                topEnd,
                leftStart,
                leftEnd,
                flapDur
            };
        });
    }, [type, count, baseDur]);

    const canvasRef = useRef(null);

    useEffect(() => {
        if (type === 'birds') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const resize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);

        const speedFactor = 15 / baseDur;

        const pinks = ['rgba(255, 174, 185, ', 'rgba(255, 192, 203, ', 'rgba(255, 182, 193, ', 'rgba(245, 218, 226, ', 'rgba(255, 209, 225, '];
        const greens = ['rgba(110, 170, 70, ', 'rgba(120, 180, 80, ', 'rgba(90, 140, 60, ', 'rgba(130, 190, 90, '];
        const reds = ['rgba(220, 60, 60, ', 'rgba(200, 50, 50, ', 'rgba(230, 70, 70, ', 'rgba(210, 55, 55, '];
        const golds = ['rgba(250, 200, 50, ', 'rgba(255, 215, 0, ', 'rgba(240, 190, 30, '];
        const pinksReds = ['rgba(230, 70, 130, ', 'rgba(255, 75, 140, ', 'rgba(220, 50, 100, ', 'rgba(240, 100, 160, '];
        const confettiColors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcb','#a66cff'];
        const purples = ['rgba(162, 155, 254, ', 'rgba(130, 120, 230, ', 'rgba(145, 130, 240, '];
        const flowerPinks = ['rgba(250, 120, 170, ', 'rgba(245, 130, 175, ', 'rgba(255, 140, 190, '];
        const sparkleGolds = ['rgba(255, 215, 0, ', 'rgba(255, 230, 100, ', 'rgba(250, 200, 50, '];

        class Particle {
            constructor() { this.reset(true); }

            reset(isInit = false) {
                this.x = Math.random() * width;
                this.y = isInit ? Math.random() * height : -30;
                this.size = Math.round(10 + Math.random() * 10);
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                this.speedY = (0.6 + Math.random() * 1.0) * speedFactor;
                this.speedX = (-0.4 + Math.random() * 0.8) * speedFactor;
                this.swingSpeed = 0.008 + Math.random() * 0.015;
                this.swingAngle = Math.random() * Math.PI;
                this.opacity = 0.45 + Math.random() * 0.45;

                if (type === 'sakura') {
                    this.colorBase = pinks[Math.floor(Math.random() * pinks.length)];
                    this.radiusX = this.size / 2;
                    this.radiusY = this.size / 3.5;
                } else if (type === 'leaves') this.colorBase = greens[Math.floor(Math.random() * greens.length)];
                else if (type === 'rose') this.colorBase = reds[Math.floor(Math.random() * reds.length)];
                else if (type === 'stars') this.colorBase = golds[Math.floor(Math.random() * golds.length)];
                else if (type === 'hearts') this.colorBase = pinksReds[Math.floor(Math.random() * pinksReds.length)];
                else if (type === 'confetti') this.colorBase = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                else if (type === 'butterfly') this.colorBase = purples[Math.floor(Math.random() * purples.length)];
                else if (type === 'flower') this.colorBase = flowerPinks[Math.floor(Math.random() * flowerPinks.length)];
                else if (type === 'sparkle') this.colorBase = sparkleGolds[Math.floor(Math.random() * sparkleGolds.length)];
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
                        this.x += Math.cos(angle) * force * 5.0;
                        this.y += Math.sin(angle) * force * 3.0;
                    }
                }
                if (this.y > height + 30 || this.x < -30 || this.x > width + 30) this.reset(false);
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                if (type === 'snow') {
                    ctx.strokeStyle = `rgba(164, 210, 230, ${this.opacity})`;
                    ctx.lineWidth = 1.5;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(-this.size/2, 0); ctx.lineTo(this.size/2, 0);
                    ctx.moveTo(0, -this.size/2); ctx.lineTo(0, this.size/2);
                    ctx.moveTo(-this.size/2 * 0.7, -this.size/2 * 0.7); ctx.lineTo(this.size/2 * 0.7, this.size/2 * 0.7);
                    ctx.moveTo(this.size/2 * 0.7, -this.size/2 * 0.7); ctx.lineTo(-this.size/2 * 0.7, this.size/2 * 0.7);
                    ctx.stroke();
                } else if (type === 'sakura') {
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = 'rgba(255, 182, 193, 0.35)';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(-this.radiusX, 0);
                    ctx.quadraticCurveTo(0, -this.radiusY * 0.15, this.radiusX, 0);
                    ctx.strokeStyle = 'rgba(255, 90, 150, 0.25)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else if (type === 'leaves') {
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size/2);
                    ctx.quadraticCurveTo(this.size/3, -this.size/6, 0, this.size/2);
                    ctx.quadraticCurveTo(-this.size/3, -this.size/6, 0, -this.size/2);
                    ctx.fillStyle = this.colorBase + (this.opacity * 0.6) + ')';
                    ctx.fill();
                    ctx.strokeStyle = this.colorBase + this.opacity + ')';
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size/2 + 2);
                    ctx.lineTo(0, this.size/2 - 2);
                    ctx.strokeStyle = `rgba(90, 140, 60, ${this.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                } else if (type === 'rose') {
                    ctx.fillStyle = `rgba(80, 140, 60, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(0, this.size*0.2);
                    ctx.lineTo(-this.size*0.1, this.size*0.4);
                    ctx.quadraticCurveTo(0, this.size*0.45, this.size*0.1, this.size*0.4);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath(); ctx.arc(0, -this.size*0.1, this.size*0.15, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = `rgba(200, 50, 50, ${this.opacity})`;
                    ctx.beginPath(); ctx.arc(-this.size*0.125, 0, this.size*0.14, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = `rgba(230, 70, 70, ${this.opacity})`;
                    ctx.beginPath(); ctx.arc(this.size*0.125, 0, this.size*0.14, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = `rgba(210, 55, 55, ${this.opacity})`;
                    ctx.beginPath(); ctx.arc(0, this.size*0.1, this.size*0.125, 0, Math.PI * 2); ctx.fill();
                } else if (type === 'stars') {
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * this.size/2, -Math.sin((18 + i * 72) * Math.PI / 180) * this.size/2);
                        ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * this.size/4, -Math.sin((54 + i * 72) * Math.PI / 180) * this.size/4);
                    }
                    ctx.closePath();
                    ctx.fill();
                } else if (type === 'hearts') {
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath();
                    const topY = -this.size * 0.25;
                    ctx.moveTo(0, this.size * 0.4);
                    ctx.bezierCurveTo(-this.size * 0.5, this.size * 0.05, -this.size * 0.5, -this.size * 0.4, -this.size * 0.22, -this.size * 0.4);
                    ctx.bezierCurveTo(0, -this.size * 0.4, 0, topY, 0, topY);
                    ctx.bezierCurveTo(0, topY, 0, -this.size * 0.4, this.size * 0.22, -this.size * 0.4);
                    ctx.bezierCurveTo(this.size * 0.5, -this.size * 0.4, this.size * 0.5, this.size * 0.05, 0, this.size * 0.4);
                    ctx.closePath();
                    ctx.fill();
                } else if (type === 'confetti') {
                    ctx.fillStyle = this.colorBase;
                    ctx.globalAlpha = this.opacity;
                    ctx.fillRect(-this.size*0.3, -this.size*0.2, this.size*0.6, this.size*0.4);
                } else if (type === 'butterfly') {
                    // Left wings (Primary color base)
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath();
                    // Left Upper Wing
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(-this.size * 0.2, -this.size * 0.6, -this.size * 0.8, -this.size * 0.5, -this.size * 0.6, -this.size * 0.1);
                    ctx.bezierCurveTo(-this.size * 0.4, 0, -this.size * 0.2, 0, 0, 0);
                    // Left Lower Wing
                    ctx.bezierCurveTo(-this.size * 0.2, 0, -this.size * 0.6, this.size * 0.1, -this.size * 0.5, this.size * 0.4);
                    ctx.bezierCurveTo(-this.size * 0.3, this.size * 0.5, -this.size * 0.1, this.size * 0.3, 0, 0);
                    ctx.fill();

                    // Right wings (Accent pink-rose tone, dual-toned)
                    ctx.fillStyle = `rgba(192, 122, 151, ${this.opacity})`;
                    ctx.beginPath();
                    // Right Upper Wing
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(this.size * 0.2, -this.size * 0.6, this.size * 0.8, -this.size * 0.5, this.size * 0.6, -this.size * 0.1);
                    ctx.bezierCurveTo(this.size * 0.4, 0, this.size * 0.2, 0, 0, 0);
                    // Right Lower Wing
                    ctx.bezierCurveTo(this.size * 0.2, 0, this.size * 0.6, this.size * 0.1, this.size * 0.5, this.size * 0.4);
                    ctx.bezierCurveTo(this.size * 0.3, this.size * 0.5, this.size * 0.1, this.size * 0.3, 0, 0);
                    ctx.fill();

                    // Slender body
                    ctx.strokeStyle = `rgba(108, 82, 123, ${this.opacity})`;
                    ctx.lineWidth = 1.0;
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 0.35);
                    ctx.lineTo(0, this.size * 0.3);
                    ctx.stroke();

                    // Slender antennae
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 0.35);
                    ctx.quadraticCurveTo(-this.size * 0.15, -this.size * 0.5, -this.size * 0.2, -this.size * 0.45);
                    ctx.moveTo(0, -this.size * 0.35);
                    ctx.quadraticCurveTo(this.size * 0.15, -this.size * 0.5, this.size * 0.2, -this.size * 0.45);
                    ctx.stroke();
                } else if (type === 'flower') {
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath(); ctx.ellipse(0, -this.size*0.25, this.size*0.15, this.size*0.25, 0, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.ellipse(0, this.size*0.25, this.size*0.15, this.size*0.25, 0, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = `rgba(245, 130, 175, ${this.opacity})`;
                    ctx.beginPath(); ctx.ellipse(this.size*0.25, 0, this.size*0.25, this.size*0.15, 0, 0, Math.PI*2); ctx.fill();
                    ctx.beginPath(); ctx.ellipse(-this.size*0.25, 0, this.size*0.25, this.size*0.15, 0, 0, Math.PI*2); ctx.fill();
                    ctx.fillStyle = `rgba(255, 200, 60, ${this.opacity})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size*0.125, 0, Math.PI*2);
                    ctx.fill();
                } else if (type === 'sparkle') {
                    ctx.fillStyle = this.colorBase + this.opacity + ')';
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size/2);
                    ctx.quadraticCurveTo(0, 0, this.size/2, 0);
                    ctx.quadraticCurveTo(0, 0, 0, this.size/2);
                    ctx.quadraticCurveTo(0, 0, -this.size/2, 0);
                    ctx.quadraticCurveTo(0, 0, 0, -this.size/2);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        const particles = Array.from({ length: count }, () => new Particle());
        let mouseX = null, mouseY = null;
        const handlePointerMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
        const handlePointerEnd = () => { mouseX = null; mouseY = null; };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerleave', handlePointerEnd);
        window.addEventListener('pointerup', handlePointerEnd);
        window.addEventListener('pointercancel', handlePointerEnd);

        const loop = () => {
            animId = requestAnimationFrame(loop);
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(mouseX, mouseY); p.draw(); });
        };
        loop();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerleave', handlePointerEnd);
            window.removeEventListener('pointerup', handlePointerEnd);
            window.removeEventListener('pointercancel', handlePointerEnd);
        };
    }, [type, count, speed, baseDur]);

    if (type === 'birds') {
        return (
            <div className="sp-birds-container select-none" aria-hidden="true">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes spFlyUpRight {
                      0% { left: -10%; top: calc(var(--ts) * 1%); transform: scale(calc(var(--sc) * 0.6)) rotate(22deg); opacity: 0; }
                      10% { opacity: var(--op); }
                      90% { opacity: var(--op); }
                      100% { left: 110%; top: calc(var(--te) * 1%); transform: scale(var(--sc)) rotate(12deg); opacity: 0; }
                    }
                    @keyframes spFlyUpLeft {
                      0% { left: 110%; top: calc(var(--ts) * 1%); transform: scale(calc(var(--sc) * 0.6)) rotate(-22deg) scaleX(-1); opacity: 0; }
                      10% { opacity: var(--op); }
                      90% { opacity: var(--op); }
                      100% { left: -10%; top: calc(var(--te) * 1%); transform: scale(var(--sc)) rotate(-12deg) scaleX(-1); opacity: 0; }
                    }
                    @keyframes spFlyUpCenter {
                      0% { left: calc(var(--ls) * 1%); top: 105%; transform: scale(calc(var(--sc) * 0.5)) rotate(-5deg); opacity: 0; }
                      15% { opacity: var(--op); }
                      85% { opacity: var(--op); }
                      100% { left: calc(var(--le) * 1%); top: -15%; transform: scale(var(--sc)) rotate(5deg); opacity: 0; }
                    }
                    @keyframes spFlap {
                      0% { transform: scaleY(1); }
                      100% { transform: scaleY(-0.35) translateY(15%); }
                    }
                    .sp-birds-container { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 15; overflow: hidden; }
                    .sp-bird { position: absolute; opacity: 0; will-change: transform, left, top; }
                    .sp-bird-wings { transform-origin: 45px 25px; animation: spFlap var(--fd) ease-in-out infinite alternate; }
                ` }} />
                {birdsList.map(b => {
                    let animName = 'spFlyUpRight';
                    if (b.pathType === 1) animName = 'spFlyUpLeft';
                    else if (b.pathType === 2) animName = 'spFlyUpCenter';
                    return (
                        <div key={b.id} className="sp-bird" style={{ animation: `${animName} ${b.dur}s linear ${b.delay}s infinite`, '--sc': b.scale, '--op': b.opacity, '--ts': String(b.topStart), '--te': String(b.topEnd), '--ls': String(b.leftStart), '--le': String(b.leftEnd), '--fd': `${b.flapDur}s` }}>
                            <svg viewBox="0 0 100 50" className="w-12 h-6 text-[#2E3F54] dark:text-white" fill="currentColor">
                                <path className="sp-bird-wings" d="M 5,25 Q 25,5 45,25 Q 65,5 85,25 Q 65,15 45,25 Q 25,15 5,25 Z" />
                            </svg>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 15, overflow: 'hidden' }} aria-hidden="true">
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }} />
        </div>
    );
}

export { PARTICLE_MAP };
