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
        <div className="sp06-countdown-wrapper select-none">
            <div className="sp06-countdown">
                <div className="sp06-countdown-item">
                    <span className="sp06-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="sp06-countdown-label">{t('invitation.days')}</span>
                </div>
                <span className="sp06-countdown-colon">:</span>
                <div className="sp06-countdown-item">
                    <span className="sp06-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="sp06-countdown-label">{t('invitation.hours')}</span>
                </div>
                <span className="sp06-countdown-colon">:</span>
                <div className="sp06-countdown-item">
                    <span className="sp06-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="sp06-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <span className="sp06-countdown-colon">:</span>
                <div className="sp06-countdown-item">
                    <span className="sp06-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="sp06-countdown-label">{t('invitation.seconds')}</span>
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

    let baseClass = 'sp06-ani-hidden';
    let revealClass = 'sp06-ani-fadeUp';
    if (variant === 'zoom') {
        revealClass = 'sp06-ani-scaleIn';
    } else if (variant === 'left') {
        revealClass = 'sp06-ani-fadeLeft';
    } else if (variant === 'right') {
        revealClass = 'sp06-ani-fadeRight';
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
                <h2 className="text-3xl sm:text-4xl text-[var(--sp06-primary)] sp06-font-heading-style leading-none mb-3">
                    {title}
                </h2>
            )}
            <div className="sp06-divider">
                <div className="sp06-divider-line" />
                <div className="sp06-divider-dot" />
                <div className="sp06-divider-line" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SECTIONS IMPLEMENTATION
   ═══════════════════════════════════════ */

