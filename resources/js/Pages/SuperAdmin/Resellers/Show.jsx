import { Head, Link } from '@inertiajs/react';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

export default function Show({ reseller, users, stats, plans }) {
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
    const settings = reseller.reseller_settings;

    return (
        <SuperAdminLayout title="Detail Reseller">
            <Head title={`${reseller.name} — Reseller`} />
            <div className="space-y-6">
                {/* Back + Header */}
                <div className="flex items-center gap-3">
                    <Link href="/super-admin/resellers" className="p-2 rounded-lg hover:bg-[#f5f3f0] text-[#999] hover:text-[#555] transition-colors">
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-[#1a1a1a]">{reseller.name}</h2>
                        <p className="text-[#999] text-sm">{reseller.email}</p>
                    </div>
                    <Link href={`/super-admin/resellers/${reseller.id}/edit`}
                        className="px-4 py-2 bg-[#E5654B] text-white text-sm font-medium rounded-xl hover:bg-[#d55a42] transition-colors">
                        Edit
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Users', value: stats?.total_users || 0, gradient: 'from-blue-500 to-blue-600', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                        { label: 'Undangan Aktif', value: stats?.active_invitations || 0, gradient: 'from-emerald-500 to-emerald-600', icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
                        { label: 'Revenue', value: formatCurrency(stats?.total_revenue || 0), gradient: 'from-orange-500 to-orange-600', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
                    ].map(s => (
                        <div key={s.label} className="bg-white rounded-2xl border border-[#e8e5e0] p-5 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-[#999] uppercase tracking-wider">{s.label}</p>
                                    <p className="text-2xl font-bold text-[#1a1a1a] mt-2">{s.value}</p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                    <Icon d={s.icon} className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Brand Info */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                        <h3 className="font-bold text-[#1a1a1a] text-sm border-b border-[#f0ede8] pb-3">Info Branding</h3>
                        {[
                            ['Brand Name', settings?.brand_name || '-'],
                            ['Subdomain', settings?.subdomain ? `${settings.subdomain}.domain.com` : '-'],
                            ['Custom Domain', settings?.custom_domain || '-'],
                            ['Landing Page', settings?.landing_page_template || 'default'],
                            ['Status', settings?.is_active !== false ? '✅ Aktif' : '❌ Nonaktif'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between items-center">
                                <span className="text-sm text-[#999]">{label}</span>
                                <span className="text-sm text-[#333] font-medium">{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Plan Prices */}
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                        <h3 className="font-bold text-[#1a1a1a] text-sm border-b border-[#f0ede8] pb-3">Harga Plan</h3>
                        {(plans || []).map(plan => {
                            const resellerPrice = reseller.reseller_plan_prices?.find(p => p.plan_id === plan.id);
                            return (
                                <div key={plan.id} className="flex justify-between items-center">
                                    <span className="text-sm text-[#999]">{plan.name}</span>
                                    <div className="text-right">
                                        <div className="text-sm text-[#333] font-medium">
                                            {resellerPrice ? formatCurrency(resellerPrice.reseller_price) : <span className="text-[#bbb]">Belum diatur</span>}
                                        </div>
                                        <div className="text-xs text-[#bbb]">Base: {formatCurrency(plan.price)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#f0ede8]">
                        <h3 className="font-bold text-[#1a1a1a] text-sm">Users ({stats?.total_users || 0})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#f0ede8]">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#999] uppercase">Plan</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-[#999] uppercase">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f5f3f0]">
                                {users?.data?.map(u => (
                                    <tr key={u.id} className="hover:bg-[#faf9f6] transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="text-sm font-medium text-[#333]">{u.name}</div>
                                            <div className="text-xs text-[#999]">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs bg-[#f5f3f0] text-[#777] px-2 py-1 rounded-lg">{u.active_subscription?.plan?.name || 'Free'}</span>
                                        </td>
                                        <td className="px-6 py-3 text-right text-xs text-[#999]">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                                    </tr>
                                ))}
                                {(!users?.data || users.data.length === 0) && (
                                    <tr><td colSpan={3} className="px-6 py-8 text-center text-[#999]">Belum ada user</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SuperAdminLayout>
    );
}
