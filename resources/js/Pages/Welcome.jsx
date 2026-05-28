import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V3.75a3 3 0 013-3h13.5a3 3 0 013 3v7.5a3 3 0 01-3 3mM5.25 14.25a3 3 0 00-3 3v3.75a3 3 0 003 3h13.5a3 3 0 003-3v-3.75a3 3 0 00-3-3M16.5 7.5h.008v.008H16.5V7.5zm0 9h.008v.008H16.5v-.008z" />
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

export default function Welcome({ auth, canLogin, canRegister, appName, themes = [], recentInvitations = [], resellerCount = 15, invitationCount = 40, adminWhatsapp = '6283132211830', adminEmail = 'admin@groovy.com', minModalCost = 15000 }) {
    const { flash } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [activeFaq, setActiveFaq] = useState(null);
    const [mounted, setMounted] = useState(false);

    // Reseller profit calculator states
    const [clientsCount, setClientsCount] = useState(30); // clients per month
    const [sellingPrice, setSellingPrice] = useState(100000); // price per invitation
    const modalCost = minModalCost; // Flat base cost per active invitation package paid to admin

    const monthlyRevenue = clientsCount * sellingPrice;
    const monthlyCost = clientsCount * modalCost;
    const netProfit = monthlyRevenue - monthlyCost;

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

    const handleWhatsAppRedirect = (message = '') => {
        const formattedMessage = encodeURIComponent(message || 'Halo Admin, saya tertarik untuk mendaftar menjadi partner reseller website undangan digital Anda. Bagaimana cara mulainya?');
        window.open(`https://wa.me/${adminWhatsapp}?text=${formattedMessage}`, '_blank');
    };

    return (
        <>
            <Head title="Mulai Bisnis Undangan Digital Anda Sendiri — Platform Reseller Agensi White-Label" />

            {/* FANCY INFINITE SCROLL KEYFRAMES INLINE STYLE */}
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

            {/* ═══ NAVBAR (Ultra Premium glassmorphism) ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-lg shadow-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5654B] via-[#f97316] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#E5654B]/35 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            {appName || 'Groovy'}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5654B] to-[#f97316]">.agency</span>
                        </span>
                    </Link>

                    {/* Navigation Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#keunggulan" className="text-xs font-black tracking-wider uppercase text-white/70 hover:text-[#E5654B] transition-colors">Keunggulan</a>
                        <a href="#kalkulator" className="text-xs font-black tracking-wider uppercase text-white/70 hover:text-[#E5654B] transition-colors">Simulasi Profit</a>
                        <a href="#alur-kerja" className="text-xs font-black tracking-wider uppercase text-white/70 hover:text-[#E5654B] transition-colors">Cara Kerja</a>
                        <a href="#tema" className="text-xs font-black tracking-wider uppercase text-white/70 hover:text-[#E5654B] transition-colors">Katalog Tema</a>
                        <a href="#faq" className="text-xs font-black tracking-wider uppercase text-white/70 hover:text-[#E5654B] transition-colors">FAQ</a>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('admin.dashboard')} className="px-5 py-2.5 bg-white text-gray-900 rounded-full text-xs font-bold hover:bg-[#E5654B] hover:text-white transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-white/5">
                                Dashboard Panel
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')} className="px-4 py-2 rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/5 transition-all">
                                        Masuk
                                    </Link>
                                )}
                                <Link href="/register/reseller" className="px-5 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#f97316] text-white rounded-full text-xs font-bold hover:shadow-lg hover:shadow-[#E5654B]/30 transition-all hover:scale-[1.03] duration-300 inline-block text-center">
                                    Daftar Partner
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ═══ HERO BANNER (Jaw-dropping neon styling) ═══ */}
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-24">
                {/* Stunning light shapes */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-[#E5654B]/15 rounded-full blur-[120px] animate-pulse duration-10000" />
                <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[160px]" />

                <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 transform ${mounted ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full text-white/90 text-xs font-bold mb-8 border border-white/10 shadow-2xl shadow-black/40">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                        Peluang Kemitraan Agensi: 100% White-Label Platform
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                        Mulai Bisnis Undangan Digital
                        <span className="block mt-3 bg-gradient-to-r from-[#E5654B] via-[#f97316] to-[#f59e0b] bg-clip-text text-transparent drop-shadow-lg">
                            Dengan Brand Milik Anda
                        </span>
                    </h1>
                    
                    <p className="text-base sm:text-xl text-white/60 mt-8 max-w-3xl mx-auto leading-relaxed font-medium">
                        Bangun platform agensi undangan pernikahan digital secara instan. Tanpa ribet urus server, hosting, atau koding. Bebas tentukan harga jual paket, dan terima profit 100% langsung.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-12">
                        <Link href="/register/reseller" className="glow-button w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-[#E5654B] via-[#f97316] to-[#f59e0b] text-white rounded-2xl text-sm font-black tracking-wide shadow-2xl shadow-[#E5654B]/35 transition-all hover:scale-[1.05] duration-300 inline-block text-center">
                            Mulai Kemitraan Sekarang
                        </Link>
                        <a href="#kalkulator" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-xl text-white rounded-2xl text-sm font-extrabold tracking-wide hover:bg-white/10 transition-all border border-white/10 text-center hover:scale-[1.05] duration-300">
                            Simulasi Profit Agensi
                        </a>
                    </div>

                    {/* Trust Indicators (Floating Luxury cards) */}
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mt-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/30">
                        <div className="text-center">
                            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 block">{resellerCount}+</span>
                            <span className="text-[10px] sm:text-xs text-white/45 font-black uppercase tracking-wider block mt-1">Agensi Terdaftar</span>
                        </div>
                        <div className="border-r border-white/10 h-10 self-center" />
                        <div className="text-center">
                            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E5654B] to-[#f97316] block">{invitationCount}+</span>
                            <span className="text-[10px] sm:text-xs text-white/45 font-black uppercase tracking-wider block mt-1">Undangan Aktif</span>
                        </div>
                        <div className="border-r border-white/10 h-10 self-center" />
                        <div className="text-center">
                            <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#f59e0b] block">{themes.length}+</span>
                            <span className="text-[10px] sm:text-xs text-white/45 font-black uppercase tracking-wider block mt-1">Desain Premium</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ INFINITE AUTOSCROLLING PARTNER TICKER (Large, moving and infinite) ═══ */}
            <section className="bg-[#0b0f19] border-y border-white/5 py-12 overflow-hidden relative">
                {/* Soft gradient mask for edges */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0b0f19] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0b0f19] to-transparent z-10 pointer-events-none" />
                
                <div className="max-w-6xl mx-auto px-6 mb-6">
                    <div className="text-center text-xs font-black text-white/30 tracking-widest uppercase">
                        DIAPRESIASI DAN DIOPERASIKAN OLEH MITRA AGENSII TERKEMUKA
                    </div>
                </div>

                {/* Double layout infinite ticker */}
                <div className="flex overflow-hidden whitespace-nowrap py-4">
                    <div className="flex gap-10 items-center justify-around min-w-full animate-infinite-ticker-scroll hover:[animation-play-state:paused] cursor-pointer">
                        {PARTNERS.concat(PARTNERS).map((partner, index) => (
                            <div key={index} className="inline-flex items-center gap-3 bg-white/5 border border-white/5 hover:border-[#E5654B]/30 rounded-2xl px-6 py-4 transition-all duration-300 shadow-xl">
                                <div className="p-2.5 rounded-xl bg-white/5 text-[#E5654B] shadow-inner">
                                    {partner.icon}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-extrabold text-white leading-tight">{partner.name}</div>
                                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">{partner.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ INTERACTIVE PROFIT CALCULATOR WIDGET (Sleek Dark Mode Card) ═══ */}
            <section id="kalkulator" className="bg-[#0f172a] py-24 overflow-hidden relative border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">Simulasi Finansial</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-5">Proyeksi Pendapatan Bersih Agensi Anda</h2>
                        <p className="text-white/50 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">Sesuaikan parameter di bawah untuk memvisualisasikan profit bersih yang langsung masuk ke rekening agensi Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
                        {/* Control Panel (Sliders - Sleek glassmorphism look) */}
                        <div className="lg:col-span-7 bg-[#1e293b]/70 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 backdrop-blur-xl">
                            <h3 className="text-lg font-black text-white border-b border-white/10 pb-4">Konfigurasi Penjualan</h3>
                            
                            {/* Slider 1: Clients per month */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-extrabold text-white/70">Kuantitas Penjualan per Bulan</span>
                                    <span className="text-sm font-black text-[#E5654B] bg-[#E5654B]/10 border border-[#E5654B]/25 px-4 py-1.5 rounded-xl">
                                        {clientsCount} Calon Mempelai
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="5" 
                                    max="150" 
                                    value={clientsCount} 
                                    onChange={(e) => setClientsCount(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                />
                                <div className="flex justify-between text-[10px] text-white/35 font-extrabold">
                                    <span>5 KLIEN</span>
                                    <span>75 KLIEN</span>
                                    <span>150 KLIEN</span>
                                </div>
                            </div>

                            {/* Slider 2: Price per invitation */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-extrabold text-white/70">Harga Jual Paket Undangan Agensi</span>
                                    <span className="text-sm font-black text-[#E5654B] bg-[#E5654B]/10 border border-[#E5654B]/25 px-4 py-1.5 rounded-xl">
                                        Rp {sellingPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="50000" 
                                    max="300000" 
                                    step="10000"
                                    value={sellingPrice} 
                                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E5654B]"
                                />
                                <div className="flex justify-between text-[10px] text-white/35 font-extrabold">
                                    <span>RP 50.000</span>
                                    <span>RP 175.000</span>
                                    <span>RP 300.000</span>
                                </div>
                            </div>

                            {/* Center parameters */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4.5 flex justify-between items-center text-xs">
                                <div className="text-white/60 font-semibold">Harga Modal Terendah dari Sistem Pusat (Dinamis):</div>
                                <div className="text-[#ffb347] font-black text-sm">
                                    Rp {modalCost.toLocaleString('id-ID')} <span className="text-white/40 text-[10px] font-normal">/undangan</span>
                                </div>
                            </div>
                        </div>

                        {/* Profit Output Panel (Ultra Luxury golden outline) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#ffb347]/20 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-black/50">
                            {/* Graphic accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5654B]/25 rounded-full blur-2xl" />
                            
                            <h3 className="text-xs font-black tracking-widest text-white/40 uppercase mb-8">ANALISIS PENDAPATAN BULANAN</h3>

                            <div className="space-y-6">
                                <div>
                                    <span className="text-xs text-white/50 block font-semibold">Proyeksi Omset Kotor</span>
                                    <span className="text-2xl font-black text-white mt-1 block">Rp {monthlyRevenue.toLocaleString('id-ID')}</span>
                                </div>

                                <div className="border-t border-white/5 pt-4">
                                    <span className="text-xs text-white/50 block font-semibold">Pengeluaran Lisensi Pusat</span>
                                    <span className="text-sm font-bold text-red-400 mt-1 block">Rp {monthlyCost.toLocaleString('id-ID')}</span>
                                </div>

                                <div className="border-t border-dashed border-white/10 pt-6">
                                    <span className="text-xs text-[#ffb347] font-extrabold block uppercase tracking-wide">ESTIMASI LABA BERSIH (PROFIT) AGENSI</span>
                                    <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1.5 drop-shadow-md">
                                        Rp {netProfit.toLocaleString('id-ID')}
                                    </div>
                                    <span className="text-[10px] text-white/40 block mt-2.5 leading-relaxed font-semibold">
                                        * Laba bersih di atas dihitung berdasarkan selisih penjualan langsung. Keuntungan 100% masuk ke bank Anda tanpa potongan platform.
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => handleWhatsAppRedirect(`Halo Admin, saya melakukan simulasi profit agensi saya dan mendapat Rp ${netProfit.toLocaleString('id-ID')}/bulan. Saya ingin mendaftar menjadi partner reseller.`)} className="glow-button w-full mt-8 py-4 bg-gradient-to-r from-[#E5654B] to-[#f97316] hover:from-[#d4523a] text-white rounded-2xl font-black text-center text-sm shadow-xl shadow-[#E5654B]/30 transition-all hover:scale-[1.02] active:scale-[0.98] duration-300">
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
            <section id="keunggulan" className="bg-[#0f172a] py-24 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-4 py-2 rounded-full border border-[#E5654B]/20">Infrastruktur Premium</span>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-5">Fitur Unggulan Agensi Anda</h2>
                        <p className="text-white/50 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">Platform agensi undangan digital dengan dukungan kustomisasi dan stabilitas terbaik.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuresList.map((f, i) => (
                            <div key={i} className="bg-gradient-to-br from-[#1e293b]/70 to-[#0f172a]/95 border border-white/5 hover:border-[#E5654B]/30 rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#E5654B]/5 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5654B]/15 to-[#E5654B]/5 flex items-center justify-center mb-6 group-hover:from-[#E5654B] group-hover:to-[#d4523a] transition-all duration-300 shadow-inner group-hover:scale-110">
                                        {f.icon}
                                    </div>
                                    <h3 className="font-black text-white text-lg mb-3 tracking-tight group-hover:text-[#E5654B] transition-colors duration-300">{f.title}</h3>
                                    <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-medium">{f.desc}</p>
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

            {/* ═══ THEME PREVIEW CAROUSEL ═══ */}
            <section id="tema" className="bg-white py-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-[#E5654B]/10 px-3 py-1 rounded-full">Koleksi Desain</span>
                            <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mt-5">Template Premium Siap Jual</h2>
                            <p className="text-gray-500 mt-2 max-w-lg text-sm font-medium">Puluhan desain modern, responsif, dan elegan otomatis aktif di dashboard agensi Anda.</p>
                        </div>
                        {themes.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button onClick={() => { const el = document.getElementById('theme-scroll'); el.scrollBy({ left: -300, behavior: 'smooth' }); }}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                </button>
                                <button onClick={() => { const el = document.getElementById('theme-scroll'); el.scrollBy({ left: 300, behavior: 'smooth' }); }}
                                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:scale-105 active:scale-95 transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div id="theme-scroll" className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {themes.map((theme) => (
                            <div key={theme.id} className="w-[240px] sm:w-[280px] flex-shrink-0 snap-start">
                                <ThemePreviewCard 
                                    theme={theme}
                                />
                            </div>
                        ))}
                    </div>

                    {themes.length === 0 && (
                        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-3xl">
                            <p className="text-sm font-medium">Tema sedang disiapkan...</p>
                        </div>
                    )}
                </div>
            </section>

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
            <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] py-28 overflow-hidden border-t border-white/5">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5654B]/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    <span className="text-xs font-bold text-[#E5654B] tracking-widest uppercase bg-white/5 border border-white/10 px-4 py-2.5 rounded-full mb-6 inline-block">
                        Lisensi Kemitraan White-Label
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4 leading-tight">
                        Bangun Platform Agensi Anda Sekarang
                    </h2>
                    <p className="text-white/60 mt-4 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-semibold">
                        Aktivasi lisensi dalam hitungan menit. Hubungi tim kami untuk aktivasi instan dan dapatkan platform reseller profesional Anda hari ini.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                        <button onClick={() => handleWhatsAppRedirect()} className="glow-button w-full px-8 py-4 bg-gradient-to-r from-[#E5654B] to-[#f97316] text-white rounded-2xl font-black tracking-wide shadow-2xl shadow-[#E5654B]/35 transition-all hover:scale-[1.03] text-sm">
                            Hubungi Admin via WhatsApp
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#0b0c10] text-white/40 py-14 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-10 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-[#E5654B] flex items-center justify-center shadow-lg shadow-[#E5654B]/30">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                                </svg>
                            </div>
                            <span className="text-lg font-black tracking-tight text-white/80">{appName || 'Groovy'}<span className="text-[#E5654B]">.agency</span></span>
                        </div>
                        <div className="text-xs text-white/45 text-center sm:text-right font-semibold">
                            Email Dukungan Kemitraan: <a href={`mailto:${adminEmail}`} className="text-[#ff7b5e] hover:underline ml-1 font-bold">{adminEmail}</a>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 text-xs font-semibold text-white/30">
                        <div>© {new Date().getFullYear()} {appName || 'Groovy'}. All rights reserved. Platform Kemitraan Agensi White-Label.</div>
                        <div className="flex items-center gap-5">
                            <a href="#keunggulan" className="hover:text-white/60 transition-colors">Keunggulan</a>
                            <a href="#kalkulator" className="hover:text-white/60 transition-colors">Simulasi</a>
                            <a href="#alur-kerja" className="hover:text-white/60 transition-colors">Cara Kerja</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
