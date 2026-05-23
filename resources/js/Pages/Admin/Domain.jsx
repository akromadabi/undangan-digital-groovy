import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CustomDomainTutorialModal from '@/Components/CustomDomainTutorialModal';
import axios from 'axios';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Domain({ settings, centralHost = 'undangan.com' }) {
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState(null);
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        subdomain: settings?.subdomain || '',
        custom_domain: settings?.custom_domain || '',
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
        post('/admin/domain');
    };

    return (
        <AdminLayout title="Domain">
            <Head title="Domain" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Pengaturan Domain</h2>
                    <p className="text-[#999] text-sm mt-1">Atur subdomain dan custom domain untuk reseller Anda</p>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-6">
                    {/* Subdomain */}
                    <div>
                        <label className="block text-sm font-bold text-[#333] mb-2">Subdomain</label>
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
                            <button
                                type="button"
                                onClick={handleCheckSubdomain}
                                disabled={checkingSubdomain || !data.subdomain}
                                className="text-xs font-semibold text-[#E5654B] hover:text-[#d55a42] transition-colors disabled:opacity-50 inline-flex items-center gap-1 bg-transparent border-none cursor-pointer"
                            >
                                {checkingSubdomain ? (
                                    <>
                                        <svg className="animate-spin h-3.5 w-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Memeriksa...
                                    </>
                                ) : 'Cek Ketersediaan'}
                            </button>
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
                                <span className="text-sm text-[#555]">URL Anda: <strong className="text-[#E5654B]">{data.subdomain}.{centralHost}</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Custom Domain */}
                    <div className="border-t border-[#f0ede8] pt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-sm font-bold text-[#333]">Custom Domain</label>
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

                    <CustomDomainTutorialModal 
                        isOpen={isTutorialOpen} 
                        onClose={() => setIsTutorialOpen(false)} 
                        centralHost={centralHost} 
                    />

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] disabled:opacity-50 transition-all">
                            {processing ? 'Menyimpan...' : 'Simpan Domain'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
