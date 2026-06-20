import React from 'react';
import { Palette, Sliders } from 'lucide-react';

const PRESETS = {
    terracotta: {
        buttonBg: '#b35c3c',
        buttonTextColor: '#ffffff',
        labelColor: '#3d302a',
        formBg: '#f5ebe0',
        formBorderColor: '#e0d5c8',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat',
        borderRadius: '16px'
    },
    sage: {
        buttonBg: '#8a9a86',
        buttonTextColor: '#ffffff',
        labelColor: '#2f3e2d',
        formBg: '#f4f6f3',
        formBorderColor: '#e2e7e1',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter',
        borderRadius: '12px'
    },
    luxury: {
        buttonBg: '#c5a880',
        buttonTextColor: '#ffffff',
        labelColor: '#0d1e3d',
        formBg: '#ffffff',
        formBorderColor: '#e5e7eb',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat',
        borderRadius: '4px'
    },
    romantic: {
        buttonBg: '#e8a7a1',
        buttonTextColor: '#ffffff',
        labelColor: '#4a3e3d',
        formBg: '#fff9f8',
        formBorderColor: '#fceceb',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit',
        borderRadius: '24px'
    },
    retro: {
        buttonBg: '#18181b',
        buttonTextColor: '#fafaf9',
        labelColor: '#18181b',
        formBg: '#fafaf9',
        formBorderColor: '#e7e5e4',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat',
        borderRadius: '30px'
    }
};

export default function RsvpFormEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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

    const layoutModel = settings.layoutModel || 'card';

    if (mode === 'content') {
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Pengaturan Konten RSVP
                </h3>
                
                {/* Button Text */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Tombol Kirim</label>
                    <input
                        type="text"
                        value={settings.buttonText || ''}
                        onChange={(e) => handleUpdate('buttonText', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Kirim Konfirmasi Kehadiran"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* LAYOUT MODEL */}
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
                        <option value="card">Full Card (Kotak Shadow)</option>
                        <option value="minimal">Minimal (Tanpa Background)</option>
                        <option value="inline">Underlined (Modern Minimalis)</option>
                    </select>
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
                    {/* Button Background */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Latar Tombol</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.buttonBg || '#E5654B'}
                                onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={settings.buttonBg || '#E5654B'}
                                onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Button Text Color */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Tombol</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.buttonTextColor || '#ffffff'}
                                onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={settings.buttonTextColor || '#ffffff'}
                                onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Form Label Color */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Label Input</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={settings.labelColor || '#374151'}
                                onChange={(e) => handleUpdate('labelColor', e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={settings.labelColor || '#374151'}
                                onChange={(e) => handleUpdate('labelColor', e.target.value)}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {layoutModel === 'card' && (
                        <>
                            {/* Form Background Color */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Latar Form</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.formBg || '#ffffff'}
                                        onChange={(e) => handleUpdate('formBg', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.formBg || '#ffffff'}
                                        onChange={(e) => handleUpdate('formBg', e.target.value)}
                                        className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            {/* Form Border Color */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Border Form</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.formBorderColor || '#e5e7eb'}
                                        onChange={(e) => handleUpdate('formBorderColor', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.formBorderColor || '#e5e7eb'}
                                        onChange={(e) => handleUpdate('formBorderColor', e.target.value)}
                                        className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            {/* Border Radius */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Lengkung Sudut Form (Radius)</label>
                                <input
                                    type="text"
                                    value={settings.borderRadius || '16px'}
                                    onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                                    placeholder="e.g. 16px, 12px"
                                />
                            </div>

                            {/* Padding (Responsive) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-gray-700">Padding Dalam Form (px)</label>
                                    <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                                </div>
                                <input
                                    type="number"
                                    value={getResponsiveValue('padding', '20')}
                                    onChange={(e) => handleUpdateResponsive('padding', e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Label & Tombol</label>
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
                    <label className="text-xs font-semibold text-gray-700">Font Teks Input</label>
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
