import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

/* ═══════════════════════════════════════
   ORNAMENT ASSETS URLS
   ═══════════════════════════════════════ */
const ORNAMENTS = {
    coverFallback: '/themes/spesial-03/Mini-AWAL-e1680582212176-1.jpg',
    bgOpening: '/themes/spesial-03/BL-01-1.webp',
    bgQuote: '/themes/spesial-03/BL-02-scaled-1-1.jpg',
    bgMempelai: '/themes/spesial-03/Picture3-1-1-1.webp',
    priaFallback: '/themes/spesial-03/PRIA-e1680581993971-1-1.jpg',
    wanitaFallback: '/themes/spesial-03/WANITA-1-1.jpg',
    dana: '/themes/spesial-03/1200px-Logo_dana_blue.svg-1-2-1-1.png',
    bca: '/themes/spesial-03/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1-1.png',
    chip: '/themes/spesial-03/chip-atm-1-2-1-1-1-3.png',
    heart: '/themes/spesial-03/heart.svg',
    bb1: '/themes/spesial-03/bb-1.webp',
};

/* ═══════════════════════════════════════
   STANDARD HELPERS
   ═══════════════════════════════════════ */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

function parseEventDate(dateString, locale) {
    if (!dateString) return { dayNum: '', dayName: '', monthName: '', year: '' };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { dayNum: '', dayName: '', monthName: '', year: '' };
    
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long' });
    const monthName = d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { month: 'long' });
    const year = d.getFullYear();
    
    return { dayNum, dayName, monthName, year };
}

function getStorageUrl(url, fallback) {
    if (!url) return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: 0, top: 0, left: 0 });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
};

function formatDate(dateString, locale) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const calculate = () => {
            const difference = +new Date(targetDate) - +new Date();
            let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                left = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            setTimeLeft(left);
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(targetDate);
    
    return (
        <div className="sp03-countdown-wrapper select-none">
            <div className="sp03-countdown">
                <div className="sp03-countdown-item">
                    <span className="sp03-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="sp03-countdown-label">{t('invitation.days')}</span>
                </div>
                <span className="sp03-countdown-colon">:</span>
                <div className="sp03-countdown-item">
                    <span className="sp03-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="sp03-countdown-label">{t('invitation.hours')}</span>
                </div>
                <span className="sp03-countdown-colon">:</span>
                <div className="sp03-countdown-item">
                    <span className="sp03-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="sp03-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <span className="sp03-countdown-colon">:</span>
                <div className="sp03-countdown-item">
                    <span className="sp03-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="sp03-countdown-label">{t('invitation.seconds')}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="sp03-theme-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema.</h2>
                <p>Penyebab umum: Data mempelai atau tanggal acara belum diset lengkap.</p>
                <pre>{this.state.error?.toString()}</pre>
                <button onClick={() => window.location.reload()}>Muat Ulang Halaman</button>
            </div>
        );
        return this.props.children;
    }
}

