import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { User, Save, ArrowLeft, Key } from 'lucide-react';

export default function Create() {
    const { adminRoutePrefix } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`${adminRoutePrefix}/users`);
    };

    const inputClass = 'w-full bg-white border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-[#333] text-sm placeholder-[#ccc] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B] transition-colors';
    const labelClass = 'block text-xs font-semibold text-[#999] mb-1.5 tracking-wide';
    const cardClass = 'bg-white rounded-2xl border border-[#e8e5e0] p-6 space-y-5';

    return (
        <DynamicAdminLayout title="Tambah User Baru">
            <Head title="Tambah User" />
            <div className="max-w-3xl space-y-6">
                <Link href={`${adminRoutePrefix}/users`} className="text-[#E5654B] hover:text-[#c94f3a] text-sm font-medium flex items-center gap-1">
                    <ArrowLeft size={14} /> Kembali ke Daftar
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={cardClass}>
                        <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><User size={18} className="text-[#E5654B]" /> Info User</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nama</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nama lengkap" required className={inputClass} />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@contoh.com" required className={inputClass} />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>No. Telepon / WhatsApp</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="Contoh: 62812345678" className={inputClass} />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Role / Hak Akses</label>
                                <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                    <option value="user">User Klien biasa</option>
                                    <option value="editor">Editor (Staf)</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
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

                    <div className={cardClass}>
                        <h3 className="font-bold text-[#1a1a1a] text-lg flex items-center gap-2"><Key size={18} className="text-amber-500" /> Kata Sandi</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Password</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Minimal 6 karakter" required minLength={6} className={inputClass} />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Konfirmasi Password</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Ulangi password" required className={inputClass} />
                                {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="px-6 py-3 bg-[#E5654B] hover:bg-[#c94f3a] disabled:opacity-50 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-1.5">
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Tambah User'}
                        </button>
                        <Link href={`${adminRoutePrefix}/users`}
                            className="px-6 py-3 bg-[#f0ede8] hover:bg-[#e8e5e0] text-[#555] rounded-xl font-semibold transition-colors">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </DynamicAdminLayout>
    );
}
