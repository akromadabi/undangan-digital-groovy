import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ThemePreviewCard from '@/Components/ThemePreviewCard';
import GreetingCardPreviewCard from '@/Components/GreetingCardPreviewCard';


// Brand Partnership Logos (10 Distinct Premium Brands for Infinite Scrolling Ticker)
const PARTNERS = [
    {
        name: 'Mahkota Wedding',
        desc: 'Premium Organizer',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
            </svg>
        )
    },
    {
        name: 'Sakinah Planner',
        desc: 'Syari Wedding',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.173-.44.83-.44 1.002 0l2.235 5.707a.5.5 0 00.478.337l6.148.492c.476.038.667.62.322.956l-4.7 4.582a.5.5 0 00-.144.444l1.457 6.027c.113.468-.377.825-.79.578l-5.326-2.82a.5.5 0 00-.466 0l-5.326 2.82c-.413.247-.903-.11-.79-.578l1.457-6.027a.5.5 0 00-.144-.444l-4.7-4.582c-.345-.336-.154-.918.322-.956l6.148-.492a.5.5 0 00.478-.337l2.235-5.707z" />
            </svg>
        )
    },
    {
        name: 'Vows & Co',
        desc: 'Creative Studio',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
        )
    },
    {
        name: 'Jannah Organizer',
        desc: 'Executive Planner',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296" />
            </svg>
        )
    },
    {
        name: 'Elegant Day',
        desc: 'Luxury Organizer',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        )
    },
    {
        name: 'Signature Vows',
        desc: 'Modern Boutique',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M6 6h12M6 10h12M6 14h12M6 18h12" />
            </svg>
        )
    },
    {
        name: 'Forever Planner',
        desc: 'Classic Wedding',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 8H4.75A1.75 1.75 0 003 16.75v3.5c0 .966.784 1.75 1.75 1.75H12m0-6h7.25A1.75 1.75 0 0121 16.75v3.5c0 .966-.784 1.75-1.75 1.75H12" />
            </svg>
        )
    },
    {
        name: 'Meridian Wedding',
        desc: 'Destination Planner',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V9a2 2 0 00-2-2h-1.072a2 2 0 01-1.414-.586l-2.828-2.828A2 2 0 008 3.935z" />
            </svg>
        )
    },
    {
        name: 'Serenade Story',
        desc: 'Romantic Wedding',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        )
    },
    {
        name: 'Aura Wedding',
        desc: 'Traditional Planner',
        icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
        )
    }
];

// Reseller Specific FAQs
const RESELLER_FAQ = [
    {
        question: "Apakah saya membutuhkan hosting atau server sendiri?",
        answer: "Sama sekali tidak! Seluruh sistem dashboard agensi Anda beserta website undangan digital milik klien Anda akan di-host secara gratis dan aman di infrastruktur server cloud super cepat kami. Kami yang mengelola keamanan, optimasi kecepatan, dan pemeliharaan server secara penuh."
    },
    {
        question: "Bagaimana cara saya menerima pembayaran dari pembeli?",
        answer: "Klien Anda akan mentransfer pembayaran penuh langsung ke rekening bank atau dompet digital Anda sendiri. Sistem kami mendukung White-Label penagihan manual, yang berarti Anda memegang kendali keuangan 100% dan langsung menikmati keuntungan saat itu juga."
    },
    {
        question: "Apakah nama platform utama akan terlihat oleh klien saya?",
        answer: "Tidak sama sekali. Sistem kami dirancang 100% White-Label. Klien Anda hanya akan melihat nama brand Anda, logo agensi Anda, dan domain/subdomain pilihan Anda (contoh: undangan.brandkamu.com). Mereka tidak akan pernah mengetahui keterkaitan dengan sistem utama kami."
    },
    {
        question: "Bagaimana cara menghubungkan custom domain milik saya?",
        answer: "Sangat mudah! Anda hanya perlu membeli domain di penyedia domain favorit Anda (seperti Niagahoster, Domainesia, dll), lalu arahkan DNS (A Record) ke IP server kami yang telah disediakan di menu pengaturan domain dashboard Anda. Tim developer kami siap mendampingi proses propagasi hingga SSL HTTPS aktif gratis."
    },
    {
        question: "Apakah ada batasan jumlah undangan yang bisa saya jual?",
        answer: "Tergantung pada paket lisensi reseller yang Anda ambil di platform kami. Setiap paket kemitraan memberikan alokasi kuota undangan premium yang melimpah sehingga Anda dapat memaksimalkan profit penjualan ke pasar potensial Anda."
    }
];

const featuresList = [
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: '100% White-Label', 
        desc: 'Gunakan logo, nama brand, dan domain Anda sendiri secara utuh.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
            </svg>
        ),
        title: 'Custom Domain', 
        desc: 'Hubungkan domain pribadi agar platform terlihat lebih profesional.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V3.75a3 3 0 013-3h13.5a3 3 0 013 3v7.5a3 3 0 01-3 3 M5.25 14.25a3 3 0 00-3 3v3.75a3 3 0 003 3h13.5a3 3 0 003-3v-3.75a3 3 0 00-3-3M16.5 7.5h.008v.008H16.5V7.5zm0 9h.008v.008H16.5v-.008z" />
            </svg>
        ),
        title: 'Free Server & SSL', 
        desc: 'Hosting, server cloud, dan SSL gratis kami kelola sepenuhnya.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Dashboard Klien Mandiri', 
        desc: 'Klien mendesain sendiri undangan & RSVP secara mandiri.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 003.498 0l.251-.11a3.375 3.375 0 000-5.714l-.251-.11a3.375 3.375 0 00-3.498 0l-.251.11A3.375 3.375 0 0012 18.182zm0 0V21m0-15V3m0 0a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
        ),
        title: 'Atur Harga & Uang Langsung', 
        desc: 'Tentukan harga sendiri. Uang langsung masuk ke rekening Anda.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.096-.813 9.814-9.814a2.25 2.25 0 00-3.182-3.182l-9.814 9.814zm0 0L14.25 18M3 3h3.5v3.5H3V3zm0 9h3.5v3.5H3V12zm0 9h3.5v3.5H3V21z" />
            </svg>
        ),
        title: '20+ Pilihan Tema Premium', 
        desc: 'Puluhan template undangan responsif & premium siap pakai.' 
    }
];

