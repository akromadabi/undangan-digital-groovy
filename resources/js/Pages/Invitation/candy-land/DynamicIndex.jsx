import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from '@/i18n';
import { useForm, router } from '@inertiajs/react';
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

// Global configurations for animations
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
            <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl m-6">
                <h2 className="text-lg font-bold text-rose-800">Terjadi kesalahan pada rendering tema Candy Land.</h2>
                <pre className="text-xs text-rose-600 mt-2">{this.state.error?.toString()}</pre>
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
            className={`${className} transition-all duration-700 ${!globalShowAnimations ? '' : (visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95')}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════
   DYNAMIC BALLOON EFFECT
   ═══════════════════════════════════════ */
function BalloonEffect({ active }) {
    const [balloons, setBalloons] = useState([]);
    
    const colors = ['#FF4B72', '#FFC107', '#00D2FC', '#9C27B0', '#FF5722', '#4CAF50'];

    const spawnBalloon = useCallback(() => {
        const id = Math.random().toString(36).substring(2, 9);
        const left = Math.random() * 85 + 5; // between 5% and 90%
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 25 + 30; // size between 30px and 55px
        const duration = Math.random() * 4 + 5; // duration between 5s and 9s
        const delay = Math.random() * 2; // delay up to 2s
        
        setBalloons(prev => [...prev, { id, left, color, size, duration, delay }]);
        
        // Remove after animation finishes
        setTimeout(() => {
            setBalloons(prev => prev.filter(b => b.id !== id));
        }, (duration + delay) * 1000);
    }, []);

    useEffect(() => {
        if (!active) return;
        
        // Initial spawn batch
        for(let i=0; i<6; i++) {
            setTimeout(spawnBalloon, i * 400);
        }

        const interval = setInterval(spawnBalloon, 2200);
        return () => clearInterval(interval);
    }, [active, spawnBalloon]);

    const popBalloon = (id) => {
        setBalloons(prev => prev.filter(b => b.id !== id));
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
            {balloons.map(b => (
                <div
                    key={b.id}
                    className="absolute bottom-0 cursor-pointer pointer-events-auto"
                    onClick={() => popBalloon(b.id)}
                    style={{
                        left: `${b.left}%`,
                        width: `${b.size}px`,
                        height: `${b.size * 1.3}px`,
                        backgroundColor: b.color,
                        borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                        boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.1)',
                        animation: `balloon-float ${b.duration}s linear ${b.delay}s backwards`,
                        cursor: 'pointer',
                        zIndex: 35
                    }}
                >
                    {/* Balloon Knot/String */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-6px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderBottom: `6px solid ${b.color}`,
                        width: 0,
                        height: 0
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1px',
                        height: '20px',
                        backgroundColor: 'rgba(74, 21, 37, 0.25)'
                    }} />
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════════
   THEME LABELS HELPER
   ═══════════════════════════════════════ */
function getThemeLabels(type, locale = 'id', brideGrooms = [], invitation = {}) {
    const t = type || 'birthday';
    const isEn = String(locale).toLowerCase() === 'en';
    const bgs = safeArr(brideGrooms);
    const host = bgs[0] || {};
    
    let mainName = '';
    let initials = '';
    let isSingleHost = true;
    
    if (['wedding', 'anniversary'].includes(t)) {
        const groom = bgs.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || bgs[0] || {};
        const bride = bgs.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || bgs[1] || bgs[0] || {};
        mainName = groom.nickname && bride.nickname ? `${groom.nickname} & ${bride.nickname}` : 'Bride & Groom';
        initials = `${groom.nickname?.charAt(0) || 'B'}${bride.nickname?.charAt(0) || 'R'}`;
        isSingleHost = false;
    } else {
        mainName = host.nickname || host.full_name || 'Host';
        initials = mainName.charAt(0) || 'H';
        isSingleHost = true;
    }

    let labels = {
        coverHeader: isEn ? 'SWEET CELEBRATION' : 'PERAYAAN MANIS',
        coverSubtitle: invitation?.cover_subtitle || (isEn ? "Sweet Party Bash" : "Pesta Ceria"),
        profileHeader: isEn ? 'THE CELEBRANT' : 'YANG MERAYAKAN',
        kidOrderFallback: isEn ? 'SWEET CELEBRATION BOY/GIRL' : 'ANAK TERCINTA',
        storyBadge: isEn ? 'MILESTONES' : 'TUMBUH KEMBANG',
        storyHeader: isEn ? 'SWEET JOURNEY' : 'PERJALANAN USIA',
        eventBadge: isEn ? 'PARTY DETAILS' : 'DETAIL ACARA',
        eventHeader: isEn ? 'JOIN THE SWEETS' : 'LOKASI ISTANA PERMEN',
        giftBadge: isEn ? 'GIFT BOX' : 'KADO DIGITAL',
        giftHeader: isEn ? 'DIGITAL GIFT' : 'KIRIM HADIAH',
        closingTitle: isEn ? 'SWEET ENDINGS!' : 'TERIMA KASIH!',
        closingText: isEn ? "Thank you for sharing this sweet milestone with us!" : "Merupakan kehormatan manis bagi kami apabila kalian berkenan hadir. Terima kasih!"
    };

    if (t === 'wedding') {
        labels.coverHeader = isEn ? 'THE WEDDING OF' : 'PERNIKAHAN DARI';
        labels.profileHeader = isEn ? 'THE COUPLE' : 'KEDUA MEMPELAI';
        labels.storyBadge = isEn ? 'LOVE STORY' : 'KISAH CINTA';
        labels.storyHeader = isEn ? 'OUR LOVE JOURNEY' : 'PERJALANAN CINTA';
        labels.eventBadge = isEn ? 'WEDDING DETAILS' : 'DETAIL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI PERNIKAHAN';
        labels.giftBadge = isEn ? 'DIGITAL ENVELOPE' : 'DOMPET DIGITAL';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'HAPPY ENDINGS!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for sharing this beautiful day with us!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    } else if (t === 'anniversary') {
        labels.coverHeader = isEn ? 'THE ANNIVERSARY OF' : 'ANNIVERSARY DARI';
        labels.profileHeader = isEn ? 'THE COUPLE' : 'PASANGAN BERBAHAGIA';
        labels.storyBadge = isEn ? 'JOURNEY' : 'KISAH PERJALANAN';
        labels.storyHeader = isEn ? 'OUR YEARS OF LOVE' : 'PERJALANAN KASIH';
        labels.eventBadge = isEn ? 'CELEBRATION DETAILS' : 'DETAIL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI ACARA';
        labels.giftBadge = isEn ? 'DIGITAL GIFT' : 'KADO DIGITAL';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'HAPPY ENDINGS!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for sharing this anniversary milestone with us!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    } else if (t === 'graduation') {
        labels.coverHeader = isEn ? 'THE GRADUATION OF' : 'WISUDA DARI';
        labels.profileHeader = isEn ? 'THE GRADUATE' : 'WISUDAWAN/WATI';
        labels.storyBadge = isEn ? 'ACADEMIC PATH' : 'PERJALANAN STUDI';
        labels.storyHeader = isEn ? 'MY STUDY JOURNEY' : 'PERJALANAN STUDI';
        labels.eventBadge = isEn ? 'WISUDA DETAILS' : 'DETAIL ACARA';
        labels.eventHeader = isEn ? 'JOIN OUR CELEBRATION' : 'LOKASI SYUKURAN';
        labels.giftBadge = isEn ? 'GRADUATION GIFT' : 'HADIAH KELULUSAN';
        labels.giftHeader = isEn ? 'SEND GIFT' : 'KIRIM KADO';
        labels.closingTitle = isEn ? 'THANK YOU!' : 'TERIMA KASIH!';
        labels.closingText = isEn ? "Thank you for supporting my academic journey!" : "Merupakan kehormatan bagi kami apabila kalian berkenan hadir. Terima kasih!";
    }

    return {
        mainName,
        initials,
        isSingleHost,
        labels
    };
}

/* ═══════════════════════════════════════
   COVER SECTION
   ═══════════════════════════════════════ */
function CoverSection({ invitation, brideGrooms, guest, isOpened, onOpen, locale }) {
    const { t } = useTranslation();
    const activeGuest = guest || null;
    const guestName = activeGuest?.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : null);
    
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { mainName, initials, isSingleHost, labels } = themeConfig;
    const couples = safeArr(brideGrooms);
    const celebrant = couples[0] || {};
    
    const coverTitle = invitation?.cover_title || mainName;
    const coverSubtitle = invitation?.cover_subtitle || labels.coverSubtitle;

    const coverImages = useMemo(() => {
        return (invitation?.cover_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.cover_image]);

    return (
        <div className={`candy-cover ${isOpened ? 'is-opened' : ''}`}>
            {globalShowPhotos && coverImages.length > 0 && (
                <PremiumSlideshow
                    images={coverImages}
                    positionX={invitation?.cover_position_x}
                    positionY={invitation?.cover_position_y}
                    zoom={invitation?.cover_zoom}
                    className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
                />
            )}
            
            <div className="candy-ambient-candies">
                <span className="candy-deco">🍬</span>
                <span className="candy-deco">🍭</span>
                <span className="candy-deco">🧁</span>
                <span className="candy-deco">🍩</span>
                <span className="candy-deco">🍪</span>
            </div>
            
            <div className="candy-cover-card animate-[candy-float_6s_ease-in-out_infinite]">
                <span className="candy-title-badge">{labels.coverHeader}</span>
                
                <h1 className="candy-cover-title">{coverTitle}</h1>
                <p className="candy-cover-subtitle">{coverSubtitle}</p>
                
                <div className="candy-avatar-frame">
                    {celebrant.photo && globalShowPhotos ? (
                        <img 
                            src={getStorageUrl(celebrant.photo)} 
                            alt={mainName} 
                            style={{
                                objectPosition: `${celebrant.photo_position_x ?? 50}% ${celebrant.photo_position_y ?? 50}%`,
                                transform: `scale(${celebrant.photo_zoom ?? 1.0})`,
                            }}
                        />
                    ) : (
                        <span className="candy-avatar-fallback">
                            {initials}
                        </span>
                    )}
                </div>

                {guestName && (
                    <div className="candy-guest-box">
                        <p className="candy-guest-label">{t('invitation.dear_guest')}</p>
                        <h3 className="candy-guest-name">{guestName}</h3>
                        <p className="text-[11px] opacity-60 mt-1">{t('invitation.dear_guest_desc')}</p>
                    </div>
                )}

                <button 
                    type="button" 
                    onClick={onOpen} 
                    className="candy-btn-open"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V8h14v10zm-2-9H7v2h10V9zm0 4H7v2h10v-2z"/>
                    </svg>
                    BUKA UNDANGAN
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   OPENING SECTION
   ═══════════════════════════════════════ */
function OpeningSection({ invitation, id, locale }) {
    const openingImages = useMemo(() => {
        return (invitation?.opening_image || '')
            .split(',')
            .map(img => getStorageUrl(img.trim()))
            .filter(Boolean);
    }, [invitation?.opening_image]);

    return (
        <section id={id || "opening"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal className="candy-panel text-center">
                    <span className="text-3xl block mb-3">🍭</span>
                    <h2 className="candy-section-title">{invitation?.opening_title || (locale === 'en' ? 'Welcome!' : 'Selamat Datang!')}</h2>
                    
                    {globalShowPhotos && openingImages.length > 0 && (
                        <div className="mx-auto rounded-3xl overflow-hidden my-5 max-w-[280px] h-[210px] shadow-md border-4 border-white relative z-10">
                            <PremiumSlideshow
                                images={openingImages}
                                positionX={invitation?.opening_position_x}
                                positionY={invitation?.opening_position_y}
                                zoom={invitation?.opening_zoom}
                            />
                        </div>
                    )}

                    {invitation?.opening_ayat && (
                        <div className="bg-rose-50/50 border border-rose-100/40 rounded-2xl p-4 my-5 italic text-[14px] leading-relaxed relative">
                            <p className="opacity-95 text-rose-800">
                                &ldquo;{invitation.opening_ayat}&rdquo;
                            </p>
                            {invitation?.opening_ayat_source && (
                                <p className="text-[11px] font-bold text-rose-500 mt-2 text-right">
                                    &mdash; {invitation.opening_ayat_source}
                                </p>
                            )}
                        </div>
                    )}

                    <p className="candy-section-subtitle mb-0 text-[14px]">
                        {invitation?.opening_text || (locale === 'en' 
                            ? "We are very excited to invite you to celebrate with us!"
                            : "Kami sangat gembira mengundang Anda untuk merayakan hari istimewa kami tercinta!")}
                    </p>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CELEBRANT SECTION (Birthday Kid / Couple)
   ═══════════════════════════════════════ */
function BrideGroomSection({ brideGrooms, id, locale, invitation }) {
    const couples = safeArr(brideGrooms);
    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
    
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { isSingleHost, labels } = themeConfig;

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

    // Interactive cake state
    const [candleBlown, setCandleBlown] = useState(false);
    const [cakeConfetti, setCakeConfetti] = useState(false);

    const blowCandle = () => {
        if(candleBlown) return;
        setCandleBlown(true);
        setCakeConfetti(true);
        setTimeout(() => setCakeConfetti(false), 5000); // confetti runs for 5s
    };

    function Card({ person, side }) {
        if (!person) return null;
        const persInitials = (person.nickname || person.full_name || 'R')
            .substring(0, 2)
            .toUpperCase();
        
        return (
            <div className="candy-panel text-center flex-1 max-w-[360px] w-full">
                <div className="candy-avatar-frame my-6 mx-auto">
                    {globalShowPhotos && person.photo ? (
                        <img 
                            src={getStorageUrl(person.photo)} 
                            alt={person.full_name} 
                            className="w-full h-full object-cover" 
                            style={{
                                objectPosition: `${person.photo_position_x ?? 50}% ${person.photo_position_y ?? 50}%`,
                                transform: `scale(${person.photo_zoom ?? 1.0})`,
                            }}
                        />
                    ) : (
                        <div className="candy-avatar-fallback">{persInitials}</div>
                    )}
                </div>
                
                <h2 className="candy-kid-name">{person.full_name}</h2>
                {((person.father_name && person.father_name.trim() !== '' && person.father_name !== '...') || (person.mother_name && person.mother_name.trim() !== '' && person.mother_name !== '...')) && (
                    <p className="candy-kid-order">
                        {translateChildOrder(person.child_order, person.gender) || (locale === 'en' ? labels.kidOrderFallback : 'PUTRA/PUTRI TERCINTA')}
                    </p>
                )}
                
                {person.bio && (
                    <p className="candy-kid-bio">{person.bio}</p>
                )}

                {person.instagram && (
                    <a 
                        href={`https://instagram.com/${person.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="candy-btn-action bg-gradient-to-r from-pink-400 to-rose-400 hover:shadow-lg text-xs"
                        style={{ padding: '8px 18px', display: 'inline-flex', marginBottom: '16px' }}
                    >
                        <i className="fab fa-instagram mr-1.5" /> @{person.instagram.replace('@', '')}
                    </a>
                )}

                {((person.father_name && person.father_name.trim() !== '' && person.father_name !== '...') || (person.mother_name && person.mother_name.trim() !== '' && person.mother_name !== '...')) && (
                    <div className="bg-rose-50/30 border border-rose-100/10 rounded-2xl p-4 mt-2">
                        <p className="text-[11px] font-bold opacity-50 mb-1">{locale === 'en' ? 'BELOVED CHILD OF' : 'PUTRA/PUTRI TERCINTA DARI'}</p>
                        <p className="font-bold text-[14px] text-rose-700">
                            {[person.father_name, person.mother_name].filter(Boolean).join(' & ')}
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <section id={id || "bride_groom"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal className="text-center">
                    <span className="candy-title-badge">{labels.profileHeader}</span>
                    
                    <div className="flex flex-col justify-center items-center gap-6 mt-6">
                        <Card person={groom} side={isSingleHost ? 'center' : 'left'} />
                        {!isSingleHost && <span className="text-3xl text-pink-500 font-bold">&</span>}
                        {!isSingleHost && <Card person={bride} side="right" />}
                    </div>

                    {/* Interactive Blow Candle Widget (only for Single Celebrant / Ulang Tahun / Khitanan / Aqiqah) */}
                    {isSingleHost && (
                        <div className="candy-panel candy-cake-box mt-6 relative overflow-hidden">
                            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-4">
                                {candleBlown ? "🍰 HAPPY BIRTHDAY! 🍰" : "👉 TIUP LILINNYA! (KLIK API)"}
                            </span>
                            
                            <div className="relative inline-block my-2">
                                <div 
                                    className={`candy-flame ${candleBlown ? 'is-blown' : ''}`}
                                    onClick={blowCandle} 
                                />
                                <div className="candy-candle" />
                                <div className="candy-cake-top" />
                                <div className="candy-cake-cream" />
                                <div className="candy-cake-bottom" />
                            </div>
                            
                            {candleBlown && (
                                <p className="text-[12px] italic text-emerald-600 mt-2 font-bold animate-bounce">
                                    Yaaay! Lilin berhasil ditiup! Semoga semua harapan menjadi kenyataan! ✨
                                </p>
                            )}
                            
                            {/* Internal confetti falling shower */}
                            {cakeConfetti && (
                                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-3xl">
                                    {[...Array(20)].map((_, i) => {
                                        const delay = Math.random() * 2000;
                                        const left = Math.random() * 90;
                                        const color = ['#FF4B72', '#00D2FC', '#FFC107', '#9C27B0'][i % 4];
                                        return (
                                            <div 
                                                key={i} 
                                                className="candy-confetti" 
                                                style={{ 
                                                    left: `${left}%`, 
                                                    backgroundColor: color, 
                                                    animationDelay: `${delay}ms`,
                                                    animationDuration: '2.5s'
                                                }} 
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════ */
function CountdownTimer({ targetDate, startTime }) {
    const { t } = useTranslation();
    const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });
    
    useEffect(() => {
        if (!targetDate) return;
        const ds = String(targetDate).substring(0, 10);
        const timeStr = startTime ? String(startTime).substring(0, 5) : '11:00';
        const target = new Date(`${ds}T${timeStr}:00`); // Standard Sweet Party start time
        if (isNaN(target.getTime())) return;
  
        const update = () => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (diff <= 0) {
                setCd({ d: 0, h: 0, m: 0, s: 0 });
                return;
            }
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setCd({ d, h, m, s });
        };
        
        update();
        const intId = setInterval(update, 1000);
        return () => clearInterval(intId);
    }, [targetDate, startTime]);

    return (
        <div className="candy-countdown-grid">
            <div className="candy-countdown-box">
                <span className="candy-countdown-num">{cd.d}</span>
                <span className="candy-countdown-label">{t('invitation.days') || 'HARI'}</span>
            </div>
            <div className="candy-countdown-box">
                <span className="candy-countdown-num">{cd.h}</span>
                <span className="candy-countdown-label">{t('invitation.hours') || 'JAM'}</span>
            </div>
            <div className="candy-countdown-box">
                <span className="candy-countdown-num">{cd.m}</span>
                <span className="candy-countdown-label">{t('invitation.minutes') || 'MENIT'}</span>
            </div>
            <div className="candy-countdown-box">
                <span className="candy-countdown-num">{cd.s}</span>
                <span className="candy-countdown-label">{t('invitation.seconds') || 'DETIK'}</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════
   MILESTONES (Love Story)
   ═══════════════════════════════════════ */
function LoveStorySection({ loveStories, id, locale }) {
    const stories = safeArr(loveStories).sort((a, b) => a.sort_order - b.sort_order);
    if (stories.length === 0) return null;

    return (
        <section id={id || "love_story"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal>
                    <h2 className="candy-section-title">
                        <span className="candy-title-badge">{locale === 'en' ? 'MILESTONES' : 'TUMBUH KEMBANG'}</span>
                        {locale === 'en' ? 'SWEET JOURNEY' : 'PERJALANAN USIA'}
                    </h2>
                </Reveal>

                <div className="candy-timeline mt-6">
                    {stories.map((story, idx) => {
                        return (
                            <div key={story.id || idx} className="candy-timeline-item">
                                <div className="candy-timeline-dot" />
                                
                                <Reveal delay={idx * 100} className="candy-timeline-bubble">
                                    <div className="candy-timeline-date">
                                        {formatStoryDate(story.story_date, locale)}
                                    </div>
                                    <h3 className="candy-timeline-title">{story.title}</h3>
                                    {story.description && (
                                        <p className="candy-timeline-desc">{story.description}</p>
                                    )}
                                </Reveal>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   EVENT / ACARA SECTION (Birthday Party)
   ═══════════════════════════════════════ */
function EventSection({ events, invitation, id, locale }) {
    const { t } = useTranslation();
    const eventList = safeArr(events).sort((a, b) => a.sort_order - b.sort_order);
    if (eventList.length === 0) return null;

    const primaryEvent = eventList.find(e => e.is_primary) || eventList[0];
    
    const showCountdown = parseBool(invitation?.show_countdown);
    const showCountdownInEvent = useMemo(() => {
        if (!primaryEvent?.event_date || !showCountdown) return false;
        return true;
    }, [events, showCountdown]);

    return (
        <section id={id || "event"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal>
                    <h2 className="candy-section-title">
                        <span className="candy-title-badge">{locale === 'en' ? 'PARTY DETAILS' : 'DETAIL ACARA'}</span>
                        {locale === 'en' ? 'JOIN THE SWEETS' : 'LOKASI ISTANA PERMEN'}
                    </h2>
                </Reveal>

                {showCountdownInEvent && (
                    <Reveal className="candy-panel" style={{ padding: '16px 20px', marginBottom: '20px', textAlign: 'center' }}>
                        <span className="text-xs font-bold text-rose-500 uppercase tracking-widest block mb-2">HITUNG MUNDUR ACARA</span>
                        <CountdownTimer targetDate={primaryEvent.event_date} startTime={primaryEvent.start_time} />
                    </Reveal>
                )}

                <div className="space-y-6">
                    {eventList.map((evt, idx) => {
                        return (
                            <Reveal key={evt.id || idx} delay={idx * 150} className="candy-panel candy-event-card">
                                <div className="text-center">
                                    <span className="candy-event-badge">
                                        {evt.event_name ? evt.event_name.toUpperCase() : (locale === 'en' ? 'SWEET CELEBRATION' : 'PERAYAAN MANIS')}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 font-bold text-rose-700 text-sm mb-3">
                                    <svg className="w-5 h-5 fill-current text-rose-500" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1-1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2h-1V1a1 1 0 10-2 0v1H7V1a1 1 0 00-1-1zm3 12a1 1 0 102 0 1 1 0 00-2 0zm3-3a1 1 0 100 2 1 1 0 000-2zm-3 0a1 1 0 100 2 1 1 0 000-2zm-3 0a1 1 0 100 2 1 1 0 000-2zm0 3a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                    </svg>
                                    {formatDate(evt.event_date, locale)}
                                </div>
                                
                                <div className="candy-event-time-grid">
                                    <div>
                                        <span className="candy-event-time-val">{formatTime(evt.start_time)}</span>
                                        <span className="candy-event-time-lbl">{locale === 'en' ? 'START' : 'MULAI'}</span>
                                    </div>
                                    <div>
                                        <span className="candy-event-time-val">
                                            {evt.end_time ? (evt.end_time.toLowerCase().includes('selesai') ? (locale === 'en' ? 'END' : 'SELESAI') : formatTime(evt.end_time)) : (locale === 'en' ? 'END' : 'SELESAI')}
                                        </span>
                                        <span className="candy-event-time-lbl">{locale === 'en' ? 'END' : 'SELESAI'}</span>
                                    </div>
                                    <div>
                                        <span className="candy-event-time-val">{evt.timezone || 'WIB'}</span>
                                        <span className="candy-event-time-lbl">{locale === 'en' ? 'ZONE' : 'ZONA'}</span>
                                    </div>
                                </div>

                                <div className="text-center my-4 font-bold text-[14px]">
                                    <span className="text-xs uppercase text-emerald-600 tracking-wider block mb-1">Gedung / Tempat:</span>
                                    <div className="flex items-center justify-center gap-1.5 text-rose-900">
                                        <svg className="w-4 h-4 fill-current text-rose-500" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {evt.venue_name}
                                    </div>
                                </div>
                                
                                {evt.venue_address && (
                                    <p className="text-xs opacity-75 text-center leading-relaxed max-w-xs mx-auto mb-4">{evt.venue_address}</p>
                                )}

                                {evt.gmaps_link && (
                                    <div className="text-center">
                                        <a 
                                            href={evt.gmaps_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="candy-btn-action"
                                        >
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                            </svg>
                                            BUKA GOOGLE MAPS
                                        </a>
                                    </div>
                                )}
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   LIVE STREAMING SECTION
   ═══════════════════════════════════════ */
function LiveStreamingSection({ events, invitation, id, locale }) {
    const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
    
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

    return (
        <section id={id || "livestream"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal className="candy-panel text-center">
                    <span className="text-3xl block mb-2">🎥</span>
                    <h2 className="candy-section-title">{locale === 'en' ? 'LIVE STREAM' : 'SIARAN LANGSUNG'}</h2>
                    <p className="candy-section-subtitle text-[13px] opacity-80 max-w-xs mx-auto">
                        {locale === 'en' ? 'Celebrate with us virtually from anywhere!' : 'Saksikan kemeriahan pesta secara online dari manapun!'}
                    </p>
                    
                    <div className="flex flex-col gap-3 items-center w-full">
                        {streamsList.map((stream, idx) => (
                            <button 
                                key={idx} 
                                type="button" 
                                onClick={() => window.open(stream.url, '_blank')} 
                                className="candy-btn-action bg-gradient-to-r from-blue-400 to-cyan-400 hover:shadow-lg w-full max-w-[260px] justify-center"
                            >
                                WATCH ON {stream.platform.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   VIDEO GALLERY SECTION
   ═══════════════════════════════════════ */
function VideoGallerySection({ invitation, id, locale }) {
    const hasVideos = invitation?.video_url;
    if (!hasVideos) return null;

    const parseYoutubeId = (url) => {
        if (!url) return '';
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : '';
    };

    const ytId = parseYoutubeId(invitation.video_url);
    const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : invitation.video_url;

    return (
        <section id={id || "video"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal className="candy-panel">
                    <h2 className="candy-section-title">
                        <span className="candy-title-badge">{locale === 'en' ? 'VIDEO PROFILE' : 'VIDEO PERAYAAN'}</span>
                    </h2>
                    
                    <div className="w-full relative aspect-video rounded-3xl overflow-hidden shadow-inner border-4 border-white mt-4">
                        <iframe
                            src={embedUrl}
                            title="Invitation Video Player"
                            className="absolute inset-0 w-full h-full border-none"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   ADVENTURE PHOTO GALLERY SECTION
   ═══════════════════════════════════════ */
function GallerySection({ galleries, id, locale, onSelectImage }) {
    const list = safeArr(galleries).sort((a, b) => a.sort_order - b.sort_order);
    if (list.length === 0) return null;

    return (
        <section id={id || "gallery"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal>
                    <h2 className="candy-section-title">
                        <span className="candy-title-badge">{locale === 'en' ? 'PHOTO ALBUM' : 'GALERI ALAM'}</span>
                        {locale === 'en' ? 'SWEET ALBUM' : 'MOMEN CERIA'}
                    </h2>
                </Reveal>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    {list.map((item, idx) => (
                        <Reveal 
                            key={item.id || idx} 
                            delay={idx * 80} 
                            className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 relative z-10"
                            onClick={() => onSelectImage(item)}
                        >
                            <img 
                                src={getStorageUrl(item.image_url)} 
                                alt={item.caption || `Gallery ${idx}`} 
                                className="w-full h-full object-cover"
                            />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   RSVP & GUESTBOOK FORM SECTION
   ═══════════════════════════════════════ */
function WishesRsvpSection({ invitation, guest, wishes, enableRsvp, enableWishes, id, locale }) {
    const wishesInputRef = useRef(null);
    const { t } = useTranslation();
    const isEn = locale === 'en';
    const activeGuest = guest || { name: '', id: null };
    const guestName = activeGuest.name || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('to') : '') || '';

    const [sharedName, setSharedName] = useState(guestName || '');
    const [attendance, setAttendance] = useState('hadir');
    const [numGuests, setNumGuests] = useState(1);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const rsvpPayload = {
            sender_name: sharedName,
            attendance: attendance,
            number_of_guests: numGuests,
            guest_id: activeGuest.id || null,
        };

        const wishPayload = {
            sender_name: sharedName,
            message: message,
            guest_id: activeGuest.id || null,
        };

        const submitWish = () => {
            if (enableWishes && message.trim()) {
                router.post(route('invitation.wish', invitation.slug), wishPayload, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage('');
                        setSuccess(true);
                        setIsSubmitting(false);
                        setTimeout(() => setSuccess(false), 5000);
                    },
                    onError: () => setIsSubmitting(false)
                });
            } else {
                setSuccess(true);
                setIsSubmitting(false);
                setTimeout(() => setSuccess(false), 5000);
            }
        };

        if (enableRsvp) {
            router.post(route('invitation.rsvp', invitation.slug), rsvpPayload, {
                preserveScroll: true,
                onSuccess: submitWish,
                onError: () => setIsSubmitting(false)
            });
        } else {
            submitWish();
        }
    };

    const wishList = safeArr(wishes);
    const recentWishes = wishList.slice(0, 5);

    const sectionTitle = enableRsvp && enableWishes
        ? (isEn ? 'RSVP & WISHES' : 'KONFIRMASI KEHADIRAN & UCAPAN')
        : enableRsvp
            ? (isEn ? 'RSVP' : 'KONFIRMASI KEHADIRAN')
            : (isEn ? 'WISHES' : 'UCAPAN & DOA');

    if (!enableRsvp && !enableWishes) return null;

    return (
        <section id={id || "rsvp"} className="py-12 px-6">
            <div className="max-w-md mx-auto">
                <Reveal className="candy-panel">
                    <span className="text-3xl block mb-2 text-center">💌</span>
                    <h2 className="candy-section-title">{sectionTitle}</h2>

                    {success ? (
                        <div className="text-center py-6 space-y-3">
                            <div className="text-4xl">🎉</div>
                            <h3 className="font-bold text-rose-700 text-lg">{isEn ? 'Thank you!' : 'Terima Kasih!'}</h3>
                            <p className="text-sm opacity-80">
                                {isEn ? 'Your response has been successfully sent.' : 'Respon dan ucapan Anda telah berhasil terkirim.'}
                            </p>
                            <button 
                                type="button" 
                                onClick={() => setSuccess(false)} 
                                className="candy-btn-action candy-btn-primary py-2 px-6 text-xs mt-4"
                            >
                                {isEn ? 'SUBMIT ANOTHER RESPONSE' : 'KIRIM RESPON BARU'}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase text-rose-500 tracking-wider block">
                                    {isEn ? 'YOUR NAME' : 'NAMA LENGKAP'}
                                </label>
                                <input 
                                    type="text"
                                    value={sharedName}
                                    onChange={e => setSharedName(e.target.value)}
                                    placeholder={isEn ? 'Enter your name' : 'Tulis nama Anda'}
                                    className="candy-input font-bold"
                                    required
                                />
                            </div>

                            {enableRsvp && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase text-rose-500 tracking-wider block">
                                            {isEn ? 'ATTENDANCE' : 'KONFIRMASI KEHADIRAN'}
                                        </label>
                                        <select 
                                            value={attendance}
                                            onChange={e => setAttendance(e.target.value)}
                                            className="candy-input candy-select font-semibold"
                                        >
                                            <option value="hadir">{isEn ? 'Yes, I will attend' : 'Ya, Saya akan Hadir'}</option>
                                            <option value="tidak_hadir">{isEn ? 'No, I cannot attend' : 'Maaf, Saya Tidak Bisa Hadir'}</option>
                                            <option value="belum_pasti">{isEn ? 'Maybe' : 'Belum Pasti / Ragu'}</option>
                                        </select>
                                    </div>

                                    {attendance === 'hadir' && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase text-rose-500 tracking-wider block">
                                                {isEn ? 'NUMBER OF GUESTS' : 'JUMLAH ORANG / PAX'}
                                            </label>
                                            <select 
                                                value={numGuests}
                                                onChange={e => setNumGuests(Number(e.target.value))}
                                                className="candy-input candy-select font-semibold"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                    <option key={n} value={n}>{n} {isEn ? 'Person' : 'Orang'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {enableWishes && (
                                <div className="space-y-1 relative">
                                    <label className="text-xs font-bold uppercase text-rose-500 tracking-wider block">
                                        {isEn ? 'WISHES & PRAYERS' : 'UCAPAN & DOA'}
                                    </label>
                                    <WishesEmojiPicker
                                        value={message}
                                        onChange={setMessage}
                                        inputRef={wishesInputRef}
                                        isDark={false}
                                    >
                                        <textarea 
                                            ref={wishesInputRef}
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            placeholder={isEn ? 'Write your sweet wishes here...' : 'Tulis ucapan termanismu di sini...'}
                                            className="candy-input h-28 font-medium"
                                            required={!enableRsvp}
                                        />
                                    </WishesEmojiPicker>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="candy-btn-action candy-btn-primary w-full justify-center py-3.5 mt-2"
                            >
                                {isSubmitting ? (isEn ? 'TRANSMITTING...' : 'MENGIRIM...') : (isEn ? 'SEND RESPONSE' : 'KIRIM RESPON')}
                            </button>
                        </form>
                    )}

                    {enableWishes && recentWishes.length > 0 && (
                        <div className="mt-8 border-t border-rose-100/50 pt-6 max-h-[280px] overflow-y-auto space-y-4">
                            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-3 text-left">
                                {isEn ? 'RECENT WISHES' : 'UCAPAN TERBARU'}
                            </h4>
                            {recentWishes.map((w, idx) => (
                                <div key={w.id || idx} className="bg-rose-50/20 border border-rose-100/20 rounded-2xl p-4 space-y-1 text-left relative z-10 transition-all hover:bg-rose-50/40">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-[13px] text-rose-900">{w.sender_name}</span>
                                        {w.rsvp?.attendance && (
                                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                                w.rsvp.attendance === 'hadir' 
                                                    ? 'bg-emerald-100 text-emerald-800' 
                                                    : w.rsvp.attendance === 'tidak_hadir'
                                                        ? 'bg-rose-100 text-rose-800'
                                                        : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {w.rsvp.attendance === 'hadir' ? (isEn ? 'Attending' : 'Hadir') : w.rsvp.attendance === 'tidak_hadir' ? (isEn ? 'Absent' : 'Tidak Hadir') : (isEn ? 'Maybe' : 'Ragu')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[12px] opacity-90 leading-relaxed font-semibold">{w.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   DIGITAL GIFT / BANK CARD SECTION
   ═══════════════════════════════════════ */
function BankSection({ bankAccounts, id, locale }) {
    const list = safeArr(bankAccounts).sort((a, b) => a.sort_order - b.sort_order);
    if (list.length === 0) return null;

    const [copiedIdx, setCopiedIdx] = useState(null);
    const [giftOpened, setGiftOpened] = useState(false);

    const copyToClipboard = (accountNum, idx) => {
        navigator.clipboard.writeText(accountNum);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2500);
    };

    return (
        <section id={id || "bank"} className="py-12 px-6">
            <div className="max-w-md mx-auto text-center">
                <Reveal>
                    <h2 className="candy-section-title">
                        <span className="candy-title-badge">{locale === 'en' ? 'GIFT BOX' : 'KADO DIGITAL'}</span>
                        {locale === 'en' ? 'DIGITAL GIFT' : 'KIRIM HADIAH'}
                    </h2>
                </Reveal>

                {/* Interactive gift box */}
                <div 
                    className={`candy-gift-box-wrapper ${giftOpened ? 'is-opened' : ''}`}
                    onClick={() => setGiftOpened(prev => !prev)}
                >
                    <div className="candy-gift-lid" />
                    <div className="candy-gift-box">
                        <div className="candy-gift-ribbon-v" />
                        <div className="candy-gift-ribbon-h" />
                    </div>
                    
                    <div className="candy-gift-surprise">
                        <span className="block text-2xl mb-1.5">🥳 SURPRISE! 🥳</span>
                        Setiap kado termanis yang dikirimkan membawa kebahagiaan luar biasa bagi si kecil! 🎈
                    </div>
                </div>

                <p className="text-xs opacity-75 mt-4 max-w-xs mx-auto mb-6 leading-relaxed">
                    {giftOpened ? "Silakan salin nomor rekening di bawah untuk mengirimkan kado digital manis Anda." : "Klik kado di atas untuk membuka kejutan digital kami!"}
                </p>

                {giftOpened && (
                    <div className="space-y-4">
                        {list.map((acct, idx) => (
                            <Reveal key={acct.id || idx} delay={idx * 100} className="candy-panel text-left">
                                <div className="flex justify-between items-center border-b border-rose-50 pb-2 mb-3">
                                    <span className="font-bold text-[14px] text-rose-800 uppercase tracking-wide">{acct.bank_name}</span>
                                    <button 
                                        onClick={() => copyToClipboard(acct.account_number, idx)}
                                        className="text-[10px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-lg px-2.5 py-1 hover:bg-cyan-100 transition-colors"
                                    >
                                        {copiedIdx === idx ? '✓ TERSALIN' : 'SALIN REKENING'}
                                    </button>
                                </div>
                                <p className="text-xs opacity-50 font-bold uppercase tracking-wider">{locale === 'en' ? 'ACCOUNT NAME' : 'ATAS NAMA'}</p>
                                <p className="font-bold text-[14px] text-rose-950 mt-0.5">{acct.account_name}</p>
                                <p className="font-bold text-[15px] tracking-widest mt-1 text-cyan-700">{acct.account_number}</p>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   CLOSING SECTION
   ═══════════════════════════════════════ */
function ClosingSection({ invitation, id, locale, brideGrooms }) {
    const couples = safeArr(brideGrooms);
    const themeConfig = getThemeLabels(invitation?.type || 'birthday', locale, brideGrooms, invitation);
    const { isSingleHost, labels } = themeConfig;
    const isEn = locale === 'en';
    const brandName = invitation?.user?.reseller_settings?.brand_name 
        || invitation?.user?.reseller?.reseller_settings?.brand_name 
        || 'Undangan Digital Groovy';

    const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
    const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};

    const groomFather = groom.father_name || '';
    const groomMother = groom.mother_name || '';
    const brideFather = bride.father_name || '';
    const brideMother = bride.mother_name || '';

    const hasGroomParents = groomFather || groomMother;
    const hasBrideParents = brideFather || brideMother;

    return (
        <section id={id || "closing"} className="py-16 px-6 text-center">
            <div className="max-w-md mx-auto">
                <Reveal className="candy-panel">
                    <span className="text-4xl block mb-2">🧁</span>
                    <h2 className="candy-section-title">{invitation?.closing_title || labels.closingTitle}</h2>
                    <p className="candy-section-subtitle text-[14px] opacity-85 leading-relaxed mt-4 max-w-xs mx-auto mb-6">
                        {invitation?.closing_text || labels.closingText}
                    </p>

                    {isSingleHost ? (
                        (groomFather || groomMother) && (
                            <div className="bg-rose-50/50 border border-rose-100/40 rounded-2xl p-4 my-5 relative">
                                <p className="text-[11px] font-bold text-rose-400/80 uppercase tracking-widest mb-1">
                                    {isEn ? "WE ARE GRATEFUL," : "KAMI YANG MENGUNDANG,"}
                                </p>
                                <p className="font-bold text-[14px] text-rose-700">
                                    {groomFather && groomMother 
                                        ? (isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`)
                                        : (groomFather ? (isEn ? `Family of Mr. ${groomFather}` : `Kel. Bapak ${groomFather}`) : (isEn ? `Family of Mrs. ${groomMother}` : `Kel. Ibu ${groomMother}`))}
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="bg-rose-50/50 border border-rose-100/40 rounded-2xl p-4 my-5 relative space-y-4">
                            <p className="text-[11px] font-bold text-rose-400/80 uppercase tracking-widest mb-1">
                                {isEn ? "WE ARE GRATEFUL," : "KAMI YANG MENGUNDANG,"}
                            </p>
                            <div className="font-bold text-[14px] text-rose-700 space-y-2">
                                {hasGroomParents && (
                                    <div>
                                        {groomFather && groomMother 
                                            ? (isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`)
                                            : (groomFather ? (isEn ? `Family of Mr. ${groomFather}` : `Kel. Bapak ${groomFather}`) : (isEn ? `Family of Mrs. ${groomMother}` : `Kel. Ibu ${groomMother}`))}
                                    </div>
                                )}
                                {hasBrideParents && (
                                    <div>
                                        {brideFather && brideMother 
                                            ? (isEn ? `Family of Mr. ${brideFather} & Mrs. ${brideMother}` : `Kel. Bapak ${brideFather} & Ibu ${brideMother}`)
                                            : (brideFather ? (isEn ? `Family of Mr. ${brideFather}` : `Kel. Bapak ${brideFather}`) : (isEn ? `Family of Mrs. ${brideMother}` : `Kel. Ibu ${brideMother}`))}
                                    </div>
                                )}
                                {!hasGroomParents && !hasBrideParents && (
                                    <div>
                                        {isEn ? 'Both Families of the Couple' : 'Keluarga Besar Kedua Mempelai'}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 border-t border-rose-100/60 pt-6">
                        <p className="text-xs text-rose-400/80 font-semibold tracking-wide">
                            Made with ❤️ by <span className="text-rose-500 font-bold">{brandName}</span>
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════
   MAIN THEME EXPORT (DynamicIndex)
   ═══════════════════════════════════════ */
export default function DynamicIndex({ 
    invitation, 
    sections = [], 
    brideGrooms = [], 
    events = [], 
    galleries = [], 
    loveStories = [], 
    bankAccounts = [], 
    guest = null, 
    wishes = [], 
    isDemo = false 
}) {
    const { t, locale } = useTranslation(invitation?.language || 'id');
    const [isOpen, setIsOpen] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [activeNav, setActiveNav] = useState('home');
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [lightboxImage, setLightboxImage] = useState(null);

    // Audio backsound ref
    const audioRef = useRef(null);
    usePageVisibilityAudio(audioRef, musicPlaying, setMusicPlaying);

    const layoutMode = invitation?.layout_mode || 'scroll';
    const showAnimations = parseBool(invitation?.show_animations);
    const showPhotos = parseBool(invitation?.show_photos);
    const musicAutoplay = parseBool(invitation?.music_autoplay);

    // Sync global configuration flags
    globalShowPhotos = showPhotos;
    globalShowAnimations = showAnimations;

    const enableRsvp = parseBool(invitation?.enable_rsvp);
    const enableWishes = parseBool(invitation?.enable_wishes);

    const visibleSections = useMemo(() => {
        const validKeys = ['opening', 'bride_groom', 'event', 'countdown', 'love_story', 'gallery', 'bank', 'rsvp', 'wishes', 'closing', 'livestream', 'video_wedding'];
        const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
        const hasStream = primaryEvent?.streaming_url || safeArr(primaryEvent?.streamings).length > 0;

        return sections
            .filter(s => s.is_visible && validKeys.includes(s.section_key))
            .sort((a, b) => a.sort_order - b.sort_order)
            .filter(s => {
                if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return false;
                if (s.section_key === 'gallery' && !(galleries?.length > 0)) return false;
                if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return false;
                if (s.section_key === 'bride_groom' && !(brideGrooms?.length >= 1)) return false;
                if (s.section_key === 'countdown') return false; // integrated in event
                if (s.section_key === 'rsvp' && !enableRsvp) return false;
                if (s.section_key === 'wishes') {
                    if (!enableWishes) return false;
                    if (enableRsvp) return false; // Skip wishes slide (integrated in RSVP)
                }
                if (s.section_key === 'livestream' && !hasStream) return false;
                return true;
            });
    }, [sections, events, loveStories, galleries, bankAccounts, brideGrooms, enableRsvp, enableWishes]);

    const handleOpen = () => {
        setIsOpen(true);
        if (invitation?.music_url && musicAutoplay && audioRef.current) {
            audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {});
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (musicPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setMusicPlaying(!musicPlaying);
    };

    // Slide switching callbacks
    const jumpToSlide = (idx) => {
        setActiveSlideIdx(idx);
        setActiveNav(visibleSections[idx]?.section_key || 'opening');
    };

    const goNext = useCallback(() => {
        setActiveSlideIdx(prev => {
            const nextIdx = Math.min(prev + 1, visibleSections.length - 2); // Exclude cover and final layouts if needed
            setActiveNav(visibleSections[nextIdx]?.section_key || 'opening');
            return nextIdx;
        });
    }, [visibleSections]);

    const goPrev = useCallback(() => {
        setActiveSlideIdx(prev => {
            const nextIdx = Math.max(prev - 1, 0);
            setActiveNav(visibleSections[nextIdx]?.section_key || 'opening');
            return nextIdx;
        });
    }, []);

    // Scroll tracker
    useEffect(() => {
        if (!isOpen || layoutMode !== 'scroll') return;
        const handleScroll = () => {
            const secs = document.querySelectorAll('[data-section]');
            let current = visibleSections[0]?.section_key || 'opening';
            secs.forEach(sec => {
                if (sec.getBoundingClientRect().top <= 240) {
                    current = sec.dataset.section;
                }
            });
            setActiveNav(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen, layoutMode, visibleSections]);

    const colors = invitation?.theme?.color_scheme || { primary: '#FF4B72', secondary: '#FFC107', bg: '#FFF3F6', text: '#4A1525', accent: '#00D2FC' };
    const fonts = invitation?.theme?.font_config || { heading: 'Fredoka', body: 'Quicksand', script: 'Fredoka' };

    const navSections = useMemo(() => {
        return visibleSections.filter(s => {
            if (s.section_key === 'cover') return false;
            if (s.section_key === 'gallery' && !(galleries?.length > 0)) return false;
            if (s.section_key === 'love_story' && !(loveStories?.length > 0)) return false;
            if (s.section_key === 'bank' && !(bankAccounts?.length > 0)) return false;
            if (s.section_key === 'bride_groom' && !(brideGrooms?.length >= 1)) return false;
            if (s.section_key === 'countdown' && !invitation?.save_the_date_enabled) return false;
            if (s.section_key === 'rsvp' && !invitation?.enable_rsvp) return false;
            if (s.section_key === 'wishes' && !invitation?.enable_wishes) return false;
            return true;
        });
    }, [visibleSections, galleries, loveStories, bankAccounts, brideGrooms, invitation]);

    const navIcons = {
        opening: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
            </svg>
        ),
        bride_groom: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        event: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        ),
        countdown: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        love_story: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        gallery: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159M15 10.5l1.409-1.409a2.25 2.25 0 013.182 0L21.75 11.25M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
            </svg>
        ),
        rsvp: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
        ),
        bank: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        ),
        closing: (
            <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
        )
    };

    return (
        <ErrorBoundary>
            {invitation?.music_url && <audio ref={audioRef} src={invitation.music_url} loop />}
            
            <div className="candy-theme-wrapper pb-16">
                
                {/* Floating Balloon Effects */}
                <BalloonEffect active={isOpen} />

                {/* Cover Section */}
                <CoverSection 
                    invitation={invitation}
                    brideGrooms={brideGrooms}
                    guest={guest}
                    isOpened={isOpen}
                    onOpen={handleOpen}
                    locale={locale}
                />

                {/* Core Invitation Content */}
                {isOpen && (
                    <div className="w-full relative z-10 transition-opacity duration-1000">
                        
                        {/* Left Float Audio Control Panel */}
                        <div className="candy-player-bar">
                            <button 
                                onClick={toggleMusic}
                                className="candy-player-btn"
                                type="button"
                            >
                                {musicPlaying ? (
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM11 7a1 1 0 00-2 0v6a1 1 0 102 0V7zm-4 3a1 1 0 00-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Theme Section Map */}
                        {visibleSections.filter(s => s.section_key !== 'cover').map((section, idx) => {
                            const isHidden = layoutMode !== 'scroll' && idx !== activeSlideIdx;
                            return (
                                <div 
                                    key={section.id}
                                    data-section={section.section_key}
                                    style={isHidden ? { display: 'none' } : {}}
                                >
                                    {section.section_key === 'opening' && (
                                        <OpeningSection invitation={invitation} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'bride_groom' && (
                                        <BrideGroomSection brideGrooms={brideGrooms} id={section.section_key} locale={locale} invitation={invitation} />
                                    )}
                                    {section.section_key === 'love_story' && (
                                        <LoveStorySection loveStories={loveStories} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'event' && (
                                        <EventSection events={events} invitation={invitation} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'livestream' && (
                                        <LiveStreamingSection events={events} invitation={invitation} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'video_wedding' && (
                                        <VideoGallerySection invitation={invitation} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'gallery' && (
                                        <GallerySection galleries={galleries} id={section.section_key} locale={locale} onSelectImage={setLightboxImage} />
                                    )}
                                    {(section.section_key === 'rsvp' || section.section_key === 'wishes') && (
                                        <WishesRsvpSection 
                                            invitation={invitation} 
                                            guest={guest} 
                                            wishes={wishes}
                                            enableRsvp={invitation?.enable_rsvp}
                                            enableWishes={invitation?.enable_wishes}
                                            id={section.section_key} 
                                            locale={locale} 
                                        />
                                    )}
                                    {section.section_key === 'bank' && (
                                        <BankSection bankAccounts={bankAccounts} id={section.section_key} locale={locale} />
                                    )}
                                    {section.section_key === 'closing' && (
                                        <ClosingSection invitation={invitation} id={section.section_key} locale={locale} brideGrooms={brideGrooms} />
                                    )}
                                </div>
                            );
                        })}

                        {/* Unified Slide Layout Buttons */}
                        {layoutMode === 'slide' && (
                            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-between w-64 bg-white/95 border border-pink-100 px-4 py-2 rounded-full shadow-lg z-40 backdrop-blur-md">
                                <button 
                                    onClick={goPrev}
                                    disabled={activeSlideIdx === 0}
                                    className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="font-bold text-xs text-rose-900 tracking-wider">
                                    HLM {activeSlideIdx + 1} / {visibleSections.length - 1}
                                </span>
                                <button 
                                    onClick={goNext}
                                    disabled={activeSlideIdx >= visibleSections.length - 2}
                                    className="p-1.5 rounded-full hover:bg-rose-50 text-rose-500 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                >
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Bottom Navigation for scroll or slide modes */}
                        {navSections.length > 0 && (
                            <div className="candy-bottom-nav">
                                {navSections.map((sec, sIdx) => {
                                    const isActive = activeNav === sec.section_key;
                                    const icon = navIcons[sec.section_key] || (
                                        <svg className="candy-nav-icon fill-none stroke-current" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="9" />
                                        </svg>
                                    );
                                    
                                    const handleNavClick = () => {
                                        if (layoutMode === 'scroll') {
                                            const el = document.getElementById(`section-${sec.section_key}`);
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        } else {
                                            // Find index in visibleSections
                                            const targetIdx = visibleSections.findIndex(v => v.section_key === sec.section_key);
                                            if (targetIdx >= 0) jumpToSlide(targetIdx);
                                        }
                                    };

                                    return (
                                        <div 
                                            key={sec.id}
                                            onClick={handleNavClick}
                                            className={`candy-nav-item ${isActive ? 'active' : ''}`}
                                        >
                                            {icon}
                                            <span className="candy-nav-label">
                                                {sec.section_name ? sec.section_name.substring(0, 5) : sec.section_key.substring(0, 5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>
                )}

                {/* Lightbox Modal */}
                {lightboxImage && (
                    <div 
                        className="candy-lightbox"
                        onClick={() => setLightboxImage(null)}
                    >
                        <img 
                            src={getStorageUrl(lightboxImage.image_url)} 
                            alt={lightboxImage.caption} 
                            className="candy-lightbox-img"
                        />
                        {lightboxImage.caption && (
                            <p className="candy-lightbox-caption">{lightboxImage.caption}</p>
                        )}
                        <button 
                            onClick={() => setLightboxImage(null)}
                            className="mt-6 px-8 py-2.5 rounded-full bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors border-2 border-white shadow-lg text-xs"
                        >
                            Tutup
                        </button>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    );
}
