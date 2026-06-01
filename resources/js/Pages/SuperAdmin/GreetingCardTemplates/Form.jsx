import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

// ── Pilihan template mockup visual (sama dengan tema) ──
const templateOptions = [
    {
        value: 'full-mockup',
        label: 'Gambar Statis',
        desc: 'Mockup jadi / custom upload',
        renderIcon: () => (
            <div className="w-8 h-10 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
            </div>
        ),
    },
    {
        value: 'single-phone',
        label: '1 HP (Dinamis)',
        desc: '1 screenshot melayang',
        renderIcon: () => (
            <div className="w-8 h-10 flex items-center justify-center">
                <div className="w-5 h-9 bg-gray-800 border-[1.5px] border-gray-700 rounded-md shadow-sm relative flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-black rounded-full absolute top-[1px]" />
                    <div className="w-3 h-7 bg-gray-200/20 rounded" />
                </div>
            </div>
        ),
    },
    {
        value: 'double-phone',
        label: '2 HP (Dinamis)',
        desc: '2 screenshot bertumpuk',
        renderIcon: () => (
            <div className="relative w-8 h-10 flex items-center justify-center">
                <div className="absolute w-4 h-8 bg-gray-400 border border-gray-300 rounded shadow-sm -translate-x-1.5 -translate-y-0.5" />
                <div className="absolute w-4 h-8 bg-gray-800 border border-gray-700 rounded shadow-md translate-x-1 translate-y-1 z-10" />
            </div>
        ),
    },
    {
        value: 'triple-phone',
        label: '3 HP (Dinamis)',
        desc: '3 screenshot bertumpuk',
        renderIcon: () => (
            <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute w-3.5 h-7 bg-gray-400 border border-gray-300 rounded shadow-sm -translate-x-2.5" />
                <div className="absolute w-3.5 h-7 bg-gray-400 border border-gray-300 rounded shadow-sm translate-x-2.5" />
                <div className="absolute w-3.5 h-7 bg-gray-800 border border-gray-700 rounded shadow-md z-10" />
            </div>
        ),
    },
];

