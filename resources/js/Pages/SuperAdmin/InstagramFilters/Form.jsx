import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Check, Camera, Sparkles } from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function InstagramFilterForm({ filter = null }) {
    const isEditing = !!filter;

    const { data, setData, post, put, processing, errors } = useForm({
        name: filter?.name || '',
        slug: filter?.slug || '',
        filter_url: filter?.filter_url || '',
        thumbnail: filter?.thumbnail || '',
        preview_image: filter?.preview_image || '',
        is_active: filter?.is_active ?? true,
        sort_order: filter?.sort_order ?? 0,
        description: filter?.description || '',
    });

    const [uploading, setUploading] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState(filter?.thumbnail || '');
    const [previewImagePreview, setPreviewImagePreview] = useState(filter?.preview_image || '');

    const autoSlug = (name) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
        setData(d => ({ ...d, name, slug }));
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            if (field === 'thumbnail') {
                setThumbnailPreview(ev.target.result);
            } else {
                setPreviewImagePreview(ev.target.result);
            }
        };
        reader.readAsDataURL(file);

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'instagram-filters');

        try {
            const response = await fetch('/super-admin/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
            });

            if (!response.ok) throw new Error('Gagal mengupload berkas.');

            const result = await response.json();
            
            // Simpan path relatif dari storage
            const savedUrl = `/storage/${result.url}`;
            setData(field, savedUrl);
            
            if (field === 'thumbnail') {
                setThumbnailPreview(savedUrl);
            } else {
                setPreviewImagePreview(savedUrl);
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Karena method Inertia 'put' terkadang ada bug dengan form-data, 
            // kita gunakan route POST dengan _method=PUT agar aman di Laravel.
            post(`/super-admin/instagram-filters/${filter.id}?_method=PUT`);
        } else {
            post('/super-admin/instagram-filters');
        }
    };

    const inputClass = 'w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 transition-all';
    const labelClass = 'text-xs font-semibold text-[#888] block mb-1.5 tracking-wide';

    return (
        <SuperAdminLayout title={isEditing ? `Edit Filter: ${filter.name}` : 'Tambah Filter Baru'}>
            <Head title={`${isEditing ? 'Edit' : 'Tambah'} Filter Instagram - Super Admin`} />

            <div className="max-w-2xl space-y-6 pb-24">
                <Link
                    href="/super-admin/instagram-filters"
                    className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium inline-flex items-center gap-1 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Katalog
                </Link>

                {/* Form Wrapper */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5 shadow-sm">
                        <h3 className="font-bold text-[#1a1a1a] text-lg border-b border-[#f5f3f0] pb-3 flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-[#E5654B] rounded-full inline-block" />
                            Detail Filter Instagram
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Nama */}
                            <div>
                                <label className={labelClass}>Nama Filter *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => isEditing ? setData('name', e.target.value) : autoSlug(e.target.value)}
                                    className={inputClass}
                                    required
                                    placeholder="Rustic Golden Floral"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className={labelClass}>Slug (Kunci Unik) *</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className={`${inputClass} font-mono`}
                                    required
                                    placeholder="rustic-golden-floral"
                                    disabled={isEditing}
                                />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                            </div>

                            {/* Tautan Filter */}
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Tautan Kamera Filter (Instagram AR URL) *</label>
                                <input
                                    type="url"
                                    value={data.filter_url}
                                    onChange={e => setData('filter_url', e.target.value)}
                                    className={inputClass}
                                    required
                                    placeholder="https://www.instagram.com/ar/xxxxxxxxxxxx/"
                                />
                                {errors.filter_url && <p className="text-red-500 text-xs mt-1">{errors.filter_url}</p>}
                            </div>

                            {/* Urutan */}
                            <div>
                                <label className={labelClass}>Urutan Tampil (Sort Order)</label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={e => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="Contoh: 1"
                                />
                                {errors.sort_order && <p className="text-red-500 text-xs mt-1">{errors.sort_order}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className={labelClass}>Status Keaktifan</label>
                                <div className="flex items-center justify-between h-[44px] bg-[#faf9f7] border border-[#e8e5e0]/60 px-4 rounded-xl">
                                    <span className="text-xs font-bold text-gray-700">Aktif & Tampil</span>
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

                            {/* Deskripsi */}
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Deskripsi Singkat</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className={`${inputClass} min-h-[80px] py-2`}
                                    placeholder="Jelaskan secara singkat visual efek atau nuansa warna dari filter ini..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            {/* Upload Thumbnail & Preview */}
                            <div className="sm:col-span-2 border-t border-[#f5f3f0] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                
                                {/* Slot Thumbnail / Sampul */}
                                <div>
                                    <label className={labelClass}>Gambar Mini (Thumbnail 1:1) *</label>
                                    <div className="border border-[#e8e5e0] rounded-xl p-4 bg-[#faf9f7] flex flex-col items-center gap-3">
                                        {thumbnailPreview ? (
                                            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-sm border border-stone-200 relative group">
                                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setData('thumbnail', ''); setThumbnailPreview(''); }}
                                                    className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold transition-all rounded-xl"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                                <Camera className="w-8 h-8" />
                                            </div>
                                        )}
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#E5654B] cursor-pointer hover:text-[#c94f3a]">
                                            {uploading ? 'Mengupload...' : 'Pilih Berkas'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleFileUpload(e, 'thumbnail')}
                                                className="sr-only"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Slot Mockup Preview */}
                                <div>
                                    <label className={labelClass}>Gambar Demo Smartphone (Rasio 9:16)</label>
                                    <div className="border border-[#e8e5e0] rounded-xl p-4 bg-[#faf9f7] flex flex-col items-center gap-3">
                                        {previewImagePreview ? (
                                            <div className="w-20 h-28 rounded-xl overflow-hidden shadow-sm border border-stone-200 relative group">
                                                <img src={previewImagePreview} alt="Mockup Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => { setData('preview_image', ''); setPreviewImagePreview(''); }}
                                                    className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center font-bold transition-all rounded-xl"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-20 h-28 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                                                <Sparkles className="w-8 h-8" />
                                            </div>
                                        )}
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#E5654B] cursor-pointer hover:text-[#c94f3a]">
                                            {uploading ? 'Mengupload...' : 'Pilih Berkas'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleFileUpload(e, 'preview_image')}
                                                className="sr-only"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <Link
                            href="/super-admin/instagram-filters"
                            className="px-5 py-2.5 bg-white border border-[#e8e5e0] text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || uploading}
                            className="px-6 py-2.5 bg-[#E5654B] hover:bg-[#c24b33] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {processing && (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {isEditing ? 'Simpan Perubahan' : 'Tambah Filter'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
