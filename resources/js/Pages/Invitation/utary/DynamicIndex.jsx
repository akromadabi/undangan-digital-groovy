import { useTranslation } from '@/i18n';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Head, useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Asset imports
import ornamentLeft from './asset/ornament-left.webp';
import ornamentRight from './asset/ornament-right.webp';
import dividerPattern from './asset/divider-pattern.webp';
import frameProfile from './asset/frame-profile.webp';
import couplePhoto from './asset/couple-photo.webp';
import maskProfile from './asset/mask-profile.webp';
import flowerLeft from './asset/flower-left.webp';
import flowerRight from './asset/flower-right.webp';
import eventFrameTop from './asset/event-frame-top.webp';
import eventFrameBottom from './asset/event-frame-bottom.webp';
import utary1 from './asset/utary-1.webp';
import utary2 from './asset/utary-2.webp';
import utary3 from './asset/utary-3.webp';
import utary4 from './asset/utary-4.webp';
import utary5 from './asset/utary-5.webp';
import utary6 from './asset/utary-6.webp';

/* ─────────────────────────────────────────────
   SVG Monogram Shield (gold outline, TF inside)
   Extracted from original demo
   ───────────────────────────────────────────── */
function MonogramShield({ width = 134, height = 200, initials = 'TF', year = '2812' }) {
    const { t } = useTranslation();
    const first = initials?.charAt(0)?.toUpperCase() || 'T';
    const second = initials?.split('&')?.[1]?.trim()?.charAt(0)?.toUpperCase() || 
                   initials?.split(' ')?.find(s => s.length > 0 && s !== '&' && s !== first)?.charAt(0)?.toUpperCase() || 
                   'F';
    
    const yearStr = String(year || '2026');
    const yearTop = yearStr.substring(0, 2);
    const yearBottom = yearStr.substring(2, 4);

    return (
        <div className="utary-cover__monogram" style={{ width, height }}>
            <svg
                className="utary-cover__monogram-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 145.39 216.259"
                style={{ color: '#ccba82' }}
            >
                {/* Outer frame - stroke only */}
                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="m72.695,0C60.326,0,48.46,5.461,40.137,14.984c-3.082,3.527-7.524,5.432-12.188,5.227l-.077-.004c-7.28-.322-14.371,2.629-19.449,8.094C2.966,34.176.387,42.202,1.346,50.319c1.561,13.195,2.595,26.733,3.076,40.238.003.099.002.204.002.306,0,7.497-1.18,12.936-3.508,16.171-.303.422-.611.786-.916,1.099,2.181,2.259,4.445,7.117,4.424,17.506,0,.021,0,.042-.001.063-.481,13.505-1.516,27.043-3.076,40.238-.957,8.117,1.62,16.143,7.077,22.018,5.077,5.465,12.168,8.415,19.455,8.093l.07-.003c4.664-.205,9.107,1.7,12.189,5.227,8.322,9.523,20.189,14.984,32.558,14.984s24.236-5.461,32.558-14.984c3.082-3.527,7.525-5.432,12.189-5.227l.07.003c7.287.322,14.377-2.628,19.455-8.093,5.458-5.874,8.038-13.897,7.077-22.018-1.56-13.188-2.595-26.726-3.076-40.237-.002-.104-.001-.205-.002-.307,0-7.496,1.18-12.936,3.508,16.171.303-.422.611-.786.916-1.099-2.164-2.241-4.424-7.034-4.424-17.269,0-.1-.001-.199.002-.3.481-13.511,1.517-27.049,3.076-40.237.96-8.116-1.619-16.143-7.076-22.017-5.077-5.465-12.168-8.416-19.455-8.094l-.063.003c-4.671.205-9.114-1.7-12.196-5.226C96.931,5.461,85.064,0,72.695,0Z" />
                {/* Inner frame */}
                <path fill="none" stroke="currentColor" strokeWidth="1" d="m72.695,208.264c-10.061,0-19.733-4.465-26.538-12.25-4.43-5.069-10.817-7.976-17.525-7.976-.344,0-.687.007-1.014.022-.341.015-.593.02-.844.02-4.336,0-8.502-1.701-11.73-4.789-4.329-4.143-6.481-10.278-5.757-16.412,1.585-13.408,2.637-27.167,3.126-40.893l.007-.605c0-7.009-.91-12.526-2.782-16.854l-.172-.397.172-.397c1.872-4.326,2.782-9.861,2.782-16.922l-.008-.563c-.488-13.702-1.54-27.459-3.125-40.868-.725-6.133,1.428-12.268,5.758-16.412,3.229-3.088,7.393-4.79,11.728-4.79.249,0,.499.005.815.019.367.016.714.023,1.058.023,6.699,0,13.082-2.907,17.513-7.977,6.804-7.785,16.476-12.25,26.537-12.25s19.734,4.465,26.539,12.25c4.429,5.069,10.815,7.977,17.521,7.977.346,0,.691-.007,1.032-.022.349-.015.598-.021.847-.021,4.324,0,8.484,1.702,11.713,4.791,4.33,4.143,6.481,10.278,5.757,16.412-1.586,13.417-2.638,27.175-3.126,40.893l-.007.605c0,7.012.91,12.528,2.782,16.854l.172.397-.172.397c-1.872,4.326-2.782,9.861-2.782,16.921l.008.564c.487,13.694,1.539,27.451,3.125,40.869.726,6.131-1.426,12.266-5.757,16.411-3.229,3.089-7.395,4.79-11.73,4.79-.249,0-.497-.005-.826-.02-7.104-.324-13.9,2.625-18.557,7.953-6.806,7.785-16.479,12.25-26.539,12.25Z" />
            </svg>
            {/* Text overlaid on top of the SVG */}
            <div className="utary-cover__monogram-inner">
                <span className="utary-cover__monogram-year-top">{yearTop}</span>
                <span className="utary-cover__monogram-initials">{first}<sub className="utary-cover__monogram-initial-sub">{second}</sub></span>
                <span className="utary-cover__monogram-year-bottom">{yearBottom}</span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Ornament Guard SVG (for RSVP & Gift sections)
   Curved bracket/arch border from reference
   ───────────────────────────────────────────── */
function OrnamentGuardTop() {
    return (
        <div className="utary-ornament-guard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407.46 29.54" style={{ width: '100%', display: 'block' }}>
                <path fill="#c8b680" d="M2,29.54c14.94-.52,27-12.59,27.52-27.54h348.42c.52,14.95,12.58,27.02,27.52,27.54h2v-.98c0-.55-.45-1-1-1-14.63,0-26.54-11.91-26.54-26.56,0-.55-.45-1-1-1H28.54c-.55,0-1,.45-1,1,0,14.64-11.9,26.56-26.54,26.56-.55,0-1,.45-1,1v.98h2Z" />
            </svg>
        </div>
    );
}

function OrnamentGuardBottom() {
    return (
        <div className="utary-ornament-guard utary-ornament-guard--bottom">
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
        <svg className="utary-countdown__diamond" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <path fill="var(--utary-bg)" stroke="#cdbb83" strokeWidth="1"
                d="M 50 15 A 25 25 0 0 1 85 50 A 25 25 0 0 1 50 85 A 25 25 0 0 1 15 50 A 25 25 0 0 1 50 15 Z" />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Particle Canvas Component
   ───────────────────────────────────────────── */
const THEME_DEFAULTS = {
    opening_title: 'The Wedding Of',
    opening_text: "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami.",
    opening_ayat: 'Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).',
    opening_ayat_source: 'Adz-Dzariyat: 49',
    closing_title: 'THANK YOU',
    closing_text: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.',
    cover_title: 'Tary & Fachrul',
    cover_subtitle: 'Club House Jakarta Garden City',
    countdown_target_date: '2026-12-20T08:00:00',
    music_url: '/audio/backsound.mp3'
};

/* ─────────────────────────────────────────────
   Countdown Hook
   ───────────────────────────────────────────── */
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const tick = () => {
            const now = new Date().getTime();
            const diff = new Date(targetDate).getTime() - now;
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

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#fff', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
                <h2 style={{ color: '#ff4d4d' }}>Terjadi kesalahan pada tema Utary.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#ccc', marginTop: 10 }}>
                    {this.state.error?.toString()}
                    {"\n\nStack Trace:\n"}
                    {this.state.error?.stack}
                </pre>
            </div>
        );
        return this.props.children;
    }
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
                }
            },
            { threshold: 0.15 }
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
    const cls = variant ? `utary-reveal--${variant}` : 'utary-reveal';
    return <div ref={ref} className={`${cls} ${className}`}>{children}</div>;
}

