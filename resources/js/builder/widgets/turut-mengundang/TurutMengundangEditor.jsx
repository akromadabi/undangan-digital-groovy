import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function TurutMengundangEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
        const sourceType = settings.sourceType || 'static';
        return (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Konten Turut Mengundang</h3>
                
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

                {/* Title (Always editable, since they can define the section header style) */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Judul Seksi</label>
                    <input
                        type="text"
                        value={settings.title || ''}
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2"
                        placeholder="e.g. Turut Mengundang"
                    />
                </div>

                {sourceType === 'static' ? (
                    /* Names Textarea */
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Daftar Nama (Pisahkan dengan Baris Baru)</label>
                        <textarea
                            value={settings.names || ''}
                            onChange={(e) => handleUpdate('names', e.target.value)}
                            rows={6}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 font-mono text-xs"
                            placeholder="Keluarga Besar Bpk. Ahmad (Jakarta)&#10;Keluarga Besar Ibu Siti (Bandung)&#10;Sahabat & Rekan Kerja"
                        />
                        <span className="text-[10px] text-gray-400">Tekan enter untuk menulis nama di baris baru.</span>
                    </div>
                ) : (
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-indigo-800 text-[10px] leading-relaxed">
                        Daftar nama keluarga/kerabat yang turut mengundang akan diambil secara dinamis dari pengaturan data "Turut Mengundang" klien di dashboard.
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
                        <label className="text-xs font-semibold text-gray-700">Penjajaran Teks</label>
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

                {/* Title Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Judul Seksi</label>
                    <input
                        type="color"
                        value={settings.titleColor || '#1f2937'}
                        onChange={(e) => handleUpdate('titleColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                    />
                </div>

                {/* Text Color */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Warna Daftar Nama</label>
                    <input
                        type="color"
                        value={settings.textColor || '#4b5563'}
                        onChange={(e) => handleUpdate('textColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
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
                    <label className="text-xs font-semibold text-gray-700">Font Nama</label>
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
