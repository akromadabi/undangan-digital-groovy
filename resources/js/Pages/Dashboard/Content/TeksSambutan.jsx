import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function TeksSambutan({ invitation }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('opening');

    const openingForm = useForm({
        opening_title: invitation?.opening_title || 'Bismillahirrahmanirrahim',
        opening_text: invitation?.opening_text || "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
        opening_ayat: invitation?.opening_ayat || 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    });

    const closingForm = useForm({
        closing_title: invitation?.closing_title || 'Terima Kasih',
        closing_text: invitation?.closing_text || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
    });

    const handleOpeningSubmit = (e) => {
        e.preventDefault();
        openingForm.post(route('content.opening.save'));
    };

    const handleClosingSubmit = (e) => {
        e.preventDefault();
        closingForm.post(route('content.penutup.save'));
    };

    const tabs = [
        { id: 'opening', label: '✨ Opening', desc: 'Salam Pembuka' },
        { id: 'penutup', label: '🙏 Penutup', desc: 'Ucapan Penutup' },
    ];

    return (
        <DashboardLayout title="Teks & Sambutan">
            <Head title="Teks & Sambutan" />

            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-2xl border border-gray-200 p-1.5 flex gap-1">
                    {tabs.map(tab => (
                        <button key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}>
                            <div>{tab.label}</div>
                            <div className={`text-[10px] mt-0.5 ${activeTab === tab.id ? 'text-white/70' : 'text-gray-400'}`}>{tab.desc}</div>
                        </button>
                    ))}
                </div>

                {/* Opening Tab */}
                {activeTab === 'opening' && (
                    <form onSubmit={handleOpeningSubmit} className="space-y-5">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-xl">💡</span>
                            <div>
                                <div className="font-medium text-blue-800 text-sm">Section Opening</div>
                                <div className="text-blue-600 text-xs mt-0.5">Bagian opening adalah sambutan atau salam pembuka undangan Anda. Biasanya berisi salam, ayat suci, atau kutipan.</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Opening</label>
                            <input type="text" value={openingForm.data.opening_title}
                                onChange={(e) => openingForm.setData('opening_title', e.target.value)}
                                placeholder="Misalnya: Bismillahirrahmanirrahim"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            {openingForm.errors.opening_title && <p className="text-red-500 text-xs mt-1">{openingForm.errors.opening_title}</p>}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Opening / Salam</label>
                            <textarea value={openingForm.data.opening_text}
                                onChange={(e) => openingForm.setData('opening_text', e.target.value)}
                                placeholder="Tulis salam pembuka Anda di sini..."
                                rows={5}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                            {openingForm.errors.opening_text && <p className="text-red-500 text-xs mt-1">{openingForm.errors.opening_text}</p>}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ayat / Kutipan</label>
                            <p className="text-xs text-gray-400 mb-2">Opsional. Masukkan ayat suci Al-Quran, hadist, atau kutipan.</p>
                            <textarea value={openingForm.data.opening_ayat}
                                onChange={(e) => openingForm.setData('opening_ayat', e.target.value)}
                                placeholder="Contoh: QS. Ar-Rum ayat 21"
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                                dir="auto" />
                            {openingForm.errors.opening_ayat && <p className="text-red-500 text-xs mt-1">{openingForm.errors.opening_ayat}</p>}
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4">👁️ Preview</h4>
                            <div className="bg-gradient-to-b from-rose-50 to-white rounded-xl p-6 text-center space-y-4">
                                {openingForm.data.opening_ayat && (
                                    <p className="text-lg font-serif text-rose-400 leading-relaxed" dir="auto">{openingForm.data.opening_ayat}</p>
                                )}
                                <h3 className="text-xl font-bold text-gray-800 font-serif">{openingForm.data.opening_title || 'Judul Opening'}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{openingForm.data.opening_text || 'Teks opening akan tampil di sini...'}</p>
                            </div>
                        </div>

                        <button type="submit" disabled={openingForm.processing}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {openingForm.processing ? 'Menyimpan...' : '💾 Simpan Opening'}
                        </button>
                    </form>
                )}

                {/* Penutup Tab */}
                {activeTab === 'penutup' && (
                    <form onSubmit={handleClosingSubmit} className="space-y-5">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-xl">💡</span>
                            <div>
                                <div className="font-medium text-blue-800 text-sm">Section Penutup</div>
                                <div className="text-blue-600 text-xs mt-0.5">Bagian penutup adalah ucapan terima kasih dan salam penutup undangan Anda.</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Penutup</label>
                            <input type="text" value={closingForm.data.closing_title}
                                onChange={(e) => closingForm.setData('closing_title', e.target.value)}
                                placeholder="Contoh: Terima Kasih"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            {closingForm.errors.closing_title && <p className="text-red-500 text-xs mt-1">{closingForm.errors.closing_title}</p>}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Penutup</label>
                            <textarea value={closingForm.data.closing_text}
                                onChange={(e) => closingForm.setData('closing_text', e.target.value)}
                                placeholder="Tulis ucapan penutup Anda..."
                                rows={6}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                            {closingForm.errors.closing_text && <p className="text-red-500 text-xs mt-1">{closingForm.errors.closing_text}</p>}
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4">👁️ Preview</h4>
                            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 text-center space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 font-serif">{closingForm.data.closing_title || 'Judul Penutup'}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{closingForm.data.closing_text || 'Teks penutup akan tampil di sini...'}</p>
                                <div className="pt-4">
                                    <p className="text-sm font-semibold text-gray-700">Kami yang berbahagia,</p>
                                    <p className="text-lg font-bold text-rose-500 font-serif mt-1">💕</p>
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={closingForm.processing}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {closingForm.processing ? 'Menyimpan...' : '💾 Simpan Penutup'}
                        </button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}
