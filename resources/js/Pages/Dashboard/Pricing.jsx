import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Pricing({ plans, currentPlan, features }) {
    const { flash } = usePage().props;
    const [showComparison, setShowComparison] = useState(false);

    const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

    const planMeta = {
        free: { gradient: 'from-gray-100 to-gray-50', badgeBg: 'bg-gray-500', ring: 'ring-gray-300', btn: 'from-gray-400 to-gray-500', glow: 'shadow-gray-200/50', emoji: '🌱' },
        silver: { gradient: 'from-slate-100 to-slate-50', badgeBg: 'bg-slate-500', ring: 'ring-slate-300', btn: 'from-slate-500 to-slate-600', glow: 'shadow-slate-200/50', emoji: '🥈' },
        gold: { gradient: 'from-amber-50 to-yellow-50', badgeBg: 'bg-amber-500', ring: 'ring-amber-300', btn: 'from-amber-400 to-orange-500', glow: 'shadow-amber-200/50', emoji: '🥇' },
        platinum: { gradient: 'from-violet-50 to-purple-50', badgeBg: 'bg-violet-500', ring: 'ring-violet-300', btn: 'from-violet-500 to-purple-600', glow: 'shadow-violet-200/50', emoji: '💎' },
    };

    const handleUpgrade = (planId) => {
        router.post(route('payment.checkout'), { plan_id: planId });
    };

    // Build feature access map: { planId: { featureId: is_enabled } }
    const planFeatureMap = {};
    plans.forEach(plan => {
        planFeatureMap[plan.id] = {};
        (plan.feature_access || []).forEach(fa => {
            if (fa.feature) {
                planFeatureMap[plan.id][fa.feature_id] = fa.is_enabled;
            }
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

    return (
        <DashboardLayout title="Upgrade Paket">
            <Head title="Upgrade Paket" />
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">❌ {flash.error}</div>
                )}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        PILIH PAKET TERBAIK
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pilih Paket yang Tepat</h2>
                    <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">Upgrade kapan saja untuk membuka semua fitur premium dan buat undangan digital yang sempurna</p>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {plans.map(plan => {
                        const meta = planMeta[plan.slug] || planMeta.silver;
                        const isCurrent = currentPlan?.id === plan.id;
                        const isUpgrade = !currentPlan || plan.price > (currentPlan?.price || 0);
                        const isGold = plan.slug === 'gold';
                        const enabledCount = Object.values(planFeatureMap[plan.id] || {}).filter(v => v).length;

                        return (
                            <div key={plan.id}
                                className={`relative rounded-2xl p-[2px] transition-all duration-300 ${isCurrent
                                    ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-200/40'
                                    : isGold
                                        ? 'bg-gradient-to-b from-amber-300 to-orange-400 shadow-xl shadow-amber-200/40'
                                        : 'bg-gradient-to-b from-gray-200 to-gray-300 hover:shadow-lg'
                                    }`}
                            >
                                {/* Current badge */}
                                {isCurrent && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                                            ✨ PAKET SAAT INI
                                        </span>
                                    </div>
                                )}
                                {/* Popular badge for gold */}
                                {isGold && !isCurrent && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                                            🔥 POPULER
                                        </span>
                                    </div>
                                )}

                                <div className={`relative bg-white rounded-[14px] p-6 h-full flex flex-col`}>
                                    {/* Plan name badge */}
                                    <div className="text-center mb-5">
                                        <div className="text-3xl mb-2">{meta.emoji}</div>
                                        <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-bold text-white tracking-wide ${meta.badgeBg}`}>
                                            {plan.name}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-5">
                                        <div className="text-3xl font-black text-gray-900 leading-none">
                                            {plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}
                                        </div>
                                        {plan.duration_days > 0 && (
                                            <div className="text-xs text-gray-400 mt-1.5 font-medium">{plan.duration_days} hari</div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 mb-4" />

                                    {/* Key features */}
                                    <div className="space-y-2.5 mb-5 flex-1">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[13px] text-gray-700">Max <strong>{plan.max_guests.toLocaleString()}</strong> tamu</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-[13px] text-gray-700">Max <strong>{plan.max_galleries}</strong> foto galeri</span>
                                        </div>
                                        {totalFeatures > 0 && (
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${enabledCount === totalFeatures ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                                    {enabledCount === totalFeatures ? (
                                                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-amber-600">{enabledCount}</span>
                                                    )}
                                                </div>
                                                <span className="text-[13px] text-gray-700">
                                                    <strong>{enabledCount}</strong>/{totalFeatures} fitur
                                                </span>
                                            </div>
                                        )}
                                        {plan.description && (
                                            <p className="text-[11px] text-gray-400 leading-relaxed mt-1 pl-[30px]">{plan.description}</p>
                                        )}
                                    </div>

                                    {/* CTA Button */}
                                    {plan.price > 0 && !isCurrent && isUpgrade ? (
                                        <button onClick={() => handleUpgrade(plan.id)}
                                            className={`w-full py-3 text-white rounded-xl text-sm font-bold bg-gradient-to-r ${meta.btn} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Upgrade
                                        </button>
                                    ) : isCurrent ? (
                                        <div className="w-full py-3 text-center bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-200 flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Aktif
                                        </div>
                                    ) : plan.price === 0 ? (
                                        <div className="w-full py-3 text-center bg-gray-50 text-gray-400 rounded-xl text-sm font-medium border border-gray-100">
                                            Paket Dasar
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Feature Comparison Toggle */}
                {totalFeatures > 0 && (
                    <div className="text-center">
                        <button onClick={() => setShowComparison(!showComparison)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {showComparison ? 'Sembunyikan' : 'Lihat'} Perbandingan Fitur
                            <svg className={`w-4 h-4 transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Feature Comparison Table */}
                {showComparison && totalFeatures > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {/* Table header */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                        <th className="text-left px-6 py-4 w-[280px] min-w-[200px]">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fitur</span>
                                        </th>
                                        {plans.map(plan => {
                                            const meta = planMeta[plan.slug] || planMeta.silver;
                                            const isCurrent = currentPlan?.id === plan.id;
                                            return (
                                                <th key={plan.id} className="text-center px-4 py-4 min-w-[110px]">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold text-white ${meta.badgeBg}`}>
                                                            {plan.name}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="text-[9px] text-emerald-500 font-semibold">Aktif</span>
                                                        )}
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Quota rows */}
                                    <tr>
                                        <td colSpan={plans.length + 1} className="px-6 py-2 bg-blue-50/60">
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                Kuota
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 text-[13px] text-gray-700 font-medium">Jumlah Tamu</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="text-center px-4 py-3">
                                                <span className="text-sm font-bold text-gray-800">{plan.max_guests.toLocaleString()}</span>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 text-[13px] text-gray-700 font-medium">Foto Galeri</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="text-center px-4 py-3">
                                                <span className="text-sm font-bold text-gray-800">{plan.max_galleries}</span>
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 text-[13px] text-gray-700 font-medium">Durasi Aktif</td>
                                        {plans.map(plan => (
                                            <td key={plan.id} className="text-center px-4 py-3 text-xs text-gray-500 font-medium">
                                                {plan.duration_days > 0 ? `${plan.duration_days} hari` : '∞ Selamanya'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Feature rows by category */}
                                    {Object.entries(featuresByCategory).map(([category, catFeatures]) => (
                                        <Fragment key={category}>
                                            <tr>
                                                <td colSpan={plans.length + 1} className="px-6 py-2 bg-purple-50/60 border-t-2 border-gray-200">
                                                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1.5">
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                        </svg>
                                                        {category}
                                                    </span>
                                                </td>
                                            </tr>
                                            {catFeatures.map((feature, fi) => (
                                                <tr key={feature.id} className={`border-t border-gray-100 hover:bg-gray-50/50 transition-colors`}>
                                                    <td className="px-6 py-3">
                                                        <div className="text-[13px] text-gray-700 font-medium">{feature.name}</div>
                                                        {feature.description && (
                                                            <div className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{feature.description}</div>
                                                        )}
                                                    </td>
                                                    {plans.map(plan => {
                                                        const enabled = planFeatureMap[plan.id]?.[feature.id];
                                                        return (
                                                            <td key={plan.id} className="text-center px-4 py-3">
                                                                {enabled ? (
                                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                                                                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                                                        <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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

                        {/* Table footer with CTA */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Semua fitur dikelola secara dinamis oleh admin
                            </p>
                            <Link href="/pricing" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                Ada pertanyaan? Hubungi kami
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
