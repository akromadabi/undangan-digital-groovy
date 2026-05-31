import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

// Pilihan template mockup visual
const templateOptions = [
    { 
        value: 'full-mockup', 
        label: 'Gambar Statis', 
        desc: 'Mockup jadi / custom upload',
        renderIcon: () => (
            <div className="w-8 h-10 bg-gray-200 border border-gray-300 rounded flex items-center justify-center relative overflow-hidden">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
            </div>
        )
    },
    { 
        value: 'single-phone', 
        label: '1 HP (Dinamis)', 
        desc: '1 screenshot melayang',
        renderIcon: () => (
            <div className="w-8 h-10 flex items-center justify-center">
                <div className="w-5 h-9 bg-gray-800 border-[1.5px] border-gray-700 rounded-md shadow-sm relative flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-black rounded-full absolute top-[1px]" />
                    <div className="w-3 h-7 bg-gray-200/20 rounded-xs" />
                </div>
            </div>
        )
    },
    { 
        value: 'double-phone', 
        label: '2 HP (Dinamis)', 
        desc: '2 screenshot bertumpuk',
        renderIcon: () => (
            <div className="relative w-8 h-10 flex items-center justify-center">
                {/* Back phone */}
                <div className="absolute w-4 h-8 bg-gray-400 border border-gray-300 rounded shadow-sm -translate-x-1.5 -translate-y-0.5" />
                {/* Front phone */}
                <div className="absolute w-4 h-8 bg-gray-800 border-[1px] border-gray-700 rounded shadow-md translate-x-1 translate-y-1 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-black rounded-full absolute top-[1px]" />
                </div>
            </div>
        )
    },
    { 
        value: 'triple-phone', 
        label: '3 HP (Dinamis)', 
        desc: '3 screenshot bertumpuk',
        renderIcon: () => (
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Left back */}
                <div className="absolute w-3.5 h-7 bg-gray-400 border border-gray-300 rounded shadow-sm -translate-x-2.5 -translate-y-0.5" />
                {/* Right back */}
                <div className="absolute w-3.5 h-7 bg-gray-400 border border-gray-300 rounded shadow-sm translate-x-2.5 -translate-y-0.5" />
                {/* Center front */}
                <div className="absolute w-3.5 h-7 bg-gray-800 border-[1px] border-gray-700 rounded shadow-md translate-y-0.5 z-10 flex items-center justify-center">
                    <div className="w-1.5 h-0.5 bg-black rounded-full absolute top-[1px]" />
                </div>
            </div>
        )
    }
];

