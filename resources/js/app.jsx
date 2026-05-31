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

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import FreeInvitationBadge from './Components/FreeInvitationBadge';

function GlobalImageCropSynchronizer({ invitation, brideGrooms }) {
    React.useEffect(() => {
        if (!invitation) return;

        const normalizeUrl = (url) => {
            if (!url) return '';
            let clean = url;
            try {
                if (url.startsWith('http://') || url.startsWith('https://')) {
                    clean = new URL(url).pathname;
                }
            } catch (e) {}
            clean = clean.split('?')[0].split('#')[0];
            clean = clean.replace(/^\/+|\/+$/g, '');
            if (clean.startsWith('storage/')) {
                clean = clean.substring(8);
            }
            return clean;
        };

        const groom = Array.isArray(brideGrooms) ? brideGrooms.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') : null;
        const bride = Array.isArray(brideGrooms) ? brideGrooms.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') : null;

        const cropSettings = {
            cover: invitation.cover_image ? {
                urls: String(invitation.cover_image).split(',').map(normalizeUrl),
                posX: Number(invitation.cover_position_x ?? 50),
                posY: Number(invitation.cover_position_y ?? 50),
                zoom: Number(invitation.cover_zoom ?? 1.0)
            } : null,
            opening: invitation.opening_image ? {
                urls: String(invitation.opening_image).split(',').map(normalizeUrl),
                posX: Number(invitation.opening_position_x ?? 50),
                posY: Number(invitation.opening_position_y ?? 50),
                zoom: Number(invitation.opening_zoom ?? 1.0)
            } : null,
            groom: groom && groom.photo ? {
                url: normalizeUrl(groom.photo),
                posX: Number(groom.photo_position_x ?? 50),
                posY: Number(groom.photo_position_y ?? 50),
                zoom: Number(groom.photo_zoom ?? 1.0)
            } : null,
            bride: bride && bride.photo ? {
                url: normalizeUrl(bride.photo),
                posX: Number(bride.photo_position_x ?? 50),
                posY: Number(bride.photo_position_y ?? 50),
                zoom: Number(bride.photo_zoom ?? 1.0)
            } : null,
        };

        const hasWord = (str, word) => {
            if (!str || !word) return false;
            return str.split(/[^a-zA-Z0-9]+/).includes(word);
        };

        const determineTargetCategory = (img, src, normalizedUrl) => {
            const alt = (img.getAttribute('alt') || '').toLowerCase();
            const className = (img.className || '').toLowerCase();

            // Check alt text first
            if (groom) {
                const gFull = String(groom.full_name || '').toLowerCase();
                const gNick = String(groom.nickname || '').toLowerCase();
                if ((gFull && alt.includes(gFull)) || (gNick && hasWord(alt, gNick))) {
                    return 'groom';
                }
            }
            if (bride) {
                const bFull = String(bride.full_name || '').toLowerCase();
                const bNick = String(bride.nickname || '').toLowerCase();
                if ((bFull && alt.includes(bFull)) || (bNick && hasWord(alt, bNick))) {
                    return 'bride';
                }
            }

            // Traverse parent hierarchy to inspect parent classnames and text content
            let parentClass = '';
            let parentText = '';
            let current = img.parentElement;
            for (let i = 0; i < 3 && current; i++) {
                parentClass += ' ' + (current.className || '').toLowerCase();
                parentText += ' ' + (current.textContent || '').toLowerCase();
                current = current.parentElement;
            }

            // Classname/alt explicitly mentioning gender
            const isGroom = alt.includes('groom') || alt.includes('pria') ||
                            className.includes('groom') || className.includes('pria') ||
                            parentClass.includes('groom') || parentClass.includes('pria') ||
                            parentClass.includes('male');
            const isBride = alt.includes('bride') || alt.includes('wanita') ||
                            className.includes('bride') || className.includes('wanita') ||
                            parentClass.includes('bride') || parentClass.includes('wanita') ||
                            parentClass.includes('female');

            if (isGroom && !isBride) return 'groom';
            if (isBride && !isGroom) return 'bride';

            // Text content of nearby elements
            const hasGroomText = parentText.includes('mempelai pria') || parentText.includes('putra');
            const hasBrideText = parentText.includes('mempelai wanita') || parentText.includes('putri');

            if (hasGroomText && !hasBrideText) return 'groom';
            if (hasBrideText && !hasGroomText) return 'bride';

            // Fallback for cover or opening slideshow
            const isCover = className.includes('cover') || parentClass.includes('cover') || className.includes('hero') || parentClass.includes('hero');
            const isOpening = className.includes('opening') || parentClass.includes('opening');
            
            if (isCover) return 'cover';
            if (isOpening) return 'opening';

            return null;
        };

        const applyCrops = () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.closest('.crop-editor-workspace') || img.closest('.preview-canvas')) {
                    return;
                }
                const src = img.getAttribute('src');
                if (!src) return;

                const normalized = normalizeUrl(src);

                let settings = null;
                const category = determineTargetCategory(img, src, normalized);

                if (category && cropSettings[category] && 
                    (category === 'cover' || category === 'opening' 
                        ? cropSettings[category].urls.includes(normalized)
                        : cropSettings[category].url === normalized)) {
                    settings = cropSettings[category];
                } else {
                    // Fallback to match by URL alone if category couldn't be determined cleanly
                    if (cropSettings.groom && cropSettings.groom.url === normalized) {
                        settings = cropSettings.groom;
                    } else if (cropSettings.bride && cropSettings.bride.url === normalized) {
                        settings = cropSettings.bride;
                    } else if (cropSettings.cover && cropSettings.cover.urls.includes(normalized)) {
                        settings = cropSettings.cover;
                    } else if (cropSettings.opening && cropSettings.opening.urls.includes(normalized)) {
                        settings = cropSettings.opening;
                    }
                }

                if (settings) {
                    const { posX, posY, zoom } = settings;
                    if (zoom > 1.0 || posX !== 50 || posY !== 50) {
                        img.style.objectFit = 'cover';
                        img.style.objectPosition = `${posX}% ${posY}%`;
                        img.style.transform = `scale(${zoom}) translate(${(50 - posX) * (1 - 1 / zoom)}%, ${(50 - posY) * (1 - 1 / zoom)}%)`;
                        img.style.transformOrigin = 'center';

                        const parent = img.parentElement;
                        if (parent) {
                            parent.style.overflow = 'hidden';
                        }
                    }
                }
            });
        };

        applyCrops();

        const observer = new MutationObserver(() => {
            applyCrops();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        window.addEventListener('resize', applyCrops);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', applyCrops);
        };
    }, [invitation, brideGrooms]);

    return null;
}

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
                        <GlobalImageCropSynchronizer 
                            invitation={props.invitation} 
                            brideGrooms={props.brideGrooms} 
                        />
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
