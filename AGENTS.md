# AGENTS.md — Aturan Permanen Repository Portofolio Rolin

## Mode Non-Interaktif (Anti-Blokir CLI)
- Dilarang menjalankan perintah interaktif yang menahan terminal (`npx wrangler login`, `git commit` tanpa `-m`, CLI tanpa `--yes`/`-y`).
- Sebelum deploy lokal, cek autentikasi secara non-interaktif (`npx wrangler whoami` atau env `CLOUDFLARE_API_TOKEN`). Jika tidak tersedia, cukup `git push` agar GitHub Actions yang men-deploy, dan beri catatan singkat tanpa menghentikan proses lain.

## Arsitektur Backend & Anti-Blokir Browser (Rolin AI)
- Frontend (`assets/ai-cari.js`) WAJIB memanggil endpoint Cloudflare Pages Function (`functions/chat.js`). DILARANG mengarah langsung ke subdomain dua tingkat `*.workers.dev`.
- Setiap jalur respons di `functions/chat.js` (200, 4xx/5xx, 204 preflight OPTIONS) WAJIB menyertakan `Access-Control-Allow-Origin: https://rolin-19.github.io` dan `Vary: Origin`.
- Di `worker/src/index.js`, validasi `clean.length === 0` dan `role !== "user"` WAJIB dieksekusi sebelum mengakses properti indeks array terakhir.

## Standar Frontend, Mobile UI & Cache GitHub Pages
- Widget melayang `.rolin-chat` sudah dihapus dari seluruh HTML. Komponen aktif adalah blok inline `.ai-cari` di `index.html` dan `en/index.html`, ditempatkan setelah `.hero` sebelum seksi `01`/`ABOUT`, tanpa `.label-seksi > .nomor` agar penomoran `01`–`05` tetap utuh.
- `.ai-cari-kartu` WAJIB `hidden` / `display:none` saat awal dimuat; hanya ditampilkan setelah submit form atau klik `.ai-cari-chip`, dan disembunyikan lagi oleh `.ai-cari-tutup` memakai `&times;`.
- `.ai-cari-input` WAJIB `font-size: 16px` agar Chrome Android/iOS Safari tidak auto-zoom saat fokus. `index.html` dan `en/index.html` WAJIB memakai `<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">`.
- `assets/ai-cari.js` WAJIB merender jawaban memakai `document.createElement` + `textContent` (DILARANG `innerHTML`) dan menampilkan chip sumber dari daftar tetap yang memetakan kata kunci ke `#pengalaman`/`#experience`, `proyek/visop.html`/`../proyek/visop.html`, `#proyek`/`#projects`, `#keahlian`/`#skills`, `#kontak`/`#contact`.
- Status loading WAJIB memakai teks `Merangkum isi portofolio...` / `Summarizing portfolio...`. Jangan auto-focus paksa di perangkat `pointer: coarse`; fokus hanya boleh terjadi sebagai akibat klik pengguna.
- `worker/src/index.js` WAJIB berperilaku sebagai mesin pencari/perangkum AI Overview dengan sumber data tertutup, menolak topik di luar portofolio dalam 1 kalimat, mengikuti bahasa pertanyaan, dan tanpa basa-basi obrolan. Guard `clean.length === 0` tetap di urutan paling awal.
- Setiap kali mengubah `.css`/`.js`, hitung `?v=<short-hash>` dari bytes `gaya.css` + `assets/ai-cari.js` (8 hex SHA-256 pertama) lalu perbarui secara konsisten di `index.html`, `en/index.html`, dan seluruh `proyek/*.html` / `en/*.html`. `assets/chat.js` adalah arsip dari tag `v1.0-floating-chat-stable` dan tidak direferensikan.

## Halaman CV ATS Terpisah
- `cv.html` (ID) dan `en/cv.html` (EN) adalah dokumen ATS mandiri, bukan halaman web portofolio. Dilarang memakai header navigasi web, footer web, kartu bayangan, multi-kolom, tabel, grafik skill, foto, atau emoji.
- Keduanya wajib satu kolom, `font-family: Calibri, Arial, sans-serif`, teks hitam di atas putih, dan `@page { size: A4; margin: 14mm 16mm; }`. `.cv-toolbar` hanya untuk layar dan wajib `display: none !important;` di `@media print`; tombolnya memanggil `window.print()`.
- Isi wajib faktual sesuai `index.html`/`en/index.html`. Dilarang memakai klise AI: *berdedicasi tinggi, visioner, dinamis, inovatif terdepan, sinergi, mengoptimalkan secara holistik, passionate, cutting-edge, dynamic, spearheaded, leveraging, results-driven*.
- Tautan CV di `.tombol-baris` hero memakai kelas tombol sekunder yang sudah ada (`tombol tombol-garis`) dengan `target="_blank" rel="noopener"`; ditambahkan pula di `.daftar-kontak` seksi `05`/`05`. Struktur, ID, dan penomoran `01`–`05`, serta blok `.ai-cari`, tidak boleh diubah.
- `worker/src/index.js` wajib mengetahui `https://rolin-19.github.io/cv.html` dan `https://rolin-19.github.io/en/cv.html`; jika ditanya CV/resume, jawaban menyertakan tautan yang cocok bahasanya.

## Keamanan & Verifikasi Wajib
- Dilarang menuliskan API key/token (`GROQ_API_KEY`, `CLOUDFLARE_API_TOKEN`) di kode atau commit `.env`.
- Sebelum dan sesudah `git push`: jalankan `node --check` pada seluruh `.js`, serta uji `curl` ke endpoint live Pages Function (OPTIONS 204, POST `{"messages":[]}` 400, POST pesan valid 200).

## Komponen Aktif yang Wajib Dijaga
- Pencarian `.ai-cari` di `index.html`/`en/index.html` beserta `assets/ai-cari.js`: struktur, ID, chips, kartu tersembunyi default, dan rendering aman `document.createElement` + `textContent` tidak boleh diubah tanpa keperluan eksplisit.
- Worker `worker/src/index.js`: prompt AI Overview bersumber tertutup, direktif bahasa, penolakan 1 kalimat untuk topik luar portofolio, URL CV ID/EN, dan guard `clean.length === 0` di urutan paling awal wajib dipertahankan.
- `cv.html` dan `en/cv.html`: halaman ATS satu kolom polos, bebas tabel, bebas elemen dekoratif, bebas *AI slop*; `.cv-toolbar` hanya untuk layar dan hilang saat cetak.

## Riwayat Checkpoint
- `v2.0-ai-overview-and-ats-cv-stable` (tag anotasi) → commit `1055953`, aset `?v=85cd4251`. Checkpoint permanen portofolio dengan AI Overview gaya Google dan halaman CV ATS anti-slop ID/EN; status lokal/remote terverifikasi (`refs/tags/v2.0-ai-overview-and-ats-cv-stable`). Tag mengunci commit `1055953`; commit dokumentasi `AGENTS.md` setelahnya tidak memindahkan tag.
- `v1.0-floating-chat-stable` (tag anotasi) → commit `88891f7`, aset `?v=34ac67a1`. Checkpoint permanen floating chat Rolin AI stabil di desktop `1366×768`, tablet `768×1024`, dan mobile `390×844`; status lokal/remote terverifikasi (`refs/tags/v1.0-floating-chat-stable`). Tag cadangan tetap dipertahankan sebagai titik kembali lama.
- `mobile-working-b164a8e` → commit `b164a8e`, titik aman perilaku mobile sebelum perbaikan klik desktop.