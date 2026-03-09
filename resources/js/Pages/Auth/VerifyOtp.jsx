import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    MessageCircle, ShieldCheck, RotateCw,
    CheckCircle, AlertCircle, Clock, LogOut
} from 'lucide-react';

export default function VerifyOtp({ phoneHint }) {
    const { flash } = usePage().props;
    const [countdown, setCountdown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);
    const inputRefs = useRef([]);

    const sendForm = useForm({});
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [verifying, setVerifying] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendOtp = () => {
        sendForm.post(route('verification.otp.send', { channel: 'wa' }), {
            preserveScroll: true,
            onSuccess: () => {
                setOtpSent(true);
                setCountdown(60);
                verifyForm.setData('otp', '');
                setTimeout(() => inputRefs.current[0]?.focus(), 200);
            },
        });
    };

    const handleResend = () => {
        if (countdown > 0) return;
        handleSendOtp();
    };

    const handleVerify = () => {
        if (verifying) return;
        const otp = otpDigits.join('');
        if (otp.length < 6) return;
        setVerifying(true);
        router.post(route('verification.otp.verify'), { otp }, {
            onFinish: () => setVerifying(false),
        });
    };

    // Handle individual digit inputs
    const handleDigitChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newDigits = [...otpDigits];
        newDigits[index] = value;
        setOtpDigits(newDigits);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newDigits = [...pasted.split(''), '', '', '', '', '', ''].slice(0, 6);
        setOtpDigits(newDigits);
        const nextIndex = Math.min(pasted.length, 5);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="Verifikasi Akun" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f0] via-[#fef9f5] to-[#f5efe8] px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                            <ShieldCheck size={28} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1a1a1a]">Verifikasi Akun</h1>
                        <p className="text-sm text-[#999] mt-1">
                            {otpSent ? 'Masukkan kode OTP yang dikirim ke WhatsApp Anda' : 'Verifikasi akun via WhatsApp'}
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#e8e5e0] p-8 space-y-5">
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <CheckCircle size={16} /> {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <AlertCircle size={16} /> {flash.error}
                            </div>
                        )}

                        {!otpSent ? (
                            /* ═══ Send OTP via WA ═══ */
                            <div className="space-y-4">
                                <button type="button" onClick={handleSendOtp} disabled={sendForm.processing}
                                    className="w-full flex items-center gap-4 p-5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-400 rounded-xl transition-all group disabled:opacity-50">
                                    <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <MessageCircle size={26} className="text-white" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-bold text-emerald-800">Kirim OTP via WhatsApp</div>
                                        <div className="text-sm text-emerald-600 mt-0.5">{phoneHint || 'Nomor WhatsApp terdaftar'}</div>
                                    </div>
                                </button>

                                {sendForm.processing && (
                                    <div className="text-center py-2">
                                        <RotateCw size={20} className="animate-spin text-emerald-500 mx-auto" />
                                        <p className="text-xs text-[#999] mt-2">Mengirim kode OTP...</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* ═══ OTP Input ═══ */
                            <div className="space-y-6">
                                {/* 6 Digit Input */}
                                <div className="flex justify-center gap-2.5">
                                    {[0, 1, 2, 3, 4, 5].map(i => (
                                        <input key={i}
                                            ref={el => inputRefs.current[i] = el}
                                            type="text" inputMode="numeric" maxLength={1}
                                            value={otpDigits[i]}
                                            onChange={e => handleDigitChange(i, e.target.value)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            onPaste={i === 0 ? handlePaste : undefined}
                                            className="w-12 h-14 text-center text-xl font-bold bg-[#faf9f6] border-2 border-[#e8e5e0] rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                                        />
                                    ))}
                                </div>

                                {/* Verify Button */}
                                <button type="button" onClick={handleVerify}
                                    disabled={verifying || otpDigits.join('').length < 6}
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {verifying ? <><RotateCw size={16} className="animate-spin" /> Memverifikasi...</> : <><ShieldCheck size={16} /> Verifikasi</>}
                                </button>

                                {/* Resend & Timer */}
                                <div className="text-center space-y-2">
                                    {countdown > 0 ? (
                                        <p className="text-sm text-[#999] flex items-center justify-center gap-1.5">
                                            <Clock size={14} /> Kirim ulang dalam <span className="font-bold text-emerald-600">{countdown}s</span>
                                        </p>
                                    ) : (
                                        <button type="button" onClick={handleResend} disabled={sendForm.processing}
                                            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50">
                                            Kirim Ulang OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="text-center mt-6">
                        <button type="button" onClick={handleLogout}
                            className="text-sm text-[#999] hover:text-[#666] flex items-center justify-center gap-1.5 mx-auto">
                            <LogOut size={14} /> Keluar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
