import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'wedding';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let mainName = '';
    let initials = '';
    let isSingleHost = false;
    
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
        albumLabel: isEn ? 'MEMORIES ALBUM' : 'ALBUM KENANGAN',
        albumSubtitle: isEn ? 'Special Playlist' : 'Daftar Putar Spesial',
        eventHeader: isEn ? 'SPECIAL EVENT' : 'ACARA SPESIAL',
        introBadge: isEn ? 'SPECIAL EVENT' : 'ACARA SPESIAL',
        introTitle: invitation?.opening_title || (isEn ? 'Special Celebration' : 'Perayaan Spesial'),
        introText: invitation?.opening_text || '',
        profileHeader: isEn ? 'Featured Profile' : 'Profil Utama',
        storyHeader: isEn ? 'Our Journey' : 'Kisah Perjalanan',
        storySubtitle: isEn ? 'Journey Playlist' : 'Daftar Putar Perjalanan',
        streamDesc: isEn ? 'Join our event virtually via the streaming links below' : 'Saksikan momen bahagia kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.'
    };

    if (t === 'wedding') {
        labels.albumLabel = isEn ? 'PLAYING FROM WEDDING ALBUM' : 'MEMUTAR DARI ALBUM PERNIKAHAN';
        labels.albumSubtitle = isEn ? 'The Wedding Album' : 'Album Pernikahan';
        labels.eventHeader = isEn ? 'Live Events / Tour' : 'Jadwal Acara / Tur';
        labels.introBadge = isEn ? 'THE WEDDING OF' : 'PERNIKAHAN';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Wedding Album' : 'Album Pernikahan');
        labels.introText = invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami meresmikan ikatan pernikahan kami.';
        labels.profileHeader = isEn ? 'Featured Artists' : 'Artis Utama';
        labels.storyHeader = isEn ? 'Love Story Playlist' : 'Daftar Putar Kisah Cinta';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our hearts' : 'Lirik disinkronkan dengan hati kami';
        labels.streamDesc = isEn ? 'Please join our wedding virtually via the streaming platform links below' : 'Saksikan momen bahagia pernikahan kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    } else if (t === 'anniversary') {
        labels.albumLabel = isEn ? 'PLAYING FROM ANNIVERSARY ALBUM' : 'MEMUTAR DARI ALBUM ANNIVERSARY';
        labels.albumSubtitle = isEn ? 'The Anniversary Album' : 'Album Anniversary';
        labels.eventHeader = isEn ? 'Anniversary Tour' : 'Jadwal Perayaan / Tur';
        labels.introBadge = isEn ? 'ANNIVERSARY OF' : 'ANNIVERSARY';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Anniversary Album' : 'Album Anniversary');
        labels.introText = invitation?.opening_text || 'Perjalanan kasih kami yang penuh berkat dan kebahagiaan.';
        labels.profileHeader = isEn ? 'Featured Couple' : 'Pasangan Utama';
        labels.storyHeader = isEn ? 'Love Journey Playlist' : 'Daftar Putar Perjalanan Kasih';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our years' : 'Lirik disinkronkan dengan tahun-tahun kami';
        labels.streamDesc = isEn ? 'Please join our celebration virtually via the streaming platform links below' : 'Saksikan momen bahagia anniversary kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    } else if (t === 'graduation') {
        labels.albumLabel = isEn ? 'PLAYING FROM GRADUATION ALBUM' : 'MEMUTAR DARI ALBUM WISUDA';
        labels.albumSubtitle = isEn ? 'The Graduation Album' : 'Album Wisuda';
        labels.eventHeader = isEn ? 'Graduation Tour' : 'Jadwal Acara / Wisuda';
        labels.introBadge = isEn ? 'THE GRADUATION OF' : 'WISUDA';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Graduation Album' : 'Album Wisuda');
        labels.introText = invitation?.opening_text || 'Perayaan kelulusan dan awal dari perjalanan studi baru.';
        labels.profileHeader = isEn ? 'Featured Graduate' : 'Profil Wisudawan';
        labels.storyHeader = isEn ? 'Study Journey Playlist' : 'Daftar Putar Perjalanan Studi';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our study days' : 'Lirik disinkronkan dengan perjuangan studi kami';
        labels.streamDesc = isEn ? 'Please join our graduation virtually via the streaming platform links below' : 'Saksikan momen syukuran kelulusan kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    } else if (t === 'birthday') {
        labels.albumLabel = isEn ? 'PLAYING FROM BIRTHDAY ALBUM' : 'MEMUTAR DARI ALBUM ULANG TAHUN';
        labels.albumSubtitle = isEn ? 'The Birthday Album' : 'Album Ulang Tahun';
        labels.eventHeader = isEn ? 'Birthday Party Tour' : 'Jadwal Perayaan / Tur';
        labels.introBadge = isEn ? 'THE BIRTHDAY OF' : 'ULANG TAHUN';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Birthday Album' : 'Album Ulang Tahun');
        labels.introText = invitation?.opening_text || 'Syukuran pertambahan usia dan langkah baru penuh berkah.';
        labels.profileHeader = isEn ? 'Featured Celebrant' : 'Profil Ulang Tahun';
        labels.storyHeader = isEn ? 'Life Milestones Playlist' : 'Daftar Putar Perjalanan Hidup';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our milestones' : 'Lirik disinkronkan dengan perjalanan usia kami';
        labels.streamDesc = isEn ? 'Please join our birthday party virtually via the streaming platform links below' : 'Saksikan momen pertambahan usia kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    } else if (t === 'aqiqah') {
        labels.albumLabel = isEn ? 'PLAYING FROM AQIQAH ALBUM' : 'MEMUTAR DARI ALBUM AQIQAH';
        labels.albumSubtitle = isEn ? 'The Aqiqah Album' : 'Album Aqiqah';
        labels.eventHeader = isEn ? 'Aqiqah Celebration Tour' : 'Jadwal Acara / Aqiqah';
        labels.introBadge = isEn ? 'THE AQIQAH OF' : 'AQIQAH';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Aqiqah Album' : 'Album Aqiqah');
        labels.introText = invitation?.opening_text || 'Syukuran kehadiran buah hati tercinta yang menjadi penyejuk hati kami.';
        labels.profileHeader = isEn ? 'Featured Child' : 'Profil Anak';
        labels.storyHeader = isEn ? 'Baby Growth Playlist' : 'Daftar Putar Tumbuh Kembang';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our baby steps' : 'Lirik disinkronkan dengan tumbuh kembang buah hati kami';
        labels.streamDesc = isEn ? 'Please join our aqiqah virtually via the streaming platform links below' : 'Saksikan momen aqiqah putra/putri kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    } else if (t === 'circumcision') {
        labels.albumLabel = isEn ? 'PLAYING FROM CIRCUMCISION ALBUM' : 'MEMUTAR DARI ALBUM KHITANAN';
        labels.albumSubtitle = isEn ? 'The Circumcision Album' : 'Album Khitanan';
        labels.eventHeader = isEn ? 'Circumcision Tour' : 'Jadwal Syukuran / Tur';
        labels.introBadge = isEn ? 'THE CIRCUMCISION OF' : 'KHITANAN';
        labels.introTitle = invitation?.opening_title || (isEn ? 'The Circumcision Album' : 'Album Khitanan');
        labels.introText = invitation?.opening_text || 'Syukuran khitanan putra kami sebagai bagian dari syariat dan kesehatan.';
        labels.profileHeader = isEn ? 'Featured Child' : 'Profil Anak';
        labels.storyHeader = isEn ? 'Growth Journey Playlist' : 'Daftar Putar Tumbuh Kembang';
        labels.storySubtitle = isEn ? 'Lyrics synchronized with our boy steps' : 'Lirik disinkronkan dengan kisah tumbuh kembang putra kami';
        labels.streamDesc = isEn ? 'Please join our circumcision celebration virtually via the streaming platform links below' : 'Saksikan momen syukuran khitanan putra kami secara virtual dari mana saja melalui tombol live streaming di bawah ini.';
    }

    return {
        mainName,
        initials,
        isSingleHost,
        labels
    };
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

