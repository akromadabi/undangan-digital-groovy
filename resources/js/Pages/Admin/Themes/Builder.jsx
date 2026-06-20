import React, { useEffect, useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { useBuilderStore, findNodeAndParent } from '../../../builder/state/builderStore';
import { createEmptyDocument } from '../../../builder/core/schema';
import Canvas from '../../../builder/canvas/Canvas';
import ContentTab from '../../../builder/panels/ContentTab';
import StyleTab from '../../../builder/panels/StyleTab';
import AdvancedTab from '../../../builder/panels/AdvancedTab';
import Navigator from '../../../builder/panels/Navigator';
import ResponsiveDeviceSwitcher from '../../../builder/panels/ResponsiveDeviceSwitcher';
import { widgetRegistry } from '../../../builder/widgets';
import axios from 'axios';

// Lucide icons
import { 
    Paintbrush, Save, Undo2, Redo2, Download, Upload, 
    X, Type, Image, MousePointerClick, Search, HelpCircle,
    ChevronRight, Layers, FileJson, CheckCircle2, AlertCircle, RefreshCw,
    FileText, Minus, ArrowUpDown, Heart, Video, Map, User, Clock, CheckSquare, Grid, CreditCard, BookOpen, Music, Users, Calendar,
    MessageSquare, Tv, Shirt
} from 'lucide-react';

export default function Builder({ theme, builderDocument, documentVersion }) {
    const documentState = useBuilderStore((state) => state.document);
    const setDocument = useBuilderStore((state) => state.setDocument);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const addSection = useBuilderStore((state) => state.addSection);
    const addWidget = useBuilderStore((state) => state.addWidget);
    const leftPanelTab = useBuilderStore((state) => state.leftPanelTab);
    const setLeftPanelTab = useBuilderStore((state) => state.setLeftPanelTab);
    
    // UI Local States
    const [rightPanelTab, setRightPanelTab] = useState('content'); // 'content' | 'style' | 'advanced'
    const [searchQuery, setSearchQuery] = useState('');
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // File inputs
    const fileInputRef = useRef(null);

    // Initialize document in store
    useEffect(() => {
        if (builderDocument) {
            setDocument(builderDocument);
        } else {
            setDocument(createEmptyDocument(theme.name));
        }
    }, [builderDocument, theme]);

    // Setup Undo/Redo functions
    const handleUndo = () => {
        try {
            useBuilderStore.temporal.getState().undo();
        } catch (e) {}
    };

    const handleRedo = () => {
        try {
            useBuilderStore.temporal.getState().redo();
        } catch (e) {}
    };

    // Save Document to Backend API
    const handleSave = async () => {
        setSaveStatus('saving');
        setSuccessMessage('');
        setErrorMessage('');
        
        try {
            const response = await axios.post(`/super-admin/theme-builder/${theme.id}/save`, {
                document: documentState,
                version: documentVersion || '1.0.0'
            });
            
            if (response.data.success) {
                setSaveStatus('saved');
                setSuccessMessage('Desain tema berhasil disimpan.');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setSaveStatus('error');
                setErrorMessage('Gagal menyimpan tema.');
            }
        } catch (error) {
            setSaveStatus('error');
            setErrorMessage(error.response?.data?.message || 'Koneksi gagal saat menyimpan tema.');
        }
    };

    // Autosave Debounce Logic (3 seconds after changes)
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setSaveStatus('saving');
        const timer = setTimeout(() => {
            handleSave();
        }, 3000);

        return () => clearTimeout(timer);
    }, [documentState]);

    // Global keyboard listener to increment/decrement numbers & percentages using Up/Down arrow keys
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

            const activeEl = document.activeElement;
            if (!activeEl || activeEl.tagName !== 'INPUT') return;
            if (activeEl.readOnly || activeEl.disabled) return;

            const type = activeEl.getAttribute('type') || 'text';
            if (type !== 'text' && type !== 'number') return;

            const value = activeEl.value.trim();
            const numericRegex = /^(-?\d*\.?\d+)(%|px|rem|em|vh|vw|s|ms)?$/i;
            const match = value.match(numericRegex);

            if (!match) return;

            e.preventDefault();

            const num = parseFloat(match[1]);
            const unit = match[2] || '';
            const step = e.shiftKey ? 10 : 1;
            const direction = e.key === 'ArrowUp' ? 1 : -1;
            
            // Preserve the original decimal precision if any
            const decimalParts = match[1].split('.');
            const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
            const precision = Math.max(decimals, 0);
            const newNum = parseFloat((num + direction * step).toFixed(precision || 3));

            const newValue = `${newNum}${unit}`;

            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (valueSetter) {
                valueSetter.call(activeEl, newValue);
                // Dispatch input and change events for React state binding to sync
                activeEl.dispatchEvent(new Event('input', { bubbles: true }));
                activeEl.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // Add Widget clicked fallback helper
    const handleWidgetClick = (widgetType) => {
        let targetColId = selectedId;
        const target = selectedId ? findNodeAndParent(documentState.content, selectedId) : null;
        
        if (!target || target.type !== 'column') {
            // Find first column or create one
            if (documentState.content.length === 0) {
                addSection();
                setTimeout(() => {
                    const currentDoc = useBuilderStore.getState().document;
                    if (currentDoc.content.length > 0 && currentDoc.content[0].columns.length > 0) {
                        const colId = currentDoc.content[0].columns[0].id;
                        addWidget(colId, widgetType);
                    }
                }, 100);
                return;
            } else {
                const lastSection = documentState.content[documentState.content.length - 1];
                const lastCol = lastSection.columns[lastSection.columns.length - 1];
                targetColId = lastCol.id;
            }
        }
        
        addWidget(targetColId, widgetType);
    };

    // Export Document JSON
    const handleExport = () => {
        window.location.href = `/super-admin/theme-builder/${theme.id}/export`;
    };

    // Trigger Import File Dialog
    const triggerImport = () => {
        fileInputRef.current?.click();
    };

    // Handle Import File JSON upload
    const handleImportFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('theme_id', theme.id);
        formData.append('file', file);

        setSaveStatus('saving');
        
        try {
            const response = await axios.post('/super-admin/theme-builder/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Reload page to refresh doc from server
            window.location.reload();
        } catch (error) {
            setSaveStatus('error');
            setErrorMessage(error.response?.data?.message || 'Gagal meng-import template.');
        }
    };

    // Icon helper map for library cards
    const widgetIcons = {
        Heading: Type,
        Image: Image,
        MousePointerClick: MousePointerClick,
        TextEditor: FileText,
        Divider: Minus,
        Spacer: ArrowUpDown,
        Icon: Heart,
        Video: Video,
        Map: Map,
        GuestName: User,
        Countdown: Clock,
        RsvpForm: CheckSquare,
        Gallery: Grid,
        DigitalEnvelope: CreditCard,
        LoveStory: BookOpen,
        MusicPlayer: Music,
        BrideGroom: Users,
        EventDetails: Calendar,
        WishesList: MessageSquare,
        Livestream: Tv,
        Dresscode: Shirt,
        TurutMengundang: Users
    };

    // Filter widgets by search query
    const filteredWidgets = Object.keys(widgetRegistry).filter(key => {
        const widget = widgetRegistry[key];
        return widget.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-100 font-sans text-gray-800">
            <Head title={`Theme Builder - ${theme.name}`} />

            {/* Hidden Input for Import */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportFile} 
                accept=".json" 
                className="hidden" 
            />

            {/* TOP BAR / HEADER */}
            <header className="h-14 bg-gray-900 text-white flex items-center justify-between px-4 border-b border-gray-800 z-50 shadow-md">
                <div className="flex items-center gap-3">
                    {/* Brand Icon */}
                    <div className="p-2 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-lg">
                        <Paintbrush className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tight">{theme.name}</h1>
                        <span className="text-[10px] text-gray-400 font-medium">Groovy Theme Builder v{documentVersion || '1.0.0'}</span>
                    </div>
                </div>

                {/* Center Device Switcher */}
                <div className="hidden md:flex items-center gap-4">
                    <ResponsiveDeviceSwitcher />
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2">
                    {/* Save Status Banner */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-800/80 border border-gray-700/50 rounded-lg text-xs font-semibold">
                        {saveStatus === 'saving' && (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                                <span className="text-indigo-400">Menyimpan...</span>
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Tersimpan</span>
                            </>
                        )}
                        {saveStatus === 'error' && (
                            <>
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                <span className="text-rose-400">Gagal</span>
                            </>
                        )}
                    </div>

                    {/* Undo / Redo */}
                    <div className="flex items-center bg-gray-800 rounded-lg p-0.5 border border-gray-700">
                        <button
                            onClick={handleUndo}
                            className="p-1.5 hover:text-white text-gray-400 rounded-md transition-all hover:bg-gray-700"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleRedo}
                            className="p-1.5 hover:text-white text-gray-400 rounded-md transition-all hover:bg-gray-700"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Import / Export */}
                    <div className="flex items-center gap-1 border-l border-gray-800 pl-2">
                        <button
                            onClick={triggerImport}
                            className="px-2.5 py-1.5 text-xs font-bold bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all border border-gray-700 flex items-center gap-1"
                            title="Import template JSON"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Import</span>
                        </button>
                        <button
                            onClick={handleExport}
                            className="px-2.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-1"
                            title="Export template JSON"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                        </button>
                    </div>

                    {/* Close / Quit */}
                    <Link
                        href="/super-admin/themes"
                        className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all border border-gray-800 hover:border-red-500/30"
                        title="Tutup Builder"
                    >
                        <X className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* MAIN LAYOUT BODY */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* LEFT PANEL (WIDGET LIBRARY / NAVIGATOR) */}
                <aside className="w-[300px] bg-white border-r border-gray-200 flex flex-col h-full z-40 select-none shadow-sm">
                    {/* Tab Navigation header */}
                    <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
                        <button
                            type="button"
                            onClick={() => setLeftPanelTab('widget')}
                            className={`flex-1 text-center py-2 text-xs font-black rounded-md transition-all ${
                                leftPanelTab === 'widget'
                                    ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/55'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Widgets
                        </button>
                        <button
                            type="button"
                            onClick={() => setLeftPanelTab('navigator')}
                            className={`flex-1 text-center py-2 text-xs font-black rounded-md transition-all ${
                                leftPanelTab === 'navigator'
                                    ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/55'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            Navigator
                        </button>
                    </div>

                    {/* Tab Content body */}
                    <div className="flex-1 overflow-y-auto">
                        {leftPanelTab === 'widget' ? (
                            /* WIDGET LIBRARY */
                            <div className="p-4 space-y-4">
                                {/* Search input */}
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded-lg pl-9 pr-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Cari widget..."
                                    />
                                </div>

                                {/* Grouped Widget List */}
                                <div className="space-y-6">
                                    {[
                                        { id: 'basic', name: 'Widget Dasar' },
                                        { id: 'custom', name: 'Fitur Undangan' }
                                    ].map((category) => {
                                        const categoryWidgets = filteredWidgets.filter(
                                            (key) => (widgetRegistry[key]?.category || 'basic') === category.id
                                        );
                                        
                                        if (categoryWidgets.length === 0) return null;

                                        return (
                                            <div key={category.id} className="space-y-2.5">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                                    {category.name}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2.5">
                                                    {categoryWidgets.map((key) => {
                                                        const widget = widgetRegistry[key];
                                                        const IconComponent = widgetIcons[widget.icon] || HelpCircle;
                                                        return (
                                                            <button
                                                                key={key}
                                                                type="button"
                                                                draggable="true"
                                                                onDragStart={(e) => {
                                                                    e.dataTransfer.setData('text/plain', key);
                                                                    e.dataTransfer.effectAllowed = 'copy';
                                                                }}
                                                                onClick={() => handleWidgetClick(key)}
                                                                className="group flex flex-col items-center justify-center p-4 border border-gray-100 hover:border-indigo-500/50 rounded-xl bg-white hover:bg-indigo-50/10 transition-all hover:shadow-sm text-center animate-fadeIn cursor-grab active:cursor-grabbing"
                                                            >
                                                                <div className="p-2.5 bg-gray-50 group-hover:bg-indigo-50 rounded-lg text-gray-500 group-hover:text-indigo-600 transition-all mb-2">
                                                                    <IconComponent className="w-5 h-5" strokeWidth={1.8} />
                                                                </div>
                                                                <span className="text-[11px] font-bold text-gray-700 group-hover:text-indigo-700 truncate w-full">
                                                                    {widget.name}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* NAVIGATOR TREE VIEW */
                            <Navigator />
                        )}
                    </div>
                </aside>

                {/* MIDDLE PANEL (INTERACTIVE CANVAS PREVIEW) */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                    {/* Status Feedback Toasts */}
                    {successMessage && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg z-50 animate-bounce">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg z-50 animate-shake">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <Canvas />
                </main>

                {/* RIGHT PANEL (3-TAB STYLE/CONTENT EDITOR) */}
                <aside className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full z-40 select-none shadow-sm">
                    {/* Tab Navigation header */}
                    <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
                        {[
                            { key: 'content', label: 'Konten' },
                            { key: 'style', label: 'Gaya' },
                            { key: 'advanced', label: 'Lanjutan' }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setRightPanelTab(tab.key)}
                                className={`flex-1 text-center py-2 text-xs font-black rounded-md transition-all ${
                                    rightPanelTab === tab.key
                                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-200/55'
                                        : 'text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content panel body */}
                    <div className="flex-1 overflow-y-auto">
                        {rightPanelTab === 'content' && <ContentTab />}
                        {rightPanelTab === 'style' && <StyleTab />}
                        {rightPanelTab === 'advanced' && <AdvancedTab />}
                    </div>
                </aside>

            </div>
        </div>
    );
}