// Global configurations updated by React
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL (LOCAL)
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            setVisible(e.isIntersecting);
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'sp03-ani-fadeUp';
    if (variant === 'zoom') baseClass = 'sp03-ani-scaleIn';
    else if (variant === 'left') baseClass = 'sp03-ani-fadeLeft';
    else if (variant === 'right') baseClass = 'sp03-ani-fadeRight';
    else if (variant === 'down') baseClass = 'sp03-ani-fadeDown';

    return (
        <div
            ref={ref}
            className={`${className} ${visible ? baseClass : 'sp03-ani-hidden'}`}
            style={delay ? { animationDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   FLOWER DIVIDER
   ═══════════════════════════════════════ */
function FlowerSwirl({ title }) {
    return (
        <div className="mb-6 mt-2 flex flex-col items-center select-none">
            {title && (
                <h2 className="text-2xl sm:text-3xl text-[var(--sp03-accent)] sp03-font-heading-style leading-none mb-3">
                    {title}
                </h2>
            )}
            <div className="sp03-divider">
                <div className="sp03-divider-line" />
                <div className="sp03-divider-dot" />
                <div className="sp03-divider-line" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (SCREENSHOT 1)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showPhotos }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Nama Tamu';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Habib & Adiba');

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className={`sp03-cover ${isOpened ? 'sp03-is-opened' : ''}`}>
            {/* Background Slideshow/Image - Fullscreen */}
            {showPhotos && coverImages.length > 0 ? (
                <PremiumSlideshow
                    images={coverImages}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                />
            ) : (
                <div className="absolute inset-0 z-0">
                    <img src={ORNAMENTS.coverFallback} alt="Cover Background Fallback" className="w-full h-full object-cover" />
                </div>
            )}
            
            {/* Dark bottom gradient overlay */}
            <div className="sp03-cover__overlay absolute inset-0 z-1" />

            <div className="sp03-cover__content relative z-10 flex flex-col justify-center items-center h-full py-16 px-6">
                <p className="text-[12px] sm:text-sm uppercase tracking-[0.35em] font-semibold text-white/90 mb-3 select-none">
                    THE WEDDING OF
                </p>

                <h1 className="text-4xl sm:text-5xl text-white sp03-font-heading-style mb-8 leading-snug tracking-wider">
                    {coupleName}
                </h1>
                
                <p className="text-lg text-white/80 italic sp03-font-script-style mb-2 select-none">
                    Dear,
                </p>
                <p className="text-[18px] font-semibold text-white mb-8 tracking-wide">
                    {guestName}
                </p>

                <button type="button" onClick={onOpen} className="sp03-btn-buka">
                    Buka Undangan
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING & QUOTE COMBINED (SCREENSHOT 2 & 3)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, showPhotos, brideGrooms, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const coupleNickname = (groom.nickname && bride.nickname) ? `${groom.nickname} & ${bride.nickname}` : 'Habib & Adiba';

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    const displayDate = useMemo(() => {
        if (invitation?.countdown_target_date) {
            return formatDate(invitation.countdown_target_date, locale);
        }
        return 'Minggu, 16 Agustus 2026';
    }, [invitation?.countdown_target_date, locale]);

    return (
        <div className="w-full">
            {/* ═══════════════════════════════════════
               1. OPENING PAGE (SCREENSHOT 2)
               ═══════════════════════════════════════ */}
            <div className="sp03-opening-page">
                {/* Building sketch background watermark is handled in CSS background */}

                {/* Flying Birds vectors upper-left */}
                <div className="absolute top-10 left-10 z-10 select-none opacity-40">
                    <svg viewBox="0 0 100 50" className="w-16 h-8 text-[var(--sp03-primary)]" fill="currentColor">
                        <path d="M 5,25 Q 25,5 45,25 Q 65,5 85,25 Q 65,15 45,25 Q 25,15 5,25 Z" />
                        <path d="M 30,40 Q 45,25 60,40 Q 75,25 90,40 Q 75,32 60,40 Q 45,32 30,40 Z" opacity="0.7"/>
                    </svg>
                </div>

                {/* Arch-shaped prewedding photo */}
                <Reveal variant="zoom" delay={100} className="relative z-10 w-full max-w-[280px] mb-8">
                    <div className="sp03-opening-frame w-full aspect-[3/4] relative">
                        {showPhotos && openingImages.length > 0 ? (
                            <PremiumSlideshow
                                images={openingImages}
                                positionX={invitation?.opening_position_x}
                                positionY={invitation?.opening_position_y}
                                zoom={invitation?.opening_zoom}
                            />
                        ) : (
                            <img src={ORNAMENTS.coverFallback} alt="Opening Fallback" className="w-full h-full object-cover" />
                        )}
                    </div>
                </Reveal>

                <Reveal delay={200} className="relative z-10 text-center">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[var(--sp03-text-light)] mb-2">
                        THE WEDDING OF
                    </p>
                    <h2 className="text-3xl sm:text-4xl text-[var(--sp03-accent)] sp03-font-heading-style leading-none mb-3 tracking-wide">
                        {coupleNickname}
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--sp03-text)] italic font-semibold mb-6">
                        {displayDate}
                    </p>

                    <button type="button" className="sp03-btn-save-date">
                        Save The Date
                    </button>
                </Reveal>
            </div>

            {/* ═══════════════════════════════════════
               2. QURANIC QUOTE PAGE (SCREENSHOT 3)
               ═══════════════════════════════════════ */}
            <div className="sp03-quote-page">
                {/* Building sketch background watermark is handled in CSS background */}
                <div className="sp03-quote-bg" />

                <Reveal variant="zoom" className="relative z-10 flex flex-col items-center max-w-md">
                    {/* White rose outline image */}
                    <img src={ORNAMENTS.bb1} alt="Rose Outline" className="w-32 h-auto object-contain opacity-70 mb-4 select-none" />

                    {/* Monogram white text */}
                    <h3 className="text-5xl sm:text-6xl text-white sp03-font-heading-style font-medium tracking-widest mb-6 select-none">
                        {groom.nickname?.charAt(0) || 'H'} &amp; {bride.nickname?.charAt(0) || 'A'}
                    </h3>

                    {/* Quote text */}
                    <p className="text-[13px] sm:text-[14px] leading-relaxed opacity-95 italic px-2 mb-4 font-serif">
                        “Dan diantara tanda-tanda kekuasaanNya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikanNya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.”
                    </p>

                    {/* Source */}
                    <p className="text-[13px] font-bold text-[#D7AC64] mt-3">
                        (Qs. Ar. Rum (30) : 21)
                    </p>
                </Reveal>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION (SCREENSHOT 4)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, locale, showPhotos }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const isEn = locale === 'en';
        const raw = String(childOrder).trim().toLowerCase();
        let matchedKey = null;
        
        if (raw.includes('tunggal') || raw.includes('satu-satunya') || raw.includes('only')) matchedKey = 'tunggal';
        else if (raw.includes('bungsu') || raw.includes('terakhir') || raw.includes('youngest')) matchedKey = 'bungsu';
        else if (raw.includes('2') || raw.includes('kedua') || raw.includes('second')) matchedKey = '2';
        else if (raw.includes('1') || raw.includes('pertama') || raw.includes('kesatu') || raw.includes('first')) matchedKey = '1';
        else return childOrder;
        
        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' },
            '2': { id: 'Kedua', en: 'Second' },
            'bungsu': { id: 'Bungsu', en: 'Youngest' },
            'tunggal': { id: 'Tunggal', en: 'Only' }
        };
        
        const match = ordinalMap[matchedKey];
        const isWanita = ['wanita', 'female'].includes(String(gender).toLowerCase());
        
        if (isEn) {
            const noun = isWanita ? 'Daughter' : 'Son';
            if (match.en.toLowerCase() === 'only') return `ONLY ${noun.toUpperCase()} OF`;
            return `${match.en.toUpperCase()} ${noun.toUpperCase()} OF`;
        } else {
            const noun = isWanita ? 'Putri' : 'Putra';
            if (match.id.toLowerCase() === 'tunggal') return `${noun.toUpperCase()} TUNGGAL DARI`;
            return `${noun.toUpperCase()} ${match.id.toUpperCase()} DARI`;
        }
    };

    return (
        <div className="sp03-mempelai-section relative w-full py-16 px-6 text-center">
            {/* Misty mountain background watermark handled by CSS background */}

            <div className="relative z-10 max-w-lg mx-auto">
                <Reveal>
                    <h2 className="text-3xl sm:text-4xl text-[#D7AC64] sp03-font-heading-style tracking-wider mb-2 select-none">
                        Our Spesial Day
                    </h2>
                    <p className="text-xs sm:text-[13px] text-[var(--sp03-text)] leading-relaxed max-w-md mx-auto mb-10 select-none">
                        Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk menghadiri acara pernikahan kami:
                    </p>
                </Reveal>

                <div className="space-y-12">
                    {/* Groom Profile */}
                    <Reveal variant="left" className="w-full flex justify-center">
                        <div className="flex flex-col items-center">
                            {showPhotos && (
                                <div className="sp03-profile-photo-card mb-5">
                                    <img 
                                        src={getStorageUrl(groom.photo, ORNAMENTS.priaFallback)} 
                                        alt={groom.full_name} 
                                        className="class-foto-profil" 
                                    />
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-[var(--sp03-primary)] sp03-font-heading-style tracking-wide">
                                {groom.full_name || 'Habib Yulianto'}
                            </h3>
                            <p className="text-xs sm:text-[13px] text-[var(--sp03-text)] italic font-semibold mt-1">
                                {translateChildOrder(groom.child_order, 'pria')} <span className="not-italic font-bold">{groom.father_name && groom.mother_name ? `Bapak ${groom.father_name} & Ibu ${groom.mother_name}` : 'Bapak Anas & Ibu Kholifah'}</span>
                            </p>
                            {groom.instagram && (
                                <a 
                                    href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sp03-btn-ig-circle mt-4"
                                >
                                    <i className="fab fa-instagram text-white text-sm" />
                                </a>
                            )}
                        </div>
                    </Reveal>

                    {/* Ampersand separator */}
                    <Reveal variant="zoom" className="w-full flex justify-center py-2 select-none">
                        <span className="text-5xl text-[#4A5A74] sp03-font-heading-style select-none">&amp;</span>
                    </Reveal>

                    {/* Bride Profile */}
                    <Reveal variant="right" className="w-full flex justify-center">
                        <div className="flex flex-col items-center">
                            {showPhotos && (
                                <div className="sp03-profile-photo-card mb-5">
                                    <img 
                                        src={getStorageUrl(bride.photo, ORNAMENTS.wanitaFallback)} 
                                        alt={bride.full_name} 
                                        className="class-foto-profil" 
                                    />
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-[var(--sp03-primary)] sp03-font-heading-style tracking-wide">
                                {bride.full_name || 'Adiba Putri Syakila'}
                            </h3>
                            <p className="text-xs sm:text-[13px] text-[var(--sp03-text)] italic font-semibold mt-1">
                                {translateChildOrder(bride.child_order, 'wanita')} <span className="not-italic font-bold">{bride.father_name && bride.mother_name ? `Bapak ${bride.father_name} & Ibu ${bride.mother_name}` : 'Bapak M. Dawam & Ibu Dewi Sudarwati'}</span>
                            </p>
                            {bride.instagram && (
                                <a 
                                    href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="sp03-btn-ig-circle mt-4"
                                >
                                    <i className="fab fa-instagram text-white text-sm" />
                                </a>
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EVENTS & MAPS SECTION (SCREENSHOT 5)
   ═══════════════════════════════════════ */
function EventSection({ events, locale, invitation, sections }) {
    const { t } = useTranslation();
    const list = safeArr(events);

    const showCountdown = parseBool(invitation?.show_countdown);
    const showCountdownInEvent = useMemo(() => {
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (!primaryEvent?.event_date || !showCountdown) return false;
        
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    }, [sections, events, showCountdown]);

    return (
        <div className="sp03-event-section w-full bg-[#2E3F54] py-16 px-6 text-center">
            <div className="relative z-10 max-w-lg mx-auto">
                <Reveal>
                    <FlowerSwirl title={t('nav.acara')} />
                </Reveal>

                {showCountdownInEvent && invitation?.countdown_target_date && (
                    <Reveal variant="zoom">
                        <CountdownTimer targetDate={invitation.countdown_target_date} />
                    </Reveal>
                )}

                {list.map((evt, idx) => {
                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date, locale);
                    const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Acara');
                    const isEven = idx % 2 === 0;

                    return (
                        <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="sp03-custom-event-card relative overflow-hidden bg-white text-left p-8 rounded-[30px] shadow-lg mb-8 max-w-sm mx-auto">
                            {/* Misty mountain background inside the card */}
                            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                                <img src={ORNAMENTS.bgMempelai} alt="" className="w-full h-full object-cover" />
                            </div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* Event Title */}
                                <h4 className="text-2xl font-bold text-[#D7AC64] sp03-font-heading-style tracking-wide mb-4">
                                    {eventDisplayName}
                                </h4>

                                {/* Day */}
                                <p className="text-[10px] font-bold tracking-[0.2em] text-[#40506b]/70 uppercase mb-1 select-none">
                                    {dayName || 'MINGGU'}
                                </p>

                                {/* Date Big Gold Number */}
                                <p className="text-6xl font-bold text-[#D7AC64] sp03-font-heading-style leading-none mb-1 select-none text-shadow-gold">
                                    {dayNum || '16'}
                                </p>

                                {/* Month Year */}
                                <p className="text-xs font-bold text-[#40506b]/80 uppercase tracking-widest mb-4 select-none">
                                    {monthName || 'AGUSTUS'} {year || '2026'}
                                </p>

                                {/* Time */}
                                <p className="text-[12px] font-semibold text-[#40506b] mb-5 select-none">
                                    Pukul : {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : ' - Selesai'} {evt.timezone || 'WIB'}
                                </p>

                                {/* Location PIN icon separator */}
                                <div className="w-full flex items-center justify-center gap-4 my-2 select-none">
                                    <div className="h-px bg-gray-200 flex-grow" />
                                    <div className="text-[#2E3F54] text-md">
                                        <i className="fas fa-map-marker-alt" />
                                    </div>
                                    <div className="h-px bg-gray-200 flex-grow" />
                                </div>

                                {/* Venue Details */}
                                <div className="text-xs leading-relaxed text-[#40506b] font-semibold mt-4 mb-6">
                                    <p className="font-bold text-sm mb-1">{evt.venue_name || 'Kediaman Mempelai Wanita'}</p>
                                    <p className="opacity-80 font-medium">{evt.venue_address || 'Ds Pagu, Wates, Kediri, Jawa Timur'}</p>
                                </div>

                                {/* Lihat Lokasi Button */}
                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sp03-btn-lihat-lokasi"
                                    >
                                        <i className="fas fa-map-marker-alt text-[9px]" /> Lihat Lokasi
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   TIMELINE MILESTONES
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    if (list.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} />
            </Reveal>

            <Reveal variant="zoom" className="sp03-timeline mt-8">
                {list.map((story, i) => (
                    <div key={story.id || i} className="sp03-timeline-item">
                        <div className="sp03-story-bubble">
                            <div className="sp03-timeline-date">
                                {story.story_date ? new Date(story.story_date).getFullYear() : story.year || ''}
                            </div>
                            <h4 className="sp03-timeline-title sp03-font-heading-style font-bold tracking-wide">
                                {story.title}
                            </h4>
                            <p className="sp03-timeline-desc text-[12px] leading-relaxed opacity-90 text-[var(--sp03-text)]">
                                {story.description}
                            </p>
                        </div>
                    </div>
                ))}
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   GALLERY GRID SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={t('nav.galeri')} />
            </Reveal>

            <div className="grid grid-cols-2 gap-3 mt-8">
                {list.map((item, i) => {
                    const imgUrl = getStorageUrl(item.image_path || item.image_url);
                    const isLarge = i === 0 || i === 3;
                    return (
                        <Reveal 
                            key={item.id || i} 
                            variant="zoom" 
                            delay={i * 100}
                            className={`rounded-2xl overflow-hidden shadow-xs border-2 border-white aspect-[3/4] relative ${isLarge ? 'col-span-2 aspect-[4/3]' : ''}`}
                        >
                            <img src={imgUrl} alt={item.caption || 'Galeri'} className="sp03-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   LIVESTREAM SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, locale }) {
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    
    const streamsList = [];
    if (primaryEvent?.streaming_url) {
        streamsList.push({ platform: primaryEvent.streaming_platform || 'Live', url: primaryEvent.streaming_url });
    }
    if (Array.isArray(primaryEvent?.streamings)) {
        primaryEvent.streamings.forEach(s => {
            if (s.url && !streamsList.some(item => item.url === s.url)) {
                streamsList.push({ platform: s.platform || 'Live', url: s.url });
            }
        });
    }

    if (streamsList.length === 0) return null;

    const isEn = locale === 'en';

    return (
        <div className="max-w-lg mx-auto py-16 px-6 text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Live Streaming' : 'Siaran Langsung'} />
            </Reveal>
            
            <Reveal variant="zoom" className="sp03-card mt-8">
                <p className="text-xs sm:text-sm opacity-80 mb-6 text-[var(--sp03-text)]">
                    {isEn ? 'Join our wedding virtually from your device:' : 'Saksikan momen sakral kami secara virtual melalui tautan berikut:'}
                </p>
                <div className="space-y-3">
                    {streamsList.map((stream, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => window.open(stream.url, '_blank')} 
                            className="sp03-btn-primary w-full text-xs font-semibold py-3"
                        >
                            <i className="fas fa-video text-xs" /> WATCH ON {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   BANKING GIFT SECTION
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, copiedIdx, handleCopy }) {
    const { t } = useTranslation();
    const list = safeArr(bankAccounts);

    if (list.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={t('nav.hadiah')} />
            </Reveal>

            <div className="space-y-6 mt-8">
                {list.map((account, i) => {
                    const isBca = String(account.bank_name).toLowerCase().includes('bca');
                    const isDana = String(account.bank_name).toLowerCase().includes('dana');
                    
                    return (
                        <Reveal key={account.id || i} variant="zoom" delay={i * 150} className="sp03-bank-card relative overflow-hidden">
                            <div className="sp03-bank-card__header flex items-center justify-between z-10 relative">
                                {isBca && <img src={ORNAMENTS.bca} alt="BCA" className="sp03-bank-card__logo h-6 object-contain" />}
                                {isDana && <img src={ORNAMENTS.dana} alt="DANA" className="sp03-bank-card__logo h-5 object-contain" />}
                                {!isBca && !isDana && (
                                    <span className="font-bold text-lg text-white select-none">
                                        {account.bank_name}
                                    </span>
                                )}
                                <img src={ORNAMENTS.chip} alt="Chip" className="sp03-bank-card__chip w-10 object-contain select-none" />
                            </div>
                            <div className="sp03-bank-card__body my-4 z-10 relative text-left">
                                <div className="sp03-bank-card__number text-xl font-bold tracking-widest text-white">{account.account_number}</div>
                                <div className="sp03-bank-card__holder text-[11px] font-medium tracking-wider text-white/80 uppercase mt-1">{account.account_name}</div>
                            </div>
                            <div className="sp03-bank-card__footer z-10 relative flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => handleCopy(account.account_number, i)} 
                                    className="sp03-bank-card__copy-btn"
                                >
                                    <i className={copiedIdx === i ? "fas fa-check" : "far fa-copy"} />
                                    <span>{copiedIdx === i ? t('invitation.copied') || 'SALIN BERHASIL' : t('invitation.copy') || 'SALIN NOMOR'}</span>
                                </button>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES UNIFIED FORM SECTION
   ═══════════════════════════════════════ */
function WishesRsvpSection({ invitation, guest, wishes, enableRsvp, enableWishes }) {
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';
    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const [sharedName, setSharedName] = useState(guestName || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const rsvpForm = useForm({
        sender_name: guestName || '',
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: activeGuest.id || null,
    });

    const wishForm = useForm({
        sender_name: guestName || '',
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
                wishForm.post(`/u/${invitation.slug}/wish`, {
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
            rsvpForm.post(`/u/${invitation.slug}/rsvp`, {
                preserveScroll: true,
                onSuccess: doWish,
            });
        } else {
            doWish();
        }
    };

    const isSubmitting = rsvpForm.processing || wishForm.processing;
    const wishList = safeArr(wishes);
    const recentWishes = wishList.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? `${t('nav.rsvp')} & ${t('invitation.wishes_title')}`
        : enableRsvp
            ? t('invitation.rsvp_title') || 'RSVP'
            : t('invitation.wishes_title') || 'Ucapan';

    if (!enableRsvp && !enableWishes) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={sectionTitle} />
                <p className="text-xs sm:text-sm opacity-80 mb-4 text-center text-[var(--sp03-text)]">
                    {isEn
                        ? 'Please fill out the form below to send your confirmation and wishes.'
                        : 'Mohon isi formulir berikut untuk mengirimkan konfirmasi dan ucapan doa Anda.'}
                </p>
            </Reveal>

            <Reveal variant="zoom" className="sp03-card mt-8">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Nama Lengkap */}
                    <div>
                        <label className="text-[10px] font-bold text-[var(--sp03-text-light)] uppercase tracking-wider block mb-1.5">
                            {isEn ? 'Your Name' : 'Nama Lengkap'}
                        </label>
                        <input
                            type="text"
                            placeholder={isEn ? 'Your Name' : 'Nama Lengkap'}
                            readOnly={!!activeGuest.name && activeGuest.name !== 'Tamu Undangan'}
                            value={sharedName}
                            onChange={(e) => setSharedName(e.target.value)}
                            className="sp03-input"
                            required
                        />
                    </div>

                    {/* Konfirmasi Kehadiran */}
                    {enableRsvp && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp03-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Attendance Status' : 'Status Kehadiran'}
                            </label>
                            <select
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                                className="sp03-input select-none"
                            >
                                <option value="hadir">{t('invitation.attending') || 'Hadir'}</option>
                                <option value="tidak_hadir">{t('invitation.not_attending') || 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{t('invitation.unsure') || 'Belum Pasti'}</option>
                            </select>
                        </div>
                    )}

                    {/* Jumlah Orang */}
                    {enableRsvp && attendance === 'hadir' && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp03-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Number of Guests' : 'Jumlah Orang'}
                            </label>
                            <select
                                value={numGuests}
                                onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)}
                                className="sp03-input"
                            >
                                {[1, 2, 3, 4, 5].map(v => (
                                    <option key={v} value={v}>{v} {isEn ? (v === 1 ? 'Person' : 'People') : 'Orang'}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Ucapan & Doa */}
                    {enableWishes && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp03-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Wishes & Prayers' : 'Pesan / Ucapan'}
                            </label>
                            <textarea
                                placeholder={t('invitation.wish_placeholder') || 'Tulis pesan doa dan ucapan manis Anda di sini...'}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="sp03-input"
                                rows={3}
                                required={!enableRsvp}
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="sp03-btn-primary w-full text-xs font-semibold py-3 mt-2 animate-pulse"
                    >
                        {isSubmitting ? 'KIRIM...' : (isEn ? 'SEND MESSAGE' : 'KIRIM KONFIRMASI & UCAPAN')}
                    </button>

                    {success && (
                        <p className="text-xs text-[var(--sp03-primary)] font-bold text-center mt-3">
                            ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                        </p>
                    )}
                </form>

                {/* Wishes list scrollable */}
                {enableWishes && recentWishes.length > 0 && (
                    <div className="sp03-wishes-box mt-6 pt-4 border-t border-[var(--sp03-secondary)]/15">
                        {recentWishes.map((w, idx) => (
                            <div key={w.id || idx} className="sp03-wish-item">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="sp03-wish-sender font-bold text-[var(--sp03-primary)] text-xs">{w.sender_name || w.name}</span>
                                    {w.attendance && (
                                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            w.attendance === 'hadir' 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                                        }`}>
                                            {w.attendance === 'hadir' ? (t('invitation.attending') || 'Hadir') : (t('invitation.not_attending') || 'Tidak Hadir')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[12px] leading-relaxed text-[var(--sp03-text)] opacity-90">{w.message}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const hasGroomParents = groom.father_name || groom.mother_name;
    const hasBrideParents = bride.father_name || bride.mother_name;

    const isEn = locale === 'en';

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className="max-w-lg mx-auto py-16 px-6 text-center flex flex-col items-center">
            <Reveal delay={100}>
                <FlowerSwirl title={invitation?.closing_title || t('invitation.closing_title') || 'Terima Kasih'} />
            </Reveal>

            <Reveal delay={300}>
                <p className="text-[13px] leading-relaxed whitespace-pre-line opacity-90 px-4 mt-2 mb-6 text-[var(--sp03-text)]">
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.'}
                </p>
            </Reveal>

            <Reveal delay={400} className="space-y-4 text-xs opacity-80 font-bold uppercase tracking-wider text-[var(--sp03-text-light)]">
                <p className="text-[11px] font-bold text-[var(--sp03-primary)] sp03-font-heading-style tracking-widest">
                    {isEn ? 'WE ARE COMMITTED UNDER LOVE' : 'KAMI YANG BERBAHAGIA'}
                </p>
                <div className="space-y-2 select-text">
                    {hasGroomParents && (
                        <div>
                            {isEn 
                                ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` 
                                : `Keluarga Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </div>
                    )}
                    {hasBrideParents && (
                        <div>
                            {isEn 
                                ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` 
                                : `Keluarga Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </div>
                    )}
                </div>
            </Reveal>

            <Reveal delay={500}>
                <FlowerSwirl />
            </Reveal>

            <p className="sp03-watermark relative z-10 select-none pb-6 text-[var(--sp03-text-light)] text-[10px]">
                Made with <img src={ORNAMENTS.heart} alt="love" className="w-3.5 h-3.5 inline-block mx-0.5 opacity-90" /> by {brandName}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT PORT export
   ═══════════════════════════════════════ */
export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScroll, setAutoScroll] = useState(invitation?.enable_auto_scroll !== false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const [activeSection, setActiveSection] = useState('opening');
    const [slideIdx, setSlideIdx] = useState(0);

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const layoutMode = invitation?.layout_mode || 'scroll'; // 'scroll', 'slide-h', 'slide-v'
    const isHorizontal = layoutMode === 'slide-h';

    // Global settings injection
    const showPhotos = invitation?.show_photos !== false;
    const showAnimations = invitation?.show_animations !== false;
    const enableRsvp = invitation?.enable_rsvp !== false;
    const enableWishes = invitation?.enable_wishes !== false;
    const enableQr = invitation?.enable_qr !== false && invitation?.show_qr_code !== false;

    useEffect(() => {
        globalShowPhotos = showPhotos;
        globalShowAnimations = showAnimations;
    }, [showPhotos, showAnimations]);

    // Error safety boundary fallback resolution list
    const resolvedSections = useMemo(() => {
        const list = safeArr(sections);
        const coverFiltered = list.filter(s => s.section_key !== 'cover');
        
        // Anti duplicate wishes/rsvp form check
        const hasRsvp = coverFiltered.some(s => s.section_key === 'rsvp');
        return coverFiltered.filter(s => {
            if (s.section_key === 'wishes' && hasRsvp) return false;
            return true;
        });
    }, [sections]);

    const activeSectionKey = useMemo(() => {
        if (layoutMode === 'scroll') return activeSection;
        return resolvedSections[slideIdx]?.section_key || 'opening';
    }, [layoutMode, activeSection, slideIdx, resolvedSections]);

    // Handle Copy Number
    const handleCopy = (num, idx) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2500);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2500);
                });
        } else {
            fallbackCopy(num);
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2500);
        }
    };

    // Fullscreen listeners
    useEffect(() => {
        const handleFs = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFs);
        return () => document.removeEventListener('fullscreenchange', handleFs);
    }, []);

    const toggleFs = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    const handleOpen = () => {
        setIsOpened(true);
        if (invitation?.music_url && audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log('Audio autoplay blocked:', err));
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    // Swipe page triggers in slide modes
    const touchStart = useRef(null);
    
    const handleTouchStart = (e) => {
        if (layoutMode === 'scroll') return;
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (layoutMode === 'scroll' || !touchStart.current) return;
        
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        
        const isHorizontalLayout = layoutMode === 'slide-h';
        const axisDelta = isHorizontalLayout ? dx : dy;
        
        if (Math.abs(isHorizontalLayout ? dx : dy) > 50 && Math.abs(isHorizontalLayout ? dx : dy) > Math.abs(isHorizontalLayout ? dy : dx)) {
            if (axisDelta < 0) {
                // Next
                setSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
            } else {
                // Prev
                setSlideIdx(prev => Math.max(prev - 1, 0));
            }
        }
        touchStart.current = null;
    };

    // Scrollspy and dynamic menu highlight in scroll mode
    useEffect(() => {
        if (layoutMode !== 'scroll' || !isOpened) return;

        const handleScroll = () => {
            const elements = document.querySelectorAll('[data-section]');
            let current = 'opening';
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 250) {
                    current = el.dataset.section;
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [layoutMode, isOpened]);

    // Stale closure synchronizer for slide index
    useEffect(() => {
        if (layoutMode === 'scroll') return;
        const target = resolvedSections[slideIdx]?.section_key;
        if (target) setActiveSection(target);
    }, [slideIdx, resolvedSections, layoutMode]);

    // Pixel auto scroll in scroll mode, and index swiper in slide modes
    useEffect(() => {
        if (!isOpened || !autoScroll) return;

        const isSlide = layoutMode === 'slide-h' || layoutMode === 'slide-v';
        let timer = null;

        if (isSlide) {
            timer = setInterval(() => {
                setSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) return 0;
                    return prev + 1;
                });
            }, 5500);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isAtBottom) {
                    setAutoScroll(false);
                }
            }, 25);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScroll, layoutMode, resolvedSections.length]);

    // Navigation jumps
    const jumpToSection = (key) => {
        if (layoutMode === 'scroll') {
            const el = document.getElementById(`section-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx >= 0) setSlideIdx(idx);
        }
    };

    // Particles background rendering
    const particleType = invitation?.particle_type || 'gold-dust';

    return (
        <ErrorBoundary>
            <div className={`sp03-theme-wrapper ${!showAnimations ? 'theme-no-animations' : ''}`}>
                <Head title={invitation?.title || 'Undangan Pernikahan'} />
                
                {/* Background music audio player */}
                {invitation?.music_url && (
                    <audio ref={audioRef} src={invitation.music_url} loop />
                )}

                {/* Particle effect background */}
                {isOpened && particleType !== 'none' && (
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        <ParticleEffect type={particleType} />
                    </div>
                )}

                {/* 1. COVER OVERLAY SCREEN */}
                <CoverSection 
                    invitation={invitation} 
                    brideGrooms={brideGrooms} 
                    guest={guest} 
                    isOpened={isOpened} 
                    onOpen={handleOpen}
                    showPhotos={showPhotos}
                />

                {/* 2. MAIN APPLICATION CONTENT */}
                {isOpened && (
                    <div className="relative z-10 w-full min-h-screen">
                        
                        {/* Scroll Spy / Dynamic Layout mode handler */}
                        {layoutMode === 'scroll' ? (
                            <div className="w-full flex flex-col items-center">
                                {resolvedSections.map((sec) => (
                                    <div 
                                        key={sec.id} 
                                        id={`section-${sec.section_key}`} 
                                        data-section={sec.section_key}
                                        className="sp03-section-container w-full max-w-xl"
                                    >
                                        {sec.section_key === 'opening' && (
                                            <OpeningSection invitation={invitation} showPhotos={showPhotos} brideGrooms={brideGrooms} locale={locale} />
                                        )}
                                        {sec.section_key === 'bride_groom' && (
                                            <BrideGroomSection brideGrooms={brideGrooms} locale={locale} showPhotos={showPhotos} />
                                        )}
                                        {sec.section_key === 'event' && (
                                            <EventSection events={events} showPhotos={showPhotos} locale={locale} invitation={invitation} sections={sections} />
                                        )}
                                        {sec.section_key === 'love_story' && (
                                            <LoveStorySection loveStories={loveStories} />
                                        )}
                                        {sec.section_key === 'gallery' && (
                                            <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                        )}
                                        {sec.section_key === 'livestream' && (
                                            <LiveStreamingSection events={events} locale={locale} />
                                        )}
                                        {sec.section_key === 'bank' && (
                                            <BankSection bankAccounts={bankAccounts} copiedIdx={copiedIdx} handleCopy={handleCopy} />
                                        )}
                                        {sec.section_key === 'rsvp' && (
                                            <WishesRsvpSection 
                                                invitation={invitation}
                                                guest={guest}
                                                wishes={wishes}
                                                enableRsvp={enableRsvp}
                                                enableWishes={enableWishes}
                                            />
                                        )}
                                        {sec.section_key === 'closing' && (
                                            <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* SLIDE MODES (HORIZONTAL / VERTICAL) */
                            <div 
                                className="sp03-slide-mode-container"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {resolvedSections.map((sec, idx) => {
                                    const isActive = idx === slideIdx;
                                    const isNext = idx === slideIdx + 1;
                                    const isPrev = idx === slideIdx - 1;
                                    
                                    let statusClass = '';
                                    if (isActive) statusClass = 'is-active';
                                    else if (isNext) statusClass = 'is-next';
                                    else if (isPrev) statusClass = 'is-prev';

                                    return (
                                        <div 
                                            key={sec.id}
                                            className={`sp03-slide-wrapper ${statusClass}`}
                                        >
                                            <div className="sp03-section-container w-full max-w-xl mx-auto min-h-screen">
                                                {sec.section_key === 'opening' && (
                                                    <OpeningSection invitation={invitation} showPhotos={showPhotos} brideGrooms={brideGrooms} locale={locale} />
                                                )}
                                                {sec.section_key === 'bride_groom' && (
                                                    <BrideGroomSection brideGrooms={brideGrooms} locale={locale} showPhotos={showPhotos} />
                                                )}
                                                {sec.section_key === 'event' && (
                                                    <EventSection events={events} showPhotos={showPhotos} locale={locale} invitation={invitation} sections={sections} />
                                                )}
                                                {sec.section_key === 'love_story' && (
                                                    <LoveStorySection loveStories={loveStories} />
                                                )}
                                                {sec.section_key === 'gallery' && (
                                                    <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                                )}
                                                {sec.section_key === 'livestream' && (
                                                    <LiveStreamingSection events={events} locale={locale} />
                                                )}
                                                {sec.section_key === 'bank' && (
                                                    <BankSection bankAccounts={bankAccounts} copiedIdx={copiedIdx} handleCopy={handleCopy} />
                                                )}
                                                {sec.section_key === 'rsvp' && (
                                                    <WishesRsvpSection 
                                                        invitation={invitation}
                                                        guest={guest}
                                                        wishes={wishes}
                                                        enableRsvp={enableRsvp}
                                                        enableWishes={enableWishes}
                                                    />
                                                )}
                                                {sec.section_key === 'closing' && (
                                                    <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 3. SIDEBAR FLOATING CONTROLS */}
                        <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-2.5">
                            {/* QR CODE PRESENSI CHECK-IN TRIGGER */}
                            {enableQr && guest && (
                                <button 
                                    type="button" 
                                    onClick={() => setShowQrCode(true)}
                                    className="sp03-control-btn shadow-md"
                                    title="QR Code Presensi"
                                >
                                    <i className="fas fa-qrcode" />
                                </button>
                            )}

                            {/* FULLSCREEN MODE TOGGLER */}
                            <button 
                                type="button" 
                                onClick={toggleFs} 
                                className="sp03-control-btn shadow-md"
                                title="Fullscreen"
                            >
                                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                            </button>

                            {/* AUDIO BACKSOUND CONTROLLER */}
                            {invitation?.music_url && (
                                <button 
                                    type="button" 
                                    onClick={togglePlay}
                                    className={`sp03-control-btn shadow-md ${isPlaying ? 'is-active' : ''}`}
                                    title={isPlaying ? "Mute" : "Play music"}
                                >
                                    {isPlaying ? (
                                        <div className="global-music-waves">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    ) : (
                                        <i className="fas fa-volume-mute" />
                                    )}
                                </button>
                            )}

                            {/* AUTO SCROLL TOGGLER */}
                            <button 
                                type="button" 
                                onClick={() => setAutoScroll(!autoScroll)}
                                className={`sp03-control-btn shadow-md ${autoScroll ? 'is-active' : ''}`}
                                title="Auto Scroll"
                            >
                                <i className="fas fa-chevron-down" style={{ transform: autoScroll ? 'none' : 'rotate(-90deg)', transition: 'transform 0.3s' }} />
                            </button>
                        </div>

                        {/* 4. PREMIUM COMPACT NAVIGATION FLOATING BAR */}
                        <div className="sp03-nav-menu">
                            <div className="sp03-nav-menu__inner--row flex justify-around">
                                {resolvedSections.map((sec) => {
                                    const key = sec.section_key;
                                    const isCurrent = activeSectionKey === key;
                                    let navIcon = 'fa-star';
                                    let labelText = sec.section_name || key;
                                    if (key === 'opening') { navIcon = 'fa-star'; labelText = t('nav.pembuka') || 'Pembuka'; }
                                    else if (key === 'bride_groom') { navIcon = 'fa-heart'; labelText = t('nav.mempelai') || 'Mempelai'; }
                                    else if (key === 'event') { navIcon = 'fa-calendar-alt'; labelText = t('nav.acara') || 'Acara'; }
                                    else if (key === 'love_story') { navIcon = 'fa-book-open'; labelText = t('nav.kisah') || 'Kisah'; }
                                    else if (key === 'gallery') { navIcon = 'fa-images'; labelText = t('nav.galeri') || 'Galeri'; }
                                    else if (key === 'livestream') { navIcon = 'fa-video'; labelText = t('nav.streaming') || 'Siaran'; }
                                    else if (key === 'bank') { navIcon = 'fa-gift'; labelText = t('nav.hadiah') || 'Hadiah'; }
                                    else if (key === 'rsvp') { navIcon = 'fa-envelope-open-text'; labelText = t('nav.rsvp') || 'RSVP'; }
                                    else if (key === 'closing') { navIcon = 'fa-handshake'; labelText = t('nav.penutup') || 'Penutup'; }

                                    return (
                                        <button 
                                            key={sec.id}
                                            type="button"
                                            onClick={() => jumpToSection(key)}
                                            className={`sp03-nav-menu__item ${isCurrent ? 'active' : ''}`}
                                            title={sec.section_name}
                                        >
                                            <i className={`fas ${navIcon}`} />
                                            <span className="sp03-nav-item-text">{labelText}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. PRESENSI CHECK-IN MODAL OVERLAY */}
                        {enableQr && showQrCode && guest && (
                            <div className="sp03-modal-overlay z-50 flex items-center justify-center p-4">
                                <div className="sp03-modal-card text-center max-w-[290px] w-full p-6 relative">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowQrCode(false)} 
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <i className="fas fa-times text-md" />
                                    </button>
                                    <h4 className="text-[15px] font-bold text-[var(--sp03-primary)] sp03-font-heading-style mb-4 tracking-wide">
                                        {isEn ? 'PRESENCE CHECK-IN QR' : 'QR CODE PRESENSI'}
                                    </h4>
                                    <div className="mx-auto border border-gray-100 p-2 rounded-2xl bg-white w-[180px] h-[180px] flex items-center justify-center shadow-xs">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=2e3f54&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="QR Code Presensi" 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-[12px] text-[var(--sp03-text)] mt-4 font-semibold tracking-wide">
                                        {guest.name}
                                    </p>
                                    <p className="text-[9px] opacity-60 mt-1">
                                        {isEn ? 'Show this QR code to the reception desk for instant check-in.' : 'Tunjukkan QR Code ini pada penerima tamu untuk check-in kehadiran.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
