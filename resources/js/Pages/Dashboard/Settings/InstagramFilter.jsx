import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { Camera, Check, ExternalLink, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function InstagramFilterSettings({ 
    filters = [], 
    currentFilterId = null, 
    customFilterUrl = '', 
    isCustomUsed = false,
    coupleNames = { groom: 'Groom', bride: 'Bride' },
    isFilterApplied = false 
}) {
    const { flash } = usePage().props;
    const [useCustom, setUseCustom] = useState(isCustomUsed);
    const [customUrlInput, setCustomUrlInput] = useState(customFilterUrl || '');
    const [selectedFilterId, setSelectedFilterId] = useState(currentFilterId || (filters[0]?.id || null));
    const [qrModalUrl, setQrModalUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const coupleText = `${coupleNames.groom} & ${coupleNames.bride}`;

    const handleApply = (shouldApply) => {
        setSubmitting(true);
        router.post(route('settings.instagram-filter.apply'), {
            apply: shouldApply,
            use_custom: useCustom,
            filter_id: selectedFilterId,
            custom_filter_url: customUrlInput,
        }, {
            onFinish: () => setSubmitting(false),
            preserveScroll: true,
        });
    };

    const handleSelectFilter = (id) => {
        if (!useCustom) {
            setSelectedFilterId(id);
        }
    };

    // Cari objek filter terpilih saat ini
    const activeFilterObj = useCustom 
        ? { name: 'Kustom Instagram Filter', filter_url: customUrlInput, thumbnail: null }
        : filters.find(f => f.id === selectedFilterId) || filters[0] || {};

    const qrCodeSrc = qrModalUrl 
        ? `https://quickchart.io/qr?text=${encodeURIComponent(qrModalUrl)}&size=250&margin=1&ecLevel=H`
        : '';

    return (
        <DashboardLayout title="Filter Instagram">
            <Head title="Pengaturan Filter Instagram" />

            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                {/* Header info */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-[#E5654B]" />
                            Pengaturan Filter Instagram AR
                        </h2>
                        <p className="text-xs text-gray-500 max-w-xl leading-relaxed">
                            Buat momen pernikahan Anda semakin interaktif! Tamu undangan dapat mengambil foto/video selfie menggunakan filter Instagram dengan nama Anda terpilih secara dinamis.
                        </p>
                    </div>
                    {isFilterApplied ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold uppercase">
                            <CheckCircle2 className="w-4 h-4" />
                            Aktif di Undangan
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-stone-500 text-xs font-semibold uppercase">
                            <AlertCircle className="w-4 h-4" />
                            Belum Aktif
                        </div>
                    )}
                </div>

                {/* Flash Success Message */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium px-4 py-3 rounded-xl flex items-center gap-2 shadow-sm">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Main section: grid catalog left, preview mockup right */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Kiri: Pilihan filter (Katalog/Kustom) */}
                    <div className="lg:col-span-3 space-y-5">
                        
                        {/* Selector Tab (Katalog vs Kustom) */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-xs flex">
                            <button
                                type="button"
                                onClick={() => setUseCustom(false)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    !useCustom 
                                        ? 'bg-[#E5654B] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Katalog Generik Instan
                            </button>
                            <button
                                type="button"
                                onClick={() => setUseCustom(true)}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                    useCustom 
                                        ? 'bg-[#E5654B] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                Link Filter Kustom Saya
                            </button>
                        </div>

                        {/* Opsi 1: Katalog Generik */}
                        {!useCustom ? (
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pilih Template Filter</h3>
                                
                                {filters.length === 0 ? (
                                    <div className="text-center py-6 text-gray-400 text-xs font-medium">
                                        Katalog filter kosong. Hubungi admin untuk informasi.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        {filters.map(filter => {
                                            const isSelected = selectedFilterId === filter.id;
                                            return (
                                                <div
                                                    key={filter.id}
                                                    onClick={() => handleSelectFilter(filter.id)}
                                                    className={`cursor-pointer rounded-xl border-2 p-3 text-left transition-all relative overflow-hidden flex items-start gap-3 select-none ${
                                                        isSelected 
                                                            ? 'border-[#E5654B] bg-[#E5654B]/5'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {/* Checkbox overlay */}
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 text-[#E5654B]">
                                                            <CheckCircle2 className="w-4 h-4 fill-white" />
                                                        </div>
                                                    )}

                                                    {/* Thumbnail mini */}
                                                    <div className="w-12 h-12 rounded-lg bg-stone-900 overflow-hidden flex-shrink-0">
                                                        {filter.thumbnail && (
                                                            <img src={filter.thumbnail} alt={filter.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-xs font-bold text-gray-800 truncate pr-4">{filter.name}</h4>
                                                        <p className="text-[10px] text-gray-500 line-clamp-2 mt-1 leading-normal">
                                                            {filter.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Opsi 2: Link Kustom
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Masukkan Tautan Filter Kustom</h3>
                                <div className="space-y-3.5">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 block mb-1.5 uppercase">Instagram Filter URL</label>
                                        <input
                                            type="url"
                                            value={customUrlInput}
                                            onChange={e => setCustomUrlInput(e.target.value)}
                                            className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-xs text-[#333] placeholder-gray-400 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] outline-none transition-all"
                                            placeholder="https://www.instagram.com/ar/xxxxxxxxxxxx/"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1.5 leading-normal">
                                            Tempelkan link dari filter Meta Spark Hub yang sudah disetujui Facebook/Meta. Tautan ini akan otomatis diarahkan ke kamera Instagram Stories tamu Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Actions */}
                        <div className="flex gap-3 justify-end pt-2">
                            {isFilterApplied && (
                                <button
                                    type="button"
                                    onClick={() => handleApply(false)}
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    Matikan Filter
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleApply(true)}
                                disabled={submitting || (useCustom && !customUrlInput)}
                                className="px-6 py-2.5 bg-[#E5654B] text-white text-xs font-bold rounded-xl hover:bg-[#c24b33] transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1.5"
                            >
                                {submitting && (
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                Terapkan ke Undangan
                            </button>
                        </div>
                    </div>

                    {/* Kanan: Realtime smartphone preview mockup */}
                    <div className="lg:col-span-2 flex flex-col items-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 select-none">
                            Visualisasi Tamu
                        </div>
                        
                        <div className="relative w-60 h-[420px] bg-stone-900 rounded-[36px] p-2.5 shadow-xl border-4 border-stone-800 transition-transform duration-300 hover:scale-[1.01]">
                            {/* Phone ear speaker notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-stone-900 rounded-b-xl z-20 flex items-center justify-center">
                                <div className="w-10 h-0.5 bg-stone-700 rounded-full mb-1" />
                            </div>

                            {/* Internal screen */}
                            <div className="relative w-full h-full rounded-[28px] overflow-hidden bg-stone-950 flex flex-col justify-between">
                                {activeFilterObj.preview_image ? (
                                    <img src={activeFilterObj.preview_image} alt="Preview Filter" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-950 flex flex-col justify-center items-center p-4 text-center">
                                        <Camera className="w-8 h-8 text-white/30 mb-2" />
                                        <span className="text-[9px] text-white/30 font-bold uppercase tracking-wider">PREVIEW SCREEN</span>
                                    </div>
                                )}

                                {/* Overlay Camera UI */}
                                <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-10">
                                    <div className="flex items-center gap-2 mt-6">
                                        <div className="w-7 h-7 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[9px] font-extrabold uppercase">
                                            IG
                                        </div>
                                        <div className="text-white text-[10px] font-medium tracking-wide">@{coupleNames.groom.toLowerCase()}_{coupleNames.bride.toLowerCase()}</div>
                                    </div>

                                    {/* Shutter button & dynamically generated couple names */}
                                    <div className="flex flex-col items-center gap-2.5 mb-2 w-full">
                                        {/* Dynamic Name Watermark */}
                                        <div className="text-white text-[9px] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm font-semibold max-w-[90%] truncate text-center">
                                            ✨ Wedding of {coupleText}
                                        </div>

                                        <div className="w-10 h-10 rounded-full border-4 border-white flex items-center justify-center bg-transparent">
                                            <div className="w-7 h-7 rounded-full bg-white/90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Extra Actions for active filter (QR Code / Test Link) */}
                        {activeFilterObj.filter_url && (
                            <div className="mt-4 flex gap-2 w-full justify-center">
                                <button
                                    type="button"
                                    onClick={() => setQrModalUrl(activeFilterObj.filter_url)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                                >
                                    <QrCode className="w-3.5 h-3.5" />
                                    Scan QR
                                </button>
                                <a
                                    href={activeFilterObj.filter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Coba Link
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* QR Code Scan Modal */}
            {qrModalUrl && (
                <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
                    <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center relative shadow-2xl border border-stone-100 animate-in fade-in zoom-in duration-200">
                        <button 
                            type="button"
                            onClick={() => setQrModalUrl(null)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-850 flex items-center justify-center transition-colors text-base font-bold select-none"
                        >
                            &times;
                        </button>
                        
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Pindai dengan Kamera HP</h3>
                            
                            <div className="bg-stone-50 p-3 rounded-2xl inline-block border border-stone-100 shadow-inner">
                                <img src={qrCodeSrc} alt="QR Code Link Filter" className="w-44 h-44 mx-auto rounded-lg" />
                            </div>

                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                Pindai QR code di atas menggunakan aplikasi Kamera atau pemindai QR di HP Anda untuk membuka filter secara instan.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
