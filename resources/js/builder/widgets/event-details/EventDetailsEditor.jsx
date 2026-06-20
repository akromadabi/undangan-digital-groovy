import React from 'react';
import { Calendar, Database, Palette, Plus, Sliders, Trash } from 'lucide-react';

const PRESETS = {
    terracotta: {
        primaryColor: '#b35c3c',
        titleColor: '#3d302a',
        textColor: '#5c4c43',
        cardBg: '#f5ebe0',
        buttonBg: '#b35c3c',
        buttonTextColor: '#ffffff',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat',
        borderRadius: '16px'
    },
    sage: {
        primaryColor: '#8a9a86',
        titleColor: '#2f3e2d',
        textColor: '#4a5548',
        cardBg: '#f4f6f3',
        buttonBg: '#8a9a86',
        buttonTextColor: '#ffffff',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter',
        borderRadius: '12px'
    },
    luxury: {
        primaryColor: '#c5a880',
        titleColor: '#0d1e3d',
        textColor: '#3b4b66',
        cardBg: '#ffffff',
        buttonBg: '#c5a880',
        buttonTextColor: '#ffffff',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat',
        borderRadius: '4px'
    },
    romantic: {
        primaryColor: '#e8a7a1',
        titleColor: '#4a3e3d',
        textColor: '#7a6b6a',
        cardBg: '#fff9f8',
        buttonBg: '#e8a7a1',
        buttonTextColor: '#ffffff',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit',
        borderRadius: '24px'
    },
    retro: {
        primaryColor: '#d97706',
        titleColor: '#18181b',
        textColor: '#4b5563',
        cardBg: '#fafaf9',
        buttonBg: '#18181b',
        buttonTextColor: '#fafaf9',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat',
        borderRadius: '30px'
    }
};

