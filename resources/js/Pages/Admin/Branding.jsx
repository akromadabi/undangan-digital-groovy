import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomDomainTutorialModal from '@/Components/CustomDomainTutorialModal';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Branding({ settings, centralHost = 'undangan.com' }) {
    const { url, props: { flash } } = usePage();
    const [activeTab, setActiveTab] = useState('brand');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam && ['brand', 'payment', 'social', 'demo'].includes(tabParam)) {
                setActiveTab(tabParam);
            } else {
                setActiveTab('brand');
            }
        }
    }, [url]);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState(null);

    // Automatically migrate legacy values to array states if the arrays are currently empty
    const getInitialBankAccounts = () => {
        if (settings?.bank_accounts && settings.bank_accounts.length > 0) {
            return settings.bank_accounts;
        }
        if (settings?.bank_name) {
            return [
                {
                    bank_name: settings.bank_name,
                    account_number: settings.bank_account || '',
                    account_name: settings.bank_holder || '',
                }
            ];
        }
        return [];
    };

    const getInitialSocialLinks = () => {
        if (settings?.social_links && settings.social_links.length > 0) {
            return settings.social_links;
        }
        const links = [];
        if (settings?.footer_instagram) {
            links.push({ platform: 'instagram', value: settings.footer_instagram });
        }
        if (settings?.footer_tiktok) {
            links.push({ platform: 'tiktok', value: settings.footer_tiktok });
        }
        return links;
    };

    const { data, setData, post, processing, errors } = useForm({
        brand_name: settings?.brand_name || '',
        brand_logo: null,
        remove_logo: false,
        site_title: settings?.site_title || '',
        site_motto: settings?.site_motto || '',
        footer_whatsapp: settings?.footer_whatsapp || '',
        footer_phone: settings?.footer_phone || '',
        footer_email: settings?.footer_email || '',
        footer_instagram: settings?.footer_instagram || '',
        footer_tiktok: settings?.footer_tiktok || '',
        footer_address: settings?.footer_address || '',
        footer_description: settings?.footer_description || '',
        bank_accounts: getInitialBankAccounts(),
        social_links: getInitialSocialLinks(),
        subdomain: settings?.subdomain || '',
        custom_domain: settings?.custom_domain || '',
        hide_demo_plan_selector: settings?.hide_demo_plan_selector || false,
    });

    const [preview, setPreview] = useState(null);

    const handleLogo = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('brand_logo', file);
            setData('remove_logo', false);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeLogo = () => {
        setData('brand_logo', null);
        setData('remove_logo', true);
        setPreview(null);
    };

    // Automatic real-time debounced subdomain check
    useEffect(() => {
        if (!data.subdomain) {
            setSubdomainStatus(null);
            return;
        }

        // If subdomain is the same as the original, it is available
        if (data.subdomain === settings?.subdomain) {
            setSubdomainStatus({ available: true, message: 'Subdomain ini adalah subdomain saat ini.' });
            return;
        }

        if (data.subdomain.length < 3) {
            setSubdomainStatus({ available: false, message: 'Subdomain minimal 3 karakter.' });
            return;
        }

        setCheckingSubdomain(true);
        setSubdomainStatus(null);

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(`/api/check-subdomain?subdomain=${data.subdomain}`);
                setSubdomainStatus(response.data);
            } catch (error) {
                setSubdomainStatus({ available: false, message: 'Gagal memeriksa ketersediaan subdomain.' });
            } finally {
                setCheckingSubdomain(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.subdomain]);

    const submit = (e) => {
        e.preventDefault();
        post('/admin/branding', { forceFormData: true });
    };

    // Bank account state handlers
    const handleAddBankAccount = () => {
        setData('bank_accounts', [
            ...data.bank_accounts,
            { bank_name: '', account_number: '', account_name: '' }
        ]);
    };

    const handleRemoveBankAccount = (index) => {
        const list = [...data.bank_accounts];
        list.splice(index, 1);
        setData('bank_accounts', list);
    };

    const handleBankAccountChange = (index, field, value) => {
        const list = [...data.bank_accounts];
        list[index][field] = value;
        setData('bank_accounts', list);
    };

    // Social links state handlers
    const handleAddSocialLink = () => {
        setData('social_links', [
            ...data.social_links,
            { platform: 'instagram', value: '' }
        ]);
    };

    const handleRemoveSocialLink = (index) => {
        const list = [...data.social_links];
        list.splice(index, 1);
        setData('social_links', list);
    };

    const handleSocialLinkChange = (index, field, value) => {
        const list = [...data.social_links];
        list[index][field] = value;
        setData('social_links', list);
    };

    const logoUrl = preview || (settings?.brand_logo ? `/storage/${settings.brand_logo}` : null);

    return (
        <AdminLayout title="Pengaturan Reseller">
            <Head title="Pengaturan Reseller" />
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
                <div className="px-1 sm:px-0">
                    <h2 className="text-lg sm:text-xl font-bold text-[#1a1a1a]">Pengaturan Reseller</h2>
                    <p className="text-[#999] text-xs sm:text-sm mt-1">Atur identitas brand, rekening pembayaran pelanggan, tautan sosial media, dan fitur undangan demo reseller Anda</p>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">
                        {flash.success}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex lg:hidden border-b border-[#e8e5e0] w-full bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                    <Link
                        href="/admin/branding?tab=brand"
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'brand' ? 'bg-[#E5654B]/5 text-[#E5654B] font-extrabold' : 'text-[#999] hover:text-[#555]'}`}
                    >
                        <Icon d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62" className="w-3.5 h-3.5 shrink-0" />
                        Brand
                    </Link>
                    <Link
                        href="/admin/branding?tab=payment"
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'payment' ? 'bg-[#E5654B]/5 text-[#E5654B] font-extrabold' : 'text-[#999] hover:text-[#555]'}`}
                    >
                        <Icon d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" className="w-3.5 h-3.5 shrink-0" />
                        Rekening
                    </Link>
                    <Link
                        href="/admin/branding?tab=social"
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'social' ? 'bg-[#E5654B]/5 text-[#E5654B] font-extrabold' : 'text-[#999] hover:text-[#555]'}`}
                    >
                        <Icon d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97" className="w-3.5 h-3.5 shrink-0" />
                        Sosmed
                    </Link>
                    <Link
                        href="/admin/branding?tab=demo"
                        className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'demo' ? 'bg-[#E5654B]/5 text-[#E5654B] font-extrabold' : 'text-[#999] hover:text-[#555]'}`}
                    >
                        <Icon d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .252c-.008.379.137.751.43.992l1.003.828a1.125 1.125 0 01.26 1.43l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.216-.456c-.356-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.397-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.003-.827c.293-.242.438-.614.43-.993a7.72 7.72 0 010-.251c.007-.38-.138-.751-.43-.993l-1.003-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.49l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.213-1.28zM15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5 shrink-0" />
                        Demo
                    </Link>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e8e5e0] p-4 sm:p-6 space-y-4 sm:space-y-6">
                    
                    {/* ═══ TAB 1: IDENTITAS BRAND ═══ */}
                    {activeTab === 'brand' && (
                        <div className="space-y-6">
                            {/* Logo */}
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-3">Logo Brand</label>
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                    <div className={`w-24 h-24 rounded-2xl border-2 border-dashed border-[#e8e5e0] flex items-center justify-center overflow-hidden flex-shrink-0 ${logoUrl ? 'bg-transparent' : 'bg-[#faf9f6]'}`}>
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                        ) : (
                                            <Icon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 6.75V18a2.25 2.25 0 002.25 2.25H18A2.25 2.25 0 0020.25 18V6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75z" className="w-8 h-8 text-[#ddd]" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3f0] text-[#555] text-sm rounded-xl hover:bg-[#e8e5e0] transition-colors cursor-pointer font-bold">
                                            <Icon d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" className="w-4 h-4" />
                                            Upload Logo
                                            <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                                        </label>
                                        {logoUrl && (
                                            <button type="button" onClick={removeLogo} className="text-xs text-red-500 hover:text-red-700 transition-colors block font-semibold">
                                                Hapus logo
                                            </button>
                                        )}
                                        <p className="text-xs text-[#bbb]">PNG, JPG, SVG, WebP. Max 2MB.</p>
                                        {errors.brand_logo && <p className="text-xs text-red-500">{errors.brand_logo}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Brand Name */}
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Nama Brand</label>
                                <input
                                    type="text"
                                    value={data.brand_name}
                                    onChange={e => setData('brand_name', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                    placeholder="Nama brand Anda"
                                />
                                {errors.brand_name && <p className="text-xs text-red-500 mt-1">{errors.brand_name}</p>}
                                <p className="text-xs text-[#bbb] mt-1.5">Nama ini akan ditampilkan di halaman landing page dan dashboard user Anda.</p>
                            </div>

                            {/* Site Title */}
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Judul Website (Meta Title)</label>
                                <input
                                    type="text"
                                    value={data.site_title}
                                    onChange={e => setData('site_title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                    placeholder="Contoh: Sakinah - Jasa Undangan Digital Murah Premium"
                                />
                                {errors.site_title && <p className="text-xs text-red-500 mt-1">{errors.site_title}</p>}
                                <p className="text-xs text-[#bbb] mt-1.5">Judul ini akan menjadi nama tab browser dan judul utama ketika link website Anda dibagikan di WhatsApp.</p>
                            </div>

                            {/* Site Motto / Description */}
                            <div>
                                <label className="block text-sm font-bold text-[#333] mb-2">Motto / Deskripsi Website (Meta Description)</label>
                                <textarea
                                    value={data.site_motto}
                                    onChange={e => setData('site_motto', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none resize-none"
                                    placeholder="Contoh: Buat undangan pernikahan digital elegan dengan mudah, cepat, dan murah. Tersedia banyak pilihan tema premium menarik."
                                />
                                {errors.site_motto && <p className="text-xs text-red-500 mt-1">{errors.site_motto}</p>}
                                <p className="text-xs text-[#bbb] mt-1.5">Moto/deskripsi ini akan ditampilkan di bawah judul ketika link website Anda dibagikan di WhatsApp.</p>
                            </div>

                            {/* Subdomain */}
                            <div className="border-t border-[#f0ede8] pt-6">
                                <label className="block text-sm font-bold text-[#333] mb-2">Subdomain Reseller</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        value={data.subdomain}
                                        onChange={e => { 
                                            setData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); 
                                            setSubdomainStatus(null); 
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-l-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                        placeholder="namareseller"
                                    />
                                    <span className="px-4 py-2.5 bg-[#f5f3f0] border border-l-0 border-[#e8e5e0] rounded-r-xl text-sm text-[#999] whitespace-nowrap">.{centralHost}</span>
                                </div>
                                {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain}</p>}
                                
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-[#bbb]">Hanya huruf kecil, angka, dan tanda hubung (-)</p>
                                    {checkingSubdomain && (
                                        <span className="text-xs text-[#E5654B] animate-pulse font-semibold">Memeriksa ketersediaan...</span>
                                    )}
                                </div>

                                {subdomainStatus && (
                                    <div className={`mt-2.5 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                                        subdomainStatus.available 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {subdomainStatus.available ? (
                                            <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        <span>{subdomainStatus.message}</span>
                                    </div>
                                )}

                                {data.subdomain && (
                                    <div className="mt-3 bg-[#faf9f6] rounded-xl px-4 py-3 border border-[#e8e5e0] flex items-center gap-2">
                                        <Icon d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" className="w-4 h-4 text-[#999]" />
                                        <span className="text-sm text-[#555]">URL Reseller: <strong className="text-[#E5654B]">{data.subdomain}.{centralHost}</strong></span>
                                    </div>
                                )}
                            </div>

                            {/* Custom Domain */}
                            <div className="border-t border-[#f0ede8] pt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="text-sm font-bold text-[#333]">Custom Domain Reseller</label>
                                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-semibold">Opsional</span>
                                </div>
                                <input
                                    type="text"
                                    value={data.custom_domain}
                                    onChange={e => setData('custom_domain', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                    placeholder="undangan.domainanda.com"
                                />
                                {errors.custom_domain && <p className="text-xs text-red-500 mt-1">{errors.custom_domain}</p>}
                                <div className="mt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsTutorialOpen(true)} 
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                        </svg>
                                        Lihat Tutorial Custom Domain
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ TAB 2: REKENING PEMBAYARAN ═══ */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-[#1a1a1a]">Rekening Pembayaran Pelanggan</h3>
                                <p className="text-xs text-[#999] mt-0.5">Atur semua rekening bank, e-wallet, atau merchant yang Anda gunakan untuk menerima pembayaran manual dari pelanggan Anda.</p>
                            </div>

                            {data.bank_accounts.length === 0 ? (
                                <div className="text-center py-8 bg-[#faf9f6] rounded-2xl border border-[#e8e5e0] space-y-3">
                                    <div className="inline-flex w-12 h-12 rounded-full bg-[#f0ede8] items-center justify-center text-[#999]">
                                        <Icon d="M2.25 8.25h19.5M2.25 9h19.5" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-[#333]">Belum Ada Rekening Pembayaran</div>
                                        <div className="text-xs text-[#999] mt-1">Tambahkan setidaknya satu rekening untuk pembayaran transfer manual.</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data.bank_accounts.map((account, index) => (
                                        <div key={index} className="p-3 sm:p-4 bg-[#faf9f6] rounded-2xl border border-[#e8e5e0] relative space-y-3 sm:space-y-4">
                                            <div className="flex items-center justify-between border-b border-[#e8e5e0] pb-2">
                                                <span className="text-xs font-extrabold text-[#E5654B]">REKENING KESATU #{index + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveBankAccount(index)}
                                                    className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-700 transition-colors gap-1"
                                                >
                                                    <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
                                                    Hapus Rekening
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Nama Bank / E-Wallet</label>
                                                    <input
                                                        type="text"
                                                        value={account.bank_name}
                                                        onChange={e => handleBankAccountChange(index, 'bank_name', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                                        placeholder="Cth: BCA, Mandiri, OVO, Dana"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Nomor Rekening / HP</label>
                                                    <input
                                                        type="text"
                                                        value={account.account_number}
                                                        onChange={e => handleBankAccountChange(index, 'account_number', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                                        placeholder="Cth: 1234567890"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-[#555] mb-1.5">Nama Pemilik Rekening</label>
                                                    <input
                                                        type="text"
                                                        value={account.account_name}
                                                        onChange={e => handleBankAccountChange(index, 'account_name', e.target.value)}
                                                        className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                                        placeholder="Cth: Ahmad Fauzi"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex justify-start">
                                <button
                                    type="button"
                                    onClick={handleAddBankAccount}
                                    className="px-4 py-2 bg-[#f5f3f0] hover:bg-[#e8e5e0] text-[#555] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Icon d="M12 4.5v15m7.5-7.5h-15" className="w-4 h-4" />
                                    Tambah Rekening Baru
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ═══ TAB 3: KONTAK & MEDIA SOSIAL ═══ */}
                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            
                            {/* Standard Contacts */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-bold text-[#1a1a1a]">Kontak Utama Reseller</h3>
                                    <p className="text-xs text-[#999] mt-0.5">Kontak utama untuk komunikasi dengan calon pelanggan Anda.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#555] mb-1.5">No. WhatsApp Utama</label>
                                        <input
                                            type="text"
                                            value={data.footer_whatsapp}
                                            onChange={e => setData('footer_whatsapp', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                            placeholder="Contoh: 08123456789"
                                        />
                                        {errors.footer_whatsapp && <p className="text-xs text-red-500 mt-1">{errors.footer_whatsapp}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#555] mb-1.5">Email Dukungan Utama</label>
                                        <input
                                            type="email"
                                            value={data.footer_email}
                                            onChange={e => setData('footer_email', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                            placeholder="Contoh: support@brand.com"
                                        />
                                        {errors.footer_email && <p className="text-xs text-red-500 mt-1">{errors.footer_email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#555] mb-1.5">No. Telepon / Kantor</label>
                                        <input
                                            type="text"
                                            value={data.footer_phone}
                                            onChange={e => setData('footer_phone', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                            placeholder="Contoh: 021-123456"
                                        />
                                        {errors.footer_phone && <p className="text-xs text-red-500 mt-1">{errors.footer_phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-4 border-t border-[#f0ede8] pt-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#333] mb-1.5">Tentang Kami / Deskripsi Singkat</label>
                                    <textarea
                                        value={data.footer_description}
                                        onChange={e => setData('footer_description', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none resize-none"
                                        placeholder="Jelaskan secara singkat mengenai bisnis layanan undangan digital Anda."
                                    />
                                    {errors.footer_description && <p className="text-xs text-red-500 mt-1">{errors.footer_description}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#333] mb-1.5">Alamat Fisik Kantor (Opsional)</label>
                                    <textarea
                                        value={data.footer_address}
                                        onChange={e => setData('footer_address', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none resize-none"
                                        placeholder="Alamat lengkap kantor Anda"
                                    />
                                    {errors.footer_address && <p className="text-xs text-red-500 mt-1">{errors.footer_address}</p>}
                                </div>
                            </div>

                            {/* Dynamic Social Links */}
                            <div className="space-y-4 border-t border-[#f0ede8] pt-5">
                                <div>
                                    <h3 className="text-sm font-bold text-[#1a1a1a]">Akun Media Sosial Tambahan</h3>
                                    <p className="text-xs text-[#999] mt-0.5">Tambahkan tautan akun media sosial Anda yang lain (seperti Instagram, TikTok, Facebook, dll.) untuk ditampilkan di landing page Anda.</p>
                                </div>

                                {data.social_links.length === 0 ? (
                                    <div className="text-center py-6 bg-[#faf9f6] rounded-2xl border border-[#e8e5e0] text-xs text-[#999]">
                                        Belum ada tautan media sosial tambahan yang ditambahkan.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {data.social_links.map((link, index) => (
                                            <div key={index} className="flex items-center gap-3 bg-[#faf9f6] p-3 rounded-xl border border-[#e8e5e0]">
                                                <div className="w-1/3">
                                                    <select
                                                        value={link.platform}
                                                        onChange={e => handleSocialLinkChange(index, 'platform', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-[#e8e5e0] rounded-lg text-xs font-bold text-[#333] outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B]"
                                                    >
                                                        <option value="instagram">Instagram</option>
                                                        <option value="tiktok">TikTok</option>
                                                        <option value="facebook">Facebook</option>
                                                        <option value="whatsapp">WhatsApp Tambahan</option>
                                                        <option value="email">Email Lainnya</option>
                                                        <option value="phone">Telepon Lainnya</option>
                                                        <option value="telegram">Telegram</option>
                                                        <option value="youtube">YouTube</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={link.value}
                                                        onChange={e => handleSocialLinkChange(index, 'value', e.target.value)}
                                                        className="w-full px-3 py-2 bg-white border border-[#e8e5e0] rounded-lg text-xs text-[#333] outline-none focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B]"
                                                        placeholder="Username atau Link tautan"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSocialLink(index)}
                                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors flex items-center justify-center flex-shrink-0"
                                                    title="Hapus"
                                                >
                                                    <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={handleAddSocialLink}
                                        className="px-4 py-2 bg-[#f5f3f0] hover:bg-[#e8e5e0] text-[#555] text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <Icon d="M12 4.5v15m7.5-7.5h-15" className="w-4 h-4" />
                                        Tambah Akun Sosmed
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview (Only visible in Identitas Brand tab for clarity) */}
                    {activeTab === 'brand' && (
                        <div className="border-t border-[#f0ede8] pt-5">
                            <label className="block text-sm font-bold text-[#333] mb-3">Pratinjau Nama & Logo Brand</label>
                            <div className="bg-[#faf9f6] rounded-xl p-5 flex items-center gap-3 border border-[#e8e5e0]">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${logoUrl ? 'bg-transparent border border-gray-100' : 'bg-[#E5654B]'}`}>
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                    ) : (
                                        <span className="text-white font-bold text-sm">{(data.brand_name || 'B').charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-[#1a1a1a] text-[15px]">{data.brand_name || 'Nama Brand'}</div>
                                    <div className="text-[11px] text-[#999]">RESELLER PANEL</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ TAB 4: UNDANGAN DEMO ═══ */}
                    {activeTab === 'demo' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base font-bold text-[#1a1a1a]">Pengaturan Undangan Demo</h3>
                                <p className="text-xs text-[#999] mt-0.5">Kelola tampilan dan fungsionalitas undangan demo yang Anda tunjukkan kepada calon pelanggan.</p>
                            </div>

                            {/* Toggle Hide Plan Selector */}
                            <div className="p-3 sm:p-4 bg-[#faf9f6] rounded-2xl border border-[#e8e5e0] flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-[#333]">Sembunyikan Ganti Paket</div>
                                    <p className="text-xs text-[#999] leading-relaxed">
                                        Sembunyikan tombol ganti paket pada halaman undangan demo.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('hide_demo_plan_selector', !data.hide_demo_plan_selector)}
                                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${data.hide_demo_plan_selector ? 'bg-[#E5654B]' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${data.hide_demo_plan_selector ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Akun Demo Card */}
                            <div className="border-t border-[#f0ede8] pt-6 space-y-4">
                                <div>
                                    <h4 className="text-sm font-bold text-[#1a1a1a]">Akun Demo Undangan</h4>
                                    <p className="text-[#999] text-xs mt-1">
                                        Preview tema di Landing Page Anda akan menampilkan data undangan dari akun demo khusus Anda. Anda bisa mengedit nama pengantin, foto galeri, musik latar, dll.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 sm:p-4 bg-[#faf9f6] rounded-xl border border-[#e8e5e0]">
                                    <div className="min-w-0 flex-1">
                                        <div className="font-semibold text-sm text-[#333] truncate">
                                            {settings?.demo_user ? `Terhubung: ${settings.demo_user.name}` : 'Belum diatur (Menggunakan data default Korea)'}
                                        </div>
                                        <div className="text-xs text-[#999] mt-0.5 truncate">
                                            {settings?.demo_user 
                                                ? `Email: ${settings.demo_user.email}`
                                                : 'Klik tombol di samping untuk membuat akun demo reseller Anda secara otomatis.'}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 shrink-0">
                                        <Link 
                                            href="/admin/impersonate/demo-user" 
                                            method="post" 
                                            as="button" 
                                            className="px-4 py-2 bg-[#E5654B] text-white text-xs font-bold rounded-xl hover:bg-[#d55a42] transition-colors shadow-sm inline-flex items-center gap-1.5"
                                        >
                                            <Icon d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" />
                                            {settings?.demo_user ? 'Masuk & Kelola Undangan Demo' : 'Buat & Kelola Akun Demo'}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4 border-t border-[#f0ede8]">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-[#E5654B] text-white text-sm font-bold rounded-xl hover:bg-[#d55a42] transition-colors shadow-sm disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                        </button>
                    </div>
                </form>
            </div>

            <CustomDomainTutorialModal 
                isOpen={isTutorialOpen} 
                onClose={() => setIsTutorialOpen(false)} 
            />
        </AdminLayout>
    );
}
