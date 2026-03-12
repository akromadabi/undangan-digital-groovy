import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const featureRoutes = {
    cover: '/theme',
    opening: '/content/teks-sambutan',
    bride_groom: '/content/mempelai',
    event: '/content/acara',
    gallery: '/content/galeri',
    love_story: '/content/kisah',
    gift: '/settings/hadiah',
    bank: '/content/bank',
    music: '/settings/musik',
    guestbook: '/content/guestbook',
    guest: '/settings/tamu',
    rsvp: '/settings/rsvp',
    save_the_date: '/content/save-the-date',
    turut_mengundang: '/content/turut-undang',
    bride_groom_detail: '/content/mempelai',
    whatsapp: '/settings/whatsapp',
    template: '/theme',
    closing: '/content/teks-sambutan',
};

// ── SVG Icon Component ──
const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.5 }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{typeof d === 'string' ? <path d={d} /> : d}</svg>
);

// ── Feature icons (SVG paths) ──
const featureIcons = {
    opening: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z',
    bride_groom: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    event: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    gallery: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25z',
    love_story: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
    bank: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
    closing: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    guestbook: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    save_the_date: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z',
    turut_mengundang: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    bride_groom_detail: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    cover: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
    guest: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    rsvp: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    music: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
    gift: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
    whatsapp: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
    template: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
};

// Feature color map for icons
const featureColors = {
    opening: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    bride_groom: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-100' },
    event: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    gallery: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
    love_story: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    bank: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    closing: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
    guestbook: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    save_the_date: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100' },
    turut_mengundang: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
    bride_groom_detail: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600', border: 'border-fuchsia-100' },
    cover: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
    guest: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' },
    rsvp: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    music: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
    gift: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
    whatsapp: { bg: 'bg-lime-50', text: 'text-lime-600', border: 'border-lime-100' },
    template: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
};

// ── Mini Bar Chart ──
const MiniBar = ({ value, max, color }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div className="w-full h-1.5 rounded-full bg-gray-100 mt-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
    );
};

