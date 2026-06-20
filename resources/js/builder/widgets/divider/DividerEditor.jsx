import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function DividerEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
            <div className="p-4 text-center text-xs text-gray-400">
                Garis Pembatas (Divider) tidak memiliki pengaturan konten. Silakan atur tampilan di tab Gaya.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* LAYOUT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tata Letak Garis</h3>
                
                {/* Style */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Gaya Garis</label>
                    <select
                        value={settings.lineStyle || 'solid'}
                        onChange={(e) => handleUpdate('lineStyle', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="solid">Solid (Garis Lurus)</option>
                        <option value="dashed">Dashed (Garis Putus-putus)</option>
                        <option value="dotted">Dotted (Titik-titik)</option>
                        <option value="double">Double (Dua Garis)</option>
                    </select>
                </div>

                {/* Width (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Lebar Garis (%)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="text"
                        value={getResponsiveValue('width', '100%')}
                        onChange={(e) => handleUpdateResponsive('width', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 100%, 50%, 80px"
                    />
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desain & Spacing</h3>

                {/* Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Garis</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.color || '#e5e7eb'}
                            onChange={(e) => handleUpdate('color', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.color || '#e5e7eb'}
                            onChange={(e) => handleUpdate('color', e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                        />
                    </div>
                </div>

                {/* Weight */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Ketebalan (Weight)</label>
                    <input
                        type="text"
                        value={settings.weight || '2px'}
                        onChange={(e) => handleUpdate('weight', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 2px, 4px"
                    />
                </div>

                {/* Gap Top (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Jarak Atas (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="number"
                        value={getResponsiveValue('gapTop', '15')}
                        onChange={(e) => handleUpdateResponsive('gapTop', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>

                {/* Gap Bottom (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Jarak Bawah (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="number"
                        value={getResponsiveValue('gapBottom', '15')}
                        onChange={(e) => handleUpdateResponsive('gapBottom', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>
            </div>
        </div>
    );
}
