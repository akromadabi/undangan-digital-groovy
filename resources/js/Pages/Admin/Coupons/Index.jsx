import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import DateRangePickerModal from '@/Components/DateRangePickerModal';
import {
    Ticket, Plus, Edit2, Trash2, CheckCircle, AlertCircle, Info, Calendar, Percent, Tag, ShieldCheck, ShieldAlert
} from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);
const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatRupiah = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const clean = String(value).replace(/\D/g, '');
    if (!clean) return '';
    return 'Rp. ' + new Intl.NumberFormat('id-ID').format(parseInt(clean, 10));
};

export default function CouponsIndex({ coupons }) {
    const { flash } = usePage().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [datePickerTarget, setDatePickerTarget] = useState('add');

    const openDatePicker = (target) => {
        setDatePickerTarget(target);
        setIsDatePickerOpen(true);
    };

    const handleDateRangeApply = (startsAt, expiresAt) => {
        if (datePickerTarget === 'add') {
            addForm.setData(data => ({
                ...data,
                starts_at: startsAt,
                expires_at: expiresAt
            }));
        } else {
            editForm.setData(data => ({
                ...data,
                starts_at: startsAt,
                expires_at: expiresAt
            }));
        }
    };

    const addForm = useForm({
        code: '',
        discount_type: 'fixed',
        discount_value: '',
        min_purchase: '0',
        max_discount: '',
        starts_at: '',
        expires_at: '',
        usage_limit: '',
        is_active: true,
    });

    const editForm = useForm({
        code: '',
        discount_type: 'fixed',
        discount_value: '',
        min_purchase: '0',
        max_discount: '',
        starts_at: '',
        expires_at: '',
        usage_limit: '',
        is_active: true,
    });

    const openAddModal = () => {
        addForm.reset();
        setIsAddModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/coupons', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addForm.reset();
            },
        });
    };

    const openEditModal = (coupon) => {
        setSelectedCoupon(coupon);
        editForm.setData({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: Number(coupon.discount_value),
            min_purchase: Number(coupon.min_purchase),
            max_discount: coupon.max_discount !== null ? Number(coupon.max_discount) : '',
            starts_at: coupon.starts_at ? coupon.starts_at.slice(0, 16) : '',
            expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
            usage_limit: coupon.usage_limit !== null ? coupon.usage_limit : '',
            is_active: Boolean(coupon.is_active),
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(`/admin/coupons/${selectedCoupon.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
            },
        });
    };

    const handleDelete = (couponId) => {
        if (confirm('Apakah Anda yakin ingin menghapus kupon ini?')) {
            router.delete(`/admin/coupons/${couponId}`);
        }
    };

    const handleToggleActive = (couponId) => {
        router.post(`/admin/coupons/${couponId}/toggle`);
    };

    return (
        <AdminLayout title="Manajemen Kupon Diskon">
            <Head title="Manajemen Kupon Diskon" />
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                            <Ticket size={22} className="text-[#E5654B]" /> Kupon Diskon Reseller
                        </h2>
                        <p className="text-[#999] text-sm mt-1">
                            Kelola kupon potongan harga untuk menarik lebih banyak pembeli melakukan upgrade.
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d0533b] shadow-sm transition-all flex-shrink-0"
                    >
                        <Plus size={16} /> Tambah Kupon Baru
                    </button>
                </div>

                {/* Notifications */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <CheckCircle size={16} /> {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle size={16} /> {flash.error}
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 leading-relaxed">
                        <strong>Tips Kupon:</strong> Kupon dapat digunakan oleh pelanggan saat berada di halaman checkout. Diskon potongan dapat berupa nominal tetap (Rupiah) atau persentase (%). Pastikan masa aktif kupon sesuai dengan tanggal dimulainya promosi Anda.
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e8e5e0] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#f0ede8] bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Kode Kupon</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Tipe & Nilai Potongan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Min. Pembelian</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Masa Berlaku</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Penggunaan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-[#999] tracking-wider uppercase text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0ede8] text-[13.5px]">
                                {coupons.length > 0 ? (
                                    coupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-gray-50/40 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-gray-800 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                                                        {coupon.code}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {coupon.discount_type === 'percentage' ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Percent size={14} className="text-gray-400" />
                                                        <span>{coupon.discount_value}%</span>
                                                        {coupon.max_discount && (
                                                            <span className="text-xs text-gray-400 font-normal">
                                                                (Maks. {formatCurrency(coupon.max_discount)})
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span>{formatCurrency(coupon.discount_value)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {coupon.min_purchase > 0 ? formatCurrency(coupon.min_purchase) : 'Tanpa Min.'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex flex-col gap-0.5 text-xs">
                                                    <span>Mulai: {formatDate(coupon.starts_at)}</span>
                                                    <span>Hingga: {formatDate(coupon.expires_at)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold text-gray-700">
                                                        {coupon.used_count}x digunakan
                                                    </span>
                                                    {coupon.usage_limit && (
                                                        <span className="text-[11px] text-gray-400">
                                                            (Batas kuota: {coupon.usage_limit})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleActive(coupon.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-colors ${
                                                        coupon.is_active
                                                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                                            : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                                    }`}
                                                >
                                                    {coupon.is_active ? (
                                                        <>
                                                            <ShieldCheck size={12} />
                                                            <span>Aktif</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldAlert size={12} />
                                                            <span>Mati</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openEditModal(coupon)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Ubah Kupon"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus Kupon"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-400 text-xs">
                                            Belum ada kupon diskon. Klik tombol "Tambah Kupon Baru" untuk membuat kupon pertama Anda.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Tambah Kupon */}
            {isAddModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <h3 className="font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                                <Ticket size={18} className="text-[#E5654B]" /> Tambah Kupon Baru
                            </h3>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kode Kupon</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: DISKON10"
                                    value={addForm.data.code}
                                    onChange={e => addForm.setData('code', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B] uppercase font-mono font-bold"
                                />
                                {addForm.errors.code && <p className="text-red-500 text-xs mt-1">{addForm.errors.code}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipe Potongan</label>
                                    <select
                                        value={addForm.data.discount_type}
                                        onChange={e => addForm.setData('discount_type', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    >
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                        <option value="percentage">Persentase (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nilai Potongan</label>
                                    <input
                                        type={addForm.data.discount_type === 'percentage' ? 'number' : 'text'}
                                        required
                                        min="0"
                                        placeholder={addForm.data.discount_type === 'percentage' ? '10' : 'Rp. 10.000'}
                                        value={addForm.data.discount_type === 'percentage' ? addForm.data.discount_value : formatRupiah(addForm.data.discount_value)}
                                        onChange={e => addForm.setData('discount_value', addForm.data.discount_type === 'percentage' ? e.target.value : e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                    {addForm.errors.discount_value && <p className="text-red-500 text-xs mt-1">{addForm.errors.discount_value}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min. Pembelian (Rp)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formatRupiah(addForm.data.min_purchase)}
                                        onChange={e => addForm.setData('min_purchase', e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Maks. Potongan (Rp) <span className="text-[10px] text-gray-400 lowercase">(untuk %)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Kosongkan jika tidak dibatasi"
                                        value={formatRupiah(addForm.data.max_discount)}
                                        onChange={e => addForm.setData('max_discount', e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rentang Tanggal Mulai & Selesai</label>
                                    <button
                                        type="button"
                                        onClick={() => openDatePicker('add')}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700 font-semibold text-[11px] font-mono leading-none">
                                            {addForm.data.starts_at ? (
                                                `${formatDate(addForm.data.starts_at)} s/d ${addForm.data.expires_at ? formatDate(addForm.data.expires_at) : '(Belum ditentukan)'}`
                                            ) : (
                                                'Pilih rentang...'
                                            )}
                                        </span>
                                        <Calendar size={16} className="text-[#E5654B] flex-shrink-0" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batas Kuota Penggunaan</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Tanpa batas"
                                        value={addForm.data.usage_limit}
                                        onChange={e => addForm.setData('usage_limit', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-[#f0ede8] pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addForm.processing}
                                    className="px-5 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d0533b] shadow-sm disabled:opacity-50 transition-all"
                                >
                                    {addForm.processing ? 'Menyimpan...' : 'Simpan Kupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal: Edit Kupon */}
            {isEditModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center justify-between">
                            <h3 className="font-bold text-base text-[#1a1a1a] flex items-center gap-2">
                                <Ticket size={18} className="text-[#E5654B]" /> Ubah Kupon Diskon
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kode Kupon</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: DISKON10"
                                    value={editForm.data.code}
                                    onChange={e => editForm.setData('code', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B] uppercase font-mono font-bold"
                                />
                                {editForm.errors.code && <p className="text-red-500 text-xs mt-1">{editForm.errors.code}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipe Potongan</label>
                                    <select
                                        value={editForm.data.discount_type}
                                        onChange={e => editForm.setData('discount_type', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    >
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                        <option value="percentage">Persentase (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nilai Potongan</label>
                                    <input
                                        type={editForm.data.discount_type === 'percentage' ? 'number' : 'text'}
                                        required
                                        min="0"
                                        value={editForm.data.discount_type === 'percentage' ? editForm.data.discount_value : formatRupiah(editForm.data.discount_value)}
                                        onChange={e => editForm.setData('discount_value', editForm.data.discount_type === 'percentage' ? e.target.value : e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                    {editForm.errors.discount_value && <p className="text-red-500 text-xs mt-1">{editForm.errors.discount_value}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min. Pembelian (Rp)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formatRupiah(editForm.data.min_purchase)}
                                        onChange={e => editForm.setData('min_purchase', e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                                        Maks. Potongan (Rp) <span className="text-[10px] text-gray-400 lowercase">(untuk %)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Kosongkan jika tidak dibatasi"
                                        value={formatRupiah(editForm.data.max_discount)}
                                        onChange={e => editForm.setData('max_discount', e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rentang Tanggal Mulai & Selesai</label>
                                    <button
                                        type="button"
                                        onClick={() => openDatePicker('edit')}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-700 font-semibold text-[11px] font-mono leading-none">
                                            {editForm.data.starts_at ? (
                                                `${formatDate(editForm.data.starts_at)} s/d ${editForm.data.expires_at ? formatDate(editForm.data.expires_at) : '(Belum ditentukan)'}`
                                            ) : (
                                                'Pilih rentang...'
                                            )}
                                        </span>
                                        <Calendar size={16} className="text-[#E5654B] flex-shrink-0" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batas Kuota Penggunaan</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Tanpa batas"
                                        value={editForm.data.usage_limit}
                                        onChange={e => editForm.setData('usage_limit', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-[#e8e5e0] rounded-xl text-sm focus:outline-none focus:border-[#E5654B]"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-[#f0ede8] pt-4 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2.5 bg-[#E5654B] text-white rounded-xl text-sm font-semibold hover:bg-[#d0533b] shadow-sm disabled:opacity-50 transition-all"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Kupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            <DateRangePickerModal
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                initialStartsAt={datePickerTarget === 'add' ? addForm.data.starts_at : editForm.data.starts_at}
                initialExpiresAt={datePickerTarget === 'add' ? addForm.data.expires_at : editForm.data.expires_at}
                onApply={handleDateRangeApply}
            />
        </AdminLayout>
    );
}
