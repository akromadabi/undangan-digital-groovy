# 📖 Panduan Hidup Pembuatan & Pemeliharaan Tema Undangan Baru

> **Tujuan Dokumen Ini:**
> Sebagai **Blue Print Utama (Standard Operating Procedure)** agar pembuatan tema undangan digital baru di masa depan **100% bebas bug**, fungsionalitas berjalan normal, dan fungsionalitas fiturnya seragam.
> **Tema baru HANYA diperbolehkan mengubah visual (ornamen, font, warna, asset, susunan flexbox/grid), sedangkan logika state, helper parsing data, navigasi swipe, auto-scroll, dan integrasi backend wajib menyalin struktur baku ini tanpa modifikasi menyimpang.**

---

## 1. Filosofi & Arsitektur Root Tema

Setiap tema baru wajib diawali dengan struktur root yang sangat kokoh untuk mencegah kegagalan fatal (seperti *blank screen* secara total).

### 1.1 Error Boundary Baku
Bungkus seluruh render halaman tema di dalam `ErrorBoundary` lokal untuk mendeteksi dan mengisolasi kesalahan render di level seksi (section) tanpa mematikan seluruh aplikasi.
```jsx
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(e) { return { hasError: true, error: e }; }
    render() {
        if (this.state.hasError) return (
            <div className="theme-error-boundary">
                <h2>Terjadi kesalahan pada rendering tema.</h2>
                <pre>{this.state.error?.toString()}</pre>
            </div>
        );
        return this.props.children;
    }
}
```

### 1.2 Setup Awal Direktori Tema
Folder tema diletakkan di: `resources/js/Pages/Invitation/<slug-tema>/`
Struktur folder wajib:
```
nama-tema/
├── DynamicIndex.jsx   ← File utama yang dipanggil router backend
├── style.css          ← File CSS khusus tema (wajib prefix unik, contoh: .wy-...)
└── asset/             ← Aset ornamen, bingkai, mask (format .webp / .svg)
```

### 1.3 Registrasi Whitelist Router Backend (Controller)
Agar Laravel backend dapat mengenali bahwa tema baru memiliki layout dinamis tingkat lanjut (`DynamicIndex.jsx`) dan mencegah sistem melakukan *fallback* otomatis ke tampilan dasar (`Invitation/Show.jsx`), Anda **WAJIB** mendaftarkan slug tema baru Anda ke dalam whitelist di controller backend.

