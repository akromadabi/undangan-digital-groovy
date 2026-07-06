import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { 
    QrCode, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft, Copy, Check 
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function SiappPayPayment({ payment, qrUrl, qrString, totalAmount }) {
    const [status, setStatus] = useState(payment.status);
    const [isChecking, setIsChecking] = useState(false);
    const [copied, setCopied] = useState(false);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(val || 0);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (status === 'paid') return;

        const interval = setInterval(async () => {
            try {
                setIsChecking(true);
                const res = await axios.get(`/payment/siapppay/${payment.id}/check`);
                if (res.data && res.data.is_paid) {
                    setStatus('paid');
                    // Small delay to allow the checkmark success animation to play
                    setTimeout(() => {
                        window.location.href = '/dashboard?payment=success';
                    }, 1500);
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
            } finally {
                setIsChecking(false);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [payment.id, status]);

    return (
        <DashboardLayout title="Pembayaran QRIS">
            <Head title="Pembayaran QRIS - Siapp Pay" />
            <div className="max-w-md mx-auto space-y-6 py-6">

                {/* Back to history link */}
                <Link 
                    href={route('payment.history')} 
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E5654B] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Riwayat</span>
                </Link>

                {status === 'paid' ? (
                    /* SUCCESS STATE */
                    <div className="bg-white rounded-3xl border border-emerald-100 p-8 text-center shadow-xl shadow-emerald-50/40 space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                            <CheckCircle2 className="w-10 h-10 animate-bounce" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Pembayaran Berhasil!</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            Terima kasih, pembayaran Anda telah kami terima. Undangan Anda sedang aktif secara otomatis.
                        </p>
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                Mengalihkan ke Dashboard...
                            </div>
                        </div>
                    </div>
                ) : (
                    /* UNPAID STATE */
                    <div className="bg-white rounded-3xl border border-gray-150 p-6 shadow-xl shadow-gray-100/50 space-y-6">
                        
                        {/* Title & Brand */}
                        <div className="text-center space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-[#E5654B] rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                                <QrCode className="w-3.5 h-3.5" />
                                <span>QRIS Dinamis Otomatis</span>
                            </div>
                            <h2 className="text-xl font-black text-gray-900 mt-2">Scan QRIS Untuk Bayar</h2>
                            <p className="text-xs text-gray-400">Silakan scan kode QR di bawah ini menggunakan aplikasi pembayaran favorit Anda.</p>
                        </div>

                        {/* Amount Box */}
                        <div className="bg-orange-50/40 border border-orange-100/55 rounded-2xl p-4 text-center relative overflow-hidden">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Nominal</div>
                            <div className="text-3xl font-black text-[#E5654B] mt-1 tracking-tight flex items-center justify-center gap-1.5">
                                {formatCurrency(totalAmount)}
                                <button 
                                    onClick={() => copyToClipboard(totalAmount)}
                                    className="p-1.5 hover:bg-orange-100 rounded-lg text-gray-400 hover:text-[#E5654B] transition-colors"
                                    title="Salin nominal"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span>ID: {payment.external_id || payment.id}</span>
                            </div>
                        </div>

                        {/* QR Code Container */}
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl relative">
                            {qrUrl ? (
                                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100/50">
                                    <img 
                                        src={qrUrl} 
                                        alt="QRIS Code" 
                                        className="w-56 h-56 object-contain"
                                    />
                                </div>
                            ) : qrString ? (
                                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100/50">
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrString)}`} 
                                        alt="QRIS Code" 
                                        className="w-56 h-56 object-contain" 
                                    />
                                </div>
                            ) : (
                                <div className="w-56 h-56 bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#E5654B] border-t-transparent animate-spin mb-2" />
                                    <span className="text-xs text-gray-500 font-semibold">Memuat Kode QRIS...</span>
                                </div>
                            )}

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 bg-white py-2 px-4 rounded-full border border-gray-100 shadow-sm">
                                <span className={`w-2.5 h-2.5 rounded-full ${isChecking ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
                                <span>{isChecking ? 'Mengecek pembayaran...' : 'Menunggu pembayaran terdeteksi'}</span>
                            </div>
                        </div>

                        {/* Instruction Accordion / Steps */}
                        <div className="space-y-3 text-xs text-gray-600 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl">
                            <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Cara Pembayaran:
                            </h4>
                            <ol className="list-decimal list-inside space-y-1.5 pl-0.5 leading-relaxed text-gray-500">
                                <li>Buka aplikasi e-wallet (GoPay, OVO, Dana, LinkAja, ShopeePay) atau Mobile Banking Anda.</li>
                                <li>Pilih opsi **Scan / QRIS / Bayar**.</li>
                                <li>Scan kode QR diatas atau unggah tangkapan layar (screenshot) kode QR ini.</li>
                                <li>Periksa nominal pembayaran dan pastikan sama persis.</li>
                                <li>Konfirmasi transaksi dan masukkan PIN Anda.</li>
                                <li>Halaman ini akan otomatis dialihkan setelah pembayaran Anda berhasil terverifikasi.</li>
                            </ol>
                        </div>

                        <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                            <span>Didukung penuh oleh</span>
                            <span className="font-extrabold text-gray-600">Siapp Pay</span>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