export default function EventDetailsEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    const sourceType = settings.sourceType || 'static';
    const layoutModel = settings.layoutModel || 'grid';

    const events = settings.events || [
        { id: '1', name: 'Akad Nikah', date: 'Kamis, 31 Desember 2026', time: '08:00 - 10:00 WIB', venueName: 'Masjid Agung Al-Hikmah', address: 'Jl. Raya Kebayoran Lama No. 12, Jakarta Selatan', mapUrl: 'https://maps.google.com' },
        { id: '2', name: 'Resepsi Pernikahan', date: 'Kamis, 31 Desember 2026', time: '11:00 - 16:00 WIB', venueName: 'Gedung Serbaguna Jakarta', address: 'Jl. Jenderal Sudirman Kav. 21, Jakarta Pusat', mapUrl: 'https://maps.google.com' }
    ];

    const handleAddEvent = () => {
        const newEvent = {
            id: Date.now().toString(),
            name: 'Acara Baru',
            date: 'Tanggal Acara',
            time: '08:00 - Selesai',
            venueName: 'Nama Tempat',
            address: 'Alamat lengkap lokasi...',
            mapUrl: ''
        };
        handleUpdate('events', [...events, newEvent]);
    };

    const handleUpdateEvent = (index, field, value) => {
        const updated = [...events];
        updated[index] = { ...updated[index], [field]: value };
        handleUpdate('events', updated);
    };

    const handleRemoveEvent = (index) => {
        const updated = events.filter((_, idx) => idx !== index);
        handleUpdate('events', updated);
    };

    if (mode === 'content') {
        return (
            <div className="space-y-6">
                {/* Source Type Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-gray-400" /> Sumber Data
                    </label>
                    <select
                        value={sourceType}
                        onChange={(e) => handleUpdate('sourceType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="static">Statis (Isi Manual di Sini)</option>
                        <option value="dynamic">Dinamis (Mengikuti Acara User)</option>
                    </select>
                </div>

                <hr className="border-gray-100" />

                {/* EVENTS LIST (STATIC) OR DYNAMIC NOTICE */}
                {sourceType === 'static' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> Daftar Acara
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddEvent}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {events.map((evt, idx) => (
                                <div key={evt.id || idx} className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 font-mono">ACARA #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEvent(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Hapus Acara"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Acara</label>
                                            <input
                                                type="text"
                                                value={evt.name}
                                                onChange={(e) => handleUpdateEvent(idx, 'name', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-bold"
                                                placeholder="e.g. Akad Nikah"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Tanggal</label>
                                                <input
                                                    type="text"
                                                    value={evt.date}
                                                    onChange={(e) => handleUpdateEvent(idx, 'date', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                    placeholder="e.g. 31 Des 2026"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Waktu / Jam</label>
                                                <input
                                                    type="text"
                                                    value={evt.time}
                                                    onChange={(e) => handleUpdateEvent(idx, 'time', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                    placeholder="e.g. 08:00 - Selesai"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Tempat Venue</label>
                                            <input
                                                type="text"
                                                value={evt.venueName || ''}
                                                onChange={(e) => handleUpdateEvent(idx, 'venueName', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                placeholder="e.g. Gedung Serbaguna"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Alamat Lengkap</label>
                                            <input
                                                type="text"
                                                value={evt.address || ''}
                                                onChange={(e) => handleUpdateEvent(idx, 'address', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                placeholder="Jl. Raya..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Link Google Maps</label>
                                            <input
                                                type="text"
                                                value={evt.mapUrl || ''}
                                                onChange={(e) => handleUpdateEvent(idx, 'mapUrl', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-mono"
                                                placeholder="https://maps.google.com/..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
                            <Database className="w-4 h-4 shrink-0" />
                            <span>Mode Data Dinamis Aktif</span>
                        </div>
                        <p className="text-[11px] text-indigo-600 leading-relaxed">
                            Data rangkaian acara akan diambil otomatis dari modul <strong>Daftar Acara</strong> yang diisi oleh pengguna di dashboard mereka.
                        </p>
                        <p className="text-[10px] text-gray-400 italic">
                            *Di editor pratinjau, kami tetap menampilkan data contoh visual agar Anda dapat mendesain tata letaknya dengan mudah.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* GENERAL SETTINGS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Model Layout
                </h3>

                {/* Layout Model */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Model Layout (Template)</label>
                    <select
                        value={layoutModel}
                        onChange={(e) => handleUpdate('layoutModel', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="grid">Grid (Dua Kolom)</option>
                        <option value="stack">Stack (Tumpuk Vertikal)</option>
                        <option value="tabs">Interactive Tabs (Tab Geser)</option>
                    </select>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* STYLING & COLORS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Desain & Warna
                </h3>

                {/* Preset Style Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Preset Gaya Cepat (Tema)</label>
                    <select
                        value=""
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val && PRESETS[val]) {
                                onChange({
                                    ...settings,
                                    ...PRESETS[val]
                                });
                            }
                        }}
                        className="w-full text-xs border-indigo-200 rounded-lg p-2 bg-indigo-50/50 text-indigo-700 font-semibold focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Terapkan Gaya Preset Tema --</option>
                        <option value="terracotta">Terracotta Minimalist</option>
                        <option value="sage">Sage Minimalist</option>
                        <option value="luxury">Luxury Gold & Navy</option>
                        <option value="romantic">Romantic Blush Pink</option>
                        <option value="retro">Modern Retro (Vinyl)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Aksen / Ikon</label>
                        <input
                            type="color"
                            value={settings.primaryColor || '#E5654B'}
                            onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Judul Acara</label>
                        <input
                            type="color"
                            value={settings.titleColor || '#1f2937'}
                            onChange={(e) => handleUpdate('titleColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Detail</label>
                        <input
                            type="color"
                            value={settings.textColor || '#4b5563'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Kartu Acara</label>
                        <input
                            type="color"
                            value={settings.cardBg || '#ffffff'}
                            onChange={(e) => handleUpdate('cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Tombol Peta</label>
                        <input
                            type="color"
                            value={settings.buttonBg || '#E5654B'}
                            onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Tombol</label>
                        <input
                            type="color"
                            value={settings.buttonTextColor || '#ffffff'}
                            onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul / Nama Acara</label>
                    <select
                        value={settings.titleFontFamily || 'default'}
                        onChange={(e) => handleUpdate('titleFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    >
                        <option value="default">Default Tema</option>
                        <option value="Playfair Display">Playfair Display (Serif Elegan)</option>
                        <option value="Cinzel">Cinzel (Klasik Premium)</option>
                        <option value="Great Vibes">Great Vibes (Kaligrafi Tradisional)</option>
                        <option value="Sacramento">Sacramento (Kaligrafi Minimalis)</option>
                        <option value="Inter">Inter (Sans-serif Bersih)</option>
                        <option value="Montserrat">Montserrat (Modern Geometris)</option>
                        <option value="Outfit">Outfit (Minimalis Premium)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Konten / Detail</label>
                    <select
                        value={settings.bodyFontFamily || 'default'}
                        onChange={(e) => handleUpdate('bodyFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    >
                        <option value="default">Default Tema</option>
                        <option value="Playfair Display">Playfair Display (Serif Elegan)</option>
                        <option value="Cinzel">Cinzel (Klasik Premium)</option>
                        <option value="Great Vibes">Great Vibes (Kaligrafi Tradisional)</option>
                        <option value="Sacramento">Sacramento (Kaligrafi Minimalis)</option>
                        <option value="Inter">Inter (Sans-serif Bersih)</option>
                        <option value="Montserrat">Montserrat (Modern Geometris)</option>
                        <option value="Outfit">Outfit (Minimalis Premium)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut Kartu</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '16px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 16px, 12px, 0px"
                    />
                </div>
            </div>
        </div>
    );
}
