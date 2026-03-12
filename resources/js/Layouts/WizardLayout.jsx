import { Head, Link, usePage } from '@inertiajs/react';

const steps = [
    { number: 1, label: 'Verification', icon: '✓' },
    { number: 2, label: 'Link', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { number: 3, label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { number: 4, label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { number: 5, label: 'Template', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01' },
];

export default function WizardLayout({ children, currentStep, title }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={title || 'Setup Undangan'} />

            {/* Top bar */}
            <header className="bg-white border-b border-gray-200 py-3 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">G</div>
                        <span className="font-semibold text-gray-800 hidden sm:block">Groovy</span>
                    </div>
                    <UserMenu />
                </div>
            </header>

            {/* Stepper */}
            <div className="bg-white border-b border-gray-200 py-4">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step.number < currentStep
                                            ? 'bg-emerald-500 text-white'
                                            : step.number === currentStep
                                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {step.number < currentStep ? '✓' : step.number}
                                    </div>
                                    <span className={`mt-1.5 text-xs font-medium ${step.number <= currentStep ? 'text-emerald-600' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-2 ${step.number < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-xs text-gray-400">
                © {new Date().getFullYear()} Undangan Digital Groovy. All rights reserved.
            </footer>
        </div>
    );
}

function UserMenu() {
    const { auth } = usePage().props;
    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hidden sm:block">Hi, {auth.user?.name}</span>
            <Link href={route('logout')} method="post" as="button" className="text-gray-400 hover:text-red-500">
                ☰
            </Link>
        </div>
    );
}
