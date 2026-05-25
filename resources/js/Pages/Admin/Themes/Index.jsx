import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

export default function Index({ themes }) {
    const { adminRoutePrefix } = usePage().props;
    const handleDelete = (id) => { if (confirm('Hapus tema?')) router.delete(`${adminRoutePrefix}/themes/${id}`); };

    return (
        <DynamicAdminLayout title="Manajemen Tema">
            <Head title="Admin - Themes" />
            <div className="space-y-6">
                <div className="flex justify-end">
                    <Link href={`${adminRoutePrefix}/themes/create`} className="px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94f3a] transition-colors shadow-sm">+ Tambah Tema</Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {themes?.map(theme => (
                        <div key={theme.id} className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="aspect-[9/16] bg-[#f8f7f4] relative">
                                {theme.thumbnail ? (
                                    <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-[#ddd]"><svg className="w-10 h-10 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" /></svg></div>
                                )}
                                <div className={`absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm ${theme.is_active ? 'bg-emerald-500' : 'bg-gray-500'}`}>
                                    {theme.is_active ? 'PUBLISHED' : 'DRAFT'}
                                </div>
                                {theme.is_premium && (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">PREMIUM</div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                    <span className="text-xs text-white/90">{theme.invitations_count || 0} undangan</span>
                                </div>
                            </div>
                            <div className="p-3 space-y-2">
                                <h4 className="font-semibold text-[#333] text-sm">{theme.name}</h4>
                                <div className="flex items-center justify-between border-t border-[#e8e5e0] pt-2 mt-2">
                                    <div className="flex gap-3">
                                        <Link href={`${adminRoutePrefix}/themes/${theme.id}/edit`} className="text-xs text-[#E5654B] hover:underline font-semibold">Edit</Link>
                                        <button onClick={() => handleDelete(theme.id)} className="text-xs text-red-500 hover:underline font-semibold">Hapus</button>
                                    </div>
                                    <a href={`/demo/${theme.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Pratinjau
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
