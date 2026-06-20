import React from 'react';
import { CreditCard, Database, Palette, Plus, Sliders, Trash } from 'lucide-react';

const PRESETS = {
    terracotta: {
        titleColor: '#3d302a',
        descColor: '#5c4c43',
        containerBg: '#fdfbf7',
        cardBg: '#f5ebe0',
        cardBorderColor: '#e0d5c8',
        buttonBg: '#b35c3c',
        titleFontFamily: 'Playfair Display',
        bodyFontFamily: 'Montserrat',
        borderRadius: '16px'
    },
    sage: {
        titleColor: '#2f3e2d',
        descColor: '#4a5548',
        containerBg: '#fafbf9',
        cardBg: '#f4f6f3',
        cardBorderColor: '#e2e7e1',
        buttonBg: '#8a9a86',
        titleFontFamily: 'Outfit',
        bodyFontFamily: 'Inter',
        borderRadius: '12px'
    },
    luxury: {
        titleColor: '#0d1e3d',
        descColor: '#3b4b66',
        containerBg: '#f8fafc',
        cardBg: '#ffffff',
        cardBorderColor: '#e5e7eb',
        buttonBg: '#c5a880',
        titleFontFamily: 'Cinzel',
        bodyFontFamily: 'Montserrat',
        borderRadius: '4px'
    },
    romantic: {
        titleColor: '#4a3e3d',
        descColor: '#7a6b6a',
        containerBg: '#fffbfb',
        cardBg: '#fff9f8',
        cardBorderColor: '#fceceb',
        buttonBg: '#e8a7a1',
        titleFontFamily: 'Great Vibes',
        bodyFontFamily: 'Outfit',
        borderRadius: '24px'
    },
    retro: {
        titleColor: '#18181b',
        descColor: '#4b5563',
        containerBg: '#fafafa',
        cardBg: '#fafaf9',
        cardBorderColor: '#e7e5e4',
        buttonBg: '#18181b',
        titleFontFamily: 'Sacramento',
        bodyFontFamily: 'Montserrat',
        borderRadius: '30px'
    }
};

