# AGENTS.md — Aturan Permanen Repository Portofolio Rolin

## Mode Non-Interaktif (Anti-Blokir CLI)
- Dilarang menjalankan perintah interaktif yang menahan terminal (`npx wrangler login`, `git commit` tanpa `-m`, CLI tanpa `--yes`/`-y`).
- Sebelum deploy lokal, cek autentikasi secara non-interaktif (`npx wrangler whoami` atau env `CLOUDFLARE_API_TOKEN`). Jika tidak tersedia, cukup `git push` agar GitHub Actions yang men-deploy, dan beri catatan singkat tanpa menghentikan proses lain.

## Arsitektur Backend & Anti-Blokir Browser (Rolin AI)
- Frontend (`assets/chat.js`) WAJIB memanggil endpoint Cloudflare Pages Function (`functions/chat.js`). DILARANG mengarah langsung ke subdomain dua tingkat `*.workers.dev`.
- Setiap jalur respons di `functions/chat.js` (200, 4xx/5xx, 204 preflight OPTIONS) WAJIB menyertakan `Access-Control-Allow-Origin: https://rolin-19.github.io` dan `Vary: Origin`.
- Di `worker/src/index.js`, validasi `clean.length === 0` dan `role !== "user"` WAJIB dieksekusi sebelum mengakses properti indeks array terakhir.

## Standar Frontend, Mobile UI & Cache GitHub Pages
- Toggle buka/tutup panel chat ditangani oleh `onclick` inline di HTML; `input.focus()` (jeda 100ms) dan sinkronisasi ARIA HANYA di `assets/chat.js` (dilarang menggandakan `focus()` di HTML).
- Gunakan satuan `dvh` pada kontainer chat mobile dan HTML entity `&times;` (bukan karakter mentah) untuk tombol tutup di `index.html` dan `en/index.html`.
- Setiap kali mengubah file `.css`/`.js`, perbarui `?v=<short-hash>` secara konsisten di `index.html`, `en/index.html`, dan seluruh `proyek/*.html`.

## Keamanan & Verifikasi Wajib
- Dilarang menuliskan API key/token (`GROQ_API_KEY`, `CLOUDFLARE_API_TOKEN`) di kode atau commit `.env`.
- Sebelum dan sesudah `git push`: jalankan `node --check` pada seluruh `.js`, serta uji `curl` ke endpoint live Pages Function (OPTIONS 204, POST `{"messages":[]}` 400, POST pesan valid 200).