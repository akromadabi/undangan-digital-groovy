import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';

// ═══ Scroll-triggered animation component (re-triggers on every viewport entry) ═══
const AnimateIn = ({ children, type = 'fadeUp', delay = 0, className = '', duration = 700 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { setVisible(entry.isIntersecting); },
            { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    const animations = {
        fadeUp: 'ani-fadeUp',
        fadeDown: 'ani-fadeDown',
        fadeLeft: 'ani-fadeLeft',
        fadeRight: 'ani-fadeRight',
        scaleIn: 'ani-scaleIn',
        fadeIn: 'ani-fadeIn',
    };
    return (
        <div ref={ref} className={`${className} ${visible ? animations[type] || animations.fadeUp : 'ani-hidden'}`}
            style={{ animationDelay: `${delay}ms`, animationDuration: `${duration}ms` }}>
            {children}
        </div>
    );
};

export default function Show({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const [isOpen, setIsOpen] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [activeNav, setActiveNav] = useState('home');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const audioRef = useRef(null);
    const layoutMode = invitation.layout_mode || 'scroll';
    const enableQr = invitation.enable_qr !== false && invitation.show_qr_code !== false;

    // Pengaturan Undangan settings
    const showPhotos = invitation.show_photos !== false;
    const showAnimations = invitation.show_animations !== false;
    const showGuestName = invitation.show_guest_name !== false;
    const showCountdown = invitation.show_countdown !== false;
    const enableRsvp = invitation.enable_rsvp !== false;
    const enableWishes = invitation.enable_wishes !== false;
    const musicAutoplay = invitation.music_autoplay !== false;

    const colors = invitation.theme?.color_scheme || { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D', accent: '#8B5E3C' };
    const fonts = invitation.theme?.font_config || { heading: "'Playfair Display', serif", body: "'Poppins', sans-serif", script: "'Great Vibes', cursive" };
    const themeSlug = invitation.theme?.slug || '';
    const isJawa = themeSlug === 'adat-jawa';
    const isSunda = themeSlug === 'adat-sunda';
    const isTraditional = isJawa || isSunda;

    const visibleSections = sections.filter(s => s.is_visible).sort((a, b) => a.sort_order - b.sort_order);

    // Ornament paths for traditional themes
    const O = isJawa ? {
        wedding: '/themes/adat-jawa/the-wedding.png',
        wayang: '/themes/adat-jawa/ornamen-wayang.png',
        bunga: '/themes/adat-jawa/ornamen-bunga.png',
        swirlR: '/themes/adat-jawa/swirl-divider-right.png',
        swirlL: '/themes/adat-jawa/swirl-divider-left.png',
        brR: '/themes/adat-jawa/flower-branch-right.png',
        brL: '/themes/adat-jawa/flower-branch-left.png',
    } : isSunda ? {
        wedding: '/themes/adat-sunda/the-wedding.png',
        wayang: '/themes/adat-sunda/ornamen-footer.png',
        bunga: '/themes/adat-sunda/ornamen-header.png',
        swirlR: '/themes/adat-sunda/swirl-divider.png',
        swirlL: '/themes/adat-sunda/swirl-divider.png',
        brR: '/themes/adat-sunda/branch-right.png',
        brL: '/themes/adat-sunda/branch-left.png',
        cornerR: '/themes/adat-sunda/corner-right.png',
        cornerL: '/themes/adat-sunda/corner-left.png',
    } : null;

    const handleOpen = () => {
        setIsOpen(true);
        if (invitation.music_url && musicAutoplay && audioRef.current) {
            audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => { });
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (musicPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
        setMusicPlaying(!musicPlaying);
    };

    // RSVP Form
    const rsvpForm = useForm({ attendance: 'hadir', number_of_guests: 1 });
    const handleRsvp = (e) => { e.preventDefault(); rsvpForm.post(route('invitation.rsvp', invitation.slug)); };

    // Wish Form
    const wishForm = useForm({ sender_name: guest?.name || '', message: '' });
    const handleWish = (e) => {
        e.preventDefault();
        wishForm.post(route('invitation.wish', invitation.slug), { preserveScroll: true, onSuccess: () => wishForm.reset('message') });
    };

    const formatDate = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    const formatTime = (t) => !t ? '' : (t === 'Selesai' ? 'Selesai' : t.substring(0, 5));

    // Countdown — fix NaN by parsing date string properly
    const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        const firstEvent = events?.[0];
        if (!firstEvent?.event_date) return;
        const dateStr = String(firstEvent.event_date).substring(0, 10);
        const timeStr = firstEvent.start_time ? firstEvent.start_time.substring(0, 5) : '08:00';
        const target = new Date(`${dateStr}T${timeStr}:00`);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCountdown({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCountdown({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [events]);

    // Scroll to section (for scroll mode) or jump to index (for slide/tab)
    const scrollTo = useCallback((id) => {
        if (layoutMode === 'scroll') {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Find the section index by id
            const idx = visibleSections.findIndex(s => `section-${s.section_key}` === id);
            if (idx >= 0) setActiveSlideIdx(idx);
        }
    }, [layoutMode, visibleSections]);

    // Navigation for slide mode
    const goNext = useCallback(() => {
        setActiveSlideIdx(prev => Math.min(prev + 1, visibleSections.length - 1));
    }, [visibleSections.length]);
    const goPrev = useCallback(() => {
        setActiveSlideIdx(prev => Math.max(prev - 1, 0));
    }, []);

    // Swipe handler for slide mode
    const touchStartRef = useRef(null);
    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, []);
    const handleTouchEnd = useCallback((e) => {
        if (!touchStartRef.current) return;
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx < 0) goNext(); else goPrev();
        }
        touchStartRef.current = null;
    }, [goNext, goPrev]);

    // Track active section on scroll
    useEffect(() => {
        if (!isOpen) return;
        const map = {};
        visibleSections.forEach(s => { map[s.section_key] = s.section_key; });
        const handleScroll = () => {
            const secs = document.querySelectorAll('[data-section]');
            let current = visibleSections[0]?.section_key || 'opening';
            secs.forEach(sec => {
                if (sec.getBoundingClientRect().top <= 200) current = sec.dataset.section;
            });
            setActiveNav(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen]);

    // ═══ Reusable ornament components ═══

    const Swirl = () => isTraditional ? (
        <div className="flex items-center justify-center gap-0 my-3">
            <img src={O.swirlL} alt="" className="w-20 sm:w-28 h-auto opacity-70" />
            <img src={O.swirlR} alt="" className="w-20 sm:w-28 h-auto opacity-70" />
        </div>
    ) : null;

    const BungaTop = () => isTraditional ? (
        <img src={O.bunga} alt="" className="w-full h-auto pointer-events-none relative z-10" style={{ opacity: 0.85 }} />
    ) : null;

    const WayangBottom = () => isTraditional ? (
        <img src={O.wayang} alt="" className="w-full h-auto mt-auto pointer-events-none relative z-10" style={{ opacity: 0.8 }} />
    ) : null;

    const Branch = ({ side = 'right', size = 'w-10 sm:w-14' }) => isTraditional ? (
        <img src={side === 'right' ? O.brR : O.brL} alt="" className={`${size} h-auto opacity-60`} />
    ) : null;

    // Google Fonts
    const googleFonts = isTraditional
        ? 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Poppins:wght@300;400;500;600&family=Great+Vibes&display=swap'
        : 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;500;600&family=Great+Vibes&display=swap';

    // Section icons for navigation
    const sectionIcons = {
        cover: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15 10.5l1.409-1.409a2.25 2.25 0 013.182 0L21.75 11.25M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />,
        opening: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
        bride_groom: <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />,
        event: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
        countdown: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
        gallery: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15 10.5l1.409-1.409a2.25 2.25 0 013.182 0L21.75 11.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" /></>,
        love_story: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
        bank: <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />,
        rsvp: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />,
        wishes: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />,
        closing: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />,
    };

    // Nav items built from user's visible sections (dynamic order)
    // Only show icons for sections that actually render content
    const navSections = visibleSections.filter(s => {
        if (s.section_key === 'cover') return false;
        if (s.section_key === 'gallery' && !(galleries?.length > 0)) return false;
        if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return false;
        if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return false;
        if (s.section_key === 'bride_groom' && !(brideGrooms?.length >= 2)) return false;
        if (s.section_key === 'countdown' && !invitation.save_the_date_enabled) return false;
        if (s.section_key === 'rsvp' && !enableRsvp) return false;
        if (s.section_key === 'wishes' && !enableWishes) return false;
        return true;
    });

    // ═══ Section header: swirl on LEFT and RIGHT of heading ═══
    const SectionHeader = ({ title }) => isTraditional ? (
        <div className="mb-6 mt-2">
            <div className="flex items-center justify-center gap-3">
                <img src={O.swirlL} alt="" className="w-16 sm:w-24 h-auto opacity-70" style={{ transform: 'scaleX(-1)' }} />
                <h2 className="text-sm sm:text-base uppercase tracking-[0.25em] font-bold whitespace-nowrap" style={{ color: colors.primary, fontFamily: fonts.heading }}>{title}</h2>
                <img src={O.swirlR} alt="" className="w-16 sm:w-24 h-auto opacity-70" />
            </div>
        </div>
    ) : (
        <h2 className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: colors.primary }}>{title}</h2>
    );

    return (
        <>
            <Head title={invitation.title || 'Undangan Pernikahan'} />
            <link href={googleFonts} rel="stylesheet" />
            <style dangerouslySetInnerHTML={{
                __html: `
                .ani-hidden { opacity: 0; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeDown { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes fadeRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes scaleIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                .ani-fadeUp { animation: fadeUp var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeDown { animation: fadeDown var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeLeft { animation: fadeLeft var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeRight { animation: fadeRight var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
                .ani-scaleIn { animation: scaleIn var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeIn { animation: fadeIn var(--dur, 700ms) cubic-bezier(0.22,1,0.36,1) both; }
            `}} />
            {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

            <div style={{ backgroundColor: colors.bg, color: colors.text, fontFamily: fonts.body, minHeight: '100vh' }}>

                {/* ═══════ COVER ═══════ */}
                {!isOpen && (
                    <div className={`fixed inset-0 z-50 flex ${invitation.cover_image ? 'flex-col' : 'items-center justify-center'} overflow-hidden`} style={{ backgroundColor: colors.bg }}>
                        {/* Full-screen cover image background with gradient overlay — ALL themes */}
                        {invitation.cover_image && (
                            <>
                                <img src={invitation.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
                                <div className="absolute inset-0 z-[1]" style={{
                                    background: `linear-gradient(to bottom, transparent 0%, ${colors.bg}30 30%, ${colors.bg}b0 60%, ${colors.bg} 85%)`
                                }} />
                            </>
                        )}
                        {isTraditional && (
                            <div className="absolute top-0 left-0 right-0 pointer-events-none z-10">
                                <img src={O.bunga} alt="" className="w-full h-auto" style={{ opacity: invitation.cover_image ? 0.6 : 0.85 }} />
                            </div>
                        )}
                        {invitation.cover_image && <div className="flex-1" />}
                        <div className="text-center px-8 max-w-sm mx-auto relative z-20" style={invitation.cover_image ? { paddingBottom: '8vh' } : {}}>
                            {isTraditional ? (
                                <>
                                    <p className="text-xs uppercase tracking-[0.35em] mb-1" style={{ color: colors.primary, fontFamily: fonts.heading }}>The Wedding Of</p>
                                    <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: fonts.script, color: colors.primary }}>
                                        {brideGrooms?.[0]?.nickname || brideGrooms?.[0]?.full_name || 'Bride'} & {brideGrooms?.[1]?.nickname || brideGrooms?.[1]?.full_name || 'Groom'}
                                    </h1>
                                    <Swirl />
                                    <p className="text-sm" style={{ color: colors.primary }}>
                                        {events?.[0]?.event_date ? formatDate(events[0].event_date) : ''}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: colors.primary }}>{invitation.cover_title || 'The Wedding Of'}</p>
                                    <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: fonts.script, color: colors.primary }}>
                                        {brideGrooms?.[0]?.nickname || brideGrooms?.[0]?.full_name || 'Bride'} & {brideGrooms?.[1]?.nickname || brideGrooms?.[1]?.full_name || 'Groom'}
                                    </h1>
                                </>
                            )}
                            {showGuestName && guest && (
                                <div className="mt-5 mb-1">
                                    <p className="text-xs uppercase tracking-[0.2em] opacity-50">Kepada Yang Terhormat</p>
                                    <p className="text-lg font-bold mt-1" style={{ fontFamily: fonts.heading, color: colors.primary }}>{guest.name}</p>
                                    <p className="text-[10px] opacity-40 mt-1 italic">Mohon maaf apabila ada kesalahan penulisan nama atau gelar.</p>
                                </div>
                            )}
                            <button onClick={handleOpen}
                                className="mt-6 px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
                                style={{ backgroundColor: colors.primary }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                Buka Undangan
                            </button>
                        </div>
                        {isTraditional && (
                            <div className={`pointer-events-none z-10 ${invitation.cover_image ? '' : 'absolute bottom-0 left-0 right-0'}`}>
                                <img src={O.wayang} alt="" className="w-full h-auto" style={{ opacity: invitation.cover_image ? 0.5 : 0.8 }} />
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ MAIN CONTENT ═══════ */}
                {isOpen && (
                    <div className="relative" style={{ paddingBottom: (isTraditional || layoutMode === 'tab') ? '3.5rem' : '0' }}>
                        {/* QR Code button removed from here — now in left sidebar */}
                        {/* Music toggle removed from here — now in left sidebar */}

                        {/* QR Code Modal */}
                        {enableQr && showQr && guest && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowQr(false)}>
                                <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                                    <h3 className="text-lg font-bold mb-1" style={{ color: colors.primary }}>QR Code Check-in</h3>
                                    <p className="text-sm mb-4" style={{ color: colors.text, opacity: 0.6 }}>{guest.name}</p>
                                    {/* QR Code generated via SVG */}
                                    <div className="p-4 rounded-xl inline-block" style={{ backgroundColor: colors.bg }}>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${colors.primary.replace('#', '')}&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`}
                                            alt="QR Code"
                                            className="w-48 h-48 mx-auto"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-3">Scan untuk konfirmasi kehadiran</p>
                                    <button onClick={() => setShowQr(false)}
                                        className="mt-4 px-6 py-2 rounded-full text-sm font-medium text-white transition-all"
                                        style={{ backgroundColor: colors.primary }}>
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sections — unified rendering for all modes */}
                        <div
                            onTouchStart={layoutMode === 'slide' ? handleTouchStart : undefined}
                            onTouchEnd={layoutMode === 'slide' ? handleTouchEnd : undefined}
                        >
                            {visibleSections.filter(s => s.section_key !== 'cover').map((section, sectionIdx) => {
                                const isHidden = layoutMode !== 'scroll' && sectionIdx !== activeSlideIdx;
                                return (
                                    <section
                                        key={section.id}
                                        id={`section-${section.section_key}`}
                                        data-section={section.section_key}
                                        className="relative overflow-hidden"
                                        style={isHidden ? { display: 'none' } : {}}
                                    >
                                        {/* ──── OPENING ──── */}
                                        {section.section_key === 'opening' && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto">
                                                        {isTraditional && (
                                                            <AnimateIn type="fadeIn" delay={100}>
                                                                <p className="text-base font-bold tracking-wider" style={{ fontFamily: fonts.heading, color: colors.primary }}>
                                                                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                                                                </p>
                                                            </AnimateIn>
                                                        )}
                                                        {invitation.opening_ayat && (
                                                            <AnimateIn type="fadeUp" delay={200}>
                                                                <p className="text-base leading-relaxed opacity-70 mt-3" dir="auto" style={{ fontFamily: fonts.heading }}>{invitation.opening_ayat}</p>
                                                            </AnimateIn>
                                                        )}
                                                        <AnimateIn type="scaleIn" delay={300}><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={400}>
                                                            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{invitation.opening_title}</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={500}>
                                                            <p className="text-sm leading-relaxed whitespace-pre-line opacity-80 mt-3">{invitation.opening_text}</p>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={600}><Swirl /></AnimateIn>
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── BRIDE & GROOM ──── */}
                                        {section.section_key === 'bride_groom' && brideGrooms?.length >= 2 && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Mempelai</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        {brideGrooms.map((bg, i) => (
                                                            <div key={i}>
                                                                {showPhotos && bg.photo && (
                                                                    <AnimateIn type="scaleIn" delay={300 + i * 400}>
                                                                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-3"
                                                                            style={{ border: `3px solid ${colors.primary}`, boxShadow: `0 0 20px ${colors.primary}25` }}>
                                                                            <img src={bg.photo} alt={bg.full_name} className="w-full h-full object-cover" />
                                                                        </div>
                                                                    </AnimateIn>
                                                                )}
                                                                <AnimateIn type="fadeUp" delay={400 + i * 400}>
                                                                    {isTraditional ? (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <Branch side="left" />
                                                                            <h3 className="text-2xl sm:text-3xl" style={{ fontFamily: fonts.script, color: colors.primary }}>{bg.full_name}</h3>
                                                                            <Branch side="right" />
                                                                        </div>
                                                                    ) : (
                                                                        <h3 className="text-3xl" style={{ fontFamily: fonts.script, color: colors.primary }}>{bg.full_name}</h3>
                                                                    )}
                                                                </AnimateIn>
                                                                <AnimateIn type="fadeUp" delay={500 + i * 400}>
                                                                    <p className="text-sm opacity-70 mt-2">
                                                                        {bg.gender === 'wanita' ? 'Putri' : 'Putra'} {bg.child_order && `ke-${bg.child_order}`} dari<br />
                                                                        Bapak {bg.father_name} & Ibu {bg.mother_name}
                                                                    </p>
                                                                </AnimateIn>
                                                                {bg.instagram && (
                                                                    <AnimateIn type="fadeIn" delay={600 + i * 400}>
                                                                        <a href={`https://instagram.com/${bg.instagram}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: colors.primary }}>
                                                                            @{bg.instagram}
                                                                        </a>
                                                                    </AnimateIn>
                                                                )}
                                                                {i === 0 && <AnimateIn type="scaleIn" delay={700}><Swirl /></AnimateIn>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── EVENTS ──── */}
                                        {section.section_key === 'event' && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Acara</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        {/* Countdown */}
                                                        {showCountdown && (
                                                            <AnimateIn type="fadeUp" delay={300}>
                                                                <div className="flex justify-center gap-3 mb-4">
                                                                    {[['d', 'Hari'], ['h', 'Jam'], ['m', 'Menit'], ['s', 'Detik']].map(([k, l]) => (
                                                                        <div key={k} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border"
                                                                            style={{ backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' }}>
                                                                            <span className="text-lg sm:text-xl font-bold" style={{ color: colors.primary }}>{countdown[k]}</span>
                                                                            <span className="text-[8px] sm:text-[9px] opacity-60">{l}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </AnimateIn>
                                                        )}
                                                        {events?.map((evt, i) => (
                                                            <AnimateIn key={i} type="fadeUp" delay={400 + i * 150}>
                                                                <div className="p-5 rounded-2xl border mb-3"
                                                                    style={{ backgroundColor: colors.primary + '08', borderColor: colors.primary + '20' }}>
                                                                    <h3 className="text-lg font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{evt.event_name}</h3>
                                                                    <p className="text-sm mt-2">{formatDate(evt.event_date)}</p>
                                                                    <p className="text-sm">{formatTime(evt.start_time)} - {formatTime(evt.end_time) || 'Selesai'} {evt.timezone}</p>
                                                                    {evt.venue_name && <p className="text-sm font-semibold mt-3 inline-flex items-center gap-1"><svg className="w-4 h-4 inline flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {evt.venue_name}</p>}
                                                                    {evt.venue_address && <p className="text-xs opacity-70">{evt.venue_address}</p>}
                                                                    {evt.gmaps_link && (
                                                                        <a href={evt.gmaps_link} target="_blank" rel="noopener"
                                                                            className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-full text-xs font-semibold text-white"
                                                                            style={{ backgroundColor: colors.primary }}><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> Buka Maps</a>
                                                                    )}
                                                                </div>
                                                            </AnimateIn>
                                                        ))}
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── GALLERY ──── */}
                                        {section.section_key === 'gallery' && galleries?.length > 0 && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Galeri</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {galleries.map((photo, i) => (
                                                                <AnimateIn key={i} type="scaleIn" delay={300 + i * 100}>
                                                                    <div className={`rounded-xl overflow-hidden border ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                                                                        style={{ borderColor: colors.primary + '30' }}>
                                                                        <img src={photo.image_url} alt={photo.caption || ''} className="w-full h-full object-cover" />
                                                                    </div>
                                                                </AnimateIn>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── LOVE STORY ──── */}
                                        {section.section_key === 'love_story' && loveStories?.length > 0 && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto space-y-3 w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Kisah Cinta</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        {loveStories.map((story, i) => (
                                                            <AnimateIn key={i} type={i % 2 === 0 ? 'fadeLeft' : 'fadeRight'} delay={300 + i * 150}>
                                                                <div key={i} className="text-left p-4 rounded-xl" style={{ backgroundColor: colors.primary + '08' }}>
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: colors.primary }}>{i + 1}</div>
                                                                        <div>
                                                                            <h4 className="font-semibold text-sm" style={{ color: colors.primary }}>{story.title}</h4>
                                                                            {story.story_date && <p className="text-xs opacity-50">{formatDate(story.story_date)}</p>}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-sm opacity-80 leading-relaxed">{story.description}</p>
                                                                </div>
                                                            </AnimateIn>
                                                        ))}
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── AMPLOP DIGITAL ──── */}
                                        {section.section_key === 'bank' && bankAccounts?.length > 0 && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto space-y-4 w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Amplop Digital</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={300}>
                                                            <p className="text-xs opacity-60">Doa dan restu Anda sudah cukup. Namun jika ingin memberi tanda kasih, bisa melalui:</p>
                                                        </AnimateIn>
                                                        {bankAccounts.map((acc, i) => {
                                                            const bankColors = {
                                                                'BCA': { bg: 'linear-gradient(135deg, #003d79 0%, #005bab 50%, #1a6fc4 100%)', text: '#fff' },
                                                                'BNI': { bg: 'linear-gradient(135deg, #ec6b24 0%, #f07d3a 50%, #f5944f 100%)', text: '#fff' },
                                                                'BRI': { bg: 'linear-gradient(135deg, #00529c 0%, #0066bf 50%, #1a7ad4 100%)', text: '#fff' },
                                                                'MANDIRI': { bg: 'linear-gradient(135deg, #003366 0%, #004d99 50%, #1a6fb5 100%)', text: '#fff' },
                                                                'BSI': { bg: 'linear-gradient(135deg, #00724a 0%, #00905d 50%, #1aab78 100%)', text: '#fff' },
                                                                'BTN': { bg: 'linear-gradient(135deg, #f7941d 0%, #f9a73e 50%, #fbb95f 100%)', text: '#fff' },
                                                                'CIMB': { bg: 'linear-gradient(135deg, #7b0c17 0%, #9e1020 50%, #b82030 100%)', text: '#fff' },
                                                                'PERMATA': { bg: 'linear-gradient(135deg, #c8102e 0%, #db2540 50%, #e74860 100%)', text: '#fff' },
                                                                'DANAMON': { bg: 'linear-gradient(135deg, #003b70 0%, #005499 50%, #1a6fb5 100%)', text: '#fff' },
                                                                'JAGO': { bg: 'linear-gradient(135deg, #ffe100 0%, #ffe833 50%, #fff066 100%)', text: '#333' },
                                                                'SEABANK': { bg: 'linear-gradient(135deg, #00aad2 0%, #33bbdd 50%, #66cce6 100%)', text: '#fff' },
                                                                'JENIUS': { bg: 'linear-gradient(135deg, #00adb5 0%, #33c0c7 50%, #66d3d9 100%)', text: '#fff' },
                                                                'GOPAY': { bg: 'linear-gradient(135deg, #00aed6 0%, #00c4f0 50%, #33d1f5 100%)', text: '#fff' },
                                                                'OVO': { bg: 'linear-gradient(135deg, #4c2a86 0%, #6b3fa5 50%, #8a5cc0 100%)', text: '#fff' },
                                                                'DANA': { bg: 'linear-gradient(135deg, #108ee9 0%, #3aa5f0 50%, #66bbf5 100%)', text: '#fff' },
                                                                'SHOPEEPAY': { bg: 'linear-gradient(135deg, #ee4d2d 0%, #f06846 50%, #f28960 100%)', text: '#fff' },
                                                            };
                                                            const bankKey = (acc.bank_name || '').toUpperCase().replace(/\s+/g, '').replace('BANK', '').replace('SYARIAH', '').replace('INDONESIA', '').trim();
                                                            const matched = Object.keys(bankColors).find(k => bankKey.includes(k)) || null;
                                                            const cardStyle = matched ? bankColors[matched] : { bg: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)`, text: '#fff' };

                                                            return (
                                                                <AnimateIn key={i} type="fadeUp" delay={400 + i * 200}>
                                                                    <div key={i} className="rounded-2xl p-5 sm:p-6 text-left relative overflow-hidden shadow-lg"
                                                                        style={{ background: cardStyle.bg, color: cardStyle.text, aspectRatio: '1.586/1', maxHeight: '198px' }}>
                                                                        {/* Glass shine effect */}
                                                                        <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%)' }} />
                                                                        {/* Bank name top-right */}
                                                                        <div className="flex justify-between items-start relative">
                                                                            <div className="text-[10px] uppercase tracking-wider opacity-70 font-medium">Amplop Digital</div>
                                                                            <div className="text-sm sm:text-base font-bold tracking-wider">{acc.bank_name}</div>
                                                                        </div>
                                                                        {/* Chip icon */}
                                                                        <div className="mt-4 sm:mt-5 w-10 h-7 rounded-md relative" style={{ background: 'linear-gradient(135deg, #d4a853 0%, #f0d080 50%, #d4a853 100%)' }}>
                                                                            <div className="absolute inset-1 rounded-sm border border-yellow-700/30" />
                                                                        </div>
                                                                        {/* Account Number */}
                                                                        <div className="mt-3 text-lg sm:text-xl font-bold tracking-[0.15em] relative" style={{ fontFamily: "'Courier New', monospace" }}>
                                                                            {acc.account_number}
                                                                        </div>
                                                                        {/* Bottom: name + copy */}
                                                                        <div className="mt-2 sm:mt-3 flex justify-between items-end relative">
                                                                            <div>
                                                                                <div className="text-[9px] uppercase tracking-wider opacity-60">Atas Nama</div>
                                                                                <div className="text-xs sm:text-sm font-semibold tracking-wide">{acc.account_name}</div>
                                                                            </div>
                                                                            <button onClick={() => { navigator.clipboard.writeText(acc.account_number); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }}
                                                                                className="px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm transition-all hover:scale-105 inline-flex items-center gap-1"
                                                                                style={{ backgroundColor: copiedIdx === i ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)', color: cardStyle.text }}>
                                                                                {copiedIdx === i ? (
                                                                                    <>
                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                                                                        Berhasil disalin
                                                                                    </>
                                                                                ) : 'Salin'}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </AnimateIn>
                                                            );
                                                        })}

                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── RSVP ──── */}
                                        {section.section_key === 'rsvp' && enableRsvp && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto space-y-3 w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Konfirmasi Kehadiran</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={300}>
                                                            <form onSubmit={handleRsvp} className="space-y-4 text-left">
                                                                <div className="flex gap-2">
                                                                    {['hadir', 'tidak_hadir', 'belum_pasti'].map(opt => (
                                                                        <button key={opt} type="button" onClick={() => rsvpForm.setData('attendance', opt)}
                                                                            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${rsvpForm.data.attendance === opt ? 'text-white' : 'opacity-50'}`}
                                                                            style={{ backgroundColor: rsvpForm.data.attendance === opt ? colors.primary : colors.primary + '15', color: rsvpForm.data.attendance === opt ? '#fff' : colors.text }}>
                                                                            {opt === 'hadir' ? 'Hadir' : opt === 'tidak_hadir' ? 'Tidak Hadir' : 'Belum Pasti'}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {rsvpForm.data.attendance === 'hadir' && (
                                                                    <div>
                                                                        <label className="text-sm font-medium">Jumlah Hadir</label>
                                                                        <input type="number" value={rsvpForm.data.number_of_guests} min={1} max={5}
                                                                            onChange={(e) => rsvpForm.setData('number_of_guests', parseInt(e.target.value))}
                                                                            className="w-full border rounded-xl px-4 py-2.5 text-sm mt-1 focus:ring-2 outline-none" style={{ borderColor: colors.primary + '40' }} />
                                                                    </div>
                                                                )}
                                                                <button type="submit" disabled={rsvpForm.processing}
                                                                    className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: colors.primary }}>
                                                                    {rsvpForm.processing ? 'Mengirim...' : 'Kirim RSVP'}
                                                                </button>
                                                            </form>
                                                        </AnimateIn>
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── WISHES ──── */}
                                        {section.section_key === 'wishes' && enableWishes && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto space-y-3 w-full">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={100}>
                                                            <h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: colors.primary }}>Ucapan & Doa</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={200}><Swirl /></AnimateIn>
                                                        {isTraditional && (
                                                            <blockquote className="text-sm italic leading-relaxed opacity-70 px-4 py-3 rounded-xl text-left" style={{ backgroundColor: colors.primary + '08', borderLeft: `3px solid ${colors.primary}` }}>
                                                                "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu dapat ketenangan hati dan dijadikannya kasih sayang di antara kamu."
                                                                <footer className="text-xs mt-2 font-semibold" style={{ color: colors.primary }}>— Q.S. Ar-Rum: 21</footer>
                                                            </blockquote>
                                                        )}
                                                        <AnimateIn type="fadeUp" delay={300}>
                                                            <form onSubmit={handleWish} className="space-y-3 text-left">
                                                                <input type="text" value={wishForm.data.sender_name}
                                                                    onChange={(e) => wishForm.setData('sender_name', e.target.value)}
                                                                    placeholder="Nama Anda" required
                                                                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none" style={{ borderColor: colors.primary + '40' }} />
                                                                <textarea value={wishForm.data.message}
                                                                    onChange={(e) => wishForm.setData('message', e.target.value)}
                                                                    placeholder="Tulis ucapan & doa..." required rows={3}
                                                                    className="w-full border rounded-xl px-4 py-2.5 text-sm resize-none outline-none" style={{ borderColor: colors.primary + '40' }} />
                                                                <button type="submit" disabled={wishForm.processing}
                                                                    className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: colors.primary }}>
                                                                    {wishForm.processing ? 'Mengirim...' : 'Kirim Ucapan'}
                                                                </button>
                                                            </form>
                                                        </AnimateIn>
                                                        {wishes?.length > 0 && (
                                                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                                                {wishes.map((w, i) => (
                                                                    <div key={i} className="text-left p-3 rounded-xl" style={{ backgroundColor: colors.primary + '08' }}>
                                                                        <div className="font-semibold text-sm" style={{ color: colors.primary }}>{w.sender_name}</div>
                                                                        <p className="text-sm opacity-70 mt-1">{w.message}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}

                                        {/* ──── CLOSING ──── */}
                                        {section.section_key === 'closing' && (
                                            <div className={`text-center ${isTraditional ? 'min-h-screen flex flex-col' : ''}`}>
                                                {isTraditional && <BungaTop />}
                                                <div className="flex-1 flex items-center justify-center px-4 py-6">
                                                    <div className="max-w-lg mx-auto space-y-3">
                                                        <AnimateIn type="scaleIn"><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={200}>
                                                            <h2 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: fonts.heading, color: colors.primary }}>{invitation.closing_title}</h2>
                                                        </AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={300}>
                                                            <p className="text-sm leading-relaxed whitespace-pre-line opacity-80">{invitation.closing_text}</p>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={400}><Swirl /></AnimateIn>
                                                        <AnimateIn type="fadeUp" delay={500}>
                                                            <div className="pt-2">
                                                                <p className="text-sm font-semibold">Kami yang berbahagia,</p>
                                                                <p className="text-2xl mt-2" style={{ fontFamily: fonts.script, color: colors.primary }}>
                                                                    {brideGrooms?.[0]?.nickname || brideGrooms?.[0]?.full_name} & {brideGrooms?.[1]?.nickname || brideGrooms?.[1]?.full_name}
                                                                </p>
                                                            </div>
                                                        </AnimateIn>
                                                        <AnimateIn type="scaleIn" delay={600}><Swirl /></AnimateIn>
                                                    </div>
                                                </div>
                                                {isTraditional && <WayangBottom />}
                                            </div>
                                        )}
                                    </section>
                                );
                            })}
                        </div>

                        {/* Slide mode: navigation arrows + dots */}
                        {layoutMode === 'slide' && (
                            <>
                                {activeSlideIdx > 0 && (
                                    <button onClick={goPrev}
                                        className="fixed left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm"
                                        style={{ backgroundColor: colors.bg + 'cc', color: colors.primary }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                )}
                                {activeSlideIdx < visibleSections.length - 1 && (
                                    <button onClick={goNext}
                                        className="fixed right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm"
                                        style={{ backgroundColor: colors.bg + 'cc', color: colors.primary }}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                )}
                                <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center gap-1.5">
                                    {visibleSections.map((s, i) => (
                                        <button key={s.id} onClick={() => setActiveSlideIdx(i)}
                                            className={`rounded-full transition-all ${i === activeSlideIdx ? 'w-6 h-2.5' : 'w-2.5 h-2.5 opacity-30'}`}
                                            style={{ backgroundColor: colors.primary }} />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Footer (scroll mode only) */}
                        {layoutMode === 'scroll' && (
                            <footer className="text-center py-6 opacity-40 text-xs">
                                <p>Powered by Undangan Digital Groovy</p>
                            </footer>
                        )}

                        {/* ═══ Left Sidebar: Nav + QR + Music ═══ */}
                        {(layoutMode === 'tab' || invitation.show_side_menu) && (
                            <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2">
                                {/* Section navigation */}
                                <nav className="flex flex-col items-center gap-1 px-1.5 py-2 rounded-full"
                                    style={{ backgroundColor: '#ffffffe6', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', backdropFilter: 'blur(12px)' }}>
                                    {(layoutMode === 'tab' ? visibleSections.filter(s => s.section_key !== 'cover') : navSections).map((s, i) => {
                                        const isActive = layoutMode === 'tab' ? i === activeSlideIdx : activeNav === s.section_key;
                                        return (
                                            <div key={s.id} className="relative group">
                                                <button
                                                    onClick={() => layoutMode === 'tab' ? setActiveSlideIdx(i) : scrollTo('section-' + s.section_key)}
                                                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                                                    style={{
                                                        backgroundColor: isActive ? colors.primary + '20' : 'transparent',
                                                        color: isActive ? colors.primary : '#9ca3af',
                                                    }}>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive ? 2.2 : 1.6}>
                                                        {sectionIcons[s.section_key] || sectionIcons.opening}
                                                    </svg>
                                                </button>
                                                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none text-white"
                                                    style={{ backgroundColor: colors.primary, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                                    {s.section_name}
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                                                </span>
                                            </div>
                                        );
                                    })}
                                </nav>

                                {/* QR Code button — separate circle below nav */}
                                {enableQr && guest && (
                                    <div className="relative group">
                                        <button onClick={() => setShowQr(true)}
                                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                                            style={{ backgroundColor: colors.primary, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                                            </svg>
                                        </button>
                                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none text-white"
                                            style={{ backgroundColor: colors.primary, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                            QR Check-in
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                                        </span>
                                    </div>
                                )}

                                {/* Music control — separate circle below QR */}
                                {invitation.music_url && (
                                    <div className="relative group">
                                        <button onClick={toggleMusic}
                                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                                            style={{ backgroundColor: colors.primary, color: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
                                            {musicPlaying
                                                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" /></svg>
                                                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                            }
                                        </button>
                                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none text-white"
                                            style={{ backgroundColor: colors.primary, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                            {musicPlaying ? 'Pause Musik' : 'Play Musik'}
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
