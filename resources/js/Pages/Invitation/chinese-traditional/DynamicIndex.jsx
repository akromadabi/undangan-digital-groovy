import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import ParticleEffect from '@/Components/ParticleEffect';
import { 
    Calendar, Clock, MapPin, Music2, Music, Heart, MessageSquare, Gift, Check, Send, Sparkles, Building, QrCode, 
    Volume2, VolumeX, Maximize2, Minimize2, BookOpen, Video, History, Image, Film, Shirt, Award, Coffee, Share,
    Play, Pause
} from 'lucide-react';
import './style.css';

// Global context overrides for sub-components
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
            <div style={{ padding: 40, textAlign: 'center', background: '#ffebeb', color: '#cc0000' }}>
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

    let baseClass = 'chi-reveal--up';
    if (variant === 'zoom') baseClass = 'chi-reveal--zoom';
    else if (variant === 'left') baseClass = 'chi-reveal--left';
    else if (variant === 'right') baseClass = 'chi-reveal--right';
    else if (variant === 'down') baseClass = 'chi-reveal--down';

    return (
        <div
            ref={ref}
            className={`${className} chi-reveal ${baseClass} ${visible ? 'chi-reveal-visible' : ''}`}
            style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ─── PAGE SEPARATOR ORNAMENT ─── */
function SectionSeparator({ emblem }) {
    return (
        <div className="chi-section-separator">
            <div className="chi-separator-line" />
            <div className="chi-separator-emblem">{emblem}</div>
            <div className="chi-separator-line" />
        </div>
    );
}

/* ─── SECTIONS MODULES ─── */

// 1. COVER SECTION
function CoverSection({ invitation, isOpened, onOpen, coverImages, guest, resolvedContent, resolvedCoverTitle }) {
    const isWedding = invitation?.type !== 'birthday' && invitation?.type !== 'general' && invitation?.type !== 'anniversary';
    const coverBadge = invitation?.type === 'birthday' ? 'Birthday Invitation' : (invitation?.type === 'anniversary' ? 'Anniversary Invitation' : (isWedding ? 'The Wedding Invitation' : 'Special Invitation'));
    const emblem = invitation?.type === 'birthday' ? '壽' : (invitation?.type === 'general' || invitation?.type === 'anniversary' ? '福' : '囍');
    
    return (
        <div className={`chi-cover ${isOpened ? 'opened' : ''}`} style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'var(--chi-bg)',
            transition: 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
            transform: isOpened ? 'translateY(-100%)' : 'none',
            overflow: 'hidden'
        }}>
            <div className="chi-bg-overlay-transparent" />
            
            {/* Elegant double borders */}
            <div className="chi-corner-gold chi-corner-top-left" style={{ zIndex: 4 }} />
            <div className="chi-corner-gold chi-corner-top-right" style={{ zIndex: 4 }} />
            <div className="chi-corner-gold chi-corner-bottom-left" style={{ zIndex: 4 }} />
            <div className="chi-corner-gold chi-corner-bottom-right" style={{ zIndex: 4 }} />

            <div className="chi-cover-wrapper">
                <div className="chi-cover-top">
                    <div className="chi-cover-badge">
                        {coverBadge}
                    </div>
                </div>

                <div className="chi-cover-center">
                    <div className="chi-double-happiness-logo">{emblem}</div>
                    <h1 className="chi-cover-title">
                        {resolvedCoverTitle}
                    </h1>
                    <p className="chi-cover-subtitle">
                        {resolvedContent.coverSubtitle}
                    </p>
                </div>

                <div className="chi-cover-bottom">
                    {guest?.name && (
                        <div className="chi-cover-guest-box">
                            <div className="chi-cover-guest-lbl">Dear Tamu Undangan</div>
                            <div className="chi-cover-guest-name">{guest.name}</div>
                        </div>
                    )}
                    <button className="chi-btn chi-btn-primary" onClick={onOpen} style={{ marginTop: 24 }}>
                        <BookOpen size={16} /> Open Invitation
                    </button>
                </div>
            </div>
        </div>
    );
}

