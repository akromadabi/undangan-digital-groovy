import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

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
export default function ResellerLanding({ reseller, plans = [], themes = [] }) {
    const T = THEMES_CFG[reseller?.template] || THEMES_CFG.default;

    const [scrolled, setScrolled] = useState(false);
    const [wordIdx, setWordIdx] = useState(0);
    const [wordVisible, setWordVisible] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);
    const [likes, setLikes] = useState({});
    const [likedThemes, setLikedThemes] = useState({});
    const marqueeRef = useRef(null);

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
                        <span className="rl-section__tag">Koleksi Tema</span>
                        <h2 className="rl-section__title">Pilih Tema yang Sempurna untuk Anda</h2>
                        <p className="rl-section__desc">Koleksi tema elegan dan modern yang siap digunakan. Klik untuk melihat preview langsung.</p>
                    </div>
                </div>

                {themes.length > 0 ? (
                    <div className="rl-themes-scroll-wrap">
                        <div className="rl-themes-scroll" id="themes-scroll">
                            {themes.map(theme => (
                                <div key={theme.id} className="rl-theme-card">
                                    <div className="rl-theme-card__img-wrap">
                                        {theme.thumbnail ? (
                                            <img src={getThumbnailUrl(theme.thumbnail)} alt={theme.name} className="rl-theme-card__img" />
                                        ) : (
                                            <div className="rl-theme-card__img-placeholder">
                                                <Svg d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" size={40} color="var(--text-muted)" />
                                            </div>
                                        )}
                                        <div className="rl-theme-card__overlay">
                                            <a href={theme.preview_url || '#'} target="_blank" rel="noreferrer" className="rl-theme-card__action-btn">
                                                <Svg d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" size={16} color="currentColor" />
                                                Preview
                                            </a>
                                            <a href={`${registerUrl}&theme=${theme.slug}`} className="rl-theme-card__action-btn rl-theme-card__action-btn--accent">
                                                <Svg d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" size={16} color="currentColor" />
                                                Pakai Tema
                                            </a>
                                        </div>
                                        <span className={`rl-theme-card__badge ${theme.is_premium ? 'rl-theme-card__badge--premium' : 'rl-theme-card__badge--free'}`}>
                                            {theme.is_premium ? 'PREMIUM' : 'GRATIS'}
                                        </span>
                                    </div>
                                    <div className="rl-theme-card__info">
                                        <div className="rl-theme-card__name-row">
                                            <h4 className="rl-theme-card__name">{theme.name}</h4>
                                            <AnimatedLikeButton
                                                count={likes[theme.id] ?? ((theme.base_likes || 0) + (theme.real_likes || 0))}
                                                liked={!!likedThemes[theme.id]}
                                                onClick={() => handleLike(theme)}
                                            />
                                        </div>
                                        <span className="rl-theme-card__cat">{theme.category || 'Umum'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="rl-themes-scroll-controls">
                            <button onClick={() => document.getElementById('themes-scroll')?.scrollBy({ left: -280, behavior: 'smooth' })} className="rl-scroll-btn">←</button>
                            <Link href={getThemesUrl()} className="rl-btn rl-btn--accent-outline">Lihat Semua Tema →</Link>
                            <button onClick={() => document.getElementById('themes-scroll')?.scrollBy({ left: 280, behavior: 'smooth' })} className="rl-scroll-btn">→</button>
                        </div>
                    </div>
                ) : (
                    <div className="rl-container" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        Tema sedang disiapkan...
                    </div>
                )}
            </section>

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
                                            {plan.duration_days > 0 && <span className="rl-plan__duration"> / {plan.duration_days} hari</span>}
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
                    </div>
                </div>
            </section>

            {/* ══════════════ FOOTER ══════════════ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__brand">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'contain' }} />
                        ) : (
                            <div className="rl-footer__logo-placeholder">{reseller.brand_name?.charAt(0)}</div>
                        )}
                        <div>
                            <div className="rl-footer__brand-name">{reseller.brand_name}</div>
                            <div className="rl-footer__brand-tagline">Undangan Digital Premium</div>
                        </div>
                    </div>
                    <div className="rl-footer__links">
                        <a href={getThemesUrl()} className="rl-footer__link">Katalog Tema</a>
                        <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                        <a href={loginUrl} className="rl-footer__link">Masuk</a>
                    </div>
                    <div className="rl-footer__copy">
                        © {new Date().getFullYear()} {reseller.brand_name}. Powered by <strong style={{ color: 'var(--accent)' }}>Groovy</strong>.
                    </div>
                </div>
            </footer>
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
.rl-footer { background: var(--footer-bg); padding: 2.5rem 0; border-top: 1px solid rgba(255,255,255,0.05); }
.rl-footer__inner {
    max-width: 1280px; margin: 0 auto; padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;
}
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 15px; color: #fff;
}
.rl-footer__brand-name { font-size: 0.9375rem; font-weight: 700; color: rgba(255,255,255,0.8); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
.rl-footer__links { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.rl-footer__link { font-size: 0.875rem; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.2s; }
.rl-footer__link:hover { color: var(--accent); }
.rl-footer__copy { font-size: 0.8125rem; color: rgba(255,255,255,0.3); }

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
    .rl-footer__inner { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 480px) {
    .rl-hero__heading { font-size: 1.9rem; }
    .rl-pricing { grid-template-columns: 1fr; }
    .rl-cta-btn { padding: 0.75rem 1.5rem; font-size: 0.9rem; }
    .rl-features { grid-template-columns: 1fr; }
}
`;
