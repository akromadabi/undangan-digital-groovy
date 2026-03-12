import { Head, useForm } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';

const defaultEvent = {
    event_type: 'akad', event_name: 'Akad Nikah', event_date: '',
    start_time: '', end_time: '', timezone: 'WIB',
    venue_name: '', venue_address: '', gmaps_link: '',
    is_primary: false,
};

export default function Events({ step, events }) {
    const initial = events?.length > 0 ? events.map((e, i) => ({
        ...e,
        is_primary: e.is_primary ?? (i === 0),
        streamings: e.streamings?.length > 0
            ? e.streamings
            : (e.streaming_platform ? [{ platform: e.streaming_platform, url: e.streaming_url || '' }] : []),
    })) : [
        { ...defaultEvent, event_type: 'akad', event_name: 'Akad Nikah', is_primary: true, streamings: [] },
        { ...defaultEvent, event_type: 'resepsi', event_name: 'Resepsi', streamings: [] },
    ];

    const { data, setData, post, processing } = useForm({ events: initial });

    const updateEvent = (index, field, value) => {
        const updated = [...data.events];
        updated[index] = { ...updated[index], [field]: value };
        setData('events', updated);
    };

    const setPrimary = (index) => {
        const updated = data.events.map((e, i) => ({ ...e, is_primary: i === index }));
        setData('events', updated);
    };

    const addEvent = () => {
        setData('events', [...data.events, { ...defaultEvent, event_type: 'lainnya', event_name: '' }]);
    };

    const removeEvent = (index) => {
        if (data.events.length <= 1) return;
        const updated = data.events.filter((_, i) => i !== index);
        // If removed event was primary, make first remaining event primary
        if (data.events[index].is_primary && updated.length > 0) {
            updated[0] = { ...updated[0], is_primary: true };
        }
        setData('events', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('wizard.events.save'));
    };

    return (
        <WizardLayout currentStep={step} title="Data Acara">
            <form onSubmit={handleSubmit} className="space-y-4">
                {data.events.map((event, index) => (
                    <div key={index} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${event.is_primary ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                {event.event_type === 'akad' ? 'Akad Nikah' :
                                    event.event_type === 'resepsi' ? 'Resepsi' :
                                        event.event_type === 'pemberkatan' ? 'Pemberkatan' : 'Acara'}
                            </h3>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setPrimary(index)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${event.is_primary ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300' : 'bg-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                                    ⭐ {event.is_primary ? 'Acara Utama' : 'Jadikan Utama'}
                                </button>
                                {data.events.length > 1 && (
                                    <button type="button" onClick={() => removeEvent(index)} className="text-red-400 hover:text-red-600 text-sm">
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Jenis Acara</label>
                                <select value={event.event_type} onChange={(e) => updateEvent(index, 'event_type', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300">
                                    <option value="akad">Akad Nikah</option>
                                    <option value="pemberkatan">Pemberkatan</option>
                                    <option value="resepsi">Resepsi</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Acara</label>
                                <input type="text" value={event.event_name} onChange={(e) => updateEvent(index, 'event_name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal</label>
                                <input type="date" value={event.event_date} onChange={(e) => updateEvent(index, 'event_date', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" required />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Jam Mulai</label>
                                    <input type="time" value={event.start_time} onChange={(e) => updateEvent(index, 'start_time', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Jam Selesai</label>
                                    {event.end_time === 'Selesai' ? (
                                        <div className="w-full border border-emerald-200 bg-emerald-50 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-medium">
                                            Selesai
                                        </div>
                                    ) : (
                                        <input type="time" value={event.end_time || ''} onChange={(e) => updateEvent(index, 'end_time', e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
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
                                <label className="block text-sm font-medium text-gray-600 mb-1">Zona Waktu</label>
                                <select value={event.timezone} onChange={(e) => updateEvent(index, 'timezone', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300">
                                    <option value="WIB">WIB</option>
                                    <option value="WITA">WITA</option>
                                    <option value="WIT">WIT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Tempat</label>
                                <input type="text" value={event.venue_name || ''} onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                            <textarea value={event.venue_address || ''} onChange={(e) => updateEvent(index, 'venue_address', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300 resize-none" rows={2} />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Link Google Maps</label>
                            <input type="url" value={event.gmaps_link || ''} onChange={(e) => updateEvent(index, 'gmaps_link', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                        </div>

                        {/* Live Streaming - Multiple */}
                        {(event.streamings?.length > 0) ? (
                            <div className="mt-4 space-y-3">
                                {event.streamings.map((stream, si) => (
                                    <div key={si} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                <span className="font-semibold text-emerald-800 text-sm">Live Streaming {event.streamings.length > 1 ? `#${si + 1}` : ''}</span>
                                            </div>
                                            <button type="button" onClick={() => {
                                                const updated = [...data.events];
                                                const streams = [...updated[index].streamings];
                                                streams.splice(si, 1);
                                                updated[index] = { ...updated[index], streamings: streams };
                                                setData('events', updated);
                                            }} className="text-gray-400 hover:text-red-500 text-xs font-medium">Hapus</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-emerald-700 mb-1">Platform</label>
                                                <select value={stream.platform} onChange={(e) => {
                                                    const updated = [...data.events];
                                                    const streams = [...updated[index].streamings];
                                                    streams[si] = { ...streams[si], platform: e.target.value };
                                                    updated[index] = { ...updated[index], streamings: streams };
                                                    setData('events', updated);
                                                }} className="w-full border border-emerald-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300">
                                                    <option value="youtube">YouTube</option>
                                                    <option value="instagram">Instagram</option>
                                                    <option value="tiktok">TikTok</option>
                                                    <option value="zoom">Zoom</option>
                                                    <option value="lainnya">Lainnya</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-emerald-700 mb-1">Link Streaming</label>
                                                <input type="url" value={stream.url || ''} onChange={(e) => {
                                                    const updated = [...data.events];
                                                    const streams = [...updated[index].streamings];
                                                    streams[si] = { ...streams[si], url: e.target.value };
                                                    updated[index] = { ...updated[index], streamings: streams };
                                                    setData('events', updated);
                                                }} placeholder="https://..."
                                                    className="w-full border border-emerald-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => {
                                    const updated = [...data.events];
                                    updated[index] = { ...updated[index], streamings: [...(updated[index].streamings || []), { platform: 'youtube', url: '' }] };
                                    setData('events', updated);
                                }} className="w-full py-2 border-2 border-dashed border-emerald-300 rounded-xl text-emerald-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors text-xs font-medium flex items-center justify-center gap-1">
                                    + Tambah Streaming Lainnya
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => {
                                const updated = [...data.events];
                                updated[index] = { ...updated[index], streamings: [{ platform: 'youtube', url: '' }] };
                                setData('events', updated);
                            }}
                                className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                + Tambah Live Streaming
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addEvent}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors text-sm font-medium">
                    + Tambah Acara
                </button>

                <button type="submit" disabled={processing}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                    Lanjutkan →
                </button>
            </form>
        </WizardLayout>
    );
}
