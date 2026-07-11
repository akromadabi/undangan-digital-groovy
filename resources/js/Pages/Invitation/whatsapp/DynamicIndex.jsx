import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm, Head } from '@inertiajs/react';
import './style.css';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import DressCodeBlock from '@/Components/DressCodeBlock';

/* ═══════════════════════════════════════
   STANDARD HELPERS & UTILITIES
   ═══════════════════════════════════════ */
let globalShowPhotos = true;
let globalShowAnimations = true;

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
    
    // Extra range selection compatibility for iOS Safari / Instagram webview
    const range = document.createRange();
    range.selectNodeContents(ta);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    ta.setSelectionRange(0, 999999);
    
    try {
        document.execCommand('copy');
    } catch (e) {
        console.error('Fallback copy failed', e);
    }
    
    selection.removeAllRanges();
    document.body.removeChild(ta);
};

function formatDate(dateString, locale) {
    if (!dateString) return '';
    const d = parseSafeDate(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}


// Safe date parsing helper for cross-browser local time countdowns
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

function useCountdown(targetDate, targetTime = '') {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const calculate = () => {
            const target = parseSafeDate(targetDate, targetTime);
            if (!target) return;
            const difference = target.getTime() - Date.now();
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
    }, [targetDate, targetTime]);

    return timeLeft;
}

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0, id, style, ...props }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(!globalShowAnimations);

    useEffect(() => {
        if (!globalShowAnimations) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVisible(true);
        }, { threshold: 0.05 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    if (!globalShowAnimations) {
        return <div id={id} style={style} className={className} {...props}>{children}</div>;
    }

    const combinedStyle = {
        ...(style || {}),
        ...(delay ? { animationDelay: `${delay}ms` } : {})
    };

    return (
        <div
            ref={ref}
            id={id}
            className={`${className} wa-animated-bubble ${visible ? 'is-visible' : 'opacity-0 translate-y-3'}`}
            style={combinedStyle}
            {...props}
        >
            {children}
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
                <h2 className="font-bold text-lg mb-2">Terjadi kesalahan pada rendering tema.</h2>
                <pre className="text-xs overflow-auto max-w-full p-2 bg-red-100 rounded">{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   COVER / LOCK SCREEN COMPONENT
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, language, showPhotos }) {
    const { t, locale } = useTranslation(language);
    
    // Time & Date display for Lockscreen
    const [timeStr, setTimeStr] = useState('08:00');
    const [dateStr, setDateStr] = useState('Jumat, 25 Desember');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
            setDateStr(now.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [locale]);

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    
    const monogram = useMemo(() => {
        const gChar = groom.nickname?.charAt(0) || 'B';
        const bChar = bride.nickname?.charAt(0) || 'R';
        return `${gChar}&${bChar}`;
    }, [groom, bride]);

    const avatarSrc = useMemo(() => {
        const target = bride.photo || groom.photo || '';
        return getStorageUrl(target, null);
    }, [groom, bride]);

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    // Resolve YouTube cover embed ID
    const coverEmbedId = useMemo(() => {
        let id = '';
        const url = invitation?.cover_video_url;
        if (url) {
            if (url.includes('youtube.com/watch?v=')) {
                id = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                id = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                id = url.split('embed/')[1]?.split('?')[0];
            }
        }
        return id;
    }, [invitation?.cover_video_url]);

    // Strip emoticons from the subtitle text
    const cleanSubtitle = useMemo(() => {
        const subtitle = invitation?.cover_subtitle || (locale === 'en' ? 'You have 1 unread message.' : 'Anda memiliki 1 pesan belum dibaca.');
        return subtitle.replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u2600-\u26FF\u2700-\u27BF\uFE0F\uD83C-\uDBFF\uDC00-\uDFFF|💬|😊|❤️|✉️|📩]/g, '').trim();
    }, [invitation?.cover_subtitle, locale]);

    return (
        <div className={`wa-cover${isOpened ? ' is-opened' : ''}`}>
            {/* Background Slideshow or Background Video */}
            <div className="wa-cover-bg">
                {showPhotos && coverEmbedId ? (
                    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                        <iframe
                            src={`https://www.youtube.com/embed/${coverEmbedId}?autoplay=1&mute=1&loop=1&playlist=${coverEmbedId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&disablekb=1&fs=0`}
                            title="Background Cover Video"
                            frameBorder="0"
                            className="absolute top-1/2 left-1/2 w-[115vw] h-[64.68vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-105"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            style={{ border: 'none' }}
                        />
                    </div>
                ) : showPhotos && coverImages.length > 0 ? (
                    <PremiumSlideshow
                        images={coverImages}
                        positionX={invitation?.cover_position_x}
                        positionY={invitation?.cover_position_y}
                        zoom={invitation?.cover_zoom}
                    />
                ) : (
                    <div className="wa-cover-bg-placeholder" />
                )}
                <div className="wa-cover-overlay" />
            </div>

            <div className="wa-cover-top">
                <div className="wa-cover-time">{timeStr}</div>
                <div className="wa-cover-date">{dateStr}</div>
            </div>

            <div className="wa-cover-middle">
                <div className="wa-lock-card">
                    {/* Native-style Push Notification Header */}
                    <div className="wa-noti-header">
                        <div className="wa-noti-app">
                            <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: '1.1rem' }} />
                            <span className="wa-noti-app-name">WhatsApp</span>
                        </div>
                        <span className="wa-noti-time">{locale === 'en' ? 'now' : 'sekarang'}</span>
                    </div>

                    {/* Native-style Push Notification Body */}
                    <div className="wa-noti-body">
                        <div className="wa-noti-title">
                            {groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : invitation?.title || 'Undangan Digital'}
                        </div>
                        <div className="wa-noti-message">
                            <span className="wa-noti-to-label">
                                {locale === 'en' ? 'SPECIAL INVITATION TO: ' : 'UNDANGAN SPESIAL KEPADA: '}
                            </span>
                            <span className="wa-noti-guest-name">
                                {guest?.name || (locale === 'en' ? 'Dear Guest' : 'Tamu Undangan')}
                            </span>
                        </div>
                        
                        <div className="wa-noti-subtitle">
                            {cleanSubtitle}
                        </div>
                    </div>

                    {/* Quick Action Button */}
                    <button type="button" onClick={onOpen} className="wa-lock-btn">
                        <i className="fas fa-envelope-open" style={{ marginRight: '8px' }} />
                        {t('invitation.open') || 'Buka Undangan'}
                    </button>
                </div>
            </div>

            <div className="wa-cover-bottom">
                <i className="fas fa-lock" /> {locale === 'en' ? 'Swipe up or click open to unlock' : 'Klik buka untuk membuka kunci'}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   HEADER BAR COMPONENT
   ═══════════════════════════════════════ */
