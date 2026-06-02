import React, { useState, useEffect } from 'react';

export default function PromoCountdown({ durationHours = 19, resellerRef = 'default' }) {
    const [difference, setDifference] = useState(0);

    useEffect(() => {
        const storageKey = `promo_countdown_target_${resellerRef}`;
        
        // Helper to get or set target time
        const getTargetTime = () => {
            const stored = localStorage.getItem(storageKey);
            const now = Date.now();
            
            if (stored) {
                const target = parseInt(stored, 10);
                // If the target is in the future, return it
                if (target > now) {
                    return target;
                }
            }
            
            // If expired or not set, set a new target
            const newTarget = now + (durationHours * 60 * 60 * 1000);
            localStorage.setItem(storageKey, newTarget.toString());
            return newTarget;
        };

        const targetTime = getTargetTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                // If countdown finishes, automatically reset it for evergreen effect (daily reset)
                const newTarget = now + (durationHours * 60 * 60 * 1000);
                localStorage.setItem(storageKey, newTarget.toString());
                setDifference(durationHours * 60 * 60 * 1000);
                return;
            }

            setDifference(diff);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [durationHours, resellerRef]);

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');

    return (
        <span className="rl-countdown-timer">
            <style dangerouslySetInnerHTML={{__html: `
                .rl-countdown-timer {
                    display: inline-flex;
                    align-items: center;
                    gap: 3px;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                    font-size: 0.75rem;
                    font-weight: 700;
                    vertical-align: middle;
                    margin-left: 6px;
                }
                .rl-countdown-icon {
                    margin-right: 2px;
                    font-size: 0.8rem;
                }
                .rl-countdown-box {
                    background: rgba(0, 0, 0, 0.25);
                    color: #ffffff;
                    padding: 2px 5px;
                    border-radius: 4px;
                    font-weight: bold;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    min-width: 20px;
                    text-align: center;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .rl-countdown-label {
                    font-size: 0.7rem;
                    opacity: 0.9;
                    font-weight: bold;
                    margin-right: 2px;
                }
            `}} />
            <span className="rl-countdown-icon">⏱️</span>
            <span className="rl-countdown-box">{pad(hours)}</span>
            <span className="rl-countdown-label">j</span>
            
            <span className="rl-countdown-box">{pad(minutes)}</span>
            <span className="rl-countdown-label">m</span>
            
            <span className="rl-countdown-box">{pad(seconds)}</span>
            <span className="rl-countdown-label">d</span>
        </span>
    );
}
