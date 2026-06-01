import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { Save, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Index({ plans, greetingCardPrice, greetingCardSuggestedPrice }) {
    const { adminRoutePrefix } = usePage().props;
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
    const [saved, setSaved] = useState(false);

    const handleDelete = (id) => {
        if (confirm('Hapus paket ini?')) router.delete(`${adminRoutePrefix}/plans/${id}`);
    };

    const { data, setData, post, processing, errors } = useForm({
        price: greetingCardPrice || 49000,
        suggested_price: greetingCardSuggestedPrice || 49000,
    });

    const handleGreetingCardSubmit = (e) => {
        e.preventDefault();
        post(`${adminRoutePrefix}/plans/update-greeting-card-price`, {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        });
    };

    return (
        <DynamicAdminLayout title="Manajemen Paket & Layanan">
            <Head title="Admin - Paket & Layanan" />
            
            <div className="space-y-8">
                {/* Bagian 1: Harga Paket Undangan (Kelas) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-[#1a1a1a]">Daftar Paket Undangan</h2>
                            <p className="text-xs text-gray-500">Kelola paket (kelas) subscription untuk undangan digital.</p>
                        </div>
                        <Link href={`${adminRoutePrefix}/plans/create`} className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94f3a] transition-colors shadow-sm">+ Tambah Paket</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {plans?.map(plan => (
                            <div key={plan.id} className="bg-white rounded-2xl border border-[#e8e5e0] p-5 space-y-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-[#1a1a1a]">{plan.name}</h3>
                                    <span className="text-xs text-[#999] bg-[#f8f7f4] px-2 py-0.5 rounded-lg">{plan.subscriptions_count || 0} users</span>
                                </div>
                                <div className="text-2xl font-bold text-[#E5654B]">{formatCurrency(plan.price)}</div>
                                <p className="text-xs text-[#999]">{plan.duration_days} hari • Max {plan.max_guests} tamu • {plan.max_galleries} foto</p>
                                <div className="flex gap-3 pt-3 border-t border-[#f0ede8]">
                                    <Link href={`${adminRoutePrefix}/plans/${plan.id}/edit`} className="text-xs text-[#E5654B] hover:underline font-semibold">Edit</Link>
                                    <button onClick={() => handleDelete(plan.id)} className="text-xs text-red-500 hover:underline font-semibold">Hapus</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bagian 2: Harga Kartu Ucapan */}
                <div className="border-t border-[#f0ede8] pt-8 space-y-4">
                    <div>
                        <h2 className="text-lg font-bold text-[#1a1a1a]">Pengaturan Harga Kartu Ucapan</h2>
                        <p className="text-xs text-gray-500">Tentukan satu harga dasar global dan saran harga jual untuk seluruh template kartu ucapan.</p>
                    </div>

                    <div className="max-w-xl">
                        <form onSubmit={handleGreetingCardSubmit} className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                            {saved && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2">
                                    <CheckCircle size={14} /> Harga Kartu Ucapan berhasil diperbarui!
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Harga Dasar Platform (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                                        <input
                                            type="number"
                                            value={data.price}
                                            onChange={e => setData('price', parseFloat(e.target.value) || 0)}
                                            style={{ paddingLeft: '2.25rem' }}
                                            className="w-full border border-[#e8e5e0] rounded-xl px-3 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] font-semibold text-gray-800"
                                            placeholder="Contoh: 20000"
                                            required
                                        />
                                    </div>
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Saran Harga Jual Reseller (Rp)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                                        <input
                                            type="number"
                                            value={data.suggested_price}
                                            onChange={e => setData('suggested_price', parseFloat(e.target.value) || 0)}
                                            style={{ paddingLeft: '2.25rem' }}
                                            className="w-full border border-[#e8e5e0] rounded-xl px-3 py-2.5 text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] font-semibold text-gray-800"
                                            placeholder="Contoh: 49000"
                                        />
                                    </div>
                                    {errors.suggested_price && <p className="text-red-500 text-xs mt-1">{errors.suggested_price}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2 border-t border-[#f0ede8]">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#E5654B] text-white rounded-xl text-xs font-semibold hover:bg-[#c94f3a] transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    {processing ? 'Menyimpan...' : 'Simpan Harga Kartu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
