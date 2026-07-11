import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import DressCodeBlock from '@/Components/DressCodeBlock';
import ParticleEffect from '@/Components/ParticleEffect';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import './style.css';

// Import theme assets
import ws04_5 from './asset/ws-04-5.png';
import ws04_12 from './asset/ws-04-12.png';
import ws04_9 from './asset/ws-04-9.png';
import ws04_8 from './asset/ws-04-8.png';
import ws04_10 from './asset/ws-04-10.png';
import ws04_4 from './asset/ws-04-4.png';

const ASSETS = {
    watermark: ws04_9,
    coverArch: ws04_5,
    frameFlower: ws04_12,
    bouquet: ws04_10,
    countdownBranch: ws04_8,
    timelineBouquet: ws04_8, // Map to leaves branch (ws-04-8.png)
    coupleIllustration: ws04_4 // Map to cartoon couple (ws-04-4.png)
};

const DEFAULT_ASSETS = {
    cover: ws04_5,
    opening: ws04_5,
    groom: ws04_5,
    bride: ws04_5
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

function formatDate(d, locale = 'id') {
    if (!d) return '';
    const safe = String(d).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function splitDate(dateStr, locale = 'id') {
    if (!dateStr) return { dayOfWeek: '', dayNum: '', month: '', year: '' };
    const safe = String(dateStr).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return { dayOfWeek: '', dayNum: '', month: '', year: '' };
    
    const isEn = locale === 'en';
    const dayOfWeek = date.toLocaleDateString(isEn ? 'en-US' : 'id-ID', { weekday: 'long' });
    const dayNum = date.toLocaleDateString(isEn ? 'en-US' : 'id-ID', { day: '2-digit' });
    const month = date.toLocaleDateString(isEn ? 'en-US' : 'id-ID', { month: 'long' });
    const year = date.getFullYear();
    
    return {
        dayOfWeek,
        dayNum,
        month,
        year
    };
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

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

function formatTitle(title) {
    if (!title) return '';
    const clean = String(title).toUpperCase().trim();
    if (clean === 'THANK YOU') return 'Thank You';
    if (clean === 'TERIMA KASIH') return 'Terima Kasih';
    return title;
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

// Child order string translator helper
function translateChildOrder(childOrder, gender, locale) {
    if (!childOrder) return '';
    const isEn = locale === 'en';
    const numMapId = { '1': 'Pertama', '2': 'Kedua', '3': 'Ketiga', '4': 'Keempat', '5': 'Kelima' };
    const numMapEn = { '1': 'first', '2': 'second', '3': 'third', '4': 'fourth', '5': 'fifth' };
    const orderClean = String(childOrder).trim().toLowerCase();
    
    let orderStr = numMapId[orderClean] || childOrder;
    if (isEn) {
        orderStr = numMapEn[orderClean] || childOrder;
    }

    if (gender === 'pria' || gender === 'male') {
        return isEn ? `${orderStr} son of` : `Putra ${orderStr} dari`;
    } else {
        return isEn ? `${orderStr} daughter of` : `Putri ${orderStr} dari`;
    }
}

/* ─── ERROR BOUNDARY ─── */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#3d302a', background: '#f5ebe0', minHeight: '100vh', fontFamily: 'monospace' }}>
                <h2 style={{ color: '#b35c3c' }}>Terjadi kesalahan pada rendering tema Terracotta Minimalist.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#806f66', marginTop: 10 }}>
                    {this.state.error?.toString()}
                    {"\n\nStack Trace:\n"}
                    {this.state.error?.stack}
                </pre>
            </div>
        );
        return this.props.children;
    }
}

// Global toggle switches
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ─── SCROLL REVEAL COMPONENT ─── */
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

    let baseClass = 'tcm-reveal--up';
    if (variant === 'zoom') baseClass = 'tcm-reveal--zoom';
    else if (variant === 'left') baseClass = 'tcm-reveal--left';
    else if (variant === 'right') baseClass = 'tcm-reveal--right';
    else if (variant === 'down') baseClass = 'tcm-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} tcm-reveal ${baseClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ─── COVER SECTION ─── */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, coverImages, events }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    return (
        <div className={`tcm-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="tcm-cover-header">
                <p className="tcm-cover-subtitle">{t('invitation.wedding_of')}</p>
                <h1 className="tcm-cover-title">{coupleName}</h1>
                <p className="tcm-cover-date">
                    {formatDate(invitation?.countdown_target_date || events?.[0]?.event_date)}
                </p>
            </div>

            <div className="tcm-cover-photo-window">
                {globalShowPhotos && coverImages.length > 0 ? (
                    <PremiumSlideshow
                        images={coverImages}
                        positionX={invitation?.cover_position_x}
                        positionY={invitation?.cover_position_y}
                        zoom={invitation?.cover_zoom}
                    />
                ) : (
                    <div className="w-full h-full bg-[#f5dcd2]" />
                )}
            </div>

            <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                <div className="tcm-cover-guest">
                    <p className="tcm-cover-guest-title">{t('invitation.dear_guest_title')}:</p>
                    <div className="tcm-cover-guest-name">{guestName}</div>
                    {guest?.group_name && <p className="tcm-cover-guest-location">{guest.group_name}</p>}
                </div>

                <button type="button" onClick={onOpen} id="tombol-buka" className="tcm-btn">
                    <i className="fas fa-envelope-open" />
                    {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

/* ─── OPENING SECTION ─── */
function OpeningSection({ invitation, brideGrooms, openingImages, events, showCountdown }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Groom & Bride');

    const defaultTitle = locale === 'en' ? 'WELCOME TO THE WEDDING OF' : 'SELAMAT DATANG DI PERNIKAHAN';
    const openingTitle = invitation?.opening_title || defaultTitle;

    return (
        <section className="tcm-section tcm-opening" id="opening">
            <Reveal>
                <img src={ASSETS.frameFlower} alt="opening ornament" className="tcm-opening-ornament-top" />
            </Reveal>

            <Reveal delay={200}>
                <p className="tcm-section-subtitle" style={{ marginBottom: '10px' }}>
                    {openingTitle}
                </p>
                <h1 className="tcm-opening-couple-name">{coupleName}</h1>
            </Reveal>

            {showCountdown && (
                <CountdownBlock events={events} variant="opening" />
            )}

            {globalShowPhotos && openingImages.length > 0 && (
                <Reveal delay={300}>
                    <div className="tcm-opening-photo-window">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                </Reveal>
            )}

            {invitation?.opening_ayat && (
                <Reveal delay={400}>
                    <div className="tcm-quote-ayat">
                        "{invitation.opening_ayat}"
                        {invitation.opening_ayat_source && (
                            <div className="tcm-quote-source">— {invitation.opening_ayat_source}</div>
                        )}
                    </div>
                </Reveal>
            )}

            {invitation?.opening_text && (
                <Reveal delay={500}>
                    <p style={{ marginTop: 25, fontSize: '0.85rem', color: 'var(--tcm-text)' }}>
                        {invitation.opening_text}
                    </p>
                </Reveal>
            )}
        </section>
    );
}

/* ─── COUPLE (MEMPELAI) SECTION ─── */
function BrideGroomSection({ brideGrooms, invitation }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const renderGroom = () => {
        if (!groom) return null;
        const groomPhoto = getStorageUrl(groom.photo, null);

        return (
            <div className="tcm-mempelai-card">
                <Reveal variant="left">
                    <div className="tcm-mempelai-photo-container">
                        {/* Floating dry leaf ornament */}
                        <img src={ASSETS.timelineBouquet} alt="leaf ornament" className="tcm-mempelai-leaf-floating-left" />
                        
                        {globalShowPhotos && groomPhoto ? (
                            <div className="tcm-mempelai-photo-inner">
                                <img src={groomPhoto} alt={groom.nickname} />
                            </div>
                        ) : (
                            <div className="tcm-mempelai-photo-inner">
                                <img src={ASSETS.coupleIllustration} alt="cartoon-couple" className="tcm-mempelai-photo-fallback" />
                            </div>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={150}>
                    <h3 className="tcm-mempelai-name-script">{groom.nickname}</h3>
                    <h4 className="tcm-mempelai-name-full">{groom.full_name}</h4>
                    {((groom.father_name && groom.father_name.trim() !== '') || (groom.mother_name && groom.mother_name.trim() !== '')) && (
                        <p className="tcm-mempelai-parents">
                            {translateChildOrder(groom.child_order, 'pria', locale)} <br />
                            <strong>
                                {groom.father_name && groom.mother_name ? (
                                    `Bpk. ${groom.father_name} & Ibu ${groom.mother_name}`
                                ) : groom.father_name ? (
                                    `Bpk. ${groom.father_name}`
                                ) : (
                                    `Ibu ${groom.mother_name}`
                                )}
                            </strong>
                        </p>
                    )}
                    {groom.instagram && (
                        <a 
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tcm-btn-instagram"
                        >
                            <i className="fab fa-instagram" /> @{groom.instagram.replace('@', '')}
                        </a>
                    )}
                </Reveal>
            </div>
        );
    };

    const renderBride = () => {
        if (!bride) return null;
        const bridePhoto = getStorageUrl(bride.photo, null);

        return (
            <div className="tcm-mempelai-card">
                <Reveal variant="right">
                    <div className="tcm-mempelai-photo-container">
                        {/* Floating dry leaf ornament */}
                        <img src={ASSETS.timelineBouquet} alt="leaf ornament" className="tcm-mempelai-leaf-floating-right" />
                        
                        {globalShowPhotos && bridePhoto ? (
                            <div className="tcm-mempelai-photo-inner">
                                <img src={bridePhoto} alt={bride.nickname} />
                            </div>
                        ) : (
                            <div className="tcm-mempelai-photo-inner">
                                <img src={ASSETS.coupleIllustration} alt="cartoon-couple" className="tcm-mempelai-photo-fallback" />
                            </div>
                        )}
                    </div>
                </Reveal>

                <Reveal delay={150}>
                    <h3 className="tcm-mempelai-name-script">{bride.nickname}</h3>
                    <h4 className="tcm-mempelai-name-full">{bride.full_name}</h4>
                    {((bride.father_name && bride.father_name.trim() !== '') || (bride.mother_name && bride.mother_name.trim() !== '')) && (
                        <p className="tcm-mempelai-parents">
                            {translateChildOrder(bride.child_order, 'wanita', locale)} <br />
                            <strong>
                                {bride.father_name && bride.mother_name ? (
                                    `Bpk. ${bride.father_name} & Ibu ${bride.mother_name}`
                                ) : bride.father_name ? (
                                    `Bpk. ${bride.father_name}`
                                ) : (
                                    `Ibu ${bride.mother_name}`
                                )}
                            </strong>
                        </p>
                    )}
                    {bride.instagram && (
                        <a 
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tcm-btn-instagram"
                        >
                            <i className="fab fa-instagram" /> @{bride.instagram.replace('@', '')}
                        </a>
                    )}
                </Reveal>
            </div>
        );
    };

    return (
        <section className="tcm-section tcm-couple" id="bride_groom">
            {/* Top-left Corner Flower Garland */}
            <img src={ASSETS.countdownBranch} alt="flower corner decoration" className="tcm-couple-flower-corner" />

            <Reveal>
                <div className="tcm-couple-bismillah-flower" />
                <div style={{ fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '15px', color: 'var(--tcm-primary)' }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--tcm-text-muted)', marginBottom: '30px', padding: '0 10px' }}>
                    {locale === 'en' 
                        ? 'Under the grace of God, we joyfully announce our marriage and request the honor of your presence.'
                        : 'Dengan Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:'
                    }
                </p>
            </Reveal>

            {renderGroom()}
            <div className="tcm-mempelai-ampersand">&</div>
            {renderBride()}
        </section>
    );
}

/* ─── COUNTDOWN COMPONENT ─── */
function CountdownBlock({ events, variant = 'default' }) {
    const { t, locale } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const targetDateStr = primaryEvent?.event_date || '2026-12-31';
    const targetTimeStr = primaryEvent?.start_time || '08:00';

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const ds = String(targetDateStr).substring(0, 10);
        const ts = String(targetTimeStr).substring(0, 5);
        const target = new Date(`${ds}T${ts}:00`);

        const updateTimer = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDateStr, targetTimeStr]);

    const addToCalendar = () => {
        const ds = String(targetDateStr).substring(0, 10).replace(/-/g, '');
        const ts = String(targetTimeStr).substring(0, 5).replace(/:/g, '');
        const title = encodeURIComponent('Pernikahan Kami');
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${ds}T${ts}00Z/${ds}T235959Z`;
        window.open(googleUrl, '_blank');
    };

    if (variant === 'opening') {
        return (
            <div style={{ margin: '20px 0' }}>
                <Reveal delay={200}>
                    <div className="tcm-countdown-grid">
                        <div className="tcm-countdown-box">
                            <div className="tcm-countdown-num">{pad2(timeLeft.days)}</div>
                            <div className="tcm-countdown-label">{t('invitation.days')}</div>
                        </div>
                        <div className="tcm-countdown-box">
                            <div className="tcm-countdown-num">{pad2(timeLeft.hours)}</div>
                            <div className="tcm-countdown-label">{t('invitation.hours')}</div>
                        </div>
                        <div className="tcm-countdown-box">
                            <div className="tcm-countdown-num">{pad2(timeLeft.minutes)}</div>
                            <div className="tcm-countdown-label">{t('invitation.minutes')}</div>
                        </div>
                        <div className="tcm-countdown-box">
                            <div className="tcm-countdown-num">{pad2(timeLeft.seconds)}</div>
                            <div className="tcm-countdown-label">{t('invitation.seconds')}</div>
                        </div>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <div className="tcm-countdown-wrapper" id="countdown">
            <Reveal>
                <img src={ASSETS.countdownBranch} alt="countdown ornament" className="tcm-countdown-ornament" />
                <h2 className="tcm-countdown-title">
                    {locale === 'en' ? 'Countdown to Happy Day' : 'Menuju Hari Bahagia'}
                </h2>
            </Reveal>

            <Reveal delay={200}>
                <div className="tcm-countdown-grid">
                    <div className="tcm-countdown-box">
                        <div className="tcm-countdown-num">{pad2(timeLeft.days)}</div>
                        <div className="tcm-countdown-label">{t('invitation.days')}</div>
                    </div>
                    <div className="tcm-countdown-box">
                        <div className="tcm-countdown-num">{pad2(timeLeft.hours)}</div>
                        <div className="tcm-countdown-label">{t('invitation.hours')}</div>
                    </div>
                    <div className="tcm-countdown-box">
                        <div className="tcm-countdown-num">{pad2(timeLeft.minutes)}</div>
                        <div className="tcm-countdown-label">{t('invitation.minutes')}</div>
                    </div>
                    <div className="tcm-countdown-box">
                        <div className="tcm-countdown-num">{pad2(timeLeft.seconds)}</div>
                        <div className="tcm-countdown-label">{t('invitation.seconds')}</div>
                    </div>
                </div>
            </Reveal>

            <Reveal delay={350}>
                <button type="button" onClick={addToCalendar} className="tcm-btn" style={{ background: '#ffffff', color: 'var(--tcm-primary)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <i className="far fa-calendar-alt" />
                    {locale === 'en' ? 'Save to Calendar' : 'Simpan di Kalender'}
                </button>
            </Reveal>
        </div>
    );
}

/* ─── KISAH CINTA (LOVE STORY) SECTION ─── */
function LoveStorySection({ loveStories }) {
    const { t, locale } = useTranslation();
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);

    if (stories.length === 0) return null;

    return (
        <section className="tcm-section tcm-story" id="love_story">
            <Reveal>
                <div className="tcm-story-top-ornament" />
                <h2 className="tcm-section-title">{t('invitation.love_journey')}</h2>
                <p className="tcm-section-subtitle">{locale === 'en' ? 'Our beautiful journey together' : 'Kisah perjalanan cinta kami'}</p>
            </Reveal>

            <div className="tcm-timeline">
                {stories.map((story, idx) => (
                    <Reveal key={idx} delay={idx * 150} variant={idx % 2 === 0 ? 'left' : 'right'}>
                        <div className="tcm-timeline-item">
                            <div className="tcm-timeline-dot" />
                            <div className="tcm-timeline-card">
                                <div className="tcm-timeline-date">{formatDate(story.story_date)}</div>
                                <h3 className="tcm-timeline-title">{story.title}</h3>
                                <p className="tcm-timeline-text">{story.description}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ─── EVENT (ACARA) SECTION ─── */
function EventSection({ events, showCountdown }) {
    const { t, locale } = useTranslation();
    const sortedEvents = safeArr(events).sort((a, b) => a.sort_order - b.sort_order);

    return (
        <React.Fragment>
            {showCountdown && <CountdownBlock events={events} />}

            <section className="tcm-section tcm-event-section" id="event">
                <Reveal>
                    <h2 className="tcm-section-title">{t('invitation.wedding_events')}</h2>
                    <p className="tcm-section-subtitle">
                        {locale === 'en' ? 'Date, Time & Venue' : 'Waktu & Tempat Acara'}
                    </p>
                </Reveal>

                {sortedEvents.map((evt, idx) => {
                    const startStr = formatTime(evt.start_time);
                    const endStr = evt.end_time ? formatTime(evt.end_time) : t('invitation.until_finished');
                    const isEn = locale === 'en';
                    const dateParts = splitDate(evt.event_date, locale);

                    return (
                        <Reveal key={evt.id || idx} delay={idx * 150} variant="up">
                            <div className="tcm-event-card">
                                <img src={ASSETS.timelineBouquet} alt="flower decoration" className="tcm-event-card-flower" />
                                <h3 className="tcm-event-type">{evt.event_name}</h3>
                                
                                {/* Creative split date display */}
                                <div className="tcm-event-date-split">
                                    <div className="tcm-event-date-side">{dateParts.dayOfWeek}</div>
                                    <div className="tcm-event-date-center">{dateParts.dayNum}</div>
                                    <div className="tcm-event-date-side">
                                        <div>{dateParts.month}</div>
                                        <div style={{ marginTop: '2.5px', fontSize: '0.75rem', opacity: 0.8, letterSpacing: '0.5px' }}>{dateParts.year}</div>
                                    </div>
                                </div>

                                <div className="tcm-event-time-hours">
                                    {isEn ? 'Time' : 'Waktu'}: {startStr} - {endStr} {evt.timezone || 'WIB'}
                                </div>
                                <div className="tcm-divider" />
                                <h4 className="tcm-event-venue">{evt.venue_name}</h4>
                                <p className="tcm-event-address">{evt.venue_address}</p>

                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="tcm-btn"
                                    >
                                        <i className="fas fa-map-marker-alt" />
                                        {locale === 'en' ? 'View Map' : 'Lihat Lokasi'}
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    );
                })}
            </section>
        </React.Fragment>
    );
}

/* ─── LIVE STREAMING SECTION ─── */
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

    return (
        <section className="tcm-section tcm-livestream" id="livestream">
            <Reveal>
                <h2 className="tcm-section-title">{locale === 'en' ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <p className="tcm-section-subtitle">
                    {locale === 'en' ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}
                </p>
            </Reveal>

            <Reveal delay={200}>
                <div className="tcm-livestream-container">
                    {streamsList.map((stream, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => window.open(stream.url, '_blank')} 
                            className="tcm-btn-livestream"
                        >
                            <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ─── DRESSCODE SECTION ─── */
function DresscodeSection({ invitation }) {
    const { t, locale } = useTranslation();
    const colors = invitation?.dresscode_colors ? invitation.dresscode_colors.split(',') : [];

    if (!parseBool(invitation?.show_dresscode, false)) return null;

    return (
        <section className="tcm-section tcm-dresscode" id="dresscode">
            <Reveal>
                <h2 className="tcm-section-title">Dress Code</h2>
                <p className="tcm-section-subtitle">
                    {locale === 'en' 
                        ? 'We suggest you wear outfits following our wedding dress code.'
                        : 'Anjuran warna pakaian tamu undangan agar terlihat serasi.'
                    }
                </p>
            </Reveal>

            <Reveal delay={200}>
                <DressCodeBlock invitation={invitation} />
                {colors.length > 0 && (
                    <div className="tcm-dresscode-colors-flex">
                        {colors.map((color, idx) => (
                            <div 
                                key={idx} 
                                className="tcm-dresscode-color-circle" 
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

/* ─── GALLERY SECTION ─── */
function GallerySection({ galleries }) {
    const { t, locale } = useTranslation();
    const list = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);

    if (list.length === 0) return null;

    return (
        <section className="tcm-section tcm-gallery" id="gallery">
            <Reveal>
                <h2 className="tcm-section-title">{t('invitation.gallery')}</h2>
                <p className="tcm-section-subtitle">{locale === 'en' ? 'Our beautiful memories' : 'Momen bahagia kami'}</p>
            </Reveal>

            <div className="tcm-gallery-grid">
                {list.map((item, idx) => (
                    <Reveal key={item.id || idx} delay={idx * 100} variant="zoom">
                        <div className="tcm-gallery-item">
                            <img src={getStorageUrl(item.image_url)} alt={item.caption || 'Gallery photo'} />
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ─── VIDEO GALLERY SECTION ─── */
function VideoGallerySection({ invitation, locale }) {
    if (!invitation?.video_url) return null;
    const ytId = getYoutubeId(invitation.video_url);

    return (
        <section className="tcm-section tcm-video" id="video">
            <Reveal>
                <h2 className="tcm-section-title">{locale === 'en' ? 'Our Video' : 'Momen Video'}</h2>
                <p className="tcm-section-subtitle">
                    {locale === 'en' ? 'A glimpse of our happiness' : 'Saksikan cuplikan kebahagiaan kami'}
                </p>
            </Reveal>

            <Reveal delay={200} variant="zoom">
                {ytId ? (
                    <div className="tcm-video-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title="Prewedding Video"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                ) : (
                    <div className="tcm-video-wrapper">
                        <video controls src={getStorageUrl(invitation.video_url)} />
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ─── RSVP & WISHES SECTION ─── */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes }) {
    const { t, locale } = useTranslation();
    const guestName = guest?.name || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: guestName,
        attendance: 'hadir',
        people_count: 1,
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('invitation.rsvp', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => {
                reset('message', 'people_count');
                alert(locale === 'en' ? 'RSVP sent successfully!' : 'Kehadiran Anda berhasil dikirim!');
            }
        });
    };

    return (
        <section className="tcm-section tcm-rsvp" id="rsvp">
            {enableRsvp && (
                <div>
                    <Reveal>
                        <h2 className="tcm-section-title">{t('invitation.rsvp_title')}</h2>
                        <p className="tcm-section-subtitle">{t('invitation.rsvp_desc')}</p>
                    </Reveal>

                    <Reveal delay={150}>
                        <form onSubmit={handleSubmit} className="tcm-rsvp-card">
                            <div className="tcm-form-group">
                                <label className="tcm-form-label">{t('invitation.rsvp_name')}</label>
                                <input
                                    type="text"
                                    className="tcm-input"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="tcm-form-group">
                                <label className="tcm-form-label">{t('invitation.rsvp_attendance')}</label>
                                <select
                                    className="tcm-input tcm-select"
                                    value={data.attendance}
                                    onChange={(e) => setData('attendance', e.target.value)}
                                >
                                    <option value="hadir">{locale === 'en' ? 'Attending' : 'Hadir'}</option>
                                    <option value="tidak_hadir">{locale === 'en' ? 'Not Attending' : 'Tidak Hadir'}</option>
                                </select>
                            </div>

                            {data.attendance === 'hadir' && (
                                <div className="tcm-form-group">
                                    <label className="tcm-form-label">{t('invitation.rsvp_count')}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="tcm-input"
                                        value={data.people_count}
                                        onChange={(e) => setData('people_count', parseInt(e.target.value))}
                                        required
                                    />
                                </div>
                            )}

                            <div className="tcm-form-group">
                                <label className="tcm-form-label">{t('invitation.wishes_message')}</label>
                                <textarea
                                    className="tcm-input tcm-textarea"
                                    rows="4"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" disabled={processing} className="tcm-btn" style={{ width: '100%', justifyContent: 'center' }}>
                                {processing ? (locale === 'en' ? 'Sending...' : 'Mengirim...') : (locale === 'en' ? 'Send' : 'Kirim RSVP')}
                            </button>
                        </form>
                    </Reveal>
                </div>
            )}

            {enableWishes && (
                <div className="tcm-wishes-list">
                    <Reveal>
                        <h2 className="tcm-wishes-list-title">{t('invitation.wishes_title')}</h2>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="tcm-wishes-container">
                            {safeArr(wishes).map((item, idx) => (
                                <div key={item.id || idx} className="tcm-wish-item">
                                    <div className="tcm-wish-sender">
                                        <span>{item.sender_name}</span>
                                        {item.attendance && (
                                            <span style={{ fontSize: '0.7rem', background: 'var(--tcm-primary-light)', color: 'var(--tcm-primary)', padding: '2px 8px', borderRadius: '10px', marginLeft: 10 }}>
                                                {item.attendance === 'hadir' 
                                                    ? (locale === 'en' ? 'Attending' : 'Hadir') 
                                                    : (locale === 'en' ? 'Not Attending' : 'Tidak Hadir')
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <p className="tcm-wish-message">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            )}
        </section>
    );
}

/* ─── DIGITAL GIFT (KADO DIGITAL) SECTION ─── */
function BankSection({ bankAccounts, invitation }) {
    const { t, locale } = useTranslation();
    const [copiedId, setCopiedId] = useState(null);

    const accounts = safeArr(bankAccounts).sort((a, b) => a.sort_order - b.sort_order);

    const fallbackCopy = (text) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            console.error('Copy fallback failed', e);
        }
        document.body.removeChild(ta);
    };

    const handleCopy = (num, id) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2500);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2500);
                });
        } else {
            fallbackCopy(num);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        }
    };

    if (accounts.length === 0) return null;

    return (
        <section className="tcm-section tcm-bank" id="bank">
            <Reveal>
                <h2 className="tcm-section-title">{t('invitation.gift_title')}</h2>
                <p className="tcm-section-subtitle">{t('invitation.gift_desc')}</p>
            </Reveal>

            {accounts.map((acc, idx) => {
                const logoMap = {
                    'bca': 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
                    'dana': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg',
                    'mandiri': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg'
                };
                const cleanName = String(acc.bank_name).toLowerCase();
                const bankLogo = logoMap[cleanName] || null;

                return (
                    <Reveal key={acc.id || idx} delay={idx * 150} variant="zoom">
                        <div className="tcm-bank-card">
                            <span style={{ position: 'absolute', top: 10, right: 15, fontSize: '0.7rem', color: 'var(--tcm-primary)', opacity: copiedId === acc.id ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                                {t('invitation.gift_copied')}
                            </span>

                            <div className="tcm-bank-logo-wrapper">
                                {bankLogo ? (
                                    <img src={bankLogo} alt={acc.bank_name} className="tcm-bank-logo" />
                                ) : (
                                    <h4 style={{ fontFamily: 'var(--tcm-font-heading)', color: 'var(--tcm-primary)' }}>
                                        {acc.bank_name}
                                    </h4>
                                )}
                            </div>

                            <div className="tcm-bank-number">{acc.account_number}</div>
                            <div className="tcm-bank-holder">{acc.account_name}</div>

                            <button 
                                type="button" 
                                onClick={() => handleCopy(acc.account_number, acc.id)}
                                className="tcm-btn-copy"
                            >
                                <i className="far fa-copy" />
                                {t('invitation.gift_copy')}
                            </button>
                        </div>
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ─── CLOSING SECTION ─── */
function ClosingSection({ invitation, brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0];
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1];

    const hasGroomParents = groom?.father_name && groom?.mother_name;
    const hasBrideParents = bride?.father_name && bride?.mother_name;
    const isEn = locale === 'en';

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <section className="tcm-section tcm-closing" id="closing">
            <Reveal>
                <div className="tcm-closing-flower" />
                <h2 className="tcm-closing-title">{formatTitle(invitation?.closing_title || t('invitation.closing_title'))}</h2>
            </Reveal>

            {invitation?.closing_text && (
                <Reveal delay={200}>
                    <p className="tcm-closing-text">{invitation.closing_text}</p>
                </Reveal>
            )}

            <Reveal delay={350}>
                <div className="tcm-closing-family">
                    {locale === 'en' ? 'We Who Invite:' : 'Kami Yang Berbahagia:'} <br />
                    {hasGroomParents && (
                        <div style={{ marginTop: '5px' }}>
                            {isEn 
                                ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` 
                                : `Kel. Bapak ${groom.father_name} & Ibu ${groom.mother_name}`
                            }
                        </div>
                    )}
                    {hasBrideParents && (
                        <div style={{ marginTop: '3px' }}>
                            {isEn 
                                ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` 
                                : `Kel. Bapak ${bride.father_name} & Ibu ${bride.mother_name}`
                            }
                        </div>
                    )}
                </div>
            </Reveal>

            <Reveal delay={500}>
                <p className="tcm-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ─── HEART DIVIDER ─── */
function HeartDivider() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', opacity: 0.15 }}>
            <span style={{ height: 1, width: 60, background: 'var(--tcm-text)', margin: 'auto 10px' }} />
            <i className="fas fa-heart" style={{ color: 'var(--tcm-text)', fontSize: '0.8rem' }} />
            <span style={{ height: 1, width: 60, background: 'var(--tcm-text)', margin: 'auto 10px' }} />
        </div>
    );
}

/* ─── MAIN EXPORT COMPONENT ─── */
export default function DynamicIndex({ invitation, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, isDemo = false }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);

    const [isOpened, setIsOpened] = useState(false);
    const [coverMounted, setCoverMounted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

    // Lock page scrolling when the cover is active (unopened)
    useEffect(() => {
        if (!isOpened && coverMounted) {
            document.body.classList.add('tcm-body-locked');
        } else {
            document.body.classList.remove('tcm-body-locked');
        }
        return () => {
            document.body.classList.remove('tcm-body-locked');
        };
    }, [isOpened, coverMounted]);

    const audioRef = useRef(null);

    // Audio page visibility controller hook integration
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);

    // Write values to modules global context
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // Navigation and layout states
    const layoutMode = invitation?.layout_mode || 'scroll'; // 'scroll', 'slide-h', 'slide-v'
    const isSlideMode = ['slide-h', 'slide-v'].includes(layoutMode);
    const [activeSection, setActiveSection] = useState('hero');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

    // Parse slideshow configurations
    const coverImages = useMemo(() => {
        const imgStr = invitation?.cover_image || '';
        if (!imgStr) return [DEFAULT_ASSETS.cover];
        return imgStr
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    const openingImages = useMemo(() => {
        const imgStr = invitation?.opening_image || '';
        if (!imgStr) return [DEFAULT_ASSETS.opening];
        return imgStr
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    const hasVideos = !!invitation?.video_url;
    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;

    // Handle Fullscreen mode events
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Lock body overflow initially until opened
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpened, isSlideMode]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    // Calculate dynamic sections visible list
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(invitation?.sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'video', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        const resolved = [];

        // Cover section is always first
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
                
                // Countdown is integrated inside event seksi
                if (s.section_key === 'countdown') return;

                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return; // merged in RSVP form
                }

                if (s.section_key === 'livestream' && !hasStream) return;

                resolved.push(s);
                if (s.section_key === 'event' && hasStream) {
                    resolved.push({ section_key: 'livestream' });
                }
            });
        } else {
            // Default Fallback list if DB sections are not initialized
            const fallbacks = [
                { section_key: 'opening' },
                { section_key: 'bride_groom' },
                { section_key: 'event' },
            ];
            if (hasStream) fallbacks.push({ section_key: 'livestream' });
            if (loveStories?.length > 0) fallbacks.push({ section_key: 'love_story' });
            if (galleries?.length > 0 && showPhotos) fallbacks.push({ section_key: 'gallery' });
            if (hasVideos) fallbacks.push({ section_key: 'video' });
            if (enableRsvp) fallbacks.push({ section_key: 'rsvp' });
            if (enableWishes && !enableRsvp) fallbacks.push({ section_key: 'wishes' });
            if (bankAccounts?.length > 0) fallbacks.push({ section_key: 'bank' });
            fallbacks.push({ section_key: 'closing' });

            fallbacks.forEach(f => resolved.push(f));
        }

        return resolved;
    }, [invitation?.sections, events, loveStories, galleries, showPhotos, hasVideos, enableRsvp, enableWishes]);

    // Align navigation tabs centering on active state change (using manual scrollLeft as per instructions)
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.tcm-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            // Center the active tab in the bottom nav bar
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // Slide synchronization loop
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'hero') key = 'hero';
            setActiveSection(key);
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections]);

    // Page Auto Scroll engine (pixel by pixel scrolling / slide switching)
    const autoScrollTimer = useRef(null);

    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) {
            if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
            return;
        }

        const runAutoScroll = () => {
            if (isSlideMode) {
                // Auto Scroll in Slide Mode
                const activeSlideContainer = document.querySelector('.tcm-slide-container.is-active');
                if (activeSlideContainer) {
                    const scrollHeight = activeSlideContainer.scrollHeight;
                    const clientHeight = activeSlideContainer.clientHeight;
                    const currentScroll = activeSlideContainer.scrollTop;

                    if (scrollHeight > clientHeight && currentScroll + clientHeight < scrollHeight - 2) {
                        // Scroll down within the current slide
                        activeSlideContainer.scrollTop += 1.2;
                    } else {
                        // Transition to next slide after a brief pause
                        clearInterval(autoScrollTimer.current);
                        autoScrollTimer.current = setTimeout(() => {
                            setActiveSlideIdx(prev => {
                                const nextIdx = prev + 1;
                                if (nextIdx < resolvedSections.length) {
                                    return nextIdx;
                                } else {
                                    // Loop back to index 1 (after cover)
                                    return 1;
                                }
                            });
                        }, 4000);
                    }
                }
            } else {
                // Auto Scroll in Scroll Mode
                const scrollStep = () => {
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    if (window.scrollY >= maxScroll - 2) {
                        // Loop back to top (after cover)
                        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                    } else {
                        window.scrollBy(0, 1);
                    }
                };
                autoScrollTimer.current = setInterval(scrollStep, 35);
            }
        };

        if (isSlideMode) {
            autoScrollTimer.current = setInterval(runAutoScroll, 35);
        } else {
            runAutoScroll();
        }

        return () => {
            if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
        };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length, activeSlideIdx]);

    // Touch Swipe handling logic for Slide Presentation Mode
    const touchStart = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        const diffX = touchStart.current.x - e.changedTouches[0].clientX;
        const diffY = touchStart.current.y - e.changedTouches[0].clientY;

        if (layoutMode === 'slide-h') {
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) nextSlide();
                else prevSlide();
            }
        } else if (layoutMode === 'slide-v') {
            if (Math.abs(diffY) > 50) {
                if (diffY > 0) nextSlide();
                else prevSlide();
            }
        }
    };

    // Keyboard and mouse drag navigation support for slider
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const handleOpen = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(err => console.log('Audio autoplay blocked', err));
        }

        // Trigger Fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        if (isSlideMode) {
            setActiveSlideIdx(1); // Go to opening slide
        }

        // Unmount cover after slide up transition completes (1.2s)
        setTimeout(() => {
            setCoverMounted(false);
        }, 1200);
    };

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(err => console.log('Audio error', err));
            setIsPlaying(true);
        }
    };

    // Scrollspy setup for normal vertical scroll layout
    useEffect(() => {
        if (isSlideMode || !isOpened) return;

        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            const scrollSections = resolvedSections.map(s => s.section_key);

            for (const key of scrollSections) {
                const el = document.getElementById(key);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(key);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSlideMode, isOpened, resolvedSections]);

    const navigateToSection = (sectionKey) => {
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === sectionKey);
            if (idx !== -1) setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(sectionKey);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(sectionKey);
            }
        }
    };

    // Render individual section blocks
    const renderSectionComponent = (section, idx) => {
        const key = section.section_key;

        const showCountdownInEvent = useMemo(() => {
            const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
            if (!primaryEvent?.event_date || !parseBool(invitation?.show_countdown, true)) return false;
            
            const cSection = safeArr(invitation?.sections).find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : true;
        }, [invitation?.sections, events]);

        const componentMap = {
            'hero': null, // cover rendered overlay
            'opening': <OpeningSection key={key} invitation={invitation} brideGrooms={brideGrooms} openingImages={openingImages} events={events} showCountdown={showCountdownInEvent} />,
            'bride_groom': <BrideGroomSection key={key} brideGrooms={brideGrooms} invitation={invitation} />,
            'countdown': null, // integrated inside event
            'event': <EventSection key={key} events={events} showCountdown={showCountdownInEvent} />,
            'livestream': <LiveStreamingSection key={key} events={events} invitation={invitation} />,
            'love_story': <LoveStorySection key={key} loveStories={loveStories} />,
            'gallery': <GallerySection key={key} galleries={galleries} />,
            'video': <VideoGallerySection key={key} invitation={invitation} locale={locale} />,
            'bank': <BankSection key={key} bankAccounts={bankAccounts} invitation={invitation} />,
            'rsvp': <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} />,
            'wishes': enableRsvp ? null : <UnifiedRsvpWishes key={key} invitation={invitation} wishes={wishes} guest={guest} enableRsvp={false} enableWishes={true} />,
            'closing': <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} />,
        };

        const comp = componentMap[key];
        if (!comp) return null;

        if (isSlideMode) {
            let slideClass = 'tcm-slide-container';
            if (idx === activeSlideIdx) slideClass += ' is-active';
            else if (idx > activeSlideIdx) slideClass += ' is-next';
            else slideClass += ' is-prev';

            return (
                <div key={key} className={slideClass}>
                    {comp}
                </div>
            );
        }

        return (
            <React.Fragment key={key}>
                <div id={key}>{comp}</div>
                {key !== 'closing' && <HeartDivider />}
            </React.Fragment>
        );
    };

    // Calculate nav items list
    const navItems = useMemo(() => {
        return resolvedSections.filter(s => s.section_key !== 'hero' && s.section_key !== 'countdown');
    }, [resolvedSections]);

    return (
        <ErrorBoundary>
            <div className={`tcm-page ${!showAnimations ? 'theme-no-animations' : ''}`}>
                {invitation?.particle_type && invitation.particle_type !== 'none' && isOpened && (
                    <ParticleEffect
                        type={invitation.particle_type}
                        count={invitation.particle_count || 30}
                        speed={invitation.particle_speed || 'normal'}
                    />
                )}

                {/* Background music source player */}
                {invitation?.music_url && (
                    <audio ref={audioRef} loop preload="auto" playsInline>
                        <source src={getStorageUrl(invitation.music_url, '')} type="audio/mpeg" />
                    </audio>
                )}

                {/* Cover Overlay View */}
                {coverMounted && (
                    <CoverSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        guest={guest}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        coverImages={coverImages}
                        events={events}
                    />
                )}

                {/* Main View Wrapper */}
                <div className="tcm-container">
                    <div
                        className={`tcm-main ${isSlideMode ? 'tcm-main--slide' : ''} ${layoutMode === 'slide-h' ? 'tcm-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'tcm-main--slide-v' : ''}`}
                        onTouchStart={isSlideMode ? handleTouchStart : undefined}
                        onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                    >
                        {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                    </div>
                </div>

                {/* Bottom Navigation Menu */}
                {isOpened && navItems.length > 0 && (
                    <nav className="tcm-nav">
                        {navItems.map((item) => {
                            const key = item.section_key;
                            const isActive = activeSection === key;
                            const iconMap = {
                                'opening': 'fa-book-open',
                                'bride_groom': 'fa-heart',
                                'event': 'fa-calendar-day',
                                'livestream': 'fa-video',
                                'love_story': 'fa-history',
                                'gallery': 'fa-images',
                                'video': 'fa-film',
                                'rsvp': 'fa-check-double',
                                'wishes': 'fa-comment-alt',
                                'bank': 'fa-gift',
                                'closing': 'fa-flag-checkered',
                            };
                            const nameMap = {
                                'opening': locale === 'en' ? 'Intro' : 'Buka',
                                'bride_groom': locale === 'en' ? 'Couple' : 'Mempelai',
                                'event': locale === 'en' ? 'Event' : 'Acara',
                                'livestream': 'Live',
                                'love_story': locale === 'en' ? 'Story' : 'Kisah',
                                'gallery': locale === 'en' ? 'Gallery' : 'Galeri',
                                'video': 'Video',
                                'rsvp': 'RSVP',
                                'wishes': locale === 'en' ? 'Wishes' : 'Ucapan',
                                'bank': locale === 'en' ? 'Gift' : 'Kado',
                                'closing': locale === 'en' ? 'End' : 'Tutup',
                            };
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    id={`nav-btn-${key}`}
                                    onClick={() => navigateToSection(key)}
                                    className={`tcm-nav-btn ${isActive ? 'is-active' : ''}`}
                                >
                                    <i className={`fas ${iconMap[key] || 'fa-star'}`} />
                                    <span>{nameMap[key] || key}</span>
                                </button>
                            );
                        })}
                    </nav>
                )}

                {/* Floating controls panel */}
                {isOpened && (
                    <div className="tcm-floating-controls">
                        {/* Music play equalizer controller */}
                        {invitation?.music_url && (
                            <button 
                                type="button" 
                                onClick={toggleMusic} 
                                className="tcm-float-btn"
                                title={isPlaying ? 'Pause Music' : 'Play Music'}
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

                        {/* Fullscreen Expand/Compress toggle button */}
                        <button 
                            type="button" 
                            onClick={toggleFullscreen} 
                            className="tcm-float-btn"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                        </button>

                        {/* Auto Scroll toggle button */}
                        <button 
                            type="button" 
                            onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} 
                            className="tcm-float-btn"
                            style={autoScrollEnabled ? { backgroundColor: 'var(--tcm-primary)', color: '#fff' } : undefined}
                            title={autoScrollEnabled ? 'Disable Auto Scroll' : 'Enable Auto Scroll'}
                        >
                            <i className="fas fa-magic" />
                        </button>

                        {/* QR Code Check-in button */}
                        {enableQr && activeGuest && (
                            <button 
                                type="button" 
                                onClick={() => setShowQr(true)} 
                                className="tcm-float-btn"
                                title="Show Check-in QR"
                            >
                                <i className="fas fa-qrcode" />
                            </button>
                        )}
                    </div>
                )}

                {/* QR Code Presensi Overlay Modal */}
                {enableQr && showQr && activeGuest && (
                    <div className="tcm-modal-overlay">
                        <div className="tcm-modal-content">
                            <h3 className="tcm-modal-title">Check-in QR Code</h3>
                            <p className="tcm-modal-subtitle">{locale === 'en' ? 'Show this QR code to receptionist' : 'Tunjukkan QR code ini ke petugas penerima tamu'}</p>
                            
                            <div className="tcm-qr-wrapper">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=b35c3c&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                    alt="QR Code Presensi" 
                                />
                            </div>
                            
                            <div>
                                <button 
                                    type="button" 
                                    onClick={() => setShowQr(false)} 
                                    className="tcm-btn"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    {locale === 'en' ? 'Close' : 'Tutup'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
