import React, { useState, useMemo, Fragment } from 'react';

export default function DemoPlanSelector({ plans = [], selectedPlanSlug = 'platinum', onChangePlan, allowedPlans = null, onHideCompletely = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showFeatureDetails, setShowFeatureDetails] = useState(false);
    const [planChangeNotification, setPlanChangeNotification] = useState(null);
    const [isDismissed, setIsDismissed] = useState(false);

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

    // Extract all unique feature objects dynamically from the plans
    const allFeatures = useMemo(() => {
        const map = new Map();
        plans.forEach(plan => {
            if (plan.feature_details) {
                plan.feature_details.forEach(feat => {
                    if (!map.has(feat.slug)) {
                        map.set(feat.slug, {
                            name: feat.name,
                            slug: feat.slug,
                            description: feat.description,
                            icon: feat.icon
                        });
                    }
                });
            }
        });
        return Array.from(map.values());
    }, [plans]);

    // Categorize features for the comparison table
    const featuresByCategory = useMemo(() => {
        const BASIC_SLUGS = [
            'opening', 'bride_groom', 'event', 'gallery', 
            'closing', 'guestbook', 'cover', 'guest', 
            'rsvp', 'template', 'dresscode', 'music'
        ];

        const PREMIUM_SECTION_SLUGS = [
            'love_story', 'bank', 'turut_mengundang', 'bride_groom_detail', 'video_wedding', 'video_album', 'save_the_date'
        ];

        const categories = {
            'FITUR UTAMA & DASAR': [],
            'FITUR PREMIUM - SEKSI': [],
            'FITUR PREMIUM - PENGATURAN & LAINNYA': []
        };

        allFeatures.forEach(f => {
            if (BASIC_SLUGS.includes(f.slug)) {
                categories['FITUR UTAMA & DASAR'].push(f);
            } else if (PREMIUM_SECTION_SLUGS.includes(f.slug)) {
                categories['FITUR PREMIUM - SEKSI'].push(f);
            } else {
                categories['FITUR PREMIUM - PENGATURAN & LAINNYA'].push(f);
            }
        });

        return Object.entries(categories).filter(([_, items]) => items.length > 0);
    }, [allFeatures]);

    const handleSelectPlan = (newPlanSlug) => {
        const oldPlan = plans.find(p => p.slug === selectedPlanSlug) || activePlan;
        const newPlan = plans.find(p => p.slug === newPlanSlug);
        
        if (!newPlan || oldPlan.slug === newPlan.slug) return;
        
        const oldFeatures = oldPlan.features || [];
        const newFeatures = newPlan.features || [];
        
        // Find added features
        const added = newFeatures
            .filter(f => !oldFeatures.includes(f))
            .map(slug => allFeatures.find(af => af.slug === slug))
            .filter(Boolean);
            
        // Find removed features
        const removed = oldFeatures
            .filter(f => !newFeatures.includes(f))
            .map(slug => allFeatures.find(af => af.slug === slug))
            .filter(Boolean);
            
        // Find limit changes
        const limitChanges = [];
        if (oldPlan.max_guests !== newPlan.max_guests) {
            limitChanges.push({
                name: 'Maksimal Tamu',
                icon: 'far fa-user',
                oldVal: oldPlan.max_guests > 9000 ? 'Tanpa Batas' : `${oldPlan.max_guests} Orang`,
                newVal: newPlan.max_guests > 9000 ? 'Tanpa Batas' : `${newPlan.max_guests} Orang`,
                isUpgrade: newPlan.max_guests > oldPlan.max_guests
            });
        }
        if (oldPlan.max_galleries !== newPlan.max_galleries) {
            limitChanges.push({
                name: 'Batas Foto Galeri',
                icon: 'far fa-image',
                oldVal: `${oldPlan.max_galleries} Foto`,
                newVal: `${newPlan.max_galleries} Foto`,
                isUpgrade: newPlan.max_galleries > oldPlan.max_galleries
            });
        }
        if (oldPlan.duration_days !== newPlan.duration_days) {
            limitChanges.push({
                name: 'Masa Aktif Link',
                icon: 'far fa-clock',
                oldVal: oldPlan.duration_days > 0 ? `${oldPlan.duration_days} Hari` : 'Trial',
                newVal: newPlan.duration_days > 0 ? `${newPlan.duration_days} Hari` : 'Trial',
                isUpgrade: newPlan.duration_days > oldPlan.duration_days || (oldPlan.duration_days === 0 && newPlan.duration_days > 0)
            });
        }

        // Only set notification if there are differences in features or limits
        if (added.length > 0 || removed.length > 0 || limitChanges.length > 0) {
            setPlanChangeNotification({
                oldPlanName: oldPlan.name,
                newPlanName: newPlan.name,
                added,
                removed,
                limitChanges
            });
        }
        
        onChangePlan(newPlanSlug);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Trigger Pill */}
            {!isDismissed && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-full max-w-[440px] px-4 select-none">
                    <div className="relative flex items-center w-full">
                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="w-full flex items-center justify-between bg-white/95 hover:bg-white text-gray-800 border border-gray-200/80 rounded-full pl-5 pr-14 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <div className="text-left">
                                    <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold leading-none">Simulasi Paket Demo</p>
                                    <p className="text-xs font-extrabold text-emerald-600 mt-0.5">{activePlan.name} Plan</p>
                                </div>
                            </div>
                            
                            <span className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-3 py-1.5 font-bold tracking-wide uppercase shadow-sm transition-colors">
                                Ubah Paket <i className="fas fa-sliders-h ml-1 text-white" />
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDismissed(true);
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                            title="Sembunyikan Simulasi"
                        >
                            <i className="fas fa-times text-xs" />
                        </button>
                    </div>
                </div>
            )}

            {/* Minimized Floating Settings Icon */}
            {isDismissed && (
                <button
                    type="button"
                    onClick={() => setIsDismissed(false)}
                    className="fixed top-4 right-4 z-[99999] w-9 h-9 rounded-full bg-white/95 hover:bg-white text-emerald-600 hover:text-emerald-700 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-gray-200/80 backdrop-blur-md cursor-pointer"
                    title="Tampilkan Simulasi Paket"
                >
                    <i className="fas fa-sliders-h text-sm animate-pulse" />
                </button>
            )}

            {/* Bottom Sheet Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] transition-all duration-300 max-w-[480px] mx-auto ${
                    isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
                }`}
                onClick={() => setIsOpen(false)}
            >
                {/* Bottom Sheet Card */}
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-[#fbfbf9] text-gray-800 rounded-t-[32px] px-6 pt-5 pb-8 shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Slide Handle Indicator */}
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

                    <div className="text-center mb-5 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-gray-900 select-none">Pilih Kelas Undangan Demo</h3>
                        <p className="text-xs text-gray-500 mt-1 px-4 leading-relaxed select-none">
                            Lihat perbedaan masa aktif, jumlah tamu, batas foto, serta seksi yang aktif secara langsung.
                        </p>
                        
                        <p className="text-[10px] text-gray-400 mt-2 px-4 leading-relaxed select-none">
                            💡 <span className="italic">Tip: Tekan tombol <strong>'H'</strong> di keyboard, atau <strong>ketuk (tap) layar HP 3 kali secara cepat</strong> untuk menyembunyikan/menampilkan kembali panel ini.</span>
                        </p>

                        {/* Global Comparison Button */}
                        <button
                            type="button"
                            onClick={() => setShowComparison(true)}
                            className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-bold rounded-full transition-all active:scale-95 shadow-xs border border-emerald-100"
                        >
                            <i className="fas fa-columns" /> Bandingkan Seluruh Fitur Paket
                        </button>
                    </div>

                    {/* Plan Cards Grid */}
                    <div className="grid grid-cols-2 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                        {plans.map((plan) => {
                            const isAllowed = !allowedPlans || allowedPlans.length === 0 || allowedPlans.includes(plan.slug);
                            const isSelected = plan.slug === selectedPlanSlug;
                            return (
                                <div
                                    key={plan.slug}
                                    onClick={() => {
                                        if (isAllowed) {
                                            handleSelectPlan(plan.slug);
                                        }
                                    }}
                                    className={`text-left p-4 rounded-2.5xl border transition-all duration-300 flex flex-col justify-between h-[155px] cursor-pointer ${
                                        !isAllowed
                                            ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                                            : isSelected 
                                                ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 shadow-xs'
                                    }`}
                                >
                                    <div className="w-full">
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
                                    <div className="mt-2.5 space-y-0.5 text-[10px] text-gray-500 font-medium select-none w-full border-t border-gray-100 pt-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <i className="far fa-clock text-[10px] text-emerald-600/70" />
                                            <span>Masa Aktif: <strong className="text-gray-700">{plan.duration_days > 0 ? `${plan.duration_days} Hari` : '5 Hari (Trial)'}</strong></span>
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
                                </div>
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

                    {onHideCompletely && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onHideCompletely();
                            }}
                            className="mt-2.5 w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all active:scale-[0.98] border border-red-100"
                        >
                            🚫 Sembunyikan Menu Simulasi (Rekam Video)
                        </button>
                    )}
                </div>
            </div>

            {/* Full Feature Comparison Modal */}
            {showComparison && (
                <div 
                    className="fixed inset-0 bg-black/75 z-[100000] flex items-center justify-center p-3 animate-in fade-in duration-300"
                    onClick={() => setShowComparison(false)}
                >
                    <div 
                        className="bg-[#fbfbf9] w-full max-w-[540px] h-[90vh] rounded-[32px] p-5 shadow-2xl relative flex flex-col animate-in scale-in duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-4 flex-none">
                            <div>
                                <span className="text-[9px] uppercase tracking-widest text-emerald-600 font-extrabold">Bandingkan Fitur</span>
                                <h4 className="text-md font-black text-gray-900 mt-0.5">Perbandingan Seluruh Paket</h4>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setShowComparison(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none p-1"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Toggle Description Details */}
                        <div className="flex justify-end mb-3.5 flex-none pr-1">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer shadow-xs hover:bg-gray-50 transition-colors select-none">
                                <input
                                    type="checkbox"
                                    checked={showFeatureDetails}
                                    onChange={(e) => setShowFeatureDetails(e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300 cursor-pointer"
                                />
                                Tampilkan Detail Deskripsi Fitur
                            </label>
                        </div>

                        {/* Table Container */}
                        <div className="flex-1 overflow-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                                        <th className="sticky left-0 top-0 z-20 bg-gray-50 text-left px-4 py-3 border-r border-gray-150 border-b border-gray-200 w-[120px] min-w-[100px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Fitur</span>
                                        </th>
                                        {showFeatureDetails && (
                                            <th className="sticky top-0 z-10 text-left px-4 py-3 border-b border-gray-200 bg-gray-50 border-r border-gray-100 min-w-[150px] max-w-[200px] whitespace-normal break-words">
                                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Deskripsi</span>
                                            </th>
                                        )}
                                        {plans.map(plan => (
                                            <th key={plan.slug} className="sticky top-0 z-10 text-center px-2 py-3 border-b border-gray-200 bg-gray-50 min-w-[75px]">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold text-white tracking-wide bg-emerald-600">
                                                    {plan.name}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Quota & Limits Section */}
                                    <tr>
                                        <td colSpan={showFeatureDetails ? plans.length + 2 : plans.length + 1} className="sticky left-0 z-10 px-4 py-1.5 bg-emerald-50/90 text-left border-b border-gray-100">
                                            <span className="sticky left-4 inline-flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">
                                                <i className="far fa-star text-[10px]" /> Kuota & Batasan
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-4 py-2.5 text-xs text-gray-700 font-bold border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Jumlah Tamu</td>
                                        {showFeatureDetails && (
                                            <td className="px-4 py-2.5 text-[10px] text-gray-400 leading-relaxed border-r border-gray-100 whitespace-normal break-words">
                                                Batas maksimal jumlah tamu yang diundang
                                            </td>
                                        )}
                                        {plans.map(plan => (
                                            <td key={plan.slug} className="text-center px-2 py-2.5 text-xs font-black text-gray-800">
                                                {plan.max_guests > 9000 ? '9.999+' : plan.max_guests.toLocaleString('id-ID')}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-4 py-2.5 text-xs text-gray-700 font-bold border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Foto Galeri</td>
                                        {showFeatureDetails && (
                                            <td className="px-4 py-2.5 text-[10px] text-gray-400 leading-relaxed border-r border-gray-100 whitespace-normal break-words">
                                                Maksimal unggah foto galeri prewedding
                                            </td>
                                        )}
                                        {plans.map(plan => (
                                            <td key={plan.slug} className="text-center px-2 py-2.5 text-xs font-black text-gray-800">
                                                {plan.max_galleries}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-4 py-2.5 text-xs text-gray-700 font-bold border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Durasi Aktif</td>
                                        {showFeatureDetails && (
                                            <td className="px-4 py-2.5 text-[10px] text-gray-400 leading-relaxed border-r border-gray-100 whitespace-normal break-words">
                                                Masa aktif link undangan digital
                                            </td>
                                        )}
                                        {plans.map(plan => (
                                            <td key={plan.slug} className="text-center px-2 py-2.5 text-[10px] text-gray-500 font-bold whitespace-nowrap">
                                                {plan.slug === 'free' ? '5 hari (Trial)' : plan.duration_days > 0 ? `${plan.duration_days} hari` : 'Selamanya'}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Features Rows By Category */}
                                    {featuresByCategory.map(([category, catFeatures]) => (
                                        <Fragment key={category}>
                                            <tr>
                                                <td colSpan={showFeatureDetails ? plans.length + 2 : plans.length + 1} className="sticky left-0 z-10 px-4 py-1.5 bg-emerald-50/70 text-left border-b border-gray-100">
                                                    <span className="sticky left-4 inline-flex items-center gap-1.5 text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest">
                                                        {category}
                                                    </span>
                                                </td>
                                            </tr>
                                            {catFeatures.map((feat) => (
                                                <tr key={feat.slug} className="group border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors px-4 py-2.5 border-r border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                                                        <div className="text-xs text-gray-700 font-bold flex items-center gap-1.5">
                                                            {feat.icon && <i className={`${feat.icon} text-emerald-600/70 w-3 text-center`} />}
                                                            <span>{feat.name}</span>
                                                        </div>
                                                    </td>
                                                    {showFeatureDetails && (
                                                        <td className="px-4 py-2.5 text-[10px] text-gray-400 leading-normal border-r border-gray-100 whitespace-normal break-words">
                                                            {feat.description || '-'}
                                                        </td>
                                                    )}
                                                    {plans.map(plan => {
                                                        const enabled = plan.features.includes(feat.slug);
                                                        return (
                                                            <td key={plan.slug} className="text-center px-2 py-2">
                                                                {enabled ? (
                                                                    <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto shadow-sm">
                                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto text-gray-300">
                                                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setShowComparison(false)}
                            className="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-colors flex-none"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            )}

            {/* Notification of plan differences */}
            {planChangeNotification && (
                <div 
                    className="fixed inset-0 bg-black/75 z-[100001] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setPlanChangeNotification(null)}
                >
                    <div 
                        className="bg-[#fbfbf9] w-full max-w-[400px] rounded-[28px] p-6 shadow-2xl relative flex flex-col animate-in scale-in duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="text-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                                <i className="fas fa-exchange-alt text-lg animate-pulse" />
                            </div>
                            <h4 className="text-md font-extrabold text-gray-900">Perubahan Simulasi Paket</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Berhasil beralih dari <strong className="text-emerald-700">{planChangeNotification.oldPlanName}</strong> ke <strong className="text-emerald-700">{planChangeNotification.newPlanName}</strong>.
                            </p>
                        </div>

                        {/* List of Changes */}
                        <div className="flex-1 overflow-y-auto max-h-[280px] pr-1 space-y-4 my-2">
                            {/* Limit changes */}
                            {planChangeNotification.limitChanges.length > 0 && (
                                <div className="space-y-2">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Perubahan Batasan</h5>
                                    <div className="bg-white border border-gray-150 rounded-2xl p-3 space-y-2">
                                        {planChangeNotification.limitChanges.map((lim, idx) => (
                                            <div key={idx} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                                                    <i className={`${lim.icon} text-gray-400`} /> {lim.name}
                                                </span>
                                                <span className="font-bold flex items-center gap-1">
                                                    <span className="text-gray-400 line-through">{lim.oldVal}</span>
                                                    <i className="fas fa-long-arrow-alt-right text-[10px] text-gray-400 mx-0.5" />
                                                    <span className={lim.isUpgrade ? 'text-emerald-600' : 'text-amber-600'}>
                                                        {lim.newVal}
                                                    </span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Added features */}
                            {planChangeNotification.added.length > 0 && (
                                <div className="space-y-1.5">
                                    <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                                        <i className="fas fa-plus-circle" /> Fitur Baru yang Aktif ({planChangeNotification.added.length})
                                    </h5>
                                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3 space-y-2">
                                        {planChangeNotification.added.map((feat) => (
                                            <div key={feat.slug} className="flex items-start gap-2 text-xs">
                                                <i className="fas fa-check-circle text-emerald-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-800">{feat.name}</p>
                                                    {feat.description && (
                                                        <p className="text-[9px] text-gray-400 leading-normal mt-0.5">{feat.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Removed features */}
                            {planChangeNotification.removed.length > 0 && (
                                <div className="space-y-1.5">
                                    <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                        <i className="fas fa-minus-circle" /> Fitur yang Dinonaktifkan ({planChangeNotification.removed.length})
                                    </h5>
                                    <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3 space-y-2">
                                        {planChangeNotification.removed.map((feat) => (
                                            <div key={feat.slug} className="flex items-start gap-2 text-xs">
                                                <i className="fas fa-times-circle text-amber-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-gray-700">{feat.name}</p>
                                                    {feat.description && (
                                                        <p className="text-[9px] text-gray-400 leading-normal mt-0.5">{feat.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setPlanChangeNotification(null)}
                            className="mt-4 w-full py-3 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
                        >
                            Mengerti & Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
