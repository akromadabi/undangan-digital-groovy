import React from 'react';
import { useBuilderStore, findNodeAndParent } from '../state/builderStore';
import { widgetRegistry } from '../widgets';

export default function ContentTab() {
    const document = useBuilderStore((state) => state.document);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const updateNodeSettings = useBuilderStore((state) => state.updateNodeSettings);

    if (!selectedId) {
        return (
            <div className="p-6 text-center text-sm text-gray-400">
                Pilih Section, Kolom, atau Widget untuk diedit.
            </div>
        );
    }

    const nodeInfo = findNodeAndParent(document.content, selectedId);
    if (!nodeInfo) {
        return (
            <div className="p-6 text-center text-sm text-gray-400">
                Elemen tidak ditemukan.
            </div>
        );
    }

    const { node, type } = nodeInfo;

    const handleSettingsChange = (newSettings) => {
        updateNodeSettings(selectedId, newSettings);
    };

    // Helper to get responsive values for section/column
    const getResponsiveValue = (key, fallback = '') => {
        const val = node.settings?.[key];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    const handleUpdateResponsive = (key, subKey, value) => {
        const currentVal = node.settings?.[key] || {};
        const updatedSubVal = typeof currentVal[subKey] === 'object'
            ? { ...currentVal[subKey] }
            : { desktop: currentVal[subKey] || '' };
        
        updatedSubVal[activeBreakpoint] = value;

        handleSettingsChange({
            [key]: {
                ...currentVal,
                [subKey]: updatedSubVal
            }
        });
    };

    const getResponsiveSubValue = (key, subKey, fallback = '') => {
        const val = node.settings?.[key]?.[subKey];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    // Render Widget-specific Editor
    if (type === 'widget') {
        const widgetConfig = widgetRegistry[node.type];
        if (!widgetConfig || !widgetConfig.Editor) {
            return (
                <div className="p-6 text-center text-sm text-gray-400">
                    Editor untuk widget "{node.type}" belum diimplementasikan.
                </div>
            );
        }

        const Editor = widgetConfig.Editor;
        return (
            <div className="p-4">
                <Editor
                    settings={node.settings || {}}
                    activeBreakpoint={activeBreakpoint}
                    onChange={handleSettingsChange}
                />
            </div>
        );
    }

    // Render Column Editor
    if (type === 'column') {
        return (
            <div className="p-4 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Layout Kolom</h3>

                    {/* Column Width */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700">Lebar Kolom (%)</label>
                            <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                        </div>
                        <input
                            type="text"
                            value={getResponsiveValue('width', '100%')}
                            onChange={(e) => {
                                const current = node.settings?.width && typeof node.settings.width === 'object'
                                    ? { ...node.settings.width }
                                    : { desktop: node.settings?.width || '100%' };
                                current[activeBreakpoint] = e.target.value;
                                handleSettingsChange({ width: current });
                            }}
                            className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                            placeholder="e.g. 50%, 100%, 33.3%"
                        />
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Column Padding */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Padding Kolom (px)</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {['top', 'right', 'bottom', 'left'].map((dir) => (
                            <div key={dir} className="space-y-1">
                                <input
                                    type="text"
                                    value={getResponsiveSubValue('padding', dir, '10')}
                                    onChange={(e) => handleUpdateResponsive('padding', dir, e.target.value)}
                                    className="w-full text-center border-gray-200 rounded-md p-1 font-mono"
                                />
                                <span className="text-[10px] text-gray-400 uppercase">{dir}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Render Section Editor
    if (type === 'section') {
        return (
            <div className="p-4 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Layout Section</h3>

                    {/* Section Padding */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700">Padding Section (px)</label>
                            <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                            {['top', 'right', 'bottom', 'left'].map((dir) => (
                                <div key={dir} className="space-y-1">
                                    <input
                                        type="text"
                                        value={getResponsiveSubValue('padding', dir, '30')}
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

                {/* Section Background */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background</h3>

                    {/* Background Color */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Latar</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={node.settings?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleSettingsChange({ backgroundColor: e.target.value })}
                                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                            />
                            <input
                                type="text"
                                value={node.settings?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleSettingsChange({ backgroundColor: e.target.value })}
                                className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 uppercase font-mono"
                            />
                        </div>
                    </div>

                    {/* Background Image URL */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">URL Gambar Latar (Opsional)</label>
                        <input
                            type="text"
                            value={node.settings?.backgroundImage || ''}
                            onChange={(e) => handleSettingsChange({ backgroundImage: e.target.value })}
                            className="w-full text-sm border-gray-200 rounded-lg p-2"
                            placeholder="https://example.com/bg.jpg"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
