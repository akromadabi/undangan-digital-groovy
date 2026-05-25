import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';

// Mockup Components for Visual Guides
const ActiveStatusMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI STATUS PANEL</div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>Paket Premium Pro</span>
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full">Aktif</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-emerald-100 mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: '85%' }} />
            </div>
            <div className="mt-2 text-[10px] text-emerald-700/80">Sisa masa aktif: 312 Hari lagi (s/d 25 Mei 2027)</div>
        </div>
    </div>
);

const WhatsappShareMockup = () => {
    const [sent, setSent] = useState(false);
    return (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-md">
            <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI DAFTAR TAMU</div>
            <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100 overflow-hidden">
                <div className="p-3 flex items-center justify-between gap-2">
                    <div>
                        <div className="text-xs font-semibold text-gray-800">Bapak Budi Santoso</div>
                        <div className="text-[10px] text-gray-400">Grup: Keluarga Besar</div>
                    </div>
                    <button
                        onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all ${
                            sent ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {sent ? 'Terbuka!' : 'Kirim WA'}
                    </button>
                </div>
            </div>
            {sent && (
                <div className="mt-2 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Simulasi: Mengalihkan ke pesan WhatsApp Budi Santoso...
                </div>
            )}
        </div>
    );
};

const AddGuestMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI FORMULIR TAMU</div>
        <div className="bg-white border border-gray-200/80 rounded-lg p-3 shadow-sm space-y-2">
            <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">NAMA TAMU</label>
                <input type="text" readOnly value="Rian & Pasangan" className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">NOMOR WA</label>
                    <input type="text" readOnly value="08123456789" className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">KATEGORI/GRUP</label>
                    <input type="text" readOnly value="Teman Kampus" className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none" />
                </div>
            </div>
            <button className="w-full py-1 bg-emerald-600 text-white rounded text-xs font-semibold shadow-sm">
                + Tambahkan Tamu
            </button>
        </div>
    </div>
);

