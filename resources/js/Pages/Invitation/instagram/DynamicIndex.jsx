import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';


import PremiumSlideshow from '@/Components/PremiumSlideshow';

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
    const loc = String(locale).toLowerCase() === 'en' ? 'en-US' : 'id-ID';
    // Safe parsing: T12:00:00 prevents UTC midnight timezone offset bug
    const safe = String(d).substring(0, 10) + 'T12:00:00';
    const date = new Date(safe);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
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
            if (timePart.length === 5) {
                timePart += ':00';
            }
        }
    }
    
    let isoStr = `${datePart}T${timePart}`;
    let d = new Date(isoStr);
    if (!isNaN(d.getTime())) {
        return d;
    }
    
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

function parseEventDate(dateString, locale = 'id') {
    if (!dateString) return { dayNum: '', dayName: '', monthName: '', year: '' };
    // Safe parsing: T12:00:00 prevents UTC midnight timezone offset bug
    const d = parseSafeDate(dateString);
    if (isNaN(d.getTime())) return { dayNum: '', dayName: '', monthName: '', year: '' };
    const loc = locale === 'en' ? 'en-US' : 'id-ID';
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString(loc, { weekday: 'long' });
    const monthName = d.toLocaleDateString(loc, { month: 'long' });
    const year = d.getFullYear();
    
    return { dayNum, dayName, monthName, year };
}

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

function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'wedding';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let mainName = '';
    let isSingleHost = false;
    
    if (['wedding', 'anniversary'].includes(t)) {
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
        mainName = groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Bride & Groom';
        isSingleHost = false;
    } else {
        mainName = host.nickname || host.full_name || 'Host';
        isSingleHost = true;
    }

    let labels = {
        brandText: isEn ? 'wedding of' : 'pernikahan',
        coverSubtitle: 'the.wedding.album',
        storyBadge: '#TheWeddingOf',
        storyUser: 'wedding.story',
        profileHeader: isEn ? 'Bride & Groom Profiles' : 'Profil Kedua Mempelai',
        profileUsername: '@profiles',
        eventHeaderTag: '@wedding_live',
        eventHeaderTitle: isEn ? 'Wedding Broadcast Live' : 'Siaran Langsung Acara',
        streamDesc: isEn ? 'Please click the link button below to join our virtual wedding stream.' : 'Saksikan siaran virtual pernikahan kami dengan menekan tombol streaming di bawah ini.',
        closingText: isEn ? 'It is a great honor and joy for us if you would join us on our wedding day.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari pernikahan kami.',
        profileBadge: isEn ? 'Mempelai' : 'Mempelai'
    };

    if (t === 'wedding') {
        labels.brandText = isEn ? 'wedding of' : 'pernikahan';
        labels.coverSubtitle = 'the.wedding.album';
        labels.storyBadge = '#TheWeddingOf';
        labels.storyUser = 'wedding.story';
        labels.profileHeader = isEn ? 'Bride & Groom Profiles' : 'Profil Kedua Mempelai';
        labels.profileUsername = '@profiles';
        labels.eventHeaderTag = '@wedding_live';
        labels.eventHeaderTitle = isEn ? 'Wedding Broadcast Live' : 'Siaran Langsung Acara';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual wedding stream.' : 'Saksikan siaran virtual pernikahan kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on our wedding day.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari pernikahan kami.';
        labels.profileBadge = isEn ? 'Mempelai' : 'Mempelai';
    } else if (t === 'anniversary') {
        labels.brandText = isEn ? 'anniversary of' : 'anniversary';
        labels.coverSubtitle = 'the.anniversary.album';
        labels.storyBadge = '#AnniversaryOf';
        labels.storyUser = 'anniversary.story';
        labels.profileHeader = isEn ? 'Couple Profiles' : 'Profil Pasangan';
        labels.profileUsername = '@profiles';
        labels.eventHeaderTag = '@anniversary_live';
        labels.eventHeaderTitle = isEn ? 'Anniversary Celebration' : 'Perayaan Anniversary';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual anniversary stream.' : 'Saksikan siaran virtual anniversary kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on our celebration day.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.';
        labels.profileBadge = isEn ? 'Couple' : 'Pasangan';
    } else if (t === 'graduation') {
        labels.brandText = isEn ? 'graduation of' : 'wisuda';
        labels.coverSubtitle = 'the.graduation.album';
        labels.storyBadge = '#TheGraduationOf';
        labels.storyUser = 'graduation.story';
        labels.profileHeader = isEn ? 'Graduate Profile' : 'Profil Wisudawan';
        labels.profileUsername = '@graduate';
        labels.eventHeaderTag = '@graduation_live';
        labels.eventHeaderTitle = isEn ? 'Graduation Celebration' : 'Syukuran Kelulusan';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual graduation stream.' : 'Saksikan siaran virtual kelulusan kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on our graduation day.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari syukuran kelulusan kami.';
        labels.profileBadge = isEn ? 'Graduate' : 'Wisudawan';
    } else if (t === 'birthday') {
        labels.brandText = isEn ? 'birthday of' : 'ulang tahun';
        labels.coverSubtitle = 'the.birthday.album';
        labels.storyBadge = '#TheBirthdayOf';
        labels.storyUser = 'birthday.story';
        labels.profileHeader = isEn ? 'Celebrant Profile' : 'Profil Ulang Tahun';
        labels.profileUsername = '@celebrant';
        labels.eventHeaderTag = '@birthday_live';
        labels.eventHeaderTitle = isEn ? 'Birthday Celebration' : 'Perayaan Ulang Tahun';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual birthday party.' : 'Saksikan siaran virtual perayaan ulang tahun kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on my birthday party.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di pesta ulang tahun kami.';
        labels.profileBadge = isEn ? 'Celebrant' : 'Ulang Tahun';
    } else if (t === 'aqiqah') {
        labels.brandText = isEn ? 'aqiqah of' : 'aqiqah';
        labels.coverSubtitle = 'the.aqiqah.album';
        labels.storyBadge = '#TheAqiqahOf';
        labels.storyUser = 'aqiqah.story';
        labels.profileHeader = isEn ? 'Baby Profile' : 'Profil Buah Hati';
        labels.profileUsername = '@baby';
        labels.eventHeaderTag = '@aqiqah_live';
        labels.eventHeaderTitle = isEn ? 'Aqiqah Celebration' : 'Syukuran Aqiqah';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual aqiqah stream.' : 'Saksikan siaran virtual aqiqah kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on our baby\'s aqiqah.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara khitanan buah hati kami.';
        labels.profileBadge = isEn ? 'Baby' : 'Buah Hati';
    } else if (t === 'circumcision') {
        labels.brandText = isEn ? 'circumcision of' : 'khitanan';
        labels.coverSubtitle = 'the.circumcision.album';
        labels.storyBadge = '#TheCircumcisionOf';
        labels.storyUser = 'circumcision.story';
        labels.profileHeader = isEn ? 'Child Profile' : 'Profil Putra Khitan';
        labels.profileUsername = '@child';
        labels.eventHeaderTag = '@circumcision_live';
        labels.eventHeaderTitle = isEn ? 'Circumcision Celebration' : 'Syukuran Khitanan';
        labels.streamDesc = isEn ? 'Please click the link button below to join our virtual circumcision stream.' : 'Saksikan siaran virtual khitanan putra kami dengan menekan tombol streaming di bawah ini.';
        labels.closingText = isEn ? 'It is a great honor and joy for us if you would join us on our child\'s circumcision.' : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di acara khitanan putra kami.';
        labels.profileBadge = isEn ? 'Child' : 'Putra Khitan';
    }

    return {
        mainName,
        isSingleHost,
        labels
    };
}

