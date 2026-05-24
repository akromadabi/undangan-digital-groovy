import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

export default function Themes({ appName, themes = [] }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Extract categories
    const categories = ['Semua', ...new Set(themes.map(t => t.category || 'Umum'))];
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    // Likes State
    const [likes, setLikes] = useState({});
    const [likedThemes, setLikedThemes] = useState({});

    useEffect(() => {
        try {
            const localLikes = JSON.parse(localStorage.getItem('likedThemes') || '{}');
            setLikedThemes(localLikes);
        } catch(e) {}
    }, []);

    const handleLike = async (theme) => {
        const isLiked = likedThemes[theme.id];
        
        setLikedThemes(prev => {
            const next = { ...prev };
            if (isLiked) {
                delete next[theme.id];
            } else {
                next[theme.id] = true;
            }
            localStorage.setItem('likedThemes', JSON.stringify(next));
            return next;
        });
        
        setLikes(prev => {
            const currentLikes = prev[theme.id] ?? (theme.base_likes + theme.real_likes);
            return {
                ...prev,
                [theme.id]: isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1
            };
        });

        const endpoint = isLiked ? `/tema/${theme.id}/unlike` : `/tema/${theme.id}/like`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            const data = await res.json();
            if (data.success) {
                setLikes(prev => ({ ...prev, [theme.id]: data.total_likes }));
            }
        } catch(e) { console.error('Like toggle failed', e); }
    };

    const filteredThemes = selectedCategory === 'Semua' 
        ? themes 
        : themes.filter(t => (t.category || 'Umum') === selectedCategory);

    return (
        <div className="bg-[#faf9f6] min-h-screen pb-20">
            <Head title={`Semua Tema — ${appName}`} />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white border-b border-gray-100'}`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5654B] to-[#d4523a] flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">
                            {appName || 'Groovy'}
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Beranda</Link>
                        <Link href={route('register')} className="px-5 py-2.5 bg-[#E5654B] text-white rounded-full text-sm font-semibold hover:bg-[#d4523a] transition-colors shadow-lg shadow-[#E5654B]/25">
                            Buat Undangan
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ HEADER ═══ */}
            <div className="pt-32 pb-12 max-w-6xl mx-auto px-6 text-center">
                <h1 className="text-3xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight mb-4">Eksplorasi Tema Kami</h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base mb-10">Temukan puluhan desain eksklusif, mulai dari tradisional hingga modern minimalis. Pilih tema yang merepresentasikan momen spesialmu.</p>
                
                {/* ═══ CATEGORY FILTER ═══ */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map((cat, i) => (
                        <button 
                            key={i}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                selectedCategory === cat 
                                    ? 'bg-[#E5654B] text-white shadow-md shadow-[#E5654B]/20' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══ GRID TEMA ═══ */}
            <div className="max-w-6xl mx-auto px-6">
                {filteredThemes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">Tidak ada tema di kategori ini</h3>
                        <p className="text-sm text-gray-500">Coba pilih kategori lain atau kembali ke "Semua".</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredThemes.map((theme) => (
                            <div key={theme.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative group/image">
                                    {theme.thumbnail ? (
                                        <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Action buttons (Mata dan Pesan) */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-10 backdrop-blur-[2px]">
                                        <a href={theme.preview_url || '#'} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white/95 hover:bg-white text-[#1a1a1a] rounded-xl text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Preview
                                        </a>
                                        <Link href={route('register', {theme: theme.id})} className="px-5 py-2.5 bg-[#E5654B] hover:bg-[#d4523a] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            Pesan
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-semibold text-sm text-[#1a1a1a] truncate" title={theme.name}>{theme.name}</h4>
                                        <AnimatedLikeButton
                                            count={likes[theme.id] ?? (theme.base_likes + theme.real_likes)}
                                            liked={!!likedThemes[theme.id]}
                                            onClick={() => handleLike(theme)}
                                        />
                                    </div>
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
                )}
            </div>
        </div>
    );
}
