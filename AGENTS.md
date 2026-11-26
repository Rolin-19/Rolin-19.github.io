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
- UX mobile Rolin AI: `.rolin-chat-input` WAJIB `font-size: 16px` agar Chrome Android/iOS Safari tidak auto-zoom saat fokus.
- `.rolin-chat-panel` WAJIB `display: none; pointer-events: none;` di SEMUA breakpoint saat tidak berclass `.terbuka`; hanya `.rolin-chat-panel.terbuka` yang boleh `display: flex; pointer-events: auto;` (dilarang panel transparat `opacity: 0` yang menutup klik).
- `.rolin-chat` dilarang memakai `contain: layout paint`; wajib `contain: none; z-index: 9999; pointer-events: auto;`, dan `.rolin-chat-toggle` wajib `position: relative; z-index: 10001; cursor: pointer; pointer-events: auto;` agar klik mouse/sentuh tidak tertutup footer, back-to-top, atau pseudo-element. Saat panel terbuka, `.rolin-chat-panel.terbuka` wajib `z-index: 10002` agar tidak tertutup toggle yang tumpang tindih di mobile.
- Panel mobile WAJIB tetap `display: none` sampai berclass `.terbuka`; `display: flex` hanya boleh pada `.rolin-chat-panel.terbuka` agar tombol pemicu tidak tertutup panel.
- `index.html` dan `en/index.html` WAJIB memakai `<meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content">`.
- `assets/chat.js` WAJIB menyinkronkan `.rolin-chat-panel` dengan `window.visualViewport` (`resize` dan `scroll`) pada layar `<= 768px`: hitung inset keyboard dari `innerHeight - (visualViewport.height + visualViewport.offsetTop)`, lalu set `bottom`/`maxHeight` inline agar input tetap di atas keyboard; reset inline style saat keyboard tutup atau panel ditutup.
- Dilarang auto-focus paksa di perangkat `pointer: coarse` maupun layar `<= 768px`; `input.focus()` hanya untuk desktop. Tombol Kirim memakai listener `pointerdown`/`mousedown` dengan `preventDefault()` agar ketukan pertama tidak menurunkan keyboard.

## Keamanan & Verifikasi Wajib
- Dilarang menuliskan API key/token (`GROQ_API_KEY`, `CLOUDFLARE_API_TOKEN`) di kode atau commit `.env`.
- Sebelum dan sesudah `git push`: jalankan `node --check` pada seluruh `.js`, serta uji `curl` ke endpoint live Pages Function (OPTIONS 204, POST `{"messages":[]}` 400, POST pesan valid 200).

## Riwayat Checkpoint
- `v1.0-floating-chat-stable` (tag anotasi) → commit `88891f7`, aset `?v=34ac67a1`. Checkpoint permanen floating chat Rolin AI stabil di desktop `1366×768`, tablet `768×1024`, dan mobile `390×844`; status lokal/remote terverifikasi (`refs/tags/v1.0-floating-chat-stable`). Jika eksperimen redesign gagal, titik kembali wajib tag ini.
- `mobile-working-b164a8e` → commit `b164a8e`, titik aman perilaku mobile sebelum perbaikan klik desktop.