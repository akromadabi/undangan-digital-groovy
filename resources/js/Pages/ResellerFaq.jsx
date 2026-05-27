import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';

/* ─────────────────────────────────────────────────────────
   TINY SVG HELPERS
   ───────────────────────────────────────────────────────── */
const Icon = ({ d, className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

/* ─────────────────────────────────────────────────────────
   VISUAL SIMULATION MOCKUPS (Adapting dynamic colors)
   ───────────────────────────────────────────────────────── */
const ActiveStatusMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI STATUS PANEL</div>
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
            <div className="flex items-center justify-between text-xs font-semibold" style={{ color: 'var(--accent-dark)' }}>
                <span>Paket Premium Pro</span>
                <span className="text-white text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}>Aktif</span>
            </div>
            <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}>
                <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: 'var(--accent)' }} />
            </div>
            <div className="mt-2 text-[10px]" style={{ color: 'var(--accent-dark)', opacity: 0.8 }}>Sisa masa aktif: 312 Hari lagi</div>
        </div>
    </div>
);

const WhatsappShareMockup = () => {
    const [sent, setSent] = useState(false);
    return (
        <div className="mt-4 p-4 rounded-xl max-w-md text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
            <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI DAFTAR TAMU</div>
            <div className="border rounded-lg divide-y overflow-hidden" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)', divideColor: 'var(--card-border)' }}>
                <div className="p-3 flex items-center justify-between gap-2">
                    <div>
                        <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Bapak Budi Santoso</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Grup: Keluarga Besar</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setSent(true); setTimeout(() => setSent(false), 2000); }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 transition-all hover:brightness-110 hover:shadow-sm"
                        style={sent 
                            ? { backgroundColor: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent-dark)' } 
                            : { backgroundColor: 'var(--accent)', color: '#fff' }
                        }
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        {sent ? 'Terbuka!' : 'Kirim WA'}
                    </button>
                </div>
            </div>
            {sent && (
                <div className="mt-2 text-[10px] px-2 py-1 rounded border flex items-center gap-1.5 animate-fadeIn"
                     style={{ color: 'var(--accent-dark)', backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent)' }} />
                    Simulasi: Mengalihkan ke pesan WhatsApp Budi Santoso...
                </div>
            )}
        </div>
    );
};

const AddGuestMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI FORMULIR TAMU</div>
        <div className="border rounded-lg p-3 shadow-sm space-y-2" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
            <div>
                <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>NAMA TAMU</label>
                <input type="text" readOnly value="Rian & Pasangan" className="w-full text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>NOMOR WA</label>
                    <input type="text" readOnly value="08123456789" className="w-full text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                    <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>KATEGORI/GRUP</label>
                    <input type="text" readOnly value="Teman Kampus" className="w-full text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }} />
                </div>
            </div>
            <button type="button" className="w-full py-1.5 text-white rounded text-xs font-semibold shadow-sm hover:brightness-110 transition-colors"
                    style={{ backgroundColor: 'var(--accent)' }}>
                + Tambah Tamu
            </button>
        </div>
    </div>
);

const ThemeChangeMockup = () => {
    const [selected, setSelected] = useState('modern');
    return (
        <div className="mt-4 p-4 rounded-xl max-w-md text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
            <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI KATALOG TEMA</div>
            <div className="grid grid-cols-2 gap-3">
                {/* Theme 1 */}
                <div onClick={() => setSelected('adat')} className="cursor-pointer border rounded-xl overflow-hidden shadow-sm transition-all p-0.5"
                     style={selected === 'adat' 
                         ? { outline: '2px solid var(--accent)', borderColor: 'transparent', backgroundColor: 'var(--section-base)' } 
                         : { borderColor: 'var(--card-border)', backgroundColor: 'var(--section-base)' }}>
                    <div className="h-16 bg-[#e0d6c8] flex items-center justify-center text-[10px] text-amber-800 font-serif rounded-t-lg">
                        ADAT JAWA PREVIEW
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>Joglo Klasik</span>
                        {selected === 'adat' ? (
                            <span className="w-3.5 h-3.5 text-white rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: 'var(--accent)' }}>✓</span>
                        ) : (
                            <span className="text-[9px] font-semibold" style={{ color: 'var(--accent)' }}>Gunakan</span>
                        )}
                    </div>
                </div>
                {/* Theme 2 */}
                <div onClick={() => setSelected('modern')} className="cursor-pointer border rounded-xl overflow-hidden shadow-sm transition-all p-0.5"
                     style={selected === 'modern' 
                         ? { outline: '2px solid var(--accent)', borderColor: 'transparent', backgroundColor: 'var(--section-base)' } 
                         : { borderColor: 'var(--card-border)', backgroundColor: 'var(--section-base)' }}>
                    <div className="h-16 bg-gradient-to-tr from-rose-100 to-indigo-100 flex items-center justify-center text-[10px] text-indigo-700 font-semibold rounded-t-lg">
                        MODERN MINIMALIST
                    </div>
                    <div className="p-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold" style={{ color: 'var(--text-primary)' }}>Groovy Pink</span>
                        {selected === 'modern' ? (
                            <span className="w-3.5 h-3.5 text-white rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: 'var(--accent)' }}>✓</span>
                        ) : (
                            <span className="text-[9px] font-semibold" style={{ color: 'var(--accent)' }}>Gunakan</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StreamingFormMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI FORMULIR STREAMING</div>
        <div className="border rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center justify-between p-1 rounded border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-secondary)' }}>Aktifkan live streaming</span>
                <div className="w-7 h-4 rounded-full p-0.5 flex justify-end items-center cursor-pointer" style={{ backgroundColor: 'var(--accent)' }}>
                    <div className="w-3 h-3 bg-white rounded-full" />
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>PLATFORM</label>
                <input type="text" readOnly value="YouTube Live" className="w-full text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
                <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>LINK STREAMING (URL)</label>
                <input type="text" readOnly value="https://youtube.com/live/xYzA123" className="w-full text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--accent)' }} />
            </div>
        </div>
    </div>
);

const MusicPlayerMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI PENGATURAN MUSIK</div>
        <div className="border rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2 p-2 rounded border" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
                <div className="w-6 h-6 rounded-full text-white flex items-center justify-center animate-spin" style={{ backgroundColor: 'var(--accent)' }}>
                    ♫
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold truncate" style={{ color: 'var(--accent-dark)' }}>Beautiful In White.mp3</div>
                    <div className="text-[8px]" style={{ color: 'var(--accent)' }}>Terpilih (Pustaka Groovy)</div>
                </div>
            </div>
            <div className="border border-dashed rounded-lg p-3 text-center transition-colors" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Upload Musik (.mp3)</div>
                <div className="text-[8px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Maksimal ukuran file: 5MB</div>
            </div>
        </div>
    </div>
);

const GiftRegisterMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI AMPLOP DIGITAL</div>
        <div className="border rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
            <div className="rounded-lg p-2.5 flex items-start gap-2.5 border" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.05)', borderColor: 'rgba(var(--accent-rgb), 0.1)' }}>
                <div className="text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5" style={{ backgroundColor: 'var(--accent)' }}>BCA</div>
                <div>
                    <div className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>1234567890</div>
                    <div className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>a.n Budi Santoso</div>
                </div>
            </div>
            <button type="button" className="w-full py-1.5 border border-dashed rounded-lg text-xs font-semibold transition-colors" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                + Tambah Rekening Lain
            </button>
        </div>
    </div>
);

const CustomDomainMockup = () => (
    <div className="mt-4 p-4 rounded-xl max-w-sm text-left border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
        <div className="text-[11px] font-semibold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>SIMULASI CUSTOM DOMAIN</div>
        <div className="border rounded-lg p-3 space-y-2" style={{ backgroundColor: 'var(--section-base)', borderColor: 'var(--card-border)' }}>
            <div>
                <label className="block text-[10px] font-bold mb-0.5" style={{ color: 'var(--text-secondary)' }}>ALAMAT DOMAIN ANDA</label>
                <div className="flex gap-1.5">
                    <input type="text" readOnly value="budiandsiti.com" className="flex-1 text-xs border rounded px-2 py-1 focus:outline-none" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }} />
                    <button type="button" className="text-white px-3 py-1 rounded text-xs font-semibold hover:brightness-110" style={{ backgroundColor: 'var(--accent)' }}>Hubungkan</button>
                </div>
            </div>
            <div className="p-2 border rounded text-[9px] leading-tight" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent)' }}>
                <strong>Panduan DNS:</strong> Arahkan DNS <strong>A Record</strong> domain Anda ke IP <code>103.174.112.56</code>.
            </div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────
   FAQ DATABASE
   ───────────────────────────────────────────────────────── */