// 1. COVER SECTION (Elementor ID Atas & wellcome)
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
        <div className={`sp06-cover ${isOpened ? 'sp06-is-opened' : ''}`}>
            {/* Visual background image with blur & saturation filters */}
            {showPhotos && coverImages.length > 0 ? (
                <div className="sp06-cover__bg">
                    <img src={coverImages[0]} alt="Prewedding Cover Background" />
                </div>
            ) : (
                <div className="sp06-cover__bg bg-[#484847]" />
            )}
            
            {/* Dark tinted glass overlay */}
            <div className="sp06-cover__blur" />

            <div className="sp06-cover__content">
                {/* Title heading */}
                <div>
                    <p className="text-[10px] tracking-[0.25em] font-semibold text-white/80 mb-2 uppercase select-none font-serif">
                        {invitation?.opening_title || 'The Wedding Of'}
                    </p>
                    <h1 className="sp06-cover-names sp06-breathe">
                        {coupleName}
                    </h1>
                </div>

                {/* Guest Box */}
                <div className="sp06-cover-guest-box my-4">
                    <p className="text-[10px] text-white/70 font-semibold tracking-widest mb-2 select-none">
                        {isEn ? 'Dear Guest' : 'Kepada Yth. Bapak/Ibu/Saudara/i :'}
                    </p>
                    <p className="text-md font-bold text-white tracking-wide mb-1 leading-snug">
                        {guestName}
                    </p>
                    <p className="text-[9px] text-white/60 font-semibold uppercase tracking-wider select-none">
                        *Mohon maaf bilamana ada kesalahan penulisan Nama/Gelar
                    </p>
                </div>

                {/* Open Button */}
                <button type="button" onClick={onOpen} className="sp06-btn-buka">
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
        <div className="sp06-opening-section w-full text-center">
            {/* wellcome 2 Card overlay */}
            <Reveal variant="zoom" className="sp05-wellcome2-card">
                {showPhotos && openingImages.length > 0 ? (
                    <div className="sp05-wellcome2-bg">
                        <img src={openingImages[0]} alt="Wellcome prewedding image" />
                    </div>
                ) : (
                    <div className="sp05-wellcome2-bg bg-[#282828]" />
                )}
                
                {/* dark gradient overlay */}
                <div className="sp05-wellcome2-overlay" />

                {/* Elegant Corner Ornaments */}
                <div className="sp06-corner-ornament sp06-corner-top-left" />
                <div className="sp06-corner-ornament sp06-corner-top-right" />
                <div className="sp06-corner-ornament sp06-corner-bottom-left" />
                <div className="sp06-corner-ornament sp06-corner-bottom-right" />

                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-[10px] tracking-[0.2em] font-bold text-white/80 uppercase select-none mb-2 font-serif">
                        Undangan Pernikahan
                    </p>
                    
                    <h2 className="text-5xl text-white sp06-font-heading-style leading-none mb-3">
                        {groom.nickname || 'Gilang'} &amp; {bride.nickname || 'Kirana'}
                    </h2>
                    
                    <p className="text-xs font-bold text-[#f5f5f5] tracking-widest uppercase mb-6 select-none font-serif">
                        {invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date, locale) : 'Sabtu, 12 Desember 2026'}
                    </p>

                    {/* Integrated countdown timer */}
                    {targetDate && (
                        <CountdownTimer targetDate={targetDate} targetTime={primaryEvent?.start_time || ''} />
                    )}

                    <button 
                        type="button" 
                        onClick={() => {
                            const target = invitation?.countdown_target_date ? new Date(String(invitation.countdown_target_date).substring(0, 10) + 'T12:00:00') : new Date('2026-12-12T08:00:00');
                            const ds = target.toISOString().substring(0, 10).replace(/-/g, '');
                            const names = `${groom.nickname || 'Gilang'} & ${bride.nickname || 'Kirana'}`;
                            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + names)}&dates=${ds}T080000/${ds}T170000&sf=true&output=xml`;
                            window.open(url, '_blank');
                        }} 
                        className="sp06-btn-save-date mt-6"
                    >
                        {t('invitation.save_the_date') || 'Save The Date'}
                    </button>
                </div>
            </Reveal>
        </div>
    );
}

function QuoteSection({ invitation, locale }) {
    const isEn = locale === 'en';
    const quoteText = invitation?.opening_ayat || (isEn 
        ? "And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them, and He has put love and mercy between your (hearts): handy in that are Signs for those who reflect."
        : "Dan diantara tanda-tanda kekuasaanNya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikanNya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir."
    );
    const quoteSource = invitation?.opening_ayat_source || (isEn ? "Surah Ar-Rum: 21" : "Qs. Ar-Rum: 21");

    return (
        <div className="w-full py-16 px-6 text-center bg-[#282828] text-white my-8 rounded-3xl relative overflow-hidden select-none">
            <Reveal variant="fade">
                <i className="fas fa-quote-left text-3xl opacity-20 text-[var(--sp06-accent)] mb-4 block" />
                <p className="italic text-sm leading-relaxed max-w-xs mx-auto text-white/90">
                    &ldquo;{quoteText}&rdquo;
                </p>
                <p className="font-semibold text-xs tracking-wider uppercase mt-4 text-[var(--sp06-accent)]">
                    — {quoteSource}
                </p>
            </Reveal>
        </div>
    );
}

// 3. BRIDE & GROOM PROFILE SECTION (Sideways rotated headings & Greyscale photos)
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
        <div className="sp06-mempelai-section text-center">
            {/* Introductory sentence */}
            <Reveal className="max-w-xs mx-auto mb-12">
                <p className="text-xs leading-relaxed text-[var(--sp06-text-muted)] font-semibold select-none">
                    {isEn 
                        ? '“Glorified is Allah SWT who created all creatures in pairs. Ya Allah, approve and bless our children:”'
                        : 'Assalamualaikum Wr. Wb. Maha Suci Allah SWT yang telah menciptakan makhlukNya berpasang-pasangan. Ya Allah, perkenankanlah dan Ridhoilah putra-putri kami :'}
                </p>
            </Reveal>

            <div className="space-y-16">
                {/* Groom Profile Editorial Card */}
                <div className="flex flex-col items-center">
                    <Reveal variant="left" className="sp06-profile-card w-full max-w-sm mb-4">
                        <div className="sp06-profile-sideways-banner">
                            <span className="sp06-profile-sideways-title">
                                Pria Mempelai
                            </span>
                        </div>
                        <div className="sp06-profile-image-wrapper">
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
                        <h3 className="text-3xl font-bold text-[var(--sp06-primary)] sp06-font-heading-style leading-none">
                            {groom.full_name || 'Gilang Nugroho, SE'}
                        </h3>
                        <p className="text-xs text-[var(--sp06-text-muted)] font-semibold mt-2 max-w-xs px-4">
                            {translateChildOrder(groom.child_order, 'pria')}{' '}
                            <span className="font-bold text-[var(--sp06-primary)] uppercase">
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
                                className="sp06-btn-ig-circle mt-3"
                            >
                                <i className="fab fa-instagram" />
                            </a>
                        )}
                    </Reveal>
                </div>

                {/* Divider heart in between */}
                <Reveal variant="zoom" className="w-full flex items-center justify-center gap-6 my-4 select-none">
                    <div className="h-0.5 bg-gray-300 w-20 opacity-50" />
                    <span className="text-[var(--sp06-secondary)] text-md"><i className="far fa-heart" /></span>
                    <div className="h-0.5 bg-gray-300 w-20 opacity-50" />
                </Reveal>

                {/* Bride Profile Editorial Card */}
                <div className="flex flex-col items-center">
                    <Reveal variant="right" className="sp06-profile-card w-full max-w-sm mb-4">
                        <div className="sp06-profile-image-wrapper">
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
                        <div className="sp06-profile-sideways-banner">
                            <span className="sp06-profile-sideways-title">
                                Wanita Mempelai
                            </span>
                        </div>
                    </Reveal>
                    
                    <Reveal>
                        <h3 className="text-3xl font-bold text-[var(--sp06-primary)] sp06-font-heading-style leading-none">
                            {bride.full_name || 'Kirana Larasati, SH'}
                        </h3>
                        <p className="text-xs text-[var(--sp06-text-muted)] font-semibold mt-2 max-w-xs px-4">
                            {translateChildOrder(bride.child_order, 'wanita')}{' '}
                            <span className="font-bold text-[var(--sp06-primary)] uppercase">
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
                                className="sp06-btn-ig-circle mt-3"
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

// 4. EVENTS & DYNAMIC MAPS SECTION (With high-contrast background slideshows)
function EventSection({ events, locale, invitation, showPhotos }) {
    const list = safeArr(events);
    const isEn = locale === 'en';

    const eventImages = useMemo(() => {
        // Collect prewedding galleries or fallbacks for backdrop slideshow
        const galleriesList = ['/images/demo/korea-11-768x512.jpg', '/images/demo/korea-7-768x512.jpg', '/images/demo/korea-12-768x512.jpg'];
        return galleriesList;
    }, []);

    const formattedDate = useMemo(() => {
        if (!invitation?.countdown_target_date) return 'Sabtu, 21 Juni 2023';
        return formatDate(invitation.countdown_target_date, locale);
    }, [invitation?.countdown_target_date, locale]);

    return (
        <div className="sp06-event-section flex items-center justify-center">
            {/* Background prewedding gallery slideshow */}
            {showPhotos && eventImages.length > 0 ? (
                <div className="sp06-event-bg-slideshow">
                    <PremiumSlideshow
                        images={eventImages}
                        zoom={1.15}
                    />
                </div>
            ) : (
                <div className="sp06-event-bg-slideshow bg-[#302f2f]" />
            )}
            
            {/* Tint dark gradient mask */}
            <div className="sp06-event-overlay" />

            <div className="relative z-10 w-full max-w-sm py-12">
                <Reveal className="text-center mb-6">
                    <h3 className="text-white sp06-font-heading-style text-4xl leading-none tracking-wide mb-1">
                        {formattedDate}
                    </h3>
                    <div className="sp06-divider select-none mb-8 w-24">
                        <div className="sp06-divider-line bg-white opacity-40" />
                        <div className="sp06-divider-dot bg-white" />
                        <div className="sp06-divider-line bg-white opacity-40" />
                    </div>
                </Reveal>

                <div className="space-y-8">
                    {list.map((evt, idx) => {
                        const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Resepsi Nikah');
                        const isEven = idx % 2 === 0;

                        return (
                            <Reveal key={evt.id || idx} variant="zoom" className="sp06-event-glass-card">
                                <div className={`flex flex-col ${isEven ? 'items-start text-left' : 'items-end text-right'}`}>
                                    {/* Icon */}
                                    <div className="text-white text-3xl mb-3">
                                        {evt.event_type === 'akad' ? (
                                            <i className="fas fa-file-contract" />
                                        ) : (
                                            <i className="fas fa-cocktail" />
                                        )}
                                    </div>

                                    {/* Event Title */}
                                    <h4 className="text-xl font-bold uppercase tracking-widest text-white mb-1.5 font-serif border-b border-white/20 pb-1 w-full">
                                        {eventDisplayName}
                                    </h4>

                                    {/* Time details */}
                                    <p className="text-sm font-semibold text-white/95 mb-4 font-serif">
                                        {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : (isEn ? ' - End' : ' - Selesai')} {evt.timezone || 'WIB'}
                                    </p>

                                    {/* Venue */}
                                    <div className="text-xs leading-relaxed text-white/90 mb-5 font-semibold">
                                        <p className="font-bold text-sm mb-1 text-[var(--sp06-accent)] uppercase tracking-wide">
                                            {evt.venue_name || (evt.event_type === 'akad' ? "Kediaman Mempelai Wanita" : "Padjadjaran Hotel")}
                                        </p>
                                        <p className="opacity-80 font-medium">{evt.venue_address || 'Jl. Raya Pajajaran No.17, Kota Bogor'}</p>
                                    </div>

                                    {/* Directions Map button */}
                                    {evt.gmaps_link && (
                                        <a
                                            href={evt.gmaps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="sp06-btn-map"
                                        >
                                            <i className="fas fa-map-marker-alt" /> {isEn ? 'View Directions' : 'Lihat Lokasi'}
                                        </a>
                                    )}
                                </div>
                            </Reveal>
                        );
                    })}

                                {/* Compact standalone Dress Code box below event list */}
                                {list?.filter(evt => evt.show_dress_code).map((evt, idx) => (
                                    <div key={`dc-${idx}`} className="sp06-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={evt} colors={{ primary: '#c2a67a', text: '#2d2d2d' }} fonts={{ heading: 'inherit' }} variant="modern" plain={true} />
                                    </div>
                                ))}
                </div>

                <Reveal className="text-center mt-12 px-6">
                    <p className="text-xs leading-relaxed text-white/80 select-none font-medium italic">
                        {isEn 
                            ? '“An honor and great pleasure for us if you could attend to celebrate our holy union”' 
                            : '“Suatu kehormatan bagi kami, apabila bapak, ibu, Saudara/i berkenan hadir dalam acara pernikahan kami”'}
                    </p>
                </Reveal>
            </div>
        </div>
    );
}

// 5. GOOGLE MAPS IFRAME SECTION (Elementor ID empat & Maps)
function GmapSection({ events, locale }) {
    const isEn = locale === 'en';
    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);

    return (
        <div className="sp05-maps-section text-center py-16 bg-[var(--sp06-bg-light)]">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Event Location' : 'Lokasi Resepsi'} />
            </Reveal>

            <Reveal variant="zoom" className="sp05-iframe-wrapper w-full max-w-sm aspect-[4/3] mx-auto mt-6">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.316550876892!2d106.80074151523849!3d-6.607530766430628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5c277c0edef%3A0xe022fe1c5bcef5c0!2sThe%201O1%20Bogor%20Suryakancana!5e0!3m2!1sid!2sid!4v1678528299638!5m2!1sid!2sid" 
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
                        className="sp06-btn-map"
                    >
                        <i className="fas fa-directions" /> {isEn ? 'Open Google Maps' : 'Petunjuk Arah'}
                    </a>
                </Reveal>
            )}
        </div>
    );
}

// 6. STORY TIMELINE SECTION
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    if (list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto bg-white">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} />
            </Reveal>

            <div className="sp06-timeline mt-8">
                {list.map((story, i) => (
                    <Reveal key={story.id || i} variant={i % 2 === 0 ? 'left' : 'right'} className="sp06-timeline-item">
                        <div className="sp06-story-card">
                            <span className="sp06-story-year">
                                {story.story_date ? new Date(String(story.story_date).substring(0, 10) + 'T12:00:00').getFullYear() : story.year || '2021'}
                            </span>
                            <h4 className="text-md font-bold text-[var(--sp06-primary)] sp06-font-heading-style tracking-wide mb-1.5">
                                {story.title}
                            </h4>
                            <p className="text-xs leading-relaxed opacity-90 text-[var(--sp06-text-dark)] font-medium">
                                {story.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 7. GALLERY GRID SECTION
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto bg-[var(--sp06-bg-light)]">
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
                            <img src={imgUrl} alt={item.caption || 'Galeri'} className="sp06-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

// 8. unified RSVP & WISHES SECTION
function RsvpWishesSection({ invitation, wishes, locale }) {
    const wishesInputRef = React.useRef(null);
    const isEn = locale === 'en';
    
    const [wishesList, setWishesList] = useState(safeArr(wishes));

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
        <div className="sp06-rsvp-wishes-section max-w-md mx-auto text-center" id="rsvp">
            <Reveal>
                <FlowerSwirl title={isEn ? 'RSVP Confirmation' : 'Konfirmasi Kehadiran'} />
            </Reveal>

            <Reveal variant="zoom" className="bg-white border-2 border-gray-200 p-6 mt-6 rounded-2xl shadow-md">
                {formSubmitted ? (
                    <div className="py-8 text-center">
                        <i className="fas fa-check-circle text-4xl text-[var(--sp06-primary)] mb-3" />
                        <h4 className="text-lg font-bold text-[var(--sp06-primary)] select-none">
                            {isEn ? 'Thank You!' : 'Terima Kasih!'}
                        </h4>
                        <p className="text-xs text-[var(--sp06-text-muted)] mt-1">
                            {isEn ? 'Your RSVP has been saved.' : 'Konfirmasi kehadiran Anda berhasil disimpan.'}
                        </p>
                        <button type="button" onClick={() => setFormSubmitted(false)} className="sp06-btn-save-date mt-6">
                            {isEn ? 'Fill Again' : 'Isi Kembali'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="sp06-input-group">
                            <label className="sp06-label">{isEn ? 'Your Name' : 'Nama Anda'}</label>
                            <input 
                                type="text"
                                className="sp06-input"
                                placeholder={isEn ? 'Your name...' : 'Nama lengkap Anda...'}
                                value={data.sender_name}
                                onChange={e => setData('sender_name', e.target.value)}
                                required
                            />
                            {errors.sender_name && <div className="text-[10px] text-red-500 mt-1">{errors.sender_name}</div>}
                        </div>

                        {/* Attendance */}
                        <div className="sp06-input-group">
                            <label className="sp06-label">{isEn ? 'Attendance Status' : 'Kehadiran'}</label>
                            <select 
                                className="sp06-select"
                                value={data.attendance}
                                onChange={e => setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{isEn ? 'Attending' : 'Hadir'}</option>
                                <option value="tidak_hadir">{isEn ? 'Not Attending' : 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum Pasti'}</option>
                            </select>
                        </div>

                        {/* Pax */}
                        {data.attendance === 'hadir' && (
                            <div className="sp06-input-group">
                                <label className="sp06-label">{isEn ? 'Guest Quantity' : 'Jumlah Tamu'}</label>
                                <select 
                                    className="sp06-select"
                                    value={data.number_of_guests}
                                    onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <option key={v} value={v}>{v} {isEn ? 'Person' : 'Orang'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Doa ucapan */}
                        <div className="sp06-input-group">
                            <label className="sp06-label">{isEn ? 'Doa & Ucapan' : 'Ucapan & Doa'}</label>
                            <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef} 
                                className="sp06-textarea"
                                rows="3"
                                placeholder={isEn ? 'Blessing text...' : 'Tuliskan ucapan selamat dan doa restu Anda...'}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                            />
                                </WishesEmojiPicker>
                            {errors.message && <div className="text-[10px] text-red-500 mt-1">{errors.message}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="sp06-btn-submit"
                        >
                            {processing ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Confirm Attendance' : 'Kirim RSVP')}
                        </button>
                    </form>
                )}
            </Reveal>

            {/* Wishing list */}
            {wishesList.length > 0 && (
                <Reveal variant="zoom" className="mt-10 text-left">
                    <h5 className="text-xs font-bold text-[var(--sp06-primary)] uppercase tracking-wider mb-4 px-2 select-none">
                        {isEn ? 'Prayers & Wishes' : 'Doa Restu Tamu'}
                    </h5>
                    
                    <div className="sp06-wishes-container space-y-3">
                        {wishesList.map((wish, i) => (
                            <div key={wish.id || i} className="sp06-wish-card">
                                <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-bold text-[var(--sp06-primary)] tracking-wide">
                                        {wish.sender_name}
                                    </h6>
                                    <span className="text-[9px] text-[var(--sp06-primary)]/70 font-semibold">
                                        {new Date(wish.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-[var(--sp06-text-dark)] font-medium opacity-95">
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

// 9. BANK DETAILS / ENVELOPE SECTION (Luxury 2 style)
function BankSection({ bankAccounts, locale }) {
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
        <div className="sp06-bank-section text-center bg-[var(--sp06-bg-light)]" id="gift">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Wedding Gift' : 'Amplop Digital'} />
            </Reveal>
            <Reveal>
                <p className="text-xs text-[var(--sp06-text-muted)] max-w-xs mx-auto mb-8 font-semibold select-none leading-relaxed px-2">
                    {isEn 
                        ? 'For family and friends who wish to express their blessings digitally:' 
                        : 'Untuk memudahkan keluarga dan kerabat yang ingin mengirimkan hadiah atau kado secara digital:'}
                </p>
            </Reveal>

            <div className="space-y-6">
                {list.map((bank, i) => (
                    <Reveal key={bank.id || i} variant="zoom" className="sp06-bank-card text-left flex flex-col justify-between h-44">
                        {/* Chip row */}
                        <div className="flex justify-between items-center select-none">
                            <span className="font-extrabold italic text-xl text-[var(--sp06-primary)] tracking-wide">
                                {bank.bank_name}
                            </span>
                            <div className="w-10 h-7 bg-white/40 border border-white/60 rounded-md shadow-xs opacity-75 flex items-center justify-center font-bold text-[8px] text-[var(--sp06-primary)]">
                                CARD
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="my-2 select-none">
                            <p className="text-[9px] uppercase font-bold text-[var(--sp06-primary)]/60 tracking-widest mb-0.5">
                                Card Number
                            </p>
                            <p className="text-xl font-bold tracking-widest text-[var(--sp06-primary)] font-serif">
                                {bank.account_number}
                            </p>
                        </div>

                        {/* Holder Details */}
                        <div className="flex justify-between items-end border-t border-[var(--sp06-primary)]/20 pt-3">
                            <div className="select-none">
                                <p className="text-[9px] uppercase font-bold text-[var(--sp06-primary)]/60 tracking-widest">
                                    Cardholder
                                </p>
                                <p className="text-xs font-bold text-[var(--sp06-primary)] truncate max-w-[185px]">
                                    {bank.account_name}
                                </p>
                            </div>

                            <button 
                                type="button" 
                                onClick={() => handleCopy(bank.account_number, bank.id || i)}
                                className="sp06-btn-copy shadow-xs"
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

// 10. CLOSING SECTION
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
        <div className="w-full py-16 px-6 text-center bg-white border-t-4 border-[var(--sp06-primary)]">
            <Reveal variant="zoom" className="max-w-xs mx-auto flex flex-col items-center">
                <i className="fas fa-heart text-[var(--sp06-primary)] text-3xl mb-4 sp06-breathe" />
                
                <h4 className="text-3xl text-[var(--sp06-primary)] sp06-font-heading-style leading-none mb-4 select-none">
                    {formattedTitle}
                </h4>

                <p className="text-xs leading-relaxed text-[var(--sp06-primary)]/80 px-2 mb-8 select-none font-medium">
                    {invitation?.closing_text || (isEn 
                        ? 'It is our great honor and happiness if you could attend to give your blessings to us at this wedding.'
                        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.')}
                </p>

                <div className="space-y-4 text-xs font-semibold text-[var(--sp06-text-dark)] select-none">
                    <p className="italic text-[var(--sp06-primary)]/70">{isEn ? 'Sincerely,' : 'Kami yang berbahagia,'}</p>
                    
                    <h5 className="text-2xl text-[var(--sp06-primary)] sp06-font-heading-style leading-none">
                        {groom.nickname || 'Gilang'} &amp; {bride.nickname || 'Kirana'}
                    </h5>

                    {/* Parents names */}
                    <div className="space-y-2 border-t border-[var(--sp06-primary)]/10 pt-3 text-[10px] text-[var(--sp06-primary)]/70 uppercase tracking-widest font-serif font-bold">
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
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

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

    const showPhotos = !parseBool(invitation?.hide_photos, false) && parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);

    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    const resolvedSections = useMemo(() => {
        const list = safeArr(sections);
        if (list.length === 0) return [];
        
        let filtered = list.filter(s => s.is_visible);
        
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const streamings = primaryEvent?.streaming_url || (Array.isArray(primaryEvent?.streamings) && primaryEvent.streamings.length > 0);
        if (!streamings) {
            filtered = filtered.filter(s => s.section_key !== 'livestream');
        }

        if (!showPhotos || safeArr(galleries).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'gallery');
        }

        const hasRsvp = filtered.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            filtered = filtered.filter(s => s.section_key !== 'wishes');
        }

        return filtered;
    }, [sections, events, galleries, showPhotos]);

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
        const navEl = document.querySelector('.sp06-nav-menu');
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

    const handleOpenInvitation = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                setIsPlaying(false);
            });
        }

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

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

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className={`sp06-theme ${!showAnimations ? 'theme-no-animations' : ''}`}>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan'}</title>
                <meta name="description" content={invitation?.cover_subtitle || 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.'} />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            </Head>

            {/* Custom Google Fonts Loader */}
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Caramel&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Roboto+Slab:wght@300;400;600;700&display=swap" rel="stylesheet" />
            </Head>

            {/* Audio Source */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={getStorageUrl(invitation.music_url, '/audio/backsound.mp3')} loop />
            )}

            {/* Viewport container */}
            <div ref={containerRef} className="sp06-theme-container">
                {/* Ambient Particles */}
                {invitation?.particle_type && invitation.particle_type !== 'none' && (
                    <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                        <ParticleEffect type={invitation.particle_type || 'gold-dust'} />
                    </div>
                )}

                {/* 1. COVER / ENVELOPE OVERLAY */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                    showPhotos={showPhotos}
                />

                {/* Opened invitation sections content */}
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
                                                    <p className="text-xs sm:text-sm leading-relaxed opacity-95 text-[var(--sp06-primary)] font-serif italic max-w-sm mx-auto select-none">
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
                                                    showPhotos={showPhotos}
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
                                                
                                                <div className="sp06-watermark select-none bg-white w-full border-t border-gray-100 pt-6">
                                                    Made with ❤️ by <span className="font-bold text-[var(--sp06-primary)]">{brandName}</span>
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

            {/* FLOATING ACTION OVERLAY CONTROLS */}
            {isOpened && (
                <div className="sp06-floating-controls">
                    {/* Auto Scroll Button */}
                    <button 
                        type="button" 
                        onClick={() => setAutoScroll(!autoScroll)} 
                        className={`sp06-control-btn ${autoScroll ? 'is-active' : ''}`}
                        title={autoScroll ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
                    >
                        {autoScroll ? (
                            <i className="fas fa-pause" />
                        ) : (
                            <i className="fas fa-arrows-up-down" />
                        )}
                    </button>

                    {/* QR Code trigger */}
                    {enableQr && activeGuest && (
                        <button 
                            type="button" 
                            onClick={() => setShowQr(true)} 
                            className="sp06-control-btn"
                            title={isEn ? 'Show Check-in QR' : 'Tampilkan QR Presensi'}
                        >
                            <i className="fas fa-qrcode" />
                        </button>
                    )}

                    {/* Fullscreen Mode trigger */}
                    <button 
                        type="button" 
                        onClick={toggleFullscreen} 
                        className="sp06-control-btn"
                        title={isEn ? 'Toggle Screen Mode' : 'Ubah Mode Layar'}
                    >
                        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                    </button>

                    {/* Audio Music trigger with Equalizer waves */}
                    {invitation?.music_url && (
                        <button 
                            type="button" 
                            onClick={toggleMusic} 
                            className="sp06-control-btn"
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
                <nav className="sp06-nav-menu">
                    <div className="sp06-nav-menu__inner--row">
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
                                    className={`sp06-nav-menu__item ${isActive ? 'active' : ''}`}
                                    title={s.section_name}
                                >
                                    <i className={icon} />
                                    <span className="sp06-nav-item-text">{labelText}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            )}

            {/* QR PRESENSI CHECK-IN MODAL OVERLAY */}
            {isOpened && enableQr && showQr && activeGuest && (
                <div className="sp06-qr-modal" onClick={() => setShowQr(false)}>
                    <div className="sp06-qr-card" onClick={e => e.stopPropagation()}>
                        <button 
                            type="button" 
                            onClick={() => setShowQr(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                        >
                            <i className="fas fa-times" />
                        </button>

                        <h4 className="text-lg font-bold text-[var(--sp06-primary)] sp06-font-heading-style select-none">
                            QR Code Presensi
                        </h4>
                        <p className="text-xs text-[var(--sp06-primary)]/75 mt-1 mb-6 max-w-[240px] mx-auto select-none">
                            {isEn 
                                ? 'Show this QR code to the receptionist for attendance entry.' 
                                : 'Tunjukkan QR code ini ke petugas penerima tamu untuk konfirmasi kehadiran.'}
                        </p>

                        <div className="sp06-qr-image-wrapper mb-4">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=282828&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                alt="QR Code Presensi" 
                                className="w-48 h-48 rounded-xl object-contain select-none"
                            />
                        </div>

                        <p className="text-sm font-bold text-[var(--sp06-primary)]">
                            {activeGuest.name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
