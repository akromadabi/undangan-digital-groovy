import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Index({ users, filters }) {
    const { auth, adminRoutePrefix } = usePage().props;
    const userList = users?.data || [];
    const pagination = users?.links;

    const isSuperAdmin = auth.user.role === 'super_admin';

    const [search, setSearch] = useState(filters?.search || '');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(`${adminRoutePrefix}/users`, { search }, { preserveState: true });
    };

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

    const renderPaketBadges = (user) => {
        const activeSubs = user.invitations?.map(inv => inv.active_subscription).filter(Boolean) || [];
        const activeCards = user.greeting_cards?.filter(card => card.is_active) || [];

        if (activeSubs.length === 0 && activeCards.length === 0) {
            return (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#f0ede8] text-[#999] inline-block">
                    Free
                </span>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-1">
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
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-600 border border-pink-100" title="Kartu Ucapan Aktif">
                        Kartu Ucapan
                    </span>
                )}
            </div>
        );
    };

    return (
        <DynamicAdminLayout title="Manajemen User">
            <Head title="Admin - Users" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Daftar User</h2>
                        <p className="text-[#999] text-sm mt-1">Kelola semua user yang terdaftar</p>
                    </div>
                    {isSuperAdmin && (
                        <Link href={`${adminRoutePrefix}/users/create`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] hover:-translate-y-0.5 transition-all">
                            <Icon d="M12 4.5v15m7.5-7.5h-15" className="w-4 h-4" />
                            Tambah User
                        </Link>
                    )}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Icon d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="w-full !pl-10 pr-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none"
                            style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    <button type="submit" className="px-4 py-2.5 bg-white border border-[#e8e5e0] text-[#555] text-sm rounded-xl hover:bg-[#f5f3f0] transition-colors">Cari</button>
                </form>

                {/* Desktop and Mobile Container */}
                <div className="space-y-4">
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden sm:block overflow-x-auto bg-white rounded-2xl border border-[#e8e5e0]">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0ede8]">
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">User</th>
                                    {isSuperAdmin && (
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Reseller</th>
                                    )}
                                    <th className="px-3 py-3 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Paket</th>
                                    <th className="px-3 py-3 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Undangan</th>
                                    <th className="px-3 py-3 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Kunjungan</th>
                                    <th className="px-3 py-3 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Komentar</th>
                                    <th className="px-3 py-3 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Status</th>
                                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {userList.map((user, i) => {
                                    const totalViews = user.invitations?.reduce((sum, inv) => sum + (inv.views_count || 0), 0) || 0;
                                    const totalWishes = user.invitations?.reduce((sum, inv) => sum + (inv.wishes?.length || 0), 0) || 0;
                                    const totalInvitations = user.invitations?.length || 0;
                                    const isActive = user.is_active !== false && user.is_active !== 0;

                                    return (
                                        <tr key={user.id} className="hover:bg-[#faf9f6] transition-colors">
                                            {/* User info */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                                        style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-bold text-[#333] truncate max-w-[170px] flex items-center gap-1.5">
                                                            <span>{user.name}</span>
                                                            {user.role === 'editor' && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                                    Editor
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-[#999] truncate max-w-[170px]">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Reseller info (Super Admin only) */}
                                            {isSuperAdmin && (
                                                <td className="px-4 py-3">
                                                    <div className="text-xs font-semibold text-[#555] truncate max-w-[150px]">
                                                        {user.reseller?.reseller_settings?.brand_name || user.reseller?.name || 'Super Admin / Utama'}
                                                    </div>
                                                </td>
                                            )}

                                            {/* Paket */}
                                            <td className="px-3 py-3 text-center">
                                                <div className="flex justify-center">
                                                    {renderPaketBadges(user)}
                                                </div>
                                            </td>

                                            {/* Undangan */}
                                            <td className="px-3 py-3 text-center">
                                                <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50/40 border border-blue-100/40 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none">
                                                    {totalInvitations}
                                                </span>
                                            </td>

                                            {/* Kunjungan */}
                                            <td className="px-3 py-3 text-center">
                                                <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50/40 border border-indigo-100/40 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none">
                                                    {totalViews.toLocaleString('id-ID')}
                                                </span>
                                            </td>

                                            {/* Komentar */}
                                            <td className="px-3 py-3 text-center">
                                                <span className="text-[11px] font-black text-[#E5654B] bg-orange-50 border border-orange-100/70 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none shadow-3xs">
                                                    {totalWishes}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-3 text-center">
                                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold select-none ${isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/30' : 'bg-red-50 text-red-500 border border-red-200/30'}`}>
                                                    {isActive ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`${adminRoutePrefix}/impersonate/user/${user.id}`} method="post" as="button"
                                                        className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors" title="Masuk sebagai User (Impersonasi)">
                                                        <Icon d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <Link href={`${adminRoutePrefix}/users/${user.id}`} className="p-1.5 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Detail">
                                                        <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                                    </Link>
                                                    {isSuperAdmin && (
                                                        <>
                                                            <Link href={`${adminRoutePrefix}/users/${user.id}/edit`} className="p-1.5 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Edit">
                                                                <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-3.5 h-3.5" />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(user.id)}
                                                                className={`p-1.5 rounded-lg transition-colors ${confirmDeleteId === user.id ? 'bg-red-500 text-white font-bold text-[10px] px-2' : 'hover:bg-red-50 text-[#999] hover:text-red-600'}`}
                                                                title={confirmDeleteId === user.id ? 'Klik lagi untuk konfirmasi hapus' : 'Hapus'}
                                                            >
                                                                {confirmDeleteId === user.id ? 'Yakin?' : <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {userList.length === 0 && (
                                    <tr>
                                        <td colSpan={isSuperAdmin ? 8 : 7} className="px-4 py-8 text-center text-[#999] text-xs">Belum ada user terdaftar</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="block sm:hidden space-y-2">
                        {userList.map((user, i) => {
                            const totalViews = user.invitations?.reduce((sum, inv) => sum + (inv.views_count || 0), 0) || 0;
                            const totalWishes = user.invitations?.reduce((sum, inv) => sum + (inv.wishes?.length || 0), 0) || 0;
                            const totalInvitations = user.invitations?.length || 0;
                            const isActive = user.is_active !== false && user.is_active !== 0;

                            return (
                                <div key={user.id} className="bg-white rounded-xl border border-[#e8e5e0] p-2.5 space-y-2 shadow-2xs transition-all active:scale-[0.99]">
                                    {/* User Header */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                                                style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-[11.5px] font-bold text-[#333] truncate leading-tight flex items-center gap-1">
                                                    <span className="truncate">{user.name}</span>
                                                    {user.role === 'editor' && (
                                                        <span className="px-1 py-0 rounded text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">
                                                            Editor
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[9.5px] text-[#999] truncate leading-none mt-0.5">{user.email}</div>
                                            </div>
                                        </div>
                                        <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-red-50 text-red-500 border border-red-200/50'}`}>
                                            {isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>

                                    {/* Reseller & Paket details */}
                                    <div className="flex items-center justify-between border-t border-[#f5f3f0] pt-1.5 text-[10px] text-[#666] gap-2">
                                        {isSuperAdmin && (
                                            <div className="min-w-0 truncate text-[9.5px]">
                                                <span className="text-[#aaa] mr-1">Reseller:</span>
                                                <span className="font-semibold text-gray-700">{user.reseller?.reseller_settings?.brand_name || user.reseller?.name || 'Utama'}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                                            <span className="text-[#aaa] text-[9.5px]">Paket:</span>
                                            {renderPaketBadges(user)}
                                        </div>
                                    </div>

                                    {/* Compact Stats & Actions Bar */}
                                    <div className="bg-[#faf9f7] border border-gray-100/80 rounded-lg px-2 py-1 flex items-center justify-between gap-1 text-[9.5px]">
                                        {/* Stats pills inline */}
                                        <div className="flex items-center gap-1.5 text-[9.5px] font-medium text-gray-500 truncate min-w-0">
                                            <span className="truncate"><strong className="text-blue-600 font-bold">{totalInvitations}</strong> Undangan</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="truncate"><strong className="text-indigo-600 font-bold">{totalViews.toLocaleString('id-ID')}</strong> Views</span>
                                            <span className="text-gray-300">·</span>
                                            <span className="truncate"><strong className="text-[#E5654B] font-bold">{totalWishes}</strong> Wishes</span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                                            <Link href={`${adminRoutePrefix}/impersonate/user/${user.id}`} method="post" as="button"
                                                className="p-1 rounded-md text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                                title="Masuk sebagai User (Login User)">
                                                <Icon d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="w-3.5 h-3.5" />
                                            </Link>
                                            <Link href={`${adminRoutePrefix}/users/${user.id}`} className="p-1 rounded-md text-gray-500 hover:text-gray-700 bg-white border border-gray-200 transition-colors" title="Detail">
                                                <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                            </Link>
                                            {isSuperAdmin && (
                                                <>
                                                    <Link href={`${adminRoutePrefix}/users/${user.id}/edit`} className="p-1 rounded-md text-gray-500 hover:text-gray-700 bg-white border border-gray-200 transition-colors" title="Edit">
                                                        <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(user.id)}
                                                        className={`p-1 rounded-md transition-colors ${confirmDeleteId === user.id ? 'bg-red-500 text-white font-bold text-[8.5px] px-1' : 'text-red-500 hover:text-red-700 bg-white border border-red-100'}`}
                                                        title="Hapus"
                                                    >
                                                        {confirmDeleteId === user.id ? 'Yakin?' : <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {userList.length === 0 && (
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-8 text-center text-[#999] text-xs">
                                Belum ada user terdaftar
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.length > 3 && (
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] px-4 py-3 flex items-center justify-between shadow-3xs">
                            <span className="text-xs text-[#999]">
                                Showing {users.from}-{users.to} of {users.total}
                            </span>
                            <div className="flex items-center gap-1">
                                {pagination.map((link, i) => (
                                    <button key={i} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })} disabled={!link.url}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${link.active ? 'bg-[#E5654B] text-white font-bold' : link.url ? 'text-[#999] hover:bg-[#f5f3f0]' : 'text-[#ddd] cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
