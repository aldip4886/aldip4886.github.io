# Dokumen Kebutuhan Proyek

## 1. Ringkasan Proyek

Proyek ini bertujuan membangun media pembelajaran berbasis HTML5 yang dikemas sebagai paket SCORM agar dapat dijalankan di berbagai Learning Management System (LMS). Media pembelajaran akan menggabungkan konten PDF, slide PowerPoint, gambar, video, tes diagnostik berbasis pilihan ganda, post-test/summative test, FAQ, chatbot AI berbasis Retrieval-Augmented Generation (RAG), assignment grading berbantuan AI, serta analitik tingkat lanjut lintas modul.

Produk akhir harus dapat digunakan oleh peserta belajar secara mandiri, mendukung pelacakan progres di LMS, dan membantu pengajar mendapatkan data diagnostik serta penilaian awal terhadap tugas peserta.

## 2. Tujuan Pembelajaran dan Produk

### 2.1 Tujuan Produk

- Menyediakan pengalaman belajar digital interaktif dalam satu paket HTML5.
- Mengemas media sebagai SCORM agar kompatibel dengan LMS.
- Memanfaatkan AI untuk menghasilkan soal diagnostik, FAQ/chatbot, assignment, rubrik, dan bantuan penilaian.
- Memberikan data progres, skor, status penyelesaian, hasil interaksi utama ke LMS, dan data analitik lintas modul ke database aplikasi.
- Mengukur peningkatan performa peserta melalui perbandingan skor tes diagnostik dan post-test.
- Membantu pengajar mengurangi beban pembuatan asesmen dan pemeriksaan tugas awal.

### 2.2 Tujuan Pembelajaran

Tujuan pembelajaran spesifik akan disesuaikan dengan modul/kursus yang dikembangkan. Setiap modul minimal harus memiliki:

- Kompetensi atau capaian pembelajaran.
- Indikator pencapaian.
- Materi inti.
- Aktivitas belajar.
- Tes diagnostik.
- Post-test atau summative test.
- Assignment berbasis performa atau studi kasus.
- Rubrik penilaian.

## 3. Ruang Lingkup

### 3.1 Termasuk Dalam Ruang Lingkup

- Aplikasi pembelajaran HTML5 responsif.
- Konversi atau integrasi konten PDF, PowerPoint, gambar, dan video.
- Packaging SCORM.
- Tes diagnostik pilihan ganda yang soalnya dihasilkan oleh AI.
- Post-test atau summative test dengan soal berbeda tetapi tingkat kesulitan setara dengan tes diagnostik.
- FAQ berbasis basis pengetahuan modul.
- Chatbot AI berbasis RAG untuk membantu peserta memahami materi.
- Assignment generator berbasis AI.
- Rubric generator berbasis AI.
- Assignment grading berbantuan AI.
- Dashboard sederhana di sisi learner untuk progres dan hasil.
- Analitik tingkat lanjut lintas modul sebagai fitur inti aplikasi.
- Integrasi tracking ke LMS melalui SCORM runtime.
- Dokumentasi teknis dan panduan pengguna.

### 3.2 Di Luar Ruang Lingkup Awal

- LMS baru dari nol.
- Sistem authoring lengkap seperti Articulate Storyline atau Adobe Captivate.
- Proctoring ujian.
- Live class atau video conference.
- Marketplace konten.
- Sistem pembayaran, marketplace, atau monetisasi konten.

## 4. Pengguna dan Peran

### 4.1 Peserta Belajar

Peserta belajar yang mengakses modul melalui LMS. Learner dapat membaca materi, menonton video, mengikuti tes diagnostik, bertanya ke chatbot, melihat FAQ, mengerjakan assignment, dan menerima feedback.

### 4.2 Instruktur

Pengajar atau fasilitator yang memantau progres, meninjau hasil tes, meninjau hasil assignment grading AI, dan melakukan override nilai bila diperlukan.

### 4.3 Pembuat Konten

Instruktur atau subject matter expert yang membuat, mengunggah, meninjau, dan menyetujui materi, soal diagnostik, post-test, assignment, rubrik, FAQ, dan sumber pengetahuan chatbot.

### 4.4 Perancang Pembelajaran

Pihak yang menyusun struktur pembelajaran, outcome, materi, contoh prompt AI, standar rubrik, dan validasi kualitas konten.

### 4.5 Administrator

Pihak yang mengelola deployment SCORM ke LMS, konfigurasi API AI, penyimpanan konten, dan pengaturan teknis.

## 5. Asumsi Utama

