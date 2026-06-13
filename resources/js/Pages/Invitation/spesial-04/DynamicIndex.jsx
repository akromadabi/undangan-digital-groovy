import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

/* ═══════════════════════════════════════
   STANDARD HELPERS & UTILITIES
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
    const d = parseSafeDate(dateString);
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
    const d = parseSafeDate(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}


// Safe date parsing helper for cross-browser local time countdowns
function parseSafeDate(dateStr, timeStr = '') {
    if (!dateStr) return null;
    let datePart = String(dateStr).substring(0, 10);
    let timePart = '08:00:00';
    
    if (timeStr) {
        timePart = String(timeStr).substring(0, 5) + ':00';
    } else if (String(dateStr).length > 10) {
        let parts = String(dateStr).trim().split(/\s+/);
        if (parts[1]) {
            timePart = parts[1].substring(0, 5);
            if (timePart.length === 5) {
                timePart += ':00';
            }
        }
    }
    
    let isoStr = `${datePart}T${timePart}`;
    let d = new Date(isoStr);
    if (!isNaN(d.getTime())) {
        return d;
    }
    
    const dateParts = datePart.split('-');
    const timeParts = timePart.split(':');
    return new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10),
        parseInt(timeParts[0], 10) || 0,
        parseInt(timeParts[1], 10) || 0,
        parseInt(timeParts[2], 10) || 0
    );
}

function useCountdown(targetDate, targetTime = '') {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const calculate = () => {
            const target = parseSafeDate(targetDate, targetTime);
            if (!target) return;
            const difference = target.getTime() - Date.now();
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
    }, [targetDate, targetTime]);

    return timeLeft;
}

function CountdownTimer({ targetDate, targetTime = '' }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(targetDate, targetTime);
    
    return (
        <div className="sp04-countdown-wrapper select-none">
            <div className="sp04-countdown">
                <div className="sp04-countdown-item">
                    <span className="sp04-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="sp04-countdown-label">{t('invitation.days')}</span>
                </div>
                <span className="sp04-countdown-colon">:</span>
                <div className="sp04-countdown-item">
                    <span className="sp04-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="sp04-countdown-label">{t('invitation.hours')}</span>
                </div>
                <span className="sp04-countdown-colon">:</span>
                <div className="sp04-countdown-item">
                    <span className="sp04-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="sp04-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <span className="sp04-countdown-colon">:</span>
                <div className="sp04-countdown-item">
                    <span className="sp04-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="sp04-countdown-label">{t('invitation.seconds')}</span>
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
            <div className="p-8 text-center bg-red-50 text-red-800 rounded-xl my-4 border border-red-200">
                <h2 className="text-lg font-bold mb-2">Terjadi kesalahan pada rendering seksi tema.</h2>
                <pre className="text-xs overflow-x-auto bg-white p-3 rounded border text-left">{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

// Global configs updated by component
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL EFFECT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.unobserve(el);
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'sp04-ani-hidden';
    let revealClass = 'sp04-ani-fadeUp';
    if (variant === 'zoom') {
        revealClass = 'sp04-ani-scaleIn';
    } else if (variant === 'left') {
        revealClass = 'sp04-ani-fadeLeft';
    } else if (variant === 'right') {
        revealClass = 'sp04-ani-fadeRight';
    }

    return (
        <div
            ref={ref}
            className={`${className} ${visible ? revealClass : baseClass}`}
            style={delay && visible ? { animationDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   FLOWER SWIRL / SECTION HEADER
   ═══════════════════════════════════════ */
