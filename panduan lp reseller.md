# 📖 Panduan Kustomisasi Landing Page Reseller (LP Reseller)

Selamat datang di Panduan Kustomisasi Landing Page Reseller! Dokumen ini dirancang untuk mempermudah Anda (maupun para reseller) dalam mengonfigurasi dan mempercantik tampilan halaman pendaftaran reseller secara visual menggunakan **Landing Page Builder** di panel admin.

Seluruh fitur di bawah ini **berfungsi penuh di kelima pilihan tema premium** (`Galaxy`, `Luxury`, `Bloom`, `Forest`, dan `ModernSplit`).

---

## 🚀 Fitur Utama & Cara Penggunaan

### 1. evergreen Countdown Timer (Hitung Mundur Promo Harian)
Fitur ini sangat efektif untuk memicu psikologi kelangkaan (*urgency*) pengunjung agar segera mendaftar.
- **Cara Kerja**: Hitung mundur bersifat *evergreen* per user. Waktu hitung mundur akan tersimpan di browser masing-masing pengunjung dan otomatis reset setiap hari (atau ketika durasi habis), sehingga tidak pernah kedaluwarsa.
- **Cara Mengaktifkan**:
  1. Masuk ke **Landing Page Builder** > Tab **Struktur Halaman**.
  2. Klik tombol **Edit** (ikon pensil) pada baris **Promo** (sebelumnya Banner).
  3. Centang opsi **Tampilkan Hitung Mundur**.
  4. Atur **Durasi Hitung Mundur (Jam)** sesuai keinginan (Default: `19` jam).
  5. Masukkan **Teks Promo** Anda. Untuk meletakkan posisi hitung mundur secara dinamis, cukup ketik tag placeholder `{countdown}` di dalam teks Anda.
     * *Contoh*: `🔥 Sisa waktu promo terbatas: {countdown}. Segera daftar!`
  6. Klik **Selesai** dan **Simpan Perubahan**.

---

### 2. Kemudahan Input Konten (Smart Editor UI)

#### A. Pemilihan Tautan Instan (CTA Link Dropdown)
Anda tidak perlu lagi mengetik atau menghafal ID seksi halaman secara manual.
- **Cara Penggunaan**:
  - Pada kolom **Link CTA**, cukup klik menu dropdown untuk memilih tujuan tombol.
  - Pilihan cepat yang langsung terhubung ke bagian halaman:
    * `Seksi Paket & Harga` (mengarah ke `#plans`)
    * `Seksi Katalog Tema` (mengarah ke `#preview`)
    * `Seksi Katalog Kartu Ucapan` (mengarah ke `#preview-kartu`)
    * `Seksi Tanya Jawab (FAQ)` (mengarah ke `#faq`)
    * `Seksi Fitur Keunggulan` (mengarah ke `#features`)
    * `Seksi Cara Kerja` (mengarah ke `#how_it_works`)
    * `Halaman Pendaftaran Reseller` (mengarah ke `/register`)
    * `Halaman Login Reseller` (mengarah ke `/login`)
  - **Ingin Menggunakan Link Kustom?** Cukup pilih opsi **URL Kustom (Input Manual)**, lalu ketik link eksternal Anda (contoh: tautan WhatsApp, Google Form, dsb.) pada kolom input baru yang muncul di bawahnya.

#### B. Pemilih Warna Visual (Visual Color Picker)
Menyesuaikan warna background dan teks kini sangat mudah dan instan.
- **Cara Penggunaan**:
  - Di samping kolom input warna **Background** dan **Warna Teks**, terdapat **kotak contoh warna visual** yang interaktif.
  - Klik kotak contoh warna tersebut untuk membuka panel *color picker* bawaan sistem operasi/browser Anda secara visual.
  - Pilih warna yang Anda inginkan, dan kode hex warna akan terisi otomatis ke dalam kolom input.
  - **Mendukung Gradasi**: Anda tetap bisa mengetik kode gradasi warna secara manual di kolom input (contoh: `linear-gradient(90deg, #E5654B 0%, #D55A42 100%)`), dan kotak preview visual akan langsung menampilkan corak gradasi tersebut secara akurat.

---

