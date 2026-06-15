import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    DollarSign, Save, CheckCircle, AlertCircle, TrendingUp, Info, Clock, Image as ImageIcon
} from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function ResellerGreetingCardPricing({ planPricing }) {
    const { flash } = usePage().props;
    const [saved, setSaved] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        prices: planPricing.map(p => ({
            plan_id: p.id,
            reseller_price: p.reseller_price,
        })),
    });

    const handlePriceChange = (index, value) => {
        const updated = [...data.prices];
        updated[index].reseller_price = value === '' ? '' : Number(value);
        setData('prices', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/greeting-card-pricing', {
            preserveScroll: true,
            onSuccess: () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            },
        });
    };

    const getProfit = (index) => {
        const base = planPricing[index].base_price;
        const sell = data.prices[index].reseller_price;
        if (sell === '' || isNaN(sell)) return 0;
        return Math.max(sell - base, 0);
    };

    const getProfitPercent = (index) => {
        const base = planPricing[index].base_price;
        if (base <= 0) return 0;
        const profit = getProfit(index);
        return ((profit / base) * 100).toFixed(0);
    };

    return (
        <AdminLayout title="Harga Paket Kartu Ucapan">
            <Head title="Harga Paket Kartu Ucapan" />
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                        <DollarSign size={22} className="text-[#E5654B]" /> Atur Harga Paket Kartu Ucapan
                    </h2>
                    <p className="text-[#999] text-sm mt-1">
                        Tentukan harga jual paket kartu ucapan untuk pelanggan Anda. Selisih dari harga dasar menjadi profit Anda.
                    </p>
                </div>

                {/* Notifications */}
                {(flash?.success || saved) && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {flash?.success || 'Harga berhasil diperbarui!'}
                    </div>
                )}
                {errors.prices && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {errors.prices}
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 leading-relaxed">
                        <strong>Cara kerja markup kartu ucapan:</strong> Harga dasar adalah harga tetap platform.
                        Anda dapat menaikkan harga jual (markup) untuk menghasilkan keuntungan. Harga jual tidak boleh lebih rendah dari harga dasar platform.
                    </div>
                </div>

                {/* Pricing Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {planPricing.map((plan, index) => {
                            const profit = getProfit(index);
                            const profitPct = getProfitPercent(index);
                            const isBelowBase = data.prices[index].reseller_price !== '' && Number(data.prices[index].reseller_price) < plan.base_price;

                            return (
                                <div key={plan.id} className={`bg-white rounded-3xl border p-6 transition-all duration-300 hover:shadow-md flex flex-col justify-between ${isBelowBase ? 'border-red-300 ring-1 ring-red-200' : 'border-[#e8e5e0]'}`}>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                                                <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2">
                                                    <span>Harga dasar: <span className="font-semibold text-gray-700">{formatCurrency(plan.base_price)}</span></span>
                                                    {plan.suggested_price !== null && (
                                                        <span className="font-medium text-amber-600">
                                                            (Saran jual: {formatCurrency(plan.suggested_price)})
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            {profit > 0 && (
                                                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                                                    <TrendingUp size={12} />
                                                    <span className="text-xs font-bold">+{profitPct}%</span>
                                                </div>
                                            )}
                                        </div>

                                        {plan.description && (
                                            <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                {plan.description}
                                            </p>
                                        )}

                                        <div className="flex gap-4 py-2 border-y border-[#f0ede8]">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Clock size={14} className="text-gray-400" />
                                                <span>{plan.duration_days} Hari</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <ImageIcon size={14} className="text-gray-400" />
                                                <span>Max {plan.max_galleries} Galeri</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide uppercase">
                                                    Harga Jual ke Pelanggan (Rp)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">Rp</span>
                                                    <input
                                                        type="number"
                                                        min={plan.base_price}
                                                        step="1000"
                                                        value={data.prices[index].reseller_price}
                                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                                        style={{ paddingLeft: '2.5rem' }}
                                                        className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:ring-1 transition-colors ${isBelowBase
                                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-600'
                                                            : 'border-[#e8e5e0] focus:border-[#E5654B] focus:ring-[#E5654B] text-gray-800'
                                                            }`}
                                                    />
                                                </div>
                                                {isBelowBase && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        Harga jual tidak boleh kurang dari harga dasar ({formatCurrency(plan.base_price)})
                                                    </p>
                                                )}
                                            </div>

                                            <div className="bg-[#f8f7f4] rounded-xl p-3 flex items-center justify-between border border-[#e8e5e0]/30">
                                                <span className="text-xs text-gray-500">Estimasi keuntungan Anda</span>
                                                <span className={`text-sm font-bold ${profit > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                                    {profit > 0 ? `+${formatCurrency(profit)}` : formatCurrency(0)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#E5654B] to-[#ff7d63] hover:from-[#c94f3a] hover:to-[#e05b41] text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            <Save size={16} />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan Harga'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
