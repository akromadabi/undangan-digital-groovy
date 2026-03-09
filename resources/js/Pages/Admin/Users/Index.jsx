import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ users, filters }) {
    const userList = users?.data || [];
    const pagination = users?.links;

    return (
        <AdminLayout title="Manajemen User">
            <Head title="Admin - Users" />
            <div className="space-y-6">
                {/* Search */}
                <div className="flex items-center gap-3">
                    <input type="text" defaultValue={filters?.search || ''} placeholder="Cari nama / email..."
                        onKeyDown={(e) => e.key === 'Enter' && router.get('/admin/users', { search: e.target.value }, { preserveState: true })}
                        className="flex-1 bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm text-[#333] placeholder-[#bbb] focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B]" />
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#f8f7f4]">
                            <tr>
                                <th className="text-left px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">User</th>
                                <th className="text-left px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide hidden sm:table-cell">Email</th>
                                <th className="text-center px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Paket</th>
                                <th className="text-center px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Tanggal</th>
                                <th className="text-center px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0ede8]">
                            {userList.map(user => (
                                <tr key={user.id} className="hover:bg-[#faf9f6] transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#E5654B]/10 text-[#E5654B] flex items-center justify-center text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#333]">{user.name}</div>
                                                <div className="text-xs text-[#999] sm:hidden">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-[#777] hidden sm:table-cell">{user.email}</td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.active_subscription?.plan?.slug === 'platinum' ? 'bg-violet-50 text-violet-600' :
                                                user.active_subscription?.plan?.slug === 'gold' ? 'bg-amber-50 text-amber-600' :
                                                    user.active_subscription?.plan?.slug === 'silver' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-[#f0ede8] text-[#999]'
                                            }`}>
                                            {user.active_subscription?.plan?.name || 'Free'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center text-xs text-[#999]">
                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <Link href={`/admin/users/${user.id}`} className="text-[#E5654B] hover:text-[#c94f3a] text-xs font-semibold">Detail</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </AdminLayout>
    );
}