Buka file [InvitationController.php](file:///c:/laragon/www/Undangan%20Digital/app/Http/Controllers/InvitationController.php) dan tambahkan slug tema baru Anda ke dalam array pengecekan `in_array` di tiga tempat berikut:
1. Di dalam method `show()` (untuk rute utama kunjungan tamu undangan live)
2. Di dalam method `demo()` pada blok data demo reseller kustom (sekitar pertengahan file)
3. Di dalam method `demo()` pada blok data demo katalog default (sekitar akhir file)

Contoh kode:
```php
if ($invitation->theme && in_array($invitation->theme->slug, [
    'utary', 'netflix', 'luxury-02', 'luxury-01', 'luxury-03', 'luxury-04', 
    'wayang', 'shopee', 'spotify', 'instagram', 'tiktok', 'chatgpt', 
    'manchester-united', 'moroccan', 'youtube', 'youtube-new', 'slug-tema-anda-di-sini'
])) {
    $page = 'Invitation/' . $invitation->theme->slug . '/DynamicIndex';
}
```
*Catatan*: Jika langkah ini dilewatkan, tema baru Anda akan dirender menggunakan halaman default dasar (`Invitation/Show.jsx`), sehingga seluruh visual kreatif mockup app Anda tidak akan termuat.

---

## 2. Helper Baku & Parsing Data (Props)

Semua tema menerima properti yang sudah dikirim secara otomatis oleh backend. Gunakan helper baku berikut di bagian teratas `DynamicIndex.jsx` agar data yang tidak lengkap tidak memicu crash.

### 2.1 Helper Standardisasi Array & Boolean
```js
// Mencegah error jika data dari DB bernilai null/undefined
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') return Object.values(val);
    return [];
}

// Mengubah nilai boolean string dari database menjadi true/false asli
const parseBool = (val, defaultVal = true) => {
    if (val === undefined || val === null) return defaultVal;
    if (val === false || val === 0 || val === '0' || val === 'false') return false;
    return true;
};
```

### 2.2 Helper Path Gambar `/storage` yang Cerdas (`getStorageUrl`)
*Masalah*: Path gambar di database sering kali memiliki format backslash `\` (Windows), relative path tanpa prefix `/`, atau link demo eksternal. Gunakan helper cerdas ini untuk menjamin kesesuaian di lingkungan Laragon Windows maupun Server Produksi Linux:
```js
function getStorageUrl(url, fallback) {
    if (!url) return fallback;
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.startsWith('themes/') || cleanUrl.startsWith('/themes/')) {
        return cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl;
    }
    if (cleanUrl.startsWith('/storage/')) return cleanUrl;
    if (cleanUrl.startsWith('storage/')) return '/' + cleanUrl;
    if (cleanUrl.startsWith('/')) return cleanUrl;
    return `/storage/${cleanUrl}`;
}
```

### 2.3 Integrasi Multilingual (i18n) & Penerjemahan Bahasa
Semua tema wajib mendukung multi-bahasa (Indonesia/Inggris) secara dinamis menggunakan hooks dari `@/i18n`. Jangan sekali-kali men-hardcode teks bahasa Indonesia saja.
1. **Setup Hooks**:
   Ambil status bahasa aktif dari data undangan yang dikirim backend:
   ```js
   import { useTranslation } from '@/i18n';

   // Di dalam komponen utama DynamicIndex:
   const activeLanguage = invitation?.language || invitation?.default_locale || 'id';
   const { t, locale } = useTranslation(activeLanguage);
   const isEn = locale === 'en';
   ```
2. **Translasi dengan Fungsi `t`**:
   Bungkus setiap teks statis menggunakan fungsi `t('key')` yang terdaftar di `resources/js/i18n.js`:
   - Contoh: `{t('invitation.open')}` untuk tombol buka undangan.
   - Contoh: `{t('invitation.days')}`, `{t('invitation.hours')}` untuk countdown.
3. **Pencabangan Dinamis (Bilingual Switch)**:
   Untuk teks yang tidak terdaftar di file pemetaan `i18n.js` atau memiliki tata bahasa yang berbeda secara struktural, gunakan percabangan string berbasis variabel `locale` atau `isEn`:
   - Contoh: `locale === 'en' ? 'Groom & Bride' : 'Kedua Mempelai'`
   - Pastikan format penulisan dan tanda hubung disesuaikan dengan bahasa aktif.

---

## 3. Aturan Global Penonaktifan Fitur (Global Override Mode)

Setiap tema wajib mematuhi status toggle global yang diatur oleh pengguna melalui dashboard mereka.

### 3.1 Mode Tanpa Foto (`show_photos` / `hide_photos`)
Jika `invitation?.hide_photos` bernilai `true` (atau `show_photos` mati):
1. **Gallery Section**: Dihilangkan secara total (keluarkan dari array `resolvedSections`).
2. **Avatar Mempelai**: Frame foto atau avatar mempelai wajib digantikan dengan **Monogram Inisial Huruf** yang elegan (misal: "B" dan "R") atau siluet ornamen yang serasi.
3. **Background Image**: Cover utama dan background seksi beralih menggunakan warna solid, gradasi sleek, atau pola watermark abstrak.

### 3.2 Mode Tanpa Animasi (`show_animations`)
Jika `invitation?.show_animations === false` (atau bernilai `0`):
1. **Bypass Observer**: Seluruh komponen pembungkus scroll reveal (seperti `<Reveal>`) harus langsung mengembalikan visibilitas `true` pada render awal dan mematikan masa tunggu observer.
2. **CSS Global Override**: Tempelkan kelas `.theme-no-animations` pada wrapper halaman terluar, kemudian definisikan aturan reset total di CSS:
   ```css
   .theme-no-animations *,
   .theme-no-animations *::before,
   .theme-no-animations *::after {
       animation: none !important;
       transition: none !important;
       transition-delay: 0s !important;
       animation-delay: 0s !important;
   }
   ```

---

## 4. Standar Fungsionalitas Setiap Seksi (Section Blueprint)

### 4.1 Seksi Sampul (`CoverSection` / `Cover`)
- Tampilkan logo monogram inisial melingkar di tengah.
- **Dukungan Banyak Foto (Cover Slideshow)**: Cover mendukung satu atau beberapa foto sekaligus. Wajib diparsing dan dirender menggunakan `<PremiumSlideshow>` agar transisinya mulus:
  ```js
  const coverImages = useMemo(() => {
      return (invitation?.cover_image || '')
          .split(',')
          .map(img => getStorageUrl(img.trim()))
          .filter(Boolean);
  }, [invitation?.cover_image]);
  ```
  Di dalam render JSX:
  ```jsx
  {showPhotos && coverImages.length > 0 && (
      <PremiumSlideshow
          images={coverImages}
          positionX={invitation?.cover_position_x}
          positionY={invitation?.cover_position_y}
          zoom={invitation?.cover_zoom}
      />
  )}
  ```
- Tombol **"Buka Undangan"** wajib memicu fungsi pembukaan yang memutar musik latar (`autoplay`), membuka kuncian gulir layar (`overflow: auto`), dan memicu Fullscreen mode browser secara otomatis:
  ```js
  if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
  }
  ```

### 4.2 Seksi Pembuka / Opening (`opening`)
Seksi pembuka harus ada dan terstruktur dengan kriteria berikut:
- **Dukungan Banyak Foto (Opening Slideshow)**: Foto pembuka mendukung beberapa foto (slideshow). Wajib diparsing dan dirender menggunakan `<PremiumSlideshow>` dengan aspek rasio `4/3` (atau sesuai desain tema):
  ```js
  const openingImages = useMemo(() => {
      return (invitation?.opening_image || '')
          .split(',')
          .map(img => getStorageUrl(img.trim()))
          .filter(Boolean);
  }, [invitation?.opening_image]);
  ```
  Di dalam render JSX:
  ```jsx
  {showPhotos && openingImages.length > 0 && (
      <div className="opening-slideshow-wrapper">
          <PremiumSlideshow
              images={openingImages}
              positionX={invitation?.opening_position_x}
              positionY={invitation?.opening_position_y}
              zoom={invitation?.opening_zoom}
          />
      </div>
  )}
  ```
- **Keterangan Mempelai (Monogram/Initials/Nama)**: Harus menampilkan inisial monogram atau nama panggilan mempelai (misal: "B & R") sebagai pengantar yang jelas sebelum masuk ke detail profil masing-masing mempelai.
- **Salam Pembuka & Basmalah**: Menampilkan lafadz basmalah/kalimat pembuka (contoh: "Bismillah" atau pembuka bernuansa islami/universal) sesuai preferensi yang disimpan di database:
  - Judul pembuka (`invitation?.opening_title` dengan fallback "Maha Suci Allah" atau sejenisnya).
  - Ayat/kutipan pembuka (`invitation?.opening_ayat`).
  - Teks deskripsi pembuka (`invitation?.opening_text`).

### 4.3 Seksi Mempelai (`bride_groom` / `couple`)
- **Deteksi Gender yang Kokoh**: Jangan andalkan urutan indeks array `couples[0]`/`couples[1]` saja. Selalu filter berdasarkan string jenis kelamin:
  ```js
  const couples = safeArr(brideGrooms);
  const bride = couples.find(b => ['wanita', 'female'].includes(String(b.gender).toLowerCase())) || couples[0] || {};
  const groom = couples.find(b => ['pria', 'male'].includes(String(b.gender).toLowerCase())) || couples[1] || couples[0] || {};
  ```
- **Penerjemahan Urutan Anak Otomatis**: Gunakan helper baku `translateChildOrder` untuk menangani format bilingual (misal: "PUTRI PERTAMA DARI" vs "FIRST DAUGHTER OF") secara akurat.
- **Link Instagram**: Hilangkan karakter `@` dari database sebelum menyematkan link:
  ```jsx
  href={`https://instagram.com/${(bride.instagram || '').replace('@', '')}`}
  ```

### 4.4 Seksi Acara & Countdown (`event`)
- **Penyatuan Countdown**: Countdown timer **WAJIB** digabungkan di seksi ini (diletakkan di bagian atas sebelum detail daftar acara). Tidak boleh ada seksi countdown terpisah!
- **Kondisionalitas Countdown (Save The Date tidak selalu ada)**: Countdown timer **TIDAK** boleh di-hardcode selalu tampil. Tampilkan hanya jika status countdown aktif di database, ada tanggal acara utama, dan seksi countdown diizinkan tampil:
  ```js
  const showCountdown = parseBool(invitation?.show_countdown);
  const showCountdownInEvent = useMemo(() => {
      const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
      if (!primaryEvent?.event_date || !showCountdown) return false;
      
      const safeSections = safeArr(sections);
      if (safeSections.length > 0) {
          const cSection = safeSections.find(s => s.section_key === 'countdown');
          return cSection ? !!cSection.is_visible : false;
      }
      return true;
  }, [sections, events, showCountdown]);
  ```
  Di dalam render JSX:
  ```jsx
  {showCountdownInEvent && (
      <CountdownTimer events={events} />
  )}
  ```
- **Lokasi & Google Maps**: Menyediakan nama tempat, alamat lengkap, dan tombol pembuka **Google Maps** (`gmaps_link`) untuk memudahkan navigasi tamu.

### 4.5 Seksi Live Streaming Mandiri (`livestream`)
- **Satu-satunya Seksi Streaming**: Siaran langsung **HANYA** diperbolehkan tampil berupa seksi / halaman mandiri terdedikasi (`livestream`). Tidak diperbolehkan menyematkan tombol streaming di dalam kartu seksi acara (`event`) agar tata letak tetap konsisten.
- **Auto-Hide Cerdas**: Seksi ini **WAJIB** otomatis menyembunyikan dirinya sendiri (kembali bernilai `null` atau terfilter keluar dari list sections) jika kolom list `streaming_url` and `streamings` di database dalam keadaan kosong.
- **Pola Komponen Standar**:
  ```jsx
  function LiveStreamingSection({ events, invitation }) {
      const { t } = useTranslation();
      const primaryEvent = safeArr(events).find(e => e.is_primary) || safeArr(events)[0];
      
      const streamsList = [];
      if (primaryEvent?.streaming_url) {
          streamsList.push({ platform: primaryEvent.streaming_platform || 'Live', url: primaryEvent.streaming_url });
      }
      if (Array.isArray(primaryEvent?.streamings)) {
          primaryEvent.streamings.forEach(s => {
              if (s.url && !streamsList.some(item => item.url === s.url)) {
                  streamsList.push({ platform: s.platform || 'Live', url: s.url });
              }
          });
      }

      if (streamsList.length === 0) return null;

      const isEn = t('invitation.save_the_date') === 'Save The Date';

      return (
          <section className="tema-section" id="livestream">
              <h2 className="tema-section-title">{isEn ? 'Live Streaming' : 'Siaran Langsung'}</h2>
              <p className="tema-section-subtitle">{isEn ? 'Join our wedding virtually' : 'Saksikan momen bahagia kami secara virtual'}</p>
              
              <div className="tema-livestream-container">
                  {streamsList.map((stream, idx) => (
                      <button key={idx} type="button" onClick={() => window.open(stream.url, '_blank')} className="tema-btn-livestream">
                          <i className="fas fa-video" /> WATCH {stream.platform.toUpperCase()}
                      </button>
                  ))}
              </div>
          </section>
      );
  }
  ```

### 4.6 Seksi Rekening & Kado (`bank`)
- **UI Rekening Default**: Tampilan dan desain UI rekening secara default wajib mengikuti atau menyerupai UI rekening pada tema **Luxury 2** (luxury-02) demi menjaga standar estetika premium dan konsistensi visual.
- **Safari & WebView Clipboard Copy Fallback**: `navigator.clipboard` diblokir pada in-app browser seluler (seperti saat membuka link dari Instagram / WhatsApp) serta perangkat Safari iOS yang tidak menggunakan koneksi HTTPS ketat. **WAJIB** gunakan skema fallback textarea dinamis:
  ```js
  const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      Object.assign(ta.style, { position: 'fixed', opacity: 0 });
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
  };
  ```

### 4.7 Seksi RSVP & Ucapan Terpadu (`rsvp` / `wishes`)
- **Unified Form**: RSVP dan Ucapan **WAJIB** berada dalam satu seksi terpadu untuk efisiensi ruang layar ponsel:
  - Form memiliki nama lengkap (otomatis terisi nama tamu dari URL `?to=slug` jika ada), pilihan kehadiran (Hadir / Tidak Hadir), jumlah orang (hanya muncul jika Kehadiran = Hadir), dan kolom pesan doa/ucapan.
- **Scrollable Wishes List**: Batasi penampilan list ucapan maksimal **5 item terbaru** dengan kuncian CSS `max-height: 280px` and `overflow-y: auto` agar halaman tidak memanjang tanpa batas di seluler.
- **Filter Duplikasi Section**: Jika RSVP aktif, hilangkan seksi `wishes` dari list sections agar tidak memicu duplikasi form di halaman.
- **Fitur Emoticon di Komentar**: Jika form komentar/ucapan dilengkapi dengan pemilih emoticon (*emoji picker*), pastikan popover/overlay pemilih emoji berada di dalam modal khusus atau memiliki pengaturan `z-index` yang tepat agar tidak terpotong oleh batas layar atau menutupi tombol kirim secara permanen. Ikon emoticon yang dirender di dalam teks ucapan wajib memiliki kuncian CSS tinggi proporsional (misalnya, `height: 1.2em` atau `font-size: 1.2rem` dengan `display: inline-block`) agar tidak merusak tinggi baris (*line-height*) teks ucapan.

### 4.8 Seksi Penutup & Tanda Tangan Formal (`closing` / `footer`)
- **Tanda Tangan Formal Dinamis**: Menampilkan tanda tangan keluarga besar secara otomatis berdasarkan nama orang tua di database:
  ```jsx
  {hasGroomParents && <div>{isEn ? `Family of Mr. ${groomFather} & Mrs. ${groomMother}` : `Kel. Bapak ${groomFather} & Ibu ${groomMother}`}</div>}
  ```
- **Watermark Reseller Seragam ("Made with ❤️")**: Wajib menyertakan teks kredit seragam yang dinamis menggunakan nama brand reseller (mendukung pencarian dari akun reseller langsung maupun akun sub-reseller):
  ```jsx
  const brandName = invitation?.user?.reseller_settings?.brand_name 
      || invitation?.user?.reseller?.reseller_settings?.brand_name 
      || 'TrueLove Invitation';
  
  <p className="watermark">
      Made with ❤️ by {brandName}
  </p>
  ```
  *(Catatan khusus Shopee: Letakkan watermark ini di bagian paling bawah tab Beranda/Home dengan `padding-bottom: 80px` agar tidak tertutup navigation bar bawah).*

### 4.9 Fitur QR Code Presensi / Check-in Tamu (`enableQr` / `showQr`)
Every theme must support QR Code presence check-in automatically if enabled.
1. **Helper & State Setup**:
   Definisikan state `showQr` dan variabel `enableQr` di komponen utama `DynamicIndex.jsx`:
   ```js
   const [showQr, setShowQr] = useState(false);
   const enableQr = parseBool(invitation?.enable_qr, true) && parseBool(invitation?.show_qr_code, true);
   const activeGuest = guest || null;
   ```
2. **Tombol Trigger**:
   - Tampilkan tombol pemicu QR Code (ikon `fas fa-qrcode`) jika `enableQr && activeGuest` bernilai true.
   - Letakkan di lokasi yang mudah diakses (misalnya: di bar navigasi/header, atau sebagai floating button di atas/samping tombol auto-scroll/audio).
3. **Modal Overlay QR Code**:
   - Modal wajib ter-render secara kondisional: `{enableQr && showQr && activeGuest && ( ... )}`.
   - Di dalam modal, tampilkan QR Code dinamis menggunakan API QR Server gratis:
     ```jsx
     <img 
         src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=COLOR_HEX&data=${encodeURIComponent(window.location.origin + '/u/' + invitation.slug + '/checkin?to=' + activeGuest.slug)}`} 
         alt="QR Code Presensi" 
     />
     ```
     *(Ganti `COLOR_HEX` dengan warna hex primer tema tanpa tanda pagar, contoh: `1db954` untuk Spotify atau `ee4d2d` untuk Shopee)*.
   - Sediakan tombol tutup untuk mengubah state `setShowQr(false)`.
   - Pastikan overlay memiliki latar belakang gelap transparan (`rgba(0, 0, 0, 0.8)`) dengan efek blur (`backdrop-filter: blur(8px)`) agar tampak premium.

