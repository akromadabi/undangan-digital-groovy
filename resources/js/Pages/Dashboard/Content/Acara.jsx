import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const defaultEvent = {
    event_type: 'akad', event_name: 'Akad Nikah', event_date: '',
    start_time: '', end_time: '', timezone: 'WIB',
    venue_name: '', venue_address: '', gmaps_link: '',
};

const eventIcons = { akad: '💍', pemberkatan: '⛪', resepsi: '🎉', lainnya: '📅' };

export default function Acara({ events }) {
    const { flash } = usePage().props;

    const initial = events?.length > 0 ? events : [
        { ...defaultEvent, event_type: 'akad', event_name: 'Akad Nikah' },
        { ...defaultEvent, event_type: 'resepsi', event_name: 'Resepsi' },
    ];

    const { data, setData, post, processing } = useForm({ events: initial });

    const updateEvent = (index, field, value) => {
        const updated = [...data.events];
        updated[index] = { ...updated[index], [field]: value };
        setData('events', updated);
    };

    const addEvent = () => {
        setData('events', [...data.events, { ...defaultEvent, event_type: 'lainnya', event_name: '' }]);
    };

    const removeEvent = (index) => {
        if (data.events.length <= 1) return;
        setData('events', data.events.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('content.acara.save'));
    };

    return (
        <DashboardLayout title="Acara">
            <Head title="Acara" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Data Acara</div>
                        <div className="text-blue-600 text-xs mt-0.5">Tambahkan acara pernikahan Anda. Anda bisa menambahkan Akad, Resepsi, Pemberkatan, atau acara lainnya.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {data.events.map((event, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span>{eventIcons[event.event_type] || '📅'}</span>
                                    {event.event_name || 'Acara Baru'}
                                </h3>
                                {data.events.length > 1 && (
                                    <button type="button" onClick={() => removeEvent(index)}
                                        className="text-red-400 hover:text-red-600 text-sm font-medium">✕ Hapus</button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Jenis Acara</label>
                                    <select value={event.event_type} onChange={(e) => updateEvent(index, 'event_type', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400">
                                        <option value="akad">💍 Akad Nikah</option>
                                        <option value="pemberkatan">⛪ Pemberkatan</option>
                                        <option value="resepsi">🎉 Resepsi</option>
                                        <option value="lainnya">📅 Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Acara *</label>
                                    <input type="text" value={event.event_name} onChange={(e) => updateEvent(index, 'event_name', e.target.value)}
                                        placeholder="Nama acara"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" required />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal *</label>
                                    <input type="date" value={event.event_date?.split('T')[0] || ''} onChange={(e) => updateEvent(index, 'event_date', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" required />
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Mulai *</label>
                                        <input type="time" value={event.start_time} onChange={(e) => updateEvent(index, 'start_time', e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" required />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Selesai</label>
                                        {event.end_time === 'Selesai' ? (
                                            <div className="w-full border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium">
                                                Selesai
                                            </div>
                                        ) : (
                                            <input type="time" value={event.end_time || ''} onChange={(e) => updateEvent(index, 'end_time', e.target.value)}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                                        )}
                                        <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                                            <input type="checkbox"
                                                checked={event.end_time === 'Selesai'}
                                                onChange={(e) => updateEvent(index, 'end_time', e.target.checked ? 'Selesai' : '')}
                                                className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400" />
                                            <span className="text-xs text-gray-500">Sampai selesai</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Zona Waktu</label>
                                    <select value={event.timezone} onChange={(e) => updateEvent(index, 'timezone', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400">
                                        <option value="WIB">WIB (GMT+7)</option>
                                        <option value="WITA">WITA (GMT+8)</option>
                                        <option value="WIT">WIT (GMT+9)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Tempat</label>
                                    <input type="text" value={event.venue_name || ''} onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                                        placeholder="Nama gedung / tempat"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Alamat Lengkap</label>
                                <textarea value={event.venue_address || ''} onChange={(e) => updateEvent(index, 'venue_address', e.target.value)}
                                    placeholder="Jl. ..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 resize-none" rows={2} />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">🗺️ Link Google Maps</label>
                                <input type="url" value={event.gmaps_link || ''} onChange={(e) => updateEvent(index, 'gmaps_link', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={addEvent}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors text-sm font-medium">
                        + Tambah Acara Baru
                    </button>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Acara'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
