import React from 'react';
import { Database, Palette, Sliders, User } from 'lucide-react';

const PRESETS = {
    terracotta: {
        primaryColor: '#b35c3c',
        nameColor: '#3d302a',
        parentColor: '#5c4c43',
        textColor: '#3d302a',
        cardBg: '#f5ebe0',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat',
        borderRadius: '16px'
    },
    sage: {
        primaryColor: '#8a9a86',
        nameColor: '#2f3e2d',
        parentColor: '#4a5548',
        textColor: '#2f3e2d',
        cardBg: '#f4f6f3',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter',
        borderRadius: '12px'
    },
    luxury: {
        primaryColor: '#c5a880',
        nameColor: '#0d1e3d',
        parentColor: '#3b4b66',
        textColor: '#0d1e3d',
        cardBg: '#ffffff',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat',
        borderRadius: '4px'
    },
    romantic: {
        primaryColor: '#e8a7a1',
        nameColor: '#4a3e3d',
        parentColor: '#7a6b6a',
        textColor: '#4a3e3d',
        cardBg: '#fff9f8',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit',
        borderRadius: '24px'
    },
    retro: {
        primaryColor: '#d97706',
        nameColor: '#18181b',
        parentColor: '#4b5563',
        textColor: '#18181b',
        cardBg: '#fafaf9',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat',
        borderRadius: '30px'
    }
};

