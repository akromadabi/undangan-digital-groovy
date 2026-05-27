import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import PremiumSlideshow from '@/Components/PremiumSlideshow';

/* ─── Standard Blueprint Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d, locale = 'id') {
    if (!d) return '';
    const loc = String(locale).toLowerCase() === 'en' ? 'en-US' : 'id-ID';
    return new Date(d).toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
    if (!url || url === 'null' || url === 'undefined' || url === '/storage/' || url === 'storage/') return fallback;
    if (typeof url === 'string' && url.includes(',')) {
        url = url.split(',')[0];
    }
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) {
        if (cleanUrl === '/storage/' || cleanUrl === '/storage/null' || cleanUrl === '/storage/undefined') return fallback;
        return cleanUrl;
    }
    if (cleanUrl.startsWith('storage/')) {
        if (cleanUrl === 'storage/' || cleanUrl === 'storage/null' || cleanUrl === 'storage/undefined') return '/' + cleanUrl;
        return '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

// Child order translations helper
function translateChildOrder(childOrderStr, gender, language) {
    if (!childOrderStr) return '';
    const isEn = language === 'en';
    const cleanStr = String(childOrderStr).toLowerCase();
    
    // Normalize child order strings
    let orderLabel = childOrderStr;
    if (cleanStr.includes('pertama') || cleanStr.includes('1') || cleanStr.includes('first')) {
        orderLabel = isEn ? 'first' : 'pertama';
    } else if (cleanStr.includes('kedua') || cleanStr.includes('2') || cleanStr.includes('second')) {
        orderLabel = isEn ? 'second' : 'kedua';
    } else if (cleanStr.includes('ketiga') || cleanStr.includes('3') || cleanStr.includes('third')) {
        orderLabel = isEn ? 'third' : 'ketiga';
    } else if (cleanStr.includes('keempat') || cleanStr.includes('4') || cleanStr.includes('fourth')) {
        orderLabel = isEn ? 'fourth' : 'keempat';
    } else if (cleanStr.includes('bungsu') || cleanStr.includes('last')) {
        orderLabel = isEn ? 'youngest' : 'bungsu';
    } else if (cleanStr.includes('tunggal') || cleanStr.includes('only')) {
        orderLabel = isEn ? 'only' : 'tunggal';
    }
    
    const isFemale = ['wanita', 'female'].includes(String(gender).toLowerCase());
    
    if (isEn) {
        const noun = isFemale ? 'daughter' : 'son';
        return `${orderLabel} ${noun} of`;
    } else {
        const noun = isFemale ? 'putri' : 'putra';
        return `${noun} ${orderLabel} dari`;
    }
}

// Clean up prefix repetitions in parent names
function formatParentName(name, prefix) {
    if (!name) return '';
    let clean = name.trim();
    // Strip redundant "Putra / Putri terkasih dari" if present
    clean = clean.replace(/^(putra|putri)\s*\/?\s*(putra|putri)?\s*terkasih\s*dari\s*/i, '');
    
    const prefixRegex = /^(bapak|ibu|mr\.|mrs\.|bp\.|hj\.|h\.|kel\.)/i;
    if (prefixRegex.test(clean)) {
        return clean;
    }
    return `${prefix} ${clean}`;
}

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="ttk-wrapper" style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#010101' }}>
                <h2 style={{ color: '#FE2C55', fontSize: '1.5rem', marginBottom: 12, fontWeight: 800 }}>Terjadi Kesalahan Rendering Tema</h2>
                <p style={{ color: '#8a8b91', fontSize: '0.85rem', marginBottom: 20 }}>Visualisasi gagal di-render di halaman undangan ini.</p>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#FE2C55', background: '#161823', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', maxWidth: '100%', textAlign: 'left' }}>
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
            if (e.isIntersecting) setVisible(true);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let animClass = 'ttk-reveal';
    if (variant === 'left') animClass = 'ttk-reveal ttk-reveal--left';
    else if (variant === 'right') animClass = 'ttk-reveal ttk-reveal--right';
    else if (variant === 'zoom') animClass = 'ttk-reveal ttk-reveal--zoom';

    return (
        <div
            ref={ref}
            className={`${className} ${animClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (TikTok Login screen design)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, language, fallbackPhoto, onToast, onLanguageChange }) {
    const { t, locale } = useTranslation(language);
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title && !invitation.cover_title.toLowerCase().includes('bimo') && !invitation.cover_title.toLowerCase().includes('raras')
            ? invitation.cover_title
            : `${groom?.nickname || 'Groom'} & ${bride?.nickname || 'Bride'}`);

    const coverImages = useMemo(() => {
        if (!invitation?.cover_image) return [];
        return invitation.cover_image.split(',').map(url => getStorageUrl(url, fallbackPhoto)).filter(Boolean);
    }, [invitation?.cover_image, fallbackPhoto]);

    const coverUrl = getStorageUrl(invitation?.cover_image, null) || fallbackPhoto;
    const [coverSrc, setCoverSrc] = useState(coverUrl);

    useEffect(() => {
        setCoverSrc(coverUrl);
    }, [coverUrl]);

    const handleCoverError = () => {
        if (coverSrc !== fallbackPhoto && fallbackPhoto) {
            setCoverSrc(coverUrl);
        } else {
            setCoverSrc(null);
        }
    };

    const groomTag = groom?.nickname ? groom.nickname.replace(/\s+/g, '') : 'Groom';
    const brideTag = bride?.nickname ? bride.nickname.replace(/\s+/g, '') : 'Bride';
    const defaultHashTags = `#${groomTag}${brideTag}Wedding #PernikahanViral`;
    
    let hashTags = invitation?.cover_subtitle || '';
    if (!hashTags || !hashTags.includes('#') || hashTags.toLowerCase().includes('bimo') || hashTags.toLowerCase().includes('raras')) {
        hashTags = defaultHashTags;
    }

    const [loginState, setLoginState] = useState(null); // 'connecting', 'success', null
    const [loginMethod, setLoginMethod] = useState('');

    const handleLoginClick = (method) => {
        setLoginMethod(method);
        setLoginState('connecting');
        setTimeout(() => {
            setLoginState('success');
            setTimeout(() => {
                setLoginState(null);
                onOpen();
            }, 900);
        }, 1200);
    };

    return (
        <div className={`ttk-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'ttk-no-photo-mode' : ''}`}>
            {loginState && (
                <div className="ttk-login-overlay">
                    <div className="ttk-login-overlay__content">
                        {loginState === 'connecting' ? (
                            <>
                                <div className="ttk-loading-spinner">
                                    <div className="ttk-spinner-dot ttk-spinner-dot--cyan" />
                                    <div className="ttk-spinner-dot ttk-spinner-dot--red" />
                                </div>
                                <div className="ttk-login-overlay__text">
                                    {locale === 'en' ? `Connecting to ${loginMethod}...` : `Menghubungkan ke ${loginMethod}...`}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="ttk-login-success-badge">
                                    <i className="fas fa-check-circle" />
                                </div>
                                <div className="ttk-login-overlay__text success">
                                    {locale === 'en' ? 'Success! Opening Invitation' : 'Masuk Berhasil! Membuka Undangan'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            {globalShowPhotos && coverImages.length > 0 ? (
                <PremiumSlideshow
                    images={coverImages}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="ttk-cover__bg z-[1]"
                    imgClassName="absolute inset-0 w-full h-full object-cover filter brightness-[0.5]"
                />
            ) : (
                <div className="ttk-cover__bg" style={{ background: 'linear-gradient(135deg, #09090b 0%, #161823 100%)' }} />
            )}
            <div className="ttk-cover__bg-overlay" />
            <div className="ttk-scanlines" />

            <div className="ttk-cover__inner">
                {/* Header mimicking TikTok feed tabs */}
                <div className="ttk-cover__header" style={{ position: 'relative', zIndex: 12, justifyContent: 'center' }}>
                    <div className="ttk-cover__tabs">
                        <span className="ttk-cover__tab">{locale === 'en' ? 'Following' : 'Mengikuti'}</span>
                        <span className="ttk-cover__tab active">{locale === 'en' ? 'For You' : 'Untuk Anda'}</span>
                    </div>
                </div>

                {/* Main center dynamic couple title */}
                <div className="ttk-cover__center">
                    <Reveal variant="zoom">
                        <div className="ttk-glitch" data-text={coupleName}>
                            {coupleName}
                        </div>
                    </Reveal>
                </div>

                {/* Simulated TikTok Mobile Login screen options card (bukaundangan pakai login tiktok saja) */}
                <div className="ttk-cover__bottom-info" style={{ maxWidth: '100%' }}>
                    <div className="ttk-cover__handle" style={{ textAlign: 'center', marginBottom: 2 }}>
                        @{groom?.nickname?.toLowerCase() || 'groom'}_dan_{bride?.nickname?.toLowerCase() || 'bride'}
                    </div>
                    <div className="ttk-cover__tags" style={{ textAlign: 'center', marginBottom: 15, fontSize: 12 }}>
                        {hashTags}
                    </div>

                    <div className="ttk-cover__login-container">
                        <div className="ttk-cover__login-title">
                            {locale === 'en' ? 'Log in to view invitation' : 'Masuk untuk Melihat Undangan'}
                        </div>
                        
                        {/* Option 1: Continue as Tamu (The absolute TikTok Logo Login block style) */}
                        <button 
                            onClick={() => handleLoginClick('TikTok')} 
                            className="ttk-cover__login-btn ttk-cover__login-btn--primary"
                            type="button"
                        >
                            <i className="fab fa-tiktok" />
                            <strong>{locale === 'en' ? `Continue as Guest (${guestName})` : `Lanjutkan sebagai Tamu (${guestName})`}</strong>
                        </button>

                        {/* Option 2: Simulated Google Login option */}
                        <button 
                            onClick={() => handleLoginClick('Google')} 
                            className="ttk-cover__login-btn ttk-cover__login-btn--google"
                            type="button"
                        >
                            <i className="fab fa-google" />
                            <span>{locale === 'en' ? 'Continue with Google' : 'Lanjutkan dengan Google'}</span>
                        </button>

                        {/* Option 3: Simulated Facebook Login option */}
                        <button 
                            onClick={() => handleLoginClick('Facebook')} 
                            className="ttk-cover__login-btn ttk-cover__login-btn--facebook"
                            type="button"
                        >
                            <i className="fab fa-facebook" />
                            <span>{locale === 'en' ? 'Continue with Facebook' : 'Lanjutkan dengan Facebook'}</span>
                        </button>
                    </div>

                    {/* Timeline progress line mockup */}
                    <div className="ttk-cover__timeline-bar">
                        <div className="ttk-cover__timeline-progress" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (Stunning vertical card mockup replicating a real TikTok video post)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, language, fallbackPhoto, onToast }) {
    const { t, locale } = useTranslation(language);
    const isEn = t('invitation.save_the_date') === 'Save The Date';
    // Premium fallback Unsplash prewedding image so that it never looks like a plain black box
    const defaultOpeningPhoto = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
    const openingImages = useMemo(() => {
        const rawSource = invitation?.opening_image || invitation?.cover_image;
        if (!rawSource) return [];
        return rawSource.split(',').map(url => getStorageUrl(url, fallbackPhoto || defaultOpeningPhoto)).filter(Boolean);
    }, [invitation?.opening_image, invitation?.cover_image, fallbackPhoto, defaultOpeningPhoto]);
    const photoUrl = getStorageUrl(invitation?.opening_image || invitation?.cover_image, null) || fallbackPhoto || defaultOpeningPhoto;

    const isIdenticalQuote = invitation?.opening_ayat && invitation?.opening_ayat_translation &&
        invitation.opening_ayat.trim().toLowerCase() === invitation.opening_ayat_translation.trim().toLowerCase();

    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title && !invitation.cover_title.toLowerCase().includes('bimo') && !invitation.cover_title.toLowerCase().includes('raras')
            ? invitation.cover_title
            : `${groom?.nickname || 'Groom'} & ${bride?.nickname || 'Bride'}`);

    const groomTag = groom?.nickname ? groom.nickname.replace(/\s+/g, '') : 'Groom';
    const brideTag = bride?.nickname ? bride.nickname.replace(/\s+/g, '') : 'Bride';
    const defaultHashTags = `#${groomTag}${brideTag}Wedding #PernikahanViral`;
    
    let hashTags = invitation?.cover_subtitle || '';
    if (!hashTags || !hashTags.includes('#') || hashTags.toLowerCase().includes('bimo') || hashTags.toLowerCase().includes('raras')) {
        hashTags = defaultHashTags;
    }

    return (
        <section className="ttk-section" id="opening" style={{ padding: '0 0 20px 0' }}>
            {/* Authentic TikTok Feed Header with Simulated Mobile Status Bar */}
            <div className="ttk-feed-header">
                {/* Status Bar */}
                <div className="ttk-status-bar">
                    <span>09:41</span>
                    <div className="ttk-status-icons">
                        <i className="fas fa-signal" />
                        <i className="fas fa-wifi" />
                        <i className="fas fa-battery-full" style={{ fontSize: '12px' }} />
                    </div>
                </div>

                {/* TikTok Header Navigation */}
                <div className="ttk-tiktok-nav">
                    {/* Left: TV icon and LIVE indicator */}
                    <div className="ttk-tiktok-nav__left" onClick={() => onToast && onToast(language === 'en' ? 'LIVE Broadcast Mode active 🎥' : 'Mode Siaran Langsung aktif 🎥')}>
                        <i className="fas fa-tv" />
                        <span className="ttk-tiktok-nav__live-badge">LIVE</span>
                    </div>

                    {/* Center: Tabs */}
                    <div className="ttk-tiktok-nav__center">
                        <span 
                            className="ttk-tiktok-nav__tab ttk-tiktok-nav__tab--inactive"
                            onClick={() => onToast && onToast(language === 'en' ? 'Following feed loaded' : 'Umpan Mengikuti dimuat')}
                        >
                            {isEn ? 'Following' : 'Mengikuti'}
                        </span>
                        <div className="ttk-tiktok-nav__tab ttk-tiktok-nav__tab--active">
                            <span>{isEn ? 'For You' : 'Untuk Anda'}</span>
                            <div className="ttk-tiktok-nav__active-line" />
                        </div>
                    </div>

                    {/* Right: Search icon */}
                    <div className="ttk-tiktok-nav__right" onClick={() => onToast && onToast(language === 'en' ? 'Search feature active' : 'Fitur pencarian aktif')}>
                        <i className="fas fa-search" />
                    </div>
                </div>
            </div>

            {/* Photo opening card designed like a real TikTok video layout (pembuka pakai foto opening seperti tiktok biasa) */}
            <Reveal variant="zoom" delay={100}>
                <div className="ttk-live__container" style={{ aspectRatio: '9/14', height: 'auto', minHeight: '480px', margin: '0 15px' }}>
                    {globalShowPhotos && openingImages.length > 0 ? (
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                            positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                            zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                            className="absolute inset-0 w-full h-full z-0"
                            imgClassName="absolute inset-0 w-full h-full object-cover filter brightness-[0.65]"
                        />
                    ) : (
                        <div className="ttk-live__stream-bg" style={{ background: 'linear-gradient(135deg, #09090b 0%, #161823 100%)' }} />
                    )}
                    <div className="ttk-cover__bg-overlay" style={{ background: 'linear-gradient(0deg, rgba(1,1,1,0.95) 0%, rgba(1,1,1,0.3) 60%, rgba(1,1,1,0.5) 100%)' }} />
                    
                    {/* Top indicator post header */}
                    <div className="ttk-live__overlay-top">
                        <div className="ttk-live__badge-box">
                            <span className="ttk-live__badge" style={{ backgroundColor: '#FE2C55', animation: 'ttk-pulse 1.2s infinite' }}>LIVE</span>
                            <span className="ttk-live__viewers"><i className="far fa-heart" style={{ marginRight: 3 }} /> 99.9K</span>
                        </div>
                        <span className="ttk-live__host-name">@announcement</span>
                    </div>

                    {/* Captions overlayed inside the vertical image exactly like a real TikTok! */}
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', right: '15px', zIndex: 3, textAlign: 'left' }}>
                        {/* TikTok User handle verified block */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>@wedding_announcement</span>
                            <i className="fas fa-check-circle" style={{ color: '#20d5ec', fontSize: '11px' }} />
                        </div>

                        {/* The Wedding of caption */}
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                            {isEn ? `The Wedding of ${coupleName}` : `Pernikahan dari ${coupleName}`}
                        </div>

                        {invitation?.opening_ayat && (
                            <div style={{ marginBottom: 10, background: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p className="ttk-opening__ayat" style={{ fontSize: '14px', fontFamily: 'serif', direction: 'rtl', margin: '0 0 6px 0', textAlign: 'right', color: '#fff' }}>
                                    {invitation.opening_ayat}
                                </p>
                                {invitation?.opening_ayat_translation && !isIdenticalQuote && (
                                    <p className="ttk-opening__ayat" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', margin: 0, lineStyle: 'normal' }}>
                                        "{invitation.opening_ayat_translation}"
                                    </p>
                                )}
                                {invitation?.opening_ayat_source && (
                                    <div className="ttk-opening__source" style={{ fontSize: '9px', color: 'var(--ttk-cyan)', margin: '4px 0 0 0', fontWeight: 800, textTransform: 'uppercase' }}>
                                        Q.S. {invitation.opening_ayat_source}
                                    </div>
                                )}
                            </div>
                        )}
                        <p style={{ fontSize: '12px', lineHeight: '1.4', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)', margin: '0 0 8px 0' }}>
                            {invitation?.opening_text || "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk merayakan hari bahagia pernikahan kami."}
                        </p>
                        <div style={{ fontSize: '11.5px', color: 'var(--ttk-cyan)', fontWeight: 700 }}>
                            {hashTags}
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   MEMPELAI SECTION (Bride & Groom cards styled like TikTok user profile page)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, invitation, galleries, language, onToast }) {
    const { t } = useTranslation(language);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const [activeProfilePhotoIdx, setActiveProfilePhotoIdx] = useState(null);
    const [likedProfiles, setLikedProfiles] = useState({});
    const [bookmarkedProfiles, setBookmarkedProfiles] = useState({});
    const scrollContainerRef = useRef(null);

    const toggleLikeProfile = (idx) => {
        setLikedProfiles(prev => ({ ...prev, [idx]: !prev[idx] }));
    };
    const toggleBookmarkProfile = (idx) => {
        setBookmarkedProfiles(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    useEffect(() => {
        if (activeProfilePhotoIdx !== null && scrollContainerRef.current) {
            const child = scrollContainerRef.current.children[activeProfilePhotoIdx];
            if (child) {
                scrollContainerRef.current.style.scrollSnapType = 'none';
                child.scrollIntoView({ block: 'start' });
                setTimeout(() => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.style.scrollSnapType = 'y mandatory';
                    }
                }, 100);
            }
        }
    }, [activeProfilePhotoIdx]);

    const renderProfile = (person, type) => {
        if (!person || !person.full_name) return null;
        
        const photoUrl = getStorageUrl(person.photo, null);
        const monogramInitial = person.nickname ? person.nickname.charAt(0) : (type === 'groom' ? 'G' : 'B');
        const instagramUser = (person.instagram || '').replace('@', '').trim();
        const father = person.father_name || (type === 'groom' ? 'Groom' : 'Bride');
        const mother = person.mother_name || (type === 'groom' ? 'Groom' : 'Bride');
        const fatherClean = formatParentName(father, isEn ? 'Mr.' : 'Bapak');
        const motherClean = formatParentName(mother, isEn ? 'Mrs.' : 'Ibu');
        const childOrderTranslated = translateChildOrder(person.child_order, person.gender, language);

        return (
            <div className="ttk-profile-card">
                {/* Profile Top Avatar Area */}
                <div 
                    className="ttk-profile-card__avatar-wrap" 
                    onClick={() => setActiveProfilePhotoIdx(type === 'groom' ? 0 : 1)}
                    style={{ cursor: 'pointer' }}
                >
                    {globalShowPhotos && photoUrl ? (
                        <img src={photoUrl} alt={person.nickname} className="ttk-profile-card__avatar" />
                    ) : (
                        <div className="ttk-profile-card__monogram">{monogramInitial}</div>
                    )}
                    <div className="ttk-profile-card__badge">
                        <i className="fas fa-check" />
                    </div>
                </div>

                {/* Profile Meta Details */}
                <h3 className="ttk-profile-card__name">{person.full_name}</h3>
                <div className="ttk-profile-card__handle">@{person.nickname?.toLowerCase() || 'featured'}</div>

                {/* TikTok style profile follow buttons mockup */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 15 }}>
                    {instagramUser && (
                        <button
                            onClick={() => window.open(`https://instagram.com/${instagramUser}`, '_blank')}
                            className="ttk-btn-primary"
                            style={{ padding: '5px 16px', fontSize: 11, borderRadius: 4, boxShadow: 'none' }}
                            type="button"
                        >
                            <i className="fab fa-instagram" /> Instagram
                        </button>
                    )}
                    <button
                        className="ttk-btn-copy"
                        style={{ border: '1px solid var(--ttk-border)', borderRadius: 4, padding: '5px 16px', background: 'rgba(255,255,255,0.05)' }}
                        type="button"
                    >
                        {isEn ? 'Message' : 'Pesan'}
                    </button>
                </div>

                {/* Simulated TikTok User Stats */}
                <div className="ttk-profile-card__stats">
                    <div className="ttk-profile-card__stat-item">
                        <span className="ttk-profile-card__stat-val">128</span>
                        <span className="ttk-profile-card__stat-lbl">{isEn ? 'Following' : 'Mengikuti'}</span>
                    </div>
                    <div className="ttk-profile-card__stat-item">
                        <span className="ttk-profile-card__stat-val">2.4M</span>
                        <span className="ttk-profile-card__stat-lbl">{isEn ? 'Followers' : 'Pengikut'}</span>
                    </div>
                    <div className="ttk-profile-card__stat-item">
                        <span className="ttk-profile-card__stat-val">99K</span>
                        <span className="ttk-profile-card__stat-lbl">Likes</span>
                    </div>
                </div>

                {/* Bio text REMOVED per user feedback ("bio tidak perlu, cukup pakai anak ke dan nama ortu") */}

                {/* Family sign-off */}
                <div className="ttk-profile-card__parents" style={{ marginBottom: 5 }}>
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, color: 'var(--ttk-cyan)', marginBottom: 4 }}>
                        {childOrderTranslated}
                    </div>
                    <div style={{ fontSize: 13, color: '#fff' }}>
                        {fatherClean} & {motherClean}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="ttk-section" id="bride_groom">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">🌟</div>
                <div className="ttk-card__post-handle">meet_the_stars</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'The Couple' : 'Mempelai'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Introducing the stars of this day' : 'Dua insan yang dipersatukan dalam cinta'}</p>
            </Reveal>

            <div className="ttk-couple__container">
                <Reveal variant="left" delay={100}>
                    {renderProfile(groom, 'groom')}
                </Reveal>
                <Reveal variant="right" delay={150}>
                    {renderProfile(bride, 'bride')}
                </Reveal>
            </div>

            {activeProfilePhotoIdx !== null && (
                <div className="ttk-gallery-fullscreen-overlay">
                    <div className="ttk-gallery-fullscreen-close" onClick={() => setActiveProfilePhotoIdx(null)}>
                        <i className="fas fa-arrow-left" />
                    </div>
                    
                    <div className="ttk-gallery-fullscreen-scroll-container" ref={scrollContainerRef}>
                        {/* Groom slide */}
                        {groom.full_name && (
                            <div className="ttk-gallery-fullscreen-slide">
                                <img src={getStorageUrl(groom.photo, '')} className="ttk-gallery-fullscreen-img" alt={groom.full_name} />
                                
                                {/* Sidebar actions */}
                                <div className="ttk-gallery-sidebar">
                                    <div className="ttk-gallery-sidebar__action" onClick={() => toggleLikeProfile(0)}>
                                        <div className={`ttk-gallery-sidebar__circle ${likedProfiles[0] ? 'liked' : ''}`}>
                                            <i className="fas fa-heart" />
                                        </div>
                                        <span>{likedProfiles[0] ? '2.5M' : '2.4M'}</span>
                                    </div>
                                    <div className="ttk-gallery-sidebar__action" onClick={() => toggleBookmarkProfile(0)}>
                                        <div className={`ttk-gallery-sidebar__circle ${bookmarkedProfiles[0] ? 'bookmarked' : ''}`}>
                                            <i className="fas fa-bookmark" />
                                        </div>
                                        <span>{bookmarkedProfiles[0] ? '12.5K' : '12.4K'}</span>
                                    </div>
                                    <div className="ttk-gallery-sidebar__action" onClick={() => {
                                        if (navigator.clipboard && navigator.clipboard.writeText) {
                                            navigator.clipboard.writeText(window.location.href);
                                        }
                                        onToast ? onToast('Link disalin! 📋') : alert('Link disalin! 📋');
                                    }}>
                                        <div className="ttk-gallery-sidebar__circle">
                                            <i className="fas fa-share" />
                                        </div>
                                        <span>Share</span>
                                    </div>
                                </div>
                                
                                {/* Caption Box */}
                                <div className="ttk-gallery-caption-box">
                                    <div className="ttk-gallery-user-row">
                                        <div className="ttk-gallery-user-avatar">🤵</div>
                                        <span className="ttk-gallery-username">@{groom.nickname?.toLowerCase() || 'groom'}</span>
                                        <i className="fas fa-check-circle ttk-gallery-verified-badge" />
                                    </div>
                                    <p className="ttk-gallery-desc">
                                        {groom.full_name}, {translateChildOrder(groom.child_order, groom.gender, language)} dari {formatParentName(groom.father_name, isEn ? 'Mr.' : 'Bapak')} &amp; {formatParentName(groom.mother_name, isEn ? 'Mrs.' : 'Ibu')}. 💍✨
                                    </p>
                                    <div className="ttk-gallery-tags">#groom #weddingday #happycouple</div>
                                    <div className="ttk-gallery-music-row">
                                        <i className="fas fa-music" />
                                        <div className="ttk-gallery-music-scroll">
                                            <div className="ttk-gallery-music-text">Original Sound - @{groom.nickname?.toLowerCase() || 'groom'}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Spinning disc */}
                                <div className="ttk-gallery-music-disc">
                                    <div className="ttk-gallery-music-disc-inner" />
                                </div>
                            </div>
                        )}

                        {/* Bride slide */}
                        {bride.full_name && (
                            <div className="ttk-gallery-fullscreen-slide">
                                <img src={getStorageUrl(bride.photo, '')} className="ttk-gallery-fullscreen-img" alt={bride.full_name} />
                                
                                {/* Sidebar actions */}
                                <div className="ttk-gallery-sidebar">
                                    <div className="ttk-gallery-sidebar__action" onClick={() => toggleLikeProfile(1)}>
                                        <div className={`ttk-gallery-sidebar__circle ${likedProfiles[1] ? 'liked' : ''}`}>
                                            <i className="fas fa-heart" />
                                        </div>
                                        <span>{likedProfiles[1] ? '1.8M' : '1.7M'}</span>
                                    </div>
                                    <div className="ttk-gallery-sidebar__action" onClick={() => toggleBookmarkProfile(1)}>
                                        <div className={`ttk-gallery-sidebar__circle ${bookmarkedProfiles[1] ? 'bookmarked' : ''}`}>
                                            <i className="fas fa-bookmark" />
                                        </div>
                                        <span>{bookmarkedProfiles[1] ? '8.5K' : '8.4K'}</span>
                                    </div>
                                    <div className="ttk-gallery-sidebar__action" onClick={() => {
                                        if (navigator.clipboard && navigator.clipboard.writeText) {
                                            navigator.clipboard.writeText(window.location.href);
                                        }
                                        onToast ? onToast('Link disalin! 📋') : alert('Link disalin! 📋');
                                    }}>
                                        <div className="ttk-gallery-sidebar__circle">
                                            <i className="fas fa-share" />
                                        </div>
                                        <span>Share</span>
                                    </div>
                                </div>
                                
                                {/* Caption Box */}
                                <div className="ttk-gallery-caption-box">
                                    <div className="ttk-gallery-user-row">
                                        <div className="ttk-gallery-user-avatar">👰</div>
                                        <span className="ttk-gallery-username">@{bride.nickname?.toLowerCase() || 'bride'}</span>
                                        <i className="fas fa-check-circle ttk-gallery-verified-badge" />
                                    </div>
                                    <p className="ttk-gallery-desc">
                                        {bride.full_name}, {translateChildOrder(bride.child_order, bride.gender, language)} dari {formatParentName(bride.father_name, isEn ? 'Mr.' : 'Bapak')} &amp; {formatParentName(bride.mother_name, isEn ? 'Mrs.' : 'Ibu')}. 💐✨
                                    </p>
                                    <div className="ttk-gallery-tags">#bride #weddingday #beautifulinwhite</div>
                                    <div className="ttk-gallery-music-row">
                                        <i className="fas fa-music" />
                                        <div className="ttk-gallery-music-scroll">
                                            <div className="ttk-gallery-music-text">Original Sound - @{bride.nickname?.toLowerCase() || 'bride'}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Spinning disc */}
                                <div className="ttk-gallery-music-disc">
                                    <div className="ttk-gallery-music-disc-inner" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER INSIDE EVENT SECTION
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate, language }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const target = new Date(targetDate.replace(/-/g, '/')).getTime();
        if (isNaN(target)) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="ttk-countdown">
            <div className="ttk-countdown__box">
                <span className="ttk-countdown__num">{pad2(timeLeft.days)}</span>
                <span className="ttk-countdown__lbl">Days</span>
            </div>
            <div className="ttk-countdown__box">
                <span className="ttk-countdown__num">{pad2(timeLeft.hours)}</span>
                <span className="ttk-countdown__lbl">Hrs</span>
            </div>
            <div className="ttk-countdown__box">
                <span className="ttk-countdown__num">{pad2(timeLeft.minutes)}</span>
                <span className="ttk-countdown__lbl">Min</span>
            </div>
            <div className="ttk-countdown__box">
                <span className="ttk-countdown__num">{pad2(timeLeft.seconds)}</span>
                <span className="ttk-countdown__lbl">Sec</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION (Countdown integrated inside the same event section)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, language, sections }) {
    const { t } = useTranslation(language);
    const eventList = safeArr(events);

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const showCountdown = parseBool(invitation?.show_countdown, true);
    const showCountdownInEvent = (() => {
        const targetDate = invitation?.countdown_target_date;
        if (!targetDate || !showCountdown) return false;
        
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    })();

    return (
        <section className="ttk-section" id="event">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">📅</div>
                <div className="ttk-card__post-handle">save_the_date_events</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'The Events' : 'Acara'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Join us in our celebrations' : 'Waktu dan lokasi perayaan pernikahan'}</p>
            </Reveal>

            {/* Countdown is STRICTLY integrated at top of event section */}
            {showCountdownInEvent && (
                <Reveal variant="zoom">
                    <div style={{ textAlign: 'center', marginBottom: 15 }}>
                        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ttk-gray)', fontWeight: 700, marginBottom: 5 }}>
                            {isEn ? 'Countdown to Joy' : 'Hitung Mundur Hari Bahagia'}
                        </div>
                        <CountdownTimer targetDate={invitation.countdown_target_date} language={language} />
                    </div>
                </Reveal>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {eventList.map((evt, idx) => {
                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date);
                    
                    return (
                        <Reveal key={evt.id || idx} variant={idx % 2 === 0 ? 'left' : 'right'} delay={100 * idx}>
                            <div className="ttk-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--ttk-white)', margin: 0 }}>
                                        {evt.event_name}
                                    </h3>
                                    {evt.is_primary && (
                                        <span style={{ fontSize: 8, padding: '2px 5px', backgroundColor: 'var(--ttk-red)', color: '#fff', borderRadius: 3, fontWeight: 700, textTransform: 'uppercase' }}>
                                            Primary
                                        </span>
                                    )}
                                </div>

                                <div className="ttk-event__time">
                                    <i className="far fa-calendar-alt" />
                                    <span>{dayName}, {dayNum} {monthName} {year}</span>
                                </div>

                                <div className="ttk-event__time" style={{ color: 'var(--ttk-red)' }}>
                                    <i className="far fa-clock" />
                                    <span>{formatTime(evt.start_time)} - {evt.end_time === 'Selesai' ? (isEn ? 'End' : 'Selesai') : formatTime(evt.end_time)} {evt.timezone || 'WIB'}</span>
                                </div>

                                <div className="ttk-event__venue">
                                    <i className="fas fa-map-marker-alt" style={{ marginRight: 6, color: 'var(--ttk-cyan)' }} />
                                    {evt.venue_name}
                                </div>

                                <p className="ttk-event__address">{evt.venue_address}</p>

                                {evt.gmaps_link && (
                                    <button
                                        onClick={() => window.open(evt.gmaps_link, '_blank')}
                                        className="ttk-btn-primary"
                                        style={{ width: '100%', justifyContent: 'center', fontSize: 12.5, padding: '8px' }}
                                        type="button"
                                    >
                                        <i className="fas fa-map-marked-alt" /> {isEn ? 'Open Google Maps' : 'Petunjuk Lokasi'}
                                    </button>
                                )}
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION (Styled like a Blinking TikTok LIVE feed)
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, language, onToast }) {
    const { t } = useTranslation(language);
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

    // STRICTLY AUTO-HIDE if no streaming links are active
    if (streamsList.length === 0) return null;

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const handleSendGift = (giftName) => {
        onToast(isEn ? `Sent a mock ${giftName}! 🎁` : `Kirim kado ${giftName} sukses! 🌹`);
    };

    return (
        <section className="ttk-section" id="livestream">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar" style={{ background: 'var(--ttk-red)' }}>🔴</div>
                <div className="ttk-card__post-handle">live_broadcast</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
            </Reveal>

            <Reveal variant="zoom">
                <div className="ttk-card" style={{ padding: 12 }}>
                    
                    {/* Simulated TikTok LIVE screen mockup */}
                    <div className="ttk-live__container">
                        <div 
                            className="ttk-live__stream-bg" 
                            style={{ backgroundImage: `url(${getStorageUrl(invitation?.opening_image || invitation?.cover_image, 'https://picsum.photos/seed/live/640/360')})` }}
                        />
                        
                        {/* Top HUD bar */}
                        <div className="ttk-live__overlay-top">
                            <div className="ttk-live__badge-box">
                                <span className="ttk-live__badge">LIVE</span>
                                <span className="ttk-live__viewers"><i className="far fa-user" /> 12.5K</span>
                            </div>
                            <span className="ttk-live__host-name">@{invitation?.slug || 'wedding'}</span>
                        </div>

                        {/* Transparent Comment overlay */}
                        <div className="ttk-live__overlay-comments">
                            <div className="ttk-live__comment-pill">
                                <span className="ttk-live__comment-author">Budi</span> {isEn ? 'Congrats guys!' : 'Selamat ya!'}
                            </div>
                            <div className="ttk-live__comment-pill">
                                <span className="ttk-live__comment-author">Siti</span> {isEn ? 'Looking gorgeous!' : 'Mempelainya cantik sekali!'}
                            </div>
                            <div className="ttk-live__comment-pill">
                                <span className="ttk-live__comment-author">Joko</span> {isEn ? 'Best wishes' : 'Semoga sakinah mawaddah wa rahmah'}
                            </div>
                        </div>

                        {/* Gift Send overlays */}
                        <div className="ttk-live__overlay-bottom">
                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                                {isEn ? 'Send blessings:' : 'Beri hadiah virtual:'}
                            </div>
                            <div className="ttk-live__gifts-box">
                                <button onClick={() => handleSendGift('Rose 🌹')} className="ttk-live__gift-btn" title="Kirim Mawar" type="button">🌹</button>
                                <button onClick={() => handleSendGift('Heart 💖')} className="ttk-live__gift-btn" title="Kirim Love" type="button">💖</button>
                                <button onClick={() => handleSendGift('Gift 🎁')} className="ttk-live__gift-btn" title="Kirim Kado" type="button">🎁</button>
                            </div>
                        </div>
                    </div>

                    <p style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 15 }}>
                        {isEn ? 'Tap below to watch our live broadcast channel:' : 'Saksikan siaran langsung pernikahan kami dengan mengetuk tombol di bawah:'}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {streamsList.map((stream, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => window.open(stream.url, '_blank')}
                                className="ttk-btn-primary"
                                style={{ justifyContent: 'center', fontSize: 13, padding: '10px' }}
                            >
                                <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (Timeline post mockup styled like TikTok chronological feeds)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, language }) {
    const { t } = useTranslation(language);
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);

    if (stories.length === 0) return null;

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    return (
        <section className="ttk-section" id="love_story">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">📖</div>
                <div className="ttk-card__post-handle">love_chronicles</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Our Story' : 'Kisah Cinta'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Our sweet journey' : 'Perjalanan kasih kami berdua'}</p>
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {stories.map((story, idx) => (
                    <Reveal key={story.id || idx} variant={idx % 2 === 0 ? 'left' : 'right'} delay={100 * idx}>
                        <div className="ttk-story__post">
                            <div className="ttk-story__header">
                                <div className="ttk-story__avatar">
                                    <i className="fas fa-heart" style={{ fontSize: 12, color: '#fff' }} />
                                </div>
                                <div className="ttk-story__meta">
                                    <span className="ttk-story__author">{story.title}</span>
                                    <span className="ttk-story__date">
                                        <i className="far fa-clock" style={{ marginRight: 4 }} />
                                        {formatDate(story.story_date, language)}
                                    </span>
                                </div>
                            </div>
                            <div className="ttk-story__body">
                                {story.description}
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   GALLERY SECTION (Excluded in hide_photos mode)
   ═══════════════════════════════════════ */
function GallerySection({ galleries, language, onToast }) {
    const { t } = useTranslation(language);
    const photos = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);

    if (photos.length === 0 || !globalShowPhotos) return null;

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const [activePhotoIdx, setActivePhotoIdx] = useState(null);
    const [likedPhotos, setLikedPhotos] = useState({});
    const [bookmarkedPhotos, setBookmarkedPhotos] = useState({});
    const scrollContainerRef = useRef(null);

    const toggleLike = (idx) => {
        setLikedPhotos(prev => ({ ...prev, [idx]: !prev[idx] }));
    };
    const toggleBookmark = (idx) => {
        setBookmarkedPhotos(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const romanticCaptions = [
        "Menghitung hari bahagia bersama selamanya. 💍✨",
        "Momen manis terindah yang terabadikan dalam cinta. ❤️",
        "Dua hati, satu cinta, melangkah bersama selamanya. 🌹",
        "Dalam tatapmu, kutemukan dunia masa depanku. 💫💖",
        "Setiap senyuman adalah bab baru kisah bahagia kita. ✨🏡",
        "Bersamamu, perjalanan ini terasa sangat sempurna. 🗺️💞",
        "Cinta bukanlah tentang saling menatap, tapi melangkah ke arah yang sama. 🥂"
    ];

    useEffect(() => {
        if (activePhotoIdx !== null && scrollContainerRef.current) {
            const child = scrollContainerRef.current.children[activePhotoIdx];
            if (child) {
                scrollContainerRef.current.style.scrollSnapType = 'none';
                child.scrollIntoView({ block: 'start' });
                setTimeout(() => {
                    if (scrollContainerRef.current) {
                        scrollContainerRef.current.style.scrollSnapType = 'y mandatory';
                    }
                }, 100);
            }
        }
    }, [activePhotoIdx]);

    return (
        <section className="ttk-section" id="gallery">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">📸</div>
                <div className="ttk-card__post-handle">prewedding_diaries</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Our Gallery' : 'Galeri'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Captured moments' : 'Momen romantis yang terabadikan'}</p>
            </Reveal>

            <Reveal variant="zoom">
                <div className="ttk-gallery__grid">
                    {photos.map((ph, idx) => {
                        const imgUrl = getStorageUrl(ph.image_url, '');
                        if (!imgUrl) return null;

                        return (
                            <div key={ph.id || idx} className="ttk-gallery__item" onClick={() => setActivePhotoIdx(idx)} style={{ cursor: 'pointer' }}>
                                <img src={imgUrl} alt={ph.caption || 'Pre-wedding'} />
                            </div>
                        );
                    })}
                </div>
            </Reveal>

            {activePhotoIdx !== null && (
                <div className="ttk-gallery-fullscreen-overlay">
                    <div className="ttk-gallery-fullscreen-close" onClick={() => setActivePhotoIdx(null)}>
                        <i className="fas fa-arrow-left" />
                    </div>
                    
                    <div className="ttk-gallery-fullscreen-scroll-container" ref={scrollContainerRef}>
                        {photos.map((ph, idx) => {
                            const imgUrl = getStorageUrl(ph.image_url, '');
                            if (!imgUrl) return null;
                            const captionText = ph.caption || romanticCaptions[idx % romanticCaptions.length];
                            
                            return (
                                <div key={ph.id || idx} className="ttk-gallery-fullscreen-slide">
                                    <img src={imgUrl} className="ttk-gallery-fullscreen-img" alt={ph.caption || 'Pre-wedding'} />
                                    
                                    {/* Sidebar actions */}
                                    <div className="ttk-gallery-sidebar">
                                        <div className="ttk-gallery-sidebar__action" onClick={() => toggleLike(idx)}>
                                            <div className={`ttk-gallery-sidebar__circle ${likedPhotos[idx] ? 'liked' : ''}`}>
                                                <i className="fas fa-heart" />
                                            </div>
                                            <span>{likedPhotos[idx] ? '1,501' : '1,500'}</span>
                                        </div>
                                        <div className="ttk-gallery-sidebar__action" onClick={() => toggleBookmark(idx)}>
                                            <div className={`ttk-gallery-sidebar__circle ${bookmarkedPhotos[idx] ? 'bookmarked' : ''}`}>
                                                <i className="fas fa-bookmark" />
                                            </div>
                                            <span>{bookmarkedPhotos[idx] ? '681' : '680'}</span>
                                        </div>
                                        <div className="ttk-gallery-sidebar__action" onClick={() => {
                                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                                navigator.clipboard.writeText(window.location.href);
                                            }
                                            onToast ? onToast('Link disalin! 📋') : alert('Link disalin! 📋');
                                        }}>
                                            <div className="ttk-gallery-sidebar__circle">
                                                <i className="fas fa-share" />
                                            </div>
                                            <span>Share</span>
                                        </div>
                                    </div>
                                    
                                    {/* Caption Box */}
                                    <div className="ttk-gallery-caption-box">
                                        <div className="ttk-gallery-user-row">
                                            <div className="ttk-gallery-user-avatar">📸</div>
                                            <span className="ttk-gallery-username">prewedding_diaries</span>
                                            <i className="fas fa-check-circle ttk-gallery-verified-badge" />
                                        </div>
                                        <p className="ttk-gallery-desc">{captionText}</p>
                                        <div className="ttk-gallery-tags">#prewedding #wedding #love #viral</div>
                                        <div className="ttk-gallery-music-row">
                                            <i className="fas fa-music" />
                                            <div className="ttk-gallery-music-scroll">
                                                <div className="ttk-gallery-music-text">Original Sound - prewedding_diaries</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Spinning disc */}
                                    <div className="ttk-gallery-music-disc">
                                        <div className="ttk-gallery-music-disc-inner" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK SECTION (Equipped with dynamic Safari copy clipboard text-area fallback)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, language, onToast }) {
    const { t } = useTranslation(language);
    const accounts = safeArr(bankAccounts).sort((a, b) => a.sort_order - b.sort_order);

    if (accounts.length === 0) return null;

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const handleCopy = (text) => {
        if (!text) return;
        
        const performSuccess = () => {
            onToast(isEn ? 'Copied account number! 📋' : 'Nomor rekening disalin! 📋');
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(performSuccess)
                .catch(() => {
                    fallbackCopy(text);
                    performSuccess();
                });
        } else {
            fallbackCopy(text);
            performSuccess();
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
        <section className="ttk-section" id="bank">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">💳</div>
                <div className="ttk-card__post-handle">digital_giftbox</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Wedding Gift' : 'Amplop Digital'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Send your blessings virtually' : 'Kirimkan berkah kado pernikahan secara digital'}</p>
            </Reveal>

            <Reveal variant="zoom">
                <div className="ttk-card">
                    <p style={{ fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 15 }}>
                        {isEn ? 'Your prayers & presence are the greatest gifts. But if you wish to send virtual tokens of love, you can transfer to:' : 'Doa restu Anda adalah karunia terindah. Namun bagi yang ingin mengirimkan tanda kasih virtual, silakan kirimkan ke rekening berikut:'}
                    </p>

                    {accounts.map((acc, idx) => (
                        <div key={acc.id || idx} className="ttk-bank__card">
                            <div className="ttk-bank__bankname">{acc.bank_name}</div>
                            <div className="ttk-bank__number">{acc.account_number}</div>
                            <div className="ttk-bank__holder">{isEn ? 'A/N' : 'Atas Nama'} {acc.account_name}</div>
                            
                            <button
                                onClick={() => handleCopy(acc.account_number)}
                                className="ttk-btn-copy"
                                type="button"
                            >
                                <span><i className="far fa-copy" /> Copy Number</span>
                            </button>
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   UNIFIED FORM RSVP & WISHES SECTION (ALWAYS EXPANDED RSVP - rsvp selalu ada)
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, language, onToast }) {
    const { t } = useTranslation(language);
    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || '';

    const defaultAttendance = 'hadir';

    // Setup Inertia form submission
    const { data, setData, post, processing, errors, reset } = useForm({
        sender_name: guestName,
        attendance: defaultAttendance,
        number_of_guests: 1,
        message: '',
    });

    const [localWishes, setLocalWishes] = useState([]);
    const [likes, setLikes] = useState({});

    // Load initial 5 wishes
    useEffect(() => {
        const sorted = safeArr(wishes)
            .sort((a, b) => new Date(b.created_at || b.id || 0) - new Date(a.created_at || a.id || 0))
            .slice(0, 5); // STRICT blueprint rule: cap at last 5 wishes
        setLocalWishes(sorted);
    }, [wishes]);

    const handleFormChange = (key, value) => {
        setData(key, value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        post(`/u/${invitation.slug}/rsvp`, {
            preserveScroll: true,
            onSuccess: (page) => {
                onToast(isEn ? 'Comment posted! 💬' : 'Ucapan berhasil terkirim! 💬');
                // Sync wishes
                if (page.props.wishes) {
                    const sorted = safeArr(page.props.wishes)
                        .sort((a, b) => new Date(b.created_at || b.id || 0) - new Date(a.created_at || a.id || 0))
                        .slice(0, 5);
                    setLocalWishes(sorted);
                } else {
                    const newWish = {
                        sender_name: data.sender_name || 'Tamu Undangan',
                        attendance: data.attendance,
                        message: data.message,
                        created_at: new Date().toISOString(),
                    };
                    setLocalWishes(prev => [newWish, ...prev].slice(0, 5));
                }
                reset('message');
            },
        });
    };

    const toggleLike = (idx) => {
        const currentlyLiked = likes[idx];
        setLikes(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
        if (!currentlyLiked) {
            onToast(isEn ? 'Liked a comment! ❤️' : 'Menyukai ucapan! ❤️');
        }
    };

    return (
        <section className="ttk-section" id="rsvp">
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">💬</div>
                <div className="ttk-card__post-handle">comment_section</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Guest Comments' : 'Konfirmasi Kehadiran'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Send RSVP and prayers' : 'Isi kehadiran dan kirimkan ucapan doa restu'}</p>
            </Reveal>

            {/* Comment Area container - Form is ALWAYS EXPANDED (fitur rsvp selalu ada) */}
            <Reveal variant="zoom">
                <div className="ttk-card" style={{ padding: '14px 14px' }}>
                    <div className="ttk-comments__title">
                        <span>{isEn ? 'CONVERSATION FEED' : 'KOLOM DOA & KEHADIRAN'}</span>
                        <span style={{ color: 'var(--ttk-red)', fontSize: 11 }}>
                            {localWishes.length} {isEn ? 'comments' : 'ucapan'}
                        </span>
                    </div>

                    {/* ALWAYS EXPANDED Form (fitur rsvp selalu tampil langsung) */}
                    {enableRsvp && (
                        <form onSubmit={handleFormSubmit} style={{ marginBottom: 20, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="ttk-form__group">
                                <label className="ttk-form__label">{isEn ? 'Full Name' : 'Nama Lengkap'}</label>
                                <input
                                    type="text"
                                    value={data.sender_name}
                                    onChange={e => handleFormChange('sender_name', e.target.value)}
                                    placeholder={isEn ? 'Your Name' : 'Nama Anda'}
                                    className="ttk-form__input"
                                    required
                                    disabled={processing}
                                />
                                {errors.sender_name && <span style={{ fontSize: 10, color: 'var(--ttk-red)' }}>{errors.sender_name}</span>}
                            </div>

                            <div className="ttk-form__group">
                                <label className="ttk-form__label">{isEn ? 'Attendance Status' : 'Kehadiran'}</label>
                                <select
                                    value={data.attendance}
                                    onChange={e => handleFormChange('attendance', e.target.value)}
                                    className="ttk-form__select"
                                    disabled={processing}
                                >
                                    <option value="hadir">{isEn ? 'Hadir (Attending)' : 'Hadir'}</option>
                                    <option value="tidak_hadir">{isEn ? 'Tidak Hadir (Not Attending)' : 'Tidak Hadir'}</option>
                                    <option value="belum_pasti">{isEn ? 'Belum Pasti (Uncertain)' : 'Belum Pasti'}</option>
                                </select>
                                {errors.attendance && <span style={{ fontSize: 10, color: 'var(--ttk-red)' }}>{errors.attendance}</span>}
                            </div>

                            {data.attendance === 'hadir' && (
                                <div className="ttk-form__group">
                                    <label className="ttk-form__label">{isEn ? 'Number of Guests' : 'Jumlah Orang'}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={data.number_of_guests}
                                        onChange={e => handleFormChange('number_of_guests', parseInt(e.target.value) || 1)}
                                        className="ttk-form__input"
                                        required
                                        disabled={processing}
                                    />
                                    {errors.number_of_guests && <span style={{ fontSize: 10, color: 'var(--ttk-red)' }}>{errors.number_of_guests}</span>}
                                </div>
                            )}

                            <div className="ttk-form__group">
                                <label className="ttk-form__label">{isEn ? 'Blessing Message' : 'Doa Restu'}</label>
                                <textarea
                                    value={data.message}
                                    onChange={e => handleFormChange('message', e.target.value)}
                                    placeholder={isEn ? 'Write your comment...' : 'Tuliskan ucapan selamat / doa restu...'}
                                    className="ttk-form__textarea"
                                    rows="3"
                                    required
                                    disabled={processing}
                                />
                                {errors.message && <span style={{ fontSize: 10, color: 'var(--ttk-red)' }}>{errors.message}</span>}
                            </div>

                            <button
                                type="submit"
                                className="ttk-btn-primary"
                                style={{ width: '100%', justifyContent: 'center', fontSize: 12.5 }}
                                disabled={processing}
                            >
                                <i className="fas fa-paper-plane" /> {isEn ? 'Post Comment' : 'Kirim Ucapan'}
                            </button>
                        </form>
                    )}

                    {/* Wishes Feed styled exactly like TikTok comment list */}
                    <div className="ttk-comments__feed">
                        {localWishes.length === 0 ? (
                            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--ttk-gray)', margin: '15px 0' }}>
                                {isEn ? 'No comments yet. Be the first to post!' : 'Belum ada ucapan. Jadilah yang pertama!'}
                            </p>
                        ) : (
                            localWishes.map((w, idx) => {
                                const initials = w.sender_name ? w.sender_name.substring(0, 2).toUpperCase() : 'TAMU';
                                const timeStr = w.created_at ? new Date(w.created_at).toLocaleDateString() : 'Baru saja';
                                const hasLiked = !!likes[idx];

                                return (
                                    <div key={idx} className="ttk-comment">
                                        <div className="ttk-comment__avatar">{initials}</div>
                                        <div className="ttk-comment__content">
                                            <div className="ttk-comment__name">
                                                {w.sender_name}
                                                {w.attendance && (
                                                    <span className={`ttk-comment__attendance-tag ttk-comment__attendance-tag--${w.attendance === 'hadir' ? 'hadir' : 'tidak'}`}>
                                                        {w.attendance === 'hadir' ? (isEn ? 'Attending' : 'Hadir') : (isEn ? 'Absent' : 'Absen')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="ttk-comment__text">{w.message}</p>
                                            <div className="ttk-comment__meta">
                                                <span>{timeStr}</span>
                                                <span style={{ marginLeft: 15, cursor: 'pointer', fontWeight: 600 }}>Reply</span>
                                            </div>
                                        </div>

                                        {/* Mock like icon on right side */}
                                        <div className="ttk-comment__like" onClick={() => toggleLike(idx)}>
                                            <i className={`fas fa-heart ${hasLiked ? 'liked' : ''}`} />
                                            <span>{hasLiked ? '1' : '0'}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (Dynamic parent labels + dynamic Reseller Watermark)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, language }) {
    const { t } = useTranslation(language);
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    // Reseller dynamic watermark lookup
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <section className="ttk-section" id="closing" style={{ paddingBottom: '90px' }}>
            {/* Post Header */}
            <div className="ttk-card__post-header">
                <div className="ttk-card__post-avatar">💖</div>
                <div className="ttk-card__post-handle">wedding_closing</div>
                <i className="fas fa-check-circle ttk-card__post-badge" />
            </div>

            <Reveal variant="up">
                <h2 className="ttk-section-title">{isEn ? 'Thank You' : 'Penutup'}</h2>
                <p className="ttk-section-subtitle">{isEn ? 'Looking forward to see you' : 'Terima kasih atas segala doa restu'}</p>
            </Reveal>

            <Reveal variant="zoom">
                <div className="ttk-card ttk-closing__card">
                    <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
                        {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu di hari bahagia kami.'}
                    </p>

                    <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--ttk-cyan)', fontWeight: 700, marginBottom: 12 }}>
                        {isEn ? 'Family Signatures' : 'Keluarga Besar'}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' }}>
                        {hasGroomParents && (
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: 2 }}>
                                    {isEn ? 'Groom\'s Family:' : 'Keluarga Mempelai Pria:'}
                                </strong>
                                {isEn ? `Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}
                            </div>
                        )}
                        {hasBrideParents && (
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: 2 }}>
                                    {isEn ? 'Bride\'s Family:' : 'Keluarga Mempelai Wanita:'}
                                </strong>
                                {isEn ? `Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}
                            </div>
                        )}
                    </div>
                </div>
            </Reveal>

            {/* Dynamic brand watermark aligned centrally */}
            <Reveal variant="up" delay={200}>
                <p className="ttk-watermark" style={{ paddingBottom: '30px' }}>
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   TIKTOK BOTTOM NAVIGATION BAR
   ═══════════════════════════════════════ */
function TikTokBottomBar({ activeSection, onNavigate, hasStream, hasGallery, hasStory, hasBank, enableRsvp, language }) {
    const { locale } = useTranslation(language);
    const isEn = locale === 'en';

    // Map categories exactly per user instructions
    const isHome = activeSection === 'opening';
    const isDiscover = activeSection === 'event';
    const isPlus = activeSection === 'gallery';
    const isInbox = activeSection === 'rsvp';
    const isProfile = activeSection === 'bride_groom';

    return (
        <nav className="ttk-bottom-nav">
            {/* Beranda -> Opening */}
            <div onClick={() => onNavigate('opening')} className={`ttk-nav-item ${isHome ? 'is-active' : ''}`}>
                <i className="fas fa-home" />
                <span>{isEn ? 'Home' : 'Beranda'}</span>
            </div>

            {/* Temukan -> Event */}
            <div onClick={() => onNavigate('event')} className={`ttk-nav-item ${isDiscover ? 'is-active' : ''}`}>
                <i className="fas fa-compass" />
                <span>{isEn ? 'Discover' : 'Temukan'}</span>
            </div>

            {/* Center Plus Button -> Gallery */}
            <div onClick={() => onNavigate('gallery')} className={`ttk-nav-item ${isPlus ? 'is-active' : ''}`}>
                <div className="ttk-nav-plus">
                    <i className="fas fa-plus" />
                </div>
            </div>

            {/* Kotak Masuk -> RSVP */}
            <div onClick={() => onNavigate('rsvp')} className={`ttk-nav-item ${isInbox ? 'is-active' : ''}`}>
                <i className="fas fa-comment-alt" />
                <span>{isEn ? 'Inbox' : 'Kotak Masuk'}</span>
            </div>

            {/* Profil -> Mempelai */}
            <div onClick={() => onNavigate('bride_groom')} className={`ttk-nav-item ${isProfile ? 'is-active' : ''}`}>
                <i className="fas fa-user" />
                <span>{isEn ? 'Profile' : 'Profil'}</span>
            </div>
        </nav>
    );
}

/* ═══════════════════════════════════════
   TIKTOK DYNAMIC INDEX COMPONENT (MAIN WRAPPER)
   ═══════════════════════════════════════ */
export default function TikTokTheme(props) {
    const { invitation, sections, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest } = props;
    
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};
    
    const [isOpened, setIsOpened] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [isPlaying, setIsPlaying] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    
    // Slide transition layout indices
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [showQr, setShowQr] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Interactive Toast Notification System state
    const [toastMessage, setToastMessage] = useState(null);
    const [likeCount, setLikeCount] = useState(99999);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(12499);
    const [isFollowed, setIsFollowed] = useState(false); // Manages persistent sidebar red follow badge overlay state (menu samping seperti tiktok)

    const audioRef = useRef(null);
    const slideContainerRef = useRef(null);

    const activeLanguage = invitation?.default_locale || invitation?.language || 'id';

    // Global override toggles setup
    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    globalShowPhotos = parseBool(invitation?.show_photos, true) && !parseBool(invitation?.hide_photos, false);
    globalShowAnimations = parseBool(invitation?.show_animations, true);

    const activeGuest = guest || null;

    // Toast generator helper
    const triggerToast = useCallback((msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 2000);
    }, []);

    // Fullscreen listeners
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

    // Auto-resolve random prewedding photo from gallery to act ascover placeholder in no-photo mode fallback
    const randomGalleryPhoto = useMemo(() => {
        const photos = safeArr(galleries);
        if (photos.length > 0) {
            return getStorageUrl(photos[0].image_url, null);
        }
        return null;
    }, [galleries]);

    // Autoplay config
    const musicAutoplay = parseBool(invitation?.music_autoplay, true);

    const handleOpen = () => {
        setIsOpened(true);
        if (audioRef.current && musicAutoplay) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log('Autoplay blocked by browser:', e));
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    };

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            triggerToast(activeLanguage === 'en' ? 'Music Paused 🔇' : 'Musik Jeda 🔇');
        } else {
            audio.play()
                .then(() => {
                    setIsPlaying(true);
                    triggerToast(activeLanguage === 'en' ? 'Playing Wedding Album 🎵' : 'Memutar Album Pernikahan 🎵');
                })
                .catch((e) => console.log('Play blocked:', e));
        }
    }, [isPlaying, activeLanguage, triggerToast]);

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode.startsWith('slide');

    // Resolve visible sections list
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        const resolved = [];

        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);

            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery' && (!(galleries?.length > 0) || !globalShowPhotos)) return;
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                
                // Wishes standalone is hidden if RSVP is active (merged)
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return;
                }

                if (s.section_key === 'livestream' && !hasStream) return;

                resolved.push(s);
                if (s.section_key === 'event' && hasStream && !dbSorted.some(item => item.section_key === 'livestream')) {
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
            if (galleries?.length > 0 && globalShowPhotos) fallbacks.push({ section_key: 'gallery' });
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
    }, [sections, events, loveStories, galleries, bankAccounts, enableRsvp, enableWishes]);

    // Active slide mapper
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            setActiveSectionId(key);
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

    // ScrollSpy in vertical scroll layout
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

            // Overall scroll progress
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, enableRsvp]);

    // Touch swipe handlers
    const touchStartRef = useRef(null);
    const handleTouchStart = (e) => {
        if (!isSlideMode) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isSlideMode || !touchStartRef.current) return;
        
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (layoutMode === 'slide-h' || layoutMode === 'slide') {
                if (deltaX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (layoutMode === 'slide-v') {
                if (deltaY < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        touchStartRef.current = null;
    };

    // Auto-scroll loop
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) {
                        return 0;
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

    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const jumpToSlide = (idx) => {
        if (idx >= 0 && idx < resolvedSections.length) {
            setActiveSlideIdx(idx);
        }
    };

    const handleNavigationClick = (key) => {
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx !== -1) {
                jumpToSlide(idx);
            }
        } else {
            const el = document.getElementById(key);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Interactive Persistent Sidebar functions (menu samping ini selalu ada ya)
    const handleLikeClick = () => {
        if (isLiked) {
            setLikeCount(prev => prev - 1);
            setIsLiked(false);
            triggerToast(activeLanguage === 'en' ? 'Removed like 💔' : 'Batal menyukai 💔');
        } else {
            setLikeCount(prev => prev + 1);
            setIsLiked(true);
            triggerToast(activeLanguage === 'en' ? 'Thanks for the love! ❤️' : 'Terima kasih atas tanda cinta Anda! ❤️');
        }
    };

    const handleBookmarkClick = () => {
        if (isBookmarked) {
            setBookmarkCount(prev => prev - 1);
            setIsBookmarked(false);
            triggerToast(activeLanguage === 'en' ? 'Removed from favorites 🌟' : 'Batal memfavoritkan 🌟');
        } else {
            setBookmarkCount(prev => prev + 1);
            setIsBookmarked(true);
            triggerToast(activeLanguage === 'en' ? 'Saved to Favorites! 🌟' : 'Disimpan ke Favorit! 🌟');
        }
    };

    const handleCommentSidebarClick = () => {
        handleNavigationClick('rsvp');
        triggerToast(activeLanguage === 'en' ? 'Scrolling to comments 💬' : 'Menuju kolom ucapan 💬');
    };

    const handleShareClick = () => {
        const link = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(link)
                .then(() => triggerToast(activeLanguage === 'en' ? 'Invitation link copied! 🔗' : 'Link undangan berhasil disalin! 🔗'))
                .catch(() => triggerToast('Error copying link'));
        } else {
            const ta = document.createElement('textarea');
            ta.value = link;
            Object.assign(ta.style, { position: 'fixed', opacity: 0 });
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            triggerToast(activeLanguage === 'en' ? 'Invitation link copied! 🔗' : 'Link undangan berhasil disalin! 🔗');
        }
    };

    // Render single sections
    const renderSection = (key) => {
        const sectionProps = { 
            invitation, 
            brideGrooms, 
            events, 
            wishes, 
            galleries, 
            loveStories, 
            bankAccounts, 
            guest, 
            enableRsvp, 
            enableWishes, 
            language: activeLanguage, 
            fallbackPhoto: randomGalleryPhoto,
            onToast: triggerToast,
            sections
        };
        
        switch (key) {
            case 'opening':
                return <OpeningSection key={key} {...sectionProps} />;
            case 'bride_groom':
                return <BrideGroomSection key={key} {...sectionProps} />;
            case 'event':
                return <EventSection key={key} {...sectionProps} />;
            case 'livestream':
                return <LiveStreamingSection key={key} {...sectionProps} />;
            case 'love_story':
                return <LoveStorySection key={key} {...sectionProps} />;
            case 'gallery':
                return <GallerySection key={key} {...sectionProps} />;
            case 'bank':
                return <BankSection key={key} {...sectionProps} />;
            case 'rsvp':
            case 'wishes':
                return <UnifiedFormSection key={key} {...sectionProps} />;
            case 'closing':
                return <ClosingSection key={key} {...sectionProps} />;
            default:
                return null;
        }
    };

    const formatNumberK = (num) => {
        if (num >= 100000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    const fontLinkUrl = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Great+Vibes&display=swap';

    return (
        <ErrorBoundary>
            <link href={fontLinkUrl} rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
            
            {/* Background Audio */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={invitation.music_url} loop />
            )}

            <div className={`ttk-wrapper ${!globalShowAnimations ? 'ttk-no-animations' : ''}`}>
                
                {/* Dynamic Sliding Toast Message */}
                {toastMessage && (
                    <div className="ttk-toast">
                        {toastMessage}
                    </div>
                )}

                {/* ══════ COVER PANEL ══════ */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    language={activeLanguage}
                    fallbackPhoto={randomGalleryPhoto}
                    onToast={triggerToast}
                />

                {/* ══════ MAIN CONTENT ══════ */}
                {isOpened && (
                    <main className={`ttk-main ${isSlideMode ? 'ttk-main--slide' : ''}`}>
                        
                         {/* Interactive Persistent Sidebar on Right Screen (menu samping seperti tiktok) */}
                        <div className="ttk-persistent-sidebar">
                            
                            {/* Profile Monogram Trigger with perfectly positioned '+' sign overlay */}
                            <div className="ttk-cover__action" onClick={() => handleNavigationClick('bride_groom')}>
                                <div className="ttk-cover__action-circle" style={{ width: 42, height: 42, border: '2px solid #fff', background: 'linear-gradient(135deg, var(--ttk-red) 0%, var(--ttk-cyan) 100%)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>
                                        {(groom?.nickname?.charAt(0) || 'B')}{(bride?.nickname?.charAt(0) || 'R')}
                                    </span>
                                </div>
                                {!isFollowed && (
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsFollowed(true);
                                            triggerToast(activeLanguage === 'en' ? 'Followed Mempelai! 💖' : 'Berhasil Mengikuti Mempelai! 💖');
                                        }}
                                        style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--ttk-red)', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000', cursor: 'pointer', zIndex: 10 }}
                                    >
                                        <i className="fas fa-plus" style={{ fontSize: 7, color: '#fff' }} />
                                    </div>
                                )}
                            </div>

                            {/* Love / Like widget */}
                            <div className="ttk-cover__action" onClick={handleLikeClick}>
                                <div className="ttk-cover__action-circle">
                                    <i className={`fas fa-heart ${isLiked ? 'liked' : ''}`} />
                                </div>
                                <span>{formatNumberK(likeCount)}</span>
                            </div>

                            {/* Comments scroll trigger */}
                            <div className="ttk-cover__action" onClick={handleCommentSidebarClick}>
                                <div className="ttk-cover__action-circle">
                                    <i className="fas fa-comment-dots" />
                                </div>
                                <span>2.0K</span>
                            </div>


                            {/* Fullscreen Button in Sidebar */}
                            <div className="ttk-cover__action" onClick={toggleFullscreen}>
                                <div className="ttk-cover__action-circle">
                                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                                </div>
                                <span>{isFullscreen ? (activeLanguage === 'en' ? 'Exit' : 'Keluar') : (activeLanguage === 'en' ? 'Full' : 'Layar')}</span>
                            </div>

                            {/* Auto-Scroll Toggle Button in Sidebar */}
                            <div className="ttk-cover__action" onClick={() => {
                                setAutoScrollEnabled(!autoScrollEnabled);
                                triggerToast(!autoScrollEnabled 
                                    ? (activeLanguage === 'en' ? 'Auto Scroll Active ➔' : 'Auto Scroll Aktif ➔')
                                    : (activeLanguage === 'en' ? 'Auto Scroll Paused ⏸' : 'Auto Scroll Jeda ⏸')
                                );
                            }}>
                                <div className="ttk-cover__action-circle" style={autoScrollEnabled ? { backgroundColor: 'var(--ttk-red)', borderColor: 'var(--ttk-red)' } : {}}>
                                    <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-arrow-down"} />
                                </div>
                                <span>{autoScrollEnabled ? (activeLanguage === 'en' ? 'Pause' : 'Jeda') : (activeLanguage === 'en' ? 'Scroll' : 'Turun')}</span>
                            </div>

                            {/* Spinning Music Vinyl disc linked to music playback state (pauses if muted!) */}
                            <div onClick={toggleMusic} className="ttk-cover__action">
                                <div 
                                    className="ttk-cover__music-disc" 
                                    style={isPlaying ? {} : { animationPlayState: 'paused' }}
                                >
                                    <div className="ttk-cover__music-disc-inner">
                                        <i className="fas fa-music" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Buttons: QR trigger only */}
                        <div style={{ position: 'fixed', right: 12, bottom: 80, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 89 }}>
                            {/* QR Code trigger */}
                            {enableQr && activeGuest && (
                                <button
                                    onClick={() => setShowQr(true)}
                                    style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(22, 24, 35, 0.85)', border: '1px solid var(--ttk-border)', color: 'var(--ttk-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                                    title={activeLanguage === 'en' ? 'QR Code Check-in' : 'Presensi QR Code'}
                                    className="ttk-float"
                                    type="button"
                                >
                                    <i className="fas fa-qrcode" style={{ margin: 'auto', fontSize: 13 }} />
                                </button>
                            )}
                        </div>

                        {/* Slide Layout Parallel Rendering or Normal Scroll Layout */}
                        {isSlideMode ? (
                            <div
                                ref={slideContainerRef}
                                className="ttk-slide-container"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {resolvedSections.map((s, idx) => {
                                    const isActive = idx === activeSlideIdx;
                                    return (
                                        <div
                                            key={s.id || s.section_key}
                                            className={`ttk-slide ttk-slide--${s.section_key}${isActive ? ' is-active' : ''}`}
                                        >
                                            {renderSection(s.section_key)}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{ paddingRight: 45 }}> {/* Ensures side float sidebar doesn't overlap text layout in scroll mode */}
                                {resolvedSections.map(s => renderSection(s.section_key))}
                            </div>
                        )}

                        {/* Iconic Bottom Navigation Bar */}
                        <TikTokBottomBar
                            activeSection={activeSectionId}
                            onNavigate={handleNavigationClick}
                            hasStream={resolvedSections.some(s => s.section_key === 'livestream')}
                            hasGallery={resolvedSections.some(s => s.section_key === 'gallery')}
                            hasStory={resolvedSections.some(s => s.section_key === 'love_story')}
                            hasBank={resolvedSections.some(s => s.section_key === 'bank')}
                            enableRsvp={enableRsvp}
                            language={activeLanguage}
                        />

                        {/* QR Code Check-in Presensi modal */}
                        {enableQr && showQr && activeGuest && (
                            <div className="ttk-qr-overlay" onClick={() => setShowQr(false)}>
                                <div className="ttk-qr-modal" onClick={e => e.stopPropagation()}>
                                    <h3 className="ttk-qr-title">{activeLanguage === 'en' ? 'QR Code Check-in' : 'Presensi QR Code'}</h3>
                                    <p className="ttk-qr-guest">{activeGuest.name}</p>
                                    <div className="ttk-qr-code-box">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=FE2C55&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                            alt="QR Code"
                                            className="ttk-qr-img"
                                        />
                                    </div>
                                    <p className="ttk-qr-desc">
                                        {activeLanguage === 'en'
                                            ? 'Show this QR code to the event crew to check in'
                                            : 'Tunjukkan kode QR ini ke petugas penerima tamu'}
                                    </p>
                                    <button onClick={() => setShowQr(false)} className="ttk-qr-close" type="button">
                                        {activeLanguage === 'en' ? 'Close' : 'Tutup'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
                )}
            </div>
        </ErrorBoundary>
    );
}
