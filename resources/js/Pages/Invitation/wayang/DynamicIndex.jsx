import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Import theme assets via Vite
import ornamenAtas from './asset/ornamen-atas.png';
import ornamenBawah from './asset/ornamen-bawah.png';
import ornamenWayang from './asset/ornamen-wayang.webp';
import ornamenWayangKanan from './asset/ornamen-wayang-kanan.webp';
import gunungan from './asset/gunungan.webp';
import fallbackGroom from './asset/jawa-hitam-p-e1760493392899.jpg';
import fallbackBride from './asset/jawa-hitam-w.jpg';
import logoDana from './asset/1200px-Logo_dana_blue.svg-1-2-1-1.png';
import logoBca from './asset/BCA_logo_Bank_Central_Asia-1-3-2048x650-1-1-1-1-1.png';
import chipAtm from './asset/chip-atm-1-2-1-1-1-3.png';
import heartSvg from './asset/2764.svg';
import fallbackGallery1 from './asset/Mini-1-1-2-1024x683.jpg';
import fallbackGallery2 from './asset/Mini-1-3-e1760494660200.jpg';

const ASSETS = {
    ornamenAtas,
    ornamenBawah,
    ornamenWayang,
    ornamenWayangKanan,
    gunungan,
    fallbackGroom,
    fallbackBride,
    dana: logoDana,
    bca: logoBca,
    chip: chipAtm,
    heart: heartSvg,
    gallery1: fallbackGallery1,
    gallery2: fallbackGallery2,
};

/* ─── Helpers ─── */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function formatDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return String(dateStr).toUpperCase();
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        day: 'numeric', month: 'long', year: 'numeric'
    }).toUpperCase();
}

function formatShortDate(dateStr, lang = 'id') {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
        return dateStr;
    }
    const locale = lang === 'en' ? 'en-US' : 'id-ID';
    return date.toLocaleDateString(locale, {
        month: 'long', year: 'numeric'
    });
}

const translateChildOrder = (childOrder, gender, isEn = false) => {
    if (!childOrder) return '';
    const raw = String(childOrder).trim().toLowerCase();
    let matchedKey = null;

    if (raw.includes('tunggal') || raw.includes('only'))        matchedKey = 'tunggal';
    else if (raw.includes('bungsu') || raw.includes('youngest')) matchedKey = 'bungsu';
    else if (raw.includes('10') || raw.includes('kesepuluh'))   matchedKey = '10';
    else if (raw.includes('9') || raw.includes('kesembilan'))   matchedKey = '9';
    else if (raw.includes('8') || raw.includes('kedelapan'))    matchedKey = '8';
    else if (raw.includes('7') || raw.includes('ketujuh'))      matchedKey = '7';
    else if (raw.includes('6') || raw.includes('keenam'))       matchedKey = '6';
    else if (raw.includes('5') || raw.includes('kelima'))       matchedKey = '5';
    else if (raw.includes('4') || raw.includes('keempat'))      matchedKey = '4';
    else if (raw.includes('3') || raw.includes('ketiga'))       matchedKey = '3';
    else if (raw.includes('2') || raw.includes('kedua'))        matchedKey = '2';
    else if (raw.includes('1') || raw.includes('pertama'))      matchedKey = '1';

    const ordinalMap = {
        '1': { id: 'Pertama', en: 'First' }, '2': { id: 'Kedua', en: 'Second' },
        '3': { id: 'Ketiga', en: 'Third' },  '4': { id: 'Keempat', en: 'Fourth' },
        '5': { id: 'Kelima', en: 'Fifth' },  '6': { id: 'Keenam', en: 'Sixth' },
        '7': { id: 'Ketujuh', en: 'Seventh' },'8': { id: 'Kedelapan', en: 'Eighth' },
        '9': { id: 'Kesembilan', en: 'Ninth' },'10': { id: 'Kesepuluh', en: 'Tenth' },
        'bungsu': { id: 'Bungsu', en: 'Youngest' },
        'tunggal': { id: 'Tunggal', en: 'Only' },
    };

    const match = ordinalMap[matchedKey] || { id: childOrder, en: childOrder };
    const isWanita = String(gender).toLowerCase() === 'wanita' || String(gender).toLowerCase() === 'female';

    if (isEn) {
        const noun = isWanita ? 'Daughter' : 'Son';
        return match.en.toLowerCase() === 'only'
            ? `ONLY ${noun.toUpperCase()} OF`
            : `${String(match.en).toUpperCase()} ${noun.toUpperCase()} OF`;
    } else {
        const noun = isWanita ? 'Putri' : 'Putra';
        return match.id.toLowerCase() === 'tunggal'
            ? `${noun.toUpperCase()} TUNGGAL DARI`
            : `${noun.toUpperCase()} ${String(match.id).toUpperCase()} DARI`;
    }
};

const getStorageUrl = (url, fallback) => {
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
};

const getThemeAssetUrl = (url, fallback) => {
    if (!url) return fallback;
    if (typeof url === 'string') {
        const clean = url.toLowerCase();
        if (clean.includes('jawa-hitam-p-e1760493392899.jpg') || clean.includes('fallbackgroom')) {
            return ASSETS.fallbackGroom;
        }
        if (clean.includes('jawa-hitam-w.jpg') || clean.includes('fallbackbride')) {
            return ASSETS.fallbackBride;
        }
        if (clean.includes('mini-1-1-2-1024x683.jpg') || clean.includes('gallery1')) {
            return ASSETS.gallery1;
        }
        if (clean.includes('mini-1-3-e1760494660200.jpg') || clean.includes('gallery2')) {
            return ASSETS.gallery2;
        }
    }
    return getStorageUrl(url, fallback);
};

const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};

// Global flags that will be updated at initialization
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL WRAPPER
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

    let baseClass = 'wy-reveal--up';
    if (variant === 'zoom') baseClass = 'wy-reveal--zoom';
    else if (variant === 'left') baseClass = 'wy-reveal--left';
    else if (variant === 'right') baseClass = 'wy-reveal--right';
    else if (variant === 'down') baseClass = 'wy-reveal--down';

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
   SUB COMPONENTS
   ═══════════════════════════════════════ */

