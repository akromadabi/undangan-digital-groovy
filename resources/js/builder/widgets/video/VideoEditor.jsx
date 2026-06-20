import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function VideoEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pengaturan Video</h3>
                
                {/* Source Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Sumber Video</label>
                    <select
                        value={settings.videoType || 'youtube'}
                        onChange={(e) => handleUpdate('videoType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="hosted">Direct MP4 Link (Self Hosted)</option>
                    </select>
                </div>

                {/* Video URL */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Link / URL Video</label>
                    <input
                        type="text"
                        value={settings.url || ''}
                        onChange={(e) => handleUpdate('url', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder={
                            settings.videoType === 'youtube'
                                ? 'e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                                : settings.videoType === 'vimeo'
                                ? 'e.g. https://vimeo.com/76979871'
                                : 'e.g. https://example.com/wedding-video.mp4'
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tata Letak */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tata Letak</h3>

                {/* Width (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Lebar Frame Video</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <input
                        type="text"
                        value={getResponsiveValue('width', '100%')}
                        onChange={(e) => handleUpdateResponsive('width', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 100%, 80%, 400px"
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

            {settings.videoType !== 'hosted' && (
                <>
                    <hr className="border-gray-100" />
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Desain Frame</h3>

                        {/* Aspect Ratio */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Rasio Aspek (Aspect Ratio)</label>
                            <select
                                value={settings.aspectRatio || '16/9'}
                                onChange={(e) => handleUpdate('aspectRatio', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="16/9">Landscape (16:9)</option>
                                <option value="4/3">Standard (4:3)</option>
                                <option value="1/1">Square (1:1)</option>
                            </select>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
