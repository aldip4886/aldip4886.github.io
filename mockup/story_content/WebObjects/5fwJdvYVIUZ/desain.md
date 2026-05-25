# **Dokumen Desain: E-Learning Kemenkeu & Portal FAQ DJBC (RAG-Ready)**

Dokumen ini merumuskan filosofi desain, panduan visual (*design system*), arsitektur tata letak (*layout*), serta spesifikasi interaksi untuk antarmuka pengguna **KLC (Kemenkeu Learning Center)** interaktif yang telah dikembangkan.

## **1\. Visi & Filosofi Desain**

Aplikasi pembelajaran mandiri ini dirancang untuk memberikan pengalaman belajar yang imersif, berwibawa, dan bebas dari distraksi (*theater-focused*). Desain visual didasarkan pada tiga pilar utama:

* **Wibawa Korporat:** Memanfaatkan palet warna resmi Kementerian Keuangan RI untuk mencerminkan integritas, keandalan, dan karakter institusi.  
* **Fokus Kognitif (*Distraction-Free*):** Menghilangkan elemen navigasi luar yang tidak perlu (*header* raksasa, profil berlebih, footer statis) untuk menjaga fokus mata peserta diklat tetap tertuju pada materi 16:9.  
* **Interaktivitas Kontekstual:** Menempatkan portal bantuan (FAQ DJBC & Srikandi AI Bot) sebagai tombol layang (*floating action buttons*) di dalam ruang visual materi agar mudah diakses tanpa memutus alur belajar.

## **2\. Palet Warna Resmi (Design Tokens)**

Desain ini menerapkan paduan kontras tinggi untuk menjaga keterbacaan (*readability*) dan memenuhi kepatuhan aksesibilitas web (WCAG).

| Token Warna | Nilai Heksadesimal | Peran UI / Aplikasi | Kesan Psikologis |
| :---- | :---- | :---- | :---- |
| **Kemenkeu Navy** | \#0A2240 | Warna dasar primer, Toolbar utama, Header Window | Profesional, Kuat, Resmi |
| **Navy Light** | \#15335B | Latar belakang tombol toolbar, border pemisah | Modern, Kedalaman Visual |
| **Kemenkeu Gold** | \#F4B223 | Warna aksen, Penanda aktif, Tombol FAB, Stabilo | Berharga, Kewaspadaan, Emas |
| **Gold Hover** | \#E09F12 | Efek transisi arah kursor (*hover states*) | Interaktif, Responsif |
| **Slate Light** | \#F8FAFC | Latar belakang halaman luar pemutar | Bersih, Ringan, Nyaman di Mata |
| **Charcoal** | \#1E293B | Warna teks utama (*body text*) | Kontras Tinggi, Terbaca Tajam |

## **3\. Arsitektur Tata Letak & Responsivitas (16:9 Grid)**

Sistem tata letak menggunakan pendekatan **Grid Fleksibel Adaptif** menggunakan Tailwind CSS yang menyesuaikan lebar secara instan berdasarkan status pencarian pengguna.

                    TAMPILAN FOKUS (DEFAULT)  
\+-------------------------------------------------------------+  
|                                                             |  
|                 MATERI INTERAKTIF UTAMA                     |  
|                      (Rasio 16:9)                           |  
|                                                             |  
\+-------------------------------------------------------------+  
| \[Play\] \[Prev\] \[Next\]   Progress Bar \[=========\] 40%   \[ 🖵 \] | \-\> Toolbar  
\+-------------------------------------------------------------+  
| \[Deskripsi Topik Pembelajaran\]                              | \-\> Info Bawah  
\+-------------------------------------------------------------+

                  TAMPILAN AKTIF PENCARIAN (GRID 3:1)  
\+------------------------------------------+------------------+  
|                                          |                  |  
|         MATERI INTERAKTIF UTAMA          |   SIDEBAR HASIL  |  
|              (Rasio 16:9)                |     PENCARIAN    |  
|                                          |                  |  
\+------------------------------------------+------------------+  
| \[Play\] \[Prev\] \[Next\]  Progress Bar \[🖵\] | Slot Hasil       |  
\+------------------------------------------+------------------+  
| \[Deskripsi Topik Pembelajaran\]           | (Klik pemicu     |  
|                                          |  lompat slide)   |  
\+------------------------------------------+------------------+

### **Aturan Responsivitas Layout:**

