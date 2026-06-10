import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

// Import local assets from luxury-02 theme
import logoDana from '../luxury-02/asset/1200px-Logo_dana_blue.svg-1-1-1.png';
import logoBca from '../luxury-02/asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1.png';
import chipAtm from '../luxury-02/asset/chip-atm-1-2-1-1-1.png';

// Scoped styling
import './style.css';

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
        day: 'numeric', month: 'long', year: 'numeric'
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

// Control parameters for bypass modes
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ─── Fairytale SVG Ornaments ─── */
const CastleIcon = ({ className = '', size = 80 }) => (
    <svg 
        width={size} 
        height={size * 0.8} 
        viewBox="0 0 100 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`ft-ornament-castle ${className}`}
        style={{ display: 'block', margin: '0 auto 15px auto', color: 'var(--ft-secondary)' }}
    >
        {/* Main towers */}
        <path d="M10 70V40L15 35L20 40V70H10Z" fill="currentColor" />
        <path d="M80 70V40L85 35L90 40V70H80Z" fill="currentColor" />
        {/* Roof cones */}
        <path d="M8 40L15 20L22 40H8Z" fill="var(--ft-accent)" />
        <path d="M78 40L85 20L92 40H78Z" fill="var(--ft-accent)" />
        {/* Center Keep */}
        <path d="M25 70V30H75V70H25Z" fill="currentColor" opacity="0.9" />
        {/* crenellations */}
        <path d="M25 30V25H32V30H39V25H46V30H53V25H60V30H67V25H75V30" stroke="currentColor" strokeWidth="2" fill="none" />
        {/* Main High Tower */}
        <path d="M42 30V12L50 5L58 12V30H42Z" fill="var(--ft-primary)" />
        {/* Flags */}
        <path d="M50 5V2L58 3.5L50 5Z" fill="var(--ft-accent)" />
        {/* Gate Arch */}
        <path d="M42 70V52C42 46, 58 46, 58 52V70H42Z" fill="var(--ft-secondary)" />
        <path d="M45 70V55C45 51, 55 51, 55 55V70H45Z" fill="none" stroke="var(--ft-text-light)" strokeWidth="1.5" />
        {/* Windows */}
        <rect x="30" y="40" width="6" height="10" rx="3" fill="var(--ft-text-light)" />
        <rect x="64" y="40" width="6" height="10" rx="3" fill="var(--ft-text-light)" />
        <circle cx="50" cy="20" r="3" fill="var(--ft-text-light)" />
        {/* Sparkles */}
        <path d="M5 25L7 27L5 29L3 27L5 25Z" fill="var(--ft-accent)" />
        <path d="M93 18L95 20L93 22L91 20L93 18Z" fill="var(--ft-accent)" />
    </svg>
);