### 3. Simulator Live Preview Pintar

#### A. Auto-Scroll Simulator
- Ketika Anda sedang menyusun struktur halaman di panel kiri, cukup **klik kotak seksi** apa saja (misalnya seksi *Faq*, *Plans*, atau *Stats*), maka simulator handphone di sebelah kanan akan **secara otomatis menggulir (scroll) layar** tepat ke tengah-tengah posisi seksi tersebut.
- Hal ini juga berlaku saat Anda membuka modal pop-up edit seksi, sehingga Anda langsung bisa melihat visualisasi perubahan konten di simulator handphone tanpa perlu menggulir layar preview secara manual.

#### B. Visual Highlight Focus
- Setiap kali simulator handphone selesai melakukan auto-scroll ke seksi yang dituju, seksi tersebut akan **memancarkan kilatan outline warna jingga** tipis selama 1.2 detik. Ini memberikan tanda fokus yang sangat jelas agar Anda langsung mengetahui bagian mana yang sedang aktif.

---

### 4. Pengaturan Style Tampilan Katalog (Carousel vs. Grid)
Anda dapat menentukan apakah katalog tema desain dan e-cards ingin ditampilkan berjejer menyamping (*Slider / Carousel*) atau tersusun ke bawah (*Responsive Grid*).
- **Cara Penggunaan**:
  1. Klik tombol **Edit** pada seksi **Preview (Katalog Tema)** atau **Greeting Cards (Katalog Kartu)**.
  2. Pada kolom **Style Tampilan**, pilih layout yang diinginkan:
     * **Carousel (Scroll Horizontal)**: Menampilkan kartu tema menyamping. Pengunjung dapat menggeser layar simulator ke kanan/kiri. Tampilan ini sangat estetik, kompak, dan menghemat ruang vertikal halaman.
     * **Responsive Grid**: Menampilkan semua koleksi tema secara transparan dalam kolom-kolom rapi yang sejajar ke bawah. Sangat cocok jika Anda ingin memamerkan seluruh portofolio tema secara langsung sekaligus.
  3. Klik **Selesai** dan **Simpan Perubahan**. Seluruh tema reseller akan langsung menyesuaikan layout yang Anda pilih secara instan!

---

### 5. Sistem Pencarian, Filter & Pengurutan Katalog Tema (Live Search & Filters)
Halaman Landing Page reseller kini dilengkapi panel pencarian dan penyaringan terintegrasi yang berfungsi secara real-time (*live*) untuk memudahkan calon customer menjelajah koleksi Anda.
- **Fitur Penyaringan**:
  1. **Kotak Pencarian Instan**: Pengunjung dapat mengetik nama tema pada kolom pencarian untuk menyaring hasil secara langsung.
  2. **Filter Kategori Dinamis**: Dropdown yang memuat semua kategori tema desain yang aktif secara dinamis. Calon customer dapat mencentang lebih dari satu kategori sekaligus.
  3. **Filter Jenis Acara**: Dropdown filter acara lengkap (Pernikahan, Ulang Tahun, Aqiqah, Khitanan, Wisuda, dsb.).
  4. **Urutan Desain Pintar**: Tombol urutan visual yang memungkinkan pengunjung menyortir koleksi tema berdasarkan:
     * **Terbaru** (Default): Menampilkan tema yang baru saja Anda tambahkan.
     * **Terpopuler**: Menampilkan tema berdasarkan jumlah penggunaan terbanyak.
     * **Terfavorit**: Menampilkan tema dengan rating/like tertinggi dari pengguna.
- **Cara Kerja**: Semua filter ini berjalan di sisi client secara instan tanpa membebani server, memberikan pengalaman interaksi yang sangat cepat, mulus (*smooth*), dan terasa premium.

---

## 💡 Tips & Rekomendasi Desain Premium
- **Harmoni Warna**: Gunakan warna aksen yang senada dengan logo brand reseller Anda agar halaman LP terlihat lebih profesional dan terintegrasi.
- **CTA Terarah**: Arahkan tombol CTA di banner promo ke `#plans` (Paket & Harga) atau langsung ke `/register` (Halaman Daftar) untuk mempercepat proses konversi pendaftaran reseller baru.
