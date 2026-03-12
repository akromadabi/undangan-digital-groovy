import { Head, Link, router } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { useState } from 'react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Index({ resellers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/super-admin/resellers', { search }, { preserveState: true });
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

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0ede8]">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase tracking-wider">Reseller</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase tracking-wider">Brand</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#999] uppercase tracking-wider">Users</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-[#999] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {resellers?.data?.map((r, i) => (
                                    <tr key={r.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                    style={{ background: `hsl(${(i * 47 + 260) % 360}, 65%, 55%)` }}>
                                                    {r.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-[#333]">{r.name}</div>
                                                    <div className="text-xs text-[#999]">{r.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[#555]">{r.reseller_settings?.brand_name || '-'}</div>
                                            <div className="text-xs text-[#bbb]">{r.reseller_settings?.subdomain ? `${r.reseller_settings.subdomain}.domain.com` : '-'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-[#333]">{r.reseller_users_count || 0}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${r.reseller_settings?.is_active !== false ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                                {r.reseller_settings?.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/super-admin/resellers/${r.id}`} className="p-2 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Detail">
                                                    <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/super-admin/resellers/${r.id}/edit`} className="p-2 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors" title="Edit">
                                                    <Icon d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!resellers?.data || resellers.data.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[#999]">Belum ada reseller terdaftar</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {resellers?.links && resellers.links.length > 3 && (
                        <div className="px-6 py-3 border-t border-[#f0ede8] flex items-center justify-between">
                            <span className="text-xs text-[#999]">
                                Showing {resellers.from}-{resellers.to} of {resellers.total}
                            </span>
                            <div className="flex items-center gap-1">
                                {resellers.links.map((link, i) => (
                                    <Link key={i} href={link.url || '#'}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${link.active ? 'bg-[#E5654B] text-white' : link.url ? 'text-[#999] hover:bg-[#f5f3f0]' : 'text-[#ddd] cursor-not-allowed'}`}
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
