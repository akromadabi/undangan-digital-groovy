import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';

/* ─── Standardized Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

function parseEventDate(dateString) {
    if (!dateString) return { dayNum: '', dayName: '', monthName: '', year: '' };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { dayNum: '', dayName: '', monthName: '', year: '' };
    
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'long' });
    const monthName = d.toLocaleDateString('id-ID', { month: 'long' });
    const year = d.getFullYear();
    
    return { dayNum, dayName, monthName, year };
}

function getStorageUrl(url, fallback = '') {
    if (!url) return fallback;
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

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: '24px', color: '#DA291C', background: '#080808', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>Terjadi Kesalahan Render</h2>
                <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 16px 0', maxWidth: '300px' }}>Mohon maaf, terjadi kegagalan rendering saat memuat tema sepak bola Manchester United.</p>
                <pre style={{ fontSize: '0.75rem', color: '#777', background: '#111', padding: '12px', borderRadius: '6px', whiteSpace: 'pre-wrap', textAlign: 'left', maxWidth: '100%', overflowX: 'auto' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

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
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    let baseClass = 'mu-reveal--up';
    if (variant === 'zoom') baseClass = 'mu-reveal--zoom';
    else if (variant === 'left') baseClass = 'mu-reveal--left';
    else if (variant === 'right') baseClass = 'mu-reveal--right';
    else if (variant === 'down') baseClass = 'mu-reveal--down';

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
   ELEGANT CREST ICON / DIVIDER
   ═══════════════════════════════════════ */
const CrestIcon = ({ className = '', size = 48 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield background */}
        <path d="M50 92C50 92 85 70 85 45V15L50 8L15 15V45C15 70 50 92 50 92Z" fill="url(#crest-bg-grad)" stroke="var(--mu-accent)" strokeWidth="3" />
        {/* Inner border */}
        <path d="M50 88C50 88 80 68 80 45V18L50 11.5L20 18V45C20 68 50 88 50 88Z" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        
        {/* Sailing Ship Silhouette on top half */}
        <path d="M35 38C35 38 42 22 50 22C58 22 65 38 65 38H35Z" fill="var(--mu-accent)" opacity="0.85" />
        <path d="M49 20V38" stroke="var(--mu-accent)" strokeWidth="2" />
        <path d="M30 40H70L65 44H35L30 40Z" fill="var(--mu-accent)" />
        
        {/* Red Devil Pitchfork / Silhouette on bottom half */}
        <path d="M46 54C46 52 48 50 50 50C52 50 54 52 54 54V76C54 78 52 80 50 80C48 80 46 78 46 76V54Z" fill="var(--mu-primary)" />
        <path d="M40 58C42 60 45 61 50 61C55 61 58 60 60 58" stroke="var(--mu-primary)" strokeWidth="2" strokeLinecap="round" />
        {/* Devil horns / pitchfork tips */}
        <path d="M42 52L46 55M58 52L54 55" stroke="var(--mu-primary)" strokeWidth="2.5" strokeLinecap="round" />
        
        <defs>
            <radialGradient id="crest-bg-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(50 50) rotate(90) scale(42)">
                <stop stopColor="#DA291C" />
                <stop offset="1" stopColor="#0A0A0A" />
            </radialGradient>
        </defs>
    </svg>
);

