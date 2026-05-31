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
        <div className="sp08-countdown-wrapper select-none">
            <div className="sp08-countdown">
                <div className="sp08-countdown-item">
                    <span className="sp08-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="sp08-countdown-label">{t('invitation.days')}</span>
                </div>
                <span className="sp08-countdown-colon">:</span>
                <div className="sp08-countdown-item">
                    <span className="sp08-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="sp08-countdown-label">{t('invitation.hours')}</span>
                </div>
                <span className="sp08-countdown-colon">:</span>
                <div className="sp08-countdown-item">
                    <span className="sp08-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="sp08-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <span className="sp08-countdown-colon">:</span>
                <div className="sp08-countdown-item">
                    <span className="sp08-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="sp08-countdown-label">{t('invitation.seconds')}</span>
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

    let baseClass = 'sp08-ani-hidden';
    let revealClass = 'sp08-ani-fadeUp';
    if (variant === 'zoom') {
        revealClass = 'sp08-ani-scaleIn';
    } else if (variant === 'left') {
        revealClass = 'sp08-ani-fadeLeft';
    } else if (variant === 'right') {
        revealClass = 'sp08-ani-fadeRight';
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
function FlowerSwirl({ title, subtitle }) {
    return (
        <div className="mb-8 flex flex-col items-center select-none text-center px-4">
            {title && (
                <h2 className="text-3.5xl sm:text-4xl text-[var(--sp08-secondary)] sp08-font-script leading-none mb-3">
                    {title}
                </h2>
            )}
            <div className="sp08-divider mb-3">
                <div className="sp08-divider-line" />
                <div className="sp08-divider-dot" />
                <div className="sp08-divider-line" />
            </div>
            {subtitle && (
                <p className="text-xs uppercase tracking-widest text-[var(--sp08-text-muted)] font-serif">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════
   SECTIONS IMPLEMENTATION
   ═══════════════════════════════════════ */

// 1. COVER SECTION
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showPhotos }) {
    const { t, locale } = useTranslation();
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || (isEn ? 'Dear Guest' : 'Tamu Undangan');

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Gilang & Kirana');

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className={`sp08-cover ${isOpened ? 'sp08-is-opened' : ''}`}>
            {/* Backdrop prewedding cover image */}
            {showPhotos && coverImages.length > 0 ? (
                <div className="sp08-cover__bg">
                    <img src={coverImages[0]} alt="Prewedding Cover" />
                </div>
            ) : (
                <div className="sp08-cover__bg bg-[#f5ebe0]" />
            )}
            
            <div className="sp08-cover__blur" />

            <div className="sp08-cover__content">
                <div>
                    <p className="text-[10px] tracking-[0.25em] font-semibold text-[var(--sp08-text-muted)] mb-2 uppercase select-none font-serif">
                        {invitation?.opening_title || 'Undangan Pernikahan'}
                    </p>
                    <h1 className="sp08-cover-names sp08-breathe">
                        {coupleName}
                    </h1>
                </div>

                <p className="text-xs font-semibold tracking-wider text-[var(--sp08-text-muted)] uppercase select-none font-serif leading-relaxed px-4">
                    {invitation?.cover_subtitle || (isEn 
                        ? 'Without reducing respect, we cordially invite you to celebrate our marriage.' 
                        : 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda Untuk Berhadir Di Acara Pernikahan Kami.')}
                </p>

                <div className="sp08-cover-guest-box my-4">
                    <p className="text-[10px] text-[var(--sp08-text-muted)] font-semibold uppercase tracking-widest mb-2 select-none">
                        {isEn ? 'Dear Guest' : 'Kpd Bpk/Ibu/Saudara/i :'}
                    </p>
                    <p className="text-md font-bold text-[var(--sp08-text-dark)] tracking-wide mb-1.5 leading-snug">
                        {guestName}
                    </p>
                    <p className="text-[9px] text-[var(--sp08-text-muted)] font-semibold uppercase tracking-wider select-none leading-relaxed">
                        *Mohon maaf bilamana ada kesalahan penulisan Nama/Gelar
                    </p>
                </div>

                <button type="button" onClick={onOpen} className="sp08-btn-buka">
                    {t('invitation.open') || 'Buka Undangan'}
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

    return (
        <div className="sp08-section sp08-opening-section w-full text-center">
            <Reveal variant="zoom" className="sp08-wellcome2-card">
                {showPhotos && openingImages.length > 0 ? (
                    <div className="sp08-wellcome2-bg">
                        <img src={openingImages[0]} alt="Wellcome prewedding image" />
                    </div>
                ) : (
                    <div className="sp08-wellcome2-bg bg-[#f5ebe0]" />
                )}
                
                <div className="sp08-wellcome2-overlay" />

                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-[10px] tracking-[0.2em] font-bold text-[var(--sp08-text-muted)] uppercase select-none mb-2 font-serif">
                        Undangan Pernikahan
                    </p>
                    
                    <h2 className="text-5xl text-[var(--sp08-text-dark)] sp08-font-couple leading-none mb-3">
                        {groom.nickname || 'Gilang'} &amp; {bride.nickname || 'Kirana'}
                    </h2>
                    
                    <p className="text-xs font-bold text-[var(--sp08-text-muted)] tracking-widest uppercase mb-6 select-none font-serif">
                        {invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date, locale) : 'Sabtu, 12 Desember 2026'}
                    </p>

                    {targetDate && (
                        <CountdownTimer targetDate={targetDate} />
                    )}

                    <button 
                        type="button" 
                        onClick={() => {
                            const target = invitation?.countdown_target_date ? new Date(invitation.countdown_target_date) : new Date('2026-12-12T09:00:00');
                            const ds = target.toISOString().substring(0, 10).replace(/-/g, '');
                            const names = `${groom.nickname || 'Gilang'} & ${bride.nickname || 'Kirana'}`;
                            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + names)}&dates=${ds}T090000/${ds}T160000&sf=true&output=xml`;
                            window.open(url, '_blank');
                        }} 
                        className="sp08-btn-save-date mt-6"
                    >
                        {t('invitation.save_the_date') || 'Save The Date'}
                    </button>
                </div>
            </Reveal>
        </div>
    );
}

// 3. BRIDE & GROOM PROFILE SECTION (Rotated Elsie Swash Caps headers)
function BrideGroomSection({ brideGrooms, locale, showPhotos }) {
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
        else if (raw.includes('4') || raw.includes('keempat') || raw.includes('fourth')) matchedKey = '4';
        else return childOrder;
        
        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' },
            '2': { id: 'Kedua', en: 'Second' },
            '4': { id: 'Keempat', en: 'Fourth' },
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
        <div className="sp08-section sp08-mempelai-section text-center">
            <Reveal className="max-w-xs mx-auto mb-12">
                <p className="text-xs leading-relaxed text-[var(--sp08-text-muted)] font-semibold select-none">
                    {isEn 
                        ? '“Glorified is Allah SWT who created all creatures in pairs. Ya Allah, approve and bless our children:”'
                        : 'Assalamualaikum Wr. Wb. Maha Suci Allah SWT yang telah menciptakan makhlukNya berpasang-pasangan. Ya Allah, perkenankanlah dan Ridhoilah putra-putri kami :'}
                </p>
            </Reveal>

            <div className="space-y-16">
                {/* Groom Profile */}
                <div className="flex flex-col items-center">
                    <Reveal variant="left" className="sp08-profile-card w-full max-w-sm mb-5">
                        <div className="sp08-profile-sideways-banner">
                            <span className="sp08-profile-sideways-title">
                                Mempelai Pria
                            </span>
                        </div>
                        <div className="sp08-profile-image-wrapper">
                            <img 
                                src={getStorageUrl(groom.photo, '/images/demo/korea-8.jpg')} 
                                alt={groom.full_name || 'Gilang'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                    transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                    </Reveal>
                    
                    <Reveal>
                        <h3 className="text-3xl font-bold text-[var(--sp08-secondary)] sp08-font-script leading-none">
                            {groom.full_name || 'Gilang Nugroho, SE'}
                        </h3>
                        <p className="text-xs text-[var(--sp08-text-muted)] font-semibold mt-2.5 max-w-xs px-4">
                            {translateChildOrder(groom.child_order, 'pria')}{' '}
                            <span className="font-bold text-[var(--sp08-secondary)] uppercase">
                                {groom.father_name && groom.mother_name 
                                    ? `${groom.father_name} & ${groom.mother_name}` 
                                    : 'Bapak Doddy Gunawan & Ibu Mega Uti'}
                            </span>
                        </p>
                        {groom.instagram && (
                            <a 
                                href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="sp08-btn-ig-circle mt-3"
                            >
                                <i className="fab fa-instagram" />
                            </a>
                        )}
                    </Reveal>
                </div>

                <Reveal variant="zoom" className="w-full flex items-center justify-center gap-6 my-4 select-none">
                    <div className="h-0.5 bg-gray-300 w-20 opacity-50" />
                    <span className="text-[var(--sp08-secondary)] text-md"><i className="far fa-heart" /></span>
                    <div className="h-0.5 bg-gray-300 w-20 opacity-50" />
                </Reveal>

                {/* Bride Profile */}
                <div className="flex flex-col items-center">
                    <Reveal variant="right" className="sp08-profile-card w-full max-w-sm mb-5">
                        <div className="sp08-profile-image-wrapper">
                            <img 
                                src={getStorageUrl(bride.photo, '/images/demo/korea-3.jpg')} 
                                alt={bride.full_name || 'Kirana'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                    transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                        <div className="sp08-profile-sideways-banner">
                            <span className="sp08-profile-sideways-title">
                                Mempelai Wanita
                            </span>
                        </div>
                    </Reveal>
                    
                    <Reveal>
                        <h3 className="text-3xl font-bold text-[var(--sp08-secondary)] sp08-font-script leading-none">
                            {bride.full_name || 'Kirana Larasati, SH'}
                        </h3>
                        <p className="text-xs text-[var(--sp08-text-muted)] font-semibold mt-2.5 max-w-xs px-4">
                            {translateChildOrder(bride.child_order, 'wanita')}{' '}
                            <span className="font-bold text-[var(--sp08-secondary)] uppercase">
                                {bride.father_name && bride.mother_name 
                                    ? `${bride.father_name} & ${bride.mother_name}` 
                                    : 'Bapak Putra Fahri & Ibu Khani Ratna'}
                            </span>
                        </p>
                        {bride.instagram && (
                            <a 
                                href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="sp08-btn-ig-circle mt-3"
                            >
                                <i className="fab fa-instagram" />
                            </a>
                        )}
                    </Reveal>
                </div>
            </div>
        </div>
    );
}

// 4. EVENTS SECTION
function EventSection({ events, locale, invitation }) {
    const list = safeArr(events);
    const isEn = locale === 'en';

    return (
        <div className="sp08-section sp08-event-section text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Wedding Events' : 'Momen Bahagia'} subtitle={isEn ? 'Date & Venue Details' : 'Rincian Acara Pernikahan'} />
            </Reveal>

            <div className="space-y-8 mt-6">
                {list.map((evt, idx) => {
                    const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Resepsi Nikah');
                    const sidewaysName = evt.event_type === 'akad' ? 'AKAD' : 'RESEPSI';
                    const isEven = idx % 2 === 0;

                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date, locale);

                    return (
                        <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="sp08-event-editorial-card">
                            {isEven && (
                                <div className="sp08-event-sideways-banner">
                                    <span className="sp08-event-sideways-title">{sidewaysName}</span>
                                </div>
                            )}

                            <div className="sp08-event-content-details text-left flex flex-col justify-between">
                                <div>
                                    <h4 className="text-xl font-bold uppercase tracking-wider text-[var(--sp08-text-dark)] font-serif border-b border-[var(--sp08-secondary)]/20 pb-2 mb-3">
                                        {eventDisplayName}
                                    </h4>

                                    <div className="flex items-center gap-4 mb-4 select-none">
                                        <div className="bg-[var(--sp08-secondary)] text-white px-3.5 py-1.5 rounded-lg flex flex-col items-center">
                                            <span className="text-lg font-bold leading-none">{dayNum}</span>
                                            <span className="text-[9px] uppercase tracking-wide font-semibold mt-1 opacity-90">{monthName.substring(0, 3)}</span>
                                        </div>
                                        <div className="text-xs text-[var(--sp08-text-muted)] font-semibold">
                                            <p className="text-[var(--sp08-text-dark)] uppercase tracking-wide font-bold">{dayName}</p>
                                            <p>{year}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm font-semibold text-[var(--sp08-text-dark)] mb-4 font-serif">
                                        {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : (isEn ? ' - End' : ' - Selesai')} {evt.timezone || 'WIB'}
                                    </p>

                                    <div className="text-xs leading-relaxed text-[var(--sp08-text-muted)] mb-5 font-semibold">
                                        <p className="font-bold text-sm mb-1 text-[var(--sp08-secondary)] uppercase tracking-wide">
                                            {evt.venue_name || (evt.event_type === 'akad' ? 'Masjid Raya Depok' : 'Pondok Gurame')}
                                        </p>
                                        <p className="opacity-90">{evt.venue_address || 'Jl. Margonda Raya / Jl. Pemuda, Depok'}</p>
                                    </div>
                                </div>

                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sp08-btn-map self-start"
                                    >
                                        <i className="fas fa-map-marker-alt" /> {isEn ? 'Directions' : 'Petunjuk Lokasi'}
                                    </a>
                                )}
                            </div>

                            {!isEven && (
                                <div className="sp08-event-sideways-banner">
                                    <span className="sp08-event-sideways-title">{sidewaysName}</span>
                                </div>
                            )}
                        </Reveal>
                    );
                })}

                                {/* Compact standalone Dress Code box below event list */}
                                {list?.filter(evt => evt.show_dress_code).map((evt, idx) => (
                                    <div key={`dc-${idx}`} className="sp08-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={evt} colors={{ primary: '#b39464', text: '#2d2d2d' }} fonts={{ heading: 'inherit' }} variant="modern" plain={true} />
                                    </div>
                                ))}
            </div>

            <Reveal className="text-center mt-12 px-6">
                <p className="text-xs leading-relaxed text-[var(--sp08-text-muted)] select-none font-medium italic">
                    {isEn 
                        ? '“An honor and great pleasure for us if you could attend to celebrate our holy union”' 
                        : '“Suatu kehormatan bagi kami, apabila bapak, ibu, Saudara/i berkenan hadir dalam acara pernikahan kami”'}
                </p>
            </Reveal>
        </div>
    );
}

// 5. LOVE STORY / JOURNEY TIMELINE
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    if (list.length === 0) return null;

    return (
        <div className="sp08-section sp08-timeline-section">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} subtitle="Our Journey Together" />
            </Reveal>

            <div className="sp08-timeline mt-8">
                {list.map((story, i) => (
                    <Reveal key={story.id || i} variant={i % 2 === 0 ? 'left' : 'right'} className="sp08-timeline-item">
                        <div className="sp08-story-card">
                            <span className="sp08-story-year">
                                {story.story_date ? new Date(story.story_date).getFullYear() : story.year || '2025'}
                            </span>
                            <h4 className="text-md font-bold text-[var(--sp08-secondary)] sp08-font-script tracking-wide mb-1.5">
                                {story.title}
                            </h4>
                            <p className="text-xs leading-relaxed opacity-90 text-[var(--sp08-text-dark)] font-medium">
                                {story.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 6. GALLERY SECTION
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="sp08-section sp08-gallery-section">
            <Reveal>
                <FlowerSwirl title={t('nav.galeri')} subtitle="Prewedding Moments" />
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
                            <img src={imgUrl} alt={item.caption || 'Gallery prewedding'} className="sp08-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

// 7. unified RSVP & WISHES SECTION
function RsvpWishesSection({ invitation, wishes, locale }) {
    const wishesInputRef = React.useRef(null);
    const isEn = locale === 'en';
    
    const [wishesList, setWishesList] = useState(safeArr(wishes));

    const { data, setData, post, processing, reset } = useForm({
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
                if (data.message) {
                    post(route('invitation.submit-wish', { slug: invitation.slug }), {
                        preserveScroll: true,
                        onSuccess: () => {
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
        <div className="sp08-section sp08-rsvp-section" id="rsvp">
            <Reveal>
                <FlowerSwirl title={isEn ? 'RSVP Confirmation' : 'Konfirmasi Kehadiran'} subtitle={isEn ? 'Kindly respond to our invite' : 'Kirim Doa Restu & Konfirmasi Kehadiran'} />
            </Reveal>

            <Reveal variant="zoom" className="sp08-rsvp-card p-6 mt-6">
                {formSubmitted ? (
                    <div className="py-8 text-center select-none">
                        <i className="fas fa-check-circle text-4xl text-[var(--sp08-secondary)] mb-3" />
                        <h4 className="text-lg font-bold text-[var(--sp08-secondary)]">
                            {isEn ? 'Thank You!' : 'Terima Kasih!'}
                        </h4>
                        <p className="text-xs text-[var(--sp08-text-muted)] mt-1">
                            {isEn ? 'Your attendance has been confirmed.' : 'Konfirmasi dan ucapan Anda telah berhasil terkirim.'}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--sp08-text-muted)] mb-1 select-none">
                                {isEn ? 'Your Name' : 'Nama Lengkap'}
                            </label>
                            <input 
                                type="text"
                                required
                                value={data.sender_name}
                                onChange={e => setData('sender_name', e.target.value)}
                                className="sp08-input" 
                                placeholder={isEn ? 'Enter your full name' : 'Masukkan nama lengkap Anda'}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--sp08-text-muted)] mb-1 select-none">
                                {isEn ? 'Will You Attend?' : 'Konfirmasi Kehadiran'}
                            </label>
                            <select 
                                value={data.attendance}
                                onChange={e => setData('attendance', e.target.value)}
                                className="sp08-input"
                            >
                                <option value="hadir">{isEn ? 'Yes, I Will Attend' : 'Ya, Saya Akan Hadir'}</option>
                                <option value="tidak_hadir">{isEn ? 'No, I Cannot Attend' : 'Maaf, Saya Tidak Bisa Hadir'}</option>
                            </select>
                        </div>

                        {data.attendance === 'hadir' && (
                            <div>
                                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--sp08-text-muted)] mb-1 select-none">
                                    {isEn ? 'Number of Guests' : 'Jumlah Orang'}
                                </label>
                                <input 
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.number_of_guests}
                                    onChange={e => setData('number_of_guests', parseInt(e.target.value) || 1)}
                                    className="sp08-input"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--sp08-text-muted)] mb-1 select-none">
                                {isEn ? 'Wedding Wishes' : 'Doa Restu / Ucapan'}
                            </label>
                            <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef} 
                                rows="3"
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                className="sp08-input" 
                                placeholder={isEn ? 'Write your warm wishes here' : 'Tuliskan pesan doa & ucapan selamat Anda di sini'}
                            />
                                </WishesEmojiPicker>
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="sp08-btn-submit"
                        >
                            {processing ? (isEn ? 'Submitting...' : 'Mengirim...') : (isEn ? 'Confirm Attendance' : 'Konfirmasi')}
                        </button>
                    </form>
                )}
            </Reveal>

            {/* Scrollable list of wishes */}
            {wishesList.length > 0 && (
                <Reveal className="mt-12 text-left">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--sp08-text-muted)] mb-4 select-none text-center">
                        {isEn ? 'Wishes from Friends' : 'Doa & Ucapan Teman'}
                    </h4>
                    
                    <div className="sp08-wishes-box space-y-3">
                        {wishesList.slice(0, 5).map(wish => (
                            <div key={wish.id} className="sp08-wish-item">
                                <p className="text-xs font-bold text-[var(--sp08-secondary)] tracking-wide mb-1 leading-snug">
                                    {wish.sender_name}
                                </p>
                                <p className="text-xs text-[var(--sp08-text-muted)] leading-relaxed italic">
                                    “{wish.message}”
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            )}
        </div>
    );
}

// 8. DIGITAL KADO / BANK SECTION
function BankSection({ bankAccounts, locale }) {
    const list = safeArr(bankAccounts);
    const isEn = locale === 'en';
    const [copiedIndex, setCopiedIndex] = useState(null);

    if (list.length === 0) return null;

    const handleCopy = (accNum, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(accNum)
                .then(() => {
                    setCopiedIndex(idx);
                    setTimeout(() => setCopiedIndex(null), 2000);
                })
                .catch(() => {
                    fallbackCopy(accNum);
                    setCopiedIndex(idx);
                    setTimeout(() => setCopiedIndex(null), 2000);
                });
        } else {
            fallbackCopy(accNum);
            setCopiedIndex(idx);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    return (
        <div className="sp08-section sp08-bank-section text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Digital Envelope' : 'Kado Digital'} subtitle={isEn ? 'Wedding Gift & Bank Transfer' : 'Salurkan Tanda Kasih & Hadiah Digital'} />
            </Reveal>

            <div className="space-y-6 mt-6">
                {list.map((bank, idx) => (
                    <Reveal key={bank.id || idx} variant="zoom" className="sp08-bank-card flex flex-col items-center">
                        <div className="text-xs font-bold uppercase tracking-wider text-[var(--sp08-secondary)] mb-2 select-none">
                            {bank.bank_name || 'BCA'}
                        </div>
                        
                        <div className="text-md font-bold text-[var(--sp08-text-dark)] tracking-widest mb-1.5 select-all">
                            {bank.account_number}
                        </div>
                        
                        <div className="text-[10px] uppercase font-semibold text-[var(--sp08-text-muted)] mb-4 select-none">
                            {isEn ? 'A/N ' : 'Atas Nama: '}{bank.account_name}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleCopy(bank.account_number, idx)}
                            className="sp08-btn-copy"
                        >
                            <i className="far fa-copy mr-1.5" />
                            {copiedIndex === idx ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy Account' : 'Salin Rekening')}
                        </button>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 9. CLOSING SECTION
function ClosingSection({ invitation, brideGrooms, locale }) {
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className="sp08-closing-section">
            <Reveal variant="zoom">
                <FlowerSwirl title="Terima Kasih" subtitle={isEn ? 'Thank You for Blessing Us' : 'Doa Restu Anda Adalah Berkat Kami'} />
            </Reveal>

            <Reveal className="max-w-xs mx-auto mb-8">
                <p className="text-xs leading-relaxed opacity-90 select-none">
                    {invitation?.closing_text || (isEn 
                        ? 'It is an honor and a great happiness for us if you could attend to give your blessings.'
                        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.')}
                </p>
            </Reveal>

            <Reveal className="text-center font-bold font-serif uppercase tracking-widest text-[var(--sp08-secondary)] mb-4 leading-relaxed text-sm">
                <p className="mb-2 select-none">{isEn ? 'We who celebrate:' : 'Kami Yang Berbahagia,'}</p>
                <p className="text-lg font-bold sp08-font-script text-[var(--sp08-text-dark)] lowercase">
                    {groom.nickname || 'Gilang'} &amp; {bride.nickname || 'Kirana'}
                </p>
            </Reveal>

            {/* Families signature names */}
            <Reveal className="text-[10px] text-[var(--sp08-text-muted)] font-semibold tracking-wider uppercase space-y-1 my-6 select-none">
                {groom.father_name && groom.mother_name && (
                    <p>{isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Kel. Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}</p>
                )}
                {bride.father_name && bride.mother_name && (
                    <p>{isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Kel. Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}</p>
                )}
            </Reveal>

            <p className="sp08-watermark">
                Made with ❤️ by {brandName}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT INDEX
   ═══════════════════════════════════════ */
export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, guest, wishes }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    
    // States
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

    // Audio vis hooks integration
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;
    const showPhotos = parseBool(invitation?.show_photos, true) && !parseBool(invitation?.hide_photos, false);
    const showAnimations = parseBool(invitation?.show_animations, true);

    // Set globally to synchronize Entrance reveals
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // Fullscreen listeners
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    const handleOpenInvitation = () => {
        setIsOpened(true);
        // Play music
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        // Fullscreen trigger
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // Filter section visibility
    const resolvedSections = useMemo(() => {
        const dbSections = safeArr(sections);
        
        if (dbSections.length === 0) {
            // default orders
            return [
                { section_key: 'cover' },
                { section_key: 'opening' },
                { section_key: 'bride_groom' },
                { section_key: 'event' },
                { section_key: 'love_story' },
                { section_key: 'gallery' },
                { section_key: 'rsvp' },
                { section_key: 'bank' },
                { section_key: 'closing' }
            ];
        }
        return dbSections
            .filter(sec => {
                if (!sec.is_visible) return false;
                if (sec.section_key === 'gallery' && !showPhotos) return false;
                if (sec.section_key === 'wishes') return false; // RSVP unified, prevents duplicate wishes section
                return true;
            })
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }, [sections, showPhotos]);

    return (
        <ErrorBoundary>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan'}</title>
                <meta name="description" content={invitation?.cover_subtitle || 'Undangan Pernikahan Digital Premium'} />
            </Head>

            <div className={`sp08-wrapper select-text ${!showAnimations ? 'theme-no-animations' : ''}`}>
                
                {/* Background music backsound player */}
                <audio 
                    ref={audioRef}
                    src={getStorageUrl(invitation?.music_url, '/audio/backsound.mp3')}
                    loop
                />

                {/* Floating controls panel */}
                {isOpened && (
                    <div className="sp08-floating-controls">
                        {/* Music Player with wave equalizer */}
                        <button type="button" onClick={toggleMusic} className="sp08-btn-floating">
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

                        {/* Fullscreen control */}
                        <button type="button" onClick={toggleFullscreen} className="sp08-btn-floating">
                            {isFullscreen ? (
                                <i className="fas fa-compress" />
                            ) : (
                                <i className="fas fa-expand" />
                            )}
                        </button>

                        {/* QR checkin code */}
                        {enableQr && activeGuest && (
                            <button type="button" onClick={() => setShowQr(true)} className="sp08-btn-floating">
                                <i className="fas fa-qrcode" />
                            </button>
                        )}
                    </div>
                )}

                {/* 1. COVER SECTION */}
                <CoverSection 
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                    showPhotos={showPhotos}
                />

                {/* Render pages sections dynamically */}
                {isOpened && resolvedSections.map(section => {
                    const key = section.section_key;

                    if (key === 'opening') {
                        return (
                            <OpeningSection 
                                key={key}
                                invitation={invitation}
                                showPhotos={showPhotos}
                                brideGrooms={brideGrooms}
                                events={events}
                                locale={locale}
                            />
                        );
                    }

                    if (key === 'bride_groom') {
                        return (
                            <BrideGroomSection 
                                key={key}
                                brideGrooms={brideGrooms}
                                locale={locale}
                                showPhotos={showPhotos}
                            />
                        );
                    }

                    if (key === 'event') {
                        return (
                            <EventSection 
                                key={key}
                                events={events}
                                locale={locale}
                                invitation={invitation}
                            />
                        );
                    }

                    if (key === 'love_story') {
                        return (
                            <LoveStorySection 
                                key={key}
                                loveStories={loveStories}
                            />
                        );
                    }

                    if (key === 'gallery') {
                        return (
                            <GallerySection 
                                key={key}
                                galleries={galleries}
                                showPhotos={showPhotos}
                            />
                        );
                    }

                    if (key === 'rsvp') {
                        return (
                            <RsvpWishesSection 
                                key={key}
                                invitation={invitation}
                                wishes={wishes}
                                locale={locale}
                            />
                        );
                    }

                    if (key === 'bank') {
                        return (
                            <BankSection 
                                key={key}
                                bankAccounts={bankAccounts}
                                locale={locale}
                            />
                        );
                    }

                    if (key === 'closing') {
                        return (
                            <ClosingSection 
                                key={key}
                                invitation={invitation}
                                brideGrooms={brideGrooms}
                                locale={locale}
                            />
                        );
                    }

                    return null;
                })}

                {/* Presence QR overlay Modal */}
                {enableQr && showQr && activeGuest && (
                    <div className="sp08-qr-overlay" onClick={() => setShowQr(false)}>
                        <div className="sp08-qr-modal" onClick={e => e.stopPropagation()}>
                            <h3 className="text-md font-bold text-[var(--sp08-text-dark)] select-none">
                                {locale === 'en' ? 'Presence QR Code' : 'QR Presensi Anda'}
                            </h3>
                            <p className="text-[10px] text-[var(--sp08-text-muted)] mt-1 px-4 leading-relaxed select-none">
                                {locale === 'en' 
                                    ? 'Show this QR code to the reception desk for instant presence check-in.' 
                                    : 'Tunjukkan QR code ini ke penerima tamu untuk check-in kehadiran instan.'}
                            </p>

                            <div className="sp08-qr-image-wrapper select-none">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=ab956a&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                    alt="QR Presence Check-In" 
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <p className="text-sm font-bold tracking-wide text-[var(--sp08-secondary)]">
                                {activeGuest.name}
                            </p>

                            <button 
                                type="button" 
                                onClick={() => setShowQr(false)} 
                                className="sp08-qr-close-btn"
                            >
                                {locale === 'en' ? 'Close' : 'Tutup'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Simulated Plan Selector Floating Widget */}
                {isDemo && subscriptionPlans && (
                    <DemoPlanSelector 
                        plans={subscriptionPlans}
                        selectedPlanSlug={simulatedPlanSlug}
                        onChangePlan={setSimulatedPlanSlug}
                    />
                )}

            </div>
        </ErrorBoundary>
    );
}