function HeaderBar({ 
    invitation, 
    brideGrooms, 
    onToggleQr, 
    enableQr, 
    hasStory, 
    hasGallery, 
    hasVideo,
    hasBank, 
    hasStream, 
    hasRsvp, 
    hasEvent, 
    language 
}) {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
    
    const monogram = useMemo(() => {
        const gChar = groom.nickname?.charAt(0) || 'B';
        const bChar = bride.nickname?.charAt(0) || 'R';
        return `${gChar}&${bChar}`;
    }, [groom, bride]);

    const headerPhotoConfig = useMemo(() => {
        return bride.photo ? bride : (groom.photo ? groom : null);
    }, [groom, bride]);

    const avatarSrc = useMemo(() => {
        const target = bride.photo || groom.photo || '';
        return getStorageUrl(target, null);
    }, [groom, bride]);

    const scrollToSection = (id) => {
        setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="wa-header-bar">
            <div className="wa-header-left">
                <i className="fas fa-arrow-left wa-back-icon" onClick={() => window.history.back()} />
                <div className="wa-header-avatar-wrap">
                    {globalShowPhotos && avatarSrc ? (
                        <img 
                            src={avatarSrc} 
                            className="wa-header-avatar" 
                            alt="Avatar" 
                            style={headerPhotoConfig ? {
                                objectPosition: `${headerPhotoConfig.photo_position_x ?? 50}% ${headerPhotoConfig.photo_position_y ?? 50}%`,
                                transform: `scale(${headerPhotoConfig.photo_zoom ?? 1.0})`,
                                transformOrigin: 'center'
                            } : undefined}
                        />
                    ) : (
                        <div className="wa-header-monogram">{monogram}</div>
                    )}
                    <div className="wa-lock-online-dot" />
                </div>
                <div className="wa-header-meta">
                    <span className="wa-header-name">
                        {groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : invitation?.title || 'Undangan Digital'}
                    </span>
                    <span className="wa-header-status">{t('invitation.online') || 'online'}</span>
                </div>
            </div>

            <div className="wa-header-right" style={{ position: 'relative' }}>
                {hasStream && (
                    <i className="fas fa-video" onClick={() => scrollToSection('livestream')} title="Live Broadcast" />
                )}
                {hasEvent && (
                    <i className="fas fa-phone" onClick={() => scrollToSection('event')} title={language === 'en' ? 'Event Schedule' : 'Jadwal Acara'} />
                )}
                {enableQr && (
                    <i className="fas fa-qrcode" onClick={onToggleQr} title="QR Presensi" />
                )}
                <i className="fas fa-ellipsis-v" onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer', padding: '4px 8px' }} />
                
                {menuOpen && (
                    <>
                        <div className="wa-menu-backdrop" onClick={() => setMenuOpen(false)} />
                        <div className="wa-menu-dropdown">
                            <div className="wa-menu-item" onClick={() => scrollToSection('couple')}>
                                {language === 'en' ? 'Info Couple' : 'Info Mempelai'}
                            </div>
                            {hasEvent && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('event')}>
                                    {language === 'en' ? 'Event Schedule' : 'Jadwal Acara'}
                                </div>
                            )}
                            {hasStory && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('love_story')}>
                                    {language === 'en' ? 'Love Story' : 'Cerita Cinta'}
                                </div>
                            )}
                            {hasGallery && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('gallery')}>
                                    {language === 'en' ? 'Media Gallery' : 'Galeri Media'}
                                </div>
                            )}
                            {hasVideo && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('video')}>
                                    {language === 'en' ? 'Video Gallery' : 'Galeri Video'}
                                </div>
                            )}
                            {hasRsvp && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('rsvp')}>
                                    {language === 'en' ? 'RSVP Confirmation' : 'Konfirmasi RSVP'}
                                </div>
                            )}
                            {hasBank && (
                                <div className="wa-menu-item" onClick={() => scrollToSection('bank')}>
                                    {language === 'en' ? 'Send Gift' : 'Kirim Kado'}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   DECORATIVE BOTTOM INPUT BAR
   ═══════════════════════════════════════ */
function BottomBar({ language, onSend }) {
    const isEn = language === 'en';
    const [text, setText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const inputRef = useRef(null);

    const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '🙏', '😭', '😜', '😎', '🌹', '💍', '👩‍❤️‍👨', '🎂', '👏', '✨', '🥳', '🌸', '🎈', '💌', '💖', '🤗'];

    const handleEmojiClick = (emoji) => {
        if (inputRef.current) {
            const input = inputRef.current;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const val = input.value;
            const before = val.substring(0, start);
            const after = val.substring(end, val.length);
            const newValue = before + emoji + after;
            setText(newValue);
            
            setTimeout(() => {
                input.focus();
                input.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        } else {
            setText(prev => prev + emoji);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text);
        setText('');
        setShowEmoji(false);
    };

    return (
        <div className="wa-bottom-bar">
            {showEmoji && (
                <>
                    <div className="wa-emoji-backdrop" onClick={() => setShowEmoji(false)} />
                    <div className="wa-emoji-picker-popover">
                        {emojis.map(emoji => (
                            <button
                                key={emoji}
                                type="button"
                                className="wa-emoji-btn"
                                onClick={() => handleEmojiClick(emoji)}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <div className="wa-input-container">
                <button 
                    type="button" 
                    className="wa-laugh-btn"
                    onClick={() => setShowEmoji(!showEmoji)}
                >
                    <i className="far fa-laugh wa-input-icon-laugh" />
                </button>
                <input
                    ref={inputRef}
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isEn ? 'Reply with love...' : 'Ketik ucapan doa restu...'}
                    className="wa-input-field"
                />
                <i className="fas fa-paperclip wa-input-icon" style={{ cursor: 'pointer' }} />
                <i className="fas fa-camera wa-input-icon" style={{ cursor: 'pointer' }} />
            </div>
            
            <button 
                type="button" 
                className="wa-send-btn" 
                onClick={handleSend}
                style={{ cursor: text.trim() ? 'pointer' : 'default' }}
            >
                <i className={text.trim() ? "fas fa-paper-plane" : "fas fa-microphone"} />
            </button>
        </div>
    );
}


/* ═══════════════════════════════════════
   MAIN THEME WORKSPACE
   ═══════════════════════════════════════ */
function WhatsappThemeContent({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const activeLanguage = invitation?.language || 'id';
    const { t, locale } = useTranslation(activeLanguage);
    const isEn = locale === 'en';

    const bgs = safeArr(brideGrooms);
    const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
    const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};

    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [activeLightBoxIdx, setActiveLightBoxIdx] = useState(null);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);

    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
    const activeGuest = guest || null;
    const audioRef = useRef(null);

    // Visibility trigger for tab change
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const musicAutoplay = parseBool(invitation?.music_autoplay);
    const showPhotos = parseBool(invitation?.show_photos ?? true) && !parseBool(invitation?.hide_photos ?? false);
    const showAnimations = parseBool(invitation?.show_animations ?? true);

    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    // Fullscreen listeners
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

    // Auto title update
    useEffect(() => {
        if (groom.nickname && bride.nickname) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding Invitation`;
        } else {
            document.title = invitation?.title || 'Undangan Pernikahan';
        }
    }, [invitation, groom, bride]);

    // Lock scroll on cover screen
    useEffect(() => {
        if (!isOpened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpened]);

    // Pause auto scroll on user manual scroll/swipe
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        const handleUserInteraction = (e) => {
            if (
                e.target.closest('button') || 
                e.target.closest('.wa-float-btn') || 
                e.target.closest('.wa-bottom-bar') || 
                e.target.closest('.wa-modal-overlay') ||
                e.target.closest('.wa-modal-card') ||
                e.target.closest('.wa-lightbox-overlay') ||
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

    // Auto scroll timer
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
            clearInterval(timer);
        };
    }, [isOpened, autoScrollEnabled]);

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

    // Extract calendar helper URL
    const getCalUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const ds = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = (evt.start_time || '08:00').substring(0, 5).replace(':', '') + '00';
        const names = bgs.map(b => b.nickname || b.full_name).filter(Boolean).join(' & ');
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent((evt.event_name || '') + ' - ' + names)}&dates=${ds}T${st}/${ds}T${st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    // Extract child order mapping helper
    const translateChildOrder = (childOrder, gender) => {
        if (!childOrder) return '';
        const raw = String(childOrder).trim().toLowerCase();
        let matchedKey = null;
        
        if (raw.includes('tunggal') || raw.includes('satu-satunya') || raw.includes('only')) matchedKey = 'tunggal';
        else if (raw.includes('bungsu') || raw.includes('terakhir') || raw.includes('youngest')) matchedKey = 'bungsu';
        else if (raw.includes('2') || raw.includes('kedua') || raw.includes('second')) matchedKey = '2';
        else if (raw.includes('1') || raw.includes('pertama') || raw.includes('kesatu') || raw.includes('first')) matchedKey = '1';
        else if (raw.includes('4') || raw.includes('keempat') || raw.includes('fourth')) matchedKey = '4';
        else return childOrder;
        
        const ordinalMap = {
            '1': { id: 'Pertama', en: 'First' },
            '2': { id: 'Kedua', en: 'Second' },
            '4': { id: 'Keempat', en: 'Fourth' },
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

    // Extract youtube helper
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

    // Combine photos and videos for gallery
    const galleryItems = useMemo(() => {
        const items = [];
        if (showPhotos) {
            safeArr(galleries).forEach((g, idx) => {
                items.push({
                    type: 'photo',
                    src: getStorageUrl(g.image_url),
                    title: g.caption || (isEn ? 'Photo Memory' : 'Kenangan Foto'),
                    id: g.id || `photo-${idx}`
                });
            });
        }
        return items;
    }, [galleries, showPhotos, isEn]);

    const videoItems = useMemo(() => {
        const items = [];
        const hasVideos = invitation?.video_list?.length > 0 &&
            (invitation.video_playback === 'gallery' || invitation.video_playback === 'both' || !invitation.video_playback);
        
        if (hasVideos) {
            invitation.video_list.forEach((url, idx) => {
                const ytId = getYoutubeId(url);
                if (ytId) {
                    items.push({
                        ytId: ytId,
                        url: url,
                        title: isEn ? `Prewedding Video #${idx + 1}` : `Video Prewedding #${idx + 1}`,
                        id: `video-${idx}`
                    });
                }
            });
        }
        return items;
    }, [invitation?.video_list, invitation?.video_playback, isEn]);

    const hasVideos = videoItems.length > 0;

    // Handle lightbox audio control
    useEffect(() => {
        if (activeLightBoxIdx !== null && galleryItems[activeLightBoxIdx]?.type === 'video') {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [activeLightBoxIdx, galleryItems]);

    const handleCloseLightbox = () => {
        setActiveLightBoxIdx(null);
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(() => {});
        }
    };

    // RSVP & Wishes form submit
    const rsvpForm = useForm({
        guest_id: activeGuest?.id || null,
        sender_name: activeGuest?.name || '',
        attendance: 'hadir',
        number_of_guests: 1,
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);
    const handleRsvpSubmit = (e) => {
        e.preventDefault();
        rsvpForm.post(`/u/${invitation.slug}/rsvp`, {
            preserveScroll: true,
            onSuccess: () => {
                setFormSubmitted(true);
                rsvpForm.reset('message');
            }
        });
    };

    // Wishes list display
    const recentWishes = useMemo(() => {
        return safeArr(wishes).slice(0, 5);
    }, [wishes]);

    // Live Location Countdown Target Date
    const primaryEvent = useMemo(() => {
        return safeArr(events).find(e => e.is_primary) || safeArr(events)[0] || {};
    }, [events]);

    const showCountdown = parseBool(invitation?.show_countdown, true);
    const countdownTarget = invitation?.countdown_target_date || primaryEvent?.event_date;
    
    // Check if countdown section is visible in database
    const countdownAllowed = useMemo(() => {
        const safeSections = safeArr(sections);
        if (safeSections.length > 0) {
            const cs = safeSections.find(s => s.section_key === 'countdown');
            return cs ? !!cs.is_visible : false;
        }
        return true;
    }, [sections]);

    const showCountdownInEvent = showCountdown && countdownTarget && countdownAllowed;
    const timeLeft = useCountdown(countdownTarget, primaryEvent?.start_time || '');

    // Live Streaming platforms
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

    const hasStream = streamsList.length > 0;

    // Reseller or Brand watermark
    const brandName = useMemo(() => {
        return invitation?.user?.reseller_settings?.brand_name 
            || invitation?.user?.reseller?.reseller_settings?.brand_name 
            || 'TrueLove Invitation';
    }, [invitation]);

    // Cover slideshow photos extraction
    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    // Opening slideshow photos extraction
    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    // Resolve YouTube opening embed ID
    const openingEmbedId = useMemo(() => {
        let id = '';
        const url = invitation?.opening_video_url || (invitation?.video_playback === 'background' || invitation?.video_playback === 'both' ? invitation?.video_url : '');
        if (url) {
            if (url.includes('youtube.com/watch?v=')) {
                id = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                id = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('youtube.com/embed/')) {
                id = url.split('embed/')[1]?.split('?')[0];
            }
        }
        return id;
    }, [invitation?.opening_video_url, invitation?.video_playback, invitation?.video_url]);

    const handleBottomBarSend = (text) => {
        rsvpForm.setData('message', text);
        const el = document.getElementById('rsvp');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                const textarea = document.querySelector('.wa-textarea');
                if (textarea) {
                    textarea.focus();
                }
            }, 800);
        }
    };

    return (
        <div className={`wa-main-wrapper${!showAnimations ? ' wa-no-animations' : ''}`}>
            {/* Music Background tag */}
            {invitation?.music_url && (
                <audio ref={audioRef} src={getStorageUrl(invitation.music_url)} loop />
            )}

            {/* Lock Cover screen */}
            <CoverSection
                invitation={invitation}
                brideGrooms={brideGrooms}
                guest={activeGuest}
                isOpened={isOpened}
                onOpen={handleOpen}
                language={activeLanguage}
                showPhotos={showPhotos}
            />

            {/* Main Application screen */}
            {isOpened && (
                <div className="wa-app-container">
                    {/* Header bar */}
                    <HeaderBar
                        invitation={invitation}
                        brideGrooms={brideGrooms}
                        enableQr={enableQr}
                        onToggleQr={() => setShowQr(true)}
                        hasStory={safeArr(loveStories).length > 0}
                        hasGallery={galleryItems.length > 0}
                        hasVideo={hasVideos}
                        hasBank={safeArr(bankAccounts).length > 0}
                        hasStream={hasStream}
                        hasRsvp={enableRsvp || enableWishes}
                        hasEvent={safeArr(events).length > 0}
                        language={activeLanguage}
                    />

                    {/* Chat log messages */}
                    <div className="wa-chat-viewport">
                        
                        {/* Day indicator */}
                        <div className="wa-system-message select-none">
                            {locale === 'en' ? 'TODAY' : 'HARI INI'}
                        </div>

                        {/* WhatsApp safety system message */}
                        <div className="wa-system-message">
                            <i className="fas fa-lock" style={{ fontSize: '0.65rem', marginRight: '3px' }} />{' '}
                            {isEn 
                                ? 'Messages in this invitation chat are end-to-end encrypted for your joyful presence. Tap to read details.' 
                                : 'Pesan di obrolan undangan ini terenkripsi secara aman demi kehormatan kehadiran Anda. Ketuk untuk detail.'
                            }
                        </div>

                        {/* SECTION 1: Unified Premium Opening Card */}
                        <Reveal className="wa-opening-card-row" delay={100}>
                            <div className="wa-opening-card">
                                {/* Top: Image/Slideshow or Video of the Couple */}
                                {showPhotos && (openingEmbedId || openingImages.length > 0 || coverImages.length > 0) && (
                                    <div className="wa-opening-slideshow-container">
                                        {openingEmbedId ? (
                                            <div className="w-full h-full relative aspect-video" style={{ minHeight: '220px' }}>
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${openingEmbedId}?autoplay=0&mute=0&rel=0`}
                                                    title="Opening Video"
                                                    frameBorder="0"
                                                    className="w-full h-full absolute inset-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ border: 'none' }}
                                                />
                                            </div>
                                        ) : (
                                            <PremiumSlideshow
                                                images={openingImages.length > 0 ? openingImages : coverImages}
                                                positionX={invitation?.opening_position_x}
                                                positionY={invitation?.opening_position_y}
                                                zoom={invitation?.opening_zoom}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Card Content */}
                                <div className="wa-opening-card-content">
                                    {/* Monogram Overlay */}
                                    <div className="wa-opening-card-monogram">
                                        {groom.nickname?.charAt(0) || 'G'}&{bride.nickname?.charAt(0) || 'B'}
                                    </div>

                                    <div className="wa-opening-card-subtitle">
                                        {isEn ? 'The Wedding Invitation' : 'Undangan Pernikahan'}
                                    </div>

                                    <h2 className="wa-opening-card-couple">
                                        {groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Happy Couple'}
                                    </h2>

                                    {primaryEvent?.event_date && (
                                        <div className="wa-opening-card-date">
                                            📅 {formatDate(primaryEvent.event_date, activeLanguage)}
                                        </div>
                                    )}

                                    <div className="wa-opening-card-salam">
                                        {invitation?.opening_title || (isEn ? 'In the Name of Allah, Most Gracious, Most Merciful' : 'Bismillahirrahmanirrahim')}
                                    </div>

                                    <p className="wa-opening-card-text">
                                        {invitation?.opening_text || (isEn 
                                            ? 'Assalamu\'alaikum Wr. Wb. With the grace of Allah, we invite you to attend our special day.'
                                            : 'Assalamu\'alaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Anda untuk menghadiri pernikahan kami.'
                                        )}
                                    </p>

                                    {invitation?.opening_ayat && (
                                        <div className="wa-opening-ayat-box">
                                            <div className="wa-opening-ayat-title">
                                                {invitation.opening_ayat}
                                            </div>
                                            {invitation.opening_ayat_translation && 
                                             invitation.opening_ayat_translation.trim() !== invitation.opening_ayat.trim() && (
                                                <div className="wa-opening-ayat-trans">
                                                    {invitation.opening_ayat_translation}
                                                </div>
                                            )}
                                            {invitation.opening_ayat_source && (
                                                <div className="wa-opening-ayat-src">
                                                    — {invitation.opening_ayat_source}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="wa-meta" style={{ right: '12px', bottom: '8px' }}>
                                    <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    <span className="wa-ticks">✓✓</span>
                                </div>
                            </div>
                        </Reveal>

                        {/* SECTION 3: Mempelai Pria Profile */}
                        {groom && (
                            <Reveal className="wa-message-row wa-in" id="couple" delay={150}>
                                <div className="wa-bubble">
                                    <div className="wa-profile-card">
                                        <div className="wa-profile-avatar">
                                            {showPhotos && groom.photo ? (
                                                <img 
                                                    src={getStorageUrl(groom.photo)} 
                                                    alt={groom.full_name} 
                                                    style={{
                                                        objectPosition: `${groom.photo_position_x ?? 50}% ${groom.photo_position_y ?? 50}%`,
                                                        transform: `scale(${groom.photo_zoom ?? 1.0})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                />
                                            ) : (
                                                <div className="wa-profile-monogram">{groom.nickname?.charAt(0) || 'G'}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="wa-profile-title">{groom.full_name}</h4>
                                            <p className="wa-profile-desc">({groom.nickname})</p>
                                        </div>
                                        
                                        {((groom.father_name && groom.father_name.trim() !== '') || (groom.mother_name && groom.mother_name.trim() !== '')) && (
                                            <p className="wa-profile-parent">
                                                {translateChildOrder(groom.child_order, 'pria')}<br />
                                                <strong>
                                                    {groom.father_name && groom.mother_name ? (
                                                        `Bapak ${groom.father_name} & Ibu ${groom.mother_name}`
                                                    ) : groom.father_name ? (
                                                        `Bapak ${groom.father_name}`
                                                    ) : (
                                                        `Ibu ${groom.mother_name}`
                                                    )}
                                                </strong>
                                            </p>
                                        )}

                                        {groom.bio && (
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--wa-text-muted)', fontStyle: 'italic' }}>
                                                "{groom.bio}"
                                            </p>
                                        )}

                                        {groom.instagram && (
                                            <a 
                                                href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="wa-profile-social"
                                            >
                                                <i className="fab fa-instagram" /> Instagram
                                            </a>
                                        )}
                                    </div>
                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 4: Mempelai Wanita Profile */}
                        {bride && (
                            <Reveal className="wa-message-row wa-out" delay={150}>
                                <div className="wa-bubble">
                                    <div className="wa-profile-card">
                                        <div className="wa-profile-avatar">
                                            {showPhotos && bride.photo ? (
                                                <img 
                                                    src={getStorageUrl(bride.photo)} 
                                                    alt={bride.full_name} 
                                                    style={{
                                                        objectPosition: `${bride.photo_position_x ?? 50}% ${bride.photo_position_y ?? 50}%`,
                                                        transform: `scale(${bride.photo_zoom ?? 1.0})`,
                                                        transformOrigin: 'center'
                                                    }}
                                                />
                                            ) : (
                                                <div className="wa-profile-monogram">{bride.nickname?.charAt(0) || 'B'}</div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="wa-profile-title">{bride.full_name}</h4>
                                            <p className="wa-profile-desc">({bride.nickname})</p>
                                        </div>
                                        
                                        {((bride.father_name && bride.father_name.trim() !== '') || (bride.mother_name && bride.mother_name.trim() !== '')) && (
                                            <p className="wa-profile-parent">
                                                {translateChildOrder(bride.child_order, 'wanita')}<br />
                                                <strong>
                                                    {bride.father_name && bride.mother_name ? (
                                                        `Bapak ${bride.father_name} & Ibu ${bride.mother_name}`
                                                    ) : bride.father_name ? (
                                                        `Bapak ${bride.father_name}`
                                                    ) : (
                                                        `Ibu ${bride.mother_name}`
                                                    )}
                                                </strong>
                                            </p>
                                        )}

                                        {bride.bio && (
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--wa-text-muted)', fontStyle: 'italic' }}>
                                                "{bride.bio}"
                                            </p>
                                        )}

                                        {bride.instagram && (
                                            <a 
                                                href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="wa-profile-social"
                                            >
                                                <i className="fab fa-instagram" /> Instagram
                                            </a>
                                        )}
                                    </div>
                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                        <span className="wa-ticks">✓✓</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 5: Love Stories */}
                        {safeArr(loveStories).length > 0 && (
                            <>
                                <div id="love_story" className="wa-system-message select-none">
                                    ❤️ {isEn ? 'OUR STORY TRACKS' : 'KISAH CINTA KAMI'}
                                </div>
                                {safeArr(loveStories).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map((story, idx) => (
                                    <Reveal key={story.id || idx} className={`wa-message-row ${idx % 2 === 0 ? 'wa-in' : 'wa-out'}`} delay={100}>
                                        <div className="wa-bubble">
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: idx % 2 === 0 ? '#008069' : '#128c7e', 
                                                fontSize: '0.8rem', 
                                                display: 'block', 
                                                marginBottom: '4px' 
                                            }}>
                                                {story.title}
                                            </span>
                                            
                                            <div style={{ fontSize: '0.72rem', color: 'var(--wa-text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                                                📅 {story.story_date ? formatDate(story.story_date, activeLanguage) : `Chapter ${idx + 1}`}
                                            </div>
                                            
                                            <p style={{ margin: 0, fontSize: '0.85rem' }}>
                                                {story.description || story.story}
                                            </p>
                                            
                                            <div className="wa-meta">
                                                <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                {idx % 2 !== 0 && <span className="wa-ticks">✓✓</span>}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}
                            </>
                        )}

                        {/* SECTION 6: Live Location Countdown */}
                        {showCountdownInEvent && (
                            <Reveal className="wa-message-row wa-in" delay={150}>
                                <div className="wa-bubble" style={{ width: '100%' }}>
                                    <span style={{ fontWeight: 'bold', color: '#008069', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                        📍 Live Location (Countdown)
                                    </span>
                                    
                                    <div className="wa-countdown-card">
                                        <div className="wa-location-icon">
                                            <i className="fas fa-map-marker-alt animate-bounce" />
                                        </div>
                                        <div className="wa-countdown-timer">
                                            <span className="wa-countdown-label">
                                                {isEn ? 'LIVE TIMER IN PROGRESS' : 'HITUNG MUNDUR ACARA'}
                                            </span>
                                            
                                            <div className="wa-countdown-grid">
                                                <div className="wa-countdown-item">
                                                    <span className="wa-countdown-val">{pad2(timeLeft.days)}</span>
                                                    <span className="wa-countdown-sublabel">{t('invitation.days') || 'Hari'}</span>
                                                </div>
                                                <span>:</span>
                                                <div className="wa-countdown-item">
                                                    <span className="wa-countdown-val">{pad2(timeLeft.hours)}</span>
                                                    <span className="wa-countdown-sublabel">{t('invitation.hours') || 'Jam'}</span>
                                                </div>
                                                <span>:</span>
                                                <div className="wa-countdown-item">
                                                    <span className="wa-countdown-val">{pad2(timeLeft.minutes)}</span>
                                                    <span className="wa-countdown-sublabel">{t('invitation.minutes') || 'Menit'}</span>
                                                </div>
                                                <span>:</span>
                                                <div className="wa-countdown-item">
                                                    <span className="wa-countdown-val">{pad2(timeLeft.seconds)}</span>
                                                    <span className="wa-countdown-sublabel">{t('invitation.seconds') || 'Detik'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 7: Event Schedule list */}
                        {safeArr(events).length > 0 && (
                            <>
                                <div id="event" className="wa-system-message select-none">
                                    📅 {isEn ? 'WEDDING SCHEDULE' : 'JADWAL ACARA'}
                                </div>
                                {safeArr(events).map((ev, idx) => (
                                    <Reveal key={ev.id || idx} className={`wa-message-row ${idx % 2 === 0 ? 'wa-in' : 'wa-out'}`} delay={100}>
                                        <div className="wa-bubble" style={{ width: '100%', maxWidth: '340px' }}>
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: idx % 2 === 0 ? '#008069' : '#128c7e', 
                                                fontSize: '0.8rem', 
                                                display: 'block', 
                                                marginBottom: '4px' 
                                            }}>
                                                {ev.event_name || 'Acara'}
                                            </span>

                                            <div className="wa-event-card">
                                                <div className="wa-event-header">
                                                    📅 {ev.event_date ? formatDate(ev.event_date, activeLanguage) : ''}
                                                </div>
                                                <div className="wa-event-body">
                                                    <p className="wa-event-detail">
                                                        <i className="far fa-clock" style={{ color: '#008069' }} />
                                                        {ev.start_time ? formatTime(ev.start_time) : ''} {ev.timezone || 'WIB'} {ev.end_time ? `- ${formatTime(ev.end_time)}` : (isEn ? ' - Finished' : ' - Selesai')}
                                                    </p>
                                                    <p className="wa-event-detail">
                                                        <i className="fas fa-map-marker-alt" style={{ color: '#e23b3b' }} />
                                                        <strong>{ev.venue_name}</strong>
                                                    </p>
                                                    <p className="wa-event-detail" style={{ paddingLeft: '20px' }}>
                                                        {ev.venue_address}
                                                    </p>
                                                    
                                                    <div className="wa-event-actions">
                                                        {ev.gmaps_link && (
                                                            <a href={ev.gmaps_link} target="_blank" rel="noopener noreferrer" className="wa-btn wa-btn-primary">
                                                                <i className="fas fa-location-arrow" /> {isEn ? 'Get Maps' : 'Buka Peta'}
                                                            </a>
                                                        )}
                                                        <a href={getCalUrl(ev)} target="_blank" rel="noopener noreferrer" className="wa-btn wa-btn-outline">
                                                            <i className="far fa-calendar-plus" /> {isEn ? 'Save Event' : 'Simpan Kalender'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="wa-meta">
                                                <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                {idx % 2 !== 0 && <span className="wa-ticks">✓✓</span>}
                                            </div>
                                        </div>
                                    </Reveal>
                                ))}

                                {/* Compact standalone Dress Code box below event list */}
                                {safeArr(events)?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <Reveal key={`dc-${idx}`} className="wa-message-row wa-in" delay={150} style={{ width: '100%' }}>
                                        <div className="wa-bubble" style={{ width: '100%', maxWidth: '340px' }}>
                                            <DressCodeBlock event={ev} colors={{ primary: '#008069', text: 'var(--wa-text-main)' }} fonts={{ heading: 'inherit' }} variant="app" plain={true} />
                                        </div>
                                    </Reveal>
                                ))}

                                {/* Compact standalone Dress Code box below event list */}
                                {safeArr(events)?.filter(ev => ev.show_dress_code).map((ev, idx) => (
                                    <div key={`dc-${idx}`} className="w-full max-w-md mx-auto mt-4 px-4 pb-2">
                                    </div>
                                ))}
                            </>
                        )}

                        {/* SECTION 8: Live Streaming platform link */}
                        {hasStream && (
                            <Reveal className="wa-message-row wa-in" id="livestream" delay={150}>
                                <div className="wa-bubble" style={{ width: '100%' }}>
                                    <span style={{ fontWeight: 'bold', color: '#008069', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                        📹 Live Stream Link
                                    </span>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>
                                        {isEn 
                                            ? 'You are invited to join our broadcast virtually through the channels below:' 
                                            : 'Kami mengundang Anda untuk menyaksikan siaran langsung pernikahan kami secara virtual:'}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {streamsList.map((stream, idx) => (
                                            <button 
                                                key={idx} 
                                                type="button" 
                                                onClick={() => window.open(stream.url, '_blank')} 
                                                className="wa-btn wa-btn-primary" 
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                                            >
                                                <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 9: Gallery Album grid */}
                        {galleryItems.length > 0 && (
                            <>
                                <div id="gallery" className="wa-system-message select-none">
                                    📷 {isEn ? 'SHARED GALLERY ALBUM' : 'ALBUM GALERI BERSAMA'}
                                </div>
                                <Reveal className="wa-message-row wa-out" delay={200}>
                                    <div className="wa-bubble" style={{ width: '100%' }}>
                                        <span style={{ fontWeight: 'bold', color: '#128c7e', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                            📁 {isEn ? 'Album Sent' : 'Album Terkirim'}
                                        </span>
                                        
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: galleryItems.length >= 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                                            gap: '4px',
                                            borderRadius: '6px',
                                            overflow: 'hidden',
                                            backgroundColor: '#efeae2',
                                            padding: '4px'
                                        }}>
                                            {galleryItems.map((item, idx) => (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => setActiveLightBoxIdx(idx)}
                                                    style={{ 
                                                        cursor: 'pointer', 
                                                        position: 'relative', 
                                                        aspectRatio: '1', 
                                                        overflow: 'hidden',
                                                        borderRadius: '4px' 
                                                    }}
                                                >
                                                    <img 
                                                        src={item.src} 
                                                        alt={item.title} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                        loading="lazy" 
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backgroundColor: 'rgba(0,0,0,0)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'background-color 0.2s'
                                                    }} className="wa-photo-overlay-hover">
                                                        <i className="fas fa-search-plus" style={{ color: '#fff', fontSize: '14px', opacity: 0 }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <p style={{ margin: '8px 0 0 0', fontSize: '0.82rem', color: 'var(--wa-text-muted)' }}>
                                            {isEn 
                                                ? `Shared ${galleryItems.length} media tracks. Tap to expand.` 
                                                : `Membagikan ${galleryItems.length} media. Ketuk untuk memperbesar.`}
                                        </p>

                                        <div className="wa-meta">
                                            <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                            <span className="wa-ticks">✓✓</span>
                                        </div>
                                    </div>
                                </Reveal>
                            </>
                        )}

                        {/* SECTION 9.5: Video Album Bubble */}
                        {hasVideos && (
                            <>
                                <div id="video" className="wa-system-message select-none">
                                    🎥 {isEn ? 'SHARED VIDEO GALLERY' : 'ALBUM GALERI VIDEO'}
                                </div>
                                <Reveal className="wa-message-row wa-out" delay={200}>
                                    <div className="wa-bubble" style={{ width: '100%' }}>
                                        <span style={{ fontWeight: 'bold', color: '#128c7e', fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>
                                            📁 {isEn ? 'Videos Sent' : 'Video Terkirim'}
                                        </span>
                                        
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            width: '100%',
                                        }}>
                                            {videoItems.map((item, idx) => (
                                                <div key={idx} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {videoItems.length > 1 && (
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--wa-text-muted)', fontWeight: 600 }}>
                                                            {item.title}
                                                        </span>
                                                    )}
                                                    <div style={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        aspectRatio: '16/9',
                                                        overflow: 'hidden',
                                                        borderRadius: '6px',
                                                        backgroundColor: '#000',
                                                        border: '1px solid rgba(0, 128, 105, 0.2)'
                                                    }}>
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
                                            ))}
                                        </div>
                                        <div className="wa-meta">
                                            <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                            <span className="wa-ticks">✓✓</span>
                                        </div>
                                    </div>
                                </Reveal>
                            </>
                        )}

                        {/* SECTION 10: RSVP Form input */}
                        {(enableRsvp || enableWishes) && (
                            <Reveal className="wa-message-row wa-in" id="rsvp" delay={200}>
                                <div className="wa-bubble" style={{ width: '100%' }}>
                                    <span style={{ fontWeight: 'bold', color: '#008069', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                        📬 Reply & RSVP Status
                                    </span>
                                    
                                    <div className="wa-rsvp-reply-container">
                                        <div className="wa-rsvp-reply-title">
                                            {groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Wedding RSVP'}
                                        </div>
                                        <div className="wa-rsvp-reply-text">
                                            {isEn ? 'Will you attend our wedding?' : 'Apakah Anda akan hadir di hari bahagia kami?'}
                                        </div>
                                    </div>

                                    {formSubmitted ? (
                                        <div style={{
                                            padding: '12px',
                                            backgroundColor: 'rgba(37, 211, 102, 0.1)',
                                            color: '#008069',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            marginBottom: '10px'
                                        }}>
                                            🎉 {isEn ? 'Thank you! Your response has been recorded.' : 'Terima kasih! Konfirmasi kehadiran Anda berhasil dikirim.'}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRsvpSubmit}>
                                            <div className="wa-form-group">
                                                <label>{isEn ? 'Full Name' : 'Nama Lengkap'}</label>
                                                <input 
                                                    type="text" 
                                                    value={rsvpForm.data.sender_name}
                                                    onChange={e => rsvpForm.setData('sender_name', e.target.value)}
                                                    required 
                                                    className="wa-input"
                                                    placeholder={isEn ? 'Your name' : 'Nama Anda'}
                                                />
                                            </div>

                                            {enableRsvp && (
                                                <>
                                                    <div className="wa-form-group">
                                                        <label>{isEn ? 'Attendance Status' : 'Konfirmasi Kehadiran'}</label>
                                                        <select
                                                            value={rsvpForm.data.attendance}
                                                            onChange={e => rsvpForm.setData('attendance', e.target.value)}
                                                            className="wa-select"
                                                        >
                                                            <option value="hadir">{isEn ? 'Yes, I will attend' : 'Ya, Saya akan hadir'}</option>
                                                            <option value="tidak_hadir">{isEn ? 'No, I cannot attend' : 'Maaf, Saya tidak bisa hadir'}</option>
                                                            <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum pasti'}</option>
                                                        </select>
                                                    </div>

                                                    {rsvpForm.data.attendance === 'hadir' && (
                                                        <div className="wa-form-group">
                                                            <label>{isEn ? 'Number of Guests' : 'Jumlah Tamu'}</label>
                                                            <select
                                                                value={rsvpForm.data.number_of_guests}
                                                                onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value, 10))}
                                                                className="wa-select"
                                                            >
                                                                {[1, 2, 3, 4, 5].map(n => (
                                                                    <option key={n} value={n}>{n} {isEn ? 'Person' : 'Orang'}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            <div className="wa-form-group">
                                                <label>{isEn ? 'Wishes / Doa Restu' : 'Doa Restu / Ucapan'}</label>
                                                <textarea
                                                    value={rsvpForm.data.message}
                                                    onChange={e => rsvpForm.setData('message', e.target.value)}
                                                    required
                                                    rows="3"
                                                    className="wa-textarea"
                                                    placeholder={isEn ? 'Write your wishes...' : 'Tulis ucapan selamat Anda...'}
                                                />
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={rsvpForm.processing}
                                                className="wa-btn wa-btn-primary"
                                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                                            >
                                                <i className="fas fa-paper-plane" /> {isEn ? 'Send Confirmation' : 'Kirim Konfirmasi'}
                                            </button>
                                        </form>
                                    )}

                                    {/* Wishes list display */}
                                    {recentWishes.length > 0 && (
                                        <div className="wa-wishes-list">
                                            {recentWishes.map((w, idx) => (
                                                <div key={w.id || idx} className="wa-wish-item">
                                                    <div className="wa-wish-sender">{w.sender_name}</div>
                                                    <div className="wa-wish-msg">{w.message}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 11: Bank accounts card */}
                        {safeArr(bankAccounts).length > 0 && (
                            <Reveal className="wa-message-row wa-in" id="bank" delay={200}>
                                <div className="wa-bubble" style={{ width: '100%' }}>
                                    <span style={{ fontWeight: 'bold', color: '#008069', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                        🎁 Gift & Support (Digital Envelope)
                                    </span>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>
                                        {isEn 
                                            ? 'Your blessing is our greatest gift. However, if you wish to share a digital gift, you can send it through:' 
                                            : 'Doa restu Anda adalah kado terindah bagi kami. Namun apabila Anda ingin memberikan tanda kasih secara digital, dapat disalurkan melalui:'}
                                    </p>

                                    {safeArr(bankAccounts).map((acc, idx) => {
                                        const isCopied = copiedIdx === idx;
                                        const copyNumber = () => {
                                            if (navigator.clipboard && window.isSecureContext) {
                                                navigator.clipboard.writeText(acc.account_number).then(() => {
                                                    setCopiedIdx(idx);
                                                    setTimeout(() => setCopiedIdx(null), 2000);
                                                }).catch(() => {
                                                    fallbackCopy(acc.account_number);
                                                    setCopiedIdx(idx);
                                                    setTimeout(() => setCopiedIdx(null), 2000);
                                                });
                                            } else {
                                                fallbackCopy(acc.account_number);
                                                setCopiedIdx(idx);
                                                setTimeout(() => setCopiedIdx(null), 2000);
                                            }
                                        };

                                        return (
                                            <div key={acc.id || idx} className="wa-bank-card">
                                                <h5 className="wa-bank-name">{acc.bank_name}</h5>
                                                <span className="wa-bank-number">{acc.account_number}</span>
                                                <span className="wa-bank-holder">a.n. {acc.account_holder || acc.account_name}</span>
                                                <button type="button" onClick={copyNumber} className="wa-bank-copy-btn">
                                                    {isCopied ? (isEn ? 'Copied!' : 'Tersalin!') : (isEn ? 'Copy' : 'Salin')}
                                                </button>
                                            </div>
                                        );
                                    })}

                                    <div className="wa-meta">
                                        <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    </div>
                                </div>
                            </Reveal>
                        )}

                        {/* SECTION 12: Closing / Footer signatures */}
                        <Reveal className="wa-message-row wa-in" delay={150}>
                            <div className="wa-bubble">
                                <span style={{ fontWeight: 'bold', color: '#008069', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>
                                    {bride.nickname || 'Bride'}
                                </span>
                                
                                <div style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '6px', color: '#075E54' }}>
                                    {invitation?.closing_title || (isEn ? 'Thank You' : 'Terima Kasih')}
                                </div>
                                
                                <p style={{ margin: 0 }}>
                                    {invitation?.closing_text || (isEn 
                                        ? 'It is an honor for us if you could attend and bless our wedding. Thank you.'
                                        : 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir di hari bahagia kami.'
                                    )}
                                </p>

                                <div style={{ 
                                    marginTop: '12px', 
                                    paddingTop: '8px', 
                                    borderTop: '1px solid #e9edef', 
                                    fontSize: '0.82rem', 
                                    fontWeight: '600',
                                    color: '#075E54' 
                                }}>
                                    {isEn ? 'Family of Mr. & Mrs.' : 'Kami yang berbahagia, Keluarga:'}<br />
                                    {groom.father_name && groom.mother_name && (
                                        <span>— Kel. Bapak {groom.father_name} & Ibu {groom.mother_name}</span>
                                    )}
                                    <br />
                                    {bride.father_name && bride.mother_name && (
                                        <span>— Kel. Bapak {bride.father_name} & Ibu {bride.mother_name}</span>
                                    )}
                                </div>

                                <div className="wa-meta">
                                    <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                </div>
                            </div>
                        </Reveal>

                        {/* Watermark brand reseller */}
                        <div className="wa-watermark">
                            Made with ❤️ by {brandName}
                        </div>

                    </div>

                    {/* Bottom input bar decoration */}
                    <BottomBar language={activeLanguage} onSend={handleBottomBarSend} />

                    {/* Floating Controls for Fullscreen / Music */}
                    <div className="wa-floating-controls select-none">
                        <button 
                            type="button" 
                            className={`wa-float-btn${autoScrollEnabled ? ' active' : ''}`} 
                            onClick={() => setAutoScrollEnabled(!autoScrollEnabled)} 
                            title={autoScrollEnabled ? (isEn ? 'Pause Auto Scroll' : 'Jeda Gulir') : (isEn ? 'Play Auto Scroll' : 'Mulai Gulir')}
                        >
                            <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-arrow-down"} />
                        </button>
                        <button type="button" className="wa-float-btn" onClick={toggleFullscreen} title="Layar Penuh">
                            <i className={isFullscreen ? "fas fa-compress" : "fas fa-expand"} />
                        </button>
                        <button type="button" className="wa-float-btn" onClick={toggleMusic} title="Putar Musik">
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
                    </div>

                    {/* QR Code Checkin Modal */}
                    {enableQr && showQr && activeGuest && (
                        <div className="wa-modal-overlay animate-in fade-in duration-200" onClick={() => setShowQr(false)}>
                            <div className="wa-modal-card animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                                <h3 className="wa-modal-title">{isEn ? 'QR Code Attendance' : 'Presensi Tamu QR'}</h3>
                                <p style={{ fontSize: '0.95rem', fontWeight: 'bold', margin: '0 0 16px 0', color: '#075E54' }}>
                                    {activeGuest.name}
                                </p>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=008069&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`}
                                    alt="QR Code"
                                    className="wa-qr-img"
                                />
                                <p className="wa-modal-desc">
                                    {isEn 
                                        ? 'Present this QR code to the event coordinators at the reception desk.' 
                                        : 'Tunjukkan QR code ini kepada petugas penerima tamu di lokasi acara.'}
                                </p>
                                <button type="button" onClick={() => setShowQr(false)} className="wa-btn wa-btn-primary" style={{ width: '100%' }}>
                                    {isEn ? 'Close' : 'Tutup'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Lightbox / Theater Mode Modal for gallery media */}
                    {activeLightBoxIdx !== null && (
                        <div className="wa-lightbox-overlay animate-in fade-in duration-200" onClick={handleCloseLightbox}>
                            <button type="button" className="wa-lightbox-close" onClick={handleCloseLightbox}>
                                &times;
                            </button>
                            
                            {/* Prev button */}
                            {galleryItems.length > 1 && (
                                <button 
                                    type="button" 
                                    className="wa-lightbox-nav wa-lightbox-nav-left"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLightBoxIdx(prev => (prev === 0 ? galleryItems.length - 1 : prev - 1));
                                    }}
                                >
                                    &#8249;
                                </button>
                            )}

                            {/* Next button */}
                            {galleryItems.length > 1 && (
                                <button 
                                    type="button" 
                                    className="wa-lightbox-nav wa-lightbox-nav-right"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveLightBoxIdx(prev => (prev === galleryItems.length - 1 ? 0 : prev + 1));
                                    }}
                                >
                                    &#8250;
                                </button>
                            )}

                            {/* Theater frame content */}
                            <div className="wa-lightbox-content" onClick={e => e.stopPropagation()}>
                                <img 
                                    src={galleryItems[activeLightBoxIdx].src} 
                                    alt={galleryItems[activeLightBoxIdx].title} 
                                    className="wa-lightbox-img"
                                />
                            </div>

                            {/* Caption info under media */}
                            <div className="wa-lightbox-caption" onClick={e => e.stopPropagation()}>
                                <div className="wa-lightbox-title">
                                    {galleryItems[activeLightBoxIdx].title}
                                </div>
                                <div>
                                    WhatsApp High-Quality Photo
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}

export default function WhatsappTheme(props) {
    return (
        <ErrorBoundary>
            <WhatsappThemeContent {...props} />
        </ErrorBoundary>
    );
}