### 4.10 Standar Visual Penanganan Gambar & Foto (Anti-Empty Space & Cover Lock)
*Masalah*: Browser Chrome/Safari sering kali menimpa tinggi gambar (`height: 100%`) menjadi otomatis (`height: auto`) jika terdapat aturan reset CSS global seperti `img { height: auto; }`. Ketika pengguna mengunggah foto berorientasi landscape ke wadah berorientasi potret (atau sebaliknya), foto tersebut tidak akan memenuhi wadah, menyisakan area kosong berwarna hitam pekat di bagian bawah wadah (seperti yang sering terjadi pada profil mempelai dan grid galeri persegi).

*Standardisasi Mutlak*:
Setiap foto profil mempelai, foto galeri, slideshow cover, dan slideshow opening **WAJIB** dikunci properti dimensinya di dalam CSS menggunakan `!important` untuk menjamin foto selalu mengisi wadahnya secara penuh 100% tanpa kompromi:
```css
/* Menjamin foto yang menggunakan object-fit cover selalu memenuhi wadahnya dengan sempurna (Mencegah bug ruang kosong hitam) */
.prefix-tema img.class-foto-profil,
.prefix-tema img.class-foto-galeri,
.prefix-tema .cover-photo-window img,
.prefix-tema .opening-photo-window img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}
```

