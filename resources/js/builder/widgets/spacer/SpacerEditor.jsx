import React from 'react';

export default function SpacerEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                Spacer tidak memiliki pengaturan konten. Silakan atur tinggi di tab Gaya.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Jarak Kosong</h3>

                {/* Height Slider */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Tinggi Spacer (px)</label>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded capitalize">
                            {getResponsiveValue('height', '30')}px ({activeBreakpoint})
                        </span>
                    </div>
                    <input
                        type="range"
                        min="5"
                        max="200"
                        step="5"
                        value={getResponsiveValue('height', '30')}
                        onChange={(e) => handleUpdateResponsive('height', e.target.value)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>5px</span>
                        <span>100px</span>
                        <span>200px</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
