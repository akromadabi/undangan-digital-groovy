import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, autoLoginUsers }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [loggingIn, setLoggingIn] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const autoLogin = (email) => {
        setLoggingIn(email);
        router.post(route('login'), {
            email: email,
            password: 'password',
            remember: true,
        }, {
            onError: () => setLoggingIn(null),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            {/* Auto Login Buttons */}
            {autoLoginUsers && autoLoginUsers.length > 0 && (
                <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-3 text-center uppercase tracking-wider font-semibold">⚡ Quick Login (Testing)</p>
                    <div className="space-y-2">
                        {autoLoginUsers.map((user) => (
                            <button
                                key={user.email}
                                type="button"
                                onClick={() => autoLogin(user.email)}
                                disabled={!!loggingIn}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 ${user.role === 'admin'
                                    ? 'border-violet-200 bg-violet-50 hover:border-violet-400'
                                    : 'border-emerald-200 bg-emerald-50 hover:border-emerald-400'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white ${user.role === 'admin' ? 'bg-violet-500' : 'bg-emerald-500'
                                    }`}>
                                    {user.role === 'admin' ? '👑' : '👤'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
                                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                                </div>
                                <div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.role === 'admin'
                                        ? 'bg-violet-200 text-violet-700'
                                        : user.plan
                                            ? 'bg-amber-200 text-amber-700'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {user.role === 'admin' ? 'ADMIN' : user.plan || 'FREE'}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">atau login manual</span></div>
                    </div>
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
