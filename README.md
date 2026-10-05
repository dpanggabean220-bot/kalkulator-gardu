# Kalkulator Teknik Gardu Induk

Kumpulan kalkulator teknik untuk teknisi gardu induk, teknisi transmisi, dan mahasiswa teknik elektro. Semua perhitungan berjalan langsung di browser, tanpa server, tanpa login, dan tanpa instalasi.

**Buka aplikasi:** https://dpanggabean220-bot.github.io/kalkulator-gardu/

## Daftar kalkulator

| No | Kalkulator | Keterangan | Status |
|---|---|---|---|
| 1 | Arus nominal 3 fasa | Dari daya (MVA) dan tegangan (kV) | ✅ |
| 2 | Segitiga daya | P, Q, S, cos φ, sifat beban lagging/leading | ✅ |
| 3 | Persentase pembebanan trafo | Mode MVA, MW + MVAR, atau arus | ✅ |
| 4 | Tegangan per posisi tap | Tegangan nominal, posisi tap, step (%) | ✅ |
| 5 | Kapasitor perbaikan cos φ | Kebutuhan MVAR dari cos φ awal ke cos φ target | ✅ |
| 6 | Arus hubung singkat dari MVA hubung singkat | Hasil dalam kA | ✅ |
| 7 | Arus hubung singkat di terminal trafo | Dari rating trafo dan impedansi (%), hasil dalam kA | ✅ |
| 8 | Arus sekunder CT dan burden | Panjang dan penampang kabel, rating burden | ✅ |
| 9 | Waktu kerja relay OCR | Kurva IEC 60255: Standard, Very, Extremely Inverse | ✅ |
| 10 | Cek grading margin dua relay OCR | | 🚧 Direncanakan |
| 11 | Estimasi lokasi gangguan | Metode impedansi atau reaktansi, jarak dari kedua ujung | ✅ |
| 12 | Drop tegangan saluran 3 fasa | Dengan R, X, dan cos φ beban | ✅ |
| 13 | Rugi daya saluran | Satuan otomatis W / kW / MW | ✅ |
| 14 | Andongan konduktor | | 🚧 Direncanakan |
| 15 | Indeks polarisasi (PI) dan rasio absorpsi dielektrik (DAR) | Hasil uji tahanan isolasi | ✅ |
| 16 | Koreksi tekanan SF6 ke 20 °C | Tekanan absolut atau relatif, cek terhadap batas | ✅ |
| 17 | Konversi per-unit | | 🚧 Direncanakan |
| 18 | Konversi satuan | | ✅ |

## Cara pakai

**Online:** buka tautan di atas dari HP atau komputer.

**Offline:** unduh repositori (tombol **Code → Download ZIP**), ekstrak, lalu buka `index.html` langsung di browser. Aplikasi sengaja dibuat bisa berjalan lewat `file://` tanpa server.

Angka ditulis dengan format Indonesia: koma sebagai desimal (contoh: `0,85`).

## Batasan dan catatan penting

- Kalkulator ini adalah alat bantu hitung dan sarana belajar. Hasilnya **bukan pengganti** standar, manual pabrikan, atau prosedur resmi di tempat kerja. Untuk keputusan operasi dan pemeliharaan, selalu verifikasi dengan acuan resmi.
- Aplikasi tidak memuat ambang batas internal perusahaan mana pun. Nilai batas (misalnya batas tekanan SF6) diisi sendiri oleh pengguna sesuai data peralatan.
- Koreksi tekanan SF6 memakai pendekatan gas ideal. Hasilnya bisa sedikit berbeda dari kurva isokhorik pabrikan, terutama jika pembacaan dekat dengan batas alarm.
- Waktu kerja relay OCR dihitung dari persamaan kurva IEC 60255. Waktu operasi relay nyata dipengaruhi juga oleh toleransi relay dan waktu buka PMT.

## Untuk pengembang

Prasyarat: [Node.js](https://nodejs.org/) versi 18 atau lebih baru (hanya untuk menjalankan test).

```
kalkulator-gardu/
├── index.html           # halaman utama dan navigasi
├── css/style.css        # tampilan
├── js/rumus.js          # semua rumus, berupa fungsi murni
├── js/ui.js             # logika tampilan dan validasi input
└── tests/rumus.test.js  # unit test
```

Menjalankan test:

```bash
node --test tests/rumus.test.js
```

Prinsip pengembangan:

- Semua rumus berada di `js/rumus.js` sebagai fungsi murni, terpisah dari tampilan.
- Tanpa ES module dan tanpa dependensi eksternal, agar tetap jalan lewat `file://`.
- Setiap rumus punya **kasus uji pembeda**: nilai uji dipilih supaya rumus yang salah (misalnya terbalik, atau salah acuan absolut/relatif) pasti gagal test.
- Pesan error tampil di dekat kolom input, tanpa `alert()`.

## Masukan

Temukan hasil yang salah atau punya ide kalkulator baru? Silakan buka [Issue](https://github.com/dpanggabean220-bot/kalkulator-gardu/issues) dan sertakan input, hasil yang muncul, serta hasil yang Anda harapkan.

---

Dibangun dengan bantuan Claude Code. Setiap rumus diverifikasi manual dan diuji dengan unit test.
