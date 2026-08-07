# Project Requirement Document (PRD)
## Interactive Organization Explorer — DJBC
### Media Pembelajaran E-Learning: MP2 & MP3 — Struktur Organisasi DJBC

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Interactive Organization Explorer DJBC |
| **Versi Dokumen** | 2.0 |
| **Tanggal** | 6 Agustus 2026 |
| **Dibuat oleh** | Tim Pengembang Media Pembelajaran |
| **Unit Pengelola** | Pusat Pendidikan dan Pelatihan Bea dan Cukai, BPPK |
| **Mata Pelajaran** | MP2 (Kantor Pusat) + MP3 (Instansi Vertikal & UPT) |
| **Total JP** | 7 JP (3 JP + 4 JP) |
| **Referensi Mockup** | 4 file mockup, 16 screen (6 Agustus 2026) |

**Dasar Hukum:**
- PMK Nomor 124 Tahun 2024 (Struktur Organisasi DJBC Kantor Pusat)
- PMK Nomor 188/PMK.01/2016 jo PMK 183/PMK.01/2020 (Instansi Vertikal)
- PMK Nomor 121 Tahun 2024 (BLBC)
- PMK Nomor 132 Tahun 2024 (PSO BC)

---

## 1. Latar Belakang & Tujuan

Aplikasi ini merupakan media pembelajaran interaktif berbasis HTML static untuk modul E-Learning Tugas dan Fungsi DJBC. Fokus pada MP2 (Kantor Pusat) dan MP3 (Instansi Vertikal & UPT).

### 1.1 Tujuan Proyek
1. Menyediakan media pembelajaran interaktif berbasis HTML static untuk MP2 dan MP3
2. Memvisualisasikan hierarki organisasi DJBC dari tingkat pusat hingga UPT
3. Memfasilitasi pemahaman hubungan antar unit melalui Connection Map dan Alur Proses
4. Menyediakan mekanisme asesmen interaktif untuk mengukur capaian pembelajaran
5. Melacak progres belajar peserta melalui sistem Progress & Badges

### 1.2 Batasan Proyek
- Hanya mencakup MP2 dan MP3 (bukan MP1, MP4, MP5)
- Static HTML — tidak memerlukan server backend atau database
- Konten statis — data organisasi tersimpan di file JSON lokal
- Berjalan offline — tidak bergantung pada CDN atau koneksi internet

---

## 2. Tujuan Pembelajaran

### MP2 — Struktur Organisasi Kantor Pusat DJBC (3 JP)

| Kode | Kompetensi Dasar |
|---|---|
| MP2-1 | Menjelaskan kedudukan, tugas, dan fungsi Sekretariat Direktorat Jenderal beserta 4 bagiannya |
| MP2-2 | Menjelaskan tugas dan fungsi 12 Direktorat di Kantor Pusat DJBC beserta subdirektoratnya |
| MP2-3 | Menjelaskan kedudukan, tugas, dan fungsi 3 Tenaga Pengkaji DJBC |
| MP2-4 | Membedakan peran masing-masing unit Eselon II berdasarkan fungsi strategis DJBC |

### MP3 — Organisasi Instansi Vertikal dan UPT (4 JP)

| Kode | Kompetensi Dasar |
|---|---|
| MP3-1 | Menjelaskan struktur organisasi dan tugas/fungsi 20 Kantor Wilayah DJBC (18 reguler + 2 khusus) |
| MP3-2 | Menjelaskan perbedaan tipologi dan struktur 3 KPU BC (Tipe A, B, C) |
| MP3-3 | Menjelaskan struktur dan tipologi 104 KPPBC (5 tipe) |
| MP3-4 | Menjelaskan tugas/fungsi 3 BLBC dan 6 PSO BC sebagai Unit Pelaksana Teknis |
| MP3-5 | Menjelaskan hubungan hierarki dan dual-reporting antar unit (Kanpus → Kanwil → KPPBC / UPT) |

---

## 3. Sasaran Pengguna

| Aspek | Detail |
|---|---|
| **Target Peserta** | Pegawai Kementerian Keuangan (seluruh unit Eselon I) |
| **Platform** | Browser modern (Chrome 90+, Firefox 88+, Edge 90+) |
| **Perangkat Utama** | Desktop/Laptop |
| **Perangkat Pendukung** | Tablet (min. 768px landscape) |
| **Koneksi** | Offline (semua asset lokal) |

---

## 4. Scope & Cakupan Konten

### 4.1 Kantor Pusat DJBC (MP2)

