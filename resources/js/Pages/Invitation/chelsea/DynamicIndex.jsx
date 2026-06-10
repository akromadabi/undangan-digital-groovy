import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) { return String(n).padStart(2, '0'); }

function formatDate(d, locale = 'id') {
    if (!d) return '';
    const safe = String(d).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatStoryDate(dateStr) {
    if (!dateStr) return '';
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    if (datePattern.test(dateStr)) {
        try {
            const d = new Date(String(dateStr).substring(0, 10) + 'T12:00:00');
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        } catch (e) {}
    }
    return dateStr;
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
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

// Safe date parsing helper
function parseSafeDate(dateStr, timeStr = '') {
    if (!dateStr) return null;
    let datePart = String(dateStr).substring(0, 10);
    let timePart = '08:00:00';
    if (timeStr) {
        timePart = String(timeStr).substring(0, 5) + ':00';
    } else if (String(dateStr).length > 10) {
        let parts = String(dateStr).trim().split(/\s+/);
        if (parts[1]) {
            timePart = parts[1].substring(0, 5);
            if (timePart.length === 5) timePart += ':00';
        }
    }
    let isoStr = `${datePart}T${timePart}`;
    let d = new Date(isoStr);
    if (!isNaN(d.getTime())) return d;
    const dateParts = datePart.split('-');
    const timeParts = timePart.split(':');
    return new Date(
        parseInt(dateParts[0], 10), parseInt(dateParts[1], 10) - 1, parseInt(dateParts[2], 10),
        parseInt(timeParts[0], 10) || 0, parseInt(timeParts[1], 10) || 0, parseInt(timeParts[2], 10) || 0
    );
}

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
            <div className="ch-error-boundary">
                <h2>Terjadi kesalahan pada tema Chelsea.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0, variant = 'up' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);
    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    let baseClass = 'ch-reveal--up';
    if (variant === 'zoom') baseClass = 'ch-reveal--zoom';
    else if (variant === 'left') baseClass = 'ch-reveal--left';
    else if (variant === 'right') baseClass = 'ch-reveal--right';

    return (
        <div ref={ref} className={`${className} ${!globalShowAnimations ? '' : `${baseClass} ${visible ? 'is-visible' : ''}`}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}>
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   PITCH LINES DECORATION (Chelsea Stadium Background)
   ═══════════════════════════════════════ */
function PitchDecoration() {
    return (
        <div className="ch-pitch-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="rgba(100, 181, 246, 0.06)" strokeWidth="1.5" />
                <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(100, 181, 246, 0.04)" strokeWidth="1.5" />
                <circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(100, 181, 246, 0.04)" strokeWidth="1.5" />
                <rect x="30%" y="5%" width="40%" height="10%" fill="none" stroke="rgba(100, 181, 246, 0.03)" strokeWidth="1" />
                <rect x="30%" y="85%" width="40%" height="10%" fill="none" stroke="rgba(100, 181, 246, 0.03)" strokeWidth="1" />
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   CHELSEA CREST (Custom SVG — Legal & Creative)
   ═══════════════════════════════════════ */
function ChelseaInViteCrest({ size = 120 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0px 4px 15px rgba(30, 136, 229, 0.5))', margin: 'auto' }}>
            {/* Shield Background */}
            <path d="M28,20 L72,20 C72,20 78,55 50,78 C22,55 28,20 28,20 Z" fill="#1565c0" stroke="#90caf9" strokeWidth="1.5" />
            {/* Top Blue Banner */}
            <path d="M12,8 C35,15 65,15 88,8 L84,20 C62,26 38,26 16,20 Z" fill="#0d47a1" stroke="#64b5f6" strokeWidth="1" />
            <text x="50" y="17" fill="#64b5f6" fontFamily="'Montserrat', sans-serif" fontWeight="900" fontSize="6" textAnchor="middle">CHELSEA</text>
            {/* Bottom Banner */}
            <path d="M12,80 C35,73 65,73 88,80 L84,92 C62,86 38,86 16,92 Z" fill="#0d47a1" stroke="#64b5f6" strokeWidth="1" />
            <text x="50" y="89" fill="#64b5f6" fontFamily="'Montserrat', sans-serif" fontWeight="900" fontSize="6.5" textAnchor="middle">LOVE</text>
            {/* Lion Head (Stylized) */}
            <ellipse cx="50" cy="46" rx="14" ry="16" fill="#1976d2" stroke="#64b5f6" strokeWidth="1" />
            {/* Lion Crown */}
            <polygon points="40,32 44,37 48,31 52,37 56,31 60,37 63,30 60,34 50,29 40,34 37,30" fill="#90caf9" />
            {/* Lion Eyes */}
            <circle cx="45" cy="43" r="2.5" fill="#e3f2fd" />
            <circle cx="55" cy="43" r="2.5" fill="#e3f2fd" />
            <circle cx="45.8" cy="43.8" r="1.2" fill="#0d47a1" />
            <circle cx="55.8" cy="43.8" r="1.2" fill="#0d47a1" />
            {/* Lion Nose & Mouth */}
            <ellipse cx="50" cy="48" rx="3" ry="2" fill="#0d47a1" />
            <path d="M46,51 C47,53 53,53 54,51" fill="none" stroke="#e3f2fd" strokeWidth="1" strokeLinecap="round" />
            {/* Left Circle */}
            <circle cx="18" cy="50" r="7" fill="#0d47a1" stroke="#64b5f6" strokeWidth="1" />
            <text x="18" y="54" fill="#64b5f6" fontFamily="serif" fontWeight="900" fontSize="8" textAnchor="middle">C</text>
            {/* Right Circle */}
            <circle cx="82" cy="50" r="7" fill="#0d47a1" stroke="#64b5f6" strokeWidth="1" />
            <text x="82" y="54" fill="#64b5f6" fontFamily="serif" fontWeight="900" fontSize="8" textAnchor="middle">F</text>
            {/* Wedding Rings */}
            <circle cx="44" cy="67" r="5" fill="none" stroke="#90caf9" strokeWidth="1.5" />
            <circle cx="56" cy="67" r="5" fill="none" stroke="#90caf9" strokeWidth="1.5" />
            {/* Heart accent */}
            <path d="M47,70 C47,68 49,67 50,69 C51,67 53,68 53,70 C53,72 50,74 50,74 C50,74 47,72 47,70" fill="#90caf9" />
        </svg>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER (Used in Opening & Event)
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate, startTime }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const target = parseSafeDate(targetDate, startTime);
        if (!target || isNaN(target.getTime())) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCd({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [targetDate, startTime]);

    return (
        <div className="ch-countdown">
            <div className="ch-countdown-grid">
                {[
                    { val: pad2(cd.d), lbl: t('invitation.days') || 'Hari' },
                    { val: pad2(cd.h), lbl: t('invitation.hours') || 'Jam' },
                    { val: pad2(cd.m), lbl: t('invitation.minutes') || 'Menit' },
                    { val: pad2(cd.s), lbl: 'Detik' },
                ].map((item, i) => (
                    <React.Fragment key={i}>
                        <div className="ch-countdown-box">
                            <span className="ch-countdown-val">{item.val}</span>
                            <span className="ch-countdown-lbl">{item.lbl.toUpperCase()}</span>
                        </div>
                        {i < 3 && <div className="ch-countdown-divider">:</div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (VIP Match Ticket — Chelsea Blue Edition)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, primaryEvent }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    return (
        <div className={`ch-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'ch-no-photo-mode' : ''}`}>
            {globalShowPhotos && invitation?.cover_image && (
                <PremiumSlideshow
                    images={invitation.cover_image.split(',')}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="ch-cover__bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover opacity-20"
                />
            )}
            <PitchDecoration />
            <div className="ch-cover__overlay" />
            <div className="ch-cover__content">
                {/* Crest Logo */}
                <div className="ch-logo-main-wrap">
                    <ChelseaInViteCrest size={90} />
                </div>

                {/* VIP Pass Header */}
                <div className="ch-vip-pass-label">
                    <span>VIP MATCHDAY PASS</span>
                    <span className="ch-pass-serial">NO: CFC-{String(invitation?.id || 99).padStart(4, '0')}</span>
                </div>

                {/* Clean Invitation Card */}
                <div className="ch-invitation-card">
                    <h2 className="ch-stadium-label">{(primaryEvent?.venue_name || 'Stamford Bridge, London').toUpperCase()}</h2>
                    <h1 className="ch-match-title">{coupleName.toUpperCase()}</h1>
                    <p className="ch-match-date">
                        {primaryEvent?.event_date
                            ? formatDate(primaryEvent.event_date).toUpperCase()
                            : (invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date.substring(0, 10)).toUpperCase() : 'DESEMBER 2026')}
                    </p>
                </div>

                {/* Guest Area */}
                <div className="ch-guest-area">
                    <p className="ch-guest-label">{t('invitation.to') || 'Kepada Yth.'}</p>
                    <h3 className="ch-guest-name">{guestName || 'Tamu Undangan'}</h3>
                    <p className="ch-guest-desc">Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.</p>
                </div>

                <button onClick={onOpen} id="tombol-buka" className="ch-btn-kickoff">
                    <i className="fas fa-futbol ch-btn-icon" />
                    BUKA UNDANGAN
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (Scoreboard Jumbotron — Chelsea Blue)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, scrollToSection, loveStories, galleries, enableRsvp, enableWishes, bankAccounts, events, id }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const groomNickname = groom.nickname || 'GROOM';
    const brideNickname = bride.nickname || 'BRIDE';
    const coupleName = (groom?.nickname && bride?.nickname) ? `${groom.nickname} & ${bride.nickname}` : 'Groom & Bride';

    const groomPhoto = getStorageUrl(groom.photo, null);
    const bridePhoto = getStorageUrl(bride.photo, null);

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const countdownTarget = primaryEvent?.event_date || '';

    return (
        <section id={id || "opening"} className="ch-opening">
            <PitchDecoration />
            <div className="ch-container-inner">
                {/* Scoreboard — Chelsea LED Display */}
                <Reveal className="ch-scoreboard">
                    <div className="ch-scoreboard-scanlines" />
                    <div className="ch-scoreboard-header">
                        <div className="ch-live-indicator">
                            <div className="ch-live-dot" />
                            <span>LIVE</span>
                        </div>
                        <div className="ch-match-center-title">ACARA PERNIKAHAN BAHAGIA</div>
                        <div className="ch-match-time-display">
                            <i className="fas fa-heart" />
                        </div>
                    </div>

                    {/* Player Cards */}
                    <div className="ch-scoreboard-matchup">
                        {/* Groom Card */}
                        <div className="ch-matchup-card ch-groom-card animate-float-slow">
                            <div className="ch-card-crest-glow" />
                            <div className="ch-card-inner">
                                <div className="ch-card-photo-wrap">
                                    {globalShowPhotos && groomPhoto ? (
                                        <img src={groomPhoto} alt={groomNickname} className="ch-card-photo"
                                            style={{
                                                objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                                transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                            }}
                                        />
                                    ) : (
                                        <div className="ch-card-monogram">{groomNickname.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="ch-card-info">
                                    <h4 className="ch-card-name">{groomNickname.toUpperCase()}</h4>
                                    <span className="ch-card-role">MEMPELAI PRIA</span>
                                </div>
                            </div>
                        </div>

                        {/* VS Display */}
                        <div className="ch-scoreboard-vs">
                            <div className="ch-score-row">
                                <span className="ch-score-heart animate-pulse">💙</span>
                                <span className="ch-score-divider">&</span>
                                <span className="ch-score-heart animate-pulse">💙</span>
                            </div>
                            <div className="ch-score-badge">STATUS CINTA</div>
                            <div className="ch-scorer-list">
                                <i className="fas fa-heartbeat animate-pulse" /> CINTA ABADI
                            </div>
                        </div>

                        {/* Bride Card */}
                        <div className="ch-matchup-card ch-bride-card animate-float-slow">
                            <div className="ch-card-crest-glow ch-bride-glow" />
                            <div className="ch-card-inner">
                                <div className="ch-card-photo-wrap">
                                    {globalShowPhotos && bridePhoto ? (
                                        <img src={bridePhoto} alt={brideNickname} className="ch-card-photo"
                                            style={{
                                                objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                                transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                            }}
                                        />
                                    ) : (
                                        <div className="ch-card-monogram ch-bride-monogram">{brideNickname.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="ch-card-info">
                                    <h4 className="ch-card-name">{brideNickname.toUpperCase()}</h4>
                                    <span className="ch-card-role">MEMPELAI WANITA</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ch-scoreboard-footer">
                        <i className="fas fa-heart" /> {(primaryEvent?.venue_name || 'STAMFORD BRIDGE OF LOVE').toUpperCase()}
                    </div>

                    {/* Countdown */}
                    {countdownTarget && (
                        <div className="ch-scoreboard-countdown">
                            <CountdownTimer targetDate={countdownTarget} startTime={primaryEvent?.start_time} />
                        </div>
                    )}
                </Reveal>

                {/* Intro Box */}
                <Reveal delay={100} className="ch-intro-box">
                    <div className="ch-intro-box-header">
                        <span className="ch-intro-badge">UNDANGAN PERNIKAHAN RESMI</span>
                    </div>
                    <div className="ch-intro-box-body">
                        <span className="ch-title-badge-sm">THE WEDDING OF</span>
                        <h2 className="ch-title-blue">{coupleName.toUpperCase()}</h2>

                        {/* Opening Slideshow */}
                        {globalShowPhotos && invitation?.opening_image && (
                            <div className="ch-opening-slideshow-wrap">
                                <PremiumSlideshow
                                    images={invitation.opening_image.split(',')}
                                    positionX={invitation?.opening_position_x}
                                    positionY={invitation?.opening_position_y}
                                    zoom={invitation?.opening_zoom}
                                    className="ch-opening-slideshow"
                                />
                            </div>
                        )}

                        {invitation?.opening_ayat && (
                            <div className="ch-ayat-box">
                                <i className="fas fa-quote-left ch-quote-icon" />
                                <p className="ch-ayat-text">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                                {invitation?.opening_ayat_source && (
                                    <span className="ch-ayat-src">&mdash; {invitation.opening_ayat_source}</span>
                                )}
                            </div>
                        )}

                        <p className="ch-text-body">
                            {invitation?.opening_text || "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan mendoakan kelancaran perayaan pernikahan kami."}
                        </p>
                    </div>
                </Reveal>

                {/* Navigation Pills */}
                <Reveal delay={200} className="ch-opening-nav">
                    {scrollToSection ? (
                        <>
                            <button type="button" onClick={() => scrollToSection('bride_groom')} className="ch-nav-pill"><i className="fas fa-heart" /> {t('nav.mempelai')}</button>
                            <button type="button" onClick={() => scrollToSection('event')} className="ch-nav-pill"><i className="fas fa-calendar-alt" /> {t('nav.acara')}</button>
                            {loveStories?.length > 0 && <button type="button" onClick={() => scrollToSection('love_story')} className="ch-nav-pill"><i className="fas fa-history" /> {t('invitation.love_story')}</button>}
                            {galleries?.length > 0 && <button type="button" onClick={() => scrollToSection('gallery')} className="ch-nav-pill"><i className="fas fa-images" /> {t('invitation.gallery')}</button>}
                            {enableRsvp && <button type="button" onClick={() => scrollToSection('rsvp')} className="ch-nav-pill"><i className="fas fa-paper-plane" /> {t('nav.rsvp')}</button>}
                            {enableWishes && <button type="button" onClick={() => scrollToSection('wishes')} className="ch-nav-pill"><i className="fas fa-comments" /> {t('invitation.wishes_title')}</button>}
                            {bankAccounts?.length > 0 && <button type="button" onClick={() => scrollToSection('bank')} className="ch-nav-pill"><i className="fas fa-gift" /> {t('nav.hadiah')}</button>}
                        </>
                    ) : (
                        <>
                            <a href="#bride_groom" className="ch-nav-pill"><i className="fas fa-heart" /> {t('nav.mempelai')}</a>
                            <a href="#event" className="ch-nav-pill"><i className="fas fa-calendar-alt" /> {t('nav.acara')}</a>
                            <a href="#love_story" className="ch-nav-pill"><i className="fas fa-history" /> {t('invitation.love_story')}</a>
                            <a href="#gallery" className="ch-nav-pill"><i className="fas fa-images" /> {t('invitation.gallery')}</a>
                            <a href="#rsvp" className="ch-nav-pill"><i className="fas fa-paper-plane" /> {t('nav.rsvp')}</a>
                            <a href="#bank" className="ch-nav-pill"><i className="fas fa-gift" /> {t('nav.hadiah')}</a>
                        </>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BRIDE & GROOM SECTION (Squad Lineup)
   ═══════════════════════════════════════ */
function BrideGroomSection({ invitation, brideGrooms, id }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const isEn = locale === 'en';
        const raw = String(childOrder).trim().toLowerCase();
        let matchedKey = null;
        if (raw.includes('tunggal') || raw.includes('only')) matchedKey = 'tunggal';
        else if (raw.includes('bungsu') || raw.includes('youngest')) matchedKey = 'bungsu';
        else if (raw.includes('10') || raw.includes('kesepuluh')) matchedKey = '10';
        else if (raw.includes('9') || raw.includes('kesembilan')) matchedKey = '9';
        else if (raw.includes('8') || raw.includes('kedelapan')) matchedKey = '8';
        else if (raw.includes('7') || raw.includes('ketujuh')) matchedKey = '7';
        else if (raw.includes('6') || raw.includes('keenam')) matchedKey = '6';
        else if (raw.includes('5') || raw.includes('kelima')) matchedKey = '5';
        else if (raw.includes('4') || raw.includes('keempat')) matchedKey = '4';
        else if (raw.includes('3') || raw.includes('ketiga')) matchedKey = '3';
        else if (raw.includes('2') || raw.includes('kedua')) matchedKey = '2';
        else if (raw.includes('1') || raw.includes('pertama') || raw.includes('kesatu')) matchedKey = '1';

        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' }, '2': { id: 'Kedua', en: 'Second' },
            '3': { id: 'Ketiga', en: 'Third' }, '4': { id: 'Keempat', en: 'Fourth' },
            '5': { id: 'Kelima', en: 'Fifth' }, '6': { id: 'Keenam', en: 'Sixth' },
            '7': { id: 'Ketujuh', en: 'Seventh' }, '8': { id: 'Kedelapan', en: 'Eighth' },
            '9': { id: 'Kesembilan', en: 'Ninth' }, '10': { id: 'Kesepuluh', en: 'Tenth' },
            'bungsu': { id: 'Bungsu', en: 'Youngest' }, 'tunggal': { id: 'Tunggal', en: 'Only' }
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

    function PlayerCard({ person, side, pos }) {
        if (!person) return null;
        const photo = getStorageUrl(person.photo, null);
        const nameInitials = (person.nickname || person.full_name || 'X')
            .split(' ').map(w => w.charAt(0)).join('').toUpperCase().substring(0, 2);
        const isWanita = ['wanita', 'female'].includes(String(person.gender).toLowerCase());

        return (
            <Reveal className={`ch-player-card ch-player-card--${side}`} delay={side === 'left' ? 0 : 200}>
                <div className="ch-player-shirt-bg">{side === 'left' ? '07' : '10'}</div>
                {globalShowPhotos && photo ? (
                    <div className="ch-player-photo-wrap">
                        <img src={photo} alt={person.full_name} className="ch-player-photo"
                            style={{
                                objectPosition: `${person.photo_position_x ?? 50}% ${person.photo_position_y ?? 50}%`,
                                transform: `scale(${person.photo_zoom ?? 1.0})`,
                            }}
                        />
                    </div>
                ) : (
                    <div className="ch-player-monogram">
                        <span className="ch-monogram-initials">{nameInitials}</span>
                    </div>
                )}
                <div className="ch-player-meta">
                    <span className="ch-player-badge">
                        <i className="fas fa-check-circle ch-verified-icon" />
                        {pos || (isWanita ? (locale === 'en' ? 'BRIDE' : 'MEMPELAI WANITA') : (locale === 'en' ? 'GROOM' : 'MEMPELAI PRIA'))}
                    </span>
                    <h3 className="ch-player-name">{person.full_name}</h3>
                    <p className="ch-player-child-order">
                        {translateChildOrder(person.child_order, person.gender) ||
                            (isWanita ? t('invitation.daughter_of') : t('invitation.son_of'))}
                    </p>
                    <p className="ch-player-parents">
                        {[person.father_name, person.mother_name].filter(Boolean).join(' & ') || person.parents_name || ''}
                    </p>
                    {person.instagram && (
                        <a href={`https://www.instagram.com/${person.instagram.replace('@', '')}`}
                            target="_blank" rel="noreferrer" className="ch-player-ig">
                            <i className="fab fa-instagram" /> Instagram
                        </a>
                    )}
                </div>
            </Reveal>
        );
    }

    return (
        <section id={id || "bride_groom"} className="ch-bridegroom">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">KEDUA MEMPELAI</span>
                        PROFIL MEMPELAI
                    </h2>
                </Reveal>
                <div className="ch-lineup-row">
                    <PlayerCard person={groom} side="left" pos="MEMPELAI PRIA" />
                    <div className="ch-lineup-vs">&</div>
                    <PlayerCard person={bride} side="right" pos="MEMPELAI WANITA" />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (Match Timeline)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, id }) {
    const stories = safeArr(loveStories);
    if (stories.length === 0) return null;

    return (
        <section id={id || "love_story"} className="ch-love-story">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">KISAH CINTA</span>
                        PERJALANAN INDAH CINTA KAMI
                    </h2>
                </Reveal>

                <div className="ch-timeline-track">
                    {stories.map((story, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <div key={idx} className={`ch-timeline-node ch-timeline-node--${isEven ? 'left' : 'right'}`}>
                                <Reveal className="ch-timeline-card">
                                    <div className="ch-timeline-number">{String(idx + 1).padStart(2, '0')}</div>
                                    <div className="ch-timeline-details">
                                        <span className="ch-timeline-badge">{story.title || `MOMEN ${idx + 1}`}</span>
                                        {story.story_date && <span className="ch-timeline-date">{formatStoryDate(story.story_date)}</span>}
                                        <p className="ch-timeline-desc">{story.description || story.story}</p>
                                    </div>
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
   EVENT SECTION (Match Fixtures — Blue Edition)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation }) {
    const { t } = useTranslation();
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
        <section id="event" className="ch-events">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">DETAIL ACARA</span>
                        JADWAL RANGKAIAN ACARA
                    </h2>
                </Reveal>

                <div className="ch-events-list">
                    {safeEvents.map((ev, idx) => {
                        const evDate = ev.event_date || ev.date;
                        const d = evDate ? new Date(String(evDate).substring(0, 10) + 'T12:00:00') : null;
                        const isAkad = ev.event_name?.toLowerCase().includes('akad') || ev.event_name?.toLowerCase().includes('utama');

                        return (
                            <Reveal key={idx} delay={idx * 100} className="ch-event-fixture">
                                <div className="ch-fixture-header">
                                    <span className="ch-fixture-leg">{isAkad ? 'UTAMA' : `SESI ${idx + 1}`}</span>
                                    <span className="ch-fixture-title">{ev.event_name || 'Acara Pernikahan'}</span>
                                </div>
                                <div className="ch-fixture-body">
                                    {d && (
                                        <div className="ch-fixture-row">
                                            <i className="far fa-calendar ch-fixture-icon" />
                                            <span>{d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                    {ev.start_time && (
                                        <div className="ch-fixture-row">
                                            <i className="far fa-clock ch-fixture-icon" />
                                            <span>{formatTime(ev.start_time)}{ev.end_time && ev.end_time !== 'Selesai' ? ` - ${formatTime(ev.end_time)}` : ''} {ev.timezone || 'WIB'}</span>
                                        </div>
                                    )}
                                    {ev.venue_name && (
                                        <div className="ch-fixture-row">
                                            <i className="fas fa-map-marker-alt ch-fixture-icon" />
                                            <strong>{ev.venue_name}</strong>
                                        </div>
                                    )}
                                    {ev.venue_address && <p className="ch-fixture-address">{ev.venue_address}</p>}
                                </div>
                                <div className="ch-fixture-footer">
                                    {ev.gmaps_link && (
                                        <a href={ev.gmaps_link} target="_blank" rel="noreferrer" className="ch-btn-card">
                                            <i className="fas fa-location-arrow" /> PETUNJUK JALAN
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noreferrer" className="ch-btn-card ch-btn-card--secondary">
                                        <i className="far fa-calendar-plus" /> TAMBAH KALENDER
                                    </a>
                                </div>

                                {/* DressCode */}
                                {ev.show_dress_code && (
                                    <div className="ch-card w-full mt-4" style={{ padding: '20px', border: '1px solid rgba(100,181,246,0.3)', backgroundColor: 'rgba(13,71,161,0.2)', borderRadius: '12px' }}>
                                        <DressCodeBlock event={ev} colors={{ primary: '#1565c0', text: '#e3f2fd' }} fonts={{ heading: 'inherit' }} variant="app" plain={true} />
                                    </div>
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
   LIVESTREAM SECTION
   ═══════════════════════════════════════ */
function LivestreamSection({ events, invitation }) {
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
        <section className="ch-livestream" id="livestream">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">SIARAN LANGSUNG</span>
                        {isEn ? 'LIVE STREAMING' : 'SIARAN LANGSUNG'}
                    </h2>
                    <p className="ch-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
                </Reveal>

                <Reveal delay={150} className="ch-livestream-panel">
                    <div className="ch-broadcast-symbol">
                        <div className="ch-live-beacon" />
                        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </div>
                    <div className="ch-streams-list">
                        {streamsList.map((stream, idx) => (
                            <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="ch-btn-broadcast">
                                <i className="fas fa-video" /> TONTON DI {stream.platform.toUpperCase()}
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
function VideoSection({ invitation, locale }) {
    if (!invitation?.video_url) return null;
    const isEn = locale === 'en';
    const embedUrl = invitation.video_url.includes('watch?v=')
        ? invitation.video_url.replace('watch?v=', 'embed/') + '?autoplay=0&mute=0'
        : invitation.video_url;

    return (
        <section id="video" className="ch-section">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">VIDEO</span>
                        {isEn ? 'OUR VIDEO' : 'MOMEN VIDEO'}
                    </h2>
                </Reveal>
                <Reveal delay={100}>
                    <div className="ch-video-container">
                        <iframe src={embedUrl} title="Wedding Video" frameBorder="0" allowFullScreen allow="autoplay; encrypted-media" />
                    </div>
                </Reveal>
            </div>
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
        <section id="gallery" className="ch-gallery">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">GALERI FOTO</span>
                        {t('invitation.gallery') || 'GALERI FOTO'}
                    </h2>
                </Reveal>
                <div className="ch-gallery-grid">
                    {safeGalleries.map((g, idx) => {
                        const src = getStorageUrl(g.image_url || g.image_path, null);
                        return (
                            <Reveal key={idx} delay={(idx % 6) * 60} variant="zoom" className="ch-gallery-item">
                                <img src={src} alt={`Gallery ${idx + 1}`} loading="lazy" />
                                {g.caption && <div className="ch-gallery-caption">{g.caption}</div>}
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK SECTION (Transfer — Luxury-02 Style)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, id }) {
    const { t } = useTranslation();
    const accounts = safeArr(bankAccounts);
    if (accounts.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);

    const fallbackCopy = (text, idx) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0, top: 0, left: 0 });
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const range = document.createRange();
        range.selectNodeContents(ta);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        ta.setSelectionRange(0, 999999);
        try {
            document.execCommand('copy');
            sel.removeAllRanges();
            document.body.removeChild(ta);
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        } catch (e) {
            sel.removeAllRanges();
            document.body.removeChild(ta);
        }
    };

    const copy = (text, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }).catch(() => fallbackCopy(text, idx));
        } else {
            fallbackCopy(text, idx);
        }
    };

    return (
        <section id={id || "bank"} className="ch-bank">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">HADIAH PERNIKAHAN</span>
                        KIRIM HADIAH
                    </h2>
                    <p className="ch-subtitle">{t('invitation.gift_desc')}</p>
                </Reveal>

                <div className="ch-bank-cards">
                    {accounts.map((acc, idx) => {
                        const isBca = acc.bank_name?.toLowerCase().includes('bca');
                        const isDana = acc.bank_name?.toLowerCase().includes('dana');

                        return (
                            <Reveal key={idx} delay={idx * 100} className="ch-bank-card">
                                <div className="ch-bank-crest-bg" />
                                <div className="ch-bank-card-header">
                                    <div className="ch-bank-logo-area">
                                        {(isBca || isDana) ? (
                                            <img
                                                src={isBca
                                                    ? '/themes/luxury-02/asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1.png'
                                                    : '/themes/luxury-02/asset/1200px-Logo_dana_blue.svg-1-1-1.png'}
                                                alt={acc.bank_name}
                                                className="ch-bank-card-logo"
                                            />
                                        ) : (
                                            <span className="ch-bank-name-text">{acc.bank_name}</span>
                                        )}
                                    </div>
                                    <div className="ch-bank-chip">
                                        <div className="ch-chip-inner" />
                                    </div>
                                </div>
                                <div className="ch-bank-card-body">
                                    <h3 className="ch-bank-number">{acc.account_number}</h3>
                                    <p className="ch-bank-holder">A.N. {acc.account_holder || acc.account_name}</p>
                                </div>
                                <div className="ch-bank-card-footer">
                                    <button className="ch-btn-copy" onClick={() => copy(acc.account_number, idx)}>
                                        {copiedIdx === idx ? '✓ TERSALIN' : 'SALIN NOMOR REKENING'}
                                    </button>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES SECTION (Supporters Zone)
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const wishesInputRef = React.useRef(null);
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

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="ch-rsvp">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal>
                    <h2 className="ch-section-title">
                        <span className="ch-title-badge">KONFIRMASI & UCAPAN</span>
                        KEHADIRAN & DOA RESTU
                    </h2>
                </Reveal>

                <div className="ch-rsvp-container">
                    <Reveal className="ch-rsvp-form-panel">
                        {success ? (
                            <div className="ch-form-success">
                                <div className="ch-trophy-symbol">🏆</div>
                                <h3>TERIMA KASIH!</h3>
                                <p>Konfirmasi kehadiran dan ucapan Anda berhasil dikirim.</p>
                                <button onClick={() => setSuccess(false)} className="ch-btn-submit">KIRIM RESPON LAIN</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="ch-rsvp-form">
                                <div className="ch-form-group">
                                    <label>NAMA TAMU</label>
                                    <input type="text" value={sharedName} onChange={e => setSharedName(e.target.value)}
                                        required placeholder="Tulis nama lengkap Anda" className="ch-form-input" />
                                </div>

                                {enableRsvp && (
                                    <>
                                        <div className="ch-form-group">
                                            <label>KONFIRMASI KEHADIRAN</label>
                                            <select value={attendance} onChange={e => setAttendance(e.target.value)} className="ch-form-select">
                                                <option value="hadir">Hadir</option>
                                                <option value="tidak_hadir">Absen / Tidak Hadir</option>
                                                <option value="masih_ragu">Belum Pasti</option>
                                            </select>
                                        </div>
                                        {attendance === 'hadir' && (
                                            <div className="ch-form-group">
                                                <label>JUMLAH TAMU (PAX)</label>
                                                <input type="number" min="1" max="10" value={numGuests}
                                                    onChange={e => setNumGuests(parseInt(e.target.value) || 1)} className="ch-form-input" />
                                            </div>
                                        )}
                                    </>
                                )}

                                {enableWishes && (
                                    <div className="ch-form-group">
                                        <label>KIRIM UCAPAN & DOA RESTU</label>
                                        <WishesEmojiPicker value={message} onChange={setMessage} inputRef={wishesInputRef} isDark={true}>
                                            <textarea ref={wishesInputRef} rows="4" value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                placeholder="Tulis ucapan dan doa restu Anda untuk kedua mempelai..."
                                                className="ch-form-textarea" style={{ width: '100%' }}
                                            />
                                        </WishesEmojiPicker>
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting} className="ch-btn-submit">
                                    {isSubmitting ? 'MENGIRIM...' : 'KIRIM KONFIRMASI'}
                                </button>
                            </form>
                        )}
                    </Reveal>

                    {enableWishes && (
                        <Reveal delay={150} className="ch-rsvp-wishes-panel">
                            <h3 className="ch-feed-title">DOA RESTU & UCAPAN TAMU</h3>
                            <div className="ch-wishes-feed">
                                {recentWishes.length === 0 ? (
                                    <p className="ch-no-wishes">Belum ada ucapan. Jadilah yang pertama!</p>
                                ) : (
                                    recentWishes.map((w, idx) => (
                                        <div key={idx} className="ch-wish-bubble">
                                            <div className="ch-wish-header">
                                                <span className="ch-supporter-badge">TAMU</span>
                                                <strong className="ch-wish-sender">{w.sender_name}</strong>
                                            </div>
                                            <p className="ch-wish-msg">{w.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (Trophy Room)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;
    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const brandName = invitation?.user?.reseller_settings?.brand_name
        || invitation?.user?.reseller?.reseller_settings?.brand_name
        || 'TrueLove Invitation';

    const isEn = t('invitation.save_the_date') === 'Save The Date';
    const closingQuote = invitation?.closing_text || (isEn
        ? 'It is an honor and a happiness for us if you are willing to attend and give your blessings.'
        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan dukungan dan doa restu.');

    return (
        <section id="closing" className="ch-closing">
            <PitchDecoration />
            <div className="ch-container-inner">
                <Reveal className="ch-trophy-display">
                    <div className="ch-trophy-wrap">
                        <ChelseaInViteCrest size={80} />
                    </div>
                    <h2 className="ch-closing-header">{invitation?.closing_title || (isEn ? 'THANK YOU' : 'TERIMA KASIH')}</h2>
                    <p className="ch-closing-text">{closingQuote}</p>
                </Reveal>

                <Reveal delay={150} className="ch-family-tributes">
                    <h3 className="ch-tribute-header">{isEn ? 'FAMILIES' : 'KAMI YANG BERBAHAGIA'}</h3>
                    <div className="ch-family-row">
                        {hasGroomParents && (
                            <div className="ch-family-col">
                                <span className="ch-family-title">{isEn ? "Groom's Family" : "Keluarga Mempelai Pria"}</span>
                                <p className="ch-family-names">{isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}</p>
                            </div>
                        )}
                        {hasBrideParents && (
                            <div className="ch-family-col">
                                <span className="ch-family-title">{isEn ? "Bride's Family" : "Keluarga Mempelai Wanita"}</span>
                                <p className="ch-family-names">{isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}</p>
                            </div>
                        )}
                    </div>
                </Reveal>

                <div className="ch-watermark-wrap">
                    <p className="ch-watermark">Made with ❤️ by {brandName}</p>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   FLOATING MUSIC BUTTON
   ═══════════════════════════════════════ */
function MusicButton({ isPlaying, onToggle }) {
    return (
        <button type="button" className={`ch-music-btn${isPlaying ? ' is-playing' : ''}`} onClick={onToggle} aria-label="Toggle Music">
            {isPlaying ? (
                <div className="global-music-waves">
                    <span /><span /><span />
                </div>
            ) : (
                <i className="fas fa-music" />
            )}
        </button>
    );
}

/* ═══════════════════════════════════════
   CORE CONTENT CONTROLLER
   ═══════════════════════════════════════ */
function ChelseaInViteContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const { t, locale } = useTranslation();

    globalShowPhotos = !invitation?.hide_photos;
    globalShowAnimations = invitation?.show_animations !== false;

    const primaryEvent = useMemo(() => {
        return safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    }, [events]);

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = ['slide-h', 'slide-v'].includes(layoutMode);

    const [showQr, setShowQr] = useState(false);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const activeGuest = guest || null;

    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const [isOpened, setIsOpened] = useState(false);
    const [activeSection, setActiveSection] = useState('cover');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.height = '100vh';
            const preventTouchMove = (e) => {
                if (e.target.closest('.ch-cover__content')) return;
                e.preventDefault();
            };
            document.addEventListener('touchmove', preventTouchMove, { passive: false });
            return () => {
                document.body.style.overflow = isSlideMode ? 'hidden' : 'auto';
                document.body.style.height = '';
                document.documentElement.style.overflow = '';
                document.documentElement.style.height = '';
                document.removeEventListener('touchmove', preventTouchMove);
            };
        } else {
            document.body.style.overflow = isSlideMode ? 'hidden' : 'auto';
            document.body.style.height = '';
            document.documentElement.style.overflow = '';
            document.documentElement.style.height = '';
        }
    }, [isOpened, isSlideMode]);

    const activeSections = safeArr(sections);
    const hasRsvp = activeSections.some(s => s.section_key === 'rsvp');
    const resolvedSections = activeSections
        .filter(s => {
            if (s.section_key === 'wishes' && hasRsvp) return false;
            if (s.section_key === 'cover') return false;
            return true;
        })
        .sort((a, b) => {
            if (a.section_key === 'opening') return -1;
            if (b.section_key === 'opening') return 1;
            return (a.sort_order || 0) - (b.sort_order || 0);
        });

    const navSections = resolvedSections.map(s => ({
        section_key: s.section_key,
        section_name: s.section_name
    }));

    const navIcons = {
        opening: 'fas fa-book-open',
        bride_groom: 'fas fa-heart',
        countdown: 'fas fa-hourglass-start',
        love_story: 'fas fa-history',
        event: 'far fa-calendar-alt',
        livestream: 'fas fa-video',
        gallery: 'far fa-images',
        rsvp: 'fas fa-envelope',
        wishes: 'fas fa-comments',
        bank: 'fas fa-gift',
        closing: 'fas fa-door-open',
    };

    const handleOpen = () => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen();
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
    };

    // Scrollspy
    useEffect(() => {
        if (isSlideMode || !isOpened) return;
        const handleScroll = () => {
            let current = 'opening';
            for (const s of navSections) {
                const el = document.getElementById(s.section_key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.3) current = s.section_key;
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSlideMode, isOpened, navSections]);

    // Nav scroll to active (using scrollLeft - as per panduan)
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.ch-bottom-nav-inner');
        const activeBtn = document.getElementById(`ch-nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // Slide Sync
    useEffect(() => {
        if (!isSlideMode) return;
        const target = navSections[activeSlideIdx]?.section_key;
        if (target) {
            setActiveSection(target);
            const el = document.getElementById(target);
            if (el) el.scrollTop = 0;
        }
    }, [activeSlideIdx, isSlideMode]);

    const nextSlide = useCallback(() => {
        if (activeSlideIdx < navSections.length - 1) setActiveSlideIdx(prev => prev + 1);
    }, [activeSlideIdx, navSections.length]);

    const prevSlide = useCallback(() => {
        if (activeSlideIdx > 0) setActiveSlideIdx(prev => prev - 1);
    }, [activeSlideIdx]);

    const scrollToSection = (key) => {
        if (isSlideMode) {
            const idx = navSections.findIndex(s => s.section_key === key);
            if (idx !== -1) setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(key);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Auto Scroll
    useEffect(() => {
        if (!autoScrollEnabled || !isOpened) return;
        let iv;
        if (isSlideMode) {
            iv = setInterval(() => {
                const activeKey = navSections[activeSlideIdx]?.section_key;
                const activeEl = document.getElementById(activeKey);
                if (activeEl && activeEl.scrollHeight > activeEl.clientHeight) {
                    const isAtBottom = activeEl.scrollHeight - activeEl.clientHeight - activeEl.scrollTop <= 2;
                    if (!isAtBottom) { activeEl.scrollTop += 1; return; }
                }
                if (activeSlideIdx < navSections.length - 1) nextSlide();
                else setActiveSlideIdx(0);
            }, 30);
        } else {
            iv = setInterval(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (window.scrollY >= maxScroll - 2) window.scrollTo({ top: 0, behavior: 'smooth' });
                else window.scrollBy(0, 1);
            }, 35);
        }
        return () => clearInterval(iv);
    }, [autoScrollEnabled, isOpened, isSlideMode, activeSlideIdx, navSections, nextSlide]);

    // Pause auto scroll on user interaction
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        const handleUserInteraction = (e) => {
            if (e.target.closest('button, .ch-float-btn, .ch-bottom-nav, input, textarea, select')) return;
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

    // Touch/Swipe Controls
    const startX = useRef(0);
    const startY = useRef(0);
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = useCallback((cx, cy, target) => {
        if (target.closest('input, textarea, select, button, a')) return;
        startX.current = cx; startY.current = cy; isDragging.current = true;
    }, []);

    const handlePointerUp = useCallback((cx, cy) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diffX = cx - startX.current;
        const diffY = cy - startY.current;
        if (layoutMode === 'slide-h') {
            if (Math.abs(diffX) > 60) { if (diffX < 0) nextSlide(); else prevSlide(); }
        } else if (layoutMode === 'slide-v') {
            if (Math.abs(diffY) > 60) {
                const activeKey = navSections[activeSlideIdx]?.section_key;
                const activeEl = document.getElementById(activeKey);
                if (activeEl && activeEl.scrollHeight > activeEl.clientHeight) {
                    const isAtTop = activeEl.scrollTop <= 2;
                    const isAtBottom = activeEl.scrollHeight - activeEl.clientHeight - activeEl.scrollTop <= 2;
                    if (diffY < 0 && !isAtBottom) return;
                    if (diffY > 0 && !isAtTop) return;
                }
                if (diffY < 0) nextSlide(); else prevSlide();
            }
        }
    }, [layoutMode, activeSlideIdx, navSections, nextSlide, prevSlide]);

    const handleTouchStart = useCallback((e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target), [handlePointerDown]);
    const handleTouchEnd = useCallback((e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY), [handlePointerUp]);
    const handleMouseDown = useCallback((e) => handlePointerDown(e.clientX, e.clientY, e.target), [handlePointerDown]);
    const handleMouseUp = useCallback((e) => handlePointerUp(e.clientX, e.clientY), [handlePointerUp]);
    const handleMouseLeave = useCallback(() => { isDragging.current = false; }, []);

    const handleWheel = useCallback((e) => {
        if (!isSlideMode || scrollTimeout.current) return;
        const activeKey = navSections[activeSlideIdx]?.section_key;
        const activeEl = document.getElementById(activeKey);
        if (activeEl && activeEl.scrollHeight > activeEl.clientHeight) {
            const isAtTop = activeEl.scrollTop <= 2;
            const isAtBottom = activeEl.scrollHeight - activeEl.clientHeight - activeEl.scrollTop <= 2;
            if (e.deltaY > 0 && !isAtBottom) return;
            if (e.deltaY < 0 && !isAtTop) return;
        }
        scrollTimeout.current = setTimeout(() => { scrollTimeout.current = null; }, 800);
        if (e.deltaY > 0) nextSlide(); else prevSlide();
    }, [isSlideMode, activeSlideIdx, navSections, nextSlide, prevSlide]);

    // Component Map
    const componentMap = {
        opening: (
            <OpeningSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                scrollToSection={scrollToSection}
                loveStories={loveStories}
                galleries={galleries}
                enableRsvp={enableRsvp}
                enableWishes={enableWishes}
                bankAccounts={bankAccounts}
                events={events}
            />
        ),
        bride_groom: <BrideGroomSection invitation={invitation} brideGrooms={brideGrooms} />,
        love_story: <LoveStorySection loveStories={loveStories} />,
        event: <EventSection events={events} invitation={invitation} />,
        livestream: <LivestreamSection events={events} invitation={invitation} />,
        video: <VideoSection invitation={invitation} locale={locale} />,
        gallery: <GallerySection galleries={galleries} />,
        rsvp: (
            <UnifiedFormSection
                invitation={invitation}
                wishes={wishes}
                guest={guest}
                enableRsvp={enableRsvp}
                enableWishes={enableWishes}
            />
        ),
        wishes: (
            <UnifiedFormSection
                invitation={invitation}
                wishes={wishes}
                guest={guest}
                enableRsvp={false}
                enableWishes={enableWishes}
            />
        ),
        bank: <BankSection bankAccounts={bankAccounts} />,
        closing: <ClosingSection invitation={invitation} brideGrooms={brideGrooms} />,
    };

    const musicUrl = invitation?.music_url || null;

    return (
        <div className={`ch-body ${!globalShowAnimations ? 'ch-no-animations' : ''}`} id="main-scroll-container">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />

            {/* Ambient Blue Background Lights */}
            <div className="ch-ambient-bg">
                <div className="ch-ambient-blob ch-ambient-blob--blue" />
                <div className="ch-ambient-blob ch-ambient-blob--navy" />
                <div className="ch-ambient-blob ch-ambient-blob--cyan" />
            </div>

            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {musicUrl && <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />}

            {/* QR Modal */}
            {enableQr && showQr && activeGuest && (
                <div className="ch-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="ch-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="ch-qr-title">TIKET PRESENSI</h3>
                        <p className="ch-qr-guest">{activeGuest.name.toUpperCase()}</p>
                        <div className="ch-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1565c0&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                alt="Check-in QR" className="ch-qr-img"
                            />
                        </div>
                        <p className="ch-qr-hint">Scan QR untuk verifikasi kehadiran</p>
                        <button className="ch-btn-submit" onClick={() => setShowQr(false)}>TUTUP</button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation */}
            {isOpened && navSections.length > 0 && (
                <nav className="ch-bottom-nav">
                    <div className="ch-bottom-nav-inner">
                        {navSections.map(s => (
                            <button
                                key={s.section_key}
                                id={`ch-nav-btn-${s.section_key}`}
                                type="button"
                                data-key={s.section_key}
                                className={`ch-bottom-nav-item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' is-active' : ''}`}
                                onClick={() => scrollToSection(s.section_key)}
                                title={s.section_name}>
                                {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : <i className="fas fa-dot-circle" />}
                                <span className="ch-nav-lbl-text">{s.section_name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* Cover Section */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
                primaryEvent={primaryEvent}
            />

            {/* Floating Controls */}
            {isOpened && (
                <div className="ch-floating-controls">
                    {enableQr && activeGuest && (
                        <button type="button" className="ch-float-btn" onClick={() => setShowQr(true)} title="QR Ticket">
                            <i className="fas fa-qrcode" />
                        </button>
                    )}
                    <button
                        type="button"
                        className={`ch-float-btn${isFullscreen ? ' is-active' : ''}`}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                    </button>
                    {invitation?.enable_auto_scroll !== false && (
                        <button
                            type="button"
                            className={`ch-float-btn${autoScrollEnabled ? ' is-active' : ''}`}
                            onClick={() => setAutoScrollEnabled(prev => !prev)}
                            title={autoScrollEnabled ? "Pause Scroll" : "Auto Scroll"}
                        >
                            <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-play"} />
                        </button>
                    )}
                    {musicUrl && <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />}
                </div>
            )}

            {/* Main Content */}
            <div
                className={`ch-main${isOpened ? ' is-visible' : ''} ${isSlideMode ? 'ch-main--slide' : ''} ${layoutMode === 'slide-h' ? 'ch-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'ch-main--slide-v' : ''}`}
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
                        let slideClass = 'ch-slide-container';
                        if (idx === activeSlideIdx) slideClass += ' is-active';
                        else if (idx > activeSlideIdx) slideClass += ' is-next';
                        else slideClass += ' is-prev';

                        return (
                            <div key={s.section_key} className={slideClass} id={s.section_key} data-section={s.section_key}>
                                <div className="ch-slide-inner-scroll">
                                    {componentMap[s.section_key]}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={s.section_key} id={s.section_key} data-section={s.section_key} className="ch-scroll-section">
                            {componentMap[s.section_key]}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   EXPORT CORE WRAPPER
   ═══════════════════════════════════════ */
export default function ChelseaInViteTheme(props) {
    return (
        <ErrorBoundary>
            <ChelseaInViteContent {...props} />
        </ErrorBoundary>
    );
}