- Media akan dijalankan melalui LMS yang mendukung SCORM 1.2 atau SCORM 2004.
- Akses AI membutuhkan koneksi internet kecuali diputuskan menggunakan model lokal.
- Konten PDF, PowerPoint, gambar, dan video disediakan oleh pemilik proyek atau subject matter expert.
- Semua output AI harus dapat ditinjau atau dikurasi oleh manusia, terutama soal, rubrik, dan grading.
- Assignment grading AI bersifat rekomendasi awal, bukan keputusan final mutlak.
- Bahasa utama aplikasi, konten, instruksi, feedback, FAQ, chatbot, assignment, rubrik, dan laporan adalah Bahasa Indonesia.
- Aplikasi harus mobile responsive, bukan hanya desktop-first.
- Data chat learner, event analitik, hasil tes, submission, rubrik, dan hasil grading disimpan di database aplikasi.
- Assignment submission dikelola di dalam paket SCORM melalui antarmuka HTML5, lalu disimpan ke backend aplikasi.
- Konten utama pembelajaran, termasuk PDF, slide hasil konversi, gambar, dan video, dikemas di dalam paket SCORM sejauh ukuran paket masih dapat diterima oleh LMS target.
- Pembuat konten utama adalah instruktur.

## 6. Rekomendasi Standar Teknis

### 6.1 HTML5

- Frontend berbasis HTML5, CSS, dan JavaScript modern.
- Responsif untuk desktop, tablet, dan mobile.
- Mendukung akses keyboard dasar.
- Menggunakan desain modular agar konten dapat diganti per kursus.

### 6.2 SCORM

Rekomendasi awal:

- Gunakan SCORM 2004 4th Edition bila LMS mendukung, karena tracking completion, success, score, dan sequencing lebih baik.
- Gunakan SCORM 1.2 sebagai fallback bila LMS target lebih terbatas.

Minimal data yang dikirim ke LMS:

- `lesson_status` atau completion status.
- `success_status` bila menggunakan SCORM 2004.
- Skor diagnostik.
- Skor assignment final atau rekomendasi.
- Waktu belajar.
- Bookmark lokasi terakhir.
- Data interaksi kuis bila LMS mendukung.

### 6.3 Layanan AI

AI dapat digunakan melalui API eksternal atau model privat. Komponen AI harus memiliki:

- Prompt template yang terkontrol.
- Batasan konteks berdasarkan materi resmi.
- Logging untuk audit.
- Moderasi input/output.
- Fallback bila AI tidak tersedia.
- Mekanisme review manusia untuk asesmen.

### 6.4 Technology Stack yang Direkomendasikan

Prinsip pemilihan stack:

- Gratis atau open-source untuk pengembangan dan self-hosting.
- Ringan untuk tim kecil.
- Cocok untuk aplikasi HTML5 dalam paket SCORM.
- Mendukung mobile responsive.
- Mendukung AI, RAG, database, analitik, dan packaging SCORM tanpa biaya lisensi authoring tool komersial.

Stack utama yang direkomendasikan:

| Area | Teknologi | Status biaya | Alasan pemilihan |
| --- | --- | --- | --- |
| Frontend learning player | React + TypeScript + Vite | Gratis/open-source | Cepat untuk SPA HTML5, cocok untuk packaging SCORM, ekosistem kuat, dan mudah dibuat responsif |
| Styling dan UI | Tailwind CSS + shadcn/ui + Radix UI | Gratis/open-source | Mempercepat pembuatan UI responsif, accessible, dan konsisten tanpa membeli design system |
| State management | Zustand atau TanStack Query | Gratis/open-source | Ringan untuk state lokal, progres learner, cache API, dan sinkronisasi data |
| PDF viewer | PDF.js | Gratis/open-source | Menampilkan PDF langsung di browser tanpa plugin tambahan |
| Slide PowerPoint | LibreOffice headless untuk konversi PPTX ke PDF/HTML/image | Gratis/open-source | Menghindari dependency berbayar dan membuat slide lebih stabil di browser |
| Video player | HTML5 video + hls.js bila streaming HLS diperlukan | Gratis/open-source | Native browser support, hemat, dan mudah dilacak progresnya |
| SCORM runtime adapter | pipwerks SCORM wrapper atau wrapper internal TypeScript | Gratis/open-source | Memudahkan komunikasi SCORM 1.2/2004 dari HTML5 player |
| Backend API | Node.js + Hono atau Express + TypeScript | Gratis/open-source | Satu bahasa dengan frontend, ringan, mudah di-deploy, cocok untuk API AI dan analitik |
| Database utama | PostgreSQL | Gratis/open-source | Stabil untuk data learner, submission, rubrik, hasil tes, chat, dan event analitik |
| Vector search untuk RAG | pgvector di PostgreSQL | Gratis/open-source | Menyatukan data relasional dan embedding dalam satu database agar hemat operasional |
| ORM/query layer | Drizzle ORM atau Prisma | Gratis/open-source | Type-safe database access dan migrasi schema yang rapi |
| AI orchestration | LangChain.js atau service internal sederhana | Gratis/open-source | Memudahkan pipeline RAG, prompt template, retrieval, dan evaluasi output AI |
| Model AI lokal | Ollama dengan model open-source | Gratis/open-source, membutuhkan hardware lokal | Opsi tanpa biaya API untuk development, pilot, atau deployment on-premise |
| Model AI API opsional | Provider LLM berbayar atau institusional | Opsional | Dipakai bila kualitas, kecepatan, atau skalabilitas model lokal belum mencukupi |
| Object storage | MinIO | Gratis/open-source | Menyimpan file assignment, aset konten, video, dan hasil konversi secara self-hosted |
| Analytics event store | PostgreSQL event tables dengan schema xAPI-like | Gratis/open-source | Mendukung analitik lintas modul tanpa harus membeli Learning Record Store |
| Dashboard analytics | Apache ECharts atau Recharts | Gratis/open-source | Visualisasi tren progres, skor, learning gain, dan engagement |
| Testing | Vitest + Playwright | Gratis/open-source | Unit test dan end-to-end test lintas browser untuk player HTML5 |
| Packaging dan build | Node.js build scripts + zip + imsmanifest.xml generator | Gratis/open-source | Menghasilkan paket SCORM otomatis dan repeatable |
| Deployment | Docker Compose | Gratis/open-source | Menjalankan backend, database, MinIO, dan AI service secara konsisten di server sendiri |

