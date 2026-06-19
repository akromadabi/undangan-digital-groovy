import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function ButtonEditor({ settings = {}, activeBreakpoint = 'desktop', onChange }) {
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

    return (
        <div className="space-y-6">
            {/* CONTENT TAB */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Tombol</h3>
                
                {/* Button Text */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Tombol</label>
                    <input
                        type="text"
                        value={settings.text || ''}
                        onChange={(e) => handleUpdate('text', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="Klik di Sini"
                    />
                </div>

                {/* Target URL */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Link URL Tujuan</label>
                    <input
                        type="text"
                        value={settings.url || ''}
                        onChange={(e) => handleUpdate('url', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="# atau https://example.com"
                    />
                </div>

                {/* Open in new tab */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isExternal"
                        checked={settings.isExternal || false}
                        onChange={(e) => handleUpdate('isExternal', e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isExternal" className="text-xs font-semibold text-gray-700">Buka di Tab Baru</label>
                </div>

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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gaya Tombol</h3>

                {/* Text Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Teks</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.textColor || '#ffffff'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.textColor || '#ffffff'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                        />
                    </div>
                </div>

                {/* Background Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Background</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.backgroundColor || '#E5654B'}
                            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.backgroundColor || '#E5654B'}
                            onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                        />
                    </div>
                </div>

                {/* Font Size */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Ukuran Font</label>
                    <input
                        type="text"
                        value={settings.fontSize || '14px'}
                        onChange={(e) => handleUpdate('fontSize', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 14px, 1rem"
                    />
                </div>

                {/* Padding X */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Padding Horizontal (Kiri/Kanan)</label>
                    <input
                        type="text"
                        value={settings.paddingX || '24px'}
                        onChange={(e) => handleUpdate('paddingX', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 24px, 12px"
                    />
                </div>

                {/* Padding Y */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Padding Vertical (Atas/Bawah)</label>
                    <input
                        type="text"
                        value={settings.paddingY || '12px'}
                        onChange={(e) => handleUpdate('paddingY', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 12px, 8px"
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
                        placeholder="e.g. 8px, 50%, 0px"
                    />
                </div>
            </div>
        </div>
    );
}
