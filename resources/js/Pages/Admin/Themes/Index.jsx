import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

const SORT_OPTIONS = [
    { key: 'terbaru', label: 'Terbaru' },
    { key: 'populer', label: 'Terpopuler' },
    { key: 'disukai', label: 'Terfavorit' },
];

export default function Index({ themes, availableCategories = [] }) {
    const { adminRoutePrefix, flash } = usePage().props;
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortKey, setSortKey] = useState('terbaru');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    const categoryDropdownRef = useRef(null);
    const typeDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    // Close dropdowns on click outside
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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // States for category management modal
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const handleDelete = (id) => { if (confirm('Hapus tema?')) router.delete(`${adminRoutePrefix}/themes/${id}`); };
    const handleToggleActive = (id) => { router.post(`${adminRoutePrefix}/themes/${id}/toggle-active`, {}, { preserveScroll: true }); };

    // Dynamic extraction of unique categories in use (normalized)
    const categories = useMemo(() => {
        return (availableCategories || []).map(cat => cat.trim().toLowerCase());
    }, [availableCategories]);

    // Group categories with their respective count
    const categoriesWithCount = useMemo(() => {
        const counts = {};
        themes?.forEach(t => {
            const cat = t.category ? t.category.trim() : 'Elegant';
            const normalized = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
            counts[normalized] = (counts[normalized] || 0) + 1;
        });
        return (availableCategories || []).map(cat => {
            const trimmed = cat.trim();
            const normalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            return {
                name: trimmed,
                count: counts[trimmed] || counts[normalized] || 0
            };
        });
    }, [themes, availableCategories]);

    const handleCreateCategory = (e) => {
        e.preventDefault();
        if (!newCategoryName || newCategoryName.trim() === '') return;
        setIsCreatingCategory(true);
        router.post(`${adminRoutePrefix}/themes/categories/store`, {
            category: newCategoryName.trim()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewCategoryName('');
                setIsCreatingCategory(false);
            },
            onError: () => {
                setIsCreatingCategory(false);
            }
        });
    };

    const handleUpdateCategory = (oldCategory) => {
        if (!editValue || editValue.trim() === '') return;
        if (editValue.trim().toLowerCase() === oldCategory.toLowerCase()) {
            setEditingCategory(null);
            return;
        }
        router.post(`${adminRoutePrefix}/themes/categories/update`, {
            old_category: oldCategory,
            new_category: editValue.trim()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
            }
        });
    };

    const handleDeleteCategory = (category) => {
        if (confirm(`Hapus kategori "${category}"? Semua tema dengan kategori ini akan dialihkan ke kategori "Elegant".`)) {
            router.post(`${adminRoutePrefix}/themes/categories/delete`, {
                category: category
            }, {
                preserveScroll: true
            });
        }
    };

    const toggleCategory = (cat) => {
        setSelectedCategories(prev => 
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const clearCategories = () => setSelectedCategories([]);

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

    const toggleType = (typeKey) => {
        setSelectedTypes(prev =>
            prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]
        );
    };

    const clearTypes = () => setSelectedTypes([]);

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
        if (sortKey === 'terbaru') {
            list.sort((a, b) => b.id - a.id);
        } else if (sortKey === 'populer') {
            list.sort((a, b) => ((b.usage_count || 0) + (b.base_usage || 0)) - ((a.usage_count || 0) + (a.base_usage || 0)));
        } else if (sortKey === 'disukai') {
            list.sort((a, b) => ((b.base_likes || 0) + (b.real_likes || 0)) - ((a.base_likes || 0) + (a.real_likes || 0)));
        }
        return list;
    }, [themes, selectedCategories, selectedTypes, searchQuery, sortKey]);

    return (
        <DynamicAdminLayout title="Manajemen Tema">
            <Head title="Admin - Themes" />
            <div className="space-y-6">
                {/* Global Notification Banner */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-in fade-in duration-200">
                        <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{flash.success}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-gray-500">Kelola semua tema undangan digital sistem utama.</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors shadow-sm w-fit"
                        >
                            Kelola Kategori
                        </button>
                        <Link href={`${adminRoutePrefix}/themes/create`} className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-xs font-bold hover:bg-[#c94f3a] transition-colors shadow-sm w-fit">+ Tambah Tema</Link>
                    </div>
                </div>

                {/* Filter and Sort Panel */}
                <div className="bg-white rounded-2xl border border-gray-100 p-2.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                    {/* Search Box */}
                    <div className="relative w-full sm:flex-grow">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari tema..."
                            style={{ paddingLeft: '2.25rem' }}
                            className="w-full pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-gray-800"
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                        {/* Categories Dropdown */}
                        <div className="relative flex-1 sm:flex-initial" ref={categoryDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-start gap-1.5 select-none h-[34px] ${
                                    selectedCategories.length > 0
                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 truncate">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="hidden sm:inline truncate">
                                        {selectedCategories.length === 0
                                            ? 'Semua Kategori'
                                            : `Kategori (${selectedCategories.length})`
                                        }
                                    </span>
                                    <span className="sm:hidden truncate">
                                        {selectedCategories.length === 0
                                            ? 'Kategori'
                                            : `Kat (${selectedCategories.length})`
                                        }
                                    </span>
                                </div>
                                <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isCategoryDropdownOpen && (
                                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">Kategori</span>
                                        {selectedCategories.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearCategories}
                                                className="text-[9px] font-bold text-red-500 hover:underline"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-48 overflow-y-auto py-0.5 scrollbar-thin">
                                         {categoriesWithCount.map((cat) => {
                                             const catLower = cat.name.toLowerCase();
                                             const isChecked = selectedCategories.includes(catLower);
                                             return (
                                                 <label
                                                     key={cat.name}
                                                     className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors select-none text-[11px] font-semibold ${
                                                         isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                     }`}
                                                 >
                                                     <div className="flex items-center gap-2">
                                                         <input
                                                             type="checkbox"
                                                             checked={isChecked}
                                                             onChange={() => toggleCategory(catLower)}
                                                             className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3 h-3 cursor-pointer accent-[#E5654B]"
                                                         />
                                                         <span className="capitalize">{cat.name}</span>
                                                     </div>
                                                     <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                                                         {cat.count}
                                                     </span>
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
                                className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center justify-between sm:justify-start gap-1.5 select-none h-[34px] ${
                                    selectedTypes.length > 0
                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-1.5 truncate">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="hidden sm:inline truncate">
                                        {selectedTypes.length === 0
                                            ? 'Semua Acara'
                                            : `Acara (${selectedTypes.length})`
                                        }
                                    </span>
                                    <span className="sm:hidden truncate">
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
                                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">Tipe Acara</span>
                                        {selectedTypes.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearTypes}
                                                className="text-[9px] font-bold text-red-500 hover:underline"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-48 overflow-y-auto py-0.5 scrollbar-thin">
                                        {eventTypesWithCount.map((type) => {
                                            const isChecked = selectedTypes.includes(type.key);
                                            return (
                                                <label
                                                    key={type.key}
                                                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors select-none text-[11px] font-semibold ${
                                                        isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleType(type.key)}
                                                            className="rounded text-[#E5654B] focus:ring-[#E5654B] border-gray-300 w-3 h-3 cursor-pointer accent-[#E5654B]"
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
                        <div className="relative flex-1 sm:flex-initial" ref={sortDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                title="Urutkan Tema"
                                className={`w-full px-3 py-2 rounded-xl transition-all duration-200 border flex items-center justify-between sm:justify-center gap-1.5 select-none h-[34px] sm:w-[34px] ${
                                    isSortDropdownOpen
                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                    <span className="sm:hidden text-xs">
                                        {sortKey === 'terbaru' ? 'Terbaru' : sortKey === 'populer' ? 'Populer' : 'Favorit'}
                                    </span>
                                </div>
                                <svg className={`w-3 h-3 sm:hidden transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isSortDropdownOpen && (
                                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-2 py-1 border-b border-gray-100 mb-0.5">
                                        <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-semibold">Urutkan</span>
                                    </div>
                                    {SORT_OPTIONS.map(opt => {
                                        const isActive = sortKey === opt.key;
                                        return (
                                            <button
                                                key={opt.key}
                                                type="button"
                                                onClick={() => {
                                                    setSortKey(opt.key);
                                                    setIsSortDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold transition-all ${
                                                    isActive
                                                        ? 'bg-[#E5654B]/10 text-[#E5654B]'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <span>{opt.label}</span>
                                                {isActive && (
                                                    <svg className="w-3.5 h-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredThemes.map(theme => (
                        <div key={theme.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full !p-0">
                            <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                                <ThemePreviewCard onlyMockup={true} theme={theme} aspectClass="" />
                                
                                {/* Badges Container - Flex layout prevents overlapping and handles narrow columns gracefully */}
                                <div className="absolute top-1.5 left-1.5 right-1.5 flex flex-wrap gap-1 z-30">
                                    <button
                                        onClick={() => handleToggleActive(theme.id)}
                                        title={theme.is_active ? 'Klik untuk Nonaktifkan Tema' : 'Klik untuk Publikasikan Tema'}
                                        className={`px-1.5 py-0.5 text-[7px] font-black tracking-wider rounded-sm shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-transform whitespace-nowrap flex items-center justify-center leading-none border ${
                                            theme.is_active 
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-500/20 hover:bg-emerald-100' 
                                                : 'bg-gray-50 text-gray-500 border-gray-300/30 hover:bg-gray-100'
                                        }`}
                                    >
                                        {theme.is_active ? 'PUBLISHED' : 'DRAFT'}
                                    </button>
                                    {theme.is_premium && (
                                        <div className="bg-amber-50 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 text-[7px] rounded-sm font-black tracking-wider shadow-xs whitespace-nowrap leading-none flex items-center justify-center">
                                            PREMIUM
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 z-30">
                                    <span className="text-[10px] text-white/90 font-medium">{theme.invitations_count || 0} undangan</span>
                                </div>
                            </div>
                            <div className="p-3 pb-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-[#1a1a1a] text-[13px] group-hover:text-[#E5654B] transition-colors truncate tracking-tight" title={theme.name}>{theme.name}</h4>
                                    <div className="flex items-center justify-between mt-0.5">
                                        <span className="text-[9px] text-gray-400 uppercase font-extrabold tracking-wide block">{theme.category || 'Umum'}</span>
                                        <div className="flex items-center gap-0.5 text-rose-500 font-extrabold text-[9px]" title="Total Likes">
                                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                            </svg>
                                            <span>{Number(theme.base_likes || 0) + Number(theme.real_likes || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Responsive action buttons row - Stacked cleanly into two rows to prevent horizontal squishing */}
                                <div className="flex flex-col gap-1 border-t border-gray-100/80 pt-2.5 mt-2">
                                    <div className="grid grid-cols-2 gap-1">
                                        <Link 
                                            href={`${adminRoutePrefix}/themes/${theme.id}/edit`} 
                                            className="inline-flex items-center justify-center gap-0.5 py-1 rounded-md text-[9.5px] font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            title="Edit Tema"
                                        >
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(theme.id)} 
                                            className="inline-flex items-center justify-center gap-0.5 py-1 rounded-md text-[9.5px] font-bold text-red-600 bg-red-50/50 border border-red-100 hover:bg-red-50 hover:text-red-700 transition-colors"
                                            title="Hapus Tema"
                                        >
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Hapus
                                        </button>
                                    </div>
                                    
                                    <a 
                                        href={`/demo/${theme.slug}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center justify-center gap-0.5 py-1.5 rounded-md text-[9.5px] font-bold text-white bg-[#E5654B] border border-transparent hover:bg-[#c94f3a] transition-colors w-full"
                                    >
                                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        Demo
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Category Management Modal */}
            {showCategoryModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] overflow-hidden transition-all duration-300">
                        {/* Modal Header */}
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm">Kelola Kategori Desain</h3>
                                <p className="text-[10px] text-gray-400">Edit nama atau hapus kategori tema secara massal</p>
                            </div>
                            <button 
                                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 text-lg transition-colors font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-4">
                            {/* Inline Form to Add New Category */}
                            <form onSubmit={handleCreateCategory} className="flex gap-2 p-2 bg-[#faf9f7] border border-gray-100 rounded-2xl">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Tambah kategori baru..."
                                    className="flex-grow bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B] font-semibold text-gray-700 placeholder-gray-400"
                                    disabled={isCreatingCategory}
                                />
                                <button
                                    type="submit"
                                    disabled={isCreatingCategory || !newCategoryName.trim()}
                                    className="px-4 py-2 bg-[#E5654B] text-white rounded-xl text-xs font-bold hover:bg-[#c94f3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center whitespace-nowrap"
                                >
                                    {isCreatingCategory ? '...' : '+ Tambah'}
                                </button>
                            </form>

                            <div className="space-y-2">
                                {categoriesWithCount.map((cat) => {
                                    const isEditing = editingCategory === cat.name;
                                    return (
                                        <div key={cat.name} className="flex items-center justify-between p-3 bg-[#faf9f7] border border-gray-100 rounded-2xl transition-all hover:bg-gray-50/50">
                                            <div className="flex-1 mr-3">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-1.5 w-full">
                                                        <input
                                                            type="text"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B]"
                                                            placeholder="Nama baru..."
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateCategory(cat.name)}
                                                            className="px-2.5 py-1 bg-[#E5654B] text-white rounded-lg text-[10px] font-bold hover:bg-[#c94f3a] transition-colors whitespace-nowrap"
                                                        >
                                                            Simpan
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCategory(null)}
                                                            className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-300 transition-colors whitespace-nowrap"
                                                        >
                                                            Batal
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                                                        <span className="text-[9px] font-extrabold bg-[#E5654B]/10 text-[#E5654B] px-1.5 py-0.5 rounded-md">
                                                            {cat.count} Tema
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {!isEditing && (
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setEditingCategory(cat.name);
                                                            setEditValue(cat.name);
                                                        }}
                                                        className="p-1.5 bg-white border border-gray-200 hover:border-orange-500/30 rounded-lg text-gray-500 hover:text-orange-500 transition-all shadow-xs"
                                                        title="Ubah nama"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.name)}
                                                        className="p-1.5 bg-white border border-gray-200 hover:border-red-500/30 rounded-lg text-gray-500 hover:text-red-500 transition-all shadow-xs"
                                                        title="Hapus"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                            <button
                                onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                                className="py-2 px-4 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DynamicAdminLayout>
    );
}
