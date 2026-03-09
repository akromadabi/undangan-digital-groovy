import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Penutup({ invitation }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        closing_title: invitation?.closing_title || 'Terima Kasih',
        closing_text: invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu\'alaikum Warahmatullahi Wabarakatuh',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.penutup.save'));
    };

    return (
        <DashboardLayout title="Penutup">
            <Head title="Penutup" />
            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Section Penutup</div>
                        <div className="text-blue-600 text-xs mt-0.5">Bagian penutup adalah ucapan terima kasih dan salam penutup undangan Anda.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Penutup</label>
                        <input type="text" value={data.closing_title} onChange={(e) => setData('closing_title', e.target.value)}
                            placeholder="Contoh: Terima Kasih"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                        {errors.closing_title && <p className="text-red-500 text-xs mt-1">{errors.closing_title}</p>}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Penutup</label>
                        <textarea value={data.closing_text} onChange={(e) => setData('closing_text', e.target.value)}
                            placeholder="Tulis ucapan penutup Anda..."
                            rows={6}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                        {errors.closing_text && <p className="text-red-500 text-xs mt-1">{errors.closing_text}</p>}
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-4">👁️ Preview</h4>
                        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 text-center space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 font-serif">
                                {data.closing_title || 'Judul Penutup'}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {data.closing_text || 'Teks penutup akan tampil di sini...'}
                            </p>
                            <div className="pt-4">
                                <p className="text-sm font-semibold text-gray-700">Kami yang berbahagia,</p>
                                <p className="text-lg font-bold text-rose-500 font-serif mt-1">💕</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Penutup'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
