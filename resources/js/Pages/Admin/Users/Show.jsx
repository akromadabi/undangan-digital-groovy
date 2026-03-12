import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ user, stats, siteUrl }) {
    const subscription = user?.active_subscription;
    const invitation = user?.invitation;
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);
    const invitationUrl = invitation ? `${siteUrl}/u/${invitation.slug}` : null;

    return (
        <AdminLayout title={`Detail: ${user.name}`}>
            <Head title={`Admin - ${user.name}`} />
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/admin/users" className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium">← Kembali ke Users</Link>
                    <Link href={`/admin/users/${user.id}/edit`} className="px-4 py-2 bg-[#E5654B] hover:bg-[#c94f3a] text-white text-sm rounded-xl font-medium transition-colors shadow-sm">
                        Edit User & Undangan
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#E5654B] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-[#1a1a1a]">{user.name}</h2>
                            <p className="text-[#999] text-sm">{user.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {user.is_active ? 'AKTIF' : 'NONAKTIF'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#f0ede8]">
                        <div><span className="text-xs text-[#999]">Phone</span><p className="text-[#333] text-sm font-medium">{user.phone || '-'}</p></div>
                        <div><span className="text-xs text-[#999]">Bergabung</span><p className="text-[#333] text-sm font-medium">{new Date(user.created_at).toLocaleDateString('id-ID')}</p></div>
                        <div><span className="text-xs text-[#999]">Paket</span><p className="text-[#333] text-sm font-medium">{subscription?.plan?.name || 'Free'}</p></div>
                        <div><span className="text-xs text-[#999]">Onboarding</span><p className="text-[#333] text-sm font-medium">Step {user.onboarding_step || 1}/5</p></div>
                    </div>
                </div>

                {/* Invitation Info + Link */}
                {invitation && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[#1a1a1a] text-lg">Undangan</h3>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${invitation.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {invitation.is_active ? 'Aktif' : 'Nonaktif'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-xs text-[#999]">Judul</span><p className="text-[#333] font-medium">{invitation.title || '-'}</p></div>
                            <div><span className="text-xs text-[#999]">Slug</span><p className="text-[#E5654B] font-medium">/u/{invitation.slug}</p></div>
                        </div>

                        {/* Invitation Link */}
                        <div className="bg-[#f8f7f4] rounded-xl p-4 border border-[#e8e5e0]">
                            <span className="text-xs text-[#999] block mb-2 font-medium">Link Undangan</span>
                            <div className="flex items-center gap-2">
                                <input readOnly value={invitationUrl}
                                    className="flex-1 bg-white border border-[#e8e5e0] text-[#333] text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B]" />
                                <button onClick={() => navigator.clipboard.writeText(invitationUrl)}
                                    className="px-3 py-2 bg-[#E5654B] hover:bg-[#c94f3a] text-white text-xs rounded-lg transition-colors whitespace-nowrap font-medium">
                                    Copy
                                </button>
                                <a href={invitationUrl} target="_blank" rel="noopener"
                                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap font-medium">
                                    Buka
                                </a>
                            </div>
                        </div>

                        {/* Mempelai */}
                        {invitation.bride_grooms?.length > 0 && (
                            <div>
                                <span className="text-xs text-[#999] block mb-2 font-medium">Mempelai</span>
                                <div className="flex gap-3">
                                    {invitation.bride_grooms.map(bg => (
                                        <div key={bg.id} className="flex-1 bg-[#f8f7f4] rounded-xl p-4 text-center border border-[#e8e5e0]">
                                            <div className="text-3xl mb-2">{bg.gender === 'wanita' ? '♀' : '♂'}</div>
                                            <div className="text-[#333] text-sm font-semibold">{bg.full_name}</div>
                                            <div className="text-[#999] text-xs">{bg.nickname}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Tamu', value: stats.total_guests, color: 'from-blue-500 to-blue-600' },
                            { label: 'RSVP Hadir', value: stats.rsvp_hadir, color: 'from-emerald-500 to-emerald-600' },
                            { label: 'Ucapan', value: stats.total_wishes, color: 'from-pink-500 to-pink-600' },
                            { label: 'WA Terkirim', value: stats.wa_sent, color: 'from-green-500 to-green-600' },
                            { label: 'Foto Galeri', value: stats.total_photos, color: 'from-violet-500 to-violet-600' },
                            { label: 'Dibuka', value: stats.guests_opened, color: 'from-amber-500 to-amber-600' },
                            { label: 'RSVP Tidak', value: stats.rsvp_tidak, color: 'from-red-500 to-red-600' },
                        ].map(s => (
                            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-sm`}>
                                <div className="text-2xl font-bold">{s.value}</div>
                                <div className="text-xs text-white/80 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Payments */}
                {user.payments?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                        <h3 className="font-bold text-[#1a1a1a] text-lg mb-4">Riwayat Pembayaran</h3>
                        <div className="space-y-2">
                            {user.payments.map(p => (
                                <div key={p.id} className="flex items-center justify-between py-3 border-b border-[#f0ede8] last:border-0 text-sm">
                                    <div>
                                        <span className="text-[#333] font-medium">{formatCurrency(p.amount)}</span>
                                        <span className="text-[#999] ml-2 text-xs">{p.plan?.name || '-'}</span>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
