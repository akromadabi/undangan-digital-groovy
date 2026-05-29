import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';


// Import assets via Vite to bundle them correctly
import netlogoWedding from './asset/NETLOGO-THEWEDDING.svg';
import eyesSvg from './asset/01-eyes.svg';
import mouthSvg from './asset/02-mouth.svg';
import dummyCover from './asset/dummy-cover.png';
import dummyPortrait from './asset/dummy-portrait.png';

const ASSETS = {
    logo: netlogoWedding,
    eyes: eyesSvg,
    mouth: mouthSvg,
    cover: dummyCover,
    portrait: dummyPortrait,
};

/* ─── Helper ─── */
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

function pad2(n) { return String(n).padStart(2, '0'); }
function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}
import PremiumSlideshow from '@/Components/PremiumSlideshow';

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


/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#fff', background: '#141414', minHeight: '100vh' }}>
                <h2 style={{ color: '#E50914' }}>Terjadi kesalahan.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#aaa' }}>
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
   SCROLL ANIMATION WRAPPER
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
    const { t } = useTranslation();
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
        <div ref={ref} className={`${className} ${!globalShowAnimations ? '' : (visible ? 'nf-reveal--in' : 'nf-reveal--out')}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}>
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION  (Who's Watching?)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t, locale } = useTranslation();
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, isSingleHost, labels } = themeConfig;

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);
    const coupleName = mainName;
    const heroImg = getStorageUrl(invitation?.cover_image, null);

    return (
        <div className={`nf-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'nf-no-photo-mode' : ''}`}>
            {globalShowPhotos && (
                <PremiumSlideshow
                    images={invitation?.cover_image ? invitation.cover_image.split(',') : []}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="nf-cover__bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                />
            )}
            <div className="nf-cover__overlay" />
            <div className="nf-cover__content">
                <img src={ASSETS.logo} alt="THE WEDDING" className="nf-cover__logo" />
                <h1 className="nf-cover__title">{coupleName}</h1>

                {/* Who's Watching Profiles */}
                <div className="nf-profiles">
                    {isSingleHost ? (
                        <div className="nf-profile nf-profile--blue" onClick={onOpen} title={mainName}>
                            <div className="nf-profile__face">
                               <img src={ASSETS.eyes} alt="" className="nf-profile__eyes" />
                               <img src={ASSETS.mouth} alt="" className="nf-profile__mouth nf-mouth--left" />
                            </div>
                            <p className="nf-profile__name">{mainName}</p>
                        </div>
                    ) : (
                        <>
                            <div className="nf-profile nf-profile--blue" onClick={onOpen} title={groom?.nickname || 'Pengantin Pria'}>
                                <div className="nf-profile__face">
                                    <img src={ASSETS.eyes} alt="" className="nf-profile__eyes" />
                                    <img src={ASSETS.mouth} alt="" className="nf-profile__mouth nf-mouth--left" />
                                </div>
                                <p className="nf-profile__name">{groom?.nickname || 'Pria'}</p>
                            </div>
                            <div className="nf-profile nf-profile--pink" onClick={onOpen} title={bride?.nickname || 'Pengantin Wanita'}>
                                <div className="nf-profile__face">
                                    <img src={ASSETS.eyes} alt="" className="nf-profile__eyes" />
                                    <img src={ASSETS.mouth} alt="" className="nf-profile__mouth nf-mouth--right" />
                                </div>
                                <p className="nf-profile__name">{bride?.nickname || 'Wanita'}</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Guest Info */}
                <div className="nf-cover__guest">
                    <p className="nf-cover__guest-label">{t('invitation.dear_guest')}</p>
                    <p className="nf-cover__guest-name">{guestName || 'Tamu Undangan'}</p>
                    <p className="nf-cover__guest-note">{t('invitation.dear_guest_desc')}</p>
                </div>

                <button onClick={onOpen} id="tombol-buka" className="nf-cover__open-btn">
                    <i className="far fa-envelope-open" />
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, scrollToSection, loveStories, galleries, enableRsvp, enableWishes, bankAccounts, id }) {
    const { t, locale } = useTranslation();
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, initials, labels } = themeConfig;

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];
    const coupleName = mainName;
    const heroImg = getStorageUrl(invitation?.opening_image || invitation?.cover_image, null);

    return (
        <section id={id || "opening"} className="nf-opening">
            {globalShowPhotos && (
                <PremiumSlideshow
                    images={invitation?.opening_image ? invitation.opening_image.split(',') : (invitation?.cover_image ? invitation.cover_image.split(',') : [])}
                    positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                    positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                    zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                    className="nf-opening__bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover"
                />
            )}
            <div className="nf-opening__overlay" />
            <div className="nf-opening__content">
                <img src={ASSETS.logo} alt="THE WEDDING" className="nf-opening__logo" />
                <h1 className="nf-opening__couple">{coupleName}</h1>
                {invitation?.opening_ayat && (
                    <p className="nf-opening__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                )}
                {invitation?.opening_ayat_source && (
                    <p className="nf-opening__ayat-src">&mdash; {invitation.opening_ayat_source}</p>
                )}
                <p className="nf-opening__text">
                    {invitation?.opening_text || labels.introText}
                </p>

                {/* Nav buttons */}
                <div className="nf-nav">
                    {scrollToSection ? (
                        <>
                            <button type="button" onClick={() => scrollToSection('bride_groom')} className="nf-nav__btn">{t('nav.mempelai')}</button>
                            <button type="button" onClick={() => scrollToSection('event')} className="nf-nav__btn">{t('nav.acara')}</button>
                            {loveStories?.length > 0 && <button type="button" onClick={() => scrollToSection('love_story')} className="nf-nav__btn">{t('invitation.love_story')}</button>}
                            {galleries?.length > 0 && <button type="button" onClick={() => scrollToSection('gallery')} className="nf-nav__btn">{t('invitation.gallery')}</button>}
                            {enableRsvp && <button type="button" onClick={() => scrollToSection('rsvp')} className="nf-nav__btn">{t('nav.rsvp')}</button>}
                            {enableWishes && <button type="button" onClick={() => scrollToSection('wishes')} className="nf-nav__btn">{t('invitation.wishes_title')}</button>}
                            {bankAccounts?.length > 0 && <button type="button" onClick={() => scrollToSection('bank')} className="nf-nav__btn">{t('nav.hadiah')}</button>}
                        </>
                    ) : (
                        <>
                            <a href="#bride_groom" className="nf-nav__btn">{t('nav.mempelai')}</a>
                            <a href="#event" className="nf-nav__btn">{t('nav.acara')}</a>
                            <a href="#love_story" className="nf-nav__btn">{t('invitation.love_story')}</a>
                            <a href="#gallery" className="nf-nav__btn">{t('invitation.gallery')}</a>
                            <a href="#rsvp" className="nf-nav__btn">{t('nav.rsvp')}</a>
                            <a href="#wishes" className="nf-nav__btn">{t('invitation.wishes_title')}</a>
                            <a href="#bank" className="nf-nav__btn">{t('nav.hadiah')}</a>
                        </>
                    )}
                </div>

                {/* Video jika ada */}
                {invitation?.video_url && (
                    <div className="nf-opening__video">
                        <iframe
                            src={invitation.video_url.includes('watch?v=')
                                ? invitation.video_url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'
                                : invitation.video_url}
                            title="Wedding Video" frameBorder="0"
                            allowFullScreen allow="autoplay; encrypted-media"
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN  (inside bride_groom or standalone)
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const target = new Date(`${ds}T08:00:00`);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0 }); return; }
            setCd({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000)
            });
        };
        tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
    }, [targetDate]);

    return (
        <div className="nf-countdown">
            {[['d', t('invitation.days')], ['h', t('invitation.hours')], ['m', t('invitation.minutes')]].map(([k, lbl], idx) => (
                <React.Fragment key={k}>
                    {idx > 0 && <span className="nf-countdown__colon">:</span>}
                    <div className="nf-countdown__item">
                        <div className="nf-countdown__value">
                            <span className="nf-countdown__digit">{pad2(cd[k])[0]}</span>
                            <span className="nf-countdown__digit">{pad2(cd[k])[1]}</span>
                        </div>
                        <div className="nf-countdown__label">{lbl}</div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION
   ═══════════════════════════════════════ */
function BrideGroomSection({ invitation, brideGrooms, events, id }) {
    const { t, locale } = useTranslation();
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, brideGrooms, invitation);
    const { mainName, isSingleHost, labels } = themeConfig;
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || bgs[1] || bgs[0] || {};
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];

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

    function Card({ person, side }) {
        if (!person) return null;
        const photo = getStorageUrl(person.photo, dummyPortrait);
        return (
            <Reveal className={`nf-couple__card nf-couple__card--${side}`} delay={side === 'left' ? 0 : 200}>
                {globalShowPhotos && person.photo && (
                    <div className="nf-couple__photo-wrap">
                        <img src={photo} alt={person.full_name} className="nf-couple__photo" />
                    </div>
                )}
                <p className="nf-couple__full-name">{person.full_name}</p>
                <p className="nf-couple__child-info">
                    {translateChildOrder(person.child_order, person.gender === 'wanita' ? 'wanita' : 'pria') || 
                     (person.gender === 'wanita' ? t('invitation.daughter_of') : t('invitation.son_of'))}
                </p>
                <p className="nf-couple__parents">
                    {[person.father_name, person.mother_name].filter(Boolean).join(' & ')
                        || person.parents_name || ''}
                </p>
                {person.instagram && (
                    <a href={`https://www.instagram.com/${person.instagram.replace('@','')}`}
                        target="_blank" rel="noreferrer" className="nf-couple__ig">
                        <i className="fab fa-instagram" /> {person.instagram}
                    </a>
                )}
            </Reveal>
        );
    }

    const firstWordHeader = labels.profileHeader.split(' ')[0];
    const restWordHeader = labels.profileHeader.split(' ').slice(1).join(' ');

    return (
        <section id={id || "bride_groom"} className="nf-couple">
            <Reveal delay={100}>
                <h3 className="nf-section-title">
                    <><span className="nf-badge">{firstWordHeader}</span> {restWordHeader}</>
                </h3>
            </Reveal>

            <div className="nf-couple__row" style={isSingleHost ? { justifyContent: 'center' } : undefined}>
                <Card person={groom} side={isSingleHost ? 'center' : 'left'} />
                {!isSingleHost && <div className="nf-couple__amp">&amp;</div>}
                {!isSingleHost && <Card person={bride} side="right" />}
            </div>

            {/* Save The Date */}
            {primaryEvent?.event_date && (
                <Reveal delay={300}>
                    <div className="nf-save-the-date">
                        <div className="nf-save-the-date__badge-wrap">
                            <span className="nf-badge">{t('invitation.save_the_date') === 'Save The Date' ? 'SPECIAL EVENT' : 'ACARA SPESIAL'}</span>
                        </div>
                        <h3 className="nf-save-the-date__title">{t('invitation.save_the_date')}</h3>
                        {(() => {
                            const d = new Date(primaryEvent.event_date);
                            return (
                                <div className="nf-save-the-date__date">
                                    <span className="nf-std-day-label">{d.toLocaleDateString(t('invitation.save_the_date') === 'Save The Date' ? 'en-US' : 'id-ID', { weekday: 'long' })}</span>
                                    <span className="nf-std-main">
                                        {d.getDate()} {d.toLocaleDateString(t('invitation.save_the_date') === 'Save The Date' ? 'en-US' : 'id-ID', { month: 'long' }).toUpperCase()} {d.getFullYear()}
                                    </span>
                                </div>
                            );
                        })()}
                        <CountdownTimer targetDate={primaryEvent.event_date} />
                    </div>
                </Reveal>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, galleries }) {
    const { t, locale } = useTranslation();
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, [], invitation);
    const { labels } = themeConfig;
    const safeEvents = safeArr(events);
    if (safeEvents.length === 0) return null;

    const weddingImg = getStorageUrl(invitation?.cover_image, dummyCover);
    const safeGalleries = safeArr(galleries);

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const bgs = safeArr(invitation?.brideGrooms || []);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    const firstWordHeader = labels.eventHeader.split(' ')[0];
    const restWordHeader = labels.eventHeader.split(' ').slice(1).join(' ');

    return (
        <section id="event" className="nf-events">
            <Reveal>
                <h3 className="nf-section-title">
                    <><span className="nf-badge">{firstWordHeader}</span> {restWordHeader}</>
                </h3>
                <p className="nf-section-subtitle">{t('invitation.save_the_date') === 'Save The Date' ? 'To be held on:' : 'Yang akan dilaksanakan pada:'}</p>
            </Reveal>

            {safeEvents.map((ev, idx) => {
                const evDate = ev.event_date || ev.date;
                const d = evDate ? new Date(evDate) : null;
                
                const isAkad = ev.event_name?.toLowerCase().includes('akad');
                let eventImg = null;

                if (isAkad) {
                    if (safeGalleries.length > 0) {
                        const randomIdx = (ev.id ? ev.id : idx) % safeGalleries.length;
                        const randomGallery = safeGalleries[randomIdx];
                        eventImg = getStorageUrl(randomGallery.image_url);
                    } else {
                        eventImg = null;
                    }
                } else {
                    eventImg = getStorageUrl(ev.image, weddingImg);
                }

                return (
                    <Reveal key={idx} delay={idx * 100} className="nf-event-item">
                        <div className={`nf-event-item__inner${(idx % 2 !== 0 && globalShowPhotos && eventImg) ? ' nf-event-item__inner--rev' : ''}`}>
                            {globalShowPhotos && eventImg && (
                                <div className="nf-event-item__photo">
                                    <img src={eventImg} alt={ev.event_name} />
                                </div>
                            )}
                            <div className="nf-event-item__detail" style={!(globalShowPhotos && eventImg) ? { padding: '32px 28px', textAlign: 'center' } : undefined}>

                                <p className="nf-event-item__type">
                                    <span className="nf-badge">{t('invitation.save_the_date') === 'Save The Date' ? 'Event:' : 'Acara:'}</span>{ev.event_name || (t('invitation.save_the_date') === 'Save The Date' ? 'Wedding' : 'Pernikahan')}
                                </p>
                                {d && (
                                    <div className="nf-event-item__date-row">
                                        <span>{d.toLocaleDateString('id-ID', { weekday: 'long' })},</span>
                                        <span>{d.getDate()}</span>
                                        <span>{d.toLocaleDateString('id-ID', { month: 'long' })}</span>
                                        <span>{d.getFullYear()}</span>
                                    </div>
                                )}
                                {(ev.start_time) && (
                                    <p className="nf-event-item__time">
                                        {formatTime(ev.start_time)}
                                        {ev.end_time && ev.end_time !== 'Selesai' ? ` – ${formatTime(ev.end_time)}` : ''} WIB
                                    </p>
                                )}
                                {ev.venue_name && <p className="nf-event-item__venue">{ev.venue_name}</p>}
                                {ev.venue_address && <p className="nf-event-item__address">{ev.venue_address}</p>}
                                 <div className="nf-event-item__actions">
                                    {(ev.gmaps_link || ev.map_url) && (
                                        <a href={ev.gmaps_link || ev.map_url} target="_blank" rel="noreferrer" className="nf-btn-map">
                                            <i className="fas fa-map-marker-alt" /> {t('invitation.save_the_date') === 'Save The Date' ? 'View Map' : 'Lihat Peta'}
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noreferrer" className="nf-btn-cal">
                                        <i className="far fa-calendar-check" /> {t('invitation.save_the_date') === 'Save The Date' ? 'Save to Calendar' : 'Simpan di Kalender'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN SECTION  (standalone)
   ═══════════════════════════════════════ */
function CountdownSection({ events }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    if (!primaryEvent?.event_date) return null;
    return (
        <section id="countdown" className="nf-countdown-section">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Counting</span> Down</> : <><span className="nf-badge">Menuju</span> Hari Bahagia</>}
                </h3>
            </Reveal>
            <Reveal delay={200}>
                <CountdownTimer targetDate={primaryEvent.event_date} />
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION
   ═══════════════════════════════════════ */
/* ── Timeline Card with Scroll Observer (active/glow state when scrolled over) ── */
function TimelineCard({ story, index }) {
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

    const isEven = index % 2 === 0;
    return (
        <div ref={ref} className={`nf-story-item nf-story-item--${isEven ? 'left' : 'right'} ${isActive ? 'is-active' : ''}`}>
            <div className="nf-story-item__inner">
                <div className="nf-story-item__text">
                    <p className="nf-story-item__part">
                        <span className="nf-badge">Part {index + 1}</span>{story.title}
                    </p>
                    {(story.story_date || story.date) && (
                        <p className="nf-story-item__date">{formatStoryDate(story.story_date || story.date)}</p>
                    )}
                    <p className="nf-story-item__desc">{story.description || story.story}</p>
                </div>
            </div>
        </div>
    );
}

/* ── LOVE STORY SECTION ── */
function LoveStorySection({ loveStories, id, invitation }) {
    const { t, locale } = useTranslation();
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', locale, [], invitation);
    const { labels } = themeConfig;
    const stories = safeArr(loveStories);
    if (stories.length === 0) return null;

    const firstWordHeader = labels.storyHeader.split(' ')[0];
    const restWordHeader = labels.storyHeader.split(' ').slice(1).join(' ');

    return (
        <section id={id || "love_story"} className="nf-lovestory">
            <Reveal>
                <h3 className="nf-section-title">
                    <><span className="nf-badge">{firstWordHeader}</span> {restWordHeader}</>
                </h3>
            </Reveal>

            {stories.map((s, idx) => (
                <TimelineCard key={idx} story={s} index={idx} />
            ))}
        </section>
    );
}

/* ═══════════════════════════════════════
   GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const safeGalleries = safeArr(galleries);
    if (safeGalleries.length === 0 || !globalShowPhotos) return null;

    return (
        <section id="gallery" className="nf-gallery">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Our</span> Gallery</> : <><span className="nf-badge">Galeri</span> Kami</>}
                </h3>
            </Reveal>
            <div className="nf-gallery__grid">
                {safeGalleries.map((g, idx) => {
                    const src = getStorageUrl(g.image_url, dummyPortrait);
                    return (
                        <Reveal key={idx} delay={(idx % 6) * 60} className="nf-gallery__item">
                            <img src={src} alt={`Foto ${idx + 1}`} loading="lazy" />
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK / AMPLOP DIGITAL
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, id }) {
    const { t } = useTranslation();
    const accounts = safeArr(bankAccounts);
    if (accounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);
    const copy = (text, idx) => {
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

        // Extra range selection compatibility for iOS Safari / Instagram webview
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

    return (
        <section id={id || "bank"} className="nf-gift">
            <Reveal>
                <h3 className="nf-section-title">
                    {t('invitation.save_the_date') === 'Save The Date' ? <><span className="nf-badge">Digital</span> Envelope</> : <><span className="nf-badge">Amplop</span> Digital</>}
                </h3>
                <p className="nf-gift__desc">
                    {t('invitation.gift_desc')}
                </p>
            </Reveal>
            <div className="nf-gift__accounts">
                {accounts.map((acc, idx) => (
                    <Reveal key={idx} delay={idx * 120} className="nf-gift__account">
                        <p className="nf-gift__bank">{acc.bank_name}</p>
                        <p className="nf-gift__number">{acc.account_number}</p>
                        <p className="nf-gift__name">a.n. {acc.account_holder || acc.account_name}</p>
                        <button className="nf-gift__copy" onClick={() => copy(acc.account_number, idx)}>
                            {copiedIdx === idx ? `✓ ${t('invitation.gift_copied')}` : t('invitation.gift_copy')}
                        </button>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP SECTION
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const isEn = t('invitation.save_the_date') === 'Save The Date';

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
        tidak_hadir: isEn ? 'Not Attending' : 'Tidak Hadir',
        masih_ragu: isEn ? 'Maybe' : 'Belum Pasti',
    };

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="nf-rsvp">
            <Reveal>
                <h3 className="nf-section-title">
                    {enableRsvp && <span className="nf-badge">RSVP</span>}
                    {enableRsvp && enableWishes && (isEn ? ' & Wishes' : ' & Ucapan')}
                    {!enableRsvp && enableWishes && <><span className="nf-badge">{isEn ? 'Wishes' : 'Ucapan'}</span> {isEn ? '& Prayers' : '& Doa'}</>}
                </h3>
            </Reveal>

            <Reveal delay={100}>
                <form onSubmit={handleSubmit} className="nf-rsvp__form">
                    {/* Nama */}
                    <input
                        className="nf-input"
                        type="text"
                        placeholder={isEn ? 'Your Name' : 'Nama Anda'}
                        required
                        readOnly={!!activeGuest.name}
                        value={sharedName}
                        onChange={e => setSharedName(e.target.value)}
                    />

                    {/* Kehadiran - hanya jika RSVP aktif */}
                    {enableRsvp && (
                        <div className="nf-rsvp__options">
                            {opts.map(o => (
                                <button key={o} type="button"
                                    className={`nf-rsvp__option${attendance === o ? ' active' : ''}`}
                                    onClick={() => setAttendance(o)}>
                                    {optLabels[o]}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Jumlah Tamu - hanya jika RSVP aktif DAN hadir */}
                    {enableRsvp && attendance === 'hadir' && (
                        <div className="nf-rsvp__guests">
                            <label className="nf-label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}:</label>
                            <input className="nf-input" type="number" min={1} max={10}
                                value={numGuests}
                                onChange={e => setNumGuests(parseInt(e.target.value) || 1)} />
                        </div>
                    )}

                    {/* Ucapan - hanya jika Wishes aktif */}
                    {enableWishes && (
                        <textarea
                            className="nf-input nf-wishes__textarea"
                            placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan untuk kedua mempelai...'}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            required={!enableRsvp}
                        />
                    )}

                    <button type="submit" disabled={isSubmitting} className="nf-submit-btn">
                        {isSubmitting ? (isEn ? 'Sending...' : 'Mengirim...') : (isEn ? 'Send' : 'Kirim')}
                    </button>

                    {success && (
                        <p className="nf-success-msg">✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}</p>
                    )}
                </form>
            </Reveal>

            {/* Daftar Ucapan - max 5, scrollable */}
            {enableWishes && recentWishes.length > 0 && (
                <div className="nf-wishes__list-wrapper">
                    <div className="nf-wishes__list" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {recentWishes.map((w, idx) => (
                            <Reveal key={idx} delay={Math.min(idx * 50, 400)} className="nf-wishes__item">
                                <div className="nf-wishes__avatar"><i className="fas fa-user" /></div>
                                <div className="nf-wishes__body">
                                    <p className="nf-wishes__name">{w.sender_name || w.name}</p>
                                    <p className="nf-wishes__message">{w.message}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVESTREAM SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation }) {
    const { t } = useTranslation();
    const safeEvents = safeArr(events);
    const streamingEvents = safeEvents.filter(e => e.streaming_url || (Array.isArray(e.streamings) && e.streamings.length > 0));
    if (streamingEvents.length === 0) return null;

    return (
        <section id="livestream" className="nf-livestream">
            <Reveal>
                <h3 className="nf-section-title">
                    <span className="nf-badge">Live</span> Streaming
                </h3>
            </Reveal>
            {streamingEvents.map((ev, idx) => {
                const streams = [];
                if (ev.streaming_url) streams.push({ platform: ev.streaming_platform || 'Live', url: ev.streaming_url });
                if (Array.isArray(ev.streamings)) {
                    ev.streamings.forEach(s => {
                        if (s.url && !streams.some(x => x.url === s.url)) streams.push({ platform: s.platform || 'Live', url: s.url });
                    });
                }

                return (
                    <Reveal key={idx} delay={idx * 100} className="nf-livestream__item">
                        <p className="nf-livestream__name">{ev.event_name}</p>
                        <div className="nf-livestream__links">
                            {streams.map((s, sIdx) => (
                                <a key={sIdx} href={s.url} target="_blank" rel="noreferrer" className="nf-btn-map">
                                    <i className="fas fa-video" /> {s.platform.toUpperCase()}
                                </a>
                            ))}
                        </div>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, id }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const bride = bgs.find(bg => bg.gender === 'wanita' || bg.gender === 'female' || String(bg.gender).toLowerCase() === 'wanita' || String(bg.gender).toLowerCase() === 'female') || bgs[0] || {};
    const groom = bgs.find(bg => bg.gender === 'pria' || bg.gender === 'male' || String(bg.gender).toLowerCase() === 'pria' || String(bg.gender).toLowerCase() === 'male') || bgs[1] || bgs[0] || {};

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'The Wedding');

    const isEn = t('invitation.save_the_date') === 'Save The Date';
    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const defaultIdText = 'Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu, Saudara/i berkenan hadir di hari bahagia kami.';
    const defaultIdTitle = 'THANK YOU';

    const currentClosingTitle = invitation?.closing_title || '';
    const currentClosingText = invitation?.closing_text || '';

    const isDefaultTitle = !currentClosingTitle || currentClosingTitle.trim() === defaultIdTitle || currentClosingTitle.trim() === 'TERIMA KASIH';
    const isDefaultText = !currentClosingText || currentClosingText.trim() === defaultIdText;

    const displayClosingTitle = isDefaultTitle
        ? t('invitation.closing_title')
        : currentClosingTitle;

    const displayClosingText = isDefaultText
        ? t('invitation.closing_text')
        : currentClosingText;

    return (
        <section id={id || "closing"} className="nf-closing">
            <div className="nf-closing__content">
                <Reveal>
                    <img src={ASSETS.logo} alt="The Wedding" className="nf-closing__logo" />
                </Reveal>
                <Reveal delay={100}>
                    <h3 className="nf-closing__title">{displayClosingTitle}</h3>
                </Reveal>
                <Reveal delay={200}>
                    <p className="nf-closing__text">{displayClosingText}</p>
                </Reveal>
                
                {/* Formal Tanda Tangan Penutup */}
                <Reveal delay={250}>
                    <div className="nf-closing__signature" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                        <div style={{ fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', opacity: 0.6, color: '#e50914' }}>
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
                </Reveal>

                <Reveal delay={300}>
                    <p className="nf-closing__couple">{coupleName}</p>
                    <p className="nf-closing__tagline">Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'TrueLove Invitation'}</p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   MUSIC BUTTON
   ═══════════════════════════════════════ */
function MusicButton({ isPlaying, onToggle }) {
    return (
        <button className="nf-music-btn" onClick={onToggle} aria-label="Toggle musik">
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
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
function WedflixThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const { t } = useTranslation(invitation?.language || 'id');
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
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

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);

    // Robust boolean parser
    const parseBool = (val, defaultVal = true) => {
        if (val === undefined || val === null) return defaultVal;
        if (val === false || val === 0 || val === '0' || val === 'false') return false;
        return true;
    };

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };
    
    // Check for streaming
    const hasStream = safeArr(events).some(e => e.streaming_url || (Array.isArray(e.streamings) && e.streamings.length > 0));
    
    let menuPosition = invitation?.menu_position || 'none';
    if (isSlideMode && (menuPosition === 'none' || !menuPosition)) {
        menuPosition = 'bottom';
    }
    const showMenu = menuPosition !== 'none';
    const musicAutoplay = parseBool(invitation?.music_autoplay);

    // Track active section on scroll or slide
    const [activeSection, setActiveSection] = useState('opening');

    const safeSections = safeArr(sections);

    // Nav labels for menu
    const navLabels = {
        opening: t('nav.opening'), bride_groom: t('nav.mempelai'), event: t('nav.acara'),
        countdown: t('invitation.save_the_date') === 'Save The Date' ? 'Start' : 'Mulai', love_story: t('nav.kisah'), gallery: t('nav.galeri'), rsvp: t('nav.rsvp'),
        wishes: t('invitation.wishes_title'), bank: t('nav.hadiah'), closing: t('nav.penutup'),
        livestream: 'Streaming',
    };

    const navIcons = {
        opening: 'fas fa-home',
        bride_groom: 'fas fa-user-friends',
        event: 'fas fa-calendar-alt',
        countdown: 'fas fa-clock',
        love_story: 'fas fa-heart',
        gallery: 'fas fa-images',
        bank: 'fas fa-gift',
        rsvp: 'fas fa-envelope',
        wishes: 'fas fa-comments',
        closing: 'fas fa-star',
        livestream: 'fas fa-video',
    };

    const validKeys = ['opening', 'bride_groom', 'event', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];

    // Resolve active sections (prioritize DB sections, fallback to dynamic sections list if empty)
    const resolvedSections = [];
    if (safeSections.length > 0) {
        const dbSorted = safeSections
            .filter(s => s.is_visible && validKeys.includes(s.section_key))
            .sort((a, b) => a.sort_order - b.sort_order);

        dbSorted.forEach(s => {
            if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
            if (s.section_key === 'gallery' && !(galleries?.length > 0)) return;
            if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
            if (s.section_key === 'rsvp' && !enableRsvp) return;
            if (s.section_key === 'wishes' && !enableWishes) return;
            const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
            if (s.section_key === 'countdown' && !primaryEvent?.event_date) return;
            if (s.section_key === 'livestream' && !hasStream) return;

            resolvedSections.push(s);
            if (s.section_key === 'event' && hasStream) {
                resolvedSections.push({ section_key: 'livestream' });
            }
        });
    } else {
        const fallbacks = [
            { section_key: 'opening' },
            { section_key: 'bride_groom' },
            { section_key: 'event' },
        ];

        if (hasStream) {
            fallbacks.push({ section_key: 'livestream' });
        }

        if (loveStories?.length > 0) {
            fallbacks.push({ section_key: 'love_story' });
        }
        if (galleries?.length > 0) {
            fallbacks.push({ section_key: 'gallery' });
        }
        if (enableRsvp) {
            fallbacks.push({ section_key: 'rsvp' });
        }
        if (enableWishes) {
            fallbacks.push({ section_key: 'wishes' });
        }
        if (bankAccounts?.length > 0) {
            fallbacks.push({ section_key: 'bank' });
        }
        fallbacks.push({ section_key: 'closing' });

        resolvedSections.push(...fallbacks);
    }

    // Build navigation sections dynamically: combine RSVP and Wishes under a single button if both are present
    const navSections = [];
    resolvedSections.forEach(s => {
        if (s.section_key === 'cover') return;
        
        if (s.section_key === 'rsvp') {
            const hasWishes = resolvedSections.some(x => x.section_key === 'wishes');
            navSections.push({
                ...s,
                section_name: hasWishes ? 'RSVP & Ucapan' : 'RSVP',
            });
        } else if (s.section_key === 'wishes') {
            const hasRsvp = resolvedSections.some(x => x.section_key === 'rsvp');
            if (!hasRsvp) {
                navSections.push(s);
            }
        } else {
            navSections.push(s);
        }
    });

    const scrollToSection = useCallback((key) => {
        setAutoScrollEnabled(false);
        if (!isSlideMode) {
            const el = document.getElementById(key);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // For slide/tab modes
            setActiveSection(key);
            const idx = resolvedSections.findIndex(s => s.section_key === key);
            if (idx >= 0) setActiveSlideIdx(idx);
        }
    }, [isSlideMode, resolvedSections, setAutoScrollEnabled]);

    /* ── Component Mapping ── */
    const componentMap = {
        'opening':    <OpeningSection    
                        key="opening"    
                        invitation={invitation} 
                        brideGrooms={brideGrooms}
                        scrollToSection={scrollToSection}
                        loveStories={loveStories}
                        galleries={galleries}
                        enableRsvp={enableRsvp}
                        enableWishes={enableWishes}
                        bankAccounts={bankAccounts}
                        id="opening"
                      />,
        'bride_groom':<BrideGroomSection key="bride_groom" invitation={invitation} brideGrooms={brideGrooms} events={events} id="bride_groom" />,
        'event':      <EventSection      key="event"      events={events} invitation={invitation} galleries={galleries} />,
        'countdown':  <CountdownSection  key="countdown"  events={events} />,
        'love_story': loveStories?.length > 0
            ? <LoveStorySection key="love_story" loveStories={loveStories} invitation={invitation} id="love_story" />
            : null,
        'gallery':    galleries?.length > 0
            ? <GallerySection   key="gallery"    galleries={galleries} />
            : null,
        'bank':       bankAccounts?.length > 0
            ? <BankSection      key="bank"       bankAccounts={bankAccounts} id="bank" />
            : null,
        'livestream': hasStream
            ? <LiveStreamingSection key="livestream" events={events} invitation={invitation} />
            : null,
        'rsvp':       (enableRsvp || enableWishes)
            ? <UnifiedFormSection key="rsvp" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} />
            : null,
        'wishes':     enableRsvp ? null : (enableWishes
            ? <UnifiedFormSection key="wishes" invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={enableWishes} />
            : null),
        'closing':    <ClosingSection    key="closing"    invitation={invitation} brideGrooms={brideGrooms} id="closing" />,
    };

    // Set document title
    useEffect(() => {
        const bgs = safeArr(brideGrooms);
        const themeConfig = getThemeLabels(invitation?.type || 'wedding', activeLanguage, bgs, invitation);
        if (themeConfig.isSingleHost) {
            document.title = `${themeConfig.mainName} - ${themeConfig.labels.introBadge}`;
        } else {
            const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
            document.title = (names ? `${names} - ` : '') + 'Undangan Pernikahan';
        }
    }, [brideGrooms, invitation, activeLanguage]);

    const handleOpen = useCallback(() => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, []);

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current; if (!audio) return;
        if (isPlaying) { audio.pause(); setIsPlaying(false); }
        else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
    }, [isPlaying]);

    // Track active section on scroll
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        const handleScroll = () => {
            const secs = document.querySelectorAll('[data-section]');
            let cur = 'opening';
            secs.forEach(s => { if (s.getBoundingClientRect().top <= 120) cur = s.dataset.section; });
            setActiveSection(cur);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode]);

    // Update activeSection when activeSlideIdx changes in slide mode
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            setActiveSection(resolvedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections]);

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

    // ── Mouse & Touch Gesture Handlers for Swipe ──
    const touchStart = useRef({ x: 0, y: 0, time: 0 });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const nextSlide = useCallback(() => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    }, [resolvedSections.length]);

    const prevSlide = useCallback(() => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    }, []);

    const handlePointerDown = useCallback((clientX, clientY, target) => {
        if (!isSlideMode) return;
        isDragging.current = true;
        
        let atTop = false;
        let atBottom = false;
        
        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.nf-slide-container');
            if (scrollable) {
                atTop = scrollable.scrollTop <= 5;
                atBottom = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5;
            } else {
                atTop = true;
                atBottom = true;
            }
        } else {
            atTop = true;
            atBottom = true;
        }
        
        touchStart.current = { x: clientX, y: clientY, time: Date.now(), atTop, atBottom };
    }, [isSlideMode]);

    const handlePointerUp = useCallback((clientX, clientY, target) => {
        if (!isSlideMode || !isDragging.current) return;
        isDragging.current = false;
        
        const diffX = clientX - touchStart.current.x;
        const diffY = clientY - touchStart.current.y;
        const timeDiff = Date.now() - touchStart.current.time;
        const threshold = 50;

        // If it's a very fast swipe, lower the threshold
        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);

        if (layoutMode === 'slide-h' || layoutMode === 'slide') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        } else if (layoutMode === 'slide-v') {
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                // Check if target is a scrollable element that hasn't reached its boundary
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.nf-slide-container') : null;
                if (scrollable) {
                    // Use the state from BEFORE the swipe started
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;
                    
                    if (diffY < 0 && isAtBottom) {
                        nextSlide();
                    } else if (diffY > 0 && isAtTop) {
                        prevSlide();
                    }
                } else {
                    if (diffY < 0) nextSlide();
                    else prevSlide();
                }
            }
        }
    }, [isSlideMode, layoutMode, nextSlide, prevSlide]);

    // Touch Events
    const handleTouchStart = useCallback((e) => {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, [handlePointerDown]);

    const handleTouchEnd = useCallback((e) => {
        handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);
    }, [handlePointerUp]);

    // Mouse Events for PC
    const handleMouseDown = useCallback((e) => {
        handlePointerDown(e.clientX, e.clientY, e.target);
    }, [handlePointerDown]);

    const handleMouseUp = useCallback((e) => {
        handlePointerUp(e.clientX, e.clientY, e.target);
    }, [handlePointerUp]);

    const handleMouseLeave = useCallback(() => {
        isDragging.current = false;
    }, []);

    // Wheel Event for PC (Debounced)
    const handleWheel = useCallback((e) => {
        if (!isSlideMode) return;
        
        // Ensure we aren't rapidly switching slides
        if (scrollTimeout.current) return;

        const target = e.target.closest('.nf-slide-container');
        
        // Let the internal scroll handle it first if there is content to scroll
        if (target && target.scrollHeight > target.clientHeight) {
            // Add a small buffer of 2px to account for fractional scrolling values
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;
            
            if (e.deltaY > 0 && !isAtBottom) return; // Still scrolling down internally
            if (e.deltaY < 0 && !isAtTop) return; // Still scrolling up internally
        }

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800); // 800ms cooldown between slide switches via wheel

        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    }, [isSlideMode, nextSlide, prevSlide]);

    /* ── Audio ── */
    const musicUrl = invitation?.music_url || null;


    return (
        <div className={`nf-container ${!showAnimations ? 'nf-no-animations' : ''}`} id="main-scroll-container">
            {/* Partikel */}
            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {/* Audio — gunakan invitation.music_url LANGSUNG (bukan /storage/) */}
            {musicUrl && (
                <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />
            )}

            {/* QR Code Modal */}
            {enableQr && showQr && activeGuest && (
                <div className="nf-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="nf-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="nf-qr-title">QR Code Check-in</h3>
                        <p className="nf-qr-guest">{activeGuest.name}</p>
                        <div className="nf-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=E50914&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                alt="QR Code" className="nf-qr-img"
                            />
                        </div>
                        <p className="nf-qr-hint">Scan untuk konfirmasi kehadiran</p>
                        <button className="nf-qr-close" onClick={() => setShowQr(false)}>Tutup</button>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            {isOpened && showMenu && navSections.length > 0 && (
                <nav className={`nf-nav-menu nf-nav-menu--${menuPosition}`}>
                    {menuPosition === 'top' || menuPosition === 'bottom' ? (
                        <div className="nf-nav-menu__inner nf-nav-menu__inner--row">
                            {navSections.map(s => (
                                <button key={s.section_key}
                                    type="button"
                                    className={`nf-nav-menu__item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' active' : ''}`}
                                    onClick={() => scrollToSection(s.section_key)}
                                    title={s.section_name || navLabels[s.section_key] || s.section_key}>
                                    {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : (navLabels[s.section_key]?.charAt(0) || '•')}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="nf-nav-menu__inner nf-nav-menu__inner--col">
                            {navSections.map(s => (
                                <button key={s.section_key}
                                    type="button"
                                    className={`nf-nav-menu__item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' active' : ''}`}
                                    onClick={() => scrollToSection(s.section_key)}
                                    title={s.section_name || navLabels[s.section_key] || s.section_key}>
                                    {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : (navLabels[s.section_key]?.charAt(0) || '•')}
                                </button>
                            ))}
                        </div>
                    )}
                </nav>
            )}

            {/* Cover (Who's Watching) */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
            />

            {/* Tombol Floating: Musik + QR */}
            {isOpened && (
                <div className={`nf-floating-btns${menuPosition === 'bottom' && showMenu ? ' nf-floating-btns--raised' : ''}`}>
                    {enableQr && activeGuest && (
                        <button type="button" className="nf-music-btn" onClick={() => setShowQr(true)} aria-label="QR Code">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 2h2v3h-2v-3zm3 3h2v2h-2v-2zm-3-1h1v1h-1v-1zm3-3h2v2h-2v-2z" />
                            </svg>
                        </button>
                    )}
                    {/* Fullscreen Button */}
                    <button
                        type="button"
                        className="nf-music-btn"
                        onClick={toggleFullscreen}
                        style={isFullscreen ? { backgroundColor: '#E50914', color: '#fff', boxShadow: '0 0 10px #E50914' } : {}}
                        title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}
                    >
                        <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                    </button>
                    {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="nf-music-btn"
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: '#E50914', color: '#fff', boxShadow: '0 0 10px #E50914' } : {}}
                        title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                    </button>
                    )}
                    {musicUrl && (
                        <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
                    )}
                </div>
            )}

            {/* Konten Utama */}
            <div 
                className={`nf-main${isOpened ? ' nf-main--visible' : ''} ${isSlideMode ? 'nf-main--slide' : ''} ${layoutMode === 'slide-h' ? 'nf-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'nf-main--slide-v' : ''}`}
                onTouchStart={isSlideMode ? handleTouchStart : undefined}
                onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                onTouchCancel={isSlideMode ? handleTouchEnd : undefined}
                onMouseDown={isSlideMode ? handleMouseDown : undefined}
                onMouseUp={isSlideMode ? handleMouseUp : undefined}
                onMouseLeave={isSlideMode ? handleMouseLeave : undefined}
                onWheel={isSlideMode ? handleWheel : undefined}
            >
                {resolvedSections.map((s, idx) => {
                    if (isSlideMode) {
                        let slideClass = 'nf-slide-container';
                        if (idx === activeSlideIdx) {
                            slideClass += ' is-active';
                        } else if (idx > activeSlideIdx) {
                            slideClass += ' is-next';
                        } else {
                            slideClass += ' is-prev';
                        }

                        return (
                            <div 
                                key={s.section_key} 
                                className={slideClass}
                                id={s.section_key}
                                data-section={s.section_key}
                            >
                                {componentMap[s.section_key]}
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={s.section_key} 
                            id={s.section_key}
                            data-section={s.section_key}
                        >
                            {componentMap[s.section_key]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EXPORT DEFAULT
   ═══════════════════════════════════════ */
export default function WedflixTheme(props) {
    return (
        <ErrorBoundary>
            <WedflixThemeContent {...props} />
        </ErrorBoundary>
    );
}