const invitationFeaturesList = [
    {
        title: 'Sampul & Layar Sapa',
        desc: 'Sampul depan elegan dengan nama tamu kustom dan animasi layar sapa.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
            </svg>
        )
    },
    {
        title: 'Profil Mempelai Lengkap',
        desc: 'Tampilkan foto profil, media sosial, silsilah keluarga, & detail mempelai.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        )
    },
    {
        title: 'Acara & Peta Navigasi',
        desc: 'Detail akad, resepsi, peta Google Maps, dan tombol penunjuk jalan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
        )
    },
    {
        title: 'Galeri Foto & Video',
        desc: 'Galeri momen bahagia prewedding dan sematan video pernikahan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
        )
    },
    {
        title: 'Kisah Cinta (Love Story)',
        desc: 'Timeline kisah perjalanan cinta romantis dari awal bertemu hingga pelaminan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        )
    },
    {
        title: 'Amplop & Kado Digital',
        desc: 'Terima hadiah uang tunai langsung ke rekening bank atau dompet digital.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
        )
    },
    {
        title: 'Buku Tamu & RSVP',
        desc: 'Buku ucapan doa restu serta konfirmasi kehadiran real-time.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        )
    },
    {
        title: 'Save the Date Pengingat',
        desc: 'Fitur pengingat agenda acara yang otomatis tersinkron ke Google Calendar.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
            </svg>
        )
    },
    {
        title: 'Turut Mengundang',
        desc: 'Daftar nama perwakilan keluarga besar atau kerabat dekat yang turut mengundang.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        title: 'Panduan Dresscode',
        desc: 'Panduan dresscode/aturan busana bagi tamu undangan agar harmonis.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 9l-4.5-1.636m0 0V2.25" />
            </svg>
        )
    },
    {
        title: 'Video Pernikahan',
        desc: 'Fitur untuk menyematkan video prewedding romantis Anda langsung dari YouTube.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
        )
    },
    {
        title: 'Manajemen Daftar Tamu',
        desc: 'Kelola database daftar tamu undangan tak terbatas dengan tautan unik kustom.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.05 20c-1.84 0-3.578-.44-5.112-1.222V18.77c0-2.68 2.28-4.87 5.093-4.87 2.813 0 5.093 2.19 5.093 4.87v.358" />
            </svg>
        )
    },
    {
        title: 'Musik Latar Belakang',
        desc: 'Putar musik romantis pilihan secara otomatis untuk mengiringi undangan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        )
    },
    {
        title: 'Kirim WhatsApp Otomatis',
        desc: 'Kirimkan link undangan personalisasi secara massal ke nomor WhatsApp tamu.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
        )
    },
    {
        title: 'Instagram AR Filter',
        desc: 'Akses link kustom filter Instagram khusus untuk melengkapi hari pernikahan Anda.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175" />
            </svg>
        )
    },
    {
        title: 'Efek Partikel Animasi',
        desc: 'Hiasi layar undangan dengan guguran bunga Sakura, salju, atau love melayang.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15 8 14.187 9 9l.813 5.187L15 15l-5.187.904z" />
            </svg>
        )
    },
    {
        title: 'Check-in QR Code',
        desc: 'Proses check-in cepat tamu undangan di lokasi resepsi dengan scan kode QR.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
            </svg>
        )
    },
    {
        title: 'Bebas Ganti Desain',
        desc: 'Bebas mengubah pilihan template desain dan warna undangan tanpa batas.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
        )
    },
    {
        title: 'Hitung Mundur Acara',
        desc: 'Tampilkan countdown waktu menuju akad nikah/resepsi pengantin.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: 'Protokol Kesehatan',
        desc: 'Informasi himbauan kepatuhan protokol kesehatan bagi tamu undangan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623c5.176-1.332 9-6.03 9-11.622c0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        )
    },
    {
        title: 'Kutipan Doa Indah',
        desc: 'Sematan kutipan ayat suci Al-Quran atau kata mutiara pernikahan.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18" />
            </svg>
        )
    },
    {
        title: 'Keamanan Data Modern',
        desc: 'Amankan database dari penyalahgunaan dengan protokol enkripsi modern.',
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A11.983 11.983 0 002.25 12c0 3.328 1.353 6.34 3.536 8.525m12.35 1.232A11.984 11.984 0 0021.75 12c0-3.328-1.353-6.34-3.536-8.525" />
            </svg>
        )
    }
];

