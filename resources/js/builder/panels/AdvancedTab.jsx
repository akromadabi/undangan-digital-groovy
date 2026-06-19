import React from 'react';
import { useBuilderStore, findNodeAndParent } from '../state/builderStore';

export default function AdvancedTab() {
    const document = useBuilderStore((state) => state.document);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const updateNodeAdvanced = useBuilderStore((state) => state.updateNodeAdvanced);

    if (!selectedId) {
        return (
            <div className="p-6 text-center text-sm text-gray-400">
                Pilih elemen untuk mengatur opsi Lanjutan.
            </div>
        );
    }

    const nodeInfo = findNodeAndParent(document.content, selectedId);
    if (!nodeInfo) return null;
    const { node } = nodeInfo;

    const handleAdvancedChange = (newAdvanced) => {
        updateNodeAdvanced(selectedId, newAdvanced);
    };

    // Helper to update responsive properties
    const handleUpdateResponsive = (key, subKey, value) => {
        const currentVal = node.advanced?.[key] || {};
        const updatedSubVal = typeof currentVal[subKey] === 'object'
            ? { ...currentVal[subKey] }
            : { desktop: currentVal[subKey] || '' };
        
        updatedSubVal[activeBreakpoint] = value;

        handleAdvancedChange({
            [key]: {
                ...currentVal,
                [subKey]: updatedSubVal
            }
        });
    };

    const getResponsiveSubValue = (key, subKey, fallback = '') => {
        const val = node.advanced?.[key]?.[subKey];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    // Handle visibility checkbox toggles
    const handleVisibilityToggle = (device) => {
        const currentVisibility = node.advanced?.visibility || { desktop: true, tablet: true, mobile: true };
        handleAdvancedChange({
            visibility: {
                ...currentVisibility,
                [device]: !currentVisibility[device]
            }
        });
    };

    const visibility = node.advanced?.visibility || { desktop: true, tablet: true, mobile: true };

    return (
        <div className="p-4 space-y-6">
            {/* MARGIN & PADDING */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tata Letak (Layout)</h3>

                {/* Margin */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Margin Luar (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {['top', 'right', 'bottom', 'left'].map((dir) => (
                            <div key={dir} className="space-y-1">
                                <input
                                    type="text"
                                    value={getResponsiveSubValue('margin', dir, '0')}
                                    onChange={(e) => handleUpdateResponsive('margin', dir, e.target.value)}
                                    className="w-full text-center border-gray-200 rounded-md p-1 font-mono"
                                />
                                <span className="text-[10px] text-gray-400 uppercase">{dir}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Padding */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Padding Dalam (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {['top', 'right', 'bottom', 'left'].map((dir) => (
                            <div key={dir} className="space-y-1">
                                <input
                                    type="text"
                                    value={getResponsiveSubValue('padding', dir, '0')}
                                    onChange={(e) => handleUpdateResponsive('padding', dir, e.target.value)}
                                    className="w-full text-center border-gray-200 rounded-md p-1 font-mono"
                                />
                                <span className="text-[10px] text-gray-400 uppercase">{dir}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* VISIBILITY */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Respon / Visibilitas</h3>
                
                <div className="space-y-2">
                    <div className="text-xs text-gray-400 mb-2">Tampilkan atau sembunyikan elemen ini di breakpoint tertentu:</div>
                    
                    {[
                        { key: 'desktop', label: 'Tampilkan di Desktop' },
                        { key: 'tablet', label: 'Tampilkan di Tablet' },
                        { key: 'mobile', label: 'Tampilkan di HP / Mobile' }
                    ].map((device) => (
                        <label key={device.key} className="flex items-center gap-3 text-xs text-gray-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={visibility[device.key] !== false}
                                onChange={() => handleVisibilityToggle(device.key)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                            />
                            {device.label}
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* CUSTOM CSS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom CSS</h3>
                
                <div className="space-y-1">
                    <div className="text-[10px] text-gray-400 mb-1">Gunakan <code>selector</code> untuk menargetkan elemen ini. Contoh: <br /><code>selector &#123; border: 2px gold solid; &#125;</code></div>
                    <textarea
                        value={node.advanced?.customCss || ''}
                        onChange={(e) => handleAdvancedChange({ customCss: e.target.value })}
                        rows={6}
                        className="w-full text-xs font-mono border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="selector {&#10;  transform: rotate(5deg);&#10;}"
                    />
                </div>
            </div>
        </div>
    );
}
