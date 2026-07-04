import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import FontPicker from '../../components/FontPicker';

export default function TextEditorEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Paragraf</h3>
                
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks / HTML</label>
                    <textarea
                        value={settings.text || ''}
                        onChange={(e) => handleUpdate('text', e.target.value)}
                        rows={6}
                        className="w-full text-xs font-mono border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="<p>Masukkan teks paragraf di sini...</p>"
                    />
                    <span className="text-[9px] text-gray-400">Mendukung tag HTML sederhana seperti <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, dan <code>&lt;br /&gt;</code>.</span>
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
                            { value: 'right', Icon: AlignRight },
                            { value: 'justify', Icon: AlignJustify }
                        ].map((item) => {
                            const currentValue = getResponsiveValue('alignment', 'left');
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gaya Teks</h3>

                {/* Text Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Teks</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.textColor || '#4b5563'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.textColor || '#4b5563'}
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
                    <input
                        type="text"
                        value={getResponsiveValue('fontSize', '16px')}
                        onChange={(e) => handleUpdateResponsive('fontSize', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 16px, 1.1rem"
                    />
                </div>

                {/* Font Family */}
                <FontPicker
                    value={settings.fontFamily || 'default'}
                    onChange={(val) => handleUpdate('fontFamily', val)}
                />

                {/* Font Weight */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Ketebalan Font (Weight)</label>
                    <select
                        value={settings.fontWeight || 'normal'}
                        onChange={(e) => handleUpdate('fontWeight', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="300">Light (300)</option>
                        <option value="normal">Normal (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi Bold (600)</option>
                        <option value="bold">Bold (700)</option>
                    </select>
                </div>

                {/* Line Height */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tinggi Baris (Line Height)</label>
                    <input
                        type="text"
                        value={settings.lineHeight || '1.6'}
                        onChange={(e) => handleUpdate('lineHeight', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 1.5, 1.6"
                    />
                </div>
            </div>
        </div>
    );
}
