import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ParticleEffect from '@/Components/ParticleEffect';

// Assets
const A = {
    bg: '/themes/heritage/Aruna-BACKGROUND-PARALLAX.webp',
    home: '/themes/heritage/Aruna-Home-Fallback.webp',
    eventBg: '/themes/heritage/Aruna-EVENT-2.webp',
    batik: '/themes/heritage/Aruna-Batik-2.webp',
    tree: '/themes/heritage/Aruna-Tree-6.webp',
    treeH: '/themes/heritage/Heritage-Tree.webp',
    frame: '/themes/heritage/Aruna-Frame-Mempelai-642x1024.webp',
    stamp: '/themes/heritage/Heritage-Stamp-2-768x768.webp',
    lace: '/themes/heritage/Aruna-LACE-2-scaled-1-691x1024.webp',
    b2: '/themes/heritage/Aruna-Bunga-2.webp',
    b3: '/themes/heritage/Aruna-Bunga-3.webp',
    b4: '/themes/heritage/Aruna-Bunga-4.webp',
    b5: '/themes/heritage/Aruna-Bunga-5.webp',
    b6: '/themes/heritage/Aruna-Bunga-6.webp',
    b7: '/themes/heritage/Aruna-Bunga-7.webp',
    b8: '/themes/heritage/Aruna-Bunga-8.webp',
    b9: '/themes/heritage/Aruna-Bunga-9.webp',
};

const COLORS = { primary: '#8A7A5B', sage: '#8A9A5B', gold: '#A68B5B', bg: '#E8E4D9', text: '#3D3B36', cream: '#F5F0E6' };
const FONTS = { heading: "'Cinzel', serif", body: "'Poppins', sans-serif", script: "'Great Vibes', cursive" };

// Scroll-triggered animation
const Ani = ({ children, type = 'fadeUp', delay = 0, className = '' }) => {
    const ref = useRef(null);
    const [v, setV] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const obs = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        obs.observe(el); return () => obs.disconnect();
    }, []);
    return <div ref={ref} className={`${className} ${v ? `ani-${type}` : 'ani-hidden'}`} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
};

