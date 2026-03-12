import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

const ToggleSwitch = ({ checked, onChange, label, desc, icon }) => (
    <div className="flex items-center justify-between py-4 px-1">
        <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
            </span>
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
        religion: invitation?.religion || 'islam',
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
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm"><svg className="w-4 h-4 inline mr-1 -mt-0.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> {flash.success}</div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-xl"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                    <div>
                        <div className="font-medium text-blue-800 text-sm">Pengaturan Undangan</div>
                        <div className="text-blue-600 text-xs mt-0.5">Atur fitur dan tampilan undangan Anda secara umum. Perubahan akan langsung terlihat di undangan.</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Privasi & Fitur */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center text-xs"><svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></span>
                            Privasi & Fitur
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Kontrol visibilitas dan fitur undangan Anda</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" label="Privasi" desc="Undangan tidak muncul di Google"
                                checked={data.is_private} onChange={(v) => setData('is_private', v)} />
                            <ToggleSwitch icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" label="QR Code" desc="Tampilkan QR Code check-in"
                                checked={data.enable_qr} onChange={(v) => setData('enable_qr', v)} />
                            <ToggleSwitch icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" label="Tanpa Foto" desc="Mode undangan tanpa foto"
                                checked={data.hide_photos} onChange={(v) => setData('hide_photos', v)} />
                        </div>
                    </div>

                    {/* Tampilan */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-xs"><svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" /></svg></span>
                            Tampilan
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Kontrol elemen visual pada undangan</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" label="Tampilkan Foto" desc="Tampilkan foto mempelai di undangan"
                                checked={data.show_photos} onChange={(v) => setData('show_photos', v)} />
                            <ToggleSwitch icon="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" label="Efek Animasi" desc="Animasi fade-in dan transisi saat scroll"
                                checked={data.show_animations} onChange={(v) => setData('show_animations', v)} />
                            <ToggleSwitch icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" label="Nama Tamu di Cover" desc="Tampilkan nama penerima undangan di halaman cover"
                                checked={data.show_guest_name} onChange={(v) => setData('show_guest_name', v)} />
                            <ToggleSwitch icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" label="Countdown Timer" desc="Hitung mundur menuju hari acara"
                                checked={data.show_countdown} onChange={(v) => setData('show_countdown', v)} />
                        </div>
                    </div>

                    {/* Fitur */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-xs"><svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
                            Fitur
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">Aktifkan atau nonaktifkan fitur undangan</p>

                        <div className="divide-y divide-gray-100">
                            <ToggleSwitch icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" label="QR Code Scan" desc="Tampilkan QR Code untuk scan undangan"
                                checked={data.show_qr_code} onChange={(v) => setData('show_qr_code', v)} />
                            <ToggleSwitch icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" label="RSVP" desc="Form konfirmasi kehadiran untuk tamu"
                                checked={data.enable_rsvp} onChange={(v) => setData('enable_rsvp', v)} />
                            <ToggleSwitch icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" label="Ucapan & Doa" desc="Section ucapan dan doa dari tamu"
                                checked={data.enable_wishes} onChange={(v) => setData('enable_wishes', v)} />
                            <ToggleSwitch icon="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" label="Musik Autoplay" desc="Putar musik otomatis saat membuka undangan"
                                checked={data.music_autoplay} onChange={(v) => setData('music_autoplay', v)} />
                        </div>
                    </div>

                    {/* Lainnya */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-xs"><svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg></span>
                            Lainnya
                        </h3>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa Undangan</label>
                            <select value={data.language} onChange={(e) => setData('language', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 bg-white">
                                <option value="id">🇮🇩 Bahasa Indonesia</option>
                                <option value="en">🇬🇧 English</option>
                            </select>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
                            <p className="text-xs text-gray-400 mb-2">Menentukan pilihan template ayat/kutipan di halaman Teks & Sambutan</p>
                            <select value={data.religion} onChange={(e) => setData('religion', e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 bg-white">
                                <option value="islam">☪️ Islam</option>
                                <option value="kristen">✝️ Kristen</option>
                                <option value="hindu">🕉️ Hindu</option>
                                <option value="buddha">☸️ Buddha</option>
                                <option value="umum">🌐 Umum</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}
