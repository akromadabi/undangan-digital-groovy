import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// TINY SVG HELPER
const Icon = ({ d, className = 'w-5 h-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

/* ─────────────────────────────────────────────────────────
   RESELLER FAQ MOCKUPS (INTERACTIVE PREVIEWS)
   ───────────────────────────────────────────────────────── */
const DnsConfigMockup = () => (
    <div className="mt-4 p-4 bg-[#fbfbfa] border border-[#e9e6e1] rounded-xl max-w-lg text-left">
        <div className="text-[10px] font-bold text-[#999] tracking-wider mb-2 uppercase">SIMULASI CONFIG DNS</div>
        <div className="overflow-x-auto border border-[#f0ede8] rounded-lg">
            <table className="w-full text-xs text-left text-gray-500">
                <thead className="text-[10px] text-gray-700 uppercase bg-[#f5f3f0]">
                    <tr>
                        <th className="px-3 py-2">Tipe Record</th>
                        <th className="px-3 py-2">Host / Nama</th>
                        <th className="px-3 py-2">Value / IP Address</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ede8]">
                    <tr className="bg-white">
                        <td className="px-3 py-2 font-bold text-gray-900">A</td>
                        <td className="px-3 py-2">@ (atau kosong)</td>
                        <td className="px-3 py-2 font-mono text-[#E5654B] font-bold">103.174.112.56</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-3 py-2 font-bold text-gray-900">CNAME</td>
                        <td className="px-3 py-2">www</td>
                        <td className="px-3 py-2 font-mono text-[#E5654B] font-bold">domainanda.com</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="mt-2 text-[10px] text-[#b0402a] bg-orange-50 p-2.5 rounded-lg border border-orange-100/60 leading-relaxed">
            <strong>Catatan:</strong> Arahkan DNS domain Anda ke IP <strong>103.174.112.56</strong>. Perubahan DNS membutuhkan waktu propagasi berkisar 10 menit hingga maksimal 24 jam.
        </div>
    </div>
);

const PricingMarkupMockup = () => {
    const [price, setPrice] = useState(150000);
    const basePrice = 50000;
    const profit = Math.max(0, price - basePrice);
    return (
        <div className="mt-4 p-4 bg-[#fbfbfa] border border-[#e9e6e1] rounded-xl max-w-xs text-left">
            <div className="text-[10px] font-bold text-[#999] tracking-wider mb-2 uppercase">SIMULASI MARKUP HARGA</div>
            <div className="bg-white p-3.5 rounded-lg border border-[#f0ede8] space-y-3">
                <div>
                    <span className="text-[9px] text-[#999] font-bold block uppercase">Nama Paket</span>
                    <span className="text-xs font-bold text-gray-800">Paket Premium Pro</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <span className="text-[9px] text-[#999] font-bold block uppercase">Harga Modal (Pusat)</span>
                        <span className="font-semibold text-gray-600">Rp 50.000</span>
                    </div>
                    <div>
                        <span className="text-[9px] text-[#E5654B] font-bold block uppercase">Harga Jual Anda</span>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-gray-400">Rp</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full text-xs font-bold text-gray-800 border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#E5654B]"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-2 border-t border-dashed border-gray-150 flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-600">Margin Profit:</span>
                    <span className="font-bold text-emerald-600">Rp {profit.toLocaleString('id-ID')}</span>
                </div>
            </div>
        </div>
    );
};

const BrandingMockup = () => (
    <div className="mt-4 p-4 bg-[#fbfbfa] border border-[#e9e6e1] rounded-xl max-w-sm text-left">
        <div className="text-[10px] font-bold text-[#999] tracking-wider mb-2 uppercase">SIMULASI BRANDING KLIEN</div>
        <div className="bg-white border border-[#f0ede8] rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-900 p-2.5 flex items-center gap-2 text-white">
                <div className="w-5 h-5 bg-[#E5654B] rounded flex items-center justify-center font-bold text-[10px]">U</div>
                <span className="text-[10px] font-bold">UndanganKita (Brand Anda)</span>
                <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.2 rounded-full ml-auto">Klien Dashboard</span>
            </div>
            <div className="p-3 text-[10px] text-gray-500 space-y-1">
                <div>Selamat datang di dashboard <strong>UndanganKita</strong>.</div>
                <div className="text-[8px] text-gray-400">Didukung oleh sistem agency mandiri.</div>
            </div>
        </div>
    </div>
);

const WithdrawalMockup = () => (
    <div className="mt-4 p-4 bg-[#fbfbfa] border border-[#e9e6e1] rounded-xl max-w-sm text-left">
        <div className="text-[10px] font-bold text-[#999] tracking-wider mb-2 uppercase">SIMULASI REQUEST PENARIKAN</div>
        <div className="bg-white border border-[#f0ede8] rounded-lg p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
                <div>
                    <span className="block text-[9px] text-[#999] font-bold uppercase">Nominal Payout</span>
                    <span className="font-bold text-gray-800">Rp 500.000</span>
                </div>
                <span className="text-[9px] font-semibold bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full border border-amber-100">Diproses (1x24 jam)</span>
            </div>
            <div className="text-[9px] text-gray-400 border-t border-[#f0ede8] pt-2">
                Pencairan dikirim ke Bank Mandiri Rekening 123-xxx-456 a.n Sukses Mandiri.
            </div>
        </div>
    </div>
);

const ManualPaymentMockup = () => {
    const [approved, setApproved] = useState(false);
    return (
        <div className="mt-4 p-4 bg-[#fbfbfa] border border-[#e9e6e1] rounded-xl max-w-sm text-left">
            <div className="text-[10px] font-bold text-[#999] tracking-wider mb-2 uppercase">SIMULASI PERSETUJUAN BAYAR</div>
            <div className="bg-white border border-[#f0ede8] rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                    <div>
                        <span className="font-bold text-gray-800">Rian & Pasangan</span>
                        <span className="block text-[9px] text-gray-400">Paket Premium · Rp 100.000</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setApproved(!approved)}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                            approved ? 'bg-emerald-500 text-white' : 'bg-[#E5654B] hover:bg-[#c24b33] text-white'
                        }`}
                    >
                        {approved ? '✓ Terverifikasi' : 'Approve Pembayaran'}
                    </button>
                </div>
                {approved && (
                    <div className="text-[9px] text-emerald-600 bg-emerald-50 p-2 rounded text-center font-medium animate-fadeIn">
                        Pembayaran disetujui! Undangan klien langsung aktif dan profit ditambahkan ke saldo Anda.
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────
   RESELLER FAQ DATABASE
   ───────────────────────────────────────────────────────── */
const RESELLER_FAQ_DATABASE = [
    {
        id: 'reseller-profit-how',
        category: 'pricing-revenue',
        question: 'Bagaimana cara saya mendapatkan keuntungan dari program reseller ini?',
        answer: 'Keuntungan Anda didapatkan dari selisih penuh (margin profit) antara Harga Jual yang Anda tetapkan ke klien dikurangi dengan Harga Modal (biaya pusat) per transaksi paket undangan.',
        keywords: ['keuntungan', 'profit', 'laba', 'dapat uang', 'markup', 'pendapatan', 'margin', 'sistem bagi hasil'],
        steps: [
            'Atur harga jual paket undangan untuk klien Anda secara bebas melalui menu "Harga Paket" (misal, harga Paket Pro di-markup menjadi Rp 150.000).',
            'Ketika ada klien yang membeli paket tersebut di website Anda, mereka akan mentransfer nominal penuh (Rp 150.000) langsung ke rekening Anda.',
            'Sistem kami hanya akan memotong saldo akun reseller Anda sebesar harga modal (misal, harga modal pusat Paket Pro adalah Rp 50.000).',
            'Sisa keuntungan bersih sebesar Rp 100.000 sepenuhnya milik Anda dan langsung masuk ke saldo pendapatan untuk dapat dicairkan kapan saja.'
        ],
        mockup: 'pricing'
    },
    {
        id: 'reseller-pricing',
        category: 'pricing-revenue',
        question: 'Bagaimana cara mengatur harga paket dan mendapatkan keuntungan?',
        answer: 'Anda bebas memarkup (menaikkan) harga jual paket di atas harga modal sistem pusat. Selisih harga tersebut sepenuhnya menjadi laba kotor Anda.',
        keywords: ['harga', 'markup', 'paket', 'profit', 'keuntungan', 'pricing', 'jual', 'modal'],
        steps: [
            'Masuk ke menu "Harga Paket" pada dashboard reseller.',
            'Di sana tertera Harga Modal (nominal yang harus Anda bayarkan ke pusat per transaksi klien) and kolom input Harga Jual.',
            'Masukkan nominal harga jual yang diinginkan untuk klien Anda pada masing-masing paket.',
            'Klik tombol "Simpan".',
            'Klien yang mendaftar atau melakukan upgrade di website agency Anda akan melakukan pembayaran sesuai dengan harga jual yang Anda tentukan.'
        ],
        mockup: 'pricing'
    },
    {
        id: 'reseller-domain',
        category: 'domain-branding',
        question: 'Bagaimana cara menghubungkan Custom Domain untuk agency saya?',
        answer: 'Reseller dengan paket aktif dapat mengarahkan domain pribadi (misal: www.undanganmu.com) agar bertindak sebagai brand mandiri.',
        keywords: ['domain', 'custom', 'dns', 'a record', 'cname', 'resolusi', 'ip', 'pointing', 'white-label'],
        steps: [
            'Akses menu "Domain" di dashboard reseller.',
            'Buka pengaturan DNS di panel registrar tempat Anda membeli domain (misal: Niagahoster, Domainesia, GoDaddy).',
            'Tambahkan DNS record baru: Tipe A, Host @ (atau kosongkan), tunjuk ke IP: 103.174.112.56.',
            'Tambahkan DNS record kedua: Tipe CNAME, Host www, tunjuk ke domain utama Anda (misal: undanganmu.com).',
            'Tulis domain Anda pada kolom input di menu Domain dashboard ini, lalu klik "Hubungkan".',
            'DNS akan terpropagasi. Untuk pemasangan SSL HTTPS (gratis), silakan laporkan ke Super Admin setelah domain terhubung.'
        ],
        mockup: 'dns'
    },
    {
        id: 'reseller-branding',
        category: 'domain-branding',
        question: 'Bagaimana cara mengubah Logo, Favicon, dan Nama Brand agency saya?',
        answer: 'Gunakan fitur Branding untuk membuat platform Anda terlihat 100% independen dan profesional dengan logo Anda sendiri.',
        keywords: ['branding', 'logo', 'favicon', 'nama brand', 'aplikasi', 'white-label', 'tampilan', 'dashboard klien'],
        steps: [
            'Pilih menu "Branding" di sidebar dashboard reseller.',
            'Masukkan nama agency Anda pada kolom "Nama Brand / Aplikasi".',
            'Unggah file "Logo Brand" (format PNG/JPG transparan direkomendasikan) yang akan muncul pada sidebar dashboard klien, form login/register, dan invoice.',
            'Unggah file "Favicon" (.ico atau .png) untuk ikon tab web pada browser.',
            'Klik "Simpan Perubahan". Dashboard klien otomatis berubah mengikuti identitas brand Anda.'
        ],
        mockup: 'branding'
    },
    {
        id: 'reseller-approval',
        category: 'transaksi-klien',
        question: 'Bagaimana cara memverifikasi pembayaran transfer manual dari klien?',
        answer: 'Klien Anda dapat melakukan upgrade dengan metode transfer manual langsung ke rekening bank pribadi Anda. Anda bertanggung jawab melakukan aktivasi manual.',
        keywords: ['approval', 'manual', 'verifikasi', 'transfer', 'bukti', 'approve', 'user', 'aktifkan paket'],
        steps: [
            'Saat klien mengunggah bukti transfer manual, Anda akan menerima notifikasi transaksi tertunda.',
            'Masuk ke menu "Users" atau "Transaksi" di dashboard reseller.',
            'Klik detail pada user yang berstatus pembayaran pending dan periksa foto bukti transfer yang diunggah.',
            'Jika dana sudah masuk ke rekening bank Anda, klik tombol "Approve / Setujui".',
            'Paket undangan klien akan langsung aktif secara otomatis tanpa campur tangan admin pusat.'
        ],
        mockup: 'manual-payment'
    },
    {
        id: 'reseller-pencairan',
        category: 'pricing-revenue',
        question: 'Bagaimana cara mencairkan keuntungan (saldo pendapatan) ke rekening bank?',
        answer: 'Semua pendapatan dari transaksi klien (selisih profit) otomatis terakumulasi dalam bentuk saldo di akun reseller Anda. Anda dapat menarik saldo tersebut kapan saja.',
        keywords: ['pencairan', 'saldo', 'rekening', 'tarik', 'withdrawal', 'payout', 'transfer', 'pendapatan'],
        steps: [
            'Buka menu "Pencairan" di dashboard reseller.',
            'Pilih tab "Pengaturan Bank / Rekening" terlebih dahulu untuk mendaftarkan nama bank, nomor rekening, dan nama pemilik rekening penampung.',
            'Setelah rekening terdaftar, buka tab "Ajukan Pencairan".',
            'Masukkan nominal penarikan saldo (minimal penarikan Rp 50.000).',
            'Klik "Ajukan Pencairan". Pengajuan akan diverifikasi dan ditransfer oleh Super Admin dalam waktu maksimal 1x24 jam.'
        ],
        mockup: 'pencairan'
    },
    {
        id: 'reseller-allowed-plans',
        category: 'transaksi-klien',
        question: 'Bagaimana cara membatasi tema agar hanya bisa diakses oleh paket tertentu (misal hanya Platinum)?',
        answer: 'Anda dapat mengunci sebuah tema agar hanya bisa digunakan oleh klien dengan paket tertentu — misalnya tema eksklusif hanya untuk Platinum. Klien dengan paket lebih rendah akan melihat tema tersebut terkunci dan diminta upgrade.',
        keywords: ['paket eksklusif', 'kunci tema', 'platinum only', 'allowed plans', 'tema premium', 'batasi paket', 'akses tema'],
        steps: [
            'Buka "Katalog Tema" di dashboard Admin reseller, lalu klik "Edit" pada tema yang ingin dikunci.',
            'Cari kolom atau bagian "Paket yang Diizinkan (Allowed Plans)".',
            'Centang atau pilih paket mana saja yang berhak menggunakan tema ini (misal: hanya Gold dan Platinum).',
            'Jika dikosongkan, tema bersifat universal dan bisa digunakan oleh semua klien tanpa batasan paket.',
            'Klik "Simpan Perubahan". Di halaman demo dan katalog, tema akan otomatis tampil dengan ikon kunci (🔒) untuk paket yang tidak diizinkan.'
        ],
        mockup: null
    },
    {
        id: 'reseller-video-youtube',
        category: 'transaksi-klien',
        question: 'Apakah klien bisa menggunakan video YouTube sebagai latar undangan mereka?',
        answer: 'Ya! Klien dapat menggunakan link video YouTube sebagai latar belakang (background) pada section Cover (Sampul) atau Opening (Pembuka) undangan mereka. Video diputar otomatis tanpa suara (muted autoplay) memberikan efek sinematik yang memukau.',
        keywords: ['video youtube', 'klien video', 'latar video', 'background video', 'cover video', 'opening video', 'sinematik'],
        steps: [
            'Klien membuka dashboard → menu "Desain & Tema" → tab "Tampilan".',
            'Klik "Kelola Media Cover" atau "Kelola Media Pembuka".',
            'Pilih tab "Video Album" di jendela media yang muncul.',
            'Paste link YouTube (format youtube.com/watch?v=xxx atau youtu.be/xxx) di kolom input lalu klik "+".',
            'Klik thumbnail video untuk memilihnya sebagai latar. Preview undangan langsung menampilkan video tersebut.',
            'Fitur ini tersedia untuk semua tema — video akan diputar otomatis (muted, loop) memberikan efek latar yang sinematik dan profesional.'
        ],
        mockup: null
    },
    {
        id: 'reseller-demo-plan-switcher',
        category: 'domain-branding',
        question: 'Bagaimana cara demo undangan menampilkan perbedaan fitur antar paket kepada calon klien?',
        answer: 'Di halaman demo undangan, terdapat bar pemilih kelas paket di bagian atas. Calon klien dapat mengklik setiap kelas untuk melihat langsung fitur apa yang aktif atau disembuyenikan — tanpa mendaftar. Ini alat pemasaran yang sangat efektif untuk mendorong upgrade.',
        keywords: ['demo', 'kelas', 'paket', 'pemilih', 'switcher', 'preview paket', 'perbedaan fitur', 'pemasaran', 'konversi'],
        steps: [
            'Setiap halaman demo undangan (format URL: /demo/[slug-tema]) sudah dilengkapi bar pemilih kelas di atas undangan secara otomatis.',
            'Kelas yang ditampilkan mengikuti paket yang diaktifkan di sistem — jika Anda hanya mengaktifkan Gold and Platinum, hanya dua kelas tersebut yang tampil.',
            'Ketika calon klien mengklik kelas berbeda, section yang tidak tersedia (RSVP, Galeri, dll.) otomatis tersembunyi.',
            'Tombol "Detail Fitur" menampilkan perbandingan lengkap semua fitur antar kelas dalam pop-up yang informatif.',
            'Bagikan link demo ke calon klien untuk membantu mereka memahami nilai tiap paket dan mendorong keputusan pembelian.'
        ],
        mockup: null
    },
    {
        id: 'reseller-sortir-tema',
        category: 'domain-branding',
        question: 'Apa arti tombol sortir "Terbaru", "Terpopuler", dan "Terfavorit" di katalog tema?',
        answer: 'Di halaman katalog tema (landing page reseller maupun dashboard), terdapat tiga tombol sortir untuk membantu klien menemukan tema yang sesuai dengan cara yang berbeda.',
        keywords: ['sortir', 'urutkan', 'terbaru', 'terpopuler', 'terfavorit', 'katalog tema', 'urutan tema'],
        steps: [
            '"Terbaru" — mengurutkan tema berdasarkan yang paling baru ditambahkan ke sistem (ID terbesar). Cocok untuk menampilkan tema-tema edisi terkini.',
            '"Terpopuler" — mengurutkan berdasarkan jumlah penggunaan aktual oleh klien (usage_count). Tema yang paling banyak dipilih muncul di urutan pertama.',
            '"Terfavorit" — mengurutkan berdasarkan jumlah like/suka yang diberikan oleh pengguna. Tema yang paling disukai muncul pertama.',
            'Klien dapat mengganti urutan kapan saja dengan mengklik tombol sortir di halaman katalog atau di dashboard "Desain & Tema".',
            'Filter kategori dan sortir dapat dikombinasikan — misalnya melihat tema kategori ISLAMI yang paling Terpopuler.'
        ],
        mockup: null
    },
    {
        id: 'reseller-guarantee',
        category: 'transaksi-klien',
        question: 'Apakah ada jejak brand pusat (Groovy) yang dapat dilihat oleh klien saya?',
        answer: 'Tidak. Kami menjamin 100% white-label system. Nama brand pusat sepenuhnya dieliminasi dari ekosistem klien Anda.',
        keywords: ['jejak', 'pusat', 'nama', 'groovy', 'white-label', 'keamanan', 'kerahasiaan', 'invoice', 'email'],
        steps: [
            'Dashboard klien sepenuhnya menggunakan branding logo dan nama brand Anda.',
            'Email notifikasi, draf WhatsApp, invoice tagihan, dan file PDF tanda terima akan dikirim atas nama brand Anda.',
            'Link subdomain undangan klien akan merujuk ke domain utama agency Anda (misal: budi.undanganmu.com).',
            'Server pengiriman email (SMTP) dan link asset media dikonfigurasi agar anonim demi kenyamanan bisnis Anda.'
        ],
        mockup: null
    },
    {
        id: 'reseller-what-is',
        category: 'transaksi-klien',
        question: 'Apa itu reseller di website ini?',
        answer: 'Program Reseller (Agency) adalah kemitraan eksklusif yang memungkinkan Anda menjalankan bisnis pembuatan undangan digital secara mandiri menggunakan teknologi kami, namun 100% menggunakan identitas brand Anda sendiri (White-Label).',
        keywords: ['apa', 'itu', 'reseller', 'konsep', 'skema', 'sistem', 'cara kerja', 'agency', 'mitra'],
        steps: [
            'Anda memegang kendali penuh melalui dashboard admin ini untuk mengonfigurasi logo, nama brand, domain, dan harga jual.',
            'Klien mendaftar, mengelola undangan, dan melakukan transaksi di bawah naungan nama brand Anda tanpa tahu keterkaitan dengan sistem pusat.',
            'Anda bertindak sebagai penyedia jasa independen dan menerima keuntungan penuh dari markup harga paket penjualan.'
        ],
        mockup: 'branding'
    },
    {
        id: 'reseller-need-hosting',
        category: 'domain-branding',
        question: 'Apakah saya membutuhkan hosting tambahan?',
        answer: 'Tidak. Anda sama sekali tidak memerlukan hosting tambahan untuk menjalankan bisnis ini. Seluruh database, website reseller Anda, serta ribuan website undangan milik klien Anda akan di-host secara gratis dan aman di infrastruktur server cloud kami.',
        keywords: ['hosting', 'server', 'sewa', 'biaya', 'domain', 'cpanel', 'vps', 'cloud', 'penyimpanan'],
        steps: [
            'Anda hanya perlu menyiapkan sebuah nama domain (misal: undanganmu.com) jika ingin menggunakan brand kustom profesional.',
            'Cukup arahkan DNS domain tersebut ke IP server kami yang sudah disediakan.',
            'Tim pengembang kami akan mengurus semua pemeliharaan server, keamanan enkripsi SSL (HTTPS) gratis untuk klien Anda, pembaruan fitur otomatis, dan backup data rutin.'
        ],
        mockup: 'dns'
    },
    {
        id: 'reseller-brand-safety',
        category: 'domain-branding',
        question: 'Apakah tema parodi (seperti Spotivite, YouInvite, Wedflix, dll) aman dijual secara komersial oleh reseller?',
        answer: 'Sangat aman. Kami telah merancang ulang seluruh tema populer tersebut menjadi versi parodi kreatif dengan menggunakan nama-nama plesetan estetik dan mengganti seluruh logo/ikon resmi dengan ilustrasi kustom yang orisinal.',
        keywords: ['aman', 'hak cipta', 'tuntut', 'lisensi', 'merek', 'brand', 'youtube', 'spotify', 'netflix', 'logo', 'copyright', 'trademark', 'komersial', 'legal', 'hukum', 'parodi', 'spotivite', 'youinvite', 'wedflix', 'vitegpt', 'unitedinvite'],
        steps: [
            'Seluruh nama platform komersial telah diganti (misalnya Spotify menjadi Spotivite, YouTube menjadi YouInvite, Netflix menjadi Wedflix, Manchester United menjadi UnitedInVite).',
            'Logo resmi (seperti logo OpenAI swirl pada ChatGPT atau logo camera glyph Instagram) telah diganti dengan ilustrasi kustom bertema pernikahan (ikon hati, camera-lens hati, play-button hati).',
            'Perubahan ini membebaskan reseller dari segala risiko pelanggaran hak kekayaan intelektual (copyright & trademark infringement) sehingga Anda dapat memasarkan tema premium ini secara bebas, legal, dan percaya diri.'
        ],
        mockup: null
    },
    {
        id: 'reseller-preview-catalog',
        category: 'domain-branding',
        question: 'Bagaimana cara merubah preview katalog tema di halaman reseller?',
        answer: 'Anda dapat merubah preview katalog tema dengan menyesuaikan gaya mockup (Flat 2-Phone vs 3D Triple-Phone ultra-realistis) serta mengganti background menjadi Creative Studio Dual-Tone Split yang modern di menu edit tema.',
        keywords: ['katalog', 'preview', 'mockup', 'triple-phone', 'background', 'dual-tone', 'clay-sand', 'velvet-rose', 'sage-cream', 'merubah preview'],
        steps: [
            'Buka menu "Katalog Tema" pada dashboard Admin reseller.',
            'Pilih salah satu tema yang ingin Anda sesuaikan dan klik tombol "Edit".',
            'Di bagian pengaturan preview, Anda dapat merubah format tampilan antara format Flat 2-Phone atau format 3D Triple-Phone.',
            'Pilih skema background visual premium seperti "Creative Studio Dual-Tone Split" dengan pilihan warna (Clay-Sand, Velvet-Rose, Sage-Cream) yang elegan.',
            'Klik "Simpan" untuk merubah tampilan preview katalog tema Anda secara instan dan sangat profesional.'
        ],
        mockup: null
    },
    {
        id: 'reseller-theme-compatibility',
        category: 'transaksi-klien',
        question: 'Bagaimana cara membatasi tema agar hanya muncul untuk tipe undangan tertentu?',
        answer: 'Anda dapat membatasi kompatibilitas tema melalui pengaturan "Tipe Acara (Event Type)" di form edit tema untuk memastikan tema tersebut tampil sesuai dengan jenis undangan yang dibuat klien.',
        keywords: ['tipe acara', 'event type', 'membatasi tema', 'kompatibilitas', 'kategori tema', 'pilihan tema'],
        steps: [
            'Buka halaman "Katalog Tema" di dashboard Admin reseller Anda, lalu klik "Edit" pada tema pilihan.',
            'Cari kolom "Tipe Acara (Event Type)".',
            'Pilih satu atau beberapa jenis acara yang kompatibel dengan tema tersebut (misalnya: Ulang Tahun, Wisuda, Aqiqah, dll.) menggunakan pemilih kustom multi-select.',
            'Jika dikosongkan, tema otomatis berstatus "Umum/General" yang berarti dapat digunakan untuk semua jenis acara klien.',
            'Klik "Simpan Perubahan". Tema hanya akan muncul di katalog klien ketika mereka membuat undangan dengan jenis acara yang sesuai.'
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

export default function Faq() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('semua');
    const [activeId, setActiveId] = useState(''); // Accordion active state
    const [isListening, setIsListening] = useState(false);

    // Category Tabs Configuration
    const categories = useMemo(() => {
        return [
            { id: 'semua', label: 'Semua Panduan Reseller' },
            { id: 'domain-branding', label: 'Domain & Branding' },
            { id: 'pricing-revenue', label: 'Harga & Pencairan' },
            { id: 'transaksi-klien', label: 'Transaksi & Klien' }
        ];
    }, []);

    // Active Database containing reseller specific guides
    const currentDatabase = useMemo(() => {
        return RESELLER_FAQ_DATABASE.map(item => ({ ...item, isReseller: true }));
    }, []);

    // Filter FAQ list based on Search & Category
    const filteredFAQs = useMemo(() => {
        return currentDatabase.filter(faq => {
            if (activeCategory !== 'semua' && faq.category !== activeCategory) return false;
            if (searchQuery.trim() !== '') {
                const matchesQuestion = isMatch(faq.question, searchQuery);
                const matchesAnswer = isMatch(faq.answer, searchQuery);
                const matchesKeywords = faq.keywords ? faq.keywords.some(kw => isMatch(kw, searchQuery)) : false;
                const matchesSteps = faq.steps ? faq.steps.some(step => isMatch(step, searchQuery)) : false;
                return matchesQuestion || matchesAnswer || matchesKeywords || matchesSteps;
            }
            return true;
        });
    }, [currentDatabase, activeCategory, searchQuery]);

    // Toggle Accordion
    const toggleAccordion = (id) => {
        setActiveId(prev => prev === id ? '' : id);
    };

    // Voice search handler
    const handleVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Browser Anda tidak mendukung pencarian suara. Silakan gunakan Google Chrome atau browser modern lainnya.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (isListening) {
            recognition.stop();
            setIsListening(false);
            return;
        }

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            const cleanedText = speechToText.replace(/\.$/, '');
            setSearchQuery(cleanedText);
        };

        recognition.start();
    };

    // Render mockup by mockup key for Reseller FAQs
    const renderResellerMockup = (type) => {
        switch (type) {
            case 'dns': return <DnsConfigMockup />;
            case 'pricing': return <PricingMarkupMockup />;
            case 'branding': return <BrandingMockup />;
            case 'pencairan': return <WithdrawalMockup />;
            case 'manual-payment': return <ManualPaymentMockup />;
            default: return null;
        }
    };



    return (
        <AdminLayout title="FAQ & Panduan">
            <Head title="FAQ & Panduan - Reseller Dashboard" />

            <div className="space-y-6 max-w-4xl mx-auto pb-36 md:pb-12">
                {/* ═══ Header Section ═══ */}
                <div className="relative py-8 px-6 bg-gradient-to-br from-[#E5654B] to-[#c24b33] rounded-2xl text-white overflow-hidden shadow-sm">
                    <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -right-12 w-48 h-48 rounded-full bg-white/5" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <h2 className="text-xl lg:text-3xl font-bold tracking-tight mb-2">FAQ & Pusat Bantuan</h2>
                        <p className="text-xs lg:text-sm text-orange-100/90 max-w-md">
                            Temukan jawaban cepat mengenai operasional reseller white-label Anda dan panduan teknis yang dapat Anda bagikan ke klien.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-6 w-full max-w-md">
                            <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-100/60 px-4 py-1.5 focus-within:ring-2 focus-within:ring-white transition-all">
                                <div className="text-gray-400 mr-2 flex-shrink-0 flex items-center justify-center">
                                    <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-5 h-5" strokeWidth={2} />
                                </div>

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari panduan reseller atau klien..."
                                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm border-none focus:outline-none focus:ring-0 p-1 min-w-0"
                                    style={{
                                        border: 'none',
                                        boxShadow: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                    }}
                                />

                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                    {isListening ? (
                                        <button
                                            type="button"
                                            onClick={handleVoiceSearch}
                                            className="p-1.5 rounded-full bg-red-100 text-red-600 animate-pulse transition-colors"
                                            title="Mendengarkan... klik untuk berhenti"
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
                                            title="Cari menggunakan suara"
                                        >
                                            <Icon d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" className="w-5 h-5" />
                                        </button>
                                    )}
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                            title="Clear search"
                                        >
                                            <Icon d="M6 18L18 6M6 6l12 12" className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ Category Tabs (Horizontal Scrollable on mobile, wrapped on desktop) ═══ */}
                <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap pb-1.5 gap-2 scrollbar-none">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => { setActiveCategory(cat.id); setActiveId(''); }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border ${
                                activeCategory === cat.id
                                    ? 'bg-[#E5654B] text-white border-transparent shadow-sm'
                                    : 'bg-white text-gray-600 border-[#e8e5e0] hover:bg-gray-50'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* ═══ FAQ List (Accordion style) ═══ */}
                <div className="space-y-3.5">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq, idx) => {
                            const isOpen = activeId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                                        isOpen
                                            ? 'border-[#E5654B]/60 shadow-md border-l-4 border-l-[#E5654B]'
                                            : 'border-[#e8e5e0] hover:border-gray-300 shadow-sm border-l-4 border-l-transparent'
                                    }`}
                                >
                                    {/* Accordion Trigger Header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleAccordion(faq.id)}
                                        className="w-full flex items-start justify-between text-left p-4 focus:outline-none transition-colors hover:bg-gray-50/30"
                                    >
                                        <span className={`text-sm font-bold pr-4 transition-colors ${isOpen ? 'text-[#E5654B]' : 'text-gray-800'} pt-0.5`}>
                                            {faq.question}
                                        </span>
                                        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                                            isOpen ? 'bg-orange-50 text-[#E5654B] rotate-180' : 'bg-[#f5f3f0] text-gray-400'
                                        }`}>
                                            <Icon d="M19 9l-7 7-7-7" className="w-4 h-4" strokeWidth={2.5} />
                                        </span>
                                    </button>

                                    {/* Accordion Content */}
                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-[#f8f7f4] bg-white animate-in fade-in slide-in-from-top-1">
                                            <p className="font-semibold text-gray-700 text-[12.5px] mb-3">{faq.answer}</p>
                                            
                                            {/* Tutorial Steps */}
                                            {faq.steps && faq.steps.length > 0 && (
                                                <div className="bg-[#faf9f6] p-4 rounded-xl border border-[#e8e5e0] mt-3">
                                                    <div className="text-[10px] font-bold text-[#E5654B] tracking-wider mb-2.5 uppercase">Langkah-Langkah Solusi</div>
                                                    <ul className="space-y-2.5 text-gray-600">
                                                        {faq.steps.map((step, idx) => (
                                                            <li key={idx} className="flex gap-2">
                                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-[#E5654B] font-bold text-[10.5px] flex items-center justify-center">
                                                                    {idx + 1}
                                                                </span>
                                                                <span className="flex-1 pt-0.5">{step}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Render Specific Mockup Simulator */}
                                            {faq.mockup && (
                                                <div className="flex justify-center mt-4">
                                                    {renderResellerMockup(faq.mockup)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white border border-[#e8e5e0] rounded-xl p-12 text-center shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#faf9f6] flex items-center justify-center mx-auto mb-3 text-gray-300">
                                <Icon d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75" className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-700 text-sm">Tidak Menemukan Hasil</h3>
                            <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                                Coba ketik kata kunci yang berbeda atau ganti tab kategori di atas.
                            </p>
                        </div>
                    )}
                </div>

                {/* ═══ Footer Help Action Card ═══ */}
                <div className="bg-white border border-[#e8e5e0] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E5654B] flex items-center justify-center flex-shrink-0">
                                    <Icon d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" className="w-6 h-6" />
                                </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm">Butuh Bantuan Lebih Lanjut?</h4>
                            <p className="text-gray-400 text-xs mt-0.5">Ajukan kendala teknis atau pertanyaan sistem langsung ke tim pengembang.</p>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/628123456789"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#E5654B] hover:bg-[#c24b33] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all inline-flex items-center justify-center gap-2 flex-shrink-0 text-center"
                    >
                        Hubungi Super Admin
                        <Icon d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" className="w-4 h-4" strokeWidth={2} />
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}

