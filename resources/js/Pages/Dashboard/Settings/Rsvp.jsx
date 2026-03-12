import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Rsvp({ rsvps, stats }) {
    const { flash } = usePage().props;

    const rsvpList = rsvps?.data || rsvps || [];
    const pagination = rsvps?.links;

    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusColors = {
        hadir: 'bg-emerald-100 text-emerald-700',
        tidak_hadir: 'bg-red-100 text-red-700',
        belum_pasti: 'bg-amber-100 text-amber-700',
    };

    const statusLabels = { hadir: 'Hadir', tidak_hadir: 'Tidak Hadir', belum_pasti: 'Belum Pasti' };

    return (
        <DashboardLayout title="RSVP">
            <Head title="RSVP" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-600">{stats?.hadir || 0}</div>
                        <div className="text-xs text-emerald-500 mt-1 font-medium"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Total Hadir</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-red-600">{stats?.tidak_hadir || 0}</div>
                        <div className="text-xs text-red-500 mt-1 font-medium">Tidak Hadir</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-amber-600">{stats?.belum_pasti || 0}</div>
                        <div className="text-xs text-amber-500 mt-1 font-medium">Belum Pasti</div>
                    </div>
                </div>

                {/* RSVP List */}
                {rsvpList.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-semibold text-gray-600">Nama Tamu</th>
                                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                                        <th className="text-center px-4 py-3 font-semibold text-gray-600">Jumlah</th>
                                        <th className="text-right px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rsvpList.map((rsvp) => (
                                        <tr key={rsvp.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">
                                                        {(rsvp.guest?.name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-800">{rsvp.guest?.name || 'Tamu Anonim'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[rsvp.attendance]}`}>
                                                    {statusLabels[rsvp.attendance]}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-gray-700">
                                                {rsvp.number_of_guests || 1} orang
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs text-gray-400 hidden sm:table-cell">
                                                {formatDate(rsvp.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="text-5xl mb-3"><svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                        <div className="text-gray-500 font-medium">Belum ada RSVP</div>
                        <div className="text-gray-400 text-sm mt-1">RSVP dari tamu akan muncul setelah undangan dibuka</div>
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {pagination.map((link, i) => (
                            <button key={i}
                                onClick={() => link.url && router.get(link.url, {}, { preserveScroll: true })}
                                disabled={!link.url}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
