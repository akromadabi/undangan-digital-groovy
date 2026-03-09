import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ themes }) {
    const handleDelete = (id) => { if (confirm('Hapus tema?')) router.delete(`/admin/themes/${id}`); };

    return (
        <AdminLayout title="Manajemen Tema">
            <Head title="Admin - Themes" />
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Link href="/admin/themes/create" className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94f3a] transition-colors shadow-sm">+ Tambah Tema</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes?.map(theme => (
                        <div key={theme.id} className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-[9/16] bg-[#f8f7f4] relative">
                                {theme.thumbnail ? (
                                    <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-[#ddd]">🎨</div>
                                )}
                                {theme.is_premium && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">PREMIUM</div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <span className="text-xs text-white/90">{theme.invitations_count || 0} undangan</span>
                                </div>
                            </div>
                            <div className="p-3 space-y-2">
                                <h4 className="font-semibold text-[#333] text-sm">{theme.name}</h4>
                                <div className="flex gap-3">
                                    <Link href={`/admin/themes/${theme.id}/edit`} className="text-xs text-[#E5654B] hover:underline font-semibold">Edit</Link>
                                    <button onClick={() => handleDelete(theme.id)} className="text-xs text-red-500 hover:underline font-semibold">Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
