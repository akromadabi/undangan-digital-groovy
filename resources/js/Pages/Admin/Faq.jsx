import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FAQ_DATABASE as CLIENT_FAQ_DATABASE } from '../Dashboard/Tutorial';

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
        id: 'reseller-what-is',
        category: 'transaksi-klien',
        question: '1. Apa itu reseller di website ini?',
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
        question: '2. Apakah saya membutuhkan hosting tambahan?',
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
        id: 'reseller-profit-how',
        category: 'pricing-revenue',
        question: '3. Bagaimana cara saya mendapatkan keuntungan dari program reseller ini?',
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
        id: 'reseller-domain',
        category: 'domain-branding',
        question: '4. Bagaimana cara menghubungkan Custom Domain untuk agency saya?',
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
        id: 'reseller-pricing',
        category: 'pricing-revenue',
        question: '5. Bagaimana cara mengatur harga paket dan mendapatkan keuntungan?',
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
        id: 'reseller-branding',
        category: 'domain-branding',
        question: '6. Bagaimana cara mengubah Logo, Favicon, dan Nama Brand agency saya?',
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
        id: 'reseller-pencairan',
        category: 'pricing-revenue',
        question: '7. Bagaimana cara mencairkan keuntungan (saldo pendapatan) ke rekening bank?',
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
        id: 'reseller-approval',
        category: 'transaksi-klien',
        question: '8. Bagaimana cara memverifikasi pembayaran transfer manual dari klien?',
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
        id: 'reseller-guarantee',
        category: 'transaksi-klien',
        question: '9. Apakah ada jejak brand pusat (Groovy) yang dapat dilihat oleh klien saya?',
        answer: 'Tidak. Kami menjamin 100% white-label system. Nama brand pusat sepenuhnya dieliminasi dari ekosistem klien Anda.',
        keywords: ['jejak', 'pusat', 'nama', 'groovy', 'white-label', 'keamanan', 'kerahasiaan', 'invoice', 'email'],
        steps: [
            'Dashboard klien sepenuhnya menggunakan branding logo dan nama brand Anda.',
            'Email notifikasi, draf WhatsApp, invoice tagihan, dan file PDF tanda terima akan dikirim atas nama brand Anda.',
            'Link subdomain undangan klien akan merujuk ke domain utama agency Anda (misal: budi.undanganmu.com).',
            'Server pengiriman email (SMTP) dan link asset media dikonfigurasi agar anonim demi kenyamanan bisnis Anda.'
        ],
        mockup: null
    }
];

