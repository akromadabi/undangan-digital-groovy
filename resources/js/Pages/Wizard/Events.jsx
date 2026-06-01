import { Head, useForm, router } from '@inertiajs/react';
import WizardLayout from '@/Layouts/WizardLayout';

const defaultEvent = {
    event_type: 'akad', event_name: 'Akad Nikah', event_date: '',
    start_time: '', end_time: '', timezone: 'WIB',
    venue_name: '', venue_address: '', gmaps_link: '',
    is_primary: false,
    show_dress_code: false,
    dress_code_text: '',
    dress_code_colors: [],
};

const getDefaultsForType = (type) => {
    if (type === 'birthday') {
        return [
            { ...defaultEvent, event_type: 'ultah', event_name: 'Perayaan Ulang Tahun', is_primary: true, streamings: [] }
        ];
    }
    if (type === 'graduation') {
        return [
            { ...defaultEvent, event_type: 'syukuran', event_name: 'Syukuran Wisuda', is_primary: true, streamings: [] }
        ];
    }
    if (type === 'aqiqah') {
        return [
            { ...defaultEvent, event_type: 'aqiqah', event_name: 'Acara Aqiqah', is_primary: true, streamings: [] }
        ];
    }
    if (type === 'circumcision') {
        return [
            { ...defaultEvent, event_type: 'khitanan', event_name: 'Acara Khitanan', is_primary: true, streamings: [] }
        ];
    }
    if (type === 'anniversary') {
        return [
            { ...defaultEvent, event_type: 'syukuran', event_name: 'Acara Anniversary / Syukuran', is_primary: true, streamings: [] }
        ];
    }
    // Default wedding
    return [
        { ...defaultEvent, event_type: 'akad', event_name: 'Akad Nikah', is_primary: true, streamings: [] },
        { ...defaultEvent, event_type: 'resepsi', event_name: 'Resepsi', streamings: [] },
    ];
};