| No | Unit | Singkatan | Sub-unit (Eselon III) |
|---|---|---|---|
| — | Direktorat Jenderal Bea dan Cukai | DJBC | — |
| 1 | Sekretariat Direktorat Jenderal | Setditjen | 4 Bagian |
| 2 | Direktorat Teknis Kepabeanan | Dit. Teknis Kepab. | 4 Subdirektorat |
| 3 | Direktorat Fasilitas Kepabeanan | Dit. Fasilitas Kepab. | 4 Subdirektorat |
| 4 | Direktorat Teknis dan Fasilitas Cukai | Dit. TFC | 4 Subdirektorat |
| 5 | Direktorat Kerja Sama Internasional Kepabeanan dan Cukai | Dit. KSIKC | 3 Subdirektorat |
| 6 | Direktorat Keberatan Banding dan Peraturan | Dit. KBP | 4 Subdirektorat |
| 7 | Direktorat Informasi Kepabeanan dan Cukai | Dit. IKC | 4 Subdirektorat |
| 8 | Direktorat Kepatuhan Internal | Dit. KI | 3 Subdirektorat |
| 9 | Direktorat Audit Kepabeanan dan Cukai | Dit. Audit | 4 Subdirektorat |
| 10 | Direktorat Penindakan dan Penyidikan | Dit. P2 | 5 Subdirektorat |
| 11 | Direktorat Penerimaan dan Perencanaan Strategis | Dit. PPS | 3 Subdirektorat |
| 12 | Direktorat Interdiksi Narkotika | Dit. Interdiksi | 4 Subdirektorat |
| 13 | Direktorat Komunikasi dan Bimbingan Pengguna Jasa | Dit. Kombimjas | 4 Subdirektorat |
| TP1 | Tenaga Pengkaji Bid. Pelayanan dan Penerimaan | — | — |
| TP2 | Tenaga Pengkaji Bid. Pengawasan dan Penegakan Hukum | — | — |
| TP3 | Tenaga Pengkaji Bid. Pengembangan Kapasitas dan Kinerja Org. | — | — |

### 4.2 Instansi Vertikal (MP3)

**20 Kantor Wilayah:**

| No | Nama Kanwil | Tipologi |
|---|---|---|
| 1 | Kanwil DJBC Aceh | Reguler |
| 2 | Kanwil DJBC Sumatera Utara | Reguler |
| 3 | Kanwil DJBC Riau | Reguler |
| 4 | **Kanwil DJBC Khusus Kepulauan Riau** | **Khusus** |
| 5 | Kanwil DJBC Sumatera Bagian Timur | Reguler |
| 6 | Kanwil DJBC Sumatera Bagian Barat | Reguler |
| 7 | Kanwil DJBC Banten | Reguler |
| 8 | Kanwil DJBC Jakarta | Reguler |
| 9 | Kanwil DJBC Jawa Barat | Reguler |
| 10 | Kanwil DJBC Jawa Tengah dan DIY | Reguler |
| 11 | Kanwil DJBC Jawa Timur I | Reguler |
| 12 | Kanwil DJBC Jawa Timur II | Reguler |
| 13 | Kanwil DJBC Bali, NTB, NTT | Reguler |
| 14 | Kanwil DJBC Kalimantan Bagian Barat | Reguler |
| 15 | Kanwil DJBC Kalimantan Bagian Selatan | Reguler |
| 16 | Kanwil DJBC Kalimantan Bagian Timur | Reguler |
| 17 | Kanwil DJBC Sulawesi Bagian Selatan | Reguler |
| 18 | Kanwil DJBC Sulawesi Bagian Utara | Reguler |
| 19 | Kanwil DJBC Maluku | Reguler |
| 20 | **Kanwil DJBC Khusus Papua** | **Khusus** |

**3 KPU BC:**

| Tipe | Nama | Eselon Kepala |
|---|---|---|
| Tipe A | KPU BC Tanjung Priok | II.a |
| Tipe B | KPU BC Batam | II.b |
| Tipe C | KPU BC Soekarno-Hatta | II.b |

**104 KPPBC (5 Tipologi):**

| Tipologi | Jumlah | Eselon |
|---|---|---|
| Tipe Madya Pabean (TMP) | 7 | III.a |
| Tipe Madya Cukai (TMC) | 3 | III.a |
| Tipe Madya Pabean A | 10 | III.a |
| Tipe Madya Pabean B | 21 | III.a |
| Tipe Madya Pabean C | 63 | III.b |
| **Total** | **104** | |

### 4.3 Unit Pelaksana Teknis (MP3)

**3 BLBC:**

