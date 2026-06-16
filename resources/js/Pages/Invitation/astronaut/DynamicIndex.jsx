import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { Head, useForm } from '@inertiajs/react';
import WishesEmojiPicker from '@/Components/WishesEmojiPicker';
import PremiumSlideshow from '@/Components/PremiumSlideshow';
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';
import './style.css';

/* ─── Helpers ─── */
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

function formatDate(d, locale = 'id') {
    if (!d) return '';
    try {
        const dateObj = new Date(String(d).substring(0, 10) + 'T12:00:00');
        if (isNaN(dateObj.getTime())) return d;
        return dateObj.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (e) {
        return d;
    }
}

function formatStoryDate(dateStr, locale = 'id') {
    if (!dateStr) return '';
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    if (datePattern.test(dateStr)) {
        try {
            const d = new Date(String(dateStr).substring(0, 10) + 'T12:00:00');
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        } catch (e) {}
    }
    return dateStr;
}

function formatTime(t) {
    if (!t || t === 'Selesai') return t || '';
    return String(t).substring(0, 5);
}

// Global flags
let globalShowPhotos = true;
let globalShowAnimations = true;

/* ═══════════════════════════════════════
   ERROR BOUNDARY
   ═══════════════════════════════════════ */
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="p-8 text-center bg-indigo-950 border border-cyan-500 rounded-3xl m-6 text-white">
                <h2 className="text-lg font-bold text-cyan-400">Terjadi kesalahan pada rendering tema Space Odyssey.</h2>
                <pre className="text-xs text-rose-400 mt-2">{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}

/* ═══════════════════════════════════════
   SCROLL REVEAL COMPONENT
   ═══════════════════════════════════════ */
function Reveal({ children, className = '', delay = 0 }) {
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

    return (
        <div 
            ref={ref} 
            className={`${className} transition-all duration-1000 ${!globalShowAnimations ? '' : (visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95')}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   TWINKLING BACKGROUND STARS
   ═══════════════════════════════════════ */
function TwinklingStars() {
    const starList = useMemo(() => {
        const list = [];
        for (let i = 0; i < 50; i++) {
            list.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 2.5 + 1, // 1px to 3.5px
                duration: Math.random() * 3 + 2, // 2s to 5s
                delay: Math.random() * 4
            });
        }
        return list;
    }, []);

    const nebulaList = useMemo(() => {
        const list = [];
        for (let i = 0; i < 3; i++) {
            list.push({
                id: i,
                left: Math.random() * 80 - 10,
                top: Math.random() * 80 - 10,
                scale: Math.random() * 1.5 + 0.8
            });
        }
        return list;
    }, []);

    return (
        <div className="ast-space-bg">
            {nebulaList.map(n => (
                <div 
                    key={n.id} 
                    className="ast-nebula" 
                    style={{ 
                        left: `${n.left}%`, 
                        top: `${n.top}%`,
                        transform: `scale(${n.scale})`
                    }} 
                />
            ))}
            {starList.map(s => (
                <div
                    key={s.id}
                    className="ast-star"
                    style={{
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDuration: `${s.duration}s`,
                        animationDelay: `${s.delay}s`
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   INTERACTIVE COSMIC PARTICLES
   ═══════════════════════════════════════ */
function CosmicParticles({ active }) {
    const [particles, setParticles] = useState([]);
    const [sparkles, setSparkles] = useState([]);

    const spawnParticle = useCallback(() => {
        const id = Math.random().toString(36).substring(2, 9);
        const left = Math.random() * 80 + 10; // 10% to 90%
        const size = Math.random() * 20 + 25; // 25px to 45px
        const duration = Math.random() * 5 + 6; // 6s to 11s
        const delay = Math.random() * 1.5;
        const types = ['star', 'rocket', 'planet', 'ufo'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        setParticles(prev => [...prev, { id, left, size, duration, delay, type }]);
        
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== id));
        }, (duration + delay) * 1000);
    }, []);

    useEffect(() => {
        if (!active) return;
        
        for (let i = 0; i < 4; i++) {
            setTimeout(spawnParticle, i * 800);
        }
        const interval = setInterval(spawnParticle, 3000);
        return () => clearInterval(interval);
    }, [active, spawnParticle]);

    const handlePop = (e, id) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Spawn sparkles
        const newSparkles = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45 * Math.PI) / 180;
            const distance = Math.random() * 40 + 30;
            newSparkles.push({
                id: Math.random().toString(36).substring(2, 9),
                x,
                y,
                tx: `${Math.cos(angle) * distance}px`,
                ty: `${Math.sin(angle) * distance}px`,
                color: ['#00F0FF', '#FF8C00', '#FFE600', '#FF3B30', '#8A2BE2'][Math.floor(Math.random() * 5)]
            });
        }
        setSparkles(prev => [...prev, ...newSparkles]);
        
        // Remove particles & old sparkles
        setParticles(prev => prev.filter(p => p.id !== id));
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => !newSparkles.some(ns => ns.id === s.id)));
        }, 800);
    };

    // Render Particle SVGs
    const renderParticleSVG = (type, size) => {
        if (type === 'star') {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFE600" stroke="#FFF" strokeWidth="1"/>
                </svg>
            );
        }
        if (type === 'ufo') {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="12" cy="14" rx="10" ry="4" fill="#8A2BE2" stroke="#00F0FF" strokeWidth="1.5"/>
                    <path d="M6 13C6 9 8.5 7 12 7C15.5 7 18 9 18 13" fill="#00F0FF" fillOpacity="0.4" stroke="#00F0FF" strokeWidth="1.5"/>
                    <circle cx="8" cy="14" r="1" fill="#FFE600"/>
                    <circle cx="12" cy="14" r="1" fill="#FFE600"/>
                    <circle cx="16" cy="14" r="1" fill="#FFE600"/>
                </svg>
            );
        }
        if (type === 'planet') {
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="7" fill="#FF8C00" stroke="#FFF" strokeWidth="1"/>
                    <ellipse cx="12" cy="12" rx="11" ry="3" fill="none" stroke="#00F0FF" strokeWidth="1.5" transform="rotate(-15 12 12)"/>
                </svg>
            );
        }
        // Rocket default
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C15 6 16 11 15 16H9C8 11 9 6 12 2Z" fill="#FFF" stroke="#FF8C00" strokeWidth="1"/>
                <path d="M9 16C8 16 5 18 5 21H19C19 18 16 16 15 16" fill="#8A2BE2"/>
                <circle cx="12" cy="9" r="2.5" fill="#00F0FF"/>
                <path d="M10 21C10 21 11 23 12 23C13 23 14 21 14 21" stroke="#FF4500" strokeWidth="1.5"/>
            </svg>
        );
    };

    return (
        <div className="ast-cosmic-particles-container">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="ast-cosmic-particle"
                    onClick={(e) => handlePop(e, p.id)}
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                >
                    {renderParticleSVG(p.type, p.size)}
                </div>
            ))}
            {sparkles.map(s => (
                <div
                    key={s.id}
                    className="ast-sparkle"
                    style={{
                        left: `${s.x}px`,
                        top: `${s.y}px`,
                        backgroundColor: s.color,
                        '--tx': s.tx,
                        '--ty': s.ty,
                    }}
                />
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   THEME TEXTS LABELS RESOLVER
   ═══════════════════════════════════════ */
function getThemeLabels(locale = 'id', brideGrooms = [], invitation = {}) {
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    const mainName = host.nickname || host.full_name || 'Space Cadet';
    const initials = mainName.charAt(0) || 'S';

    return {
        mainName,
        initials,
        labels: {
            coverHeader: isEn ? 'GALACTIC MISSION' : 'MISI ANTARIKSA',
            coverSubtitle: invitation?.cover_subtitle || (isEn ? "5th Space Birthday" : "Ulang Tahun Luar Angkasa"),
            profileHeader: isEn ? 'SPACE CADET CREW' : 'ASTRONOT CILIK',
            kidOrderFallback: isEn ? 'ASTRONOT COMMANDER' : 'PUTRA TERCINTA',
            storyBadge: isEn ? 'GROWTH CHRONICLES' : 'TUMBUH KEMBANG',
            storyHeader: isEn ? 'SPACE MILESTONES' : 'PERJALANAN USIA',
            eventBadge: isEn ? 'MISSION LOCATION' : 'LOKASI MISI',
            eventHeader: isEn ? 'SPACE BASE DETAILS' : 'DETAIL ACARA PESTA',
            giftBadge: isEn ? 'FUEL DEPOT' : 'KADO DIGITAL',
            giftHeader: isEn ? 'ENERGY GIFT RECHARGE' : 'KIRIM KADO DIGITAL',
            closingTitle: isEn ? 'MISSION SUCCESS!' : 'MISI SELESAI!',
            closingText: invitation?.closing_text || (isEn ? "Thank you for orbiting with us today!" : "Merupakan kehormatan besar bagi kami apabila para kru berkenan hadir. Terima kasih!")
        }
    };
}

/* ═══════════════════════════════════════
   CUTE VECTOR ASTRONOT SVG ORNAMENT
   ═══════════════════════════════════════ */
function AstronautSVG({ size = 150 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="ast-floating-astronaut">
            {/* Oxygen Tank */}
            <rect x="55" y="65" width="90" height="70" rx="15" fill="#E2E8F0" stroke="#0F1026" strokeWidth="4"/>
            <rect x="75" y="55" width="20" height="10" rx="3" fill="#FF8C00" stroke="#0F1026" strokeWidth="3"/>
            <rect x="105" y="55" width="20" height="10" rx="3" fill="#00F0FF" stroke="#0F1026" strokeWidth="3"/>
            
            {/* Left Arm (Waving) */}
            <path d="M50 100C30 90 25 70 35 60C45 50 60 70 60 85" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="33" cy="58" r="10" fill="#FF8C00" stroke="#0F1026" strokeWidth="3"/>
            
            {/* Right Arm */}
            <path d="M150 100C165 110 180 110 185 120C190 130 175 140 160 125" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="183" cy="122" r="10" fill="#FF8C00" stroke="#0F1026" strokeWidth="3"/>

            {/* Left Leg */}
            <rect x="72" y="140" width="22" height="35" rx="7" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4"/>
            <rect x="67" y="170" width="30" height="12" rx="4" fill="#FF8C00" stroke="#0F1026" strokeWidth="3"/>

            {/* Right Leg */}
            <rect x="106" y="140" width="22" height="35" rx="7" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4"/>
            <rect x="103" y="170" width="30" height="12" rx="4" fill="#FF8C00" stroke="#0F1026" strokeWidth="3"/>

            {/* Spacesuit Body */}
            <rect x="65" y="80" width="70" height="70" rx="25" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4"/>
            {/* Chest Badge */}
            <rect x="85" y="95" width="30" height="20" rx="5" fill="#E2E8F0" stroke="#0F1026" strokeWidth="3"/>
            <circle cx="93" cy="105" r="4" fill="#FF3B30"/>
            <circle cx="107" cy="105" r="4" fill="#00F0FF"/>

            {/* Astronaut Helmet */}
            <circle cx="100" cy="65" r="45" fill="#FFFFFF" stroke="#0F1026" strokeWidth="4"/>
            {/* Visor Glass */}
            <path d="M68 65C68 45 82 35 100 35C118 35 132 45 132 65C132 80 118 88 100 88C82 88 68 80 68 65Z" fill="#1A1C38" stroke="#00F0FF" strokeWidth="4"/>
            <path d="M72 65C72 50 85 40 100 40C115 40 128 50 128 65C128 66 127 75 100 75C73 75 72 66 72 65Z" fill="#0D5C75" opacity="0.6"/>
            {/* Star Light reflection on Visor */}
            <circle cx="85" cy="50" r="4" fill="#FFFFFF"/>
            <circle cx="95" cy="48" r="2" fill="#FFFFFF"/>
            {/* Cute Helmet Antenna */}
            <line x1="100" y1="20" x2="100" y2="5" stroke="#0F1026" strokeWidth="3"/>
            <circle cx="100" cy="3" r="5" fill="#FF8C00" stroke="#0F1026" strokeWidth="2"/>
        </svg>
    );
}

/* ═══════════════════════════════════════
   CUTE VECTOR ROCKET FLYING TRANSITION
   ═══════════════════════════════════════ */
function RocketSVG({ size = 120, active }) {
    return (
        <div className={`ast-rocket-fly ${active ? 'active' : ''}`}>
            <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Flame */}
                <path d="M35 85C35 85 20 95 30 100C40 105 45 90 45 90L35 85Z" fill="#FF4500" className="ast-engine-glow"/>
                <path d="M45 90C45 90 35 100 42 105C49 110 52 92 52 92L45 90Z" fill="#FF8C00" className="ast-engine-glow"/>
                
                {/* Rocket Fins */}
                <path d="M22 65L12 82C12 82 25 85 30 75L22 65Z" fill="#8A2BE2" stroke="#0F1026" strokeWidth="3"/>
                <path d="M58 32L75 42C75 42 72 55 62 50L58 32Z" fill="#8A2BE2" stroke="#0F1026" strokeWidth="3"/>
                
                {/* Rocket Body */}
                <path d="M25 55L45 75C60 70 85 45 90 20C92 15 85 8 80 10C55 15 30 40 25 55Z" fill="#FFFFFF" stroke="#0F1026" strokeWidth="3"/>
                
                {/* Red Cone Nose */}
                <path d="M72 28C78 25 84 18 88 12C88 12 82 6 76 10C70 14 72 22 72 28Z" fill="#FF3B30" stroke="#0F1026" strokeWidth="2"/>
                
                {/* Spaceship Window */}
                <circle cx="53" cy="47" r="8" fill="#00F0FF" stroke="#0F1026" strokeWidth="3"/>
                <circle cx="50" cy="44" r="2" fill="#FFFFFF"/>
            </svg>
        </div>
    );
}

/* ═══════════════════════════════════════
   UNIFIED COUNTDOWN TIMER BLOCK
   ═══════════════════════════════════════ */
function CountdownBlock({ events, locale }) {
    const primaryEvent = useMemo(() => {
        return safeArr(events).find(e => e.is_primary) || safeArr(events)[0] || {};
    }, [events]);

    const targetDate = primaryEvent.event_date;
    const startTime = primaryEvent.start_time;

    const calculateTimeLeft = useCallback(() => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        const ds = String(targetDate).substring(0, 10);
        const timeStr = String(startTime || '15:00').substring(0, 5);
        const target = new Date(`${ds}T${timeStr}:00`);
        const difference = target.getTime() - new Date().getTime();

        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }, [targetDate, startTime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const left = calculateTimeLeft();
            setTimeLeft(left);
            if (!left) clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    if (!timeLeft) return null;

    const isEn = String(locale).toLowerCase() === 'en';

    return (
        <div className="text-center my-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-500 mb-2">
                {isEn ? 'LAUNCH COUNTDOWN' : 'HITUNG MUNDUR ACARA'}
            </h4>
            <div className="ast-countdown-wrapper">
                <div className="ast-countdown-item">
                    <div className="ast-countdown-val">{timeLeft.days}</div>
                    <div className="ast-countdown-label">{isEn ? 'DAYS' : 'HARI'}</div>
                </div>
                <div className="ast-countdown-item">
                    <div className="ast-countdown-val">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="ast-countdown-label">{isEn ? 'HOURS' : 'JAM'}</div>
                </div>
                <div className="ast-countdown-item">
                    <div className="ast-countdown-val">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="ast-countdown-label">{isEn ? 'MINUTES' : 'MENIT'}</div>
                </div>
                <div className="ast-countdown-item">
                    <div className="ast-countdown-val">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="ast-countdown-label">{isEn ? 'SECONDS' : 'DETIK'}</div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   COVER SECTION Component
   ═══════════════════════════════════════ */
function CoverSection({ invitation, guest, brideGrooms, onOpen, isOpened }) {
    const { locale } = useTranslation();
    const { mainName, labels } = getThemeLabels(locale, brideGrooms, invitation);
    const [rocketActive, setRocketActive] = useState(false);

    const handleOpenClick = () => {
        setRocketActive(true);
        setTimeout(() => {
            onOpen();
        }, 1200);
    };

    const guestName = guest?.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';

    return (
        <div className={`ast-cover-screen ${isOpened ? 'opened' : ''}`}>
            {/* Star background khusus cover */}
            <TwinklingStars />
            <RocketSVG active={rocketActive} />

            <div className="ast-cover-header">
                <span className="ast-badge">{labels.coverHeader}</span>
                <p className="text-cyan-300 text-xs tracking-widest mt-1">SYSTEM ONLINE</p>
            </div>

            <div className="ast-cover-body">
                <div className="ast-cover-astronaut-container">
                    <div className="ast-portal-ring" />
                    <div className="ast-portal-glow" />
                    <AstronautSVG size={160} />
                </div>

                <h1 className="ast-cover-title">{invitation?.cover_title || mainName}</h1>
                <p className="ast-cover-subtitle">{labels.coverSubtitle}</p>

                {guestName && (
                    <div className="ast-guest-box">
                        <div className="ast-guest-label">Crew Passenger</div>
                        <h3 className="ast-guest-name">{guestName}</h3>
                    </div>
                )}
            </div>

            <div className="ast-cover-footer">
                <button type="button" onClick={handleOpenClick} className="ast-btn mb-6">
                    <i className="fas fa-rocket" /> ENTER COMMAND DECK
                </button>
                {invitation?.opening_ayat && (
                    <p className="ast-opening-quote">{invitation.opening_ayat}</p>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   CARD ORNAMENTS HELPER
   ═══════════════════════════════════════ */
function CardOrnaments({ pattern = 1 }) {
    return (
        <>
            {pattern === 1 && (
                <>
                    <div className="ast-card-decor top-left ast-decor-spin" style={{ color: 'var(--ast-secondary)' }}>
                        <i className="fas fa-globe" />
                    </div>
                    <div className="ast-card-decor bottom-right ast-decor-float" style={{ color: 'var(--ast-primary)' }}>
                        <i className="fas fa-moon" />
                    </div>
                    <div className="ast-card-decor top-right ast-decor-pulse" style={{ color: 'var(--ast-yellow)' }}>
                        <i className="fas fa-star" />
                    </div>
                </>
            )}
            {pattern === 2 && (
                <>
                    <div className="ast-card-decor top-right ast-decor-spin" style={{ color: 'var(--ast-secondary)' }}>
                        <i className="fas fa-meteor" />
                    </div>
                    <div className="ast-card-decor bottom-left ast-decor-float" style={{ color: 'var(--ast-accent)' }}>
                        <i className="fas fa-rocket" />
                    </div>
                    <div className="ast-card-decor top-left ast-decor-pulse" style={{ color: 'var(--ast-yellow)' }}>
                        <i className="fas fa-star" />
                    </div>
                </>
            )}
            {pattern === 3 && (
                <>
                    <div className="ast-card-decor bottom-right ast-decor-spin" style={{ color: 'var(--ast-secondary)' }}>
                        <i className="fas fa-satellite" />
                    </div>
                    <div className="ast-card-decor top-left ast-decor-float" style={{ color: 'var(--ast-primary)' }}>
                        <i className="fas fa-moon" />
                    </div>
                    <div className="ast-card-decor bottom-left ast-decor-pulse" style={{ color: 'var(--ast-yellow)' }}>
                        <i className="fas fa-star" />
                    </div>
                </>
            )}
        </>
    );
}

/* ═══════════════════════════════════════
   GALACTIC WELCOME (Opening)
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, brideGrooms, id, events, locale }) {
    const showPhotos = parseBool(invitation?.show_photos) && !invitation?.hide_photos;
    const { mainName } = getThemeLabels(locale, brideGrooms, invitation);
    const couples = safeArr(brideGrooms);
    const celebrant = couples[0] || {};

    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    // Age calculation
    const celebrantAge = useMemo(() => {
        if (!celebrant.birth_date || !events[0]?.event_date) return null;
        try {
            const birthYear = new Date(String(celebrant.birth_date).substring(0, 10) + 'T12:00:00').getFullYear();
            const eventYear = new Date(String(events[0].event_date).substring(0, 10) + 'T12:00:00').getFullYear();
            return eventYear - birthYear;
        } catch (e) {
            return null;
        }
    }, [celebrant.birth_date, events]);

    return (
        <section id={id || "opening"} className="ast-section">
            <Reveal className="ast-card">
                <CardOrnaments pattern={1} />
                <h3 className="ast-welcome-title">
                    {invitation?.opening_title || (locale === 'en' ? 'GREETINGS CADETS!' : 'SALAM PENJELAJAH!')}
                </h3>
                
                {showPhotos && openingImages.length > 0 ? (
                    <div className="ast-opening-slideshow-container">
                        <PremiumSlideshow
                            images={openingImages}
                            positionX={invitation?.opening_position_x}
                            positionY={invitation?.opening_position_y}
                            zoom={invitation?.opening_zoom}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center my-6">
                        <AstronautSVG size={120} />
                    </div>
                )}

                <div className="text-center my-4">
                    <h2 className="text-2xl font-bold text-orange-400 mb-1">
                        {mainName.toUpperCase()}
                    </h2>
                    {celebrantAge && (
                        <span className="inline-block bg-cyan-950 text-cyan-400 font-bold border border-cyan-500/30 text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                            {locale === 'en' ? `IS TURNING ${celebrantAge}!` : `MEMASUKI USIA ${celebrantAge} TAHUN!`}
                        </span>
                    )}
                </div>

                <p className="ast-welcome-text">
                    {invitation?.opening_text || 'Hari yang penuh keajaiban antariksa telah tiba! Mari bersama-sama merayakan perjalanan bintang si kecil.'}
                </p>

                {invitation?.opening_ayat && (
                    <div className="ast-quote-box">
                        <p className="ast-quote-text">
                            "{invitation.opening_ayat}"
                        </p>
                        {invitation.opening_ayat_source && (
                            <p className="ast-quote-source">
                                — {invitation.opening_ayat_source}
                            </p>
                        )}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   SPACE CADET PROFILE (Celebrant)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, id, locale, invitation }) {
    const couples = safeArr(brideGrooms);
    const celebrant = couples[0] || {};
    const showPhotos = parseBool(invitation?.show_photos) && !invitation?.hide_photos;
    
    const { labels } = getThemeLabels(locale, brideGrooms, invitation);

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

    const hasFather = !!celebrant.father_name;
    const hasMother = !!celebrant.mother_name;
    const persInitials = (celebrant.nickname || celebrant.full_name || 'C')
        .substring(0, 2)
        .toUpperCase();

    return (
        <section id={id || "bride_groom"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">{labels.profileHeader}</span>
                <h2 className="ast-title">{locale === 'en' ? 'COSMIC STAR' : 'BINTANG KECIL'}</h2>
            </div>

            <Reveal className="ast-card">
                <CardOrnaments pattern={2} />
                <div className="ast-profile-container">
                    <div className="ast-profile-photo-wrapper">
                        <div className="ast-space-helmet-frame" />
                        <div className="ast-space-helmet-inner">
                            <div className="ast-visor-reflection" />
                            {showPhotos && celebrant.photo ? (
                                <img 
                                    src={getStorageUrl(celebrant.photo)} 
                                    alt={celebrant.full_name} 
                                    style={{
                                        objectPosition: `${celebrant.photo_position_x ?? 50}% ${celebrant.photo_position_y ?? 50}%`,
                                        transform: `scale(${celebrant.photo_zoom ?? 1.0})`,
                                        transformOrigin: 'center'
                                    }}
                                />
                            ) : (
                                <div className="ast-profile-fallback">{persInitials}</div>
                            )}
                        </div>
                    </div>

                    <h2 className="ast-celebrant-name">{celebrant.full_name}</h2>
                    
                    <p className="ast-celebrant-order">
                        {translateChildOrder(celebrant.child_order, celebrant.gender) || (locale === 'en' ? labels.kidOrderFallback : 'PUTRA/PUTRI TERCINTA')}
                    </p>

                    {celebrant.bio && (
                        <p className="ast-celebrant-bio">{celebrant.bio}</p>
                    )}

                    {(hasFather || hasMother) && (
                        <div className="ast-crew-info">
                            <span className="ast-crew-label">Space Crew Parents</span>
                            <h4 className="ast-crew-names">
                                {hasFather && hasMother ? (
                                    locale === 'en' 
                                        ? `Mr. ${celebrant.father_name} & Mrs. ${celebrant.mother_name}`
                                        : `Bapak ${celebrant.father_name} & Ibu ${celebrant.mother_name}`
                                ) : (
                                    celebrant.father_name || celebrant.mother_name
                                )}
                            </h4>
                        </div>
                    )}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   SPACE MILESTONES (Love Story)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, id, locale, invitation }) {
    const list = safeArr(loveStories);
    const { labels } = getThemeLabels(locale, [], invitation);

    if (list.length === 0) return null;

    return (
        <section id={id || "love_story"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">{labels.storyBadge}</span>
                <h2 className="ast-title">{labels.storyHeader}</h2>
            </div>

            <Reveal className="ast-card">
                <CardOrnaments pattern={3} />
                <div className="ast-timeline">
                    {list.map((story, index) => (
                        <div key={index} className="ast-timeline-item">
                            <div className="ast-timeline-node" />
                            <div className="ast-timeline-content">
                                <h4 className="ast-timeline-title">{story.title}</h4>
                                {story.story_date && (
                                    <div className="ast-timeline-date">
                                        {formatStoryDate(story.story_date, locale)}
                                    </div>
                                )}
                                <p className="ast-timeline-desc">{story.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   SPACE MISSION EVENT (Party Details)
   ═══════════════════════════════════════ */
function EventSection({ events, id, locale, invitation }) {
    const list = safeArr(events);
    const { t } = useTranslation();
    const { labels } = getThemeLabels(locale, [], invitation);
    
    const showCountdown = parseBool(invitation?.show_countdown);

    if (list.length === 0) return null;

    return (
        <section id={id || "event"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">{labels.eventBadge}</span>
                <h2 className="ast-title">{labels.eventHeader}</h2>
            </div>

            {/* Countdown diintegrasikan di atas detail event sesuai standar seksi event */}
            {showCountdown && <CountdownBlock events={events} locale={locale} />}

            <div className="space-y-6">
                {list.map((evt, idx) => (
                    <Reveal key={idx} className="ast-card">
                        <CardOrnaments pattern={1} />
                        <div className="ast-event-card">
                            <div className="ast-event-icon">
                                <i className="fas fa-satellite-dish" />
                            </div>

                            <h3 className="ast-event-name">
                                {evt.event_name || (locale === 'en' ? 'Galactic Party' : 'Pesta Galaksi')}
                            </h3>

                            <div className="ast-event-detail-row">
                                <p className="ast-event-date-text">
                                    {formatDate(evt.event_date, locale)}
                                </p>
                                <p className="ast-event-time-text">
                                    {formatTime(evt.start_time)} — {evt.end_time ? formatTime(evt.end_time) : (locale === 'en' ? 'END' : 'SELESAI')} {evt.timezone || 'WIB'}
                                </p>
                            </div>

                            <div className="ast-event-detail-row mt-4">
                                <h4 className="ast-venue-name">{evt.venue_name}</h4>
                                <p className="ast-venue-address">{evt.venue_address}</p>
                            </div>

                            {evt.gmaps_link && (
                                <button
                                    type="button"
                                    onClick={() => window.open(evt.gmaps_link, '_blank')}
                                    className="ast-btn ast-btn-cyan w-full mt-2"
                                >
                                    <i className="fas fa-map-marked-alt" /> {locale === 'en' ? 'GOOGLE MAPS NAVIGATION' : 'BUKA GOOGLE MAPS'}
                                </button>
                            )}
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   VIRTUAL STREAMING SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, locale }) {
    const primaryEvent = useMemo(() => {
        return safeArr(events).find(e => e.is_primary) || safeArr(events)[0] || {};
    }, [events]);

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
        <section id="livestream" className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">VIRTUAL ORBIT</span>
                <h2 className="ast-title">{locale === 'en' ? 'LIVE STREAMING' : 'SIARAN LANGSUNG'}</h2>
            </div>

            <Reveal className="ast-card text-center">
                <CardOrnaments pattern={2} />
                <div className="mb-4">
                    <i className="fas fa-video text-3xl text-cyan-400 animate-pulse" />
                </div>
                <p className="text-sm text-slate-300 mb-6">
                    {locale === 'en' 
                        ? 'Join our galactic celebration virtually from anywhere in the universe!' 
                        : 'Saksikan pesta luar angkasa kami secara virtual dari mana saja!'}
                </p>

                <div className="space-y-3">
                    {streamsList.map((stream, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => window.open(stream.url, '_blank')}
                            className="ast-btn w-full"
                        >
                            <i className="fas fa-play" /> TRANSMIT {stream.platform.toUpperCase()}
                        </button>
                    ))}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   COSMIC GALLERY
   ═══════════════════════════════════════ */
function GallerySection({ galleries, id, locale, invitation }) {
    const list = safeArr(galleries);
    const [selectedImage, setSelectedImage] = useState(null);
    const showPhotos = parseBool(invitation?.show_photos) && !invitation?.hide_photos;

    if (!showPhotos || list.length === 0) return null;

    return (
        <section id={id || "gallery"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">CAPSULE LOG</span>
                <h2 className="ast-title">{locale === 'en' ? 'PHOTO ALBUM' : 'ALBUM FOTO'}</h2>
            </div>

            <Reveal className="ast-card">
                <CardOrnaments pattern={3} />
                <div className="ast-gallery-grid">
                    {list.map((item, index) => {
                        const url = getStorageUrl(item.file_path);
                        if (!url) return null;
                        return (
                            <div
                                key={index}
                                className="ast-gallery-item"
                                onClick={() => setSelectedImage(url)}
                            >
                                <img src={url} alt={`Gallery ${index}`} />
                                <div className="ast-gallery-overlay">
                                    <i className="fas fa-search-plus" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Reveal>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="ast-lightbox" onClick={() => setSelectedImage(null)}>
                    <div className="ast-lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <span className="ast-lightbox-close" onClick={() => setSelectedImage(null)}>
                            <i className="fas fa-times" />
                        </span>
                        <img src={selectedImage} alt="Expanded View" />
                    </div>
                </div>
            )}
        </section>
    );
}

/* ═══════════════════════════════════════
   UNIFIED RSVP & TRANSMISSION WISHES
   ═══════════════════════════════════════ */
function WishesRsvpSection({ invitation, guest, wishes, enableRsvp, enableWishes, id, locale }) {
    const { t } = useTranslation();
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';
    const [success, setSuccess] = useState(false);
    const wishesInputRef = useRef(null);

    // Single unified form state
    const form = useForm({
        guest_id: activeGuest.id || '',
        sender_name: guestName || '',
        attendance: 'hadir',
        number_of_guests: 1,
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitWish = () => {
            if (enableWishes && form.data.message.trim()) {
                form.post(route('invitation.wish', invitation.slug), {
                    preserveScroll: true,
                    onSuccess: () => {
                        form.reset('message');
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 5000);
                    }
                });
            } else {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            }
        };

        if (enableRsvp) {
            form.post(route('invitation.rsvp', invitation.slug), {
                preserveScroll: true,
                onSuccess: submitWish
            });
        } else {
            submitWish();
        }
    };

    const isSubmitting = form.processing;
    const wishList = safeArr(wishes);
    const recentWishes = wishList.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? `${t('nav.rsvp')} & ${t('invitation.wishes_title')}`
        : enableRsvp
            ? t('invitation.rsvp_title') || 'RSVP'
            : t('invitation.wishes_title') || 'Ucapan';

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id={id || "rsvp"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">COMMUNICATIONS</span>
                <h2 className="ast-title">{sectionTitle}</h2>
            </div>

            <Reveal className="ast-card">
                <CardOrnaments pattern={1} />
                <form onSubmit={handleSubmit} className="space-y-4">
                    {success && (
                        <div className="p-3 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs text-center font-bold">
                            <i className="fas fa-check-circle" /> {locale === 'en' ? 'TRANSMISSION RECEIVED SUCCESSFULLY!' : 'TRANSMISI BERHASIL DITERIMA!'}
                        </div>
                    )}

                    {/* Guest Name input */}
                    <div className="ast-form-group">
                        <label className="ast-label">{t('invitation.rsvp_name') || 'NAMA TAMU'}</label>
                        <input
                            type="text"
                            value={form.data.sender_name}
                            onChange={e => form.setData('sender_name', e.target.value)}
                            placeholder={locale === 'en' ? 'Enter your name' : 'Masukkan nama Anda'}
                            className={`ast-input ${form.errors.sender_name ? 'ast-input-error' : ''}`}
                            disabled={!!activeGuest.name}
                            required
                        />
                        {form.errors.sender_name && <div className="ast-error-msg">{form.errors.sender_name}</div>}
                    </div>

                    {/* Attendance input */}
                    {enableRsvp && (
                        <>
                            <div className="ast-form-group">
                                <label className="ast-label">{t('invitation.rsvp_attendance') || 'KONFIRMASI KEHADIRAN'}</label>
                                <select
                                    value={form.data.attendance}
                                    onChange={e => form.setData('attendance', e.target.value)}
                                    className="ast-input ast-select"
                                >
                                    <option value="hadir">{locale === 'en' ? 'Attending' : 'Hadir'}</option>
                                    <option value="tidak">{locale === 'en' ? 'Absent' : 'Tidak Hadir'}</option>
                                </select>
                            </div>

                            {form.data.attendance === 'hadir' && (
                                <div className="ast-form-group">
                                    <label className="ast-label">{t('invitation.rsvp_guests') || 'JUMLAH TAMU'}</label>
                                    <select
                                        value={form.data.number_of_guests}
                                        onChange={e => form.setData('number_of_guests', parseInt(e.target.value) || 1)}
                                        className="ast-input ast-select"
                                    >
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n} {locale === 'en' ? 'Person' : 'Orang'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {/* Wishes/Message input */}
                    {enableWishes && (
                        <div className="ast-form-group relative">
                            <label className="ast-label">{t('invitation.wishes_field') || 'DOA & UCAPAN'}</label>
                            <WishesEmojiPicker
                                value={form.data.message}
                                onChange={(newValue) => form.setData('message', newValue)}
                                inputRef={wishesInputRef}
                                isDark={true}
                            >
                                <textarea
                                    ref={wishesInputRef}
                                    value={form.data.message}
                                    onChange={e => form.setData('message', e.target.value)}
                                    placeholder={locale === 'en' ? 'Send birthday transmissions...' : 'Kirim transmisi doa ulang tahun...'}
                                    className={`ast-input ast-textarea ${form.errors.message ? 'ast-input-error' : ''}`}
                                    maxLength={300}
                                    required
                                />
                            </WishesEmojiPicker>
                            {form.errors.message && <div className="ast-error-msg">{form.errors.message}</div>}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="ast-btn w-full mt-4"
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fas fa-spinner animate-spin" /> {locale === 'en' ? 'TRANSMITTING...' : 'MENGIRIM...'}
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane" /> {locale === 'en' ? 'SEND TRANSMISSION' : 'KIRIM TRANSMISI'}
                            </>
                        )}
                    </button>
                </form>

                {/* Wishes List */}
                {enableWishes && recentWishes.length > 0 && (
                    <div className="ast-wishes-list">
                        <h4 className="text-xs font-bold uppercase text-cyan-400 mb-3 tracking-wider">
                            {locale === 'en' ? 'GALACTIC INBOX' : 'KOTAK TRANSMISI UCAPAN'}
                        </h4>
                        <div className="ast-wishes-container">
                            {recentWishes.map((w, idx) => (
                                <div key={idx} className="ast-wish-bubble">
                                    <div className="ast-wish-header">
                                        <span className="ast-wish-name">{w.sender_name}</span>
                                        {w.rsvp?.attendance && (
                                            <span className={`ast-wish-status ${w.rsvp.attendance}`}>
                                                {w.rsvp.attendance === 'hadir' ? (locale === 'en' ? 'ATTENDING' : 'HADIR') : (locale === 'en' ? 'ABSENT' : 'ABSEN')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="ast-wish-text">{w.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   FUEL DEPOT (Digital Gift Box)
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, id, locale, invitation }) {
    const list = safeArr(bankAccounts);
    const { labels } = getThemeLabels(locale, [], invitation);
    const [copiedIdx, setCopiedIdx] = useState(null);

    const fallbackCopy = (text, idx) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: 0 });
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 3000);
        } catch (e) {}
        document.body.removeChild(ta);
    };

    const handleCopy = (accNumber, idx) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(accNumber).then(() => {
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 3000);
            }).catch(() => {
                fallbackCopy(accNumber, idx);
            });
        } else {
            fallbackCopy(accNumber, idx);
        }
    };

    if (list.length === 0) return null;

    return (
        <section id={id || "bank"} className="ast-section">
            <div className="ast-section-title-wrapper">
                <span className="ast-badge">{labels.giftBadge}</span>
                <h2 className="ast-title">{labels.giftHeader}</h2>
            </div>

            <Reveal className="ast-card">
                <CardOrnaments pattern={2} />
                <p className="text-sm text-center text-slate-300 mb-6">
                    {locale === 'en'
                        ? 'Fuel the celebrant with cosmic energy gifts via transfer!'
                        : 'Bantu recharge bahan bakar pesawat komando Fadli melalui kado digital berikut!'}
                </p>

                <div className="space-y-4">
                    {list.map((acc, idx) => {
                        // Format BCA, Mandiri logos or text if not exist
                        const bankName = String(acc.bank_name).toLowerCase();
                        let logoUrl = null;
                        if (bankName.includes('bca')) logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg';
                        else if (bankName.includes('mandiri')) logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg';
                        else if (bankName.includes('bni')) logoUrl = 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg';
                        else if (bankName.includes('bri')) logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_Logo.svg';
                        else if (bankName.includes('dana')) logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA.svg';

                        return (
                            <div key={idx} className="ast-gift-card">
                                <div className="ast-gift-header">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt={acc.bank_name} className="ast-bank-logo" />
                                    ) : (
                                        <span className="font-bold text-cyan-400">{acc.bank_name.toUpperCase()}</span>
                                    )}
                                    <div className="ast-chip" />
                                </div>

                                <div className="ast-gift-number">
                                    {acc.account_number}
                                </div>

                                <div className="ast-gift-holder-row">
                                    <div>
                                        <div className="ast-gift-holder-label">Holder Name</div>
                                        <div className="ast-gift-holder-name">{acc.account_name}</div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(acc.account_number, idx)}
                                        className="ast-btn ast-btn-cyan text-xs py-2 px-4"
                                        style={{ minWidth: '95px' }}
                                    >
                                        {copiedIdx === idx ? (
                                            <>
                                                <i className="fas fa-check" /> COPIED
                                            </>
                                        ) : (
                                            <>
                                                <i className="far fa-copy" /> COPY CODE
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Reveal>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION (Footer)
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, brideGrooms, locale }) {
    const { labels } = getThemeLabels(locale, brideGrooms, invitation);
    const couples = safeArr(brideGrooms);
    const celebrant = couples[0] || {};
    
    const fatherName = celebrant.father_name || '';
    const motherName = celebrant.mother_name || '';

    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'TrueLove Invitation';

    return (
        <section id="closing" className="ast-section">
            <Reveal className="ast-card ast-closing-card">
                <CardOrnaments pattern={3} />
                <h3 className="ast-closing-title">{labels.closingTitle}</h3>
                <p className="ast-closing-text">{labels.closingText}</p>

                {fatherName && motherName && (
                    <div className="ast-closing-family">
                        {locale === 'en' ? 'Family Commander Crew:' : 'Keluarga Besar Pusat Komando:'}
                        <div className="text-orange-400 font-bold mt-1">
                            {locale === 'en' ? `Mr. ${fatherName} & Mrs. ${motherName}` : `Kel. Bapak ${fatherName} & Ibu ${motherName}`}
                        </div>
                    </div>
                )}

                <div className="flex justify-center my-6">
                    <AstronautSVG size={90} />
                </div>

                <p className="ast-watermark">
                    Made with ❤️ by {brandName}
                </p>
            </Reveal>
        </section>
    );
}

/* ==========================================================================
   MAIN COMPONENT: DynamicIndex
   ========================================================================== */
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
    const { t } = useTranslation(activeLanguage);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeSection, setActiveSection] = useState('opening');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoScroll, setAutoScroll] = useState(invitation?.enable_auto_scroll !== false);

    // Visibility controls overrides
    globalShowPhotos = parseBool(invitation?.show_photos, true) && !invitation?.hide_photos;
    globalShowAnimations = parseBool(invitation?.show_animations, true);

    const audioRef = useRef(null);

    // Visibility sync for Audio
    usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);

    // Target background music
    const musicUrl = invitation?.music_url 
        ? getStorageUrl(invitation.music_url) 
        : '/audio/backsound.mp3';

    const handleOpen = () => {
        setIsOpen(true);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.play().catch(() => {});
        }
        // Auto Fullscreen trigger on button click
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Filter visible sections
    const resolvedSections = useMemo(() => {
        const showPhotos = parseBool(invitation?.show_photos, true) && !invitation?.hide_photos;
        
        let list = safeArr(sections)
            .filter(s => parseBool(s.is_visible))
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        // Global Overrides
        if (!showPhotos) {
            list = list.filter(s => s.section_key !== 'gallery');
        }

        // Live stream auto hide if empty
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0] || {};
        const hasStream = primaryEvent.streaming_url || (Array.isArray(primaryEvent.streamings) && primaryEvent.streamings.some(s => s.url));
        if (!hasStream) {
            list = list.filter(s => s.section_key !== 'livestream');
        }

        // Wishes/RSVP duplicate filter
        const rsvpSec = list.find(s => s.section_key === 'rsvp');
        if (rsvpSec && parseBool(rsvpSec.is_visible)) {
            list = list.filter(s => s.section_key !== 'wishes');
        }

        return list;
    }, [sections, invitation, events]);

    // Bottom Navigation Bar tabs based on resolved sections
    const navItems = useMemo(() => {
        const items = [];
        const couples = safeArr(brideGrooms);
        const celebrant = couples[0] || {};
        const celebrantName = celebrant.nickname || (activeLanguage === 'en' ? 'Astronaut' : 'Astronot');
        const milestoneLabel = activeLanguage === 'en' ? 'Milestones' : 'Tumbuh Kembang';
        const giftLabel = activeLanguage === 'en' ? 'Recharge' : 'Kado';

        resolvedSections.forEach(s => {
            const key = s.section_key;
            if (['cover', 'closing', 'countdown'].includes(key)) return;

            let icon = 'fa-star';
            let name = s.section_name || key;

            if (key === 'opening') { icon = 'fa-comment-alt'; name = t('nav.opening') || 'Welcome'; }
            else if (key === 'bride_groom') { icon = 'fa-user-astronaut'; name = celebrantName; }
            else if (key === 'love_story') { icon = 'fa-road'; name = milestoneLabel; }
            else if (key === 'event') { icon = 'fa-calendar-alt'; name = t('nav.acara') || 'Party'; }
            else if (key === 'gallery') { icon = 'fa-images'; name = t('nav.galeri') || 'Gallery'; }
            else if (key === 'rsvp') { icon = 'fa-envelope-open-text'; name = t('nav.rsvp') || 'RSVP'; }
            else if (key === 'bank') { icon = 'fa-gift'; name = giftLabel; }

            items.push({ key, icon, name });
        });
        return items;
    }, [resolvedSections, t, activeLanguage, brideGrooms]);

    // Scrollspy Observer
    useEffect(() => {
        if (!isOpen || !globalShowAnimations) return;

        const obsOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, obsOptions);

        navItems.forEach(item => {
            const el = document.getElementById(item.key);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isOpen, navItems]);

    // Scroll to section helper
    const scrollToSection = (key) => {
        setAutoScroll(false);
        const el = document.getElementById(key);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveSection(key);
        }
    };

    // Auto horizontal scroll bottom nav active button helper (manual scrollLeft)
    useEffect(() => {
        if (!isOpen) return;
        const navEl = document.querySelector('.ast-nav-bar');
        const activeBtn = document.getElementById(`ast-nav-btn-${activeSection}`);
        if (navEl && activeBtn) {
            const btnLeft = activeBtn.offsetLeft;
            const btnWidth = activeBtn.offsetWidth;
            const navWidth = navEl.offsetWidth;
            // Scroll nav container so active button lies in the center
            navEl.scrollLeft = btnLeft - (navWidth / 2) + (btnWidth / 2);
        }
    }, [activeSection, isOpen]);

    // Pixel-by-pixel Auto Scroll helper
    useEffect(() => {
        if (!isOpen || !autoScroll) return;
        
        let scrollTimer = null;
        let lastScrollY = window.scrollY;

        const startPixelScroll = () => {
            scrollTimer = setInterval(() => {
                window.scrollBy(0, 1);
                
                // If scroll fails or reaches bottom, check and stop
                if (window.scrollY === lastScrollY && window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
                    clearInterval(scrollTimer);
                }
                lastScrollY = window.scrollY;
            }, 40); // slow gentle crawl
        };

        startPixelScroll();

        // Pause scroll on user interaction
        const handleUserScroll = () => {
            clearInterval(scrollTimer);
            // restart scroll after 5 seconds idle
            clearTimeout(window.astScrollTimeout);
            window.astScrollTimeout = setTimeout(startPixelScroll, 5000);
        };

        window.addEventListener('wheel', handleUserScroll, { passive: true });
        window.addEventListener('touchmove', handleUserScroll, { passive: true });

        return () => {
            clearInterval(scrollTimer);
            clearTimeout(window.astScrollTimeout);
            window.removeEventListener('wheel', handleUserScroll);
            window.removeEventListener('touchmove', handleUserScroll);
        };
    }, [isOpen, autoScroll]);

    // QR Code Check-in presence state
    const [showQr, setShowQr] = useState(false);
    const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);

    return (
        <ErrorBoundary>
            <Head>
                <title>{invitation?.title || 'Space Odyssey'}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            </Head>
            <div className={`ast-page ${!globalShowAnimations ? 'theme-no-animations' : ''}`}>
                
                {/* Audio backsound element */}
                <audio ref={audioRef} src={musicUrl} loop />

                {/* 1. Cover Screen */}
                <CoverSection 
                    invitation={invitation} 
                    guest={guest} 
                    brideGrooms={brideGrooms}
                    onOpen={handleOpen} 
                    isOpened={isOpen} 
                />

                {isOpen && (
                    <>
                        {/* Static stars background */}
                        <TwinklingStars />

                        {/* Interactive floating cosmic particles */}
                        <CosmicParticles active={isOpen} />

                        {/* 2. Main Page Content */}
                        <div className="ast-main-content">
                            {resolvedSections.map(s => {
                                const key = s.section_key;
                                if (key === 'cover') return null;
                                
                                if (key === 'opening') {
                                    return <OpeningSection key={key} id={key} invitation={invitation} brideGrooms={brideGrooms} events={events} locale={activeLanguage} />;
                                }
                                if (key === 'bride_groom') {
                                    return <BrideGroomSection key={key} id={key} brideGrooms={brideGrooms} locale={activeLanguage} invitation={invitation} />;
                                }
                                if (key === 'love_story') {
                                    return <LoveStorySection key={key} id={key} loveStories={loveStories} locale={activeLanguage} invitation={invitation} />;
                                }
                                if (key === 'event') {
                                    return <EventSection key={key} id={key} events={events} locale={activeLanguage} invitation={invitation} />;
                                }
                                if (key === 'livestream') {
                                    return <LiveStreamingSection key={key} events={events} invitation={invitation} locale={activeLanguage} />;
                                }
                                if (key === 'gallery') {
                                    return <GallerySection key={key} id={key} galleries={galleries} locale={activeLanguage} invitation={invitation} />;
                                }
                                if (key === 'rsvp' || key === 'wishes') {
                                    return (
                                        <WishesRsvpSection 
                                            key={key} 
                                            id={key}
                                            invitation={invitation} 
                                            guest={guest} 
                                            wishes={wishes} 
                                            enableRsvp={parseBool(resolvedSections.some(s => s.section_key === 'rsvp'))}
                                            enableWishes={parseBool(invitation.enable_wishes, true)}
                                            locale={activeLanguage}
                                        />
                                    );
                                }
                                if (key === 'bank') {
                                    return <BankSection key={key} id={key} bankAccounts={bankAccounts} locale={activeLanguage} invitation={invitation} />;
                                }
                                if (key === 'closing') {
                                    return <ClosingSection key={key} invitation={invitation} brideGrooms={brideGrooms} locale={activeLanguage} />;
                                }
                                return null;
                            })}
                        </div>

                        {/* 3. Utility Floating Controls */}
                        <div className="ast-floating-utils">
                            {enableQr && guest && (
                                <button type="button" onClick={() => setShowQr(true)} className="ast-util-btn" title="Show Presence QR">
                                    <i className="fas fa-qrcode" />
                                </button>
                            )}
                            <button type="button" onClick={toggleFullscreen} className="ast-util-btn" title="Toggle Fullscreen">
                                <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`} />
                            </button>
                            <button type="button" onClick={() => setAutoScroll(prev => !prev)} className="ast-util-btn" title="Toggle Auto Scroll" style={{ color: autoScroll ? '#FFE600' : '' }}>
                                <i className="fas fa-magic" />
                            </button>
                            <button type="button" onClick={toggleMusic} className="ast-util-btn" title="Mute/Play Music">
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

                        {/* 4. Fixed Bottom Navigation Bar */}
                        {navItems.length > 0 && (
                            <nav className="ast-nav-bar">
                                {navItems.map(item => (
                                    <button
                                        key={item.key}
                                        id={`ast-nav-btn-${item.key}`}
                                        type="button"
                                        onClick={() => scrollToSection(item.key)}
                                        className={`ast-nav-item ${activeSection === item.key ? 'active' : ''}`}
                                    >
                                        <i className={`fas ${item.icon}`} />
                                        <span className="ast-nav-item-text">{item.name}</span>
                                    </button>
                                ))}
                            </nav>
                        )}

                        {/* 5. QR Code Presence Modal */}
                        {enableQr && showQr && guest && (
                            <div className="ast-qr-overlay" onClick={() => setShowQr(false)}>
                                <div className="ast-qr-modal" onClick={(e) => e.stopPropagation()}>
                                    <h3 className="ast-qr-title">{locale === 'en' ? 'PRESENCE CHECK-IN' : 'PRESENSI CHECK-IN'}</h3>
                                    <p className="ast-qr-text">
                                        {locale === 'en' 
                                            ? 'Please present this QR code to the usher at the venue reception deck.' 
                                            : 'Tunjukkan QR code ini kepada petugas penerima tamu di lokasi acara.'}
                                    </p>
                                    <div className="ast-qr-image-wrapper">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=00F0FF&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + guest.slug)}`} 
                                            alt="Presence QR Code" 
                                        />
                                    </div>
                                    <button type="button" onClick={() => setShowQr(false)} className="ast-btn ast-btn-cyan w-full">
                                        CLOSE WINDOW
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}
