import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

const testimonials = [
    { name: 'Mira & Randi', text: 'Undangannya cantik banget! Tamu-tamu kami kagum dengan desainnya. Sangat praktis dan mudah digunakan.', avatar: 'MR' },
    { name: 'Aisyah & Fadhil', text: 'Fitur RSVP dan QR Code sangat membantu kami mendata tamu yang hadir. Recommended banget!', avatar: 'AF' },
    { name: 'Dewi & Arief', text: 'Harganya terjangkau tapi kualitasnya premium. Semua tamu bilang undangannya elegan dan modern.', avatar: 'DA' },
];

const features = [
    { icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', title: 'Desain Premium', desc: 'Pilihan tema elegan & modern yang bisa disesuaikan dengan keinginan Anda' },
    { icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3', title: 'Mobile Friendly', desc: 'Tampilan sempurna di semua perangkat — smartphone, tablet, dan desktop' },
    { icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z', title: 'QR Code & RSVP', desc: 'Fitur check-in QR Code dan konfirmasi kehadiran otomatis untuk tamu' },
    { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', title: 'Kirim via WhatsApp', desc: 'Bagikan undangan langsung ke WhatsApp tamu dengan satu klik mudah' },
    { icon: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', title: 'Amplop Digital', desc: 'Terima hadiah & amplop digital dari tamu langsung lewat undangan' },
    { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: 'Privasi Terjaga', desc: 'Kontrol siapa yang bisa melihat undangan Anda dengan pengaturan privasi' },
];

export default function Welcome({ auth, canLogin, canRegister, appName, themes = [], recentInvitations = [] }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="Undangan Digital Premium — Buat Undangan Pernikahan Online" />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5654B] to-[#d4523a] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className={`text-lg font-bold tracking-tight transition-colors ${scrolled ? 'text-[#1a1a1a]' : 'text-white'}`}>
                            {appName || 'Groovy'}
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {canLogin && (
                                    <Link href={route('login')} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-[#E5654B]' : 'text-white/90 hover:text-white'}`}>
                                        Masuk
                                    </Link>
                                )}
                                {canRegister && (
                                    <Link href={route('register')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                                        Buat Undangan
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ═══ HERO BANNER ═══ */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#E5654B]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5654B]/5 rounded-full blur-3xl" />

                <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-xs font-medium mb-8 border border-white/10">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        Gratis untuk semua
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                        Buat Undangan
                        <span className="block mt-2 bg-gradient-to-r from-[#E5654B] via-[#ff7b5e] to-[#ffb347] bg-clip-text text-transparent">
                            Digital Premium
                        </span>
                    </h1>
                    <p className="text-lg text-white/60 mt-6 max-w-lg mx-auto leading-relaxed">
                        Desain elegan, fitur lengkap, dan mudah dibagikan. Buat undangan pernikahan Anda dalam hitungan menit.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <Link href={canRegister ? route('register') : '#'} className="px-8 py-4 bg-gradient-to-r from-[#E5654B] to-[#ff7b5e] text-white rounded-2xl text-sm font-bold hover:shadow-2xl hover:shadow-[#E5654B]/30 transition-all hover:-translate-y-0.5">
                            Buat Undangan Gratis
                        </Link>
                        <a href="#preview" className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl text-sm font-medium hover:bg-white/20 transition-all border border-white/10">
                            Lihat Contoh
                        </a>
                    </div>
                    <div className="flex items-center justify-center gap-8 mt-12 text-white/40 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                            Gratis selamanya
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                            Tanpa watermark
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                            Unlimited tamu
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ PROMO / STATS BAR ═══ */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    <div>
                        <div className="text-3xl font-bold text-[#1a1a1a]">{themes.length}+</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Tema Tersedia</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-[#1a1a1a]">100%</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Gratis</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-[#1a1a1a]">5 Menit</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Siap Kirim</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-[#1a1a1a]">24/7</div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">Online</div>
                    </div>
                </div>
            </section>

            {/* ═══ KELEBIHAN / FEATURES ═══ */}
            <section className="bg-[#faf9f6] py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">Kenapa Pilih Kami?</h2>
                        <p className="text-gray-500 mt-3 max-w-lg mx-auto">Fitur lengkap untuk membuat undangan pernikahan digital yang sempurna</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E5654B]/10 to-[#E5654B]/5 flex items-center justify-center mb-4 group-hover:from-[#E5654B] group-hover:to-[#d4523a] transition-all">
                                    <svg className="w-6 h-6 text-[#E5654B] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-[#1a1a1a] mb-1.5">{f.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ PREVIEW TEMA ═══ */}
            <section id="preview" className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">Pilihan Tema Undangan</h2>
                            <p className="text-gray-500 mt-3 max-w-lg">Koleksi tema elegan dan modern yang siap digunakan</p>
                        </div>
                        {themes.length > 0 && (
                            <div className="hidden sm:flex items-center gap-2">
                                <button onClick={() => { const el = document.getElementById('theme-scroll'); el.scrollBy({ left: -280, behavior: 'smooth' }); }}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                </button>
                                <button onClick={() => { const el = document.getElementById('theme-scroll'); el.scrollBy({ left: 280, behavior: 'smooth' }); }}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                    <div id="theme-scroll" className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {themes.map((theme) => (
                            <div key={theme.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-[200px] sm:w-[240px] snap-start">
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                                    {theme.thumbnail ? (
                                        <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-sm text-[#1a1a1a]">{theme.name}</h4>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className="text-xs text-gray-400 capitalize">{theme.category || 'Umum'}</span>
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
                        <div className="text-center py-12 text-gray-400">
                            <p>Tema sedang disiapkan...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═══ */}
            <section className="bg-[#faf9f6] py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">Apa Kata Mereka?</h2>
                            <p className="text-gray-500 mt-3">Testimoni dari pasangan yang sudah menggunakan layanan kami</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => { const el = document.getElementById('testi-scroll'); el.scrollBy({ left: -340, behavior: 'smooth' }); }}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                            </button>
                            <button onClick={() => { const el = document.getElementById('testi-scroll'); el.scrollBy({ left: 340, behavior: 'smooth' }); }}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                            </button>
                        </div>
                    </div>
                    <div id="testi-scroll" className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 flex-shrink-0 w-[300px] sm:w-[340px] snap-start">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5654B] to-[#ff7b5e] flex items-center justify-center text-white text-xs font-bold">
                                        {t.avatar}
                                    </div>
                                    <div className="text-sm font-semibold text-[#1a1a1a]">{t.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ UNDANGAN TERAKHIR ═══ */}
            {recentInvitations.length > 0 && (
                <section className="bg-white py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight">Undangan Terbaru</h2>
                            <p className="text-gray-500 mt-3">Undangan yang baru dibuat oleh pengguna kami</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {recentInvitations.map((inv) => (
                                <a key={inv.id} href={`/u/${inv.slug}`} target="_blank" rel="noopener noreferrer"
                                    className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                                        {inv.cover_image ? (
                                            <img src={inv.cover_image} alt={inv.cover_subtitle || 'Undangan'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E5654B]/5 to-purple-50">
                                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <div className="text-white text-xs font-medium truncate">{inv.cover_subtitle || inv.slug}</div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══ CTA ═══ */}
            <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-20 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5654B]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Mulai Buat Undangan Anda</h2>
                    <p className="text-white/50 mt-4 max-w-md mx-auto">Cukup 5 menit untuk membuat undangan digital yang elegan dan siap dibagikan ke semua tamu.</p>
                    <Link href={canRegister ? route('register') : '#'} className="inline-block mt-8 px-10 py-4 bg-gradient-to-r from-[#E5654B] to-[#ff7b5e] text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#E5654B]/30 transition-all hover:-translate-y-0.5">
                        Buat Undangan Sekarang — Gratis
                    </Link>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#0d0d0d] text-white/40 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#E5654B] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-white/60">{appName || 'Groovy'}</span>
                    </div>
                    <div className="text-xs">© {new Date().getFullYear()} {appName || 'Groovy'}. All rights reserved.</div>
                </div>
            </footer>
        </>
    );
}
