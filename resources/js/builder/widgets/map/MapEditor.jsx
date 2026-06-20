import React from 'react';

export default function MapEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi Peta</h3>
                
                {/* Address Input */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Alamat Acara</label>
                    <textarea
                        value={settings.address || ''}
                        onChange={(e) => handleUpdate('address', e.target.value)}
                        rows={3}
                        className="w-full text-xs border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g. Balai Kartini, Kuningan, Jakarta Selatan"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* STYLE */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desain Peta</h3>

                {/* Height (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Tinggi Peta (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="number"
                        min="150"
                        max="600"
                        value={getResponsiveValue('height', '300')}
                        onChange={(e) => handleUpdateResponsive('height', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>

                {/* Zoom Level */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Zoom Level</label>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {settings.zoom || 14}x
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="20"
                        value={settings.zoom || 14}
                        onChange={(e) => handleUpdate('zoom', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>Negara (10x)</span>
                        <span>Jalan (15x)</span>
                        <span>Gedung (20x)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
