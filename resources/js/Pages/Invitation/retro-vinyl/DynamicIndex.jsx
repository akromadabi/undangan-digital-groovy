import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { useTranslation } from '@/i18n';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import './style.css';

// 1. Error Boundary Baku
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(e) {
        return { hasError: true, error: e };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="theme-error-boundary p-8 text-center bg-amber-50 text-amber-900 min-h-screen flex flex-col justify-center items-center">
                    <h2 className="text-xl font-bold mb-2">Terjadi kesalahan pada rendering tema Retro Vinyl.</h2>
                    <pre className="text-sm bg-amber-100 p-4 rounded overflow-auto max-w-full">{this.state.error?.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

// 2. Helper Standardisasi Array & Boolean
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

// 2.2 Helper Path Gambar /storage
function getStorageUrl(url, fallback = '') {
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

// 2.4 Penanganan Tanggal & Waktu Aman (Anti-Timezone Midnight Bug)
function formatDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    const safeStr = String(dateStr).substring(0, 10) + 'T12:00:00';
    const date = new Date(safeStr);
    if (isNaN(date.getTime())) {
        return String(dateStr).toUpperCase();
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        day: 'numeric', month: 'long', year: 'numeric'
    }).toUpperCase();
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

function pad2(num) {
    return String(num).padStart(2, '0');
}

// Child order translation helper
function translateChildOrder(order, gender, lang = 'id') {
    if (!order) return '';
    const orderStr = String(order).toLowerCase().trim();
    const isFemale = String(gender).toLowerCase() === 'wanita' || String(gender).toLowerCase() === 'female';
    
    const childMap = {
        '1': isFemale ? (lang === 'en' ? 'first daughter' : 'putri pertama') : (lang === 'en' ? 'first son' : 'putra pertama'),
        'pertama': isFemale ? (lang === 'en' ? 'first daughter' : 'putri pertama') : (lang === 'en' ? 'first son' : 'putra pertama'),
        '2': isFemale ? (lang === 'en' ? 'second daughter' : 'putri kedua') : (lang === 'en' ? 'second son' : 'putra kedua'),
        'kedua': isFemale ? (lang === 'en' ? 'second daughter' : 'putri kedua') : (lang === 'en' ? 'second son' : 'putra kedua'),
        '3': isFemale ? (lang === 'en' ? 'third daughter' : 'putri ketiga') : (lang === 'en' ? 'third son' : 'putra ketiga'),
        'ketiga': isFemale ? (lang === 'en' ? 'third daughter' : 'putri ketiga') : (lang === 'en' ? 'third son' : 'putra ketiga'),
        'bungsu': isFemale ? (lang === 'en' ? 'youngest daughter' : 'putri bungsu') : (lang === 'en' ? 'youngest son' : 'putra bungsu'),
        'tunggal': isFemale ? (lang === 'en' ? 'only daughter' : 'putri tunggal') : (lang === 'en' ? 'only son' : 'putra tunggal')
    };

    return childMap[orderStr] || order;
}

// Theme specific text configurations
function getThemeLabels(type, lang, invitation) {
    const isEn = lang === 'en';
    return {
        inviteLabel: isEn ? 'YOU ARE INVITED TO THE WEDDING ALBUM OF' : 'ANDA DIUNDANG KE ALBUM PERNIKAHAN',
        openingHeader: isEn ? 'Harmonizing Our Love' : 'Menyelaraskan Kasih Kami',
        storyHeader: isEn ? 'The Playlist of Our Story' : 'Daftar Lagu Kisah Kami',
        storySubtitle: isEn ? 'Lyrics synchronized with our milestones' : 'Lirik disinkronkan dengan perjalanan kami',
        presentLabel: isEn ? 'Attending' : 'Hadir',
        absentLabel: isEn ? 'Absent' : 'Tidak Hadir',
        submittingLabel: isEn ? 'Sending Request...' : 'Mengirim Permintaan...',
        submitLabel: isEn ? 'Send Wish & RSVP' : 'Kirim Ucapan & RSVP',
        successMsg: isEn ? 'Thank you! Your wish and RSVP have been saved.' : 'Terima kasih! Ucapan dan RSVP Anda telah tersimpan.'
    };
}

/* ═══════════════════════════════════════
   1. COVER SECTION
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, isPlaying, language }) {
    const { t, locale } = useTranslation(language);
    const labels = getThemeLabels(invitation?.type, locale, invitation);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
    
    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : invitation?.cover_title || 'Groom & Bride';

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    const showPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    const isEn = locale === 'en';
    const tagTitle = isEn ? 'THE WEDDING OF' : 'PERNIKAHAN';

    return (
        <div className={`rv-cover ${isOpened ? 'is-opened-transition' : ''}`}>
            <div className="rv-cover-header">
                <span className="rv-cover-badge">{tagTitle}</span>
                <h1 className="rv-cover-names">{coupleName}</h1>
            </div>

            {/* Turntable / Platter Box */}
            <div className="rv-turntable-container">
                <div className="rv-turntable-box">
                    {/* Hi-Fi brand plate */}
                    <div className="rv-turntable-plate">HI-FI STEREO</div>

                    {/* Status LED */}
                    <div className={`rv-turntable-led ${isPlaying ? 'is-active' : ''}`} />

                    {/* Power Switch Knob */}
                    <div className="rv-turntable-knob-power" />

                    {/* Speed Selector Buttons */}
                    <div className="rv-turntable-speed-select">
                        <span className="active">33</span>
                        <span>45</span>
                    </div>

                    {/* Pitch Control Slider */}
                    <div className="rv-turntable-pitch-slider">
                        <div className="rv-slider-track">
                            <div className="rv-slider-handle" />
                        </div>
                    </div>

                    {/* ToneArm (Turntable Needle) */}
                    <div className={`rv-tonearm ${isPlaying ? 'is-on-record' : ''}`}>
                        <div className="rv-tonearm-base" />
                        <div className="rv-tonearm-arm" />
                        <div className="rv-tonearm-head" />
                    </div>

                    {/* Platter Backdrop */}
                    <div className="rv-platter">
                        {/* Vinyl Record */}
                        <div className={`rv-vinyl ${isPlaying ? 'is-spinning' : ''}`}>
                            <div className="rv-vinyl-label" style={{ backgroundColor: invitation?.color_scheme?.secondary || '#f1a153' }}>
                                <span className="font-bold text-[6px] tracking-wider uppercase mb-1">LP STEREO</span>
                                <span className="font-serif font-black text-[8px] text-slate-800 line-clamp-1">{coupleName}</span>
                                <span className="text-[5px] mt-1 opacity-70">TrueLove Records</span>
                                <div className="rv-vinyl-center-hole" />
                            </div>
                        </div>
                    </div>

                    {/* Outer Album Sleeve Envelope */}
                    <div className="rv-sleeve">
                        {showPhotos && coverImages.length > 0 && (
                            <div 
                                className="rv-sleeve-art" 
                                style={{ backgroundImage: `url(${coverImages[0]})` }}
                            />
                        )}
                        <div className="rv-sleeve-content">
                            <div className="rv-sleeve-header">
                                <div>
                                    <span className="rv-sleeve-label-top">LP / ALBUM</span>
                                    <h3 className="rv-sleeve-title">{coupleName}</h3>
                                </div>
                                <div className="rv-sleeve-badge-wrapper">
                                    <span className="rv-sleeve-badge">HI-FI</span>
                                    <div className="rv-sleeve-rpm">33 ⅓ RPM</div>
                                </div>
                            </div>
                            
                            <div className="rv-sleeve-footer">
                                <span className="rv-sleeve-catno">CAT. NO. RV-2026</span>
                                <div className="rv-sleeve-circle">
                                    <span>SIDE A</span>
                                </div>
                                <span className="rv-sleeve-stereo">STEREO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {guest?.name && (
                <div className="rv-cover-guest">
                    <p className="rv-cover-guest-title">{t('invitation.to') || 'Kepada Yth. Bapak/Ibu/Saudara/i'}:</p>
                    <h4 className="rv-cover-guest-name">{guest.name}</h4>
                    {guest.group_name && <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">({guest.group_name})</span>}
                </div>
            )}

            <button 
                type="button" 
                onClick={onOpen}
                className="rv-btn-open"
            >
                <i className="fas fa-play" /> {t('invitation.open') || 'BUKA UNDANGAN'}
            </button>
        </div>
    );
}

