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
import ws02_3 from './asset/ws-02-3.png';
import ws02_4 from './asset/ws-02-4.png';
import ws02_5 from './asset/ws-02-5.png';
import ws02_6 from './asset/ws-02-6.png';
import ws02_7 from './asset/ws-02-7.png';

const ASSETS = {
    watermark: ws02_3,
    coverSwan: ws02_4,
    frameFlower: ws02_5,
    bouquet: ws02_6,
    swanCouple: ws02_7
};

const DEFAULT_ASSETS = {
    cover: ws02_4,
    opening: ws02_4,
    groom: ws02_4,
    bride: ws02_4
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
            <div style={{ padding: 20, color: '#3d3730', background: '#f5efe6', minHeight: '100vh', fontFamily: 'monospace' }}>
                <h2 style={{ color: '#a3b899' }}>Terjadi kesalahan pada rendering tema Sage Minimalist.</h2>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#73695e', marginTop: 10 }}>
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

    let baseClass = 'sgm-reveal--up';
    if (variant === 'zoom') baseClass = 'sgm-reveal--zoom';
    else if (variant === 'left') baseClass = 'sgm-reveal--left';
    else if (variant === 'right') baseClass = 'sgm-reveal--right';
    else if (variant === 'down') baseClass = 'sgm-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} sgm-reveal ${baseClass} ${visible ? 'is-visible' : ''}`}
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
        <div className={`sgm-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="sgm-cover__arch-wrapper">
                <div className="sgm-cover__arch-bg">
                    {globalShowPhotos && coverImages.length > 0 ? (
                        <PremiumSlideshow
                            images={coverImages}
                            positionX={invitation?.cover_position_x}
                            positionY={invitation?.cover_position_y}
                            zoom={invitation?.cover_zoom}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#cbdcca]" />
                    )}
                    {/* Swan and flowers overlay decoration at bottom of cover arch */}
                    <img src={ASSETS.coverSwan} alt="decoration" className="sgm-cover__arch-ornament" />
                </div>
            </div>

            <p className="sgm-cover__the-wedding">{t('invitation.wedding_of')}</p>
            <h1 className="sgm-cover__couple">{coupleName}</h1>
            <p className="sgm-cover__date">
                {formatDate(invitation?.countdown_target_date || events?.[0]?.event_date)}
            </p>

            <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                <p className="sgm-cover__dear">{t('invitation.dear_guest_title')}:</p>
                <div className="sgm-cover__guest">{guestName}</div>
                {guest?.group_name && <p className="sgm-cover__place">{guest.group_name}</p>}

                <button type="button" onClick={onOpen} id="tombol-buka" className="sgm-cover__btn">
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

    return (
        <section className="sgm-section sgm-opening" id="opening">
            <Reveal>
                <img src={ASSETS.swanCouple} alt="swan ornament" className="sgm-opening__ornament-top" />
            </Reveal>

            <Reveal delay={200}>
                <p className="sgm-section-subtitle" style={{ marginBottom: '10px' }}>
                    {locale === 'en' ? 'WELCOME TO THE WEDDING OF' : 'SELAMAT DATANG DI PERNIKAHAN'}
                </p>
                <h1 className="sgm-opening__couple-name">{coupleName}</h1>
            </Reveal>

            {showCountdown && (
                <CountdownBlock events={events} variant="opening" />
            )}

            {globalShowPhotos && openingImages.length > 0 && (
                <Reveal delay={300}>
                    <div className="sgm-opening__slideshow-wrapper">
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
                    <div className="sgm-opening__quote">
                        "{invitation.opening_ayat}"
                        {invitation.opening_ayat_source && (
                            <div className="sgm-opening__quote-source">— {invitation.opening_ayat_source}</div>
                        )}
                    </div>
                </Reveal>
            )}

            {invitation?.opening_text && (
                <Reveal delay={500}>
                    <p className="sgm-opening__welcome">
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
        const groomPhoto = getStorageUrl(groom.photo, DEFAULT_ASSETS.groom);

        return (
            <div className="sgm-couple__card">
                <Reveal variant="left">
                    <div className="sgm-couple__photo-wrapper">
                        <div className="sgm-couple__photo-inner">
                            {globalShowPhotos && groomPhoto ? (
                                <img src={groomPhoto} alt={groom.nickname} />
                            ) : (
                                <div className="w-full h-full bg-[#cbdcca]" />
                            )}
                        </div>
                        <img src={ASSETS.frameFlower} alt="flower ornament" className="sgm-couple__photo-ornament" />
                    </div>
                </Reveal>

                <Reveal delay={150}>
                    <h3 className="sgm-couple__nickname">{groom.nickname}</h3>
                    <h4 className="sgm-couple__fullname">{groom.full_name}</h4>
                    {((groom.father_name && groom.father_name.trim() !== '') || (groom.mother_name && groom.mother_name.trim() !== '')) && (
                        <p className="sgm-couple__parents">
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
                            className="sgm-couple__btn"
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
        const bridePhoto = getStorageUrl(bride.photo, DEFAULT_ASSETS.bride);

        return (
            <div className="sgm-couple__card">
                <Reveal variant="right">
                    <div className="sgm-couple__photo-wrapper">
                        <div className="sgm-couple__photo-inner">
                            {globalShowPhotos && bridePhoto ? (
                                <img src={bridePhoto} alt={bride.nickname} />
                            ) : (
                                <div className="w-full h-full bg-[#cbdcca]" />
                            )}
                        </div>
                        <img src={ASSETS.frameFlower} alt="flower ornament" className="sgm-couple__photo-ornament" />
                    </div>
                </Reveal>

                <Reveal delay={150}>
                    <h3 className="sgm-couple__nickname">{bride.nickname}</h3>
                    <h4 className="sgm-couple__fullname">{bride.full_name}</h4>
                    {((bride.father_name && bride.father_name.trim() !== '') || (bride.mother_name && bride.mother_name.trim() !== '')) && (
                        <p className="sgm-couple__parents">
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
                            className="sgm-couple__btn"
                        >
                            <i className="fab fa-instagram" /> @{bride.instagram.replace('@', '')}
                        </a>
                    )}
                </Reveal>
            </div>
        );
    };

    return (
        <section className="sgm-section sgm-couple" id="bride_groom">
            <Reveal>
                <div className="sgm-couple__greeting-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                <p className="sgm-couple__greeting">
                    {locale === 'en' 
                        ? 'Under the grace of God, we joyfully announce our marriage and request the honor of your presence.'
                        : 'Dengan Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:'
                    }
                </p>
            </Reveal>

            {renderGroom()}
            <div className="sgm-couple__separator">&</div>
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
            <div className="sgm-opening__countdown">
                <Reveal delay={200}>
                    <div className="sgm-opening__countdown__grid">
                        <div className="sgm-opening__countdown__box">
                            <div className="sgm-opening__countdown__num">{pad2(timeLeft.days)}</div>
                            <div className="sgm-opening__countdown__label">{t('invitation.days')}</div>
                        </div>
                        <div className="sgm-opening__countdown__box">
                            <div className="sgm-opening__countdown__num">{pad2(timeLeft.hours)}</div>
                            <div className="sgm-opening__countdown__label">{t('invitation.hours')}</div>
                        </div>
                        <div className="sgm-opening__countdown__box">
                            <div className="sgm-opening__countdown__num">{pad2(timeLeft.minutes)}</div>
                            <div className="sgm-opening__countdown__label">{t('invitation.minutes')}</div>
                        </div>
                        <div className="sgm-opening__countdown__box">
                            <div className="sgm-opening__countdown__num">{pad2(timeLeft.seconds)}</div>
                            <div className="sgm-opening__countdown__label">{t('invitation.seconds')}</div>
                        </div>
                    </div>
                </Reveal>
            </div>
        );
    }

    return (
        <section className="sgm-countdown-section" id="countdown">
            <Reveal>
                <img src={ASSETS.bouquet} alt="ornament bouquet" className="sgm-countdown-section__ornament" />
                <h2 className="sgm-countdown-section__title">
                    {locale === 'en' ? 'Countdown to Happy Day' : 'Menuju Hari Bahagia'}
                </h2>
            </Reveal>

            <Reveal delay={200}>
                <div className="sgm-countdown-section__grid">
                    <div className="sgm-countdown-section__box">
                        <div className="sgm-countdown-section__num">{pad2(timeLeft.days)}</div>
                        <div className="sgm-countdown-section__label">{t('invitation.days')}</div>
                    </div>
                    <div className="sgm-countdown-section__box">
                        <div className="sgm-countdown-section__num">{pad2(timeLeft.hours)}</div>
                        <div className="sgm-countdown-section__label">{t('invitation.hours')}</div>
                    </div>
                    <div className="sgm-countdown-section__box">
                        <div className="sgm-countdown-section__num">{pad2(timeLeft.minutes)}</div>
                        <div className="sgm-countdown-section__label">{t('invitation.minutes')}</div>
                    </div>
                    <div className="sgm-countdown-section__box">
                        <div className="sgm-countdown-section__num">{pad2(timeLeft.seconds)}</div>
                        <div className="sgm-countdown-section__label">{t('invitation.seconds')}</div>
                    </div>
                </div>
            </Reveal>

            <Reveal delay={350}>
                <button type="button" onClick={addToCalendar} className="sgm-countdown-section__btn">
                    <i className="far fa-calendar-alt" />
                    {locale === 'en' ? 'Save to Calendar' : 'Simpan di Kalender'}
                </button>
            </Reveal>
        </section>
    );
}

/* ─── KISAH CINTA (LOVE STORY) SECTION ─── */
function LoveStorySection({ loveStories }) {
    const { t, locale } = useTranslation();
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);

    if (stories.length === 0) return null;

    return (
        <section className="sgm-section sgm-love-story" id="love_story">
            <Reveal>
                <h2 className="sgm-section-title">{t('invitation.love_journey')}</h2>
                <p className="sgm-section-subtitle">{locale === 'en' ? 'Our beautiful journey together' : 'Kisah perjalanan cinta kami'}</p>
            </Reveal>

            <div className="sgm-story__timeline">
                {stories.map((story, idx) => (
                    <Reveal key={idx} delay={idx * 150} variant={idx % 2 === 0 ? 'left' : 'right'}>
                        <div className="sgm-story__item">
                            <div className="sgm-story__node" />
                            <div className="sgm-story__card">
                                <span className="sgm-story__index">{pad2(idx + 1)}</span>
                                <h3 className="sgm-story__title">{story.title}</h3>
                                <span className="sgm-story__date">{formatDate(story.story_date)}</span>
                                <p className="sgm-story__description">{story.description}</p>
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

            <section className="sgm-section sgm-event" id="event">
                <Reveal>
                    <h2 className="sgm-section-title">{t('invitation.wedding_events')}</h2>
                    <p className="sgm-section-subtitle">
                        {locale === 'en' ? 'Date, Time & Venue' : 'Waktu & Tempat Acara'}
                    </p>
                </Reveal>

                {sortedEvents.map((evt, idx) => {
                    const startStr = formatTime(evt.start_time);
                    const endStr = evt.end_time ? formatTime(evt.end_time) : t('invitation.until_finished');
                    const isEn = locale === 'en';

                    return (
                        <Reveal key={evt.id || idx} delay={idx * 150} variant="up">
                            <div className="sgm-event__card">
                                <h3 className="sgm-event__type-title">{evt.event_name}</h3>
                                <div className="sgm-event__date-main">{formatDate(evt.event_date, locale)}</div>
                                <div className="sgm-event__time">
                                    {isEn ? 'Time' : 'Waktu'}: {startStr} - {endStr} {evt.timezone || 'WIB'}
                                </div>
                                <div className="sgm-event__divider" />
                                <h4 className="sgm-event__venue">{evt.venue_name}</h4>
                                <p className="sgm-event__address">{evt.venue_address}</p>

                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sgm-event__btn"
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
        <section className="sgm-section sgm-livestream" id="livestream">
            <Reveal>
                <h2 className="sgm-section-title">{locale === 'en' ? 'Live Streaming' : 'Siaran Langsung'}</h2>
                <p className="sgm-section-subtitle">
                    {locale === 'en' ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}
                </p>
            </Reveal>

            <Reveal delay={200}>
                <div className="sgm-livestream__container">
                    {streamsList.map((stream, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => window.open(stream.url, '_blank')} 
                            className="sgm-livestream__btn"
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
        <section className="sgm-section sgm-dresscode" id="dresscode">
            <Reveal>
                <h2 className="sgm-section-title">Dress Code</h2>
                <p className="sgm-section-subtitle">
                    {locale === 'en' 
                        ? 'We suggest you wear outfits following our wedding dress code.'
                        : 'Anjuran warna pakaian tamu undangan agar terlihat serasi.'
                    }
                </p>
            </Reveal>

            <Reveal delay={200}>
                <DressCodeBlock invitation={invitation} />
                {colors.length > 0 && (
                    <div className="sgm-dresscode__colors-flex">
                        {colors.map((color, idx) => (
                            <div 
                                key={idx} 
                                className="sgm-dresscode__color-circle" 
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
        <section className="sgm-section sgm-gallery" id="gallery">
            <Reveal>
                <h2 className="sgm-section-title">{t('invitation.gallery')}</h2>
                <p className="sgm-section-subtitle">{locale === 'en' ? 'Our beautiful memories' : 'Momen bahagia kami'}</p>
            </Reveal>

            <div className="sgm-gallery__grid">
                {list.map((item, idx) => (
                    <Reveal key={item.id || idx} delay={idx * 100} variant="zoom">
                        <div className="sgm-gallery__item">
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
        <section className="sgm-section sgm-gallery" id="video">
            <Reveal>
                <h2 className="sgm-section-title">{locale === 'en' ? 'Our Video' : 'Momen Video'}</h2>
                <p className="sgm-section-subtitle">
                    {locale === 'en' ? 'A glimpse of our happiness' : 'Saksikan cuplikan kebahagiaan kami'}
                </p>
            </Reveal>

            <Reveal delay={200} variant="zoom">
                {ytId ? (
                    <div className="sgm-video-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}`}
                            title="Prewedding Video"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                ) : (
                    <div className="sgm-video-container">
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

    const [copiedId, setCopiedId] = useState(null);

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
        <section className="sgm-section sgm-rsvp-wishes" id="rsvp">
            {enableRsvp && (
                <div className="sgm-rsvp">
                    <Reveal>
                        <h2 className="sgm-section-title">{t('invitation.rsvp_title')}</h2>
                        <p className="sgm-section-subtitle">{t('invitation.rsvp_desc')}</p>
                    </Reveal>

                    <Reveal delay={150}>
                        <form onSubmit={handleSubmit} className="sgm-rsvp__form">
                            <label className="sgm-rsvp__label">{t('invitation.rsvp_name')}</label>
                            <input
                                type="text"
                                className="sgm-rsvp__input"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <label className="sgm-rsvp__label">{t('invitation.rsvp_attendance')}</label>
                            <select
                                className="sgm-rsvp__select"
                                value={data.attendance}
                                onChange={(e) => setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{locale === 'en' ? 'Attending' : 'Hadir'}</option>
                                <option value="tidak_hadir">{locale === 'en' ? 'Not Attending' : 'Tidak Hadir'}</option>
                            </select>

                            {data.attendance === 'hadir' && (
                                <React.Fragment>
                                    <label className="sgm-rsvp__label">{t('invitation.rsvp_count')}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="sgm-rsvp__input"
                                        value={data.people_count}
                                        onChange={(e) => setData('people_count', parseInt(e.target.value))}
                                        required
                                    />
                                </React.Fragment>
                            )}

                            <label className="sgm-rsvp__label">{t('invitation.wishes_message')}</label>
                            <textarea
                                className="sgm-rsvp__textarea"
                                rows="4"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                required
                            />

                            <button type="submit" disabled={processing} className="sgm-rsvp__btn-submit">
                                {processing ? (locale === 'en' ? 'Sending...' : 'Mengirim...') : (locale === 'en' ? 'Send' : 'Kirim RSVP')}
                            </button>
                        </form>
                    </Reveal>
                </div>
            )}

            {enableWishes && (
                <div className="sgm-wishes">
                    <Reveal>
                        <h2 className="sgm-section-title">{t('invitation.wishes_title')}</h2>
                        <p className="sgm-section-subtitle">{t('invitation.wishes_desc')}</p>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="sgm-wishes__list">
                            {safeArr(wishes).map((item, idx) => (
                                <div key={item.id || idx} className="sgm-wishes__item">
                                    <div className="sgm-wishes__sender">
                                        <span>{item.sender_name}</span>
                                        {item.attendance && (
                                            <span className="sgm-wishes__badge">
                                                {item.attendance === 'hadir' 
                                                    ? (locale === 'en' ? 'Attending' : 'Hadir') 
                                                    : (locale === 'en' ? 'Not Attending' : 'Tidak Hadir')
                                                }
                                            </span>
                                        )}
                                    </div>
                                    <p className="sgm-wishes__message">{item.message}</p>
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
        <section className="sgm-section sgm-bank" id="bank">
            <Reveal>
                <h2 className="sgm-section-title">{t('invitation.gift_title')}</h2>
                <p className="sgm-section-subtitle">{t('invitation.gift_desc')}</p>
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
                        <div className="sgm-bank__card">
                            <span className={`sgm-bank__copied-indicator ${copiedId === acc.id ? 'is-visible' : ''}`}>
                                {t('invitation.gift_copied')}
                            </span>

                            {bankLogo ? (
                                <img src={bankLogo} alt={acc.bank_name} className="sgm-bank__logo" />
                            ) : (
                                <h4 style={{ marginBottom: 15, fontFamily: 'var(--sgm-font-heading)', color: 'var(--sgm-primary)' }}>
                                    {acc.bank_name}
                                </h4>
                            )}

                            <div className="sgm-bank__number">{acc.account_number}</div>
                            <div className="sgm-bank__holder">{acc.account_name}</div>

                            <button 
                                type="button" 
                                onClick={() => handleCopy(acc.account_number, acc.id)}
                                className="sgm-bank__btn-copy"
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
        <section className="sgm-section sgm-closing" id="closing">
            <Reveal>
                <img src={ASSETS.coverSwan} alt="swan bouquet" className="sgm-closing__ornament" />
                <h2 className="sgm-closing__title">{formatTitle(invitation?.closing_title || t('invitation.closing_title'))}</h2>
            </Reveal>

            {invitation?.closing_text && (
                <Reveal delay={200}>
                    <p className="sgm-closing__text">{invitation.closing_text}</p>
                </Reveal>
            )}

            <Reveal delay={350}>
                <div className="sgm-closing__family">
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
                        <div>
                            {isEn 
                                ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` 
                                : `Kel. Bapak ${bride.father_name} & Ibu ${bride.mother_name}`
                            }
                        </div>
                    )}
                </div>
            </Reveal>

            <Reveal delay={500}>
                <p className="sgm-closing__watermark">
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
            <span style={{ height: 1, width: 60, background: 'var(--sgm-text)', margin: 'auto 10px' }} />
            <i className="fas fa-heart" style={{ color: 'var(--sgm-text)', fontSize: '0.8rem' }} />
            <span style={{ height: 1, width: 60, background: 'var(--sgm-text)', margin: 'auto 10px' }} />
        </div>
    );
}

/* ─── MAIN EXPORT COMPONENT ─── */
export default function DynamicIndex({ invitation, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, isDemo = false }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

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

    // Align navigation tabs centering on active state change
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.sgm-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
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
                const activeSlideContainer = document.querySelector('.sgm-slide-container.is-active');
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
            let slideClass = 'sgm-slide-container';
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
            <div className={`sgm-page ${!showAnimations ? 'theme-no-animations' : ''}`}>
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
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    coverImages={coverImages}
                    events={events}
                />

                {/* Main View Wrapper */}
                <div className="sgm-container">
                    <div
                        className={`sgm-main ${isSlideMode ? 'sgm-main--slide' : ''} ${layoutMode === 'slide-h' ? 'sgm-main--slide-h' : ''} ${layoutMode === 'slide-v' ? 'sgm-main--slide-v' : ''}`}
                        onTouchStart={isSlideMode ? handleTouchStart : undefined}
                        onTouchEnd={isSlideMode ? handleTouchEnd : undefined}
                    >
                        {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                    </div>
                </div>

                {/* Bottom Navigation Menu */}
                {isOpened && navItems.length > 0 && (
                    <nav className="sgm-nav">
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
                                    className={`sgm-nav__item ${isActive ? 'is-active' : ''}`}
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
                    <div className="sgm-controls">
                        {/* Music play equalizer controller */}
                        {invitation?.music_url && (
                            <button 
                                type="button" 
                                onClick={toggleMusic} 
                                className="sgm-btn-control"
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
                            className="sgm-btn-control"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                        </button>

                        {/* Auto Scroll toggle button */}
                        <button 
                            type="button" 
                            onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} 
                            className="sgm-btn-control"
                            style={autoScrollEnabled ? { backgroundColor: 'var(--sgm-primary)', color: '#fff' } : undefined}
                            title={autoScrollEnabled ? 'Disable Auto Scroll' : 'Enable Auto Scroll'}
                        >
                            <i className="fas fa-magic" />
                        </button>

                        {/* QR Code Check-in button */}
                        {enableQr && activeGuest && (
                            <button 
                                type="button" 
                                onClick={() => setShowQr(true)} 
                                className="sgm-btn-control"
                                title="Show Check-in QR"
                            >
                                <i className="fas fa-qrcode" />
                            </button>
                        )}
                    </div>
                )}

                {/* QR Code Presensi Overlay Modal */}
                {enableQr && showQr && activeGuest && (
                    <div className="sgm-modal-overlay">
                        <div className="sgm-modal-card">
                            <h3>Check-in QR Code</h3>
                            <p>{locale === 'en' ? 'Show this QR code to receptionist' : 'Tunjukkan QR code ini ke petugas penerima tamu'}</p>
                            
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=a3b899&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                alt="QR Code Presensi" 
                            />
                            
                            <div>
                                <button 
                                    type="button" 
                                    onClick={() => setShowQr(false)} 
                                    className="sgm-modal-card__btn-close"
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
