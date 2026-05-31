# Panduan Tema Ruang (Room Jogja)

> **Referensi:** https://abadikan.id/dika-putri-palembang  
> **Slug tema:** `room-jogja`  
> **Tipe:** Wedding only (untuk sekarang)  
> **Gaya visual:** Jawa/Jogja — batik parang, warna hitam, emas, krem

---

## Konsep Utama

Undangan **single-room interaktif** — seluruh konten ada dalam satu layar berbentuk ilustrasi ruangan.
Setiap section dibuka lewat **klik label** di dalam ruangan (bukan scroll).

```
[Cover Screen] → Klik "Buka Undangan" → [Room View]
                                             ↓
                          Klik Label di Ruangan (About Us, Love Story, dll.)
                                             ↓
                          [Modal/Bottom Sheet] muncul dengan konten section
```

---

## Alur Pengalaman Pengguna

1. **Cover Screen** — ilustrasi gapura Jawa + nama pengantin + nama tamu + ayat/quote + tombol **"Buka Undangan"**
2. **Room View** — ilustrasi ruangan Jawa penuh layar, label clickable tersusun dalam grid
3. **Klik label** → bottom sheet/modal muncul dari bawah dengan konten section
4. **Wishes Bar** — ucapan tamu selalu tampil di bagian bawah layar (scrollable)

---

## Label di Room & Data Source

| Label di Room | Data Source | Kondisi Tampil |
|---|---|---|
| 👑 About Us | `brideGrooms` | Selalu |
| 🏮 Love Story | `loveStories` | Jika ada data |
| 📅 Date & Venue | `events` | Selalu |
| 👗 Dress Code | `invitation.dress_code_text`, `show_dress_code` | Jika diaktifkan |
| 🖼️ Gallery | `galleries` | Jika ada foto |
| 💌 RSVP | `enable_rsvp`, form ke backend | Jika diaktifkan |
| 🎁 Gift / Rekening | `bankAccounts` | Jika ada rekening |
| 📺 Live Streaming | `show_live_streaming`, `live_streaming_url` | Jika diaktifkan |
| 🔲 QR Code | `enable_qr`, `show_qr_code`, `guest.slug` | Jika ada guest & diaktifkan |
| 💬 Ucapan (Wishes) | `wishes` | Tampil di bar bawah layar |

---

## Data di Cover Screen

| Elemen | Data Source | Catatan |
|---|---|---|
| Background | Ilustrasi gapura Jawa (asset statis) | **Bukan `cover_image`** — diabaikan |
| Nama Pengantin | `brideGrooms[0].nickname` & `brideGrooms[1].nickname` | |
| Nama Tamu | `guest.name` | |
| Ayat / Quote | `invitation.opening_ayat` + `opening_ayat_source` | |
| Foto Opening | `invitation.opening_image` | Ditampilkan di **modal About Us**, bukan di cover |

---

## Konten Tiap Modal

| Modal | Isi |
|---|---|
| **About Us** | Foto opening, nama lengkap, asal daerah, nama orang tua, bio, Instagram |
| **Love Story** | Timeline kisah cinta |
| **Date & Venue** | Detail acara, countdown, tombol Google Maps |
| **Dress Code** | Teks dress code |
| **Gallery** | Grid foto gallery |
| **RSVP** | Form konfirmasi kehadiran |
| **Gift** | Nomor rekening + tombol salin |
| **Live Streaming** | Teks undangan + tombol "Watch Live" → buka `live_streaming_url` |
| **QR Code** | QR image dari `qrserver.com` pakai `guest.slug`, untuk scan check-in |

---

## File yang Perlu Dibuat

```
public/themes/room-jogja/
├── cover-bg.webp          ← Ilustrasi gapura Jawa (AI-generated)
└── room-bg.webp           ← Ilustrasi ruangan Jawa (AI-generated)

resources/js/Pages/Invitation/room-jogja/
├── DynamicIndex.jsx       ← Komponen utama tema
└── style.css              ← CSS tema (warna, font, animasi)
```

### Modifikasi File Existing
- `resources/js/Pages/Invitation/Show.jsx` — tambah import + routing `room-jogja`
- Database `themes` — tambah entry tema (via admin panel atau seeder)

---

## Design Tokens

| Token | Nilai |
|---|---|
| Warna utama (hitam) | `#1a1108` |
| Warna emas | `#c9a227` |
| Warna krem | `#f5e6c8` |
| Font heading | Cinzel |
| Font body | Cormorant Garamond |
| Font script | Great Vibes |
| Animasi modal | Slide up dari bawah (bottom sheet) |
| Animasi cover | Fade-in bertahap |

---

## Layout Grid Label di Room

```
┌──────────────────────────────┐
│  🏮 Love Story  📅 Date & Venue │  ← baris atas
│       👑 About Us            │  ← baris tengah (full width)
│  🖼️ Gallery   👗 Dress Code   │  ← baris 3
│  💌 RSVP      🎁 Gift        │  ← baris 4
│  📺 Live      🔲 QR Code     │  ← baris 5 (conditional)
└──────────────────────────────┘
       💬 Ucapan tamu (scrollable)  ← bar bawah layar
```

---

## Checklist Verifikasi (saat implementasi)

- [ ] Cover tampil: gapura Jawa + nama pengantin + ayat + nama tamu
- [ ] Tombol "Buka Undangan" berfungsi, transisi ke room view
- [ ] Semua label tampil dengan benar di atas background ruangan
- [ ] Klik tiap label → modal muncul dengan data yang benar
- [ ] `brideGrooms` tampil di About Us modal
- [ ] `opening_image` tampil di dalam About Us modal
- [ ] `opening_ayat` + `opening_ayat_source` tampil di Cover
- [ ] `events` tampil di Date & Venue modal + countdown + maps
- [ ] `loveStories` tampil di Love Story modal
- [ ] `galleries` tampil di Gallery modal
- [ ] `bankAccounts` tampil di Gift modal
- [ ] `wishes` tampil di WishesBar bawah layar
- [ ] RSVP form submit berhasil
- [ ] Live Streaming: tombol Watch Live buka URL yang benar
- [ ] QR Code: muncul hanya jika ada `guest`, scan redirect ke checkin
- [ ] Music toggle berfungsi
- [ ] Responsive di mobile 375px, 390px
- [ ] `cover_image` **tidak digunakan** (diabaikan)

---

*Dibuat: 31 Mei 2026 — Panduan ini adalah rencana implementasi tema Room Jogja untuk Undangan Digital.*
