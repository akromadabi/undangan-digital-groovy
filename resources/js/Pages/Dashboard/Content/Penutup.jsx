import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Penutup({ invitation }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        closing_title: invitation?.closing_title || 'Terima Kasih',
        closing_text: invitation?.closing_text || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu\'alaikum Warahmatullahi Wabarakatuh',
        turut_mengundang_text: invitation?.turut_mengundang_text || '',
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
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
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

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Turut Mengundang</label>
                        <p className="text-xs text-gray-400 mb-3">Opsional. Tulis daftar keluarga/pihak yang turut mengundang, pisahkan dengan enter.</p>
                        <textarea value={data.turut_mengundang_text} onChange={(e) => setData('turut_mengundang_text', e.target.value)}
                            placeholder={"Contoh:\nKeluarga Besar Bpk. H. Ahmad Suryanto\nKeluarga Besar Bpk. H. Bambang Wijaya"}
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                        {errors.turut_mengundang_text && <p className="text-red-500 text-xs mt-1">{errors.turut_mengundang_text}</p>}
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-4"><svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Preview</h4>
                        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 text-center space-y-4">
                            <h3 className="text-xl font-bold text-gray-800 font-serif">
                                {data.closing_title || 'Judul Penutup'}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {data.closing_text || 'Teks penutup akan tampil di sini...'}
                            </p>
                            {data.turut_mengundang_text && (
                                <div className="pt-3 mt-3 border-t border-gray-200">
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Turut Mengundang</p>
                                    <div className="space-y-0.5">
                                        {data.turut_mengundang_text.split('\n').filter(l => l.trim()).map((line, i) => (
                                            <p key={i} className="text-sm font-medium text-gray-600">{line.trim()}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="pt-4">
                                <p className="text-sm font-semibold text-gray-700">Kami yang berbahagia,</p>
                                <p className="text-lg font-bold text-rose-500 font-serif mt-1"><svg className="w-5 h-5 mx-auto text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Penutup'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
