# Ringkasan Diskusi untuk Pengembangan Backend Learning Media

## Update Revisi Terakhir

Revisi terbaru mockup mengubah beberapa kebutuhan backend dan kontrak data yang perlu diperhatikan saat implementasi.

- Alur peserta sekarang dimulai dari `Diagnostik Test`; tab Overview dihapus dari pengalaman belajar peserta.
- Nama fase pembelajaran yang dipakai oleh UI dan analytics adalah `Diagnostik Test`, `Materi Pembelajaran`, `Assignment`, `Tryout Uji Kompetensi`, dan `Feedback`.
- Backend perlu menyimpan status fase untuk timeline vertikal: `locked`, `available`, `active`, `completed`, metrik ringkas per fase, serta total progress peserta.
- Sidebar timeline harus dapat dibangun dari data progress peserta, bukan hardcoded di frontend produksi.
- Materi PDF perlu diproses menjadi halaman terpisah. Metadata per halaman minimal meliputi `fileId`, `fileName`, `pageNumber`, `totalPages`, `pageAspectRatio`, dan `sourceUrl`.
- Frontend menampilkan PDF dengan default `fit to page`, satu halaman penuh, proporsional. Backend disarankan menyediakan aspect ratio halaman PDF agar viewer dapat mengatur frame tanpa distorsi.
- Materi video perlu memiliki metadata `duration`, `poster` opsional, dan event tracking untuk `autoplay_started`, `play`, `pause`, `progress`, `completed`, `seek`.
- Autoplay video dijalankan muted karena batasan browser. Backend analytics perlu membedakan autoplay start dan play manual.
- Materi gambar perlu mendukung zoom event: `zoom_in`, `zoom_out`, `zoom_set`, `zoom_reset`.
- Tombol backward/forward video pada UI memakai double-chevron dengan label durasi; backend cukup menerima event `video_skip` dengan payload `seconds`.
- Assignment tetap menggunakan AI powered grading, tetapi nama tab peserta adalah `Assignment`.
- `materi/knowledge` dan `materi/resource` tetap menjadi sumber ingestion untuk FAQ, deep text search, dan RAG chatbot.

## Technology Stack

### Stack yang Digunakan pada Mockup Saat Ini

Mockup saat ini belum memakai backend runtime sungguhan. Semua fitur backend masih disimulasikan di frontend statis.

| Area mock backend | Teknologi yang digunakan | Catatan |
| --- | --- | --- |
| Runtime | Static HTML5 + Vanilla JavaScript | Logika manifest, progress, quiz, feedback, dan grading mock berjalan di browser. |
| Penyimpanan state | Browser `localStorage` | Dipakai sebagai pengganti database/session backend untuk mockup. |
| Materi | File lokal `materi/knowledge` dan `materi/resource` | Dibaca sebagai sumber materi utama, resource, FAQ, search mock, dan chatbot mock. |
| PDF metadata | Manifest hardcoded + metadata file | PDF dipecah per halaman dalam struktur mock; production perlu extractor PDF. |
| Search/RAG mock | JavaScript array dan keyword matching | Production perlu ingestion, chunking, embedding, vector search, dan citation. |
| AI grading mock | Rule-based keyword scoring di JavaScript | Production perlu service AI grading berbasis rubrik, audit log, dan human review. |
| Analytics mock | Event array JavaScript | Production perlu event collector dan database analytics. |

### Stack Backend yang Direkomendasikan untuk Production

| Area backend | Stack rekomendasi | Fungsi |
| --- | --- | --- |
| API service | Node.js + TypeScript dengan Hono atau Express | Endpoint manifest materi, progress, quiz, assignment, analytics, FAQ, dan chatbot. |
| Database utama | PostgreSQL | Menyimpan learner, enrollment, progress, attempt, score, assignment submission, rubrik, chat, dan analytics events. |
| Vector database | PostgreSQL + pgvector | Menyimpan embedding chunk materi untuk RAG dan deep content search. |
| Object/file storage | Local storage terstruktur, S3-compatible storage, atau MinIO | Menyimpan materi, resource, file assignment, hasil ekstraksi teks, dan artefak indexing. |
| PDF extraction | `pypdf`, PDF.js server-side, atau Poppler | Mengambil jumlah halaman, aspect ratio, teks per halaman, dan metadata PDF. |
| OCR gambar/PDF scan | Tesseract OCR atau OCR engine enterprise | Ekstraksi teks dari gambar dan PDF scan. |
| Transkripsi video | Whisper atau speech-to-text service | Menghasilkan transcript video untuk RAG, FAQ, dan search. |
| Queue/background jobs | BullMQ + Redis atau worker queue sejenis | Menjalankan ingestion, OCR, transcription, embedding, grading, dan analytics aggregation. |
| AI orchestration | LangChain.js atau service internal | Pipeline RAG, prompt template, citation, grading, dan guardrail. |
| SCORM adapter | pipwerks SCORM wrapper atau wrapper internal TypeScript | Sinkronisasi completion, score, bookmark, interaction, dan runtime events ke LMS. |
| Auth/role | LMS SSO/LTI/SCORM launch context + RBAC backend | Membedakan learner, instructor, instructional designer, dan admin. |
| Observability | Structured logs + OpenTelemetry-ready events | Audit aktivitas, debugging, dan monitoring job ingestion/grading. |

