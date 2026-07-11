import { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { User, Save, ArrowLeft, Key } from 'lucide-react';

export default function Create() {
    const { auth, adminRoutePrefix } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        password: '',
        password_confirmation: '',
        is_active: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                            {auth.user.role === 'super_admin' && (
                                <div>
                                    <label className={labelClass}>Role / Hak Akses</label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className={inputClass}>
                                        <option value="user">User Klien biasa</option>
                                        <option value="editor">Editor (Staf)</option>
                                    </select>
                                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                                </div>
                            )}
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
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Minimal 6 karakter" required minLength={6} className={`${inputClass} pr-10`} />
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
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Konfirmasi Password</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Ulangi password" required className={`${inputClass} pr-10`} />
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
