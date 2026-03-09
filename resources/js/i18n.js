// Simple i18n utility for multi-language support (id/en)
// Translations are loaded from this file and can be extended

const translations = {
    id: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.content': 'Konten',
        'nav.settings': 'Pengaturan',
        'nav.theme': 'Tema',
        'nav.opening': 'Opening',
        'nav.mempelai': 'Mempelai',
        'nav.acara': 'Acara',
        'nav.galeri': 'Galeri',
        'nav.kisah': 'Kisah Cinta',
        'nav.bank': 'Amplop Digital',
        'nav.penutup': 'Penutup',
        'nav.guestbook': 'Guestbook',
        'nav.cover': 'Cover',
        'nav.tamu': 'Tamu',
        'nav.rsvp': 'RSVP',
        'nav.musik': 'Musik',
        'nav.hadiah': 'Hadiah',
        'nav.whatsapp': 'Kirim WA',
        'nav.pricing': 'Upgrade',
        'nav.history': 'Riwayat',

        // Common
        'common.save': 'Simpan',
        'common.saving': 'Menyimpan...',
        'common.cancel': 'Batal',
        'common.delete': 'Hapus',
        'common.edit': 'Edit',
        'common.add': 'Tambah',
        'common.search': 'Cari...',
        'common.back': 'Kembali',
        'common.upload': 'Upload',
        'common.uploading': 'Uploading...',
        'common.confirm_delete': 'Yakin hapus?',
        'common.success': 'Berhasil!',
        'common.error': 'Terjadi kesalahan',
        'common.no_data': 'Belum ada data',
        'common.loading': 'Memuat...',

        // Dashboard
        'dashboard.welcome': 'Selamat datang',
        'dashboard.total_guests': 'Total Tamu',
        'dashboard.rsvp_confirmed': 'RSVP Terkonfirmasi',
        'dashboard.total_wishes': 'Ucapan',
        'dashboard.invitation_opened': 'Dibuka',
        'dashboard.upgrade_banner': 'Upgrade ke paket premium untuk membuka semua fitur!',

        // Payment
        'payment.pricing_title': 'Pilih Paket yang Tepat',
        'payment.pricing_subtitle': 'Upgrade kapan saja untuk membuka semua fitur premium',
        'payment.current_plan': 'Paket Saat Ini',
        'payment.upgrade': 'Upgrade',
        'payment.active': 'Aktif',
        'payment.free_plan': 'Paket Dasar',
        'payment.history': 'Riwayat Pembayaran',
        'payment.no_history': 'Belum ada riwayat pembayaran',

        // Invitation
        'invitation.open': 'Buka Undangan',
        'invitation.to': 'Kepada Yth.',
        'invitation.rsvp_title': 'Konfirmasi Kehadiran',
        'invitation.hadir': 'Hadir',
        'invitation.tidak_hadir': 'Tidak Hadir',
        'invitation.belum_pasti': 'Belum Pasti',
        'invitation.send_rsvp': 'Kirim RSVP',
        'invitation.wishes_title': 'Ucapan & Doa',
        'invitation.send_wish': 'Kirim Ucapan',
        'invitation.powered_by': 'Powered by Undangan Digital Groovy',
    },

    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.content': 'Content',
        'nav.settings': 'Settings',
        'nav.theme': 'Theme',
        'nav.opening': 'Opening',
        'nav.mempelai': 'Couple',
        'nav.acara': 'Events',
        'nav.galeri': 'Gallery',
        'nav.kisah': 'Love Story',
        'nav.bank': 'Digital Envelope',
        'nav.penutup': 'Closing',
        'nav.guestbook': 'Guestbook',
        'nav.cover': 'Cover',
        'nav.tamu': 'Guests',
        'nav.rsvp': 'RSVP',
        'nav.musik': 'Music',
        'nav.hadiah': 'Gifts',
        'nav.whatsapp': 'Send WA',
        'nav.pricing': 'Upgrade',
        'nav.history': 'History',

        // Common
        'common.save': 'Save',
        'common.saving': 'Saving...',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',
        'common.add': 'Add',
        'common.search': 'Search...',
        'common.back': 'Back',
        'common.upload': 'Upload',
        'common.uploading': 'Uploading...',
        'common.confirm_delete': 'Are you sure?',
        'common.success': 'Success!',
        'common.error': 'An error occurred',
        'common.no_data': 'No data yet',
        'common.loading': 'Loading...',

        // Dashboard
        'dashboard.welcome': 'Welcome',
        'dashboard.total_guests': 'Total Guests',
        'dashboard.rsvp_confirmed': 'RSVP Confirmed',
        'dashboard.total_wishes': 'Wishes',
        'dashboard.invitation_opened': 'Opened',
        'dashboard.upgrade_banner': 'Upgrade to premium to unlock all features!',

        // Payment
        'payment.pricing_title': 'Choose the Right Plan',
        'payment.pricing_subtitle': 'Upgrade anytime to unlock all premium features',
        'payment.current_plan': 'Current Plan',
        'payment.upgrade': 'Upgrade',
        'payment.active': 'Active',
        'payment.free_plan': 'Basic Plan',
        'payment.history': 'Payment History',
        'payment.no_history': 'No payment history yet',

        // Invitation
        'invitation.open': 'Open Invitation',
        'invitation.to': 'Dear',
        'invitation.rsvp_title': 'RSVP',
        'invitation.hadir': 'Attending',
        'invitation.tidak_hadir': 'Not Attending',
        'invitation.belum_pasti': 'Maybe',
        'invitation.send_rsvp': 'Send RSVP',
        'invitation.wishes_title': 'Wishes & Prayers',
        'invitation.send_wish': 'Send Wish',
        'invitation.powered_by': 'Powered by Undangan Digital Groovy',
    },
};

let currentLocale = 'id';

export function setLocale(locale) {
    currentLocale = locale;
}

export function getLocale() {
    return currentLocale;
}

export function t(key, replacements = {}) {
    let text = translations[currentLocale]?.[key] || translations['id']?.[key] || key;

    Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`:${k}`, v);
    });

    return text;
}

export function useTranslation(locale) {
    if (locale) setLocale(locale);
    return { t, locale: currentLocale, setLocale };
}

export default translations;
