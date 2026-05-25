import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Import theme assets via Vite
import logoDana from './asset/1200px-Logo_dana_blue.svg-1-1-1.png';
import heartSvg from './asset/2764.svg';
import logoBca from './asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1.png';
import chipAtm from './asset/chip-atm-1-2-1-1-1.png';
import defaultCover from './asset/fres-G-14-e1725604862814.jpg';
import defaultGroom from './asset/fres-PROFIL-CROP-Copy-2-e1725605032416.jpg';
import defaultBride from './asset/fres-PROFIL-CROP-Copy-e1725605022377.jpg';

const ASSETS = {
    dana: logoDana,
    heart: heartSvg,
    bca: logoBca,
    chip: chipAtm,
    cover: defaultCover,
    groom: defaultGroom,
    bride: defaultBride,
};

/* ─── Helpers ─── */
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

function getStorageUrl(url, fallback) {
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
class ErrorBoundaryLuxury3 extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#fff', background: '#111', minHeight: '100vh', fontFamily: 'monospace' }}>
                <h2 style={{ color: '#ff4d4d' }}>Terjadi kesalahan pada tema Luxury 03.</h2>
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

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const { t } = useTranslation();
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

    let baseClass = 'lx3-reveal--up';
    if (variant === 'zoom') baseClass = 'lx3-reveal--zoom';
    else if (variant === 'left') baseClass = 'lx3-reveal--left';
    else if (variant === 'right') baseClass = 'lx3-reveal--right';
    else if (variant === 'down') baseClass = 'lx3-reveal--down';

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
   ORMANENT PARTS
   ═══════════════════════════════════════ */
function HeartDivider() {
    return (
        <div className="lx3-divider">
            <span className="lx3-divider-inner">
                <img src={ASSETS.heart} alt="heart" style={{ width: 14, height: 14, display: 'inline-block' }} />
            </span>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    // Monogram initials
    const initials = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'G';
        const second = bride?.nickname?.charAt(0) || 'B';
        return `${first}${second}`;
    }, [groom, bride]);

    const coverBg = getStorageUrl(invitation?.cover_image, ASSETS.cover);

    return (
        <div className={`lx3-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'lx3-no-photo-mode' : ''}`}>
            {globalShowPhotos && <div className="lx3-cover__bg" style={{ backgroundImage: `url(${coverBg})` }} />}
            <div className="lx3-cover__overlay" />
            <div className="lx3-cover__content">
                {/* Circular Text Path Logo */}
                <div className="lx3-cover__circle-logo">
                    <svg viewBox="0 0 100 100">
                        <path id="circlePath" fill="none" stroke="none" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        <text>
                            <textPath href="#circlePath" startOffset="0%">
                                • {t('invitation.wedding_of').toUpperCase()} • {t('invitation.wedding_of').toUpperCase()}
                            </textPath>
                        </text>
                    </svg>
                    <div className="lx3-cover__monogram">{initials}</div>
                </div>

                <h1 className="lx3-cover__couple">{coupleName}</h1>
                <p className="lx3-cover__dear">Dear:</p>
                <div className="lx3-cover__guest">{guestName}</div>
                <p className="lx3-cover__apology">{t('invitation.dear_guest_desc')}</p>

                <button type="button" onClick={onOpen} id="tombol-buka" className="lx3-cover__btn">
                    <i className="fas fa-book-open" />
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   HERO SLIDESHOW SECTION
   ═══════════════════════════════════════ */
function HeroSection({ invitation, brideGrooms, events, galleries, layoutMode }) {
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
        : (invitation?.cover_title || 'Groom & Bride');

    const formattedDate = useMemo(() => {
        if (!targetDate) return '';
        const d = new Date(targetDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}. ${month}. ${year}`;
    }, [targetDate]);

    // Timer for countdown
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

    // Background Slideshow
    const pics = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length > 0) {
            return list.map(p => getStorageUrl(p.image_path || p.image_url));
        }
        return [getStorageUrl(invitation?.cover_image, ASSETS.cover)];
    }, [galleries, invitation]);

    useEffect(() => {
        if (pics.length <= 1) return;
        const interval = setInterval(() => {
            setBgIdx(prev => (prev + 1) % pics.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [pics]);

    const isHorizontal = layoutMode === 'slide-h';

    return (
        <section id="hero" className="lx3-hero">
            {globalShowPhotos && pics.map((src, idx) => (
                <div
                    key={src}
                    className={`lx3-hero__bg ${idx === bgIdx ? 'is-active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}
            <div className="lx3-hero__overlay" />
            <div className="lx3-hero__content">
                <Reveal delay={200}>
                    <span className="lx3-hero__subtitle">{t('invitation.wedding_of').toUpperCase()}</span>
                </Reveal>
                <Reveal delay={400}>
                    <h1 className="lx3-hero__title">{coupleName}</h1>
                </Reveal>
                <Reveal delay={600}>
                    <span className="lx3-hero__date">{t('invitation.save_the_date').toUpperCase()} | {formattedDate}</span>
                </Reveal>
                
                <Reveal delay={800}>
                    <div className="lx3-hero__countdown">
                        <div className="lx3-hero__countdown-item">
                            <span className="lx3-hero__countdown-val">{pad2(timeLeft.d)}</span>
                            <span className="lx3-hero__countdown-label">{t('invitation.days')}</span>
                        </div>
                        <div className="lx3-hero__countdown-item">
                            <span className="lx3-hero__countdown-val">{pad2(timeLeft.h)}</span>
                            <span className="lx3-hero__countdown-label">{t('invitation.hours')}</span>
                        </div>
                        <div className="lx3-hero__countdown-item">
                            <span className="lx3-hero__countdown-val">{pad2(timeLeft.m)}</span>
                            <span className="lx3-hero__countdown-label">{t('invitation.minutes')}</span>
                        </div>
                        <div className="lx3-hero__countdown-item">
                            <span className="lx3-hero__countdown-val">{pad2(timeLeft.s)}</span>
                            <span className="lx3-hero__countdown-label">{t('invitation.seconds')}</span>
                        </div>
                    </div>
                </Reveal>
                
                <div className={`lx3-hero__arrow ${isHorizontal ? 'lx3-hero__arrow--horizontal' : 'lx3-hero__arrow--vertical'}`}>
                    <i className={isHorizontal ? "fas fa-chevron-right" : "fas fa-chevron-down"} />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};
    const first = groom?.nickname?.charAt(0) || '';
    const second = bride?.nickname?.charAt(0) || '';

    const rawOpeningTitle = invitation?.opening_title || '';
    const isWeddingOf = !rawOpeningTitle || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING OF' || 
                        rawOpeningTitle.toUpperCase() === 'PERNIKAHAN' || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING';

    return (
        <section id="opening" className="lx3-section lx3-opening">
            <Reveal>
                {isWeddingOf ? (
                    <div className="lx3-opening__header">
                        <span className="lx3-opening__subtitle">{t('invitation.wedding_of').toUpperCase()}</span>
                        {first && second && (
                            <div className="lx3-opening__initials">
                                <span className="lx3-opening__initials-letter">{first}</span>
                                <span className="lx3-opening__initials-amp">&amp;</span>
                                <span className="lx3-opening__initials-letter">{second}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <h2 className="lx3-opening__title">{invitation?.opening_title || 'Maha Suci Allah'}</h2>
                )}
                
                {invitation?.opening_ayat && (
                    <div className="lx3-opening__quote-container">
                        <p className="lx3-opening__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                        {invitation?.opening_ayat_source && (
                            <p className="lx3-opening__source">&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}
                
                <p className="lx3-opening__text" style={{ marginTop: '30px' }}>
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia mengenai hari pernikahan kami.'}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || bgs[1] || bgs[0] || {};

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

    const groomPhoto = getStorageUrl(groom.photo, ASSETS.groom);
    const bridePhoto = getStorageUrl(bride.photo, ASSETS.bride);

    return (
        <section id="bride_groom" className="lx3-section lx3-couple">
            <Reveal variant="up">
                <h2 className="lx3-section-title">{t('invitation.mempelai')}</h2>
                <p className="lx3-section-subtitle">Groom &amp; Bride</p>
            </Reveal>

            {/* Groom */}
            <Reveal className="lx3-mempelai-card" variant="left">
                {globalShowPhotos && groom.photo && (
                    <div className="lx3-mempelai-photo-wrap">
                        <img src={groomPhoto} alt={groom.full_name || 'Groom'} className="lx3-mempelai-photo" />
                    </div>
                )}
                <div className="lx3-mempelai-details">
                    <h3 className="lx3-mempelai-name">{groom.full_name || 'Nama Lengkap Pria'}</h3>
                    <p className="lx3-mempelai-parent-label">
                        {translateChildOrder(groom.child_order, 'pria')}
                    </p>
                    <p className="lx3-mempelai-parents">
                        {groom.father_name && groom.mother_name
                            ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                            : (groom.father_name || groom.mother_name || (locale === 'en' ? 'Parents Name' : 'Nama Orang Tua'))}
                    </p>
                    {groom.instagram && (
                        <a
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lx3-mempelai-ig"
                            title={`Instagram ${groom.instagram}`}
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </div>
            </Reveal>

            <Reveal variant="zoom">
                <div className="lx3-mempelai-amp">&amp;</div>
            </Reveal>

            {/* Bride */}
            <Reveal className="lx3-mempelai-card" variant="right">
                {globalShowPhotos && bride.photo && (
                    <div className="lx3-mempelai-photo-wrap">
                        <img src={bridePhoto} alt={bride.full_name || 'Bride'} className="lx3-mempelai-photo" />
                    </div>
                )}
                <div className="lx3-mempelai-details">
                    <h3 className="lx3-mempelai-name">{bride.full_name || 'Nama Lengkap Wanita'}</h3>
                    <p className="lx3-mempelai-parent-label">
                        {translateChildOrder(bride.child_order, 'wanita')}
                    </p>
                    <p className="lx3-mempelai-parents">
                        {bride.father_name && bride.mother_name
                            ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                            : (bride.father_name || bride.mother_name || (locale === 'en' ? 'Parents Name' : 'Nama Orang Tua'))}
                    </p>
                    {bride.instagram && (
                        <a
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lx3-mempelai-ig"
                            title={`Instagram ${bride.instagram}`}
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN SECTION
   ═══════════════════════════════════════ */
function CountdownSection({ events, galleries }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = primaryEvent?.event_date || '';
    const targetTime = primaryEvent?.start_time || '08:00';

    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    const [bgImg, setBgImg] = useState(null);

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

    useEffect(() => {
        const pics = safeArr(galleries);
        if (pics.length > 0) {
            const randIdx = Math.floor(Math.random() * pics.length);
            setBgImg(getStorageUrl(pics[randIdx].image_path || pics[randIdx].image_url));
        }
    }, [galleries]);

    const dDigits = pad2(timeLeft.d).split('');
    const hDigits = pad2(timeLeft.h).split('');
    const mDigits = pad2(timeLeft.m).split('');
    const sDigits = pad2(timeLeft.s).split('');

    return (
        <div className="lx3-countdown-wrapper" style={{ position: 'relative', overflow: 'hidden', padding: '60px 24px', borderBottom: '1px solid rgba(197, 168, 128, 0.08)' }}>
            {globalShowPhotos && bgImg && (
                <>
                    <div className="lx3-section-bg" style={{ backgroundImage: `url(${bgImg})` }} />
                    <div className="lx3-section-overlay" />
                </>
            )}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Reveal>
                    <h2 className="lx3-section-title">{t('invitation.save_the_date')}</h2>
                    <p className="lx3-section-subtitle">{t('invitation.save_the_date') === 'Save The Date' ? 'Counting Down' : 'Menghitung Hari'}</p>
                </Reveal>

                <Reveal variant="zoom">
                    <div className="lx3-countdown">
                        {/* Days */}
                        <div className="lx3-countdown__item">
                            <div className="lx3-countdown__value">
                                {dDigits.map((digit, idx) => (
                                    <span key={`d-${idx}`} className="lx3-countdown__digit">{digit}</span>
                                ))}
                            </div>
                            <span className="lx3-countdown__label">{t('invitation.days')}</span>
                        </div>

                        <span className="lx3-countdown__colon">:</span>

                        {/* Hours */}
                        <div className="lx3-countdown__item">
                            <div className="lx3-countdown__value">
                                {hDigits.map((digit, idx) => (
                                    <span key={`h-${idx}`} className="lx3-countdown__digit">{digit}</span>
                                ))}
                            </div>
                            <span className="lx3-countdown__label">{t('invitation.hours')}</span>
                        </div>

                        <span className="lx3-countdown__colon">:</span>

                        {/* Minutes */}
                        <div className="lx3-countdown__item">
                            <div className="lx3-countdown__value">
                                {mDigits.map((digit, idx) => (
                                    <span key={`m-${idx}`} className="lx3-countdown__digit">{digit}</span>
                                ))}
                            </div>
                            <span className="lx3-countdown__label">{t('invitation.minutes')}</span>
                        </div>

                        <span className="lx3-countdown__colon">:</span>

                        {/* Seconds */}
                        <div className="lx3-countdown__item">
                            <div className="lx3-countdown__value">
                                {sDigits.map((digit, idx) => (
                                    <span key={`s-${idx}`} className="lx3-countdown__digit">{digit}</span>
                                ))}
                            </div>
                            <span className="lx3-countdown__label">{t('invitation.seconds')}</span>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION
   ═══════════════════════════════════════ */
function EventSection({ events, galleries, showCountdown }) {
    const { t } = useTranslation();
    const list = safeArr(events);

    // Pick a random image from galleries once (or per event id)
    // To ensure stability during rerenders, we resolve indices on mount.
    const [randomGalleryImages, setRandomGalleryImages] = useState({});

    useEffect(() => {
        const pics = safeArr(galleries);
        if (pics.length === 0) return;

        const resolved = {};
        list.forEach((evt, idx) => {
            // Check if name is Akad Nikah or contains Akad
            const isAkad = evt.event_name?.toLowerCase().includes('akad');
            if (isAkad) {
                const randIdx = Math.floor(Math.random() * pics.length);
                resolved[evt.id || idx] = getStorageUrl(pics[randIdx].image_path || pics[randIdx].image_url);
            }
        });
        setRandomGalleryImages(resolved);
    }, [galleries, list]);

    return (
        <section id="event" className="lx3-section" style={{ padding: showCountdown ? '0 0 60px 0' : '60px 24px' }}>
            {showCountdown && (
                <CountdownSection events={events} galleries={galleries} />
            )}

            <div style={{ padding: showCountdown ? '60px 24px 0 24px' : '0' }}>
                <Reveal>
                    <h2 className="lx3-section-title">{t('nav.acara')}</h2>
                    <p className="lx3-section-subtitle">{t('invitation.wedding_events')}</p>
                </Reveal>

                {list.map((evt, idx) => {
                    const isAkad = evt.event_name?.toLowerCase().includes('akad');
                    const eventImg = isAkad
                        ? randomGalleryImages[evt.id || idx]
                        : getStorageUrl(evt.image, null);

                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date);
                    const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Acara');
                    const isEven = idx % 2 === 0;

                    return (
                        <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="lx3-event-card-ref">
                            {globalShowPhotos && eventImg && (
                                <div className="lx3-event-banner-ref">
                                    <img src={eventImg} alt={evt.event_name} />
                                </div>
                            )}
                            <div className="lx3-event-body-ref">
                                {/* Left column: Dark gray vertical name */}
                                <div className="lx3-event-left-ref">
                                    <div className="lx3-event-vertical-title">{eventDisplayName}</div>
                                </div>
                                {/* Right column: details */}
                                <div className="lx3-event-right-ref">
                                    {/* Date row */}
                                    <div className="lx3-event-date-row-ref">
                                        <span className="lx3-event-date-num-ref">{dayNum}</span>
                                        <div className="lx3-event-date-col-ref">
                                            <span className="lx3-event-date-day-ref">{dayName}</span>
                                            <span className="lx3-event-date-month-ref">{monthName}</span>
                                            <span className="lx3-event-date-year-ref">{year}</span>
                                        </div>
                                    </div>
                                    <hr className="lx3-event-divider-ref" />
                                    {/* Time */}
                                    <p className="lx3-event-time-ref">
                                        {t('invitation.save_the_date') === 'Save The Date' ? 'Time' : 'Pukul'} : {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : ' - Selesai'} {evt.timezone || 'WIB'}
                                    </p>
                                    {/* Location */}
                                    <div className="lx3-event-location-ref">
                                        <h4 className="lx3-event-location-title-ref">{t('invitation.save_the_date') === 'Save The Date' ? 'Event Location' : 'Lokasi Acara'}</h4>
                                        <p className="lx3-event-venue-ref">{t('invitation.save_the_date') === 'Save The Date' ? 'Venue' : 'Tempat'} : <strong>{evt.venue_name}</strong></p>
                                        <p className="lx3-event-address-ref">{evt.venue_address}</p>
                                    </div>
                                    {/* Maps Button */}
                                    {evt.gmaps_link && (
                                        <a
                                            href={evt.gmaps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="lx3-event-btn-ref"
                                        >
                                            Google Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION
   ═══════════════════════════════════════ */
/* ─── TimelineCard (Intersection Observer Wrapper) ─── */
function TimelineCard({ story, idx, isEven }) {
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
        <div ref={ref} className={`lx3-story__node lx3-story__node--${isEven ? 'left' : 'right'} ${isActive ? 'is-active' : ''}`}>
            <Reveal className="lx3-story__card">
                <div className="lx3-story__date">
                    {story.story_date ? (isNaN(new Date(story.story_date).getTime()) ? story.story_date : new Date(story.story_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })) : ''}
                </div>
                <h3 className="lx3-story__title">{story.title}</h3>
                <p className="lx3-story__desc">{story.description || story.story}</p>
            </Reveal>
        </div>
    );
}

function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (list.length === 0) return null;

    return (
        <section id="love_story" className="lx3-section">
            <Reveal>
                <h2 className="lx3-section-title">{t('invitation.love_story')}</h2>
                <p className="lx3-section-subtitle">Our Love Story</p>
            </Reveal>

            <div className="lx3-story">
                {list.map((story, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <TimelineCard key={story.id || idx} story={story} idx={idx} isEven={isEven} />
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const list = safeArr(galleries).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const [activeImg, setActiveImg] = useState(null);

    if (list.length === 0 || !globalShowPhotos) return null;

    return (
        <section id="gallery" className="lx3-section">
            <Reveal>
                <h2 className="lx3-section-title">{t('invitation.gallery')}</h2>
                <p className="lx3-section-subtitle">Our Moments</p>
            </Reveal>

            <div className="lx3-gallery-grid">
                {list.map((photo, idx) => {
                    const imgUrl = getStorageUrl(photo.image_path || photo.image_url);
                    return (
                        <Reveal
                            key={photo.id || idx}
                            variant="zoom"
                            className="lx3-gallery-grid__item"
                        >
                            <img
                                src={imgUrl}
                                alt={photo.caption || `Gallery ${idx}`}
                                onClick={() => setActiveImg(imgUrl)}
                            />
                        </Reveal>
                    );
                })}
            </div>

            {/* Lightbox fullscreen Modal */}
            {activeImg && (
                <div className="lx3-lightbox" onClick={() => setActiveImg(null)}>
                    <button
                        type="button"
                        className="lx3-lightbox__close"
                        onClick={() => setActiveImg(null)}
                        aria-label="Close Lightbox"
                    >
                        &times;
                    </button>
                    <img
                        src={activeImg}
                        alt="Lightbox"
                        className="lx3-lightbox__img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK GIFT SECTION
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, invitation }) {
    const { t } = useTranslation();
    const list = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);

    if (list.length === 0) return null;

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

        // Selection range for Safari iOS and in-app webviews
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

    const handleCopy = (text, idx) => {
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

    return (
        <section id="bank" className="lx3-section">
            <Reveal>
                <h2 className="lx3-section-title">{t('nav.bank')}</h2>
                <p className="lx3-section-subtitle">{t('invitation.gift_title')}</p>
            </Reveal>

            {list.map((acc, idx) => {
                const isDana = acc.bank_name?.toLowerCase().includes('dana');
                const logo = isDana ? ASSETS.dana : ASSETS.bca;

                return (
                    <Reveal key={acc.id || idx} className="lx3-bank-card">
                        <img src={ASSETS.chip} alt="atm chip" className="lx3-bank-card__chip" />
                        <div className="lx3-bank-card__header">
                            <img src={logo} alt={acc.bank_name} className="lx3-bank-card__logo" />
                        </div>
                        <div className="lx3-bank-card__number">{acc.account_number}</div>
                        <div className="lx3-bank-card__holder-label">{invitation?.language === 'en' ? 'Account Holder:' : 'Pemilik Rekening:'}</div>
                        <div className="lx3-bank-card__holder">{acc.account_holder || acc.account_name}</div>

                        <button
                            type="button"
                            className="lx3-bank-card__copy-btn"
                            onClick={() => handleCopy(acc.account_number, idx)}
                        >
                            <i className={copiedIdx === idx ? "fas fa-check" : "far fa-copy"} />
                            {copiedIdx === idx ? t('invitation.gift_copied') : t('invitation.gift_copy')}
                        </button>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   UNIFIED RSVP & WISHES CONTAINER
   ═══════════════════════════════════════ */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes }) {
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
    const wishList = safeArr(wishes);
    const recentWishes = wishList.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? `${t('nav.rsvp')} & ${t('invitation.wishes_title')}`
        : enableRsvp
            ? t('invitation.rsvp_title')
            : t('invitation.wishes_title');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="lx3-section">
            <Reveal>
                <h2 className="lx3-section-title">{sectionTitle}</h2>
                <p className="lx3-section-subtitle">
                    {isEn
                        ? 'Please fill out the form below to send your confirmation and wishes.'
                        : 'Mohon isi formulir berikut untuk mengirimkan konfirmasi dan ucapan Anda.'}
                </p>
            </Reveal>

            <Reveal>
                <div id="rsvp_container" className="lx3-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit} className="lx3-rsvp-form">
                        {/* Nama */}
                        <div className="lx3-form-group">
                            <label htmlFor="rsvp_name">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                            <input
                                type="text"
                                id="rsvp_name"
                                className="lx3-input"
                                readOnly={!!activeGuest.name && activeGuest.name !== 'Tamu Undangan'}
                                value={sharedName}
                                onChange={e => setSharedName(e.target.value)}
                                placeholder={isEn ? 'Your Name' : 'Nama Lengkap'}
                                required
                            />
                        </div>

                        {/* Konfirmasi Kehadiran */}
                        {enableRsvp && (
                            <div className="lx3-form-group">
                                <label htmlFor="rsvp_attendance">{t('invitation.rsvp_attendance')}</label>
                                <select
                                    id="rsvp_attendance"
                                    className="lx3-select"
                                    value={attendance}
                                    onChange={e => setAttendance(e.target.value)}
                                >
                                    <option value="hadir">{t('invitation.rsvp_hadir')}</option>
                                    <option value="tidak_hadir">{t('invitation.rsvp_tidak_hadir')}</option>
                                    <option value="belum_pasti">{t('invitation.rsvp_belum_pasti')}</option>
                                </select>
                            </div>
                        )}

                        {/* Jumlah Tamu */}
                        {enableRsvp && attendance === 'hadir' && (
                            <div className="lx3-form-group">
                                <label htmlFor="rsvp_guests">{t('invitation.rsvp_count')}</label>
                                <select
                                    id="rsvp_guests"
                                    className="lx3-select"
                                    value={numGuests}
                                    onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                >
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>{n} {isEn ? 'People' : 'Orang'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Ucapan & Doa */}
                        {enableWishes && (
                            <div className="lx3-form-group">
                                <label htmlFor="wish_message">{isEn ? 'Wishes & Prayers' : 'Pesan / Ucapan'}</label>
                                <textarea
                                    id="wish_message"
                                    rows="3"
                                    className="lx3-textarea"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    placeholder={t('invitation.wishes_placeholder')}
                                    required={!enableRsvp}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="lx3-form-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? t('common.saving') : (isEn ? 'Send' : 'Kirim')}
                        </button>

                        {success && (
                            <p style={{ color: 'var(--lx3-gold)', marginTop: '12px', fontSize: '13px', textAlign: 'center' }}>
                                ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                            </p>
                        )}
                    </form>

                    {/* Wishes list scrollable max 5 item */}
                    {enableWishes && recentWishes.length > 0 && (
                        <div className="lx3-wishes-list-wrapper" style={{ marginTop: '20px' }}>
                            <div className="lx3-wishes-list" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                {recentWishes.map((w, idx) => (
                                    <div key={w.id || idx} className="lx3-wish-bubble">
                                        <div className="lx3-wish-bubble__header">
                                            <span className="lx3-wish-bubble__sender">{w.sender_name || w.name}</span>
                                            {w.attendance && (
                                                <span className={`lx3-wish-bubble__badge ${w.attendance === 'hadir' ? 'lx3-wish-bubble__badge--hadir' : 'lx3-wish-bubble__badge--tidak'}`}>
                                                    {w.attendance === 'hadir' ? t('invitation.rsvp_hadir') : t('invitation.rsvp_tidak_hadir')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="lx3-wish-bubble__message">{w.message}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation }) {
    const { t } = useTranslation();
    const eventList = safeArr(events);
    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
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
    
    const isEn = t('invitation.save_the_date') === 'Save The Date';
    const { dayName, dayNum, monthName, year } = parseEventDate(primaryEvent?.event_date);

    return (
        <section id="livestream" className="lx3-section lx3-livestream-section" style={{ padding: '60px 24px' }}>
            <Reveal>
                <h2 className="lx3-section-title">LIVE STREAMING</h2>
                <p className="lx3-section-subtitle">{isEn ? 'Virtual Wedding Celebration' : 'Prosesi Pernikahan Virtual'}</p>
            </Reveal>

            <Reveal className="lx3-card" style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '30px 20px' }}>
                <h3 className="lx3-event-card__name" style={{ color: 'var(--lx3-gold)', fontSize: '18px', marginBottom: 15 }}>
                    {dayName}, {dayNum} {monthName} {year}
                </h3>
                <p style={{ fontSize: '13px', opacity: 0.8, color: '#fff', marginBottom: '20px' }}>
                    {formatTime(primaryEvent?.start_time)} - {primaryEvent?.end_time === '23:59:00' ? 'Selesai' : formatTime(primaryEvent?.end_time)} {primaryEvent?.timezone || 'WIB'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--lx3-text-muted)', lineHeight: '1.6', marginBottom: '25px' }}>
                    {isEn 
                        ? 'We will broadcast the happy moments of our wedding procession virtually through the following platforms.'
                        : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    {streamsList.map((stream, idx) => (
                        <a 
                            key={idx}
                            href={stream.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="lx3-event-btn-ref"
                            style={{ 
                                borderColor: 'rgba(197, 168, 128, 0.6)',
                                backgroundColor: 'var(--lx3-gold, #c5a880)',
                                color: '#000',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                maxWidth: '240px',
                                gap: '8px',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                margin: '0'
                            }}
                        >
                            <i className="fas fa-video" /> JOIN {stream.platform.toUpperCase()}
                        </a>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}



/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, galleries }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const bride = bgs.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || bgs[0] || {};
    const groom = bgs.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || bgs[1] || bgs[0] || {};

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const [bgImg, setBgImg] = useState(null);

    useEffect(() => {
        const pics = safeArr(galleries);
        if (pics.length > 0) {
            const randIdx = Math.floor(Math.random() * pics.length);
            setBgImg(getStorageUrl(pics[randIdx].image_path || pics[randIdx].image_url));
        }
    }, [galleries]);

    const isEn = t('invitation.save_the_date') === 'Save The Date';
    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const defaultIdText = 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.';
    const defaultIdTitle = 'Terima Kasih';

    const currentClosingTitle = invitation?.closing_title || '';
    const currentClosingText = invitation?.closing_text || '';

    const isDefaultTitle = !currentClosingTitle || currentClosingTitle.trim() === 'Terima Kasih' || currentClosingTitle.trim().toLowerCase() === 'thank you' || currentClosingTitle.trim() === 'TERIMA KASIH';
    const isDefaultText = !currentClosingText || currentClosingText.trim() === defaultIdText || currentClosingText.includes('kehormatan dan kebahagiaan');

    const displayClosingTitle = isDefaultTitle
        ? t('invitation.closing_title')
        : currentClosingTitle;

    const displayClosingText = isDefaultText
        ? t('invitation.closing_text')
        : currentClosingText;

    return (
        <section id="closing" className="lx3-section lx3-closing" style={{ position: 'relative', overflow: 'hidden' }}>
            {globalShowPhotos && bgImg && (
                <>
                    <div className="lx3-section-bg" style={{ backgroundImage: `url(${bgImg})` }} />
                    <div className="lx3-section-overlay" />
                </>
            )}
            <div style={{ position: 'relative', zIndex: 2 }}>
                <Reveal>
                    <h2 className="lx3-closing__title">{displayClosingTitle}</h2>
                    <p className="lx3-closing__text">
                        {displayClosingText}
                    </p>
                    <HeartDivider />
                    
                    {/* Formal Tanda Tangan Penutup */}
                    <div className="lx3-closing__signature" style={{ marginTop: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                        <div style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--lx3-gold)' }}>
                            {isEn ? 'We Who Are Joyful,' : 'Kami Yang Berbahagia,'}
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.85, display: 'flex', flexDirection: 'column', gap: '4px', color: '#fff', fontStyle: 'normal' }}>
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

                    <h3 className="lx3-closing__couple">{coupleName}</h3>
                    <p style={{ marginTop: 40, fontSize: 10, color: 'var(--lx3-text-muted)', letterSpacing: 1 }}>
                        Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'Groovy Digital'}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   NAVIGATION MENU & CONTROLS
   ═══════════════════════════════════════ */
function Navigation({
    invitation,
    guest,
    isOpened,
    isPlaying,
    onToggleMusic,
    scrollToSection,
    activeMenuId,
    resolvedSections,
    enableRsvp,
    enableWishes,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen
}) {
    const { t } = useTranslation();
    const [showQr, setShowQr] = useState(false);

    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    let menuPosition = invitation?.menu_position || 'bottom';
    const showMenu = menuPosition !== 'none' && isOpened;

    // Filtered menu icons for narrow viewports
    const menuItems = useMemo(() => {
        const items = [];
        const validKeys = resolvedSections.map(s => s.section_key);

        resolvedSections.forEach(s => {
            const key = s.section_key;
            if (key === 'cover') return;

            if (key === 'opening') {
                items.push({ id: 'opening', label: t('nav.opening'), icon: 'fas fa-book-open' });
            } else if (key === 'bride_groom') {
                items.push({ id: 'bride_groom', label: t('nav.mempelai'), icon: 'fas fa-heart' });
            } else if (key === 'event') {
                items.push({ id: 'event', label: t('nav.acara'), icon: 'far fa-calendar-alt' });
            } else if (key === 'livestream') {
                items.push({ id: 'livestream', label: 'Streaming', icon: 'fas fa-video' });
            } else if (key === 'love_story') {
                items.push({ id: 'love_story', label: t('nav.kisah'), icon: 'fas fa-history' });
            } else if (key === 'gallery') {
                items.push({ id: 'gallery', label: t('nav.galeri'), icon: 'far fa-images' });
            } else if (key === 'rsvp') {
                const hasWishes = validKeys.includes('wishes') || enableWishes;
                items.push({ id: 'rsvp', label: hasWishes ? `${t('nav.rsvp')} & ${t('invitation.wishes_title')}` : t('nav.rsvp'), icon: 'fas fa-envelope' });
            } else if (key === 'wishes') {
                const hasRsvp = validKeys.includes('rsvp') || enableRsvp;
                if (!hasRsvp) {
                    items.push({ id: 'wishes', label: t('invitation.wishes_title'), icon: 'fas fa-envelope' });
                }
            } else if (key === 'bank') {
                items.push({ id: 'bank', label: t('nav.hadiah'), icon: 'fas fa-gift' });
            } else if (key === 'closing') {
                items.push({ id: 'closing', label: t('nav.penutup'), icon: 'fas fa-door-open' });
            }
        });

        return items;
    }, [resolvedSections, enableRsvp, enableWishes]);

    if (!isOpened) return null;

    const isBottomMenu = menuPosition === 'bottom';

    return (
        <>
            {/* Dock Menu */}
            {showMenu && (
                <div className={`lx3-nav-menu ${isBottomMenu ? 'lx3-nav-menu--bottom' : 'lx3-nav-menu--top'}`}>
                    <div className="lx3-nav-menu__inner--row">
                        {menuItems.map((item) => {
                            const isActive = activeMenuId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => { setAutoScrollEnabled(false); scrollToSection(item.id); }}
                                    className={`lx3-nav-menu__item ${isActive ? 'active' : ''}`}
                                    title={item.label}
                                >
                                    <i className={item.icon} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Floating Music and QR buttons on the bottom right */}
            <div className={`lx3-floating-btns ${isBottomMenu ? 'lx3-floating-btns--raised' : ''}`}>
                {enableQr && activeGuest && (
                    <button
                        type="button"
                        className="lx3-floating-btn"
                        onClick={() => setShowQr(true)}
                        title="QR Code Check-in"
                    >
                        <i className="fas fa-qrcode" />
                    </button>
                )}

                <button
                    type="button"
                    className="lx3-floating-btn"
                    onClick={toggleFullscreen}
                    style={isFullscreen ? { backgroundColor: 'var(--lx3-gold, #b82d40)', color: '#fff', boxShadow: '0 0 10px var(--lx3-gold)' } : {}}
                    title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                </button>

                {invitation?.enable_auto_scroll !== false && (
                <button
                    type="button"
                    className="lx3-floating-btn"
                    onClick={() => setAutoScrollEnabled(prev => !prev)}
                    style={autoScrollEnabled ? { backgroundColor: 'var(--lx3-gold, #b82d40)', color: '#fff', boxShadow: '0 0 10px var(--lx3-gold)' } : {}}
                    title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                >
                    <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                </button>
                )}
                <button
                    type="button"
                    className="lx3-floating-btn"
                    onClick={onToggleMusic}
                    title="Musik Latar"
                >
                    <i className={isPlaying ? "fas fa-music" : "fas fa-volume-mute"} />
                </button>
            </div>

            {/* QR Code Modal Overlay */}
            {enableQr && showQr && activeGuest && (
                <div className="lx3-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="lx3-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="lx3-qr-title">QR Code Check-in</h3>
                        <p className="lx3-qr-guest">{activeGuest.name}</p>
                        <div className="lx3-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=c5a880&data=${encodeURIComponent(
                                    window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug
                                )}`}
                                alt="QR Code"
                                className="lx3-qr-img"
                            />
                        </div>
                        <p className="lx3-qr-hint">Tunjukkan QR Code ini kepada penerima tamu di lokasi acara</p>
                        <button
                            type="button"
                            className="lx3-qr-close"
                            onClick={() => setShowQr(false)}
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
   MAIN COMPONENT
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

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';

    // Boolean features
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const showCountdown = parseBool(invitation?.show_countdown);
    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
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
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
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
            
            // Search for visible sections
            uniqueKeys.forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // If the section top is <= 250px from top, and bottom is still visible (> 100px from top)
                    if (rect.top <= 250 && rect.bottom > 100) {
                        currentActive = key;
                    }
                }
            });
            setActiveSectionId(currentActive);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once initially
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
        // Special mapping for combined rsvp + wishes
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
            const scrollable = target.closest('.lx3-slide-container');
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
            // slide-v or legacy slide
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.lx3-slide-container') : null;
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

        const target = e.target.closest('.lx3-slide-container');
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

    // Render JSX for sections
    const renderSectionComponent = (section, idx) => {
        const key = section.section_key;

        const componentMap = {
            'hero': <HeroSection key={key} invitation={invitation} brideGrooms={brideGrooms} events={events} galleries={galleries} layoutMode={layoutMode} />,
            'opening': <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} />,
            'bride_groom': <BrideGroomSection key={key} brideGrooms={brideGrooms} />,
            'countdown': null, // Embedded in event section
            'event': <EventSection key={key} events={events} galleries={galleries} showCountdown={showCountdownInEvent} />,
            'livestream': <LiveStreamingSection key={key} events={events} invitation={invitation} />,
            'love_story': <LoveStorySection key={key} loveStories={loveStories} />,
            'gallery': <GallerySection key={key} galleries={galleries} />,
            'bank': <BankSection key={key} bankAccounts={bankAccounts} invitation={invitation} />,
            'rsvp': <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} />,
            'wishes': enableRsvp ? null : <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={true} />,
            'closing': <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} galleries={galleries} />,
        };

        const comp = componentMap[key];
        if (!comp) return null;

        if (isSlideMode) {
            let slideClass = 'lx3-slide-container';
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
                {key !== 'closing' && key !== 'hero' && <HeartDivider />}
            </React.Fragment>
        );
    };

    // WhatsApp float details
    const activeGroomGroom = safeArr(brideGrooms).find(b => b.gender === 'pria') || brideGrooms?.[0];
    const waNumber = activeGroomGroom?.phone || '';
    const isBottomMenu = (invitation?.menu_position || 'bottom') === 'bottom';

    return (
        <ErrorBoundaryLuxury3>
            <div className={`lx3-page ${!showAnimations ? 'lx3-no-animations' : ''}`}>
            {invitation?.particle_type && invitation.particle_type !== 'none' && isOpened && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {/* Audio music player */}
            {invitation?.music_url && (
                <audio ref={audioRef} loop preload="auto" playsInline>
                    <source src={getStorageUrl(invitation.music_url, '')} type="audio/mpeg" />
                </audio>
            )}

            {/* Cover */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
            />

            {/* Main Area */}
            <div className="lx3-container">
                <div
                    className={`lx3-main ${isSlideMode ? 'lx3-main--slide' : ''} ${layoutMode === 'slide-h' ? 'lx3-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'lx3-main--slide-v' : ''}`}
                    onTouchStart={isSlideMode ? handleTouchStart : undefined}
                    onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                    onMouseDown={isSlideMode ? handleMouseDown : undefined}
                    onMouseUp={isSlideMode ? handleMouseUp : undefined}
                    onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                    onWheel={isSlideMode ? handleWheel : undefined}
                >
                    {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                </div>
            </div>

            {/* WhatsApp Floating Button on Bottom Left */}
            {waNumber && isOpened && (
                <div className={`lx3-whatsapp-float ${isBottomMenu ? 'lx3-whatsapp-float--raised' : ''}`}>
                    <a
                        href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lx3-whatsapp-btn"
                        title="Hubungi Mempelai via WhatsApp"
                    >
                        <i className="fab fa-whatsapp" />
                    </a>
                </div>
            )}

            {/* Menu Nav & Raised Floaters */}
            <Navigation
                invitation={invitation}
                guest={guest}
                isOpened={isOpened}
                isPlaying={isPlaying}
                onToggleMusic={toggleMusic}
                scrollToSection={scrollToSection}
                activeMenuId={activeSectionId}
                resolvedSections={resolvedSections}
                enableRsvp={enableRsvp}
                enableWishes={enableWishes}
                autoScrollEnabled={autoScrollEnabled}
                setAutoScrollEnabled={setAutoScrollEnabled}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
            />
            </div>
        </ErrorBoundaryLuxury3>
    );
}
