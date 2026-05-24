import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * AnimatedCounter
 * Counts from 0 up to `target` when it enters the viewport.
 *
 * Props:
 *  - target: number (e.g. 5738)
 *  - suffix: string appended after (e.g. '+')
 *  - prefix: string prepended
 *  - duration: animation time in ms (default 1800)
 *  - format: 'number' | 'k' (rounds to k format)
 *  - className: additional class names
 */
export default function AnimatedCounter({
    target,
    suffix = '',
    prefix = '',
    duration = 1800,
    format = 'number',
    className = '',
}) {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.3 });
    const [count, setCount] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (!isVisible || started.current) return;
        started.current = true;

        const start = performance.now();
        const end = typeof target === 'string' ? parseFloat(target) : target;

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [isVisible, target, duration]);

    const display = format === 'k'
        ? count >= 1000 ? `${(count / 1000).toFixed(0)}k` : count
        : count.toLocaleString('id-ID');

    return (
        <span ref={ref} className={className}>
            {prefix}{display}{suffix}
        </span>
    );
}
