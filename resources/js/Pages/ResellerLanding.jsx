import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const Star = ({ className = 'w-4 h-4 text-amber-400' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Check = ({ className = 'w-4 h-4 text-emerald-400' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const testimonials = [
    { name: 'Mira & Randi', text: 'Undangannya cantik banget! Tamu-tamu kami kagum dengan desainnya. Sangat praktis dan mudah digunakan.', avatar: 'MR' },
    { name: 'Aisyah & Fadhil', text: 'Fitur RSVP dan QR Code sangat membantu kami mendata tamu yang hadir. Recommended banget!', avatar: 'AF' },
    { name: 'Dewi & Arief', text: 'Harganya terjangkau tapi kualitasnya premium. Semua tamu bilang undangannya elegan dan modern.', avatar: 'DA' },
];

const allFeatures = [
    { icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', title: 'Desain Premium', desc: 'Pilihan tema elegan & modern yang bisa disesuaikan dengan keinginan Anda' },
    { icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3', title: 'Mobile Friendly', desc: 'Tampilan sempurna di semua perangkat — smartphone, tablet, dan desktop' },
    { icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z', title: 'QR Code & RSVP', desc: 'Fitur check-in QR Code dan konfirmasi kehadiran otomatis untuk tamu' },
    { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', title: 'Kirim via WhatsApp', desc: 'Bagikan undangan langsung ke WhatsApp tamu dengan satu klik mudah' },
    { icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', title: 'Amplop Digital', desc: 'Terima hadiah & amplop digital dari tamu langsung lewat undangan' },
    { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: 'Privasi Terjaga', desc: 'Kontrol siapa yang bisa melihat undangan Anda dengan pengaturan privasi' },
];

const planColors = {
    free: { badge: 'bg-gray-500', btn: 'from-gray-400 to-gray-500' },
    silver: { badge: 'bg-slate-500', btn: 'from-slate-500 to-slate-600' },
    gold: { badge: 'bg-amber-500', btn: 'from-amber-400 to-orange-500' },
    platinum: { badge: 'bg-violet-500', btn: 'from-violet-500 to-purple-600' },
};

const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

/* ═══════════════════════════════════════════════════════════
   THEME CONFIG — each template picks from these palettes
   ═══════════════════════════════════════════════════════════ */
const themeConfig = {
    default: {
        name: 'default',
        heroBg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        accent: '#E5654B',
        accentGradient: 'from-[#E5654B] to-[#ff7b5e]',
        accentText: 'text-[#E5654B]',
        accentBg: 'bg-[#E5654B]',
        accentBgLight: 'bg-[#E5654B]/10',
        blurColor1: 'bg-[#E5654B]/10',
        blurColor2: 'bg-purple-500/10',
        badgeBg: 'bg-white/10 border-white/10 text-white/80',
        headingGradient: 'from-[#E5654B] via-[#ff7b5e] to-[#ffb347]',
        sectionBg: 'bg-[#faf9f6]',
        cardBg: 'bg-white border-gray-100',
        cardHoverIcon: 'group-hover:from-[#E5654B] group-hover:to-[#d4523a]',
        ctaBg: 'from-[#1a1a2e] via-[#16213e] to-[#0f3460]',
        footerBg: 'bg-[#0d0d0d]',
        testimonialAvatar: 'from-[#E5654B] to-[#ff7b5e]',
    },
    elegant: {
        name: 'elegant',
        heroBg: 'from-slate-900 via-slate-800 to-slate-900',
        accent: '#f59e0b',
        accentGradient: 'from-amber-400 to-yellow-500',
        accentText: 'text-amber-400',
        accentBg: 'bg-amber-500',
        accentBgLight: 'bg-amber-400/10',
        blurColor1: 'bg-amber-500/10',
        blurColor2: 'bg-slate-500/10',
        badgeBg: 'bg-amber-400/10 border-amber-400/20 text-amber-400',
        headingGradient: 'from-amber-300 to-yellow-400',
        sectionBg: 'bg-slate-900',
        cardBg: 'bg-slate-800/60 border-slate-700/50',
        cardHoverIcon: 'group-hover:from-amber-400 group-hover:to-yellow-500',
        ctaBg: 'from-slate-900 via-slate-800 to-slate-900',
        footerBg: 'bg-slate-950',
        testimonialAvatar: 'from-amber-400 to-yellow-500',
    },
    minimal: {
        name: 'minimal',
        heroBg: 'from-gray-50 via-white to-gray-50',
        accent: '#111827',
        accentGradient: 'from-gray-800 to-gray-900',
        accentText: 'text-gray-900',
        accentBg: 'bg-gray-900',
        accentBgLight: 'bg-gray-100',
        blurColor1: 'bg-gray-200/50',
        blurColor2: 'bg-gray-300/30',
        badgeBg: 'bg-gray-100 border-gray-200 text-gray-600',
        headingGradient: 'from-gray-700 to-gray-900',
        sectionBg: 'bg-gray-50',
        cardBg: 'bg-white border-gray-200',
        cardHoverIcon: 'group-hover:from-gray-800 group-hover:to-gray-900',
        ctaBg: 'from-gray-900 via-gray-800 to-gray-900',
        footerBg: 'bg-gray-900',
        testimonialAvatar: 'from-gray-700 to-gray-900',
    },
    colorful: {
        name: 'colorful',
        heroBg: 'from-violet-900 via-purple-900 to-indigo-900',
        accent: '#8b5cf6',
        accentGradient: 'from-violet-500 to-pink-500',
        accentText: 'text-violet-500',
        accentBg: 'bg-violet-500',
        accentBgLight: 'bg-violet-500/10',
        blurColor1: 'bg-violet-500/15',
        blurColor2: 'bg-pink-500/10',
        badgeBg: 'bg-white/10 border-white/10 text-white/80',
        headingGradient: 'from-violet-400 via-pink-400 to-orange-300',
        sectionBg: 'bg-violet-50/50',
        cardBg: 'bg-white border-violet-100',
        cardHoverIcon: 'group-hover:from-violet-500 group-hover:to-pink-500',
        ctaBg: 'from-violet-900 via-purple-900 to-indigo-900',
        footerBg: 'bg-[#1a0a2e]',
        testimonialAvatar: 'from-violet-500 to-pink-500',
    },
};

export default function ResellerLanding({ reseller, plans, themes = [] }) {
    const T = themeConfig[reseller.template] || themeConfig.default;
    const isDark = T.name !== 'minimal';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    return (
        <>
            <Head title={`${reseller.brand_name} — Undangan Digital Premium`} />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/r/${reseller.ref}`} className="flex items-center gap-2.5">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-9 h-9 rounded-xl object-contain" />
                        ) : (
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${T.accentGradient} flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">{reseller.brand_name.charAt(0)}</span>
                            </div>
                        )}
                        <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-[#1a1a1a]' : isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                            {reseller.brand_name}
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link href="/login" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-gray-900' : isDark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                            Masuk
                        </Link>
                        <Link href={`/register?ref=${reseller.ref}`} className={`px-5 py-2.5 bg-gradient-to-r ${T.accentGradient} text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all`}>
                            Buat Undangan
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br ${T.heroBg}`}>
                <div className={`absolute top-20 left-10 w-72 h-72 ${T.blurColor1} rounded-full blur-3xl`} />
                <div className={`absolute bottom-20 right-10 w-96 h-96 ${T.blurColor2} rounded-full blur-3xl`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${T.blurColor1} rounded-full blur-3xl opacity-30`} />

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full text-xs font-medium mb-8 border ${T.badgeBg}`}>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Gratis untuk semua
                    </div>
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Buat Undangan
                        <span className={`block mt-2 bg-gradient-to-r ${T.headingGradient} bg-clip-text text-transparent`}>
                            Digital Premium
                        </span>
                    </h1>
                    <p className={`text-lg mt-6 max-w-lg mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        Desain elegan, fitur lengkap, dan mudah dibagikan. Buat undangan pernikahan Anda dalam hitungan menit.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <Link href={`/register?ref=${reseller.ref}`} className={`px-8 py-4 bg-gradient-to-r ${T.accentGradient} text-white rounded-2xl text-sm font-bold hover:shadow-2xl transition-all hover:-translate-y-0.5`}>
                            Buat Undangan Gratis
                        </Link>
                        <a href="#preview" className={`px-6 py-4 backdrop-blur-sm rounded-2xl text-sm font-medium transition-all border ${isDark ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}>
                            Lihat Contoh
                        </a>
                    </div>
                    <div className={`flex items-center justify-center gap-8 mt-12 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        {['Gratis selamanya', 'Tanpa watermark', 'Unlimited tamu'].map((t, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ STATS BAR ═══ */}
            <section className={`border-b ${isDark && T.name !== 'minimal' ? `bg-gradient-to-r ${T.name === 'elegant' ? 'from-slate-800 to-slate-800 border-slate-700' : T.name === 'colorful' ? 'from-violet-950 to-purple-950 border-violet-800' : 'bg-white border-gray-100'}` : 'bg-white border-gray-100'}`}>
                <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    {[
                        { val: `${themes.length || 7}+`, label: 'Tema Tersedia' },
                        { val: '100%', label: 'Gratis' },
                        { val: '5 Menit', label: 'Siap Kirim' },
                        { val: '24/7', label: 'Online' },
                    ].map((s, i) => (
                        <div key={i}>
                            <div className={`text-3xl font-bold ${T.name === 'elegant' ? 'text-white' : T.name === 'colorful' ? 'text-white' : 'text-[#1a1a1a]'}`}>{s.val}</div>
                            <div className={`text-xs mt-1 font-medium ${T.name === 'elegant' ? 'text-slate-400' : T.name === 'colorful' ? 'text-violet-300' : 'text-gray-500'}`}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ 6 FEATURES ═══ */}
            <section className={`py-20 ${T.sectionBg}`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>Kenapa Pilih Kami?</h2>
                        <p className={`mt-3 max-w-lg mx-auto ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>Fitur lengkap untuk membuat undangan pernikahan digital yang sempurna</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allFeatures.map((f, i) => (
                            <div key={i} className={`rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${T.cardBg}`}>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${T.accentBgLight} flex items-center justify-center mb-4 ${T.cardHoverIcon} transition-all`}>
                                    <Icon d={f.icon} className={`w-6 h-6 ${T.accentText} group-hover:text-white transition-colors`} />
                                </div>
                                <h3 className={`font-bold mb-1.5 ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>{f.title}</h3>
                                <p className={`text-sm leading-relaxed ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ THEME PREVIEW ═══ */}
            <section id="preview" className={`py-20 ${T.name === 'elegant' ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>Pilihan Tema Undangan</h2>
                            <p className={`mt-3 max-w-lg ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>Koleksi tema elegan dan modern yang siap digunakan</p>
                        </div>
                        {themes.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2">
                                <button onClick={() => { document.getElementById('reseller-theme-scroll')?.scrollBy({ left: -280, behavior: 'smooth' }); }}
                                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${T.name === 'elegant' ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                </button>
                                <button onClick={() => { document.getElementById('reseller-theme-scroll')?.scrollBy({ left: 280, behavior: 'smooth' }); }}
                                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${T.name === 'elegant' ? 'border-slate-600 text-slate-400 hover:bg-slate-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div id="reseller-theme-scroll" className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {themes.map((theme) => (
                            <div key={theme.id} className={`group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-[200px] sm:w-[240px] snap-start ${T.name === 'elegant' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                                    {theme.thumbnail ? (
                                        <img src={`/storage/${theme.thumbnail}`} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${T.name === 'elegant' ? 'bg-slate-700' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                                            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className={`font-semibold text-sm ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>{theme.name}</h4>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className={`text-xs capitalize ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-400'}`}>{theme.category || 'Umum'}</span>
                                        {theme.is_premium ? (
                                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">PREMIUM</span>
                                        ) : (
                                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">GRATIS</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {themes.length === 0 && (
                        <div className={`text-center py-12 ${T.name === 'elegant' ? 'text-slate-500' : 'text-gray-400'}`}>
                            <p>Tema sedang disiapkan...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═══ */}
            <section className={`py-20 ${T.sectionBg}`}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>Apa Kata Mereka?</h2>
                        <p className={`mt-3 ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>Testimoni dari pasangan yang sudah menggunakan layanan kami</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {testimonials.map((t, i) => (
                            <div key={i} className={`rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 ${T.cardBg}`}>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (<Star key={j} />))}
                                </div>
                                <p className={`text-sm leading-relaxed mb-5 ${T.name === 'elegant' ? 'text-slate-300' : 'text-gray-600'}`}>"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${T.testimonialAvatar} flex items-center justify-center text-white text-xs font-bold`}>
                                        {t.avatar}
                                    </div>
                                    <div className={`text-sm font-semibold ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>{t.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PRICING ═══ */}
            <section className={`py-20 ${T.name === 'elegant' ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>Pilih Paket Anda</h2>
                        <p className={`mt-3 ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>Mulai gratis, upgrade kapan saja</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {(plans || []).map((plan, i) => {
                            const colors = planColors[plan.slug] || planColors.silver;
                            const isGold = plan.slug === 'gold';
                            return (
                                <div key={i} className={`relative rounded-2xl p-[2px] transition-all ${isGold ? 'bg-gradient-to-b from-amber-300 to-orange-400 shadow-xl shadow-amber-200/30' : T.name === 'elegant' ? 'bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500' : 'bg-gradient-to-b from-gray-200 to-gray-300 hover:shadow-lg'}`}>
                                    {isGold && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                                            <span className={`text-[10px] font-bold px-4 py-1 rounded-full shadow-md ${T.name === 'elegant' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900' : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'}`}>POPULER</span>
                                        </div>
                                    )}
                                    <div className={`rounded-[14px] p-6 h-full flex flex-col ${T.name === 'elegant' ? 'bg-slate-800' : 'bg-white'}`}>
                                        <div className="text-center mb-4">
                                            <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-bold text-white tracking-wide ${colors.badge}`}>{plan.name}</span>
                                        </div>
                                        <div className="text-center mb-4">
                                            <div className={`text-3xl font-black ${T.name === 'elegant' ? 'text-white' : 'text-gray-900'}`}>{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</div>
                                            {plan.duration_days > 0 && <div className={`text-xs mt-1 ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-400'}`}>{plan.duration_days} hari</div>}
                                        </div>
                                        <div className={`border-t mb-4 ${T.name === 'elegant' ? 'border-slate-700' : 'border-gray-100'}`} />
                                        <div className="space-y-2 mb-5 flex-1">
                                            <div className={`flex items-center gap-2 text-[13px] ${T.name === 'elegant' ? 'text-slate-300' : 'text-gray-700'}`}>
                                                <Icon d="M4.5 12.75l6 6 9-13.5" className={`w-4 h-4 flex-shrink-0 ${T.name === 'elegant' ? 'text-amber-400' : 'text-emerald-500'}`} />
                                                Max <strong className="mx-1">{plan.max_guests?.toLocaleString()}</strong> tamu
                                            </div>
                                            <div className={`flex items-center gap-2 text-[13px] ${T.name === 'elegant' ? 'text-slate-300' : 'text-gray-700'}`}>
                                                <Icon d="M4.5 12.75l6 6 9-13.5" className={`w-4 h-4 flex-shrink-0 ${T.name === 'elegant' ? 'text-amber-400' : 'text-emerald-500'}`} />
                                                Max <strong className="mx-1">{plan.max_galleries}</strong> foto galeri
                                            </div>
                                        </div>
                                        <Link href={`/register?ref=${reseller.ref}`} className={`w-full py-3 text-white rounded-xl text-sm font-bold bg-gradient-to-r ${colors.btn} hover:shadow-lg text-center transition-all`}>
                                            {plan.price > 0 ? 'Mulai Sekarang' : 'Daftar Gratis'}
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══ */}
            <section className={`relative py-20 overflow-hidden bg-gradient-to-br ${T.ctaBg}`}>
                <div className={`absolute top-0 left-1/4 w-96 h-96 ${T.blurColor1} rounded-full blur-3xl`} />
                <div className={`absolute bottom-0 right-1/4 w-64 h-64 ${T.blurColor2} rounded-full blur-3xl`} />
                <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Mulai Buat Undangan Anda</h2>
                    <p className="text-white/50 mt-4 max-w-md mx-auto">Cukup 5 menit untuk membuat undangan digital yang elegan dan siap dibagikan ke semua tamu.</p>
                    <Link href={`/register?ref=${reseller.ref}`} className={`inline-block mt-8 px-10 py-4 bg-gradient-to-r ${T.accentGradient} text-white rounded-2xl font-bold hover:shadow-2xl transition-all hover:-translate-y-0.5`}>
                        Buat Undangan Sekarang — Gratis
                    </Link>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className={`py-10 ${T.footerBg}`}>
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-7 h-7 rounded-lg object-contain" />
                        ) : (
                            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${T.accentGradient} flex items-center justify-center`}>
                                <span className="text-white text-xs font-bold">{reseller.brand_name.charAt(0)}</span>
                            </div>
                        )}
                        <span className="text-sm font-semibold text-white/60">{reseller.brand_name}</span>
                    </div>
                    <div className="text-xs text-white/40">© {new Date().getFullYear()} {reseller.brand_name}. Powered by Groovy.</div>
                </div>
            </footer>
        </>
    );
}
