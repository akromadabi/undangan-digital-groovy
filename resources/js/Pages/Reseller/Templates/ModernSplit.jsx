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
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" className="text-amber-500" style={{ color: 'var(--accent, #f59e0b)', display: 'inline-block', flexShrink: 0 }}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

/* ─────────────────────────────────────────────────────────
   CURATED OUTLINE ICON PACK (Modern SVGs)
   ───────────────────────────────────────────────────────── */
const ICON_PACK = {
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
};

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
];

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

const planMeta = {
    free:     { color: '#6b7280', glow: 'rgba(107,114,128,0.2)', label: 'Coba Gratis' },
    silver:   { color: '#64748b', glow: 'rgba(100,116,139,0.2)', label: 'Mulai Sekarang' },
    gold:     { color: '#d31124', glow: 'rgba(211,17,36,0.25)', label: 'Mulai Sekarang', popular: true },
    platinum: { color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)', label: 'Mulai Sekarang' },
};

const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export default function ModernSplit({ reseller, plans = [], themes = [], greetingCards = [], greetingCardTypeOptions = {}, features = [], sections = [], heroImage = null }) {
    const [previewConfig, setPreviewConfig] = useState(null);
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

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

    const getCompactDesc = (text) => {
        if (!text) return '';
        const longToShort = {
            // Steps
            'Buat akun dalam 30 detik. Tidak perlu kartu kredit.': 'Buat akun dalam 30 detik secara gratis.',
            'Buat akun dalam 30 detik. Tanpa kartu kredit.': 'Buat akun dalam 30 detik secara gratis.',
            'Pilih tema favorit, isi data mempelai, unggah foto, dan sesuaikan warna.': 'Pilih tema dan lengkapi data acara Anda.',
            'Pilih tema favorit dan isi data mempelai.': 'Pilih tema dan lengkapi data acara Anda.',
            'Kirim tautan undangan via WhatsApp, Instagram, atau media sosial lainnya.': 'Kirim link undangan via WhatsApp/Sosmed.',
            'Kirim link undangan via WhatsApp/Sosmed.': 'Kirim link undangan via WhatsApp/Sosmed.',
            // Features
            '20+ tema elegan pilihan — dari klasik, modern, minimalis hingga adat. Bebas pilih dan ganti kapan saja.': '20+ pilihan tema elegan & responsif.',
            'Tampilan sempurna di semua perangkat — smartphone, tablet, dan desktop. 100% responsif.': 'Tampilan sempurna di semua gadget.',
            'Tamu konfirmasi kehadiran langsung dari undangan. Check-in via QR Code di hari H.': 'Konfirmasi kehadiran & scan check-in.',
            'Bagikan tautan undangan langsung ke WhatsApp tamu dengan satu klik. Mudah dan cepat.': 'Kirim undangan instan sekali klik.',
            'Terima transfer hadiah digital dari tamu langsung via undangan. Daftar rekening & e-wallet.': 'Terima kado & transfer uang digital.',
            'Tidak ada batasan jumlah tamu yang bisa diundang. Cocok untuk acara kecil hingga ribuan tamu.': 'Undang tamu tanpa batasan kuota.'
        };
        return longToShort[text.trim()] || text;
    };

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

    const getThemePreviewImage = (theme) => {
        if (!theme) return null;
        if (theme.preview_images && theme.preview_images.length > 0) {
            return theme.preview_images[0].startsWith('http') || theme.preview_images[0].startsWith('/')
                ? theme.preview_images[0]
                : `/storage/${theme.preview_images[0]}`;
        }
        if (theme.thumbnail) {
            return theme.thumbnail.startsWith('http') || theme.thumbnail.startsWith('/')
                ? theme.thumbnail
                : `/storage/${theme.thumbnail}`;
        }
        return null;
    };

    const leftImg = getThemePreviewImage(themes[0]);
    const centerImg = getThemePreviewImage(themes[1] || themes[0]);
    const rightImg = getThemePreviewImage(themes[2] || themes[0]);

    // Color tokens tailored for the Modern-Split Crimson Red light theme (Abadikan.id reference)
    const T = {
        heroBg: 'linear-gradient(135deg, #d31124 0%, #e11d48 100%)',
        accent: '#d31124',
        accentDark: '#b91c1c',
        accentRgb: '211, 17, 36',
        navBg: 'rgba(255, 255, 255, 0.95)',
        sectionAlt: '#f9fafb',
        sectionBase: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: 'rgba(211, 17, 36, 0.1)',
        textPrimary: '#1f2937',
        textSecondary: '#4b5563',
        textMuted: '#9ca3af',
        footerBg: '#f9fafb',
        tagBg: 'rgba(211, 17, 36, 0.08)',
        tagColor: '#d31124',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        headingFontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        isDark: false
    };

    const cssVars = `
        :root {
            --hero-bg: ${T.heroBg};
            --accent: ${T.accent};
            --accent-dark: ${T.accentDark};
            --accent-rgb: ${T.accentRgb};
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
            --font-family: ${T.fontFamily};
            --heading-font-family: ${T.headingFontFamily};
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
    const [typedSubdomain, setTypedSubdomain] = useState('');
    const resellerHost = useMemo(() => {
        try {
            const url = new URL(reseller.reseller_url);
            return url.hostname;
        } catch(e) {
            return reseller.ref + '.undangan-digital.test';
        }
    }, [reseller.reseller_url, reseller.ref]);
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

    const sortedThemes = useMemo(() => {
        let list = [...filteredThemes];
        if (sortThemeKey === 'terbaru') {
            list.sort((a, b) => (b.id || 0) - (a.id || 0));
        } else if (sortThemeKey === 'populer') {
            list.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        } else if (sortThemeKey === 'disukai') {
            list.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        }
        return list;
    }, [filteredThemes, sortThemeKey]);

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

    const planFeatureMap = {};
    plans.forEach(plan => {
        planFeatureMap[plan.id] = {};
        (plan.feature_access || []).forEach(fa => {
            planFeatureMap[plan.id][fa.feature_id] = fa.is_enabled;
        });
    });

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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
                setWordVisible(true);
            }, 300);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const toggleLikeTheme = async (id, slug) => {
        const isLiked = likedThemes[id];
        setLikedThemes(prev => ({ ...prev, [id]: !isLiked }));
        setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + (isLiked ? -1 : 1) }));

        try {
            await axios.post(`/theme/${id}/like`);
        } catch (err) {
            // Rollback silently on error
            setLikedThemes(prev => ({ ...prev, [id]: isLiked }));
            setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + (isLiked ? 1 : -1) }));
        }
    };

    const toggleLikeCard = async (id) => {
        const isLiked = likedThemes[`card-${id}`];
        setLikedThemes(prev => ({ ...prev, [`card-${id}`]: !isLiked }));
        setLikes(prev => ({ ...prev, [`card-${id}`]: (prev[`card-${id}`] || 0) + (isLiked ? -1 : 1) }));

        try {
            await axios.post(`/greeting-card-template/${id}/like`);
        } catch (err) {
            setLikedThemes(prev => ({ ...prev, [`card-${id}`]: isLiked }));
            setLikes(prev => ({ ...prev, [`card-${id}`]: (prev[`card-${id}`] || 0) + (isLiked ? 1 : -1) }));
        }
    };

    const loginUrl = `${reseller.reseller_url}/login`;
    const registerUrl = `${reseller.reseller_url}/register`;

    const getThemesUrl = () => `${reseller.reseller_url}/katalog-tema`;
    const getFaqUrl = () => `${reseller.reseller_url}/faq`;

    const renderBanner = (c) => {
        if (bannerDismissed) return null;
        const text = c?.text || '🔥 Promo Spesial: Aktifkan paket premium hari ini & dapatkan diskon langsung hingga 50%!';
        const ctaText = c?.cta_text || 'Daftar Sekarang';
        const ctaLink = c?.cta_link || '#plans';
        const bgColor = c?.bg_color || 'linear-gradient(90deg, #E5654B 0%, #D55A42 100%)';
        const textColor = c?.text_color || '#ffffff';

        return (
            <div className="rl-ms-banner" style={{ background: bgColor, color: textColor }}>
                <PromoTextRenderer
                    text={text}
                    showCountdown={c?.show_countdown !== false}
                    durationHours={c?.countdown_duration || 19}
                    resellerRef={reseller.ref}
                />
                {ctaText && (
                    <a href={ctaLink} className="rl-ms-banner__cta" style={{ color: bgColor.includes('#') ? bgColor : '#E5654B' }}>
                        {ctaText}
                    </a>
                )}
                <button onClick={() => setBannerDismissed(true)} className="rl-ms-banner__close" title="Tutup">
                    &times;
                </button>
            </div>
        );
    };

    const renderMainBanner = (c) => {
        const variant = c?.variant || 'banner_card';
        const title = c?.title || 'Mulai Bisnis Undangan Digital Sendiri';
        const subtitle = c?.subtitle || 'White-Label Platform';
        const bannerImg = c?.banner_image || '/images/wedding_hero.png';
        const ctaLink = c?.cta_link || '#plans';
        const height = c?.height || 'medium';

        const getHeightPx = (h) => {
            switch (h) {
                case 'small': return '250px';
                case 'large': return '500px';
                case 'medium':
                default:
                    return '380px';
            }
        };

        const heightPx = getHeightPx(height);

        const activeList = activeSections.filter(s => s.active && s.key !== 'banner');
        const isFirst = activeList[0]?.key === 'main_banner';
        const topPaddingStyle = isFirst ? { paddingTop: '7.5rem' } : {};

        // Tablet dashboard mockups inside the split variant
        const DeviceMockups = () => (
            <div className="rl-device-mockups-container relative w-full max-w-[420px] mx-auto flex items-center justify-center pointer-events-none select-none" style={{ height: '320px' }}>
                {/* Glowing backdrop blob */}
                <div 
                    className="absolute w-[240px] h-[240px] rounded-full filter blur-[50px] opacity-20 animate-pulse" 
                    style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, zIndex: 0 }}
                />
                
                {/* Tablet Mockup (Dashboard) */}
                <div 
                    className="rl-mockup-tablet absolute w-[82%] h-[190px] left-0 top-[40px] rounded-[20px] bg-[#1e293b] border-[4px] border-[#334155] shadow-2xl overflow-hidden"
                    style={{ zIndex: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}
                >
                    <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#334155]" />
                    <div className="w-full h-full p-3 pt-5 bg-slate-900 overflow-hidden text-left flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                                <span className="text-[7px] font-bold text-slate-400 ml-1">Agency Dashboard</span>
                            </div>
                            <span className="text-[6px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 my-1">
                            <div className="bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
                                <div className="text-[5px] text-slate-400 font-bold">Total Sales</div>
                                <div className="text-[8px] font-black text-white mt-0.5">Rp 12.8M</div>
                            </div>
                            <div className="bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
                                <div className="text-[5px] text-slate-400 font-bold">Users</div>
                                <div className="text-[8px] font-black text-white mt-0.5">342 Clients</div>
                            </div>
                            <div className="bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
                                <div className="text-[5px] text-slate-400 font-bold">Active Sites</div>
                                <div className="text-[8px] font-black text-white mt-0.5">186 Sites</div>
                            </div>
                        </div>
                        <div className="text-[6px] text-slate-500 text-center font-bold">
                            White-Label Invitation Builder
                        </div>
                    </div>
                </div>

                {/* Overlapping Phone Mockup (User Invitation) */}
                <div 
                    className="rl-mockup-phone absolute w-[42%] h-[220px] right-0 bottom-[20px] rounded-[24px] bg-[#0f172a] border-[4px] border-[#1e293b] shadow-2xl overflow-hidden"
                    style={{ zIndex: 2, boxShadow: `0 20px 40px rgba(${T.accentRgb}, 0.25)` }}
                >
                    <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-8 h-2.5 rounded-full bg-[#1e293b] z-10" />
                    <div className="w-full h-full relative">
                        <img 
                            src={bannerImg} 
                            alt="Preview" 
                            className="w-full h-full object-cover object-center" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>
                </div>
            </div>
        );

        if (variant === 'banner_bg') {
            return (
                <section className="rl-main-banner-section py-8 px-4 md:px-8 max-w-7xl mx-auto" style={topPaddingStyle}>
                    <div 
                        className="relative rounded-[32px] overflow-hidden group transition-all duration-500 border border-slate-200/10"
                        style={{ 
                            height: heightPx,
                            boxShadow: `0 30px 65px -12px rgba(${T.accentRgb}, 0.15)`
                        }}
                    >
                        {/* Background Image */}
                        <img 
                            src={bannerImg} 
                            alt={title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-770 group-hover:scale-[1.03]" 
                        />
                        {/* Dark Vignette Overlay for maximum text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent z-10" />
                        
                        {/* Content */}
                        <div className="relative w-full h-full flex items-center p-6 md:p-14 z-20">
                            <div 
                                className="max-w-xl text-left p-6 md:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl space-y-4 md:space-y-6 transform transition-all duration-500 hover:scale-[1.01] hover:bg-white/12"
                            >
                                {subtitle && (
                                    <span 
                                        className="inline-block px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white animate-pulse" 
                                        style={{ background: T.accent, boxShadow: `0 4px 15px rgba(${T.accentRgb}, 0.25)` }}
                                    >
                                        {subtitle}
                                    </span>
                                )}
                                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight tracking-tight" style={{ fontFamily: 'var(--heading-font-family)' }}>
                                    {title}
                                </h2>
                                <div className="pt-2 flex flex-wrap gap-3">
                                    <a 
                                        href={ctaLink} 
                                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-white transition-all hover:scale-105 hover:shadow-xl"
                                        style={{ color: T.accent, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                                    >
                                        Mulai Sekarang
                                        <span className="text-base">&rarr;</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }

        if (variant === 'banner_split') {
            return (
                <section className="rl-main-banner-section py-16 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden" style={topPaddingStyle}>
                    <div className="rl-banner-split-grid items-center gap-12 lg:gap-16">
                        {/* Text Col */}
                        <div className="text-left space-y-6">
                            {subtitle && (
                                <span className="inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase" style={{ background: T.tagBg, color: T.accent }}>
                                    {subtitle}
                                </span>
                            )}
                            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: 'var(--heading-font-family)', color: T.textPrimary }}>
                                {title}
                            </h2>
                            
                            {/* Feature list pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${T.accentRgb}, 0.1)`, color: T.accent }}>
                                        <Svg d="M5 13l4 4L19 7" size={14} color="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700" style={{ color: T.textSecondary }}>Domain Kustom Sendiri</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${T.accentRgb}, 0.1)`, color: T.accent }}>
                                        <Svg d="M5 13l4 4L19 7" size={14} color="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700" style={{ color: T.textSecondary }}>Atur Harga Sesukamu</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${T.accentRgb}, 0.1)`, color: T.accent }}>
                                        <Svg d="M5 13l4 4L19 7" size={14} color="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700" style={{ color: T.textSecondary }}>Keuntungan 100% Milikmu</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${T.accentRgb}, 0.1)`, color: T.accent }}>
                                        <Svg d="M5 13l4 4L19 7" size={14} color="currentColor" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700" style={{ color: T.textSecondary }}>Siap Pakai & Instan</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <a 
                                    href={ctaLink} 
                                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-xs md:text-sm font-black uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, boxShadow: `0 8px 20px rgba(${T.accentRgb}, 0.25)` }}
                                >
                                    Pelajari Selengkapnya
                                    <span className="text-base">&rarr;</span>
                                </a>
                            </div>
                        </div>

                        {/* Image/Mockup Col */}
                        <div className="flex justify-center w-full relative">
                            {c?.banner_image ? (
                                <>
                                    {/* Ambient accent light */}
                                    <div 
                                        className="absolute -inset-4 rounded-full filter blur-3xl opacity-20 animate-pulse pointer-events-none" 
                                        style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})` }}
                                    />
                                    {/* Decorative offset card */}
                                    <div 
                                        className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl opacity-10 border"
                                        style={{ 
                                            borderColor: T.accent,
                                            background: `linear-gradient(135deg, ${T.accent}, transparent)`
                                        }}
                                    />
                                    {/* Premium image container */}
                                    <div 
                                        className="relative w-full rounded-3xl overflow-hidden border-4 border-white transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                                        style={{ 
                                            height: heightPx, 
                                            boxShadow: `0 25px 60px -15px rgba(${T.accentRgb}, 0.22)`
                                        }}
                                    >
                                        <img 
                                            src={bannerImg} 
                                            alt={title} 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                                    </div>
                                </>
                            ) : (
                                <DeviceMockups />
                            )}
                        </div>
                    </div>
                </section>
            );
        }

        // Default: banner_card
        return (
            <section className="rl-main-banner-section py-12 px-4 md:px-8 max-w-7xl mx-auto" style={topPaddingStyle}>
                <div 
                    className="relative rounded-[32px] overflow-hidden group transition-all duration-500 border bg-[#FAF3EC] flex flex-col lg:flex-row justify-between items-center p-8 md:p-14 gap-8" 
                    style={{ 
                        minHeight: heightPx, 
                        boxShadow: `0 30px 65px -12px rgba(${T.accentRgb}, 0.15)`,
                        borderColor: `rgba(${T.accentRgb}, 0.15)`
                    }}
                >
                    {/* Glowing light decorations */}
                    <div 
                        className="absolute w-[200px] h-[200px] rounded-full filter blur-[80px] opacity-20 pointer-events-none"
                        style={{ background: T.accent, right: '-5%', top: '-5%' }}
                    />

                    {/* Text Col */}
                    <div className="max-w-xl text-left space-y-4 md:space-y-6">
                        {subtitle && (
                            <span 
                                className="inline-block px-3.5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white animate-pulse" 
                                style={{ background: T.accent, boxShadow: `0 4px 15px rgba(${T.accentRgb}, 0.25)` }}
                            >
                                {subtitle}
                            </span>
                        )}
                        <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 leading-tight tracking-tight" style={{ fontFamily: 'var(--heading-font-family)' }}>
                            {title}
                        </h2>
                        
                        {/* Bullet checklist for Card layout */}
                        <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: T.accent }} />
                                <span className="text-xs font-bold text-slate-700">Integrasi Pembayaran Otomatis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: T.accent }} />
                                <span className="text-xs font-bold text-slate-700">Ratusan Pilihan Tema Premium</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <a 
                                href={ctaLink} 
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white transition-all hover:scale-105 hover:shadow-xl"
                                style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, boxShadow: `0 8px 25px rgba(${T.accentRgb}, 0.2)` }}
                            >
                                Pelajari Selengkapnya
                                <span className="text-base">&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Image/Mockup Col */}
                    <div className="w-full max-w-[340px] flex-shrink-0 relative">
                        {c?.banner_image ? (
                            <div 
                                className="w-full h-[200px] rounded-2xl overflow-hidden border-4 border-white shadow-xl group-hover:scale-[1.02] transition-transform duration-300"
                                style={{ boxShadow: `0 15px 35px rgba(${T.accentRgb}, 0.15)` }}
                            >
                                <img src={bannerImg} alt={title} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="scale-[0.8] origin-center md:scale-100">
                                <DeviceMockups />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    const renderHero = (c) => {
        const badgeText = c?.badge_text || 'Platform Undangan Digital Terpercaya';
        const title = c?.title || 'Undangan Digital';
        const subtitle = c?.subtitle || 'Premium';
        const description = c?.description || 'Buat undangan pernikahan digital yang elegan dan berkesan dalam hitungan menit.';
        const perks = c?.perks || ['Gratis selamanya', 'Tanpa watermark', 'Langsung aktif'];

        const handleSimulatorSubmit = (e) => {
            e.preventDefault();
            if (!typedSubdomain.trim()) return;
            const clean = typedSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
            window.location.href = `${registerUrl}?subdomain=${encodeURIComponent(clean)}`;
        };

        const displayHost = resellerHost.replace('www.', '');

        return (
            <section className="rl-hero" style={activeHeroImage ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${activeHeroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                <div className="rl-hero__orb rl-hero__orb--1" />
                <div className="rl-hero__orb rl-hero__orb--2" />
                <div className="rl-hero__orb rl-hero__orb--3" />
                <div className="rl-hero__grid" />
                
                <div className="rl-hero__content rl-hero__content--centered">
                    <div className="rl-hero__text-col">
                        <div className="rl-hero__badge">
                            <span className="rl-hero__badge-dot" />
                            {badgeText}
                        </div>
                        <h1 className="rl-hero__heading text-center">
                            {title}
                            <span className="rl-hero__heading-sub">
                                <span className="rl-hero__rotating-word" style={{ opacity: wordVisible ? 1 : 0 }}>
                                    {ROTATING_WORDS[wordIdx]}
                                </span>
                                <span className="rl-hero__heading-premium"> {subtitle}</span>
                            </span>
                        </h1>
                        <p className="rl-hero__desc text-center mx-auto">{description}</p>
                        
                        {/* Domain Simulator Pill */}
                        <form onSubmit={handleSimulatorSubmit} className="rl-domain-simulator-pill">
                            <div className="rl-domain-simulator-inner">
                                <span className="rl-domain-prefix">{displayHost}/</span>
                                <input 
                                    type="text"
                                    value={typedSubdomain}
                                    onChange={e => setTypedSubdomain(e.target.value)}
                                    placeholder="nama-kamu"
                                    className="rl-domain-input"
                                />
                                <button type="submit" className="rl-domain-btn">
                                    Coba Sekarang
                                </button>
                            </div>
                        </form>

                        <div className="rl-hero__perks justify-center">
                            {perks.map((p, i) => (
                                <div key={i} className="rl-hero__perk">
                                    <Svg d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" size={16} color="#ffffff" />
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Centered 3D Perspective Phone Mockups */}
                    <div className="rl-hero__perspective-mockups-container">
                        <div className="rl-hero__perspective-stage">
                            {/* Left rotated phone */}
                            <div className="rl-perspective-phone rl-perspective-phone--left">
                                <div className="rl-perspective-phone__inner">
                                    <div className="rl-perspective-phone__notch" />
                                    <div className="rl-perspective-phone__screen">
                                        {leftImg ? (
                                            <img src={leftImg} alt="Theme Left" className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-b from-[#1e293b] to-[#0f172a]" />
                                        )}
                                        <div className="rl-phone-glare" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Center raised phone */}
                            <div className="rl-perspective-phone rl-perspective-phone--center">
                                <div className="rl-perspective-phone__inner">
                                    <div className="rl-perspective-phone__notch" />
                                    <div className="rl-perspective-phone__screen-active">
                                        {centerImg ? (
                                            <img src={centerImg} alt="Theme Center" className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-b from-[#be123c] to-[#d31124]" />
                                        )}
                                        <div className="rl-phone-glare" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Right rotated phone */}
                            <div className="rl-perspective-phone rl-perspective-phone--right">
                                <div className="rl-perspective-phone__inner">
                                    <div className="rl-perspective-phone__notch" />
                                    <div className="rl-perspective-phone__screen">
                                        {rightImg ? (
                                            <img src={rightImg} alt="Theme Right" className="w-full h-full object-cover object-top" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-b from-[#1e293b] to-[#0f172a]" />
                                        )}
                                        <div className="rl-phone-glare" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    };

    const renderStats = (c) => {
        const items = c?.items || [
            { val: `${themes.length || 20}+`, label: 'Tema Tersedia', icon: 'theme' },
            { val: '1.200+', label: 'Undangan Dibuat', icon: 'envelope' },
            { val: '5 Menit', label: 'Waktu Pembuatan', icon: 'lightning' },
            { val: '24/7', label: 'Selalu Online', icon: 'globe' },
            { val: '100%', label: 'Mobile Friendly', icon: 'mobile' },
        ];
        return (
            <section className="rl-stats">
                <div className="rl-stats__inner">
                    {items.map((s, i) => (
                        <div key={i} className="rl-stats__item">
                            <span className="rl-stats__icon">
                                {ICON_PACK[s.icon] ? (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32, display: 'inline-block', color: 'var(--accent)' }}>
                                        <path d={ICON_PACK[s.icon]} />
                                    </svg>
                                ) : s.icon}
                            </span>
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
        const steps = c?.steps || [
            { num: '01', title: 'Daftar Gratis', desc: 'Buat akun dalam 30 detik. Tanpa kartu kredit.' },
            { num: '02', title: 'Pilih & Isi Tema', desc: 'Pilih tema favorit dan isi data mempelai.' },
            { num: '03', title: 'Bagikan ke Tamu', desc: 'Kirim link undangan via WhatsApp/Sosmed.' },
        ];

        return (
            <section className="rl-how-it-works">
                <div className="rl-how-it-works__inner">
                    <h2 className="rl-section-title">{title}</h2>
                    <div className="rl-how-it-works__grid">
                        {steps.map((s, i) => (
                            <div key={i} className="rl-step-card">
                                <div className="rl-step-card__num">
                                    <span className="rl-step-card__num-text">{s.num}</span>
                                    <span className="rl-step-card__num-icon">
                                        {i === 0 && <Svg d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" size={18} color="#ffffff" />}
                                        {i === 1 && <Svg d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" size={18} color="#ffffff" />}
                                        {i === 2 && <Svg d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" size={18} color="#ffffff" />}
                                    </span>
                                </div>
                                <div className="rl-step-card__content">
                                    <h3 className="rl-step-card__title">{s.title}</h3>
                                    <p className="rl-step-card__desc">{getCompactDesc(s.desc)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    };

    const renderFeatures = (c) => {
        const title = c?.title || 'Semua yang Anda Butuhkan Ada di Sini';
        const subtitle = c?.subtitle || 'Fitur Unggulan';
        
        let featuresList = [];
        if (features && features.length > 0) {
            featuresList = features.map(f => {
                const custom = c?.features_custom?.[f.slug] || {};
                const isEnabled = custom.is_enabled !== false;
                const customName = custom.name || f.name;
                const customDesc = custom.description || f.description || DEFAULT_DESCRIPTIONS[f.slug] || '';
                
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
                
                const packKey = slugToPackKey[f.slug] || 'sparkles';
                const iconPath = ICON_PACK[packKey] || ICON_PACK.sparkles;
                
                return {
                    slug: f.slug,
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
            <section className="rl-features">
                <div className="rl-features__inner">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span className="rl-section-subtitle" style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: '800', 
                            color: 'var(--accent)', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.1em',
                            display: 'inline-block',
                            marginBottom: '0.5rem',
                            background: 'rgba(229, 101, 75, 0.08)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px'
                        }}>
                            {subtitle} ({featuresList.length} Fitur)
                        </span>
                        <h2 className="rl-section-title" style={{ marginTop: 0, marginBottom: 0 }}>{title}</h2>
                    </div>

                    <div className="rl-features__outer" style={{ position: 'relative' }}>
                        <div ref={featuresScrollRef} className="rl-features__grid">
                            {featuresList.map((f, i) => (
                                <div key={i} className="rl-feature-card">
                                    <span className="rl-feature-card__number">{String(i + 1).padStart(2, '0')}</span>
                                    <div className="rl-feature-card__icon-box">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ width: 24, height: 24 }}><path d={f.icon} /></svg>
                                    </div>
                                    <h3 className="rl-feature-card__title">{f.title}</h3>
                                    <p className="rl-feature-card__desc">{getCompactDesc(f.desc)}</p>
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
        const subtitle = c?.subtitle || 'Katalog Tema';

        return (
            <section className="rl-catalog" id="preview">
                <div className="rl-catalog__inner">
                    <div className="rl-catalog__header">
                        <h2 className="rl-catalog__title">{title}</h2>
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
                                    <div className="rl-filter-dropdown-wrapper rl-filter-dropdown-wrapper--category" ref={categoryDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (selectedCategories.length > 0 ? 'var(--accent)' : 'rgba(211, 17, 36, 0.15)'),
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
                                            <div className="rl-filter-dropdown-menu">
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

                                    <div className="rl-filter-dropdown-wrapper rl-filter-dropdown-wrapper--type" ref={typeDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (selectedTypes.length > 0 ? 'var(--accent)' : 'rgba(211, 17, 36, 0.15)'),
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
                                            <div className="rl-filter-dropdown-menu">
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

                                    <div className="rl-filter-dropdown-wrapper rl-filter-dropdown-wrapper--sort" ref={sortDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                            style={{
                                                border: '1.5px solid ' + (isSortDropdownOpen ? 'var(--accent)' : 'rgba(211, 17, 36, 0.15)'),
                                                background: isSortDropdownOpen ? 'rgba(var(--accent-rgb), 0.12)' : 'var(--card-bg)',
                                                color: isSortDropdownOpen ? 'var(--accent)' : 'var(--text-secondary)',
                                                width: '38px', height: '38px', borderRadius: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                            }}
                                            title="Urutkan Desain"
                                        >
                                            <Svg d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" size={16} color="currentColor" />
                                        </button>

                                        {isSortDropdownOpen && (
                                            <div className="rl-filter-dropdown-menu">
                                                <div className="rl-filter-dropdown-menu-header" style={{ borderBottom: '1px solid var(--card-border, rgba(211, 17, 36, 0.08))', paddingBottom: '0.5rem' }}><span className="rl-filter-dropdown-menu-title">Urutkan</span></div>
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
                                                                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', border: 'none',
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

                    {c?.style === 'carousel' ? (
                        <div className="rl-catalog__carousel" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 0.5rem 1.5rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                            {sortedThemes.slice(0, 8).map((theme) => (
                                <div key={theme.id} style={{ flexShrink: 0, width: '260px' }}>
                                    <ThemePreviewCard
                                        theme={theme}
                                        reseller={reseller}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rl-catalog__grid">
                            {sortedThemes.slice(0, 8).map((theme) => (
                                <ThemePreviewCard
                                    key={theme.id}
                                    theme={theme}
                                    reseller={reseller}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const renderGreetingCardsCatalog = (c) => {
        const title = c?.title || 'Koleksi Kartu Ucapan Premium';
        return (
            <section className="rl-catalog">
                <div className="rl-catalog__inner">
                    <div className="rl-catalog__header">
                        <h2 className="rl-catalog__title">{title}</h2>
                    </div>

                    {c?.style === 'carousel' ? (
                        <div className="rl-catalog__carousel" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 0.5rem 1.5rem', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                            {sortedCards.slice(0, 4).map((card) => (
                                <div key={card.id} style={{ flexShrink: 0, width: '260px' }}>
                                    <GreetingCardPreviewCard
                                        theme={card}
                                        reseller={reseller}
                                        onUse={handleUseCard}
                                        typeOptions={greetingCardTypeOptions}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rl-catalog__grid">
                            {sortedCards.slice(0, 4).map((card) => (
                                <GreetingCardPreviewCard
                                    key={card.id}
                                    theme={card}
                                    reseller={reseller}
                                    onUse={handleUseCard}
                                    typeOptions={greetingCardTypeOptions}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        );
    };

    const renderTestimonials = (c) => {
        const title = c?.title || 'Dipercaya Ribuan Pasangan Bahagia';
        const items = c?.items || TESTIMONIALS;

        return (
            <section className="rl-testimonials" style={{ background: 'var(--section-base)' }}>
                <div className="rl-testimonials__inner">
                    <h2 className="rl-section-title">{title}</h2>
                    <div className="rl-testimonials__marquee-container">
                        <div className="rl-testimonials__marquee">
                            {items.concat(items).map((t, i) => (
                                <div key={i} className="rl-testi-card">
                                    <div className="rl-testi-card__stars">
                                        {[...Array(t.stars)].map((_, idx) => <StarIcon key={idx} />)}
                                    </div>
                                    <p className="rl-testi-card__text">"{t.text}"</p>
                                    <div className="rl-testi-card__author">
                                        <div className="rl-testi-card__name">{t.name}</div>
                                        <div className="rl-testi-card__city">{t.city}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
            <section className="rl-pricing" id="plans" style={{ background: 'var(--section-alt)' }}>
                <div className="rl-pricing__inner">
                    <h2 className="rl-section-title">{title}</h2>
                    <div className="rl-pricing__grid">
                        {invitationPlans.map((p) => {
                            const meta = planMeta[p.slug] || planMeta.free;
                            const isPopular = meta.popular;
                            return (
                                <div key={p.id} className={`rl-pricing-card ${isPopular ? 'rl-pricing-card--popular' : ''}`}>
                                    {isPopular && <div className="rl-pricing-card__popular-badge">Terpopuler</div>}
                                    <h3 className="rl-pricing-card__name">{p.name}</h3>
                                    <div className="rl-pricing-card__price">
                                        <span className="rl-pricing-card__price-amount">{formatRp(p.price)}</span>
                                        <span className="rl-pricing-card__price-period">/paket</span>
                                    </div>
                                    <p className="rl-pricing-card__desc">{p.description}</p>
                                    
                                    <div style={{ flex: 1, margin: '1.5rem 0' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Aktif {p.duration_days} hari</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Maksimal {p.max_guests === 999999 ? 'Tamu Tanpa Batas' : `${p.max_guests} Tamu`}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Galeri foto: {p.max_galleries}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href={`${registerUrl}?plan=${p.slug}`} className={`rl-pricing-card__btn ${isPopular ? 'rl-pricing-card__btn--primary' : 'rl-pricing-card__btn--outline'}`}>
                                        {meta.label}
                                    </a>
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
            <section className="rl-pricing" id="plans-cards" style={{ background: 'var(--section-alt)' }}>
                <div className="rl-pricing__inner">
                    <h2 className="rl-section-title">{title}</h2>
                    <div className="rl-pricing__grid">
                        {cardPlans.map((p) => {
                            const meta = planMeta[p.slug] || planMeta.free;
                            const isPopular = meta.popular;
                            return (
                                <div key={p.id} className={`rl-pricing-card ${isPopular ? 'rl-pricing-card--popular' : ''}`}>
                                    {isPopular && <div className="rl-pricing-card__popular-badge">Terpopuler</div>}
                                    <h3 className="rl-pricing-card__name">{p.name}</h3>
                                    <div className="rl-pricing-card__price">
                                        <span className="rl-pricing-card__price-amount">{formatRp(p.price)}</span>
                                        <span className="rl-pricing-card__price-period">/paket</span>
                                    </div>
                                    <p className="rl-pricing-card__desc">{p.description}</p>
                                    
                                    <div style={{ flex: 1, margin: '1.5rem 0' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Aktif {p.duration_days} hari</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Maksimal {p.max_guests === 999999 ? 'Tamu Tanpa Batas' : `${p.max_guests} Tamu`}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                                <Svg d="M4.5 12.75l6 6 9-13.5" size={16} color="var(--accent)" />
                                                <span>Galeri foto: {p.max_galleries}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <a href={`${registerUrl}?plan=${p.slug}`} className={`rl-pricing-card__btn ${isPopular ? 'rl-pricing-card__btn--primary' : 'rl-pricing-card__btn--outline'}`}>
                                        {meta.label}
                                    </a>
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
            <section className="rl-faq">
                <div className="rl-faq__inner">
                    <h2 className="rl-section-title">{title}</h2>
                    <div className="rl-faq__list">
                        {items.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div key={idx} className={`rl-faq-item ${isOpen ? 'rl-faq-item--open' : ''}`}>
                                    <button onClick={() => setOpenFaq(isOpen ? null : idx)} className="rl-faq-item__q">
                                        <span>{item.q}</span>
                                        <span className="rl-faq-item__chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <Svg d="M19.5 8.25l-7.5 7.5-7.5-7.5" size={18} />
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="rl-faq-item__a">
                                            <p>{item.a}</p>
                                        </div>
                                    )}
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
            <section className="rl-cta-section relative">
                <div className="rl-cta-section__orb rl-cta-section__orb--1" />
                <div className="rl-cta-section__orb rl-cta-section__orb--2" />
                <div className="rl-cta-section__content">
                    <div className="rl-cta-section__tag">🎊 Mulai Sekarang</div>
                    <h2 className="rl-cta-section__title">{title}</h2>
                    <p className="rl-cta-section__desc">
                        Bergabung bersama ribuan pasangan yang sudah mempercayakan undangan spesial mereka kepada kami.
                        Gratis, mudah, dan hasilnya luar biasa!
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={registerUrl} className="rl-cta-btn rl-cta-btn--primary rl-cta-btn--lg">
                            {ctaText}
                        </a>
                        <a href={getThemesUrl()} className="rl-cta-btn rl-cta-btn--outline">
                            Lihat Semua Tema
                        </a>
                        {hasContact && (
                            <button onClick={handleContactClick} className="rl-cta-btn rl-cta-btn--outline" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>
                                Hubungi Kami
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    };

    const renderSection = (key, config) => {
        switch (key) {
            case 'banner': return renderBanner(config);
            case 'hero': return renderHero(config);
            case 'main_banner': return renderMainBanner(config);
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
        const brandChar = reseller.brand_name?.charAt(0) || 'R';
        const accentColor = T.accent || '#d31124';

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
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                            opacity: 0.3,
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
                            boxShadow: `0 8px 20px ${accentColor}40`,
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
                            color: '#ffffff',
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
                            background: 'rgba(255, 255, 255, 0.1)',
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
                                borderLeftColor: '#ffffff',
                                borderRightColor: '#ffffff',
                                borderRadius: '50%',
                                opacity: 0.8,
                                animation: 'rl-spin-reverse 1.2s cubic-bezier(0.53, 0.21, 0.29, 0.67) infinite'
                            }} />
                            {/* Brand Initial with Neon Glow */}
                            <div style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '50%',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px ${accentColor}`,
                                color: accentColor,
                                fontWeight: '800',
                                fontSize: '20px',
                                textShadow: `0 1px 2px rgba(0,0,0,0.1)`
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h4 style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: '0 0 6px 0',
                            animation: 'rl-fade-breath 2s ease-in-out infinite',
                            fontFamily: T.fontFamily || 'sans-serif'
                        }}>
                            {reseller.brand_name}
                        </h4>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.6)',
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
                            background: 'rgba(255,255,255,0.05)',
                            zIndex: 1000000
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                height: '100%',
                                background: `linear-gradient(90deg, ${accentColor}, #ffffff, ${accentColor})`,
                                boxShadow: `0 0 10px ${accentColor}`,
                                animation: 'rl-progress-sweep 2s ease-in-out infinite',
                                width: '30%'
                            }} />
                        </div>
                        
                        {/* Clean spinning circle & brand label */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid rgba(255,255,255,0.1)',
                            borderTopColor: accentColor,
                            borderRadius: '50%',
                            animation: 'rl-spin 0.8s linear infinite',
                            marginBottom: '20px'
                        }} />
                        <h4 style={{
                            color: '#ffffff',
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
                            color: 'rgba(255, 255, 255, 0.5)',
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
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
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
                                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
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
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: '0 0 6px 0',
                            fontFamily: T.fontFamily || 'sans-serif'
                        }}>
                            {reseller.brand_name}
                        </h4>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
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
                                border: `3px solid rgba(255, 255, 255, 0.2)`,
                                borderTop: `3px solid #ffffff`,
                                borderRadius: '50%',
                                animation: 'rl-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                            }} />
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 10px 25px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.4)`,
                                animation: 'rl-pulse 2s ease-in-out infinite',
                                color: accentColor,
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                {brandChar}
                            </div>
                        </div>
                        <h3 style={{
                            color: '#ffffff',
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
                            color: '#ffe4e6',
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
            {/* Elegant Preloader overlay */}
            {showLoadingScreen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: T.heroBg || T.sectionBase || '#0b0f19',
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
                className={`rl-layout-container rl-layout-modern-split`}
                style={{ 
                    opacity: (!showLoadingScreen || isLoaded) ? 1 : 0, 
                    transition: 'opacity 0.4s ease-in-out',
                    minHeight: '100vh',
                    overflowX: 'hidden',
                    width: '100%'
                }}
            >
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <title>{reseller.site_title || reseller.brand_name}</title>
                <meta name="description" content={reseller.site_motto} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <style>{cssVars}</style>
                <style>{landingStyles}</style>
            </Head>

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
                style={{ top: '0px' }}
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
                        </div>

                        <div className="rl-footer__col">
                            <h4 className="rl-footer__title">Tautan Cepat</h4>
                            <div className="rl-footer__links-stack">
                                <a href={getThemesUrl()} className="rl-footer__link">Katalog Tema</a>
                                <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                                <a href={loginUrl} className="rl-footer__link">Masuk</a>
                                <Link href={getFaqUrl()} className="rl-footer__link">FAQ & Panduan</Link>
                            </div>
                        </div>

                        {hasContact && (
                            <div className="rl-footer__col">
                                <h4 className="rl-footer__title">Hubungi Kami</h4>
                                <div className="rl-footer__contacts">
                                    {reseller.footer_whatsapp && (
                                        <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-footer__contact-item">
                                            <span>WhatsApp: {reseller.footer_whatsapp}</span>
                                        </a>
                                    )}
                                    {reseller.footer_email && (
                                        <a href={`mailto:${reseller.footer_email}`} className="rl-footer__contact-item">
                                            <span>Email: {reseller.footer_email}</span>
                                        </a>
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
                            <h3 className="rl-modal-title">Hubungi {reseller.brand_name}</h3>
                        </div>
                        <div className="rl-modal-body">
                            {reseller.footer_whatsapp && (
                                <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-contact-row">
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">WhatsApp</span>
                                        <span className="rl-contact-value">{reseller.footer_whatsapp}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_email && (
                                <a href={`mailto:${reseller.footer_email}`} className="rl-contact-row">
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Email</span>
                                        <span className="rl-contact-value">{reseller.footer_email}</span>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>
);
}

/* ─────────────────────────────────────────────────────────
   CSS STYLES FOR MODERN-SPLIT LAYOUT
   ───────────────────────────────────────────────────────── */
const landingStyles = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: var(--font-family); background: var(--section-base); color: var(--text-primary); }

.rl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: transparent;
    transition: all 0.35s ease;
    padding: 0.5rem 0;
}
.rl-nav--scrolled {
    background: transparent;
}
.rl-nav__inner {
    max-width: 1200px; margin: 1rem auto; padding: 0.75rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(0, 0, 0, 0.06) !important;
    border-radius: 100px;
    box-shadow: 0 10px 45px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}
.rl-nav__brand-name {
    color: #1f2937 !important;
}
.rl-nav__actions .rl-btn--ghost {
    color: #4b5563 !important;
}
.rl-nav__actions .rl-btn--ghost:hover {
    color: #1f2937 !important;
    background: rgba(0, 0, 0, 0.04) !important;
}

/* Banner Layout Custom Models */
.rl-banner-split-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
}
@media (min-width: 1024px) {
    .rl-banner-split-grid {
        grid-template-columns: 1.15fr 0.85fr;
        gap: 5rem;
    }
}

/* Device Mockup Float Animations & Overlays */
@keyframes float-tablet {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50% { transform: translateY(-6px) rotate(-1.5deg); }
}
@keyframes float-phone {
    0%, 100% { transform: translateY(0) rotate(1deg); }
    50% { transform: translateY(-10px) rotate(2.5deg); }
}

.rl-mockup-tablet {
    animation: float-tablet 6s ease-in-out infinite;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.rl-mockup-phone {
    animation: float-phone 5s ease-in-out infinite;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.rl-device-mockups-container:hover .rl-mockup-tablet {
    transform: translateY(-4px) rotate(-0.5deg) scale(1.02);
}
.rl-device-mockups-container:hover .rl-mockup-phone {
    transform: translateY(-8px) rotate(0.5deg) scale(1.04);
}

@media (max-width: 768px) {
    /* Nav Compact Overrides */
    .rl-nav {
        padding: 0.25rem 0 !important;
    }
    .rl-nav__inner {
        margin: 0.35rem 0.5rem !important;
        padding: 0.3rem 0.6rem 0.3rem 0.8rem !important;
        border-radius: 50px !important;
        gap: 0.5rem !important;
        background: rgba(255, 255, 255, 0.95) !important;
    }
    .rl-nav__brand {
        gap: 0.4rem !important;
    }
    .rl-nav__logo-img, .rl-nav__logo-placeholder {
        width: 28px !important;
        height: 28px !important;
        font-size: 13px !important;
        border-radius: 8px !important;
    }
    .rl-nav__brand-name {
        font-size: 0.8rem !important;
        font-weight: 700 !important;
    }
    .rl-nav__actions {
        gap: 0.35rem !important;
    }
    .rl-nav__contact-btn {
        display: none !important; /* hide on mobile */
    }
    .rl-nav__actions .rl-btn {
        padding: 0.35rem 0.75rem !important;
        font-size: 0.7rem !important;
        border-radius: 30px !important;
        letter-spacing: 0.02em !important;
        text-transform: uppercase !important;
        height: auto !important;
        min-height: 0 !important;
    }
    .rl-nav__actions .rl-btn--accent {
        padding: 0.35rem 0.75rem !important;
        font-size: 0.7rem !important;
    }
    .rl-nav__actions .rl-btn--ghost {
        padding: 0.35rem 0.5rem !important;
        font-size: 0.7rem !important;
        border: none !important;
        background: transparent !important;
    }

    /* Banner Compact Overrides */
    .rl-ms-banner {
        bottom: 1rem !important;
        width: calc(100% - 1.5rem) !important;
        padding: 0.45rem 2.25rem 0.45rem 1rem !important;
        gap: 0.75rem !important;
        border-radius: 30px !important;
    }
    .rl-ms-banner span.inline-flex {
        font-size: 0.75rem !important;
        line-height: 1.3 !important;
        gap: 0.25rem !important;
    }
    .rl-ms-banner__cta {
        padding: 0.35rem 0.75rem !important;
        font-size: 0.7rem !important;
        margin-right: 0.25rem !important;
    }
    .rl-ms-banner__close {
        right: 0.65rem !important;
        font-size: 1.2rem !important;
    }
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

.rl-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
.rl-btn--ghost { background: transparent; color: var(--text-secondary); }
.rl-btn--ghost:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
.rl-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-btn--accent:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }

/* Buttons Custom Styles */
.rl-btn--accent,
.rl-cta-btn--primary {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%) !important;
    border-radius: 100px !important;
    box-shadow: 0 4px 20px rgba(var(--accent-rgb), 0.3) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    font-size: 0.8125rem !important;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    border: none;
    color: #fff;
}
.rl-btn--accent:hover,
.rl-cta-btn--primary:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 30px rgba(var(--accent-rgb), 0.5) !important;
}
.rl-cta-btn--outline,
.rl-btn--ghost {
    border-radius: 100px !important;
    border: 1px solid rgba(211, 17, 36, 0.2) !important;
    background: rgba(211, 17, 36, 0.02) !important;
    backdrop-filter: blur(8px) !important;
    transition: all 0.3s ease !important;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    color: var(--accent);
}
.rl-cta-btn--outline:hover,
.rl-btn--ghost:hover {
    background: rgba(var(--accent-rgb), 0.08) !important;
    border-color: var(--accent) !important;
    color: var(--accent) !important;
}

.rl-cta-btn--lg { padding: 1rem 2.5rem; font-size: 1.05rem; border-radius: 100px !important; }

/* ── HERO ── */
.rl-hero {
    position: relative; min-height: 100vh; background: var(--hero-bg);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 9rem 2rem 5rem; overflow: hidden;
}
.rl-hero__orb {
    position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0;
}
.rl-hero__orb--1 { width: 550px; height: 550px; background: rgba(var(--accent-rgb), 0.12); top: -10%; left: 10%; }
.rl-hero__orb--2 { width: 450px; height: 450px; background: rgba(var(--accent-rgb), 0.08); bottom: 10%; right: 10%; }
.rl-hero__orb--3 { width: 350px; height: 350px; background: rgba(var(--accent-rgb), 0.08); top: 40%; left: 40%; }

.rl-hero__grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
    pointer-events: none;
}

.rl-hero__content--centered {
    position: relative; z-index: 1; max-width: 900px; width: 100%; text-align: center;
    display: flex; flex-direction: column; align-items: center;
}
@media (min-width: 1024px) {
    .rl-hero {
        padding: 9rem 5% 5rem !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    .rl-hero__content--centered {
        display: grid !important;
        grid-template-columns: 1.15fr 0.85fr !important;
        gap: 4rem !important;
        max-width: 1200px !important;
        text-align: left !important;
        align-items: center !important;
        flex-direction: row !important;
    }
    .rl-hero__text-col {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        text-align: left !important;
    }
    .rl-hero__heading {
        text-align: left !important;
    }
    .rl-hero__desc {
        text-align: left !important;
        margin-left: 0 !important;
    }
    .rl-domain-simulator-pill {
        margin: 0 0 2rem 0 !important;
    }
    .rl-hero__perks {
        justify-content: flex-start !important;
    }
    .rl-hero__perspective-mockups-container {
        margin-top: 0 !important;
    }
}

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
    font-family: var(--heading-font-family), Georgia, serif;
    font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; line-height: 1.15;
    color: var(--text-primary); margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
}
.rl-hero__heading-sub { display: block; margin-top: 0.25rem; }
.rl-hero__rotating-word {
    color: var(--accent); transition: opacity 0.3s ease;
    display: inline-block;
}
.rl-hero__heading-premium { color: var(--text-secondary); }

.rl-hero__desc {
    font-size: 1.125rem; line-height: 1.75; color: var(--text-secondary);
    margin-bottom: 2.5rem; max-width: 620px;
}
.rl-hero__perks { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 1rem; }
.rl-hero__perk { display: flex; align-items: center; gap: 0.375rem; font-size: 0.9rem; color: var(--text-muted); }

/* DOMAIN SIMULATOR PILL */
.rl-domain-simulator-pill {
    width: 100%; max-width: 500px; margin: 0 auto 2.5rem;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px 6px 6px 20px; border-radius: 100px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    transition: all 0.3s ease;
    border: 2px solid transparent !important;
}
.rl-domain-simulator-pill:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(var(--accent-rgb), 0.3);
    background: #ffffff;
    border-color: var(--accent) !important;
}
.rl-domain-simulator-inner {
    display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;
}
.rl-domain-prefix {
    color: #64748b; font-size: 0.95rem; font-weight: 700; flex-shrink: 0;
    user-select: none;
}
.rl-domain-input {
    border: none !important; background: transparent; color: #0f172a; outline: none !important;
    font-size: 0.95rem; font-weight: 700; flex: 1; min-width: 0; padding: 4px 0;
    box-shadow: none !important;
}
.rl-domain-input:focus {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    --tw-ring-color: transparent !important;
    --tw-ring-width: 0px !important;
}
.rl-domain-input::placeholder { color: #94a3b8; }
.rl-domain-btn {
    background: #0f172a; color: #ffffff; font-size: 0.875rem; font-weight: 750;
    padding: 12px 24px; border-radius: 100px; border: none; cursor: pointer;
    transition: all 0.2s ease; white-space: nowrap;
}
.rl-domain-btn:hover {
    background: var(--accent); color: #ffffff;
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.4);
}

/* Centered 3D Perspective Stage */
.rl-hero__perspective-mockups-container {
    width: 100%; max-width: 900px; margin-top: 4rem; overflow: visible;
}
.rl-hero__perspective-stage {
    perspective: 1200px; display: flex; align-items: center; justify-content: center;
    height: 380px; position: relative; overflow: visible;
}

.rl-perspective-phone {
    width: 200px; height: 380px; background: #0f172a;
    border: 6px solid #1e293b; border-radius: 28px;
    position: relative; overflow: hidden; transition: all 0.5s ease;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55);
    backface-visibility: hidden;
}
.rl-perspective-phone__inner {
    width: 100%; height: 100%; background: #070a12; border-radius: 22px; overflow: hidden;
    position: relative; border: 1.5px solid #000;
}
.rl-perspective-phone__notch {
    position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 65px; height: 15px; background: #000; border-radius: 0 0 10px 10px; z-index: 10;
}
.rl-perspective-phone__screen {
    width: 100%; height: 100%; background: #0f172a;
    display: flex; flex-direction: column; overflow: hidden; position: relative;
}
.rl-perspective-phone__screen-active {
    width: 100%; height: 100%; background: #0f172a;
    display: flex; flex-direction: column; overflow: hidden; position: relative;
}
.rl-phone-glare {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none; z-index: 5;
}

/* 3D transformations */
.rl-perspective-phone--left {
    transform: rotateY(24deg) rotateX(8deg) scale(0.85) translateZ(-40px);
    z-index: 10; margin-right: -4rem; opacity: 0.65;
}
.rl-perspective-phone--center {
    transform: translateZ(50px) scale(1.02);
    z-index: 20; border-color: rgba(var(--accent-rgb), 0.3);
    box-shadow: 0 40px 90px rgba(var(--accent-rgb), 0.2);
}
.rl-perspective-phone--right {
    transform: rotateY(-24deg) rotateX(8deg) scale(0.85) translateZ(-40px);
    z-index: 10; margin-left: -4rem; opacity: 0.65;
}

.rl-perspective-phone:hover {
    opacity: 1; transform: translateZ(70px) scale(1.05) rotateY(0) rotateX(0); z-index: 40;
    border-color: var(--accent);
}



/* ── STATS ── */
.rl-stats {
    background: var(--section-alt) !important;
    padding: 5rem 2rem !important;
}
.rl-stats__inner {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
    gap: 2rem !important;
    max-width: 1200px !important;
    margin: 0 auto !important;
}
.rl-stats__item {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 20px !important;
    padding: 2.5rem 1.5rem !important;
    text-align: center !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    position: relative !important;
    overflow: hidden !important;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.rl-stats__item::before {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    background: radial-gradient(circle at top right, rgba(var(--accent-rgb), 0.12), transparent 70%) !important;
    opacity: 0 !important;
    transition: opacity 0.4s ease !important;
}
.rl-stats__item:hover {
    transform: translateY(-5px) !important;
    border-color: rgba(var(--accent-rgb), 0.3) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
}
.rl-stats__item:hover::before {
    opacity: 1 !important;
}
.rl-stats__icon {
    display: flex; align-items: center; justify-content: center;
    width: 60px; height: 60px; border-radius: 18px;
    background: rgba(var(--accent-rgb), 0.08);
    font-size: 1.5rem; margin-bottom: 1.25rem;
}
.rl-stats__val { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.375rem; }
.rl-stats__label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }

/* ── HOW IT WORKS ── */
.rl-how-it-works { background: var(--section-base); padding: 6rem 2rem; }
.rl-how-it-works__inner { max-width: 1200px; margin: 0 auto; }
.rl-section-title {
    font-family: var(--heading-font-family);
    font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; text-align: center;
    color: var(--text-primary); margin-bottom: 4rem;
}
.rl-how-it-works__grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
    gap: 2.5rem !important;
}
.rl-step-card {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 24px !important;
    padding: 3rem 2rem !important;
    transition: all 0.3s ease !important;
    text-align: left;
}
.rl-step-card:hover {
    border-color: rgba(var(--accent-rgb), 0.25) !important;
    transform: translateY(-3px) !important;
    background: rgba(var(--accent-rgb), 0.01) !important;
}
.rl-step-card__num {
    font-size: 3rem !important;
    font-weight: 800 !important;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    margin-bottom: 1.5rem !important;
    opacity: 0.95 !important;
}
.rl-step-card__num-icon { display: none !important; }
.rl-step-card__title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
.rl-step-card__desc { font-size: 0.9375rem; line-height: 1.6; color: var(--text-secondary); }

/* ── FEATURES ── */
.rl-features { background: var(--section-alt); padding: 6rem 2rem; }
.rl-features__inner { max-width: 1200px; margin: 0 auto; }
.rl-features__outer { position: relative; }
.rl-features__grid {
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
.rl-features__grid::-webkit-scrollbar {
    display: none !important;
}
.rl-feature-card {
    position: relative !important;
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 20px !important;
    padding: 2.5rem 2rem !important;
    transition: all 0.3s ease !important;
    text-align: left;
    scroll-snap-align: start !important;
}
.rl-feature-card:hover {
    border-color: rgba(var(--accent-rgb), 0.2) !important;
    background: rgba(255, 255, 255, 0.03) !important;
    box-shadow: 0 15px 30px rgba(var(--accent-rgb), 0.05) !important;
}
.rl-feature-card__icon-box {
    background: rgba(var(--accent-rgb), 0.08) !important;
    border: 1px solid rgba(var(--accent-rgb), 0.2) !important;
    color: var(--accent) !important;
    border-radius: 16px !important;
    width: 56px !important;
    height: 56px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    margin-bottom: 1.5rem !important;
}
.rl-feature-card__title { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.625rem; padding-right: 2rem; }
.rl-feature-card__desc { font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary); }
.rl-feature-card__number {
    position: absolute !important;
    top: 2rem !important;
    right: 2rem !important;
    font-size: 1.75rem !important;
    font-weight: 800 !important;
    color: rgba(var(--accent-rgb), 0.15) !important;
    line-height: 1 !important;
    font-family: var(--heading-font-family) !important;
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

/* ── PREVIEW CATALOG ── */
.rl-catalog { background: var(--section-base); padding: 6rem 2rem; }
.rl-catalog--alt { background: var(--section-alt); }
.rl-catalog__inner { max-width: 1200px; margin: 0 auto; }
.rl-catalog__header {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 3rem; text-align: center;
}
.rl-catalog__title {
    font-family: var(--heading-font-family);
    font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: var(--text-primary);
}
.rl-catalog__filter-bar {
    display: flex; align-items: center; justify-content: center; gap: 1rem;
    margin-bottom: 3.5rem; flex-wrap: wrap;
}
.rl-search { width: 100%; max-width: 480px; position: relative; }
.rl-search__input {
    width: 100%; padding: 0.875rem 1.5rem; border-radius: 100px;
    background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.08);
    color: var(--text-primary); font-size: 0.875rem; font-weight: 600; outline: none;
    transition: all 0.2s ease;
}
.rl-search__input:focus {
    border-color: var(--accent);
    background: rgba(255,255,255,0.05);
    box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.15);
}

.rl-catalog__grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 2rem;
}

/* ── FILTERS PANEL ── */
.rl-filter-panel {
    background: var(--card-bg, #ffffff) !important;
    border: 1.5px solid var(--card-border, rgba(211, 17, 36, 0.08)) !important;
    padding: 0.75rem 1.25rem !important;
    border-radius: 100px !important;
    max-width: 900px !important;
    margin: 0 auto 3rem !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
}
.rl-filter-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 1.5rem !important;
}
.rl-filter-search-container {
    position: relative !important;
    flex: 1 !important;
    display: flex !important;
    align-items: center !important;
}
.rl-filter-search-input {
    width: 100% !important;
    border: none !important;
    background: transparent !important;
    padding: 0.5rem 0.5rem 0.5rem 2.25rem !important;
    color: var(--text-primary) !important;
    font-size: 0.85rem !important;
    outline: none !important;
    font-weight: 600 !important;
    box-shadow: none !important;
}
.rl-filter-search-input::placeholder {
    color: var(--text-muted) !important;
}
.rl-filter-controls {
    display: flex !important;
    align-items: center !important;
    gap: 0.75rem !important;
}
.rl-filter-dropdown-wrapper {
    position: relative !important;
}
.rl-filter-btn {
    display: flex !important;
    align-items: center !important;
    gap: 1.25rem !important;
    padding: 0.5rem 1.25rem !important;
    border-radius: 100px !important;
    font-size: 0.8rem !important;
    font-weight: 750 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    outline: none !important;
    max-width: 180px !important;
}
.rl-filter-dropdown-menu {
    position: absolute !important;
    top: calc(100% + 0.5rem) !important;
    right: 0 !important;
    width: 220px !important;
    border-radius: 16px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    z-index: 50 !important;
    padding: 0.75rem !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
    background: #ffffff !important;
    border: 1px solid rgba(var(--accent-rgb), 0.12) !important;
}
.rl-filter-dropdown-menu-header {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    border-bottom: 1.5px solid var(--card-border, rgba(211, 17, 36, 0.08)) !important;
    padding-bottom: 0.4rem !important;
    margin-bottom: 0.25rem !important;
}
.rl-filter-dropdown-menu-title {
    font-size: 0.725rem !important;
    font-weight: 850 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    color: var(--text-muted) !important;
}
.rl-filter-dropdown-menu-reset {
    font-size: 0.675rem !important;
    font-weight: 750 !important;
    color: var(--accent) !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
}
.rl-filter-dropdown-list {
    display: flex !important;
    flex-direction: column !important;
    max-height: 180px !important;
    overflow-y: auto !important;
}
.rl-filter-checkbox-label {
    display: flex !important;
    align-items: center !important;
    gap: 0.5rem !important;
    padding: 0.35rem 0.5rem !important;
    border-radius: 8px !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
    margin: 1px 0 !important;
}
.rl-filter-checkbox-input {
    width: 14px !important;
    height: 14px !important;
    border-radius: 4px !important;
    border: 1.5px solid var(--card-border, rgba(211, 17, 36, 0.08)) !important;
    background: transparent !important;
    cursor: pointer !important;
    accent-color: var(--accent) !important;
}

/* ── TESTIMONIALS ── */
.rl-testimonials { background: var(--section-alt); padding: 6rem 2rem; overflow: hidden; }
.rl-testimonials__inner { max-width: 1200px; margin: 0 auto; }
.rl-testimonials__marquee-container {
    position: relative; width: 100%; display: flex; overflow-x: hidden;
    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
.rl-testimonials__marquee {
    display: flex; gap: 2rem; animation: marquee 30s linear infinite;
}
@keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(calc(-50% - 1rem), 0, 0); } }
.rl-testi-card {
    flex-shrink: 0; width: 340px; background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06); border-radius: 20px;
    padding: 2rem; display: flex; flex-direction: column; gap: 1rem;
    backdrop-filter: blur(12px);
}
.rl-testi-card__stars { display: flex; gap: 0.25rem; }
.rl-testi-card__text { font-size: 0.9375rem; line-height: 1.6; color: var(--text-primary); font-style: italic; }
.rl-testi-card__author { margin-top: auto; }
.rl-testi-card__name { font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); }
.rl-testi-card__city { font-size: 0.8125rem; color: var(--text-muted); }

/* ── PRICING ── */
.rl-pricing { background: var(--section-base); padding: 6rem 2rem; }
.rl-pricing__inner { max-width: 1200px; margin: 0 auto; }
.rl-pricing__grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2.5rem; justify-content: center;
}
.rl-pricing-card {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 24px !important;
    padding: 3rem 2rem !important;
    backdrop-filter: blur(12px) !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: flex; flex-direction: column; position: relative;
    text-align: left;
}
.rl-pricing-card:hover {
    transform: translateY(-8px) scale(1.01) !important;
}
.rl-pricing-card--popular {
    background: rgba(var(--accent-rgb), 0.02) !important;
    border: 2px solid var(--accent) !important;
    box-shadow: 0 20px 50px rgba(var(--accent-rgb), 0.15) !important;
}
.rl-pricing-card__popular-badge {
    position: absolute; top: -14px; left: 1/2; transform: translateX(-50%);
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    color: #fff; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.05em; padding: 0.375rem 1rem; border-radius: 100px;
    box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
    left: 50%;
}
.rl-pricing-card__name { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; }
.rl-pricing-card__price { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.25rem; }
.rl-pricing-card__price-amount {
    font-size: 2.75rem !important;
    font-weight: 800 !important;
    color: #fff !important;
}
.rl-pricing-card__price-period { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
.rl-pricing-card__desc { font-size: 0.875rem; line-height: 1.5; color: var(--text-secondary); margin-bottom: 1.5rem; }

.rl-pricing-card__btn {
    display: block; width: 100%; text-align: center; padding: 0.875rem; border-radius: 100px;
    font-size: 0.875rem; font-weight: 700; text-decoration: none; transition: all 0.25s ease;
    text-transform: uppercase; letter-spacing: 0.05em; margin-top: auto; border: none; cursor: pointer;
}
.rl-pricing-card__btn--primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff;
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3);
}
.rl-pricing-card__btn--primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4);
}
.rl-pricing-card__btn--outline {
    background: rgba(255,255,255,0.03); color: var(--text-primary);
    border: 1.5px solid rgba(255,255,255,0.12);
}
.rl-pricing-card__btn--outline:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(var(--accent-rgb), 0.3);
}

/* ── FAQ ── */
.rl-faq { background: var(--section-alt); padding: 6rem 2rem; }
.rl-faq__inner { max-width: 800px; margin: 0 auto; }
.rl-faq__list { display: flex; flex-direction: column; gap: 1rem; }
.rl-faq-item {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 16px !important;
    margin-bottom: 1rem !important;
    overflow: hidden !important;
    transition: all 0.3s ease !important;
}
.rl-faq-item--open {
    border-color: rgba(var(--accent-rgb), 0.3) !important;
    background: rgba(255, 255, 255, 0.03) !important;
}
.rl-faq-item__q {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem !important;
    background: transparent; border: none; outline: none;
    color: var(--text-primary); font-size: 1rem; font-weight: 600 !important;
    text-align: left; cursor: pointer;
}
.rl-faq-item__chevron { display: flex; align-items: center; color: var(--accent); transition: transform 0.25s ease; }
.rl-faq-item__a { padding: 0 1.5rem 1.5rem 1.5rem; font-size: 0.9375rem; line-height: 1.65; color: var(--text-secondary); border-top: 1px solid rgba(255,255,255,0.03); padding-top: 1rem; }

/* ── CTA SECTION ── */
.rl-cta-section {
    background: var(--section-base); padding: 8rem 2rem; text-align: center;
    position: relative; overflow: hidden;
}
.rl-cta-section__content { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
.rl-cta-section__tag {
    display: inline-flex; background: rgba(var(--accent-rgb), 0.1); color: var(--accent);
    padding: 0.375rem 1rem; border-radius: 100px; font-size: 0.8125rem; font-weight: 700;
    margin-bottom: 1.5rem;
}
.rl-cta-section__title {
    font-family: var(--heading-font-family);
    font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--text-primary);
    line-height: 1.2; margin-bottom: 1.25rem;
}
.rl-cta-section__desc { font-size: 1.0625rem; line-height: 1.75; color: var(--text-secondary); margin-bottom: 2.5rem; }
.rl-cta-section__orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; opacity: 0.4; }
.rl-cta-section__orb--1 { width: 300px; height: 300px; background: var(--accent); top: -100px; left: -100px; }
.rl-cta-section__orb--2 { width: 300px; height: 300px; background: #8b5cf6; bottom: -100px; right: -100px; }

/* ── PROMO BANNER ── */
.rl-ms-banner {
    position: fixed !important;
    bottom: 2rem !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
    width: calc(100% - 3rem) !important;
    max-width: 620px !important;
    color: #ffffff !important;
    padding: 0.75rem 2.75rem 0.75rem 1.5rem !important;
    border-radius: 100px !important;
    z-index: 99999 !important;
    box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.35), 0 0 0 1px rgba(255,255,255,0.15) inset !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 1.25rem !important;
    animation: banner-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    backdrop-filter: blur(12px) !important;
    border: none !important;
}
@keyframes banner-slide-up {
    0% { transform: translate(-50%, 100px); opacity: 0; }
    100% { transform: translate(-50%, 0); opacity: 1; }
}
.rl-ms-banner__cta {
    padding: 0.45rem 1.15rem !important;
    background: #ffffff !important;
    border-radius: 100px !important;
    text-decoration: none !important;
    font-size: 0.75rem !important;
    font-weight: 800 !important;
    transition: all 0.25s ease !important;
    color: var(--accent) !important;
    white-space: nowrap !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
}
.rl-ms-banner__cta:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 6px 15px rgba(0,0,0,0.18) !important;
}
.rl-ms-banner__close {
    position: absolute !important;
    right: 1.15rem !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    background: transparent !important;
    border: none !important;
    font-size: 1.5rem !important;
    font-weight: 300 !important;
    cursor: pointer !important;
    color: #ffffff !important;
    opacity: 0.7 !important;
    transition: opacity 0.2s ease !important;
    outline: none !important;
    line-height: 1 !important;
}
.rl-ms-banner__close:hover {
    opacity: 1 !important;
}

/* ── FOOTER ── */
.rl-footer { background: var(--footer-bg); padding: 5rem 2rem 3rem; border-top: 1px solid rgba(255,255,255,0.04); }
.rl-footer__inner { max-width: 1200px; margin: 0 auto; }
.rl-footer__grid { display: grid; grid-template-columns: 2fr 1.2fr 1.2fr; gap: 4rem; margin-bottom: 4rem; }
@media (max-width: 768px) { .rl-footer__grid { grid-template-columns: 1fr; gap: 2.5rem; } }
.rl-footer__col { display: flex; flex-direction: column; gap: 1.5rem; }
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-footer__brand-name { font-size: 1.125rem; font-weight: 800; color: var(--text-primary); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
.rl-footer__desc-text { font-size: 0.875rem; line-height: 1.65; color: var(--text-secondary); max-width: 360px; }
.rl-footer__title { font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); }
.rl-footer__links-stack { display: flex; flex-direction: column; gap: 0.875rem; }
.rl-footer__link, .rl-footer__link-btn {
    font-size: 0.875rem; color: var(--text-secondary); text-decoration: none;
    transition: color 0.2s ease; background: transparent; border: none; text-align: left; cursor: pointer; outline: none;
}
.rl-footer__link:hover, .rl-footer__link-btn:hover { color: var(--accent); }
.rl-footer__contacts { display: flex; flex-direction: column; gap: 1rem; }
.rl-footer__contact-item {
    display: flex; align-items: center; gap: 0.625rem; font-size: 0.875rem;
    color: var(--text-secondary); text-decoration: none; transition: color 0.2s ease;
}
.rl-footer__contact-item:hover { color: var(--accent); }
.rl-footer__bottom { border-top: 1px solid rgba(255,255,255,0.04); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
.rl-footer__copy { font-size: 0.8125rem; color: var(--text-muted); }

/* FLOATING CONTACT */
.rl-floating-contact {
    position: fixed; bottom: 2rem; right: 2rem; z-index: 90;
    display: flex; align-items: center; gap: 0.625rem; padding: 0.75rem 1.5rem;
    background: #25d366; color: #fff; border: none; border-radius: 100px;
    font-size: 0.875rem; font-weight: 750; box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}
.rl-floating-contact:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 12px 40px rgba(37, 211, 102, 0.6);
}
.rl-floating-contact__pulse {
    position: absolute; inset: 0; border-radius: 100px;
    border: 2px solid #25d366; animation: contact-pulse 2s infinite;
}
@keyframes contact-pulse {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.2); opacity: 0; }
}
.rl-floating-contact__icon { display: flex; align-items: center; }
.rl-floating-contact__text { font-weight: 700; }

/* MODALS */
.rl-modal-overlay {
    position: fixed; inset: 0; background: rgba(3, 7, 18, 0.8);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    z-index: 200; display: flex; align-items: center; justify-content: center; p: 1.5rem;
}
.rl-modal-card {
    background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
    border-radius: 28px; padding: 2.5rem; width: 100%; max-width: 460px;
    position: relative; box-shadow: 0 30px 70px rgba(0,0,0,0.5);
    animation: modal-enter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modal-enter { 0% { transform: scale(0.9) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
.rl-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem; background: transparent;
    border: none; color: var(--text-muted); font-size: 1.75rem; cursor: pointer;
    line-height: 1; transition: color 0.2s ease;
}
.rl-modal-close:hover { color: var(--text-primary); }
.rl-modal-header { margin-bottom: 2rem; text-align: center; }
.rl-modal-title { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem; }
.rl-modal-body { display: flex; flex-direction: column; gap: 1rem; }
.rl-contact-row {
    display: flex; align-items: center; gap: 1rem; padding: 1.25rem;
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px; text-decoration: none; transition: all 0.2s ease;
    text-align: left;
}
.rl-contact-row:hover {
    border-color: rgba(var(--accent-rgb), 0.3);
    background: rgba(255,255,255,0.05);
}
.rl-contact-info { display: flex; flex-direction: column; }
.rl-contact-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.rl-contact-value { font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); margin-top: 0.125rem; }

/* LIGHT THEME & OVERRIDES FOR ABADIKAN.ID ESTHETICS */
.rl-step-card,
.rl-feature-card,
.rl-pricing-card,
.rl-faq-item,
.rl-testimonial-card,
.rl-modal-card,
.rl-stats__item {
    background: #ffffff !important;
    border: 1px solid rgba(var(--accent-rgb), 0.08) !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04) !important;
    color: var(--text-primary) !important;
}
.rl-step-card:hover,
.rl-feature-card:hover,
.rl-pricing-card:hover,
.rl-faq-item:hover,
.rl-testimonial-card:hover,
.rl-stats__item:hover {
    box-shadow: 0 15px 40px rgba(var(--accent-rgb), 0.08) !important;
    border-color: rgba(var(--accent-rgb), 0.2) !important;
    background: #ffffff !important;
}
.rl-pricing-card--popular {
    background: rgba(var(--accent-rgb), 0.02) !important;
    border: 2px solid var(--accent) !important;
    box-shadow: 0 20px 50px rgba(var(--accent-rgb), 0.15) !important;
}
.rl-step-card__title,
.rl-feature-card__title,
.rl-pricing-card__name,
.rl-pricing-card__price-amount,
.rl-faq-q,
.rl-testimonial-name,
.rl-modal-title {
    color: var(--text-primary) !important;
}
.rl-step-card__desc,
.rl-feature-card__desc,
.rl-pricing-card__feature,
.rl-faq-a,
.rl-testimonial-text {
    color: var(--text-secondary) !important;
}

/* HERO SECTION RED BACKGROUND CONTENT OVERRIDES */
.rl-hero {
    color: #ffffff !important;
}
.rl-hero__heading,
.rl-hero__desc,
.rl-hero__heading-premium,
.rl-hero__perk {
    color: #ffffff !important;
}
.rl-hero__rotating-word {
    color: #ffe4e6 !important;
    text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.rl-hero__badge {
    background: rgba(255, 255, 255, 0.15) !important;
    border: 1px solid rgba(255, 255, 255, 0.25) !important;
    color: #ffffff !important;
}
.rl-hero__badge-dot {
    background: #4ade80 !important;
}
.rl-perspective-phone {
    background: #000000 !important;
    border: 6px solid #151b26 !important;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6) !important;
}

/* ACCENT OVERRIDES FOR CATALOG CARDS */
.theme-card button,
.theme-card a.bg-\[\#E5654B\],
.theme-card button.bg-\[\#E5654B\],
.theme-card a.bg-orange-500,
.theme-card a[href*="demo"],
.theme-card a[href*="buat"] {
    background-color: var(--accent) !important;
    color: #ffffff !important;
}
.theme-card a.bg-\[\#E5654B\]:hover,
.theme-card button.bg-\[\#E5654B\]:hover,
.theme-card a[href*="demo"]:hover,
.theme-card a[href*="buat"]:hover {
    background-color: var(--accent-dark) !important;
}
.theme-card span.text-\[\#E5654B\],
.theme-card span.bg-\[\#E5654B\]\/5,
.theme-card span.bg-orange-50 {
    background-color: rgba(var(--accent-rgb), 0.08) !important;
    color: var(--accent) !important;
    border-color: rgba(var(--accent-rgb), 0.15) !important;
}
.theme-card h4.group-hover\:text-\[\#E5654B\] {
    color: var(--accent) !important;
}
.theme-card h4:hover {
    color: var(--accent) !important;
}

/* GLOBAL BACKGROUND FIXES */
.rl-faq-card {
    background: #ffffff !important;
    border-radius: 16px !important;
    overflow: hidden;
}
.rl-faq-a p {
    color: var(--text-secondary) !important;
}
.rl-testimonial-card__stars {
    color: #f59e0b !important;
    margin-bottom: 0.5rem;
}
.rl-faq-item--open {
    border-color: rgba(var(--accent-rgb), 0.25) !important;
    background: #ffffff !important;
}
.rl-faq-item__a {
    border-top: 1px solid rgba(var(--accent-rgb), 0.08) !important;
}

@media (max-width: 640px) {
    /* Prevent overflow globally */
    .rl-layout-container {
        overflow-x: hidden !important;
        width: 100% !important;
        max-width: 100vw !important;
    }
    
    /* Hero Compact Overrides */
    .rl-hero {
        padding: 7.5rem 1rem 3rem !important;
        overflow: hidden !important;
    }
    .rl-hero__heading {
        font-size: 1.85rem !important;
        line-height: 1.2 !important;
        margin-bottom: 1rem !important;
    }
    .rl-hero__desc {
        font-size: 0.85rem !important;
        margin-bottom: 1.5rem !important;
        line-height: 1.5 !important;
    }
    .rl-hero__perks {
        gap: 0.75rem !important;
        margin-top: 1rem !important;
    }
    .rl-hero__perk {
        font-size: 0.75rem !important;
    }
    .rl-hero__perspective-mockups-container {
        margin-top: 2rem !important;
        max-width: 100% !important;
    }
    
    /* Domain simulator pill */
    .rl-domain-simulator-pill {
        padding: 6px !important;
        border-radius: 28px !important;
        margin: 1rem auto 1.5rem !important;
        border: 1px solid rgba(211, 17, 36, 0.1) !important;
    }
    .rl-domain-simulator-inner {
        flex-direction: row !important;
        align-items: center !important;
        gap: 4px !important;
    }
    .rl-domain-prefix {
        font-size: 0.75rem !important;
        padding-left: 8px !important;
    }
    .rl-domain-input {
        font-size: 0.8rem !important;
        padding: 4px 0 !important;
    }
    .rl-domain-btn {
        width: auto !important;
        padding: 8px 16px !important;
        font-size: 0.75rem !important;
    }
    
    .rl-hero__perspective-stage { height: 260px !important; }
    .rl-perspective-phone { width: 110px !important; height: 210px !important; border-radius: 14px !important; border-width: 4px !important; }
    .rl-perspective-phone__inner { border-radius: 10px !important; }
    .rl-perspective-phone__notch { width: 45px !important; height: 10px !important; border-radius: 0 0 7px 7px !important; }
    .rl-perspective-phone--left { margin-right: -2.25rem !important; }
    .rl-perspective-phone--right { margin-left: -2.25rem !important; }

    /* Stats Compact Overrides */
    .rl-stats {
        padding: 2rem 0.5rem !important;
    }
    .rl-stats__inner {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 0.375rem !important;
    }
    .rl-stats__inner > *:last-child:nth-child(odd) {
        grid-column: span 1 !important;
        max-width: 100% !important;
        margin: 0 !important;
    }
    .rl-stats__item {
        padding: 0.75rem 0.5rem !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03) !important;
        border: 1px solid rgba(var(--accent-rgb), 0.06) !important;
        background: #ffffff !important;
    }
    .rl-stats__icon {
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        font-size: 1rem !important;
        margin-bottom: 0.375rem !important;
    }
    .rl-stats__icon svg {
        width: 18px !important;
        height: 18px !important;
    }
    .rl-stats__val {
        font-size: 0.95rem !important;
        margin-bottom: 0.125rem !important;
    }
    .rl-stats__label {
        font-size: 0.625rem !important;
        line-height: 1.2 !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        width: 100% !important;
    }

    /* Steps (Langkah) Timeline stepper progression layout */
    .rl-how-it-works {
        padding: 3rem 1rem !important;
    }
    .rl-how-it-works__grid {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.5rem !important;
        position: relative !important;
        padding-left: 0.5rem !important;
    }
    /* Stepper connector line */
    .rl-how-it-works__grid::before {
        content: '' !important;
        position: absolute !important;
        left: 1.55rem !important;
        top: 1rem !important;
        bottom: 1rem !important;
        width: 2px !important;
        border-left: 2px dashed rgba(211, 17, 36, 0.25) !important;
        z-index: 1 !important;
    }
    .rl-step-card {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 1rem !important;
        padding: 1rem !important;
        background: #ffffff !important;
        border-radius: 16px !important;
        border: 1px solid rgba(211, 17, 36, 0.08) !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) !important;
        position: relative !important;
        z-index: 2 !important;
        width: 100% !important;
        text-align: left !important;
    }
    .rl-step-card__num {
        background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%) !important;
        -webkit-background-clip: border-box !important;
        -webkit-text-fill-color: #ffffff !important;
        color: #ffffff !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        box-shadow: 0 4px 10px rgba(211, 17, 36, 0.2) !important;
        margin-bottom: 0 !important;
    }
    .rl-step-card__num-text {
        display: none !important;
    }
    .rl-step-card__num-icon {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        -webkit-text-fill-color: initial !important;
    }
    .rl-step-card__num-icon svg {
        stroke: #ffffff !important;
        color: #ffffff !important;
    }
    .rl-step-card__content {
        display: flex !important;
        flex-direction: column !important;
        gap: 0.15rem !important;
    }
    .rl-step-card__title {
        font-size: 0.9rem !important;
        font-weight: 700 !important;
        color: var(--text-primary) !important;
        margin-bottom: 0 !important;
        white-space: normal !important;
        text-overflow: clip !important;
        overflow: visible !important;
    }
    .rl-step-card__desc {
        font-size: 0.75rem !important;
        color: var(--text-secondary) !important;
        line-height: 1.4 !important;
        margin-top: 0 !important;
    }

    /* Features (Fitur) Compact Overrides */
    .rl-features {
        padding: 2rem 0.5rem !important;
    }
    .rl-features__grid {
        grid-template-columns: none !important;
        grid-template-rows: repeat(2, minmax(0, 1fr)) !important;
        grid-auto-flow: column !important;
        grid-auto-columns: calc((100% - 0.75rem) / 3) !important;
        gap: 0.375rem !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        scrollbar-width: none !important;
    }
    .rl-features__grid::-webkit-scrollbar {
        display: none !important;
    }
    .rl-feature-card {
        padding: 0.75rem 0.5rem !important;
        border-radius: 12px !important;
        scroll-snap-align: start !important;
        position: relative !important;
    }
    .rl-feature-card__icon-box {
        width: 32px !important;
        height: 32px !important;
        border-radius: 8px !important;
        margin-bottom: 0.375rem !important;
    }
    .rl-feature-card__icon-box svg {
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

    /* Catalog 3-Column Scroll Row on Mobile */
    .rl-catalog {
        padding: 2.5rem 0.5rem !important;
    }
    .rl-section-title,
    .rl-catalog__title {
        font-size: 1.35rem !important;
        margin-bottom: 2rem !important;
    }
    .rl-catalog__grid,
    .rl-catalog__carousel {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        gap: 0.45rem !important;
        padding: 0.5rem 0.2rem 1.25rem !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
        width: 100% !important;
    }
    .rl-catalog__grid::-webkit-scrollbar,
    .rl-catalog__carousel::-webkit-scrollbar {
        display: none !important;
    }
    
    .rl-catalog__carousel > div {
        width: calc(100% / 3 - 0.3rem) !important;
        flex: 0 0 calc(100% / 3 - 0.3rem) !important;
        scroll-snap-align: start !important;
    }
    .rl-catalog__grid > .theme-card {
        width: calc(100% / 3 - 0.3rem) !important;
        flex: 0 0 calc(100% / 3 - 0.3rem) !important;
        scroll-snap-align: start !important;
    }

    .rl-catalog .theme-card {
        border-radius: 12px !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.03) !important;
    }
    .rl-catalog .theme-card .p-3.5 {
        padding: 0.35rem !important;
    }
    .rl-catalog .theme-card h4 {
        font-size: 0.65rem !important;
        margin-bottom: 0.15rem !important;
        font-weight: 700 !important;
        line-height: 1.25 !important;
    }
    .rl-catalog .theme-card span.capitalize {
        display: none !important; /* Hide category to save space */
    }
    .rl-catalog .theme-card span.tracking-wider {
        font-size: 0.5rem !important;
        padding: 0.1rem 0.3rem !important;
        letter-spacing: 0.01em !important;
    }
    
    /* Overlay actions adjustments for 3-column micro card */
    .rl-catalog .theme-card .absolute.inset-0.bg-black\\/40,
    .rl-catalog .theme-card .absolute.inset-0.bg-black\\/45 {
        background: rgba(0, 0, 0, 0.45) !important;
        padding: 0.25rem !important;
        gap: 0.25rem !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
    }
    .rl-catalog .theme-card .absolute.inset-0.bg-black\\/40 a,
    .rl-catalog .theme-card .absolute.inset-0.bg-black\\/45 button,
    .rl-catalog .theme-card .absolute.inset-0.bg-black\\/45 a {
        padding: 0.25rem 0.35rem !important;
        font-size: 0.55rem !important;
        border-radius: 4px !important;
        white-space: nowrap !important;
        transform: none !important;
        animation: none !important;
        width: 90% !important;
        text-align: center !important;
        box-shadow: none !important;
        height: auto !important;
        line-height: 1.2 !important;
    }

    /* Filters Mobile Stacking Overrides */
    .rl-filter-panel {
        border-radius: 24px !important;
        padding: 0.75rem 1rem !important;
        margin-bottom: 2rem !important;
    }
    .rl-filter-row {
        flex-direction: column !important;
        gap: 0.75rem !important;
        align-items: stretch !important;
    }
    .rl-filter-search-container {
        width: 100% !important;
        border: 1.5px solid rgba(var(--accent-rgb), 0.15) !important;
        border-radius: 100px !important;
        background: #ffffff !important;
        position: relative !important;
        display: flex !important;
        align-items: center !important;
    }
    .rl-filter-search-container svg {
        position: absolute !important;
        left: 1rem !important;
        pointer-events: none !important;
    }
    .rl-filter-search-input {
        padding: 0.6rem 0.6rem 0.6rem 2.5rem !important;
        width: 100% !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        outline: none !important;
    }
    .rl-filter-controls {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        width: 100% !important;
        gap: 0.5rem !important;
    }
    .rl-filter-dropdown-wrapper {
        flex: 1 !important;
    }
    .rl-filter-dropdown-wrapper--sort {
        flex: 0 0 auto !important;
    }
    .rl-filter-btn {
        flex: 1 !important;
        max-width: none !important;
        width: 100% !important;
        justify-content: space-between !important;
        padding: 0.5rem 0.75rem !important;
        font-size: 0.75rem !important;
        border-radius: 100px !important;
        gap: 0.25rem !important;
    }

    /* Dropdown Menus Mobile Stacking & Compaction */
    .rl-filter-dropdown-menu {
        width: 180px !important;
        padding: 0.5rem !important;
        border-radius: 12px !important;
        gap: 0.35rem !important;
    }
    .rl-filter-dropdown-menu-header {
        padding-bottom: 0.3rem !important;
        margin-bottom: 0.2rem !important;
    }
    .rl-filter-dropdown-menu-title {
        font-size: 0.65rem !important;
    }
    .rl-filter-dropdown-menu-reset {
        font-size: 0.6rem !important;
    }
    .rl-filter-dropdown-list {
        max-height: 140px !important;
    }
    .rl-filter-checkbox-label {
        padding: 0.25rem 0.4rem !important;
        font-size: 0.7rem !important;
        gap: 0.35rem !important;
        border-radius: 6px !important;
    }
    .rl-filter-checkbox-input {
        width: 12px !important;
        height: 12px !important;
    }
    .rl-filter-dropdown-list button {
        font-size: 0.7rem !important;
        padding: 0.3rem 0.4rem !important;
    }

    /* Position alignments for each dropdown to stay in view */
    .rl-filter-dropdown-wrapper--category .rl-filter-dropdown-menu {
        left: 0 !important;
        right: auto !important;
        width: 180px !important;
    }
    .rl-filter-dropdown-wrapper--type .rl-filter-dropdown-menu {
        left: 50% !important;
        transform: translateX(-50%) !important;
        right: auto !important;
        width: 180px !important;
    }
    .rl-filter-dropdown-wrapper--sort .rl-filter-dropdown-menu {
        right: 0 !important;
        left: auto !important;
        width: 140px !important;
    }

    /* Modals Compact Overrides */
    .rl-modal-card {
        padding: 1.25rem 1rem !important;
        border-radius: 20px !important;
        width: calc(100% - 2rem) !important;
        max-width: 360px !important;
    }
    .rl-modal-title {
        font-size: 1.1rem !important;
    }
    .rl-contact-row {
        padding: 0.75rem 1rem !important;
        border-radius: 12px !important;
        gap: 0.75rem !important;
    }
    .rl-contact-value {
        font-size: 0.85rem !important;
    }
    .rl-contact-label {
        font-size: 0.65rem !important;
    }

    /* Pricing Section Overrides */
    .rl-pricing {
        padding: 2.5rem 0.5rem !important;
    }
    .rl-pricing__grid {
        display: flex !important;
        flex-direction: row !important;
        overflow-x: auto !important;
        scroll-snap-type: x mandatory !important;
        gap: 0.5rem !important;
        padding: 0.5rem 0.25rem 1.5rem !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
    }
    .rl-pricing__grid::-webkit-scrollbar {
        display: none !important;
    }
    .rl-pricing-card {
        flex: 0 0 calc(50% - 0.25rem) !important;
        scroll-snap-align: start !important;
        padding: 1rem 0.75rem !important;
        border-radius: 16px !important;
        margin-bottom: 0 !important;
        height: auto !important;
        display: flex !important;
        flex-direction: column !important;
    }
    .rl-pricing-card--popular {
        padding: 1rem 0.75rem !important;
    }
    .rl-pricing-card__popular-badge {
        top: -10px !important;
        padding: 0.2rem 0.5rem !important;
        font-size: 0.55rem !important;
    }
    .rl-pricing-card__name {
        font-size: 0.85rem !important;
        margin-bottom: 0.5rem !important;
    }
    .rl-pricing-card__price {
        margin-bottom: 0.75rem !important;
        align-items: baseline !important;
    }
    .rl-pricing-card__price-amount {
        font-size: 1.35rem !important;
    }
    .rl-pricing-card__price-period {
        font-size: 0.65rem !important;
    }
    .rl-pricing-card__desc {
        font-size: 0.7rem !important;
        line-height: 1.3 !important;
        margin-bottom: 0.75rem !important;
    }
    .rl-pricing-card__btn {
        font-size: 0.75rem !important;
        padding: 0.5rem !important;
        margin-top: auto !important;
    }
    .rl-pricing-card div[style*="flex: 1"] {
        margin: 0.75rem 0 !important;
    }
    .rl-pricing-card div[style*="gap: 0.75rem"] {
        gap: 0.375rem !important;
    }
    .rl-pricing-card div[style*="font-size: 0.875rem"] {
        font-size: 0.675rem !important;
    }

    /* FAQ Section Overrides */
    .rl-faq {
        padding: 2rem 0.75rem !important;
    }
    .rl-faq .rl-section-title {
        margin-bottom: 1rem !important;
    }
    .rl-faq__list {
        gap: 0.5rem !important;
    }
    .rl-faq-item {
        border-radius: 10px !important;
        margin-bottom: 0 !important;
    }
    .rl-faq-item__q {
        padding: 0.65rem 0.85rem !important;
        font-size: 0.8rem !important;
    }
    .rl-faq-item__chevron svg {
        width: 14px !important;
        height: 14px !important;
    }
    .rl-faq-item__a {
        padding: 0.5rem 0.85rem 0.75rem 0.85rem !important;
        font-size: 0.725rem !important;
        line-height: 1.4 !important;
        padding-top: 0.5rem !important;
    }

    /* Testimonials Overrides */
    .rl-testimonials {
        padding: 2rem 0.5rem !important;
    }
    .rl-testimonials .rl-section-title {
        margin-bottom: 1rem !important;
    }
    .rl-testi-card {
        padding: 1rem 0.85rem !important;
        border-radius: 12px !important;
        width: 230px !important;
        gap: 0.35rem !important;
    }
    .rl-testi-card__stars svg {
        width: 12px !important;
        height: 12px !important;
    }
    .rl-testi-card__text {
        font-size: 0.725rem !important;
        line-height: 1.35 !important;
    }
    .rl-testi-card__name {
        font-size: 0.725rem !important;
    }
    .rl-testi-card__city {
        font-size: 0.625rem !important;
    }
    .rl-testimonials__marquee {
        gap: 0.75rem !important;
    }

    /* CTA Section Overrides */
    .rl-cta-section {
        padding: 4rem 1rem !important;
        margin: 2rem 1rem !important;
        border-radius: 20px !important;
    }
    .rl-cta-section__title {
        font-size: 1.5rem !important;
    }
    .rl-cta-btn--lg {
        padding: 0.75rem 1.75rem !important;
        font-size: 0.875rem !important;
    }

    /* Banner overrides for mobile */
    .rl-main-banner-section {
        padding-top: 1.5rem !important;
        padding-bottom: 1.5rem !important;
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }
    .rl-main-banner-section .rl-device-mockups-container {
        height: 260px !important;
        transform: scale(0.85);
        margin-top: -1rem;
        margin-bottom: -1rem;
    }
    .rl-main-banner-section h2 {
        font-size: 1.5rem !important;
        line-height: 1.25 !important;
    }
}
`;