| Nama | Kelas | Pembina Teknis | Pembina Adm. |
|---|---|---|---|
| BLBC Jakarta | Kelas I | Dit. Teknis Kepabeanan | Kanwil Jakarta |
| BLBC Medan | Kelas I | Dit. Teknis Kepabeanan | Kanwil Sumut |
| BLBC Surabaya | Kelas I | Dit. Teknis Kepabeanan | Kanwil Jatim I |

**6 PSO BC:**

| Nama | Tipe | Pembina Teknis | Pembina Adm. |
|---|---|---|---|
| PSO BC Tanjung Balai Karimun | Tipe A | Dit. P2 | Kanwilsus Kepri |
| PSO BC Lhokseumawe | Tipe B | Dit. P2 | Kanwil Aceh |
| PSO BC Tanjung Priok | Tipe B | Dit. P2 | Kanwil Jakarta |
| PSO BC Pantoloan | Tipe B | Dit. P2 | Kanwil Sulbagut |
| PSO BC Sorong | Tipe B | Dit. P2 | Kanwilsus Papua |
| PSO BC Kupang | Tipe B | Dit. P2 | Kanwil Bali-NTB-NTT |

---

## 5. Arsitektur Navigasi & Halaman

### 5.1 Global Navigation (Left Sidebar)

```
[Logo DJBC]
─────────────────
Peta Organisasi
  ├── Kantor Pusat
  ├── Instansi Vertikal
  └── Unit Pelaksana Teknis

[Cari unit kerja...]

Alur Proses
Peta Keterkaitan
─────────────────
Tantangan
  ├── Semua Tantangan
  ├── Struktur Organisasi
  ├── Fungsi Unit
  ├── Alur Kerja
  └── Studi Kasus

Progres Saya
  ├── Pencapaian (Badges)
  ├── Riwayat
  └── Perjalanan Belajar
─────────────────
Panduan / Bantuan
Keluar
```

### 5.2 Daftar Halaman (16 Screen dari Mockup)

| # | Nama Halaman | Route | Screen |
|---|---|---|---|
| 1 | Beranda (Landing) | `/` | 1 |
| 2 | Peta Organisasi (Org Chart) | `/explorer` | 2 |
| 3 | Detail Kantor Pusat | `/kantor-pusat/:id` | 3 |
| 4 | Tantangan — Klik Org Chart | `/tantangan/:id` | 4 |
| 5 | Peta Sebaran Instansi Vertikal | `/peta-sebaran` | 5 |
| 6 | Detail Kanwil (5 Tab) | `/kanwil/:id` | 6 |
| 7 | Detail UPT (BLBC/PSO) | `/upt/:id` | 7 |
| 8 | Alur Kerja DJBC | `/alur-kerja` | 8 |
| 9 | Hasil Pencarian | `/cari?q=:query` | 9 |
| 10 | Knowledge Card | (modal overlay) | 10 |
| 11 | Progres & Badges | `/progres` | 11 |
| 12 | Cara Penggunaan | `/bantuan` | 12 |
| 13 | Alur Proses Interaktif | `/alur-proses/:type` | 13 |
| 14 | Peta Keterkaitan Antar Unit | `/keterkaitan` | 14 |
| 15 | Studi Kasus | `/tantangan/studi-kasus/:id` | 15 |
| 16 | Perjalanan Belajar | `/perjalanan` | 16 |

---

## 6. Spesifikasi Fitur (F01–F14)

### F01 — Landing Page (Screen 1)
- Header: Logo DJBC + tagline + ikon help/audio/fullscreen
- Hero: background peta Indonesia glow effect + judul besar "Interactive Organization Explorer"
- CTA: Tombol "Mulai Eksplorasi →" (gold/amber)
- 4 Feature Cards: Eksplorasi Interaktif | Pahami Keterkaitan | Belajar Mandiri | Uji Pemahaman

### F02 — Explorer View / Org Chart (Screen 2)
- SVG org tree 3-kolom: Kantor Pusat | Instansi Vertikal | UPT
- Zoom (0.3x–3x) + Pan (drag) + Expand/Collapse nodes
- Toolbar bawah: undo/redo/home/zoom-slider/"Lihat Peta Sebaran"
- Progress ring di header: "PROGRES 35%" animasi
- Hover node → glow + tooltip | Klik node → Knowledge Card (F10)

### F03 — Detail Unit Kantor Pusat (Screen 3)
- Breadcrumb + tombol Kembali
- Panel kiri: mini org tree unit yang dipilih + zoom controls
- Panel kanan: Peran Utama, Fungsi (checklist ✓), Output Utama (4 icon cards), Unit Berinteraksi (chips)
- Footer: "Did You Know?" bar kuning

