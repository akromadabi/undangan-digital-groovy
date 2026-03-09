import { Head, Link, useForm } from '@inertiajs/react';
import { Phone, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f0] via-[#fef9f5] to-[#f5efe8] px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Logo / Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#E5654B] to-[#d4523a] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-[#E5654B]/20 mb-4">
                            <span className="text-white text-2xl font-bold">G</span>
                        </div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">Buat Akun Baru</h1>
                        <p className="text-sm text-[#999] mt-1">Buat undangan digital impian Anda</p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#e8e5e0] p-8 space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#333] mb-1.5">Nama Lengkap</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] transition-all"
                                    required autoFocus />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-[#333] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] transition-all"
                                    required />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-[#333] mb-1.5">No. WhatsApp</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] transition-all"
                                    required />
                            </div>
                            <p className="text-xs text-[#bbb] mt-1">Untuk verifikasi akun via WhatsApp</p>
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#333] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                <input type={showPass ? 'text' : 'password'} value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-10 pr-11 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] transition-all"
                                    required />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666]">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#333] mb-1.5">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                <input type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi password"
                                    className="w-full pl-10 pr-11 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] transition-all"
                                    required />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666]">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" onClick={submit} disabled={processing}
                            className="w-full py-3.5 bg-gradient-to-r from-[#E5654B] to-[#d4523a] text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#E5654B]/25 transition-all disabled:opacity-50">
                            {processing ? 'Mendaftar...' : 'Daftar Sekarang'}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-[#999]">Sudah punya akun? </span>
                            <Link href={route('login')} className="text-sm font-semibold text-[#E5654B] hover:text-[#c94f3a]">
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
