# Panduan Development Frontend Learning Media

Dokumen ini menjadi acuan frontend agar implementasi berikutnya konsisten dengan mockup HTML terbaru.

## File Utama

- Project root: `C:\Users\ASUS\Documents\Learning media 2`
- Mockup utama: `index.html`
- Materi utama: `materi/knowledge`
- Resource tambahan: `materi/resource`

## Technology Stack yang Digunakan

Stack berikut adalah stack yang digunakan langsung pada mockup frontend saat ini.

| Area frontend | Teknologi | Penggunaan |
| --- | --- | --- |
| Runtime | Static HTML5 single page | Aplikasi mockup berjalan langsung dari `index.html` melalui browser. |
| Styling | Tailwind CSS via CDN | Utility class untuk layout, spacing, warna, grid, tab, tombol, card, dan responsivitas. |
| Custom UI CSS | CSS internal di `<style>` | Player 16:9/responsive, PDF fit page, sidebar timeline, floating panel, volume popover, image/PDF zoom toolbar. |
| Icon | Font Awesome via CDN | Icon tab, player, resource, FAQ, chatbot, download, zoom, timeline, dan status. |
| Logic | Vanilla JavaScript | Sequential tab, quiz, progress, player controls, search, assignment grading mock, FAQ, chatbot mock, dan analytics mock. |
| State | Browser `localStorage` | Menyimpan progress learner, active view, current slide, quiz answers, scores, assignment draft/submission, dan video completion. |
| PDF rendering | Native browser PDF viewer dalam `iframe` | Menampilkan PDF per halaman dengan `page`, `view=Fit`, `zoom=page-fit`, dan custom PDF zoom toolbar. |
| Video rendering | HTML5 `<video>` | Autoplay, play/pause, skip 10s, seek, duration, volume 30% default, dan vertical volume slider. |
| Image rendering | Native `<img>` | Image viewer dengan zoom in/out, slider zoom, persentase, dan fit/reset. |
| File/resource access | Local file path via `file:///` | Mengakses materi dari `materi/knowledge` dan `materi/resource` pada mockup lokal. |
| Assignment sample | Markdown file | `mockup_jawaban_assignment_kepabeanan.md` digunakan untuk uji upload/grading mock. |

Untuk production, stack ini dapat dimigrasikan ke React + TypeScript + Vite, tetapi perilaku UI di atas tetap menjadi baseline fungsional.

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
- Jika backend menyediakan `pageAspectRatio`, gunakan nilai tersebut. Untuk materi saat ini, rasio halaman PDF landscape adalah sekitar `1.775`.
- Hindari scrolling PDF internal sebagai perilaku utama.
- Toolbar PDF wajib menyediakan zoom out, slider zoom, indikator persentase, zoom in, dan tombol fit.

### Video

- Video memakai HTML5 video.
- Video mencoba autoplay dengan volume default 30% dan `playsinline`; jika browser menolak autoplay bersuara, player dapat fallback ke muted autoplay.
- Player menyediakan play/pause, seek slider, durasi, dan skip mundur/maju.
- Slider volume tampil sebagai popover di dalam frame player saat tombol volume diklik.
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
- Feedback assignment pada mockup membaca kata kunci jawaban/file, jumlah kata, dan lampiran untuk menyesuaikan skor dan catatan rubrik.

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