> [!NOTE]
> **Kompatibilitas Sistem Kroping & Reposisi Dashboard:**
> Aturan CSS di atas **100% aman dan tidak akan bentrok** dengan fitur kroping/reposisi visual di dashboard. 
> 
> * **Cara Kerja Browser:** Karena CSS global tema hanya mengunci ukuran dimensi dan `object-fit`, properti inline dinamis dari database seperti `object-position` (untuk geser koordinat X/Y) dan `transform: scale` (untuk perbesaran/zoom) tidak menggunakan `!important`, sehingga tetap akan diterapkan secara sempurna oleh browser sebagai overlay style.
> * **Kuncian Wadah (Parent Container):** Selalu pastikan elemen pembungkus (parent container) dari gambar mempelai, cover, dan opening yang mendukung zoom memiliki properti `overflow: hidden`. Ini penting agar bagian gambar yang ter-zoom tidak melebar keluar batas frame/lingkaran wadahnya.

### 4.11 Seksi Video Undangan / Background Video (`video`)
- **Auto-Hide Cerdas**: Seksi ini **WAJIB** otomatis menyembunyikan dirinya sendiri (kembali bernilai `null` atau terfilter keluar dari list sections) jika kolom URL video (`invitation?.video_url` atau `video`) di database dalam keadaan kosong.
- **Pemisahan dari Galeri Foto**: Seksi video ini harus dipisah secara terdedikasi dan mandiri dari seksi foto galeri.
- **Tampilan Inline Tanpa Popup**: Pemutar video **WAJIB** disematkan langsung di halaman (inline iframe) secara lebar penuh responsif, bukan berupa thumbnail yang memicu popup modal/lightbox.
- **Dukungan Fullscreen Zoom**: Elemen iframe pemutar video wajib menyertakan atribut `allowFullScreen` agar pengguna dapat memutar video dalam mode layar penuh (zoom full) seperti standar YouTube.
- **Bilingual Terjemahan Judul**: Judul seksi video wajib mendukung multi-bahasa menggunakan hooks `@/i18n` (contoh: `locale === 'en' ? 'Our Video' : 'Momen Video'`) seperti seksi lainnya, agar bisa disesuaikan dengan preferensi bahasa aktif.
- **Responsivitas Aspek Rasio**: Pemutar video (baik embed YouTube, Vimeo, maupun file MP4 kustom) wajib dibungkus dalam wadah aspek rasio standar 16:9 agar responsif di seluruh layar ponsel tanpa terpotong (*black bars*):
  ```css
  .prefix-tema .video-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9 !important;
      overflow: hidden;
      border-radius: 12px;
  }
  .prefix-tema .video-container iframe,
  .prefix-tema .video-container video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100% !important;
      height: 100% !important;
      border: 0;
  }
  ```
