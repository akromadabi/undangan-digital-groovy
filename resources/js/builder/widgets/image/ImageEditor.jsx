import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ImageEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Gambar</h3>
                
                {/* Image URL */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">URL Gambar</label>
                    <input
                        type="text"
                        value={settings.url || ''}
                        onChange={(e) => handleUpdate('url', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Alt Text */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Alternatif (Alt)</label>
                    <input
                        type="text"
                        value={settings.alt || ''}
                        onChange={(e) => handleUpdate('alt', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="Deskripsi gambar..."
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
                {/* Alignment */}
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

            {/* STYLE TAB */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gaya Gambar</h3>

                {/* Width */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Lebar Gambar (Width)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="text"
                        value={getResponsiveValue('width', '100%')}
                        onChange={(e) => handleUpdateResponsive('width', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 100%, 300px, 50%"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Sudut Bulat (Border Radius)</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '8px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 8px, 50%, 12px"
                    />
                </div>

                {/* Border Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Jenis Bingkai (Border Type)</label>
                    <select
                        value={settings.borderType || 'none'}
                        onChange={(e) => handleUpdate('borderType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                    >
                        <option value="none">Tanpa Bingkai (None)</option>
                        <option value="solid">Garis Solid</option>
                        <option value="dashed">Garis Putus-Putus (Dashed)</option>
                        <option value="dotted">Garis Titik-Titik (Dotted)</option>
                        <option value="double">Double</option>
                    </select>
                </div>

                {settings.borderType && settings.borderType !== 'none' && (
                    <>
                        {/* Border Color */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Warna Bingkai</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={settings.borderColor || '#e5e7eb'}
                                    onChange={(e) => handleUpdate('borderColor', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                />
                                <input
                                    type="text"
                                    value={settings.borderColor || '#e5e7eb'}
                                    onChange={(e) => handleUpdate('borderColor', e.target.value)}
                                    className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                />
                            </div>
                        </div>

                        {/* Border Width */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Tebal Bingkai</label>
                            <input
                                type="text"
                                value={settings.borderWidth || '1px'}
                                onChange={(e) => handleUpdate('borderWidth', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                                placeholder="e.g. 1px, 3px"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