### F04 — Knowledge Card Modal (Screen 10)
- Modal overlay saat klik node di org chart
- 5 Tab: Ringkasan | Tugas & Fungsi | Output Utama | Unit Terkait | Regulasi
- Tab Ringkasan: peran utama + kedudukan + fungsi checklist + unit berinteraksi chips
- Tombol: "Lihat Detail Lengkap"

### F05 — Peta Sebaran Instansi Vertikal (Screen 5)
- SVG peta Indonesia + marker per tipe (K=Kanwil, P=KPU, B=BLBC, S=PSO)
- Sidebar: tab daftar + filter (tipe/pulau) + search lokasi + counter statistik
- Hover marker → tooltip | Klik marker → halaman detail unit
- Legend + zoom controls

### F06 — Detail Kanwil 5 Tab (Screen 6)
- Tab 1 Ringkasan: foto gedung + badge tipe + kepala kanwil + kontak + mini struktur
- Tab 2 Struktur Organisasi: bagan lengkap
- Tab 3 Wilayah Kerja: peta wilayah kerja
- Tab 4 KPPBC di Bawahnya: daftar KPPBC dengan link detail
- Tab 5 Informasi Lain: data tambahan

### F07 — Detail UPT BLBC/PSO (Screen 7)
- Badge jenis UPT + pembina
- Foto fasilitas (lab/kapal)
- Tugas Utama (checklist) + Fasilitas Layanan (icon cards)
- Footer 3 kolom: Lokasi | Kontak | Jam Layanan

### F08 — Alur Kerja DJBC (Screen 8)
- 5 tahapan horizontal: Perumusan Kebijakan → Pembinaan & Koordinasi → Pelayanan & Pengawasan → Dukungan Teknis → Pengawasan & Evaluasi
- Dropdown: Pilih Proses (Impor/Ekspor/Cukai/Penindakan)
- Ilustrasi: kapal → gedung customs → truk
- Footer: "Tahukah Anda?" + "Eksplorasi Lebih Dalam"

### F09 — Alur Proses Interaktif Step-by-Step (Screen 13)
- Sidebar: sub-menu 4 proses (Impor | Ekspor | Cukai | Penindakan)
- Progress tracker: 7 numbered circles
- Konten per step: judul + deskripsi + Output Tahapan (checklist) + Unit yang Terlibat (color-tagged chips)
- Navigasi: ← Sebelumnya | [nomor halaman] | Berikutnya →

### F10 — Connection Map (Screen 14)
- Network graph SVG: node sentral + surrounding connected nodes
- 4 tipe garis relasi: Koordinasi (solid biru) | Dukungan Data (solid hijau) | Dukungan Regulasi (dash oranye) | Pengawasan (solid kuning)
- Klik node → jadi sentral baru (smooth transition)
- Panel kanan: info unit + fungsi + unit berhubungan + "Lihat Detail"

### F11 — Search & Filter (Screen 9)
- Sidebar filter: Kategori Unit | Tipe Unit | Fungsi Utama | Reset Filter
- Tab cepat: Semua | Kantor Pusat (n) | Instansi Vertikal (n) | UPT (n)
- Setiap hasil: badge tipe + nama unit (link) + deskripsi + "Lihat Detail" | "Lihat di Peta Organisasi"
- Pagination: ← 1 2 3 →

### F12 — Assessment / Challenge (Screens 4 & 15)
**Tipe 1 — Klik Org Chart:** soal teks + mini org chart interaktif, user klik node yang tepat
**Tipe 2 — Studi Kasus:** narasi skenario + 4 pilihan jawaban + pembahasan + scoring XP
- Soal terkunci progresif | Timer per soal | Level & XP di sidebar

### F13 — Progress & Badges (Screens 11 & 16)
- Stats: Unit Dieksplorasi | Waktu Belajar | Skor Tantangan
- Donut chart SVG: Kantor Pusat | Instansi Vertikal | UPT | Tantangan
- 6 Badges: Explorer Pemula | Organization Finder | Network Understanding | DJBC Navigator | Regional Explorer | Organization Master
- Journey Map: 5 level (Pemula → Explorer Aktif → Connector → Strategist → Organization Master)

### F14 — Help & Guide (Screen 12)
- 6 panduan visual: Jelajahi Organisasi | Lihat Detail Unit | Zoom & Navigasi | Pencarian Cepat | Peta Sebaran | Uji Pemahaman
- Ilustrasi screenshot mini per panduan