export default function Events({ step, events, eventType = 'wedding' }) {
    const initial = events?.length > 0 ? events.map((e, i) => ({
        ...e,
        is_primary: e.is_primary ?? (i === 0),
        show_dress_code: e.show_dress_code ?? false,
        dress_code_text: e.dress_code_text || '',
        dress_code_colors: e.dress_code_colors || [],
        streamings: e.streamings?.length > 0
            ? e.streamings
            : (e.streaming_platform ? [{ platform: e.streaming_platform, url: e.streaming_url || '' }] : []),
    })) : getDefaultsForType(eventType);

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
        let typeVal = 'lainnya';
        let nameVal = '';
        if (eventType === 'birthday') {
            typeVal = 'ultah';
            nameVal = 'Acara Tambahan';
        } else if (eventType === 'graduation') {
            typeVal = 'syukuran';
            nameVal = 'Acara Tambahan';
        }
        setData('events', [...data.events, { ...defaultEvent, event_type: typeVal, event_name: nameVal, streamings: [] }]);
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
        post(route('wizard.events.save', undefined, false));
    };

    const getEventLabel = (event) => {
        if (event.event_type === 'akad') return 'Akad Nikah';
        if (event.event_type === 'resepsi') return 'Resepsi';
        if (event.event_type === 'pemberkatan') return 'Pemberkatan';
        if (event.event_type === 'ultah') return 'Ulang Tahun';
        if (event.event_type === 'syukuran') return 'Syukuran';
        if (event.event_type === 'aqiqah') return 'Aqiqah';
        if (event.event_type === 'khitanan') return 'Khitanan';
        return 'Acara';
    };

    return (
        <WizardLayout currentStep={step} title="Data Acara">
            <form onSubmit={handleSubmit} className="space-y-4">
                {data.events.map((event, index) => (
                    <div key={index} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${event.is_primary ? 'border-orange-400 ring-2 ring-orange-100' : 'border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                {getEventLabel(event)}
                            </h3>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setPrimary(index)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${event.is_primary ? 'bg-orange-100 text-[#b03a24] ring-1 ring-orange-300' : 'bg-gray-100 text-gray-400 hover:bg-orange-50 hover:text-[#E5654B]'}`}>
                                    {event.is_primary ? 'Acara Utama' : 'Jadikan Utama'}
                                </button>
                                {data.events.length > 1 && (
                                    <button type="button" onClick={() => removeEvent(index)} className="text-red-400 hover:text-red-600 text-sm font-semibold">
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
 
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Jenis Acara</label>
                                <select value={event.event_type} onChange={(e) => updateEvent(index, 'event_type', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300">
                                    {['wedding', 'anniversary'].includes(eventType) ? (
                                        <>
                                            <option value="akad">Akad Nikah</option>
                                            <option value="pemberkatan">Pemberkatan</option>
                                            <option value="resepsi">Resepsi</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    ) : eventType === 'birthday' ? (
                                        <>
                                            <option value="ultah">Ulang Tahun</option>
                                            <option value="syukuran">Syukuran</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    ) : eventType === 'graduation' ? (
                                        <>
                                            <option value="syukuran">Syukuran Wisuda</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    ) : eventType === 'aqiqah' ? (
                                        <>
                                            <option value="aqiqah">Aqiqah</option>
                                            <option value="syukuran">Syukuran</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    ) : eventType === 'circumcision' ? (
                                        <>
                                            <option value="khitanan">Khitanan</option>
                                            <option value="syukuran">Syukuran</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="syukuran">Syukuran</option>
                                            <option value="lainnya">Lainnya</option>
                                        </>
                                    )}
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
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" required />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Jam Mulai</label>
                                    <input type="time" value={event.start_time} onChange={(e) => updateEvent(index, 'start_time', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Jam Selesai</label>
                                    {event.end_time === 'Selesai' ? (
                                        <div className="w-full border border-orange-200 bg-orange-50 rounded-xl px-4 py-2.5 text-sm text-[#b03a24] font-medium">
                                            Selesai
                                        </div>
                                    ) : (
                                        <input type="time" value={event.end_time || ''} onChange={(e) => updateEvent(index, 'end_time', e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" />
                                    )}
                                    <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                                        <input type="checkbox"
                                            checked={event.end_time === 'Selesai'}
                                            onChange={(e) => updateEvent(index, 'end_time', e.target.checked ? 'Selesai' : '')}
                                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#E5654B] focus:ring-orange-400" />
                                        <span className="text-xs text-gray-500">Sampai selesai</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Zona Waktu</label>
                                <select value={event.timezone} onChange={(e) => updateEvent(index, 'timezone', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300">
                                    <option value="WIB">WIB</option>
                                    <option value="WITA">WITA</option>
                                    <option value="WIT">WIT</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Tempat</label>
                                <input type="text" value={event.venue_name || ''} onChange={(e) => updateEvent(index, 'venue_name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Alamat Lengkap</label>
                            <textarea value={event.venue_address || ''} onChange={(e) => updateEvent(index, 'venue_address', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300 resize-none" rows={2} />
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Link Google Maps</label>
                            <input type="url" value={event.gmaps_link || ''} onChange={(e) => updateEvent(index, 'gmaps_link', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" />
                        </div>

                        {/* Live Streaming - Multiple */}
                        {(event.streamings?.length > 0) ? (
                            <div className="mt-4 space-y-3">
                                {event.streamings.map((stream, si) => (
                                    <div key={si} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#E5654B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                <span className="font-semibold text-[#b03a24] text-sm font-outfit">Live Streaming {event.streamings.length > 1 ? `#${si + 1}` : ''}</span>
                                            </div>
                                            <button type="button" onClick={() => {
                                                const updated = [...data.events];
                                                const streams = [...updated[index].streamings];
                                                streams.splice(si, 1);
                                                updated[index] = { ...updated[index], streamings: streams };
                                                setData('events', updated);
                                            }} className="text-gray-400 hover:text-red-500 text-xs font-semibold">Hapus</button>
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
                                                    className="w-full border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-300" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={() => {
                                    const updated = [...data.events];
                                    updated[index] = { ...updated[index], streamings: [...(updated[index].streamings || []), { platform: 'youtube', url: '' }] };
                                    setData('events', updated);
                                }} className="w-full py-2 border-2 border-dashed border-orange-300 rounded-xl text-orange-400 hover:border-orange-500 hover:text-[#E5654B] transition-colors text-xs font-semibold flex items-center justify-center gap-1">
                                    + Tambah Streaming Lainnya
                                </button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => {
                                const updated = [...data.events];
                                updated[index] = { ...updated[index], streamings: [{ platform: 'youtube', url: '' }] };
                                setData('events', updated);
                            }}
                                className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-orange-400 hover:text-[#E5654B] transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                + Tambah Live Streaming
                            </button>
                        )}

                        {/* Dress Code Section */}
                        {event.show_dress_code ? (
                            <div className="mt-4 p-4 border border-blue-100 bg-blue-50/10 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                        <h4 className="text-xs font-bold text-gray-700">Dress Code (Panduan Busana)</h4>
                                    </div>
                                    <button type="button" onClick={() => {
                                        const updated = [...data.events];
                                        updated[index] = { ...updated[index], show_dress_code: false, dress_code_text: '', dress_code_colors: [] };
                                        setData('events', updated);
                                    }} className="text-gray-400 hover:text-red-500 text-xs font-semibold">Hapus</button>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Petunjuk / Rekomendasi Dress Code</label>
                                    <textarea
                                        value={event.dress_code_text || ''}
                                        onChange={(e) => updateEvent(index, 'dress_code_text', e.target.value)}
                                        placeholder="Contoh: Tamu undangan disarankan mengenakan pakaian bernuansa pastel / bumi (earthy)."
                                        className="w-full border border-gray-200 bg-white rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-300 resize-none"
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-medium text-gray-500">Rekomendasi Palet Warna</label>
                                    
                                    {event.dress_code_colors?.map((group, gIdx) => (
                                        <div key={gIdx} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 max-w-[200px] sm:max-w-xs">
                                                    <input
                                                        type="text"
                                                        value={group.label || ''}
                                                        onChange={(e) => {
                                                            const updated = [...data.events];
                                                            const groups = [...updated[index].dress_code_colors];
                                                            groups[gIdx] = { ...groups[gIdx], label: e.target.value };
                                                            updated[index] = { ...updated[index], dress_code_colors: groups };
                                                            setData('events', updated);
                                                        }}
                                                        placeholder="Nama Palet (Contoh: Pria / Atasan)"
                                                        className="w-full border border-gray-250 bg-gray-50/50 rounded-lg px-2.5 py-1 text-xs font-bold focus:ring-2 focus:ring-blue-300"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...data.events];
                                                        const groups = [...updated[index].dress_code_colors];
                                                        groups.splice(gIdx, 1);
                                                        updated[index] = { ...updated[index], dress_code_colors: groups };
                                                        setData('events', updated);
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 text-xs font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                {group.colors?.map((color, cIdx) => (
                                                    <div key={cIdx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-150 rounded-full pl-1.5 pr-2 py-1 shadow-sm">
                                                        <input
                                                            type="color"
                                                            value={color}
                                                            onChange={(e) => {
                                                                const updated = [...data.events];
                                                                const groups = [...updated[index].dress_code_colors];
                                                                const colorsList = [...groups[gIdx].colors];
                                                                colorsList[cIdx] = e.target.value;
                                                                groups[gIdx] = { ...groups[gIdx], colors: colorsList };
                                                                updated[index] = { ...updated[index], dress_code_colors: groups };
                                                                setData('events', updated);
                                                            }}
                                                            className="w-5 h-5 rounded-full border-0 cursor-pointer overflow-hidden p-0 bg-transparent flex-shrink-0"
                                                        />
                                                        <span className="text-[9px] font-mono uppercase text-gray-500">
                                                            {color}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = [...data.events];
                                                                const groups = [...updated[index].dress_code_colors];
                                                                const colorsList = [...groups[gIdx].colors];
                                                                colorsList.splice(cIdx, 1);
                                                                groups[gIdx] = { ...groups[gIdx], colors: colorsList };
                                                                updated[index] = { ...updated[index], dress_code_colors: groups };
                                                                setData('events', updated);
                                                            }}
                                                            className="text-gray-400 hover:text-red-500 font-bold text-xs"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = [...data.events];
                                                        const groups = [...updated[index].dress_code_colors];
                                                        const colorsList = [...(groups[gIdx].colors || []), '#d1d5db'];
                                                        groups[gIdx] = { ...groups[gIdx], colors: colorsList };
                                                        updated[index] = { ...updated[index], dress_code_colors: groups };
                                                        setData('events', updated);
                                                    }}
                                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-dashed border-gray-300 bg-white text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-xs font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = [...data.events];
                                            const groups = [...(updated[index].dress_code_colors || []), { label: 'Dress Code', colors: ['#ffffff'] }];
                                            updated[index] = { ...updated[index], dress_code_colors: groups };
                                            setData('events', updated);
                                        }}
                                        className="w-full py-2 border border-dashed border-blue-200 bg-white hover:bg-blue-50/10 text-blue-500 hover:border-blue-400 rounded-xl transition-colors text-xs font-medium flex items-center justify-center gap-1 shadow-sm"
                                    >
                                        + Tambah Palet Warna Baru
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button type="button" onClick={() => {
                                const updated = [...data.events];
                                updated[index] = { 
                                    ...updated[index], 
                                    show_dress_code: true, 
                                    dress_code_colors: [{ label: 'Pria/Wanita', colors: ['#a3563f', '#e87058'] }] 
                                };
                                setData('events', updated);
                            }}
                                className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-blue-400 hover:text-[#E5654B] transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                + Tambah Dress Code (Panduan Busana)
                            </button>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addEvent}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 hover:border-orange-400 hover:text-[#E5654B] transition-colors text-sm font-bold shadow-xs">
                    + Tambah Acara
                </button>

                <div className="flex gap-4 mt-6">
                    <button type="button" onClick={() => router.visit(route('wizard.profile', undefined, false))}
                        className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all text-center">
                        ← Kembali
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-[2] py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                        Lanjutkan →
                    </button>
                </div>
            </form>
        </WizardLayout>
    );
}
