import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Cover({ invitation }) {
    const { flash } = usePage().props;
    const [uploading, setUploading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cover_image: invitation?.cover_image || '',
        cover_title: invitation?.cover_title || 'The Wedding Of',
        cover_subtitle: invitation?.cover_subtitle || '',
    });

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'covers');
        try {
            const res = await fetch(route('upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            const result = await res.json();
            setData('cover_image', result.url);
        } catch (e) { console.error(e); }
        setUploading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.cover.save'));
    };

    return (
        <DashboardLayout title="Cover">
            <Head title="Cover" />
            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl"><svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" /></svg></span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Pengaturan Cover</div>
                        <div className="text-blue-600 text-xs mt-0.5">Cover adalah halaman pertama yang dilihat tamu saat membuka undangan Anda.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Cover Image */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Gambar Cover</label>
                        <div className="relative aspect-[9/16] max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                            {data.cover_image ? (
                                <img src={data.cover_image} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                    <div className="text-6xl mb-2"><svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                                    <div className="text-sm">Belum ada gambar</div>
                                </div>
                            )}
                            {data.cover_image && (
                                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                                    <p className="text-xs uppercase tracking-widest opacity-80">{data.cover_title}</p>
                                    <p className="text-xl font-bold font-serif mt-1">{data.cover_subtitle || 'Nama & Nama'}</p>
                                </div>
                            )}
                        </div>
                        <div className="text-center mt-4">
                            <label className="inline-block px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium cursor-pointer transition-colors">
                                {uploading ? 'Uploading...' : 'Upload Gambar Cover'}
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={(e) => handleImageUpload(e.target.files[0])} disabled={uploading} />
                            </label>
                            <p className="text-xs text-gray-400 mt-2">Rekomendasi: 1080 x 1920px (rasio 9:16)</p>
                        </div>
                    </div>

                    {/* Cover Title */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Atas Cover</label>
                        <input type="text" value={data.cover_title} onChange={(e) => setData('cover_title', e.target.value)}
                            placeholder="Contoh: The Wedding Of"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                        {errors.cover_title && <p className="text-red-500 text-xs mt-1">{errors.cover_title}</p>}
                    </div>

                    {/* Cover Subtitle */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Bawah / Nama Pasangan</label>
                        <input type="text" value={data.cover_subtitle} onChange={(e) => setData('cover_subtitle', e.target.value)}
                            placeholder="Contoh: Mira & Randi"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                        {errors.cover_subtitle && <p className="text-red-500 text-xs mt-1">{errors.cover_subtitle}</p>}
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Cover'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}

