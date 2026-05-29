import React, { useState, useMemo, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';
import DemoPlanSelector from '@/Components/DemoPlanSelector';

function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

export default function DemoWrapper({ 
    themeSlug, 
    allowedPlans = null,
    invitation, 
    sections, 
    brideGrooms, 
    events, 
    galleries, 
    loveStories, 
    bankAccounts, 
    wishes, 
    guest, 
    isDemo, 
    subscriptionPlans 
}) {
    // 1. Determine default simulated plan based on allowedPlans
    const defaultPlan = useMemo(() => {
        if (allowedPlans && allowedPlans.length > 0) {
            // Prefer platinum if allowed, otherwise the first allowed plan
            return allowedPlans.includes('platinum') ? 'platinum' : allowedPlans[0];
        }
        return 'platinum';
    }, [allowedPlans]);

    const [simulatedPlanSlug, setSimulatedPlanSlug] = useState(defaultPlan);

    const activePlan = useMemo(() => {
        if (subscriptionPlans) {
            return subscriptionPlans.find(p => p.slug === simulatedPlanSlug);
        }
        return null;
    }, [subscriptionPlans, simulatedPlanSlug]);

    const maxGalleries = activePlan ? activePlan.max_galleries : 999;

    // Filtered sections and sliced galleries based on simulated plan
    const filteredSections = useMemo(() => {
        let list = safeArr(sections);
        if (activePlan) {
            list = list.filter(sec => {
                let featKey = sec.section_key;
                
                // Allow core sections (cover, opening, bride_groom, event, closing)
                const coreSections = ['cover', 'opening', 'bride_groom', 'event', 'closing'];
                if (coreSections.includes(featKey)) return true;

                // Feature pivots in subscription plans map countdown to save_the_date
                if (featKey === 'countdown') featKey = 'save_the_date';

                return activePlan.features.includes(featKey);
            });
        }
        return list;
    }, [sections, activePlan]);

    const slicedGalleries = useMemo(() => {
        return safeArr(galleries).slice(0, maxGalleries);
    }, [galleries, maxGalleries]);

    // 2. Dynamically import the target theme component
    const ThemeComponent = useMemo(() => {
        return lazy(() => import(`./${themeSlug}/DynamicIndex.jsx`));
    }, [themeSlug]);

    return (
        <>
            <Suspense fallback={
                <div className="fixed inset-0 bg-[#fbfbf9] flex items-center justify-center z-[99999]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                        <p className="text-sm font-semibold text-emerald-800 tracking-wide uppercase">Memuat Tema Undangan...</p>
                    </div>
                </div>
            }>
                <ThemeComponent 
                    invitation={invitation}
                    sections={filteredSections}
                    brideGrooms={brideGrooms}
                    events={events}
                    galleries={slicedGalleries}
                    loveStories={loveStories}
                    bankAccounts={bankAccounts}
                    wishes={wishes}
                    guest={guest}
                    isDemo={false} // pass false so the theme component itself does not render the trigger or do simulation!
                />
            </Suspense>

            {/* Simulated Plan Selector Floating Widget */}
            {isDemo && subscriptionPlans && (
                <DemoPlanSelector 
                    plans={subscriptionPlans}
                    selectedPlanSlug={simulatedPlanSlug}
                    onChangePlan={setSimulatedPlanSlug}
                    allowedPlans={allowedPlans}
                />
            )}
        </>
    );
}