Dokumen ini merangkum kebutuhan backend berdasarkan PRD dan revisi mockup learning media perdagangan internasional dan kepabeanan DJBC.

## Tujuan Produk

Aplikasi adalah learning media HTML5 yang mendukung pembelajaran sequential, asesmen, assignment dengan AI powered grading, chatbot RAG berbasis materi, FAQ berbasis sumber, analytics, dan integrasi SCORM/LMS.

Materi utama saat ini berasal dari folder lokal:

- `C:\Users\ASUS\Documents\Learning media 2\materi\knowledge`: materi pembelajaran utama yang ditampilkan di Modul Pembelajaran.
- `C:\Users\ASUS\Documents\Learning media 2\materi\resource`: resource tambahan yang ditampilkan melalui sidebar icon resource.

Seluruh file dari kedua folder harus dipakai sebagai sumber FAQ dan knowledge base RAG chatbot.

## Alur Pembelajaran Peserta

Urutan tab peserta bersifat sequential:

1. `Diagnostik Test`
2. `Materi Pembelajaran`
3. `Assignment`
4. `Tryout Uji Kompetensi`
5. `Feedback`

Tab berikutnya hanya aktif setelah aktivitas sebelumnya selesai. Tab `SCORM and Analytics` bukan bagian dari alur peserta dan hanya untuk instruktur atau instructional designer melalui frontend khusus.

## Modul Pembelajaran

Backend perlu menyediakan daftar file dari `materi\knowledge` dalam urutan nama file ascending. File ditampilkan sesuai tampilan asalnya:

- PDF: dipecah menjadi item per halaman untuk navigasi sequential dan perhitungan progress per halaman.
- Video: video player dengan play/pause, seek slider, durasi, volume, mute, speed, forward/backward.
- Gambar: image viewer.
- Tipe lain: fallback preview dengan tombol download.

Backend disarankan menyediakan endpoint manifest:

```http
GET /api/learning-media/{moduleId}/materials
```

Contoh respons:

```json
{
  "generatedAt": "2026-05-24T00:00:00+07:00",
  "basePath": "file:///C:/Users/ASUS/Documents/Learning%20media%202/materi",
  "knowledge": [
    {
      "name": "01 Hook.jpg",
      "path": "file:///C:/Users/ASUS/Documents/Learning%20media%202/materi/knowledge/01%20Hook.jpg",
      "type": "image",
      "size": 228006
    }
  ],
  "resource": [
    {
      "name": "Pengantar-Konsep-Perdagangan-Internasional (2).pdf",
      "path": "file:///C:/Users/ASUS/Documents/Learning%20media%202/materi/resource/Pengantar-Konsep-Perdagangan-Internasional%20(2).pdf",
      "type": "pdf",
      "size": 996563,
      "pages": 10
    }
  ]
}
```

Refresh modul dan resource dapat dilakukan dengan memanggil ulang endpoint manifest. Backend harus membaca isi folder terbaru, mengurutkan berdasarkan nama file, dan mengembalikan metadata file.

## Resource Pembelajaran

Tombol `RESOURCE` menampilkan sidebar kanan yang berisi daftar file dari `./materials/resource`. Setiap item resource memuat:

- Nama file.
- Icon sesuai tipe file.
- Tipe file dan ukuran.
- Path sumber.
- Tombol download.

Resource tidak menjadi aktivitas wajib peserta, tetapi semua resource masuk ke korpus FAQ dan RAG chatbot.

## Asesmen

Diagnostik test:

- 5 soal.
- Muncul satu per satu.
- Feedback dan nilai tampil setelah seluruh jawaban disubmit.
- Feedback menampilkan benar/salah per soal dan suggestion topik yang sebaiknya dipelajari.

Post test:

- 10 soal.
- Muncul satu per satu.
- Feedback tetap tampil di tab Post Test.
- Feedback menggunakan scroll area agar halaman tidak terlalu panjang.
- Feedback menampilkan benar/salah per soal, referensi materi untuk jawaban salah, strength, weakness, dan saran perbaikan.

Backend perlu menyimpan:

- Jawaban peserta per soal.
- Skor.
- Status benar/salah.
- Waktu submit.
- Referensi materi yang terkait dengan soal.
- Attempt number.

## Assignment dan AI Powered Grading

Assignment berupa studi kasus importasi komponen elektronik. Peserta dapat menjawab melalui editor HTML dan/atau upload file.

Flow submit:

1. Peserta mengisi essay atau memilih file.
2. Peserta klik submit.
3. Sistem menampilkan konfirmasi pengiriman.
4. Setelah konfirmasi, feedback assignment menggantikan isi tab Assignment.

Backend perlu mendukung:

