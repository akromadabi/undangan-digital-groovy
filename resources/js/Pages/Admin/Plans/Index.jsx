import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ plans }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const handleDelete = (id) => {
        if (confirm('Hapus paket ini?')) router.delete(`/admin/plans/${id}`);
    };

    return (
        <AdminLayout title="Manajemen Paket">
            <Head title="Admin - Plans" />
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Link href="/admin/plans/create" className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94f3a] transition-colors shadow-sm">+ Tambah Paket</Link>
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
                                <Link href={`/admin/plans/${plan.id}/edit`} className="text-xs text-[#E5654B] hover:underline font-semibold">Edit</Link>
                                <button onClick={() => handleDelete(plan.id)} className="text-xs text-red-500 hover:underline font-semibold">Hapus</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
