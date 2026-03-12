import { Head, Link } from '@inertiajs/react';

const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const features = [
    { icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42', title: 'Desain Premium', desc: 'Pilihan tema elegan & modern' },
    { icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21', title: 'RSVP & Tamu', desc: 'Konfirmasi kehadiran otomatis' },
    { icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75', title: 'Bagikan Digital', desc: 'Link undangan & QR code' },
];

const planColors = {
    free: { gradient: 'from-gray-100 to-gray-50', badge: 'bg-gray-500', btn: 'from-gray-400 to-gray-500' },
    silver: { gradient: 'from-slate-100 to-slate-50', badge: 'bg-slate-500', btn: 'from-slate-500 to-slate-600' },
    gold: { gradient: 'from-amber-50 to-yellow-50', badge: 'bg-amber-500', btn: 'from-amber-400 to-orange-500' },
    platinum: { gradient: 'from-violet-50 to-purple-50', badge: 'bg-violet-500', btn: 'from-violet-500 to-purple-600' },
};

const formatCurrency = (a) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(a);

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE: DEFAULT — warm coral/orange tone
   ═══════════════════════════════════════════════════════════════ */
function DefaultTemplate({ reseller, plans }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdf6f0] via-[#fef9f5] to-[#f5efe8]">
            <header className="pt-8 pb-4 px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    {reseller.brand_logo ? (
                        <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-12 h-12 rounded-xl object-contain" />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#E5654B] to-[#d4523a] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">{reseller.brand_name.charAt(0)}</span>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-[#1a1a1a]">{reseller.brand_name}</h1>
                </div>
            </header>

            <section className="px-6 pb-10 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-[#E5654B]/10 text-[#E5654B] px-4 py-1.5 rounded-full text-xs font-bold mb-4">
                    <Icon d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-3.5 h-3.5" />
                    UNDANGAN DIGITAL PREMIUM
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a] tracking-tight leading-tight">
                    Buat Undangan Digital<br /><span className="text-[#E5654B]">yang Tak Terlupakan</span>
                </h2>
                <p className="text-[#999] text-sm mt-4 max-w-md mx-auto leading-relaxed">
                    Desain elegan, fitur lengkap, RSVP otomatis — semua yang Anda butuhkan untuk undangan pernikahan digital yang sempurna.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href={`/register?ref=${reseller.ref}`} className="px-8 py-3 bg-gradient-to-r from-[#E5654B] to-[#d4523a] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#E5654B]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Daftar Sekarang — Gratis!
                    </Link>
                    <Link href="/login" className="px-6 py-3 bg-white text-[#555] rounded-xl font-medium text-sm border border-[#e8e5e0] hover:bg-[#f5f3f0] transition-all">
                        Sudah Punya Akun
                    </Link>
                </div>
            </section>

            <section className="px-6 pb-12 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#e8e5e0] p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-[#E5654B]/10 flex items-center justify-center mx-auto mb-3">
                                <Icon d={f.icon} className="w-6 h-6 text-[#E5654B]" />
                            </div>
                            <h3 className="font-bold text-[#1a1a1a] text-sm">{f.title}</h3>
                            <p className="text-xs text-[#999] mt-1">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <PricingSection plans={plans} reseller={reseller} cardBg="bg-white" textColor="text-gray-900" />

            <footer className="px-6 py-6 border-t border-[#e8e5e0] text-center">
                <p className="text-xs text-[#bbb]">© {new Date().getFullYear()} {reseller.brand_name}. Powered by Groovy.</p>
            </footer>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE: ELEGANT — dark, sophisticated slate & gold
   ═══════════════════════════════════════════════════════════════ */
function ElegantTemplate({ reseller, plans }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <header className="pt-10 pb-6 px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-8">
                    {reseller.brand_logo ? (
                        <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-12 h-12 rounded-xl object-contain" />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-slate-900 text-xl font-bold">{reseller.brand_name.charAt(0)}</span>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-white">{reseller.brand_name}</h1>
                </div>
            </header>

            <section className="px-6 pb-12 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-amber-400/20">
                    <Icon d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" className="w-3.5 h-3.5" />
                    PREMIUM WEDDING INVITATION
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Undangan Digital<br /><span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">Berkelas & Elegan</span>
                </h2>
                <p className="text-slate-400 text-sm mt-5 max-w-md mx-auto leading-relaxed">
                    Tampilkan momen spesial Anda dengan desain mewah yang memukau setiap tamu undangan.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href={`/register?ref=${reseller.ref}`} className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Buat Undangan Sekarang
                    </Link>
                    <Link href="/login" className="px-6 py-3.5 text-slate-300 rounded-xl font-medium text-sm border border-slate-600 hover:bg-slate-700 transition-all">
                        Login
                    </Link>
                </div>
            </section>

            <section className="px-6 pb-14 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {features.map((f, i) => (
                        <div key={i} className="bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5 text-center hover:border-amber-500/30 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-400/20 transition-colors">
                                <Icon d={f.icon} className="w-6 h-6 text-amber-400" />
                            </div>
                            <h3 className="font-bold text-white text-sm">{f.title}</h3>
                            <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 pb-16 max-w-5xl mx-auto">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-extrabold text-white">Pilih Paket Anda</h3>
                    <p className="text-sm text-slate-400 mt-2">Mulai gratis, upgrade kapan saja</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {(plans || []).map((plan, i) => {
                        const colors = planColors[plan.slug] || planColors.silver;
                        const isGold = plan.slug === 'gold';
                        return (
                            <div key={i} className={`relative rounded-2xl p-[2px] ${isGold ? 'bg-gradient-to-b from-amber-300 to-orange-400 shadow-xl shadow-amber-500/20' : 'bg-gradient-to-b from-slate-600 to-slate-700 hover:from-slate-500'} transition-all`}>
                                {isGold && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-[10px] font-bold px-4 py-1 rounded-full shadow-md">POPULER</span>
                                    </div>
                                )}
                                <div className="bg-slate-800 rounded-[14px] p-6 h-full flex flex-col">
                                    <div className="text-center mb-4">
                                        <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-bold text-white tracking-wide ${colors.badge}`}>{plan.name}</span>
                                    </div>
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-black text-white">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</div>
                                        {plan.duration_days > 0 && <div className="text-xs text-slate-400 mt-1">{plan.duration_days} hari</div>}
                                    </div>
                                    <div className="border-t border-slate-700 mb-4" />
                                    <div className="space-y-2 mb-5 flex-1">
                                        <div className="flex items-center gap-2 text-[13px] text-slate-300"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-amber-400 flex-shrink-0" /> Max <strong className="mx-1">{plan.max_guests?.toLocaleString()}</strong> tamu</div>
                                        <div className="flex items-center gap-2 text-[13px] text-slate-300"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-amber-400 flex-shrink-0" /> Max <strong className="mx-1">{plan.max_galleries}</strong> foto</div>
                                    </div>
                                    <Link href={`/register?ref=${reseller.ref}`} className={`w-full py-3 text-white rounded-xl text-sm font-bold bg-gradient-to-r ${colors.btn} hover:shadow-lg text-center transition-all`}>
                                        {plan.price > 0 ? 'Mulai Sekarang' : 'Daftar Gratis'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <footer className="px-6 py-6 border-t border-slate-700/50 text-center">
                <p className="text-xs text-slate-500">© {new Date().getFullYear()} {reseller.brand_name}. Powered by Groovy.</p>
            </footer>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE: MINIMAL — clean white, subtle gray accents
   ═══════════════════════════════════════════════════════════════ */
function MinimalTemplate({ reseller, plans }) {
    return (
        <div className="min-h-screen bg-white">
            <header className="pt-10 pb-4 px-6 max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {reseller.brand_logo ? (
                        <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-9 h-9 rounded-lg object-contain" />
                    ) : (
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{reseller.brand_name.charAt(0)}</span>
                        </div>
                    )}
                    <span className="text-lg font-bold text-gray-900">{reseller.brand_name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/login" className="px-4 py-2 text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors">Login</Link>
                    <Link href={`/register?ref=${reseller.ref}`} className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Daftar</Link>
                </div>
            </header>

            <section className="px-6 py-20 text-center max-w-2xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                    Undangan digital<br />yang <span className="underline decoration-gray-300 decoration-2 underline-offset-4">simpel & cantik</span>
                </h2>
                <p className="text-gray-400 text-base mt-6 max-w-md mx-auto leading-relaxed">
                    Buat undangan pernikahan digital dalam hitungan menit. Tanpa ribet, langsung jadi.
                </p>
                <div className="mt-8">
                    <Link href={`/register?ref=${reseller.ref}`} className="inline-flex px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">
                        Mulai Gratis →
                    </Link>
                </div>
            </section>

            <section className="px-6 pb-16 max-w-4xl mx-auto border-t border-gray-100 pt-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Icon d={f.icon} className="w-5 h-5 text-gray-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-6 pb-20 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-extrabold text-gray-900">Harga transparan</h3>
                    <p className="text-sm text-gray-400 mt-2">Pilih sesuai kebutuhan Anda</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(plans || []).map((plan, i) => {
                        const isGold = plan.slug === 'gold';
                        return (
                            <div key={i} className={`rounded-2xl p-6 flex flex-col ${isGold ? 'bg-gray-900 text-white ring-2 ring-gray-900' : 'bg-gray-50 text-gray-900 border border-gray-200'}`}>
                                <div className="text-xs font-bold uppercase tracking-wider mb-3 opacity-50">{plan.name}</div>
                                <div className="text-3xl font-black mb-1">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</div>
                                {plan.duration_days > 0 && <div className={`text-xs mb-4 ${isGold ? 'text-gray-400' : 'text-gray-400'}`}>{plan.duration_days} hari</div>}
                                <div className={`border-t mb-4 ${isGold ? 'border-gray-700' : 'border-gray-200'}`} />
                                <div className="space-y-2 mb-6 flex-1 text-sm">
                                    <div className="flex items-center gap-2"><Icon d="M4.5 12.75l6 6 9-13.5" className={`w-4 h-4 flex-shrink-0 ${isGold ? 'text-green-400' : 'text-green-500'}`} /> {plan.max_guests?.toLocaleString()} tamu</div>
                                    <div className="flex items-center gap-2"><Icon d="M4.5 12.75l6 6 9-13.5" className={`w-4 h-4 flex-shrink-0 ${isGold ? 'text-green-400' : 'text-green-500'}`} /> {plan.max_galleries} foto</div>
                                </div>
                                <Link href={`/register?ref=${reseller.ref}`} className={`w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${isGold ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                                    {plan.price > 0 ? 'Pilih Paket' : 'Coba Gratis'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>

            <footer className="px-6 py-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-300">© {new Date().getFullYear()} {reseller.brand_name}. Powered by Groovy.</p>
            </footer>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE: COLORFUL — vibrant gradients, playful design
   ═══════════════════════════════════════════════════════════════ */
function ColorfulTemplate({ reseller, plans }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50 via-pink-50 to-orange-50">
            <header className="pt-8 pb-4 px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    {reseller.brand_logo ? (
                        <img src={reseller.brand_logo} alt={reseller.brand_name} className="w-12 h-12 rounded-2xl object-contain" />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-300/30">
                            <span className="text-white text-xl font-bold">{reseller.brand_name.charAt(0)}</span>
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900">{reseller.brand_name}</h1>
                </div>
            </header>

            <section className="px-6 pb-12 text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-5 shadow-sm">
                    ✨ BUAT UNDANGAN IMPIANMU
                </div>
                <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    Undangan Digital{' '}
                    <span className="bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">Penuh Warna</span>
                </h2>
                <p className="text-gray-500 text-sm mt-5 max-w-md mx-auto leading-relaxed">
                    Ekspresikan cinta Anda dengan undangan digital yang cantik, penuh warna, dan mudah dibagikan ke semua tamu.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href={`/register?ref=${reseller.ref}`} className="px-8 py-3.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-400/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        🎉 Mulai Buat Undangan
                    </Link>
                    <Link href="/login" className="px-6 py-3.5 bg-white text-gray-600 rounded-2xl font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                        Masuk Akun
                    </Link>
                </div>
            </section>

            <section className="px-6 pb-14 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {features.map((f, i) => {
                        const gradients = ['from-violet-500 to-purple-600', 'from-pink-500 to-rose-500', 'from-orange-400 to-amber-500'];
                        return (
                            <div key={i} className="bg-white rounded-3xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all shadow-sm border border-gray-100">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                                    <Icon d={f.icon} className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900">{f.title}</h3>
                                <p className="text-xs text-gray-400 mt-1.5">{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="px-6 pb-16 max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h3 className="text-2xl font-extrabold text-gray-900">Pilih Paket Terbaik</h3>
                    <p className="text-sm text-gray-400 mt-2">Mulai dari gratis, upgrade sesuai kebutuhan</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {(plans || []).map((plan, i) => {
                        const isGold = plan.slug === 'gold';
                        const cardGradients = ['from-gray-50 to-white', 'from-blue-50 to-indigo-50', 'from-amber-50 to-orange-50', 'from-violet-50 to-purple-50'];
                        const btnGradients = ['from-gray-600 to-gray-700', 'from-blue-500 to-indigo-600', 'from-amber-500 to-orange-500', 'from-violet-500 to-purple-600'];
                        return (
                            <div key={i} className={`relative rounded-3xl overflow-hidden bg-gradient-to-b ${cardGradients[i % 4]} border ${isGold ? 'border-amber-300 shadow-xl shadow-amber-200/30' : 'border-gray-200'} transition-all hover:shadow-lg`}>
                                {isGold && (
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400" />
                                )}
                                <div className="p-6 flex flex-col h-full">
                                    <div className="text-center mb-4">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{plan.name}</span>
                                        {isGold && <span className="ml-2 text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold">⭐ BEST</span>}
                                    </div>
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-black text-gray-900">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</div>
                                        {plan.duration_days > 0 && <div className="text-xs text-gray-400 mt-1">{plan.duration_days} hari</div>}
                                    </div>
                                    <div className="border-t border-gray-200/60 mb-4" />
                                    <div className="space-y-2 mb-5 flex-1">
                                        <div className="flex items-center gap-2 text-[13px] text-gray-700"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {plan.max_guests?.toLocaleString()} tamu</div>
                                        <div className="flex items-center gap-2 text-[13px] text-gray-700"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {plan.max_galleries} foto</div>
                                    </div>
                                    <Link href={`/register?ref=${reseller.ref}`} className={`w-full py-3 text-white rounded-xl text-sm font-bold bg-gradient-to-r ${btnGradients[i % 4]} hover:shadow-lg text-center transition-all`}>
                                        {plan.price > 0 ? 'Pilih Paket' : 'Coba Gratis'}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <footer className="px-6 py-6 border-t border-violet-100 text-center bg-white/50">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} {reseller.brand_name}. Powered by Groovy.</p>
            </footer>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   SHARED: Pricing Section (used by Default template)
   ═══════════════════════════════════════════════════════════════ */
function PricingSection({ plans, reseller }) {
    return (
        <section className="px-6 pb-16 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-extrabold text-[#1a1a1a]">Pilih Paket Anda</h3>
                <p className="text-sm text-[#999] mt-2">Mulai gratis, upgrade kapan saja</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {(plans || []).map((plan, i) => {
                    const colors = planColors[plan.slug] || planColors.silver;
                    const isGold = plan.slug === 'gold';
                    return (
                        <div key={i} className={`relative rounded-2xl p-[2px] ${isGold ? 'bg-gradient-to-b from-amber-300 to-orange-400 shadow-xl shadow-amber-200/40' : 'bg-gradient-to-b from-gray-200 to-gray-300 hover:shadow-lg'} transition-all`}>
                            {isGold && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-full shadow-md">POPULER</span>
                                </div>
                            )}
                            <div className="bg-white rounded-[14px] p-6 h-full flex flex-col">
                                <div className="text-center mb-4">
                                    <span className={`inline-block px-4 py-1 rounded-full text-[11px] font-bold text-white tracking-wide ${colors.badge}`}>{plan.name}</span>
                                </div>
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-black text-gray-900">{plan.price > 0 ? formatCurrency(plan.price) : 'Gratis'}</div>
                                    {plan.duration_days > 0 && <div className="text-xs text-gray-400 mt-1">{plan.duration_days} hari</div>}
                                </div>
                                <div className="border-t border-gray-100 mb-4" />
                                <div className="space-y-2 mb-5 flex-1">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-700"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Max <strong className="mx-1">{plan.max_guests?.toLocaleString()}</strong> tamu</div>
                                    <div className="flex items-center gap-2 text-[13px] text-gray-700"><Icon d="M4.5 12.75l6 6 9-13.5" className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Max <strong className="mx-1">{plan.max_galleries}</strong> foto</div>
                                </div>
                                <Link href={`/register?ref=${reseller.ref}`} className={`w-full py-3 text-white rounded-xl text-sm font-bold bg-gradient-to-r ${colors.btn} hover:shadow-lg text-center transition-all`}>
                                    {plan.price > 0 ? 'Mulai Sekarang' : 'Daftar Gratis'}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — select template based on reseller.template
   ═══════════════════════════════════════════════════════════════ */
const TEMPLATES = {
    default: DefaultTemplate,
    elegant: ElegantTemplate,
    minimal: MinimalTemplate,
    colorful: ColorfulTemplate,
};

export default function ResellerLanding({ reseller, plans }) {
    const Template = TEMPLATES[reseller.template] || TEMPLATES.default;
    return (
        <>
            <Head title={`${reseller.brand_name} — Undangan Digital`} />
            <Template reseller={reseller} plans={plans} />
        </>
    );
}