- Upload file assignment.
- Penyimpanan HTML essay.
- AI powered grading berbasis rubrik.
- Penyimpanan skor per rubrik.
- Feedback per rubrik dan feedback keseluruhan.
- Flag review manusia/instruktur.

Rubrik:

- Ketepatan konsep perdagangan internasional dan impor: 25%.
- Pemahaman proses kepabeanan: 30%.
- Analisis risiko dan fasilitasi perdagangan: 25%.
- Argumentasi, struktur, dan rujukan sumber: 20%.

## Feedback Keseluruhan

Tab Feedback aktif setelah seluruh aktivitas peserta selesai. Nilai keseluruhan adalah rata-rata dari:

- Persentase penyelesaian modul pembelajaran.
- Nilai assignment.
- Nilai post test.

Feedback juga mencakup:

- Strength peserta.
- Weakness peserta.
- Saran peningkatan pemahaman.
- Sinyal personalized learning untuk pembelajaran selanjutnya.

## RAG dan FAQ

Semua file pada `./materials/knowledge` dan `./materials/resource` harus masuk pipeline ingestion RAG.

Pipeline backend yang disarankan:

1. Scan folder `knowledge` dan `resource`.
2. Deteksi tipe file.
3. Ekstraksi teks:
   - PDF: text extraction + OCR fallback jika perlu.
   - Gambar: OCR.
   - Video: transcript atau speech-to-text.
   - DOCX/PPTX/XLSX: parser dokumen.
4. Chunking berbasis struktur dokumen.
5. Simpan metadata: module id, file name, folder, page/time range, chunk id, checksum, updated at.
6. Generate embedding.
7. Simpan ke vector store.
8. Gunakan citation pada jawaban chatbot.

FAQ dapat digenerate dari sumber yang sama dan tetap menyimpan referensi file, halaman, atau timestamp.

## Analytics dan SCORM

Analytics hanya untuk instruktur dan instructional designer. Kategori dashboard:

- Learners Performance Analytics.
- Learning Activities Analytics.
- Learning Module Analytics.
- Question Analytics.
- Personalized Learning Signals.
- Feedback untuk Instructional Designer.

Metrik learning activities yang perlu didukung:

- Completion rate.
- Engagement event count.
- Search count.
- Chatbot/help-seeking count.
- Assignment submission status.
- Submission attempts.
- Video watch percentage.
- Time on task.
- Navigation pattern.
- Persistence signal.

Metrik learning module analytics:

- Content coverage.
- Module completion percentage.
- Drop-off point.
- Average time per material.
- Video completion rate.
- Resource access rate.
- Content effectiveness proxy.
- Revision priority.

Metrik quiz/question analytics:

- Item difficulty/facility index.
- Correct/incorrect count.
- Distractor effectiveness.
- Competency mastery.
- Wrong-answer pattern.
- Question discrimination proxy.
- Blueprint coverage.
- Remedial recommendation.

SCORM event yang perlu dipetakan:

- Initialize.
- SetValue lokasi/bookmark.
- Interaction untuk search, chatbot, quiz, assignment.
- Score update.
- Completion status.
- Terminate.

## Entitas Data Backend

Entitas utama yang disarankan:

- `users`
- `roles`
- `modules`
- `module_materials`
- `module_resources`
- `rag_documents`
- `rag_chunks`
- `faq_items`
- `quiz_questions`
- `quiz_attempts`
- `quiz_answers`
- `assignments`
- `assignment_submissions`
- `rubric_scores`
- `learning_events`
- `scorm_sessions`
- `learner_feedback`
- `analytics_snapshots`

## Endpoint Awal yang Disarankan

```http
GET /api/modules/{moduleId}
GET /api/modules/{moduleId}/materials
POST /api/modules/{moduleId}/materials/refresh
GET /api/modules/{moduleId}/resources
GET /api/files/{fileId}/download

GET /api/modules/{moduleId}/faq
POST /api/modules/{moduleId}/chat
POST /api/modules/{moduleId}/rag/reindex

GET /api/modules/{moduleId}/diagnostic
POST /api/modules/{moduleId}/diagnostic/submit
GET /api/modules/{moduleId}/post-test
POST /api/modules/{moduleId}/post-test/submit

POST /api/modules/{moduleId}/assignment/submissions
POST /api/modules/{moduleId}/assignment/submissions/{submissionId}/confirm
GET /api/modules/{moduleId}/assignment/submissions/{submissionId}/feedback

POST /api/modules/{moduleId}/events
GET /api/modules/{moduleId}/feedback
GET /api/instructor/modules/{moduleId}/analytics
GET /api/instructor/modules/{moduleId}/analytics/export
```

## Catatan Implementasi

Mockup HTML saat ini masih menggunakan manifest statis sebagai fallback. Pada aplikasi produksi, manifest sebaiknya diganti dengan endpoint backend yang membaca folder aktual dan menghasilkan metadata terbaru. Untuk perubahan file, backend dapat memakai checksum dan `updated_at` agar reindex RAG hanya dilakukan pada file baru atau berubah.
