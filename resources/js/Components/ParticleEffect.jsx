import { useMemo } from 'react';

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
};

const SPEED_MAP = { slow: 22, normal: 15, fast: 9 };

// Simple SVG markup strings for each particle type
const svgShapes = {
    snow: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke="rgba(164,210,230,${op})" stroke-width="1.5" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`,
    sakura: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><ellipse cx="10" cy="7" rx="4" ry="7" fill="rgba(245,171,198,${op})" transform="rotate(0 10 10)"/><ellipse cx="10" cy="7" rx="4" ry="7" fill="rgba(240,150,180,${op})" transform="rotate(72 10 10)"/><ellipse cx="10" cy="7" rx="4" ry="7" fill="rgba(245,171,198,${op})" transform="rotate(144 10 10)"/><ellipse cx="10" cy="7" rx="4" ry="7" fill="rgba(240,150,180,${op})" transform="rotate(216 10 10)"/><ellipse cx="10" cy="7" rx="4" ry="7" fill="rgba(245,171,198,${op})" transform="rotate(288 10 10)"/><circle cx="10" cy="10" r="2" fill="rgba(220,120,150,${op})"/></svg>`,
    leaves: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><path d="M3 17S3 7 10 3c7 4 7 14 7 14" fill="none" stroke="rgba(120,180,80,${op})" stroke-width="1.5"/><path d="M3 17S5 10 10 6c5 4 7 11 7 11" fill="rgba(110,170,70,${op * 0.6})"/><line x1="10" y1="6" x2="10" y2="17" stroke="rgba(90,140,60,${op})" stroke-width="1"/></svg>`,
    rose: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><circle cx="10" cy="8" r="3" fill="rgba(220,60,60,${op})"/><circle cx="7.5" cy="10" r="2.8" fill="rgba(200,50,50,${op})"/><circle cx="12.5" cy="10" r="2.8" fill="rgba(230,70,70,${op})"/><circle cx="10" cy="12" r="2.5" fill="rgba(210,55,55,${op})"/><path d="M10 14 L9 18 Q10 19 11 18 Z" fill="rgba(80,140,60,${op})"/></svg>`,
    stars: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.8 5.6 21.2 8 14 2 9.2h7.6z" fill="rgba(250,200,50,${op})"/></svg>`,
    hearts: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="rgba(230,70,130,${op})"/></svg>`,
    confetti: (sz, op) => {
        const colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bcb','#a66cff'];
        const c = colors[Math.floor(Math.random() * colors.length)];
        return `<svg width="${sz * 0.6}" height="${sz * 0.4}" viewBox="0 0 12 8"><rect width="12" height="8" rx="1.5" fill="${c}" opacity="${op}"/></svg>`;
    },
    butterfly: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><path d="M12 12c-2.5-4-7-5.5-8-3.5s1 5 3 7c1 1 3.5 1.5 5 0" fill="rgba(162,155,254,${op})"/><path d="M12 12c2.5-4 7-5.5 8-3.5s-1 5-3 7c-1 1-3.5 1.5-5 0" fill="rgba(130,120,230,${op})"/><line x1="12" y1="6" x2="12" y2="18" stroke="rgba(100,90,180,${op})" stroke-width="0.8"/></svg>`,
    flower: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 20 20"><ellipse cx="10" cy="5" rx="3" ry="5" fill="rgba(250,120,170,${op})"/><ellipse cx="15" cy="10" rx="5" ry="3" fill="rgba(245,130,175,${op})"/><ellipse cx="10" cy="15" rx="3" ry="5" fill="rgba(250,120,170,${op})"/><ellipse cx="5" cy="10" rx="5" ry="3" fill="rgba(245,130,175,${op})"/><circle cx="10" cy="10" r="2.5" fill="rgba(255,200,60,${op})"/></svg>`,
    sparkle: (sz, op) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24"><path d="M12 2L14 9L21 12L14 15L12 22L10 15L3 12L10 9Z" fill="rgba(255,215,0,${op})"/></svg>`,
};

export default function ParticleEffect({ type = 'snow', count = 30, speed = 'normal' }) {
    if (!PARTICLE_MAP[type]) return null;

    const baseDur = SPEED_MAP[speed] || 15;

    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => {
            const left = (Math.random() * 104 - 2).toFixed(1);
            const delay = (Math.random() * baseDur).toFixed(1);
            const dur = (baseDur + Math.random() * 8 - 2).toFixed(1);
            const size = Math.round(10 + Math.random() * 10);
            const drift = Math.round(-50 + Math.random() * 100);
            const opacity = (0.35 + Math.random() * 0.45).toFixed(2);
            const sway = Math.round(15 + Math.random() * 25);
            const html = svgShapes[type](size, parseFloat(opacity));
            return { id: i, left, delay, dur, drift, sway, html };
        });
    }, [type, count, baseDur]);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 15, overflow: 'hidden' }} aria-hidden="true">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pDrop {
                    0%   { transform: translateY(0) translateX(0) rotate(0deg); }
                    25%  { transform: translateY(27.5vh) translateX(calc(var(--sw) * 1px)) rotate(90deg); }
                    50%  { transform: translateY(55vh) translateX(calc(var(--sw) * -0.5px)) rotate(180deg); }
                    75%  { transform: translateY(82.5vh) translateX(calc(var(--sw) * 0.8px)) rotate(270deg); }
                    100% { transform: translateY(110vh) translateX(calc(var(--dr) * 1px)) rotate(360deg); }
                }
                @keyframes pFade {
                    0%   { opacity: 0; }
                    8%   { opacity: 1; }
                    88%  { opacity: 1; }
                    100% { opacity: 0; }
                }
                .pdrop {
                    position: absolute;
                    top: -30px;
                    animation:
                        pDrop var(--d) linear var(--dl) infinite,
                        pFade var(--d) ease var(--dl) infinite;
                    will-change: transform;
                    line-height: 0;
                }
            ` }} />
            {particles.map(p => (
                <div key={p.id} className="pdrop"
                    style={{
                        left: `${p.left}%`,
                        '--d': `${p.dur}s`,
                        '--dl': `${p.delay}s`,
                        '--dr': p.drift,
                        '--sw': p.sway,
                    }}
                    dangerouslySetInnerHTML={{ __html: p.html }}
                />
            ))}
        </div>
    );
}

export { PARTICLE_MAP };
