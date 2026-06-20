import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { 
    Paintbrush, Eye, CheckCircle2, XCircle, Search, 
    Filter, HelpCircle, ArrowRightLeft, BookOpen, Layers,
    Plus, X, Trash2, AlertTriangle
} from 'lucide-react';

export default function BuilderList({ themes, users }) {
    const { adminRoutePrefix, flash } = usePage().props;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [activeTab, setActiveTab] = useState('draft'); // 'draft' | 'published'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Publish targeting modal states
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishThemeId, setPublishThemeId] = useState(null);
    const [publishTarget, setPublishTarget] = useState('public'); // 'public' | 'user'
    const [publishUserId, setPublishUserId] = useState('');

    // Form for creating a new theme
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: 'Builder',
        creation_mode: 'blank',
        copy_from_theme_id: '',
    });

    // Toggle theme active state (Publish / Unpublish)
    const handleToggleActive = (theme) => {
        if (theme.is_active) {
            router.post(`${adminRoutePrefix}/themes/${theme.id}/toggle-active`, {
                is_active: false
            }, {
                preserveScroll: true
            });
        } else {
            setPublishThemeId(theme.id);
            setShowPublishModal(true);
        }
    };

    // Confirm publishing target
    const handleConfirmPublish = () => {
        router.post(`${adminRoutePrefix}/themes/${publishThemeId}/toggle-active`, {
            is_active: true,
            publish_target: publishTarget,
            user_id: publishTarget === 'user' ? publishUserId : null
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowPublishModal(false);
                setPublishThemeId(null);
                setPublishTarget('public');
                setPublishUserId('');
            }
        });
    };

    // Delete a draft theme
    const handleDelete = (theme) => {
        if (theme.invitations_count > 0) {
            alert('Tidak dapat menghapus tema yang sudah dipakai undangan.');
            return;
        }
        setDeleteConfirmId(theme.id);
    };

    const confirmDelete = (themeId) => {
        router.delete(`${adminRoutePrefix}/theme-builder/${themeId}`, {
            onSuccess: () => setDeleteConfirmId(null),
        });
    };

    // Submit create new theme form
    const handleCreate = (e) => {
        e.preventDefault();
        post(`${adminRoutePrefix}/theme-builder`, {
            onSuccess: () => {
                reset();
                setShowCreateModal(false);
            },
        });
    };

    // Extract unique categories from themes
    const categories = useMemo(() => {
        const cats = new Set();
        themes?.forEach(t => {
            if (t.category) cats.add(t.category);
        });
        return ['All', ...Array.from(cats)];
    }, [themes]);

    // Filter themes based on tab, search query, and category
    const filteredThemes = useMemo(() => {
        let list = [...(themes || [])];

        // Filter by tab (is_active)
        if (activeTab === 'draft') {
            list = list.filter(t => !t.is_active);
        } else {
            list = list.filter(t => t.is_active);
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            list = list.filter(t => t.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return list;
    }, [themes, activeTab, selectedCategory, searchQuery]);

    // Count summaries
    const counts = useMemo(() => {
        const activeCount = themes?.filter(t => t.is_active).length || 0;
        const draftCount = themes?.filter(t => !t.is_active).length || 0;
        return { active: activeCount, draft: draftCount };
    }, [themes]);

    const deleteTarget = themes?.find(t => t.id === deleteConfirmId);

    return (
        <DynamicAdminLayout title="Theme Builder">
            <Head title="Theme Builder - Templates" />
            
            <div className="space-y-6">
                {/* Notification Banner */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 mb-4 animate-in fade-in duration-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span className="font-semibold">{flash.error}</span>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-gray-800">Manajemen Template Theme Builder</h2>
                        <p className="text-xs text-gray-500">Sesuaikan layout tema menggunakan Editor, ekspor template, dan publikasikan menjadi tema aktif.</p>
                    </div>
                    {/* Create New Theme Button */}
                    <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Tema Baru
                    </button>
                </div>

                {/* Tab controls */}
                <div className="flex border-b border-gray-200 gap-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('draft')}
                        className={`pb-3 text-xs font-black tracking-wide relative transition-all ${
                            activeTab === 'draft' 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        Draft / Template ({counts.draft})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('published')}
                        className={`pb-3 text-xs font-black tracking-wide relative transition-all ${
                            activeTab === 'published' 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        Published / Aktif ({counts.active})
                    </button>
                </div>

                {/* Search & Category filter box */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari desain template..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-gray-800"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                        <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full sm:w-48 text-xs border border-gray-200 rounded-xl p-2 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] bg-white"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === 'All' ? 'Semua Kategori' : cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Main Grid */}
                {filteredThemes.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
                        <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="font-bold text-gray-700 text-sm mb-1">Tidak Ada Tema Ditemukan</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
                            {activeTab === 'draft' 
                                ? 'Belum ada tema draft. Klik "Buat Tema Baru" untuk mulai membangun tema dari awal.'
                                : 'Tidak ada tema aktif di bawah filter ini. Publikasikan tema draft Anda agar dapat diakses klien.'
                            }
                        </p>
                        {activeTab === 'draft' && (
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Buat Tema Baru
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredThemes.map(theme => (
                            <div key={theme.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full shadow-sm">
                                {/* Thumbnail */}
                                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                                    <img 
                                        src={theme.thumbnail || '/images/theme-placeholder.jpg'} 
                                        alt={theme.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Category badge */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 items-start">
                                        <span className="bg-white/90 backdrop-blur-xs border border-gray-200/50 px-2 py-0.5 text-[8.5px] font-black text-gray-600 rounded-md tracking-wider">
                                            {theme.category || 'General'}
                                        </span>
                                        {theme.is_premium && (
                                            <span className="bg-amber-500 text-white px-2 py-0.5 text-[8.5px] font-black rounded-md tracking-wider">
                                                PREMIUM
                                            </span>
                                        )}
                                        {theme.user && (
                                            <span className="bg-indigo-600 text-white px-2 py-0.5 text-[8.5px] font-black rounded-md tracking-wider shadow-xs" title={`Khusus user: ${theme.user.name} (${theme.user.email})`}>
                                                CUSTOM: {theme.user.name.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Status Badge overlay */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-md tracking-wider ${
                                            theme.is_active 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-gray-400 text-white'
                                        }`}>
                                            {theme.is_active ? 'PUBLISHED' : 'DRAFT'}
                                        </span>
                                    </div>

                                    {/* Invitations count badge */}
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-white rounded-md">
                                        {theme.invitations_count || 0} Undangan
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-[13px] group-hover:text-indigo-600 transition-colors truncate" title={theme.name}>
                                            {theme.name}
                                        </h4>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-mono">slug: {theme.slug}</span>
                                            {theme.user && (
                                                <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 truncate" title={`${theme.user.name} (${theme.user.email})`}>
                                                    👤 Custom: {theme.user.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Row */}
                                    <div className="space-y-2 border-t border-gray-50 pt-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            {/* Open Builder */}
                                            <Link 
                                                href={`${adminRoutePrefix}/theme-builder/${theme.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                                                title="Buka Editor Builder"
                                            >
                                                <Paintbrush className="w-3.5 h-3.5" />
                                                <span>Buka Builder</span>
                                            </Link>
                                            
                                            {/* Demo */}
                                            <a 
                                                href={`/demo/${theme.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Demo</span>
                                            </a>
                                        </div>

                                        {/* Publish Toggle Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(theme)}
                                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                theme.is_active
                                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/50'
                                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50'
                                            }`}
                                        >
                                            <ArrowRightLeft className="w-3.5 h-3.5" />
                                            <span>{theme.is_active ? 'Kembalikan ke Draft' : 'Publikasikan ke Tema'}</span>
                                        </button>

                                        {/* Delete button — only for draft themes with no invitations */}
                                        {!theme.is_active && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(theme)}
                                                className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-100 hover:border-rose-200 transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Hapus Tema Draft</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─────────── CREATE THEME MODAL ─────────── */}
            {showCreateModal && isMounted && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Paintbrush className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-800">Buat Tema Builder Baru</h3>
                                    <p className="text-[10px] text-gray-400">Tema akan dibuat sebagai Draft dan langsung dibuka di Builder.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowCreateModal(false); reset(); }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700">
                                    Nama Tema <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                                        errors.name ? 'border-rose-400 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                                    }`}
                                    placeholder="Contoh: Elegant Garden 2026"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-[10px] text-rose-500 font-semibold">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-700">Kategori</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                                    placeholder="Contoh: Modern, Islami, Javanese..."
                                />
                                <p className="text-[10px] text-gray-400">Kategori membantu pengelompokan tema di katalog.</p>
                            </div>

                            {/* Pemilihan Tipe Awal Desain */}
                            <div className="space-y-2 border-t border-gray-100 pt-3">
                                <label className="text-xs font-bold text-gray-700 block">Tipe Awal Desain</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                                        data.creation_mode === 'blank'
                                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 font-semibold shadow-xs'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="creation_mode"
                                            value="blank"
                                            checked={data.creation_mode === 'blank'}
                                            onChange={() => setData('creation_mode', 'blank')}
                                            className="sr-only"
                                        />
                                        <span className="text-xs font-bold">Kosongan</span>
                                        <span className="text-[9px] text-gray-400 font-normal mt-0.5">Mulai dari nol</span>
                                    </label>
                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                                        data.creation_mode === 'copy'
                                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 font-semibold shadow-xs'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="creation_mode"
                                            value="copy"
                                            checked={data.creation_mode === 'copy'}
                                            onChange={() => setData('creation_mode', 'copy')}
                                            className="sr-only"
                                        />
                                        <span className="text-xs font-bold">Salin Tema Lain</span>
                                        <span className="text-[9px] text-gray-400 font-normal mt-0.5">Copy layout yang ada</span>
                                    </label>
                                </div>
                            </div>

                            {data.creation_mode === 'copy' && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs font-bold text-gray-700">Salin Layout Dari Tema</label>
                                    <select
                                        value={data.copy_from_theme_id}
                                        onChange={e => setData('copy_from_theme_id', e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="">-- Pilih Tema Sumber --</option>
                                        {themes.filter(t => !t.user_id && t.builder_document_count > 0).map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.category || 'General'})</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-2.5 leading-relaxed">
                                        ⚠️ Hanya tema yang dibuat menggunakan <strong>Theme Builder (berbasis JSON)</strong> yang dapat disalin layout-nya. Tema lama berbasis kodingan React hardcoded tidak dapat disalin dan tidak akan muncul di daftar.
                                    </p>
                                    {errors.copy_from_theme_id && (
                                        <p className="text-[10px] text-rose-500 font-semibold">{errors.copy_from_theme_id}</p>
                                    )}
                                </div>
                            )}

                            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 text-[10px] text-indigo-700 leading-relaxed">
                                💡 Setelah dibuat, Anda akan langsung diarahkan ke <strong>Theme Builder Editor</strong> untuk mulai mendesain layout undangan.
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); reset(); }}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.name.trim()}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                            </svg>
                                            Membuat...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-3.5 h-3.5" />
                                            Buat & Buka Builder
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* ─────────── DELETE CONFIRM MODAL ─────────── */}
            {deleteConfirmId && deleteTarget && isMounted && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-rose-50 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800">Hapus Tema Draft?</h3>
                                <p className="text-[10px] text-gray-400 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600">
                            Tema <strong className="text-gray-800">"{deleteTarget.name}"</strong> dan semua data builder-nya akan dihapus permanen.
                        </p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={() => confirmDelete(deleteConfirmId)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all flex items-center justify-center gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ─────────── PUBLISH TARGET MODAL ─────────── */}
            {showPublishModal && isMounted && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-800">Publikasikan Tema</h3>
                                    <p className="text-[10px] text-gray-400">Atur jangkauan publikasi tema ini.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setShowPublishModal(false); setPublishThemeId(null); }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block">Jangkauan Publikasi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                                        publishTarget === 'public'
                                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 font-semibold shadow-xs'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="publish_target"
                                            value="public"
                                            checked={publishTarget === 'public'}
                                            onChange={() => setPublishTarget('public')}
                                            className="sr-only"
                                        />
                                        <span className="text-xs font-bold">Umum (Public)</span>
                                        <span className="text-[9px] text-gray-400 font-normal mt-0.5 text-center">Tersedia untuk semua user</span>
                                    </label>
                                    <label className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                                        publishTarget === 'user'
                                            ? 'border-indigo-600 bg-indigo-50/20 text-indigo-700 font-semibold shadow-xs'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}>
                                        <input
                                            type="radio"
                                            name="publish_target"
                                            value="user"
                                            checked={publishTarget === 'user'}
                                            onChange={() => setPublishTarget('user')}
                                            className="sr-only"
                                        />
                                        <span className="text-xs font-bold">User Tertentu</span>
                                        <span className="text-[9px] text-gray-400 font-normal mt-0.5 text-center">Berdasarkan custom request</span>
                                    </label>
                                </div>
                            </div>

                            {publishTarget === 'user' && (
                                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs font-bold text-gray-700">Pilih User Pemilik Custom</label>
                                    <select
                                        value={publishUserId}
                                        onChange={e => setPublishUserId(e.target.value)}
                                        className="w-full text-xs border border-gray-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
                                    >
                                        <option value="">-- Pilih Akun User Client --</option>
                                        {users?.map(u => (
                                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowPublishModal(false); setPublishThemeId(null); }}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmPublish}
                                    disabled={publishTarget === 'user' && !publishUserId}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Ya, Publikasikan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DynamicAdminLayout>
    );
}
