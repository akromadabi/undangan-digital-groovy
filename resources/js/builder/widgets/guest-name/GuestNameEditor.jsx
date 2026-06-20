import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const PRESETS = {
    terracotta: {
        textColor: '#3d302a',
        prefixColor: '#5c4c43',
        cardBg: '#f5ebe0',
        border: true,
        borderColor: '#e0d5c8',
        borderRadius: '16px',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat'
    },
    sage: {
        textColor: '#2f3e2d',
        prefixColor: '#4a5548',
        cardBg: '#f4f6f3',
        border: true,
        borderColor: '#e2e7e1',
        borderRadius: '12px',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter'
    },
    luxury: {
        textColor: '#0d1e3d',
        prefixColor: '#3b4b66',
        cardBg: '#ffffff',
        border: true,
        borderColor: '#e5e7eb',
        borderRadius: '4px',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat'
    },
    romantic: {
        textColor: '#4a3e3d',
        prefixColor: '#7a6b6a',
        cardBg: '#fff9f8',
        border: true,
        borderColor: '#fceceb',
        borderRadius: '24px',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit'
    },
    retro: {
        textColor: '#18181b',
        prefixColor: '#4b5563',
        cardBg: '#fafaf9',
        border: true,
        borderColor: '#e7e5e4',
        borderRadius: '30px',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat'
    }
};

export default function GuestNameEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teks Penyambut</h3>
                
                {/* Prefix */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Pembuka (Prefix)</label>
                    <input
                        type="text"
                        value={settings.prefix || ''}
                        onChange={(e) => handleUpdate('prefix', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Kepada Yth. Bapak/Ibu/Saudara/i:"
                    />
                </div>

                {/* Suffix */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Penutup (Suffix)</label>
                    <input
                        type="text"
                        value={settings.suffix || ''}
                        onChange={(e) => handleUpdate('suffix', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Di Tempat"
                    />
                </div>

                {/* Placeholder Name */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Contoh Nama Tamu (Editor)</label>
                    <input
                        type="text"
                        value={settings.placeholderName || ''}
                        onChange={(e) => handleUpdate('placeholderName', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Nama Tamu Undangan"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ALIGNMENT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Penyelarasan</h3>
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desain Kartu & Teks</h3>

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

                {/* Colors */}
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Nama Tamu</label>
                        <input
                            type="color"
                            value={settings.textColor || '#1f2937'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Label (Prefix/Suffix)</label>
                        <input
                            type="color"
                            value={settings.prefixColor || '#6b7280'}
                            onChange={(e) => handleUpdate('prefixColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                {/* Font Sizes (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Ukuran Font Nama</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="text"
                        value={getResponsiveValue('nameFontSize', '24px')}
                        onChange={(e) => handleUpdateResponsive('nameFontSize', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>
                
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Ukuran Font Label</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="text"
                        value={getResponsiveValue('labelFontSize', '14px')}
                        onChange={(e) => handleUpdateResponsive('labelFontSize', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Nama Tamu</label>
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
                    <label className="text-xs font-semibold text-gray-700">Font Label Pembuka/Penutup</label>
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

                {/* Card Background & Border */}
                <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Kartu Latar Belakang</label>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Latar Kartu</label>
                        <input
                            type="color"
                            value={settings.cardBg || '#f3f4f6'}
                            onChange={(e) => handleUpdate('cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={settings.border || false}
                            onChange={(e) => handleUpdate('border', e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                            id="border-toggle"
                        />
                        <label htmlFor="border-toggle" className="text-xs font-semibold text-gray-700 cursor-pointer">Gunakan Border Garis</label>
                    </div>

                    {settings.border && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Warna Border</label>
                            <input
                                type="color"
                                value={settings.borderColor || '#e5e7eb'}
                                onChange={(e) => handleUpdate('borderColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Lengkung Sudut (Radius)</label>
                        <input
                            type="text"
                            value={settings.borderRadius || '12px'}
                            onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                            placeholder="e.g. 12px, 8px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
