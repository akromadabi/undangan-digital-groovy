import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Key, RotateCw } from 'lucide-react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import CustomDomainTutorialModal from '@/Components/CustomDomainTutorialModal';
import axios from 'axios';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Edit({ reseller, centralHost = 'undangan.com' }) {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState(null);
    const settings = reseller.reseller_settings;
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: reseller.name || '',
        email: reseller.email || '',
        phone: reseller.phone || '',
        is_active: reseller.is_active === 1 || reseller.is_active === true,
        brand_name: settings?.brand_name || '',
        subdomain: settings?.subdomain || '',
        custom_domain: settings?.custom_domain || '',
    });

    const handleCheckSubdomain = async () => {
        if (!data.subdomain) return;
        setCheckingSubdomain(true);
        setSubdomainStatus(null);
        try {
            const response = await axios.get(`/api/check-subdomain?subdomain=${data.subdomain}&exclude_user_id=${reseller.id}`);
            setSubdomainStatus(response.data);
        } catch (error) {
            setSubdomainStatus({ available: false, message: 'Gagal memeriksa ketersediaan.' });
        } finally {
            setCheckingSubdomain(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/super-admin/resellers/${reseller.id}`);
    };

    const [pw, setPw] = useState({ password: '', password_confirmation: '' });
    const [pwProcessing, setPwProcessing] = useState(false);
    const [pwMsg, setPwMsg] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        setPwProcessing(true);
        router.post(`/super-admin/resellers/${reseller.id}/reset-password`, pw, {
            preserveScroll: true,
            onSuccess: () => { setPw({ password: '', password_confirmation: '' }); setPwMsg('Password berhasil direset!'); },
            onError: (errs) => { setPwMsg('' + Object.values(errs).flat().join(', ')); },
            onFinish: () => setPwProcessing(false),
        });
    };

    const inputClass = (field) => `w-full px-4 py-2.5 bg-white border ${errors[field] ? 'border-red-400' : 'border-[#e8e5e0]'} rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none`;

    return (
        <SuperAdminLayout title="Edit Reseller">
            <Head title={`Edit Reseller ${reseller.name} — Super Admin`} />
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back */}
                <div className="flex items-center gap-3">
                    <Link href={`/super-admin/resellers/${reseller.id}`} className="p-2 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors">
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-5 h-5" />
                    </Link>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Edit Reseller: {reseller.name}</h2>
                </div>

                <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5">
                    {/* Reset Password */}
                    <div>
                        <h3 className="text-sm font-bold text-[#1a1a1a] mb-4 pb-2 border-b border-[#f0ede8] flex items-center gap-2">
                            <Key size={16} className="text-amber-500" /> Reset Password
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Password Baru</label>
                                <input type="password" value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none" placeholder="Minimal 6 karakter" minLength={6} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Konfirmasi Password</label>
                                <input type="password" value={pw.password_confirmation} onChange={e => setPw({ ...pw, password_confirmation: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none" placeholder="Ulangi password" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <button type="button" onClick={handleResetPassword} disabled={pwProcessing || !pw.password}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                                {pwProcessing ? <><RotateCw size={14} className="animate-spin" /> Mereset...</> : <><Key size={14} /> Reset Password</>}
                            </button>
                            {pwMsg && <span className="text-sm font-medium">{pwMsg}</span>}
                        </div>
                    </div>

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
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Telepon</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass('phone')} placeholder="08xx" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Status Akun</label>
                                <div className="flex items-center h-10">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E5654B]"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-700">{data.is_active ? 'Aktif' : 'Nonaktif'}</span>
                                    </label>
                                </div>
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
                        <Link href={`/super-admin/resellers/${reseller.id}`} className="px-4 py-2.5 text-sm text-[#999] hover:text-[#555] transition-colors">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] disabled:opacity-50 transition-all">
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </SuperAdminLayout>
    );
}
