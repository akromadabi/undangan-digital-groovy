import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Mail, Sparkles } from 'lucide-react';
import GreetingCardPreviewCard from '@/Components/GreetingCardPreviewCard';

export default function GreetingCardCatalog({ templates = [], appName = 'Groovy', typeOptions = {}, subscriptionPlans = [] }) {
    const { auth } = usePage().props;
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('terbaru');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const typeDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Event types with count for categories dropdown
    const eventTypesWithCount = useMemo(() => {
        return Object.entries(typeOptions).map(([key, label]) => {
            const count = templates.filter(t => (t.type || []).includes(key)).length;
            return { key, label, count };
        }).sort((a, b) => a.label.localeCompare(b.label));
    }, [templates, typeOptions]);

    const toggleType = (typeKey) => {
        setSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearTypes = () => setSelectedTypes([]);

    const filteredTemplates = useMemo(() => {
        let list = [...(templates || [])];
        if (selectedTypes.length > 0) {
            list = list.filter(t => (t.type || []).some(type => selectedTypes.includes(type)));
        }
        if (search.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
        }
        return list;
    }, [templates, selectedTypes, search]);

    const sortedTemplates = useMemo(() => {
        const arr = [...filteredTemplates];
        if (sortKey === 'terbaru') return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
        if (sortKey === 'populer') {
            // Sort by actual greeting cards created (loaded via withCount) + base_likes
            return arr.sort((a, b) => ((b.greeting_cards_count || 0) + (b.base_likes || 0)) - ((a.greeting_cards_count || 0) + (a.base_likes || 0)));
        }
        if (sortKey === 'disukai') {
            return arr.sort((a, b) => (b.base_likes || 0) - (a.base_likes || 0));
        }
        return arr;
    }, [filteredTemplates, sortKey]);

    const handleUse = (slug) => {
        window.location.href = `/buat-kartu/${slug}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
                setIsTypeDropdownOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <Head title={`Katalog Kartu Ucapan — ${appName}`}>
                <meta name="description" content="Pilih template kartu ucapan interaktif premium — anniversary, ulang tahun, wisuda, pernikahan — dengan animasi dan musik yang memukau." />
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
                        <Link href="/katalog-tema" className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-[#E5654B] transition-colors">
                            Tema Undangan
                        </Link>
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                                Masuk
                            </Link>
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-pink-100">
                                <Mail className="w-3.5 h-3.5 text-pink-600" /> Kartu Ucapan Interaktif
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a]">
                                Katalog Kartu Ucapan
                            </h1>
                            <p className="mt-3 text-gray-500 max-w-xl text-base">
                                {templates.length} template premium tersedia — dengan animasi, musik, dan efek interaktif yang memukau untuk momen spesial.
                            </p>
                        </div>
                        
                        {/* Search and Filters Group */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative w-full sm:w-64">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari template..."
                                    style={{ paddingLeft: '2.5rem' }}
                                    className="w-full pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-white hover:bg-gray-50/50 transition-all text-gray-800"
                                />
                            </div>

                            {/* Filters Dropdowns */}
                            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-shrink-0">
                                {/* Categories Dropdown */}
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
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                            <span className="truncate">
                                                {selectedTypes.length === 0
                                                    ? 'Kategori'
                                                    : `Kategori (${selectedTypes.length})`
                                                }
                                            </span>
                                        </div>
                                        <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isTypeDropdownOpen && (
                                        <div className="absolute left-0 sm:right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">KATEGORI</span>
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

                                {/* Sort Dropdown */}
                                <div className="relative flex-shrink-0" ref={sortDropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                        title="Urutkan Katalog"
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
                                                const isActive = sortKey === opt.key;
                                                return (
                                                    <button
                                                        key={opt.key}
                                                        type="button"
                                                        onClick={() => {
                                                            setSortKey(opt.key);
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
                    </div>
                </div>
            </section>

            {/* ═══ GRID ═══ */}
            <main className="bg-[#faf9f6] min-h-[50vh] py-12">
                <div className="max-w-6xl mx-auto px-6">
                    {sortedTemplates.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            {sortedTemplates.map(tpl => (
                                <GreetingCardPreviewCard
                                    key={tpl.id}
                                    theme={tpl}
                                    onUse={handleUse}
                                    typeOptions={typeOptions}
                                    plans={subscriptionPlans}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 font-medium">Tidak ada template ditemukan</p>
                            <p className="text-gray-400 text-sm mt-1">Coba ubah filter atau kata kunci</p>
                            <button
                                onClick={() => { setSelectedTypes([]); setSearch(''); setSortKey('terbaru'); }}
                                className="mt-4 text-[#E5654B] text-sm font-medium hover:underline"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ CTA BANNER ═══ */}
            {!auth?.user && (
                <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] py-16">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#E5654B]">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                            Siap membuat kartu ucapan yang berkesan?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                            Daftar atau masuk untuk mulai membuat kartu ucapan interaktif dari template pilihan kamu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href={route('login')}
                                className="px-8 py-3.5 bg-[#E5654B] text-white font-bold rounded-2xl hover:bg-[#d4523a] transition-all shadow-lg shadow-[#E5654B]/30"
                            >
                                Masuk & Buat Kartu
                            </Link>
                            <Link
                                href="/katalog-tema"
                                className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                            >
                                Lihat Tema Undangan
                            </Link>
                        </div>
                    </div>
                </section>
            )}

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
