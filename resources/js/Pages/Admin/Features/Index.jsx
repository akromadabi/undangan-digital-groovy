import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ features }) {
    const [editId, setEditId] = useState(null);
    const { data, setData, post, put, processing, reset } = useForm({ name: '', slug: '', category: 'content', description: '', icon: '' });

    const openEdit = (f) => { setEditId(f.id); setData({ name: f.name, slug: f.slug, category: f.category, description: f.description || '', icon: f.icon || '' }); };
    const cancelEdit = () => { setEditId(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) { put(`/admin/features/${editId}`, { onSuccess: cancelEdit }); }
        else { post('/admin/features', { onSuccess: () => reset() }); }
    };

    const handleDelete = (id) => { if (confirm('Hapus fitur?')) router.delete(`/admin/features/${id}`); };

    const categoryColors = { content: 'bg-blue-50 text-blue-600', settings: 'bg-emerald-50 text-emerald-600', other: 'bg-[#f0ede8] text-[#777]' };
    const inputClass = 'bg-white border border-[#e8e5e0] rounded-xl px-3 py-2.5 text-sm text-[#333] placeholder-[#bbb] focus:border-[#E5654B] focus:ring-1 focus:ring-[#E5654B]';

    return (
        <AdminLayout title="Manajemen Fitur">
            <Head title="Admin - Features" />
            <div className="max-w-3xl space-y-6">
                {/* Add/Edit Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
                    <h4 className="font-bold text-[#1a1a1a] text-sm mb-3">{editId ? '✏️ Edit Fitur' : '+ Tambah Fitur'}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Nama"
                            className={inputClass} required />
                        <input type="text" value={data.slug} onChange={(e) => setData('slug', e.target.value)} placeholder="slug" disabled={!!editId}
                            className={`${inputClass} disabled:opacity-50 disabled:bg-[#f8f7f4]`} required={!editId} />
                        <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                            className={inputClass}>
                            <option value="content">Content</option><option value="settings">Settings</option><option value="other">Other</option>
                        </select>
                        <div className="flex gap-2">
                            <button type="submit" disabled={processing}
                                className="flex-1 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#c94f3a] disabled:opacity-50 transition-colors">
                                {editId ? 'Update' : 'Tambah'}
                            </button>
                            {editId && <button type="button" onClick={cancelEdit} className="px-3 bg-[#f0ede8] text-[#777] rounded-xl text-sm font-medium hover:bg-[#e8e5e0]">×</button>}
                        </div>
                    </div>
                </form>

                {/* Feature List */}
                <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#f8f7f4]">
                            <tr>
                                <th className="text-left px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Nama</th>
                                <th className="text-left px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Slug</th>
                                <th className="text-center px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Kategori</th>
                                <th className="text-center px-5 py-3.5 text-[#999] font-semibold text-xs tracking-wide">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0ede8]">
                            {features?.map(f => (
                                <tr key={f.id} className="hover:bg-[#faf9f6] transition-colors">
                                    <td className="px-5 py-3.5 text-[#333] font-medium">{f.name}</td>
                                    <td className="px-5 py-3.5 text-[#999] font-mono text-xs">{f.slug}</td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[f.category]}`}>{f.category}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center space-x-3">
                                        <button onClick={() => openEdit(f)} className="text-[#E5654B] text-xs hover:underline font-semibold">Edit</button>
                                        <button onClick={() => handleDelete(f.id)} className="text-red-500 text-xs hover:underline font-semibold">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
