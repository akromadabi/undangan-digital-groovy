import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
 
// Import assets via Vite
import backgroundImg from './asset/background.webp';
import birdsImg from './asset/birds.webp';
import coupleImg from './asset/couple.webp';
import foregroundImg from './asset/foreground.webp';
import kurmaImg from './asset/kurma.webp';
import brushBg from './asset/brush-bg.webp';
import bcaLogo from './asset/bca.png';
import gopayLogo from './asset/gopay.png';
import momentusLogo from './asset/momentus-logo.svg';
 
const ASSETS = {
    background: backgroundImg,
    birds: birdsImg,
    couple: coupleImg,
    foreground: foregroundImg,
    kurma: kurmaImg,
    brush: brushBg,
    bca: bcaLogo,
    gopay: gopayLogo,
    logo: momentusLogo,
};
 
/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}
 
function parseBool(val, defaultVal = true) {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
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
 
/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 20, color: '#FAF3EA', background: '#2A1F17', minHeight: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#D4AF37' }}>Terjadi kesalahan pada rendering tema Dusk Mosque.</h2>
                <pre style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', color: '#EFE8D8', marginTop: 10, maxWidth: '600px' }}>
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
        return <div className={className}>{children}</div>;
    }
 
    let animClass = 'dusk-mosque-reveal--up';
    if (variant === 'pop') animClass = 'dusk-mosque-reveal--pop';
    else if (variant === 'left') animClass = 'dusk-mosque-reveal--left';
    else if (variant === 'right') animClass = 'dusk-mosque-reveal--right';
 
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
   SUB-COMPONENTS (SOP INDIVIDUAL SECTIONS)
   ═══════════════════════════════════════ */
 
/* ─── 1. COVER SECTION ─── */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
 
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';
 
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Rizki & Aisyah');
 
    const initials = useMemo(() => {
        const first = groom?.nickname?.charAt(0) || 'R';
        const second = bride?.nickname?.charAt(0) || 'A';
        return `${first}${second}`;
    }, [groom, bride]);
 
    const coverBg = getStorageUrl(invitation?.cover_image, ASSETS.background);
 
    return (
        <div className={`dusk-mosque-cover ${isOpened ? 'is-hidden' : ''}`}>
            {globalShowPhotos && <div className="dusk-mosque-cover__bg" style={{ backgroundImage: `url(${coverBg})` }} />}
            <div className="dusk-mosque-cover__overlay" />
            <div className="dusk-mosque-cover__content">
                <div className="dusk-mosque-cover__monogram-container">
                    <div className="dusk-mosque-cover__circle-logo">
                        <svg viewBox="0 0 100 100">
                            <path id="circlePath" fill="none" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                            <text>
                                <textPath href="#circlePath" startOffset="0%">
                                    • THE WEDDING OF • THE WEDDING OF
                                </textPath>
                            </text>
                        </svg>
                        <div className="dusk-mosque-cover__monogram">{initials}</div>
                    </div>
                </div>
 
                <div>
                    <p className="dusk-mosque-cover__intro">The Wedding of</p>
                    <h1 className="dusk-mosque-cover__names">{coupleName}</h1>
                    <p className="dusk-mosque-cover__date">{invitation?.cover_subtitle || 'Minggu, 20 Juni 2027'}</p>
                </div>
 
                <div className="dusk-mosque-cover__bottom">
                    <p className="dusk-mosque-cover__greeting">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <div className="dusk-mosque-cover__guest">{guestName}</div>
                    <button type="button" onClick={onOpen} id="tombol-buka" className="dusk-mosque-cover__btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Buka Undangan
                    </button>
                </div>
            </div>
        </div>
    );
}
 
