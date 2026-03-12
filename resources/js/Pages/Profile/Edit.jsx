import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    // Profile form
    const profileForm = useForm({ name: user.name, email: user.email });

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Delete form
    const deleteForm = useForm({ password: '' });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
            onError: (errors) => {
                if (errors.password) {
                    passwordForm.reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    passwordForm.reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const submitDelete = (e) => {
        e.preventDefault();
        deleteForm.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
            onFinish: () => deleteForm.reset(),
        });
    };

    return (
        <DashboardLayout title="Profil">
            <Head title="Profil" />
            <div className="max-w-2xl mx-auto space-y-3">

                {/* Profile Header */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
                    <div className="absolute -bottom-6 -right-8 w-28 h-28 rounded-full bg-white/5" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h2 className="text-base font-bold">{user.name}</h2>
                            <p className="text-emerald-100 text-xs">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* ═══ Informasi Profil ═══ */}
                <form onSubmit={submitProfile} className="bg-white rounded-xl border border-gray-200 p-3 space-y-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <h3 className="text-sm font-bold text-gray-800">Informasi Profil</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Nama</label>
                            <input type="text" value={profileForm.data.name}
                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                                required />
                            {profileForm.errors.name && <p className="text-red-500 text-[10px] mt-0.5">{profileForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                            <input type="email" value={profileForm.data.email}
                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                                required />
                            {profileForm.errors.email && <p className="text-red-500 text-[10px] mt-0.5">{profileForm.errors.email}</p>}
                        </div>
                    </div>

                    {mustVerifyEmail && user.email_verified_at === null && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                            Email belum diverifikasi.
                            <Link href={route('verification.send')} method="post" as="button"
                                className="underline hover:text-amber-900 ml-1 font-medium">
                                Kirim ulang link verifikasi.
                            </Link>
                            {status === 'verification-link-sent' && (
                                <span className="block mt-1 text-emerald-600 font-medium">Link verifikasi baru telah dikirim.</span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <button type="submit" disabled={profileForm.processing}
                            className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50">
                            {profileForm.processing ? 'Menyimpan...' : 'Simpan Profil'}
                        </button>
                        {profileForm.recentlySuccessful && (
                            <span className="text-emerald-600 text-[11px] font-medium">✓ Tersimpan</span>
                        )}
                    </div>
                </form>

                {/* ═══ Ubah Password ═══ */}
                <form onSubmit={submitPassword} className="bg-white rounded-xl border border-gray-200 p-3 space-y-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <h3 className="text-sm font-bold text-gray-800">Ubah Password</h3>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Password Saat Ini</label>
                        <input type="password" ref={currentPasswordInput}
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                        {passwordForm.errors.current_password && <p className="text-red-500 text-[10px] mt-0.5">{passwordForm.errors.current_password}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Password Baru</label>
                            <input type="password" ref={passwordInput}
                                value={passwordForm.data.password}
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            {passwordForm.errors.password && <p className="text-red-500 text-[10px] mt-0.5">{passwordForm.errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Konfirmasi Password</label>
                            <input type="password"
                                value={passwordForm.data.password_confirmation}
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400" />
                            {passwordForm.errors.password_confirmation && <p className="text-red-500 text-[10px] mt-0.5">{passwordForm.errors.password_confirmation}</p>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button type="submit" disabled={passwordForm.processing}
                            className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50">
                            {passwordForm.processing ? 'Menyimpan...' : 'Ubah Password'}
                        </button>
                        {passwordForm.recentlySuccessful && (
                            <span className="text-emerald-600 text-[11px] font-medium">✓ Password diubah</span>
                        )}
                    </div>
                </form>

                {/* ═══ Hapus Akun ═══ */}
                <div className="bg-white rounded-xl border border-red-200 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <h3 className="text-sm font-bold text-red-700">Hapus Akun</h3>
                    </div>
                    <p className="text-[11px] text-gray-500">Setelah akun dihapus, semua data akan dihapus secara permanen.</p>

                    <button type="button" onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors">
                        Hapus Akun Saya
                    </button>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/40" onClick={() => setShowDeleteModal(false)} />
                        <form onSubmit={submitDelete} className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-4 space-y-3 z-10">
                            <h3 className="text-sm font-bold text-gray-800">Konfirmasi Hapus Akun</h3>
                            <p className="text-xs text-gray-500">Masukkan password untuk mengkonfirmasi penghapusan.</p>
                            <div>
                                <input type="password" value={deleteForm.data.password}
                                    onChange={(e) => deleteForm.setData('password', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-red-300 focus:border-red-400"
                                    placeholder="Masukkan password..." />
                                {deleteForm.errors.password && <p className="text-red-500 text-[10px] mt-0.5">{deleteForm.errors.password}</p>}
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <button type="button" onClick={() => setShowDeleteModal(false)}
                                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200">Batal</button>
                                <button type="submit" disabled={deleteForm.processing}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50">
                                    {deleteForm.processing ? 'Menghapus...' : 'Hapus Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
