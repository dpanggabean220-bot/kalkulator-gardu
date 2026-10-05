# Proyek: Kalkulator Teknik Gardu Induk

## Tujuan
Web app berisi kumpulan kalkulator untuk teknisi gardu induk, teknisi
transmisi, dan mahasiswa teknik elektro. Semua hitungan berjalan di browser,
tanpa server dan tanpa login. Harus bisa dibuka dengan dobel klik `index.html`
(protokol file://), dan nyaman dipakai di HP.

## Struktur folder (wajib diikuti)
```
kalkulator/
├── CLAUDE.md
├── README.md           # halaman depan repositori
├── index.html          # halaman utama + navigasi antar kalkulator
├── css/style.css       # semua gaya tampilan
├── js/rumus.js         # SEMUA rumus, fungsi murni, tanpa akses DOM
├── js/ui.js            # logika tampilan: baca input, panggil rumus, tampilkan hasil
└── tests/rumus.test.js # unit test untuk setiap fungsi di rumus.js
```

## Aturan teknis
- Jangan pakai ES module (`import`/`export`). Modul tidak jalan lewat file://.
  `rumus.js` mendefinisikan satu objek global `Rumus`, lalu di akhir file:
  `if (typeof module !== "undefined") module.exports = Rumus;`
  supaya bisa diuji dengan Node.
- Muat script di `index.html` dengan `<script src="js/rumus.js"></script>`
  lalu `<script src="js/ui.js"></script>`.
- Tanpa library eksternal dan tanpa CDN. Harus jalan offline.
- Test memakai test runner bawaan Node: `node --test tests/rumus.test.js`
  (pakai `require`, `node:test`, dan `node:assert`).
- Fungsi di `rumus.js` menerima angka dan mengembalikan angka atau objek.
  Kalau input tidak valid, lempar `Error` dengan pesan Bahasa Indonesia.
- Tampilan responsif: satu kolom di HP, grid di layar lebar.

## Aturan tampilan dan bahasa
- Semua teks, label, dan pesan error dalam Bahasa Indonesia.
- Setiap input dan hasil wajib mencantumkan satuan (A, kA, kV, MVA, MW, MVAR, Ω, km, s, MPa, °C).
- Format angka Indonesia: `toLocaleString("id-ID")`, koma sebagai desimal.
- Setiap kalkulator menampilkan rumus yang dipakai di bawah hasilnya.
- Validasi semua input: tolak kosong, nol, dan negatif jika tidak masuk akal,
  cos φ di luar 0 sampai 1, dan persen di luar rentang wajar.
  Tampilkan pesan error di dekat kolom yang salah, jangan pakai `alert()`.
- Footer wajib: "Hasil kalkulator ini untuk estimasi dan pembelajaran. Bukan
  pengganti setting proteksi resmi, standar, atau prosedur kerja yang berlaku."

## Larangan
- Jangan membuat file atau folder di luar struktur folder yang ditetapkan, termasuk catatan kerja. Catatan memori agen hanya boleh disimpan di folder memori bawaan Claude Code, bukan di folder proyek ini.
- Jangan masukkan nama, logo, data, atau dokumen PLN.
- Jangan menanamkan nilai batas dari SOP internal mana pun (misalnya ambang
  tekanan SF6 atau ambang tahanan isolasi). Kalau perlu nilai batas, sediakan
  kolom input agar pengguna mengisinya sendiri.
- Jangan mengubah rumus yang sudah lolos test tanpa diminta.

## Daftar kalkulator

### Tahap 1 (rumus sederhana, dipakai harian)
1. Arus nominal 3 fasa: I = S × 1000 / (√3 × V)
2. Segitiga daya: S = √(P² + Q²), cos φ = P / S
3. Persentase pembebanan trafo: % = S_ukur / S_rating × 100
6. Arus hubung singkat dari MVA hubung singkat: I_sc = MVA_sc × 1000 / (√3 × V)
7. Arus hubung singkat di terminal trafo: I_sc = I_nominal × 100 / Z%
8. Arus sekunder CT dan burden: I_sek = I_prim × (I_sek_rating / I_prim_rating);
   VA = I_sek² × R_total, dengan R_total = R_relay + R_kabel (kabel pulang-pergi)
18. Konversi satuan: kV↔V, kA↔A, MVA↔kVA, °C↔K

### Tahap 2 (paling bernilai)
4. Tegangan per posisi tap: V_tap = V_nominal × (1 + n × step% / 100)
5. Kapasitor perbaikan cos φ: Q_c = P × (tan φ₁ − tan φ₂)
9. Waktu kerja relay OCR, kurva IEC 60255: t = TMS × k / ((I / I_s)^α − 1)
   - Standard Inverse: k = 0,14; α = 0,02
   - Very Inverse: k = 13,5; α = 1
   - Extremely Inverse: k = 80; α = 2
   - Jika I / I_s ≤ 1, tampilkan "relay tidak bekerja".
11. Estimasi lokasi gangguan: jarak = Z_gangguan / Z_per_km (tampilkan juga
    persen terhadap panjang saluran)
12. Drop tegangan saluran 3 fasa: ΔV ≈ √3 × I × L × (R cos φ + X sin φ),
    R dan X dalam Ω/km, L dalam km; tampilkan juga persen terhadap V
13. Rugi daya saluran: P_loss = 3 × I² × R × L
15. Indeks polarisasi dan DAR: PI = R_10menit / R_1menit; DAR = R_60s / R_30s
16. Koreksi tekanan SF6 ke 20 °C: P₂₀ = P_ukur × 293,15 / (T + 273,15)
    - Input dan hitungan memakai tekanan ABSOLUT. Jika pengguna memasukkan
      tekanan relatif (gauge), tambahkan 0,1013 MPa sebelum menghitung.
    - Tampilkan catatan: "Pendekatan gas ideal. Acuan resmi tetap kurva
      koreksi dari pabrikan peralatan."

### Tahap 3 (lanjutan)
10. Cek grading margin dua relay OCR (pakai fungsi nomor 9)
14. Andongan konduktor: D = w × L² / (8 × T)
17. Konversi per-unit: Z_base = kV² / MVA; Z_pu = Z_ohm / Z_base

## Kasus uji wajib (test harus lolos dengan toleransi wajar)
| Kalkulator | Input | Hasil yang benar |
|---|---|---|
| 1 | 500 MVA, 275 kV | 1049,73 A |
| 1 | 500 MVA, 150 kV | 1924,50 A |
| 1 | 60 MVA, 20 kV | 1732,05 A |
| 2 | P = 80 MW, Q = 60 MVAR | S = 100 MVA, cos φ = 0,8 |
| 4 | 150 kV, tap +3, step 1,25% | 155,625 kV |
| 5 | P = 10 MW, cos φ 0,8 → 0,95 | Q_c ≈ 4,213 MVAR |
| 6 | 10000 MVA_sc, 150 kV | ≈ 38490 A |
| 7 | 60 MVA, 20 kV, Z = 12% | ≈ 14433,8 A |
| 9 | SI, TMS 0,1, I/I_s = 10 | ≈ 0,297 s |
| 9 | VI, TMS 0,1, I/I_s = 10 | 0,150 s |
| 9 | EI, TMS 0,1, I/I_s = 10 | ≈ 0,0808 s |
| 11 | Z_gangguan 4 Ω, 0,4 Ω/km | 10 km |
| 12 | I 200 A, L 10 km, R 0,1, X 0,4 Ω/km, cos φ 0,85 | ≈ 1024,4 V |
| 15 | R_10menit 5000 MΩ, R_1menit 2000 MΩ | PI = 2,5 |
| 16 | 0,65 MPa absolut pada 35 °C | ≈ 0,6184 MPa |
| 17 | 150 kV, 100 MVA | Z_base = 225 Ω |

## Alur kerja per kalkulator
Prinsip kasus uji: pilih nilai yang membuat jawaban benar dan jawaban salah menghasilkan angka berbeda. Hindari nilai yang membuat rumus terbalik atau acuan yang salah tetap lolos (misalnya dua input bernilai sama, atau batas yang jauh dari hasil).

1. Tulis fungsi di `js/rumus.js`.
2. Tulis test di `tests/rumus.test.js` memakai kasus uji di atas, plus test
   untuk input tidak valid.
3. Jalankan `node --test tests/rumus.test.js` sampai semua lolos.
4. Baru buat tampilannya di `index.html` dan `js/ui.js`.
5. Laporkan: fungsi apa yang ditambahkan, hasil test, dan cara mencobanya.

Kerjakan SATU kalkulator per tugas. Jangan lanjut ke kalkulator berikutnya
sebelum test kalkulator sekarang lolos.





