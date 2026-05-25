import '../css/app.css';
import './bootstrap';

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

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => {
        const dynamicAppName = window.appName || import.meta.env.VITE_APP_NAME || 'Undangan Digital';
        if (title) {
            return title.includes(dynamicAppName) ? title : `${title} - ${dynamicAppName}`;
        }
        return dynamicAppName;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
