import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import DressCodeBlock from '@/Components/DressCodeBlock';

import logoDana from '../luxury-02/asset/1200px-Logo_dana_blue.svg-1-1-1.png';
import logoBca from '../luxury-02/asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1.png';
import chipAtm from '../luxury-02/asset/chip-atm-1-2-1-1-1.png';
import heartSvg from '../luxury-02/asset/2764.svg';

/* ═══════════════════════════════════════
   ORMANENT ASSETS URLS
   ═══════════════════════════════════════ */
const ORNAMENTS = {
    bouquet: '/themes/spesial-02/bouquet.png',
    bgCover: '/themes/spesial-02/bg-cover.png',
    cardOrnament: '/themes/spesial-02/leaf-branch.png',
    b1: '/themes/spesial-02/bunga-01.webp',
    b2: '/themes/spesial-02/bunga-02.webp',
    b3: '/themes/spesial-02/bunga-03.webp',
    b4: '/themes/spesial-02/bunga-04.webp',
    b5: '/themes/spesial-02/bunga-05.webp',
    b6: '/themes/spesial-02/bunga-06.webp',
    gradasi: '/themes/spesial-02/gradasi.png',
    frame: '/themes/spesial-02/frame-ornament.webp',
    
    // Fallback vector logos for banking cards
    dana: logoDana,
    bca: logoBca,
    chip: chipAtm,
    heart: heartSvg,
};

/* ═══════════════════════════════════════
   STANDARD HELPERS
   ═══════════════════════════════════════ */
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

function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatDate(d, locale) {
    if (!d) return '';
    return new Date(d).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { 
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

// Clipboard copy fallback for iOS / WebViews
const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: 0, top: 0, left: 0 });
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
            <div style={{ padding: '40px 20px', color: '#5b4447', background: '#fffbf8', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2 style={{ color: '#986a52', fontFamily: 'serif' }}>Terjadi kesalahan pada rendering tema.</h2>
                <p style={{ opacity: 0.8, fontSize: '13px', marginTop: 10 }}>Penyebab umum: Data mempelai atau tanggal acara belum diset lengkap.</p>
                <pre style={{ fontSize: '11px', background: '#fcf7f4', padding: 15, borderRadius: 10, overflowX: 'auto', maxHeight: 200, color: '#777', textAlign: 'left', maxWidth: 500, margin: '20px auto' }}>
                    {this.state.error?.toString()}
                </pre>
                <button onClick={() => window.location.reload()} style={{ background: '#986a52', color: '#fff', border: 0, padding: '10px 20px', borderRadius: 20, cursor: 'pointer', fontWeight: 600 }}>Muat Ulang Halaman</button>
            </div>
        );
        return this.props.children;
    }
}

