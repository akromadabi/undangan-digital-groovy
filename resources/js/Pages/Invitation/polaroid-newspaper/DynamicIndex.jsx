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

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    // Prevent timezone offset midnight bug: append local midday T12:00:00
    const safeStr = String(dateStr).substring(0, 10) + 'T12:00:00';
    const date = new Date(safeStr);
    if (isNaN(date.getTime())) {
        return String(dateStr).toUpperCase();
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }).toUpperCase();
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
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

// Child order translation helper
const translateChildOrder = (order, gender, lang = 'id') => {
    if (!order) return '';
    const cleanOrder = String(order).toLowerCase().trim();
    const isFemale = ['wanita', 'female'].includes(String(gender).toLowerCase());

    const mapId = {
        '1': isFemale ? 'Putri Pertama' : 'Putra Pertama',
        '2': isFemale ? 'Putri Kedua' : 'Putra Kedua',
        '3': isFemale ? 'Putri Ketiga' : 'Putra Ketiga',
        '4': isFemale ? 'Putri Keempat' : 'Putra Keempat',
        'pertama': isFemale ? 'Putri Pertama' : 'Putra Pertama',
        'kedua': isFemale ? 'Putri Kedua' : 'Putra Kedua',
        'ketiga': isFemale ? 'Putri Ketiga' : 'Putra Ketiga',
        'keempat': isFemale ? 'Putri Keempat' : 'Putra Keempat',
        'bungsu': isFemale ? 'Putri Bungsu' : 'Putra Bungsu',
        'sulung': isFemale ? 'Putri Sulung' : 'Putra Sulung',
        'tunggal': isFemale ? 'Putri Tunggal' : 'Putra Tunggal',
    };

    const mapEn = {
        '1': isFemale ? 'First Daughter' : 'First Son',
        '2': isFemale ? 'Second Daughter' : 'Second Son',
        '3': isFemale ? 'Third Daughter' : 'Third Son',
        '4': isFemale ? 'Fourth Daughter' : 'Fourth Son',
        'pertama': isFemale ? 'First Daughter' : 'First Son',
        'kedua': isFemale ? 'Second Daughter' : 'Second Son',
        'ketiga': isFemale ? 'Third Daughter' : 'Third Son',
        'keempat': isFemale ? 'Fourth Daughter' : 'Fourth Son',
        'bungsu': isFemale ? 'Youngest Daughter' : 'Youngest Son',
        'sulung': isFemale ? 'Eldest Daughter' : 'Eldest Son',
        'tunggal': isFemale ? 'Only Daughter' : 'Only Son',
    };

    if (lang === 'en') {
        return mapEn[cleanOrder] || (isFemale ? `Daughter (${order})` : `Son (${order})`);
    }
    return mapId[cleanOrder] || (isFemale ? `Putri ke-${order}` : `Putra ke-${order}`);
};

// Title Case formatter for cursive elements
function formatTitle(title) {
    if (!title) return '';
    if (title.toUpperCase() === 'THANK YOU') return 'Thank You';
    if (title.toUpperCase() === 'TERIMA KASIH') return 'Terima Kasih';
    return title;
}

/* ═══════════════════════════════════════
   DECORATIVE ELEMENTS
   ═══════════════════════════════════════ */
function TornPaperEdge({ color = '#f4f0ea', flip = false }) {
    return (
        <div className={`pn-torn-edge ${flip ? 'pn-torn-edge--flip' : ''}`}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ fill: color, width: '100%', height: '24px', display: 'block' }}>
                <path d="M0,0 L1200,0 L1200,80 L1185,73 L1170,82 L1155,68 L1140,78 L1125,73 L1110,82 L1095,68 L1080,78 L1065,73 L1050,82 L1035,68 L1020,78 L1005,73 L990,82 L975,68 L960,78 L945,73 L930,82 L915,68 L900,78 L885,73 L870,82 L855,68 L840,78 L825,73 L810,82 L795,68 L780,78 L765,73 L750,82 L735,68 L720,78 L705,73 L690,82 L675,68 L660,78 L645,73 L630,82 L615,68 L600,78 L585,73 L570,82 L555,68 L540,78 L525,73 L510,82 L495,68 L480,78 L465,73 L450,82 L435,68 L420,78 L405,73 L390,82 L375,68 L360,78 L345,73 L330,82 L315,68 L300,78 L285,73 L270,82 L255,68 L240,78 L225,73 L210,82 L195,68 L180,78 L165,73 L150,82 L135,68 L120,78 L105,73 L90,82 L75,68 L60,78 L45,73 L30,82 L15,68 L0,78 Z" />
            </svg>
        </div>
    );
}

function NewspaperDivider() {
    return (
        <div className="pn-newspaper-divider">
            <div className="pn-divider-linepn" />
            <div className="pn-divider-double" />
        </div>
    );
}

function NewspaperPostStamp({ text = "APPROVED" }) {
    return (
        <div className="pn-post-stamp">
            <span className="pn-post-stamp-text">{text}</span>
        </div>
    );
}

function PaperClip() {
    return (
        <div className="pn-paperclip">
            <div className="pn-paperclip-inner" />
        </div>
    );
}

