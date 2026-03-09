import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const defaultTemplate = `Assalamu'alaikum Warahmatullahi Wabarakatuh

Yth. Bapak/Ibu/Saudara/i *{nama}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dalam acara pernikahan kami.

Untuk informasi lebih lanjut, silakan kunjungi undangan digital kami di:
{link}

Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`;

export default function Whatsapp({ guests, logs }) {
    const { flash } = usePage().props;
    const [selectedIds, setSelectedIds] = useState([]);
    const [template, setTemplate] = useState(defaultTemplate);
    const [sending, setSending] = useState(false);

    const guestList = guests || [];
    const logList = logs || [];

    const unsentGuests = guestList.filter(g => g.phone && !g.wa_sent);
    const sentGuests = guestList.filter(g => g.wa_sent);

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        if (selectedIds.length === unsentGuests.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(unsentGuests.map(g => g.id));
        }
    };

    const handleSend = () => {
        if (selectedIds.length === 0) return;
        setSending(true);
        router.post(route('settings.whatsapp.send'), {
            guest_ids: selectedIds,
            message_template: template,
        }, {
            preserveScroll: true,
            onFinish: () => setSending(false),
        });
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'sent': return '✅';
            case 'failed': return '❌';
            case 'pending': return '⏳';
            default: return '📤';
        }
    };

    return (
        <DashboardLayout title="Kirim WhatsApp">
            <Head title="WhatsApp" />
            <div className="max-w-3xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-600">{sentGuests.length}</div>
                        <div className="text-xs text-emerald-500 mt-1">Terkirim</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-amber-600">{unsentGuests.length}</div>
                        <div className="text-xs text-amber-500 mt-1">Belum Kirim</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gray-600">{guestList.filter(g => !g.phone).length}</div>
                        <div className="text-xs text-gray-500 mt-1">Tanpa HP</div>
                    </div>
                </div>

                {/* Message Template */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-800 text-sm mb-3">📝 Template Pesan</h3>
                    <p className="text-xs text-gray-400 mb-2">
                        Gunakan <code className="bg-gray-100 px-1 rounded">{'{nama}'}</code> untuk nama tamu dan <code className="bg-gray-100 px-1 rounded">{'{link}'}</code> untuk link undangan
                    </p>
                    <textarea value={template} onChange={(e) => setTemplate(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 resize-none font-mono" rows={10} />
                </div>

                {/* Guest Selection */}
                {unsentGuests.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 text-sm">Pilih Penerima ({selectedIds.length} dipilih)</h3>
                            <button onClick={selectAll} className="text-xs text-emerald-600 hover:underline font-medium">
                                {selectedIds.length === unsentGuests.length ? 'Batal Semua' : 'Pilih Semua'}
                            </button>
                        </div>

                        <div className="space-y-1.5 max-h-60 overflow-y-auto">
                            {unsentGuests.map(guest => (
                                <label key={guest.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedIds.includes(guest.id) ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 hover:bg-gray-100'
                                        }`}>
                                    <input type="checkbox" checked={selectedIds.includes(guest.id)}
                                        onChange={() => toggleSelect(guest.id)} className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-300" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800 text-sm">{guest.name}</div>
                                        <div className="text-xs text-gray-400">{guest.phone}</div>
                                    </div>
                                    {guest.group_name && (
                                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">{guest.group_name}</span>
                                    )}
                                </label>
                            ))}
                        </div>

                        <button onClick={handleSend} disabled={sending || selectedIds.length === 0}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {sending ? '⏳ Mengirim...' : `💬 Kirim ke ${selectedIds.length} Tamu`}
                        </button>
                    </div>
                )}

                {/* Sending Logs */}
                {logList.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-800 text-sm mb-3">📋 Riwayat Pengiriman</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {logList.map((log) => (
                                <div key={log.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 text-sm">
                                    <span>{statusIcon(log.status)}</span>
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-700">{log.guest?.name || log.phone}</span>
                                        <span className="text-gray-400 ml-2 text-xs">{log.phone}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {log.sent_at && new Date(log.sent_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
