import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword, autoLoginUsers, reseller = null }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [loggingIn, setLoggingIn] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login', undefined, false), {
            onFinish: () => reset('password'),
        });
    };

    const autoLogin = (email) => {
        setLoggingIn(email);
        router.post(route('login', undefined, false), {
            email: email,
            password: 'password',
            remember: true,
        }, {
            onError: () => setLoggingIn(null),
        });
    };

    return (
        <GuestLayout reseller={reseller}>
            <Head title={reseller ? `Masuk — ${reseller.brand_name}` : 'Masuk - Groovy Invitation'} />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
                    {status}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                    {flash.error}
                </div>
            )}

            {!reseller && (
                <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">Selamat Datang</h3>
                    <p className="text-xs text-gray-400 mt-1">Silakan masuk untuk mengelola undangan Anda</p>
                </div>
            )}

            {/* Auto Login Buttons */}
            {autoLoginUsers && autoLoginUsers.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-3 text-center uppercase tracking-wider font-semibold">⚡ Quick Login (Testing)</p>
                    <div className="space-y-2">
                        {autoLoginUsers.map((user) => {
                            const isSuperAdmin = user.role === 'super_admin';
                            const isReseller = user.role === 'admin';
                            const roleLabel = isSuperAdmin ? 'SUPER ADMIN' : isReseller ? 'RESELLER' : (user.plan || 'FREE');
                            const borderClass = isSuperAdmin
                                ? 'border-amber-200 bg-amber-50 hover:border-amber-400'
                                : isReseller
                                    ? 'border-violet-200 bg-violet-50 hover:border-violet-400'
                                    : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400';
                            const avatarClass = isSuperAdmin ? 'bg-amber-500' : isReseller ? 'bg-violet-500' : 'bg-emerald-500';
                            const avatarLetter = isSuperAdmin ? 'S' : isReseller ? 'A' : 'U';
                            const badgeClass = isSuperAdmin
                                ? 'bg-amber-200 text-amber-700'
                                : isReseller
                                    ? 'bg-violet-200 text-violet-700'
                                    : user.plan
                                        ? 'bg-blue-200 text-blue-700'
                                        : 'bg-gray-200 text-gray-600';

                            return (
                            <button
                                key={user.email}
                                type="button"
                                onClick={() => autoLogin(user.email)}
                                disabled={!!loggingIn}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 ${borderClass}`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white ${avatarClass}`}>
                                    {avatarLetter}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                                        {roleLabel}
                                    </span>
                                </div>
                            </button>
                            );
                        })}
                    </div>
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">atau login manual</span></div>
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Email / Username / No. HP</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] focus:ring-opacity-50 transition-all bg-gray-50/50 focus:bg-white text-sm shadow-sm"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Password</label>
                    <div className="relative mt-1.5">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] focus:ring-opacity-50 transition-all bg-gray-50/50 focus:bg-white text-sm shadow-sm"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded text-[#E5654B] border-gray-300 focus:ring-[#E5654B] focus:ring-opacity-50"
                        />
                        <span className="ms-2 text-xs text-gray-500 font-medium">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-semibold text-gray-400 hover:text-[#E5654B] transition-colors"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-[#E5654B] to-[#d4523a] text-white font-bold text-sm shadow-lg shadow-[#E5654B]/20 hover:from-[#d4523a] hover:to-[#c2462f] focus:outline-none focus:ring-2 focus:ring-[#E5654B] focus:ring-offset-2 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Memproses...
                        </>
                    ) : (
                        'Masuk ke Akun'
                    )}
                </button>

                {reseller && (
                    <div className="text-center mt-4 pt-2">
                        <span className="text-xs text-gray-500">Belum punya akun? </span>
                        <Link
                            href={(() => {
                                const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                                const redirect = urlParams.get('redirect');
                                return route('register', {
                                    ref: reseller.subdomain,
                                    ...(redirect ? { redirect } : {})
                                });
                            })()}
                            className="text-xs font-semibold text-[#E5654B] hover:text-[#c24b33] transition-colors"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>
                )}
            </form>
        </GuestLayout>
    );
}
