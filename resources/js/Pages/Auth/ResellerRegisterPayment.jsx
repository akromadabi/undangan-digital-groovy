import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResellerRegisterPayment({ payment, annualFee }) {
    const [status, setStatus] = useState(payment.status);
    const [isChecking, setIsChecking] = useState(false);

    const metadata = payment.metadata || {};
    const qrUrl = metadata.qr_url || null;
    const qrString = metadata.qr_string || null;

    useEffect(() => {
        if (status === 'paid') return;

        const interval = setInterval(async () => {
            try {
                setIsChecking(true);
                const res = await axios.get(`/register/reseller/payment/${payment.id}/check`);
                if (res.data && res.data.is_paid) {
                    setStatus('paid');
                    window.location.href = '/register/reseller/success';
                }
            } catch (err) {
                console.error('Error checking payment status:', err);
            } finally {
                setIsChecking(false);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [payment.id, status]);

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Pembayaran Registrasi Reseller" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-[#E5654B] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#E5654B]/30">
                        G
                    </div>
                </div>
                <h2 className="text-center text-2xl font-black text-gray-900 tracking-tight">
                    Selesaikan Pembayaran Paket Reseller
                </h2>
                <p className="mt-1 text-center text-xs text-gray-500 max-w-xs mx-auto">
                    Scan QRIS di bawah ini untuk mengaktifkan akun reseller Anda selama 1 tahun.
                </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl space-y-6 text-center">
                    
                    {/* Ringkasan Biaya */}
                    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 text-center">
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Tagihan Registrasi</div>
                        <div className="text-3xl font-black text-[#E5654B] mt-1">{formatRupiah(annualFee)}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">ID Transaksi: #{payment.external_id || payment.id}</div>
                    </div>

                    {/* Scan QRIS Display */}
                    <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 space-y-4 flex flex-col items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5654B] text-white rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                            <span>Scan QRIS Resmi</span>
                        </div>

                        {qrUrl ? (
                            <img src={qrUrl} alt="QRIS Code" className="w-56 h-56 object-contain rounded-xl shadow-md border border-white bg-white p-2" />
                        ) : qrString ? (
                            <div className="w-56 h-56 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrString)}`} alt="QRIS Code" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-56 h-56 bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                                <div className="w-8 h-8 rounded-full border-2 border-[#E5654B] border-t-transparent animate-spin mb-2" />
                                <span className="text-xs text-gray-500 font-semibold">Memuat Kode QRIS...</span>
                            </div>
                        )}

                        <div className="text-[11px] text-gray-500 font-medium max-w-xs">
                            Mendukung semua aplikasi e-wallet (GoPay, OVO, ShopeePay, Dana, LinkAja) & M-Banking BCA, Mandiri, BRI, BNI.
                        </div>
                    </div>

                    {/* Status Polling Indicator */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2.5 px-4 rounded-xl border border-gray-100">
                        <span className={`w-2.5 h-2.5 rounded-full ${isChecking ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
                        <span>{isChecking ? 'Mengecek status pembayaran...' : 'Menunggu pembayaran terkonfirmasi'}</span>
                    </div>

                    <div className="pt-2 text-[11px] text-gray-400">
                        Setelah pembayaran terkonfirmasi, akun dan subdomain Anda akan langsung otomatis **AKTIF**.
                    </div>

                </div>
            </div>
        </div>
    );
}
