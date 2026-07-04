import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function ResellerPlans({ annualFee, registrationEnabled, benefits: initialBenefits, durationDays }) {
    const { flash } = usePage().props;
    const [benefitsList, setBenefitsList] = useState(initialBenefits || []);
    const [newBenefit, setNewBenefit] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        annual_fee: annualFee || 0,
        registration_enabled: registrationEnabled,
        duration_days: durationDays || 365,
        benefits: initialBenefits || [],
    });

    const handleAddBenefit = () => {
        if (!newBenefit.trim()) return;
        const updated = [...benefitsList, newBenefit.trim()];
        setBenefitsList(updated);
        setData('benefits', updated);
        setNewBenefit('');
    };

    const handleRemoveBenefit = (index) => {
        const updated = benefitsList.filter((_, i) => i !== index);
        setBenefitsList(updated);
        setData('benefits', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/super-admin/reseller-plans', {
            preserveScroll: true,
        });
    };

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
    };

    return (
        <DynamicAdminLayout title="Paket Reseller">
            <Head title="Super Admin - Paket Reseller" />

            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-[#E5654B]/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white/90 mb-3 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-[#E5654B] animate-pulse" />
                                Super Admin Management
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Pengaturan Paket Reseller</h1>
                            <p className="text-sm text-gray-300 mt-1 max-w-xl">
                                Atur harga registrasi tahunan reseller, fasilitas yang diperoleh reseller, serta status pendaftaran pendaftaran reseller baru.
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shrink-0 text-center md:text-right min-w-[200px]">
                            <div className="text-[11px] font-medium text-gray-300 uppercase tracking-wider">Harga Registrasi Aktif</div>
                            <div className="text-2xl font-black text-[#E5654B] mt-0.5">{formatRupiah(data.annual_fee)} <span className="text-xs text-gray-300 font-normal">/ thn</span></div>
                        </div>
                    </div>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-sm animate-in fade-in">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Form Settings */}
                    <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm space-y-6">
                        <div className="border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-bold text-gray-900">Konfigurasi Paket & Harga Registrasi</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Tentukan biaya langganan tahunan reseller yang berlaku saat mendaftar.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Toggle Pendaftaran */}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-gray-800">Status Pendaftaran Reseller Baru</div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">Aktifkan untuk membuka formulir pendaftaran reseller baru.</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('registration_enabled', !data.registration_enabled)}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${data.registration_enabled ? 'bg-[#E5654B]' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${data.registration_enabled ? 'translate-x-6' : ''}`} />
                                </button>
                            </div>

                            {/* Annual Fee Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                                    Biaya Registrasi Tahunan Reseller (Rp)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.annual_fee}
                                        onChange={(e) => setData('annual_fee', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base font-bold text-gray-800 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors focus:outline-none"
                                        placeholder="150000"
                                    />
                                </div>
                                {errors.annual_fee && <div className="text-red-500 text-xs mt-1">{errors.annual_fee}</div>}
                                <p className="text-[11px] text-gray-400">
                                    Diisi 0 jika pendaftaran reseller bersifat gratis tanpa pembayaran tahunan.
                                </p>
                            </div>

                            {/* Duration Days */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                                    Masa Aktif Akun (Hari)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.duration_days}
                                    onChange={(e) => setData('duration_days', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors focus:outline-none"
                                    placeholder="365"
                                />
                                <p className="text-[11px] text-gray-400">Default: 365 Hari (1 Tahun masa aktif reseller).</p>
                            </div>

                            {/* Benefits Manager */}
                            <div className="space-y-3 pt-2">
                                <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                                    Daftar Fasilitas / Benefit Reseller
                                </label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newBenefit}
                                        onChange={(e) => setNewBenefit(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:bg-white focus:border-[#E5654B] focus:outline-none transition-colors"
                                        placeholder="Tambah fasilitas baru (cth: Dukungan Domain Kustom)..."
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddBenefit}
                                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                        Tambah
                                    </button>
                                </div>

                                <div className="space-y-2 pt-1">
                                    {benefitsList.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-700 shadow-xs">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-5 h-5 rounded-full bg-orange-100 text-[#E5654B] font-bold text-[10px] flex items-center justify-center shrink-0">✓</span>
                                                <span className="truncate">{item}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBenefit(idx)}
                                                className="text-gray-300 hover:text-red-500 p-1 transition-colors shrink-0"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#E5654B]/20 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan Paket Reseller'}
                            </button>

                        </form>
                    </div>

                    {/* Right Column: Live Preview Card */}
                    <div className="lg:col-span-5 space-y-4 sticky top-24">
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                                <span>Preview Kartu Paket Reseller</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Live Card</span>
                            </div>

                            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden border border-gray-700">
                                <div className="absolute top-0 right-0 px-3 py-1 bg-[#E5654B] text-[10px] font-extrabold uppercase tracking-wider rounded-bl-xl shadow-md">
                                    Paket Reseller Official
                                </div>

                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mulai Bisnis Undangan</div>
                                <h3 className="text-xl font-black">Paket Kemitraan Reseller</h3>

                                <div className="my-5 border-y border-gray-700/60 py-4">
                                    <div className="text-xs text-gray-400">Biaya Investasi Pendaftaran:</div>
                                    <div className="text-3xl font-extrabold text-[#E5654B] mt-1">
                                        {formatRupiah(data.annual_fee)}
                                        <span className="text-xs font-normal text-gray-300 ml-1">/ {data.duration_days} Hari</span>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-xs text-gray-200">
                                    <div className="font-semibold text-gray-300 mb-2">Fasilitas yang didapat:</div>
                                    {benefitsList.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2.5">
                                            <span className="w-4 h-4 rounded-full bg-[#E5654B]/20 text-[#E5654B] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                                            <span className="leading-snug">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-700/60 flex items-center justify-between text-[11px] text-gray-400">
                                    <span>Sistem Pembayaran:</span>
                                    <span className="font-bold text-white flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        QRIS pay.siapp.in
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </DynamicAdminLayout>
    );
}