const FAQ_DATABASE = [
    {
        id: 'faq-aktif',
        category: 'mulai-cepat',
        question: '1. Berapa lama masa aktif undangan digital saya?',
        answer: 'Masa aktif undangan digital Anda tergantung pada jenis paket yang Anda pilih saat pendaftaran atau upgrade.',
        keywords: ['aktif', 'lama', 'durasi', 'expired', 'masa', 'berlaku', 'kapan', 'sisa', 'kadaluarsa', 'perpanjang'],
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
        keywords: ['share', 'wa', 'whatsapp', 'bagikan', 'kirim', 'tamu', 'link', 'broadcast', 'kirim wa', 'bagikan link'],
        steps: [
            'Masuk ke halaman "Tamu & RSVP" di panel samping.',
            'Pastikan Anda telah mengisi nama tamu di dalam daftar tamu.',
            'Di kolom daftar tamu, klik tombol "Kirim WA" di baris tamu yang dituju.',
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
        keywords: ['tamu', 'tambah', 'import', 'excel', 'guest', 'daftar', 'xlsx', 'unggah', 'masukkan', 'banyak tamu'],
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
        keywords: ['tema', 'ganti', 'desain', 'ubah', 'tampilan', 'theme', 'katalog', 'pilih', 'template', 'ganti tema'],
        steps: [
            'Buka menu "Desain & Tema" di panel samping.',
            'Pilih tab "Tema" di bagian atas halaman (jika belum terpilih).',
            'Jelajahi katalog tema yang tersedia. Anda bisa mengeklik tombol "Preview" untuk melihat simulasi tampilan langsung tema tersebut.',
            'Bila sudah menemukan tema yang cocok, klik tombol "Gunakan Tema". Desain undangan Anda akan seketika berubah mengikuti tema baru tersebut.'
        ],
        mockup: 'tema'
    },
    {
        id: 'faq-ganti-tema-limit',
        category: 'desain-tema',
        question: '5. Berapa kali saya bisa mengganti tema undangan digital?',
        answer: 'Tidak ada batasan frekuensi dalam hal penggantian tema pada platform kami. Anda bebas mengganti tema kapan pun.',
        keywords: ['berapa kali', 'ganti tema', 'limit tema', 'maksimal tema', 'bebas tema', 'kuota tema', 'jumlah ganti', 'tukar tema'],
        steps: [
            'Anda dapat mengganti tema undangan Anda secara UNLIMITED (Tanpa Batas) dan gratis kapan saja Anda inginkan selama masa aktif paket Anda.',
            'Anda bebas mengganti tema dari gaya adat ke gaya modern atau sebaliknya sebanyak ratusan kali.',
            'Seluruh data mempelai, foto galeri, musik, dan daftar tamu Anda akan tetap utuh dan aman tanpa terhapus saat Anda mengganti tema.'
        ],
        mockup: null
    },
    {
        id: 'faq-streaming',
        category: 'fitur-tambahan',
        question: '6. Bagaimana cara menambahkan link Live Streaming?',
        answer: 'Anda bisa menyematkan link siaran langsung (Live Streaming) acara pernikahan Anda agar kerabat yang berada jauh tetap dapat menyaksikan prosesi sakral.',
        keywords: ['streaming', 'live', 'youtube', 'zoom', 'siaran', 'langsung', 'video', 'link live', 'instagram', 'youtube live', 'streaming live'],
        steps: [
            'Masuk ke menu "Acara" di panel samping kiri.',
            'Gulir layar ke bawah hingga menemukan section formulir "Live Streaming".',
            'Aktifkan switch/toggle "Aktifkan Live Streaming".',
            'Pilih atau ketik Platform (seperti YouTube, Zoom, Instagram Live, dll).',
            'Masukkan URL link live streaming pada kolom yang disediakan (contoh: https://youtube.com/live/xxx).',
            'Klik tombol "Simpan Acara" di bagian bawah untuk menyimpan perubahan.'
        ],
        mockup: 'streaming'
    },
    {
        id: 'faq-no-photos',
        category: 'desain-tema',
        question: '7. Bagaimana cara mengatur agar undangan tidak menampilkan foto (tanpa foto)?',
        answer: 'Anda dapat membuat undangan minimalis yang bersih dengan menonaktifkan seluruh tampilan foto mempelai dan galeri.',
        keywords: ['tanpa foto', 'tidak ada foto', 'no foto', 'no photo', 'sembunyikan foto', 'tanpa gambar', 'foto mati', 'hide foto', 'polos'],
        steps: [
            'Buka menu "Desain & Tema" di panel samping kiri.',
            'Pilih tab "Pengaturan" di bagian kanan atas halaman.',
            'Cari opsi toggle/checkbox bernama "Tampilkan Foto Mempelai" dan "Tampilkan Galeri".',
            'Nonaktifkan (uncheck / toggle off) opsi tersebut.',
            'Klik "Simpan Pengaturan" di bawah. Seluruh halaman undangan akan otomatis hanya menampilkan teks informasi pernikahan tanpa ada foto mempelai.'
        ],
        mockup: null
    },
    {
        id: 'faq-sosmed',
        category: 'mulai-cepat',
        question: '8. Bagaimana cara menambah link media sosial di mempelai?',
        answer: 'Menambahkan media sosial (seperti Instagram) memungkinkan tamu undangan untuk langsung mengunjungi profil sosial pengantin pria atau wanita.',
        keywords: ['sosmed', 'social media', 'instagram', 'facebook', 'twitter', 'mempelai', 'username ig', 'sosial media', 'link ig', 'ig mempelai'],
        steps: [
            'Masuk ke menu "Mempelai" di panel samping kiri.',
            'Pada kolom data Pengantin Pria dan Pengantin Wanita, Anda akan menemukan input khusus untuk sosial media (misalnya: "Username Instagram").',
            'Ketik nama username Instagram Anda (contoh: budi_santoso atau @budi_santoso) di kolom tersebut.',
            'Klik tombol "Simpan" di bagian bawah. Ikon Instagram secara otomatis muncul di bawah profil masing-masing mempelai pada undangan digital.'
        ],
        mockup: null
    },
    {
        id: 'faq-ubah-bahasa',
        category: 'desain-tema',
        question: '9. Bagaimana cara mengubah bahasa pada undangan digital?',
        answer: 'Sistem mendukung multi-bahasa yang mempermudah tamu dari latar belakang daerah atau negara yang berbeda untuk membaca informasi undangan.',
        keywords: ['bahasa', 'language', 'inggris', 'indonesia', 'translate', 'terjemahan', 'ganti bahasa', 'sunda', 'jawa', 'english', 'indo'],
        steps: [
            'Masuk ke menu "Desain & Tema" di panel samping kiri, lalu klik tab "Pengaturan" di kanan atas.',
            'Temukan menu drop-down "Bahasa Undangan" (Language).',
            'Pilih bahasa yang diinginkan, seperti "Bahasa Indonesia" atau "English".',
            'Klik tombol "Simpan Pengaturan". Seluruh teks baku sistem (seperti tulisan "Save the Date", "Days", "Hours", dsb.) akan otomatis diterjemahkan.'
        ],
        mockup: null
    },
    {
        id: 'faq-teks-sambutan',
        category: 'mulai-cepat',
        question: '10. Bagaimana cara mengubah Teks Sambutan (Opening)?',
        answer: 'Anda dapat menyesuaikan teks salam pembuka, kata pengantar, atau kutipan ayat suci yang tampil di bagian awal undangan sesuai dengan kebutuhan.',
        keywords: ['teks sambutan', 'opening', 'sambutan', 'salam', 'pembuka', 'doa pembuka', 'ayat suci', 'kutipan', 'quran'],
        steps: [
            'Buka menu "Teks & Sambutan" di panel samping kiri.',
            'Edit kolom input "Salam Pembuka", "Kata Pengantar", atau "Kutipan Ayat" di bagian atas sesuai keinginan.',
            'Klik tombol "Simpan" di bawah masing-masing bagian untuk memperbarui tulisan di undangan.'
        ],
        mockup: null
    },
    {
        id: 'faq-teks-penutup',
        category: 'mulai-cepat',
        question: '11. Bagaimana cara mengubah Teks Penutup (Closing)?',
        answer: 'Tulis pesan terima kasih, doa restu keluarga, atau salam penutup di bagian akhir undangan Anda.',
        keywords: ['teks penutup', 'closing', 'penutup', 'salam penutup', 'doa penutup', 'terima kasih', 'hormat kami'],
        steps: [
            'Buka menu "Teks & Sambutan" di panel samping kiri.',
            'Gulir ke bagian paling bawah ke kolom "Teks Penutup / Doa".',
            'Edit kata-kata ucapan terima kasih dan doa penutup sesuai keinginan Anda.',
            'Klik tombol "Simpan" di bawah bagian penutup tersebut.'
        ],
        mockup: null
    },
    {
        id: 'faq-tambah-acara',
        category: 'mulai-cepat',
        question: '12. Bagaimana cara menambah acara baru (misalnya Ngunduh Mantu atau Akad)?',
        answer: 'Dashboard mempermudah penambahan beberapa agenda acara pernikahan Anda (seperti Akad Nikah, Resepsi, hingga Ngunduh Mantu) di halaman yang sama.',
        keywords: ['tambah acara', 'acara baru', 'ngunduh mantu', 'akad', 'resepsi', 'kegiatan', 'event baru', 'walimah', 'resepsi kedua'],
        steps: [
            'Buka menu "Acara" di panel samping kiri.',
            'Klik tombol "+ Tambah Acara" di bagian kanan atas halaman (jika kuota paket mendukung multi-event).',
            'Isi lengkap formulir acara baru: Nama Acara (misal: Ngunduh Mantu), Tanggal, Waktu Mulai/Selesai, Nama Gedung, Alamat Lengkap, dan link Google Maps.',
            'Klik tombol "Simpan Acara" di bagian bawah.'
        ],
        mockup: null
    },
    {
        id: 'faq-partikel',
        category: 'desain-tema',
        question: '13. Bagaimana cara menambahkan efek partikel (salju/sakura melayang)?',
        answer: 'Efek partikel menambahkan elemen animasi latar belakang yang dinamis seperti kelopak bunga sakura, salju, dedaunan, atau bubuk emas gugur.',
        keywords: ['partikel', 'efek', 'salju', 'bunga', 'daun', 'gugur', 'animasi', 'sakura', 'kelopak', 'hujan', 'melayang', 'background'],
        steps: [
            'Buka menu "Desain & Tema" di panel samping kiri.',
            'Pilih tab "Pengaturan" di bagian kanan atas halaman.',
            'Scroll ke bagian "Pengaturan Partikel / Animasi".',
            'Pilih jenis partikel yang Anda inginkan pada drop-down (sakura gugur, salju, daun melayang, dll.), atur jumlah partikel, lalu klik "Simpan Pengaturan". Efek partikel akan langsung aktif melayang di undangan digital.'
        ],
        mockup: null
    },
    {
        id: 'faq-rsvp',
        category: 'tamu-undangan',
        question: '14. Bagaimana cara mengecek konfirmasi kehadiran (RSVP) tamu?',
        answer: 'Secara default, fitur RSVP sudah aktif di bagian bawah undangan Anda dan rekapannya terhubung langsung ke panel admin Anda.',
        keywords: ['rsvp', 'kehadiran', 'hadir', 'tidak hadir', 'konfirmasi', 'melacak', 'tamu datang', 'status hadir', 'cek rsvp', 'rekap rsvp', 'siapa hadir'],
        steps: [
            'Buka menu "Tamu & RSVP" di panel samping kiri.',
            'Pada halaman utama Tamu, Anda akan disajikan statistik diagram ringkas kehadiran tamu (Hadir, Ragu, Tidak Hadir).',
            'Gulir ke bawah ke tabel daftar tamu untuk melihat status konfirmasi masing-masing nama tamu secara spesifik.'
        ],
        mockup: null
    },
    {
        id: 'faq-cek-ucapan',
        category: 'tamu-undangan',
        question: '15. Bagaimana cara mengecek dan mengelola ucapan/doa dari para tamu?',
        answer: 'Semua kiriman ucapan dan doa dari para tamu akan terkumpul di dalam guestbook terpadu yang dapat Anda pantau langsung.',
        keywords: ['cek ucapan', 'doa', 'guestbook', 'buku tamu', 'pesan tamu', 'ucapan tamu', 'kelola ucapan', 'hapus ucapan', 'doa restu'],
        steps: [
            'Buka menu "Tamu & RSVP" di panel samping, kemudian pilih tab "Ucapan & Doa" (atau langsung buka menu "Buku Tamu" di sidebar).',
            'Anda akan melihat seluruh daftar pesan ucapan doa restu yang dikirim oleh tamu.',
            'Anda dapat menghapus ucapan yang dirasa kurang pantas atau tidak sopan dengan mengeklik tombol "Hapus" di samping pesan tersebut agar tidak lagi muncul di undangan digital.'
        ],
        mockup: null
    },
    {
        id: 'faq-musik',
        category: 'desain-tema',
        question: '16. Bagaimana cara mengganti musik latar (Backsound)?',
        answer: 'Undangan digital Anda akan terasa lebih hidup dengan latar belakang musik yang romantis dan sesuai dengan selera Anda.',
        keywords: ['musik', 'lagu', 'backsound', 'suara', 'sound', 'mp3', 'audio', 'ganti lagu', 'autoplay', 'lagu latar'],
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
        question: '17. Bagaimana cara mengaktifkan amplop digital (kado pernikahan)?',
        answer: 'Fitur Amplop Digital memberikan kemudahan bagi para tamu undangan untuk mengirimkan kado/amplop secara non-tunai (cashless) secara langsung ke rekening Anda.',
        keywords: ['hadiah', 'amplop', 'rekening', 'transfer', 'bank', 'kado', 'digital', 'cashless', 'angpao', 'nomor rekening'],
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
        question: '18. Apakah saya bisa menggunakan domain sendiri (Custom Domain)?',
        answer: 'Ya, bagi pengguna paket Premium Pro, Anda dapat menggunakan domain pribadi (contoh: www.budiandsiti.com) alih-alih menggunakan link default.',
        keywords: ['domain', 'custom', 'nama', 'web', 'alamat', 'sendiri', 'dns', 'cname', 'a record', 'domain pribadi'],
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
        question: '19. Mengapa musik di undangan tidak otomatis berputar saat dibuka pertama kali?',
        answer: 'Hal ini terjadi karena adanya kebijakan privasi dan keamanan ketat pada browser modern yang melarang pemutaran audio otomatis (autoplay) sebelum pengguna berinteraksi dengan halaman.',
        keywords: ['musik', 'tidak', 'putar', 'bunyi', 'suara', 'autoplay', 'senyap', 'mati', 'browser', 'lagu mati'],
        steps: [
            'To mengatasi kendala aturan browser ini, undangan kami dirancang menggunakan halaman pembuka (Cover/Sampul) interaktif.',
            'Di halaman Cover tersebut, terdapat tombol "Buka Undangan".',
            'Ketika tamu undangan mengeklik tombol "Buka Undangan", browser akan mendeteksi interaksi pengguna secara sah, dan musik latar akan segera berputar secara otomatis.',
            'Kami sangat menyarankan Anda untuk selalu mengaktifkan fitur "Halaman Sampul (Cover)" di menu Desain agar musik latar dapat berputar dengan sempurna.'
        ],
        mockup: null
    },
    {
        id: 'faq-upgrade-paket',
        category: 'mulai-cepat',
        question: '20. Bagaimana cara mengupgrade paket undangan digital saya?',
        answer: 'Upgrade paket dilakukan untuk membuka batasan fitur seperti batas kuota tamu, fitur live streaming, custom domain, atau pustaka musik yang lebih kaya.',
        keywords: ['upgrade', 'paket', 'bayar', 'premium', 'beli', 'langganan', 'ganti paket', 'pro', 'gold', 'platinum'],
        steps: [
            'Klik menu "Upgrade" di panel samping kiri atas (dalam grup OVERVIEW).',
            'Pilih paket premium yang Anda inginkan (misalnya paket Platinum/Pro) dengan mengeklik tombol "Pilih Paket" di bawah kolom harga.',
            'Pilih metode pembayaran (Transfer Bank Manual atau Otomatis) dan ikuti panduan transfer nominal yang ditentukan.',
            'Kirimkan bukti bayar jika memilih manual. Paket Anda akan aktif secara instan begitu pembayaran terkonfirmasi oleh sistem.'
        ],
        mockup: null
    },
    {
        id: 'faq-qr-code',
        category: 'fitur-tambahan',
        question: '21. Bagaimana cara menggunakan fitur QR Code Presensi / Check-in Tamu?',
        answer: 'Fitur QR Code Presensi digunakan untuk mendata kedatangan tamu secara cepat di lokasi acara dengan memindai kode QR unik masing-masing tamu.',
        keywords: ['qr', 'qrcode', 'scan', 'presensi', 'checkin', 'hadir', 'kehadiran', 'penerima tamu', 'cetak qr'],
        steps: [
            'Pastikan Anda telah mengaktifkan opsi "QR Code Presensi" di menu "Desain & Tema" -> tab "Pengaturan" di dashboard Anda.',
            'Nama tamu yang didaftarkan pada daftar tamu otomatis memiliki QR Code unik masing-masing.',
            'Ketika tamu membuka undangan digital mereka, akan muncul tombol melayang ikon QR Code di layar undangan (untuk tema-tema yang mendukung).',
            'Tamu cukup mengeklik tombol tersebut untuk menampilkan kode QR mereka kepada penerima tamu.',
            'Petugas penerima tamu di lokasi dapat langsung memindai (scan) kode QR tersebut menggunakan kamera ponsel untuk mencatat kehadiran tamu secara real-time ke dalam sistem.'
        ],
        mockup: null
    },
    {
        id: 'faq-tambah-foto',
        category: 'mulai-cepat',
        question: '22. Bagaimana cara menambah foto baru ke dalam pustaka media/galeri?',
        answer: 'Anda dapat mengunggah foto baru (format JPG, PNG, atau WEBP) ke dalam pustaka media sebelum memasangnya sebagai foto mempelai, sampul, atau album galeri.',
        keywords: ['tambah foto', 'unggah foto', 'upload gambar', 'masukkan foto', 'galeri', 'pustaka media', 'media library'],
        steps: [
            'Masuk ke menu "Galeri & Media" di sidebar dashboard.',
            'Klik area bertuliskan "Upload Foto / Seret File Ke Sini" di bagian atas halaman.',
            'Pilih file foto dari penyimpanan komputer atau handphone Anda (maksimal ukuran 5MB per file).',
            'Tunggu hingga proses unggah selesai 100%.',
            'Foto baru Anda akan otomatis muncul di barisan pertama grid album media dan siap untuk digunakan di berbagai bagian undangan.'
        ],
        mockup: null
    },
    {
        id: 'faq-beda-album-galeri',
        category: 'desain-tema',
        question: '23. Apa perbedaan antara Album Galeri (Gallery) dan Pustaka Media?',
        answer: 'Pustaka Media adalah tempat penyimpanan/gudang seluruh foto yang Anda unggah ke sistem. Sedangkan Album Galeri adalah foto-foto pilihan yang sengaja Anda aktifkan untuk tampil secara khusus di halaman undangan.',
        keywords: ['beda album', 'galeri', 'gallery', 'pustaka media', 'tampil foto', 'album galeri', 'perbedaan'],
        steps: [
            'Pustaka Media menampung semua gambar yang Anda upload, baik yang digunakan sebagai foto mempelai, foto cover, maupun foto cadangan.',
            'Foto di Pustaka Media tidak akan tampil di undangan sebelum Anda memberikan centang aktif (Quick-Toggle) atau menghubungkannya ke bagian tertentu.',
            'Album Galeri adalah bagian section khusus di undangan digital yang menampilkan kompilasi foto-foto kebersamaan Anda dan pasangan.',
            'Untuk menampilkan foto di Album Galeri, cukup centang kotak di pojok kanan atas foto pada grid Pustaka Media.'
        ],
        mockup: null
    },
    {
        id: 'faq-cara-crop',
        category: 'desain-tema',
        question: '24. Bagaimana cara memotong (crop) foto mempelai atau sampul secara khusus?',
        answer: 'Untuk memotong atau mengkrop foto dengan rasio tertentu (seperti lingkaran untuk mempelai atau portrait untuk sampul), Anda dapat menggunakan fitur reposisi interaktif langsung di dashboard.',
        keywords: ['crop', 'krop', 'potong', 'pangkas', 'mempelai', 'lingkaran', 'bulat', 'potong foto'],
        steps: [
            'Buka menu "Galeri & Media" dan klik pada foto yang ingin Anda potong/crop.',
            'Klik tombol "Edit / Crop" atau lihat pada panel detail di sebelah kanan.',
            'Gunakan kontrol Zoom dan drag gambar langsung untuk mengarahkan fokus ke bagian yang ingin dipertahankan.',
            'Pilih preset cepat yang sesuai (seperti Fokus Wajah, Penuhi Lebar, atau Sesuaikan) jika ingin pemotongan otomatis.',
            'Klik "Simpan" atau "Terapkan Posisi" untuk memperbarui tampilan foto di undangan.'
        ],
        mockup: null
    },
    {
        id: 'faq-foto-tidak-pas',
        category: 'desain-tema',
        question: '25. Mengapa posisi foto saya terlihat tidak pas, terpotong, atau tidak rata?',
        answer: 'Hal ini biasanya disebabkan oleh perbedaan orientasi foto asli (landscape/lebar) dengan wadah tampilan undangan yang mayoritas berbentuk vertikal (portrait 9:16) untuk layar HP.',
        keywords: ['tidak pas', 'terpotong', 'miring', 'tidak rata', 'pecah', 'kepotong', 'posisi salah', 'gepeng', 'lonjong'],
        steps: [
            'Gunakan foto berorientasi Portrait (tegak) untuk hasil terbaik di halaman Sampul/Cover dan Pembuka.',
            'Jika menggunakan foto Landscape, gunakan fitur Reposisi Visual di Galeri untuk menggeser sumbu X/Y agar fokus gambar berada di tengah.',
            'Gunakan slider Zoom untuk memperkecil gambar jika bagian penting foto terpotong di luar bingkai.',
            'Gunakan tombol preset "Fokus Wajah" untuk menaikkan posisi fokus foto ke area atas bingkai agar kepala mempelai tidak terpotong.',
            'Pastikan ukuran file foto Anda tidak terlalu besar agar proses muat ulang reposisi di server berjalan lancar.'
        ],
        mockup: null
    },
    {
        id: 'faq-slideshow-cover',
        category: 'desain-tema',
        question: '26. Bagaimana cara mengaktifkan slideshow multi-foto pada Sampul atau Pembuka?',
        answer: 'Anda dapat mengaktifkan lebih dari satu foto untuk dipasang di bagian Sampul (Cover) atau Pembuka (Opening) secara bersamaan. Sistem akan otomatis menampilkan slideshow dengan efek transisi Ken Burns (zoom-out lambat) dan cross-fade (opacity) yang sangat mulus secara bergantian setiap 6 detik. Fitur premium ini juga sudah didukung di seluruh 12 tema undangan digital.',
        keywords: ['slideshow', 'multi-foto', 'banyak foto', 'sampul', 'cover', 'pembuka', 'opening', 'ken burns', 'ganti foto', 'slide', 'transisi'],
        steps: [
            'Masuk ke dashboard, lalu buka menu "Galeri & Media".',
            'Pilih foto yang ingin Anda jadikan Sampul/Pembuka.',
            'Pada detail pengaturan foto, aktifkan switch "Sampul Undangan (Cover)" atau "Foto Pembuka (Opening)".',
            'Ulangi langkah di atas untuk memilih foto ke-2, ke-3, dst. yang ingin Anda gabungkan ke dalam slideshow.',
            'Anda dapat melihat logo indikator "SAMPUL" atau "PEMBUKA" menyala di beberapa foto sekaligus pada grid galeri Anda.'
        ],
        mockup: null
    },
    {
        id: 'faq-reposition-preset',
        category: 'desain-tema',
        question: '27. Bagaimana cara memotong (crop) atau mengatur posisi foto agar pas dengan layar HP?',
        answer: 'Agar foto mempelai atau sampul tampil sempurna di layar HP tamu undangan, kami menyediakan fitur simulasi layar ponsel vertikal (9:16) interaktif. Anda dapat menggeser posisi foto secara langsung, mengatur zoom, atau menggunakan tombol preset edit cepat yang otomatis menyesuaikan rasio foto.',
        keywords: ['crop', 'krop', 'potong', 'geser', 'reposisi', 'posisi foto', 'wajah', 'fokus', 'zoom', 'preset', 'edit cepat', 'vertikal', 'layar hp'],
        steps: [
            'Buka menu "Galeri & Media" di dashboard Anda.',
            'Klik pada salah satu foto yang sudah terpasang as Sampul, Pembuka, atau Mempelai.',
            'Panel "Simulasi Tampilan HP" akan muncul. Anda dapat menggeser (drag) gambar secara langsung di layar HP simulator untuk menyesuaikan posisinya.',
            'Gunakan slider Zoom untuk memperbesar/memperkecil gambar, atau geser sumbu X/Y.',
            'Untuk edit cepat, klik salah satu tombol preset: "Fokus Wajah" (fokus area atas/wajah), "Penuhi Lebar" (memenuhi lebar layar), atau "Sesuaikan" (menampilkan seluruh gambar utuh).',
            'Klik "Terapkan Posisi" di bagian bawah untuk menyimpan perubahan.'
        ],
        mockup: null
    },
    {
        id: 'faq-bulk-toggle',
        category: 'desain-tema',
        question: '28. Bagaimana cara mengaktifkan atau menyembunyikan banyak foto sekaligus di album galeri?',
        answer: 'Jika Anda memiliki puluhan foto di pustaka media dan ingin mengelola status tampilnya di album undangan secara cepat, Anda dapat menggunakan fitur Quick-Toggle (Bulk Checkbox) tanpa harus membuka detail foto satu per satu.',
        keywords: ['centang', 'masal', 'bulk', 'banyak foto', 'aktifkan galeri', 'album', 'tampilkan foto', 'sembunyikan foto', 'cepat', 'checkbox'],
        steps: [
            'Masuk ke menu "Galeri & Media".',
            'Pada pojok kanan atas setiap kartu foto di grid pustaka, terdapat kotak centang (Checkbox).',
            'Cukup centang atau hilangkan centang pada kotak tersebut secara langsung.',
            'Foto yang dicentang akan otomatis berstatus aktif dan langsung tampil di halaman Album Galeri undangan digital Anda.',
            'Foto yang tidak dicentang akan tetap tersimpan di media library namun disembunyikan dari halaman undangan.'
        ],
        mockup: null
    }
];

// Stemming logic for smart search
const stemWord = (word) => {
    if (!word || word.length <= 1) return [word];
    let w = word.toLowerCase().trim();
    
    // Remove suffixes: -kan, -an, -i, -nya, -lah, -kah
    w = w.replace(/(kan|an|i|nya|lah|kah)$/, '');
    
    const roots = new Set([w]);
    
    // Prefix rules
    if (w.startsWith('meng') || w.startsWith('peng')) {
        const rest = w.slice(4);
        roots.add(rest);
        roots.add('k' + rest);
    } else if (w.startsWith('meny') || w.startsWith('peny')) {
        const rest = w.slice(4);
        roots.add('s' + rest);
        roots.add(rest);
    } else if (w.startsWith('men') || w.startsWith('pen')) {
        const rest = w.slice(3);
        roots.add(rest);
        if (/^[aeiou]/.test(rest)) {
            roots.add('t' + rest);
        }
    } else if (w.startsWith('mem') || w.startsWith('pem')) {
        const rest = w.slice(3);
        roots.add(rest);
        if (/^[aeiou]/.test(rest)) {
            roots.add('p' + rest);
        }
    } else if (w.startsWith('me') || w.startsWith('pe')) {
        roots.add(w.slice(2));
    } else if (w.startsWith('di')) {
        roots.add(w.slice(2));
    } else if (w.startsWith('ber') || w.startsWith('per')) {
        roots.add(w.slice(3));
    } else if (w.startsWith('ter')) {
        roots.add(w.slice(3));
    } else if (w.startsWith('ke')) {
        roots.add(w.slice(2));
    }
    
    return Array.from(roots).filter(r => r.length > 1);
};

const isMatch = (targetText, queryText) => {
    if (!queryText) return true;
    const cleanQuery = queryText.toLowerCase().trim();
    if (!targetText) return false;
    const cleanTarget = targetText.toLowerCase();

    // 1. Simple substring check first
    if (cleanTarget.includes(cleanQuery)) return true;

    // 2. Tokenize and stem query
    const queryTokens = cleanQuery.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ").split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) return false;

    // Tokenize target
    const targetTokens = cleanTarget.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, " ").split(/\s+/).filter(Boolean);

    // Get all possible roots for target tokens
    const targetRoots = new Set();
    targetTokens.forEach(token => {
        stemWord(token).forEach(r => targetRoots.add(r));
    });

    // For query, we want ALL words in query to have a matching root in the target text
    return queryTokens.every(qToken => {
        const qRoots = stemWord(qToken);
        return qRoots.some(qRoot => targetRoots.has(qRoot) || cleanTarget.includes(qRoot));
    });
};

