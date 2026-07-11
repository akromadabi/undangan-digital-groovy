import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import ParticleEffect from '@/Components/ParticleEffect';
import { 
    Calendar, Clock, MapPin, Music2, Music, Heart, MessageSquare, Gift, Check, Send, Sparkles, Building, QrCode, 
    Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Video, History, Image, Film, Shirt, Award, Coffee
} from 'lucide-react';
import './style.css';

// Global context overrides for sub-components (as required by the guidelines)
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

const parseBool = (val, def = true) => {
    if (val === undefined || val === null) return def;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

function getStorageUrl(url, fallback = '') {
    if (!url) return fallback;
    if (typeof url === 'string' && url.includes(',')) url = url.split(',')[0];
    let clean = String(url).replace(/\\/g, '/');
    if (clean.startsWith('http') || clean.startsWith('data:') || clean.startsWith('/themes/') || clean.startsWith('/images/')) return clean;
    if (clean.startsWith('storage/')) return '/' + clean;
    if (clean.startsWith('/')) return clean;
    return `/storage/${clean}`;
}

// Anti-timezone midnight bug helper (as required by the guidelines)
function formatDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    const safeStr = String(dateStr).substring(0, 10) + 'T12:00:00';
    const date = new Date(safeStr);
    if (isNaN(date.getTime())) return String(dateStr);
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
    });
}

function fmtTime(t) { 
    return !t || t === 'Selesai' ? (t || '') : String(t).substring(0, 5); 
}

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
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10) - 1,
        parseInt(dateParts[2], 10),
        parseInt(timeParts[0], 10) || 0,
        parseInt(timeParts[1], 10) || 0,
        parseInt(timeParts[2], 10) || 0
    );
}

function useCountdown(targetDate, startTime) {
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const target = parseSafeDate(targetDate, startTime);
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
        const id = setInterval(tick, 1000); 
        return () => clearInterval(id);
    }, [targetDate, startTime]);
    return cd;
}

// Title Case conversion to prevent cursive capital text issue
function formatScriptTitle(title) {
    if (!title) return '';
    const clean = String(title).trim().toUpperCase();
    if (clean === 'THANK YOU') return 'Thank You';
    if (clean === 'TERIMA KASIH') return 'Terima Kasih';
    return title;
}

/* ─── ERROR BOUNDARY local wrapper ─── */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="cre-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ─── SCROLL REVEAL wrapper ─── */
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

    let baseClass = 'cre-reveal--up';
    if (variant === 'zoom') baseClass = 'cre-reveal--zoom';
    else if (variant === 'left') baseClass = 'cre-reveal--left';
    else if (variant === 'right') baseClass = 'cre-reveal--right';
    else if (variant === 'down') baseClass = 'cre-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} cre-reveal ${baseClass} ${visible ? 'is-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ─── PAGE SEPARATOR ORNAMENT ─── */
function SectionSeparator() {
    return (
        <div className="cre-section-separator">
            <div className="cre-separator-line" />
            <div className="cre-separator-diamond">♦</div>
            <div className="cre-separator-line" />
        </div>
    );
}

/* ─── SECTIONS MODULES ─── */

