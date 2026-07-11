import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

const eventIcons = {
    wedding: '',
    birthday: '',
    graduation: '',
    aqiqah: '',
    circumcision: '',
    anniversary: '',
};

const eventLabels = {
    wedding: 'Pernikahan',
    birthday: 'Ulang Tahun',
    graduation: 'Wisuda',
    aqiqah: 'Aqiqah',
    circumcision: 'Sunatan',
    anniversary: 'Anniversary',
};

export default function Show({ user, invitationsData = [], siteUrl }) {
    const { auth, adminRoutePrefix } = usePage().props;
    const [selectedInvId, setSelectedInvId] = useState(invitationsData[0]?.invitation?.id || null);
    const subscription = user?.active_subscription;
    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const isSuperAdmin = auth.user.role === 'super_admin';
    const activeData = invitationsData.find(item => item.invitation?.id === selectedInvId) || invitationsData[0];

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
        if (confirmDelete) {
            router.delete(`${adminRoutePrefix}/users/${user.id}`, {
                onError: (err) => {
                    console.error('Delete error:', err);
                    setConfirmDelete(false);
                }
            });
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    return (
        <DynamicAdminLayout title={`Detail: ${user.name}`}>
            <Head title={`Admin - ${user.name}`} />
            <div className="max-w-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <Link href={`${adminRoutePrefix}/users`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium">← Kembali ke Users</Link>
                    {(isSuperAdmin || auth.user.role === 'admin' || auth.user.role === 'reseller') && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${confirmDelete ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100'}`}
                            >
                                {confirmDelete ? 'Klik Lagi untuk Hapus' : 'Hapus User'}
                            </button>
                            <Link href={`${adminRoutePrefix}/users/${user.id}/edit`} className="px-4 py-2 bg-[#E5654B] hover:bg-[#c94f3a] text-white text-sm rounded-xl font-medium transition-colors shadow-sm">
                                Edit User & Undangan
                            </Link>
                        </div>
                    )}
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

                {/* Reseller Info (for Super Admin only) */}
                {isSuperAdmin && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-4">
                        <h3 className="font-bold text-[#1a1a1a] text-lg">Informasi Reseller</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <span className="text-xs text-[#999] block mb-0.5">Reseller</span>
                                <p className="text-[#333] text-sm font-semibold">{user.reseller?.name || 'Super Admin / Utama'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-[#999] block mb-0.5">Subdomain Brand</span>
                                <p className="text-[#333] text-sm font-semibold">{user.reseller?.reseller_settings?.brand_name || user.reseller?.reseller_settings?.subdomain || '-'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-[#999] block mb-0.5">Email Reseller</span>
                                <p className="text-[#333] text-sm font-semibold">{user.reseller?.email || '-'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invitations & Events */}
                {invitationsData.length > 0 ? (
                    <div className="space-y-6">
                        <h3 className="font-bold text-[#1a1a1a] text-lg px-1 flex items-center justify-between">
                            <span>Daftar Undangan / Event ({invitationsData.length})</span>
                        </h3>

                        {/* Event Selector Dropdown (only visible if there are multiple invitations) */}
                        {invitationsData.length > 1 && (
                            <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                                <label className="text-xs font-semibold text-[#999] uppercase tracking-wider block">Pilih Event / Undangan untuk Dilihat</label>
                                <select
                                    value={selectedInvId || ''}
                                    onChange={(e) => setSelectedInvId(Number(e.target.value))}
                                    className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-3 text-[#333] text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors font-semibold shadow-xs"
                                >
                                    {invitationsData.map(({ invitation }) => (
                                        <option key={invitation.id} value={invitation.id}>
                                            {invitation.title || 'Tanpa Judul'} (/u/{invitation.slug})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Display Active Selected Invitation Details */}
                        {activeData && (() => {
                            const { invitation, stats } = activeData;
                            const invitationUrl = invitation ? `${siteUrl}/u/${invitation.slug}` : null;
                            const typeLabels = {
                                wedding: 'Pernikahan',
                                graduation: 'Wisuda',
                                birthday: 'Ulang Tahun',
                                aqiqah: 'Aqiqah',
                                circumcision: 'Sunatan',
                                anniversary: 'Anniversary',
                            };
                            const typeLabel = typeLabels[invitation.type] || invitation.type || 'Syukuran';

                            return (
                                <div key={invitation.id} className="space-y-4 border border-[#e8e5e0] bg-[#faf9f6]/30 p-5 rounded-2xl animate-in fade-in duration-200">
                                    <div className="bg-white rounded-xl border border-[#e8e5e0] p-5 space-y-4 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs bg-orange-100 text-[#E5654B] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{typeLabel}</span>
                                                <h4 className="font-bold text-[#1a1a1a] text-base">{invitation.title || '-'}</h4>
                                            </div>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${invitation.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {invitation.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="text-xs text-[#999]">Slug</span><p className="text-[#E5654B] font-medium">/u/{invitation.slug}</p></div>
                                            <div><span className="text-xs text-[#999]">Tema Aktif</span><p className="text-[#333] font-medium">{invitation.theme?.name || 'Default'}</p></div>
                                        </div>

                                        {/* Invitation Link */}
                                        <div className="bg-[#f8f7f4] rounded-xl p-4 border border-[#e8e5e0]">
                                            <span className="text-xs text-[#999] block mb-2 font-medium">Link Undangan</span>
                                            <div className="flex items-center gap-2">
                                                <input readOnly value={invitationUrl}
                                                    className="flex-1 bg-white border border-[#e8e5e0] text-[#333] text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#E5654B] focus:border-[#E5654B]" />
                                                <button onClick={() => navigator.clipboard.writeText(invitationUrl)}
                                                    className="px-3 py-2 bg-[#E5654B] hover:bg-[#c94f3a] text-white text-xs rounded-lg transition-colors whitespace-nowrap font-medium shadow-xs">
                                                    Copy
                                                </button>
                                                <a href={invitationUrl} target="_blank" rel="noopener"
                                                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors whitespace-nowrap font-medium shadow-xs">
                                                    Buka
                                                </a>
                                            </div>
                                        </div>

                                        {/* Mempelai / Tokoh */}
                                        {invitation.bride_grooms?.length > 0 && (
                                            <div>
                                                <span className="text-xs text-[#999] block mb-2 font-medium">
                                                    {invitation.type === 'wedding' ? 'Mempelai' : 'Tokoh / Subjek'}
                                                </span>
                                                <div className="flex flex-wrap gap-3">
                                                    {invitation.bride_grooms.map(bg => (
                                                        <div key={bg.id} className="flex-1 min-w-[120px] bg-[#f8f7f4] rounded-xl p-3 text-center border border-[#e8e5e0]">
                                                            <div className="text-2xl mb-1">{bg.gender === 'wanita' ? '♀' : '♂'}</div>
                                                            <div className="text-[#333] text-xs font-semibold">{bg.full_name}</div>
                                                            <div className="text-[#999] text-[10px]">{bg.nickname}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    {stats && (
                                        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                                            {[
                                                { label: 'Total Tamu', value: stats.total_guests, color: 'from-blue-500 to-blue-600' },
                                                { label: 'RSVP Hadir', value: stats.rsvp_hadir, color: 'from-emerald-500 to-emerald-600' },
                                                { label: 'Ucapan', value: stats.total_wishes, color: 'from-pink-500 to-pink-600' },
                                                { label: 'WA Sent', value: stats.wa_sent, color: 'from-green-500 to-green-600' },
                                                { label: 'Galeri', value: stats.total_photos, color: 'from-violet-500 to-violet-600' },
                                                { label: 'Dibuka', value: stats.guests_opened, color: 'from-amber-500 to-amber-600' },
                                                { label: 'RSVP Tidak', value: stats.rsvp_tidak, color: 'from-red-500 to-red-600' },
                                            ].map(s => (
                                                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-3 text-white shadow-xs text-center`}>
                                                    <div className="text-base font-bold leading-none">{s.value}</div>
                                                    <div className="text-[9px] text-white/90 mt-1 leading-tight truncate" title={s.label}>{s.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-8 text-center text-gray-400 text-sm">
                        Belum ada undangan / event yang dibuat oleh user ini.
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
        </DynamicAdminLayout>
    );
}