export default function HeritageShow({ invitation, sections, brideGrooms, events, galleries, loveStories, bankAccounts, wishes, guest }) {
    const [isOpen, setIsOpen] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [activeNav, setActiveNav] = useState('home');
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const [parallaxY, setParallaxY] = useState(0);
    const audioRef = useRef(null);

    const enableQr = invitation.enable_qr !== false && invitation.show_qr_code !== false;
    const showPhotos = invitation.show_photos !== false;
    const showCountdown = invitation.show_countdown !== false;
    const enableRsvp = invitation.enable_rsvp !== false;
    const enableWishes = invitation.enable_wishes !== false;
    const musicAutoplay = invitation.music_autoplay !== false;
    const visibleSections = sections.filter(s => s.is_visible).sort((a, b) => a.sort_order - b.sort_order);

    const handleOpen = () => {
        setIsOpen(true);
        if (invitation.music_url && musicAutoplay && audioRef.current) {
            audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
        }
    };
    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (musicPlaying) audioRef.current.pause(); else audioRef.current.play();
        setMusicPlaying(!musicPlaying);
    };

    // Parallax
    useEffect(() => {
        if (!isOpen) return;
        const h = () => setParallaxY(window.scrollY * 0.3);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, [isOpen]);

    // Track nav
    useEffect(() => {
        if (!isOpen) return;
        const h = () => {
            const secs = document.querySelectorAll('[data-section]');
            let cur = 'opening';
            secs.forEach(s => { if (s.getBoundingClientRect().top <= 200) cur = s.dataset.section; });
            setActiveNav(cur);
        };
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, [isOpen]);

    // Forms
    const rsvpForm = useForm({ attendance: 'hadir', number_of_guests: 1 });
    const handleRsvp = (e) => { e.preventDefault(); rsvpForm.post(route('invitation.rsvp', invitation.slug)); };
    const wishForm = useForm({ sender_name: guest?.name || '', message: '' });
    const handleWish = (e) => { e.preventDefault(); wishForm.post(route('invitation.wish', invitation.slug), { preserveScroll: true, onSuccess: () => wishForm.reset('message') }); };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const formatTime = (t) => !t ? '' : (t === 'Selesai' ? 'Selesai' : t.substring(0, 5));
    const primaryEvent = events?.find(e => e.is_primary) || events?.[0];
    const coupleNames = [brideGrooms?.[0]?.nickname || brideGrooms?.[0]?.full_name, brideGrooms?.[1]?.nickname || brideGrooms?.[1]?.full_name].filter(Boolean).join(' & ');

    // Countdown
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        if (!primaryEvent?.event_date) return;
        const ds = String(primaryEvent.event_date).substring(0, 10);
        const ts = primaryEvent.start_time ? primaryEvent.start_time.substring(0, 5) : '08:00';
        const target = new Date(`${ds}T${ts}:00`);
        if (isNaN(target.getTime())) return;
        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCd({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
        };
        tick(); const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, [events]);

    const getCalendarUrl = (evt) => {
        if (!evt?.event_date) return '#';
        const dateStr = String(evt.event_date).substring(0, 10).replace(/-/g, '');
        const st = evt.start_time ? evt.start_time.substring(0, 5).replace(':', '') + '00' : '080000';
        const et = evt.end_time && evt.end_time !== 'Selesai' ? evt.end_time.substring(0, 5).replace(':', '') + '00' : '';
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(evt.event_name + ' - ' + coupleNames)}&dates=${dateStr}T${st}/${dateStr}T${et || st}&location=${encodeURIComponent([evt.venue_name, evt.venue_address].filter(Boolean).join(', '))}&sf=true&output=xml`;
    };

    const navSections = visibleSections.filter(s => {
        if (s.section_key === 'cover') return false;
        if (s.section_key === 'gallery' && !(galleries?.length > 0)) return false;
        if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return false;
        if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return false;
        if (s.section_key === 'bride_groom' && !(brideGrooms?.length >= 2)) return false;
        if (s.section_key === 'countdown' && !(events?.length > 0)) return false;
        if (s.section_key === 'rsvp' && !enableRsvp) return false;
        if (s.section_key === 'wishes' && !enableWishes) return false;
        return true;
    });

    const navLabels = { opening: 'Beranda', bride_groom: 'Mempelai', event: 'Acara', countdown: 'Hitung Mundur', gallery: 'Galeri', love_story: 'Kisah', bank: 'Hadiah', rsvp: 'RSVP', wishes: 'Ucapan', closing: 'Penutup' };
    const scrollTo = useCallback((id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, []);

    // Section wrapper with heritage background
    const Section = ({ children, id, sectionKey, bg: bgStyle, className = '' }) => (
        <section id={id} data-section={sectionKey} className={`relative overflow-hidden ${className}`} style={bgStyle}>
            {children}
        </section>
    );

    return (
        <>
            <Head title={invitation.title || 'Undangan Pernikahan'} />
            {isOpen && invitation.particle_type && <ParticleEffect type={invitation.particle_type} count={invitation.particle_count || 30} speed={invitation.particle_speed || 'normal'} />}
            <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Poppins:wght@300;400;500;600&family=Great+Vibes&display=swap" rel="stylesheet" />
            <style dangerouslySetInnerHTML={{ __html: `
                .ani-hidden { opacity: 0; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeDown { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes fadeLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes fadeRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
                @keyframes scaleIn { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                .ani-fadeUp { animation: fadeUp 700ms cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeDown { animation: fadeDown 700ms cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeLeft { animation: fadeLeft 700ms cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeRight { animation: fadeRight 700ms cubic-bezier(0.22,1,0.36,1) both; }
                .ani-scaleIn { animation: scaleIn 700ms cubic-bezier(0.22,1,0.36,1) both; }
                .ani-fadeIn { animation: fadeIn 700ms cubic-bezier(0.22,1,0.36,1) both; }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                .heritage-float { animation: float 4s ease-in-out infinite; }
                .heritage-breathe { animation: breathe 5s ease-in-out infinite; }
            ` }} />
            {invitation.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}

            <div style={{ backgroundColor: COLORS.bg, color: COLORS.text, fontFamily: FONTS.body, minHeight: '100vh' }}>

                {/* ═══ COVER ═══ */}
                {!isOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
                        {/* Parallax BG */}
                        <img src={A.bg} alt="" className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" />
                        <img src={A.home} alt="" className="absolute inset-0 w-full h-full object-cover z-[1]" style={{ opacity: 0.6 }} />
                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 z-[2]" style={{ background: `linear-gradient(to bottom, transparent 0%, transparent 30%, ${COLORS.bg}90 55%, ${COLORS.bg} 75%)` }} />
                        {/* Floral corners */}
                        <img src={A.b7} alt="" className="absolute top-0 left-0 w-36 z-[3] pointer-events-none heritage-float" />
                        <img src={A.b8} alt="" className="absolute top-0 right-0 w-36 z-[3] pointer-events-none heritage-float" style={{ animationDelay: '1s' }} />
                        <img src={A.b5} alt="" className="absolute bottom-0 left-0 w-44 z-[3] pointer-events-none" />
                        <img src={A.b3} alt="" className="absolute bottom-0 right-0 w-44 z-[3] pointer-events-none" />
                        <div className="flex-1" />
                        <div className="text-center px-8 max-w-sm mx-auto relative z-[10] pb-[8vh]">
                            <p className="text-xs uppercase tracking-[0.35em] mb-2" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>The Wedding Of</p>
                            <h1 className="text-4xl font-bold" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>{coupleNames || 'Bride & Groom'}</h1>
                            {guest && (
                                <div className="mt-5">
                                    <p className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: FONTS.heading, color: COLORS.primary }}>Yth. Bapak/Ibu/Saudara/i</p>
                                    <p className="text-lg font-bold mt-1" style={{ fontFamily: FONTS.heading, color: COLORS.gold }}>{guest.name}</p>
                                </div>
                            )}
                            <button onClick={handleOpen} className="mt-6 px-8 py-3 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 shadow-lg inline-flex items-center gap-2" style={{ backgroundColor: COLORS.gold, boxShadow: `0 4px 20px ${COLORS.gold}50` }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                BUKA UNDANGAN
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ MAIN CONTENT ═══ */}
                {isOpen && (
                    <div className="relative">
                        {/* Fixed parallax background */}
                        <div className="fixed inset-0 z-0 pointer-events-none">
                            <img src={A.bg} alt="" className="w-full h-full object-cover opacity-30" style={{ transform: `translateY(${parallaxY}px)` }} />
                        </div>
                        {/* Side ornaments */}
                        <img src={A.tree} alt="" className="fixed left-0 top-1/4 w-10 opacity-20 z-[1] pointer-events-none" />
                        <img src={A.treeH} alt="" className="fixed right-0 top-1/3 w-10 opacity-20 z-[1] pointer-events-none" />

                        {/* QR Modal */}
                        {enableQr && showQr && guest && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowQr(false)}>
                                <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                                    <h3 className="text-lg font-bold mb-1" style={{ color: COLORS.gold }}>QR Code Check-in</h3>
                                    <p className="text-sm mb-4 opacity-60">{guest.name}</p>
                                    <div className="p-4 rounded-xl inline-block" style={{ backgroundColor: COLORS.cream }}>
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=${COLORS.gold.replace('#','')}&data=${encodeURIComponent(window.location.origin+'/u/'+invitation.slug+'/checkin?to='+guest.slug)}`} alt="QR" className="w-48 h-48 mx-auto" />
                                    </div>
                                    <button onClick={() => setShowQr(false)} className="mt-4 px-6 py-2 rounded-full text-sm text-white" style={{ backgroundColor: COLORS.gold }}>Tutup</button>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        {!!invitation.show_side_menu && (
                            <nav className="fixed right-2 top-1/2 -translate-y-1/2 z-50 bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-1.5 flex flex-col gap-1">
                                {navSections.map(s => (
                                    <button key={s.section_key} onClick={() => scrollTo(`section-${s.section_key}`)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-bold transition-all ${activeNav === s.section_key ? 'text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                                        style={activeNav === s.section_key ? { backgroundColor: COLORS.gold } : {}}
                                        title={navLabels[s.section_key]}>
                                        {navLabels[s.section_key]?.charAt(0)}
                                    </button>
                                ))}
                            </nav>
                        )}

                        {/* Floating buttons */}
                        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                            {enableQr && guest && (
                                <button onClick={() => setShowQr(true)} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center" style={{ color: COLORS.gold }}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" /></svg>
                                </button>
                            )}
                            {invitation.music_url && (
                                <button onClick={toggleMusic} className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center" style={{ color: COLORS.gold }}>
                                    {musicPlaying ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>}
                                </button>
                            )}
                        </div>

                        {/* ═══ Sections ═══ */}
                        {visibleSections.filter(s => s.section_key !== 'cover').map((section) => (
                            <section key={section.id} id={`section-${section.section_key}`} data-section={section.section_key} className="relative overflow-hidden">

                                {/* OPENING */}
                                {section.section_key === 'opening' && (
                                    <div className="min-h-screen flex flex-col relative">
                                        <img src={A.b7} alt="" className="absolute top-0 left-0 w-36 z-10 pointer-events-none opacity-80 heritage-float" />
                                        <img src={A.b8} alt="" className="absolute top-0 right-0 w-36 z-10 pointer-events-none opacity-80 heritage-float" style={{ animationDelay: '1.5s' }} />
                                        <div className="flex-1 flex items-center justify-center px-6 py-12">
                                            <div className="max-w-md mx-auto text-center relative">
                                                <Ani type="scaleIn"><img src={A.lace} alt="" className="w-64 mx-auto opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none heritage-breathe" /></Ani>
                                                <Ani type="scaleIn" delay={100}><img src={A.stamp} alt="" className="w-20 mx-auto mb-4" /></Ani>
                                                {invitation.opening_ayat && <Ani type="fadeUp" delay={200}><p className="text-base leading-relaxed italic" style={{ fontFamily: FONTS.heading, color: COLORS.primary }}>"{invitation.opening_ayat}"</p></Ani>}
                                                {invitation.opening_ayat_translation && <Ani type="fadeUp" delay={300}><p className="text-sm leading-relaxed opacity-60 mt-2 italic">"{invitation.opening_ayat_translation}"</p></Ani>}
                                                {invitation.opening_ayat_source && <Ani type="fadeUp" delay={350}><p className="text-xs opacity-50 mt-1 font-medium">— {invitation.opening_ayat_source}</p></Ani>}
                                                <Ani type="fadeUp" delay={400}><div className="my-4 flex items-center justify-center gap-3"><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /><div className="w-2 h-2 rotate-45" style={{ backgroundColor: COLORS.gold }} /><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /></div></Ani>
                                                {invitation.opening_title && <Ani type="fadeUp" delay={500}><h2 className="text-xl font-bold" style={{ fontFamily: FONTS.heading, color: COLORS.gold }}>{invitation.opening_title}</h2></Ani>}
                                                {invitation.opening_text && <Ani type="fadeUp" delay={600}><p className="text-sm leading-relaxed whitespace-pre-line opacity-80 mt-3">{invitation.opening_text}</p></Ani>}
                                            </div>
                                        </div>
                                        <img src={A.b5} alt="" className="w-40 pointer-events-none opacity-60 absolute bottom-0 left-0" />
                                        <img src={A.b3} alt="" className="w-40 pointer-events-none opacity-60 absolute bottom-0 right-0" />
                                    </div>
                                )}

                                {/* BRIDE & GROOM */}
                                {section.section_key === 'bride_groom' && brideGrooms?.length >= 2 && (
                                    <div className="min-h-screen flex flex-col relative py-12">
                                        <img src={A.b4} alt="" className="absolute top-0 right-0 w-32 opacity-60 pointer-events-none" />
                                        <div className="flex-1 flex items-center justify-center px-6">
                                            <div className="max-w-md mx-auto text-center">
                                                <Ani type="fadeUp"><h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>Mempelai</h2></Ani>
                                                <Ani type="fadeUp" delay={100}><div className="my-3 flex items-center justify-center gap-3"><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /><div className="w-2 h-2 rotate-45" style={{ backgroundColor: COLORS.gold }} /><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /></div></Ani>
                                                {brideGrooms.map((bg, i) => (
                                                    <div key={i} className={i > 0 ? 'mt-8' : ''}>
                                                        {showPhotos && bg.photo && (
                                                            <Ani type="scaleIn" delay={200 + i * 400}>
                                                                <div className="relative w-40 h-52 mx-auto mb-3 heritage-breathe">
                                                                    <img src={A.frame} alt="" className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none" />
                                                                    <div className="absolute inset-[12%] overflow-hidden rounded-sm"><img src={bg.photo} alt={bg.full_name} className="w-full h-full object-cover" /></div>
                                                                </div>
                                                            </Ani>
                                                        )}
                                                        <Ani type="fadeUp" delay={300 + i * 400}><h3 className="text-3xl" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>{bg.full_name}</h3></Ani>
                                                        <Ani type="fadeUp" delay={400 + i * 400}><p className="text-sm opacity-70 mt-2">{bg.gender === 'wanita' ? 'Putri' : 'Putra'} {bg.child_order && `ke-${bg.child_order}`} dari<br/>Bapak {bg.father_name} & Ibu {bg.mother_name}</p></Ani>
                                                        {bg.instagram && <Ani type="fadeIn" delay={500 + i * 400}><a href={`https://instagram.com/${bg.instagram}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: COLORS.gold }}>@{bg.instagram}</a></Ani>}
                                                        {i === 0 && brideGrooms.length > 1 && <Ani type="scaleIn" delay={600}><p className="text-3xl mt-6" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>&</p></Ani>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* EVENT */}
                                {section.section_key === 'event' && events?.length > 0 && (
                                    <div className="relative py-12" style={{ backgroundImage: `url(${A.eventBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                        <div className="absolute inset-0" style={{ backgroundColor: COLORS.bg + 'CC' }} />
                                        <div className="relative z-10 px-6 max-w-md mx-auto text-center">
                                            <Ani type="fadeUp"><h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>Waktu & Tempat</h2></Ani>
                                            <Ani type="fadeUp" delay={100}><div className="my-3 flex items-center justify-center gap-3"><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /><div className="w-2 h-2 rotate-45" style={{ backgroundColor: COLORS.gold }} /><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /></div></Ani>
                                            {events.map((evt, i) => (
                                                <Ani key={i} type="fadeUp" delay={200 + i * 200}>
                                                    <div className="rounded-xl p-5 mb-4 border" style={{ backgroundColor: COLORS.cream + 'CC', borderColor: COLORS.gold + '30' }}>
                                                        <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>{evt.event_name}</h3>
                                                        <p className="text-sm mt-2" style={{ color: COLORS.text }}>{formatDate(evt.event_date)}</p>
                                                        <p className="text-sm" style={{ color: COLORS.text }}>Pukul {formatTime(evt.start_time)} {evt.end_time ? `- ${formatTime(evt.end_time)}` : ''} WIB</p>
                                                        {evt.venue_name && <p className="text-sm font-semibold mt-2" style={{ color: COLORS.primary }}>{evt.venue_name}</p>}
                                                        {evt.venue_address && <p className="text-xs opacity-60 mt-1">{evt.venue_address}</p>}
                                                        <div className="flex items-center justify-center gap-2 mt-3">
                                                            {evt.map_url && <a href={evt.map_url} target="_blank" rel="noopener" className="px-4 py-1.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: COLORS.gold }}>Lihat Lokasi</a>}
                                                            <a href={getCalendarUrl(evt)} target="_blank" rel="noopener" className="px-4 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: COLORS.gold, color: COLORS.gold }}>Ingatkan</a>
                                                        </div>
                                                    </div>
                                                </Ani>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* COUNTDOWN */}
                                {section.section_key === 'countdown' && showCountdown && primaryEvent && (
                                    <div className="py-12 text-center px-6">
                                        <Ani type="fadeUp"><h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>Menuju Hari Bahagia</h2></Ani>
                                        <Ani type="scaleIn" delay={200}>
                                            <div className="flex items-center justify-center gap-3 mt-6">
                                                {[['d','Hari'],['h','Jam'],['m','Menit'],['s','Detik']].map(([k,l]) => (
                                                    <div key={k} className="w-16 rounded-xl py-3 text-center" style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.gold}30` }}>
                                                        <div className="text-2xl font-bold" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>{cd[k]}</div>
                                                        <div className="text-[9px] uppercase tracking-wider opacity-50 mt-1">{l}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Ani>
                                    </div>
                                )}

                                {/* GALLERY */}
                                {section.section_key === 'gallery' && galleries?.length > 0 && (
                                    <div className="py-12 px-6 text-center">
                                        <Ani type="fadeUp"><h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>Our Moment</h2></Ani>
                                        <Ani type="fadeUp" delay={100}><div className="my-3 flex items-center justify-center gap-3"><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /><div className="w-2 h-2 rotate-45" style={{ backgroundColor: COLORS.gold }} /><div className="h-px flex-1 max-w-16" style={{ backgroundColor: COLORS.gold + '40' }} /></div></Ani>
                                        <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                                            {galleries.map((g, i) => (
                                                <Ani key={i} type="scaleIn" delay={200 + i * 100}><img src={g.image_path} alt="" className="w-full aspect-square object-cover rounded-lg" style={{ border: `2px solid ${COLORS.gold}20` }} /></Ani>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* LOVE STORY */}
                                {section.section_key === 'love_story' && loveStories?.length > 0 && (
                                    <div className="py-12 px-6">
                                        <div className="max-w-md mx-auto text-center">
                                            <Ani type="fadeUp"><h2 className="text-2xl" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>Journey of Love</h2></Ani>
                                            <div className="mt-6 space-y-4 text-left">
                                                {loveStories.map((s, i) => (
                                                    <Ani key={i} type={i % 2 === 0 ? 'fadeLeft' : 'fadeRight'} delay={200 + i * 150}>
                                                        <div className="rounded-xl p-4" style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.gold}20` }}>
                                                            {s.story_date && <p className="text-xs font-medium mb-1" style={{ color: COLORS.gold }}>{s.story_date}</p>}
                                                            <h4 className="text-sm font-bold" style={{ color: COLORS.primary, fontFamily: FONTS.heading }}>{s.title}</h4>
                                                            <p className="text-xs opacity-70 mt-1 leading-relaxed">{s.description}</p>
                                                        </div>
                                                    </Ani>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* BANK / GIFT */}
                                {section.section_key === 'bank' && bankAccounts?.length > 0 && (
                                    <div className="py-12 px-6 text-center">
                                        <Ani type="fadeUp"><h2 className="text-xs uppercase tracking-[0.3em]" style={{ color: COLORS.gold, fontFamily: FONTS.heading }}>Amplop Digital</h2></Ani>
                                        <Ani type="fadeUp" delay={100}><p className="text-sm opacity-60 mt-2">Doa restu Anda merupakan karunia yang sangat berarti bagi kami.</p></Ani>
                                        <div className="mt-4 max-w-sm mx-auto space-y-3">
                                            {bankAccounts.map((b, i) => (
                                                <Ani key={i} type="fadeUp" delay={200 + i * 150}>
                                                    <div className="rounded-xl p-4 text-left" style={{ backgroundColor: COLORS.cream, border: `1px solid ${COLORS.gold}30` }}>
                                                        <div className="text-xs font-bold uppercase" style={{ color: COLORS.gold }}>{b.bank_name}</div>
                                                        <div className="text-sm font-mono mt-1" style={{ color: COLORS.primary }}>{b.account_number}</div>
                                                        <div className="text-xs opacity-60">a.n. {b.account_holder}</div>
                                                        <button onClick={() => { navigator.clipboard.writeText(b.account_number); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }}
                                                            className="mt-2 px-4 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: COLORS.gold }}>
                                                            {copiedIdx === i ? '✓ Disalin' : 'Salin'}
                                                        </button>
                                                    </div>
                                                </Ani>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* RSVP */}
                                {section.section_key === 'rsvp' && enableRsvp && (
                                    <div className="py-12 px-6 text-center">
                                        <Ani type="fadeUp"><h2 className="text-2xl" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>RSVP</h2></Ani>
                                        <Ani type="fadeUp" delay={100}><p className="text-sm opacity-60 mt-2">Konfirmasi kehadiran Anda</p></Ani>
                                        <Ani type="fadeUp" delay={200}>
                                            <form onSubmit={handleRsvp} className="max-w-sm mx-auto mt-4 space-y-3">
                                                <div className="flex gap-2">
                                                    {['hadir','tidak hadir'].map(v => (
                                                        <button key={v} type="button" onClick={() => rsvpForm.setData('attendance', v)}
                                                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${rsvpForm.data.attendance === v ? 'text-white' : ''}`}
                                                            style={rsvpForm.data.attendance === v ? { backgroundColor: COLORS.gold, borderColor: COLORS.gold } : { borderColor: COLORS.gold + '50', color: COLORS.gold }}>
                                                            {v === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                                                        </button>
                                                    ))}
                                                </div>
                                                {rsvpForm.data.attendance === 'hadir' && (
                                                    <input type="number" min={1} max={10} value={rsvpForm.data.number_of_guests} onChange={e => rsvpForm.setData('number_of_guests', parseInt(e.target.value))}
                                                        className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor: COLORS.gold + '50' }} placeholder="Jumlah tamu" />
                                                )}
                                                <button type="submit" disabled={rsvpForm.processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: COLORS.gold }}>
                                                    {rsvpForm.processing ? 'Mengirim...' : 'Kirim RSVP'}
                                                </button>
                                            </form>
                                        </Ani>
                                    </div>
                                )}

                                {/* WISHES */}
                                {section.section_key === 'wishes' && enableWishes && (
                                    <div className="py-12 px-6">
                                        <div className="max-w-md mx-auto text-center">
                                            <Ani type="fadeUp"><h2 className="text-2xl" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>Doa & Ucapan</h2></Ani>
                                            <Ani type="fadeUp" delay={100}>
                                                <form onSubmit={handleWish} className="mt-4 space-y-3 text-left">
                                                    <input type="text" value={wishForm.data.sender_name} onChange={e => wishForm.setData('sender_name', e.target.value)}
                                                        className="w-full border rounded-lg px-3 py-2 text-sm" style={{ borderColor: COLORS.gold + '50' }} placeholder="Nama" required />
                                                    <textarea value={wishForm.data.message} onChange={e => wishForm.setData('message', e.target.value)}
                                                        className="w-full border rounded-lg px-3 py-2 text-sm h-24 resize-none" style={{ borderColor: COLORS.gold + '50' }} placeholder="Tulis ucapan..." required />
                                                    <button type="submit" disabled={wishForm.processing} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: COLORS.gold }}>
                                                        {wishForm.processing ? 'Mengirim...' : 'Kirim Ucapan'}
                                                    </button>
                                                </form>
                                            </Ani>
                                            {wishes?.length > 0 && (
                                                <div className="mt-6 space-y-2 max-h-64 overflow-y-auto text-left">
                                                    {wishes.map((w, i) => (
                                                        <Ani key={i} type="fadeUp" delay={i * 50}>
                                                            <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.cream }}>
                                                                <div className="text-xs font-bold" style={{ color: COLORS.gold }}>{w.sender_name}</div>
                                                                <p className="text-xs opacity-70 mt-0.5">{w.message}</p>
                                                            </div>
                                                        </Ani>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* CLOSING */}
                                {section.section_key === 'closing' && (
                                    <div className="min-h-[60vh] flex flex-col relative">
                                        <img src={A.b7} alt="" className="absolute top-0 left-0 w-32 pointer-events-none opacity-60" />
                                        <img src={A.b8} alt="" className="absolute top-0 right-0 w-32 pointer-events-none opacity-60" />
                                        <div className="flex-1 flex items-center justify-center px-6 py-12">
                                            <div className="max-w-md mx-auto text-center">
                                                <Ani type="scaleIn"><img src={A.stamp} alt="" className="w-16 mx-auto mb-4 opacity-60" /></Ani>
                                                {invitation.closing_title && <Ani type="fadeUp" delay={100}><h2 className="text-xl font-bold" style={{ fontFamily: FONTS.heading, color: COLORS.gold }}>{invitation.closing_title}</h2></Ani>}
                                                {invitation.closing_text && <Ani type="fadeUp" delay={200}><p className="text-sm leading-relaxed whitespace-pre-line opacity-80 mt-3">{invitation.closing_text}</p></Ani>}
                                                <Ani type="fadeUp" delay={300}><p className="text-2xl mt-6" style={{ fontFamily: FONTS.script, color: COLORS.gold }}>{coupleNames}</p></Ani>
                                            </div>
                                        </div>
                                        <img src={A.b5} alt="" className="w-44 pointer-events-none opacity-60 absolute bottom-0 left-0" />
                                        <img src={A.b3} alt="" className="w-44 pointer-events-none opacity-60 absolute bottom-0 right-0" />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
