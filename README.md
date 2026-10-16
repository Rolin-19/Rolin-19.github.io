# Portofolio — Rolin Stallin Sitorus

Situs portofolio berbahasa Indonesia: satu halaman beranda berisi profil, riwayat
kerja, keahlian, proyek, dan kontak, ditambah empat halaman studi kasus untuk tiap
proyek. Ditulis dengan HTML, CSS, dan sedikit JavaScript, tanpa framework dan tanpa
proses build, jadi bisa langsung di-host di GitHub Pages.

## Isi Halaman

**Beranda** (`index.html`):

| Bagian | Tentang |
|---|---|
| Beranda | Perkenalan singkat dan ringkasan posisi |
| Tentang | Perjalanan kerja dan alasan berpindah ke analisis data |
| Pengalaman | Lima perusahaan, tiap jabatan punya keterangannya sendiri |
| Proyek | Empat proyek, masing-masing tertaut ke halaman studi kasusnya |
| Keahlian | Keahlian, pendidikan, dan sertifikat |
| Kontak | Email, LinkedIn, GitHub, lokasi |

**Studi kasus** (`proyek/`): VISOP, Biodiversity in National Parks, Rekomendasi
Film, dan Rekomendasi Kuliner Indonesia. Tiap halaman menjelaskan pertanyaan atau
tujuan, data yang dipakai, cara pengerjaan, hasilnya, dan batasannya.

## Yang Sengaja Tidak Ditampilkan

Tautan demo tidak dipasang di halaman ini. Yang dipasang hanya tautan Kode ke repositori
GitHub, ada di kartu tiap proyek di beranda dan di bagian atas halaman studi kasus.

Tautan kode tiap proyek:

| Proyek | Repositori |
|---|---|
| Biodiversity in National Parks | `github.com/makiootol-bit/biodiversity-national-parks` |
| Rekomendasi Film | `github.com/Rolin-data/Project-Protofolio-Kecil` |
| Rekomendasi Kuliner Indonesia | `github.com/Rolin-data/Rekomendasi-Kuliner-Di-Indonesia` |

Uraian VISOP juga masih terbatas. Aplikasinya dipakai internal perusahaan, jadi kode dan
tangkapan layarnya tidak ditampilkan. Halamannya hanya memuat yang sudah pasti:
peran, periode, alat (Google Apps Script), dan statusnya di kompetisi.

## Tampilan

Konsepnya corporate yang rapi dengan sentuhan teknologi: tema terang, warna biru
sebagai aksen saja, dan Inter sebagai satu-satunya keluarga font. Ukuran yang dipakai
mengikuti rancangan berikut.

| Komponen | Desktop | Ponsel |
|---|---|---|
| Lebar maksimum | 1120 px | lebar layar, margin 20 px |
| Judul hero | 38–58 px | 38 px |
| Teks isi | 17 px | 17 px |
| Jarak antar seksi | 96 px | 64 px |
| Grid proyek | 2 kolom | 1 kolom |
| Radius kartu | 14 px | 14 px |
| Tinggi tombol | 48 px | 48 px |

Tombol menu di bawah lebar 860 px memakai JavaScript kecil dengan `aria-expanded`.
Animasi hanya berupa perubahan warna dan angkat kotak saat disorot, dan seluruhnya
dihentikan bila pengguna mengaktifkan `prefers-reduced-motion`.

Sudah diuji: 100 untuk aksesibilitas, praktik terbaik, dan SEO di Lighthouse untuk
kelima halaman; tidak ada gulir horizontal dari lebar 305 px sampai 1440 px.

Font Inter dimuat dari Google Fonts lewat `<link>` dengan `preconnect`, bukan
`@import`, supaya tidak menghambat render.

## Berkas Lama

`en.html` dan `styles.css` adalah versi sebelumnya yang sudah bergaya editorial
"kertas" dengan dua bahasa. Keduanya masih utuh tetapi tidak lagi ditautkan dari
beranda. `en.html` memakai `styles.css`, bukan `gaya.css`.

## Menjalankan Lokal

```powershell
python -m http.server 8100
```

lalu buka `http://127.0.0.1:8100`.

## Struktur

```
.
├── index.html        # beranda Indonesia
├── gaya.css          # seluruh gaya halaman baru
├── proyek/           # empat halaman studi kasus
├── assets/
│   ├── foto.jpg      # foto profil, rasio 4:5
│   ├── chart1.png    # grafik proporsi spesies dilindungi
│   ├── chart2.png    # grafik total observasi per taman
│   └── favicon.ico
├── en.html           # versi Inggris lama, tidak ditautkan
├── styles.css        # gaya versi lama
├── .gitignore
└── README.md
```

## Mengganti Isi

- **Foto profil** — ganti `assets/foto.jpg`, rasio tegak 4:5 seperti 640 × 800
  piksel. Tidak ada HTML yang perlu diubah.
- **Tangkapan layar proyek** — kartu VISOP, Rekomendasi Film, dan Rekomendasi
  Kuliner masih memakai kotak polos bergaris dengan singkatan nama proyek di dalam
  `.kartu-gambar`. Kotak itu sengaja dibuat netral, bukan tiruan tampilan aplikasi.
  Untuk menggantinya dengan tangkapan layar asli, hapus `.panel-netral` lalu
  masukkan `<img src="../assets/…">` yang sama seperti di kartu Biodiversity.
- **Warna dan font** — semuanya variabel di bagian atas `gaya.css` (`--dasar`,
  `--navy`, `--biru`, `--slate`, `--garis`, `--lebar`, `--radius`, `--font`).
  Ubah di situ, seluruh halaman ikut berubah.
- **Tambah proyek** — salin satu blok `<a class="kartu-proyek">` di bagian `#proyek`
  `index.html`, lalu buat halaman studi kasus baru di `proyek/` dengan menyalin
  halaman yang sudah ada.
