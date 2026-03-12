import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import WizardLayout from '@/Layouts/WizardLayout';

export default function Template({ step, themes, selectedThemeId }) {
    const [selected, setSelected] = useState(selectedThemeId || null);
    const [submitting, setSubmitting] = useState(false);

    const handleSelect = (themeId) => {
        setSelected(themeId);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitting(true);
        router.post(route('wizard.template.save'), { theme_id: selected });
    };

    return (
        <WizardLayout currentStep={step} title="Pilih Template">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Pilih Template</h2>
                <p className="text-gray-400 text-sm mt-1">Anda bisa menggantinya nanti di dashboard</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {themes?.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => handleSelect(theme.id)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all group ${selected === theme.id
                                ? 'ring-3 ring-emerald-500 shadow-lg scale-[1.02]'
                                : 'border border-gray-200 hover:shadow-md hover:-translate-y-1'
                            }`}
                    >
                        {/* Theme thumbnail */}
                        <div className="aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                            {theme.thumbnail ? (
                                <img src={theme.thumbnail} alt={theme.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl"><svg className="w-10 h-10 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" /></svg></div>
                            )}
                            {theme.is_premium && (
                                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    PREMIUM
                                </div>
                            )}
                            {selected === theme.id && (
                                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">✓</div>
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-white">
                            <h4 className="font-semibold text-sm text-gray-800">{theme.name}</h4>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleSelect(theme.id); }}
                                className={`mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${selected === theme.id
                                        ? 'bg-emerald-500 text-white'
                                        : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                                    }`}
                            >
                                {selected === theme.id ? 'Terpilih ✓' : 'Select'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <button onClick={handleSubmit} disabled={submitting}
                    className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50">
                    {submitting ? 'Memproses...' : 'Buat Undangan Saya'}
                </button>
            )}
        </WizardLayout>
    );
}
