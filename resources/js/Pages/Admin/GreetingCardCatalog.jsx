import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';
import AnimatedLikeButton from '@/Components/AnimatedLikeButton';

// ── Like button per kartu dengan state lokal ──────────────────────────────────
function LikeButton({ id, baseLikes = 0, storageKey = 'likedGreetingCards', likeEndpoint }) {
    const [liked, setLiked] = useState(() => {
        try {
            const val = localStorage.getItem(storageKey);
            if (!val) return false;
            const stored = JSON.parse(val);
            if (Array.isArray(stored)) {
                return stored.includes(id) || stored.includes(String(id));
            }
            if (stored && typeof stored === 'object') {
                return !!stored[id];
            }
            return false;
        } catch { return false; }
    });
    const [count, setCount] = useState(Number(baseLikes));

    const handleClick = async (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const nextLiked = !liked;
        setLiked(nextLiked);
        setCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));
        try {
            const val = localStorage.getItem(storageKey);
            let stored = {};
            if (val) {
                try {
                    const parsed = JSON.parse(val);
                    if (parsed && typeof parsed === 'object') {
                        stored = parsed;
                    }
                } catch {}
            }
            if (Array.isArray(stored)) {
                if (nextLiked) {
                    if (!stored.includes(id)) stored.push(id);
                } else {
                    stored = stored.filter(x => x !== id && x !== String(id));
                }
            } else {
                if (nextLiked) stored[id] = true; else delete stored[id];
            }
            localStorage.setItem(storageKey, JSON.stringify(stored));
        } catch {}
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            const res = await fetch(likeEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ liked: nextLiked }),
            });
            const result = await res.json();
            if (result.success) setCount(result.likes);
        } catch {}
    };

    return <AnimatedLikeButton count={count} liked={liked} onClick={handleClick} />;
}

// ── Pilihan template mockup visual (sama dengan ThemesCatalog) ──
const templateOptions = [
    { value: 'default',       label: 'Default',        desc: 'Gunakan pengaturan Super Admin' },
    { value: 'full-mockup',   label: 'Gambar Statis',  desc: 'Mockup jadi / custom upload' },
    { value: 'single-phone',  label: '1 HP (Dinamis)', desc: '1 screenshot melayang' },
    { value: 'double-phone',  label: '2 HP (Dinamis)', desc: '2 screenshot bertumpuk' },
    { value: 'triple-phone',  label: '3 HP (Dinamis)', desc: '3 screenshot bertumpuk' },
];

