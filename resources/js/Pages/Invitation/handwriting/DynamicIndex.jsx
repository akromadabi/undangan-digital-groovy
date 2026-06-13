import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import DressCodeBlock from '@/Components/DressCodeBlock';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

// Import local assets from luxury-02 theme
import logoDana from '../luxury-02/asset/1200px-Logo_dana_blue.svg-1-1-1.png';
import logoBca from '../luxury-02/asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1.png';
import chipAtm from '../luxury-02/asset/chip-atm-1-2-1-1-1.png';

// Scoped styling
import './style.css';

// Default assets fallback
const DEFAULT_ASSETS = {
    mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
};

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function toTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d, locale = 'id') {
    if (!d) return '';
    // Safe parsing: T12:00:00 prevents UTC midnight timezone offset bug
    const safe = String(d).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

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

function getYoutubeId(url) {
    if (!url) return '';
    let id = '';
    if (url.includes('youtube.com/watch?v=')) {
        id = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
        id = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/embed/')) {
        id = url.split('embed/')[1]?.split('?')[0];
    }
    return id;
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

// Clipboard fallback for iOS WebView and non-HTTPS Safari
const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: 0 });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
};

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="theme-error-boundary" style={{ padding: 20, color: '#3d3730', background: '#f4efe6', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#8b6b4f', fontFamily: 'Kalam', fontSize: '2rem' }}>Terjadi kesalahan pada tema Handwriting.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#555', marginTop: 10, maxWidth: '90%' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

// Global control parameters
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
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
        }, { threshold: 0.15 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'hw-reveal--up';
    if (variant === 'zoom') baseClass = 'hw-reveal--zoom';
    else if (variant === 'left') baseClass = 'hw-reveal--left';
    else if (variant === 'right') baseClass = 'hw-reveal--right';
    else if (variant === 'down') baseClass = 'hw-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} ${baseClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   VEKTOR DRIED LEAVES / FLOWERS SVG
   ═══════════════════════════════════════ */
function DriedFlowers() {
    return (
        <svg viewBox="0 0 100 100" className="hw-flowers-svg">
            <path d="M50 90 C 45 72, 32 55, 18 42" fill="none" stroke="#a68058" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 42 Q 13 36 18 31 Q 28 36 18 42" fill="#d3c2b0" stroke="#a68058" strokeWidth="1" />
            <path d="M33 62 Q 28 54 33 47 Q 43 52 33 62" fill="#d3c2b0" stroke="#a68058" strokeWidth="1" />
            
            <path d="M50 90 C 55 72, 68 55, 82 42" fill="none" stroke="#a68058" strokeWidth="2" strokeLinecap="round" />
            <path d="M82 42 Q 87 36 82 31 Q 72 36 82 42" fill="#d3c2b0" stroke="#a68058" strokeWidth="1" />
            <path d="M67 62 Q 72 54 67 47 Q 57 52 67 62" fill="#d3c2b0" stroke="#a68058" strokeWidth="1" />
            
            <path d="M50 90 C 50 68, 50 48, 50 32" fill="none" stroke="#a68058" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 32 Q 45 25 50 20 Q 55 25 50 32" fill="#8b6b4f" stroke="#a68058" strokeWidth="1" />
            
            <circle cx="50" cy="90" r="4.5" fill="#8b6b4f" />
        </svg>
    );
}

/* ==========================================================================
   SECTION 1: COVER
   ========================================================================== */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, coverImages }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const primaryEvent = safeArr(invitation?.events || []).find(e => e.is_primary) || safeArr(invitation?.events || [])[0];
    const eventDateStr = primaryEvent?.event_date || invitation?.countdown_target_date || '2026-12-25';
    
    const formattedDate = useMemo(() => {
        if (!eventDateStr) return '';
        const d = new Date(String(eventDateStr).substring(0, 10) + 'T12:00:00');
        if (isNaN(d.getTime())) return eventDateStr;
        return d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    }, [eventDateStr]);

    return (
        <div className={`hw-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="hw-cover__overlay" />
            <div className="hw-cover__content">
                <span className="hw-cover__the-wedding hw-write-anim">{t('invitation.wedding_of')}</span>
                
                {/* Hanging Rope Single Polaroid */}
                {globalShowPhotos && coverImages.length > 0 && (
                    <div className="hw-rope-container">
                        <div className="hw-rope">
                            <div className="hw-polaroids justify-center">
                                <div className="hw-polaroid hw-polaroid--single">
                                    <div className="hw-paperclip" />
                                    <img src={coverImages[0]} alt="cover single" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <h1 className="hw-cover__couple">{coupleName}</h1>
                
                {/* Paint Brush stroke container for the date */}
                <div className="hw-date-stroke">
                    {formattedDate}
                </div>

                <p className="hw-cover__dear">{t('invitation.dear_guest_title') || 'Dear:'}</p>
                <div className="hw-cover__guest">{guestName}</div>
                <p className="hw-cover__apology">{t('invitation.dear_guest_desc')}</p>

                <button type="button" onClick={onOpen} id="tombol-buka" className="hw-cover__btn">
                    <i className="fas fa-book-open" />
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

/* ==========================================================================
   SECTION 2: OPENING
   ========================================================================== */
function OpeningSection({ invitation, brideGrooms, events, showCountdown }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    // Full couple name for display (not just initials)
    const coupleName = useMemo(() => {
        if (groom?.nickname && bride?.nickname) return `${groom.nickname} & ${bride.nickname}`;
        if (groom?.full_name && bride?.full_name) return `${groom.full_name} & ${bride.full_name}`;
        return invitation?.cover_title || 'Groom & Bride';
    }, [groom, bride, invitation]);

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    return (
        <section id="opening" className="hw-section hw-opening">
            <Reveal>
                {/* Basmalah / Opening Title */}
                <h2 className="hw-section-title" style={{ marginTop: '0' }}>{invitation?.opening_title || 'Bismillahirrahmanirrahim'}</h2>
                <p className="hw-section-subtitle" style={{ marginBottom: '20px' }}>The Wedding of</p>

                {/* Full Couple Name — hero display */}
                <div className="hw-opening__couple-name">
                    {coupleName}
                </div>

                {/* Opening Slideshow */}
                {globalShowPhotos && openingImages.length > 0 && (
                    <div className="hw-opening__slideshow-wrapper">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                )}

                {/* Countdown tepat di bawah foto */}
                {showCountdown && (
                    <div style={{ marginTop: '20px' }}>
                        <CountdownBlock events={events} />
                    </div>
                )}

                {/* Ayat / Kutipan */}
                {invitation?.opening_ayat && (
                    <div className="hw-opening-card" style={{ marginTop: '20px' }}>
                        <DriedFlowers />
                        <p className="hw-opening__ayat" style={{ fontFamily: 'var(--hw-font-handwriting)', fontSize: '1.25rem', marginBottom: '8px' }}>
                            &ldquo;{invitation.opening_ayat}&rdquo;
                        </p>
                        {invitation?.opening_ayat_source && (
                            <p className="hw-opening__source" style={{ margin: 0 }}>&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}

                {/* Teks Pembuka */}
                <p className="hw-opening__text" style={{ marginTop: '20px', fontFamily: 'var(--hw-font-handwriting)', fontSize: '1.25rem' }}>
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia mengenai hari pernikahan kami.'}
                </p>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 3: BRIDE & GROOM
   ========================================================================== */
function BrideGroomSection({ brideGrooms }) {
    const { t, locale } = useTranslation();
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
        <section id="bride_groom" className="hw-section hw-couple">
            <Reveal>
                <h2 className="hw-section-title">{t('invitation.mempelai')}</h2>
                <p className="hw-section-subtitle">Groom &amp; Bride</p>
            </Reveal>

            {/* Groom (Pria) */}
            <Reveal className="hw-mempelai-card" variant="left">
                <div className="hw-mempelai-photo-wrap">
                    <div className="hw-tape" />
                    <div className="hw-mempelai-photo-inner">
                        {globalShowPhotos && groom.photo ? (
                            <img 
                                src={getStorageUrl(groom.photo)} 
                                alt={groom.full_name || 'Groom'} 
                                className="hw-mempelai-photo" 
                                style={{
                                    objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                    transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                }}
                            />
                        ) : (
                            <div className="hw-mempelai-monogram">
                                {groom.nickname?.charAt(0) || 'G'}
                            </div>
                        )}
                    </div>
                    <DriedFlowers />
                </div>
                <div className="hw-mempelai-details">
                    <h3 className="hw-mempelai-name">{groom.full_name || 'Nama Lengkap Pria'}</h3>
                    <p className="hw-mempelai-parent-label">
                        {translateChildOrder(groom.child_order, 'pria')}
                    </p>
                    <p className="hw-mempelai-parents">
                        {groom.father_name && groom.mother_name
                            ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                            : (groom.father_name || groom.mother_name || '')}
                    </p>
                    {groom.instagram && (
                        <a
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hw-mempelai-ig"
                        >
                            <i className="fab fa-instagram" /> @{groom.instagram.replace('@', '')}
                        </a>
                    )}
                </div>
            </Reveal>

            {/* Calligraphy Divider */}
            <Reveal className="hw-and-divider" variant="zoom">
                <span className="hw-and-divider-text">and</span>
            </Reveal>

            {/* Bride (Wanita) */}
            <Reveal className="hw-mempelai-card" variant="right">
                <div className="hw-mempelai-photo-wrap">
                    <div className="hw-tape" />
                    <div className="hw-mempelai-photo-inner">
                        {globalShowPhotos && bride.photo ? (
                            <img 
                                src={getStorageUrl(bride.photo)} 
                                alt={bride.full_name || 'Bride'} 
                                className="hw-mempelai-photo" 
                                style={{
                                    objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                    transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                }}
                            />
                        ) : (
                            <div className="hw-mempelai-monogram">
                                {bride.nickname?.charAt(0) || 'B'}
                            </div>
                        )}
                    </div>
                    <DriedFlowers />
                </div>
                <div className="hw-mempelai-details">
                    <h3 className="hw-mempelai-name">{bride.full_name || 'Nama Lengkap Wanita'}</h3>
                    <p className="hw-mempelai-parent-label">
                        {translateChildOrder(bride.child_order, 'wanita')}
                    </p>
                    <p className="hw-mempelai-parents">
                        {bride.father_name && bride.mother_name
                            ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                            : (bride.father_name || bride.mother_name || '')}
                    </p>
                    {bride.instagram && (
                        <a
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hw-mempelai-ig"
                        >
                            <i className="fab fa-instagram" /> @{bride.instagram.replace('@', '')}
                        </a>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 4: COUNTDOWN (Integrated)
   ========================================================================== */
function CountdownBlock({ events }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = primaryEvent?.event_date || '';
    const targetTime = primaryEvent?.start_time || '08:00';

    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const dateStr = String(targetDate).substring(0, 10);
        const timeStr = String(targetTime).substring(0, 5);
        const target = parseSafeDate(targetDate, targetTime);

        if (isNaN(target.getTime())) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };

        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [targetDate, targetTime]);

    return (
        <div className="hw-countdown-wrapper">
            <h3 className="hw-event-card__name" style={{ marginBottom: '10px' }}>{t('invitation.save_the_date')}</h3>
            <p className="hw-section-subtitle" style={{ marginBottom: '15px' }}>
                {t('invitation.save_the_date') === 'Save The Date' ? 'Counting Down' : 'Menghitung Hari'}
            </p>
            <div className="hw-countdown">
                <div className="hw-countdown__item">
                    <div className="hw-countdown__value">
                        {pad2(timeLeft.d).split('').map((digit, idx) => (
                            <span key={`d-${idx}`} className="hw-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="hw-countdown__label">{t('invitation.days')}</span>
                </div>
                <span className="hw-countdown__colon">:</span>
                <div className="hw-countdown__item">
                    <div className="hw-countdown__value">
                        {pad2(timeLeft.h).split('').map((digit, idx) => (
                            <span key={`h-${idx}`} className="hw-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="hw-countdown__label">{t('invitation.hours')}</span>
                </div>
                <span className="hw-countdown__colon">:</span>
                <div className="hw-countdown__item">
                    <div className="hw-countdown__value">
                        {pad2(timeLeft.m).split('').map((digit, idx) => (
                            <span key={`m-${idx}`} className="hw-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="hw-countdown__label">{t('invitation.minutes')}</span>
                </div>
                <span className="hw-countdown__colon">:</span>
                <div className="hw-countdown__item">
                    <div className="hw-countdown__value">
                        {pad2(timeLeft.s).split('').map((digit, idx) => (
                            <span key={`s-${idx}`} className="hw-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="hw-countdown__label">{t('invitation.seconds')}</span>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   SECTION 5: EVENT DETAILS
   ========================================================================== */
function EventSection({ events, showCountdown, invitation }) {
    const { t, locale } = useTranslation();
    const list = safeArr(events);

    return (
        <section id="event" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{t('invitation.event') || 'Acara'}</h2>
                <p className="hw-section-subtitle">Save The Date</p>
            </Reveal>

            {showCountdown && (
                <Reveal variant="zoom">
                    <CountdownBlock events={events} />
                </Reveal>
            )}

            <div className="flex flex-col gap-6" style={{ marginTop: '20px' }}>
                {list.map((evt, idx) => {
                    const isAkad = evt.event_name?.toLowerCase().includes('akad');
                    return (
                        <Reveal key={evt.id || idx} className="hw-card hw-event-card" variant={idx % 2 === 0 ? 'left' : 'right'}>
                            <span className="hw-event-card__badge">{isAkad ? 'Akad' : 'Resepsi'}</span>
                            <h3 className="hw-event-card__name">{evt.event_name || (isAkad ? 'Akad Nikah' : 'Resepsi')}</h3>
                            
                            <div className="hw-event-card__meta">
                                <div className="hw-event-card__meta-item">
                                    <i className="far fa-calendar-alt" />
                                    <span className="hw-event-card__date-text">{formatDate(evt.event_date, locale)}</span>
                                </div>
                                <div className="hw-event-card__meta-item">
                                    <i className="far fa-clock" />
                                    <span className="hw-event-card__time-text">
                                        {formatTime(evt.start_time)} - {evt.end_time ? formatTime(evt.end_time) : 'Selesai'} {evt.timezone || 'WIB'}
                                    </span>
                                </div>
                                <div className="hw-event-card__meta-item">
                                    <i className="fas fa-map-marker-alt" />
                                    <span className="hw-event-card__date-text" style={{ fontSize: '13px' }}>{evt.venue_name || 'Nama Tempat'}</span>
                                    <p className="hw-event-card__address">{evt.venue_address || 'Alamat Lengkap Acara'}</p>
                                </div>
                            </div>

                            {evt.gmaps_link && (
                                <a
                                    href={evt.gmaps_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hw-event-card__btn"
                                >
                                    <i className="fas fa-map-location-dot" />
                                    Google Maps
                                </a>
                            )}
                        </Reveal>
                    );
                })}
            </div>

            {/* Compact standalone Dress Code box below event list */}
            {list?.filter(p => p.show_dress_code || p.dresscode_colors).map((p, idx) => (
                <div key={`dc-${idx}`} className="w-full max-w-md mx-auto mt-4 px-4 pb-2">
                    <DressCodeBlock event={p} />
                </div>
            ))}
        </section>
    );
}

/* ==========================================================================
   SECTION 6: LOVE STORY
   ========================================================================== */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const stories = safeArr(loveStories);

    if (stories.length === 0) return null;

    return (
        <section id="love_story" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{t('invitation.love_story') || 'Kisah Cinta'}</h2>
                <p className="hw-section-subtitle">Our Journey</p>
            </Reveal>

            <div className="hw-story">
                {stories.map((story, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <div key={story.id || idx} className={`hw-story__node ${isEven ? 'hw-story__node--left' : 'hw-story__node--right'}`}>
                            <Reveal className="hw-story__card" variant={isEven ? 'left' : 'right'}>
                                {story.story_date && (
                                    <span className="hw-story__date">
                                        {new Date(String(story.story_date).substring(0, 10) + 'T12:00:00').getFullYear() || story.story_date}
                                    </span>
                                )}
                                <h3 className="hw-story__title">{story.title || 'Momen Spesial'}</h3>
                                <p className="hw-story__desc">{story.description}</p>
                            </Reveal>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ==========================================================================
   SECTION 7: LIVE STREAMING
   ========================================================================== */
function LiveStreamingSection({ events, invitation }) {
    const { t, locale } = useTranslation();
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
        <section id="livestream" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <p className="hw-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
            </Reveal>
            
            <Reveal className="hw-livestream-container" variant="zoom">
                {streamsList.map((stream, idx) => (
                    <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="hw-btn-livestream">
                        <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                    </button>
                ))}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 8: DRESSCODE PANEL
   ========================================================================== */
function DressCodeSection({ invitation }) {
    const { t, locale } = useTranslation();
    const showDresscode = parseBool(invitation?.show_dresscode, false);
    if (!showDresscode) return null;

    const colors = invitation?.dresscode_colors ? invitation.dresscode_colors.split(',') : [];
    const isEn = locale === 'en';

    return (
        <section id="dresscode" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">Dress Code</h2>
                <p className="hw-section-subtitle">{isEn ? 'Our Wedding Color Palette' : 'Rekomendasi Warna Pakaian'}</p>
            </Reveal>
            <Reveal className="hw-card text-center" variant="zoom">
                <p className="hw-event-card__address" style={{ marginBottom: '15px' }}>
                    {invitation?.dresscode_instruction || (isEn ? 'To align with our wedding aesthetic, guests are recommended to wear clothes within this color palette:' : 'Agar menyatu dengan keindahan dekorasi kami, para tamu disarankan mengenakan pakaian dengan palet warna berikut:')}
                </p>
                {colors.length > 0 && (
                    <div className="hw-dresscode-colors-flex">
                        {colors.map((color, idx) => (
                            <div 
                                key={idx} 
                                className="hw-dresscode-color-circle" 
                                style={{ backgroundColor: color.trim() }}
                                title={color.trim()}
                            />
                        ))}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 9: VIDEO WEDDING
   ========================================================================== */
function VideoSection({ invitation }) {
    const { t, locale } = useTranslation();
    const videoUrl = invitation?.video_url || '';
    if (!videoUrl) return null;

    const embedId = getYoutubeId(videoUrl);
    if (!embedId) return null;

    const isEn = locale === 'en';

    return (
        <section id="video" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{isEn ? 'Our Wedding Video' : 'Momen Video'}</h2>
                <p className="hw-section-subtitle">{isEn ? 'Memories Captured' : 'Momen yang Diabadikan'}</p>
            </Reveal>
            <Reveal className="hw-card" variant="zoom" style={{ padding: '8px' }}>
                <div className="hw-video-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${embedId}?autoplay=0&rel=0`}
                        title="Wedding Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 10: GALLERY
   ========================================================================== */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const pics = safeArr(galleries);
    const [activePhoto, setActivePhoto] = useState(null);

    if (pics.length === 0) return null;

    return (
        <section id="gallery" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{t('invitation.gallery') || 'Galeri'}</h2>
                <p className="hw-section-subtitle">Captured Memories</p>
            </Reveal>

            <div className="hw-gallery-grid">
                {pics.map((pic, idx) => {
                    const src = getStorageUrl(pic.image_path || pic.image_url);
                    const isWide = idx % 3 === 0; // alternate grid layouts
                    return (
                        <Reveal 
                            key={pic.id || idx} 
                            className={`hw-gallery-item ${isWide ? 'hw-gallery-item--wide' : ''}`}
                            variant="zoom"
                            delay={idx * 50}
                        >
                            <div className="hw-gallery-img-wrap" onClick={() => setActivePhoto(src)} style={{ cursor: 'pointer' }}>
                                <img src={src} alt={pic.caption || `photo ${idx}`} />
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            {/* Lightbox Overlay */}
            {activePhoto && (
                <div className="hw-modal-overlay" onClick={() => setActivePhoto(null)} style={{ cursor: 'zoom-out' }}>
                    <div style={{ maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                        <img 
                            src={activePhoto} 
                            alt="Lightbox" 
                            style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', border: '5px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

/* ==========================================================================
   SECTION 11: RSVP & WISHES (Unified)
   ========================================================================== */
function RsvpWishesSection({ invitation, guest, wishes, slug }) {
    const { t, locale } = useTranslation();
    const [copiedIdx, setCopiedIdx] = useState(null);

    const guestId = guest?.id || null;
    const defaultSenderName = guest?.name || '';
    const wishesInputRef = useRef(null);

    // Form logic
    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guestId,
        attendance: 'hadir',
        number_of_guests: 1,
        sender_name: defaultSenderName,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Post RSVP
        post(route('invitation.submitRsvp', { slug }), {
            preserveScroll: true,
            onSuccess: () => {
                // Post Wish
                post(route('invitation.submitWish', { slug }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset('message');
                        // Show alert
                        alert(locale === 'en' ? 'Thank you! Your wish and RSVP have been sent.' : 'Terima kasih! Doa dan konfirmasi kehadiran Anda berhasil terkirim.');
                    }
                });
            }
        });
    };



    const isEn = locale === 'en';

    return (
        <section id="rsvp" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">RSVP &amp; Wishes</h2>
                <p className="hw-section-subtitle">{isEn ? 'Share Your Wishes & Attendance' : 'Konfirmasi Kehadiran & Kirim Doa'}</p>
            </Reveal>

            <Reveal className="hw-card" variant="zoom">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nama Lengkap */}
                    <div className="hw-form-group">
                        <label className="hw-form-label">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                        <input
                            type="text"
                            value={data.sender_name}
                            onChange={e => setData('sender_name', e.target.value)}
                            className={`hw-input ${errors.sender_name ? 'hw-input-error' : ''}`}
                            placeholder={isEn ? 'Enter your name' : 'Nama lengkap Anda'}
                            required
                        />
                        {errors.sender_name && <span className="text-red-500 text-xs mt-1 block">{errors.sender_name}</span>}
                    </div>

                    {/* Kehadiran */}
                    <div className="hw-form-group">
                        <label className="hw-form-label">{isEn ? 'Attendance Status' : 'Konfirmasi Kehadiran'}</label>
                        <select
                            value={data.attendance}
                            onChange={e => setData('attendance', e.target.value)}
                            className="hw-select"
                        >
                            <option value="hadir">{isEn ? 'I Will Attend' : 'Saya Hadir'}</option>
                            <option value="tidak_hadir">{isEn ? 'I Cannot Attend' : 'Saya Tidak Hadir'}</option>
                            <option value="belum_pasti">{isEn ? 'Uncertain' : 'Masih Belum Pasti'}</option>
                        </select>
                    </div>

                    {/* Jumlah Orang (Jika Hadir) */}
                    {data.attendance === 'hadir' && (
                        <div className="hw-form-group animate-fade-in">
                            <label className="hw-form-label">{isEn ? 'Number of Guests' : 'Jumlah Orang'}</label>
                            <select
                                value={data.number_of_guests}
                                onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                className="hw-select"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n} {isEn ? 'Person(s)' : 'Orang'}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Pesan Ucapan */}
                    <div className="hw-form-group relative">
                        <label className="hw-form-label">{isEn ? 'Your Wish' : 'Doa & Ucapan'}</label>
                        <WishesEmojiPicker
                            value={data.message}
                            onChange={(newValue) => setData('message', newValue)}
                            inputRef={wishesInputRef}
                            isDark={false}
                        >
                            <textarea
                                ref={wishesInputRef}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                className={`hw-textarea ${errors.message ? 'hw-input-error' : ''}`}
                                placeholder={isEn ? 'Write your beautiful wishes here...' : 'Tuliskan ucapan dan doa terbaik Anda...'}
                                rows="4"
                                required
                            />
                        </WishesEmojiPicker>
                        {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="hw-btn-primary"
                        style={{ marginTop: '10px' }}
                    >
                        {processing ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Submit' : 'Kirim Kehadiran & Ucapan')}
                    </button>
                </form>

                {/* Wishes Comment List (Limited to 5, Scrollable) */}
                {wishes.length > 0 && (
                    <div className="hw-wishes-scroll">
                        {wishes.map((wish, idx) => (
                            <div key={wish.id || idx} className="hw-wish-card">
                                <div className="hw-wish-header">
                                    <span className="hw-wish-sender">{wish.sender_name}</span>
                                    <span className="hw-wish-time">
                                        {wish.created_at ? new Date(wish.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                                    </span>
                                </div>
                                <p className="hw-wish-message">{wish.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 12: REKENING & KADO DIGITAL
   ========================================================================== */
function BankGiftSection({ bankAccounts, invitation }) {
    const { t, locale } = useTranslation();
    const [copiedIdx, setCopiedIdx] = useState(null);
    const list = safeArr(bankAccounts);

    const handleCopy = (accNumber, idx) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(accNumber)
                .then(() => {
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2000);
                })
                .catch(() => {
                    fallbackCopy(accNumber);
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2000);
                });
        } else {
            fallbackCopy(accNumber);
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        }
    };

    if (list.length === 0) return null;

    const isEn = locale === 'en';

    return (
        <section id="bank" className="hw-section">
            <Reveal>
                <h2 className="hw-section-title">{t('invitation.bank') || 'Amplop Digital'}</h2>
                <p className="hw-section-subtitle">{isEn ? 'Wedding Gift & Envelope' : 'Kirim Kado atau Amplop Digital'}</p>
            </Reveal>

            <div className="flex flex-col gap-6" style={{ marginTop: '20px' }}>
                {list.map((ac, idx) => {
                    const isBca = ac.bank_name?.toLowerCase().includes('bca');
                    const isDana = ac.bank_name?.toLowerCase().includes('dana');
                    
                    let bankLogo = DEFAULT_ASSETS.mandiri;
                    if (isBca) bankLogo = logoBca;
                    else if (ac.bank_name?.toLowerCase().includes('mandiri')) bankLogo = DEFAULT_ASSETS.mandiri;

                    return (
                        <Reveal key={ac.id || idx} className="hw-bank-card" variant="zoom">
                            <div className="hw-bank-card-header">
                                <img src={chipAtm} className="hw-card-chip" alt="ATM Chip" />
                                {isBca ? (
                                    <img src={logoBca} className="hw-card-bank-logo" alt="BCA Logo" />
                                ) : isDana ? (
                                    <img src={logoDana} className="hw-card-bank-logo" alt="DANA Logo" />
                                ) : (
                                    <span style={{ fontFamily: 'Kalam', fontWeight: 'bold', fontSize: '1.2rem', color: '#f4efe6' }}>
                                        {ac.bank_name?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            
                            <div className="hw-bank-card-number">
                                {ac.account_number}
                            </div>
                            
                            <div className="hw-bank-card-footer">
                                <div>
                                    <div className="hw-bank-card-label">{isEn ? 'Card Holder' : 'Atas Nama'}</div>
                                    <div className="hw-bank-card-holder">{ac.account_name}</div>
                                </div>
                                
                                <button 
                                    type="button" 
                                    className="hw-btn-copy" 
                                    onClick={() => handleCopy(ac.account_number, idx)}
                                >
                                    {copiedIdx === idx ? (
                                        <>
                                            <i className="fas fa-check" />
                                            {isEn ? 'Copied!' : 'Tersalin!'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="far fa-copy" />
                                            {isEn ? 'Copy' : 'Salin'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ==========================================================================
   SECTION 13: CLOSING & FOOTER
   ========================================================================== */
function ClosingSection({ invitation, brideGrooms, brandName }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || {};

    const hasGroomParents = !!(groom.father_name || groom.mother_name);
    const hasBrideParents = !!(bride.father_name || bride.mother_name);
    const isEn = locale === 'en';

    const cleanClosingTitle = useMemo(() => {
        const title = invitation?.closing_title || 'Thank You';
        return toTitleCase(title);
    }, [invitation?.closing_title]);

    return (
        <section id="closing" className="hw-section hw-closing">
            <Reveal>
                <h2 className="hw-closing__title">{cleanClosingTitle}</h2>
                <p className="hw-closing__text">
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.'}
                </p>
                
                <div className="hw-closing__families">
                    {hasGroomParents && (
                        <div>
                            {isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Keluarga Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </div>
                    )}
                    {hasBrideParents && (
                        <div style={{ marginTop: '10px' }}>
                            {isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Keluarga Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </div>
                    )}
                </div>

                <p className="hw-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME COMPONENT (DYNAMIC INDEX)
   ═══════════════════════════════════════ */
export default function DynamicIndex({
    invitation,
    sections = [],
    brideGrooms = [],
    events = [],
    galleries = [],
    loveStories = [],
    bankAccounts = [],
    guest = null,
    wishes = [],
    show_free_badge = false,
    trial_expires_at = 0,
    brand_name = 'Groovy digital',
    isDemo = false
}) {
    const { t, locale } = useTranslation();
    const audioRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Visibility-aware background audio control
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const layoutMode = invitation?.layout_mode || 'scroll'; // 'scroll', 'slide-h', 'slide-v'
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v';

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || brand_name 
        || 'TrueLove Invitation';

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const [showQr, setShowQr] = useState(false);

    // Slides setup
    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    // Apply global flags
    globalShowPhotos = parseBool(invitation?.show_photos, true);
    globalShowAnimations = parseBool(invitation?.show_animations, true);

    // Filter and map out active sections
    const resolvedSections = useMemo(() => {
        const list = safeArr(sections).filter(s => s.is_visible);
        
        // Exclude cover and countdown sections since they are handled separately
        let filtered = list.filter(s => s.section_key !== 'cover' && s.section_key !== 'countdown');
        
        // Deduplicate wishes if RSVP is active
        const hasRsvp = filtered.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            filtered = filtered.filter(s => s.section_key !== 'wishes');
        }
        
        // Filter out livestream if empty
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || (Array.isArray(primaryEvent?.streamings) && primaryEvent.streamings.length > 0);
        if (!hasStream) {
            filtered = filtered.filter(s => s.section_key !== 'livestream');
        }

        // Filter out dresscode if disabled
        const showDresscode = parseBool(invitation?.show_dresscode, false);
        if (!showDresscode) {
            filtered = filtered.filter(s => s.section_key !== 'dresscode');
        }

        // Filter out video if empty
        const videoUrl = invitation?.video_url || '';
        const embedId = getYoutubeId(videoUrl);
        if (!videoUrl || !embedId) {
            filtered = filtered.filter(s => s.section_key !== 'video');
        }

        // Filter out gallery if empty
        if (safeArr(galleries).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'gallery');
        }

        // Filter out love_story if empty
        if (safeArr(loveStories).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'love_story');
        }

        // Filter out bank if empty
        if (safeArr(bankAccounts).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'bank');
        }

        return filtered.sort((a, b) => a.sort_order - b.sort_order);
    }, [sections, events, invitation, galleries, loveStories, bankAccounts]);

    // Layout active state
    const [activeSection, setActiveSection] = useState('cover');
    const [slideIdx, setSlideIdx] = useState(0);

    // Sync activeSection with slideIdx to prevent stale closures
    useEffect(() => {
        if (!isSlideMode) return;
        const target = resolvedSections[slideIdx];
        if (target) {
            setActiveSection(target.section_key);
        }
    }, [slideIdx, resolvedSections, isSlideMode]);

    // Handle Open invitation
    const handleOpen = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
        // Unlock scroll on body if scroll mode
        if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
        // Fullscreen API trigger
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // Lock body scroll on initial load (while cover is locked)
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpened, isSlideMode]);

    // Fullscreen state listener
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
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    // Menu button navigations
    const handleNavigate = (key) => {
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx !== -1) {
                setSlideIdx(idx);
                setActiveSection(key);
            }
        } else {
            const el = document.getElementById(key);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(key);
            }
        }
    };

    // Scrollspy Observer for scroll layout
    useEffect(() => {
        if (isSlideMode || !isOpened) return;
        
        const sectionsList = resolvedSections.map(s => s.section_key);
        const observers = [];
        
        sectionsList.forEach(key => {
            const el = document.getElementById(key);
            if (!el) return;
            
            const obs = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setActiveSection(key);
                }
            }, { rootMargin: '-30% 0px -40% 0px' });
            
            obs.observe(el);
            observers.push(obs);
        });
        return () => {
            observers.forEach(o => o.disconnect());
        };
    }, [resolvedSections, isOpened, isSlideMode]);

    // Auto-scroll active navigation button to center (using scrollLeft, not scrollIntoView — more reliable for fixed nav)
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.hw-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            // Center the active button within the scrollable nav bar
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // Auto-Scroll feature in Slide Mode
    useEffect(() => {
        const isAutoScroll = parseBool(invitation?.enable_auto_scroll, false);
        if (!isSlideMode || !isOpened || !isAutoScroll) return;

        let intervalId = null;
        let timeoutId = null;
        let slideContainer = document.getElementById(`slide-${resolvedSections[slideIdx]?.section_key}`);

        if (!slideContainer) return;

        const startAutoScroll = () => {
            const scrollHeight = slideContainer.scrollHeight;
            const clientHeight = slideContainer.clientHeight;
            
            // Check if page height exceeds viewport height
            if (scrollHeight > clientHeight) {
                // Pixel by pixel scrolling
                intervalId = setInterval(() => {
                    const currentScroll = slideContainer.scrollTop;
                    const maxScroll = scrollHeight - clientHeight;
                    
                    if (currentScroll < maxScroll - 2) {
                        slideContainer.scrollTop += 1;
                    } else {
                        // Reached bottom - delay 4 seconds then transition next
                        clearInterval(intervalId);
                        timeoutId = setTimeout(() => {
                            slideContainer.scrollTop = 0; // reset
                            setSlideIdx(prev => (prev + 1) % resolvedSections.length);
                        }, 4000);
                    }
                }, 40); // speed controls
            } else {
                // Short page - delay 4 seconds then slide next
                timeoutId = setTimeout(() => {
                    setSlideIdx(prev => (prev + 1) % resolvedSections.length);
                }, 4000);
            }
        };

        // Reset positions
        slideContainer.scrollTop = 0;
        startAutoScroll();

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [slideIdx, resolvedSections, isOpened, isSlideMode, invitation?.enable_auto_scroll]);

    // Standard Section Rendering router
    const renderSection = (key) => {
        const showCountdown = parseBool(invitation?.show_countdown, true);
        
        switch (key) {
            case 'opening': {
                const showCountdown = parseBool(invitation?.show_countdown, true);
                return <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} events={events} showCountdown={showCountdown} />;
            }
            case 'bride_groom':
                return <BrideGroomSection key={key} brideGrooms={brideGrooms} />;
            case 'event':
                return <EventSection key={key} events={events} showCountdown={showCountdown} invitation={invitation} />;
            case 'love_story':
                return <LoveStorySection key={key} loveStories={loveStories} />;
            case 'livestream':
                return <LiveStreamingSection key={key} events={events} invitation={invitation} />;
            case 'dresscode':
                return <DressCodeSection key={key} invitation={invitation} />;
            case 'video':
                return <VideoSection key={key} invitation={invitation} />;
            case 'gallery':
                return <GallerySection key={key} galleries={galleries} />;
            case 'rsvp':
                return <RsvpWishesSection key={key} invitation={invitation} guest={guest} wishes={wishes} slug={invitation.slug} />;
            case 'bank':
                return <BankGiftSection key={key} bankAccounts={bankAccounts} invitation={invitation} />;
            case 'closing':
                return <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} brandName={brandName} />;
            default:
                return null;
        }
    };

    const getShortLabel = (key) => {
        const labels = {
            opening: locale === 'en' ? 'Open' : 'Pembuka',
            bride_groom: locale === 'en' ? 'Couple' : 'Mempelai',
            love_story: locale === 'en' ? 'Story' : 'Kisah',
            event: locale === 'en' ? 'Events' : 'Acara',
            livestream: locale === 'en' ? 'Live' : 'Streaming',
            dresscode: locale === 'en' ? 'Dress' : 'Busana',
            video: locale === 'en' ? 'Video' : 'Video',
            gallery: locale === 'en' ? 'Gallery' : 'Galeri',
            rsvp: locale === 'en' ? 'RSVP' : 'RSVP',
            bank: locale === 'en' ? 'Gift' : 'Kado',
            closing: locale === 'en' ? 'Close' : 'Penutup',
        };
        return labels[key] || key;
    };

    return (
        <ErrorBoundary>
            <div className={`hw-page ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                
                {/* Background music audio player */}
                {invitation?.music_url && (
                    <audio
                        ref={audioRef}
                        src={getStorageUrl(invitation.music_url)}
                        loop
                        preload="auto"
                    />
                )}

                {/* Cover section overlay */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    coverImages={coverImages}
                />

                <div className="hw-container">
                    <main className={`hw-main ${isSlideMode ? 'hw-main--slide' : ''} ${layoutMode === 'slide-h' ? 'hw-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'hw-main--slide-v' : ''}`}>
                        
                        {/* Background particle effect overlay */}
                        {invitation?.particle_type && invitation.particle_type !== 'none' && (
                            <ParticleEffect type={invitation.particle_type} />
                        )}

                        {/* Rendering dynamic sections */}
                        {!isSlideMode ? (
                            // SCROLL MODE
                            resolvedSections.map(s => (
                                <div key={s.section_key} id={s.section_key}>
                                    {renderSection(s.section_key)}
                                </div>
                            ))
                        ) : (
                            // SLIDE MODE (Horizontal or Vertical Swipe transitions)
                            resolvedSections.map((s, idx) => {
                                const isActive = idx === slideIdx;
                                const isNext = idx === (slideIdx + 1) % resolvedSections.length;
                                const isPrev = idx === (slideIdx - 1 + resolvedSections.length) % resolvedSections.length;
                                
                                return (
                                    <div
                                        key={s.section_key}
                                        id={`slide-${s.section_key}`}
                                        className={`hw-slide-container ${isActive ? 'is-active' : ''} ${isNext ? 'is-next' : ''} ${isPrev ? 'is-prev' : ''}`}
                                    >
                                        {renderSection(s.section_key)}
                                    </div>
                                );
                            })
                        )}

                        {/* Scoped Bottom Navigation Bar */}
                        {isOpened && resolvedSections.length > 0 && (
                            <nav className="hw-nav">
                                {resolvedSections.map(s => {
                                    const key = s.section_key;
                                    const isActive = activeSection === key;
                                    
                                    // Determine icon
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

                                    return (
                                        <button
                                            key={key}
                                            id={`nav-btn-${key}`}
                                            type="button"
                                            onClick={() => handleNavigate(key)}
                                            className={`hw-nav-btn ${isActive ? 'is-active' : ''}`}
                                            title={s.section_name}
                                        >
                                            <i className={icon} />
                                            <span className="hw-nav-btn-label">{getShortLabel(key)}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        )}

                        {/* Floating controls */}
                        {isOpened && (
                            <div className="hw-floating-btns">
                                {/* Floating Fullscreen toggle button */}
                                <button 
                                    type="button" 
                                    onClick={toggleFullscreen} 
                                    className="hw-fullscreen-btn"
                                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                >
                                    <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'} />
                                </button>

                                {/* Floating Music Control */}
                                {invitation?.music_url && (
                                    <button 
                                        type="button" 
                                        onClick={toggleMusic} 
                                        className="hw-music-btn"
                                        title={isPlaying ? 'Mute Music' : 'Play Music'}
                                    >
                                        {isPlaying ? (
                                            <div className="global-music-waves">
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                        ) : (
                                            <i className="fas fa-volume-xmark" />
                                        )}
                                    </button>
                                )}

                                {/* Floating QR Code checkin trigger button */}
                                {enableQr && guest && (
                                    <button
                                        type="button"
                                        onClick={() => setShowQr(true)}
                                        className="hw-qr-btn"
                                        title="Show Presence QR Code"
                                    >
                                        <i className="fas fa-qrcode" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* QR Presence modal */}
                        {enableQr && showQr && guest && (
                            <div className="hw-modal-overlay animate-fade-in" onClick={() => setShowQr(false)}>
                                <div className="hw-modal" onClick={e => e.stopPropagation()}>
                                    <h3 className="hw-modal-title">{isEn ? 'Presence QR Code' : 'QR Code Presensi'}</h3>
                                    
                                    <div className="hw-modal-qr-wrap">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=8b6b4f&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="QR Code Presensi" 
                                            style={{ width: 180, height: 180, display: 'block' }}
                                        />
                                    </div>
                                    
                                    <p className="hw-modal-desc">
                                        {isEn 
                                            ? 'Please present this QR code to the receptionist for check-in registration.' 
                                            : 'Tunjukkan QR code ini kepada petugas penerima tamu untuk melakukan konfirmasi kehadiran (check-in).'}
                                    </p>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => setShowQr(false)} 
                                        className="hw-btn-primary"
                                    >
                                        {isEn ? 'Close' : 'Tutup'}
                                    </button>
                                </div>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}
