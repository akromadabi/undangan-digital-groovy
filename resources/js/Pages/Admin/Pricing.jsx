import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, Fragment } from 'react';
import {
    DollarSign, Save, CheckCircle, AlertCircle, TrendingUp, Info
} from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

export default function Pricing({ planPricing, features = [] }) {
    const { flash } = usePage().props;
    const [saved, setSaved] = useState(false);
    const [showComparison, setShowComparison] = useState(false);

    // Build feature access map: { planId: { featureId: is_enabled } }
    const planFeatureMap = {};
    planPricing.forEach(plan => {
        planFeatureMap[plan.id] = {};
        (plan.feature_access || []).forEach(fa => {
            planFeatureMap[plan.id][fa.feature_id] = fa.is_enabled;
        });
    });

    // Group features by category
    const featuresByCategory = {};
    (features || []).forEach(f => {
        const cat = f.category || 'Lainnya';
        if (!featuresByCategory[cat]) featuresByCategory[cat] = [];
        featuresByCategory[cat].push(f);
    });

    const totalFeatures = (features || []).length;

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
                                            <p className="text-xs text-[#999] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                <span>Harga dasar: {formatCurrency(plan.base_price)}</span>
                                                {plan.suggested_price !== null && (
                                                    <span className="font-medium text-amber-600">
                                                        (Saran harga jual: {formatCurrency(plan.suggested_price)})
                                                    </span>
                                                )}
                                            </p>
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
                                                    style={{ paddingLeft: '2.75rem' }}
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

                    {/* Feature Comparison Toggle */}
                    {totalFeatures > 0 && (
                        <div className="text-center mt-8">
                            <button type="button" onClick={() => setShowComparison(!showComparison)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {showComparison ? 'Sembunyikan' : 'Lihat'} Perbandingan Fitur Detail
                                <svg className={`w-4 h-4 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Feature Comparison Table */}
                    {showComparison && totalFeatures > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mt-6">
                            <div className="overflow-x-auto relative">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
                                            <th className="sticky left-0 z-20 bg-gray-50 text-left px-3 py-3 md:px-6 md:py-4 w-[160px] min-w-[140px] md:w-[280px] md:min-w-[200px] border-r border-gray-150 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fitur</span>
                                            </th>
                                            {planPricing.map(plan => (
                                                <th key={plan.id} className="text-center px-2 py-3 md:px-4 md:py-4 min-w-[110px]">
                                                    <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#E5654B]/10 text-[#E5654B]">
                                                        {plan.name}
                                                    </span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Quota rows */}
                                        <tr className="border-b border-gray-200">
                                            <td colSpan={planPricing.length + 1} className="sticky left-0 z-10 px-3 py-2 md:px-6 md:py-2 bg-blue-50/80 text-left">
                                                <span className="sticky left-3 md:left-6 inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                                                    Kuota & Batasan
                                                </span>
                                            </td>
                                        </tr>
                                        <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-3 py-2.5 md:px-6 md:py-3 text-xs md:text-[13px] text-gray-700 font-medium border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Jumlah Tamu</td>
                                            {planPricing.map(plan => (
                                                <td key={plan.id} className="text-center px-2 py-2 md:px-4 md:py-3">
                                                    <span className="text-xs md:text-sm font-bold text-gray-800">{plan.max_guests?.toLocaleString()}</span>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-3 py-2.5 md:px-6 md:py-3 text-xs md:text-[13px] text-gray-700 font-medium border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Foto Galeri</td>
                                            {planPricing.map(plan => (
                                                <td key={plan.id} className="text-center px-2 py-2 md:px-4 md:py-3">
                                                    <span className="text-xs md:text-sm font-bold text-gray-800">{plan.max_galleries}</span>
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-3 py-2.5 md:px-6 md:py-3 text-xs md:text-[13px] text-gray-700 font-medium border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Durasi Aktif</td>
                                            {planPricing.map(plan => (
                                                <td key={plan.id} className="text-center px-2 py-2 md:px-4 md:py-3 text-[11px] md:text-xs text-gray-500 font-medium">
                                                    {plan.duration_days > 0 ? `${plan.duration_days} hari` : 'Selamanya (∞)'}
                                                </td>
                                            ))}
                                        </tr>

                                        {/* Feature rows by category */}
                                        {Object.entries(featuresByCategory).map(([category, catFeatures]) => (
                                            <Fragment key={category}>
                                                <tr className="border-b border-gray-200">
                                                    <td colSpan={planPricing.length + 1} className="sticky left-0 z-10 px-3 py-2 md:px-6 md:py-2 bg-purple-50/80 text-left border-t border-gray-100">
                                                        <span className="sticky left-3 md:left-6 inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                                                            {category}
                                                        </span>
                                                    </td>
                                                </tr>
                                                {catFeatures.map(feature => (
                                                    <tr key={feature.id} className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-3 py-2.5 md:px-6 md:py-3 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                            <div className="text-xs md:text-[13px] text-gray-700 font-medium">{feature.name}</div>
                                                            {feature.description && (
                                                                <div className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 leading-relaxed">{feature.description}</div>
                                                            )}
                                                        </td>
                                                        {planPricing.map(plan => {
                                                            const enabled = planFeatureMap[plan.id]?.[feature.id];
                                                            return (
                                                                <td key={plan.id} className="text-center px-2 py-2 md:px-4 md:py-3">
                                                                    {enabled ? (
                                                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                                                                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#E5654B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                            </svg>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                                                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AdminLayout>
    );
}
