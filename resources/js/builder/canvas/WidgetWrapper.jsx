import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import { widgetRegistry } from '../widgets';
import { Trash2, Copy, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { getResponsiveSetting } from '../core/deepMergeResponsive';
import { compileNodeCss } from '../core/styleCompiler';

export default function WidgetWrapper({ widget, index, column, activeBreakpoint, onNodeContextMenu }) {
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const moveNode = useBuilderStore((state) => state.moveNode);
    const document = useBuilderStore((state) => state.document);

    const isSelected = selectedId === widget.id;

    // Resolve advanced responsive spacing settings
    const margin = widget.advanced?.margin || {};
    const marginTop = getResponsiveSetting(margin.top, activeBreakpoint, '0');
    const marginBottom = getResponsiveSetting(margin.bottom, activeBreakpoint, '0');
    const marginLeft = getResponsiveSetting(margin.left, activeBreakpoint, '0');
    const marginRight = getResponsiveSetting(margin.right, activeBreakpoint, '0');

    const padding = widget.advanced?.padding || {};
    const paddingTop = getResponsiveSetting(padding.top, activeBreakpoint, '0');
    const paddingBottom = getResponsiveSetting(padding.bottom, activeBreakpoint, '0');
    const paddingLeft = getResponsiveSetting(padding.left, activeBreakpoint, '0');
    const paddingRight = getResponsiveSetting(padding.right, activeBreakpoint, '0');

    // Box border / shadow settings
    const borderType = widget.settings?.borderType || 'none';
    const borderWidth = widget.settings?.borderWidth || '0px';
    const borderColor = widget.settings?.borderColor || 'transparent';
    const borderRadius = widget.settings?.borderRadius || '0px';
    const boxShadow = widget.settings?.boxShadow || 'none';

    // Device specific visibility check
    const visibility = widget.advanced?.visibility || { desktop: true, tablet: true, mobile: true };
    const isVisibleOnCurrentBreakpoint = visibility[activeBreakpoint] !== false;

    const style = {
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        borderStyle: borderType,
        borderWidth: borderType !== 'none' ? borderWidth : '0px',
        borderColor: borderColor,
        borderRadius: borderRadius,
        boxShadow: boxShadow,
        position: 'relative',
        opacity: isVisibleOnCurrentBreakpoint ? 1 : 0.4,
        transition: 'all 0.15s ease-in-out'
    };

    // Render the actual widget content
    const widgetConfig = widgetRegistry[widget.type];
    const Renderer = widgetConfig?.Renderer;

    const handleSelect = (e) => {
        e.stopPropagation();
        setSelectedId(widget.id);
    };

    const handleContextMenu = (e) => {
        if (onNodeContextMenu) {
            onNodeContextMenu(e, widget.id, 'widget', widgetConfig?.name || widget.type);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (confirm('Hapus widget ini?')) {
            deleteNode(widget.id);
        }
    };

    const handleDuplicate = (e) => {
        e.stopPropagation();
        duplicateNode(widget.id);
    };

    const handleMoveUp = (e) => {
        e.stopPropagation();
        if (index > 0) {
            const prevWidget = column.widgets[index - 1];
            moveNode(widget.id, prevWidget.id, 'before');
        }
    };

    const handleMoveDown = (e) => {
        e.stopPropagation();
        if (index < column.widgets.length - 1) {
            const nextWidget = column.widgets[index + 1];
            moveNode(widget.id, nextWidget.id, 'after');
        }
    };

    const nodeCss = compileNodeCss(widget, activeBreakpoint);

    return (
        <div 
            id={widget.id}
            onClick={handleSelect}
            onContextMenu={handleContextMenu}
            style={style}
            className={`group/widget border border-transparent p-2 rounded-md ${
                isSelected 
                    ? 'border-rose-500 ring-2 ring-rose-500/10' 
                    : 'hover:border-rose-300/40'
            }`}
        >
            {nodeCss && <style dangerouslySetInnerHTML={{ __html: nodeCss }} />}
            {/* WIDGET TOOLBAR */}
            <div className={`absolute bottom-full right-0 bg-rose-500 text-white text-[8.5px] font-bold rounded-t-md px-2 py-0.5 z-30 items-center gap-1.5 transition-all shadow-sm ${
                isSelected ? 'flex' : 'hidden group-hover/widget:flex'
            }`}>
                <span>{widgetConfig?.name || widget.type}</span>
                {!isVisibleOnCurrentBreakpoint && <span className="text-[7.5px] bg-black/25 px-1 rounded">Hidden</span>}
                
                <div className="flex items-center border-l border-rose-300 pl-1.5 gap-1">
                    <button 
                        type="button" 
                        onClick={handleMoveUp} 
                        disabled={index === 0}
                        className="hover:text-rose-100 disabled:opacity-30 disabled:hover:text-white"
                        title="Geser Atas"
                    >
                        <ArrowUp className="w-3 h-3" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleMoveDown} 
                        disabled={index === column.widgets.length - 1}
                        className="hover:text-rose-100 disabled:opacity-30 disabled:hover:text-white"
                        title="Geser Bawah"
                    >
                        <ArrowDown className="w-3 h-3" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDuplicate} 
                        className="hover:text-rose-100"
                        title="Duplikat Widget"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                    <button 
                        type="button" 
                        onClick={handleDelete} 
                        className="hover:text-red-200"
                        title="Hapus Widget"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* WIDGET RENDER */}
            <div className="w-full">
                {Renderer ? (
                    <Renderer 
                        settings={widget.settings || {}} 
                        activeBreakpoint={activeBreakpoint}
                        globalSettings={document.globalSettings}
                    />
                ) : (
                    <div className="p-3 text-center text-xs text-red-500 bg-red-50 border border-red-200 rounded">
                        Widget {widget.type} tidak terdaftar!
                    </div>
                )}
            </div>
        </div>
    );
}