---

## 7. Design System

### 7.1 Mode: Light Mode (PENTING)
> Header dan sidebar kiri berwarna dark navy. Background konten = putih/abu muda.

### 7.2 Color Palette

| Token CSS | Hex | Penggunaan |
|---|---|---|
| `--djbc-navy` | `#0D2137` | Header bg, sidebar, DJBC root node |
| `--djbc-blue` | `#1A4B8C` | CTA, selected state, active link |
| `--djbc-blue-light` | `#2563EB` | Hover, hyperlinks |
| `--djbc-gold` | `#F5A623` | CTA button, progress ring, accent |
| `--djbc-gold-light` | `#FFC94A` | "Did You Know?" bar, badge glow |
| `--bg-page` | `#F5F7FA` | Page background |
| `--bg-white` | `#FFFFFF` | Card, panel, modal |
| `--bg-sidebar` | `#1A2E4A` | Left sidebar |
| `--text-dark` | `#1A2E4A` | Headings |
| `--text-body` | `#374151` | Body text |
| `--text-muted` | `#6B7280` | Placeholder, secondary |
| `--border` | `#E5E7EB` | Card border, divider |
| `--success` | `#10B981` | Checklist, badge benar |
| `--danger` | `#EF4444` | Error, salah |

### 7.3 Node Color Coding (Org Chart)

| Kategori | Warna | Hex |
|---|---|---|
| DJBC Root | Navy + border gold | `#0D2137` |
| Kantor Pusat (kolom) | Teal | `#0E7490` |
| Instansi Vertikal (kolom) | Forest Green | `#059669` |
| UPT (kolom) | Purple | `#7C3AED` |
| Kanwil/KPU | Light Green | `#10B981` |
| KPPBC | Pale Green | `#34D399` |
| BLBC | Violet | `#8B5CF6` |
| PSO | Indigo | `#6366F1` |

### 7.4 Connection Map Line Types

| Tipe | Style | Warna |
|---|---|---|
| Koordinasi | Solid | `#2563EB` |
| Dukungan Data | Solid | `#10B981` |
| Dukungan Regulasi | Dashed | `#F59E0B` |
| Pengawasan | Solid | `#F5A623` |

### 7.5 Typography
- Font: Inter (woff2 lokal)
- Hero: clamp(2rem, 5vw, 3rem) / 700
- H1: 1.75rem / 700
- H2: 1.375rem / 600
- Body: 0.9375rem / 400 / line-height 1.6
- Badge: 0.75rem / 500

### 7.6 Header (Semua halaman kecuali Landing)
```
[Logo DJBC "Bea Cukai Makin Baik"]  [Interactive Organization Explorer]  [?][vol]  [● 35%]
Height: 56px | bg: #0D2137 | text: white | Progress ring: gold SVG circle
```

### 7.7 Micro-interactions & Animations

| Elemen | Animasi | Durasi |
|---|---|---|
| Node hover | Glow + scale 1.05 | 150ms |
| Detail panel | Slide-in dari kanan | 300ms |
| Knowledge Card | fadeIn + scaleUp | 250ms |
| Progress donut | Animated stroke-dashoffset | 800ms |
| Badge unlock | Pulse + confetti burst | 600ms |
| "Did You Know?" bar | slideUp | 400ms |
| Map marker hover | Scale 1.3 + tooltip fade | 200ms |
| Counter stats | Count-up number | 1000ms |
| Step progress | Animated circle fill | 300ms |

---

## 8. Project Directory Structure

