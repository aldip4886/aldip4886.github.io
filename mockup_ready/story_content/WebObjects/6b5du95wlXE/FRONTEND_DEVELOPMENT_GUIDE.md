# Panduan Development Frontend Learning Media

Dokumen ini menjadi acuan frontend agar implementasi berikutnya konsisten dengan mockup HTML terbaru.

## File Utama

- Project root: `C:\Users\ASUS\Documents\Learning media 2`
- Mockup utama: `mockup_learning_media_perdagangan_internasional_djbc.html`
- Materi utama: `materi/knowledge`
- Resource tambahan: `materi/resource`

## Alur dan Navigasi

Alur peserta bersifat sequential:

1. Diagnostik Test
2. Materi Pembelajaran
3. Assignment
4. Tryout Uji Kompetensi
5. Feedback

Tab berikutnya hanya aktif setelah aktivitas sebelumnya selesai. Tab Overview tidak digunakan lagi pada pengalaman peserta.

## Layout Utama

- Gunakan layout responsive.
- Pada desktop, konten utama dan sidebar timeline ditampilkan dalam grid dua kolom.
- Sidebar timeline harus ringkas agar toolbar player pada modul pembelajaran tetap cukup lebar dan dapat tampil dalam satu baris.
- Pada layar kecil, timeline turun ke bawah konten utama.

## Timeline Progress

Timeline kanan menampilkan:

- Nama fase.
- Status fase: terkunci, tersedia, aktif, selesai.
- Metrik ringkas: nilai diagnostik, persentase materi, nilai assignment, nilai tryout, status feedback.
- Total progress keseluruhan.

Komponen timeline harus membaca state progress, bukan menyalin status dari label tab.

## Materi Pembelajaran

Materi dibaca dari folder `materi/knowledge` dan disusun ascending berdasarkan nama file.

### PDF

- PDF ditampilkan per halaman.
- Default display adalah `fit to page`.
- Satu halaman harus terlihat penuh dan proporsional.
- Frame PDF harus mempertahankan aspect ratio halaman.
- Jika backend menyediakan `pageAspectRatio`, gunakan nilai tersebut. Jika belum tersedia, gunakan default portrait PDF `0.707`.
- Hindari scrolling PDF internal sebagai perilaku utama.

### Video

- Video memakai HTML5 video.
- Video harus autoplay dalam kondisi `muted` dan `playsinline`.
- Player menyediakan play/pause, seek slider, durasi, dan skip mundur/maju.
- Tombol skip menggunakan ikon double-chevron dan label durasi, misalnya `10s`.
- Jika sequential enforcement aktif, seek slider dikunci sampai video pernah ditonton tuntas.

### Gambar

Image viewer wajib menyediakan:

- Zoom in.
- Zoom out.
- Slider level zoom.
- Indikator persentase zoom.
- Fit/reset.

## Resource, FAQ, Search, Chatbot

- Tombol resource, FAQ, chatbot, dan deep search memakai sidebar/panel kanan pada area player.
- Resource berasal dari `materi/resource`.
- Semua file knowledge dan resource harus masuk korpus FAQ, deep text search, dan RAG chatbot.

## Assignment

- Nama tab adalah `Assignment`.
- Konten assignment tetap berisi soal, editor HTML, upload file, rubrik, submit, konfirmasi, dan feedback AI powered grading.
- Setelah submit dan konfirmasi, feedback assignment menggantikan isi assignment.

## State dan Persistence

Frontend perlu menyimpan state berikut ke local storage atau backend:

- Active view.
- Current slide/page.
- Completed PDF/image slide.
- Video completion per file.
- Jawaban diagnostik dan tryout.
- Score diagnostik, assignment, tryout.
- Assignment draft dan submission status.

Pada production, state lokal perlu disinkronkan dengan backend dan SCORM runtime.

## Analytics Event Frontend

Event minimal:

- `view_changed`
- `material_opened`
- `pdf_page_viewed`
- `image_zoom_changed`
- `video_autoplay_started`
- `video_play`
- `video_pause`
- `video_skip`
- `video_completed`
- `quiz_answered`
- `quiz_submitted`
- `assignment_submitted`
- `feedback_opened`

Payload event harus menyertakan `moduleId`, `learnerId`, `sessionId`, `timestamp`, dan metadata konten terkait.
