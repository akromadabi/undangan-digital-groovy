import React from 'react';
import { useBuilderStore } from '../state/builderStore';
import SectionWrapper from './SectionWrapper';
import { Plus } from 'lucide-react';

export default function Canvas() {
    const document = useBuilderStore((state) => state.document);
    const addSection = useBuilderStore((state) => state.addSection);
    const activeBreakpoint = useBuilderStore((state) => state.activeBreakpoint);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const setSelectedId = useBuilderStore((state) => state.setSelectedId);

    const handleCanvasClick = (e) => {
        // Deselect if clicking on empty canvas
        if (e.target === e.currentTarget) {
            setSelectedId(null);
        }
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
                        <div className="space-y-4 max-w-sm">
                            <h3 className="text-lg font-bold text-gray-800">Mulai Desain Undangan</h3>
                            <p className="text-xs text-gray-400">
                                Canvas Anda masih kosong. Tambahkan section baru lalu isi dengan widget seperti Judul, Gambar, atau Tombol.
                            </p>
                            <button
                                type="button"
                                onClick={() => addSection()}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Section Baru
                            </button>
                        </div>
                    </div>
                ) : (
                    /* RENDER SECTIONS */
                    <div className="flex-1 flex flex-col">
                        {document.content.map((section, index) => (
                            <React.Fragment key={section.id}>
                                {/* IN-BETWEEN SECTION ADDER */}
                                <div className="group/adder relative h-2 hover:h-8 transition-all flex items-center justify-center">
                                    <div className="absolute inset-x-0 h-0.5 bg-indigo-200 scale-x-0 group-hover/adder:scale-x-100 transition-transform origin-center z-10" />
                                    <button
                                        type="button"
                                        onClick={() => addSection(index)}
                                        className="absolute scale-0 group-hover/adder:scale-100 p-1 bg-indigo-600 text-white rounded-full transition-all hover:bg-indigo-700 z-20 shadow-md hover:scale-110 active:scale-95"
                                        title="Tambah Section di sini"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <SectionWrapper 
                                    section={section} 
                                    index={index} 
                                    activeBreakpoint={activeBreakpoint}
                                />
                            </React.Fragment>
                        ))}

                        {/* END OF CANVAS ADDER */}
                        <div className="p-8 flex justify-center border-t border-gray-50 bg-gray-50/20">
                            <button
                                type="button"
                                onClick={() => addSection()}
                                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 hover:text-indigo-800 border border-dashed border-indigo-300 hover:border-indigo-400 font-bold text-xs rounded-xl transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Section Akhir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