```
Interactive Organization Explorer_v2/
│
├── index.html                      # Landing page
├── explorer.html                   # Main app shell (semua view)
│
├── css/
│   ├── variables.css               # Design tokens
│   ├── base.css                    # Reset, typography, Inter font
│   ├── layout.css                  # 3-panel shell layout
│   ├── animations.css              # Semua keyframes & transitions
│   ├── components/
│   │   ├── header.css
│   │   ├── sidebar.css
│   │   ├── buttons.css
│   │   ├── badges.css
│   │   ├── cards.css
│   │   ├── tabs.css
│   │   ├── modal.css               # Knowledge Card overlay
│   │   ├── breadcrumb.css
│   │   ├── progress.css
│   │   └── did-you-know.css
│   └── views/
│       ├── landing.css
│       ├── org-chart.css
│       ├── map.css
│       ├── detail-kanpus.css
│       ├── detail-kanwil.css
│       ├── detail-upt.css
│       ├── search.css
│       ├── assessment.css
│       ├── connection-map.css
│       ├── alur-proses.css
│       ├── progress-page.css
│       ├── journey-map.css
│       └── help.css
│
├── js/
│   ├── app.js                      # Router, state, event bus
│   ├── data.js                     # JSON loader + LRU cache
│   ├── progress-tracker.js         # localStorage: visited, time, badges
│   ├── utils.js                    # Shared helpers
│   └── views/
│       ├── landing.js
│       ├── org-chart.js            # SVG tree renderer + zoom/pan
│       ├── knowledge-card.js       # Modal 5-tab
│       ├── detail-panel.js         # Kanpus detail
│       ├── detail-kanwil.js        # 5-tab Kanwil
│       ├── detail-upt.js
│       ├── map.js                  # Indonesia map + markers
│       ├── search.js               # Inverted index + results
│       ├── connection-map.js       # Network graph
│       ├── alur-kerja.js
│       ├── alur-proses.js          # Step-by-step workflow
│       ├── assessment.js           # Challenge engine
│       ├── progress-page.js
│       ├── journey-map.js
│       └── help.js
│
├── data/
│   ├── kantor-pusat.json           # Sekditjen + 13 Dit + 3 TP (lengkap sub-unit)
│   ├── instansi-vertikal.json      # 20 Kanwil + 3 KPU + 104 KPPBC
│   ├── upt.json                    # 3 BLBC + 6 PSO
│   ├── kanwil-kppbc-mapping.json   # Kanwil → daftar KPPBC
│   ├── geo-coordinates.json        # Lat/Lng semua kantor
│   ├── connections.json            # Relasi antar unit (Connection Map)
│   ├── alur-proses.json            # Step-by-step (Impor/Ekspor/Cukai/Penindakan)
│   ├── did-you-know.json           # Fakta menarik per unit
│   └── assessment.json             # Soal challenge + studi kasus
│
├── assets/
│   ├── svg/
│   │   ├── indonesia-map.svg
│   │   ├── logo-djbc.svg
│   │   └── icons/                  # Icon per unit/tipe
│   ├── images/
│   │   └── hero-bg.png             # Landing hero background
│   └── fonts/
│       ├── inter-variable.woff2
│       └── inter.css
│
├── mockup/                         # Referensi desain (tidak diubah)
└── referensi/                      # Dokumen sumber konten (tidak diubah)
```

---

## 9. Data Architecture & JSON Schema

### kantor-pusat.json (struktur utama)
```json
{
  "id": "djbc",
  "nama": "Direktorat Jenderal Bea dan Cukai",
  "singkatan": "DJBC",
  "level": "eselon-1",
  "jabatan_pimpinan": "Direktur Jenderal",
  "dasar_hukum": "PMK Nomor 124 Tahun 2024",
  "tugas": "...",
  "fungsi": ["...", "..."],
  "output_utama": [
    { "icon": "policy", "label": "Kebijakan Kepabeanan" }
  ],
  "kategori": ["revenue-collector", "trade-facilitator"],
  "unit_berinteraksi": ["kanwil", "kppbc"],
  "did_you_know": "...",
  "children": [ { ...node Eselon II... } ]
}
```

### connections.json
```json
{
  "connections": [
    {
      "from": "dit-p2",
      "to": "kanwil",
      "type": "koordinasi",
      "label": "Koordinasi operasi & intelijen"
    }
  ]
}
```

### alur-proses.json
```json
{
  "proses": [
    {
      "id": "impor",
      "nama": "Proses Impor",
      "tahapan": [
        {
          "no": 1,
          "judul": "Perencanaan Impor",
          "deskripsi": "...",
          "output": ["Dokumen rencana impor"],
          "unit_terlibat": [
            { "unit_id": "kppbc", "peran": "Pelaksana pelayanan", "warna": "#2563EB" }
          ]
        }
      ]
    }
  ]
}
```

### assessment.json
```json
{
  "challenges": [
    {
      "id": "ch-01",
      "tipe": "click-org-chart",
      "soal": "Siapa yang bertugas merumuskan kebijakan teknis kepabeanan?",
      "correct_node_id": "dit-teknis-kepab",
      "hint": "Kebijakan teknis dirumuskan di tingkat Kantor Pusat",
      "xp": 10,
      "pembahasan": "Direktorat Teknis Kepabeanan bertugas merumuskan..."
    }
  ],
  "studi_kasus": [
    {
      "id": "sk-01",
      "narasi": "Sebuah kontainer berisi suku cadang mesin tiba di Pelabuhan Tanjung Perak...",
      "soal": "Unit manakah yang BERPERAN UTAMA melakukan penyidikan?",
      "pilihan": [
        { "id": "a", "unit_id": "dit-p2", "label": "Direktorat Penindakan dan Penyidikan" },
        { "id": "b", "unit_id": "dit-audit", "label": "Direktorat Audit Kepabeanan dan Cukai" },
        { "id": "c", "unit_id": "kppbc-tanjung-perak", "label": "KPPBC Tanjung Perak" },
        { "id": "d", "unit_id": "dit-kbp", "label": "Direktorat Keberatan Banding dan Peraturan" }
      ],
      "correct": "a",
      "xp": 20,
      "pembahasan": "Direktorat Penindakan dan Penyidikan bertugas melakukan penyidikan..."
    }
  ]
}
```