// Shared sort helper — used in all theme catalog pages
export function sortThemes(themes, sortKey, likesMap = {}) {
    const arr = [...themes];
    if (sortKey === 'terbaru') {
        return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    if (sortKey === 'populer') {
        return arr.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
    }
    if (sortKey === 'disukai') {
        return arr.sort((a, b) => {
            const bLikes = (likesMap[b.id] ?? ((b.base_likes || 0) + (b.real_likes || 0)));
            const aLikes = (likesMap[a.id] ?? ((a.base_likes || 0) + (a.real_likes || 0)));
            return bLikes - aLikes;
        });
    }
    return arr;
}

const SORT_OPTIONS = [
    { key: 'terbaru', label: 'Terbaru' },
    { key: 'populer', label: 'Terpopuler' },
    { key: 'disukai', label: 'Terfavorit' },
];

// ─────────────────────────────────────────────────────────────────────
const APP_SLIDES = [
    {
        id: 1,
        label: 'Landing Page Partner',
        badge: 'Landing Page Partner',
        content: (
            <img src="/images/hero_mobile_1.png" alt="Landing Page Partner" className="w-full h-full object-cover object-top rounded-[1.6rem]" />
        )
    },
    {
        id: 2,
        label: 'Dashboard Panel',
        badge: 'Dashboard Panel',
        content: (
            <img src="/images/hero_mobile_2.png" alt="Dashboard Panel" className="w-full h-full object-cover object-top rounded-[1.6rem]" />
        )
    },
    {
        id: 3,
        label: 'Pengaturan Agensi',
        badge: 'Brand & White-Label',
        content: (
            <img src="/images/hero_mobile_3.png" alt="Pengaturan Agensi" className="w-full h-full object-cover object-top rounded-[1.6rem]" />
        )
    },
    {
        id: 4,
        label: 'Katalog Tema Premium',
        badge: 'Pilihan Tema',
        content: (
            <img src="/images/hero_mobile_4.png" alt="Katalog Tema Premium" className="w-full h-full object-cover object-top rounded-[1.6rem]" />
        )
    }
];

const CLONED_SLIDES = [
    APP_SLIDES[APP_SLIDES.length - 2], // Slide 3 at index 0
    APP_SLIDES[APP_SLIDES.length - 1], // Slide 4 at index 1
    ...APP_SLIDES,                     // Slides 1, 2, 3, 4 at index 2, 3, 4, 5
    APP_SLIDES[0],                     // Slide 1 at index 6
    APP_SLIDES[1]                      // Slide 2 at index 7
];

function HeroSection({ mounted, resellerCount, invitationCount, themesCount, appName, canRegister }) {
    const [slideIndex, setSlideIndex] = useState(2);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timerRef = useRef(null);

    const activeSlide = (slideIndex - 2 + APP_SLIDES.length) % APP_SLIDES.length;

    const handleNext = useCallback(() => {
        setSlideIndex(prev => prev + 1);
        setIsTransitioning(true);
    }, []);

    const handlePrev = useCallback(() => {
        setSlideIndex(prev => prev - 1);
        setIsTransitioning(true);
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            handleNext();
        }, 3500);
        return () => clearInterval(timerRef.current);
    }, [handleNext]);

    useEffect(() => {
        if (slideIndex === 6) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setSlideIndex(2);
            }, 500);
            return () => clearTimeout(timer);
        }
        if (slideIndex === 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setSlideIndex(5);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [slideIndex]);

    useEffect(() => {
        if (!isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleDotClick = (idx) => {
        clearInterval(timerRef.current);
        setIsTransitioning(true);
        setSlideIndex(idx + 2);
        timerRef.current = setInterval(() => {
            handleNext();
        }, 3500);
    };

    // Touch swipe handlers for Hero Carousel
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            clearInterval(timerRef.current);
            handleNext();
            timerRef.current = setInterval(() => {
                handleNext();
            }, 3500);
        }
        if (isRightSwipe) {
            clearInterval(timerRef.current);
            handlePrev();
            timerRef.current = setInterval(() => {
                handleNext();
            }, 3500);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden pt-20" style={{background: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0E8 40%, #FEE8D6 100%)'}}>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30" style={{background: 'radial-gradient(circle, #ffd4c2 0%, transparent 70%)', transform: 'translate(30%, -30%)'}} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #ffb347 0%, transparent 70%)', transform: 'translate(-30%, 30%)'}} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* LEFT: Text + CTA */}
                <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-orange-200/60 shadow-sm mb-7 reveal-on-scroll reveal-down">
                        <svg className="w-3.5 h-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                        🚀 Undangan Digital Self Servis
                    </div>

                    {/* H1 */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.1] tracking-tight reveal-on-scroll reveal-up" style={{ transitionDelay: '150ms' }}>
                        Mulai Bisnis<br/>
                        <span className="text-[#E5654B] relative inline-block mr-2 select-none">
                            Undangan
                            <svg className="absolute left-0 -bottom-1.5 w-full h-2.5 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                                <path
                                    d="M3,5 C35,2.5 70,2.5 97,4 C65,5.5 35,6.5 5,7.5"
                                    stroke="#E5654B"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        strokeDasharray: 200,
                                        strokeDashoffset: mounted ? 0 : 200,
                                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
                                    }}
                                />
                            </svg>
                        </span>
                        <span className="text-[#E5654B] relative inline-block select-none">
                            Digital
                            <svg className="absolute left-0 -bottom-1.5 w-full h-2.5 overflow-visible" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none">
                                <path
                                    d="M3,5 C35,3 65,3 97,4.5 C60,6 30,7 5,8"
                                    stroke="#E5654B"
                                    strokeWidth="4.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        strokeDasharray: 200,
                                        strokeDashoffset: mounted ? 0 : 200,
                                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.75s'
                                    }}
                                />
                            </svg>
                        </span>{' '}
                        <br className="hidden sm:block"/>
                        dengan Brandmu Sendiri
                    </h1>

                    {/* Desc */}
                    <p className="text-gray-600 mt-6 max-w-md text-base leading-relaxed reveal-on-scroll reveal-up" style={{ transitionDelay: '300ms' }}>
                        Sistem otomatisasi penuh, klien buat undangannya sendiri / self-service, pakai merk & domain Anda sendiri, dan terima pembayaran langsung 100% ke rekening Anda!
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3.5 mt-8 w-full sm:w-auto reveal-on-scroll reveal-up" style={{ transitionDelay: '450ms' }}>
                        <Link href="/register/reseller" className="glow-button inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#E5654B] text-white rounded-2xl font-bold shadow-lg shadow-[#E5654B]/35 hover:bg-[#d4523a] transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 w-full sm:w-auto text-sm sm:text-base">
                            <span>Daftar Partner</span>
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                            </svg>
                        </Link>
                        <a href="#tema" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-gray-900 border border-gray-200/80 rounded-2xl font-bold shadow-sm hover:border-gray-350 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 w-full sm:w-auto text-sm sm:text-base">
                            <svg className="w-5 h-5 text-[#E5654B] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span>Lihat Katalog Tema</span>
                        </a>
                    </div>

                    {/* Trust: avatars + rating */}
                    <div className="flex flex-wrap items-center gap-4 mt-9 reveal-on-scroll reveal-up" style={{ transitionDelay: '600ms' }}>
                        {/* Avatar stack */}
                        <div className="flex items-center">
                            {['#E5654B','#a78bfa','#34d399','#60a5fa'].map((c, i) => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-black text-xs text-white flex-shrink-0" style={{background: c, marginLeft: i > 0 ? '-8px' : 0, zIndex: 4 - i, position: 'relative'}}>
                                    {['A','B','P','S'][i]}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(s => (
                                    <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                ))}
                                <span className="text-sm font-black text-gray-800 ml-1">4.9/5</span>
                            </div>
                            <p className="text-xs text-gray-550 font-semibold mt-0.5">Dipercaya {resellerCount}+ agensi di Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: App Carousel (Boxy Phone Container) */}
                <div className="flex-1 w-full max-w-sm lg:max-w-none reveal-on-scroll reveal-scale" style={{ transitionDelay: '300ms' }}>
                    <div className="relative">
                        {/* Slide badge (Floating above the phone) */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 transition-all duration-300">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-[11px] font-black text-gray-750 shadow-md border border-gray-150 whitespace-nowrap">
                                <span className="w-1.5 h-1.5 bg-[#E5654B] rounded-full animate-pulse"></span>
                                {APP_SLIDES[activeSlide].badge}
                            </span>
                        </div>

                        {/* DESKTOP CAROUSEL (Single Phone View with Floating Cards) */}
                        <div className="hidden lg:block relative mx-auto max-w-[290px] w-full">
                            {/* Floating accent cards */}
                            <div className="float-card-1 absolute -left-12 top-10 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5 z-20 reveal-on-scroll reveal-right" style={{ transitionDelay: '600ms' }}>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-850">100% White-Label</p>
                                    <p className="text-[9px] text-gray-405">Pakai Brand & Domain Sendiri</p>
                                </div>
                            </div>

                            <div className="float-card-2 absolute -right-10 top-[220px] bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5 z-20 reveal-on-scroll reveal-left" style={{ transitionDelay: '800ms' }}>
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.096-.813 9.814-9.814a2.25 2.25 0 00-3.182-3.182l-9.814 9.814zm0 0L14.25 18" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-850">Sistem Otomatisasi</p>
                                    <p className="text-[9px] text-gray-405">Klien buat undangan sendiri</p>
                                </div>
                            </div>

                            <div className="float-card-3 absolute -left-10 bottom-20 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5 z-20 reveal-on-scroll reveal-right" style={{ transitionDelay: '1000ms' }}>
                                <div className="w-8 h-8 bg-gradient-to-br from-[#E5654B] to-[#f97316] rounded-xl flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-850">1 Menit Jadi</p>
                                    <p className="text-[9px] text-gray-455">Undangan kilat bikin klien puas</p>
                                </div>
                            </div>

                            {/* Minimal Rounded Card (No outer outline) */}
                            <div className="relative mx-auto max-w-[290px] w-full h-[580px] rounded-[2rem] overflow-hidden bg-white shadow-2xl border border-gray-100/50 z-10">
                                {/* Glossy Reflection Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
                                <div
                                    className={`flex h-full ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                                    style={{ transform: `translateX(-${(slideIndex * 100) / CLONED_SLIDES.length}%)`, width: `${CLONED_SLIDES.length * 100}%` }}
                                >
                                    {CLONED_SLIDES.map((slide, idx) => (
                                        <div key={`${slide.id}-${idx}`} className="h-full flex-shrink-0" style={{ width: `${100 / CLONED_SLIDES.length}%` }}>
                                            {slide.content}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* MOBILE CAROUSEL (Stacked Phones View) */}
                        <div 
                            className="lg:hidden w-full overflow-hidden relative py-6 select-none"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Carousel Track of Phone Frames */}
                            <div 
                                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-out' : ''}`}
                                style={{ transform: `translateX(calc(50% - 100px - ${slideIndex * 85}px))` }}
                            >
                                {CLONED_SLIDES.map((slide, idx) => {
                                    const isActive = idx === slideIndex;
                                    const isLeft = idx === slideIndex - 1;
                                    const isRight = idx === slideIndex + 1;
                                    const isVisible = isActive || isLeft || isRight;
                                    
                                    return (
                                        <div 
                                            key={`${slide.id}-${idx}`} 
                                            className={`w-[200px] flex-shrink-0 cursor-pointer ${
                                                isTransitioning ? 'transition-all duration-500 ease-out' : ''
                                            } ${
                                                isActive 
                                                    ? 'scale-100 opacity-100 z-10 rotate-0' 
                                                    : isLeft
                                                    ? 'scale-[0.85] opacity-40 z-0 blur-[0.5px] -rotate-[3deg]'
                                                    : isRight
                                                    ? 'scale-[0.85] opacity-40 z-0 blur-[0.5px] rotate-[3deg]'
                                                    : 'opacity-0 scale-[0.7] pointer-events-none z-[-10] blur-[2px]'
                                            }`}
                                            style={{ marginRight: idx === CLONED_SLIDES.length - 1 ? 0 : '-115px' }}
                                            onClick={() => {
                                                if (!isActive && isVisible) {
                                                    clearInterval(timerRef.current);
                                                    setIsTransitioning(true);
                                                    setSlideIndex(idx);
                                                    timerRef.current = setInterval(() => {
                                                        handleNext();
                                                    }, 3500);
                                                }
                                            }}
                                        >
                                            {/* Minimal Rounded Card (No outer outline) */}
                                            <div className={`relative mx-auto w-full h-[400px] rounded-[1.8rem] overflow-hidden bg-white shadow-xl border border-gray-100/50 ${!isActive ? 'pointer-events-none' : ''}`}>
                                                {/* Glossy Reflection Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
                                                <div className="w-full h-full">
                                                    {slide.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dots + hint */}
                        <div className="flex flex-col items-center gap-2 mt-5">
                            <div className="flex items-center gap-2">
                                {APP_SLIDES.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleDotClick(idx)}
                                        className={`rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-6 h-2.5 bg-[#E5654B]' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-450'}`}
                                        aria-label={`Slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-450 font-medium">Geser kiri/kanan atau tunggu auto-slide</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Welcome({ auth, canLogin, canRegister, appName, themes = [], recentInvitations = [], resellerCount = 15, invitationCount = 40, adminWhatsapp = '6283132211830', adminEmail = 'admin@groovy.com', minModalCost = 15000, subscriptionPlans = [], greetingCards = [], greetingCardTypeOptions = {} }) {
    const { flash } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [activeFaq, setActiveFaq] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Custom logo click states to unlock secret login page (hidden login)
    const [logoClicks, setLogoClicks] = useState(0);

    const handleLogoClick = (e) => {
        e.preventDefault();
        setLogoClicks((prev) => {
            const next = prev + 1;
            if (next >= 3) {
                window.location.href = route('login');
                return 0;
            }
            return next;
        });
    };

    useEffect(() => {
        if (logoClicks > 0) {
            const timer = setTimeout(() => {
                setLogoClicks(0);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [logoClicks]);

    // Theme slider states (responsive columns 1 row layout)
    const [themeActivePage, setThemeActivePage] = useState(0);

    // Invitation features pagination/slider state
    const [invitationActivePage, setInvitationActivePage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const themeItemsPerPage = isMobile ? 2 : 4;
    const invitationItemsPerPage = isMobile ? 4 : 8;

    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const invitationPages = useMemo(() => {
        return chunkArray(invitationFeaturesList, invitationItemsPerPage);
    }, [isMobile, invitationItemsPerPage]);

    useEffect(() => {
        if (invitationActivePage >= invitationPages.length && invitationPages.length > 0) {
            setInvitationActivePage(invitationPages.length - 1);
        }
    }, [invitationPages.length]);

    // Touch swipe handlers
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe && invitationActivePage < invitationPages.length - 1) {
            setInvitationActivePage(prev => prev + 1);
        }
        if (isRightSwipe && invitationActivePage > 0) {
            setInvitationActivePage(prev => prev - 1);
        }
    };

    // Greeting Cards slider states (responsive columns 1 row layout)
    const [cardActivePage, setCardActivePage] = useState(0);
    const cardItemsPerPage = isMobile ? 2 : 4;

    // Theme slider pages memoization (responsive columns, 1 row layout)
    const themePages = useMemo(() => {
        return chunkArray(themes || [], themeItemsPerPage);
    }, [themes, themeItemsPerPage]);

    useEffect(() => {
        if (themeActivePage >= themePages.length && themePages.length > 0) {
            setThemeActivePage(themePages.length - 1);
        }
    }, [themePages.length]);

    // Theme touch swipe handlers
    const [themeTouchStart, setThemeTouchStart] = useState(null);
    const [themeTouchEnd, setThemeTouchEnd] = useState(null);

    const onThemeTouchStart = (e) => {
        setThemeTouchEnd(null);
        setThemeTouchStart(e.targetTouches[0].clientX);
    };

    const onThemeTouchMove = (e) => setThemeTouchEnd(e.targetTouches[0].clientX);

    const onThemeTouchEnd = () => {
        if (!themeTouchStart || !themeTouchEnd) return;
        const distance = themeTouchStart - themeTouchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe && themeActivePage < themePages.length - 1) {
            setThemeActivePage(prev => prev + 1);
        }
        if (isRightSwipe && themeActivePage > 0) {
            setThemeActivePage(prev => prev - 1);
        }
    };

    // Card slider pages memoization (responsive columns, 1 row layout)
    const cardPages = useMemo(() => {
        return chunkArray(greetingCards || [], cardItemsPerPage);
    }, [greetingCards, cardItemsPerPage]);

    useEffect(() => {
        if (cardActivePage >= cardPages.length && cardPages.length > 0) {
            setCardActivePage(cardPages.length - 1);
        }
    }, [cardPages.length]);

    // Card touch swipe handlers
    const [cardTouchStart, setCardTouchStart] = useState(null);
    const [cardTouchEnd, setCardTouchEnd] = useState(null);

    const onCardTouchStart = (e) => {
        setCardTouchEnd(null);
        setCardTouchStart(e.targetTouches[0].clientX);
    };

    const onCardTouchMove = (e) => setCardTouchEnd(e.targetTouches[0].clientX);

    const onCardTouchEnd = () => {
        if (!cardTouchStart || !cardTouchEnd) return;
        const distance = cardTouchStart - cardTouchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe && cardActivePage < cardPages.length - 1) {
            setCardActivePage(prev => prev + 1);
        }
        if (isRightSwipe && cardActivePage > 0) {
            setCardActivePage(prev => prev - 1);
        }
    };


    // Reseller profit calculator states (Dynamic Multi-Plan based on Admin Settings)
    const defaultPlans = [
        { id: 'silver', name: 'Silver', slug: 'silver', price: 49000, defaultQty: 10, defaultPrice: 99000 },
        { id: 'gold', name: 'Gold', slug: 'gold', price: 99000, defaultQty: 15, defaultPrice: 199000 },
        { id: 'platinum', name: 'Platinum', slug: 'platinum', price: 199000, defaultQty: 5, defaultPrice: 299000 }
    ];

    const activePlans = useMemo(() => {
        if (subscriptionPlans && subscriptionPlans.length > 0) {
            return subscriptionPlans.map(plan => {
                let defaultPrice = plan.suggested_price ? Number(plan.suggested_price) : (Number(plan.price) * 2);
                if (!plan.suggested_price) {
                    if (plan.slug === 'silver') defaultPrice = 99000;
                    else if (plan.slug === 'gold') defaultPrice = 199000;
                    else if (plan.slug === 'platinum') defaultPrice = 299000;
                }

                let defaultQty = 10;
                if (plan.slug === 'gold') defaultQty = 15;
                if (plan.slug === 'platinum') defaultQty = 5;

                return {
                    id: plan.id,
                    name: plan.name,
                    slug: plan.slug,
                    price: Number(plan.price),
                    defaultQty,
                    defaultPrice
                };
            });
        }
        return defaultPlans;
    }, [subscriptionPlans]);

    const [quantities, setQuantities] = useState({});
    const [prices, setPrices] = useState({});

    useEffect(() => {
        const q = {};
        const p = {};
        activePlans.forEach(plan => {
            q[plan.id] = plan.defaultQty;
            p[plan.id] = plan.defaultPrice;
        });
        setQuantities(q);
        setPrices(p);
    }, [activePlans]);

    const monthlyRevenue = useMemo(() => {
        return activePlans.reduce((sum, plan) => {
            const qty = quantities[plan.id] ?? plan.defaultQty;
            const price = prices[plan.id] ?? plan.defaultPrice;
            return sum + (qty * price);
        }, 0);
    }, [activePlans, quantities, prices]);

    const monthlyCost = useMemo(() => {
        return activePlans.reduce((sum, plan) => {
            const qty = quantities[plan.id] ?? plan.defaultQty;
            return sum + (qty * plan.price);
        }, 0);
    }, [activePlans, quantities]);

    const netProfit = monthlyRevenue - monthlyCost;
    const totalQty = useMemo(() => {
        return activePlans.reduce((sum, plan) => {
            return sum + (quantities[plan.id] ?? plan.defaultQty);
        }, 0);
    }, [activePlans, quantities]);

    useEffect(() => {
        setMounted(true);
        if (flash?.error || flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                } else {
                    entry.target.classList.remove('reveal-active');
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });

        const observeAll = () => {
            const els = document.querySelectorAll('.reveal-on-scroll');
            els.forEach(el => observer.observe(el));
        };

        observeAll();

        // Check again after a short delay in case of dynamic page changes or image loads
        const timer = setTimeout(observeAll, 200);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [themeActivePage, invitationActivePage, cardActivePage, mounted]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const handleWhatsAppRedirect = (message = '') => {
        const formattedMessage = encodeURIComponent(message || 'Halo Admin, saya tertarik untuk mendaftar menjadi partner reseller website undangan digital Anda. Bagaimana cara mulainya?');
        window.open(`https://wa.me/${adminWhatsapp}?text=${formattedMessage}`, '_blank');
    };

    return (
        <>
            <Head title="Mulai Bisnis Undangan Digital Anda Sendiri — Platform Reseller Agensi White-Label" />

            {/* FANCY INLINE STYLES */}
            <style>{`
                html, body {
                    max-width: 100%;
                    overflow-x: hidden;
                }
                @keyframes infinite-ticker-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-infinite-ticker-scroll {
                    animation: infinite-ticker-scroll 35s linear infinite;
                }
                .glow-button {
                    position: relative;
                    overflow: hidden;
                }
                .glow-button::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent,
                        rgba(255, 255, 255, 0.25),
                        transparent
                    );
                    transform: rotate(45deg);
                    transition: 0.5s;
                    opacity: 0;
                }
                .glow-button:hover::after {
                    left: 120%;
                    opacity: 1;
                }
                /* Hero Carousel */
                .hero-carousel-track {
                    display: flex;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hero-carousel-slide {
                    flex-shrink: 0;
                    width: 100%;
                }
                @keyframes float-card-1 {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50% { transform: translateY(-8px) rotate(-1deg); }
                }
                @keyframes float-card-2 {
                    0%, 100% { transform: translateY(-4px) rotate(1.5deg); }
                    50% { transform: translateY(4px) rotate(1.5deg); }
                }
                @keyframes float-card-3 {
                    0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
                    50% { transform: translateY(-6px) rotate(-0.5deg); }
                }
                .float-card-1 { animation: float-card-1 4.5s ease-in-out infinite; }
                .float-card-2 { animation: float-card-2 5.5s ease-in-out infinite; }
                .float-card-3 { animation: float-card-3 4.8s ease-in-out infinite; }
                /* Navbar scroll */
                .nav-scrolled {
                    background: rgba(255,255,255,0.97);
                    box-shadow: 0 1px 20px rgba(0,0,0,0.08);
                }
                .nav-top {
                    background: rgba(255,255,255,0.80);
                    backdrop-filter: blur(16px);
                }
                /* Mobile hamburger */
                .hamburger-line {
                    display: block;
                    width: 22px;
                    height: 2px;
                    background: #1e293b;
                    border-radius: 2px;
                    transition: all 0.3s;
                }
            `}</style>

            {/* Flash Messages */}
            {showFlash && (flash?.error || flash?.success) && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
                        flash.error 
                            ? 'bg-red-50/90 border-red-200/80 text-red-900' 
                            : 'bg-emerald-50/90 border-emerald-200/80 text-emerald-900'
                    }`}>
                        {flash.error ? (
                            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <div className="flex-1 text-sm font-medium leading-relaxed">
                            {flash.error || flash.success}
                        </div>
                        <button onClick={() => setShowFlash(false)} className={`p-1 rounded-lg transition-colors ${
                            flash.error ? 'hover:bg-red-100 text-red-500' : 'hover:bg-emerald-100 text-emerald-500'
                        }`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ NAVBAR (Light / Cream Style — Melting Reference) ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-white/95 backdrop-blur-md ${scrolled ? 'shadow-md border-gray-150 py-3' : 'border-transparent py-4'}`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5654B] to-[#f97316] flex items-center justify-center shadow-md shadow-[#E5654B]/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">
                            {appName || 'Groovy'}<span className="text-[#E5654B]">.agency</span>
                        </span>
                    </Link>

                    {/* Navigation Desktop Links */}
                    <div className="hidden md:flex items-center gap-7">
                        <a href="#tema" className="text-sm font-semibold text-gray-600 hover:text-[#E5654B] transition-colors">Tema</a>
                        <a href="#alur-kerja" className="text-sm font-semibold text-gray-600 hover:text-[#E5654B] transition-colors">Cara Kerja</a>
                        <a href="#keunggulan" className="text-sm font-semibold text-gray-600 hover:text-[#E5654B] transition-colors">Fitur</a>
                        <a href="#kalkulator" className="text-sm font-semibold text-gray-600 hover:text-[#E5654B] transition-colors">Simulasi</a>
                        <a href="#faq" className="text-sm font-semibold text-gray-600 hover:text-[#E5654B] transition-colors">FAQ</a>
                    </div>

                    {/* Right CTAs */}
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('admin.dashboard')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-bold hover:bg-[#d4523a] transition-all duration-300 hover:scale-[1.03] shadow-md shadow-[#E5654B]/25">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {/* "Masuk" button hidden and replaced with 3 clicks on logo */}
                                <Link href="/register/reseller" className="hidden sm:inline-block px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-bold hover:bg-[#d4523a] shadow-md shadow-[#E5654B]/25 transition-all hover:scale-[1.03] duration-300 text-center">
                                    Daftar Partner
                                </Link>
                            </>
                        )}
                        {/* Mobile hamburger */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden flex flex-col gap-[5px] p-2 rounded-xl hover:bg-gray-100 transition-colors z-50 relative" 
                            aria-label="Menu"
                        >
                            <span className={`hamburger-line transform ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                            <span className={`hamburger-line transform ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                            <span className={`hamburger-line transform ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer Overlay */}
            <div 
                className={`fixed inset-0 z-40 bg-white/98 backdrop-blur-md transition-all duration-300 md:hidden flex flex-col pt-24 px-6 pb-8 border-b border-orange-100/60 shadow-xl h-screen overflow-y-auto ${
                    mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
                }`}
            >
                {/* Navigation Links */}
                <div className="flex flex-col gap-5 text-center my-auto">
                    <a 
                        href="#tema" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-lg font-extrabold text-gray-800 hover:text-[#E5654B] transition-colors py-2.5 border-b border-orange-50/50 hover:bg-orange-50/20 rounded-xl"
                    >
                        Tema
                    </a>
                    <a 
                        href="#alur-kerja" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-lg font-extrabold text-gray-800 hover:text-[#E5654B] transition-colors py-2.5 border-b border-orange-50/50 hover:bg-orange-50/20 rounded-xl"
                    >
                        Cara Kerja
                    </a>
                    <a 
                        href="#keunggulan" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-lg font-extrabold text-gray-800 hover:text-[#E5654B] transition-colors py-2.5 border-b border-orange-50/50 hover:bg-orange-50/20 rounded-xl"
                    >
                        Fitur
                    </a>
                    <a 
                        href="#kalkulator" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-lg font-extrabold text-gray-800 hover:text-[#E5654B] transition-colors py-2.5 border-b border-orange-50/50 hover:bg-orange-50/20 rounded-xl"
                    >
                        Simulasi
                    </a>
                    <a 
                        href="#faq" 
                        onClick={() => setMobileMenuOpen(false)} 
                        className="text-lg font-extrabold text-gray-800 hover:text-[#E5654B] transition-colors py-2.5 hover:bg-orange-50/20 rounded-xl"
                    >
                        FAQ
                    </a>
                </div>

                {/* Drawer CTAs */}
                <div className="flex flex-col gap-3 mt-auto w-full max-w-sm mx-auto">
                    {auth?.user ? (
                        <Link 
                            href={route('admin.dashboard')} 
                            onClick={() => setMobileMenuOpen(false)} 
                            className="w-full py-4 bg-[#E5654B] text-white rounded-full text-center font-extrabold hover:bg-[#d4523a] transition-all shadow-md shadow-[#E5654B]/25 text-sm"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            {/* "Masuk" button hidden and replaced with 3 clicks on logo */}
                            <Link 
                                href="/register/reseller" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="w-full py-4 bg-[#E5654B] text-white rounded-full text-center font-extrabold hover:bg-[#d4523a] shadow-md shadow-[#E5654B]/25 transition-all text-sm"
                            >
                                Daftar Partner
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* ═══ HERO BANNER (Melting-style light cream — 2-column layout) ═══ */}
            <HeroSection
                mounted={mounted}
                resellerCount={resellerCount}
                invitationCount={invitationCount}
                themesCount={themes.length}
                appName={appName}
                canRegister={canRegister}
            />

            {/* ═══ INFINITE AUTOSCROLLING PARTNER TICKER (Large, moving and infinite) ═══ */}
            <section className="bg-[#FAF3EC] border-y border-orange-100/60 py-12 overflow-hidden relative reveal-on-scroll reveal-fade">
                {/* Soft gradient mask for edges */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#FAF3EC] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FAF3EC] to-transparent z-10 pointer-events-none" />
                
                <div className="max-w-6xl mx-auto px-6 mb-6">
                    <div className="text-center text-xs font-black text-gray-400 tracking-widest uppercase">
                        DIAPRESIASI DAN DIOPERASIKAN OLEH MITRA AGENSI TERKEMUKA
                    </div>
                </div>

                {/* Double layout infinite ticker */}
                <div className="flex overflow-hidden whitespace-nowrap py-4">
                    <div className="flex gap-10 items-center justify-around min-w-full animate-infinite-ticker-scroll hover:[animation-play-state:paused] cursor-pointer">
                        {PARTNERS.concat(PARTNERS).map((partner, index) => (
                            <div key={index} className="inline-flex items-center gap-3 bg-white/95 border border-orange-100 hover:border-[#E5654B]/30 rounded-2xl px-6 py-4 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="p-2.5 rounded-xl bg-[#E5654B]/5 text-[#E5654B] shadow-inner">
                                    {partner.icon}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-extrabold text-gray-900 leading-tight">{partner.name}</div>
                                    <div className="text-[10px] text-gray-505 font-bold uppercase tracking-wider mt-0.5">{partner.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom slider overrides for light mode calculator */}
            <style>{`
                .light-calculator .premium-slider::-webkit-slider-runnable-track {
                    background: rgba(229, 101, 75, 0.15) !important;
                }
                .light-calculator .premium-slider::-moz-range-track {
                    background: rgba(229, 101, 75, 0.15) !important;
                }
                .light-calculator .premium-slider::-webkit-slider-thumb {
                    border: 2px solid #ffffff !important;
                    box-shadow: 0 3px 8px rgba(229, 101, 75, 0.25) !important;
                }
                .light-calculator .premium-slider::-moz-range-thumb {
                    border: 2px solid #ffffff !important;
                    box-shadow: 0 3px 8px rgba(229, 101, 75, 0.25) !important;
                }
            `}</style>

            {/* ═══ INTERACTIVE PROFIT CALCULATOR WIDGET (Sleek Cream/Terracotta Card) ═══ */}
            <section id="kalkulator" className="bg-[#FFF8F3] py-24 overflow-hidden relative border-b border-orange-100/60 light-calculator">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20 reveal-on-scroll reveal-up">Simulasi Finansial</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5 reveal-on-scroll reveal-up" style={{ transitionDelay: '100ms' }}>Proyeksi Pendapatan Bersih Agensi Anda</h2>
                        <p className="text-gray-650 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold reveal-on-scroll reveal-up" style={{ transitionDelay: '200ms' }}>Sesuaikan parameter di bawah untuk memvisualisasikan profit bersih yang langsung masuk ke rekening agensi Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                        {/* Control Panel (Sliders for each plan - Dynamic White-Label Pricing) */}
                        <div className="lg:col-span-7 bg-white border border-orange-100 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between reveal-on-scroll reveal-right">
                            <h3 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-4 flex justify-between items-center">
                                <span>Konfigurasi Penjualan</span>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400">Atur Volume & Harga Jual Paket</span>
                            </h3>
                            
                            <div className="space-y-6 flex-1 py-2">
                                {activePlans.map((plan, index) => {
                                    const qty = quantities[plan.id] ?? plan.defaultQty;
                                    const price = prices[plan.id] ?? plan.defaultPrice;
                                    const unitProfit = Math.max(0, price - plan.price);

                                    return (
                                        <div key={plan.id} className="bg-[#FFFDFB] border border-orange-100/60 rounded-2xl p-5 space-y-4 transition-all hover:bg-[#FFFBF8] duration-200 reveal-on-scroll reveal-up" style={{ transitionDelay: `${index * 100}ms` }}>
                                            {/* Plan Header */}
                                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <span className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wide">{plan.name} Package</span>
                                                <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                                                    Margin Rp {unitProfit.toLocaleString('id-ID')} / Pcs
                                                </span>
                                            </div>

                                            {/* Quantity Slider */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span className="text-gray-500">Proyeksi Penjualan</span>
                                                    <span className="text-[#E5654B] font-extrabold">{qty} Undangan / bulan</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0" 
                                                    max="100" 
                                                    value={qty} 
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setQuantities(prev => ({ ...prev, [plan.id]: val }));
                                                    }}
                                                    className="w-full premium-slider slider-orange cursor-pointer"
                                                />
                                            </div>

                                            {/* Selling Price Slider */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[11px] font-bold">
                                                    <span className="text-gray-500">Harga Jual Rekomendasi</span>
                                                    <span className="text-[#ffb347] font-extrabold">Rp {price.toLocaleString('id-ID')}</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min={plan.price} 
                                                    max={Math.max(plan.price * 4, plan.defaultPrice * 1.5)} 
                                                    step="5000"
                                                    value={price} 
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setPrices(prev => ({ ...prev, [plan.id]: val }));
                                                    }}
                                                    className="w-full premium-slider slider-amber cursor-pointer"
                                                />
                                                <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                                                    <span>Modal Sistem: Rp {plan.price.toLocaleString('id-ID')}</span>
                                                    <span>Max: Rp {Math.max(plan.price * 4, plan.defaultPrice * 1.5).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Profit Output Panel (Creative Terracotta gradient card) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-[#E5654B] to-[#f97316] text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-[#E5654B]/35 flex flex-col justify-between border-none reveal-on-scroll reveal-left" style={{ transitionDelay: '200ms' }}>
                            {/* Graphic accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            
                            <div>
                                <h3 className="text-xs font-black tracking-widest text-white/75 uppercase mb-8">ANALISIS PENDAPATAN BULANAN</h3>

                                <div className="space-y-5">
                                    <div>
                                        <span className="text-xs text-white/85 block font-semibold">Proyeksi Omset Kotor</span>
                                        <span className="text-2xl font-black text-white mt-1 block">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
                                    </div>

                                    <div className="border-t border-white/15 pt-4">
                                        <span className="text-xs text-white/85 block font-semibold">Biaya Pembelian Modal</span>
                                        <span className="text-sm font-bold text-orange-200 mt-1 block">Rp {monthlyCost.toLocaleString('id-ID')}</span>
                                    </div>

                                    {/* Sales Breakdown inside Output Panel */}
                                    <div className="border-t border-white/15 pt-4">
                                        <span className="text-xs text-white/90 block font-semibold">Rincian Volume Penjualan:</span>
                                        <div className="text-[10px] text-white/75 space-y-1.5 mt-2 font-bold uppercase tracking-wider">
                                            {activePlans.map(plan => {
                                                const qty = quantities[plan.id] ?? plan.defaultQty;
                                                return (
                                                    <div key={plan.id} className="flex justify-between">
                                                        <span>{plan.name} Package</span>
                                                        <span className="text-white">{qty} Pcs</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="flex justify-between border-t border-white/15 pt-1.5 text-white/90">
                                                <span>Total Unit Terjual</span>
                                                <span className="text-amber-200 font-black">{totalQty} Pcs</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-white/20 pt-5">
                                        <span className="text-xs text-amber-200 font-extrabold block uppercase tracking-wide">ESTIMASI LABA BERSIH (PROFIT)</span>
                                        <div className="text-3xl sm:text-4xl font-black text-white mt-1.5 drop-shadow-md">
                                            Rp {netProfit.toLocaleString('id-ID')}
                                        </div>
                                        <span className="text-[10px] text-white/75 block mt-2.5 leading-relaxed font-semibold">
                                            * Laba bersih dihitung dari selisih harga jual dengan modal. 100% profit langsung masuk ke rekening Anda tanpa potongan platform.
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => handleWhatsAppRedirect(`Halo Admin, saya melakukan simulasi profit agensi saya dan mendapat Rp ${netProfit.toLocaleString('id-ID')}/bulan. Saya ingin mendaftar menjadi partner reseller.`)} className="w-full mt-8 py-4 bg-white text-[#E5654B] hover:bg-[#FFF5EE] rounded-2xl font-black text-center text-sm shadow-xl shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300">
                                Klaim Lisensi Agensi Anda
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS (Ultra elegant cards) ═══ */}
            <section id="alur-kerja" className="bg-[#faf9f6] py-12 sm:py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full reveal-on-scroll reveal-up">Alur Sistem</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5 reveal-on-scroll reveal-up" style={{ transitionDelay: '100ms' }}>3 Langkah Mudah Menjalankan Agensi</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed reveal-on-scroll reveal-up" style={{ transitionDelay: '200ms' }}>Sistem bisnis otomatisasi white-label kami siap dijalankan secara instan.</p>
                    </div>

                    <div className="relative mt-8 sm:mt-12">
                        {/* Connection line desktop */}
                        <div className="absolute top-[20px] left-[16.6%] right-[16.6%] h-0.5 border-t-2 border-dashed border-[#E5654B]/30 hidden md:block z-0 pointer-events-none"></div>
                        
                        {/* Connection line mobile */}
                        <div className="absolute left-8 top-6 bottom-6 w-0.5 border-l-2 border-dashed border-[#E5654B]/30 md:hidden z-0 pointer-events-none"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 relative z-10">
                            {/* Step 1 */}
                            <div className="relative group bg-white rounded-2xl border border-gray-150 p-5 pl-14 md:pl-6 md:pt-10 md:pb-6 hover:shadow-xl hover:border-[#E5654B]/20 transition-all duration-300 shadow-sm text-left md:text-center reveal-on-scroll reveal-up" style={{ transitionDelay: '100ms' }}>
                                <div className="absolute left-4 top-5 md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#E5654B] to-[#f97316] text-white flex items-center justify-center font-black text-sm md:text-base shadow-md shadow-[#E5654B]/20 border-4 border-white z-10">
                                    1
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1.5 md:mb-3">Registrasi Agensi</h3>
                                <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium">
                                    Pilih paket lisensi agensi & daftar. Akun Anda langsung aktif seketika untuk memulai bisnis.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative group bg-white rounded-2xl border border-gray-150 p-5 pl-14 md:pl-6 md:pt-10 md:pb-6 hover:shadow-xl hover:border-[#E5654B]/20 transition-all duration-300 shadow-sm text-left md:text-center reveal-on-scroll reveal-up" style={{ transitionDelay: '250ms' }}>
                                <div className="absolute left-4 top-5 md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm md:text-base shadow-md border-4 border-white z-10">
                                    2
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1.5 md:mb-3">Konfigurasi Brand</h3>
                                <p className="text-[11px] md:text-xs text-gray-550 leading-relaxed font-medium">
                                    Hubungkan domain & unggah logo Anda. Seluruh dashboard klien otomatis memakai brand Anda.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative group bg-white rounded-2xl border border-gray-150 p-5 pl-14 md:pl-6 md:pt-10 md:pb-6 hover:shadow-xl hover:border-[#E5654B]/20 transition-all duration-300 shadow-sm text-left md:text-center reveal-on-scroll reveal-up" style={{ transitionDelay: '400ms' }}>
                                <div className="absolute left-4 top-5 md:left-1/2 md:top-0 md:-translate-x-1/2 md:-translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-[#f59e0b] text-white flex items-center justify-center font-black text-sm md:text-base shadow-md border-4 border-white z-10">
                                    3
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1.5 md:mb-3">Mulai Penjualan</h3>
                                <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed font-medium">
                                    Tentukan harga paket sendiri. 100% laba penjualan langsung masuk ke rekening Anda tanpa potongan platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ KEY FEATURES (Luxurious Cards with subtle glows) ═══ */}
            <section id="keunggulan" className="bg-[#FAF3EC] py-24 border-y border-orange-100/60">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">Infrastruktur Premium</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">Fitur Unggulan Agensi Anda</h2>
                        <p className="text-gray-650 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold">Platform agensi undangan digital dengan dukungan kustomisasi dan stabilitas terbaik.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                        {featuresList.map((f, i) => (
                            <div key={i} className="bg-white border border-orange-100 hover:border-[#E5654B]/30 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center mb-3 sm:mb-6 group-hover:bg-[#E5654B] group-hover:text-white transition-all duration-300 shadow-inner group-hover:scale-110 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                                        {f.icon}
                                    </div>
                                    <h3 className="font-black text-gray-900 text-xs sm:text-lg mb-1 sm:mb-3 tracking-tight group-hover:text-[#E5654B] transition-colors duration-300 leading-tight">{f.title}</h3>
                                    <p className="text-[10px] sm:text-sm text-gray-550 leading-relaxed font-semibold">{f.desc}</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 mt-5 text-[11px] font-black tracking-widest text-[#E5654B] uppercase opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                                    Dapatkan Akses
                                    <span>→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CLIENT INVITATION FEATURES ═══ */}
            <section id="fitur-undangan" className="bg-white py-24 border-b border-orange-100/60">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">Fitur Undangan ({invitationFeaturesList.length} Fitur)</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">Semua yang Anda Butuhkan Ada di Sini</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold">Berikan klien Anda fitur pembuatan undangan pernikahan terlengkap dan tercanggih.</p>
                    </div>

                    {/* Paginated Slider Container */}
                    <div 
                        className="overflow-hidden relative w-full"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${invitationActivePage * 100}%)` }}
                        >
                            {invitationPages.map((pageItems, pageIdx) => (
                                <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6 px-1">
                                    {pageItems.map((f, i) => {
                                        const globalIdx = pageIdx * invitationItemsPerPage + i;
                                        return (
                                            <div key={globalIdx} className="relative bg-white border border-orange-150 hover:border-[#E5654B]/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between overflow-hidden min-h-[140px] sm:min-h-[180px]">
                                                {/* Decorative Number */}
                                                <div className="absolute right-3 top-3 sm:right-6 sm:top-6 text-base sm:text-2xl font-black text-orange-500/10 group-hover:text-[#E5654B]/20 transition-all duration-300">
                                                    {String(globalIdx + 1).padStart(2, '0')}
                                                </div>
                                                <div>
                                                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-[#E5654B] group-hover:text-white transition-all duration-300 shadow-inner group-hover:scale-105 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">
                                                        {f.icon}
                                                    </div>
                                                    <h3 className="font-black text-gray-900 text-[11px] sm:text-base mb-1 tracking-tight group-hover:text-[#E5654B] transition-colors duration-300 leading-tight">{f.title}</h3>
                                                    <p className="text-[9px] sm:text-xs text-gray-500 leading-normal font-medium line-clamp-3 sm:line-clamp-none">{f.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* Fallback empty cards to maintain grid structure on last page */}
                                    {pageItems.length < invitationItemsPerPage && 
                                        Array.from({ length: invitationItemsPerPage - pageItems.length }).map((_, placeholderIdx) => (
                                            <div key={`placeholder-${placeholderIdx}`} className="invisible" />
                                        ))
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
                        <button 
                            onClick={() => setInvitationActivePage(prev => Math.max(0, prev - 1))}
                            disabled={invitationActivePage === 0}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                invitationActivePage === 0 
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                    : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                            }`}
                            aria-label="Sebelumnya"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-1.5">
                            {invitationPages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setInvitationActivePage(idx)}
                                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                        invitationActivePage === idx 
                                            ? 'w-5 sm:w-6 bg-[#E5654B]' 
                                            : 'w-1.5 sm:w-2 bg-orange-200 hover:bg-orange-300'
                                    }`}
                                    aria-label={`Ke halaman ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button 
                            onClick={() => setInvitationActivePage(prev => Math.min(invitationPages.length - 1, prev + 1))}
                            disabled={invitationActivePage === invitationPages.length - 1}
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                invitationActivePage === invitationPages.length - 1 
                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                    : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                            }`}
                            aria-label="Selanjutnya"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ THEME PREVIEW CATALOG ═══ */}
            <section id="tema" className="bg-white py-24">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full">Koleksi Desain</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">Template Premium Siap Jual</h2>
                        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm font-medium">Puluhan desain modern, responsif, dan elegan otomatis aktif di dashboard agensi Anda.</p>
                    </div>

                    {/* Theme Slider / Carousel - 2 Columns 1 Row */}
                    {themes.length > 0 ? (
                        <div 
                            className="overflow-hidden cursor-grab active:cursor-grabbing relative animate-in fade-in duration-500"
                            onTouchStart={onThemeTouchStart}
                            onTouchMove={onThemeTouchMove}
                            onTouchEnd={onThemeTouchEnd}
                        >
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${themeActivePage * 100}%)` }}
                            >
                                {themePages.map((pageItems, pageIdx) => (
                                    <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-1">
                                        {pageItems.map((theme) => (
                                            <div key={theme.id} className="flex-shrink-0 animate-in fade-in duration-300">
                                                <ThemePreviewCard 
                                                    theme={theme}
                                                />
                                            </div>
                                        ))}
                                        {/* Fallback empty cards to maintain grid structure on last page */}
                                        {pageItems.length < themeItemsPerPage && 
                                            Array.from({ length: themeItemsPerPage - pageItems.length }).map((_, placeholderIdx) => (
                                                <div key={`placeholder-${placeholderIdx}`} className="invisible" />
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                            <p className="text-sm font-medium">Tema sedang disiapkan...</p>
                        </div>
                    )}

                    {/* Pagination & CTA Button */}
                    {themes.length > 0 && themePages.length > 0 && (
                        <div className="flex flex-col items-center justify-center gap-6 mt-8 sm:mt-12">
                            {/* Pagination Controls */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setThemeActivePage(prev => Math.max(0, prev - 1))}
                                    disabled={themeActivePage === 0}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                        themeActivePage === 0 
                                            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                            : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                                    }`}
                                    aria-label="Sebelumnya"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-1.5">
                                    {themePages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setThemeActivePage(idx)}
                                            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                                themeActivePage === idx 
                                                    ? 'w-5 sm:w-6 bg-[#E5654B]' 
                                                    : 'w-1.5 sm:w-2 bg-orange-200 hover:bg-orange-300'
                                            }`}
                                            aria-label={`Ke halaman ${idx + 1}`}
                                        />
                                    ))}
                                </div>

                                <button 
                                    onClick={() => setThemeActivePage(prev => Math.min(themePages.length - 1, prev + 1))}
                                    disabled={themeActivePage === themePages.length - 1}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                        themeActivePage === themePages.length - 1 
                                            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                            : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                                    }`}
                                    aria-label="Selanjutnya"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>

                            {/* Lihat Semua Tema Button */}
                            <Link 
                                href={route('themes')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E5654B]/30 hover:border-[#E5654B] text-[#E5654B] hover:bg-[#E5654B]/5 font-bold rounded-full text-sm shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98]"
                            >
                                <span>Lihat Semua Tema</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ KARTU UCAPAN SHOWCASE ═══ */}
            {greetingCards.length > 0 && (
                <section id="kartu-ucapan" className="bg-gradient-to-b from-white via-[#FFF8F3] to-[#FAF3EC] py-24 border-y border-orange-100/60 relative">
                    <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#E5654B]/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />

                    <div className="max-w-6xl mx-auto px-6">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">
                                Fitur Baru — Kartu Ucapan Interaktif
                            </span>
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">
                                Koleksi Kartu Ucapan Premium
                            </h2>
                            <p className="text-gray-650 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                                Kirimkan ucapan spesial dengan animasi, musik, dan efek interaktif memukau untuk berbagai momen penting Anda.
                            </p>
                        </div>

                        {/* Greeting Cards Slider / Carousel - 2 Columns 1 Row */}
                        {greetingCards.length > 0 ? (
                            <div 
                                className="overflow-hidden cursor-grab active:cursor-grabbing relative animate-in fade-in duration-500"
                                onTouchStart={onCardTouchStart}
                                onTouchMove={onCardTouchMove}
                                onTouchEnd={onCardTouchEnd}
                            >
                                <div 
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${cardActivePage * 100}%)` }}
                                >
                                    {cardPages.map((pageItems, pageIdx) => (
                                        <div key={pageIdx} className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-1">
                                            {pageItems.map((card) => (
                                                <div key={card.id} className="flex-shrink-0 animate-in fade-in duration-300">
                                                    <GreetingCardPreviewCard 
                                                        theme={card}
                                                        typeOptions={greetingCardTypeOptions}
                                                    />
                                                </div>
                                            ))}
                                            {/* Fallback empty cards to maintain grid structure on last page */}
                                            {pageItems.length < cardItemsPerPage && 
                                                Array.from({ length: cardItemsPerPage - pageItems.length }).map((_, placeholderIdx) => (
                                                    <div key={`placeholder-${placeholderIdx}`} className="invisible" />
                                                ))
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400 border border-dashed border-gray-255 rounded-3xl bg-white">
                                <p className="text-sm font-medium">Kartu ucapan sedang disiapkan...</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {greetingCards.length > 0 && cardPages.length > 0 && (
                            <div className="flex flex-col items-center justify-center gap-6 mt-8 sm:mt-12">
                                {/* Pagination Controls */}
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setCardActivePage(prev => Math.max(0, prev - 1))}
                                        disabled={cardActivePage === 0}
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                            cardActivePage === 0 
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                                : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                                        }`}
                                        aria-label="Sebelumnya"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {cardPages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCardActivePage(idx)}
                                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                                    cardActivePage === idx 
                                                        ? 'w-5 sm:w-6 bg-[#E5654B]' 
                                                        : 'w-1.5 sm:w-2 bg-orange-200 hover:bg-orange-300'
                                                }`}
                                                aria-label={`Ke halaman ${idx + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => setCardActivePage(prev => Math.min(cardPages.length - 1, prev + 1))}
                                        disabled={cardActivePage === cardPages.length - 1}
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                                            cardActivePage === cardPages.length - 1 
                                                ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50/20' 
                                                : 'border-orange-200 text-[#E5654B] hover:bg-[#E5654B] hover:text-white hover:border-[#E5654B] bg-white shadow-md shadow-orange-500/5'
                                        }`}
                                        aria-label="Selanjutnya"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Lihat Semua Kartu Button */}
                                <Link 
                                    href={route('greeting-card-catalog')}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E5654B]/30 hover:border-[#E5654B] text-[#E5654B] hover:bg-[#E5654B]/5 font-bold rounded-full text-sm shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98]"
                                >
                                    <span>Lihat Semua Kartu</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {/* Banner bottom details / actions */}
                        <div className="mt-16 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-[#E5654B]/10 to-[#f97316]/5 border border-[#E5654B]/10 rounded-3xl p-8 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Ingin membuat kartu ucapan Anda sendiri?</h3>
                                <p className="text-gray-600 text-xs sm:text-sm mt-1">Gunakan editor interaktif kami untuk mengirim ucapan dalam hitungan menit.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <Link
                                    href="/buat-kartu"
                                    className="px-7 py-3.5 bg-gradient-to-r from-[#E5654B] to-[#f97316] text-white font-bold rounded-2xl text-sm hover:shadow-xl hover:shadow-[#E5654B]/30 transition-all hover:scale-105 duration-300 text-center"
                                >
                                    Buat Kartu Sekarang
                                </Link>
                                <Link
                                    href="/katalog-kartu"
                                    className="px-7 py-3.5 bg-white text-gray-750 font-semibold rounded-2xl text-sm hover:bg-gray-50 transition-all border border-orange-100 text-center"
                                >
                                    Katalog Lengkap Kartu →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ FAQ SECTION (Reseller focus Accordion with Neon lights) ═══ */}
            <section id="faq" className="bg-[#faf9f6] py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8 sm:mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full">Pertanyaan Mitra</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">FAQ Kemitraan Reseller</h2>
                        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
                            Informasi detail seputar sistem kemitraan agensi digital white-label platform.
                        </p>
                    </div>

                    <div className="space-y-2.5 sm:space-y-4">
                        {RESELLER_FAQ.map((faq, index) => {
                            const isOpen = activeFaq === index;
                            return (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition-all duration-300">
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : index)}
                                        className="w-full px-4 py-3.5 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-gray-50/50 transition-colors"
                                    >
                                        <span className="font-extrabold text-xs sm:text-base text-gray-800 leading-snug">
                                            {faq.question}
                                        </span>
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#E5654B]/10 text-[#E5654B]' : ''}`}>
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {/* Animated Answer Body */}
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-gray-100 bg-gray-50/40' : 'max-h-0'}`}>
                                        <div className="px-4 py-3.5 sm:px-6 sm:py-5 text-[11px] sm:text-sm text-gray-550 leading-relaxed font-semibold">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ CTA SECTION (Premium glow panel) ═══ */}
            <section className="relative bg-[#FAF3EC] py-28 overflow-hidden border-t border-orange-100/60">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5654B]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]" />
                
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <div className="bg-gradient-to-br from-[#E5654B] to-[#f97316] text-white rounded-3xl p-12 text-center shadow-2xl shadow-[#E5654B]/30 relative overflow-hidden border-none">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <span className="text-xs font-bold text-white tracking-widest uppercase bg-white/15 border border-white/20 px-4 py-2.5 rounded-full mb-6 inline-block">
                            Lisensi Kemitraan White-Label
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 leading-tight">
                            Bangun Platform Agensi Anda Sekarang
                        </h2>
                        <p className="text-white/85 mt-4 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold">
                            Aktivasi lisensi dalam hitungan menit. Hubungi tim kami untuk aktivasi instan dan dapatkan platform reseller profesional Anda hari ini.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                            <button onClick={() => handleWhatsAppRedirect()} className="w-full px-8 py-4 bg-white text-[#E5654B] hover:bg-[#FFF5EE] rounded-2xl font-black tracking-wide shadow-xl shadow-black/10 transition-all hover:scale-[1.03] text-sm">
                                Hubungi Admin via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#FAF3EC] text-gray-500 py-14 border-t border-orange-100/60">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-10 border-b border-orange-100/60">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#E5654B] flex items-center justify-center shadow-lg shadow-[#E5654B]/30">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                                </svg>
                            </div>
                            <span className="text-lg font-black tracking-tight text-gray-900">{appName || 'Groovy'}<span className="text-[#E5654B]">.agency</span></span>
                        </div>
                        <div className="text-xs text-gray-500 text-center sm:text-right font-semibold">
                            Email Dukungan Kemitraan: <a href={`mailto:${adminEmail}`} className="text-[#E5654B] hover:underline ml-1 font-bold">{adminEmail}</a>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs font-semibold text-gray-400">
                        <div>© {new Date().getFullYear()} {appName || 'Groovy'}. All rights reserved. Platform Kemitraan Agensi White-Label.</div>
                        <div className="flex items-center gap-5">
                            <a href="#keunggulan" className="hover:text-[#E5654B] transition-colors">Keunggulan</a>
                            <a href="#kalkulator" className="hover:text-[#E5654B] transition-colors">Simulasi</a>
                            <a href="#alur-kerja" className="hover:text-[#E5654B] transition-colors">Cara Kerja</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
