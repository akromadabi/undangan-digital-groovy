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
    // Potong YYYY-MM-DD, append T12:00:00 untuk menghindari offset UTC midnight
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

/* ═══════════════════════════════════════
   DECORATIVE ELEMENTS
   ═══════════════════════════════════════ */
function TornPaperEdge({ color = '#faf7f2', flip = false }) {
    return (
        <div className={`ps-torn-edge ${flip ? 'ps-torn-edge--flip' : ''}`}>
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ fill: color, width: '100%', height: '24px', display: 'block' }}>
                <path d="M0,0 L1200,0 L1200,80 L1185,73 L1170,82 L1155,68 L1140,78 L1125,73 L1110,82 L1095,68 L1080,78 L1065,73 L1050,82 L1035,68 L1020,78 L1005,73 L990,82 L975,68 L960,78 L945,73 L930,82 L915,68 L900,78 L885,73 L870,82 L855,68 L840,78 L825,73 L810,82 L795,68 L780,78 L765,73 L750,82 L735,68 L720,78 L705,73 L690,82 L675,68 L660,78 L645,73 L630,82 L615,68 L600,78 L585,73 L570,82 L555,68 L540,78 L525,73 L510,82 L495,68 L480,78 L465,73 L450,82 L435,68 L420,78 L405,73 L390,82 L375,68 L360,78 L345,73 L330,82 L315,68 L300,78 L285,73 L270,82 L255,68 L240,78 L225,73 L210,82 L195,68 L180,78 L165,73 L150,82 L135,68 L120,78 L105,73 L90,82 L75,68 L60,78 L45,73 L30,82 L15,68 L0,78 Z" />
            </svg>
        </div>
    );
}

function ScribbleStar({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 24 24" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '20px', height: '20px', ...style }}>
            <path d="M12 2 L14.5 8.5 L21.5 9 L16.5 13.5 L18 20 L12 16.5 L6 20 L7.5 13.5 L2.5 9 L9.5 8.5 Z" stroke="var(--ps-accent)" strokeWidth="1.8" fill="none" />
        </svg>
    );
}

function ScribbledHeart({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '30px', height: '30px', ...style }}>
            <path d="M50 35 C50 15, 80 15, 80 38 C80 58, 50 82, 50 82 C50 82, 20 58, 20 38 C20 15, 50 15, 50 35 Z" stroke="var(--ps-primary)" strokeWidth="2.5" fill="none" />
        </svg>
    );
}

function ScribbleSparkle({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 24 24" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '18px', height: '18px', ...style }}>
            <path d="M12 3 Q12 12 3 12 Q12 12 12 21 Q12 12 21 12 Q12 12 12 3 Z" stroke="var(--ps-accent)" strokeWidth="1.8" fill="none" />
        </svg>
    );
}

function ScribbleSwirl({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 50 50" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '32px', height: '32px', ...style }}>
            <path d="M25 25 C20 20, 15 25, 20 30 C25 35, 35 30, 30 20 C25 10, 10 15, 15 30 C20 45, 45 40, 40 15" stroke="var(--ps-secondary)" strokeWidth="2" fill="none" />
        </svg>
    );
}

function ScribbleArrow({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 40 40" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '35px', height: '35px', ...style }}>
            <path d="M10 30 Q25 25 30 10 M22 12 L30 10 L28 18" stroke="var(--ps-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ScribbleCircle({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '60px', height: '60px', ...style }}>
            <path d="M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C70 85, 85 70, 85 50 C85 30, 70 17, 48 18 C32 19, 18 32, 19 48" stroke="var(--ps-primary)" strokeWidth="2" fill="none" />
        </svg>
    );
}

function ScribbleUnderline({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 200 20" className={`ps-doodle ${className}`} style={{ width: '120px', height: '10px', display: 'block', margin: '4px auto 0 auto', ...style }}>
            <path d="M10 10 Q90 15 190 8 M15 13 Q100 8 185 11" stroke="var(--ps-accent)" strokeWidth="2" fill="none" />
        </svg>
    );
}

function ScribbleDoubleHeart({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '36px', height: '36px', ...style }}>
            <path d="M45 45 C45 28, 70 28, 70 47 C70 63, 45 83, 45 83 C45 83, 20 63, 20 47 C20 28, 45 28, 45 45 Z" stroke="var(--ps-primary)" strokeWidth="2.5" fill="none" />
            <path d="M68 33 C68 23, 83 23, 83 35 C83 45, 68 57, 68 57 C68 57, 53 45, 53 35 C53 23, 68 23, 68 33 Z" stroke="var(--ps-accent)" strokeWidth="2" fill="none" transform="rotate(15 68 33)" />
        </svg>
    );
}

function ScribbleFlower({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '32px', height: '32px', ...style }}>
            <circle cx="50" cy="50" r="8" stroke="var(--ps-accent)" strokeWidth="2" fill="none" />
            <path d="M50 42 C46 25, 54 25, 50 42
                     M58 50 C75 46, 75 54, 58 50
                     M50 58 C54 75, 46 75, 50 58
                     M42 50 C25 54, 25 46, 42 50
                     M44 44 C30 30, 38 22, 44 44
                     M56 44 C70 30, 78 38, 56 44
                     M56 56 C70 70, 62 78, 56 56
                     M44 56 C30 70, 22 62, 44 56" stroke="var(--ps-accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    );
}

function ScribbleCrown({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '30px', height: '30px', ...style }}>
            <path d="M20 70 L15 35 L38 50 L50 25 L62 50 L85 35 L80 70 Z M20 70 Q50 75 80 70" stroke="var(--ps-accent)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="35" r="2.5" fill="var(--ps-accent)" />
            <circle cx="50" cy="25" r="2.5" fill="var(--ps-accent)" />
            <circle cx="85" cy="35" r="2.5" fill="var(--ps-accent)" />
        </svg>
    );
}