// Scraped news ink watermark texture for background decoration
function NewspaperWatermark() {
    return <div className="pn-bg-watermark-news" />;
}

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="theme-error-boundary" style={{ padding: 24, color: '#111', background: '#f4f0ea', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#222', fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 'bold' }}>Terjadi kesalahan pada rendering tema.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#444', marginTop: 10, maxWidth: '90%', border: '1px solid #ccc', padding: '10px', background: '#fff' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

// Bypass parameters
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL WRAPPER
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
        }, { threshold: 0.08 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'pn-reveal--up';
    if (variant === 'zoom') baseClass = 'pn-reveal--zoom';
    else if (variant === 'left') baseClass = 'pn-reveal--left';
    else if (variant === 'right') baseClass = 'pn-reveal--right';
    else if (variant === 'down') baseClass = 'pn-reveal--down';

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

/* ==========================================================================
   SECTION 1: COVER (Front Page of Newspaper)
   ========================================================================== */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, coverImages, showPhotos }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || (isEn ? 'Valued Guest' : 'Tamu Undangan');

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const primaryEvent = safeArr(invitation?.events || []).find(e => e.is_primary) || safeArr(invitation?.events || [])[0];
    const eventDateStr = primaryEvent?.event_date || invitation?.countdown_target_date || '2026-12-25';
    
    const formattedDate = useMemo(() => {
        return formatDate(eventDateStr, invitation?.language || 'id');
    }, [eventDateStr, invitation?.language]);

    return (
        <div className={`pn-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="pn-cover__content">
                {/* TOP GROUP */}
                <div className="pn-cover-group-top">
                    {/* Newspaper Masthead */}
                    <div className="pn-cover__masthead">
                        <div className="pn-masthead-top-line">{isEn ? 'THE DAILY CELEBRATION' : 'EDISI UTAMA PERAYAAN'}</div>
                        <h1 className="pn-masthead-title">{isEn ? 'THE WEDDING CHRONICLE' : 'KABAR PERNIKAHAN'}</h1>
                        
                        <div className="pn-masthead-meta">
                            <span className="pn-masthead-meta-item">VOL. I NO. 1</span>
                            <span className="pn-masthead-meta-item">{formattedDate}</span>
                            <span className="pn-masthead-meta-item font-semibold">{isEn ? 'SPECIAL EDITION' : 'EDISI SPESIAL'}</span>
                        </div>
                    </div>

                    <div className="pn-masthead-bottom-border" />

                    {/* Cover Main Announcement */}
                    <div className="pn-cover-hero-headline">
                        <span className="pn-breaking-badge">{isEn ? 'BREAKING NEWS' : 'BERITA UTAMA'}</span>
                        <h2 className="pn-cover-heading-bold">
                            {String(coupleName || '').toUpperCase()} {isEn ? 'DECLARED THEIR SACRED COMMITMENT!' : 'MENYATAKAN KOMITMEN SUCI MEREKA!'}
                        </h2>
                    </div>
                </div>

                {/* CENTER GROUP */}
                <div className="pn-cover-group-center">
                    {/* Main Newspaper Photograph (Polaroid with Grayscale) */}
                    {showPhotos && coverImages.length > 0 ? (
                        <div className="pn-polaroid pn-tilt-left relative" style={{ zIndex: 10 }}>
                            <PaperClip />
                            <NewspaperPostStamp text={isEn ? "VALUED" : "BERHARGA"} />
                            <div className="pn-polaroid-inner">
                                <img src={coverImages[0]} alt="cover main" className="pn-toned-photo" />
                            </div>
                            <span className="pn-polaroid__caption">{coupleName}</span>
                        </div>
                    ) : (
                        <div className="pn-polaroid pn-tilt-left relative" style={{ padding: '35px 20px', zIndex: 10 }}>
                            <PaperClip />
                            <NewspaperPostStamp text={isEn ? "UNION" : "PERNYATAAN"} />
                            <div style={{ fontFamily: 'Special Elite', fontSize: '3.5rem', color: '#333', fontWeight: 'bold', lineHeight: 1 }}>
                                {(groom.nickname?.charAt(0) || 'G')}&{(bride.nickname?.charAt(0) || 'B')}
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM GROUP */}
                <div className="pn-cover-group-bottom">
                    <div className="pn-cover-columns">
                        <div className="pn-cover-column-left">
                            <p className="pn-column-text">
                                {isEn ? (
                                    `The sacred wedding between ${groom.full_name || 'the Groom'} and ${bride.full_name || 'the Bride'} will be held soon. This event marks the beginning of their journey together.`
                                ) : (
                                    `Pernikahan sakral antara ${groom.full_name || 'Mempelai Pria'} dan ${bride.full_name || 'Mempelai Wanita'} akan segera dilangsungkan. Acara ini menandai lembaran baru kehidupan mereka.`
                                )}
                            </p>
                        </div>
                        <div className="pn-cover-column-right">
                            <p className="pn-cover__dear">{t('invitation.dear_guest_title') || (isEn ? 'DEAR:' : 'KEPADA:')}</p>
                            <div className="pn-cover__guest">{guestName}</div>
                        </div>
                    </div>

                    <p className="pn-cover__apology">{t('invitation.dear_guest_desc')}</p>

                    <button type="button" onClick={onOpen} id="tombol-buka" className="pn-cover__btn">
                        <i className="fas fa-book-open" />
                        {t('invitation.open') || (isEn ? 'OPEN INVITATION' : 'BUKA UNDANGAN')}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   SECTION 2: OPENING (Editorial & Quote Page)
   ========================================================================== */
function OpeningSection({ invitation, brideGrooms, events, showCountdown, galleries, showPhotos }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const resolvedOpeningImages = useMemo(() => {
        const imgs = (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
        if (imgs.length > 0) return imgs;

        // Fallback to gallery photos if available
        const galleryImgs = safeArr(galleries).map(g => getStorageUrl(g.image_path || g.image_url)).filter(Boolean);
        if (galleryImgs.length > 0) return [galleryImgs[0]];

        // Fallback to default unsplash prewedding photo
        return ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'];
    }, [invitation?.opening_image, galleries]);

    const quoteTitle = invitation?.opening_title || t('invitation.opening_title') || 'The Wedding of';
    const quoteText = invitation?.opening_text || t('invitation.opening_text');
    const quoteAyat = invitation?.opening_ayat;
    const quoteAyatSrc = invitation?.opening_ayat_source;

    return (
        <section id="opening" className="pn-section pn-opening">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'EDITORIAL' : 'TAJUK RENCANA'}</span>
                <h2 className="pn-section-title">{quoteTitle}</h2>
                <NewspaperDivider />

                <h1 className="pn-opening-couple-name">{coupleName}</h1>

                {/* Countdown Timer right below the name in Opening Section */}
                {showCountdown && (
                    <div style={{ marginTop: '20px', marginBottom: '25px' }}>
                        <CountdownBlock events={events} />
                    </div>
                )}

                {/* Slideshow inside a styled polaroid frame */}
                {showPhotos && resolvedOpeningImages.length > 0 && (
                    <div className="pn-opening__slideshow-wrapper pn-polaroid relative">
                        <PaperClip />
                        <div className="pn-polaroid-inner">
                            <PremiumSlideshow
                                images={resolvedOpeningImages}
                                positionX={invitation?.opening_position_x}
                                positionY={invitation?.opening_position_y}
                                zoom={invitation?.opening_zoom}
                            />
                        </div>
                        <span className="pn-polaroid__caption">{t('invitation.our_moments') || (isEn ? 'OUR MOMENTS' : 'MOMEN KAMI')}</span>
                    </div>
                )}

                {/* Elegant Quote / Ayat Box */}
                {quoteAyat && (
                    <div className="pn-quote-box">
                        <p className="pn-quote-ayat">"{quoteAyat}"</p>
                        {quoteAyatSrc && <p className="pn-quote-source">— {quoteAyatSrc}</p>}
                    </div>
                )}

                {quoteText && <p className="pn-opening-text">{quoteText}</p>}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 3: COUPLE (The Happy Couple Profiles)
   ========================================================================== */
function BrideGroomSection({ brideGrooms, showPhotos, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const activeLang = invitation?.language || invitation?.default_locale || 'id';

    const groomInsta = (groom.instagram || '').replace('@', '').trim();
    const brideInsta = (bride.instagram || '').replace('@', '').trim();

    return (
        <section id="bride_groom" className="pn-section pn-couple">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'COUPLE PROFILE' : 'PROFIL MEMPELAI'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Groom & Bride' : 'Kedua Mempelai'}</h2>
                <NewspaperDivider />

                <div className="pn-couple-columns">
                    {/* Groom Profile */}
                    <div className="pn-couple-card pn-tilt-left">
                        {showPhotos && groom.photo ? (
                            <div className="pn-polaroid relative">
                                <PaperClip />
                                <div className="pn-polaroid-inner">
                                    <img src={getStorageUrl(groom.photo)} alt={groom.name} className="pn-toned-photo" />
                                </div>
                                <span className="pn-polaroid__caption">{isEn ? 'THE GROOM' : 'MEMPELAI PRIA'}</span>
                            </div>
                        ) : (
                            <div className="pn-monogram-initial">
                                {groom.nickname?.charAt(0) || 'G'}
                            </div>
                        )}

                        <h3 className="pn-couple-fullname">{groom.full_name}</h3>
                        <p className="pn-couple-parent">
                            {translateChildOrder(groom.child_order, 'pria', activeLang).toUpperCase()} {isEn ? 'OF' : 'DARI'}
                            <br />
                            <span className="font-semibold">{groom.father_name && `${isEn ? 'MR. ' : 'BAPAK '}${String(groom.father_name).toUpperCase()}`}</span>
                            <br />
                            {isEn ? 'AND' : '&'}
                            <br />
                            <span className="font-semibold">{groom.mother_name && `${isEn ? 'MRS. ' : 'IBU '}${String(groom.mother_name).toUpperCase()}`}</span>
                        </p>

                        {groom.bio && <p className="pn-couple-bio">"{groom.bio}"</p>}

                        {groomInsta && (
                            <a
                                href={`https://instagram.com/${groomInsta}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pn-couple-instagram"
                            >
                                <i className="fab fa-instagram" /> @{groomInsta}
                            </a>
                        )}
                    </div>

                    {/* Separation Line for Column */}
                    <div className="pn-couple-column-divider" />

                    {/* Bride Profile */}
                    <div className="pn-couple-card pn-tilt-right">
                        {showPhotos && bride.photo ? (
                            <div className="pn-polaroid relative">
                                <PaperClip />
                                <div className="pn-polaroid-inner">
                                    <img src={getStorageUrl(bride.photo)} alt={bride.name} className="pn-toned-photo" />
                                </div>
                                <span className="pn-polaroid__caption">{isEn ? 'THE BRIDE' : 'MEMPELAI WANITA'}</span>
                            </div>
                        ) : (
                            <div className="pn-monogram-initial">
                                {bride.nickname?.charAt(0) || 'B'}
                            </div>
                        )}

                        <h3 className="pn-couple-fullname">{bride.full_name}</h3>
                        <p className="pn-couple-parent">
                            {translateChildOrder(bride.child_order, 'wanita', activeLang).toUpperCase()} {isEn ? 'OF' : 'DARI'}
                            <br />
                            <span className="font-semibold">{bride.father_name && `${isEn ? 'MR. ' : 'BAPAK '}${String(bride.father_name).toUpperCase()}`}</span>
                            <br />
                            {isEn ? 'AND' : '&'}
                            <br />
                            <span className="font-semibold">{bride.mother_name && `${isEn ? 'MRS. ' : 'IBU '}${String(bride.mother_name).toUpperCase()}`}</span>
                        </p>

                        {bride.bio && <p className="pn-couple-bio">"{bride.bio}"</p>}

                        {brideInsta && (
                            <a
                                href={`https://instagram.com/${brideInsta}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pn-couple-instagram"
                            >
                                <i className="fab fa-instagram" /> @{brideInsta}
                            </a>
                        )}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SUB-COMPONENT: COUNTDOWN BLOCK
   ========================================================================== */
function CountdownBlock({ events }) {
    const activeLanguage = useMemo(() => {
        return safeArr(events)[0]?.invitation?.language || 'id';
    }, [events]);
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = primaryEvent?.event_date || '2026-12-25';
    const startTime = primaryEvent?.start_time || '08:00';

    const calculateTimeLeft = useCallback(() => {
        const ds = String(targetDate).substring(0, 10);
        const timeStr = String(startTime || '08:00').substring(0, 5);
        // Midnighttimezone safety offset: parse as local timezone hour
        const target = new Date(`${ds}T${timeStr}:00`);
        const now = new Date();
        const difference = target - now;

        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }, [targetDate, startTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return (
        <div className="pn-countdown-container">
            <div className="pn-countdown-title">{t('invitation.countdown_title') || 'COUNTDOWN TO THE CELEBRATION'}</div>
            <div className="pn-countdown-row">
                <div className="pn-countdown-item">
                    <span className="pn-countdown-val">{pad2(timeLeft.days)}</span>
                    <span className="pn-countdown-unit">{t('invitation.days') || 'Hari'}</span>
                </div>
                <div className="pn-countdown-divider">:</div>
                <div className="pn-countdown-item">
                    <span className="pn-countdown-val">{pad2(timeLeft.hours)}</span>
                    <span className="pn-countdown-unit">{t('invitation.hours') || 'Jam'}</span>
                </div>
                <div className="pn-countdown-divider">:</div>
                <div className="pn-countdown-item">
                    <span className="pn-countdown-val">{pad2(timeLeft.minutes)}</span>
                    <span className="pn-countdown-unit">{t('invitation.minutes') || 'Menit'}</span>
                </div>
                <div className="pn-countdown-divider">:</div>
                <div className="pn-countdown-item">
                    <span className="pn-countdown-val">{pad2(timeLeft.seconds)}</span>
                    <span className="pn-countdown-unit">{t('invitation.seconds') || 'Detik'}</span>
                </div>
            </div>
        </div>
    );
}

/* ==========================================================================
   SECTION 4: EVENTS (Event Details & Countdown)
   ========================================================================== */
function EventSection({ events, showCountdownInEvent, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const sortedEvents = useMemo(() => {
        return safeArr(events).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }, [events]);

    return (
        <section id="event" className="pn-section pn-event">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'EVENT SCHEDULE' : 'JADWAL ACARA'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Wedding Events' : 'Rangkaian Acara'}</h2>
                <NewspaperDivider />

                {/* Mandatory Countdown Timer inside Event Section */}
                {showCountdownInEvent && (
                    <div style={{ marginBottom: '35px' }}>
                        <CountdownBlock events={events} />
                    </div>
                )}

                <div className="pn-events-grid">
                    {sortedEvents.map((evt, idx) => {
                        const eventDateFormatted = formatDate(evt.event_date, activeLanguage);
                        const isAkad = ['akad', 'holy', 'holy_matrimony', 'pemberkatan'].includes(String(evt.event_type || '').toLowerCase());
                        
                        return (
                            <div key={evt.id || idx} className={`pn-event-card pn-card ${idx % 2 === 0 ? 'pn-tilt-left' : 'pn-tilt-right'}`}>
                                <PaperClip />
                                <NewspaperPostStamp text={isEn ? (isAkad ? "CEREMONY" : "RECEPTION") : (isAkad ? "AKAD NIKAH" : "RESEPSI")} />
                                
                                <h3 className="pn-event-name">{evt.event_name}</h3>
                                <div className="pn-event-line-divider" />
                                
                                <div className="pn-event-meta-info">
                                    <div className="pn-event-meta-item">
                                        <i className="far fa-calendar-alt" />
                                        <span>{eventDateFormatted}</span>
                                    </div>
                                    <div className="pn-event-meta-item">
                                        <i className="far fa-clock" />
                                        <span>{formatTime(evt.start_time)} - {evt.end_time === 'Selesai' || !evt.end_time ? (isEn ? 'Finished' : 'Selesai') : formatTime(evt.end_time)} {evt.timezone}</span>
                                    </div>
                                    <div className="pn-event-meta-item">
                                        <i className="fas fa-map-marker-alt" />
                                        <span className="font-semibold">{evt.venue_name}</span>
                                    </div>
                                </div>

                                <p className="pn-event-address">{evt.venue_address}</p>

                                {evt.gmaps_link && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(evt.gmaps_link, '_blank')}
                                        className="pn-btn-maps"
                                    >
                                        <i className="fas fa-location-arrow" /> {isEn ? 'OPEN GOOGLE MAPS' : 'BUKA GOOGLE MAPS'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 5: LIVE STREAMING
   ========================================================================== */
function LiveStreamingSection({ events, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    
    const streamsList = useMemo(() => {
        const list = [];
        if (primaryEvent?.streaming_url) {
            list.push({ platform: primaryEvent.streaming_platform || 'Live', url: primaryEvent.streaming_url });
        }
        if (Array.isArray(primaryEvent?.streamings)) {
            primaryEvent.streamings.forEach(s => {
                if (s.url && !list.some(item => item.url === s.url)) {
                    list.push({ platform: s.platform || 'Live', url: s.url });
                }
            });
        }
        return list;
    }, [primaryEvent]);

    if (streamsList.length === 0) return null;

    return (
        <section className="pn-section" id="livestream">
            <NewspaperWatermark />
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'BROADCAST' : 'SIARAN LANGSUNG'}</span>
                <h2 className="pn-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <NewspaperDivider />
                <p className="pn-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
                
                <div className="pn-livestream-container">
                    {streamsList.map((stream, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => window.open(stream.url, '_blank')}
                            className="pn-btn-livestream"
                        >
                            <i className="fas fa-video animate-pulse" /> {isEn ? 'WATCH ON' : 'TONTON DI'} {String(stream.platform || '').toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 6: LOVE STORY (The Editorial Chronicle)
   ========================================================================== */
function LoveStorySection({ loveStories, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const sortedStories = useMemo(() => {
        return safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }, [loveStories]);

    if (sortedStories.length === 0) return null;

    return (
        <section id="love_story" className="pn-section pn-love-story">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'LOVE STORY' : 'KRONOLOGI'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Our Love Story' : 'Kisah Cinta Kami'}</h2>
                <NewspaperDivider />

                <div className="pn-timeline">
                    {sortedStories.map((story, idx) => (
                        <div key={story.id || idx} className="pn-timeline-item">
                            <div className="pn-timeline-badge">{idx + 1}</div>
                            <div className={`pn-timeline-card pn-card ${idx % 2 === 0 ? 'pn-tilt-left' : 'pn-tilt-right'}`}>
                                <PaperClip />
                                <div className="pn-timeline-date">{formatDate(story.story_date, activeLanguage)}</div>
                                <h3 className="pn-timeline-title">{story.title}</h3>
                                <div className="pn-timeline-line" />
                                <p className="pn-timeline-desc">{story.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 7: DRESS CODE
   ========================================================================== */
function DressCodeSection({ invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const showDresscode = parseBool(invitation?.show_dresscode, false);

    if (!showDresscode) return null;

    const colors = invitation?.dresscode_colors ? invitation.dresscode_colors.split(',') : [];

    return (
        <section id="dresscode" className="pn-section pn-dresscode">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'DRESS CODE' : 'KODE BUSANA'}</span>
                <h2 className="pn-section-title">
                    {locale === 'en' ? 'Dress Code' : 'Kode Busana'}
                </h2>
                <NewspaperDivider />
                
                <div className="pn-dresscode-card pn-card pn-tilt-left">
                    <PaperClip />
                    <NewspaperPostStamp text={isEn ? "ATTIRE" : "PAKAIAN"} />
                    
                    <p className="pn-dresscode-description">
                        {invitation?.dresscode_text || (locale === 'en' 
                            ? 'Your presence in matching dress code color palette is highly appreciated to harmonize our celebration.' 
                            : 'Kehadiran Anda mengenakan warna dress code yang telah ditentukan akan sangat menyempurnakan harmoni pesta kami.')}
                    </p>

                    {colors.length > 0 && (
                        <div className="pn-dresscode-colors-flex">
                            {colors.map((color, idx) => (
                                <div key={idx} className="pn-dresscode-color-item">
                                    <div 
                                        className="pn-dresscode-color-circle" 
                                        style={{ backgroundColor: color.trim() }}
                                        title={color.trim()}
                                    />
                                    <span className="pn-dresscode-color-label">{color.trim().toUpperCase()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 8: VIDEO
   ========================================================================== */
function VideoSection({ invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const videoUrl = invitation?.video_url;
    
    if (!videoUrl) return null;

    const ytId = getYoutubeId(videoUrl);

    return (
        <section id="video" className="pn-section pn-video">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'DOCUMENTARY' : 'DOKUMENTASI'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Our Video' : 'Momen Video'}</h2>
                <NewspaperDivider />

                <div className="pn-video-card pn-card pn-tilt-right">
                    <PaperClip />
                    
                    {ytId ? (
                        <div className="pn-video-container">
                            <iframe
                                src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                                title="Wedding Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="pn-video-container">
                            <video src={getStorageUrl(videoUrl)} controls allowFullScreen />
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 9: GALLERY
   ========================================================================== */
function GallerySection({ galleries, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const list = safeArr(galleries);

    if (list.length === 0) return null;

    return (
        <section id="gallery" className="pn-section pn-gallery">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'GALLERY' : 'GALERI'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Our Moments' : 'Galeri Foto'}</h2>
                <NewspaperDivider />

                <div className="pn-gallery-grid">
                    {list.map((g, idx) => (
                        <div 
                            key={g.id || idx} 
                            className={`pn-gallery-item pn-polaroid ${
                                idx % 3 === 0 ? 'pn-tilt-left' : idx % 3 === 1 ? 'pn-tilt-right' : 'pn-tilt-left-more'
                            }`}
                        >
                            <PaperClip />
                            <div className="pn-polaroid-inner">
                                <img src={getStorageUrl(g.image_path || g.image_url)} alt={g.caption || `Gallery ${idx}`} />
                            </div>
                            {g.caption && <span className="pn-polaroid__caption">{g.caption}</span>}
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 10: DIGITAL GIFT (Bank Transfer Accounts)
   ========================================================================== */
function BankSection({ bankAccounts, invitation }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';
    const accounts = safeArr(bankAccounts);
    const [copiedId, setCopiedId] = useState(null);

    if (accounts.length === 0) return null;

    const handleCopy = (num, id) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2500);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2500);
                });
        } else {
            fallbackCopy(num);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        }
    };

    return (
        <section id="bank" className="pn-section pn-bank">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'SPONSORSHIP' : 'TANDA KASIH'}</span>
                <h2 className="pn-section-title">{locale === 'en' ? 'Digital Envelope' : 'Kado Digital'}</h2>
                <NewspaperDivider />
                <p className="pn-section-subtitle">{locale === 'en' ? 'Your blessing is our greatest gift' : 'Doa restu Anda adalah kado terindah bagi kami'}</p>

                <div className="pn-bank-cards">
                    {accounts.map(acc => {
                        const isBca = String(acc.bank_name).toLowerCase().includes('bca');
                        const isDana = String(acc.bank_name).toLowerCase().includes('dana');
                        const isMandiri = String(acc.bank_name).toLowerCase().includes('mandiri');

                        let logoSrc = null;
                        if (isBca) logoSrc = logoBca;
                        else if (isDana) logoSrc = logoDana;
                        else if (isMandiri) logoSrc = DEFAULT_ASSETS.mandiri;

                        return (
                            <div key={acc.id} className="pn-bank-card pn-card pn-tilt-right">
                                <PaperClip />
                                
                                <div className="pn-bank-card-header">
                                    {logoSrc ? (
                                        <img 
                                            src={logoSrc} 
                                            alt={acc.bank_name} 
                                            className="pn-card-bank-logo" 
                                        />
                                    ) : (
                                        <span className="pn-bank-card-bankname">{String(acc.bank_name || '').toUpperCase()}</span>
                                    )}
                                    <img src={chipAtm} alt="chip" className="pn-card-chip" />
                                </div>

                                <div className="pn-bank-card-num-box">
                                    <div className="pn-bank-number">{acc.account_number}</div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(acc.account_number, acc.id)}
                                        className="pn-btn-copy"
                                    >
                                        {copiedId === acc.id ? (
                                            <>
                                                <i className="fas fa-check" /> COPIED!
                                            </>
                                        ) : (
                                            <>
                                                <i className="far fa-copy" /> COPY NUMBER
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="pn-bank-holder">{String(acc.account_name || '').toUpperCase()}</div>
                            </div>
                        );
                    })}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 11: RSVP & WISHES (Unified Form & Scrollable Feed)
   ========================================================================== */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const [wishList, setWishList] = useState(safeArr(wishes));
    const isEn = locale === 'en';

    const defaultGuestName = useMemo(() => {
        return guest?.name
            || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
            || '';
    }, [guest]);

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guest?.id || null,
        sender_name: defaultGuestName,
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const wishesInputRef = useRef(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const routeName = enableRsvp ? 'invitation.rsvp.submit' : 'invitation.wish.submit';
        
        post(route(routeName, { slug: invitation.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                const newWish = {
                    id: Date.now(),
                    sender_name: data.sender_name || (isEn ? 'Guest' : 'Tamu Undangan'),
                    message: data.message,
                    is_attending: data.attendance === 'hadir' ? 1 : 0,
                    created_at: new Date().toISOString(),
                };
                if (data.message.trim() && enableWishes) {
                    setWishList(prev => [newWish, ...prev]);
                }
                reset('message');
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 4000);
            }
        });
    };

    return (
        <section id="rsvp" className="pn-section pn-rsvp-wishes">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'PARTICIPATION' : 'PARTISIPASI'}</span>
                <h2 className="pn-section-title">
                    {enableRsvp ? (isEn ? 'RSVP & Wishes' : 'RSVP & Ucapan') : (isEn ? 'Wishes Feed' : 'Kirim Ucapan')}
                </h2>
                <NewspaperDivider />

                <div className="pn-rsvp-wishes-grid">
                    {/* RSVP Form */}
                    <div className="pn-rsvp-form-card pn-card">
                        <PaperClip />
                        <NewspaperPostStamp text={isEn ? 'TELEGRAM' : 'SURAT KABAR'} />
                        
                        <form onSubmit={handleFormSubmit} className="pn-form">
                            <div className="pn-form-group">
                                <label className="pn-label">{isEn ? 'FULL NAME' : 'NAMA LENGKAP'}</label>
                                <input
                                    type="text"
                                    required
                                    value={data.sender_name}
                                    onChange={e => setData('sender_name', e.target.value)}
                                    placeholder={isEn ? 'Enter your full name...' : 'Masukkan nama lengkap Anda...'}
                                    className="pn-input"
                                    disabled={!!defaultGuestName}
                                />
                                {errors.sender_name && <div className="pn-error-msg">{errors.sender_name}</div>}
                            </div>

                            {enableRsvp && (
                                <>
                                    <div className="pn-form-group">
                                        <label className="pn-label">{isEn ? 'ATTENDANCE CONFIRMATION' : 'KONFIRMASI KEHADIRAN'}</label>
                                        <select
                                            value={data.attendance}
                                            onChange={e => setData('attendance', e.target.value)}
                                            className="pn-select-input"
                                        >
                                            <option value="hadir">{isEn ? 'I WILL ATTEND' : 'SAYA AKAN HADIR'}</option>
                                            <option value="tidak_hadir">{isEn ? 'I CANNOT ATTEND' : 'MAAF, SAYA TIDAK BISA HADIR'}</option>
                                        </select>
                                    </div>

                                    {data.attendance === 'hadir' && (
                                        <div className="pn-form-group">
                                            <label className="pn-label">{isEn ? 'NUMBER OF GUESTS' : 'JUMLAH ORANG'}</label>
                                            <select
                                                value={data.number_of_guests}
                                                onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                                className="pn-select-input"
                                            >
                                                {[1, 2, 3, 4, 5].map(v => (
                                                    <option key={v} value={v}>{v} {isEn ? 'Person' : 'Orang'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="pn-form-group relative">
                                <label className="pn-label">{isEn ? 'WISHES & MESSAGES' : 'DOA & UCAPAN'}</label>
                                <WishesEmojiPicker
                                    value={data.message}
                                    onChange={newValue => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                        ref={wishesInputRef}
                                        required
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder={isEn ? 'Write your warm wishes...' : 'Tuliskan ucapan selamat dan doa tulus Anda...'}
                                        rows={4}
                                        className="pn-textarea"
                                    />
                                </WishesEmojiPicker>
                            </div>

                            <button type="submit" disabled={processing} className="pn-btn-submit">
                                {processing ? (isEn ? 'SENDING...' : 'MENGIRIM...') : (isEn ? 'SEND TELEGRAM' : 'KIRIM TELEGRAM')}
                            </button>
                        </form>

                        {showSuccessToast && (
                            <div className="pn-toast-success">
                                <i className="fas fa-check-circle" /> {isEn ? 'Telegram sent successfully! Thank you.' : 'Telegram berhasil dikirim! Terima kasih.'}
                            </div>
                        )}
                    </div>

                    {/* Wishes Feed List (Scrollable - max 5 items, max-height 280px) */}
                    {enableWishes && wishList.length > 0 && (
                        <div className="pn-wishes-feed-card pn-card">
                            <PaperClip />
                            <NewspaperPostStamp text={isEn ? 'WISHES FEED' : 'KOLOM UCAPAN'} />
                            
                            <div className="pn-wishes-list-container">
                                {wishList.slice(0, 5).map((w, idx) => (
                                    <div key={w.id || idx} className="pn-wish-item">
                                        <div className="pn-wish-meta">
                                            <span className="pn-wish-sender">{String(w.sender_name || 'Tamu Undangan').toUpperCase()}</span>
                                            {(parseBool(w.is_attending, false) || w.attendance === 'hadir') && (
                                                <span className="pn-wish-attend-tag">{isEn ? 'ATTENDING' : 'HADIR'}</span>
                                            )}
                                        </div>
                                        <p className="pn-wish-text">{w.message}</p>
                                        <div className="pn-wish-divider" />
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

/* ==========================================================================
   SECTION 12: CLOSING (Formal Family Credits & Reseller Watermark)
   ========================================================================== */
function ClosingSection({ invitation, brideGrooms }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const isEn = locale === 'en';

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const closingTitle = invitation?.closing_title || t('invitation.closing_title') || 'THANK YOU';
    const closingText = invitation?.closing_text || t('invitation.closing_text');

    return (
        <section id="closing" className="pn-section pn-closing">
            <NewspaperWatermark />
            
            <Reveal variant="up">
                <span className="pn-badge-outline">{isEn ? 'CLOSING' : 'PENUTUP'}</span>
                <h2 className="pn-section-title">
                    {formatTitle(closingTitle)}
                </h2>
                <NewspaperDivider />

                {closingText && <p className="pn-closing-text">{closingText}</p>}

                {/* Family Credits Block */}
                {(hasGroomParents || hasBrideParents) && (
                    <div className="pn-closing-credits">
                        <div className="pn-credits-heading">{isEn ? 'WITH OUR JOY,' : 'KAMI YANG BERBAHAGIA,'}</div>
                        <div className="pn-credits-row">
                            {hasGroomParents && (
                                <div className="pn-credit-item">
                                    <div className="pn-credit-title">{isEn ? "GROOM'S FAMILY" : 'KELUARGA MEMPELAI PRIA'}</div>
                                    <div className="pn-credit-names">
                                        {isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}
                                    </div>
                                </div>
                            )}
                            
                            {hasGroomParents && hasBrideParents && <div className="pn-credits-divider" />}

                            {hasBrideParents && (
                                <div className="pn-credit-item">
                                    <div className="pn-credit-title">{isEn ? "BRIDE'S FAMILY" : 'KELUARGA MEMPELAI WANITA'}</div>
                                    <div className="pn-credit-names">
                                        {isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Watermark Reseller */}
                <p className="pn-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   NAVIGATION BOTTOM BAR
   ========================================================================== */
function Navigation({
    activeSection,
    onTabClick,
    resolvedSections,
    enableRsvp,
    isOpened,
    invitation
}) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    // Scroll left calculation for fixed horizontal navigation
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.pn-nav-menu');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    if (!isOpened) return null;

    const navItems = [];
    resolvedSections.forEach(s => {
        let key = s.section_key;
        if (key === 'wishes' && enableRsvp) return;
        if (key === 'video') return;

        let icon = 'fa-comment';
        let label = isEn ? 'Wishes' : 'Ucapan';

        if (key === 'opening') { icon = 'fa-home'; label = isEn ? 'Home' : 'Beranda'; }
        else if (key === 'bride_groom') { icon = 'fa-heart'; label = isEn ? 'Couple' : 'Mempelai'; }
        else if (key === 'event') { icon = 'fa-calendar-alt'; label = isEn ? 'Events' : 'Acara'; }
        else if (key === 'love_story') { icon = 'fa-history'; label = isEn ? 'Stories' : 'Kisah'; }
        else if (key === 'gallery') { icon = 'fa-images'; label = isEn ? 'Gallery' : 'Galeri'; }
        else if (key === 'bank') { icon = 'fa-gift'; label = isEn ? 'Gifts' : 'Kado'; }
        else if (key === 'rsvp') { icon = 'fa-envelope-open-text'; label = 'RSVP'; }
        else if (key === 'livestream') { icon = 'fa-video'; label = 'Live'; }
        else if (key === 'closing') { icon = 'fa-signature'; label = isEn ? 'Closing' : 'Penutup'; }

        if (!navItems.some(item => item.key === key)) {
            navItems.push({ key, icon, label });
        }
    });

    return (
        <div className="pn-nav-wrapper">
            <nav className="pn-nav-menu">
                {navItems.map(item => {
                    const isActive = activeSection === item.key;
                    return (
                        <button
                            key={item.key}
                            id={`nav-btn-${item.key}`}
                            type="button"
                            onClick={() => onTabClick(item.key)}
                            className={`pn-nav-btn ${isActive ? 'is-active' : ''}`}
                        >
                            <i className={`fas ${item.icon}`} />
                            <span className="pn-nav-label">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

/* ==========================================================================
   MAIN DYNAMIC INDEX COMPONENT
   ========================================================================== */
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
    const { t, locale } = useTranslation(invitation?.language || 'id');
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(parseBool(invitation?.enable_auto_scroll, true));
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

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

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';

    // Parse configuration overrides
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const showCountdown = parseBool(invitation?.show_countdown);
    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

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

    // Document title
    useEffect(() => {
        const groom = safeArr(brideGrooms).find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()));
        const bride = safeArr(brideGrooms).find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase()));
        if (groom?.nickname && bride?.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding Chronicle`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, brideGrooms]);

    // Handle Open action
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

    // Lock page scroll initially
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    }, [isOpened, isSlideMode]);

    // Music toggle
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

    // Parse cover slideshow photos
    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    // Build the resolved list of active sections
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'video', 'bank', 'rsvp', 'wishes', 'closing', 'livestream', 'dresscode'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;
        const showDresscode = parseBool(invitation?.show_dresscode, false);

        const resolved = [];

        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);

            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery') {
                    if (galleries?.length > 0 && showPhotos) {
                        resolved.push(s);
                    }
                    if (invitation?.video_url) {
                        resolved.push({ section_key: 'video' });
                    }
                    return;
                }
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                if (s.section_key === 'countdown') return;

                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return; // merged
                }

                if (s.section_key === 'livestream' && !hasStream) return;
                if (s.section_key === 'dresscode' && !showDresscode) return;

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
            if (showDresscode) fallbacks.push({ section_key: 'dresscode' });
            if (showPhotos && galleries?.length > 0) fallbacks.push({ section_key: 'gallery' });
            if (invitation?.video_url) fallbacks.push({ section_key: 'video' });
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
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes, showPhotos, invitation?.video_url, invitation?.show_dresscode]);

    // Slide Mode: Sync index to key
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            setActiveSectionId(key);
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

    // Scroll Mode: Scrollspy
    useEffect(() => {
        if (!isOpened || isSlideMode) return;

        const handleScroll = () => {
            const keys = resolvedSections.map(s => {
                let k = s.section_key;
                if (k === 'wishes' && enableRsvp) return 'rsvp';
                return k;
            });
            const uniqueKeys = [...new Set(keys)];
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

    // Auto Scroll Driver
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) {
                        return 0; // loops back to beginning
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

    // Pause Auto Scroll on Manual interaction
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.pn-floating-btn') || 
                e.target.closest('.pn-nav-menu') || 
                e.target.closest('input') ||
                e.target.closest('textarea') ||
                e.target.closest('select')
            ) {
                return;
            }
            setAutoScrollEnabled(false);
        };

        window.addEventListener('wheel', handleUserInteraction, { passive: true });
        window.addEventListener('touchstart', handleUserInteraction, { passive: true });
        window.addEventListener('mousedown', handleUserInteraction, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleUserInteraction);
            window.removeEventListener('touchstart', handleUserInteraction);
            window.removeEventListener('mousedown', handleUserInteraction);
        };
    }, [isOpened, autoScrollEnabled]);

    // Navigation Tab click handler
    const handleTabClick = (sectionKey) => {
        setAutoScrollEnabled(false);
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => {
                let k = s.section_key;
                if (k === 'wishes' && enableRsvp) return 'rsvp' === sectionKey;
                return k === sectionKey;
            });
            if (idx !== -1) {
                setActiveSlideIdx(idx);
            }
        } else {
            const el = document.getElementById(sectionKey);
            if (el) {
                const topOffset = el.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: topOffset, behavior: 'smooth' });
            }
        }
    };

    // Render section dynamically by key
    const renderSection = (sectionKey) => {
        switch (sectionKey) {
            case 'opening':
                return (
                    <OpeningSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        events={events}
                        showCountdown={showCountdown}
                        galleries={galleries}
                        showPhotos={showPhotos}
                    />
                );
            case 'bride_groom':
                return <BrideGroomSection brideGrooms={brideGrooms} showPhotos={showPhotos} invitation={invitation} />;
            case 'event':
                return <EventSection events={events} showCountdownInEvent={showCountdownInEvent} invitation={invitation} />;
            case 'livestream':
                return <LiveStreamingSection events={events} invitation={invitation} />;
            case 'love_story':
                return <LoveStorySection loveStories={loveStories} invitation={invitation} />;
            case 'dresscode':
                return <DressCodeSection invitation={invitation} />;
            case 'video':
                return <VideoSection invitation={invitation} />;
            case 'gallery':
                return <GallerySection galleries={galleries} invitation={invitation} />;
            case 'bank':
                return <BankSection bankAccounts={bankAccounts} invitation={invitation} />;
            case 'rsvp':
            case 'wishes':
                return (
                    <UnifiedRsvpWishes
                        invitation={invitation}
                        wishes={wishes}
                        guest={guest}
                        enableRsvp={enableRsvp}
                        enableWishes={enableWishes}
                    />
                );
            case 'closing':
                return <ClosingSection invitation={invitation} brideGrooms={brideGrooms} />;
            default:
                return null;
        }
    };

    return (
        <ErrorBoundary>
            <div className={`pn-page ${!showAnimations ? 'theme-no-animations' : ''}`}>
                <div className="pn-container">
                    {/* Background audio tag */}
                    {invitation?.music_url && (
                        <audio
                            ref={audioRef}
                            src={getStorageUrl(invitation.music_url)}
                            loop
                        />
                    )}

                    {/* COVER */}
                    <CoverSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        guest={guest}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        coverImages={coverImages}
                        showPhotos={showPhotos}
                    />

                    {/* INVITATION DETAILS */}
                    {isOpened && (
                        <div className="pn-content-sections-wrapper">
                            {isSlideMode ? (
                                <div className="pn-slides-container">
                                    {resolvedSections.map((sec, idx) => {
                                        const isActive = idx === activeSlideIdx;
                                        const isPrev = idx === activeSlideIdx - 1;
                                        const isNext = idx === activeSlideIdx + 1;
                                        const isBeforePrev = idx < activeSlideIdx - 1;
                                        const isAfterNext = idx > activeSlideIdx + 1;
                                        
                                        let slideClass = '';
                                        if (isActive) slideClass = 'is-active';
                                        else if (isPrev) slideClass = 'is-prev';
                                        else if (isNext) slideClass = 'is-next';
                                        else if (isBeforePrev) slideClass = 'is-before-prev';
                                        else if (isAfterNext) slideClass = 'is-after-next';

                                        const sectionKey = sec.section_key;

                                        return (
                                            <div 
                                                key={idx} 
                                                id={sectionKey === 'wishes' && enableRsvp ? 'rsvp' : sectionKey}
                                                className={`pn-slide-item ${slideClass}`}
                                            >
                                                <div className="pn-slide-item-scrollable">
                                                    {renderSection(sectionKey)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                resolvedSections.map((sec, idx) => {
                                    const sectionKey = sec.section_key;
                                    // Skip merged wishes section
                                    if (sectionKey === 'wishes' && enableRsvp) return null;

                                    return (
                                        <div key={idx} id={sectionKey}>
                                            {renderSection(sectionKey)}
                                            {idx < resolvedSections.length - 1 && (
                                                <TornPaperEdge color="#f4f0ea" flip={idx % 2 === 0} />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* FLOATING ACTION CONTROL BUTTONS */}
                    {isOpened && (
                        <div className="pn-floating-controls">
                            {/* Fullscreen Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="pn-floating-btn"
                                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                            >
                                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                            </button>

                            {/* Auto-Scroll Toggle Button */}
                            <button
                                type="button"
                                onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                                className={`pn-floating-btn ${autoScrollEnabled ? 'is-active' : ''}`}
                                title={autoScrollEnabled ? "Mute Auto-Scroll" : "Play Auto-Scroll"}
                            >
                                <i className={`fas ${autoScrollEnabled ? 'fa-pause' : 'fa-scroll'}`} />
                            </button>

                            {/* QR Check-in Trigger Button */}
                            {enableQr && guest && (
                                <button
                                    type="button"
                                    onClick={() => setShowQr(true)}
                                    className="pn-floating-btn pn-floating-btn-qr"
                                    title="QR Presensi"
                                >
                                    <i className="fas fa-qrcode" />
                                </button>
                            )}

                            {/* Background Music Mute Button */}
                            {invitation?.music_url && (
                                <button
                                    type="button"
                                    onClick={toggleMusic}
                                    className="pn-floating-btn pn-floating-btn-audio"
                                    title="Music Volume"
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

                    {/* RSVP / WISHES FLOATING MENU */}
                    <Navigation
                        activeSection={activeSectionId}
                        onTabClick={handleTabClick}
                        resolvedSections={resolvedSections}
                        enableRsvp={enableRsvp}
                        isOpened={isOpened}
                        invitation={invitation}
                    />
                </div>
            </div>

            {/* QR CODE PRESENSI MODAL OVERLAY */}
            {enableQr && showQr && guest && (
                <div className="pn-qr-modal-overlay">
                    <div className="pn-qr-modal-content">
                        <h3 className="pn-qr-title">{locale === 'en' ? 'QR ATTENDANCE' : 'QR PRESENSI'}</h3>
                        <p className="pn-qr-desc">
                            {locale === 'en' 
                                ? 'Show this QR Code to the event committee at the venue to check-in digitally.'
                                : 'Tunjukkan QR Code ini pada panitia acara di lokasi untuk melakukan check-in kehadiran secara digital.'}
                        </p>
                        
                        <div className="pn-qr-frame">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=222222&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                alt="QR Code Presensi" 
                            />
                        </div>

                        <div className="pn-qr-guest-name">{String(guest.name || '').toUpperCase()}</div>

                        <button 
                            type="button" 
                            onClick={() => setShowQr(false)} 
                            className="pn-qr-btn-close"
                        >
                            {locale === 'en' ? 'CLOSE' : 'TUTUP'}
                        </button>
                    </div>
                </div>
            )}
        </ErrorBoundary>
    );
}
