import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function LivestreamEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    const handleUpdateResponsive = (key, value) => {
        const current = settings[key] && typeof settings[key] === 'object' 
            ? { ...settings[key] } 
            : { desktop: settings[key] || '' };
        current[activeBreakpoint] = value;
        onChange({ [key]: current });
    };

    const getResponsiveValue = (key, fallback = '') => {
        const val = settings[key];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    if (mode === 'content') {
        const sourceType = settings.sourceType || 'static';
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Live Streaming</h3>
                
                {/* Source Type Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Sumber Data</label>
                    <select
                        value={sourceType}
                        onChange={(e) => handleUpdate('sourceType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="static">Statis (Custom Input di sini)</option>
                        <option value="dynamic">Dinamis (Dari Data Undangan Klien)</option>
                    </select>
                </div>

                {sourceType === 'static' ? (
                    <>
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Judul</label>
                            <input
                                type="text"
                                value={settings.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. Siaran Langsung"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Deskripsi Singkat</label>
                            <textarea
                                value={settings.description || ''}
                                onChange={(e) => handleUpdate('description', e.target.value)}
                                rows={2}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="Saksikan prosesi pernikahan..."
                            />
                        </div>

                        {/* Platform */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Platform Siaran</label>
                            <select
                                value={settings.platform || 'youtube'}
                                onChange={(e) => handleUpdate('platform', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="youtube">YouTube Live</option>
                                <option value="zoom">Zoom Meeting</option>
                                <option value="meet">Google Meet</option>
                                <option value="instagram">Instagram Live</option>
                            </select>
                        </div>

                        {/* URL */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Link URL Streaming</label>
                            <input
                                type="text"
                                value={settings.url || ''}
                                onChange={(e) => handleUpdate('url', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2 font-mono text-xs"
                                placeholder="e.g. https://youtube.com/watch?v=..."
                            />
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Tanggal Acara</label>
                            <input
                                type="text"
                                value={settings.date || ''}
                                onChange={(e) => handleUpdate('date', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. Kamis, 31 Desember 2026"
                            />
                        </div>

                        {/* Time */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Waktu Acara</label>
                            <input
                                type="text"
                                value={settings.time || ''}
                                onChange={(e) => handleUpdate('time', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. 08:00 WIB - Selesai"
                            />
                        </div>

                        {/* Button Text */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Teks Tombol Nonton</label>
                            <input
                                type="text"
                                value={settings.buttonText || ''}
                                onChange={(e) => handleUpdate('buttonText', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. Nonton Live Streaming"
                            />
                        </div>
                    </>
                ) : (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-800 text-[10px] leading-relaxed">
                        Data link streaming, platform, tanggal, dan waktu siaran langsung akan diambil secara dinamis dari data utama acara/undangan klien.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ALIGNMENT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Perataan</h3>
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Penjajaran Konten</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="flex bg-gray-100 p-0.5 rounded-lg max-w-xs">
                        {[
                            { value: 'left', Icon: AlignLeft },
                            { value: 'center', Icon: AlignCenter },
                            { value: 'right', Icon: AlignRight }
                        ].map((item) => {
                            const currentValue = getResponsiveValue('alignment', 'center');
                            const active = currentValue === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleUpdateResponsive('alignment', item.value)}
                                    className={`flex-1 flex justify-center py-1.5 rounded-md transition-all ${
                                        active 
                                            ? 'bg-white text-indigo-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <item.Icon className="w-4 h-4" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* STYLE & DESIGN */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Warna & Desain</h3>

                {/* Button Colors */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Tombol</label>
                        <input
                            type="color"
                            value={settings.buttonBg || '#E5654B'}
                            onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Teks Tombol</label>
                        <input
                            type="color"
                            value={settings.buttonTextColor || '#ffffff'}
                            onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                {/* Card Background */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Latar Belakang Kartu</label>
                    <input
                        type="color"
                        value={settings.cardBg || '#ffffff'}
                        onChange={(e) => handleUpdate('cardBg', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut (Radius)</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '16px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 16px, 12px, 8px"
                    />
                </div>

                {/* Font Families */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul</label>
                    <select
                        value={settings.titleFontFamily || 'default'}
                        onChange={(e) => handleUpdate('titleFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
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
                    <label className="text-xs font-semibold text-gray-700">Font Konten</label>
                    <select
                        value={settings.bodyFontFamily || 'default'}
                        onChange={(e) => handleUpdate('bodyFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
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
            </div>
        </div>
    );
}
