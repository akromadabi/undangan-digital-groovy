import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Import theme assets via Vite
import logoBni from './asset/Logo-BNI-Bank-Negara-Indonesia-46-Vector-.png';
import ornamenWayang from './asset/Ornamen-wayang.png';
import ornamenBunga from './asset/Ornamen-bunga.png';
import writingTheWedding from './asset/the-weding.png';
import defaultCoverImg from './asset/the-weding-1024x788.png';
import defaultGroomImg from './asset/02-10.png';
import defaultBrideImg from './asset/01-10.png';
import tOrn1 from './asset/tittle-ornament-1-1024x377.png';
import tOrn2 from './asset/tittle-ornament-2-1024x377.png';

const ASSETS = {
    bni: logoBni,
    wayang: ornamenWayang,
    bunga: ornamenBunga,
    theWeddingText: writingTheWedding,
    cover: defaultCoverImg,
    groom: defaultGroomImg,
    bride: defaultBrideImg,
    ornament1: tOrn1,
    ornament2: tOrn2,
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

function formatDate(d) {
    if (!d) return '';
    return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
    if (!url) return fallback;
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

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#fff', background: '#36251C', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#C5A85C' }}>Terjadi kesalahan pada tema Jawa 2.</h2>
                <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', color: '#FAF6EE', marginTop: 10, maxWidth: '600px', background: 'rgba(0,0,0,0.2)', padding: 15, borderRadius: 8 }}>
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
            setVisible(e.isIntersecting);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return (
            <div className={className}>
                {children}
            </div>
        );
    }

    let baseClass = 'jw2-reveal';
    if (variant === 'zoom') baseClass = 'jw2-reveal--zoom';
    else if (variant === 'left') baseClass = 'jw2-reveal--left';
    else if (variant === 'right') baseClass = 'jw2-reveal--right';

    return (
        <div
            ref={ref}
            className={`${className} ${baseClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   SCENE SECTIONS
   ═══════════════════════════════════════ */

/* ─── COVER ─── */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
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

    const monogram = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'N';
        const second = bride?.nickname?.charAt(0) || 'M';
        return `${first}${second}`;
    }, [groom, bride]);

    const coverBg = getStorageUrl(invitation?.cover_image, ASSETS.cover);

    return (
        <div className={`jw2-cover${isOpened ? ' is-opened' : ''}`}>
            {globalShowPhotos && <div className="jw2-cover__bg" style={{ backgroundImage: `url(${coverBg})` }} />}
            <div className="jw2-cover__overlay" />
            
            {/* Elegant traditional gold corners */}
            <div className="jw2-corner-ornament jw2-corner-ornament--tl" style={{ backgroundImage: `url(${ASSETS.bunga})` }} />
            <div className="jw2-corner-ornament jw2-corner-ornament--tr" style={{ backgroundImage: `url(${ASSETS.bunga})` }} />
            <div className="jw2-corner-ornament jw2-corner-ornament--bl" style={{ backgroundImage: `url(${ASSETS.bunga})` }} />
            <div className="jw2-corner-ornament jw2-corner-ornament--br" style={{ backgroundImage: `url(${ASSETS.bunga})` }} />

            <div className="jw2-cover__content">
                <Reveal className="jw2-cover__monogram-wrap" variant="zoom">
                    <span className="jw2-cover__monogram">{monogram}</span>
                </Reveal>
                
                <Reveal className="jw2-cover__subtitle" delay={200}>
                    {t('invitation.wedding_of').toUpperCase()}
                </Reveal>
                
                <Reveal delay={400}>
                    <img src={ASSETS.theWeddingText} alt="The Wedding Of" className="jw2-cover__wedding-img" />
                </Reveal>

                <Reveal delay={500}>
                    <h1 className="jw2-cover__title">{coupleName}</h1>
                </Reveal>
                
                <Reveal className="jw2-cover__guest-box" delay={600}>
                    <p className="jw2-cover__to">{t('invitation.dear_guest')}</p>
                    <h2 className="jw2-cover__guest-name">{guestName}</h2>
                    {guest?.group_name && <p className="jw2-cover__guest-group">di {guest.group_name}</p>}
                </Reveal>

                <Reveal delay={800}>
                    <button type="button" onClick={onOpen} className="jw2-btn">
                        <i className="fas fa-envelope-open" /> {t('invitation.open_invitation')}
                    </button>
                </Reveal>
            </div>
        </div>
    );
}

/* ─── OPENING ─── */
function OpeningSection({ invitation, brideGrooms }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};
    const first = groom?.nickname?.charAt(0) || '';
    const second = bride?.nickname?.charAt(0) || '';

    const rawOpeningTitle = invitation?.opening_title || '';
    const isWeddingOf = !rawOpeningTitle || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING OF' || 
                        rawOpeningTitle.toUpperCase() === 'PERNIKAHAN' || 
                        rawOpeningTitle.toUpperCase() === 'THE WEDDING';

    return (
        <section id="opening" className="jw2-section jw2-opening">
            <Reveal>
                {isWeddingOf ? (
                    <div className="jw2-opening__header">
                        <span className="jw2-section-subtitle">{t('invitation.wedding_of').toUpperCase()}</span>
                        {first && second && (
                            <div className="jw2-opening__initials">
                                <span className="jw2-opening__initial">{first}</span>
                                <span className="jw2-opening__amp">&amp;</span>
                                <span className="jw2-opening__initial">{second}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <h2 className="jw2-section-title">{invitation?.opening_title || 'Maha Suci Allah'}</h2>
                )}
                
                {invitation?.opening_ayat && (
                    <div className="jw2-opening__quote-container">
                        <p className="jw2-opening__ayat">&ldquo;{invitation.opening_ayat}&rdquo;</p>
                        {invitation?.opening_ayat_source && (
                            <p className="jw2-opening__source">&mdash; {invitation.opening_ayat_source}</p>
                        )}
                    </div>
                )}
                
                <p className="jw2-opening__text">
                    {invitation?.opening_text || 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami menyampaikan kabar bahagia mengenai hari pernikahan kami.'}
                </p>
                
                <img src={ASSETS.wayang} alt="" className="jw2-wayang-divider" />
            </Reveal>
        </section>
    );
}

/* ─── BRIDE & GROOM ─── */
function BrideGroomSection({ brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria' || b.gender === 'male' || String(b.gender).toLowerCase() === 'pria' || String(b.gender).toLowerCase() === 'male') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita' || b.gender === 'female' || String(b.gender).toLowerCase() === 'wanita' || String(b.gender).toLowerCase() === 'female') || bgs[1] || bgs[0] || {};

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

    const groomPhoto = getStorageUrl(groom.photo, ASSETS.groom);
    const bridePhoto = getStorageUrl(bride.photo, ASSETS.bride);

    return (
        <section id="bride_groom" className="jw2-section jw2-couple">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{t('invitation.mempelai')}</h2>
                <p className="jw2-section-subtitle">Groom &amp; Bride</p>
            </Reveal>

            {/* Groom */}
            <Reveal className="jw2-mempelai-card" variant="left">
                {globalShowPhotos && groom.photo ? (
                    <div className="jw2-mempelai-photo-wrap">
                        <img src={groomPhoto} alt={groom.full_name || 'Groom'} className="jw2-mempelai-photo" />
                    </div>
                ) : (
                    <div className="jw2-mempelai-monogram-wrap">
                        <span className="jw2-mempelai-monogram">{groom.nickname?.charAt(0) || 'G'}</span>
                    </div>
                )}
                
                <div className="jw2-mempelai-details">
                    <h3 className="jw2-mempelai-name">{groom.full_name || 'Nama Lengkap Pria'}</h3>
                    <p className="jw2-mempelai-parent-label">
                        {translateChildOrder(groom.child_order, 'pria')}
                    </p>
                    <p className="jw2-mempelai-parents">
                        {groom.father_name && groom.mother_name
                            ? (locale === 'en' ? `Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`)
                            : (groom.father_name || groom.mother_name || (locale === 'en' ? 'Parents Name' : 'Nama Orang Tua'))}
                    </p>
                    {groom.instagram && (
                        <a
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="jw2-mempelai-ig"
                            title={`Instagram ${groom.instagram}`}
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </div>
            </Reveal>

            <Reveal variant="zoom">
                <div className="jw2-mempelai-amp">&amp;</div>
            </Reveal>

            {/* Bride */}
            <Reveal className="jw2-mempelai-card" variant="right">
                {globalShowPhotos && bride.photo ? (
                    <div className="jw2-mempelai-photo-wrap">
                        <img src={bridePhoto} alt={bride.full_name || 'Bride'} className="jw2-mempelai-photo" />
                    </div>
                ) : (
                    <div className="jw2-mempelai-monogram-wrap">
                        <span className="jw2-mempelai-monogram">{bride.nickname?.charAt(0) || 'B'}</span>
                    </div>
                )}
                
                <div className="jw2-mempelai-details">
                    <h3 className="jw2-mempelai-name">{bride.full_name || 'Nama Lengkap Wanita'}</h3>
                    <p className="jw2-mempelai-parent-label">
                        {translateChildOrder(bride.child_order, 'wanita')}
                    </p>
                    <p className="jw2-mempelai-parents">
                        {bride.father_name && bride.mother_name
                            ? (locale === 'en' ? `Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`)
                            : (bride.father_name || bride.mother_name || (locale === 'en' ? 'Parents Name' : 'Nama Orang Tua'))}
                    </p>
                    {bride.instagram && (
                        <a
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="jw2-mempelai-ig"
                            title={`Instagram ${bride.instagram}`}
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ─── EVENTS ─── */
function EventsSection({ events, countdownTime, invitation }) {
    const { t } = useTranslation();
    const evList = safeArr(events);

    return (
        <section id="event" className="jw2-section">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{t('invitation.acara')}</h2>
                <p className="jw2-section-subtitle">Save The Date</p>
            </Reveal>

            {/* countdown timer integrated inside event section according to SOP */}
            {countdownTime && parseBool(invitation?.show_countdown, true) && (
                <Reveal className="jw2-countdown-widget" variant="zoom">
                    <div className="jw2-countdown-item">
                        <span className="jw2-countdown-val">{pad2(countdownTime.d)}</span>
                        <span className="jw2-countdown-label">{t('invitation.days')}</span>
                    </div>
                    <div className="jw2-countdown-item">
                        <span className="jw2-countdown-val">{pad2(countdownTime.h)}</span>
                        <span className="jw2-countdown-label">{t('invitation.hours')}</span>
                    </div>
                    <div className="jw2-countdown-item">
                        <span className="jw2-countdown-val">{pad2(countdownTime.m)}</span>
                        <span className="jw2-countdown-label">{t('invitation.minutes')}</span>
                    </div>
                    <div className="jw2-countdown-item">
                        <span className="jw2-countdown-val">{pad2(countdownTime.s)}</span>
                        <span className="jw2-countdown-label">{t('invitation.seconds')}</span>
                    </div>
                </Reveal>
            )}

            {evList.map((ev, i) => {
                const { dayNum, dayName, monthName, year } = parseEventDate(ev.event_date);
                const isPrimary = ev.is_primary || i === 0;
                
                return (
                    <Reveal key={ev.id || i} className={`jw2-event-card ${isPrimary ? 'jw2-event-card--primary' : ''}`} variant={i % 2 === 0 ? 'left' : 'right'}>
                        {isPrimary && <span className="jw2-event-badge">{t('invitation.main_event')}</span>}
                        <h3 className="jw2-event-name">{ev.event_name}</h3>
                        
                        <div className="jw2-event-date-row">
                            <div className="jw2-event-day">{dayNum}</div>
                            <div className="jw2-event-month-year">{monthName} {year}</div>
                            <div className="jw2-event-day-name">{dayName}</div>
                        </div>

                        <div className="jw2-event-detail">
                            <i className="far fa-clock" />
                            <div>
                                <p className="jw2-event-detail__title">{t('invitation.time')}</p>
                                <p>{formatTime(ev.start_time)} - {ev.end_time ? formatTime(ev.end_time) : 'Selesai'} {ev.timezone || 'WIB'}</p>
                            </div>
                        </div>

                        <div className="jw2-event-detail">
                            <i className="fas fa-map-marker-alt" />
                            <div>
                                <p className="jw2-event-detail__title">{t('invitation.place')}</p>
                                <p style={{ fontWeight: '700' }}>{ev.venue_name}</p>
                                <p style={{ fontSize: '0.8rem', marginTop: 4 }}>{ev.venue_address}</p>
                            </div>
                        </div>

                        {ev.gmaps_link && (
                            <button
                                type="button"
                                onClick={() => window.open(ev.gmaps_link, '_blank')}
                                className="jw2-btn"
                            >
                                <i className="fas fa-map-marked-alt" /> GOOGLE MAPS
                            </button>
                        )}
                    </Reveal>
                );
            })}
        </section>
    );
}

/* ─── LOVE STORY ─── */
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const stories = safeArr(loveStories).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (stories.length === 0) return null;

    return (
        <section id="love_story" className="jw2-section">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{t('invitation.kisah_cinta')}</h2>
                <p className="jw2-section-subtitle">Our Love Journey</p>
            </Reveal>

            <div className="jw2-story-timeline">
                {stories.map((story, i) => (
                    <div key={story.id || i} className="jw2-story-item">
                        <Reveal variant="left">
                            <div className="jw2-story-date">
                                {story.story_date ? new Date(story.story_date).getFullYear() : 'Memory'}
                            </div>
                            <div className="jw2-story-card">
                                <h4 className="jw2-story-title">{story.title}</h4>
                                <p className="jw2-story-desc">{story.description}</p>
                            </div>
                        </Reveal>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─── GALLERY ─── */
function GallerySection({ galleries }) {
    const { t } = useTranslation();
    const galls = safeArr(galleries).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (galls.length === 0) return null;

    return (
        <section id="gallery" className="jw2-section">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{t('invitation.galeri')}</h2>
                <p className="jw2-section-subtitle">Wedding Album</p>
            </Reveal>

            <Reveal className="jw2-gallery-grid" variant="zoom">
                {galls.map((g, i) => (
                    <div key={g.id || i} className="jw2-gallery-item">
                        <img
                            src={getStorageUrl(g.image_url, ASSETS.cover)}
                            alt={g.caption || 'Album'}
                            className="jw2-gallery-img"
                            loading="lazy"
                        />
                    </div>
                ))}
            </Reveal>
        </section>
    );
}

/* ─── LIVE STREAMING (MANDATORY AUTOHIDE RULE) ─── */
function LiveStreamingSection({ events, invitation }) {
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

    return (
        <section className="jw2-section" id="livestream">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">Siaran Langsung</h2>
                <p className="jw2-section-subtitle">Live Streaming</p>
            </Reveal>
            
            <Reveal className="jw2-rsvp-wishes-box" variant="zoom" style={{ padding: '30px 20px' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--soga-light)', marginBottom: 25, lineHeight: 1.6 }}>
                    Saksikan momen bahagia pernikahan kami secara virtual dari mana saja melalui tombol siaran di bawah ini:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                    {streamsList.map((stream, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => window.open(stream.url, '_blank')}
                            className="jw2-btn"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ─── REKENING & KADO ─── */
function BankSection({ bankAccounts }) {
    const { t } = useTranslation();
    const accts = safeArr(bankAccounts);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (num, id) => {
        // WebView & iOS safe dynamic textarea fallback according to SOP
        const ta = document.createElement('textarea');
        ta.value = num;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (e) {
            console.error("Copy failed", e);
        }
        document.body.removeChild(ta);
    };

    if (accts.length === 0) return null;

    return (
        <section id="bank" className="jw2-section">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{t('invitation.hadiah')}</h2>
                <p className="jw2-section-subtitle">Gift &amp; Bank Accounts</p>
            </Reveal>

            <div className="jw2-bank-container">
                {accts.map((bk, i) => {
                    const isBni = String(bk.bank_name).toLowerCase().includes('bni');
                    const cardLogo = isBni ? ASSETS.bni : null;

                    return (
                        <Reveal key={bk.id || i} className="jw2-bank-card" variant={i % 2 === 0 ? 'left' : 'right'}>
                            <div className="jw2-bank-header">
                                <span className="jw2-bank-type">{bk.bank_name}</span>
                                {cardLogo && <img src={cardLogo} alt={bk.bank_name} className="jw2-bank-logo" />}
                            </div>
                            
                            {/* Electronic gold card chip */}
                            <svg className="jw2-bank-chip" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100" height="80" rx="15" fill="url(#chipGold)" />
                                <rect x="15" y="15" width="70" height="50" rx="10" stroke="#FAF6EE" strokeWidth="2" opacity="0.3" />
                                <line x1="50" y1="15" x2="50" y2="65" stroke="#FAF6EE" strokeWidth="2" opacity="0.3" />
                                <line x1="15" y1="40" x2="85" y2="40" stroke="#FAF6EE" strokeWidth="2" opacity="0.3" />
                                <defs>
                                    <linearGradient id="chipGold" x1="0" y1="0" x2="100" y2="80" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#DFCD8D" />
                                        <stop offset="0.5" stopColor="#C5A85C" />
                                        <stop offset="1" stopColor="#A4843D" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="jw2-bank-number">{bk.account_number}</div>
                            <div className="jw2-bank-holder">a.n. {bk.account_name}</div>

                            <button
                                type="button"
                                onClick={() => handleCopy(bk.account_number, bk.id || i)}
                                className="jw2-btn"
                            >
                                <i className={copiedId === (bk.id || i) ? "fas fa-check" : "far fa-copy"} />
                                {copiedId === (bk.id || i) ? 'TERSALIN' : 'SALIN'}
                            </button>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}

/* ─── RSVP & UCAPAN (UNIFIED FORM ACCORDING TO SOP) ─── */
function RsvpWishesSection({ invitation, guest, wishes, onSubmitRsvp, rsvpForm, onSubmitWish, wishForm }) {
    const { t } = useTranslation();
    
    const rsvpActive = parseBool(invitation?.enable_rsvp, true);
    const wishesActive = parseBool(invitation?.enable_wishes, true);
    
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || '';

    // Pre-populate name from URL if blank
    useEffect(() => {
        if (guestName && !wishForm.data.sender_name) {
            wishForm.setData('sender_name', guestName);
        }
    }, [guestName]);

    if (!rsvpActive && !wishesActive) return null;

    return (
        <section id="rsvp" className="jw2-section">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">
                    {rsvpActive ? t('invitation.rsvp') : 'Buku Tamu'}
                </h2>
                <p className="jw2-section-subtitle">RSVP &amp; Guest Book</p>
            </Reveal>

            <Reveal className="jw2-rsvp-wishes-box" variant="zoom">
                {rsvpActive && (
                    <form onSubmit={onSubmitRsvp} style={{ marginBottom: wishesActive ? '30px' : '0' }}>
                        <div className="jw2-form-group">
                            <label className="jw2-form-label">{t('invitation.rsvp_attendance')}</label>
                            <select
                                className="jw2-form-input"
                                value={rsvpForm.data.attendance}
                                onChange={e => rsvpForm.setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{t('invitation.attendance_attend')}</option>
                                <option value="tidak_hadir">{t('invitation.attendance_absent')}</option>
                                <option value="belum_pasti">{t('invitation.attendance_uncertain')}</option>
                            </select>
                        </div>

                        {rsvpForm.data.attendance === 'hadir' && (
                            <div className="jw2-form-group">
                                <label className="jw2-form-label">{t('invitation.rsvp_guests')}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className="jw2-form-input"
                                    value={rsvpForm.data.number_of_guests}
                                    onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value) || 1)}
                                />
                            </div>
                        )}

                        <button type="submit" disabled={rsvpForm.processing} className="jw2-btn">
                            {rsvpForm.processing ? 'Mengirim...' : 'Konfirmasi Kehadiran'}
                        </button>
                    </form>
                )}

                {wishesActive && (
                    <form onSubmit={onSubmitWish}>
                        <div className="jw2-form-group">
                            <label className="jw2-form-label">Nama Pengirim</label>
                            <input
                                type="text"
                                required
                                className="jw2-form-input"
                                placeholder="Masukkan nama Anda"
                                value={wishForm.data.sender_name}
                                onChange={e => wishForm.setData('sender_name', e.target.value)}
                            />
                        </div>

                        <div className="jw2-form-group">
                            <label className="jw2-form-label">Ucapan &amp; Doa Restu</label>
                            <textarea
                                required
                                rows="3"
                                className="jw2-form-input"
                                placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                                value={wishForm.data.message}
                                onChange={e => wishForm.setData('message', e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={wishForm.processing} className="jw2-btn">
                            {wishForm.processing ? 'Mengirim...' : 'Kirim Ucapan'}
                        </button>
                    </form>
                )}

                {/* Wishes Scrollable List capped at max 5 items recursively */}
                {wishesActive && wishes && wishes.length > 0 && (
                    <div className="jw2-wishes-list">
                        {wishes.map((w, idx) => (
                            <div key={w.id || idx} className="jw2-wish-card">
                                <div className="jw2-wish-header">
                                    <span className="jw2-wish-sender">{w.sender_name}</span>
                                    {w.attendance && (
                                        <span className={`jw2-wish-status jw2-wish-status--${w.attendance}`}>
                                            {w.attendance}
                                        </span>
                                    )}
                                </div>
                                <p className="jw2-wish-message">{w.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ─── CLOSING ─── */
function ClosingSection({ invitation, brideGrooms }) {
    const { t, locale } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const hasGroomParents = !!(groom.father_name || groom.mother_name);
    const hasBrideParents = !!(bride.father_name || bride.mother_name);

    return (
        <section id="closing" className="jw2-section jw2-closing">
            <Reveal variant="zoom">
                <h2 className="jw2-section-title">{invitation?.closing_title || 'Matur Nuwun'}</h2>
                <p className="jw2-section-subtitle">Thank You</p>
            </Reveal>

            <Reveal className="jw2-closing__text" variant="zoom">
                <p>
                    {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa dan restu.'}
                </p>
            </Reveal>

            {(hasGroomParents || hasBrideParents) && (
                <Reveal className="jw2-closing__signature" variant="zoom">
                    <h4 className="jw2-closing__sig-title">Kami yang berbahagia</h4>
                    
                    <div className="jw2-closing__sig-names" style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 15 }}>
                        {hasBrideParents && (
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>Kel. Mempelai Wanita:</p>
                                <p style={{ marginTop: 2 }}>
                                    {bride.father_name && bride.mother_name 
                                        ? `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`
                                        : (bride.father_name || bride.mother_name)}
                                </p>
                            </div>
                        )}
                        {hasGroomParents && (
                            <div style={{ marginTop: 5 }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>Kel. Mempelai Pria:</p>
                                <p style={{ marginTop: 2 }}>
                                    {groom.father_name && groom.mother_name 
                                        ? `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`
                                        : (groom.father_name || groom.mother_name)}
                                </p>
                            </div>
                        )}
                    </div>
                </Reveal>
            )}
            
            <img src={ASSETS.wayang} alt="" className="jw2-wayang-divider" style={{ filter: 'brightness(0) invert(1)' }} />
        </section>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function DynamicIndex({
    invitation,
    sections,
    brideGrooms,
    events,
    galleries,
    loveStories,
    bankAccounts,
    guest,
    wishes,
}) {
    const { t } = useTranslation();
    const audioRef = useRef(null);

    // Dynamic global overrides
    globalShowPhotos = parseBool(invitation?.show_photos, true) && !parseBool(invitation?.hide_photos, false);
    globalShowAnimations = parseBool(invitation?.show_animations, true);

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState('cover');
    const [slideIdx, setSlideIdx] = useState(0);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(parseBool(invitation?.enable_auto_scroll, true));

    // Handle RSVP Form
    const rsvpForm = useForm({
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: guest?.id || null
    });
    const handleRsvpSubmit = (e) => {
        e.preventDefault();
        rsvpForm.post(route('invitation.rsvp', invitation.slug), {
            preserveScroll: true
        });
    };

    // Handle Wish Form
    const wishForm = useForm({
        sender_name: guest?.name || '',
        message: '',
        guest_id: guest?.id || null
    });
    const handleWishSubmit = (e) => {
        e.preventDefault();
        wishForm.post(route('invitation.wish', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => wishForm.reset('message')
        });
    };

    // Auto-calculating sections to show
    const resolvedSections = useMemo(() => {
        const list = safeArr(sections).filter(s => s.is_visible);
        
        // Mode Tanpa Foto filter out gallery
        if (!globalShowPhotos) {
            return list.filter(s => s.section_key !== 'gallery');
        }
        
        // Remove wishes if rsvp exists to prevent duplicate forms
        const hasRsvp = list.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            return list.filter(s => s.section_key !== 'wishes');
        }
        
        return list;
    }, [sections]);

    // Layout settings
    const layoutMode = invitation?.theme?.supports_slide && invitation?.menu_position !== 'none'
        ? (invitation?.menu_position === 'vertical' ? 'slide-v' : 'slide-h')
        : 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v';

    // Countdown Timer Calculator
    const [countdownTime, setCountdownTime] = useState(null);
    useEffect(() => {
        const firstEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (!firstEvent?.event_date) return;
        
        const dateStr = String(firstEvent.event_date).substring(0, 10);
        const timeStr = firstEvent.start_time ? firstEvent.start_time.substring(0, 5) : '08:00';
        const target = new Date(`${dateStr}T${timeStr}:00`);
        if (isNaN(target.getTime())) return;

        const calculate = () => {
            const diff = target.getTime() - Date.now();
            if (diff <= 0) {
                setCountdownTime({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
            setCountdownTime({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [events]);

    // Playback control
    const toggleMusic = useCallback(() => {
        const aud = audioRef.current;
        if (!aud) return;
        if (isPlaying) {
            aud.pause();
            setIsPlaying(false);
        } else {
            aud.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [isPlaying]);

    // Auto-play when opened
    const handleOpenInvitation = () => {
        setIsOpened(true);
        setActiveSection('opening');
        
        // Fullscreen API browser trigger according to SOP
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        
        // Auto play audio
        const aud = audioRef.current;
        if (aud && parseBool(invitation?.music_autoplay, true)) {
            aud.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    };

    // Stale closure hook syncing slide index with active Section key according to SOP
    useEffect(() => {
        if (!isSlideMode) return;
        const target = resolvedSections[slideIdx];
        if (target) {
            setActiveSection(target.section_key);
        }
    }, [slideIdx, resolvedSections, isSlideMode]);

    // Scrollspy for normal scroll mode
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        
        const handleScrollspy = () => {
            const divs = document.querySelectorAll('[data-jw2-sec]');
            let current = 'opening';
            divs.forEach(div => {
                const rect = div.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4) {
                    current = div.id;
                }
            });
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScrollspy, { passive: true });
        return () => window.removeEventListener('scroll', handleScrollspy);
    }, [isOpened, isSlideMode]);

    // Auto Scroll Logic (Pixel-by-pixel or slide shifts with delay)
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        
        let timer = null;
        if (isSlideMode) {
            // Slide Auto rotation
            timer = setInterval(() => {
                setSlideIdx(prev => {
                    if (prev >= resolvedSections.length - 1) {
                        return 0; // rotate back to first slide
                    }
                    return prev + 1;
                });
            }, 5000);
        } else {
            // Scroll pixel-by-pixel
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const reachedBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 6);
                if (reachedBottom) {
                    setAutoScrollEnabled(false);
                }
            }, 30);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Reseller Brand credits according to SOP
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const musicUrl = invitation?.music_url || '/audio/backsound.mp3';

    return (
        <ErrorBoundary>
            <div className={`jw2-root ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                <div className="jw2-bg-pattern" />

                {/* Background music audio player */}
                <audio ref={audioRef} src={musicUrl} loop style={{ display: 'none' }} />

                {/* Audio disk widget */}
                {isOpened && (
                    <div
                        onClick={toggleMusic}
                        className={`jw2-music-widget ${isPlaying ? 'jw2-music-widget--spinning' : ''}`}
                        title="Putar Musik"
                    >
                        <i className={isPlaying ? "fas fa-compact-disc" : "fas fa-play"} />
                    </div>
                )}

                {/* Cover view screen wrapper */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                />

                {isOpened && (
                    <>
                        {/* Particle aesthetic overlay */}
                        {invitation?.particle_type && invitation.particle_type !== 'none' && (
                            <ParticleEffect type={invitation.particle_type} />
                        )}

                        {/* Rendering: Scroll Mode */}
                        {!isSlideMode && (
                            <div className="jw2-scroll-wrapper">
                                {resolvedSections.map((sec, idx) => (
                                    <div key={sec.id || idx} id={sec.section_key} data-jw2-sec data-section={sec.section_key}>
                                        {sec.section_key === 'opening' && <OpeningSection invitation={invitation} brideGrooms={brideGrooms} />}
                                        {sec.section_key === 'bride_groom' && <BrideGroomSection brideGrooms={brideGrooms} />}
                                        {sec.section_key === 'countdown' && <EventsSection events={events} countdownTime={countdownTime} invitation={invitation} />}
                                        {sec.section_key === 'event' && <EventsSection events={events} countdownTime={countdownTime} invitation={invitation} />}
                                        {sec.section_key === 'love_story' && <LoveStorySection loveStories={loveStories} />}
                                        {sec.section_key === 'gallery' && <GallerySection galleries={galleries} />}
                                        {sec.section_key === 'rsvp' && (
                                            <RsvpWishesSection
                                                invitation={invitation}
                                                guest={guest}
                                                wishes={wishes}
                                                onSubmitRsvp={handleRsvpSubmit}
                                                rsvpForm={rsvpForm}
                                                onSubmitWish={handleWishSubmit}
                                                wishForm={wishForm}
                                            />
                                        )}
                                        {sec.section_key === 'wishes' && (
                                            <RsvpWishesSection
                                                invitation={invitation}
                                                guest={guest}
                                                wishes={wishes}
                                                onSubmitRsvp={handleRsvpSubmit}
                                                rsvpForm={rsvpForm}
                                                onSubmitWish={handleWishSubmit}
                                                wishForm={wishForm}
                                            />
                                        )}
                                        {sec.section_key === 'bank' && <BankSection bankAccounts={bankAccounts} />}
                                        {sec.section_key === 'closing' && <ClosingSection invitation={invitation} brideGrooms={brideGrooms} />}
                                    </div>
                                ))}

                                {/* Live Streaming Auto-hide section */}
                                <LiveStreamingSection events={events} invitation={invitation} />
                                
                                {/* Reseller Branding credits */}
                                <div style={{ textAlign: 'center', padding: '20px 0 40px' }}>
                                    <p className="jw2-watermark">
                                        Made with ❤️ by {brandName}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Rendering: Slide / Tab Mode (Parallel DOM Rendering) */}
                        {isSlideMode && (
                            <div className={`jw2-slide-wrapper mode-${layoutMode === 'slide-v' ? 'vertical' : 'horizontal'}`}>
                                {resolvedSections.map((sec, idx) => {
                                    let stateClass = 'is-next';
                                    if (idx === slideIdx) stateClass = 'is-active';
                                    else if (idx < slideIdx) stateClass = 'is-prev';

                                    return (
                                        <div key={sec.id || idx} className={`jw2-slide-container ${stateClass}`}>
                                            {sec.section_key === 'opening' && <OpeningSection invitation={invitation} brideGrooms={brideGrooms} />}
                                            {sec.section_key === 'bride_groom' && <BrideGroomSection brideGrooms={brideGrooms} />}
                                            {sec.section_key === 'countdown' && <EventsSection events={events} countdownTime={countdownTime} invitation={invitation} />}
                                            {sec.section_key === 'event' && <EventsSection events={events} countdownTime={countdownTime} invitation={invitation} />}
                                            {sec.section_key === 'love_story' && <LoveStorySection loveStories={loveStories} />}
                                            {sec.section_key === 'gallery' && <GallerySection galleries={galleries} />}
                                            {sec.section_key === 'rsvp' && (
                                                <RsvpWishesSection
                                                    invitation={invitation}
                                                    guest={guest}
                                                    wishes={wishes}
                                                    onSubmitRsvp={handleRsvpSubmit}
                                                    rsvpForm={rsvpForm}
                                                    onSubmitWish={handleWishSubmit}
                                                    wishForm={wishForm}
                                                />
                                            )}
                                            {sec.section_key === 'wishes' && (
                                                <RsvpWishesSection
                                                    invitation={invitation}
                                                    guest={guest}
                                                    wishes={wishes}
                                                    onSubmitRsvp={handleRsvpSubmit}
                                                    rsvpForm={rsvpForm}
                                                    onSubmitWish={handleWishSubmit}
                                                    wishForm={wishForm}
                                                />
                                            )}
                                            {sec.section_key === 'bank' && <BankSection bankAccounts={bankAccounts} />}
                                            {sec.section_key === 'closing' && (
                                                <>
                                                    <ClosingSection invitation={invitation} brideGrooms={brideGrooms} />
                                                    
                                                    {/* Live Streaming section inside parallel list */}
                                                    <LiveStreamingSection events={events} invitation={invitation} />
                                                    
                                                    <div style={{ textAlign: 'center', padding: '10px 0 80px' }}>
                                                        <p className="jw2-watermark">
                                                            Made with ❤️ by {brandName}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Floating bottom navigation bar */}
                        {invitation?.menu_position && invitation.menu_position !== 'none' && (
                            <div className="jw2-menu-bar">
                                {resolvedSections.map((sec, idx) => {
                                    const isActive = isSlideMode ? idx === slideIdx : activeSection === sec.section_key;
                                    
                                    // Icons map according to slug
                                    const iconMap = {
                                        opening: 'fa-home',
                                        bride_groom: 'fa-heart',
                                        countdown: 'fa-calendar-alt',
                                        event: 'fa-calendar-alt',
                                        love_story: 'fa-history',
                                        gallery: 'fa-images',
                                        rsvp: 'fa-user-check',
                                        wishes: 'fa-comment-alt',
                                        bank: 'fa-gift',
                                        closing: 'fa-handshake',
                                    };
                                    
                                    const icon = iconMap[sec.section_key] || 'fa-star';
                                    
                                    return (
                                        <button
                                            key={sec.id || idx}
                                            type="button"
                                            onClick={() => {
                                                if (isSlideMode) {
                                                    setSlideIdx(idx);
                                                } else {
                                                    const el = document.getElementById(sec.section_key);
                                                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }}
                                            className={`jw2-menu-btn ${isActive ? 'jw2-menu-btn--active' : ''}`}
                                            title={sec.section_name}
                                        >
                                            <i className={`fas ${icon}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}