export default function BrideGroomEditor({ settings = {}, onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    const handleUpdateNested = (nestedKey, key, value) => {
        const current = settings[nestedKey] || {};
        onChange({
            [nestedKey]: { ...current, [key]: value }
        });
    };

    const sourceType = settings.sourceType || 'static';
    const layoutModel = settings.layoutModel || 'columns';

    // Fallbacks
    const groom = settings.groom || {
        nickname: 'Ahmad',
        full_name: 'Ahmad Rafli, S.Kom.',
        father_name: 'Heri Susanto',
        mother_name: 'Sri Wahyuni',
        instagram: 'ahmad.rafli',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    };

    const bride = settings.bride || {
        nickname: 'Siti',
        full_name: 'Siti Aminah, S.E.',
        father_name: 'M. Yusuf',
        mother_name: 'Nur Aini',
        instagram: 'siti.aminah',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    };

    if (mode === 'content') {
        return (
            <div className="space-y-6">
                {/* GENERAL SETTINGS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5" /> Sumber Data
                    </h3>

                    {/* Source Type Selector */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Pilih Sumber Data</label>
                        <select
                            value={sourceType}
                            onChange={(e) => handleUpdate('sourceType', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                        >
                            <option value="static">Statis (Isi Manual di Sini)</option>
                            <option value="dynamic">Dinamis (Mengikuti Data Mempelai)</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* MEMPELAI DATA (STATIC ONLY) */}
                {sourceType === 'static' ? (
                    <div className="space-y-6">
                        {/* GROOM DATA */}
                        <div className="p-4 bg-blue-50/20 border border-blue-100 rounded-xl space-y-3">
                            <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                                <User className="w-4 h-4" /> Mempelai Pria (Groom)
                            </h4>
                            
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Panggilan</label>
                                        <input
                                            type="text"
                                            value={groom.nickname}
                                            onChange={(e) => handleUpdateNested('groom', 'nickname', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Username IG</label>
                                        <input
                                            type="text"
                                            value={groom.instagram || ''}
                                            onChange={(e) => handleUpdateNested('groom', 'instagram', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-semibold font-mono"
                                            placeholder="e.g. ahmad.rafli"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Lengkap & Gelar</label>
                                    <input
                                        type="text"
                                        value={groom.full_name}
                                        onChange={(e) => handleUpdateNested('groom', 'full_name', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Ayah</label>
                                        <input
                                            type="text"
                                            value={groom.father_name}
                                            onChange={(e) => handleUpdateNested('groom', 'father_name', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Ibu</label>
                                        <input
                                            type="text"
                                            value={groom.mother_name}
                                            onChange={(e) => handleUpdateNested('groom', 'mother_name', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">URL Foto</label>
                                    <input
                                        type="text"
                                        value={groom.photo || ''}
                                        onChange={(e) => handleUpdateNested('groom', 'photo', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-mono"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BRIDE DATA */}
                        <div className="p-4 bg-pink-50/20 border border-pink-100 rounded-xl space-y-3">
                            <h4 className="text-xs font-bold text-pink-800 flex items-center gap-1.5">
                                <User className="w-4 h-4" /> Mempelai Wanita (Bride)
                            </h4>
                            
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Panggilan</label>
                                        <input
                                            type="text"
                                            value={bride.nickname}
                                            onChange={(e) => handleUpdateNested('bride', 'nickname', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Username IG</label>
                                        <input
                                            type="text"
                                            value={bride.instagram || ''}
                                            onChange={(e) => handleUpdateNested('bride', 'instagram', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-semibold font-mono"
                                            placeholder="e.g. siti.aminah"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Lengkap & Gelar</label>
                                    <input
                                        type="text"
                                        value={bride.full_name}
                                        onChange={(e) => handleUpdateNested('bride', 'full_name', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Ayah</label>
                                        <input
                                            type="text"
                                            value={bride.father_name}
                                            onChange={(e) => handleUpdateNested('bride', 'father_name', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Nama Ibu</label>
                                        <input
                                            type="text"
                                            value={bride.mother_name}
                                            onChange={(e) => handleUpdateNested('bride', 'mother_name', e.target.value)}
                                            className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">URL Foto</label>
                                    <input
                                        type="text"
                                        value={bride.photo || ''}
                                        onChange={(e) => handleUpdateNested('bride', 'photo', e.target.value)}
                                        className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-mono"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-xs">
                            <Database className="w-4 h-4 shrink-0" />
                            <span>Mode Data Dinamis Aktif</span>
                        </div>
                        <p className="text-[11px] text-indigo-600 leading-relaxed">
                            Data kedua mempelai akan dimuat secara otomatis dari daftar <strong>Mempelai Pria & Wanita</strong> yang diisi oleh pengguna di dashboard mereka.
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
            {/* GENERAL LAYOUT SETTINGS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Tata Letak
                </h3>

                {/* Layout Model */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Model Layout (Template)</label>
                    <select
                        value={layoutModel}
                        onChange={(e) => handleUpdate('layoutModel', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="columns">Side-by-Side (Berdampingan)</option>
                        <option value="circle">Side-by-Side Lingkaran (Bulat)</option>
                        <option value="vertical">Vertical Stack (Menurun)</option>
                    </select>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* STYLING & COLORS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Desain & Warna
                </h3>

                {/* Preset Style Selector */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Preset Gaya Cepat (Tema)</label>
                    <select
                        value=""
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val && PRESETS[val]) {
                                onChange({
                                    ...settings,
                                    ...PRESETS[val]
                                });
                            }
                        }}
                        className="w-full text-xs border-indigo-200 rounded-lg p-2 bg-indigo-50/50 text-indigo-700 font-semibold focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Terapkan Gaya Preset Tema --</option>
                        <option value="terracotta">Terracotta Minimalist</option>
                        <option value="sage">Sage Minimalist</option>
                        <option value="luxury">Luxury Gold & Navy</option>
                        <option value="romantic">Romantic Blush Pink</option>
                        <option value="retro">Modern Retro (Vinyl)</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Aksen (Heart/Icon)</label>
                        <input
                            type="color"
                            value={settings.primaryColor || '#E5654B'}
                            onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Nama</label>
                        <input
                            type="color"
                            value={settings.nameColor || '#1f2937'}
                            onChange={(e) => handleUpdate('nameColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Ortu</label>
                        <input
                            type="color"
                            value={settings.parentColor || '#6b7280'}
                            onChange={(e) => handleUpdate('parentColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Teks Lainnya</label>
                        <input
                            type="color"
                            value={settings.textColor || '#374151'}
                            onChange={(e) => handleUpdate('textColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Belakang Kartu</label>
                        <input
                            type="color"
                            value={settings.cardBg || '#ffffff'}
                            onChange={(e) => handleUpdate('cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul / Nama</label>
                    <select
                        value={settings.titleFontFamily || 'default'}
                        onChange={(e) => handleUpdate('titleFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
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
                    <label className="text-xs font-semibold text-gray-700">Font Konten / Deskripsi</label>
                    <select
                        value={settings.bodyFontFamily || 'default'}
                        onChange={(e) => handleUpdate('bodyFontFamily', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2"
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
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut Kartu</label>
                    <input
                        type="text"
                        value={settings.borderRadius || '16px'}
                        onChange={(e) => handleUpdate('borderRadius', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-1.5 font-mono"
                        placeholder="e.g. 16px, 12px, 0px"
                    />
                </div>
            </div>
        </div>
    );
}
