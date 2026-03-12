import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const defaultTemplate = `Assalamu'alaikum Warahmatullahi Wabarakatuh

Yth. Bapak/Ibu/Saudara/i *{nama}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dalam acara pernikahan kami.

Untuk informasi lebih lanjut, silakan kunjungi undangan digital kami di:
{link}

Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir.

Wassalamu'alaikum Warahmatullahi Wabarakatuh`;

export default function Tamu({ guests, maxGuests, rsvps, rsvpStats, wishes, allGuests, waLogs, invitation, liveUrl }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('tamu');
    const [showForm, setShowForm] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [excelUploading, setExcelUploading] = useState(false);

    // WA state
    const [selectedIds, setSelectedIds] = useState([]);
    const [template, setTemplate] = useState(defaultTemplate);
    const [sending, setSending] = useState(false);

    // Live Tamu state
    const [liveGuests, setLiveGuests] = useState([]);
    const [liveStats, setLiveStats] = useState({ checked_in: 0, total: 0 });
    const prevCountRef = useRef(0);
    const [liveNewGuest, setLiveNewGuest] = useState(null);
    const liveForm = useForm({
        live_delay: invitation?.live_delay ?? 3,
        live_counter: invitation?.live_counter ?? true,
        live_template: invitation?.live_template ?? 'elegant',
    });

    // Live polling
    useEffect(() => {
        if (activeTab !== 'live') return;
        const fetchData = async () => {
            try {
                const res = await fetch(route('live-tamu.data'));
                const d = await res.json();
                if (d.stats.checked_in > prevCountRef.current && prevCountRef.current > 0) {
                    const latest = d.guests[0];
                    if (latest) { setLiveNewGuest(latest); setTimeout(() => setLiveNewGuest(null), 4000); }
                }
                prevCountRef.current = d.stats.checked_in;
                setLiveGuests(d.guests);
                setLiveStats(d.stats);
            } catch (e) { console.error(e); }
        };
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [activeTab]);

    const handleLiveSave = (e) => {
        e.preventDefault();
        liveForm.post(route('live-tamu.save'), { preserveScroll: true });
    };

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editGuest, setEditGuest] = useState(null);

    const guestList = guests?.data || guests || [];
    const pagination = guests?.links;
    const totalGuests = guests?.total || guestList.length;
    const remaining = maxGuests - totalGuests;

    const rsvpList = rsvps || [];
    const wishList = wishes || [];
    const waGuestList = allGuests || [];
    const logList = waLogs || [];

    const unsentGuests = waGuestList.filter(g => g.phone && !g.wa_sent);
    const sentGuests = waGuestList.filter(g => g.wa_sent);

    // --- Guest form ---
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '', phone: '', group_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.tamu.save'), {
            preserveScroll: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus tamu ini?')) {
            router.delete(route('settings.tamu.delete', id), { preserveScroll: true });
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editGuest) return;
        router.post(route('settings.tamu.update', editGuest.id), {
            name: editGuest.name,
            phone: editGuest.phone || '',
            group_name: editGuest.group_name || '',
        }, {
            preserveScroll: true,
            onSuccess: () => { setShowEditModal(false); setEditGuest(null); },
        });
    };

    const handleImport = () => {
        const lines = importText.trim().split('\n').filter(l => l.trim());
        const guestsData = lines.map(line => {
            const parts = line.split(',').map(p => p.trim());
            return { name: parts[0] || '', phone: parts[1] || '', group_name: parts[2] || '' };
        }).filter(g => g.name);
        if (guestsData.length === 0) return;
        router.post(route('settings.tamu.import'), { guests: guestsData }, {
            preserveScroll: true,
            onSuccess: () => { setImportText(''); setShowImport(false); },
        });
    };

    const copyLink = (slug) => {
        const url = `${window.location.origin}/u/${slug}`;
        navigator.clipboard.writeText(url);
    };

    const openGuestLink = (guest) => {
        const slug = invitation?.slug || '';
        const url = `${window.location.origin}/u/${slug}?to=${encodeURIComponent(guest.slug)}`;
        window.open(url, '_blank');
    };

    const sendWaToGuest = (guest) => {
        if (!guest.phone) return;
        const slug = invitation?.slug || '';
        const link = `${window.location.origin}/u/${slug}?to=${encodeURIComponent(guest.slug)}`;
        const msg = template.replace('{nama}', guest.name).replace('{link}', link);
        const phone = guest.phone.replace(/^0/, '62').replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    // --- WA ---
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

    // --- Helpers ---
    const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const statusColors = {
        hadir: 'bg-emerald-100 text-emerald-700',
        tidak_hadir: 'bg-red-100 text-red-700',
        belum_pasti: 'bg-amber-100 text-amber-700',
    };
    const statusLabels = { hadir: 'Hadir', tidak_hadir: 'Tidak Hadir', belum_pasti: 'Belum Pasti' };

    const livePct = liveStats.total > 0 ? Math.round((liveStats.checked_in / liveStats.total) * 100) : 0;

    const tabs = [
        { key: 'tamu', label: 'Daftar', count: totalGuests },
        { key: 'rsvp', label: 'RSVP', count: rsvpList.length },
        { key: 'guestbook', label: 'Ucapan', count: wishList.length },
        { key: 'live', label: 'Live', count: liveStats.checked_in },
    ];

    return (
        <DashboardLayout title="Manajemen Tamu">
            <Head title="Tamu" />
            <div className="max-w-4xl mx-auto space-y-5">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                        {flash.success}
                    </div>
                )}

                {/* ═══ Summary Counters ═══ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                        <div className="text-xl font-bold text-gray-800">{totalGuests}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Total Tamu</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-3 text-center">
                        <div className="text-xl font-bold text-emerald-600">{rsvpStats?.hadir || 0}</div>
                        <div className="text-[10px] text-emerald-500 mt-0.5">RSVP Hadir</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
                        <div className="text-xl font-bold text-blue-600">{sentGuests.length}</div>
                        <div className="text-[10px] text-blue-500 mt-0.5">WA Terkirim</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl border border-purple-100 p-3 text-center">
                        <div className="text-xl font-bold text-purple-600">{wishList.length}</div>
                        <div className="text-[10px] text-purple-500 mt-0.5">Ucapan</div>
                    </div>
                </div>

                {/* ═══ Tab Bar ═══ */}
                <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-0.5">
                    {tabs.map(tab => (
                        <button key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}>
                            {tab.label}
                            <span className={`ml-1 text-[10px] ${activeTab === tab.key ? 'text-emerald-100' : 'text-gray-400'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* ═══ TAB: DAFTAR TAMU ═══ */}
                {activeTab === 'tamu' && (
                    <div className="space-y-4">
                        {/* Header with quota */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-gray-800">Daftar Tamu</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {totalGuests}/{maxGuests} tamu &bull; Sisa kuota: <strong className={remaining <= 5 ? 'text-amber-600' : 'text-emerald-600'}>{remaining}</strong>
                                </p>
                                <div className="w-48 h-1.5 bg-gray-100 rounded-full mt-2">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, (totalGuests / maxGuests) * 100)}%` }} />
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button onClick={() => setShowTemplateModal(true)}
                                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Template
                                </button>
                                <button onClick={() => { setShowForm(!showForm); setShowImport(false); }}
                                    className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
                                    + Tambah
                                </button>
                                <button onClick={() => { setShowImport(!showImport); setShowForm(false); }}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                                    Import
                                </button>
                            </div>
                        </div>

                        {/* Add Form */}
                        {showForm && (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-4">
                                <h4 className="font-bold text-gray-800 text-sm">Tambah Tamu Baru</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Nama Tamu *</label>
                                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nama lengkap/panggilan"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" required />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">No. WhatsApp</label>
                                        <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Grup / Kategori</label>
                                        <input type="text" value={data.group_name} onChange={(e) => setData('group_name', e.target.value)}
                                            placeholder="Contoh: Keluarga, Kantor"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={processing}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 disabled:opacity-50">
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)}
                                        className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Batal</button>
                                </div>
                            </form>
                        )}

                        {/* Import Panel */}
                        {showImport && (
                            <div className="bg-white rounded-2xl border border-blue-200 p-6 space-y-4">
                                <h4 className="font-bold text-gray-800 text-sm">Import Tamu</h4>

                                {/* Excel Import */}
                                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span className="text-sm font-semibold text-blue-800">Import dari Excel</span>
                                    </div>
                                    <p className="text-xs text-blue-600">Upload file Excel (.xlsx) dengan kolom: Nama, No HP</p>
                                    <div className="flex gap-2 flex-wrap">
                                        <a href={route('settings.tamu.template')} download
                                            className="px-4 py-2 bg-white border border-blue-200 rounded-xl text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors inline-flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            Download Template
                                        </a>
                                        <label className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer ${excelUploading ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            {excelUploading ? 'Mengupload...' : 'Upload Excel'}
                                            <input type="file" className="hidden" accept=".xlsx,.xls,.csv"
                                                disabled={excelUploading}
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    setExcelUploading(true);
                                                    router.post(route('settings.tamu.import.excel'), { file }, {
                                                        forceFormData: true,
                                                        preserveScroll: true,
                                                        onFinish: () => { setExcelUploading(false); e.target.value = ''; },
                                                        onSuccess: () => setShowImport(false),
                                                    });
                                                }} />
                                        </label>
                                    </div>
                                </div>

                                {/* Manual Text Import */}
                                <div className="border-t border-gray-200 pt-4">
                                    <p className="text-xs text-gray-500 mb-2">Atau import manual — Format: <code className="bg-gray-100 px-1 py-0.5 rounded">Nama, No HP, Grup</code> (satu baris per tamu)</p>
                                    <textarea value={importText} onChange={(e) => setImportText(e.target.value)}
                                        placeholder={"Ahmad Fadhil, 08123456789, Keluarga\nSiti Aisyah, 08987654321, Kantor"}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-300 resize-none font-mono" rows={4} />
                                    <div className="flex gap-2 mt-3">
                                        <button onClick={handleImport}
                                            className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600">
                                            Import {importText.trim().split('\n').filter(l => l.trim()).length} Tamu
                                        </button>
                                        <button onClick={() => setShowImport(false)}
                                            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Batal</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guest List */}
                        {guestList.length > 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-2 sm:px-4 py-2 font-semibold text-gray-600 text-xs">Nama</th>
                                                <th className="text-left px-2 sm:px-4 py-2 font-semibold text-gray-600 text-xs hidden sm:table-cell">No HP</th>
                                                <th className="text-left px-2 sm:px-4 py-2 font-semibold text-gray-600 text-xs hidden md:table-cell">Grup</th>
                                                <th className="text-center px-2 sm:px-4 py-2 font-semibold text-gray-600 text-xs">Status</th>
                                                <th className="text-center px-1 sm:px-4 py-2 font-semibold text-gray-600 text-xs">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {guestList.map((guest) => (
                                                <tr key={guest.id} className="hover:bg-gray-50">
                                                    <td className="px-2 sm:px-4 py-2">
                                                        <div className="font-medium text-gray-800 text-sm">{guest.name}</div>
                                                        <div className="text-[10px] text-gray-400 sm:hidden">{guest.phone || '-'}</div>
                                                    </td>
                                                    <td className="px-2 sm:px-4 py-2 text-gray-600 text-sm hidden sm:table-cell">{guest.phone || '-'}</td>
                                                    <td className="px-2 sm:px-4 py-2 text-gray-500 hidden md:table-cell">
                                                        {guest.group_name && (
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">{guest.group_name}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-4 py-2 text-center">
                                                        {guest.is_opened ? (
                                                            <span className="text-emerald-500 text-[10px] sm:text-xs font-medium">Dibuka</span>
                                                        ) : guest.wa_sent ? (
                                                            <span className="text-blue-500 text-[10px] sm:text-xs font-medium">Terkirim</span>
                                                        ) : (
                                                            <span className="text-gray-400 text-[10px] sm:text-xs">Belum</span>
                                                        )}
                                                    </td>
                                                    <td className="px-1 sm:px-4 py-2">
                                                        <div className="flex items-center justify-center gap-0.5 sm:gap-1.5">
                                                            <button onClick={() => openGuestLink(guest)} title="Buka"
                                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                            </button>
                                                            {guest.phone && (
                                                                <button onClick={() => sendWaToGuest(guest)} title="WA"
                                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-colors">
                                                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.66 0-3.203-.51-4.484-1.375l-.316-.188-2.875.852.852-2.875-.188-.316A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" /></svg>
                                                                </button>
                                                            )}
                                                            <button onClick={() => { setEditGuest(guest); setShowEditModal(true); }} title="Edit"
                                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-colors">
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            </button>
                                                            <button onClick={() => handleDelete(guest.id)} title="Hapus"
                                                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                <div className="text-gray-500 font-medium">Belum ada tamu</div>
                                <div className="text-gray-400 text-sm mt-1">Tambahkan tamu pertama Anda</div>
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
                )}

                {/* ═══ TAB: RSVP ═══ */}
                {activeTab === 'rsvp' && (
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-emerald-50 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-emerald-600">{rsvpStats?.hadir || 0}</div>
                                <div className="text-xs text-emerald-500 mt-1 font-medium">Total Hadir</div>
                            </div>
                            <div className="bg-red-50 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-red-600">{rsvpStats?.tidak_hadir || 0}</div>
                                <div className="text-xs text-red-500 mt-1 font-medium">Tidak Hadir</div>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-amber-600">{rsvpStats?.belum_pasti || 0}</div>
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
                                <div className="text-gray-500 font-medium">Belum ada RSVP</div>
                                <div className="text-gray-400 text-sm mt-1">RSVP dari tamu akan muncul setelah undangan dibuka</div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ TAB: GUESTBOOK ═══ */}
                {activeTab === 'guestbook' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{wishList.length}</div>
                                <div className="text-xs text-gray-500 mt-1">Total Ucapan</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-600">
                                    {wishList.filter(w => w.guest?.name).length}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Dari Tamu Terdaftar</div>
                            </div>
                        </div>

                        {wishList.length > 0 ? (
                            <div className="space-y-3">
                                {wishList.map((wish) => (
                                    <div key={wish.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {(wish.sender_name || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 text-sm">{wish.sender_name}</div>
                                                    <div className="text-xs text-gray-400">{formatDate(wish.created_at)}</div>
                                                </div>
                                            </div>
                                            {wish.guest?.name && (
                                                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                                                    Tamu Terdaftar
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {wish.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                <div className="text-gray-500 font-medium">Belum ada ucapan</div>
                                <div className="text-gray-400 text-sm mt-1">Ucapan dari tamu akan muncul di sini setelah undangan Anda dibuka</div>
                            </div>
                        )}
                    </div>
                )}
                {/* ═══ TAB: LIVE TAMU ═══ */}
                {activeTab === 'live' && (
                    <div className="space-y-5">
                        {/* Live Link */}
                        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 text-white">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold">Halaman Live Tamu</h3>
                                    <p className="text-white/50 text-sm mt-1">Buka halaman fullscreen untuk menampilkan tamu yang hadir secara realtime</p>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-xs text-emerald-300 font-semibold">Live</span>
                                </div>
                            </div>
                            {liveUrl && (
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/70 truncate border border-white/10">{liveUrl}</div>
                                    <button onClick={() => navigator.clipboard.writeText(liveUrl)}
                                        className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all border border-white/10">Salin</button>
                                    <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                                        className="px-5 py-3 bg-[#E5654B] hover:bg-[#d4523a] rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#E5654B]/25 whitespace-nowrap">Buka Fullscreen →</a>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-emerald-600">{liveStats.checked_in}</div>
                                <div className="text-xs text-gray-500 mt-1">Sudah Hadir</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-gray-700">{liveStats.total}</div>
                                <div className="text-xs text-gray-500 mt-1">Total Tamu</div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{livePct}%</div>
                                <div className="text-xs text-gray-500 mt-1">Kehadiran</div>
                            </div>
                        </div>

                        {/* New Guest Alert */}
                        {liveNewGuest && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                                <span className="text-2xl"><svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></span>
                                <div>
                                    <div className="font-bold text-emerald-800">{liveNewGuest.name} baru saja hadir!</div>
                                    <div className="text-xs text-emerald-600 mt-0.5">Check-in berhasil</div>
                                </div>
                            </div>
                        )}

                        {/* Settings */}
                        <form onSubmit={handleLiveSave} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">Pengaturan Live Tamu</h4>
                                <p className="text-xs text-gray-400 mt-0.5">Atur tampilan halaman live tamu</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Delay Tampilan (detik)</label>
                                <input type="number" min="1" max="30" value={liveForm.data.live_delay}
                                    onChange={(e) => liveForm.setData('live_delay', parseInt(e.target.value) || 3)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mt-1 focus:ring-2 focus:ring-emerald-300" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-gray-700">Tampilkan Counter</div>
                                    <div className="text-xs text-gray-400">Jumlah tamu hadir di halaman live</div>
                                </div>
                                <button type="button" onClick={() => liveForm.setData('live_counter', !liveForm.data.live_counter)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${liveForm.data.live_counter ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${liveForm.data.live_counter ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Template Live</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ value: 'elegant', label: 'Elegant', preview: 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]' },
                                    { value: 'celebration', label: 'Celebration', preview: 'bg-gradient-to-br from-[#E5654B] to-[#ff7b5e]' }].map(t => (
                                        <button key={t.value} type="button"
                                            onClick={() => liveForm.setData('live_template', t.value)}
                                            className={`p-4 rounded-xl border-2 transition-all ${liveForm.data.live_template === t.value ? 'border-emerald-500 shadow-sm' : 'border-gray-200'}`}>
                                            <div className={`h-16 rounded-lg ${t.preview} mb-2`} />
                                            <div className="text-sm font-medium text-gray-800">{t.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" disabled={liveForm.processing}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                                {liveForm.processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </form>

                        {/* Recent Check-ins */}
                        {liveGuests.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h4 className="text-sm font-bold text-gray-800 mb-3">Tamu Terbaru Check-in</h4>
                                <div className="space-y-2">
                                    {liveGuests.slice(0, 10).map((g, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-600">
                                                    {g.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{g.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-400">{g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* ═══ EDIT GUEST MODAL ═══ */}
                {showEditModal && editGuest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(e) => { if (e.target === e.currentTarget) { setShowEditModal(false); setEditGuest(null); } }}>
                        <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">Edit Tamu</h3>
                                <button type="button" onClick={() => { setShowEditModal(false); setEditGuest(null); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Nama *</label>
                                <input type="text" value={editGuest.name} onChange={(e) => setEditGuest({ ...editGuest, name: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">No. WhatsApp</label>
                                <input type="text" value={editGuest.phone || ''} onChange={(e) => setEditGuest({ ...editGuest, phone: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Grup</label>
                                    <input type="text" value={editGuest.group_name || ''} onChange={(e) => setEditGuest({ ...editGuest, group_name: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-300" />
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600">Simpan</button>
                                <button type="button" onClick={() => { setShowEditModal(false); setEditGuest(null); }}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">Batal</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ═══ TEMPLATE PESAN MODAL ═══ */}
                {showTemplateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowTemplateModal(false); }}>
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">Template Pesan WA</h3>
                                <button onClick={() => setShowTemplateModal(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">
                                Gunakan <code className="bg-gray-100 px-1 rounded">{'{nama}'}</code> untuk nama tamu dan <code className="bg-gray-100 px-1 rounded">{'{link}'}</code> untuk link undangan
                            </p>
                            <textarea value={template} onChange={(e) => setTemplate(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 resize-none font-mono" rows={12} />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setTemplate(defaultTemplate)}
                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200">
                                    Reset Default
                                </button>
                                <button onClick={() => setShowTemplateModal(false)}
                                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600">
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
