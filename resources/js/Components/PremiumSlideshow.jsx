import React, { useState, useEffect } from 'react';

/**
 * PremiumSlideshow Component
 * High performance hardware-accelerated image slideshow with Ken Burns (zoom-out) and cross-fade.
 * Falls back cleanly to a single image without animation loops if only 1 image is provided.
 */
export default function PremiumSlideshow({
    images = [],
    className = 'absolute inset-0 z-0',
    imgClassName = 'absolute inset-0 w-full h-full object-cover',
    interval = 6000,
    transitionDuration = 2000, // 2s transition
    positionX = 50,
    positionY = 50,
    zoom = 1.0,
    overlayGradient = null // Option to pass a background styling for overlay
}) {
    // Filter out invalid/empty image strings
    const validImages = (Array.isArray(images) ? images : [])
        .map(img => img ? img.trim() : '')
        .filter(Boolean);

    if (validImages.length === 0) return null;

    if (validImages.length === 1) {
        return (
            <div className={className}>
                <img
                    src={validImages[0]}
                    alt=""
                    className={imgClassName}
                    style={{
                        objectPosition: `${positionX ?? 50}% ${positionY ?? 50}%`,
                        transform: `scale(${zoom ?? 1.0})`,
                    }}
                />
                {overlayGradient && (
                    <div className="absolute inset-0 z-[1]" style={overlayGradient} />
                )}
            </div>
        );
    }

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % validImages.length);
        }, interval);

        return () => clearInterval(timer);
    }, [validImages.length, interval]);

    return (
        <div className={`${className} overflow-hidden`}>
            {validImages.map((src, index) => {
                const isActive = index === activeIndex;
                
                // Style for premium Ken Burns effect + cross-fade
                const style = {
                    objectPosition: `${positionX ?? 50}% ${positionY ?? 50}%`,
                    transition: `opacity ${transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${interval + transitionDuration}ms linear`,
                    opacity: isActive ? 1 : 0,
                    transform: isActive 
                        ? `scale(${zoom ?? 1.0})` 
                        : `scale(${(zoom ?? 1.0) * 1.08})`,
                    zIndex: isActive ? 1 : 0,
                };

                return (
                    <img
                        key={`${src}-${index}`}
                        src={src}
                        alt=""
                        className={imgClassName}
                        style={style}
                    />
                );
            })}
            {overlayGradient && (
                <div className="absolute inset-0 z-[2]" style={overlayGradient} />
            )}
        </div>
    );
}