/* ─────────────────────────────────────────────────────────
   THEME CONFIGS
   ───────────────────────────────────────────────────────── */
const THEMES_CFG = {
    default: {
        heroBg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        accent: '#f59e0b',
        accentDark: '#d97706',
        accentRgb: '245,158,11',
        navBg: 'rgba(15,23,42,0.85)',
        sectionAlt: '#0f172a',
        sectionBase: '#111827',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#f1f5f9',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        footerBg: '#080d18',
        tagBg: 'rgba(245,158,11,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    },
    elegant: {
        heroBg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
        accent: '#d97706',
        accentDark: '#b45309',
        accentRgb: '217,119,6',
        navBg: 'rgba(28,25,23,0.9)',
        sectionAlt: '#1c1917',
        sectionBase: '#231f1c',
        cardBg: 'rgba(255,255,255,0.04)',
        cardBorder: 'rgba(255,255,255,0.08)',
        textPrimary: '#fef3c7',
        textSecondary: '#d6d3d1',
        textMuted: '#78716c',
        footerBg: '#0c0a09',
        tagBg: 'rgba(217,119,6,0.12)',
        tagColor: '#fcd34d',
        isDark: true,
    },
    minimal: {
        heroBg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
        accent: '#0ea5e9',
        accentDark: '#0284c7',
        accentRgb: '14,165,233',
        navBg: 'rgba(255,255,255,0.92)',
        sectionAlt: '#f8fafc',
        sectionBase: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        footerBg: '#0f172a',
        tagBg: 'rgba(14,165,233,0.1)',
        tagColor: '#0284c7',
        isDark: false,
    },
    colorful: {
        heroBg: 'linear-gradient(135deg, #2d1b69 0%, #1a0038 50%, #2d1b69 100%)',
        accent: '#a855f7',
        accentDark: '#9333ea',
        accentRgb: '168,85,247',
        navBg: 'rgba(45,27,105,0.85)',
        sectionAlt: '#1a0038',
        sectionBase: '#200844',
        cardBg: 'rgba(255,255,255,0.05)',
        cardBorder: 'rgba(168,85,247,0.2)',
        textPrimary: '#f5f3ff',
        textSecondary: '#c4b5fd',
        textMuted: '#7c3aed',
        footerBg: '#0d001e',
        tagBg: 'rgba(168,85,247,0.15)',
        tagColor: '#d8b4fe',
        isDark: true,
    },
};

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────── */
export default function ResellerFaq({ reseller }) {
    const T = THEMES_CFG[reseller.template] || THEMES_CFG.default;

    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('semua');
    const [activeId, setActiveId] = useState('faq-aktif'); // Accordion single state
    const [isListening, setIsListening] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);

    const hasContact = !!(reseller.footer_whatsapp || reseller.footer_phone || reseller.footer_email || reseller.footer_instagram || reseller.footer_tiktok || reseller.footer_address);

    const getWhatsappLink = (number, text = 'Halo, saya ingin bertanya tentang undangan digital.') => {
        if (!number) return '#';
        let cleaned = number.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        } else if (cleaned.startsWith('8')) {
            cleaned = '62' + cleaned;
        }
        return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
    };

    const handleContactClick = () => {
        const contacts = [];
        if (reseller.footer_whatsapp) contacts.push({ type: 'wa', val: reseller.footer_whatsapp });
        if (reseller.footer_phone) contacts.push({ type: 'phone', val: reseller.footer_phone });
        if (reseller.footer_email) contacts.push({ type: 'email', val: reseller.footer_email });

        if (contacts.length === 1) {
            const c = contacts[0];
            if (c.type === 'wa') {
                window.open(getWhatsappLink(c.val), '_blank', 'noopener,noreferrer');
                return;
            } else if (c.type === 'phone') {
                window.location.href = `tel:${c.val}`;
                return;
            } else if (c.type === 'email') {
                window.location.href = `mailto:${c.val}`;
                return;
            }
        }
        setShowContactModal(true);
    };

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

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
        setActiveId(prev => prev === id ? null : id);
    };

    // Voice Search Handler using Web Speech API
    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Browser Anda tidak mendukung pencarian suara. Silakan gunakan Google Chrome atau browser modern lainnya.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID'; // Set lang to Indonesian
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            const cleanedText = speechToText.replace(/\.$/, ''); // Remove trailing dot if present
            setSearchQuery(cleanedText);
        };

        recognition.start();
    };

    // Filter FAQs based on active tab and search query
    const filteredFAQs = useMemo(() => {
        return FAQ_DATABASE.filter(faq => {
            // Filter by Category
            if (activeCategory !== 'semua' && faq.category !== activeCategory) {
                return false;
            }
            // Filter by Search Query (question, answer, keywords, steps)
            if (searchQuery.trim() !== '') {
                const matchesQuestion = isMatch(faq.question, searchQuery);
                const matchesAnswer = isMatch(faq.answer, searchQuery);
                const matchesKeywords = faq.keywords ? faq.keywords.some(kw => isMatch(kw, searchQuery)) : false;
                const matchesSteps = faq.steps ? faq.steps.some(step => isMatch(step, searchQuery)) : false;
                return matchesQuestion || matchesAnswer || matchesKeywords || matchesSteps;
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

    const registerUrl = `${reseller.reseller_url || ''}/register?ref=${reseller.ref}`;
    const loginUrl = `${reseller.reseller_url || ''}/login`;

    const getThemesUrl = () => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/r/')) return `/r/${reseller.ref}/themes`;
        return '/katalog-tema';
    };

    const siteTitle = `FAQ & Panduan — ${reseller.brand_name}`;
    const siteMotto = reseller.site_motto || 'Pusat bantuan dan panduan pembuatan undangan digital.';

    /* CSS variables injected inline */
    const cssVars = `
        :root {
            --accent: ${T.accent};
            --accent-dark: ${T.accentDark};
            --accent-rgb: ${T.accentRgb};
            --hero-bg: ${T.heroBg};
            --nav-bg: ${T.navBg};
            --section-alt: ${T.sectionAlt};
            --section-base: ${T.sectionBase};
            --card-bg: ${T.cardBg};
            --card-border: ${T.cardBorder};
            --text-primary: ${T.textPrimary};
            --text-secondary: ${T.textSecondary};
            --text-muted: ${T.textMuted};
            --footer-bg: ${T.footerBg};
            --tag-bg: ${T.tagBg};
            --tag-color: ${T.tagColor};
        }
    `;

    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={siteMotto} />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={siteMotto} />
                {reseller.brand_logo && <meta property="og:image" content={reseller.brand_logo} />}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
                <style>{cssVars}</style>
                <style>{landingStyles}</style>
            </Head>

            {/* Background orbs */}
            <div className="rl-hero__orb rl-hero__orb--1" />
            <div className="rl-hero__orb rl-hero__orb--2" />

            {/* ═══ NAVBAR ═══ */}
            <nav className={`rl-nav ${scrolled ? 'rl-nav--scrolled' : ''}`}>
                <div className="rl-nav__inner">
                    <Link href={`/r/${reseller.ref}`} className="rl-nav__brand">
                        {reseller.brand_logo ? (
                            <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-nav__logo-img" />
                        ) : (
                            <div className="rl-nav__logo-placeholder">
                                {reseller.brand_name?.charAt(0)}
                            </div>
                        )}
                        <span className="rl-nav__brand-name">{reseller.brand_name}</span>
                    </Link>
                    <div className="rl-nav__actions">
                        {hasContact && (
                            <button onClick={handleContactClick} className="rl-btn rl-btn--ghost rl-nav__contact-btn">
                                Hubungi Kami
                            </button>
                        )}
                        <a href={loginUrl} className="rl-btn rl-btn--ghost">
                            Masuk
                        </a>
                        <a href={registerUrl} className="rl-btn rl-btn--accent">
                            Buat Undangan
                        </a>
                    </div>
                </div>
            </nav>

            {/* ═══ MAIN CONTENT ═══ */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 pb-20 text-center" style={{ zIndex: 1, position: 'relative' }}>
                
                {/* Back button */}
                <div className="mb-8 text-left">
                    <Link href={`/r/${reseller.ref}`} className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-90" style={{ color: 'var(--accent)' }}>
                        <Icon d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-4 h-4" /> Kembali ke Beranda
                    </Link>
                </div>

                {/* ═══ Header Banner Section (adaptation of Tutorial.jsx) ═══ */}
                <div className="text-center py-10 rounded-3xl text-white px-6 relative overflow-hidden shadow-lg mb-10"
                     style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>
                    <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -right-12 w-48 h-48 rounded-full bg-white/5" />
                    
                    <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight mb-2.5 relative z-10" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Pusat Panduan & FAQ</h1>
                    <p className="text-xs lg:text-sm text-white/95 max-w-md mx-auto relative z-10 leading-relaxed">
                        Cari solusi cepat dan panduan langkah-demi-langkah untuk mempermudah Anda dalam mengelola undangan pernikahan digital.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-md mx-auto relative z-10">
                        <div className="rl-faq-search-box">
                            {/* Search Icon */}
                            <div className="text-gray-400 mr-2 flex-shrink-0 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            {/* Search Input */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari panduan (misal: 'tema', 'wa', 'musik')..."
                                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-0 focus:border-transparent border-none p-1 min-w-0"
                            />
                            
                            {/* Actions (Voice search & clear) */}
                            <div className="flex items-center gap-1.5 ml-2 flex-shrink-0 z-20">
                                {isListening ? (
                                    <button
                                        type="button"
                                        onClick={handleVoiceSearch}
                                        className="p-1.5 rounded-full bg-red-100 text-red-600 animate-pulse transition-colors"
                                        title="Sedang mendengarkan... Klik untuk berhenti"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleVoiceSearch}
                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Cari dengan suara"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </button>
                                )}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                        title="Hapus pencarian"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Category Tabs ═══ */}
                <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap pb-3 gap-3 mb-8 justify-start md:justify-center scrollbar-none">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setActiveCategory(cat.id)}
                                className={`rl-faq-tab ${isActive ? 'rl-faq-tab--active' : ''}`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* ═══ FAQ Accordion List ═══ */}
                <div className="space-y-4 mb-10 text-left">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq, idx) => {
                            const isOpen = activeId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`rl-faq-card ${isOpen ? 'rl-faq-card--open' : ''}`}
                                >
                                    {/* Accordion Trigger */}
                                    <button
                                        type="button"
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="rl-faq-trigger"
                                    >
                                        <span className="rl-faq-question">
                                            {idx + 1}. {faq.question.replace(/^\d+\.\s*/, '')}
                                        </span>
                                        <span className="rl-faq-icon-wrap">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Accordion Content */}
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                            isOpen ? 'max-h-[1200px]' : 'max-h-0'
                                        }`}
                                    >
                                        <div className="rl-faq-content space-y-5">
                                            
                                            {/* Description & Steps */}
                                            <div 
                                                onClick={() => toggleAccordion(faq.id)}
                                                className="cursor-pointer hover:text-[var(--text-primary)] transition-colors space-y-4 group relative pr-6"
                                                title="Klik area teks ini untuk menutup panduan"
                                            >
                                                {/* Answer Description */}
                                                <p className="font-semibold relative pr-8" style={{ color: 'var(--text-primary)' }}>
                                                    {faq.answer}
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 transition-colors text-xl font-bold group-hover:text-[var(--accent)] text-gray-400">
                                                        &times;
                                                    </span>
                                                </p>

                                                {/* Step-by-Step */}
                                                <div className="space-y-2">
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">LANGKAH-LANGKAH PANDUAN</div>
                                                    <ol className="rl-faq-steps text-sm">
                                                        {faq.steps.map((step, idx) => (
                                                            <li key={idx}>
                                                                <span>{step}</span>
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>

                                                <div className="text-[10px] text-gray-400 italic pt-1 flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Tip: Klik area teks ini untuk menutup panduan.
                                                </div>
                                            </div>

                                            {/* Visual mockup (if any) */}
                                            {faq.mockup && (
                                                <div className="pt-4 border-t border-[var(--card-border)]" onClick={(e) => e.stopPropagation()}>
                                                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">PANDUAN VISUAL</div>
                                                    {renderVisualMockup(faq.mockup)}
                                                </div>
                                            )}

                                            {/* Explicit Close Button */}
                                            <div className="flex justify-end pt-3 border-t border-[var(--card-border)]">
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); toggleAccordion(faq.id); }}
                                                    className="px-3.5 py-1.5 bg-gray-50/10 hover:bg-gray-50/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)] rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                                >
                                                    <svg className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    Tutup Panduan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        /* No Results */
                        <div className="border rounded-xl p-10 text-center shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400" style={{ backgroundColor: 'var(--section-alt)' }}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pertanyaan Tidak Ditemukan</h3>
                            <p className="text-xs mt-1.5 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                                Maaf, kami tidak dapat menemukan panduan dengan kata kunci "{searchQuery}". Coba gunakan kata kunci umum lainnya seperti <strong>'tema'</strong>, <strong>'wa'</strong>, atau <strong>'streaming'</strong>.
                            </p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); setActiveCategory('semua'); }}
                                className="mt-4 px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                                style={{ background: 'var(--accent)' }}
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>

                {/* ═══ Contact Support Card (dynamically linked to Reseller's WhatsApp support) ═══ */}
                {reseller.footer_whatsapp && (
                    <div className="rl-faq-support-card shadow-sm">
                        <div>
                            <h4 className="rl-faq-support-title">Masih Butuh Bantuan Tambahan?</h4>
                            <p className="rl-faq-support-desc">Jika Anda tidak menemukan solusi di atas, tim support kami siap membantu Anda secara langsung via WhatsApp.</p>
                        </div>
                        <a
                            href={getWhatsappLink(reseller.footer_whatsapp, `Halo Admin ${reseller.brand_name}, saya butuh bantuan terkait pengaturan/pembuatan undangan digital saya.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rl-faq-support-btn"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Hubungi Support WhatsApp
                        </a>
                    </div>
                )}
            </main>

            {/* ═══ FOOTER ═══ */}
            <footer className="rl-footer">
                <div className="rl-footer__inner">
                    <div className="rl-footer__grid">
                        {/* Column 1: Brand Info */}
                        <div className="rl-footer__col">
                            <div className="rl-footer__brand">
                                {reseller.brand_logo ? (
                                    <img src={reseller.brand_logo} alt={reseller.brand_name} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'contain' }} />
                                ) : (
                                    <div className="rl-footer__logo-placeholder">{reseller.brand_name?.charAt(0)}</div>
                                )}
                                <div>
                                    <div className="rl-footer__brand-name">{reseller.brand_name}</div>
                                    <div className="rl-footer__brand-tagline">Undangan Digital Premium</div>
                                </div>
                            </div>
                            <p className="rl-footer__desc-text">
                                {reseller.footer_description || 'Platform pembuatan undangan digital pernikahan premium yang cepat, mudah, dan elegan.'}
                            </p>
                            <div className="rl-footer__socials">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="Instagram">
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-footer__social-link" title="TikTok">
                                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div className="rl-footer__col">
                            <h4 className="rl-footer__title">Tautan Cepat</h4>
                            <div className="rl-footer__links-stack">
                                <Link href={`/r/${reseller.ref}`} className="rl-footer__link">Beranda</Link>
                                <Link href={getThemesUrl()} className="rl-footer__link">Katalog Tema</Link>
                                <a href={registerUrl} className="rl-footer__link">Daftar Gratis</a>
                                <a href={loginUrl} className="rl-footer__link">Masuk ke Akun</a>
                                {hasContact && (
                                    <button onClick={handleContactClick} className="rl-footer__link-btn">Hubungi Kami</button>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Contact Info */}
                        {hasContact && (
                            <div className="rl-footer__col">
                                <h4 className="rl-footer__title">Hubungi Kami</h4>
                                <div className="rl-footer__contacts">
                                    {reseller.footer_whatsapp && (
                                        <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" width="16" height="16" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                            <span>WhatsApp: {reseller.footer_whatsapp}</span>
                                        </a>
                                    )}
                                    {reseller.footer_phone && (
                                        <a href={`tel:${reseller.footer_phone}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                            <span>Telepon: {reseller.footer_phone}</span>
                                        </a>
                                    )}
                                    {reseller.footer_email && (
                                        <a href={`mailto:${reseller.footer_email}`} className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                            <span>Email: {reseller.footer_email}</span>
                                        </a>
                                    )}
                                    {reseller.footer_address && (
                                        <div className="rl-footer__contact-item">
                                            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                            <span>{reseller.footer_address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="rl-footer__bottom">
                        <div className="rl-footer__copy">
                            © {new Date().getFullYear()} {reseller.brand_name}. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Contact Button */}
            {hasContact && (
                <button className="rl-floating-contact" onClick={handleContactClick} title="Hubungi Kami">
                    <span className="rl-floating-contact__pulse" />
                    <span className="rl-floating-contact__icon">
                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
                    </span>
                    <span className="rl-floating-contact__text">Hubungi Kami</span>
                </button>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="rl-modal-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="rl-modal-card" onClick={e => e.stopPropagation()}>
                        <button className="rl-modal-close" onClick={() => setShowContactModal(false)}>×</button>
                        <div className="rl-modal-header">
                            {reseller.brand_logo ? (
                                <img src={reseller.brand_logo} alt={reseller.brand_name} className="rl-modal-logo" />
                            ) : (
                                <div className="rl-modal-logo-placeholder">
                                    {reseller.brand_name?.charAt(0)}
                                </div>
                            )}
                            <h3 className="rl-modal-title">Hubungi {reseller.brand_name}</h3>
                            <p className="rl-modal-desc">
                                {reseller.footer_description || 'Silakan hubungi kami untuk informasi lebih lanjut seputar pembuatan undangan digital.'}
                            </p>
                        </div>
                        <div className="rl-modal-body">
                            {reseller.footer_whatsapp && (
                                <a href={getWhatsappLink(reseller.footer_whatsapp)} target="_blank" rel="noopener noreferrer" className="rl-contact-row rl-contact-row--wa">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: 22, height: 22 }}><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.952-4.43 9.955-9.885.002-2.643-1.019-5.127-2.87-6.983-1.852-1.855-4.316-2.877-6.97-2.878-5.49 0-9.953 4.43-9.957 9.886-.002 2.125.567 4.197 1.65 6.023L2.098 21.95l6.549-1.706c.001-.001 0 0 0 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">WhatsApp Chat</span>
                                        <span className="rl-contact-value">{reseller.footer_whatsapp}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_phone && (
                                <a href={`tel:${reseller.footer_phone}`} className="rl-contact-row rl-contact-row--phone">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.117-6.942-6.942l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Telepon Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_phone}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_email && (
                                <a href={`mailto:${reseller.footer_email}`} className="rl-contact-row rl-contact-row--email">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Email Dukungan</span>
                                        <span className="rl-contact-value">{reseller.footer_email}</span>
                                    </div>
                                </a>
                            )}
                            {reseller.footer_address && (
                                <div className="rl-contact-row rl-contact-row--address">
                                    <div className="rl-contact-icon">
                                        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 20, height: 20 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z"/></svg>
                                    </div>
                                    <div className="rl-contact-info">
                                        <span className="rl-contact-label">Alamat Kantor</span>
                                        <span className="rl-contact-value" style={{ whiteSpace: 'pre-wrap' }}>{reseller.footer_address}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        {(reseller.footer_instagram || reseller.footer_tiktok) && (
                            <div className="rl-modal-footer">
                                {reseller.footer_instagram && (
                                    <a href={`https://instagram.com/${reseller.footer_instagram}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="Instagram">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
                                    </a>
                                )}
                                {reseller.footer_tiktok && (
                                    <a href={`https://tiktok.com/@${reseller.footer_tiktok}`} target="_blank" rel="noopener noreferrer" className="rl-social-icon" title="TikTok">
                                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.13V9.25A6.33 6.33 0 0 0 5 10.12a6.34 6.34 0 0 0 6.13 6.55 6.34 6.34 0 0 0 6.13-6.55V8.16a7.65 7.65 0 0 0 4.31 1.33V6.69z"/></svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

/* ─────────────────────────────────────────────────────────
   CSS STYLES (injected via <style>)
   ───────────────────────────────────────────────────────── */
const landingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--section-base); color: var(--text-primary); }

/* ── NAVBAR ── */
.rl-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: transparent;
    transition: all 0.35s ease;
}
.rl-nav--scrolled {
    background: var(--nav-bg);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.2);
}
.rl-nav__inner {
    max-width: 1280px; margin: 0 auto; padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
}
.rl-nav__brand { display: flex; align-items: center; gap: 0.625rem; text-decoration: none; }
.rl-nav__logo-img { width: 40px; height: 40px; border-radius: 12px; object-fit: contain; }
.rl-nav__logo-placeholder {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-nav__brand-name { font-size: 1.125rem; font-weight: 700; color: var(--text-primary); }
.rl-nav__actions { display: flex; align-items: center; gap: 0.75rem; }

/* ── BUTTONS ── */
.rl-btn { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: all 0.2s ease; border: none; cursor: pointer; }
.rl-btn--ghost { background: transparent; color: var(--text-secondary); }
.rl-btn--ghost:hover { color: var(--text-primary); background: rgba(255,255,255,0.06); }
.rl-btn--accent { background: linear-gradient(135deg, var(--accent), var(--accent-dark)); color: #fff; box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.3); }
.rl-btn--accent:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4); }

/* ── ORBS ── */
.rl-hero__orb {
    position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
}
.rl-hero__orb--1 { width: 500px; height: 500px; background: rgba(var(--accent-rgb), 0.08); top: 0; left: -100px; }
.rl-hero__orb--2 { width: 400px; height: 400px; background: rgba(139,92,246,0.06); bottom: 0; right: -100px; }

/* ── FOOTER ── */
.rl-footer { background: var(--footer-bg); padding: 4.5rem 0 2.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
.rl-footer__inner { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
.rl-footer__grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; margin-bottom: 3.5rem; }
.rl-footer__col { display: flex; flex-direction: column; gap: 1.25rem; }
.rl-footer__brand { display: flex; align-items: center; gap: 0.75rem; }
.rl-footer__logo-placeholder {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 16px; color: #fff;
}
.rl-footer__brand-name { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
.rl-footer__brand-tagline { font-size: 0.75rem; color: var(--text-muted); }
.rl-footer__desc-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; max-width: 320px; text-align: left; }
.rl-footer__socials { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.rl-footer__social-link {
    width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border);
    display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
    transition: all 0.2s ease; background: var(--card-bg); text-decoration: none;
}
.rl-footer__social-link:hover { color: var(--accent); border-color: var(--accent); transform: translateY(-2px); }
.rl-footer__title { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; text-align: left; }
.rl-footer__links-stack { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-footer__link { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__link:hover { color: var(--accent); }
.rl-footer__link-btn { font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; background: none; border: none; padding: 0; cursor: pointer; text-align: left; font-weight: inherit; font-family: inherit; }
.rl-footer__link-btn:hover { color: var(--accent); }
.rl-footer__contacts { display: flex; flex-direction: column; gap: 0.875rem; }
.rl-footer__contact-item { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; transition: color 0.2s; text-align: left; }
.rl-footer__contact-item svg { flex-shrink: 0; margin-top: 0.15rem; }
.rl-footer__contact-item:hover { color: var(--text-primary); }
.rl-footer__bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
.rl-footer__copy { font-size: 0.8125rem; color: var(--text-muted); }

/* ── NAV HUBUNGI KAMI ── */
.rl-nav__contact-btn { display: inline-flex; }

/* ── FLOATING CONTACT ── */
.rl-floating-contact {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 90;
    display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem;
    background: #25d366; color: #fff; border: none; border-radius: 100px;
    font-weight: 700; font-size: 0.875rem; cursor: pointer;
    box-shadow: 0 8px 30px rgba(37,211,102,0.4); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.rl-floating-contact:hover {
    transform: translateY(-4px) scale(1.03); box-shadow: 0 12px 35px rgba(37,211,102,0.5);
}
.rl-floating-contact__pulse {
    position: absolute; inset: 0; border-radius: 100px;
    box-shadow: 0 0 0 0 rgba(37,211,102,0.6);
    animation: rl-pulse-wa 2s infinite; pointer-events: none;
}
@keyframes rl-pulse-wa {
    0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.7); }
    70% { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
}
.rl-floating-contact__icon { display: flex; align-items: center; justify-content: center; }

/* ── MODAL ── */
.rl-modal-overlay {
    position: fixed; inset: 0; z-index: 200; background: rgba(8,13,24,0.7);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    display: flex; align-items: center; justify-content: center; padding: 1.5rem;
    animation: rl-fade-in 0.25s ease-out;
}
.rl-modal-card {
    background: #0f172a; border: 1px solid rgba(255,255,255,0.08);
    width: 100%; max-width: 440px; border-radius: 24px; padding: 2.25rem;
    position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    animation: rl-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    color: #f1f5f9;
}
.rl-modal-close {
    position: absolute; top: 1.25rem; right: 1.25rem; width: 32px; height: 32px;
    border-radius: 50%; background: rgba(255,255,255,0.05); border: none;
    color: #94a3b8; font-size: 20px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
}
.rl-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }
.rl-modal-header { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.75rem; }
.rl-modal-logo { width: 56px; height: 56px; border-radius: 16px; object-fit: contain; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.1); padding: 4px; }
.rl-modal-logo-placeholder {
    width: 56px; height: 56px; border-radius: 16px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 20px; color: #fff;
}
.rl-modal-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
.rl-modal-desc { font-size: 0.8125rem; color: #94a3b8; line-height: 1.5; }
.rl-modal-body { display: flex; flex-direction: column; gap: 0.75rem; }
.rl-contact-row {
    display: flex; align-items: center; gap: 1rem; padding: 0.875rem 1.25rem;
    border-radius: 16px; text-decoration: none; transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.05);
}
.rl-contact-row:hover { transform: translateY(-2px); }
.rl-contact-row--wa { background: rgba(37,211,102,0.08); color: #25d366; border-color: rgba(37,211,102,0.15); }
.rl-contact-row--wa:hover { background: rgba(37,211,102,0.12); box-shadow: 0 4px 15px rgba(37,211,102,0.15); }
.rl-contact-row--phone { background: rgba(59,130,246,0.08); color: #60a5fa; border-color: rgba(59,130,246,0.15); }
.rl-contact-row--phone:hover { background: rgba(59,130,246,0.12); box-shadow: 0 4px 15px rgba(59,130,246,0.15); }
.rl-contact-row--email { background: rgba(99,102,241,0.08); color: #818cf8; border-color: rgba(99,102,241,0.15); }
.rl-contact-row--email:hover { background: rgba(99,102,241,0.12); box-shadow: 0 4px 15px rgba(99,102,241,0.15); }
.rl-contact-row--address { background: rgba(168,85,247,0.08); color: #c084fc; border-color: rgba(168,85,247,0.15); cursor: default; }
.rl-contact-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); }
.rl-contact-info { display: flex; flex-direction: column; text-align: left; }
.rl-contact-label { font-size: 0.6875rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; letter-spacing: 0.05em; }
.rl-contact-value { font-size: 0.875rem; font-weight: 600; color: #fff; }
.rl-modal-footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: center; gap: 1rem; }
.rl-social-icon {
    width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center; color: #94a3b8;
    background: rgba(255,255,255,0.02); transition: all 0.2s; text-decoration: none;
}
.rl-social-icon:hover { color: #fff; border-color: rgba(255,255,255,0.2); transform: scale(1.05); }

@keyframes rl-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rl-slide-up { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

@media (max-width: 768px) {
    .rl-footer__grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .rl-footer__desc-text { max-width: none; }
    .rl-footer__bottom { flex-direction: column; gap: 1rem; text-align: center; }
}

/* ── FAQ INTERACTIVE STYLES ── */
.rl-faq-search-box {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    padding: 0.5rem 1.25rem;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}
.rl-faq-search-box:focus-within {
    box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.12), 0 0 0 3px rgba(255, 255, 255, 0.35);
    transform: translateY(-1px);
}

.rl-faq-tab {
    padding: 0.625rem 1.25rem;
    border-radius: 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s ease;
    flex-shrink: 0;
    border: 1px solid var(--card-border);
    background: var(--card-bg);
    color: var(--text-secondary);
    cursor: pointer;
}
.rl-faq-tab:hover {
    color: var(--text-primary);
    background: rgba(var(--accent-rgb), 0.08);
    border-color: rgba(var(--accent-rgb), 0.2);
}
.rl-faq-tab--active {
    background: var(--accent) !important;
    color: #fff !important;
    border-color: transparent !important;
    box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.25);
}

.rl-faq-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.03);
    margin-bottom: 1rem;
}
.rl-faq-card:hover {
    border-color: rgba(var(--accent-rgb), 0.2);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}
.rl-faq-card--open {
    border-left: 4px solid var(--accent);
    border-color: rgba(var(--accent-rgb), 0.25) rgba(var(--accent-rgb), 0.25) rgba(var(--accent-rgb), 0.25) var(--accent);
    background: var(--card-bg);
    box-shadow: 0 12px 30px -5px rgba(0, 0, 0, 0.08);
}

.rl-faq-trigger {
    padding: 1.125rem 1.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    transition: background-color 0.2s;
    outline: none;
}
.rl-faq-trigger:hover {
    background: rgba(var(--accent-rgb), 0.02);
}

.rl-faq-question {
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--text-primary);
    transition: color 0.2s;
    padding-right: 1rem;
}
.rl-faq-card--open .rl-faq-question {
    color: var(--accent);
}

.rl-faq-icon-wrap {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background: rgba(var(--accent-rgb), 0.05);
    color: var(--text-secondary);
}
.rl-faq-card--open .rl-faq-icon-wrap {
    transform: rotate(180deg);
    background: var(--accent);
    color: #fff;
}

.rl-faq-content {
    padding: 1.25rem 1.5rem 1.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.6;
    border-top: 1px solid var(--card-border);
    background: rgba(var(--accent-rgb), 0.01);
}

.rl-faq-steps {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.rl-faq-steps li {
    padding-left: 0.25rem;
    color: var(--text-secondary);
}
.rl-faq-steps li::marker {
    color: var(--accent);
    font-weight: 700;
}

.rl-faq-support-card {
    padding: 1.5rem 1.75rem;
    border-radius: 20px;
    border: 1px solid rgba(var(--accent-rgb), 0.15);
    background: rgba(var(--accent-rgb), 0.04);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}
@media (min-width: 640px) {
    .rl-faq-support-card {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        text-align: left;
    }
}
.rl-faq-support-title {
    font-size: 0.9375rem;
    font-weight: 800;
    color: var(--accent);
}
.rl-faq-support-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
}
.rl-faq-support-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    color: #fff !important;
    font-size: 0.8125rem;
    font-weight: 700;
    border-radius: 12px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(var(--accent-rgb), 0.2);
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
}
.rl-faq-support-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.3);
    filter: brightness(1.1);
}
`;
