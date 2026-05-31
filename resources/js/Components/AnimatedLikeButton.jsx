import { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

/**
 * AnimatedLikeButton
 * Props:
 *   - count: current like count (number)
 *   - liked: boolean, is this already liked?
 *   - onClick: async function to call on toggle
 */
export default function AnimatedLikeButton({ count = 0, liked = false, onClick }) {
    const [burst, setBurst] = useState(false);
    const [displayCount, setDisplayCount] = useState(count);
    const [tickDir, setTickDir] = useState(null); // 'up' | 'down'
    const prevCount = useRef(count);
    const timeoutRef = useRef(null);

    // Animate counter when count changes
    useEffect(() => {
        if (count !== prevCount.current) {
            setTickDir(count > prevCount.current ? 'up' : 'down');
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setDisplayCount(count);
                setTickDir(null);
            }, 20); // tiny delay so CSS has time to mount
        }
        prevCount.current = count;
    }, [count]);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!liked) {
            setBurst(true);
            setTimeout(() => setBurst(false), 650);
        }

        if (onClick) await onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative flex items-center gap-1.5 text-[11px] font-semibold 
                transition-all duration-300 select-none group/like
                ${liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}
            `}
            style={{ fontVariantNumeric: 'tabular-nums' }}
        >
            {/* ───── Heart + Burst Ring ───── */}
            <span className="relative flex items-center justify-center w-6 h-6">
                {/* Burst ring animation */}
                {burst && (
                    <span
                        className="absolute inset-0 rounded-full bg-rose-400 opacity-0"
                        style={{ animation: 'like-burst 0.6s ease-out forwards' }}
                    />
                )}

                {/* Small flying particles on like */}
                {burst && (
                    <>
                        {[...Array(6)].map((_, i) => (
                            <span
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-rose-400"
                                style={{
                                    animation: `like-particle-${i} 0.55s ease-out forwards`,
                                    '--deg': `${i * 60}deg`,
                                }}
                            />
                        ))}
                    </>
                )}

                {/* Heart icon */}
                <Heart
                    fill={liked ? 'currentColor' : 'none'}
                    className={`
                        w-3.5 h-3.5 relative z-10
                        transition-all duration-300
                        ${liked ? 'text-rose-500 scale-110' : 'text-gray-400 group-hover/like:text-rose-400'}
                        ${burst ? 'animate-like-pop' : ''}
                    `}
                />
            </span>

            {/* ───── Animated Counter ───── */}
            <span
                className="relative overflow-hidden"
                style={{ height: '1.1em', display: 'inline-flex', alignItems: 'center' }}
            >
                <span
                    key={displayCount}
                    className="inline-block"
                    style={{
                        animation: tickDir === 'up'
                            ? 'count-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                            : tickDir === 'down'
                            ? 'count-down 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                            : 'none',
                    }}
                >
                    {displayCount.toLocaleString('id-ID')}
                </span>
            </span>

            {/* Inline keyframes */}
            <style>{`
                @keyframes like-burst {
                    0% { transform: scale(0); opacity: 0.6; }
                    70% { transform: scale(2.5); opacity: 0.15; }
                    100% { transform: scale(3); opacity: 0; }
                }

                @keyframes animate-like-pop {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(1.5); }
                    70%  { transform: scale(0.85); }
                    100% { transform: scale(1.1); }
                }

                @keyframes count-up {
                    0%   { opacity: 0; transform: translateY(60%); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes count-down {
                    0%   { opacity: 0; transform: translateY(-60%); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* Particle animations */
                @keyframes like-particle-0 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(0,-14px) scale(0);opacity:0} }
                @keyframes like-particle-1 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(12px,-8px) scale(0);opacity:0} }
                @keyframes like-particle-2 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(12px,8px) scale(0);opacity:0} }
                @keyframes like-particle-3 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(0,14px) scale(0);opacity:0} }
                @keyframes like-particle-4 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(-12px,8px) scale(0);opacity:0} }
                @keyframes like-particle-5 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(-12px,-8px) scale(0);opacity:0} }
            `}</style>
        </button>
    );
}