* **Viewport Desktop:** Menggunakan pembatas lebar maksimum max-w-7xl agar tata letak tidak melar pada monitor resolusi ultra-lebar. Jika pencarian aktif, layar membagi kolom menjadi lg:col-span-3 (untuk materi) dan lg:col-span-1 (untuk sidebar hasil).  
* **Viewport Seluler (Mobile):** Grid otomatis runtuh (*collapsed*) menjadi satu kolom vertikal. Area materi mempertahankan aspek rasio 16:9 sejati berkat pemanfaatan kelas CSS aspect-\[16/9\] guna mencegah distorsi visual atau pemotongan gambar materi.

## **4\. Sistem Interaksi & Mikro-Animasi (Micro-Interactions)**

Untuk meningkatkan *User Experience* (UX), antarmuka ini dilengkapi dengan animasi transisi CSS3 yang halus:

### **A. Animasi Denyut Tombol Layang (FAB Pulse)**

Tombol FAQ dan Chatbot yang melayang di pojok kanan bawah slide dilengkapi dengan animasi bayangan melingkar yang memancar keluar secara periodik:

@keyframes pulse-gold {  
    0% { box-shadow: 0 0 0 0 rgba(244, 178, 35, 0.7); }  
    70% { box-shadow: 0 0 0 10px rgba(244, 178, 35, 0); }  
    100% { box-shadow: 0 0 0 0 rgba(244, 178, 35, 0); }  
}

*Tujuan UX:* Menarik perhatian pengguna ke pusat bantuan tanpa perlu memakan ruang teks utama secara permanen.

### **B. Jendela Melayang Mandiri (Floating Windows)**

* **Status Default:** Tersembunyi di luar batas bingkai kanan (translate-x-\[120%\], hidden).  
* **Efek Pembukaan:** Bergeser masuk dengan transisi durasi 300ms (translate-x-0).  
* **Logika Eksklusif (*Auto-Minimize*):** Jika pengguna membuka FAQ saat panel Chatbot sedang aktif, sistem secara otomatis menutup panel Chatbot terlebih dahulu untuk menghindari penumpukan ruang kerja (*overlap*).

## **5\. Logika Pencarian Teks Mendalam (Deep Content Search)**

Sistem pencarian didesain di sisi klien (*client-side*) untuk kecepatan akses instan tanpa jeda *loading* server:

\[Input Kata Kunci\]   
       │  
       ▼ (oninput/onkeyup)  
\[Gabungkan Teks Slide 1-5\] (Title \+ Subtitle \+ Content \+ Desc)  
       │  
       ├─► (Kosong)  ──► Sembunyikan Sidebar & Kembalikan Fokus Penuh  
       │  
       └─► (Terisi)  ──► Jalankan Regex Scanner  
                               │  
                               ├─► Tandai Teks Slide dengan \<mark\> (Stabilo)  
                               │  
                               └─► Hitung Lokasi Indeks Kata ──► Buat Snippet Context  
                                                                        │  
                                                                        ▼  
                                                             Tampilkan di Sidebar

## **6\. Integrasi Portal FAQ DJBC & Srikandi AI Bot**

Desain ini menyatukan dua model interaksi bantuan yang berbeda ke dalam satu wadah seragam:

1. **Pusat FAQ DJBC:**  
   * Menggunakan struktur menu akordeon yang rapat.  
   * Memungkinkan penyaringan cepat berdasarkan kueri teks secara langsung (*live text filtering*).  
   * Disusun khusus untuk memuat dasar hukum dan rujukan regulasi kepabeanan yang sah.  
2. **Srikandi AI Bot:**  
   * Mengadopsi antarmuka percakapan percakapan instan (*chat bubble interface*).  
   * Pembedaan warna gelembung obrolan (*Chat Bubble*) yang tegas (Emas untuk pengguna, Putih/Navy untuk Srikandi AI Bot) untuk kenyamanan membaca alur diskusi.

## **7\. Prinsip Aksesibilitas (WCAG Compliance)**

* **Kontras Teks Tinggi:** Kombinasi teks warna gelap (\#1E293B) di atas latar putih bersih, serta teks emas (\#F4B223) di atas latar biru navy (\#0A2240) memastikan kenyamanan membaca bagi pengguna dengan gangguan penglihatan ringan (*low vision*).  
* **Penanda Fokus yang Jelas:** Penggunaan efek warna latar stabilo kuning emas (\#F4B223) pada elemen pencarian teks mendalam mempermudah pemindaian informasi krusial secara cepat.  
* **Tombol Kontrol Besar:** Ukuran target sentuh untuk tombol navigasi pada gawai seluler dirancang minimal 44x44px agar mudah dioperasikan langsung dengan ibu jari.