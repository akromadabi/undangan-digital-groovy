import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Form({ theme }) {
    const { adminRoutePrefix } = usePage().props;
    const isEdit = !!theme;
    const fileInputRef = useRef(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(theme?.thumbnail || '');
    const [uploading, setUploading] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        name: theme?.name || '', slug: theme?.slug || '', thumbnail: theme?.thumbnail || '',
        category: theme?.category || 'elegant', is_premium: theme?.is_premium || false, is_active: theme?.is_active ?? true,
        supports_scroll: theme?.supports_scroll ?? true, supports_slide: theme?.supports_slide ?? true, supports_tab: theme?.supports_tab ?? true,
        color_scheme: JSON.stringify(theme?.color_scheme || { primary: '#B76E79', secondary: '#D4A373', bg: '#FFF9F5', text: '#2D2D2D' }, null, 2),
        font_config: JSON.stringify(theme?.font_config || { heading: 'Playfair Display', body: 'Poppins', script: 'Great Vibes' }, null, 2),
        sort_order: theme?.sort_order || 0,
    });

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => setThumbnailPreview(ev.target.result);
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'themes');

        try {
            const response = await fetch('/dashboard/upload', {
                method: 'POST',
                body: formData,
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
            });
            const result = await response.json();
            setData('thumbnail', result.url);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...data, color_scheme: JSON.parse(data.color_scheme), font_config: JSON.parse(data.font_config) };
        if (isEdit) { put(`${adminRoutePrefix}/themes/${theme.id}`, payload); } else { post(`${adminRoutePrefix}/themes`, payload); }
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 disabled:bg-[#f8f7f4]';
    const labelClass = 'text-xs font-semibold text-[#999] block mb-1.5 tracking-wide';

    return (
        <DynamicAdminLayout title={isEdit ? `Edit: ${theme.name}` : 'Tambah Tema'}>
            <Head title={isEdit ? 'Edit Tema' : 'Tambah Tema'} />
            <div className="max-w-2xl space-y-6">
                <Link href={`${adminRoutePrefix}/themes`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium">← Kembali</Link>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5">
                        <h3 className="font-bold text-[#1a1a1a] text-lg">Info Tema</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Nama *</label>
                                <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass} required /></div>
                            <div><label className={labelClass}>Slug *</label>
                                <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} disabled={isEdit}
                                    className={inputClass} required={!isEdit} /></div>
                            <div className="col-span-2">
                                <label className={labelClass}>Thumbnail *</label>
                                <div className="flex items-start gap-4">
                                    {/* Preview */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-28 h-28 rounded-xl border-2 border-dashed border-[#e8e5e0] flex items-center justify-center cursor-pointer bg-[#f8f7f4] hover:border-[#E5654B] hover:bg-[#fef2f0] transition-all overflow-hidden flex-shrink-0 relative"
                                    >
                                        {thumbnailPreview ? (
                                            <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-2">
                                                <svg className="w-8 h-8 mx-auto text-[#ccc] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                                <span className="text-[10px] text-[#999]">Upload</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-[#E5654B] border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <button type="button" onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-[#f5f3f0] hover:bg-[#e8e5e0] rounded-lg text-xs font-medium text-[#555] transition-colors inline-flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                            Pilih Gambar
                                        </button>
                                        <p className="text-[10px] text-[#999]">Format: JPG, PNG, WebP. Maks 5MB</p>
                                        {data.thumbnail && (
                                            <p className="text-xs text-emerald-600 font-medium truncate max-w-[250px]">
                                                <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {data.thumbnail}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div><label className={labelClass}>Kategori</label>
                                <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                                    className={inputClass}>
                                    <option value="elegant">Elegant</option><option value="modern">Modern</option>
                                    <option value="floral">Floral</option><option value="islamic">Islamic</option>
                                    <option value="rustic">Rustic</option><option value="minimalist">Minimalist</option>
                                </select></div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-2">
                            {['is_premium', 'is_active', 'supports_scroll', 'supports_slide', 'supports_tab'].map(key => (
                                <label key={key} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all ${data[key] ? 'bg-[#E5654B]/5 border border-[#E5654B]/30' : 'bg-[#f8f7f4] border border-transparent'}`}>
                                    <input type="checkbox" checked={data[key]} onChange={(e) => setData(key, e.target.checked)}
                                        className="rounded border-[#e8e5e0] text-[#E5654B] focus:ring-[#E5654B]" />
                                    <span className={`text-xs font-medium capitalize ${data[key] ? 'text-[#E5654B]' : 'text-[#777]'}`}>{key.replace(/_/g, ' ').replace('supports ', '').replace('is ', '')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-3">
                        <h3 className="font-bold text-[#1a1a1a] text-lg">Color Scheme <span className="text-xs text-[#999] font-normal">(JSON)</span></h3>
                        <textarea value={data.color_scheme} onChange={(e) => setData('color_scheme', e.target.value)}
                            className={`${inputClass} font-mono resize-none`} rows={6} />
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-3">
                        <h3 className="font-bold text-[#1a1a1a] text-lg">Font Config <span className="text-xs text-[#999] font-normal">(JSON)</span></h3>
                        <textarea value={data.font_config} onChange={(e) => setData('font_config', e.target.value)}
                            className={`${inputClass} font-mono resize-none`} rows={5} />
                    </div>

                    <button type="submit" disabled={processing || uploading}
                        className="w-full py-3.5 bg-[#E5654B] text-white rounded-xl font-semibold hover:bg-[#c94f3a] disabled:opacity-50 transition-colors shadow-sm">
                        {processing ? 'Menyimpan...' : isEdit ? 'Update Tema' : 'Buat Tema'}
                    </button>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
