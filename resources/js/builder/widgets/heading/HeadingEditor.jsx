import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';

export default function HeadingEditor({ settings = {}, activeBreakpoint = 'desktop', onChange }) {
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

    // Get the current responsive value
    const getResponsiveValue = (key, fallback = '') => {
        const val = settings[key];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    return (
        <div className="space-y-6">
            {/* CONTENT SECTION */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Judul</h3>
                
                {/* Text Input */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Judul</label>
                    <textarea
                        value={settings.text || ''}
                        onChange={(e) => handleUpdate('text', e.target.value)}
                        rows={3}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                        placeholder="Masukkan teks judul..."
                    />
                </div>

                {/* HTML Tag */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">HTML Tag</label>
                    <select
                        value={settings.tag || 'h2'}
                        onChange={(e) => handleUpdate('tag', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                        <option value="h5">H5</option>
                        <option value="h6">H6</option>
                        <option value="p">Paragraph (p)</option>
                        <option value="div">Div</option>
                        <option value="span">Span</option>
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
                            { value: 'right', Icon: AlignRight },
                            { value: 'justify', Icon: AlignJustify }
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

            {/* STYLE SECTION */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gaya Teks</h3>

                {/* Text Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Teks</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.textColor || '#1f2937'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.textColor || '#1f2937'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                        />
                    </div>
                </div>

                {/* Font Size (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Ukuran Font</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={getResponsiveValue('fontSize', '32px')}
                            onChange={(e) => handleUpdateResponsive('fontSize', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                            placeholder="e.g. 32px, 2rem, 5vw"
                        />
                    </div>
                </div>

                {/* Font Family */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Keluarga Font (Font Family)</label>
                    <select
                        value={settings.fontFamily || 'default'}
                        onChange={(e) => handleUpdate('fontFamily', e.target.value)}
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

                {/* Font Weight */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Ketebalan Font (Weight)</label>
                    <select
                        value={settings.fontWeight || 'bold'}
                        onChange={(e) => handleUpdate('fontWeight', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
                    >
                        <option value="normal">Normal (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi Bold (600)</option>
                        <option value="bold">Bold (700)</option>
                        <option value="900">Black (900)</option>
                    </select>
                </div>

                {/* Line Height */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tinggi Baris (Line Height)</label>
                    <input
                        type="text"
                        value={settings.lineHeight || '1.2'}
                        onChange={(e) => handleUpdate('lineHeight', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 1.2, 1.5, 120%"
                    />
                </div>
            </div>
        </div>
    );
}
