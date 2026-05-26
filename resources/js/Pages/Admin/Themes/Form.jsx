import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Form({ theme, plans = [] }) {
    const { adminRoutePrefix } = usePage().props;
    const isEdit = !!theme;
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // State untuk mengontrol tab editor ("visual" vs "json")
    const [colorTab, setColorTab] = useState('visual');
    const [fontTab, setFontTab] = useState('visual');

    const getThumbnailUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('/') || path.startsWith('data:')) return path;
        return `/storage/${path}`;
    };

    const { data, setData, post, put, transform, processing, errors } = useForm({
        name: theme?.name || '', 
        slug: theme?.slug || '', 
        thumbnail: theme?.thumbnail || '',
        category: theme?.category || 'elegant', 
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
            setData({
                name: theme.name || '',
                slug: theme.slug || '',
                thumbnail: theme.thumbnail || '',
                category: theme.category || 'elegant',
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
        }
    }, [theme?.id, theme?.thumbnail]);

    // Click outside listener untuk menutup dropdown paket
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
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
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });
            const result = await response.json();
            setData('thumbnail', result.url);
            setThumbnailPreview(getThumbnailUrl(result.url));
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
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

    // Parsing data JSON untuk kebutuhan Visual Editor
    let parsedColorScheme = { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D', accent: '#D4A373' };
    try {
        parsedColorScheme = { ...parsedColorScheme, ...JSON.parse(data.color_scheme || '{}') };
    } catch (e) {}

    let parsedFontConfig = { heading: 'Playfair Display', body: 'Poppins', script: 'Great Vibes' };
    try {
        parsedFontConfig = { ...parsedFontConfig, ...JSON.parse(data.font_config || '{}') };
    } catch (e) {}

    const colorKeys = [
        { key: 'bg', label: 'Latar Belakang (bg)', desc: 'Warna dasar background undangan.' },
        { key: 'text', label: 'Teks Utama (text)', desc: 'Warna tulisan agar kontras dan mudah dibaca.' },
        { key: 'primary', label: 'Warna Utama (primary)', desc: 'Warna dominan untuk tombol, link, dan highlight.' },
        { key: 'secondary', label: 'Warna Sekunder (secondary)', desc: 'Warna pendukung elemen undangan.' },
        { key: 'accent', label: 'Warna Aksen (accent)', desc: 'Warna dekorasi ornamen, garis, atau ikon.' },
    ];

    const fontKeys = [
        { key: 'heading', label: 'Font Judul (heading)', placeholder: 'Contoh: Playfair Display', desc: 'Digunakan untuk nama mempelai & judul utama undangan.' },
        { key: 'body', label: 'Font Teks (body)', placeholder: 'Contoh: Poppins', desc: 'Digunakan untuk teks rincian acara, alamat, dan informasi umum.' },
        { key: 'script', label: 'Font Aksara/Cursive (script)', placeholder: 'Contoh: Great Vibes', desc: 'Digunakan untuk kutipan ayat/pemanis bergaya tulisan sambung.' },
    ];

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
                    {/* CARD 1: INFO UTAMA TEMA */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                            Info Utama Tema
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
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
                                <span className="text-[10px] text-gray-400 mt-1 block">Digunakan sistem sebagai penanda tema (tidak bisa diubah).</span>
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                            </div>

                            {/* UPLOAD THUMBNAIL */}
                            <div className="col-span-2">
                                <label className={labelClass}>Foto Preview Tema (Thumbnail) *</label>
                                <div className="flex items-start gap-4 bg-[#faf9f7] p-4 rounded-xl border border-[#e8e5e0]/60">
                                    {/* Preview Box */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-lg border-2 border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer bg-white hover:border-[#E5654B] hover:bg-[#fef2f0] transition-all overflow-hidden flex-shrink-0 relative shadow-sm"
                                    >
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                                <span className="text-[9px] text-gray-400">Pilih Foto</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-[#E5654B] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Action Buttons & Info */}
                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-3.5 py-1.5 bg-white border border-[#e8e5e0] hover:bg-gray-50 rounded-lg text-xs font-semibold text-[#555] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            Ganti Gambar
                                        </button>
                                        <p className="text-[10px] text-gray-400">Format: JPG, PNG, WebP. Ukuran Maksimum: 5MB</p>
                                        {errors.thumbnail && <p className="text-red-500 text-xs mt-1 font-medium">{errors.thumbnail}</p>}
                                        {data.thumbnail && (
                                            <div className="text-[10px] text-emerald-600 font-semibold truncate max-w-[300px] bg-emerald-50 border border-emerald-500/10 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Foto tersimpan: {data.thumbnail}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Kategori Desain</label>
                                <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                                    className={inputClass}>
                                    <option value="elegant">Elegant</option>
                                    <option value="modern">Modern</option>
                                    <option value="floral">Floral</option>
                                    <option value="islamic">Islamic</option>
                                    <option value="rustic">Rustic</option>
                                    <option value="minimalist">Minimalist</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Like Dasar (Base Likes)</label>
                                <input type="number" min="0" value={data.base_likes} onChange={(e) => setData('base_likes', parseInt(e.target.value) || 0)}
                                    className={inputClass} placeholder="Contoh: 150" />
                                <span className="text-[10px] text-gray-400 mt-1 block">Angka awal menyukai tema untuk mendongkrak popularitas.</span>
                                {errors.base_likes && <p className="text-red-500 text-xs mt-1">{errors.base_likes}</p>}
                            </div>
                        </div>

                        {/* GRUP CHECKLIST: DIPISAH SESUAI KEGUNAAN */}
                        <div className="border-t border-[#f5f3f0] pt-5 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Kategori 1: Status & Akses */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#f5f3f0] pb-2">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Status & Publikasi Tema
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* is_active */}
                                        <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${data.is_active ? 'bg-emerald-50/20 border-emerald-500/20' : 'bg-gray-50 border-gray-200/60'}`}>
                                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)}
                                                className="mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                            <div>
                                                <span className={`text-xs font-bold block ${data.is_active ? 'text-emerald-700' : 'text-gray-700'}`}>Publish Tema</span>
                                                <span className="text-[9px] text-gray-400 block mt-0.5">Jika aktif, tema ini muncul dan bisa digunakan langsung oleh pengguna.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Kategori Baru: Pembatasan Kelas Paket */}
                                <div className="space-y-3 relative" ref={dropdownRef}>
                                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-[#f5f3f0] pb-2">
                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Akses Kelas Paket (Subscription Plans)
                                    </h4>
                                    <p className="text-[9px] text-gray-400 leading-normal">
                                        Pilih paket yang diizinkan menggunakan tema ini. Jika dikosongkan, tema bersifat <strong>Gratis/Umum</strong> untuk semua paket.
                                    </p>
                                    
                                    {/* Trigger Button Dropdown */}
                                    <div 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full min-h-[44px] bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2 flex items-center justify-between cursor-pointer hover:border-[#E5654B] transition-all select-none shadow-xs"
                                    >
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {(data.allowed_plans || []).length === 0 ? (
                                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                    🔓 Semua Paket (Gratis/Umum)
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
                                        <div className="absolute z-20 left-0 right-0 top-[100%] mt-1.5 bg-white border border-[#e8e5e0] rounded-2xl shadow-xl overflow-hidden max-h-[190px] overflow-y-auto p-1.5 space-y-0.5">
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
                                                                <span className="text-[8px] text-gray-400 block mt-0.5 truncate">
                                                                    Izinkan pengguna paket {plan.name} untuk memakai tema ini.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Kategori 2: Tipe Layout / Navigasi */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg>
                                    Fitur Navigasi / Tipe Layout Tema
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* supports_scroll */}
                                    <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${data.supports_scroll ? 'bg-[#E5654B]/5 border-[#E5654B]/20' : 'bg-gray-50 border-gray-200/60'}`}>
                                        <input type="checkbox" checked={data.supports_scroll} onChange={(e) => setData('supports_scroll', e.target.checked)}
                                            className="mt-0.5 rounded border-gray-300 text-[#E5654B] focus:ring-[#E5654B]" />
                                        <div>
                                            <span className={`text-xs font-bold block ${data.supports_scroll ? 'text-[#E5654B]' : 'text-gray-700'}`}>Tipe Scroll</span>
                                            <span className="text-[9px] text-gray-400 block mt-0.5">Mendukung gulir ke bawah satu halaman penuh.</span>
                                        </div>
                                    </label>
                                    {/* supports_slide */}
                                    <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${data.supports_slide ? 'bg-[#E5654B]/5 border-[#E5654B]/20' : 'bg-gray-50 border-gray-200/60'}`}>
                                        <input type="checkbox" checked={data.supports_slide} onChange={(e) => setData('supports_slide', e.target.checked)}
                                            className="mt-0.5 rounded border-gray-300 text-[#E5654B] focus:ring-[#E5654B]" />
                                        <div>
                                            <span className={`text-xs font-bold block ${data.supports_slide ? 'text-[#E5654B]' : 'text-gray-700'}`}>Tipe Slide</span>
                                            <span className="text-[9px] text-gray-400 block mt-0.5">Mendukung navigasi geser halaman (slide horizontal).</span>
                                        </div>
                                    </label>
                                    {/* supports_tab */}
                                    <label className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all border ${data.supports_tab ? 'bg-[#E5654B]/5 border-[#E5654B]/20' : 'bg-gray-50 border-gray-200/60'}`}>
                                        <input type="checkbox" checked={data.supports_tab} onChange={(e) => setData('supports_tab', e.target.checked)}
                                            className="mt-0.5 rounded border-gray-300 text-[#E5654B] focus:ring-[#E5654B]" />
                                        <div>
                                            <span className={`text-xs font-bold block ${data.supports_tab ? 'text-[#E5654B]' : 'text-gray-700'}`}>Tipe Tab Menu</span>
                                            <span className="text-[9px] text-gray-400 block mt-0.5">Mendukung menu tab bawah/samping sebagai navigasi halaman.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: COLOR SCHEME */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#f5f3f0] pb-3">
                            <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                                Palet Warna Tema (Color Scheme)
                            </h3>
                            
                            {/* Tab Toggle */}
                            <div className="bg-[#f5f3f0] p-0.5 rounded-lg flex shadow-inner">
                                <button type="button" onClick={() => setColorTab('visual')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${colorTab === 'visual' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-[#777] hover:text-[#333]'}`}>
                                    Visual Editor
                                </button>
                                <button type="button" onClick={() => setColorTab('json')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${colorTab === 'json' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-[#777] hover:text-[#333]'}`}>
                                    Raw JSON
                                </button>
                            </div>
                        </div>

                        {/* INFO PENJELASAN */}
                        <div className="bg-blue-50/40 border border-blue-500/10 rounded-xl p-3.5 text-xs text-blue-800 leading-relaxed">
                            <span className="font-bold block mb-0.5">💡 Apa itu Color Scheme?</span>
                            Konfigurasi ini menentukan palet warna yang akan otomatis diterapkan ke seluruh halaman undangan customer. Warna background, teks, tombol RSVP, ornamen pembatas, dan link navigasi akan mengikuti aturan warna ini agar undangan tampil harmonis.
                        </div>

                        {/* TAB CONTENT: VISUAL EDITOR */}
                        {colorTab === 'visual' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {colorKeys.map(({ key, label, desc }) => (
                                    <div key={key} className="bg-[#fcfbfa] border border-[#e8e5e0]/60 p-3 rounded-xl flex items-center gap-4 transition-all hover:border-[#E5654B]/20 shadow-sm">
                                        {/* Color Circle Preview / Native Picker */}
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#e8e5e0] shadow-sm flex-shrink-0">
                                            <input 
                                                type="color" 
                                                value={parsedColorScheme[key] || '#ffffff'} 
                                                onChange={(e) => updateColorSchemeKey(key, e.target.value)} 
                                                className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150" 
                                            />
                                        </div>
                                        
                                        {/* Input & Info */}
                                        <div className="flex-1 space-y-1">
                                            <label className="text-xs font-bold text-gray-700 block">{label}</label>
                                            <p className="text-[9px] text-gray-400 block leading-tight">{desc}</p>
                                            <input 
                                                type="text" 
                                                value={parsedColorScheme[key] || ''} 
                                                onChange={(e) => updateColorSchemeKey(key, e.target.value)}
                                                placeholder="#FFFFFF" 
                                                className="w-full text-xs font-mono uppercase bg-white border border-[#e8e5e0] rounded-lg px-2.5 py-1 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* TAB CONTENT: RAW JSON EDITOR */
                            <div className="space-y-1.5 pt-2">
                                <textarea value={data.color_scheme} onChange={(e) => setData('color_scheme', e.target.value)}
                                    className={`${inputClass} font-mono resize-y min-h-[160px] bg-gray-50/50`} placeholder="Masukkan JSON Color Scheme..." />
                                <span className="text-[10px] text-gray-400 block">Pastikan format JSON valid dengan tanda kurung kurawal `{}` dan petik dua `""`.</span>
                            </div>
                        )}
                    </div>

                    {/* CARD 3: FONT CONFIG */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between border-b border-[#f5f3f0] pb-3">
                            <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block"></span>
                                Konfigurasi Huruf (Font Config)
                            </h3>
                            
                            {/* Tab Toggle */}
                            <div className="bg-[#f5f3f0] p-0.5 rounded-lg flex shadow-inner">
                                <button type="button" onClick={() => setFontTab('visual')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${fontTab === 'visual' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-[#777] hover:text-[#333]'}`}>
                                    Visual Editor
                                </button>
                                <button type="button" onClick={() => setFontTab('json')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${fontTab === 'json' ? 'bg-white text-[#E5654B] shadow-sm' : 'text-[#777] hover:text-[#333]'}`}>
                                    Raw JSON
                                </button>
                            </div>
                        </div>

                        {/* INFO PENJELASAN */}
                        <div className="bg-blue-50/40 border border-blue-500/10 rounded-xl p-3.5 text-xs text-blue-800 leading-relaxed">
                            <span className="font-bold block mb-0.5">💡 Apa itu Font Config?</span>
                            Digunakan untuk menentukan kombinasi jenis huruf Google Fonts yang diterapkan di undangan. Admin dapat mengelompokkan jenis font yang elegan untuk judul, font bersih yang mudah dibaca untuk informasi detail, dan font tulisan sambung estetik untuk dekorasi.
                        </div>

                        {/* TAB CONTENT: VISUAL EDITOR */}
                        {fontTab === 'visual' ? (
                            <div className="space-y-4 pt-2">
                                {fontKeys.map(({ key, label, placeholder, desc }) => (
                                    <div key={key} className="bg-[#fcfbfa] border border-[#e8e5e0]/60 p-4 rounded-xl space-y-1.5 transition-all hover:border-[#E5654B]/20 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-gray-700">{label}</label>
                                            <span className="text-[10px] text-gray-400 font-mono italic">Kunci: {key}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-normal">{desc}</p>
                                        <input 
                                            type="text" 
                                            value={parsedFontConfig[key] || ''} 
                                            onChange={(e) => updateFontConfigKey(key, e.target.value)}
                                            placeholder={placeholder} 
                                            className="w-full text-xs bg-white border border-[#e8e5e0] rounded-lg px-3 py-2 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* TAB CONTENT: RAW JSON EDITOR */
                            <div className="space-y-1.5 pt-2">
                                <textarea value={data.font_config} onChange={(e) => setData('font_config', e.target.value)}
                                    className={`${inputClass} font-mono resize-y min-h-[140px] bg-gray-50/50`} placeholder="Masukkan JSON Font Config..." />
                                <span className="text-[10px] text-gray-400 block">Pastikan nama font ditulis persis sesuai dengan nama font di Google Fonts (case-sensitive).</span>
                            </div>
                        )}
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
        </DynamicAdminLayout>
    );
}