/* ── Formatting Helpers ── */
const formatDate = (dateStr, lang = 'id') => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return String(dateStr).toUpperCase();
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).toUpperCase();
};

const formatShortDate = (dateStr, lang = 'id') => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr;
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        month: 'long',
        year: 'numeric'
    });
};

/* ═══════════════════════════════════════
   SECTION COMPONENTS
   ═══════════════════════════════════════ */

/* ── Cover ── */
function CoverSection({ onOpen, guestName, invitation, brideGrooms, isOpened }) {
    const { t } = useTranslation();
    const couples = brideGrooms || [];
    const bride = couples.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    
    const names = (bride.nickname && groom.nickname) 
        ? `${bride.nickname} & ${groom.nickname}`
        : (invitation?.cover_title || THEME_DEFAULTS.cover_title);

    const subtitle = invitation?.cover_subtitle || THEME_DEFAULTS.cover_subtitle;
    const year = invitation?.countdown_target_date ? new Date(invitation.countdown_target_date).getFullYear() : '2026';

    return (
        <div className={`utary-cover ${isOpened ? 'is-opened' : ''}`} id="utary-cover">
            <MonogramShield initials={names} year={year} />
            <div className="utary-cover__names">{names}</div>
            <div className="utary-cover__guest-box">
                <div className="utary-cover__guest-label">{t('invitation.to')}</div>
                <div className="utary-cover__guest-name">{guestName || 'Tamu Undangan'}</div>
                <p className="utary-cover__apology">{t('invitation.dear_guest_desc')}</p>
            </div>
            <button type="button" className="utary-cover__btn" onClick={onOpen}>
                {t('invitation.open').toUpperCase()}
            </button>
        </div>
    );
}

/* ── Hero ── */
function HeroSection({ invitation, brideGrooms, layoutMode, id }) {
    const { t } = useTranslation();
    const couples = brideGrooms || [];
    const bride = couples.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    
    const rawNames = (bride.nickname && groom.nickname) 
        ? `${bride.nickname} & ${groom.nickname}`
        : (invitation?.cover_title || THEME_DEFAULTS.cover_title);

    const names = rawNames.replace(' & ', ' &\n');
    
    return (
        <section className="utary-section utary-hero" id={id || "home"}>
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <div className="utary-hero__pretitle">
                        {(!invitation?.opening_title || invitation.opening_title.toUpperCase() === 'THE WEDDING OF' || invitation.opening_title.toUpperCase() === 'PERNIKAHAN') 
                            ? t('invitation.wedding_of') 
                            : invitation.opening_title}
                    </div>
                </RevealDiv>
                <RevealDiv>
                    <h1 className="utary-hero__title" style={{ whiteSpace: 'pre-line' }}>
                        {names}
                    </h1>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__date-text">{formatShortDate(invitation?.countdown_target_date, invitation?.language || 'id') || 'Desember 2026'}</div>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__verse">
                        <p>{invitation?.opening_ayat || THEME_DEFAULTS.opening_ayat}</p>
                        {invitation?.opening_ayat_source && <cite>{invitation.opening_ayat_source}</cite>}
                    </div>
                </RevealDiv>
                <div className="utary-scroll-indicator">
                    <i className={`fas ${layoutMode === 'slide-h' ? 'fa-chevron-right' : 'fa-chevron-down'} utary-scroll-indicator__chevron`} />
                </div>
            </div>
        </section>
    );
}

/* ── Divider ── */
function DividerSection() {
    return (
        <RevealDiv variant="zoom" className="utary-divider">
            <img src={dividerPattern} alt="" className="utary-divider__img" />
        </RevealDiv>
    );
}