export default function DigitalEnvelopeEditor({ settings = {}, activeBreakpoint = 'desktop', onChange, mode = 'content' }) {
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
    const layoutModel = settings.layoutModel || 'stack';

    const accounts = settings.accounts || [
        { id: '1', provider: 'Bank BCA', number: '7141234567', holder: 'Ahmad Rafli', qrUrl: '' },
        { id: '2', provider: 'Bank Mandiri', number: '1440012345678', holder: 'Siti Aminah', qrUrl: '' }
    ];

    const handleAddAccount = () => {
        const newAccount = {
            id: Date.now().toString(),
            provider: 'Bank BCA',
            number: '1234567890',
            holder: 'Nama Pemilik Rekening',
            qrUrl: ''
        };
        handleUpdate('accounts', [...accounts, newAccount]);
    };

    const handleUpdateAccount = (index, field, value) => {
        const updated = [...accounts];
        updated[index] = { ...updated[index], [field]: value };
        handleUpdate('accounts', updated);
    };

    const handleRemoveAccount = (index) => {
        const updated = accounts.filter((_, idx) => idx !== index);
        handleUpdate('accounts', updated);
    };

    if (mode === 'content') {
        return (
            <div className="space-y-6">
                {/* CONTENT SETTINGS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5" /> Teks Konten
                    </h3>

                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Judul Bagian</label>
                        <input
                            type="text"
                            value={settings.title || ''}
                            onChange={(e) => handleUpdate('title', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2"
                            placeholder="e.g. Kado Digital / Amplop Digital"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Keterangan / Deskripsi</label>
                        <textarea
                            value={settings.description || ''}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                            className="w-full text-sm border-gray-200 rounded-lg p-2 h-20 resize-y"
                            placeholder="Masukkan keterangan pengiriman kado..."
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
                            <option value="dynamic">Dinamis (Mengikuti Rekening User)</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* ACCOUNTS LIST (STATIC) OR DYNAMIC NOTICE */}
                {sourceType === 'static' ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5" /> Rekening / E-Wallet
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddAccount}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" /> Tambah
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {accounts.map((acc, idx) => (
                                <div key={acc.id || idx} className="p-3 bg-gray-50 border border-gray-100 rounded-lg space-y-2 relative group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-400 font-mono">REKENING #{idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAccount(idx)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                            title="Hapus Rekening"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Penyedia / Bank</label>
                                                <input
                                                    type="text"
                                                    value={acc.provider}
                                                    onChange={(e) => handleUpdateAccount(idx, 'provider', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                    placeholder="e.g. Bank BCA, OVO"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Atas Nama (A.N.)</label>
                                                <input
                                                    type="text"
                                                    value={acc.holder}
                                                    onChange={(e) => handleUpdateAccount(idx, 'holder', e.target.value)}
                                                    className="w-full text-xs border-gray-200 rounded p-1.5 bg-white"
                                                    placeholder="e.g. Ahmad Rafli"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Nomor Rekening / HP</label>
                                            <input
                                                type="text"
                                                value={acc.number}
                                                onChange={(e) => handleUpdateAccount(idx, 'number', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 font-mono bg-white"
                                                placeholder="e.g. 7141234567"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-semibold text-gray-500 uppercase">QR Code URL (Opsional)</label>
                                            <input
                                                type="text"
                                                value={acc.qrUrl || ''}
                                                onChange={(e) => handleUpdateAccount(idx, 'qrUrl', e.target.value)}
                                                className="w-full text-xs border-gray-200 rounded p-1.5 font-mono bg-white"
                                                placeholder="https://... (QR Code Image)"
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
                            Data rekening bank atau e-wallet akan dimuat otomatis dari daftar <strong>Rekening Undangan</strong> yang diinput oleh pengguna di dashboard.
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
                    <Sliders className="w-3.5 h-3.5" /> Model & Alignment
                </h3>

                {/* Layout Model */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Model Layout (Template)</label>
                    <select
                        value={layoutModel}
                        onChange={(e) => handleUpdate('layoutModel', e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-lg p-2 bg-white"
                    >
                        <option value="stack">Stack (Tumpuk Vertikal)</option>
                        <option value="grid">Grid (Dua Kolom)</option>
                        <option value="slider">Card Slider (Geser Horizontal)</option>
                    </select>
                </div>

                {/* Alignment (Responsive) */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">Penjajaran</label>
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
                        <label className="text-xs font-semibold text-gray-700">Warna Judul</label>
                        <input
                            type="color"
                            value={settings.titleColor || '#1f2937'}
                            onChange={(e) => handleUpdate('titleColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Warna Deskripsi</label>
                        <input
                            type="color"
                            value={settings.descColor || '#6b7280'}
                            onChange={(e) => handleUpdate('descColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Kontainer</label>
                        <input
                            type="color"
                            value={settings.containerBg || '#f9fafb'}
                            onChange={(e) => handleUpdate('containerBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Latar Kartu</label>
                        <input
                            type="color"
                            value={settings.cardBg || '#ffffff'}
                            onChange={(e) => handleUpdate('cardBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Garis Pinggir Kartu</label>
                        <input
                            type="color"
                            value={settings.cardBorderColor || '#e5e7eb'}
                            onChange={(e) => handleUpdate('cardBorderColor', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700">Tombol Salin</label>
                        <input
                            type="color"
                            value={settings.buttonBg || '#E5654B'}
                            onChange={(e) => handleUpdate('buttonBg', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">Font Judul / Provider</label>
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
                    <label className="text-xs font-semibold text-gray-700">Font Deskripsi & Tombol</label>
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
                    <label className="text-xs font-semibold text-gray-700">Lengkung Sudut Kontainer</label>
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