// ── Pilihan background visual ──
const bgStyleOptions = [
    { value: 'default',           label: 'Default',        renderPreview: () => null },
    { value: 'gradient-indigo',   label: 'Indigo Blue',    renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-inner" /> },
    { value: 'gradient-emerald',  label: 'Emerald Green',  renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#11998e] to-[#38ef7d] shadow-inner" /> },
    { value: 'gradient-rose',     label: 'Rose Gold',      renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd] shadow-inner" /> },
    { value: 'luxury-gold',       label: 'Luxury Gold',    renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/20 shadow-inner" /> },
    { value: 'glassmorphism',     label: 'Beige Studio',   renderPreview: () => <div className="w-full h-8 rounded-md bg-[#9e9590] shadow-inner" /> },
    { value: 'gradient-purple',   label: 'Purple Dream',   renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#667eea] to-[#764ba2]" /> },
    { value: 'gradient-pink',     label: 'Pink Love',      renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#f093fb] to-[#f5576c]" /> },
    { value: 'gradient-dark',     label: 'Dark Night',     renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#0d0915] via-[#1b102b] to-[#09090b]" /> },
    { value: 'studio-split',      label: 'Clay & Forest',  renderPreview: () => (
        <div className="w-full h-8 rounded-md bg-[#bf6c54] relative overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#1b2421] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
        </div>
    )},
    { value: 'studio-clay-sand',  label: 'Clay & Sand',   renderPreview: () => (
        <div className="w-full h-8 rounded-md bg-[#e8dcd3] relative overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#a3563f] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
        </div>
    )},
];

const renderBgPreview = (value, activeTemplate) => {
    let resolvedValue = value;
    if (value === 'default') {
        resolvedValue = activeTemplate?.preview_bg_style || 'gradient-dark';
        if (resolvedValue === 'default') resolvedValue = 'gradient-dark';
    }
    const option = bgStyleOptions.find(o => o.value === resolvedValue);
    if (option && option.value !== 'default') return option.renderPreview();
    return <div className="w-full h-full bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400 font-semibold">Default</div>;
};

const SORT_OPTIONS = [
    { key: 'terbaru',  label: 'Terbaru' },
    { key: 'disukai',  label: 'Terfavorit' },
];

function sortTemplates(templates, sortKey) {
    const arr = [...templates];
    if (sortKey === 'terbaru')  return arr.sort((a, b) => (b.id || 0) - (a.id || 0));
    if (sortKey === 'disukai')  return arr.sort((a, b) => (b.base_likes || 0) - (a.base_likes || 0));
    return arr;
}

const typeBadgeColors = {
    anniversary: 'bg-pink-100 text-pink-700',
    birthday:    'bg-amber-100 text-amber-700',
    graduation:  'bg-blue-100 text-blue-700',
    wedding:     'bg-purple-100 text-purple-700',
};

const typeLabels = {
    anniversary: 'Anniversary',
    birthday:    'Ulang Tahun',
    graduation:  'Wisuda',
    wedding:     'Pernikahan',
};

const ALL_EVENT_TYPES = [
    { key: 'anniversary', label: 'Anniversary' },
    { key: 'birthday',    label: 'Ulang Tahun' },
    { key: 'graduation',  label: 'Wisuda' },
    { key: 'wedding',     label: 'Pernikahan' },
];

export default function GreetingCardCatalog({ templates = [], typeOptions = {} }) {
    const { adminRoutePrefix } = usePage().props;
    const resolvedPrefix = adminRoutePrefix || '/admin';

    const [activeTemplate, setActiveTemplate] = useState(null);
    const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [sortKey, setSortKey] = useState('terbaru');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [previewImagesPreviews, setPreviewImagesPreviews] = useState([]);

    const typeDropdownRef  = useRef(null);
    const sortDropdownRef  = useRef(null);
    const bgDropdownRef    = useRef(null);
    const fileInputRef     = useRef(null);

    // Event types with count
    const eventTypesWithCount = useMemo(() => {
        return ALL_EVENT_TYPES.map(opt => {
            const count = templates?.filter(t => {
                const types = Array.isArray(t.type) ? t.type : [];
                return types.includes(opt.key);
            }).length || 0;
            return { ...opt, count };
        });
    }, [templates]);

    const filteredTemplates = useMemo(() => {
        let list = [...(templates || [])];
        if (selectedTypes.length > 0) {
            list = list.filter(t => {
                const types = Array.isArray(t.type) ? t.type : [];
                return types.some(type => selectedTypes.includes(type));
            });
        }
        if (searchQuery.trim()) {
            list = list.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return list;
    }, [templates, selectedTypes, searchQuery]);

    const toggleType = (typeKey) => {
        setSelectedTypes(prev => prev.includes(typeKey) ? prev.filter(t => t !== typeKey) : [...prev, typeKey]);
    };
    const clearTypes = () => setSelectedTypes([]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bgDropdownRef.current && !bgDropdownRef.current.contains(event.target))   setIsBgDropdownOpen(false);
            if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) setIsTypeDropdownOpen(false);
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) setIsSortDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        preview_template: 'default',
        preview_bg_style: 'default',
        preview_images:   [],
        thumbnail:        '',
    });

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    const handleEditClick = (tpl) => {
        setActiveTemplate(tpl);
        const custom = tpl.custom_setting || {};
        const existingImages = custom.preview_images || [];
        setData({
            preview_template: custom.preview_template || 'default',
            preview_bg_style: custom.preview_bg_style || 'default',
            preview_images:   existingImages,
            thumbnail:        custom.thumbnail         || '',
        });
        // Inisialisasi previewImagesPreviews dari gambar yang sudah ada
        setPreviewImagesPreviews(existingImages.map(p => getThumbnailUrl(p)));
    };

    const handleCloseModal = () => {
        setActiveTemplate(null);
        setPreviewImagesPreviews([]);
        reset();
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'greeting-card-templates');
        try {
            const response = await fetch(`${resolvedPrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            if (!response.ok) throw new Error(`Upload error ${response.status}`);
            const result = await response.json();
            setData('thumbnail', result.url);
        } catch (err) {
            alert(`Gagal mengunggah thumbnail: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePreviewImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Tampilkan preview base64 secara instan
        const reader = new FileReader();
        reader.onload = (ev) => {
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = ev.target.result;
            setPreviewImagesPreviews(nextPreviews);
        };
        reader.readAsDataURL(file);

        setUploadingIndex(index);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'greeting-card-templates');
        try {
            const response = await fetch(`${resolvedPrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });
            if (!response.ok) throw new Error(`Upload error ${response.status}`);
            const result = await response.json();
            const nextImages = [...(data.preview_images || [])];
            nextImages[index] = result.url;

            // Update previews dengan URL server yang final
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getThumbnailUrl(result.url);
            setPreviewImagesPreviews(nextPreviews);

            if (index === 0) {
                setData({ ...data, preview_images: nextImages, thumbnail: result.url });
            } else {
                setData('preview_images', nextImages);
            }
        } catch (err) {
            alert(`Gagal mengunggah screenshot #${index + 1}: ${err.message}`);
            // Kembalikan preview ke gambar sebelumnya saat gagal
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getThumbnailUrl(data.preview_images?.[index] || '');
            setPreviewImagesPreviews(nextPreviews);
        } finally {
            setUploadingIndex(null);
        }
    };

    const clearPreviewImage = (index) => {
        const nextImages = [...(data.preview_images || [])];
        nextImages.splice(index, 1);
        if (index === 0) {
            setData({ ...data, preview_images: nextImages, thumbnail: nextImages[0] || '' });
        } else {
            setData('preview_images', nextImages);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post(`${resolvedPrefix}/greeting-card-catalog/${activeTemplate.id}/custom-preview`, {
            onSuccess: () => handleCloseModal(),
        });
    };

    // Resolved values for live preview
    const resolvedTemplate  = data.preview_template === 'default' ? activeTemplate?.preview_template  : data.preview_template;
    const resolvedBg        = data.preview_bg_style === 'default' ? activeTemplate?.preview_bg_style  : data.preview_bg_style;
    const resolvedThumbnail = data.preview_template === 'default' ? activeTemplate?.thumbnail          : data.thumbnail;
    const resolvedImages    = data.preview_template === 'default' ? activeTemplate?.preview_images     : data.preview_images;

    const inputClass = 'w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all';
    const labelClass = 'text-xs font-semibold text-[#888] block mb-1.5 tracking-wide';

    return (
        <DynamicAdminLayout title="Katalog Kartu Ucapan">
            <Head title="Katalog Kartu Ucapan" />
            <div className="space-y-6">
                {/* ── Header + Filter ── */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-4 sm:p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">Daftar Template Kartu Ucapan</h3>
                        <p className="text-xs text-gray-400 mt-1">
                            Berikut adalah pilihan template kartu ucapan dari Super Admin. Klik &quot;Kustomisasi Preview&quot; untuk mengubah tampilan di katalog brand kamu.
                        </p>
                    </div>

                    {/* Search + Filter Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-2.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                        {/* Search */}
                        <div className="relative w-full sm:flex-grow">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari template kartu..."
                                style={{ paddingLeft: '2.25rem' }}
                                className="w-full pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none bg-gray-50/50 hover:bg-gray-50 focus:bg-white transition-all text-gray-800"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
                            {/* Tipe Acara Dropdown */}
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
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="hidden sm:inline truncate">
                                            {selectedTypes.length === 0 ? 'Semua Acara' : `Acara (${selectedTypes.length})`}
                                        </span>
                                        <span className="sm:hidden truncate">
                                            {selectedTypes.length === 0 ? 'Acara' : `Acara (${selectedTypes.length})`}
                                        </span>
                                    </div>
                                    <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-[#E5654B]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isTypeDropdownOpen && (
                                    <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="px-2.5 py-1.5 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Tipe Acara</span>
                                            {selectedTypes.length > 0 && (
                                                <button type="button" onClick={clearTypes} className="text-[9px] font-bold text-red-500 hover:underline">Reset</button>
                                            )}
                                        </div>
                                        <div className="max-h-48 overflow-y-auto py-0.5">
                                            {eventTypesWithCount.map((type) => {
                                                const isChecked = selectedTypes.includes(type.key);
                                                return (
                                                    <label
                                                        key={type.key}
                                                        className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors select-none text-[11px] font-semibold ${isChecked ? 'bg-[#E5654B]/5 text-[#E5654B]' : 'text-gray-700'}`}
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
                                                        <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">{type.count}</span>
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
                                    title="Urutkan Template"
                                    className={`px-0 py-0 rounded-xl transition-all duration-200 border flex items-center justify-center select-none h-[34px] w-[34px] ${
                                        isSortDropdownOpen
                                            ? 'bg-[#E5654B]/10 text-[#E5654B] border-[#E5654B]/30'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                </button>
                                {isSortDropdownOpen && (
                                    <div className="absolute right-0 mt-1.5 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="px-2 py-1 border-b border-gray-100 mb-0.5">
                                            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Urutkan</span>
                                        </div>
                                        {SORT_OPTIONS.map(opt => {
                                            const isActive = sortKey === opt.key;
                                            return (
                                                <button
                                                    key={opt.key}
                                                    type="button"
                                                    onClick={() => { setSortKey(opt.key); setIsSortDropdownOpen(false); }}
                                                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold transition-all ${isActive ? 'bg-[#E5654B]/10 text-[#E5654B]' : 'text-gray-600 hover:bg-gray-50'}`}
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
                </div>

                {/* ── Grid Kartu ── */}
                {filteredTemplates.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortTemplates(filteredTemplates, sortKey).map(tpl => (
                            <div key={tpl.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full !p-0">
                                {/* Mockup Preview Area */}
                                <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                                    <ThemePreviewCard onlyMockup={true} theme={tpl} aspectClass="" />

                                    {/* Badge CUSTOMIZED */}
                                    {tpl.custom_setting && (
                                        <div className="absolute top-1.5 left-1.5 z-30">
                                            <div className="bg-orange-50 text-orange-600 border border-orange-200/50 px-1.5 py-0.5 text-[7px] rounded-sm font-black tracking-wider shadow-xs whitespace-nowrap leading-none">
                                                CUSTOMIZED
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Detail */}
                                <div className="p-3 pb-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-[#1a1a1a] text-[13px] group-hover:text-[#E5654B] transition-colors truncate tracking-tight" title={tpl.name}>{tpl.name}</h4>
                                        <div className="flex items-center justify-between mt-0.5">
                                            {/* Type badges */}
                                            <div className="flex flex-wrap gap-0.5">
                                                {(tpl.type || []).slice(0, 2).map(t => (
                                                    <span key={t} className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${typeBadgeColors[t] || 'bg-gray-100 text-gray-600'}`}>
                                                        {typeLabels[t] || t}
                                                    </span>
                                                ))}
                                            </div>
                                            {/* Like count */}
                                            <div className="relative z-30 select-none">
                                                <LikeButton
                                                    id={tpl.id}
                                                    baseLikes={tpl.base_likes}
                                                    storageKey="likedGreetingCards"
                                                    likeEndpoint={`/greeting-card-template/${tpl.id}/like`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-1 border-t border-gray-100/80 pt-2.5 mt-2">
                                        <div className="grid grid-cols-2 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(tpl)}
                                                className="inline-flex items-center justify-center gap-0.5 py-1 rounded-md text-[9.5px] font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                title="Kustomisasi Preview"
                                            >
                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                                Custom
                                            </button>
                                            <a
                                                href={`/demo-kartu/${tpl.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-0.5 py-1 rounded-md text-[9.5px] font-bold text-white bg-[#E5654B] border border-transparent hover:bg-[#c94f3a] transition-colors"
                                                title="Lihat Demo Kartu"

                                            >
                                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                                Lihat
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium">Tidak ada template ditemukan</p>
                        <button
                            onClick={() => { setSelectedTypes([]); setSearchQuery(''); }}
                            className="mt-3 text-[#E5654B] text-sm font-medium hover:underline"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>

            {/* ══ MODAL KUSTOMISASI ══ */}
            {activeTemplate && createPortal(
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
                    onClick={handleCloseModal}
                >
                    <div
                        className="bg-white border border-[#e8e5e0] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 flex items-center justify-center text-xl transition-all font-light"
                        >
                            &times;
                        </button>

                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                            Kustomisasi Preview: {activeTemplate.name}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            {/* Template Mockup Selector */}
                            <div>
                                <label className={labelClass}>Template Mockup Preview</label>
                                <select
                                    value={data.preview_template}
                                    onChange={e => setData('preview_template', e.target.value)}
                                    className={inputClass}
                                >
                                    {templateOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label} — {opt.desc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Background Style (Hanya jika bukan full-mockup) */}
                            {resolvedTemplate !== 'full-mockup' && (
                                <div className="relative" ref={bgDropdownRef}>
                                    <label className={labelClass}>Gaya Background Preview</label>
                                    <div className="relative">
                                        <div
                                            onClick={() => setIsBgDropdownOpen(!isBgDropdownOpen)}
                                            className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none min-h-[44px]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-6 rounded-md overflow-hidden border border-[#e8e5e0]/60 shadow-xs flex-shrink-0 flex items-center justify-center">
                                                    <div className="w-full h-full rounded-xs overflow-hidden">
                                                        {renderBgPreview(data.preview_bg_style, activeTemplate)}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {bgStyleOptions.find(o => o.value === data.preview_bg_style)?.label || 'Default'}
                                                </span>
                                            </div>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isBgDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {isBgDropdownOpen && (
                                            <div className="absolute z-50 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[180px] overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {bgStyleOptions.map(opt => {
                                                    const isSelected = data.preview_bg_style === opt.value;
                                                    return (
                                                        <div
                                                            key={opt.value}
                                                            onClick={() => { setData('preview_bg_style', opt.value); setIsBgDropdownOpen(false); }}
                                                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all select-none hover:bg-gray-50 ${isSelected ? 'bg-[#E5654B]/5' : ''}`}
                                                        >
                                                            <div className="w-8 h-5 flex-shrink-0 bg-white border border-[#e8e5e0]/60 p-0.5 rounded-md shadow-xs flex items-center justify-center overflow-hidden">
                                                                <div className="w-full h-full rounded-xs overflow-hidden">
                                                                    {renderBgPreview(opt.value, activeTemplate)}
                                                                </div>
                                                            </div>
                                                            <span className={`text-xs font-semibold ${isSelected ? 'text-[#E5654B] font-bold' : 'text-gray-700'}`}>
                                                                {opt.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            {data.preview_template !== 'default' && (
                                <div className="space-y-3 bg-[#faf9f7] p-4 rounded-xl border border-[#e8e5e0]/60">
                                    {resolvedTemplate === 'full-mockup' ? (
                                        <div className="max-w-[145px] mx-auto">
                                            <div className="bg-white p-3 rounded-xl border border-[#e8e5e0]/60 flex flex-col items-center justify-between text-center relative shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-500 mb-2 tracking-wide uppercase">Mockup Statis</span>
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-16 h-24 rounded-md border border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer overflow-hidden relative hover:border-[#E5654B] bg-[#faf9f7] transition-all"
                                                >
                                                    {data.thumbnail ? (
                                                        <img src={getThumbnailUrl(data.thumbnail)} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    )}
                                                    {uploading && (
                                                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                                                            <div className="w-4 h-4 border-2 border-[#E5654B] border-t-transparent rounded-full animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                                                <div className="flex gap-1.5 mt-2.5 w-full">
                                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-1 text-[9px] font-bold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded">
                                                        Upload
                                                    </button>
                                                    {data.thumbnail && (
                                                        <button type="button" onClick={() => setData('thumbnail', '')} className="px-1.5 py-1 text-[9px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded">
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`grid gap-3.5 ${
                                            resolvedTemplate === 'single-phone'
                                                ? 'grid-cols-1 max-w-[145px] mx-auto'
                                                : resolvedTemplate === 'double-phone'
                                                    ? 'grid-cols-2 max-w-[300px] mx-auto'
                                                    : 'grid-cols-3'
                                        }`}>
                                            {[0, 1, 2].map(idx => {
                                                const isNeeded = idx === 0 ||
                                                    (resolvedTemplate === 'double-phone' && idx < 2) ||
                                                    resolvedTemplate === 'triple-phone';
                                                if (!isNeeded) return null;

                                                let slotLabel = `HP #${idx + 1}`;
                                                if (resolvedTemplate === 'single-phone') slotLabel = 'Layar HP Utama';
                                                else if (resolvedTemplate === 'double-phone') {
                                                    slotLabel = idx === 0 ? 'HP Utama (Depan)' : 'HP Kedua (Belakang)';
                                                } else if (resolvedTemplate === 'triple-phone') {
                                                    if (idx === 0) slotLabel = 'HP Utama (Tengah)';
                                                    else if (idx === 1) slotLabel = 'HP Kiri (Belakang)';
                                                    else slotLabel = 'HP Kanan (Belakang)';
                                                }

                                                return (
                                                    <div key={idx} className="bg-white p-3 rounded-xl border border-[#e8e5e0]/60 flex flex-col items-center justify-between text-center relative shadow-sm hover:border-gray-300 transition-colors">
                                                        <span className="text-[9px] font-bold text-gray-500 mb-2 tracking-wide uppercase">{slotLabel}</span>
                                                        <div
                                                            onClick={() => document.getElementById(`gcard-upload-${idx}`).click()}
                                                            className="w-16 h-24 rounded-md border border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer overflow-hidden relative hover:border-[#E5654B] bg-[#faf9f7] transition-all"
                                                        >
                                                            {data.preview_images[idx] ? (
                                                                <img src={getThumbnailUrl(data.preview_images[idx])} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            )}
                                                            {uploadingIndex === idx && (
                                                                <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20">
                                                                    <div className="w-4 h-4 border-2 border-[#E5654B] border-t-transparent rounded-full animate-spin" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <input id={`gcard-upload-${idx}`} type="file" accept="image/*" onChange={e => handlePreviewImageUpload(idx, e)} className="hidden" />
                                                        <div className="flex gap-1.5 mt-2.5 w-full">
                                                            <button type="button" onClick={() => document.getElementById(`gcard-upload-${idx}`).click()} className="flex-1 py-1 text-[9px] font-bold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded">
                                                                Upload
                                                            </button>
                                                            {data.preview_images[idx] && (
                                                                <button type="button" onClick={() => clearPreviewImage(idx)} className="px-1.5 py-1 text-[9px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded">
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Live Preview */}
                            <div className="border-t border-[#f5f3f0] pt-4">
                                <label className={labelClass}>Live Preview Kartu Katalog (Hasil Resolusi)</label>
                                <div className="max-w-[200px] mx-auto p-1.5 bg-[#faf9f7] border border-[#e8e5e0]/60 rounded-xl shadow-inner mt-2">
                                    <ThemePreviewCard
                                        key={`gcc-preview-${previewImagesPreviews.join(',')}-${resolvedTemplate}-${resolvedBg}`}
                                        theme={{
                                            name:             activeTemplate.name,
                                            slug:             activeTemplate.slug,
                                            thumbnail:        resolvedThumbnail,
                                            preview_template: resolvedTemplate,
                                            preview_images:   previewImagesPreviews.length > 0 ? previewImagesPreviews : resolvedImages,
                                            preview_bg_style: resolvedBg,
                                        }}
                                        reseller={null}
                                        isDemoLink={false}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-3 border-t border-[#f5f3f0]">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing || uploading} className="flex-1 py-3 bg-[#E5654B] text-white font-bold rounded-xl text-sm hover:bg-[#c94f3a] transition-all disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan Kustomisasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </DynamicAdminLayout>
    );
}