Rekomendasi arsitektur hemat:

- Paket SCORM berisi HTML5 player, konten statis, konfigurasi modul, tes yang sudah disetujui, assignment UI, dan SCORM manifest.
- Backend self-hosted menangani AI, RAG, penyimpanan database, analytics event, submission, grading, dan dashboard instructor.
- PostgreSQL menjadi pusat data untuk learner profile, progres lintas modul, chat history, question bank, post-test, assignment, rubrik, grading, dan analytics event.
- pgvector menyimpan embedding dari PDF, slide, transcript video, FAQ, glosarium, dan sumber materi untuk RAG chatbot.
- MinIO menyimpan file besar seperti submission, aset media, hasil konversi slide, dan lampiran.
- Docker Compose digunakan untuk deployment awal agar tidak perlu Kubernetes pada fase MVP.

Catatan penting:

- AI lokal melalui Ollama dapat menekan biaya API, tetapi kualitas dan kecepatan sangat bergantung pada spesifikasi server.
- Untuk produksi dengan beban tinggi, gunakan abstraction layer agar model lokal dapat diganti ke provider LLM lain tanpa menulis ulang fitur.
- Jika LMS atau kebijakan jaringan memblokir request dari paket SCORM ke backend eksternal, perlu allowlist domain backend atau deployment backend dalam domain yang sama dengan LMS.

## 7. Kebutuhan Fungsional

### 7.1 Modul Konten Pembelajaran

Sistem harus menyediakan player pembelajaran yang menampilkan struktur modul secara jelas.

Kebutuhan:

- Menampilkan daftar topik atau lesson.
- Mendukung PDF viewer.
- Mendukung slide PowerPoint yang dikonversi ke HTML, gambar, atau PDF.
- Mendukung image gallery atau gambar inline.
- Mendukung video player.
- Menyimpan progres konten yang telah dibuka.
- Menyediakan navigasi next, previous, dan daftar isi.
- Menyediakan resume dari posisi terakhir.

Kriteria penerimaan:

- Learner dapat membuka semua jenis media tanpa meninggalkan paket pembelajaran.
- Sistem menyimpan halaman/section terakhir.
- LMS menerima status progres minimal saat learner menyelesaikan modul.

### 7.2 Penampil PDF

Kebutuhan:

- Menampilkan PDF di dalam modul.
- Mendukung zoom, scroll, dan pencarian bila memungkinkan.
- Mendukung fallback download bila viewer gagal.
- Melacak apakah PDF telah dibuka dan estimasi completion berdasarkan halaman atau waktu baca.

Kriteria penerimaan:

- PDF dapat dibaca di desktop dan mobile.
- Sistem tidak menganggap PDF selesai hanya karena file dimuat, kecuali aturan completion memang berbasis kunjungan.

### 7.3 Penampil Slide PowerPoint

Kebutuhan:

- Slide PowerPoint dikonversi menjadi format web-friendly.
- Menampilkan slide dengan navigasi.
- Mendukung catatan narasi atau transcript bila tersedia.
- Melacak jumlah slide yang telah dilihat.

Kriteria penerimaan:

- Slide tampil konsisten di browser modern.
- Minimal 90 persen slide harus terbaca tanpa distorsi layout signifikan setelah konversi.

### 7.4 Konten Gambar

Kebutuhan:

- Menampilkan gambar dengan ukuran responsif.
- Mendukung alt text untuk aksesibilitas.
- Mendukung caption.
- Mendukung gambar sebagai bagian dari materi, soal, atau assignment.

Kriteria penerimaan:

- Gambar tidak pecah atau keluar dari layout.
- Gambar penting memiliki alt text.

### 7.5 Pemutar Video

Kebutuhan:

- Mendukung video lokal dalam paket atau streaming dari URL yang diizinkan.
- Menyediakan play, pause, seek, volume, fullscreen, dan caption bila tersedia.
- Melacak persentase video yang telah ditonton.
- Menyediakan transcript bila memungkinkan.

Kriteria penerimaan:

- Video dapat diputar di browser target.
- Completion video dapat dikonfigurasi, misalnya selesai setelah 80 persen durasi ditonton.

### 7.6 Tes Diagnostik Berbasis AI

Tes diagnostik digunakan untuk memetakan pemahaman awal learner sebelum atau selama pembelajaran.

Kebutuhan:

