import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, useForm, router } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { 
    Heart, Cake, Award, Baby, Shield, Calendar, Plus, 
    ExternalLink, Settings, CheckCircle, Mail
} from 'lucide-react';

export default function InvitationsList({ invitations, activeInvitationId }) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'wedding',
        title: '',
    });

    const eventIcons = {
        wedding: <Heart className="w-5 h-5 text-red-500" />,
        birthday: <Cake className="w-5 h-5 text-orange-500" />,
        graduation: <Award className="w-5 h-5 text-blue-500" />,
        aqiqah: <Baby className="w-5 h-5 text-purple-500" />,
        circumcision: <Shield className="w-5 h-5 text-emerald-500" />,
        anniversary: <Calendar className="w-5 h-5 text-pink-500" />,
    };

    const eventLabels = {
        wedding: 'Pernikahan',
        birthday: 'Ulang Tahun',
        graduation: 'Wisuda',
        aqiqah: 'Aqiqah',
        circumcision: 'Sunatan',
        anniversary: 'Anniversary',
    };

    const handleSelect = (id) => {
        router.post(route('dashboard.invitations.select', id));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('dashboard.invitations.create'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    return (
        <DashboardLayout title="Undangan Saya">
            <Head title="Undangan Saya" />

            <div className="space-y-6 max-w-5xl mx-auto">
                {/* ═══ Header Section ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Daftar Undangan Digital
                        </h2>
                        <p className="text-sm text-gray-500">
                            Kelola semua undangan digital Anda dari satu akun pengelola.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 self-start sm:self-auto animate-in fade-in duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Undangan Baru
                    </button>
                </div>

                {/* ═══ Invitations Grid ═══ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    {invitations.map((inv) => {
                        const isActive = inv.id === activeInvitationId;
                        const isFree = !inv.active_subscription;
                        const planName = inv.active_subscription?.plan?.name || 'Free';
                        const planColor = isFree ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-[#E5654B] border border-orange-100';

                        return (
                            <div
                                key={inv.id}
                                className={`bg-white rounded-2xl border transition-all relative overflow-hidden ${
                                    isActive
                                        ? 'border-[#E5654B] shadow-md shadow-orange-50'
                                        : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 right-0 bg-[#E5654B] text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Sedang Dikelola
                                    </div>
                                )}

                                <div className="p-5 space-y-4">
                                    {/* Icon & Plan Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                                            {eventIcons[inv.type] || <Calendar className="w-5 h-5 text-gray-500" />}
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${planColor}`}>
                                            Paket {planName}
                                        </span>
                                    </div>

                                    {/* Title & Slug */}
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-base line-clamp-1">{inv.title}</h3>
                                        <div className="text-xs text-gray-400 font-medium mt-0.5">Tipe Acara: {eventLabels[inv.type] || inv.type}</div>
                                        <a
                                            href={inv.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#E5654B] hover:text-[#c24b33] hover:underline font-medium mt-2 inline-flex items-center gap-1"
                                        >
                                            {inv.url}
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                                        {isActive ? (
                                            <Link
                                                href="/dashboard"
                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#E5654B] to-[#c24b33] hover:shadow-md text-white rounded-lg text-xs font-semibold text-center transition-all inline-flex items-center justify-center gap-1.5"
                                            >
                                                <Settings className="w-3.5 h-3.5" />
                                                Edit Konten & Desain
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleSelect(inv.id)}
                                                className="flex-1 px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold text-center transition-all inline-flex items-center justify-center gap-1.5"
                                            >
                                                Kelola Undangan Ini
                                            </button>
                                        )}
                                        <a
                                            href={`/u/${inv.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 border border-gray-150 hover:bg-gray-50 text-gray-600 rounded-lg transition-all inline-flex items-center justify-center"
                                            title="Buka Undangan"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ═══ Modal Create ═══ */}
                {showCreateModal && createPortal(
                    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Buat Undangan Baru</h3>
                            <p className="text-xs text-gray-500 mb-4">Mulai rancang undangan digital Anda secara instan.</p>

                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Nama / Judul Acara</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Wisuda S1 Budi / Ultah Ara ke-5"
                                        className="w-full text-sm border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] rounded-xl px-4 py-2.5 transition-all"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-red-500 text-[10px] mt-1">{errors.title}</p>}
                                </div>

                                {/* Type Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Kategori Acara</label>
                                    <select
                                        className="w-full text-sm border-gray-200 focus:border-[#E5654B] focus:ring-[#E5654B] rounded-xl px-4 py-2.5 transition-all"
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="wedding">Pernikahan (Wedding)</option>
                                        <option value="birthday">Ulang Tahun (Birthday)</option>
                                        <option value="graduation">Wisuda (Graduation)</option>
                                        <option value="aqiqah">Aqiqah</option>
                                        <option value="circumcision">Sunatan (Khitanan)</option>
                                        <option value="anniversary">Anniversary / Syukuran</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-[10px] mt-1">{errors.type}</p>}
                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-xl transition-all"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 bg-gradient-to-r from-[#E5654B] to-[#c24b33] text-white text-xs font-semibold rounded-xl hover:shadow-lg transition-all"
                                    >
                                        {processing ? 'Menyimpan...' : 'Mulai Buat'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </DashboardLayout>
    );
}
