import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Form({ plan, features }) {
    const { adminRoutePrefix } = usePage().props;
    const isEdit = !!plan;
    const featureAccess = {};
    plan?.feature_access?.forEach(fa => { featureAccess[fa.feature_id] = fa.is_enabled; });

    const { data, setData, post, put, processing, errors } = useForm({
        name: plan?.name || '', slug: plan?.slug || '', description: plan?.description || '',
        price: plan?.price || 0, duration_days: plan?.duration_days || 30,
        max_guests: plan?.max_guests || 50, max_galleries: plan?.max_galleries || 5,
        sort_order: plan?.sort_order || 0, features: featureAccess,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) { put(`${adminRoutePrefix}/plans/${plan.id}`); } else { post(`${adminRoutePrefix}/plans`); }
    };

    const toggleFeature = (id) => {
        setData('features', { ...data.features, [id]: !data.features[id] });
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] disabled:opacity-50 disabled:bg-[#f8f7f4]';
    const labelClass = 'text-xs font-semibold text-[#999] mb-1.5 block tracking-wide';

    return (
        <DynamicAdminLayout title={isEdit ? `Edit: ${plan.name}` : 'Tambah Paket'}>
            <Head title={isEdit ? 'Edit Paket' : 'Tambah Paket'} />
            <div className="max-w-2xl space-y-6">
                <Link href={`${adminRoutePrefix}/plans`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium">← Kembali</Link>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5">
                        <h3 className="font-bold text-[#1a1a1a] text-lg">Info Paket</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Nama *', key: 'name', type: 'text' },
                                { label: 'Slug *', key: 'slug', type: 'text', disabled: isEdit },
                                { label: 'Harga (Rp) *', key: 'price', type: 'number' },
                                { label: 'Durasi (hari) *', key: 'duration_days', type: 'number' },
                                { label: 'Max Tamu *', key: 'max_guests', type: 'number' },
                                { label: 'Max Galeri *', key: 'max_galleries', type: 'number' },
                                { label: 'Urutan', key: 'sort_order', type: 'number' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className={labelClass}>{f.label}</label>
                                    <input type={f.type} value={data[f.key]} disabled={f.disabled}
                                        onChange={(e) => setData(f.key, f.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                                        className={inputClass} />
                                    {errors[f.key] && <p className="text-red-500 text-xs mt-1">{errors[f.key]}</p>}
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className={labelClass}>Deskripsi</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                                className={`${inputClass} resize-none`} rows={2} />
                        </div>
                    </div>

                    {/* Feature Access */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                        <h3 className="font-bold text-[#1a1a1a] text-lg mb-4">Akses Fitur</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {features?.map(f => (
                                <label key={f.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${data.features[f.id] ? 'bg-[#E5654B]/5 border-2 border-[#E5654B]/30' : 'bg-[#f8f7f4] border-2 border-transparent hover:border-[#e8e5e0]'}`}>
                                    <input type="checkbox" checked={!!data.features[f.id]} onChange={() => toggleFeature(f.id)}
                                        className="rounded border-[#e8e5e0] text-[#E5654B] focus:ring-[#E5654B]" />
                                    <span className={`text-sm font-medium ${data.features[f.id] ? 'text-[#E5654B]' : 'text-[#555]'}`}>{f.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-[#E5654B] text-white rounded-xl font-semibold hover:bg-[#c94f3a] disabled:opacity-50 transition-colors shadow-sm">
                        {processing ? 'Menyimpan...' : isEdit ? 'Update Paket' : 'Buat Paket'}
                    </button>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
