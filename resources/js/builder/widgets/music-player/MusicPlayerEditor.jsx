import React from 'react';
import { Music, Palette, ShieldAlert, Sliders } from 'lucide-react';

const PRESETS = {
    terracotta: {
        primaryColor: '#b35c3c',
        iconColor: '#ffffff',
        bodyFontFamily: 'Montserrat'
    },
    sage: {
        primaryColor: '#8a9a86',
        iconColor: '#ffffff',
        bodyFontFamily: 'Inter'
    },
    luxury: {
        primaryColor: '#c5a880',
        iconColor: '#ffffff',
        bodyFontFamily: 'Montserrat'
    },
    romantic: {
        primaryColor: '#e8a7a1',
        iconColor: '#ffffff',
        bodyFontFamily: 'Outfit'
    },
    retro: {
        primaryColor: '#d97706',
        iconColor: '#fafaf9',
        bodyFontFamily: 'Montserrat'
    }
};

export default function MusicPlayerEditor({ settings = {}, onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    // Pre-selected high-quality wedding audio presets
    const audioPresets = [
        { title: 'Beautiful Wedding Piano', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { title: 'Romantic Acoustic Guitar', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { title: 'Orchestral Wedding March', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ];

    const currentUrl = settings.audioUrl || audioPresets[0].url;

    const handleSelectPreset = (url) => {
        const selected = audioPresets.find(p => p.url === url);
        if (selected) {
            onChange({
                audioUrl: selected.url,
                songTitle: selected.title
            });
        }
    };

    if (mode === 'content') {
        const sourceType = settings.sourceType || 'static';
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Sumber Lagu
                </h3>

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

                {/* Autoplay Warning */}
                <div className="flex gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-800">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                        <strong>Catatan Browser:</strong> Musik latar hanya akan berputar otomatis setelah ada interaksi pertama dari tamu (misal klik "Buka Undangan") dikarenakan kebijakan privasi browser terbaru.
                    </p>
                </div>

                {sourceType === 'static' ? (
                    <>
                        {/* Presets */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Pilih Musik Rekomendasi</label>
                            <select
                                value={audioPresets.some(p => p.url === currentUrl) ? currentUrl : ''}
                                onChange={(e) => handleSelectPreset(e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                            >
                                <option value="" disabled>-- Pilih Musik Bawaan --</option>
                                {audioPresets.map((preset) => (
                                    <option key={preset.url} value={preset.url}>
                                        {preset.title}
                                    </option>
                                ))}
                                {!audioPresets.some(p => p.url === currentUrl) && (
                                    <option value="">Kustom URL MP3</option>
                                )}
                            </select>
                        </div>

                        {/* Custom URL */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Custom URL File MP3</label>
                            <input
                                type="text"
                                value={settings.audioUrl || ''}
                                onChange={(e) => handleUpdate('audioUrl', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2 font-mono"
                                placeholder="https://domain.com/music.mp3"
                            />
                        </div>

                        {/* Song Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Judul Lagu</label>
                            <input
                                type="text"
                                value={settings.songTitle || ''}
                                onChange={(e) => handleUpdate('songTitle', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. Beautiful Wedding Piano"
                            />
                        </div>

                        {/* Autoplay Toggle */}
                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                checked={settings.autoplay || false}
                                onChange={(e) => handleUpdate('autoplay', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                id="autoplay-toggle"
                            />
                            <label htmlFor="autoplay-toggle" className="text-xs font-semibold text-gray-700 cursor-pointer">Putar Otomatis (Autoplay)</label>
                        </div>
                    </>
                ) : (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-800 text-[10px] leading-relaxed">
                        Lagu latar akan dimuat secara dinamis dari data file musik yang diunggah klien untuk undangan ini di dashboard.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* PLAYER POSITION & STYLES */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5" /> Pengaturan Pemutar
                </h3>

                {/* Player Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tampilan Pemutar</label>
                    <select
                        value={settings.playerType || 'floating'}
                        onChange={(e) => handleUpdate('playerType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="floating">Floating (Melayang di Pojok)</option>
                        <option value="inline">Inline (Kotak Player Biasa)</option>
                    </select>
                </div>

                {/* Floating Position */}
                {settings.playerType !== 'inline' && (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Posisi Melayang</label>
                        <select
                            value={settings.floatPosition || 'bottom-right'}
                            onChange={(e) => handleUpdate('floatPosition', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                        >
                            <option value="bottom-right">Kanan Bawah</option>
                            <option value="bottom-left">Kiri Bawah</option>
                            <option value="top-right">Kanan Atas</option>
                            <option value="top-left">Kiri Atas</option>
                        </select>
                    </div>
                )}
            </div>

            <hr className="border-gray-100" />

            {/* DESAIN & WARNA */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Desain & Warna
                </h3>

                {/* Preset Style Selector */}
                <div className="space-y-1 pb-1">
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
                        <label className="text-xs font-semibold text-gray-700">Warna Utama</label>
                        <input
                            type="color"
                            value={settings.primaryColor || '#E5654B'}
                            onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Ikon</label>
                        <input
                            type="color"
                            value={settings.iconColor || '#ffffff'}
                            onChange={(e) => handleUpdate('iconColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Teks Pemutar</label>
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
            </div>
        </div>
    );
}