/* ═══════════════════════════════════════

   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div style={{ padding: 24, color: '#fff', background: '#000', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ color: '#E1306C', fontSize: '1.5rem', marginBottom: 12 }}>Oops, Something went wrong!</h2>
                <p style={{ color: '#a7a7a7', fontSize: '0.85rem', marginBottom: 20 }}>Gagal me-render visualisasi tema InstaVite.</p>
                <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', color: '#ff4d4d', background: '#121212', padding: 16, borderRadius: 8, border: '1px solid #262626', maxWidth: '100%', textAlign: 'left' }}>
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

    let animClass = 'ig-reveal';
    if (variant === 'left') animClass = 'ig-reveal ig-reveal--left';
    else if (variant === 'right') animClass = 'ig-reveal ig-reveal--right';
    else if (variant === 'zoom') animClass = 'ig-reveal ig-reveal--zoom';

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
   COVER SECTION (InstaVite Profile Cover UI)
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, language, fallbackPhoto, onJump, onLanguageChange }) {
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', brideGrooms, invitation);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0];
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1];

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || 'Tamu Undangan';

    const [guestNameInput, setGuestNameInput] = React.useState(
        guestName.replace(/\s+/g, '_').toLowerCase()
    );

    const coupleName = invitation?.cover_title || themeConfig.mainName;

    const artworkUrl = getStorageUrl(invitation?.cover_image, null) || fallbackPhoto || '/images/demo/korea-11-768x512.jpg';

    const isEn = language === 'en';

    return (
        <div className={`ig-cover${isOpened ? ' is-opened' : ''}`}>
            <div className="ig-device-container" style={{ justifyContent: 'space-between', paddingBottom: '20px' }}>
                <div>
                    {/* Header status bar simulation */}
                    <div className="ig-phone-status-bar">
                        <span className="ig-status-time">10:34</span>
                        <div className="ig-status-icons">
                            <i className="fas fa-signal" />
                            <i className="fas fa-wifi" />
                            <i className="fas fa-battery-three-quarters" />
                        </div>
                    </div>

                    {/* IG Login Page UI - Official Gradient Camera Glyph Icon SVG & Couple names below! */}
                    <div className="ig-login-logo-container" style={{ margin: '50px auto 25px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        {/* High-fidelity official InstaVite camera glyph logo SVG */}
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="ig-cover-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f09433"/>
                                    <stop offset="25%" stopColor="#e6683c"/>
                                    <stop offset="50%" stopColor="#dc2743"/>
                                    <stop offset="75%" stopColor="#cc2366"/>
                                    <stop offset="100%" stopColor="#bc1888"/>
                                </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-cover-gradient)" strokeWidth="2.2" fill="none" />
                            <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-cover-gradient)" />
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#ig-cover-gradient)" transform="translate(6, 6) scale(0.5)" />
                        </svg>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                            <span className="ig-login-logo" style={{ fontSize: '2.5rem', marginBottom: '0px', lineHeight: 1.1, fontFamily: "'Pacifico', cursive", letterSpacing: '-0.5px' }}>
                                {themeConfig.labels.brandText}
                            </span>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: 800,
                                color: '#fff',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                marginTop: '4px',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 2px 4px rgba(0,0,0,0.15)'
                            }}>
                                {coupleName}
                            </div>
                        </div>
                    </div>

                    <form className="ig-login-form" onSubmit={(e) => { e.preventDefault(); onOpen(); }} style={{ padding: '0 28px' }}>
                        <div className="ig-login-input-wrap" style={{ marginBottom: '8px' }}>
                            <input
                                type="text"
                                value={guestNameInput}
                                onChange={(e) => setGuestNameInput(e.target.value)}
                                placeholder={isEn ? "Username, email, or mobile number" : "Nama pengguna, email, atau nomor ponsel"}
                                className="ig-login-input"
                                style={{ borderRadius: '8px', padding: '12px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', fontSize: '0.85rem' }}
                            />
                        </div>
                        <div className="ig-login-input-wrap" style={{ marginBottom: '14px' }}>
                            <input
                                type="password"
                                value="weddingdate"
                                disabled
                                placeholder={isEn ? "Password" : "Kata sandi"}
                                className="ig-login-input"
                                style={{ borderRadius: '8px', padding: '12px', border: '1px solid #3a3a3c', backgroundColor: '#1c1c1e', fontSize: '0.85rem' }}
                            />
                            <span className="ig-login-show-pwd" onClick={onOpen} style={{ fontSize: '0.8rem', color: '#fff' }}>{isEn ? 'Show' : 'Lihat'}</span>
                        </div>
                        <button type="submit" className="ig-login-btn" style={{ borderRadius: '25px', padding: '11px', fontSize: '0.9rem', width: '100%', border: 'none', backgroundColor: '#0095f6', color: '#fff', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s' }}>
                            {isEn ? 'Log In' : 'Login'}
                        </button>
                    </form>

                    {/* Guest Details Badge Inside Login Screen */}
                    <div className="ig-login-guest-badge" style={{ margin: '25px 28px 10px 28px', borderRadius: '12px', border: '1px solid #262626', backgroundColor: '#121212', padding: '16px' }}>
                        <p className="ig-guest-label" style={{ fontSize: '0.72rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--ig-pink)', fontWeight: 800, marginBottom: '6px' }}>{isEn ? 'Dear Guest' : 'Kepada Yth. Bapak/Ibu/Saudara/i'}</p>
                        <h3 className="ig-guest-name" style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>{guestName}</h3>
                        <p className="ig-guest-desc" style={{ fontSize: '0.75rem', color: 'var(--ig-text-muted)', lineHeight: 1.4 }}>{isEn ? 'We apologize if there are any spelling errors in names/titles.' : 'Mohon maaf apabila ada kesalahan penulisan nama atau gelar.'}</p>
                    </div>
                </div>

                {/* simulated bottom navigation bar - ACTIVE (Unused but kept for layout size matching) */}
                <div className="ig-bottom-nav" style={{ display: 'none' }}>
                    <i className="fas fa-home" onClick={() => { onOpen(); setTimeout(() => onJump(0, 'opening'), 150); }} />
                    <i className="fas fa-search" onClick={() => { onOpen(); setTimeout(() => onJump(1, 'bride_groom'), 150); }} />
                    <i className="far fa-plus-square" onClick={() => { onOpen(); setTimeout(() => onJump(3, 'event'), 150); }} />
                    <i className="far fa-heart" onClick={() => { onOpen(); setTimeout(() => onJump(2, 'love_story'), 150); }} />
                    <i className="far fa-user" onClick={() => { onOpen(); setTimeout(() => onJump(4, 'rsvp'), 150); }} />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   STORIES NAVIGATION TRAY
   ═══════════════════════════════════════ */
function StoriesTray({ resolvedSections, activeSectionId, isSlideMode, activeSlideIdx, onJump, language, themeConfig }) {
    const isEn = language === 'en';
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const activeChild = containerRef.current.querySelector('.ig-story-tray-item.is-active');
        if (activeChild) {
            activeChild.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [activeSectionId, activeSlideIdx, isSlideMode]);

    const sectionIcons = {
        opening: 'fas fa-book-open',
        bride_groom: 'fas fa-user-friends',
        love_story: 'fas fa-heart',
        event: 'fas fa-calendar-day',
        livestream: 'fas fa-video',
        gallery: 'fas fa-images',
        bank: 'fas fa-gift',
        rsvp: 'fas fa-envelope',
        wishes: 'fas fa-comments',
        closing: 'fas fa-flag'
    };

    const sectionLabels = {
        opening: isEn ? 'Intro' : 'Intro',
        bride_groom: themeConfig.labels.profileBadge,
        love_story: isEn ? 'Story' : 'Kisah',
        event: isEn ? 'Event' : 'Acara',
        livestream: 'Live',
        gallery: isEn ? 'Gallery' : 'Galeri',
        bank: isEn ? 'Gift' : 'Kado',
        rsvp: 'RSVP',
        wishes: isEn ? 'Wishes' : 'Doa',
        closing: isEn ? 'Outro' : 'Penutup'
    };

    return (
        <div ref={containerRef} className="ig-stories-tray">
            {resolvedSections.map((s, idx) => {
                const icon = sectionIcons[s.section_key] || 'fas fa-star';
                const label = sectionLabels[s.section_key] || s.section_name;
                const isActive = isSlideMode ? idx === activeSlideIdx : activeSectionId === s.section_key;

                return (
                    <div
                        key={s.section_key}
                        className={`ig-story-tray-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => onJump(idx, s.section_key)}
                    >
                        <div className="ig-story-tray-circle">
                            <div className="ig-story-tray-inner-circle">
                                <i className={icon} />
                            </div>
                        </div>
                        <span className="ig-story-tray-label">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION (InstaVite Story Screen UI)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, events, wishes, onOpenMusic, language, fallbackPhoto, onStoryEnd }) {
    const { t, locale } = useTranslation(language);
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', brideGrooms, invitation);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0];
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1];

    const coupleName = invitation?.cover_title || themeConfig.mainName;

    const coverBg = getStorageUrl(invitation?.cover_image, null) || fallbackPhoto || '/images/demo/korea-11-768x512.jpg';
    const openingBg = getStorageUrl(invitation?.opening_image, null) || coverBg;

    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const eventDateStr = primaryEvent?.event_date || primaryEvent?.date;
    const formattedDate = eventDateStr ? formatDate(eventDateStr, locale) : '';

    const isIdenticalQuote = invitation?.opening_ayat && invitation?.opening_ayat_translation &&
        invitation.opening_ayat.trim().toLowerCase() === invitation.opening_ayat_translation.trim().toLowerCase();
    const showBigAyat = invitation?.opening_ayat && !isIdenticalQuote;

    // Simulate story progress bar filling up
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        let startTime = Date.now();
        const duration = 7500; // 7.5 seconds per story
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setProgress(percentage);
            
            if (elapsed >= duration) {
                clearInterval(interval);
                if (onStoryEnd) {
                    onStoryEnd();
                }
            }
        }, 30);
        return () => clearInterval(interval);
    }, [onStoryEnd]);

    return (
        <section id="opening" className="ig-section ig-opening">
            {/* Story simulation elements */}
            <div className="ig-story-progress-bar-wrap">
                <div className="ig-story-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="ig-story-user-row">
                <div className="ig-story-user-avatar">
                    {globalShowPhotos && coverBg ? (
                        <img src={coverBg} alt="Avatar" />
                    ) : (
                        <span>{(groom?.nickname?.charAt(0) || 'H')}</span>
                    )}
                </div>
                <div className="ig-story-user-details">
                    <span className="ig-story-user-name">{(groom?.nickname && bride?.nickname && !themeConfig.isSingleHost) ? `${groom.nickname.toLowerCase()}.${bride.nickname.toLowerCase()}` : themeConfig.labels.storyUser} <i className="fas fa-check-circle ig-verified-badge" /></span>
                    <span className="ig-story-post-time">10h</span>
                </div>
                <div className="ig-story-options">
                    <i className="fas fa-ellipsis-h" />
                </div>
            </div>

            <div className="ig-opening-bg-container">
                {globalShowPhotos && (
                    <PremiumSlideshow
                        images={invitation?.opening_image ? invitation.opening_image.split(',') : (invitation?.cover_image ? invitation.cover_image.split(',') : [])}
                        positionX={invitation?.opening_position_x ?? invitation?.cover_position_x}
                        positionY={invitation?.opening_position_y ?? invitation?.cover_position_y}
                        zoom={invitation?.opening_zoom ?? invitation?.cover_zoom}
                        className="absolute inset-0 w-full h-full z-0"
                        imgClassName="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                <div className="ig-opening-overlay" />
            </div>

            <div className="ig-opening-content">
                <Reveal className="ig-opening-badge-reveal" variant="zoom">
                    <div className="ig-badge-tag">{themeConfig.labels.storyBadge}</div>
                    <h2 className="ig-opening-title">{coupleName}</h2>
                    {formattedDate && (
                        <p className="ig-opening-date-tag"><i className="far fa-calendar-check" /> {formattedDate}</p>
                    )}
                </Reveal>

                {invitation?.opening_ayat && (
                    <Reveal className="ig-opening-ayat-box" variant="zoom" delay={150}>
                        <i className="fas fa-quote-left ig-quote-mark" />
                        {showBigAyat && (
                            <p className="ig-opening-ayat-arabic" dir="auto">{invitation.opening_ayat}</p>
                        )}
                        {invitation?.opening_ayat_translation && (
                            <p className="ig-opening-ayat-trans">{invitation.opening_ayat_translation}</p>
                        )}
                        {invitation?.opening_ayat_source && (
                            <span className="ig-opening-ayat-src">&mdash; {invitation.opening_ayat_source}</span>
                        )}
                    </Reveal>
                )}

                <Reveal className="ig-opening-intro-box" variant="up" delay={300}>
                    <h3 className="ig-story-sticker-title">INVITATION</h3>
                    <p className="ig-opening-body-text">{invitation?.opening_text || (themeConfig.isSingleHost ? 'Syukuran perayaan acara kami.' : 'Atas Karunia Tuhan Yang Maha Esa, perkenankanlah kami meresmikan ikatan pernikahan kami.')}</p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   MEMPELAI SECTION (InstaVite Profiles UI)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, invitation, language, onOpenStory }) {
    const { t, locale } = useTranslation(language);
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', brideGrooms, invitation);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || bgs[0] || bgs[0] || {};

    const groomPhotoUrl = getStorageUrl(groom.photo, '/images/demo/korea-8.jpg');
    const bridePhotoUrl = getStorageUrl(bride.photo, '/images/demo/korea-3.jpg');

    const [groomSrc, setGroomSrc] = useState(groomPhotoUrl);
    const [brideSrc, setBrideSrc] = useState(bridePhotoUrl);

    useEffect(() => { setGroomSrc(groomPhotoUrl); }, [groomPhotoUrl]);
    useEffect(() => { setBrideSrc(bridePhotoUrl); }, [bridePhotoUrl]);

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

    return (
        <section id="bride_groom" className="ig-section ig-bridegroom-page">
            <h3 className="ig-section-tag">{themeConfig.labels.profileUsername}</h3>
            <h4 className="ig-section-title-custom">{themeConfig.labels.profileHeader}</h4>

            <div className="ig-couple-profiles-container">
                {themeConfig.isSingleHost ? (
                    bgs[0] && (
                        <Reveal className="ig-profile-card ig-single-host-card" variant="zoom">
                            <div className="ig-card-header">
                                <span className="ig-card-badge-live">LIVE</span>
                                <span className="ig-card-title-name">@{bgs[0].nickname ? bgs[0].nickname.toLowerCase() : 'profile'}</span>
                                <i className="fas fa-check-circle ig-verified-badge" />
                            </div>
                            <div className="ig-card-avatar-wrap" onClick={() => onOpenStory(getStorageUrl(bgs[0].photo, '/images/demo/korea-8.jpg'), bgs[0].full_name, bgs[0].nickname ? bgs[0].nickname.toLowerCase() : 'profile')} style={{ cursor: 'pointer' }}>
                                {globalShowPhotos && bgs[0].photo ? (
                                    <img 
                                        src={getStorageUrl(bgs[0].photo)} 
                                        alt={bgs[0].full_name} 
                                        className="ig-card-photo" 
                                        style={{
                                            objectPosition: `${bgs[0].photo_position_x ?? 50}% ${bgs[0].photo_position_y ?? 50}%`,
                                            transform: `scale(${bgs[0].photo_zoom ?? 1.0})`,
                                        }}
                                    />
                                ) : (
                                    <div className="ig-card-monogram">{bgs[0].nickname?.charAt(0) || 'H'}</div>
                                )}
                            </div>
                            <div className="ig-card-meta-row">
                                <span><strong>1</strong> post</span>
                                <span><strong>99k</strong> followers</span>
                            </div>
                            <div className="ig-card-bio-info">
                                <h4 className="ig-card-fullname">{bgs[0].full_name}</h4>
                                <p className="ig-card-parents-line">
                                    {translateChildOrder(bgs[0].child_order, bgs[0].gender)}<br />
                                    <strong>Bapak {bgs[0].father_name} & Ibu {bgs[0].mother_name}</strong>
                                </p>
                                <p className="ig-card-short-bio">{bgs[0].bio || 'Blessed & grateful.'}</p>
                            </div>
                            {bgs[0].instavite && (
                                <a href={`https://instavite.com/${bgs[0].instavite.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="ig-card-follow-btn">
                                    <i className="fab fa-instavite" /> Follow
                                </a>
                            )}
                        </Reveal>
                    )
                ) : (
                    <>
                        {/* Groom Card */}
                        {groom && (
                            <Reveal className="ig-profile-card" variant="left">
                                <div className="ig-card-header">
                                    <span className="ig-card-badge-live">LIVE</span>
                                    <span className="ig-card-title-name">@{groom.nickname ? groom.nickname.toLowerCase() : 'groom'}</span>
                                    <i className="fas fa-check-circle ig-verified-badge" />
                                </div>
                                <div className="ig-card-avatar-wrap" onClick={() => onOpenStory(groomSrc, groom.full_name, groom.nickname ? groom.nickname.toLowerCase() : 'groom')} style={{ cursor: 'pointer' }}>
                                    {globalShowPhotos && groomSrc ? (
                                        <img 
                                            src={groomSrc} 
                                            alt={groom.full_name} 
                                            className="ig-card-photo" 
                                            onError={() => setGroomSrc(null)} 
                                            style={{
                                                objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                                transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                            }}
                                        />
                                    ) : (
                                        <div className="ig-card-monogram">{groom.nickname?.charAt(0) || 'B'}</div>
                                    )}
                                </div>
                                <div className="ig-card-meta-row">
                                    <span><strong>1</strong> post</span>
                                    <span><strong>99k</strong> followers</span>
                                </div>
                                <div className="ig-card-bio-info">
                                    <h4 className="ig-card-fullname">{groom.full_name}</h4>
                                    <p className="ig-card-parents-line">
                                        {translateChildOrder(groom.child_order, 'pria')}<br />
                                        <strong>Bapak {groom.father_name} & Ibu {groom.mother_name}</strong>
                                    </p>
                                    <p className="ig-card-short-bio">{groom.bio || 'Blessed & grateful.'}</p>
                                </div>
                                {groom.instavite && (
                                    <a href={`https://instavite.com/${groom.instavite.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="ig-card-follow-btn">
                                        <i className="fab fa-instavite" /> Follow
                                    </a>
                                )}
                            </Reveal>
                        )}

                        {/* Bride Card */}
                        {bride && (
                            <Reveal className="ig-profile-card" variant="right" delay={150}>
                                <div className="ig-card-header">
                                    <span className="ig-card-badge-live">LIVE</span>
                                    <span className="ig-card-title-name">@{bride.nickname ? bride.nickname.toLowerCase() : 'bride'}</span>
                                    <i className="fas fa-check-circle ig-verified-badge" />
                                </div>
                                <div className="ig-card-avatar-wrap" onClick={() => onOpenStory(brideSrc, bride.full_name, bride.nickname ? bride.nickname.toLowerCase() : 'bride')} style={{ cursor: 'pointer' }}>
                                    {globalShowPhotos && brideSrc ? (
                                        <img 
                                            src={brideSrc} 
                                            alt={bride.full_name} 
                                            className="ig-card-photo" 
                                            onError={() => setBrideSrc(null)} 
                                            style={{
                                                objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                                transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                            }}
                                        />
                                    ) : (
                                        <div className="ig-card-monogram">{bride.nickname?.charAt(0) || 'R'}</div>
                                    )}
                                </div>
                                <div className="ig-card-meta-row">
                                    <span><strong>1</strong> post</span>
                                    <span><strong>99k</strong> followers</span>
                                </div>
                                <div className="ig-card-bio-info">
                                    <h4 className="ig-card-fullname">{bride.full_name}</h4>
                                    <p className="ig-card-parents-line">
                                        {translateChildOrder(bride.child_order, 'wanita')}<br />
                                        <strong>Bapak {bride.father_name} & Ibu {bride.mother_name}</strong>
                                    </p>
                                    <p className="ig-card-short-bio">{bride.bio || 'Every day is a gift.'}</p>
                                </div>
                                {bride.instavite && (
                                    <a href={`https://instavite.com/${bride.instavite.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="ig-card-follow-btn">
                                        <i className="fab fa-instavite" /> Follow
                                    </a>
                                )}
                            </Reveal>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LOVE STORY SECTION (InstaVite Reels Style)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, language }) {
    const { t, locale } = useTranslation(language);
    const stories = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const [currentIdx, setCurrentIdx] = useState(0);
    const [likedReels, setLikedReels] = useState({});

    if (stories.length === 0) return null;

    const nextReel = () => {
        setCurrentIdx(prev => (prev + 1) % stories.length);
    };

    const prevReel = () => {
        setCurrentIdx(prev => (prev - 1 + stories.length) % stories.length);
    };

    const toggleLikeReel = (idx) => {
        setLikedReels(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <section id="love_story" className="ig-section ig-love-story-reels">
            <h3 className="ig-section-tag">#reels</h3>
            <h4 className="ig-section-title-custom">{locale === 'en' ? 'Our Love Story Reels' : 'Reels Kisah Cinta Kami'}</h4>

            <div className="ig-reels-container">
                <div className="ig-reel-card">
                    {/* Simulated Reels Video Box */}
                    <div className="ig-reel-screen">
                        <div className="ig-reel-header-badge">
                            <i className="fas fa-play" /> {locale === 'en' ? 'Reels' : 'Reel'}
                        </div>

                        <div className="ig-reel-center-icon-wrap">
                            <i className="fas fa-heart ig-heart-reel-pop" />
                        </div>

                        {/* Reels Sidebar Icons */}
                        <div className="ig-reels-sidebar">
                            <div className="ig-sidebar-icon" onClick={() => toggleLikeReel(currentIdx)} style={{ cursor: 'pointer' }}>
                                <i className="fas fa-heart" style={{ color: likedReels[currentIdx] ? '#ff3040' : '#ffffff' }} />
                                <span>{likedReels[currentIdx] ? '99.1k' : '99k'}</span>
                            </div>
                            <div className="ig-sidebar-icon">
                                <i className="fas fa-comment" />
                                <span>1k</span>
                            </div>
                            <div className="ig-sidebar-icon" onClick={nextReel}>
                                <i className="fas fa-chevron-circle-right" />
                                <span>{locale === 'en' ? 'Next' : 'Lanjut'}</span>
                            </div>
                            <div className="ig-sidebar-icon" onClick={prevReel}>
                                <i className="fas fa-chevron-circle-left" />
                                <span>{locale === 'en' ? 'Prev' : 'Mundur'}</span>
                            </div>
                        </div>

                        {/* Reels Caption Overlay */}
                        <div className="ig-reels-caption-box">
                            <div className="ig-reels-user-row">
                                <span className="ig-reels-avatar-mini"><i className="fas fa-heart" /></span>
                                <span className="ig-reels-username-mini">our.love.story</span>
                                <button className="ig-reels-follow-btn-mini">{locale === 'en' ? 'Follow' : 'Ikuti'}</button>
                            </div>
                            <h4 className="ig-reels-chapter-title">{stories[currentIdx]?.title}</h4>
                            <span className="ig-reels-story-date"><i className="far fa-calendar" /> {formatStoryDate(stories[currentIdx]?.story_date)}</span>
                            <p className="ig-reels-caption-text">{stories[currentIdx]?.description}</p>
                            <div className="ig-reels-audio-track">
                                <i className="fas fa-music" />
                                <div className="ig-reels-audio-text-scroll">Original Audio • {stories[currentIdx]?.title}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function formatStoryDate(dateStr) {
    if (!dateStr) return '';
    try {
        const d = new Date(String(dateStr).substring(0, 10) + 'T12:00:00');
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    } catch (e) {}
    return dateStr;
}

/* ═══════════════════════════════════════
   ACARA SECTION (InstaVite Live Video UI)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, language, sections }) {
    const { t, locale } = useTranslation(language);
    const safeEvents = safeArr(events);
    const primaryEvent = safeEvents.find(e => e.is_primary) || safeEvents[0];
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', [], invitation);

    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const bgs = safeArr(invitation?.brideGrooms || []);
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    const showCountdown = parseBool(invitation?.show_countdown ?? true);
    const showCountdownWidget = (() => {
        if (!primaryEvent?.event_date || !showCountdown) return false;
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    })();

    return (
        <section id="event" className="ig-section ig-events-live">
            <h3 className="ig-section-tag">{themeConfig.labels.eventHeaderTag}</h3>
            <h4 className="ig-section-title-custom">{themeConfig.labels.eventHeaderTitle}</h4>

            {/* Countdown Overlay Widget */}
            {showCountdownWidget && (
                <CountdownTimer targetDate={primaryEvent.event_date} startTime={primaryEvent.start_time} language={language} />
            )}

            <div className="ig-live-card-container">
                {/* IG Live screen mockup */}
                <div className="ig-live-screen">
                    {/* Live Header widgets */}
                    <div className="ig-live-top-widgets">
                        <div className="ig-live-badge-box">
                            <span className="ig-badge-live-label">LIVE</span>
                            <span className="ig-badge-viewers"><i className="far fa-eye" /> 9,842</span>
                        </div>
                        <div className="ig-live-close-btn">
                            <i className="fas fa-times" />
                        </div>
                    </div>

                    {/* Central Tour Event Detail Card */}
                    <div className="ig-live-event-scroller">
                        {safeEvents.map((ev, idx) => {
                            const { dayNum, dayName, monthName, year } = parseEventDate(ev.event_date || ev.date);
                            const formattedTime = ev.start_time ? `${formatTime(ev.start_time)} ${ev.timezone || 'WIB'}` : '';

                            return (
                                <Reveal key={ev.id || idx} className="ig-live-event-card" variant="up" delay={idx * 100}>
                                    <div className="ig-live-event-header-row">
                                        <i className="fas fa-calendar-alt" />
                                        <span>{ev.event_name || 'Event'}</span>
                                    </div>
                                    <div className="ig-live-event-details">
                                        <h4 className="ig-live-event-date-text">{dayName}, {dayNum} {monthName} {year}</h4>
                                        <p className="ig-live-event-time-text"><i className="far fa-clock" /> {formattedTime} {ev.end_time ? `- ${formatTime(ev.end_time)}` : (locale === 'en' ? ' - Finished' : ' - Selesai')}</p>
                                        <p className="ig-live-event-venue-name">{ev.venue_name}</p>
                                        <p className="ig-live-event-venue-address">{ev.venue_address}</p>
                                    </div>
                                    <div className="ig-live-event-actions">
                                        {ev.gmaps_link && (
                                            <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="ig-live-action-btn primary">
                                                <i className="fas fa-map-marker-alt" /> {locale === 'en' ? 'Google Maps' : 'Petunjuk Arah'}
                                            </a>
                                        )}
                                        <a href={getCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="ig-live-action-btn secondary">
                                            <i className="far fa-calendar-check" /> {locale === 'en' ? 'Calendar' : 'Kalender'}
                                        </a>
                                    </div>
                                </Reveal>
                        );
                    })}

                                {/* Compact standalone Dress Code box below event list */}
                                {safeEvents?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <div key={`dc-${idx}`} className="ig-live-event-card w-full mt-4">
                                        <DressCodeBlock event={ev} colors={{ primary: 'var(--ig-primary)', text: 'var(--ig-text)' }} fonts={{ heading: 'inherit' }} variant="app" plain={true} />
                                    </div>
                                ))}

                    {/* Compact standalone Dress Code box below event list */}
                    {safeEvents?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                        <div key={`dc-${idx}`} className="w-full max-w-md mx-auto mt-4 px-4 pb-2">
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION (InstaVite Live Video Broadcast Link)
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, language }) {
    const { t, locale } = useTranslation(language);
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', [], invitation);
    
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
        <section id="livestream" className="ig-section ig-streaming-live-broadcast">
            <h3 className="ig-section-tag">@streaming</h3>
            <div className="ig-stream-broadcast-box">
                <i className="fas fa-video ig-stream-broadcast-icon" />
                <h5 className="ig-stream-broadcast-title">{locale === 'en' ? 'Watch Virtual Broadcast' : 'Tonton Siaran Virtual'}</h5>
                <p className="ig-stream-broadcast-desc">{themeConfig.labels.streamDesc}</p>
                <div className="ig-stream-broadcast-buttons">
                    {streamsList.map((stream, idx) => (
                        <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="ig-btn-primary blinking-btn">
                            <i className="fas fa-external-link-alt" /> {locale === 'en' ? 'Join Stream' : 'Gabung Streaming'} ({stream.platform.toUpperCase()})
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER COMPONENT
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate, startTime, language }) {
    const { t } = useTranslation(language);
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const timeStr = startTime ? String(startTime).substring(0, 5) : '08:00';
        const target = parseSafeDate(targetDate, primaryEvent?.start_time);
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
    }, [targetDate, startTime]);

    return (
        <div className="ig-countdown-widget">
            <div className="ig-countdown-grid">
                <div className="ig-countdown-cell">
                    <span className="ig-countdown-value">{pad2(cd.d)}</span>
                    <span className="ig-countdown-lbl">Days</span>
                </div>
                <div className="ig-countdown-cell">
                    <span className="ig-countdown-value">{pad2(cd.h)}</span>
                    <span className="ig-countdown-lbl">Hours</span>
                </div>
                <div className="ig-countdown-cell">
                    <span className="ig-countdown-value">{pad2(cd.m)}</span>
                    <span className="ig-countdown-lbl">Mins</span>
                </div>
                <div className="ig-countdown-cell">
                    <span className="ig-countdown-value">{pad2(cd.s)}</span>
                    <span className="ig-countdown-lbl">Secs</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   GALERI SECTION (InstaVite Profile Post Grid)
   ═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   PROFILE STORY MODAL (InstaVite Story Player)
   ═══════════════════════════════════════ */
function ProfileStoryModal({ story, onClose }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let startTime = Date.now();
        const duration = 5000; // 5 seconds
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / duration) * 100, 100);
            setProgress(percentage);
            
            if (elapsed >= duration) {
                clearInterval(interval);
                onClose();
            }
        }, 30);
        return () => clearInterval(interval);
    }, [onClose]);

    return (
        <div className="ig-story-modal-overlay" onClick={onClose}>
            <div className="ig-story-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Progress bar */}
                <div className="ig-story-modal-progress-wrap">
                    <div className="ig-story-modal-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                
                {/* Header */}
                <div className="ig-story-modal-header">
                    <div className="ig-story-modal-user">
                        <div className="ig-story-modal-avatar">
                            {story.photo ? (
                                <img src={story.photo} alt={story.nickname} />
                            ) : (
                                <span>{story.nickname?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span className="ig-story-modal-username">{story.nickname}</span>
                    </div>
                    <button className="ig-story-modal-close" onClick={onClose}>
                        <i className="fas fa-times" />
                    </button>
                </div>

                {/* Main Photo */}
                <div className="ig-story-modal-photo-container">
                    {story.photo && (
                        <img src={story.photo} alt={story.name} className="ig-story-modal-photo" />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   GALERI SECTION (InstaVite Profile Post Grid)
   ═══════════════════════════════════════ */
function GallerySection({ galleries, language, invitation }) {
    const { t, locale } = useTranslation(language);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [brokenImages, setBrokenImages] = useState({});
    const [likedPosts, setLikedPosts] = useState({});
    const safeGalleries = safeArr(galleries);

    const galleryItems = [];

    if (globalShowPhotos) {
        safeGalleries.forEach((g, idx) => {
            galleryItems.push({
                type: 'photo',
                id: g.id || idx,
                src: getStorageUrl(g.image_url),
                caption: g.caption,
                indexKey: g.id || idx
            });
        });
    }

    if (galleryItems.length === 0) return null;

    const handleImgError = (idx) => {
        setBrokenImages(prev => ({ ...prev, [idx]: true }));
    };

    const toggleLikePost = (id) => {
        setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenPost = (item) => {
        setSelectedPhoto(item);
    };

    const handleClosePost = () => {
        setSelectedPhoto(null);
    };

    return (
        <section id="gallery" className="ig-section ig-gallery-feed">
            <h3 className="ig-section-tag">@posts</h3>
            <h4 className="ig-section-title-custom">{locale === 'en' ? 'Our Photo Gallery Grid' : 'Galeri Feed Foto Kami'}</h4>

            {/* Simulated IG Grid Layout Options */}
            <div className="ig-gallery-tabs">
                <div className="ig-gallery-tab active"><i className="fas fa-th" /> Grid</div>
                <div className="ig-gallery-tab"><i className="fas fa-id-card" /> Reels</div>
                <div className="ig-gallery-tab"><i className="fas fa-portrait" /> Tagged</div>
            </div>

            <div className="ig-gallery-grid-layout">
                {galleryItems.map((item, idx) => {
                    if (brokenImages[idx]) return null;
                    const isLiked = likedPosts[item.id];
                    const likeCount = isLiked ? 1000 : 999;
                    return (
                        <Reveal key={item.id} className="ig-gallery-post-item" variant="zoom" delay={(idx % 3) * 80}>
                            <div className="ig-gallery-post-img-box" onClick={() => handleOpenPost(item)} style={{ position: 'relative' }}>
                                <img src={item.src} alt={item.caption || 'Gallery'} className="ig-gallery-img" onError={() => handleImgError(idx)} loading="lazy" />
                                <div className="ig-gallery-post-hover-overlay">
                                    <span><i className="fas fa-heart" style={{ color: isLiked ? '#ff3040' : '#ffffff' }} /> {likeCount}</span>
                                    <span><i className="fas fa-comment" /> 45</span>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>

            {/* InstaVite Post Detail Modal Overlay */}
            {selectedPhoto && (() => {
                const id = selectedPhoto.id;
                const isLiked = likedPosts[id];
                const likesCount = isLiked ? 9943 : 9942;
                return (
                    <div className="ig-post-detail-modal" onClick={handleClosePost}>
                        <div className="ig-post-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="ig-modal-header">
                                <span className="ig-modal-user-avatar" style={{ backgroundColor: 'var(--ig-primary)' }}><i className="fas fa-heart" /></span>
                                <span className="ig-modal-username">our.love.posts</span>
                                <button className="ig-modal-close-btn" onClick={handleClosePost}><i className="fas fa-times" /></button>
                            </div>
                            <div className="ig-modal-photo-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={selectedPhoto.src} alt={selectedPhoto.caption} />
                            </div>
                            <div className="ig-modal-action-bar">
                                <div className="ig-modal-action-left" onClick={() => toggleLikePost(id)} style={{ cursor: 'pointer' }}>
                                    <i className={(isLiked ? 'fas fa-heart' : 'far fa-heart') + ' ig-heart-modal'} style={{ color: isLiked ? '#ff3040' : 'var(--ig-text)' }} />
                                    <i className="far fa-comment" style={{ marginLeft: 14 }} />
                                    <i className="far fa-paper-plane" style={{ marginLeft: 14 }} />
                                </div>
                                <div className="ig-modal-action-right">
                                    <i className="far fa-bookmark" />
                                </div>
                            </div>
                            <div className="ig-modal-likes-line">
                                {isLiked ? (
                                    <span>Liked by <strong>you</strong> and <strong>{likesCount - 1} others</strong></span>
                                ) : (
                                    <span><strong>{likesCount}</strong> likes</span>
                                )}
                            </div>
                            <div className="ig-modal-caption-text">
                                <strong>our.love.posts</strong> {selectedPhoto.caption || 'Captured moments of our journey.'}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </section>
    );
}

function VideoGallerySection({ invitation, language }) {
    const { t, locale } = useTranslation(language);
    const isEn = locale === 'en';

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

    const videoItems = [];
    const showVideo = invitation?.video_list?.length > 0 && 
        (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);

    if (showVideo) {
        invitation.video_list.forEach((url, idx) => {
            const ytId = getYoutubeId(url);
            if (ytId) {
                videoItems.push({
                    ytId: ytId,
                    url: url,
                    title: isEn ? `Moment Video #${idx + 1}` : `Momen Video #${idx + 1}`
                });
            }
        });
    }

    if (videoItems.length === 0) return null;

    return (
        <section id="video" className="ig-section ig-gallery-feed">
            <h3 className="ig-section-tag">@reels</h3>
            <h4 className="ig-section-title-custom">{isEn ? 'Video Moments' : 'Momen Video Kami'}</h4>
            <div 
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    padding: '0 16px'
                }}
            >
                {videoItems.map((item, idx) => (
                    <Reveal key={idx} delay={idx * 100} className="w-full">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {videoItems.length > 1 && (
                                <h4 style={{ color: 'var(--ig-text)', fontSize: '0.95rem', fontWeight: 'bold', margin: '0 0 4px', letterSpacing: '0.5px' }}>
                                    {item.title}
                                </h4>
                            )}
                            <div 
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    overflow: 'hidden',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    backgroundColor: '#000'
                                }}
                            >
                                <iframe 
                                    src={`https://www.youtube.com/embed/${item.ytId}?autoplay=0&rel=0&showinfo=1&controls=1&mute=0`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        border: '0'
                                    }}
                                />
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
/* ═══════════════════════════════════════
   HADIAH SECTION (InstaVite Product Shop List UI)
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
        try {
            document.execCommand('copy');
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 2000);
        } catch (e) {}
        document.body.removeChild(ta);
    };

    return (
        <section id="bank" className="ig-section ig-gift-shop">
            <h3 className="ig-section-tag">@shop_gift</h3>
            <h4 className="ig-section-title-custom">{locale === 'en' ? 'Wedding Registry / Shop' : 'Kirim Kado / Amplop Digital'}</h4>

            <div className="ig-shop-grid">
                {accounts.map((acc, idx) => (
                    <Reveal key={acc.id || idx} className="ig-shop-product-card" variant="zoom" delay={idx * 100}>
                        <div className="ig-product-img-box">
                            <i className="fas fa-wallet ig-wallet-icon-custom" />
                            <div className="ig-product-tag-sale">GIFT</div>
                        </div>
                        <div className="ig-product-details-wrap">
                            <span className="ig-product-bank-name">{acc.bank_name}</span>
                            <h5 className="ig-product-account-number">{acc.account_number}</h5>
                            <span className="ig-product-holder-name">a/n {acc.account_name}</span>
                            <button
                                className="ig-product-action-btn-copy"
                                type="button"
                                onClick={() => copyText(acc.account_number, idx)}
                            >
                                <i className="fas fa-shopping-bag" /> {copiedIdx === idx ? (locale === 'en' ? 'Copied!' : 'Salin Sukses!') : (locale === 'en' ? 'Copy Account' : 'Salin Rekening')}
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & WISHES SECTION (InstaVite Comments Drawer UI)
   ═══════════════════════════════════════ */
function UnifiedFormSection({ invitation, wishes, guest, enableRsvp, enableWishes, language }) {
    const wishesInputRef = React.useRef(null);
    const { t, locale } = useTranslation(language);
    const guestNameFromUrl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null;
    const defaultSenderName = guest?.name || guestNameFromUrl || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        guest_id: guest?.id || '',
        sender_name: defaultSenderName,
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const [formStatus, setFormStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus(null);
        post(route('invitation.submit_rsvp', { slug: invitation.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                if (data.message && enableWishes) {
                    post(route('invitation.submit_wish', { slug: invitation.slug }), {
                        preserveScroll: true,
                        onSuccess: () => {
                            setFormStatus('success');
                            reset('message');
                        }
                    });
                } else {
                    setFormStatus('success');
                }
            },
            onError: () => setFormStatus('error')
        });
    };

    // Wishes list display limit to 8 item with scrollable wrapper
    const activeWishes = safeArr(wishes);

    return (
        <section id="rsvp" className="ig-section ig-rsvp-comments">
            <h3 className="ig-section-tag">@comments_rsvp</h3>
            <h4 className="ig-section-title-custom">{locale === 'en' ? 'Guest RSVP & Comments' : 'Konfirmasi RSVP & Ucapan Tamu'}</h4>

            {/* Unified Form */}
            {enableRsvp && (
                <Reveal className="ig-rsvp-form-container" variant="zoom">
                    <div className="ig-form-header">
                        <i className="fas fa-comment-dots" />
                        <span>{locale === 'en' ? 'Add Comment / RSVP' : 'Tulis Ucapan & RSVP'}</span>
                    </div>

                    {formStatus === 'success' && (
                        <div className="ig-alert-box success">
                            <i className="fas fa-check-circle" /> {locale === 'en' ? 'RSVP and wishes submitted successfully!' : 'Konfirmasi RSVP dan ucapan berhasil dikirim!'}
                        </div>
                    )}
                    {formStatus === 'error' && (
                        <div className="ig-alert-box error">
                            <i className="fas fa-exclamation-circle" /> {locale === 'en' ? 'Failed to submit. Please check the inputs.' : 'Gagal mengirim. Silakan periksa kembali formulir Anda.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="ig-comments-form">
                        <div className="ig-form-group">
                            <label>{locale === 'en' ? 'Your Name' : 'Nama Lengkap'}</label>
                            <input
                                type="text"
                                value={data.sender_name}
                                onChange={(e) => setData('sender_name', e.target.value)}
                                className="ig-form-input"
                                placeholder={locale === 'en' ? 'Enter name' : 'Masukkan nama Anda'}
                                required
                            />
                            {errors.sender_name && <span className="ig-form-error-lbl">{errors.sender_name}</span>}
                        </div>

                        <div className="ig-form-group">
                            <label>{locale === 'en' ? 'Attendance' : 'Kehadiran'}</label>
                            <select
                                value={data.attendance}
                                onChange={(e) => setData('attendance', e.target.value)}
                                className="ig-form-select"
                            >
                                <option value="hadir">{locale === 'en' ? 'Attending' : 'Hadir'}</option>
                                <option value="tidak_hadir">{locale === 'en' ? 'Not Attending' : 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{locale === 'en' ? 'Uncertain' : 'Belum Pasti'}</option>
                            </select>
                        </div>

                        {data.attendance === 'hadir' && (
                            <div className="ig-form-group">
                                <label>{locale === 'en' ? 'Number of Guests' : 'Jumlah Orang'}</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={data.number_of_guests}
                                    onChange={(e) => setData('number_of_guests', parseInt(e.target.value) || 1)}
                                    className="ig-form-input"
                                />
                            </div>
                        )}

                        {enableWishes && (
                            <div className="ig-form-group">
                                <label>{locale === 'en' ? 'Your Wish / Comment' : 'Tulis Ucapan & Doa'}</label>
                                <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    className="ig-form-textarea"
                                    placeholder={locale === 'en' ? 'Write a comment...' : 'Tulis komentar ucapan doa restu...'}
                                    rows="3"
                                    required
                                />
                                </WishesEmojiPicker>
                            </div>
                        )}

                        <button type="submit" disabled={processing} className="ig-form-submit-btn">
                            {processing ? (locale === 'en' ? 'Submitting...' : 'Mengirim...') : (locale === 'en' ? 'Post Comment' : 'Kirim Komentar')}
                        </button>
                    </form>
                </Reveal>
            )}

            {/* Scrollable Comments List Drawer Mockup */}
            <div className="ig-comments-list-wrap">
                <div className="ig-comments-list-header">
                    <span>{locale === 'en' ? 'Comments' : 'Semua Komentar'} ({activeWishes.length})</span>
                </div>
                <div className="ig-comments-scroller-box">
                    {activeWishes.map((wish, idx) => (
                        <div key={wish.id || idx} className="ig-comment-item-row">
                            <span className="ig-comment-avatar-circle">{wish.sender_name?.charAt(0).toUpperCase()}</span>
                            <div className="ig-comment-body-area">
                                <p className="ig-comment-author-name">
                                    <strong>{wish.sender_name?.toLowerCase().replace(/\s+/g, '_')}</strong>
                                    <span className="ig-comment-date-meta">2d</span>
                                </p>
                                <p className="ig-comment-main-text">{wish.message}</p>
                                <div className="ig-comment-actions-meta">
                                    <span>Reply</span>
                                    <span>Like</span>
                                </div>
                            </div>
                            <div className="ig-comment-heart-btn-right">
                                <i className="far fa-heart" />
                            </div>
                        </div>
                    ))}
                    {activeWishes.length === 0 && (
                        <div className="ig-comment-item-row-empty">
                            {locale === 'en' ? 'No comments yet. Be the first to post!' : 'Belum ada komentar ucapan. Jadilah yang pertama memberikan ucapan!'}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (Formal Footer UI)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, language }) {
    const { t, locale } = useTranslation(language);
    const bgs = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', language || 'id', [], invitation);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const isEn = locale === 'en';

    return (
        <section id="closing" className="ig-section ig-closing-post">
            <div className="ig-closing-card">
                <i className="fas fa-heart ig-closing-heart" />
                <h4 className="ig-closing-thanks-header">{invitation?.closing_title || (isEn ? 'THANK YOU' : 'TERIMA KASIH')}</h4>
                <p className="ig-closing-thanks-text">{invitation?.closing_text || themeConfig.labels.closingText}</p>
                
                <div className="ig-closing-families">
                    {hasGroomParents && (
                        <div className="ig-closing-family-block">
                            <span>{isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}</span>
                        </div>
                    )}
                    {hasBrideParents && (
                        <div className="ig-closing-family-block">
                            <span>{isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}</span>
                        </div>
                    )}
                </div>

                <div className="ig-closing-watermark-area">
                    <p>Made with ❤️ by {brandName}</p>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   BOTTOM NAVIGATION CONTROLLER (Sticky navigation widget)
   ═══════════════════════════════════════ */
function BottomPlayer({ isSlideMode, onPrevSlide, onNextSlide, activeSectionId, resolvedSections, onJump, language }) {
    const isEn = language === 'en';
    // Persistent IG-style bottom app bar - dynamically built from active sections
    const sectionIconMap = {
        opening:    'fas fa-home',
        bride_groom:'fas fa-search',
        love_story: 'far fa-play-circle',
        event:      'far fa-calendar-alt',
        gallery:    'fas fa-th',
        bank:       'fas fa-shopping-bag',
        rsvp:       'fas fa-user-circle',
        wishes:     'fas fa-comments',
        closing:    'fas fa-flag',
        livestream: 'fas fa-video',
    };

    // Priority order for bottom nav (max 5 shown)
    const priorityOrder = ['opening', 'bride_groom', 'love_story', 'gallery', 'event', 'bank', 'rsvp', 'wishes', 'closing', 'livestream'];

    // Filter to only sections present in resolvedSections, sorted by priority
    const navItems = priorityOrder
        .filter(key => resolvedSections.some(s => s.section_key === key))
        .slice(0, 5)
        .map(key => ({ key, icon: sectionIconMap[key] || 'fas fa-circle' }));

    return (
        <div className="ig-bottom-player-sticky">
            {/* IG-style Bottom Nav Bar */}
            <div className="ig-sticky-nav-slots">
                {navItems.map((item) => {
                    const idx = resolvedSections.findIndex(s => s.section_key === item.key);
                    const isActive = activeSectionId === item.key;

                    // Dynamic icon filled/outline toggle for reels and calendar
                    let iconClass = item.icon;
                    if (item.key === 'love_story') {
                        iconClass = isActive ? 'fas fa-play-circle' : 'far fa-play-circle';
                    } else if (item.key === 'event') {
                        iconClass = isActive ? 'fas fa-calendar-alt' : 'far fa-calendar-alt';
                    }

                    return (
                        <div
                            key={item.key}
                            className={`ig-nav-slot-btn ${isActive ? 'is-active' : ''}`}
                            onClick={() => { if (idx !== -1) onJump(idx, item.key); }}
                        >
                            <i className={iconClass} />
                            {isActive && <span className="ig-nav-slot-dot" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME EXPORT
   ═══════════════════════════════════════ */
function InstaViteThemeContent({ invitation, sections, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest, isDemo }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showQr, setShowQr] = useState(false);
    const [activeProfileStory, setActiveProfileStory] = useState(null);

    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
    const slideContainerRef = useRef(null);

    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const themeConfig = getThemeLabels(invitation?.type || 'wedding', activeLanguage, brideGrooms, invitation);

    useEffect(() => {
        if (themeConfig.mainName) {
            document.title = themeConfig.mainName + (invitation?.type ? ` - ${themeConfig.labels.profileBadge}` : '');
        }
    }, [themeConfig, invitation]);

    const enableQr = parseBool(invitation?.enable_qr ?? true) && parseBool(invitation?.show_qr_code ?? true);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const openProfileStory = (photo, name, nickname) => {
        setActiveProfileStory({ photo, name, nickname });
    };

    // Global settings override injection
    globalShowPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    globalShowAnimations = parseBool(invitation?.show_animations ?? true);

    const enableRsvp = parseBool(invitation?.enable_rsvp ?? true);
    const enableWishes = parseBool(invitation?.enable_wishes ?? true);

    const hasStream = safeArr(events).some(e => e.streaming_url || (Array.isArray(e.streamings) && e.streamings.length > 0));

    // Dynamic list filter
    const resolvedSections = useMemo(() => {
        let list = safeArr(sections);
        
        // Mode Tanpa Foto overrides
        if (!globalShowPhotos) {
            list = list.filter(s => s.section_key !== 'gallery');
        }

        // Wishes/RSVP filter to prevent duplicates
        const hasRsvp = list.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            list = list.filter(s => s.section_key !== 'wishes');
        }

        const hasVideos = invitation?.video_list?.length > 0 && (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);

        let newList = [];
        list.forEach(s => {
            if (s.section_key === 'gallery') {
                if (galleries?.length > 0) {
                    newList.push(s);
                }
                if (hasVideos) {
                    newList.push({ section_key: 'video', is_visible: true, sort_order: s.sort_order + 0.1 });
                }
            } else {
                newList.push(s);
            }
        });

        // Fallback check
        if (newList.length === 0) {
            const fallbacks = [
                { section_key: 'opening', sort_order: 1 },
                { section_key: 'bride_groom', sort_order: 2 },
                { section_key: 'event', sort_order: 3 }
            ];
            if (hasStream) {
                fallbacks.push({ section_key: 'livestream', sort_order: 4 });
            }
            if (loveStories?.length > 0) {
                fallbacks.push({ section_key: 'love_story', sort_order: 5 });
            }
            if (galleries?.length > 0) {
                fallbacks.push({ section_key: 'gallery', sort_order: 6 });
            }
            if (hasVideos) {
                fallbacks.push({ section_key: 'video', sort_order: 7 });
            }
            if (enableRsvp) {
                fallbacks.push({ section_key: 'rsvp', sort_order: 8 });
            } else if (enableWishes) {
                fallbacks.push({ section_key: 'wishes', sort_order: 8 });
            }
            if (bankAccounts?.length > 0) {
                fallbacks.push({ section_key: 'bank', sort_order: 9 });
            }
            fallbacks.push({ section_key: 'closing', sort_order: 10 });
            newList = fallbacks;
        }

        return newList.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }, [sections, invitation, galleries, enableRsvp, enableWishes, bankAccounts, loveStories, hasStream]);

    const randomGalleryPhoto = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length > 0) return getStorageUrl(list[0].image_url);
        return '/images/demo/korea-11-768x512.jpg';
    }, [galleries]);

    const isSlideMode = useMemo(() => {
        const mode = invitation?.layout_mode || 'scroll';
        return ['slide', 'slide-h', 'slide-v'].includes(mode);
    }, [invitation?.layout_mode]);

    const layoutMode = invitation?.layout_mode || 'scroll';

    // Music playback control
    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
        }
    }, [isPlaying]);

    // Handle Open invitation
    const handleOpen = () => {
        setIsOpened(true);
        // Play music
        if (invitation?.music_autoplay !== false) {
            const audio = audioRef.current;
            if (audio) {
                audio.play().then(() => setIsPlaying(true)).catch(() => {});
            }
        }
        // Fullscreen activation
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    // Fullscreen listeners
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

    // Auto Scroll functionality
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) return 0;
                    return prev + 1;
                });
            }, 4000);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isBottom) setAutoScrollEnabled(false);
            }, 25);
        }

        return () => { if (timer) clearInterval(timer); };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.ig-btn-float') || 
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

    // Slide navigation handlers
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const jumpToSection = (idx, key) => {
        if (isSlideMode) {
            setActiveSlideIdx(idx);
        } else {
            const el = document.getElementById(key);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const handleStoryEnd = useCallback(() => {
        if (isSlideMode) {
            nextSlide();
        } else {
            const currentIndex = resolvedSections.findIndex(s => s.section_key === 'opening');
            if (currentIndex !== -1 && currentIndex + 1 < resolvedSections.length) {
                const nextSection = resolvedSections[currentIndex + 1].section_key;
                jumpToSection(currentIndex + 1, nextSection);
            }
        }
    }, [isSlideMode, resolvedSections]);

    // Scrollspy setup for bottom controls in scroll mode
    useEffect(() => {
        if (!isOpened || isSlideMode) return;

        const handleScroll = () => {
            const keys = resolvedSections.map(s => s.section_key);
            let currentActive = 'opening';

            keys.forEach(key => {
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
    }, [isOpened, isSlideMode, resolvedSections]);

    // Swipe gestures inside slide layouts
    const touchStartRef = useRef(null);
    const handleTouchStart = (e) => {
        if (!isSlideMode) return;
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isSlideMode || !touchStartRef.current) return;
        const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (layoutMode === 'slide-h' || layoutMode === 'slide') {
                if (deltaX < 0) nextSlide();
                else prevSlide();
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (layoutMode === 'slide-v') {
                if (deltaY < 0) nextSlide();
                else prevSlide();
            }
        }
        touchStartRef.current = null;
    };

    // Sync slide index with activeSectionId for bottom nav
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            setActiveSectionId(resolvedSections[activeSlideIdx].section_key);
        }
    }, [activeSlideIdx, isSlideMode, resolvedSections]);

    // Map keys to React elements
    const renderSection = (key) => {
        const props = { invitation, brideGrooms, events, wishes, galleries, loveStories, bankAccounts, guest, enableRsvp, enableWishes, language: activeLanguage, fallbackPhoto: randomGalleryPhoto, sections };
        switch (key) {
            case 'opening': return <OpeningSection key={key} {...props} onOpenMusic={toggleMusic} onStoryEnd={handleStoryEnd} />;
            case 'bride_groom': return <BrideGroomSection key={key} {...props} onOpenStory={openProfileStory} />;
            case 'love_story': return <LoveStorySection key={key} {...props} />;
            case 'event': return <EventSection key={key} {...props} />;
            case 'livestream': return <LiveStreamingSection key={key} {...props} />;
            case 'gallery': return <GallerySection key={key} {...props} />;
            case 'video': return <VideoGallerySection key={key} {...props} />;
            case 'bank': return <BankSection key={key} {...props} />;
            case 'rsvp':
            case 'wishes': return <UnifiedFormSection key={key} {...props} />;
            case 'closing': return <ClosingSection key={key} {...props} />;
            default: return null;
        }
    };

    // External CSS resources
    const googleFontLink = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Great+Vibes&family=Pacifico&display=swap';

    return (
        <ErrorBoundary>
            <link href={googleFontLink} rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" />

            {/* Particle Effect */}
            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect type={invitation.particle_type} />
            )}

            {/* Audio music playback */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={invitation.music_url} loop />
            )}

            <div className={`ig-main-wrapper ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                {/* ══════ COVER ══════ */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpen}
                    language={activeLanguage}
                    fallbackPhoto={randomGalleryPhoto}
                    onJump={jumpToSection}
                />

                {/* ══════ MAIN APP PANEL ══════ */}
                {isOpened && (
                    <main className={`ig-app-main ${isSlideMode ? 'ig-main--slide' : ''}`}>
                        
                        {/* Stories Quick Navigation Tray at the top */}
                        <StoriesTray
                            resolvedSections={resolvedSections}
                            activeSectionId={activeSectionId}
                            isSlideMode={isSlideMode}
                            activeSlideIdx={activeSlideIdx}
                            onJump={jumpToSection}
                            language={activeLanguage}
                            themeConfig={themeConfig}
                        />

                        {/* Floating player and Auto scroll togglers */}
                        <div className="ig-floating-actions-container">
                            <button onClick={toggleFullscreen} className="ig-btn-float" title="Toggle Fullscreen">
                                <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                            </button>
                            <button onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} className={`ig-btn-float ${autoScrollEnabled ? 'active' : ''}`} title="Auto Scroll">
                                <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-arrow-down"} />
                            </button>
                            {invitation?.music_url && (
                                <button onClick={toggleMusic} className={`ig-btn-float ig-music-btn-float ${isPlaying ? 'playing' : ''}`} title={isPlaying ? "Pause Music" : "Play Music"}>
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
                            {enableQr && activeGuest && activeGuest.slug && (
                                <button onClick={() => setShowQr(true)} className="ig-btn-float" title="QR Code Check-in">
                                    <i className="fas fa-qrcode" />
                                </button>
                            )}
                        </div>

                        {/* Layout rendering */}
                        {isSlideMode ? (
                            <div
                                ref={slideContainerRef}
                                className={`ig-slide-container layout-${layoutMode}`}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {resolvedSections.map((s, idx) => {
                                    const isActive = idx === activeSlideIdx;
                                    return (
                                        <div
                                            key={s.section_key}
                                            className={`ig-slide-item ig-slide--${s.section_key} ${isActive ? 'is-active' : ''}`}
                                        >
                                            <div className="ig-slide-scrollable-area">
                                                {renderSection(s.section_key)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="ig-scroll-container">
                                {resolvedSections.map(s => renderSection(s.section_key))}
                            </div>
                        )}

                        {/* Bottom sticky control player */}
                        <BottomPlayer
                            isSlideMode={isSlideMode}
                            onPrevSlide={prevSlide}
                            onNextSlide={nextSlide}
                            activeSectionId={activeSectionId}
                            resolvedSections={resolvedSections}
                            onJump={jumpToSection}
                            language={activeLanguage}
                        />
                    </main>
                )}

                {/* Profile Story Modal Overlay */}
                {activeProfileStory && (
                    <ProfileStoryModal
                        story={activeProfileStory}
                        onClose={() => setActiveProfileStory(null)}
                    />
                )}

                {/* QR Code Check-in Modal Overlay */}
                {enableQr && showQr && activeGuest && activeGuest.slug && (
                    <div className="ig-post-detail-modal" onClick={() => setShowQr(false)}>
                        <div className="ig-post-modal-content" style={{ maxWidth: '340px', padding: '20px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--ig-text)' }}>QR Check-in</h3>
                                <button onClick={() => setShowQr(false)} style={{ border: 'none', background: 'transparent', color: 'var(--ig-text)', fontSize: '1.2rem', cursor: 'pointer' }}><i className="fas fa-times" /></button>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--ig-text-muted)', marginBottom: '14px' }}>Tunjukkan QR Code ini untuk check-in kehadiran di lokasi acara.</p>
                            <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', display: 'inline-block', marginBottom: '14px' }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&data=${encodeURIComponent(route('invitation.checkin', { slug: invitation.slug, to: activeGuest.slug }))}`}
                                    alt="QR Code Check-in"
                                    style={{ display: 'block', width: '200px', height: '200px' }}
                                />
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--ig-text)' }}>{activeGuest.name}</h4>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

export default function InstaViteTheme(props) {
    return <InstaViteThemeContent {...props} />;
}
