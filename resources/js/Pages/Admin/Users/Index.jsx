import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { Eye, Pencil, UserCheck, Trash2 } from 'lucide-react';

export default function Index({ users, filters }) {
    const { auth, adminRoutePrefix } = usePage().props;
    const userList = users?.data || [];
    const pagination = users?.links;

    const isSuperAdmin = auth.user.role === 'super_admin';

    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleDelete = (id) => {
        if (confirmDeleteId === id) {
            router.delete(`${adminRoutePrefix}/users/${id}`, {
                onSuccess: () => { setConfirmDeleteId(null); },
                onError: (err) => { console.error('Delete error:', err); setConfirmDeleteId(null); },
            });
        } else {
            setConfirmDeleteId(id);
            setTimeout(() => setConfirmDeleteId(prev => prev === id ? null : prev), 3000);
        }
    };

    return (
        <DynamicAdminLayout title="Manajemen User">
            <Head title="Admin - Users" />
            <div className="space-y-6">
                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input type="text" defaultValue={filters?.search || ''} placeholder="Cari nama / email..."
                        onKeyDown={(e) => e.key === 'Enter' && router.get(`${adminRoutePrefix}/users`, { search: e.target.value }, { preserveState: true })}
                        className="flex-1 bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#bbb] focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B] w-full" />
                    {isSuperAdmin && (
                        <Link href={`${adminRoutePrefix}/users/create`} className="w-full sm:w-auto px-5 py-2.5 bg-[#E5654B] hover:bg-[#c94f3a] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Tambah User</span>
                        </Link>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className={`w-full text-sm ${isSuperAdmin ? 'min-w-[750px]' : 'min-w-[550px]'} sm:min-w-full`}>
                            <thead className="bg-[#f8f7f4]">
                                <tr>
                                    <th className="text-left px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide">User</th>
                                    {isSuperAdmin && (
                                        <th className="text-left px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide">Reseller</th>
                                    )}
                                    <th className="text-left px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide hidden sm:table-cell">Email</th>
                                    <th className="text-center px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide">Paket</th>
                                    <th className="text-center px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide">Tanggal</th>
                                    <th className="text-center px-3 sm:px-5 py-3 text-[#999] font-semibold text-xs tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0ede8]">
                                {userList.map(user => (
                                    <tr key={user.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-3 sm:px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center text-xs font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                     <div className="font-medium text-[#333] flex items-center gap-2">
                                                         <span>{user.name}</span>
                                                         {user.role === 'editor' && (
                                                             <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                                 Editor
                                                             </span>
                                                         )}
                                                     </div>
                                                     <div className="text-xs text-[#999] sm:hidden">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {isSuperAdmin && (
                                            <td className="px-3 sm:px-5 py-3 text-[#555] font-medium">
                                                {user.reseller?.reseller_settings?.brand_name || user.reseller?.name || 'Super Admin / Utama'}
                                            </td>
                                        )}
                                        <td className="px-3 sm:px-5 py-3 text-[#777] hidden sm:table-cell">{user.email}</td>
                                        <td className="px-3 sm:px-5 py-3 text-center">
                                            {(() => {
                                                const activeSubs = user.invitations?.map(inv => inv.active_subscription).filter(Boolean) || [];
                                                const activeCards = user.greeting_cards?.filter(card => card.is_active) || [];
                                                
                                                if (activeSubs.length === 0 && activeCards.length === 0) {
                                                    return (
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0ede8] text-[#999]">
                                                            Free
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <div className="flex flex-wrap items-center justify-center gap-1 max-w-[150px] mx-auto">
                                                        {activeSubs.map((sub, si) => {
                                                            const plan = sub.plan;
                                                            const slug = plan?.slug || 'free';
                                                            const name = plan?.name || 'Free';
                                                            
                                                            const bgClass = slug === 'platinum' ? 'bg-violet-50 text-violet-600 border border-violet-100' :
                                                                            slug === 'gold' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                                            slug === 'silver' ? 'bg-slate-50 text-slate-600 border border-slate-100' :
                                                                            'bg-[#f0ede8] text-[#999]';
                                                            return (
                                                                <span key={si} className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${bgClass}`} title={name}>
                                                                    {name}
                                                                </span>
                                                            );
                                                        })}
                                                        {activeCards.length > 0 && (
                                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-600 border border-pink-100 animate-pulse" title="Kartu Ucapan Aktif">
                                                                Kartu Ucapan
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3 text-center text-xs text-[#999]">
                                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-3 sm:px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link href={`${adminRoutePrefix}/users/${user.id}`} className="p-2 bg-[#fdfdfd] hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-all inline-flex items-center justify-center border border-slate-100 shadow-sm" title="Lihat Detail">
                                                    <Eye size={15} />
                                                </Link>
                                                <Link 
                                                    href={`${adminRoutePrefix}/impersonate/user/${user.id}`} 
                                                    method="post" 
                                                    as="button"
                                                    className="p-2 bg-[#fdfdfd] hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-xl transition-all inline-flex items-center justify-center border border-emerald-100 shadow-sm" 
                                                    title="Masuk sebagai User (Impersonasi)"
                                                >
                                                    <UserCheck size={15} />
                                                </Link>
                                                {isSuperAdmin && (
                                                    <>
                                                        <Link href={`${adminRoutePrefix}/users/${user.id}/edit`} className="p-2 bg-[#fdfdfd] hover:bg-amber-50 text-amber-600 hover:text-amber-700 rounded-xl transition-all inline-flex items-center justify-center border border-amber-100 shadow-sm" title="Edit User">
                                                            <Pencil size={15} />
                                                        </Link>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleDelete(user.id)}
                                                            className={`p-2 rounded-xl transition-all inline-flex items-center justify-center border shadow-sm ${confirmDeleteId === user.id ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 animate-pulse' : 'bg-[#fdfdfd] hover:bg-red-50 text-red-500 border-red-100'}`}
                                                            title={confirmDeleteId === user.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus User'}
                                                        >
                                                            <Trash2 size={15} />
                                                            {confirmDeleteId === user.id && <span className="text-[10px] font-bold ml-1">Yakin?</span>}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {pagination && pagination.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {pagination.map((link, i) => (
                            <button key={i} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} disabled={!link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-[#E5654B] text-white' : 'bg-white border border-[#e8e5e0] text-[#777] hover:bg-[#f8f7f4]'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </DynamicAdminLayout>
    );
}

