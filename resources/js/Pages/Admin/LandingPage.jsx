import { Head, router, usePage } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const templateColors = {
    default: { bg: 'from-[#E5654B] to-[#c44f38]', accent: '#E5654B' },
    elegant: { bg: 'from-slate-800 to-slate-900', accent: '#334155' },
    minimal: { bg: 'from-gray-100 to-white', accent: '#9ca3af', dark: true },
    colorful: { bg: 'from-violet-500 to-pink-500', accent: '#8b5cf6' },
};

export default function LandingPage({ settings, templates }) {
    const { flash, adminRoutePrefix } = usePage().props;
    const currentTemplate = settings?.landing_page_template || 'default';

    const selectTemplate = (id) => {
        router.post(`${adminRoutePrefix}/landing-page`, { landing_page_template: id }, { preserveScroll: true });
    };

    return (
        <DynamicAdminLayout title="Landing Page">
            <Head title="Landing Page" />
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Template Landing Page</h2>
                    <p className="text-[#999] text-sm mt-1">Pilih template landing page untuk halaman pendaftaran user Anda</p>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {(templates || []).map(t => {
                        const isActive = currentTemplate === t.id;
                        const colors = templateColors[t.id] || templateColors.default;
                        return (
                            <button
                                key={t.id}
                                onClick={() => selectTemplate(t.id)}
                                className={`text-left bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 ${isActive ? 'border-[#E5654B] shadow-md' : 'border-[#e8e5e0]'}`}
                            >
                                {/* Template Preview */}
                                <div className={`h-36 bg-gradient-to-br ${colors.bg} relative p-5 flex flex-col justify-end`}>
                                    {/* Mock elements */}
                                    <div className="absolute top-4 left-5 flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-md ${colors.dark ? 'bg-gray-300' : 'bg-white/30'}`} />
                                        <div className={`h-2 w-16 rounded ${colors.dark ? 'bg-gray-300' : 'bg-white/30'}`} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className={`h-3 w-3/4 rounded ${colors.dark ? 'bg-gray-400' : 'bg-white/40'}`} />
                                        <div className={`h-2 w-1/2 rounded ${colors.dark ? 'bg-gray-300' : 'bg-white/25'}`} />
                                    </div>
                                    <div className={`absolute bottom-4 right-5 px-3 py-1.5 rounded-lg text-[10px] font-bold ${colors.dark ? 'bg-gray-800 text-white' : 'bg-white/20 text-white'}`}>
                                        Daftar
                                    </div>
                                    {isActive && (
                                        <div className="absolute top-3 right-3 w-7 h-7 bg-[#E5654B] rounded-full flex items-center justify-center">
                                            <Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Template Info */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-[#1a1a1a] text-sm">{t.name}</h3>
                                        {isActive && (
                                            <span className="text-xs bg-[#E5654B]/10 text-[#E5654B] px-2 py-0.5 rounded-full font-semibold">Aktif</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[#999] mt-1">{t.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-sm flex gap-2">
                    <Icon d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Template landing page akan ditampilkan saat user mengakses link pendaftaran Anda. Template baru akan ditambahkan oleh Super Admin secara berkala.</span>
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
