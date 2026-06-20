import React from 'react';
import { Plus, Trash, Image as ImageIcon, Grid, Database, Palette } from 'lucide-react';

export default function GalleryEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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

    const sourceType = settings.sourceType || 'static';

    const images = settings.images || [
        { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', caption: 'Moment Indah' },
        { id: '2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', caption: 'Kebersamaan Kita' },
        { id: '3', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', caption: 'Janji Suci' },
        { id: '4', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800', caption: 'Kisah Kasih' }
    ];

    const handleAddImage = () => {
        const newImage = {
            id: Date.now().toString(),
            url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
            caption: 'Foto Baru'
        };
        handleUpdate('images', [...images, newImage]);
    };

    const handleUpdateImage = (index, field, value) => {
        const updated = [...images];
        updated[index] = { ...updated[index], [field]: value };
        handleUpdate('images', updated);
    };

    const handleRemoveImage = (index) => {
        const updated = images.filter((_, idx) => idx !== index);
        handleUpdate('images', updated);
    };

    if (mode === 'content') {
        return (
            <div className="space-y-6">
                {/* SOURCE TYPE */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" /> Sumber Data
                    </h3>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Sumber Data</label>
                        <select
                            value={sourceType}
                            onChange={(e) => handleUpdate('sourceType', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                        >
                            <option value="static">Statis (Isi Manual di Sini)</option>
                            <option value="dynamic">Dinamis (Mengikuti Galeri User)</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* IMAGES LIST (STATIC) OR DYNAMIC NOTICE */}
                {sourceType === 'static' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Daftar Gambar
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {images.map((img, idx) => (
                                <div key={img.id || idx} className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 font-mono">FOTO #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Hapus Foto"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">URL Gambar</label>
                                            <input
                                                type="text"
                                                value={img.url}
                                                onChange={(e) => handleUpdateImage(idx, 'url', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 font-mono bg-white"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Keterangan / Caption</label>
                                            <input
                                                type="text"
                                                value={img.caption || ''}
                                                onChange={(e) => handleUpdateImage(idx, 'caption', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                placeholder="e.g. Moment Prewedding"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
                            <Database className="w-4 h-4 shrink-0" />
                            <span>Mode Data Dinamis Aktif</span>
                        </div>
                        <p className="text-[11px] text-indigo-600 leading-relaxed">
                            Foto galeri prewedding akan dimuat otomatis dari daftar foto <strong>Galeri Undangan</strong> yang diunggah oleh pengguna di dashboard.
                        </p>
                        <p className="text-[10px] text-gray-400 italic">
                            *Di editor pratinjau, kami tetap menampilkan data contoh visual agar Anda dapat mendesain tata letaknya dengan mudah.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* LAYOUT SETTINGS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5" /> Tata Letak
                </h3>
                
                {/* Layout Type */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Tipe Tata Letak</label>
                    <select
                        value={settings.layout || 'grid'}
                        onChange={(e) => handleUpdate('layout', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="grid">Grid (Kotak-kotak)</option>
                        <option value="masonry">Masonry (Bebas Tinggi)</option>
                        <option value="carousel">Carousel (Slider Geser)</option>
                    </select>
                </div>

                {/* Columns (Responsive - Grid/Masonry only) */}
                {settings.layout !== 'carousel' && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-700">Jumlah Kolom</label>
                            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded capitalize">
                                {getResponsiveValue('columns', '3')} Kolom ({activeBreakpoint})
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="6"
                            step="1"
                            value={getResponsiveValue('columns', '3')}
                            onChange={(e) => handleUpdateResponsive('columns', e.target.value)}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                            <span>1 Kolom</span>
                            <span>6 Kolom</span>
                        </div>
                    </div>
                )}

                {/* Aspect Ratio */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Rasio Foto</label>
                    <select
                        value={settings.aspectRatio || 'square'}
                        onChange={(e) => handleUpdate('aspectRatio', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="square">Persegi (1:1)</option>
                        <option value="video">Lebar (16:9)</option>
                        <option value="portrait">Tinggi (3:4)</option>
                        <option value="auto">Asli (Auto)</option>
                    </select>
                </div>

                {/* Gap Spacing (Responsive) */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Jarak Antar Foto (px)</label>
                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded capitalize">
                            {getResponsiveValue('gap', '16px')} ({activeBreakpoint})
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        step="4"
                        value={parseInt(getResponsiveValue('gap', '16px'), 10)}
                        onChange={(e) => handleUpdateResponsive('gap', `${e.target.value}px`)}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                        <span>0px</span>
                        <span>40px</span>
                    </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut (Radius)</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '8px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 8px, 12px, 0px"
                    />
                </div>
            </div>
        </div>
    );
}
