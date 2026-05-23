import { useTranslation } from '@/i18n';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import './style.css';
import ParticleEffect from '@/Components/ParticleEffect';

// Import theme assets via Vite
import logoDana from './asset/dana-logo.png';
import logoBca from './asset/bca-logo.png';
import chipAtm from './asset/chip-atm.png';
import flowerBg from './asset/Picture5-1-1-1.webp';
import bgBank from './asset/bg-bank-1-1.webp';
import defaultCover from './asset/default-cover.jpg';
import defaultGroom from './asset/default-groom.jpg';
import defaultBride from './asset/default-bride.jpg';

const ASSETS = {
    dana: logoDana,
    bca: logoBca,
    chip: chipAtm,
    flower: flowerBg,
    bankBg: bgBank,
    cover: defaultCover,
    groom: defaultGroom,
    bride: defaultBride,
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
   SCROLL REVEAL COMPONENT (Exit & Re-entry Tracking)
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', variant = 'up', delay = 0 }) {
    const { t } = useTranslation();
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            setVisible(e.isIntersecting);
        }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    let baseClass = 'lx1-reveal--up';
    if (variant === 'zoom') baseClass = 'lx1-reveal--zoom';
    else if (variant === 'left') baseClass = 'lx1-reveal--left';
    else if (variant === 'right') baseClass = 'lx1-reveal--right';
    else if (variant === 'down') baseClass = 'lx1-reveal--down';

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
   COUNTDOWN SUB-COMPONENT (Integrated into Event Section)
   ═══════════════════════════════════════ */
