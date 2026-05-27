import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Index({ settings }) {
    const { flash, adminRoutePrefix } = usePage().props;
    const [activeTab, setActiveTab] = useState('general');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);

    // Flat list of all settings
    const allSettings = [];
    if (settings) {
        Object.entries(settings).forEach(([category, items]) => {
            items.forEach(item => allSettings.push({ ...item, rawCategory: category }));
        });
    }

    const { data, setData, post, processing } = useForm({
        settings: allSettings.map(s => ({ key: s.setting_key, value: s.setting_value })),
    });

    const getSettingValue = (key) => {
        const idx = data.settings.findIndex(s => s.key === key);
        return idx !== -1 ? data.settings[idx].value : '';
    };

    const updateSettingValue = (key, val) => {
        setData(prevData => {
            const updated = [...prevData.settings];
            const idx = updated.findIndex(s => s.key === key);
            if (idx !== -1) {
                updated[idx] = { ...updated[idx], value: val };
            } else {
                updated.push({ key, value: val });
            }
            return {
                ...prevData,
                settings: updated
            };
        });
    };

    const handleFileUpload = async (e, key, setUploading) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'branding');

        try {
            const res = await axios.post(`${adminRoutePrefix}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data && res.data.path) {
                updateSettingValue(key, res.data.path);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Gagal mengupload gambar.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`${adminRoutePrefix}/settings`);
    };

    // Bank account management
    const rawBankAccounts = getSettingValue('bank_accounts');
    let bankAccountsList = [];
    try {
        bankAccountsList = rawBankAccounts ? JSON.parse(rawBankAccounts) : [];
        if (!Array.isArray(bankAccountsList)) bankAccountsList = [];
    } catch (e) {
        bankAccountsList = [];
    }

    const [newBankName, setNewBankName] = useState('');
    const [newAccNum, setNewAccNum] = useState('');
    const [newAccHolder, setNewAccHolder] = useState('');

    const addBankAccount = () => {
        if (!newBankName || !newAccNum || !newAccHolder) {
            alert('Semua kolom bank harus diisi!');
            return;
        }
        const updated = [...bankAccountsList, {
            bank_name: newBankName,
            account_number: newAccNum,
            account_name: newAccHolder
        }];
        updateSettingValue('bank_accounts', JSON.stringify(updated));
        setNewBankName('');
        setNewAccNum('');
        setNewAccHolder('');
    };

    const removeBankAccount = (index) => {
        const updated = bankAccountsList.filter((_, i) => i !== index);
        updateSettingValue('bank_accounts', JSON.stringify(updated));
    };

    const tabs = [
        { id: 'general', label: 'Umum & Branding', desc: 'Nama aplikasi, domain, logo & favicon utama.', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l-3 3m3-3l3 3" /></svg> },
        { id: 'payment', label: 'Gerbang Pembayaran', desc: 'Kunci API Xendit, Midtrans & rekening transfer manual.', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
        { id: 'whatsapp', label: 'WhatsApp Gateway', desc: 'Integrasi pengiriman notifikasi via API Gateway.', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
        { id: 'footer', label: 'Informasi Footer', desc: 'Kontak, media sosial & deskripsi di kaki halaman.', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg> },
    ];

    const inputClass = 'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-300 focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors focus:outline-none';
    const labelClass = 'text-[11px] font-bold text-gray-500 block mb-1.5 tracking-wider uppercase';

    return (
        <DynamicAdminLayout title="Pengaturan Sistem">
            <Head title="Super Admin - Pengaturan" />

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Left Side: Modern Beautiful Tabs */}
                <div className="w-full lg:w-[280px] bg-white rounded-2xl border border-gray-100 p-3 space-y-1 shadow-sm shrink-0">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                        Kategori Pengaturan
                    </div>
                    {tabs.map(tab => {
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left ${
                                    isSelected
                                        ? 'bg-[#E5654B]/10 text-[#E5654B] border-l-4 border-[#E5654B]'
                                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900 border-l-4 border-transparent'
                                }`}
                            >
                                <span className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[#E5654B] text-white' : 'bg-gray-50 text-gray-400'}`}>
                                    {tab.icon}
                                </span>
                                <div className="min-w-0">
                                    <div className="text-[12px] font-bold leading-tight">{tab.label}</div>
                                    <div className="text-[10px] text-gray-400 mt-0.5 truncate">{tab.desc}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right Side: Tab Form Panel */}
                <div className="flex-1 w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {flash?.success && (
                        <div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* ═══ TAB 1: UMUM & BRANDING ═══ */}
                        {activeTab === 'general' && (
                            <div className="space-y-5">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="font-bold text-gray-800 text-sm">Informasi Website & Branding</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Kelola logo, nama, dan identitas dasar situs web utama Anda.</p>
                                </div>

                                {/* Logo & Favicon Uploaders side by side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    {/* Logo Uploader */}
                                    <div className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-gray-50/50">
                                        <label className={labelClass}>Logo Utama Website</label>
                                        <div className="h-20 flex items-center justify-center mb-4 relative max-w-full">
                                            {getSettingValue('site_logo') ? (
                                                <img src={`/storage/${getSettingValue('site_logo')}`} alt="Site Logo" className="max-h-full object-contain" />
                                            ) : (
                                                <div className="text-gray-300 text-xs flex flex-col items-center">
                                                    <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    Belum Ada Logo
                                                </div>
                                            )}
                                        </div>
                                        <label className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors block text-center">
                                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'site_logo', setUploadingLogo)} disabled={uploadingLogo} />
                                        </label>
                                    </div>

                                    {/* Favicon Uploader */}
                                    <div className="border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-gray-50/50">
                                        <label className={labelClass}>Favicon Website (Ikon Tab)</label>
                                        <div className="h-20 flex items-center justify-center mb-4 relative">
                                            {getSettingValue('site_favicon') ? (
                                                <img src={`/storage/${getSettingValue('site_favicon')}`} alt="Site Favicon" className="w-10 h-10 object-contain shadow-xs border border-gray-100 bg-white rounded-lg p-1" />
                                            ) : (
                                                <div className="text-gray-300 text-xs flex flex-col items-center">
                                                    <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    Belum Ada Favicon
                                                </div>
                                            )}
                                        </div>
                                        <label className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-colors block text-center">
                                            {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'site_favicon', setUploadingFavicon)} disabled={uploadingFavicon} />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className={labelClass}>Nama Website</label>
                                        <input type="text" value={getSettingValue('site_name')} onChange={(e) => updateSettingValue('site_name', e.target.value)} className={inputClass} placeholder="Groovy" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Domain Utama</label>
                                        <input type="text" value={getSettingValue('site_domain')} onChange={(e) => updateSettingValue('site_domain', e.target.value)} className={inputClass} placeholder="groovy.com" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Tagline Website</label>
                                    <input type="text" value={getSettingValue('site_tagline')} onChange={(e) => updateSettingValue('site_tagline', e.target.value)} className={inputClass} placeholder="Buat Undangan Digital Premium dalam Hitungan Menit" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Bahasa Default</label>
                                        <select value={getSettingValue('default_locale')} onChange={(e) => updateSettingValue('default_locale', e.target.value)} className={`${inputClass} appearance-none`}>
                                            <option value="id">Bahasa Indonesia (id)</option>
                                            <option value="en">English (en)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* ═══ TAB 3: GERBANG PEMBAYARAN ═══ */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="font-bold text-gray-800 text-sm">Metode & Sistem Pembayaran</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Konfigurasi Midtrans, Xendit, dan daftar rekening transfer bank manual untuk transaksi reseller.</p>
                                </div>

                                {/* Manual Transfer Section */}
                                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-xs">Transfer Bank Manual (Reseller -{'>'} Super Admin)</h4>
                                            <p className="text-[9px] text-gray-400">Aktifkan pembayaran manual dan kelola nomor rekening Anda.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => updateSettingValue('enable_bank_transfer', getSettingValue('enable_bank_transfer') === '1' ? '0' : '1')}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${getSettingValue('enable_bank_transfer') === '1' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${getSettingValue('enable_bank_transfer') === '1' ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    {getSettingValue('enable_bank_transfer') === '1' && (
                                        <div className="space-y-4 pt-2 border-t border-gray-100 animate-in fade-in">
                                            {/* Bank Accounts List */}
                                            <div className="space-y-2">
                                                <label className={labelClass}>Daftar Rekening Pembayaran</label>
                                                {bankAccountsList.length === 0 ? (
                                                    <div className="text-center py-4 border border-dashed border-gray-200 rounded-xl text-gray-400 text-[11px]">
                                                        Belum ada rekening transfer manual.
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {bankAccountsList.map((acc, index) => (
                                                            <div key={index} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between shadow-xs">
                                                                <div className="min-w-0">
                                                                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                                        <span className="px-1.5 py-0.5 bg-orange-50 text-[#c24b33] rounded text-[9px] font-bold">{acc.bank_name}</span>
                                                                        {acc.account_number}
                                                                    </div>
                                                                    <div className="text-[10px] text-gray-400 mt-0.5 truncate">{acc.account_name}</div>
                                                                </div>
                                                                <button type="button" onClick={() => removeBankAccount(index)} className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Add New Bank Account Form */}
                                            <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl space-y-3">
                                                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">Tambah Rekening Baru</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <input type="text" placeholder="Bank (cth: BCA)" value={newBankName} onChange={(e) => setNewBankName(e.target.value)} className={`${inputClass} !py-2`} />
                                                    <input type="text" placeholder="No Rekening" value={newAccNum} onChange={(e) => setNewAccNum(e.target.value)} className={`${inputClass} !py-2`} />
                                                    <input type="text" placeholder="Nama Pemilik" value={newAccHolder} onChange={(e) => setNewAccHolder(e.target.value)} className={`${inputClass} !py-2`} />
                                                </div>
                                                <button type="button" onClick={addBankAccount} className="w-full py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                                    Tambah Rekening
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Xendit Config */}
                                <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/20 space-y-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-xs">Xendit Integration Settings</h4>
                                        <p className="text-[9px] text-gray-400 mt-0.5">Integrasi pembayaran utama untuk invoicing reseller.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Xendit Mode</label>
                                            <select value={getSettingValue('xendit_mode')} onChange={(e) => updateSettingValue('xendit_mode', e.target.value)} className={inputClass}>
                                                <option value="sandbox">Sandbox (Testing)</option>
                                                <option value="production">Production (Live)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Xendit Webhook Token</label>
                                            <input type="password" value={getSettingValue('xendit_webhook_token')} onChange={(e) => updateSettingValue('xendit_webhook_token', e.target.value)} className={inputClass} placeholder="Verification Token" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Xendit Secret Key</label>
                                        <input type="password" value={getSettingValue('xendit_secret_key')} onChange={(e) => updateSettingValue('xendit_secret_key', e.target.value)} className={inputClass} placeholder="xnd_development_..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Success Redirect URL</label>
                                            <input type="text" value={getSettingValue('xendit_success_url')} onChange={(e) => updateSettingValue('xendit_success_url', e.target.value)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Failure Redirect URL</label>
                                            <input type="text" value={getSettingValue('xendit_failure_url')} onChange={(e) => updateSettingValue('xendit_failure_url', e.target.value)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ TAB 4: WHATSAPP GATEWAY ═══ */}
                        {activeTab === 'whatsapp' && (
                            <div className="space-y-5">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="font-bold text-gray-800 text-sm">WhatsApp API Gateway</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Integrasi pengiriman pesan notifikasi otomatis via WhatsApp untuk invoice, pendaftaran, dll.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>API Gateway URL</label>
                                        <input type="text" value={getSettingValue('mpwav9_api_url')} onChange={(e) => updateSettingValue('mpwav9_api_url', e.target.value)} className={inputClass} placeholder="https://api.mpwav9.com/send-message" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Sender Phone Number</label>
                                        <input type="text" value={getSettingValue('mpwav9_sender_number')} onChange={(e) => updateSettingValue('mpwav9_sender_number', e.target.value)} className={inputClass} placeholder="628..." />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>API Token</label>
                                    <input type="password" value={getSettingValue('mpwav9_api_token')} onChange={(e) => updateSettingValue('mpwav9_api_token', e.target.value)} className={inputClass} />
                                </div>

                                <div>
                                    <label className={labelClass}>Device ID (Optional)</label>
                                    <input type="text" value={getSettingValue('mpwav9_device_id')} onChange={(e) => updateSettingValue('mpwav9_device_id', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        )}

                        {/* ═══ TAB 5: INFORMATION FOOTER ═══ */}
                        {activeTab === 'footer' && (
                            <div className="space-y-5">
                                <div className="border-b border-gray-100 pb-3">
                                    <h3 className="font-bold text-gray-800 text-sm">Informasi & Kontak Footer</h3>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Ubah informasi kontak perusahaan, alamat, dan deskripsi singkat di bagian kaki website.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>Deskripsi Footer</label>
                                    <textarea value={getSettingValue('footer_description')} onChange={(e) => updateSettingValue('footer_description', e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Groovy merupakan platform penyedia..." />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Nomor Telepon</label>
                                        <input type="text" value={getSettingValue('footer_phone')} onChange={(e) => updateSettingValue('footer_phone', e.target.value)} className={inputClass} placeholder="62812345..." />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Alamat Email</label>
                                        <input type="email" value={getSettingValue('footer_email')} onChange={(e) => updateSettingValue('footer_email', e.target.value)} className={inputClass} placeholder="info@company.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Nomor WhatsApp</label>
                                        <input type="text" value={getSettingValue('footer_whatsapp')} onChange={(e) => updateSettingValue('footer_whatsapp', e.target.value)} className={inputClass} placeholder="62812..." />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Instagram Username</label>
                                        <input type="text" value={getSettingValue('footer_instagram')} onChange={(e) => updateSettingValue('footer_instagram', e.target.value)} className={inputClass} placeholder="@username" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>TikTok Username</label>
                                        <input type="text" value={getSettingValue('footer_tiktok')} onChange={(e) => updateSettingValue('footer_tiktok', e.target.value)} className={inputClass} placeholder="@username" />
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Alamat Lengkap Perusahaan</label>
                                    <input type="text" value={getSettingValue('footer_address')} onChange={(e) => updateSettingValue('footer_address', e.target.value)} className={inputClass} placeholder="Jalan Soekarno Hatta No. 12..." />
                                </div>
                            </div>
                        )}

                        {/* Save Action Button */}
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-3 bg-[#E5654B] hover:bg-[#c24b33] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-100 hover:shadow-lg disabled:opacity-50 transition-all text-center flex items-center justify-center gap-1.5"
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