function FlowerSwirl({ title }) {
    return (
        <div className="mb-8 flex flex-col items-center select-none">
            {title && (
                <h2 className="text-3xl sm:text-4xl text-[var(--sp04-primary)] sp04-font-heading-style leading-none mb-3">
                    {title}
                </h2>
            )}
            <div className="sp04-divider">
                <div className="sp04-divider-line" />
                <div className="sp04-divider-dot" />
                <div className="sp04-divider-line" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SECTIONS IMPLEMENTATION
   ═══════════════════════════════════════ */

// 1. COVER SECTION (Elementor ID satu & Cover)
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showPhotos }) {
    const { t, locale } = useTranslation();
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || (isEn ? 'Dear Guest' : 'Tamu Undangan');

    const coupleInitials = useMemo(() => {
        const gChar = groom?.nickname?.charAt(0) || groom?.full_name?.charAt(0) || 'S';
        const bChar = bride?.nickname?.charAt(0) || bride?.full_name?.charAt(0) || 'A';
        return { gChar, bChar };
    }, [groom, bride]);

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className={`sp04-cover ${isOpened ? 'sp04-is-opened' : ''}`}>
            {/* Visual Top Image with arch shape */}
            {showPhotos && coverImages.length > 0 ? (
                <div className="sp04-cover-photo-window relative z-0">
                    <PremiumSlideshow
                        images={coverImages}
                        positionX={invitation?.cover_position_x}
                        positionY={invitation?.cover_position_y}
                        zoom={invitation?.cover_zoom}
                    />
                </div>
            ) : (
                <div className="sp04-cover-photo-window bg-[var(--sp04-primary)] relative z-0 flex items-center justify-center text-white">
                    <i className="fas fa-heart text-5xl opacity-40 sp04-breathe" />
                </div>
            )}
            
            <div className="flex-grow relative z-10 flex flex-col justify-between items-center py-8 px-6 text-center">
                {/* Title */}
                <div className="mt-2">
                    <p className="text-[10px] tracking-[0.25em] font-semibold text-[var(--sp04-text-muted)] mb-1 uppercase select-none">
                        Undangan Pernikahan
                    </p>
                    <h1 className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style leading-snug">
                        {invitation?.cover_title || 'Sandi & Arti'}
                    </h1>
                </div>

                {/* Leaf Monogram */}
                <div className="sp04-leaf-monogram">
                    <span className="text-4xl text-[var(--sp04-primary)] sp04-font-heading-style font-medium select-none">
                        {coupleInitials.gChar}
                    </span>
                    <span className="text-md text-[var(--sp04-primary)]/80 font-bold select-none my-0.5">/</span>
                    <span className="text-4xl text-[var(--sp04-primary)] sp04-font-heading-style font-medium select-none">
                        {coupleInitials.bChar}
                    </span>
                </div>

                {/* Location */}
                <p className="text-[12px] font-semibold tracking-wider text-[var(--sp04-primary)] select-none">
                    Cileungsi - Kab. Bogor
                </p>

                {/* Guest Box */}
                <div className="sp04-guest-card p-5 my-2">
                    <p className="text-[11px] text-[var(--sp04-text-muted)] font-semibold tracking-wider mb-2 select-none">
                        {isEn ? 'Dear Guest' : 'Kepada Yth. Bapak/Ibu/Saudara/i :'}
                    </p>
                    <p className="text-md font-bold text-[var(--sp04-primary)] tracking-wide mb-1">
                        {guestName}
                    </p>
                    <p className="text-[11px] text-[var(--sp04-text-muted)] italic select-none">
                        {isEn ? 'At Place' : 'Di Tempat'}
                    </p>
                </div>

                {/* Open Button */}
                <button type="button" onClick={onOpen} className="sp04-btn-buka mb-4">
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

// 2. OPENING SECTION
function OpeningSection({ invitation, showPhotos, brideGrooms, events, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const isEn = locale === 'en';

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);
    const targetDate = useMemo(() => invitation?.countdown_target_date || primaryEvent?.event_date || '', [invitation?.countdown_target_date, primaryEvent]);
    const showCountdown = parseBool(invitation?.show_countdown, true);

    return (
        <div className="sp04-opening-section w-full">
            {/* Arch-shaped prewedding photo */}
            {showPhotos && openingImages.length > 0 ? (
                <Reveal variant="zoom" className="sp04-opening-photo-frame mb-8">
                    <PremiumSlideshow
                        images={openingImages}
                        positionX={invitation?.opening_position_x}
                        positionY={invitation?.opening_position_y}
                        zoom={invitation?.opening_zoom}
                    />
                </Reveal>
            ) : (
                <Reveal className="my-6">
                    <div className="sp04-leaf-monogram bg-white/80">
                        <span className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style">{groom.nickname?.charAt(0) || 'S'}</span>
                        <span className="text-[var(--sp04-primary)]/80 font-bold">/</span>
                        <span className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style">{bride.nickname?.charAt(0) || 'A'}</span>
                    </div>
                </Reveal>
            )}

            <Reveal className="max-w-xs mx-auto">
                <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[var(--sp04-text-muted)] mb-2 select-none">
                    THE WEDDING OF
                </p>
                <h2 className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style mb-4 leading-snug">
                    {groom.nickname || 'Sandi'} &amp; {bride.nickname || 'Arti'}
                </h2>
                
                <p className="text-xs font-semibold text-[var(--sp04-text-muted)] tracking-wider uppercase mb-6 select-none">
                    {invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date, locale) : 'Sabtu, 16 Desember 2026'}
                </p>

                {showCountdown && targetDate && (
                    <Reveal variant="zoom" className="mb-6">
                        <CountdownTimer targetDate={targetDate} targetTime={primaryEvent?.start_time || ''} />
                    </Reveal>
                )}

                <button 
                    type="button" 
                    onClick={() => {
                        const target = invitation?.countdown_target_date ? new Date(String(invitation.countdown_target_date).substring(0, 10) + 'T12:00:00') : new Date('2026-12-16T09:00:00');
                        const ds = target.toISOString().substring(0, 10).replace(/-/g, '');
                        const names = `${groom.nickname || 'Sandi'} & ${bride.nickname || 'Arti'}`;
                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + names)}&dates=${ds}T090000/${ds}T140000&sf=true&output=xml`;
                        window.open(url, '_blank');
                    }} 
                    className="sp04-btn-save-date"
                >
                    {t('invitation.save_the_date') || 'Save The Date'}
                </button>
            </Reveal>
        </div>
    );
}

// 3. QURANIC QUOTE SECTION
function QuoteSection({ invitation, locale }) {
    const isEn = locale === 'en';
    
    return (
        <div className="sp04-quote-section">
            <Reveal variant="zoom" className="max-w-md mx-auto relative z-10 flex flex-col items-center">
                <i className="fas fa-heart text-white/20 text-4xl mb-4 sp04-breathe" />
                
                <p className="text-[13px] leading-relaxed italic text-white/90 font-serif select-none px-4">
                    {invitation?.opening_ayat || (isEn 
                        ? "“And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.”"
                        : "“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.”"
                    )}
                </p>
                <p className="text-xs font-bold tracking-widest text-[var(--sp04-secondary)] mt-4 select-none">
                    {invitation?.opening_ayat_source || (isEn ? "— QS. AR-RUM: 21" : "— QS. AR-RUM: 21")}
                </p>
            </Reveal>
        </div>
    );
}

// 4. BRIDE & GROOM PROFILE SECTION
function BrideGroomSection({ brideGrooms, locale, showPhotos }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const isEn = locale === 'en';

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
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
        <div className="sp04-mempelai-section text-center">
            <Reveal>
                <div className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style select-none">
                    Assalamu'alaikum Wr. Wb.
                </div>
                <p className="text-[12px] leading-relaxed text-[var(--sp04-text-muted)] max-w-xs mx-auto mt-3 mb-10 select-none">
                    {isEn 
                        ? 'With praise to God, we are honored to invite you to celebrate our marriage:' 
                        : 'Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari istimewa kami:'}
                </p>
            </Reveal>

            <div className="space-y-12">
                {/* Groom Profile */}
                <Reveal variant="left" className="flex flex-col items-center">
                    {showPhotos ? (
                        <div className="sp04-couple-arch-frame mb-5">
                            <img 
                                src={getStorageUrl(groom.photo, '/images/demo/korea-8.jpg')} 
                                alt={groom.full_name || 'Sandi'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                    transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--sp04-primary)] flex items-center justify-center font-bold text-xl text-[var(--sp04-primary)] bg-white shadow-md mb-4 font-serif">
                            {groom.nickname?.charAt(0) || 'S'}
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-[var(--sp04-primary)] sp04-font-heading-style tracking-wide">
                        {groom.full_name || 'Sandi Rahardian'}
                    </h3>
                    <p className="text-xs text-[var(--sp04-text-muted)] font-semibold mt-1 max-w-xs px-4">
                        {translateChildOrder(groom.child_order, 'pria')}{' '}
                        <span className="text-[var(--sp04-primary)] font-bold uppercase">
                            {groom.father_name && groom.mother_name 
                                ? `${groom.father_name} & ${groom.mother_name}` 
                                : 'Bapak Lorem Ipsum & Ibu Lipsum'}
                        </span>
                    </p>
                    {groom.instagram && (
                        <a 
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="sp04-btn-ig-circle mt-3"
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </Reveal>

                {/* Separator / Ampersand */}
                <Reveal variant="zoom" className="py-2 select-none">
                    <span className="text-5xl text-[var(--sp04-primary)] sp04-font-heading-style">&amp;</span>
                </Reveal>

                {/* Bride Profile */}
                <Reveal variant="right" className="flex flex-col items-center">
                    {showPhotos ? (
                        <div className="sp04-couple-arch-frame mb-5">
                            <img 
                                src={getStorageUrl(bride.photo, '/images/demo/korea-3.jpg')} 
                                alt={bride.full_name || 'Arti'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                    transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--sp04-primary)] flex items-center justify-center font-bold text-xl text-[var(--sp04-primary)] bg-white shadow-md mb-4 font-serif">
                            {bride.nickname?.charAt(0) || 'A'}
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-[var(--sp04-primary)] sp04-font-heading-style tracking-wide">
                        {bride.full_name || 'Arti Dinanti'}
                    </h3>
                    <p className="text-xs text-[var(--sp04-text-muted)] font-semibold mt-1 max-w-xs px-4">
                        {translateChildOrder(bride.child_order, 'wanita')}{' '}
                        <span className="text-[var(--sp04-primary)] font-bold uppercase">
                            {bride.father_name && bride.mother_name 
                                ? `${bride.father_name} & ${bride.mother_name}` 
                                : 'Bapak Lorem Ipsum & Ibu Lipsum'}
                        </span>
                    </p>
                    {bride.instagram && (
                        <a 
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="sp04-btn-ig-circle mt-3"
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </Reveal>
            </div>
        </div>
    );
}

// 5. EVENTS & COUNTDOWN SECTION
function EventSection({ events, locale, invitation, sections }) {
    const { t } = useTranslation();
    const list = safeArr(events);
    const isEn = locale === 'en';

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

    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);
    const targetDate = useMemo(() => invitation?.countdown_target_date || primaryEvent?.event_date || '', [invitation?.countdown_target_date, primaryEvent]);

    return (
        <div className="sp04-event-section">
            <Reveal>
                <FlowerSwirl title={t('nav.acara')} />
            </Reveal>

            <div className="space-y-8 mt-6">
                {list.map((evt, idx) => {
                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date, locale);
                    const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Resepsi Nikah');
                    const isEven = idx % 2 === 0;

                    return (
                        <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="sp04-event-card">
                            <div className="flex flex-col items-center text-center">
                                {/* Title */}
                                <h4 className="text-2xl font-bold text-[var(--sp04-primary)] sp04-font-heading-style mb-4 tracking-wide">
                                    {eventDisplayName}
                                </h4>

                                {/* Day */}
                                <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--sp04-text-muted)] uppercase mb-1 select-none">
                                    {dayName || (isEn ? 'SUNDAY' : 'SABTU')}
                                </p>

                                {/* Date Big terracotta Number */}
                                <p className="text-6xl font-bold text-[var(--sp04-primary)] sp04-font-heading-style leading-none mb-1 select-none">
                                    {dayNum || '16'}
                                </p>

                                {/* Month Year */}
                                <p className="text-xs font-bold text-[var(--sp04-text-dark)] uppercase tracking-widest mb-4 select-none">
                                    {monthName || (isEn ? 'DECEMBER' : 'DESEMBER')} {year || '2026'}
                                </p>

                                {/* Time */}
                                <p className="text-[12px] font-semibold text-[var(--sp04-text-muted)] mb-5 select-none">
                                    <i className="far fa-clock text-[var(--sp04-primary)] mr-1.5" />
                                    {isEn ? 'Time' : 'Pukul'} : {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : (isEn ? ' - End' : ' - Selesai')} {evt.timezone || 'WIB'}
                                </p>

                                {/* Divider */}
                                <div className="sp04-divider select-none mb-4">
                                    <div className="sp04-divider-line" />
                                    <div className="text-[var(--sp04-primary)]"><i className="fas fa-map-marker-alt" /></div>
                                    <div className="sp04-divider-line" />
                                </div>

                                {/* Venue Details */}
                                <div className="text-xs leading-relaxed text-[var(--sp04-text-dark)] font-semibold mb-6 px-2">
                                    <p className="font-bold text-sm mb-1 text-[var(--sp04-primary)]">{evt.venue_name || (isEn ? "Gedung Kesenian" : "Gedung Kesenian")}</p>
                                    <p className="opacity-80 font-medium">{evt.venue_address || 'Jl. Kemakmuran No. 15A Sukamakmur - Bogor Utara'}</p>
                                </div>

                                {/* Map Button */}
                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sp04-btn-map"
                                    >
                                        <i className="fas fa-map-marker-alt" /> {isEn ? 'View Location' : 'Lihat Lokasi'}
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    );
                })}

                                {/* Compact standalone Dress Code box below event list */}
                                {list?.filter(evt => evt.show_dress_code).map((evt, idx) => (
                                    <div key={`dc-${idx}`} className="sp04-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={evt} colors={{ primary: 'var(--sp04-primary)', text: 'var(--sp04-text)' }} fonts={{ heading: 'inherit' }} variant="modern" plain={true} />
                                    </div>
                                ))}
            </div>
        </div>
    );
}

// 6. GOOGLE MAPS IFRAME SECTION (Elementor ID lima & Gmap)
function GmapSection({ events, locale }) {
    const isEn = locale === 'en';
    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);

    return (
        <div className="w-full py-16 px-6 bg-[var(--sp04-secondary)]/30 text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Maps Location' : 'Peta Lokasi'} />
            </Reveal>

            <Reveal variant="zoom" className="mt-6 rounded-[28px] overflow-hidden shadow-lg border-4 border-white aspect-[4/3] w-full max-w-sm mx-auto">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15862.9768010497!2d106.64362318442646!3d-6.297307448791637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fb2f1177e8c5%3A0x4ef79a025e2fa9c7!2sHotel%20Santika%20BSD%20City%20-%20Serpong!5e0!3m2!1sid!2sid!4v1678128457475!5m2!1sid!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Reveal>

            {primaryEvent?.gmaps_link && (
                <Reveal className="mt-6">
                    <a 
                        href={primaryEvent.gmaps_link}
                        target="_blank"
                        rel="noreferrer"
                        className="sp04-btn-map"
                    >
                        <i className="fas fa-directions" /> {isEn ? 'Navigate via Google Maps' : 'Petunjuk Arah'}
                    </a>
                </Reveal>
            )}
        </div>
    );
}

// 7. STORY TIMELINE SECTION (Elementor ID enam & Story)
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    if (list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} />
            </Reveal>

            <div className="sp04-timeline mt-8">
                {list.map((story, i) => (
                    <Reveal key={story.id || i} variant={i % 2 === 0 ? 'left' : 'right'} className="sp04-timeline-item">
                        <div className="sp04-story-card">
                            <span className="sp04-story-year">
                                {story.story_date ? new Date(String(story.story_date).substring(0, 10) + 'T12:00:00').getFullYear() : story.year || '2021'}
                            </span>
                            <h4 className="text-md font-bold text-[var(--sp04-primary)] sp04-font-heading-style tracking-wide mb-1.5">
                                {story.title}
                            </h4>
                            <p className="text-xs leading-relaxed opacity-90 text-[var(--sp04-text-dark)] font-medium">
                                {story.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 8. GALLERY GRID SECTION
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.galeri')} />
            </Reveal>

            <div className="grid grid-cols-2 gap-3 mt-6">
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
                            <img src={imgUrl} alt={item.caption || 'Galeri'} className="sp04-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

// 9. unified RSVP & WISHES SECTION (Elementor & unified RSVP/wishes)
function RsvpWishesSection({ invitation, wishes, locale }) {
    const wishesInputRef = React.useRef(null);
    const { t } = useTranslation();
    const isEn = locale === 'en';
    
    // Wishes List local State
    const [wishesList, setWishesList] = useState(safeArr(wishes));

    // Form Hooks
    const { data, setData, post, processing, reset, errors } = useForm({
        sender_name: '',
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('invitation.submit-rsvp', { slug: invitation.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                // Post wishing too if message exists
                if (data.message) {
                    post(route('invitation.submit-wish', { slug: invitation.slug }), {
                        preserveScroll: true,
                        onSuccess: () => {
                            // Append locally for instant preview without hard-refresh
                            setWishesList(prev => [
                                {
                                    id: Date.now(),
                                    sender_name: data.sender_name,
                                    message: data.message,
                                    created_at: new Date().toISOString()
                                },
                                ...prev
                            ]);
                            reset();
                            setFormSubmitted(true);
                        }
                    });
                } else {
                    reset();
                    setFormSubmitted(true);
                }
            }
        });
    };

    return (
        <div className="py-16 px-6 max-w-md mx-auto text-center" id="rsvp">
            <Reveal>
                <FlowerSwirl title={isEn ? 'RSVP & Wishes' : 'RSVP & Ucapan'} />
            </Reveal>

            {/* RSVP Form Card */}
            <Reveal variant="zoom" className="sp04-event-card p-6 mt-6">
                {formSubmitted ? (
                    <div className="py-8 text-center">
                        <i className="fas fa-check-circle text-4xl text-[var(--sp04-primary)] mb-3" />
                        <h4 className="text-lg font-bold text-[var(--sp04-primary)] select-none">
                            {isEn ? 'Thank You!' : 'Terima Kasih!'}
                        </h4>
                        <p className="text-xs text-[var(--sp04-text-muted)] mt-1">
                            {isEn ? 'Your attendance & wishing has been saved.' : 'Konfirmasi kehadiran & doa Anda berhasil disimpan.'}
                        </p>
                        <button type="button" onClick={() => setFormSubmitted(false)} className="sp04-btn-save-date mt-6">
                            {isEn ? 'Submit Another' : 'Isi Kembali'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="sp04-input-group">
                            <label className="sp04-label">{isEn ? 'Your Name' : 'Nama Anda'}</label>
                            <input 
                                type="text"
                                className="sp04-input"
                                placeholder={isEn ? 'Your full name...' : 'Nama lengkap Anda...'}
                                value={data.sender_name}
                                onChange={e => setData('sender_name', e.target.value)}
                                required
                            />
                            {errors.sender_name && <div className="text-[10px] text-red-500 mt-1">{errors.sender_name}</div>}
                        </div>

                        {/* Attendance */}
                        <div className="sp04-input-group">
                            <label className="sp04-label">{isEn ? 'Attendance Status' : 'Konfirmasi Kehadiran'}</label>
                            <select 
                                className="sp04-select"
                                value={data.attendance}
                                onChange={e => setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{isEn ? 'Will Attend' : 'Hadir'}</option>
                                <option value="tidak_hadir">{isEn ? 'Will Not Attend' : 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum Pasti'}</option>
                            </select>
                        </div>

                        {/* Guest Pax (only if attend) */}
                        {data.attendance === 'hadir' && (
                            <div className="sp04-input-group">
                                <label className="sp04-label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                                <select 
                                    className="sp04-select"
                                    value={data.number_of_guests}
                                    onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <option key={v} value={v}>{v} {isEn ? 'Person' : 'Orang'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Wish Message */}
                        <div className="sp04-input-group">
                            <label className="sp04-label">{isEn ? 'Wish & Blessing' : 'Ucapan & Doa'}</label>
                            <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef} 
                                className="sp04-textarea"
                                rows="3"
                                placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan dan doa terbaik Anda...'}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                            />
                                </WishesEmojiPicker>
                            {errors.message && <div className="text-[10px] text-red-500 mt-1">{errors.message}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="sp04-btn-submit"
                        >
                            {processing ? (isEn ? 'Submitting...' : 'Mengirim...') : (isEn ? 'Confirm Attendance' : 'Kirim RSVP')}
                        </button>
                    </form>
                )}
            </Reveal>

            {/* Wishes Scrollable List */}
            {wishesList.length > 0 && (
                <Reveal variant="zoom" className="mt-8 text-left">
                    <h5 className="text-xs font-bold text-[var(--sp04-primary)] uppercase tracking-wider mb-4 px-2">
                        {isEn ? 'Wishes & Prayers' : 'Daftar Ucapan Tamu'}
                    </h5>
                    
                    <div className="sp04-wishes-container space-y-3">
                        {wishesList.map((wish, i) => (
                            <div key={wish.id || i} className="sp04-wish-card">
                                <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-bold text-[var(--sp04-primary)] tracking-wide">
                                        {wish.sender_name}
                                    </h6>
                                    <span className="text-[9px] text-[var(--sp04-text-muted)] font-medium">
                                        {new Date(wish.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-[var(--sp04-text-dark)] font-medium opacity-90">
                                    {wish.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            )}
        </div>
    );
}

// 10. BANK / DIGITAL ENVELOPE SECTION (Luxury 2 inspired style)
function BankSection({ bankAccounts, locale }) {
    const { t } = useTranslation();
    const list = safeArr(bankAccounts);
    const isEn = locale === 'en';

    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (num, id) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                });
        } else {
            fallbackCopy(num);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto text-center" id="gift">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Digital Wedding Gift' : 'Kado Digital'} />
            </Reveal>
            <Reveal>
                <p className="text-xs text-[var(--sp04-text-muted)] max-w-xs mx-auto mb-8 select-none">
                    {isEn 
                        ? 'For family and friends who wish to send digital blessings:' 
                        : 'Bagi keluarga dan kerabat yang ingin mengirimkan kado digital sebagai tanda doa restu:'}
                </p>
            </Reveal>

            <div className="space-y-6">
                {list.map((bank, i) => (
                    <Reveal key={bank.id || i} variant="zoom" className="sp04-bank-card text-left flex flex-col justify-between h-44">
                        {/* Chip & Bank Logo Row */}
                        <div className="flex justify-between items-center">
                            <span className="font-bold italic text-lg text-[var(--sp04-primary)] select-none">
                                {bank.bank_name}
                            </span>
                            <div className="w-10 h-7 bg-white/50 border border-white/60 rounded-md shadow-xs opacity-65 flex items-center justify-center font-bold text-[8px] text-[var(--sp04-primary)]">
                                CHIP
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="my-2">
                            <p className="text-[10px] uppercase font-bold text-[var(--sp04-text-muted)] select-none tracking-widest mb-1">
                                Account Number
                            </p>
                            <p className="text-xl font-bold tracking-widest text-[var(--sp04-primary)]">
                                {bank.account_number}
                            </p>
                        </div>

                        {/* Account Holder Name & Copy Button */}
                        <div className="flex justify-between items-end border-t border-[var(--sp04-primary)]/10 pt-3">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-[var(--sp04-text-muted)] select-none tracking-widest">
                                    Account Holder
                                </p>
                                <p className="text-xs font-bold text-[var(--sp04-primary)] truncate max-w-[180px]">
                                    {bank.account_name}
                                </p>
                            </div>

                            <button 
                                type="button" 
                                onClick={() => handleCopy(bank.account_number, bank.id || i)}
                                className="sp04-btn-copy"
                            >
                                {copiedId === (bank.id || i) ? (
                                    <>
                                        <i className="fas fa-check" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <i className="far fa-copy" /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 11. CLOSING SECTION
function ClosingSection({ invitation, brideGrooms, locale }) {
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const hasGroomParents = !!(groom.father_name || groom.mother_name);
    const hasBrideParents = !!(bride.father_name || bride.mother_name);

    const rawTitle = invitation?.closing_title || (isEn ? 'Thank You' : 'Terima Kasih');
    const formattedTitle = rawTitle.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <div className="w-full py-16 px-6 text-center bg-[var(--sp04-bg-light)]">
            <Reveal variant="zoom" className="max-w-xs mx-auto flex flex-col items-center">
                <i className="fas fa-heart text-[var(--sp04-primary)] text-3xl mb-4 sp04-breathe" />
                
                <h4 className="text-3xl text-[var(--sp04-primary)] sp04-font-heading-style leading-none mb-4 tracking-wide select-none">
                    {formattedTitle}
                </h4>

                <p className="text-xs leading-relaxed text-[var(--sp04-text-muted)] px-1 mb-8 select-none font-medium">
                    {invitation?.closing_text || (isEn 
                        ? 'It is an honor and great pleasure for us if you could attend to share our joy at this celebration of marriage.'
                        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.'
                    )}
                </p>

                <div className="space-y-4 text-xs font-semibold text-[var(--sp04-text-dark)] select-none">
                    <p className="italic text-[var(--sp04-text-muted)]">{isEn ? 'We who are happy' : 'Kami yang berbahagia,'}</p>
                    
                    <h5 className="text-xl text-[var(--sp04-primary)] sp04-font-heading-style">
                        {groom.nickname || 'Sandi'} &amp; {bride.nickname || 'Arti'}
                    </h5>

                    {/* Parents formal names */}
                    <div className="space-y-2 border-t border-[var(--sp04-primary)]/10 pt-3 text-[10px] text-[var(--sp04-text-muted)] uppercase tracking-wider">
                        {hasGroomParents && (
                            <p>
                                {isEn ? 'Family of:' : 'Kel. Bapak'} {groom.father_name} &amp; {isEn ? '' : 'Ibu'} {groom.mother_name}
                            </p>
                        )}
                        {hasBrideParents && (
                            <p>
                                {isEn ? 'Family of:' : 'Kel. Bapak'} {bride.father_name} &amp; {isEn ? '' : 'Ibu'} {bride.mother_name}
                            </p>
                        )}
                    </div>
                </div>
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN DYNAMIC INDEX COMPONENT (Page root)
   ═══════════════════════════════════════ */
const isControlElement = (target) => {
    if (!target) return false;
    let node = target;
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName;
            if (
                tag === 'BUTTON' || 
                tag === 'INPUT' || 
                tag === 'TEXTAREA' || 
                tag === 'SELECT' || 
                node.classList.contains('global-music-waves') ||
                (typeof node.className === 'string' && /sp\d+-(control|nav|floating|menu)/.test(node.className))
            ) {
                return true;
            }
        }
        node = node.parentNode || node.host;
    }
    return false;
};

export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, isDemo }) {
    // 1. Language Setup (i18n)
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    // 2. States & References
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [autoScroll, setAutoScroll] = useState(parseBool(invitation?.enable_auto_scroll, false));
    const [activeSection, setActiveSection] = useState('opening');

    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const lastToggleTimeRef = useRef(0);
    const activeSectionRef = useRef('opening');
    const activeSectionTimeoutRef = useRef(null);
    const intersectingSectionsRef = useRef(new Map());
    const isNavigatingRef = useRef(false);
    const navigatingTimeoutRef = useRef(null);

    useEffect(() => {
        lastToggleTimeRef.current = Date.now();
    }, [autoScroll]);

    // Filtered visible sections based on settings
    const showPhotos = !parseBool(invitation?.hide_photos, false) && parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);

    // Apply global values to modules before rendering
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    const resolvedSections = useMemo(() => {
        const list = safeArr(sections);
        if (list.length === 0) return [];
        
        let filtered = list.filter(s => s.is_visible);
        
        // Anti-Empty Space Auto-Hide livestream if empty
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const streamings = primaryEvent?.streaming_url || (Array.isArray(primaryEvent?.streamings) && primaryEvent.streamings.length > 0);
        if (!streamings) {
            filtered = filtered.filter(s => s.section_key !== 'livestream');
        }

        // Hide gallery if no photos
        if (!showPhotos || safeArr(galleries).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'gallery');
        }

        // Unified RSVP & Wishes: if RSVP is active, wishes section key is filtered out to prevent duplicate form
        const hasRsvp = filtered.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            filtered = filtered.filter(s => s.section_key !== 'wishes');
        }

        return filtered;
    }, [sections, events, galleries, showPhotos]);

    // Page Visibility Hook to pause/play audio
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    // High-performance IntersectionObserver scrollspy
    useEffect(() => {
        if (!isOpened || resolvedSections.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '-35% 0px -35% 0px',
            threshold: 0
        };

        const handleIntersection = (entries) => {
            if (isNavigatingRef.current) return;

            entries.forEach(entry => {
                const sectionKey = entry.target.id.replace('section-', '');
                if (entry.isIntersecting) {
                    intersectingSectionsRef.current.set(sectionKey, entry.boundingClientRect.top);
                } else {
                    intersectingSectionsRef.current.delete(sectionKey);
                }
            });

            let bestSectionKey = null;
            let minDistance = Infinity;
            const viewportMiddle = window.innerHeight * 0.4;

            intersectingSectionsRef.current.forEach((_, key) => {
                const el = document.getElementById(`section-${key}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const coversMiddle = rect.top <= viewportMiddle && rect.bottom >= viewportMiddle;
                    
                    if (coversMiddle) {
                        bestSectionKey = key;
                        minDistance = -1;
                    } else if (minDistance !== -1) {
                        const distance = Math.abs(rect.top - viewportMiddle);
                        if (distance < minDistance) {
                            minDistance = distance;
                            bestSectionKey = key;
                        }
                    }
                }
            });

            if (bestSectionKey && bestSectionKey !== activeSectionRef.current) {
                activeSectionRef.current = bestSectionKey;
                
                if (activeSectionTimeoutRef.current) {
                    clearTimeout(activeSectionTimeoutRef.current);
                }
                activeSectionTimeoutRef.current = setTimeout(() => {
                    setActiveSection(bestSectionKey);
                }, 80);
            }
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        resolvedSections.forEach(s => {
            const el = document.getElementById(`section-${s.section_key}`);
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            if (activeSectionTimeoutRef.current) {
                clearTimeout(activeSectionTimeoutRef.current);
            }
        };
    }, [isOpened, resolvedSections]);

    // Cleanups on unmount
    useEffect(() => {
        return () => {
            if (navigatingTimeoutRef.current) clearTimeout(navigatingTimeoutRef.current);
            if (activeSectionTimeoutRef.current) clearTimeout(activeSectionTimeoutRef.current);
        };
    }, []);

    // Pause auto scroll on user interaction
    useEffect(() => {
        if (!isOpened || !autoScroll) return;

        const handleUserInteraction = (e) => {
            if (Date.now() - lastToggleTimeRef.current < 350) {
                return;
            }

            if (e.type === 'keydown') {
                const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', ' ', 'PageUp', 'PageDown', 'Home', 'End'];
                if (!scrollKeys.includes(e.key)) return;
            }

            if (isControlElement(e.target)) {
                return;
            }
            setAutoScroll(false);
        };

        window.addEventListener('wheel', handleUserInteraction, { passive: true });
        window.addEventListener('touchstart', handleUserInteraction, { passive: true });
        window.addEventListener('mousedown', handleUserInteraction, { passive: true });
        window.addEventListener('keydown', handleUserInteraction, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            window.removeEventListener('mousedown', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [isOpened, autoScroll]);

    // requestAnimationFrame scroll loop
    useEffect(() => {
        if (!isOpened || !autoScroll) return;

        let animationFrameId = null;
        let lastTime = performance.now();
        const speed = 0.04;
        let accumulatedScroll = 0;

        const scrollLoop = (time) => {
            const delta = time - lastTime;
            lastTime = time;

            if (delta > 0 && delta < 100) {
                accumulatedScroll += speed * delta;
                const scrollPixels = Math.floor(accumulatedScroll);
                if (scrollPixels > 0) {
                    accumulatedScroll -= scrollPixels;
                    window.scrollBy(0, scrollPixels);
                }
            }

            const scrollContainer = document.documentElement || document.body;
            const currentScroll = window.scrollY;
            const maxScroll = scrollContainer.scrollHeight - window.innerHeight;

            if (currentScroll < maxScroll - 3) {
                animationFrameId = requestAnimationFrame(scrollLoop);
            } else {
                setAutoScroll(false);
            }
        };

        const delayTimeout = setTimeout(() => {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(scrollLoop);
        }, 1000);

        return () => {
            clearTimeout(delayTimeout);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isOpened, autoScroll]);

    // Auto-scroll active bottom menu to center
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.sp04-nav-menu');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    const handleNavigate = (key) => {
        setAutoScroll(false);
        isNavigatingRef.current = true;
        activeSectionRef.current = key;
        setActiveSection(key);
        
        const el = document.getElementById(`section-${key}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        if (navigatingTimeoutRef.current) {
            clearTimeout(navigatingTimeoutRef.current);
        }
        navigatingTimeoutRef.current = setTimeout(() => {
            isNavigatingRef.current = false;
        }, 800);
    };

    // Audio Autoplay when Opened
    const handleOpenInvitation = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                // Autoplay blocked fallback
                setIsPlaying(false);
            });
        }

        // Auto Fullscreen as per guidelines
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // Fullscreen Change Listeners
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

    const toggleMusic = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {});
        }
    };

    // QR Presensi Trigger Availability
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;

    // Reseller or central dynamic branding watermark
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className={`sp04-theme ${!showAnimations ? 'theme-no-animations' : ''}`}>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan'}</title>
                <meta name="description" content={invitation?.cover_subtitle || 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.'} />
            </Head>

            {/* Custom Google Fonts Loader */}
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Niconne&display=swap" rel="stylesheet" />
            </Head>

            {/* Audio Ref */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={getStorageUrl(invitation.music_url, '/audio/backsound.mp3')} loop />
            )}

            {/* Mobile constraints container */}
            <div ref={containerRef} className="sp04-theme-container">
                {/* Particles Effect */}
                {invitation?.particle_type && invitation.particle_type !== 'none' && (
                    <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                        <ParticleEffect type={invitation.particle_type || 'rose-petals'} />
                    </div>
                )}

                {/* 1. COVER OVERLAY (Elementor ID satu) */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                    showPhotos={showPhotos}
                />

                {/* Main page content (Visible after Buka Undangan) */}
                {isOpened && (
                    <div className="flex flex-col w-full relative z-2">
                        {resolvedSections.map((sec) => {
                            const key = sec.section_key;
                            
                            return (
                                <ErrorBoundary key={sec.id || key}>
                                    <div id={`section-${key}`} className="w-full">
                                        {key === 'opening' && (
                                            <div>
                                                <OpeningSection
                                                    invitation={invitation}
                                                    showPhotos={showPhotos}
                                                    brideGrooms={brideGrooms}
                                                    events={events}
                                                    locale={locale}
                                                />
                                                <QuoteSection invitation={invitation} locale={locale} />
                                                
                                                <Reveal delay={200} className="w-full text-center my-6 px-4">
                                                    <p className="text-xs sm:text-sm leading-relaxed opacity-95 text-[var(--sp04-primary)] font-serif italic max-w-sm mx-auto select-none">
                                                        {invitation?.cover_subtitle || (isEn 
                                                            ? 'Without reducing respect, we cordially invite you to celebrate our marriage.' 
                                                            : 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda Untuk Berhadir Di Acara Pernikahan Kami.')}
                                                    </p>
                                                </Reveal>
                                            </div>
                                        )}

                                        {key === 'bride_groom' && (
                                            <BrideGroomSection
                                                brideGrooms={brideGrooms}
                                                locale={locale}
                                                showPhotos={showPhotos}
                                            />
                                        )}

                                        {key === 'event' && (
                                            <div>
                                                <EventSection
                                                    events={events}
                                                    locale={locale}
                                                    invitation={invitation}
                                                    sections={sections}
                                                />
                                                <GmapSection events={events} locale={locale} />
                                            </div>
                                        )}

                                        {key === 'love_story' && (
                                            <LoveStorySection loveStories={loveStories} />
                                        )}

                                        {key === 'gallery' && (
                                            <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                        )}

                                        {key === 'rsvp' && (
                                            <RsvpWishesSection
                                                invitation={invitation}
                                                wishes={wishes}
                                                locale={locale}
                                            />
                                        )}

                                        {key === 'bank' && (
                                            <BankSection bankAccounts={bankAccounts} locale={locale} />
                                        )}

                                        {key === 'closing' && (
                                            <div className="w-full flex flex-col items-center">
                                                <ClosingSection
                                                    invitation={invitation}
                                                    brideGrooms={brideGrooms}
                                                    locale={locale}
                                                />
                                                
                                                <div className="sp04-watermark select-none">
                                                    Made with ❤️ by <span className="font-bold text-[var(--sp04-primary)]">{brandName}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ErrorBoundary>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FLOATING ACTION CONTROL BUTTONS (High contrast overlay controls) */}
            {isOpened && (
                <div className="sp04-floating-controls">
                    {/* Auto Scroll Button */}
                    <button 
                        type="button" 
                        onClick={() => setAutoScroll(!autoScroll)} 
                        className={`sp04-control-btn ${autoScroll ? 'is-active' : ''}`}
                        title={autoScroll ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
                    >
                        {autoScroll ? (
                            <i className="fas fa-pause" />
                        ) : (
                            <i className="fas fa-arrows-up-down" />
                        )}
                    </button>

                    {/* QR Code Presensi Trigger */}
                    {enableQr && activeGuest && (
                        <button 
                            type="button" 
                            onClick={() => setShowQr(true)} 
                            className="sp04-control-btn"
                            title={isEn ? 'Show Check-in QR' : 'Tampilkan QR Presensi'}
                        >
                            <i className="fas fa-qrcode" />
                        </button>
                    )}

                    {/* Fullscreen Toggle */}
                    <button 
                        type="button" 
                        onClick={toggleFullscreen} 
                        className="sp04-control-btn"
                        title={isEn ? 'Toggle Screen Mode' : 'Ubah Mode Layar'}
                    >
                        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                    </button>

                    {/* Audio Toggle with Equalizer Animation */}
                    {invitation?.music_url && (
                        <button 
                            type="button" 
                            onClick={toggleMusic} 
                            className="sp04-control-btn"
                            title={isEn ? 'Toggle Background Music' : 'Mute/Unmute Musik'}
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
                </div>
            )}

            {/* Scoped Bottom Navigation Bar */}
            {isOpened && resolvedSections.length > 0 && (
                <nav className="sp04-nav-menu">
                    <div className="sp04-nav-menu__inner--row">
                        {resolvedSections.map(s => {
                            const key = s.section_key;
                            const isActive = activeSection === key;
                            
                            let icon = 'fas fa-heart';
                            if (key === 'opening') icon = 'far fa-envelope-open';
                            else if (key === 'bride_groom') icon = 'fas fa-user-friends';
                            else if (key === 'event') icon = 'far fa-calendar-alt';
                            else if (key === 'love_story') icon = 'fas fa-history';
                            else if (key === 'livestream') icon = 'fas fa-video';
                            else if (key === 'dresscode') icon = 'fas fa-shirt';
                            else if (key === 'video') icon = 'fas fa-play-circle';
                            else if (key === 'gallery') icon = 'far fa-images';
                            else if (key === 'rsvp') icon = 'fas fa-signature';
                            else if (key === 'bank') icon = 'far fa-credit-card';
                            else if (key === 'closing') icon = 'fas fa-paper-plane';

                            // Label translation
                            let labelText = s.section_name || key;
                            if (key === 'opening') { labelText = t('nav.pembuka') || 'Pembuka'; }
                            else if (key === 'bride_groom') { labelText = t('nav.mempelai') || 'Mempelai'; }
                            else if (key === 'event') { labelText = t('nav.acara') || 'Acara'; }
                            else if (key === 'love_story') { labelText = t('nav.kisah') || 'Kisah'; }
                            else if (key === 'gallery') { labelText = t('nav.galeri') || 'Galeri'; }
                            else if (key === 'livestream') { labelText = t('nav.streaming') || 'Siaran'; }
                            else if (key === 'bank') { labelText = t('nav.hadiah') || 'Hadiah'; }
                            else if (key === 'rsvp') { labelText = t('nav.rsvp') || 'RSVP'; }
                            else if (key === 'closing') { labelText = t('nav.penutup') || 'Penutup'; }

                            return (
                                <button
                                    key={key}
                                    id={`nav-btn-${key}`}
                                    type="button"
                                    onClick={() => handleNavigate(key)}
                                    className={`sp04-nav-menu__item ${isActive ? 'active' : ''}`}
                                    title={s.section_name}
                                >
                                    <i className={icon} />
                                    <span className="sp04-nav-item-text">{labelText}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}

            {/* QR CHECK-IN PRESENSI MODAL OVERLAY */}
            {isOpened && enableQr && showQr && activeGuest && (
                <div className="sp04-qr-modal" onClick={() => setShowQr(false)}>
                    <div className="sp04-qr-card" onClick={e => e.stopPropagation()}>
                        <button 
                            type="button" 
                            onClick={() => setShowQr(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                        >
                            <i className="fas fa-times" />
                        </button>

                        <h4 className="text-lg font-bold text-[var(--sp04-primary)] sp04-font-heading-style select-none">
                            QR Code Presensi
                        </h4>
                        <p className="text-xs text-[var(--sp04-text-muted)] mt-1 mb-6 max-w-[240px] mx-auto select-none">
                            {isEn 
                                ? 'Show this QR code to the receptionist for attendance entry.' 
                                : 'Tunjukkan QR code ini ke petugas penerima tamu untuk konfirmasi kehadiran.'}
                        </p>

                        <div className="sp04-qr-image-wrapper mb-4">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=c26e5f&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                alt="QR Code Presensi" 
                                className="w-48 h-48 rounded-xl object-contain select-none"
                            />
                        </div>

                        <p className="text-sm font-bold text-[var(--sp04-primary)]">
                            {activeGuest.name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
