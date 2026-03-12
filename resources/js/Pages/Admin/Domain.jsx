import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Domain({ settings }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        subdomain: settings?.subdomain || '',
        custom_domain: settings?.custom_domain || '',
    });

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
                                onChange={e => setData('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                className="flex-1 px-4 py-2.5 bg-white border border-[#e8e5e0] rounded-l-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                                placeholder="namareseller"
                            />
                            <span className="px-4 py-2.5 bg-[#f5f3f0] border border-l-0 border-[#e8e5e0] rounded-r-xl text-sm text-[#999] whitespace-nowrap">.undangan.com</span>
                        </div>
                        {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain}</p>}
                        <p className="text-xs text-[#bbb] mt-1.5">Hanya huruf kecil, angka, dan tanda hubung (-)</p>

                        {data.subdomain && (
                            <div className="mt-3 bg-[#faf9f6] rounded-xl px-4 py-3 border border-[#e8e5e0] flex items-center gap-2">
                                <Icon d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" className="w-4 h-4 text-[#999]" />
                                <span className="text-sm text-[#555]">URL Anda: <strong className="text-[#E5654B]">{data.subdomain}.undangan.com</strong></span>
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
                    </div>

                    {/* DNS Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Icon d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <h4 className="text-sm font-bold text-blue-800">Cara Setting Custom Domain</h4>
                        </div>
                        <ol className="text-sm text-blue-700 space-y-2 pl-4 list-decimal">
                            <li>Login ke panel DNS domain Anda (Cloudflare, Namecheap, dll.)</li>
                            <li>Tambahkan record <strong>CNAME</strong> dengan nilai:
                                <div className="mt-1 bg-blue-100 rounded-lg px-3 py-2 font-mono text-xs">
                                    <div className="flex justify-between"><span className="text-blue-500">Type:</span> <span>CNAME</span></div>
                                    <div className="flex justify-between"><span className="text-blue-500">Name:</span> <span>undangan (atau subdomain Anda)</span></div>
                                    <div className="flex justify-between"><span className="text-blue-500">Target:</span> <span>app.undangan.com</span></div>
                                </div>
                            </li>
                            <li>Tunggu propagasi DNS (biasanya 5-30 menit)</li>
                            <li>Masukkan domain di kolom di atas dan simpan</li>
                        </ol>
                    </div>

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
