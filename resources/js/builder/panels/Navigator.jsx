import React, { useState } from 'react';
import { useBuilderStore } from '../state/builderStore';
import { ChevronDown, ChevronRight, Layers, Columns, Component, Trash2, Copy } from 'lucide-react';

export default function Navigator() {
    const document = useBuilderStore((state) => state.document);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);

    // Track expanded sections/columns by ID
    const [expandedIds, setExpandedIds] = useState({});

    const toggleExpand = (e, id) => {
        e.stopPropagation();
        setExpandedIds((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isExpanded = (id, defaultExpanded = true) => {
        return expandedIds[id] !== undefined ? expandedIds[id] : defaultExpanded;
    };

    const handleSelect = (e, id) => {
        e.stopPropagation();
        setSelectedId(id);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (confirm('Hapus elemen ini?')) {
            deleteNode(id);
        }
    };

    const handleDuplicate = (e, id) => {
        e.stopPropagation();
        duplicateNode(id);
    };

    return (
        <div className="p-4 space-y-4 select-none">
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>Struktur Navigator</span>
                <span className="text-[10px] text-gray-400">Section &gt; Kolom &gt; Widget</span>
            </div>

            {document.content.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">
                    Belum ada section. Tambahkan section di canvas untuk memulai.
                </div>
            ) : (
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                    {document.content.map((section, sIndex) => {
                        const sectionExpanded = isExpanded(section.id, true);
                        const sectionSelected = selectedId === section.id;

                        return (
                            <div key={section.id} className="space-y-1">
                                {/* SECTION HEADER */}
                                <div 
                                    onClick={(e) => handleSelect(e, section.id)}
                                    className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        sectionSelected 
                                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50' 
                                            : 'hover:bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <button 
                                            type="button"
                                            onClick={(e) => toggleExpand(e, section.id)}
                                            className="text-gray-400 hover:text-gray-600 rounded p-0.5"
                                        >
                                            {sectionExpanded ? (
                                                <ChevronDown className="w-3.5 h-3.5" />
                                            ) : (
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                        <Layers className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Section {sIndex + 1}</span>
                                    </div>
                                    
                                    {/* Action Hover Buttons */}
                                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                                        <button 
                                            onClick={(e) => handleDuplicate(e, section.id)}
                                            className="p-1 text-gray-400 hover:text-gray-700 rounded"
                                            title="Duplikat Section"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </button>
                                        <button 
                                            onClick={(e) => handleDelete(e, section.id)}
                                            className="p-1 text-red-400 hover:text-red-600 rounded"
                                            title="Hapus Section"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* SECTION COLUMNS LIST */}
                                {sectionExpanded && (
                                    <div className="pl-4 border-l border-gray-100 space-y-1 ml-3 mt-1">
                                        {section.columns.map((column, cIndex) => {
                                            const columnExpanded = isExpanded(column.id, true);
                                            const columnSelected = selectedId === column.id;

                                            return (
                                                <div key={column.id} className="space-y-1">
                                                    {/* COLUMN HEADER */}
                                                    <div 
                                                        onClick={(e) => handleSelect(e, column.id)}
                                                        className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                                                            columnSelected 
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-200/50' 
                                                                : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => toggleExpand(e, column.id)}
                                                                className="text-gray-400 hover:text-gray-600 rounded p-0.5"
                                                            >
                                                                {columnExpanded ? (
                                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                                ) : (
                                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                            <Columns className="w-3.5 h-3.5 text-amber-500" />
                                                            <span className="font-semibold">Kolom {cIndex + 1} ({column.settings?.width || '100%'})</span>
                                                        </div>
                                                        
                                                        {/* Action Hover Buttons */}
                                                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                                                            <button 
                                                                onClick={(e) => handleDuplicate(e, column.id)}
                                                                className="p-1 text-gray-400 hover:text-gray-700 rounded"
                                                                title="Duplikat Kolom"
                                                            >
                                                                <Copy className="w-3 h-3" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => handleDelete(e, column.id)}
                                                                className="p-1 text-red-400 hover:text-red-600 rounded"
                                                                title="Hapus Kolom"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* COLUMN WIDGETS LIST */}
                                                    {columnExpanded && (
                                                        <div className="pl-4 border-l border-gray-100 space-y-1 ml-3 mt-1">
                                                            {column.widgets.length === 0 ? (
                                                                <div className="text-[10px] text-gray-400 py-1 pl-2">
                                                                    Kosong
                                                                </div>
                                                            ) : (
                                                                column.widgets.map((widget) => {
                                                                    const widgetSelected = selectedId === widget.id;

                                                                    return (
                                                                        <div 
                                                                            key={widget.id}
                                                                            onClick={(e) => handleSelect(e, widget.id)}
                                                                            className={`group flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                                                                                widgetSelected 
                                                                                    ? 'bg-rose-50 text-rose-700 border border-rose-200/50' 
                                                                                    : 'hover:bg-gray-50 text-gray-600'
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-1.5 py-0.5">
                                                                                <Component className="w-3 h-3 text-rose-400" />
                                                                                <span className="capitalize">{widget.type}</span>
                                                                            </div>
                                                                            
                                                                            {/* Action Hover Buttons */}
                                                                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all">
                                                                                <button 
                                                                                    onClick={(e) => handleDuplicate(e, widget.id)}
                                                                                    className="p-0.5 text-gray-400 hover:text-gray-700 rounded"
                                                                                    title="Duplikat Widget"
                                                                                >
                                                                                    <Copy className="w-2.5 h-2.5" />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={(e) => handleDelete(e, widget.id)}
                                                                                    className="p-0.5 text-red-400 hover:text-red-600 rounded"
                                                                                    title="Hapus Widget"
                                                                                >
                                                                                    <Trash2 className="w-2.5 h-2.5" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
