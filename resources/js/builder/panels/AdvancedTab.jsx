import React from 'react';
import { useBuilderStore, findNodeAndParent } from '../state/builderStore';
import { 
    ChevronDown, 
    ChevronRight, 
    Layout, 
    Sparkles, 
    RefreshCw, 
    Paintbrush, 
    EyeOff, 
    Code, 
    Maximize2, 
    Move 
} from 'lucide-react';

export default function AdvancedTab() {
    const document = useBuilderStore((state) => state.document);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const updateNodeAdvanced = useBuilderStore((state) => state.updateNodeAdvanced);

    // Accordion toggle states
    const [openSections, setOpenSections] = React.useState({
        layout: true,
        sticky: false,
        motion: false,
        transform: false,
        background: false,
        visibility: false,
        css: true
    });

    // Sub-tab states for Transform & Background
    const [transformTab, setTransformTab] = React.useState('normal'); // 'normal' | 'hover'
    const [bgTab, setBgTab] = React.useState('normal'); // 'normal' | 'hover'

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

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleAdvancedChange = (newAdvanced) => {
        updateNodeAdvanced(selectedId, newAdvanced);
    };

    // Helper to update responsive properties (for margin and padding)
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

    // Helper for visibility toggles
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

    // Helper for transform property updates
    const handleTransformChange = (tab, key, value) => {
        const currentTransform = node.advanced?.transform || {};
        const tabSettings = currentTransform[tab] || {};
        handleAdvancedChange({
            transform: {
                ...currentTransform,
                [tab]: {
                    ...tabSettings,
                    [key]: value
                }
            }
        });
    };

    const getTransformValue = (tab, key, fallback = '') => {
        return node.advanced?.transform?.[tab]?.[key] !== undefined
            ? node.advanced.transform[tab][key]
            : fallback;
    };

    // Helper for background property updates
    const handleBgChange = (tab, key, value) => {
        const currentBg = node.advanced?.background || {};
        const tabSettings = currentBg[tab] || {};
        handleAdvancedChange({
            background: {
                ...currentBg,
                [tab]: {
                    ...tabSettings,
                    [key]: value
                }
            }
        });
    };

    const getBgValue = (tab, key, fallback = '') => {
        return node.advanced?.background?.[tab]?.[key] !== undefined
            ? node.advanced.background[tab][key]
            : fallback;
    };

    // Motion settings
    const motionSettings = node.advanced?.motionEffects || {};
    const handleMotionChange = (key, value) => {
        handleAdvancedChange({
            motionEffects: {
                ...motionSettings,
                [key]: value
            }
        });
    };

    return (
        <div className="text-gray-700 text-xs">
            
            {/* 1. TATA LETAK (LAYOUT) */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('layout')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Layout className="w-3.5 h-3.5 text-indigo-500" />
                        TATA LETAK (LAYOUT)
                    </span>
                    {openSections.layout ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                
                {openSections.layout && (
                    <div className="p-3 space-y-4 bg-white animate-fadeIn">
                        {/* Margin */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Margin Luar (px)</span>
                                <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                {['top', 'right', 'bottom', 'left'].map((dir) => (
                                    <div key={dir} className="space-y-1">
                                        <input
                                            type="text"
                                            value={getResponsiveSubValue('margin', dir, '0')}
                                            onChange={(e) => handleUpdateResponsive('margin', dir, e.target.value)}
                                            className="w-full text-center border-gray-200 rounded-md p-1 font-mono text-xs focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="text-[9px] text-gray-400 uppercase font-semibold">{dir}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Padding */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Padding Dalam (px)</span>
                                <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                                {['top', 'right', 'bottom', 'left'].map((dir) => (
                                    <div key={dir} className="space-y-1">
                                        <input
                                            type="text"
                                            value={getResponsiveSubValue('padding', dir, '0')}
                                            onChange={(e) => handleUpdateResponsive('padding', dir, e.target.value)}
                                            className="w-full text-center border-gray-200 rounded-md p-1 font-mono text-xs focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <span className="text-[9px] text-gray-400 uppercase font-semibold">{dir}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. STICKY */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('sticky')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                        Sticky
                    </span>
                    {openSections.sticky ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.sticky && (
                    <div className="p-3 bg-white space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Sticky</span>
                            <select
                                value={motionSettings.sticky || 'none'}
                                onChange={(e) => handleMotionChange('sticky', e.target.value)}
                                className="border-gray-200 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500 w-32"
                            >
                                <option value="none">None</option>
                                <option value="top">Top</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. EFEK GERAKAN (MOTION EFFECTS) */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('motion')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        EFEK GERAKAN
                    </span>
                    {openSections.motion ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.motion && (
                    <div className="p-3 bg-white space-y-3 animate-fadeIn">
                        {/* Entrance Animation */}
                        <div className="space-y-1">
                            <span className="font-semibold block">Animasi Saat Masuk</span>
                            <select
                                value={motionSettings.entranceAnimation || 'none'}
                                onChange={(e) => handleMotionChange('entranceAnimation', e.target.value)}
                                className="w-full border-gray-200 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="none">Asali (None)</option>
                                <option value="fadeIn">Fade In</option>
                                <option value="fadeInUp">Fade In Up</option>
                                <option value="fadeInDown">Fade In Down</option>
                                <option value="fadeInLeft">Fade In Left</option>
                                <option value="fadeInRight">Fade In Right</option>
                                <option value="zoomIn">Zoom In</option>
                                <option value="zoomOut">Zoom Out</option>
                                <option value="bounceIn">Bounce In</option>
                            </select>
                        </div>

                        {motionSettings.entranceAnimation && motionSettings.entranceAnimation !== 'none' && (
                            <>
                                {/* Animation Duration */}
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Durasi Animasi</span>
                                    <select
                                        value={motionSettings.animationDuration || 'normal'}
                                        onChange={(e) => handleMotionChange('animationDuration', e.target.value)}
                                        className="border-gray-200 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500 w-32"
                                    >
                                        <option value="slow">Lambat (1.5s)</option>
                                        <option value="normal">Normal (1s)</option>
                                        <option value="fast">Cepat (0.5s)</option>
                                    </select>
                                </div>

                                {/* Animation Delay */}
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">Tunda Animasi (ms)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={motionSettings.animationDelay || 0}
                                        onChange={(e) => handleMotionChange('animationDelay', parseInt(e.target.value) || 0)}
                                        className="border-gray-200 rounded-md py-1 px-2 text-xs w-20 text-center font-mono focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="0"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* 4. TRANSFORMASE (TRANSFORM) */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('transform')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Move className="w-3.5 h-3.5 text-indigo-500" />
                        TRANSFORMASI
                    </span>
                    {openSections.transform ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.transform && (
                    <div className="p-3 bg-white space-y-4 animate-fadeIn">
                        {/* Sub Tabs: Normal / Sorotan (Hover) */}
                        <div className="flex border border-gray-100 p-0.5 rounded-lg bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setTransformTab('normal')}
                                className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    transformTab === 'normal'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Normal
                            </button>
                            <button
                                type="button"
                                onClick={() => setTransformTab('hover')}
                                className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    transformTab === 'hover'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Sorotan (Hover)
                            </button>
                        </div>

                        {/* Sliders Container */}
                        <div className="space-y-3">
                            {/* Rotate */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Putar (Rotation)</span>
                                    <span className="font-mono text-gray-400">{getTransformValue(transformTab, 'rotate', 0)}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    value={getTransformValue(transformTab, 'rotate', 0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'rotate', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Scale */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Skala (Scale)</span>
                                    <span className="font-mono text-gray-400">x{getTransformValue(transformTab, 'scale', 1.0)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0.2"
                                    max="2.5"
                                    step="0.05"
                                    value={getTransformValue(transformTab, 'scale', 1.0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'scale', parseFloat(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Offset X (Translate X) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Offset X (Geser X)</span>
                                    <span className="font-mono text-gray-400">{getTransformValue(transformTab, 'translateX', 0)}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="-200"
                                    max="200"
                                    value={getTransformValue(transformTab, 'translateX', 0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'translateX', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Offset Y (Translate Y) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Offset Y (Geser Y)</span>
                                    <span className="font-mono text-gray-400">{getTransformValue(transformTab, 'translateY', 0)}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="-200"
                                    max="200"
                                    value={getTransformValue(transformTab, 'translateY', 0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'translateY', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Skew X */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Miring X (Skew X)</span>
                                    <span className="font-mono text-gray-400">{getTransformValue(transformTab, 'skewX', 0)}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-90"
                                    max="90"
                                    value={getTransformValue(transformTab, 'skewX', 0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'skewX', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Skew Y */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="font-semibold text-gray-600">Miring Y (Skew Y)</span>
                                    <span className="font-mono text-gray-400">{getTransformValue(transformTab, 'skewY', 0)}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="-90"
                                    max="90"
                                    value={getTransformValue(transformTab, 'skewY', 0)}
                                    onChange={(e) => handleTransformChange(transformTab, 'skewY', parseInt(e.target.value))}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            {/* Flip Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => handleTransformChange(transformTab, 'flipH', !getTransformValue(transformTab, 'flipH', false))}
                                    className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                                        getTransformValue(transformTab, 'flipH', false)
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    Balik Horisontal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleTransformChange(transformTab, 'flipV', !getTransformValue(transformTab, 'flipV', false))}
                                    className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                                        getTransformValue(transformTab, 'flipV', false)
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    Balik Vertikal
                                </button>
                            </div>

                            {/* Transition settings (Only shown on Hover tab) */}
                            {transformTab === 'hover' && (
                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-semibold text-indigo-600">Durasi Transisi</span>
                                        <span className="font-mono text-gray-400">{getTransformValue('hover', 'transitionDuration', 300)}ms</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="50"
                                        value={getTransformValue('hover', 'transitionDuration', 300)}
                                        onChange={(e) => handleTransformChange('hover', 'transitionDuration', parseInt(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                            )}

                            {/* Reset transform settings */}
                            <button
                                type="button"
                                onClick={() => handleAdvancedChange({ transform: {} })}
                                className="w-full py-1 text-[9px] text-gray-400 hover:text-rose-500 font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 mt-1"
                            >
                                <RefreshCw className="w-2.5 h-2.5" />
                                Reset Transformasi
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. LATAR (BACKGROUND) */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('background')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Paintbrush className="w-3.5 h-3.5 text-indigo-500" />
                        LATAR (BACKGROUND)
                    </span>
                    {openSections.background ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.background && (
                    <div className="p-3 bg-white space-y-4 animate-fadeIn">
                        {/* Sub Tabs: Normal / Sorotan (Hover) */}
                        <div className="flex border border-gray-100 p-0.5 rounded-lg bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setBgTab('normal')}
                                className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    bgTab === 'normal'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Normal
                            </button>
                            <button
                                type="button"
                                onClick={() => setBgTab('hover')}
                                className={`flex-1 text-center py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    bgTab === 'hover'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Sorotan (Hover)
                            </button>
                        </div>

                        {/* Background settings */}
                        <div className="space-y-3">
                            {/* Jenis Latar (Classic / Gradient) */}
                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-600">Jenis Latar</span>
                                <div className="flex border border-gray-200 rounded p-0.5 bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => handleBgChange(bgTab, 'type', 'classic')}
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${
                                            getBgValue(bgTab, 'type', 'classic') === 'classic'
                                                ? 'bg-white shadow-sm text-indigo-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        Klasik
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleBgChange(bgTab, 'type', 'gradient')}
                                        className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ${
                                            getBgValue(bgTab, 'type', 'classic') === 'gradient'
                                                ? 'bg-white shadow-sm text-indigo-600'
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        Gradasi
                                    </button>
                                </div>
                            </div>

                            {/* Render fields based on Jenis Latar */}
                            {getBgValue(bgTab, 'type', 'classic') === 'classic' ? (
                                <>
                                    {/* Color Picker */}
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-gray-600">Warna Latar</span>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="color"
                                                value={getBgValue(bgTab, 'color', '#ffffff')}
                                                onChange={(e) => handleBgChange(bgTab, 'color', e.target.value)}
                                                className="w-6 h-6 border-0 p-0 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={getBgValue(bgTab, 'color', '')}
                                                onChange={(e) => handleBgChange(bgTab, 'color', e.target.value)}
                                                placeholder="transparent"
                                                className="border-gray-200 rounded-md py-0.5 px-1.5 text-xs text-center font-mono w-24 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Image URL */}
                                    <div className="space-y-1">
                                        <span className="font-semibold text-gray-600 block">Gambar Latar (URL)</span>
                                        <input
                                            type="text"
                                            value={getBgValue(bgTab, 'image', '')}
                                            onChange={(e) => handleBgChange(bgTab, 'image', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full border-gray-200 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                                        />
                                    </div>
                                </>
                            ) : (
                                /* Gradient CSS */
                                <div className="space-y-1">
                                    <span className="font-semibold text-gray-600 block">Gradient CSS (linear-gradient)</span>
                                    <input
                                        type="text"
                                        value={getBgValue(bgTab, 'gradient', '')}
                                        onChange={(e) => handleBgChange(bgTab, 'gradient', e.target.value)}
                                        placeholder="linear-gradient(to right, #ff7e5f, #feb47b)"
                                        className="w-full border-gray-200 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                                    />
                                    <span className="text-[9px] text-gray-400 block mt-0.5">
                                        Gunakan standard CSS linear-gradient atau radial-gradient.
                                    </span>
                                </div>
                            )}

                            {/* Transition duration (Only shown on Hover tab) */}
                            {bgTab === 'hover' && (
                                <div className="space-y-1 pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="font-semibold text-indigo-600">Durasi Transisi</span>
                                        <span className="font-mono text-gray-400">{getBgValue('hover', 'transitionDuration', 300)}ms</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2000"
                                        step="50"
                                        value={getBgValue('hover', 'transitionDuration', 300)}
                                        onChange={(e) => handleBgChange('hover', 'transitionDuration', parseInt(e.target.value))}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>
                            )}

                            {/* Reset background settings */}
                            <button
                                type="button"
                                onClick={() => handleAdvancedChange({ background: {} })}
                                className="w-full py-1 text-[9px] text-gray-400 hover:text-rose-500 font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 mt-1"
                            >
                                <RefreshCw className="w-2.5 h-2.5" />
                                Reset Latar Belakang
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 6. RESPON / VISIBILITAS */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('visibility')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <EyeOff className="w-3.5 h-3.5 text-indigo-500" />
                        RESPONSIF (VISIBILITAS)
                    </span>
                    {openSections.visibility ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.visibility && (
                    <div className="p-3 bg-white space-y-3 animate-fadeIn">
                        <div className="text-[10px] text-gray-400 mb-1 leading-relaxed">
                            Tampilkan atau sembunyikan elemen ini di breakpoint / jenis ukuran perangkat tertentu:
                        </div>
                        
                        <div className="space-y-2">
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
                )}
            </div>

            {/* 7. CUSTOM CSS */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleSection('css')}
                    className="w-full flex items-center justify-between p-3 font-bold bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                    <span className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-indigo-500" />
                        CUSTOM CSS
                    </span>
                    {openSections.css ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                </button>

                {openSections.css && (
                    <div className="p-3 bg-white space-y-2 animate-fadeIn">
                        <div className="text-[10px] text-gray-400 leading-relaxed mb-1">
                            Gunakan <code>selector</code> untuk menargetkan elemen ini. Contoh: <br />
                            <code className="text-gray-600 font-semibold block bg-gray-50 p-1 rounded mt-1">
                                selector &#123; border: 2px gold solid; &#125;<br />
                                selector:hover &#123; opacity: 0.8; &#125;
                            </code>
                        </div>
                        <textarea
                            value={node.advanced?.customCss || ''}
                            onChange={(e) => handleAdvancedChange({ customCss: e.target.value })}
                            rows={6}
                            className="w-full text-xs font-mono border-gray-200 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/20"
                            placeholder="selector {&#10;  transform: rotate(5deg);&#10;}"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
