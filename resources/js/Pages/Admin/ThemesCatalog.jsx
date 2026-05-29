import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

// Pilihan template mockup visual
const templateOptions = [
    { 
        value: 'default', 
        label: 'Default', 
        desc: 'Gunakan pengaturan layout super admin'
    },
    { 
        value: 'full-mockup', 
        label: 'Gambar Statis', 
        desc: 'Mockup jadi / custom upload'
    },
    { 
        value: 'single-phone', 
        label: '1 HP (Dinamis)', 
        desc: '1 screenshot melayang'
    },
    { 
        value: 'double-phone', 
        label: '2 HP (Dinamis)', 
        desc: '2 screenshot bertumpuk'
    },
    { 
        value: 'triple-phone', 
        label: '3 HP (Dinamis)', 
        desc: '3 screenshot bertumpuk'
    }
];

// Pilihan background visual
const bgStyleOptions = [
    { 
        value: 'default', 
        label: 'Default', 
        renderPreview: () => null // Will be resolved dynamically
    },
    { 
        value: 'gradient-indigo', 
        label: 'Indigo Blue', 
        renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] shadow-inner" /> 
    },
    { 
        value: 'gradient-emerald', 
        label: 'Emerald Green', 
        renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#11998e] to-[#38ef7d] shadow-inner" /> 
    },
    { 
        value: 'gradient-rose', 
        label: 'Rose Gold', 
        renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd] shadow-inner" /> 
    },
    { 
        value: 'luxury-gold', 
        label: 'Luxury Gold', 
        renderPreview: () => <div className="w-full h-8 rounded-md bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] border border-amber-500/20 shadow-inner" /> 
    },
    { 
        value: 'glassmorphism', 
        label: 'Beige Studio', 
        renderPreview: () => (
            <div className="w-full h-8 rounded-md bg-[#9e9590] relative overflow-hidden shadow-inner">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 blur-[2px]" />
            </div>
        ) 
    },
    { 
        value: 'studio-split', 
        label: 'Clay & Forest', 
        renderPreview: () => (
            <div className="w-full h-8 rounded-md bg-[#bf6c54] relative overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#1b2421] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
            </div>
        ) 
    },
    { 
        value: 'studio-clay-sand', 
        label: 'Clay & Sand', 
        renderPreview: () => (
            <div className="w-full h-8 rounded-md bg-[#e8dcd3] relative overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#a3563f] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
            </div>
        ) 
    },
    { 
        value: 'studio-velvet-rose', 
        label: 'Velvet & Rose', 
        renderPreview: () => (
            <div className="w-full h-8 rounded-md bg-[#dcb3a6] relative overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#231f30] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
            </div>
        ) 
    },
    { 
        value: 'studio-sage-cream', 
        label: 'Sage & Cream', 
        renderPreview: () => (
            <div className="w-full h-8 rounded-md bg-[#ece7df] relative overflow-hidden shadow-inner">
                <div className="absolute inset-y-0 -left-[10%] w-[55%] bg-[#5f7065] transform skew-x-[-15deg] origin-top shadow-[2px_0_5px_rgba(0,0,0,0.25)] border-r border-white/5" />
            </div>
        ) 
    }
];

const renderBgPreview = (value, activeTheme) => {
    let resolvedValue = value;
    if (value === 'default') {
        resolvedValue = activeTheme?.preview_bg_style || 'gradient-indigo';
        if (resolvedValue === 'default') {
            resolvedValue = 'gradient-indigo';
        }
    }
    const option = bgStyleOptions.find(o => o.value === resolvedValue);
    if (option && option.value !== 'default') {
        return option.renderPreview();
    }
    return <div className="w-full h-full bg-gray-100 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400 font-semibold">Default</div>;
};