- **Kebijakan Autoplay & Suara**: Sesuai kebijakan browser modern, jika video diatur memutar otomatis (*autoplay*), properti `muted` wajib diset `true` (senyap). Jika pengguna mengaktifkan suara video, sistem wajib secara otomatis mem-pause lagu/musik latar belakang (`audioRef` & `isPlaying` state) undangan agar suara tidak saling bertabrakan.

### 4.12 Seksi Panduan Dresscode / Kode Busana (`dresscode`)
- **Auto-Hide**: Seksi dresscode wajib disembunyikan jika statusnya dinonaktifkan (`invitation?.show_dresscode === false`) atau data dresscode kosong.
- **Lingkaran Palet Warna Dinamis**: Tampilkan rekomendasi warna dresscode dalam bentuk lingkaran warna visual yang dinamis berbasis data hex warna dari database. Gunakan susunan Flexbox/Grid yang rapi:
  ```jsx
  const colors = invitation?.dresscode_colors ? invitation.dresscode_colors.split(',') : [];
  
  {colors.length > 0 && (
      <div className="dresscode-colors-flex">
          {colors.map((color, idx) => (
              <div 
                  key={idx} 
                  className="dresscode-color-circle" 
                  style={{ backgroundColor: color.trim() }}
                  title={color.trim()}
              />
          ))}
      </div>
  )}
  ```
- **Bilingual Terjemahan & Format Judul Dinamis**: Judul dan penjelasan dresscode wajib mendukung nama acara dinamis dan multi-bahasa menggunakan hooks `@/i18n`. Format penulisan judul standar yang disepakati adalah `Dress Code (Nama Acara)` (contoh: `Dress Code (Akad Nikah)` atau `Dress Code (Resepsi)`) agar mempermudah tamu dalam membedakan busana untuk masing-masing acara.
- **Ukuran Bulatan Warna Standar**: Gunakan ukuran bulatan warna standar Tailwind **`w-6 h-6`** (setara dengan `24px`) agar proporsional dan menyelaraskan dengan tinggi teks labelnya secara visual di layar ponsel.