// 1. COVER SECTION
function CoverSection({ invitation, isOpened, onOpen, coverImages, guest }) {
    const { t } = useTranslation();
    return (
        <div className={`cre-cover ${isOpened ? 'opened' : ''}`}>
            {globalShowPhotos && coverImages.length > 0 && (
                <PremiumSlideshow
                    images={coverImages}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                />
            )}
            <div className="cre-cover-overlay" />
            <div className="cre-corner-gold cre-corner-top-left" style={{ zIndex: 4 }} />
            <div className="cre-corner-gold cre-corner-top-right" style={{ zIndex: 4 }} />
            <div className="cre-corner-gold cre-corner-bottom-left" style={{ zIndex: 4 }} />
            <div className="cre-corner-gold cre-corner-bottom-right" style={{ zIndex: 4 }} />
            
            <div className="cre-cover-content">
                <span className="cre-cover-sub">{invitation?.cover_subtitle || t('invitation.wedding_of')}</span>
                <h1 className="cre-cover-title">{invitation?.cover_title || invitation?.title}</h1>
                
                <div className="cre-cover-monogram-circle mx-auto">
                    {(invitation?.cover_title || invitation?.title || 'C').charAt(0)}
                </div>

                {guest?.name && (
                    <div className="cre-cover-guest-box">
                        <div className="cre-cover-guest-label">{t('invitation.to')}:</div>
                        <div className="cre-cover-guest-name">{guest.name}</div>
                    </div>
                )}
                
                <button type="button" onClick={onOpen} className="cre-btn-gold">
                    💌 {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

// 2. OPENING SECTION
function OpeningSection({ invitation, brideGrooms, openingImages, events, showCountdown, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const eventType = invitation?.type || 'wedding';
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);

    const groom = bgs.find(b => ['pria', 'male'].includes(b.gender?.toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(b.gender?.toLowerCase())) || bgs[1] || {};

    const celebrantName = useMemo(() => {
        if (isSingleSubject) {
            return primarySubjectName(bgs, invitation);
        }
        if (groom?.nickname && bride?.nickname) return `${groom.nickname} & ${bride.nickname}`;
        return invitation?.cover_title || 'Groom & Bride';
    }, [groom, bride, invitation, isSingleSubject, bgs]);

    return (
        <div className="cre-opening-wrapper">
            <Reveal>
                <div className="cre-script-title">Welcome to Our</div>
                <h2 className="cre-heading-gold">{isSingleSubject ? 'Celebration' : 'Wedding Day'}</h2>
                
                {/* Hero full name display as per guidelines */}
                <h1 className="cre-opening-hero-name">{celebrantName}</h1>

                {/* Integrated Countdown under hero name */}
                {showCountdown && (
                    <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                        <CountdownBlock events={events} />
                    </div>
                )}

                {/* Slideshow image window */}
                {globalShowPhotos && openingImages.length > 0 && (
                    <div className="cre-opening-slideshow-wrapper">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                )}

                {invitation?.opening_ayat && (
                    <div className="cre-quote-block">
                        <span className="cre-quote-mark-open">“</span>
                        <p className="cre-opening-ayat">{invitation.opening_ayat}</p>
                        <span className="cre-quote-mark-close">”</span>
                    </div>
                )}
                {invitation?.opening_ayat_source && (
                    <div className="cre-opening-source">&mdash; {invitation.opening_ayat_source}</div>
                )}
                
                {invitation?.opening_text && (
                    <p className="cre-opening-desc-text">
                        {invitation.opening_text}
                    </p>
                )}
            </Reveal>
        </div>
    );
}

function primarySubjectName(bgs, invitation) {
    const primary = bgs[0];
    if (primary?.nickname) return primary.nickname;
    if (primary?.full_name) return primary.full_name;
    return invitation?.cover_title || 'Penyelenggara';
}

// Helper to translate child order dynamically
function translateChildOrder(childOrder, gender, locale) {
    if (!childOrder) return '';
    const raw = String(childOrder).trim().toLowerCase();
    const map = {
        '1': locale === 'en' ? 'First' : 'Pertama',
        '2': locale === 'en' ? 'Second' : 'Kedua',
        '3': locale === 'en' ? 'Third' : 'Ketiga',
        '4': locale === 'en' ? 'Fourth' : 'Keempat',
        '5': locale === 'en' ? 'Fifth' : 'Kelima',
        'tunggal': locale === 'en' ? 'Only' : 'Tunggal',
        'bungsu': locale === 'en' ? 'Youngest' : 'Bungsu'
    };
    const ord = map[raw] || childOrder;
    const isF = ['wanita', 'female'].includes(String(gender).toLowerCase());
    
    if (locale === 'en') {
        return `${ord} ${isF ? 'Daughter' : 'Son'} of`;
    }
    return `${isF ? 'Putri' : 'Putra'} ${ord} dari`;
}

// 3. BRIDE AND GROOM (SUBJECTS) SECTION
function BrideGroomSection({ brideGrooms, invitation, locale }) {
    const bgs = safeArr(brideGrooms);
    const eventType = invitation?.type || 'wedding';
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);

    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const renderCard = (person, type) => {
        if (!person?.full_name) return null;
        const photo = getStorageUrl(person.photo, null);
        return (
            <div className="cre-card">
                <div className="cre-card-accent-border" />
                <div className="cre-mempelai-photo-inner">
                    {globalShowPhotos && photo ? (
                        <img src={photo} alt={person.nickname} className="cre-mempelai-photo" />
                    ) : (
                        <div className="cre-photo-fallback">
                            {isSingleSubject ? <Building size={48} /> : <Heart size={48} />}
                        </div>
                    )}
                </div>
                <h3 className="cre-card-title">{person.full_name}</h3>
                {person.nickname && <div className="cre-card-sub">{person.nickname}</div>}
                {person.bio && <p className="cre-card-bio">"{person.bio}"</p>}
                
                {/* Parents names (hide for business/cafe types) */}
                {((person.father_name && person.father_name.trim() !== '') || (person.mother_name && person.mother_name.trim() !== '')) && (
                    <div className="cre-card-parents">
                        {person.child_order && <span>{translateChildOrder(person.child_order, person.gender, locale)}<br /></span>}
                        <strong>
                            {person.father_name && person.mother_name ? (
                                `Bpk. ${person.father_name} & Ibu ${person.mother_name}`
                            ) : person.father_name ? (
                                `Bpk. ${person.father_name}`
                            ) : (
                                `Ibu ${person.mother_name}`
                            )}
                        </strong>
                    </div>
                )}

                {person.instagram && (
                    <a 
                        href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cre-btn-instagram"
                    >
                        <i className="fab fa-instagram" /> @{person.instagram.replace('@', '')}
                    </a>
                )}
            </div>
        );
    };

    return (
        <div className="cre-bridegroom-wrapper">
            <h2 className="cre-heading-gold">{isSingleSubject ? 'Profil Penyelenggara' : 'Mempelai Acara'}</h2>
            
            <div className="cre-profil-container">
                {isSingleSubject ? (
                    renderCard(groom, 'single')
                ) : (
                    <>
                        {renderCard(groom, 'groom')}
                        <div className="cre-mempelai-ampersand">&</div>
                        {renderCard(bride, 'bride')}
                    </>
                )}
            </div>
        </div>
    );
}

// 4. COUNTDOWN COMPONENT
function CountdownBlock({ events }) {
    const { t } = useTranslation();
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const countdown = useCountdown(primaryEvent?.event_date, primaryEvent?.start_time);
    
    return (
        <div className="cre-countdown-container">
            <div className="cre-countdown-box">
                <div className="cre-countdown-num">{String(countdown.d).padStart(2, '0')}</div>
                <div className="cre-countdown-label">{t('invitation.days')}</div>
            </div>
            <div className="cre-countdown-box">
                <div className="cre-countdown-num">{String(countdown.h).padStart(2, '0')}</div>
                <div className="cre-countdown-label">{t('invitation.hours')}</div>
            </div>
            <div className="cre-countdown-box">
                <div className="cre-countdown-num">{String(countdown.m).padStart(2, '0')}</div>
                <div className="cre-countdown-label">{t('invitation.minutes')}</div>
            </div>
            <div className="cre-countdown-box">
                <div className="cre-countdown-num">{String(countdown.s).padStart(2, '0')}</div>
                <div className="cre-countdown-label">{t('invitation.seconds')}</div>
            </div>
        </div>
    );
}

// 5. AGENDA / EVENTS SECTION (CREATIVE COFFEE MENU STYLE)
function EventSection({ events, locale }) {
    const evList = safeArr(events).sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="cre-event-wrapper w-full flex flex-col items-center">
            <h2 className="cre-heading-gold">Menu &amp; Rangkaian Acara</h2>
            
            <div className="cre-menu-container w-full max-w-2xl">
                {evList.map((e, idx) => (
                    <Reveal key={e.id || idx} delay={idx * 150}>
                        <div className="cre-menu-item">
                            <div className="cre-menu-header">
                                <span className="cre-menu-title">{e.event_name}</span>
                                <div className="cre-menu-spacer" />
                                <span className="cre-menu-date">{formatDate(e.event_date, locale)}</span>
                            </div>
                            
                            <div className="cre-menu-details">
                                <div className="cre-menu-time">
                                    <Clock size={12} className="inline mr-1 text-gold" />
                                    {fmtTime(e.start_time)} - {e.end_time ? fmtTime(e.end_time) : 'Selesai'} {e.timezone}
                                </div>
                                
                                {e.venue_name && (
                                    <div className="cre-menu-venue">
                                        <MapPin size={12} className="inline mr-1 text-gold" />
                                        <strong>{e.venue_name}</strong>
                                        {e.venue_address && <p className="cre-menu-address">{e.venue_address}</p>}
                                    </div>
                                )}
                            </div>

                            {e.gmaps_link && (
                                <div className="text-left mt-2">
                                    <a href={e.gmaps_link} target="_blank" rel="noopener noreferrer" className="cre-menu-btn-gmaps">
                                        🗺️ Open Google Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 6. LIVE STREAMING SECTION
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
        <div className="cre-livestream-wrapper">
            <h2 className="cre-heading-gold">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
            <p className="cre-section-subtitle mb-4">{isEn ? 'Join our celebration virtually' : 'Saksikan momen berharga kami secara virtual'}</p>
            
            <div className="cre-livestream-container">
                {streamsList.map((stream, idx) => (
                    <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="cre-btn-gold">
                        📺 WATCH {stream.platform.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}

// 7. LOVE STORIES / HISTORY MILESTONES SECTION
function LoveStorySection({ loveStories, invitation }) {
    const eventType = invitation?.type || 'wedding';
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);

    return (
        <div className="cre-lovestory-wrapper">
            <h2 className="cre-heading-gold">{isSingleSubject ? 'Sejarah & Kilas Balik' : 'Perjalanan Cinta'}</h2>
            
            <div className="cre-timeline">
                {stories.map((s, idx) => (
                    <Reveal key={s.id || idx} delay={idx * 100}>
                        <div className="cre-timeline-item">
                            <div className="cre-timeline-date">
                                {s.story_date ? new Date(s.story_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : ''}
                            </div>
                            <h3 className="cre-timeline-title">{s.title}</h3>
                            {s.description && <p className="cre-timeline-desc">{s.description}</p>}
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 8. GALLERY SECTION
function GallerySection({ galleries }) {
    const list = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);
    return (
        <div className="cre-gallery-wrapper w-full flex flex-col items-center">
            <h2 className="cre-heading-gold">Galeri Foto</h2>
            
            <div className="cre-gallery-grid">
                {list.map((g, idx) => (
                    <Reveal key={g.id || idx} variant="zoom" delay={(idx % 2) * 150}>
                        <div className="cre-gallery-item">
                            <img src={getStorageUrl(g.image_url)} alt={g.caption || 'Foto Galeri'} />
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 9. VIDEO SECTION
function VideoSection({ invitation }) {
    const videoUrl = invitation?.video_url;
    if (!videoUrl) return null;

    const embedUrl = useMemo(() => {
        let id = '';
        if (videoUrl.includes('youtube.com/watch?v=')) {
            id = videoUrl.split('v=')[1]?.split('&')[0];
        } else if (videoUrl.includes('youtu.be/')) {
            id = videoUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (videoUrl.includes('youtube.com/embed/')) {
            id = videoUrl.split('embed/')[1]?.split('?')[0];
        }
        return id ? `https://www.youtube.com/embed/${id}` : videoUrl;
    }, [videoUrl]);

    return (
        <div className="cre-video-wrapper w-full flex flex-col items-center">
            <h2 className="cre-heading-gold">Dokumentasi Video</h2>
            <div className="cre-video-container-wrapper w-full max-w-xl px-2">
                <div className="cre-video-container">
                    <iframe 
                        src={embedUrl}
                        title="Video Undangan"
                        allowFullScreen
                        allow="autoplay; encrypted-media"
                    />
                </div>
            </div>
        </div>
    );
}

// 10. DRESSCODE SECTION
function DresscodeSection({ invitation, locale }) {
    const show = parseBool(invitation?.show_dress_code);
    const text = invitation?.dress_code_text;
    const colors = invitation?.dress_code_colors ? invitation.dress_code_colors.split(',') : [];

    if (!show || (!text && colors.length === 0)) return null;

    return (
        <div className="cre-dresscode-wrapper w-full">
            <h2 className="cre-heading-gold">Dress Code</h2>
            <div className="cre-card w-full max-w-md mx-auto">
                <div className="cre-card-accent-border" />
                {text && <p className="text-xs text-center text-muted leading-relaxed mb-4">{text}</p>}
                
                {colors.length > 0 && (
                    <div className="flex justify-center items-center gap-3">
                        {colors.map((c, idx) => (
                            <div 
                                key={idx}
                                className="cre-dresscode-color-circle"
                                style={{ backgroundColor: c.trim() }}
                                title={c.trim()}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// 11. UNIFIED RSVP & WISHES SECTION (as mandated by Section 4.7)
function UnifiedRsvpWishes({ invitation, guest, wishes, locale }) {
    const { t } = useTranslation();
    const rsvpForm = useForm({
        name: guest?.name || '',
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
        guest_id: guest?.id || null
    });
    const [localWishes, setLocalWishes] = useState(safeArr(wishes));
    const [sent, setSent] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        rsvpForm.post(route('invitation.rsvp', invitation.slug), {
            onSuccess: () => {
                // Auto add to wishes if message is filled
                if (rsvpForm.data.message.trim()) {
                    setLocalWishes(prev => [
                        { sender_name: rsvpForm.data.name, message: rsvpForm.data.message },
                        ...prev
                    ]);
                }
                rsvpForm.reset('message');
                setSent(true);
                setTimeout(() => setSent(false), 4000);
            }
        });
    };

    return (
        <div className="cre-rsvp-wrapper w-full flex flex-col items-center">
            <h2 className="cre-heading-gold">{t('invitation.rsvp_title')}</h2>
            
            <form onSubmit={submit} className="cre-rsvp-form text-cre-text">
                <div className="text-left mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Nama Tamu</label>
                    <input 
                        type="text" 
                        className="cre-input" 
                        placeholder="Nama Lengkap" 
                        value={rsvpForm.data.name} 
                        onChange={e => rsvpForm.setData('name', e.target.value)} 
                        required 
                    />
                </div>

                <div className="text-left mb-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Kehadiran</label>
                    <select 
                        className="cre-input cre-select" 
                        value={rsvpForm.data.attendance} 
                        onChange={e => rsvpForm.setData('attendance', e.target.value)} 
                        required
                    >
                        <option value="hadir">Hadir</option>
                        <option value="tidak_hadir">Tidak Hadir</option>
                        <option value="belum_pasti">Belum Pasti</option>
                    </select>
                </div>

                {rsvpForm.data.attendance === 'hadir' && (
                    <div className="text-left mb-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Jumlah Tamu</label>
                        <input 
                            type="number" 
                            className="cre-input" 
                            min="1" 
                            max="10" 
                            value={rsvpForm.data.number_of_guests} 
                            onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value))} 
                            required 
                        />
                    </div>
                )}

                <div className="text-left mb-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Ucapan &amp; Doa Restu</label>
                    <textarea 
                        className="cre-input" 
                        rows="3" 
                        placeholder="Tuliskan ucapan selamat / pesan di sini..." 
                        value={rsvpForm.data.message} 
                        onChange={e => rsvpForm.setData('message', e.target.value)} 
                        style={{ resize: 'none' }}
                    />
                </div>

                {sent && (
                    <p style={{ color: 'var(--cre-accent)', fontSize: '12px', fontWeight: 700, marginBottom: '15px' }}>
                        ✓ Konfirmasi &amp; Ucapan Berhasil Dikirim!
                    </p>
                )}

                <button type="submit" className="cre-btn-gold w-full justify-center" disabled={rsvpForm.processing}>
                    {rsvpForm.processing ? 'Mengirim...' : 'Kirim Kehadiran'}
                </button>
            </form>

            {/* Scrollable Wishes List limited to 5 items max-height as mandated by Section 4.7 */}
            <div className="w-full max-w-md mt-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted text-center mb-3">Daftar Ucapan Tamu</h3>
                <div className="cre-wishes-scroll-container">
                    {localWishes.length === 0 ? (
                        <p style={{ opacity: 0.5, fontSize: '0.8rem', textAlign: 'center' }}>Belum ada ucapan.</p>
                    ) : (
                        localWishes.map((w, idx) => (
                            <div key={w.id || idx} className="cre-wish-item animate-scale-in">
                                <div className="cre-wish-name">{w.sender_name}</div>
                                <div className="cre-wish-msg">{w.message}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// 12. DIGITAL GIFT SECTION (LUXURY-02 PREMIUM CARD STYLE)
function BankSection({ bankAccounts }) {
    const list = safeArr(bankAccounts).sort((a, b) => a.sort_order - b.sort_order);

    const fallbackCopy = (text) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    };

    const handleCopy = (num) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(num)
                .then(() => alert('Nomor rekening berhasil disalin!'))
                .catch(() => { fallbackCopy(num); alert('Nomor rekening berhasil disalin!'); });
        } else {
            fallbackCopy(num);
            alert('Nomor rekening berhasil disalin!');
        }
    };

    return (
        <div className="cre-bank-wrapper w-full flex flex-col items-center">
            <h2 className="cre-heading-gold">Amplop Digital</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--cre-text-muted)', marginBottom: '25px', maxWidth: '400px' }}>
                Bagi Anda yang ingin mengirimkan hadiah digital, silakan transfer secara cashless ke rekening berikut:
            </p>

            <div className="flex flex-col gap-4 w-full items-center">
                {list.map((acc, idx) => (
                    <div key={acc.id || idx} className="cre-bank-card relative overflow-hidden">
                        {/* Pure CSS metallic gold ATM chip to prevent broken image asset issue */}
                        <div className="cre-card-chip">
                            <div className="cre-chip-line-v" />
                            <div className="cre-chip-line-h" />
                            <div className="cre-chip-inner" />
                        </div>
                        
                        <div className="cre-bank-logo">{acc.bank_name}</div>
                        <div className="cre-bank-number">{acc.account_number}</div>
                        <div className="cre-bank-holder">A.N. {acc.account_name}</div>
                        
                        <button 
                            type="button" 
                            onClick={() => handleCopy(acc.account_number)} 
                            className="cre-bank-copy-btn"
                        >
                            📋 Salin Rekening
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 13. CLOSING SECTION
function ClosingSection({ invitation, brideGrooms, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const eventType = invitation?.type || 'wedding';
    const isSingleSubject = !['wedding', 'anniversary'].includes(eventType);

    const groom = bgs.find(b => b.gender === 'pria') || bgs[0] || {};
    const bride = bgs.find(b => b.gender === 'wanita') || bgs[1] || {};

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const isEn = locale === 'en';

    return (
        <div className="cre-closing-wrapper">
            <div className="cre-script-title">{formatScriptTitle(invitation?.closing_title || t('invitation.closing_title') || 'Thank You')}</div>
            <h2 className="cre-heading-gold">{isSingleSubject ? 'Penutup' : 'Salam Hormat Kami'}</h2>
            
            {invitation?.closing_text ? (
                <p className="cre-closing-text mx-auto">{invitation.closing_text}</p>
            ) : (
                <p className="cre-closing-text mx-auto">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu bagi kami.
                </p>
            )}

            {/* Dynamic parents names signatures (hide for business/cafe type birthdays) */}
            {!isSingleSubject && (
                <div className="cre-signatures flex flex-col md:flex-row gap-6 mt-8 justify-center text-xs font-semibold uppercase tracking-wider text-muted">
                    {groom.father_name && (
                        <div>
                            {isEn ? `Family of Mr. ${groom.father_name} & Mrs. ${groom.mother_name}` : `Kel. Bpk. ${groom.father_name} & Ibu ${groom.mother_name}`}
                        </div>
                    )}
                    {bride.father_name && (
                        <div>
                            {isEn ? `Family of Mr. ${bride.father_name} & Mrs. ${bride.mother_name}` : `Kel. Bpk. ${bride.father_name} & Ibu ${bride.mother_name}`}
                        </div>
                    )}
                </div>
            )}

            {/* Standard Watermark CREDIT in bottom footer */}
            <p className="cre-watermark mt-12 text-[10px] text-muted tracking-widest uppercase">
                Made with ❤️ by {brandName}
            </p>
        </div>
    );
}


/* ════════════════════════════════════════════
   MAIN THEME ROOT COMPONENT
   ════════════════════════════════════════════ */
export default function DynamicIndex({ 
    invitation, 
    brideGrooms = [], 
    events = [], 
    galleries = [], 
    loveStories = [], 
    bankAccounts = [], 
    wishes = [], 
    guest = null 
}) {
    const [isOpened, setIsOpened] = useState(false);
    const [coverMounted, setCoverMounted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);

    const showPhotos = parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);

    // Initializing global contexts
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    const audioRef = useRef(null);

    // Visibility observer audio controller hook (as mandated by Section 8.1)
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    useEffect(() => {
        if (!isOpened) {
            document.body.classList.add('cre-body-locked');
        } else {
            document.body.classList.remove('cre-body-locked');
        }
        return () => {
            document.body.classList.remove('cre-body-locked');
        };
    }, [isOpened]);

    // Preload audio
    useEffect(() => {
        const url = invitation?.music_url || '/audio/backsound.mp3';
        audioRef.current = new Audio(url);
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [invitation?.music_url]);

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.log('Audio error:', e));
            setIsPlaying(true);
        }
    };

    const handleOpen = () => {
        setIsOpened(true);
        // Autoplay music upon open
        if (audioRef.current && parseBool(invitation?.music_autoplay, true)) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.log('Autoplay blocked:', e));
        }

        // Trigger requestFullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        // Delay unmounting cover for slide out animation
        setTimeout(() => setCoverMounted(false), 900);
    };

    // Fullscreen event listener
    useEffect(() => {
        const handleFullscreen = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreen);
        return () => document.removeEventListener('fullscreenchange', handleFullscreen);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    };

    // Setup Dynamic Sections visible list
    const resolvedSections = useMemo(() => {
        const list = [{ key: 'hero' }];
        const dbSections = safeArr(invitation?.sections);

        const hasGallery = galleries?.length > 0 && showPhotos;
        const hasVideo = !!invitation?.video_url;
        const hasStream = events.some(e => e.streaming_url || safeArr(e.streamings).length > 0);
        const hasStories = loveStories?.length > 0;
        const hasBank = bankAccounts?.length > 0;
        const enableRsvp = parseBool(invitation?.enable_rsvp, true);
        const enableWishes = parseBool(invitation?.enable_wishes, true);

        if (dbSections.length > 0) {
            const sorted = dbSections
                .filter(s => s.is_visible)
                .sort((a, b) => a.sort_order - b.sort_order);

            sorted.forEach(s => {
                const k = s.section_key;
                if (k === 'countdown') return; // integrated inside event
                if (k === 'love_story' && !hasStories) return;
                if (k === 'gallery') {
                    if (hasGallery) list.push({ key: 'gallery' });
                    if (hasVideo) list.push({ key: 'video' });
                    return;
                }
                if (k === 'bank' && !hasBank) return;
                if (k === 'rsvp' && !enableRsvp) return;
                if (k === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return; // merged in RSVP form
                }
                if (k === 'livestream' && !hasStream) return;
                
                list.push({ key: k });
                if (k === 'event' && hasStream) {
                    list.push({ key: 'livestream' });
                }
            });
        } else {
            // Default list if not seeded
            list.push({ key: 'opening' });
            list.push({ key: 'bride_groom' });
            list.push({ key: 'event' });
            if (hasStream) list.push({ key: 'livestream' });
            if (hasStories) list.push({ key: 'love_story' });
            if (hasGallery) list.push({ key: 'gallery' });
            if (hasVideo) list.push({ key: 'video' });
            if (enableRsvp) list.push({ key: 'rsvp' });
            if (enableWishes && !enableRsvp) list.push({ key: 'wishes' });
            if (hasBank) list.push({ key: 'bank' });
            list.push({ key: 'closing' });
        }
        return list;
    }, [invitation?.sections, galleries, loveStories, bankAccounts, events, showPhotos]);

    // Filter list for navigation menu
    const navItems = useMemo(() => {
        return resolvedSections.filter(s => s.key !== 'hero');
    }, [resolvedSections]);

    const [activeSection, setActiveSection] = useState('opening');

    // Centering scroll position of bottom fixed nav bar when active section changes
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.cre-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // Scrollspy scroll listener (as mandated by Section 5.1)
    useEffect(() => {
        if (!isOpened) return;
        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            for (const item of navItems) {
                const el = document.getElementById(item.key);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(item.key);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, navItems]);

    const navigateToSection = (key) => {
        const el = document.getElementById(key);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            setActiveSection(key);
        }
    };

    const coverImages = useMemo(() => {
        const str = invitation?.cover_image || '';
        return str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
    }, [invitation?.cover_image]);

    const openingImages = useMemo(() => {
        const str = invitation?.opening_image || '';
        return str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
    }, [invitation?.opening_image]);

    const showCountdownInEvent = useMemo(() => {
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (!primaryEvent?.event_date || !parseBool(invitation?.show_countdown, true)) return false;
        
        const cSection = safeArr(invitation?.sections).find(s => s.section_key === 'countdown');
        return cSection ? !!cSection.is_visible : true;
    }, [invitation?.sections, events]);

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    return (
        <ErrorBoundary>
            <div className={`cre-page cre-wrapper ${!showAnimations ? 'theme-no-animations' : ''}`}>
                <Head>
                    <title>{invitation?.title || 'Undangan Digital'}</title>
                    <meta name="description" content={`HUT & Ulang Tahun ${invitation?.title}`} />
                </Head>

                {invitation?.particle_type && invitation.particle_type !== 'none' && isOpened && (
                    <ParticleEffect
                        type={invitation.particle_type}
                        count={invitation.particle_count || 30}
                        speed={invitation.particle_speed || 'normal'}
                    />
                )}

                {invitation?.music_url && (
                    <audio ref={audioRef} loop preload="auto" playsInline>
                        <source src={getStorageUrl(invitation.music_url)} type="audio/mpeg" />
                    </audio>
                )}

                {/* Cover view */}
                {coverMounted && (
                    <CoverSection
                        invitation={invitation}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        coverImages={coverImages}
                        guest={guest}
                    />
                )}

                {/* Main View Container */}
                <div className="cre-container">
                    <div className="cre-main">
                        {resolvedSections.map((sec, idx) => {
                            const k = sec.key;
                            if (k === 'hero') return null;

                            // Dynamic alternating background colors for creative visual rhythm
                            let secClass = 'cre-section-light';
                            if (['bride_groom', 'rsvp', 'wishes'].includes(k)) {
                                secClass = 'cre-section-dark-burgundy';
                            } else if (['love_story', 'closing'].includes(k)) {
                                secClass = 'cre-section-dark-charcoal';
                            }

                            // Component mapping
                            let comp = null;
                            if (k === 'opening') {
                                comp = <OpeningSection invitation={invitation} brideGrooms={brideGrooms} openingImages={openingImages} events={events} showCountdown={showCountdownInEvent} locale={locale} />;
                            } else if (k === 'bride_groom') {
                                comp = <BrideGroomSection brideGrooms={brideGrooms} invitation={invitation} locale={locale} />;
                            } else if (k === 'event') {
                                comp = <EventSection events={events} locale={locale} />;
                            } else if (k === 'livestream') {
                                comp = <LiveStreamingSection events={events} locale={locale} />;
                            } else if (k === 'love_story') {
                                comp = <LoveStorySection loveStories={loveStories} invitation={invitation} />;
                            } else if (k === 'gallery') {
                                comp = <GallerySection galleries={galleries} />;
                            } else if (k === 'video') {
                                comp = <VideoSection invitation={invitation} />;
                            } else if (k === 'dresscode') {
                                comp = <DresscodeSection invitation={invitation} locale={locale} />;
                            } else if (k === 'rsvp' || k === 'wishes') {
                                comp = <UnifiedRsvpWishes invitation={invitation} guest={guest} wishes={wishes} locale={locale} />;
                            } else if (k === 'bank') {
                                comp = <BankSection bankAccounts={bankAccounts} />;
                            } else if (k === 'closing') {
                                comp = <ClosingSection invitation={invitation} brideGrooms={brideGrooms} locale={locale} />;
                            }

                            if (!comp) return null;

                            return (
                                <React.Fragment key={k}>
                                    {/* Page/Section separators rendered in between */}
                                    {idx > 1 && <SectionSeparator />}

                                    <section id={k} className={`cre-section ${secClass}`}>
                                        {/* Golden Corner ornaments (orname pojok halaman) */}
                                        <div className="cre-corner-gold cre-corner-top-left" />
                                        <div className="cre-corner-gold cre-corner-top-right" />
                                        <div className="cre-corner-gold cre-corner-bottom-left" />
                                        <div className="cre-corner-gold cre-corner-bottom-right" />

                                        {/* Lattice Grid Background */}
                                        <div className="cre-bg-overlay-transparent" />

                                        {/* Content Wrapper */}
                                        <div className="cre-section-content">
                                            {comp}
                                        </div>
                                    </section>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Navigation Menu (with responsive sidebar capsule layout on desktop) */}
                {isOpened && navItems.length > 0 && (
                    <div className="cre-nav-wrapper">
                        <nav className="cre-nav">
                            {navItems.map((item) => {
                                const k = item.key;
                                const isActive = activeSection === k;
                                const iconMap = {
                                    'opening': BookOpen,
                                    'bride_groom': Heart,
                                    'event': Coffee, // Cafe themed icon
                                    'livestream': Video,
                                    'love_story': History,
                                    'gallery': Image,
                                    'video': Film,
                                    'dresscode': Shirt,
                                    'rsvp': MessageSquare,
                                    'wishes': MessageSquare,
                                    'bank': Gift,
                                    'closing': Award,
                                };
                                const nameMap = {
                                    'opening': locale === 'en' ? 'Intro' : 'Intro',
                                    'bride_groom': locale === 'en' ? 'Profile' : 'Profil',
                                    'event': locale === 'en' ? 'Agenda' : 'Acara',
                                    'livestream': 'Live',
                                    'love_story': locale === 'en' ? 'History' : 'Sejarah',
                                    'gallery': locale === 'en' ? 'Gallery' : 'Galeri',
                                    'video': 'Video',
                                    'dresscode': 'Dress',
                                    'rsvp': 'RSVP',
                                    'wishes': locale === 'en' ? 'Wishes' : 'Ucapan',
                                    'bank': locale === 'en' ? 'Gift' : 'Kado',
                                    'closing': locale === 'en' ? 'End' : 'Tutup',
                                };
                                const IconComponent = iconMap[k] || Sparkles;
                                return (
                                    <button
                                        key={k}
                                        type="button"
                                        id={`nav-btn-${k}`}
                                        onClick={() => navigateToSection(k)}
                                        className={`cre-nav-btn ${isActive ? 'is-active' : ''}`}
                                    >
                                        <IconComponent size={16} />
                                        <span className="cre-nav-label">{nameMap[k] || k}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}

                {/* Floating controls panel */}
                {isOpened && (
                    <div className="cre-floating-controls">
                        {invitation?.music_url && (
                            <button 
                                type="button" 
                                onClick={toggleMusic} 
                                className="cre-float-btn"
                                title={isPlaying ? 'Pause Music' : 'Play Music'}
                            >
                                {isPlaying ? (
                                    <div className="global-music-waves">
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                ) : (
                                    <VolumeX size={16} />
                                )}
                            </button>
                        )}

                        <button 
                            type="button" 
                            onClick={toggleFullscreen} 
                            className="cre-float-btn"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>

                        {enableQr && guest && (
                            <button 
                                type="button" 
                                onClick={() => setShowQr(true)} 
                                className="cre-float-btn"
                                title="Show Check-in QR"
                            >
                                <QrCode size={16} />
                            </button>
                        )}
                    </div>
                )}

                {/* QR Code Presensi Overlay Modal */}
                {enableQr && showQr && guest && (
                    <div className="cre-modal-overlay animate-fade-in" onClick={() => setShowQr(false)}>
                        <div className="cre-modal-content animate-scale-in" onClick={e => e.stopPropagation()}>
                            <h3 className="cre-modal-title">VIP Ticket QR Check-in</h3>
                            <p className="cre-modal-subtitle">{locale === 'en' ? 'Show this QR code to cafe receptionist' : 'Tunjukkan QR code ini ke resepsionis kafe'}</p>
                            
                            <div className="cre-qr-wrapper flex justify-center my-6">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=800020&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                    alt="QR Code Presensi" 
                                />
                            </div>
                            
                            <button 
                                type="button" 
                                onClick={() => setShowQr(false)} 
                                className="cre-btn-gold w-full justify-center"
                            >
                                {locale === 'en' ? 'Close' : 'Tutup'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    );
}
