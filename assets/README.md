# Folder assets

Tempat berkas gambar dan ikon situs.

## Daftar berkas

| Berkas | Isi | Dipakai di |
|---|---|---|
| `foto.jpg` | Foto profil, rasio tegak 4:5 | Beranda |
| `visop.jpg` | Tangkapan layar VISOP, halaman verifikasi ID karyawan | Beranda + `proyek/visop.html` |
| `rekomendasi-film.jpg` | Tangkapan layar versi web Rekomendasi Film | Beranda + `proyek/rekomendasi-film.html` |
| `rekomendasi-kuliner.jpg` | Tangkapan layar versi web Rekomendasi Kuliner | Beranda + `proyek/rekomendasi-kuliner.html` |
| `chart1.png` | Grafik persentase spesies dilindungi per kategori | Beranda + `proyek/biodiversity.html` |
| `chart2.png` | Grafik total observasi per taman nasional | `proyek/biodiversity.html` |
| `favicon.ico` | Ikon tab browser | Semua halaman |

## Mengganti gambar

Semua gambar cukup **ditimpa** dengan berkas bernama sama; tidak ada HTML yang perlu
diubah, karena tiap `<img>` sudah punya `width` dan `height` yang sesuai.

**Foto profil** (`foto.jpg`):

- bentuk tegak 4:5 — misalnya 640 × 800 piksel. Kotak di halaman juga 4:5, jadi
  seluruh foto tampil utuh tanpa dipotong,
- ukuran berkas di bawah 200 KB,
- format JPG.

**Tangkapan layar proyek** — pakai rasio mendatar sekitar 16:10 (misalnya
1120 × 700 piksel). Di kartu beranda gambar dipotong mengikuti kotak
(`object-fit: cover`), sementara di halaman studi kasus tampil utuh.