const CrownDivider = ({ className = '' }) => (
    <div className={`ft-crown-divider-wrap ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '15px 0 25px 0', color: 'var(--ft-secondary)' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--ft-secondary))', opacity: 0.6 }} />
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--ft-secondary)' }}>
            <path d="M6 24 L10 10 L18 16 L20 8 L22 16 L30 10 L34 24 Z" fill="currentColor" />
            <circle cx="10" cy="9" r="1.5" fill="var(--ft-accent)" />
            <circle cx="20" cy="7" r="1.8" fill="var(--ft-accent)" />
            <circle cx="30" cy="9" r="1.5" fill="var(--ft-accent)" />
            <rect x="4" y="24" width="32" height="2.5" rx="1" fill="currentColor" />
            <circle cx="20" cy="25" r="1" fill="var(--ft-text-light)" />
        </svg>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, var(--ft-secondary))', opacity: 0.6 }} />
    </div>
);

const CarriageIcon = ({ className = '', size = 70 }) => (
    <svg 
        width={size} 
        height={size * 0.7} 
        viewBox="0 0 100 70" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`ft-ornament-carriage ${className}`}
        style={{ display: 'block', margin: '20px auto 10px auto', color: 'var(--ft-secondary)' }}
    >
        {/* Wheels */}
        <circle cx="30" cy="52" r="12" stroke="currentColor" strokeWidth="2" fill="var(--ft-text-light)" />
        <circle cx="30" cy="52" r="4" fill="currentColor" />
        <circle cx="70" cy="52" r="12" stroke="currentColor" strokeWidth="2" fill="var(--ft-text-light)" />
        <circle cx="70" cy="52" r="4" fill="currentColor" />
        
        {/* Wheel Spokes */}
        <path d="M30 40V64 M18 52H42" stroke="currentColor" strokeWidth="1" />
        <path d="M70 40V64 M58 52H82" stroke="currentColor" strokeWidth="1" />

        {/* Carriage body */}
        <path d="M22 36C22 18, 78 18, 78 36C78 46, 22 46, 22 36Z" fill="var(--ft-primary)" opacity="0.9" />
        <path d="M22 36C22 18, 78 18, 78 36Z" stroke="currentColor" strokeWidth="2" fill="none" />
        
        {/* Crown on top */}
        <path d="M46 18 L50 12 L54 18 Z" fill="var(--ft-secondary)" />
        <circle cx="50" cy="11" r="1.5" fill="var(--ft-accent)" />
        
        {/* Window */}
        <circle cx="50" cy="32" r="9" fill="var(--ft-text-light)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M50 23V41 M41 32H59" stroke="var(--ft-secondary)" strokeWidth="1" />
        
        {/* Connecting frame / chassis */}
        <path d="M30 52H70 M42 52L48 44 M58 52L52 44" stroke="currentColor" strokeWidth="2" />
        {/* Carriage handles/swirls */}
        <path d="M12 36C12 36, 16 32, 22 36 M78 36C78 36, 84 32, 88 36L94 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
);

const CardCorner = () => (
    <>
        <div className="ft-card-corner ft-card-corner-tl" />
        <div className="ft-card-corner ft-card-corner-tr" />
        <div className="ft-card-corner ft-card-corner-bl" />
        <div className="ft-card-corner ft-card-corner-br" />
    </>
);

/* ═══════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const style = delay ? { transitionDelay: `${delay}ms` } : {};
    return (
        <div className={`ft-reveal--${variant} ${className}`} style={style}>
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
        <div className={`ft-cover${isOpened ? ' is-opened' : ''}`}>
            {/* Decorative Background Ornament */}
            <div className="ft-bg-ornament-transparent" />
            
            {/* Decorative Corner Ornaments */}
            <div className="ft-cover__corner ft-cover__corner--tl" />
            <div className="ft-cover__corner ft-cover__corner--tr" />
            <div className="ft-cover__corner ft-cover__corner--bl" />
            <div className="ft-cover__corner ft-cover__corner--br" />

            <div className="ft-cover__content">
                {/* Decorative top stars/butterflies */}
                <div className="ft-cover__deco-top">
                    <span className="ft-cover__deco-star">✦</span>
                    <span className="ft-cover__deco-line" />
                    <span className="ft-cover__deco-star">🦋</span>
                    <span className="ft-cover__deco-line" />
                    <span className="ft-cover__deco-star">✦</span>
                </div>

                <span className="ft-cover__the-wedding">{t('invitation.wedding_of')}</span>
                
                {showPhotos && coverImages.length > 0 ? (
                    <div className="ft-cover__photo-frame">
                        <PremiumSlideshow
                            images={coverImages}
                            positionX={invitation?.cover_position_x}
                            positionY={invitation?.cover_position_y}
                            zoom={invitation?.cover_zoom}
                        />
                    </div>
                ) : (
                    <div className="ft-cover__monogram">
                        <span>{groom.nickname?.charAt(0) || 'G'}</span>
                        <span className="ft-cover__monogram-amp">&</span>
                        <span>{bride.nickname?.charAt(0) || 'B'}</span>
                    </div>
                )}

                <h1 className="ft-cover__couple">{coupleName}</h1>
                
                <CarriageIcon size={85} />

                <div className="ft-cover__date">{formattedDate}</div>

                {/* Dear guest section */}
                <div className="ft-cover__envelope">
                    <p className="ft-cover__dear">{t('invitation.dear_guest_title') || 'Kepada Yth.'}</p>
                    <div className="ft-cover__guest">{guestName}</div>
                    <p className="ft-cover__apology">{t('invitation.dear_guest_desc')}</p>
                </div>

                <button type="button" onClick={onOpen} id="tombol-buka" className="ft-cover__btn">
                    <i className="fas fa-envelope-open" />
                    {t('invitation.open')}
                </button>

                {/* Bottom decorative stars */}
                <div className="ft-cover__deco-bottom">
                    <span className="ft-cover__deco-star ft-cover__deco-star--sm">✧</span>
                    <span className="ft-cover__deco-star ft-cover__deco-star--sm">✦</span>
                    <span className="ft-cover__deco-star ft-cover__deco-star--sm">✧</span>
                </div>
            </div>
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

        // Fallback to default prewedding photo
        return ['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop'];
    }, [invitation?.opening_image, galleries]);

    return (
        <section id="opening" className="ft-section ft-opening">
            {/* ✅ Wajib: Ornamen Background Transparan */}
            <div className="ft-bg-ornament-transparent" />

            <Reveal>
                <CastleIcon size={90} />
                {/* Judul Pembuka Dinamis (Tanpa Hardcoded Basmalah) */}
                {invitation?.opening_title && (
                    <h2 className="ft-section-title">{invitation.opening_title}</h2>
                )}

                {/* Nama pasangan di halaman pembuka - TANPA duplikasi 'The Wedding of' */}
                <div className="ft-opening__couple-name">
                    {coupleName}
                </div>

                {showPhotos && resolvedOpeningImages.length > 0 && (
                    <div className="ft-opening__slideshow-wrapper" style={{ marginBottom: '25px' }}>
                        <PremiumSlideshow
                            images={resolvedOpeningImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                )}

                {showCountdown && (
                    <div style={{ marginTop: '15px', marginBottom: '25px' }}>
                        <CountdownBlock events={events} />
                    </div>
                )}

                {/* Quote Box: Kunci Ukuran Font Quote Agar Kecil & Elegan */}
                {invitation?.opening_ayat && (
                    <div className="ft-quote-card">
                        <CardCorner />
                        <p className="ft-opening__ayat">
                            &ldquo;{invitation.opening_ayat}&rdquo;
                        </p>
                        {invitation?.opening_ayat_source && (
                            <p className="ft-opening__source">&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}

                <p className="ft-opening__text">
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia mengenai hari pernikahan kami.'}
                </p>
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
        <section id="bride_groom" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{t('invitation.mempelai')}</h2>
                <p className="ft-section-subtitle">Groom &amp; Bride</p>
                <CrownDivider />
            </Reveal>

            {/* Groom (Pria) */}
            <Reveal className="ft-card ft-mempelai-card" variant="left">
                <CardCorner />
                <div className="ft-mempelai-photo-wrap">
                    {showPhotos && groom.photo ? (
                        <img 
                            src={getStorageUrl(groom.photo)} 
                            alt={groom.full_name || 'Groom'} 
                            className="ft-mempelai-photo" 
                            style={{
                                objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                transform: `scale(${groom.photo_zoom ?? 1.0})`,
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#ebdffa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ft-font-heading)', fontSize: '2.5rem', color: 'var(--ft-primary)' }}>
                            {groom.nickname?.charAt(0) || 'G'}
                        </div>
                    )}
                </div>
                
                <h3 className="ft-mempelai-name">{groom.full_name || 'Nama Lengkap Pria'}</h3>
                <p className="ft-mempelai-parent-label">
                    {translateChildOrder(groom.child_order, 'pria')}
                </p>
                <p className="ft-mempelai-parents">
                    {groom.father_name && groom.mother_name
                        ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                        : (groom.father_name || groom.mother_name || '')}
                </p>
                {groom.instagram && (
                    <a
                        href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ft-mempelai-ig"
                    >
                        <i className="fab fa-instagram" /> @{groom.instagram.replace('@', '')}
                    </a>
                )}
            </Reveal>

            {/* And separator */}
            <Reveal className="ft-and-divider" variant="zoom">
                and
            </Reveal>

            {/* Bride (Wanita) */}
            <Reveal className="ft-card ft-mempelai-card" variant="right">
                <CardCorner />
                <div className="ft-mempelai-photo-wrap">
                    {showPhotos && bride.photo ? (
                        <img 
                            src={getStorageUrl(bride.photo)} 
                            alt={bride.full_name || 'Bride'} 
                            className="ft-mempelai-photo" 
                            style={{
                                objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                transform: `scale(${bride.photo_zoom ?? 1.0})`,
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: '#ebdffa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ft-font-heading)', fontSize: '2.5rem', color: 'var(--ft-primary)' }}>
                            {bride.nickname?.charAt(0) || 'B'}
                        </div>
                    )}
                </div>
                
                <h3 className="ft-mempelai-name">{bride.full_name || 'Nama Lengkap Wanita'}</h3>
                <p className="ft-mempelai-parent-label">
                    {translateChildOrder(bride.child_order, 'wanita')}
                </p>
                <p className="ft-mempelai-parents">
                    {bride.father_name && bride.mother_name
                        ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                        : (bride.father_name || bride.mother_name || '')}
                </p>
                {bride.instagram && (
                    <a
                        href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ft-mempelai-ig"
                    >
                        <i className="fab fa-instagram" /> @{bride.instagram.replace('@', '')}
                    </a>
                )}
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
        <div className="ft-countdown-wrapper">
            <h3 style={{ fontFamily: 'var(--ft-font-heading)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ft-secondary)', marginBottom: '15px' }}>
                {t('invitation.save_the_date') === 'Save The Date' ? 'Counting Down' : 'Menghitung Hari'}
            </h3>
            <div className="ft-countdown">
                <div className="ft-countdown__item">
                    <span className="ft-countdown__value">{pad2(timeLeft.d)}</span>
                    <span className="ft-countdown__label">{t('invitation.days')}</span>
                </div>
                <span className="ft-countdown__colon">:</span>
                <div className="ft-countdown__item">
                    <span className="ft-countdown__value">{pad2(timeLeft.h)}</span>
                    <span className="ft-countdown__label">{t('invitation.hours')}</span>
                </div>
                <span className="ft-countdown__colon">:</span>
                <div className="ft-countdown__item">
                    <span className="ft-countdown__value">{pad2(timeLeft.m)}</span>
                    <span className="ft-countdown__label">{t('invitation.minutes')}</span>
                </div>
                <span className="ft-countdown__colon">:</span>
                <div className="ft-countdown__item">
                    <span className="ft-countdown__value">{pad2(timeLeft.s)}</span>
                    <span className="ft-countdown__label">{t('invitation.seconds')}</span>
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
        <section id="event" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{t('invitation.wedding_events') || 'Acara'}</h2>
                <p className="ft-section-subtitle">Wedding Events</p>
                <CrownDivider />
            </Reveal>

            {showCountdown && (
                <Reveal variant="zoom" style={{ marginBottom: '25px' }}>
                    <CountdownBlock events={events} />
                </Reveal>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {list.map((evt, idx) => {
                    const isAkad = evt.event_name?.toLowerCase().includes('akad');
                    return (
                        <Reveal key={evt.id || idx} className="ft-card ft-event-card" variant={idx % 2 === 0 ? 'left' : 'right'}>
                            <CardCorner />
                            <span className="ft-event-card__badge">{isAkad ? (locale === 'en' ? 'Ceremony' : 'Akad') : (locale === 'en' ? 'Reception' : 'Resepsi')}</span>
                            <h3 className="ft-event-card__name">{evt.event_name || (isAkad ? 'Akad Nikah' : 'Resepsi')}</h3>
                            
                            <div className="ft-event-card__meta">
                                <div className="ft-event-card__meta-item">
                                    <i className="far fa-calendar-alt" />
                                    <span className="ft-event-card__text">{formatDate(evt.event_date, locale)}</span>
                                </div>
                                <div className="ft-event-card__meta-item">
                                    <i className="far fa-clock" />
                                    <span className="ft-event-card__text">
                                        {formatTime(evt.start_time)} - {evt.end_time ? formatTime(evt.end_time) : 'Selesai'} {evt.timezone || 'WIB'}
                                    </span>
                                </div>
                                <div className="ft-event-card__meta-item">
                                    <i className="fas fa-map-marker-alt" />
                                    <div style={{ marginTop: '2px' }}>
                                        <span className="ft-event-card__text" style={{ fontWeight: '600' }}>{evt.venue_name || 'Nama Tempat'}</span>
                                        <p className="ft-event-card__address">{evt.venue_address || 'Alamat Lengkap Acara'}</p>
                                    </div>
                                </div>
                            </div>

                            {evt.gmaps_link && (
                                <a
                                    href={evt.gmaps_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ft-btn-event"
                                >
                                    <i className="fas fa-map-location-dot" />
                                    Google Maps
                                </a>
                            )}
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ==========================================================================
   SECTION 6: LOVE STORY
   ========================================================================== */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const stories = safeArr(loveStories);

    return (
        <section id="love_story" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{t('invitation.love_story') || 'Kisah Cinta'}</h2>
                <p className="ft-section-subtitle">Our Love Journey</p>
                <CrownDivider />
            </Reveal>

            <div className="ft-story-timeline">
                {stories.map((st, idx) => (
                    <Reveal key={st.id || idx} className="ft-card ft-story-card" variant={idx % 2 === 0 ? 'left' : 'right'}>
                        <CardCorner />
                        <div className="ft-story-date">{formatDate(st.story_date)}</div>
                        <h3 className="ft-story-title">{st.title}</h3>
                        <p className="ft-story-desc">{st.description}</p>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ==========================================================================
   SECTION 7: LIVE STREAMING
   ========================================================================== */
function LiveStreamingSection({ events }) {
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

    const isEn = t('invitation.save_the_date') === 'Save The Date';

    return (
        <section id="livestream" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <p className="ft-section-subtitle">Saksikan Momen Bahagia Kami</p>
                <CrownDivider />
            </Reveal>

            <Reveal className="ft-card" variant="zoom">
                <CardCorner />
                <p style={{ fontSize: '12.5px', marginBottom: '20px', lineHeight: 1.6 }}>
                    {isEn 
                        ? 'For family and friends who are unable to attend in person, you can still join our celebration virtually through the links below:' 
                        : 'Bagi keluarga dan kerabat yang terhalang jarak dan waktu, Anda tetap dapat menyaksikan momen janji suci kami secara virtual:'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    {streamsList.map((stream, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => window.open(stream.url, '_blank')} 
                            className="ft-btn-primary"
                            style={{ maxWidth: '280px' }}
                        >
                            <i className="fas fa-video" style={{ marginRight: '8px' }} /> 
                            WATCH ON {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 8: DRESS CODE
   ========================================================================== */
function DressCodeSection({ invitation }) {
    const { t, locale } = useTranslation();
    const colors = invitation?.dresscode_colors ? invitation.dresscode_colors.split(',') : [];
    const showDresscode = parseBool(invitation?.show_dresscode, false);

    if (!showDresscode) return null;

    const isEn = locale === 'en';

    return (
        <section id="dresscode" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{isEn ? 'Dress Code' : 'Kode Busana'}</h2>
                <p className="ft-section-subtitle">Dress Guidelines</p>
                <CrownDivider />
            </Reveal>

            <Reveal className="ft-card" variant="zoom">
                <CardCorner />
                <p style={{ fontSize: '12.5px', lineHeight: 1.6, marginBottom: '15px' }}>
                    {invitation?.dresscode_text || (isEn 
                        ? 'To add to the beautiful atmosphere, we highly appreciate it if guests dress according to the color guide below:' 
                        : 'Untuk menyelaraskan keindahan suasana, kami sangat menghargai apabila tamu undangan mengenakan busana sesuai panduan warna berikut:')}
                </p>

                {colors.length > 0 && (
                    <div className="ft-dresscode-colors-flex">
                        {colors.map((color, idx) => (
                            <div 
                                key={idx} 
                                className="ft-dresscode-color-circle" 
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
   SECTION 9: VIDEO PREWEDDING
   ========================================================================== */
function VideoSection({ invitation }) {
    const { t, locale } = useTranslation();
    const videoUrl = invitation?.video_url || '';
    const embedId = getYoutubeId(videoUrl);

    if (!videoUrl || !embedId) return null;

    const isEn = locale === 'en';

    return (
        <section id="video" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{isEn ? 'Our Video' : 'Momen Video'}</h2>
                <p className="ft-section-subtitle">Prewedding Journey</p>
                <CrownDivider />
            </Reveal>

            <Reveal className="ft-card" variant="zoom" style={{ padding: 10 }}>
                <CardCorner />
                <div className="ft-video-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${embedId}?autoplay=0&mute=1`}
                        title="Prewedding Video"
                        allowFullScreen
                    />
                </div>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 10: GALLERY PHOTOS
   ========================================================================== */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    return (
        <section id="gallery" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{t('invitation.gallery') || 'Galeri'}</h2>
                <p className="ft-section-subtitle">Our Moments</p>
                <CrownDivider />
            </Reveal>

            <div className="ft-gallery-grid">
                {list.map((gl, idx) => {
                    const isWide = idx % 3 === 0;
                    return (
                        <Reveal 
                            key={gl.id || idx} 
                            className={`ft-gallery-item ${isWide ? 'ft-gallery-item--wide' : ''}`} 
                            variant="zoom"
                            delay={idx * 50}
                        >
                            <img src={getStorageUrl(gl.image_path || gl.image_url)} alt={`Gallery prewedding ${idx}`} />
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ==========================================================================
   SECTION 11: RSVP & WISHES (Unified Form)
   ========================================================================== */
function RsvpWishesSection({ invitation, guest, wishes, slug }) {
    const { t, locale } = useTranslation();
    const guestId = guest?.id || null;
    const defaultSenderName = guest?.name || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guestId,
        attendance: 'hadir',
        number_of_guests: 1,
        sender_name: defaultSenderName,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('invitation.submitRsvp', { slug }), {
            preserveScroll: true,
            onSuccess: () => {
                post(route('invitation.submitWish', { slug }), {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset('message');
                        alert(locale === 'en' ? 'Thank you! Your wish and RSVP have been sent.' : 'Terima kasih! Doa dan konfirmasi kehadiran Anda berhasil terkirim.');
                    }
                });
            }
        });
    };

    const handleEmojiSelect = (emoji) => {
        setData('message', data.message + emoji);
    };

    const isEn = locale === 'en';

    return (
        <section id="rsvp" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">RSVP &amp; Wishes</h2>
                <p className="ft-section-subtitle">Konfirmasi Kehadiran</p>
                <CrownDivider />
            </Reveal>

            <Reveal className="ft-card" variant="zoom">
                <CardCorner />
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Nama Tamu */}
                    <div className="ft-form-group">
                        <label className="ft-form-label">{isEn ? 'Your Name' : 'Nama Lengkap'}</label>
                        <input
                            type="text"
                            value={data.sender_name}
                            onChange={e => setData('sender_name', e.target.value)}
                            className="ft-input"
                            placeholder={isEn ? 'Enter your name' : 'Nama lengkap Anda'}
                            required
                        />
                        {errors.sender_name && <span style={{ color: '#e53e3e', fontSize: '10px', marginTop: '4px', display: 'block' }}>{errors.sender_name}</span>}
                    </div>

                    {/* Kehadiran */}
                    <div className="ft-form-group">
                        <label className="ft-form-label">{isEn ? 'Attendance Status' : 'Konfirmasi Kehadiran'}</label>
                        <select
                            value={data.attendance}
                            onChange={e => setData('attendance', e.target.value)}
                            className="ft-select"
                        >
                            <option value="hadir">{isEn ? 'I Will Attend' : 'Saya Hadir'}</option>
                            <option value="tidak_hadir">{isEn ? 'I Cannot Attend' : 'Saya Tidak Hadir'}</option>
                            <option value="belum_pasti">{isEn ? 'Uncertain' : 'Masih Belum Pasti'}</option>
                        </select>
                    </div>

                    {/* Jumlah Orang */}
                    {data.attendance === 'hadir' && (
                        <div className="ft-form-group">
                            <label className="ft-form-label">{isEn ? 'Number of Guests' : 'Jumlah Orang'}</label>
                            <select
                                value={data.number_of_guests}
                                onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                className="ft-select"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n} {isEn ? 'Person(s)' : 'Orang'}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Ucapan Pesan */}
                    <div className="ft-form-group" style={{ position: 'relative' }}>
                        <label className="ft-form-label">{isEn ? 'Your Wish' : 'Doa & Ucapan'}</label>
                        <textarea
                            value={data.message}
                            onChange={e => setData('message', e.target.value)}
                            className="ft-textarea"
                            placeholder={isEn ? 'Write your beautiful wishes here...' : 'Tuliskan ucapan dan doa terbaik Anda...'}
                            rows="4"
                            required
                        />
                        {errors.message && <span style={{ color: '#e53e3e', fontSize: '10px', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                        
                        {/* Emoji Picker */}
                        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
                            <WishesEmojiPicker onSelectEmoji={handleEmojiSelect} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="ft-btn-primary"
                        style={{ marginTop: '10px' }}
                    >
                        {processing ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Submit' : 'Kirim Kehadiran & Ucapan')}
                    </button>
                </form>

                {/* Wishes Comment List (Limited to 5, Scrollable) */}
                {wishes.length > 0 && (
                    <div className="ft-wishes-scroll">
                        {wishes.map((wish, idx) => (
                            <div key={wish.id || idx} className="ft-wish-card">
                                <div className="ft-wish-header">
                                    <span className="ft-wish-sender">{wish.sender_name}</span>
                                    <span className="ft-wish-time">
                                        {wish.created_at ? new Date(wish.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja'}
                                    </span>
                                </div>
                                <p className="ft-wish-message">{wish.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   SECTION 12: GIFTS & BANK ACCOUNT (Luxury 02 Style)
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
        <section id="bank" className="ft-section">
            <div className="ft-bg-ornament-transparent" />
            <Reveal>
                <h2 className="ft-section-title">{t('invitation.bank') || 'Kado Digital'}</h2>
                <p className="ft-section-subtitle">Wedding Gift</p>
                <CrownDivider />
            </Reveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {list.map((ac, idx) => {
                    const isBca = ac.bank_name?.toLowerCase().includes('bca');
                    const isDana = ac.bank_name?.toLowerCase().includes('dana');
                    
                    return (
                        <Reveal key={ac.id || idx} className="ft-bank-card" variant="zoom">
                            <CardCorner />
                            <div className="ft-bank-card-header">
                                <img src={chipAtm} className="ft-card-chip" alt="ATM Chip" />
                                {isBca ? (
                                    <img src={logoBca} className="ft-card-bank-logo" alt="BCA Logo" />
                                ) : isDana ? (
                                    <img src={logoDana} className="ft-card-bank-logo" alt="DANA Logo" />
                                ) : (
                                    <span style={{ fontFamily: 'var(--ft-font-heading)', fontWeight: 'bold', fontSize: '1rem', color: '#fcfaf2' }}>
                                        {ac.bank_name?.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            
                            <div className="ft-bank-card-number">
                                {ac.account_number}
                            </div>
                            
                            <div className="ft-bank-card-footer">
                                <div>
                                    <div className="ft-bank-card-label">{isEn ? 'Card Holder' : 'Atas Nama'}</div>
                                    <div className="ft-bank-card-holder">{ac.account_name}</div>
                                </div>
                                
                                <button 
                                    type="button" 
                                    className="ft-btn-copy" 
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
        return title;
    }, [invitation?.closing_title]);

    return (
        <section id="closing" className="ft-section ft-closing">
            <Reveal>
                <CastleIcon size={90} />
                <h2 className="ft-closing__title">{cleanClosingTitle}</h2>
                <p className="ft-closing__text">
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.'}
                </p>
                
                <div className="ft-closing__families">
                    {hasGroomParents && (
                        <div>
                            {isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Keluarga Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </div>
                    )}
                    {hasBrideParents && (
                        <div style={{ marginTop: '8px' }}>
                            {isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Keluarga Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </div>
                    )}
                </div>

                <p className="ft-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME COMPONENT (DYNAMIC INDEX)
   ═══════════════════════════════════════ */
/* ─── Memoized Section List to prevent scroll-flicker ─── */
const SectionList = React.memo(({ resolvedSections, renderSection }) => {
    return (
        <div className="ft-scroll-content">
            {resolvedSections.map((s) => (
                <div
                    key={s.section_key}
                    id={`section-${s.section_key}`}
                    className="ft-section-wrapper"
                >
                    {renderSection(s.section_key)}
                </div>
            ))}
        </div>
    );
});

/* ─── Check if DOM target is a control element ─── */
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
                node.classList.contains('ft-floating-btns') || 
                node.classList.contains('ft-nav') ||
                node.classList.contains('ft-nav-btn') ||
                node.classList.contains('ft-autoscroll-btn') ||
                node.classList.contains('ft-music-btn') ||
                node.classList.contains('ft-qr-btn') ||
                node.classList.contains('ft-fullscreen-btn')
            ) {
                return true;
            }
        }
        node = node.parentNode || node.host;
    }
    return false;
};

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
    const isEn = locale === 'en';
    const audioRef = useRef(null);
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(parseBool(invitation?.enable_auto_scroll, false));

    // Visibility-aware background audio control
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const layoutMode = 'slide-h'; // Locked to horizontal swipe mode as requested
    const isSlideMode = true;

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

    // Refs for scroll and navigation optimization
    const isNavigatingRef = useRef(false);
    const navigatingTimeoutRef = useRef(null);
    const activeSectionRef = useRef('cover');
    const activeSectionTimeoutRef = useRef(null);
    const intersectingSectionsRef = useRef(new Map());
    const lastToggleTimeRef = useRef(0);

    // Update toggle timestamp to handle mobile synthetic click event cooldowns
    useEffect(() => {
        lastToggleTimeRef.current = Date.now();
    }, [autoScrollEnabled]);

    // Handle Open invitation
    const handleOpen = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
        // Fullscreen API trigger
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // High-performance IntersectionObserver with viewport-relative scoring and stability debouncing
    useEffect(() => {
        if (!isOpened || resolvedSections.length === 0) return;

        const observerOptions = {
            root: null, // viewport
            rootMargin: '-35% 0px -35% 0px', // active middle zone of viewport
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

            // Find the intersecting section covering or closest to the middle of the viewport
            let bestSectionKey = null;
            let minDistance = Infinity;
            const viewportMiddle = window.innerHeight * 0.4; // 40% from top is active area

            intersectingSectionsRef.current.forEach((_, key) => {
                const el = document.getElementById(`section-${key}`);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const coversMiddle = rect.top <= viewportMiddle && rect.bottom >= viewportMiddle;
                    
                    if (coversMiddle) {
                        bestSectionKey = key;
                        minDistance = -1; // force selection
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
                
                // Debounce to prevent React state update storm during rapid scrolling
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

    // Cleanup navigation and scroll timeouts on unmount
    useEffect(() => {
        return () => {
            if (navigatingTimeoutRef.current) clearTimeout(navigatingTimeoutRef.current);
            if (activeSectionTimeoutRef.current) clearTimeout(activeSectionTimeoutRef.current);
        };
    }, []);

    // Lock body scroll on initial load (since cover overlaps)
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpened]);

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

    // Menu button navigations (bypasses IntersectionObserver to prevent bottom menu jumpiness)
    const handleNavigate = (key) => {
        setAutoScrollEnabled(false);
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
        }, 800); // Wait for smooth scroll animation to finish
    };

    // Auto-scroll active navigation button to center
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.ft-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // 60fps/120fps Butter-Smooth Auto-Scroll using requestAnimationFrame
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let animationFrameId = null;
        let lastTime = performance.now();
        const speed = 0.04; // scroll speed: pixels per millisecond (approx 40px/sec)
        let accumulatedScroll = 0;

        const scrollLoop = (time) => {
            const delta = time - lastTime;
            lastTime = time;

            // Cap delta to prevent massive jumps when tab loses focus
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
                setAutoScrollEnabled(false); // Stop at bottom of page
            }
        };

        // Start scrolling after 1 second delay
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
    }, [isOpened, autoScrollEnabled]);

    // Pause auto scroll on manual user interaction
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            // Cooldown check: Ignore events fired within 350ms of a button toggle.
            // This prevents synthetic events (like touchstart -> click -> synthetic mousedown/touchstart) 
            // from immediately pausing the scroll that was just turned on.
            if (Date.now() - lastToggleTimeRef.current < 350) {
                return;
            }

            // If the user presses keys that aren't scroll keys, do not interrupt auto scroll
            if (e.type === 'keydown') {
                const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', ' ', 'PageUp', 'PageDown', 'Home', 'End'];
                if (!scrollKeys.includes(e.key)) return;
            }

            // Do not pause if the user clicked control elements (buttons, inputs, select, nav, etc.)
            if (isControlElement(e.target)) {
                return;
            }
            setAutoScrollEnabled(false);
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
    }, [isOpened, autoScrollEnabled]);

    // Standard Section Rendering router
    const renderSection = useCallback((key) => {
        const showCountdown = parseBool(invitation?.show_countdown, true);
        
        switch (key) {
            case 'opening':
                return <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} events={events} showCountdown={showCountdown} galleries={galleries} showPhotos={globalShowPhotos} />;
            case 'bride_groom':
                return <BrideGroomSection key={key} brideGrooms={brideGrooms} showPhotos={globalShowPhotos} />;
            case 'event':
                return <EventSection key={key} events={events} showCountdown={showCountdown} invitation={invitation} />;
            case 'love_story':
                return <LoveStorySection key={key} loveStories={loveStories} />;
            case 'livestream':
                return <LiveStreamingSection key={key} events={events} />;
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
    }, [invitation, brideGrooms, events, galleries, loveStories, guest, wishes, bankAccounts, brandName]);

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
            <div className={`ft-page ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                
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
                    showPhotos={globalShowPhotos}
                />

                <div className="ft-container">
                    <main className="ft-main">
                        
                        {/* Background particle effect overlay */}
                        {invitation?.particle_type && invitation.particle_type !== 'none' && (
                            <ParticleEffect type={invitation.particle_type} />
                        )}

                        {/* Rendering dynamic sections vertically */}
                        {isOpened && (
                            <SectionList 
                                resolvedSections={resolvedSections} 
                                renderSection={renderSection} 
                            />
                        )}

                        {/* Scoped Bottom Navigation Bar */}
                        {isOpened && resolvedSections.length > 0 && (
                            <nav className="ft-nav">
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
                                            className={`ft-nav-btn ${isActive ? 'is-active' : ''}`}
                                            title={s.section_name}
                                        >
                                            <i className={icon} />
                                            <span className="ft-nav-btn-label">{getShortLabel(key)}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        )}

                        {/* Floating controls */}
                        {isOpened && (
                            <div className="ft-floating-btns">
                                {/* Floating Auto Scroll toggle button */}
                                <button 
                                    type="button" 
                                    onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} 
                                    className={`ft-autoscroll-btn ${autoScrollEnabled ? 'is-active' : ''}`}
                                    title={autoScrollEnabled ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
                                >
                                    {autoScrollEnabled ? (
                                        <i className="fas fa-pause" />
                                    ) : (
                                        <i className="fas fa-arrows-up-down" />
                                    )}
                                </button>

                                {/* Floating Fullscreen toggle button */}
                                <button 
                                    type="button" 
                                    onClick={toggleFullscreen} 
                                    className="ft-fullscreen-btn"
                                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                                >
                                    <i className={isFullscreen ? 'fas fa-compress' : 'fas fa-expand'} />
                                </button>

                                {/* Floating Music Control */}
                                {invitation?.music_url && (
                                    <button 
                                        type="button" 
                                        onClick={toggleMusic} 
                                        className="ft-music-btn"
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
                                        className="ft-qr-btn"
                                        title="Show Presence QR Code"
                                    >
                                        <i className="fas fa-qrcode" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* QR Presence modal */}
                        {enableQr && showQr && guest && (
                            <div className="ft-modal-overlay animate-fade-in" onClick={() => setShowQr(false)}>
                                <div className="ft-modal" onClick={e => e.stopPropagation()}>
                                    <h3 className="ft-modal-title">{isEn ? 'Presence QR Code' : 'QR Code Presensi'}</h3>
                                    
                                    <div className="ft-modal-qr-wrap">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=6c527b&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="QR Code Presensi" 
                                            style={{ width: 180, height: 180, display: 'block' }}
                                        />
                                    </div>
                                    
                                    <p className="ft-modal-desc">
                                        {isEn 
                                            ? 'Please present this QR code to the receptionist for check-in registration.' 
                                            : 'Tunjukkan QR code ini kepada petugas penerima tamu untuk melakukan konfirmasi kehadiran (check-in).'}
                                    </p>
                                    
                                    <button 
                                        type="button" 
                                        onClick={() => setShowQr(false)} 
                                        className="ft-btn-primary"
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

/* ═══════════════════════════════════════
   LOCAL ERROR BOUNDARY COMPONENT
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { 
        super(props); 
        this.state = { hasError: false, error: null }; 
    }
    static getDerivedStateFromError(e) { 
        return { hasError: true, error: e }; 
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 25, color: '#4a3e4d', background: '#fcfaf2', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h2 style={{ color: '#6c527b', fontFamily: 'Cinzel', fontSize: '1.25rem' }}>Terjadi kesalahan pada rendering tema.</h2>
                    <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#555', marginTop: 10, maxWidth: '95%' }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }
        return this.props.children;
    }
}