- AI menghasilkan soal pilihan ganda berdasarkan materi, capaian pembelajaran, dan tingkat kesulitan.
- Setiap soal memiliki:
  - Pertanyaan.
  - 4 atau 5 pilihan jawaban.
  - Satu jawaban benar.
  - Penjelasan jawaban benar.
  - Tag kompetensi.
  - Level kognitif, misalnya remembering, understanding, applying, analyzing.
  - Tingkat kesulitan.
- Sistem dapat menghasilkan beberapa paket soal berbeda.
- Instructor atau instructional designer dapat meninjau dan menyetujui soal sebelum dipakai.
- Learner menerima skor dan feedback.
- Hasil tes dikirim ke LMS.

Kriteria penerimaan:

- Soal yang dihasilkan selalu memiliki jawaban benar yang eksplisit.
- Tidak ada soal aktif tanpa review, kecuali mode auto-generate memang diaktifkan oleh admin.
- Skor tersimpan dan terkirim ke LMS.
- Learner mendapat feedback setelah menyelesaikan tes.
- Struktur kompetensi, tingkat kesulitan, dan level kognitif tes diagnostik dapat dipetakan ke post-test untuk analisis learning gain.

### 7.7 Post-Test atau Summative Test Berbasis AI

Post-test digunakan untuk mengukur performa peserta setelah menyelesaikan pembelajaran dan membandingkannya dengan kondisi awal pada tes diagnostik.

Kebutuhan:

- AI menghasilkan soal pilihan ganda post-test berdasarkan materi, capaian pembelajaran, tag kompetensi, tingkat kesulitan, dan level kognitif yang sama dengan tes diagnostik.
- Soal post-test harus berbeda dari soal diagnostik, tetapi setara dari sisi blueprint asesmen.
- Setiap soal memiliki:
  - Pertanyaan.
  - 4 atau 5 pilihan jawaban.
  - Satu jawaban benar.
  - Penjelasan jawaban benar.
  - Tag kompetensi yang dapat dipasangkan dengan tes diagnostik.
  - Level kognitif.
  - Tingkat kesulitan.
- Sistem harus mendukung question blueprint agar distribusi kompetensi dan tingkat kesulitan konsisten.
- Instruktur atau pembuat konten dapat meninjau, mengedit, dan menyetujui soal post-test sebelum digunakan.
- Hasil post-test dikirim ke LMS dan disimpan di database aplikasi.
- Sistem menghitung perbandingan skor diagnostik dan post-test, termasuk peningkatan skor per peserta, per kompetensi, dan per modul.

Kriteria penerimaan:

- Tidak ada soal post-test yang identik dengan soal diagnostik aktif.
- Distribusi tingkat kesulitan post-test setara dengan tes diagnostik sesuai blueprint.
- Skor post-test tersimpan, terkirim ke LMS, dan tersedia untuk analitik lintas modul.
- Laporan dapat menampilkan learning gain dari skor diagnostik ke post-test.

### 7.8 FAQ Berbasis AI

FAQ menyediakan jawaban cepat terhadap pertanyaan umum terkait materi, penggunaan modul, dan assignment.

Kebutuhan:

- FAQ dapat dibuat dari materi resmi modul.
- FAQ dapat ditampilkan sebagai daftar kategori.
- Pertanyaan FAQ dapat dicari.
- Admin atau instructor dapat menambah, mengedit, dan menonaktifkan FAQ.
- AI dapat menyarankan FAQ baru berdasarkan konten dan pertanyaan learner yang sering muncul.

Kriteria penerimaan:

- FAQ hanya menjawab berdasarkan sumber yang disetujui.
- Jawaban FAQ dapat ditinjau dan diedit.
- FAQ tetap dapat digunakan walaupun chatbot sedang tidak tersedia.

### 7.9 Chatbot AI Berbasis RAG

Chatbot membantu learner memahami materi tanpa menggantikan instructor.

Kebutuhan:

- Chatbot menggunakan metode Retrieval-Augmented Generation (RAG) dengan mengambil konteks dari knowledge base sebelum menghasilkan jawaban.
- Knowledge base mencakup PDF, slide, transcript video, FAQ, glosarium, assignment brief, rubrik yang boleh ditampilkan, dan metadata section materi.
- Chatbot menjawab pertanyaan berdasarkan konten modul dan FAQ resmi.
- Chatbot dapat memberikan penjelasan tambahan, contoh, rangkuman, dan petunjuk belajar.
- Chatbot tidak boleh memberikan jawaban final assignment secara langsung.
- Chatbot harus menyatakan keterbatasan bila jawabannya tidak ada di basis pengetahuan.
- Chatbot menyimpan riwayat percakapan di database aplikasi sesuai kebijakan privasi.
- Chatbot memiliki guardrail untuk mencegah output berbahaya, tidak relevan, atau melanggar akademik.
- Chatbot harus menyertakan rujukan ke section, halaman, slide, timestamp video, atau sumber materi yang relevan bila tersedia.
- Chatbot harus membedakan antara jawaban berbasis sumber dan inferensi tambahan.

Kriteria penerimaan:

