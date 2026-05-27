import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import muLogoImage from './asset/mu-logo.jpg';

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
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

// Global flags to sync states
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
            <div className="mu-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema MU.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   SCROLL ANIMATION WRAPPER
   ═══════════════════════════════════════ */
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
        <div ref={ref} className={`${className} ${!globalShowAnimations ? '' : (visible ? 'mu-reveal--in' : 'mu-reveal--out')}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}>
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   PITCH BG DECORATION (Inline SVG)
   ═══════════════════════════════════════ */
function PitchDecoration() {
    return (
        <div className="mu-pitch-overlay">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Border line */}
                <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
                {/* Center line */}
                <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
                {/* Center circle */}
                <circle cx="50%" cy="50%" r="15%" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
                {/* Penalty areas */}
                <rect x="25%" y="5%" width="50%" height="12%" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" />
                <rect x="25%" y="83%" width="50%" height="12%" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="2" />
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION (VIP Match Ticket)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    
    const guestName = guest?.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Bimo & Raras');

    return (
        <div className={`mu-cover${isOpened ? ' is-opened' : ''} ${!globalShowPhotos ? 'mu-no-photo-mode' : ''}`}>
            {globalShowPhotos && invitation?.cover_image && (
                <PremiumSlideshow
                    images={invitation.cover_image.split(',')}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="mu-cover__bg"
                    imgClassName="absolute inset-0 w-full h-full object-cover opacity-35"
                />
            )}
            <PitchDecoration />
            <div className="mu-cover__overlay" />
            
            <div className="mu-cover__content">
                {/* Spotlights */}
                <div className="mu-spotlight mu-spotlight--left" />
                <div className="mu-spotlight mu-spotlight--right" />
                
                {/* Logo Header */}
                <div className="mu-logo-main-wrap">
                    <img src={muLogoImage} alt="Invitation Wedding Of Logo" className="mu-logo-main" />
                </div>

                {/* Ticket Header */}
                <div className="mu-ticket-header">
                    <span className="mu-ticket-badge">VIP MATCH TICKET</span>
                    <span className="mu-ticket-serial">NO: MU-{String(invitation?.id || 99).padStart(4, '0')}</span>
                </div>
                
                {/* Main Ticket Card */}
                <div className="mu-ticket-card">
                    <div className="mu-ticket-stub-left">
                        <div className="mu-club-crest">
                            <img src={muLogoImage} alt="MU Crest" className="mu-crest-img" />
                        </div>
                        <div className="mu-ticket-divider" />
                    </div>

                    <div className="mu-ticket-main">
                        <h2 className="mu-stadium-label">THEATRE OF DREAMS • OLD TRAFFORD</h2>
                        <h1 className="mu-match-title">{coupleName.toUpperCase()}</h1>
                        <p className="mu-match-date">
                            {invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date.substring(0, 10)).toUpperCase() : 'DECEMBER 2026'}
                        </p>
                        
                        {/* Seat information details */}
                        <div className="mu-seat-details">
                            <div>
                                <span>STAND</span>
                                <strong>SIR ALEX FERGUSON</strong>
                            </div>
                            <div>
                                <span>ROW</span>
                                <strong>FOREVER</strong>
                            </div>
                            <div>
                                <span>SEAT</span>
                                <strong>TOGETHER</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guest Ticket Section */}
                <div className="mu-ticket-guest">
                    <div className="mu-barcode-wrap">
                        <div className="mu-barcode" />
                        <span className="mu-barcode-text">GUEST ACCESS: {guestName ? guestName.toUpperCase() : 'VIP SUPPORTER'}</span>
                    </div>
                    <p className="mu-guest-label">{t('invitation.dear_guest')}</p>
                    <h3 className="mu-guest-name">{guestName || 'Tamu Undangan'}</h3>
                    <p className="mu-guest-desc">{t('invitation.dear_guest_desc')}</p>
                </div>

                <button onClick={onOpen} id="tombol-buka" className="mu-btn-kickoff">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="mu-btn-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    KICK-OFF MATCH
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (Jumbotron Scoreboard)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, scrollToSection, loveStories, galleries, enableRsvp, enableWishes, bankAccounts, events, id }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const groomNickname = groom.nickname || 'GROOM';
    const brideNickname = bride.nickname || 'BRIDE';
    const coupleName = `${groomNickname} & ${brideNickname}`;

    const groomPhoto = getStorageUrl(groom.photo, null);
    const bridePhoto = getStorageUrl(bride.photo, null);

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const countdownTarget = primaryEvent?.event_date || '';

    return (
        <section id={id || "opening"} className="mu-opening">
            <PitchDecoration />
            <div className="mu-container-inner">
                {/* Jumbotron Scoreboard */}
                <Reveal className="mu-scoreboard">
                    {/* Retro CRT Grid Mesh */}
                    <div className="mu-scoreboard-scanlines" />
                    
                    {/* Scoreboard Broadcast Header */}
                    <div className="mu-scoreboard-header-premium">
                        <div className="mu-live-indicator">
                            <span className="mu-live-dot-premium" />
                            <span>LIVE</span>
                        </div>
                        <div className="mu-match-center-title">THE WEDDING CHAMPIONSHIP</div>
                        <div className="mu-match-time-premium">
                            <span className="mu-clock-icon">⏱️</span>
                            <span className="mu-clock-time">90:00+</span>
                        </div>
                    </div>
                    
                    {/* Head-to-Head Tactical Squad Cards */}
                    <div className="mu-scoreboard-matchup-premium">
                        {/* Groom Tactical Sports Card */}
                        <div className="mu-matchup-card groom-card animate-float-slow">
                            <div className="mu-card-crest-glow" />
                            <div className="mu-card-inner">
                                <div className="mu-card-header">
                                    <span className="mu-card-rating">99</span>
                                    <span className="mu-card-pos">GR</span>
                                </div>
                                <div className="mu-card-photo-wrap">
                                    {globalShowPhotos && groomPhoto ? (
                                        <img src={groomPhoto} alt={groomNickname} className="mu-card-photo" />
                                    ) : (
                                        <div className="mu-card-monogram">{groomNickname.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="mu-card-info">
                                    <h4 className="mu-card-name">{groomNickname.toUpperCase()}</h4>
                                    <span className="mu-card-role">FORWARD / GROOM</span>
                                </div>
                                <div className="mu-card-stats">
                                    <div className="mu-stat-row">
                                        <span>❤️ PAS</span><strong>99</strong>
                                    </div>
                                    <div className="mu-stat-row">
                                        <span>🤝 LOY</span><strong>99</strong>
                                    </div>
                                    <div className="mu-stat-row">
                                        <span>🔥 COM</span><strong>99</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* VS Score Display */}
                        <div className="mu-scoreboard-vs-premium">
                            <div className="mu-score-row">
                                <span className="mu-score-digit neon-red">9</span>
                                <span className="mu-score-divider">-</span>
                                <span className="mu-score-digit neon-gold">10</span>
                            </div>
                            <div className="mu-score-badge">LOVE SCORE</div>
                            <div className="mu-scorer-list">
                                <i className="fas fa-heartbeat animate-pulse" /> ETERNAL LOYALTY
                            </div>
                        </div>

                        {/* Bride Tactical Sports Card */}
                        <div className="mu-matchup-card bride-card animate-float-slow">
                            <div className="mu-card-crest-glow" />
                            <div className="mu-card-inner">
                                <div className="mu-card-header">
                                    <span className="mu-card-rating">99</span>
                                    <span className="mu-card-pos">BR</span>
                                </div>
                                <div className="mu-card-photo-wrap">
                                    {globalShowPhotos && bridePhoto ? (
                                        <img src={bridePhoto} alt={brideNickname} className="mu-card-photo" />
                                    ) : (
                                        <div className="mu-card-monogram">{brideNickname.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="mu-card-info">
                                    <h4 className="mu-card-name">{brideNickname.toUpperCase()}</h4>
                                    <span className="mu-card-role">MIDFIELDER / BRIDE</span>
                                </div>
                                <div className="mu-card-stats">
                                    <div className="mu-stat-row">
                                        <span>❤️ CHM</span><strong>99</strong>
                                    </div>
                                    <div className="mu-stat-row">
                                        <span>✨ KND</span><strong>99</strong>
                                    </div>
                                    <div className="mu-stat-row">
                                        <span>😊 SML</span><strong>99</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mu-scoreboard-footer-premium">
                        <i className="fas fa-trophy" /> SIR ALEX FERGUSON STAND • THEATRE OF DREAMS
                    </div>
                    
                    {/* Integrated Countdown Timer */}
                    {countdownTarget && (
                        <div className="mu-scoreboard-countdown-premium">
                            <CountdownTimer targetDate={countdownTarget} />
                        </div>
                    )}
                </Reveal>

                {/* Intro Box with nice Stadium program look */}
                <Reveal delay={100} className="mu-intro-box-premium">
                    <div className="mu-intro-box-header">
                        <span className="mu-intro-badge">OFFICIAL MATCHDAY PROGRAMME</span>
                    </div>
                    <div className="mu-intro-box-body">
                        <span className="mu-title-badge-premium">{t('invitation.wedding_of').toUpperCase()}</span>
                        <h2 className="mu-title-gold-premium">{coupleName.toUpperCase()}</h2>
                        
                        {/* Premium Intro Slideshow */}
                        {globalShowPhotos && invitation?.opening_image && (
                            <div className="mu-opening-slideshow-wrap-premium">
                                <PremiumSlideshow
                                    images={invitation.opening_image.split(',')}
                                    positionX={invitation?.opening_position_x}
                                    positionY={invitation?.opening_position_y}
                                    zoom={invitation?.opening_zoom}
                                    className="mu-opening-slideshow"
                                />
                            </div>
                        )}

                        {invitation?.opening_ayat && (
                            <div className="mu-ayat-box">
                                <i className="fas fa-quote-left mu-quote-icon" />
                                <p className="mu-ayat-premium">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                                {invitation?.opening_ayat_source && (
                                    <span className="mu-ayat-src-premium">&mdash; {invitation.opening_ayat_source}</span>
                                )}
                            </div>
                        )}
                        
                        <p className="mu-text-premium">
                            {invitation?.opening_text || "Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan mendoakan kelancaran pernikahan kami."}
                        </p>
                    </div>
                </Reveal>

                {/* Sport Navigation Menu */}
                <Reveal delay={200} className="mu-opening-nav-premium">
                    {scrollToSection ? (
                        <>
                            <button type="button" onClick={() => scrollToSection('bride_groom')} className="mu-nav-pill-premium"><i className="fas fa-users-cog" /> {t('nav.mempelai')}</button>
                            <button type="button" onClick={() => scrollToSection('event')} className="mu-nav-pill-premium"><i className="fas fa-map-marked-alt" /> {t('nav.acara')}</button>
                            {loveStories?.length > 0 && <button type="button" onClick={() => scrollToSection('love_story')} className="mu-nav-pill-premium"><i className="fas fa-heart-broken" /> {t('invitation.love_story')}</button>}
                            {galleries?.length > 0 && <button type="button" onClick={() => scrollToSection('gallery')} className="mu-nav-pill-premium"><i className="fas fa-photo-video" /> {t('invitation.gallery')}</button>}
                            {enableRsvp && <button type="button" onClick={() => scrollToSection('rsvp')} className="mu-nav-pill-premium"><i className="fas fa-paper-plane" /> {t('nav.rsvp')}</button>}
                            {enableWishes && <button type="button" onClick={() => scrollToSection('wishes')} className="mu-nav-pill-premium"><i className="fas fa-comments" /> {t('invitation.wishes_title')}</button>}
                            {bankAccounts?.length > 0 && <button type="button" onClick={() => scrollToSection('bank')} className="mu-nav-pill-premium"><i className="fas fa-gift" /> {t('nav.hadiah')}</button>}
                        </>
                    ) : (
                        <>
                            <a href="#bride_groom" className="mu-nav-pill-premium"><i className="fas fa-users-cog" /> {t('nav.mempelai')}</a>
                            <a href="#event" className="mu-nav-pill-premium"><i className="fas fa-map-marked-alt" /> {t('nav.acara')}</a>
                            <a href="#love_story" className="mu-nav-pill-premium"><i className="fas fa-heart-broken" /> {t('invitation.love_story')}</a>
                            <a href="#gallery" className="mu-nav-pill-premium"><i className="fas fa-photo-video" /> {t('invitation.gallery')}</a>
                            <a href="#rsvp" className="mu-nav-pill-premium"><i className="fas fa-paper-plane" /> {t('nav.rsvp')}</a>
                            <a href="#wishes" className="mu-nav-pill-premium"><i className="fas fa-comments" /> {t('invitation.wishes_title')}</a>
                            <a href="#bank" className="mu-nav-pill-premium"><i className="fas fa-gift" /> {t('nav.hadiah')}</a>
                        </>
                    )}
                </Reveal>

                {invitation?.video_url && (
                    <Reveal delay={300} className="mu-video-container-premium">
                        <iframe
                            src={invitation.video_url.includes('watch?v=')
                                ? invitation.video_url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'
                                : invitation.video_url}
                            title="Wedding Intro Video" frameBorder="0"
                            allowFullScreen allow="autoplay; encrypted-media"
                        />
                    </Reveal>
                )}
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

    function PlayerCard({ person, side, number, pos }) {
        if (!person) return null;
        const photo = getStorageUrl(person.photo, null);
        const nameInitials = (person.nickname || person.full_name || 'X')
            .split(' ')
            .map(w => w.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);

        const isWanita = person.gender === 'wanita' || person.gender === 'female' || String(person.gender).toLowerCase() === 'wanita' || String(person.gender).toLowerCase() === 'female';
        return (
            <Reveal className={`mu-player-card mu-player-card--${side}`} delay={side === 'left' ? 0 : 200}>
                {/* Back Shirt Number Overlay */}
                <div className="mu-player-shirt-num">{number}</div>
                
                {/* Player Profile Image/Avatar */}
                {globalShowPhotos && photo ? (
                    <div className="mu-player-photo-wrap">
                        <img src={photo} alt={person.full_name} className="mu-player-photo" />
                    </div>
                ) : (
                    <div className="mu-player-monogram">
                        <span className="mu-monogram-initials">{nameInitials}</span>
                        <span className="mu-monogram-jersey">{number}</span>
                    </div>
                )}
                
                <div className="mu-player-meta">
                    <span className="mu-player-badge">
                        <i className="fas fa-check-circle mu-verified-icon" /> {isWanita ? (locale === 'en' ? 'BRIDE / ARTIST' : 'MEMPELAI WANITA') : (locale === 'en' ? 'GROOM / ARTIST' : 'MEMPELAI PRIA')}
                    </span>
                    <h3 className="mu-player-name">{person.full_name}</h3>
                    <p className="mu-player-child-order">
                        {translateChildOrder(person.child_order, person.gender) || 
                         (person.gender === 'wanita' ? t('invitation.daughter_of') : t('invitation.son_of'))}
                    </p>
                    <p className="mu-player-parents">
                        {[person.father_name, person.mother_name].filter(Boolean).join(' & ') || person.parents_name || ''}
                    </p>
                    
                    {person.instagram && (
                        <a href={`https://www.instagram.com/${person.instagram.replace('@','')}`}
                            target="_blank" rel="noreferrer" className="mu-player-ig">
                            <i className="fab fa-instagram" /> Instagram
                        </a>
                    )}
                </div>
            </Reveal>
        );
    }

    return (
        <section id={id || "bride_groom"} className="mu-bridegroom">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">KEY PLAYERS</span>
                        MATCHDAY LINEUP
                    </h2>
                </Reveal>

                <div className="mu-lineup-row">
                    <PlayerCard person={groom} side="left" number="09" pos="FORWARD (GROOM)" />
                    <div className="mu-lineup-vs">VS</div>
                    <PlayerCard person={bride} side="right" number="10" pos="MIDFIELDER (BRIDE)" />
                </div>
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

    return (
        <div className="mu-countdown">
            <div className="mu-countdown-grid">
                <div className="mu-countdown-box">
                    <span className="mu-countdown-val">{pad2(cd.d)}</span>
                    <span className="mu-countdown-lbl">{t('invitation.days')?.toUpperCase() || 'DAYS'}</span>
                </div>
                <div className="mu-countdown-divider">:</div>
                <div className="mu-countdown-box">
                    <span className="mu-countdown-val">{pad2(cd.h)}</span>
                    <span className="mu-countdown-lbl">{t('invitation.hours')?.toUpperCase() || 'HOURS'}</span>
                </div>
                <div className="mu-countdown-divider">:</div>
                <div className="mu-countdown-box">
                    <span className="mu-countdown-val">{pad2(cd.m)}</span>
                    <span className="mu-countdown-lbl">{t('invitation.minutes')?.toUpperCase() || 'MINS'}</span>
                </div>
                <div className="mu-countdown-divider">:</div>
                <div className="mu-countdown-box">
                    <span className="mu-countdown-val">{pad2(cd.s)}</span>
                    <span className="mu-countdown-lbl">SECS</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   STANDALONE COUNTDOWN / JUMBOTRON KICKOFF
   ═══════════════════════════════════════ */
function CountdownSection({ events, id }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    if (!primaryEvent?.event_date) return null;

    return (
        <section id={id || "countdown"} className="mu-countdown-section">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">KICK-OFF SCHEDULE</span>
                        COUNTDOWN TO SHIELD
                    </h2>
                </Reveal>
                <Reveal delay={150} className="mu-countdown-wrapper">
                    <div className="mu-jumbotron-led">
                        <CountdownTimer targetDate={primaryEvent.event_date} />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (Match Timeline)
   ═══════════════════════════════════════ */
function TimelineEvent({ story, index }) {
    const ref = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsActive(entry.isIntersecting);
        }, {
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const isEven = index % 2 === 0;
    return (
        <div ref={ref} className={`mu-timeline-node ${isEven ? 'mu-timeline-node--left' : 'mu-timeline-node--right'} ${isActive ? 'is-active' : ''}`}>
            <div className="mu-timeline-card">
                <div className="mu-timeline-minute">
                    {index === 0 ? "10'" : index === 1 ? "45'" : index === 2 ? "90'" : "120'"}
                </div>
                <div className="mu-timeline-details">
                    <span className="mu-timeline-badge">{story.title || `MATCH EVENT ${index+1}`}</span>
                    {story.story_date && <span className="mu-timeline-date">{formatStoryDate(story.story_date)}</span>}
                    <p className="mu-timeline-desc">{story.description || story.story}</p>
                </div>
            </div>
        </div>
    );
}

function LoveStorySection({ loveStories, id }) {
    const stories = safeArr(loveStories);
    if (stories.length === 0) return null;

    return (
        <section id={id || "love_story"} className="mu-love-story">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">MATCH TIMELINE</span>
                        KEY MOMENTS OF LOVE
                    </h2>
                </Reveal>
                
                <div className="mu-timeline-track">
                    {stories.map((s, idx) => (
                        <TimelineEvent key={idx} story={s} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT SECTION (Match Fixtures)
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
        <section id="event" className="mu-events">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">MATCH FIXTURES</span>
                        THE WEDDING SCHEDULE
                    </h2>
                </Reveal>

                <div className="mu-events-list">
                    {safeEvents.map((ev, idx) => {
                        const evDate = ev.event_date || ev.date;
                        const d = evDate ? new Date(evDate) : null;
                        const isAkad = ev.event_name?.toLowerCase().includes('akad');

                        return (
                            <Reveal key={idx} delay={idx * 100} className="mu-event-fixture">
                                <div className="mu-fixture-header">
                                    <span className="mu-fixture-leg">{isAkad ? 'LEG 1' : 'LEG 2'}</span>
                                    <span className="mu-fixture-title">{ev.event_name || 'Wedding Match'}</span>
                                </div>
                                <div className="mu-fixture-body">
                                    {d && (
                                        <div className="mu-fixture-date">
                                            <i className="far fa-calendar" />
                                            <span>{d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                    {ev.start_time && (
                                        <div className="mu-fixture-time">
                                            <i className="far fa-clock" />
                                            <span>{formatTime(ev.start_time)} {ev.end_time && ev.end_time !== 'Selesai' ? ` - ${formatTime(ev.end_time)}` : ''} {ev.timezone || 'WIB'}</span>
                                        </div>
                                    )}
                                    {ev.venue_name && (
                                        <div className="mu-fixture-venue">
                                            <i className="fas fa-location-arrow" />
                                            <strong>{ev.venue_name}</strong>
                                        </div>
                                    )}
                                    {ev.venue_address && <p className="mu-fixture-address">{ev.venue_address}</p>}
                                </div>
                                <div className="mu-fixture-footer">
                                    {ev.gmaps_link && (
                                        <a href={ev.gmaps_link} target="_blank" rel="noreferrer" className="mu-btn-card">
                                            <i className="fas fa-map-marker-alt" /> GET DIRECTIONS
                                        </a>
                                    )}
                                    <a href={getCalUrl(ev)} target="_blank" rel="noreferrer" className="mu-btn-card mu-btn-card--secondary">
                                        <i className="far fa-calendar-plus" /> ADD TO CALENDAR
                                    </a>
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
        <section className="mu-livestream" id="livestream">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">BROADCASTING</span>
                        {isEn ? 'LIVE STREAMING' : 'SIARAN LANGSUNG'}
                    </h2>
                    <p className="mu-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
                </Reveal>
                
                <Reveal delay={150} className="mu-livestream-panel">
                    <div className="mu-broadcast-symbol">
                        <div className="mu-live-beacon" />
                        <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                        </svg>
                    </div>
                    <div className="mu-streams-list">
                        {streamsList.map((stream, idx) => (
                            <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="mu-btn-broadcast">
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
   GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries }) {
    const safeGalleries = safeArr(galleries);
    if (safeGalleries.length === 0 || !globalShowPhotos) return null;

    return (
        <section id="gallery" className="mu-gallery">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">MATCH GALLERY</span>
                        CAPTURED MOMENTS
                    </h2>
                </Reveal>
                
                <div className="mu-gallery-grid">
                    {safeGalleries.map((g, idx) => {
                        const src = getStorageUrl(g.image_url, null);
                        return (
                            <Reveal key={idx} delay={(idx % 6) * 60} className="mu-gallery-item">
                                <img src={src} alt={`Gallery ${idx + 1}`} loading="lazy" />
                                {g.caption && <div className="mu-gallery-caption">{g.caption}</div>}
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BANK / TRANSFER WINDOW
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
        Object.assign(textArea.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '2em',
            height: '2em',
            padding: '0',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent'
        });
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

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
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    return (
        <section id={id || "bank"} className="mu-bank">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">SPONSORSHIP & FUNDING</span>
                        TRANSFER WINDOW
                    </h2>
                    <p className="mu-subtitle">{t('invitation.gift_desc')}</p>
                </Reveal>

                <div className="mu-bank-cards">
                    {accounts.map((acc, idx) => (
                        <Reveal key={idx} delay={idx * 100} className="mu-bank-card">
                            <div className="mu-bank-crest-bg" />
                            <div className="mu-bank-card-header">
                                <span className="mu-bank-name">{acc.bank_name}</span>
                                <span className="mu-bank-chip" />
                            </div>
                            <div className="mu-bank-card-body">
                                <h3 className="mu-bank-number">{acc.account_number}</h3>
                                <p className="mu-bank-holder">A.N. {acc.account_holder || acc.account_name}</p>
                            </div>
                            <div className="mu-bank-card-footer">
                                <button className="mu-btn-copy" onClick={() => copy(acc.account_number, idx)}>
                                    {copiedIdx === idx ? '✓ COPIED' : 'COPY BANK NUMBER'}
                                </button>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES (Supporters Zone)
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

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="mu-rsvp">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal>
                    <h2 className="mu-section-title">
                        <span className="mu-title-badge">SUPPORTERS CLUB</span>
                        ATTENDANCE REGISTRATION
                    </h2>
                </Reveal>

                <div className="mu-rsvp-container">
                    {/* Form Panel */}
                    <Reveal className="mu-rsvp-form-panel">
                        {success ? (
                            <div className="mu-form-success">
                                <div className="mu-trophy-symbol">🏆</div>
                                <h3>CONGRATULATIONS!</h3>
                                <p>Konfirmasi kehadiran supporter berhasil dikirim ke database pertandingan pernikahan.</p>
                                <button onClick={() => setSuccess(false)} className="mu-btn-ticket-submit">SUBMIT ANOTHER RESPONSE</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mu-rsvp-form">
                                <div className="mu-form-group">
                                    <label>SUPPORTER NAME</label>
                                    <input
                                        type="text"
                                        value={sharedName}
                                        onChange={e => setSharedName(e.target.value)}
                                        required
                                        placeholder="Enter full name"
                                        className="mu-form-input"
                                    />
                                </div>
                                
                                {enableRsvp && (
                                    <>
                                        <div className="mu-form-group">
                                            <label>MATCH ATTENDANCE</label>
                                            <select
                                                value={attendance}
                                                onChange={e => setAttendance(e.target.value)}
                                                className="mu-form-select"
                                            >
                                                <option value="hadir">{isEn ? 'Attending Leg 1 & 2' : 'Hadir Kedua Leg'}</option>
                                                <option value="tidak_hadir">{isEn ? 'Absent / Not Attending' : 'Absen / Tidak Hadir'}</option>
                                                <option value="masih_ragu">{isEn ? 'Undecided / Maybe' : 'Belum Pasti / Ragu'}</option>
                                            </select>
                                        </div>
                                        
                                        {attendance === 'hadir' && (
                                            <div className="mu-form-group">
                                                <label>NUMBER OF TICKETS (PAX)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={numGuests}
                                                    onChange={e => setNumGuests(parseInt(e.target.value) || 1)}
                                                    className="mu-form-input"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {enableWishes && (
                                    <div className="mu-form-group">
                                        <label>SUPPORTERS DOAS & TRIBUTES</label>
                                        <textarea
                                            rows="4"
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder="Write your wishes for the couple..."
                                            className="mu-form-textarea"
                                        />
                                    </div>
                                )}

                                <button type="submit" disabled={isSubmitting} className="mu-btn-ticket-submit">
                                    {isSubmitting ? 'TRANSMITTING...' : 'BOOK MATCH TICKETS'}
                                </button>
                            </form>
                        )}
                    </Reveal>

                    {/* Wishes Feed */}
                    {enableWishes && (
                        <Reveal delay={150} className="mu-rsvp-wishes-panel">
                            <h3 className="mu-feed-title">SUPPORTERS RECENT TRIBUTES</h3>
                            <div className="mu-wishes-feed">
                                {recentWishes.length === 0 ? (
                                    <p className="mu-no-wishes">No tributes submitted yet. Be the first to tribute!</p>
                                ) : (
                                    recentWishes.map((w, idx) => (
                                        <div key={idx} className="mu-wish-bubble">
                                            <div className="mu-wish-header">
                                                <span className="mu-supporter-badge">SUPPORTER</span>
                                                <strong className="mu-wish-sender">{w.sender_name}</strong>
                                            </div>
                                            <p className="mu-wish-msg">{w.message}</p>
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
   CLOSING SECTION (Trophy Presentation)
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

    return (
        <section id="closing" className="mu-closing">
            <PitchDecoration />
            <div className="mu-container-inner">
                <Reveal className="mu-trophy-display">
                    <div className="mu-trophy-shield">🏆</div>
                    <h2 className="mu-closing-header">{invitation?.closing_title || 'THANK YOU'}</h2>
                    <p className="mu-closing-text">
                        {invitation?.closing_text || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami."}
                    </p>
                </Reveal>

                {/* Family signatures */}
                <Reveal delay={150} className="mu-family-tributes">
                    <h3 className="mu-tribute-header">FAMILY TRIBUTES</h3>
                    <div className="mu-family-row">
                        {hasGroomParents && (
                            <div className="mu-family-col">
                                <span className="mu-family-title">{isEn ? "Groom's Family" : "Keluarga Mempelai Pria"}</span>
                                <p className="mu-family-names">{isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}</p>
                            </div>
                        )}
                        {hasBrideParents && (
                            <div className="mu-family-col">
                                <span className="mu-family-title">{isEn ? "Bride's Family" : "Keluarga Mempelai Wanita"}</span>
                                <p className="mu-family-names">{isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}</p>
                            </div>
                        )}
                    </div>
                </Reveal>

                {/* Watermark */}
                <div className="mu-watermark-wrap">
                    <p className="mu-watermark">
                        Made with ❤️ by {brandName}
                    </p>
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
        <button type="button" className={`mu-music-btn${isPlaying ? ' is-playing' : ''}`} onClick={onToggle} aria-label="Toggle Music">
            {isPlaying ? (
                <div className="mu-music-waves">
                    <span />
                    <span />
                    <span />
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
function ManchesterUnitedThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const { t } = useTranslation();
    
    // Global animation control overrides
    globalShowPhotos = !invitation?.hide_photos;
    globalShowAnimations = invitation?.show_animations !== false;

    // Layout configuration
    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = ['slide-h', 'slide-v'].includes(layoutMode);
    
    // QR Code state
    const [showQr, setShowQr] = useState(false);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const activeGuest = guest || null;

    // Audio ref setup
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Dynamic state management
    const [isOpened, setIsOpened] = useState(false);
    const [activeSection, setActiveSection] = useState('cover');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

    // Filter duplicate wishes / rsvp sections and keep 'opening' sorted first
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
        section_name: s.section_key === 'opening' ? (t('nav.opening') || 'Opening') : s.section_name
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

    // Auto-Fullscreen & opening trigger
    const handleOpen = () => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    // Fullscreen toggler
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
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    // Scroll listener for active Section (Scrollspy)
    useEffect(() => {
        if (isSlideMode || !isOpened) return;
        
        const handleScroll = () => {
            let current = 'opening';
            for (const s of navSections) {
                const el = document.getElementById(s.section_key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.3) {
                        current = s.section_key;
                    }
                }
            }
            setActiveSection(current);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSlideMode, isOpened, navSections]);

    // Slides Mode Progression Sync
    useEffect(() => {
        if (!isSlideMode) return;
        const target = navSections[activeSlideIdx]?.section_key;
        if (target) {
            setActiveSection(target);
            const el = document.getElementById(target);
            if (el) el.scrollTop = 0;
        }
    }, [activeSlideIdx, isSlideMode]);

    // Auto-scroll active menu item into viewport (centered)
    useEffect(() => {
        if (!activeSection) return;
        const activeEl = document.querySelector(`.mu-bottom-nav-inner button[data-key="${activeSection}"]`);
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeSection]);

    const nextSlide = useCallback(() => {
        if (activeSlideIdx < navSections.length - 1) {
            setActiveSlideIdx(prev => prev + 1);
        }
    }, [activeSlideIdx, navSections.length]);

    const prevSlide = useCallback(() => {
        if (activeSlideIdx > 0) {
            setActiveSlideIdx(prev => prev - 1);
        }
    }, [activeSlideIdx]);

    const scrollToSection = (key) => {
        if (isSlideMode) {
            const idx = navSections.findIndex(s => s.section_key === key);
            if (idx !== -1) setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(key);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // Auto Scroll Logic (Pixel-by-pixel or slide progression)
    useEffect(() => {
        if (!autoScrollEnabled || !isOpened) return;

        let iv;
        if (isSlideMode) {
            // Slide Auto Progression
            iv = setInterval(() => {
                const activeKey = navSections[activeSlideIdx]?.section_key;
                const activeEl = document.getElementById(activeKey);
                if (activeEl && activeEl.scrollHeight > activeEl.clientHeight) {
                    // Internal scroll first
                    const isAtBottom = activeEl.scrollHeight - activeEl.clientHeight - activeEl.scrollTop <= 2;
                    if (!isAtBottom) {
                        activeEl.scrollTop += 1;
                        return;
                    }
                }
                // Progression to next slide
                if (activeSlideIdx < navSections.length - 1) {
                    nextSlide();
                } else {
                    setActiveSlideIdx(0); // Restart
                }
            }, 30);
        } else {
            // Vertical Scroll Mode
            iv = setInterval(() => {
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (window.scrollY >= maxScroll - 2) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.scrollBy(0, 1);
                }
            }, 35);
        }

        return () => clearInterval(iv);
    }, [autoScrollEnabled, isOpened, isSlideMode, activeSlideIdx, navSections, nextSlide]);

    // Touch and Gesture Controls for Slider Modes
    const startX = useRef(0);
    const startY = useRef(0);
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);

    const handlePointerDown = useCallback((cx, cy, target) => {
        if (target.closest('input, textarea, select, button, a')) return;
        startX.current = cx;
        startY.current = cy;
        isDragging.current = true;
    }, []);

    const handlePointerUp = useCallback((cx, cy) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diffX = cx - startX.current;
        const diffY = cy - startY.current;

        if (layoutMode === 'slide-h') {
            if (Math.abs(diffX) > 60) {
                if (diffX < 0) nextSlide();
                else prevSlide();
            }
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
                if (diffY < 0) nextSlide();
                else prevSlide();
            }
        }
    }, [layoutMode, activeSlideIdx, navSections, nextSlide, prevSlide]);

    const handleTouchStart = useCallback((e) => {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    }, [handlePointerDown]);

    const handleTouchEnd = useCallback((e) => {
        handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, [handlePointerUp]);

    const handleMouseDown = useCallback((e) => {
        handlePointerDown(e.clientX, e.clientY, e.target);
    }, [handlePointerDown]);

    const handleMouseUp = useCallback((e) => {
        handlePointerUp(e.clientX, e.clientY);
    }, [handlePointerUp]);

    const handleMouseLeave = useCallback(() => {
        isDragging.current = false;
    }, []);

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

        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800);

        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    }, [isSlideMode, activeSlideIdx, navSections, nextSlide, prevSlide]);

    // Setup Render Components Map
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
        bride_groom: <BrideGroomSection invitation={invitation} brideGrooms={brideGrooms} events={events} />,
        countdown: <CountdownSection events={events} />,
        love_story: <LoveStorySection loveStories={loveStories} />,
        event: <EventSection events={events} invitation={invitation} />,
        livestream: <LivestreamSection events={events} invitation={invitation} />,
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
        <div className={`mu-body ${!globalShowAnimations ? 'mu-no-animations' : ''}`} id="main-scroll-container">
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
            
            {/* Ambient Background Lights */}
            <div className="mu-ambient-bg">
                <div className="mu-ambient-blob mu-ambient-blob--red" />
                <div className="mu-ambient-blob mu-ambient-blob--gold" />
                <div className="mu-ambient-blob mu-ambient-blob--dark" />
            </div>

            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {musicUrl && (
                <audio ref={audioRef} loop preload="auto" playsInline src={musicUrl} />
            )}

            {/* QR Code Overlay */}
            {enableQr && showQr && activeGuest && (
                <div className="mu-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="mu-qr-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="mu-qr-title">MATCH TICKET PRESENSI</h3>
                        <p className="mu-qr-guest">{activeGuest.name.toUpperCase()}</p>
                        <div className="mu-qr-img-wrap">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=da020e&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                alt="Check-in QR" className="mu-qr-img"
                            />
                        </div>
                        <p className="mu-qr-hint">Scan at the gate for entry verification</p>
                        <button className="mu-btn-ticket-submit" onClick={() => setShowQr(false)}>CLOSE PASS</button>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            {isOpened && navSections.length > 0 && (
                <nav className="mu-bottom-nav">
                    <div className="mu-bottom-nav-inner">
                        {navSections.map(s => (
                            <button key={s.section_key}
                                type="button"
                                data-key={s.section_key}
                                className={`mu-bottom-nav-item${activeSection === s.section_key || (s.section_key === 'rsvp' && activeSection === 'wishes') ? ' is-active' : ''}`}
                                onClick={() => scrollToSection(s.section_key)}
                                title={s.section_name}>
                                {navIcons[s.section_key] ? <i className={navIcons[s.section_key]} /> : <i className="fas fa-dot-circle" />}
                                <span className="mu-nav-lbl-text">{s.section_name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* VIP Cover Section */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
            />

            {/* Floating Action Controls */}
            {isOpened && (
                <div className="mu-floating-controls">
                    {enableQr && activeGuest && (
                        <button type="button" className="mu-float-btn" onClick={() => setShowQr(true)} title="QR Ticket">
                            <i className="fas fa-qrcode" />
                        </button>
                    )}
                    <button
                        type="button"
                        className={`mu-float-btn${isFullscreen ? ' is-active' : ''}`}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                    </button>
                    {invitation?.enable_auto_scroll !== false && (
                        <button
                            type="button"
                            className={`mu-float-btn${autoScrollEnabled ? ' is-active' : ''}`}
                            onClick={() => setAutoScrollEnabled(prev => !prev)}
                            title={autoScrollEnabled ? "Pause Scroll" : "Auto Scroll"}
                        >
                            <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-play"} />
                        </button>
                    )}
                    {musicUrl && (
                        <MusicButton isPlaying={isPlaying} onToggle={toggleMusic} />
                    )}
                </div>
            )}

            {/* Core Slide/Scroll Container */}
            <div 
                className={`mu-main${isOpened ? ' is-visible' : ''} ${isSlideMode ? 'mu-main--slide' : ''} ${layoutMode === 'slide-h' ? 'mu-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'mu-main--slide-v' : ''}`}
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
                        let slideClass = 'mu-slide-container';
                        if (idx === activeSlideIdx) slideClass += ' is-active';
                        else if (idx > activeSlideIdx) slideClass += ' is-next';
                        else slideClass += ' is-prev';

                        return (
                            <div key={s.section_key} className={slideClass} id={s.section_key} data-section={s.section_key}>
                                <div className="mu-slide-inner-scroll">
                                    {componentMap[s.section_key]}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={s.section_key} id={s.section_key} data-section={s.section_key} className="mu-scroll-section">
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
export default function ManchesterUnitedTheme(props) {
    return (
        <ErrorBoundary>
            <ManchesterUnitedThemeContent {...props} />
        </ErrorBoundary>
    );
}
