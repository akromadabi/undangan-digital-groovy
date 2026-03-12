import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const religionLabels = { islam: '☪️ Islam', kristen: '✝️ Kristen', hindu: '🕉️ Hindu', buddha: '☸️ Buddha', umum: '🌐 Umum' };

export default function TeksSambutan({ invitation, quoteTemplates = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('opening');
    const [selectedReligion, setSelectedReligion] = useState(invitation?.religion || 'islam');

    const isIslam = selectedReligion === 'islam';

    const openingForm = useForm({
        opening_title: invitation?.opening_title || 'Bismillahirrahmanirrahim',
        opening_text: invitation?.opening_text || "Assalamu'alaikum Warahmatullahi Wabarakatuh\n\nDengan memohon Rahmat dan Ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami.",
        opening_ayat: invitation?.opening_ayat || '',
        opening_ayat_translation: invitation?.opening_ayat_translation || '',
        opening_ayat_source: invitation?.opening_ayat_source || '',
        religion: invitation?.religion || 'islam',
    });

    const closingForm = useForm({
        closing_title: invitation?.closing_title || 'Terima Kasih',
        closing_text: invitation?.closing_text || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.\n\nAtas kehadiran dan doa restunya, kami mengucapkan terima kasih.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh",
        turut_mengundang_text: invitation?.turut_mengundang_text || '',
    });

    const handleOpeningSubmit = (e) => {
        e.preventDefault();
        openingForm.post(route('content.opening.save'));
    };

    const handleClosingSubmit = (e) => {
        e.preventDefault();
        closingForm.post(route('content.penutup.save'));
    };

    const filteredQuotes = quoteTemplates.filter(q => q.religion === selectedReligion);

    const handleReligionChange = (val) => {
        setSelectedReligion(val);
        openingForm.setData('religion', val);
    };

    const handleQuoteSelect = (quoteId) => {
        if (!quoteId) return;
        const q = quoteTemplates.find(t => t.id === parseInt(quoteId));
        if (q) {
            openingForm.setData(prev => ({
                ...prev,
                opening_ayat: q.ayat || '',
                opening_ayat_translation: q.translation || '',
                opening_ayat_source: q.source || '',
            }));
        }
    };

    const tabs = [
        { id: 'opening', label: 'Opening', desc: 'Salam Pembuka' },
        { id: 'penutup', label: 'Penutup', desc: 'Ucapan Penutup' },
    ];

    return (
        <DashboardLayout title="Teks & Sambutan">
            <Head title="Teks & Sambutan" />

            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
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
                            <span className="text-xl"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
                            <div>
                                <div className="font-medium text-blue-800 text-sm">Section Opening</div>
                                <div className="text-blue-600 text-xs mt-0.5">Bagian opening adalah sambutan atau salam pembuka undangan Anda. Biasanya berisi salam, ayat suci, atau kutipan.</div>
                            </div>
                        </div>

                        {/* Religion Selector */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Agama</label>
                            <p className="text-xs text-gray-400 mb-2">Pilih agama untuk menampilkan template ayat/kutipan yang sesuai</p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(religionLabels).map(([key, label]) => (
                                    <button key={key} type="button" onClick={() => handleReligionChange(key)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedReligion === key
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                                        {label}
                                    </button>
                                ))}
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

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Ayat / Kutipan</label>
                            <p className="text-xs text-gray-400">Opsional. Pilih dari template atau tulis sendiri.</p>

                            {/* Quote Template Selector */}
                            {filteredQuotes.length > 0 && (
                                <div>
                                    <label className="block text-xs font-medium text-emerald-700 mb-2">📖 Pilih Template Kutipan</label>
                                    <select onChange={(e) => handleQuoteSelect(e.target.value)} defaultValue=""
                                        className="w-full border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300">
                                        <option value="">— Pilih template untuk auto-fill —</option>
                                        {filteredQuotes.map(q => (
                                            <option key={q.id} value={q.id}>{q.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Field 1: Ayat / Kutipan */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{isIslam ? 'Teks Arab' : 'Kutipan'}</label>
                                <textarea value={openingForm.data.opening_ayat}
                                    onChange={(e) => openingForm.setData('opening_ayat', e.target.value)}
                                    placeholder={isIslam ? 'Teks ayat dalam bahasa Arab...' : 'Tulis kutipan di sini...'}
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none"
                                    dir={isIslam ? 'rtl' : 'auto'} />
                            </div>

                            {/* Field 2: Terjemah (Islam only) */}
                            {isIslam && (
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Terjemahan</label>
                                    <textarea value={openingForm.data.opening_ayat_translation}
                                        onChange={(e) => openingForm.setData('opening_ayat_translation', e.target.value)}
                                        placeholder="Terjemahan ayat dalam Bahasa Indonesia..."
                                        rows={3}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                                </div>
                            )}

                            {/* Field 3: Sumber */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Sumber / Keterangan</label>
                                <input type="text" value={openingForm.data.opening_ayat_source}
                                    onChange={(e) => openingForm.setData('opening_ayat_source', e.target.value)}
                                    placeholder={isIslam ? 'Contoh: QS. Ar-Rum: 21' : 'Contoh: Kejadian 2:24'}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4"><svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Preview</h4>
                            <div className="bg-gradient-to-b from-rose-50 to-white rounded-xl p-6 text-center space-y-3">
                                {openingForm.data.opening_ayat && (
                                    <p className={`leading-relaxed ${isIslam ? 'text-xl font-serif text-rose-400' : 'text-sm text-gray-600 italic'}`} dir={isIslam ? 'rtl' : 'auto'}>
                                        {isIslam ? openingForm.data.opening_ayat : `"${openingForm.data.opening_ayat}"`}
                                    </p>
                                )}
                                {openingForm.data.opening_ayat_translation && (
                                    <p className="text-sm text-gray-600 italic leading-relaxed">"{openingForm.data.opening_ayat_translation}"</p>
                                )}
                                {openingForm.data.opening_ayat_source && (
                                    <p className="text-xs font-medium text-gray-400">— {openingForm.data.opening_ayat_source}</p>
                                )}
                                <div className="pt-2" />
                                <h3 className="text-xl font-bold text-gray-800 font-serif">{openingForm.data.opening_title || 'Judul Opening'}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{openingForm.data.opening_text || 'Teks opening akan tampil di sini...'}</p>
                            </div>
                        </div>

                        <button type="submit" disabled={openingForm.processing}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {openingForm.processing ? 'Menyimpan...' : 'Simpan Opening'}
                        </button>
                    </form>
                )}

                {/* Penutup Tab */}
                {activeTab === 'penutup' && (
                    <form onSubmit={handleClosingSubmit} className="space-y-5">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <span className="text-xl"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
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

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Turut Mengundang</label>
                            <p className="text-xs text-gray-400 mb-3">Opsional. Tulis daftar keluarga/pihak yang turut mengundang, pisahkan dengan enter.</p>
                            <textarea value={closingForm.data.turut_mengundang_text}
                                onChange={(e) => closingForm.setData('turut_mengundang_text', e.target.value)}
                                placeholder={"Contoh:\nKeluarga Besar Bpk. H. Ahmad Suryanto\nKeluarga Besar Bpk. H. Bambang Wijaya"}
                                rows={4}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" />
                            {closingForm.errors.turut_mengundang_text && <p className="text-red-500 text-xs mt-1">{closingForm.errors.turut_mengundang_text}</p>}
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-sm font-semibold text-gray-500 mb-4"><svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Preview</h4>
                            <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 text-center space-y-4">
                                <h3 className="text-xl font-bold text-gray-800 font-serif">{closingForm.data.closing_title || 'Judul Penutup'}</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{closingForm.data.closing_text || 'Teks penutup akan tampil di sini...'}</p>
                                {closingForm.data.turut_mengundang_text && (
                                    <div className="pt-3 mt-3 border-t border-gray-200">
                                        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Turut Mengundang</p>
                                        <div className="space-y-0.5">
                                            {closingForm.data.turut_mengundang_text.split('\n').filter(l => l.trim()).map((line, i) => (
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

                        <button type="submit" disabled={closingForm.processing}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {closingForm.processing ? 'Menyimpan...' : 'Simpan Penutup'}
                        </button>
                    </form>
                )}
            </div>
        </DashboardLayout>
    );
}
