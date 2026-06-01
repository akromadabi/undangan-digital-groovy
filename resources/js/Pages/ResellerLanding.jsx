import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';
import ThemePreviewCard from '@/Components/ThemePreviewCard';
import GreetingCardPreviewCard from '@/Components/GreetingCardPreviewCard';

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
    { name: 'Putri & Aldi', city: 'Yogyakarta', text: 'Desainnya sangat elegan dan modern. Tamu-tamu kami kagum. Pengalaman yang luar biasa!', stars: 5 },
    { name: 'Nadia & Rizky', city: 'Semarang', text: 'Fitur amplop digitalnya sangat praktis. Tidak perlu pusing soal transfer manual dari tamu.', stars: 5 },
    { name: 'Fitri & Hendra', city: 'Medan', text: 'Temanya banyak dan bagus-bagus. Mudah disesuaikan, hasilnya profesional sekali!', stars: 5 },
];

const FAQS = [
    { q: 'Apakah benar-benar gratis?', a: 'Ya! Paket dasar kami 100% gratis tanpa batas waktu. Anda bisa membuat undangan, mengundang tamu, dan menggunakan fitur dasar tanpa biaya apapun. Upgrade ke paket berbayar untuk fitur premium.' },
    { q: 'Berapa lama undangan bisa diakses?', a: 'Undangan Anda akan aktif sesuai dengan paket yang dipilih. Paket gratis berlaku selamanya, sementara paket premium memberikan akses penuh selama periode tertentu.' },
    { q: 'Apakah tamu bisa konfirmasi kehadiran?', a: 'Ya! Fitur RSVP tersedia di paket tertentu. Tamu bisa konfirmasi kehadiran langsung dari undangan digital Anda, dan Anda bisa melihat rekap kehadiran di dashboard.' },
    { q: 'Bagaimana cara membagikan undangan?', a: 'Setelah undangan selesai dibuat, Anda akan mendapatkan tautan unik yang bisa dibagikan via WhatsApp, pesan teks, email, atau media sosial lainnya.' },
    { q: 'Apakah bisa menggunakan foto sendiri?', a: 'Tentu! Anda bisa mengunggah foto couple, foto venue, dan foto-foto lain untuk ditampilkan di galeri undangan Anda. Jumlah foto bergantung pada paket yang dipilih.' },
];