import PremiumSlideshow from '@/Components/PremiumSlideshow';

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
        if (cleanUrl === 'storage/' || cleanUrl === 'storage/null' || cleanUrl === 'storage/undefined') return fallback;
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

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 24, color: '#fff', background: '#121212', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#1DB954', fontSize: '1.5rem', marginBottom: 12 }}>Terjadi Kesalahan Rendering Tema</h2>
                <p style={{ color: '#a7a7a7', fontSize: '0.85rem', marginBottom: 20 }}>Visualisasi gagal di-render di halaman undangan ini.</p>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#ff4d4d', background: '#181818', padding: 16, borderRadius: 8, border: '1px solid #292929', maxWidth: '100%', textAlign: 'left' }}>
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

    let animClass = 'spty-reveal';
    if (variant === 'left') animClass = 'spty-reveal spty-reveal--left';
    else if (variant === 'right') animClass = 'spty-reveal spty-reveal--right';
    else if (variant === 'zoom') animClass = 'spty-reveal spty-reveal--zoom';

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
   COVER SECTION (Spotivite Now Playing UI)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, language, fallbackPhoto }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, initials, labels } = themeConfig;

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = mainName;

    const artworkUrl = getStorageUrl(invitation?.cover_image, null) || fallbackPhoto;
    const [coverSrc, setCoverSrc] = useState(artworkUrl);

    useEffect(() => {
        setCoverSrc(artworkUrl);
    }, [artworkUrl]);

    const handleCoverError = () => {
        if (coverSrc !== fallbackPhoto && fallbackPhoto) {
            setCoverSrc(fallbackPhoto);
        } else {
            setCoverSrc(null);
        }
    };

    return (
        <div className={`spty-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'spty-no-photo-mode' : ''}`}>
            {globalShowPhotos && invitation?.cover_image && (
                <PremiumSlideshow
                    images={invitation.cover_image.split(',')}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="spty-cover__bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                />
            )}
            <div className="spty-cover__inner">
                <div className="spty-cover__device">
                    <div className="spty-cover__header">
                        <i className="fas fa-chevron-down" />
                        <span>{labels.albumLabel}</span>
                        <i className="fas fa-ellipsis-v" />
                    </div>

                    <div className="spty-cover__artwork-wrap relative overflow-hidden">
                        {globalShowPhotos && invitation?.cover_image ? (
                            <PremiumSlideshow
                                images={invitation.cover_image.split(',')}
                                positionX={invitation?.cover_position_x}
                                positionY={invitation?.cover_position_y}
                                zoom={invitation?.cover_zoom}
                                className="absolute inset-0 w-full h-full z-0"
                                imgClassName="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="spty-cover__monogram-art">{initials}</div>
                        )}
                    </div>

                    <div className="spty-cover__title-area">
                        <div className="spty-cover__titles">
                            <h1 className="spty-cover__song-title">{coupleName}</h1>
                            <p className="spty-cover__artist">{invitation?.cover_subtitle || labels.albumSubtitle}</p>
                        </div>
                        <button className="spty-cover__like-btn" type="button">
                            <i className="fas fa-heart" />
                        </button>
                    </div>

                    <div className="spty-cover__seekbar">
                        <div className="spty-cover__progress-bg">
                            <div className="spty-cover__progress-fill" />
                        </div>
                    </div>

                    <div className="spty-cover__time-row">
                        <span>0:00</span>
                        <span>2:026</span>
                    </div>

                    <div className="spty-cover__controls">
                        <button className="spty-cover__ctrl-btn active" type="button" title="Shuffle">
                            <i className="fas fa-random" />
                        </button>
                        <button className="spty-cover__ctrl-btn" type="button" title="Previous">
                            <i className="fas fa-step-backward" />
                        </button>
                        <button
                            id="tombol-buka"
                            onClick={onOpen}
                            className="spty-cover__ctrl-btn spty-cover__ctrl-btn--play"
                            type="button"
                            title={locale === 'en' ? 'Open Invitation' : 'Buka Undangan'}
                        >
                            <i className="fas fa-play" />
                        </button>
                        <button className="spty-cover__ctrl-btn" type="button" title="Next">
                            <i className="fas fa-step-forward" />
                        </button>
                        <button className="spty-cover__ctrl-btn active" type="button" title="Repeat">
                            <i className="fas fa-redo-alt" />
                        </button>
                    </div>

                    <div className="spty-cover__guest-panel">
                        <p className="spty-cover__guest-label">{t('invitation.dear_guest')}</p>
                        <p className="spty-cover__guest-name">{guestName}</p>
                        <p className="spty-cover__guest-desc">{t('invitation.dear_guest_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (Playlist Intro style)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, events, wishes, onOpenMusic, language, fallbackPhoto }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, initials, labels } = themeConfig;

    const coverBg = getStorageUrl(invitation?.opening_image || invitation?.cover_image, null) || fallbackPhoto;
    const [playlistSrc, setPlaylistSrc] = useState(coverBg);
    const totalWishes = safeArr(wishes).length;

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const eventDateStr = primaryEvent?.event_date || primaryEvent?.date;
    const formattedDate = eventDateStr ? formatDate(eventDateStr, locale) : '';

    const isIdenticalQuote = invitation?.opening_ayat && invitation?.opening_ayat_translation &&
        invitation.opening_ayat.trim().toLowerCase() === invitation.opening_ayat_translation.trim().toLowerCase();
    const showBigAyat = invitation?.opening_ayat && !isIdenticalQuote;

    useEffect(() => {
        setPlaylistSrc(coverBg);
    }, [coverBg]);

    const handlePlaylistError = () => {
        if (playlistSrc !== fallbackPhoto && fallbackPhoto) {
            setPlaylistSrc(fallbackPhoto);
        } else {
            setPlaylistSrc(null);
        }
    };

    return (
        <section id="opening" className="spty-section spty-opening">
            <div className="spty-opening__playlist-header">
                {globalShowPhotos && (invitation?.opening_image || invitation?.cover_image) ? (
                    <div className="spty-opening__playlist-img relative overflow-hidden">
                        <PremiumSlideshow
                            images={invitation?.opening_image ? invitation.opening_image.split(',') : (invitation?.cover_image ? invitation.cover_image.split(',') : [])}
                            positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                            positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                            zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                            className="absolute inset-0 w-full h-full z-0"
                            imgClassName="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="spty-opening__playlist-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--spty-green)', fontSize: '2.5rem', fontWeight: '800' }}>
                        {initials}
                    </div>
                )}
                <div className="spty-opening__playlist-info">
                    <span className="spty-opening__badge">{labels.introBadge}</span>
                    <h2 className="spty-opening__playlist-title">{mainName}</h2>
                    {formattedDate && (
                        <p className="spty-opening__playlist-meta">
                            {formattedDate}
                        </p>
                    )}
                </div>
            </div>

            <div className="spty-opening__controls">
                <button className="spty-opening__play-icon" type="button" onClick={onOpenMusic} title="Play Album">
                    <i className="fas fa-play" />
                </button>
                <button className="spty-opening__icon-btn" type="button" title="Download">
                    <i className="far fa-arrow-alt-circle-down" />
                </button>
                <button className="spty-opening__icon-btn" type="button" title="Collaborate">
                    <i className="fas fa-user-plus" />
                </button>
                <button className="spty-opening__icon-btn" type="button" title="More Options">
                    <i className="fas fa-ellipsis-h" />
                </button>
            </div>

            {invitation?.opening_ayat && (
                <Reveal className="spty-opening__quote-card" variant="zoom">
                    <i className="fas fa-quote-left" />
                    {showBigAyat && (
                        <p className="spty-opening__ayat" dir="auto">{invitation.opening_ayat}</p>
                    )}
                    {invitation?.opening_ayat_translation && (
                        <p className="spty-opening__terjemah">{invitation.opening_ayat_translation}</p>
                    )}
                    {invitation?.opening_ayat_source && (
                        <p className="spty-opening__source">&mdash; {invitation.opening_ayat_source}</p>
                    )}
                </Reveal>
            )}

            <Reveal className="spty-opening__content" variant="up" delay={200}>
                <h3 className="spty-section-title"><span>#</span>Introduction</h3>
                <h4 className="spty-section-header">{labels.introTitle}</h4>
                <p className="spty-opening__body">{labels.introText}</p>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   MEMPELAI SECTION (Artist Profile UI)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, invitation, language }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, isSingleHost, labels } = themeConfig;
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const groomPhotoUrl = getStorageUrl(groom.photo, null);
    const bridePhotoUrl = getStorageUrl(bride.photo, null);
    
    const [groomSrc, setGroomSrc] = useState(groomPhotoUrl);
    const [brideSrc, setBrideSrc] = useState(bridePhotoUrl);

    useEffect(() => {
        setGroomSrc(groomPhotoUrl);
    }, [groomPhotoUrl]);

    useEffect(() => {
        setBrideSrc(bridePhotoUrl);
    }, [bridePhotoUrl]);

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

    const artistBannerUrl = getStorageUrl(invitation?.cover_image, null);

    return (
        <section id="bride_groom" className="spty-section">
            <div className="spty-couple__banner" style={globalShowPhotos && artistBannerUrl ? { backgroundImage: `url(${artistBannerUrl})` } : { background: 'linear-gradient(185deg, #1f3e2f 0%, #121212 90%)' }}>
                <div className="spty-couple__banner-overlay" />
                <div className="spty-couple__banner-info">
                    <div className="spty-couple__verified">
                        <i className="fas fa-check-circle" /> {locale === 'en' ? 'Verified Artists' : 'Artis Terverifikasi'}
                    </div>
                    <h2 className="spty-section-header" style={{ margin: 0, fontSize: '2.25rem' }}>
                        {mainName}
                    </h2>
                    <p className="spty-couple__monthly-listeners">{locale === 'en' ? 'Monthly Listeners: Forever & Always' : 'Pendengar Bulanan: Selamanya & Selalu'}</p>
                </div>
            </div>

            <h3 className="spty-couple__featured-header">
                <i className="fas fa-users-cog" style={{ color: 'var(--spty-green)' }} /> {labels.profileHeader}
            </h3>

            <div className="spty-artists-list">
                {isSingleHost ? (
                    groom && (
                        <Reveal className="spty-artist-card" variant="zoom">
                            <div className="spty-artist-card__photo-wrap">
                                {globalShowPhotos && groomSrc ? (
                                    <img src={groomSrc} alt={groom.full_name} className="spty-artist-card__photo" onError={() => setGroomSrc(null)} />
                                ) : (
                                    <div className="spty-artist-card__monogram">{(groom.nickname?.charAt(0) || initials)}</div>
                                )}
                            </div>
                            <div className="spty-artist-card__info">
                                <span className="spty-artist-card__role">{locale === 'en' ? 'Featured Artist' : 'Profil Utama'}</span>
                                <h4 className="spty-artist-card__name">{groom.full_name}</h4>
                                <p className="spty-artist-card__parents">
                                    {translateChildOrder(groom.child_order, groom.gender)}<br />
                                    <strong>Bapak {groom.father_name} & Ibu {groom.mother_name}</strong>
                                </p>
                                {groom.instagram && (
                                    <a href={`https://instagram.com/${groom.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="spty-artist-card__ig">
                                        <i className="fab fa-instagram" /> Instagram
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    )
                ) : (
                    <>
                        {/* Groom Card */}
                        {groom && (
                            <Reveal className="spty-artist-card" variant="left">
                                <div className="spty-artist-card__photo-wrap">
                                    {globalShowPhotos && groomSrc ? (
                                        <img src={groomSrc} alt={groom.full_name} className="spty-artist-card__photo" onError={() => setGroomSrc(null)} />
                                    ) : (
                                        <div className="spty-artist-card__monogram">{(groom.nickname?.charAt(0) || 'B')}</div>
                                    )}
                                </div>
                                <div className="spty-artist-card__info">
                                    <span className="spty-artist-card__role">{locale === 'en' ? 'Groom / Artist' : 'Mempelai Pria'}</span>
                                    <h4 className="spty-artist-card__name">{groom.full_name}</h4>
                                    <p className="spty-artist-card__parents">
                                        {translateChildOrder(groom.child_order, 'pria')}<br />
                                        <strong>Bapak {groom.father_name} & Ibu {groom.mother_name}</strong>
                                    </p>
                                    {groom.instagram && (
                                        <a href={`https://instagram.com/${groom.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="spty-artist-card__ig">
                                            <i className="fab fa-instagram" /> Instagram
                                        </a>
                                    )}
                                </div>
                            </Reveal>
                        )}

                        {/* Bride Card */}
                        {bride && (
                            <Reveal className="spty-artist-card" variant="right" delay={150}>
                                <div className="spty-artist-card__photo-wrap">
                                    {globalShowPhotos && brideSrc ? (
                                        <img src={brideSrc} alt={bride.full_name} className="spty-artist-card__photo" onError={() => setBrideSrc(null)} />
                                    ) : (
                                        <div className="spty-artist-card__monogram">{(bride.nickname?.charAt(0) || 'R')}</div>
                                    )}
                                </div>
                                <div className="spty-artist-card__info">
                                    <span className="spty-artist-card__role">{locale === 'en' ? 'Bride / Artist' : 'Mempelai Wanita'}</span>
                                    <h4 className="spty-artist-card__name">{bride.full_name}</h4>
                                    <p className="spty-artist-card__parents">
                                        {translateChildOrder(bride.child_order, 'wanita')}<br />
                                        <strong>Bapak {bride.father_name} & Ibu {bride.mother_name}</strong>
                                    </p>
                                    {bride.instagram && (
                                        <a href={`https://instagram.com/${bride.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="spty-artist-card__ig">
                                            <i className="fab fa-instagram" /> Instagram
                                        </a>
                                    )}
                                </div>
                            </Reveal>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER SECTION
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate, language }) {
    const { t } = useTranslation(language);
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

        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [targetDate]);

    // Random height values for dummy visualizer bars
    const barsCount = 14;
    const heights = [10, 18, 6, 22, 14, 8, 20, 12, 24, 16, 8, 18, 10, 14];

    return (
        <div className="spty-countdown">
            <div className="spty-countdown__visualizer">
                {Array.from({ length: barsCount }).map((_, i) => (
                    <div
                        key={i}
                        className="spty-countdown__bar"
                        style={{
                            height: `${heights[i]}px`,
                            animationDelay: `${i * 90}ms`,
                            animationDuration: `${0.8 + (i % 3) * 0.2}s`
                        }}
                    />
                ))}
            </div>
            <div className="spty-countdown__grid">
                <div className="spty-countdown__item">
                    <span className="spty-countdown__val">{pad2(cd.d)}</span>
                    <span className="spty-countdown__label">{t('invitation.days') || 'Days'}</span>
                </div>
                <span className="spty-countdown__colon">:</span>
                <div className="spty-countdown__item">
                    <span className="spty-countdown__val">{pad2(cd.h)}</span>
                    <span className="spty-countdown__label">{t('invitation.hours') || 'Hrs'}</span>
                </div>
                <span className="spty-countdown__colon">:</span>
                <div className="spty-countdown__item">
                    <span className="spty-countdown__val">{pad2(cd.m)}</span>
                    <span className="spty-countdown__label">{t('invitation.minutes') || 'Min'}</span>
                </div>
                <span className="spty-countdown__colon">:</span>
                <div className="spty-countdown__item">
                    <span className="spty-countdown__val">{pad2(cd.s)}</span>
                    <span className="spty-countdown__label">{t('invitation.seconds') || 'Sec'}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   ACARA SECTION (Concert Tour Dates UI)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, language, sections }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, [], invitation);
    const { labels } = themeConfig;
    const safeEvents = safeArr(events);
    const primaryEvent = safeEvents.find(e => e.is_primary) || safeEvents[0];

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const bgs = safeArr(invitation?.brideGrooms || []);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    const showCountdown = parseBool(invitation?.show_countdown, true);
    const showCountdownInEvent = useMemo(() => {
        if (!primaryEvent?.event_date || !showCountdown) return false;
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    }, [sections, primaryEvent?.event_date, showCountdown]);

    return (
        <section id="event" className="spty-section">
            <h3 className="spty-section-title"><span>#</span>Schedule</h3>
            <h4 className="spty-section-header">{labels.eventHeader}</h4>

            {showCountdownInEvent && (
                <CountdownTimer targetDate={primaryEvent.event_date} language={language} />
            )}

            <div className="spty-tour">
                {safeEvents.map((ev, idx) => {
                    const { dayNum, dayName, monthName, year } = parseEventDate(ev.event_date || ev.date);
                    const formattedMonth = String(monthName).substring(0, 3);
                    const formattedTime = ev.start_time ? `${formatTime(ev.start_time)} ${ev.timezone || 'WIB'}` : '';

                    return (
                        <Reveal key={ev.id || idx} className="spty-tour-card" variant="up" delay={idx * 100}>
                            <div className="spty-tour-card__date-badge">
                                <span className="spty-tour-card__month">{formattedMonth}</span>
                                <span className="spty-tour-card__day-num">{dayNum}</span>
                                <span className="spty-tour-card__day-name">{dayName.substring(0, 3)}</span>
                            </div>
                            <div className="spty-tour-card__details">
                                <h4 className="spty-tour-card__title">{ev.event_name || 'Acara'}</h4>
                                <p className="spty-tour-card__time">
                                    <i className="far fa-clock" /> {formattedTime} {ev.end_time ? `- ${formatTime(ev.end_time)}` : (locale === 'en' ? ' - Finished' : ' - Selesai')}
                                </p>
                                <p className="spty-tour-card__venue">{ev.venue_name}</p>
                                <p className="spty-tour-card__address">{ev.venue_address}</p>
                                <div className="spty-tour-card__actions">
                                    {ev.gmaps_link && (
                                        <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="spty-btn spty-btn--small">
                                            <i className="fas fa-map-marker-alt" /> {locale === 'en' ? 'Get Directions' : 'Petunjuk Arah'}
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="spty-btn spty-btn--outline spty-btn--small">
                                        <i className="far fa-calendar-alt" /> {locale === 'en' ? 'Add to Calendar' : 'Simpan Kalender'}
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

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, language }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, [], invitation);
    const { labels } = themeConfig;
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
        <section id="livestream" className="spty-section">
            <h3 className="spty-section-title"><span>#</span>Virtual</h3>
            <h4 className="spty-section-header">{locale === 'en' ? 'Live Broadcast' : 'Siaran Langsung'}</h4>

            <div className="spty-stream">
                <span className="spty-stream__icon"><i className="fas fa-satellite-dish" /></span>
                <h5 className="spty-stream__title">{locale === 'en' ? 'Join Virtually' : 'Saksikan Siaran Langsung'}</h5>
                <p className="spty-stream__desc">{labels.streamDesc}</p>
                
                <div className="spty-stream__btns">
                    {streamsList.map((stream, idx) => (
                        <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="spty-btn spty-glow-button">
                            <i className="fas fa-video" /> {locale === 'en' ? 'Stream via' : 'Saksikan via'} {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (Spotivite Scrolling Lyrics UI)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, language, invitation }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, [], invitation);
    const { labels } = themeConfig;
    const stories = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const lines = container.querySelectorAll('.spty-lyrics__line');
        if (lines.length === 0) return;

        const options = {
            root: null, // viewport
            rootMargin: '-30% 0px -40% 0px', // targets the middle band of the screen
            threshold: 0
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idxAttr = entry.target.getAttribute('data-index');
                    if (idxAttr !== null) {
                        setActiveIdx(parseInt(idxAttr, 10));
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        lines.forEach(line => observer.observe(line));

        return () => {
            observer.disconnect();
        };
    }, [stories]);

    if (stories.length === 0) return null;

    return (
        <section id="love_story" className="spty-section">
            <h3 className="spty-section-title"><span>#</span>OurLyrics</h3>
            <h4 className="spty-section-header">{labels.storyHeader}</h4>

            <div className="spty-lyrics">
                <div className="spty-lyrics__watermark">
                    <i className="fas fa-music" /> {labels.storySubtitle}
                </div>

                <div ref={containerRef} className="spty-lyrics__list">
                    {stories.map((story, idx) => {
                        const formattedDate = story.story_date ? formatStoryDate(story.story_date) : '';
                        const isActive = activeIdx === idx;
                        return (
                            <div
                                key={story.id || idx}
                                data-index={idx}
                                className={`spty-lyrics__line${isActive ? ' is-active' : ''}`}
                                onClick={() => setActiveIdx(idx)}
                            >
                                <div className="spty-lyrics__line-date">{formattedDate || `Chapter ${idx + 1}`}</div>
                                <h4 className="spty-lyrics__line-title">{story.title}</h4>
                                <p className="spty-lyrics__line-text">{story.description || story.story}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

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

/* ═══════════════════════════════════════
   GALERI SECTION (Popular Releases UI)
   ═══════════════════════════════════════ */
function GallerySection({ galleries, language, invitation }) {
    const { t, locale } = useTranslation(language);
    const safeGalleries = safeArr(galleries);
    const [brokenImages, setBrokenImages] = useState({});
    const [activeIdx, setActiveIdx] = useState(null);

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
                src: getStorageUrl(g.image_url),
                title: g.caption || ('Single Release #' + (idx + 1)),
                subtitle: locale === 'en' ? 'Album Track' : 'Lagu Album',
                id: g.id || idx
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
                    src: 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg',
                    title: locale === 'en' ? ('Prewedding Video Track #' + (idx + 1)) : ('Video Musik #' + (idx + 1)),
                    subtitle: locale === 'en' ? 'Music Video • Featured Release' : 'Video Musik • Rilis Utama',
                    id: 'video-' + idx
                });
            }
        });
    }

    if (galleryItems.length === 0) return null;

    const handleImgError = (idx) => {
        setBrokenImages(prev => ({ ...prev, [idx]: true }));
    };

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

    const handleOpenModal = (idx) => {
        setActiveIdx(idx);
        if (galleryItems[idx]?.type === 'video') {
            const audioEl = document.querySelector('audio');
            if (audioEl) {
                audioEl.pause();
            }
        }
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
        <section id="gallery" className="spty-section">
            <h3 className="spty-section-title"><span>#</span>Discography</h3>
            <h4 className="spty-section-header">{locale === 'en' ? 'Popular Releases' : 'Rilis Populer'}</h4>

            <div className="spty-gallery__grid">
                {galleryItems.map((item, idx) => {
                    const isVideo = item.type === 'video';
                    if (brokenImages[idx] && !isVideo) return null;
                    return (
                        <Reveal key={item.id} className="spty-gallery__item" variant="zoom" delay={(idx % 4) * 100}>
                            <div className="spty-gallery__img-wrap" onClick={() => handleOpenModal(idx)} style={{ cursor: 'pointer', position: 'relative' }}>
                                <img src={item.src} alt={item.title} className="spty-gallery__img" onError={() => handleImgError(idx)} loading="lazy" />
                                
                                {isVideo ? (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.2s'
                                    }} className="spty-video-overlay-hover">
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            backgroundColor: '#1db954',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)'
                                        }}>
                                            <svg style={{ width: '16px', height: '16px', fill: '#000000', marginLeft: '2px' }} viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(0,0,0,0)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'background-color 0.2s'
                                    }} className="spty-photo-overlay-hover">
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.2s'
                                        }} className="spty-zoom-icon">
                                            <i className="fas fa-search-plus" style={{ color: '#fff', fontSize: '12px' }} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h5 className="spty-gallery__caption" style={{ color: isVideo ? '#1db954' : 'inherit' }}>{item.title}</h5>
                            <p className="spty-gallery__type">{item.subtitle} • 2026</p>
                        </Reveal>
                    );
                })}
            </div>

            {/* Lightbox / Theater Mode Modal */}
            {activeIdx !== null && (
                <div 
                    className="spty-gallery-lightbox animate-in fade-in duration-200"
                    onClick={handleCloseModal}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(12, 12, 12, 0.97)',
                        zIndex: 15000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                        backdropFilter: 'blur(6px)'
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
                            background: 'rgba(255, 255, 255, 0.1)',
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
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
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
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
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
                                    border: '2px solid #1db954',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                                }}
                            />
                        ) : (
                            <img 
                                src={galleryItems[activeIdx].src} 
                                alt={galleryItems[activeIdx].title} 
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '72vh',
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
                            marginTop: '18px',
                            color: '#888',
                            fontSize: '14px',
                            textAlign: 'center',
                            maxWidth: '90%',
                            fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ color: '#1db954', fontWeight: 'bold', fontSize: '17px', marginBottom: '4px', letterSpacing: '0.5px' }}>
                            {galleryItems[activeIdx].title}
                        </div>
                        <div>{galleryItems[activeIdx].type === 'video' ? 'Spotivite Premium Video Player' : 'Spotivite High-Fidelity Discography'}</div>
                    </div>
                </div>
            )}
        </section>
    );
}
/* ═══════════════════════════════════════
   HADIAH SECTION (Merchandise / Tip Jar UI)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, language }) {
    const { t, locale } = useTranslation(language);
    const accounts = safeArr(bankAccounts);
    const [copiedIdx, setCopiedIdx] = useState(null);

    if (accounts.length === 0) return null;

    const copyText = (text, idx) => {
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

    const fallbackCopy = (text, idx) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();

        // Extra range selection compatibility for iOS Safari / Instagram webview
        const range = document.createRange();
        range.selectNodeContents(ta);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        ta.setSelectionRange(0, 999999);

        try {
            const success = document.execCommand('copy');
            if (success) {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }
        } catch (e) {
            console.error('Fallback copy failed', e);
        }
        selection.removeAllRanges();
        document.body.removeChild(ta);
    };

    return (
        <section id="bank" className="spty-section">
            <h3 className="spty-section-title"><span>#</span>Merchandise</h3>
            <h4 className="spty-section-header">{locale === 'en' ? 'Gift & Support' : 'Kado & Dukungan'}</h4>
            <p className="spty-gift__desc">
                {t('invitation.gift_desc') || (locale === 'en' ? 'Your blessing is our greatest gift. However, if you wish to share a digital gift, you can send it through:' : 'Doa restu Anda adalah kado terindah bagi kami. Namun apabila Anda ingin memberikan tanda kasih secara digital, dapat disalurkan melalui:')}
            </p>

            <div className="spty-gift__grid">
                {accounts.map((acc, idx) => {
                    const isCopied = copiedIdx === idx;
                    return (
                        <Reveal key={acc.id || idx} className="spty-gift-card" variant="up" delay={idx * 100}>
                            <div className="spty-gift-card__watermark">
                                <i className="fas fa-wallet" />
                            </div>
                            <h5 className="spty-gift-card__bank">{acc.bank_name}</h5>
                            <span className="spty-gift-card__number">{acc.account_number}</span>
                            <span className="spty-gift-card__holder">a.n. {acc.account_holder || acc.account_name}</span>
                            <button
                                type="button"
                                className="spty-gift-card__copy-btn"
                                onClick={() => copyText(acc.account_number, idx)}
                            >
                                <i className={isCopied ? "fas fa-check" : "far fa-copy"} />
                                {isCopied ? (t('invitation.gift_copied') || 'Tersalin!') : (t('invitation.gift_copy') || (locale === 'en' ? 'Copy Account' : 'Salin Rekening'))}
                            </button>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES SECTION (Collaborative Playlist UI)
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, language }) {
    const wishesInputRef = React.useRef(null);
    const { t, locale } = useTranslation(language);
    const activeGuest = guest || { name: '', id: null };
    const isEn = locale === 'en';

    const [sharedName, setSharedName] = useState(activeGuest.name || '');
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
                    onSuccess: () => { setMessage(''); setSuccess(true); },
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
    const recentWishes = safeArr(wishes).slice(0, 5);
    const opts = ['hadir', 'tidak_hadir', 'masih_ragu'];
    const optLabels = {
        hadir: isEn ? 'Attending' : 'Hadir',
        tidak_hadir: isEn ? 'Absent' : 'Tidak Hadir',
        masih_ragu: isEn ? 'Maybe' : 'Belum Pasti',
    };

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="spty-section">
            <h3 className="spty-section-title">
                {enableRsvp && <span>#</span>}
                {enableRsvp ? (isEn ? 'CollaborativePlaylist' : 'DaftarKolaboratif') : (isEn ? 'ReviewBoard' : 'PapanUlasan')}
            </h3>
            <h4 className="spty-section-header">
                {enableRsvp && enableWishes && (isEn ? 'RSVP & Wishes' : 'Kehadiran & Ucapan')}
                {enableRsvp && !enableWishes && (isEn ? 'RSVP Confirmation' : 'Konfirmasi Kehadiran')}
                {!enableRsvp && enableWishes && (isEn ? 'Send Wishes' : 'Kirim Ucapan')}
            </h4>

            <Reveal className="spty-form" variant="zoom">
                {success && (
                    <div className="spty-success-box">
                        <i className="fas fa-check-circle" /> {isEn ? 'Thank you for adding a track to our playlist!' : 'Terima kasih telah menambahkan ucapan di daftar putar kami!'}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="spty-form__actual" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Name */}
                    <input
                        className="spty-input"
                        type="text"
                        placeholder={isEn ? 'Your Name' : 'Nama Anda'}
                        required
                        readOnly={!!activeGuest.name}
                        value={sharedName}
                        onChange={e => setSharedName(e.target.value)}
                    />

                    {/* Attendance - RSVP only */}
                    {enableRsvp && (
                        <>
                            <div className="spty-radio-group">
                                {opts.map(opt => (
                                    <label key={opt} className="spty-radio-btn">
                                        <input
                                            type="radio"
                                            name="attendance"
                                            value={opt}
                                            checked={attendance === opt}
                                            onChange={() => setAttendance(opt)}
                                        />
                                        <span className="spty-radio-btn__label">{optLabels[opt]}</span>
                                    </label>
                                ))}
                            </div>
                            
                            {attendance === 'hadir' && (
                                <>
                                    <span className="spty-guest-count-label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</span>
                                    <input
                                        className="spty-input"
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        value={numGuests}
                                        onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                    />
                                </>
                            )}
                        </>
                    )}

                    {/* Wishes text area */}
                    {enableWishes && (
                        <WishesEmojiPicker
                                    value={message}
                                    onChange={setMessage}
                                    inputRef={wishesInputRef}
                                    isDark={true}
                                >
                                    <textarea
                                    ref={wishesInputRef}
                            className="spty-input"
                            rows="3"
                            placeholder={isEn ? 'Write your wishes/messages...' : 'Tulis ucapan dan doa Anda...'}
                            required
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                                </WishesEmojiPicker>
                    )}

                    <button
                        type="submit"
                        className="spty-btn spty-glow-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner fa-spin" /> {isEn ? 'Adding...' : 'Mengirim...'}
                            </>
                        ) : (
                            <>
                                <i className="fas fa-plus" /> {isEn ? 'Add to Playlist' : 'Kirim Kehadiran'}
                            </>
                        )}
                    </button>
                </form>
            </Reveal>

            {/* Wishes Tracks Board */}
            {enableWishes && recentWishes.length > 0 && (
                <div className="spty-playlist">
                    <div className="spty-playlist__header">
                        <span className="spty-playlist__col-num">#</span>
                        <span className="spty-playlist__col-title">{isEn ? 'Sender & Wishes' : 'Pengirim & Ucapan'}</span>
                        <span className="spty-playlist__col-status">{isEn ? 'Status' : 'Status'}</span>
                    </div>

                    <div className="spty-playlist__scrollable">
                        {recentWishes.map((w, idx) => {
                            let trackStatusClass = 'spty-track__status--none';
                            let statusLabel = isEn ? 'Wish' : 'Ucapan';
                            
                            // Try to map guest status from RSVP
                            const att = w.guest?.rsvp?.attendance || w.rsvp_status; 
                            if (att === 'hadir' || att === 'attending') {
                                trackStatusClass = 'spty-track__status--hadir';
                                statusLabel = isEn ? 'Attending' : 'Hadir';
                            } else if (att === 'tidak_hadir' || att === 'absent') {
                                trackStatusClass = 'spty-track__status--tidak';
                                statusLabel = isEn ? 'Absent' : 'Absen';
                            } else if (att === 'masih_ragu' || att === 'maybe') {
                                trackStatusClass = 'spty-track__status--ragu';
                                statusLabel = isEn ? 'Maybe' : 'Ragu';
                            }

                            return (
                                <div key={w.id || idx} className="spty-track">
                                    <div className="spty-track__num">
                                        <span className="spty-track__num-val">{idx + 1}</span>
                                        <button className="spty-track__play-btn" type="button"><i className="fas fa-play" /></button>
                                    </div>
                                    <div className="spty-track__details">
                                        <h5 className="spty-track__sender">{w.sender_name}</h5>
                                        <p className="spty-track__message">{w.message}</p>
                                    </div>
                                    <div className={`spty-track__status ${trackStatusClass}`}>
                                        {statusLabel}
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
   CLOSING SECTION & FOOTER (Credits & Watermark)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, language }) {
    const { t, locale } = useTranslation(language);
    const isEn = locale === 'en';

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || {};

    const hasGroomParents = !!(groom.father_name || groom.mother_name);
    const hasBrideParents = !!(bride.father_name || bride.mother_name);

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <section id="closing" className="spty-section spty-closing">
            <h3 className="spty-closing__title">{invitation?.closing_title || 'THANK YOU'}</h3>
            <p className="spty-closing__text">{invitation?.closing_text || 'Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.'}</p>

            {(hasGroomParents || hasBrideParents) && (
                <>
                    <h4 className="spty-closing__signature-header">{isEn ? 'Our Families' : 'Kami Yang Berbahagia'}</h4>
                    <div className="spty-closing__signatures">
                        {hasGroomParents && (
                            <div>
                                {isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Keluarga Bapak ${groom.father_name} & Ibu ${groom.mother_name}`}
                            </div>
                        )}
                        {hasBrideParents && (
                            <div>
                                {isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Keluarga Bapak ${bride.father_name} & Ibu ${bride.mother_name}`}
                            </div>
                        )}
                    </div>
                </>
            )}

            <div className="spty-closing__watermark">
                Made with ❤️ by <span>{brandName}</span>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   SPOTIVITE NOW PLAYING BOTTOM CONTROL BAR
   ═══════════════════════════════════════ */
function BottomPlayer({ invitation, brideGrooms, isPlaying, onTogglePlay, isSlideMode, onPrevSlide, onNextSlide, progress, language, fallbackPhoto, onSeek }) {
    const { t, locale } = useTranslation(language);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, initials, labels } = themeConfig;

    const coupleName = mainName;
    const artUrl = getStorageUrl(invitation?.cover_image, null) || fallbackPhoto;
    const [bottomArtSrc, setBottomArtSrc] = useState(artUrl);

    const seekContainerRef = useRef(null);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        setBottomArtSrc(artUrl);
    }, [artUrl]);

    const handleBottomArtError = () => {
        if (bottomArtSrc !== fallbackPhoto && fallbackPhoto) {
            setBottomArtSrc(fallbackPhoto);
        } else {
            setBottomArtSrc(null);
        }
    };

    const handleSeekEvent = useCallback((clientX) => {
        const container = seekContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        if (width <= 0) return;
        
        let offsetX = clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, width));
        const percentage = offsetX / width;
        
        if (onSeek) {
            onSeek(percentage);
        }
    }, [onSeek]);

    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // only left click
        isDraggingRef.current = true;
        handleSeekEvent(e.clientX);
        
        const handleMouseMove = (moveEvent) => {
            if (!isDraggingRef.current) return;
            handleSeekEvent(moveEvent.clientX);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e) => {
        isDraggingRef.current = true;
        handleSeekEvent(e.touches[0].clientX);

        const handleTouchMove = (moveEvent) => {
            if (!isDraggingRef.current) return;
            handleSeekEvent(moveEvent.touches[0].clientX);
        };

        const handleTouchEnd = () => {
            isDraggingRef.current = false;
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);
    };

    return (
        <div className="spty-player">
            {/* Seeker / Scroll progress visual */}
            <div 
                ref={seekContainerRef}
                className="spty-player__seek-container"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="spty-player__seek-track">
                    <div className="spty-player__seek-progress" style={{ width: `${progress * 100}%` }}>
                        <div className="spty-player__seek-handle" />
                    </div>
                </div>
            </div>

            <div className="spty-player__left">
                <div className="spty-player__art-wrap">
                    {globalShowPhotos && bottomArtSrc ? (
                        <img src={bottomArtSrc} alt="" className="spty-player__art" onError={handleBottomArtError} />
                    ) : (
                        <div className="spty-player__monogram-art">{initials}</div>
                    )}
                </div>
                <div className="spty-player__info">
                    <h5 className="spty-player__title">{coupleName}</h5>
                    <p className="spty-player__artist">{invitation?.cover_subtitle || labels.albumSubtitle}</p>
                </div>
            </div>

            <div className="spty-player__right">
                <button className="spty-player__btn" type="button" title="Like / Save">
                    <i className="far fa-heart" />
                </button>
                {isSlideMode && (
                    <button className="spty-player__btn spty-player__btn--prev" type="button" onClick={onPrevSlide} title="Previous Section">
                        <i className="fas fa-step-backward" />
                    </button>
                )}
                <button
                    className={`spty-player__btn spty-player__btn--play${isPlaying ? ' is-playing' : ''}`}
                    type="button"
                    onClick={onTogglePlay}
                    title={isPlaying ? 'Mute Music' : 'Play Music'}
                >
                    {isPlaying ? (
                        <div className="global-music-waves">
                            <span />
                            <span />
                            <span />
                        </div>
                    ) : (
                        <i className="fas fa-play" />
                    )}
                </button>
                {isSlideMode && (
                    <button className="spty-player__btn spty-player__btn--next" type="button" onClick={onNextSlide} title="Next Section">
                        <i className="fas fa-step-forward" />
                    </button>
                )}
                <button className="spty-player__btn" type="button" title="Devices Available">
                    <i className="fas fa-laptop-house" />
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME COMPONENT
   ═══════════════════════════════════════ */
function SpotiviteThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const activeLanguage = invitation?.language || 'id';
    
    const randomGalleryPhoto = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length === 0) return null;
        const seed = invitation?.id || 1;
        const index = seed % list.length;
        const item = list[index];
        return getStorageUrl(item?.image_url || item?.image_path || item?.image, null);
    }, [galleries, invitation?.id]);

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const slideContainerRef = useRef(null);

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide' || layoutMode === 'tab';

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    const showAnimations = parseBool(invitation?.show_animations ?? true);

    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // Fullscreen event listener
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

    // Auto update page Title based on bride & groom nicknames or host name
    useEffect(() => {
        const bgs = safeArr(brideGrooms);
        const themeConfig = getThemeLabels(invitation?.type || 'wedding', activeLanguage, bgs, invitation);
        if (themeConfig.isSingleHost) {
            document.title = `${themeConfig.mainName} - ${themeConfig.labels.introBadge}`;
        } else {
            const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()));
            const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase()));
            if (groom?.nickname && bride?.nickname) {
                document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
            } else {
                document.title = invitation?.title || 'Undangan Pernikahan';
            }
        }
    }, [invitation, brideGrooms, activeLanguage]);

    // Handle initial lock body scroll
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    }, [isOpened, isSlideMode]);

    // Audio element creation & autoplay trigger
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
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log('Play blocked:', e));
        }
    }, [isPlaying]);

    // Resolve visible sections
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        const resolved = [];

        // In scroll mode, hero section is not needed as cover handles intro, but let's see.
        // Let's resolve standard sections.
        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);

            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery') {
                    const hasVideos = invitation?.video_list?.length > 0 && (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);
                    if (!(galleries?.length > 0 || hasVideos)) return;
                }
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                
                // Standalone wishes is hidden if RSVP is active (merged)
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
            const hasVideos = invitation?.video_list?.length > 0 && (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);
            if (galleries?.length > 0 || hasVideos) fallbacks.push({ section_key: 'gallery' });
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

    // Slide navigation index mapping
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            setActiveSectionId(key);
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

    // Slide Mode progress indicator
    const calculatedProgress = useMemo(() => {
        if (isSlideMode) {
            if (resolvedSections.length <= 1) return 0;
            return activeSlideIdx / (resolvedSections.length - 1);
        }
        return scrollProgress;
    }, [isSlideMode, activeSlideIdx, resolvedSections.length, scrollProgress]);

    // Scroll mode: track scroll spy to update activeSectionId and scrollProgress
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

            // Calculate overall scroll progress
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once initially
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, enableRsvp]);

    // Slide Mode Container Scroll Progress Tracker
    const handleSlideContainerScroll = (e) => {
        if (!isSlideMode) return;
        const el = e.currentTarget;
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        // Not mapping scroll progress to progress bar inside slides directly to keep progress bar linked to slides,
        // but we can if we want internal scroll feedback. Let's keep progress bar representing current slide index.
    };

    // Swipe handlers for Slide Mode
    const touchStartRef = useRef(null);
    const handleTouchStart = (e) => {
        if (!isSlideMode) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isSlideMode || !touchStartRef.current) return;
        
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
        
        // Detect swiping direction
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (layoutMode === 'slide-h' || layoutMode === 'slide') {
                if (deltaX < 0) {
                    // Swipe left -> Next
                    nextSlide();
                } else {
                    // Swipe right -> Prev
                    prevSlide();
                }
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (layoutMode === 'slide-v') {
                if (deltaY < 0) {
                    // Swipe up -> Next
                    nextSlide();
                } else {
                    // Swipe down -> Prev
                    prevSlide();
                }
            }
        }
        touchStartRef.current = null;
    };

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled || isSlideMode) return;

        const handleUserInteraction = (e) => {
            // Ignore if interaction is on floating buttons, RSVP form, player bar, or inputs
            if (
                e.target.closest('button') || 
                e.target.closest('.spty-player') || 
                e.target.closest('.spty-float') || 
                e.target.closest('.spty-qr-overlay') ||
                e.target.closest('.spty-qr-modal') ||
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
    }, [isOpened, autoScrollEnabled, isSlideMode]);

    // Auto scroll timer
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

    const nextSlide = () => {
        setAutoScrollEnabled(false);
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setAutoScrollEnabled(false);
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const jumpToSlide = (idx) => {
        if (idx >= 0 && idx < resolvedSections.length) {
            setActiveSlideIdx(idx);
        }
    };

    const handleSeek = useCallback((percentage) => {
        setAutoScrollEnabled(false);
        if (isSlideMode) {
            const targetIdx = Math.round(percentage * (resolvedSections.length - 1));
            jumpToSlide(targetIdx);
        } else {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const targetScrollY = percentage * scrollHeight;
            window.scrollTo({
                top: targetScrollY,
                behavior: 'auto'
            });
        }
    }, [isSlideMode, resolvedSections.length]);

    // Map section key to actual React Component
    const renderSection = (key) => {
        const props = { invitation, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest, enableRsvp, enableWishes, language: activeLanguage, fallbackPhoto: randomGalleryPhoto, sections };
        
        switch (key) {
            case 'opening':
                return <OpeningSection key={key} {...props} onOpenMusic={toggleMusic} />;
            case 'bride_groom':
                return <BrideGroomSection key={key} {...props} />;
            case 'event':
                return <EventSection key={key} {...props} />;
            case 'livestream':
                return <LiveStreamingSection key={key} {...props} />;
            case 'love_story':
                return <LoveStorySection key={key} {...props} />;
            case 'gallery':
                return <GallerySection key={key} {...props} />;
            case 'bank':
                return <BankSection key={key} {...props} />;
            case 'rsvp':
            case 'wishes':
                return <UnifiedFormSection key={key} {...props} />;
            case 'closing':
                return <ClosingSection key={key} {...props} />;
            default:
                return null;
        }
    };

    const isAkadTheme = invitation?.theme?.slug === 'adat-jawa';
    
    // Google font link for Plus Jakarta Sans & Outfit
    const fontLinkUrl = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Great+Vibes&display=swap';

    return (
        <ErrorBoundary>
            <link href={fontLinkUrl} rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />
            
            {/* Background Audio */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={invitation.music_url} loop />
            )}

            <div className={`spty-wrapper ${!showAnimations ? 'theme-no-animations' : ''}`}>
                {/* ══════ COVER PANEL ══════ */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    language={activeLanguage}
                    fallbackPhoto={randomGalleryPhoto}
                />

                {/* ══════ MAIN CONTENT ══════ */}
                {isOpened && (
                    <main className={`spty-main ${isSlideMode ? 'spty-main--slide' : ''}`}>
                        
                        {/* Auto Scroll Floating Controls & Fullscreen */}
                        <div style={{ position: 'fixed', right: 16, bottom: 96, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 89 }}>
                            {/* QR Code Check-in Button */}
                            {enableQr && activeGuest && (
                                <button
                                    onClick={() => setShowQr(true)}
                                    style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid var(--spty-border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                                    title={activeLanguage === 'en' ? 'QR Code Check-in' : 'Presensi QR Code'}
                                    className="spty-float"
                                >
                                    <i className="fas fa-qrcode" style={{ margin: 'auto' }} />
                                </button>
                            )}
                            {/* Fullscreen Button */}
                            <button
                                onClick={toggleFullscreen}
                                style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid var(--spty-border)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                                className="spty-float"
                            >
                                <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} style={{ margin: 'auto' }} />
                            </button>
                            {/* Auto-Scroll Toggle Button */}
                            <button
                                onClick={() => setAutoScrollEnabled(!autoScrollEnabled)}
                                style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: autoScrollEnabled ? 'var(--spty-green)' : 'rgba(0,0,0,0.6)', border: '1px solid var(--spty-border)', color: autoScrollEnabled ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', transition: 'background-color 0.2s' }}
                                title={autoScrollEnabled ? 'Pause Auto Scroll' : 'Play Auto Scroll'}
                                className="spty-float"
                            >
                                <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-arrow-down"} style={{ margin: 'auto' }} />
                            </button>
                        </div>

                        {/* Rendering Sections */}
                        {isSlideMode ? (
                            /* parallel DOM rendering for smooth transitions in slide layouts */
                            <div
                                ref={slideContainerRef}
                                className="spty-slide-container"
                                onScroll={handleSlideContainerScroll}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                             >
                                {resolvedSections.map((s, idx) => {
                                    const isActive = idx === activeSlideIdx;
                                    return (
                                        <div
                                            key={s.id || s.section_key}
                                            className={`spty-slide spty-slide--${s.section_key}${isActive ? ' is-active' : ''}`}
                                        >
                                            {renderSection(s.section_key)}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* scroll layout mode (standard scrolling) */
                            <div>
                                {resolvedSections.map(s => renderSection(s.section_key))}
                            </div>
                        )}

                        {/* Persistent Player Control Bar */}
                        <BottomPlayer
                            invitation={invitation}
                            brideGrooms={brideGrooms}
                            isPlaying={isPlaying}
                            onTogglePlay={toggleMusic}
                            isSlideMode={isSlideMode}
                            onPrevSlide={prevSlide}
                            onNextSlide={nextSlide}
                            progress={calculatedProgress}
                            language={activeLanguage}
                            fallbackPhoto={randomGalleryPhoto}
                            onSeek={handleSeek}
                        />

                        {/* QR Code Check-in Modal */}
                        {enableQr && showQr && activeGuest && (
                            <div className="spty-qr-overlay" onClick={() => setShowQr(false)}>
                                <div className="spty-qr-modal" onClick={e => e.stopPropagation()}>
                                    <h3 className="spty-qr-title">{activeLanguage === 'en' ? 'QR Code Check-in' : 'Presensi QR Code'}</h3>
                                    <p className="spty-qr-guest">{activeGuest.name}</p>
                                    <div className="spty-qr-code-box">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1db954&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                            alt="QR Code"
                                            className="spty-qr-img"
                                        />
                                    </div>
                                    <p className="spty-qr-desc">
                                        {activeLanguage === 'en'
                                            ? 'Show this QR code to the event crew to check in'
                                            : 'Tunjukkan kode QR ini ke petugas penerima tamu'}
                                    </p>
                                    <button onClick={() => setShowQr(false)} className="spty-qr-close">
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

export default function SpotiviteTheme(props) {
    return (
        <SpotiviteThemeContent {...props} />
    );
}