// 2. OPENING SECTION
function OpeningSection({ invitation, resolvedContent }) {
    const emblem = invitation?.type === 'birthday' ? '壽' : (invitation?.type === 'general' || invitation?.type === 'anniversary' ? '福' : '囍');
    
    return (
        <section id="opening" className="chi-section chi-section-light">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <div className="chi-double-happiness-logo" style={{ fontSize: '2.5rem', marginBottom: 20 }}>{emblem}</div>
                </Reveal>
                
                <Reveal delay={200}>
                    <h2 className="chi-script-title">
                        {formatScriptTitle(resolvedContent.openingTitle)}
                    </h2>
                </Reveal>

                {resolvedContent.openingAyat && (
                    <Reveal delay={400} className="chi-reveal">
                        <div style={{
                            margin: '24px auto',
                            padding: '0 20px',
                            maxWidth: '520px',
                            fontStyle: 'italic',
                            lineHeight: 1.8,
                            fontSize: '0.85rem',
                            color: 'var(--chi-text-muted)',
                            borderLeft: '2.5px solid var(--chi-accent)',
                            borderRight: '2.5px solid var(--chi-accent)',
                        }}>
                            "{resolvedContent.openingAyat}"
                            {resolvedContent.openingAyatSource && (
                                <strong style={{ display: 'block', marginTop: 10, fontSize: '0.72rem', letterSpacing: 1.5 }}>
                                    — {resolvedContent.openingAyatSource}
                                </strong>
                            )}
                        </div>
                    </Reveal>
                )}

                <Reveal delay={600}>
                    <p style={{ maxWidth: '520px', fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--chi-text)' }}>
                        {invitation?.opening_text || 'Dengan penuh sukacita dan rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk merayakan hari yang istimewa ini bersama kami.'}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

// 3. MEMPELAI / SUBJEK SECTION
function BrideGroomSection({ invitation, brideGrooms, isSingleSubject }) {
    const safeSubjects = safeArr(brideGrooms);
    const isWedding = invitation?.type !== 'birthday' && invitation?.type !== 'general' && invitation?.type !== 'anniversary';
    const sectionTitle = isWedding 
        ? (isSingleSubject ? 'Profil Penyelenggara' : 'Mempelai / Profil')
        : (isSingleSubject ? 'Profil Yang Berbahagia' : 'Profil Penyelenggara');
    
    return (
        <section id="bride_groom" className="chi-section chi-section-dark-red">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">
                        {sectionTitle}
                    </h2>
                </Reveal>
                <div className="chi-section-subtitle">Meet the Celebrants</div>

                <div className="chi-cards-container">
                    {safeSubjects.map((sub, idx) => {
                        const avatarUrl = getStorageUrl(sub.photo);
                        const genderEmoji = sub.gender === 'wanita' ? '👰' : '🤵';
                        
                        return (
                            <Reveal key={sub.id || idx} variant={idx % 2 === 0 ? 'left' : 'right'} delay={idx * 150}>
                                <div className="chi-card">
                                    <div className="chi-corner-gold chi-corner-top-left" style={{ width: 25, height: 25 }} />
                                    <div className="chi-corner-gold chi-corner-top-right" style={{ width: 25, height: 25 }} />
                                    <div className="chi-corner-gold chi-corner-bottom-left" style={{ width: 25, height: 25 }} />
                                    <div className="chi-corner-gold chi-corner-bottom-right" style={{ width: 25, height: 25 }} />

                                    {globalShowPhotos && avatarUrl ? (
                                        <img src={avatarUrl} alt={sub.full_name} className="chi-card-avatar" />
                                    ) : (
                                        <div className="chi-card-avatar-placeholder">{genderEmoji}</div>
                                    )}
                                    
                                    <h3 className="chi-card-title">{sub.full_name}</h3>
                                    {sub.nickname && <div className="chi-card-sub">({sub.nickname})</div>}
                                    
                                    {sub.bio && <p className="chi-card-bio">"{sub.bio}"</p>}
                                    
                                    {((sub.father_name && sub.father_name.trim() !== '') || (sub.mother_name && sub.mother_name.trim() !== '')) && (
                                        <div className="chi-card-parents">
                                            {sub.child_order && <div>Putra/Putri Ke-{sub.child_order}</div>}
                                            <div style={{ marginTop: 4, fontWeight: 'bold' }}>
                                                {sub.father_name && sub.mother_name ? (
                                                    `Bapak ${sub.father_name} & Ibu ${sub.mother_name}`
                                                ) : sub.father_name ? (
                                                    `Bapak ${sub.father_name}`
                                                ) : (
                                                    `Ibu ${sub.mother_name}`
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {sub.instagram && (
                                        <a href={`https://instagram.com/${sub.instagram}`} target="_blank" rel="noopener noreferrer" className="chi-btn-instagram">
                                            <i className="fab fa-instagram" /> @{sub.instagram}
                                        </a>
                                    )}
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// 4. COUNTDOWN SECTION
function CountdownSection({ invitation }) {
    const cd = useCountdown(invitation?.countdown_target_date, '18:00');
    
    return (
        <section id="countdown" className="chi-section chi-section-light">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Hitung Mundur</h2>
                </Reveal>
                <div className="chi-section-subtitle">Save The Date</div>

                <Reveal delay={200}>
                    <div className="chi-countdown">
                        <div className="chi-countdown-box">
                            <span className="chi-countdown-num">{String(cd.d).padStart(2, '0')}</span>
                            <span className="chi-countdown-lbl">Hari</span>
                        </div>
                        <div className="chi-countdown-box">
                            <span className="chi-countdown-num">{String(cd.h).padStart(2, '0')}</span>
                            <span className="chi-countdown-lbl">Jam</span>
                        </div>
                        <div className="chi-countdown-box">
                            <span className="chi-countdown-num">{String(cd.m).padStart(2, '0')}</span>
                            <span className="chi-countdown-lbl">Menit</span>
                        </div>
                        <div className="chi-countdown-box">
                            <span className="chi-countdown-num">{String(cd.s).padStart(2, '0')}</span>
                            <span className="chi-countdown-lbl">Detik</span>
                        </div>
                    </div>
                </Reveal>

                {invitation?.countdown_target_date && (
                    <Reveal delay={400}>
                        <div style={{ marginTop: 20, fontFamily: 'var(--chi-font-heading)', fontWeight: 'bold', color: 'var(--chi-primary)' }}>
                            {formatDate(invitation.countdown_target_date)}
                        </div>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

// 5. TIMELINE / LOVE STORY SECTION
function LoveStorySection({ loveStories }) {
    const safeStories = safeArr(loveStories);
    if (safeStories.length === 0) return null;
    
    return (
        <section id="love_story" className="chi-section chi-section-dark-charcoal">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Kisah Kami</h2>
                </Reveal>
                <div className="chi-section-subtitle">Our Journey & Milestones</div>

                <div className="chi-timeline">
                    {safeStories.map((story, idx) => (
                        <div className="chi-timeline-item" key={story.id || idx}>
                            <Reveal variant="left" delay={idx * 100}>
                                <div className="chi-timeline-date">{formatDate(story.story_date)}</div>
                                <h3 className="chi-timeline-title">{story.title}</h3>
                                <p className="chi-timeline-desc">{story.description}</p>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 6. AGENDA / EVENT SECTION
function EventSection({ events, invitation }) {
    const safeEvents = safeArr(events);
    if (safeEvents.length === 0) return null;
    
    const isWedding = invitation?.type !== 'birthday' && invitation?.type !== 'general' && invitation?.type !== 'anniversary';
    
    return (
        <section id="event" className="chi-section chi-section-light">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Agenda & Waktu</h2>
                </Reveal>
                <div className="chi-section-subtitle">Events & Ceremonies</div>

                <div className="chi-events-container">
                    {safeEvents.map((evt, idx) => (
                        <Reveal key={evt.id || idx} variant="up" delay={idx * 150}>
                            <div className="chi-event-card">
                                <div className="chi-corner-gold chi-corner-top-left" style={{ width: 25, height: 25 }} />
                                <div className="chi-corner-gold chi-corner-top-right" style={{ width: 25, height: 25 }} />
                                <div className="chi-corner-gold chi-corner-bottom-left" style={{ width: 25, height: 25 }} />
                                <div className="chi-corner-gold chi-corner-bottom-right" style={{ width: 25, height: 25 }} />

                                <div className="chi-event-card-header">
                                    <div className="chi-event-badge">
                                        {isWedding 
                                            ? (evt.event_type === 'utama' ? 'Akad / Pemberkatan' : 'Resepsi')
                                            : (evt.event_type === 'utama' ? 'Acara Utama' : 'Pesta / Perayaan')
                                        }
                                    </div>
                                    <h3 className="chi-event-name">{evt.event_name}</h3>
                                </div>
                                
                                <div className="chi-event-details">
                                    <div className="chi-event-detail-item">
                                        <Calendar size={18} className="chi-event-icon" />
                                        <span className="chi-event-val">{formatDate(evt.event_date)}</span>
                                    </div>
                                    <div className="chi-event-detail-item">
                                        <Clock size={18} className="chi-event-icon" />
                                        <span className="chi-event-val">
                                            {fmtTime(evt.start_time)} - {evt.end_time === 'Selesai' ? 'Selesai' : fmtTime(evt.end_time)} {evt.timezone}
                                        </span>
                                    </div>
                                    <div className="chi-event-detail-item">
                                        <MapPin size={18} className="chi-event-icon" />
                                        <span className="chi-event-val" style={{ fontWeight: 'bold' }}>{evt.venue_name}</span>
                                        <span style={{ fontSize: '0.72rem', color: 'var(--chi-text-muted)', marginTop: 4, maxWidth: '280px' }}>
                                            {evt.venue_address}
                                        </span>
                                    </div>
                                </div>

                                {evt.gmaps_link && (
                                    <a href={evt.gmaps_link} target="_blank" rel="noopener noreferrer" className="chi-btn chi-btn-primary" style={{ padding: '8px 18px', fontSize: '0.68rem' }}>
                                        <MapPin size={12} /> Google Maps
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 7. GALERI SECTION
function GallerySection({ galleries }) {
    const safeGalleries = safeArr(galleries);
    if (safeGalleries.length === 0) return null;
    
    return (
        <section id="gallery" className="chi-section chi-section-light">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Galeri Keindahan</h2>
                </Reveal>
                <div className="chi-section-subtitle">Moments Captured</div>

                <div className="chi-gallery-grid">
                    {safeGalleries.map((g, idx) => {
                        const imgUrl = getStorageUrl(g.image_url);
                        return (
                            <Reveal key={g.id || idx} variant="zoom" delay={idx * 80}>
                                <div className="chi-gallery-item">
                                    <img src={imgUrl} alt={g.caption || 'Foto'} className="chi-gallery-img" />
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// 8. RSVP & WISHES SECTION
function RsvpSection({ invitation, wishes, invitationId }) {
    const [wishesList, setWishesList] = useState(safeArr(wishes));
    const { data, setData, post, processing, reset, errors } = useForm({
        sender_name: '',
        message: '',
        is_attending: '1',
        total_guests: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('wishes.store', { invitation: invitationId }), {
            onSuccess: (page) => {
                const newWish = {
                    id: Date.now(),
                    sender_name: data.sender_name,
                    message: data.message,
                    is_attending: data.is_attending,
                };
                setWishesList([newWish, ...wishesList]);
                reset();
            }
        });
    };

    return (
        <section id="rsvp" className="chi-section chi-section-dark-red">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Konfirmasi Kehadiran</h2>
                </Reveal>
                <div className="chi-section-subtitle">RSVP & Wishes Feed</div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, width: '100%' }}>
                    
                    {/* RSVP Form */}
                    <Reveal variant="up">
                        <form onSubmit={handleSubmit} className="chi-rsvp-form">
                            <div className="chi-form-group">
                                <label className="chi-label">Nama Anda</label>
                                <input 
                                    type="text" 
                                    className="chi-input" 
                                    placeholder="Masukkan nama"
                                    value={data.sender_name} 
                                    onChange={e => setData('sender_name', e.target.value)} 
                                    required 
                                />
                                {errors.sender_name && <span style={{ color: '#ff7777', fontSize: '0.7rem' }}>{errors.sender_name}</span>}
                            </div>
                            
                            <div className="chi-form-group">
                                <label className="chi-label">Konfirmasi Kehadiran</label>
                                <select 
                                    className="chi-select"
                                    value={data.is_attending} 
                                    onChange={e => setData('is_attending', e.target.value)}
                                >
                                    <option value="1">Hadir (出席)</option>
                                    <option value="0">Tidak Hadir (缺席)</option>
                                </select>
                            </div>

                            <div className="chi-form-group">
                                <label className="chi-label">Pesan / Ucapan Restu</label>
                                <textarea 
                                    className="chi-input" 
                                    rows="4" 
                                    placeholder="Tuliskan ucapan restu Anda..."
                                    value={data.message} 
                                    onChange={e => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && <span style={{ color: '#ff7777', fontSize: '0.7rem' }}>{errors.message}</span>}
                            </div>

                            <button type="submit" disabled={processing} className="chi-btn chi-btn-gold" style={{ width: '100%' }}>
                                <Send size={14} /> {processing ? 'Mengirim...' : 'Kirim Kehadiran'}
                            </button>
                        </form>
                    </Reveal>

                    {/* Wishes Feed */}
                    {wishesList.length > 0 && (
                        <Reveal variant="up" delay={200}>
                            <h3 className="chi-heading-gold" style={{ fontSize: '1rem', marginTop: 15 }}>Gelembung Doa Restu</h3>
                            <div className="chi-wishes-feed">
                                {wishesList.map((w) => (
                                    <div className="chi-wish-item" key={w.id}>
                                        <div className="chi-wish-name">
                                            {w.sender_name} 
                                            <span style={{ fontSize: '0.65rem', marginLeft: 8, fontWeight: 'normal', color: w.is_attending == 1 ? '#00b300' : '#888' }}>
                                                {w.is_attending == 1 ? '• Hadir' : '• Absen'}
                                            </span>
                                        </div>
                                        <p className="chi-wish-msg">{w.message}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    )}
                </div>
            </div>
        </section>
    );
}

// 9. DIGITAL GIFT / AMPLOP SECTION
function BankSection({ bankAccounts }) {
    const safeAccounts = safeArr(bankAccounts);
    if (safeAccounts.length === 0) return null;
    
    return (
        <section id="bank" className="chi-section chi-section-light">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <h2 className="chi-heading-gold">Amplop Digital</h2>
                </Reveal>
                <div className="chi-section-subtitle">Angpao / Digital Gift</div>
                
                <Reveal delay={200}>
                    <p className="chi-gift-info-text">
                        Bagi Bapak/Ibu/Saudara/i yang ingin mengirimkan ucapan kasih berupa angpao digital, dapat menggunakan kartu transfer digital di bawah ini:
                    </p>
                </Reveal>

                <div className="chi-bank-cards">
                    {safeAccounts.map((acc, idx) => (
                        <Reveal key={acc.id || idx} variant="zoom" delay={idx * 150}>
                            <div className="chi-bank-card">
                                <div className="chi-bank-logo">{acc.bank_name}</div>
                                <div className="chi-bank-number">{acc.account_number}</div>
                                <div className="chi-bank-holder">a.n. {acc.account_name}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

// 10. CLOSING SECTION
function ClosingSection({ invitation, resolvedContent }) {
    const emblem = invitation?.type === 'birthday' ? '壽' : (invitation?.type === 'general' || invitation?.type === 'anniversary' ? '福' : '囍');
    return (
        <section id="closing" className="chi-section chi-section-dark-charcoal">
            <div className="chi-bg-overlay-transparent" />
            <div className="chi-corner-gold chi-corner-top-left" />
            <div className="chi-corner-gold chi-corner-top-right" />
            <div className="chi-corner-gold chi-corner-bottom-left" />
            <div className="chi-corner-gold chi-corner-bottom-right" />

            <div className="chi-section-content">
                <Reveal variant="zoom">
                    <div className="chi-double-happiness-logo" style={{ fontSize: '2.5rem', marginBottom: 20 }}>{emblem}</div>
                </Reveal>

                <Reveal delay={200}>
                    <h2 className="chi-script-title">
                        {formatScriptTitle(invitation?.closing_title || 'Terima Kasih')}
                    </h2>
                </Reveal>

                <Reveal delay={400}>
                    <p className="chi-closing-text">
                        {resolvedContent.closingText}
                    </p>
                </Reveal>

                <Reveal delay={600}>
                    <div className="chi-signatures">
                        {invitation?.closing_signature || (invitation?.type === 'birthday' ? 'Keluarga Besar & Rekan' : 'Keluarga Besar')}
                    </div>
                </Reveal>

                <div className="chi-watermark">
                    Undangan Digital Tionghoa Klasik
                </div>
            </div>
        </section>
    );
}

/* ─── DYNAMIC MAIN LAYOUT ─── */
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
    isDemo = false 
}) {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [activeSection, setActiveSection] = useState('opening');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);

    // Dynamic checks
    const isSingleSubject = useMemo(() => {
        const bg = safeArr(brideGrooms);
        return bg.length === 1;
    }, [brideGrooms]);

    const emblem = useMemo(() => {
        if (invitation?.type === 'birthday') return '壽';
        if (invitation?.type === 'general' || invitation?.type === 'anniversary') return '福';
        return '囍';
    }, [invitation?.type]);

    const songTitle = useMemo(() => {
        return invitation?.music_title || 'Chinese Traditional Guzheng Melody';
    }, [invitation?.music_title]);

    const enableQr = useMemo(() => {
        return parseBool(invitation?.rsvp_custom_fields?.enable_qr_checkin, true);
    }, [invitation?.rsvp_custom_fields]);

    // Dynamic content overrides to prevent wedding texts appearing on birthday/general categories (e.g. from dirty database state)
    const resolvedContent = useMemo(() => {
        const isBday = invitation?.type === 'birthday';
        const isAnniv = invitation?.type === 'anniversary';
        const isGeneral = invitation?.type === 'general';
        const isWedding = !isBday && !isAnniv && !isGeneral;

        let openingTitle = invitation?.opening_title || '';
        let coverSubtitle = invitation?.cover_subtitle || '';
        let openingAyat = invitation?.opening_ayat || '';
        let openingAyatSource = invitation?.opening_ayat_source || '';
        let closingText = invitation?.closing_text || '';

        if (!isWedding) {
            // Clean up wedding-related phrases if category is birthday/general
            if (!openingTitle || openingTitle.toLowerCase().includes('wedding') || openingTitle.toLowerCase().includes('pernikahan')) {
                openingTitle = isBday ? 'Birthday Celebration' : (isAnniv ? 'Anniversary Celebration' : 'Special Celebration');
            }
            if (!coverSubtitle || coverSubtitle.toLowerCase().includes('wedding') || coverSubtitle.toLowerCase().includes('pernikahan')) {
                coverSubtitle = isBday ? 'THE BIRTHDAY CELEBRATION' : (isAnniv ? 'THE ANNIVERSARY CELEBRATION' : 'THE CELEBRATION');
            }
            if (openingAyat.includes('naga dan burung feniks') || openingAyat.includes('Dua insan bersatu')) {
                openingAyat = isBday 
                    ? 'Bagai tunas pohon bambu yang tumbuh kuat melesat ke angkasa, semoga kehidupan senantiasa dilimpahi kesehatan, kebahagiaan, dan kemakmuran abadi.' 
                    : 'Perjalanan panjang penuh dedikasi, rasa syukur, dan kebersamaan yang terus bertumbuh dalam keharmonisan abadi.';
                openingAyatSource = isBday ? 'Doa Kebahagiaan & Umur Panjang' : 'Pepatah Harmoni Keluarga';
            }
            if (closingText.includes('kedua mempelai')) {
                closingText = 'Merupakan kebahagiaan dan kehormatan besar bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir untuk merayakan bersama kami.';
            }
        } else {
            // Wedding defaults
            if (!openingTitle) openingTitle = 'The Wedding of';
            if (!coverSubtitle) coverSubtitle = 'THE WEDDING CELEBRATION';
            if (!openingAyat) {
                openingAyat = 'Dua insan bersatu bagaikan naga dan burung feniks, terbang beriringan mengarungi cakrawala kehidupan dalam kesetiaan abadi.';
                openingAyatSource = 'Pepatah Harmoni Tionghoa Klasik';
            }
        }

        return {
            openingTitle,
            coverSubtitle,
            openingAyat,
            openingAyatSource,
            closingText
        };
    }, [invitation]);

    const resolvedCoverTitle = useMemo(() => {
        if (invitation?.cover_title && invitation.cover_title.trim() !== '') {
            return invitation.cover_title;
        }
        
        const subjects = safeArr(brideGrooms);
        if (subjects.length > 0) {
            if (subjects.length === 1) {
                return subjects[0].nickname || subjects[0].full_name;
            } else {
                const name1 = subjects[0].nickname || subjects[0].full_name?.split(' ')[0] || '';
                const name2 = subjects[1].nickname || subjects[1].full_name?.split(' ')[0] || '';
                return `${name1} & ${name2}`;
            }
        }
        
        if (invitation?.type === 'birthday') return 'Happy Birthday';
        if (invitation?.type === 'anniversary') return 'Happy Anniversary';
        if (invitation?.type === 'general') return 'Special Celebration';
        return 'Zhao & Lin';
    }, [invitation, brideGrooms]);

    // Audio file configuration
    const musicUrl = useMemo(() => {
        return getStorageUrl(invitation?.music_url, '/audio/backsound.mp3');
    }, [invitation?.music_url]);

    // Setup background audio triggers
    useEffect(() => {
        if (isOpened && isPlaying) {
            audioRef.current?.play().catch(() => {});
        } else {
            audioRef.current?.pause();
        }
    }, [isOpened, isPlaying]);

    // Custom Page Visibility Audio handler hook
    usePageVisibilityAudio(audioRef, isOpened && isPlaying);

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
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
    }, [isOpened, autoScrollEnabled]);

    // Auto scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const timer = setInterval(() => {
            window.scrollBy(0, 1);
            const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
            if (isBottom) {
                setAutoScrollEnabled(false);
            }
        }, 25);

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled]);

    const handleOpen = () => {
        setIsOpened(true);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
    };

    // Filter cover photo slide
    const coverImages = useMemo(() => {
        const g = safeArr(galleries);
        if (g.length > 0) return g.map(x => getStorageUrl(x.image_url));
        return ['https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&fit=crop'];
    }, [galleries]);

    const activeSections = useMemo(() => {
        return safeArr(sections)
            .filter(s => parseBool(s.is_visible))
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }, [sections]);

    const navItemsKeys = useMemo(() => {
        const keys = ['opening', 'bride_groom', 'event', 'gallery', 'rsvp'];
        return activeSections.filter(s => keys.includes(s.section_key)).map(s => s.section_key);
    }, [activeSections]);

    // Centering scroll position of bottom fixed nav bar when active section changes
    useEffect(() => {
        if (!isOpened) return;
        const navEl = document.querySelector('.chi-nav');
        const activeBtn = document.getElementById(`nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpened]);

    // Scrollspy scroll listener
    useEffect(() => {
        if (!isOpened) return;
        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight / 3;
            for (const key of navItemsKeys) {
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
    }, [isOpened, navItemsKeys]);

    const handleScrollTo = (key) => {
        const el = document.getElementById(key);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <ErrorBoundary>
            <Head title={invitation?.cover_title || 'Undangan Digital Klasik'} />

            {/* Background Audio tag */}
            <audio ref={audioRef} src={musicUrl} loop />

            {/* Fullscreen Cover Page */}
            <CoverSection 
                invitation={invitation} 
                isOpened={isOpened} 
                onOpen={handleOpen} 
                coverImages={coverImages} 
                guest={guest} 
                resolvedContent={resolvedContent}
                resolvedCoverTitle={resolvedCoverTitle}
            />

            {/* Main scrollable body */}
            {isOpened && (
                <div style={{ backgroundColor: 'var(--chi-bg)', color: 'var(--chi-text)', minHeight: '100vh', paddingBottom: 60 }}>
                    {activeSections.map((sec, idx) => {
                        const isLast = idx === activeSections.length - 1;
                        let element = null;

                        switch (sec.section_key) {
                            case 'opening':
                                element = <OpeningSection invitation={invitation} resolvedContent={resolvedContent} />;
                                break;
                            case 'bride_groom':
                                element = <BrideGroomSection invitation={invitation} brideGrooms={brideGrooms} isSingleSubject={isSingleSubject} />;
                                break;
                            case 'countdown':
                                element = <CountdownSection invitation={invitation} />;
                                break;
                            case 'love_story':
                                element = <LoveStorySection loveStories={loveStories} />;
                                break;
                            case 'event':
                                element = <EventSection events={events} invitation={invitation} />;
                                break;
                            case 'gallery':
                                element = <GallerySection galleries={galleries} />;
                                break;
                            case 'rsvp':
                                element = <RsvpSection invitation={invitation} wishes={wishes} invitationId={invitation.id} />;
                                break;
                            case 'bank':
                                element = <BankSection bankAccounts={bankAccounts} />;
                                break;
                            case 'closing':
                                element = <ClosingSection invitation={invitation} resolvedContent={resolvedContent} />;
                                break;
                            default:
                                break;
                        }

                        if (!element) return null;

                        return (
                            <React.Fragment key={sec.id || sec.section_key}>
                                {element}
                                {!isLast && <SectionSeparator emblem={emblem} />}
                            </React.Fragment>
                        );
                    })}

                    {/* Floating controls panel */}
                    <div className="chi-floating-controls">
                        <button 
                            type="button" 
                            onClick={() => setAutoScrollEnabled(prev => !prev)} 
                            className="chi-float-btn" 
                            title={autoScrollEnabled ? "Matikan Auto Scroll" : "Aktifkan Auto Scroll"}
                        >
                            {autoScrollEnabled ? <Pause size={16} /> : <Play size={16} />}
                        </button>

                        {invitation?.music_url && (
                            <button type="button" onClick={togglePlay} className="chi-float-btn" title="Toggle Music">
                                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                        )}

                        <button type="button" onClick={toggleFullscreen} className="chi-float-btn" title="Toggle Fullscreen">
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>

                        {enableQr && guest && (
                            <button type="button" onClick={() => setShowQr(true)} className="chi-float-btn" title="Show QR Ticket">
                                <QrCode size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sticky Bottom Navigation Bar */}
                    <div className="chi-nav-wrapper">
                        <nav className="chi-nav">
                            {navItemsKeys.map(k => {
                                const isActive = activeSection === k;
                                const iconMap = {
                                    'opening': BookOpen,
                                    'bride_groom': Heart,
                                    'event': Calendar,
                                    'gallery': Image,
                                    'rsvp': MessageSquare
                                };
                                const nameMap = {
                                    'opening': 'Pembuka',
                                    'bride_groom': isSingleSubject ? 'Profil' : 'Memp.',
                                    'event': 'Acara',
                                    'gallery': 'Galeri',
                                    'rsvp': 'RSVP'
                                };
                                const IconComponent = iconMap[k] || Sparkles;
                                return (
                                    <button
                                        key={k}
                                        type="button"
                                        id={`nav-btn-${k}`}
                                        onClick={() => handleScrollTo(k)}
                                        className={`chi-nav-btn ${isActive ? 'is-active' : ''}`}
                                    >
                                        <IconComponent size={16} />
                                        <span>{nameMap[k] || k}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* QR Code Presensi Overlay Modal */}
                    {enableQr && showQr && guest && (
                        <div className="chi-modal-overlay" onClick={() => setShowQr(false)}>
                            <div className="chi-modal-content" onClick={e => e.stopPropagation()}>
                                <h3 className="chi-modal-title">VIP Ticket QR Check-in</h3>
                                <p className="chi-modal-subtitle">Tunjukkan QR code ini ke penerima tamu</p>
                                
                                <div className="chi-qr-wrapper">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=b30000&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                        alt="QR Code Presensi" 
                                    />
                                </div>
                                
                                <button 
                                    type="button" 
                                    onClick={() => setShowQr(false)} 
                                    className="chi-btn chi-btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </ErrorBoundary>
    );
}
