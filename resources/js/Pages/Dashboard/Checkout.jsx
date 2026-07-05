import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { useState } from 'react';
import {
    Ticket, ArrowLeft, CheckCircle, AlertCircle, Copy, CreditCard, Landmark, QrCode, Sparkles, Check, ChevronRight
} from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function Checkout({
    plan,
    price,
    originalPrice,
    hasResellerPrice,
    paymentGatewayType,
    tripayChannels = [],
    bankAccounts = [],
    invitation,
    greetingCard,
    resellerSetting
}) {
    const { flash, isLocal } = usePage().props;
    const [couponCode, setCouponCode] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(price);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplying(true);
        setCouponError('');
        setCouponSuccess('');

        try {
            const response = await fetch('/checkout/validate-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({
                    code: couponCode,
                    plan_id: plan.id,
                    greeting_card_id: greetingCard ? greetingCard.id : null,
                }),
            });

            const result = await response.json();

            if (result.valid) {
                setAppliedCoupon(result);
                setDiscountAmount(Number(result.discount_amount));
                setFinalPrice(Number(result.final_amount));
                setCouponSuccess(result.message || 'Kupon berhasil diterapkan!');
            } else {
                setAppliedCoupon(null);
                setDiscountAmount(0);
                setFinalPrice(price);
                setCouponError(result.message || 'Kode kupon tidak valid.');
            }
        } catch (e) {
            console.error('Failed to validate coupon:', e);
            setCouponError('Gagal memverifikasi kupon. Silakan coba lagi.');
        } finally {
            setIsApplying(false);
        }
    };

    // Remove Coupon
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setFinalPrice(price);
        setCouponCode('');
        setCouponSuccess('');
        setCouponError('');
    };

    // Copy to clipboard helper
    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Proceed to Payment
    const handleCheckout = () => {
        // If online payment via TriPay is required, make sure channel is selected
        if (
            paymentGatewayType === 'reseller_gateway' &&
            tripayChannels &&
            tripayChannels.length > 0 &&
            !selectedChannel &&
            finalPrice > 0
        ) {
            alert('Silakan pilih metode pembayaran terlebih dahulu.');
            return;
        }

        setIsSubmitting(true);

        const data = {
            plan_id: plan.id,
            greeting_card_id: greetingCard ? greetingCard.id : null,
            invitation_id: invitation ? invitation.id : null,
            coupon_code: appliedCoupon ? appliedCoupon.code : null,
            payment_method_code: selectedChannel || null,
        };

        router.post('/checkout', data, {
            onFinish: () => setIsSubmitting(false),
            onError: (err) => {
                alert(Object.values(err).join('\n'));
            }
        });
    };

    const handleDebugApproveDirectly = () => {
        if (confirm('Apakah Anda yakin ingin mengaktifkan paket ini secara instan via Debug Sandbox?')) {
            setIsSubmitting(true);
            router.post(route('payment.debug-approve-direct'), {
                plan_id: plan.id,
                greeting_card_id: greetingCard ? greetingCard.id : null,
                invitation_id: invitation ? invitation.id : null,
            }, {
                onFinish: () => setIsSubmitting(false)
            });
        }
    };

    // Group TriPay Channels
    const groupChannels = () => {
        const groups = {
            'QRIS': tripayChannels.filter(c => c.code.includes('QRIS')),
            'Virtual Account': tripayChannels.filter(c => ['Virtual Account', 'VA'].includes(c.group)),
            'E-Wallet': tripayChannels.filter(c => c.group === 'E-Wallet'),
            'Retail': tripayChannels.filter(c => ['Retail Outlet', 'Retail'].includes(c.group)),
        };

        // Fallback for unclassified channels
        const classifiedCodes = [
            ...groups['QRIS'].map(c => c.code),
            ...groups['Virtual Account'].map(c => c.code),
            ...groups['E-Wallet'].map(c => c.code),
            ...groups['Retail'].map(c => c.code)
        ];
        
        const other = tripayChannels.filter(c => !classifiedCodes.includes(c.code));
        if (other.length > 0) {
            groups['Lainnya'] = other;
        }

        return groups;
    };

    const tripayGroups = groupChannels();

    return (
        <DashboardLayout title="Checkout Pembayaran">
            <Head title="Checkout Pembayaran" />
            <div className="max-w-4xl mx-auto px-2 sm:px-6 py-6 space-y-6">
                
                {/* Back Link */}
                <div>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-[#E5654B] transition-colors"
                    >
                        <ArrowLeft size={16} /> Kembali ke Paket
                    </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Details & Payment Methods */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Package Details */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e8e5e0] shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-gray-800 border-b border-[#f0ede8] pb-3 flex items-center gap-2">
                                <Sparkles size={18} className="text-[#E5654B]" /> Detail Pemesanan
                            </h3>

                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                        Paket {plan.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                        Kategori: {plan.type === 'greeting_card' ? 'Kartu Ucapan' : 'Undangan Pernikahan'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Masa aktif: {plan.duration_days > 0 ? `${plan.duration_days} hari` : 'Selamanya'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(price)}
                                    </span>
                                </div>
                            </div>

                            {invitation && (
                                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-xs text-orange-800 leading-relaxed">
                                    <strong>Undangan Terhubung:</strong> {invitation.title} ({invitation.slug})
                                </div>
                            )}

                            {greetingCard && (
                                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-xs text-orange-800 leading-relaxed">
                                    <strong>Kartu Ucapan Terhubung:</strong> {greetingCard.title}
                                </div>
                            )}
                        </div>

                        {/* Payment Methods Selection */}
                        {finalPrice > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-[#e8e5e0] shadow-sm space-y-4">
                                <h3 className="text-base font-bold text-gray-800 border-b border-[#f0ede8] pb-3 flex items-center gap-2">
                                    <CreditCard size={18} className="text-[#E5654B]" /> Metode Pembayaran
                                </h3>

                                {/* Manual Bank Transfer */}
                                {paymentGatewayType === 'manual' && (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
                                            <Landmark size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <strong>Pembayaran Manual Transfer Bank:</strong> Silakan lakukan transfer ke salah satu rekening di bawah ini. Anda wajib mengunggah bukti transfer setelah checkout agar dapat diaktifkan oleh admin.
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {bankAccounts.map((bank, index) => (
                                                <div key={index} className="border border-[#e8e5e0] rounded-xl p-4 flex items-center justify-between hover:bg-gray-50/30 transition-all">
                                                    <div className="space-y-1">
                                                        <span className="text-xs font-bold text-[#E5654B] uppercase tracking-wide">
                                                            {bank.bank_name}
                                                        </span>
                                                        <div className="text-sm font-mono font-bold text-gray-800">
                                                            {bank.account_number}
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            a.n {bank.account_name}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(bank.account_number, index)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#f5f3f0] hover:bg-[#E5654B]/10 hover:text-[#E5654B] text-gray-600 rounded-lg transition-colors border border-gray-200/50"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <>
                                                                <Check size={12} className="text-green-600" />
                                                                <span className="text-green-600">Disalin</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy size={12} />
                                                                <span>Salin</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Online gateway (siapppay / xendit / midtrans) */}
                                {paymentGatewayType !== 'manual' && tripayChannels.length === 0 && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-800 flex items-start gap-2.5">
                                        <QrCode size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Gerbang Pembayaran Otomatis Aktif:</strong> Anda akan diarahkan ke halaman invoice instan setelah mengklik tombol bayar. Mendukung QRIS, e-wallet, virtual account, retail outlet, dan langsung aktif 24 jam otomatis setelah pembayaran sukses.
                                        </div>
                                    </div>
                                )}

                                {/* TriPay Channel Selection */}
                                {paymentGatewayType === 'reseller_gateway' && tripayChannels.length > 0 && (
                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-500">
                                            Pilih metode pembayaran online yang Anda inginkan di bawah ini:
                                        </p>

                                        {Object.entries(tripayGroups).map(([groupName, channels]) => {
                                            if (channels.length === 0) return null;
                                            return (
                                                <div key={groupName} className="space-y-2">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        {groupName}
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {channels.map((chan) => (
                                                            <button
                                                                key={chan.code}
                                                                type="button"
                                                                onClick={() => setSelectedChannel(chan.code)}
                                                                className={`p-3 text-left border rounded-xl flex items-center justify-between gap-3 transition-all hover:bg-gray-50/50 ${
                                                                    selectedChannel === chan.code
                                                                        ? 'border-[#E5654B] bg-[#E5654B]/5 ring-1 ring-[#E5654B]/20'
                                                                        : 'border-[#e8e5e0] bg-white'
                                                                }`}
                                                            >
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-[11px] font-bold text-gray-800 truncate">
                                                                        {chan.name}
                                                                    </div>
                                                                    {chan.fee_customer > 0 && (
                                                                        <div className="text-[9px] text-gray-400">
                                                                            Biaya: +{formatCurrency(chan.fee_customer)}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {chan.icon_url && (
                                                                    <img src={chan.icon_url} alt={chan.name} className="h-4 object-contain flex-shrink-0" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Coupon & Cost Summary */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Coupon Section */}
                        {resellerSetting && (
                            <div className="bg-white rounded-2xl p-6 border border-[#e8e5e0] shadow-sm space-y-4">
                                <h3 className="text-base font-bold text-gray-800 border-b border-[#f0ede8] pb-3 flex items-center gap-2">
                                    <Ticket size={18} className="text-[#E5654B]" /> Kupon Diskon
                                </h3>

                                {appliedCoupon ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <span className="font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-200/80 px-2 py-0.5 rounded text-xs tracking-wider uppercase">
                                                {appliedCoupon.code}
                                            </span>
                                            <p className="text-[11px] text-emerald-700 font-medium mt-1.5">
                                                Diskon berhasil digunakan! (Potongan {formatCurrency(discountAmount)})
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="KODE KUPON"
                                                value={couponCode}
                                                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 px-4 py-2 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B] uppercase font-mono font-bold"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={isApplying || !couponCode.trim()}
                                                className="px-4 py-2 bg-[#E5654B] hover:bg-[#d0533b] text-white rounded-xl text-sm font-semibold disabled:opacity-50 transition-all flex-shrink-0"
                                            >
                                                {isApplying ? 'Mengecek...' : 'Terapkan'}
                                            </button>
                                        </div>
                                        
                                        {couponSuccess && (
                                            <div className="text-emerald-600 text-xs flex items-center gap-1.5 font-medium leading-relaxed">
                                                <CheckCircle size={14} /> {couponSuccess}
                                            </div>
                                        )}

                                        {couponError && (
                                            <div className="text-red-600 text-xs flex items-center gap-1.5 font-medium leading-relaxed">
                                                <AlertCircle size={14} /> {couponError}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cost Summary & Submit */}
                        <div className="bg-white rounded-2xl p-6 border border-[#e8e5e0] shadow-sm space-y-5">
                            <h3 className="text-base font-bold text-gray-800 border-b border-[#f0ede8] pb-3 flex items-center gap-2">
                                Detail Pembayaran
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(price)}</span>
                                </div>

                                {appliedCoupon && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span>Potongan Diskon ({appliedCoupon.code})</span>
                                        <span>-{formatCurrency(discountAmount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-[#f0ede8] pt-3 flex justify-between font-bold text-gray-900 text-base">
                                    <span>Total Bayar</span>
                                    <span>{formatCurrency(finalPrice)}</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[#E5654B] hover:bg-[#d0533b] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-100 hover:shadow-lg disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? (
                                    'Memproses...'
                                ) : finalPrice === 0 ? (
                                    <>Aktifkan Sekarang gratis! <ChevronRight size={16} /></>
                                ) : paymentGatewayType === 'manual' ? (
                                    <>Checkout Pembayaran Manual <ChevronRight size={16} /></>
                                ) : (
                                    <>Lanjutkan Pembayaran <ChevronRight size={16} /></>
                                )}
                            </button>

                            {resellerSetting && (
                                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                                    Butuh bantuan? Hubungi WhatsApp kami di{' '}
                                    <a
                                        href={`https://wa.me/${resellerSetting.footer_whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#E5654B] font-semibold hover:underline"
                                    >
                                        {resellerSetting.footer_whatsapp}
                                    </a>
                                </p>
                            )}
                        </div>

                        {isLocal && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
                                <h4 className="font-bold text-red-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                                    🛠️ LOCAL DEBUG MODE
                                </h4>
                                <p className="text-xs text-red-700 leading-relaxed">
                                    Gunakan tombol di bawah ini untuk mensimulasikan aktivasi instan tanpa memicu transaksi pembayaran real.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDebugApproveDirectly}
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    Debug: Aktifkan Instan Tanpa Bayar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
