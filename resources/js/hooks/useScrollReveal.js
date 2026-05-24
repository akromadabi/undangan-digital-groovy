import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal
 * Returns a ref and a boolean `isVisible`.
 * When the element enters the viewport, `isVisible` becomes true.
 *
 * @param {number} threshold - 0-1, ratio of element visible
 * @param {string} rootMargin - CSS margin string for IntersectionObserver
 * @param {boolean} once - if true, stop observing once visible (default: true)
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return { ref, isVisible };
}
