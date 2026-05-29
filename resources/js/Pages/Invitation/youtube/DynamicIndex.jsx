import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

import PremiumSlideshow from '@/Components/PremiumSlideshow';

// Fallback dummy images if none are uploaded
const dummyPortrait = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
const dummyCover = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200';

/* ─── Helper Functions ─── */
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

function pad2(n) { return String(n).padStart(2, '0'); }

function formatStoryDate(dateStr) {
    if (!dateStr) return '';
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    if (datePattern.test(dateStr)) {
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('id-ID', {
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

// Translate child order ordinals
const translateChildOrder = (childOrder, gender, locale) => {
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

/* ─── Global Override States ─── */
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ─── Error Boundary ─── */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="yt-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema YouInvite.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ─── Reveal Component ─── */
function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);
    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className={`${className} ${!globalShowAnimations ? '' : (visible ? 'yt-reveal--in' : 'yt-reveal--out')}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}>
            {children}
        </div>
    );
}

/* ─── Countdown Component ─── */
function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const target = new Date(`${ds}T08:00:00`);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCd({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000)
            });
        };
        tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
    }, [targetDate]);

    return (
        <div className="yt-countdown">
            {[['d', t('invitation.days')], ['h', t('invitation.hours')], ['m', t('invitation.minutes')], ['s', t('invitation.seconds') || 'Detik']].map(([k, lbl], idx) => (
                <div key={k} className="yt-countdown__item">
                    <span className="yt-countdown__val">{pad2(cd[k])}</span>
                    <span className="yt-countdown__lbl">{lbl}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Header Bar (Classic YouInvite Web App Header) ─── */
function HeaderBar({ isSingleHost, mainName, isOpened, onOpen }) {
    return (
        <header className="yt-header">
            <div className="yt-header__left">
                <button type="button" className="yt-header__menu-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"/></svg>
                </button>
                <div className="yt-header__logo">
                    <svg viewBox="0 0 24 24" width="30" height="24" fill="#FF0000">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        <path d="M10 8.5l5 3.5-5 3.5z" fill="#FFF"/>
                    </svg>
                    <span className="yt-header__logo-text">YouInvite</span>
                    <span className="yt-header__logo-country">ID</span>
                </div>
            </div>

            <div className="yt-header__right">
                <button type="button" className="yt-header__action-btn" title="Create">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm9-1c0 5.5-4.5 10-10 10S3 17.5 3 12 7.5 2 13 2s10 4.5 10 10zm-1 0c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z"/></svg>
                </button>
                <button type="button" className="yt-header__action-btn" title="Search">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.87 20.17l-5.14-5.14a7.92 7.92 0 10-.7.7l5.14 5.14a.5.5 0 00.7 0l.01-.01a.5.5 0 000-.7zM4 10a6 6 0 116 6 6 6 0 01-6-6z"/></svg>
                </button>
                <button type="button" className="yt-header__action-btn" title="Notifications">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.5V19H4v-1.5L6 16v-5c0-3.07 1.64-5.64 4.5-6.32V4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.68C16.36 5.36 18 7.92 18 11v5l2 1.5zm-1.88-1.54L17 14.84V11c0-2.31-1.34-4.22-3.66-4.78C12.87 6.11 12.44 6 12 6c-.44 0-.87.11-1.34.22C8.34 6.78 7 8.69 7 11v3.84l-1.12 1.12C5.35 16.48 5.11 17 5 17h14c-.11 0-.35-.52-.88-1.04z"/></svg>
                </button>
                {!isOpened ? (
                    <button type="button" onClick={onOpen} className="yt-header__signin-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                        <span>Sign in</span>
                    </button>
                ) : (
                    <div className="yt-header__user-avatar">{mainName?.charAt(0)}</div>
                )}
            </div>
        </header>
    );
}

/* ─── Cover Section ─── */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t, locale } = useTranslation();
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);

    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    const isSingleHost = bgs.length <= 1 || ['birthday', 'graduation', 'aqiqah', 'circumcision'].includes(invitation?.type);
    
    const titleText = isSingleHost 
        ? (host.full_name || 'Celebration') 
        : bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');

    // Resolve YouTube cover embed ID
    let coverEmbedId = '';
    const coverVideoUrl = invitation?.cover_video_url;
    if (coverVideoUrl) {
        if (coverVideoUrl.includes('youtube.com/watch?v=')) {
            coverEmbedId = coverVideoUrl.split('v=')[1]?.split('&')[0];
        } else if (coverVideoUrl.includes('youtu.be/')) {
            coverEmbedId = coverVideoUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (coverVideoUrl.includes('youtube.com/embed/')) {
            coverEmbedId = coverVideoUrl.split('embed/')[1]?.split('?')[0];
        }
    }

    return (
        <div className={`yt-cover ${isOpened ? 'is-opened' : ''}`}>
            <HeaderBar isSingleHost={isSingleHost} mainName={titleText} isOpened={isOpened} onOpen={onOpen} />
            
            <div className="yt-cover__main">
                {/* Simulated Video Player Box */}
                <div className="yt-video-player" onClick={onOpen}>
                    {globalShowPhotos && coverEmbedId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${coverEmbedId}?autoplay=1&mute=1&loop=1&playlist=${coverEmbedId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0`}
                            title="Cover Video"
                            frameBorder="0"
                            className="yt-video-player__media pointer-events-none scale-105"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    ) : globalShowPhotos && invitation?.cover_image ? (
                        <PremiumSlideshow
                            images={invitation.cover_image.split(',')}
                            positionX={invitation?.cover_position_x}
                            positionY={invitation?.cover_position_y}
                            zoom={invitation?.cover_zoom}
                            className="yt-video-player__media"
                        />
                    ) : (
                        <div className="yt-video-player__media yt-video-player__media--fallback" />
                    )}
                    
                    <div className="yt-video-player__overlay">
                        {/* Play Button Overlay */}
                        <div className="yt-video-player__play-btn">
                            <svg viewBox="0 0 24 24" width="36" height="36" fill="#FFFFFF"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Video Info Content */}
                <div className="yt-video-details">
                    <h1 className="yt-video-title">
                        {isSingleHost 
                            ? `${invitation?.opening_title || 'Acara Spesial'} ${titleText}`
                            : `The Wedding of ${titleText} - (Official Invitation Video)`}
                    </h1>

                    {/* Metadata */}
                    <div className="yt-video-meta">
                        <span className="yt-video-views">9,7M views</span>
                        <span className="yt-video-dot">•</span>
                        <span className="yt-video-date">Premiere live</span>
                    </div>

                    {/* Channel Bar / Subscribe Panel */}
                    <div className="yt-channel-panel">
                        <div className="yt-channel-avatar">{titleText?.charAt(0)}</div>
                        <div className="yt-channel-info">
                            <span className="yt-channel-name">{titleText} Official</span>
                            <span className="yt-channel-subs">1.5M subscribers</span>
                        </div>
                        <button type="button" onClick={onOpen} className="yt-subscribe-btn">
                            Subscribe
                        </button>
                    </div>

                    {/* Guest Section Card */}
                    <div className="yt-guest-card">
                        <div className="yt-guest-card__label">{t('invitation.dear_guest')}</div>
                        <div className="yt-guest-card__name">{guestName || 'Tamu Undangan'}</div>
                        <div className="yt-guest-card__desc">{t('invitation.dear_guest_desc')}</div>
                    </div>

                    {/* Big Red Buka Undangan Action */}
                    <button type="button" id="tombol-buka" onClick={onOpen} className="yt-action-open-btn animate-pulse">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                        <span>{t('invitation.open')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─── Opening Section ─── */
function OpeningSection({ invitation, brideGrooms, scrollToSection, loveStories, galleries, enableRsvp, enableWishes, bankAccounts, id, onOpenRsvp, topWish }) {
    const { t, locale } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [likesCount, setLikesCount] = useState(333);
    const [hasLiked, setHasLiked] = useState(false);

    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    const isSingleHost = bgs.length <= 1 || ['birthday', 'graduation', 'aqiqah', 'circumcision'].includes(invitation?.type);
    
    const titleText = isSingleHost 
        ? (host.full_name || 'Celebration') 
        : bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');

    const handleLikeClick = () => {
        if (!hasLiked) {
            setLikesCount(l => l + 1);
            setHasLiked(true);
        } else {
            setLikesCount(l => l - 1);
            setHasLiked(false);
        }
    };

    // Resolve YouTube embed ID
    let embedId = '';
    const videoUrl = invitation?.video_url;
    if (videoUrl) {
        if (videoUrl.includes('youtube.com/watch?v=')) {
            embedId = videoUrl.split('v=')[1]?.split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            embedId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (videoUrl.includes('youtube.com/embed/')) {
            embedId = videoUrl.split('embed/')[1]?.split('?')[0];
        }
    }

    // Resolve YouTube opening embed ID
    let openingEmbedId = '';
    const openingVideoUrl = invitation?.opening_video_url;
    if (openingVideoUrl) {
        if (openingVideoUrl.includes('youtube.com/watch?v=')) {
            openingEmbedId = openingVideoUrl.split('v=')[1]?.split('&')[0];
        } else if (openingVideoUrl.includes('youtu.be/')) {
            openingEmbedId = openingVideoUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (openingVideoUrl.includes('youtube.com/embed/')) {
            openingEmbedId = openingVideoUrl.split('embed/')[1]?.split('?')[0];
        }
    }

    const activeEmbedId = openingEmbedId || (invitation.video_playback === 'background' || invitation.video_playback === 'both' ? embedId : '');

    return (
        <section id={id || "opening"} className="yt-opening">
            {/* Live Video Player Box */}
            <div className="yt-main-player" style={{ position: 'relative', overflow: 'hidden' }}>
                {globalShowPhotos && activeEmbedId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${activeEmbedId}?autoplay=1&mute=1&loop=1&playlist=${activeEmbedId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0`}
                        title="Background Live Stream"
                        frameBorder="0"
                        className="yt-main-player__media pointer-events-none scale-105"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                ) : globalShowPhotos && embedId && (invitation.video_playback === 'gallery' || !invitation.video_playback) ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${embedId}?autoplay=0&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        title="Wedding Video"
                        frameBorder="0"
                        className="yt-main-player__media"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : globalShowPhotos && (invitation?.opening_image || invitation?.cover_image) ? (
                    <PremiumSlideshow
                        images={invitation?.opening_image ? invitation.opening_image.split(',') : (invitation?.cover_image ? invitation.cover_image.split(',') : [])}
                        positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                        positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                        zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                        className="yt-main-player__media"
                    />
                ) : (
                    <div className="yt-main-player__media yt-main-player__media--fallback" />
                )}
                
                {/* LIVE badge overlay - only shown for live stream bg / slideshow */}
                {(!embedId || (invitation.video_playback !== 'gallery' && invitation.video_playback !== undefined)) && (
                    <div className="yt-player-badge">
                        <span className="yt-dot-red animate-ping" />
                        <span>LIVE</span>
                    </div>
                )}
            </div>

            {/* Video Meta & Actions */}
            <div className="yt-video-info-block">
                <h2 className="yt-main-video-title">
                    {invitation?.opening_title || (isSingleHost ? `Acara Syukuran Pertambahan Usia ${titleText}` : `Rangkaian Acara Pernikahan ${titleText}`)}
                </h2>
                
                <div className="yt-video-controls-bar">
                    {/* View counts */}
                    <div className="yt-left-meta">
                        <span className="yt-meta-badge">LIVE STREAMING</span>
                        <span className="yt-meta-views">1,400 watching now</span>
                    </div>

                    {/* Interactive YouInvite Buttons (Like, Share, etc.) */}
                    <div className="yt-actions-pill-group">
                        <button type="button" onClick={handleLikeClick} className={`yt-action-pill ${hasLiked ? 'active' : ''}`}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.77 11h-4.23l1.52-4.94a2.21 2.21 0 00-.54-2.11 2.37 2.37 0 00-3.3 0L7.14 9H3v11h14.26a2.23 2.23 0 002.24-1.92l1.35-8a2.23 2.23 0 00-2.08-2.08zM6 19H4v-8h2v8zm14.4-.84a1.23 1.23 0 01-1.24 1.08H8v-9.35l4.63-4.63.3.3a.61.61 0 01.17.43v.15l-1.34 4.36 4.36.01a1.23 1.23 0 011.24 1.24v.14l-1.35 8.01a1.22 1.22 0 01-.01.17z"/></svg>
                            <span className="ml-1">{likesCount}K</span>
                        </button>
                        <button type="button" onClick={() => scrollToSection?.('rsvp')} className="yt-action-pill">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 2.2.71 4.24 1.93 5.92L3 22l4.31-1.3C8.94 21.36 10.42 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
                            <span className="ml-1">RSVP</span>
                        </button>
                        <button type="button" onClick={() => scrollToSection?.('bank')} className="yt-action-pill">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11 8v5l4.25 2.52.77-1.28-3.52-2.09V8zM21 10V3h-7l2.84 2.84L12 10.69 7.16 5.84 10 3H3v7l2.84-2.84L10.69 12 5.84 16.84 3 14v7h7l-2.84-2.84L12 13.31l4.84 4.84L14 21h7v-7l-2.84 2.84L13.31 12l4.84-4.84z"/></svg>
                            <span className="ml-1">Gift</span>
                        </button>
                    </div>
                </div>

                {/* Subscribed Channel Info */}
                <div className="yt-subscribed-channel-bar">
                    <div className="yt-channel-avatar">{titleText?.charAt(0)}</div>
                    <div className="yt-channel-middle">
                        <span className="yt-channel-title-name">{titleText} Official <svg className="inline w-3 h-3 text-[#aaa]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></span>
                        <span className="yt-channel-subscriber-number">1.5M subscribers</span>
                    </div>
                    <button type="button" className="yt-subscribed-badge-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-1"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
                        <span>Subscribed</span>
                    </button>
                </div>

                {/* Video Description Block (Expandable) */}
                <div className={`yt-video-desc-box ${isExpanded ? 'expanded' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
                    <div className="yt-desc-header">
                        <strong>Salam Sejahtera,</strong>
                    </div>
                    
                    <div className="yt-desc-body">
                        {invitation?.opening_ayat && (
                            <blockquote className="yt-desc-ayat">
                                &ldquo;{invitation.opening_ayat}&rdquo;
                                {invitation?.opening_ayat_source && <cite className="block text-right mt-1 text-[11px] text-gray-400">&mdash; {invitation.opening_ayat_source}</cite>}
                            </blockquote>
                        )}
                        <p className="mt-2 leading-relaxed text-xs text-gray-300">
                            {invitation?.opening_text || 'Kami mengundang Anda untuk bergabung dalam momen spesial kami. Melalui halaman ini, kami berharap dapat berbagi kebahagiaan bersama.'}
                        </p>
                    </div>

                    <button type="button" className="yt-desc-toggle-btn">
                        {isExpanded ? 'Show less' : '...more'}
                    </button>
                </div>

                {/* Compact Comments Box (Tapping this opens overlay drawer) */}
                {enableRsvp && (
                    <div className="mt-2">
                        <CompactCommentsWidget wish={topWish} onClick={onOpenRsvp} />
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─── Mempelai / Celebrant Section (Shorts Style) ─── */
function BrideGroomSection({ invitation, brideGrooms, events, id }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const isSingleHost = bgs.length <= 1 || ['birthday', 'graduation', 'aqiqah', 'circumcision'].includes(invitation?.type);

    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || bgs[1] || bgs[0] || {};

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];

    function ShortsCard({ person, roleLabel }) {
        if (!person) return null;
        const photo = getStorageUrl(person.photo, dummyPortrait);
        return (
            <Reveal className="yt-shorts-card" delay={150}>
                {globalShowPhotos && person.photo ? (
                    <div className="yt-shorts-card__media">
                        <img src={photo} alt={person.full_name} className="yt-shorts-card__img" />
                    </div>
                ) : (
                    <div className="yt-shorts-card__media yt-shorts-card__media--fallback" />
                )}
                
                {/* Shorts UI Overlay (Like, Dislike, Comment, Share floats on right) */}
                <div className="yt-shorts-card__controls">
                    <div className="yt-shorts-control-btn">
                        <div className="yt-icon-circle">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.77 11h-4.23l1.52-4.94a2.21 2.21 0 00-.54-2.11 2.37 2.37 0 00-3.3 0L7.14 9H3v11h14.26a2.23 2.23 0 002.24-1.92l1.35-8a2.23 2.23 0 00-2.08-2.08z"/></svg>
                        </div>
                        <span>98K</span>
                    </div>
                    <div className="yt-shorts-control-btn">
                        <div className="yt-icon-circle">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M5.23 13h4.23l-1.52 4.94a2.21 2.21 0 00.54 2.11 2.37 2.37 0 003.3 0L16.86 15H21V4H6.74A2.23 2.23 0 004.5 5.92l-1.35 8A2.23 2.23 0 005.23 13z"/></svg>
                        </div>
                        <span>Dislike</span>
                    </div>
                    <div className="yt-shorts-control-btn">
                        <div className="yt-icon-circle">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                        </div>
                        <span>12K</span>
                    </div>
                </div>

                {/* Person details overlay at bottom */}
                <div className="yt-shorts-card__details">
                    <span className="yt-shorts-handle">@{person.instagram ? person.instagram.replace('@','') : (person.nickname || 'celebrant')}</span>
                    <h3 className="yt-shorts-name">{person.full_name}</h3>
                    
                    <p className="yt-shorts-parents-info">
                        {translateChildOrder(person.child_order, person.gender === 'wanita' ? 'wanita' : 'pria', locale) || 
                         (person.gender === 'wanita' ? t('invitation.daughter_of') : t('invitation.son_of'))}
                    </p>
                    <p className="yt-shorts-parents-names">
                        {[person.father_name, person.mother_name].filter(Boolean).join(' & ') || person.parents_name || ''}
                    </p>

                    {person.instagram && (
                        <a href={`https://www.instagram.com/${person.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="yt-shorts-link-btn">
                            <i className="fab fa-instagram" /> Instagram
                        </a>
                    )}
                </div>
            </Reveal>
        );
    }

    return (
        <section id={id || "bride_groom"} className="yt-mempelai-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.77 10.3c-.77-.32-1.2-1.08-1.2-1.85V5.1c0-1.7-1.4-3.1-3.1-3.1h-4c-.8 0-1.5.3-2.1.9L2.9 7.4c-.6.6-.9 1.3-.9 2.1v5.4c0 1.7 1.4 3.1 3.1 3.1h4c.8 0 1.5-.3 2.1-.9l4.4-4.5c.7-.6.9-1.4.9-2.3v-.1zM11 13.5v-3l2.5 1.5-2.5 1.5z"/></svg></span>
                <span>Shorts</span>
            </h3>

            <div className="yt-shorts-grid">
                {isSingleHost ? (
                    <ShortsCard person={groom} roleLabel="Tokoh Utama" />
                ) : (
                    <>
                        <ShortsCard person={groom} roleLabel="Mempelai Pria" />
                        <ShortsCard person={bride} roleLabel="Mempelai Wanita" />
                    </>
                )}
            </div>

            {/* Countdown / Save The Date Box (YouInvite Premiere Card style) */}
            {primaryEvent?.event_date && (() => {
                const titleText = isSingleHost 
                    ? (groom?.nickname || groom?.full_name || 'Celebration') 
                    : bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
                const coverImg = getStorageUrl(invitation?.cover_image?.split(',')[0], dummyCover);
                return (
                    <div className="yt-premiere-card mt-6 mx-4">
                        <div className="yt-premiere-thumbnail" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
                            {globalShowPhotos && invitation?.cover_image ? (
                                <img src={coverImg} alt="Premiere" className="yt-premiere-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div className="yt-premiere-img fallback" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #111, #222)' }} />
                            )}
                            <span className="yt-premiere-live-tag" style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#ff0000', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '2px', zIndex: 10 }}>PREMIERE</span>
                            
                            {/* Play button overlay */}
                            <div className="yt-premiere-play-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        
                        <div className="yt-premiere-details" style={{ backgroundColor: 'var(--yt-card-bg)', border: '1px solid var(--yt-border)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '16px', textAlign: 'center', boxSizing: 'border-box' }}>
                            <div className="yt-premiere-badge" style={{ fontSize: '10px', color: '#ff0000', fontWeight: 'bold', letterSpacing: '0.8px', marginBottom: '4px' }}>PREMIERE LIVE IN</div>
                            {(() => {
                                const d = new Date(primaryEvent.event_date);
                                return (
                                    <div className="yt-premiere-date-display" style={{ marginBottom: '12px' }}>
                                        <h4 className="yt-premiere-date-text" style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--yt-white)' }}>
                                            {d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long' })}, {d.getDate()} {d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { month: 'long' }).toUpperCase()} {d.getFullYear()}
                                        </h4>
                                    </div>
                                );
                            })()}
                            <CountdownTimer targetDate={primaryEvent.event_date} />
                            
                            <button type="button" onClick={() => window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + titleText)}&dates=${String(primaryEvent.event_date).replace(/-/g,'')}T080000/${String(primaryEvent.event_date).replace(/-/g,'')}T120000`, '_blank')} className="yt-premiere-reminder-btn" style={{ marginTop: '16px', backgroundColor: 'var(--yt-hover-bg)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--yt-white)', borderRadius: '18px', padding: '8px 16px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
                                <span>Set Reminder</span>
                            </button>
                        </div>
                    </div>
                );
            })()}
        </section>
    );
}

/* ─── Acara (Event) Section ─── */
function EventSection({ events, invitation }) {
    const { t, locale } = useTranslation();
    const safeEvents = safeArr(events);
    if (safeEvents.length === 0) return null;

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const bgs = safeArr(invitation?.brideGrooms || []);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    return (
        <section id="event" className="yt-events-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 12.3c.77-.32 1.2-1.08 1.2-1.85V5.1c0-1.7-1.4-3.1-3.1-3.1h-4c-.8 0-1.5.3-2.1.9L6.9 7.4c-.6.6-.9 1.3-.9 2.1v5.4c0 1.7 1.4 3.1 3.1 3.1h4c.8 0 1.5-.3 2.1-.9l4.4-4.5c.7-.6.9-1.4.9-2.3v-.1zM12 13.5v-3l2.5 1.5-2.5 1.5z"/></svg></span>
                <span>Playlists - Acara Utama</span>
            </h3>

            <div className="yt-events-list">
                {safeEvents.map((ev, idx) => {
                    const evDate = ev.event_date || ev.date;
                    const d = evDate ? new Date(evDate) : null;
                    const fallbackImg = getStorageUrl(invitation?.cover_image, dummyCover);
                    const eventImg = getStorageUrl(ev.image, fallbackImg);

                    return (
                        <Reveal key={idx} delay={idx * 100} className="yt-event-card">
                            {/* Playlist Video Thumbnail */}
                            <div className="yt-playlist-thumbnail">
                                {globalShowPhotos && eventImg ? (
                                    <img src={eventImg} alt={ev.event_name} className="yt-playlist-thumbnail__img" />
                                ) : (
                                    <div className="yt-playlist-thumbnail__img yt-playlist-thumbnail__img--fallback" />
                                )}
                                
                                {/* YouInvite Playlist Side Overlay */}
                                <div className="yt-playlist-side-badge">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M22 7H2v1h20V7zm-4 4H6v1h12v-1zm-4 4H10v1h4v-1z"/></svg>
                                    <span className="text-[10px] font-bold mt-1">EVENT</span>
                                </div>

                                <span className="yt-thumbnail-duration-tag">
                                    {ev.start_time ? formatTime(ev.start_time) : '08:00'} WIB
                                </span>
                            </div>

                            {/* Playlist Description Details */}
                            <div className="yt-playlist-details">
                                <h4 className="yt-playlist-title">{ev.event_name || 'Syukuran'}</h4>
                                
                                {d && (
                                    <p className="yt-playlist-meta-date">
                                        {d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                )}
                                
                                {ev.venue_name && <p className="yt-playlist-venue">{ev.venue_name}</p>}
                                {ev.venue_address && <p className="yt-playlist-address">{ev.venue_address}</p>}

                                <div className="yt-playlist-actions">
                                    {(ev.gmaps_link || ev.map_url) && (
                                        <a href={ev.gmaps_link || ev.map_url} target="_blank" rel="noreferrer" className="yt-btn-red-action">
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="mr-1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
                                            <span>Peta</span>
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noreferrer" className="yt-btn-grey-action">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="mr-1"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-2-.9-2-2-2zm0 16H5V10h14v10zm-5-8h-2v2h2v-2zm-4 0H8v2h2v-2zm8 0h-2v2h2v-2zm-4 4h-2v2h2v-2zm-4 0H8v2h2v-2z"/></svg>
                                        <span>Simpan</span>
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ─── Love Story / Milestones (Episodes Timeline) ─── */
function LoveStorySection({ loveStories, id, invitation }) {
    const stories = safeArr(loveStories);
    if (stories.length === 0) return null;

    const isBirthday = ['birthday', 'graduation', 'aqiqah', 'circumcision'].includes(invitation?.type);

    return (
        <section id={id || "love_story"} className="yt-stories-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM12 5.5v9l6-4.5-6-4.5z"/></svg></span>
                <span>{isBirthday ? 'Milestones - Perjalanan Usia' : 'Episodes - Kisah Cinta'}</span>
            </h3>

            <div className="yt-episodes-list">
                {stories.map((story, idx) => (
                    <Reveal key={idx} delay={idx * 80} className="yt-episode-card">
                        <div className="yt-episode-num">EPISODE {idx + 1}</div>
                        <div className="yt-episode-content">
                            <h4 className="yt-episode-title">{story.title}</h4>
                            {(story.story_date || story.date) && (
                                <span className="yt-episode-date">{formatStoryDate(story.story_date || story.date)}</span>
                            )}
                            <p className="yt-episode-desc">{story.description || story.story}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ─── Gallery Section (Recommended Videos Style) ─── */
function GallerySection({ galleries, invitation }) {
    const { t } = useTranslation();
    const [activeIdx, setActiveIdx] = useState(null);
    const safeGalleries = safeArr(galleries);

    const getYoutubeId = (url) => {
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
    };

    // Combine photos and videos
    const galleryItems = [];

    if (globalShowPhotos) {
        safeGalleries.forEach((g, idx) => {
            galleryItems.push({
                type: 'photo',
                url: getStorageUrl(g.image_url, dummyPortrait),
                title: t('invitation.save_the_date') === 'Save The Date' ? ('Photo Highlight #' + (idx + 1)) : ('Foto Momen #' + (idx + 1)),
                label: '🖼️ PHOTO'
            });
        });
    }

    const showVideoInGallery = invitation?.video_list?.length > 0 && 
        (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);

    if (showVideoInGallery) {
        invitation.video_list.forEach((url, idx) => {
            const ytId = getYoutubeId(url);
            if (ytId) {
                galleryItems.push({
                    type: 'video',
                    ytId: ytId,
                    url: url,
                    thumbnail: 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg',
                    title: t('invitation.save_the_date') === 'Save The Date' ? ('Prewedding Teaser Video #' + (idx + 1)) : ('Video Prewedding #' + (idx + 1)),
                    label: '🎥 VIDEO'
                });
            }
        });
    }

    if (galleryItems.length === 0) return null;

    const handlePrev = (e) => {
        e.stopPropagation();
        setActiveIdx((prev) => {
            const nextIdx = prev === 0 ? galleryItems.length - 1 : prev - 1;
            const audioEl = document.querySelector('audio');
            if (audioEl) {
                if (galleryItems[nextIdx]?.type === 'video') {
                    audioEl.pause();
                } else {
                    audioEl.play().catch(() => {});
                }
            }
            return nextIdx;
        });
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setActiveIdx((prev) => {
            const nextIdx = prev === galleryItems.length - 1 ? 0 : prev + 1;
            const audioEl = document.querySelector('audio');
            if (audioEl) {
                if (galleryItems[nextIdx]?.type === 'video') {
                    audioEl.pause();
                } else {
                    audioEl.play().catch(() => {});
                }
            }
            return nextIdx;
        });
    };

    const handleCloseModal = () => {
        setActiveIdx(null);
        const audioEl = document.querySelector('audio');
        if (audioEl) {
            audioEl.play().catch(() => {});
        }
    };

    useEffect(() => {
        if (activeIdx !== null && galleryItems[activeIdx]?.type === 'video') {
            const audioEl = document.querySelector('audio');
            if (audioEl) {
                audioEl.pause();
            }
        }
    }, [activeIdx]);

    return (
        <section id="gallery" className="yt-gallery-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9v-6zm2 2v2h5v-2h-5z"/></svg></span>
                <span>Recommended Videos - Galeri</span>
            </h3>

            <div className="yt-gallery-grid">
                {galleryItems.map((item, idx) => {
                    const isVideo = item.type === 'video';
                    const src = isVideo ? item.thumbnail : item.url;
                    return (
                        <Reveal key={idx} delay={(idx % 4) * 60} className="yt-gallery-item-card">
                            <div className="yt-gallery-img-box" onClick={() => setActiveIdx(idx)} style={{ cursor: 'pointer', position: 'relative' }}>
                                <img src={src} alt={item.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span className="yt-gallery-duration" style={{ backgroundColor: isVideo ? '#f00' : 'rgba(0,0,0,0.8)' }}>{item.label}</span>
                                {isVideo && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.2)'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#f00',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 0 10px rgba(255,0,0,0.5)'
                                        }}>
                                            <svg style={{ width: '16px', height: '16px', fill: '#fff', marginLeft: '2px' }} viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="yt-gallery-item-info" onClick={() => setActiveIdx(idx)} style={{ cursor: 'pointer' }}>
                                <div className="yt-channel-avatar mini" style={{ backgroundColor: isVideo ? '#ff0000' : '#4a4a4a' }}>
                                    {isVideo ? '▶' : '🖼️'}
                                </div>
                                <div className="yt-gallery-item-meta">
                                    <h5 className="yt-gallery-item-title">{item.title}</h5>
                                    <span className="yt-gallery-views-label">{isVideo ? 'YouTube Video • Premium Streaming' : 'Recommended for you'}</span>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            {/* Lightbox / Theater Mode Modal */}
            {activeIdx !== null && (
                <div 
                    className="yt-gallery-lightbox animate-in fade-in duration-200"
                    onClick={handleCloseModal}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.96)',
                        zIndex: 15000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {/* Close button */}
                    <button 
                        type="button"
                        onClick={handleCloseModal}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: 'none',
                            color: '#FFF',
                            fontSize: '28px',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 15100
                        }}
                    >
                        &times;
                    </button>

                    {/* Prev button */}
                    <button 
                        type="button"
                        onClick={handlePrev}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#FFF',
                            fontSize: '32px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 15100,
                            userSelect: 'none'
                        }}
                    >
                        &#8249;
                    </button>

                    {/* Next button */}
                    <button 
                        type="button"
                        onClick={handleNext}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#FFF',
                            fontSize: '32px',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 15100,
                            userSelect: 'none'
                        }}
                    >
                        &#8250;
                    </button>

                    {/* Active Content container */}
                    <div 
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: '75vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            aspectRatio: galleryItems[activeIdx].type === 'video' ? '16/9' : 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {galleryItems[activeIdx].type === 'video' ? (
                            <iframe 
                                src={'https://www.youtube.com/embed/' + galleryItems[activeIdx].ytId + '?autoplay=1&rel=0&showinfo=0&controls=1&mute=0'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px',
                                    border: '2px solid rgba(255, 0, 0, 0.3)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                }}
                            />
                        ) : (
                            <img 
                                src={galleryItems[activeIdx].url} 
                                alt={galleryItems[activeIdx].title} 
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '75vh',
                                    objectFit: 'contain',
                                    borderRadius: '8px',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                }}
                            />
                        )}
                    </div>

                    {/* Caption under Image */}
                    <div 
                        style={{
                            marginTop: '16px',
                            color: '#AAA',
                            fontSize: '14px',
                            textAlign: 'center',
                            maxWidth: '90%',
                            fontFamily: 'Roboto, sans-serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ color: '#FFF', fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                            {galleryItems[activeIdx].title}
                        </div>
                        <div>{galleryItems[activeIdx].type === 'video' ? 'YouTube Premium Stream • YouInvite Red' : 'Recommended for you • YouInvite HD'}</div>
                    </div>
                </div>
            )}
        </section>
    );
}
/* ─── Live Streaming Section (YouInvite Broadcast Style) ─── */
function LiveStreamingSection({ events, invitation, id, galleries }) {
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
    
    // Pick the first photo from galleries, or use a high-quality wedding photo from Unsplash
    const list = safeArr(galleries);
    const coverPhoto = list.length > 0 
        ? getStorageUrl(list[0].image_url) 
        : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';

    return (
        <section id={id || "livestream"} className="yt-livestream-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                    </svg>
                </span>
                <span>{isEn ? 'Live Streams' : 'Siaran Langsung'}</span>
            </h3>
            
            <div className="yt-livestream-box">
                <div className="yt-livestream-preview" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${coverPhoto})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="yt-livestream-badge">
                        <span className="yt-dot-red animate-ping" />
                        <span>UPCOMING LIVE</span>
                    </div>
                    <div className="yt-livestream-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="#FF0000" style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.6))' }}>
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                        </svg>
                    </div>
                </div>
                
                <div className="yt-livestream-info">
                    <p className="yt-livestream-text">
                        {isEn ? 'Please join our celebration virtually via streaming links below:' : 'Saksikan momen bahagia kami secara virtual melalui tautan siaran langsung di bawah ini:'}
                    </p>
                    <div className="yt-livestream-buttons">
                        {streamsList.map((stream, idx) => (
                            <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="yt-btn-red-action large">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="mr-1">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                </svg>
                                <span>WATCH ON {stream.platform.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Premium simulated comments to populate and wow the user with realism
const dummyWishes = [
    {
        name: 'Anisa Rahma',
        attendance: 'hadir',
        wish: 'Selamat menempuh hidup baru yaa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Cantik banget dressnya! 💖🥰',
        likes: 42,
        time: '2 jam yang lalu'
    },
    {
        name: 'Budi Santoso',
        attendance: 'hadir',
        wish: 'Mantap bro! Selamat menempuh ibadah terpanjang. Semoga lancar sampai hari H dan diberkahi selalu rumah tangganya! 🤝🔥',
        likes: 18,
        time: '5 jam yang lalu'
    },
    {
        name: 'Citra Lestari',
        attendance: 'hadir',
        wish: 'Happy wedding day! Terharu banget ngeliat perjalanan cinta kalian dari jaman kuliah sampai akhirnya sah. Bahagia terus ya kalian! ✨🥂',
        likes: 29,
        time: '1 hari yang lalu'
    },
    {
        name: 'Dedi Kurniawan',
        attendance: 'absen',
        wish: 'Selamat ya! Mohon maaf belum bisa hadir secara langsung karena sedang tugas di luar kota. Doa terbaik selalu menyertai kalian berdua! 🙏✨',
        likes: 5,
        time: '1 hari yang lalu'
    }
];

/* ─── RSVP & Wishes (YouInvite Comments Section) ─── */
function RsvpSection({ invitation, onSubmit, processing, errors, wishesList, enableWishes }) {
    const { t } = useTranslation();
    
    const { data, setData, post, reset } = useForm({
        name: '',
        attendance: 'hadir',
        guests_count: 1,
        wish: '',
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(data, () => {
            reset('name', 'wish', 'guests_count');
        });
    };

    const wishes = safeArr(wishesList);

    // Combine real wishes with dummy ones
    const combinedWishes = [
        ...wishes.map(w => ({
            name: w.name || w.sender_name || 'Tamu Undangan',
            attendance: w.attendance || 'hadir',
            wish: w.wish || w.message || '',
            likes: Math.floor(Math.random() * 12) + 1,
            time: 'Baru saja',
            isReal: true
        })),
        ...dummyWishes.map(w => ({ ...w, isReal: false }))
    ];

    return (
        <section id="rsvp" className="yt-comments-section">
            <h3 className="yt-section-title-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Comments & RSVP (Konfirmasi Kehadiran)</span>
                <span className="yt-comments-count-badge">{combinedWishes.length}</span>
            </h3>

            {/* Simulated Add Comment Area (RSVP Form) */}
            <div className="yt-add-comment-block">
                <div className="yt-comment-user-avatar" style={{ background: 'linear-gradient(135deg, #2c3e50, #3498db)', color: '#fff', fontWeight: 'bold' }}>?</div>
                <form onSubmit={handleFormSubmit} className="yt-comment-form">
                    <div className="yt-comment-form-row">
                        <input
                            type="text"
                            placeholder="Nama Lengkap Anda / Full Name..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="yt-comment-input-line"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}

                    <div className="yt-comment-form-row mt-2 flex flex-wrap gap-3">
                        <select
                            value={data.attendance}
                            onChange={(e) => setData('attendance', e.target.value)}
                            className="yt-comment-select-btn"
                        >
                            <option value="hadir">{t('rsvp.attending') || 'Hadir (Attending)'}</option>
                            <option value="absen">{t('rsvp.absent') || 'Tidak Hadir (Absent)'}</option>
                        </select>

                        {data.attendance === 'hadir' && (
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={data.guests_count}
                                onChange={(e) => setData('guests_count', parseInt(e.target.value) || 1)}
                                className="yt-comment-guests-input"
                                title="Jumlah Tamu / Guests Count"
                                placeholder="Jumlah Orang"
                            />
                        )}
                    </div>

                    <div className="yt-comment-form-row mt-2">
                        <textarea
                            placeholder="Tulis Doa & Ucapan Selamat Anda Di Sini (Doa terbaik Anda)..."
                            value={data.wish}
                            onChange={(e) => setData('wish', e.target.value)}
                            required
                            rows={2}
                            className="yt-comment-textarea-line"
                        />
                    </div>
                    {errors.wish && <p className="text-red-500 text-[10px] mt-1">{errors.wish}</p>}

                    <div className="yt-comment-submit-actions">
                        <button type="submit" disabled={processing} className="yt-comment-submit-btn" style={{ padding: '8px 18px', borderRadius: '18px', backgroundColor: 'var(--yt-red)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                            {processing ? 'Mengirim...' : 'Kirim RSVP & Ucapan'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List (Wishes Feed) */}
            {enableWishes && (
                <div className="yt-comments-feed">
                    {combinedWishes.map((w, idx) => {
                        const avatarLetter = String(w.name || 'T').charAt(0).toUpperCase();
                        
                        // Generate a beautiful consistent gradient background for avatar based on name character hash
                        const colors = [
                            'linear-gradient(135deg, #FF512F, #DD2476)',
                            'linear-gradient(135deg, #185a9d, #43cea2)',
                            'linear-gradient(135deg, #f12711, #f5af19)',
                            'linear-gradient(135deg, #8A2387, #E94057, #F27121)',
                            'linear-gradient(135deg, #4ca2cd, #67B26F)',
                            'linear-gradient(135deg, #7F00FF, #E100FF)',
                            'linear-gradient(135deg, #11998e, #38ef7d)'
                        ];
                        const charCodeSum = String(w.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const avatarBg = colors[charCodeSum % colors.length];

                        return (
                            <div key={idx} className="yt-comment-item-card">
                                <div className="yt-comment-item-avatar" style={{ background: avatarBg, color: '#fff' }}>
                                    {avatarLetter}
                                </div>
                                <div className="yt-comment-item-body">
                                    <div className="yt-comment-item-header">
                                        <span className="yt-comment-author">@{String(w.name || 'anonymous').toLowerCase().replace(/\s+/g, '')}</span>
                                        <span className="yt-comment-time-tag">
                                            {w.attendance === 'hadir' ? (
                                                <span className="yt-present-badge">✓ Hadir</span>
                                            ) : (
                                                <span className="yt-absent-badge">✗ Absen</span>
                                            )}
                                        </span>
                                        <span className="text-[10px] text-gray-500 ml-1">{w.time || '1 hari yang lalu'}</span>
                                    </div>
                                    <p className="yt-comment-text-content">{w.wish}</p>
                                    
                                    {/* Like / Reply action bar under comment */}
                                    <div className="yt-comment-actions-bar">
                                        <button type="button" className="yt-comment-like-icon-btn">
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.77 11h-4.23l1.52-4.94a2.21 2.21 0 00-.54-2.11 2.37 2.37 0 00-3.3 0L7.14 9H3v11h14.26a2.23 2.23 0 002.24-1.92l1.35-8a2.23 2.23 0 00-2.08-2.08z"/></svg>
                                        </button>
                                        <span className="yt-comment-like-count">{w.likes}</span>
                                        <button type="button" className="yt-comment-dislike-icon-btn">
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M5.23 13h4.23l-1.52 4.94a2.21 2.21 0 00.54 2.11 2.37 2.37 0 003.3 0L16.86 15H21V4H6.74a2.23 2.23 0 00-2.24 1.92l-1.35 8a2.23 2.23 0 002.08 2.08z"/></svg>
                                        </button>
                                        <button type="button" className="yt-comment-reply-text-btn">Reply</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

/* ─── Bank / Gift Section (Super Chat / Support Panel) ─── */
function BankSection({ bankAccounts, id }) {
    const { t } = useTranslation();
    const accounts = safeArr(bankAccounts);
    if (accounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);
    
    const copyToClipboard = (text, idx) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    return (
        <section id={id || "bank"} className="yt-superchat-section">
            <h3 className="yt-section-title-bar">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/></svg></span>
                <span>Super Chat & Amplop Digital</span>
            </h3>
            
            <p className="yt-superchat-subtitle">Beri dukungan kado digital Anda kepada kami melalui opsi Super Chat di bawah ini:</p>

            <div className="yt-superchat-list">
                {accounts.map((bank, idx) => {
                    // YouInvite Super Chat colors (yellow, green, blue, orange, red)
                    const colors = [
                        { bg: '#00e5ff', text: '#000000', headerBg: '#00b0ff', avatarBg: '#00838f', msg: 'Selamat menempuh hidup baru ya Rian & Amelia! Dari sahabat terbaikmu. 🤵👰✨' }, // Blue
                        { bg: '#ffd600', text: '#000000', headerBg: '#ffb300', avatarBg: '#f57f17', msg: 'Semoga lancar acaranya dan menjadi keluarga sakinah mawaddah warahmah! 💸❤️' }, // Yellow
                        { bg: '#1de9b6', text: '#000000', headerBg: '#00bfa5', avatarBg: '#00695c', msg: 'Happy Wedding! Semoga cinta kalian abadi selamanya sampai kakek nenek. 🎉🥳' }, // Green
                        { bg: '#f44336', text: '#ffffff', headerBg: '#d32f2f', avatarBg: '#b71c1c', msg: 'Barakallahu lakum wa baraka alaikum wa jamaa bainakuma fii khair! 🌸💍' }, // Red
                    ];
                    const theme = colors[idx % colors.length];

                    return (
                        <Reveal key={idx} delay={idx * 100} className="yt-superchat-card" style={{ borderColor: theme.headerBg, marginBottom: '12px' }}>
                            {/* Super Chat Header (Bank Account Info Styled as Creator/Donor details) */}
                            <div className="yt-superchat-header" style={{ backgroundColor: theme.headerBg, color: theme.text, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {/* User Initial / Avatar */}
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.avatarBg,
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                    flexShrink: 0
                                }}>
                                    {bank.bank_name?.charAt(0) || 'B'}
                                </div>
                                
                                {/* Info details */}
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 'bold', color: theme.text }}>
                                        <span className="truncate">{bank.bank_name || 'Bank'}</span>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill={theme.text === '#000000' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'} style={{ flexShrink: 0 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                                    </div>
                                    <div style={{ fontSize: '10px', opacity: 0.75, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SUPER CHAT • KADO DIGITAL</div>
                                </div>
                                
                                {/* Amount Style (Number) */}
                                <div style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace', color: theme.text, flexShrink: 0 }}>
                                    {bank.account_number}
                                </div>
                            </div>
                            
                            {/* Super Chat Body */}
                            <div className="yt-superchat-body" style={{ backgroundColor: theme.bg, color: theme.text, padding: '12px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {/* Atas Nama Owner */}
                                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.75, fontWeight: 'bold' }}>
                                        Atas Nama: <span style={{ color: theme.text === '#000000' ? '#000' : '#fff' }}>{bank.account_name}</span>
                                    </div>
                                    
                                    {/* Message */}
                                    <div style={{ fontSize: '13px', lineHeight: '1.4', fontStyle: 'normal', margin: '2px 0 8px 0', opacity: 0.9 }}>
                                        "{theme.msg}"
                                    </div>

                                    {/* Copy Button */}
                                    <button
                                        type="button"
                                        onClick={() => copyToClipboard(bank.account_number, idx)}
                                        style={{
                                            border: 'none',
                                            borderRadius: '18px',
                                            padding: '6px 14px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            alignSelf: 'flex-start',
                                            backgroundColor: theme.text === '#000000' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.18)',
                                            color: theme.text,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'background-color 0.2s',
                                            outline: 'none'
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                                        <span>{copiedIdx === idx ? 'Disalin!' : 'Salin Nomor Rekening'}</span>
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ─── Closing Section (YouInvite End Screen Video Link) ─── */
function ClosingSection({ invitation, brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    const isSingleHost = bgs.length <= 1 || ['birthday', 'graduation', 'aqiqah', 'circumcision'].includes(invitation?.type);
    
    const titleText = isSingleHost 
        ? (host.full_name || 'Celebration') 
        : bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const groomPhoto = getStorageUrl(bgs.find(b => b.gender === 'pria')?.photo || host.photo, dummyPortrait);
    const coverImg = getStorageUrl(invitation?.cover_image?.split(',')[0], dummyCover);

    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || bgs[1] || bgs[0] || {};

    return (
        <section className="yt-closing-section" style={{ borderBottom: 'none' }}>
            <h3 className="yt-section-title-bar mb-4">
                <span className="yt-red-pill-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></span>
                <span>Terima Kasih - End Screen</span>
            </h3>

            {/* End Screen Grid Simulator */}
            <div className="yt-endscreen-container" style={{ position: 'relative', width: 'calc(100% - 32px)', margin: '0 auto 24px auto', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', boxSizing: 'border-box' }}>
                {/* Blurred Video Freeze frame as background */}
                <div className="yt-endscreen-bg-img" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(6px) brightness(0.35)', zIndex: 1 }} />
                
                {/* Diagonal line screen effect */}
                <div className="yt-endscreen-overlay" />

                {/* Left Card: Replay Video Card */}
                <div className="yt-endscreen-video-card left-card" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ position: 'absolute', zIndex: 2, left: '6%', top: '20%', width: '38%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 15px rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                    {globalShowPhotos && coverImg ? (
                        <img src={coverImg} className="yt-endscreen-card-bg" alt="Cover" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }} />
                    ) : (
                        <div className="yt-endscreen-card-bg fallback" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg,#333,#111)', zIndex: 1 }} />
                    )}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2 }} />
                    <span className="yt-endscreen-time-tag" style={{ position: 'absolute', bottom: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '8px', padding: '1px 3px', borderRadius: '2px', zIndex: 3 }}>REPLAY</span>
                    
                    {/* Arrow / Play overlay */}
                    <div className="yt-endscreen-play-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3, color: '#fff' }}>
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                    </div>
                    <span className="yt-endscreen-card-title" style={{ position: 'relative', zIndex: 4, width: '100%', padding: '4px 6px', boxSizing: 'border-box', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '8px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Best for Viewer: Putar Kembali</span>
                </div>

                {/* Center Channel Circle Avatar */}
                <div className="yt-endscreen-channel-btn" style={{ position: 'absolute', zIndex: 3, left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', margin: 0 }}>
                    {globalShowPhotos && groomPhoto ? (
                        <img src={groomPhoto} className="yt-endscreen-avatar-img" alt="Channel Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', margin: 0 }} />
                    ) : (
                        <div className="yt-endscreen-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--yt-red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', border: '2px solid #fff', margin: 0 }}>{titleText?.charAt(0)}</div>
                    )}
                    <span className="yt-endscreen-subscribe-txt" style={{ marginTop: '8px', backgroundColor: '#ff0000', color: '#fff', fontSize: '8px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '2px', letterSpacing: '0.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', display: 'block', width: 'auto' }}>SUBSCRIBE</span>
                </div>

                {/* Right Card: Made with love copyright */}
                <div className="yt-endscreen-video-card right-card" style={{ position: 'absolute', zIndex: 2, right: '6%', top: '20%', width: '38%', aspectRatio: '16/9', borderRadius: '6px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 15px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', boxSizing: 'border-box' }}>
                    <div className="yt-endscreen-thumb-media font-serif text-[10px] text-gray-300 p-2 flex flex-col justify-between" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15,15,15,0.92)', zIndex: 2, boxSizing: 'border-box' }}>
                        <span className="text-white text-[8px] font-bold block mb-0.5">RECOMMENDED CREATOR</span>
                        <p className="text-[8px] m-0 leading-tight text-gray-400">Undangan digital kustom & modern.</p>
                        <strong className="text-white text-[9px] block truncate mt-1">{brandName}</strong>
                    </div>
                    <span className="yt-endscreen-card-title" style={{ position: 'relative', zIndex: 4, width: '100%', padding: '4px 6px', boxSizing: 'border-box', backgroundColor: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '8px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Credits: Powered by Reseller</span>
                </div>
            </div>

            {/* Kami Yang Berbahagia & Turut Mengundang Section */}
            <div style={{ padding: '20px 16px', backgroundColor: 'var(--yt-card-bg)', borderRadius: '12px', border: '1px solid var(--yt-border)', textAlign: 'center', boxSizing: 'border-box', width: 'calc(100% - 32px)', margin: '0 auto 24px auto' }}>
                {/* Kami Yang Berbahagia */}
                <h4 style={{ color: 'var(--yt-red)', fontSize: '13px', fontWeight: 'bold', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Kami Yang Berbahagia
                </h4>
                
                {!isSingleHost ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF' }}>Keluarga Besar Bapak & Ibu</div>
                            <div style={{ fontSize: '13px', color: 'var(--yt-grey)', marginTop: '3px', fontWeight: '500' }}>
                                {[groom.father_name, groom.mother_name].filter(Boolean).join(' & ') || groom.parents_name || 'Orang Tua Mempelai Pria'}
                            </div>
                        </div>
                        
                        <div style={{ fontSize: '14px', color: 'var(--yt-grey)', fontStyle: 'italic', margin: '2px 0' }}>&</div>
                        
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFF' }}>Keluarga Besar Bapak & Ibu</div>
                            <div style={{ fontSize: '13px', color: 'var(--yt-grey)', marginTop: '3px', fontWeight: '500' }}>
                                {[bride.father_name, bride.mother_name].filter(Boolean).join(' & ') || bride.parents_name || 'Orang Tua Mempelai Wanita'}
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '12px', fontSize: '16px', fontWeight: 'bold', color: '#FFF', borderTop: '1px dashed var(--yt-border)', paddingTop: '12px' }}>
                            {groom.nickname || groom.full_name} & {bride.nickname || bride.full_name}
                        </div>
                    </div>
                ) : (
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#FFF' }}>
                            {host.full_name}
                        </div>
                        {host.parents_name && (
                            <div style={{ fontSize: '13px', color: 'var(--yt-grey)', marginTop: '4px' }}>
                                Keluarga Besar {host.parents_name}
                            </div>
                        )}
                    </div>
                )}

                {/* Turut Mengundang (Only show if invitation?.turut_mengundang_text is defined) */}
                {invitation?.turut_mengundang_text && (
                    <div style={{ borderTop: '1px solid var(--yt-border)', paddingTop: '16px', marginTop: '20px' }}>
                        <h4 style={{ color: 'var(--yt-red)', fontSize: '13px', fontWeight: 'bold', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Turut Mengundang
                        </h4>
                        <div style={{ 
                            fontSize: '13px', 
                            color: 'var(--yt-grey)', 
                            lineHeight: '1.6', 
                            whiteSpace: 'pre-line',
                            textAlign: 'center',
                            maxHeight: '180px',
                            overflowY: 'auto',
                            padding: '0 4px',
                            fontFamily: 'Roboto, sans-serif'
                        }}>
                            {invitation.turut_mengundang_text}
                        </div>
                    </div>
                )}
            </div>

            <p className="yt-closing-signature" style={{ margin: '0 auto 16px auto', fontSize: '13px', color: 'var(--yt-grey)', fontStyle: 'italic' }}>
                Terima kasih atas kehadiran & doa restu Anda.
            </p>
        </section>
    );
}
/* ─── Compact Comments Widget Component ─── */
function CompactCommentsWidget({ wish, onClick }) {
    if (!wish) return null;
    const name = wish.name || wish.sender_name || 'Tamu Undangan';
    const message = wish.wish || wish.message || '';
    const avatarLetter = String(name).charAt(0).toUpperCase();
    
    // Gradient backgrounds for compact avatar
    const colors = [
        'linear-gradient(135deg, #FF512F, #DD2476)',
        'linear-gradient(135deg, #185a9d, #43cea2)',
        'linear-gradient(135deg, #f12711, #f5af19)',
        'linear-gradient(135deg, #8A2387, #E94057, #F27121)',
        'linear-gradient(135deg, #4ca2cd, #67B26F)',
        'linear-gradient(135deg, #7F00FF, #E100FF)',
        'linear-gradient(135deg, #11998e, #38ef7d)'
    ];
    const charCodeSum = String(name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const avatarBg = colors[charCodeSum % colors.length];

    return (
        <div className="ytn-comments-box-compact" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="ytn-compact-wish-preview">
                <div className="avatar" style={{ background: avatarBg, color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', flexShrink: 0 }}>
                    {avatarLetter}
                </div>
                <div className="text-content" style={{ flexGrow: 1, overflow: 'hidden', textAlign: 'left', marginLeft: '10px' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--yt-white)', display: 'block' }}>
                        @{String(name).toLowerCase().replace(/\s+/g,'')}
                    </strong>
                    <p style={{ fontSize: '11px', color: 'var(--yt-grey)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {message}
                    </p>
                </div>
            </div>
            <div className="yt-compact-arrow-btn" style={{ color: 'var(--yt-grey)', display: 'flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 15.41l-6-6L7.41 8 12 12.58 16.59 8 18 9.41z"/></svg>
            </div>
        </div>
    );
}

/* ─── Bottom Navigation Bar (YouInvite Mobile Style) ─── */
function BottomMenu({ activeSection, scrollToSection, onOpenRsvp }) {
    return (
        <div className="yt-bottom-menu">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`yt-bottom-menu-item ${activeSection === 'opening' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                <span>Beranda</span>
            </button>
            <button type="button" onClick={() => scrollToSection('bride_groom')} className={`yt-bottom-menu-item ${activeSection === 'bride_groom' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 2H3v7h7V2zm0 10H3v7h7v-7zm11-10h-7v7h7V2zm0 10h-7v7h7v-7z"/></svg>
                <span>Shorts</span>
            </button>
            <button type="button" onClick={onOpenRsvp} className="yt-bottom-menu-item-create" title="Comment / RSVP">
                <div className="create-circle" style={{ backgroundColor: 'var(--yt-hover-bg)', border: '1.5px solid var(--yt-border)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                </div>
            </button>
            <button type="button" onClick={() => scrollToSection('event')} className={`yt-bottom-menu-item ${activeSection === 'event' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                <span>Playlist</span>
            </button>
            <button type="button" onClick={() => scrollToSection('bank')} className={`yt-bottom-menu-item ${activeSection === 'bank' ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                <span>Kado</span>
            </button>
        </div>
    );
}

/* ─── Main Controller Page Component ─── */
export default function DynamicIndex({ invitation, brideGrooms, events, loveStories, galleries, bankAccounts, guest, wishes }) {
    const { t } = useTranslation();
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('opening');
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const autoScrollInterval = useRef(null);

    const activeTopWish = wishes?.[0] || {
        name: 'Anisa Rahma',
        sender_name: 'Anisa Rahma',
        wish: 'Selamat menempuh hidup baru yaa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah... 💖🥰',
        message: 'Selamat menempuh hidup baru yaa! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah... 💖🥰'
    };

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    // Save global photos/animations override state on initial render
    useEffect(() => {
        globalShowPhotos = parseBool(invitation?.show_photos);
        globalShowAnimations = parseBool(invitation?.show_animations);
    }, [invitation]);

    // Scrollspy effect
    useEffect(() => {
        if (!isOpened) return;
        const handleScroll = () => {
            const sectionsList = ['opening', 'bride_groom', 'event', 'bank'];
            const scrollPosition = window.scrollY + 220; // offset for the taller header
            
            for (const section of sectionsList) {
                const el = document.getElementById(section);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const offset = el.offsetTop - 60; // offset for dynamic island header
            window.scrollTo({ top: offset, behavior: 'smooth' });
            setActiveSection(id);
        }
    };

    // Auto scroll logic managed via useEffect to avoid instant clearInterval on state re-render
    useEffect(() => {
        if (isAutoScrolling) {
            const scrollSpeed = 1;
            autoScrollInterval.current = setInterval(() => {
                window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
                if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) {
                    setIsAutoScrolling(false);
                }
            }, 30);
        } else {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
                autoScrollInterval.current = null;
            }
        }

        return () => {
            if (autoScrollInterval.current) {
                clearInterval(autoScrollInterval.current);
                autoScrollInterval.current = null;
            }
        };
    }, [isAutoScrolling]);

    const toggleAutoScroll = () => {
        setIsAutoScrolling((prev) => !prev);
    };

    // Handle background audio
    const handleAudioToggle = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {});
        }
    };

    const handleOpenInvitation = () => {
        setIsOpened(true);
        setIsPlaying(true);
        // Play Audio
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
        // Auto Fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // Fullscreen Change Observer
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

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    
    // Resolve which navigation sections to display
    const sections = safeArr(invitation?.sections || []);
    const resolvedSections = useMemo(() => {
        const list = [];
        const secCover = sections.find(s => s.section_key === 'cover');
        const secOpening = sections.find(s => s.section_key === 'opening');
        const secCouple = sections.find(s => s.section_key === 'bride_groom');
        const secEvent = sections.find(s => s.section_key === 'event');
        const secStory = sections.find(s => s.section_key === 'love_story');
        const secGallery = sections.find(s => s.section_key === 'gallery');
        const secLivestream = sections.find(s => s.section_key === 'livestream');
        const secRsvp = sections.find(s => s.section_key === 'rsvp');
        const secWishes = sections.find(s => s.section_key === 'wishes');
        const secBank = sections.find(s => s.section_key === 'bank');
        const secClosing = sections.find(s => s.section_key === 'closing');

        list.push({ key: 'cover', isVisible: secCover ? !!secCover.is_visible : true });
        list.push({ key: 'opening', isVisible: secOpening ? !!secOpening.is_visible : true });
        list.push({ key: 'bride_groom', isVisible: secCouple ? !!secCouple.is_visible : true });
        list.push({ key: 'event', isVisible: secEvent ? !!secEvent.is_visible : true });
        
        if (loveStories && loveStories.length > 0) {
            list.push({ key: 'love_story', isVisible: secStory ? !!secStory.is_visible : true });
        }
        
        const hasVideos = invitation?.video_list?.length > 0 && (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);
        if ((galleries && galleries.length > 0 && globalShowPhotos) || hasVideos) {
            list.push({ key: 'gallery', isVisible: secGallery ? !!secGallery.is_visible : true });
        }

        const hasStreaming = safeArr(events).some(e => e.streaming_url || (Array.isArray(e.streamings) && e.streamings.some(s => s.url)));
        if (hasStreaming) {
            list.push({ key: 'livestream', isVisible: secLivestream ? !!secLivestream.is_visible : true });
        }
        
        const isRsvpVisible = secRsvp ? !!secRsvp.is_visible : true;
        const isWishesVisible = secWishes ? !!secWishes.is_visible : true;

        if (isRsvpVisible) {
            list.push({ key: 'rsvp', isVisible: true });
        } else if (isWishesVisible) {
            list.push({ key: 'wishes', isVisible: true });
        }

        if (bankAccounts && bankAccounts.length > 0) {
            list.push({ key: 'bank', isVisible: secBank ? !!secBank.is_visible : true });
        }

        list.push({ key: 'closing', isVisible: secClosing ? !!secClosing.is_visible : true });

        return list.filter(item => item.isVisible);
    }, [sections, loveStories, galleries, bankAccounts, events]);

    // Form submission wrapper
    const handleRsvpSubmit = (data, onSuccessCallback) => {
        post(route('invitation.rsvp', { slug: invitation.slug }), {
            data: {
                ...data,
                guest_id: guest?.id || null
            },
            onSuccess: () => {
                onSuccessCallback?.();
                setDrawerOpen(false); // Close comments drawer on success!
            }
        });
    };

    return (
        <ErrorBoundary>
            <div className={`yt-invitation-theme ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                
                {/* Audio Element */}
                {invitation?.music_url && (
                    <audio
                        ref={audioRef}
                        src={getStorageUrl(invitation.music_url)}
                        loop
                        style={{ display: 'none' }}
                    />
                )}

                {/* Cover overlay screen */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                />

                {/* Main Content Area */}
                {isOpened && (
                    <div className="yt-invitation-body animate-in fade-in duration-700">
                        {/* Static Header Bar */}
                        <HeaderBar
                            isSingleHost={brideGrooms.length <= 1}
                            mainName={invitation.title}
                            isOpened={isOpened}
                            onOpen={() => {}}
                        />

                        {/* Navigation Scroll spy buttons */}
                        <div className="yt-floating-control-dock">
                            {/* Fullscreen Toggle */}
                            <button type="button" onClick={toggleFullscreen} className="yt-dock-btn" title="Toggle Fullscreen">
                                {isFullscreen ? (
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 12h-2v3h-3v2h5v-5zM10 17H5v-5h2v3h3v2zm5-10h-3V5h5v5h-2V7zM9 5H4v5h2V7h3V5z"/></svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                                )}
                            </button>

                            {/* Audio Playback Toggle */}
                            {invitation?.music_url && (
                                <button type="button" onClick={handleAudioToggle} className={`yt-dock-btn ${isPlaying ? 'playing' : ''}`} title="Mute/Unmute Audio">
                                    {isPlaying ? (
                                        <div className="global-music-waves">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                                    )}
                                </button>
                            )}

                            {/* Auto Scroll Toggle */}
                            <button type="button" onClick={toggleAutoScroll} className={`yt-dock-btn ${isAutoScrolling ? 'scrolling' : ''}`} title="Auto Scroll Page">
                                {isAutoScrolling ? (
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" style={{ color: 'var(--yt-white)' }}>
                                        <polyline points="7 13 12 18 17 13"></polyline>
                                        <polyline points="7 6 12 11 17 6"></polyline>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--yt-white)' }}>
                                        <polyline points="7 13 12 18 17 13"></polyline>
                                        <polyline points="7 6 12 11 17 6"></polyline>
                                    </svg>
                                )}
                            </button>

                            {/* Floating QR Code checkin trigger */}
                            {enableQr && guest && (
                                <button type="button" onClick={() => setShowQr(true)} className="yt-dock-btn qrcode" title="Show QR Checkin">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm13-2h3v2h-3zm-2 2h2v3h-2zm2 3h3v2h-3zm-2 0h2v-2h-2zm4-5h2v2h-2zm-4-3h2v2h-2z"/></svg>
                                </button>
                            )}
                        </div>

                        {/* Dynamic layout elements render */}
                        <div className="yt-sections-wrapper">
                            {resolvedSections.map((sec) => {
                                switch (sec.key) {
                                    case 'opening':
                                        return (
                                            <OpeningSection
                                                key="opening"
                                                id="opening"
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                                scrollToSection={scrollToSection}
                                                loveStories={loveStories}
                                                galleries={galleries}
                                                enableRsvp={resolvedSections.some(s => s.key === 'rsvp')}
                                                enableWishes={resolvedSections.some(s => s.key === 'wishes')}
                                                bankAccounts={bankAccounts}
                                                onOpenRsvp={() => setDrawerOpen(true)}
                                                topWish={activeTopWish}
                                            />
                                        );
                                    case 'bride_groom':
                                        return (
                                            <BrideGroomSection
                                                key="bride_groom"
                                                id="bride_groom"
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                                events={events}
                                            />
                                        );
                                    case 'event':
                                        return (
                                            <EventSection
                                                key="event"
                                                events={events}
                                                invitation={invitation}
                                            />
                                        );
                                    case 'love_story':
                                        return (
                                            <LoveStorySection
                                                key="love_story"
                                                loveStories={loveStories}
                                                invitation={invitation}
                                            />
                                        );
                                    case 'gallery':
                                        return (
                                            <GallerySection key="gallery" galleries={galleries} invitation={invitation} />
                                        );
                                    case 'livestream':
                                        return (
                                            <LiveStreamingSection
                                                key="livestream"
                                                events={events}
                                                invitation={invitation}
                                                galleries={galleries}
                                            />
                                        );
                                    case 'rsvp':
                                        return (
                                            <div key="rsvp" id="rsvp" className="p-4" style={{ backgroundColor: 'var(--yt-bg)', borderBottom: '6px solid #212121', boxSizing: 'border-box' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <h3 className="yt-section-title-bar" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '10px', height: '10px' }}>
                                                            <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#ff0000', opacity: 0.75 }} />
                                                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '6px', width: '6px', backgroundColor: '#ff0000' }} />
                                                        </div>
                                                        <span className="text-white text-[16px] font-bold">Comments & RSVP</span>
                                                        <span className="yt-comments-count-badge" style={{ backgroundColor: 'var(--yt-hover-bg)', color: 'var(--yt-white)', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '12px' }}>{wishes.length + dummyWishes.length}</span>
                                                    </h3>
                                                    <span style={{ fontSize: '11px', color: '#ff0000', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setDrawerOpen(true)}>
                                                        Tulis RSVP & Ucapan
                                                    </span>
                                                </div>
                                                
                                                <CompactCommentsWidget wish={activeTopWish} onClick={() => setDrawerOpen(true)} />
                                                
                                                <div style={{ marginTop: '12px' }}>
                                                    <button type="button" onClick={() => setDrawerOpen(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#c00', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(204, 0, 0, 0.3)', transition: 'background-color 0.2s' }}>
                                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                                                        <span>Konfirmasi Kehadiran (RSVP) & Ucapan</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    case 'wishes':
                                        if (resolvedSections.some(s => s.key === 'rsvp')) return null;
                                        return (
                                            <div key="wishes" id="wishes" className="p-4" style={{ backgroundColor: 'var(--yt-bg)', borderBottom: '6px solid #212121', boxSizing: 'border-box' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                    <h3 className="yt-section-title-bar" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '10px', height: '10px' }}>
                                                            <span className="animate-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#ff0000', opacity: 0.75 }} />
                                                            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '6px', width: '6px', backgroundColor: '#ff0000' }} />
                                                        </div>
                                                        <span className="text-white text-[16px] font-bold">Comments & RSVP</span>
                                                        <span className="yt-comments-count-badge" style={{ backgroundColor: 'var(--yt-hover-bg)', color: 'var(--yt-white)', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '12px' }}>{wishes.length + dummyWishes.length}</span>
                                                    </h3>
                                                    <span style={{ fontSize: '11px', color: '#ff0000', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setDrawerOpen(true)}>
                                                        Tulis RSVP & Ucapan
                                                    </span>
                                                </div>
                                                
                                                <CompactCommentsWidget wish={activeTopWish} onClick={() => setDrawerOpen(true)} />
                                                
                                                <div style={{ marginTop: '12px' }}>
                                                    <button type="button" onClick={() => setDrawerOpen(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#c00', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(204, 0, 0, 0.3)', transition: 'background-color 0.2s' }}>
                                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
                                                        <span>Konfirmasi Kehadiran (RSVP) & Ucapan</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    case 'bank':
                                        return (
                                            <BankSection
                                                key="bank"
                                                bankAccounts={bankAccounts}
                                            />
                                        );
                                    case 'closing':
                                        return (
                                            <ClosingSection
                                                key="closing"
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                            />
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                        
                        {/* Bottom Navigation Menu */}
                        <BottomMenu activeSection={activeSection} scrollToSection={scrollToSection} onOpenRsvp={() => setDrawerOpen(true)} />
                    </div>
                )}

                {/* Immersive Mobile Comments Overlay Drawer */}
                {drawerOpen && (
                    <div className="yt-drawer-overlay animate-in fade-in duration-200" onClick={() => setDrawerOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000 }}>
                        <div className="ytn-drawer-card slide-up" onClick={(e) => e.stopPropagation()}>
                            <div className="ytn-drawer-header">
                                <h4>Konfirmasi RSVP & Kirim Ucapan</h4>
                                <button type="button" className="close-btn" onClick={() => setDrawerOpen(false)}>&times;</button>
                            </div>

                            <div className="ytn-drawer-body">
                                <RsvpSection
                                    invitation={invitation}
                                    onSubmit={handleRsvpSubmit}
                                    processing={false}
                                    errors={{}}
                                    wishesList={wishes || []}
                                    enableWishes={true}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* QR Code Checkin Modal overlay */}
                {enableQr && showQr && guest && (
                    <div className="yt-qr-overlay animate-in fade-in duration-200" onClick={() => setShowQr(false)}>
                        <div className="yt-qr-modal animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <button type="button" onClick={() => setShowQr(false)} className="yt-qr-close-btn">&times;</button>
                            <h4 className="yt-qr-title">Check-in QR Code</h4>
                            <p className="yt-qr-subtitle">Scan at the venue entrance for quick presence registration.</p>
                            
                            <div className="yt-qr-img-wrapper">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=FF0000&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`}
                                    alt="QR Code Presensi"
                                />
                            </div>
                            
                            <div className="yt-qr-guest-name">@{guest.name}</div>
                        </div>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    );
}
