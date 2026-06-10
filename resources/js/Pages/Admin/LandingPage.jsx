import { Head, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
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
    paper_plane: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
    card: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
    briefcase: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z M10 4.5h4V3h-4v1.5z',
    lock: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z M12 14.25v1.5m0 0a.75.75 0 110-1.5z',
    thumb_up: 'M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.919.699 2.114 1.8l.22 1.244a18.069 18.069 0 01-.19 7.375.75.75 0 01-.707.533H10.05a.75.75 0 01-.73-.598l-1.54-6.162a.748.748 0 01.077-.539l1.4-2.8a.75.75 0 00-.638-1.085H6.827z M2.25 21h3v-9h-3v9z',
    megaphone: 'M10.34 15.84a1.8 1.8 0 11-3.6 0M4.5 8.25h3.6a3 3 0 003-3V4.5a3 3 0 016 0v1.5a3 3 0 003 3h1.8a2.25 2.25 0 012.25 2.25v3a2.25 2.25 0 01-2.25 2.25h-1.8a3 3 0 00-3 3V18a3 3 0 01-6 0v-1.5a3 3 0 00-3-3H4.5A2.25 2.25 0 012.25 11.25v-3A2.25 2.25 0 014.5 8.25z',
};

const PREDEFINED_LINKS = [
    { value: '#plans', label: 'Seksi Paket & Harga' },
    { value: '#preview', label: 'Seksi Katalog Tema' },
    { value: '#preview-kartu', label: 'Seksi Katalog Kartu Ucapan' },
    { value: '#faq', label: 'Seksi Tanya Jawab (FAQ)' },
    { value: '#features', label: 'Seksi Fitur Keunggulan' },
    { value: '#how_it_works', label: 'Seksi Cara Kerja' },
    { value: '/register', label: 'Halaman Pendaftaran Reseller' },
    { value: '/login', label: 'Halaman Login Reseller' }
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

export default function LandingPage({ settings, themes, defaultSections, savedSections, currentTheme, currentPalette, heroImage, features = [] }) {
    const { flash, adminRoutePrefix } = usePage().props;

    const getSectionLabel = (key) => {
        if (key === 'banner') return 'Promo & Popup';
        if (key === 'loading_screen') return 'Loading Screen';
        return key.replace(/_/g, ' ');
    };

    // Palette definitions (mirrors PALETTE_MAP in ModernSplit)
    const PALETTES = [
        { id: 'crimson',  name: 'Crimson',   accent: '#d31124', bg: 'linear-gradient(135deg,#d31124,#e11d48)' },
        { id: 'rose',     name: 'Rose',      accent: '#e11d48', bg: 'linear-gradient(135deg,#be123c,#f43f5e)' },
        { id: 'coral',    name: 'Coral',     accent: '#f97316', bg: 'linear-gradient(135deg,#ea580c,#f97316)' },
        { id: 'amber',    name: 'Amber',     accent: '#d97706', bg: 'linear-gradient(135deg,#b45309,#f59e0b)' },
        { id: 'emerald',  name: 'Emerald',   accent: '#059669', bg: 'linear-gradient(135deg,#047857,#10b981)' },
        { id: 'teal',     name: 'Teal',      accent: '#0d9488', bg: 'linear-gradient(135deg,#0f766e,#14b8a6)' },
        { id: 'sky',      name: 'Sky',       accent: '#0284c7', bg: 'linear-gradient(135deg,#0369a1,#0ea5e9)' },
        { id: 'indigo',   name: 'Indigo',    accent: '#4f46e5', bg: 'linear-gradient(135deg,#4338ca,#6366f1)' },
        { id: 'violet',   name: 'Violet',    accent: '#7c3aed', bg: 'linear-gradient(135deg,#6d28d9,#8b5cf6)' },
        { id: 'purple',   name: 'Purple',    accent: '#9333ea', bg: 'linear-gradient(135deg,#7e22ce,#a855f7)' },
        { id: 'fuchsia',  name: 'Fuchsia',   accent: '#c026d3', bg: 'linear-gradient(135deg,#a21caf,#d946ef)' },
        { id: 'slate',    name: 'Slate',     accent: '#475569', bg: 'linear-gradient(135deg,#334155,#64748b)' },
        { id: 'dark',     name: 'Dark Mode', accent: '#e5654b', bg: 'linear-gradient(135deg,#0f172a,#1e293b)' },
        { id: 'forest',   name: 'Forest',    accent: '#15803d', bg: 'linear-gradient(135deg,#166534,#16a34a)' },
        { id: 'burgundy', name: 'Burgundy',  accent: '#9f1239', bg: 'linear-gradient(135deg,#881337,#be123c)' },
    ];

    // Section variant options per section key
    const SECTION_VARIANTS = {
        banner:       [
            { id: 'top_header', label: 'Floating Atas Header', icon: '▬' },
            { id: 'bottom_right', label: 'Floating Kanan Bawah', icon: '◰' },
            { id: 'popup', label: 'Popup Sekali', icon: '⧇' }
        ],
        hero:         [
            { id: 'centered', label: 'Centered', icon: '⬛' },
            { id: 'split', label: 'Split', icon: '◧' },
            { id: 'fullscreen', label: 'Fullscreen', icon: '⬜' },
            { id: 'minimal', label: 'Minimal', icon: '▭' }
        ],
        main_banner:  [
            { id: 'banner_card', label: 'Banner - Box Card', icon: '📦' },
            { id: 'banner_bg', label: 'Banner - Background', icon: '🖼️' },
            { id: 'banner_split', label: 'Banner - Samping', icon: '🎴' }
        ],
        stats:        [{ id: 'strip', label: 'Strip', icon: '▬' }, { id: 'cards', label: 'Cards', icon: '⊞' }, { id: 'bento', label: 'Bento', icon: '⊟' }],
        how_it_works: [{ id: 'horizontal', label: 'Horizontal', icon: '▷▷▷' }, { id: 'timeline', label: 'Timeline', icon: '┇' }, { id: 'numbered', label: 'Numbered', icon: '①②' }],
        features:     [{ id: 'scroll', label: 'Scroll', icon: '➔' }, { id: 'grid', label: 'Grid Cards', icon: '⊞' }, { id: 'list', label: 'Detailed List', icon: '≡' }, { id: 'spotlight', label: 'Spotlight', icon: '⭐' }],
        preview:      [{ id: 'carousel', label: 'Carousel Slider', icon: '↔' }, { id: 'grid', label: 'Grid Layout', icon: '⊞' }, { id: 'featured', label: 'Featured Focus', icon: '⭐' }],
        greeting_cards: [{ id: 'grid', label: 'Grid Layout', icon: '⊞' }, { id: 'carousel', label: 'Carousel Slider', icon: '↔' }, { id: 'list', label: 'Simple List', icon: '≡' }],
        testimonials: [{ id: 'marquee', label: 'Marquee', icon: '↔' }, { id: 'grid', label: 'Grid', icon: '⊞' }, { id: 'quote', label: 'Quote', icon: '❝' }],
        plans:        [{ id: 'cards', label: 'Pricing Cards', icon: '⊞' }, { id: 'stacked', label: 'Row Stacked', icon: '☰' }, { id: 'highlight', label: 'Featured Focus', icon: '⭐' }],
        faq:          [{ id: 'accordion', label: 'Accordion', icon: '≡' }, { id: 'twocol', label: '2 Kolom', icon: '⊟' }, { id: 'grouped', label: 'Grouped', icon: '⊞' }],
        cta:          [{ id: 'dark', label: 'Dark', icon: '■' }, { id: 'split', label: 'Split', icon: '◧' }, { id: 'minimal', label: 'Minimal', icon: '○' }],
    };


    // State definitions
    const [activeTab, setActiveTab] = useState('sections'); // sections, palette, loading
    const [selectedPalette, setSelectedPalette] = useState(currentPalette || 'crimson');
    const initialLoadingStyle = (savedSections || defaultSections)?.find(s => s.key === 'loading_screen')?.config?.style || settings?.landing_page_config?.loading_style || 'pulse';
    const [selectedLoadingStyle, setSelectedLoadingStyle] = useState(initialLoadingStyle);
    const [sections, setSections] = useState(savedSections || defaultSections);
    const [selectedSectionKey, setSelectedSectionKey] = useState(null);
    const [heroImgUrl, setHeroImgUrl] = useState(heroImage || null);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    
    // States for icon picker and collapsible accordion content items
    const [activeIconPickerIdx, setActiveIconPickerIdx] = useState(null);
    const [expandedItemIdx, setExpandedItemIdx] = useState(0);
    const [isVariantDropdownOpen, setIsVariantDropdownOpen] = useState(false);
    const [isLoadingDropdownOpen, setIsLoadingDropdownOpen] = useState(false);

    // Reset editor popup collapsible indices when changing edited section
    useEffect(() => {
        setExpandedItemIdx(0);
        setActiveIconPickerIdx(null);
        setIsVariantDropdownOpen(false);
        setIsLoadingDropdownOpen(false);
    }, [selectedSectionKey]);
    
    const [previewMode, setPreviewMode] = useState('mobile'); // mobile, desktop
    const [uploadingHero, setUploadingHero] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);

    const iframeRef = useRef(null);
    const dragItemIndex = useRef(null);

    // Filter active sections for rendering
    const activeSections = sections.filter(s => s.active);

    // Effect to handle real-time postMessage to iframe when state changes
    useEffect(() => {
        updatePreview();
    }, [sections, selectedPalette, heroImgUrl, selectedLoadingStyle]);

    const updatePreview = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'landing_page_preview',
                config: {
                    theme: 'modern-split',
                    palette: selectedPalette,
                    sections: sections,
                    heroImage: heroImgUrl,
                    loading_style: selectedLoadingStyle
                }
            }, '*');
        }
    };

    const scrollToSectionInIframe = (sectionKey) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'scroll_to_section',
                sectionKey: sectionKey
            }, '*');
        }
    };

    useEffect(() => {
        if (selectedSectionKey) {
            setTimeout(() => {
                scrollToSectionInIframe(selectedSectionKey);
            }, 250);
        }
    }, [selectedSectionKey]);

    // Listen to iframe load event to immediately push the current configuration
    const handleIframeLoad = () => {
        setTimeout(updatePreview, 800);
    };

    // Drag & Drop Handlers (HTML5 pure React)
    const handleDragStart = (index) => {
        dragItemIndex.current = index;
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex) => {
        const sourceIndex = dragItemIndex.current;
        if (sourceIndex === null || sourceIndex === targetIndex) return;

        const updatedSections = [...sections];
        const draggedItem = updatedSections[sourceIndex];
        updatedSections.splice(sourceIndex, 1);
        updatedSections.splice(targetIndex, 0, draggedItem);

        // Reassign orders
        const reordered = updatedSections.map((item, idx) => ({
            ...item,
            order: idx + 1
        }));

        setSections(reordered);
        dragItemIndex.current = null;
    };

    // Switch section active state
    const toggleSection = (key) => {
        setSections(prev => prev.map(s => {
            if (s.key === key) {
                return { ...s, active: !s.active };
            }
            return s;
        }));
    };

    // Update section config fields dynamically
    const updateSectionConfigField = (sectionKey, field, value) => {
        setSections(prev => prev.map(s => {
            if (s.key === sectionKey) {
                return {
                    ...s,
                    config: {
                        ...s.config,
                        [field]: value
                    }
                };
            }
            return s;
        }));
    };

    // Update nested array item in config (e.g. perks, stats, steps, FAQs, testimonials)
    const updateSectionConfigArrayItem = (sectionKey, arrayField, index, itemField, value) => {
        setSections(prev => prev.map(s => {
            if (s.key === sectionKey) {
                const newArray = [...(s.config[arrayField] || [])];
                if (itemField === null) {
                    // Simple string array
                    newArray[index] = value;
                } else {
                    // Object array
                    newArray[index] = { ...newArray[index], [itemField]: value };
                }
                return {
                    ...s,
                    config: {
                        ...s.config,
                        [arrayField]: newArray
                    }
                };
            }
            return s;
        }));
    };

    const addSectionConfigArrayItem = (sectionKey, arrayField, defaultObj) => {
        setSections(prev => prev.map(s => {
            if (s.key === sectionKey) {
                const newArray = [...(s.config[arrayField] || []), defaultObj];
                return {
                    ...s,
                    config: {
                        ...s.config,
                        [arrayField]: newArray
                    }
                };
            }
            return s;
        }));
    };

    const removeSectionConfigArrayItem = (sectionKey, arrayField, index) => {
        setSections(prev => prev.map(s => {
            if (s.key === sectionKey) {
                const newArray = [...(s.config[arrayField] || [])];
                newArray.splice(index, 1);
                return {
                    ...s,
                    config: {
                        ...s.config,
                        [arrayField]: newArray
                    }
                };
            }
            return s;
        }));
    };

    // Save full page configuration
    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const res = await axios.put(`${adminRoutePrefix}/landing-page/config`, {
                theme: 'modern-split',
                palette: selectedPalette,
                sections: sections,
                loading_style: selectedLoadingStyle
            });
            if (res.data?.success) {
                showToast('Sukses', 'Konfigurasi landing page berhasil disimpan!');
            }
        } catch (err) {
            showToast('Error', 'Gagal menyimpan konfigurasi.');
        } finally {
            setSaving(false);
        }
    };

    // Handle Hero Image Background Upload
    const handleHeroImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('hero_image', file);

        setUploadingHero(true);
        try {
            const res = await axios.post(`${adminRoutePrefix}/landing-page/hero-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.success) {
                setHeroImgUrl(res.data.url);
                // Also update the section config
                updateSectionConfigField('hero', 'hero_image', res.data.url);
                showToast('Sukses', 'Gambar background hero berhasil diunggah!');
            }
        } catch (err) {
            showToast('Error', 'Gagal mengunggah gambar. Pastikan format gambar sesuai.');
        } finally {
            setUploadingHero(false);
        }
    };

    // Remove custom background image
    const handleHeroImageRemove = async () => {
        if (!confirm('Hapus gambar background hero?')) return;
        try {
            const res = await axios.delete(`${adminRoutePrefix}/landing-page/hero-image`);
            if (res.data?.success) {
                setHeroImgUrl(null);
                updateSectionConfigField('hero', 'hero_image', null);
                showToast('Sukses', 'Gambar background hero dihapus.');
            }
        } catch (err) {
            showToast('Error', 'Gagal menghapus gambar background.');
        }
    };

    const handleBannerImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('hero_image', file);
        formData.append('section', 'main_banner');

        setUploadingBanner(true);
        try {
            const res = await axios.post(`${adminRoutePrefix}/landing-page/hero-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.success) {
                updateSectionConfigField('main_banner', 'banner_image', res.data.url);
                showToast('Sukses', 'Gambar banner utama berhasil diunggah!');
            }
        } catch (err) {
            console.error('Upload error details:', err);
            const serverMsg = err.response?.data?.message || 
                              (err.response?.data?.errors && Object.values(err.response.data.errors).flat()[0]) || 
                              err.message;
            showToast('Error', `Gagal mengunggah gambar banner. (${serverMsg})`);
        } finally {
            setUploadingBanner(false);
        }
    };

    const handleBannerImageRemove = async () => {
        if (!confirm('Hapus gambar banner utama?')) return;
        try {
            const res = await axios.delete(`${adminRoutePrefix}/landing-page/hero-image?section=main_banner`);
            if (res.data?.success) {
                updateSectionConfigField('main_banner', 'banner_image', null);
                showToast('Sukses', 'Gambar banner utama dihapus.');
            }
        } catch (err) {
            showToast('Error', 'Gagal menghapus gambar banner.');
        }
    };

    const showToast = (title, message) => {
        setToast({ title, message });
        setTimeout(() => setToast(null), 3000);
    };

    // Selected section object
    const selectedSection = sections.find(s => s.key === selectedSectionKey);

    return (
        <DynamicAdminLayout title="Halaman Landing Page Builder">
            <Head title="Landing Page Builder" />
            
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-[#1a1a1a]">Landing Page Builder</h2>
                    <p className="text-[#999] text-sm mt-1">Kustomisasi halaman pendaftaran reseller Anda secara visual dengan drag & drop section</p>
                </div>
                <button
                    onClick={handleSaveConfig}
                    disabled={saving}
                    className="px-6 py-3 bg-[#E5654B] text-white text-sm font-extrabold rounded-xl hover:bg-[#d55a42] transition-all shadow-sm hover:shadow-md disabled:opacity-50 inline-flex items-center gap-2"
                >
                    {saving ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4" />
                    )}
                    Simpan Perubahan
                </button>
            </div>

            {/* Toast message */}
            {toast && typeof document !== 'undefined' && createPortal(
                <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3 animate-slide-up max-w-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">{toast.title}</div>
                        <div className="text-xs text-[#999] mt-1">{toast.message}</div>
                    </div>
                </div>,
                document.body
            )}
            
            {/* 2-Panel Main Layout */}
            <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-190px)]">
                
                {/* ═══ PANEL 1: LEFT SIDEBAR (SECTIONS & THEMES LIST) ═══ */}
                <div className="w-full lg:w-[50%] xl:w-[45%] bg-white border border-[#e8e5e0] rounded-2xl flex flex-col h-full overflow-hidden flex-shrink-0">
                    <div className="flex border-b border-[#e8e5e0]">
                        <button
                            onClick={() => { setActiveTab('sections'); setSelectedSectionKey(null); }}
                            className={`flex-1 py-3 text-xs font-black tracking-wider uppercase border-b-2 text-center transition-all ${activeTab === 'sections' ? 'border-[#E5654B] text-[#E5654B]' : 'border-transparent text-[#999] hover:text-[#555]'}`}
                        >
                            Struktur Halaman
                        </button>
                        <button
                            onClick={() => { setActiveTab('palette'); setSelectedSectionKey(null); }}
                            className={`flex-1 py-3 text-xs font-black tracking-wider uppercase border-b-2 text-center transition-all ${activeTab === 'palette' ? 'border-[#E5654B] text-[#E5654B]' : 'border-transparent text-[#999] hover:text-[#555]'}`}
                        >
                            🎨 Palet Warna
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* ═══ TAB: Sections list ═══ */}
                        {activeTab === 'sections' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black tracking-wider uppercase text-slate-400">
                                        Tarik Handle ☰ Untuk Urutan
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    {sections.map((section, index) => (
                                        <div
                                            key={section.key}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={() => handleDrop(index)}
                                            onClick={() => {
                                                if (section.active) {
                                                    scrollToSectionInIframe(section.key);
                                                }
                                            }}
                                            className={`flex items-center justify-between p-3.5 bg-white border border-[#e8e5e0] rounded-xl cursor-pointer hover:border-[#E5654B]/40 hover:shadow-sm transition-all ${
                                                !section.active ? 'opacity-50 border-dashed bg-slate-50/50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Drag handle */}
                                                <button
                                                    type="button"
                                                    className="text-slate-400 hover:text-slate-650 cursor-grab active:cursor-grabbing p-1"
                                                    title="Tarik untuk memindahkan"
                                                >
                                                    <Icon d="M4 8h16M4 16h16" className="w-4 h-4" />
                                                </button>
                                                
                                                <div>
                                                    <div className="text-xs font-extrabold text-[#333] capitalize">
                                                        {getSectionLabel(section.key)}
                                                    </div>
                                                    <div className="text-[9px] text-[#999] mt-0.5 font-bold">
                                                        Order #{section.order}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {/* Edit Content Button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedSectionKey(section.key);
                                                    }}
                                                    className="p-1 text-[#E5654B] hover:text-[#d55a42] hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit Konten"
                                                >
                                                    <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487Zm0 0L19.5 7.125" className="w-4 h-4" />
                                                </button>
                                                
                                                {/* Toggle visibility */}
                                                <label 
                                                    className="relative inline-flex items-center cursor-pointer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={section.active}
                                                        onChange={() => toggleSection(section.key)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#E5654B] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        

                        {/* ═══ TAB: Palette Picker ═══ */}
                        {activeTab === 'palette' && (
                            <div className="space-y-4">
                                <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-2">
                                    Pilih Warna Tema
                                </span>
                                <div className="grid grid-cols-5 gap-2">
                                    {PALETTES.map(pal => {
                                        const isSelected = selectedPalette === pal.id;
                                        return (
                                            <button
                                                key={pal.id}
                                                title={pal.name}
                                                onClick={() => setSelectedPalette(pal.id)}
                                                className={`relative aspect-square rounded-xl overflow-hidden transition-all hover:scale-105 ${
                                                    isSelected ? 'ring-2 ring-offset-2 ring-[#E5654B] scale-105' : ''
                                                }`}
                                                style={{ background: pal.bg }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
                                                            <svg className="w-2.5 h-2.5" fill="none" stroke="#333" viewBox="0 0 24 24" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* Selected palette info */}
                                <div className="mt-3 p-3 bg-white border border-[#e8e5e0] rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: PALETTES.find(p=>p.id===selectedPalette)?.bg || '' }} />
                                    <div>
                                        <div className="text-xs font-extrabold text-[#333]">{PALETTES.find(p=>p.id===selectedPalette)?.name}</div>
                                        <div className="text-[10px] text-[#999] mt-0.5">Warna aktif</div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                                    💡 Warna diterapkan ke seluruh halaman landing. Klik Simpan untuk menyimpan.
                                </p>
                            </div>
                        )}


                    </div>
                </div>

                {/* ═══ PANEL 2: RIGHT PREVIEW (SCALED LIVE IFRAME) ═══ */}
                <div className="hidden lg:flex flex-1 items-start justify-center">
                    <div className="sticky top-4 flex flex-col items-center">
                        <div className="w-[288px] h-[610px] relative overflow-visible">
                            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: 'scale(0.8)', width: '360px', height: '762px' }}>
                                <div className="w-[360px] h-[762px] bg-zinc-950 rounded-[2.5rem] shadow-2xl border-[8px] border-gray-800 overflow-hidden relative">
                                    {/* Premium Dynamic Island */}
                                    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[90px] h-6 bg-black rounded-full z-20 flex items-center justify-between px-2.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_1px_2px_rgba(0,0,0,0.4)] pointer-events-none border border-black/40">
                                        {/* Left camera lens dot */}
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d12] flex items-center justify-center border border-gray-900/30">
                                            <div className="w-1 h-1 rounded-full bg-[#1c1c3c] opacity-60" />
                                        </div>
                                        {/* Right sensor indicator */}
                                        <div className="w-1 h-1 rounded-full bg-[#0d0d12] opacity-40" />
                                    </div>
                                    <div className="w-full h-full overflow-hidden relative">
                                        <iframe
                                            key={`${selectedPalette}-${previewKey}`}
                                            ref={iframeRef}
                                            src={`${adminRoutePrefix}/landing-page/preview?preview=1&palette=${selectedPalette}&k=${previewKey}`}
                                            className="absolute top-0 left-0 border-0 border-none select-none"
                                            style={{
                                                width: '430px',
                                                height: '932px',
                                                transform: 'scale(0.8)',
                                                transformOrigin: 'top left',
                                            }}
                                            onLoad={handleIframeLoad}
                                            title="Preview Landing Page"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-3 flex items-center justify-center gap-2">
                            <span className="text-xs text-gray-400">
                                Live Preview
                            </span>
                            <button onClick={() => setPreviewKey(k => k + 1)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                title="Refresh Preview">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Popup Editor Modal */}
            {selectedSection && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl border border-[#e8e5e0] shadow-2xl flex flex-col w-full max-w-2xl max-h-[85vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-white border-b border-[#e8e5e0] p-4 flex items-center justify-between">
                            <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                                Edit Konten: {getSectionLabel(selectedSection.key)}
                            </span>
                            <button
                                onClick={() => setSelectedSectionKey(null)}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                            >
                                <Icon d="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${selectedSection.key === 'loading_screen' ? 'pb-64' : ''}`}>
                            
                            {/* ══ VARIANT PICKER DROPDOWN ══ */}
                            {SECTION_VARIANTS[selectedSection.key] && (
                                <div className="relative z-30">
                                    <label className="block text-[10px] font-black tracking-wider uppercase text-slate-500 mb-2">
                                        🎨 Layout / Variant Tampilan
                                    </label>
                                    
                                    {(() => {
                                        const variants = SECTION_VARIANTS[selectedSection.key];
                                        const currentVal = selectedSection.config?.variant || variants[0].id;
                                        const activeVar = variants.find(v => v.id === currentVal) || variants[0];
                                        
                                        return (
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsVariantDropdownOpen(!isVariantDropdownOpen)}
                                                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e8e5e0] hover:border-[#E5654B] rounded-2xl transition-all shadow-sm group text-left"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xl bg-orange-50 text-[#E5654B] w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                            {activeVar.icon}
                                                        </span>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800">{activeVar.label}</div>
                                                            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Aktif</div>
                                                        </div>
                                                    </div>
                                                    <span className={`text-slate-400 transition-transform duration-200 ${isVariantDropdownOpen ? 'rotate-180' : ''}`}>
                                                        <Icon d="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4" />
                                                    </span>
                                                </button>

                                                {/* Dropdown Menu Overlay */}
                                                {isVariantDropdownOpen && (
                                                    <>
                                                        {/* Invisible backdrop to close on click outside */}
                                                        <div 
                                                            className="fixed inset-0 z-40 bg-transparent" 
                                                            onClick={() => setIsVariantDropdownOpen(false)} 
                                                        />
                                                        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                                            {variants.map(v => {
                                                                const isSelected = v.id === currentVal;
                                                                return (
                                                                    <button
                                                                        key={v.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            updateSectionConfigField(selectedSection.key, 'variant', v.id);
                                                                            setIsVariantDropdownOpen(false);
                                                                        }}
                                                                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                                                                            isSelected 
                                                                                ? 'bg-orange-50/50 text-[#E5654B] font-extrabold' 
                                                                                : 'hover:bg-slate-50 text-slate-655'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <span className={`text-lg w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-orange-100 text-[#E5654B]' : 'bg-slate-100 text-slate-500'}`}>
                                                                                {v.icon}
                                                                            </span>
                                                                            <span className="text-xs font-semibold">{v.label}</span>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <span className="text-[#E5654B]">
                                                                                <Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 stroke-[3]" />
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* ══ SECTION: LOADING SCREEN ══ */}
                            {selectedSection.key === 'loading_screen' && (
                                <div className="space-y-6">
                                    <div>
                                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 block mb-2">
                                            Pilih Gaya Animasi Loading Halaman
                                        </span>
                                        <p className="text-xs text-slate-500 font-medium mb-4">
                                            Kustomisasi tampilan pembuka (preloader) sebelum halaman landing selesai memuat. Pilih salah satu dari pilihan menarik di bawah ini.
                                        </p>
                                    </div>
                                    
                                    <div className="relative z-30">
                                        {(() => {
                                            const styles = [
                                                { id: 'pulse', label: 'Pulse Logo (Klasik)', desc: 'Logo/inisial brand yang berdenyut lembut dengan lingkaran gradasi luar yang berputar secara dinamis.', icon: '🔄' },
                                                { id: 'glass', label: 'Glassmorphic Shimmer (Premium)', desc: 'Panel kaca frosted mewah dengan logo brand bernafas lembut dan progress bar shimmer gradasi yang futuristik.', icon: '✨' },
                                                { id: 'rings', label: 'Concentric Rings (Elegan)', desc: 'Cincin orbit ganda yang saling berputar berlawanan arah dengan pendar glow inisial brand di pusatnya.', icon: '🪐' },
                                                { id: 'bar', label: 'Minimalist Top Bar (Sederhana)', desc: 'Indikator progress tipis berkilau di bagian paling atas layar dengan logo brand yang memudar lembut.', icon: '▬' },
                                                { id: 'envelope', label: 'Thematic Envelope (Romantis)', desc: 'Animasi amplop pernikahan yang terbuka dan mengeluarkan kartu undangan berdenyut cinta. Sangat estetik!', icon: '✉️' },
                                            ];
                                            const currentStyleId = selectedSection.config?.style || 'pulse';
                                            const activeStyle = styles.find(s => s.id === currentStyleId) || styles[0];
                                            
                                            return (
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsLoadingDropdownOpen(!isLoadingDropdownOpen)}
                                                        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#e8e5e0] hover:border-[#E5654B] rounded-2xl transition-all shadow-sm group text-left"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xl bg-orange-50 text-[#E5654B] w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                {activeStyle.icon}
                                                            </span>
                                                            <div>
                                                                <div className="text-xs font-bold text-slate-800">{activeStyle.label}</div>
                                                                <div className="text-[10px] text-slate-400 font-semibold leading-relaxed truncate max-w-[380px]">{activeStyle.desc}</div>
                                                            </div>
                                                        </div>
                                                        <span className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${isLoadingDropdownOpen ? 'rotate-180' : ''}`}>
                                                            <Icon d="M19.5 8.25l-7.5 7.5-7.5-7.5" className="w-4 h-4" />
                                                        </span>
                                                    </button>

                                                    {/* Dropdown Menu Overlay */}
                                                    {isLoadingDropdownOpen && (
                                                        <>
                                                            {/* Invisible backdrop to close on click outside */}
                                                            <div 
                                                                className="fixed inset-0 z-40 bg-transparent" 
                                                                onClick={() => setIsLoadingDropdownOpen(false)} 
                                                            />
                                                            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[320px] overflow-y-auto">
                                                                {styles.map(s => {
                                                                    const isSelected = s.id === currentStyleId;
                                                                    return (
                                                                        <button
                                                                            key={s.id}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                updateSectionConfigField('loading_screen', 'style', s.id);
                                                                                setSelectedLoadingStyle(s.id);
                                                                                setIsLoadingDropdownOpen(false);
                                                                                if (iframeRef.current && iframeRef.current.contentWindow) {
                                                                                    iframeRef.current.contentWindow.postMessage({
                                                                                        type: 'replay_preloader',
                                                                                        loading_style: s.id
                                                                                    }, '*');
                                                                                }
                                                                            }}
                                                                            className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                                                                                isSelected 
                                                                                    ? 'bg-orange-50/50 text-[#E5654B] font-extrabold' 
                                                                                    : 'hover:bg-slate-50 text-slate-655'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                <span className={`text-lg w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? 'bg-orange-100 text-[#E5654B]' : 'bg-slate-100 text-slate-500'}`}>
                                                                                    {s.icon}
                                                                                </span>
                                                                                <div>
                                                                                    <div className="text-xs font-bold">{s.label}</div>
                                                                                    <div className="text-[10px] text-slate-500 mt-0.5 font-medium leading-relaxed">{s.desc}</div>
                                                                                </div>
                                                                            </div>
                                                                            {isSelected && (
                                                                                <span className="text-[#E5654B] flex-shrink-0 ml-2">
                                                                                    <Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 stroke-[3]" />
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: BANNER ══ */}
                            {selectedSection.key === 'banner' && (

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Teks Promo</label>
                                        <textarea
                                            value={selectedSection.config.text || ''}
                                            onChange={e => updateSectionConfigField('banner', 'text', e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none resize-none transition-colors"
                                            placeholder="Cth: 🔥 Promo Spesial: Aktifkan paket premium hari ini & dapatkan diskon langsung hingga 50%! Sisa waktu: {countdown}"
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                                            💡 Tip: Gunakan <code className="bg-slate-150 text-slate-800 px-1 rounded font-mono">{`{countdown}`}</code> di dalam teks untuk menampilkan waktu hitung mundur secara dinamis.
                                        </p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 bg-orange-50/40 p-4 rounded-xl border border-orange-100/70">
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSection.config.show_countdown !== false}
                                                    onChange={e => updateSectionConfigField('banner', 'show_countdown', e.target.checked)}
                                                    className="rounded border-[#e8e5e0] text-[#E5654B] focus:ring-[#E5654B]"
                                                />
                                                <span className="text-xs font-extrabold text-[#333] uppercase tracking-wide">Tampilkan Hitung Mundur</span>
                                            </label>
                                            <p className="text-[9px] text-[#999] mt-1 ml-5">
                                                Aktifkan hitung mundur harian otomatis per user.
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Durasi Hitung Mundur (Jam)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="168"
                                                value={selectedSection.config.countdown_duration ?? 19}
                                                onChange={e => updateSectionConfigField('banner', 'countdown_duration', parseInt(e.target.value, 10) || 19)}
                                                className="w-full px-3 py-2 bg-white border border-[#e8e5e0] focus:border-[#E5654B] rounded-xl text-xs outline-none transition-colors"
                                                disabled={selectedSection.config.show_countdown === false}
                                            />
                                            <p className="text-[9px] text-[#999] mt-1">
                                                Akan mulai dari angka ini untuk setiap user baru dan di-reset setiap hari.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Teks Tombol CTA</label>
                                            <input
                                                type="text"
                                                value={selectedSection.config.cta_text || ''}
                                                onChange={e => updateSectionConfigField('banner', 'cta_text', e.target.value)}
                                                className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                placeholder="Cth: Daftar Sekarang"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Link CTA</label>
                                            {(() => {
                                                const currentLink = selectedSection.config.cta_link || '';
                                                const isPredefined = PREDEFINED_LINKS.some(opt => opt.value === currentLink);
                                                const selectedOption = currentLink === '' ? '#plans' : (isPredefined ? currentLink : 'custom');

                                                return (
                                                    <div className="space-y-2">
                                                        <select
                                                            value={selectedOption}
                                                            onChange={e => {
                                                                const val = e.target.value;
                                                                if (val === 'custom') {
                                                                    updateSectionConfigField('banner', 'cta_link', '');
                                                                } else {
                                                                    updateSectionConfigField('banner', 'cta_link', val);
                                                                }
                                                            }}
                                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                        >
                                                            {PREDEFINED_LINKS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                            <option value="custom">URL Kustom (Input Manual)</option>
                                                        </select>
                                                        
                                                        {selectedOption === 'custom' && (
                                                            <input
                                                                type="text"
                                                                value={currentLink}
                                                                onChange={e => updateSectionConfigField('banner', 'cta_link', e.target.value)}
                                                                className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors placeholder:text-gray-300"
                                                                placeholder="Masukkan URL kustom (cth: https://google.com atau link whatsapp)"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Background Promo (Color/Gradient)</label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={selectedSection.config.bg_color || ''}
                                                        onChange={e => updateSectionConfigField('banner', 'bg_color', e.target.value)}
                                                        className="w-full pl-3 pr-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                        placeholder="Cth: #E5654B atau linear-gradient(...)"
                                                    />
                                                </div>
                                                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-300 cursor-pointer flex-shrink-0 shadow-sm hover:border-[#E5654B] transition-colors" title="Pilih Warna Visual">
                                                    <input
                                                        type="color"
                                                        value={
                                                            selectedSection.config.bg_color && selectedSection.config.bg_color.startsWith('#') && selectedSection.config.bg_color.length === 7 
                                                                ? selectedSection.config.bg_color 
                                                                : '#e5654b'
                                                        }
                                                        onChange={e => updateSectionConfigField('banner', 'bg_color', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    />
                                                    <div 
                                                        className="w-full h-full" 
                                                        style={{ 
                                                            background: selectedSection.config.bg_color || '#e5654b' 
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-extrabold text-[#333] mb-1.5 uppercase tracking-wide">Warna Teks</label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative flex-1">
                                                    <input
                                                        type="text"
                                                        value={selectedSection.config.text_color || ''}
                                                        onChange={e => updateSectionConfigField('banner', 'text_color', e.target.value)}
                                                        className="w-full pl-3 pr-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                        placeholder="Cth: #ffffff"
                                                    />
                                                </div>
                                                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-300 cursor-pointer flex-shrink-0 shadow-sm hover:border-[#E5654B] transition-colors" title="Pilih Warna Visual">
                                                    <input
                                                        type="color"
                                                        value={
                                                            selectedSection.config.text_color && selectedSection.config.text_color.startsWith('#') && selectedSection.config.text_color.length === 7 
                                                                ? selectedSection.config.text_color 
                                                                : '#ffffff'
                                                        }
                                                        onChange={e => updateSectionConfigField('banner', 'text_color', e.target.value)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                    />
                                                    <div 
                                                        className="w-full h-full border border-slate-200" 
                                                        style={{ 
                                                            background: selectedSection.config.text_color || '#ffffff' 
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: HERO ══ */}
                            {selectedSection.key === 'hero' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-extrabold text-[#333] mb-2 uppercase tracking-wide">Gambar Background Hero (Reseller Custom)</label>
                                        <div className="flex items-center gap-4">
                                            {heroImgUrl && (
                                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img src={heroImgUrl} alt="Hero bg" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="px-4 py-2 bg-[#f5f3f0] text-slate-600 hover:bg-[#e8e5e0] text-xs font-bold rounded-xl cursor-pointer transition-colors inline-block">
                                                    {uploadingHero ? 'Mengunggah...' : 'Upload Background'}
                                                    <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" disabled={uploadingHero} />
                                                </label>
                                                {heroImgUrl && (
                                                    <button type="button" onClick={handleHeroImageRemove} className="text-xs text-red-500 hover:text-red-700 block font-semibold">
                                                        Hapus Background Custom
                                                    </button>
                                                )}
                                                <p className="text-[10px] text-[#bbb]">Format: JPG, PNG, WebP. Maksimal 4MB. Resolusi disarankan: 1920x1080.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Badge Atas</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.badge_text || ''}
                                            onChange={e => updateSectionConfigField('hero', 'badge_text', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama (Title)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('hero', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Tambahan (Subtitle)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('hero', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                                        <textarea
                                            value={selectedSection.config.description || ''}
                                            onChange={e => updateSectionConfigField('hero', 'description', e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B] resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tombol Utama</label>
                                            <input
                                                type="text"
                                                value={selectedSection.config.cta_primary_text || ''}
                                                onChange={e => updateSectionConfigField('hero', 'cta_primary_text', e.target.value)}
                                                className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tombol Kedua</label>
                                            <input
                                                type="text"
                                                value={selectedSection.config.cta_secondary_text || ''}
                                                onChange={e => updateSectionConfigField('hero', 'cta_secondary_text', e.target.value)}
                                                className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-slate-700">Perks / Poin Keunggulan Kecil</label>
                                            <button
                                                type="button"
                                                onClick={() => addSectionConfigArrayItem('hero', 'perks', 'Keunggulan baru')}
                                                className="text-[10px] font-black text-emerald-600"
                                            >
                                                + Tambah Poin
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {(selectedSection.config.perks || []).map((perk, pIdx) => (
                                                <div key={pIdx} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={perk}
                                                        onChange={e => updateSectionConfigArrayItem('hero', 'perks', pIdx, null, e.target.value)}
                                                        className="flex-1 px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSectionConfigArrayItem('hero', 'perks', pIdx)}
                                                        className="text-red-500 text-xs px-2"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: MAIN BANNER ══ */}
                            {selectedSection.key === 'main_banner' && (
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-extrabold text-[#333] mb-2 uppercase tracking-wide">Gambar Banner Utama</label>
                                        <div className="flex items-center gap-4">
                                            {selectedSection.config.banner_image && (
                                                <div className="w-24 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                                    <img src={selectedSection.config.banner_image} alt="Banner" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <label className="px-4 py-2 bg-[#f5f3f0] text-slate-600 hover:bg-[#e8e5e0] text-xs font-bold rounded-xl cursor-pointer transition-colors inline-block">
                                                    {uploadingBanner ? 'Mengunggah...' : 'Upload Banner'}
                                                    <input type="file" accept="image/*" onChange={handleBannerImageUpload} className="hidden" disabled={uploadingBanner} />
                                                </label>
                                                {selectedSection.config.banner_image && (
                                                    <button type="button" onClick={handleBannerImageRemove} className="text-xs text-red-500 hover:text-red-700 block font-semibold">
                                                        Hapus Gambar Banner
                                                    </button>
                                                )}
                                                <p className="text-[10px] text-[#bbb]">Format: JPG, PNG, WebP. Maksimal 4MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Overlay (Opsional)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('main_banner', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Subjudul Overlay (Opsional)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('main_banner', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Link Klik Banner (URL / Section Hash)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.cta_link || ''}
                                            onChange={e => updateSectionConfigField('main_banner', 'cta_link', e.target.value)}
                                            placeholder="contoh: #plans"
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Tinggi Banner</label>
                                        <select
                                            value={selectedSection.config.height || 'medium'}
                                            onChange={e => updateSectionConfigField('main_banner', 'height', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none focus:border-[#E5654B]"
                                        >
                                            <option value="small">Kecil (250px)</option>
                                            <option value="medium">Sedang (380px)</option>
                                            <option value="large">Besar (500px)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: STATS ══ */}
                            {selectedSection.key === 'stats' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-extrabold text-[#333] uppercase tracking-wide">Item Statistik</label>
                                        <button
                                            type="button"
                                            onClick={() => addSectionConfigArrayItem('stats', 'items', { val: '100%', label: 'Label Stat', icon: 'lightning' })}
                                            className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-black rounded-lg transition-colors"
                                        >
                                            + Tambah Stat
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {(selectedSection.config.items || []).map((item, idx) => {
                                            const isExpanded = expandedItemIdx === idx;
                                            return (
                                                <div key={idx} className={`p-4 bg-white border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-slate-300 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                                                    {/* Card Header */}
                                                    <div 
                                                        onClick={() => setExpandedItemIdx(isExpanded ? null : idx)}
                                                        className="flex items-center justify-between cursor-pointer select-none"
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <span className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">#{idx + 1}</span>
                                                            {ICON_PACK[item.icon] ? (
                                                                <svg className="w-4 h-4 text-[#E5654B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d={ICON_PACK[item.icon]} />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-xs leading-none">{item.icon || '❓'}</span>
                                                            )}
                                                            <span className="text-xs font-bold text-slate-700">{item.label || 'Item Statistik'}</span>
                                                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-extrabold">{item.val || '-'}</span>
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeSectionConfigArrayItem('stats', 'items', idx);
                                                                }}
                                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold"
                                                            >
                                                                Hapus
                                                            </button>
                                                            <span className="text-slate-400 text-[10px] ml-1">{isExpanded ? '▲' : '▼'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Card Body */}
                                                    {isExpanded && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
                                                            {/* Visual Icon Picker */}
                                                            <div className="relative">
                                                                <label className="block text-[10px] text-gray-400 font-extrabold mb-1 uppercase tracking-wide">Icon / Gambar</label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setActiveIconPickerIdx(activeIconPickerIdx === idx ? null : idx)}
                                                                    className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#e8e5e0] hover:border-slate-400 rounded-xl text-xs outline-none transition-colors"
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        {ICON_PACK[item.icon] ? (
                                                                            <svg className="w-4 h-4 text-[#E5654B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d={ICON_PACK[item.icon]} />
                                                                            </svg>
                                                                        ) : (
                                                                            <span className="text-sm leading-none">{item.icon || '❓'}</span>
                                                                        )}
                                                                        <span className="text-[10px] font-bold text-slate-700 truncate">
                                                                            {ICON_PACK[item.icon] ? item.icon : 'Emoji'}
                                                                        </span>
                                                                    </span>
                                                                    <span className="text-gray-400 text-[10px]">▼</span>
                                                                </button>

                                                                {activeIconPickerIdx === idx && (
                                                                    <div className="absolute left-0 mt-1 z-50 p-3 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl w-64 max-h-56 overflow-y-auto">
                                                                        <p className="text-[9px] text-[#bbb] font-extrabold uppercase tracking-wider mb-2">Pilih Icon Modern</p>
                                                                        <div className="grid grid-cols-5 gap-1.5 mb-3">
                                                                            {Object.keys(ICON_PACK).map(key => (
                                                                                <button
                                                                                    key={key}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        updateSectionConfigArrayItem('stats', 'items', idx, 'icon', key);
                                                                                        setActiveIconPickerIdx(null);
                                                                                    }}
                                                                                    className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                                                                                        item.icon === key 
                                                                                            ? 'border-[#E5654B] bg-[#E5654B]/5 text-[#E5654B] scale-105' 
                                                                                            : 'border-slate-100 hover:border-slate-300 text-slate-500 hover:bg-slate-50'
                                                                                    }`}
                                                                                    title={key}
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <path d={ICON_PACK[key]} />
                                                                                    </svg>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                        <div className="border-t border-slate-100 pt-2">
                                                                            <label className="block text-[9px] text-[#bbb] font-extrabold uppercase tracking-wider mb-1.5">Atau Tulis Emoji Kustom</label>
                                                                            <input
                                                                                type="text"
                                                                                value={ICON_PACK[item.icon] ? '' : item.icon}
                                                                                onChange={e => updateSectionConfigArrayItem('stats', 'items', idx, 'icon', e.target.value)}
                                                                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#E5654B] focus:bg-white"
                                                                                placeholder="Cth: 🎨, 💌, ⚡"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold mb-1 uppercase tracking-wide">Nilai</label>
                                                                <input
                                                                    type="text"
                                                                    value={item.val || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('stats', 'items', idx, 'val', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                                    placeholder="Cth: 20+"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold mb-1 uppercase tracking-wide">Label</label>
                                                                <input
                                                                    type="text"
                                                                    value={item.label || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('stats', 'items', idx, 'label', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                                    placeholder="Cth: Desain"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: HOW IT WORKS ══ */}
                            {selectedSection.key === 'how_it_works' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('how_it_works', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>

                                    <label className="block text-xs font-extrabold text-[#333] uppercase tracking-wide">Langkah - Langkah (Steps)</label>
                                    <div className="space-y-3">
                                        {(selectedSection.config.steps || []).map((step, idx) => {
                                            const isExpanded = expandedItemIdx === idx;
                                            return (
                                                <div key={idx} className={`p-4 bg-white border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-slate-300 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                                                    {/* Card Header */}
                                                    <div 
                                                        onClick={() => setExpandedItemIdx(isExpanded ? null : idx)}
                                                        className="flex items-center justify-between cursor-pointer select-none"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-lg bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center text-[10px] font-black">
                                                                {step.num || `0${idx + 1}`}
                                                            </span>
                                                            <span className="text-xs font-bold text-slate-800">{step.title || 'Langkah Baru'}</span>
                                                        </span>
                                                        <span className="text-slate-400 text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                                                    </div>

                                                    {/* Card Body */}
                                                    {isExpanded && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Judul Langkah</label>
                                                                <input
                                                                    type="text"
                                                                    value={step.title || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('how_it_works', 'steps', idx, 'title', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Deskripsi Langkah</label>
                                                                <textarea
                                                                    value={step.desc || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('how_it_works', 'steps', idx, 'desc', e.target.value)}
                                                                    rows={2}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none resize-none transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: FEATURES ══ */}
                            {selectedSection.key === 'features' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('features', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('features', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-[#e8e5e0]">
                                        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">Daftar Fitur Tersedia</h4>
                                        <p className="text-[11px] text-gray-500 mb-4">Centang fitur yang ingin Anda aktifkan di Landing Page, serta sesuaikan nama dan keterangannya.</p>
                                        
                                        <div className="space-y-3">
                                            {features.map((f) => {
                                                const custom = selectedSection.config.features_custom?.[f.slug] || {};
                                                const isEnabled = custom.is_enabled !== false;
                                                const customName = custom.name !== undefined ? custom.name : f.name;
                                                const defaultDesc = f.description || DEFAULT_DESCRIPTIONS[f.slug] || '';
                                                const customDesc = custom.description !== undefined ? custom.description : defaultDesc;
                                                
                                                const categoriesMap = {
                                                    content: 'Konten',
                                                    settings: 'Pengaturan',
                                                    other: 'Lainnya'
                                                };

                                                return (
                                                    <div key={f.id} className="p-3 bg-white border border-[#e8e5e0] rounded-2xl space-y-3 shadow-sm">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-xs font-bold text-slate-700">{f.name}</span>
                                                                <span className="text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                                                                    {categoriesMap[f.category] || f.category}
                                                                </span>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isEnabled}
                                                                    onChange={e => {
                                                                        const currentCustom = selectedSection.config.features_custom || {};
                                                                        const featureConf = currentCustom[f.slug] || {};
                                                                        const updatedCustom = {
                                                                            ...currentCustom,
                                                                            [f.slug]: {
                                                                                ...featureConf,
                                                                                is_enabled: e.target.checked
                                                                            }
                                                                        };
                                                                        updateSectionConfigField('features', 'features_custom', updatedCustom);
                                                                    }}
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E5654B]"></div>
                                                            </label>
                                                        </div>
                                                        
                                                        {isEnabled && (
                                                            <div className="space-y-2 border-t border-[#faf9f6] pt-2">
                                                                <div>
                                                                    <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Nama Kustom</label>
                                                                    <input
                                                                        type="text"
                                                                        value={customName}
                                                                        onChange={e => {
                                                                            const currentCustom = selectedSection.config.features_custom || {};
                                                                            const featureConf = currentCustom[f.slug] || {};
                                                                            const updatedCustom = {
                                                                                ...currentCustom,
                                                                                [f.slug]: {
                                                                                    ...featureConf,
                                                                                    name: e.target.value
                                                                                }
                                                                            };
                                                                            updateSectionConfigField('features', 'features_custom', updatedCustom);
                                                                        }}
                                                                        className="w-full px-3 py-1.5 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Deskripsi Kustom</label>
                                                                    <textarea
                                                                        value={customDesc}
                                                                        onChange={e => {
                                                                            const currentCustom = selectedSection.config.features_custom || {};
                                                                            const featureConf = currentCustom[f.slug] || {};
                                                                            const updatedCustom = {
                                                                                ...currentCustom,
                                                                                [f.slug]: {
                                                                                    ...featureConf,
                                                                                    description: e.target.value
                                                                                }
                                                                            };
                                                                            updateSectionConfigField('features', 'features_custom', updatedCustom);
                                                                        }}
                                                                        rows={2}
                                                                        className="w-full px-3 py-1.5 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none resize-none transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: PREVIEW (KATALOG TEMA) ══ */}
                            {selectedSection.key === 'preview' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('preview', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('preview', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Style Tampilan</label>
                                        <select
                                            value={selectedSection.config.style || 'carousel'}
                                            onChange={e => updateSectionConfigField('preview', 'style', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        >
                                            <option value="carousel">Carousel (Scroll Horizontal)</option>
                                            <option value="grid">Responsive Grid</option>
                                        </select>
                                        
                                        {/* Style Preview Helper */}
                                        {(selectedSection.config.style || 'carousel') === 'carousel' ? (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">🎠</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Tampilan Slider (Carousel)</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Katalog desain tersusun menyamping (horizontal scroll). Pengunjung dapat menggeser (slide) ke kanan/kiri untuk melihat koleksi tema.</div>
                                                    <div className="flex gap-1.5 mt-2 overflow-x-hidden opacity-60">
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-6 h-8 bg-[#E5654B]/10 rounded-md border border-dashed border-[#E5654B]/20 flex-shrink-0" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">📱</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Tampilan Grid</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Katalog desain tersusun dalam kisi (grid) kolom-dan-baris yang rapi ke bawah. Semua tema langsung terlihat sekaligus.</div>
                                                    <div className="grid grid-cols-3 gap-1.5 mt-2 opacity-60">
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: GREETING CARDS ══ */}
                            {selectedSection.key === 'greeting_cards' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('greeting_cards', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('greeting_cards', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Style Tampilan</label>
                                        <select
                                            value={selectedSection.config.style || 'carousel'}
                                            onChange={e => updateSectionConfigField('greeting_cards', 'style', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        >
                                            <option value="carousel">Carousel (Scroll Horizontal)</option>
                                            <option value="grid">Responsive Grid</option>
                                        </select>
                                        
                                        {/* Style Preview Helper */}
                                        {(selectedSection.config.style || 'carousel') === 'carousel' ? (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">🎠</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Tampilan Slider (Carousel)</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Kartu ucapan tersusun menyamping (horizontal scroll). Pengunjung dapat menggeser (slide) ke kanan/kiri untuk melihat berbagai pilihan kartu.</div>
                                                    <div className="flex gap-1.5 mt-2 overflow-x-hidden opacity-60">
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-12 h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 flex-shrink-0" />
                                                        <div className="w-6 h-8 bg-[#E5654B]/10 rounded-md border border-dashed border-[#E5654B]/20 flex-shrink-0" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">📱</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Tampilan Grid</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Kartu ucapan tersusun dalam kisi (grid) kolom-dan-baris yang rapi ke bawah. Semua kartu ucapan langsung terlihat sekaligus.</div>
                                                    <div className="grid grid-cols-3 gap-1.5 mt-2 opacity-60">
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: TESTIMONIALS ══ */}
                            {selectedSection.key === 'testimonials' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('testimonials', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('testimonials', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Style Tampilan</label>
                                        <select
                                            value={selectedSection.config.style || 'marquee'}
                                            onChange={e => updateSectionConfigField('testimonials', 'style', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        >
                                            <option value="marquee">Scrolling Marquee</option>
                                            <option value="grid">Responsive Grid</option>
                                            <option value="list">Daftar Vertikal (List)</option>
                                        </select>
                                        
                                        {/* Style Preview Helper */}
                                        {(selectedSection.config.style || 'marquee') === 'marquee' ? (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">⚡</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Teks Berjalan (Marquee)</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Testimoni berjalan otomatis secara horizontal dari kanan ke kiri, memberikan efek tampilan yang dinamis, modern, dan interaktif.</div>
                                                    <div className="flex gap-1.5 mt-2 overflow-hidden opacity-60">
                                                        <div className="px-2.5 py-1 bg-[#E5654B]/10 border border-[#E5654B]/20 rounded-lg text-[8px] font-bold text-[#E5654B] flex-shrink-0 flex items-center gap-1">« Testimoni A</div>
                                                        <div className="px-2.5 py-1 bg-[#E5654B]/10 border border-[#E5654B]/20 rounded-lg text-[8px] font-bold text-[#E5654B] flex-shrink-0 flex items-center gap-1">« Testimoni B</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (selectedSection.config.style || 'marquee') === 'grid' ? (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">📱</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Tampilan Grid</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Testimoni disusun berdampingan dalam grid kolom-dan-baris. Sangat cocok dan rapi jika isi pesan testimoni cenderung pendek dan seragam.</div>
                                                    <div className="grid grid-cols-3 gap-1.5 mt-2 opacity-60">
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                        <div className="h-8 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2.5 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl flex gap-3 items-start text-xs text-[#E5654B] animate-fade-in">
                                                <div className="text-lg flex-shrink-0 mt-0.5">📋</div>
                                                <div className="flex-1">
                                                    <div className="font-extrabold text-[#E5654B] text-[11px] uppercase tracking-wide">Daftar Vertikal (List)</div>
                                                    <div className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">Testimoni disusun memanjang ke bawah secara berurutan, satu per satu.</div>
                                                    <div className="flex flex-col gap-1 mt-2 opacity-60">
                                                        <div className="h-4.5 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 w-full" />
                                                        <div className="h-4.5 bg-[#E5654B]/20 rounded-md border border-[#E5654B]/30 w-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-xs font-bold text-slate-700">Daftar Testimoni</label>
                                            <button
                                                type="button"
                                                onClick={() => addSectionConfigArrayItem('testimonials', 'items', { name: 'Nama Klien', city: 'Kota', text: 'Tulis testimoninya di sini.', stars: 5 })}
                                                className="text-[10px] font-black text-emerald-600"
                                            >
                                                + Tambah Testimoni
                                            </button>
                                        </div>

                                        {(selectedSection.config.items || []).map((t, idx) => (
                                            <div key={idx} className="p-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl relative space-y-3">
                                                <button
                                                    type="button"
                                                    onClick={() => removeSectionConfigArrayItem('testimonials', 'items', idx)}
                                                    className="absolute top-2 right-3 text-red-500 text-[10px] font-bold"
                                                >
                                                    Hapus
                                                </button>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[9px] text-gray-400 font-semibold mb-1">Nama</label>
                                                        <input
                                                            type="text"
                                                            value={t.name || ''}
                                                            onChange={e => updateSectionConfigArrayItem('testimonials', 'items', idx, 'name', e.target.value)}
                                                            className="w-full px-2 py-1 bg-white border border-[#e8e5e0] rounded-lg text-xs"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[9px] text-gray-400 font-semibold mb-1">Kota</label>
                                                        <input
                                                            type="text"
                                                            value={t.city || ''}
                                                            onChange={e => updateSectionConfigArrayItem('testimonials', 'items', idx, 'city', e.target.value)}
                                                            className="w-full px-2 py-1 bg-white border border-[#e8e5e0] rounded-lg text-xs"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-[9px] text-gray-400 font-semibold mb-1">Bintang (Rating)</label>
                                                        <select
                                                            value={t.stars || 5}
                                                            onChange={e => updateSectionConfigArrayItem('testimonials', 'items', idx, 'stars', parseInt(e.target.value))}
                                                            className="w-full px-2 py-1 bg-white border border-[#e8e5e0] rounded-lg text-xs"
                                                        >
                                                            <option value={5}>5 Bintang</option>
                                                            <option value={4}>4 Bintang</option>
                                                            <option value={3}>3 Bintang</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-[9px] text-gray-400 font-semibold mb-1">Pesan Testimoni</label>
                                                    <textarea
                                                        value={t.text || ''}
                                                        onChange={e => updateSectionConfigArrayItem('testimonials', 'items', idx, 'text', e.target.value)}
                                                        rows={2}
                                                        className="w-full px-2 py-1 bg-white border border-[#e8e5e0] rounded-lg text-xs resize-none"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: PLANS ══ */}
                            {selectedSection.key === 'plans' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('plans', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('plans', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: FAQ ══ */}
                            {selectedSection.key === 'faq' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-judul Section (Tag)</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.subtitle || ''}
                                            onChange={e => updateSectionConfigField('faq', 'subtitle', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('faq', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 mb-2">
                                        <label className="block text-xs font-bold text-slate-700">Daftar Pertanyaan & Jawaban (Q&A)</label>
                                        <button
                                            type="button"
                                            onClick={() => addSectionConfigArrayItem('faq', 'items', { q: 'Pertanyaan baru?', a: 'Jawaban singkat.' })}
                                            className="text-[10px] font-black text-emerald-600"
                                        >
                                            + Tambah FAQ
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {(selectedSection.config.items || []).map((faq, idx) => {
                                            const isExpanded = expandedItemIdx === idx;
                                            return (
                                                <div key={idx} className={`p-4 bg-white border rounded-2xl transition-all duration-300 ${isExpanded ? 'border-slate-300 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}>
                                                    {/* Card Header */}
                                                    <div 
                                                        onClick={() => setExpandedItemIdx(isExpanded ? null : idx)}
                                                        className="flex items-center justify-between cursor-pointer select-none"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black">Q</span>
                                                            <span className="text-xs font-bold text-slate-800 truncate max-w-[280px]">{faq.q || 'Pertanyaan Baru'}</span>
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeSectionConfigArrayItem('faq', 'items', idx);
                                                                }}
                                                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold"
                                                            >
                                                                Hapus
                                                            </button>
                                                            <span className="text-slate-400 text-[10px] ml-1">{isExpanded ? '▲' : '▼'}</span>
                                                        </div>
                                                    </div>

                                                    {/* Card Body */}
                                                    {isExpanded && (
                                                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Pertanyaan (Question)</label>
                                                                <input
                                                                    type="text"
                                                                    value={faq.q || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('faq', 'items', idx, 'q', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none transition-colors"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[10px] text-gray-400 font-extrabold uppercase mb-1">Jawaban (Answer)</label>
                                                                <textarea
                                                                    value={faq.a || ''}
                                                                    onChange={e => updateSectionConfigArrayItem('faq', 'items', idx, 'a', e.target.value)}
                                                                    rows={3}
                                                                    className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] focus:border-[#E5654B] focus:bg-white rounded-xl text-xs outline-none resize-none transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ══ SECTION: CTA ══ */}
                            {selectedSection.key === 'cta' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama Section</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.title || ''}
                                            onChange={e => updateSectionConfigField('cta', 'title', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Teks Tombol CTA</label>
                                        <input
                                            type="text"
                                            value={selectedSection.config.cta_text || ''}
                                            onChange={e => updateSectionConfigField('cta', 'cta_text', e.target.value)}
                                            className="w-full px-3 py-2 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-xs outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="bg-[#faf9f6] border-t border-[#e8e5e0] p-4 flex justify-end">
                            <button
                                onClick={() => setSelectedSectionKey(null)}
                                className="px-6 py-2.5 bg-[#E5654B] text-white text-xs font-black rounded-xl hover:bg-[#d55a42] transition-all"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DynamicAdminLayout>
    );
}
