import React, { useEffect, useRef } from 'react';
import { useBuilderStore } from '../state/builderStore';
import { Edit2, Copy, Clipboard, RefreshCw, Trash2, Columns, List } from 'lucide-react';

export default function ContextMenu({ menu, onClose }) {
    const { id, type, x, y, name } = menu;
    const menuRef = useRef(null);

    const deleteNode = useBuilderStore((state) => state.deleteNode);
    const duplicateNode = useBuilderStore((state) => state.duplicateNode);
    const copyNode = useBuilderStore((state) => state.copyNode);
    const pasteNode = useBuilderStore((state) => state.pasteNode);
    const resetNodeStyle = useBuilderStore((state) => state.resetNodeStyle);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);
    const setLeftPanelTab = useBuilderStore((state) => state.setLeftPanelTab);
    const addColumn = useBuilderStore((state) => state.addColumn);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Check if there is anything in clipboard to enable paste
    const hasClipboard = !!localStorage.getItem('builder_copied_node');

    const handleAction = (action) => {
        onClose();
        switch (action) {
            case 'edit':
                setSelectedId(id);
                setLeftPanelTab('style'); // focus on editing styles/settings
                break;
            case 'duplicate':
                duplicateNode(id);
                break;
            case 'delete':
                if (confirm(`Hapus ${type === 'section' ? 'section' : type === 'column' ? 'kolom' : 'widget'} ini?`)) {
                    deleteNode(id);
                }
                break;
            case 'copy':
                copyNode(id);
                break;
            case 'paste':
                pasteNode(id);
                break;
            case 'reset-style':
                if (confirm('Setel ulang gaya elemen ini?')) {
                    resetNodeStyle(id);
                }
                break;
            case 'add-column':
                if (type === 'section') {
                    addColumn(id);
                }
                break;
            case 'navigator':
                setLeftPanelTab('navigator');
                break;
            default:
                break;
        }
    };

    // Calculate menu position to prevent going off-screen
    const menuWidth = 180;
    const menuHeight = 250;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuWidth > screenWidth) {
        adjustedX = screenWidth - menuWidth - 10;
    }
    if (y + menuHeight > screenHeight) {
        adjustedY = screenHeight - menuHeight - 10;
    }

    const itemClass = "w-full flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-indigo-600 hover:text-white transition-all duration-150 cursor-pointer text-left border-none bg-transparent";
    const dividerClass = "border-t border-gray-100 my-1";

    return (
        <div
            ref={menuRef}
            style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
            className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-[180px] select-none outline-none animate-in fade-in zoom-in-95 duration-100"
        >
            {/* Header / Info */}
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Aksi {type === 'section' ? 'Section' : type === 'column' ? 'Kolom' : 'Widget'}
            </div>
            <div className="border-b border-gray-100 pb-1 mb-1 px-3 text-[10px] text-gray-500 truncate">
                {name || type}
            </div>

            {/* Actions */}
            <button onClick={() => handleAction('edit')} className={itemClass}>
                <span className="flex items-center gap-2"><Edit2 className="w-3.5 h-3.5" /> Sunting</span>
            </button>
            
            <button onClick={() => handleAction('duplicate')} className={itemClass}>
                <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Gandakan</span>
                <span className="text-[9px] opacity-50">^D</span>
            </button>

            <div className={dividerClass} />

            <button onClick={() => handleAction('copy')} className={itemClass}>
                <span className="flex items-center gap-2"><Copy className="w-3.5 h-3.5" /> Salin</span>
                <span className="text-[9px] opacity-50">^C</span>
            </button>

            <button
                onClick={() => handleAction('paste')}
                disabled={!hasClipboard}
                className={`${itemClass} disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400`}
            >
                <span className="flex items-center gap-2"><Clipboard className="w-3.5 h-3.5" /> Tempel</span>
                <span className="text-[9px] opacity-50">^V</span>
            </button>

            <button onClick={() => handleAction('reset-style')} className={itemClass}>
                <span className="flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Setel Ulang Gaya</span>
            </button>

            <div className={dividerClass} />

            {type === 'section' && (
                <button onClick={() => handleAction('add-column')} className={itemClass}>
                    <span className="flex items-center gap-2"><Columns className="w-3.5 h-3.5" /> Tambah Kolom</span>
                </button>
            )}

            <button onClick={() => handleAction('navigator')} className={itemClass}>
                <span className="flex items-center gap-2"><List className="w-3.5 h-3.5" /> Navigator</span>
            </button>

            <div className={dividerClass} />

            <button onClick={() => handleAction('delete')} className={`${itemClass} hover:bg-red-600 hover:text-white text-red-600`}>
                <span className="flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Hapus</span>
                <span className="text-[9px] opacity-50">Del</span>
            </button>
        </div>
    );
}
