import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Galeri({ galleries, maxGalleries, galleryMode }) {
    const { flash } = usePage().props;
    const [uploading, setUploading] = useState(false);
    const [caption, setCaption] = useState('');
    const [mode, setMode] = useState(galleryMode || 'grid');
    const [savingMode, setSavingMode] = useState(false);

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'galeri');

        try {
            const res = await fetch(route('upload'), {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content },
                body: formData,
            });
            const result = await res.json();

            router.post(route('content.galeri.save'), {
                image_url: result.url,
                caption: caption,
            }, { preserveScroll: true });
            setCaption('');
        } catch (e) {
            console.error(e);
        }
        setUploading(false);
    };

    const handleDelete = (id) => {
        if (confirm('Hapus foto ini?')) {
            router.delete(route('content.galeri.delete', id), { preserveScroll: true });
        }
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setSavingMode(true);
        router.post(route('content.galeri.mode'), { gallery_mode: newMode }, {
            preserveScroll: true,
            onFinish: () => setSavingMode(false),
        });
    };

    const remaining = maxGalleries - (galleries?.length || 0);

    const modes = [
        { value: 'grid', label: 'Grid', desc: 'Tampilan kotak-kotak', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
        { value: 'carousel', label: 'Carousel', desc: 'Geser kiri-kanan', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z' },
        { value: 'slide', label: 'Slide', desc: 'Satu per satu dengan tombol', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' },
    ];

    return (
        <DashboardLayout title="Galeri">
            <Head title="Galeri" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Galeri Foto</div>
                        <div className="text-blue-600 text-xs mt-0.5">
                            Upload foto-foto terbaik Anda. Kuota: <strong>{galleries?.length || 0}/{maxGalleries}</strong> foto.
                        </div>
                    </div>
                </div>

                {/* ═══ Gallery Mode Selector ═══ */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700">Model Tampilan Galeri</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Pilih cara foto ditampilkan di undangan</p>
                        </div>
                        {savingMode && <span className="text-xs text-emerald-500 animate-pulse">Menyimpan...</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {modes.map((m) => (
                            <button key={m.value} type="button" onClick={() => handleModeChange(m.value)}
                                className={`relative p-4 rounded-xl border-2 text-center transition-all ${mode === m.value ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                                <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${mode === m.value ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                                    </svg>
                                </div>
                                <div className={`text-xs font-bold ${mode === m.value ? 'text-emerald-700' : 'text-gray-600'}`}>{m.label}</div>
                                <div className="text-[10px] text-gray-400 mt-0.5">{m.desc}</div>
                                {mode === m.value && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Area */}
                {remaining > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Upload Foto Baru</h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Caption foto (opsional)"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                            />
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/50 transition-all">
                                    {uploading ? (
                                        <div className="text-emerald-500 font-medium">⏳ Uploading...</div>
                                    ) : (
                                        <>
                                            <div className="text-4xl mb-2">📸</div>
                                            <div className="text-sm font-medium text-gray-600">Klik untuk upload foto</div>
                                            <div className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • Max 5MB</div>
                                        </>
                                    )}
                                </div>
                                <input type="file" accept="image/*" className="hidden"
                                    onChange={(e) => handleUpload(e.target.files[0])} disabled={uploading} />
                            </label>
                        </div>
                        <div className="mt-3 text-xs text-gray-400 text-right">Sisa kuota: {remaining} foto</div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <div className="font-medium text-amber-800 text-sm">Kuota foto penuh</div>
                            <div className="text-amber-600 text-xs">Hapus foto lama atau upgrade paket untuk menambah kuota.</div>
                        </div>
                    </div>
                )}

                {/* Gallery Grid */}
                {galleries?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {galleries.map((photo) => (
                            <div key={photo.id} className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <div className="aspect-square">
                                    <img src={photo.image_url} alt={photo.caption || 'Foto'} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    {photo.caption && <p className="text-xs text-gray-600 truncate">{photo.caption}</p>}
                                </div>
                                {/* Delete overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => handleDelete(photo.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                                        🗑️ Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-3">🖼️</div>
                        <div className="text-gray-500 font-medium">Belum ada foto</div>
                        <div className="text-gray-400 text-sm mt-1">Upload foto pertama Anda di atas</div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
