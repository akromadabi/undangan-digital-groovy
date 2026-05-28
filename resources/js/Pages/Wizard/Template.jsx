import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import WizardLayout from '@/Layouts/WizardLayout';
import ThemePreviewCard from '@/Components/ThemePreviewCard';

export default function Template({ step, themes, selectedThemeId }) {
    const [selected, setSelected] = useState(selectedThemeId || null);
    const [submitting, setSubmitting] = useState(false);
    const { auth, subscription } = usePage().props;

    const isThemeLocked = (themeItem) => {
        // Jika user adalah Admin atau Super Admin, mereka memiliki akses penuh
        if (auth.user?.role === 'admin' || auth.user?.role === 'super_admin') return false;
        
        // Cek jika tema dibatasi untuk kelas paket tertentu
        if (themeItem.allowed_plans && themeItem.allowed_plans.length > 0) {
            const userPlanId = subscription?.plan?.id;
            if (!userPlanId) return true;
            return !themeItem.allowed_plans.includes(userPlanId);
        }
        return false;
    };

    const handleSelect = (themeId) => {
        setSelected(themeId);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitting(true);
        router.post(route('wizard.template.save', undefined, false), { theme_id: selected });
    };

    return (
        <WizardLayout currentStep={step} title="Pilih Template">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Pilih Template</h2>
                <p className="text-gray-400 text-sm mt-1">Anda bisa menggantinya nanti di dashboard</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes?.map((theme) => {
                    const locked = isThemeLocked(theme);
                    const isSelected = selected === theme.id;
                    return (
                        <div
                            key={theme.id}
                            onClick={locked ? undefined : () => handleSelect(theme.id)}
                            className={`relative rounded-2xl overflow-hidden transition-all duration-300 group border ${
                                locked 
                                    ? 'opacity-60 cursor-not-allowed border-gray-200' 
                                    : isSelected
                                        ? 'ring-3 ring-[#E5654B] shadow-xl scale-[1.02] border-[#E5654B]'
                                        : 'border-gray-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                            }`}
                        >
                            {/* Theme thumbnail */}
                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                <ThemePreviewCard onlyMockup={true} theme={theme} reseller={null} aspectClass="" />
                                {locked ? (
                                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md z-10">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        LOCKED
                                    </div>
                                ) : theme.is_premium ? (
                                    <div className="absolute top-2 right-2 bg-[#E5654B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider z-10">
                                        PREMIUM
                                    </div>
                                ) : null}
                                {isSelected && !locked && (
                                    <div className="absolute inset-0 bg-[#E5654B]/20 flex items-center justify-center z-10">
                                        <div className="w-12 h-12 bg-[#E5654B] rounded-full flex items-center justify-center text-white text-2xl">✓</div>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-white">
                                <h4 className="font-semibold text-sm text-gray-800 group-hover:text-[#E5654B] transition-colors truncate" title={theme.name}>{theme.name}</h4>
                                <button
                                    disabled={locked}
                                    onClick={(e) => { e.stopPropagation(); if (!locked) handleSelect(theme.id); }}
                                    className={`mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                        locked 
                                            ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                                            : isSelected
                                                ? 'bg-[#E5654B] text-white'
                                                : 'border border-[#E5654B] text-[#E5654B] hover:bg-orange-50'
                                    }`}
                                >
                                    {locked ? 'Terkunci 🔒' : isSelected ? 'Terpilih ✓' : 'Pilih'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => router.visit(route('wizard.events', undefined, false))}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-lg transition-all text-center">
                    ← Kembali
                </button>
                <button onClick={handleSubmit} disabled={!selected || submitting}
                    className="flex-[2] py-4 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                    {submitting ? 'Memproses...' : 'Buat Undangan Saya'}
                </button>
            </div>
        </WizardLayout>
    );
}
