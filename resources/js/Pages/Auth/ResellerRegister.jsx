import { Head, Link, useForm } from '@inertiajs/react';
import { Phone, Mail, Lock, User, Eye, EyeOff, Globe, Building2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResellerRegister({ centralHost = 'undangan.com' }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        brand_name: '',
        subdomain: '',
        password: '',
        password_confirmation: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    
    // Subdomain check states
    const [checkingSubdomain, setCheckingSubdomain] = useState(false);
    const [subdomainStatus, setSubdomainStatus] = useState(null);

    // Automatic real-time debounced subdomain check
    useEffect(() => {
        if (!data.subdomain) {
            setSubdomainStatus(null);
            return;
        }

        if (data.subdomain.length < 3) {
            setSubdomainStatus({ available: false, message: 'Subdomain minimal 3 karakter.' });
            return;
        }

        setCheckingSubdomain(true);
        setSubdomainStatus(null);

        const timer = setTimeout(async () => {
            try {
                const response = await axios.get(`/api/check-subdomain?subdomain=${data.subdomain}`);
                setSubdomainStatus(response.data);
            } catch (error) {
                setSubdomainStatus({ available: false, message: 'Gagal memeriksa ketersediaan subdomain.' });
            } finally {
                setCheckingSubdomain(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [data.subdomain]);

    const handleSubdomainChange = (e) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setData('subdomain', val);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register.reseller'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Daftar Partner Reseller" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF5EE] via-[#FFF0E8] to-[#FEE8D6] px-4 py-12 relative overflow-hidden">
                {/* Glowing light shapes in background */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5654B] opacity-[0.06] blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E5654B] opacity-[0.06] blur-[100px] pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E5654B] via-[#f97316] to-[#f59e0b] flex items-center justify-center shadow-lg shadow-[#E5654B]/35">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
                                </svg>
                            </div>
                            <span className="text-3xl font-black tracking-tight text-gray-900">
                                Groovy<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5654B] to-[#f97316]">.agency</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-black text-gray-900">Gabung Kemitraan Reseller</h1>
                        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                            Mulai bisnis undangan digital Anda sendiri hari ini. Lengkapi data di bawah untuk membuat akun agensi Anda.
                        </p>
                    </div>

                    {/* Form Card */}
                    <form onSubmit={submit} className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-orange-100/50 p-8 space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* SECTION: Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-[#E5654B] tracking-widest uppercase border-b border-orange-100/50 pb-2">Informasi Kontak</h3>
                                
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required autoFocus />
                                    </div>
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">No. WhatsApp</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                            placeholder="Contoh: 08123456789"
                                            className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required />
                                    </div>
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Alamat Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                            placeholder="nama@agensi.com"
                                            className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                            </div>

                            {/* SECTION: Agency Branding */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-[#E5654B] tracking-widest uppercase border-b border-orange-100/50 pb-2">Identitas Brand & Agensi</h3>

                                {/* Brand Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Nama Brand / Agensi</label>
                                    <div className="relative">
                                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type="text" value={data.brand_name} onChange={e => setData('brand_name', e.target.value)}
                                            placeholder="Contoh: Sakinah Wedding"
                                            className="w-full pl-10 pr-4 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required />
                                    </div>
                                    {errors.brand_name && <p className="text-xs text-red-500 mt-1">{errors.brand_name}</p>}
                                </div>

                                {/* Subdomain */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Subdomain Pilihan</label>
                                    <div className="flex items-center">
                                        <div className="relative flex-1">
                                            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                            <input type="text" value={data.subdomain} onChange={handleSubdomainChange}
                                                placeholder="brandanda"
                                                className="w-full pl-10 pr-3 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-l-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                                required />
                                        </div>
                                        <span className="px-3.5 py-3 bg-[#f5f3ee] border border-l-0 border-[#e8e5e0] rounded-r-xl text-xs font-extrabold text-gray-500 select-none">
                                            .{centralHost}
                                        </span>
                                    </div>
                                    {errors.subdomain && <p className="text-xs text-red-500 mt-1">{errors.subdomain}</p>}

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-400 font-semibold">Hanya huruf kecil, angka, & (-)</span>
                                        {checkingSubdomain && (
                                            <span className="text-[10px] text-[#E5654B] animate-pulse font-semibold">Memeriksa ketersediaan...</span>
                                        )}
                                    </div>

                                    {subdomainStatus && (
                                        <div className={`mt-2.5 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 ${
                                            subdomainStatus.available 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                                                : 'bg-red-50 text-red-700 border border-red-200/50'
                                        }`}>
                                            {subdomainStatus.available ? <Check size={14} /> : <X size={14} />}
                                            <span>{subdomainStatus.message}</span>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* SECTION: Security Password */}
                        <div className="space-y-4 pt-4 border-t border-orange-100/50">
                            <h3 className="text-xs font-black text-[#E5654B] tracking-widest uppercase pb-1">Keamanan Password</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Buat Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type={showPass ? 'text' : 'password'} value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Minimal 6 karakter"
                                            className="w-full pl-10 pr-11 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Konfirmasi Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#bbb]" />
                                        <input type={showConfirm ? 'text' : 'password'} value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            placeholder="Ulangi password baru"
                                            className="w-full pl-10 pr-11 py-3 bg-[#faf9f6] border border-[#e8e5e0] rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#E5654B]/30 focus:border-[#E5654B] outline-none transition-all"
                                            required />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 space-y-4">
                            <button type="submit" disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-[#E5654B] via-[#f97316] to-[#f59e0b] text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-[#E5654B]/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2">
                                {processing ? 'Memproses Pendaftaran...' : 'Daftar Sebagai Partner Reseller'}
                            </button>

                            <div className="text-center text-sm font-semibold">
                                <span className="text-gray-500">Sudah memiliki akun kemitraan? </span>
                                <Link href="/login" className="text-[#E5654B] hover:text-[#f97316] transition-colors">
                                    Masuk Sekarang
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