---

## 10. Implementation Steps (10 Phase — ±7 Hari Kerja)

### Phase 1 — Foundation & Data (Hari 1)
| Step | Task |
|---|---|
| 1.1 | Setup project directory |
| 1.2 | `variables.css` — Design tokens light mode |
| 1.3 | `base.css` — Reset + typography + Inter font |
| 1.4 | Build `kantor-pusat.json` — 13 Dit + Sekditjen + 3 TP (lengkap sub-unit) |
| 1.5 | Build `instansi-vertikal.json` — 20 Kanwil + 3 KPU + 104 KPPBC |
| 1.6 | Build `upt.json` — 3 BLBC + 6 PSO |
| 1.7 | Build `kanwil-kppbc-mapping.json` + `geo-coordinates.json` |
| 1.8 | Build `connections.json` + `alur-proses.json` + `assessment.json` + `did-you-know.json` |
| 1.9 | `app.js` — Hash router, state store, event bus |
| 1.10 | `data.js` — JSON loader + LRU cache |

### Phase 2 — Landing Page (Hari 1)
| Step | Task |
|---|---|
| 2.1 | `index.html` — Struktur semantik |
| 2.2 | `landing.css` — Hero + feature cards |
| 2.3 | Glow map background (CSS/canvas) |
| 2.4 | `landing.js` — Animated hero + CTA routing |

### Phase 3 — App Shell & Navigation (Hari 2)
| Step | Task |
|---|---|
| 3.1 | `explorer.html` — Header + sidebar + main canvas + right panel |
| 3.2 | `layout.css` — 3-panel (sidebar 260px, canvas flex, panel 380px) |
| 3.3 | `header.css` — Logo + progress ring SVG |
| 3.4 | `sidebar.css` — Accordion nav + inline search |
| 3.5 | Breadcrumb + "Did You Know?" sticky bar |

### Phase 4 — Org Chart Engine (Hari 2–3)
| Step | Task |
|---|---|
| 4.1 | `org-chart.js` — SVG tree renderer (pure JS): 3-kolom layout |
| 4.2 | Nodes: rounded rect + icon + nama 2 baris |
| 4.3 | Connectors: Bezier curves |
| 4.4 | Expand/collapse + Pan/zoom (CSS transform + wheel + drag) |
| 4.5 | Toolbar bawah + node hover glow |
| 4.6 | Wire data semua JSON + node click → Knowledge Card |

### Phase 5 — Detail Pages (Hari 3)
| Step | Task |
|---|---|
| 5.1 | `detail-panel.js` — Mini-tree kiri + info panel kanan (Kanpus) |
| 5.2 | `detail-kanwil.js` — 5-tab layout |
| 5.3 | `detail-upt.js` — BLBC/PSO halaman |
| 5.4 | "Did You Know?" bar dinamis per unit |

### Phase 6 — Indonesia Map (Hari 4)
| Step | Task |
|---|---|
| 6.1 | `indonesia-map.svg` — Base SVG per provinsi |
| 6.2 | `map.js` — Marker overlay (K/P/B/S) dari geo-coordinates |
| 6.3 | Filter sidebar + counter stats + hover tooltip |
| 6.4 | Klik marker → detail page routing |

### Phase 7 — Knowledge Card & Search (Hari 4)
| Step | Task |
|---|---|
| 7.1 | `knowledge-card.js` — Modal overlay 5 tab |
| 7.2 | `modal.css` — fadeIn + scaleUp animation |
| 7.3 | `search.js` — Inverted index + results page |
| 7.4 | Filter sidebar + paginated results + tab cepat |

### Phase 8 — Assessment & Alur Proses (Hari 5)
| Step | Task |
|---|---|
| 8.1 | `assessment.js` — Challenge Tipe 1 (klik node) + Tipe 2 (studi kasus) |
| 8.2 | XP system + scoring + soal progresif |
| 8.3 | `alur-kerja.js` — 5 tahapan horizontal + ilustrasi |
| 8.4 | `alur-proses.js` — 4 proses × 7 tahapan, step-by-step |

