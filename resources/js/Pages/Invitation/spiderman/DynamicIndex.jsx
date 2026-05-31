import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { useForm } from '@inertiajs/react';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import './style.css';

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

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

function formatDate(d, locale = 'id') {
    if (!d) return '';
    try {
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return d;
        return dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return d;
    }
}

function formatStoryDate(dateStr, locale = 'id') {
    if (!dateStr) return '';
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    if (datePattern.test(dateStr)) {
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        } catch (e) {}
    }
    return dateStr;
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

/* ═══════════════════════════════════════
   THEME LABELS HELPER
   ═══════════════════════════════════════ */
function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'birthday';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let mainName = '';
    let initials = '';
    let isSingleHost = true;
    
    if (['wedding', 'anniversary'].includes(t)) {
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
        mainName = groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Bride & Groom';
        initials = `${groom.nickname?.charAt(0) || 'B'}${bride.nickname?.charAt(0) || 'R'}`;
        isSingleHost = false;
    } else {
        mainName = host.nickname || host.full_name || 'Host';
        initials = mainName.charAt(0) || 'H';
        isSingleHost = true;
    }

    let labels = {
        coverHeader: isEn ? 'AWESOME CELEBRATION' : 'PERAYAAN LUAR BIASA',
        coverSubtitle: invitation?.cover_subtitle || (isEn ? "Awesome Birthday Party" : "Pesta Ulang Tahun"),
        profileHeader: isEn ? 'THE CELEBRANT' : 'YANG MERAYAKAN',
        kidOrderFallback: isEn ? 'BIRTHDAY BOY/GIRL' : 'ANAK TERCINTA',
        storyBadge: isEn ? 'MILESTONES' : 'TUMBUH KEMBANG',
        storyHeader: isEn ? 'AWESOME JOURNEY' : 'PERJALANAN USIA',
        eventBadge: isEn ? 'ACTION SCHEDULE' : 'JADWAL AKSI',
        eventHeader: isEn ? 'JOIN THE ADVENTURE' : 'LOKASI MARKAS SPIDEY',
        giftBadge: isEn ? 'GIFT BOX' : 'KADO DIGITAL',
        giftHeader: isEn ? 'DIGITAL GIFT' : 'KIRIM HADIAH',
        closingTitle: isEn ? 'AWESOME ENDINGS!' : 'TERIMA KASIH!',
        closingText: isEn ? "Thank you for swinging by and sharing this awesome milestone with us!" : "Merupakan kehormatan manis bagi kami apabila kalian berkenan hadir. Terima kasih!"
    };

    if (t === 'wedding') {
        labels.coverHeader = isEn ? 'THE WEDDING OF' : 'PERNIKAHAN DARI';
        labels.profileHeader = isEn ? 'THE POWER COUPLE' : 'KEDUA MEMPELAI';
        labels.storyBadge = isEn ? 'LOVE STORY' : 'KISAH CINTA';
        labels.storyHeader = isEn ? 'OUR HEROIC LOVE JOURNEY' : 'PERJALANAN CINTA';
        labels.eventBadge = isEn ? 'WEDDING DETAILS' : 'JADWAL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI PERNIKAHAN';
        labels.giftBadge = isEn ? 'DIGITAL ENVELOPE' : 'DOMPET DIGITAL';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'HAPPY ENDINGS!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for sharing this heroic day with us!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    } else if (t === 'anniversary') {
        labels.coverHeader = isEn ? 'THE ANNIVERSARY OF' : 'ANNIVERSARY DARI';
        labels.profileHeader = isEn ? 'THE HAPPY COUPLE' : 'PASANGAN BERBAHAGIA';
        labels.storyBadge = isEn ? 'JOURNEY' : 'KISAH PERJALANAN';
        labels.storyHeader = isEn ? 'OUR YEARS OF ADVENTURE' : 'PERJALANAN KASIH';
        labels.eventBadge = isEn ? 'CELEBRATION DETAILS' : 'JADWAL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI ACARA';
        labels.giftBadge = isEn ? 'DIGITAL GIFT' : 'KADO DIGITAL';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'HAPPY ENDINGS!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for sharing this anniversary adventure with us!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    } else if (t === 'graduation') {
        labels.coverHeader = isEn ? 'THE GRADUATION OF' : 'WISUDA DARI';
        labels.profileHeader = isEn ? 'THE GRADUATE' : 'WISUDAWAN/WATI';
        labels.storyBadge = isEn ? 'ACADEMIC PATH' : 'PERJALANAN STUDI';
        labels.storyHeader = isEn ? 'MY HEROIC JOURNEY' : 'PERJALANAN STUDI';
        labels.eventBadge = isEn ? 'WISUDA DETAILS' : 'JADWAL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI SYUKURAN';
        labels.giftBadge = isEn ? 'GRADUATION GIFT' : 'HADIAH KELULUSAN';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'THANK YOU!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for supporting my academic journey!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    }

    return {
        mainName,
        initials,
        isSingleHost,
        labels
    };
}

// Global flags to sync states across components
let globalShowPhotos = true;
let globalShowAnimations = true;


