import React from 'react';
import { BookOpen, Database, Palette, Plus, Sliders, Trash } from 'lucide-react';

const PRESETS = {
    terracotta: {
        headerColor: '#3d302a',
        timelineColor: '#b35c3c',
        nodeBg: '#f5ebe0',
        cardBg: '#f5ebe0',
        titleColor: '#3d302a',
        dateColor: '#b35c3c',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat'
    },
    sage: {
        headerColor: '#2f3e2d',
        timelineColor: '#8a9a86',
        nodeBg: '#f4f6f3',
        cardBg: '#f4f6f3',
        titleColor: '#2f3e2d',
        dateColor: '#8a9a86',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter'
    },
    luxury: {
        headerColor: '#0d1e3d',
        timelineColor: '#c5a880',
        nodeBg: '#ffffff',
        cardBg: '#ffffff',
        titleColor: '#0d1e3d',
        dateColor: '#c5a880',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat'
    },
    romantic: {
        headerColor: '#4a3e3d',
        timelineColor: '#e8a7a1',
        nodeBg: '#fff9f8',
        cardBg: '#fff9f8',
        titleColor: '#4a3e3d',
        dateColor: '#e8a7a1',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit'
    },
    retro: {
        headerColor: '#18181b',
        timelineColor: '#d97706',
        nodeBg: '#fafaf9',
        cardBg: '#fafaf9',
        titleColor: '#18181b',
        dateColor: '#d97706',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat'
    }
};

export default function LoveStoryEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
    const handleUpdate = (key, value) => {
        onChange({ [key]: value });
    };

    const handleUpdateStory = (index, field, value) => {
        const updated = [...stories];
        updated[index] = { ...updated[index], [field]: value };
        handleUpdate('stories', updated);
    };

    const handleRemoveStory = (index) => {
        const updated = stories.filter((_, idx) => idx !== index);
        handleUpdate('stories', updated);
    };

    const handleAddStory = () => {
        const newStory = {
            id: Date.now().toString(),
            date: 'Tanggal / Tahun',
            title: 'Judul Peristiwa',
            desc: 'Ceritakan detail peristiwa indah tersebut di sini...',
            imageUrl: ''
        };
        handleUpdate('stories', [...stories, newStory]);
    };

    const sourceType = settings.sourceType || 'static';
    const layoutModel = settings.layoutModel || 'alternating';

    const stories = settings.stories || [
        { id: '1', date: '15 Januari 2020', title: 'Pertama Bertemu', desc: 'Awal mula pertemuan kami yang tidak disengaja di sebuah kedai kopi. Tatap mata pertama yang menumbuhkan rasa ketertarikan.', imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500' },
        { id: '2', date: '20 Agustus 2022', title: 'Menjalin Komitmen', desc: 'Setelah sekian lama saling mengenal, kami memutuskan untuk berkomitmen melangkah bersama dalam ikatan kasih yang lebih serius.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500' },
        { id: '3', date: '12 Desember 2025', title: 'Lamaran (Engagement)', desc: 'Dengan restu kedua orang tua, kami mengikat janji suci pertunangan untuk bersiap melangkah ke jenjang pernikahan.', imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500' }
    ];

    if (mode === 'content') {
        return (
            <div className="space-y-6">
                {/* CONTENT SETTINGS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" /> Konten Utama
                    </h3>

                    {/* Section Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Judul Bagian</label>
                        <input
                            type="text"
                            value={settings.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2"
                            placeholder="e.g. Kisah Cinta Kami"
                        />
                    </div>

                    {/* Source Type Selector */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                            <Database className="w-3.5 h-3.5 text-gray-400" /> Sumber Data
                        </label>
                        <select
                            value={sourceType}
                            onChange={(e) => handleUpdate('sourceType', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                        >
                            <option value="static">Statis (Isi Manual di Sini)</option>
                            <option value="dynamic">Dinamis (Mengikuti Data User/Undangan)</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* STORIES LIST (STATIC) OR DYNAMIC NOTICE */}
                {sourceType === 'static' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> Milestones Perjalanan
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddStory}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                            {stories.map((story, idx) => (
                                <div key={story.id || idx} className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 font-mono">PERISTIWA #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStory(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Hapus Peristiwa"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Waktu / Tanggal</label>
                                                <input
                                                    type="text"
                                                    value={story.date}
                                                    onChange={(e) => handleUpdateStory(idx, 'date', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-mono"
                                                    placeholder="e.g. 15 Jan 2020"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Judul Peristiwa</label>
                                                <input
                                                    type="text"
                                                    value={story.title}
                                                    onChange={(e) => handleUpdateStory(idx, 'title', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white font-semibold"
                                                    placeholder="e.g. Pertama Bertemu"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Gambar URL (Opsional)</label>
                                            <input
                                                type="text"
                                                value={story.imageUrl || ''}
                                                onChange={(e) => handleUpdateStory(idx, 'imageUrl', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 font-mono bg-white"
                                                placeholder="https://... (Foto Pendukung)"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Deskripsi Cerita</label>
                                            <textarea
                                                value={story.desc}
                                                onChange={(e) => handleUpdateStory(idx, 'desc', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 h-16 resize-y bg-white"
                                                placeholder="Tuliskan kisah indah peristiwa tersebut..."
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
                            Data kisah cinta akan diambil secara otomatis dari modul <strong>Kisah Cinta</strong> yang diisi oleh pengguna pada dashboard utama mereka.
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
            {/* GENERAL SETTINGS */}
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" /> Model Layout
                </h3>

                {/* Layout Model */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Model Layout (Template)</label>
                    <select
                        value={layoutModel}
                        onChange={(e) => handleUpdate('layoutModel', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="alternating">Alternating (Kiri Kanan)</option>
                        <option value="left">Left-Aligned (Rata Kiri)</option>
                        <option value="grid">Grid Cards (Kartu Kolom)</option>
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
                        <label className="text-xs font-semibold text-gray-700">Warna Judul Atas</label>
                        <input
                            type="color"
                            value={settings.headerColor || '#1f2937'}
                            onChange={(e) => handleUpdate('headerColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    {layoutModel !== 'grid' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Warna Garis Penghubung</label>
                                <input
                                    type="color"
                                    value={settings.timelineColor || '#E5654B'}
                                    onChange={(e) => handleUpdate('timelineColor', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700">Latar Titik Node</label>
                                <input
                                    type="color"
                                    value={settings.nodeBg || '#ffffff'}
                                    onChange={(e) => handleUpdate('nodeBg', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Kartu Cerita</label>
                        <input
                            type="color"
                            value={settings.cardBg || '#ffffff'}
                            onChange={(e) => handleUpdate('cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Judul Cerita</label>
                        <input
                            type="color"
                            value={settings.titleColor || '#1f2937'}
                            onChange={(e) => handleUpdate('titleColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Tanggal</label>
                        <input
                            type="color"
                            value={settings.dateColor || '#E5654B'}
                            onChange={(e) => handleUpdate('dateColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul / Nama Kisah</label>
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
                    <label className="text-xs font-semibold text-gray-700">Font Tanggal & Deskripsi</label>
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
            </div>
        </div>
    );
}
