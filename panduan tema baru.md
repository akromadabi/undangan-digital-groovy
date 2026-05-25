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
- Tombol **"Buka Undangan"** wajib memicu fungsi pembukaan yang memutar musik latar (`autoplay`), membuka kuncian gulir layar (`overflow: auto`), dan memicu Fullscreen mode browser secara otomatis:
  ```js
  if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
  }
  ```

### 4.2 Seksi Mempelai (`bride_groom` / `couple`)
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

### 4.3 Seksi Acara & Countdown (`event`)
- **Penyatuan Countdown**: Countdown timer **WAJIB** digabungkan di seksi ini (diletakkan di bagian atas sebelum detail daftar acara). Tidak boleh ada seksi countdown terpisah!
- **Lokasi & Google Maps**: Menyediakan nama tempat, alamat lengkap, dan tombol pembuka **Google Maps** (`gmaps_link`) untuk memudahkan navigasi tamu.

### 4.4 Seksi Live Streaming Mandiri (`livestream`)
- **Satu-satunya Seksi Streaming**: Siaran langsung **HANYA** diperbolehkan tampil berupa seksi / halaman mandiri terdedikasi (`livestream`). Tidak diperbolehkan menyematkan tombol streaming di dalam kartu seksi acara (`event`) agar tata letak tetap konsisten.
- **Auto-Hide Cerdas**: Seksi ini **WAJIB** otomatis menyembunyikan dirinya sendiri (kembali bernilai `null` atau terfilter keluar dari list sections) jika kolom list `streaming_url` dan `streamings` di database dalam keadaan kosong.
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

### 4.5 Seksi Rekening & Kado (`bank`)
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

### 4.6 Seksi RSVP & Ucapan Terpadu (`rsvp` / `wishes`)
- **Unified Form**: RSVP dan Ucapan **WAJIB** berada dalam satu seksi terpadu untuk efisiensi ruang layar ponsel:
  - Form memiliki nama lengkap (otomatis terisi nama tamu dari URL `?to=slug` jika ada), pilihan kehadiran (Hadir / Tidak Hadir), jumlah orang (hanya muncul jika Kehadiran = Hadir), dan kolom pesan doa/ucapan.
- **Scrollable Wishes List**: Batasi penampilan list ucapan maksimal **5 item terbaru** dengan kuncian CSS `max-height: 280px` dan `overflow-y: auto` agar halaman tidak memanjang tanpa batas di seluler.
- **Filter Duplikasi Section**: Jika RSVP aktif, hilangkan seksi `wishes` dari list sections agar tidak memicu duplikasi form di halaman.

### 4.7 Seksi Penutup & Tanda Tangan Formal (`closing` / `footer`)
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

## 7. Rujukan Referensi Kode Terbaik

| Nama Tema | Direktori File Utama | Keunggulan Utama Sebagai Standard Referensi |
|---|---|---|
| **Luxury 02** | `resources/js/Pages/Invitation/luxury-02/` | Standard transisi swipe horizontal/vertikal termulus, multi-slideshow cover, auto-scroll, dan error boundary tangguh. |
| **Utary** | `resources/js/Pages/Invitation/utary/` | Standard penanganan countdown menyatu, copy rekening aman Safari, QR check-in, dan penanganan watermark dinamis. |

*Dokumen ini adalah standarisasi mutlak. Jika tema baru Anda memiliki perilaku yang berbeda dari aturan di atas, Anda telah melanggar blueprint dan wajib merevisinya kembali.*
*Terakhir diperbarui: Mei 2026*
