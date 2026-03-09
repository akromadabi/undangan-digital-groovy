import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const ToggleSwitch = ({ checked, onChange, label, desc, icon }) => (
    <div className="flex items-center justify-between py-4 px-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800">{label}</div>
                {desc && <div className="text-xs text-gray-400 mt-0.5">{desc}</div>}
            </div>
        </div>
        <button type="button" onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
        </button>
    </div>
);

export default function PengaturanUndangan({ invitation }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        show_photos: invitation?.show_photos ?? true,
        show_animations: invitation?.show_animations ?? true,
        show_guest_name: invitation?.show_guest_name ?? true,
        show_countdown: invitation?.show_countdown ?? true,
        show_qr_code: invitation?.show_qr_code ?? true,
        enable_rsvp: invitation?.enable_rsvp ?? true,
        enable_wishes: invitation?.enable_wishes ?? true,
        music_autoplay: invitation?.music_autoplay ?? true,
        language: invitation?.language || 'id',
        is_private: invitation?.is_private ?? false,
        enable_qr: invitation?.enable_qr ?? true,
        hide_photos: invitation?.hide_photos ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.pengaturan.save'));
    };

    return (
        <DashboardLayout title="Pengaturan Undangan">
            <Head title="Pengaturan Undangan" />

            <div className="max-w-2xl mx-auto space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">✅ {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl">⚙️</span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Pengaturan Undangan</div>
                        <div className="text-blue-600 text-xs mt-0.5">Atur fitur dan tampilan undangan Anda secara umum. Perubahan akan langsung terlihat di undangan.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Privasi & Fitur */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center text-xs">🔒</span>
                            Privasi & Fitur
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Kontrol visibilitas dan fitur undangan Anda</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="🔒" label="Privasi" desc="Undangan tidak muncul di Google"
                                checked={data.is_private} onChange={(v) => setData('is_private', v)} />
                            <ToggleSwitch icon="📱" label="QR Code" desc="Tampilkan QR Code check-in"
                                checked={data.enable_qr} onChange={(v) => setData('enable_qr', v)} />
                            <ToggleSwitch icon="🖼️" label="Tanpa Foto" desc="Mode undangan tanpa foto"
                                checked={data.hide_photos} onChange={(v) => setData('hide_photos', v)} />
                        </div>
                    </div>

                    {/* Tampilan */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-xs">🎨</span>
                            Tampilan
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Kontrol elemen visual pada undangan</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="📷" label="Tampilkan Foto" desc="Tampilkan foto mempelai di undangan"
                                checked={data.show_photos} onChange={(v) => setData('show_photos', v)} />
                            <ToggleSwitch icon="🎬" label="Efek Animasi" desc="Animasi fade-in dan transisi saat scroll"
                                checked={data.show_animations} onChange={(v) => setData('show_animations', v)} />
                            <ToggleSwitch icon="👤" label="Nama Tamu di Cover" desc="Tampilkan nama penerima undangan di halaman cover"
                                checked={data.show_guest_name} onChange={(v) => setData('show_guest_name', v)} />
                            <ToggleSwitch icon="⏳" label="Countdown Timer" desc="Hitung mundur menuju hari acara"
                                checked={data.show_countdown} onChange={(v) => setData('show_countdown', v)} />
                        </div>
                    </div>

                    {/* Fitur */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-xs">🔧</span>
                            Fitur
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Aktifkan atau nonaktifkan fitur undangan</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="📱" label="QR Code Scan" desc="Tampilkan QR Code untuk scan undangan"
                                checked={data.show_qr_code} onChange={(v) => setData('show_qr_code', v)} />
                            <ToggleSwitch icon="✉️" label="RSVP" desc="Form konfirmasi kehadiran untuk tamu"
                                checked={data.enable_rsvp} onChange={(v) => setData('enable_rsvp', v)} />
                            <ToggleSwitch icon="💬" label="Ucapan & Doa" desc="Section ucapan dan doa dari tamu"
                                checked={data.enable_wishes} onChange={(v) => setData('enable_wishes', v)} />
                            <ToggleSwitch icon="🔊" label="Musik Autoplay" desc="Putar musik otomatis saat membuka undangan"
                                checked={data.music_autoplay} onChange={(v) => setData('music_autoplay', v)} />
                        </div>
                    </div>

                    {/* Lainnya */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs">🌐</span>
                            Lainnya
                        </h3>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">🌍 Bahasa Undangan</label>
                            <select value={data.language} onChange={(e) => setData('language', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 bg-white">
                                <option value="id">🇮🇩 Bahasa Indonesia</option>
                                <option value="en">🇬🇧 English</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : '💾 Simpan Pengaturan'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