export default function Faq() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('semua');
    const [activeId, setActiveId] = useState(''); // Accordion active state
    const [isListening, setIsListening] = useState(false);

    // Unified Category Tabs Configuration (combining Reseller & Client/User guides)
    const categories = useMemo(() => {
        return [
            { id: 'semua', label: 'Semua Panduan' },
            { id: 'domain-branding', label: 'Reseller: Domain & Branding' },
            { id: 'pricing-revenue', label: 'Reseller: Harga & Pencairan' },
            { id: 'transaksi-klien', label: 'Reseller: Transaksi & Klien' },
            { id: 'mulai-cepat', label: 'Klien: Mulai Cepat' },
            { id: 'desain-tema', label: 'Klien: Desain & Tema' },
            { id: 'tamu-undangan', label: 'Klien: Tamu & Undangan' },
            { id: 'fitur-tambahan', label: 'Klien: Fitur Tambahan' }
        ];
    }, []);

    // Combined Active Database containing both reseller specific and client guides
    const currentDatabase = useMemo(() => {
        const resellers = RESELLER_FAQ_DATABASE.map(item => ({ ...item, isReseller: true }));
        const clients = CLIENT_FAQ_DATABASE.map(item => ({ ...item, isReseller: false }));
        return [...resellers, ...clients];
    }, []);

    // Filter FAQ list based on Search & Category
    const filteredFAQs = useMemo(() => {
        return currentDatabase.filter(faq => {
            if (activeCategory !== 'semua' && faq.category !== activeCategory) return false;
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const matchesQuestion = faq.question.toLowerCase().includes(query);
                const matchesAnswer = faq.answer.toLowerCase().includes(query);
                const matchesKeywords = faq.keywords ? faq.keywords.some(kw => kw.toLowerCase().includes(query)) : false;
                return matchesQuestion || matchesAnswer || matchesKeywords;
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

    // Client Mockup Component Renderer (Inline mapping)
    // Avoid re-declaring huge components, keep simplified or map cleanly
    const renderClientMockup = (type) => {
        // Simplified visual guides for client guides inside admin view
        const mockupStyle = "mt-4 p-4 bg-gray-50 border border-gray-150 rounded-xl max-w-sm text-left text-xs text-gray-500";
        switch (type) {
            case 'aktif':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Masa Aktif Paket</span>
                        <div className="bg-white border rounded p-2 flex justify-between items-center">
                            <span>Premium Gold</span>
                            <span className="bg-[#E5654B] text-white px-2 py-0.5 rounded text-[10px]">Aktif (365 Hari)</span>
                        </div>
                    </div>
                );
            case 'wa':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Template Broadcast WA</span>
                        <div className="bg-white border rounded p-2 text-[10px] font-mono text-gray-600">
                            "Halo Bapak/Ibu... Kami mengundang Anda menghadiri..."
                        </div>
                    </div>
                );
            case 'tambah-tamu':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Opsi Daftar Tamu</span>
                        <div className="flex gap-2">
                            <span className="border px-2 py-1 rounded bg-white font-semibold text-gray-700">+ Tambah Manual</span>
                            <span className="border px-2 py-1 rounded bg-white font-semibold text-gray-700">Import Excel</span>
                        </div>
                    </div>
                );
            case 'tema':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Ganti Tema Instan</span>
                        <div className="flex gap-2">
                            <div className="w-12 h-8 bg-pink-100 border border-pink-300 rounded text-[8px] flex items-center justify-center font-bold text-pink-700">Pink Modern</div>
                            <div className="w-12 h-8 bg-amber-50 border border-amber-300 rounded text-[8px] flex items-center justify-center font-bold text-amber-800">Joglo Jawa</div>
                        </div>
                    </div>
                );
            case 'streaming':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Platform Live Streaming</span>
                        <div className="bg-white border rounded p-2 flex items-center gap-1.5">
                            <span className="text-[#E5654B] font-bold">YouTube Live</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-400 truncate">https://youtube.com/...</span>
                        </div>
                    </div>
                );
            case 'musik':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Audio Background</span>
                        <div className="bg-white border rounded p-2 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#E5654B] text-white flex items-center justify-center text-[8px] animate-spin">♫</span>
                            <span className="font-medium text-gray-800">BeautifulInWhite.mp3</span>
                        </div>
                    </div>
                );
            case 'hadiah':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">E-Wallet & Bank Transfer</span>
                        <div className="bg-white border rounded p-2 flex justify-between items-center">
                            <span className="font-bold text-blue-700">BCA - 1234567890</span>
                            <span className="text-gray-400 text-[10px]">a.n Pengantin</span>
                        </div>
                    </div>
                );
            case 'domain':
                return (
                    <div className={mockupStyle}>
                        <span className="font-bold text-gray-700 block mb-1">Custom Domain Klien</span>
                        <div className="bg-white border rounded p-2 font-mono text-[10px] text-gray-600">
                            www.pernikahanbudi.com &rarr; A 103.174.112.56
                        </div>
                    </div>
                );
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
                                            <Icon d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" className="w-4.5 h-4.5" />
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
                        filteredFAQs.map((faq) => {
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
                                        className="w-full flex items-center justify-between text-left p-4.5 focus:outline-none transition-colors hover:bg-gray-50/30"
                                    >
                                        <span className={`text-sm font-bold pr-4 transition-colors ${isOpen ? 'text-[#E5654B]' : 'text-gray-800'}`}>
                                            {faq.question}
                                        </span>
                                        <span className={`flex-shrink-0 w-6.5 h-6.5 rounded-lg flex items-center justify-center transition-all ${
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
                                                    {faq.isReseller
                                                        ? renderResellerMockup(faq.mockup)
                                                        : renderClientMockup(faq.mockup)
                                                    }
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
                            <Icon d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" className="w-5.5 h-5.5" />
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

