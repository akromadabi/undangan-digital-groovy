import React from 'react';
import { Database, Palette } from 'lucide-react';

const PRESETS = {
    terracotta: {
        numberColor: '#b35c3c',
        labelColor: '#3d302a',
        boxBg: '#f5ebe0',
        boxBorderColor: '#e0d5c8',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat',
        borderRadius: '16px'
    },
    sage: {
        numberColor: '#8a9a86',
        labelColor: '#2f3e2d',
        boxBg: '#f4f6f3',
        boxBorderColor: '#e2e7e1',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter',
        borderRadius: '12px'
    },
    luxury: {
        numberColor: '#c5a880',
        labelColor: '#0d1e3d',
        boxBg: '#ffffff',
        boxBorderColor: '#e5e7eb',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat',
        borderRadius: '4px'
    },
    romantic: {
        numberColor: '#e8a7a1',
        labelColor: '#4a3e3d',
        boxBg: '#fff9f8',
        boxBorderColor: '#fceceb',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit',
        borderRadius: '24px'
    },
    retro: {
        numberColor: '#d97706',
        labelColor: '#18181b',
        boxBg: '#fafaf9',
        boxBorderColor: '#e7e5e4',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat',
        borderRadius: '30px'
    }
};

export default function CountdownEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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

    const sourceType = settings.sourceType || 'static';
    const layoutModel = settings.layoutModel || 'boxes';

    if (mode === 'content') {
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> Sumber Data & Target
                </h3>

                {/* Source Type Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Sumber Data</label>
                    <select
                        value={sourceType}
                        onChange={(e) => handleUpdate('sourceType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="static">Statis (Isi Manual di Sini)</option>
                        <option value="dynamic">Dinamis (Mengikuti Tanggal Undangan)</option>
                    </select>
                </div>
                
                {/* Target Date Input (Static only) */}
                {sourceType === 'static' ? (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Tanggal & Jam Target</label>
                        <input
                            type="datetime-local"
                            value={settings.targetDate || '2026-12-31T23:59:59'}
                            onChange={(e) => handleUpdate('targetDate', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                ) : (
                    <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-800 text-[10px] leading-relaxed">
                        <strong>Mode Dinamis Aktif:</strong> Tanggal hitung mundur akan mengikuti tanggal utama acara yang dimasukkan pengguna di dashboard undangan mereka.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* GENERAL LAYOUT STYLE */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tata Letak</h3>
                
                {/* Layout Model */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Model Layout (Template)</label>
                    <select
                        value={layoutModel}
                        onChange={(e) => handleUpdate('layoutModel', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="boxes">Boxes (Kotak)</option>
                        <option value="circles">Circles (Lingkaran)</option>
                        <option value="simple">Simple Text (Minimalis)</option>
                    </select>
                </div>

                {/* Alignment (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Penjajaran</label>
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

            {/* STYLE */}
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

                {/* Colors */}
                <div className="space-y-3">
                    {/* Numbers color */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Angka</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.numberColor || '#E5654B'}
                                onChange={(e) => handleUpdate('numberColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={settings.numberColor || '#E5654B'}
                                onChange={(e) => handleUpdate('numberColor', e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Labels color */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Label Teks</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.labelColor || '#4b5563'}
                                onChange={(e) => handleUpdate('labelColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={settings.labelColor || '#4b5563'}
                                onChange={(e) => handleUpdate('labelColor', e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {layoutModel !== 'simple' && (
                        <>
                            {/* Box Bg color */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Latar Kotak</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.boxBg || '#faf9f6'}
                                        onChange={(e) => handleUpdate('boxBg', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.boxBg || '#faf9f6'}
                                        onChange={(e) => handleUpdate('boxBg', e.target.value)}
                                        className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            {/* Box Border color */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Border Kotak</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.boxBorderColor || '#e5e7eb'}
                                        onChange={(e) => handleUpdate('boxBorderColor', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.boxBorderColor || '#e5e7eb'}
                                        onChange={(e) => handleUpdate('boxBorderColor', e.target.value)}
                                        className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Angka Timer</label>
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
                    <label className="text-xs font-semibold text-gray-700">Font Label Teks</label>
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

                {layoutModel === 'boxes' && (
                    /* Lengkung Sudut */
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Lengkung Sudut Kotak (Radius)</label>
                        <input
                            type="text"
                            value={settings.borderRadius || '12px'}
                            onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                            placeholder="e.g. 12px, 8px"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
