import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const themeConfig = {
    default: {
        name: 'default',
        accentGradient: 'from-[#E5654B] to-[#ff7b5e]',
        accentText: 'text-[#E5654B]',
        sectionBg: 'bg-[#faf9f6]',
        footerBg: 'bg-[#0d0d0d]',
    },
    elegant: {
        name: 'elegant',
        accentGradient: 'from-amber-400 to-yellow-500',
        accentText: 'text-amber-400',
        sectionBg: 'bg-slate-900',
        footerBg: 'bg-slate-950',
    },
    minimal: {
        name: 'minimal',
        accentGradient: 'from-gray-800 to-gray-900',
        accentText: 'text-gray-900',
        sectionBg: 'bg-gray-50',
        footerBg: 'bg-gray-900',
    },
    colorful: {
        name: 'colorful',
        accentGradient: 'from-violet-500 to-pink-500',
        accentText: 'text-violet-500',
        sectionBg: 'bg-violet-50/50',
        footerBg: 'bg-[#1a0a2e]',
    },
};

export default function ResellerThemes({ reseller, themes = [] }) {
    const T = themeConfig[reseller.template] || themeConfig.default;
    const isDark = T.name !== 'minimal';

    const getLikesCount = (theme) => {
        const base = Number(theme.base_likes || 0);
        const real = Number(theme.real_likes || 0);
        return base + real;
    };

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) {
            return path;
        }
        return `/storage/${path}`;
    };
    const [scrolled, setScrolled] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Semua');

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

        const endpoint = `/theme/${theme.id}/like`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ liked: !isLiked })
            });
            const data = await res.json();
            if (data.success) {
                setLikes(prev => ({ ...prev, [theme.id]: data.likes }));
            }
        } catch(e) { console.error('Like toggle failed', e); }
    };

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = themes.map(t => t.category).filter(Boolean);
        return ['Semua', ...new Set(cats)];
    }, [themes]);

    // Filter themes
    const filteredThemes = useMemo(() => {
        if (activeCategory === 'Semua') return themes;
        return themes.filter(t => t.category === activeCategory);
    }, [themes, activeCategory]);

    return (
        <div className={T.sectionBg + ' min-h-screen flex flex-col'}>
            <Head title={`Semua Tema — ${reseller.brand_name}`} />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/50 backdrop-blur-sm border-b border-gray-100/10'}`}>
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href={`/r/${reseller.ref}`} className="flex items-center gap-2.5">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-9 h-9 rounded-xl object-contain" />
                        ) : (
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${T.accentGradient} flex items-center justify-center`}>
                                <span className="text-white text-sm font-bold">{reseller.brand_name.charAt(0)}</span>
                            </div>
                        )}
                        <span className={`text-lg font-bold tracking-tight text-[#1a1a1a] ${T.name === 'elegant' && !scrolled ? 'text-white' : ''}`}>
                            {reseller.brand_name}
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <a href={`${reseller.reseller_url || ''}/login`} className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Masuk
                        </a>
                        <a href={`${reseller.reseller_url || ''}/register?ref=${reseller.ref}`} className={`px-5 py-2.5 bg-gradient-to-r ${T.accentGradient} text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all`}>
                            Buat Undangan
                        </a>
                    </div>
                </div>
            </nav>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-20">
                <div className="mb-10 text-center sm:text-left">
                    <Link href={`/r/${reseller.ref}`} className={`inline-flex items-center gap-1.5 text-sm font-medium mb-4 transition-colors ${T.accentText} hover:opacity-80`}>
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-4 h-4" /> Kembali
                    </Link>
                    <h1 className={`text-3xl sm:text-4xl font-bold tracking-tight ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`}>Koleksi Tema</h1>
                    <p className={`mt-3 max-w-2xl ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>Pilih dari berbagai desain premium yang disesuaikan dengan kebutuhan acara Anda.</p>
                </div>

                {/* Categories Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all snap-start ${activeCategory === cat
                                ? `bg-gradient-to-r ${T.accentGradient} text-white shadow-md`
                                : T.name === 'elegant' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredThemes.map((theme) => (
                        <div key={theme.id} className={`group relative rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col ${T.name === 'elegant' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                            <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                                {theme.thumbnail ? (
                                    <img src={getThumbnailUrl(theme.thumbnail)} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${T.name === 'elegant' ? 'bg-slate-700' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
                                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                                        </svg>
                                    </div>
                                )}
                                {/* Floating Actions */}
                                <div className="absolute right-3 bottom-3 flex flex-row gap-2 opacity-100 z-10">
                                    <a href={theme.preview_url || '#'} target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg text-gray-700 hover:text-gray-900 hover:scale-110 transition-all" title="Lihat Contoh">
                                        <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                    </a>
                                    <a href={`${reseller.reseller_url || ''}/register?ref=${reseller.ref}&theme=${theme.slug}`} className={`w-9 h-9 flex items-center justify-center rounded-full text-white shadow-lg hover:scale-110 transition-all bg-gradient-to-tr ${T.accentGradient}`} title="Order Tema">
                                        <Icon d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className={`font-semibold text-sm truncate flex-1 ${T.name === 'elegant' ? 'text-white' : 'text-[#1a1a1a]'}`} title={theme.name}>{theme.name}</h4>
                                    <AnimatedLikeButton
                                        count={likes[theme.id] ?? getLikesCount(theme)}
                                        liked={!!likedThemes[theme.id]}
                                        onClick={() => handleLike(theme)}
                                    />
                                </div>
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

                    {filteredThemes.length === 0 && (
                        <div className={`col-span-full py-20 text-center ${T.name === 'elegant' ? 'text-slate-400' : 'text-gray-500'}`}>
                            Belum ada tema dalam kategori ini.
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className={`py-10 mt-auto ${T.footerBg}`}>
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
        </div>
    );
}