// 1. Cover / Sampul Section
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t } = useTranslation(invitation?.language || 'id');
    const couples = safeArr(brideGrooms);
    const bride = couples.find(b => b.gender === 'wanita' || String(b.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(b => b.gender === 'pria' || String(b.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};

    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    const coupleName = (bride.nickname && groom.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Bimo & Raras');

    const coverBg = getThemeAssetUrl(invitation?.cover_image, null);

    return (
        <div className={`wy-cover${isOpened ? ' wy-slide--hidden' : ''}`}>
            {globalShowPhotos && coverBg && (
                <div className="wy-cover-bg-image" style={{ backgroundImage: `url(${coverBg})` }} />
            )}
            <div className="wy-cover-wrapper">
                {/* Rotating Circle Logo Text with Javanese Gunungan in center */}
                <div className="wy-cover-circle-logo">
                    <svg viewBox="0 0 100 100">
                        <path id="circlePath" fill="none" stroke="none" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                        <text>
                            <textPath href="#circlePath" startOffset="0%">
                                • {t('invitation.wedding_of').toUpperCase()} • {t('invitation.wedding_of').toUpperCase()}
                            </textPath>
                        </text>
                    </svg>
                    <div className="wy-cover-monogram">
                        <img src={ASSETS.gunungan} style={{ width: '60px', height: 'auto', filter: 'drop-shadow(0 0 5px var(--wy-primary))' }} alt="Gunungan" />
                    </div>
                </div>

                <h1 className="wy-cover-couple">{coupleName}</h1>

                <div className="wy-cover-dear">{t('invitation.to')}</div>
                <div className="wy-cover-guest">{activeGuest.name}</div>
                <p className="wy-cover-apology">{t('invitation.dear_guest_desc')}</p>

                <button type="button" onClick={onOpen} id="tombol-buka" className="wy-btn-primary">
                    <i className="fas fa-envelope-open" /> {t('invitation.open')}
                </button>
            </div>
        </div>
    );
}

// 2. Opening Section
function OpeningSection({ invitation, brideGrooms, events, language }) {
    const { t } = useTranslation(language);
    const coverBg = getThemeAssetUrl(invitation?.cover_image, null);

    // Couples names
    const couples = safeArr(brideGrooms);
    const bride = couples.find(b => b.gender === 'wanita' || String(b.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(b => b.gender === 'pria' || String(b.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};
    const coupleName = (bride.nickname && groom.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Bimo & Raras');

    // Date and Countdown
    const targetDate = invitation?.countdown_target_date || '';
    const countdown = useCountdown(targetDate);

    const getDotDateFormat = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}. ${month}. ${year}`;
    };

    const formattedDate = getDotDateFormat(targetDate);

    return (
        <section 
            id="opening" 
            className={`wy-opening-section-hero ${globalShowPhotos && coverBg ? 'wy-has-bg' : ''}`}
            style={globalShowPhotos && coverBg ? { backgroundImage: `url(${coverBg})` } : undefined}
        >
            {globalShowPhotos && coverBg && <div className="wy-opening-overlay" />}
            
            {/* 1. Fullscreen Hero Block */}
            <div className="wy-opening-hero-block">
                <Reveal delay={100}>
                    <span className="wy-opening-hero-subtitle">
                        {invitation?.religion === 'islam' ? 'PERNIKAHAN' : 'THE WEDDING OF'}
                    </span>
                </Reveal>
                <Reveal delay={300}>
                    <h1 className="wy-opening-hero-couple">{coupleName}</h1>
                </Reveal>
                {formattedDate && (
                    <Reveal delay={500}>
                        <span className="wy-opening-hero-date">
                            {language === 'en' ? 'SAVE THE DATE' : 'SIMPAN TANGGAL'} | {formattedDate}
                        </span>
                    </Reveal>
                )}

                {/* Countdown Row */}
                {targetDate && (
                    <Reveal className="wy-opening-countdown-row" variant="zoom" delay={700}>
                        <div className="wy-opening-countdown-item">
                            <span className="wy-opening-countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                            <span className="wy-opening-countdown-label">{language === 'en' ? 'Days' : 'Hari'}</span>
                        </div>
                        <div className="wy-opening-countdown-item">
                            <span className="wy-opening-countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                            <span className="wy-opening-countdown-label">{language === 'en' ? 'Hours' : 'Jam'}</span>
                        </div>
                        <div className="wy-opening-countdown-item">
                            <span className="wy-opening-countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                            <span className="wy-opening-countdown-label">{language === 'en' ? 'Mins' : 'Menit'}</span>
                        </div>
                        <div className="wy-opening-countdown-item">
                            <span className="wy-opening-countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                            <span className="wy-opening-countdown-label">{language === 'en' ? 'Secs' : 'Detik'}</span>
                        </div>
                    </Reveal>
                )}

                {/* Arrow down indicator */}
                <div className="wy-opening-arrow-down">
                    <i className="fas fa-chevron-down" />
                </div>
            </div>

            {/* 2. Text Content Block */}
            <div className="wy-opening-content">
                <Reveal className="wy-double-border">
                    <h2 className="wy-opening-basmalah">{invitation?.religion === 'islam' ? 'Bismillahirrahmanirrahim' : 'Welcome'}</h2>
                    <div className="wy-opening-salut">
                        {invitation?.opening_text ? (
                            <p style={{ whiteSpace: 'pre-line' }}>{invitation.opening_text}</p>
                        ) : (
                            <p>Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan kami.</p>
                        )}
                    </div>
                </Reveal>

                {invitation?.opening_ayat && (
                    <Reveal className="wy-quote-box" variant="zoom" delay={200}>
                        <div className="wy-quote-arabic">
                            {invitation.opening_ayat}
                        </div>
                        {invitation.opening_ayat_translation && (
                            <div className="wy-quote-translation">
                                "{invitation.opening_ayat_translation}"
                            </div>
                        )}
                        {invitation.opening_ayat_source && (
                            <div className="wy-quote-source">
                                {invitation.opening_ayat_source}
                            </div>
                        )}
                    </Reveal>
                )}

                <div className="wy-divider-gunungan">
                    <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
                </div>
            </div>
        </section>
    );
}

// 3. Couple / Mempelai Section
function CoupleSection({ brideGrooms, language, id }) {
    const { t } = useTranslation(language);
    const couples = safeArr(brideGrooms);
    const isEn = language === 'en';

    const bride = couples.find(b => b.gender === 'wanita' || String(b.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(b => b.gender === 'pria' || String(b.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};

    const renderMempelai = (m, genderLabel) => {
        if (!m.full_name) return null;
        const isWanita = m.gender === 'wanita' || String(m.gender).toLowerCase() === 'female';
        const photoSrc = isWanita ? ASSETS.fallbackBride : ASSETS.fallbackGroom;
        const finalPhoto = getThemeAssetUrl(m.photo, photoSrc);

        return (
            <div className="wy-couple-card">
                {globalShowPhotos && m.photo && (
                    <Reveal className="wy-profile-frame-wrap" variant="zoom">
                        <img src={finalPhoto} className="wy-profile-photo" alt={m.full_name} />
                        <img src={ASSETS.gunungan} className="wy-profile-wayang-overlay" alt="Wayang Ornament" />
                    </Reveal>
                )}
                <Reveal variant="up" delay={100}>
                    <h3 className="wy-profile-name">{m.full_name}</h3>
                </Reveal>
                <Reveal variant="up" delay={200}>
                    <div className="wy-profile-child-order">
                        {translateChildOrder(m.child_order, m.gender, isEn)}
                    </div>
                </Reveal>
                <Reveal variant="up" delay={300}>
                    <div className="wy-profile-parents">
                        {isEn ? 'Beloved offspring of:' : 'Putra/Putri tercinta dari Bapak & Ibu:'} <br />
                        <strong>{m.father_name || '...'}</strong> &amp; <strong>{m.mother_name || '...'}</strong>
                    </div>
                </Reveal>
                {(m.instagram || m.instagram_username) && (
                    <Reveal variant="zoom" delay={400}>
                        <a
                            href={`https://instagram.com/${(m.instagram || m.instagram_username).replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wy-profile-instagram"
                        >
                            <i className="fab fa-instagram" /> @{(m.instagram || m.instagram_username).replace('@', '')}
                        </a>
                    </Reveal>
                )}
            </div>
        );
    };

    return (
        <section id={id || "couple"} className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{t('invitation.mempelai')}</h4>
                <h2 className="wy-section-title">{t('invitation.mempelai')}</h2>
            </Reveal>

            {/* Check gender rendering groom first then ampersand then bride */}
            {renderMempelai(groom, 'groom')}
            {groom.full_name && bride.full_name && (
                <div className="wy-couple-ampersand">&amp;</div>
            )}
            {renderMempelai(bride, 'bride')}

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 4. Countdown Hook
function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        if (!targetDate) return;
        const tick = () => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return timeLeft;
}

// 5. Countdown & Event Section
// 5. Countdown & Event Section
function EventSection({ events, invitation, language }) {
    const { t } = useTranslation(language);
    const countdown = useCountdown(invitation?.countdown_target_date);
    const listEvents = safeArr(events);

    return (
        <section id="event" className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{t('invitation.save_the_date')}</h4>
                <h2 className="wy-section-title">{t('invitation.save_the_date')}</h2>
            </Reveal>

            {/* Countdown widget */}
            {invitation?.countdown_target_date && (
                <Reveal className="wy-countdown-row" variant="zoom">
                    <div className="wy-countdown-item">
                        <span className="wy-countdown-value">{String(countdown.days).padStart(2, '0')}</span>
                        <span className="wy-countdown-label">{t('invitation.days')}</span>
                    </div>
                    <div className="wy-countdown-item">
                        <span className="wy-countdown-value">{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="wy-countdown-label">{t('invitation.hours')}</span>
                    </div>
                    <div className="wy-countdown-item">
                        <span className="wy-countdown-value">{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="wy-countdown-label">{t('invitation.minutes')}</span>
                    </div>
                    <div className="wy-countdown-item">
                        <span className="wy-countdown-value">{String(countdown.seconds).padStart(2, '0')}</span>
                        <span className="wy-countdown-label">{t('invitation.seconds')}</span>
                    </div>
                </Reveal>
            )}

            {/* Events Cards */}
            {listEvents.map((ev, idx) => {
                return (
                    <Reveal className="wy-event-card" variant={idx % 2 === 0 ? 'left' : 'right'} key={idx}>
                        <div className="wy-event-name">{ev.event_name}</div>
                        
                        <div className="wy-event-date-box">
                            <div className="wy-event-date">{formatDate(ev.event_date, language)}</div>
                            <div className="wy-event-time">
                                {ev.start_time} - {ev.end_time || 'Selesai'} {ev.timezone || 'WIB'}
                            </div>
                        </div>

                        <div className="wy-event-venue">{ev.venue_name}</div>
                        <p className="wy-event-address">{ev.venue_address}</p>

                        {ev.gmaps_link && (
                            <div className="wy-event-actions">
                                <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="wy-btn-secondary">
                                    <i className="fas fa-map-marker-alt" /> GOOGLE MAPS
                                </a>
                            </div>
                        )}
                    </Reveal>
                );
            })}

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 5.1 Live Streaming Section
function LiveStreamingSection({ events, invitation, language }) {
    const { t } = useTranslation(language);
    const eventList = safeArr(events);
    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
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
    
    const isEn = language === 'en';
    
    return (
        <section id="livestream" className="wy-section wy-livestream-section">
            <Reveal>
                <h4 className="wy-section-subtitle">Live Streaming</h4>
                <h2 className="wy-section-title">{isEn ? 'Virtual Celebration' : 'Siaran Langsung'}</h2>
            </Reveal>

            <Reveal className="wy-double-border" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
                <h3 className="wy-livestream-date">
                    {formatDate(primaryEvent?.event_date, language)}
                </h3>
                <p className="wy-livestream-time">
                    {primaryEvent?.start_time} - {primaryEvent?.end_time === '23:59:00' ? 'Selesai' : primaryEvent?.end_time} {primaryEvent?.timezone || 'WIB'}
                </p>
                <p className="wy-livestream-text">
                    {isEn 
                        ? 'We will broadcast the happy moments of our wedding procession virtually through the following platforms.'
                        : 'Kami mengundang Anda untuk menyaksikan momen bahagia prosesi pernikahan kami secara virtual melalui platform berikut.'}
                </p>
                <div className="wy-livestream-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%' }}>
                    {streamsList.map((stream, idx) => (
                        <a 
                            key={idx}
                            href={stream.url}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="wy-btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '240px', gap: '8px' }}
                        >
                            <i className="fas fa-video" /> JOIN {stream.platform.toUpperCase()}
                        </a>
                    ))}
                </div>
            </Reveal>

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 6.1 Timeline Card with Scroll Observer (behaves like hover when scrolled over)
function TimelineCard({ story, language }) {
    const ref = useRef(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsActive(entry.isIntersecting);
        }, {
            rootMargin: '-30% 0px -30% 0px', // Active when in center 40% of viewport
            threshold: 0
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`wy-timeline-card ${isActive ? 'is-active' : ''}`}>
            <div className="wy-timeline-dot" />
            {story.story_date && (
                <div className="wy-timeline-date">{formatDate(story.story_date, language)}</div>
            )}
            <h3 className="wy-timeline-title">{story.title}</h3>
            {story.description && (
                <p className="wy-timeline-desc">{story.description}</p>
            )}
        </div>
    );
}

// 6. Timeline Section (Love Story)
function TimelineSection({ loveStories, invitation, language }) {
    const { t } = useTranslation(language);
    const stories = loveStories?.length > 0 ? loveStories : [
        { title: 'Pertama Bertemu', story_date: '2023-11-20', description: 'Pertama kali dipertemukan di Jogja.' },
        { title: 'Chapter Two: Tunangan', story_date: '2025-05-15', description: 'Memutuskan untuk bertunangan secara resmi.' }
    ];

    return (
        <section id="love_story" className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{language === 'en' ? 'Our Love Journey' : 'Kisah Perjalanan'}</h4>
                <h2 className="wy-section-title">{language === 'en' ? 'LOVE STORY' : 'KISAH CINTA'}</h2>
            </Reveal>

            <div className="wy-timeline">
                {stories.map((story, i) => (
                    <TimelineCard key={i} story={story} language={language} />
                ))}
            </div>

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 7. Gallery Section
function GallerySection({ galleries, language }) {
    const { t } = useTranslation(language);
    const [selectedImage, setSelectedImage] = useState(null);

    const listGalleries = galleries?.length > 0 ? galleries : [
        { image_url: ASSETS.gallery1 },
        { image_url: ASSETS.gallery2 }
    ];

    if (!globalShowPhotos) return null; // Hide gallery completely in photo-less mode

    return (
        <section id="gallery" className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{t('invitation.gallery')}</h4>
                <h2 className="wy-section-title">{t('invitation.gallery')}</h2>
            </Reveal>

            <div className="wy-gallery-grid">
                {listGalleries.map((gal, idx) => {
                    const finalImg = getThemeAssetUrl(gal.image_url || gal.image_path, ASSETS.gallery1);
                    return (
                        <Reveal className="wy-gallery-item" variant="zoom" key={idx} delay={idx * 50}>
                            <img src={finalImg} alt={gal.caption || 'Gallery Image'} onClick={() => setSelectedImage(finalImg)} />
                        </Reveal>
                    );
                })}
            </div>

            {selectedImage && (
                <div className="wy-lightbox">
                    <button className="wy-lightbox-close" onClick={() => setSelectedImage(null)}>
                        <i className="fas fa-times" />
                    </button>
                    <img src={selectedImage} className="wy-lightbox-img" alt="Lightbox Preview" />
                </div>
            )}

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 8. RSVP & Wishes Section
function RsvpSection({ wishes, invitation, guest, language }) {
    const { t } = useTranslation(language);
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const activeGuest = guest || { name: '', id: null };
    const isEn = language === 'en';

    const [success, setSuccess] = useState(false);
    const [isSending, setIsSending] = useState(false);

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

    const handleNameChange = (val) => {
        rsvpForm.setData('sender_name', val);
        wishForm.setData('sender_name', val);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(false);
        setIsSending(true);

        const doWish = () => {
            if (enableWishes && wishForm.data.message.trim()) {
                wishForm.post(route('invitation.wish', invitation.slug), {
                    preserveScroll: true,
                    onSuccess: () => { 
                        wishForm.reset('message');
                        setSuccess(true); 
                        setIsSending(false);
                    },
                    onError: () => {
                        setIsSending(false);
                    }
                });
            } else {
                setSuccess(true);
                setIsSending(false);
            }
        };

        if (enableRsvp) {
            rsvpForm.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: () => {
                    doWish();
                },
                onError: () => {
                    setIsSending(false);
                }
            });
        } else {
            doWish();
        }
    };

    const isSubmitting = isSending || rsvpForm.processing || wishForm.processing;
    const recentWishes = safeArr(wishes).slice(0, 5);
    const sectionTitle = enableRsvp && enableWishes
        ? (isEn ? 'RSVP & Wishes' : 'Konfirmasi & Ucapan')
        : enableRsvp
            ? (isEn ? 'Attendance Confirmation' : 'Konfirmasi Kehadiran')
            : (isEn ? 'Wishes & Prayers' : 'Ucapan & Doa');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id="rsvp" className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{sectionTitle}</h4>
                <h2 className="wy-section-title">{sectionTitle}</h2>
            </Reveal>

            <Reveal className="wy-double-border">
                <form onSubmit={handleSubmit} className="wy-form">
                    {/* Nama */}
                    <div className="wy-form-group">
                        <label className="wy-form-label">{isEn ? 'Your Name' : 'Nama'}</label>
                        <input
                            type="text"
                            required
                            className="wy-form-input"
                            value={rsvpForm.data.sender_name}
                            onChange={e => handleNameChange(e.target.value)}
                            readOnly={!!activeGuest.name}
                        />
                    </div>

                    {/* Konfirmasi Kehadiran - hanya jika RSVP aktif */}
                    {enableRsvp && (
                        <div className="wy-form-group">
                            <label className="wy-form-label">{isEn ? 'Attendance' : 'Konfirmasi Kehadiran'}</label>
                            <select
                                className="wy-form-select"
                                value={rsvpForm.data.attendance}
                                onChange={e => rsvpForm.setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{isEn ? 'Attending' : 'Hadir'}</option>
                                <option value="tidak_hadir">{isEn ? 'Not Attending' : 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum Pasti'}</option>
                            </select>
                        </div>
                    )}

                    {/* Jumlah Tamu - hanya jika RSVP aktif DAN hadir */}
                    {enableRsvp && rsvpForm.data.attendance === 'hadir' && (
                        <div className="wy-form-group">
                            <label className="wy-form-label">{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                            <select
                                className="wy-form-select"
                                value={rsvpForm.data.number_of_guests}
                                onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value) || 1)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                    )}

                    {/* Ucapan & Doa - hanya jika Wishes aktif */}
                    {enableWishes && (
                        <div className="wy-form-group">
                            <label className="wy-form-label">{isEn ? 'Wishes & Prayers' : 'Ucapan & Doa'}</label>
                            <textarea
                                rows="3"
                                className="wy-form-textarea"
                                value={wishForm.data.message}
                                onChange={e => wishForm.setData('message', e.target.value)}
                                placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan dan doa restu...'}
                                required={!enableRsvp}
                            />
                        </div>
                    )}

                    <button type="submit" disabled={isSubmitting} className="wy-form-btn-submit">
                        {isSubmitting ? '...' : (isEn ? 'Send' : 'Kirim')}
                    </button>

                    {success && (
                        <p style={{ color: 'var(--wy-primary)', marginTop: '12px', fontSize: '13px', textAlign: 'center' }}>
                            ✓ {isEn ? 'Successfully sent!' : 'Berhasil terkirim!'}
                        </p>
                    )}
                </form>
            </Reveal>

            {/* Daftar Ucapan - max 5, scrollable */}
            {enableWishes && recentWishes.length > 0 && (
                <Reveal>
                    <div className="wy-wishes-board" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                        {recentWishes.map((w, wIdx) => (
                            <div className="wy-wish-card" key={wIdx}>
                                <div className="wy-wish-header">
                                    <span className="wy-wish-sender">{w.sender_name}</span>
                                    <span className="wy-wish-time">
                                        {w.created_at ? new Date(w.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <p className="wy-wish-message">{w.message}</p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            )}

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 9. Gift Section (E-Amplop)
function GiftSection({ bankAccounts, language }) {
    const { t } = useTranslation(language);
    const [copied, setCopied] = useState(null);
    const accounts = safeArr(bankAccounts);

    const copyToClipboard = (text, id) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    setCopied(id);
                    setTimeout(() => setCopied(null), 2000);
                })
                .catch(() => fallbackCopy(text, id));
        } else {
            fallbackCopy(text, id);
        }
    };

    const fallbackCopy = (text, id) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, {
            position: 'fixed', top: 0, left: 0, width: '2em', height: '2em',
            padding: 0, border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent'
        });
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
            if (document.execCommand('copy')) {
                setCopied(id);
                setTimeout(() => setCopied(null), 2000);
            }
        } catch (e) {}
        sel.removeAllRanges();
        document.body.removeChild(ta);
    };

    if (accounts.length === 0) return null;

    return (
        <section id="bank" className="wy-section">
            <Reveal>
                <h4 className="wy-section-subtitle">{t('invitation.gift_title')}</h4>
                <h2 className="wy-section-title">{t('invitation.gift_title')}</h2>
            </Reveal>

            {accounts.map((acc, index) => {
                const isBca = String(acc.bank_name).toLowerCase().includes('bca');
                const isDana = String(acc.bank_name).toLowerCase().includes('dana');
                const logoSrc = isBca ? ASSETS.bca : (isDana ? ASSETS.dana : null);

                return (
                    <Reveal className="wy-gift-card" variant="zoom" key={index} delay={index * 100}>
                        <div className="wy-gift-card-header">
                            {logoSrc ? (
                                <img src={logoSrc} className="wy-bank-logo" alt={acc.bank_name} />
                            ) : (
                                <span style={{ fontWeight: 'bold', color: 'var(--wy-primary)' }}>{acc.bank_name}</span>
                            )}
                            <img src={ASSETS.chip} className="wy-atm-chip" alt="ATM Chip" />
                        </div>
                        <div className="wy-account-number-box">
                            <span className="wy-account-number">{acc.account_number}</span>
                            <button
                                type="button"
                                className="wy-btn-copy"
                                onClick={() => copyToClipboard(acc.account_number, index)}
                                title="Salin nomor rekening"
                            >
                                {copied === index ? (
                                    <i className="fas fa-check" style={{ color: '#3D9A62' }} />
                                ) : (
                                    <i className="fas fa-copy" />
                                )}
                            </button>
                        </div>
                        <div className="wy-account-name">ACCOUNT NAME</div>
                        <div className="wy-account-holder">{acc.account_name}</div>
                    </Reveal>
                );
            })}

            <div className="wy-divider-gunungan">
                <img src={ASSETS.gunungan} className="wy-divider-gunungan-img" alt="Divider" />
            </div>
        </section>
    );
}

// 10. Footer Section & Watermark
function FooterSection({ invitation, brideGrooms, language }) {
    const { t } = useTranslation(language);
    const isEn = language === 'en';
    const couples = safeArr(brideGrooms);
    const bride = couples.find(bg => bg.gender === 'wanita' || String(bg.gender).toLowerCase() === 'female') || couples[0] || {};
    const groom = couples.find(bg => bg.gender === 'pria' || String(bg.gender).toLowerCase() === 'male') || couples[1] || couples[0] || {};

    const displayNames = (bride.nickname && groom.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Mempelai');

    const groomFather = groom.father_name;
    const groomMother = groom.mother_name;
    const brideFather = bride.father_name;
    const brideMother = bride.mother_name;

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    return (
        <section id="closing" className="wy-section">
            <Reveal className="wy-closing-quote">
                {invitation?.closing_text ? (
                    <p style={{ whiteSpace: 'pre-line' }}>{invitation.closing_text}</p>
                ) : (
                    <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.</p>
                )}
            </Reveal>

            {/* Signature block */}
            <Reveal className="wy-signature" variant="zoom">
                <div className="wy-signature-title">
                    {isEn ? 'We Who Are Joyful,' : 'Kami Yang Berbahagia,'}
                </div>
                <div className="wy-signature-families">
                    {hasGroomParents && (
                        <div>
                            {isEn
                                ? `Family of Mr. ${groomFather || '...'} & Mrs. ${groomMother || '...'}`
                                : `Kel. Bapak ${groomFather || '...'} & Ibu ${groomMother || '...'}`
                            }
                        </div>
                    )}
                    {hasBrideParents && (
                        <div>
                            {isEn
                                ? `Family of Mr. ${brideFather || '...'} & Mrs. ${brideMother || '...'}`
                                : `Kel. Bapak ${brideFather || '...'} & Ibu ${brideMother || '...'}`
                            }
                        </div>
                    )}
                    {!hasGroomParents && !hasBrideParents && (
                        <div>
                            {isEn ? 'Both Families of the Couple' : 'Keluarga Besar Kedua Mempelai'}
                        </div>
                    )}
                </div>
                <div className="wy-signature-couple">
                    {displayNames}
                </div>
            </Reveal>

            {/* Reseller Branding Watermark */}
            <Reveal className="wy-watermark">
                Made with ❤️ by {invitation?.user?.reseller_settings?.brand_name || invitation?.user?.reseller?.reseller_settings?.brand_name || 'Groovy Digital'}
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT EXPORT
   ═══════════════════════════════════════ */
export default function WayangTheme({
    invitation,
    sections,
    brideGrooms,
    events,
    galleries,
    loveStories,
    bankAccounts,
    guest,
    wishes
}) {
    const language = invitation?.language || 'id';
    const { t } = useTranslation(language);
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [activeSection, setActiveSection] = useState('opening');
    const audioRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

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

    // Read config settings
    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v';
    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    // Support globally disabling photo assets and scroll animations
    globalShowPhotos = parseBool(invitation?.show_photos !== false);
    globalShowAnimations = parseBool(invitation?.show_animations !== false);

    // Initialize HTML body scroll state
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleOpen = () => {
        setIsOpened(true);
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        }
        document.body.style.overflow = 'auto';
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {});
        }
    };

    // Slide Swiper details
    const validKeys = [
        'hero', 'opening',
        'couple', 'bride_groom',
        'love_story',
        'event',
        'livestream',
        'gallery',
        'rsvp',
        'bank',
        'closing', 'footer'
    ];

    // resolvedSections must be defined BEFORE scrollspy useEffect
    const resolvedSections = useMemo(() => {
        let base = safeArr(sections).length > 0
            ? safeArr(sections)
            : [
                { section_key: 'opening', sort_order: 1, is_visible: true },
                { section_key: 'couple', sort_order: 2, is_visible: true },
                { section_key: 'love_story', sort_order: 3, is_visible: true },
                { section_key: 'event', sort_order: 4, is_visible: true },
                { section_key: 'livestream', sort_order: 5, is_visible: true },
                { section_key: 'gallery', sort_order: 6, is_visible: true },
                { section_key: 'rsvp', sort_order: 7, is_visible: true },
                { section_key: 'bank', sort_order: 8, is_visible: true },
                { section_key: 'closing', sort_order: 9, is_visible: true },
            ];

        // Check if livestream has active stream URLs
        const hasLivestreamInBase = base.some(s => s.section_key === 'livestream');
        const eventList = safeArr(events);
        const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
        
        const streamsList = [];
        if (primaryEvent?.streaming_url) {
            streamsList.push(primaryEvent.streaming_url);
        }
        if (Array.isArray(primaryEvent?.streamings)) {
            primaryEvent.streamings.forEach(s => {
                if (s.url) streamsList.push(s.url);
            });
        }
        const hasStreamUrl = streamsList.length > 0;

        if (!hasLivestreamInBase && hasStreamUrl) {
            const eventSec = base.find(s => s.section_key === 'event');
            const eventSortOrder = eventSec ? eventSec.sort_order : 4;
            base = [
                ...base,
                { section_key: 'livestream', sort_order: eventSortOrder + 0.5, is_visible: true }
            ];
        }

        // If photo-less mode is active, filter out gallery section
        // If no active streams exist, filter out livestream section to prevent rendering empty slides
        return base
            .filter(s => s.is_visible && validKeys.includes(s.section_key))
            .filter(s => s.section_key !== 'livestream' || hasStreamUrl)
            .filter(s => globalShowPhotos ? true : s.section_key !== 'gallery')
            .filter(s => s.section_key !== 'love_story' || (loveStories && loveStories.length > 0))
            .filter(s => s.section_key !== 'gallery' || (galleries && galleries.length > 0))
            .filter(s => s.section_key !== 'bank' || (bankAccounts && bankAccounts.length > 0))
            .sort((a, b) => a.sort_order - b.sort_order);
    }, [sections, invitation, events]);

    // Auto-Scroll implementation
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(
        invitation?.enable_auto_scroll !== false
    );

    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;
        let timer = null;
        let slideTicks = 0;

        if (isSlideMode) {
            timer = setInterval(() => {
                const activeSlide = document.querySelector('.wy-slide-container.is-active');
                if (activeSlide) {
                    const maxScroll = activeSlide.scrollHeight - activeSlide.clientHeight;
                    if (maxScroll > 10 && activeSlide.scrollTop < maxScroll - 3) {
                        activeSlide.scrollBy(0, 1);
                        slideTicks = 0; // Reset ticks while scrolling internally
                    } else {
                        // Count ticks to auto-advance once at bottom or on short slides
                        slideTicks += 30;
                        if (slideTicks >= 4000) { // Stay 4 seconds
                            slideTicks = 0;
                            setSlideIdx(prev => {
                                const count = resolvedSections.length;
                                if (prev >= count - 1) return 0;
                                return prev + 1;
                            });
                        }
                    }
                }
            }, 30);
        } else {
            timer = setInterval(() => {
                window.scrollBy(0, 1);
                document.documentElement.scrollTop += 1;
                const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
                if (isBottom) setAutoScrollEnabled(false);
            }, 25);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections]);

    // Scrollspy to automatically update active section on window scroll
    useEffect(() => {
        if (isSlideMode || !isOpened) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const section of resolvedSections) {
                let elementId = section.section_key;
                if (elementId === 'bride_groom' && !document.getElementById('bride_groom')) {
                    elementId = 'couple';
                }
                const el = document.getElementById(elementId);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.section_key);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Run once initially
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections]);

    // Active Slide Index in Swipe Mode
    const [slideIdx, setSlideIdx] = useState(0);

    // Sync activeSection with slideIdx to prevent stale closure bugs
    useEffect(() => {
        if (isSlideMode && resolvedSections[slideIdx]) {
            setActiveSection(resolvedSections[slideIdx].section_key);
        }
    }, [isSlideMode, slideIdx, resolvedSections]);

    // Auto-scroll active menu item into viewport (centers the active bottom navigation menu item)
    useEffect(() => {
        if (!activeSection) return;
        const activeEl = document.querySelector(`.wy-nav-item--active`);
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeSection]);

    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: true, atBottom: true });

    const nextSlide = () => {
        setSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const handlePointerDown = (clientX, clientY, target) => {
        const scrollable = target?.closest('.wy-slide-container');
        touchStart.current = {
            x: clientX,
            y: clientY,
            time: Date.now(),
            atTop: scrollable ? scrollable.scrollTop <= 5 : true,
            atBottom: scrollable
                ? scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop <= 5
                : true,
        };
    };

    const handlePointerUp = (clientX, clientY) => {
        const diffY = clientY - touchStart.current.y;
        const diffX = clientX - touchStart.current.x;
        
        if (layoutMode === 'slide-v') {
            if (Math.abs(diffY) > 50) {
                if (diffY < 0 && touchStart.current.atBottom) nextSlide();
                if (diffY > 0 && touchStart.current.atTop) prevSlide();
            }
        } else if (layoutMode === 'slide-h') {
            if (Math.abs(diffX) > 50) {
                if (diffX < 0) nextSlide();
                if (diffX > 0) prevSlide();
            }
        }
    };

    const componentMap = {
        'opening':    <OpeningSection invitation={invitation} brideGrooms={brideGrooms} events={events} language={language} />,
        'hero':       <OpeningSection invitation={invitation} brideGrooms={brideGrooms} events={events} language={language} />,
        'couple':     <CoupleSection id="couple" brideGrooms={brideGrooms} language={language} />,
        'bride_groom':<CoupleSection id="bride_groom" brideGrooms={brideGrooms} language={language} />,
        'love_story': <TimelineSection loveStories={loveStories} invitation={invitation} language={language} />,
        'event':      <EventSection events={events} invitation={invitation} language={language} />,
        'livestream': <LiveStreamingSection events={events} invitation={invitation} language={language} />,
        'gallery':    <GallerySection galleries={galleries} language={language} />,
        'rsvp':       <RsvpSection wishes={wishes} invitation={invitation} guest={guest} language={language} />,
        'bank':       <GiftSection bankAccounts={bankAccounts} language={language} />,
        'closing':    <FooterSection invitation={invitation} brideGrooms={brideGrooms} language={language} />,
        'footer':     <FooterSection invitation={invitation} brideGrooms={brideGrooms} language={language} />,
    };

    const renderSection = (section) => {
        const component = componentMap[section.section_key];
        if (!component) return null;
        return <React.Fragment key={section.section_key}>{component}</React.Fragment>;
    };

    // Smooth Scroll to Section (for Scroll Layout)
    const scrollToSection = (key) => {
        setAutoScrollEnabled(false); // Stop auto-scroll when user manually navigates
        setActiveSection(key);
        const el = document.getElementById(key);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Get dynamic display text for bottom navbar items
    const getNavLabel = (key) => {
        switch (key) {
            case 'opening':
            case 'hero':
                return t('nav.opening') || 'Cover';
            case 'couple':
            case 'bride_groom':
                return t('nav.mempelai') || 'Couple';
            case 'love_story':
                return t('nav.kisah') || 'Story';
            case 'event':
                return t('nav.acara') || 'Event';
            case 'livestream':
                return 'Live';
            case 'gallery':
                return t('nav.galeri') || 'Gallery';
            case 'rsvp':
                return t('nav.rsvp') || 'RSVP';
            case 'bank':
                return t('nav.hadiah') || 'Gift';
            case 'closing':
            case 'footer':
                return t('nav.penutup') || 'Closing';
            default:
                return key.toUpperCase();
        }
    };

    // Icons mapping for bottom nav
    const getNavIcon = (key) => {
        switch (key) {
            case 'opening':
            case 'hero':
                return 'fa-heart';
            case 'couple':
            case 'bride_groom':
                return 'fa-users';
            case 'love_story':
                return 'fa-history';
            case 'event':
                return 'fa-calendar-alt';
            case 'livestream':
                return 'fa-video';
            case 'gallery':
                return 'fa-images';
            case 'rsvp':
                return 'fa-paper-plane';
            case 'bank':
                return 'fa-gift';
            case 'closing':
            case 'footer':
                return 'fa-bookmark';
            default:
                return 'fa-circle';
        }
    };

    return (
        <div className={`wy-page ${!globalShowAnimations ? 'wy-no-animations' : ''}`}>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan Tema Wayang'}</title>
            </Head>

            {/* Particle Dust effect */}
            {invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect
                    type={invitation.particle_type}
                    count={invitation.particle_count || 30}
                    speed={invitation.particle_speed || 'normal'}
                />
            )}

            {/* Background Audio */}
            <audio ref={audioRef} loop preload="auto" playsInline>
                <source src={invitation?.music_url || '/audio/backsound.mp3'} type="audio/mpeg" />
            </audio>

            {/* Static top and bottom ornaments */}
            <div className="wy-ornament-header" />
            <div className="wy-ornament-footer" />

            {/* Side Wayang visuals */}
            <img src={ASSETS.ornamenWayang} className="wy-side-wayang-left" alt="Wayang Left" />
            <img src={ASSETS.ornamenWayangKanan} className="wy-side-wayang-right" alt="Wayang Right" />

            {/* 1. COVER OVERLAY */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={guest}
                isOpened={isOpened}
                onOpen={handleOpen}
            />

            {/* MAIN CONTENT AREA */}
            {isOpened && (
                <div className={`wy-container ${isSlideMode ? 'wy-container--slide' : ''}`}>
                    {isSlideMode ? (
                        /* SWIPE LAYOUT */
                        <div
                            className={`wy-main-slide ${layoutMode === 'slide-h' ? 'wy-main-slide--h' : 'wy-main-slide--v'}`}
                            onTouchStart={e => handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, e.target)}
                            onTouchEnd={e => handlePointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
                            onMouseDown={e => handlePointerDown(e.clientX, e.clientY, e.target)}
                            onMouseUp={e => handlePointerUp(e.clientX, e.clientY)}
                        >
                            {resolvedSections.map((section, idx) => {
                                let slideClass = 'wy-slide-container';
                                if (idx === slideIdx) slideClass += ' is-active';
                                else if (idx > slideIdx) slideClass += ' is-next';
                                else slideClass += ' is-prev';

                                return (
                                    <div key={section.section_key} className={slideClass}>
                                        {renderSection(section)}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* SCROLL LAYOUT */
                        <main className="wy-scroll-container">
                            {resolvedSections.map(section => renderSection(section))}
                        </main>
                    )}

                    {/* DYNAMIC BOTTOM NAVIGATION */}
                    {invitation?.menu_position !== 'none' && (
                        <nav className="wy-nav">
                            {resolvedSections.map((sec) => {
                                const isCurrent = activeSection === sec.section_key;
                                return (
                                    <button
                                        type="button"
                                        key={sec.section_key}
                                        onClick={() => {
                                            if (isSlideMode) {
                                                const targetIdx = resolvedSections.findIndex(s => s.section_key === sec.section_key);
                                                if (targetIdx !== -1) {
                                                    setSlideIdx(targetIdx);
                                                    setActiveSection(sec.section_key);
                                                }
                                            } else {
                                                scrollToSection(sec.section_key);
                                            }
                                        }}
                                        className={`wy-nav-item ${isCurrent ? 'wy-nav-item--active' : ''}`}
                                    >
                                        <i className={`fas ${getNavIcon(sec.section_key)}`} />
                                        <span className="wy-nav-item-text">{getNavLabel(sec.section_key)}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    )}

                    {/* FLOATING ACTION TOOLBAR */}
                    <div 
                        className="wy-floating-group"
                        style={invitation?.menu_position === 'none' ? { bottom: '24px' } : undefined}
                    >
                        {/* Fullscreen Toggle */}
                        <button
                            type="button"
                            className="wy-floating-btn"
                            onClick={toggleFullscreen}
                            style={isFullscreen ? { backgroundColor: 'var(--wy-primary)', color: '#000' } : undefined}
                            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
                        >
                            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                        </button>

                        {/* Auto-Scroll Toggle */}
                        <button
                            type="button"
                            className="wy-floating-btn"
                            onClick={() => setAutoScrollEnabled(prev => !prev)}
                            style={autoScrollEnabled && isSlideMode ? { backgroundColor: 'var(--wy-primary)', color: '#000' } : undefined}
                            title={autoScrollEnabled ? (isSlideMode ? 'Hentikan Geser Otomatis' : 'Hentikan Gulir Otomatis') : (isSlideMode ? 'Mulai Geser Otomatis' : 'Mulai Gulir Otomatis')}
                        >
                            <i className={`fas ${autoScrollEnabled ? 'fa-pause' : 'fa-play'}`} />
                        </button>

                        {/* QR Code Checkin Button */}
                        {enableQr && activeGuest && (
                            <button
                                type="button"
                                className="wy-floating-btn"
                                onClick={() => setShowQr(true)}
                                title="QR Code Checkin"
                            >
                                <i className="fas fa-qrcode" />
                            </button>
                        )}

                        {/* Background Music Toggler */}
                        {invitation?.music_url !== 'none' && (
                            <button
                                type="button"
                                className="wy-floating-btn"
                                onClick={togglePlay}
                                style={isPlaying ? { animation: 'wy-rotating 12s linear infinite' } : undefined}
                                title={isPlaying ? 'Hentikan Musik' : 'Putar Musik'}
                            >
                                <i className={`fas ${isPlaying ? 'fa-music' : 'fa-volume-mute'}`} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* QR CODE OVERLAY MODAL */}
            {showQr && (
                <div className="wy-qr-overlay" onClick={() => setShowQr(false)}>
                    <div className="wy-qr-card" onClick={e => e.stopPropagation()}>
                        <button type="button" className="wy-qr-close" onClick={() => setShowQr(false)}>
                            <i className="fas fa-times" />
                        </button>
                        <h3 className="wy-qr-title">QR Code Check-in</h3>
                        <p className="wy-qr-desc">Tunjukkan QR Code ini kepada petugas penerima tamu di lokasi acara untuk konfirmasi kehadiran cepat.</p>
                        
                        <div className="wy-qr-code-wrapper">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${
                                    encodeURIComponent(`${window.location.origin}/u/${invitation.slug}/checkin?to=${activeGuest.slug}`)
                                }`}
                                className="wy-qr-code-img"
                                alt="Checkin QR Code"
                            />
                        </div>
                        <div className="wy-qr-guest-name">{activeGuest.name}</div>
                    </div>
                </div>
            )}

            {/* CSS Animation Keyframes */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes wy-rotating {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}} />
        </div>
    );
}
