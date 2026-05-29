import '../css/app.css';
import './bootstrap';

// GLOBAL DIAGNOSTICS: Intercept clicks and scan for blocking transparent overlays
if (typeof window !== 'undefined') {
    // 1. Click tracker (Capture Phase)
    window.addEventListener('click', (e) => {
        console.log("%c[CLICK TARGET]%c Clicked on element:", "color: white; background: #e5654b; font-weight: bold; padding: 2px 5px; border-radius: 3px;", "color: #333; font-weight: bold;", e.target);
        console.log("Element details:", {
            tagName: e.target.tagName,
            id: e.target.id,
            className: e.target.className,
            attributes: Array.from(e.target.attributes).map(a => `${a.name}="${a.value}"`),
            computedStyle: {
                position: window.getComputedStyle(e.target).position,
                zIndex: window.getComputedStyle(e.target).zIndex,
                pointerEvents: window.getComputedStyle(e.target).pointerEvents,
                display: window.getComputedStyle(e.target).display,
                visibility: window.getComputedStyle(e.target).visibility,
                opacity: window.getComputedStyle(e.target).opacity
            }
        });
        
        // Find if there's any blocker at the same click location
        const elementsAtPoint = document.elementsFromPoint ? document.elementsFromPoint(e.clientX, e.clientY) : [];
        console.log("Elements under mouse at click position:", elementsAtPoint);
    }, true);

    // 2. Periodic Scanner for transparent overlay blocks
    const scanForOverlays = () => {
        console.log("[DIAGNOSTICS] Scanning DOM for screen-covering elements...");
        const allElements = document.querySelectorAll('*');
        let foundAny = false;
        
        allElements.forEach((el) => {
            if (['HTML', 'BODY', 'IFRAME', 'SVG', 'PATH'].includes(el.tagName)) return;
            
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'absolute') {
                const rect = el.getBoundingClientRect();
                const coversWidth = rect.width >= window.innerWidth * 0.85;
                const coversHeight = rect.height >= window.innerHeight * 0.85;
                
                if (coversWidth && coversHeight) {
                    const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
                    const hasPointerEvents = style.pointerEvents !== 'none';
                    
                    if (isVisible && hasPointerEvents) {
                        foundAny = true;
                        console.warn("%c[BLOCKING OVERLAY DETECTED]%c Element is fixed/absolute, covers the screen, and accepts pointer events:", 
                            "color: white; background: red; font-weight: bold; padding: 2px 5px; border-radius: 3px;", 
                            "color: #b30000; font-weight: bold;", 
                            el
                        );
                        console.log("Overlay details:", {
                            id: el.id,
                            className: el.className,
                            zIndex: style.zIndex,
                            opacity: style.opacity,
                            background: style.backgroundColor,
                            rect: { width: rect.width, height: rect.height }
                        });
                        
                        // Visually highlight it in bright semi-transparent red with a dashed border
                        el.style.setProperty('outline', '5px dashed #ff0000', 'important');
                        el.style.setProperty('outline-offset', '-5px', 'important');
                        el.style.setProperty('background-color', 'rgba(255, 0, 0, 0.15)', 'important');
                        
                        // Add a visual label
                        if (!el.querySelector('.overlay-debug-label')) {
                            const label = document.createElement('div');
                            label.className = 'overlay-debug-label';
                            label.style.cssText = 'position: absolute; top: 10px; left: 10px; background: red; color: white; padding: 5px 10px; font-family: monospace; font-size: 12px; z-index: 100000; border-radius: 4px; pointer-events: none;';
                            label.textContent = `BLOCKER: <${el.tagName.toLowerCase()}> className: "${el.className}" z-index: ${style.zIndex}`;
                            el.appendChild(label);
                        }
                    }
                }
            }
        });
        
        if (!foundAny) {
            console.log("[DIAGNOSTICS] No blocking overlay detected covering >85% of screen.");
        }
    };
    
    window.addEventListener('load', () => {
        setTimeout(scanForOverlays, 1000);
        setTimeout(scanForOverlays, 3000);
        setTimeout(scanForOverlays, 6000);
    });
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(scanForOverlays, 1000);
    }
}

// Disable browser fullscreen in dashboard preview mockup (iframes) and hide fullscreen buttons
if (typeof window !== 'undefined' && window.self !== window.top) {
    if (Element.prototype.requestFullscreen) {
        Element.prototype.requestFullscreen = function() { return Promise.resolve(); };
    }
    if (HTMLHtmlElement.prototype.requestFullscreen) {
        HTMLHtmlElement.prototype.requestFullscreen = function() { return Promise.resolve(); };
    }
    if (document.exitFullscreen) {
        document.exitFullscreen = function() { return Promise.resolve(); };
    }

    const style = document.createElement('style');
    style.innerHTML = `
        .lx-fullscreen-btn-wrapper,
        button[title*="Layar"],
        button[title*="Penuh"],
        .nf-music-btn[title*="Layar"],
        .sp-float-fullscreen,
        .utary-floating__btn[title*="Layar"],
        .wy-floating-btn[title*="Layar"],
        .lx1-float-btn[title*="Layar"],
        .lx2-float-btn[title*="Layar"],
        .lx3-float-btn[title*="Layar"],
        .lx4-float-btn[title*="Layar"],
        .mu-floating-btn[title*="Layar"],
        .arn-float-btn[title*="Layar"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import FreeInvitationBadge from './Components/FreeInvitationBadge';

createInertiaApp({
    title: (title) => {
        const dynamicAppName = window.appName || import.meta.env.VITE_APP_NAME || 'Undangan Digital';
        if (title) {
            return title.includes(dynamicAppName) ? title : `${title} - ${dynamicAppName}`;
        }
        return dynamicAppName;
    },
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );

        if (name.startsWith('Invitation/') && name !== 'Invitation/Expired') {
            const OriginalDefault = page.default;
            const WrappedPage = (props) => {
                return (
                    <>
                        <OriginalDefault {...props} />
                        {props.show_free_badge && (
                            <FreeInvitationBadge 
                                brandName={props.brand_name} 
                                brandUrl={props.brand_url} 
                                trialExpiresAt={props.trial_expires_at}
                            />
                        )}
                    </>
                );
            };
            Object.assign(WrappedPage, OriginalDefault);
            return {
                ...page,
                default: WrappedPage
            };
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