- Chatbot tidak menjawab di luar cakupan materi secara berlebihan.
- Chatbot memberikan rujukan ke section materi yang relevan dalam responnya.
- Jawaban chatbot dapat ditelusuri ke dokumen atau section sumber dalam knowledge base.
- Bila AI gagal, learner mendapat pesan fallback yang jelas.

### 7.10 Assignment Generator Berbasis AI

Sistem menghasilkan tugas yang selaras dengan capaian pembelajaran.

Kebutuhan:

- AI menghasilkan assignment berdasarkan:
  - Tujuan pembelajaran.
  - Materi.
  - Level kesulitan.
  - Format tugas.
  - Durasi pengerjaan.
  - Kriteria penilaian.
- Assignment dapat berupa studi kasus, esai, proyek mini, analisis dokumen, refleksi, atau tugas praktik.
- Instructor dapat meninjau dan mengedit assignment sebelum dipublikasikan.
- Assignment memiliki instruksi yang jelas, deliverable, batasan, dan format pengumpulan.

Kriteria penerimaan:

- Assignment selalu memiliki tujuan, instruksi, deliverable, dan kriteria.
- Assignment tidak dipublikasikan tanpa approval bila mode review aktif.

### 7.11 Rubric Generator Berbasis AI

Kebutuhan:

- AI menghasilkan rubrik berdasarkan assignment dan capaian pembelajaran.
- Rubrik minimal memiliki:
  - Kriteria.
  - Level performa.
  - Deskripsi tiap level.
  - Bobot nilai.
  - Total skor.
- Instructor dapat mengedit rubrik.
- Rubrik yang digunakan untuk grading harus tersimpan sebagai versi.

Kriteria penerimaan:

- Total bobot rubrik harus 100 persen atau sesuai skala yang ditentukan.
- Setiap kriteria memiliki deskripsi performa yang jelas.
- Versi rubrik yang dipakai untuk grading dapat dilacak.

### 7.12 Assignment Submission

Kebutuhan:

- Learner dapat mengumpulkan assignment dalam bentuk teks langsung, file upload, atau link.
- Submission dilakukan dari antarmuka HTML5 di dalam paket SCORM.
- Sistem menampilkan status submission.
- Sistem mendukung resubmission bila diizinkan.
- File submission divalidasi berdasarkan tipe dan ukuran.
- Submission disimpan ke backend aplikasi dan metadata submission dicatat di database.

Kriteria penerimaan:

- Submission tersimpan dan dapat diproses oleh AI grading.
- Learner mendapat konfirmasi setelah submit.

### 7.13 Assignment Grading Berbantuan AI

Kebutuhan:

- AI menilai assignment berdasarkan rubrik yang telah disetujui.
- Output grading mencakup:
  - Skor per kriteria.
  - Total skor.
  - Feedback formatif.
  - Area yang kuat.
  - Area yang perlu diperbaiki.
  - Tingkat keyakinan AI.
  - Catatan potensi pelanggaran akademik bila terdeteksi.
- Instructor dapat menerima, mengubah, atau menolak rekomendasi nilai AI.
- Nilai final dikirim ke LMS setelah disetujui atau sesuai konfigurasi.

Kriteria penerimaan:

- AI grading selalu menyertakan alasan berdasarkan rubrik.
- Instructor dapat override nilai.
- Sistem membedakan skor rekomendasi AI dan skor final.
- Learner tidak melihat feedback AI sebelum status feedback dirilis.

## 8. Kebutuhan Non-Fungsional

### 8.1 Kompatibilitas

- Browser target: Chrome, Edge, Firefox, Safari versi modern.
- LMS target harus diuji minimal pada LMS utama yang digunakan organisasi.
- Paket SCORM harus dapat diunggah tanpa modifikasi manual.
- Tampilan mobile responsive wajib didukung untuk smartphone dan tablet, termasuk navigasi materi, kuis, chatbot, dan assignment submission.

### 8.2 Performa

- Initial load ideal di bawah 5 detik pada koneksi standar.
- Konten besar seperti video sebaiknya menggunakan streaming atau lazy loading.
- AI response time ideal di bawah 10 detik untuk FAQ/chatbot dan di bawah 60 detik untuk generation/grading.

### 8.3 Aksesibilitas

- Layout responsif.
- Navigasi keyboard untuk fungsi utama.
- Kontras teks memadai.
- Alt text untuk gambar penting.
- Caption atau transcript untuk video bila tersedia.
- Struktur heading yang logis.

### 8.4 Keamanan

- API key AI tidak boleh disimpan di frontend.
- Semua request AI harus melalui backend/proxy aman.
- Input learner harus disanitasi.
- File upload harus divalidasi.
- Data assignment dan chat harus mengikuti kebijakan privasi organisasi.
- Database harus memiliki role-based access control untuk membedakan learner, instruktur, pembuat konten, dan administrator.

### 8.5 Privasi dan Etika AI

- Learner harus diberi tahu bila sedang berinteraksi dengan AI.
- Sistem harus menjelaskan bahwa AI grading adalah bantuan penilaian.
- Data learner tidak boleh digunakan untuk training model eksternal tanpa persetujuan.
- Harus ada mekanisme koreksi manusia untuk hasil AI yang keliru.

