# Portofolio — Rolin Stallin

Situs portofolio satu halaman: profil singkat, katalog tiga project, dan kontak.
Dibuat dari HTML + CSS murni, tanpa framework dan tanpa proses build — tinggal
di-host di GitHub Pages.

## Isi Halaman

| Bagian | Tentang |
|---|---|
| **Beranda** | Perkenalan singkat |
| **Project** | Tiga project dengan deskripsi, teknologi, dan tautan |
| **Kontak** | LinkedIn dan GitHub |

## Project yang Ditampilkan

1. **Rekomendasi Film** — katalog 36 film dalam 6 genre; terminal Python,
   65 unit test, plus katalog web.
   [Demo](https://rolin-data.github.io/Project-Protofolio-Kecil/) ·
   [Kode](https://github.com/Rolin-data/Project-Protofolio-Kecil)

2. **Rekomendasi Kuliner Indonesia** — catatan kuliner berbasis terminal;
   datanya disimpan di `data_kuliner.json`, bukan ditanam di dalam kode.
   [Demo](https://rolin-data.github.io/Rekomendasi-Kuliner-Di-Indonesia/) ·
   [Kode](https://github.com/Rolin-data/Rekomendasi-Kuliner-Di-Indonesia)

3. **Biodiversity in National Parks** — analisis data National Park Service
   soal status konservasi spesies di empat taman nasional.
   [Kode](https://github.com/makiootol-bit/biodiversity-national-parks)

## Menjalankan Lokal

Buka langsung `index.html` di browser, atau jalankan server statis apa pun:

```powershell
python -m http.server 8100
```

lalu buka `http://127.0.0.1:8100`.

## Struktur

```
.
├── index.html     # satu halaman: beranda, project, kontak
└── styles.css     # seluruh gaya, termasuk media query 768px
```

## Mengganti Isi

- **Foto profil** — buat folder `assets/`, taruh fotonya sebagai
  `assets/foto.jpg`, lalu di `index.html` ganti
  `<div class="foto-awal">RS</div>` dengan
  `<img src="assets/foto.jpg" alt="Foto profil Rolin Stallin">`.
- **Proyek** — tambah/kurangi blok `<article class="kartu">` di bagian
  `#project`.
- **Warna aksen** — nilai `rgb(69, 160, 239)` dan `rgb(58, 123, 189)`
  di `styles.css`.
