import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Opening({ invitation }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        opening_title: invitation?.opening_title || 'Bismillahirrahmanirrahim',
        opening_text: invitation?.opening_text || 'Assalamu\'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.',
        opening_ayat: invitation?.opening_ayat || 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.opening.save'));
    };

    return (
        <DashboardLayout title="Opening">
            <Head title="Opening" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Flash message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                        <svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}
                    </div>
                )}

                {/* Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Section Opening</div>
                        <div className="text-blue-600 text-xs mt-0.5">
                            Bagian opening adalah sambutan atau salam pembuka undangan Anda. Biasanya berisi salam, ayat suci, atau kutipan.
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Judul Opening */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Opening</label>
                        <input
                            type="text"
                            value={data.opening_title}
                            onChange={(e) => setData('opening_title', e.target.value)}
                            placeholder="Misalnya: Bismillahirrahmanirrahim"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                        />
                        {errors.opening_title && <p className="text-red-500 text-xs mt-1">{errors.opening_title}</p>}
                    </div>

                    {/* Teks Opening */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Opening / Salam</label>
                        <textarea
                            value={data.opening_text}
                            onChange={(e) => setData('opening_text', e.target.value)}
                            placeholder="Tulis salam pembuka Anda di sini..."
                            rows={5}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                        />
                        {errors.opening_text && <p className="text-red-500 text-xs mt-1">{errors.opening_text}</p>}
                    </div>

                    {/* Ayat / Kutipan */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ayat / Kutipan</label>
                        <p className="text-xs text-gray-400 mb-2">Opsional. Masukkan ayat suci Al-Quran, hadist, atau kutipan.</p>
                        <textarea
                            value={data.opening_ayat}
                            onChange={(e) => setData('opening_ayat', e.target.value)}
                            placeholder="Contoh: QS. Ar-Rum ayat 21"
                            rows={3}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                            dir="auto"
                        />
                        {errors.opening_ayat && <p className="text-red-500 text-xs mt-1">{errors.opening_ayat}</p>}
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-4"><svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Preview</h4>
                        <div className="bg-gradient-to-b from-rose-50 to-white rounded-xl p-6 text-center space-y-4">
                            {data.opening_ayat && (
                                <p className="text-lg font-serif text-rose-400 leading-relaxed" dir="auto">
                                    {data.opening_ayat}
                                </p>
                            )}
                            <h3 className="text-xl font-bold text-gray-800 font-serif">
                                {data.opening_title || 'Judul Opening'}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {data.opening_text || 'Teks opening akan tampil di sini...'}
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Opening'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
