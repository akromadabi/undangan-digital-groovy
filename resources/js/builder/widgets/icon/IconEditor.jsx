import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const COMMON_ICONS = [
    'Heart', 'Star', 'Gift', 'Mail', 'MapPin', 
    'Calendar', 'Clock', 'Music', 'Users', 'Camera', 
    'Info', 'Sparkles', 'Wine', 'Bell', 'BookOpen', 'HeartHandshake'
];

export default function IconEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pilih Ikon</h3>
                
                {/* Icon Grid Selector */}
                <div className="grid grid-cols-4 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 max-h-48 overflow-y-auto">
                    {COMMON_ICONS.map((name) => {
                        const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
                        const active = (settings.icon || 'Heart') === name;
                        return (
                            <button
                                key={name}
                                type="button"
                                onClick={() => handleUpdate('icon', name)}
                                className={`p-2 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                    active 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                                title={name}
                            >
                                <IconComponent size={20} />
                                <span className="text-[8px] mt-1 font-mono truncate max-w-full">{name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* STYLE */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tata Letak</h3>

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

            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desain Ikon</h3>

                {/* Icon Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Ikon</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={settings.color || '#E5654B'}
                            onChange={(e) => handleUpdate('color', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={settings.color || '#E5654B'}
                            onChange={(e) => handleUpdate('color', e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                        />
                    </div>
                </div>

                {/* Icon Size (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Ukuran Ikon (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="number"
                        min="10"
                        max="120"
                        value={getResponsiveValue('size', '32')}
                        onChange={(e) => handleUpdateResponsive('size', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                    />
                </div>

                <hr className="border-gray-100" />

                {/* Latar Belakang (Background Options) */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Latar Belakang</label>
                    
                    {/* Background Type */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Bentuk Bingkai</label>
                        <select
                            value={settings.bgType || 'none'}
                            onChange={(e) => handleUpdate('bgType', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="none">Tanpa Bingkai (Flat)</option>
                            <option value="circle">Lingkaran (Circle)</option>
                            <option value="square">Kotak Tumpul (Square)</option>
                        </select>
                    </div>

                    {settings.bgType !== 'none' && (
                        <>
                            {/* Background Color */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Latar</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={settings.bgColor || '#fef2f2'}
                                        onChange={(e) => handleUpdate('bgColor', e.target.value)}
                                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                    />
                                    <input
                                        type="text"
                                        value={settings.bgColor || '#fef2f2'}
                                        onChange={(e) => handleUpdate('bgColor', e.target.value)}
                                        className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                                    />
                                </div>
                            </div>

                            {/* Background Padding */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-gray-700">Padding Bingkai (px)</label>
                                    <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                                </div>
                                <input
                                    type="number"
                                    value={getResponsiveValue('padding', '10')}
                                    onChange={(e) => handleUpdateResponsive('padding', e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
