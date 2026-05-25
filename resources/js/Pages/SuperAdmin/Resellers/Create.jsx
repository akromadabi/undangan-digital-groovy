import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import CustomDomainTutorialModal from '@/Components/CustomDomainTutorialModal';
import axios from 'axios';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Create({ centralHost = 'undangan.com' }) {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        brand_name: '',
        subdomain: '',
        custom_domain: '',
    });

    const handleCheckSubdomain = async () => {
        if (!data.subdomain) return;
        setCheckingSubdomain(true);
        setSubdomainStatus(null);
        try {
            const response = await axios.get(`/api/check-subdomain?subdomain=${data.subdomain}`);
            setSubdomainStatus(response.data);
        } catch (error) {
            setSubdomainStatus({ available: false, message: 'Gagal memeriksa ketersediaan.' });
        } finally {
            setCheckingSubdomain(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/super-admin/resellers');
    };

    const inputClass = (field) => `w-full px-4 py-2.5 bg-white border ${errors[field] ? 'border-red-400' : 'border-[#e8e5e0]'} rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none`;

    return (
        <SuperAdminLayout title="Tambah Reseller">
            <Head title="Tambah Reseller — Super Admin" />
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back */}
                <div className="flex items-center gap-3">
                    <Link href="/super-admin/resellers" className="p-2 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors">
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-5 h-5" />
                    </Link>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Tambah Reseller Baru</h2>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5">
                    {/* Account Info */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] mb-4 pb-2 border-b border-[#f0ede8]">Info Akun</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Nama *</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass('name')} placeholder="Nama reseller" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Email *</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass('email')} placeholder="email@reseller.com" />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className={`${inputClass('password')} pr-10`}
                                        placeholder="Min 6 karakter"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Telepon</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass('phone')} placeholder="08xx" />
                            </div>
                        </div>
                    </div>

                    {/* Branding */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] mb-4 pb-2 border-b border-[#f0ede8]">Branding & Domain</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Nama Brand</label>
                                <input type="text" value={data.brand_name} onChange={e => setData('brand_name', e.target.value)} className={inputClass('brand_name')} placeholder="Nama brand reseller" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Subdomain</label>
                                <div className="flex items-center">
                                    <input type="text" value={data.subdomain} onChange={e => {
                                        setData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                                        setSubdomainStatus(null);
                                    }}
                                        className={`${inputClass('subdomain')} rounded-r-none`} placeholder="namareseller" />
                                    <span className="px-3 py-2.5 bg-[#f5f3f0] border border-l-0 border-[#e8e5e0] rounded-r-xl text-xs text-[#999] whitespace-nowrap">.{centralHost}</span>
                                </div>
                                {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain}</p>}
                                
                                <div className="mt-1.5 flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400">Hanya huruf kecil, angka, dan hubung (-)</span>
                                    <button
                                        type="button"
                                        onClick={handleCheckSubdomain}
                                        disabled={checkingSubdomain || !data.subdomain}
                                        className="text-xs font-semibold text-[#E5654B] hover:text-[#d55a42] transition-colors disabled:opacity-50 inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                    >
                                        {checkingSubdomain ? 'Memeriksa...' : 'Cek Ketersediaan'}
                                    </button>
                                </div>

                                {subdomainStatus && (
                                    <div className={`mt-2 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                                        subdomainStatus.available 
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        {subdomainStatus.available ? (
                                            <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-3.5 h-3.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        <span>{subdomainStatus.message}</span>
                                    </div>
                                )}
                            </div>
                             <div className="sm:col-span-2">
                                 <label className="block text-xs font-medium text-[#999] mb-1.5">Custom Domain (Opsional)</label>
                                 <input type="text" value={data.custom_domain} onChange={e => setData('custom_domain', e.target.value)} className={inputClass('custom_domain')} placeholder="undangan.domainanda.com" />
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
                     </div>

                     <CustomDomainTutorialModal 
                         isOpen={isTutorialOpen} 
                         onClose={() => setIsTutorialOpen(false)} 
                         centralHost={centralHost} 
                     />

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0ede8]">
                        <Link href="/super-admin/resellers" className="px-4 py-2.5 text-sm text-[#999] hover:text-[#555] transition-colors">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] disabled:opacity-50 transition-all">
                            {processing ? 'Menyimpan...' : 'Buat Reseller'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