### 4.13 Seksi Galeri Foto (`gallery`)
- **Pemisahan Mutlak dari Video**: Seksi galeri foto wajib dipisah secara total dari seksi video. Tidak diperbolehkan menyisipkan link video YouTube atau memadukan video ke dalam barisan/grid foto prewedding. Galeri foto hanya boleh berisi kumpulan aset foto prewedding (`galleries`).
- **Bilingual Terjemahan Judul**: Judul seksi galeri foto wajib mendukung multi-bahasa menggunakan hooks `@/i18n` (contoh: `t('invitation.gallery')` atau percabangan `locale === 'en' ? 'Our Moments' : 'Galeri Foto'`) agar judulnya berubah dinamis sesuai bahasa terpilih.
- **Optimasi Foto**: Foto-foto dalam grid galeri wajib menggunakan kuncian dimensi aspek rasio (`object-fit: cover` dengan dimensi `width: 100% !important; height: 100% !important;`) di dalam wadah pembungkus (`overflow: hidden`) untuk mencegah distorsi visual atau area kosong pekat di layar seluler.

---

## 5. Layout Mode & Mesin Transisi Halaman (Swipe & Scroll)

Tema undangan harus berjalan mulus dalam 3 mode tata letak: `scroll` (gulir vertikal), `slide-h` (geser horizontal), dan `slide-v` (geser vertikal).

### 5.1 Mode Gulir (`scroll` dengan Scrollspy)
Untuk mode scroll vertikal biasa, menu navigasi mengambang (bottom bar) wajib menyelaraskan tab aktif secara otomatis sesuai posisi gulir layar dengan presisi menggunakan Intersection Observer atau window scroll listener (Scrollspy).

### 5.2 Mode Slide Geser (`slide-h` / `slide-v`)
Agar setara dengan kelancaran tema **Luxury-02**, struktur transisi geser wajib mematuhi aturan baku berikut:

1. **Parallel DOM Rendering**: Render **seluruh** seksi aktif secara simultan di dalam DOM dengan membungkusnya menggunakan kelas status transisi (`is-active`, `is-next`, `is-prev`). Jangan pernah me-render seksi secara kondisional (`activeSection === key && <Component>`) karena akan mematikan efek transisi geser horizontal/vertikal.
2. **Kuncian Container**: Wrapper utama seksi slide wajib mengunci tinggi layar secara mutlak (`height: 100vh` / `100dvh`, `overflow: hidden`) dan memindahkan scrollbar ke dalam internal slide (`.theme-slide-container { overflow-y: auto; height: 100%; }`).
3. **Penyelesaian Stale Closures (Swipe Sinkron)**: Hubungkan state navigasi `activeSection` dan nomor halaman `slideIdx` melalui sebuah hook sinkronisasi `useEffect` terdedikasi untuk mencegah lompatan navigasi:
   ```js
   useEffect(() => {
       const targetKey = resolvedSections[slideIdx]?.section_key;
       if (targetKey) setActiveSection(targetKey);
   }, [slideIdx, resolvedSections]);
   ```
4. **Auto-Scroll Piksel Terpadu (Auto-Geser di Mode Slide)**:
   - Jika Auto Scroll aktif di mode slide, deteksi terlebih dahulu apakah tinggi konten slide melebihi tinggi layar.
   - Jika YA, program akan secara otomatis menggulirkan konten internal slide secara perlahan (pixel-by-pixel, contoh `scrollTop += 1`) dari atas ke bawah.
   - Begitu konten internal slide tersebut telah mencapai dasar terdalam (atau jika konten slide memang pendek), sistem akan memberikan jeda waktu tunggu (delay) selama 4 detik sebelum meluncurkan efek transisi geser ke slide halaman berikutnya secara otomatis!

### 5.3 Fungsionalitas Fullscreen Halaman
Setiap tema harus menyediakan fitur Fullscreen yang konsisten di semua layout:
1. **Auto-Fullscreen saat Dibuka**: Begitu tombol "Buka Undangan" diklik, halaman otomatis memicu API fullscreen browser.
2. **State & Event Listener Fullscreen**:
   ```js
   const [isFullscreen, setIsFullscreen] = useState(false);

   useEffect(() => {
       const handleFullscreenChange = () => {
           setIsFullscreen(!!document.fullscreenElement);
       };
       document.addEventListener('fullscreenchange', handleFullscreenChange);
       return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
   }, []);

   const toggleFullscreen = () => {
       if (!document.fullscreenElement) {
           document.documentElement.requestFullscreen().catch(() => {});
       } else {
           document.exitFullscreen();
       }
   };
   ```
3. **Tombol Layar Penuh (Fullscreen Toggle)**:
   - Sediakan tombol mengambang (floating button) untuk masuk/keluar dari mode layar penuh.
   - Posisi tombol ini **WAJIB** diletakkan tepat di atas tombol Auto Scroll (atau sebaris dalam kontrol navigasi sejenis).
   - Tampilan tombol menggunakan ikon `fas fa-expand` (untuk masuk fullscreen) dan `fas fa-compress` (untuk keluar fullscreen).

---

## 6. Integrasi Backend, Formulir Dashboard & Local Development


### 6.1 Safe Seeding (Perlindungan Data Pengguna)
Saat berpindah tema di menu **Pengaturan Tema** dashboard, controller **ThemeSettingsController.php** tidak boleh secara brutal menghapus data penting pengguna. Pengecekan jumlah relasi database wajib dilakukan sebelum seeding default data bawaan tema dijalankan:
```php
if (!empty($defaultData['bride_grooms']) && $invitation->brideGrooms()->count() === 0) {
    // Jalankan create data mempelai demo...
}
```