export default function Index({ invitation, stats, features, subscription, latestWishes }) {
    const { appName } = usePage().props;

    const totalRsvp = (stats?.rsvp_hadir || 0) + (stats?.rsvp_tidak || 0);
    const openRate = stats?.total_guests > 0 ? Math.round((stats.total_opened / stats.total_guests) * 100) : 0;

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-4">
                {/* ═══ Welcome Card ═══ */}
                <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
                    <div className="absolute -bottom-8 -right-12 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute top-8 right-24 w-16 h-16 rounded-full bg-white/5" />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
                                    <Icon d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" className="w-4.5 h-4.5 text-white" />
                                </div>
                                <h2 className="text-base lg:text-xl font-bold">{invitation?.title || 'Selamat Datang'}</h2>
                            </div>
                            <p className="text-emerald-100 text-sm mt-1 flex items-center gap-1.5">
                                <Icon d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-6.364-6.364L4.5 8.5" className="w-3.5 h-3.5 flex-shrink-0" />
                                {invitation?.slug ? (
                                    <span className="truncate">{window.location.origin}/u/{invitation.slug}</span>
                                ) : (
                                    'Undangan digital Anda belum dibuat'
                                )}
                            </p>
                            {subscription && (
                                <span className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-semibold ${subscription.plan_slug === 'free' ? 'bg-white/15 text-white backdrop-blur-sm' : 'bg-white text-emerald-700'}`}>
                                    {subscription.status === 'active' ? (
                                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
                                    ) : (
                                        <Icon d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" className="w-3.5 h-3.5" />
                                    )}
                                    {subscription.plan_name}
                                    {subscription.expires_at && ` · s/d ${subscription.expires_at}`}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {invitation?.slug && (
                                <a href={`/u/${invitation.slug}`} target="_blank" className="px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-all backdrop-blur-sm inline-flex items-center gap-2">
                                    <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                    Preview
                                </a>
                            )}
                            <Link href="/profile" className="px-4 py-2.5 bg-white text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-all inline-flex items-center gap-2 shadow-sm">
                                <Icon d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4" />
                                Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ═══ Upgrade Banner ═══ */}
                {subscription?.plan_slug === 'free' && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                                <Icon d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold text-amber-800 text-sm">Upgrade ke Premium</div>
                                <div className="text-amber-600 text-xs">Dapatkan akses penuh ke fitur premium mulai dari Rp49.000</div>
                            </div>
                        </div>
                        <Link href="/pricing" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all whitespace-nowrap inline-flex items-center gap-1.5">
                            Upgrade Now
                            <Icon d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" className="w-4 h-4" />
                        </Link>
                    </div>
                )}

                {/* ═══ Stats Overview ═══ */}
                {stats && Object.keys(stats).length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Icon d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" className="w-4 h-4" />
                            Statistik
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                            {/* Total Tamu */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Icon d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{openRate}% buka</span>
                                </div>
                                <div className="text-xl font-bold text-gray-800">{stats.total_guests || 0}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Total Tamu</div>
                                <MiniBar value={stats.total_opened || 0} max={stats.total_guests || 1} color="#3b82f6" />
                            </div>

                            {/* RSVP Hadir */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <Icon d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    {totalRsvp > 0 && (
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            {Math.round(((stats.rsvp_hadir || 0) / totalRsvp) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className="text-xl font-bold text-gray-800">{stats.rsvp_hadir || 0}</div>
                                <div className="text-xs text-gray-500 mt-0.5">RSVP Hadir</div>
                                <MiniBar value={stats.rsvp_hadir || 0} max={totalRsvp || 1} color="#10b981" />
                            </div>

                            {/* Tidak Hadir */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                                        <Icon d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" className="w-4 h-4 text-red-500" />
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-800">{stats.rsvp_tidak || 0}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Tidak Hadir</div>
                                <MiniBar value={stats.rsvp_tidak || 0} max={totalRsvp || 1} color="#ef4444" />
                            </div>

                            {/* Ucapan */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                                        <Icon d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-4 h-4 text-purple-600" />
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-800">{stats.total_wishes || 0}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Ucapan</div>
                            </div>

                            {/* Dibuka */}
                            <div className="bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                        <Icon d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4 text-amber-600" />
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-gray-800">{stats.total_opened || 0}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Dibuka</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══ Ucapan Terbaru ═══ */}
                {latestWishes?.length > 0 && (
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Icon d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" className="w-4 h-4 text-indigo-600" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700">Ucapan Terbaru</h3>
                            </div>
                            <Link href="/content/guestbook" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center gap-1">
                                Lihat Semua
                                <Icon d="M8.25 4.5l7.5 7.5-7.5 7.5" className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {latestWishes.slice(0, 3).map((wish, i) => (
                                <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                        {wish.sender_name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-gray-800">{wish.sender_name}</div>
                                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{wish.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ Menu Cepat ═══ */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Icon d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" className="w-4 h-4" />
                        Menu Cepat
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                        {features?.map((feature) => {
                            const colors = featureColors[feature.slug] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-100' };
                            const iconPath = featureIcons[feature.slug] || 'M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z';
                            return (
                                <Link
                                    key={feature.id}
                                    href={feature.is_locked ? '#' : (featureRoutes[feature.slug] || '/dashboard')}
                                    onClick={feature.is_locked ? (e) => e.preventDefault() : undefined}
                                    className={`group relative p-2.5 rounded-xl text-center transition-all duration-200 ${feature.is_locked
                                        ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                        : `bg-white border border-gray-100 text-gray-700 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1`
                                        }`}
                                >
                                    {feature.is_locked && (
                                        <div className="absolute top-1.5 right-1.5">
                                            <Icon d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" className="w-3 h-3 text-amber-400" />
                                        </div>
                                    )}
                                    <div className={`w-9 h-9 rounded-lg ${feature.is_locked ? 'bg-gray-100' : colors.bg} flex items-center justify-center mx-auto mb-1.5 transition-transform duration-200 group-hover:scale-110`}>
                                        <Icon d={iconPath} className={`w-4.5 h-4.5 ${feature.is_locked ? 'text-gray-400' : colors.text}`} />
                                    </div>
                                    <div className="text-[10px] font-medium leading-tight">{feature.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