### 8.6 Keandalan

- Modul tetap dapat membuka materi non-AI saat layanan AI tidak tersedia.
- Tes yang sudah disetujui tetap dapat digunakan offline dalam paket.
- Fitur chatbot dan grading memiliki pesan fallback.
- Event analitik harus menggunakan mekanisme retry atau antrean lokal sementara bila koneksi ke backend terputus.

## 9. Arsitektur Tingkat Tinggi

### 9.1 Komponen Utama

- HTML5 Learning Player.
- Content Asset Manager.
- SCORM Runtime Adapter.
- AI Orchestration Service.
- Question Generator.
- FAQ/Knowledge Base Service.
- RAG Chatbot Service.
- Vector Index Service.
- Assignment and Rubric Generator.
- AI Grading Service.
- Analytics Event Service.
- Cross-Module Analytics Dashboard.
- Database and Object Storage Layer.
- Instructor Review Interface.
- LMS Integration Layer.

### 9.2 Alur Data Utama

1. Learner membuka paket SCORM dari LMS.
2. HTML5 player melakukan inisialisasi SCORM runtime.
3. Learner mengakses materi dan progres dikirim ke LMS.
4. Learner mengikuti tes diagnostik.
5. Skor diagnostik dan interaksi dikirim ke LMS serta database analitik.
6. Learner menyelesaikan materi pembelajaran.
7. Learner mengikuti post-test dengan soal berbeda dan tingkat kesulitan setara.
8. Sistem membandingkan skor diagnostik dan post-test untuk mengukur learning gain.
9. Learner bertanya ke FAQ atau chatbot.
10. Chatbot melakukan retrieval dari knowledge base, menghasilkan jawaban, dan menyertakan rujukan section materi.
11. Riwayat chat dan metadata retrieval disimpan di database.
12. Learner mengumpulkan assignment dari paket SCORM.
13. AI grading memberi rekomendasi skor berdasarkan rubrik.
14. Instructor meninjau dan menetapkan nilai final.
15. Nilai final dikirim ke LMS.
16. Dashboard analitik lintas modul membaca event dari database aplikasi.

## 10. Kebutuhan Konten

Setiap modul pembelajaran membutuhkan paket konten berikut:

- Judul modul.
- Deskripsi modul.
- Capaian pembelajaran.
- Struktur lesson/topik.
- PDF.
- PowerPoint.
- Gambar dan alt text.
- Video dan transcript/caption bila tersedia.
- Glosarium bila diperlukan.
- Bank konteks untuk AI.
- Blueprint asesmen untuk tes diagnostik dan post-test.
- Contoh soal diagnostik untuk validasi kualitas AI.
- Contoh soal post-test untuk validasi kesetaraan tingkat kesulitan.
- Contoh assignment.
- Standar rubrik.
- Metadata section materi, halaman PDF, nomor slide, dan timestamp video untuk rujukan chatbot RAG.

## 11. Prompt AI dan Tata Kelola

### 11.1 Prompt Template

Setiap fitur AI harus menggunakan prompt template yang terdokumentasi:

- Diagnostic question generation prompt.
- Post-test generation prompt.
- FAQ generation prompt.
- RAG chatbot system prompt.
- Assignment generation prompt.
- Rubric generation prompt.
- Assignment grading prompt.

### 11.2 Validasi Output AI

Output AI harus divalidasi dengan aturan berikut:

- Format JSON atau schema terstruktur untuk output yang dipakai sistem.
- Validasi jumlah pilihan jawaban.
- Validasi hanya satu jawaban benar.
- Validasi total bobot rubrik.
- Validasi skor berada dalam rentang.
- Validasi output tidak kosong atau tidak relevan.
- Validasi kesetaraan blueprint antara tes diagnostik dan post-test.
- Validasi rujukan sumber untuk jawaban chatbot RAG.

### 11.3 Human-in-the-Loop

Fitur yang wajib memiliki opsi review manusia:

- Publikasi soal diagnostik.
- Publikasi soal post-test.
- Publikasi assignment.
- Publikasi rubrik.
- Finalisasi nilai assignment.

## 12. Kebutuhan Pelacakan SCORM

Data minimal yang harus dikirim:

- Completion status modul.
- Success status bila berlaku.
- Score raw.
- Score min dan max.
- Session time.
- Total time.
- Suspend data untuk bookmark.
- Location.
- Skor diagnostik.
- Skor post-test.
- Skor assignment final.

Data yang direkomendasikan:

- Skor diagnostik.
- Skor post-test.
- Learning gain dari diagnostik ke post-test.
- Status video completion.
- Completion per lesson.
- Hasil assignment.
- Interaksi soal pilihan ganda.
- Event analitik lintas modul yang disimpan di database aplikasi.

Catatan: kapasitas `suspend_data` berbeda antara SCORM 1.2 dan SCORM 2004. Desain tracking harus menghindari penyimpanan data besar di `suspend_data`.

