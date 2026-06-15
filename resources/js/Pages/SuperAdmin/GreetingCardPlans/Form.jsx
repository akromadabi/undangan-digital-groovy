import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Form({ plan }) {
    const { adminRoutePrefix } = usePage().props;
    const isEdit = !!plan;

    const { data, setData, post, put, processing, errors } = useForm({
        name: plan?.name || '',
        slug: plan?.slug || '',
        description: plan?.description || '',
        price: plan?.price ?? 0,
        suggested_price: plan?.suggested_price ?? '',
        duration_days: plan?.duration_days ?? 365,
        max_galleries: plan?.max_galleries ?? 5,
        sort_order: plan?.sort_order ?? 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`${adminRoutePrefix}/greeting-card-plans/${plan.id}`);
        } else {
            post(`${adminRoutePrefix}/greeting-card-plans`);
        }
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 disabled:bg-[#f8f7f4] font-semibold';
    const labelClass = 'text-xs font-semibold text-gray-500 mb-1.5 block tracking-wide';

    return (
        <DynamicAdminLayout title={isEdit ? `Edit Paket: ${plan.name}` : 'Tambah Paket Kartu Ucapan'}>
            <Head title={isEdit ? 'Edit Paket Kartu' : 'Tambah Paket Kartu'} />
            <div className="max-w-2xl space-y-6">
                <Link
                    href={`${adminRoutePrefix}/greeting-card-plans`}
                    className="inline-flex items-center gap-1.5 text-[#E5654B] hover:text-[#c94f3a] text-sm font-semibold transition-colors"
                >
                    <ArrowLeft size={16} />
                    Kembali ke Daftar Paket
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-3xl border border-[#e8e5e0] p-6 space-y-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 text-lg">Informasi Paket Kartu Ucapan</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nama Paket *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: Basic Card"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Slug Paket (Unique Identifier) *</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    disabled={isEdit}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: card_basic"
                                    required
                                />
                                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Harga Dasar Platform (Rp) *</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">Rp</span>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                        style={{ paddingLeft: '2.5rem' }}
                                        className={inputClass}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Saran Harga Jual Reseller (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">Rp</span>
                                    <input
                                        type="number"
                                        value={data.suggested_price}
                                        onChange={(e) => setData('suggested_price', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))}
                                        style={{ paddingLeft: '2.5rem' }}
                                        className={inputClass}
                                        placeholder="Contoh: 19000"
                                    />
                                </div>
                                {errors.suggested_price && <p className="text-red-500 text-xs mt-1">{errors.suggested_price}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Durasi Berlangganan (Hari) *</label>
                                <input
                                    type="number"
                                    value={data.duration_days}
                                    onChange={(e) => setData('duration_days', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="Contoh: 365"
                                    required
                                />
                                {errors.duration_days && <p className="text-red-500 text-xs mt-1">{errors.duration_days}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Maksimal Galeri Foto *</label>
                                <input
                                    type="number"
                                    value={data.max_galleries}
                                    onChange={(e) => setData('max_galleries', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="Contoh: 5"
                                    required
                                />
                                {errors.max_galleries && <p className="text-red-500 text-xs mt-1">{errors.max_galleries}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Urutan Tampilan</label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    placeholder="0"
                                    required
                                />
                                {errors.sort_order && <p className="text-red-500 text-xs mt-1">{errors.sort_order}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Deskripsi Paket</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`${inputClass} resize-none font-normal`}
                                placeholder="Tulis deskripsi singkat tentang paket kartu ucapan ini..."
                                rows={3}
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#E5654B] to-[#ff7d63] hover:from-[#c94f3a] hover:to-[#e05b41] text-white rounded-2xl font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        <Save size={16} />
                        {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Paket'}
                    </button>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