// ── Pilihan background visual ──
const bgStyleOptions = [
    { value: 'gradient-indigo',      label: 'Indigo Blue',    renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]" /> },
    { value: 'gradient-emerald',     label: 'Emerald Green',  renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#11998e] to-[#38ef7d]" /> },
    { value: 'gradient-rose',        label: 'Rose Gold',      renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd]" /> },
    { value: 'luxury-gold',          label: 'Luxury Gold',    renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/20" /> },
    { value: 'glassmorphism',        label: 'Beige Studio',   renderPreview: () => <div className="w-full h-8 rounded-md bg-[#9e9590]" /> },
    { value: 'gradient-purple',      label: 'Purple Dream',   renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#667eea] to-[#764ba2]" /> },
    { value: 'gradient-pink',        label: 'Pink Love',      renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#f093fb] to-[#f5576c]" /> },
    { value: 'gradient-dark',        label: 'Dark Night',     renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#0d0915] via-[#1b102b] to-[#09090b]" /> },
];

const eventTypes = [
    { id: 'anniversary', name: 'Anniversary' },
    { id: 'birthday',    name: 'Ulang Tahun' },
    { id: 'graduation',  name: 'Wisuda' },
    { id: 'wedding',     name: 'Pernikahan' },
];

const getStorageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
    return `/storage/${path}`;
};

const phoneCountMap = { 'single-phone': 1, 'double-phone': 2, 'triple-phone': 3 };

export default function GreetingCardTemplateForm({ template = null }) {
    const isEditing = !!template;

    const { data, setData, post, processing, errors, transform } = useForm({
        name:             template?.name || '',
        slug:             template?.slug || '',
        type:             Array.isArray(template?.type) ? template.type : [],
        bg_gradient:      template?.bg_gradient || 'from-[#0d0915] via-[#1b102b] to-[#09090b]',
        base_likes:       template?.base_likes ?? 0,
        price:            template?.price ?? 49000,
        is_active:        template?.is_active ?? true,
        thumbnail:        template?.thumbnail || '',
        preview_template: template?.preview_template || 'full-mockup',
        preview_images:   Array.isArray(template?.preview_images) ? template.preview_images : [],
        preview_bg_style: template?.preview_bg_style || 'gradient-dark',
    });

    // Thumbnail preview state (untuk full-mockup)
    const [thumbnailPreview, setThumbnailPreview] = useState(getStorageUrl(template?.thumbnail || ''));
    // Preview images state (untuk phone mockup)
    const [previewImagesPreviews, setPreviewImagesPreviews] = useState(
        (Array.isArray(template?.preview_images) ? template.preview_images : []).map(p => getStorageUrl(p))
    );
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    const bgDropdownRef = useRef(null);
    const eventDropdownRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (bgDropdownRef.current && !bgDropdownRef.current.contains(e.target)) {
                setIsBgDropdownOpen(false);
            }
            if (eventDropdownRef.current && !eventDropdownRef.current.contains(e.target)) {
                setIsEventDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const uploadFile = async (file, folder = 'greeting-card-templates') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await fetch('/super-admin/greeting-card-templates/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Upload error ${response.status}`);
        }
        return response.json();
    };

    // Upload thumbnail (untuk full-mockup)
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => setThumbnailPreview(ev.target.result);
        reader.readAsDataURL(file);

        setUploading(true);
        try {
            const result = await uploadFile(file);
            setData(d => ({ ...d, thumbnail: result.url, preview_images: [result.url, ...d.preview_images.slice(1)] }));
            setThumbnailPreview(getStorageUrl(result.url));
        } catch (err) {
            alert(`Gagal upload: ${err.message}`);
            setThumbnailPreview(getStorageUrl(data.thumbnail));
        } finally {
            setUploading(false);
        }
    };

    // Upload screenshot HP (indeks ke-i)
    const handlePreviewImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const next = [...previewImagesPreviews];
            next[index] = ev.target.result;
            setPreviewImagesPreviews(next);
        };
        reader.readAsDataURL(file);

        setUploadingIndex(index);
        try {
            const result = await uploadFile(file);
            const nextImgs = [...(data.preview_images || [])];
            nextImgs[index] = result.url;
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getStorageUrl(result.url);
            setPreviewImagesPreviews(nextPreviews);
            // Gambar pertama juga jadi thumbnail
            if (index === 0) {
                setData(d => ({ ...d, preview_images: nextImgs, thumbnail: result.url }));
                setThumbnailPreview(getStorageUrl(result.url));
            } else {
                setData('preview_images', nextImgs);
            }
        } catch (err) {
            alert(`Gagal upload screenshot #${index + 1}: ${err.message}`);
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getStorageUrl(data.preview_images?.[index]);
            setPreviewImagesPreviews(nextPreviews);
        } finally {
            setUploadingIndex(null);
        }
    };

    const clearPreviewImage = (index) => {
        const nextImgs = [...(data.preview_images || [])];
        nextImgs.splice(index, 1);
        const nextPreviews = [...previewImagesPreviews];
        nextPreviews.splice(index, 1);
        setPreviewImagesPreviews(nextPreviews);
        if (index === 0) {
            setData(d => ({ ...d, preview_images: nextImgs, thumbnail: nextImgs[0] || '' }));
            setThumbnailPreview(getStorageUrl(nextImgs[0] || ''));
        } else {
            setData('preview_images', nextImgs);
        }
    };

    const handleEventTypeToggle = (typeId) => {
        const currentTypes = [...(data.type || [])];
        const index = currentTypes.indexOf(typeId);
        if (index > -1) {
            currentTypes.splice(index, 1);
        } else {
            currentTypes.push(typeId);
        }
        setData('type', currentTypes);
    };

    const autoSlug = (name) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60);
        setData(d => ({ ...d, name, slug }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const opts = { forceFormData: false };
        if (isEditing) {
            post(`/super-admin/greeting-card-templates/${template.id}?_method=PUT`, opts);
        } else {
            post('/super-admin/greeting-card-templates', opts);
        }
    };

    const inputClass = 'w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 transition-all';
    const labelClass = 'text-xs font-semibold text-[#888] block mb-1.5 tracking-wide';

    const phoneCount = phoneCountMap[data.preview_template] || 0;

    return (
        <SuperAdminLayout title={isEditing ? `Edit Template: ${template.name}` : 'Tambah Template Kartu'}>
            <Head title={`${isEditing ? 'Edit' : 'Tambah'} Template Kartu - Super Admin`} />

            <div className="max-w-2xl space-y-6 pb-36 md:pb-12">
                <Link
                    href="/super-admin/greeting-card-templates"
                    className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium inline-flex items-center gap-1 transition-colors"
                >
                    ← Kembali ke Daftar Template
                </Link>

                {/* Error banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-500/10 rounded-xl p-4 text-xs text-red-800 space-y-1 shadow-sm">
                        <span className="font-bold flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            Gagal menyimpan! Perbaiki kesalahan berikut:
                        </span>
                        <ul className="list-disc list-inside pl-1.5 mt-1 font-medium space-y-0.5">
                            {Object.entries(errors).map(([k, v]) => (
                                <li key={k}><strong>{k.replace('_', ' ')}:</strong> {v}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ════ CARD 1: PENGATURAN DATA ════ */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block" />
                            Pengaturan Data Template
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Nama */}
                            <div>
                                <label className={labelClass}>Nama Template *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => isEditing ? setData('name', e.target.value) : autoSlug(e.target.value)}
                                    className={inputClass}
                                    required
                                    placeholder="Still With You"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className={labelClass}>
                                    Slug (Template Key) *
                                    <span className="ml-1.5 text-[#bbb] font-normal normal-case">— harus sama dengan key di kode</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className={`${inputClass} font-mono`}
                                    required
                                    placeholder="stillwithyou"
                                />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                            </div>

                            {/* Tipe Acara */}
                            <div className={`relative ${isEventDropdownOpen ? 'z-40' : 'z-10'}`} ref={eventDropdownRef}>
                                <label className={labelClass}>Tipe Acara *</label>
                                
                                {/* Trigger Button Dropdown */}
                                <div 
                                    onClick={() => {
                                        setIsEventDropdownOpen(!isEventDropdownOpen);
                                        setIsBgDropdownOpen(false);
                                    }}
                                    className="w-full min-h-[44px] bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs"
                                >
                                    <div className="flex flex-wrap gap-1.5 items-center">
                                        {(data.type || []).length === 0 ? (
                                            <span className="text-[10px] text-[#bbb] font-medium px-1">
                                                Pilih Tipe Acara...
                                            </span>
                                        ) : (
                                            (data.type || []).map(typeId => {
                                                const eventType = eventTypes.find(e => e.id === typeId);
                                                if (!eventType) return null;
                                                return (
                                                    <span 
                                                        key={typeId} 
                                                        className="text-[10px] font-bold bg-[#E5654B]/5 text-[#E5654B] border border-[#E5654B]/10 pl-2.5 pr-1.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-[#E5654B]/10 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEventTypeToggle(typeId);
                                                        }}
                                                    >
                                                        {eventType.name}
                                                        <button type="button" className="text-[#E5654B] hover:text-[#d4523a] font-bold w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px]">&times;</button>
                                                    </span>
                                                );
                                            })
                                        )}
                                    </div>
                                    
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isEventDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {/* Dropdown Options List */}
                                {isEventDropdownOpen && (
                                    <div className="absolute z-50 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150 max-h-[200px] overflow-y-auto">
                                        {eventTypes.map((eventType) => {
                                            const isChecked = (data.type || []).includes(eventType.id);
                                            return (
                                                <div 
                                                    key={eventType.id}
                                                    onClick={() => handleEventTypeToggle(eventType.id)}
                                                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all select-none hover:bg-gray-50 ${isChecked ? 'bg-[#E5654B]/5' : ''}`}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isChecked}
                                                        onChange={() => {}} // Controlled by div parent onClick
                                                        className="rounded border-gray-300 text-[#E5654B] focus:ring-[#E5654B]" 
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`text-xs font-bold block ${isChecked ? 'text-[#E5654B]' : 'text-gray-700'}`}>
                                                            {eventType.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                            </div>

                            {/* Base Likes */}
                            <div>
                                <label className={labelClass}>Like Dasar (Base Likes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.base_likes}
                                    onChange={e => setData('base_likes', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="Contoh: 150"
                                />
                                {errors.base_likes && <p className="text-red-500 text-xs mt-1">{errors.base_likes}</p>}
                            </div>

                            {/* Harga Kartu */}
                            <div>
                                <label className={labelClass}>Harga Kartu Ucapan (IDR) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.price}
                                    onChange={e => setData('price', parseFloat(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="Contoh: 49000"
                                    required
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            {/* Publish Toggle */}
                            <div className="sm:col-span-2 border-t border-[#f5f3f0] pt-5">
                                <div className="flex items-center justify-between bg-[#faf9f7] border border-[#e8e5e0]/60 p-4 rounded-xl">
                                    <span className="text-xs font-bold text-gray-700">Publish Template</span>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_active', !data.is_active)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${data.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                        style={{ padding: '2px' }}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${data.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ════ CARD 2: PENAMPILAN KATALOG ════ */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block" />
                            Penampilan Katalog Kartu
                        </h3>

                        {/* Template Mockup Selector */}
                        <div className="space-y-2">
                            <label className={labelClass}>Template Mockup Preview</label>
                            <select
                                value={data.preview_template}
                                onChange={e => setData('preview_template', e.target.value)}
                                className={inputClass}
                            >
                                {templateOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label} — {opt.desc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* ── Full Mockup: Upload satu gambar statis ── */}
                        {data.preview_template === 'full-mockup' && (
                            <div className="space-y-3 animate-in fade-in duration-200">
                                <label className={labelClass}>
                                    Foto Preview Utama (Mockup Statis) *
                                </label>
                                <div className="border border-[#e8e5e0] rounded-xl p-4 bg-[#faf9f7] space-y-3">
                                    {thumbnailPreview ? (
                                        <div className="relative group w-fit">
                                            <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1.5 text-center">MOCKUP STATIS</div>
                                            <div
                                                className="w-36 h-24 rounded-xl overflow-hidden shadow-md cursor-zoom-in border border-gray-200"
                                                onClick={() => setLightboxImage(thumbnailPreview)}
                                            >
                                                <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setData(d => ({ ...d, thumbnail: '', preview_images: [] })); setThumbnailPreview(''); }}
                                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >×</button>
                                        </div>
                                    ) : (
                                        <div className="w-36 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0021.75 18.75V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-semibold text-[#E5654B] cursor-pointer hover:text-[#c94f3a] transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            {uploading ? 'Mengupload...' : 'Upload Gambar Mockup'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailUpload}
                                                className="sr-only"
                                                disabled={uploading}
                                            />
                                        </label>
                                        <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP. Maks 3MB. Rasio 16:9 disarankan.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Dynamic Phone Mockup ── */}
                        {data.preview_template !== 'full-mockup' && (
                            <>
                                {/* Background Style Dropdown */}
                                <div className={`space-y-2 relative ${isBgDropdownOpen ? 'z-40' : 'z-10'}`} ref={bgDropdownRef}>
                                    <label className={labelClass}>Gaya Background Preview</label>
                                    <div
                                        onClick={() => setIsBgDropdownOpen(!isBgDropdownOpen)}
                                        className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none min-h-[44px]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 rounded-md overflow-hidden border border-[#e8e5e0]/60 shadow-xs flex-shrink-0">
                                                {(() => {
                                                    const active = bgStyleOptions.find(o => o.value === data.preview_bg_style);
                                                    return active ? active.renderPreview() : <div className="w-full h-full bg-gray-100" />;
                                                })()}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {bgStyleOptions.find(o => o.value === data.preview_bg_style)?.label || 'Pilih Background'}
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isBgDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isBgDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden z-50 p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                            {bgStyleOptions.map(opt => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => { setData('preview_bg_style', opt.value); setIsBgDropdownOpen(false); }}
                                                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 ${data.preview_bg_style === opt.value ? 'bg-[#E5654B]/5 ring-1 ring-[#E5654B]/20' : ''}`}
                                                >
                                                    <div className="w-12 h-6 rounded-md overflow-hidden flex-shrink-0 border border-[#e8e5e0]/50">
                                                        {opt.renderPreview()}
                                                    </div>
                                                    <span className={`text-xs font-semibold ${data.preview_bg_style === opt.value ? 'text-[#E5654B]' : 'text-gray-700'}`}>
                                                        {opt.label}
                                                    </span>
                                                    {data.preview_bg_style === opt.value && (
                                                        <svg className="w-3.5 h-3.5 text-[#E5654B] ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Screenshot HP Upload Slots */}
                                <div className="space-y-3 animate-in fade-in duration-200">
                                    <label className={labelClass}>
                                        Screenshot HP Preview
                                        <span className="ml-1.5 text-[#bbb] font-normal normal-case">
                                            — upload {phoneCount} gambar screenshot
                                        </span>
                                    </label>
                                    <div className={`grid gap-3 ${phoneCount === 1 ? 'grid-cols-1 max-w-xs' : phoneCount === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                        {Array.from({ length: phoneCount }).map((_, i) => {
                                            const preview = previewImagesPreviews[i];
                                            const isUploading = uploadingIndex === i;
                                            return (
                                                <div key={i} className="space-y-2">
                                                    <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase text-center">
                                                        {phoneCount === 1 ? 'MOCKUP UTAMA' : `SCREENSHOT ${i + 1}`}
                                                    </div>
                                                    <div className="relative group border border-[#e8e5e0] rounded-xl overflow-hidden bg-[#faf9f7]">
                                                        {/* Phone frame wrapper */}
                                                        <div className="flex items-center justify-center p-3 min-h-[140px]">
                                                            <div className="relative w-[72px] h-[130px] bg-gray-900 rounded-[12px] border-2 border-gray-700 shadow-lg overflow-hidden flex items-center justify-center">
                                                                {/* Notch */}
                                                                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-800 rounded-full z-10" />
                                                                {/* Screen */}
                                                                {preview ? (
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Screenshot ${i + 1}`}
                                                                        className="w-full h-full object-cover cursor-zoom-in"
                                                                        onClick={() => setLightboxImage(preview)}
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0021.75 18.75V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                {isUploading && (
                                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                                        <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Overlay actions */}
                                                        {preview && (
                                                            <button
                                                                type="button"
                                                                onClick={() => clearPreviewImage(i)}
                                                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >×</button>
                                                        )}
                                                    </div>

                                                    <label className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#E5654B] cursor-pointer hover:text-[#c94f3a] transition-colors py-1.5 border border-dashed border-[#E5654B]/30 rounded-xl hover:border-[#E5654B]/60 hover:bg-[#E5654B]/5">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                        </svg>
                                                        {isUploading ? 'Uploading...' : preview ? 'Ganti' : 'Upload'}
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={e => handlePreviewImageUpload(i, e)}
                                                            className="sr-only"
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-gray-400">
                                        PNG, JPG, WEBP. Maks 3MB per gambar. Rasio 9:16 (portrait) disarankan untuk mockup HP.
                                        {phoneCount >= 1 && ' Screenshot pertama otomatis jadi thumbnail katalog.'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex gap-3 justify-end">
                        <Link
                            href="/super-admin/greeting-card-templates"
                            className="px-5 py-2.5 bg-white border border-[#e8e5e0] text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || uploading || uploadingIndex !== null}
                            className="px-6 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Template'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setLightboxImage(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <img src={lightboxImage} alt="Preview" className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl" />
                        <button
                            onClick={() => setLightboxImage(null)}
                            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 font-bold text-sm shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >×</button>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}
