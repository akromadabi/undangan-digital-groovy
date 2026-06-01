import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import {
    Key, Package, CalendarClock, User, FileText, Users as UsersIcon,
    Save, ArrowLeft, CheckCircle, XCircle, RotateCw
} from 'lucide-react';

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

export default function Edit({ user, plans }) {
    const { auth, adminRoutePrefix } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        is_active: user.is_active ?? true,
        invitations: user.invitations?.map(inv => ({
            id: inv.id,
            slug: inv.slug || '',
            title: inv.title || '',
            is_active: inv.is_active ?? true,
            opening_title: inv.opening_title || '',
            opening_text: inv.opening_text || '',
            closing_title: inv.closing_title || '',
            closing_text: inv.closing_text || '',
            cover_title: inv.cover_title || '',
            cover_subtitle: inv.cover_subtitle || '',
            type: inv.type || 'wedding',
        })) || [],
    });

    const [selectedInvId, setSelectedInvId] = useState(user.invitations[0]?.id || null);
    const activeInv = user.invitations?.find(i => i.id === selectedInvId) || user.invitations?.[0];
    const invitation = activeInv;
    const subscription = activeInv?.active_subscription;

    // Reset Password
    const [pw, setPw] = useState({ password: '', password_confirmation: '' });
    const [pwProcessing, setPwProcessing] = useState(false);
    const [pwMsg, setPwMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleResetPassword = (e) => {
        e.preventDefault();
        setPwProcessing(true);
        router.post(`/super-admin/users/${user.id}/reset-password`, pw, {
            preserveScroll: true,
            onSuccess: () => { setPw({ password: '', password_confirmation: '' }); setPwMsg('Password berhasil direset!'); },
            onError: (errs) => { setPwMsg('' + Object.values(errs).flat().join(', ')); },
            onFinish: () => setPwProcessing(false),
        });
    };

    // Change Plan
    const [selectedPlan, setSelectedPlan] = useState('');
    const [planProcessing, setPlanProcessing] = useState(false);
    const [planMsg, setPlanMsg] = useState('');

    const handleChangePlan = () => {
        setPlanProcessing(true);
        router.post(`/super-admin/users/${user.id}/change-plan`, { 
            plan_id: selectedPlan,
            invitation_id: selectedInvId
        }, {
            preserveScroll: true,
            onSuccess: () => setPlanMsg('Paket berhasil diubah!'),
            onError: (errs) => setPlanMsg('' + Object.values(errs).flat().join(', ')),
            onFinish: () => setPlanProcessing(false),
        });
    };

    // Extend Subscription
    const [expiresAt, setExpiresAt] = useState('');
    const [extProcessing, setExtProcessing] = useState(false);
    const [extMsg, setExtMsg] = useState('');

    const handleExtend = () => {
        setExtProcessing(true);
        router.post(`/super-admin/users/${user.id}/extend-subscription`, { 
            expires_at: expiresAt,
            invitation_id: selectedInvId
        }, {
            preserveScroll: true,
            onSuccess: () => setExtMsg('Masa aktif berhasil diperpanjang!'),
            onError: (errs) => setExtMsg('' + Object.values(errs).flat().join(', ')),
            onFinish: () => setExtProcessing(false),
        });
    };

    // Effect to sync plan & expiration date when selected event changes
    useEffect(() => {
        const active = user.invitations?.find(i => i.id === selectedInvId) || user.invitations?.[0];
        const sub = active?.active_subscription;
        setSelectedPlan(sub?.plan_id || plans[0]?.id || '');
        setExpiresAt(sub?.expires_at?.split('T')[0] || '');
        setPlanMsg('');
        setExtMsg('');
    }, [selectedInvId, user.invitations]);

    const quickExtend = (months) => {
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        setExpiresAt(d.toISOString().split('T')[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`${adminRoutePrefix}/users/${user.id}`);
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-[#333] text-sm placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors';
    const labelClass = 'block text-xs font-semibold text-[#999] mb-1.5 tracking-wide';
    const cardClass = 'bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5';

    return (
        <DynamicAdminLayout title={`Edit: ${user.name}`}>
            <Head title={`Edit - ${user.name}`} />
            <div className="max-w-3xl space-y-6">
                <Link href={`${adminRoutePrefix}/users/${user.id}`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium flex items-center gap-1">
                    <ArrowLeft size={14} /> Kembali ke Detail
                </Link>

                {/* Event Selector Dropdown (only visible if there are multiple invitations) */}
                {data.invitations.length > 1 && (
                    <div className="bg-white rounded-2xl border border-[#e8e5e0] p-5 space-y-2.5 shadow-xs animate-in fade-in duration-200">
                        <label className="text-xs font-semibold text-[#999] uppercase tracking-wider block">Pilih Event / Undangan untuk Dikelola (Paket & Masa Aktif)</label>
                        <select
                            value={selectedInvId || ''}
                            onChange={(e) => setSelectedInvId(Number(e.target.value))}
                            className="w-full bg-[#fcfbfa] border border-[#e8e5e0] rounded-xl px-4 py-3 text-[#333] text-sm focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors font-semibold shadow-xs"
                        >
                            {data.invitations.map((inv) => (
                                <option key={inv.id} value={inv.id}>
                                    {inv.title || 'Tanpa Judul'} (/u/{inv.slug})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* ═══ Reset Password ═══ */}
                <div className={cardClass}>
                    <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><Key size={18} className="text-amber-500" /> Reset Password</h3>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Password Baru</label>
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={pw.password} onChange={e => setPw({ ...pw, password: e.target.value })}
                                        placeholder="Minimal 6 karakter" required minLength={6} className={`${inputClass} pr-10`} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Konfirmasi Password</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} value={pw.password_confirmation} onChange={e => setPw({ ...pw, password_confirmation: e.target.value })}
                                        placeholder="Ulangi password" required className={`${inputClass} pr-10`} />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
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
                    <div className="max-w-md">
                        <select
                            value={selectedPlan}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className={inputClass}
                        >
                            {plans.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — {p.price > 0 ? `Rp ${Number(p.price).toLocaleString('id-ID')}` : 'Gratis'}
                                </option>
                            ))}
                        </select>
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
                    <div className="max-w-xs">
                        <label className={labelClass}>Tambah Durasi (Cepat)</label>
                        <select 
                            onChange={(e) => {
                                if (e.target.value) {
                                    quickExtend(Number(e.target.value));
                                }
                            }}
                            className={inputClass}
                            defaultValue=""
                        >
                            <option value="">-- Pilih Durasi Tambahan --</option>
                            <option value="1">+1 Bulan</option>
                            <option value="3">+3 Bulan</option>
                            <option value="6">+6 Bulan</option>
                            <option value="12">+12 Bulan</option>
                        </select>
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

                {/* ═══ Kelola Kartu Ucapan ═══ */}
                {user.greeting_cards && user.greeting_cards.length > 0 && (
                    <div className={cardClass}>
                        <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2">
                            <FileText size={18} className="text-pink-500" /> Kelola Kartu Ucapan
                        </h3>
                        <p className="text-xs text-[#999] -mt-2">
                            Aktifkan atau nonaktifkan kartu ucapan milik user secara manual.
                        </p>
                        
                        <div className="space-y-3">
                            {user.greeting_cards.map((card) => (
                                <div key={card.id} className="flex items-center justify-between p-4 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl hover:shadow-sm transition-all">
                                    <div>
                                        <div className="font-bold text-gray-800 text-sm">{card.title || 'Tanpa Judul'}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                            <span>Template: <strong className="text-gray-700">{card.template}</strong></span>
                                            <span>•</span>
                                            <span>Tipe: <strong className="text-gray-700">{card.type}</strong></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-[#fcfbfa] border border-[#e8e5e0]/60 px-4 py-2 rounded-xl">
                                        <span className={`text-xs font-bold transition-colors ${card.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                                            {card.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                router.post(`/super-admin/greeting-cards/${card.id}/toggle-active`, {}, {
                                                    preserveScroll: true
                                                });
                                            }}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${card.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                            style={{ padding: '2px' }}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${card.is_active ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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


                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="px-6 py-3 bg-[#E5654B] hover:bg-[#c94f3a] disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-1.5">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                        <Link href={`${adminRoutePrefix}/users/${user.id}`}
                            className="px-6 py-3 bg-[#f0ede8] hover:bg-[#e8e5e0] text-[#555] rounded-xl font-semibold transition-colors">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
