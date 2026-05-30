import { useState, useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

export default function Index({ themes }) {
    const { adminRoutePrefix } = usePage().props;
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [sortKey, setSortKey] = useState('terbaru');

    const handleDelete = (id) => { if (confirm('Hapus tema?')) router.delete(`${adminRoutePrefix}/themes/${id}`); };
    const handleToggleActive = (id) => { router.post(`${adminRoutePrefix}/themes/${id}/toggle-active`, {}, { preserveScroll: true }); };

    const categories = useMemo(() => {
        const cats = themes?.map(t => t.category).filter(Boolean) || [];
        return ['Semua', ...new Set(cats)];
    }, [themes]);

    const filteredThemes = useMemo(() => {
        let list = [...(themes || [])];
        if (activeCategory !== 'Semua') {
            list = list.filter(t => t.category === activeCategory);
        }
        if (sortKey === 'terbaru') {
            list.sort((a, b) => b.id - a.id);
        } else if (sortKey === 'populer') {
            list.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        } else if (sortKey === 'disukai') {
            list.sort((a, b) => ((b.base_likes || 0) + (b.real_likes || 0)) - ((a.base_likes || 0) + (a.real_likes || 0)));
        }
        return list;
    }, [themes, activeCategory, sortKey]);

    return (
        <DynamicAdminLayout title="Manajemen Tema">
            <Head title="Admin - Themes" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-gray-500">Kelola semua tema undangan digital sistem utama.</p>
                    <Link href={`${adminRoutePrefix}/themes/create`} className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-xs font-bold hover:bg-[#c94f3a] transition-colors shadow-sm w-fit">+ Tambah Tema</Link>
                </div>

                {/* Filter and Sort Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border whitespace-nowrap ${
                                    activeCategory === cat
                                        ? 'bg-[#E5654B] text-white border-transparent shadow-sm'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide mr-1">Urutkan:</span>
                        {[
                            { key: 'terbaru', label: 'Terbaru' },
                            { key: 'populer', label: 'Terpopuler' },
                            { key: 'disukai', label: 'Terfavorit' },
                        ].map((opt) => (
                            <button
                                key={opt.key}
                                onClick={() => setSortKey(opt.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                                    sortKey === opt.key
                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#E5654B]/40 hover:text-[#E5654B]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredThemes.map(theme => (
                        <div key={theme.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            <div className="aspect-[3/4] bg-[#f8f7f4] relative overflow-hidden">
                                <ThemePreviewCard onlyMockup={true} theme={theme} aspectClass="" />
                                <button
                                    onClick={() => handleToggleActive(theme.id)}
                                    title={theme.is_active ? 'Klik untuk Nonaktifkan Tema' : 'Klik untuk Publikasikan Tema'}
                                    className={`absolute top-2 left-2 text-white text-[9px] font-black tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform z-30 w-fit h-fit whitespace-nowrap flex items-center justify-center leading-none ${theme.is_active ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                                >
                                    {theme.is_active ? 'PUBLISHED' : 'DRAFT'}
                                </button>
                                {theme.is_premium && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-sm z-30">PREMIUM</div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 z-30">
                                    <span className="text-xs text-white/90">{theme.invitations_count || 0} undangan</span>
                                </div>
                            </div>
                            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-[#1a1a1a] text-sm group-hover:text-[#E5654B] transition-colors truncate" title={theme.name}>{theme.name}</h4>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wide mt-1 block">{theme.category || 'Umum'}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-2.5">
                                    <div className="flex gap-1.5">
                                        <Link 
                                            href={`${adminRoutePrefix}/themes/${theme.id}/edit`} 
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            title="Edit Tema"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(theme.id)} 
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-red-600 bg-red-50/50 border border-red-100 hover:bg-red-50 hover:text-red-700 transition-colors"
                                            title="Hapus Tema"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                    <a 
                                        href={`/demo/${theme.slug}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white bg-[#E5654B] border border-transparent hover:bg-[#c94f3a] transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