// Global configurations updated by React
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL (LOCAL)
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
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'ani-fadeUp';
    if (variant === 'zoom') baseClass = 'ani-scaleIn';
    else if (variant === 'left') baseClass = 'ani-fadeLeft';
    else if (variant === 'right') baseClass = 'ani-fadeRight';
    else if (variant === 'down') baseClass = 'ani-fadeDown';

    return (
        <div
            ref={ref}
            className={`${className} ${visible ? baseClass : 'ani-hidden'}`}
            style={delay ? { animationDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   ORMANENT PARTS
   ═══════════════════════════════════════ */
function FlowerSwirl({ title }) {
    return (
        <div className="mb-6 mt-2 flex flex-col items-center">
            {title && (
                <h2 className="text-2xl sm:text-3xl text-[var(--sp02-primary)] sp02-font-script-style leading-none mb-1">
                    {title}
                </h2>
            )}
            <div className="sp02-divider">
                <div className="sp02-divider-line" />
                <div className="sp02-divider-dot" />
                <div className="sp02-divider-line" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   PREMIUM LAYERED FLOWER ORNAMENTS
   ═══════════════════════════════════════ */
function FlowerOrnaments({ isFixed = false }) {
    return (
        <div className={`sp02-ornaments-container ${isFixed ? 'is-fixed' : ''}`}>
            {/* Top Left Corner: b6 image (pulse2 anim) */}
            <div className="sp02-corner-tl sp02-anim-pluse2">
                <img src={ORNAMENTS.b6} alt="" />
            </div>

            {/* Top Right Corner: b5, b3, b4, b2, b1 elements */}
            <div className="sp02-corner-tr">
                <div className="sp02-corner-group">
                    <div className="sp02-corner-item sp02-item-b5 sp02-anim-wayanGR">
                        <img src={ORNAMENTS.b5} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b3 sp02-anim-wayanGL">
                        <img src={ORNAMENTS.b3} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b4 sp02-anim-flc">
                        <img src={ORNAMENTS.b4} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b2 sp02-anim-pluse">
                        <img src={ORNAMENTS.b2} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b1">
                        <img src={ORNAMENTS.b1} alt="" />
                    </div>
                </div>
            </div>

            {/* Bottom Right Corner: Flipped Y, identical structure */}
            <div className="sp02-corner-br">
                <div className="sp02-corner-group">
                    <div className="sp02-corner-item sp02-item-b5 sp02-anim-wayanGR">
                        <img src={ORNAMENTS.b5} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b3 sp02-anim-wayanGL">
                        <img src={ORNAMENTS.b3} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b4 sp02-anim-flc">
                        <img src={ORNAMENTS.b4} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b2 sp02-anim-pluse">
                        <img src={ORNAMENTS.b2} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b1">
                        <img src={ORNAMENTS.b1} alt="" />
                    </div>
                </div>
            </div>

            {/* Bottom Left Corner: Flipped X & Y, identical structure */}
            <div className="sp02-corner-bl">
                <div className="sp02-corner-group">
                    <div className="sp02-corner-item sp02-item-b5 sp02-anim-wayanGR">
                        <img src={ORNAMENTS.b5} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b3 sp02-anim-wayanGL">
                        <img src={ORNAMENTS.b3} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b4 sp02-anim-flc">
                        <img src={ORNAMENTS.b4} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b2 sp02-anim-pluse">
                        <img src={ORNAMENTS.b2} alt="" />
                    </div>
                    <div className="sp02-corner-item sp02-item-b1">
                        <img src={ORNAMENTS.b1} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, showPhotos, showGuestName }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const initials = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'G';
        const second = bride?.nickname?.charAt(0) || 'B';
        return `${first}${second}`;
    }, [groom, bride]);

    return (
        <div className={`sp02-cover ${isOpened ? 'is-opened' : ''} ${!showPhotos ? 'sp02-no-photo-mode' : ''}`}>
            {/* Background Slideshow */}
            {showPhotos && (
                <PremiumSlideshow
                    images={invitation?.cover_image ? invitation.cover_image.split(',') : [ORNAMENTS.bgCover]}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}
            
            {!invitation?.cover_image && (
                <img src={ORNAMENTS.gradasi} alt="" className="sp02-bg-pattern-gradasi opacity-40" />
            )}

            {/* Watercolor Cover Overlays */}
            <div className="sp02-cover__overlay" />

            {/* Rich Pampas Layered Corners */}
            <FlowerOrnaments isFixed={false} />

            <div className="sp02-cover__content">
                <div className="sp02-cover-card">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold text-[var(--sp02-primary)] mb-3">
                        {t('invitation.wedding_of').toUpperCase()}
                    </p>

                    {/* Circular Couples Photo with Pampas Frame Overlay */}
                    {showPhotos && invitation?.cover_image && (
                        <div className="relative w-36 h-36 mx-auto mb-6 sp02-breathe">
                            <div className="w-full h-full rounded-full overflow-hidden relative border border-white shadow-md">
                                <PremiumSlideshow
                                    images={invitation.cover_image.split(',')}
                                    positionX={invitation.cover_position_x}
                                    positionY={invitation.cover_position_y}
                                    zoom={invitation.cover_zoom}
                                />
                            </div>
                            <img src={ORNAMENTS.frame} alt="" className="sp02-avatar-frame__ornament w-16" style={{ bottom: -2, right: -10 }} />
                        </div>
                    )}

                    {/* Initials fallback monogram */}
                    {(!showPhotos || !invitation?.cover_image) && (
                        <div className="w-20 h-20 rounded-full border border-[var(--sp02-primary)]/20 flex items-center justify-center text-xl font-bold tracking-widest text-[var(--sp02-primary)] bg-[var(--sp02-bg-soft)]/90 shadow-sm mx-auto mb-6 sp02-breathe font-serif">
                            {initials}
                        </div>
                    )}

                    <h1 className="text-3xl sm:text-4xl text-[var(--sp02-primary)] sp02-font-script-style mb-4 leading-snug">
                        {coupleName}
                    </h1>
                    
                    {showGuestName && guest && (
                        <div className="w-full my-5 bg-[var(--sp02-bg-soft)]/65 border border-[var(--sp02-secondary)]/20 rounded-2xl p-4 shadow-sm backdrop-blur-xs">
                            <p className="text-[9px] uppercase tracking-[0.2em] opacity-50 mb-0.5">{t('invitation.to')}</p>
                            <p className="text-md font-bold text-[var(--sp02-primary)] sp02-font-heading-style tracking-wide">{guestName}</p>
                            <p className="text-[9px] opacity-40 mt-1 italic leading-tight">{t('invitation.dear_guest_desc')}</p>
                        </div>
                    )}

                    <button type="button" onClick={onOpen} id="tombol-buka" className="sp02-btn-primary mt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {t('invitation.open')}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, showPhotos, brideGrooms, events }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || bgs[0] || {};
    const coupleNickname = (groom.nickname && bride.nickname) ? `${groom.nickname} & ${bride.nickname}` : '';

    const rawOpeningTitle = invitation?.opening_title || '';
    const isWeddingOf = !rawOpeningTitle || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING OF' || 
                        rawOpeningTitle.toUpperCase() === 'PERNIKAHAN' || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING';

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    return (
        <div className="max-w-lg mx-auto py-4">
            <Reveal delay={100}>
                <p className="text-base font-semibold tracking-widest text-[var(--sp02-primary)] sp02-font-heading-style mb-4 text-center">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
            </Reveal>

            {/* Opening Slideshow Image */}
            {showPhotos && openingImages.length > 0 ? (
                <Reveal variant="zoom" delay={200}>
                    <div className="mx-auto rounded-2xl overflow-hidden my-6 max-w-[300px] shadow-md border-4 border-white relative aspect-[4/3] sp02-pulse-gold">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation.opening_position_x}
                            positionY={invitation.opening_position_y}
                            zoom={invitation.opening_zoom}
                        />
                    </div>
                </Reveal>
            ) : (
                coupleNickname && (
                    <Reveal delay={200}>
                        <div className="w-20 h-20 rounded-full border border-[var(--sp02-primary)]/20 flex items-center justify-center text-xl font-bold tracking-widest text-[var(--sp02-primary)] bg-[var(--sp02-bg-soft)]/90 shadow-sm mx-auto my-6 sp02-breathe font-serif">
                            {groom.nickname?.charAt(0) || 'G'}{bride.nickname?.charAt(0) || 'B'}
                        </div>
                    </Reveal>
                )
            )}

            {coupleNickname && (
                <Reveal delay={250}>
                    <h2 className="text-3xl sm:text-4xl text-[var(--sp02-primary)] sp02-font-script-style my-4 leading-none text-center">
                        {coupleNickname}
                    </h2>
                </Reveal>
            )}

            {invitation?.opening_ayat && (
                <Reveal delay={300}>
                    <div className="px-4 py-2 border-l-2 border-[var(--sp02-primary)]/15 italic my-4 text-center">
                        <p className="text-[13px] sm:text-[14px] leading-relaxed opacity-85 text-[var(--sp02-text)]">
                            &ldquo;{invitation.opening_ayat}&rdquo;
                        </p>
                        {invitation?.opening_ayat_source && (
                            <p className="text-[11px] font-semibold tracking-wider text-[var(--sp02-primary)] mt-1">
                                &mdash; {invitation.opening_ayat_source}
                            </p>
                        )}
                    </div>
                </Reveal>
            )}

            <Reveal delay={400}>
                <FlowerSwirl title={isWeddingOf ? t('invitation.wedding_of') : invitation.opening_title} />
            </Reveal>

            <Reveal delay={500}>
                <p className="text-[13px] sm:text-[14px] leading-relaxed whitespace-pre-line opacity-90 mt-2 px-2">
                    {invitation?.opening_text || "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami."}
                </p>
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, locale, showPhotos }) {
    const { t } = useTranslation();
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

    return (
        <div className="max-w-lg mx-auto">
            <Reveal>
                <FlowerSwirl title={t('invitation.mempelai')} />
            </Reveal>

            {/* Groom card */}
            <div className="space-y-12 mt-6">
                <Reveal variant="left" className="w-full flex justify-center">
                    <div className="sp02-mempelai-card w-full flex flex-col items-center">
                        <img src={ORNAMENTS.cardOrnament} className="sp02-mempelai-card-ornament-tl" alt="" />
                        {showPhotos && groom.photo && (
                            <div className="sp02-avatar-frame mb-4 sp02-breathe">
                                <div className="sp02-avatar-frame-inner">
                                    <img 
                                        src={getStorageUrl(groom.photo)} 
                                        alt={groom.full_name || 'Groom'} 
                                        className="sp02-strict-cover"
                                        style={{
                                            objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                            transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                        }}
                                    />
                                </div>
                                <img src={ORNAMENTS.frame} alt="" className="sp02-avatar-frame__ornament w-16" />
                            </div>
                        )}
                        
                        {(!showPhotos || !groom.photo) && (
                            <div className="sp02-avatar-fallback-arch">
                                {groom.nickname?.charAt(0) || 'G'}
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-[var(--sp02-primary)] sp02-font-heading-style tracking-wider">
                            {groom.full_name || 'Nama Lengkap Pria'}
                        </h3>
                        <p className="text-[9px] font-bold text-[var(--sp02-text-light)] mt-1.5 uppercase tracking-widest text-center">
                            {translateChildOrder(groom.child_order, 'pria')}
                        </p>
                        <p className="text-xs text-[var(--sp02-text)] mt-1 text-center">
                            {groom.father_name && groom.mother_name
                                ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                                : (groom.father_name || groom.mother_name || '')}
                        </p>
                        {groom.instagram && (
                            <a
                                href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sp02-mempelai-ig-pill"
                            >
                                <i className="fab fa-instagram text-xs" /> @{groom.instagram.replace('@', '')}
                            </a>
                        )}
                    </div>
                </Reveal>

                {/* Spliter Ampersand */}
                <Reveal variant="zoom">
                    <div className="text-4xl text-[var(--sp02-secondary)] sp02-font-script-style my-2">&amp;</div>
                </Reveal>

                {/* Bride card */}
                <Reveal variant="right" className="w-full flex justify-center">
                    <div className="sp02-mempelai-card w-full flex flex-col items-center">
                        <img src={ORNAMENTS.cardOrnament} className="sp02-mempelai-card-ornament-br" alt="" />
                        {showPhotos && bride.photo && (
                            <div className="sp02-avatar-frame mb-4 sp02-breathe" style={{ animationDelay: '1.5s' }}>
                                <div className="sp02-avatar-frame-inner">
                                    <img 
                                        src={getStorageUrl(bride.photo)} 
                                        alt={bride.full_name || 'Bride'} 
                                        className="sp02-strict-cover"
                                        style={{
                                            objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                            transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                        }}
                                    />
                                </div>
                                <img src={ORNAMENTS.frame} alt="" className="sp02-avatar-frame__ornament w-16" style={{ transform: 'scaleX(-1)', right: 'auto', left: '-12px' }} />
                            </div>
                        )}

                        {(!showPhotos || !bride.photo) && (
                            <div className="sp02-avatar-fallback-arch">
                                {bride.nickname?.charAt(0) || 'B'}
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-[var(--sp02-primary)] sp02-font-heading-style tracking-wider">
                            {bride.full_name || 'Nama Lengkap Wanita'}
                        </h3>
                        <p className="text-[9px] font-bold text-[var(--sp02-text-light)] mt-1.5 uppercase tracking-widest text-center">
                            {translateChildOrder(bride.child_order, 'wanita')}
                        </p>
                        <p className="text-xs text-[var(--sp02-text)] mt-1 text-center">
                            {bride.father_name && bride.mother_name
                                ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                                : (bride.father_name || bride.mother_name || '')}
                        </p>
                        {bride.instagram && (
                            <a
                                href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sp02-mempelai-ig-pill"
                            >
                                <i className="fab fa-instagram text-xs" /> @{bride.instagram.replace('@', '')}
                            </a>
                        )}
                    </div>
                </Reveal>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SAVE THE DATE / COUNTDOWN PART
   ═══════════════════════════════════════ */
function CountdownBlock({ events, invitation }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDate = invitation?.countdown_target_date || primaryEvent?.event_date || '';
    const targetTime = targetDate === invitation?.countdown_target_date 
        ? (String(invitation?.countdown_target_date).substring(11, 16) || '08:00')
        : (primaryEvent?.start_time || '08:00');

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

    const items = [
        { label: t('invitation.days'), val: pad2(timeLeft.d) },
        { label: t('invitation.hours'), val: pad2(timeLeft.h) },
        { label: t('invitation.minutes'), val: pad2(timeLeft.m) },
        { label: t('invitation.seconds'), val: pad2(timeLeft.s) }
    ];

    return (
        <div className="sp02-countdown-grid">
            {items.map((item, i) => (
                <div key={i} className="sp02-countdown-item">
                    <span className="text-xl sm:text-2xl font-bold text-white sp02-font-heading-style leading-none mb-1">
                        {item.val}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white/80 uppercase tracking-wider">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   EVENTS & MAPS SECTION
   ═══════════════════════════════════════ */
function EventSection({ events, showPhotos, locale, showCountdown, galleries, invitation }) {
    const { t } = useTranslation();
    const list = safeArr(events);
    const isEn = locale === 'en';

    const [randomGalleryImages, setRandomGalleryImages] = useState({});

    useEffect(() => {
        const pics = safeArr(galleries);
        if (pics.length === 0) return;

        const resolved = {};
        list.forEach((evt, idx) => {
            const randIdx = idx % pics.length;
            resolved[evt.id || idx] = getStorageUrl(pics[randIdx].image_path || pics[randIdx].image_url);
        });
        setRandomGalleryImages(resolved);
    }, [galleries, list]);

    return (
        <div className="max-w-lg mx-auto">
            {showCountdown && (
                <Reveal variant="zoom" className="w-full">
                    <CountdownBlock events={events} invitation={invitation} />
                </Reveal>
            )}

            <Reveal>
                <FlowerSwirl title={t('nav.acara')} />
            </Reveal>

            {list.map((evt, idx) => {
                const eventImg = getStorageUrl(evt.image, null) 
                    || randomGalleryImages[evt.id || idx] 
                    || ORNAMENTS.bouquet;
                const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date, locale);
                const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Acara');
                const isEven = idx % 2 === 0;

                return (
                    <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="sp02-event-card">
                        <img src={ORNAMENTS.b1} className="sp02-event-card-ornament-tr" alt="" />
                        {showPhotos && eventImg && (
                            <div className="sp02-event-banner">
                                <img src={eventImg} alt={evt.event_name} className="sp02-strict-cover" />
                            </div>
                        )}
                        <div className="sp02-event-body">
                            {/* Left column: Vertical event title */}
                            <div className="sp02-event-vertical-title-container">
                                <div className="sp02-event-vertical-title">{eventDisplayName}</div>
                            </div>
                            
                            {/* Right column: Info */}
                            <div className="sp02-event-details">
                                <div className="sp02-event-date-row">
                                    <span className="sp02-event-date-num">{dayNum}</span>
                                    <div className="sp02-event-date-col">
                                        <span className="sp02-event-date-day">{dayName}</span>
                                        <span className="text-[var(--sp02-text-light)]">{monthName} {year}</span>
                                    </div>
                                </div>
                                
                                <div className="h-px bg-gray-100 my-3" />
                                
                                <p className="text-[12px] opacity-80 mb-2">
                                    <i className="far fa-clock text-[var(--sp02-primary)] mr-1.5" />
                                    {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : (isEn ? ' - End' : ' - Selesai')} {evt.timezone || 'WIB'}
                                </p>
                                
                                <div className="text-[12px] opacity-80 leading-normal mb-4">
                                    <i className="fas fa-map-marker-alt text-[var(--sp02-primary)] mr-2" />
                                    <strong>{evt.venue_name}</strong>
                                    <p className="pl-4 mt-0.5 opacity-75">{evt.venue_address}</p>
                                </div>

                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sp02-btn-secondary inline-flex items-center gap-1.5 w-full justify-center text-[10px]"
                                    >
                                        <i className="fas fa-location-arrow text-[8px]" /> Google Maps
                                    </a>
                                )}
                            </div>
                        </div>
                    </Reveal>
                );
            })}

                                {/* Compact standalone Dress Code box below event list */}
                                {list?.filter(evt => evt.show_dress_code).map((evt, idx) => (
                                    <div key={`dc-${idx}`} className="sp02-event-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={evt} colors={{ primary: 'var(--sp02-primary)', text: 'var(--sp02-text)' }} fonts={{ heading: 'var(--sp02-font-heading)' }} variant="modern" plain={true} />
                                    </div>
                                ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY / TIMELINE SECTION
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    return (
        <div className="max-w-lg mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} />
            </Reveal>

            <Reveal variant="zoom" className="sp02-timeline">
                {list.map((story, i) => (
                    <div key={story.id || i} className="sp02-timeline-item">
                        <div className="sp02-story-bubble">
                            <div className="sp02-timeline-date">
                                {story.story_date ? new Date(story.story_date).getFullYear() : story.year || ''}
                            </div>
                            <h4 className="sp02-timeline-title">
                                {story.title}
                            </h4>
                            <p className="sp02-timeline-desc">
                                {story.description}
                            </p>
                        </div>
                    </div>
                ))}
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   GALLERY GRID SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.galeri')} />
            </Reveal>

            <div className="grid grid-cols-2 gap-3 mt-6 px-1">
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
                            <img src={imgUrl} alt={item.caption || 'Galeri'} className="sp02-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   VIDEO GALLERY SECTION
   ═══════════════════════════════════════ */
function VideoGallerySection({ invitation, locale }) {
    const videoList = safeArr(invitation?.video_list);
    const videoItems = [];

    videoList.forEach((url, idx) => {
        const ytId = getYoutubeId(url);
        if (ytId) {
            videoItems.push({
                ytId,
                url,
                title: locale === 'en' ? `Moment Video #${idx + 1}` : `Momen Video #${idx + 1}`
            });
        }
    });

    if (videoItems.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={locale === 'en' ? 'Video Gallery' : 'Galeri Video'} />
            </Reveal>

            <div className="flex flex-col gap-6 mt-6 px-1">
                {videoItems.map((item, idx) => (
                    <Reveal key={idx} variant="zoom" delay={idx * 100} className="w-full">
                        <div className="flex flex-col gap-2 text-left">
                            {videoItems.length > 1 && (
                                <h4 className="text-xs sm:text-sm font-bold text-[var(--sp02-primary)] tracking-wide">
                                    {item.title}
                                </h4>
                            )}
                            <div className="relative w-full aspect-video overflow-hidden rounded-2xl border-2 border-white shadow-md bg-black">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${item.ytId}?autoplay=0&rel=0&showinfo=1&controls=1&mute=0`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full border-0"
                                />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   LIVESTREAM SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, locale }) {
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
        <div className="max-w-lg mx-auto text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Live Streaming' : 'Siaran Langsung'} />
            </Reveal>
            
            <Reveal variant="zoom" className="sp02-card mt-6">
                <p className="text-xs sm:text-sm opacity-80 mb-6">
                    {isEn ? 'Join our wedding virtually from your device:' : 'Saksikan momen sakral kami secara virtual melalui tautan berikut:'}
                </p>
                <div className="space-y-3">
                    {streamsList.map((stream, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => window.open(stream.url, '_blank')} 
                            className="sp02-btn-primary w-full text-xs font-semibold py-3"
                        >
                            <i className="fas fa-video text-xs" /> WATCH ON {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   BANKING GIFT SECTION
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, copiedIdx, handleCopy }) {
    const { t } = useTranslation();
    const list = safeArr(bankAccounts);

    if (list.length === 0) return null;

    return (
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={t('nav.hadiah')} />
            </Reveal>

            <div className="space-y-6 mt-8">
                {list.map((account, i) => {
                    const isBca = String(account.bank_name).toLowerCase().includes('bca');
                    const isDana = String(account.bank_name).toLowerCase().includes('dana');
                    
                    return (
                        <Reveal key={account.id || i} variant="zoom" delay={i * 150} className="sp02-bank-card relative overflow-hidden">
                            <div className="sp02-bank-card__header flex items-center justify-between z-10 relative">
                                {isBca && <img src={ORNAMENTS.bca} alt="BCA" className="sp02-bank-card__logo h-6 object-contain" />}
                                {isDana && <img src={ORNAMENTS.dana} alt="DANA" className="sp02-bank-card__logo h-5 object-contain" />}
                                {!isBca && !isDana && (
                                    <span className="font-bold text-lg text-white select-none">
                                        {account.bank_name}
                                    </span>
                                )}
                                <img src={ORNAMENTS.chip} alt="Chip" className="sp02-bank-card__chip w-10 object-contain select-none" />
                            </div>
                            <div className="sp02-bank-card__body my-4 z-10 relative text-left">
                                <div className="sp02-bank-card__number text-xl font-bold tracking-widest text-white">{account.account_number}</div>
                                <div className="sp02-bank-card__holder text-[11px] font-medium tracking-wider text-white/80 uppercase mt-1">{account.account_name}</div>
                            </div>
                            <div className="sp02-bank-card__footer z-10 relative flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => handleCopy(account.account_number, i)} 
                                    className="sp02-bank-card__copy-btn"
                                >
                                    <i className={copiedIdx === i ? "fas fa-check" : "far fa-copy"} />
                                    <span>{copiedIdx === i ? t('invitation.gift_copied') || 'SALIN BERHASIL' : t('invitation.gift_copy') || 'SALIN NOMOR'}</span>
                                </button>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES UNIFIED FORM SECTION
   ═══════════════════════════════════════ */
function WishesRsvpSection({ invitation, guest, wishes, enableRsvp, enableWishes }) {
    const wishesInputRef = React.useRef(null);
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';
    const isEn = t('invitation.save_the_date') === 'Save The Date';

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
        <div className="max-w-lg mx-auto py-16 px-6">
            <Reveal>
                <FlowerSwirl title={sectionTitle} />
                <p className="text-xs sm:text-sm opacity-80 mb-4 text-center">
                    {isEn
                        ? 'Please fill out the form below to send your confirmation and wishes.'
                        : 'Mohon isi formulir berikut untuk mengirimkan konfirmasi dan ucapan doa Anda.'}
                </p>
            </Reveal>

            <Reveal variant="zoom" className="sp02-card mt-6">
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {/* Nama Lengkap */}
                    <div>
                        <label className="text-[10px] font-bold text-[var(--sp02-text-light)] uppercase tracking-wider block mb-1.5">
                            {isEn ? 'Your Name' : 'Nama Lengkap'}
                        </label>
                        <input
                            type="text"
                            placeholder={isEn ? 'Your Name' : 'Nama Lengkap'}
                            readOnly={!!activeGuest.name && activeGuest.name !== 'Tamu Undangan'}
                            value={sharedName}
                            onChange={(e) => setSharedName(e.target.value)}
                            className="sp02-input"
                            required
                        />
                    </div>

                    {/* Konfirmasi Kehadiran */}
                    {enableRsvp && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp02-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Attendance Status' : 'Status Kehadiran'}
                            </label>
                            <select
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                                className="sp02-input select-none"
                            >
                                <option value="hadir">{t('invitation.rsvp_hadir') || 'Hadir'}</option>
                                <option value="tidak_hadir">{t('invitation.rsvp_tidak_hadir') || 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{t('invitation.rsvp_belum_pasti') || 'Belum Pasti'}</option>
                            </select>
                        </div>
                    )}

                    {/* Jumlah Orang */}
                    {enableRsvp && attendance === 'hadir' && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp02-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Number of Guests' : 'Jumlah Orang'}
                            </label>
                            <select
                                value={numGuests}
                                onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)}
                                className="sp02-input"
                            >
                                {[1, 2, 3, 4, 5].map(v => (
                                    <option key={v} value={v}>{v} {isEn ? (v === 1 ? 'Person' : 'People') : 'Orang'}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Ucapan & Doa */}
                    {enableWishes && (
                        <div>
                            <label className="text-[10px] font-bold text-[var(--sp02-text-light)] uppercase tracking-wider block mb-1.5">
                                {isEn ? 'Wishes & Prayers' : 'Pesan / Ucapan'}
                            </label>
                            <WishesEmojiPicker
                                    value={message}
                                    onChange={setMessage}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef}
                                placeholder={t('invitation.wishes_placeholder') || 'Tulis pesan doa dan ucapan manis Anda di sini...'}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="sp02-input"
                                rows={3}
                                required={!enableRsvp}
                            />
                                </WishesEmojiPicker>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="sp02-btn-primary w-full text-xs font-semibold py-3 mt-2"
                    >
                        {isSubmitting ? (isEn ? 'SENDING...' : 'KIRIM...') : (isEn ? 'SEND MESSAGE' : 'KIRIM KONFIRMASI & UCAPAN')}
                    </button>

                    {success && (
                        <p className="text-xs text-[var(--sp02-primary)] font-bold text-center mt-3">
                            ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                        </p>
                    )}
                </form>

                {/* Wishes list scrollable */}
                {enableWishes && recentWishes.length > 0 && (
                    <div className="sp02-wishes-box mt-6 pt-4 border-t border-[var(--sp02-secondary)]/15">
                        {recentWishes.map((w, idx) => (
                            <div key={w.id || idx} className="sp02-wish-item">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="sp02-wish-sender font-bold text-[var(--sp02-primary)] text-xs">{w.sender_name || w.name}</span>
                                    {w.attendance && (
                                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            w.attendance === 'hadir' 
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                                : 'bg-rose-50 text-rose-600 border border-rose-200'
                                        }`}>
                                            {w.attendance === 'hadir' ? (t('invitation.rsvp_hadir') || 'Hadir') : (t('invitation.rsvp_tidak_hadir') || 'Tidak Hadir')}
                                        </span>
                                    )}
                                </div>
                                <div className="text-[12px] leading-relaxed text-[var(--sp02-text)] opacity-90">{w.message}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const hasGroomParents = groom.father_name || groom.mother_name;
    const hasBrideParents = bride.father_name || bride.mother_name;

    const isEn = locale === 'en';

    // Watermark dynamic brand reseller name
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className="max-w-lg mx-auto text-center py-4 flex flex-col items-center">
            <Reveal delay={100}>
                <FlowerSwirl title={invitation?.closing_title || t('invitation.closing_title') || 'Terima Kasih'} />
            </Reveal>

            <Reveal delay={300}>
                <p className="text-[13px] leading-relaxed whitespace-pre-line opacity-90 px-4 mt-2 mb-6">
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.'}
                </p>
            </Reveal>

            <Reveal delay={400} className="space-y-4 text-xs opacity-75 font-semibold uppercase tracking-wider text-[var(--sp02-text-light)]">
                <p className="text-[11px] font-bold text-[var(--sp02-primary)] sp02-font-heading-style tracking-widest">
                    {isEn ? 'WE ARE COMMITTED UNDER LOVE' : 'KAMI YANG BERBAHAGIA'}
                </p>
                <div className="space-y-2">
                    {hasGroomParents && (
                        <div>
                            {isEn 
                                ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` 
                                : `Keluarga Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </div>
                    )}
                    {hasBrideParents && (
                        <div>
                            {isEn 
                                ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` 
                                : `Keluarga Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </div>
                    )}
                </div>
            </Reveal>

            <Reveal delay={500}>
                <FlowerSwirl />
            </Reveal>

            <p className="sp02-watermark relative z-10 select-none pb-6">
                Made with <img src={ORNAMENTS.heart} alt="love" className="w-3 h-3 inline-block" /> by {brandName}
            </p>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT PORT export
   ═══════════════════════════════════════ */
export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScroll, setAutoScroll] = useState(invitation?.enable_auto_scroll !== false);
    const [showQrCode, setShowQrCode] = useState(false);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const [activeSection, setActiveSection] = useState('opening');
    const [slideIdx, setSlideIdx] = useState(0);

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const layoutMode = invitation?.layout_mode || 'scroll'; // 'scroll', 'slide-h', 'slide-v'
    const isHorizontal = layoutMode === 'slide-h';

    // Global settings injection
    const showPhotos = invitation?.show_photos !== false;
    const showAnimations = invitation?.show_animations !== false;
    const showGuestName = invitation?.show_guest_name !== false;
    const enableRsvp = invitation?.enable_rsvp !== false;
    const enableWishes = invitation?.enable_wishes !== false;
    const enableQr = invitation?.enable_qr !== false && invitation?.show_qr_code !== false;

    const hasVideos = useMemo(() => {
        return safeArr(invitation?.video_list).length > 0 &&
            (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);
    }, [invitation?.video_list, invitation?.video_playback]);

    useEffect(() => {
        globalShowPhotos = showPhotos;
        globalShowAnimations = showAnimations;
    }, [showPhotos, showAnimations]);

    // Error safety boundary fallback resolution list
    const resolvedSections = useMemo(() => {
        const list = safeArr(sections);
        const coverFiltered = list.filter(s => s.section_key !== 'cover' && s.section_key !== 'countdown');
        
        // Anti duplicate wishes/rsvp form check in i18n settings
        const hasRsvp = coverFiltered.some(s => s.section_key === 'rsvp');
        const filtered = coverFiltered.filter(s => {
            if (s.section_key === 'wishes' && hasRsvp) return false; // RSVP includes Wishes
            return true;
        });

        // Insert video section right after gallery if hasVideos is true
        const result = [];
        filtered.forEach(s => {
            result.push(s);
            if (s.section_key === 'gallery' && hasVideos) {
                if (!filtered.some(f => f.section_key === 'video')) {
                    result.push({
                        id: 'virtual-video-section',
                        section_key: 'video',
                        section_name: isEn ? 'Videos' : 'Video',
                        is_visible: true
                    });
                }
            }
        });

        // Fallback: If gallery is not in database sections but hasVideos is true, make sure video is still included
        if (hasVideos && !result.some(r => r.section_key === 'video')) {
            result.push({
                id: 'virtual-video-section',
                section_key: 'video',
                section_name: isEn ? 'Videos' : 'Video',
                is_visible: true
            });
        }

        return result;
    }, [sections, hasVideos, isEn]);

    const showCountdown = parseBool(invitation?.show_countdown);
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

    const activeSectionKey = useMemo(() => {
        if (layoutMode === 'scroll') return activeSection;
        return resolvedSections[slideIdx]?.section_key || 'opening';
    }, [layoutMode, activeSection, slideIdx, resolvedSections]);

    // Handle Copy Number
    const handleCopy = (num, idx) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2500);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedIdx(idx);
                    setTimeout(() => setCopiedIdx(null), 2500);
                });
        } else {
            fallbackCopy(num);
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2500);
        }
    };

    // Fullscreen listeners
    useEffect(() => {
        const handleFs = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFs);
        return () => document.removeEventListener('fullscreenchange', handleFs);
    }, []);

    const toggleFs = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    const handleOpen = () => {
        setIsOpened(true);
        const autoplay = invitation?.music_autoplay !== false;
        if (autoplay && invitation?.music_url && audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log('Audio autoplay blocked:', err));
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    // Swipe page triggers in slide modes
    const touchStart = useRef(null);
    
    const handleTouchStart = (e) => {
        if (layoutMode === 'scroll') return;
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (layoutMode === 'scroll' || !touchStart.current) return;
        
        const dx = e.changedTouches[0].clientX - touchStart.current.x;
        const dy = e.changedTouches[0].clientY - touchStart.current.y;
        
        const isHorizontalLayout = layoutMode === 'slide-h';
        const axisDelta = isHorizontalLayout ? dx : dy;
        
        if (Math.abs(isHorizontalLayout ? dx : dy) > 50 && Math.abs(isHorizontalLayout ? dx : dy) > Math.abs(isHorizontalLayout ? dy : dx)) {
            if (axisDelta < 0) {
                // Next
                setSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
            } else {
                // Prev
                setSlideIdx(prev => Math.max(prev - 0, 0));
            }
        }
        touchStart.current = null;
    };

    // Scrollspy and dynamic menu highlight in scroll mode
    useEffect(() => {
        if (layoutMode !== 'scroll' || !isOpened) return;

        const handleScroll = () => {
            const elements = document.querySelectorAll('[data-section]');
            let current = 'opening';
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top <= 250) {
                    current = el.dataset.section;
                }
            });
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [layoutMode, isOpened]);

    // Stale closure synchronizer for slide index
    useEffect(() => {
        if (layoutMode === 'scroll') return;
        const target = resolvedSections[slideIdx]?.section_key;
        if (target) setActiveSection(target);
    }, [slideIdx, resolvedSections, layoutMode]);

    // Pixel auto scroll in scroll mode, and index swiper in slide modes
    useEffect(() => {
        if (!isOpened || !autoScroll) return;

        const isSlide = layoutMode === 'slide-h' || layoutMode === 'slide-v';
        let timer = null;

        if (isSlide) {
            timer = setInterval(() => {
                setSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) return 0;
                    return prev + 1;
                });
            }, 5500);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isAtBottom) {
                    setAutoScroll(false);
                }
            }, 25);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScroll, layoutMode, resolvedSections.length]);



    // Navigation jumps
    const jumpToSection = (key) => {
        if (layoutMode === 'scroll') {
            const el = document.getElementById(`section-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx >= 0) setSlideIdx(idx);
        }
    };

    // Particles background rendering
    const particleType = invitation?.particle_type || 'gold-dust';

    return (
        <ErrorBoundary>
            <div className={`sp02-theme-wrapper ${!showAnimations ? 'theme-no-animations' : ''}`}>
                <Head title={invitation?.title || 'Undangan Pernikahan'} />
                
                {/* Background music audio player */}
                {invitation?.music_url && (
                    <audio ref={audioRef} src={invitation.music_url} loop />
                )}

                {/* Particle effect background */}
                {isOpened && particleType !== 'none' && (
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        <ParticleEffect type={particleType} />
                    </div>
                )}

                {/* Fixed Background layered ornaments revealed after Buka Undangan */}
                {isOpened && <FlowerOrnaments isFixed={true} />}

                {/* 1. COVER OVERLAY SCREEN */}
                <CoverSection 
                    invitation={invitation} 
                    brideGrooms={brideGrooms} 
                    guest={guest} 
                    isOpened={isOpened} 
                    onOpen={handleOpen}
                    showPhotos={showPhotos}
                    showGuestName={showGuestName}
                />

                {/* 2. MAIN APPLICATION CONTENT */}
                {isOpened && (
                    <div className="relative z-10 w-full min-h-screen">
                        
                        {/* Scroll Spy / Dynamic Layout mode handler */}
                        {layoutMode === 'scroll' ? (
                            <div className="w-full flex flex-col items-center">
                                {resolvedSections.map((sec) => (
                                    <div 
                                        key={sec.id} 
                                        id={`section-${sec.section_key}`} 
                                        data-section={sec.section_key}
                                        className="sp02-section w-full max-w-xl"
                                    >
                                        {sec.section_key === 'opening' && (
                                            <OpeningSection invitation={invitation} showPhotos={showPhotos} brideGrooms={brideGrooms} events={events} />
                                        )}
                                        {sec.section_key === 'bride_groom' && (
                                            <BrideGroomSection brideGrooms={brideGrooms} locale={locale} showPhotos={showPhotos} />
                                        )}
                                        {sec.section_key === 'event' && (
                                            <EventSection 
                                                events={events} 
                                                showPhotos={showPhotos} 
                                                locale={locale} 
                                                showCountdown={showCountdownInEvent}
                                                galleries={galleries}
                                            />
                                        )}
                                        {sec.section_key === 'love_story' && (
                                            <LoveStorySection loveStories={loveStories} />
                                        )}
                                        {sec.section_key === 'gallery' && (
                                            <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                        )}
                                        {sec.section_key === 'video' && (
                                            <VideoGallerySection invitation={invitation} locale={locale} />
                                        )}
                                        {sec.section_key === 'livestream' && (
                                            <LiveStreamingSection events={events} locale={locale} />
                                        )}
                                        {sec.section_key === 'bank' && (
                                            <BankSection bankAccounts={bankAccounts} copiedIdx={copiedIdx} handleCopy={handleCopy} />
                                        )}
                                        {sec.section_key === 'rsvp' && (
                                            <WishesRsvpSection 
                                                invitation={invitation}
                                                guest={guest}
                                                wishes={wishes}
                                                enableRsvp={enableRsvp}
                                                enableWishes={enableWishes}
                                            />
                                        )}
                                        {sec.section_key === 'closing' && (
                                            <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* SLIDE MODES (HORIZONTAL / VERTICAL) */
                            <div 
                                className="sp02-slide-mode-container"
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {resolvedSections.map((sec, idx) => {
                                    const isActive = idx === slideIdx;
                                    const isNext = idx === slideIdx + 1;
                                    const isPrev = idx === slideIdx - 1;
                                    
                                    let statusClass = '';
                                    if (isActive) statusClass = 'is-active';
                                    else if (isNext) statusClass = 'is-next';
                                    else if (isPrev) statusClass = 'is-prev';

                                    return (
                                        <div 
                                            key={sec.id}
                                            className={`sp02-slide-wrapper ${statusClass}`}
                                        >
                                            <div className="sp02-section w-full max-w-xl mx-auto min-h-screen py-16">
                                                {sec.section_key === 'opening' && (
                                                    <OpeningSection invitation={invitation} showPhotos={showPhotos} brideGrooms={brideGrooms} events={events} />
                                                )}
                                                {sec.section_key === 'bride_groom' && (
                                                    <BrideGroomSection brideGrooms={brideGrooms} locale={locale} showPhotos={showPhotos} />
                                                )}
                                                {sec.section_key === 'event' && (
                                                    <EventSection 
                                                        events={events} 
                                                        showPhotos={showPhotos} 
                                                        locale={locale} 
                                                        showCountdown={showCountdownInEvent}
                                                        galleries={galleries}
                                                    />
                                                )}
                                                {sec.section_key === 'love_story' && (
                                                    <LoveStorySection loveStories={loveStories} />
                                                )}
                                                {sec.section_key === 'gallery' && (
                                                    <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                                )}
                                                {sec.section_key === 'video' && (
                                                    <VideoGallerySection invitation={invitation} locale={locale} />
                                                )}
                                                {sec.section_key === 'livestream' && (
                                                    <LiveStreamingSection events={events} locale={locale} />
                                                )}
                                                {sec.section_key === 'bank' && (
                                                    <BankSection bankAccounts={bankAccounts} copiedIdx={copiedIdx} handleCopy={handleCopy} />
                                                )}
                                                {sec.section_key === 'rsvp' && (
                                                    <WishesRsvpSection 
                                                        invitation={invitation}
                                                        guest={guest}
                                                        wishes={wishes}
                                                        enableRsvp={enableRsvp}
                                                        enableWishes={enableWishes}
                                                    />
                                                )}
                                                {sec.section_key === 'closing' && (
                                                    <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 3. SIDEBAR FLOATING CONTROLS */}
                        <div className="fixed right-4 bottom-24 z-40 flex flex-col gap-2.5">
                            {/* QR CODE PRESENSI CHECK-IN TRIGGER */}
                            {enableQr && guest && (
                                <button 
                                    type="button" 
                                    onClick={() => setShowQrCode(true)}
                                    className="sp02-control-btn"
                                    title="QR Code Presensi"
                                >
                                    <i className="fas fa-qrcode" />
                                </button>
                            )}

                            {/* FULLSCREEN MODE TOGGLER */}
                            <button 
                                type="button" 
                                onClick={toggleFs} 
                                className="sp02-control-btn"
                                title="Fullscreen"
                            >
                                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                            </button>

                            {/* AUDIO BACKSOUND CONTROLLER */}
                            {invitation?.music_url && (
                                <button 
                                    type="button" 
                                    onClick={togglePlay}
                                    className={`sp02-control-btn ${isPlaying ? 'is-active' : ''}`}
                                    title={isPlaying ? "Mute" : "Play music"}
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

                            {/* AUTO SCROLL TOGGLER */}
                            {invitation?.enable_auto_scroll !== false && (
                                <button 
                                    type="button" 
                                    onClick={() => setAutoScroll(!autoScroll)}
                                    className={`sp02-control-btn ${autoScroll ? 'is-active' : ''}`}
                                    title="Auto Scroll"
                                >
                                    <i className="fas fa-chevron-down" style={{ transform: autoScroll ? 'none' : 'rotate(-90deg)', transition: 'transform 0.3s' }} />
                                </button>
                            )}
                        </div>

                        {/* 4. PREMIUM COMPACT NAVIGATION FLOATING BAR */}
                        {invitation?.menu_position !== 'none' && (
                            <div className="sp02-nav-menu">
                                <div className="sp02-nav-menu__inner--row flex justify-around">
                                    {resolvedSections.map((sec) => {
                                        const key = sec.section_key;
                                        const isCurrent = activeSectionKey === key;
                                        let navIcon = 'fa-star';
                                        let labelText = sec.section_name || key;
                                        if (key === 'opening') { navIcon = 'fa-star'; labelText = t('nav.pembuka') || 'Pembuka'; }
                                        else if (key === 'bride_groom') { navIcon = 'fa-heart'; labelText = t('nav.mempelai') || 'Mempelai'; }
                                        else if (key === 'event') { navIcon = 'fa-calendar-alt'; labelText = t('nav.acara') || 'Acara'; }
                                        else if (key === 'love_story') { navIcon = 'fa-book-open'; labelText = t('nav.kisah') || 'Kisah'; }
                                        else if (key === 'gallery') { navIcon = 'fa-images'; labelText = t('nav.galeri') || 'Galeri'; }
                                        else if (key === 'livestream') { navIcon = 'fa-video'; labelText = t('nav.streaming') || 'Siaran'; }
                                        else if (key === 'bank') { navIcon = 'fa-gift'; labelText = t('nav.hadiah') || 'Hadiah'; }
                                        else if (key === 'rsvp') { navIcon = 'fa-envelope-open-text'; labelText = t('nav.rsvp') || 'RSVP'; }
                                        else if (key === 'closing') { navIcon = 'fa-handshake'; labelText = t('nav.penutup') || 'Penutup'; }

                                        return (
                                            <button 
                                                key={sec.id}
                                                type="button"
                                                onClick={() => jumpToSection(key)}
                                                className={`sp02-nav-menu__item ${isCurrent ? 'active' : ''}`}
                                                title={sec.section_name}
                                            >
                                                <i className={`fas ${navIcon}`} />
                                                <span className="sp02-nav-item-text">{labelText}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* 5. PRESENSI CHECK-IN MODAL OVERLAY */}
                        {enableQr && showQrCode && guest && (
                            <div className="sp02-modal-overlay z-50 flex items-center justify-center p-4">
                                <div className="sp02-modal-card text-center max-w-[290px] w-full p-6 relative">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowQrCode(false)} 
                                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <i className="fas fa-times text-md" />
                                    </button>
                                    <h4 className="text-[15px] font-bold text-[var(--sp02-primary)] sp02-font-heading-style mb-4 tracking-wide">
                                        {isEn ? 'PRESENCE CHECK-IN QR' : 'QR CODE PRESENSI'}
                                    </h4>
                                    <div className="mx-auto border border-gray-100 p-2 rounded-2xl bg-white w-[180px] h-[180px] flex items-center justify-center shadow-xs">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=986a52&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="QR Code Presensi" 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-[12px] text-[var(--sp02-text)] mt-4 font-semibold tracking-wide">
                                        {guest.name}
                                    </p>
                                    <p className="text-[9px] opacity-60 mt-1">
                                        {isEn ? 'Show this QR code to the reception desk for instant check-in.' : 'Tunjukkan QR Code ini pada penerima tamu untuk check-in kehadiran.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