Untuk analitik tingkat lanjut, SCORM runtime tetap digunakan untuk data LMS, sedangkan event rinci disimpan di database aplikasi karena `suspend_data` tidak cocok untuk menyimpan histori aktivitas besar lintas modul.

## 13. Kebutuhan Pengalaman Pengguna

### 13.1 Pengalaman Peserta Belajar

- Learner langsung melihat struktur modul.
- Learner dapat mengetahui progres belajar.
- Learner dapat mengakses materi, tes diagnostik, post-test, FAQ, chatbot, dan assignment dari navigasi utama.
- Feedback tes harus jelas dan membantu.
- Chatbot harus mudah diakses tetapi tidak mengganggu.
- Assignment harus memiliki instruksi dan rubrik yang terlihat.
- Semua tampilan utama harus nyaman digunakan di mobile.

### 13.2 Pengalaman Instruktur

- Instructor dapat melihat hasil diagnostik.
- Instructor dapat melihat hasil post-test dan perbandingan learning gain.
- Instructor dapat meninjau soal AI sebelum aktif.
- Instructor dapat meninjau assignment dan rubrik.
- Instructor dapat melihat rekomendasi grading AI dan melakukan override.
- Instructor dapat membaca dashboard analitik lintas modul dan mengekspor ringkasan hasil bila LMS tidak menyediakan tampilan rinci.

## 14. Pelaporan dan Analitik

Analitik tingkat lanjut lintas modul adalah fitur inti aplikasi, bukan fitur fase lanjutan. Data analitik disimpan di database aplikasi dan digunakan untuk membantu instruktur memahami progres, performa, engagement, dan efektivitas pembelajaran.

Laporan minimum:

- Completion per learner.
- Skor diagnostik.
- Skor post-test.
- Perbandingan skor diagnostik dan post-test.
- Learning gain per peserta, per kompetensi, dan per modul.
- Kompetensi yang lemah berdasarkan tag soal.
- Status assignment.
- Skor assignment final.
- Rata-rata skor per modul.
- Pertanyaan yang sering diajukan ke chatbot.
- Materi yang paling sering dibuka.
- Drop-off point dalam modul.
- Waktu belajar per materi.
- Completion lintas modul.
- Korelasi engagement, skor diagnostik, skor post-test, dan skor assignment.

Kebutuhan dashboard analitik:

- Menampilkan ringkasan performa cohort.
- Menampilkan tren learning gain lintas modul.
- Menampilkan kompetensi yang paling banyak belum dikuasai.
- Menampilkan daftar learner yang perlu intervensi.
- Menampilkan pertanyaan chatbot yang sering muncul dan section materi yang paling sering dirujuk.
- Mendukung filter berdasarkan modul, cohort, periode, kompetensi, dan status completion.
- Mendukung ekspor CSV untuk analisis lanjutan.

## 15. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Output AI tidak akurat | Soal, rubrik, atau nilai keliru | Review manusia, schema validation, prompt testing |
| LMS tidak mendukung SCORM 2004 | Tracking terbatas | Sediakan build SCORM 1.2 |
| File media terlalu besar | Load lambat | Optimasi aset, streaming video, lazy loading |
| API AI tidak tersedia | FAQ/chatbot/grading gagal | Fallback message, cache soal/FAQ, mode non-AI |
| Kebocoran data learner | Risiko privasi | Backend proxy, enkripsi, minimisasi data |
| AI memberi jawaban assignment | Pelanggaran akademik | Guardrail chatbot, policy prompt, deteksi intent |
| Rubrik tidak konsisten | Penilaian tidak adil | Versioning rubrik, review instructor |
| Soal post-test tidak setara dengan tes diagnostik | Learning gain tidak valid | Blueprint asesmen, review instruktur, validasi tingkat kesulitan |
| Analitik lintas modul tidak lengkap karena batasan SCORM | Insight pembelajaran terbatas | Simpan event rinci di database aplikasi, SCORM hanya untuk tracking LMS utama |
| Chatbot RAG mengambil konteks yang tidak relevan | Jawaban keliru atau membingungkan | Retrieval threshold, metadata section, evaluasi jawaban, rujukan sumber wajib |

## 16. Kriteria Penerimaan Produk

Produk dianggap siap rilis bila:

- Paket SCORM berhasil diunggah dan dijalankan di LMS target.
- Materi PDF, slide, gambar, dan video tampil baik.
- Progres belajar terkirim ke LMS.
- Tes diagnostik berjalan, memberi skor, dan menyimpan hasil.
- Post-test berjalan dengan soal berbeda tetapi tingkat kesulitan setara, memberi skor, dan menyimpan hasil.
- Sistem menampilkan perbandingan skor diagnostik dan post-test.
- Soal AI dapat dibuat, divalidasi, dan ditinjau.
- FAQ dan chatbot RAG dapat menjawab berdasarkan materi serta menyertakan rujukan section yang relevan.
- Assignment dan rubrik dapat dibuat oleh AI serta diedit instructor.
- AI grading menghasilkan skor dan feedback berbasis rubrik.
- Instructor dapat override hasil grading.
- Nilai final dapat dikirim ke LMS.
- Data chat, submission, hasil grading, hasil tes, dan event analitik tersimpan di database.
- Dashboard analitik lintas modul tersedia sebagai fitur inti.
- Tampilan utama berjalan baik di mobile.
- Aplikasi tetap usable ketika layanan AI tidak tersedia.
- Dokumentasi pengguna dan teknis tersedia.

