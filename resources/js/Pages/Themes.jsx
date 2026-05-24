import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

const getThumbnailUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/storage/${path}`;
};

export default function Themes({ themes = [], appName = 'Groovy' }) {
    const { auth } = usePage().props;
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [search, setSearch] = useState('');

    const categories = useMemo(() => {
        const cats = themes.map(t => t.category).filter(Boolean);
        return ['Semua', ...new Set(cats)];
    }, [themes]);

    const filteredThemes = useMemo(() => {
        let list = themes;
        if (activeCategory !== 'Semua') list = list.filter(t => t.category === activeCategory);
        if (search.trim()) list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
        return list;
    }, [themes, activeCategory, search]);

    return (
        <>
            <Head title={`Koleksi Tema Undangan — ${appName}`}>
                <meta name="description" content="Jelajahi koleksi tema undangan digital premium. Filter berdasarkan kategori dan temukan desain yang sesuai dengan impian Anda." />
            </Head>

            {/* ═══ NAVBAR ═══ */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5654B] to-[#d4523a] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">{appName}</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-[#E5654B] transition-colors">
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ═══ HERO ═══ */}
            <section className="bg-gradient-to-b from-[#faf9f6] to-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#E5654B] hover:opacity-80 mb-6 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Kembali ke Beranda
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a]">
                                Koleksi Tema Undangan
                            </h1>
                            <p className="mt-3 text-gray-500 max-w-xl text-base">
                                {themes.length} tema tersedia — elegan, modern, dan siap digunakan untuk momen spesial Anda.
                            </p>
                        </div>
                        {/* Search */}
                        <div className="relative sm:w-64">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari tema..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ FILTER KATEGORI ═══ */}
            <div className="bg-white border-b border-gray-100 sticky top-[73px] z-40">
                <div className="max-w-6xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat)}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    activeCategory === cat
                                        ? 'bg-[#E5654B] text-white shadow-md shadow-[#E5654B]/25'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ GRID TEMA ═══ */}
            <main className="bg-[#faf9f6] min-h-[60vh] py-12">
                <div className="max-w-6xl mx-auto px-6">
                    {filteredThemes.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                            {filteredThemes.map((theme) => (
                                <div key={theme.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                                        {theme.thumbnail ? (
                                            <img
                                                src={getThumbnailUrl(theme.thumbnail)}
                                                alt={theme.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                                </svg>
                                            </div>
                                        )}
                                        {/* Overlay actions on hover */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {theme.preview_url && (
                                                <a
                                                    href={theme.preview_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-[#1a1a1a] hover:bg-gray-100 transition-colors"
                                                    title="Lihat Pratinjau"
                                                >
                                                    Pratinjau
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {/* Info */}
                                    <div className="p-3.5 flex-1 flex flex-col">
                                        <h4 className="font-semibold text-sm text-[#1a1a1a] truncate" title={theme.name}>
                                            {theme.name}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="text-[11px] text-gray-400 capitalize">{theme.category || 'Umum'}</span>
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
                    ) : (
                        <div className="text-center py-20">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                            </svg>
                            <p className="text-gray-500 font-medium">Tidak ada tema yang ditemukan</p>
                            <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                            <button
                                onClick={() => { setActiveCategory('Semua'); setSearch(''); }}
                                className="mt-4 text-[#E5654B] text-sm font-medium hover:underline"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#0d0d0d] text-white/40 py-10">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#E5654B] flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-white/60">{appName}</span>
                    </div>
                    <div className="text-xs">© {new Date().getFullYear()} {appName}. All rights reserved.</div>
                </div>
            </footer>
        </>
    );
}
