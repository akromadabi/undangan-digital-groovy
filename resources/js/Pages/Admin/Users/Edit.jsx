import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Key, Package, CalendarClock, User, FileText, Users as UsersIcon,
    Save, ArrowLeft, CheckCircle, XCircle, RotateCw
} from 'lucide-react';

export default function Edit({ user, plans }) {
    const invitation = user?.invitation;
    const subscription = user?.active_subscription;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        is_active: user.is_active ?? true,
        invitation: {
            slug: invitation?.slug || '',
            title: invitation?.title || '',
            is_active: invitation?.is_active ?? true,
            opening_title: invitation?.opening_title || '',
            opening_text: invitation?.opening_text || '',
            closing_title: invitation?.closing_title || '',
            closing_text: invitation?.closing_text || '',
            cover_title: invitation?.cover_title || '',
            cover_subtitle: invitation?.cover_subtitle || '',
        },
    });

    // Reset Password
    const [pw, setPw] = useState({ password: '', password_confirmation: '' });
    const [pwProcessing, setPwProcessing] = useState(false);
    const [pwMsg, setPwMsg] = useState('');

    const handleResetPassword = (e) => {
        e.preventDefault();
        setPwProcessing(true);
        router.post(route('admin.users.resetPassword', user.id), pw, {
            preserveScroll: true,
            onSuccess: () => { setPw({ password: '', password_confirmation: '' }); setPwMsg('✅ Password berhasil direset!'); },
            onError: (errs) => { setPwMsg('❌ ' + Object.values(errs).flat().join(', ')); },
            onFinish: () => setPwProcessing(false),
        });
    };

    // Change Plan
    const [selectedPlan, setSelectedPlan] = useState(subscription?.plan_id || plans[0]?.id || '');
    const [planProcessing, setPlanProcessing] = useState(false);
    const [planMsg, setPlanMsg] = useState('');

    const handleChangePlan = () => {
        setPlanProcessing(true);
        router.post(route('admin.users.changePlan', user.id), { plan_id: selectedPlan }, {
            preserveScroll: true,
            onSuccess: () => setPlanMsg('✅ Paket berhasil diubah!'),
            onError: (errs) => setPlanMsg('❌ ' + Object.values(errs).flat().join(', ')),
            onFinish: () => setPlanProcessing(false),
        });
    };

    // Extend Subscription
    const [expiresAt, setExpiresAt] = useState(subscription?.expires_at?.split('T')[0] || '');
    const [extProcessing, setExtProcessing] = useState(false);
    const [extMsg, setExtMsg] = useState('');

    const handleExtend = () => {
        setExtProcessing(true);
        router.post(route('admin.users.extendSubscription', user.id), { expires_at: expiresAt }, {
            preserveScroll: true,
            onSuccess: () => setExtMsg('✅ Masa aktif berhasil diperpanjang!'),
            onError: (errs) => setExtMsg('❌ ' + Object.values(errs).flat().join(', ')),
            onFinish: () => setExtProcessing(false),
        });
    };

    const quickExtend = (months) => {
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        setExpiresAt(d.toISOString().split('T')[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-[#333] text-sm placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors';
    const labelClass = 'block text-xs font-semibold text-[#999] mb-1.5 tracking-wide';
    const cardClass = 'bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5';

    return (
        <AdminLayout title={`Edit: ${user.name}`}>
            <Head title={`Edit - ${user.name}`} />
            <div className="max-w-3xl space-y-6">
                <Link href={`/admin/users/${user.id}`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium flex items-center gap-1">
                    <ArrowLeft size={14} /> Kembali ke Detail
                </Link>

                {/* ═══ Reset Password ═══ */}
                <div className={cardClass}>
                    <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><Key size={18} className="text-amber-500" /> Reset Password</h3>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Password Baru</label>
                                <input type="password" value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })}
                                    placeholder="Minimal 6 karakter" required minLength={6} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Konfirmasi Password</label>
                                <input type="password" value={pw.password_confirmation} onChange={e => setPw({ ...pw, password_confirmation: e.target.value })}
                                    placeholder="Ulangi password" required className={inputClass} />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={pwProcessing || !pw.password}
                                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                                {pwProcessing ? <><RotateCw size={14} className="animate-spin" /> Mereset...</> : <><Key size={14} /> Reset Password</>}
                            </button>
                            {pwMsg && <span className="text-sm font-medium">{pwMsg}</span>}
                        </div>
                    </form>
                </div>

                {/* ═══ Change Plan / Kelas ═══ */}
                <div className={cardClass}>
                    <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><Package size={18} className="text-blue-500" /> Ubah Paket / Kelas</h3>
                    <div className="flex items-center gap-2 text-sm text-[#999]">
                        <span>Paket saat ini:</span>
                        <span className="font-bold text-[#E5654B]">{subscription?.plan?.name || 'Belum ada'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {plans.map(p => (
                            <button key={p.id} type="button" onClick={() => setSelectedPlan(p.id)}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${selectedPlan == p.id
                                    ? 'border-[#E5654B] bg-[#E5654B]/5 shadow-sm'
                                    : 'border-[#e8e5e0] hover:border-[#E5654B]/30'}`}>
                                <div className="font-bold text-[#1a1a1a]">{p.name}</div>
                                <div className="text-xs text-[#999] mt-1">
                                    {p.price > 0 ? `Rp ${Number(p.price).toLocaleString('id-ID')}` : 'Gratis'}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={handleChangePlan} disabled={planProcessing}
                            className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                            {planProcessing ? <><RotateCw size={14} className="animate-spin" /> Mengubah...</> : <><Package size={14} /> Ubah Paket</>}
                        </button>
                        {planMsg && <span className="text-sm font-medium">{planMsg}</span>}
                    </div>
                </div>

                {/* ═══ Extend Subscription ═══ */}
                <div className={cardClass}>
                    <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><CalendarClock size={18} className="text-emerald-500" /> Perpanjang Masa Aktif</h3>
                    <div className="flex items-center gap-2 text-sm text-[#999]">
                        <span>Berakhir saat ini:</span>
                        <span className="font-bold text-[#333]">
                            {subscription?.expires_at ? new Date(subscription.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tidak terbatas'}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[1, 3, 6, 12].map(m => (
                            <button key={m} type="button" onClick={() => quickExtend(m)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-[#f5f3f0] text-[#555] hover:bg-[#E5654B] hover:text-white transition-all">
                                +{m} Bulan
                            </button>
                        ))}
                    </div>
                    <div>
                        <label className={labelClass}>Tanggal Berakhir Baru</label>
                        <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} className={inputClass + ' max-w-xs'} />
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={handleExtend} disabled={extProcessing || !expiresAt}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                            {extProcessing ? <><RotateCw size={14} className="animate-spin" /> Memperpanjang...</> : <><CalendarClock size={14} /> Perpanjang</>}
                        </button>
                        {extMsg && <span className="text-sm font-medium">{extMsg}</span>}
                    </div>
                </div>

                <hr className="border-[#e8e5e0]" />

                {/* ═══ User Info (existing) ═══ */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={cardClass}>
                        <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><User size={18} className="text-[#E5654B]" /> Info User</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nama</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputClass} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputClass} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputClass} />
                            </div>
                            <div className="flex items-center gap-3 pt-5">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-[#e8e5e0] rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                                </label>
                                <span className="text-sm text-[#555] font-medium">User Aktif</span>
                            </div>
                        </div>
                    </div>

                    {/* Invitation Settings */}
                    {invitation && (
                        <div className={cardClass}>
                            <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><FileText size={18} className="text-[#E5654B]" /> Detail Undangan</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Slug (URL)</label>
                                    <div className="flex items-center">
                                        <span className="bg-[#f8f7f4] border border-[#e8e5e0] border-r-0 rounded-l-xl px-3 py-2.5 text-[#999] text-sm">/u/</span>
                                        <input type="text" value={data.invitation.slug}
                                            onChange={e => setData('invitation', { ...data.invitation, slug: e.target.value })}
                                            className={`${inputClass} rounded-l-none`} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Judul Undangan</label>
                                    <input type="text" value={data.invitation.title}
                                        onChange={e => setData('invitation', { ...data.invitation, title: e.target.value })}
                                        className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Cover Title</label>
                                    <input type="text" value={data.invitation.cover_title}
                                        onChange={e => setData('invitation', { ...data.invitation, cover_title: e.target.value })}
                                        className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Cover Subtitle</label>
                                    <input type="text" value={data.invitation.cover_subtitle}
                                        onChange={e => setData('invitation', { ...data.invitation, cover_subtitle: e.target.value })}
                                        className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Opening Title</label>
                                <input type="text" value={data.invitation.opening_title}
                                    onChange={e => setData('invitation', { ...data.invitation, opening_title: e.target.value })}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Opening Text</label>
                                <textarea rows={3} value={data.invitation.opening_text}
                                    onChange={e => setData('invitation', { ...data.invitation, opening_text: e.target.value })}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Closing Title</label>
                                <input type="text" value={data.invitation.closing_title}
                                    onChange={e => setData('invitation', { ...data.invitation, closing_title: e.target.value })}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Closing Text</label>
                                <textarea rows={3} value={data.invitation.closing_text}
                                    onChange={e => setData('invitation', { ...data.invitation, closing_text: e.target.value })}
                                    className={inputClass} />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={data.invitation.is_active}
                                        onChange={e => setData('invitation', { ...data.invitation, is_active: e.target.checked })}
                                        className="sr-only peer" />
                                    <div className="w-11 h-6 bg-[#e8e5e0] rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
                                </label>
                                <span className="text-sm text-[#555] font-medium">Undangan Aktif</span>
                            </div>
                        </div>
                    )}

                    {/* Mempelai Preview (read-only) */}
                    {invitation?.bride_grooms?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-4 flex items-center gap-2"><UsersIcon size={18} className="text-[#E5654B]" /> Mempelai <span className="text-xs text-[#999] font-normal">(read-only)</span></h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {invitation.bride_grooms.map(bg => (
                                    <div key={bg.id} className="bg-[#f8f7f4] rounded-xl p-4 border border-[#e8e5e0]">
                                        <div className="text-3xl mb-2">{bg.gender === 'wanita' ? '👰' : '🤵'}</div>
                                        <div className="text-[#333] font-semibold">{bg.full_name}</div>
                                        <div className="text-[#999] text-sm">{bg.nickname}</div>
                                        {bg.father_name && <div className="text-[#bbb] text-xs mt-2">Ayah: {bg.father_name}</div>}
                                        {bg.mother_name && <div className="text-[#bbb] text-xs">Ibu: {bg.mother_name}</div>}
                                        {bg.instagram && <div className="text-[#E5654B] text-xs mt-1 font-medium">{bg.instagram}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Events Preview (read-only) */}
                    {invitation?.events?.length > 0 && (
                        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
                            <h3 className="font-bold text-[#1a1a1a] text-lg mb-4 flex items-center gap-2"><CalendarClock size={18} className="text-[#E5654B]" /> Acara <span className="text-xs text-[#999] font-normal">(read-only)</span></h3>
                            <div className="space-y-3">
                                {invitation.events.map(ev => (
                                    <div key={ev.id} className="bg-[#f8f7f4] rounded-xl p-4 border border-[#e8e5e0]">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[#333] font-semibold">{ev.event_name}</div>
                                            <span className="text-xs text-[#E5654B] bg-[#E5654B]/10 px-2 py-0.5 rounded-lg font-medium">{ev.event_type}</span>
                                        </div>
                                        <div className="text-[#999] text-sm mt-1">
                                            {ev.event_date ? new Date(ev.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'} • {ev.start_time ? ev.start_time.substring(0, 5) : '--:--'} - {ev.end_time === 'Selesai' ? 'Selesai' : (ev.end_time ? ev.end_time.substring(0, 5) : 'Selesai')} {ev.timezone}
                                        </div>
                                        <div className="text-[#bbb] text-xs mt-1">{ev.venue_name} — {ev.venue_address}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="px-6 py-3 bg-[#E5654B] hover:bg-[#c94f3a] disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-1.5">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <Link href={`/admin/users/${user.id}`}
                            className="px-6 py-3 bg-[#f0ede8] hover:bg-[#e8e5e0] text-[#555] rounded-xl font-semibold transition-colors">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
