import React, { useState } from 'react';

export default function DemoPlanSelector({ plans = [], selectedPlanSlug = 'platinum', onChangePlan, allowedPlans = null }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!plans || plans.length === 0) return null;

    const activePlan = plans.find(p => p.slug === selectedPlanSlug) || plans[plans.length - 1];

    const formatPrice = (price) => {
        if (!price || parseFloat(price) === 0) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            {/* Floating Trigger Pill */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-full max-w-[440px] px-4 select-none">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-between bg-black/75 hover:bg-black/85 text-white border border-white/20 rounded-full px-5 py-3 shadow-xl backdrop-filter blur-xl -webkit-backdrop-filter blur-xl transition-all duration-300 active:scale-[0.98]"
                >
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <div className="text-left">
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold leading-none">Simulasi Paket Demo</p>
                            <p className="text-xs font-bold text-emerald-400 mt-0.5">{activePlan.name} Plan</p>
                        </div>
                    </div>
                    
                    <span className="text-[10px] bg-white/10 hover:bg-white/20 border border-white/10 rounded-full px-3 py-1 font-bold tracking-wide uppercase transition-colors">
                        Ubah Paket <i className="fas fa-sliders-h ml-1 text-emerald-400" />
                    </span>
                </button>
            </div>

            {/* Bottom Sheet Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-filter blur-xs -webkit-backdrop-filter blur-xs z-[9999] transition-opacity duration-300 max-w-[480px] mx-auto ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            >
                {/* Bottom Sheet Card */}
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-[#fbfbf9] text-gray-800 rounded-t-[32px] px-6 pt-5 pb-8 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Slide Handle Indicator */}
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 select-none">Pilih Kelas Undangan Demo</h3>
                        <p className="text-xs text-gray-500 mt-1 px-4 leading-relaxed select-none">
                            Lihat perbedaan masa aktif, jumlah tamu, batas foto, serta seksi yang aktif secara langsung.
                        </p>
                    </div>

                    {/* Plan Cards Grid */}
                    <div className="grid grid-cols-2 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                        {plans.map((plan) => {
                            const isAllowed = !allowedPlans || allowedPlans.length === 0 || allowedPlans.includes(plan.slug);
                            const isSelected = plan.slug === selectedPlanSlug;
                            return (
                                <button
                                    key={plan.slug}
                                    type="button"
                                    disabled={!isAllowed}
                                    onClick={() => {
                                        if (isAllowed) {
                                            onChangePlan(plan.slug);
                                            setIsOpen(false);
                                        }
                                    }}
                                    className={`text-left p-4 rounded-2.5xl border transition-all duration-300 flex flex-col justify-between h-[155px] ${
                                        !isAllowed
                                            ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                                            : isSelected 
                                                ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 shadow-xs'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-black uppercase tracking-wider ${
                                                !isAllowed 
                                                    ? 'text-gray-400' 
                                                    : isSelected 
                                                        ? 'text-emerald-700' 
                                                        : 'text-gray-900'
                                            }`}>
                                                {plan.name}
                                            </span>
                                            {isSelected && isAllowed && (
                                                <i className="fas fa-check-circle text-emerald-600 text-sm" />
                                            )}
                                            {!isAllowed && (
                                                <i className="fas fa-lock text-gray-400 text-sm" title="Tidak tersedia untuk tema ini" />
                                            )}
                                        </div>
                                        <p className={`text-md font-bold mt-1.5 ${
                                            !isAllowed 
                                                ? 'text-gray-400' 
                                                : isSelected 
                                                    ? 'text-emerald-950' 
                                                    : 'text-gray-800'
                                        }`}>
                                            {formatPrice(plan.price)}
                                        </p>
                                    </div>

                                    {/* Limits details */}
                                    <div className="mt-3.5 space-y-1 text-[10px] text-gray-500 font-medium select-none">
                                        <div className="flex items-center gap-1.5">
                                            <i className="far fa-clock text-[10px] text-emerald-600/70" />
                                            <span>Masa Aktif: <strong className="text-gray-700">{plan.duration_days > 0 ? `${plan.duration_days} Hari` : 'Selamanya (Free)'}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <i className="far fa-user text-[10px] text-emerald-600/70" />
                                            <span>Maks. Tamu: <strong className="text-gray-700">{plan.max_guests > 9000 ? 'Tanpa Batas' : `${plan.max_guests} Orang`}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <i className="far fa-image text-[10px] text-emerald-600/70" />
                                            <span>Batas Foto: <strong className="text-gray-700">{plan.max_galleries} WebP</strong></span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Close Sheet button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="mt-6 w-full py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors"
                    >
                        Tutup & Terapkan Simulasi
                    </button>
                </div>
            </div>
        </>
    );
}