function SoccerDivider() {
    return (
        <div className="mu-divider">
            <span className="mu-divider-icon">
                <CrestIcon size={24} />
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════
   PIXEL-PERFECT INLINE SVG ICONS
   ═══════════════════════════════════════ */
const ICONS = {
    search: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    qrScan: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FBE122', cursor: 'pointer' }}>
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
            <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
    ),
};

/* ═══════════════════════════════════════
   COVER SECTION (MATCH POSTER)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showGuestName }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria' || String(b.gender).toLowerCase() === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita' || String(b.gender).toLowerCase() === 'wanita') || bgs[1];

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Fletcher & Beckham');

    // Monogram initials for the crest badge
    const initials = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'F';
        const second = bride?.nickname?.charAt(0) || 'B';
        return `${first}${second}`;
    }, [groom, bride]);

    const coverBg = getStorageUrl(invitation?.cover_image, '');
    const isEn = invitation?.language === 'en';

    return (
        <div className={`mu-cover${isOpened ? ' is-opened' : ''}`}>
            {globalShowPhotos && coverBg && <div className="mu-cover__bg" style={{ backgroundImage: `url(${coverBg})` }} />}
            <div className="mu-cover__overlay" />
            <div className="mu-cover__content">
                {/* Football Club Crest Logo */}
                <div className="mu-cover__badge-wrapper" style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '24px' }}>
                    <CrestIcon size={120} />
                    <span className="mu-cover__badge-initials" style={{ position: 'absolute', top: '48%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Jura', sans-serif", fontSize: '1.4rem', fontWeight: '800', color: 'var(--mu-accent)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{initials}</span>
                </div>

                <span className="mu-cover__matchday">{isEn ? "THE WEDDING OF" : "PERNIKAHAN DARI"}</span>
                <h1 className="mu-cover__couple">{coupleName}</h1>

                {showGuestName && guest && (
                    <>
                        <p className="mu-cover__dear">{isEn ? "TO OUR HONORED GUEST:" : "KEPADA YTH. BAPAK/IBU/SAUDARA/I:"}</p>
                        <div className="mu-cover__guest">{guestName}</div>
                        <p className="mu-cover__apology">{t('invitation.dear_guest_desc')}</p>
                    </>
                )}

                <button type="button" onClick={onOpen} id="tombol-buka" className="mu-cover__btn">
                    ✨ {isEn ? "OPEN INVITATION" : "BUKA UNDANGAN"}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   HERO / COUNTDOWN SECTION (SCOREBOARD)
   ═══════════════════════════════════════ */
function HeroSection({ invitation, brideGrooms, events, galleries, layoutMode, showCountdown }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = primaryEvent?.event_date || '';
    const targetTime = primaryEvent?.start_time || '08:00';

    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [bgIdx, setBgIdx] = useState(0);

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Fletcher & Beckham');

    const formattedDate = useMemo(() => {
        if (!targetDate) return '';
        const d = new Date(targetDate);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }, [targetDate]);

    // Timer countdown scoreboard
    useEffect(() => {
        if (!targetDate) return;
        const dateStr = String(targetDate).substring(0, 10);
        const timeStr = String(targetTime).substring(0, 5);
        const target = new Date(`${dateStr}T${timeStr}:00`);

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

    // Slideshow images
    const pics = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length > 0) {
            return list.map(p => getStorageUrl(p.image_path || p.image_url));
        }
        return [getStorageUrl(invitation?.cover_image, '')];
    }, [galleries, invitation]);

    useEffect(() => {
        if (pics.length <= 1) return;
        const interval = setInterval(() => {
            setBgIdx(prev => (prev + 1) % pics.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [pics]);

    const isHorizontal = layoutMode === 'slide-h';
    const isEn = invitation?.language === 'en';

    return (
        <section id="hero" className="mu-hero">
            {globalShowPhotos && pics.map((src, idx) => (
                <div
                    key={src}
                    className={`mu-hero__bg ${idx === bgIdx ? 'is-active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}
            <div className="mu-hero__overlay" />
            <div className="mu-hero__content">
                <Reveal delay={200}>
                    <span className="mu-hero__matchday">{isEn ? "THE WEDDING CELEBRATION" : "PERAYAAN PERNIKAHAN"}</span>
                </Reveal>
                <Reveal delay={400}>
                    <h1 className="mu-hero__couple">{coupleName}</h1>
                </Reveal>
                <Reveal delay={600}>
                    <span className="mu-hero__date">{formattedDate} | {isEn ? "TIME" : "PUKUL"}: {formatTime(targetTime)} {primaryEvent?.timezone || 'WIB'}</span>
                </Reveal>
                
                {showCountdown && (
                    <Reveal delay={800}>
                        <div className="mu-scoreboard">
                            <div className="mu-scoreboard__panel">
                                <span className="mu-scoreboard__num">{pad2(timeLeft.d)}</span>
                                <span className="mu-scoreboard__label">{isEn ? "Days" : "Hari"}</span>
                            </div>
                            <span className="mu-scoreboard__divider">:</span>
                            <div className="mu-scoreboard__panel">
                                <span className="mu-scoreboard__num">{pad2(timeLeft.h)}</span>
                                <span className="mu-scoreboard__label">{isEn ? "Hrs" : "Jam"}</span>
                            </div>
                            <span className="mu-scoreboard__divider">:</span>
                            <div className="mu-scoreboard__panel">
                                <span className="mu-scoreboard__num">{pad2(timeLeft.m)}</span>
                                <span className="mu-scoreboard__label">{isEn ? "Mins" : "Mnt"}</span>
                            </div>
                            <span className="mu-scoreboard__divider">:</span>
                            <div className="mu-scoreboard__panel">
                                <span className="mu-scoreboard__num">{pad2(timeLeft.s)}</span>
                                <span className="mu-scoreboard__label">{isEn ? "Secs" : "Dtk"}</span>
                            </div>
                        </div>
                    </Reveal>
                )}
                
                <div className={`mu-hero__arrow`}>
                    <i className={isHorizontal ? "fas fa-chevron-right" : "fas fa-chevron-down"} />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (THE KICK-OFF)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};
    const first = groom?.nickname?.charAt(0) || 'F';
    const second = bride?.nickname?.charAt(0) || 'B';

    return (
        <section id="opening" className="mu-section mu-opening">
            <Reveal>
                <div className="mu-opening__initials">
                    <span>{first} &amp; {second}</span>
                </div>
                <h2 className="mu-section-title">{invitation?.opening_title || 'THE KICK-OFF'}</h2>
                <div style={{ height: '10px' }} />
                
                {invitation?.opening_ayat && (
                    <div style={{ margin: '20px 0' }}>
                        <p className="mu-opening__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                        {invitation?.opening_ayat_source && (
                            <p className="mu-opening__source">&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}
                
                <p className="mu-opening__text">
                    {invitation?.opening_text || 'Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menyaksikan Kick-off babak baru kehidupan kami di lapangan suci ikatan pernikahan.'}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION (STARTING LINEUP)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, invitation }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita') || bgs[1] || {};

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
        const isWanita = gender === 'wanita' || gender === 'female' || String(gender).toLowerCase() === 'wanita';
        
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

    const isEn = invitation?.language === 'en';
    const groomPhoto = getStorageUrl(groom.photo, '');
    const bridePhoto = getStorageUrl(bride.photo, '');

    return (
        <section id="bride_groom" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "THE HAPPY COUPLE" : "KEDUA MEMPELAI"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Bride & Groom" : "Mempelai Pria & Wanita"}</p>
            </Reveal>

            <div className="mu-couple-grid">
                {/* Groom Player Card */}
                {groom.full_name && (
                    <Reveal variant="left" className="mu-player-card">
                        <div className="mu-player-card__badge" style={{ padding: '4px 8px' }}>
                            <span className="mu-player-card__number">#07</span>
                        </div>
                        {globalShowPhotos && groom.photo && (
                            <div className="mu-player-photo-wrap">
                                <img src={groomPhoto} alt={groom.full_name} className="mu-player-photo" />
                            </div>
                        )}
                        <div className="mu-player-info">
                            <h3 className="mu-player-name">{groom.full_name}</h3>
                            <p className="mu-player-parent-label">{translateChildOrder(groom.child_order, 'pria')}</p>
                            <p className="mu-player-parents">
                                {groom.father_name && groom.mother_name 
                                    ? `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`
                                    : (groom.father_name || groom.mother_name || '')}
                            </p>
                            <p className="mu-player-bio" style={{ fontSize: '0.74rem', color: 'var(--mu-text-secondary)', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                                {groom.bio}
                            </p>
                            {groom.instagram && (
                                <a href={`https://instagram.com/${groom.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="mu-player-ig">
                                    <i className="fab fa-instagram" />
                                </a>
                            )}
                        </div>
                    </Reveal>
                )}

                <div className="mu-couple-crest-divider" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px 0' }}>
                    <CrestIcon size={48} />
                </div>

                {/* Bride Player Card */}
                {bride.full_name && (
                    <Reveal variant="right" className="mu-player-card">
                        <div className="mu-player-card__badge" style={{ padding: '4px 8px' }}>
                            <span className="mu-player-card__number">#09</span>
                        </div>
                        {globalShowPhotos && bride.photo && (
                            <div className="mu-player-photo-wrap">
                                <img src={bridePhoto} alt={bride.full_name} className="mu-player-photo" />
                            </div>
                        )}
                        <div className="mu-player-info">
                            <h3 className="mu-player-name">{bride.full_name}</h3>
                            <p className="mu-player-parent-label">{translateChildOrder(bride.child_order, 'wanita')}</p>
                            <p className="mu-player-parents">
                                {bride.father_name && bride.mother_name 
                                    ? `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`
                                    : (bride.father_name || bride.mother_name || '')}
                            </p>
                            <p className="mu-player-bio" style={{ fontSize: '0.74rem', color: 'var(--mu-text-secondary)', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
                                {bride.bio}
                            </p>
                            {bride.instagram && (
                                <a href={`https://instagram.com/${bride.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="mu-player-ig">
                                    <i className="fab fa-instagram" />
                                </a>
                            )}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION (MATCH DETAILS)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation }) {
    const { t } = useTranslation();
    const list = safeArr(events);
    const isEn = invitation?.language === 'en';

    return (
        <section id="event" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "WEDDING FIxture" : "ACARA PERNIKAHAN"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Wedding Schedule" : "Jadwal Rangkaian Acara"}</p>
            </Reveal>

            {list.map((evt, idx) => {
                const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date);
                const isEven = idx % 2 === 0;
                
                // Akad = First Half, Resepsi = Second Half, others = Extra Time
                let periodName = isEn ? "EVENT" : "ACARA";
                if (evt.event_type === 'akad' || evt.event_name?.toLowerCase().includes('akad')) {
                    periodName = isEn ? "AKAD NIKAH" : "AKAD NIKAH";
                } else if (evt.event_type === 'resepsi' || evt.event_name?.toLowerCase().includes('resepsi')) {
                    periodName = isEn ? "RESEPSI" : "RESEPSI PERNIKAHAN";
                }

                return (
                    <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="mu-event-card">
                        <div className="mu-event-header">
                            <h3 className="mu-event-name">{evt.event_name}</h3>
                            <span className="mu-event-badge">{periodName}</span>
                        </div>
                        
                        <div className="mu-event-row">
                            <i className="far fa-calendar-alt mu-event-icon" />
                            <div>
                                <strong>{dayName}, {dayNum} {monthName} {year}</strong>
                            </div>
                        </div>
                        
                        <div className="mu-event-row">
                            <i className="far fa-clock mu-event-icon" />
                            <div>
                                {isEn ? "Time" : "Pukul"}: {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : ' - Selesai'} {evt.timezone || 'WIB'}
                            </div>
                        </div>

                        <div className="mu-event-row">
                            <i className="fas fa-map-marker-alt mu-event-icon" />
                            <div className="mu-event-location">
                                <span className="mu-event-venue">{evt.venue_name}</span>
                                <p style={{ margin: '4px 0 0 0', color: 'var(--mu-text-secondary)' }}>{evt.venue_address}</p>
                            </div>
                        </div>

                        {evt.gmaps_link && (
                            <a href={evt.gmaps_link} target="_blank" rel="noreferrer" className="mu-event-btn">
                                🗺️ {isEn ? "View Location Map" : "Buka Peta Lokasi"}
                            </a>
                        )}
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION (LIVE BROADCAST)
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation }) {
    const { t } = useTranslation();
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
    const isEn = invitation?.language === 'en';

    return (
        <section id="livestream" className="mu-section" style={{ textAlign: 'center' }}>
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "LIVE BROADCAST" : "SIARAN LANGSUNG"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Virtual Streaming" : "Siaran Streaming Langsung"}</p>
                
                <div style={{ margin: '30px 0' }}>
                    {streamsList.map((stream, idx) => (
                        <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="mu-submit-btn" style={{ maxWidth: '280px', margin: '10px auto' }}>
                            📺 WATCH {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (MATCH HIGHLIGHTS)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, invitation }) {
    const list = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    if (list.length === 0) return null;
    const isEn = invitation?.language === 'en';

    return (
        <section id="love_story" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "OUR LOVE STORY" : "KISAH CINTA KAMI"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Our Love Journey" : "Perjalanan Kasih Kami"}</p>
            </Reveal>

            <div className="mu-timeline">
                {list.map((story, idx) => {
                    const marker = "❤️";
                    const isEven = idx % 2 === 0;

                    return (
                        <div key={story.id || idx} className="mu-timeline-node">
                            <span className="mu-timeline-marker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{marker}</span>
                            <Reveal variant={isEven ? 'left' : 'right'} className="mu-timeline-card">
                                <div className="mu-timeline-header">
                                    <span className="mu-timeline-time">{story.title}</span>
                                    <span className="mu-timeline-date">
                                        {story.story_date ? (isNaN(new Date(story.story_date).getTime()) ? story.story_date : new Date(story.story_date).toLocaleDateString('id-ID', { year: 'numeric' })) : ''}
                                    </span>
                                </div>
                                <p className="mu-timeline-desc">{story.description || story.story}</p>
                            </Reveal>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   GALLERY SECTION (MATCH SNAPSHOTS)
   ═══════════════════════════════════════ */
function GallerySection({ galleries, invitation }) {
    const list = safeArr(galleries);
    if (list.length === 0) return null;
    const isEn = invitation?.language === 'en';

    return (
        <section id="gallery" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "MATCH SNAPSHOTS" : "GALERI MEMOAR"}</h2>
                <p className="mu-section-subtitle">Match Gallery</p>
            </Reveal>

            <div className="mu-gallery-grid">
                {list.map((pic, idx) => {
                    const imgUrl = getStorageUrl(pic.image_path || pic.image_url);
                    return (
                        <Reveal key={pic.id || idx} variant="zoom" className="mu-gallery-item">
                            <img src={imgUrl} alt={pic.caption || 'Gallery photo'} className="mu-gallery-img" />
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES SECTION (MATCH PASS TICKET & SUPPORT CHANTS)
   ═══════════════════════════════════════ */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const activeGuest = guest || { name: '', id: null };
    const [senderName, setSenderName] = useState(activeGuest.name || '');
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

    const isEn = invitation?.language === 'en';

    const handleSubmit = (e) => {
        e.preventDefault();
        rsvpForm.setData('sender_name', senderName);
        rsvpForm.setData('attendance', attendance);
        rsvpForm.setData('number_of_guests', numGuests);
        
        wishForm.setData('sender_name', senderName);
        wishForm.setData('message', message);

        const doWishSubmit = () => {
            if (enableWishes && message.trim()) {
                wishForm.post(route('invitation.wish', invitation.slug), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage('');
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 5000);
                    }
                });
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            }
        };

        if (enableRsvp) {
            rsvpForm.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: doWishSubmit,
            });
        } else {
            doWishSubmit();
        }
    };

    const isSubmitting = rsvpForm.processing || wishForm.processing;
    const chantsList = safeArr(wishes).slice(0, 10);

    return (
        <section id="rsvp" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "RSVP & WISHES" : "KONFIRMASI KEHADIRAN"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Kindly respond to our invitation" : "Mohon Konfirmasi Kehadiran & Doa Restu Anda"}</p>
            </Reveal>

            {(enableRsvp || enableWishes) && (
                <Reveal variant="zoom" className="mu-ticket">
                    <div className="mu-ticket-header">
                        <h4 className="mu-ticket-title">✉️ {isEn ? "ATTENDANCE CONFIRMATION" : "KONFIRMASI KEHADIRAN"}</h4>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mu-ticket-body">
                        {/* Name Field */}
                        <div className="mu-field">
                            <label className="mu-label">{isEn ? "Guest Name" : "Nama Lengkap"}</label>
                            <input
                                type="text"
                                className="mu-input"
                                placeholder={isEn ? "Enter name..." : "Masukkan nama lengkap..."}
                                required
                                readOnly={!!activeGuest.name}
                                value={senderName}
                                onChange={e => setSenderName(e.target.value)}
                            />
                        </div>

                        {/* RSVP Attendance */}
                        {enableRsvp && (
                            <div className="mu-field">
                                <label className="mu-label">{isEn ? "Confirmation" : "Konfirmasi Kehadiran"}</label>
                                <div className="mu-rsvp-options">
                                    <button
                                        type="button"
                                        className={`mu-rsvp-btn ${attendance === 'hadir' ? 'is-active' : ''}`}
                                        onClick={() => setAttendance('hadir')}
                                    >
                                        ✨ {isEn ? "ATTEND" : "HADIR"}
                                    </button>
                                    <button
                                        type="button"
                                        className={`mu-rsvp-btn ${attendance === 'masih_ragu' ? 'is-active' : ''}`}
                                        onClick={() => setAttendance('masih_ragu')}
                                    >
                                        📋 {isEn ? "UNSURE" : "MASIH RAGU"}
                                    </button>
                                    <button
                                        type="button"
                                        className={`mu-rsvp-btn ${attendance === 'tidak_hadir' ? 'is-active' : ''}`}
                                        onClick={() => setAttendance('tidak_hadir')}
                                    >
                                        ❌ {isEn ? "ABSENT" : "TIDAK HADIR"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Qty Stepper */}
                        {enableRsvp && attendance === 'hadir' && (
                            <div className="mu-field">
                                <label className="mu-label">{isEn ? "Number of Guests" : "Jumlah Tamu"}</label>
                                <div className="mu-qty">
                                    <button type="button" className="mu-qty-btn" onClick={() => setNumGuests(Math.max(1, numGuests - 1))}>−</button>
                                    <span className="mu-qty-val">{numGuests}</span>
                                    <button type="button" className="mu-qty-btn" onClick={() => setNumGuests(Math.min(10, numGuests + 1))}>+</button>
                                </div>
                            </div>
                        )}

                        {/* Message field */}
                        {enableWishes && (
                            <div className="mu-field">
                                <label className="mu-label">{isEn ? "Doa Restu & Wishes" : "Doa Restu & Ucapan"}</label>
                                <textarea
                                    className="mu-input"
                                    rows="3"
                                    required={!enableRsvp}
                                    placeholder={isEn ? "Write your wishes..." : "Tuliskan doa & ucapan terbaik Anda..."}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>
                        )}

                        <button type="submit" disabled={isSubmitting} className="mu-submit-btn">
                            🎫 {isSubmitting ? (isEn ? "SUBMITTING..." : "MENGIRIM...") : (isEn ? "CONFIRM ATTENDANCE" : "KIRIM KONFIRMASI")}
                        </button>

                        {success && (
                            <p style={{ color: '#27ae60', fontSize: '0.72rem', fontWeight: 'bold', textAlign: 'center', marginTop: '12px', margin: 0 }}>
                                🎉 {isEn ? "Attendance confirmed successfully!" : "Konfirmasi kehadiran berhasil dikirim!"}
                            </p>
                        )}
                    </form>
                </Reveal>
            )}

            {/* Wishes/Chants tribune */}
            {enableWishes && chantsList.length > 0 && (
                <div className="mu-chants">
                    <h3 className="mu-chants-title">📢 {isEn ? "Wishes & Prayers" : "Doa Restu & Ucapan Tamu"}</h3>
                    <div className="mu-chants-list">
                        {chantsList.map((w, idx) => (
                            <div key={idx} className="mu-chant-card">
                                <div className="mu-chant-sender">
                                    <span>✨</span>
                                    <span>{w.sender_name}</span>
                                </div>
                                <p className="mu-chant-msg">{w.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK SECTION (TRANSFER WINDOW / SPONSORSHIP)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, invitation }) {
    const list = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const isEn = invitation?.language === 'en';

    const copyToClipboard = (text, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2500);
            }).catch(() => fallbackCopy(text, idx));
        } else {
            fallbackCopy(text, idx);
        }
    };

    const fallbackCopy = (text, idx) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2500);
        } catch (e) {
            console.error(e);
        }
        document.body.removeChild(ta);
    };

    if (list.length === 0) return null;

    return (
        <section id="bank" className="mu-section">
            <Reveal>
                <h2 className="mu-section-title">{isEn ? "DIGITAL GIFT" : "KADO DIGITAL"}</h2>
                <p className="mu-section-subtitle">{isEn ? "Wedding Gift / E-Wallet" : "Dompet Digital / Amplop Pernikahan"}</p>
            </Reveal>

            <div className="mu-bank-grid">
                {list.map((acc, idx) => (
                    <Reveal key={idx} variant="zoom" className="mu-bank-card">
                        <span className="mu-bank-badge">{acc.bank_name || "Official Bank"}</span>
                        <p className="mu-bank-acc">{acc.account_number}</p>
                        <p className="mu-bank-holder">a.n. {acc.account_holder || acc.account_name}</p>
                        <button type="button" className="mu-bank-copy-btn" onClick={() => copyToClipboard(acc.account_number, idx)}>
                            {copiedIdx === idx ? (isEn ? "✓ Copied" : "✓ Berhasil Disalin") : (isEn ? "Copy Account" : "Salin No. Rekening")}
                        </button>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (FULL-TIME)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const isEn = invitation?.language === 'en';
    const resellerName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'Undangan Digital Groovy';

    return (
        <section id="closing" className="mu-section mu-closing" style={{ borderBottom: 'none' }}>
            <Reveal>
                <h2 className="mu-closing__thanks">{invitation?.closing_title || "FULL-TIME"}</h2>
                <p className="mu-closing__text">
                    {invitation?.closing_text || "Merupakan kehormatan bagi kami atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian di hari bahagia kami. Glory Glory Manchester United!"}
                </p>

                {/* Family signatures */}
                {(hasGroomParents || hasBrideParents) && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', margin: '30px 0' }}>
                        {hasGroomParents && (
                            <div>
                                <p className="mu-closing__family">{isEn ? "Family of Groom:" : "Kel. Mempelai Pria:"}</p>
                                <p style={{ fontSize: '0.74rem', color: 'var(--mu-text-secondary)', margin: '4px 0 0 0' }}>
                                    Bapak {groomFather} <br /> &amp; Ibu {groomMother}
                                </p>
                            </div>
                        )}
                        {hasBrideParents && (
                            <div>
                                <p className="mu-closing__family">{isEn ? "Family of Bride:" : "Kel. Mempelai Wanita:"}</p>
                                <p style={{ fontSize: '0.74rem', color: 'var(--mu-text-secondary)', margin: '4px 0 0 0' }}>
                                    Bapak {brideFather} <br /> &amp; Ibu {brideMother}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <p className="mu-watermark">
                    Made with ❤️ by <br />
                    <strong style={{ color: 'var(--mu-primary)' }}>{resellerName}</strong>
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   NAVIGATION BOTTOM BAR COMPONENT
   ═══════════════════════════════════════ */
function Navigation({
    invitation,
    isOpened,
    isPlaying,
    onToggleMusic,
    scrollToSection,
    activeMenuId,
    resolvedSections,
    enableRsvp,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen
}) {
    if (!isOpened) return null;

    const isEn = invitation?.language === 'en';

    // Unique sections for nav
    const menuItems = useMemo(() => {
        const unique = [];
        const seen = new Set();
        resolvedSections.forEach(s => {
            let key = s.section_key;
            if (key === 'hero') return;
            if (key === 'wishes' && enableRsvp) return; // merged in rsvp
            if (key === 'livestream') return; // hidden from nav to keep spacing clean
            if (!key) return;

            if (!seen.has(key)) {
                seen.add(key);
                // Map icons
                let icon = 'fas fa-envelope';
                let label = isEn ? 'Home' : 'Beranda';

                if (key === 'opening') { icon = 'fas fa-door-open'; label = isEn ? 'Opening' : 'Pembuka'; }
                else if (key === 'bride_groom') { icon = 'fas fa-users'; label = isEn ? 'Couple' : 'Mempelai'; }
                else if (key === 'event') { icon = 'fas fa-calendar-alt'; label = isEn ? 'Events' : 'Acara'; }
                else if (key === 'love_story') { icon = 'fas fa-history'; label = isEn ? 'Story' : 'Kisah'; }
                else if (key === 'gallery') { icon = 'fas fa-images'; label = isEn ? 'Gallery' : 'Galeri'; }
                else if (key === 'rsvp') { icon = 'fas fa-ticket-alt'; label = isEn ? 'RSVP' : 'RSVP'; }
                else if (key === 'bank') { icon = 'fas fa-wallet'; label = isEn ? 'Gift' : 'Kado'; }
                else if (key === 'closing') { icon = 'fas fa-flag-checkered'; label = isEn ? 'Closing' : 'Penutup'; }

                unique.push({ id: key, icon, label });
            }
        });
        return unique.slice(0, 5); // Max 5 items for mobile bottom bar
    }, [resolvedSections, enableRsvp, isEn]);

    return (
        <>
            <div className="mu-float-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        className={`mu-nav-item ${activeMenuId === item.id ? 'is-active' : ''}`}
                        onClick={() => scrollToSection(item.id)}
                        title={item.label}
                    >
                        <i className={item.icon} />
                    </button>
                ))}
            </div>

            {/* Sound toggle floating button */}
            {invitation?.music_url && (
                <div className="mu-float-audio">
                    <button type="button" className="mu-float-audio-btn" onClick={onToggleMusic}>
                        {isPlaying ? "🎵" : "🔇"}
                    </button>
                </div>
            )}

            {/* Floating controls bottom-right */}
            <div className="mu-floating-controls" style={{ position: 'fixed', bottom: '90px', right: '20px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 997 }}>
                <button
                    type="button"
                    className="mu-float-audio-btn"
                    onClick={toggleFullscreen}
                    style={isFullscreen ? { backgroundColor: 'var(--mu-primary)', color: '#fff' } : {}}
                    title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} style={{ fontSize: '14px' }} />
                </button>
                
                {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="mu-float-audio-btn"
                        onClick={() => setAutoScrollEnabled(p => !p)}
                        style={autoScrollEnabled ? { backgroundColor: 'var(--mu-primary)', color: '#fff' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} style={{ fontSize: '14px' }} />
                    </button>
                )}
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT EXPORT
   ═══════════════════════════════════════ */
export default function DynamicIndex({
    invitation,
    sections,
    brideGrooms,
    events,
    galleries,
    loveStories,
    bankAccounts,
    guest,
    wishes
}) {
    const { t } = useTranslation(invitation?.language || 'id');
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
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

    const guestName = guest?.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null) || 'Tamu Undangan';
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';

    // Boolean settings from admin
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const showCountdown = parseBool(invitation?.show_countdown);
    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    const showGuestName = parseBool(invitation?.show_guest_name, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    const [showQr, setShowQr] = useState(false);

    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

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

    // Document Title
    useEffect(() => {
        const groom = safeArr(brideGrooms).find(b => b.gender === 'pria');
        const bride = safeArr(brideGrooms).find(b => b.gender === 'wanita');
        if (groom?.nickname && bride?.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Kick-Off`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, brideGrooms]);

    // Handle Open
    const handleOpen = () => {
        setIsOpened(true);
        if (audioRef.current && musicAutoplay) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    };

    // Lock body overflow initially
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    }, [isOpened, isSlideMode]);

    // Toggle Music
    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.muted = true;
            setIsPlaying(false);
        } else {
            audio.muted = false;
            if (audio.paused) {
                audio.play().catch(() => { });
            }
            setIsPlaying(true);
        }
    }, [isPlaying]);

    // Resolve active sections in database & fallback
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        const resolved = [];

        // Prepend virtual hero section
        resolved.push({ section_key: 'hero' });

        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);

            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery' && !(galleries?.length > 0)) return;
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                
                // Skip standalone countdown (integrated in event)
                if (s.section_key === 'countdown') return;

                // Skip wishes if RSVP is active (merged)
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return;
                }

                resolved.push(s);
                if (s.section_key === 'event' && hasStream) {
                    resolved.push({ section_key: 'livestream' });
                }
            });
        } else {
            // Fallback list
            const fallbacks = [
                { section_key: 'opening' },
                { section_key: 'bride_groom' },
                { section_key: 'event' },
            ];

            if (hasStream) {
                fallbacks.push({ section_key: 'livestream' });
            }

            if (loveStories?.length > 0) fallbacks.push({ section_key: 'love_story' });
            if (galleries?.length > 0) fallbacks.push({ section_key: 'gallery' });
            if (enableRsvp) {
                fallbacks.push({ section_key: 'rsvp' });
            } else if (enableWishes) {
                fallbacks.push({ section_key: 'wishes' });
            }
            if (bankAccounts?.length > 0) fallbacks.push({ section_key: 'bank' });
            fallbacks.push({ section_key: 'closing' });

            resolved.push(...fallbacks);
        }

        return resolved;
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes, showCountdown]);

    // Slide mode: Sync activeSectionId with activeSlideIdx
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            if (key === 'hero') {
                setActiveSectionId('opening'); // highlight first item when on hero slide
            } else {
                setActiveSectionId(key);
            }
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

    // Scroll mode: track scroll spy to update activeSectionId
    useEffect(() => {
        if (!isOpened || isSlideMode) return;

        const handleScroll = () => {
            const keys = resolvedSections.map(s => {
                let k = s.section_key;
                if (k === 'wishes' && enableRsvp) return 'rsvp';
                return k;
            });
            const uniqueKeys = [...new Set(keys)].filter(k => k !== 'hero');

            let currentActive = uniqueKeys[0] || 'opening';
            
            uniqueKeys.forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 250 && rect.bottom > 100) {
                        currentActive = key;
                    }
                }
            });
            setActiveSectionId(currentActive);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, enableRsvp]);

    // Auto scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
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
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Slide navigation functions
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    // Scroll to section handler
    const scrollToSection = (id) => {
        setAutoScrollEnabled(false);
        let targetId = id;
        if (id === 'wishes' && enableRsvp) {
            targetId = 'rsvp';
        }

        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === targetId);
            if (idx !== -1) setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Touch & swipe gestures mapping
    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: false, atBottom: false });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        let atTop = false;
        let atBottom = false;

        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.mu-slide-container');
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

        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);

        if (layoutMode === 'slide-h') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) nextSlide();
                else prevSlide();
            }
        } else {
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.mu-slide-container') : null;
                if (scrollable) {
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;

                    if (diffY < 0 && isAtBottom) nextSlide();
                    else if (diffY > 0 && isAtTop) prevSlide();
                } else {
                    if (diffY < 0) nextSlide();
                    else prevSlide();
                }
            }
        }
    };

    const handleTouchStart = (e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    const handleTouchEnd = (e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);
    const handleMouseDown = (e) => handlePointerDown(e.clientX, e.clientY, e.target);
    const handleMouseUp = (e) => handlePointerUp(e.clientX, e.clientY, e.target);
    const handleMouseLeave = () => { isDragging.current = false; };

    const handleWheel = (e) => {
        if (!isSlideMode) return;
        if (scrollTimeout.current) return;

        const target = e.target.closest('.mu-slide-container');
        if (target && target.scrollHeight > target.clientHeight) {
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;

            if (e.deltaY > 0 && !isAtBottom) return;
            if (e.deltaY < 0 && !isAtTop) return;
        }

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800);

        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    };

    const renderSectionComponent = (section, idx) => {
        const key = section.section_key;

        const componentMap = {
            'hero': <HeroSection key={key} invitation={invitation} brideGrooms={brideGrooms} events={events} galleries={galleries} layoutMode={layoutMode} showCountdown={showCountdown} />,
            'opening': <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} />,
            'bride_groom': <BrideGroomSection key={key} brideGrooms={brideGrooms} invitation={invitation} />,
            'countdown': null, 
            'event': <EventSection key={key} events={events} invitation={invitation} />,
            'livestream': <LiveStreamingSection key={key} events={events} invitation={invitation} />,
            'love_story': <LoveStorySection key={key} loveStories={loveStories} invitation={invitation} />,
            'gallery': <GallerySection key={key} galleries={galleries} invitation={invitation} />,
            'bank': <BankSection key={key} bankAccounts={bankAccounts} invitation={invitation} />,
            'rsvp': <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} />,
            'wishes': enableRsvp ? null : <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={true} />,
            'closing': <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} />,
        };

        const comp = componentMap[key];
        if (!comp) return null;

        if (isSlideMode) {
            let slideClass = 'mu-slide-container';
            if (idx === activeSlideIdx) slideClass += ' is-active';
            else if (idx > activeSlideIdx) slideClass += ' is-next';
            else slideClass += ' is-prev';

            return (
                <div key={key} className={slideClass}>
                    {comp}
                </div>
            );
        }

        return (
            <React.Fragment key={key}>
                {comp}
                {key !== 'closing' && key !== 'hero' && <SoccerDivider />}
            </React.Fragment>
        );
    };

    const activeGroomGroom = safeArr(brideGrooms).find(b => b.gender === 'pria') || brideGrooms?.[0];
    const waNumber = activeGroomGroom?.phone || '';
    const isEn = invitation?.language === 'en';

    return (
        <ErrorBoundary>
            <div className={`mu-page ${!showAnimations ? 'mu-no-animations' : ''}`}>
                
                {/* Audio music player */}
                {invitation?.music_url && (
                    <audio ref={audioRef} loop preload="auto" playsInline>
                        <source src={getStorageUrl(invitation.music_url, '')} type="audio/mpeg" />
                    </audio>
                )}

                {/* Cover Match Poster overlay */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    showGuestName={showGuestName}
                />

                {/* Main View Area */}
                <div className="mu-container">
                    {/* Fixed Top Search Bar inside theme for Presensi QR trigger */}
                    {isOpened && (
                        <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '380px', height: '40px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--mu-border)', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', boxSizing: 'border-box', zIndex: 997, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', fontSize: '0.74rem' }}>
                                <span style={{ color: 'var(--mu-primary)', display: 'flex' }}>{ICONS.search}</span>
                                <span>{isEn ? "Search details..." : "Cari informasi..."}</span>
                            </div>
                            {enableQr && activeGuest && (
                                <span className="mu-search-qr-btn" onClick={() => setShowQr(true)}>
                                    {ICONS.qrScan}
                                </span>
                            )}
                        </div>
                    )}

                    <div
                        className={`mu-main ${isSlideMode ? 'mu-main--slide' : ''} ${layoutMode === 'slide-h' ? 'mu-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'mu-main--slide-v' : ''}`}
                        onTouchStart={isSlideMode ? handleTouchStart : undefined}
                        onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                        onMouseDown={isSlideMode ? handleMouseDown : undefined}
                        onMouseUp={isSlideMode ? handleMouseUp : undefined}
                        onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                        onWheel={isSlideMode ? handleWheel : undefined}
                        style={{ paddingTop: isOpened ? '65px' : '0' }}
                    >
                        {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                    </div>
                </div>

                {/* WhatsApp Floating Button on Bottom Left */}
                {waNumber && isOpened && (
                    <div className="mu-whatsapp-float">
                        <a
                            href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mu-whatsapp-btn"
                            title="Hubungi Mempelai"
                        >
                            <i className="fab fa-whatsapp" />
                        </a>
                    </div>
                )}

                {/* Menu Nav & Raised Floaters */}
                <Navigation
                    invitation={invitation}
                    isOpened={isOpened}
                    isPlaying={isPlaying}
                    onToggleMusic={toggleMusic}
                    scrollToSection={scrollToSection}
                    activeMenuId={activeSectionId}
                    resolvedSections={resolvedSections}
                    enableRsvp={enableRsvp}
                    autoScrollEnabled={autoScrollEnabled}
                    setAutoScrollEnabled={setAutoScrollEnabled}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={toggleFullscreen}
                />

                {/* QR Code Check-in Modal */}
                {enableQr && showQr && activeGuest && (
                    <div className="mu-qr-modal-overlay" onClick={() => setShowQr(false)}>
                        <div className="mu-qr-modal-card" onClick={e => e.stopPropagation()}>
                            <h3 className="mu-qr-modal-title">{isEn ? "VVIP Guest Pass" : "Pass Masuk VVIP"}</h3>
                            <p className="mu-qr-modal-guest-name">{activeGuest.name}</p>
                            <div className="mu-qr-code-box">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=da291c&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                    alt="QR Code"
                                    className="mu-qr-code-image"
                                />
                            </div>
                            <p className="mu-qr-modal-footer">
                                {isEn ? "Show this QR code at the guest registration desk" : "Tunjukkan kode QR ini pada meja registrasi tamu"}
                            </p>
                            <button onClick={() => setShowQr(false)} className="mu-qr-close-btn">
                                {isEn ? "Close" : "Tutup"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    );
}
