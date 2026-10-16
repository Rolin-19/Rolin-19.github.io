# Folder assets

Tempat berkas gambar situs. Sekarang berisi `foto.jpg`, yaitu foto profil yang
tampil di beranda.

## Foto profil

Berkasnya sudah terpasang sebagai **`foto.jpg`**:

```
assets/foto.jpg
```

Sampai situ saja, tidak ada berkas lain yang perlu diubah. Saat halaman dibuka,
foto itu otomatis menggantikan kotak inisial "RS" di beranda, di halaman
Indonesia maupun Inggris. Kalau berkasnya dihapus, kotak "RS" muncul lagi.

Kalau mau menggantinya:

- **bentuk tegak 4:5** — misalnya 640 × 800 piksel. Kotak di halaman juga 4:5,
  jadi seluruh foto tampil utuh tanpa dipotong,
- ukuran berkas di bawah 200 KB,
- format JPG.

Folder ini juga berguna kalau nanti mau menambah gambar lain, misalnya tangkapan
layar project.

## Catatan

Selama `foto.jpg` belum ada, browser akan mencatat satu pesan
`404 (File not found)` untuk berkas ini di panel Console. Itu wajar: halaman
memang mengecek dulu apakah fotonya sudah ada. Pesan itu hilang sendiri begitu
`foto.jpg` diunggah.