### 6.2 Pencegahan Reset Input Diam-diam di Form Dashboard
Formulir edit konten di dashboard (seperti `Acara.jsx` dan `Mempelai.jsx`) **wajib** mendestrukturkan `errors` dari Inertia dan menampilkannya dalam format:
- **Error Summary Alert Box**: Kotak peringatan merah cerah di bagian atas form yang memetakan seluruh baris error secara transparan.
- **Inline Input Feedback**: Kotak input yang memicu error validasi berubah menjadi ber-border merah disertai dengan label teks peringatan detail tepat di bawahnya.
Ini menjamin pengguna langsung mengetahui letak kesalahan pengisian data (misalnya format maps link atau tanggal kosong) alih-alih mengalami reset form diam-diam yang membingungkan.

### 6.3 Windows Directory Junction (`mklink /J`)
Untuk penanganan aset media lokal yang diupload agar tidak memicu error 404 (tidak terbaca) pada komputer Windows tanpa memerlukan hak akses Administrator, direktori link wajib dibuat sebagai Directory Junction:
```cmd
rmdir public\storage
cmd /c mklink /J "public\storage" "storage\app\public"
```

---

## 7. Panduan Khusus Tema Single-Celebrant (Ulang Tahun, Khitanan, Aqiqah)

Untuk pembuatan tema yang ditujukan untuk acara dengan tokoh tunggal (single-celebrant) seperti Ulang Tahun, Khitanan, atau Aqiqah, ikuti kaidah penyesuaian data dan istilah berikut:

### 7.1 Cara Mengambil 1 Profil Tunggal dari `brideGrooms`
Pada database, tabel `bride_grooms` tetap digunakan untuk menyimpan data profil tokoh utama. Bedanya, jika pernikahan menyimpan 2 data mempelai, maka acara single-celebrant hanya menyimpan 1 data tokoh utama pada baris pertama (indeks 0):
```js
const couples = safeArr(brideGrooms);
const celebrant = couples[0] || {}; // Profil utama anak/tokoh yang merayakan
```
Gunakan variabel `celebrant` ini untuk menampilkan nama lengkap (`celebrant.full_name`), nama panggilan (`celebrant.nickname`), foto (`celebrant.photo`), dan sosial media.

### 7.2 Penyesuaian Nama Orang Tua (Keluarga yang Mengundang)
Karena tokoh utama hanya satu orang, maka data orang tua juga hanya berasal dari profil tunggal `celebrant`:
```js
const fatherName = celebrant.father_name || '';
const motherName = celebrant.mother_name || '';
const childOrder = celebrant.child_order || '';
```
Pada seksi penutup/footer, tampilkan nama keluarga yang mengundang secara dinamis:
```jsx
{fatherName && motherName && (
    <p>
        {isEn ? `Family of Mr. ${fatherName} & Mrs. ${motherName}` : `Kel. Bapak ${fatherName} & Ibu ${motherName}`}
    </p>
)}
```

### 7.3 Milestones / Love Story Tetap Aktif
Fitur **Love Story (`love_stories`)** tetap aktif untuk tema Ulang Tahun atau tumbuh kembang anak, namun dialihkan fungsinya untuk menceritakan **milestones perjalanan usia** atau **momen tumbuh kembang** (contoh: usia 1 tahun, usia 3 tahun, saat mulai sekolah, dll.).
- Sesuaikan judul heading seksi ini secara fleksibel, misalnya: `Perjalanan Usia`, `Tumbuh Kembang`, `Our Journey`, atau `Milestones`.

### 7.4 Penyesuaian Istilah dan Terminologi Konten
Sesuaikan seluruh sebutan statis bertema pernikahan di dalam JSX agar lebih umum dan ramah untuk acara tunggal:
- **Heading Profil Mempelai**: Ubah tulisan `"Kedua Mempelai"` atau `"Groom & Bride"` menjadi `"Yang Merayakan"`, `"Tentang Anak Kami"`, `"Birthday Kid"`, atau nama panggilan tokoh utama (`celebrant.nickname`).
- **Layout Profil**: Hindari membuat dua kolom bersebelahan untuk dua orang. Tampilkan satu kolom terpusat yang besar dan berdesain estetis untuk profil tunggal `celebrant`.
- **Seksi Acara**: Ganti kata `"Akad & Resepsi"` menjadi `"Pesta Ulang Tahun"`, `"Acara Syukuran"`, `"Pesta Khitanan"`, atau biarkan dinamis membaca kolom `event.name` dari database.
- **Countdown**: Arahkan hitung mundur ke waktu mulai acara pesta utama (`event.event_date`).

---

## 8. Standar Musik Latar & Kontrol Animasi Gelombang (Music Equalizer)

Setiap tema wajib mematuhi standar terpadu untuk pemutaran musik latar dan visualisasi status pemutaran:

### 8.1 Kontrol Halaman Tidak Aktif (Page Visibility API)
Untuk memastikan kenyamanan pengguna, setiap tema **WAJIB** menggunakan custom hook `usePageVisibilityAudio` untuk menghentikan musik saat tab browser ditinggalkan/diminimalkan dan memutarnya kembali saat pengguna kembali ke halaman undangan:
```js
import usePageVisibilityAudio from '@/hooks/usePageVisibilityAudio';

// Di dalam komponen utama DynamicIndex:
const audioRef = useRef(null);
const [isPlaying, setIsPlaying] = useState(false);

// Integrasikan hook di bawah inisialisasi state audio
usePageVisibilityAudio(audioRef, isPlaying, setIsPlaying);
```

