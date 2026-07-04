import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import ColumnWrapper from './ColumnWrapper';
import { Copy, Trash2, ArrowUp, ArrowDown, Plus, Layout } from 'lucide-react';
import { getResponsiveSetting } from '../core/deepMergeResponsive';
import { compileNodeCss } from '../core/styleCompiler';

export default function SectionWrapper({ section, index, activeBreakpoint, onNodeContextMenu }) {
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const addColumn = useBuilderStore((state) => state.addColumn);
    const document = useBuilderStore((state) => state.document);
    const moveNode = useBuilderStore((state) => state.moveNode);

    const isSelected = selectedId === section.id;

    // Resolve responsive settings
    const padding = section.settings?.padding || {};
    const paddingTop = getResponsiveSetting(padding.top, activeBreakpoint, '30');
    const paddingBottom = getResponsiveSetting(padding.bottom, activeBreakpoint, '30');
    const paddingLeft = getResponsiveSetting(padding.left, activeBreakpoint, '20');
    const paddingRight = getResponsiveSetting(padding.right, activeBreakpoint, '20');

    const margin = section.advanced?.margin || {};
    const marginTop = getResponsiveSetting(margin.top, activeBreakpoint, '0');
    const marginBottom = getResponsiveSetting(margin.bottom, activeBreakpoint, '0');
    const marginLeft = getResponsiveSetting(margin.left, activeBreakpoint, '0');
    const marginRight = getResponsiveSetting(margin.right, activeBreakpoint, '0');

    const backgroundColor = section.settings?.backgroundColor || 'transparent';
    const backgroundImage = section.settings?.backgroundImage || '';

    // Build style object
    const style = {
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        transition: 'all 0.2s ease-in-out'
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        setSelectedId(section.id);
    };

    const handleContextMenu = (e) => {
        if (onNodeContextMenu) {
            onNodeContextMenu(e, section.id, 'section', 'Section');
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm('Hapus section ini beserta seluruh kolom & widget di dalamnya?')) {
            deleteNode(section.id);
        }
    };

    const handleDuplicate = (e) => {
        e.stopPropagation();
        duplicateNode(section.id);
    };

    const handleAddColumn = (e) => {
        e.stopPropagation();
        addColumn(section.id);
    };

    const handleMoveUp = (e) => {
        e.stopPropagation();
        if (index > 0) {
            const prevSection = document.content[index - 1];
            moveNode(section.id, prevSection.id, 'before');
        }
    };

    const handleMoveDown = (e) => {
        e.stopPropagation();
        if (index < document.content.length - 1) {
            const nextSection = document.content[index + 1];
            moveNode(section.id, nextSection.id, 'after');
        }
    };

    const nodeCss = compileNodeCss(section, activeBreakpoint);

    return (
        <div 
            id={section.id}
            onClick={handleSelect}
            onContextMenu={handleContextMenu}
            style={style}
            className={`group/section border-2 border-transparent ${
                isSelected 
                    ? 'border-indigo-600 ring-2 ring-indigo-600/10' 
                    : 'hover:border-indigo-300/60'
            }`}
        >
            {nodeCss && <style dangerouslySetInnerHTML={{ __html: nodeCss }} />}
            {/* SECTION TOOLBAR (Visible on hover or when selected) */}
            <div className={`absolute bottom-full left-0 bg-indigo-600 text-white text-[10px] font-bold rounded-t-md px-2.5 py-1 z-40 items-center gap-2.5 transition-all shadow-sm ${
                isSelected ? 'flex' : 'hidden group-hover/section:flex'
            }`}>
                <div className="flex items-center gap-1">
                    <Layout className="w-3.5 h-3.5" />
                    <span>Section</span>
                </div>
                
                <div className="flex items-center border-l border-indigo-400 pl-2 gap-1.5">
                    <button 
                        type="button" 
                        onClick={handleMoveUp} 
                        disabled={index === 0}
                        className="hover:text-indigo-200 disabled:opacity-30 disabled:hover:text-white"
                        title="Geser Atas"
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleMoveDown} 
                        disabled={index === document.content.length - 1}
                        className="hover:text-indigo-200 disabled:opacity-30 disabled:hover:text-white"
                        title="Geser Bawah"
                    >
                        <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleAddColumn} 
                        className="hover:text-indigo-200"
                        title="Tambah Kolom"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDuplicate} 
                        className="hover:text-indigo-200"
                        title="Duplikat Section"
                    >
                        <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="hover:text-red-300"
                        title="Hapus Section"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* COLUMNS RENDER CONTAINER */}
            <div className="flex flex-wrap w-full min-h-[40px] items-stretch gap-y-4">
                {section.columns.map((column, cIndex) => (
                    <ColumnWrapper 
                        key={column.id} 
                        column={column} 
                        index={cIndex}
                        section={section}
                        activeBreakpoint={activeBreakpoint}
                        onNodeContextMenu={onNodeContextMenu}
                    />
                ))}
            </div>
        </div>
    );
}
