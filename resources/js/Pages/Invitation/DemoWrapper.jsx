import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
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
    // State to hide the demo plan selector for clean screen recording (video preview)
    const [hideDemoSelector, setHideDemoSelector] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.has('x') ||
                   params.get('hide_selector') === 'true' || 
                   params.get('video') === 'true' || 
                   params.get('preview') === 'true';
        }
        return false;
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger if user is typing in form elements
            if (
                e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable
            ) {
                return;
            }
            if (e.key.toLowerCase() === 'h') {
                setHideDemoSelector(prev => !prev);
            }
        };

        // Triple click / tap tracking for mobile devices
        let lastClick = 0;
        let clickCount = 0;
        const handleClicks = (e) => {
            // Don't trigger if user is typing in form elements or clicking inside interactive selector buttons
            if (
                e.target.tagName === 'INPUT' || 
                e.target.tagName === 'TEXTAREA' || 
                e.target.isContentEditable ||
                e.target.closest('button') ||
                e.target.closest('a') ||
                e.target.closest('select')
            ) {
                return;
            }
            const now = Date.now();
            if (now - lastClick < 350) {
                clickCount++;
            } else {
                clickCount = 1;
            }
            lastClick = now;

            if (clickCount === 3) {
                setHideDemoSelector(prev => !prev);
                clickCount = 0;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('click', handleClicks);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('click', handleClicks);
        };
    }, []);

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

    // Simulated invitation to apply package features in real-time
    const simulatedInvitation = useMemo(() => {
        if (!invitation) return invitation;
        const copy = { ...invitation };
        if (activePlan) {
            // Check show_photos feature
            const hasPhotos = activePlan.features.includes('show_photos');
            copy.show_photos = hasPhotos;
            copy.hide_photos = !hasPhotos;

            // Check music feature
            if (!activePlan.features.includes('music')) {
                copy.music_url = null;
                copy.music_autoplay = false;
            }

            // Check rsvp feature
            if (!activePlan.features.includes('rsvp')) {
                copy.enable_rsvp = false;
            }

            // Check guestbook feature
            if (!activePlan.features.includes('guestbook')) {
                copy.enable_wishes = false;
            }

            // Check save_the_date feature
            if (!activePlan.features.includes('save_the_date')) {
                copy.show_countdown = false;
            }

            // Check animasi feature
            if (!activePlan.features.includes('animasi')) {
                copy.show_animations = false;
            }

            // Check qr_code feature
            if (!activePlan.features.includes('qr_code')) {
                copy.show_qr_code = false;
                copy.enable_qr = false;
            }
        }
        return copy;
    }, [invitation, activePlan]);

    // Simulated wishes (empty if guestbook feature is disabled)
    const simulatedWishes = useMemo(() => {
        if (activePlan && !activePlan.features.includes('guestbook')) {
            return [];
        }
        return wishes;
    }, [wishes, activePlan]);

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
                    invitation={simulatedInvitation}
                    sections={filteredSections}
                    brideGrooms={brideGrooms}
                    events={events}
                    galleries={slicedGalleries}
                    loveStories={loveStories}
                    bankAccounts={bankAccounts}
                    wishes={simulatedWishes}
                    guest={guest}
                    isDemo={false} // pass false so the theme component itself does not render the trigger or do simulation!
                />
            </Suspense>

            {/* Simulated Plan Selector Floating Widget */}
            {isDemo && subscriptionPlans && !hideDemoSelector && (
                <DemoPlanSelector 
                    plans={subscriptionPlans}
                    selectedPlanSlug={simulatedPlanSlug}
                    onChangePlan={setSimulatedPlanSlug}
                    allowedPlans={allowedPlans}
                    onHideCompletely={() => setHideDemoSelector(true)}
                />
            )}
        </>
    );
}