/* ─── 2. VERSE SECTION ─── */
function VerseSection({ invitation, brideGrooms }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    
    const coupleHash = groom.nickname && bride.nickname
        ? `#${bride.nickname}${groom.nickname}`
        : '#AisyahRizki';
 
    return (
        <div className="dusk-mosque-verse">
            <span className="dusk-mosque-verse-hashtag">{coupleHash}</span>
            <span className="dusk-mosque-verse-text">
                “{invitation?.opening_ayat || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.'}”
            </span>
            <span className="dusk-mosque-verse-ref">
                {invitation?.opening_ayat_source || 'QS. Ar-Rum: 21'}
            </span>
        </div>
    );
}
 
/* ─── 3. COUPLE / BRIDE GROOM CARD ─── */
function CoupleCard({ person, gender, locale }) {
    const initials = useMemo(() => {
        return person.nickname?.charAt(0) || (gender === 'wanita' ? 'A' : 'R');
    }, [person, gender]);
 
    const translateChildOrder = (childOrder, g) => {
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
        const isWanita = g === 'wanita';
        
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
 
    const igHandle = (person.instagram || '').replace('@', '');
 
    return (
        <div>
            {globalShowPhotos && person.photo ? (
                <div className="dusk-mosque-couple-avatar-fallback" style={{ backgroundImage: `url(${getStorageUrl(person.photo, '')})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '2px solid var(--warm)' }}></div>
            ) : (
                <div className="dusk-mosque-couple-avatar-fallback">{initials}</div>
            )}
            
            <h2 className="dusk-mosque-couple-short">{person.nickname || (gender === 'wanita' ? 'Aisyah' : 'Rizki')}</h2>
            <h3 className="dusk-mosque-couple-full">{person.full_name || 'Nama Lengkap Mempelai'}</h3>
            <p className="dusk-mosque-couple-relation">{translateChildOrder(person.child_order, gender)}</p>
            <p className="dusk-mosque-couple-parents">
                {person.father_name && person.mother_name
                    ? (locale === 'en' ? `Mr. ${person.father_name} & Mrs. ${person.mother_name}` : `Bapak ${person.father_name} & Ibu ${person.mother_name}`)
                    : (person.father_name || person.mother_name || 'Nama Orang Tua')}
            </p>
            
            {igHandle && (
                <a className="dusk-mosque-couple-ig" href={`https://instagram.com/${igHandle}`} target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>@{igHandle}</span>
                </a>
            )}
        </div>
    );
}
 
/* ─── 4. EVENTS & COUNTDOWN SECTION ─── */
function EventSection({ events, countdownDate, locale }) {
    const { t } = useTranslation();
    const isEn = locale === 'en';
    const list = safeArr(events);
    
    // Timer
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!countdownDate) return;
        const target = new Date(countdownDate).getTime();
        if (isNaN(target)) return;
 
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = target - now;
            
            if (diff <= 0) {
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
                clearInterval(interval);
            } else {
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [countdownDate]);
 
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
 
    const formatTime = (timeStr) => {
        if (!timeStr || timeStr.toLowerCase() === 'selesai') return timeStr || '';
        return timeStr.substring(0, 5);
    };
 
    return (
        <div className="dusk-mosque-event-container">
            {/* Embedded Countdown at the top (SOP Rule 4.3) */}
            {countdownDate && (
                <div style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(115,91,63,0.1)', paddingBottom: '1.5rem' }}>
                    <p className="dusk-mosque-countdown-title">{isEn ? 'COUNTDOWN TO OUR HAPPY DAY' : 'MENGHITUNG MUNDUR HARI BAHAGIA'}</p>
                    <div className="dusk-mosque-countdown-grid">
                        <div className="dusk-mosque-countdown-unit">
                            <span className="dusk-mosque-countdown-value">{timeLeft.d}</span>
                            <span className="dusk-mosque-countdown-label">{isEn ? 'Days' : 'Hari'}</span>
                        </div>
                        <div className="dusk-mosque-countdown-unit">
                            <span className="dusk-mosque-countdown-value">{timeLeft.h}</span>
                            <span className="dusk-mosque-countdown-label">{isEn ? 'Hours' : 'Jam'}</span>
                        </div>
                        <div className="dusk-mosque-countdown-unit">
                            <span className="dusk-mosque-countdown-value">{timeLeft.m}</span>
                            <span className="dusk-mosque-countdown-label">{isEn ? 'Mins' : 'Menit'}</span>
                        </div>
                        <div className="dusk-mosque-countdown-unit">
                            <span className="dusk-mosque-countdown-value">{timeLeft.s}</span>
                            <span className="dusk-mosque-countdown-label">{isEn ? 'Secs' : 'Detik'}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Events List */}
            {list.map((ev, idx) => (
                <div key={idx} className="dusk-mosque-event-block">
                    <h3 className="dusk-mosque-event-label">{ev.event_name || (ev.event_type === 'akad' ? 'Akad Nikah' : 'Resepsi')}</h3>
                    <p className="dusk-mosque-event-date">{formatDate(ev.event_date)}</p>
                    <p className="dusk-mosque-event-date">{formatTime(ev.start_time)} – {formatTime(ev.end_time)} {ev.timezone || 'WIB'}</p>
                    <p className="dusk-mosque-event-venue">{ev.venue_name}</p>
                    <p className="dusk-mosque-event-address">{ev.venue_address}</p>
                    
                    {ev.gmaps_link && (
                        <a className="dusk-mosque-event-map-btn" href={ev.gmaps_link} target="_blank" rel="noopener noreferrer">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>{isEn ? 'View Location' : 'Lihat Lokasi'}</span>
                        </a>
                    )}
                </div>
            ))}
            
            {/* Golden Hour Dresscode */}
            <div className="dusk-mosque-dresscode">
                <p className="dusk-mosque-dresscode-title">Dress Code</p>
                <p className="dusk-mosque-dresscode-desc">{isEn ? 'We highly appreciate guests wearing Muslim apparel in golden hour color scheme.' : 'Kami mengharapkan tamu berkenan mengenakan busana muslim dengan palet warna golden hour.'}</p>
                <div className="dusk-mosque-dresscode-palette">
                    <span className="dusk-mosque-dresscode-swatch" style={{ background: '#4A3826' }} title="Warm Brown"></span>
                    <span className="dusk-mosque-dresscode-swatch" style={{ background: '#8E7152' }} title="Bronze"></span>
                    <span className="dusk-mosque-dresscode-swatch" style={{ background: '#C8B680' }} title="Gold Olive"></span>
                    <span className="dusk-mosque-dresscode-swatch" style={{ background: '#FAF3EA' }} title="Cream"></span>
                </div>
            </div>
        </div>
    );
}
 
/* ─── 5. STANDALONE LIVESTREAMING SECTION (SOP Rule 4.4) ─── */
function LiveStreamingSection({ events, locale }) {
    const isEn = locale === 'en';
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
        <section className="dusk-mosque-post-section" id="livestream">
            <h2 className="dusk-mosque-section-eyebrow">Virtual Wedding</h2>
            <h2 className="dusk-mosque-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
            <p className="dusk-mosque-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
            
            <div className="dusk-mosque-livestream-container">
                {streamsList.map((stream, idx) => (
                    <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="dusk-mosque-btn-livestream">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                        WATCH {stream.platform.toUpperCase()}
                    </button>
                ))}
            </div>
        </section>
    );
}
 
/* ─── 6. LOVE STORY TIMELINE ─── */
function LoveStorySection({ loveStories, locale }) {
    const isEn = locale === 'en';
    const list = safeArr(loveStories).sort((a,b) => a.sort_order - b.sort_order);
    if (list.length === 0) return null;
 
    return (
        <section className="dusk-mosque-post-section" id="love_story">
            <h2 className="dusk-mosque-section-eyebrow">Our Journey</h2>
            <h2 className="dusk-mosque-section-title">{isEn ? 'Love Story' : 'Kisah Cinta'}</h2>
            <p className="dusk-mosque-section-subtitle">{isEn ? 'Every love story is beautiful, but ours is our favorite.' : 'Setiap kisah cinta itu indah, tapi milik kami yang paling istimewa.'}</p>
            
            <div className="dusk-mosque-story-path">
                {list.map((st, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                        <div key={idx} className={`dusk-mosque-story-row ${isLeft ? 'dusk-mosque-story-row--left' : 'dusk-mosque-story-row--right'}`}>
                            <span className="dusk-mosque-story-dot" aria-hidden="true" />
                            <div className="dusk-mosque-story-card">
                                <h3 className="dusk-mosque-story-chapter-title">{st.title}</h3>
                                <p className="dusk-mosque-story-chapter-text">{st.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
 
/* ─── 7. GALLERY SECTION (Auto-hides if hide_photos is enabled) ─── */
function GallerySection({ galleries, locale }) {
    const isEn = locale === 'en';
    const list = safeArr(galleries);
    if (list.length === 0 || !globalShowPhotos) return null;
 
    // Separate video if present
    const images = list.filter(g => !g.image_url?.includes('youtube.com') && !g.image_url?.includes('youtu.be'));
    const youtubeVideo = list.find(g => g.image_url?.includes('youtube.com') || g.image_url?.includes('youtu.be'));
 
    const getYoutubeId = (url) => {
        if (!url) return '';
        const reg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(reg);
        return (match && match[2].length === 11) ? match[2] : '';
    };
 
    return (
        <section className="dusk-mosque-post-section" id="gallery">
            <h2 className="dusk-mosque-section-eyebrow">Our Memories</h2>
            <h2 className="dusk-mosque-section-title">{isEn ? 'Gallery' : 'Galeri'}</h2>
            <p className="dusk-mosque-section-subtitle">{isEn ? 'Moments captured in time, frozen forever.' : 'Momen indah yang tertangkap waktu, terbekukan selamanya.'}</p>
            
            <div className="dusk-mosque-gallery-grid">
                {youtubeVideo && (
                    <div className="dusk-mosque-gallery-video">
                        <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeId(youtubeVideo.image_url)}`}
                            title="Wedding Gallery Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}
                
                {images.map((img, idx) => (
                    <div key={idx} className="dusk-mosque-gallery-item">
                        <img src={getStorageUrl(img.image_url, '')} alt={img.caption || ''} loading="lazy" />
                    </div>
                ))}
            </div>
            
            <blockquote className="dusk-mosque-gallery-quote">
                <p>“Sebaik-baik perhiasan dunia adalah wanita yang sholehah.”</p>
                <cite>HR. Muslim</cite>
            </blockquote>
        </section>
    );
}
 
/* ─── 8. UNIFIED RSVP & WISHES SECTION (SOP Rule 4.6) ─── */
function UnifiedRsvpWishes({ invitation, wishes, guest, enableRsvp, enableWishes, locale }) {
    const { t } = useTranslation();
    const isEn = locale === 'en';
 
    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || '';
 
    const { data, setData, post, processing, errors, reset } = useForm({
        name: guestName,
        attendance: 'hadir',
        guests_count: 1,
        message: ''
    });
 
    const [wishesList, setWishesList] = useState(safeArr(wishes));
    const [successMsg, setSuccessMsg] = useState('');
 
    const wishesDisplay = useMemo(() => {
        // Sort and show only 5 latest entries as required by SOP Rule 4.6
        return [...wishesList]
            .sort((a,b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
            .slice(0, 5);
    }, [wishesList]);
 
    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMsg('');
        
        // Mock submission locally since background Inertia handles database integration
        const newWish = {
            sender_name: data.name || 'Anonymous',
            message: data.message,
            attendance: data.attendance,
            created_at: new Date().toISOString()
        };
 
        // Trigger default route submission if active
        post(route('invitation.rsvp', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => {
                setWishesList(prev => [newWish, ...prev]);
                setSuccessMsg(isEn ? 'Wish sent successfully!' : 'Doa & Ucapan berhasil dikirim!');
                reset('message');
            },
            onError: () => {
                // Fallback local append for visual completeness if endpoint is not fully loaded
                setWishesList(prev => [newWish, ...prev]);
                setSuccessMsg(isEn ? 'Wish sent successfully! (demo)' : 'Doa & Ucapan berhasil dikirim! (demo)');
                reset('message');
            }
        });
    };
 
    return (
        <section className="dusk-mosque-post-section" id="rsvp">
            <h2 className="dusk-mosque-section-eyebrow">Wishes &amp; Attendance</h2>
            <h2 className="dusk-mosque-section-title">{isEn ? 'RSVP' : 'Konfirmasi Kehadiran'}</h2>
            <p className="dusk-mosque-section-subtitle">{isEn ? 'Please confirm your attendance to help us prepare. Your wishes mean everything.' : 'Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i agar kami dapat mempersiapkan dengan sebaik-baiknya.'}</p>
            
            <div className="dusk-mosque-rsvp-box">
                {enableRsvp && (
                    <form onSubmit={handleSubmit} className="dusk-mosque-rsvp-form">
                        <div className="dusk-mosque-rsvp-field">
                            <label htmlFor="rsvp-name">{isEn ? 'Your Name' : 'Nama'}</label>
                            <input
                                id="rsvp-name"
                                className="dusk-mosque-rsvp-input"
                                type="text"
                                placeholder={isEn ? 'Enter your name' : 'Nama Anda'}
                                required
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                        </div>
                        
                        <div className="dusk-mosque-rsvp-field">
                            <label>{isEn ? 'Attendance' : 'Kehadiran'}</label>
                            <div className="dusk-mosque-rsvp-choices">
                                <span className="dusk-mosque-rsvp-choice-wrapper">
                                    <input
                                        id="att-hadir"
                                        type="radio"
                                        name="attendance"
                                        className="dusk-mosque-rsvp-choice-input"
                                        value="hadir"
                                        checked={data.attendance === 'hadir'}
                                        onChange={e => setData('attendance', e.target.value)}
                                    />
                                    <label htmlFor="att-hadir" className="dusk-mosque-rsvp-choice-label">{isEn ? 'Attending' : 'Hadir'}</label>
                                </span>
                                <span className="dusk-mosque-rsvp-choice-wrapper">
                                    <input
                                        id="att-tidak"
                                        type="radio"
                                        name="attendance"
                                        className="dusk-mosque-rsvp-choice-input"
                                        value="tidak"
                                        checked={data.attendance === 'tidak'}
                                        onChange={e => setData('attendance', e.target.value)}
                                    />
                                    <label htmlFor="att-tidak" className="dusk-mosque-rsvp-choice-label">{isEn ? 'Absent' : 'Tidak Hadir'}</label>
                                </span>
                            </div>
                        </div>
                        
                        {data.attendance === 'hadir' && (
                            <div className="dusk-mosque-rsvp-field">
                                <label htmlFor="rsvp-guests">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                                <select
                                    id="rsvp-guests"
                                    className="dusk-mosque-rsvp-select"
                                    value={data.guests_count}
                                    onChange={e => setData('guests_count', parseInt(e.target.value))}
                                >
                                    <option value="1">1 Orang</option>
                                    <option value="2">2 Orang</option>
                                    <option value="3">3 Orang</option>
                                    <option value="4">4 Orang</option>
                                </select>
                            </div>
                        )}
                        
                        <div className="dusk-mosque-rsvp-field">
                            <label htmlFor="rsvp-msg">{isEn ? 'Wishes & Prayers' : 'Doa & Ucapan'}</label>
                            <textarea
                                id="rsvp-msg"
                                className="dusk-mosque-rsvp-textarea"
                                rows="3"
                                placeholder={isEn ? 'Write your wishes...' : 'Tulis doa atau ucapan untuk kami...'}
                                required
                                maxLength={1000}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                            />
                            <p className="dusk-mosque-rsvp-counter">{data.message.length}/1000</p>
                        </div>
                        
                        <button type="submit" disabled={processing} className="dusk-mosque-rsvp-submit">
                            {isEn ? 'Send Wishes' : 'Kirim Ucapan'}
                        </button>
                        
                        {successMsg && (
                            <p style={{ color: '#28a745', fontSize: '0.85rem', fontWeight: 600, marginTop: '10px', textAlign: 'center' }}>
                                {successMsg}
                            </p>
                        )}
                    </form>
                )}
                
                {enableWishes && (
                    <div className="dusk-mosque-wishes-container">
                        <p className="dusk-mosque-wishes-label">{isEn ? 'Wishes & Prayers' : 'Ucapan Tamu'}</p>
                        <div className="dusk-mosque-wishes-list">
                            {wishesDisplay.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', opacity: 0.7 }}>
                                    {isEn ? 'No wishes yet. Be the first!' : 'Belum ada ucapan. Jadilah yang pertama!'}
                                </p>
                            ) : (
                                wishesDisplay.map((w, idx) => (
                                    <div key={idx} className="dusk-mosque-wish-card">
                                        <div className="dusk-mosque-wish-header">
                                            <span className="dusk-mosque-wish-name">{w.sender_name}</span>
                                            <span className="dusk-mosque-wish-date">
                                                {w.created_at ? new Date(w.created_at).toLocaleDateString(isEn ? 'en' : 'id', { day: 'numeric', month: 'short' }) : 'Baru saja'}
                                            </span>
                                        </div>
                                        {w.attendance && (
                                            <span className={`dusk-mosque-wish-status dusk-mosque-wish-status--${w.attendance}`}>
                                                {w.attendance === 'hadir' ? (isEn ? 'Attending' : 'Hadir') : (isEn ? 'Absent' : 'Tidak Hadir')}
                                            </span>
                                        )}
                                        <p className="dusk-mosque-wish-message">{w.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
 
/* ─── 9. GIFT / DIGITAL ENVELOPE SECTION (SOP Rule 4.5 Copy Fallback) ─── */
function BankSection({ bankAccounts, invitation, locale }) {
    const isEn = locale === 'en';
    const list = safeArr(bankAccounts);
    if (list.length === 0) return null;
 
    const [activeTab, setActiveTab] = useState(0); // 0: Bank, 1: Gift Address
    const [copySuccess, setCopySuccess] = useState('');
 
    // Robust Dynamic Textarea copy fallback (Safari iOSWebView Compatible - SOP Rule 4.5)
    const handleCopy = (text) => {
        setCopySuccess('');
        
        const fallbackCopy = (txt) => {
            const ta = document.createElement('textarea');
            ta.value = txt;
            Object.assign(ta.style, { position: 'fixed', opacity: 0 });
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        };
 
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => setCopySuccess(text))
                .catch(() => {
                    fallbackCopy(text);
                    setCopySuccess(text);
                });
        } else {
            fallbackCopy(text);
            setCopySuccess(text);
        }
 
        setTimeout(() => setCopySuccess(''), 2000);
    };
 
    return (
        <section className="dusk-mosque-post-section" id="bank">
            <h2 className="dusk-mosque-section-eyebrow">Tanda Kasih</h2>
            <h2 className="dusk-mosque-section-title">{isEn ? 'Wedding Gift' : 'Kado Digital'}</h2>
            <p className="dusk-mosque-section-subtitle">{isEn ? 'Your presence is a gift itself, but if you wish to send gifts, we appreciate it.' : 'Doa restu Anda sudah lebih dari cukup. Namun bagi yang ingin mengirimkan kado, dapat mengirimkannya di bawah ini.'}</p>
            
            {invitation?.gift_address && (
                <div className="dusk-mosque-gift-tabs">
                    <button type="button" className={`dusk-mosque-gift-tab ${activeTab === 0 ? 'is-active' : ''}`} onClick={() => setActiveTab(0)}>{isEn ? 'Digital Envelope' : 'Amplop Digital'}</button>
                    <button type="button" className={`dusk-mosque-gift-tab ${activeTab === 1 ? 'is-active' : ''}`} onClick={() => setActiveTab(1)}>{isEn ? 'Send Gift' : 'Kirim Kado'}</button>
                </div>
            )}
            
            {activeTab === 0 ? (
                <div>
                    {list.map((ac, idx) => {
                        const bankNameUpper = String(ac.bank_name).toUpperCase();
                        let logo = null;
                        if (bankNameUpper === 'BCA') logo = ASSETS.bca;
                        else if (bankNameUpper === 'GOPAY' || bankNameUpper === 'DANA') logo = ASSETS.gopay;
                        
                        return (
                            <div key={idx} className="dusk-mosque-bank-card">
                                {logo ? (
                                    <img className="dusk-mosque-bank-logo" src={logo} alt={ac.bank_name} />
                                ) : (
                                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--warm)', marginBottom: '0.5rem' }}>{ac.bank_name}</h4>
                                )}
                                <p className="dusk-mosque-bank-holder">{ac.account_name}</p>
                                <p className="dusk-mosque-bank-number">{ac.account_number}</p>
                                
                                <button type="button" className="dusk-mosque-copy-btn" onClick={() => handleCopy(ac.account_number)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    {copySuccess === ac.account_number ? (isEn ? 'Copied!' : 'Berhasil Disalin!') : (isEn ? 'Copy Account Number' : 'Salin Rekening')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="dusk-mosque-bank-card">
                    <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--warm)', marginBottom: '0.75rem' }}>{isEn ? 'Groom & Bride Address' : 'Alamat Pengiriman'}</h4>
                    <p className="dusk-mosque-address-block">{invitation.gift_address}</p>
                    <button type="button" className="dusk-mosque-copy-btn" onClick={() => handleCopy(invitation.gift_address)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        {copySuccess === invitation.gift_address ? (isEn ? 'Address Copied!' : 'Alamat Disalin!') : (isEn ? 'Copy Address' : 'Salin Alamat')}
                    </button>
                </div>
            )}
        </section>
    );
}
 
/* ─── 10. CLOSING SECTION & WATERMARK (SOP Rule 4.7) ─── */
function ClosingSection({ invitation, brideGrooms, locale }) {
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
 
    const coupleName = groom.nickname && bride.nickname
        ? `${groom.nickname} & ${bride.nickname}`
        : 'Rizki & Aisyah';
 
    // Watermark Reseller dinamis (SOP Rule 4.7)
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';
 
    return (
        <section className="dusk-mosque-post-section dusk-mosque-closing-section" id="closing">
            <h2 className="dusk-mosque-closing-salam">Wassalamu'alaikum Warahmatullahi Wabarakatuh</h2>
            <p className="dusk-mosque-section-subtitle">
                {invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa dan restu.'}
            </p>
            <h3 className="dusk-mosque-closing-sig">Kami Yang Berbahagia,</h3>
            <p className="dusk-mosque-closing-sig" style={{ fontFamily: 'Great Vibes, cursive', fontSize: '3.5rem', margin: '1rem 0' }}>{coupleName}</p>
            
            <div className="dusk-mosque-signature-block">
                {bride.father_name && (
                    <div>Kel. Bapak {bride.father_name} & Ibu {bride.mother_name}</div>
                )}
                {groom.father_name && (
                    <div>Kel. Bapak {groom.father_name} & Ibu {groom.mother_name}</div>
                )}
            </div>
 
            {/* Unified Brand Reseller Watermark */}
            <p className="dusk-mosque-watermark" style={{ paddingBottom: '90px' }}>
                Made with ❤️ by {brandName}
            </p>
        </section>
    );
}
 
/* ─── 11. NAVIGATION CONTROLS (SOP Rule 5.3 Fullscreen & Auto-Scroll) ─── */
function Navigation({
    invitation,
    isOpened,
    isPlaying,
    onToggleMusic,
    scrollToSection,
    activeMenuId,
    resolvedSections,
    enableRsvp,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen
}) {
    const { t } = useTranslation();
    
    if (!isOpened) return null;
 
    const isBottomMenu = (invitation?.menu_position || 'bottom') === 'bottom';
 
    // Map section key to menu items
    const menuItems = useMemo(() => {
        const keys = resolvedSections.map(s => {
            let k = s.section_key;
            if (k === 'wishes' && enableRsvp) return 'rsvp';
            return k;
        });
        const unique = [...new Set(keys)].filter(k => k !== 'hero' && k !== 'closing');
        
        const labelsMap = {
            'opening': { label: 'Sampul', icon: 'fas fa-envelope-open' },
            'bride_groom': { label: 'Mempelai', icon: 'fas fa-heart' },
            'event': { label: 'Acara', icon: 'fas fa-calendar-alt' },
            'livestream': { label: 'Siaran', icon: 'fas fa-video' },
            'love_story': { label: 'Kisah', icon: 'fas fa-heart-broken' },
            'gallery': { label: 'Galeri', icon: 'fas fa-images' },
            'bank': { label: 'Kado', icon: 'fas fa-gift' },
            'rsvp': { label: 'RSVP', icon: 'fas fa-edit' }
        };
        
        return unique.map(key => ({
            key,
            label: labelsMap[key]?.label || key,
            icon: labelsMap[key]?.icon || 'fas fa-star'
        }));
    }, [resolvedSections, enableRsvp]);
 
    return (
        <React.Fragment>
            {/* Floating control buttons */}
            <button
                type="button"
                className={`dusk-mosque-music-btn visible ${isPlaying ? 'is-playing' : ''} ${isBottomMenu ? 'dusk-mosque-music-btn--raised' : ''}`}
                onClick={onToggleMusic}
                title="Toggle Music"
            >
                <span className="dusk-mosque-vinyl"></span>
                <span className="dusk-mosque-tonearm"></span>
            </button>
 
            <button
                type="button"
                className={`dusk-mosque-fullscreen-btn visible ${isBottomMenu ? 'dusk-mosque-fullscreen-btn--raised' : ''}`}
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
            >
                {isFullscreen ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"></path></svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path><line x1="3" y1="3" x2="10" y2="10"></line><line x1="21" y1="3" x2="14" y2="10"></line><line x1="21" y1="21" x2="14" y2="14"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                )}
            </button>
 
            {/* Main bottom menu */}
            <nav className={`dusk-mosque-nav ${isOpened ? 'is-visible' : ''}`}>
                {menuItems.map(item => (
                    <button
                        key={item.key}
                        type="button"
                        className={`dusk-mosque-nav-item ${activeMenuId === item.key ? 'is-active' : ''}`}
                        onClick={() => scrollToSection(item.key)}
                    >
                        <i className={item.icon} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </React.Fragment>
    );
}
 
/* ═══════════════════════════════════════
   MAIN THEME COMPONENT
   ═══════════════════════════════════════ */
export default function DynamicIndex({
    invitation,
    brideGrooms,
    events,
    loveStories,
    galleries,
    bankAccounts,
    sections,
    wishes,
    guest,
    locale = 'id'
}) {
    const { t } = useTranslation();
    const audioRef = useRef(null);
 
    // Features / overrides (SOP Rule 3.1 & 3.2)
    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);
    const enableRsvp = parseBool(invitation?.enable_rsvp, true);
    const enableWishes = parseBool(invitation?.enable_wishes, true);
    const showCountdown = parseBool(invitation?.save_the_date_enabled, true);
 
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;
 
    // State setups
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
 
    // preloader simulation
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);
 
    // Set Page Title dynamically based on couples
    useEffect(() => {
        const groom = safeArr(brideGrooms).find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()));
        const bride = safeArr(brideGrooms).find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase()));
        if (groom?.nickname && bride?.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, brideGrooms]);
 
    const isSlideMode = invitation?.layout_mode === 'slide-h' || invitation?.layout_mode === 'slide-v';
 
    // Lock viewport scroll initially
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    }, [isOpened, isSlideMode]);
 
    // Handle opening invitation
    const handleOpen = () => {
        setIsOpened(true);
        if (audioRef.current && parseBool(invitation?.music_autoplay, true)) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
        // Auto trigger Fullscreen API (SOP Rule 5.3)
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (!isSlideMode) {
            document.body.style.overflow = 'auto';
        }
    };
 
    // Toggle music
    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.muted = true;
            setIsPlaying(false);
        } else {
            audio.muted = false;
            if (audio.paused) {
                audio.play().catch(() => {});
            }
            setIsPlaying(true);
        }
    }, [isPlaying]);
 
    // Sync Fullscreen State (SOP Rule 5.3)
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
 
    // Resolve Sections and structure them in order (SOP Section Pipeline)
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;
 
        const resolved = [];
        
        // Push virtual opening slide first
        resolved.push({ section_key: 'hero' });
 
        if (safeSections.length > 0) {
            const dbSorted = safeSections
                .filter(s => s.is_visible && validKeys.includes(s.section_key))
                .sort((a, b) => a.sort_order - b.sort_order);
 
            dbSorted.forEach(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return;
                if (s.section_key === 'gallery' && !(galleries?.length > 0)) return;
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return;
                if (s.section_key === 'rsvp' && !enableRsvp) return;
                
                // Skip standalone countdown (integrated in event block)
                if (s.section_key === 'countdown') return;
 
                // Skip wishes if RSVP is active (merged)
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return;
                }
 
                if (s.section_key === 'livestream' && !hasStream) return;
 
                resolved.push(s);
                if (s.section_key === 'event' && hasStream) {
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
            if (hasStream) fallbacks.push({ section_key: 'livestream' });
            if (loveStories?.length > 0) fallbacks.push({ section_key: 'love_story' });
            if (galleries?.length > 0) fallbacks.push({ section_key: 'gallery' });
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
 
    // Slide list for the immersive parallax phase (Fase Panggung)
    const immersiveKeys = ['hero', 'opening', 'bride_groom', 'event', 'livestream'];
    
    // Slide index to resolved keys mapping
    const activeSectionKey = resolvedSections[activeSlideIdx]?.section_key || 'opening';
 
    // Slide Navigation controls
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };
    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };
 
    // Swipe Sync Hook (SOP Rule 5.2)
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) key = 'rsvp';
            if (key === 'hero') {
                setActiveSectionId('opening');
            } else {
                setActiveSectionId(key);
            }
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);
 
    // Scrollspy scroll tracking (SOP Rule 5.1)
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
 
        const handleScroll = () => {
            const keys = resolvedSections.map(s => {
                let k = s.section_key;
                if (k === 'wishes' && enableRsvp) return 'rsvp';
                return k;
            });
            const uniqueKeys = [...new Set(keys)].filter(k => k !== 'hero');
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
        };
 
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, enableRsvp]);
 
    // Auto-scroll pixel system (SOP Rule 5.2.4)
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        let timer = null;
 
        if (isSlideMode) {
            timer = setInterval(() => {
                const currentContainer = document.querySelector('.dusk-mosque-slide-container.is-active');
                if (currentContainer && currentContainer.scrollHeight > currentContainer.clientHeight) {
                    // Scroll internal slide pixel by pixel
                    currentContainer.scrollTop += 1.5;
                    const isAtBottom = currentContainer.scrollHeight - currentContainer.clientHeight - currentContainer.scrollTop <= 5;
                    
                    if (isAtBottom) {
                        // Jeda 4 detik dan swipe (Rule 5.2.4)
                        clearInterval(timer);
                        setTimeout(() => {
                            nextSlide();
                        }, 4000);
                    }
                } else {
                    // Jeda default 4s
                    clearInterval(timer);
                    setTimeout(() => {
                        nextSlide();
                    }, 4000);
                }
            }, 30);
        } else {
            // Scroll vertical
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isBottom) setAutoScrollEnabled(false);
            }, 25);
        }
 
        return () => { if (timer) clearInterval(timer); };
    }, [isOpened, autoScrollEnabled, isSlideMode, activeSlideIdx]);
 
    // Manual scrollToSection handler
    const scrollToSection = (id) => {
        setAutoScrollEnabled(false);
        let targetId = id;
        if (id === 'wishes' && enableRsvp) targetId = 'rsvp';
 
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => s.section_key === targetId);
            if (idx !== -1) setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };
 
    // Pointer Dragging swipe calculations
    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: false, atBottom: false });
    const isDragging = useRef(false);
    const scrollTimeout = useRef(null);
 
    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        let atTop = false;
        let atBottom = false;
 
        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.dusk-mosque-slide-container');
            if (scrollable) {
                atTop = scrollable.scrollTop <= 5;
                atBottom = scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5;
            }
        }
        touchStart.current = { x: clientX, y: clientY, time: Date.now(), atTop, atBottom };
    };
 
    const handlePointerUp = (clientX, clientY, target) => {
        if (!isSlideMode || !isDragging.current) return;
        isDragging.current = false;
 
        const diffX = clientX - touchStart.current.x;
        const diffY = clientY - touchStart.current.y;
        const timeDiff = Date.now() - touchStart.current.time;
        const threshold = 50;
 
        const isFastSwipe = timeDiff < 300 && (Math.abs(diffX) > 30 || Math.abs(diffY) > 30);
        const layoutMode = invitation?.layout_mode || 'slide-h';
 
        if (layoutMode === 'slide-h') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) nextSlide();
                else prevSlide();
            }
        } else {
            // slide-v
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.dusk-mosque-slide-container') : null;
                if (scrollable) {
                    if (diffY < 0 && touchStart.current.atBottom) nextSlide();
                    else if (diffY > 0 && touchStart.current.atTop) prevSlide();
                } else {
                    if (diffY < 0) nextSlide();
                    else prevSlide();
                }
            }
        }
    };
 
    const handleTouchStart = (e) => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target);
    const handleTouchEnd = (e) => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY, e.target);
    const handleMouseDown = (e) => handlePointerDown(e.clientX, e.clientY, e.target);
    const handleMouseUp = (e) => handlePointerUp(e.clientX, e.clientY, e.target);
    const handleMouseLeave = () => { isDragging.current = false; };
 
    const handleWheel = (e) => {
        if (!isSlideMode) return;
        if (scrollTimeout.current) return;
 
        const target = e.target.closest('.dusk-mosque-slide-container');
        if (target && target.scrollHeight > target.clientHeight) {
            const isAtTop = target.scrollTop <= 2;
            const isAtBottom = target.scrollHeight - target.clientHeight - target.scrollTop <= 2;
            if (e.deltaY > 0 && !isAtBottom) return;
            if (e.deltaY < 0 && !isAtTop) return;
        }
 
        scrollTimeout.current = setTimeout(() => {
            scrollTimeout.current = null;
        }, 800);
 
        if (e.deltaY > 0) nextSlide();
        else prevSlide();
    };
 
    // Mouse Parallax movement offsets inside stage
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (!isOpened || isSlideMode) return;
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 15;
            const y = (e.clientY / window.innerHeight - 0.5) * 15;
            setMouseOffset({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isOpened, isSlideMode]);
 
    // Camera shifts
    const sceneClass = useMemo(() => {
        if (!isSlideMode) {
            // In scroll mode, we just let it follow page scroll slightly
            return 'dusk-mosque-scene active-slide-0';
        }
        const idx = activeSlideIdx;
        if (idx >= 5) return 'dusk-mosque-scene active-slide-post';
        return `dusk-mosque-scene active-slide-${idx}`;
    }, [isSlideMode, activeSlideIdx]);
 
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
 
    const waNumber = groom?.phone || bride?.phone || '';
 
    return (
        <ErrorBoundary>
            {isLoading && (
                <div className="dusk-mosque-preloader">
                    <div className="dusk-mosque-loader-spin"></div>
                    <p style={{ marginTop: 15, fontFamily: 'Playfair Display, serif', letterSpacing: 2, color: 'var(--gold-light)' }}>DUSK MOSQUE</p>
                </div>
            )}
 
            <div className={`dusk-mosque-root ${!showAnimations ? 'dusk-mosque-no-animations' : ''}`}>
                {invitation?.particle_type && invitation.particle_type !== 'none' && isOpened && (
                    <ParticleEffect
                        type={invitation.particle_type}
                        count={invitation.particle_count || 25}
                        speed={invitation.particle_speed || 'normal'}
                    />
                )}
 
                {/* Audio backsound player */}
                {invitation?.music_url && (
                    <audio ref={audioRef} loop preload="auto" playsInline>
                        <source src={getStorageUrl(invitation.music_url, '')} type="audio/mpeg" />
                    </audio>
                )}
 
                {/* Cover Gate */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                />
 
                {/* 3D Immersive Background Scene */}
                {isOpened && (
                    <div className="dusk-mosque-stage" style={activeSlideIdx >= 5 && isSlideMode ? { pointerEvents: 'none' } : undefined}>
                        <div className={sceneClass}>
                            {/* Layer 1: Background Sky */}
                            <div className="dusk-mosque-layer dusk-mosque-layer--background" style={{ transform: `translate3d(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px, 0px) scale(1.1)` }}>
                                <img src={ASSETS.background} alt="" />
                            </div>
 
                            {/* Layer 2: Kurma Leaves Left & Right */}
                            <div className="dusk-mosque-layer dusk-mosque-layer--kurma-left" style={{ transform: `translate3d(${mouseOffset.x * 0.5 - 20}px, ${mouseOffset.y * 0.5 - 20}px, 0px) scale(1.3)` }}>
                                <img src={ASSETS.kurma} alt="" />
                            </div>
                            <div className="dusk-mosque-layer dusk-mosque-layer--kurma-right" style={{ transform: `scaleX(-1) translate3d(${mouseOffset.x * 0.5 - 20}px, ${mouseOffset.y * 0.5 - 20}px, 0px) scale(1.3)` }}>
                                <img src={ASSETS.kurma} alt="" />
                            </div>
 
                            {/* Layer 3: Birds flying */}
                            <div className="dusk-mosque-layer dusk-mosque-layer--birds" style={{ transform: `translate3d(${mouseOffset.x * 0.2 - 30}px, ${mouseOffset.y * 0.2 - 50}px, 0px) scale(1.05)` }}>
                                <img src={ASSETS.birds} alt="" />
                            </div>
 
                            {/* Layer 4: Couple illustration */}
                            <div className="dusk-mosque-layer dusk-mosque-layer--couple" style={{ transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4 + 40}px, 0px) scale(1.15)` }}>
                                <img src={ASSETS.couple} alt="" />
                            </div>
 
                            {/* Layer 5: Visual Stage cards (Only in slide mode) */}
                            {isSlideMode && (
                                <div className="dusk-mosque-layer dusk-mosque-layer--info">
                                    {/* Verse Card */}
                                    <div className={`dusk-mosque-card ${activeSectionKey === 'opening' ? 'is-visible' : ''}`}>
                                        <VerseSection invitation={invitation} brideGrooms={brideGrooms} />
                                    </div>
 
                                    {/* Groom Card */}
                                    <div className={`dusk-mosque-card ${activeSectionKey === 'bride_groom' && activeSlideIdx === 2 ? 'is-visible' : ''}`}>
                                        <CoupleCard person={groom} gender="pria" locale={locale} />
                                    </div>
 
                                    {/* Bride Card */}
                                    <div className={`dusk-mosque-card ${activeSectionKey === 'bride_groom' && activeSlideIdx === 1 ? 'is-visible' : ''}`}>
                                        <CoupleCard person={bride} gender="wanita" locale={locale} />
                                    </div>
 
                                    {/* Event Card */}
                                    <div className={`dusk-mosque-card dusk-mosque-event-card ${activeSectionKey === 'event' ? 'is-visible' : ''}`}>
                                        <EventSection events={events} countdownDate={showCountdown ? invitation?.countdown_target_date : null} locale={locale} />
                                    </div>
                                </div>
                            )}
 
                            {/* Layer 6: Golden Arches Foreground */}
                            <div className="dusk-mosque-layer dusk-mosque-layer--foreground" style={{ transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0px) scale(1.25)` }}>
                                <img src={ASSETS.foreground} alt="" />
                            </div>
                        </div>
                    </div>
                )}
 
                {/* Swipe up indicator */}
                {isSlideMode && isOpened && activeSlideIdx < 5 && (
                    <div className="dusk-mosque-swipe-hint" aria-hidden="true">
                        <span className="dusk-mosque-swipe-hint-arrow"></span>
                        <span style={{ fontSize: '0.65rem' }}>Swipe Up</span>
                    </div>
                )}
 
                {/* Main Scroll/Slide Display Area */}
                {isOpened && (
                    <div className="dusk-mosque-container">
                        {isSlideMode ? (
                            /* ─── SLIDE LAYOUT ENGINE ─── */
                            <div
                                className={`dusk-mosque-main--slide ${invitation?.layout_mode === 'slide-h' ? 'dusk-mosque-main--slide-h' : 'dusk-mosque-main--slide-v'}`}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                onWheel={handleWheel}
                            >
                                {/* Slide 0: Virtual Hero (Opening) */}
                                <div className={`dusk-mosque-slide-container ${activeSlideIdx === 0 ? 'is-active' : activeSlideIdx > 0 ? 'is-prev' : 'is-next'}`}>
                                    {/* Fixed stage handles cards internally */}
                                </div>
 
                                {/* Slide 1: Bride Info */}
                                <div className={`dusk-mosque-slide-container ${activeSlideIdx === 1 ? 'is-active' : activeSlideIdx > 1 ? 'is-prev' : 'is-next'}`}>
                                    {/* Info rendered on Fixed Stage */}
                                </div>
 
                                {/* Slide 2: Groom Info */}
                                <div className={`dusk-mosque-slide-container ${activeSlideIdx === 2 ? 'is-active' : activeSlideIdx > 2 ? 'is-prev' : 'is-next'}`}>
                                    {/* Info rendered on Fixed Stage */}
                                </div>
 
                                {/* Slide 3: Events Info */}
                                <div className={`dusk-mosque-slide-container ${activeSlideIdx === 3 ? 'is-active' : activeSlideIdx > 3 ? 'is-prev' : 'is-next'}`}>
                                    {/* Info rendered on Fixed Stage */}
                                </div>
 
                                {/* Slide 4: Livestream (If any) */}
                                {resolvedSections.map((sec, idx) => {
                                    if (idx < 4) return null; // already handled by fixed stage
                                    
                                    const key = sec.section_key;
                                    let comp = null;
                                    
                                    if (key === 'livestream') comp = <LiveStreamingSection events={events} locale={locale} />;
                                    else if (key === 'love_story') comp = <LoveStorySection loveStories={loveStories} locale={locale} />;
                                    else if (key === 'gallery') comp = <GallerySection galleries={galleries} locale={locale} />;
                                    else if (key === 'rsvp') comp = <UnifiedRsvpWishes invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} locale={locale} />;
                                    else if (key === 'bank') comp = <BankSection bankAccounts={bankAccounts} invitation={invitation} locale={locale} />;
                                    else if (key === 'closing') comp = <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />;
 
                                    if (!comp) return null;
 
                                    let slideClass = 'dusk-mosque-slide-container';
                                    if (idx === activeSlideIdx) slideClass += ' is-active';
                                    else if (idx > activeSlideIdx) slideClass += ' is-next';
                                    else slideClass += ' is-prev';
 
                                    // Render inside absolute slide containers
                                    return (
                                        <div key={key} className={slideClass}>
                                            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
                                                {comp}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ─── SCROLL LAYOUT ENGINE ─── */
                            <div className="dusk-mosque-main--scroll">
                                {/* Opening / Verse Card */}
                                <div id="opening" className="dusk-mosque-card">
                                    <VerseSection invitation={invitation} brideGrooms={brideGrooms} />
                                </div>
                                <div className="dusk-mosque-heart-divider" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
 
                                {/* Mempelai Cards */}
                                <div id="bride_groom" className="dusk-mosque-card">
                                    <CoupleCard person={bride} gender="wanita" locale={locale} />
                                    <div className="dusk-mosque-heart-divider" aria-hidden="true" style={{ margin: '2rem 0' }}><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
                                    <CoupleCard person={groom} gender="pria" locale={locale} />
                                </div>
                                <div className="dusk-mosque-heart-divider" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
 
                                {/* Events Cards */}
                                <div id="event" className="dusk-mosque-card dusk-mosque-event-card">
                                    <EventSection events={events} countdownDate={showCountdown ? invitation?.countdown_target_date : null} locale={locale} />
                                </div>
 
                                {/* Post Immersive Scroll Stack */}
                                <div className="dusk-mosque-overlay">
                                    <div className="dusk-mosque-post-immersive">
                                        <LiveStreamingSection events={events} locale={locale} />
                                        <LoveStorySection loveStories={loveStories} locale={locale} />
                                        <GallerySection galleries={galleries} locale={locale} />
                                        <UnifiedRsvpWishes invitation={invitation} wishes={wishes} guest={guest} enableRsvp={enableRsvp} enableWishes={enableWishes} locale={locale} />
                                        <BankSection bankAccounts={bankAccounts} invitation={invitation} locale={locale} />
                                        <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />
                                    </div>
                                </div>
                            </div>
                        )}
 
                        {/* WhatsApp Floating contact */}
                        {waNumber && (
                            <div className={`dusk-mosque-whatsapp-float ${isBottomMenu ? 'dusk-mosque-whatsapp-float--raised' : ''}`}>
                                <a
                                    href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dusk-mosque-whatsapp-btn"
                                    title="Hubungi Mempelai"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 2.119.55 4.108 1.516 5.845L.03 23.518a.747.747 0 0 0 .95.95l5.377-1.486A11.91 11.91 0 0 0 12 24.297c6.63 0 12-5.373 12-12 0-6.627-5.37-12-12-12zm6.657 16.592c-.255.722-1.503 1.341-2.078 1.408-.528.06-1.21.092-1.924-.138a10.96 10.96 0 0 1-4.707-2.923c-1.396-1.395-2.482-3.056-2.922-4.706-.23-.863-.127-1.63-.047-2.124.095-.589.658-1.282 1.378-1.52.247-.082.493-.124.74-.124.166 0 .324.004.464.014.394.025.59.049.852.678.272.656.924 2.25.998 2.398.074.148.11.32.012.518-.098.197-.222.42-.37.587-.148.168-.308.35-.444.475-.15.138-.306.29-.13.593a8.1 8.1 0 0 0 1.95 2.41 7.22 7.22 0 0 0 2.822 1.737c.3.148.475.127.653-.078.18-.204.776-.902.983-1.21.206-.308.412-.257.69-.153.28.103 1.772.836 2.08 1 .308.163.515.247.59.37.075.124.075.722-.18 1.444z"/></svg>
                                </a>
                            </div>
                        )}
 
                        {/* Navigation controls */}
                        <Navigation
                            invitation={invitation}
                            isOpened={isOpened}
                            isPlaying={isPlaying}
                            onToggleMusic={toggleMusic}
                            scrollToSection={scrollToSection}
                            activeMenuId={activeSectionId}
                            resolvedSections={resolvedSections}
                            enableRsvp={enableRsvp}
                            autoScrollEnabled={autoScrollEnabled}
                            setAutoScrollEnabled={setAutoScrollEnabled}
                            isFullscreen={isFullscreen}
                            toggleFullscreen={toggleFullscreen}
                        />
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
