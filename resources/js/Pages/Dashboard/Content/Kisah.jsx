import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const emptyStory = { title: '', story_date: '', description: '', image_url: '' };

export default function Kisah({ stories }) {
    const { flash } = usePage().props;

    const initial = stories?.length > 0 ? stories : [
        { ...emptyStory, title: 'Pertama Bertemu' },
        { ...emptyStory, title: 'Mulai Menjalin Hubungan' },
        { ...emptyStory, title: 'Lamaran' },
    ];

    const { data, setData, post, processing } = useForm({ stories: initial });

    const updateStory = (index, field, value) => {
        const updated = [...data.stories];
        updated[index] = { ...updated[index], [field]: value };
        setData('stories', updated);
    };

    const addStory = () => setData('stories', [...data.stories, { ...emptyStory }]);

    const removeStory = (index) => {
        if (data.stories.length <= 1) return;
        setData('stories', data.stories.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.kisah.save'));
    };

    return (
        <DashboardLayout title="Kisah Cinta">
            <Head title="Kisah Cinta" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">💕</span>
                    <div>
                        <div className="font-medium text-pink-800 text-sm">Kisah Cinta / Timeline</div>
                        <div className="text-pink-600 text-xs mt-0.5">Ceritakan perjalanan cinta Anda berdua. Tambahkan momen-momen spesial yang ingin Anda bagikan.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {data.stories.map((story, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                            {/* Timeline dot */}
                            <div className="absolute -left-3 top-8 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                {index + 1}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-gray-700">Momen #{index + 1}</h4>
                                {data.stories.length > 1 && (
                                    <button type="button" onClick={() => removeStory(index)}
                                        className="text-red-400 hover:text-red-600 text-sm">✕ Hapus</button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Judul Momen *</label>
                                    <input type="text" value={story.title} onChange={(e) => updateStory(index, 'title', e.target.value)}
                                        placeholder="Contoh: Pertama Bertemu"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal</label>
                                    <input type="date" value={story.story_date?.split('T')[0] || ''}
                                        onChange={(e) => updateStory(index, 'story_date', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Cerita</label>
                                <textarea value={story.description || ''} onChange={(e) => updateStory(index, 'description', e.target.value)}
                                    placeholder="Ceritakan momen ini..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400 resize-none" rows={3} />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">URL Gambar (opsional)</label>
                                <input type="text" value={story.image_url || ''} onChange={(e) => updateStory(index, 'image_url', e.target.value)}
                                    placeholder="Upload di menu Galeri lalu paste URL di sini"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-400" />
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addStory}
                        className="w-full py-3 border-2 border-dashed border-pink-200 rounded-xl text-pink-400 hover:border-pink-400 hover:text-pink-500 transition-colors text-sm font-medium">
                        + Tambah Momen
                    </button>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Kisah Cinta'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
