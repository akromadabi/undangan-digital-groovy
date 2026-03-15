import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import {
    DollarSign, Save, CheckCircle, AlertCircle, TrendingUp, Info
} from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function Pricing({ planPricing }) {
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
        post('/admin/pricing', {
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
        <AdminLayout title="Harga Paket">
            <Head title="Harga Paket" />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                        <DollarSign size={22} className="text-[#E5654B]" /> Atur Harga Paket
                    </h2>
                    <p className="text-[#999] text-sm mt-1">
                        Tentukan harga jual paket untuk pelanggan Anda. Selisih dari harga dasar menjadi profit Anda.
                    </p>
                </div>

                {/* Success/Error notifications */}
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

                {/* Info box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <strong>Cara kerja markup:</strong> Harga dasar adalah harga yang ditetapkan oleh platform.
                        Anda bisa menaikkan harga jual (markup) untuk mendapat profit. Harga jual tidak boleh lebih rendah dari harga dasar.
                    </div>
                </div>

                {/* Pricing Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {planPricing.map((plan, index) => {
                            const profit = getProfit(index);
                            const profitPct = getProfitPercent(index);
                            const isBelowBase = data.prices[index].reseller_price !== '' && Number(data.prices[index].reseller_price) < plan.base_price;

                            return (
                                <div key={plan.id} className={`bg-white rounded-2xl border p-6 transition-all hover:shadow-md ${isBelowBase ? 'border-red-300' : 'border-[#e8e5e0]'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-[#1a1a1a] text-lg">{plan.name}</h3>
                                            <p className="text-xs text-[#999] mt-0.5">Harga dasar: {formatCurrency(plan.base_price)}</p>
                                        </div>
                                        {profit > 0 && (
                                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl">
                                                <TrendingUp size={14} />
                                                <span className="text-xs font-bold">+{profitPct}%</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-[#666] mb-1.5">
                                                Harga Jual (Rp)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999] text-sm">Rp</span>
                                                <input
                                                    type="number"
                                                    min={plan.base_price}
                                                    step="1000"
                                                    value={data.prices[index].reseller_price}
                                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                                    className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold focus:ring-1 transition-colors ${isBelowBase
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 text-red-600'
                                                        : 'border-[#e8e5e0] focus:border-[#E5654B] focus:ring-[#E5654B] text-[#1a1a1a]'
                                                        }`}
                                                />
                                            </div>
                                            {isBelowBase && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Harga jual tidak boleh lebih rendah dari harga dasar ({formatCurrency(plan.base_price)})
                                                </p>
                                            )}
                                        </div>

                                        <div className="bg-[#f8f7f4] rounded-xl p-3 flex items-center justify-between">
                                            <span className="text-xs text-[#999]">Estimasi profit per transaksi</span>
                                            <span className={`text-sm font-bold ${profit > 0 ? 'text-emerald-600' : 'text-[#999]'}`}>
                                                {profit > 0 ? `+${formatCurrency(profit)}` : formatCurrency(0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d4523a] disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan Harga'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