function ScribbleSpiralArrow({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '45px', height: '45px', ...style }}>
            <path d="M20 20 C35 15, 60 25, 45 45 C35 60, 65 65, 80 50 M68 45 L80 50 L75 65" stroke="var(--ps-primary)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ScribbleSmiley({ className = '', style = {} }) {
    return (
        <svg viewBox="0 0 100 100" className={`ps-doodle ${className}`} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 10, width: '30px', height: '30px', ...style }}>
            <path d="M50 15 C30 15, 15 30, 15 50 C15 70, 30 85, 50 85 C70 85, 85 70, 85 50 C85 30, 70 15, 50 15 Z" stroke="var(--ps-secondary)" strokeWidth="2" fill="none" />
            <circle cx="38" cy="42" r="2.5" fill="var(--ps-secondary)" />
            <circle cx="62" cy="42" r="2.5" fill="var(--ps-secondary)" />
            <path d="M35 58 Q50 72 65 58" stroke="var(--ps-secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
    );
}


function BinderRings() {
    const ringItems = Array.from({ length: 15 }, (_, i) => i);
    return (
        <div className="ps-binder-rings">
            {ringItems.map(i => (
                <div key={i} className="ps-ring" />
            ))}
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
            <div className="theme-error-boundary" style={{ padding: 20, color: '#2e2a25', background: '#faf7f2', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#b85c4c', fontFamily: 'Special Elite', fontSize: '1.5rem' }}>Terjadi kesalahan pada rendering tema.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#555', marginTop: 10, maxWidth: '90%' }}>
                    {this.state.error?.toString()}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

// Control parameters for bypass modes
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
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'ps-reveal--up';
    if (variant === 'zoom') baseClass = 'ps-reveal--zoom';
    else if (variant === 'left') baseClass = 'ps-reveal--left';
    else if (variant === 'right') baseClass = 'ps-reveal--right';
    else if (variant === 'down') baseClass = 'ps-reveal--down';

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
   SECTION 1: COVER
   ========================================================================== */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, coverImages, showPhotos }) {
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
        return formatDate(eventDateStr, invitation?.language || 'id');
    }, [eventDateStr, invitation?.language]);

    return (
        <div className={`ps-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="ps-cover__content">
                <span className="ps-cover__the-wedding">{t('invitation.wedding_of')}</span>
                
                {showPhotos && coverImages.length > 0 ? (
                    <div className="ps-polaroid ps-tilt-left relative" style={{ zIndex: 10 }}>
                        <ScribbleCrown style={{ top: '-15px', right: '25px', transform: 'rotate(12deg)', width: '32px', height: '32px' }} />
                        <div className="ps-tape ps-tape-top ps-tape--teal" />
                        <div className="ps-polaroid-inner">
                            <img src={coverImages[0]} alt="cover main" className="ps-toned-photo" />
                        </div>
                        <span className="ps-polaroid__caption">{coupleName}</span>
                    </div>
                ) : (
                    <div className="ps-polaroid ps-tilt-left relative" style={{ padding: '40px 20px', zIndex: 10 }}>
                        <ScribbleCrown style={{ top: '-15px', right: '25px', transform: 'rotate(12deg)', width: '32px', height: '32px' }} />
                        <div className="ps-tape ps-tape-top ps-tape--teal" />
                        <div style={{ fontFamily: 'var(--ps-font-script)', fontSize: '4.5rem', color: 'var(--ps-accent)', fontWeight: 'bold', lineHeight: 1 }}>
                            {(groom.nickname?.charAt(0) || 'G')}&{(bride.nickname?.charAt(0) || 'B')}
                        </div>
                    </div>
                )}

                <h1 className="ps-cover__couple">{coupleName}</h1>
                
                <div className="ps-date-stroke">
                    {formattedDate}
                </div>

                <p className="ps-cover__dear">{t('invitation.dear_guest_title') || 'Dear:'}</p>
                <div className="ps-cover__guest">{guestName}</div>
                <p className="ps-cover__apology">{t('invitation.dear_guest_desc')}</p>

                <button type="button" onClick={onOpen} id="tombol-buka" className="ps-cover__btn">
                    <i className="fas fa-book-open" />
                    {t('invitation.open')}
                </button>
            </div>
            
            <ScribbledHeart style={{ top: '10%', left: '8%', transform: 'rotate(-15deg)' }} />
            <ScribbleStar style={{ bottom: '25%', right: '12%', transform: 'rotate(25deg)' }} />
            <ScribbleSwirl style={{ top: '12%', right: '14%', transform: 'rotate(15deg)', width: '32px', height: '32px' }} />
            <ScribbleSparkle style={{ bottom: '15%', left: '12%', transform: 'rotate(-10deg)' }} />
            <ScribbleArrow style={{ bottom: '70px', left: '22%', transform: 'rotate(75deg)' }} />
            <ScribbleSmiley style={{ bottom: '10%', right: '8%', transform: 'rotate(5deg)' }} />
        </div>
    );
}

/* ==========================================================================
   SECTION 2: OPENING
   ========================================================================== */
function OpeningSection({ invitation, brideGrooms, events, showCountdown, galleries, showPhotos }) {
    const { t, locale } = useTranslation();
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

    const titleLower = String(invitation?.opening_title || '').toLowerCase();
    const showTheWeddingSubtitle = (!titleLower || titleLower.includes('bismillah') || titleLower.includes('bismilah')) && !titleLower.includes('wedding') && !titleLower.includes('pernikahan');

    return (
        <section id="opening" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title" style={{ position: 'relative' }}>
                    <ScribbleSparkle style={{ top: '-10px', left: '-22px', width: '16px', height: '16px' }} />
                    {invitation?.opening_title || 'Bismillahirrahmanirrahim'}
                    <ScribbleStar style={{ top: '-6px', right: '-25px', width: '18px', height: '18px' }} />
                </h2>
                <ScribbleUnderline style={{ width: '80px' }} />
                {showTheWeddingSubtitle && (
                    <p className="ps-section-subtitle" style={{ marginTop: '8px', marginBottom: '20px' }}>The Wedding of</p>
                )}

                <div className="ps-opening__couple-name">
                    {coupleName}
                </div>

                {showPhotos && resolvedOpeningImages.length > 0 && (
                    <div className="ps-polaroid ps-tilt-right relative" style={{ marginBottom: '25px' }}>
                        <div className="ps-tape ps-tape-top-left ps-tape--red" />
                        <div className="ps-paperclip" />
                        <ScribbleStar style={{ top: '-12px', right: '-12px', transform: 'rotate(15deg)', width: '24px', height: '24px' }} />
                        <ScribbleSparkle style={{ bottom: '-10px', left: '-12px' }} />
                        <div className="ps-opening__slideshow-wrapper">
                            <PremiumSlideshow
                                images={resolvedOpeningImages}
                                positionX={invitation?.opening_position_x}
                                positionY={invitation?.opening_position_y}
                                zoom={invitation?.opening_zoom}
                            />
                        </div>
                    </div>
                )}

                {showCountdown && (
                    <div style={{ marginTop: '15px', marginBottom: '25px', position: 'relative' }}>
                        <CountdownBlock events={events} />
                        <ScribbleSpiralArrow style={{ top: '10px', right: '-15px', transform: 'rotate(45deg) scaleX(-1)', width: '32px', height: '32px' }} />
                    </div>
                )}

                {invitation?.opening_ayat && (
                    <div className="ps-card ps-quote-card" style={{ transform: 'rotate(-0.5deg)', backgroundColor: '#faf7f2', border: '1px solid #eadecc' }}>
                        <ScribbledHeart style={{ top: '6px', right: '6px' }} />
                        <p className="ps-opening__ayat" style={{ fontFamily: 'var(--ps-font-script)', margin: '0 0 10px 0' }}>
                            &ldquo;{invitation.opening_ayat}&rdquo;
                        </p>
                        {invitation?.opening_ayat_source && (
                            <p className="ps-opening__source" style={{ margin: 0 }}>&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}

                <p className="ps-opening__text">
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia mengenai hari pernikahan kami.'}
                </p>
                <ScribbleFlower style={{ bottom: '10px', left: '15px', transform: 'rotate(-15deg)', width: '28px', height: '28px' }} />
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 3: BRIDE & GROOM
   ========================================================================== */
function BrideGroomSection({ brideGrooms, showPhotos }) {
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
        <section id="bride_groom" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{t('invitation.mempelai')}</h2>
                <ScribbleUnderline style={{ width: '90px' }} />
                <p className="ps-section-subtitle">Groom &amp; Bride</p>
            </Reveal>

            {/* Groom (Pria) */}
            <Reveal className="ps-mempelai-card" variant="left">
                <div className="ps-polaroid ps-tilt-left-more relative">
                    <ScribbledHeart style={{ bottom: '-15px', right: '15px', transform: 'rotate(15deg)', width: '28px', height: '28px' }} />
                    <ScribbleStar style={{ top: '-10px', right: '10px', transform: 'rotate(25deg)' }} />
                    <ScribbleCircle style={{ position: 'absolute', bottom: '-8px', left: '20px', width: '50px', height: '50px', opacity: 0.7 }} />
                    <div className="ps-tape ps-tape-top-left ps-tape--mustard" />
                    <div className="ps-polaroid-inner">
                        {showPhotos && groom.photo ? (
                            <img 
                                src={getStorageUrl(groom.photo)} 
                                alt={groom.full_name || 'Groom'} 
                                className="ps-toned-photo" 
                                style={{
                                    objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                    transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                }}
                            />
                        ) : (
                            <div style={{ aspectRatio: '1/1', background: '#eadecc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ps-font-script)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--ps-secondary)' }}>
                                {groom.nickname?.charAt(0) || 'G'}
                            </div>
                        )}
                    </div>
                    <span className="ps-polaroid__caption" style={{ position: 'relative' }}>
                        <ScribbleCrown style={{ top: '-12px', left: '-5px', transform: 'rotate(-10deg)', width: '24px', height: '24px' }} />
                        {groom.nickname || 'Groom'}
                    </span>
                </div>
                
                <div className="ps-mempelai-details">
                    <h3 className="ps-mempelai-name">{groom.full_name || 'Nama Lengkap Pria'}</h3>
                    <p className="ps-mempelai-parent-label">
                        {translateChildOrder(groom.child_order, 'pria')}
                    </p>
                    <p className="ps-mempelai-parents">
                        {groom.father_name && groom.mother_name
                            ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                            : (groom.father_name || groom.mother_name || '')}
                    </p>
                    {groom.instagram && (
                        <a
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ps-mempelai-ig"
                        >
                            <i className="fab fa-instagram" /> @{groom.instagram.replace('@', '')}
                        </a>
                    )}
                </div>
            </Reveal>

            {/* Ampersand separator */}
            <Reveal className="ps-and-divider relative" variant="zoom" style={{ margin: '15px 0' }}>
                <ScribbleSwirl style={{ top: '-10px', left: '12%', transform: 'rotate(-30deg)', width: '28px', height: '28px' }} />
                <ScribbleSparkle style={{ bottom: '-5px', right: '18%', width: '16px', height: '16px' }} />
                <span className="ps-and-divider-text">and</span>
            </Reveal>

            {/* Bride (Wanita) */}
            <Reveal className="ps-mempelai-card" variant="right">
                <div className="ps-polaroid ps-tilt-right-more relative">
                    <ScribbleFlower style={{ top: '-15px', left: '-5px', transform: 'rotate(-20deg)', width: '28px', height: '28px' }} />
                    <ScribbleDoubleHeart style={{ bottom: '-18px', left: '15px', transform: 'rotate(-15deg)', width: '35px', height: '35px' }} />
                    <ScribbleStar style={{ bottom: '20px', right: '-12px', transform: 'rotate(10deg)', width: '18px', height: '18px' }} />
                    <div className="ps-tape ps-tape-top-right ps-tape--teal" />
                    <div className="ps-polaroid-inner">
                        {showPhotos && bride.photo ? (
                            <img 
                                src={getStorageUrl(bride.photo)} 
                                alt={bride.full_name || 'Bride'} 
                                className="ps-toned-photo" 
                                style={{
                                    objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                    transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                }}
                            />
                        ) : (
                            <div style={{ aspectRatio: '1/1', background: '#eadecc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ps-font-script)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--ps-primary)' }}>
                                {bride.nickname?.charAt(0) || 'B'}
                            </div>
                        )}
                    </div>
                    <span className="ps-polaroid__caption">{bride.nickname || 'Bride'}</span>
                </div>
                
                <div className="ps-mempelai-details">
                    <h3 className="ps-mempelai-name">{bride.full_name || 'Nama Lengkap Wanita'}</h3>
                    <p className="ps-mempelai-parent-label">
                        {translateChildOrder(bride.child_order, 'wanita')}
                    </p>
                    <p className="ps-mempelai-parents">
                        {bride.father_name && bride.mother_name
                            ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                            : (bride.father_name || bride.mother_name || '')}
                    </p>
                    {bride.instagram && (
                        <a
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ps-mempelai-ig"
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

    return (
        <div className="ps-countdown-wrapper">
            <h3 className="ps-section-subtitle" style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                {t('invitation.save_the_date') === 'Save The Date' ? 'Counting Down' : 'Menghitung Hari'}
            </h3>
            <div className="ps-countdown">
                <div className="ps-countdown__item">
                    <div className="ps-countdown__value">
                        {pad2(timeLeft.d).split('').map((digit, idx) => (
                            <span key={`d-${idx}`} className="ps-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="ps-countdown__label">{t('invitation.days')}</span>
                </div>
                <span className="ps-countdown__colon">:</span>
                <div className="ps-countdown__item">
                    <div className="ps-countdown__value">
                        {pad2(timeLeft.h).split('').map((digit, idx) => (
                            <span key={`h-${idx}`} className="ps-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="ps-countdown__label">{t('invitation.hours')}</span>
                </div>
                <span className="ps-countdown__colon">:</span>
                <div className="ps-countdown__item">
                    <div className="ps-countdown__value">
                        {pad2(timeLeft.m).split('').map((digit, idx) => (
                            <span key={`m-${idx}`} className="ps-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="ps-countdown__label">{t('invitation.minutes')}</span>
                </div>
                <span className="ps-countdown__colon">:</span>
                <div className="ps-countdown__item">
                    <div className="ps-countdown__value">
                        {pad2(timeLeft.s).split('').map((digit, idx) => (
                            <span key={`s-${idx}`} className="ps-countdown__digit">{digit}</span>
                        ))}
                    </div>
                    <span className="ps-countdown__label">{t('invitation.seconds')}</span>
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
        <section id="event" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{t('invitation.event') || 'Acara'}</h2>
                <ScribbleUnderline style={{ width: '80px' }} />
                <p className="ps-section-subtitle">Save The Date</p>
            </Reveal>

            {showCountdown && (
                <Reveal variant="zoom">
                    <CountdownBlock events={events} />
                </Reveal>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
                {list.map((evt, idx) => {
                    const isAkad = evt.event_name?.toLowerCase().includes('akad');
                    return (
                        <Reveal key={evt.id || idx} className="ps-card ps-event-card" variant={idx % 2 === 0 ? 'left' : 'right'}>
                            {isAkad ? (
                                <>
                                    <ScribbleCrown style={{ top: '-12px', right: '55px', transform: 'rotate(5deg)', width: '24px', height: '24px' }} />
                                    <ScribbleStar style={{ bottom: '-8px', left: '20px', transform: 'rotate(10deg)', width: '20px', height: '20px' }} />
                                </>
                            ) : (
                                <>
                                    <ScribbleDoubleHeart style={{ top: '-12px', left: '55px', transform: 'rotate(-5deg)', width: '32px', height: '32px' }} />
                                    <ScribbleSwirl style={{ bottom: '-12px', right: '25px', transform: 'rotate(15deg)', width: '28px', height: '28px' }} />
                                </>
                            )}
                            <span className="ps-event-card__badge">{isAkad ? 'Akad' : 'Resepsi'}</span>
                            <h3 className="ps-event-card__name">{evt.event_name || (isAkad ? 'Akad Nikah' : 'Resepsi')}</h3>
                            
                            <div className="ps-event-card__meta">
                                <div className="ps-event-card__meta-item">
                                    <i className="far fa-calendar-alt" />
                                    <span className="ps-event-card__text">{formatDate(evt.event_date, locale)}</span>
                                </div>
                                <div className="ps-event-card__meta-item">
                                    <i className="far fa-clock" />
                                    <span className="ps-event-card__text">
                                        {formatTime(evt.start_time)} - {evt.end_time ? formatTime(evt.end_time) : 'Selesai'} {evt.timezone || 'WIB'}
                                    </span>
                                </div>
                                <div className="ps-event-card__meta-item">
                                    <i className="fas fa-map-marker-alt" />
                                    <div>
                                        <span className="ps-event-card__text" style={{ fontWeight: 'bold' }}>{evt.venue_name || 'Nama Tempat'}</span>
                                        <p className="ps-event-card__address">{evt.venue_address || 'Alamat Lengkap Acara'}</p>
                                    </div>
                                </div>
                            </div>

                            {evt.gmaps_link && (
                                <a
                                    href={evt.gmaps_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ps-event-card__btn"
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
                <div key={`dc-${idx}`} className="w-full max-w-md mx-auto mt-4 px-4 pb-2 relative">
                    <ScribbleFlower style={{ top: '-10px', right: '15px', transform: 'rotate(10deg)', width: '28px', height: '28px' }} />
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
        <section id="love_story" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{t('invitation.love_story') || 'Kisah Cinta'}</h2>
                <ScribbleUnderline style={{ width: '90px' }} />
                <p className="ps-section-subtitle">Our Journey</p>
            </Reveal>

            <div className="ps-story">
                {stories.map((story, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                        <div key={story.id || idx} className="ps-story__node">
                            <Reveal className="ps-story__card relative" variant={isEven ? 'left' : 'right'}>
                                {isEven ? (
                                    <>
                                        <ScribbleStar style={{ top: '-8px', right: '15px', transform: 'rotate(15deg)', width: '18px', height: '18px' }} />
                                        <ScribbleArrow style={{ bottom: '-12px', left: '20px', transform: 'rotate(-45deg)', width: '28px', height: '28px' }} />
                                    </>
                                ) : (
                                    <>
                                        <ScribbleDoubleHeart style={{ top: '-10px', right: '20px', transform: 'rotate(-10deg)', width: '28px', height: '28px' }} />
                                        <ScribbleSparkle style={{ bottom: '-6px', left: '25px', transform: 'rotate(10deg)', width: '16px', height: '16px' }} />
                                    </>
                                )}
                                {story.story_date && (
                                    <span className="ps-story__date">
                                        {new Date(String(story.story_date).substring(0, 10) + 'T12:00:00').getFullYear() || story.story_date}
                                    </span>
                                )}
                                <h3 className="ps-story__title">{story.title || 'Momen Spesial'}</h3>
                                <p className="ps-story__desc">{story.description}</p>
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
        <section id="livestream" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <ScribbleUnderline style={{ width: '100px' }} />
                <p className="ps-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
            </Reveal>
            
            <Reveal className="ps-livestream-container" variant="zoom">
                {streamsList.map((stream, idx) => (
                    <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="ps-btn-livestream">
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
        <section id="dresscode" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">Dress Code</h2>
                <ScribbleUnderline style={{ width: '80px' }} />
                <p className="ps-section-subtitle">{isEn ? 'Our Wedding Color Palette' : 'Rekomendasi Warna Pakaian'}</p>
            </Reveal>
            <Reveal className="ps-card text-center" variant="zoom">
                <p className="ps-event-card__address" style={{ marginBottom: '15px' }}>
                    {invitation?.dresscode_instruction || (isEn ? 'To align with our wedding aesthetic, guests are recommended to wear clothes within this color palette:' : 'Agar menyatu dengan keindahan dekorasi kami, para tamu disarankan mengenakan pakaian dengan palet warna berikut:')}
                </p>
                {colors.length > 0 && (
                    <div className="ps-dresscode-colors-flex">
                        {colors.map((color, idx) => (
                            <div 
                                key={idx} 
                                className="ps-dresscode-color-circle" 
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
        <section id="video" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{isEn ? 'Our Wedding Video' : 'Momen Video'}</h2>
                <ScribbleUnderline style={{ width: '90px' }} />
                <p className="ps-section-subtitle">{isEn ? 'Memories Captured' : 'Momen yang Diabadikan'}</p>
            </Reveal>
            <Reveal className="ps-card" variant="zoom" style={{ padding: '8px' }}>
                <div className="ps-video-container">
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
    const list = safeArr(galleries);

    if (list.length === 0) return null;

    return (
        <section id="gallery" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{t('invitation.gallery') || 'Galeri Foto'}</h2>
                <ScribbleUnderline style={{ width: '90px' }} />
                <p className="ps-section-subtitle">Our Moments</p>
            </Reveal>

            <Reveal className="ps-gallery-grid" variant="zoom">
                {list.map((item, idx) => (
                    <div key={item.id || idx} className={`ps-gallery-item ${idx % 2 === 0 ? 'ps-tilt-left' : 'ps-tilt-right'} relative`}>
                        {idx % 2 === 0 ? (
                            <ScribbleStar style={{ top: '-10px', left: '-5px', transform: 'rotate(-10deg)', width: '20px', height: '20px' }} />
                        ) : (
                            <ScribbledHeart style={{ bottom: '-10px', right: '-8px', transform: 'rotate(15deg)', width: '22px', height: '22px' }} />
                        )}
                        <div className="ps-polaroid-inner">
                            <img src={getStorageUrl(item.image_path || item.image_url)} alt={`Gallery ${idx + 1}`} className="ps-toned-photo" />
                        </div>
                        {item.caption && <div className="ps-polaroid__caption">{item.caption}</div>}
                    </div>
                ))}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 11: REKENING & KADO (luxury-02 style default layout)
   ========================================================================== */
function BankSection({ bankAccounts, invitation }) {
    const { t, locale } = useTranslation();
    const list = safeArr(bankAccounts);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (accNumber, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(accNumber).then(() => {
                setCopiedId(idx);
                setTimeout(() => setCopiedId(null), 2000);
            }).catch(() => {
                fallbackCopy(accNumber);
                setCopiedId(idx);
                setTimeout(() => setCopiedId(null), 2000);
            });
        } else {
            fallbackCopy(accNumber);
            setCopiedId(idx);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (list.length === 0) return null;

    const isEn = locale === 'en';

    return (
        <section id="bank" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">{t('invitation.gift_title') || 'Amplop Digital'}</h2>
                <ScribbleUnderline style={{ width: '90px' }} />
                <p className="ps-section-subtitle">{isEn ? 'Share blessings with the couple' : 'Kirim kado digital untuk mempelai'}</p>
            </Reveal>

            <Reveal variant="zoom">
                <p style={{ fontSize: '0.85rem', color: '#7a7369', marginBottom: '20px', lineHeight: 1.45 }}>
                    {invitation?.gift_instruction || (isEn ? 'Your presence and prayers are the greatest gift, but if you wish to share blessings, you can do so through the accounts below:' : 'Doa restu Anda adalah karunia terindah, namun jika ingin memberikan tanda kasih secara digital dapat melalui rekening berikut:')}
                </p>

                {list.map((acc, idx) => {
                    const isBca = String(acc.bank_name).toLowerCase().includes('bca');
                    const isDana = String(acc.bank_name).toLowerCase().includes('dana');
                    const isMandiri = String(acc.bank_name).toLowerCase().includes('mandiri');

                    const isEven = idx % 2 === 0;

                    return (
                        <div key={acc.id || idx} className={`ps-bank-card ${isEven ? 'ps-tilt-left' : 'ps-tilt-right'} relative`}>
                            {isEven ? (
                                <>
                                    <ScribbleStar style={{ top: '-10px', right: '15px', transform: 'rotate(20deg)', width: '22px', height: '22px' }} />
                                    <ScribbledHeart style={{ bottom: '-10px', left: '20px', transform: 'rotate(-15deg)', width: '28px', height: '28px' }} />
                                </>
                            ) : (
                                <>
                                    <ScribbleDoubleHeart style={{ top: '-12px', left: '30px', transform: 'rotate(-10deg)', width: '32px', height: '32px' }} />
                                    <ScribbleSparkle style={{ bottom: '-8px', right: '15px', transform: 'rotate(25deg)', width: '18px', height: '18px' }} />
                                </>
                            )}
                            <div className="ps-bank-logo-wrap">
                                {isBca && <img src={logoBca} alt="BCA" className="ps-bank-logo" />}
                                {isDana && <img src={logoDana} alt="DANA" className="ps-bank-logo" />}
                                {isMandiri && <img src={DEFAULT_ASSETS.mandiri} alt="Mandiri" className="ps-bank-logo" />}
                                {!isBca && !isDana && !isMandiri && (
                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>{acc.bank_name}</span>
                                )}
                            </div>

                            <img src={chipAtm} alt="Chip" className="ps-bank-chip" />

                            <div className="ps-bank-number-wrap">
                                <p className="ps-bank-number">{acc.account_number}</p>
                            </div>

                            <div className="ps-bank-holder-wrap">
                                <div>
                                    <p className="ps-bank-holder-label">{isEn ? 'Account Holder' : 'Atas Nama'}</p>
                                    <p className="ps-bank-holder-name">{acc.account_name}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(acc.account_number, idx)}
                                    className="ps-bank-copy-btn"
                                >
                                    <i className={copiedId === idx ? "fas fa-check" : "far fa-copy"} />
                                    {copiedId === idx ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy' : 'Salin')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 12: RSVP & WISHES (Unified Layout Form)
   ========================================================================== */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const { t, locale } = useTranslation();
    const guestName = guest?.name || '';
    const isEn = locale === 'en';

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guest?.id || null,
        attendance: 'hadir',
        number_of_guests: 1,
        sender_name: guestName,
        message: '',
    });

    const [wishesList, setWishesList] = useState(safeArr(wishes));

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Custom local submit wishes if RSVP is not active, otherwise submits both
        const routeName = enableRsvp ? 'invitation.rsvp.submit' : 'invitation.wish.submit';
        
        post(route(routeName, { slug: invitation.slug }), {
            onSuccess: () => {
                // Instantly append comments to list locally
                const newWish = {
                    id: Date.now(),
                    sender_name: data.sender_name || 'Tamu Undangan',
                    message: data.message,
                    created_at: new Date().toISOString(),
                };
                if (data.message.trim() && enableWishes) {
                    setWishesList(prev => [newWish, ...prev]);
                }
                reset('message');
            }
        });
    };

    return (
        <section id="rsvp" className="ps-section">
            <Reveal>
                <h2 className="ps-section-title">
                    {enableRsvp ? (isEn ? 'RSVP & Wishes' : 'Konfirmasi Kehadiran') : (isEn ? 'Wishes & Greetings' : 'Ucapan & Doa Restu')}
                </h2>
                <ScribbleUnderline style={{ width: '100px' }} />
                <p className="ps-section-subtitle">
                    {enableRsvp ? (isEn ? 'Let us know if you can make it' : 'Bantu kami mempersiapkan kehadiran Anda') : (isEn ? 'Leave a sweet note for us' : 'Kirim ucapan dan doa tulus Anda')}
                </p>
            </Reveal>

            <Reveal className="ps-card relative" variant="zoom">
                <ScribbledHeart style={{ top: '-10px', left: '15px', transform: 'rotate(-10deg)', width: '24px', height: '24px' }} />
                <ScribbleStar style={{ top: '8px', right: '12px', transform: 'rotate(20deg)', width: '20px', height: '20px' }} />
                <form onSubmit={handleSubmit} style={{ margin: 0 }}>
                    <div className="ps-form-group">
                        <label className="ps-form-label">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                        <input
                            type="text"
                            required
                            className="ps-input"
                            value={data.sender_name}
                            onChange={e => setData('sender_name', e.target.value)}
                            placeholder={isEn ? 'Enter your name' : 'Tulis nama lengkap Anda'}
                            disabled={!!guestName}
                        />
                    </div>

                    {enableRsvp && (
                        <>
                            <div className="ps-form-group">
                                <label className="ps-form-label">{isEn ? 'Attendance Status' : 'Konfirmasi Kehadiran'}</label>
                                <select
                                    className="ps-input"
                                    value={data.attendance}
                                    onChange={e => setData('attendance', e.target.value)}
                                >
                                    <option value="hadir">{isEn ? 'I Will Attend' : 'Saya Akan Hadir'}</option>
                                    <option value="tidak_hadir">{isEn ? 'I Cannot Attend' : 'Maaf, Saya Tidak Bisa Hadir'}</option>
                                </select>
                            </div>

                            {data.attendance === 'hadir' && (
                                <div className="ps-form-group">
                                    <label className="ps-form-label">{isEn ? 'Number of Guests' : 'Jumlah Orang'}</label>
                                    <select
                                        className="ps-input"
                                        value={data.number_of_guests}
                                        onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} {isEn ? 'Person' : 'Orang'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {enableWishes && (
                        <div className="ps-form-group">
                            <label className="ps-form-label">{isEn ? 'Wishes / Message' : 'Ucapan / Doa Restu'}</label>
                            <textarea
                                rows="3"
                                className="ps-input"
                                style={{ resize: 'none' }}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                placeholder={isEn ? 'Write your warm wishes here...' : 'Tuliskan ucapan selamat dan doa tulus Anda...'}
                                required={!enableRsvp}
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <button type="submit" disabled={processing} className="ps-btn-submit">
                            {processing ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Submit' : 'Kirim Konfirmasi')}
                        </button>
                        <ScribbleSpiralArrow style={{ bottom: '-15px', right: '15px', transform: 'rotate(110deg)', width: '36px', height: '36px' }} />
                    </div>
                </form>

                {enableWishes && wishesList.length > 0 && (
                    <div className="ps-wishes-list" style={{ marginTop: '25px' }}>
                        {wishesList.slice(0, 5).map((w, idx) => (
                            <div key={w.id || idx} className="ps-wish-item" style={{ position: 'relative' }}>
                                <ScribbleSparkle style={{ top: '6px', right: '6px', width: '12px', height: '12px', opacity: 0.6 }} />
                                <p className="ps-wish-sender">{w.sender_name}</p>
                                <p className="ps-wish-message">{w.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 13: CLOSING
   ========================================================================== */
function ClosingSection({ invitation, brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};
    const isEn = locale === 'en';

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const initials = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'G';
        const second = bride?.nickname?.charAt(0) || 'B';
        return `${first} & ${second}`;
    }, [groom, bride]);

    return (
        <section id="closing" className="ps-section" style={{ paddingBottom: '90px' }}>
            <Reveal>
                <div className="ps-footer-monogram" style={{ position: 'relative', display: 'inline-block' }}>
                    <ScribbleCrown style={{ top: '-18px', left: '50%', transform: 'translateX(-50%) rotate(-5deg)', width: '28px', height: '28px' }} />
                    {initials}
                </div>
                <h2 className="ps-section-title" style={{ fontSize: '1.4rem', color: 'var(--ps-text)', marginBottom: '15px' }}>
                    {invitation?.closing_title || 'THANK YOU'}
                </h2>
                
                <p style={{ fontFamily: 'var(--ps-font-script)', fontSize: '1.4rem', lineHeight: 1.3, marginBottom: '24px', position: 'relative' }}>
                    <ScribbleDoubleHeart style={{ top: '-15px', left: '-15px', transform: 'rotate(-15deg)', width: '28px', height: '28px' }} />
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'}
                    <ScribbleFlower style={{ bottom: '-15px', right: '-10px', transform: 'rotate(10deg)', width: '24px', height: '24px' }} />
                </p>

                <div className="ps-footer-parents">
                    {groom.father_name && groom.mother_name && (
                        <p style={{ margin: '4px 0' }}>
                            {isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Kel. Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </p>
                    )}
                    {bride.father_name && bride.mother_name && (
                        <p style={{ margin: '4px 0' }}>
                            {isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Kel. Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </p>
                    )}
                </div>

                <p className="ps-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   FLOATING BUTTONS & MODALS NAVIGATION
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

    // Auto-scroll active menu item into viewport
    useEffect(() => {
        if (!activeMenuId) return;
        const activeEl = document.querySelector(`.ps-nav-menu button[data-id="${activeMenuId}"]`);
        if (activeEl) {
            const navEl = document.querySelector('.ps-nav-menu');
            if (navEl) {
                const btnLeft = activeEl.offsetLeft;
                const btnWidth = activeEl.offsetWidth;
                const navWidth = navEl.offsetWidth;
                navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
            }
        }
    }, [activeMenuId]);

    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const activeGuest = guest || null;

    let menuPosition = invitation?.menu_position || 'bottom';
    const showMenu = menuPosition !== 'none' && isOpened;

    // Filtered menu icons for bottom bars
    const menuItems = useMemo(() => {
        const items = [];
        const validKeys = resolvedSections.map(s => s.section_key);

        resolvedSections.forEach(s => {
            const key = s.section_key;
            if (key === 'cover' || key === 'hero') return;

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
            } else if (key === 'video') {
                items.push({ id: 'video', label: 'Video', icon: 'fas fa-film' });
            } else if (key === 'rsvp') {
                const hasWishes = validKeys.includes('wishes') || enableWishes;
                items.push({ id: 'rsvp', label: hasWishes ? `RSVP & Doa` : t('nav.rsvp'), icon: 'fas fa-envelope' });
            } else if (key === 'wishes') {
                const hasRsvp = validKeys.includes('rsvp') || enableRsvp;
                if (!hasRsvp) {
                    items.push({ id: 'wishes', label: 'Ucapan', icon: 'fas fa-envelope' });
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
                <div className={`ps-nav-menu ${isBottomMenu ? 'ps-nav-menu--bottom' : 'ps-nav-menu--top'}`} style={{ scrollBehavior: 'smooth' }}>
                    <div className="ps-nav-menu__inner--row">
                        {menuItems.map((item) => {
                            const isActive = activeMenuId === item.id;
                            return (
                                <button
                                    key={item.id}
                                    data-id={item.id}
                                    type="button"
                                    onClick={() => { setAutoScrollEnabled(false); scrollToSection(item.id); }}
                                    className={`ps-nav-menu__item ${isActive ? 'active' : ''}`}
                                    title={item.label}
                                >
                                    <i className={item.icon} />
                                    <span className="ps-nav-item-text">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Floating Music and QR buttons on the bottom right */}
            <div className={`ps-floating-btns ${isBottomMenu ? 'ps-floating-btns--raised' : ''}`}>
                {enableQr && activeGuest && (
                    <button
                        type="button"
                        className="ps-floating-btn"
                        onClick={() => setShowQr(true)}
                        title="QR Code Check-in"
                    >
                        <i className="fas fa-qrcode" />
                    </button>
                )}

                <button
                    type="button"
                    className={`ps-floating-btn ${isFullscreen ? 'ps-floating-btn--active' : ''}`}
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                </button>

                {parseBool(invitation?.enable_auto_scroll, true) && (
                    <button
                        type="button"
                        className={`ps-floating-btn ${autoScrollEnabled ? 'ps-floating-btn--active' : ''}`}
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                    </button>
                )}
                
                <button
                    type="button"
                    className="ps-floating-btn"
                    onClick={onToggleMusic}
                    title="Musik Latar"
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
            </div>

            {/* QR Code Modal Overlay */}
            {enableQr && showQr && activeGuest && (
                <div className="ps-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="ps-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="ps-qr-title">QR Code Check-in</h3>
                        <p className="ps-qr-guest">{activeGuest.name}</p>
                        <div className="ps-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=b85c4c&data=${encodeURIComponent(
                                    window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug
                                )}`}
                                alt="QR Code"
                                className="ps-qr-img"
                            />
                        </div>
                        <p className="ps-qr-hint">Tunjukkan QR Code ini kepada penerima tamu di lokasi acara</p>
                        <button
                            type="button"
                            className="ps-qr-close"
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

/* ==========================================================================
   MAIN DYNAMIC INDEX
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

    // Boolean configurations
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

    // Set Document Title
    useEffect(() => {
        const groom = safeArr(brideGrooms).find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()));
        const bride = safeArr(brideGrooms).find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase()));
        if (groom?.nickname && bride?.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, brideGrooms]);

    // Handle Open invitation
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

    // Toggle background music
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

    // Resolve cover slideshow photos
    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    // Resolve dynamic whitelisted sections
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'video', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

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
                
                // Skip standalone countdown (integrated in event)
                if (s.section_key === 'countdown') return;

                // Skip wishes if RSVP is active (merged)
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return;
                }

                if (s.section_key === 'livestream' && !hasStream) return;

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
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes, showPhotos, invitation?.video_url]);

    // Slide mode: Sync activeSectionId with activeSlideIdx
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            setActiveSectionId(key);
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

    // Scroll mode: Scrollspy implementation
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

    // Auto scroll driver
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

    // Pause auto-scroll on manual touch/mouse activity
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.ps-floating-btn') || 
                e.target.closest('.ps-nav-menu') || 
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

    // Swipe controls navigation
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

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

    // Touch & swipe gestures handlers (parallel DOM transitions)
    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: false, atBottom: false });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        let atTop = false;
        let atBottom = false;

        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.ps-slide-container');
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
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.ps-slide-container') : null;
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

        const target = e.target.closest('.ps-slide-container');
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

    // Section Component switch renderers
    const renderSectionComponent = (section, idx) => {
        const key = section.section_key;

        const componentMap = {
            'opening': <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} events={events} showCountdown={showCountdownInEvent} galleries={galleries} showPhotos={showPhotos} />,
            'bride_groom': <BrideGroomSection key={key} brideGrooms={brideGrooms} showPhotos={showPhotos} />,
            'countdown': null, // Embedded in Event section
            'event': <EventSection key={key} events={events} invitation={invitation} showCountdown={showCountdownInEvent} />,
            'livestream': <LiveStreamingSection key={key} events={events} invitation={invitation} />,
            'love_story': <LoveStorySection key={key} loveStories={loveStories} />,
            'gallery': <GallerySection key={key} galleries={galleries} />,
            'video': <VideoSection key={key} invitation={invitation} />,
            'bank': <BankSection key={key} bankAccounts={bankAccounts} invitation={invitation} />,
            'rsvp': <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} />,
            'wishes': enableRsvp ? null : <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={true} />,
            'closing': <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} />,
        };

        const comp = componentMap[key];
        if (!comp) return null;

        if (isSlideMode) {
            let slideClass = 'ps-slide-container';
            if (idx === activeSlideIdx) slideClass += ' is-active';
            else if (idx > activeSlideIdx) slideClass += ' is-next';
            else slideClass += ' is-prev';

            return (
                <div key={key} className={slideClass}>
                    <div style={{ position: 'relative' }}>
                        {idx !== 0 && <TornPaperEdge />}
                        {comp}
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment key={key}>
                {idx !== 0 && <TornPaperEdge />}
                {comp}
            </React.Fragment>
        );
    };

    const waNumber = safeArr(brideGrooms).find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()))?.phone || '';
    const isBottomMenu = (invitation?.menu_position || 'bottom') === 'bottom';

    return (
        <ErrorBoundary>
            <div className={`ps-page ${!showAnimations ? 'ps-no-animations' : ''}`}>
                <div className="ps-container">
                    {/* Binder ring decorations on the left margin */}
                    <BinderRings />
                    
                    {invitation?.particle_type && invitation.particle_type !== 'none' && isOpened && (
                        <ParticleEffect
                            type={invitation.particle_type}
                            count={invitation.particle_count || 30}
                            speed={invitation.particle_speed || 'normal'}
                        />
                    )}

                    {/* Background Audio Backsound */}
                    {invitation?.music_url && (
                        <audio ref={audioRef} loop preload="auto" playsInline>
                            <source src={getStorageUrl(invitation.music_url, '')} type="audio/mpeg" />
                        </audio>
                    )}

                    {/* Cover overlay screen */}
                    <CoverSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        guest={guest}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        coverImages={coverImages}
                        showPhotos={showPhotos}
                    />

                    {/* Main Scroller Content */}
                    <div
                        className={`ps-main ${isSlideMode ? 'ps-main--slide' : ''} ${layoutMode === 'slide-h' ? 'ps-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'ps-main--slide-v' : ''}`}
                        onTouchStart={isSlideMode ? handleTouchStart : undefined}
                        onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                        onMouseDown={isSlideMode ? handleMouseDown : undefined}
                        onMouseUp={isSlideMode ? handleMouseUp : undefined}
                        onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                        onWheel={isSlideMode ? handleWheel : undefined}
                    >
                        {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                    </div>

                    {/* WhatsApp Float contact */}
                    {waNumber && isOpened && (
                        <div className={`ps-whatsapp-float ${isBottomMenu ? 'ps-whatsapp-float--raised' : ''}`}>
                            <a
                                href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ps-whatsapp-btn"
                                title="Contact Groom via WhatsApp"
                            >
                                <i className="fab fa-whatsapp" />
                            </a>
                        </div>
                    )}

                    {/* Navigation bar and panels */}
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
            </div>
        </ErrorBoundary>
    );
}