### 8.2 Animasi Gelombang Equalizer Default (.global-music-waves)
Tombol kontrol musik mengambang (floating music button) tidak boleh hanya menampilkan ikon musik statis atau berputar saat musik sedang dimainkan. Wajib menampilkan animasi equalizer gelombang 3-bar dinamis menggunakan markup global berikut:
```jsx
// Di dalam render tombol musik:
<button type="button" className="..." onClick={toggleMusic}>
    {isPlaying ? (
        <div className="global-music-waves">
            <span />
            <span />
            <span />
        </div>
    ) : (
        <i className="fas fa-volume-mute" />
    )}
</button>
```
*Catatan Desain*: Animasi gelombang ini menggunakan `background-color: currentColor`, sehingga secara otomatis akan mewarisi warna teks/ikon tombol yang bersangkutan pada tema masing-masing.

---

## 9. Rujukan Referensi Kode Terbaik

| Nama Tema | Direktori File Utama | Keunggulan Utama Sebagai Standard Referensi |
|---|---|---|
| **Luxury 02** | `resources/js/Pages/Invitation/luxury-02/` | Standard transisi swipe horizontal/vertikal termulus, multi-slideshow cover, auto-scroll, desain UI rekening default, dan error boundary tangguh. |
| **Utary** | `resources/js/Pages/Invitation/utary/` | Standard penanganan countdown menyatu, copy rekening aman Safari, QR check-in, dan penanganan watermark dinamis. |

---

## 10. Protokol Replikasi Cerdas dari Referensi HTML / Mockup (AI-Assisted Porting)

Saat membuat tema baru berdasarkan porting/replikasi dari **Referensi berkas HTML mentah** atau **Mockup halaman web statis**, kecerdasan dalam memahami detail referensi menjadi pembeda utama antara hasil yang penuh bug dengan tema premium siap pakai. 

AI Coding Assistant wajib memahami bahwa **mereplikasi referensi berbeda dengan membuat tema kreatif baru secara bebas**. Replikasi menuntut ketepatan struktural, sedangkan kreasi bebas mengandalkan improvisasi estetika.

### 10.1 Analisis & Penyelarasan Ornamen, Animasi, dan Latar Belakang (Background)
* **Penyelaman Latar Belakang:** Analisis dengan teliti apakah latar belakang referensi menggunakan gambar ornamen (`background-image`), gradasi CSS linear/radial, atau warna solid. Jangan pernah melewatkan aset latar belakang ini karena ia merupakan penentu 80% atmosfer tema asli.
* **Preservasi Ornamen & Hierarki z-index:** Ornamen daun, bunga, atau border hiasan seringkali hilang atau tertutup konten utama karena kesalahan pengaturan layer. Wajib definisikan ornamen secara terpisah dengan struktur kontainer absolut dan `z-index` yang dikunci dengan hati-hati (misal: latar belakang `z-0`, konten `z-10`, ornamen hiasan `z-20`).
* **Koreografi Animasi Asli:** Perhatikan efek animasi bawaan dari referensi HTML (seperti detak napas, transisi memudar, atau ayunan). AI wajib memetakan durasi (`duration`), delay (`delay`), serta jenis timing function (seperti `ease-in-out` atau `cubic-bezier`) secara tepat ke dalam JSX/CSS tema baru.

### 10.2 Kontras Tinggi Ikon & Standardisasi Aksesibilitas (Belajar dari Luxury 02)
* **Masalah Warna Ikon yang Hilang:** Pada porting referensi, AI sering kali secara brutal menyalin warna default ikon sehingga ia memiliki warna yang sama (atau hampir sama) dengan latar belakang barunya, menjadikannya tidak terbaca atau hilang secara visual.
* **Pembungkus Tombol Mengambang Pintar (Floating Button Wrappers):** Untuk menghindari masalah di atas, ikuti standar kokoh dari tema **Luxury 02**:
  - Tombol melayang (*floating action buttons*) dan ikon navigasi wajib dibungkus dalam kontainer sirkular/persegi yang memiliki latar belakang kontras semi-transparan (contoh: `rgba(255, 255, 255, 0.15)` dengan efek `backdrop-filter: blur(8px)` untuk tema gelap, atau `rgba(0, 0, 0, 0.05)` untuk tema terang).
  - Terapkan bayangan lembut (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)`) untuk memisahkan secara visual posisi ikon dengan elemen latar belakang.
  - Tambahkan transisi warna yang tegas ketika tombol mendapatkan fokus atau disentuh (`:active`, `:hover`).

### 10.3 Deteksi & Mitigasi Bug Struktural
* **Anti-Overlapping Konten:** Pastikan tidak ada elemen navigasi bawah (bottom navigation bar) yang menutupi konten seksi penutup atau tombol aksi penting di bagian bawah layar ponsel. Berikan padding bawah ekstra pada seksi penutup (contoh: `padding-bottom: 90px !important`).
* **Verifikasi Grid & Flexbox:** AI harus secara cerdas membedakan elemen kolom yang butuh adaptasi responsif seluler. Struktur tabel lebar atau flex sebaris dari referensi desktop **wajib** diubah menjadi grid satu kolom atau flex-col saat mendeteksi ukuran layar ponsel agar konten tidak terpotong ke samping.

*Dokumen ini adalah standarisasi mutlak. Jika tema baru Anda memiliki perilaku yang berbeda dari aturan di atas, Anda telah melanggar blueprint dan wajib merevisinya kembali.*
*Terakhir diperbarui: Mei 2026*


