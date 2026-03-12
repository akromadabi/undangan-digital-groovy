import { Head, Link, useForm } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        brand_name: '',
        subdomain: '',
    });

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
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={inputClass('password')} placeholder="Min 6 karakter" />
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
                        <h3 className="text-sm font-bold text-[#1a1a1a] mb-4 pb-2 border-b border-[#f0ede8]">Branding</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Nama Brand</label>
                                <input type="text" value={data.brand_name} onChange={e => setData('brand_name', e.target.value)} className={inputClass('brand_name')} placeholder="Nama brand reseller" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#999] mb-1.5">Subdomain</label>
                                <div className="flex items-center">
                                    <input type="text" value={data.subdomain} onChange={e => setData('subdomain', e.target.value)}
                                        className={`${inputClass('subdomain')} rounded-r-none`} placeholder="namareseller" />
                                    <span className="px-3 py-2.5 bg-[#f5f3f0] border border-l-0 border-[#e8e5e0] rounded-r-xl text-xs text-[#999] whitespace-nowrap">.domain.com</span>
                                </div>
                                {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain}</p>}
                            </div>
                        </div>
                    </div>

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
