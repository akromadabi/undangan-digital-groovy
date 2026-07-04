import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import SectionWrapper from './SectionWrapper';
import ContextMenu from './ContextMenu';
import { Plus, X } from 'lucide-react';

const STRUCTURE_PRESETS = [
    { name: '1 Kolom', widths: ['100%'], cols: [1] },
    { name: '2 Kolom (Sama)', widths: ['50%', '50%'], cols: [1, 1] },
    { name: '3 Kolom (Sama)', widths: ['33.33%', '33.33%', '33.33%'], cols: [1, 1, 1] },
    { name: '4 Kolom (Sama)', widths: ['25%', '25%', '25%', '25%'], cols: [1, 1, 1, 1] },
    { name: '2 Kolom (1/3, 2/3)', widths: ['33.33%', '66.66%'], cols: [1, 2] },
    { name: '2 Kolom (2/3, 1/3)', widths: ['66.66%', '33.33%'], cols: [2, 1] },
    { name: '3 Kolom (1/4, 1/2, 1/4)', widths: ['25%', '50%', '25%'], cols: [1, 2, 1] },
    { name: '3 Kolom (1/4, 1/4, 1/2)', widths: ['25%', '25%', '50%'], cols: [1, 1, 2] },
    { name: '3 Kolom (1/2, 1/4, 1/4)', widths: ['50%', '25%', '25%'], cols: [2, 1, 1] },
    { name: '5 Kolom (Sama)', widths: ['20%', '20%', '20%', '20%', '20%'], cols: [1, 1, 1, 1, 1] },
    { name: '6 Kolom (Sama)', widths: ['16.66%', '16.66%', '16.66%', '16.66%', '16.66%', '16.66%'], cols: [1, 1, 1, 1, 1, 1] },
    { name: '3 Kolom (1/6, 2/3, 1/6)', widths: ['16.66%', '66.66%', '16.66%'], cols: [1, 4, 1] }
];

function StructurePicker({ onSelect, onClose }) {
    return (
        <div className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-5 relative transition-all duration-200 ease-in-out my-4 shadow-inner">
            <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                title="Batal"
            >
                <X className="w-3.5 h-3.5" />
            </button>
            
            <div className="text-center mb-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pilih Struktur Anda</h4>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-w-2xl mx-auto">
                {STRUCTURE_PRESETS.map((preset, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(preset.widths)}
                        className="group flex flex-col gap-1 bg-white p-1.5 rounded border border-gray-200 hover:border-indigo-400 transition-all cursor-pointer shadow-sm hover:shadow"
                        title={preset.name}
                    >
                        <div className="flex gap-0.5 bg-gray-100 p-1 rounded-sm group-hover:bg-indigo-50 transition-all h-8 items-stretch">
                            {preset.cols.map((span, idx) => (
                                <div
                                    key={idx}
                                    style={{ flexGrow: span }}
                                    className="bg-gray-300 rounded-sm group-hover:bg-indigo-300 transition-colors"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Canvas() {
    const document = useBuilderStore((state) => state.document);
    const addSection = useBuilderStore((state) => state.addSection);
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);

    const [activePickerIndex, setActivePickerIndex] = React.useState(null);
    const [contextMenu, setContextMenu] = React.useState(null);

    const handleCanvasClick = (e) => {
        // Deselect if clicking on empty canvas
        if (e.target === e.currentTarget) {
            setSelectedId(null);
        }
    };

    const handleNodeContextMenu = (e, id, type, name) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({
            id,
            type,
            x: e.clientX,
            y: e.clientY,
            name
        });
    };

    // Calculate preview width classes based on active device
    const getCanvasWidthClass = () => {
        if (activeBreakpoint === 'mobile') return 'max-w-[375px] border-x border-dashed border-gray-300 shadow-lg';
        if (activeBreakpoint === 'tablet') return 'max-w-[768px] border-x border-dashed border-gray-300 shadow-md';
        return 'w-full';
    };

    return (
        <div 
            onClick={handleCanvasClick}
            className="w-full min-h-full flex flex-col items-center bg-gray-50/50 p-6 overflow-y-auto"
        >
            <div 
                className={`bg-white transition-all duration-300 ease-in-out min-h-[80vh] flex flex-col ${getCanvasWidthClass()}`}
            >
                {document.content.length === 0 ? (
                    /* EMPTY CANVAS STATE */
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 m-8 rounded-xl bg-gray-50/50">
                        {activePickerIndex === 'empty' ? (
                            <StructurePicker 
                                onSelect={(widths) => {
                                    addSection(widths);
                                    setActivePickerIndex(null);
                                }}
                                onClose={() => setActivePickerIndex(null)}
                            />
                        ) : (
                            <div className="space-y-4 max-w-sm">
                                <h3 className="text-lg font-bold text-gray-800">Mulai Desain Undangan</h3>
                                <p className="text-xs text-gray-400">
                                    Canvas Anda masih kosong. Tambahkan section baru lalu isi dengan widget seperti Judul, Gambar, atau Tombol.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setActivePickerIndex('empty')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Section Baru
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* RENDER SECTIONS */
                    <div className="flex-1 flex flex-col">
                        {document.content.map((section, index) => (
                            <React.Fragment key={section.id}>
                                {/* IN-BETWEEN SECTION ADDER */}
                                {activePickerIndex === index ? (
                                    <div className="px-6">
                                        <StructurePicker 
                                            onSelect={(widths) => {
                                                addSection(widths, index);
                                                setActivePickerIndex(null);
                                            }}
                                            onClose={() => setActivePickerIndex(null)}
                                        />
                                    </div>
                                ) : (
                                    <div className="group/adder relative h-2 hover:h-8 transition-all flex items-center justify-center">
                                        <div className="absolute inset-x-0 h-0.5 bg-indigo-200 scale-x-0 group-hover/adder:scale-x-100 transition-transform origin-center z-10" />
                                        <button
                                            type="button"
                                            onClick={() => setActivePickerIndex(index)}
                                            className="absolute scale-0 group-hover/adder:scale-100 p-1 bg-indigo-600 text-white rounded-full transition-all hover:bg-indigo-700 z-20 shadow-md hover:scale-110 active:scale-95"
                                            title="Tambah Section di sini"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}

                                <SectionWrapper 
                                    section={section} 
                                    index={index} 
                                    activeBreakpoint={activeBreakpoint}
                                    onNodeContextMenu={handleNodeContextMenu}
                                />
                            </React.Fragment>
                        ))}

                        {/* END OF CANVAS ADDER */}
                        {activePickerIndex === document.content.length ? (
                            <div className="p-6 w-full">
                                <StructurePicker 
                                    onSelect={(widths) => {
                                        addSection(widths);
                                        setActivePickerIndex(null);
                                    }}
                                    onClose={() => setActivePickerIndex(null)}
                                />
                            </div>
                        ) : (
                            <div className="p-8 flex justify-center border-t border-gray-50 bg-gray-50/20">
                                <button
                                    type="button"
                                    onClick={() => setActivePickerIndex(document.content.length)}
                                    className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 hover:text-indigo-800 border border-dashed border-indigo-300 hover:border-indigo-400 font-bold text-xs rounded-xl transition-all shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Section Akhir
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {contextMenu && (
                <ContextMenu 
                    menu={contextMenu} 
                    onClose={() => setContextMenu(null)} 
                />
            )}
        </div>
    );
}