export default function ThemesCatalog({ themes }) {
    const { adminRoutePrefix } = usePage().props;
    const resolvedPrefix = adminRoutePrefix || '/admin';

    const [activeTheme, setActiveTheme] = useState(null);
    const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);

    const fileInputRef = useRef(null);
    const bgDropdownRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        preview_template: 'default',
        preview_bg_style: 'default',
        preview_images: [],
        thumbnail: '',
    });

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    // Close background dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (bgDropdownRef.current && !bgDropdownRef.current.contains(event.target)) {
                setIsBgDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEditClick = (theme) => {
        setActiveTheme(theme);
        const custom = theme.custom_setting || {};

        setData({
            preview_template: custom.preview_template || 'default',
            preview_bg_style: custom.preview_bg_style || 'default',
            preview_images: custom.preview_images || [],
            thumbnail: custom.thumbnail || '',
        });
    };

    const handleCloseModal = () => {
        setActiveTheme(null);
        reset();
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'themes');

        try {
            const response = await fetch(`${resolvedPrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `Server error: ${response.status}`;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorJson = await response.json();
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } else {
                    const errorText = await response.text();
                    errorMessage = errorText.substring(0, 150) + '...';
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setData('thumbnail', result.url);
        } catch (err) {
            console.error('Upload failed:', err);
            alert(`Gagal mengunggah thumbnail: ${err.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePreviewImageUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingIndex(index);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'themes');

        try {
            const response = await fetch(`${resolvedPrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `Server error: ${response.status}`;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorJson = await response.json();
                    errorMessage = errorJson.message || errorJson.error || errorMessage;
                } else {
                    const errorText = await response.text();
                    errorMessage = errorText.substring(0, 150) + '...';
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            const nextImages = [...(data.preview_images || [])];
            nextImages[index] = result.url;

            if (index === 0) {
                setData({
                    ...data,
                    preview_images: nextImages,
                    thumbnail: result.url
                });
            } else {
                setData('preview_images', nextImages);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert(`Gagal mengunggah screenshot HP #${index + 1}: ${err.message}`);
        } finally {
            setUploadingIndex(null);
        }
    };

    const clearPreviewImage = (index) => {
        const nextImages = [...(data.preview_images || [])];
        nextImages.splice(index, 1);

        if (index === 0) {
            const nextThumbnail = nextImages[0] || '';
            setData({
                ...data,
                preview_images: nextImages,
                thumbnail: nextThumbnail
            });
        } else {
            setData('preview_images', nextImages);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            preview_template: data.preview_template,
            preview_bg_style: data.preview_bg_style,
            preview_images: data.preview_images,
            thumbnail: data.thumbnail,
        };

        post(`${resolvedPrefix}/themes/${activeTheme.id}/custom-preview`, {
            data: payload,
            onSuccess: () => {
                handleCloseModal();
            }
        });
    };

    // Calculate dynamic values for live preview card inside modal
    const resolvedTemplate = data.preview_template === 'default' 
        ? activeTheme?.preview_template 
        : data.preview_template;

    const resolvedBg = data.preview_bg_style === 'default' 
        ? activeTheme?.preview_bg_style 
        : data.preview_bg_style;

    const resolvedThumbnail = data.preview_template === 'default' 
        ? activeTheme?.thumbnail 
        : data.thumbnail;

    const resolvedImages = data.preview_template === 'default' 
        ? activeTheme?.preview_images 
        : data.preview_images;

    const inputClass = 'w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all';
    const labelClass = 'text-xs font-semibold text-[#888] block mb-1.5 tracking-wide';

    return (
        <DynamicAdminLayout title="Katalog Tema dari Pusat">
            <Head title="Katalog Tema" />
            <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-4 sm:p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700">Daftar Tema Global</h3>
                    <p className="text-xs text-gray-400 mt-1">Berikut adalah pilihan desain undangan digital premium dari admin pusat yang dapat dinikmati oleh user client Anda. Klik "Kustomisasi Preview" pada kartu untuk mengubah template, latar belakang, dan gambar pratinjau tema di katalog brand Anda.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes?.map(theme => (
                        <div key={theme.id} className="relative group/catalog flex flex-col h-full bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* ThemePreviewCard wrapped */}
                            <div className="flex-1">
                                <ThemePreviewCard theme={theme} reseller={null} onlyMockup={true} aspectClass="aspect-[3/4]" />
                            </div>
                            
                            {/* Hover Action Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/catalog:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center gap-2 pointer-events-none group-hover/catalog:pointer-events-auto">
                                <button
                                    type="button"
                                    onClick={() => handleEditClick(theme)}
                                    className="px-4 py-2 bg-[#E5654B] text-white rounded-full text-xs font-bold hover:bg-[#d4523a] transition-all transform scale-90 group-hover/catalog:scale-100 shadow-md pointer-events-auto"
                                >
                                    Kustomisasi Preview
                                </button>
                                <a
                                    href={theme.preview_url || `/demo/${theme.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 bg-white text-gray-800 rounded-full text-xs font-bold hover:bg-gray-100 transition-all transform scale-90 group-hover/catalog:scale-100 shadow-md pointer-events-auto"
                                >
                                    Lihat Demo
                                </a>
                            </div>

                            {/* Card Details */}
                            <div className="p-3.5 border-t border-gray-50 flex flex-col justify-between bg-white z-10">
                                <div>
                                    <h4 className="font-semibold text-sm text-[#1a1a1a] truncate group-hover/catalog:text-[#E5654B] transition-colors">
                                        {theme.name}
                                    </h4>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className="text-[11px] text-gray-400 capitalize">{theme.category || 'Umum'}</span>
                                        <div className="flex items-center gap-1.5">
                                            {theme.is_premium ? (
                                                <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full tracking-wider">PREMIUM</span>
                                            ) : (
                                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full tracking-wider">GRATIS</span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Indicator if customized */}
                                    {theme.custom_setting && (
                                        <div className="mt-2 text-[10px] text-orange-600 bg-orange-50 border border-orange-200/50 rounded-lg px-2.5 py-1 font-bold flex items-center gap-1">
                                            <svg className="w-3 h-3 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Preview Dikustomisasi
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDITING MODAL */}
            {activeTheme && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200" onClick={handleCloseModal}>
                    <div className="bg-white border border-[#e8e5e0] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        
                        <button 
                            type="button" 
                            onClick={handleCloseModal} 
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 flex items-center justify-center text-xl transition-all font-light"
                            title="Tutup"
                        >
                            &times;
                        </button>

                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                            Kustomisasi Preview Tema: {activeTheme.name}
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            
                            {/* Template Mockup Preview */}
                            <div>
                                <label className={labelClass}>Template Mockup Preview</label>
                                <select
                                    value={data.preview_template}
                                    onChange={(e) => setData('preview_template', e.target.value)}
                                    className={inputClass}
                                >
                                    {templateOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label} — {opt.desc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Gaya Background Preview (Hidden if resolved to full-mockup) */}
                            {resolvedTemplate !== 'full-mockup' && (
                                <div className="relative" ref={bgDropdownRef}>
                                    <label className={labelClass}>Gaya Background Preview</label>
                                    <div className="relative">
                                        <div 
                                            onClick={() => setIsBgDropdownOpen(!isBgDropdownOpen)}
                                            className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs min-h-[44px]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-5 flex-shrink-0 bg-white border border-[#e8e5e0]/60 p-0.5 rounded-md shadow-xs flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full rounded-xs overflow-hidden">
                                                        {renderBgPreview(data.preview_bg_style, activeTheme)}
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">
                                                    {bgStyleOptions.find(o => o.value === data.preview_bg_style)?.label || 'Pilih Background'}
                                                </span>
                                            </div>
                                            <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isBgDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {isBgDropdownOpen && (
                                            <div className="absolute z-50 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[180px] overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                                {bgStyleOptions.map((opt) => {
                                                    const isSelected = data.preview_bg_style === opt.value;
                                                    return (
                                                        <div 
                                                            key={opt.value}
                                                            onClick={() => {
                                                                setData('preview_bg_style', opt.value);
                                                                setIsBgDropdownOpen(false);
                                                            }}
                                                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all select-none hover:bg-gray-50 ${isSelected ? 'bg-[#E5654B]/5' : ''}`}
                                                        >
                                                            <div className="w-8 h-5 flex-shrink-0 bg-white border border-[#e8e5e0]/60 p-0.5 rounded-md shadow-xs flex items-center justify-center overflow-hidden">
                                                                <div className="w-full h-full rounded-xs overflow-hidden">
                                                                    {renderBgPreview(opt.value, activeTheme)}
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

                                                <input 
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleThumbnailUpload}
                                                    className="hidden"
                                                />

                                                <div className="flex gap-1.5 mt-2.5 w-full">
                                                    <button 
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex-1 py-1 text-[9px] font-bold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded"
                                                    >
                                                        Upload
                                                    </button>
                                                    {data.thumbnail && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setData('thumbnail', '')}
                                                            className="px-1.5 py-1 text-[9px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded"
                                                        >
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
                                            {[0, 1, 2].map((idx) => {
                                                const isNeeded = idx === 0 || 
                                                    (resolvedTemplate === 'double-phone' && idx < 2) || 
                                                    (resolvedTemplate === 'triple-phone');
                                                    
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
                                                            onClick={() => document.getElementById(`screenshot-upload-reseller-${idx}`).click()}
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

                                                        <input 
                                                            id={`screenshot-upload-reseller-${idx}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handlePreviewImageUpload(idx, e)}
                                                            className="hidden"
                                                        />

                                                        <div className="flex gap-1.5 mt-2.5 w-full">
                                                            <button 
                                                                type="button"
                                                                onClick={() => document.getElementById(`screenshot-upload-reseller-${idx}`).click()}
                                                                className="flex-1 py-1 text-[9px] font-bold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded"
                                                            >
                                                                Upload
                                                            </button>
                                                            {data.preview_images[idx] && (
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => clearPreviewImage(idx)}
                                                                    className="px-1.5 py-1 text-[9px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded"
                                                                >
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

                            {/* Live Preview Card */}
                            <div className="border-t border-[#f5f3f0] pt-4">
                                <label className={labelClass}>Live Preview Kartu Katalog (Hasil Resolusi)</label>
                                <div className="max-w-[200px] mx-auto p-1.5 bg-[#faf9f7] border border-[#e8e5e0]/60 rounded-xl shadow-inner mt-2">
                                    <ThemePreviewCard 
                                        theme={{
                                            name: activeTheme.name,
                                            slug: activeTheme.slug,
                                            thumbnail: resolvedThumbnail,
                                            preview_template: resolvedTemplate,
                                            preview_images: resolvedImages,
                                            preview_bg_style: resolvedBg,
                                            category: activeTheme.category,
                                            is_premium: activeTheme.is_premium
                                        }}
                                        reseller={null}
                                        isDemoLink={false}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-3 border-t border-[#f5f3f0]">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || uploading}
                                    className="flex-1 py-3 bg-[#E5654B] text-white font-bold rounded-xl text-sm hover:bg-[#c94f3a] transition-all disabled:opacity-50"
                                >
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
