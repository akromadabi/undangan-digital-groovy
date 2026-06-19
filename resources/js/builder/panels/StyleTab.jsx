import React from 'react';
import { useBuilderStore, findNodeAndParent } from '../state/builderStore';

export default function StyleTab() {
    const document = useBuilderStore((state) => state.document);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const updateNodeSettings = useBuilderStore((state) => state.updateNodeSettings);

    if (!selectedId) {
        return (
            <div className="p-6 text-center text-sm text-gray-400">
                Pilih elemen untuk mengatur Gaya.
            </div>
        );
    }

    const nodeInfo = findNodeAndParent(document.content, selectedId);
    if (!nodeInfo) return null;
    const { node } = nodeInfo;

    const handleSettingsChange = (newSettings) => {
        updateNodeSettings(selectedId, newSettings);
    };

    return (
        <div className="p-4 space-y-6">
            {/* COMMON BORDER STYLE */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bingkai (Border)</h3>

                {/* Border Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tipe Bingkai</label>
                    <select
                        value={node.settings?.borderType || 'none'}
                        onChange={(e) => handleSettingsChange({ borderType: e.target.value })}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                    >
                        <option value="none">Tanpa Bingkai</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="double">Double</option>
                    </select>
                </div>

                {node.settings?.borderType && node.settings?.borderType !== 'none' && (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Tebal (px)</label>
                            <input
                                type="text"
                                value={node.settings?.borderWidth || '1px'}
                                onChange={(e) => handleSettingsChange({ borderWidth: e.target.value })}
                                className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                                placeholder="1px"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Warna</label>
                            <input
                                type="color"
                                value={node.settings?.borderColor || '#e5e7eb'}
                                onChange={(e) => handleSettingsChange({ borderColor: e.target.value })}
                                className="w-full h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                        </div>
                    </div>
                )}

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Radius Sudut (Border Radius)</label>
                    <input
                        type="text"
                        value={node.settings?.borderRadius || ''}
                        onChange={(e) => handleSettingsChange({ borderRadius: e.target.value })}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 8px, 16px, 50%"
                    />
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* BOX SHADOW */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bayangan (Box Shadow)</h3>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Preset Bayangan</label>
                    <select
                        value={node.settings?.boxShadow || 'none'}
                        onChange={(e) => handleSettingsChange({ boxShadow: e.target.value })}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                    >
                        <option value="none">Tanpa Bayangan (None)</option>
                        <option value="0 1px 3px rgba(0,0,0,0.1)">Sangat Tipis (XS)</option>
                        <option value="0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">Tipis (SM)</option>
                        <option value="0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)">Sedang (MD)</option>
                        <option value="0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)">Tebal (LG)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
