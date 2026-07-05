import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';
import ThemePreviewCard from '@/Components/ThemePreviewCard';
import GreetingCardPreviewCard from '@/Components/GreetingCardPreviewCard';
import PromoTextRenderer from '@/Components/PromoTextRenderer';

/* ─────────────────────────────────────────────────────────
   TINY SVG HELPERS
───────────────────────────────────────────────────────── */
const Svg = ({ d, size = 20, color = 'currentColor', fill = 'none', viewBox = '0 0 24 24' }) => (
    <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={color} strokeWidth={1.8}
        strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d={d} />
    </svg>
);

const StarIcon = () => (
    <svg width={16} height={16} viewBox="0 0 20 20" fill="#f59e0b">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

/* ─────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────── */
const ROTATING_WORDS = ['Pernikahan', 'Tunangan', 'Walimahan', 'Aqiqah', 'Ulang Tahun', 'Khitanan'];

const FEATURES = [
    {
        icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
        title: 'Desain Premium', desc: '20+ tema elegan pilihan — dari klasik, modern, minimalis hingga adat. Bebas pilih dan ganti kapan saja.'
    },
    {
        icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
        title: 'Mobile Friendly', desc: 'Tampilan sempurna di semua perangkat — smartphone, tablet, dan desktop. 100% responsif.'
    },
    {
        icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z',
        title: 'QR Code & RSVP', desc: 'Tamu konfirmasi kehadiran langsung dari undangan. Check-in via QR Code di hari H.'
    },
    {
        icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
        title: 'Kirim via WhatsApp', desc: 'Bagikan tautan undangan langsung ke WhatsApp tamu dengan satu klik. Mudah dan cepat.'
    },
    {
        icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z',
        title: 'Amplop Digital', desc: 'Terima transfer hadiah digital dari tamu langsung via undangan. Daftar rekening & e-wallet.'
    },
    {
        icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
        title: 'Tamu Unlimited', desc: 'Tidak ada batasan jumlah tamu yang bisa diundang. Cocok untuk acara kecil hingga ribuan tamu.'
    },
    {
        icon: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z',
        title: 'Galeri Foto', desc: 'Tampilkan momen-momen terbaik dengan galeri foto yang indah di dalam undangan digital.'
    },
    {
        icon: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
        title: 'Peta Lokasi', desc: 'Integrasi Google Maps langsung di undangan. Tamu bisa langsung navigasi ke lokasi acara.'
    },
    {
        icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        title: 'Mudah Dikustomisasi', desc: 'Isi data sendiri: nama, tanggal, venue, foto. Semua bisa disesuaikan tanpa keahlian teknis.'
    },
];

const STEPS = [
    { num: '01', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z', title: 'Daftar Gratis', desc: 'Buat akun dalam 30 detik. Tidak perlu kartu kredit.' },
    { num: '02', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', title: 'Pilih & Isi Tema', desc: 'Pilih tema favorit, isi data mempelai, unggah foto, dan sesuaikan warna.' },
    { num: '03', icon: 'M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z', title: 'Bagikan ke Tamu', desc: 'Kirim tautan undangan via WhatsApp, Instagram, atau media sosial lainnya.' },
];

const TESTIMONIALS = [
    { name: 'Sari & Budi', city: 'Jakarta', text: 'Undangannya cantik banget! Banyak tamu yang tanya beli di mana. Sangat rekomendasikan!', stars: 5 },
    { name: 'Ayu & Fajar', city: 'Surabaya', text: 'Fitur RSVP dan QR Code sangat membantu kami mendata tamu yang hadir. Top banget!', stars: 5 },
    { name: 'Rina & Deni', city: 'Bandung', text: 'Harga terjangkau tapi kualitas premium. Proses pembuatan mudah, tidak butuh keahlian IT.', stars: 5 },
];

const planMeta = {
    free:     { color: '#6b7280', glow: 'rgba(107,114,128,0.2)', label: 'Coba Gratis' },
    silver:   { color: '#64748b', glow: 'rgba(100,116,139,0.2)', label: 'Mulai Sekarang' },
    gold:     { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', label: 'Mulai Sekarang', popular: true },
    platinum: { color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)', label: 'Mulai Sekarang' },
};

const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function Galaxy({ reseller, plans = [], themes = [], greetingCards = [], greetingCardTypeOptions = {}, features = [], sections = [], heroImage = null }) {
    const [previewConfig, setPreviewConfig] = useState(null);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleMessage = (e) => {
            if (!e.data) return;
            if (e.data.type === 'landing_page_preview') {
                setPreviewConfig(prev => {
                    const oldStyle = prev?.loading_style || reseller.loading_style || 'pulse';
                    const newStyle = e.data.config.loading_style || 'pulse';
                    if (newStyle !== oldStyle) {
                        setIsLoaded(false);
                        setTimeout(() => {
                            setIsLoaded(true);
                        }, 1800);
                    }
                    return e.data.config;
                });
            } else if (e.data.type === 'replay_preloader') {
                if (e.data.loading_style) {
                    setPreviewConfig(prev => ({ ...prev, loading_style: e.data.loading_style }));
                }
                setIsLoaded(false);
                setTimeout(() => {
                    setIsLoaded(true);
                }, 1800);
            } else if (e.data.type === 'scroll_to_section') {
                const sectionKey = e.data.sectionKey;
                if (sectionKey === 'banner') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }
                const el = document.getElementById(`section-${sectionKey}`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.style.transition = 'outline 0.3s ease, box-shadow 0.3s ease';
                    el.style.outline = '4px solid #E5654B';
                    el.style.outlineOffset = '-4px';
                    setTimeout(() => {
                        el.style.outline = 'none';
                    }, 1200);
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [reseller.loading_style]);

    const activeSections = previewConfig?.sections || sections || [];
    const activeHeroImage = previewConfig?.heroImage !== undefined ? previewConfig.heroImage : (heroImage || null);

    // Hardcoded Galaxy Dark Theme Colors
    const T = {
        heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        accent: '#f59e0b',
        accentDark: '#d97706',
        accentRgb: '245,158,11',
        navBg: 'rgba(15,23,42,0.85)',
        sectionAlt: '#0f172a',
        sectionBase: '#111827',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        footerBg: '#080d18',
        tagBg: 'rgba(245,158,11,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    };

    const cssVars = `
        :root {
            --accent: ${T.accent};
            --accent-dark: ${T.accentDark};
            --accent-rgb: ${T.accentRgb};
            --hero-bg: ${T.heroBg};
            --nav-bg: ${T.navBg};
            --section-alt: ${T.sectionAlt};
            --section-base: ${T.sectionBase};
            --card-bg: ${T.cardBg};
            --card-border: ${T.cardBorder};
            --text-primary: ${T.textPrimary};
            --text-secondary: ${T.textSecondary};
            --text-muted: ${T.textMuted};
            --footer-bg: ${T.footerBg};
            --tag-bg: ${T.tagBg};
            --tag-color: ${T.tagColor};
        }
    `;

    const [scrolled, setScrolled] = useState(false);
    const [wordIdx, setWordIdx] = useState(0);
    const [wordVisible, setWordVisible] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);
    const [likes, setLikes] = useState({});
    const [likedThemes, setLikedThemes] = useState({});
    const [showContactModal, setShowContactModal] = useState(false);
    const [sortThemeKey, setSortThemeKey] = useState('terbaru');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    // Cards filtering states
    const [cardSortKey, setCardSortKey] = useState('terbaru');
    const [cardSelectedTypes, setCardSelectedTypes] = useState([]);
    const [cardSearchQuery, setCardSearchQuery] = useState('');
    const [isCardTypeDropdownOpen, setIsCardTypeDropdownOpen] = useState(false);
    const [isCardSortDropdownOpen, setIsCardSortDropdownOpen] = useState(false);

    const categoryDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const cardTypeDropdownRef = useRef(null);
    const cardSortDropdownRef = useRef(null);
    const featuresScrollRef = useRef(null);
    const scrollFeatures = (direction) => {
        if (featuresScrollRef.current) {
            const container = featuresScrollRef.current;
            const scrollAmount = container.clientWidth;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const categories = useMemo(() => {
        const cats = themes?.map(t => t.category ? t.category.trim().toLowerCase() : '').filter(Boolean) || [];
        return [...new Set(cats)];
    }, [themes]);

    const eventTypesWithCount = useMemo(() => {
        const list = [
            { key: 'wedding', label: 'Pernikahan' },
            { key: 'birthday', label: 'Ulang Tahun' },
            { key: 'graduation', label: 'Wisuda' },
            { key: 'aqiqah', label: 'Aqiqah' },
            { key: 'circumcision', label: 'Khitanan' },
            { key: 'anniversary', label: 'Anniversary' },
            { key: 'general', label: 'Umum / Semua Acara' }
        ];
        return list.map(opt => {
            const count = themes?.filter(t => {
                const types = Array.isArray(t.type) ? t.type : [];
                return types.includes(opt.key) || (opt.key !== 'general' && types.includes('general'));
            }).length || 0;
            return { ...opt, count };
        });
    }, [themes]);

    const cardTypesWithCount = useMemo(() => {
        return Object.entries(greetingCardTypeOptions || {}).map(([key, label]) => {
            const count = greetingCards?.filter(t => (t.type || []).includes(key)).length || 0;
            return { key, label, count };
        }).sort((a, b) => a.label.localeCompare(b.label));
    }, [greetingCards, greetingCardTypeOptions]);

    const toggleType = (typeKey) => {
        setSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearTypes = () => setSelectedTypes([]);

    const toggleCardType = (typeKey) => {
        setCardSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearCardTypes = () => setCardSelectedTypes([]);

    const filteredThemes = useMemo(() => {
        let list = [...(themes || [])];
        if (selectedCategories.length > 0) {
            list = list.filter(t => t.category && selectedCategories.includes(t.category.trim().toLowerCase()));
        }
        if (selectedTypes.length > 0) {
            list = list.filter(t => {
                const types = Array.isArray(t.type) ? t.type : [];
                return types.some(type => selectedTypes.includes(type)) || types.includes('general');
            });
        }
        if (searchQuery.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return list;
    }, [themes, selectedCategories, selectedTypes, searchQuery]);

    const filteredCards = useMemo(() => {
        let list = [...(greetingCards || [])];
        if (cardSelectedTypes.length > 0) {
            list = list.filter(t => (t.type || []).some(type => cardSelectedTypes.includes(type)));
        }
        if (cardSearchQuery.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(cardSearchQuery.toLowerCase()));
        }
        return list;
    }, [greetingCards, cardSelectedTypes, cardSearchQuery]);

    const sortedCards = useMemo(() => {
        const arr = [...filteredCards];
        if (cardSortKey === 'terbaru') return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
        if (cardSortKey === 'populer') return arr.sort((a, b) => (b.base_likes || 0) - (a.base_likes || 0));
        if (cardSortKey === 'disukai') return arr.sort((a, b) => (b.base_likes || 0) - (a.base_likes || 0));
        return arr;
    }, [filteredCards, cardSortKey]);

    const handleUseCard = (slug) => {
        window.location.href = `/buat-kartu/${slug}`;
    };

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => setSelectedCategories([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setIsCategoryDropdownOpen(false);
            }
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
                setIsTypeDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
            if (cardTypeDropdownRef.current && !cardTypeDropdownRef.current.contains(event.target)) {
                setIsCardTypeDropdownOpen(false);
            }
            if (cardSortDropdownRef.current && !cardSortDropdownRef.current.contains(event.target)) {
                setIsCardSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIdx(prev => (prev + 1) % ROTATING_WORDS.length);
                setWordVisible(true);
            }, 300);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const hasContact = !!(
        reseller.footer_whatsapp ||
        reseller.footer_phone ||
        reseller.footer_email ||
        reseller.footer_instagram ||
        reseller.footer_tiktok ||
        reseller.footer_address ||
        (reseller.social_links && reseller.social_links.length > 0)
    );

    const getWhatsappLink = (number, text = 'Halo, saya ingin bertanya tentang undangan digital.') => {
        if (!number) return '#';
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        } else if (cleaned.startsWith('8')) {
            cleaned = '62' + cleaned;
        }
        return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
    };

    const handleContactClick = () => {
        const contacts = [];
        if (reseller.footer_whatsapp) contacts.push({ type: 'wa', val: reseller.footer_whatsapp });
        if (reseller.footer_phone) contacts.push({ type: 'phone', val: reseller.footer_phone });
        if (reseller.footer_email) contacts.push({ type: 'email', val: reseller.footer_email });

        const hasSocialLinks = reseller.social_links && reseller.social_links.length > 0;

        if (contacts.length === 1 && !hasSocialLinks) {
            const c = contacts[0];
            if (c.type === 'wa') {
                window.open(getWhatsappLink(c.val), '_blank', 'noopener,noreferrer');
                return;
            } else if (c.type === 'phone') {
                window.location.href = `tel:${c.val}`;
                return;
            } else if (c.type === 'email') {
                window.location.href = `mailto:${c.val}`;
                return;
            }
        }
        setShowContactModal(true);
    };

    const loginUrl = `${reseller.reseller_url}/login`;
    const registerUrl = `${reseller.reseller_url}/register`;
    const getThemesUrl = () => `${reseller.reseller_url}/katalog-tema`;
    const getCardsUrl = () => `${reseller.reseller_url}/katalog-kartu`;
    const getFaqUrl = () => `${reseller.reseller_url}/faq`;

    const renderBanner = (c) => {
        const text = c?.text || '🔥 Promo Spesial: Aktifkan paket premium hari ini & dapatkan diskon langsung hingga 50%!';
        const ctaText = c?.cta_text || 'Daftar Sekarang';
        const ctaLink = c?.cta_link || '#plans';
        const bgColor = c?.bg_color || 'linear-gradient(90deg, #E5654B 0%, #D55A42 100%)';
        const textColor = c?.text_color || '#ffffff';

        return (
            <div className="rl-banner" style={{ background: bgColor, color: textColor }}>
                <PromoTextRenderer
                    text={text}
                    showCountdown={c?.show_countdown !== false}
                    durationHours={c?.countdown_duration || 19}
                    resellerRef={reseller.ref}
                />
                {ctaText && (
                    <a href={ctaLink} className="rl-banner__cta" style={{ color: bgColor.includes('#') ? bgColor : '#E5654B' }}>
                        {ctaText}
                    </a>
                )}
                <button onClick={() => setBannerDismissed(true)} className="rl-banner__close" title="Tutup">
                    &times;
                </button>
            </div>
        );
    };

    const renderHero = (c) => {
        const badgeText = c?.badge_text || 'Platform Undangan Digital Terpercaya';
        const title = c?.title || 'Undangan Digital';
        const subtitle = c?.subtitle || 'Premium';
        const description = c?.description || 'Buat undangan pernikahan digital yang elegan dan berkesan dalam hitungan menit.';
        const ctaPrimary = c?.cta_primary_text || 'Buat Undangan Gratis';
        const ctaSecondary = c?.cta_secondary_text || 'Lihat Contoh Tema';

        return (
            <section className="rl-hero" style={activeHeroImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${activeHeroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <div className="rl-hero__orb rl-hero__orb--1" />
                <div className="rl-hero__orb rl-hero__orb--2" />
                <div className="rl-hero__orb rl-hero__orb--3" />
                <div className="rl-hero__grid" />

                <div className="rl-hero__content">
                    <div className="rl-hero__badge">
                        <span className="rl-hero__badge-dot" />
                        {badgeText}
                    </div>

                    <h1 className="rl-hero__heading">
                        {title}
                        <span className="rl-hero__heading-sub">
                            <span className="rl-hero__rotating-word" style={{ opacity: wordVisible ? 1 : 0 }}>
                                {ROTATING_WORDS[wordIdx]}
                            </span>
                            <span className="rl-hero__heading-premium"> {subtitle}</span>
                        </span>
                    </h1>

                    <p className="rl-hero__desc">{description}</p>

                    <div className="rl-hero__cta-group">
                        <a href={registerUrl} className="rl-cta-btn rl-cta-btn--primary">
                            <Svg d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" size={18} color="currentColor" />
                            {ctaPrimary}
                        </a>
                        <a href="#preview" className="rl-cta-btn rl-cta-btn--outline">
                            <Svg d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={18} color="currentColor" />
                            {ctaSecondary}
                        </a>
                    </div>

                    <div className="rl-hero__perks">
                        {['Gratis selamanya', 'Tanpa watermark', 'Langsung aktif'].map((p, i) => (
                            <div key={i} className="rl-hero__perk">
                                <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} color="#4ade80" />
                                {p}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rl-hero__mockup">
                    <div className="rl-phone">
                        <div className="rl-phone__screen">
                            <div className="rl-phone__notch" />
                            <div className="rl-phone__content">
                                <div className="rl-phone__card">
                                    <div className="rl-phone__card-img" />
                                    <div className="rl-phone__card-lines">
                                        <div className="rl-phone__card-line rl-phone__card-line--title" />
                                        <div className="rl-phone__card-line rl-phone__card-line--sub" />
                                        <div className="rl-phone__card-line rl-phone__card-line--date" />
                                    </div>
                                    <div className="rl-phone__card-btn" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rl-phone__badge rl-phone__badge--1">
                        <span style={{ fontSize: 18 }}>✨</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Siap dalam 5 menit</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Langsung aktif</div>
                        </div>
                    </div>
                    <div className="rl-phone__badge rl-phone__badge--2">
                        <span style={{ fontSize: 18 }}>🎊</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>1.200+ Pasangan</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Sudah menggunakan</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderStats = (c) => {
        const items = c?.items || [
            { val: `${themes.length || 20}+`, label: 'Tema Tersedia', icon: '🎨' },
            { val: '1.200+', label: 'Undangan Dibuat', icon: '💌' },
            { val: '5 Menit', label: 'Waktu Pembuatan', icon: '⚡' },
            { val: '24/7', label: 'Selalu Online', icon: '🌐' },
            { val: '100%', label: 'Mobile Friendly', icon: '📱' },
        ];
        return (
            <section className="rl-stats">
                <div className="rl-stats__inner">
                    {items.map((s, i) => (
                        <div key={i} className="rl-stats__item">
                            <span className="rl-stats__icon">{s.icon}</span>
                            <div className="rl-stats__val">{s.val}</div>
                            <div className="rl-stats__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const renderHowItWorks = (c) => {
        const title = c?.title || 'Mudah & Cepat dalam 3 Langkah';
        return (
            <section className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Cara Kerja</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Tidak perlu keahlian desain atau teknis. Siapapun bisa membuat undangan cantik dalam hitungan menit.</p>
                    </div>
                    <div className="rl-steps">
                        {STEPS.map((step, i) => (
                            <div key={i} className="rl-step">
                                <div className="rl-step__num">{step.num}</div>
                                <div className="rl-step__icon-wrap">
                                    <Svg d={step.icon} size={28} color="var(--accent)" />
                                </div>
                                <h3 className="rl-step__title">{step.title}</h3>
                                <p className="rl-step__desc">{step.desc}</p>
                                {i < STEPS.length - 1 && <div className="rl-step__arrow">→</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const renderFeatures = (c) => {
        const title = c?.title || 'Semua yang Anda Butuhkan Ada di Sini';

        const DEFAULT_DESCRIPTIONS = {
            opening: 'Halaman pembuka/sampul luar dengan nama tamu dan tombol buka.',
            bride_groom: 'Informasi profil lengkap kedua mempelai beserta foto.',
            event: 'Detail informasi acara akad nikah, resepsi, peta, dan navigasi.',
            gallery: 'Galeri foto momen bahagia yang diunggah secara aesthetic.',
            love_story: 'Timeline perjalanan kisah cinta romantis kedua mempelai.',
            bank: 'Informasi rekening bank atau e-wallet untuk kado digital.',
            closing: 'Halaman penutup undangan berisi doa restu dan ucapan terima kasih.',
            guestbook: 'Buku tamu digital bagi tamu untuk menulis doa & ucapan selamat.',
            save_the_date: 'Fitur pengingat tanggal otomatis terintegrasi ke Google Calendar.',
            turut_mengundang: 'Daftar nama keluarga besar atau kerabat yang turut mengundang.',
            bride_groom_detail: 'Detail silsilah keluarga, nama orang tua, dan asal mempelai.',
            dresscode: 'Panduan dresscode/aturan busana bagi tamu undangan.',
            video_wedding: 'Fitur sematan video momen bahagia langsung di undangan.',
            cover: 'Desain cover undangan modern dengan berbagai pilihan transisi.',
            guest: 'Kelola daftar tamu undangan tak terbatas dengan tautan unik.',
            rsvp: 'Konfirmasi kehadiran tamu secara real-time via undangan.',
            music: 'Pilihan musik latar/backsound romantis yang otomatis berputar.',
            gift: 'Fitur amplop digital dan pengiriman kado fisik dari tamu.',
            whatsapp: 'Kirim undangan otomatis massal langsung ke WhatsApp tamu.',
            template: 'Bebas ganti pilihan tema dan varian warna kapan saja.',
            instagram_filter: 'Akses filter Instagram khusus tema pernikahan Anda.',
            animasi: 'Akses ke pengaturan efek partikel melayang indah.',
            qr_code: 'Check-in tamu di lokasi acara dengan sistem scan QR Code.',
            layar_sapa: 'Layar sambutan hangat sebelum tamu membuka undangan.',
            album_video: 'Akses ke fitur tempel link video YouTube/Google Drive di galeri.',
        };

        const FEATURE_ICONS = {
            theme: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
            envelope: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
            lightning: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
            globe: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.905 0-5.62-.53-8.113-1.492m16.226 0A8.969 8.969 0 0121 12c0 .902-.13 1.774-.374 2.597m-17.252 0A8.969 8.969 0 013 12c0-.902.13-1.774.374-2.597m16.256 5.194A11.953 11.953 0 0112 13.5c-2.905 0-5.62.53-8.113 1.492',
            mobile: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
            sparkles: 'M9.813 15.904L9 21l-.813-5.096L3.096 15 8 14.187 9 9l.813 5.187L15 15l-5.187.904zM19.006 5.006L18.5 8l-.506-2.994L15 4.5l2.994-.506L18.5 1l.506 2.994L22 4.5l-2.994.506z',
            heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
            calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-2.25h.008v.008H16.5V15zm0 2.25h.008v.008H16.5v-.008z',
            star: 'M11.48 3.499c.307-.93 1.625-.93 1.932 0l1.533 4.636a1 1 0 00.95.69h4.87c.98 0 1.387 1.253.593 1.838l-3.94 2.87a1 1 0 00-.36 1.118l1.534 4.636c.307.93-.755 1.688-1.54 1.118l-3.94-2.87a1 1 0 00-1.176 0l-3.94 2.87c-.784.57-1.838-.188-1.53-1.118l1.533-4.636a1 1 0 00-.36-1.118l-3.94-2.87c-.793-.585-.386-1.838.593-1.838h4.87a1 1 0 00.95-.69L11.48 3.5z',
            trophy: 'M18 4.5c1.213 0 2.222.988 2.222 2.208 0 1.154-.888 2.1-2.019 2.201L18 8.922V10.5c0 2.029-1.352 3.738-3.222 4.29l-.278.074v1.886c1.13.188 2 .94 2 1.875v.375H7.5v-.375c0-.936.87-1.687 2-1.875v-1.886A4.5 4.5 0 016.278 14.8C6.082 14.733 6 14.619 6 14.5V8.922l-.203-.013c-1.13-.1-2.019-1.047-2.019-2.201C3.778 5.488 4.787 4.5 6 4.5h12zm0 1.5H6c-.387 0-.722.3-.722.708 0 .376.3.693.689.707l.033.001v.014c.783-.004 1.503-.306 2.05-.8l-.05.08h8.05a3 3 0 012.05.8l-.05-.08v-.014c.39-.014.689-.331.689-.707 0-.408-.335-.708-.722-.708zM12 4.5c1.657 0 3 1.343 3 3a3 3 0 01-3 3 3 3 0 01-3-3 3 3 0 013-3z',
            users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.05 20c-1.84 0-3.578-.44-5.112-1.222V18.77c0-2.68 2.28-4.87 5.093-4.87 2.813 0 5.093 2.19 5.093 4.87v.358zM15 8.25a3 3 0 11-6 0 3 3 0 016 0zm6 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
            badge_check: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
            shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
            map_pin: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z',
            chat: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z',
            cog: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            gift: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z',
            card: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
        };

        const slugToPackKey = {
            opening: 'envelope',
            bride_groom: 'heart',
            event: 'calendar',
            gallery: 'theme',
            love_story: 'heart',
            bank: 'card',
            closing: 'badge_check',
            guestbook: 'users',
            save_the_date: 'calendar',
            turut_mengundang: 'users',
            bride_groom_detail: 'users',
            dresscode: 'theme',
            video_wedding: 'sparkles',
            cover: 'theme',
            guest: 'users',
            rsvp: 'badge_check',
            music: 'lightning',
            gift: 'gift',
            whatsapp: 'chat',
            template: 'theme',
            instagram_filter: 'sparkles'
        };

        let featuresList = [];
        if (features && features.length > 0) {
            featuresList = features.map(f => {
                const custom = c?.features_custom?.[f.slug] || {};
                const isEnabled = custom.is_enabled !== false;
                const customName = custom.name || f.name;
                const customDesc = custom.description || f.description || DEFAULT_DESCRIPTIONS[f.slug] || '';
                
                const packKey = slugToPackKey[f.slug] || 'sparkles';
                const iconPath = FEATURE_ICONS[packKey] || FEATURE_ICONS.sparkles;
                
                return {
                    title: customName,
                    desc: customDesc,
                    icon: iconPath,
                    is_enabled: isEnabled
                };
            }).filter(item => item.is_enabled);
        }

        if (featuresList.length === 0) {
            featuresList = FEATURES;
        }

        return (
            <section className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Fitur Utama ({featuresList.length} Fitur)</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Fitur-fitur premium yang membuat undangan digital Anda tampil beda dan berkesan.</p>
                    </div>
                    <div className="rl-features__outer" style={{ position: 'relative' }}>
                        <div ref={featuresScrollRef} className="rl-features">
                            {featuresList.map((f, i) => (
                                <div key={i} className="rl-feature-card">
                                    <span className="rl-feature-card__number">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="rl-feature-card__icon">
                                        <Svg d={f.icon} size={24} color="var(--accent)" />
                                    </div>
                                    <h3 className="rl-feature-card__title">{f.title}</h3>
                                    <p className="rl-feature-card__desc">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rl-features__nav-container">
                            <button className="rl-features__nav-btn rl-features__nav-btn--left" onClick={() => scrollFeatures('left')} aria-label="Sebelumnya">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button className="rl-features__nav-btn rl-features__nav-btn--right" onClick={() => scrollFeatures('right')} aria-label="Selanjutnya">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    const renderThemesCatalog = (c) => {
        const title = c?.title || 'Pilih Desain Sempurna untuk Anda';
        return (
            <section id="preview" className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Koleksi Desain</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Koleksi tema undangan digital elegan premium yang siap digunakan. Klik untuk melihat preview langsung.</p>
                    </div>

                    {themes.length > 0 && (
                        <div className="rl-filter-panel">
                            <div className="rl-filter-row">
                                <div className="rl-filter-search-container">
                                    <Svg d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={16} color="var(--text-muted)" viewBox="0 0 24 24" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Cari tema..."
                                        className="rl-filter-search-input"
                                    />
                                </div>

                                <div className="rl-filter-controls">
                                    <div className="rl-filter-dropdown-wrapper" ref={categoryDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (selectedCategories.length > 0 ? 'var(--accent)' : 'var(--card-border)'),
                                                background: selectedCategories.length > 0 ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: selectedCategories.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'
                                            }}
                                            className="rl-filter-btn"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                                <Svg d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" size={14} color="currentColor" />
                                                <span>{selectedCategories.length === 0 ? 'Kategori' : `Kategori (${selectedCategories.length})`}</span>
                                            </div>
                                            <Svg d="M19 9l-7 7-7-7" size={12} color="currentColor" />
                                        </button>

                                        {isCategoryDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                                                <div className="rl-filter-dropdown-menu-header">
                                                    <span className="rl-filter-dropdown-menu-title">Kategori</span>
                                                    {selectedCategories.length > 0 && <button type="button" onClick={clearCategories} className="rl-filter-dropdown-menu-reset">Reset</button>}
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {categories.map(cat => {
                                                        const isChecked = selectedCategories.includes(cat);
                                                        return (
                                                            <label key={cat} className="rl-filter-checkbox-label" style={{ color: isChecked ? 'var(--accent)' : 'var(--text-secondary)', background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent' }}>
                                                                <input type="checkbox" checked={isChecked} onChange={() => toggleCategory(cat)} className="rl-filter-checkbox-input" />
                                                                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="rl-filter-dropdown-wrapper" ref={typeDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (selectedTypes.length > 0 ? 'var(--accent)' : 'var(--card-border)'),
                                                background: selectedTypes.length > 0 ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: selectedTypes.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'
                                            }}
                                            className="rl-filter-btn"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                                <Svg d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={14} color="currentColor" />
                                                <span>{selectedTypes.length === 0 ? 'Acara' : `Acara (${selectedTypes.length})`}</span>
                                            </div>
                                            <Svg d="M19 9l-7 7-7-7" size={12} color="currentColor" />
                                        </button>

                                        {isTypeDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                                                <div className="rl-filter-dropdown-menu-header">
                                                    <span className="rl-filter-dropdown-menu-title">Tipe Acara</span>
                                                    {selectedTypes.length > 0 && <button type="button" onClick={clearTypes} className="rl-filter-dropdown-menu-reset">Reset</button>}
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {eventTypesWithCount.map(type => {
                                                        const isChecked = selectedTypes.includes(type.key);
                                                        return (
                                                            <label key={type.key} className="rl-filter-checkbox-label" style={{ color: isChecked ? 'var(--accent)' : 'var(--text-secondary)', background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent' }}>
                                                                <input type="checkbox" checked={isChecked} onChange={() => toggleType(type.key)} className="rl-filter-checkbox-input" />
                                                                <span>{type.label}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="rl-filter-dropdown-wrapper" ref={sortDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (isSortDropdownOpen ? 'var(--accent)' : 'var(--card-border)'),
                                                background: isSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: isSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                                width: '38px', height: '38px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                            title="Urutkan Desain"
                                        >
                                            <Svg d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" size={16} color="currentColor" />
                                        </button>

                                        {isSortDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                                                <div className="rl-filter-dropdown-menu-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}><span className="rl-filter-dropdown-menu-title">Urutkan</span></div>
                                                <div className="rl-filter-dropdown-list">
                                                    {[
                                                        { key: 'terbaru', label: 'Terbaru' },
                                                        { key: 'populer', label: 'Terpopuler' },
                                                        { key: 'disukai', label: 'Terfavorit' }
                                                    ].map(opt => {
                                                        const isActive = sortThemeKey === opt.key;
                                                        return (
                                                            <button
                                                                key={opt.key} type="button"
                                                                onClick={() => { setSortThemeKey(opt.key); setIsSortDropdownOpen(false); }}
                                                                style={{
                                                                    width: '105%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', border: 'none',
                                                                    background: isActive ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', textAlign: 'left', margin: '2px 0'
                                                                }}
                                                            >
                                                                <span>{opt.label}</span>
                                                                {isActive && <Svg d="M5 13l4 4L19 7" size={14} color="var(--accent)" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {filteredThemes.length > 0 ? (
                    c?.style === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {(() => {
                                const sorted = [...filteredThemes];
                                if (sortThemeKey === 'terbaru') sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
                                else if (sortThemeKey === 'populer') sorted.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
                                else if (sortThemeKey === 'disukai') sorted.sort((a, b) => {
                                    const bL = likes[b.id] ?? ((b.base_likes || 0) + (b.real_likes || 0));
                                    const aL = likes[a.id] ?? ((a.base_likes || 0) + (a.real_likes || 0));
                                    return bL - aL;
                                });
                                return sorted.map(theme => (
                                    <div key={theme.id} className="w-full">
                                        <ThemePreviewCard theme={theme} reseller={reseller} />
                                    </div>
                                ));
                            })()}
                        </div>
                    ) : (
                        <div className="rl-themes-scroll-wrap">
                            <div className="rl-themes-scroll" id="themes-scroll">
                                {(() => {
                                    const sorted = [...filteredThemes];
                                    if (sortThemeKey === 'terbaru') sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
                                    else if (sortThemeKey === 'populer') sorted.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
                                    else if (sortThemeKey === 'disukai') sorted.sort((a, b) => {
                                        const bL = likes[b.id] ?? ((b.base_likes || 0) + (b.real_likes || 0));
                                        const aL = likes[a.id] ?? ((a.base_likes || 0) + (a.real_likes || 0));
                                        return bL - aL;
                                    });
                                    return sorted.map(theme => (
                                        <div key={theme.id} className="w-[240px] sm:w-[260px] flex-shrink-0">
                                            <ThemePreviewCard theme={theme} reseller={reseller} />
                                        </div>
                                    ));
                                })()}
                            </div>
                            <div className="rl-themes-scroll-controls">
                                <button onClick={() => document.getElementById('themes-scroll')?.scrollBy({ left: -280, behavior: 'smooth' })} className="rl-scroll-btn">←</button>
                                <Link href={getThemesUrl()} className="rl-btn rl-btn--accent-outline">Lihat Semua Tema →</Link>
                                <button onClick={() => document.getElementById('themes-scroll')?.scrollBy({ left: 280, behavior: 'smooth' })} className="rl-scroll-btn">→</button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="rl-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Belum ada tema dalam kategori ini atau tidak ada hasil pencarian yang cocok.
                    </div>
                )}
            </section>
        );
    };

    const renderGreetingCardsCatalog = (c) => {
        const title = c?.title || 'Koleksi Kartu Ucapan Premium';
        return (
            <section id="preview-kartu" className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag" style={{ background: 'var(--accent)', color: '#fff' }}>Koleksi Kartu</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Kirimkan ucapan spesial dengan animasi, musik, dan efek interaktif memukau untuk berbagai momen penting Anda. Klik untuk melihat preview.</p>
                    </div>

                    <div className="rl-filter-panel">
                        <div className="rl-filter-row">
                            <div className="rl-filter-search-container">
                                <Svg d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" size={16} color="var(--text-muted)" viewBox="0 0 24 24" />
                                <input
                                    type="text"
                                    value={cardSearchQuery}
                                    onChange={e => setCardSearchQuery(e.target.value)}
                                    placeholder="Cari kartu..."
                                    className="rl-filter-search-input"
                                />
                            </div>

                            <div className="rl-filter-controls">
                                <div className="rl-filter-dropdown-wrapper" ref={cardTypeDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                                        style={{
                                            border: '1.5px solid ' + (cardSelectedTypes.length > 0 ? 'var(--accent)' : 'var(--card-border)'),
                                            background: cardSelectedTypes.length > 0 ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                            color: cardSelectedTypes.length > 0 ? 'var(--accent)' : 'var(--text-secondary)'
                                        }}
                                        className="rl-filter-btn"
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                            <Svg d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" size={14} color="currentColor" />
                                            <span>{cardSelectedTypes.length === 0 ? 'Acara' : `Acara (${cardSelectedTypes.length})`}</span>
                                        </div>
                                        <Svg d="M19 9l-7 7-7-7" size={12} color="currentColor" />
                                    </button>

                                    {isCardTypeDropdownOpen && (
                                        <div className="rl-filter-dropdown-menu" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                                            <div className="rl-filter-dropdown-menu-header">
                                                <span className="rl-filter-dropdown-menu-title">Tipe Acara</span>
                                                {cardSelectedTypes.length > 0 && <button type="button" onClick={clearCardTypes} className="rl-filter-dropdown-menu-reset">Reset</button>}
                                            </div>
                                            <div className="rl-filter-dropdown-list">
                                                {cardTypesWithCount.map(type => {
                                                    const isChecked = cardSelectedTypes.includes(type.key);
                                                    return (
                                                        <label key={type.key} className="rl-filter-checkbox-label" style={{ color: isChecked ? 'var(--accent)' : 'var(--text-secondary)', background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent' }}>
                                                            <input type="checkbox" checked={isChecked} onChange={() => toggleCardType(type.key)} className="rl-filter-checkbox-input" />
                                                            <span>{type.label}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="rl-filter-dropdown-wrapper" ref={cardSortDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCardSortDropdownOpen(!isCardSortDropdownOpen)}
                                        style={{
                                            border: '1.5px solid ' + (isCardSortDropdownOpen ? 'var(--accent)' : 'var(--card-border)'),
                                            background: isCardSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                            color: isCardSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                            width: '38px', height: '38px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                        }}
                                        title="Urutkan Desain"
                                    >
                                        <Svg d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" size={16} color="currentColor" />
                                    </button>

                                    {isCardSortDropdownOpen && (
                                        <div className="rl-filter-dropdown-menu" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)' }}>
                                            <div className="rl-filter-dropdown-menu-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}><span className="rl-filter-dropdown-menu-title">Urutkan</span></div>
                                            <div className="rl-filter-dropdown-list">
                                                {[
                                                    { key: 'terbaru', label: 'Terbaru' },
                                                    { key: 'populer', label: 'Terpopuler' },
                                                    { key: 'disukai', label: 'Terfavorit' }
                                                ].map(opt => {
                                                    const isActive = cardSortKey === opt.key;
                                                    return (
                                                        <button
                                                            key={opt.key} type="button"
                                                            onClick={() => { setCardSortKey(opt.key); setIsCardSortDropdownOpen(false); }}
                                                            style={{
                                                                width: '105%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', border: 'none',
                                                                background: isActive ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent', color: isActive ? 'var(--accent)' : 'var(--text-secondary)', textAlign: 'left', margin: '2px 0'
                                                            }}
                                                        >
                                                            <span>{opt.label}</span>
                                                            {isActive && <Svg d="M5 13l4 4L19 7" size={14} color="var(--accent)" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {sortedCards.length > 0 ? (
                    c?.style === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sortedCards.map(card => (
                                <div key={card.id} className="w-full">
                                    <GreetingCardPreviewCard theme={card} reseller={reseller} onUse={handleUseCard} typeOptions={greetingCardTypeOptions} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rl-themes-scroll-wrap">
                            <div className="rl-themes-scroll" id="cards-scroll">
                                {sortedCards.map(card => (
                                    <div key={card.id} className="w-[240px] sm:w-[260px] flex-shrink-0">
                                        <GreetingCardPreviewCard theme={card} reseller={reseller} onUse={handleUseCard} typeOptions={greetingCardTypeOptions} />
                                    </div>
                                ))}
                            </div>
                            <div className="rl-themes-scroll-controls">
                                <button onClick={() => document.getElementById('cards-scroll')?.scrollBy({ left: -280, behavior: 'smooth' })} className="rl-scroll-btn">←</button>
                                <Link href={getCardsUrl()} className="rl-btn rl-btn--accent-outline">Lihat Semua Kartu →</Link>
                                <button onClick={() => document.getElementById('cards-scroll')?.scrollBy({ left: 280, behavior: 'smooth' })} className="rl-scroll-btn">→</button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="rl-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Belum ada kartu ucapan dalam tipe ini atau tidak ada hasil pencarian yang cocok.
                    </div>
                )}
            </section>
        );
    };

    const renderTestimonials = (c) => {
        const title = c?.title || 'Dipercaya Ribuan Pasangan Bahagia';
        const items = c?.items || TESTIMONIALS;
        return (
            <section className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Testimoni</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Apa kata mereka yang telah menerbitkan undangan digital kebahagiaan mereka bersama kami.</p>
                    </div>
                    <div className="rl-testimonials-grid">
                        {items.map((t, i) => (
                            <div key={i} className="rl-testimonial-card">
                                <div className="rl-testimonial-card__header">
                                    <div>
                                        <h4 className="rl-testimonial-card__name">{t.name}</h4>
                                        <div className="rl-testimonial-card__city">{t.city}</div>
                                    </div>
                                    <div className="rl-testimonial-card__stars">
                                        {Array.from({ length: t.stars || 5 }).map((_, idx) => <StarIcon key={idx} />)}
                                    </div>
                                </div>
                                <p className="rl-testimonial-card__text">"{t.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const renderPlans = (c) => {
        const title = c?.title || 'Pilih Paket Undangan Digital';
        const invitationPlans = plans.filter(p => p.type === 'invitation' || !p.type);
        if (invitationPlans.length === 0) return null;
        return (
            <section id="plans" className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Harga & Paket Undangan</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Pilih paket terbaik dengan harga terjangkau sesuai kebutuhan acara Anda.</p>
                    </div>
                    <div className="rl-plans-grid">
                        {invitationPlans.map((plan) => {
                            const meta = planMeta[plan.slug] || { color: 'var(--accent)', label: 'Mulai Sekarang' };
                            const isPopular = !!meta.popular;
                            return (
                                <div key={plan.id} className={`rl-plan-card ${isPopular ? 'rl-plan-card--popular' : ''}`}>
                                    {isPopular && <div className="rl-plan-card__popular-badge">REKOMENDASI</div>}
                                    <h3 className="rl-plan-card__name">{plan.name}</h3>
                                    {plan.normal_price && (
                                        <div className="rl-plan-card__original-price">
                                            {formatRp(plan.normal_price)}
                                        </div>
                                    )}
                                    <div className="rl-plan-card__price">
                                        {plan.price === 0 ? 'GRATIS' : formatRp(plan.price)}
                                        {plan.price > 0 && <span className="rl-plan-card__duration">/{plan.duration_days} hari</span>}
                                    </div>
                                    <p className="rl-plan-card__desc">{plan.description}</p>
                                    <a
                                        href={`${registerUrl}&plan=${plan.slug}`}
                                        className={`rl-plan-card__btn ${isPopular ? 'rl-plan-card__btn--popular' : ''}`}
                                    >
                                        {meta.label}
                                    </a>
                                    <ul className="rl-plan-card__features">
                                        <li>
                                            <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                            Maks. {plan.max_guests === -1 ? 'Unlimited' : plan.max_guests} Tamu
                                        </li>
                                        <li>
                                            <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                            Maks. {plan.max_galleries} Foto Album
                                        </li>
                                        {plan.feature_access?.map((fa) => {
                                            if (!fa.is_enabled || !fa.feature) return null;
                                            return (
                                                <li key={fa.feature_id}>
                                                    <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                                    {fa.feature.name}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    };

    const renderPlansCards = (c) => {
        const title = c?.title || 'Pilih Paket Kartu Ucapan Digital';
        const cardPlans = plans.filter(p => p.type === 'greeting_card');
        if (cardPlans.length === 0) return null;
        return (
            <section id="plans-cards" className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Harga & Paket Kartu</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Pilih paket kartu terbaik dengan harga terjangkau sesuai kebutuhan kartu ucapan Anda.</p>
                    </div>
                    <div className="rl-plans-grid">
                        {cardPlans.map((plan) => {
                            const meta = planMeta[plan.slug] || { color: 'var(--accent)', label: 'Mulai Sekarang' };
                            const isPopular = !!meta.popular;
                            return (
                                <div key={plan.id} className={`rl-plan-card ${isPopular ? 'rl-plan-card--popular' : ''}`}>
                                    {isPopular && <div className="rl-plan-card__popular-badge">REKOMENDASI</div>}
                                    <h3 className="rl-plan-card__name">{plan.name}</h3>
                                    {plan.normal_price && (
                                        <div className="rl-plan-card__original-price">
                                            {formatRp(plan.normal_price)}
                                        </div>
                                    )}
                                    <div className="rl-plan-card__price">
                                        {plan.price === 0 ? 'GRATIS' : formatRp(plan.price)}
                                        {plan.price > 0 && <span className="rl-plan-card__duration">/{plan.duration_days} hari</span>}
                                    </div>
                                    <p className="rl-plan-card__desc">{plan.description}</p>
                                    <a
                                        href={`${registerUrl}&plan=${plan.slug}`}
                                        className={`rl-plan-card__btn ${isPopular ? 'rl-plan-card__btn--popular' : ''}`}
                                    >
                                        {meta.label}
                                    </a>
                                    <ul className="rl-plan-card__features">
                                        <li>
                                            <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                            Maks. {plan.max_guests === -1 ? 'Unlimited' : plan.max_guests} Tamu
                                        </li>
                                        <li>
                                            <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                            Maks. {plan.max_galleries} Foto Album
                                        </li>
                                        {plan.feature_access?.map((fa) => {
                                            if (!fa.is_enabled || !fa.feature) return null;
                                            return (
                                                <li key={fa.feature_id}>
                                                    <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={18} color="var(--accent)" />
                                                    {fa.feature.name}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    };

    const renderFaq = (c) => {
        const title = c?.title || 'Pertanyaan yang Sering Ditanyakan';
        const items = c?.items || FAQS;
        return (
            <section className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">FAQ</span>
                        <h2 className="rl-section__title">{title}</h2>
                        <p className="rl-section__desc">Beberapa pertanyaan mendasar yang sering ditanyakan mengenai platform kami.</p>
                    </div>
                    <div className="rl-faq-wrap">
                        {items.map((item, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div key={i} className="rl-faq-item">
                                    <button onClick={() => setOpenFaq(isOpen ? null : i)} className="rl-faq-q">
                                        <span>{item.q}</span>
                                        <span className={`rl-faq-arrow ${isOpen ? 'rl-faq-arrow--open' : ''}`}>▼</span>
                                    </button>
                                    <div className="rl-faq-a" style={{ display: isOpen ? 'block' : 'none' }}>
                                        <p>{item.a}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    };

    const renderCta = (c) => {
        const title = c?.title || 'Siap Membuat Undangan Digital yang Berkesan?';
        const ctaText = c?.cta_text || 'Mulai Gratis Sekarang';
        return (
            <section className="rl-cta-section">
                <div className="rl-container" style={{ position: 'relative', zIndex: 2 }}>
                    <h2 className="rl-cta-section__title">{title}</h2>
                    <a href={registerUrl} className="rl-cta-btn rl-cta-btn--primary rl-cta-btn--lg">
                        {ctaText}
                    </a>
                </div>
            </section>
        );
    };

    const renderSection = (key, config) => {
        switch (key) {
            case 'banner': return renderBanner(config);
            case 'hero': return renderHero(config);
            case 'stats': return renderStats(config);
            case 'how_it_works': return renderHowItWorks(config);
            case 'features': return renderFeatures(config);
            case 'preview': return renderThemesCatalog(config);
            case 'greeting_cards': return renderGreetingCardsCatalog(config);
            case 'testimonials': return renderTestimonials(config);
            case 'plans': return renderPlans(config);
            case 'plans_cards': return renderPlansCards(config);
            case 'faq': return renderFaq(config);
            case 'cta': return renderCta(config);
            default: return null;
        }
    };

    const siteTitle = reseller.site_title || reseller.brand_name || 'Undangan Digital';
    const siteMotto = reseller.site_motto || 'Platform Undangan Digital Premium';

    const loadingScreenSection = activeSections.find(s => s.key === 'loading_screen');
    const showLoadingScreen = loadingScreenSection ? loadingScreenSection.active : true;
    const activeLoadingStyle = loadingScreenSection?.config?.style || previewConfig?.loading_style || reseller.loading_style || 'pulse';

    const preloaderStyles = `
        @keyframes rl-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes rl-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes rl-spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
        }
        @keyframes rl-shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
        }
        @keyframes rl-fade-breath {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        @keyframes rl-envelope-open {
            0% { transform: rotateX(0deg); z-index: 4; }
            50% { transform: rotateX(90deg); z-index: 1; }
            100% { transform: rotateX(180deg); z-index: 1; }
        }
        @keyframes rl-card-slide-up {
            0% { transform: translateY(0); }
            50% { transform: translateY(0); }
            100% { transform: translateY(-40px); }
        }
        @keyframes rl-progress-sweep {
            0% { left: -30%; width: 30%; }
            50% { left: 30%; width: 40%; }
            100% { left: 100%; width: 30%; }
        }
    `;

    const renderPreloaderContent = () => {
        const brandChar = reseller.brand_name?.charAt(0) || 'U';
        const accentColor = T.accent || '#d31124';
        const isDark = T.isDark;
        const textPrimaryColor = T.textPrimary || (isDark ? '#ffffff' : '#333333');
        const textSecondaryColor = T.textSecondary || (isDark ? 'rgba(255,255,255,0.7)' : '#666666');

        switch (activeLoadingStyle) {
            case 'glass':
                return (
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        maxWidth: '320px',
                        width: '90%',
                    }}>
                        {/* Soft glowing ambient circle behind */}
                        <div style={{
                            position: 'absolute',
                            width: '120px',
                            height: '120px',
                            background: accentColor,
                            borderRadius: '50%',
                            filter: 'blur(40px)',
                            opacity: isDark ? 0.3 : 0.15,
                            zIndex: -1,
                        }} />
                        
                        {/* Logo in center */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '18px',
                            background: `linear-gradient(135deg, ${accentColor}, ${T.accentDark || accentColor})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 20px ${accentColor}30`,
                            animation: 'rl-pulse 2s ease-in-out infinite',
                            color: '#ffffff',
                            fontWeight: '800',
                            fontSize: '28px',
                            marginBottom: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}>
                            {brandChar}
                        </div>
                        
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '16px',
                            fontWeight: '700',
                            margin: '0 0 16px 0',
                            textAlign: 'center',
                            fontFamily: T.fontFamily || 'sans-serif'
                        }}>
                            {reseller.brand_name}
                        </h4>
                        
                        {/* Shimmer loading bar */}
                        <div style={{
                            width: '120px',
                            height: '4px',
                            background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: '100%',
                                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                                animation: 'rl-shimmer 1.5s infinite',
                                backgroundSize: '200px 100%',
                            }} />
                        </div>
                    </div>
                );

            case 'rings':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '90px',
                            height: '90px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px'
                        }}>
                            {/* Outer spinning ring */}
                            <div style={{
                                position: 'absolute',
                                width: '90px',
                                height: '90px',
                                border: '2.5px solid transparent',
                                borderTopColor: accentColor,
                                borderBottomColor: accentColor,
                                borderRadius: '50%',
                                animation: 'rl-spin 1.5s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite'
                            }} />
                            {/* Inner ring spinning reverse */}
                            <div style={{
                                position: 'absolute',
                                width: '70px',
                                height: '70px',
                                border: '2.5px solid transparent',
                                borderLeftColor: isDark ? '#ffffff' : '#333333',
                                borderRightColor: isDark ? '#ffffff' : '#333333',
                                borderRadius: '50%',
                                opacity: 0.8,
                                animation: 'rl-spin-reverse 1.2s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite'
                            }} />
                            {/* Brand Initial with Neon Glow */}
                            <div style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: isDark ? '#ffffff' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isDark ? `0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px ${accentColor}` : `0 4px 15px rgba(0, 0, 0, 0.05), 0 0 20px ${accentColor}40`,
                                color: accentColor,
                                fontWeight: '800',
                                fontSize: '20px',
                                textShadow: `0 1px 2px rgba(0,0,0,0.1)`
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: '0 0 6px 0',
                            animation: 'rl-fade-breath 2s ease-in-out infinite',
                            fontFamily: T.fontFamily || 'sans-serif'
                        }}>
                            {reseller.brand_name}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );

            case 'bar':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Top glowing progress bar */}
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            height: '3.5px',
                            width: '100%',
                            background: 'rgba(0,0,0,0.05)',
                            zIndex: 1000000
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                height: '100%',
                                background: `linear-gradient(90deg, ${accentColor}, ${isDark ? '#ffffff' : accentColor}, ${accentColor})`,
                                boxShadow: `0 0 10px ${accentColor}`,
                                animation: 'rl-progress-sweep 2s ease-in-out infinite',
                                width: '30%'
                            }} />
                        </div>
                        
                        {/* Clean spinning circle & brand label */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: isDark ? '2px solid rgba(255,255,255,0.1)' : '2px solid rgba(0,0,0,0.05)',
                            borderTopColor: accentColor,
                            borderRadius: '50%',
                            animation: 'rl-spin 0.8s linear infinite',
                            marginBottom: '20px'
                        }} />
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '20px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            margin: '0 0 4px 0',
                            fontFamily: T.fontFamily || 'sans-serif',
                            opacity: 0.95
                        }}>
                            {reseller.brand_name}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '1px'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );

            case 'envelope':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* CSS Animated Envelope container */}
                        <div style={{
                            position: 'relative',
                            width: '100px',
                            height: '75px',
                            background: `linear-gradient(135deg, ${accentColor}, ${T.accentDark || accentColor})`,
                            borderRadius: '0 0 8px 8px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            marginBottom: '35px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                        }}>
                            {/* Left and right fold of envelope */}
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '37.5px 0 37.5px 50px',
                                borderColor: 'transparent transparent rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.1)',
                                borderRadius: '0 0 0 8px',
                                zIndex: 3
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '37.5px 50px 37.5px 0',
                                borderColor: 'transparent rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.15) transparent',
                                borderRadius: '0 0 8px 0',
                                zIndex: 3
                            }} />
                            
                            {/* Top flap of envelope */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                                borderWidth: '38px 50px 0 50px',
                                borderColor: `${accentColor} transparent transparent transparent`,
                                transformOrigin: 'top center',
                                animation: 'rl-envelope-open 1.8s ease-in-out infinite alternate',
                                zIndex: 3,
                            }} />

                            {/* Invitation Card coming out */}
                            <div style={{
                                position: 'absolute',
                                width: '80px',
                                height: '70px',
                                background: '#ffffff',
                                borderRadius: '4px',
                                bottom: '5px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
                                animation: 'rl-card-slide-up 1.8s ease-in-out infinite alternate',
                                zIndex: 2,
                                border: '1px solid rgba(0,0,0,0.05)',
                                padding: '4px'
                            }}>
                                {/* Pulsing red heart */}
                                <span style={{
                                    fontSize: '18px',
                                    animation: 'rl-pulse 1s infinite',
                                    display: 'inline-block'
                                }}>❤️</span>
                                <span style={{
                                    fontSize: '8px',
                                    color: '#4b5563',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    marginTop: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>Love Ticket</span>
                            </div>
                        </div>
                        <h4 style={{
                            color: textPrimaryColor,
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: '0 0 6px 0',
                            fontFamily: T.fontFamily || 'sans-serif'
                        }}>
                            {reseller.brand_name}
                        </h4>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '11px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontWeight: '500'
                        }}>
                            Membuka Undangan...
                        </p>
                    </div>
                );

            case 'pulse':
            default:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                border: `3px solid ${accentColor}20`,
                                borderTop: `3px solid ${accentColor}`,
                                borderRadius: '50%',
                                animation: 'rl-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                            }} />
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: accentColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 20px ${accentColor}`,
                                animation: 'rl-pulse 2s ease-in-out infinite',
                                color: isDark ? '#000' : '#fff',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h3 style={{
                            color: textPrimaryColor,
                            fontSize: '18px',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            margin: '0 0 8px 0',
                            fontFamily: T.fontFamily || 'sans-serif',
                            textAlign: 'center',
                            animation: 'rl-pulse 2s ease-in-out infinite'
                        }}>
                            {reseller.brand_name}
                        </h3>
                        <p style={{
                            color: textSecondaryColor,
                            fontSize: '12px',
                            margin: 0,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            opacity: 0.9,
                            fontWeight: '500',
                            fontFamily: T.fontFamily || 'sans-serif',
                            textAlign: 'center'
                        }}>
                            Memuat Halaman...
                        </p>
                    </div>
                );
        }
    };

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={siteMotto} />
                <style>{cssVars}</style>
                <style>{landingStyles}</style>
            </Head>

            {/* Elegant Preloader overlay */}
            {showLoadingScreen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: T.heroBg || T.sectionBase || '#111827',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999999,
                    opacity: isLoaded ? 0 : 1,
                    visibility: isLoaded ? 'hidden' : 'visible',
                    transition: 'opacity 0.4s ease-in-out, visibility 0.4s ease-in-out',
                    pointerEvents: 'none'
                }}>
                    <style dangerouslySetInnerHTML={{ __html: preloaderStyles }} />
                    {renderPreloaderContent()}
                </div>
            )}

            <div 
                className="rl-layout-container rl-layout-galaxy"
                style={{ 
                    opacity: (!showLoadingScreen || isLoaded) ? 1 : 0, 
                    transition: 'opacity 0.4s ease-in-out',
                    minHeight: '100vh'
                }}
            >

            {/* ══════════════ ANNOUNCEMENT BANNER ══════════════ */}
            {(() => {
                const bannerSec = activeSections.find(s => s.key === 'banner');
                if (bannerSec && bannerSec.active && !bannerDismissed) {
                    return renderBanner(bannerSec.config);
                }
                return null;
            })()}

            {/* ══════════════ NAVBAR ══════════════ */}
            <nav 
                className={`rl-nav ${scrolled ? 'rl-nav--scrolled' : ''}`}
                style={activeSections.some(s => s.key === 'banner' && s.active) && !bannerDismissed && !scrolled ? { top: '34px' } : { top: '0px' }}
            >
                <div className="rl-nav__inner">
                    <Link href={`/r/${reseller.ref}`} className="rl-nav__brand">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-nav__logo-img" />
                        ) : (
                            <div className="rl-nav__logo-placeholder">
                                {reseller.brand_name?.charAt(0)}
                            </div>
                        )}
                        <span className="rl-nav__brand-name">{reseller.brand_name}</span>
                    </Link>
                    <div className="rl-nav__actions">
                        {hasContact && (
                            <button onClick={handleContactClick} className="rl-btn rl-btn--ghost rl-nav__contact-btn">
                                Hubungi Kami
                            </button>
                        )}
                        <a href={loginUrl} className="rl-btn rl-btn--ghost">Masuk</a>
                        <a href={registerUrl} className="rl-btn rl-btn--accent">Mulai Gratis</a>
                    </div>
                </div>
            </nav>

            {/* ══════════════ SECTIONS RENDERING ══════════════ */}
            {activeSections.map(sec => {
                if (!sec.active || sec.key === 'banner') return null;
                return (
                    <div key={sec.key} id={`section-${sec.key}`} className="transition-all duration-500">
                        {renderSection(sec.key, sec.config)}
                    </div>
                );
            })}

            {/* ══════════════ FOOTER ══════════════ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__grid">
                        <div className="rl-footer__col">
                            <span className="rl-footer__brand-name">{reseller.brand_name}</span>
                            <p className="rl-footer__desc">{reseller.footer_description || siteMotto}</p>
                        </div>
                        <div className="rl-footer__col">
                            <h4 className="rl-footer__title">Hubungi Kami</h4>
                            <ul className="rl-footer__links">
                                {reseller.footer_address && <li><span className="text-[11px] text-gray-400">Alamat:</span> {reseller.footer_address}</li>}
                                {reseller.footer_email && <li><span className="text-[11px] text-gray-400">Email:</span> {reseller.footer_email}</li>}
                                {reseller.footer_phone && <li><span className="text-[11px] text-gray-400">Telepon:</span> {reseller.footer_phone}</li>}
                                {reseller.footer_whatsapp && <li><span className="text-[11px] text-gray-400">WhatsApp:</span> {reseller.footer_whatsapp}</li>}
                            </ul>
                        </div>
                    </div>
                    <div className="rl-footer__bottom">
                        &copy; {new Date().getFullYear()} {reseller.brand_name}. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    </>
);
}

const landingStyles = `
body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--section-base); color: var(--text-primary); }
.rl-nav { position: fixed; left: 0; right: 0; z-index: 100; background: transparent; transition: all 0.35s ease; }
.rl-nav--scrolled { background: var(--nav-bg); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.2); }
.rl-nav__inner { max-width: 1280px; margin: 0 auto; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; }
.rl-nav__brand { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; }
.rl-nav__logo-img { width: 40px; height: 40px; border-radius: 12px; object-fit: contain; }
.rl-nav__logo-placeholder { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; color: #fff; }
.rl-nav__brand-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.rl-nav__actions { display: flex; align-items: center; gap: 0.75rem; }
.rl-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
.rl-btn--ghost { background: transparent; color: var(--text-secondary); }
.rl-btn--ghost:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
.rl-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-btn--accent:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }
.rl-btn--accent-outline { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; }
.rl-btn--accent-outline:hover { background: rgba(var(--accent-rgb), 0.1); }
.rl-cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 2rem; border-radius: 14px; font-size: 1rem; font-weight: 700; text-decoration: none; transition: all 0.25s ease; cursor: pointer; border: none; }
.rl-cta-btn--primary { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 8px 30px rgba(var(--accent-rgb), 0.35); }
.rl-cta-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(var(--accent-rgb), 0.5); }
.rl-cta-btn--outline { background: rgba(255,255,255,0.06); color: var(--text-primary); border: 1.5px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px); }
.rl-cta-btn--outline:hover { background: rgba(255,255,255,0.1); }
.rl-cta-btn--lg { padding: 1rem 2.5rem; font-size: 1.05rem; border-radius: 16px; }
.rl-banner { position: relative; padding: 0.5rem 2.5rem 0.5rem 1rem; text-align: center; font-size: 0.75rem; font-weight: 700; z-index: 110; display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
.rl-banner__cta { padding: 0.25rem 0.75rem; background: #fff; border-radius: 100px; text-decoration: none; font-size: 0.7rem; font-weight: 800; transition: all 0.2s; }
.rl-banner__cta:hover { transform: scale(1.05); }
.rl-banner__close { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; font-size: 1.25rem; font-weight: 300; cursor: pointer; color: inherit; opacity: 0.7; }
.rl-banner__close:hover { opacity: 1; }
.rl-hero { position: relative; min-height: 100vh; background: var(--hero-bg); display: flex; align-items: center; justify-content: space-between; gap: 3rem; padding: 7rem 2rem 4rem; max-width: 1280px; margin: 0 auto; overflow: visible; }
.rl-hero__orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.rl-hero__orb--1 { width: 500px; height: 500px; background: rgba(var(--accent-rgb), 0.08); top: 0; left: -100px; }
.rl-hero__orb--2 { width: 400px; height: 400px; background: rgba(139,92,246,0.06); bottom: 0; right: -100px; }
.rl-hero__orb--3 { width: 300px; height: 300px; background: rgba(var(--accent-rgb), 0.05); top: 50%; right: 30%; }
.rl-hero__grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%); pointer-events: none; }
.rl-hero__content { position: relative; z-index: 1; flex: 1; max-width: 600px; }
.rl-hero__badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--tag-bg); color: var(--tag-color); border: 1px solid rgba(var(--accent-rgb), 0.2); padding: 0.375rem 1rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 600; margin-bottom: 1.5rem; }
.rl-hero__badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulse 2s infinite; }
.rl-hero__heading { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.15; color: var(--text-primary); margin-bottom: 1.25rem; }
.rl-hero__heading-sub { display: block; }
.rl-hero__rotating-word { color: var(--accent); transition: opacity 0.3s ease; display: inline-block; }
.rl-hero__heading-premium { color: var(--text-secondary); }
.rl-hero__desc { font-size: 1.0625rem; line-height: 1.75; color: var(--text-secondary); margin-bottom: 2rem; max-width: 480px; }
.rl-hero__cta-group { display: flex; gap: 0.875rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.rl-hero__perks { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.rl-hero__perk { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; color: var(--text-muted); }
.rl-hero__mockup { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; z-index: 10; }
.rl-phone { width: 240px; height: 480px; background: rgba(255,255,255,0.06); border: 10px solid #1a1a1a; border-radius: 36px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; }
.rl-phone__screen { width: 100%; height: 100%; padding: 0.5rem; background: #000; position: relative; }
.rl-phone__notch { width: 100px; height: 18px; background: #000; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 20; }
.rl-phone__content { width: 100%; height: 100%; background: #111; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1rem; }
.rl-phone__card { width: 100%; height: 100%; border-radius: 20px; background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); display: flex; flex-direction: column; align-items: center; padding: 1.25rem; gap: 1.25rem; position: relative; }
.rl-phone__card-img { width: 100%; height: 50%; background: rgba(255,255,255,0.04); border-radius: 12px; }
.rl-phone__card-lines { width: 100%; display: flex; flex-direction: column; gap: 0.5rem; }
.rl-phone__card-line { height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; }
.rl-phone__card-line--title { width: 60%; height: 14px; background: var(--accent); }
.rl-phone__card-line--sub { width: 40%; }
.rl-phone__card-line--date { width: 30%; }
.rl-phone__card-btn { width: 50%; height: 28px; background: var(--accent); border-radius: 14px; margin-top: auto; }
.rl-phone__badge { position: absolute; background: rgba(15,23,42,0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 1.25rem; border-radius: 18px; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); z-index: 20; }
.rl-phone__badge--1 { top: 20%; left: -60px; }
.rl-phone__badge--2 { bottom: 20%; right: -60px; }
.rl-stats { background: var(--section-alt); border-y: 1px solid var(--card-border); padding: 3rem 1.5rem; }
.rl-stats__inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem; }
.rl-stats__item { text-align: center; min-width: 150px; }
.rl-stats__icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.rl-stats__val { font-size: 2.25rem; font-weight: 800; color: var(--text-primary); }
.rl-stats__label { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; }
.rl-section { padding: 6rem 1.5rem; background: var(--section-base); }
.rl-section--alt { background: var(--section-alt); }
.rl-container { max-width: 1200px; margin: 0 auto; }
.rl-section__header { text-align: center; max-width: 600px; margin: 0 auto 4rem; }
.rl-section__tag { display: inline-block; padding: 0.35rem 1rem; background: var(--tag-bg); color: var(--tag-color); font-size: 0.75rem; font-weight: 700; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; }
.rl-section__title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 700; color: var(--text-primary); margin-bottom: 1rem; }
.rl-section__desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; }
.rl-steps { display: flex; justify-content: space-between; gap: 2.5rem; flex-wrap: wrap; }
.rl-step { flex: 1; min-width: 260px; text-align: center; position: relative; }
.rl-step__num { font-size: 4rem; font-weight: 900; color: rgba(var(--accent-rgb), 0.1); line-height: 1; margin-bottom: -1.5rem; font-family: sans-serif; }
.rl-step__icon-wrap { width: 70px; height: 70px; background: var(--card-bg); border: 1.5px solid var(--card-border); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
.rl-step__title { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.rl-step__desc { font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6; }
.rl-step__arrow { position: absolute; top: 35px; right: -25px; font-size: 1.5rem; color: var(--text-muted); }
.rl-features__outer { position: relative; }
.rl-features {
    display: grid !important;
    grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
    grid-auto-flow: column !important;
    grid-auto-columns: calc((100% - 4rem) / 3) !important;
    gap: 2rem !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
}
.rl-features::-webkit-scrollbar {
    display: none !important;
}
.rl-feature-card {
    position: relative !important;
    scroll-snap-align: start !important;
    padding: 2.5rem 2rem;
    background: var(--card-bg);
    border: 1.5px solid var(--card-border);
    border-radius: 24px;
    transition: all 0.3s;
}
.rl-feature-card:hover { transform: translateY(-5px); border-color: rgba(var(--accent-rgb), 0.3); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3); }
.rl-feature-card__icon { width: 50px; height: 50px; background: rgba(var(--accent-rgb), 0.1); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
.rl-feature-card__title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; padding-right: 2rem; }
.rl-feature-card__desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
.rl-feature-card__number {
    position: absolute !important;
    top: 2rem !important;
    right: 2rem !important;
    font-size: 1.75rem !important;
    font-weight: 800 !important;
    color: rgba(var(--accent-rgb), 0.15) !important;
    line-height: 1 !important;
    font-family: sans-serif !important;
    transition: all 0.3s ease !important;
}
.rl-feature-card:hover .rl-feature-card__number {
    color: rgba(var(--accent-rgb), 0.35) !important;
    transform: scale(1.1) !important;
}
.rl-features__nav-container {
    display: flex !important;
    justify-content: center !important;
    gap: 1rem !important;
    margin-top: 2rem !important;
}
.rl-features__nav-btn {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: var(--text-primary) !important;
    width: 44px !important;
    height: 44px !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
}
.rl-features__nav-btn:hover {
    background: var(--accent) !important;
    color: #fff !important;
    border-color: var(--accent) !important;
    box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.4) !important;
}
.rl-filter-panel { background: var(--card-bg); border: 1.5px solid var(--card-border); padding: 0.75rem 1rem; border-radius: 100px; max-width: 900px; margin: 0 auto 3rem; box-shadow: 0 8px 30px rgba(0,0,0,0.15); }
.rl-filter-row { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
.rl-filter-search-container { position: relative; flex: 1; display: flex; align-items: center; }
.rl-filter-search-input { width: 100%; border: none; background: transparent; padding: 0.5rem 0.5rem 0.5rem 2.25rem; color: var(--text-primary); font-size: 0.85rem; outline: none; font-weight: 600; }
.rl-filter-search-input::placeholder { color: var(--text-muted); }
.rl-filter-controls { display: flex; align-items: center; gap: 0.75rem; }
.rl-filter-dropdown-wrapper { position: relative; }
.rl-filter-btn { display: flex; align-items: center; gap: 1.25rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.8rem; font-weight: 750; cursor: pointer; transition: all 0.2s; outline: none; max-width: 180px; }
.rl-filter-dropdown-menu { position: absolute; top: calc(100% + 0.5rem); right: 0; width: 220px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); z-index: 50; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.rl-filter-dropdown-menu-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid var(--card-border); padding-bottom: 0.4rem; margin-bottom: 0.25rem; }
.rl-filter-dropdown-menu-title { font-size: 0.725rem; font-weight: 850; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.rl-filter-dropdown-menu-reset { font-size: 0.675rem; font-weight: 750; color: var(--accent); background: transparent; border: none; cursor: pointer; }
.rl-filter-dropdown-list { display: flex; flex-direction: column; max-height: 180px; overflow-y: auto; }
.rl-filter-checkbox-label { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: background 0.2s; margin: 1px 0; }
.rl-filter-checkbox-input { width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid var(--card-border); background: transparent; cursor: pointer; accent-color: var(--accent); }
.rl-themes-scroll-wrap { max-width: 100%; overflow: hidden; padding-bottom: 2rem; position: relative; }
.rl-themes-scroll { display: flex; gap: 1.5rem; overflow-x: auto; padding: 0.5rem 2rem 1.5rem; scrollbar-width: none; }
.rl-themes-scroll::-webkit-scrollbar { display: none; }
.rl-themes-scroll-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
.rl-scroll-btn { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--card-border); background: var(--card-bg); color: var(--text-primary); font-size: 1.15rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.rl-scroll-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb), 0.05); }
.rl-testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.rl-testimonial-card { padding: 2.5rem 2rem; background: var(--card-bg); border: 1.5px solid var(--card-border); border-radius: 24px; position: relative; }
.rl-testimonial-card__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.rl-testimonial-card__name { font-size: 1.15rem; font-weight: 700; color: var(--text-primary); }
.rl-testimonial-card__city { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.125rem; }
.rl-testimonial-card__stars { display: flex; gap: 0.125rem; }
.rl-testimonial-card__text { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; font-style: italic; }
.rl-plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto; }
.rl-plan-card { padding: 3rem 2rem; background: var(--card-bg); border: 1.5px solid var(--card-border); border-radius: 24px; position: relative; transition: all 0.3s; display: flex; flex-direction: column; }
.rl-plan-card--popular { border-color: var(--accent); box-shadow: 0 20px 40px -15px rgba(var(--accent-rgb), 0.25); transform: translateY(-5px); }
.rl-plan-card__popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); padding: 0.35rem 1rem; background: var(--accent); color: #000; font-size: 0.7rem; font-weight: 800; border-radius: 100px; letter-spacing: 0.05em; }
.rl-plan-card__name { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 1rem; }
.rl-plan-card__price { font-size: 2.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; display: flex; align-items: baseline; }
.rl-plan-card__original-price { font-size: 1rem; font-weight: 500; text-decoration: line-through; color: var(--text-muted); opacity: 0.7; margin-bottom: 0.25rem; }
.rl-plan-card__duration { font-size: 0.875rem; color: var(--text-secondary); font-weight: 500; }
.rl-plan-card__desc { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 2rem; }
.rl-plan-card__btn { display: block; text-align: center; padding: 0.875rem; border-radius: 100px; font-size: 0.9rem; font-weight: 700; text-decoration: none; background: rgba(255,255,255,0.06); color: var(--text-primary); border: 1.5px solid rgba(255,255,255,0.12); margin-bottom: 2.5rem; transition: all 0.2s; }
.rl-plan-card__btn:hover { background: rgba(255,255,255,0.1); }
.rl-plan-card__btn--popular { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; border: none; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-plan-card__btn--popular:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }
.rl-plan-card__features { list-style: none; display: flex; flex-direction: column; gap: 1rem; margin-top: auto; }
.rl-plan-card__features li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: var(--text-secondary); }
.rl-faq-wrap { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
.rl-faq-item { background: var(--card-bg); border: 1.5px solid var(--card-border); border-radius: 18px; overflow: hidden; transition: border-color 0.2s; }
.rl-faq-item:hover { border-color: rgba(var(--accent-rgb), 0.2); }
.rl-faq-q { width: 100%; padding: 1.5rem; background: transparent; border: none; outline: none; font-size: 1.05rem; font-weight: 700; color: var(--text-primary); text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
.rl-faq-arrow { font-size: 0.75rem; color: var(--text-muted); transition: transform 0.2s; }
.rl-faq-arrow--open { transform: rotate(180deg); color: var(--accent); }
.rl-faq-a { padding: 0 1.5rem 1.5rem; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; border-top: 1px solid transparent; }
.rl-cta-section { position: relative; padding: 7rem 1.5rem; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); text-align: center; color: #fff; overflow: hidden; }
.rl-cta-section__title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; margin-bottom: 2rem; max-width: 700px; margin-left: auto; margin-right: auto; line-height: 1.2; text-shadow: 0 2px 10px rgba(0,0,0,0.15); }
.rl-cta-section .rl-cta-btn--primary { background: #fff !important; color: var(--accent) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; }
.rl-cta-section .rl-cta-btn--primary:hover { transform: translateY(-2px) scale(1.02) !important; box-shadow: 0 15px 40px rgba(0,0,0,0.25) !important; }
.rl-footer { background: var(--footer-bg); border-t: 1px solid var(--card-border); padding: 5rem 1.5rem 3rem; }
.rl-footer__inner { max-width: 1200px; margin: 0 auto; }
.rl-footer__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 4rem; margin-bottom: 4rem; }
.rl-footer__col { display: flex; flex-direction: column; gap: 1.5rem; }
.rl-footer__brand-name { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
.rl-footer__desc { font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; }
.rl-footer__title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
.rl-footer__links { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
.rl-footer__links li { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; }
.rl-footer__bottom { text-align: center; font-size: 0.85rem; color: var(--text-muted); border-t: 1px solid var(--card-border); padding-top: 2rem; }

@media (max-width: 900px) {
    .rl-hero { flex-direction: column; justify-content: center; text-align: center; padding: 7rem 1.5rem 3rem; }
    .rl-hero__cta-group, .rl-hero__perks { justify-content: center; }
    .rl-hero__mockup { margin-top: 2rem; }
    .rl-phone__badge--1 { left: -30px; }
    .rl-phone__badge--2 { right: -30px; }
    .rl-step__arrow { display: none; }
}
@media (max-width: 640px) {
    .rl-nav__inner { padding: 1rem; }
    .rl-nav__contact-btn { display: none; }
    .rl-filter-panel { border-radius: 24px; padding: 1rem; }
    .rl-filter-row { flex-direction: column; gap: 1rem; align-items: stretch; }
    .rl-filter-search-input { padding-left: 2rem; }
    .rl-filter-controls { justify-content: space-between; }
    .rl-phone__badge { padding: 0.5rem 1rem; }
    .rl-phone__badge--1 { left: -10px; }
    .rl-phone__badge--2 { right: -10px; }
    
    /* Features slider compact on mobile */
    .rl-features {
        grid-template-columns: none !important;
        grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
        grid-auto-flow: column !important;
        grid-auto-columns: calc((100% - 0.75rem) / 3) !important;
        gap: 0.375rem !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        scrollbar-width: none !important;
    }
    .rl-features::-webkit-scrollbar {
        display: none !important;
    }
    .rl-feature-card {
        padding: 0.75rem 0.5rem !important;
        border-radius: 12px !important;
        scroll-snap-align: start !important;
        position: relative !important;
    }
    .rl-feature-card__icon {
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        margin-bottom: 0.375rem !important;
    }
    .rl-feature-card__icon svg {
        width: 16px !important;
        height: 16px !important;
    }
    .rl-feature-card__title {
        font-size: 0.75rem !important;
        margin-bottom: 0.25rem !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        padding-right: 1.25rem !important;
    }
    .rl-feature-card__desc {
        font-size: 0.65rem !important;
        line-height: 1.3 !important;
        margin-top: 0.25rem !important;
    }
    .rl-feature-card__number {
        top: 0.5rem !important;
        right: 0.5rem !important;
        font-size: 1rem !important;
    }
    .rl-features__nav-container {
        margin-top: 1rem !important;
        gap: 0.5rem !important;
    }
    .rl-features__nav-btn {
        width: 36px !important;
        height: 36px !important;
    }
}
`;
