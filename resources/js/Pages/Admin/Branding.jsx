import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Branding({ settings }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        brand_name: settings?.brand_name || '',
        brand_logo: null,
        remove_logo: false,
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

    const submit = (e) => {
        e.preventDefault();
        post('/admin/branding', { forceFormData: true });
    };

    const logoUrl = preview || (settings?.brand_logo ? `/storage/${settings.brand_logo}` : null);

    return (
        <AdminLayout title="Branding">
            <Head title="Branding" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Pengaturan Branding</h2>
                    <p className="text-[#999] text-sm mt-1">Atur identitas brand reseller Anda</p>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-6">
                    {/* Logo */}
                    <div>
                        <label className="block text-sm font-bold text-[#333] mb-3">Logo Brand</label>
                        <div className="flex items-start gap-6">
                            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#e8e5e0] flex items-center justify-center bg-[#faf9f6] overflow-hidden flex-shrink-0">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Icon d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 6.75V18a2.25 2.25 0 002.25 2.25H18A2.25 2.25 0 0020.25 18V6.75a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6.75z" className="w-8 h-8 text-[#ddd]" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#f5f3f0] text-[#555] text-sm rounded-xl hover:bg-[#e8e5e0] transition-colors cursor-pointer">
                                    <Icon d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" className="w-4 h-4" />
                                    Upload Logo
                                    <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                                </label>
                                {logoUrl && (
                                    <button type="button" onClick={removeLogo} className="text-xs text-red-500 hover:text-red-700 transition-colors block">
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

                    {/* Preview */}
                    <div className="border-t border-[#f0ede8] pt-5">
                        <label className="block text-sm font-bold text-[#333] mb-3">Preview</label>
                        <div className="bg-[#faf9f6] rounded-xl p-5 flex items-center gap-3 border border-[#e8e5e0]">
                            <div className="w-10 h-10 rounded-xl bg-[#E5654B] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-white font-bold text-sm">{(data.brand_name || 'B').charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-[#1a1a1a] text-[15px]">{data.brand_name || 'Nama Brand'}</div>
                                <div className="text-[11px] text-[#999]">RESELLER PANEL</div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] disabled:opacity-50 transition-all">
                            {processing ? 'Menyimpan...' : 'Simpan Branding'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
