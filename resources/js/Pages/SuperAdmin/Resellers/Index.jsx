import { Head, Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useState } from 'react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Index({ resellers, filters, centralHost }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/super-admin/resellers', { search }, { preserveState: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus reseller "${name}"? Semua user di bawah reseller ini akan dialihkan menjadi tanpa reseller.`)) {
            router.delete(`/super-admin/resellers/${id}`);
        }
    };

    const handleToggleStatus = (id, name, isActive) => {
        const action = isActive ? 'menonaktifkan' : 'mengaktifkan';
        if (confirm(`Apakah Anda yakin ingin ${action} reseller "${name}"?`)) {
            router.post(`/super-admin/resellers/${id}/toggle-status`, {}, {
                preserveScroll: true,
            });
        }
    };

    return (
        <SuperAdminLayout title="Kelola Reseller">
            <Head title="Reseller — Super Admin" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a]">Daftar Reseller</h2>
                        <p className="text-[#999] text-sm mt-1">Kelola semua reseller yang terdaftar</p>
                    </div>
                    <Link href="/super-admin/resellers/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E5654B] text-white text-sm font-medium rounded-xl shadow-sm hover:bg-[#d55a42] hover:-translate-y-0.5 transition-all">
                        <Icon d="M12 4.5v15m7.5-7.5h-15" className="w-4 h-4" />
                        Tambah Reseller
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Icon d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8e5e0] rounded-xl text-sm text-[#333] placeholder-[#bbb] focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none" />
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
                                    <th rowSpan={2} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Reseller</th>
                                    <th rowSpan={2} className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Brand</th>
                                    <th rowSpan={2} className="px-3 py-2.5 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Users</th>
                                    <th colSpan={3} className="px-3 py-1.5 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider border-b border-[#f0ede8]">Pengunjung</th>
                                    <th rowSpan={2} className="px-3 py-2.5 text-center text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Status</th>
                                    <th rowSpan={2} className="px-4 py-2.5 text-right text-[11px] font-semibold text-[#999] uppercase tracking-wider align-middle">Aksi</th>
                                </tr>
                                <tr className="border-b border-[#f0ede8] bg-gray-50/30">
                                    <th className="px-2 py-1.5 text-center text-[9.5px] font-bold text-[#999] uppercase tracking-wider border-r border-[#f0ede8]/40">Hari</th>
                                    <th className="px-2 py-1.5 text-center text-[9.5px] font-bold text-[#999] uppercase tracking-wider border-r border-[#f0ede8]/40">Bulan</th>
                                    <th className="px-2 py-1.5 text-center text-[9.5px] font-bold text-[#999] uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {resellers?.data?.map((r, i) => (
                                    <tr key={r.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                                    style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                                    {r.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs font-bold text-[#333] truncate max-w-[150px]">{r.name}</div>
                                                    <div className="text-[10px] text-[#999] truncate max-w-[150px]">{r.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs font-semibold text-[#555] truncate max-w-[130px]">{r.reseller_settings?.brand_name || '-'}</div>
                                            <div className="text-[10px] text-[#bbb] truncate max-w-[130px]" title={r.reseller_settings?.custom_domain || `${r.reseller_settings?.subdomain}.${centralHost}`}>
                                                {r.reseller_settings?.custom_domain 
                                                    ? r.reseller_settings.custom_domain 
                                                    : (r.reseller_settings?.subdomain 
                                                        ? `${r.reseller_settings.subdomain}.${centralHost}` 
                                                        : '-')}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className="text-xs font-bold text-[#333]">{r.reseller_users_count || 0}</span>
                                        </td>
                                        {/* Hari */}
                                        <td className="px-2 py-3 text-center border-r border-[#f5f3f0]/60">
                                            <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50/40 border border-blue-100/40 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none">{r.visitor_stats?.today || 0}</span>
                                        </td>
                                        {/* Bulan */}
                                        <td className="px-2 py-3 text-center border-r border-[#f5f3f0]/60">
                                            <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50/40 border border-indigo-100/40 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none">{r.visitor_stats?.month || 0}</span>
                                        </td>
                                        {/* Total */}
                                        <td className="px-2 py-3 text-center">
                                            <span className="text-[11px] font-black text-[#E5654B] bg-orange-50 border border-orange-100/70 px-2 py-0.5 rounded-md inline-block min-w-[36px] text-center select-none shadow-3xs">{r.visitor_stats?.total || 0}</span>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleStatus(r.id, r.name, r.is_active === 1 || r.is_active === true)}
                                                className={`text-[10px] px-2 py-1 rounded-full font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${r.is_active === 1 || r.is_active === true ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200/30' : 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200/30'}`}
                                                title="Klik untuk mengubah status aktif/nonaktif reseller"
                                            >
                                                {r.is_active === 1 || r.is_active === true ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/super-admin/impersonate/reseller/${r.id}`} method="post" as="button"
                                                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors" title="Impersonasi">
                                                    <Icon d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="w-3.5 h-3.5" />
                                                </Link>
                                                <Link href={`/super-admin/resellers/${r.id}`} className="p-1.5 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Detail">
                                                    <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                                </Link>
                                                <Link href={`/super-admin/resellers/${r.id}/edit`} className="p-1.5 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Edit">
                                                    <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(r.id, r.name)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#999] hover:text-red-600 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!resellers?.data || resellers.data.length === 0) && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-[#999] text-xs">Belum ada reseller terdaftar</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW */}
                    <div className="block sm:hidden space-y-3">
                        {resellers?.data?.map((r, i) => (
                            <div key={r.id} className="bg-white rounded-2xl border border-[#e8e5e0] p-4 space-y-3 shadow-xs transition-all active:scale-[0.99]">
                                {/* Reseller Header */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                            style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-[#333] truncate leading-tight">{r.name}</div>
                                            <div className="text-[10px] text-[#999] truncate leading-none mt-0.5">{r.email}</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(r.id, r.name, r.is_active === 1 || r.is_active === true)}
                                        className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold transition-all ${r.is_active === 1 || r.is_active === true ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-red-50 text-red-500 border border-red-200/50'}`}
                                    >
                                        {r.is_active === 1 || r.is_active === true ? 'Aktif' : 'Nonaktif'}
                                    </button>
                                </div>

                                {/* Brand and Users details */}
                                <div className="flex items-center justify-between border-t border-[#f5f3f0] pt-2.5 text-[11px]">
                                    <div className="min-w-0 flex-1 pr-4">
                                        <span className="text-[#999] text-[8.5px] uppercase tracking-wider block font-bold leading-none mb-1">Brand & Domain</span>
                                        <span className="font-semibold text-gray-700 block truncate">{r.reseller_settings?.brand_name || '-'}</span>
                                        <span className="text-[9.5px] text-[#bbb] block truncate mt-0.5">
                                            {r.reseller_settings?.custom_domain 
                                                ? r.reseller_settings.custom_domain 
                                                : (r.reseller_settings?.subdomain 
                                                    ? `${r.reseller_settings.subdomain}.${centralHost}` 
                                                    : '-')}
                                        </span>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-[#999] text-[8.5px] uppercase tracking-wider block font-bold leading-none mb-1">Users</span>
                                        <span className="text-xs font-black text-gray-800 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md inline-block">
                                            {r.reseller_users_count || 0}
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Visitor stats bar */}
                                <div className="bg-[#faf9f7] border border-gray-100/70 rounded-xl p-2 flex items-center justify-between text-center gap-1">
                                    <div className="flex-1">
                                        <span className="text-[#999] text-[8px] uppercase font-bold tracking-wider block mb-0.5">Hari</span>
                                        <span className="text-[11px] font-extrabold text-blue-600 bg-blue-50/50 px-2.5 py-0.5 rounded-md inline-block min-w-[36px]">{r.visitor_stats?.today || 0}</span>
                                    </div>
                                    <div className="h-5 w-px bg-gray-200/50" />
                                    <div className="flex-1">
                                        <span className="text-[#999] text-[8px] uppercase font-bold tracking-wider block mb-0.5">Bulan</span>
                                        <span className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50/50 px-2.5 py-0.5 rounded-md inline-block min-w-[36px]">{r.visitor_stats?.month || 0}</span>
                                    </div>
                                    <div className="h-5 w-px bg-gray-200/50" />
                                    <div className="flex-1">
                                        <span className="text-[#999] text-[8px] uppercase font-bold tracking-wider block mb-0.5">Total</span>
                                        <span className="text-[11px] font-black text-[#E5654B] bg-orange-50 px-2.5 py-0.5 rounded-md inline-block min-w-[36px] shadow-3xs">{r.visitor_stats?.total || 0}</span>
                                    </div>
                                </div>

                                {/* Actions Footer */}
                                <div className="flex items-center justify-between border-t border-[#f5f3f0] pt-2.5">
                                    <Link href={`/super-admin/impersonate/reseller/${r.id}`} method="post" as="button"
                                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                        title="Masuk sebagai Reseller">
                                        <Icon d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" className="w-3.5 h-3.5" />
                                        <span>Login Reseller</span>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <Link href={`/super-admin/resellers/${r.id}`} className="flex items-center justify-center p-1.5 rounded-xl text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors" title="Detail">
                                            <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-3.5 h-3.5" />
                                        </Link>
                                        <Link href={`/super-admin/resellers/${r.id}/edit`} className="flex items-center justify-center p-1.5 rounded-xl text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors" title="Edit">
                                            <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-3.5 h-3.5" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(r.id, r.name)}
                                            className="flex items-center justify-center p-1.5 rounded-xl text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-50 border border-red-100/50 transition-colors"
                                            title="Hapus"
                                        >
                                            <Icon d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!resellers?.data || resellers.data.length === 0) && (
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-8 text-center text-[#999] text-xs">
                                Belum ada reseller terdaftar
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {resellers?.links && resellers.links.length > 3 && (
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] px-4 py-3 flex items-center justify-between shadow-3xs">
                            <span className="text-xs text-[#999]">
                                Showing {resellers.from}-{resellers.to} of {resellers.total}
                            </span>
                            <div className="flex items-center gap-1">
                                {resellers.links.map((link, i) => (
                                    <Link key={i} href={link.url || '#'}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${link.active ? 'bg-[#E5654B] text-white font-bold' : link.url ? 'text-[#999] hover:bg-[#f5f3f0]' : 'text-[#ddd] cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SuperAdminLayout>
    );
}