/* ── Couple ── */
function CoupleSection({ invitation, brideGrooms, id }) {
    const { t } = useTranslation();
    // Determine groom and bride
    const couples = brideGrooms || [];
    const bride = couples.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const isEn = t('invitation.save_the_date') === 'Save The Date';
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

    return (
        <section className="utary-section utary-section--padded" id={id || "couple"}>
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv className="utary-couple__header">
                    <h2 className="utary-couple__title">{t('invitation.mempelai')}</h2>
                    <p className="utary-couple__desc" style={{ whiteSpace: 'pre-line' }}>
                        {invitation?.opening_text || (
                            t('invitation.save_the_date') === 'Save The Date' 
                                ? 'In the name of Allah, the Most Gracious, the Most Merciful. Under His guidance, we invite you to celebrate our union in holy matrimony.' 
                                : 'Dengan segala puji bagi Allah yang telah menciptakan mahluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkai cinta yang Engkau berikan dalam ikatan pernikahan.'
                        )}
                    </p>
                </RevealDiv>

                <RevealDiv className="utary-profile">
                    {globalShowPhotos && bride.photo && (
                        <div className="utary-profile__frame-wrap">
                            <img src={frameProfile} alt="" className="utary-profile__frame" />
                            <img 
                                src={bride.photo} 
                                alt={bride.name || 'Utary Adhita'} 
                                className="utary-profile__photo" 
                                style={{
                                    WebkitMaskImage: `url(${maskProfile})`,
                                    maskImage: `url(${maskProfile})`,
                                    WebkitMaskSize: 'cover',
                                    maskSize: 'cover',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat'
                                }}
                            />
                        </div>
                    )}
                    <h3 className="utary-profile__name">{(bride.full_name || bride.nickname || 'UTARY ADHITA').toUpperCase()}</h3>
                    <p className="utary-profile__role">{translateChildOrder(bride.child_order, 'wanita')}</p>
                    <p className="utary-profile__parents">
                        {t('invitation.save_the_date') === 'Save The Date' ? 'Mr.' : 'Bapak'} {bride.father_name || 'Nama Bapak'}<br />&amp; {t('invitation.save_the_date') === 'Save The Date' ? 'Mrs.' : 'Ibu'} {bride.mother_name || 'Nama Ibu'}
                    </p>
                    {(bride.instagram || bride.instagram_username) && (
                        <a href={`https://www.instagram.com/${(bride.instagram || bride.instagram_username).replace('@', '')}`} className="utary-profile__social" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram" /> @{(bride.instagram || bride.instagram_username).replace('@', '').toUpperCase()}
                        </a>
                    )}
                </RevealDiv>

                {/* Ampersand */}
                <RevealDiv variant="zoom" className="utary-ampersand">
                    <div className="utary-ampersand__line" />
                    <span className="utary-ampersand__symbol">&amp;</span>
                    <div className="utary-ampersand__line" />
                </RevealDiv>

                {/* Groom */}
                <RevealDiv className="utary-profile">
                    {globalShowPhotos && groom.photo && (
                        <div className="utary-profile__frame-wrap">
                            <img src={frameProfile} alt="" className="utary-profile__frame" />
                            <img 
                                src={groom.photo} 
                                alt={groom.name || 'Fachrul Rozi'} 
                                className="utary-profile__photo" 
                                style={{
                                    WebkitMaskImage: `url(${maskProfile})`,
                                    maskImage: `url(${maskProfile})`,
                                    WebkitMaskSize: 'cover',
                                    maskSize: 'cover',
                                    WebkitMaskPosition: 'center',
                                    maskPosition: 'center',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskRepeat: 'no-repeat'
                                }}
                            />
                        </div>
                    )}
                    <h3 className="utary-profile__name">{(groom.full_name || groom.nickname || 'FACHRUL ROZI').toUpperCase()}</h3>
                    <p className="utary-profile__role">{translateChildOrder(groom.child_order, 'pria')}</p>
                    <p className="utary-profile__parents">
                        {t('invitation.save_the_date') === 'Save The Date' ? 'Mr.' : 'Bapak'} {groom.father_name || 'Nama Bapak'}<br />&amp; {t('invitation.save_the_date') === 'Save The Date' ? 'Mrs.' : 'Ibu'} {groom.mother_name || 'Nama Ibu'}
                    </p>
                    {(groom.instagram || groom.instagram_username) && (
                        <a href={`https://www.instagram.com/${(groom.instagram || groom.instagram_username).replace('@', '')}`} className="utary-profile__social" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram" /> @{(groom.instagram || groom.instagram_username).replace('@', '').toUpperCase()}
                        </a>
                    )}
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Timeline Card with Scroll Observer (active/glow state when scrolled over) ── */
function TimelineCard({ story, index, language }) {
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
        <div ref={ref} className={`utary-timeline__item ${isActive ? 'is-active' : ''}`}>
            <div className="utary-timeline__dot" />
            <div className="utary-timeline__card">
                {story.story_date && (
                    <div className="utary-timeline__card-date">
                        {formatDate(story.story_date, language)}
                    </div>
                )}
                <h3 className="utary-timeline__card-title">{story.title || story.year}</h3>
                {(story.description || story.story || story.text) && (
                    <p className="utary-timeline__card-text">{story.description || story.story || story.text}</p>
                )}
            </div>
        </div>
    );
}

/* ── Timeline ── */
function TimelineSection({ loveStories, invitation, id }) {
    const { t } = useTranslation();
    const stories = loveStories?.length > 0 ? loveStories : [
        { title: t('invitation.save_the_date') === 'Save The Date' ? 'Chapter One: First Meeting' : 'Chapter One: Awal Bertemu', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum.' },
        { title: t('invitation.save_the_date') === 'Save The Date' ? 'Chapter Two: In Relationship' : 'Chapter Two: Menjalin Hubungan', text: 'Facilisis sed odio morbi quis commodo odio. Condimentum mattis pellentesque id nibh tortor id aliquet. Quis imperdiet massa tincidunt nunc pulvinar sapien et ligula.' },
        { title: t('invitation.save_the_date') === 'Save The Date' ? 'Chapter Three: Engagement' : 'Chapter Three: Bertunangan', text: 'Magna fermentum iaculis eu non. Pretium lectus quam id leo. Arcu vitae elementum curabitur vitae nunc sed.' },
        { title: t('invitation.save_the_date') === 'Save The Date' ? 'Chapter Four: Wedding Day' : 'Chapter Four: Hari Pernikahan', text: 'Augue lacus viverra vitae congue eu consequat. Eget nunc scelerisque viverra mauris in aliquam sem fringilla.' }
    ];

    return (
        <section className="utary-section utary-section--padded" id={id || "story"}>
            <div className="utary-section__inner">
                <RevealDiv className="utary-timeline__header">
                    <div className="utary-timeline__pretitle" style={{ fontFamily: 'var(--utary-font-display)', fontSize: '18px', color: 'var(--utary-gold)', textAlign: 'center' }}>{t('invitation.save_the_date') === 'Save The Date' ? 'A Story of' : 'Kisah Perjalanan'}</div>
                    <h2 className="utary-timeline__title" style={{ textAlign: 'center' }}>{t('invitation.love_journey').toUpperCase()}</h2>
                    <p className="utary-timeline__desc" style={{ color: 'var(--utary-gold)', fontStyle: 'italic', maxWidth: '340px', margin: '0 auto 40px', lineHeight: '2', fontWeight: '300', fontSize: '12px', textAlign: 'center' }}>
                        {t('invitation.save_the_date') === 'Save The Date' 
                            ? '“Marriage is not a race, it’s not about fast or slow. But, who is ready to carry out a great mandate.”'
                            : '“Pernikahan bukanlah perlombaan, ini bukan tentang cepat atau lambat. Tetapi, siapa yang siap memikul amanah besar.”'}
                    </p>
                </RevealDiv>

                <div className="utary-timeline__track">
                    <div className="utary-timeline__line" />
                    {stories.map((s, i) => (
                        <TimelineCard key={i} story={s} index={i} language={invitation?.language || 'id'} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ── Event (Save The Date) ── */
function EventSection({ invitation, events }) {
    const { t } = useTranslation();
    const countdown = useCountdown(invitation?.countdown_target_date || THEME_DEFAULTS.countdown_target_date);

    return (
        <section className="utary-section utary-section--padded" id="event">
            <img src={flowerLeft} alt="" className="utary-ornament utary-ornament--flower-left" />
            <img src={flowerRight} alt="" className="utary-ornament utary-ornament--flower-right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-event__title">{t('invitation.save_the_date')}</h2>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__quote">
                        {invitation?.opening_ayat || THEME_DEFAULTS.opening_ayat}
                    </div>
                </RevealDiv>

                {/* Countdown */}
                <RevealDiv>
                    <div className="utary-countdown utary-countdown--diamond">
                        {[
                            { val: countdown.days, label: t('invitation.days') },
                            { val: countdown.hours, label: t('invitation.hours') },
                            { val: countdown.minutes, label: t('invitation.minutes') },
                            { val: countdown.seconds, label: t('invitation.seconds') },
                        ].map((item, i) => (
                            <div key={i} className="utary-countdown__item utary-countdown__item--diamond">
                                <div className="utary-countdown__diamond-wrap">
                                    <CountdownDiamondFrame />
                                    <div className="utary-countdown__num">{item.val}</div>
                                </div>
                                <div className="utary-countdown__label">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </RevealDiv>

                <RevealDiv>
                    <button type="button" className="utary-event__save-btn" onClick={() => window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+${invitation?.cover_title}&dates=20261220T010000Z%2F20261220T070000Z`, '_blank')}>
                        {t('invitation.save_the_date')}
                    </button>
                </RevealDiv>

                <RevealDiv>
                    <div className="utary-event__subtitle">{t('invitation.save_the_date') === 'Save The Date' ? 'Date & Place' : 'Tanggal & Tempat'}</div>
                </RevealDiv>

                <RevealDiv>
                    <img src={eventFrameTop} alt="" style={{ width: '100%', marginBottom: '-1px' }} />
                </RevealDiv>

                 {events?.map((ev, i) => {
                    const streamsList = [];
                    if (ev?.streaming_url) {
                        streamsList.push({
                            platform: ev.streaming_platform || 'Live',
                            url: ev.streaming_url
                        });
                    }
                    if (Array.isArray(ev?.streamings)) {
                        ev.streamings.forEach(s => {
                            if (s.url && !streamsList.some(item => item.url === s.url)) {
                                streamsList.push({
                                    platform: s.platform || 'Live',
                                    url: s.url
                                });
                            }
                        });
                    }

                    return (
                        <RevealDiv key={i}>
                            <div className="utary-event__card" style={{ borderRadius: 0, marginBottom: i === events.length - 1 ? 0 : '20px' }}>
                                <div className="utary-event__card-title">{ev.event_name?.toUpperCase()}</div>
                                <div className="utary-event__card-detail">{formatDate(ev.event_date, invitation?.language || 'id')}</div>
                                <div className="utary-event__card-detail">{ev.start_time} - {ev.end_time || 'Selesai'} {ev.timezone || 'WIB'}</div>
                                <div className="utary-event__card-venue">{ev.venue_name?.toUpperCase()}</div>
                                <div className="utary-event__card-address">{ev.venue_address}</div>
                                {ev.gmaps_link && (
                                    <button type="button" className="utary-event__map-btn" onClick={() => window.open(ev.gmaps_link, '_blank')}>
                                        GOOGLE MAPS
                                    </button>
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



/* ── Live Streaming ── */
function LiveStreamingSection({ invitation, events }) {
    const { t } = useTranslation();
    const eventList = events || [];
    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
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

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    return (
        <section className="utary-section utary-section--padded" id="livestream">
            <div className="utary-section__inner">
                {globalShowPhotos && (
                    <RevealDiv>
                        <img src={couplePhoto} alt="Live Streaming" className="utary-livestream__photo" />
                    </RevealDiv>
                )}
                <RevealDiv>
                    <h2 className="utary-couple__title">
                        {isEn ? 'Join Our Wedding' : 'Saksikan Pernikahan Kami'}<br />Live Streaming
                    </h2>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-hero__date-text" style={{ marginBottom: '4px' }}>{formatDate(primaryEvent?.event_date, invitation?.language || 'id')}</div>
                    <div className="utary-hero__venue" style={{ marginBottom: '16px' }}>{primaryEvent?.start_time} - {primaryEvent?.end_time || 'Selesai'} {primaryEvent?.timezone || 'WIB'}</div>
                </RevealDiv>
                <RevealDiv>
                    <p className="utary-gift__desc" style={{ marginBottom: '16px' }}>
                        {isEn 
                            ? 'We will broadcast the happy moments of our wedding procession virtually through the following platforms.'
                            : 'Kami akan menyiarkan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.'}
                    </p>
                </RevealDiv>
                <RevealDiv>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                        {streamsList.map((stream, idx) => (
                            <button 
                                key={idx}
                                type="button" 
                                className="utary-event__save-btn" 
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
        <section className="utary-section" id="video">
            <div className="utary-section__inner" style={{ maxWidth: '100%', padding: '0 24px' }}>
                <RevealDiv>
                    <DividerSection />
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-video__wrapper">
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
    const couples = brideGrooms || [];
    const bride = couples.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    const displayNames = (bride.nickname && groom.nickname) 
        ? `${bride.nickname} & ${groom.nickname}`
        : (invitation?.cover_title || THEME_DEFAULTS.cover_title);

    const images = galleries?.length > 0 ? galleries.map(g => g.image_url) : [utary1, utary2, utary3, utary4, utary5, utary6];
    if (!globalShowPhotos) return null;
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const openLightbox = (index) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(-1);
    const prevImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + images.length) % images.length); };
    const nextImage = (e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % images.length); };

    return (
        <section className="utary-section utary-section--padded" id="gallery">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-gallery__title">{t('invitation.gallery')}</h2>
                    <p className="utary-gift__desc" style={{ fontStyle: 'italic' }}>
                        {t('invitation.save_the_date') === 'Save The Date'
                            ? '“I was created in time to fill your time, and I use all the time in my life to love you.”'
                            : '“Aku diciptakan dalam waktu untuk mengisi waktumu, dan aku menggunakan seluruh waktu dalam hidupku untuk mencintaimu.”'}
                    </p>
                    <p className="utary-hero__venue" style={{ marginBottom: '20px' }}>Photo Video by {displayNames}</p>
                </RevealDiv>
                <RevealDiv className="utary-gallery__grid">
                    {images.map((src, i) => (
                        <div key={i} className="utary-gallery__item" onClick={() => openLightbox(i)}>
                            <img src={src} alt={`Gallery ${i + 1}`} />
                            <div className="utary-gallery__zoom-icon">
                                <i className="fas fa-search-plus" />
                            </div>
                        </div>
                    ))}
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-gallery__quote">
                        <p>{(invitation?.closing_text && 
                             invitation.closing_text !== 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.' && 
                             !invitation.closing_text.includes('kehormatan dan kebahagiaan')) 
                            ? invitation.closing_text 
                            : (
                                t('invitation.save_the_date') === 'Save The Date'
                                    ? '“I love you, I am who I am because of you. You are every reason, every hope and every dream. I’ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.”'
                                    : '“Aku mencintaimu, aku menjadi diriku yang sekarang karena kamu. Kamu adalah setiap alasan, setiap harapan, dan setiap mimpi yang pernah kumiliki. Dan apa pun yang terjadi pada kita di masa depan, setiap hari bersama kita adalah hari terindah dalam hidupku. Aku akan selalu menjadi milikmu.”'
                            )
                        }</p>
                        <p style={{ marginTop: '10px', fontWeight: '400' }}>{displayNames.toUpperCase()}</p>
                    </div>
                </RevealDiv>
            </div>
            
            {/* Lightbox / Carousel Elementor Style */}
            {lightboxIndex >= 0 && (
                <div className="utary-lightbox" onClick={closeLightbox}>
                    <button type="button" className="utary-lightbox__close" onClick={closeLightbox} title="Close">
                        <i className="fas fa-times" />
                    </button>
                    <div className="utary-lightbox__content" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="utary-lightbox__nav utary-lightbox__nav--prev" onClick={prevImage}>
                            <i className="fas fa-chevron-left" />
                        </button>
                        <img 
                            src={images[lightboxIndex]} 
                            alt="Zoomed Gallery" 
                            className="utary-lightbox__img" 
                        />
                        <button type="button" className="utary-lightbox__nav utary-lightbox__nav--next" onClick={nextImage}>
                            <i className="fas fa-chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}



/* ── Gift ── */
function GiftSection({ bankAccounts, id }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(null);
    const [giftTab, setGiftTab] = useState('amplop');

    const allAccounts = bankAccounts || [];
    const registryKeywords = ['kado', 'alamat', 'gift', 'registry', 'kirim kado', 'physical'];
    const isRegistry = (bankName) => registryKeywords.some(keyword => String(bankName).toLowerCase().includes(keyword));

    const amplopAccounts = allAccounts.filter(acc => !isRegistry(acc.bank_name));
    const registryAccounts = allAccounts.filter(acc => isRegistry(acc.bank_name));

    const copyToClipboard = (text, id) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(id);
                setTimeout(() => setCopied(null), 2000);
            }).catch(() => {
                fallbackCopy(text, id);
            });
        } else {
            fallbackCopy(text, id);
        }
    };

    const fallbackCopy = (text, id) => {
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

        // Extra range selection compatibility for iOS Safari / Instagram webview
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
                setCopied(id);
                setTimeout(() => setCopied(null), 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    return (
        <section className="utary-section utary-section--padded" id={id || "gift"}>
            <div className="utary-section__inner">
                {/* Ornament Guard Top */}
                <OrnamentGuardTop />

                <div className="utary-guard-content">
                    <RevealDiv>
                        <h2 className="utary-gift__title">{t('invitation.gift_title')}</h2>
                        <p className="utary-gift__desc">
                            {t('invitation.save_the_date') === 'Save The Date'
                                ? 'Your blessings are a very meaningful gift for us. However, if giving is an expression of your love, we would happily receive it, which will surely complete our happiness.'
                                : 'Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami akan senang hati menerimanya yang tentu akan semakin melengkapi kebahagiaan kami.'}
                        </p>
                    </RevealDiv>

                    {registryAccounts.length > 0 && (
                        <RevealDiv>
                            <div className="utary-gift__tabs">
                                <button type="button" className={`utary-gift__tab ${giftTab === 'amplop' ? 'is-active' : ''}`} onClick={() => setGiftTab('amplop')}>E-Amplop</button>
                                <button type="button" className={`utary-gift__tab ${giftTab === 'registry' ? 'is-active' : ''}`} onClick={() => setGiftTab('registry')}>Gift Registry</button>
                            </div>
                        </RevealDiv>
                    )}

                    {(giftTab === 'amplop' || registryAccounts.length === 0) && (
                        <>
                            {amplopAccounts.map((bank, i) => (
                                <RevealDiv key={i}>
                                    <div className="utary-gift__card">
                                        <div className="utary-gift__bank-name">{bank.bank_name}</div>
                                        <div className="utary-gift__account">{bank.account_number}</div>
                                        <div className="utary-gift__holder">{bank.account_name}</div>
                                        <button type="button" className="utary-gift__copy-btn" onClick={() => copyToClipboard(bank.account_number, `bank-${i}`)}>
                                            {copied === `bank-${i}` ? 'Tersalin!' : 'Salin'}
                                        </button>
                                    </div>
                                </RevealDiv>
                            ))}
                            {amplopAccounts.length === 0 && (
                                <RevealDiv>
                                    <div className="utary-gift__card">
                                        <div className="utary-gift__bank-name">BCA</div>
                                        <div className="utary-gift__account">0123 456 789</div>
                                        <div className="utary-gift__holder">Nama Penerima</div>
                                        <button type="button" className="utary-gift__copy-btn" onClick={() => copyToClipboard('0123456789', 'bca')}>
                                            {copied === 'bca' ? 'Tersalin!' : 'Salin'}
                                        </button>
                                    </div>
                                </RevealDiv>
                            )}
                        </>
                    )}

                    {giftTab === 'registry' && registryAccounts.length > 0 && (
                        <>
                            {registryAccounts.map((registry, i) => (
                                <RevealDiv key={i}>
                                    <div className="utary-gift__card">
                                        <div className="utary-gift__bank-name">{registry.bank_name.toUpperCase()}</div>
                                        <div className="utary-gift__holder" style={{ marginBottom: '8px', wordBreak: 'break-word', padding: '0 12px' }}>{registry.account_number}</div>
                                        <div className="utary-gift__holder" style={{ fontSize: '12px', opacity: 0.8, marginBottom: '12px' }}>a.n. {registry.account_name}</div>
                                        <button type="button" className="utary-gift__copy-btn" onClick={() => copyToClipboard(registry.account_number, `address-${i}`)}>
                                            {copied === `address-${i}` ? 'Tersalin!' : 'Salin'}
                                        </button>
                                    </div>
                                </RevealDiv>
                            ))}
                        </>
                    )}
                </div>

                {/* Ornament Guard Bottom */}
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}

/* ── UNIFIED RSVP & UCAPAN ── */
const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, id }) {
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || new URLSearchParams(window.location.search).get('to') || '';
    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const [sharedName, setSharedName] = useState(guestName);
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const rsvpForm = useForm({
        sender_name: guestName,
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: activeGuest.id || null,
    });

    const wishForm = useForm({
        sender_name: guestName,
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
                    onSuccess: () => {
                        setMessage('');
                        setSuccess(true);
                    },
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
    const safeWishes = wishes || [];
    const recentWishes = safeWishes.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? (isEn ? 'RSVP & Wishes' : 'Konfirmasi & Ucapan')
        : enableRsvp
            ? (isEn ? 'Attendance Confirmation' : 'Konfirmasi Kehadiran')
            : (isEn ? 'Wishes & Prayers' : 'Ucapan & Doa');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section className="utary-section utary-section--padded" id={id || 'rsvp'}>
            <div className="utary-section__inner">
                {/* Ornament Guard Top */}
                <OrnamentGuardTop />

                <div className="utary-guard-content">
                    <RevealDiv>
                        <h2 className="utary-rsvp__title">{sectionTitle}</h2>
                        <p className="utary-gift__desc">
                            {isEn
                                ? 'Please fill out the form below to send your confirmation and wishes.'
                                : 'Mohon isi formulir berikut untuk mengirimkan konfirmasi dan ucapan Anda.'}
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <form className="utary-rsvp__form" onSubmit={handleSubmit}>
                            {/* Nama */}
                            <div className="utary-rsvp__field">
                                <label className="utary-rsvp__label">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                                <input
                                    className="utary-rsvp__input"
                                    type="text"
                                    required
                                    readOnly={!!activeGuest.name}
                                    placeholder={isEn ? 'Your Name' : 'Nama Lengkap'}
                                    value={sharedName}
                                    onChange={e => setSharedName(e.target.value)}
                                />
                            </div>

                            {/* Konfirmasi Kehadiran - jika RSVP aktif */}
                            {enableRsvp && (
                                <div className="utary-rsvp__field">
                                    <label className="utary-rsvp__label">{isEn ? 'Attendance Confirmation' : 'Konfirmasi Kehadiran'}</label>
                                    <div className="utary-rsvp__radio-group">
                                        <label className="utary-rsvp__radio-label">
                                            <input
                                                type="radio"
                                                name="attendance"
                                                value="hadir"
                                                checked={attendance === 'hadir'}
                                                onChange={() => setAttendance('hadir')}
                                            />
                                            {isEn ? 'Attending' : 'Hadir'}
                                        </label>
                                        <label className="utary-rsvp__radio-label">
                                            <input
                                                type="radio"
                                                name="attendance"
                                                value="tidak_hadir"
                                                checked={attendance === 'tidak_hadir'}
                                                onChange={() => setAttendance('tidak_hadir')}
                                            />
                                            {isEn ? 'Not Attending' : 'Tidak Hadir'}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Jumlah Tamu - jika RSVP aktif DAN hadir */}
                            {enableRsvp && attendance === 'hadir' && (
                                <div className="utary-rsvp__field">
                                    <label className="utary-rsvp__label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                                    <select
                                        className="utary-rsvp__select"
                                        value={numGuests}
                                        onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                    >
                                        <option value="1">1 {isEn ? 'Person' : 'Orang'}</option>
                                        <option value="2">2 {isEn ? 'People' : 'Orang'}</option>
                                        <option value="3">3 {isEn ? 'People' : 'Orang'}</option>
                                    </select>
                                </div>
                            )}

                            {/* Ucapan & Doa - jika Wishes aktif */}
                            {enableWishes && (
                                <div className="utary-rsvp__field">
                                    <label className="utary-rsvp__label">{isEn ? 'Wishes & Prayers' : 'Ucapan & Doa'}</label>
                                    <textarea
                                        className="utary-rsvp__textarea"
                                        placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan untuk kedua mempelai...'}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required={!enableRsvp}
                                    />
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitting} className="utary-rsvp__submit">
                                {isSubmitting ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Send' : 'Kirim')}
                            </button>

                            {success && (
                                <p style={{ color: 'var(--utary-primary)', marginTop: '12px', fontSize: '13px', textAlign: 'center' }}>
                                    ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                                </p>
                            )}
                        </form>
                    </RevealDiv>

                    {/* Daftar Ucapan - max 5, scrollable */}
                    {enableWishes && recentWishes.length > 0 && (
                        <div className="utary-wishes-list-wrapper">
                            <div className="utary-wishes-list" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                {recentWishes.map((w, i) => (
                                    <RevealDiv key={w.id || i}>
                                        <div className="utary-wish" style={{ textAlign: 'left', marginBottom: '12px' }}>
                                            <div className="utary-wish__name">{w.sender_name || w.name}</div>
                                            <div className="utary-wish__text">{w.message || w.text}</div>
                                            <div className="utary-wish__time">
                                                {w.created_at ? new Date(w.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                                            </div>
                                        </div>
                                    </RevealDiv>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Ornament Guard Bottom */}
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}


/* ── Footer ── */
function FooterSection({ invitation, brideGrooms, id }) {
    const { t } = useTranslation();
    const couples = brideGrooms || [];
    const bride = couples.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    const displayNames = (bride.nickname && groom.nickname) 
        ? `${bride.nickname} & ${groom.nickname}`
        : (invitation?.cover_title || THEME_DEFAULTS.cover_title);

    const names = displayNames.toUpperCase();
    const year = invitation?.countdown_target_date ? new Date(invitation.countdown_target_date).getFullYear() : '2026';

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
        <footer className="utary-footer" id={id || "closing"}>
            <RevealDiv>
                <DividerSection />
                <MonogramShield width={120} height={180} initials={displayNames} year={year} />
                <div className="utary-footer__initial">{names}</div>
                <div className="utary-footer__thankyou">{displayClosingTitle}</div>
                <div className="utary-footer__message">
                    {displayClosingText}
                </div>
                
                {/* Formal Tanda Tangan Penutup */}
                <div className="utary-footer__signature" style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.7 }}>
                        {isEn ? 'We Who Are Joyful,' : 'Kami Yang Berbahagia,'}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85, display: 'flex', flexDirection: 'column', gap: '4px', fontStyle: 'normal' }}>
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

                <div className="utary-footer__credit">Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'Groovy Digital'}</div>
            </RevealDiv>
        </footer>
    );
}

/* ── Turut Mengundang ── */
function TurutMengundangSection({ invitation }) {
    const { t } = useTranslation();
    if (!invitation?.turut_mengundang_text) return null;

    const names = invitation.turut_mengundang_text.split('\n').filter(n => n.trim() !== '');

    return (
        <section className="utary-section utary-section--padded" id="turut-mengundang">
            <div className="utary-section__inner">
                <RevealDiv>
                    <h2 className="utary-couple__title">{t('invitation.also_inviting')}</h2>
                </RevealDiv>
                <RevealDiv>
                    <div className="utary-turut-mengundang__list" style={{ color: 'var(--utary-gold)', fontSize: '14px', lineHeight: '2', fontWeight: '300' }}>
                        {names.map((name, i) => (
                            <div key={i}>{name}</div>
                        ))}
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}

/* ── Navigation Menu & Controls ── */
function Navigation({ 
    invitation, 
    guest, 
    isOpened, 
    isPlaying, 
    onToggleMusic, 
    scrollToSection, 
    activeMenuId, 
    isSlideMode,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen
}) {
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const enableQr = invitation?.enable_qr !== false && invitation?.show_qr_code !== false;
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const pos = invitation?.menu_position || 'right';
    if (pos === 'none' || !isOpened) return null;

    const menuItems = [
        { label: t('nav.opening').toUpperCase(), id: 'hero' },
        { label: t('nav.mempelai').toUpperCase(), id: 'couple' },
        { label: t('nav.kisah').toUpperCase(), id: 'love_story' },
        { label: t('nav.acara').toUpperCase(), id: 'event' },
        { label: t('nav.galeri').toUpperCase(), id: 'gallery' },
        { label: t('nav.rsvp').toUpperCase(), id: 'rsvp' },
        { label: t('nav.hadiah').toUpperCase(), id: 'bank' },
    ];

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

    const handleNavItemClick = (id) => {
        setAutoScrollEnabled(false);
        if (scrollToSection) {
            scrollToSection(id);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
        handleCloseMenu();
    };

    const positionClass = `utary-top-nav--${pos}`;

    return (
        <>
            {/* Overlay Navigation Menu */}
            <div className={`utary-nav-drawer ${isMenuOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}>
                <div className={`utary-nav-drawer__top ${positionClass}`}>
                    <button type="button" className="utary-nav-drawer__close" onClick={handleCloseMenu} title="Close">
                        CLOSE
                    </button>
                </div>
                <ul className="utary-nav-drawer__list">
                    {menuItems.map((item) => {
                        const isActive = activeMenuId === item.id;
                        return (
                            <li key={item.label} className="utary-nav-drawer__item">
                                <button 
                                    type="button"
                                    onClick={() => handleNavItemClick(item.id)}
                                    style={isActive ? { color: 'var(--utary-gold)', fontWeight: 'bold' } : {}}
                                >
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Bottom Controls */}
            <div className={`utary-bottom-controls ${isMenuOpen ? 'is-hidden' : ''} ${pos === 'bottom' ? 'utary-bottom-controls--raised' : ''}`}>
                <div className="utary-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {enableQr && activeGuest && (
                        <button type="button" className="utary-floating__btn" onClick={() => setShowQr(true)} title="QR Check-in">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.875 12h.75m-.75 3h.75m-.75 3h.75m3-6v.008h.008v-.008h-.008zm0 3v.008h.008v-.008h-.008zm0 3v.008h.008v-.008h-.008zm-6-6h.008v.008H13.5V12zm0 3h.008v.008H13.5v-.008zm0 3h.008v.008H13.5v-.008z" />
                            </svg>
                        </button>
                    )}
                    <button type="button" className="utary-floating__btn" onClick={() => handleNavItemClick('rsvp')} title="RSVP">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </button>
                    {/* Fullscreen Button */}
                    <button
                        type="button"
                        className="utary-floating__btn"
                        onClick={toggleFullscreen}
                        style={isFullscreen ? { backgroundColor: 'var(--uty-primary, #8a6e53)', color: '#fff', boxShadow: '0 0 10px var(--uty-primary)' } : {}}
                        title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                    >
                        <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                    </button>
                    {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="utary-floating__btn"
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: 'var(--uty-primary, #8a6e53)', color: '#fff', boxShadow: '0 0 10px var(--uty-primary)' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        {autoScrollEnabled ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )}
                    </button>
                    )}
                    <button type="button" className="utary-floating__btn" onClick={onToggleMusic} title="Music">
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
                    <button 
                        type="button" 
                        className="utary-floating__btn" 
                        onClick={handleOpenMenu} 
                        title="Menu"
                        style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <span className="utary-nav-toggle__line line-1" />
                        <span className="utary-nav-toggle__line line-2" />
                        <span className="utary-nav-toggle__line line-3" />
                    </button>
                </div>
            </div>

            {/* QR Code Modal Overlay */}
            {enableQr && showQr && activeGuest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={() => setShowQr(false)}>
                    <div 
                        className="rounded-2xl p-6 max-w-xs w-full mx-4 text-center shadow-2xl border animate-[scaleIn_0.3s_ease-out]" 
                        style={{ 
                            backgroundColor: 'var(--utary-bg-dark)', 
                            borderColor: 'var(--utary-border-gold)',
                            color: 'var(--utary-text-white)',
                            fontFamily: 'var(--utary-font-body)'
                        }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--utary-gold)', fontFamily: 'var(--utary-font-display)' }}>QR Code Check-in</h3>
                        <p className="text-xs mb-4" style={{ color: 'var(--utary-text-muted)' }}>{activeGuest.name}</p>
                        <div className="p-4 rounded-xl inline-block mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--utary-border-gold)' }}>
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=ccba82&data=${encodeURIComponent(window.location.origin+'/u/'+invitation.slug+'/checkin?to='+activeGuest.slug)}`} 
                                alt="QR Code" 
                                className="w-48 h-48 mx-auto" 
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={() => setShowQr(false)} 
                            className="w-full py-2.5 rounded-full text-sm font-semibold transition-all hover:brightness-110" 
                            style={{ 
                                backgroundColor: 'var(--utary-gold-btn)', 
                                color: 'var(--utary-btn-text)', 
                                fontFamily: 'var(--utary-font-serif)' 
                            }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════ */
export default function Utary({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, guest, wishes }) {
    const { t } = useTranslation(invitation?.language || 'id');
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSection, setActiveSection] = useState('opening');
    const audioRef = useRef(null);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    const guestName = guest?.name || new URLSearchParams(window.location.search).get('to');
    
    const showPhotos = invitation?.show_photos !== false && invitation?.show_photos !== 'false' && invitation?.show_photos !== 0 && invitation?.show_photos !== '0';
    const showAnimations = invitation?.show_animations !== false && invitation?.show_animations !== 'false' && invitation?.show_animations !== 0 && invitation?.show_animations !== '0';
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;
    
    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v';

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);

    const validKeys = [
        'hero', 'opening', 'couple', 'bride_groom', 'love_story', 
        'event', 'gallery', 'rsvp', 'wishes', 'bank', 'closing', 'footer'
    ];

    const sortedSections = (sections || [])
        .filter(s => s.is_visible && validKeys.includes(s.section_key))
        .filter(s => {
            if (s.section_key === 'rsvp' && !enableRsvp) return false;
            if (s.section_key === 'wishes') {
                if (!enableWishes) return false;
                if (enableRsvp) return false; // unified into rsvp
            }
            if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return false;
            if (s.section_key === 'gallery' && !(galleries?.length > 0)) return false;
            if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return false;
            return true;
        })
        .sort((a, b) => a.sort_order - b.sort_order);



    const handleOpen = () => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        document.body.style.overflow = 'auto';
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    // Auto scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = sortedSections.length;
                    if (prev >= count - 1) {
                        return 0; // loop back to first slide
                    }
                    return prev + 1;
                });
            }, 4000);
        } else {
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
    }, [isOpened, autoScrollEnabled, isSlideMode, sortedSections.length]);

    // Scrollspy to automatically update active section on window scroll
    useEffect(() => {
        if (isSlideMode || !isOpened) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const section of sortedSections) {
                const el = document.getElementById(section.section_key);
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
    }, [isOpened, isSlideMode, sortedSections]);

    // Sync active slide index with activeSection state in slide mode
    useEffect(() => {
        if (isSlideMode && sortedSections[activeSlideIdx]) {
            setActiveSection(sortedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, sortedSections]);

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



    // ── Slide Navigation Functions ──
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, sortedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    // ── Mapping Menu Item IDs to Section Indices ──
    const findSectionIndex = (id) => {
        const idToKeys = {
            'hero': ['hero', 'opening'],
            'couple': ['couple', 'bride_groom'],
            'love_story': ['love_story'],
            'event': ['event', 'livestream'],
            'gallery': ['gallery'],
            'rsvp': ['rsvp'],
            'bank': ['bank']
        };
        const targetKeys = idToKeys[id] || [id];
        const idx = sortedSections.findIndex(s => targetKeys.includes(s.section_key));
        return idx !== -1 ? idx : 0;
    };

    // ── Mapping Active Index to Menu Item ID ──
    const getActiveMenuId = () => {
        if (isSlideMode) {
            const activeSec = sortedSections[activeSlideIdx];
            if (!activeSec) return 'hero';
            const key = activeSec.section_key;
            if (key === 'hero' || key === 'opening') return 'hero';
            if (key === 'couple' || key === 'bride_groom') return 'couple';
            if (key === 'love_story') return 'love_story';
            if (key === 'event' || key === 'livestream') return 'event';
            if (key === 'gallery') return 'gallery';
            if (key === 'rsvp') return 'rsvp';
            if (key === 'bank') return 'bank';
            if (key === 'closing' || key === 'footer') return 'rsvp';
            return 'hero';
        } else {
            const key = activeSection;
            if (key === 'hero' || key === 'opening') return 'hero';
            if (key === 'couple' || key === 'bride_groom') return 'couple';
            if (key === 'love_story') return 'love_story';
            if (key === 'event' || key === 'livestream') return 'event';
            if (key === 'gallery') return 'gallery';
            if (key === 'rsvp') return 'rsvp';
            if (key === 'bank') return 'bank';
            if (key === 'closing' || key === 'footer') return 'rsvp';
            return 'hero';
        }
    };

    const scrollToSection = (id) => {
        setAutoScrollEnabled(false);
        if (isSlideMode) {
            const idx = findSectionIndex(id);
            setActiveSlideIdx(idx);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // ── Mouse & Touch Gesture Handlers for Swipe ──
    const touchStart = useRef({ x: 0, y: 0, time: 0 });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        
        let atTop = false;
        let atBottom = false;
        
        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.utary-slide-container');
            if (scrollable) {
                atTop = scrollable.scrollTop <= 5;
                atBottom = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5;
            }
        }
        
        touchStart.current = { x: clientX, y: clientY, time: Date.now(), atTop, atBottom };
    };

    const handlePointerUp = (clientX, clientY, target) => {
        if (!isSlideMode || !isDragging.current) return;
        isDragging.current = false;
        
        const diffX = clientX - touchStart.current.x;
        const diffY = clientY - touchStart.current.y;
        const timeDiff = Date.now() - touchStart.current.time;
        const threshold = 50;

        // If it's a very fast swipe, lower the threshold
        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);

        if (layoutMode === 'slide-h') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        } else if (layoutMode === 'slide-v') {
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                // Check if target is a scrollable element that hasn't reached its boundary
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.utary-slide-container') : null;
                if (scrollable) {
                    // Use the state from BEFORE the swipe started
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;
                    
                    if (diffY < 0 && isAtBottom) {
                        nextSlide();
                    } else if (diffY > 0 && isAtTop) {
                        prevSlide();
                    }
                } else {
                    if (diffY < 0) nextSlide();
                    else prevSlide();
                }
            }
        }
    };

    // Touch Events
    const handleTouchStart = (e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    const handleTouchEnd = (e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);

    // Mouse Events for PC
    const handleMouseDown = (e) => handlePointerDown(e.clientX, e.clientY, e.target);
    const handleMouseUp = (e) => handlePointerUp(e.clientX, e.clientY, e.target);
    const handleMouseLeave = () => { isDragging.current = false; };

    // Wheel Event for PC (Debounced)
    const handleWheel = (e) => {
        if (!isSlideMode) return;
        
        // Ensure we aren't rapidly switching slides
        if (scrollTimeout.current) return;

        const target = e.target.closest('.utary-slide-container');
        
        // Let the internal scroll handle it first if there is content to scroll
        if (target && target.scrollHeight > target.clientHeight) {
            // Add a small buffer of 2px to account for fractional scrolling values
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;
            
            if (e.deltaY > 0 && !isAtBottom) return; // Still scrolling down internally
            if (e.deltaY < 0 && !isAtTop) return; // Still scrolling up internally
        }

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800); // 800ms cooldown between slide switches via wheel

        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    };

    // ── Dynamic Section Mapping ──
    const renderSection = (section, index, total) => {
        const key = section.section_key;
        
        const componentMap = {
            'hero': <HeroSection key={key} invitation={invitation} brideGrooms={brideGrooms} layoutMode={layoutMode} id={key} />,
            'opening': <HeroSection key={key} invitation={invitation} brideGrooms={brideGrooms} layoutMode={layoutMode} id={key} />,
            'couple': <CoupleSection key={key} invitation={invitation} brideGrooms={brideGrooms} id={key} />,
            'bride_groom': <CoupleSection key={key} invitation={invitation} brideGrooms={brideGrooms} id={key} />,
            'love_story': <TimelineSection key={key} loveStories={loveStories} invitation={invitation} id={key} />,
            'event': (
                <React.Fragment key={key}>
                    <EventSection invitation={invitation} events={events} id={key} />
                    <LiveStreamingSection invitation={invitation} events={events} />
                    <VideoSection invitation={invitation} />
                </React.Fragment>
            ),
            'gallery': <GallerySection key={key} invitation={invitation} galleries={galleries} brideGrooms={brideGrooms} id={key} />,
            'rsvp': <UnifiedFormSection key="rsvp" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} id="rsvp" />,
            'wishes': enableRsvp ? null : <UnifiedFormSection key="wishes" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={enableWishes} id="wishes" />,
            'bank': <GiftSection key={key} bankAccounts={bankAccounts} id={key} />,
            'closing': <FooterSection key={key} invitation={invitation} brideGrooms={brideGrooms} id={key} />,
            'footer': <FooterSection key={key} invitation={invitation} brideGrooms={brideGrooms} id={key} />,
        };

        const component = componentMap[key];
        if (!component) return null;

        if (isSlideMode) {
            let slideClass = 'utary-slide-container';
            if (index === activeSlideIdx) {
                slideClass += ' is-active';
            } else if (index > activeSlideIdx) {
                slideClass += ' is-next';
            } else {
                slideClass += ' is-prev';
            }

            return (
                <div key={key} className={slideClass}>
                    {component}
                    {key === 'couple' && <TurutMengundangSection invitation={invitation} />}
                </div>
            );
        }

        return (
            <React.Fragment key={key}>
                {component}
                {key === 'couple' && <TurutMengundangSection invitation={invitation} />}
                {index < total - 1 && <DividerSection />}
            </React.Fragment>
        );
    };

    return (
        <ErrorBoundary>
            <div className={`utary-page ${!showAnimations ? 'utary-no-animations' : ''}`}>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>

            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect 
                    type={invitation.particle_type} 
                    count={invitation.particle_count || 30} 
                    speed={invitation.particle_speed || 'normal'} 
                />
            )}

            {/* Background Music */}
            <audio ref={audioRef} loop preload="auto" playsInline>
                <source src={invitation?.music_url || THEME_DEFAULTS.music_url} type="audio/mpeg" />
            </audio>

            {/* Cover */}
            <CoverSection onOpen={handleOpen} guestName={guestName} invitation={invitation} brideGrooms={brideGrooms} isOpened={isOpened} />

            {/* Main Split Layout */}
            <div className="utary-main">
                {/* Left Fixed Panel */}
                <div className="utary-main__left">
                    {globalShowPhotos && <img src={galleries?.[0]?.image_url || couplePhoto} alt={invitation?.cover_title} className="utary-main__left-img" />}
                    <div className="utary-main__left-overlay">
                        <div className="utary-main__left-pretitle">
                            {(!invitation?.opening_title || invitation.opening_title.toUpperCase() === 'THE WEDDING OF' || invitation.opening_title.toUpperCase() === 'PERNIKAHAN') 
                                ? t('invitation.wedding_of') 
                                : invitation.opening_title}
                        </div>
                        <div className="utary-main__left-title">
                            {(brideGrooms?.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female')?.nickname && 
                              brideGrooms?.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male')?.nickname) 
                                ? `${brideGrooms.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female').nickname} & ${brideGrooms.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male').nickname}`
                                : (invitation?.cover_title || THEME_DEFAULTS.cover_title).toUpperCase()}
                        </div>
                        <div className="utary-main__left-quote">
                            {invitation?.opening_text || THEME_DEFAULTS.opening_text}
                        </div>
                    </div>
                </div>

                {/* Right Scrollable Panel */}
                <div 
                    className={`utary-main__right ${isSlideMode ? 'utary-main__right--slide' : ''} ${layoutMode === 'slide-h' ? 'utary-main__right--slide-h' : ''} ${layoutMode === 'slide-v' ? 'utary-main__right--slide-v' : ''}`}
                    onTouchStart={isSlideMode ? handleTouchStart : undefined}
                    onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                    onMouseDown={isSlideMode ? handleMouseDown : undefined}
                    onMouseUp={isSlideMode ? handleMouseUp : undefined}
                    onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                    onWheel={isSlideMode ? handleWheel : undefined}
                >
                    {sortedSections.map((section, index) => renderSection(section, index, sortedSections.length))}
                </div>
            </div>

            {/* Floating Contact Button */}
            {(brideGrooms?.[0]?.phone || brideGrooms?.[1]?.phone) && (
                <a 
                    href={`https://wa.me/${brideGrooms?.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male')?.phone || brideGrooms?.[0]?.phone}`} 
                    className={`utary-whatsapp-float ${invitation?.menu_position === 'bottom' ? 'utary-whatsapp-float--left' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="fab fa-whatsapp" />
                </a>
            )}

            {/* Navigation and Floating Controls */}
            <Navigation 
                invitation={invitation} 
                guest={guest} 
                isOpened={isOpened} 
                isPlaying={isPlaying} 
                onToggleMusic={toggleMusic} 
                scrollToSection={scrollToSection}
                activeMenuId={getActiveMenuId()}
                isSlideMode={isSlideMode}
                autoScrollEnabled={autoScrollEnabled}
                setAutoScrollEnabled={setAutoScrollEnabled}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
            />
            </div>
        </ErrorBoundary>
    );
}
