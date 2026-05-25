import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const defaultEvent = {
    event_type: 'akad', event_name: 'Akad Nikah', event_date: '',
    start_time: '', end_time: '', timezone: 'WIB',
    venue_name: '', venue_address: '', gmaps_link: '',
    is_primary: false,
};

const eventIcons = { akad: 'Akad', pemberkatan: 'Pemberkatan', resepsi: 'Resepsi', lainnya: 'Acara' };

export default function Acara({ events }) {
    const { flash } = usePage().props;

    const initial = events?.length > 0 ? events.map((e, i) => ({
        ...e,
        is_primary: e.is_primary ?? (i === 0),
        // Convert old single streaming fields to new array format
        streamings: e.streamings?.length > 0
            ? e.streamings
            : (e.streaming_platform ? [{ platform: e.streaming_platform, url: e.streaming_url || '' }] : []),
    })) : [
        { ...defaultEvent, event_type: 'akad', event_name: 'Akad Nikah', is_primary: true, streamings: [] },
        { ...defaultEvent, event_type: 'resepsi', event_name: 'Resepsi', streamings: [] },
    ];

    const { data, setData, post, processing, errors } = useForm({ events: initial });

    const updateEvent = (index, field, value) => {
        const updated = [...data.events];
        updated[index] = { ...updated[index], [field]: value };
        setData('events', updated);
    };

    const setPrimary = (index) => {
        const updated = data.events.map((e, i) => ({ ...e, is_primary: i === index }));
        setData('events', updated);
    };

    const primaryIndex = data.events.findIndex(e => e.is_primary);

    const addEvent = () => {
        setData('events', [...data.events, { ...defaultEvent, event_type: 'lainnya', event_name: '' }]);
    };

    const removeEvent = (index) => {
        if (data.events.length <= 1) return;
        const updated = data.events.filter((_, i) => i !== index);
        if (data.events[index].is_primary && updated.length > 0) {
            updated[0] = { ...updated[0], is_primary: true };
        }
        setData('events', updated);
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
                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-[#E5654B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 shadow-sm">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <div className="font-semibold text-red-800">Gagal menyimpan data acara. Silakan periksa kembali:</div>
                            <ul className="list-disc list-inside text-xs mt-1 text-red-600 space-y-0.5">
                                {Object.entries(errors).map(([key, val]) => (
                                    <li key={key}>{val}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg></span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Data Acara</div>
                        <div className="text-blue-600 text-xs mt-0.5">Tambahkan acara pernikahan Anda. Anda bisa menambahkan Akad, Resepsi, Pemberkatan, atau acara lainnya.</div>
                    </div>
                </div>

                {/* Acara Utama Selector */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⭐</span>
                        <div className="font-semibold text-amber-800 text-sm">Acara Utama</div>
                    </div>
                    <p className="text-amber-600 text-xs mb-3">Pilih acara yang dijadikan referensi untuk countdown dan Save The Date di undangan.</p>
                    <select
                        value={primaryIndex >= 0 ? primaryIndex : 0}
                        onChange={(e) => setPrimary(parseInt(e.target.value))}
                        className="w-full border border-amber-300 bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-amber-900 focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                    >
                        {data.events.map((event, i) => (
                            <option key={i} value={i}>
                                {eventIcons[event.event_type] || ''} {event.event_name || `Acara ${i + 1}`}
                            </option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {data.events.map((event, index) => (
                        <div key={index} className={`bg-white rounded-2xl border p-6 transition-all ${event.is_primary ? 'border-amber-300 ring-2 ring-amber-100' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span>{eventIcons[event.event_type] || ''}</span>
                                    {event.event_name || 'Acara Baru'}
                                    {event.is_primary && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Utama</span>}
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
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#e87058]">
                                        <option value="akad">Akad Nikah</option>
                                        <option value="pemberkatan">Pemberkatan</option>
                                        <option value="resepsi">Resepsi</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Acara *</label>
                                    <input type="text" value={event.event_name} onChange={(e) => updateEvent(index, 'event_name', e.target.value)}
                                        placeholder="Nama acara"
                                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.event_name`] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} required />
                                    {errors[`events.${index}.event_name`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.event_name`]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Tanggal *</label>
                                    <input type="date" value={event.event_date?.split('T')[0] || ''} onChange={(e) => updateEvent(index, 'event_date', e.target.value)}
                                        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.event_date`] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} required />
                                    {errors[`events.${index}.event_date`] && (
                                        <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.event_date`]}</p>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Mulai *</label>
                                        <input type="time" value={event.start_time} onChange={(e) => updateEvent(index, 'start_time', e.target.value)}
                                            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.start_time`] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} required />
                                        {errors[`events.${index}.start_time`] && (
                                            <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.start_time`]}</p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Selesai</label>
                                        {event.end_time === 'Selesai' ? (
                                            <div className="w-full border border-orange-200 bg-orange-50 rounded-xl px-4 py-2.5 text-sm text-[#b03a24] font-medium">
                                                Selesai
                                            </div>
                                        ) : (
                                            <input type="time" value={event.end_time || ''} onChange={(e) => updateEvent(index, 'end_time', e.target.value)}
                                                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.end_time`] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} />
                                        )}
                                        {errors[`events.${index}.end_time`] && (
                                            <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.end_time`]}</p>
                                        )}
                                        <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                                            <input type="checkbox"
                                                checked={event.end_time === 'Selesai'}
                                                onChange={(e) => updateEvent(index, 'end_time', e.target.checked ? 'Selesai' : '')}
                                                className="w-3.5 h-3.5 rounded border-gray-300 text-[#E5654B] focus:ring-[#e87058]" />
                                            <span className="text-xs text-gray-500">Sampai selesai</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Zona Waktu</label>
                                    <select value={event.timezone} onChange={(e) => updateEvent(index, 'timezone', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#e87058]">
                                        <option value="WIB">WIB (GMT+7)</option>
                                        <option value="WITA">WITA (GMT+8)</option>
                                        <option value="WIT">WIT (GMT+9)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Tempat</label>
                                    <input type="text" value={event.venue_name || ''} onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                                        placeholder="Nama gedung / tempat"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#e87058]" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Alamat Lengkap</label>
                                <textarea value={event.venue_address || ''} onChange={(e) => updateEvent(index, 'venue_address', e.target.value)}
                                    placeholder="Jl. ..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 focus:border-[#e87058] resize-none" rows={2} />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    <svg className="w-4 h-4 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                    Link Google Maps
                                </label>
                                <input type="url" value={event.gmaps_link || ''} onChange={(e) => updateEvent(index, 'gmaps_link', e.target.value)}
                                    placeholder="https://maps.google.com/..."
                                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.gmaps_link`] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : 'border-gray-200 focus:ring-orange-300 focus:border-[#e87058]'}`} />
                                {errors[`events.${index}.gmaps_link`] && (
                                    <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.gmaps_link`]}</p>
                                )}
                            </div>

                            {/* Live Streaming - Multiple */}
                            {(event.streamings?.length > 0) ? (
                                <div className="mt-4 space-y-3">
                                    {event.streamings.map((stream, si) => (
                                        <div key={si} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-[#c24b33]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                    <span className="font-semibold text-[#962c19] text-sm">Live Streaming {event.streamings.length > 1 ? `#${si + 1}` : ''}</span>
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
                                                    <label className="block text-xs font-medium text-[#b03a24] mb-1">Platform</label>
                                                    <select value={String(stream.platform || 'youtube').toLowerCase()} onChange={(e) => {
                                                        const updated = [...data.events];
                                                        const streams = [...updated[index].streamings];
                                                        streams[si] = { ...streams[si], platform: e.target.value.toLowerCase() };
                                                        updated[index] = { ...updated[index], streamings: streams };
                                                        setData('events', updated);
                                                    }} className="w-full border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300">
                                                        <option value="youtube">YouTube</option>
                                                        <option value="instagram">Instagram</option>
                                                        <option value="tiktok">TikTok</option>
                                                        <option value="zoom">Zoom</option>
                                                        <option value="lainnya">Lainnya</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-[#b03a24] mb-1">Link Streaming</label>
                                                    <input type="url" value={stream.url || ''} onChange={(e) => {
                                                        const updated = [...data.events];
                                                        const streams = [...updated[index].streamings];
                                                        streams[si] = { ...streams[si], url: e.target.value };
                                                        updated[index] = { ...updated[index], streamings: streams };
                                                        setData('events', updated);
                                                    }} placeholder="https://..."
                                                        className={`w-full border bg-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 ${errors[`events.${index}.streamings.${si}.url`] ? 'border-red-300 focus:ring-red-300' : 'border-orange-200 focus:ring-orange-300'}`} />
                                                    {errors[`events.${index}.streamings.${si}.url`] && (
                                                        <p className="text-xs text-red-500 mt-1">{errors[`events.${index}.streamings.${si}.url`]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => {
                                        const updated = [...data.events];
                                        updated[index] = { ...updated[index], streamings: [...(updated[index].streamings || []), { platform: 'youtube', url: '' }] };
                                        setData('events', updated);
                                    }} className="w-full py-2 border-2 border-dashed border-orange-300 rounded-xl text-[#e87058] hover:border-[#E5654B] hover:text-[#c24b33] transition-colors text-xs font-medium flex items-center justify-center gap-1">
                                        + Tambah Streaming Lainnya
                                    </button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => {
                                    const updated = [...data.events];
                                    updated[index] = { ...updated[index], streamings: [{ platform: 'youtube', url: '' }] };
                                    setData('events', updated);
                                }}
                                    className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-[#e87058] hover:text-[#E5654B] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    + Tambah Live Streaming
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addEvent}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-[#e87058] hover:text-[#E5654B] transition-colors text-sm font-medium">
                        + Tambah Acara Baru
                    </button>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Acara'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