### Phase 9 — Connection Map & Progress System (Hari 5–6)
| Step | Task |
|---|---|
| 9.1 | `connection-map.js` — SVG network graph: 4 tipe garis |
| 9.2 | Klik node → jadi sentral baru (animasi) |
| 9.3 | `progress-tracker.js` — localStorage: visited, time, score, badges |
| 9.4 | `progress-page.js` — Donut chart animasi + badge grid |
| 9.5 | `journey-map.js` — 5-level milestone visual |

### Phase 10 — Help, Polish & Testing (Hari 6–7)
| Step | Task |
|---|---|
| 10.1 | `help.js` — 6 panduan visual |
| 10.2 | `animations.css` — Semua keyframes (glow, slideIn, burst, countUp) |
| 10.3 | Responsive tablet 768px |
| 10.4 | Virtual rendering untuk 104 KPPBC |
| 10.5 | Cross-browser test (Chrome/Firefox/Edge) + Offline test |
| 10.6 | Data accuracy final check |
| 10.7 | Meta tags + favicon + page title |

---

## 11. Verification Plan

### 11.1 Data Accuracy Checklist

| Item | Expected | Sumber | Status |
|---|---|---|---|
| Unit Eselon II Kanpus | 1 Sekditjen + 12 Dit + 3 TP = 16 unit | PMK 124/2024 | ☐ |
| Kanwil Total | 18 reguler + 2 khusus = **20** | PMK 188/2016 | ☐ |
| KPU BC | 3 (Tipe A Tj.Priok, Tipe B Batam, Tipe C Soetta) | PMK 188/2016 | ☐ |
| KPPBC | 7+3+10+21+63 = **104** | PMK 188/2016 | ☐ |
| BLBC | 3 Kelas I (Jakarta, Medan, Surabaya) | PMK 121/2024 | ☐ |
| PSO BC | 1 Tipe A + 5 Tipe B = **6** | PMK 132/2024 | ☐ |

### 11.2 Functional Test Cases (20 TC)

| TC# | Skenario | Expected |
|---|---|---|
| TC-01 | Klik "Mulai Eksplorasi" di landing | Buka explorer.html, org chart tampil |
| TC-02 | Org chart load | DJBC root + 3 kolom anak tampil |
| TC-03 | Klik node "Dit. Teknis Kepabeanan" | Knowledge Card muncul (5 tab) |
| TC-04 | Klik tab "Tugas & Fungsi" di Knowledge Card | Konten tampil |
| TC-05 | Scroll di canvas org chart | Zoom in, max 3× |
| TC-06 | Hover marker K di Peta Sebaran | Tooltip nama Kanwil muncul |
| TC-07 | Klik marker B (BLBC Jakarta) | Halaman detail UPT BLBC Jakarta |
| TC-08 | Uncheck "PSO" di filter peta | Marker S menghilang |
| TC-09 | Ketik "audit" di search | Min. 2 hasil Kantor Pusat, filter berfungsi |
| TC-10 | Klik "Kanwil Jawa Timur I" | Halaman 5-tab terbuka |
| TC-11 | Klik tab "KPPBC di Bawahnya" | Daftar KPPBC Jatim I tampil |
| TC-12 | Buka Peta Keterkaitan, klik "Dit. P2" | Dit. P2 jadi sentral, garis relasi tampil |
| TC-13 | Klik node "KPPBC" di Connection Map | KPPBC jadi sentral, graph berubah |
| TC-14 | Pilih "Ekspor" di dropdown Alur Proses | Step-by-step proses ekspor tampil |
| TC-15 | Jawab soal Challenge Tipe 1 | Feedback benar/salah + XP bertambah |
| TC-16 | Submit jawaban Studi Kasus | Pembahasan muncul |
| TC-17 | Kunjungi 10 unit | Badge "Explorer Pemula" unlock + animasi |
| TC-18 | Buka halaman Progres | Donut chart terfill sesuai % |
| TC-19 | Buka Perjalanan Belajar | 5 level tampil sesuai progres |
| TC-20 | Buka dari file:// tanpa internet | Semua fitur berjalan normal |

---

*Dokumen ini merupakan acuan utama pengembangan.*
*Versi: 2.0 | Tanggal: 6 Agustus 2026*
*Setiap perubahan scope harus didokumentasikan sebagai revisi bernomor.*