/* ═══════════════════════════════════════
   2. OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, events, language, showPhotos, showAnimations }) {
    const { t, locale } = useTranslation(language);
    const labels = getThemeLabels(invitation?.type, locale, invitation);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : invitation?.cover_title || 'Groom & Bride';

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    const showCountdown = parseBool(invitation?.show_countdown);

    return (
        <section id="opening" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{labels.openingHeader}</span>
                <h2 className="rv-section-title">{t('invitation.hello') || 'Selamat Datang'}</h2>
            </div>

            <div className="rv-card">
                <h3 className="rv-opening-names">{coupleName}</h3>
                
                {showPhotos && openingImages.length > 0 && (
                    <div className="rv-slideshow-container">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                )}

                {/* Cassette Countdown Block */}
                {showCountdown && (
                    <CassetteCountdown events={events} isPlaying={showAnimations} language={locale} />
                )}

                <div className="rv-quote-container">
                    {invitation?.opening_ayat && (
                        <p className="rv-quote-text">
                            "{invitation.opening_ayat}"
                        </p>
                    )}
                    {invitation?.opening_ayat_source && (
                        <span className="rv-quote-source">
                            — {invitation.opening_ayat_source}
                        </span>
                    )}
                </div>

                {invitation?.opening_text && (
                    <p className="text-sm text-slate-600 mt-6 whitespace-pre-line leading-relaxed">
                        {invitation.opening_text}
                    </p>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   2.1 CASSETTE TAPE COUNTDOWN COMPONENT
   ═══════════════════════════════════════ */
function CassetteCountdown({ events, isPlaying, language }) {
    const { t } = useTranslation(language);
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

    const primaryEvent = useMemo(() => {
        return safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    }, [events]);

    useEffect(() => {
        if (!primaryEvent?.event_date) return;
        const target = parseSafeDate(primaryEvent.event_date, primaryEvent.start_time);
        if (!target || isNaN(target.getTime())) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) {
                setCd({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
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
    }, [primaryEvent]);

    return (
        <div className="rv-cassette-countdown">
            <div className="rv-cassette-label">
                <div className="rv-cassette-title">Mixtape: Save The Date</div>
                
                <div className="rv-cassette-timer-row">
                    <div className="rv-cassette-unit">
                        <span className="rv-cassette-number">{pad2(cd.d)}</span>
                        <span className="rv-cassette-label-text">{t('invitation.days') || 'Hari'}</span>
                    </div>
                    <span className="font-bold text-slate-400">:</span>
                    <div className="rv-cassette-unit">
                        <span className="rv-cassette-number">{pad2(cd.h)}</span>
                        <span className="rv-cassette-label-text">{t('invitation.hours') || 'Jam'}</span>
                    </div>
                    <span className="font-bold text-slate-400">:</span>
                    <div className="rv-cassette-unit">
                        <span className="rv-cassette-number">{pad2(cd.m)}</span>
                        <span className="rv-cassette-label-text">{t('invitation.minutes') || 'Menit'}</span>
                    </div>
                    <span className="font-bold text-slate-400">:</span>
                    <div className="rv-cassette-unit">
                        <span className="rv-cassette-number">{pad2(cd.s)}</span>
                        <span className="rv-cassette-label-text">{t('invitation.seconds') || 'Detik'}</span>
                    </div>
                </div>
            </div>

            <div className="rv-cassette-wheels">
                <div className={`rv-cassette-wheel ${!isPlaying ? 'rv-cassette-wheel-paused' : ''}`} />
                <div className={`rv-cassette-wheel ${!isPlaying ? 'rv-cassette-wheel-paused' : ''}`} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   3. BRIDE & GROOM SECTION
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, language, showPhotos }) {
    const { t, locale } = useTranslation(language);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const renderPerson = (person, role) => {
        if (!person || !person.nickname) return null;
        
        const photoUrl = getStorageUrl(person.photo || person.image_url || person.image_path);
        const childOrderStr = translateChildOrder(person.child_order, person.gender, locale);
        const isMale = ['pria', 'male'].includes(String(person.gender).toLowerCase());

        return (
            <div key={person.id || role} className="rv-polaroid">
                <div className="rv-polaroid-photo-wrapper">
                    {showPhotos && photoUrl ? (
                        <img 
                            className="rv-polaroid-photo" 
                            src={photoUrl} 
                            alt={person.full_name} 
                        />
                    ) : (
                        <div className="rv-polaroid-monogram">
                            {String(person.nickname).substring(0, 1).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="rv-polaroid-caption">
                    <span className="rv-polaroid-nickname">{person.nickname}</span>
                    <h4 className="rv-polaroid-fullname">{person.full_name}</h4>
                    
                    {childOrderStr && (
                        <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mt-1">
                            {childOrderStr}
                        </p>
                    )}

                    {(person.father_name || person.mother_name) && (
                        <p className="rv-polaroid-parents">
                            {locale === 'en' ? 'Child of ' : 'Anak dari '}<br/>
                            {person.father_name && person.mother_name
                                ? `${locale === 'en' ? 'Mr.' : 'Bapak'} ${person.father_name} & ${locale === 'en' ? 'Mrs.' : 'Ibu'} ${person.mother_name}`
                                : person.father_name
                                ? `${locale === 'en' ? 'Mr.' : 'Bapak'} ${person.father_name}`
                                : `${locale === 'en' ? 'Mrs.' : 'Ibu'} ${person.mother_name}`
                            }
                        </p>
                    )}

                    {person.instagram && (
                        <a 
                            href={`https://instagram.com/${String(person.instagram).replace('@', '')}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="rv-btn-instagram"
                        >
                            <i className="fab fa-instagram" /> @{String(person.instagram).replace('@', '')}
                        </a>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section id="bride_groom" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">Side A & Side B</span>
                <h2 className="rv-section-title">{t('invitation.mempelai') || 'Kedua Mempelai'}</h2>
            </div>

            <div className="rv-couple-container">
                {/* Always render groom first, then bride */}
                {renderPerson(groom, 'groom')}
                {renderPerson(bride, 'bride')}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   4. LOVE STORY (SCROLLING LYRICS)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, language, invitation }) {
    const { t, locale } = useTranslation(language);
    const labels = getThemeLabels(invitation?.type, locale, invitation);
    const stories = safeArr(loveStories).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const [activeIdx, setActiveIdx] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const lines = container.querySelectorAll('.rv-lyrics-line');
        if (lines.length === 0) return;

        const options = {
            root: null,
            rootMargin: '-30% 0px -40% 0px', // targets the middle band of the screen
            threshold: 0
        };

        const callback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idxAttr = entry.target.getAttribute('data-index');
                    if (idxAttr !== null) {
                        setActiveIdx(parseInt(idxAttr, 10));
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        lines.forEach(line => observer.observe(line));

        return () => {
            observer.disconnect();
        };
    }, [stories]);

    if (stories.length === 0) return null;

    return (
        <section id="love_story" className="rv-section rv-lyrics-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{labels.storyHeader}</span>
                <h2 className="rv-section-title">#OURPLAYLIST</h2>
            </div>

            <div className="rv-lyrics-box">
                <div className="rv-lyrics-watermark">
                    <i className="fas fa-music animate-pulse" /> {labels.storySubtitle}
                </div>

                <div ref={containerRef} className="rv-lyrics-list">
                    {stories.map((story, idx) => {
                        const formattedDate = story.story_date ? formatDate(story.story_date, locale) : '';
                        const isActive = activeIdx === idx;
                        return (
                            <div
                                key={story.id || idx}
                                data-index={idx}
                                className={`rv-lyrics-line ${isActive ? 'is-active' : ''}`}
                                onClick={() => setActiveIdx(idx)}
                            >
                                <div className="rv-lyrics-line-date">{formattedDate || `TRACK ${idx + 1}`}</div>
                                <h4 className="rv-lyrics-line-title">{story.title}</h4>
                                <p className="rv-lyrics-line-text">{story.description || story.story}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   5. EVENT SECTION (Ticket Style)
   ═══════════════════════════════════════ */
function EventSection({ events, language }) {
    const { t, locale } = useTranslation(language);
    const list = safeArr(events).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    if (list.length === 0) return null;
    const isEn = locale === 'en';

    return (
        <section id="event" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{t('invitation.save_the_date') || 'Save The Date'}</span>
                <h2 className="rv-section-title">{t('invitation.wedding_events') || 'Rangkaian Acara'}</h2>
            </div>

            <div className="rv-events-list">
                {list.map((evt, idx) => {
                    const formattedDate = evt.event_date ? formatDate(evt.event_date, language) : '';
                    const primaryLabel = isEn ? 'PRIMARY' : 'UTAMA';
                    
                    return (
                        <div key={evt.id || idx} className="rv-ticket">
                            <div className="rv-ticket-header">
                                <span className="rv-ticket-header-title">{evt.event_name || (evt.event_type === 'akad' ? 'Akad Nikah' : 'Resepsi')}</span>
                                {evt.is_primary && (
                                    <span className="rv-ticket-header-badge">{primaryLabel}</span>
                                )}
                            </div>
                            
                            <div className="rv-ticket-body">
                                <div className="rv-ticket-date">{formattedDate}</div>
                                
                                {evt.start_time && (
                                    <div className="rv-ticket-time">
                                        <i className="far fa-clock mr-1" />
                                        {evt.start_time} {evt.end_time ? ` - ${evt.end_time}` : ''} {evt.timezone || 'WIB'}
                                    </div>
                                )}

                                <div className="rv-ticket-divider" />

                                <div className="rv-ticket-venue">
                                    <i className="fas fa-map-marker-alt text-amber-600 mr-1" /> {evt.venue_name}
                                </div>
                                
                                {evt.venue_address && (
                                    <p className="rv-ticket-address">{evt.venue_address}</p>
                                )}

                                {evt.gmaps_link && (
                                    <button
                                        type="button"
                                        onClick={() => window.open(evt.gmaps_link, '_blank')}
                                        className="rv-btn-gmaps"
                                    >
                                        <i className="fas fa-directions" /> GOOGLE MAPS
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   6. LIVE STREAMING SECTION
   ═══════════════════════════════════════ */
function LivestreamSection({ events, language }) {
    const { t } = useTranslation(language);
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];

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

    const isEn = language === 'en';

    return (
        <section id="livestream" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{isEn ? 'Virtual Event' : 'Acara Virtual'}</span>
                <h2 className="rv-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
            </div>

            <div className="rv-card rv-livestream-box">
                <p className="text-sm text-slate-600 mb-6">
                    {isEn 
                        ? 'For family and friends who cannot attend physically, you can still share our joy through the live stream:'
                        : 'Bagi keluarga dan kerabat yang tidak dapat hadir secara langsung, Anda tetap dapat menyaksikan kebahagiaan kami secara virtual:'}
                </p>

                <div>
                    {streamsList.map((stream, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => window.open(stream.url, '_blank')}
                            className="rv-btn-stream"
                        >
                            <i className="fas fa-video mr-1" /> WATCH ON {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   7. GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries, language }) {
    const { t, locale } = useTranslation(language);
    const list = safeArr(galleries);

    if (list.length === 0) return null;

    const isEn = locale === 'en';
    const galleryTitle = isEn ? 'Photo Gallery' : 'Galeri Foto';
    const gallerySubtitle = isEn ? 'Our Moments' : 'Momen Kami';

    return (
        <section id="gallery" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{gallerySubtitle}</span>
                <h2 className="rv-section-title">{galleryTitle}</h2>
            </div>

            <div className="rv-gallery-grid">
                {list.map((item, idx) => {
                    const imgUrl = getStorageUrl(item.image_url || item.image_path || item.photo);
                    if (!imgUrl) return null;
                    return (
                        <div 
                            key={item.id || idx} 
                            className="rv-gallery-item"
                            style={{ '--i': idx % 3 }}
                        >
                            <div className="rv-gallery-img-wrapper">
                                <img 
                                    className="rv-gallery-img" 
                                    src={imgUrl} 
                                    alt={item.title || 'Wedding Gallery'} 
                                    loading="lazy"
                                />
                            </div>
                            {item.title && (
                                <p className="rv-gallery-caption">{item.title}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   8. RSVP & WISHES SECTION (Unified Form)
   ═══════════════════════════════════════ */
function RsvpWishesSection({ invitation, wishes, guest, language }) {
    const { t, locale } = useTranslation(language);
    const labels = getThemeLabels(invitation?.type, locale, invitation);
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    
    const [sharedName, setSharedName] = useState(guest?.name || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const wishesInputRef = useRef(null);

    const rsvpForm = useForm({
        sender_name: guest?.name || '',
        attendance: 'hadir',
        number_of_guests: 1,
        guest_id: guest?.id || null,
    });

    const wishForm = useForm({
        sender_name: guest?.name || '',
        message: '',
        guest_id: guest?.id || null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sharedName.trim()) return;

        if (enableRsvp) {
            rsvpForm.setData('sender_name', sharedName);
            rsvpForm.setData('attendance', attendance);
            rsvpForm.setData('number_of_guests', numGuests);

            wishForm.setData('sender_name', sharedName);
            wishForm.setData('message', message);

            const doWish = () => {
                if (enableWishes && message.trim()) {
                    wishForm.post(route('invitation.wish', invitation.slug), {
                        preserveScroll: true,
                        onSuccess: () => {
                            setMessage('');
                            setSuccess(true);
                        },
                    });
                } else {
                    setSuccess(true);
                }
            };

            rsvpForm.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: doWish,
            });
        } else if (enableWishes && message.trim()) {
            wishForm.setData('sender_name', sharedName);
            wishForm.setData('message', message);

            wishForm.post(route('invitation.wish', invitation.slug), {
                preserveScroll: true,
                onSuccess: () => {
                    setMessage('');
                    setSuccess(true);
                },
            });
        }
    };

    const isSubmitting = rsvpForm.processing || wishForm.processing;
    const recentWishes = safeArr(wishes).slice(0, 5); // max 5 items
    const isEn = locale === 'en';
    const optLabels = {
        hadir: isEn ? 'Attending' : 'Hadir',
        tidak_hadir: isEn ? 'Absent' : 'Tidak Hadir',
        masih_ragu: isEn ? 'Maybe' : 'Belum Pasti',
    };

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">Song Request & RSVP</span>
                <h2 className="rv-section-title">
                    {enableRsvp 
                        ? (t('invitation.rsvp_title') || 'Konfirmasi Kehadiran')
                        : (t('invitation.wishes_title') || 'Ucapan & Doa')}
                </h2>
            </div>

            <div className="rv-card">
                {success ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center font-medium border border-emerald-200">
                        {labels.successMsg || 'Terima kasih atas partisipasi Anda!'}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="rv-rsvp-form">
                        <div className="rv-form-group">
                            <label className="rv-form-label">{t('invitation.wishes_name') || 'Nama Anda'}</label>
                            <input
                                type="text"
                                className="rv-form-input"
                                value={sharedName}
                                onChange={(e) => setSharedName(e.target.value)}
                                placeholder={isEn ? 'Enter your name' : 'Masukkan nama lengkap'}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        {enableRsvp && (
                            <div className="rv-form-group">
                                <label className="rv-form-label">{t('invitation.rsvp_attendance') || 'Konfirmasi Kehadiran'}</label>
                                <div className="rv-form-radio-group">
                                    {['hadir', 'tidak_hadir', 'masih_ragu'].map(o => (
                                        <label key={o} className="rv-form-radio-label">
                                            <input
                                                type="radio"
                                                name="attendance"
                                                checked={attendance === o}
                                                onChange={() => setAttendance(o)}
                                                disabled={isSubmitting}
                                                className="accent-[#d95d39]"
                                            />
                                            <span>{optLabels[o]}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {enableRsvp && attendance === 'hadir' && (
                            <div className="rv-form-group">
                                <label className="rv-form-label">{t('invitation.rsvp_count') || 'Jumlah Tamu'}</label>
                                <select
                                    className="rv-form-input"
                                    value={numGuests}
                                    onChange={(e) => setNumGuests(parseInt(e.target.value, 10))}
                                    disabled={isSubmitting}
                                >
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <option key={n} value={n}>{n} {isEn ? 'Person' : 'Orang'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {enableWishes && (
                            <div className="rv-form-group relative">
                                <label className="rv-form-label">{t('invitation.wishes_message') || 'Pesan / Ucapan'}</label>
                                <WishesEmojiPicker
                                    value={message}
                                    onChange={setMessage}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                        ref={wishesInputRef}
                                        rows="2"
                                        className="rv-form-input"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t('invitation.wishes_placeholder') || 'Tulis ucapan selamat dan doa terbaik...'}
                                        required={!enableRsvp}
                                        disabled={isSubmitting}
                                    />
                                </WishesEmojiPicker>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="rv-btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner animate-spin" /> {labels.submittingLabel}
                                </>
                            ) : (
                                <>
                                    <i className="far fa-paper-plane" /> {enableRsvp ? (t('invitation.send_rsvp') || 'Kirim RSVP') : (t('invitation.send_wishes') || 'Kirim Ucapan')}
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* Wishes Comment List (Unified) */}
                {enableWishes && recentWishes.length > 0 && (
                    <div className="rv-wishes-list">
                        {recentWishes.map((w, idx) => (
                            <div key={w.id || idx} className="rv-wish-card">
                                <div className="rv-wish-header">
                                    <span className="rv-wish-sender">{w.sender_name}</span>
                                    {w.attendance && (
                                        <span className={`rv-wish-badge ${w.attendance === 'hadir' ? 'is-present' : 'is-absent'}`}>
                                            {optLabels[w.attendance] || w.attendance}
                                        </span>
                                    )}
                                </div>
                                <p className="rv-wish-message">{w.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   9. DIGITAL ENVELOPE / BANK SECTION
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, language, invitation }) {
    const { t } = useTranslation(language);
    const list = safeArr(bankAccounts).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const [copiedId, setCopiedId] = useState(null);

    // Safari & WebView safe Clipboard copy fallback (Guideline 4.6)
    const handleCopy = (text, id) => {
        const fallbackCopy = (txt) => {
            const ta = document.createElement('textarea');
            ta.value = txt;
            Object.assign(ta.style, { position: 'fixed', opacity: 0 });
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            document.body.removeChild(ta);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                })
                .catch(() => {
                    fallbackCopy(text);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                });
        } else {
            fallbackCopy(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (list.length === 0) return null;

    const isEn = language === 'en';

    return (
        <section id="bank" className="rv-section">
            <div className="rv-section-title-wrapper">
                <span className="rv-section-subtitle">{isEn ? 'Digital Gift' : 'Kado Digital'}</span>
                <h2 className="rv-section-title">{t('invitation.gift_title') || 'Amplop Digital'}</h2>
            </div>

            <div className="rv-bank-list">
                {list.map((acct, idx) => {
                    const logoName = String(acct.bank_name).toLowerCase();
                    const logoUrl = getStorageUrl(`themes/luxury-02/asset/${logoName}.png`); // Using luxury-02 assets for banks as template

                    return (
                        <div key={acct.id || idx} className="rv-bank-card">
                            <div className="rv-bank-row">
                                <div className="rv-bank-info">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                                        {acct.bank_name}
                                    </span>
                                    <div className="rv-bank-account-number">{acct.account_number}</div>
                                    <div className="rv-bank-account-name">{acct.account_name}</div>
                                </div>
                                {logoName && (
                                    <img 
                                        className="rv-bank-logo" 
                                        src={logoUrl} 
                                        alt={acct.bank_name} 
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => handleCopy(acct.account_number, acct.id || idx)}
                                className="rv-btn-copy"
                            >
                                <i className={copiedId === (acct.id || idx) ? "fas fa-check" : "far fa-copy"} />
                                {copiedId === (acct.id || idx)
                                    ? (t('invitation.gift_copied') || 'Tersalin!')
                                    : (t('invitation.gift_copy') || (isEn ? 'Copy Account' : 'Salin Rekening'))}
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   10. CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, language }) {
    const { t } = useTranslation(language);
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;
    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    const isEn = language === 'en';

    // Title Case format title (Guideline 4.8)
    const closingTitle = useMemo(() => {
        const raw = invitation?.closing_title || (isEn ? 'Thank You' : 'Terima Kasih');
        return raw.toUpperCase() === 'THANK YOU' ? 'Thank You' : 
               raw.toUpperCase() === 'TERIMA KASIH' ? 'Terima Kasih' : raw;
    }, [invitation?.closing_title, isEn]);

    return (
        <section id="closing" className="rv-section" style={{ paddingBottom: '100px' }}>
            <div className="rv-card">
                <h3 className="rv-closing-title font-serif italic">{closingTitle}</h3>
                
                {invitation?.closing_text && (
                    <p className="rv-closing-text whitespace-pre-line leading-relaxed">
                        {invitation.closing_text}
                    </p>
                )}

                <div className="rv-closing-parents">
                    <p className="font-bold mb-4">{isEn ? 'Our Families:' : 'Kami Yang Berbahagia:'}</p>
                    
                    {hasGroomParents && (
                        <div className="mb-2">
                            {isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}
                        </div>
                    )}
                    
                    {hasBrideParents && (
                        <div>
                            {isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`}
                        </div>
                    )}
                </div>

                <p className="rv-watermark">
                    {isEn ? 'Made with ❤️ by' : 'Dibuat dengan ❤️ oleh'} <br/>
                    <span className="font-black text-slate-800 tracking-wider text-[10px]">{brandName}</span>
                </p>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   PREMIUM NAVIGATION MENU
   ═══════════════════════════════════════ */
function NavigationMenu({
    invitation,
    guest,
    isOpened,
    isPlaying,
    onToggleMusic,
    scrollToSection,
    activeMenuId,
    resolvedSections,
    enableRsvp,
    enableWishes,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isFullscreen,
    toggleFullscreen,
    setShowQr
}) {
    const { t, locale } = useTranslation(invitation?.language || 'id');
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    // Auto scroll active nav button to center on narrow screens
    useEffect(() => {
        if (!isOpened || !activeMenuId) return;
        const navEl = document.querySelector('.rv-nav-menu__inner--row');
        const activeBtn = document.getElementById(`nav-btn-${activeMenuId}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeMenuId, isOpened]);

    const menuItems = useMemo(() => {
        const items = [];
        const validKeys = resolvedSections.map(s => s.section_key || s);

        resolvedSections.forEach(s => {
            const key = s.section_key || s;
            if (key === 'cover') return;

            if (key === 'opening') {
                items.push({ id: 'opening', label: t('nav.opening') || 'Pembuka', icon: 'fas fa-home' });
            } else if (key === 'bride_groom') {
                items.push({ id: 'bride_groom', label: t('nav.mempelai') || 'Mempelai', icon: 'fas fa-heart' });
            } else if (key === 'love_story') {
                items.push({ id: 'love_story', label: t('nav.kisah') || 'Kisah', icon: 'fas fa-book' });
            } else if (key === 'event') {
                items.push({ id: 'event', label: t('nav.acara') || 'Acara', icon: 'far fa-calendar-alt' });
            } else if (key === 'livestream') {
                items.push({ id: 'livestream', label: 'Live', icon: 'fas fa-video' });
            } else if (key === 'gallery') {
                items.push({ id: 'gallery', label: t('nav.galeri') || 'Galeri', icon: 'far fa-image' });
            } else if (key === 'rsvp') {
                items.push({ id: 'rsvp', label: t('nav.rsvp') || 'RSVP', icon: 'fas fa-envelope' });
            } else if (key === 'wishes') {
                items.push({ id: 'wishes', label: t('invitation.wishes_title') || 'Ucapan', icon: 'fas fa-envelope' });
            } else if (key === 'bank') {
                items.push({ id: 'bank', label: t('nav.hadiah') || 'Kado', icon: 'fas fa-gift' });
            } else if (key === 'closing') {
                items.push({ id: 'closing', label: t('nav.penutup') || 'Penutup', icon: 'fas fa-flag' });
            }
        });

        return items;
    }, [resolvedSections, enableRsvp, enableWishes, t]);

    if (!isOpened) return null;

    return (
        <>
            {/* Dock Menu Bawah */}
            <div className="rv-nav-menu">
                <div className="rv-nav-menu__inner--row">
                    {menuItems.map((item) => {
                        const isActive = activeMenuId === item.id;
                        return (
                            <button
                                key={item.id}
                                id={`nav-btn-${item.id}`}
                                data-id={item.id}
                                type="button"
                                onClick={() => scrollToSection(item.id, resolvedSections.filter(s => s !== 'cover').findIndex(s => s === item.id))}
                                className={`rv-nav-menu__item ${isActive ? 'active' : ''}`}
                                title={item.label}
                            >
                                <i className={item.icon} />
                                <span className="rv-nav-item-text">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Floating Control Side Buttons */}
            <div className="rv-floating-btns">
                {enableQr && guest && (
                    <button
                        type="button"
                        className="rv-floating-btn"
                        onClick={() => setShowQr(true)}
                        title="QR Code Check-in"
                    >
                        <i className="fas fa-qrcode" />
                    </button>
                )}

                <button
                    type="button"
                    className="rv-floating-btn"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                >
                    <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                </button>

                {invitation?.enable_auto_scroll !== false && (
                    <button
                        type="button"
                        className="rv-floating-btn"
                        onClick={() => setAutoScrollEnabled(prev => !prev)}
                        style={autoScrollEnabled ? { backgroundColor: 'var(--rv-primary)', color: '#fff' } : {}}
                        title={autoScrollEnabled ? "Pause Auto Scroll" : "Play Auto Scroll"}
                    >
                        <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-play"} />
                    </button>
                )}

                {/* Floating music volume visualizer */}
                <button
                    type="button"
                    className="rv-mini-vinyl-btn"
                    onClick={onToggleMusic}
                    title="Play/Pause Background Music"
                >
                    {isPlaying ? (
                        <div className="rv-music-waves-container">
                            <div className="global-music-waves">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    ) : (
                        <div className="rv-music-waves-container">
                            <i className="fas fa-volume-mute text-white text-[10px]" />
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME EXPORT (DYNAMIC INDEX)
   ═══════════════════════════════════════ */
export default function DynamicIndex({
    invitation,
    sections,
    brideGrooms,
    events,
    galleries,
    loveStories,
    bankAccounts,
    wishes,
    guest,
    isDemo = false
}) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Floating actions states
    const [showQr, setShowQr] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(false);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeNav, setActiveNav] = useState('opening');

    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode.startsWith('slide');

    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    const showAnimations = parseBool(invitation?.show_animations ?? true);

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    // i18n hooks
    const { t, locale } = useTranslation(activeLanguage);

    // Sync HTML Page title
    useEffect(() => {
        const bgs = safeArr(brideGrooms);
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase()));
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase()));
        if (groom?.nickname && bride?.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, brideGrooms]);

    // Handle viewport locked scrolling until opened or when in slide mode
    useEffect(() => {
        if (!isOpened || isSlideMode) {
            document.body.style.setProperty('overflow', 'hidden', 'important');
            document.documentElement.style.setProperty('overflow', 'hidden', 'important');
            document.body.style.setProperty('height', '100vh', 'important');
            document.documentElement.style.setProperty('height', '100vh', 'important');
        } else {
            document.body.style.setProperty('overflow', 'auto', '');
            document.documentElement.style.setProperty('overflow', 'auto', '');
            document.body.style.setProperty('height', 'auto', '');
            document.documentElement.style.setProperty('height', 'auto', '');
        }
        return () => {
            document.body.style.setProperty('overflow', 'auto', '');
            document.documentElement.style.setProperty('overflow', 'auto', '');
            document.body.style.setProperty('height', 'auto', '');
            document.documentElement.style.setProperty('height', 'auto', '');
        };
    }, [isOpened, isSlideMode]);

    // Intersection Observer for scroll reveal animations
    useEffect(() => {
        if (!isOpened) return;
        const observerOptions = {
            root: null,
            threshold: 0.05,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('rv-reveal-active');
                }
            });
        }, observerOptions);

        // Target content elements inside sections to avoid layout container issues
        const targetElements = document.querySelectorAll(
            '.rv-section-title-wrapper, .rv-card, .rv-polaroid, .rv-gallery-item, .rv-event-card, .rv-bank-card, .rv-cassette-countdown, .rv-quote-container'
        );
        
        targetElements.forEach(el => {
            el.classList.add('rv-reveal');
            observer.observe(el);
        });

        return () => {
            targetElements.forEach(el => observer.unobserve(el));
        };
    }, [isOpened]);

    // Track tab visibility audio play state
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const handleOpen = () => {
        setIsOpened(true);
        if (audioRef.current && musicAutoplay) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log('Autoplay blocked by browser:', e));
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (invitation?.enable_auto_scroll) {
            setAutoScrollEnabled(true);
        }
    };

    const toggleMusic = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.log('Play blocked:', e));
        }
    }, [isPlaying]);

    // Fullscreen toggle visibility listener
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

    // Resolve visible sections list
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const list = [];
        const hasRsvp = safeSections.some(sec => sec.is_visible && sec.section_key === 'rsvp');
        
        safeSections.forEach(sec => {
            if (!sec.is_visible) return;
            const key = sec.section_key;

            // Filter Duplikasi Section: Jika RSVP aktif, hilangkan seksi wishes dari list sections agar tidak memicu duplikasi form di halaman.
            if (key === 'wishes' && hasRsvp) return;

            // Mode Tanpa Foto Override
            if (key === 'gallery' && !showPhotos) return;

            list.push(key);
        });

        return list;
    }, [sections, showPhotos]);

    // Sections excluding cover
    const activeSectionsWithoutCover = useMemo(() => {
        return resolvedSections.filter(sec => sec !== 'cover');
    }, [resolvedSections]);

    // Scrollspy to set activeNav in scroll layout mode
    useEffect(() => {
        if (!isOpened || isSlideMode) return;

        const handleScroll = () => {
            let currentActive = activeSectionsWithoutCover[0] || 'opening';
            
            activeSectionsWithoutCover.forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 250 && rect.bottom > 100) {
                        currentActive = key;
                    }
                }
            });
            setActiveNav(currentActive);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, activeSectionsWithoutCover]);

    // Sync activeNav with activeSlideIdx in Slide Mode
    useEffect(() => {
        if (isSlideMode && activeSectionsWithoutCover[activeSlideIdx]) {
            let key = activeSectionsWithoutCover[activeSlideIdx];
            setActiveNav(key);
        }
    }, [isSlideMode, activeSlideIdx, activeSectionsWithoutCover]);

    // Navigation scroll to section
    const scrollTo = useCallback((id, idx) => {
        setAutoScrollEnabled(false);
        if (!isSlideMode) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            setActiveSlideIdx(idx);
        }
    }, [isSlideMode]);

    // Auto-Scroll implementation
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            // Slide transition scroll
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = activeSectionsWithoutCover.length;
                    if (prev >= count - 1) {
                        return 0; // loop back
                    }
                    return prev + 1;
                });
            }, 4000);
        } else {
            // Vertical pixel scroll
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
    }, [isOpened, autoScrollEnabled, isSlideMode, activeSectionsWithoutCover.length]);

    // Pause auto-scroll on user touch/wheel interaction
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.rv-nav-menu') || 
                e.target.closest('.rv-floating-btns') || 
                e.target.closest('.rv-qr-overlay') ||
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

    // Slide swipe navigation gestures
    const touchStart = useRef({ x: 0, y: 0 });
    const handleTouchStart = (e) => {
        if (!isSlideMode) return;
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e) => {
        if (!isSlideMode || !touchStart.current) return;
        
        const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (layoutMode === 'slide-h' || layoutMode === 'slide') {
                setAutoScrollEnabled(false);
                if (deltaX < 0) {
                    setActiveSlideIdx(prev => Math.min(prev + 1, activeSectionsWithoutCover.length - 1));
                } else {
                    setActiveSlideIdx(prev => Math.max(prev - 1, 0));
                }
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (layoutMode === 'slide-v') {
                setAutoScrollEnabled(false);
                if (deltaY < 0) {
                    setActiveSlideIdx(prev => Math.min(prev + 1, activeSectionsWithoutCover.length - 1));
                } else {
                    setActiveSlideIdx(prev => Math.max(prev - 1, 0));
                }
            }
        }
        touchStart.current = { x: 0, y: 0 };
    };

    const renderSection = (key) => {
        switch (key) {
            case 'opening':
                return (
                    <OpeningSection
                        key={key}
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        events={events}
                        language={activeLanguage}
                        showPhotos={showPhotos}
                        showAnimations={showAnimations}
                    />
                );
            case 'bride_groom':
                return (
                    <BrideGroomSection
                        key={key}
                        brideGrooms={brideGrooms}
                        language={activeLanguage}
                        showPhotos={showPhotos}
                    />
                );
            case 'love_story':
                return (
                    <LoveStorySection
                        key={key}
                        loveStories={loveStories}
                        language={activeLanguage}
                        invitation={invitation}
                    />
                );
            case 'event':
                return (
                    <EventSection
                        key={key}
                        events={events}
                        language={activeLanguage}
                    />
                );
            case 'livestream':
                return (
                    <LivestreamSection
                        key={key}
                        events={events}
                        language={activeLanguage}
                    />
                );
            case 'gallery':
                return (
                    <GallerySection
                        key={key}
                        galleries={galleries}
                        language={activeLanguage}
                    />
                );
            case 'rsvp':
                return (
                    <RsvpWishesSection
                        key={key}
                        invitation={invitation}
                        wishes={wishes}
                        guest={guest}
                        language={activeLanguage}
                    />
                );
            case 'wishes':
                return (
                    <RsvpWishesSection
                        key={key}
                        invitation={invitation}
                        wishes={wishes}
                        guest={guest}
                        language={activeLanguage}
                    />
                );
            case 'bank':
                return (
                    <BankSection
                        key={key}
                        bankAccounts={bankAccounts}
                        language={activeLanguage}
                        invitation={invitation}
                    />
                );
            case 'closing':
                return (
                    <ClosingSection
                        key={key}
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        language={activeLanguage}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ErrorBoundary>
            <Head title={invitation?.title || 'Undangan Pernikahan'} />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

            <div className={`rv-page ${!showAnimations ? 'theme-no-animations' : ''} ${isSlideMode && isOpened ? 'is-slide-mode' : ''}`}>
                
                {/* 1. COVER SCREEN */}
                {!isOpened && (
                    <CoverSection
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        guest={guest}
                        isOpened={isOpened}
                        onOpen={handleOpen}
                        isPlaying={isPlaying}
                        language={activeLanguage}
                    />
                )}

                {/* 2. MAIN SCROLLABLE/SLIDABLE CONTENT */}
                {isOpened && (
                    <main className={`rv-main ${isSlideMode ? 'rv-main-slide' : ''} ${isSlideMode ? (layoutMode === 'slide-v' ? 'rv-main--slide-v' : 'rv-main--slide-h') : ''}`}>
                        {isSlideMode ? (
                            /* Slide horizontal/vertical parallel rendering */
                            <div 
                                className={`rv-slide-wrapper rv-slide-wrapper--${layoutMode === 'slide-v' ? 'v' : 'h'}`}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                            >
                                {activeSectionsWithoutCover.map((secKey, idx) => {
                                    const isActive = idx === activeSlideIdx;
                                    const isNext = idx > activeSlideIdx;
                                    const isPrev = idx < activeSlideIdx;
                                    const statusClass = isActive ? 'is-active' : isNext ? 'is-next' : 'is-prev';
                                    
                                    return (
                                        <div
                                            key={secKey}
                                            id={secKey}
                                            className={`rv-slide-container rv-slide--${secKey} ${statusClass}`}
                                        >
                                            {renderSection(secKey)}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Scroll layout rendering */
                            <div className="rv-scroll-container">
                                {activeSectionsWithoutCover.map(secKey => (
                                    <div key={secKey} id={secKey}>
                                        {renderSection(secKey)}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Bottom dock navigation & floating controls */}
                        <NavigationMenu
                            invitation={invitation}
                            guest={guest}
                            isOpened={isOpened}
                            isPlaying={isPlaying}
                            onToggleMusic={toggleMusic}
                            scrollToSection={scrollTo}
                            activeMenuId={activeNav}
                            resolvedSections={resolvedSections}
                            enableRsvp={enableRsvp}
                            enableWishes={enableWishes}
                            autoScrollEnabled={autoScrollEnabled}
                            setAutoScrollEnabled={setAutoScrollEnabled}
                            isFullscreen={isFullscreen}
                            toggleFullscreen={toggleFullscreen}
                            setShowQr={setShowQr}
                        />
                    </main>
                )}

                {/* 3. BACKGROUND AUDIO TAG */}
                {invitation?.music_url && (
                    <audio 
                        ref={audioRef} 
                        src={invitation.music_url} 
                        loop 
                    />
                )}

                {/* 4. QR CODE CHECK-IN OVERLAY MODAL */}
                {enableQr && showQr && guest && (
                    <div className="rv-qr-overlay" onClick={() => setShowQr(false)}>
                        <div className="rv-qr-modal" onClick={e => e.stopPropagation()}>
                            <h3 className="rv-qr-title">{activeLanguage === 'en' ? 'QR Code Check-in' : 'Presensi QR Code'}</h3>
                            <p className="rv-qr-guest">{guest.name}</p>
                            <div className="rv-qr-code-box">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=d95d39&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`}
                                    alt="QR Code"
                                    className="rv-qr-img"
                                />
                            </div>
                            <p className="rv-qr-desc">
                                {activeLanguage === 'en'
                                    ? 'Show this QR code to the event crew to check in'
                                    : 'Tunjukkan kode QR ini ke petugas penerima tamu'}
                            </p>
                            <button onClick={() => setShowQr(false)} className="rv-qr-close">
                                {activeLanguage === 'en' ? 'Close' : 'Tutup'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}
