import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Plus } from 'lucide-react';

export default function DresscodeEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    const handleUpdateResponsive = (key, value) => {
        const current = settings[key] && typeof settings[key] === 'object' 
            ? { ...settings[key] } 
            : { desktop: settings[key] || '' };
        current[activeBreakpoint] = value;
        onChange({ [key]: current });
    };

    const getResponsiveValue = (key, fallback = '') => {
        const val = settings[key];
        if (val && typeof val === 'object') {
            return val[activeBreakpoint] !== undefined ? val[activeBreakpoint] : (val.desktop || fallback);
        }
        return val || fallback;
    };

    const colors = settings.colors || ['#F5EBE0', '#D6CCC2', '#E3D5CA', '#D5BDAF', '#4A3E3D'];

    const handleColorChange = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        handleUpdate('colors', newColors);
    };

    const handleAddColor = () => {
        const newColors = [...colors, '#ffffff'];
        handleUpdate('colors', newColors);
    };

    const handleRemoveColor = (index) => {
        const newColors = colors.filter((_, i) => i !== index);
        handleUpdate('colors', newColors);
    };

    if (mode === 'content') {
        const sourceType = settings.sourceType || 'static';
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Dresscode</h3>
                
                {/* Source Type Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Sumber Data</label>
                    <select
                        value={sourceType}
                        onChange={(e) => handleUpdate('sourceType', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="static">Statis (Custom Input di sini)</option>
                        <option value="dynamic">Dinamis (Dari Data Undangan Klien)</option>
                    </select>
                </div>

                {sourceType === 'static' ? (
                    <>
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Judul</label>
                            <input
                                type="text"
                                value={settings.title || ''}
                                onChange={(e) => handleUpdate('title', e.target.value)}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="e.g. Dresscode / Tata Busana"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700">Deskripsi/Panduan</label>
                            <textarea
                                value={settings.description || ''}
                                onChange={(e) => handleUpdate('description', e.target.value)}
                                rows={3}
                                className="w-full text-sm border-gray-200 rounded-lg p-2"
                                placeholder="Demi kenyamanan bersama..."
                            />
                        </div>

                        {/* Color List Editor */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-700 block">Daftar Lingkaran Warna</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {colors.map((color, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={color}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                        />
                                        <input
                                            type="text"
                                            value={color}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="flex-1 text-sm border-gray-200 rounded-lg p-1.5 font-mono text-xs uppercase"
                                            placeholder="#HEX"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColor(index)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Hapus Warna"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="w-full py-2 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-600 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Warna Baru</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-800 text-[10px] leading-relaxed">
                        Data panduan pakaian dan palet warna akan diambil secara dinamis dari pengaturan data dresscode klien di dashboard.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ALIGNMENT */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Perataan</h3>
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Penjajaran Konten</label>
                        <span className="text-[10px] text-gray-400 capitalize">({activeBreakpoint})</span>
                    </div>
                    <div className="flex bg-gray-100 p-0.5 rounded-lg max-w-xs">
                        {[
                            { value: 'left', Icon: AlignLeft },
                            { value: 'center', Icon: AlignCenter },
                            { value: 'right', Icon: AlignRight }
                        ].map((item) => {
                            const currentValue = getResponsiveValue('alignment', 'center');
                            const active = currentValue === item.value;
                            return (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleUpdateResponsive('alignment', item.value)}
                                    className={`flex-1 flex justify-center py-1.5 rounded-md transition-all ${
                                        active 
                                            ? 'bg-white text-indigo-600 shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    <item.Icon className="w-4 h-4" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* STYLE & DESIGN */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Warna & Desain</h3>

                {/* Card Background */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Latar Belakang Kartu</label>
                    <input
                        type="color"
                        value={settings.cardBg || '#faf9f6'}
                        onChange={(e) => handleUpdate('cardBg', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut (Radius)</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '12px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 12px, 8px, 16px"
                    />
                </div>

                {/* Font Families */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul</label>
                    <select
                        value={settings.titleFontFamily || 'default'}
                        onChange={(e) => handleUpdate('titleFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                    >
                        <option value="default">Default Tema</option>
                        <option value="Playfair Display">Playfair Display (Serif Elegan)</option>
                        <option value="Cinzel">Cinzel (Klasik Premium)</option>
                        <option value="Great Vibes">Great Vibes (Kaligrafi Tradisional)</option>
                        <option value="Sacramento">Sacramento (Kaligrafi Minimalis)</option>
                        <option value="Inter">Inter (Sans-serif Bersih)</option>
                        <option value="Montserrat">Montserrat (Modern Geometris)</option>
                        <option value="Outfit">Outfit (Minimalis Premium)</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Konten</label>
                    <select
                        value={settings.bodyFontFamily || 'default'}
                        onChange={(e) => handleUpdate('bodyFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                    >
                        <option value="default">Default Tema</option>
                        <option value="Playfair Display">Playfair Display (Serif Elegan)</option>
                        <option value="Cinzel">Cinzel (Klasik Premium)</option>
                        <option value="Great Vibes">Great Vibes (Kaligrafi Tradisional)</option>
                        <option value="Sacramento">Sacramento (Kaligrafi Minimalis)</option>
                        <option value="Inter">Inter (Sans-serif Bersih)</option>
                        <option value="Montserrat">Montserrat (Modern Geometris)</option>
                        <option value="Outfit">Outfit (Minimalis Premium)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
