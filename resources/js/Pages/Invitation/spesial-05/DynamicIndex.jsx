import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo } from 'react';;
import DressCodeBlock from '@/Components/DressCodeBlock';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

/* ═══════════════════════════════════════
   STANDARD HELPERS & UTILITIES
   ═══════════════════════════════════════ */
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

function pad2(n) {
    return String(n).padStart(2, '0');
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

function parseEventDate(dateString, locale) {
    if (!dateString) return { dayNum: '', dayName: '', monthName: '', year: '' };
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { dayNum: '', dayName: '', monthName: '', year: '' };
    
    const dayNum = String(d.getDate()).padStart(2, '0');
    const dayName = d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long' });
    const monthName = d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { month: 'long' });
    const year = d.getFullYear();
    
    return { dayNum, dayName, monthName, year };
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

const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    Object.assign(ta.style, { position: 'fixed', opacity: 0, top: 0, left: 0 });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
};

function formatDate(dateString, locale) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const calculate = () => {
            const difference = +new Date(targetDate) - +new Date();
            let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                left = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            setTimeLeft(left);
        };
        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
}

function CountdownTimer({ targetDate }) {
    const { t } = useTranslation();
    const timeLeft = useCountdown(targetDate);
    
    return (
        <div className="sp05-countdown-wrapper select-none">
            <div className="sp05-countdown">
                <div className="sp05-countdown-item">
                    <span className="sp05-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="sp05-countdown-label">{t('invitation.days')}</span>
                </div>
                <span className="sp05-countdown-colon">:</span>
                <div className="sp05-countdown-item">
                    <span className="sp05-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="sp05-countdown-label">{t('invitation.hours')}</span>
                </div>
                <span className="sp05-countdown-colon">:</span>
                <div className="sp05-countdown-item">
                    <span className="sp05-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="sp05-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <span className="sp05-countdown-colon">:</span>
                <div className="sp05-countdown-item">
                    <span className="sp05-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="sp05-countdown-label">{t('invitation.seconds')}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="p-8 text-center bg-red-50 text-red-800 rounded-xl my-4 border border-red-200">
                <h2 className="text-lg font-bold mb-2">Terjadi kesalahan pada rendering seksi tema.</h2>
                <pre className="text-xs overflow-x-auto bg-white p-3 rounded border text-left">{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

// Global configs updated by component
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   SCROLL REVEAL EFFECT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setVisible(true);
                obs.unobserve(el);
            }
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div className={className}>{children}</div>;
    }

    let baseClass = 'sp05-ani-hidden';
    let revealClass = 'sp05-ani-fadeUp';
    if (variant === 'zoom') {
        revealClass = 'sp05-ani-scaleIn';
    } else if (variant === 'left') {
        revealClass = 'sp05-ani-fadeLeft';
    } else if (variant === 'right') {
        revealClass = 'sp05-ani-fadeRight';
    }

    return (
        <div
            ref={ref}
            className={`${className} ${visible ? revealClass : baseClass}`}
            style={delay && visible ? { animationDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   FLOWER SWIRL / SECTION HEADER
   ═══════════════════════════════════════ */
function FlowerSwirl({ title }) {
    return (
        <div className="mb-8 flex flex-col items-center select-none">
            {title && (
                <h2 className="text-3xl sm:text-4xl text-[var(--sp05-primary)] sp05-font-heading-style leading-none mb-3">
                    {title}
                </h2>
            )}
            <div className="sp05-divider">
                <div className="sp05-divider-line" />
                <div className="sp05-divider-dot" />
                <div className="sp05-divider-line" />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   SECTIONS IMPLEMENTATION
   ═══════════════════════════════════════ */

// 1. COVER SECTION (Elementor ID satu & Cover)
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen }) {
    const { t, locale } = useTranslation();
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const guestName = guest?.name
        || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null)
        || (isEn ? 'Dear Guest' : 'Tamu Undangan');

    const coupleName = (groom?.nickname && bride?.nickname)
        ? `${groom.nickname} & ${bride.nickname}`
        : (invitation?.cover_title || 'Sandy & Artie');

    return (
        <div className={`sp05-cover ${isOpened ? 'sp05-is-opened' : ''}`}>
            {/* Elegant double asymmetrical arch inner card */}
            <div className="sp05-cover-arch">
                {/* Visual Top label */}
                <div>
                    <p className="text-[10px] tracking-[0.25em] font-semibold text-[var(--sp05-primary)]/80 mb-2 uppercase select-none">
                        Undangan Pernikahan
                    </p>
                    
                    {/* Big Calligraphy names */}
                    <h1 className="text-5xl sm:text-6xl text-[var(--sp05-primary)] sp05-font-heading-style leading-snug">
                        {coupleName}
                    </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-[var(--sp05-primary)] italic max-w-xs font-serif leading-relaxed px-2 my-4 select-none">
                    {invitation?.cover_subtitle || (isEn 
                        ? 'Without reducing respect, we invite you to attend our wedding celebration.' 
                        : 'Tanpa Mengurangi Rasa Hormat, Kami Mengundang Anda Untuk Berhadir Di Acara Pernikahan Kami.')}
                </p>

                {/* Date */}
                <p className="text-sm font-bold tracking-wider text-[var(--sp05-primary)] select-none uppercase font-serif mb-6">
                    {invitation?.countdown_target_date ? formatDate(invitation.countdown_target_date, locale) : 'Sabtu, 16 Desember 2026'}
                </p>

                {/* Guest Box */}
                <div className="p-4 my-2 w-full max-w-[280px]">
                    <p className="text-[9px] text-[var(--sp05-primary)]/70 font-bold uppercase tracking-widest mb-1.5 select-none">
                        {isEn ? 'Dear Guest' : 'Kpd Bpk/Ibu/Saudara/i :'}
                    </p>
                    <p className="text-lg font-bold text-[var(--sp05-primary)] tracking-wide mb-1 leading-snug">
                        {guestName}
                    </p>
                    <p className="text-[9px] text-[var(--sp05-primary)]/70 font-bold tracking-widest uppercase select-none">
                        {isEn ? 'At Place' : 'Di Tempat'}
                    </p>
                    <p className="text-[8px] text-[var(--sp05-primary)]/50 italic mt-3 select-none">
                        *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                    </p>
                </div>

                {/* Open Button */}
                <button type="button" onClick={onOpen} className="sp05-btn-buka">
                    {t('invitation.open') || 'Buka Undangan'}
                </button>
            </div>
        </div>
    );
}

// 2. OPENING SECTION
function OpeningSection({ invitation, showPhotos, brideGrooms, locale }) {
    const { t } = useTranslation();
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const isEn = locale === 'en';

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    const formattedDate = useMemo(() => {
        if (!invitation?.countdown_target_date) return { dayName: 'Sabtu', dayNum: '16', monthName: 'Desember', year: '2026' };
        const d = new Date(invitation.countdown_target_date);
        if (isNaN(d.getTime())) return { dayName: 'Sabtu', dayNum: '16', monthName: 'Desember', year: '2026' };
        return parseEventDate(invitation.countdown_target_date, locale);
    }, [invitation?.countdown_target_date, locale]);

    return (
        <div className="sp05-opening-section w-full flex flex-col items-center text-center">
            <Reveal className="mb-6">
                <p className="sp05-title-wedding select-none mb-1">
                    WE ARE GETTING MARRIED
                </p>
                <div className="sp05-divider select-none mb-6">
                    <div className="sp05-divider-line" />
                    <div className="sp05-divider-dot" />
                    <div className="sp05-divider-line" />
                </div>
            </Reveal>

            {/* 3D solid shadow prewedding card from Elementor */}
            {showPhotos && openingImages.length > 0 ? (
                <Reveal variant="zoom" className="sp05-photo-shadow-card mb-12 flex justify-center items-center">
                    <PremiumSlideshow
                        images={openingImages}
                        positionX={invitation?.opening_position_x}
                        positionY={invitation?.opening_position_y}
                        zoom={invitation?.opening_zoom}
                    />
                </Reveal>
            ) : (
                <Reveal className="my-8">
                    <i className="fas fa-heart text-5xl text-[var(--sp05-primary)] opacity-35 sp05-breathe" />
                </Reveal>
            )}

            {/* Date Details & Cursive names row */}
            <Reveal className="flex justify-between items-center w-full max-w-[340px] border-t border-b border-[var(--sp05-primary)]/20 py-4 mb-6">
                <div className="flex flex-col items-start text-left select-none pr-4">
                    <p className="text-xs uppercase font-bold tracking-wider text-[var(--sp05-primary)]/80 mb-1">
                        {formattedDate.monthName || 'Desember'}
                    </p>
                    <p className="text-3xl font-bold font-serif text-[var(--sp05-primary)]">
                        {formattedDate.dayNum || '16'}
                    </p>
                    <p className="text-xs font-bold text-[var(--sp05-primary)]/70 uppercase tracking-widest mt-1">
                        {formattedDate.year || '2026'}
                    </p>
                </div>
                
                <div className="sp05-date-block flex-grow text-center">
                    <h2 className="text-3xl text-[var(--sp05-primary)] sp05-font-heading-style leading-snug">
                        {groom.nickname || 'Sandy'} &amp; {bride.nickname || 'Artie'}
                    </h2>
                </div>
            </Reveal>

            <Reveal className="mt-4">
                <button 
                    type="button" 
                    onClick={() => {
                        const target = invitation?.countdown_target_date ? new Date(invitation.countdown_target_date) : new Date('2026-12-16T09:00:00');
                        const ds = target.toISOString().substring(0, 10).replace(/-/g, '');
                        const names = `${groom.nickname || 'Sandy'} & ${bride.nickname || 'Artie'}`;
                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan ' + names)}&dates=${ds}T090000/${ds}T140000&sf=true&output=xml`;
                        window.open(url, '_blank');
                    }} 
                    className="sp05-btn-save-date"
                >
                    {t('invitation.save_the_date') || 'Save The Date'}
                </button>
            </Reveal>
        </div>
    );
}

// 3. BRIDE & GROOM PROFILE SECTION (Big arch header and white card overlay)
function BrideGroomSection({ brideGrooms, locale, showPhotos }) {
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    const isEn = locale === 'en';

    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const raw = String(childOrder).trim().toLowerCase();
        let matchedKey = null;
        
        if (raw.includes('tunggal') || raw.includes('satu-satunya') || raw.includes('only')) matchedKey = 'tunggal';
        else if (raw.includes('bungsu') || raw.includes('terakhir') || raw.includes('youngest')) matchedKey = 'bungsu';
        else if (raw.includes('2') || raw.includes('kedua') || raw.includes('second')) matchedKey = '2';
        else if (raw.includes('1') || raw.includes('pertama') || raw.includes('kesatu') || raw.includes('first')) matchedKey = '1';
        else return childOrder;
        
        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' },
            '2': { id: 'Kedua', en: 'Second' },
            'bungsu': { id: 'Bungsu', en: 'Youngest' },
            'tunggal': { id: 'Tunggal', en: 'Only' }
        };
        
        const match = ordinalMap[matchedKey];
        const isWanita = ['wanita', 'female'].includes(String(gender).toLowerCase());
        
        if (isEn) {
            const noun = isWanita ? 'Daughter' : 'Son';
            if (match.en.toLowerCase() === 'only') return `ONLY ${noun.toUpperCase()} OF`;
            return `${match.en.toUpperCase()} ${noun.toUpperCase()} OF`;
        } else {
            const noun = isWanita ? 'Putri' : 'Putra';
            if (match.id.toLowerCase() === 'tunggal') return `${noun.toUpperCase()} TUNGGAL DARI`;
            return `${noun.toUpperCase()} ${match.id.toUpperCase()} DARI`;
        }
    };

    return (
        <div className="sp05-mempelai-section text-center">
            {/* White/cream elegant overlay text block */}
            <Reveal className="sp05-mempelai-intro-card max-w-sm mx-auto mb-12">
                <p className="text-xs leading-relaxed text-[var(--sp05-primary)] font-semibold select-none">
                    {isEn 
                        ? '“Glorified is Allah SWT who created all things in pairs. To follow the Sunnah of the Prophet in forming a family that is sakinah, mawaddah, and warahmah.”'
                        : '“Maha suci Allah SWT yang telah menciptakan makhluk-NYA berpasang-pasangan. Untuk mengikuti Sunnah Rasul-Mu dalam rangka membentuk keluarga yang sakinah, mawaddah, warahmah. Ya Allah perkenankan kami merangkaikan kasih sayang yang kau ciptakan diantara kami.”'}
                </p>
            </Reveal>

            <div className="space-y-12">
                {/* Groom Profile */}
                <Reveal variant="left" className="flex flex-col items-center">
                    {showPhotos ? (
                        <div className="sp05-couple-frame mb-5">
                            <img 
                                src={getStorageUrl(groom.photo, '/images/demo/korea-8.jpg')} 
                                alt={groom.full_name || 'Sandy'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                    transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--sp05-primary)] flex items-center justify-center font-bold text-xl text-[var(--sp05-primary)] bg-white shadow-md mb-4 font-serif">
                            {groom.nickname?.charAt(0) || 'S'}
                        </div>
                    )}
                    
                    <h3 className="text-3xl font-bold text-[var(--sp05-primary)] sp05-font-heading-style leading-none">
                        {groom.full_name || 'Sandy Rahardian'}
                    </h3>
                    <p className="text-xs text-[var(--sp05-primary)] font-semibold mt-2 max-w-xs px-4 leading-relaxed">
                        {translateChildOrder(groom.child_order, 'pria')}{' '}
                        <span className="font-bold border-b border-[var(--sp05-primary)]/20 pb-0.5">
                            {groom.father_name && groom.mother_name 
                                ? `${groom.father_name} & ${groom.mother_name}` 
                                : 'Bapak Lorem Ipsum & Ibu Lipsum'}
                        </span>
                    </p>
                    {groom.instagram && (
                        <a 
                            href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="sp05-btn-ig-circle mt-4"
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </Reveal>

                {/* Cursive & Separator */}
                <Reveal variant="zoom" className="py-2 select-none">
                    <span className="text-5xl text-[var(--sp05-primary)] sp05-font-heading-style">&amp;</span>
                </Reveal>

                {/* Bride Profile */}
                <Reveal variant="right" className="flex flex-col items-center">
                    {showPhotos ? (
                        <div className="sp05-couple-frame mb-5">
                            <img 
                                src={getStorageUrl(bride.photo, '/images/demo/korea-3.jpg')} 
                                alt={bride.full_name || 'Artie'} 
                                className="class-foto-profil" 
                                style={{
                                    objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                    transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                    transformOrigin: 'center'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-[var(--sp05-primary)] flex items-center justify-center font-bold text-xl text-[var(--sp05-primary)] bg-white shadow-md mb-4 font-serif">
                            {bride.nickname?.charAt(0) || 'A'}
                        </div>
                    )}
                    
                    <h3 className="text-3xl font-bold text-[var(--sp05-primary)] sp05-font-heading-style leading-none">
                        {bride.full_name || 'Artie Dinanti'}
                    </h3>
                    <p className="text-xs text-[var(--sp05-primary)] font-semibold mt-2 max-w-xs px-4 leading-relaxed">
                        {translateChildOrder(bride.child_order, 'wanita')}{' '}
                        <span className="font-bold border-b border-[var(--sp05-primary)]/20 pb-0.5">
                            {bride.father_name && bride.mother_name 
                                ? `${bride.father_name} & ${bride.mother_name}` 
                                : 'Bapak Lorem Ipsum & Ibu Lipsum'}
                        </span>
                    </p>
                    {bride.instagram && (
                        <a 
                            href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="sp05-btn-ig-circle mt-4"
                        >
                            <i className="fab fa-instagram" />
                        </a>
                    )}
                </Reveal>
            </div>
        </div>
    );
}

// 4. EVENTS & COUNTDOWN SECTION
function EventSection({ events, locale, invitation, sections }) {
    const { t } = useTranslation();
    const list = safeArr(events);
    const isEn = locale === 'en';

    const showCountdown = parseBool(invitation?.show_countdown);
    const showCountdownInEvent = useMemo(() => {
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        if (!primaryEvent?.event_date || !showCountdown) return false;
        
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cSection = safeSections.find(s => s.section_key === 'countdown');
            return cSection ? !!cSection.is_visible : false;
        }
        return true;
    }, [sections, events, showCountdown]);

    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);
    const targetDate = useMemo(() => invitation?.countdown_target_date || primaryEvent?.event_date || '', [invitation?.countdown_target_date, primaryEvent]);

    return (
        <div className="sp05-event-section">
            <Reveal>
                <FlowerSwirl title={t('nav.acara')} />
            </Reveal>

            {/* Introductory sentence */}
            <Reveal className="max-w-xs mx-auto text-center mb-8">
                <p className="text-xs leading-relaxed text-[var(--sp05-primary)] font-semibold select-none">
                    {isEn 
                        ? 'With the blessings of Allah SWT, we cordially invite you to celebrate our holy union at our reception:'
                        : 'Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta\'ala, Kami mengundang Bapak/Ibu/Saudara/i, untuk menghadiri Resepsi Pernikahan kami.'}
                </p>
            </Reveal>

            {showCountdownInEvent && targetDate && (
                <Reveal variant="zoom" className="mb-8">
                    <CountdownTimer targetDate={targetDate} />
                </Reveal>
            )}

            <div className="space-y-8">
                {list.map((evt, idx) => {
                    const { dayNum, dayName, monthName, year } = parseEventDate(evt.event_date, locale);
                    const eventDisplayName = evt.event_type === 'akad' ? 'Akad Nikah' : (evt.event_name || 'Resepsi Nikah');
                    const isEven = idx % 2 === 0;

                    return (
                        <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="sp05-event-card-container">
                            {/* Side high contrast Banner with vertical text */}
                            <div className="sp05-event-side-banner">
                                <span className="sp05-event-side-title">
                                    {eventDisplayName}
                                </span>
                            </div>

                            {/* Card Content body */}
                            <div className="sp05-event-content">
                                {/* SVG/Visual indicator icon */}
                                <div className="text-[var(--sp05-primary)] text-3xl mb-1 mt-2">
                                    {evt.event_type === 'akad' ? (
                                        <i className="fas fa-file-signature" />
                                    ) : (
                                        <i className="fas fa-glass-cheers" />
                                    )}
                                </div>

                                {/* Date row */}
                                <div className="sp05-event-date-row select-none">
                                    <span className="sp05-event-date-side uppercase">{dayName.substring(0, 3)}</span>
                                    <div className="sp05-event-date-center">
                                        {dayNum}
                                        <span className="uppercase">{monthName.substring(0, 3)}</span>
                                    </div>
                                    <span className="sp05-event-date-side">{year}</span>
                                </div>

                                {/* Time Details */}
                                <p className="text-[12px] font-bold text-[var(--sp05-primary)]/80 select-none mb-4">
                                    Pukul : {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : (isEn ? ' - End' : ' - Selesai')} {evt.timezone || 'WIB'}
                                </p>

                                {/* Divider */}
                                <div className="sp05-divider select-none mb-4 w-24">
                                    <div className="sp05-divider-line" />
                                    <div className="sp05-divider-dot" />
                                    <div className="sp05-divider-line" />
                                </div>

                                {/* Address Venue details */}
                                <div className="text-xs leading-relaxed text-[var(--sp05-primary)] font-semibold mb-6 px-1">
                                    <p className="font-bold text-sm mb-1">{evt.venue_name || (evt.event_type === 'akad' ? "Kediaman Mempelai Wanita" : "Pondok Lembah Hijau")}</p>
                                    <p className="opacity-80 font-medium">{evt.venue_address || 'Jl. Nama Jalan, Pejaten, Jakarta Selatan'}</p>
                                </div>

                                {/* Directions Map Button */}
                                {evt.gmaps_link && (
                                    <a
                                        href={evt.gmaps_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="sp05-btn-map"
                                    >
                                        <i className="fas fa-directions" /> Google Maps
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    );
                })}

                                {/* Compact standalone Dress Code box below event list */}
                                {list?.filter(evt => evt.show_dress_code).map((evt, idx) => (
                                    <div key={`dc-${idx}`} className="sp05-card w-full mt-4" style={{ padding: '24px' }}>
                                        <DressCodeBlock event={evt} colors={{ primary: '#b89f74', text: '#2d2d2d' }} fonts={{ heading: 'inherit' }} variant="modern" plain={true} />
                                    </div>
                                ))}
            </div>
        </div>
    );
}

// 5. GOOGLE MAPS IFRAME SECTION (Elementor ID empat & Maps)
function GmapSection({ events, locale }) {
    const isEn = locale === 'en';
    const primaryEvent = useMemo(() => safeArr(events).find(e => e.is_primary) || safeArr(events)[0], [events]);

    return (
        <div className="sp05-maps-section text-center">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Location Maps' : 'Lokasi Resepsi'} />
            </Reveal>

            <Reveal variant="zoom" className="sp05-iframe-wrapper w-full max-w-sm aspect-[4/3] mx-auto mt-6">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.316550876892!2d106.80074151523849!3d-6.607530766430628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5c277c0edef%3A0xe022fe1c5bcef5c0!2sThe%201O1%20Bogor%20Suryakancana!5e0!3m2!1sid!2sid!4v1678528299638!5m2!1sid!2sid" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Reveal>

            {primaryEvent?.gmaps_link && (
                <Reveal className="mt-6">
                    <a 
                        href={primaryEvent.gmaps_link}
                        target="_blank"
                        rel="noreferrer"
                        className="sp05-btn-map"
                    >
                        <i className="fas fa-map-marked-alt" /> {isEn ? 'Navigate with Google Maps' : 'Petunjuk Arah'}
                    </a>
                </Reveal>
            )}
        </div>
    );
}

// 6. STORY TIMELINE SECTION
function LoveStorySection({ loveStories }) {
    const { t } = useTranslation();
    const list = safeArr(loveStories);

    if (list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.kisah')} />
            </Reveal>

            <div className="sp05-timeline mt-8">
                {list.map((story, i) => (
                    <Reveal key={story.id || i} variant={i % 2 === 0 ? 'left' : 'right'} className="sp05-timeline-item">
                        <div className="sp05-story-card">
                            <span className="sp05-story-year">
                                {story.story_date ? new Date(story.story_date).getFullYear() : story.year || '2021'}
                            </span>
                            <h4 className="text-md font-bold text-[var(--sp05-primary)] sp05-font-heading-style tracking-wide mb-1.5">
                                {story.title}
                            </h4>
                            <p className="text-xs leading-relaxed opacity-90 text-[var(--sp05-text-dark)] font-medium">
                                {story.description}
                            </p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 7. GALLERY GRID SECTION
function GallerySection({ galleries, showPhotos }) {
    const { t } = useTranslation();
    const list = safeArr(galleries);

    if (!showPhotos || list.length === 0) return null;

    return (
        <div className="py-16 px-6 max-w-md mx-auto">
            <Reveal>
                <FlowerSwirl title={t('nav.galeri')} />
            </Reveal>

            <div className="grid grid-cols-2 gap-3 mt-6">
                {list.map((item, i) => {
                    const imgUrl = getStorageUrl(item.image_path || item.image_url);
                    const isLarge = i === 0 || i === 3;
                    return (
                        <Reveal 
                            key={item.id || i} 
                            variant="zoom" 
                            delay={i * 100}
                            className={`rounded-2xl overflow-hidden shadow-xs border-2 border-[var(--sp05-primary)] aspect-[3/4] relative ${isLarge ? 'col-span-2 aspect-[4/3]' : ''}`}
                        >
                            <img src={imgUrl} alt={item.caption || 'Galeri'} className="sp05-strict-cover" />
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

// 8. unified RSVP & WISHES SECTION
function RsvpWishesSection({ invitation, wishes, locale }) {
    const wishesInputRef = React.useRef(null);
    const isEn = locale === 'en';
    
    const [wishesList, setWishesList] = useState(safeArr(wishes));

    const { data, setData, post, processing, reset, errors } = useForm({
        sender_name: '',
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('invitation.submit-rsvp', { slug: invitation.slug }), {
            preserveScroll: true,
            onSuccess: () => {
                if (data.message) {
                    post(route('invitation.submit-wish', { slug: invitation.slug }), {
                        preserveScroll: true,
                        onSuccess: () => {
                            setWishesList(prev => [
                                {
                                    id: Date.now(),
                                    sender_name: data.sender_name,
                                    message: data.message,
                                    created_at: new Date().toISOString()
                                },
                                ...prev
                            ]);
                            reset();
                            setFormSubmitted(true);
                        }
                    });
                } else {
                    reset();
                    setFormSubmitted(true);
                }
            }
        });
    };

    return (
        <div className="sp05-rsvp-wishes-section max-w-md mx-auto text-center" id="rsvp">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Confirm RSVP' : 'Konfirmasi RSVP'} />
            </Reveal>

            <Reveal variant="zoom" className="bg-white border-2 border-[var(--sp05-primary)] p-6 mt-6 rounded-[28px] shadow-lg">
                {formSubmitted ? (
                    <div className="py-8 text-center">
                        <i className="fas fa-check-circle text-4xl text-[var(--sp05-primary)] mb-3" />
                        <h4 className="text-lg font-bold text-[var(--sp05-primary)] select-none">
                            {isEn ? 'Thank You!' : 'Terima Kasih!'}
                        </h4>
                        <p className="text-xs text-[var(--sp05-primary)]/75 mt-1">
                            {isEn ? 'Your RSVP has been saved.' : 'Konfirmasi kehadiran Anda berhasil disimpan.'}
                        </p>
                        <button type="button" onClick={() => setFormSubmitted(false)} className="sp05-btn-save-date mt-6">
                            {isEn ? 'Confirm Again' : 'Isi Kembali'}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="sp05-input-group">
                            <label className="sp05-label">{isEn ? 'Your Name' : 'Nama Anda'}</label>
                            <input 
                                type="text"
                                className="sp05-input"
                                placeholder={isEn ? 'Full name...' : 'Nama lengkap Anda...'}
                                value={data.sender_name}
                                onChange={e => setData('sender_name', e.target.value)}
                                required
                            />
                            {errors.sender_name && <div className="text-[10px] text-red-500 mt-1">{errors.sender_name}</div>}
                        </div>

                        {/* Attendance */}
                        <div className="sp05-input-group">
                            <label className="sp05-label">{isEn ? 'Attendance' : 'Kehadiran'}</label>
                            <select 
                                className="sp05-select"
                                value={data.attendance}
                                onChange={e => setData('attendance', e.target.value)}
                            >
                                <option value="hadir">{isEn ? 'Attending' : 'Hadir'}</option>
                                <option value="tidak_hadir">{isEn ? 'Not Attending' : 'Tidak Hadir'}</option>
                                <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum Pasti'}</option>
                            </select>
                        </div>

                        {/* Pax count */}
                        {data.attendance === 'hadir' && (
                            <div className="sp05-input-group">
                                <label className="sp05-label">{isEn ? 'Guests Count' : 'Jumlah Orang'}</label>
                                <select 
                                    className="sp05-select"
                                    value={data.number_of_guests}
                                    onChange={e => setData('number_of_guests', parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5].map(v => (
                                        <option key={v} value={v}>{v} {isEn ? 'Person' : 'Orang'}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Message wishing */}
                        <div className="sp05-input-group">
                            <label className="sp05-label">{isEn ? 'Blessing Message' : 'Doa & Ucapan'}</label>
                            <WishesEmojiPicker
                                    value={data.message}
                                    onChange={(newValue) => setData('message', newValue)}
                                    inputRef={wishesInputRef}
                                    isDark={false}
                                >
                                    <textarea
                                    ref={wishesInputRef} 
                                className="sp05-textarea"
                                rows="3"
                                placeholder={isEn ? 'Blessing words...' : 'Tuliskan ucapan selamat dan doa restu Anda...'}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                            />
                                </WishesEmojiPicker>
                            {errors.message && <div className="text-[10px] text-red-500 mt-1">{errors.message}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="sp05-btn-submit"
                        >
                            {processing ? (isEn ? 'Saving...' : 'Menyimpan...') : (isEn ? 'Confirm Attendance' : 'Kirim Konfirmasi')}
                        </button>
                    </form>
                )}
            </Reveal>

            {/* Wishes Scrollable list */}
            {wishesList.length > 0 && (
                <Reveal variant="zoom" className="mt-10 text-left">
                    <h5 className="text-xs font-bold text-[var(--sp05-primary)] uppercase tracking-wider mb-4 px-2 select-none">
                        {isEn ? 'Prayers & Wishes' : 'Doa Restu Tamu'}
                    </h5>
                    
                    <div className="sp05-wishes-container space-y-3">
                        {wishesList.map((wish, i) => (
                            <div key={wish.id || i} className="sp05-wish-card">
                                <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-bold text-[var(--sp05-primary)] tracking-wide">
                                        {wish.sender_name}
                                    </h6>
                                    <span className="text-[9px] text-[var(--sp05-primary)]/70 font-semibold">
                                        {new Date(wish.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-[var(--sp05-text-dark)] font-medium opacity-90">
                                    {wish.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </Reveal>
            )}
        </div>
    );
}

// 9. BANK DETAILS GIFT SECTION
function BankSection({ bankAccounts, locale }) {
    const list = safeArr(bankAccounts);
    const isEn = locale === 'en';

    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (num, id) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(num)
                .then(() => {
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                })
                .catch(() => {
                    fallbackCopy(num);
                    setCopiedId(id);
                    setTimeout(() => setCopiedId(null), 2000);
                });
        } else {
            fallbackCopy(num);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    if (list.length === 0) return null;

    return (
        <div className="sp05-bank-section text-center" id="gift">
            <Reveal>
                <FlowerSwirl title={isEn ? 'Digital Envelope' : 'Amplop Digital'} />
            </Reveal>
            <Reveal>
                <p className="text-xs text-[var(--sp05-primary)] max-w-xs mx-auto mb-8 font-semibold select-none leading-relaxed">
                    {isEn 
                        ? 'For family and friends who wish to express their blessings digitally:' 
                        : 'Untuk memudahkan keluarga dan kerabat yang ingin memberikan tanda kasih secara cashless/digital:'}
                </p>
            </Reveal>

            <div className="space-y-6">
                {list.map((bank, i) => (
                    <Reveal key={bank.id || i} variant="zoom" className="sp05-bank-card text-left flex flex-col justify-between h-44">
                        {/* Chip & Bank Title */}
                        <div className="flex justify-between items-center select-none">
                            <span className="font-extrabold italic text-xl text-[var(--sp05-primary)] tracking-wide">
                                {bank.bank_name}
                            </span>
                            <div className="w-10 h-7 bg-white/40 border border-white/60 rounded-md shadow-xs opacity-75 flex items-center justify-center font-bold text-[8px] text-[var(--sp05-primary)]">
                                CARD
                            </div>
                        </div>

                        {/* Account Number */}
                        <div className="my-2 select-none">
                            <p className="text-[9px] uppercase font-bold text-[var(--sp05-primary)]/60 tracking-widest mb-0.5">
                                Card Number
                            </p>
                            <p className="text-xl font-bold tracking-widest text-[var(--sp05-primary)] font-serif">
                                {bank.account_number}
                            </p>
                        </div>

                        {/* Holder details & Copy action button */}
                        <div className="flex justify-between items-end border-t border-[var(--sp05-primary)]/20 pt-3">
                            <div className="select-none">
                                <p className="text-[9px] uppercase font-bold text-[var(--sp05-primary)]/60 tracking-widest">
                                    Cardholder
                                </p>
                                <p className="text-xs font-bold text-[var(--sp05-primary)] truncate max-w-[185px]">
                                    {bank.account_name}
                                </p>
                            </div>

                            <button 
                                type="button" 
                                onClick={() => handleCopy(bank.account_number, bank.id || i)}
                                className="sp05-btn-copy shadow-xs"
                            >
                                {copiedId === (bank.id || i) ? (
                                    <>
                                        <i className="fas fa-check" /> Copied
                                    </>
                                ) : (
                                    <>
                                        <i className="far fa-copy" /> Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

// 10. CLOSING SECTION
function ClosingSection({ invitation, brideGrooms, locale }) {
    const isEn = locale === 'en';
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || {};

    const hasGroomParents = !!(groom.father_name || groom.mother_name);
    const hasBrideParents = !!(bride.father_name || bride.mother_name);

    return (
        <div className="w-full py-16 px-6 text-center bg-white border-t-4 border-[var(--sp05-primary)]">
            <Reveal variant="zoom" className="max-w-xs mx-auto flex flex-col items-center">
                <i className="fas fa-heart text-[var(--sp05-primary)] text-3xl mb-4 sp05-breathe" />
                
                <h4 className="text-3xl text-[var(--sp05-primary)] sp05-font-heading-style leading-none mb-4 select-none">
                    {invitation?.closing_title || (isEn ? 'Thank You' : 'Terima Kasih')}
                </h4>

                <p className="text-xs leading-relaxed text-[var(--sp05-primary)]/80 px-2 mb-8 select-none font-medium">
                    {invitation?.closing_text || (isEn 
                        ? 'It is our great honor and happiness if you could attend to give your blessings to us at this wedding.'
                        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.')}
                </p>

                <div className="space-y-4 text-xs font-semibold text-[var(--sp05-text-dark)] select-none">
                    <p className="italic text-[var(--sp05-primary)]/70">{isEn ? 'Sincerely,' : 'Kami yang berbahagia,'}</p>
                    
                    <h5 className="text-2xl text-[var(--sp05-primary)] sp05-font-heading-style leading-none">
                        {groom.nickname || 'Sandy'} &amp; {bride.nickname || 'Artie'}
                    </h5>

                    {/* Parents names */}
                    <div className="space-y-2 border-t border-[var(--sp05-primary)]/10 pt-3 text-[10px] text-[var(--sp05-primary)]/70 uppercase tracking-widest font-serif font-bold">
                        {hasGroomParents && (
                            <p>
                                {isEn ? 'Family of:' : 'Kel. Bapak'} {groom.father_name} &amp; {isEn ? '' : 'Ibu'} {groom.mother_name}
                            </p>
                        )}
                        {hasBrideParents && (
                            <p>
                                {isEn ? 'Family of:' : 'Kel. Bapak'} {bride.father_name} &amp; {isEn ? '' : 'Ibu'} {bride.mother_name}
                            </p>
                        )}
                    </div>
                </div>
            </Reveal>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN DYNAMIC INDEX COMPONENT (Page root)
   ═══════════════════════════════════════ */
export default function DynamicIndex({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest, isDemo }) {
    const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);

    const audioRef = useRef(null);
    const containerRef = useRef(null);

    const showPhotos = !parseBool(invitation?.hide_photos, false) && parseBool(invitation?.show_photos, true);
    const showAnimations = parseBool(invitation?.show_animations, true);

    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    const resolvedSections = useMemo(() => {
        const list = safeArr(sections);
        if (list.length === 0) return [];
        
        let filtered = list.filter(s => s.is_visible);
        
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const streamings = primaryEvent?.streaming_url || (Array.isArray(primaryEvent?.streamings) && primaryEvent.streamings.length > 0);
        if (!streamings) {
            filtered = filtered.filter(s => s.section_key !== 'livestream');
        }

        if (!showPhotos || safeArr(galleries).length === 0) {
            filtered = filtered.filter(s => s.section_key !== 'gallery');
        }

        const hasRsvp = filtered.some(s => s.section_key === 'rsvp');
        if (hasRsvp) {
            filtered = filtered.filter(s => s.section_key !== 'wishes');
        }

        return filtered;
    }, [sections, events, galleries, showPhotos]);

    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const handleOpenInvitation = () => {
        setIsOpened(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                setIsPlaying(false);
            });
        }

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

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
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            audioRef.current?.play().then(() => {
                setIsPlaying(true);
            }).catch(() => {});
        }
    };

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <div className={`sp05-theme ${!showAnimations ? 'theme-no-animations' : ''}`}>
            <Head>
                <title>{invitation?.title || 'Undangan Pernikahan'}</title>
                <meta name="description" content={invitation?.cover_subtitle || 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.'} />
            </Head>

            {/* Custom Google Fonts Loader */}
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=MonteCarlo&family=Amita:wght@400;700&family=Croissant+One&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
            </Head>

            {/* Audio Source */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={getStorageUrl(invitation.music_url, '/audio/backsound.mp3')} loop />
            )}

            {/* Viewport container */}
            <div ref={containerRef} className="sp05-theme-container">
                {/* Ambient Particles */}
                {invitation?.particle_type && invitation.particle_type !== 'none' && (
                    <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
                        <ParticleEffect type={invitation.particle_type || 'gold-dust'} />
                    </div>
                )}

                {/* 1. COVER / ENVELOPE OVERLAY */}
                <CoverSection
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpened}
                    onOpen={handleOpenInvitation}
                />

                {/* Opened invitation sections content */}
                {isOpened && (
                    <div className="flex flex-col w-full relative z-2">
                        {resolvedSections.map((sec) => {
                            const key = sec.section_key;
                            
                            return (
                                <ErrorBoundary key={sec.id || key}>
                                    {key === 'cover' && null}

                                    {key === 'opening' && (
                                        <OpeningSection
                                            invitation={invitation}
                                            showPhotos={showPhotos}
                                            brideGrooms={brideGrooms}
                                            locale={locale}
                                        />
                                    )}

                                    {key === 'bride_groom' && (
                                        <BrideGroomSection
                                            brideGrooms={brideGrooms}
                                            locale={locale}
                                            showPhotos={showPhotos}
                                        />
                                    )}

                                    {key === 'event' && (
                                        <div className="w-full">
                                            <EventSection
                                                events={events}
                                                locale={locale}
                                                invitation={invitation}
                                                sections={sections}
                                            />
                                            {/* Google Maps block embedded right after events */}
                                            <GmapSection events={events} locale={locale} />
                                        </div>
                                    )}

                                    {key === 'love_story' && (
                                        <LoveStorySection loveStories={loveStories} />
                                    )}

                                    {key === 'gallery' && (
                                        <GallerySection galleries={galleries} showPhotos={showPhotos} />
                                    )}

                                    {key === 'rsvp' && (
                                        <RsvpWishesSection
                                            invitation={invitation}
                                            wishes={wishes}
                                            locale={locale}
                                        />
                                    )}

                                    {key === 'bank' && (
                                        <BankSection bankAccounts={bankAccounts} locale={locale} />
                                    )}

                                    {key === 'closing' && (
                                        <div className="w-full flex flex-col items-center">
                                            <ClosingSection
                                                invitation={invitation}
                                                brideGrooms={brideGrooms}
                                                locale={locale}
                                            />
                                            
                                            {/* Dynamic central reseller watermark */}
                                            <div className="sp05-watermark select-none bg-white w-full border-t border-[var(--sp05-primary)]/10 pt-6">
                                                Made with ❤️ by <span className="font-bold text-[var(--sp05-primary)]">{brandName}</span>
                                            </div>
                                        </div>
                                    )}
                                </ErrorBoundary>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* FLOATING ACTION OVERLAY CONTROLS */}
            {isOpened && (
                <div className="sp05-floating-controls">
                    {/* QR Code trigger */}
                    {enableQr && activeGuest && (
                        <button 
                            type="button" 
                            onClick={() => setShowQr(true)} 
                            className="sp05-control-btn"
                            title={isEn ? 'Show Check-in QR' : 'Tampilkan QR Presensi'}
                        >
                            <i className="fas fa-qrcode" />
                        </button>
                    )}

                    {/* Fullscreen Mode trigger */}
                    <button 
                        type="button" 
                        onClick={toggleFullscreen} 
                        className="sp05-control-btn"
                        title={isEn ? 'Toggle Screen Mode' : 'Ubah Mode Layar'}
                    >
                        <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                    </button>

                    {/* Audio Music trigger with Equalizer waves */}
                    {invitation?.music_url && (
                        <button 
                            type="button" 
                            onClick={toggleMusic} 
                            className="sp05-control-btn"
                            title={isEn ? 'Toggle Background Music' : 'Mute/Unmute Musik'}
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
                </div>
            )}

            {/* QR PRESENSI CHECK-IN MODAL OVERLAY */}
            {isOpened && enableQr && showQr && activeGuest && (
                <div className="sp05-qr-modal" onClick={() => setShowQr(false)}>
                    <div className="sp05-qr-card" onClick={e => e.stopPropagation()}>
                        <button 
                            type="button" 
                            onClick={() => setShowQr(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                        >
                            <i className="fas fa-times" />
                        </button>

                        <h4 className="text-lg font-bold text-[var(--sp05-primary)] sp05-font-heading-style select-none">
                            QR Code Presensi
                        </h4>
                        <p className="text-xs text-[var(--sp05-primary)]/75 mt-1 mb-6 max-w-[240px] mx-auto select-none">
                            {isEn 
                                ? 'Show this QR code to the receptionist for attendance entry.' 
                                : 'Tunjukkan QR code ini ke petugas penerima tamu untuk konfirmasi kehadiran.'}
                        </p>

                        <div className="sp05-qr-image-wrapper mb-4">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=484729&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
                                alt="QR Code Presensi" 
                                className="w-48 h-48 rounded-xl object-contain select-none"
                            />
                        </div>

                        <p className="text-sm font-bold text-[var(--sp05-primary)]">
                            {activeGuest.name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