const planMeta = {
    free:     { color: '#6b7280', glow: 'rgba(107,114,128,0.2)', label: 'Coba Gratis' },
    silver:   { color: '#64748b', glow: 'rgba(100,116,139,0.2)', label: 'Mulai Sekarang' },
    gold:     { color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', label: 'Mulai Sekarang', popular: true },
    platinum: { color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)', label: 'Mulai Sekarang' },
};

const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

/* ─────────────────────────────────────────────────────────
   THEME CONFIGS
───────────────────────────────────────────────────────── */
const THEMES_CFG = {
    default: {
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
    },
    elegant: {
        heroBg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
        accent: '#d97706',
        accentDark: '#b45309',
        accentRgb: '217,119,6',
        navBg: 'rgba(28,25,23,0.9)',
        sectionAlt: '#1c1917',
        sectionBase: '#231f1c',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#fef3c7',
        textSecondary: '#d6d3d1',
        textMuted: '#78716c',
        footerBg: '#0c0a09',
        tagBg: 'rgba(217,119,6,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    },
    minimal: {
        heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
        accent: '#0ea5e9',
        accentDark: '#0284c7',
        accentRgb: '14,165,233',
        navBg: 'rgba(255,255,255,0.92)',
        sectionAlt: '#f8fafc',
        sectionBase: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        footerBg: '#0f172a',
        tagBg: 'rgba(14,165,233,0.1)',
        tagColor: '#0284c7',
        isDark: false,
    },
    colorful: {
        heroBg: 'linear-gradient(135deg, #2d1b69 0%, #1a0038 50%, #2d1b69 100%)',
        accent: '#a855f7',
        accentDark: '#9333ea',
        accentRgb: '168,85,247',
        navBg: 'rgba(45,27,105,0.85)',
        sectionAlt: '#1a0038',
        sectionBase: '#200844',
        cardBg: 'rgba(255,255,255,0.05)',
        cardBorder: 'rgba(168,85,247,0.2)',
        textPrimary: '#f5f3ff',
        textSecondary: '#c4b5fd',
        textMuted: '#7c3aed',
        footerBg: '#0d001e',
        tagBg: 'rgba(168,85,247,0.15)',
        tagColor: '#d8b4fe',
        isDark: true,
    },
};

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function ResellerLanding({ reseller, plans = [], themes = [], greetingCards = [], greetingCardTypeOptions = {}, features = [] }) {
    const T = THEMES_CFG[reseller?.template] || THEMES_CFG.default;

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

    const categories = useMemo(() => {
        const cats = themes?.map(t => t.category ? t.category.trim().toLowerCase() : '').filter(Boolean) || [];
        return [...new Set(cats)];
    }, [themes]);

    // Memoize event types with theme counts
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

    // Greeting card event types with counts
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

    const marqueeRef = useRef(null);

    const [showComparison, setShowComparison] = useState(false);
    const [showFeatureDetails, setShowFeatureDetails] = useState(false);

    const FEATURE_DESCS = {
        opening: 'Tampilan pembuka halaman undangan (Layar sapa)',
        bride_groom: 'Detail profil mempelai (Nama, Orang Tua, Media Sosial)',
        event: 'Informasi detail akad nikah, resepsi, dan peta lokasi interaktif',
        gallery: 'Galeri album foto kenangan pre-wedding yang indah',
        love_story: 'Halaman perjalanan kisah cinta romantis mempelai',
        bank: 'Rekening Bank / E-Wallet untuk kirim kado atau amplop digital',
        closing: 'Teks penutup undangan dan ucapan doa restu',
        guestbook: 'Buku tamu interaktif untuk menerima ucapan doa restu dari pengunjung',
        save_the_date: 'Fitur pengingat tanggal acara dan countdown waktu mundur',
        turut_mengundang: 'Daftar nama-nama keluarga atau kerabat yang turut mengundang',
        bride_groom_detail: 'Informasi detail biografi mendalam dari kedua mempelai',
        dresscode: 'Fitur anjuran pakaian/dresscode untuk para tamu undangan',
        video_wedding: 'Fitur untuk menampilkan video prewedding atau momen bahagia',
        cover: 'Tampilan cover pembuka undangan digital premium',
        guest: 'Manajemen kuota daftar nama tamu undangan tanpa batas',
        rsvp: 'Sistem konfirmasi kehadiran tamu secara real-time',
        music: 'Fitur pemutar musik latar (backsound) otomatis yang indah',
        gift: 'Kirim kado fisik / hadiah alamat langsung ke lokasi mempelai',
        whatsapp: 'Kirim undangan massal langsung via WhatsApp',
        template: 'Bebas ganti pilihan tema dan variasi warna tanpa batas',
        animasi: 'Efek animasi transisi premium di setiap elemen tema',
        qr_code: 'Scan QR Code check-in tamu undangan secara praktis di hari H',
        layar_sapa: 'Layar sambutan khusus untuk menyambut tamu VIP secara interaktif',
        partikel: 'Efek partikel visual (daun gugur, salju, sakura, dll) di tema',
        video_album: 'Koleksi album video prewedding tanpa batas dari YouTube',
    };

    const getFeatureDesc = (feature) => {
        return feature.description || FEATURE_DESCS[feature.slug] || `Fitur detail untuk ${feature.name}`;
    };

    // Build feature access map: { planId: { featureId: is_enabled } }
    const planFeatureMap = {};
    plans.forEach(plan => {
        planFeatureMap[plan.id] = {};
        (plan.feature_access || []).forEach(fa => {
            planFeatureMap[plan.id][fa.feature_id] = fa.is_enabled;
        });
    });

    // Group features by custom category
    const BASIC_SLUGS = [
        'opening', 'bride_groom', 'event', 'gallery', 
        'closing', 'guestbook', 'cover', 'guest', 
        'rsvp', 'template', 'dresscode', 'music'
    ];

    const PREMIUM_SECTION_SLUGS = [
        'love_story', 'bank', 'turut_mengundang', 'bride_groom_detail', 'video_wedding', 'video_album', 'save_the_date'
    ];

    const featuresByCategory = {
        'FITUR UTAMA & DASAR': [],
        'FITUR PREMIUM - SECTION': [],
        'FITUR PREMIUM - PENGATURAN & LAINNYA': []
    };

    (features || []).forEach(f => {
        if (BASIC_SLUGS.includes(f.slug)) {
            featuresByCategory['FITUR UTAMA & DASAR'].push(f);
        } else if (PREMIUM_SECTION_SLUGS.includes(f.slug)) {
            featuresByCategory['FITUR PREMIUM - SECTION'].push(f);
        } else {
            featuresByCategory['FITUR PREMIUM - PENGATURAN & LAINNYA'].push(f);
        }
    });

    const totalFeatures = (features || []).length;

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

    const getSocialLinkInfo = (platform, value) => {
        let href = value;
        let label = platform.toUpperCase();
        let displayValue = value;
        let iconSvg = null;

        const cleanValue = value.startsWith('@') ? value.slice(1) : value;

        switch (platform.toLowerCase()) {
            case 'instagram':
                href = value.startsWith('http') ? value : `https://instagram.com/${cleanValue}`;
                label = 'Instagram';
                displayValue = value.startsWith('@') ? value : `@${value}`;
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
                    </svg>
                );
                break;
            case 'tiktok':
                href = value.startsWith('http') ? value : `https://tiktok.com/@${cleanValue}`;
                label = 'TikTok';
                displayValue = value.startsWith('@') ? value : `@${value}`;
                iconSvg = (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/>
                    </svg>
                );
                break;
            case 'facebook':
                href = value.startsWith('http') ? value : `https://facebook.com/${cleanValue}`;
                label = 'Facebook';
                iconSvg = (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                );
                break;
            case 'telegram':
                href = value.startsWith('http') ? value : `https://t.me/${cleanValue}`;
                label = 'Telegram';
                displayValue = value.startsWith('@') ? value : `@${value}`;
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                );
                break;
            case 'youtube':
                href = value.startsWith('http') ? value : `https://youtube.com/${cleanValue}`;
                label = 'YouTube';
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                );
                break;
            case 'whatsapp':
                href = getWhatsappLink(value);
                label = 'WhatsApp';
                iconSvg = (
                    <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" className="w-5.5 h-5.5" style={{ flexShrink: 0 }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                );
                break;
            case 'email':
                href = `mailto:${value}`;
                label = 'Email';
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                );
                break;
            case 'phone':
                href = `tel:${value}`;
                label = 'Telepon';
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                );
                break;
            default:
                iconSvg = (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                );
        }

        return { href, label, displayValue, iconSvg };
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

    // Scroll listener
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);

    // Rotating word animation
    useEffect(() => {
        const timer = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIdx(i => (i + 1) % ROTATING_WORDS.length);
                setWordVisible(true);
            }, 300);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    // Load liked themes from localStorage
    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('likedThemes') || '{}');
            setLikedThemes(stored);
        } catch {}
    }, []);

    const handleLike = async (theme) => {
        const isLiked = likedThemes[theme.id];
        const next = { ...likedThemes };
        isLiked ? delete next[theme.id] : (next[theme.id] = true);
        localStorage.setItem('likedThemes', JSON.stringify(next));
        setLikedThemes(next);
        const base = (theme.base_likes || 0) + (theme.real_likes || 0);
        setLikes(prev => ({ ...prev, [theme.id]: (prev[theme.id] ?? base) + (isLiked ? -1 : 1) }));
        try {
            const res = await fetch(`/theme/${theme.id}/like`, {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ liked: !isLiked })
            });
            const data = await res.json();
            if (data.success) setLikes(prev => ({ ...prev, [theme.id]: data.likes }));
        } catch {}
    };

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    const getThemesUrl = () => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/r/')) return `/r/${reseller.ref}/themes`;
        return '/katalog-tema';
    };

    const getCardsUrl = () => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/r/')) return `/r/${reseller.ref}/themes?tab=kartu`;
        return '/katalog-kartu';
    };

    const getFaqUrl = () => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/r/')) return `/r/${reseller.ref}/faq`;
        return '/faq';
    };

    const registerUrl = `${reseller.reseller_url || ''}/register?ref=${reseller.ref}`;
    const loginUrl = `${reseller.reseller_url || ''}/login`;

    const siteTitle = reseller.site_title || `${reseller.brand_name} — Undangan Digital Premium`;
    const siteMotto = reseller.site_motto || 'Buat undangan pernikahan digital premium dengan cepat, mudah, dan elegan.';

    /* CSS variables injected inline */
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

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={siteMotto} />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={siteMotto} />
                {reseller.brand_logo && <meta property="og:image" content={reseller.brand_logo} />}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
                <style>{cssVars}</style>
                <style>{landingStyles}</style>
            </Head>

            {/* ══════════════ NAVBAR ══════════════ */}
            <nav className={`rl-nav ${scrolled ? 'rl-nav--scrolled' : ''}`}>
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

            {/* ══════════════ HERO ══════════════ */}
            <section className="rl-hero">
                {/* Background orbs */}
                <div className="rl-hero__orb rl-hero__orb--1" />
                <div className="rl-hero__orb rl-hero__orb--2" />
                <div className="rl-hero__orb rl-hero__orb--3" />

                {/* Decorative grid */}
                <div className="rl-hero__grid" />

                <div className="rl-hero__content">
                    <div className="rl-hero__badge">
                        <span className="rl-hero__badge-dot" />
                        Platform Undangan Digital Terpercaya
                    </div>

                    <h1 className="rl-hero__heading">
                        Undangan Digital
                        <span className="rl-hero__heading-sub">
                            <span className="rl-hero__rotating-word" style={{ opacity: wordVisible ? 1 : 0 }}>
                                {ROTATING_WORDS[wordIdx]}
                            </span>
                            <span className="rl-hero__heading-premium"> Premium</span>
                        </span>
                    </h1>

                    <p className="rl-hero__desc">
                        Buat undangan pernikahan digital yang elegan dan berkesan dalam hitungan menit.
                        Desain premium, fitur lengkap, langsung bisa dibagikan ke semua tamu.
                    </p>

                    <div className="rl-hero__cta-group">
                        <a href={registerUrl} className="rl-cta-btn rl-cta-btn--primary">
                            <Svg d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" size={18} color="currentColor" />
                            Buat Undangan Gratis
                        </a>
                        <a href="#preview" className="rl-cta-btn rl-cta-btn--outline">
                            <Svg d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={18} color="currentColor" />
                            Lihat Contoh Tema
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

                {/* Phone mockup */}
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
                    {/* Floating badges */}
                    <div className="rl-phone__badge rl-phone__badge--1">
                        <span style={{ fontSize: 18 }}>✨</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Siap dalam 5 menit</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Langsung bisa dibagikan</div>
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

            {/* ══════════════ STATS BAR ══════════════ */}
            <section className="rl-stats">
                <div className="rl-stats__inner">
                    {[
                        { val: `${themes.length || 20}+`, label: 'Tema Tersedia', icon: '🎨' },
                        { val: '1.200+', label: 'Undangan Dibuat', icon: '💌' },
                        { val: '5 Menit', label: 'Waktu Pembuatan', icon: '⚡' },
                        { val: '24/7', label: 'Selalu Online', icon: '🌐' },
                        { val: '100%', label: 'Mobile Friendly', icon: '📱' },
                    ].map((s, i) => (
                        <div key={i} className="rl-stats__item">
                            <span className="rl-stats__icon">{s.icon}</span>
                            <div className="rl-stats__val">{s.val}</div>
                            <div className="rl-stats__label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════ HOW IT WORKS ══════════════ */}
            <section className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Cara Kerja</span>
                        <h2 className="rl-section__title">Mudah & Cepat dalam 3 Langkah</h2>
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

            {/* ══════════════ FEATURES ══════════════ */}
            <section className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Fitur Unggulan</span>
                        <h2 className="rl-section__title">Semua yang Anda Butuhkan Ada di Sini</h2>
                        <p className="rl-section__desc">Fitur-fitur premium yang membuat undangan digital Anda tampil beda dan berkesan.</p>
                    </div>
                    <div className="rl-features">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="rl-feature-card">
                                <div className="rl-feature-card__icon">
                                    <Svg d={f.icon} size={24} color="var(--accent)" />
                                </div>
                                <h3 className="rl-feature-card__title">{f.title}</h3>
                                <p className="rl-feature-card__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ THEME SHOWCASE ══════════════ */}
            <section id="preview" className="rl-section rl-section--alt">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Koleksi Desain</span>
                        <h2 className="rl-section__title">Pilih Desain Sempurna untuk Anda</h2>
                        <p className="rl-section__desc">Koleksi tema undangan digital elegan premium yang siap digunakan. Klik untuk melihat preview langsung.</p>
                    </div>

                    {/* Overhauled Filters & Search Bar */}
                    {themes.length > 0 && (
                        <div className="rl-filter-panel">
                            <div className="rl-filter-row">
                                {/* Search Box */}
                                <div className="rl-filter-search-container">
                                    <svg style={{
                                        position: 'absolute',
                                        left: '0.85rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '16px',
                                        height: '16px',
                                        color: 'var(--text-muted)'
                                    }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Cari tema..."
                                        className="rl-filter-search-input"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="rl-filter-controls">
                                    {/* Category Select Dropdown */}
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
                                                <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {selectedCategories.length === 0 ? 'Kategori' : `Kategori (${selectedCategories.length})`}
                                                </span>
                                            </div>
                                            <svg style={{
                                                width: '12px',
                                                height: '12px',
                                                flexShrink: 0,
                                                transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s'
                                            }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isCategoryDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{
                                                background: T.isDark ? '#1e293b' : '#ffffff',
                                                border: '1.5px solid ' + (T.isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
                                            }}>
                                                <div className="rl-filter-dropdown-menu-header">
                                                    <span className="rl-filter-dropdown-menu-title">Kategori</span>
                                                    {selectedCategories.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={clearCategories}
                                                            className="rl-filter-dropdown-menu-reset"
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {categories.map(cat => {
                                                        const isChecked = selectedCategories.includes(cat);
                                                        return (
                                                            <label
                                                                key={cat}
                                                                className="rl-filter-checkbox-label"
                                                                style={{
                                                                    color: isChecked ? 'var(--accent)' : 'var(--text-secondary)',
                                                                    background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleCategory(cat)}
                                                                    className="rl-filter-checkbox-input"
                                                                />
                                                                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Event Types Select Dropdown */}
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
                                                <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {selectedTypes.length === 0 ? 'Acara' : `Acara (${selectedTypes.length})`}
                                                </span>
                                            </div>
                                            <svg style={{
                                                width: '12px',
                                                height: '12px',
                                                flexShrink: 0,
                                                transform: isTypeDropdownOpen ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s'
                                            }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isTypeDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{
                                                background: T.isDark ? '#1e293b' : '#ffffff',
                                                border: '1.5px solid ' + (T.isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
                                            }}>
                                                <div className="rl-filter-dropdown-menu-header">
                                                    <span className="rl-filter-dropdown-menu-title">Tipe Acara</span>
                                                    {selectedTypes.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={clearTypes}
                                                            className="rl-filter-dropdown-menu-reset"
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {eventTypesWithCount.map(type => {
                                                        const isChecked = selectedTypes.includes(type.key);
                                                        return (
                                                            <label
                                                                key={type.key}
                                                                className="rl-filter-checkbox-label"
                                                                style={{
                                                                    color: isChecked ? 'var(--accent)' : 'var(--text-secondary)',
                                                                    background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleType(type.key)}
                                                                    className="rl-filter-checkbox-input"
                                                                />
                                                                <span>{type.label}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="rl-filter-dropdown-wrapper" ref={sortDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (isSortDropdownOpen ? 'var(--accent)' : 'var(--card-border)'),
                                                background: isSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: isSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                flexShrink: 0
                                            }}
                                            title="Urutkan Desain"
                                        >
                                            <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>

                                        {isSortDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{
                                                background: T.isDark ? '#1e293b' : '#ffffff',
                                                border: '1.5px solid ' + (T.isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
                                            }}>
                                                <div className="rl-filter-dropdown-menu-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                                                    <span className="rl-filter-dropdown-menu-title">Urutkan</span>
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {[
                                                        { key: 'terbaru', label: 'Terbaru' },
                                                        { key: 'populer', label: 'Terpopuler' },
                                                        { key: 'disukai', label: 'Terfavorit' }
                                                    ].map(opt => {
                                                        const isActive = sortThemeKey === opt.key;
                                                        return (
                                                            <button
                                                                key={opt.key}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSortThemeKey(opt.key);
                                                                    setIsSortDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    padding: '0.4rem 0.5rem',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.2s',
                                                                    border: 'none',
                                                                    background: isActive ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                                                                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                                                    textAlign: 'left',
                                                                    margin: '2px 0'
                                                                }}
                                                            >
                                                                <span>{opt.label}</span>
                                                                {isActive && (
                                                                    <svg style={{ width: '14px', height: '14px', color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
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

                {/* Themes List (Undangan Digital) */}
                {filteredThemes.length > 0 ? (
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
                                        <ThemePreviewCard 
                                            theme={theme}
                                            reseller={reseller}
                                        />
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
                ) : (
                    <div className="rl-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Belum ada tema dalam kategori ini atau tidak ada hasil pencarian yang cocok.
                    </div>
                )}
            </section>

            {/* ══════════════ GREETING CARD SHOWCASE ══════════════ */}
            {greetingCards.length > 0 && (
                <section id="preview-kartu" className="rl-section">
                    <div className="rl-container">
                        <div className="rl-section__header">
                            <span className="rl-section__tag" style={{ background: 'var(--accent)', color: '#fff' }}>Koleksi Kartu</span>
                            <h2 className="rl-section__title">Koleksi Kartu Ucapan Premium</h2>
                            <p className="rl-section__desc">Kirimkan ucapan spesial dengan animasi, musik, dan efek interaktif memukau untuk berbagai momen penting Anda. Klik untuk melihat preview.</p>
                        </div>

                        {/* Filters & Search Bar for Cards */}
                        <div className="rl-filter-panel">
                            <div className="rl-filter-row">
                                {/* Search Box */}
                                <div className="rl-filter-search-container">
                                    <svg style={{
                                        position: 'absolute',
                                        left: '0.85rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: '16px',
                                        height: '16px',
                                        color: 'var(--text-muted)'
                                    }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={cardSearchQuery}
                                        onChange={e => setCardSearchQuery(e.target.value)}
                                        placeholder="Cari kartu..."
                                        className="rl-filter-search-input"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="rl-filter-controls">
                                    {/* Event Types Select Dropdown */}
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
                                                <svg style={{ width: '14px', height: '14px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {cardSelectedTypes.length === 0 ? 'Acara' : `Acara (${cardSelectedTypes.length})`}
                                                </span>
                                            </div>
                                            <svg style={{
                                                width: '12px',
                                                height: '12px',
                                                flexShrink: 0,
                                                transform: isCardTypeDropdownOpen ? 'rotate(180deg)' : 'none',
                                                transition: 'transform 0.2s'
                                            }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {isCardTypeDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{
                                                background: T.isDark ? '#1e293b' : '#ffffff',
                                                border: '1.5px solid ' + (T.isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
                                            }}>
                                                <div className="rl-filter-dropdown-menu-header">
                                                    <span className="rl-filter-dropdown-menu-title">Tipe Acara</span>
                                                    {cardSelectedTypes.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={clearCardTypes}
                                                            className="rl-filter-dropdown-menu-reset"
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {cardTypesWithCount.map(type => {
                                                        const isChecked = cardSelectedTypes.includes(type.key);
                                                        return (
                                                            <label
                                                                key={type.key}
                                                                className="rl-filter-checkbox-label"
                                                                style={{
                                                                    color: isChecked ? 'var(--accent)' : 'var(--text-secondary)',
                                                                    background: isChecked ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleCardType(type.key)}
                                                                    className="rl-filter-checkbox-input"
                                                                />
                                                                <span>{type.label}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="rl-filter-dropdown-wrapper" ref={cardSortDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCardSortDropdownOpen(!isCardSortDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (isCardSortDropdownOpen ? 'var(--accent)' : 'var(--card-border)'),
                                                background: isCardSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: isCardSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                flexShrink: 0
                                            }}
                                            title="Urutkan Desain"
                                        >
                                            <svg style={{ width: '16px', height: '16px', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                            </svg>
                                        </button>

                                        {isCardSortDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu" style={{
                                                background: T.isDark ? '#1e293b' : '#ffffff',
                                                border: '1.5px solid ' + (T.isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'),
                                            }}>
                                                <div className="rl-filter-dropdown-menu-header" style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                                                    <span className="rl-filter-dropdown-menu-title">Urutkan</span>
                                                </div>
                                                <div className="rl-filter-dropdown-list">
                                                    {[
                                                        { key: 'terbaru', label: 'Terbaru' },
                                                        { key: 'populer', label: 'Terpopuler' },
                                                        { key: 'disukai', label: 'Terfavorit' }
                                                    ].map(opt => {
                                                        const isActive = cardSortKey === opt.key;
                                                        return (
                                                            <button
                                                                key={opt.key}
                                                                type="button"
                                                                onClick={() => {
                                                                    setCardSortKey(opt.key);
                                                                    setIsCardSortDropdownOpen(false);
                                                                }}
                                                                style={{
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    padding: '0.4rem 0.5rem',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    cursor: 'pointer',
                                                                    transition: 'background 0.2s',
                                                                    border: 'none',
                                                                    background: isActive ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                                                                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                                                    textAlign: 'left',
                                                                    margin: '2px 0'
                                                                }}
                                                            >
                                                                <span>{opt.label}</span>
                                                                {isActive && (
                                                                    <svg style={{ width: '14px', height: '14px', color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                )}
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
                        <div className="rl-themes-scroll-wrap">
                            <div className="rl-themes-scroll" id="cards-scroll">
                                {sortedCards.map(card => (
                                    <div key={card.id} className="w-[240px] sm:w-[260px] flex-shrink-0">
                                        <GreetingCardPreviewCard 
                                            theme={card}
                                            reseller={reseller}
                                            onUse={handleUseCard}
                                            typeOptions={greetingCardTypeOptions}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="rl-themes-scroll-controls">
                                <button onClick={() => document.getElementById('cards-scroll')?.scrollBy({ left: -280, behavior: 'smooth' })} className="rl-scroll-btn">←</button>
                                <Link href={getCardsUrl()} className="rl-btn rl-btn--accent-outline">Lihat Semua Kartu →</Link>
                                <button onClick={() => document.getElementById('cards-scroll')?.scrollBy({ left: 280, behavior: 'smooth' })} className="rl-scroll-btn">→</button>
                            </div>
                        </div>
                    ) : (
                        <div className="rl-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            Belum ada kartu ucapan dalam tipe ini atau tidak ada hasil pencarian yang cocok.
                        </div>
                    )}
                </section>
            )}

            {/* ══════════════ TESTIMONIALS ══════════════ */}
            <section className="rl-section">
                <div className="rl-container">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">Testimoni</span>
                        <h2 className="rl-section__title">Dipercaya Ribuan Pasangan Bahagia</h2>
                        <p className="rl-section__desc">Lihat apa kata mereka yang sudah menggunakan layanan kami.</p>
                    </div>
                </div>
                <div className="rl-marquee-wrap">
                    <div className="rl-marquee" ref={marqueeRef}>
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                            <div key={i} className="rl-testi-card">
                                <div className="rl-testi-card__stars">
                                    {[...Array(t.stars)].map((_, j) => <StarIcon key={j} />)}
                                </div>
                                <p className="rl-testi-card__text">"{t.text}"</p>
                                <div className="rl-testi-card__author">
                                    <div className="rl-testi-card__avatar">
                                        {t.name.split(' & ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="rl-testi-card__name">{t.name}</div>
                                        <div className="rl-testi-card__city">{t.city}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════ PRICING ══════════════ */}
            {plans.length > 0 && (
                <section className="rl-section rl-section--alt">
                    <div className="rl-container">
                        <div className="rl-section__header">
                            <span className="rl-section__tag">Harga & Paket</span>
                            <h2 className="rl-section__title">Pilih Paket yang Sesuai</h2>
                            <p className="rl-section__desc">Mulai gratis, upgrade kapan saja sesuai kebutuhan Anda.</p>
                        </div>
                        <div className="rl-pricing">
                            {plans.map((plan, i) => {
                                const meta = planMeta[plan.slug] || planMeta.silver;
                                return (
                                    <div key={i} className={`rl-plan ${meta.popular ? 'rl-plan--popular' : ''}`}
                                        style={{ '--plan-color': meta.color, '--plan-glow': meta.glow }}>
                                        {meta.popular && <div className="rl-plan__popular-badge">⭐ Paling Populer</div>}
                                        <div className="rl-plan__name">{plan.name}</div>
                                        <div className="rl-plan__price">
                                            {plan.price > 0 ? formatRp(plan.price) : <span style={{ color: '#4ade80' }}>Gratis</span>}
                                            {(plan.duration_days > 0 || plan.slug === 'free') && <span className="rl-plan__duration"> / {plan.slug === 'free' ? '5 hari' : `${plan.duration_days} hari`}</span>}
                                        </div>
                                        <div className="rl-plan__divider" />
                                        <ul className="rl-plan__features">
                                            <li><Svg d="M4.5 12.75l6 6 9-13.5" size={16} color={meta.color} /> Max <strong>{plan.max_guests?.toLocaleString()}</strong> tamu</li>
                                            <li><Svg d="M4.5 12.75l6 6 9-13.5" size={16} color={meta.color} /> Max <strong>{plan.max_galleries}</strong> foto galeri</li>
                                            {plan.enable_rsvp && <li><Svg d="M4.5 12.75l6 6 9-13.5" size={16} color={meta.color} /> Fitur RSVP</li>}
                                            {plan.enable_qr_code && <li><Svg d="M4.5 12.75l6 6 9-13.5" size={16} color={meta.color} /> QR Code Check-in</li>}
                                            {plan.enable_digital_envelope && <li><Svg d="M4.5 12.75l6 6 9-13.5" size={16} color={meta.color} /> Amplop Digital</li>}
                                        </ul>
                                        <a href={registerUrl} className="rl-plan__btn">{meta.label}</a>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature Comparison Toggle */}
                        {totalFeatures > 0 && (
                            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                <button type="button" onClick={() => setShowComparison(!showComparison)} className="rl-btn rl-btn--accent-outline" style={{ display: 'inline-flex', padding: '0.75rem 2rem', cursor: 'pointer', background: 'transparent' }}>
                                    {showComparison ? 'Sembunyikan' : 'Lihat'} Perbandingan Fitur Detail
                                </button>
                            </div>
                        )}

                        {/* Feature Comparison Table */}
                        {showComparison && totalFeatures > 0 && (
                            <div className="rl-comparison-table-wrap" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem', paddingRight: '0.5rem' }}>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                        <input
                                            type="checkbox"
                                            checked={showFeatureDetails}
                                            onChange={(e) => setShowFeatureDetails(e.target.checked)}
                                            style={{
                                                accentColor: '#E5654B',
                                                width: '16px',
                                                height: '16px',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        Tampilkan Detail Deskripsi Fitur
                                    </label>
                                </div>
                                <table className="rl-comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Fitur</th>
                                            {showFeatureDetails && (
                                                <th style={{ textAlign: 'left', width: '240px', minWidth: '220px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>Detail Fitur</th>
                                            )}
                                            {plans.map(plan => (
                                                <th key={plan.id}>{plan.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Quota rows */}
                                        <tr className="rl-comparison-cat-row">
                                            <td colSpan={showFeatureDetails ? plans.length + 2 : plans.length + 1}>
                                                <span className="rl-comparison-cat-label">Kuota & Batasan</span>
                                            </td>
                                        </tr>
                                        <tr className="rl-comparison-row">
                                            <td>Jumlah Tamu</td>
                                            {showFeatureDetails && (
                                                <td style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', width: '240px', minWidth: '220px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    Batas maksimal jumlah tamu yang dapat diundang
                                                </td>
                                            )}
                                            {plans.map(plan => (
                                                <td key={plan.id} style={{ fontWeight: 700 }}>{plan.max_guests?.toLocaleString()}</td>
                                            ))}
                                        </tr>
                                        <tr className="rl-comparison-row">
                                            <td>Foto Galeri</td>
                                            {showFeatureDetails && (
                                                <td style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', width: '240px', minWidth: '220px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    Maksimal foto yang dapat diunggah ke galeri undangan
                                                </td>
                                            )}
                                            {plans.map(plan => (
                                                <td key={plan.id} style={{ fontWeight: 700 }}>{plan.max_galleries}</td>
                                            ))}
                                        </tr>
                                        <tr className="rl-comparison-row">
                                            <td>Durasi Aktif</td>
                                            {showFeatureDetails && (
                                                <td style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', width: '240px', minWidth: '220px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                    Masa aktif undangan digital setelah dibuat
                                                </td>
                                            )}
                                            {plans.map(plan => (
                                                <td key={plan.id} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {plan.slug === 'free' ? '5 hari (Trial)' : (plan.duration_days > 0 ? `${plan.duration_days} hari` : 'Selamanya (∞)')}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Feature rows by category */}
                                        {Object.entries(featuresByCategory).map(([category, catFeatures]) => (
                                            <Fragment key={category}>
                                                <tr className="rl-comparison-cat-row">
                                                    <td colSpan={showFeatureDetails ? plans.length + 2 : plans.length + 1}>
                                                        <span className="rl-comparison-cat-label">{category}</span>
                                                    </td>
                                                </tr>
                                                {catFeatures.map(feature => (
                                                    <tr key={feature.id} className="rl-comparison-row">
                                                        <td>
                                                            <div style={{ fontWeight: 600 }}>{feature.name}</div>
                                                            {!showFeatureDetails && (
                                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.4' }}>{getFeatureDesc(feature)}</div>
                                                            )}
                                                        </td>
                                                        {showFeatureDetails && (
                                                            <td style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', width: '240px', minWidth: '220px', maxWidth: '280px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                                {getFeatureDesc(feature)}
                                                            </td>
                                                        )}
                                                        {plans.map(plan => {
                                                            const enabled = plan.slug === 'free' ? true : planFeatureMap[plan.id]?.[feature.id];
                                                            return (
                                                                <td key={plan.id}>
                                                                    {enabled ? (
                                                                        <div className="rl-comparison-icon rl-comparison-icon--enabled">
                                                                            <svg style={{ width: '12px', height: '12px', stroke: '#ffffff', strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24" fill="none">
                                                                                <path d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="rl-comparison-icon rl-comparison-icon--disabled">
                                                                            <svg style={{ width: '10px', height: '10px', stroke: '#d1d5db', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24" fill="none">
                                                                                <path d="M6 18L18 6M6 6l12 12" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ══════════════ FAQ ══════════════ */}
            <section className="rl-section">
                <div className="rl-container rl-container--narrow">
                    <div className="rl-section__header">
                        <span className="rl-section__tag">FAQ</span>
                        <h2 className="rl-section__title">Pertanyaan yang Sering Ditanyakan</h2>
                    </div>
                    <div className="rl-faqs">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`rl-faq ${openFaq === i ? 'rl-faq--open' : ''}`}>
                                <button className="rl-faq__q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    {faq.q}
                                    <span className="rl-faq__icon">{openFaq === i ? '−' : '+'}</span>
                                </button>
                                <div className="rl-faq__a">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Link ke halaman FAQ interaktif */}
                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <Link href={getFaqUrl()} className="rl-btn rl-btn--accent-outline" style={{ display: 'inline-flex', padding: '0.75rem 2rem' }}>
                            Lihat Semua FAQ & Panduan Lengkap →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════ CTA BANNER ══════════════ */}
            <section className="rl-cta-section">
                <div className="rl-cta-section__orb rl-cta-section__orb--1" />
                <div className="rl-cta-section__orb rl-cta-section__orb--2" />
                <div className="rl-cta-section__content">
                    <div className="rl-cta-section__tag">🎊 Mulai Sekarang</div>
                    <h2 className="rl-cta-section__title">Siap Buat Undangan Digital Impian Anda?</h2>
                    <p className="rl-cta-section__desc">
                        Bergabung bersama ribuan pasangan yang sudah mempercayakan undangan spesial mereka kepada kami.
                        Gratis, mudah, dan hasilnya luar biasa!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={registerUrl} className="rl-cta-btn rl-cta-btn--primary rl-cta-btn--lg">
                            Buat Undangan Sekarang — Gratis!
                        </a>
                        <a href={getThemesUrl()} className="rl-cta-btn rl-cta-btn--outline">
                            Lihat Semua Tema
                        </a>
                        {hasContact && (
                            <button onClick={handleContactClick} className="rl-cta-btn rl-cta-btn--outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>
                                <svg className="w-5 h-5 mr-1 inline-block align-middle" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                                Hubungi Kami
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* ══════════════ FOOTER ══════════════ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__grid">
                        {/* Column 1: Brand Info */}
                        <div className="rl-footer__col">
                            <div className="rl-footer__brand">
                                {reseller.brand_logo ? (
                                    <img src={reseller.brand_logo} alt={reseller.brand_name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain' }} />
                                ) : (
                                    <div className="rl-footer__logo-placeholder">{reseller.brand_name?.charAt(0)}</div>
                                )}
                                <div>
                                    <div className="rl-footer__brand-name">{reseller.brand_name}</div>
                                    <div className="rl-footer__brand-tagline">Undangan Digital Premium</div>
                                </div>
                            </div>
                            <p className="rl-footer__desc-text">
                                {reseller.footer_description || 'Platform pembuatan undangan digital pernikahan premium yang cepat, mudah, dan elegan.'}
                            </p>
                            <div className="rl-footer__socials">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="Instagram">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="TikTok">
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="rl-footer__col">
                            <h4 className="rl-footer__title">Tautan Cepat</h4>
                            <div className="rl-footer__links-stack">
                                <a href={getThemesUrl()} className="rl-footer__link">Katalog Tema</a>
                                <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                                <a href={loginUrl} className="rl-footer__link">Masuk ke Akun</a>
                                <Link href={getFaqUrl()} className="rl-footer__link">FAQ & Panduan</Link>
                                {hasContact && (
                                    <button onClick={handleContactClick} className="rl-footer__link-btn">Hubungi Kami</button>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Contact Info */}
                        {hasContact && (
                            <div className="rl-footer__col">
                                <h4 className="rl-footer__title">Hubungi Kami</h4>
                                <div className="rl-footer__contacts">
                                    {reseller.footer_whatsapp && (
                                        <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                            <span>WhatsApp: {reseller.footer_whatsapp}</span>
                                        </a>
                                    )}
                                    {reseller.footer_phone && (
                                        <a href={`tel:${reseller.footer_phone}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                            <span>Telepon: {reseller.footer_phone}</span>
                                        </a>
                                    )}
                                    {reseller.footer_email && (
                                        <a href={`mailto:${reseller.footer_email}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                            <span>Email: {reseller.footer_email}</span>
                                        </a>
                                    )}
                                    {reseller.footer_address && (
                                        <div className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                            <span>{reseller.footer_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="rl-footer__bottom">
                        <div className="rl-footer__copy">
                            © {new Date().getFullYear()} {reseller.brand_name}. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            {hasContact && (
                <button className="rl-floating-contact" onClick={handleContactClick} title="Hubungi Kami">
                    <span className="rl-floating-contact__pulse" />
                    <span className="rl-floating-contact__icon">
                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                    </span>
                    <span className="rl-floating-contact__text">Hubungi Kami</span>
                </button>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="rl-modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="rl-modal-card" onClick={e => e.stopPropagation()}>
                        <button className="rl-modal-close" onClick={() => setShowContactModal(false)}>×</button>
                        <div className="rl-modal-header">
                            {reseller.brand_logo ? (
                                <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-modal-logo" />
                            ) : (
                                <div className="rl-modal-logo-placeholder">
                                    {reseller.brand_name?.charAt(0)}
                                </div>
                            )}
                            <h3 className="rl-modal-title">Hubungi {reseller.brand_name}</h3>
                            <p className="rl-modal-desc">
                                {reseller.footer_description || 'Silakan hubungi kami untuk informasi lebih lanjut seputar pembuatan undangan digital.'}
                            </p>
                        </div>
                        <div className="rl-modal-body">
                            {reseller.footer_whatsapp && (
                                <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-contact-row rl-contact-row--wa">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">WhatsApp Chat</span>
                                        <span className="rl-contact-value">{reseller.footer_whatsapp}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_phone && (
                                <a href={`tel:${reseller.footer_phone}`} className="rl-contact-row rl-contact-row--phone">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Telepon Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_phone}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_email && (
                                <a href={`mailto:${reseller.footer_email}`} className="rl-contact-row rl-contact-row--email">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Email Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_email}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.social_links && reseller.social_links.map((link, idx) => {
                                const { href, label, displayValue, iconSvg } = getSocialLinkInfo(link.platform, link.value);
                                return (
                                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className={`rl-contact-row rl-contact-row--${link.platform}`}>
                                        <div className="rl-contact-icon">
                                            {iconSvg}
                                        </div>
                                        <div className="rl-contact-info">
                                            <span className="rl-contact-label">{label}</span>
                                            <span className="rl-contact-value">{displayValue}</span>
                                        </div>
                                    </a>
                                );
                            })}
                            {reseller.footer_address && (
                                <div className="rl-contact-row rl-contact-row--address">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Alamat Kantor</span>
                                        <span className="rl-contact-value" style={{ whiteSpace: 'pre-wrap' }}>{reseller.footer_address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(reseller.footer_instagram || reseller.footer_tiktok) && (
                            <div className="rl-modal-footer">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="Instagram">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="TikTok">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────────────────────────────────
   CSS STYLES (inline string, injected via <style>)
───────────────────────────────────────────────────────── */
const landingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--section-base); color: var(--text-primary); }

/* ── NAVBAR ── */
.rl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: transparent;
    transition: all 0.35s ease;
}
.rl-nav--scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.2);
}
.rl-nav__inner {
    max-width: 1280px; margin: 0 auto; padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
}
.rl-nav__brand { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; }
.rl-nav__logo-img { width: 40px; height: 40px; border-radius: 12px; object-fit: contain; }
.rl-nav__logo-placeholder {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-nav__brand-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.rl-nav__actions { display: flex; align-items: center; gap: 0.75rem; }

/* ── BUTTONS ── */
.rl-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
.rl-btn--ghost { background: transparent; color: var(--text-secondary); }
.rl-btn--ghost:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
.rl-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-btn--accent:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }
.rl-btn--accent-outline { background: transparent; color: var(--accent); border: 1.5px solid var(--accent); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; }
.rl-btn--accent-outline:hover { background: rgba(var(--accent-rgb), 0.1); }

.rl-cta-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.875rem 2rem; border-radius: 14px; font-size: 1rem; font-weight: 700;
    text-decoration: none; transition: all 0.25s ease; cursor: pointer; border: none;
}
.rl-cta-btn--primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    color: #fff; box-shadow: 0 8px 30px rgba(var(--accent-rgb), 0.35);
}
.rl-cta-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(var(--accent-rgb), 0.5); }
.rl-cta-btn--outline {
    background: rgba(255,255,255,0.06); color: var(--text-primary);
    border: 1.5px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px);
}
.rl-cta-btn--outline:hover { background: rgba(255,255,255,0.1); }
.rl-cta-btn--lg { padding: 1rem 2.5rem; font-size: 1.05rem; border-radius: 16px; }

/* ── HERO ── */
.rl-hero {
    position: relative; min-height: 100vh; background: var(--hero-bg);
    display: flex; align-items: center; justify-content: space-between;
    gap: 3rem; padding: 7rem 2rem 4rem; max-width: 1280px; margin: 0 auto;
    overflow: visible;
}
.rl-hero__orb {
    position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
}
.rl-hero__orb--1 { width: 500px; height: 500px; background: rgba(var(--accent-rgb), 0.08); top: 0; left: -100px; }
.rl-hero__orb--2 { width: 400px; height: 400px; background: rgba(139,92,246,0.06); bottom: 0; right: -100px; }
.rl-hero__orb--3 { width: 300px; height: 300px; background: rgba(var(--accent-rgb), 0.05); top: 50%; right: 30%; }

.rl-hero__grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    pointer-events: none;
}

.rl-hero__content { position: relative; z-index: 1; flex: 1; max-width: 600px; }

.rl-hero__badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--tag-bg); color: var(--tag-color);
    border: 1px solid rgba(var(--accent-rgb), 0.2);
    padding: 0.375rem 1rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 600;
    margin-bottom: 1.5rem;
}
.rl-hero__badge-dot {
    width: 8px; height: 8px; border-radius: 50%; background: #4ade80;
    animation: pulse 2s infinite;
}
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.85); } }

.rl-hero__heading {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2.25rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.15;
    color: var(--text-primary); margin-bottom: 1.25rem;
}
.rl-hero__heading-sub { display: block; }
.rl-hero__rotating-word {
    color: var(--accent); transition: opacity 0.3s ease;
    display: inline-block;
}
.rl-hero__heading-premium { color: var(--text-secondary); }

.rl-hero__desc {
    font-size: 1.0625rem; line-height: 1.75; color: var(--text-secondary);
    margin-bottom: 2rem; max-width: 480px;
}
.rl-hero__cta-group { display: flex; gap: 0.875rem; flex-wrap: wrap; margin-bottom: 1.75rem; }
.rl-hero__perks { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.rl-hero__perk { display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; color: var(--text-muted); }

/* ── PHONE MOCKUP ── */
.rl-hero__mockup { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
@media (max-width: 900px) { .rl-hero__mockup { display: none; } .rl-hero { justify-content: center; text-align: center; } .rl-hero__cta-group, .rl-hero__perks { justify-content: center; } }

.rl-phone {
    width: 240px; height: 480px; background: rgba(255,255,255,0.06);
    border: 1.5px solid rgba(255,255,255,0.12); border-radius: 36px;
    position: relative; overflow: hidden;
    box-shadow: 0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset;
}
.rl-phone__screen { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 100%); }
.rl-phone__notch { width: 80px; height: 22px; background: rgba(0,0,0,0.5); border-radius: 0 0 16px 16px; margin: 0 auto; }
.rl-phone__content { padding: 12px; }
.rl-phone__card { background: rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; }
.rl-phone__card-img { height: 160px; background: linear-gradient(135deg, rgba(var(--accent-rgb),0.3), rgba(139,92,246,0.2)); }
.rl-phone__card-lines { padding: 12px; }
.rl-phone__card-line { height: 10px; background: rgba(255,255,255,0.15); border-radius: 100px; margin-bottom: 8px; }
.rl-phone__card-line--title { width: 70%; }
.rl-phone__card-line--sub { width: 50%; }
.rl-phone__card-line--date { width: 40%; background: rgba(var(--accent-rgb), 0.3); }
.rl-phone__card-btn { margin: 8px 12px 12px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); border-radius: 8px; }

.rl-phone__badge {
    position: absolute; background: rgba(255,255,255,0.08); backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 10px 14px;
    display: flex; align-items: center; gap: 10px; white-space: nowrap;
    animation: floatBadge 3s ease-in-out infinite;
}
.rl-phone__badge--1 { top: -20px; right: -60px; animation-delay: 0s; }
.rl-phone__badge--2 { bottom: 20px; left: -70px; animation-delay: 1.5s; }
@keyframes floatBadge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* ── STATS BAR ── */
.rl-stats {
    background: var(--section-alt);
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
}
.rl-stats__inner {
    max-width: 1280px; margin: 0 auto; padding: 2rem;
    display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap; gap: 1.5rem;
}
.rl-stats__item { text-align: center; }
.rl-stats__icon { font-size: 1.5rem; display: block; margin-bottom: 0.375rem; }
.rl-stats__val { font-size: 1.75rem; font-weight: 800; color: var(--accent); line-height: 1; }
.rl-stats__label { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; font-weight: 500; }

/* ── SECTIONS ── */
.rl-section { padding: 5rem 0; }
.rl-section--alt { background: var(--section-alt); }
.rl-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
.rl-container--narrow { max-width: 800px; }

.rl-section__header { text-align: center; margin-bottom: 3.5rem; }
.rl-section__tag {
    display: inline-block; background: var(--tag-bg); color: var(--accent);
    border: 1px solid rgba(var(--accent-rgb), 0.25); border-radius: 100px;
    padding: 0.25rem 1rem; font-size: 0.8125rem; font-weight: 700; letter-spacing: 0.03em;
    text-transform: uppercase; margin-bottom: 1rem;
}
.rl-section__title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: var(--text-primary);
    line-height: 1.25; margin-bottom: 1rem;
}
.rl-section__desc { font-size: 1rem; color: var(--text-secondary); max-width: 520px; margin: 0 auto; line-height: 1.7; }

/* ── HOW IT WORKS ── */
.rl-steps {
    display: flex; align-items: flex-start; justify-content: center;
    gap: 0; position: relative; flex-wrap: wrap;
}
.rl-step {
    flex: 1; min-width: 200px; max-width: 280px;
    background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 24px;
    padding: 2rem 1.5rem; text-align: center; position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
}
.rl-step:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
.rl-step__num {
    font-size: 3rem; font-weight: 900; color: rgba(var(--accent-rgb), 0.15);
    line-height: 1; position: absolute; top: 1rem; right: 1.25rem;
    font-family: 'Plus Jakarta Sans', sans-serif;
}
.rl-step__icon-wrap {
    width: 60px; height: 60px; border-radius: 18px;
    background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.2);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem;
}
.rl-step__title { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.625rem; }
.rl-step__desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }
.rl-step__arrow {
    position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
    font-size: 1.5rem; color: var(--accent); opacity: 0.5; z-index: 1;
}
@media (max-width: 768px) { .rl-steps { gap: 1rem; } .rl-step__arrow { display: none; } }
.rl-steps { gap: 2rem; }

/* ── FEATURES ── */
.rl-features {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem;
}
.rl-feature-card {
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 20px; padding: 1.75rem 1.5rem;
    transition: all 0.25s ease;
}
.rl-feature-card:hover { transform: translateY(-3px); border-color: rgba(var(--accent-rgb), 0.3); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }
.rl-feature-card__icon {
    width: 52px; height: 52px; border-radius: 15px;
    background: rgba(var(--accent-rgb), 0.1); border: 1px solid rgba(var(--accent-rgb), 0.15);
    display: flex; align-items: center; justify-content: center; margin-bottom: 1.125rem;
    transition: background 0.2s;
}
.rl-feature-card:hover .rl-feature-card__icon { background: rgba(var(--accent-rgb), 0.18); }
.rl-feature-card__title { font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
.rl-feature-card__desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }

/* ── THEME SHOWCASE ── */
.rl-themes-scroll-wrap { overflow: hidden; }
.rl-themes-scroll {
    display: flex; gap: 1.25rem; overflow-x: auto; padding: 0.5rem 2rem 1.5rem;
    scrollbar-width: none; -ms-overflow-style: none; scroll-snap-type: x mandatory;
}
.rl-themes-scroll::-webkit-scrollbar { display: none; }
.rl-themes-scroll-controls {
    display: flex; align-items: center; justify-content: center; gap: 1rem;
    padding: 1rem 2rem 0; max-width: 1280px; margin: 0 auto;
}
.rl-scroll-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--card-border);
    background: var(--card-bg); color: var(--text-primary); cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
    transition: all 0.2s;
}
.rl-scroll-btn:hover { border-color: var(--accent); color: var(--accent); }

.rl-theme-card {
    flex-shrink: 0; width: 200px; border-radius: 18px; overflow: hidden;
    background: var(--card-bg); border: 1px solid var(--card-border);
    scroll-snap-align: start; transition: all 0.25s ease;
}
.rl-theme-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.rl-theme-card__img-wrap { aspect-ratio: 3/4; position: relative; overflow: hidden; }
.rl-theme-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.rl-theme-card:hover .rl-theme-card__img { transform: scale(1.05); }
.rl-theme-card__img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); }
.rl-theme-card__overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,0.6);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.625rem;
    opacity: 0; transition: opacity 0.2s;
}
.rl-theme-card:hover .rl-theme-card__overlay { opacity: 1; }
.rl-theme-card__action-btn {
    display: inline-flex; align-items: center; gap: 0.375rem;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
    color: #fff; border: 1px solid rgba(255,255,255,0.2);
    padding: 0.5rem 1rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 600;
    text-decoration: none; transition: background 0.2s; white-space: nowrap;
}
.rl-theme-card__action-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); border-color: transparent; }
.rl-theme-card__action-btn:hover { background: rgba(255,255,255,0.25); }
.rl-theme-card__action-btn--accent:hover { filter: brightness(1.1); }
.rl-theme-card__badge {
    position: absolute; top: 10px; left: 10px; z-index: 2;
    padding: 0.2rem 0.6rem; border-radius: 100px; font-size: 0.6875rem; font-weight: 800;
}
.rl-theme-card__badge--premium { background: rgba(245,158,11,0.9); color: #fff; }
.rl-theme-card__badge--free { background: rgba(74,222,128,0.9); color: #14532d; }
.rl-theme-card__info { padding: 0.875rem; }
.rl-theme-card__name-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.25rem; }
.rl-theme-card__name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.rl-theme-card__cat { font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize; }

/* ── TESTIMONIALS (marquee) ── */
.rl-marquee-wrap { overflow: hidden; position: relative; padding: 0.5rem 0; }
.rl-marquee-wrap::before, .rl-marquee-wrap::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 2; pointer-events: none;
}
.rl-marquee-wrap::before { left: 0; background: linear-gradient(to right, var(--section-base), transparent); }
.rl-marquee-wrap::after { right: 0; background: linear-gradient(to left, var(--section-base), transparent); }
.rl-marquee {
    display: flex; gap: 1.25rem; width: max-content;
    animation: marquee 35s linear infinite;
}
.rl-marquee:hover { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.rl-testi-card {
    width: 300px; flex-shrink: 0;
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 20px; padding: 1.5rem;
}
.rl-testi-card__stars { display: flex; gap: 2px; margin-bottom: 0.875rem; }
.rl-testi-card__text { font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem; font-style: italic; }
.rl-testi-card__author { display: flex; align-items: center; gap: 0.75rem; }
.rl-testi-card__avatar {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff;
}
.rl-testi-card__name { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
.rl-testi-card__city { font-size: 0.78rem; color: var(--text-muted); }

/* ── PRICING ── */
.rl-pricing {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem;
}
.rl-plan {
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 24px; padding: 1.75rem 1.5rem; display: flex; flex-direction: column;
    position: relative; transition: all 0.25s ease;
}
.rl-plan:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
.rl-plan--popular {
    border-color: var(--plan-color, var(--accent));
    box-shadow: 0 0 0 1px var(--plan-color, var(--accent)), 0 20px 60px var(--plan-glow, rgba(245,158,11,0.2));
}
.rl-plan__popular-badge {
    position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
    background: linear-gradient(135deg, var(--plan-color, var(--accent)), var(--accent-dark));
    color: #fff; padding: 0.25rem 1.25rem; border-radius: 100px;
    font-size: 0.75rem; font-weight: 800; white-space: nowrap;
}
.rl-plan__name {
    font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;
    color: var(--plan-color, var(--accent)); margin-bottom: 0.875rem;
}
.rl-plan__price { font-size: 1.625rem; font-weight: 900; color: var(--text-primary); margin-bottom: 0.25rem; }
.rl-plan__duration { font-size: 0.875rem; font-weight: 400; color: var(--text-muted); }
.rl-plan__divider { height: 1px; background: var(--card-border); margin: 1.125rem 0; }
.rl-plan__features { list-style: none; display: flex; flex-direction: column; gap: 0.625rem; flex: 1; margin-bottom: 1.5rem; }
.rl-plan__features li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); }
.rl-plan__features strong { color: var(--text-primary); }
.rl-plan__btn {
    display: block; text-align: center; padding: 0.75rem; border-radius: 12px;
    background: linear-gradient(135deg, var(--plan-color, var(--accent)), var(--accent-dark));
    color: #fff; font-weight: 700; font-size: 0.9rem; text-decoration: none;
    transition: all 0.2s; margin-top: auto;
}
.rl-plan__btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* ── FAQ ── */
.rl-faqs { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-faq {
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 16px; overflow: hidden; transition: border-color 0.2s;
}
.rl-faq--open { border-color: rgba(var(--accent-rgb), 0.4); }
.rl-faq__q {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 1.5rem; background: none; border: none; cursor: pointer;
    font-size: 1rem; font-weight: 600; color: var(--text-primary); text-align: left;
    gap: 1rem;
}
.rl-faq__q:hover { color: var(--accent); }
.rl-faq__icon { font-size: 1.25rem; color: var(--accent); flex-shrink: 0; font-weight: 300; }
.rl-faq__a {
    max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease;
}
.rl-faq--open .rl-faq__a { max-height: 300px; }
.rl-faq__a p { padding: 0 1.5rem 1.25rem; font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.75; }

/* ── CTA SECTION ── */
.rl-cta-section {
    background: var(--hero-bg); position: relative; overflow: hidden;
    padding: 6rem 2rem; text-align: center;
}
.rl-cta-section__orb {
    position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
}
.rl-cta-section__orb--1 { width: 500px; height: 500px; background: rgba(var(--accent-rgb), 0.12); top: -100px; left: 10%; }
.rl-cta-section__orb--2 { width: 400px; height: 400px; background: rgba(139,92,246,0.08); bottom: -100px; right: 10%; }
.rl-cta-section__content { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; }
.rl-cta-section__tag {
    display: inline-block; background: var(--tag-bg); color: var(--tag-color);
    border: 1px solid rgba(var(--accent-rgb), 0.2); border-radius: 100px;
    padding: 0.375rem 1rem; font-size: 0.875rem; font-weight: 700; margin-bottom: 1.25rem;
}
.rl-cta-section__title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: var(--text-primary);
    margin-bottom: 1rem; line-height: 1.3;
}
.rl-cta-section__desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 2rem; }

/* ── FOOTER ── */
.rl-footer { background: var(--footer-bg); padding: 4.5rem 0 2.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
.rl-footer__inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
.rl-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 3.5rem; }
.rl-footer__col { display: flex; flex-direction: column; gap: 1.25rem; }
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-footer__brand-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: var(--text-muted); }
.rl-footer__desc-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; max-width: 320px; text-align: left; }
.rl-footer__socials { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.rl-footer__social-link {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border);
    display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
    transition: all 0.2s ease; background: var(--card-bg); text-decoration: none;
}
.rl-footer__social-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
.rl-footer__title { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
.rl-footer__links-stack { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-footer__link { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__link:hover { color: var(--accent); }
.rl-footer__link-btn { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; background: none; border: none; padding: 0; cursor: pointer; text-align: left; font-weight: inherit; font-family: inherit; }
.rl-footer__link-btn:hover { color: var(--accent); }
.rl-footer__contacts { display: flex; flex-direction: column; gap: 0.875rem; }
.rl-footer__contact-item { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__contact-item svg { flex-shrink: 0; margin-top: 0.15rem; }
.rl-footer__contact-item:hover { color: var(--text-primary); }
.rl-footer__bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
.rl-footer__copy { font-size: 0.8125rem; color: var(--text-muted); }

/* ── NAV HUBUNGI KAMI ── */
.rl-nav__contact-btn { display: inline-flex; }

/* ── FLOATING CONTACT ── */
.rl-floating-contact {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 90;
    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem;
    background: #25d366; color: #fff; border: none; border-radius: 100px;
    font-weight: 700; font-size: 0.875rem; cursor: pointer;
    box-shadow: 0 8px 30px rgba(37,211,102,0.4); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.rl-floating-contact:hover {
    transform: translateY(-4px) scale(1.03); box-shadow: 0 12px 35px rgba(37,211,102,0.5);
}
.rl-floating-contact__pulse {
    position: absolute; inset: 0; border-radius: 100px;
    box-shadow: 0 0 0 0 rgba(37,211,102,0.6);
    animation: rl-pulse-wa 2s infinite; pointer-events: none;
}
@keyframes rl-pulse-wa {
    0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
    70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
}
.rl-floating-contact__icon { display: flex; align-items: center; justify-content: center; }
.rl-floating-contact__text { font-family: 'Plus Jakarta Sans', sans-serif; }

/* ── MODAL ── */
.rl-modal-overlay {
    position: fixed; inset: 0; z-index: 200; background: rgba(8,13,24,0.7);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    animation: rl-fade-in 0.25s ease-out;
}
.rl-modal-card {
    background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
    width: 100%; max-width: 440px; border-radius: 24px; padding: 2.25rem;
    position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    animation: rl-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    color: #f1f5f9;
}
.rl-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem; width: 32px; height: 32px;
    border-radius: 50%; background: rgba(255,255,255,0.05); border: none;
    color: #94a3b8; font-size: 20px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
}
.rl-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }
.rl-modal-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.75rem; }
.rl-modal-logo { width: 56px; height: 56px; border-radius: 16px; object-fit: contain; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.1); padding: 4px; }
.rl-modal-logo-placeholder {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 1rem;
}
.rl-modal-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.01em; }
.rl-modal-desc { font-size: 0.875rem; color: #94a3b8; line-height: 1.5; }
.rl-modal-body { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-contact-row {
    display: flex; align-items: center; gap: 0.875rem; padding: 0.875rem 1.125rem;
    border-radius: 16px; text-decoration: none; border: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02); transition: all 0.2s ease;
}
.rl-contact-row:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }
.rl-contact-icon {
    width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.rl-contact-row--wa .rl-contact-icon { background: rgba(37,211,102,0.1); color: #25d366; }
.rl-contact-row--wa:hover { border-color: rgba(37,211,102,0.3); background: rgba(37,211,102,0.03); }
.rl-contact-row--phone .rl-contact-icon { background: rgba(56,189,248,0.1); color: #38bdf8; }
.rl-contact-row--phone:hover { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.03); }
.rl-contact-row--email .rl-contact-icon { background: rgba(129,140,248,0.1); color: #818cf8; }
.rl-contact-row--email:hover { border-color: rgba(129,140,248,0.3); background: rgba(129,140,248,0.03); }
.rl-contact-row--address { background: rgba(255,255,255,0.01); border-style: dashed; }
.rl-contact-row--address .rl-contact-icon { background: rgba(192,132,252,0.1); color: #c084fc; }
.rl-contact-info { display: flex; flex-direction: column; }
.rl-contact-label { font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
.rl-contact-value { font-size: 0.9375rem; color: #f1f5f9; font-weight: 700; margin-top: 0.125rem; text-align: left; }
.rl-modal-footer { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.75rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.25rem; }
.rl-social-icon {
    width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center; color: #94a3b8;
    transition: all 0.2s; border: 1px solid rgba(255,255,255,0.04);
}
.rl-social-icon:hover { color: #fff; background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); transform: scale(1.05); }

/* ── FILTERS & SEARCH BAR ── */
.rl-filter-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 2.5rem !important;
    width: 100%;
    max-width: 750px;
    margin-left: auto;
    margin-right: auto;
    background: var(--card-bg) !important;
    border: 1.5px solid var(--card-border) !important;
    border-radius: 20px !important;
    padding: 1.25rem !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.04) !important;
}
.rl-filter-row {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}
.rl-filter-search-container {
    position: relative;
    flex: 1;
    min-width: 240px;
}
.rl-filter-search-input {
    width: 100%;
    padding: 0.625rem 1rem 0.625rem 2.25rem !important;
    border-radius: 100px !important;
    border: 1.5px solid var(--card-border) !important;
    font-size: 0.8rem !important;
    background: var(--card-bg) !important;
    color: var(--text-primary) !important;
    outline: none;
    transition: border-color 0.2s;
}
.rl-filter-search-input:focus {
    border-color: var(--accent) !important;
}
.rl-filter-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.rl-filter-dropdown-wrapper {
    position: relative;
}
.rl-filter-btn {
    padding: 0.625rem 1.15rem;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    height: 38px;
    border-width: 1.5px;
    border-style: solid;
}
.rl-filter-dropdown-menu {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    width: 220px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 99;
    padding: 0.5rem;
}
.rl-filter-dropdown-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0.5rem 0.5rem;
    border-bottom: 1px solid var(--card-border);
}
.rl-filter-dropdown-menu-title {
    font-size: 0.6rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.rl-filter-dropdown-menu-reset {
    background: none;
    border: none;
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--accent);
    cursor: pointer;
}
.rl-filter-dropdown-list {
    max-height: 180px;
    overflow-y: auto;
    padding: 0.25rem 0;
}
.rl-filter-checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin: 2px 0;
}
.rl-filter-checkbox-input {
    accent-color: var(--accent);
    width: 13px;
    height: 13px;
    cursor: pointer;
}

@media (max-width: 640px) {
    .rl-filter-row {
        flex-direction: column;
        align-items: stretch;
    }
    .rl-filter-search-container {
        width: 100%;
    }
    .rl-filter-controls {
        width: 100%;
    }
    .rl-filter-dropdown-wrapper:not(:last-child) {
        flex: 1;
    }
    .rl-filter-btn {
        width: 100%;
        justify-content: space-between;
    }
    .rl-filter-dropdown-wrapper:first-of-type .rl-filter-dropdown-menu {
        left: 0;
        right: auto;
    }
}

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
    .rl-hero { padding: 7rem 2rem 3rem; }
    .rl-features { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
}
@media (max-width: 768px) {
    .rl-nav__inner { padding: 0.875rem 1.25rem; }
    .rl-hero { padding: 6rem 1.5rem 3rem; }
    .rl-stats__inner { padding: 1.5rem; }
    .rl-section { padding: 3.5rem 0; }
    .rl-container { padding: 0 1.25rem; }
    .rl-pricing { grid-template-columns: 1fr 1fr; }
    .rl-footer__grid { grid-template-columns: 1fr; gap: 2rem; }
    .rl-footer__col { align-items: center; text-align: center; }
    .rl-footer__links-stack { align-items: center; }
    .rl-footer__link-btn { text-align: center; }
    .rl-footer__contacts { align-items: center; }
    .rl-footer__contact-item { justify-content: center; }
    .rl-footer__desc-text { max-width: none; text-align: center; }
    .rl-footer__bottom { flex-direction: column; align-items: center; gap: 1rem; text-align: center; }
    .rl-nav__contact-btn { display: none; }
}
@media (max-width: 480px) {
    .rl-hero__heading { font-size: 1.9rem; }
    .rl-pricing { grid-template-columns: 1fr; }
    .rl-cta-btn { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
    .rl-features { grid-template-columns: 1fr; }
}

/* ── COMPARISON TABLE ── */
.rl-comparison-table-wrap {
    overflow-x: auto;
    position: relative;
    margin-top: 2.5rem;
    border-radius: 20px;
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.rl-comparison-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
}
.rl-comparison-table th, 
.rl-comparison-table td {
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--card-border);
    vertical-align: middle;
    font-size: 0.875rem;
}
.rl-comparison-table th {
    background: rgba(255,255,255,0.02);
    font-weight: 700;
    color: var(--text-primary);
}
.rl-comparison-table th:first-child {
    width: 280px;
    min-width: 180px;
}
.rl-comparison-table th:not(:first-child),
.rl-comparison-table td:not(:first-child) {
    text-align: center;
    min-width: 110px;
}

/* Category row style */
.rl-comparison-cat-row td {
    background: rgba(255, 255, 255, 0.05) !important;
    font-weight: 800;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent);
    padding: 0.625rem 1.25rem;
}

/* Sticky first column */
.rl-comparison-table th:first-child,
.rl-comparison-table td:first-child {
    position: sticky;
    left: 0;
    z-index: 10;
    background: var(--section-alt);
    border-right: 1px solid var(--card-border);
    box-shadow: 2px 0 5px -2px rgba(0,0,0,0.15);
}
/* Header first child sticky has higher z-index */
.rl-comparison-table th:first-child {
    z-index: 20;
    background: var(--section-alt);
}
/* Category row first cell is also sticky to anchor label */
.rl-comparison-cat-row td {
    position: sticky;
    left: 0;
    z-index: 10;
}

.rl-comparison-row:hover td {
    background: rgba(255,255,255,0.02);
}
.rl-comparison-row:hover td:first-child {
    background: var(--section-alt);
}

/* Icons */
.rl-comparison-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
    margin: 0 auto;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.rl-comparison-icon--enabled {
    background: linear-gradient(135deg, #FF8a65 0%, #E5654B 100%);
    box-shadow: 0 2px 6px rgba(229, 101, 75, 0.35);
}
.rl-comparison-icon--enabled:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(229, 101, 75, 0.55);
}
.rl-comparison-icon--disabled {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
}

/* Compact mobile styles */
@media (max-width: 640px) {
    .rl-comparison-table th, 
    .rl-comparison-table td {
        padding: 0.625rem 0.875rem;
        font-size: 0.8rem;
    }
    .rl-comparison-table th:first-child {
        width: 140px;
        min-width: 130px;
        max-width: 140px;
    }
    .rl-comparison-cat-row td {
        font-size: 0.7rem;
    }
    .rl-comparison-cat-label {
        left: 0.875rem;
    }
}
.rl-comparison-cat-label {
    position: sticky;
    left: 1.25rem;
    display: inline-flex;
    align-items: center;
    z-index: 10;
}
`;