const ThemeChangeMockup = () => {
    const [selected, setSelected] = useState('modern');
    return (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-md">
            <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI KATALOG TEMA</div>
            <div className="grid grid-cols-2 gap-3">
                {/* Theme 1 */}
                <div onClick={() => setSelected('adat')} className={`cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${selected === 'adat' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="h-16 bg-[#e0d6c8] flex items-center justify-center text-[10px] text-amber-800 font-serif">
                        ADAT JAWA PREVIEW
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-700">Joglo Klasik</span>
                        {selected === 'adat' ? (
                            <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                        ) : (
                            <span className="text-[9px] text-emerald-600 font-semibold">Gunakan</span>
                        )}
                    </div>
                </div>
                {/* Theme 2 */}
                <div onClick={() => setSelected('modern')} className={`cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${selected === 'modern' ? 'ring-2 ring-emerald-500 border-transparent' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="h-16 bg-gradient-to-tr from-rose-100 to-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-semibold">
                        MODERN MINIMALIST
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-700">Groovy Pink</span>
                        {selected === 'modern' ? (
                            <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                        ) : (
                            <span className="text-[9px] text-emerald-600 font-semibold">Gunakan</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StreamingFormMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI FORMULIR STREAMING</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between p-1 bg-gray-50 rounded border border-gray-100">
                <span className="text-[10px] font-bold text-gray-600 uppercase">AKtifkan live streaming</span>
                <div className="w-7 h-4 bg-emerald-500 rounded-full p-0.5 flex justify-end items-center cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full" />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">PLATFORM</label>
                <input type="text" readOnly value="YouTube Live" className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none" />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">LINK STREAMING (URL)</label>
                <input type="text" readOnly value="https://youtube.com/live/xYzA123" className="w-full text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none text-emerald-600" />
            </div>
        </div>
    </div>
);

const MusicPlayerMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI PENGATURAN MUSIK</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-spin">
                    ♫
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-emerald-950 truncate">Beautiful In White.mp3</div>
                    <div className="text-[8px] text-emerald-600">Terpilih (Pustaka Groovy)</div>
                </div>
            </div>
            <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer bg-white hover:bg-gray-50">
                <div className="text-xs text-gray-500 font-semibold">Upload Musik (.mp3)</div>
                <div className="text-[8px] text-gray-400 mt-0.5">Maksimal ukuran file: 5MB</div>
            </div>
        </div>
    </div>
);

const GiftRegisterMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI AMPLOP DIGITAL</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="border border-emerald-100 bg-emerald-50/50 rounded-lg p-2.5 flex items-start gap-2.5">
                <div className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5">BCA</div>
                <div>
                    <div className="text-[11px] font-bold text-gray-800">1234567890</div>
                    <div className="text-[9px] text-gray-500">a.n Budi Santoso</div>
                </div>
            </div>
            <button className="w-full py-1.5 border border-dashed border-gray-300 hover:border-gray-400 rounded-lg text-xs font-semibold text-gray-600 bg-white">
                + Tambah Rekening Lain
            </button>
        </div>
    </div>
);

const CustomDomainMockup = () => (
    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl max-w-sm">
        <div className="text-[11px] font-semibold text-gray-400 tracking-wider mb-2">SIMULASI CUSTOM DOMAIN</div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
            <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">ALAMAT DOMAIN ANDA</label>
                <div className="flex gap-1.5">
                    <input type="text" readOnly value="budiandsiti.com" className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none" />
                    <button className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-semibold">Hubungkan</button>
                </div>
            </div>
            <div className="p-2 bg-amber-50 border border-amber-100 rounded text-[9px] text-amber-700 leading-tight">
                <strong>Panduan DNS:</strong> Arahkan DNS <strong>A Record</strong> domain Anda ke IP <code>103.174.112.56</code>.
            </div>
        </div>
    </div>
);

// FAQ Data Source
const FAQ_DATABASE = [
    {
        id: 'faq-aktif',
        category: 'mulai-cepat',
        question: '1. Berapa lama masa aktif undangan digital saya?',
        answer: 'Masa aktif undangan digital Anda tergantung pada jenis paket yang Anda pilih saat pendaftaran atau upgrade.',
        keywords: ['aktif', 'lama', 'durasi', 'expired', 'masa', 'berlaku', 'kapan', 'sisa', 'kadaluarsa'],
        steps: [
            'Paket Free (Gratis): Aktif selama 7 hari sejak tanggal pembuatan undangan.',
            'Paket Premium / Pro: Aktif selama 1 tahun (365 hari) penuh.',
            'Undangan digital yang kedaluwarsa akan dinonaktifkan secara otomatis, tetapi data Anda tidak akan dihapus. Anda dapat mengaktifkannya kembali kapan saja dengan melakukan perpanjangan paket.',
            'Anda dapat memeriksa sisa masa aktif undangan Anda di panel samping kiri (sidebar) bagian bawah.'
        ],
        mockup: 'aktif'
    },
    {
        id: 'faq-wa',
        category: 'tamu-undangan',
        question: '2. Bagaimana cara membagikan undangan pernikahan ke WhatsApp?',
        answer: 'Membagikan undangan ke WhatsApp sangat praktis karena sistem kami telah menyiapkan teks template otomatis beserta link personal untuk masing-masing tamu.',
        keywords: ['share', 'wa', 'whatsapp', 'bagikan', 'kirim', 'tamu', 'link', 'broadcast', 'kirim wa'],
        steps: [
            'Masuk ke halaman "Tamu & RSVP" di panel samping.',
            'Pastikan Anda telah mengisi nama tamu di dalam daftar tamu.',
            'Di kolom daftar tamu, klik tombol "Kirim WA" (ikon WhatsApp warna hijau) di baris tamu yang dituju.',
            'Pop-up WhatsApp akan terbuka. Jika Anda menggunakan laptop, Anda akan diarahkan ke WhatsApp Web. Jika menggunakan ponsel, aplikasi WhatsApp akan langsung terbuka dengan draf pesan otomatis.',
            'Tinggal klik tombol kirim di aplikasi WhatsApp Anda.'
        ],
        mockup: 'wa'
    },
    {
        id: 'faq-tambah-tamu',
        category: 'tamu-undangan',
        question: '3. Bagaimana cara menambah daftar tamu undangan?',
        answer: 'Anda memiliki dua opsi mudah untuk menambahkan nama tamu: menambahkannya satu per satu, atau mengunggah daftar tamu sekaligus menggunakan template Excel.',
        keywords: ['tamu', 'tambah', 'import', 'excel', 'guest', 'daftar', 'xlsx', 'unggah', 'masukkan'],
        steps: [
            'Buka menu "Tamu & RSVP" pada panel samping kiri.',
            'Opsi 1 (Satu Per Satu): Klik tombol "+ Tambah Tamu". Masukkan nama tamu, grup/kategori (opsional), dan nomor telepon. Klik "Simpan".',
            'Opsi 2 (Sekaligus via Excel): Klik tombol "Import Excel". Unduh file template Excel (.xlsx) yang telah disediakan. Isi daftar nama tamu Anda di dalam file tersebut sesuai kolom, lalu unggah kembali file Excel tersebut ke dashboard.',
            'Daftar tamu Anda akan otomatis terisi dalam hitungan detik!'
        ],
        mockup: 'tambah-tamu'
    },
    {
        id: 'faq-ganti-tema',
        category: 'desain-tema',
        question: '4. Bagaimana cara mengganti tema atau desain undangan?',
        answer: 'Anda bebas bereksperimen mengganti tema undangan kapan saja tanpa khawatir kehilangan informasi, teks, atau galeri foto yang sudah diisi sebelumnya.',
        keywords: ['tema', 'ganti', 'desain', 'ubah', 'tampilan', 'theme', 'katalog', 'pilih', 'template'],
        steps: [
            'Buka menu "Desain & Tema" di panel samping.',
            'Pilih tab "Tema" di bagian atas halaman (jika belum terpilih).',
            'Jelajahi katalog tema yang tersedia. Anda bisa mengeklik tombol "Preview" untuk melihat simulasi tampilan langsung tema tersebut.',
            'Bila sudah menemukan tema yang cocok, klik tombol "Gunakan Tema". Desain undangan Anda akan seketika berubah mengikuti tema baru tersebut.'
        ],
        mockup: 'tema'
    },
    {
        id: 'faq-streaming',
        category: 'fitur-tambahan',
        question: '5. Bagaimana cara menambahkan link Live Streaming?',
        answer: 'Anda bisa menyematkan link siaran langsung (Live Streaming) acara pernikahan Anda agar kerabat yang berada jauh atau berhalangan hadir tetap dapat menyaksikan prosesi sakral.',
        keywords: ['streaming', 'live', 'youtube', 'zoom', 'siaran', 'langsung', 'video', 'link live', 'instagram'],
        steps: [
            'Masuk ke menu "Acara" di panel samping.',
            'Gulir layar ke bawah hingga menemukan section formulir "Live Streaming".',
            'Aktifkan switch/toggle "Aktifkan Live Streaming".',
            'Pilih atau ketik Platform (seperti YouTube, Zoom, Instagram Live, dll).',
            'Masukkan URL link live streaming pada kolom yang disediakan (contoh: https://youtube.com/live/xxx).',
            'Klik tombol "Simpan Acara" di bagian bawah untuk menyimpan perubahan.'
        ],
        mockup: 'streaming'
    },
    {
        id: 'faq-musik',
        category: 'desain-tema',
        question: '6. Bagaimana cara mengganti musik latar (Backsound)?',
        answer: 'Undangan digital Anda akan terasa lebih hidup dengan latar belakang musik yang romantis dan sesuai dengan selera Anda.',
        keywords: ['musik', 'lagu', 'backsound', 'suara', 'sound', 'mp3', 'audio', 'ganti lagu', 'autoplay'],
        steps: [
            'Pilih menu "Musik" di panel samping.',
            'Anda dapat mendengarkan dan menggunakan pilihan lagu romantis yang sudah kami sediakan di dalam pustaka sistem.',
            'Jika Anda berlangganan paket Premium, Anda dapat mengunggah file musik buatan sendiri dalam format `.mp3` dengan batas ukuran maksimal 5MB.',
            'Klik tombol "Simpan Musik" untuk menerapkan musik latar baru pada undangan Anda.'
        ],
        mockup: 'musik'
    },
    {
        id: 'faq-hadiah',
        category: 'fitur-tambahan',
        question: '7. Bagaimana cara mengaktifkan amplop digital (kado pernikahan)?',
        answer: 'Fitur Amplop Digital memberikan kemudahan bagi para tamu undangan untuk mengirimkan kado/amplop secara non-tunai (cashless) secara langsung ke rekening Anda.',
        keywords: ['hadiah', 'amplop', 'rekening', 'transfer', 'bank', 'kado', 'digital', 'cashless', 'angpao'],
        steps: [
            'Pilih menu "Amplop Digital" di panel samping kiri.',
            'Klik tombol "Tambah Rekening".',
            'Pilih nama bank atau e-wallet (seperti BCA, Mandiri, OVO, Dana), lalu masukkan nomor rekening dan nama pemilik rekening secara akurat.',
            'Anda juga dapat mengaktifkan opsi "Kirim Kado" jika ingin menampilkan alamat pengiriman kado fisik bagi tamu yang ingin mengirim kado langsung ke rumah.',
            'Klik "Simpan" untuk menampilkan fitur amplop digital ini pada undangan.'
        ],
        mockup: 'hadiah'
    },
    {
        id: 'faq-domain',
        category: 'fitur-tambahan',
        question: '8. Apakah saya bisa menggunakan domain sendiri (Custom Domain)?',
        answer: 'Ya, bagi pengguna paket Premium Pro atau paket tertentu dari Reseller, Anda dapat menggunakan domain pribadi (contoh: www.budiandsiti.com) alih-alih menggunakan link default.',
        keywords: ['domain', 'custom', 'nama', 'web', 'alamat', 'sendiri', 'dns', 'cname', 'a record'],
        steps: [
            'Masuk ke menu "Desain & Tema", lalu pilih tab "Pengaturan" di bagian kanan atas.',
            'Scroll ke bawah ke kolom "Custom Domain".',
            'Lakukan konfigurasi DNS di penyedia domain Anda (seperti Niagahoster, Domainesia, GoDaddy, dll.) dengan mengarahkan A Record ke IP server kami yang tercantum di petunjuk halaman tersebut.',
            'Ketikkan alamat domain baru Anda di formulir, lalu klik "Hubungkan Domain". Hubungi admin untuk proses verifikasi dan aktivasi SSL gratis (HTTPS).'
        ],
        mockup: 'domain'
    },
    {
        id: 'faq-autoplay',
        category: 'desain-tema',
        question: '9. Mengapa musik di undangan tidak otomatis berputar saat dibuka pertama kali?',
        answer: 'Hal ini terjadi karena adanya kebijakan privasi dan keamanan ketat pada browser modern (Google Chrome, Apple Safari, Mozilla Firefox) yang melarang pemutaran audio otomatis (autoplay) sebelum pengguna berinteraksi dengan halaman.',
        keywords: ['musik', 'tidak', 'putar', 'bunyi', 'suara', 'autoplay', 'senyap', 'mati', 'browser'],
        steps: [
            'Untuk mengatasi kendala aturan browser ini, undangan kami dirancang menggunakan halaman pembuka (Cover/Sampul) interaktif.',
            'Di halaman Cover tersebut, terdapat tombol "Buka Undangan".',
            'Ketika tamu undangan mengeklik tombol "Buka Undangan", browser akan mendeteksi interaksi pengguna secara sah, dan musik latar akan segera berputar secara otomatis tanpa ada suara senyap.',
            'Kami sangat menyarankan Anda untuk selalu mengaktifkan fitur "Halaman Sampul (Cover)" di menu Desain agar musik latar dapat berputar dengan sempurna.'
        ],
        mockup: null
    },
    {
        id: 'faq-mempelai-acara',
        category: 'mulai-cepat',
        question: '10. Bagaimana cara memperbarui detail informasi Pengantin & Acara?',
        answer: 'Pengeditan nama calon pengantin, data keluarga, tanggal, hingga lokasi maps dapat diubah dengan mudah dan perubahannya langsung diperbarui seketika pada undangan digital Anda.',
        keywords: ['edit', 'mempelai', 'foto', 'nama', 'tanggal', 'lokasi', 'alamat', 'ubah', 'pengantin', 'akad', 'resepsi'],
        steps: [
            'Gunakan menu "Mempelai" di panel samping untuk memperbarui foto profil pengantin pria/wanita, nama lengkap, nama panggilan, nama orang tua, serta link media sosial.',
            'Gunakan menu "Acara" untuk melengkapi tanggal pelaksanaan, jam mulai-selesai, zona waktu, nama gedung, alamat tertulis, serta menyematkan link Google Maps lokasi agar tamu tidak tersesat.',
            'Klik tombol "Simpan" di masing-masing menu setelah melakukan perubahan agar data ter-update.'
        ],
        mockup: null
    }
];

export default function Tutorial() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('semua');
    const [openIds, setOpenIds] = useState(['faq-aktif']); // First item open by default

    // Category Tabs Configuration
    const categories = [
        { id: 'semua', label: 'Semua Kategori' },
        { id: 'mulai-cepat', label: 'Mulai Cepat' },
        { id: 'desain-tema', label: 'Desain & Tema' },
        { id: 'tamu-undangan', label: 'Tamu & Undangan' },
        { id: 'fitur-tambahan', label: 'Fitur Tambahan' }
    ];

    // Toggle Accordion State
    const toggleAccordion = (id) => {
        setOpenIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Filter FAQs based on active tab and search query
    const filteredFAQs = useMemo(() => {
        return FAQ_DATABASE.filter(faq => {
            // Filter by Category
            if (activeCategory !== 'semua' && faq.category !== activeCategory) {
                return false;
            }
            // Filter by Search Query (keywords, title, answer)
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const matchesQuestion = faq.question.toLowerCase().includes(query);
                const matchesAnswer = faq.answer.toLowerCase().includes(query);
                const matchesKeywords = faq.keywords.some(kw => kw.includes(query));
                return matchesQuestion || matchesAnswer || matchesKeywords;
            }
            return true;
        });
    }, [activeCategory, searchQuery]);

    // Renders visual mockup based on faq.mockup key
    const renderVisualMockup = (type) => {
        switch (type) {
            case 'aktif':
                return <ActiveStatusMockup />;
            case 'wa':
                return <WhatsappShareMockup />;
            case 'tambah-tamu':
                return <AddGuestMockup />;
            case 'tema':
                return <ThemeChangeMockup />;
            case 'streaming':
                return <StreamingFormMockup />;
            case 'musik':
                return <MusicPlayerMockup />;
            case 'hadiah':
                return <GiftRegisterMockup />;
            case 'domain':
                return <CustomDomainMockup />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout title="Panduan & FAQ">
            <Head title="Panduan & FAQ" />

            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                {/* ═══ Header Section ═══ */}
                <div className="text-center py-6 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl text-white px-4 relative overflow-hidden shadow-sm">
                    <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -right-12 w-48 h-48 rounded-full bg-white/5" />
                    
                    <h1 className="text-xl lg:text-3xl font-bold tracking-tight mb-2 relative z-10">Pusat Panduan & FAQ</h1>
                    <p className="text-xs lg:text-sm text-emerald-100/90 max-w-md mx-auto relative z-10">
                        Punya pertanyaan? Cari solusi cepat untuk mempermudah Anda dalam mengaplikasikan undangan pernikahan digital.
                    </p>

                    {/* Smart Search Bar */}
                    <div className="mt-6 max-w-md mx-auto relative z-10">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ketik kata kunci (misal: 'tema', 'wa', 'musik', 'aktif')..."
                                className="w-full bg-white text-gray-800 placeholder-gray-400 pl-11 pr-4 py-3 rounded-xl border-none shadow-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                            />
                            <div className="absolute left-4 top-3.5 text-gray-400">
                                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-2.5 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ═══ Category Tabs ═══ */}
                <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                // If tab switches, keep search but reset view/open states optionally
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                                activeCategory === cat.id
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ═══ FAQ Accordion List ═══ */}
                <div className="space-y-3">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq) => {
                            const isOpen = openIds.includes(faq.id);
                            return (
                                <div
                                    key={faq.id}
                                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                                        isOpen ? 'border-emerald-200/80 shadow-md' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                                    }`}
                                >
                                    {/* Accordion Trigger */}
                                    <button
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="w-full flex items-center justify-between text-left p-4 focus:outline-none transition-colors hover:bg-gray-50/40"
                                    >
                                        <span className={`text-sm font-semibold pr-4 transition-colors ${isOpen ? 'text-emerald-700' : 'text-gray-800'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                            isOpen ? 'bg-emerald-50 text-emerald-600 rotate-180' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Accordion Content */}
                                    <div
                                        className={`transition-all duration-200 ease-in-out overflow-hidden ${
                                            isOpen ? 'max-h-[1000px] border-t border-gray-50' : 'max-h-0'
                                        }`}
                                    >
                                        <div className="p-4 lg:p-5 bg-white text-gray-600 text-xs lg:text-sm leading-relaxed space-y-4">
                                            {/* Deskripsi Jawaban */}
                                            <p className="text-gray-700 font-medium">{faq.answer}</p>

                                            {/* Panduan Langkah Demi Langkah */}
                                            <div className="space-y-2">
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">LANGKAH-LANGKAH PANDUAN</div>
                                                <ol className="list-decimal list-inside pl-1 space-y-1.5 text-gray-600 text-xs">
                                                    {faq.steps.map((step, idx) => (
                                                        <li key={idx} className="pl-1">
                                                            <span className="text-gray-700">{step}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>

                                            {/* Visual mockup (if any) */}
                                            {faq.mockup && (
                                                <div className="pt-2 border-t border-gray-50">
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">PANDUAN VISUAL</div>
                                                    {renderVisualMockup(faq.mockup)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        // No Results Fallback
                        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold text-gray-800">Pertanyaan Tidak Ditemukan</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                Maaf, kami tidak dapat menemukan panduan dengan kata kunci "{searchQuery}". Coba gunakan kata kunci umum lainnya seperti <strong>'tema'</strong>, <strong>'wa'</strong>, atau <strong>'musik'</strong>.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveCategory('semua'); }}
                                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══ Contact Support Footer Card ═══ */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div>
                        <h4 className="text-sm font-bold text-emerald-950">Masih Butuh Bantuan Tambahan?</h4>
                        <p className="text-xs text-emerald-800 mt-0.5">Jika Anda tidak menemukan solusi di atas, tim support kami siap membantu Anda secara langsung.</p>
                    </div>
                    <a
                        href="https://wa.me/6281234567890?text=Halo%20Admin%20Groovy,%20saya%20butuh%20bantuan%20terkait%20pengaturan%20undangan%20saya"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Hubungi Support WA
                    </a>
                </div>
            </div>
        </DashboardLayout>
    );
}
