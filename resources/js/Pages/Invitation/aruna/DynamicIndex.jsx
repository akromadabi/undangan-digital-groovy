import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import ParticleEffect from '@/Components/ParticleEffect';
import './style.css';

// Asset imports
import ornamentLeft from './asset/Aruna-Tree-6-1-150x150.webp';
import ornamentRight from './asset/Aruna-Tree-6-1-150x150.webp';
import dividerPattern from './asset/Aruna-Engraving.webp';
import frameProfile from './asset/Aruna-Frame-Mempelai.webp';
import couplePhoto from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import maskProfile from './asset/mask-profile.webp'; 
import flowerLeft from './asset/Aruna-Bunga-7-1-188x300.webp';
import flowerRight from './asset/Aruna-Bunga-300x287.webp';
import eventFrameTop from './asset/Aruna-LACE-2-1-768x1137.webp';
import eventFrameBottom from './asset/Aruna-LACE-2-1-768x1137.webp';
import waxSeal from './asset/Aruna-WAX-SEAL-3-1.webp';
import aruna1 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna2 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna3 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna4 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import aruna5 from './asset/Bagas-Naila-LIBLOP-PICTURE-2620927.webp';
import aruna6 from './asset/Bagas-Naila-LIBLOP-PICTURE-2630245.webp';
import rambatOrnament from './asset/Aruna-Rambat-1.webp';
import janurOrnament from './asset/Aruna-Janur-2.webp';
import coverBg from './asset/Aruna-BACKGROUND-PARRALAX-1.webp';
import floralTL from './asset/Aruna-Group-Floral-4-2.webp';
import floralBottomLarge from './asset/Aruna-Group-Floral-3-HD-New.webp';
import heritageTreeGold from './asset/Heritage-Tree-Gold.webp';
import coverTreeLeft from './asset/Aruna-Tree-5-1.webp';
import batikOrnament from './asset/Aruna-Batik-2-1.webp';

/* ─────────────────────────────────────────────
   HELPERS & DESIGN TOKENS
   ───────────────────────────────────────────── */
function getStorageUrl(url, fallback) {
    if (!url) return fallback;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }
    return `/storage/${url.replace(/^\//, '')}`;
}

function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

const ASSETS = {
    cover: coverBg,
    groom: aruna2,
    bride: aruna1,
    divider: dividerPattern,
    frame: frameProfile,
    flowerLeft: flowerLeft,
    flowerRight: flowerRight,
    janur: janurOrnament,
    rambat: rambatOrnament,
    batik: batikOrnament,
    monogram: waxSeal,
};

/* ─────────────────────────────────────────────
   Monogram Seal (Wax Seal)
   ───────────────────────────────────────────── */
function MonogramShield() {
    return (
        <div className="aruna-cover__monogram">
            <img src={waxSeal} alt="Wax Seal" className="aruna-cover__wax-seal" />
        </div>
    );
}

