import { Head, useForm, usePage, router } from '@inertiajs/react';
import DynamicAdminLayout from '@/Layouts/DynamicAdminLayout';
import { useState } from 'react';

const religionLabels = { islam: '☪️ Islam', kristen: '✝️ Kristen', hindu: '🕉️ Hindu', buddha: '☸️ Buddha', umum: '🌐 Umum' };

export default function Quotes({ quotes }) {
    const { flash, adminRoutePrefix } = usePage().props;
    const [filter, setFilter] = useState('all');
    const [editing, setEditing] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

    const addForm = useForm({ religion: 'islam', title: '', ayat: '', translation: '', source: '' });
    const editForm = useForm({ religion: '', title: '', ayat: '', translation: '', source: '', is_active: true });

    const filtered = filter === 'all' ? quotes : quotes.filter(q => q.religion === filter);

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(`${adminRoutePrefix}/quotes`, {
            onSuccess: () => { addForm.reset(); setShowAdd(false); },
        });
    };

    const startEdit = (q) => {
        setEditing(q.id);
        editForm.setData({ religion: q.religion, title: q.title, ayat: q.ayat || '', translation: q.translation || '', source: q.source || '', is_active: q.is_active });
    };

    const handleEdit = (e) => {
        e.preventDefault();
        editForm.put(`${adminRoutePrefix}/quotes/${editing}`, {
            onSuccess: () => setEditing(null),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Hapus template kutipan ini?')) {
            router.delete(`${adminRoutePrefix}/quotes/${id}`);
        }
    };

    return (
        <DynamicAdminLayout>
            <Head title="Template Kutipan" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Template Kutipan</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola template ayat dan kutipan untuk undangan</p>
                    </div>
                    <button onClick={() => setShowAdd(!showAdd)}
                        className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Kutipan
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                {/* Add Form */}
                {showAdd && (
                    <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                        <h3 className="font-semibold text-gray-800">Tambah Template Baru</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Agama</label>
                                <select value={addForm.data.religion} onChange={(e) => addForm.setData('religion', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm">
                                    {Object.entries(religionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Judul</label>
                                <input type="text" value={addForm.data.title} onChange={(e) => addForm.setData('title', e.target.value)}
                                    placeholder="Contoh: QS. Ar-Rum: 21" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{addForm.data.religion === 'islam' ? 'Teks Arab' : 'Kutipan'}</label>
                            <textarea value={addForm.data.ayat} onChange={(e) => addForm.setData('ayat', e.target.value)}
                                rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none"
                                dir={addForm.data.religion === 'islam' ? 'rtl' : 'auto'} />
                        </div>
                        {addForm.data.religion === 'islam' && (
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Terjemahan</label>
                                <textarea value={addForm.data.translation} onChange={(e) => addForm.setData('translation', e.target.value)}
                                    rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Sumber</label>
                            <input type="text" value={addForm.data.source} onChange={(e) => addForm.setData('source', e.target.value)}
                                placeholder="Contoh: QS. Ar-Rum: 21" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" disabled={addForm.processing}
                                className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Simpan</button>
                            <button type="button" onClick={() => setShowAdd(false)}
                                className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">Batal</button>
                        </div>
                    </form>
                )}

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        Semua ({quotes.length})
                    </button>
                    {Object.entries(religionLabels).map(([k, v]) => {
                        const count = quotes.filter(q => q.religion === k).length;
                        return (
                            <button key={k} onClick={() => setFilter(k)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === k ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {v} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Quote List */}
                <div className="space-y-3">
                    {filtered.map(q => (
                        <div key={q.id} className={`bg-white rounded-2xl border p-5 ${q.is_active ? 'border-gray-200' : 'border-red-200 opacity-60'}`}>
                            {editing === q.id ? (
                                <form onSubmit={handleEdit} className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <select value={editForm.data.religion} onChange={(e) => editForm.setData('religion', e.target.value)}
                                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm">
                                            {Object.entries(religionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                        </select>
                                        <input type="text" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)}
                                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Judul" />
                                    </div>
                                    <textarea value={editForm.data.ayat} onChange={(e) => editForm.setData('ayat', e.target.value)}
                                        rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none"
                                        dir={editForm.data.religion === 'islam' ? 'rtl' : 'auto'} placeholder="Teks ayat/kutipan" />
                                    {editForm.data.religion === 'islam' && (
                                        <textarea value={editForm.data.translation} onChange={(e) => editForm.setData('translation', e.target.value)}
                                            rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none" placeholder="Terjemahan" />
                                    )}
                                    <input type="text" value={editForm.data.source} onChange={(e) => editForm.setData('source', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Sumber" />
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={editForm.data.is_active} onChange={(e) => editForm.setData('is_active', e.target.checked)} className="rounded" />
                                            Aktif
                                        </label>
                                        <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold">Simpan</button>
                                        <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs">Batal</button>
                                    </div>
                                </form>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{religionLabels[q.religion] || q.religion}</span>
                                            <span className="font-semibold text-gray-800 text-sm">{q.title}</span>
                                            {!q.is_active && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Nonaktif</span>}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => startEdit(q)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-blue-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(q.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed" dir={q.religion === 'islam' ? 'rtl' : 'auto'}>{q.ayat}</p>
                                    {q.translation && <p className="text-xs text-gray-500 italic mt-1">"{q.translation}"</p>}
                                    {q.source && <p className="text-[10px] text-gray-400 mt-1">— {q.source}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-gray-400 text-sm">Belum ada template kutipan untuk kategori ini.</div>
                    )}
                </div>
            </div>
        </DynamicAdminLayout>
    );
}