## 17. Hasil Serah Terima

- Paket HTML5 learning media.
- Paket SCORM 1.2 dan/atau SCORM 2004.
- Source code frontend.
- Source code backend/proxy AI.
- Database schema dan migration scripts.
- RAG ingestion pipeline untuk PDF, slide, transcript video, FAQ, dan metadata section.
- Dashboard analitik lintas modul.
- Template konten modul.
- Template prompt AI.
- Template blueprint tes diagnostik dan post-test.
- Dokumentasi teknis.
- Panduan authoring konten.
- Panduan instructor.
- Test report kompatibilitas LMS.
- Docker Compose untuk deployment self-hosted.
- Dokumen technology stack dan deployment guide.

## 18. Rencana Implementasi

### Fase 1: Discovery dan Desain Pembelajaran

- Finalisasi tujuan pembelajaran.
- Audit materi PDF, PowerPoint, gambar, dan video.
- Desain struktur modul.
- Definisi data tracking SCORM.
- Definisi kebijakan AI dan review manusia.

### Fase 2: Prototype

- HTML5 learning player.
- SCORM runtime integration.
- Viewer PDF, slide, image, dan video.
- Tes diagnostik statis.
- Post-test statis dengan blueprint setara.
- Prototype AI question generation.

### Fase 3: AI Learning Features

- FAQ generation.
- Chatbot berbasis RAG.
- Ingestion pipeline dan vector index.
- Assignment generator.
- Rubric generator.
- Validasi output AI.

### Fase 4: Assignment Grading

- Submission workflow.
- AI grading berdasarkan rubrik.
- Instructor review dan override.
- Pengiriman nilai ke LMS.
- Penyimpanan submission dan hasil grading ke database.

### Fase 5: Analitik Lintas Modul

- Event tracking ke database aplikasi.
- Dashboard analitik cohort, learner, kompetensi, dan modul.
- Perbandingan diagnostik dan post-test.
- Analitik chatbot dan drop-off pembelajaran.
- Ekspor laporan CSV.

### Fase 6: QA dan Deployment

- Uji browser.
- Uji mobile responsive.
- Uji LMS.
- Uji SCORM tracking.
- Uji performa media.
- Uji keamanan dasar.
- Uji RAG chatbot dan rujukan sumber.
- Uji dashboard analitik.
- Pilot dengan learner dan instructor.

## 19. Pertanyaan Terbuka

- LMS target yang akan digunakan apa?
- Standar SCORM yang wajib didukung: SCORM 1.2, SCORM 2004, atau keduanya?
- Apakah AI lokal melalui Ollama cukup untuk kualitas yang diharapkan, atau perlu opsi provider LLM eksternal?
- Berapa batas ukuran paket SCORM yang diterima oleh LMS target?
- Berapa batas ukuran file assignment dan tipe file yang diizinkan?
- Berapa lama data chat, submission, dan event analitik harus disimpan di database?
- Apakah dashboard analitik hanya untuk instruktur atau juga untuk administrator program?
- Apakah diperlukan integrasi Single Sign-On dari LMS ke backend aplikasi?

## 20. Rekomendasi Konsultan

Untuk fase awal, disarankan membangun MVP dengan fokus pada:

- HTML5 player yang stabil.
- SCORM tracking yang benar.
- Integrasi materi PDF, slide, image, dan video.
- Tes diagnostik AI dengan review manusia.
- Post-test dengan blueprint setara untuk mengukur learning gain.
- FAQ dan chatbot RAG berbasis konten resmi dengan rujukan section.
- Assignment generator, rubric generator, dan AI grading sebagai fitur beta dengan instructor override.
- Database aplikasi untuk menyimpan chat history, submission, hasil tes, hasil grading, dan event analitik.
- Dashboard analitik lintas modul sebagai fitur inti sejak MVP.
- Mobile responsive sebagai syarat rilis, bukan enhancement.

Pendekatan ini menjaga nilai inovasi AI tetap tinggi, tetapi risiko pedagogis dan penilaian tetap terkendali melalui human-in-the-loop.

## 21. Rujukan Technology Stack

Rujukan resmi untuk stack yang direkomendasikan:

- React: https://react.dev/learn/start-a-new-react-project
- Vite: https://vite.dev/guide/
- Docker Compose: https://docs.docker.com/compose/
- PostgreSQL dan pgvector: https://www.postgresql.org/about/news/pgvector-050-released-2700/
- LangChain.js RAG: https://docs.langchain.com/oss/javascript/langchain/rag
- Ollama API: https://docs.ollama.com/api
- Playwright: https://playwright.dev/docs/running-tests
- SCORM 2004 ADL: https://www.adlnet.gov/assets/uploads/SCORM_2004_4ED_v1_1_TR_20090814.pdf