/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="theme-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema Spiderman.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);
    
    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVisible(true);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div 
            ref={ref} 
            className={`${className} ${!globalShowAnimations ? '' : (visible ? 'spy-reveal--in' : 'spy-reveal--out')}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   SPIDER-MAN CORNER WEBS (SVG)
   ═══════════════════════════════════════ */
function CornerWeb({ className = '' }) {
    return (
        <svg className={`spy-corner-web ${className}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L80 80 M0 0 L90 50 M0 0 L50 90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <path d="M20 0 A 20 20 0 0 1 0 20" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M40 0 A 40 40 0 0 1 0 40" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M60 0 A 60 60 0 0 1 0 60" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M80 0 A 80 80 0 0 1 0 80" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   SPIDER-MAN VECTOR MASK (SVG)
   ═══════════════════════════════════════ */
function SpideyMask({ className = '', size = 100, style = {} }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 120" className={className} style={{ filter: 'drop-shadow(2px 3px 0px #000)', ...style }} xmlns="http://www.w3.org/2000/svg">
            {/* Red Mask Shape */}
            <path d="M50 10 C 20 10, 10 35, 10 70 C 10 100, 35 115, 50 115 C 65 115, 90 100, 90 70 C 90 35, 80 10, 50 10 Z" fill="var(--spidey-red)" stroke="#000000" strokeWidth="3.5" />
            
            {/* Web lines vertical */}
            <path d="M50 10 L50 115" stroke="#000000" strokeWidth="1.8" />
            
            {/* Web lines curved horizontal */}
            <path d="M10 70 C 25 70, 35 60, 50 55 C 65 60, 75 70, 90 70" fill="none" stroke="#000000" strokeWidth="1.8" />
            <path d="M15 45 C 30 50, 40 45, 50 40 C 60 45, 70 50, 85 45" fill="none" stroke="#000000" strokeWidth="1.8" />
            <path d="M22 25 C 32 32, 42 30, 50 25 C 58 30, 68 32, 78 25" fill="none" stroke="#000000" strokeWidth="1.8" />
            <path d="M15 90 C 30 85, 40 90, 50 95 C 60 90, 70 85, 85 90" fill="none" stroke="#000000" strokeWidth="1.8" />
            
            {/* Web lines diagonal rays */}
            <path d="M50 65 L10 40" stroke="#000000" strokeWidth="1.8" />
            <path d="M50 65 L90 40" stroke="#000000" strokeWidth="1.8" />
            <path d="M50 65 L20 100" stroke="#000000" strokeWidth="1.8" />
            <path d="M50 65 L80 100" stroke="#000000" strokeWidth="1.8" />

            {/* Concentric webs */}
            <path d="M50 45 Q40 50 35 60 Q40 68 50 72 Q60 68 65 60 Q60 50 50 45 Z" fill="none" stroke="#000000" strokeWidth="1.8" />
            <path d="M50 25 Q30 35 20 55 Q30 82 50 90 Q70 82 80 55 Q70 35 50 25 Z" fill="none" stroke="#000000" strokeWidth="1.8" />
            
            {/* White Eyes with bold outlines */}
            <path d="M18 55 C 20 40, 42 45, 46 65 C 46 72, 38 78, 22 75 C 16 74, 17 65, 18 55 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
            <path d="M82 55 C 80 40, 58 45, 54 65 C 54 72, 62 78, 78 75 C 84 74, 83 65, 82 55 Z" fill="#FFFFFF" stroke="#000000" strokeWidth="5" strokeLinejoin="round" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   SPIDER-MAN AMBIENT WEB BACKDROP (SVG)
   ═══════════════════════════════════════ */
function SpideyWebBackground() {
    return (
        <div className="spy-web-bg-overlay">
            <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" stroke="var(--spidey-accent)" strokeWidth="0.8" opacity="0.15" xmlns="http://www.w3.org/2000/svg">
                {/* Web Rays */}
                <line x1="250" y1="250" x2="250" y2="0" />
                <line x1="250" y1="250" x2="250" y2="500" />
                <line x1="250" y1="250" x2="0" y2="250" />
                <line x1="250" y1="250" x2="500" y2="250" />
                <line x1="250" y1="250" x2="0" y2="0" />
                <line x1="250" y1="250" x2="500" y2="500" />
                <line x1="250" y1="250" x2="500" y2="0" />
                <line x1="250" y1="250" x2="0" y2="500" />
                
                {/* Curved Web Rings */}
                <path d="M250,210 Q220,220 210,250 Q220,280 250,290 Q280,280 290,250 Q280,220 250,210 Z" fill="none" />
                <path d="M250,170 Q200,180 170,250 Q200,320 250,330 Q300,320 330,250 Q300,180 250,170 Z" fill="none" />
                <path d="M250,120 Q170,130 120,250 Q170,370 250,380 Q330,370 380,250 Q330,130 250,120 Z" fill="none" />
                <path d="M250,70 Q130,85 70,250 Q130,415 250,430 Q370,415 430,250 Q370,85 250,70 Z" fill="none" />
                <path d="M250,20 Q90,40 20,250 Q90,460 250,480 Q410,460 480,250 Q410,40 250,20 Z" fill="none" />
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   SPIDER-MAN SWINGING SPIDER
   ═══════════════════════════════════════ */
function SpideySwingingSpider() {
    return (
        <div className="spy-swinging-spider-global">
            <div className="spy-thread" />
            <svg width="32" height="32" viewBox="0 0 100 100" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                {/* Spider Body */}
                <circle cx="50" cy="45" r="12" />
                <circle cx="50" cy="65" r="18" />
                {/* Spider Eyes (Glowing Red!) */}
                <circle cx="45" cy="73" r="2.5" fill="#E60012" />
                <circle cx="55" cy="73" r="2.5" fill="#E60012" />
                {/* Left Legs */}
                <path d="M40 45 C 20 40, 15 20, 10 30" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-1" />
                <path d="M38 52 C 15 50, 10 35, 5 50" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-2" />
                <path d="M38 60 C 15 65, 10 55, 8 70" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-3" />
                <path d="M42 68 C 20 80, 15 75, 15 90" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-4" />
                {/* Right Legs */}
                <path d="M60 45 C 80 40, 85 20, 90 30" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-1" />
                <path d="M62 52 C 85 50, 90 35, 95 50" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-2" />
                <path d="M62 60 C 85 65, 90 55, 92 70" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-3" />
                <path d="M58 68 C 80 80, 85 75, 85 90" stroke="#000000" strokeWidth="4.5" fill="none" strokeLinecap="round" className="spy-leg-4" />
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   SPIDER-MAN SECTION DIVIDER
   ═══════════════════════════════════════ */
function SpideySectionDivider() {
    return (
        <div className="spy-section-divider">
            <div className="spy-divider-line" />
            <div className="spy-divider-web-center">
                <svg width="60" height="30" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0 L50 40 L100 0" stroke="var(--spidey-accent)" strokeWidth="1.5" opacity="0.6" fill="none" />
                    <path d="M20 0 Q50 30 80 0" stroke="var(--spidey-accent)" strokeWidth="1.2" fill="none" opacity="0.6" />
                    <path d="M35 0 Q50 20 65 0" stroke="var(--spidey-accent)" strokeWidth="1" fill="none" opacity="0.6" />
                    <circle cx="50" cy="35" r="8" fill="var(--spidey-red)" stroke="#000000" strokeWidth="1.5" />
                    <path d="M47 33 C46 32, 49 35, 49 35" fill="none" stroke="#000" strokeWidth="0.8" />
                    <path d="M53 33 C54 32, 51 35, 51 35" fill="none" stroke="#000" strokeWidth="0.8" />
                </svg>
            </div>
            <div className="spy-divider-line" />
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (Animated Comic Cover)
   ═══════════════════════════════════════ */function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, locale }) {
    const { t } = useTranslation();
    const activeGuest = guest || null;
    const guestName = activeGuest?.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);
    
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { mainName, initials, isSingleHost, labels } = themeConfig;
    
    const coverTitle = invitation?.cover_title || mainName || "Peter Parker";
    const coverSubtitle = invitation?.cover_subtitle || labels.coverSubtitle;
    const host = bgs[0] || {};

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className={`spy-cover ${isOpened ? 'is-opened' : ''}`}>
            {globalShowPhotos && coverImages.length > 0 && (
                <PremiumSlideshow
                    images={coverImages}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="spy-cover__bg"
                />
            )}
            <div className="spy-cover__overlay" />
            <CornerWeb className="spy-corner-web--top-left" />
            <CornerWeb className="spy-corner-web--top-right" />
            <SpideyWebBackground />
            
            <div className="spy-cover__content">
                {/* Web swing line with swinging mask */}
                <div className="spy-swinging-spidey">
                    <div className="spy-swinging-body">
                        <SpideyMask size={45} />
                    </div>
                </div>
                
                {/* Comic Strip Header */}
                <div className="spy-comic-header-strip">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SpideyMask size={24} />
                        <span className="spy-comic-badge" style={{ verticalAlign: 'middle' }}>SPECIAL ISSUE</span>
                    </div>
                    <span className="spy-comic-issue">NO. {String(invitation?.id || 1).padStart(3, '0')}</span>
                </div>
                
                {/* Spidey Emblem */}
                <div className="spy-cover-emblem-wrap">
                    <div className="spy-avatar-web-frame" />
                    {host.photo && globalShowPhotos ? (
                        <img src={getStorageUrl(host.photo)} alt={host.nickname} className="spy-cover-emblem" />
                    ) : (
                        <div className="spy-cover-emblem spy-avatar-fallback">
                            {initials}
                        </div>
                    )}
                </div>

                {/* Comic invitation Box */}
                <div className="spy-comic-box">
                    <h1 className="spy-comic-title">{coverTitle.toUpperCase()}</h1>
                    <p className="spy-comic-subtitle">{coverSubtitle.toUpperCase()}</p>
                    
                    {guestName && (
                        <div className="spy-cover-guest-box">
                            <p className="spy-guest-label">{t('invitation.dear_guest')}</p>
                            <h3 className="spy-guest-name">{guestName}</h3>
                            <p className="spy-guest-desc">{t('invitation.dear_guest_desc')}</p>
                        </div>
                    )}
                </div>

                <button type="button" id="tombol-buka" onClick={onOpen} className="spy-btn-open">
                    <i className="fas fa-envelope-open" /> OPEN INVITATION
                </button>
            </div>
        </div>
    );
}
/* ═══════════════════════════════════════
   OPENING SECTION (Welcome Comic)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, id, locale }) {
    const { t } = useTranslation();
    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    return (
        <section id={id || "opening"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal className="spy-comic-panel">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <SpideyMask size={50} />
                    </div>
                    <h2 className="spy-section-title">{invitation?.opening_title || (locale === 'en' ? 'Welcome!' : 'Selamat Datang!')}</h2>
                    
                    {globalShowPhotos && openingImages.length > 0 && (
                        <div className="opening-slideshow-wrapper spy-video-container" style={{ margin: '0 auto 20px auto' }}>
                            <PremiumSlideshow
                                images={openingImages}
                                positionX={invitation?.opening_position_x}
                                positionY={invitation?.opening_position_y}
                                zoom={invitation?.opening_zoom}
                            />
                        </div>
                    )}

                    {invitation?.opening_ayat && (
                        <div className="spy-comic-panel" style={{ backgroundColor: 'var(--spidey-dark-blue)', marginBottom: '20px' }}>
                            <p className="spy-quote-text">
                                &ldquo;{invitation.opening_ayat}&rdquo;
                            </p>
                            {invitation?.opening_ayat_source && (
                                <p className="spy-quote-text" style={{ fontSize: '0.85rem', marginTop: '10px', color: 'var(--spidey-accent)', textAlign: 'right' }}>
                                    &mdash; {invitation.opening_ayat_source}
                                </p>
                            )}
                            <div className="spy-speech-pointer-shadow" />
                            <div className="spy-speech-pointer" style={{ borderColor: 'var(--spidey-dark-blue) transparent transparent transparent' }} />
                        </div>
                    )}

                    <p className="spy-subtitle" style={{ color: '#fff', fontSize: '1rem', marginBottom: '0' }}>
                        {invitation?.opening_text || (locale === 'en' 
                            ? "We are very excited to invite you to celebrate our child's birthday!"
                            : "Kami sangat gembira mengundang Anda untuk merayakan hari ulang tahun anak kami tercinta!")}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CELEBRANT SECTION (Birthday Kid)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, id, locale, invitation }) {
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
    
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { isSingleHost, labels } = themeConfig;

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
        const isWanita = ['wanita', 'female'].includes(String(gender).toLowerCase());
        
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

    // Blow candle state
    const [candleBlown, setCandleBlown] = useState(false);
    const [cakeConfetti, setCakeConfetti] = useState(false);

    const blowCandle = () => {
        if(candleBlown) return;
        setCandleBlown(true);
        setCakeConfetti(true);
        setTimeout(() => setCakeConfetti(false), 5000);
    };

    function Card({ person, side }) {
        if (!person) return null;
        const persInitials = (person.nickname || person.full_name || 'R')
            .substring(0, 2)
            .toUpperCase();
        
        return (
            <Reveal className="spy-comic-panel spy-profile-card flex-1 w-full max-w-[280px]">
                <div className="spy-avatar-wrapper">
                    <div className="spy-avatar-web-frame" />
                    {globalShowPhotos && person.photo ? (
                        <img src={getStorageUrl(person.photo)} alt={person.full_name} className="class-foto-profil" />
                    ) : (
                        <div className="spy-avatar-fallback">{persInitials}</div>
                    )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <SpideyMask size={35} />
                    <h2 className="spy-kids-name" style={{ margin: 0 }}>{person.full_name}</h2>
                </div>
                
                <p className="spy-kids-order" style={{ marginTop: '5px' }}>
                    {translateChildOrder(person.child_order, person.gender) || (locale === 'en' ? labels.kidOrderFallback : 'PUTRA/PUTRI TERCINTA')}
                </p>
                
                {person.bio && (
                    <p className="spy-kids-bio">{person.bio}</p>
                )}

                {person.instagram && (
                    <a 
                        href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="spy-btn-social"
                        style={{ display: 'inline-flex', marginBottom: '16px' }}
                    >
                        <i className="fab fa-instagram" /> @{person.instagram.replace('@', '')}
                    </a>
                )}

                {(person.father_name || person.mother_name) && (
                    <div className="spy-parents-box">
                        <p className="spy-parents-label">{locale === 'en' ? 'BELOVED CHILD OF' : 'PUTRA/PUTRI TERCINTA DARI'}</p>
                        <p className="spy-parents-names">
                            {[person.father_name, person.mother_name].filter(Boolean).join(' & ')}
                        </p>
                    </div>
                )}
            </Reveal>
        );
    }

    return (
        <section id={id || "bride_groom"} className="spy-scroll-section">
            <div className="spy-container-inner text-center">
                <Reveal>
                    <span className="spy-title-badge mb-6">{labels.profileHeader}</span>
                </Reveal>
                
                <div className="spy-couples-flex" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
                    <Card person={groom} side={isSingleHost ? 'center' : 'left'} />
                    {!isSingleHost && <div className="spy-ampersand-divider" style={{ fontSize: '2.5rem', color: 'var(--spidey-red)', fontWeight: 'bold', fontFamily: 'Impact, sans-serif', textShadow: '2px 2px 0px #000, -2px -2px 0px #000' }}>&</div>}
                    {!isSingleHost && <Card person={bride} side="right" />}
                </div>

                {/* Interactive Blow Candle Widget for Spiderman theme (only in single host birthday/syukuran) */}
                {isSingleHost && (
                    <Reveal className="spy-comic-panel candy-cake-box mt-6 relative overflow-hidden" style={{ width: '100%', maxWidth: '380px', margin: '24px auto 0 auto' }}>
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-4" style={{ color: 'var(--spidey-accent)', fontFamily: 'Impact, sans-serif' }}>
                            {candleBlown ? "🍰 HAPPY BIRTHDAY! 🍰" : "👉 TIUP LILINNYA! (KLIK API)"}
                        </span>
                        
                        <div className="relative inline-block my-2" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div 
                                className={`candy-flame ${candleBlown ? 'is-blown' : ''}`}
                                onClick={blowCandle} 
                                style={{ cursor: 'pointer' }}
                            />
                            <div className="candy-candle" />
                            <div className="candy-cake-top" />
                            <div className="candy-cake-cream" />
                            <div className="candy-cake-bottom" />
                        </div>
                        
                        {candleBlown && (
                            <p className="text-[12px] italic text-emerald-400 mt-2 font-bold animate-bounce" style={{ color: '#4ade80' }}>
                                Yaaay! Lilin berhasil ditiup! Semoga semua harapan menjadi kenyataan! ✨
                            </p>
                        )}
                        
                        {cakeConfetti && (
                            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-3xl" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                                {[...Array(20)].map((_, i) => {
                                    const delay = Math.random() * 2000;
                                    const left = Math.random() * 90;
                                    const color = ['#FF4B72', '#00D2FC', '#FFC107', '#9C27B0'][i % 4];
                                    return (
                                        <div 
                                            key={i} 
                                            className="candy-confetti" 
                                            style={{ 
                                                left: `${left}%`, 
                                                backgroundColor: color, 
                                                animationDelay: `${delay}ms`,
                                                position: 'absolute',
                                                top: '-10px',
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                animation: 'candy-fall 3s linear infinite'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </Reveal>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    
    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const target = new Date(`${ds}T10:00:00`); // Birthday standard start time
        if (isNaN(target.getTime())) return;
  
        const update = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (diff <= 0) {
                setCd({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setCd({ d, h, m, s });
        };
        
        update();
        const intId = setInterval(update, 1000);
        return () => clearInterval(intId);
    }, [targetDate]);

    return (
        <div className="spy-countdown-grid">
            <div className="spy-countdown-box">
                <span className="spy-countdown-num">{cd.d}</span>
                <span className="spy-countdown-label">{t('invitation.days') || 'DAYS'}</span>
            </div>
            <div className="spy-countdown-box">
                <span className="spy-countdown-num">{cd.h}</span>
                <span className="spy-countdown-label">{t('invitation.hours') || 'HRS'}</span>
            </div>
            <div className="spy-countdown-box">
                <span className="spy-countdown-num">{cd.m}</span>
                <span className="spy-countdown-label">{t('invitation.minutes') || 'MINS'}</span>
            </div>
            <div className="spy-countdown-box">
                <span className="spy-countdown-num">{cd.s}</span>
                <span className="spy-countdown-label">{t('invitation.seconds') || 'SECS'}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MILESTONES / PERJALANAN USIA SECTION (Love Story)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, id, locale }) {
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);
    if (stories.length === 0) return null;

    const comicBams = ["BAM!", "POW!", "BOOM!", "ZAP!", "SLAM!", "BOING!"];

    return (
        <section id={id || "love_story"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal>
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">{locale === 'en' ? 'MILESTONES' : 'TUMBUH KEMBANG'}</span>
                        {locale === 'en' ? 'OUR ADVENTURE' : 'PERJALANAN USIA'}
                    </h2>
                </Reveal>

                <div className="spy-timeline">
                    {stories.map((story, idx) => {
                        const bam = comicBams[idx % comicBams.length];
                        return (
                            <div key={story.id || idx} className="spy-reveal--in spy-timeline-item">
                                <div className="spy-timeline-dot">
                                    <SpideyMask size={22} />
                                </div>
                                
                                <div className="spy-timeline-pop-tag">
                                    {bam}
                                </div>
                                
                                <Reveal delay={idx * 100} className="spy-timeline-bubble">
                                    <div className="spy-timeline-date">
                                        {formatStoryDate(story.story_date, locale)}
                                    </div>
                                    <h3 className="spy-timeline-title">{story.title}</h3>
                                    {story.description && (
                                        <p className="spy-timeline-desc">{story.description}</p>
                                    )}
                                </Reveal>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT / ACARA SECTION (Birthday Party)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, id, locale }) {
    const { t } = useTranslation();
    const eventList = safeArr(events).sort((a, b) => a.sort_order - b.sort_order);
    if (eventList.length === 0) return null;

    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
    const showCountdown = parseBool(invitation?.show_countdown);
    const showCountdownInEvent = useMemo(() => {
        if (!primaryEvent?.event_date || !showCountdown) return false;
        return true;
    }, [events, showCountdown]);

    return (
        <section id={id || "event"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal>
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">{locale === 'en' ? 'PARTY DEETS' : 'DETAIL ACARA'}</span>
                        {locale === 'en' ? 'JOIN THE BASH' : 'PANDUAN LOKASI'}
                    </h2>
                </Reveal>

                {showCountdownInEvent && (
                    <Reveal className="spy-comic-panel" style={{ padding: '16px 20px', marginBottom: '25px', textAlign: 'center' }}>
                        <h4 className="spy-kids-order" style={{ marginBottom: '8px' }}>COUNTDOWN TICKING!</h4>
                        <CountdownTimer targetDate={primaryEvent.event_date} />
                    </Reveal>
                )}

                <div className="spy-events-stack">
                    {eventList.map((evt, idx) => {
                        return (
                            <Reveal key={evt.id || idx} delay={idx * 150} className="spy-comic-panel spy-event-card">
                                <span className="spy-event-badge">
                                    {evt.event_name ? evt.event_name.toUpperCase() : (locale === 'en' ? 'BIRTHDAY PARTY' : 'PESTA ULANG TAHUN')}
                                </span>
                                
                                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
                                    <i className="fas fa-calendar-day" style={{ color: 'var(--spidey-accent)', marginRight: '8px' }} />
                                    {formatDate(evt.event_date, locale)}
                                </div>
                                
                                <div className="spy-event-time-row">
                                    <div className="spy-event-time-item">
                                        <span className="spy-event-time-val">{formatTime(evt.start_time)}</span>
                                        <span className="spy-event-time-lbl">{locale === 'en' ? 'START' : 'MULAI'}</span>
                                    </div>
                                    <div className="spy-event-time-item">
                                        <span className="spy-event-time-val">
                                            {evt.end_time ? (evt.end_time.toLowerCase().includes('selesai') ? (locale === 'en' ? 'END' : 'SELESAI') : formatTime(evt.end_time)) : (locale === 'en' ? 'END' : 'SELESAI')}
                                        </span>
                                        <span className="spy-event-time-lbl">{locale === 'en' ? 'FINISH' : 'SELESAI'}</span>
                                    </div>
                                    <div className="spy-event-time-item">
                                        <span className="spy-event-time-val">{evt.timezone || 'WIB'}</span>
                                        <span className="spy-event-time-lbl">{locale === 'en' ? 'ZONE' : 'ZONA'}</span>
                                    </div>
                                </div>

                                <div className="spy-event-venue">
                                    <i className="fas fa-map-marker-alt" style={{ color: 'var(--spidey-red)', marginRight: '6px' }} />
                                    {evt.venue_name}
                                </div>
                                
                                {evt.venue_address && (
                                    <p className="spy-event-address">{evt.venue_address}</p>
                                )}

                                {evt.gmaps_link && (
                                    <a 
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="spy-btn-action"
                                    >
                                        <i className="fas fa-directions" /> OPEN IN GOOGLE MAPS
                                    </a>
                                )}
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, id, locale }) {
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

    return (
        <section id={id || "livestream"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal className="spy-comic-panel" style={{ textAlign: 'center' }}>
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">VIRTUAL ACCESS</span>
                        {locale === 'en' ? 'LIVE STREAM' : 'SIARAN LANGSUNG'}
                    </h2>
                    <p className="spy-subtitle">
                        {locale === 'en' ? 'Celebrate with us virtually from anywhere!' : 'Saksikan kemeriahan pesta secara online dari manapun!'}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                        {streamsList.map((stream, idx) => (
                            <button 
                                key={idx} 
                                type="button" 
                                onClick={() => window.open(stream.url, '_blank')} 
                                className="spy-btn-action"
                                style={{ width: '100%', maxWidth: '300px', justifyContent: 'center' }}
                            >
                                <i className="fas fa-video" /> WATCH ON {stream.platform.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   VIDEO GALLERY SECTION
   ═══════════════════════════════════════ */
function VideoGallerySection({ invitation, id, locale }) {
    const hasVideos = invitation?.video_url;
    if (!hasVideos) return null;

    const parseYoutubeId = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : '';
    };

    const ytId = parseYoutubeId(invitation.video_url);
    const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : invitation.video_url;

    return (
        <section id={id || "video"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal className="spy-comic-panel">
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">{locale === 'en' ? 'CLIP SHOT' : 'POTONGAN VIDEO'}</span>
                        {locale === 'en' ? 'TRAILER VIDEO' : 'VIDEO PERAYAAN'}
                    </h2>
                    
                    <div className="spy-video-container">
                        <iframe
                            src={embedUrl}
                            title="Invitation Video Player"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   ADVENTURE PHOTO GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries, id, locale, onSelectImage }) {
    const list = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);
    if (list.length === 0) return null;

    return (
        <section id={id || "gallery"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal>
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">{locale === 'en' ? 'MOMENTS' : 'DOKUMENTASI'}</span>
                        {locale === 'en' ? 'PHOTO ALBUM' : 'GALERI ALAM'}
                    </h2>
                </Reveal>

                <div className="spy-gallery-grid">
                    {list.map((item, idx) => (
                        <Reveal 
                            key={item.id || idx} 
                            delay={idx * 80} 
                            className="spy-gallery-item"
                            onClick={() => onSelectImage(item)}
                        >
                            <img 
                                src={getStorageUrl(item.image_url)} 
                                alt={item.caption || `Gallery ${idx}`} 
                                className="class-foto-galeri"
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & GUESTBOOK UNIFIED FORM SECTION
   ═══════════════════════════════════════ */
function WishesRsvpSection({ invitation, guest, wishes, enableRsvp, enableWishes, id, locale }) {
    const wishesInputRef = useRef(null);
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';

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
        <section id={id || "rsvp"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal className="spy-comic-panel">
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">ATTENDANCE</span>
                        {sectionTitle.toUpperCase()}
                    </h2>

                    {success ? (
                        <div className="spy-comic-panel" style={{ backgroundColor: 'var(--spidey-dark-blue)', textShadow: 'none', borderStyle: 'solid', textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🕸️❤️</div>
                            <h3 className="spy-kids-name" style={{ fontSize: '1.8rem', margin: '0 0 10px 0' }}>BAM!</h3>
                            <p style={{ color: '#fff', fontSize: '0.95rem' }}>
                                {locale === 'en' ? 'Thank you! Your response has been recorded.' : 'Terima kasih! Respon Anda berhasil disimpan.'}
                            </p>
                            <button onClick={() => setSuccess(false)} className="spy-btn-action" style={{ marginTop: '15px' }}>
                                SUBMIT ANOTHER RESPONSE
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="spy-rsvp-form">
                            <div className="spy-form-group">
                                <label className="spy-label">{locale === 'en' ? 'YOUR NAME' : 'NAMA ANDA'}</label>
                                <input 
                                    type="text" 
                                    value={sharedName} 
                                    onChange={e => setSharedName(e.target.value)} 
                                    className="spy-input"
                                    required 
                                    placeholder={locale === 'en' ? 'Enter name...' : 'Tulis nama Anda...'}
                                />
                            </div>

                            {enableRsvp && (
                                <>
                                    <div className="spy-form-group">
                                        <label className="spy-label">{locale === 'en' ? 'ATTENDANCE' : 'KONFIRMASI KEHADIRAN'}</label>
                                        <select 
                                            value={attendance} 
                                            onChange={e => setAttendance(e.target.value)}
                                            className="spy-select"
                                        >
                                            <option value="hadir">{locale === 'en' ? 'Yes, I will attend' : 'Ya, Saya akan Hadir'}</option>
                                            <option value="tidak_hadir">{locale === 'en' ? 'No, I cannot attend' : 'Maaf, Saya Tidak Bisa Hadir'}</option>
                                        </select>
                                    </div>

                                    {attendance === 'hadir' && (
                                        <div className="spy-form-group">
                                            <label className="spy-label">{locale === 'en' ? 'NUMBER OF GUESTS' : 'JUMLAH PAX/ORANG'}</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                max="10" 
                                                value={numGuests} 
                                                onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                                className="spy-input"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {enableWishes && (
                                <div className="spy-form-group">
                                    <label className="spy-label">{locale === 'en' ? 'DOA & WISHES' : 'UCAPAN & DOA'}</label>
                                    <WishesEmojiPicker
                                        value={message}
                                        onChange={setMessage}
                                        inputRef={wishesInputRef}
                                        isDark={true}
                                    >
                                        <textarea
                                            ref={wishesInputRef}
                                            rows="3"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            className="spy-textarea"
                                            placeholder={locale === 'en' ? 'Write birthday wishes here...' : 'Tulis doa ulang tahun di sini...'}
                                        />
                                    </WishesEmojiPicker>
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitting} className="spy-btn-submit">
                                {isSubmitting ? (locale === 'en' ? 'TRANSMITTING...' : 'MENGIRIM...') : (locale === 'en' ? 'SEND RESPONSE' : 'KIRIM RESPON')}
                            </button>
                        </form>
                    )}

                    {enableWishes && recentWishes.length > 0 && (
                        <div className="spy-wishes-list">
                            <h4 className="spy-kids-order" style={{ marginBottom: '12px' }}>{locale === 'en' ? 'RECENT GUESTBOOK' : 'UCAPAN TERBARU'}</h4>
                            {recentWishes.map((w, idx) => (
                                <div key={w.id || idx} className="spy-wish-item">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="spy-wish-sender">{w.sender_name}</span>
                                        {w.rsvp?.attendance && (
                                            <span className={`spy-wish-attendance spy-wish-attendance--${w.rsvp.attendance}`}>
                                                {w.rsvp.attendance === 'hadir' ? (locale === 'en' ? 'ATTENDING' : 'HADIR') : (locale === 'en' ? 'ABSENT' : 'TIDAK HADIR')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="spy-wish-time">
                                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : ''}
                                    </div>
                                    <p className="spy-wish-message">{w.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BANKING / GIFT BOX SECTION
   ═══════════════════════════════════════ */
function BankGiftSection({ bankAccounts, id, locale }) {
    const accounts = safeArr(bankAccounts).sort((a, b) => a.sort_order - b.sort_order);
    if (accounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleCopy = (accNumber, idx) => {
        const copySuccess = () => {
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2500);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(accNumber).then(copySuccess).catch(() => {
                fallbackCopy(accNumber);
                copySuccess();
            });
        } else {
            fallbackCopy(accNumber);
            copySuccess();
        }
    };

    const fallbackCopy = (text) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    };

    return (
        <section id={id || "bank"} className="spy-scroll-section">
            <div className="spy-container-inner">
                <Reveal className="spy-comic-panel" style={{ textAlign: 'center' }}>
                    <h2 className="spy-section-title">
                        <span className="spy-title-badge">{locale === 'en' ? 'DIGITAL BOX' : 'KADO DIGITAL'}</span>
                        {locale === 'en' ? 'GIFT OF LOVE' : 'AMPELOP DIGITAL'}
                    </h2>
                    <p className="spy-subtitle">
                        {locale === 'en' ? 'For family & friends who wish to send digital gifts' : 'Bagi keluarga dan rekan yang ingin mengirimkan kado/hadiah digital'}
                    </p>

                    <div className="spy-bank-grid">
                        {accounts.map((acc, idx) => (
                            <div key={acc.id || idx} className="spy-bank-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="spy-bank-chip" />
                                    <span className="spy-bank-logo">{acc.bank_name}</span>
                                </div>
                                <div className="spy-bank-number">
                                    {acc.account_number}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <span className="spy-bank-holder">CARD HOLDER</span>
                                        <div className="spy-bank-holder-val">{acc.account_name}</div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleCopy(acc.account_number, idx)} 
                                        className="spy-btn-copy"
                                        style={copiedIdx === idx ? { backgroundColor: 'var(--spidey-yellow)' } : undefined}
                                    >
                                        <i className={copiedIdx === idx ? "fas fa-check" : "fas fa-copy"} />
                                        {copiedIdx === idx ? 'COPIED!' : 'COPY'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, id, locale, brideGrooms }) {
    const couples = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { isSingleHost, labels } = themeConfig;
    const isEn = locale === 'en';
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    return (
        <section id={id || "closing"} className="spy-scroll-section" style={{ borderBottom: 'none' }}>
            <div className="spy-container-inner text-center">
                <Reveal className="spy-comic-panel spy-closing-card">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                        <SpideyMask size={60} />
                    </div>
                    <h2 className="spy-closing-title">
                        {invitation?.closing_title || labels.closingTitle}
                    </h2>
                    
                    <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6' }}>
                        {invitation?.closing_text || labels.closingText}
                    </p>

                    {isSingleHost ? (
                        (groomFather || groomMother) && (
                            <div className="spy-parents-box" style={{ marginTop: '25px', padding: '16px', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '8px' }}>
                                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--spidey-accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                    {isEn ? "WE ARE GRATEFUL," : "KAMI YANG MENGUNDANG,"}
                                </p>
                                <p className="spy-parents-names" style={{ margin: 0 }}>
                                    {groomFather && groomMother 
                                        ? (isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`)
                                        : (groomFather ? (isEn ? `Family of Mr. ${groomFather}` : `Kel. Bapak ${groomFather}`) : (isEn ? `Family of Mrs. ${groomMother}` : `Kel. Ibu ${groomMother}`))}
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="spy-parents-box" style={{ marginTop: '25px', padding: '16px', border: '2px dashed rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--spidey-accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                                {isEn ? "WE ARE GRATEFUL," : "KAMI YANG MENGUNDANG,"}
                            </p>
                            <div className="spy-parents-names" style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
                                {hasGroomParents && (
                                    <div>
                                        {groomFather && groomMother 
                                            ? (isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`)
                                            : (groomFather ? (isEn ? `Family of Mr. ${groomFather}` : `Kel. Bapak ${groomFather}`) : (isEn ? `Family of Mrs. ${groomMother}` : `Kel. Ibu ${groomMother}`))}
                                    </div>
                                )}
                                {hasBrideParents && (
                                    <div>
                                        {brideFather && brideMother 
                                            ? (isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`)
                                            : (brideFather ? (isEn ? `Family of Mr. ${brideFather}` : `Kel. Bapak ${brideFather}`) : (isEn ? `Family of Mrs. ${brideMother}` : `Kel. Ibu ${brideMother}`))}
                                    </div>
                                )}
                                {!hasGroomParents && !hasBrideParents && (
                                    <div>
                                        {isEn ? 'Both Families of the Couple' : 'Keluarga Besar Kedua Mempelai'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <p className="spy-watermark" style={{ marginTop: '30px', paddingBottom: '10px' }}>
                        Made with ❤️ by <span style={{ color: 'var(--spidey-accent)', fontWeight: 'bold' }}>{brandName}</span>
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   NAVIGATION MENU & BOTTOM FLOATING CONTROLS
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
    toggleFullscreen,
    onOpenQr,
    enableQr,
    locale
}) {
    const { t } = useTranslation();

    // Filter main menu links: Cover (hero), Opening, Celebrant (bride_groom), Event (event), Milestones (love_story), RSVP (rsvp/wishes)
    const menuLinks = useMemo(() => {
        const keys = resolvedSections.map(s => s.section_key);
        const list = [];
        
        // Home
        list.push({ id: 'hero', icon: 'fas fa-home', name: locale === 'en' ? 'HOME' : 'HOME' });
        
        if (keys.includes('opening')) {
            list.push({ id: 'opening', icon: 'fas fa-book-open', name: locale === 'en' ? 'WELCOME' : 'PEMBUKA' });
        }
        if (keys.includes('bride_groom')) {
            list.push({ id: 'bride_groom', icon: 'fas fa-child', name: locale === 'en' ? 'KID' : 'PROFIL' });
        }
        if (keys.includes('event')) {
            list.push({ id: 'event', icon: 'fas fa-birthday-cake', name: locale === 'en' ? 'PARTY' : 'ACARA' });
        }
        if (keys.includes('love_story')) {
            list.push({ id: 'love_story', icon: 'fas fa-history', name: locale === 'en' ? 'AGE' : 'KILASAN' });
        }
        if (keys.includes('gallery')) {
            list.push({ id: 'gallery', icon: 'fas fa-images', name: locale === 'en' ? 'PHOTOS' : 'GALERI' });
        }
        if (keys.includes('rsvp') || (keys.includes('wishes') && !enableRsvp)) {
            list.push({ id: 'rsvp', icon: 'fas fa-signature', name: locale === 'en' ? 'RSVP' : 'RSVP' });
        }
        if (keys.includes('bank')) {
            list.push({ id: 'bank', icon: 'fas fa-gift', name: locale === 'en' ? 'GIFT' : 'KADO' });
        }
        
        return list;
    }, [resolvedSections, enableRsvp, enableWishes, locale]);

    if (!isOpened) return null;

    return (
        <>
            {/* Bottom Floating controls: Music, AutoScroll, Fullscreen, QR Code */}
            <div className="spy-floating-controls">
                {enableQr && guest && (
                    <button type="button" onClick={onOpenQr} className="spy-btn-float" title="Check-in QR Code">
                        <i className="fas fa-qrcode" style={{ color: 'var(--spidey-accent)' }} />
                    </button>
                )}

                <button 
                    type="button" 
                    onClick={toggleFullscreen} 
                    className="spy-btn-float" 
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                </button>

                <button 
                    type="button" 
                    onClick={() => setAutoScrollEnabled(prev => !prev)} 
                    className="spy-btn-float" 
                    style={autoScrollEnabled ? { backgroundColor: 'var(--spidey-accent)', color: '#000' } : undefined}
                    title={autoScrollEnabled ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
                >
                    <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-play"} />
                </button>

                <button type="button" onClick={onToggleMusic} className="spy-btn-float" title="Toggle Music">
                    {isPlaying ? (
                        <div className="spy-music-waves" style={{ color: 'var(--spidey-red)' }}>
                            <span />
                            <span />
                            <span />
                        </div>
                    ) : (
                        <i className="fas fa-volume-mute" />
                    )}
                </button>
            </div>

            {/* Bottom Nav Bar */}
            <nav className="spy-nav-bar">
                <div className="spy-nav-container">
                    {menuLinks.map((link) => {
                        const isActive = activeMenuId === link.id;
                        return (
                            <button
                                key={link.id}
                                type="button"
                                onClick={() => scrollToSection(link.id)}
                                className={`spy-nav-item ${isActive ? 'is-active' : ''}`}
                            >
                                <i className={link.icon} />
                                <span>{link.name}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN DYNAMIC INDEX COMPONENT
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
    wishes,
    brand_name,
    brand_url
}) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);

    const couples = safeArr(brideGrooms);
    const celebrant = couples[0] || {};

    const celebrantAge = useMemo(() => {
        if (!celebrant.birth_date || !events[0]?.event_date) {
            const subtitle = invitation?.cover_subtitle || '';
            const match = subtitle.match(/\b\d+\b/);
            return match ? match[0] : null;
        }
        try {
            const birthYear = new Date(celebrant.birth_date).getFullYear();
            const eventYear = new Date(events[0].event_date).getFullYear();
            return eventYear - birthYear;
        } catch (e) {
            return null;
        }
    }, [celebrant.birth_date, events, invitation?.cover_subtitle]);

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState('hero');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0); // for slide mode
    
    // Lightbox image preview state
    const [selectedImage, setSelectedImage] = useState(null);
    // QR Code modal check-in state
    const [showQrModal, setShowQrModal] = useState(false);

    const audioRef = useRef(null);

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const layoutMode = invitation?.layout_mode || 'scroll'; // scroll, slide-h, slide-v
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v';
    const showPhotos = !parseBool(invitation?.hide_photos, false);
    const showAnimations = parseBool(invitation?.show_animations);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    // Sync visibility/globals
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // Visibility audio visibility API hook
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || brand_name 
        || 'TrueLove Invitation';

    const brandUrl = brand_url || '#';

    // Parse primary event video lists
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const hasVideos = !!invitation?.video_url;

    // Resolve active sections
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'video', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
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
                if (s.section_key === 'gallery') {
                    if (galleries?.length > 0 && showPhotos) {
                        resolved.push(s);
                    }
                    if (hasVideos) {
                        resolved.push({ section_key: 'video' });
                    }
                    return;
                }
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                
                // Countdown is integrated into event/party details
                if (s.section_key === 'countdown') return;

                // Wishes merged with RSVP if RSVP is active
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return;
                }

                if (s.section_key === 'livestream' && !hasStream) return;

                resolved.push(s);
            });
        } else {
            // Fallback default list
            resolved.push({ section_key: 'opening' });
            resolved.push({ section_key: 'bride_groom' });
            resolved.push({ section_key: 'event' });
            if (loveStories?.length > 0) resolved.push({ section_key: 'love_story' });
            if (galleries?.length > 0 && showPhotos) resolved.push({ section_key: 'gallery' });
            if (hasVideos) resolved.push({ section_key: 'video' });
            if (enableRsvp) resolved.push({ section_key: 'rsvp' });
            if (enableWishes && !enableRsvp) resolved.push({ section_key: 'wishes' });
            if (bankAccounts?.length > 0) resolved.push({ section_key: 'bank' });
            resolved.push({ section_key: 'closing' });
        }

        return resolved;
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes, showPhotos, hasVideos]);

    // Fullscreen toggling listener
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

    // Auto music trigger when Cover is opened
    const handleOpen = () => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        
        if (audioRef.current) {
            audioRef.current.muted = false;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    };

    // Toggle Music manually
    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.muted = false;
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        }
    };

    // Scroll Scrollspy to update active bottom nav tab
    useEffect(() => {
        if (!isOpened || isSlideMode) return;

        const handleScroll = () => {
            const keys = resolvedSections.map(s => s.section_key);
            let active = 'hero';
            
            for (const key of keys) {
                const el = document.getElementById(key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.4) {
                        active = key;
                    }
                }
            }
            setActiveSectionId(active);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections]);

    // Slide synchronization: update navigation item when index changes
    useEffect(() => {
        if (!isOpened || !isSlideMode) return;
        const target = resolvedSections[activeSlideIdx];
        if (target) {
            setActiveSectionId(target.section_key);
        }
    }, [activeSlideIdx, resolvedSections, isSlideMode, isOpened]);

    // Handle Scroll or slide to specific ID
    const scrollToSection = (targetId) => {
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === targetId);
            if (idx !== -1) {
                setActiveSlideIdx(idx);
            }
        } else {
            const el = document.getElementById(targetId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setActiveSectionId(targetId);
            }
        }
    };

    // Swipe gestures state handlers for slide-h and slide-v modes
    const touchStart = useRef({ x: 0, y: 0 });
    const handleTouchStart = (e) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };
    const handleTouchEnd = (e) => {
        if (!isOpened || !isSlideMode) return;
        const diffX = touchStart.current.x - e.changedTouches[0].clientX;
        const diffY = touchStart.current.y - e.changedTouches[0].clientY;
        
        if (layoutMode === 'slide-h' && Math.abs(diffX) > 60) {
            if (diffX > 0) {
                setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
            } else {
                setActiveSlideIdx(prev => Math.max(prev - 1, 0));
            }
        } else if (layoutMode === 'slide-v' && Math.abs(diffY) > 60) {
            if (diffY > 0) {
                setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
            } else {
                setActiveSlideIdx(prev => Math.max(prev - 1, 0));
            }
        }
    };

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('input') ||
                e.target.closest('textarea') ||
                e.target.closest('select') ||
                e.target.closest('.spy-nav-bar')
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

    // Auto-Scroll implementation (pixels scroll or page sweep after delay)
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let intervalId;

        if (isSlideMode) {
            // In slide modes: auto transition to next page after 6 seconds delay
            intervalId = setInterval(() => {
                setActiveSlideIdx(prev => {
                    if (prev >= resolvedSections.length - 1) {
                        return 0; // wrap around
                    }
                    return prev + 1;
                });
            }, 6000);
        } else {
            // In scroll modes: scroll pixel by pixel smoothly
            let lastScrollPos = window.scrollY;
            intervalId = setInterval(() => {
                window.scrollBy(0, 1);
                if (window.scrollY === lastScrollPos) {
                    // Reached bottom, reset to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                lastScrollPos = window.scrollY;
            }, 30);
        }

        return () => clearInterval(intervalId);
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Section Renderer Component Selector
    const renderSectionComponent = (s, idx) => {
        const key = s.section_key;
        
        // Setup slider transition classes
        let slideClass = '';
        if (isSlideMode) {
            slideClass = `spy-slide ${idx === activeSlideIdx ? 'is-active' : (idx < activeSlideIdx ? 'is-prev' : 'is-next')}`;
        }

        const sectionId = isSlideMode ? undefined : key;
        const outerClass = isSlideMode ? slideClass : undefined;

        const wrap = (content) => {
            if (isSlideMode) {
                return (
                    <div key={key} className={outerClass}>
                        <div className="spy-slide-inner-scroll">
                            {content}
                        </div>
                    </div>
                );
            }
            return <div key={key} id={key}>{content}</div>;
        };

        switch (key) {
            case 'hero':
                return wrap(
                    <div className="spy-container-inner" style={{ textAlign: 'center', paddingTop: '50px' }}>
                        <div className="spy-comic-panel">
                            <SpideyMask size={70} style={{ margin: '0 auto 15px auto', display: 'block' }} />
                            <span className="spy-title-badge">AWESOME CELEBRATION</span>
                            <h2 className="spy-comic-title" style={{ fontSize: '3rem' }}>{invitation?.cover_title || (celebrant.full_name || 'CELEBRANT').toUpperCase()}</h2>
                            <p className="spy-kids-order">
                                {celebrantAge 
                                    ? (locale === 'en' ? `IS TURNING ${celebrantAge}!` : `MEMASUKI USIA ${celebrantAge} TAHUN!`)
                                    : (locale === 'en' ? "BIRTHDAY PARTY CELEBRATION!" : "PERAYAAN HARI ULANG TAHUN!")}
                            </p>
                            <p style={{ color: '#fff', marginTop: '15px' }}>
                                {locale === 'en' 
                                    ? 'Scroll down or use menu navigation below to see full invitation details.'
                                    : 'Scroll ke bawah atau gunakan menu navigasi untuk melihat rincian undangan.'}
                            </p>
                        </div>
                    </div>
                );
            case 'opening':
                return wrap(<OpeningSection invitation={invitation} id={sectionId} locale={locale} />);
            case 'bride_groom':
                return wrap(<BrideGroomSection brideGrooms={brideGrooms} id={sectionId} locale={locale} invitation={invitation} />);
            case 'event':
                return wrap(<EventSection events={events} invitation={invitation} id={sectionId} locale={locale} />);
            case 'love_story':
                return wrap(<LoveStorySection loveStories={loveStories} id={sectionId} locale={locale} />);
            case 'gallery':
                return wrap(<GallerySection galleries={galleries} id={sectionId} locale={locale} onSelectImage={setSelectedImage} />);
            case 'video':
                return wrap(<VideoGallerySection invitation={invitation} id={sectionId} locale={locale} />);
            case 'rsvp':
                return wrap(
                    <WishesRsvpSection 
                        invitation={invitation} 
                        guest={guest} 
                        wishes={wishes} 
                        enableRsvp={enableRsvp} 
                        enableWishes={enableWishes} 
                        id={sectionId}
                        locale={locale}
                    />
                );
            case 'wishes':
                return wrap(
                    <WishesRsvpSection 
                        invitation={invitation} 
                        guest={guest} 
                        wishes={wishes} 
                        enableRsvp={false} 
                        enableWishes={true} 
                        id={sectionId}
                        locale={locale}
                    />
                );
            case 'bank':
                return wrap(<BankGiftSection bankAccounts={bankAccounts} id={sectionId} locale={locale} />);
            case 'closing':
                return wrap(<ClosingSection invitation={invitation} id={sectionId} locale={locale} brideGrooms={brideGrooms} />);
            case 'livestream':
                return wrap(<LiveStreamingSection events={events} invitation={invitation} id={sectionId} locale={locale} />);
            default:
                return null;
        }
    };

    return (
        <ErrorBoundary>
            <div className={`spy-body ${!showAnimations ? 'spy-no-animations' : ''}`}>
                <SpideySwingingSpider />
                {/* Audio Reference Tag */}
                {invitation?.music_url && (
                    <audio 
                        ref={audioRef} 
                        src={getStorageUrl(invitation.music_url)} 
                        loop 
                        preload="auto"
                    />
                )}

                {/* Cover section */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    locale={locale}
                />

                {/* Background Ambients & Custom Web backdrop */}
                <div className="spy-ambient-bg">
                    <SpideyWebBackground />
                    <div className="spy-ambient-blob spy-ambient-blob--red" />
                    <div className="spy-ambient-blob spy-ambient-blob--blue" />
                    <CornerWeb className="spy-corner-web--bottom-left" />
                    <CornerWeb className="spy-corner-web--bottom-right" />
                </div>

                {/* Main Content Area */}
                <div className={isSlideMode ? 'spy-slides-wrapper' : 'spy-scroll-container'}
                     onTouchStart={isSlideMode ? handleTouchStart : undefined}
                     onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                >
                    {isSlideMode ? (
                        resolvedSections.map((s, idx) => renderSectionComponent(s, idx))
                    ) : (
                        <div className="spy-vertical-stack">
                            {resolvedSections.map((s, idx) => (
                                <React.Fragment key={s.section_key || idx}>
                                    {renderSectionComponent(s, idx)}
                                    {idx < resolvedSections.length - 1 && s.section_key !== 'hero' && s.section_key !== 'closing' && <SpideySectionDivider />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Navigation controls */}
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
                    onOpenQr={() => setShowQrModal(true)}
                    enableQr={enableQr}
                    locale={locale}
                />

                {/* Lightbox photo viewer Modal */}
                {selectedImage && (
                    <div className="spy-lightbox" onClick={() => setSelectedImage(null)}>
                        <button type="button" className="spy-lightbox-close" onClick={() => setSelectedImage(null)}>
                            <i className="fas fa-times" />
                        </button>
                        <div className="spy-lightbox-content" onClick={e => e.stopPropagation()}>
                            <img src={getStorageUrl(selectedImage.image_url)} alt={selectedImage.caption || 'Preview'} className="spy-lightbox-img" />
                            {selectedImage.caption && (
                                <p className="spy-lightbox-caption">{selectedImage.caption}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* QR Code Check-in presence Modal */}
                {enableQr && showQrModal && guest && (
                    <div className="spy-qr-modal" onClick={() => setShowQrModal(false)}>
                        <div className="spy-qr-modal-content" onClick={e => e.stopPropagation()}>
                            <button type="button" className="spy-qr-modal-close" onClick={() => setShowQrModal(false)}>
                                <i className="fas fa-times" />
                            </button>
                            <h3 className="spy-qr-title">PRESENCE QR CODE</h3>
                            <p style={{ color: '#fff', fontSize: '0.85rem' }}>
                                {locale === 'en' ? 'Scan this code at the registration desk upon arrival.' : 'Scan QR Code ini di meja registrasi saat kedatangan.'}
                            </p>
                            
                            <div className="spy-qr-image-wrapper">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=0b1b3d&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                    alt="Checkin QR Code" 
                                />
                            </div>
                            
                            <p className="spy-qr-guest-label">{guest.name}</p>
                            <p style={{ color: 'var(--spidey-accent)', fontSize: '0.75rem', marginTop: '5px', fontWeight: 'bold' }}>
                                GUEST ACCESS CODE: {guest.slug.toUpperCase()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
