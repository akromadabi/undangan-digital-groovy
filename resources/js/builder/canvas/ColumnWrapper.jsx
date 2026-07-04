import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import WidgetWrapper from './WidgetWrapper';
import { Trash2, Copy, Plus, Columns } from 'lucide-react';
import { getResponsiveSetting } from '../core/deepMergeResponsive';
import { compileNodeCss } from '../core/styleCompiler';

export default function ColumnWrapper({ column, index, section, activeBreakpoint, onNodeContextMenu }) {
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const addWidget = useBuilderStore((state) => state.addWidget);
    const setLeftPanelTab = useBuilderStore((state) => state.setLeftPanelTab);

    const isSelected = selectedId === column.id;
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);

    // Resolve column width responsive setting
    const rawWidth = column.settings?.width || '100%';
    const width = getResponsiveSetting(rawWidth, activeBreakpoint, '100%');

    // Resolve padding responsive setting
    const padding = column.settings?.padding || {};
    const paddingTop = getResponsiveSetting(padding.top, activeBreakpoint, '10');
    const paddingBottom = getResponsiveSetting(padding.bottom, activeBreakpoint, '10');
    const paddingLeft = getResponsiveSetting(padding.left, activeBreakpoint, '10');
    const paddingRight = getResponsiveSetting(padding.right, activeBreakpoint, '10');

    const style = {
        flex: `0 0 ${width}`,
        width: width,
        maxWidth: width,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out'
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        setSelectedId(column.id);
    };

    const handleContextMenu = (e) => {
        if (onNodeContextMenu) {
            onNodeContextMenu(e, column.id, 'column', 'Kolom');
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (section.columns.length <= 1) {
            alert('Section harus memiliki minimal 1 kolom.');
            return;
        }
        if (confirm('Hapus kolom ini beserta seluruh widget di dalamnya?')) {
            deleteNode(column.id);
        }
    };

    const handleDuplicate = (e) => {
        e.stopPropagation();
        duplicateNode(column.id);
    };

    const handleAddWidget = (e) => {
        e.stopPropagation();
        setSelectedId(column.id);
        setLeftPanelTab('widget');
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const widgetType = e.dataTransfer.getData('text/plain');
        if (widgetType) {
            addWidget(column.id, widgetType);
        }
    };

    const nodeCss = compileNodeCss(column, activeBreakpoint);

    return (
        <div 
            id={column.id}
            onClick={handleSelect}
            onContextMenu={handleContextMenu}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={style}
            className={`group/column border border-transparent min-h-[60px] transition-all ${
                isDraggingOver
                    ? 'border-indigo-500 bg-indigo-50/10 ring-2 ring-indigo-500/20'
                    : isSelected 
                        ? 'border-amber-500 ring-2 ring-amber-500/10' 
                        : 'hover:border-amber-300/40'
            }`}
        >
            {nodeCss && <style dangerouslySetInnerHTML={{ __html: nodeCss }} />}
            {/* COLUMN TOOLBAR */}
            <div className={`absolute bottom-full left-0 bg-amber-500 text-white text-[9px] font-bold rounded-t-md px-2 py-0.5 z-30 items-center gap-1.5 transition-all shadow-sm ${
                isSelected ? 'flex' : 'hidden group-hover/column:flex'
            }`}>
                <div className="flex items-center gap-1">
                    <Columns className="w-3 h-3" />
                    <span>Kolom</span>
                </div>
                
                <div className="flex items-center border-l border-amber-300 pl-1.5 gap-1">
                    <button 
                        type="button" 
                        onClick={handleAddWidget} 
                        className="hover:text-amber-100"
                        title="Tambah Widget"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDuplicate} 
                        className="hover:text-amber-100"
                        title="Duplikat Kolom"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="hover:text-red-200"
                        title="Hapus Kolom"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* WIDGETS CONTAINER */}
            <div className="flex-1 flex flex-col gap-4 min-h-[40px]">
                {column.widgets.length === 0 ? (
                    <div 
                        onClick={handleAddWidget}
                        className="flex-1 flex flex-col items-center justify-center p-3 text-center border border-dashed border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/10 transition-all cursor-pointer text-gray-400 hover:text-indigo-600 text-[10px]"
                    >
                        <Plus className="w-4 h-4 mb-0.5" />
                        <span>Klik + untuk tambah widget</span>
                    </div>
                ) : (
                    column.widgets.map((widget, wIndex) => (
                        <WidgetWrapper 
                            key={widget.id} 
                            widget={widget} 
                            index={wIndex}
                            column={column}
                            activeBreakpoint={activeBreakpoint}
                            onNodeContextMenu={onNodeContextMenu}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
