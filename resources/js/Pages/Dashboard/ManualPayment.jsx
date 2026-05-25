import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const statusConfig = {
    pending_manual: { label: 'Menunggu Upload Bukti', color: 'text-amber-600 bg-amber-50 border-amber-200', step: 2 },
    waiting_review: { label: 'Menunggu Konfirmasi Admin', color: 'text-blue-600 bg-blue-50 border-blue-200', step: 3 },
    paid:           { label: 'Aktif', color: 'text-[#c24b33] bg-orange-50 border-orange-200', step: 4 },
    rejected:       { label: 'Ditolak', color: 'text-red-600 bg-red-50 border-red-200', step: 0 },
    cancelled:      { label: 'Dibatalkan', color: 'text-gray-500 bg-gray-50 border-gray-200', step: 0 },
};

export default function ManualPayment({ payment, bankAccounts = [], resellerContact = null }) {
    const { flash } = usePage().props;
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({ proof: null });

    const status = statusConfig[payment.status] || statusConfig.pending_manual;
    const formatCurrency = a => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const getResellerWaLink = () => {
        if (!resellerContact || !resellerContact.whatsapp) return null;
        let phone = resellerContact.whatsapp.replace(/\D/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.slice(1);
        }
        return `https://wa.me/${phone}?text=Halo%20${encodeURIComponent(resellerContact.brand_name)},%20saya%20sudah%20memilih%20paket%20${encodeURIComponent(payment.plan?.name)}%20dan%20ingin%20melakukan%20pembayaran.`;
    };

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setData('proof', file);
        const reader = new FileReader();
        reader.onload = e => setPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('payment.manual.proof', payment.id), { forceFormData: true, preserveScroll: true });
    };

    const handleCancel = () => {
        if (confirm('Batalkan pembayaran ini?')) {
            router.post(route('payment.manual.cancel', payment.id));
        }
    };

    const steps = [
        { num: 1, label: 'Pilih Paket' },
        { num: 2, label: 'Informasi Transfer' },
        { num: 3, label: 'Menunggu Konfirmasi' },
        { num: 4, label: 'Aktif' },
    ];

    const currentStep = status.step;

    return (
        <DashboardLayout title="Pembayaran Manual">
            <Head title="Pembayaran Transfer Bank" />
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-orange-50 border border-orange-200 text-[#b03a24] px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{flash.error}</div>
                )}

                {/* Stepper */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 -z-0" />
                        {steps.map((s, i) => {
                            const done = payment.status !== 'rejected' && currentStep > s.num;
                            const active = currentStep === s.num;
                            return (
                                <div key={s.num} className="flex flex-col items-center gap-1.5 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                        payment.status === 'rejected' && s.num <= 2 ? 'border-red-400 bg-red-50 text-red-600'
                                        : done ? 'border-[#E5654B] bg-[#E5654B] text-white'
                                        : active ? 'border-[#E5654B] bg-white text-[#c24b33]'
                                        : 'border-gray-200 bg-white text-gray-400'
                                    }`}>
                                        {done ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : s.num}
                                    </div>
                                    <span className={`text-[10px] font-medium text-center leading-tight max-w-[64px] ${active ? 'text-[#c24b33]' : 'text-gray-400'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`border rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2 ${status.color}`}>
                    <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    Status: {status.label}
                    {payment.status === 'rejected' && payment.admin_notes && (
                        <span className="ml-2 font-normal text-red-500">— {payment.admin_notes}</span>
                    )}
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                    <h3 className="font-bold text-gray-800">Rincian Pesanan</h3>
                    <div className="divide-y divide-gray-100">
                        <div className="flex justify-between py-2 text-sm">
                            <span className="text-gray-500">Paket</span>
                            <span className="font-semibold text-gray-800">{payment.plan?.name}</span>
                        </div>
                        <div className="flex justify-between py-2 text-sm">
                            <span className="text-gray-500">Durasi</span>
                            <span className="font-semibold text-gray-800">{payment.plan?.duration_days} hari</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600 font-semibold">Total Transfer</span>
                            <span className="font-black text-lg text-[#c24b33]">{formatCurrency(payment.amount)}</span>
                        </div>
                    </div>
                </div>

                {/* Bank Info */}
                {['pending_manual', 'waiting_review'].includes(payment.status) && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            </div>
                            <h3 className="font-bold text-blue-800">Informasi Rekening Transfer</h3>
                        </div>
                        {bankAccounts && bankAccounts.length > 0 ? (
                            <div className="space-y-3 mt-2">
                                <div className="bg-white rounded-xl px-4 py-3 flex justify-between items-center border border-blue-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e87058]"></div>
                                    <span className="text-sm text-gray-500 font-semibold">Jumlah Transfer</span>
                                    <span className="text-xl font-black text-[#c24b33]">{formatCurrency(payment.amount)}</span>
                                </div>

                                <div className="grid gap-3 pt-2">
                                    <p className="text-xs text-blue-600 font-medium px-1">Silakan transfer nominal di atas ke salah satu rekening berikut:</p>
                                    {bankAccounts.map((bank, idx) => (
                                        <div key={idx} className="bg-white/80 rounded-xl p-4 border border-blue-100 relative group hover:border-blue-300 transition-colors">
                                            <div className="flex justify-between w-full">
                                                <div>
                                                    <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 bg-blue-50 inline-block px-2 py-0.5 rounded-full">{bank.bank_name}</div>
                                                    <div className="text-xl font-bold text-gray-800 mb-0.5 tracking-tight">{bank.account_number}</div>
                                                    <div className="text-sm text-gray-500 font-medium">a/n {bank.account_name}</div>
                                                </div>
                                                <button onClick={() => navigator.clipboard.writeText(bank.account_number)}
                                                    className="self-center p-2.5 text-blue-400 border border-blue-100 hover:bg-blue-50 group-hover:border-blue-300 bg-white rounded-xl hover:text-blue-600 transition-all shadow-sm" title="Salin Nomor Rekening">
                                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 text-amber-700 text-sm p-4 rounded-xl border border-amber-200 mt-2 space-y-3">
                                <p className="font-semibold">Informasi rekening transfer belum dikonfigurasi oleh reseller.</p>
                                {resellerContact?.whatsapp ? (
                                    <div>
                                        <p className="text-xs text-amber-600 mb-2">Silakan hubungi kami via WhatsApp untuk meminta rekening transfer langsung:</p>
                                        <a
                                            href={getResellerWaLink()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                            Hubungi Reseller (WA)
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-xs">Hubungi reseller Anda untuk informasi lebih lanjut.</p>
                                )}
                            </div>
                        )}

                        <p className="text-xs text-blue-600 font-medium text-center bg-blue-100/50 p-2.5 rounded-xl border border-blue-100">⚠ Pastikan transfer TEPAT sesuai nominal di atas untuk mempercepat konfirmasi</p>
                    </div>
                )}

                {/* Upload Proof */}
                {payment.status === 'pending_manual' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
                        <h3 className="font-bold text-gray-800">Upload Bukti Transfer</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Drag and Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileRef.current?.click()}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                                    dragOver ? 'border-[#e87058] bg-orange-50' : preview ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/20'
                                }`}>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                                    onChange={(e) => handleFile(e.target.files[0])} />
                                {preview ? (
                                    <div className="space-y-2">
                                        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                                        <p className="text-xs text-[#c24b33] font-medium">Klik untuk ganti foto</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <p className="text-sm text-gray-500">Drag & drop atau <span className="text-[#c24b33] font-semibold">klik di sini</span></p>
                                        <p className="text-xs text-gray-400">JPG, PNG, WEBP — Maks. 5MB</p>
                                    </div>
                                )}
                            </div>
                            {errors.proof && <p className="text-red-500 text-xs">{errors.proof}</p>}

                            <button type="submit" disabled={!data.proof || processing}
                                className="w-full py-3 bg-[#E5654B] text-white rounded-xl font-semibold hover:bg-[#c24b33] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                {processing ? 'Mengirim...' : 'Kirim Bukti Transfer'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Waiting state */}
                {payment.status === 'waiting_review' && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto">
                            <svg className="w-7 h-7 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Bukti transfer sudah dikirim</p>
                            <p className="text-sm text-gray-500 mt-1">Admin akan memverifikasi dalam 1×24 jam kerja</p>
                        </div>
                        {payment.proof_image && (
                            <div className="mt-3">
                                <p className="text-xs text-gray-400 mb-2">Bukti yang dikirim:</p>
                                <img src={`/storage/${payment.proof_image}`} alt="Bukti" className="max-h-40 mx-auto rounded-xl object-contain border border-gray-200" />
                            </div>
                        )}
                    </div>
                )}

                {/* Reseller Support Contact */}
                {resellerContact && (resellerContact.whatsapp || resellerContact.phone || resellerContact.email) && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                        <h3 className="font-bold text-gray-800 text-sm">Butuh Bantuan?</h3>
                        <p className="text-xs text-gray-500">Hubungi kami melalui kontak di bawah ini jika Anda memerlukan bantuan atau ingin melakukan konfirmasi langsung.</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {resellerContact.whatsapp && (
                                <a
                                    href={getResellerWaLink()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E5654B] hover:bg-[#c24b33] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                                >
                                    <svg className="w-4.5 h-4.5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                    Hubungi Reseller (WA)
                                </a>
                            )}
                            {resellerContact.email && (
                                <a
                                    href={`mailto:${resellerContact.email}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    Kirim Email
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Cancel button */}
                {['pending_manual', 'waiting_review'].includes(payment.status) && (
                    <button onClick={handleCancel}
                        className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                        Batalkan Pembayaran
                    </button>
                )}
            </div>
        </DashboardLayout>
    );
}