// Pilihan background visual
const bgStyleOptions = [
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

const eventTypes = [
    { id: 'wedding', name: 'Pernikahan (Wedding)', desc: 'Izinkan tema digunakan untuk Pernikahan.' },
    { id: 'birthday', name: 'Ulang Tahun (Birthday)', desc: 'Izinkan tema digunakan untuk Ulang Tahun.' },
    { id: 'graduation', name: 'Wisuda (Graduation)', desc: 'Izinkan tema digunakan untuk Wisuda.' },
    { id: 'aqiqah', name: 'Aqiqah', desc: 'Izinkan tema digunakan untuk Aqiqah.' },
    { id: 'circumcision', name: 'Sunatan (Khitanan)', desc: 'Izinkan tema digunakan untuk Sunatan.' },
    { id: 'anniversary', name: 'Anniversary / Syukuran', desc: 'Izinkan tema digunakan untuk Anniversary / Syukuran.' },
    { id: 'general', name: 'Umum / General (Semua Acara)', desc: 'Izinkan tema digunakan untuk Semua jenis acara.' },
];

export default function Form({ theme, plans = [], categories = [] }) {
    const { adminRoutePrefix } = usePage().props;
    const isEdit = !!theme;
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const eventDropdownRef = useRef(null);
    const bgDropdownRef = useRef(null);
    
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
    const [isBgDropdownOpen, setIsBgDropdownOpen] = useState(false);
    
    // States for dynamic preview screenshots
    const [previewImagesPreviews, setPreviewImagesPreviews] = useState([]);
    const [uploadingIndex, setUploadingIndex] = useState(null);



    // Dynamic category handling is now done using the dynamic categories prop.

    // State untuk mengontrol tab editor ("visual" vs "json") - maintained for backend compatibility
    const [colorTab, setColorTab] = useState('visual');
    const [fontTab, setFontTab] = useState('visual');
    
    // Lightbox image preview state
    const [lightboxImage, setLightboxImage] = useState(null);

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    const { data, setData, post, put, transform, processing, errors } = useForm({
        name: theme?.name || '', 
        slug: theme?.slug || '', 
        thumbnail: theme?.thumbnail || '',
        preview_images: theme?.preview_images || [],
        preview_template: theme?.preview_template || 'full-mockup',
        preview_bg_style: theme?.preview_bg_style || 'gradient-indigo',
        category: theme?.category ? theme.category.trim() : 'Elegant', 
        type: Array.isArray(theme?.type) ? theme.type : (theme?.type ? [theme.type] : ['wedding']), 
        is_premium: theme?.is_premium || false, 
        allowed_plans: theme?.allowed_plans || [],
        is_active: theme?.is_active ?? true,
        supports_scroll: theme?.supports_scroll ?? true, 
        supports_slide: theme?.supports_slide ?? true, 
        supports_tab: theme?.supports_tab ?? true,
        color_scheme: JSON.stringify(theme?.color_scheme || { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D', accent: '#D4A373' }, null, 2),
        font_config: JSON.stringify(theme?.font_config || { heading: 'Playfair Display', body: 'Poppins', script: 'Great Vibes' }, null, 2),
        sort_order: theme?.sort_order || 0,
        base_likes: theme?.base_likes || 0,
    });

    // Menangani sinkronisasi state saat properti theme berubah (Mengatasi Bug State Preservation di Inertia)
    useEffect(() => {
        if (theme) {
            const cat = theme.category ? theme.category.trim() : 'Elegant';
            
            setData({
                name: theme.name || '',
                slug: theme.slug || '',
                thumbnail: theme.thumbnail || '',
                preview_images: theme.preview_images || [],
                preview_template: theme.preview_template || 'full-mockup',
                preview_bg_style: theme.preview_bg_style || 'gradient-indigo',
                category: cat,
                type: Array.isArray(theme.type) ? theme.type : (theme.type ? [theme.type] : []),
                is_premium: theme.is_premium || false,
                allowed_plans: theme.allowed_plans || [],
                is_active: theme.is_active ?? true,
                supports_scroll: theme.supports_scroll ?? true,
                supports_slide: theme.supports_slide ?? true,
                supports_tab: theme.supports_tab ?? true,
                color_scheme: JSON.stringify(theme.color_scheme || { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D', accent: '#D4A373' }, null, 2),
                font_config: JSON.stringify(theme.font_config || { heading: 'Playfair Display', body: 'Poppins', script: 'Great Vibes' }, null, 2),
                sort_order: theme.sort_order || 0,
                base_likes: theme.base_likes || 0,
            });
            setThumbnailPreview(getThumbnailUrl(theme.thumbnail));
            setPreviewImagesPreviews((theme.preview_images || []).map(p => getThumbnailUrl(p)));
        }
    }, [theme?.id, theme?.thumbnail, theme?.preview_images]);

    // Click outside listener untuk menutup dropdown paket, event, & background
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (eventDropdownRef.current && !eventDropdownRef.current.contains(event.target)) {
                setIsEventDropdownOpen(false);
            }
            if (bgDropdownRef.current && !bgDropdownRef.current.contains(event.target)) {
                setIsBgDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Tampilkan preview base64 secara instan
        const reader = new FileReader();
        reader.onload = (ev) => setThumbnailPreview(ev.target.result);
        reader.readAsDataURL(file);

        // Unggah file ke server
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'themes');

        try {
            const response = await fetch(`${adminRoutePrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: { 
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content 
                },
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
            setThumbnailPreview(getThumbnailUrl(result.url));
        } catch (err) {
            console.error('Upload failed:', err);
            alert(`Gagal mengunggah thumbnail: ${err.message}`);
            setThumbnailPreview(getThumbnailUrl(data.thumbnail));
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

        // Unggah file ke server
        setUploadingIndex(index);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'themes');

        try {
            const response = await fetch(`${adminRoutePrefix}/upload`, {
                method: 'POST',
                body: formData,
                headers: { 
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content 
                },
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

            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getThumbnailUrl(result.url);
            setPreviewImagesPreviews(nextPreviews);

            if (index === 0) {
                setData({
                    ...data,
                    preview_images: nextImages,
                    thumbnail: result.url
                });
                setThumbnailPreview(getThumbnailUrl(result.url));
            } else {
                setData('preview_images', nextImages);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert(`Gagal mengunggah screenshot HP #${index + 1}: ${err.message}`);
            const nextPreviews = [...previewImagesPreviews];
            nextPreviews[index] = getThumbnailUrl(data.preview_images[index]);
            setPreviewImagesPreviews(nextPreviews);
        } finally {
            setUploadingIndex(null);
        }
    };

    const clearPreviewImage = (index) => {
        const nextImages = [...(data.preview_images || [])];
        nextImages.splice(index, 1);

        const nextPreviews = [...previewImagesPreviews];
        nextPreviews.splice(index, 1);
        setPreviewImagesPreviews(nextPreviews);

        if (index === 0) {
            const nextThumbnail = nextImages[0] || '';
            setData({
                ...data,
                preview_images: nextImages,
                thumbnail: nextThumbnail
            });
            setThumbnailPreview(getThumbnailUrl(nextThumbnail));
        } else {
            setData('preview_images', nextImages);
        }
    };

    // Helper untuk memperbarui nilai Color Scheme di dalam string JSON
    const updateColorSchemeKey = (key, value) => {
        try {
            const parsed = JSON.parse(data.color_scheme || '{}');
            parsed[key] = value;
            setData('color_scheme', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.error('Failed to parse color scheme JSON:', e);
        }
    };

    // Helper untuk memperbarui nilai Font Config di dalam string JSON
    const updateFontConfigKey = (key, value) => {
        try {
            const parsed = JSON.parse(data.font_config || '{}');
            parsed[key] = value;
            setData('font_config', JSON.stringify(parsed, null, 2));
        } catch (e) {
            console.error('Failed to parse font config JSON:', e);
        }
    };

    // Helper untuk mengaktifkan/menonaktifkan allowed_plans
    const handlePlanToggle = (planId) => {
        const currentPlans = [...(data.allowed_plans || [])];
        const index = currentPlans.indexOf(planId);
        if (index > -1) {
            currentPlans.splice(index, 1);
        } else {
            currentPlans.push(planId);
        }
        setData('allowed_plans', currentPlans);
    };

    // Helper untuk mengaktifkan/menonaktifkan type event
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        let finalColorScheme = {};
        let finalFontConfig = {};
        
        try {
            finalColorScheme = JSON.parse(data.color_scheme);
        } catch (err) {
            alert('Format JSON pada Color Scheme tidak valid! Periksa kembali.');
            return;
        }

        try {
            finalFontConfig = JSON.parse(data.font_config);
        } catch (err) {
            alert('Format JSON pada Font Config tidak valid! Periksa kembali.');
            return;
        }

        // Gunakan transform untuk mengirim data yang ter-parse dengan benar ke backend
        transform((data) => ({
            ...data,
            color_scheme: finalColorScheme,
            font_config: finalFontConfig,
        }));
        
        if (isEdit) { 
            put(`${adminRoutePrefix}/themes/${theme.id}`); 
        } else { 
            post(`${adminRoutePrefix}/themes`); 
        }
    };

    const inputClass = 'w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 disabled:bg-[#f8f7f4] transition-all';
    const labelClass = 'text-xs font-semibold text-[#888] block mb-1.5 tracking-wide';

    return (
        <DynamicAdminLayout title={isEdit ? `Edit Tema: ${theme.name}` : 'Tambah Tema Baru'}>
            <Head title={isEdit ? 'Edit Tema' : 'Tambah Tema'} />
            <div className="max-w-2xl space-y-6 pb-36 md:pb-12">
                <Link href={`${adminRoutePrefix}/themes`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium inline-flex items-center gap-1 transition-colors">
                    ← Kembali ke Daftar Tema
                </Link>

                {/* Global Error Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-500/10 rounded-xl p-4 text-xs text-red-800 space-y-1 shadow-sm">
                        <span className="font-bold flex items-center gap-1">
                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            Gagal Menyimpan! Harap perbaiki kesalahan berikut:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 pl-1.5 mt-1 font-medium">
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key} className="capitalize">
                                    <strong>{key.replace('_', ' ')}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CARD 1: PENGATURAN DATA TEMA */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                            Pengaturan Data Tema
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className={labelClass}>Nama Tema *</label>
                                    <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                        className={inputClass} required placeholder="Contoh: Utary" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                
                                <div>
                                    <label className={labelClass}>Slug (URL Tema) *</label>
                                    <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} disabled={isEdit}
                                        className={inputClass} required={!isEdit} placeholder="Contoh: utary" />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Kategori Desain</label>
                                    <select 
                                        value={data.category || 'Elegant'} 
                                        onChange={(e) => setData('category', e.target.value)}
                                        className={inputClass}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className={`relative ${isEventDropdownOpen ? 'z-40' : 'z-10'}`} ref={eventDropdownRef}>
                                    <label className={labelClass}>Tipe Acara (Event Type)</label>
                                    
                                    {/* Trigger Button Dropdown */}
                                    <div 
                                        onClick={() => {
                                            setIsEventDropdownOpen(!isEventDropdownOpen);
                                            setIsDropdownOpen(false);
                                            setIsBgDropdownOpen(false);
                                        }}
                                        className="w-full min-h-[44px] bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs"
                                    >
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {(data.type || []).length === 0 ? (
                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                    Semua Acara (Umum/General)
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
                                        <div className="absolute z-25 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[220px] overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
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

                                <div>
                                    <label className={labelClass}>Like Dasar (Base Likes)</label>
                                    <input type="number" min="0" value={data.base_likes} onChange={(e) => setData('base_likes', parseInt(e.target.value) || 0)}
                                        className={inputClass} placeholder="Contoh: 150" />
                                    {errors.base_likes && <p className="text-red-500 text-xs mt-1">{errors.base_likes}</p>}
                                </div>

                                <div className={`space-y-1.5 relative ${isDropdownOpen ? 'z-40' : 'z-10'}`} ref={dropdownRef}>
                                    <label className={labelClass}>Akses Kelas Paket (Subscription Plans)</label>
                                    
                                    {/* Trigger Button Dropdown */}
                                    <div 
                                        onClick={() => {
                                            setIsDropdownOpen(!isDropdownOpen);
                                            setIsEventDropdownOpen(false);
                                            setIsBgDropdownOpen(false);
                                        }}
                                        className="w-full min-h-[44px] bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs"
                                    >
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {(data.allowed_plans || []).length === 0 ? (
                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                    Semua Paket (Gratis/Umum)
                                                </span>
                                            ) : (
                                                (data.allowed_plans || []).map(planId => {
                                                    const plan = plans.find(p => p.id === planId);
                                                    if (!plan) return null;
                                                    return (
                                                        <span 
                                                            key={planId} 
                                                            className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-500/10 pl-2.5 pr-1.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-amber-100 transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePlanToggle(planId);
                                                            }}
                                                        >
                                                            {plan.name}
                                                            <button type="button" className="text-amber-500 hover:text-amber-700 font-bold w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px]">&times;</button>
                                                        </span>
                                                    );
                                                })
                                            )}
                                        </div>
                                        
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {/* Dropdown Options List */}
                                    {isDropdownOpen && (
                                        <div className="absolute z-25 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[190px] overflow-y-auto p-1.5 space-y-0.5">
                                            {plans.length === 0 ? (
                                                <div className="text-center text-xs text-gray-400 py-4">Belum ada paket yang terdaftar.</div>
                                            ) : (
                                                plans.map((plan) => {
                                                    const isChecked = (data.allowed_plans || []).includes(plan.id);
                                                    return (
                                                        <div 
                                                            key={plan.id}
                                                            onClick={() => handlePlanToggle(plan.id)}
                                                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all select-none hover:bg-gray-50 ${isChecked ? 'bg-amber-50/10' : ''}`}
                                                        >
                                                            <input 
                                                                type="checkbox" 
                                                                checked={isChecked}
                                                                onChange={() => {}} // Controlled by div parent onClick
                                                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" 
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <span className={`text-xs font-bold block ${isChecked ? 'text-amber-800' : 'text-gray-700'}`}>
                                                                    Paket {plan.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="sm:col-span-2 border-t border-[#f5f3f0] pt-5">
                                    <div className="flex items-center justify-between bg-[#faf9f7] border border-[#e8e5e0]/60 p-4 rounded-xl">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-700">Publish Tema</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', !data.is_active)}
                                            className={`${
                                                data.is_active ? 'bg-emerald-500' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 flex-shrink-0 items-center cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none`}
                                            style={{ padding: '2px' }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={`${
                                                    data.is_active ? 'translate-x-5' : 'translate-x-0'
                                                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: PENAMPILAN KATALOG TEMA */}
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                            <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                                Penampilan Katalog Tema
                            </h3>
                            <div className="space-y-5 animate-in fade-in duration-200">
                                {/* Visual Mockup Template Selector */}
                                <div className="space-y-2">
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

                                {/* Visual Background Palette Selector */}
                                {data.preview_template !== 'full-mockup' && (
                                    <div className={`space-y-2 relative ${isBgDropdownOpen ? 'z-40' : 'z-10'}`} ref={bgDropdownRef}>
                                        <label className={labelClass}>Gaya Background Preview</label>
                                        <div className="relative">
                                            {/* Trigger Button */}
                                            <div 
                                                onClick={() => {
                                                    setIsBgDropdownOpen(!isBgDropdownOpen);
                                                    setIsEventDropdownOpen(false);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs min-h-[44px]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Spill Warna inside active button selection */}
                                                    <div className="w-8 h-5 flex-shrink-0 bg-white border border-[#e8e5e0]/60 p-0.5 rounded-md shadow-xs flex items-center justify-center overflow-hidden">
                                                        {(() => {
                                                            const activeOpt = bgStyleOptions.find(o => o.value === data.preview_bg_style);
                                                            return activeOpt ? (
                                                                <div className="w-full h-full rounded-xs overflow-hidden">
                                                                    {activeOpt.renderPreview()}
                                                                </div>
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-100 rounded-xs" />
                                                            );
                                                        })()}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        {bgStyleOptions.find(o => o.value === data.preview_bg_style)?.label || 'Pilih Background'}
                                                    </span>
                                                </div>
                                                
                                                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isBgDropdownOpen ? 'rotate-180 text-[#E5654B]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>

                                            {/* Dropdown Options List */}
                                            {isBgDropdownOpen && (
                                                <div className="absolute z-35 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[220px] overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
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
                                                                {/* Spill Warna inside option */}
                                                                <div className="w-8 h-5 flex-shrink-0 bg-white border border-[#e8e5e0]/60 p-0.5 rounded-md shadow-xs flex items-center justify-center overflow-hidden">
                                                                    <div className="w-full h-full rounded-xs overflow-hidden">
                                                                        {opt.renderPreview()}
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

                                {/* DYNAMIC UPLOAD AREA (ADAPTS IN PLACE) */}
                                <div className="space-y-3 bg-[#faf9f7] p-4 rounded-2xl border border-[#e8e5e0]/60">
                                    {data.preview_template === 'full-mockup' ? (
                                        <>
                                            <label className={labelClass}>Foto Preview Utama (Mockup Statis) *</label>
                                            <div className="max-w-[145px] mx-auto">
                                                <div className="bg-white p-3 rounded-xl border border-[#e8e5e0]/60 flex flex-col items-center justify-between text-center relative shadow-sm hover:border-gray-300 transition-colors">
                                                    <span className="text-[10px] font-bold text-gray-500 mb-2 tracking-wide uppercase">Mockup Statis</span>
                                                    
                                                    <div 
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="w-16 h-24 rounded-md border border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer overflow-hidden relative hover:border-[#E5654B] bg-[#faf9f7] transition-all group"
                                                    >
                                                        {thumbnailPreview ? (
                                                            <div className="relative w-full h-full group">
                                                                <img src={thumbnailPreview} className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setLightboxImage(thumbnailPreview);
                                                                    }}
                                                                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-[#E5654B] backdrop-blur-xs rounded-full text-white transition-all shadow-md flex items-center justify-center hover:scale-110 active:scale-95 z-25"
                                                                    title="Perbesar Gambar"
                                                                >
                                                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                </button>
                                                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10" />
                                                            </div>
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
                                                                onClick={() => {
                                                                    setData('thumbnail', '');
                                                                    setThumbnailPreview('');
                                                                }}
                                                                className="px-1.5 py-1 text-[9px] font-bold bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 rounded"
                                                            >
                                                                Hapus
                                                            </button>
                                                        )}
                                                    </div>
                                                    {errors.thumbnail && (
                                                        <p className="text-red-500 text-[10px] mt-1.5 font-medium leading-tight">{errors.thumbnail}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <label className={labelClass}>Unggah Foto Screenshot Mentah (Rasio Portrait HP) *</label>
                                            <div className={`grid gap-3.5 ${
                                                data.preview_template === 'single-phone' 
                                                    ? 'grid-cols-1 max-w-[145px] mx-auto' 
                                                    : data.preview_template === 'double-phone' 
                                                        ? 'grid-cols-2 max-w-[300px] mx-auto' 
                                                        : 'grid-cols-3'
                                            }`}>
                                                {[0, 1, 2].map((idx) => {
                                                    // Determine if this index is needed based on template selection
                                                    const isNeeded = idx === 0 || 
                                                        (data.preview_template === 'double-phone' && idx < 2) || 
                                                        (data.preview_template === 'triple-phone');
                                                        
                                                    if (!isNeeded) return null;

                                                    let slotLabel = `HP #${idx + 1}`;
                                                    if (data.preview_template === 'single-phone') slotLabel = 'Layar HP Utama';
                                                    else if (data.preview_template === 'double-phone') {
                                                        slotLabel = idx === 0 ? 'HP Utama (Depan)' : 'HP Kedua (Belakang)';
                                                    } else if (data.preview_template === 'triple-phone') {
                                                        if (idx === 0) slotLabel = 'HP Utama (Tengah)';
                                                        else if (idx === 1) slotLabel = 'HP Kiri (Belakang)';
                                                        else slotLabel = 'HP Kanan (Belakang)';
                                                    }

                                                    return (
                                                        <div key={idx} className="bg-white p-3 rounded-xl border border-[#e8e5e0]/60 flex flex-col items-center justify-between text-center relative shadow-sm hover:border-gray-300 transition-colors">
                                                            <span className="text-[10px] font-bold text-gray-500 mb-2 tracking-wide uppercase">{slotLabel}</span>
                                                            
                                                            <div 
                                                                onClick={() => document.getElementById(`screenshot-upload-${idx}`).click()}
                                                                className="w-16 h-24 rounded-md border border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer overflow-hidden relative hover:border-[#E5654B] bg-[#faf9f7] transition-all group"
                                                            >
                                                                {previewImagesPreviews[idx] ? (
                                                                    <div className="relative w-full h-full group">
                                                                        <img src={previewImagesPreviews[idx]} className="w-full h-full object-cover" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setLightboxImage(previewImagesPreviews[idx]);
                                                                            }}
                                                                            className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-[#E5654B] backdrop-blur-xs rounded-full text-white transition-all shadow-md flex items-center justify-center hover:scale-110 active:scale-95 z-25"
                                                                            title="Perbesar Gambar"
                                                                        >
                                                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            </svg>
                                                                        </button>
                                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10" />
                                                                    </div>
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
                                                                id={`screenshot-upload-${idx}`}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handlePreviewImageUpload(idx, e)}
                                                                className="hidden"
                                                            />

                                                            <div className="flex gap-1.5 mt-2.5 w-full">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => document.getElementById(`screenshot-upload-${idx}`).click()}
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
                                                            {idx === 0 && errors.thumbnail && (
                                                                <p className="text-red-500 text-[10px] mt-1.5 font-medium leading-tight">{errors.thumbnail}</p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* INTERACTIVE LIVE PREVIEW RENDER */}
                                <div className="border-t border-[#f5f3f0] pt-5">
                                    <label className={labelClass}>Live Preview Kartu Katalog (Interaktif)</label>
                                    <div className="max-w-[240px] mx-auto p-2 bg-[#faf9f7] border border-[#e8e5e0]/60 rounded-2xl shadow-inner mt-2">
                                        <ThemePreviewCard 
                                            theme={{
                                                name: data.name || 'Nama Tema',
                                                slug: data.slug || 'slug',
                                                thumbnail: data.thumbnail,
                                                preview_template: data.preview_template,
                                                preview_images: data.preview_images,
                                                preview_bg_style: data.preview_bg_style,
                                                category: data.category,
                                                is_premium: data.is_premium
                                            }}
                                            reseller={{
                                                brand_name: 'Watermark Demo',
                                                brand_logo: null
                                            }}
                                            isDemoLink={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    {/* SUBMIT BUTTON */}
                    <button type="submit" disabled={processing || uploading}
                        className="w-full py-4 bg-[#E5654B] text-white rounded-xl font-bold hover:bg-[#c94f3a] disabled:opacity-50 transition-all shadow-md shadow-[#E5654B]/15 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Menyimpan Perubahan...
                            </>
                        ) : isEdit ? (
                            'Simpan & Update Tema'
                        ) : (
                            'Buat & Tambah Tema'
                        )}
                    </button>
                </form>
            </div>
            {/* Lightbox Modal */}
            {lightboxImage && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in duration-200" onClick={() => setLightboxImage(null)}>
                    {/* Close button at the top-right of the viewport, outside the preview box */}
                    <button 
                        type="button" 
                        onClick={() => setLightboxImage(null)} 
                        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E5654B] text-white flex items-center justify-center text-3xl transition-all font-light z-50 hover:scale-110 active:scale-95 shadow-lg border border-white/10"
                        title="Tutup"
                    >
                        &times;
                    </button>
                    
                    {/* Floating Image Wrapper - No white card background/padding */}
                    <div className="relative max-w-4xl max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <img 
                            src={lightboxImage} 
                            alt="Large Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10" 
                        />
                    </div>
                </div>,
                document.body
            )}
        </DynamicAdminLayout>
    );
}
