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
        desc: 'Gunakan logo, nama brand, favicon, dan domain agensi Anda sendiri secara utuh di mata pembeli.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
            </svg>
        ),
        title: 'Custom Domain', 
        desc: 'Hubungkan domain pribadi Anda (misal: undanganmu.com) agar platform terlihat profesional.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V3.75a3 3 0 013-3h13.5a3 3 0 013 3v7.5a3 3 0 01-3 3 M5.25 14.25a3 3 0 00-3 3v3.75a3 3 0 003 3h13.5a3 3 0 003-3v-3.75a3 3 0 00-3-3M16.5 7.5h.008v.008H16.5V7.5zm0 9h.008v.008H16.5v-.008z" />
            </svg>
        ),
        title: 'Free Server & SSL', 
        desc: 'Semua hosting, perawatan server cloud, enkripsi data SSL gratis diurus penuh oleh tim teknis kami.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869L9.594 3.94zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Dashboard Klien Mandiri', 
        desc: 'Klien Anda mendesain sendiri undangannya, melakukan RSVP, dan mengelola datanya secara independen.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.251.11a3.375 3.375 0 003.498 0l.251-.11a3.375 3.375 0 000-5.714l-.251-.11a3.375 3.375 0 00-3.498 0l-.251.11A3.375 3.375 0 0012 18.182zm0 0V21m0-15V3m0 0a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
        ),
        title: 'Atur Harga & Uang Langsung', 
        desc: 'Tentukan harga jual sesuka Anda ke pasar. Pembeli mentransfer 100% uang langsung ke bank Anda.' 
    },
    { 
        icon: (
            <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.096-.813 9.814-9.814a2.25 2.25 0 00-3.182-3.182l-9.814 9.814zm0 0L14.25 18M3 3h3.5v3.5H3V3zm0 9h3.5v3.5H3V12zm0 9h3.5v3.5H3V21z" />
            </svg>
        ),
        title: '20+ Pilihan Tema Premium', 
        desc: 'Beri opsi melimpah bagi calon mempelai dengan puluhan template responsif terpopuler yang kami sediakan.' 
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
        label: 'Undangan Digital',
        badge: 'Live Preview',
        content: (
            <div className="w-full h-full bg-white flex flex-col justify-between" style={{fontFamily:'inherit'}}>
                {/* Cover Banner */}
                <div className="h-[180px] bg-gradient-to-br from-rose-100 via-pink-50 to-orange-50 flex items-end p-4 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center opacity-25">
                        <svg viewBox="0 0 100 60" className="w-full h-full" fill="none">
                            <path d="M20 50 Q50 10 80 50" stroke="#E5654B" strokeWidth="3" fill="none"/>
                            <circle cx="50" cy="20" r="8" fill="#E5654B" opacity="0.4"/>
                        </svg>
                    </div>
                    <div className="relative z-10 mt-4">
                        <p className="text-[9px] text-rose-500 font-extrabold uppercase tracking-widest">Undangan Pernikahan</p>
                        <p className="text-lg font-black text-gray-900 leading-tight mt-0.5">Rizky & Nadia</p>
                    </div>
                    <div className="absolute top-6 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-2 py-0.5 text-[8px] font-black text-rose-500 shadow-sm">
                        💌 Digital
                    </div>
                </div>
                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-rose-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Tanggal Resepsi</p>
                                <p className="text-xs font-extrabold text-gray-800">Sabtu, 14 Juni 2025</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-orange-450" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Lokasi Acara</p>
                                <p className="text-xs font-extrabold text-gray-800">Grand Ballroom Jakarta</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-[#E5654B] text-white rounded-xl text-xs font-black shadow-md shadow-[#E5654B]/20 hover:bg-[#d4523a] transition-all mt-4">
                        RSVP Sekarang ✓
                    </button>
                </div>
            </div>
        )
    },
    {
        id: 2,
        label: 'Form RSVP',
        badge: 'Konfirmasi Tamu',
        content: (
            <div className="w-full h-full bg-white flex flex-col justify-between" style={{fontFamily:'inherit'}}>
                {/* Header banner */}
                <div className="bg-gradient-to-r from-[#E5654B] to-[#f97316] p-4 pt-6 shrink-0 flex items-center justify-between">
                    <div className="mt-1">
                        <p className="text-white text-xs font-black">Konfirmasi Kehadiran</p>
                        <p className="text-white/70 text-[8px] mt-0.5">Silakan isi form RSVP tamu</p>
                    </div>
                    <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm mt-1">47 hadir</span>
                </div>
                {/* Form fields */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div>
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Nama Tamu</label>
                            <input type="text" readOnly value="Ahmad Fauzi" className="mt-1 w-full border border-gray-150 rounded-xl px-3 py-2 text-xs text-gray-800 bg-gray-50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Jumlah Hadir</label>
                            <div className="mt-1 flex gap-1.5">
                                {[1, 2, 3].map(n => (
                                    <div key={n} className={`flex-1 border rounded-xl py-1.5 text-center text-xs font-black transition-all ${n === 2 ? 'bg-[#E5654B] text-white border-[#E5654B]' : 'border-gray-255 text-gray-500 bg-white'}`}>{n} Orang</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Ucapan & Doa</label>
                            <textarea readOnly value="Selamat ya Rizky & Nadia! Semoga menjadi keluarga sakinah..." className="mt-1 w-full border border-gray-150 rounded-xl px-3 py-1.5 text-xs text-gray-450 bg-gray-50 h-14 resize-none focus:outline-none" />
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-[#E5654B] text-white rounded-xl text-xs font-black shadow-md shadow-[#E5654B]/20 mt-3">
                        Kirim Konfirmasi →
                    </button>
                </div>
            </div>
        )
    },
    {
        id: 3,
        label: 'Galeri & Ucapan',
        badge: 'Tamu Hadir',
        content: (
            <div className="w-full h-full bg-white flex flex-col justify-between" style={{fontFamily:'inherit'}}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 shrink-0">
                    <p className="text-xs font-black text-gray-900 mt-2">💬 Ucapan Tamu</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">12 ucapan dikirim</p>
                </div>
                {/* Messages feed */}
                <div className="p-4 flex-1 overflow-hidden space-y-3 bg-gray-50/50">
                    {[
                        { name: 'Budi S.', msg: 'Selamat menempuh hidup baru! Semoga selalu bahagia 🎊', color: 'bg-blue-500' },
                        { name: 'Sari A.', msg: 'Barakallah, semoga menjadi keluarga sakinah mawaddah 💕', color: 'bg-pink-500' },
                        { name: 'Reza D.', msg: 'Congrats Rizky & Nadia! Wish you a lifetime of love! 🌟', color: 'bg-emerald-500' },
                    ].map((item, i) => (
                        <div key={i} className="flex gap-2.5 items-start">
                            <div className={`w-7 h-7 ${item.color} rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0 shadow-sm`}>
                                {item.name.charAt(0)}
                            </div>
                            <div className="bg-white border border-gray-150 rounded-xl rounded-tl-none px-3 py-1.5 flex-1 shadow-sm">
                                <p className="text-[8px] font-black text-gray-800">{item.name}</p>
                                <p className="text-[8px] text-gray-550 mt-0.5 leading-relaxed">{item.msg}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Stat footer */}
                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                    <div className="bg-[#E5654B]/5 rounded-xl p-2.5 flex items-center gap-2.5 border border-[#E5654B]/10">
                        <div className="w-7 h-7 rounded-lg bg-[#E5654B]/10 flex items-center justify-center text-[#E5654B] text-xs font-black">
                            ✓
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-800">47 tamu konfirmasi hadir</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">dari total 60 undangan</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 4,
        label: 'Countdown Timer',
        badge: 'Hitung Mundur',
        content: (
            <div className="w-full h-full bg-white flex flex-col justify-between p-4" style={{fontFamily:'inherit'}}>
                <div className="text-center mt-3 shrink-0">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Menuju Hari Bahagia</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">Rizky & Nadia</p>
                    <p className="text-[9px] text-[#E5654B] font-bold mt-1 bg-[#E5654B]/5 border border-[#E5654B]/10 px-2 py-0.5 rounded-full inline-block">14 Juni 2025</p>
                </div>
                
                {/* Grid countdown */}
                <div className="grid grid-cols-4 gap-2 my-auto">
                    {[
                        { val: '07', label: 'Hari' },
                        { val: '14', label: 'Jam' },
                        { val: '32', label: 'Menit' },
                        { val: '18', label: 'Detik' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="bg-gradient-to-br from-[#E5654B] to-[#f97316] rounded-xl py-2 shadow-md shadow-[#E5654B]/20">
                                <span className="text-sm font-black text-white leading-none block">{item.val}</span>
                            </div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-wider mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-2 mt-4 shrink-0">
                    <button className="w-full py-2.5 bg-[#E5654B] text-white rounded-xl text-xs font-black shadow-md shadow-[#E5654B]/20">
                        Simpan Tanggal
                    </button>
                    <button className="w-full py-2.5 border border-gray-200 text-gray-650 rounded-xl text-xs font-black">
                        Bagikan Undangan
                    </button>
                </div>
            </div>
        )
    },
];

function HeroSection({ mounted, resellerCount, invitationCount, themesCount, appName, canRegister }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const timerRef = useRef(null);

    const goTo = useCallback((idx) => {
        setActiveSlide(idx);
    }, []);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % APP_SLIDES.length);
        }, 3500);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleDotClick = (idx) => {
        clearInterval(timerRef.current);
        goTo(idx);
        timerRef.current = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % APP_SLIDES.length);
        }, 3500);
    };

    return (
        <section className="relative min-h-screen overflow-hidden pt-20" style={{background: 'linear-gradient(135deg, #FFF5EE 0%, #FFF0E8 40%, #FEE8D6 100%)'}}>
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30" style={{background: 'radial-gradient(circle, #ffd4c2 0%, transparent 70%)', transform: 'translate(30%, -30%)'}} />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #ffb347 0%, transparent 70%)', transform: 'translate(-30%, 30%)'}} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* LEFT: Text + CTA */}
                <div className={`flex-1 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700 border border-orange-200/60 shadow-sm mb-7">
                        <svg className="w-3.5 h-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                        </svg>
                        Platform Undangan Digital all-in-one
                    </div>

                    {/* H1 */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 leading-[1.1] tracking-tight">
                        Bangun<br/>
                        <span className="text-[#E5654B] relative inline-block mr-2 select-none">
                            undangan
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
                            digital
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
                        klien kamu
                    </h1>

                    {/* Desc */}
                    <p className="text-gray-600 mt-6 max-w-md text-base leading-relaxed">
                        Template undangan, RSVP tamu, galeri foto, countdown — kami bangun semuanya untuk bisnis undangan digital kamu. Hosting gratis, data 100% milik sendiri.
                    </p>

                    {/* CTAs */}
                    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:gap-4 mt-8">
                        <Link href="/register/reseller" className="glow-button inline-flex items-center gap-2 sm:gap-4 px-3 sm:px-8 py-3.5 sm:py-4 bg-[#E5654B] text-white rounded-full font-bold shadow-lg shadow-[#E5654B]/35 hover:bg-[#d4523a] transition-all hover:scale-[1.03] active:scale-[0.98] duration-300 w-full sm:min-w-[195px] justify-between">
                            <div className="text-left leading-tight text-xs sm:text-sm font-extrabold tracking-tight">
                                <div>Daftar</div>
                                <div>Agensi</div>
                            </div>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                            </svg>
                        </Link>
                        <a href="#tema" className="inline-flex items-center gap-2 sm:gap-3.5 px-2.5 sm:px-7 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-bold shadow-sm hover:border-gray-300 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 w-full sm:min-w-[195px] justify-start">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E5654B] flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#E5654B]/20">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white ml-0.5" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                            <div className="text-left leading-tight text-xs sm:text-sm font-extrabold tracking-tight">
                                <div>Lihat</div>
                                <div>Katalog</div>
                            </div>
                        </a>
                    </div>

                    {/* Trust: avatars + rating */}
                    <div className="flex flex-wrap items-center gap-4 mt-9">
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
                <div className={`flex-1 w-full max-w-sm lg:max-w-none transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="relative">
                        {/* Slide badge (Floating above the phone) */}
                        <div className="absolute -top-7 left-4 z-20 transition-all duration-300">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-[11px] font-black text-gray-750 shadow-md border border-gray-150">
                                <span className="w-1.5 h-1.5 bg-[#E5654B] rounded-full animate-pulse"></span>
                                {APP_SLIDES[activeSlide].badge}
                            </span>
                        </div>

                        {/* Physical Phone Frame (sekotak HP) */}
                        <div className="relative mx-auto max-w-[290px] w-full bg-zinc-950 rounded-[2.5rem] p-2 border-2 border-zinc-800 shadow-2xl overflow-hidden z-10">
                            {/* Left Side Buttons (Volume keys) */}
                            <div className="absolute left-[-2px] top-24 w-[2px] h-10 bg-zinc-700 rounded-l-sm z-0" />
                            <div className="absolute left-[-2px] top-36 w-[2px] h-10 bg-zinc-700 rounded-l-sm z-0" />
                            {/* Right Side Button (Power key) */}
                            <div className="absolute right-[-2px] top-28 w-[2px] h-14 bg-zinc-700 rounded-r-sm z-0" />

                            {/* Dynamic Island Notch */}
                            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30 pointer-events-none flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-850" />
                            </div>

                            {/* Screen Container */}
                            <div className="w-full h-[470px] rounded-[2rem] overflow-hidden bg-white relative border border-zinc-200">
                                {/* Glossy Reflection Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20" />
                                <div
                                    className="hero-carousel-track h-full"
                                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                                >
                                    {APP_SLIDES.map((slide) => (
                                        <div key={slide.id} className="hero-carousel-slide w-full h-full flex-shrink-0">
                                            {slide.content}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating accent cards */}
                        <div className="float-card-1 absolute -left-8 top-12 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 hidden lg:flex items-center gap-2.5 z-10">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-850">{invitationCount}+ Undangan</p>
                                <p className="text-[9px] text-gray-405">Aktif sekarang</p>
                            </div>
                        </div>

                        <div className="float-card-2 absolute -right-6 bottom-16 bg-white rounded-2xl p-3 shadow-xl border border-gray-100 hidden lg:flex items-center gap-2.5 z-10">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#E5654B] to-[#f97316] rounded-xl flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-850">{themesCount}+ Tema</p>
                                <p className="text-[9px] text-gray-405">Premium tersedia</p>
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
                            <p className="text-[10px] text-gray-450 font-medium">Klik card atau tunggu auto-slide</p>
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
    const [themeSortKey, setThemeSortKey] = useState('terbaru');
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

    // Card event types with counts
    const cardTypesWithCount = useMemo(() => {
        return Object.entries(greetingCardTypeOptions || {}).map(([key, label]) => {
            const count = greetingCards?.filter(t => (t.type || []).includes(key)).length || 0;
            return { key, label, count };
        }).sort((a, b) => a.label.localeCompare(b.label));
    }, [greetingCards, greetingCardTypeOptions]);

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

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => setSelectedCategories([]);

    const toggleType = (typeKey) => {
        setSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearTypes = () => setSelectedTypes([]);

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
                @keyframes float-card {
                    0%, 100% { transform: translateY(0px) rotate(-1deg); }
                    50% { transform: translateY(-10px) rotate(-1deg); }
                }
                @keyframes float-card-2 {
                    0%, 100% { transform: translateY(-5px) rotate(2deg); }
                    50% { transform: translateY(5px) rotate(2deg); }
                }
                .float-card-1 { animation: float-card 4s ease-in-out infinite; }
                .float-card-2 { animation: float-card-2 5s ease-in-out infinite; }
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
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 border-b ${scrolled ? 'nav-scrolled border-gray-100 py-3' : 'nav-top border-transparent py-4'}`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5654B] to-[#f97316] flex items-center justify-center shadow-md shadow-[#E5654B]/30 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                            </svg>
                        </div>
                        <span className="text-xl font-black tracking-tight text-gray-900">
                            {appName || 'Groovy'}<span className="text-[#E5654B]">.</span>
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
                                {canLogin && (
                                    <Link href={route('login')} className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#E5654B] transition-colors">
                                        Masuk
                                    </Link>
                                )}
                                <Link href="/register/reseller" className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-bold hover:bg-[#d4523a] shadow-md shadow-[#E5654B]/25 transition-all hover:scale-[1.03] duration-300 inline-block text-center">
                                    Mulai Project Sekarang
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
                            {canLogin && (
                                <Link 
                                    href={route('login')} 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="w-full py-3.5 text-center font-extrabold text-gray-700 hover:text-[#E5654B] border border-gray-200 rounded-full transition-colors bg-white text-sm"
                                >
                                    Masuk
                                </Link>
                            )}
                            <Link 
                                href="/register/reseller" 
                                onClick={() => setMobileMenuOpen(false)} 
                                className="w-full py-4 bg-[#E5654B] text-white rounded-full text-center font-extrabold hover:bg-[#d4523a] shadow-md shadow-[#E5654B]/25 transition-all text-sm"
                            >
                                Mulai Project Sekarang
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
            <section className="bg-[#FAF3EC] border-y border-orange-100/60 py-12 overflow-hidden relative">
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
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">Simulasi Finansial</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">Proyeksi Pendapatan Bersih Agensi Anda</h2>
                        <p className="text-gray-650 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold">Sesuaikan parameter di bawah untuk memvisualisasikan profit bersih yang langsung masuk ke rekening agensi Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                        {/* Control Panel (Sliders for each plan - Dynamic White-Label Pricing) */}
                        <div className="lg:col-span-7 bg-white border border-orange-100 rounded-3xl p-8 shadow-xl space-y-6 flex flex-col justify-between">
                            <h3 className="text-lg font-black text-gray-900 border-b border-gray-150 pb-4 flex justify-between items-center">
                                <span>Konfigurasi Penjualan</span>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-400">Atur Volume & Harga Jual Paket</span>
                            </h3>
                            
                            <div className="space-y-6 flex-1 py-2">
                                {activePlans.map(plan => {
                                    const qty = quantities[plan.id] ?? plan.defaultQty;
                                    const price = prices[plan.id] ?? plan.defaultPrice;
                                    const unitProfit = Math.max(0, price - plan.price);

                                    return (
                                        <div key={plan.id} className="bg-[#FFFDFB] border border-orange-100/60 rounded-2xl p-5 space-y-4 transition-all hover:bg-[#FFFBF8] duration-200">
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
                        <div className="lg:col-span-5 bg-gradient-to-br from-[#E5654B] to-[#f97316] text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-[#E5654B]/35 flex flex-col justify-between border-none">
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
            <section id="alur-kerja" className="bg-[#faf9f6] py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full">Alur Sistem</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">3 Langkah Mudah Menjalankan Agensi</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">Sistem bisnis otomatisasi white-label kami siap dijalankan secara instan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="relative group bg-white rounded-3xl border border-gray-150 p-8 hover:shadow-2xl hover:border-[#E5654B]/20 transition-all duration-500 hover:-translate-y-1.5 shadow-xl shadow-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E5654B] to-[#f97316] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#E5654B]/30 mb-6">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Registrasi Kemitraan (Daftar)</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                                Lakukan registrasi kemitraan dan pilih paket lisensi agensi yang sesuai dengan proyeksi bisnis Anda. Proses verifikasi dan aktivasi instan sehingga Anda dapat langsung memulai bisnis saat itu juga.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group bg-white rounded-3xl border border-gray-150 p-8 hover:shadow-2xl hover:border-[#E5654B]/20 transition-all duration-500 hover:-translate-y-1.5 shadow-xl shadow-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black text-lg shadow-lg mb-6">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Konfigurasi Sistem (Setup)</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                                Personalisasi platform agensi Anda dengan mengunggah nama brand, logo, favicon, serta menghubungkan custom domain pilihan Anda. Seluruh dashboard klien akan berubah mengikuti identitas brand Anda.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group bg-white rounded-3xl border border-gray-150 p-8 hover:shadow-2xl hover:border-[#E5654B]/20 transition-all duration-500 hover:-translate-y-1.5 shadow-xl shadow-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-[#f59e0b] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-amber-400/20 mb-6">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Pemasaran & Penjualan (Pasarkan)</h3>
                            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                                Mulai pasarkan platform agensi Anda ke calon pengantin atau wedding organizer dengan harga paket yang Anda tentukan sendiri. Terima pembayaran 100% secara langsung dari klien Anda secara mandiri.
                            </p>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuresList.map((f, i) => (
                            <div key={i} className="bg-white border border-orange-100 hover:border-[#E5654B]/30 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center mb-6 group-hover:bg-[#E5654B] group-hover:text-white transition-all duration-300 shadow-inner group-hover:scale-110">
                                        {f.icon}
                                    </div>
                                    <h3 className="font-black text-gray-900 text-lg mb-3 tracking-tight group-hover:text-[#E5654B] transition-colors duration-300">{f.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">{f.desc}</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-5 text-[11px] font-black tracking-widest text-[#E5654B] uppercase opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                                    Dapatkan Akses
                                    <span>→</span>
                                </div>
                            </div>
                        ))}
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

                    {/* Overhauled Filters & Search Bar */}
                    {themes.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full">
                            {/* Search Box */}
                            <div className="relative w-full sm:max-w-md">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari tema pilihan Anda..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-gray-800"
                                />
                            </div>

                            {/* Dropdowns Group */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Categories Dropdown */}
                                <div className="relative flex-1 sm:flex-initial" ref={categoryDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className={`w-full px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-start gap-2 select-none min-h-[42px] ${
                                            selectedCategories.length > 0
                                                ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            <span className="truncate">
                                                {selectedCategories.length === 0
                                                    ? 'Kategori'
                                                    : `Kategori (${selectedCategories.length})`
                                                }
                                            </span>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isCategoryDropdownOpen && (
                                        <div className="absolute left-0 sm:right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">KATEGORI</span>
                                                {selectedCategories.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearCategories}
                                                        className="text-[10px] font-bold text-red-500 hover:underline"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                                                {categories.map((cat) => {
                                                    const isChecked = selectedCategories.includes(cat);
                                                    return (
                                                        <label
                                                            key={cat}
                                                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors select-none text-xs font-semibold ${
                                                                isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleCategory(cat)}
                                                                className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#E5654B]"
                                                            />
                                                            <span className="capitalize">{cat}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Event Types Dropdown */}
                                <div className="relative flex-1 sm:flex-initial" ref={typeDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                        className={`w-full px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-start gap-2 select-none min-h-[42px] ${
                                            selectedTypes.length > 0
                                                ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">
                                                {selectedTypes.length === 0
                                                    ? 'Acara'
                                                    : `Acara (${selectedTypes.length})`
                                                }
                                            </span>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isTypeDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">TIPE ACARA</span>
                                                {selectedTypes.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearTypes}
                                                        className="text-[10px] font-bold text-red-500 hover:underline"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                                                {eventTypesWithCount.map((type) => {
                                                    const isChecked = selectedTypes.includes(type.key);
                                                    return (
                                                        <label
                                                            key={type.key}
                                                            className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors select-none text-xs font-semibold ${
                                                                isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleType(type.key)}
                                                                    className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#E5654B]"
                                                                />
                                                                <span>{type.label}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                                                                {type.count}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Dropdown - Only Icon */}
                                <div className="relative" ref={sortDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                        title="Urutkan Tema"
                                        className={`p-0 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center justify-center select-none min-h-[42px] w-[42px] ${
                                            isSortDropdownOpen
                                                ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    </button>

                                    {isSortDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">URUTKAN BERDASARKAN</span>
                                            </div>
                                            {[
                                                { key: 'terbaru', label: 'Terbaru' },
                                                { key: 'populer', label: 'Terpopuler' },
                                                { key: 'disukai', label: 'Terfavorit' }
                                            ].map(opt => {
                                                const isActive = themeSortKey === opt.key;
                                                return (
                                                    <button
                                                        key={opt.key}
                                                        type="button"
                                                        onClick={() => {
                                                            setThemeSortKey(opt.key);
                                                            setIsSortDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                                                            isActive
                                                                ? 'bg-[#E5654B]/10 text-[#E5654B]'
                                                                : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {isActive && (
                                                            <svg className="w-4 h-4 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Theme Grid */}
                    {filteredThemes.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                            {sortThemes(filteredThemes, themeSortKey).map((theme) => (
                                <div key={theme.id} className="flex-shrink-0">
                                    <ThemePreviewCard 
                                        theme={theme}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                            <p className="text-sm font-medium">Tidak ada tema dalam kategori ini.</p>
                        </div>
                    )}

                    {themes.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                            <p className="text-sm font-medium">Tema sedang disiapkan...</p>
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

                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 w-full">
                            {/* Search Box */}
                            <div className="relative w-full sm:max-w-md">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={cardSearchQuery}
                                    onChange={e => setCardSearchQuery(e.target.value)}
                                    placeholder="Cari kartu ucapan..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-orange-100 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white hover:bg-gray-50 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                                />
                            </div>

                            {/* Dropdowns Group */}
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                {/* Event Types Dropdown */}
                                <div className="relative flex-1 sm:flex-initial" ref={cardTypeDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCardTypeDropdownOpen(!isCardTypeDropdownOpen)}
                                        className={`w-full px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-start gap-2 select-none min-h-[42px] ${
                                            cardSelectedTypes.length > 0
                                                ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                : 'bg-white text-gray-655 border-orange-100 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">
                                                {cardSelectedTypes.length === 0
                                                    ? 'Acara'
                                                    : `Acara (${cardSelectedTypes.length})`
                                                }
                                            </span>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isCardTypeDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isCardTypeDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">TIPE ACARA</span>
                                                {cardSelectedTypes.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearCardTypes}
                                                        className="text-[10px] font-bold text-[#E5654B] hover:underline"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                            </div>
                                            <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
                                                {cardTypesWithCount.map((type) => {
                                                    const isChecked = cardSelectedTypes.includes(type.key);
                                                    return (
                                                        <label
                                                            key={type.key}
                                                            className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors select-none text-xs font-semibold ${
                                                                isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    onChange={() => toggleCardType(type.key)}
                                                                    className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3.5 h-3.5 cursor-pointer accent-[#E5654B]"
                                                                />
                                                                <span>{type.label}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold text-gray-500 bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded-md">
                                                                {type.count}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Dropdown */}
                                <div className="relative" ref={cardSortDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCardSortDropdownOpen(!isCardSortDropdownOpen)}
                                        title="Urutkan Kartu"
                                        className={`p-0 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center justify-center select-none min-h-[42px] w-[42px] ${
                                            isCardSortDropdownOpen
                                                ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                                : 'bg-white text-gray-655 border-orange-100 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                        </svg>
                                    </button>

                                    {isCardSortDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">URUTKAN BERDASARKAN</span>
                                            </div>
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
                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                                                            isActive
                                                                ? 'bg-[#E5654B]/10 text-[#E5654B]'
                                                                : 'text-gray-700 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <span>{opt.label}</span>
                                                        {isActive && (
                                                            <svg className="w-4 h-4 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        {sortedCards.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                {sortedCards.map((card) => (
                                    <div key={card.id} className="flex-shrink-0">
                                        <GreetingCardPreviewCard 
                                            theme={card}
                                            typeOptions={greetingCardTypeOptions}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-450 border border-dashed border-orange-100 rounded-3xl bg-white">
                                <p className="text-sm font-medium">Tidak ada kartu ucapan dalam kategori ini.</p>
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
            <section id="faq" className="bg-[#faf9f6] py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full">Pertanyaan Mitra</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">FAQ Kemitraan Reseller</h2>
                        <p className="text-gray-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
                            Informasi detail seputar sistem kemitraan agensi digital white-label platform.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {RESELLER_FAQ.map((faq, index) => {
                            const isOpen = activeFaq === index;
                            return (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition-all duration-300">
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : index)}
                                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-gray-50/50 transition-colors"
                                    >
                                        <span className="font-extrabold text-sm sm:text-base text-gray-800 leading-snug">
                                            {faq.question}
                                        </span>
                                        <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 bg-[#E5654B]/10 text-[#E5654B]' : ''}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {/* Animated Answer Body */}
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] border-t border-gray-100 bg-gray-50/40' : 'max-h-0'}`}>
                                        <div className="px-6 py-5 text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
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