function StarDivider() {
    return (
        <div className="aruna-divider-star">
            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 200 200" width="40px" height="40px">
                <path fill="#847d4a" d="m63.275,107.786c2.14-11.952,4.129-17.968,5.965-6.016c1.688,11.008,1.488,4.122,2.029,5.707c0.588,0.582,1.035-1.53,5.459-4.312c9.135-7.418,12.347-3.032,3.318-7.619c4.421-11.522,6.497-3.903,2.077-7.868c4.066-11.895,5.961-12.855,5.296,5.115-13.036Z"/>
                <path fill="#847d4a" d="m136.725,92.214c-2.14,11.952-4.129,17.968-5.965,6.016c-1.688-11.008-1.488-4.122-2.029-5.707c-0.588-0.582-1.035,1.53-5.459,4.312c-9.135,7.418,12.347,3.032-3.318,7.619c-4.421,11.522-6.497,3.903-2.077,7.868c-4.066,11.895-5.961,12.855-5.296-5.115,13.036Z"/>
                <path fill="#847d4a" d="m107.786,136.725c-11.952-2.14-17.968-4.129-6.016-5.965c11.008-1.688,4.122-1.488,5.707-2.029c0.582-0.588-1.53-1.035-4.312-5.459c-7.418-9.135-3.032-12.347-7.619-3.318c-11.522-4.421-3.903-6.497-7.868-2.077c-11.895-4.066-12.855-5.961,5.115-5.296,13.036,13.036Z"/>
                <path fill="#847d4a" d="m92.214,63.275c11.952,2.14,17.968,4.129,6.016,5.965c-11.008,1.688-4.122,1.488-5.707,2.029c-0.582,0.588,1.53,1.035,4.312,5.459c7.418,9.135,3.032,12.347,7.619,3.318c11.522,4.421,3.903,6.497,7.868,2.077c11.895,4.066,12.855,5.961-5.115,5.296-13.036-13.036Z"/>
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Ornament Guard SVG (for RSVP & Gift sections)
   ───────────────────────────────────────────── */
function OrnamentGuardTop() {
    return (
        <div className="aruna-ornament-guard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.46 29.54" style={{ width: '100%', display: 'block' }}>
                <path fill="#c8b680" d="M2,29.54c14.94-.52,27-12.59,27.52-27.54h348.42c.52,14.95,12.58,27.02,27.52,27.54h2v-.98c0-.55-.45-1-1-1-14.63,0-26.54-11.91-26.54-26.56,0-.55-.45-1-1-1H28.54c-.55,0-1,.45-1,1,0,14.64-11.9,26.56-26.54,26.56-.55,0-1,.45-1,1v.98h2Z" />
            </svg>
        </div>
    );
}

function OrnamentGuardBottom() {
    return (
        <div className="aruna-ornament-guard aruna-ornament-guard--bottom">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.46 29.54" style={{ width: '100%', display: 'block', transform: 'scaleY(-1)' }}>
                <path fill="#c8b680" d="M2,29.54c14.94-.52,27-12.59,27.52-27.54h348.42c.52,14.95,12.58,27.02,27.52,27.54h2v-.98c0-.55-.45-1-1-1-14.63,0-26.54-11.91-26.54-26.56,0-.55-.45-1-1-1H28.54c-.55,0-1,.45-1,1,0,14.64-11.9,26.56-26.54,26.56-.55,0-1,.45-1,1v.98h2Z" />
            </svg>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Diamond Frame SVG for Countdown Items
   ───────────────────────────────────────────── */
function CountdownDiamondFrame() {
    return (
        <svg className="aruna-countdown__diamond" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 70" preserveAspectRatio="xMidYMid meet">
            <path fill="none" stroke="#cdbb83" strokeWidth="1"
                d="M55,2 C65,2,75,8,80,16 C85,8,95,2,105,7 L105,7 C100,18,98,30,98,35 C98,40,100,52,105,63 L105,63 C95,68,85,62,80,54 C75,62,65,68,55,68 C45,68,35,62,30,54 C25,62,15,68,5,63 L5,63 C10,52,12,40,12,35 C12,30,10,18,5,7 L5,7 C15,2,25,8,30,16 C35,8,45,2,55,2 Z" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Countdown Hook
   ───────────────────────────────────────────── */
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const tick = () => {
            const now = new Date().getTime();
            const diff = new Date(targetDate.getTime ? targetDate.getTime() : targetDate.replace(/-/g, '/')).getTime() - now;
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

let globalShowPhotos = true;
let globalShowAnimations = true;

/* ─────────────────────────────────────────────
   Intersection Observer Hook for Reveal
   ───────────────────────────────────────────── */
function useReveal() {
    const ref = useRef(null);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('is-visible');
                } else {
                    el.classList.remove('is-visible');
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

function RevealDiv({ children, className = '', variant = '' }) {
    const ref = useReveal();
    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }
    const cls = variant ? `aruna-reveal--${variant}` : 'aruna-reveal';
    return <div ref={ref} className={`${cls} ${className}`}>{children}</div>;
}

/* ═══════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════ */

/* ── Cover ── */
function CoverSection({ invitation, guest, onOpen, brideGrooms }) {
    const { t } = useTranslation();
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female') || couples[0] || {};

    const groomNick = groom.nickname || 'Groom';
    const brideNick = bride.nickname || 'Bride';

    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const bgUrl = invitation?.cover_image ? getStorageUrl(invitation.cover_image) : coverBg;

    return (
        <div className="aruna-cover" id="aruna-cover">
            {/* Left Panel - Desktop Only */}
            <div className="aruna-cover__left">
                {globalShowPhotos && <img src={bgUrl} alt="" className="aruna-cover__left-img" />}
                <div className="aruna-cover__left-overlay">
                    <div className="aruna-cover__left-pretitle">{invitation?.opening_title || 'THE WEDDING OF'}</div>
                    <h1 className="aruna-cover__left-title">{groomNick} &amp; {brideNick}</h1>
                    <div className="aruna-cover__left-quote">
                        &ldquo;{invitation?.opening_ayat || 'I love you, I am who I am because of you. You are every reason, every hope and every dream. I\'ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.'}&rdquo;
                    </div>
                </div>
            </div>

            {/* Right Panel - Main Content */}
            <div className="aruna-cover__right" style={globalShowPhotos ? { backgroundImage: `url(${bgUrl})` } : undefined}>
                {/* Left Side Frame: Rambat garlands */}
                <div className="aruna-cover__side-frame aruna-cover__side-frame--left">
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                </div>

                {/* Right Side Frame: Mirrored */}
                <div className="aruna-cover__side-frame aruna-cover__side-frame--right">
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                    <img src={rambatOrnament} className="aruna-cover__rambat-img" alt="" />
                </div>

                {/* Arched Janur Penjor */}
                <img src={janurOrnament} className="aruna-cover__janur-arch aruna-cover__janur-arch--left" alt="" />
                <img src={janurOrnament} className="aruna-cover__janur-arch aruna-cover__janur-arch--right" alt="" />

                {/* Bottom Floral Arrangement */}
                <img src={floralBottomLarge} className="aruna-cover__bottom-floral" alt="" />

                <div className="aruna-cover__content">
                    {/* Golden Batik Icons */}
                    <div className="aruna-cover__batik-row">
                        <img src={batikOrnament} alt="" />
                        <img src={batikOrnament} alt="" />
                        <img src={batikOrnament} alt="" />
                        <img src={batikOrnament} alt="" />
                    </div>

                    <div className="aruna-cover__pretitle">{invitation?.opening_title || 'THE WEDDING OF'}</div>
                    <div className="aruna-cover__names">{groomNick} &amp; {brideNick}</div>
                    
                    <div className="aruna-cover__guest-box">
                        <div className="aruna-cover__guest-label">{t('invitation.to') || 'Yth. Bapak/Ibu/Saudara/i'}</div>
                        <div className="aruna-cover__guest-name">{activeGuest.name}</div>
                        <p className="aruna-cover-apology">{t('invitation.dear_guest_desc') || 'Mohon maaf apabila ada kesalahan pada penulisan nama/gelar'}</p>
                    </div>

                    <button type="button" className="aruna-cover__btn" onClick={onOpen}>
                        {t('invitation.open_invitation') || 'BUKA UNDANGAN'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Hero ── */
function HeroSection({ invitation, brideGrooms, layoutMode, id }) {
    const { t } = useTranslation();
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female') || couples[0] || {};

    const groomNick = groom.nickname || 'Groom';
    const brideNick = bride.nickname || 'Bride';

    const isSlideH = layoutMode === 'slide-h';

    return (
        <section className="aruna-section aruna-hero" id={id || "home"}>
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv>
                    <div className="aruna-hero__pretitle">{invitation?.opening_title || 'The Wedding of'}</div>
                </RevealDiv>
                <RevealDiv>
                    <h1 className="aruna-hero__title">
                        {groomNick} &amp;<br />{brideNick}
                    </h1>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-hero__date-text">
                        {invitation?.countdown_target_date ? new Date(invitation.countdown_target_date.replace(/-/g, '/')).toLocaleString('id-ID', { month: 'long', year: 'numeric' }) : 'Desember 2026'}
                    </div>
                    <div className="aruna-hero__venue">
                        {invitation?.events?.[0]?.venue_name || 'Club House Jakarta Garden City'}
                    </div>
                </RevealDiv>
                {invitation?.opening_ayat && (
                    <RevealDiv>
                        <div className="aruna-hero__verse">
                            <p>&ldquo;{invitation.opening_ayat}&rdquo;</p>
                            {invitation.opening_ayat_source && <cite>{invitation.opening_ayat_source}</cite>}
                        </div>
                    </RevealDiv>
                )}
                <div className="aruna-scroll-indicator">
                    <div className="aruna-scroll-indicator__icon">
                        <i className={`fas ${isSlideH ? 'fa-chevron-right' : 'fa-chevron-down'} aruna-scroll-indicator__chevron`} />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ── Divider ── */
function DividerSection() {
    return (
        <RevealDiv variant="zoom" className="aruna-divider">
            <StarDivider />
        </RevealDiv>
    );
}

/* ── Couple ── */
function CoupleSection({ invitation, brideGrooms, id }) {
    const { t, locale } = useTranslation();
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female') || couples[0] || {};

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const isEn = locale === 'en';
        const raw = String(childOrder).trim().toLowerCase();
        let matchedKey = null;
        
        if (raw.includes('tunggal') || raw.includes('satu-satunya') || raw.includes('only')) matchedKey = 'tunggal';
        else if (raw.includes('bungsu') || raw.includes('terakhir') || raw.includes('youngest')) matchedKey = 'bungsu';
        else if (raw.includes('10') || raw.includes('kesepuluh') || raw.includes('tenth')) matchedKey = '10';
        else if (raw.includes('9') || raw.includes('kesembilan') || raw.includes('ninth')) matchedKey = '9';
        else if (raw.includes('8') || raw.includes('kedelapan') || raw.includes('eighth')) matchedKey = '8';
        else if (raw.includes('7') || raw.includes('ketujuh') || raw.includes('seventh')) matchedKey = '7';
        else if (raw.includes('6') || raw.includes('keenam') || raw.includes('sixth')) matchedKey = '6';
        else if (raw.includes('5') || raw.includes('kelima') || raw.includes('fifth')) matchedKey = '5';
        else if (raw.includes('4') || raw.includes('keempat') || raw.includes('fourth')) matchedKey = '4';
        else if (raw.includes('3') || raw.includes('ketiga') || raw.includes('third')) matchedKey = '3';
        else if (raw.includes('2') || raw.includes('kedua') || raw.includes('second')) matchedKey = '2';
        else if (raw.includes('1') || raw.includes('pertama') || raw.includes('kesatu') || raw.includes('first')) matchedKey = '1';
        
        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' },
            '2': { id: 'Kedua', en: 'Second' },
            '3': { id: 'Ketiga', en: 'Third' },
            '4': { id: 'Keempat', en: 'Fourth' },
            '5': { id: 'Kelima', en: 'Fifth' },
            '6': { id: 'Keenam', en: 'Sixth' },
            '7': { id: 'Ketujuh', en: 'Seventh' },
            '8': { id: 'Kedelapan', en: 'Eighth' },
            '9': { id: 'Kesembilan', en: 'Ninth' },
            '10': { id: 'Kesepuluh', en: 'Tenth' },
            'bungsu': { id: 'Bungsu', en: 'Youngest' },
            'tunggal': { id: 'Tunggal', en: 'Only' }
        };
        
        const match = ordinalMap[matchedKey] || { id: childOrder, en: childOrder };
        
        const isWanita = gender === 'wanita' || gender === 'female' || String(gender).toLowerCase() === 'wanita' || String(gender).toLowerCase() === 'female';
        
        if (isEn) {
            const noun = isWanita ? 'Daughter' : 'Son';
            if (String(match.en).toLowerCase() === 'only') return `ONLY ${noun.toUpperCase()} OF`;
            return `${String(match.en).toUpperCase()} ${noun.toUpperCase()} OF`;
        } else {
            const noun = isWanita ? 'Putri' : 'Putra';
            if (String(match.id).toLowerCase() === 'tunggal') return `${noun.toUpperCase()} TUNGGAL DARI`;
            return `${noun.toUpperCase()} ${String(match.id).toUpperCase()} DARI`;
        }
    };

    const resolveParents = (p) => {
        if (!p) return null;
        return (
            <>
                Bapak {p.father_name || 'Nama Bapak'}<br />&amp; Ibu {p.mother_name || 'Nama Ibu'}
            </>
        );
    };

    return (
        <section className="aruna-section aruna-section--padded" id={id || "couple"}>
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv className="aruna-couple__header">
                    <h2 className="aruna-couple__title">{t('invitation.bride_groom') || 'Bride & Groom'}</h2>
                    <p className="aruna-couple__desc">
                        {invitation?.opening_text || 'Dengan segala puji bagi Allah yang telah menciptakan mahluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkai cinta yang Engkau berikan dalam ikatan pernikahan.'}
                    </p>
                </RevealDiv>

                {/* Bride */}
                {bride.full_name && (
                    <RevealDiv className="aruna-profile">
                        {globalShowPhotos && (
                            <div className="aruna-profile__frame-container">
                                <img src={frameProfile} alt="" className="aruna-profile__frame-bg" />
                                <div className="aruna-profile__photo-wrap">
                                    <img src={getStorageUrl(bride.photo, aruna1)} alt={bride.full_name} className="aruna-profile__photo-symmetric" />
                                </div>
                            </div>
                        )}
                        <h3 className="aruna-profile__name">{bride.full_name.toUpperCase()}</h3>
                        <p className="aruna-profile__role">{translateChildOrder(bride.child_order, 'wanita')}</p>
                        <p className="aruna-profile__parents">
                            {resolveParents(bride)}
                        </p>
                        {bride.instagram && (
                            <a href={`https://www.instagram.com/${bride.instagram}`} className="aruna-profile__social" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram" /> @{bride.instagram.toUpperCase()}
                            </a>
                        )}
                    </RevealDiv>
                )}

                {/* Ampersand */}
                <RevealDiv variant="zoom" className="aruna-ampersand">
                    <div className="aruna-ampersand__line" />
                    <span className="aruna-ampersand__symbol">&amp;</span>
                    <div className="aruna-ampersand__line" />
                </RevealDiv>

                {/* Groom */}
                {groom.full_name && (
                    <RevealDiv className="aruna-profile">
                        {globalShowPhotos && (
                            <div className="aruna-profile__frame-container">
                                <img src={frameProfile} alt="" className="aruna-profile__frame-bg" />
                                <div className="aruna-profile__photo-wrap">
                                    <img src={getStorageUrl(groom.photo, aruna2)} alt={groom.full_name} className="aruna-profile__photo-symmetric" />
                                </div>
                            </div>
                        )}
                        <h3 className="aruna-profile__name">{groom.full_name.toUpperCase()}</h3>
                        <p className="aruna-profile__role">{translateChildOrder(groom.child_order, 'pria')}</p>
                        <p className="aruna-profile__parents">
                            {resolveParents(groom)}
                        </p>
                        {groom.instagram && (
                            <a href={`https://www.instagram.com/${groom.instagram}`} className="aruna-profile__social" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram" /> @{groom.instagram.toUpperCase()}
                            </a>
                        )}
                    </RevealDiv>
                )}
            </div>
        </section>
    );
}

/* ── Timeline Card with Scroll Observer (active/glow state when scrolled over) ── */
function TimelineCard({ story, index }) {
    const ref = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsActive(entry.isIntersecting);
        }, {
            rootMargin: '-30% 0px -30% 0px', // Active when in center 40% of viewport
            threshold: 0
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`aruna-timeline__item ${isActive ? 'is-active' : ''}`} style={{ textAlign: index % 2 === 0 ? 'left' : 'right' }}>
            <div className="aruna-timeline__chapter" style={{ fontFamily: 'var(--aruna-font-display)', fontSize: '20px', color: 'var(--aruna-gold)', marginBottom: '8px' }}>{story.title}</div>
            {story.story_date && <div style={{ fontSize: '11px', color: 'var(--aruna-gold)', opacity: 0.7, marginBottom: '6px', letterSpacing: '1px' }}>{story.story_date}</div>}
            <div className="aruna-timeline__text" style={{ fontFamily: 'var(--aruna-font-body)', fontSize: '13px', color: 'var(--aruna-gold)', lineHeight: '1.9', fontWeight: '300' }}>{story.description || story.story}</div>
        </div>
    );
}

/* ── Timeline ── */
function TimelineSection({ loveStories, id }) {
    const stories = safeArr(loveStories).sort((a, b) => (a.sort_order - b.sort_order) || (a.id - b.id));

    if (stories.length === 0) return null;

    return (
        <section className="aruna-section aruna-section--padded" id={id || "story"}>
            <div className="aruna-section__inner">
                <RevealDiv className="aruna-timeline__header">
                    <div className="aruna-timeline__pretitle" style={{ fontFamily: 'var(--aruna-font-display)', fontSize: '18px', color: 'var(--aruna-gold)' }}>A Story of</div>
                    <h2 className="aruna-timeline__title">JOURNEY OF LOVE</h2>
                    <p className="aruna-timeline__desc" style={{ color: 'var(--aruna-gold)', fontStyle: 'italic', maxWidth: '340px', margin: '0 auto 40px', lineHeight: '2', fontWeight: '300' }}>
                        &ldquo;Marriage is not a race, it&rsquo;s not about fast or slow.<br/>
                        But, who is ready to carry out a great mandate.&rdquo;
                    </p>
                </RevealDiv>

                <div className="aruna-timeline__track--alt" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {stories.map((s, i) => (
                        <TimelineCard key={s.id || i} story={s} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Event (Save The Date) ── */
function EventSection({ invitation, events, galleries }) {
    const { t } = useTranslation();
    const eventList = safeArr(events).sort((a, b) => a.sort_order - b.sort_order);
    const sortedGalleries = safeArr(galleries);

    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0] || {};
    
    // Countdown target
    const targetDateStr = invitation?.countdown_target_date || primaryEvent.event_date;
    const targetDate = targetDateStr ? new Date(targetDateStr.replace(/-/g, '/')) : null;
    const countdown = useCountdown(targetDate);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr.replace(/-/g, '/'));
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
    };

    return (
        <section className="aruna-section aruna-section--padded" id="event">
            <img src={flowerLeft} alt="" className="aruna-ornament aruna-ornament--flower-left" />
            <img src={flowerRight} alt="" className="aruna-ornament aruna-ornament--flower-right" />
            
            <img src={rambatOrnament} alt="" className="aruna-event-ornament aruna-event-ornament--rambat" />
            <img src={janurOrnament} alt="" className="aruna-event-ornament aruna-event-ornament--janur" />

            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-event__title">{t('invitation.save_the_date') || 'Save The Date'}</h2>
                </RevealDiv>

                {invitation?.opening_ayat && (
                    <RevealDiv>
                        <div className="aruna-event__quote">
                            &ldquo;{invitation.opening_ayat}&rdquo;
                        </div>
                    </RevealDiv>
                )}

                {/* Countdown with diamond frames */}
                {targetDate && parseBool(invitation?.show_countdown, true) && (
                    <RevealDiv>
                        <div className="aruna-countdown aruna-countdown--diamond">
                            {[
                                { val: countdown.days, label: t('common.days') || 'Hari' },
                                { val: countdown.hours, label: t('common.hours') || 'Jam' },
                                { val: countdown.minutes, label: t('common.minutes') || 'Menit' },
                                { val: countdown.seconds, label: t('common.seconds') || 'Detik' },
                            ].map((item, i) => (
                                <div key={i} className="aruna-countdown__item aruna-countdown__item--diamond">
                                    <div className="aruna-countdown__diamond-wrap">
                                        <CountdownDiamondFrame />
                                        <div className="aruna-countdown__num">{item.val}</div>
                                    </div>
                                    <div className="aruna-countdown__label">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </RevealDiv>
                )}

                {targetDate && (
                    <RevealDiv>
                        <button type="button" className="aruna-event__save-btn" onClick={() => window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(invitation.cover_title || 'The Wedding')}&dates=${targetDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z%2F${targetDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`, '_blank')}>
                            {t('invitation.save_date') || 'Simpan Tanggal'}
                        </button>
                    </RevealDiv>
                )}

                <RevealDiv>
                    <div className="aruna-event__subtitle">Date &amp; Place</div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameTop} alt="" style={{ width: '100%', marginBottom: '-1px' }} />
                </RevealDiv>

                 {eventList.map((evt, idx) => {
                    // Random background photo for event header
                    const evBgUrl = evt.cover_image 
                        ? getStorageUrl(evt.cover_image) 
                        : (sortedGalleries.length > 0 
                            ? getStorageUrl(sortedGalleries[idx % sortedGalleries.length].image_path || sortedGalleries[idx % sortedGalleries.length].image_url) 
                            : coverBg);

                    // Resolve streaming links for this event
                    const streamsList = [];
                    if (evt?.streaming_url) {
                        streamsList.push({
                            platform: evt.streaming_platform || 'Live',
                            url: evt.streaming_url
                        });
                    }
                    if (Array.isArray(evt?.streamings)) {
                        evt.streamings.forEach(s => {
                            if (s.url && !streamsList.some(item => item.url === s.url)) {
                                streamsList.push({
                                    platform: s.platform || 'Live',
                                    url: s.url
                                });
                            }
                        });
                    }

                    return (
                        <RevealDiv key={evt.id || idx}>
                            <div className="aruna-event__card" style={{ borderRadius: 0, backgroundImage: `linear-gradient(rgba(12,12,12,0.85), rgba(12,12,12,0.85)), url(${evBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: idx === eventList.length - 1 ? 0 : '30px' }}>
                                <div className="aruna-event__card-title">{evt.event_name.toUpperCase()}</div>
                                <div className="aruna-event__card-detail">{formatDate(evt.event_date)}</div>
                                <div className="aruna-event__card-detail">{evt.start_time} - {evt.end_time || 'Selesai'} {evt.timezone || 'WIB'}</div>
                                <div className="aruna-event__card-venue">{evt.venue_name.toUpperCase()}</div>
                                <div className="aruna-event__card-address">{evt.venue_address}</div>
                                {evt.gmaps_link && (
                                    <button type="button" className="aruna-event__map-btn" onClick={() => window.open(evt.gmaps_link, '_blank')}>
                                        GOOGLE MAPS
                                    </button>
                                )}
                                {streamsList.length > 0 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', width: '100%', alignItems: 'center' }}>
                                        {streamsList.map((stream, sIdx) => (
                                            <button 
                                                key={sIdx}
                                                type="button" 
                                                className="aruna-event__map-btn" 
                                                onClick={() => window.open(stream.url, '_blank')}
                                                style={{ 
                                                    borderColor: 'rgba(197, 165, 90, 0.5)',
                                                    fontSize: '11px',
                                                    padding: '8px 20px'
                                                }}
                                            >
                                                <i className="fas fa-video" style={{ marginRight: '8px' }} /> WATCH {stream.platform.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </RevealDiv>
                    );
                })}

                <RevealDiv>
                    <img src={eventFrameBottom} alt="" style={{ width: '100%', marginTop: '-1px' }} />
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Dress Code ── */
function DressCodeSection() {
    const { t } = useTranslation();
    const colors = [
        { name: 'Sage Green', hex: '#8B9E7E' },
        { name: 'Dust Green', hex: '#6B7F6B' },
        { name: 'Mustard Gold', hex: '#C5A55A' },
        { name: 'Copper Brown', hex: '#9E6B4A' },
    ];
    return (
        <section className="aruna-section aruna-section--padded" id="dresscode">
            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-couple__title">{t('invitation.dress_code') || 'A Guide To Dress Codes'}</h2>
                    <p className="aruna-gift__desc">
                        Kami mengundang tamu undangan untuk mengenakan palet warna berikut untuk keseragaman foto:
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-dresscode__palette">
                        {colors.map((c, i) => (
                            <div key={i} className="aruna-dresscode__item">
                                <div className="aruna-dresscode__circle" style={{ backgroundColor: c.hex }} title={c.name} />
                            </div>
                        ))}
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Live Streaming ── */
function LiveStreamingSection({ invitation, events }) {
    const { t } = useTranslation();
    const eventList = safeArr(events);
    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0] || {};

    const formattedDate = primaryEvent.event_date 
        ? new Date(primaryEvent.event_date.replace(/-/g, '/')).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        : 'Sabtu, 20 Desember 2026';

    // Resolve all active stream links dynamically (supporting JSON array and legacy fields)
    const streamsList = [];
    
    if (primaryEvent?.streaming_url) {
        streamsList.push({
            platform: primaryEvent.streaming_platform || 'Live',
            url: primaryEvent.streaming_url
        });
    }
    
    if (Array.isArray(primaryEvent?.streamings)) {
        primaryEvent.streamings.forEach(s => {
            if (s.url && !streamsList.some(item => item.url === s.url)) {
                streamsList.push({
                    platform: s.platform || 'Live',
                    url: s.url
                });
            }
        });
    }
    
    if (streamsList.length === 0) return null;

    return (
        <section className="aruna-section aruna-section--padded" id="livestream">
            <div className="aruna-section__inner">
                {globalShowPhotos && (
                    <RevealDiv>
                        <img src={couplePhoto} alt="Live Streaming" className="aruna-livestream__photo" />
                    </RevealDiv>
                )}
                <RevealDiv>
                    <h2 className="aruna-couple__title">Join Our Wedding<br />Live Streaming</h2>
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-hero__date-text" style={{ marginBottom: '4px' }}>{formattedDate}</div>
                    <div className="aruna-hero__venue" style={{ marginBottom: '16px' }}>{primaryEvent.start_time || '08.00'} {primaryEvent.timezone || 'WIB'}</div>
                </RevealDiv>
                <RevealDiv>
                    <p className="aruna-gift__desc" style={{ marginBottom: '16px' }}>
                        Kami akan menyiarkan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                        {streamsList.map((stream, idx) => (
                            <button 
                                key={idx}
                                type="button" 
                                className="aruna-event__save-btn" 
                                onClick={() => window.open(stream.url, '_blank')}
                                style={{ margin: 0 }}
                            >
                                Join {stream.platform}
                            </button>
                        ))}
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Video YouTube ── */
function VideoSection({ invitation }) {
    const videoUrl = invitation?.video_url;
    if (!videoUrl) return null;

    // Resolve embed video
    let embedId = '';
    if (videoUrl.includes('youtube.com/watch?v=')) {
        embedId = videoUrl.split('v=')[1]?.split('&')[0];
    } else if (videoUrl.includes('youtu.be/')) {
        embedId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    } else if (videoUrl.includes('youtube.com/embed/')) {
        embedId = videoUrl.split('embed/')[1]?.split('?')[0];
    }

    if (!embedId) return null;

    return (
        <section className="aruna-section" id="video">
            <div className="aruna-section__inner" style={{ maxWidth: '100%', padding: '0 24px' }}>
                <RevealDiv>
                    <DividerSection />
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-video__wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${embedId}?autoplay=0&mute=1&loop=1&playlist=${embedId}&controls=1&playsinline=1`}
                            title="Wedding Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </RevealDiv>
                <RevealDiv>
                    <DividerSection />
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Gallery ── */
function GallerySection({ invitation, galleries, brideGrooms }) {
    const { t } = useTranslation();
    const images = safeArr(galleries);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female') || couples[0] || {};

    const [lightboxIndex, setLightboxIndex] = useState(-1);

    if (images.length === 0 || !globalShowPhotos) return null;

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);
    const prevImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); };
    const nextImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };
        if (lightboxIndex >= 0) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <section className="aruna-section aruna-section--padded" id="gallery">
            <img src={ornamentLeft} alt="" className="aruna-ornament aruna-ornament--left" />
            <img src={ornamentRight} alt="" className="aruna-ornament aruna-ornament--right" />
            <div className="aruna-section__inner">
                <RevealDiv>
                    <h2 className="aruna-gallery__title">{t('invitation.gallery') || 'Our Moment'}</h2>
                    <p className="aruna-gift__desc" style={{ fontStyle: 'italic' }}>
                        &ldquo;I was created in time to fill your time, and I use all the time in my life to love you.&rdquo;
                    </p>
                    <p className="aruna-hero__venue" style={{ marginBottom: '20px' }}>Photo &amp; Video by {groom.nickname || 'Groom'} &amp; {bride.nickname || 'Bride'}</p>
                </RevealDiv>
                <RevealDiv className="aruna-gallery__grid">
                    {images.map((g, i) => {
                        const path = getStorageUrl(g.image_path || g.image_url);
                        return (
                            <div key={g.id || i} className="aruna-gallery__item" onClick={() => openLightbox(i)}>
                                <img src={path} alt={g.caption || `Gallery ${i + 1}`} className="aruna-gallery-img" />
                                <div className="aruna-gallery__zoom-icon">
                                    <i className="fas fa-search-plus" />
                                </div>
                            </div>
                        );
                    })}
                </RevealDiv>
                <RevealDiv>
                    <div className="aruna-gallery__quote">
                        <p>&ldquo;I love you, I am who I am because of you. You are every reason, every hope and every dream. I&rsquo;ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.&rdquo;</p>
                        <p style={{ marginTop: '10px', fontWeight: '400' }}>{(groom.nickname || 'Groom').toUpperCase()} &amp; {(bride.nickname || 'Bride').toUpperCase()}</p>
                    </div>
                </RevealDiv>
            </div>
            
            {/* Lightbox Modal */}
            {lightboxIndex >= 0 && (
                <div className="aruna-lightbox" onClick={closeLightbox}>
                    <button type="button" className="aruna-lightbox__close" onClick={closeLightbox} title="Close">
                        <i className="fas fa-times" />
                    </button>
                    <div className="aruna-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="aruna-lightbox__nav aruna-lightbox__nav--prev" onClick={prevImage}>
                            <i className="fas fa-chevron-left" />
                        </button>
                        <img 
                            src={getStorageUrl(images[lightboxIndex].image_path || images[lightboxIndex].image_url)} 
                            alt="Zoomed Gallery" 
                            className="aruna-lightbox__img" 
                        />
                        <button type="button" className="aruna-lightbox__nav aruna-lightbox__nav--next" onClick={nextImage}>
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ── Wedding Frame Section ── */
function WeddingFrameSection({ invitation }) {
    const frameUrl = invitation?.frame_url || 'https://www.instagram.com/';

    return (
        <section className="aruna-section aruna-section--padded" id="weddingframe">
            <div className="aruna-section__inner">
                <RevealDiv>
                    <div className="aruna-timeline__pretitle">Capture Your Moment</div>
                    <h2 className="aruna-gallery__title">WEDDING FRAME</h2>
                    <p className="aruna-gift__desc">
                        Unggah dan abadikan momen kamu saat menghadiri pernikahan kami dengan menggunakan Wedding Frame di bawah ini.
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" className="aruna-event__save-btn" onClick={() => window.open(frameUrl, '_blank')}>
                            <i className="fab fa-instagram" style={{ marginRight: '8px' }} /> Open Frame
                        </button>
                    </div>
                    <p className="aruna-gift__desc" style={{ marginTop: '16px', fontStyle: 'italic', fontSize: '11px' }}>
                        *Disarankan untuk memperbarui aplikasi Instagram ke versi terbaru.
                    </p>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── RSVP ── */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, id }) {
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const [sharedName, setSharedName] = useState(activeGuest.name || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const rsvpForm = useForm({
        sender_name: activeGuest.name || '',
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: activeGuest.id || null,
    });

    const wishForm = useForm({
        sender_name: activeGuest.name || '',
        message: '',
        guest_id: activeGuest.id || null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        rsvpForm.setData('sender_name', sharedName);
        rsvpForm.setData('attendance', attendance);
        rsvpForm.setData('number_of_guests', numGuests);
        wishForm.setData('sender_name', sharedName);
        wishForm.setData('message', message);

        const doWish = () => {
            if (enableWishes && message.trim()) {
                wishForm.post(route('invitation.wish', invitation.slug), {
                    preserveScroll: true,
                    onSuccess: () => { setMessage(''); setSuccess(true); },
                });
            } else {
                setSuccess(true);
            }
        };

        if (enableRsvp) {
            rsvpForm.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: doWish,
            });
        } else {
            doWish();
        }
    };

    const isSubmitting = rsvpForm.processing || wishForm.processing;
    const recentWishes = safeArr(wishes).slice(0, 5);
    const sectionTitle = enableRsvp && enableWishes
        ? (isEn ? 'RSVP & Wishes' : 'Konfirmasi & Ucapan')
        : enableRsvp
            ? (isEn ? 'Attendance Confirmation' : 'Konfirmasi Kehadiran')
            : (isEn ? 'Wishes & Prayers' : 'Ucapan & Doa');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section className="aruna-section aruna-section--padded" id={id || 'rsvp'}>
            <div className="aruna-section__inner">
                <OrnamentGuardTop />
                <div className="aruna-guard-content">
                    <RevealDiv>
                        <h2 className="aruna-rsvp__title">{sectionTitle}</h2>
                        <p className="aruna-gift__desc">
                            {isEn
                                ? 'Please fill out the form below to send your confirmation and wishes.'
                                : 'Mohon isi formulir berikut untuk mengirimkan konfirmasi dan ucapan Anda.'}
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <form className="aruna-rsvp__form" onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="aruna-rsvp__field">
                                <label className="aruna-rsvp__label">{isEn ? 'Your Name' : 'Nama'}</label>
                                <input
                                    className="aruna-rsvp__input"
                                    type="text"
                                    required
                                    readOnly={!!activeGuest.name}
                                    value={sharedName}
                                    onChange={e => setSharedName(e.target.value)}
                                />
                            </div>

                            {/* Konfirmasi Kehadiran - hanya jika RSVP aktif */}
                            {enableRsvp && (
                                <div className="aruna-rsvp__field">
                                    <label className="aruna-rsvp__label">{isEn ? 'Attendance' : 'Konfirmasi Kehadiran'}</label>
                                    <div className="aruna-rsvp__attendance-btns">
                                        {['hadir', 'tidak_hadir'].map(val => (
                                            <button
                                                key={val}
                                                type="button"
                                                className={`aruna-rsvp__attendance-btn ${attendance === val ? 'is-active' : ''}`}
                                                onClick={() => setAttendance(val)}
                                            >
                                                {val === 'hadir' ? (isEn ? 'Attending' : 'Hadir') : (isEn ? 'Not Attending' : 'Tidak Hadir')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Jumlah Tamu - hanya jika RSVP aktif DAN hadir */}
                            {enableRsvp && attendance === 'hadir' && (
                                <div className="aruna-rsvp__field">
                                    <label className="aruna-rsvp__label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                                    <select
                                        className="aruna-rsvp__select"
                                        value={numGuests}
                                        onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} {isEn ? 'Person(s)' : 'Orang'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Ucapan & Doa - hanya jika Wishes aktif */}
                            {enableWishes && (
                                <div className="aruna-rsvp__field">
                                    <label className="aruna-rsvp__label">{isEn ? 'Wishes & Prayers' : 'Ucapan & Doa'}</label>
                                    <textarea
                                        className="aruna-rsvp__textarea"
                                        placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan untuk kedua mempelai...'}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required={!enableRsvp}
                                    />
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitting} className="aruna-rsvp__submit">
                                {isSubmitting ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Send' : 'Kirim')}
                            </button>

                            {success && (
                                <p style={{ color: 'var(--aruna-gold)', marginTop: '12px', fontSize: '13px', textAlign: 'center' }}>
                                    ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                                </p>
                            )}
                        </form>
                    </RevealDiv>

                    {/* Daftar Ucapan - max 5, scrollable */}
                    {enableWishes && recentWishes.length > 0 && (
                        <div className="aruna-wishes-list-wrapper">
                            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                {recentWishes.map((w, i) => (
                                    <RevealDiv key={w.id || i}>
                                        <div style={{ padding: '16px', background: 'var(--aruna-bg-card)', border: '1px solid var(--aruna-border)', marginBottom: '12px', textAlign: 'left' }}>
                                            <div style={{ color: 'var(--aruna-gold)', fontWeight: '600', fontSize: '13px' }}>{w.sender_name || w.name}</div>
                                            <div style={{ fontSize: '12px', marginTop: '6px', color: '#fff', lineHeight: '1.6' }}>{w.message}</div>
                                            <div style={{ fontSize: '10px', marginTop: '6px', color: 'rgba(255,255,255,0.4)' }}>
                                                {w.created_at ? new Date(w.created_at).toLocaleDateString('id-ID') : ''}
                                            </div>
                                        </div>
                                    </RevealDiv>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}



/* ── Gift ── */
function GiftSection({ bankAccounts, id }) {
    const accounts = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [giftTab, setGiftTab] = useState('amplop');

    if (accounts.length === 0) return null;

    const copy = (text, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }).catch(() => {
                fallbackCopy(text, idx);
            });
        } else {
            fallbackCopy(text, idx);
        }
    };

    const fallbackCopy = (text, idx) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);

        try {
            const successful = document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    return (
        <section className="aruna-section aruna-section--padded" id={id || "gift"}>
            <div className="aruna-section__inner">
                <OrnamentGuardTop />

                <div className="aruna-guard-content">
                    <RevealDiv>
                        <h2 className="aruna-gift__title">Wedding Gift</h2>
                        <p className="aruna-gift__desc">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami akan senang hati menerimanya yang tentu akan semakin melengkapi kebahagiaan kami.
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <div className="aruna-gift__tabs">
                            <button type="button" className={`aruna-gift__tab ${giftTab === 'amplop' ? 'is-active' : ''}`} onClick={() => setGiftTab('amplop')}>E-Amplop</button>
                        </div>
                    </RevealDiv>

                    {giftTab === 'amplop' && (
                        <>
                            {accounts.map((acc, idx) => (
                                <RevealDiv key={acc.id || idx}>
                                    <div className="aruna-gift__card" style={{ borderRadius: 0 }}>
                                        <div className="aruna-gift__bank-name">{acc.bank_name.toUpperCase()}</div>
                                        <div className="aruna-gift__account">{acc.account_number}</div>
                                        <div className="aruna-gift__holder">{acc.account_holder || acc.account_name}</div>
                                        <button type="button" className="aruna-gift__copy-btn" onClick={() => copy(acc.account_number, idx)}>
                                            {copiedIdx === idx ? 'Tersalin!' : 'Salin'}
                                        </button>
                                    </div>
                                </RevealDiv>
                            ))}
                        </>
                    )}
                </div>

                <OrnamentGuardBottom />
            </div>
        </section>
    );
}

/* ── Footer ── */
function FooterSection({ invitation, brideGrooms, id }) {
    const { t } = useTranslation();
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || couples[0] || {};

    const groomNick = (groom.nickname || 'Groom').toUpperCase();
    const brideNick = (bride.nickname || 'Bride').toUpperCase();

    // Brand reseller watermark
    const brandName = invitation?.user?.reseller?.reseller_settings?.brand_name || 'Groovy Digital';

    const defaultIdText = 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.';
    const defaultIdTitle = 'THANK YOU';

    const currentClosingTitle = invitation?.closing_title || '';
    const currentClosingText = invitation?.closing_text || '';

    const isDefaultTitle = !currentClosingTitle || currentClosingTitle.trim() === defaultIdTitle || currentClosingTitle.trim() === 'TERIMA KASIH';
    const isDefaultText = !currentClosingText || currentClosingText.trim() === defaultIdText;

    const displayClosingTitle = isDefaultTitle
        ? t('invitation.closing_title')
        : currentClosingTitle;

    const displayClosingText = isDefaultText
        ? t('invitation.closing_text')
        : currentClosingText;

    const isEn = t('invitation.save_the_date') === 'Save The Date';
    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    return (
        <footer className="aruna-footer" id={id || "closing"}>
            <RevealDiv>
                <DividerSection />
                <MonogramShield />
                <div className="aruna-footer__initial">{groomNick} &amp; {brideNick}</div>
                <div className="aruna-footer__thankyou">{displayClosingTitle}</div>
                <div className="aruna-footer__message">
                    {displayClosingText}
                </div>
                
                {/* Formal Tanda Tangan Penutup */}
                <div className="aruna-footer__signature" style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.5, color: '#fff' }}>
                        {isEn ? 'We Who Are Joyful,' : 'Kami Yang Berbahagia,'}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '4px', fontStyle: 'normal', color: '#fff' }}>
                        {hasGroomParents && (
                            <div>
                                {isEn 
                                    ? `Family of Mr. ${groomFather || '...'} & Mrs. ${groomMother || '...'}`
                                    : `Kel. Bapak ${groomFather || '...'} & Ibu ${groomMother || '...'}`
                                }
                            </div>
                        )}
                        {hasBrideParents && (
                            <div>
                                {isEn 
                                    ? `Family of Mr. ${brideFather || '...'} & Mrs. ${brideMother || '...'}`
                                    : `Kel. Bapak ${brideFather || '...'} & Ibu ${brideMother || '...'}`
                                }
                            </div>
                        )}
                        {!hasGroomParents && !hasBrideParents && (
                            <div>
                                {isEn ? 'Both Families of the Couple' : 'Keluarga Besar Kedua Mempelai'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="aruna-footer__credit" style={{ fontSize: '10px', letterSpacing: '1px', marginTop: '30px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                    Powered by {brandName}
                </div>
            </RevealDiv>
        </footer>
    );
}

/* ── Navigation Menu & Controls ── */
function Navigation({ isOpened, isPlaying, onToggleMusic, resolvedSections, layoutMode, activeSlideIdx, isSlideMode, scrollToSection, enableRsvp, enableWishes, autoScrollEnabled, setAutoScrollEnabled, activeSection }) {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleOpenMenu = () => {
        setIsClosing(false);
        setIsMenuOpen(true);
    };

    const handleCloseMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, 500);
    };

    const handleNavClick = (id) => {
        scrollToSection(id);
        handleCloseMenu();
    };

    if (!isOpened) return null;

    // Filter menu items for layout navigation
    const menuItems = [];
    
    // Add standard sections mapping to menu
    resolvedSections.forEach(s => {
        if (s.section_key === 'cover') return;
        
        if (s.section_key === 'rsvp') {
            const hasWishes = resolvedSections.some(x => x.section_key === 'wishes');
            menuItems.push({
                id: 'rsvp',
                label: hasWishes ? 'RSVP & Ucapan' : 'RSVP',
                icon: 'fa-envelope'
            });
        } else if (s.section_key === 'wishes') {
            const hasRsvp = resolvedSections.some(x => x.section_key === 'rsvp');
            if (!hasRsvp) {
                menuItems.push({
                    id: 'wishes',
                    label: 'Ucapan',
                    icon: 'fa-comment'
                });
            }
        } else {
            const labelMap = {
                'opening': 'Home',
                'bride_groom': 'Mempelai',
                'event': 'Acara',
                'countdown': 'Countdown',
                'love_story': 'Kisah Cinta',
                'gallery': 'Galeri',
                'bank': 'Gift',
                'closing': 'Penutup'
            };
            const iconMap = {
                'opening': 'fa-home',
                'bride_groom': 'fa-heart',
                'event': 'fa-calendar-alt',
                'countdown': 'fa-hourglass-start',
                'love_story': 'fa-book-open',
                'gallery': 'fa-images',
                'bank': 'fa-gift',
                'closing': 'fa-flag'
            };
            if (labelMap[s.section_key]) {
                menuItems.push({
                    id: s.section_key,
                    label: labelMap[s.section_key],
                    icon: iconMap[s.section_key] || 'fa-star'
                });
            }
        }
    });

    // Check if bottom dock is active or resolved
    let menuPosition = 'bottom'; // Standard premium fallback is bottom
    const showMenu = menuPosition !== 'none';

    return (
        <>
            {/* Overlay Navigation Menu */}
            <div className={`aruna-nav-drawer ${isMenuOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}>
                <div className="aruna-nav-drawer__top">
                    <button type="button" className="aruna-nav-drawer__close" onClick={handleCloseMenu} title="Close">
                        CLOSE
                    </button>
                </div>
                <ul className="aruna-nav-drawer__list">
                    {menuItems.map((item) => (
                        <li key={item.label} className={`aruna-nav-drawer__item ${activeSection === item.id ? 'is-active' : ''}`}>
                            <button type="button" onClick={() => handleNavClick(item.id)}>{item.label.toUpperCase()}</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Top Right Hamburger */}
            <div className={`aruna-top-nav ${isMenuOpen ? 'is-hidden' : ''}`}>
                <button type="button" className="aruna-nav-toggle" onClick={handleOpenMenu} title="Menu">
                    <span className="aruna-nav-toggle__line line-1" />
                    <span className="aruna-nav-toggle__line line-2" />
                    <span className="aruna-nav-toggle__line line-3" />
                </button>
            </div>

            {/* Bottom Controls Raised when menuPosition === 'bottom' */}
            <div className={`aruna-bottom-controls ${isMenuOpen ? 'is-hidden' : ''} aruna-bottom-controls--raised`}>
                <div className="aruna-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Auto Scroll Controller Button */}
                    <button
                        type="button"
                        className={`aruna-floating__btn ${autoScrollEnabled ? 'active' : ''}`}
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: '#847d4a', color: '#fff', boxShadow: '0 0 10px #847d4a' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                    </button>

                    <button type="button" className="aruna-floating__btn" onClick={() => scrollToSection('rsvp')} title="RSVP">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </button>

                    <button type="button" className="aruna-floating__btn" onClick={onToggleMusic} title="Music">
                        {isPlaying ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                                <line x1="23" y1="1" x2="1" y2="23" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Aruna({
    invitation,
    sections,
    brideGrooms,
    events,
    galleries,
    loveStories,
    bankAccounts,
    wishes,
    guest,
}) {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSection, setActiveSection] = useState('opening');

    const audioRef = useRef(null);

    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => b.gender === 'pria' || b.gender === 'male') || couples[1] || couples[0] || {};
    const bride = couples.find(b => b.gender === 'wanita' || b.gender === 'female') || couples[0] || {};

    // 1. Title Head
    useEffect(() => {
        const groomNick = groom?.nickname || 'Groom';
        const brideNick = bride?.nickname || 'Bride';
        document.title = `${groomNick} & ${brideNick} - The Wedding`;
    }, [brideGrooms]);

    // 2. Features parser
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // 3. Dynamic Section map
    const safeSections = safeArr(sections);
    const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing'];

    const resolvedSections = [];
    if (safeSections.length > 0) {
        const dbSorted = safeSections
            .filter(s => s.is_visible && validKeys.includes(s.section_key))
            .sort((a, b) => a.sort_order - b.sort_order);

        dbSorted.forEach(s => {
            if (s.section_key === 'love_story' && !(safeArr(loveStories).length > 0)) return;
            if (s.section_key === 'gallery' && !(safeArr(galleries).length > 0)) return;
            if (s.section_key === 'bank' && !(safeArr(bankAccounts).length > 0)) return;
            if (s.section_key === 'rsvp' && !enableRsvp) return;
            if (s.section_key === 'wishes' && !enableWishes) return;
            
            const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
            if (s.section_key === 'countdown' && !primaryEvent?.event_date) return;

            resolvedSections.push(s);
        });
    } else {
        // Fallback jika database kosong
        const fallbacks = [
            { section_key: 'opening' },
            { section_key: 'bride_groom' },
            { section_key: 'event' },
        ];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (primaryEvent?.event_date) fallbacks.push({ section_key: 'countdown' });
        if (safeArr(loveStories).length > 0) fallbacks.push({ section_key: 'love_story' });
        if (safeArr(galleries).length > 0) fallbacks.push({ section_key: 'gallery' });
        if (enableRsvp) fallbacks.push({ section_key: 'rsvp' });
        if (enableWishes) fallbacks.push({ section_key: 'wishes' });
        if (safeArr(bankAccounts).length > 0) fallbacks.push({ section_key: 'bank' });
        fallbacks.push({ section_key: 'closing' });

        resolvedSections.push(...fallbacks);
    }

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';

    // 4. Auto-Scroll Logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            // Mode Slide: transisi section setiap 4 detik
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) {
                        return 0;
                    }
                    return prev + 1;
                });
            }, 4000);
        } else {
            // Mode Scroll: gulir perlahan (1px per 25ms)
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isBottom) {
                    setAutoScrollEnabled(false);
                }
            }, 25);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Scrollspy to automatically update active section on window scroll
    useEffect(() => {
        if (isSlideMode || !isOpened) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const section of resolvedSections) {
                let elementId = section.section_key;
                if (elementId === 'bride_groom' && !document.getElementById('bride_groom')) {
                    elementId = 'couple';
                }
                if (elementId === 'love_story' && !document.getElementById('love_story')) {
                    elementId = 'story';
                }
                if (elementId === 'bank' && !document.getElementById('bank')) {
                    elementId = 'gift';
                }
                const el = document.getElementById(elementId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.section_key);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Run once initially
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections]);

    // Sync active slide index with activeSection state
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            setActiveSection(resolvedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections]);

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        document.getElementById('aruna-cover')?.classList.add('is-opened');
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.muted = true;
            setIsPlaying(false);
        } else {
            audio.muted = false;
            if (audio.paused) {
                audio.play().catch(() => {});
            }
            setIsPlaying(true);
        }
    }, [isPlaying]);

    const scrollToSection = (id) => {
        // Hapus auto-scroll jika pengguna menavigasi manual
        setAutoScrollEnabled(false);
        
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === id);
            if (idx !== -1) {
                setActiveSlideIdx(idx);
            }
        } else {
            // For RSVP & Wishes combined menu navigation
            if (id === 'rsvp') {
                document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Component map
    const componentMap = {
        'opening': <HeroSection key="opening" invitation={invitation} brideGrooms={brideGrooms} layoutMode={layoutMode} id="opening" />,
        'bride_groom': <CoupleSection key="bride_groom" invitation={invitation} brideGrooms={brideGrooms} id="bride_groom" />,
        'love_story': <TimelineSection key="love_story" loveStories={loveStories} id="love_story" />,
        'event': (
            <React.Fragment key="event-bundle">
                <EventSection invitation={invitation} events={events} galleries={galleries} id="event" />
                <DressCodeSection />
                <LiveStreamingSection invitation={invitation} events={events} />
                <VideoSection invitation={invitation} />
            </React.Fragment>
        ),
        'countdown': null, // Countdown is already bundled inside EventSection
        'gallery': <GallerySection key="gallery" invitation={invitation} galleries={galleries} brideGrooms={brideGrooms} id="gallery" />,
        'rsvp': <UnifiedFormSection key="rsvp" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} id="rsvp" />,
        'wishes': enableRsvp ? null : <UnifiedFormSection key="wishes" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={enableWishes} id="wishes" />,
        'bank': <GiftSection key="bank" bankAccounts={bankAccounts} id="bank" />,
        'closing': <FooterSection key="closing" invitation={invitation} brideGrooms={brideGrooms} id="closing" />,
    };

    return (
        <div className={`aruna-page ${!showAnimations ? 'aruna-no-animations' : ''}`}>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            {/* Efek Partikel Otomatis */}
            {isOpened && invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect type={invitation.particle_type} count={invitation.particle_count || 30} speed={invitation.particle_speed || 'normal'} />
            )}

            {/* Background Music */}
            <audio ref={audioRef} loop preload="auto" playsInline>
                <source src={getStorageUrl(invitation?.music_url || '/audio/backsound.mp3')} type="audio/mpeg" />
            </audio>

            {/* Cover */}
            <CoverSection invitation={invitation} guest={guest} onOpen={handleOpen} brideGrooms={brideGrooms} />

            {/* Main Split Layout */}
            <div className="aruna-main">
                {/* Left Fixed Panel */}
                <div className="aruna-main__left">
                    {globalShowPhotos && <img src={getStorageUrl(invitation?.cover_image, coverBg)} alt="" className="aruna-main__left-img" />}
                    <div className="aruna-main__left-overlay">
                        <div className="aruna-main__left-pretitle">{invitation?.opening_title || 'THE WEDDING OF'}</div>
                        <div className="aruna-main__left-title">{(groom.nickname || 'Groom').toUpperCase()} &amp; {(bride.nickname || 'Bride').toUpperCase()}</div>
                        <div className="aruna-main__left-quote">
                            &ldquo;{invitation?.opening_ayat || 'I love you, I am who I am because of you. You are every reason, every hope and every dream. I\'ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.'}&rdquo;
                        </div>
                    </div>
                </div>

                {/* Right Scrollable Panel */}
                <div className="aruna-main__right">
                    {isSlideMode ? (
                        resolvedSections.map((s, idx) => {
                            const comp = componentMap[s.section_key];
                            if (!comp) return null;

                            let slideClass = 'aruna-slide-container';
                            if (idx === activeSlideIdx) slideClass += ' is-active';
                            else if (idx > activeSlideIdx) slideClass += ' is-next';
                            else slideClass += ' is-prev';

                            return (
                                <div key={s.section_key} className={slideClass}>
                                    {comp}
                                </div>
                            );
                        })
                    ) : (
                        resolvedSections.map((s) => {
                            const comp = componentMap[s.section_key];
                            if (!comp) return null;
                            return (
                                <React.Fragment key={s.section_key}>
                                    {comp}
                                    {s.section_key !== 'closing' && <DividerSection />}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Navigation and Floating Controls */}
            <Navigation 
                isOpened={isOpened} 
                isPlaying={isPlaying} 
                onToggleMusic={toggleMusic} 
                resolvedSections={resolvedSections}
                layoutMode={layoutMode}
                activeSlideIdx={activeSlideIdx}
                isSlideMode={isSlideMode}
                scrollToSection={scrollToSection}
                enableRsvp={enableRsvp}
                enableWishes={enableWishes}
                autoScrollEnabled={autoScrollEnabled}
                setAutoScrollEnabled={setAutoScrollEnabled}
                activeSection={activeSection}
            />
        </div>
    );
}
