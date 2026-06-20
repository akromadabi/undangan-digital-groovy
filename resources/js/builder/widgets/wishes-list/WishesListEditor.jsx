import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function WishesListEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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

    if (mode === 'content') {
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Buku Tamu</h3>
                
                {/* Title */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Judul Seksi</label>
                    <input
                        type="text"
                        value={settings.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Ucapan & Doa Restu"
                    />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Deskripsi Singkat</label>
                    <textarea
                        value={settings.description || ''}
                        onChange={(e) => handleUpdate('description', e.target.value)}
                        rows={3}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="Berikan ucapan selamat..."
                    />
                </div>

                {/* Placeholders */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Placeholder Nama</label>
                    <input
                        type="text"
                        value={settings.placeholderName || ''}
                        onChange={(e) => handleUpdate('placeholderName', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Nama Anda"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Placeholder Pesan</label>
                    <input
                        type="text"
                        value={settings.placeholderMessage || ''}
                        onChange={(e) => handleUpdate('placeholderMessage', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Tulis ucapan dan doa..."
                    />
                </div>

                {/* Button Text */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Teks Tombol Kirim</label>
                    <input
                        type="text"
                        value={settings.buttonText || ''}
                        onChange={(e) => handleUpdate('buttonText', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Kirim Ucapan"
                    />
                </div>
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
                        <label className="text-xs font-semibold text-gray-700">Penjajaran Judul</label>
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

                {/* Button Colors */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Tombol</label>
                        <input
                            type="color"
                            value={settings.buttonBg || '#E5654B'}
                            onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Teks Tombol</label>
                        <input
                            type="color"
                            value={settings.buttonTextColor || '#ffffff'}
                            onChange={(e) => handleUpdate('buttonTextColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                {/* Card Background */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Latar Belakang Kartu</label>
                    <input
                        type="color"
                        value={settings.cardBg || '#ffffff'}
                        onChange={(e) => handleUpdate('cardBg', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut (Radius)</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '16px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 16px, 12px, 8px"
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