function CountdownBlock({ targetDate }) {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!targetDate) return;
        const target = new Date(targetDate).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="lx1-countdown-container">
            <div className="lx1-countdown-title">Save The Date</div>
            <div className="lx1-countdown-units">
                <div className="lx1-countdown-unit">
                    <span className="lx1-countdown-num">{pad2(timeLeft.days)}</span>
                    <span className="lx1-countdown-label">{t('invitation.days')}</span>
                </div>
                <div className="lx1-countdown-unit">
                    <span className="lx1-countdown-num">{pad2(timeLeft.hours)}</span>
                    <span className="lx1-countdown-label">{t('invitation.hours')}</span>
                </div>
                <div className="lx1-countdown-unit">
                    <span className="lx1-countdown-num">{pad2(timeLeft.minutes)}</span>
                    <span className="lx1-countdown-label">{t('invitation.minutes')}</span>
                </div>
                <div className="lx1-countdown-unit">
                    <span className="lx1-countdown-num">{pad2(timeLeft.seconds)}</span>
                    <span className="lx1-countdown-label">{t('invitation.seconds')}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT: DynamicIndex
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
}) {
    const { t } = useTranslation(invitation?.language || 'id');
    // Autoplay states
    const [isOpened, setIsOpened] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(invitation?.enable_auto_scroll !== false);

    // Navigation and slide indexes
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [activeSectionId, setActiveSectionId] = useState('opening');
    const [activeMenuId, setActiveMenuId] = useState('opening');
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [lightboxImg, setLightboxImg] = useState(null);

    // Fallback guests
    const activeGuest = guest || { name: 'Tamu Undangan', slug: 'tamu' };

    // Boolean features
    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);
    const enableQr = parseBool(invitation?.enable_qr) && parseBool(invitation?.show_qr_code);
    const showCountdown = parseBool(invitation?.show_countdown);
    const layoutMode = invitation?.layout_mode || 'scroll';
    const isSlideMode = layoutMode === 'slide-h' || layoutMode === 'slide-v' || layoutMode === 'slide';

    // Menu Position auto-fallback
    let menuPosition = invitation?.menu_position || 'none';
    if (isSlideMode && (menuPosition === 'none' || !menuPosition)) {
        menuPosition = 'bottom';
    }
    const showMenu = menuPosition !== 'none';

    // Set Document Title
    useEffect(() => {
        const couples = safeArr(brideGrooms);
        const groom = couples.find(b => b.gender === 'pria');
        const bride = couples.find(b => b.gender === 'wanita');
        if (groom && bride) {
            document.title = `${groom.nickname} & ${bride.nickname} - The Wedding`;
        } else {
            document.title = invitation?.opening_title || 'The Wedding Invitation';
        }
    }, [brideGrooms, invitation]);

    // Expose signature couples names
    const signature = useMemo(() => safeArr(brideGrooms).map(b => b.nickname).join(' & '), [brideGrooms]);

    // Copy Account Numbers
    const copyToClipboard = (text, idx) => {
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
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textArea.setSelectionRange(0, 999999);

        try {
            const successful = document.execCommand('copy');
            selection.removeAllRanges();
            document.body.removeChild(textArea);
            if (successful) {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 2000);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            selection.removeAllRanges();
            document.body.removeChild(textArea);
        }
    };

    // Toggle Music Playback
    const onToggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true)).catch(() => { });
        }
    };

    // Open Invitation
    const handleOpenInvitation = () => {
        setIsOpened(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
        }
        // Mark opened in DB if guest id exists
        if (guest?.id) {
            fetch(route('invitation.markOpened', invitation.slug), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ guest_id: guest.id })
            }).catch(() => { });
        }
    };

    // Resolve Sections and Order
    const resolvedSections = useMemo(() => {
        const safeSections = safeArr(sections);
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing'];
        const resolved = [];

        // Prepend virtual hero/slideshow section
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
                
                // Countdown is integrated into Event section
                if (s.section_key === 'countdown') return;

                // Merge wishes vertically inside RSVP page
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return;
                    if (enableRsvp) return; // merged in RSVP menu
                }

                resolved.push(s);
            });
        } else {
            // Fallback list
            const fallbacks = [
                { section_key: 'opening' },
                { section_key: 'bride_groom' },
                { section_key: 'event' },
            ];
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
    }, [sections, loveStories, galleries, bankAccounts, enableRsvp, enableWishes]);

    // Active navigation item tracking based on active slide or scroll positions
    useEffect(() => {
        if (isSlideMode && resolvedSections[activeSlideIdx]) {
            let key = resolvedSections[activeSlideIdx].section_key;
            if (key === 'wishes' && enableRsvp) {
                key = 'rsvp';
            }
            if (key === 'hero') {
                setActiveSectionId('opening');
            } else {
                setActiveSectionId(key);
            }
        }
    }, [isSlideMode, activeSlideIdx, resolvedSections, enableRsvp]);

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

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpened, isSlideMode, resolvedSections, enableRsvp]);

    // Sync menu items indicator (highlights merged RSVP & wishes together)
    useEffect(() => {
        let menuId = activeSectionId;
        if (menuId === 'wishes' && enableRsvp) {
            menuId = 'rsvp';
        }
        setActiveMenuId(menuId);
    }, [activeSectionId, enableRsvp]);

    // Auto scroll logic
    useEffect(() => {
        if (!isOpened || !autoScrollEnabled) return;

        let timer = null;

        if (isSlideMode) {
            timer = setInterval(() => {
                setActiveSlideIdx(prev => {
                    const count = resolvedSections.length;
                    if (prev >= count - 1) {
                        return 0; // loop back to first slide
                    }
                    return prev + 1;
                });
            }, 4000);
        } else {
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
    }, [isOpened, autoScrollEnabled, isSlideMode, resolvedSections.length]);

    // Slide controllers
    const nextSlide = () => {
        setActiveSlideIdx(prev => Math.min(prev + 1, resolvedSections.length - 1));
    };

    const prevSlide = () => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    };

    const scrollToSection = (id) => {
        if (isSlideMode) {
            const idx = resolvedSections.findIndex(s => {
                if (s.section_key === id) return true;
                if (id === 'rsvp' && s.section_key === 'wishes' && enableRsvp) return true;
                return false;
            });
            if (idx !== -1) {
                setActiveSlideIdx(idx);
            }
        } else {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                setActiveSectionId(id);
            }
        }
    };

    // Touch Swipe Mechanics
    const touchStart = useRef({ x: 0, y: 0, time: 0, atTop: false, atBottom: false });
    const isDragging = useRef(false);

    const handlePointerDown = (clientX, clientY, target) => {
        isDragging.current = true;
        let atTop = false;
        let atBottom = false;

        if (target && typeof target.closest === 'function') {
            const scrollable = target.closest('.lx1-slide-container');
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

        if (layoutMode === 'slide-h') {
            if ((Math.abs(diffX) > Math.abs(diffY)) && (Math.abs(diffX) > threshold || isFastSwipe)) {
                if (diffX < 0) nextSlide();
                else prevSlide();
            }
        } else {
            // slide-v or legacy slide
            if ((Math.abs(diffY) > Math.abs(diffX)) && (Math.abs(diffY) > threshold || isFastSwipe)) {
                const scrollable = target && typeof target.closest === 'function' ? target.closest('.lx1-slide-container') : null;
                if (scrollable) {
                    const isAtTop = touchStart.current.atTop;
                    const isAtBottom = touchStart.current.atBottom;

                    if (diffY < 0 && isAtBottom) nextSlide();
                    else if (diffY > 0 && isAtTop) prevSlide();
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

    // Forms handling
    const rsvpForm = useForm({ attendance: 'hadir', number_of_guests: 1, name: activeGuest.name });
    const wishForm = useForm({ sender_name: activeGuest.name, message: '' });

    const handleRsvpSubmit = (e) => {
        e.preventDefault();
        rsvpForm.post(route('invitation.rsvp', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => alert('Konfirmasi kehadiran berhasil dikirim.')
        });
    };

    const handleWishSubmit = (e) => {
        e.preventDefault();
        wishForm.post(route('invitation.wish', invitation.slug), {
            preserveScroll: true,
            onSuccess: () => {
                wishForm.reset('message');
            }
        });
    };

    // Shared Menu Item Generator
    const menuItems = useMemo(() => {
        const items = [];
        const validKeys = resolvedSections.map(s => s.section_key);

        resolvedSections.forEach(s => {
            const key = s.section_key;
            if (key === 'cover' || key === 'hero') return;

            if (key === 'opening') {
                items.push({ id: 'opening', label: t('nav.opening'), icon: 'fas fa-book-open' });
            } else if (key === 'bride_groom') {
                items.push({ id: 'bride_groom', label: t('nav.mempelai'), icon: 'fas fa-heart' });
            } else if (key === 'event') {
                items.push({ id: 'event', label: t('nav.acara'), icon: 'far fa-calendar-alt' });
            } else if (key === 'love_story') {
                items.push({ id: 'love_story', label: t('nav.kisah'), icon: 'fas fa-history' });
            } else if (key === 'gallery') {
                items.push({ id: 'gallery', label: t('nav.galeri'), icon: 'far fa-images' });
            } else if (key === 'rsvp') {
                items.push({ id: 'rsvp', label: t('nav.rsvp'), icon: 'fas fa-envelope' });
            } else if (key === 'wishes') {
                const hasRsvp = validKeys.includes('rsvp') || enableRsvp;
                if (!hasRsvp) {
                    items.push({ id: 'wishes', label: t('invitation.wishes_title'), icon: 'fas fa-envelope' });
                }
            } else if (key === 'bank') {
                items.push({ id: 'bank', label: t('nav.hadiah'), icon: 'fas fa-gift' });
            } else if (key === 'closing') {
                items.push({ id: 'closing', label: t('nav.penutup'), icon: 'fas fa-door-open' });
            }
        });

        return items;
    }, [resolvedSections, enableRsvp, enableWishes]);

    // Background Photos - stability hook
    const coverBgUrl = useMemo(() => {
        return getStorageUrl(invitation?.cover_image, ASSETS.cover);
    }, [invitation]);

    const storyBgUrl = useMemo(() => {
        const list = safeArr(galleries);
        if (list.length > 0) {
            const item = list[Math.floor(Math.random() * list.length)];
            return getStorageUrl(item.image_path || item.image_url, ASSETS.cover);
        }
        return coverBgUrl;
    }, [galleries, coverBgUrl]);

    // Modals
    const [showQr, setShowQr] = useState(false);

    /* ═══════════════════════════════════════
       RENDER SECTION COMPONENTS
       ═══════════════════════════════════════ */

    // Render 1. Opening
    const renderOpening = () => {
        const hasCoverPhoto = !!invitation?.cover_image;
        const couples = safeArr(brideGrooms);
        const coupleNames = couples.map(b => b.nickname).join(' & ');
        const dateStr = formatDate(invitation?.wedding_date || events?.[0]?.event_date);

        if (hasCoverPhoto) {
            return (
                <section id="opening" className="lx1-section lx1-section-opening lx1-opening-photo-mode" style={{ backgroundImage: `url(${getStorageUrl(invitation.cover_image)})` }}>
                    <div className="lx1-section-content">
                        <Reveal variant="down">
                            <h3 className="lx1-title-photo">{t('invitation.wedding_of')}</h3>
                        </Reveal>
                        <Reveal variant="zoom" delay={150}>
                            <h1 className="lx1-names-photo">
                                {couples[0]?.nickname || 'Habib'}
                                {couples[1]?.nickname && (
                                    <>
                                        <br />
                                        &amp; {couples[1].nickname}
                                    </>
                                )}
                            </h1>
                        </Reveal>
                        <Reveal variant="up" delay={250}>
                            <div className="lx1-date-photo">{dateStr}</div>
                        </Reveal>
                        <Reveal variant="up" delay={350}>
                            <button className="lx1-btn-save-date" onClick={() => {
                                const target = invitation?.countdown_target_date || '2026-12-20 08:00:00';
                                const dateClean = target.replace(/[- :]/g, '');
                                window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=The+Wedding+of+${encodeURIComponent(coupleNames)}&dates=${dateClean}Z%2F${dateClean}Z`, '_blank');
                            }}>
                                <i className="fas fa-envelope" />
                                <span>{t('invitation.save_the_date')}</span>
                            </button>
                        </Reveal>
                    </div>
                </section>
            );
        } else {
            return (
                <section id="opening" className="lx1-section lx1-section-opening lx1-opening-watermark-mode">
                    <div className="lx1-section-content">
                        <Reveal variant="down">
                            <h3 className="lx1-opening-title">{t('invitation.wedding_of').toUpperCase()}</h3>
                        </Reveal>
                        <Reveal variant="zoom" delay={150}>
                            <h1 className="lx1-opening-names">{coupleNames}</h1>
                        </Reveal>
                        <div className="lx1-scroll-indicator">
                            <span>{layoutMode === 'slide-h' ? 'Geser Kanan' : 'Gulir Bawah'}</span>
                            <i className={layoutMode === 'slide-h' ? 'fas fa-chevron-right lx1-indicator-arrow-right' : 'fas fa-chevron-down lx1-indicator-arrow-down'} />
                        </div>
                        <Reveal variant="up" delay={250}>
                            <div className="lx1-opening-date">{dateStr}</div>
                        </Reveal>
                    </div>
                </section>
            );
        }
    };

    // Render 2. Mempelai (Bride & Groom)
    const renderBrideGroom = () => {
        const couples = safeArr(brideGrooms);
        // Use gender field with fallback to index for robustness
        const groom = couples.find(b => b.gender === 'pria') || couples.find(b => b.gender === 'male') || couples[1];
        const bride = couples.find(b => b.gender === 'wanita') || couples.find(b => b.gender === 'female') || couples[0];
        const monogram = couples.map(b => b.nickname ? b.nickname.charAt(0) : '').join('&');

        return (
            <section id="bride_groom" className="lx1-section lx1-section-mempelai">
                <div className="lx1-section-content">
                    <Reveal variant="down">
                        <div className="lx1-monogram-container">
                            <div className="lx1-monogram">{monogram}</div>
                            <div className="lx1-monogram-divider" />
                        </div>
                    </Reveal>

                    {invitation?.opening_text && (
                        <Reveal variant="zoom" delay={100}>
                            <div className="lx1-quote">
                                {invitation.opening_text}
                                <div className="lx1-quote-source">QS Ar-Rum 21</div>
                            </div>
                        </Reveal>
                    )}

                    <div className="lx1-mempelai-cards">
                        {groom && (
                            <div className="lx1-mempelai-card lx1-mempelai-groom">
                                <Reveal variant="left">
                                    <div className="lx1-mempelai-photo-wrapper">
                                        <img 
                                            src={getStorageUrl(groom.photo, ASSETS.groom)} 
                                            alt={groom.nickname} 
                                            className="lx1-mempelai-photo" 
                                        />
                                    </div>
                                    <div className="lx1-mempelai-details">
                                        <h2 className="lx1-mempelai-fullname">{groom.full_name}</h2>
                                        <div className="lx1-mempelai-parents">
                                            {groom.gender === 'wanita' ? t('invitation.daughter_of') : t('invitation.son_of')} <strong>{groom.father_name}</strong><br />
                                            &amp; <strong>{groom.mother_name}</strong>
                                        </div>
                                        {groom.instagram && (
                                            <a href={`https://instagram.com/${groom.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="lx1-mempelai-ig">
                                                <i className="fab fa-instagram" />
                                            </a>
                                        )}
                                    </div>
                                </Reveal>
                            </div>
                        )}

                        {bride && (
                            <div className="lx1-mempelai-card lx1-mempelai-bride">
                                <Reveal variant="right">
                                    <div className="lx1-mempelai-photo-wrapper">
                                        <img 
                                            src={getStorageUrl(bride.photo, ASSETS.bride)} 
                                            alt={bride.nickname} 
                                            className="lx1-mempelai-photo" 
                                        />
                                    </div>
                                    <div className="lx1-mempelai-details">
                                        <h2 className="lx1-mempelai-fullname">{bride.full_name}</h2>
                                        <div className="lx1-mempelai-parents">
                                            {bride.gender === 'pria' ? t('invitation.son_of') : t('invitation.daughter_of')} <strong>{bride.father_name}</strong><br />
                                            &amp; <strong>{bride.mother_name}</strong>
                                        </div>
                                        {bride.instagram && (
                                            <a href={`https://instagram.com/${bride.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="lx1-mempelai-ig">
                                                <i className="fab fa-instagram" />
                                            </a>
                                        )}
                                    </div>
                                </Reveal>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    // Render 3. Acara & Countdown
    const renderEvent = () => {
        const sortedEvents = safeArr(events);
        const primaryEvent = sortedEvents.find(e => e.is_primary) || sortedEvents[0];

        return (
            <section id="event" className="lx1-section lx1-section-event">
                <div className="lx1-section-content">
                    {/* Integrated Countdown */}
                    {showCountdown && primaryEvent?.event_date && (
                        <Reveal variant="down">
                            <CountdownBlock targetDate={primaryEvent.event_date} />
                        </Reveal>
                    )}

                    <Reveal variant="zoom">
                        <h2 className="lx1-section-title">{t('invitation.rangkaian_acara')}</h2>
                    </Reveal>

                    <div className="lx1-event-cards">
                        {sortedEvents.map((evt, idx) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <Reveal key={evt.id || idx} variant={isEven ? 'left' : 'right'} className="lx1-event-card">
                                    {/* Curved top card header image */}
                                    <img 
                                        src={evt.cover_image ? getStorageUrl(evt.cover_image) : (safeArr(galleries).length > 0 ? getStorageUrl(safeArr(galleries)[idx % safeArr(galleries).length].image_path || safeArr(galleries)[idx % safeArr(galleries).length].image_url) : ASSETS.cover)} 
                                        alt={evt.event_name} 
                                        className="lx1-event-card-header-img"
                                    />
                                    <div className="lx1-event-card-body">
                                        <h3 className="lx1-event-name">{evt.event_name}</h3>
                                        
                                        <div className="lx1-event-detail-item">
                                            <i className="far fa-calendar-alt lx1-event-icon" />
                                            <span>{formatDate(evt.event_date)}</span>
                                        </div>

                                        <div className="lx1-event-detail-item">
                                            <i className="far fa-clock lx1-event-icon" />
                                            <span>Pukul {formatTime(evt.start_time)} - {evt.end_time === '23:59:00' ? 'Selesai' : formatTime(evt.end_time)}</span>
                                        </div>

                                        <div className="lx1-event-detail-item">
                                            <i className="fas fa-map-marker-alt lx1-event-icon" />
                                            <span className="lx1-event-venue">{evt.venue_name}</span>
                                            <span className="lx1-event-address">{evt.venue_address}</span>
                                        </div>

                                        {evt.gmaps_link && (
                                            <a 
                                                href={evt.gmaps_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="lx1-event-btn-map"
                                            >
                                                <i className="fas fa-map-marked-alt" />
                                                <span>Google Map</span>
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
    };

    // Render 4. Love Story
    const renderLoveStory = () => (
        <section id="love_story" className="lx1-section lx1-section-story">
            <div className="lx1-section-content">
                <Reveal variant="down">
                    <h2 className="lx1-section-title">{t('invitation.kisah_cinta_kami')}</h2>
                </Reveal>

                <div className="lx1-story-timeline">
                    {safeArr(loveStories).map((story, idx) => (
                        <div key={story.id || idx} className="lx1-story-item">
                            <div className="lx1-story-badge" />
                            <Reveal variant={idx % 2 === 0 ? 'left' : 'right'} className="lx1-story-card">
                                <div className="lx1-story-date">{story.story_date || formatDate(story.created_at)}</div>
                                <h3 className="lx1-story-title">{story.title}</h3>
                                <p className="lx1-story-description">{story.description || story.story}</p>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Render 5. Gallery
    const renderGallery = () => (
        <section id="gallery" className="lx1-section lx1-section-gallery">
            <div className="lx1-section-content">
                <Reveal variant="down">
                    <h2 className="lx1-section-title">{t('invitation.our_gallery')}</h2>
                </Reveal>

                <div className="lx1-gallery-grid">
                    {safeArr(galleries).map((gal, idx) => {
                        const imgUrl = getStorageUrl(gal.image_path || gal.image_url);
                        return (
                            <Reveal key={gal.id || idx} variant="zoom" delay={idx * 50} className="lx1-gallery-item">
                                <img 
                                    src={imgUrl} 
                                    alt="Gallery item" 
                                    className="lx1-gallery-img"
                                    onClick={() => setLightboxImg(imgUrl)}
                                />
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );

    // Render 6. Bank/Gifts
    const renderBank = () => (
        <section id="bank" className="lx1-section lx1-section-bank">
            <div className="lx1-section-content">
                <Reveal variant="down">
                    <h2 className="lx1-section-title">{t('invitation.gift_title')}</h2>
                </Reveal>

                <div className="lx1-bank-cards">
                    {safeArr(bankAccounts).map((acc, idx) => {
                        const isBca = String(acc.bank_name).toLowerCase().includes('bca');
                        const isDana = String(acc.bank_name).toLowerCase().includes('dana');
                        
                        return (
                            <Reveal key={acc.id || idx} className="lx1-bank-card">
                                <div className="lx1-bank-card-header">
                                    {isBca && <img src={ASSETS.bca} alt="BCA" className="lx1-bank-logo" />}
                                    {isDana && <img src={ASSETS.dana} alt="DANA" className="lx1-bank-logo" />}
                                    {!isBca && !isDana && <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{acc.bank_name}</span>}
                                    
                                    <img src={ASSETS.chip} alt="Chip" className="lx1-bank-chip" />
                                </div>
                                <div className="lx1-bank-card-body">
                                    <div className="lx1-bank-number">{acc.account_number}</div>
                                    <div className="lx1-bank-holder">{acc.account_holder || acc.account_name}</div>
                                </div>
                                <div className="lx1-bank-card-footer">
                                    <button 
                                        type="button" 
                                        className="lx1-btn-copy"
                                        onClick={() => copyToClipboard(acc.account_number, idx)}
                                    >
                                        <i className={copiedIdx === idx ? "fas fa-check" : "far fa-copy"} />
                                        <span>{copiedIdx === idx ? t('invitation.gift_copied') : t('invitation.gift_copy')}</span>
                                    </button>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );

    // Render 7. RSVP & Wishes (Merged into single page vertically)
    const renderRsvpWishes = () => {
        const sortedWishes = safeArr(wishes);
        const hasRsvp = resolvedSections.some(s => s.section_key === 'rsvp') || enableRsvp;
        const hasWishes = resolvedSections.some(s => s.section_key === 'wishes') || enableWishes;

        return (
            <section id="rsvp" className="lx1-section lx1-section-rsvp">
                <div className="lx1-section-content">
                    {/* RSVP Form Widget */}
                    {hasRsvp && (
                        <Reveal variant="left" className="lx1-rsvp-form-container">
                            <h2 className="lx1-form-title">{t('invitation.rsvp_title')}</h2>
                            <form onSubmit={handleRsvpSubmit}>
                                <div className="lx1-form-group">
                                    <label className="lx1-form-label">{t('invitation.rsvp_name')}</label>
                                    <input 
                                        type="text" 
                                        className="lx1-form-input" 
                                        required 
                                        value={rsvpForm.data.name} 
                                        onChange={e => rsvpForm.setData('name', e.target.value)}
                                    />
                                </div>

                                <div className="lx1-form-group">
                                    <label className="lx1-form-label">{t('invitation.rsvp_attendance')}</label>
                                    <select 
                                        className="lx1-form-select"
                                        value={rsvpForm.data.attendance}
                                        onChange={e => rsvpForm.setData('attendance', e.target.value)}
                                    >
                                        <option value="hadir">{t('invitation.rsvp_hadir')}</option>
                                        <option value="tidak_hadir">{t('invitation.rsvp_tidak_hadir')}</option>
                                        <option value="belum_pasti">{t('invitation.rsvp_belum_pasti')}</option>
                                    </select>
                                </div>

                                {rsvpForm.data.attendance === 'hadir' && (
                                    <div className="lx1-form-group">
                                        <label className="lx1-form-label">{t('invitation.rsvp_count')}</label>
                                        <select 
                                            className="lx1-form-select"
                                            value={rsvpForm.data.number_of_guests}
                                            onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5].map(v => (
                                                <option key={v} value={v}>{v} {invitation?.language === 'en' ? 'People' : 'Orang'}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="lx1-btn-submit" 
                                    disabled={rsvpForm.processing}
                                >
                                    {rsvpForm.processing ? (
                                        <i className="fas fa-spinner fa-spin" />
                                    ) : (
                                        <i className="fas fa-paper-plane" />
                                    )}
                                    <span>{t('invitation.send_rsvp')}</span>
                                </button>
                            </form>
                        </Reveal>
                    )}

                    {/* Wishes/Ucapan Form Widget */}
                    {hasWishes && (
                        <Reveal variant="right" className="lx1-rsvp-form-container">
                            <h2 className="lx1-form-title">{t('invitation.wishes_title')}</h2>
                            <form onSubmit={handleWishSubmit}>
                                <div className="lx1-form-group">
                                    <label className="lx1-form-label">{t('invitation.rsvp_name')}</label>
                                    <input 
                                        type="text" 
                                        className="lx1-form-input" 
                                        required 
                                        value={wishForm.data.sender_name} 
                                        onChange={e => wishForm.setData('sender_name', e.target.value)}
                                    />
                                </div>

                                <div className="lx1-form-group">
                                    <label className="lx1-form-label">Pesan / Ucapan</label>
                                    <textarea 
                                        className="lx1-form-textarea" 
                                        required 
                                        placeholder={t('invitation.wishes_msg')}
                                        value={wishForm.data.message} 
                                        onChange={e => wishForm.setData('message', e.target.value)}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="lx1-btn-submit" 
                                    disabled={wishForm.processing}
                                >
                                    {wishForm.processing ? (
                                        <i className="fas fa-spinner fa-spin" />
                                    ) : (
                                        <i className="fas fa-paper-plane" />
                                    )}
                                    <span>{t('invitation.send_wish')}</span>
                                </button>
                            </form>
                        </Reveal>
                    )}

                    {/* Wishes Scrolling List */}
                    {hasWishes && sortedWishes.length > 0 && (
                        <Reveal variant="up" className="lx1-wishes-list-container">
                            <div className="lx1-wishes-count">Doa Restu Tamu ({sortedWishes.length})</div>
                            <div className="lx1-wishes-scroll">
                                {sortedWishes.map((w, idx) => (
                                    <div key={w.id || idx} className="lx1-wish-card">
                                        <div className="lx1-wish-header">
                                            <span className="lx1-wish-sender">{w.sender_name || w.name}</span>
                                            {w.attendance && (
                                                <span className={`lx1-wish-badge lx1-badge-${w.attendance.replace('_', '-')}`}>
                                                    {w.attendance === 'hadir' ? 'Hadir' : w.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu-ragu'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="lx1-wish-message">{w.message}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>
        );
    };

    // Render 8. Closing
    const renderClosing = () => {
        return (
            <section id="closing" className="lx1-section lx1-section-closing">
                <div className="lx1-section-content">
                    <Reveal variant="down">
                        <h4 className="lx1-closing-heading">Thank You</h4>
                    </Reveal>

                    <Reveal variant="zoom" delay={150}>
                        <p className="lx1-closing-text">
                            Merupakan suatu kebahagiaan dan kehormatan bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                        </p>
                    </Reveal>

                    <Reveal variant="zoom" delay={250}>
                        <h2 className="lx1-closing-names">{signature}</h2>
                    </Reveal>

                    <Reveal variant="up" delay={300}>
                        <div className="lx1-closing-wishes-title">Kami Yang Berbahagia</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Kel. Bapak Anas &amp; Ibu Kholifah</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Kel. Bapak M. Dawam &amp; Ibu Dewi Sudarwati</div>
                    </Reveal>

                    <div className="lx1-closing-footer">
                        Made with ❤ by {invitation?.user?.reseller?.reseller_settings?.brand_name || 'Wekita.id'}
                    </div>
                </div>
            </section>
        );
    };

    // Render a section key dynamically
    const renderSectionComponent = (secItem, idx) => {
        const key = secItem.section_key;

        // Custom Layout wrapping for Slide vs Scroll mode
        const wrapSection = (contentId, innerJSX) => {
            if (isSlideMode) {
                const isCurrent = activeSlideIdx === idx;
                return (
                    <div 
                        key={contentId + '-' + idx} 
                        className={`lx1-slide ${isCurrent ? 'lx1-active' : ''} lx1-slide-container`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        {innerJSX}
                    </div>
                );
            }
            return (
                <div key={contentId + '-' + idx} id={contentId}>
                    {innerJSX}
                </div>
            );
        };

        switch (key) {
            case 'hero':
                if (!isSlideMode) return null;
                return (
                    <div 
                        key="hero-slide" 
                        className={`lx1-slide ${activeSlideIdx === 0 ? 'lx1-active' : ''}`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="lx1-hero-slide">
                            <div className="lx1-hero-bg" style={{ backgroundImage: `url(${coverBgUrl})` }} />
                            <div className="lx1-hero-content">
                                <span className="lx1-hero-title">{t('invitation.wedding_of').toUpperCase()}</span>
                                <h1 className="lx1-hero-names">
                                    {safeArr(brideGrooms).map(b => b.nickname).join(' & ')}
                                </h1>
                                <div className="lx1-hero-date">
                                    {formatDate(invitation?.wedding_date || events?.[0]?.event_date)}
                                </div>
                            </div>
                            <div className="lx1-scroll-indicator">
                                <span>{layoutMode === 'slide-h' ? 'Geser Kanan' : 'Geser Bawah'}</span>
                                <i className={layoutMode === 'slide-h' ? 'fas fa-chevron-right lx1-indicator-arrow-right' : 'fas fa-chevron-down lx1-indicator-arrow-down'} />
                            </div>
                        </div>
                    </div>
                );
            case 'opening':
                return wrapSection('opening', renderOpening());
            case 'bride_groom':
                return wrapSection('bride_groom', renderBrideGroom());
            case 'event':
                return wrapSection('event', renderEvent());
            case 'love_story':
                return wrapSection('love_story', renderLoveStory());
            case 'gallery':
                return wrapSection('gallery', renderGallery());
            case 'bank':
                return wrapSection('bank', renderBank());
            case 'rsvp':
                return wrapSection('rsvp', renderRsvpWishes());
            case 'wishes':
                // Only if RSVP is disabled (otherwise wishes is rendered in RSVP page)
                if (!enableRsvp) {
                    return wrapSection('wishes', renderRsvpWishes());
                }
                return null;
            case 'closing':
                return wrapSection('closing', renderClosing());
            default:
                return null;
        }
    };

    return (
        <div className="lx1-page">
            {/* Global Background Particle Effects */}
            {isOpened && invitation?.particle_type && invitation.particle_type !== 'none' && (
                <ParticleEffect 
                    type={invitation.particle_type} 
                    count={invitation.particle_count || 30} 
                    speed={invitation.particle_speed || 'normal'} 
                />
            )}

            {/* Audio music player */}
            <audio ref={audioRef} loop preload="auto" playsInline>
                <source src={getStorageUrl(invitation?.music_file || invitation?.music_url, '')} type="audio/mpeg" />
            </audio>

            {/* Buka Undangan Overlay Cover */}
            <div 
                className={`lx1-cover-overlay ${isOpened ? 'lx1-opened' : ''}`}
                style={{ backgroundImage: `url(${coverBgUrl})` }}
            >
                <div className="lx1-cover-content">
                    <h3 className="lx1-cover-title">{t('invitation.wedding_of').toUpperCase()}</h3>
                    <h1 className="lx1-cover-names">
                        {safeArr(brideGrooms).map(b => b.nickname).join(' & ')}
                    </h1>
                    
                    <h4 className="lx1-cover-dear">{t('invitation.to')}</h4>
                    <h2 className="lx1-cover-guest">{activeGuest.name}</h2>
                    <p className="lx1-cover-apology">{t('invitation.dear_guest_desc')}</p>
                    
                    <button 
                        type="button" 
                        onClick={handleOpenInvitation}
                        className="lx1-btn-open"
                    >
                        <i className="fas fa-book-open" />
                        <span>{t('invitation.open')}</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {isOpened && (
                <div className="lx1-container">
                    {/* Render Page contents based on layout mode */}
                    {isSlideMode ? (
                        <div className="lx1-swipe-container">
                            {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                        </div>
                    ) : (
                        <div className="lx1-scroll-container">
                            {resolvedSections.map((s, idx) => renderSectionComponent(s, idx))}
                        </div>
                    )}

                    {/* Bottom Nav Menu Bar */}
                    {showMenu && (
                        <div className="lx1-nav-menu-container">
                            <nav className="lx1-nav-menu">
                                {menuItems.map(item => {
                                    const isActive = activeMenuId === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => { setAutoScrollEnabled(false); scrollToSection(item.id); }}
                                            className={`lx1-nav-item ${isActive ? 'lx1-active' : ''}`}
                                        >
                                            <i className={`${item.icon} lx1-nav-icon`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    )}

                    {/* Floating control buttons */}
                    <div className={`lx1-floating-btns ${showMenu ? 'lx1-floating-btns--raised' : ''}`}>
                        {enableQr && activeGuest && (
                            <button
                                type="button"
                                className="lx1-float-btn"
                                onClick={() => setShowQr(true)}
                                title="QR Code Check-in"
                            >
                                <i className="fas fa-qrcode" />
                            </button>
                        )}
                        {invitation?.enable_auto_scroll !== false && (
                        <button
                            type="button"
                            className="lx1-float-btn"
                            onClick={() => setAutoScrollEnabled(prev => !prev)}
                            style={autoScrollEnabled ? { backgroundColor: 'var(--lx1-slate-primary, #809BAA)', color: '#fff', boxShadow: '0 0 10px var(--lx1-slate-primary)' } : {}}
                            title={autoScrollEnabled ? "Matikan Auto Scroll" : "Auto Scroll"}
                        >
                            <i className={autoScrollEnabled ? "fas fa-pause" : "fas fa-scroll"} />
                        </button>
                        )}
                        <button
                            type="button"
                            className="lx1-float-btn"
                            onClick={onToggleMusic}
                            title="Play/Pause Musik"
                        >
                            <i className={isPlaying ? "fas fa-music" : "fas fa-volume-xmark"} />
                        </button>
                    </div>

                    {/* Elevated WhatsApp Float button */}
                    {invitation?.whatsapp_number && (
                        <div className={`lx1-whatsapp-float ${showMenu ? 'lx1-whatsapp-float--left' : ''}`}>
                            <a 
                                href={`https://wa.me/${invitation.whatsapp_number.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(signature || 'Habib & Adiba')},%20saya%20ingin%20mengucapkan%20selamat%20atas%20pernikahan%20kalian!`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="lx1-float-btn"
                                title="Kirim Pesan WhatsApp"
                            >
                                <i className="fab fa-whatsapp" />
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* QR Checkin modal */}
            {showQr && activeGuest && (
                <div className="lx1-lightbox" onClick={() => setShowQr(false)}>
                    <button type="button" className="lx1-lightbox-close" onClick={() => setShowQr(false)}>
                        <i className="fas fa-times" />
                    </button>
                    <div className="lx1-rsvp-form-container" style={{ maxWidth: '360px', margin: '20px', zIndex: 10001 }} onClick={e => e.stopPropagation()}>
                        <h2 className="lx1-form-title" style={{ marginBottom: '10px' }}>QR Check-In Tamu</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '12px', border: '1px solid var(--lx1-gold-border)' }}>
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(route('invitation.checkin', { slug: invitation.slug, to: activeGuest.slug }))}`} 
                                    alt="Check-in QR" 
                                    style={{ width: '200px', height: '200px' }}
                                />
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--lx1-slate-dark)' }}>{activeGuest.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--lx1-text-muted)', textAlign: 'center' }}>
                                Tunjukkan QR Code ini kepada panitia untuk melakukan check-in kehadiran di venue.
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Lightbox modal */}
            {lightboxImg && (
                <div className="lx1-lightbox" onClick={() => setLightboxImg(null)}>
                    <button type="button" className="lx1-lightbox-close" onClick={() => setLightboxImg(null)}>
                        <i className="fas fa-times" />
                    </button>
                    <img src={lightboxImg} alt="Gallery zoom" className="lx1-lightbox-img" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}
