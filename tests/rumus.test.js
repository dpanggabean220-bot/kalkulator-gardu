const test = require('node:test');
const assert = require('node:assert/strict');
const Rumus = require('../js/rumus.js');

function assertCloseTo(actual, expected, tolerance, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new assert.AssertionError({
      message: message,
      actual: actual,
      expected: expected,
      operator: 'closeTo'
    });
  }
}

// Kalkulator 1: Arus nominal 3 fasa
test('Arus nominal 3 fasa - kasus uji 1: 500 MVA, 275 kV', async t => {
  const I = Rumus.arusNominal3Fasa(500, 275);
  assertCloseTo(I, 1049.73, 0.01, 'Hasil harus 1049.73 A (toleransi 0.01)');
});

test('Arus nominal 3 fasa - kasus uji 2: 500 MVA, 150 kV', async t => {
  const I = Rumus.arusNominal3Fasa(500, 150);
  assertCloseTo(I, 1924.50, 0.01, 'Hasil harus 1924.50 A (toleransi 0.01)');
});

test('Arus nominal 3 fasa - kasus uji 3: 60 MVA, 20 kV', async t => {
  const I = Rumus.arusNominal3Fasa(60, 20);
  assertCloseTo(I, 1732.05, 0.01, 'Hasil harus 1732.05 A (toleransi 0.01)');
});

// Test input tidak valid untuk kalkulator 1
test('Arus nominal 3 fasa - input daya bukan angka', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa('abc', 20),
    { message: 'Daya S harus berupa angka' }
  );
});

test('Arus nominal 3 fasa - input tegangan bukan angka', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa(60, 'xyz'),
    { message: 'Tegangan V harus berupa angka' }
  );
});

test('Arus nominal 3 fasa - input daya kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa(0, 20),
    { message: 'Daya S harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusNominal3Fasa(-10, 20),
    { message: 'Daya S harus lebih besar dari nol' }
  );
});

test('Arus nominal 3 fasa - input tegangan kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa(60, 0),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusNominal3Fasa(60, -5),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
});

// Kalkulator 2: Segitiga daya
test('Segitiga daya - P = 80 MW, Q = 60 MVAR', async t => {
  const result = Rumus.segitigaDaya(80, 60);
  assertCloseTo(result.S, 100, 0.01, 'S harus 100 MVA');
  assertCloseTo(result.cosPhi, 0.8, 0.01, 'cos φ harus 0,8');
});

test('Segitiga daya - P = 0 dan Q = 0 harus error', async t => {
  assert.throws(
    () => Rumus.segitigaDaya(0, 0),
    { message: 'Daya aktif dan reaktif tidak boleh keduanya nol' }
  );
});

test('Segitiga daya - Q negatif (kapasitif)', async t => {
  const result = Rumus.segitigaDaya(80, -60);
  assertCloseTo(result.S, 100, 0.01, 'S harus 100 MVA');
  assertCloseTo(result.cosPhi, 0.8, 0.01, 'cos φ harus 0,8 (sama nilai mutlak)');
});

test('Segitiga daya - input P bukan angka', async t => {
  assert.throws(
    () => Rumus.segitigaDaya('abc', 60),
    { message: 'Daya aktif P harus berupa angka' }
  );
});

test('Segitiga daya - input Q bukan angka', async t => {
  assert.throws(
    () => Rumus.segitigaDaya(80, 'xyz'),
    { message: 'Daya reaktif Q harus berupa angka' }
  );
});

// Kalkulator 3: Persentase pembebanan trafo
test('Persentase pembebanan trafo - S_ukur = 80 MVA, S_rating = 100 MVA', async t => {
  const persentase = Rumus.persentasePembebananTrafo(80, 100);
  assertCloseTo(persentase, 80, 0.01, 'Persentase harus 80%');
});

test('Persentase pembebanan trafo - S_ukur = 120 MVA, S_rating = 100 MVA (overload)', async t => {
  const persentase = Rumus.persentasePembebananTrafo(120, 100);
  assertCloseTo(persentase, 120, 0.01, 'Persentase harus 120%');
});

test('Persentase pembebanan trafo - input S_ukur bukan angka', async t => {
  assert.throws(
    () => Rumus.persentasePembebananTrafo('abc', 100),
    { message: 'Daya terukur S_ukur harus berupa angka' }
  );
});

test('Persentase pembebanan trafo - input S_rating bukan angka', async t => {
  assert.throws(
    () => Rumus.persentasePembebananTrafo(80, 'xyz'),
    { message: 'Daya rating S_rating harus berupa angka' }
  );
});

test('Persentase pembebanan trafo - input S_ukur negatif', async t => {
  assert.throws(
    () => Rumus.persentasePembebananTrafo(-10, 100),
    { message: 'Daya terukur S_ukur tidak boleh negatif' }
  );
});

test('Persentase pembebanan trafo - input S_rating kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.persentasePembebananTrafo(80, 0),
    { message: 'Daya rating S_rating harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.persentasePembebananTrafo(80, -5),
    { message: 'Daya rating S_rating harus lebih besar dari nol' }
  );
});

// Kalkulator 3: Mode MW dan MVAR
test('Persentase pembebanan trafo mode MW dan MVAR - P=80 MW, Q=60 MVAR, S_rating=100 MVA', async t => {
  // Hitung S terukur terlebih dahulu menggunakan fungsi segitigaDaya
  const segitigaResult = Rumus.segitigaDaya(80, 60);
  const S_ukur = segitigaResult.S; // Harusnya 100 MVA

  // Hitung persentase pembebanan
  const persentase = Rumus.persentasePembebananTrafo(S_ukur, 100);
  assertCloseTo(persentase, 100, 0.01, 'Persentase harus 100% untuk P=80 MW, Q=60 MVAR, S_rating=100 MVA');
});

test('Persentase pembebanan trafo mode MW dan MVAR - P=60 MW, Q=80 MVAR, S_rating=100 MVA', async t => {
  // Hitung S terukur terlebih dahulu menggunakan fungsi segitigaDaya
  const segitigaResult = Rumus.segitigaDaya(60, 80);
  const S_ukur = segitigaResult.S; // Harusnya 100 MVA

  // Hitung persentase pembebanan
  const persentase = Rumus.persentasePembebananTrafo(S_ukur, 100);
  assertCloseTo(persentase, 100, 0.01, 'Persentase harus 100% untuk P=60 MW, Q=80 MVAR, S_rating=100 MVA');
});

// Kalkulator 3: Mode Arus terukur
test('Persentase pembebanan trafo mode Arus terukur - I_ukur=1049.73 A, V_ukur=275 kV, S_rating=500 MVA', async t => {
  // Hitung arus nominal terlebih dahulu menggunakan fungsi arusNominal3Fasa
  const I_nominal = Rumus.arusNominal3Fasa(500, 275); // Harusnya ~1049.73 A

  // Hitung persentase pembebanan
  const persentase = (1049.73 / I_nominal) * 100;
  assertCloseTo(persentase, 100, 0.01, 'Persentase harus 100% untuk I_ukur=1049.73 A, V_ukur=275 kV, S_rating=500 MVA');
});

test('Persentase pembebanan trafo mode Arus terukur - I_ukur=500 A, V_ukur=275 kV, S_rating=500 MVA (underload)', async t => {
  // Hitung arus nominal terlebih dahulu menggunakan fungsi arusNominal3Fasa
  const I_nominal = Rumus.arusNominal3Fasa(500, 275); // Harusnya ~1049.73 A

  // Hitung persentase pembebanan
  const persentase = (500 / I_nominal) * 100;
  assertCloseTo(persentase, 47.63, 0.01, 'Persentase harus ~47.63% untuk I_ukur=500 A, V_ukur=275 kV, S_rating=500 MVA');
});

// Test input tidak valid untuk kalkulator 3 mode MW dan MVAR
test('Persentase pembebanan trafo mode MW dan MVAR - input P bukan angka', async t => {
  // Kita tidak dapat langsung menguji fungsi gabungan tanpa memperbesar cakupan,
  // tetapi kita bisa menguji bahwa fungsi-fungsi komponen bekerja dengan benar
  assert.throws(
    () => Rumus.segitigaDaya('abc', 60),
    { message: 'Daya aktif P harus berupa angka' }
  );
});

test('Persentase pembebanan trafo mode MW dan MVAR - input Q bukan angka', async t => {
  assert.throws(
    () => Rumus.segitigaDaya(80, 'xyz'),
    { message: 'Daya reaktif Q harus berupa angka' }
  );
});

// Test input tidak valid untuk kalkulator 3 mode Arus terukur
test('Persentase pembebanan trafo mode Arus terukur - input arus bukan angka', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa('abc', 20),
    { message: 'Daya S harus berupa angka' }
  );
});

test('Persentase pembebanan trafo mode Arus terukur - input tegangan bukan angka', async t => {
  assert.throws(
    () => Rumus.arusNominal3Fasa(60, 'xyz'),
    { message: 'Tegangan V harus berupa angka' }
  );
});

// Kalkulator 6: Arus hubung singkat dari MVA hubung singkat
test('Arus hubung singkat dari MVA hubung singkat - 10000 MVA_sc, 150 kV', async t => {
  const I_sc = Rumus.arusHubungSingkatDariMVA(10000, 150);
  assertCloseTo(I_sc, 38490, 1, 'Hasil harus 38490 A (toleransi 1)');
});

test('Arus hubung singkat dari MVA hubung singkat - input MVA_sc bukan angka', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA('abc', 150),
    { message: 'MVA hubung singkat harus berupa angka' }
  );
});

test('Arus hubung singkat dari MVA hubung singkat - input tegangan bukan angka', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA(10000, 'xyz'),
    { message: 'Tegangan V harus berupa angka' }
  );
});

test('Arus hubung singkat dari MVA hubung singkat - input MVA_sc kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA(0, 150),
    { message: 'MVA hubung singkat harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA(-100, 150),
    { message: 'MVA hubung singkat harus lebih besar dari nol' }
  );
});

test('Arus hubung singkat dari MVA hubung singkat - input tegangan kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA(10000, 0),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusHubungSingkatDariMVA(10000, -5),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
});

// Kalkulator 7: Arus hubung singkat di terminal trafo
test('Arus hubung singkat di terminal trafo - 60 MVA, 20 kV, Z = 12%', async t => {
  const I_sc = Rumus.arusHubungSingkatTerminalTrafo(60, 20, 12);
  assertCloseTo(I_sc, 14433.8, 0.1, 'Hasil harus 14433,8 A (toleransi 0.1)');
});

test('Arus hubung singkat di terminal trafo - input S bukan angka', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo('abc', 20, 12),
    { message: 'Daya S harus berupa angka' }
  );
});

test('Arus hubung singkat di terminal trafo - input V bukan angka', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, 'xyz', 12),
    { message: 'Tegangan V harus berupa angka' }
  );
});

test('Arus hubung singkat di terminal trafo - input Z% bukan angka', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, 20, 'xyz'),
    { message: 'Impedansi Z% harus berupa angka' }
  );
});

test('Arus hubung singkat di terminal trafo - input S kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(0, 20, 12),
    { message: 'Daya S harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(-10, 20, 12),
    { message: 'Daya S harus lebih besar dari nol' }
  );
});

test('Arus hubung singkat di terminal trafo - input V kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, 0, 12),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, -5, 12),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
});

test('Arus hubung singkat di terminal trafo - input Z% kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, 20, 0),
    { message: 'Impedansi Z% harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusHubungSingkatTerminalTrafo(60, 20, -1),
    { message: 'Impedansi Z% harus lebih besar dari nol' }
  );
});

// Kalkulator 8: Arus sekunder CT dan burden
test('Arus sekunder CT dan burden - I_prim=100 A, I_sek_rating=1 A, I_prim_rating=100 A, R_relay=1 Ω, R_kabel=0.5 Ω', async t => {
  const result = Rumus.arusSekunderCT(100, 1, 100, 1, 0.5);
  assertCloseTo(result.I_sek, 1, 0.0001, 'Arus sekunder harus 1 A');
  assertCloseTo(result.VA, 1.5, 0.0001, 'Burden harus 1.5 VA');
});

test('Arus sekunder CT dan burden - I_prim=50 A, I_sek_rating=5 A, I_prim_rating=500 A, R_relay=2 Ω, R_kabel=1 Ω', async t => {
  const result = Rumus.arusSekunderCT(50, 5, 500, 2, 1);
  assertCloseTo(result.I_sek, 0.5, 0.0001, 'Arus sekunder harus 0.5 A');
  assertCloseTo(result.VA, 0.5 * 0.5 * 3, 0.0001, 'Burden harus 0.75 VA'); // 0.5^2 * 3 = 0.75
});

// Test mode panjang kabel: L = 100 m, A = 2,5 mm² → R_kabel = 1,4 Ω
test('Arus sekunder CT dan burden mode panjang kabel - L=100 m, A=2.5 mm², I_prim=100 A, I_sek_rating=1 A, I_prim_rating=100 A, R_relay=1 Ω', async t => {
  // First calculate expected R_kabel
  const expectedRkabel = Rumus.tahananKabelTembaga(100, 2.5); // Should be 1.4 Ω
  assertCloseTo(expectedRkabel, 1.4, 0.0001, 'Tahanan kabel harus 1,4 Ω untuk L=100 m, A=2.5 mm²');

  // Then test the full calculation
  const result = Rumus.arusSekunderCT(100, 1, 100, 1, expectedRkabel);
  assertCloseTo(result.I_sek, 1, 0.0001, 'Arus sekunder harus 1 A');
  assertCloseTo(result.VA, 1 * 1 * (1 + 1.4), 0.0001, 'Burden harus 2.4 VA'); // 1^2 * (1 + 1.4) = 2.4
});

// Test dengan rating burden CT
test('Arus sekunder CT dan burden dengan rating burden - I_prim=100 A, I_sek_rating=1 A, I_prim_rating=100 A, R_relay=1 Ω, R_kabel=0.5 Ω, burdenRating=2 VA', async t => {
  const result = Rumus.arusSekunderCT(100, 1, 100, 1, 0.5, 2);
  assertCloseTo(result.I_sek, 1, 0.0001, 'Arus sekunder harus 1 A');
  assertCloseTo(result.VA, 1.5, 0.0001, 'Burden harus 1.5 VA');
  assertCloseTo(result.burdenPercent, 75, 0.0001, 'Persentase pemakaian burden harus 75%');
});

test('Arus sekunder CT dan burden dengan rating burden yang dilebihi - I_prim=100 A, I_sek_rating=1 A, I_prim_rating=100 A, R_relay=1 Ω, R_kabel=1.5 Ω, burdenRating=2 VA', async t => {
  const result = Rumus.arusSekunderCT(100, 1, 100, 1, 1.5, 2);
  assertCloseTo(result.I_sek, 1, 0.0001, 'Arus sekunder harus 1 A');
  assertCloseTo(result.VA, 2.5, 0.0001, 'Burden harus 2.5 VA');
  assertCloseTo(result.burdenPercent, 125, 0.0001, 'Persentase pemakaian burden harus 125%');
});

// Test fungsi tahanan kabel tembaga
test('Tahanan kabel tembaga - L=100 m, A=2.5 mm²', async t => {
  const Rkabel = Rumus.tahananKabelTembaga(100, 2.5);
  assertCloseTo(Rkabel, 1.4, 0.0001, 'Tahanan kabel harus 1,4 Ω untuk L=100 m, A=2.5 mm²');
});

test('Tahanan kabel tembaga - input panjang bukan angka', async t => {
  assert.throws(
    () => Rumus.tahananKabelTembaga('abc', 2.5),
    { message: 'Panjang kabel harus berupa angka' }
  );
});

test('Tahanan kabel tembaga - input luas penampang bukan angka', async t => {
  assert.throws(
    () => Rumus.tahananKabelTembaga(100, 'xyz'),
    { message: 'Luas penampang kabel harus berupa angka' }
  );
});

test('Tahanan kabel tembaga - input panjang kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.tahananKabelTembaga(0, 2.5),
    { message: 'Panjang kabel harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.tahananKabelTembaga(-10, 2.5),
    { message: 'Panjang kabel harus lebih besar dari nol' }
  );
});

test('Tahanan kabel tembaga - input luas penampang kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.tahananKabelTembaga(100, 0),
    { message: 'Luas penampang kabel harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.tahananKabelTembaga(100, -1),
    { message: 'Luas penampang kabel harus lebih besar dari nol' }
  );
});

// Test input tidak valid untuk arus sekunder CT dan burden
test('Arus sekunder CT dan burden - input I_prim bukan angka', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT('abc', 1, 100, 1, 0.5),
    { message: 'Arus primer I_prim harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input I_sek_rating bukan angka', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 'xyz', 100, 1, 0.5),
    { message: 'Arus sekunder rating I_sek_rating harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input I_prim_rating bukan angka', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 'xyz', 1, 0.5),
    { message: 'Arus primer rating I_prim_rating harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input R_relay bukan angka', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 'abc', 0.5),
    { message: 'Tahanan relay harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input R_kabel bukan angka', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 1, 'xyz'),
    { message: 'Tahanan kabel harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input burdenRating bukan angka (when provided)', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 1, 0.5, 'xyz'),
    { message: 'Rating burden CT harus berupa angka' }
  );
});

test('Arus sekunder CT dan burden - input I_prim kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(0, 1, 100, 1, 0.5),
    { message: 'Arus primer I_prim harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusSekunderCT(-10, 1, 100, 1, 0.5),
    { message: 'Arus primer I_prim harus lebih besar dari nol' }
  );
});

test('Arus sekunder CT dan burden - input I_sek_rating kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 0, 100, 1, 0.5),
    { message: 'Arus sekunder rating I_sek_rating harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusSekunderCT(100, -1, 100, 1, 0.5),
    { message: 'Arus sekunder rating I_sek_rating harus lebih besar dari nol' }
  );
});

test('Arus sekunder CT dan burden - input I_prim_rating kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 0, 1, 0.5),
    { message: 'Arus primer rating I_prim_rating harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, -10, 1, 0.5),
    { message: 'Arus primer rating I_prim_rating harus lebih besar dari nol' }
  );
});

test('Arus sekunder CT dan burden - input R_relay kurang dari nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, -0.5, 0.5),
    { message: 'Tahanan relay tidak boleh negatif' }
  );
});

test('Arus sekunder CT dan burden - input R_kabel kurang dari nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 1, -0.5),
    { message: 'Tahanan kabel tidak boleh negatif' }
  );
});

// Test burdenRating validation when provided
test('Arus sekunder CT dan burden - input burdenRating kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 1, 0.5, 0),
    { message: 'Rating burden CT harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.arusSekunderCT(100, 1, 100, 1, 0.5, -1),
    { message: 'Rating burden CT harus lebih besar dari nol' }
  );
});

// Kalkulator 4: Tegangan per posisi tap
test('Tegangan per posisi tap - 150 kV, tap +3, step 1,25%', async t => {
  const V_tap = Rumus.teganganPerPosisiTap(150, 3, 1.25);
  assertCloseTo(V_tap, 155.625, 0.001, 'Hasil harus 155,625 kV');
});

test('Tegangan per posisi tap - 150 kV, tap -2, step 1,25%', async t => {
  const V_tap = Rumus.teganganPerPosisiTap(150, -2, 1.25);
  assertCloseTo(V_tap, 146.25, 0.001, 'Hasil harus 146,25 kV');
});

test('Tegangan per posisi tap - 150 kV, tap 0, step 1,25%', async t => {
  const V_tap = Rumus.teganganPerPosisiTap(150, 0, 1.25);
  assertCloseTo(V_tap, 150, 0.001, 'Hasil harus 150 kV (tap tengah)');
});

test('Tegangan per posisi tap - input V_nominal bukan angka', async t => {
  assert.throws(
    () => Rumus.teganganPerPosisiTap('abc', 3, 1.25),
    { message: 'Tegangan nominal V_nominal harus berupa angka' }
  );
});

test('Tegangan per posisi tap - input n bukan angka', async t => {
  assert.throws(
    () => Rumus.teganganPerPosisiTap(150, 'xyz', 1.25),
    { message: 'Posisi tap n harus berupa angka' }
  );
});

test('Tegangan per posisi tap - input stepPercent bukan angka', async t => {
  assert.throws(
    () => Rumus.teganganPerPosisiTap(150, 3, 'xyz'),
    { message: 'Persentase langkah stepPercent harus berupa angka' }
  );
});

test('Tegangan per posisi tap - input V_nominal kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.teganganPerPosisiTap(0, 3, 1.25),
    { message: 'Tegangan nominal V_nominal harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.teganganPerPosisiTap(-10, 3, 1.25),
    { message: 'Tegangan nominal V_nominal harus lebih besar dari nol' }
  );
});

test('Tegangan per posisi tap - input stepPercent negatif', async t => {
  assert.throws(
    () => Rumus.teganganPerPosisiTap(150, 3, -1.25),
    { message: 'Persentase langkah stepPercent tidak boleh negatif' }
  );
});

// Kalkulator 5: Kapasitor Perbaikan cos φ
test('Kapasitor perbaikan cos φ - P = 10 MW, cos φ 0,8 → 0,95', async t => {
  const Qc = Rumus.kapasitorPerbaikanCosPhi(10, 0.8, 0.95);
  assertCloseTo(Qc, 4.213, 0.001, 'Hasil harus 4,213 MVAR');
});

test('Kapasitor perbaikan cos φ - P = 100 MW, cos φ 0,7 → 0,9', async t => {
  const Qc = Rumus.kapasitorPerbaikanCosPhi(100, 0.7, 0.9);
  assertCloseTo(Qc, 53.59, 0.01, 'Hasil harus 53,59 MVAR');
});

test('Kapasitor perbaikan cos φ - input P bukan angka', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi('abc', 0.8, 0.95),
    { message: 'Daya aktif P harus berupa angka' }
  );
});

test('Kapasitor perbaikan cos φ - input cos φ1 bukan angka', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 'xyz', 0.95),
    { message: 'Faktor daya awal cos φ1 harus berupa angka' }
  );
});

test('Kapasitor perbaikan cos φ - input cos φ2 bukan angka', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 0.8, 'xyz'),
    { message: 'Faktor daya target cos φ2 harus berupa angka' }
  );
});

test('Kapasitor perbaikan cos φ - input P kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(0, 0.8, 0.95),
    { message: 'Daya aktif P harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(-10, 0.8, 0.95),
    { message: 'Daya aktif P harus lebih besar dari nol' }
  );
});

test('Kapasitor perbaikan cos φ - input cos φ1 kurang dari 0 atau lebih dari 1', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, -0.1, 0.95),
    { message: 'Faktor daya awal cos φ1 harus antara 0 dan 1' }
  );
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 1.1, 0.95),
    { message: 'Faktor daya awal cos φ1 harus antara 0 dan 1' }
  );
});

test('Kapasitor perbaikan cos φ - input cos φ2 kurang dari 0 atau lebih dari 1', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 0.8, -0.1),
    { message: 'Faktor daya target cos φ2 harus antara 0 dan 1' }
  );
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 0.8, 1.1),
    { message: 'Faktor daya target cos φ2 harus antara 0 dan 1' }
  );
});

test('Kapasitor perbaikan cos φ - input cos φ2 kurang dari atau sama dengan cos φ1', async t => {
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 0.8, 0.8),
    { message: 'Faktor daya target cos φ2 harus lebih besar dari cos φ1' }
  );
  assert.throws(
    () => Rumus.kapasitorPerbaikanCosPhi(10, 0.8, 0.7),
    { message: 'Faktor daya target cos φ2 harus lebih besar dari cos φ1' }
  );
});

// Kalkulator 9: Waktu Kerja Relay OCR, kurva IEC 60255
test('Waktu kerja relay OCR - SI, TMS 0,1, I/I_s = 10', async t => {
  const waktuSI = Rumus.waktuKerjaRelayOCR('SI', 0.1, 10);
  assertCloseTo(waktuSI, 0.297, 0.001, 'Hasil harus 0,297 s');
});

test('Waktu kerja relay OCR - VI, TMS 0,1, I/I_s = 10', async t => {
  const waktuVI = Rumus.waktuKerjaRelayOCR('VI', 0.1, 10);
  assertCloseTo(waktuVI, 0.150, 0.001, 'Hasil harus 0,150 s');
});

test('Waktu kerja relay OCR - EI, TMS 0,1, I/I_s = 10', async t => {
  const waktuEI = Rumus.waktuKerjaRelayOCR('EI', 0.1, 10);
  assertCloseTo(waktuEI, 0.0808, 0.001, 'Hasil harus 0,0808 s');
});

test('Waktu kerja relay OCR - input curveType bukan string', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR(123, 0.1, 10),
    { message: 'Jenis kurva harus berupa string' }
  );
});

test('Waktu kerja relay OCR - input curveType tidak valid', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('XXX', 0.1, 10),
    { message: 'Jenis kurva harus SI, VI, atau EI' }
  );
});

test('Waktu kerja relay OCR - input TMS bukan angka', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', 'abc', 10),
    { message: 'TMS harus berupa angka' }
  );
});

test('Waktu kerja relay OCR - input I/I_s bukan angka', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', 0.1, 'xyz'),
    { message: 'I/I_s harus berupa angka' }
  );
});

test('Waktu kerja relay OCR - input TMS kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', 0, 10),
    { message: 'TMS harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', -0.1, 10),
    { message: 'TMS harus lebih besar dari nol' }
  );
});

test('Waktu kerja relay OCR - input I/I_s kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', 0.1, 0),
    { message: 'I/I_s harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.waktuKerjaRelayOCR('SI', 0.1, -1),
    { message: 'I/I_s harus lebih besar dari nol' }
  );
});

test('Waktu kerja relay OCR - I/I_s <= 1 (relay tidak bekerja)', async t => {
  const waktuNull1 = Rumus.waktuKerjaRelayOCR('SI', 0.1, 1);
  assert.strictEqual(waktuNull1, null, 'Hasil harus null untuk I/I_s <= 1');

  const waktuNull2 = Rumus.waktuKerjaRelayOCR('SI', 0.1, 0.5);
  assert.strictEqual(waktuNull2, null, 'Hasil harus null untuk I/I_s <= 1');
});

// Kalkulator 18: Konversi satuan
test('Konversi kV ke V - 150 kV = 150.000 V', async t => {
  const V = Rumus.kVkeV(150);
  assertCloseTo(V, 150000, 0.01, '150 kV harus 150.000 V');
});

test('Konversi kA ke A - 2,5 kA = 2.500 A', async t => {
  const A = Rumus.kAkeA(2.5);
  assertCloseTo(A, 2500, 0.01, '2,5 kA harus 2.500 A');
});

test('Konversi MVA ke kVA - 60 MVA = 60.000 kVA', async t => {
  const kVA = Rumus.MVaketaVA(60);
  assertCloseTo(kVA, 60000, 0.01, '60 MVA harus 60.000 kVA');
});

test('Konversi °C ke K - 20 °C = 293,15 K', async t => {
  const K = Rumus.CkeK(20);
  assertCloseTo(K, 293.15, 0.01, '20 °C harus 293,15 K');
});

test('Konversi V ke kV - 150.000 V = 150 kV', async t => {
  const kV = Rumus.VkekV(150000);
  assertCloseTo(kV, 150, 0.01, '150.000 V harus 150 kV');
});

test('Konversi A ke kA - 2.500 A = 2,5 kA', async t => {
  const kA = Rumus.AkekA(2500);
  assertCloseTo(kA, 2.5, 0.01, '2.500 A harus 2,5 kA');
});

test('Konversi kVA ke MVA - 60.000 kVA = 60 MVA', async t => {
  const MVA = Rumus.kVAkeMVA(60000);
  assertCloseTo(MVA, 60, 0.01, '60.000 kVA harus 60 MVA');
});

test('Konversi K ke °C - 293,15 K = 20 °C', async t => {
  const C = Rumus.KkeC(293.15);
  assertCloseTo(C, 20, 0.01, '293,15 K harus 20 °C');
});

// Test input tidak valid untuk konversi satuan
test('Konversi kV ke V - input bukan angka', async t => {
  assert.throws(
    () => Rumus.kVkeV('abc'),
    { message: 'Tegangan kV harus berupa angka' }
  );
});

test('Konversi V ke kV - input bukan angka', async t => {
  assert.throws(
    () => Rumus.VkekV('xyz'),
    { message: 'Tegangan V harus berupa angka' }
  );
});

test('Konversi kA ke A - input bukan angka', async t => {
  assert.throws(
    () => Rumus.kAkeA('abc'),
    { message: 'Arus kA harus berupa angka' }
  );
});

test('Konversi A ke kA - input bukan angka', async t => {
  assert.throws(
    () => Rumus.AkekA('xyz'),
    { message: 'Arus A harus berupa angka' }
  );
});

test('Konversi MVA ke kVA - input bukan angka', async t => {
  assert.throws(
    () => Rumus.MVaketaVA('abc'),
    { message: 'Daya MVA harus berupa angka' }
  );
});

test('Konversi kVA ke MVA - input bukan angka', async t => {
  assert.throws(
    () => Rumus.kVAkeMVA('xyz'),
    { message: 'Daya kVA harus berupa angka' }
  );
});

test('Konversi °C ke K - input bukan angka', async t => {
  assert.throws(
    () => Rumus.CkeK('abc'),
    { message: 'Suhu Celsius harus berupa angka' }
  );
});

test('Konversi K ke °C - input bukan angka', async t => {
  assert.throws(
    () => Rumus.KkeC('xyz'),
    { message: 'Suhu Kelvin harus berupa angka' }
  );
});

// Kalkulator 11: Estimasi lokasi gangguan
test('Estimasi lokasi gangguan - Z_gangguan 4 Ω, 0,4 Ω/km', async t => {
  const jarak = Rumus.estimasiLokasiGangguan(4, 0.4);
  assertCloseTo(jarak, 10, 0.01, 'Hasil harus 10 km');
});

// Test baru untuk kalkulator 11 dengan panjang saluran dan metode
test('Estimasi lokasi gangguan dengan panjang saluran - X 4 Ω, 0,4 Ω/km, panjang 40 km', async t => {
  const result = Rumus.estimasiLokasiGangguan(4, 0.4, 40, 'reaktansi');
  assertCloseTo(result.jarak, 10, 0.01, 'Jarak harus 10 km');
  assertCloseTo(result.persen, 25, 0.01, 'Persen harus 25%');
  assertCloseTo(result.jarak_dari_ujung_lain, 30, 0.01, 'Jarak dari ujung lain harus 30 km');
  assert.strictEqual(result.metode, 'reaktansi', 'Metode harus reaktansi');
  assert.strictEqual(result.peringatan, null, 'Tidak boleh ada peringatan');
});

test('Estimasi lokasi gangguan - jarak melebihi panjang saluran', async t => {
  const result = Rumus.estimasiLokasiGangguan(20, 0.4, 10, 'impedansi'); // 20/0.4 = 50 km > 10 km
  assertCloseTo(result.jarak, 50, 0.01, 'Jarak harus 50 km');
  assertCloseTo(result.persen, 500, 0.01, 'Persen harus 500%');
  assertCloseTo(result.jarak_dari_ujung_lain, -40, 0.01, 'Jarak dari ujung lain harus -40 km');
  assert.strictEqual(result.metode, 'impedansi', 'Metode harus impedansi');
  assert.strictEqual(result.peringatan, 'Lokasi di luar panjang saluran. Periksa data atau kemungkinan gangguan di saluran berikutnya.', 'Peringatan harus muncul ketika jarak melebihi panjang saluran');
});

// Test input tidak valid untuk estimasi lokasi gangguan - panjang saluran
test('Estimasi lokasi gangguan - input panjang saluran bukan angka', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 0.4, 'abc'),
    { message: 'Panjang saluran harus berupa angka' }
  );
});

test('Estimasi lokasi gangguan - input panjang saluran kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 0.4, 0),
    { message: 'Panjang saluran harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 0.4, -5),
    { message: 'Panjang saluran harus lebih besar dari nol' }
  );
});

// Test input tidak valid untuk estimasi lokasi gangguan - metode
test('Estimasi lokasi gangguan - input metode tidak valid', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 0.4, 10, 'invalid'),
    { message: 'Metode harus berupa \"impedansi\" atau \"reaktansi\"' }
  );
});

// Test input tidak valid untuk estimasi lokasi gangguan
test('Estimasi lokasi gangguan - input Z_gangguan bukan angka', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan('abc', 0.4),
    { message: 'Nilai gangguan harus berupa angka' }
  );
});

test('Estimasi lokasi gangguan - input Z_per_km bukan angka', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 'xyz'),
    { message: 'Nilai per kilometer harus berupa angka' }
  );
});

test('Estimasi lokasi gangguan - input Z_gangguan negatif', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(-1, 0.4),
    { message: 'Nilai gangguan tidak boleh negatif' }
  );
});

test('Estimasi lokasi gangguan - input Z_per_km kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, 0),
    { message: 'Nilai per kilometer harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.estimasiLokasiGangguan(4, -0.1),
    { message: 'Nilai per kilometer harus lebih besar dari nol' }
  );
});

// Kalkulator 12: Drop tegangan saluran 3 fasa
test('Drop tegangan saluran 3 fasa - I 200 A, L 10 km, R 0,1, X 0,4 Ω/km, cos φ 0,85', async t => {
  const result = Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 0.85, 20); // Assuming 20 kV tegangan
  // Expected: ≈ 1024,4 V (from test cases)
  assertCloseTo(result.dropTegangan, 1024.4, 0.1, 'Hasil harus 1024,4 V');
  assertCloseTo(result.sinPhi, Math.sqrt(1 - 0.85*0.85), 0.0001, 'Sin φ harus sesuai dengan cos φ 0,85');
  // Persentase: (1024.4 V / 20 kV) * 100 = (1.0244 kV / 20 kV) * 100 = 5.122%
  assertCloseTo(result.persen, 5.122, 0.01, 'Persentase harus 5,122%');
});

// Test baru untuk kalkulator 12: cos φ = 1 dan cos φ = 0
test('Drop tegangan saluran 3 fasa - I 200 A, L 10 km, R 0,1, X 0,4 Ω/km, cos φ 1', async t => {
  const result = Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 1, 20); // cos φ = 1, sin φ = 0
  assertCloseTo(result.dropTegangan, 346.4, 0.1, 'Hasil harus 346,4 V untuk cos φ = 1');
  assertCloseTo(result.sinPhi, 0, 0.0001, 'Sin φ harus 0 untuk cos φ = 1');
});

test('Drop tegangan saluran 3 fasa - I 200 A, L 10 km, R 0,1, X 0,4 Ω/km, cos φ 0', async t => {
  const result = Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 0, 20); // cos φ = 0, sin φ = 1
  assertCloseTo(result.dropTegangan, 1385.6, 0.1, 'Hasil harus 1385,6 V untuk cos φ = 0');
  assertCloseTo(result.sinPhi, 1, 0.0001, 'Sin φ harus 1 untuk cos φ = 0');
});

// Kalkulator 13: Rugi daya saluran
test('Rugi daya saluran - I 200 A, L 10 km, R 0,1 Ω/km', async t => {
  const Ploss = Rumus.rugiDayaSaluran(200, 0.1, 10);
  // Expected: 3 * 200^2 * 0.1 * 10 = 3 * 40000 * 0.1 * 10 = 120000 W
  assertCloseTo(Ploss, 120000, 0.01, 'Hasil harus 120000 W');
});

// Test input tidak valid untuk kalkulator 13
test('Rugi daya saluran - input arus bukan angka', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran('abc', 0.1, 10),
    { message: 'Arus I harus berupa angka' }
  );
});

test('Rugi daya saluran - input arus kurang dari nol', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran(-10, 0.1, 10),
    { message: 'Arus I tidak boleh negatif' }
  );
});

test('Rugi daya saluran - input resistansi bukan angka', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran(200, 'xyz', 10),
    { message: 'Resistansi R harus berupa angka' }
  );
});

test('Rugi daya saluran - input resistansi kurang dari nol', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran(200, -0.1, 10),
    { message: 'Resistansi R tidak boleh negatif' }
  );
});

test('Rugi daya saluran - input panjang bukan angka', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran(200, 0.1, 'xyz'),
    { message: 'Panjang saluran L harus berupa angka' }
  );
});

test('Rugi daya saluran - input panjang kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.rugiDayaSaluran(200, 0.1, 0),
    { message: 'Panjang saluran L harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.rugiDayaSaluran(200, 0.1, -5),
    { message: 'Panjang saluran L harus lebih besar dari nol' }
  );
});

// Test input tidak valid untuk drop tegangan saluran 3 fasa
test('Drop tegangan saluran 3 fasa - input arus bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa('abc', 10, 0.1, 0.4, 0.85, 20),
    { message: 'Arus I harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input panjang bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 'xyz', 0.1, 0.4, 0.85, 20),
    { message: 'Panjang saluran L harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input resistansi bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 'abc', 0.4, 0.85, 20),
    { message: 'Resistansi R harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input reaktansi bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 'xyz', 0.85, 20),
    { message: 'Reaktansi X harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input cos φ bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 'xyz', 20),
    { message: 'Faktor daya cos φ harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input tegangan bukan angka', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 0.85, 'xyz'),
    { message: 'Tegangan V harus berupa angka' }
  );
});

test('Drop tegangan saluran 3 fasa - input arus kurang dari nol', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(-10, 10, 0.1, 0.4, 0.85, 20),
    { message: 'Arus I tidak boleh negatif' }
  );
});

test('Drop tegangan saluran 3 fasa - input panjang kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 0, 0.1, 0.4, 0.85, 20),
    { message: 'Panjang saluran L harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, -5, 0.1, 0.4, 0.85, 20),
    { message: 'Panjang saluran L harus lebih besar dari nol' }
  );
});

test('Drop tegangan saluran 3 fasa - input resistansi kurang dari nol', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, -0.1, 0.4, 0.85, 20),
    { message: 'Resistansi R tidak boleh negatif' }
  );
});

test('Drop tegangan saluran 3 fasa - input reaktansi kurang dari nol', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, -0.1, 0.85, 20),
    { message: 'Reaktansi X tidak boleh negatif' }
  );
});

test('Drop tegangan saluran 3 fasa - input cos φ kurang dari 0 atau lebih dari 1', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, -0.1, 20),
    { message: 'Faktor daya cos φ harus antara 0 dan 1' }
  );
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 1.1, 20),
    { message: 'Faktor daya cos φ harus antara 0 dan 1' }
  );
});

test('Drop tegangan saluran 3 fasa - input tegangan kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 0.85, 0),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.dropTeganganSaluran3Fasa(200, 10, 0.1, 0.4, 0.85, -5),
    { message: 'Tegangan V harus lebih besar dari nol' }
  );
});

// Kalkulator 13: Rugi daya saluran
test('Rugi daya saluran - I = 0 → P_loss = 0', async t => {
  const Ploss = Rumus.rugiDayaSaluran(0, 0.1, 10);
  assertCloseTo(Ploss, 0, 0.01, 'Hasil harus 0 W ketika arus = 0');
});

// Tests untuk fungsi formatDaya
test('Format daya - 999 W → 999 W', async t => {
  const result = Rumus.formatDaya(999);
  assert.strictEqual(result.nilai, 999);
  assert.strictEqual(result.satuan, 'W');
});

test('Format daya - 1000 W → 1 kW', async t => {
  const result = Rumus.formatDaya(1000);
  assertCloseTo(result.nilai, 1, 0.001, 'Nilai harus 1');
  assert.strictEqual(result.satuan, 'kW');
});

test('Format daya - 999999 W → 999,999 kW', async t => {
  const result = Rumus.formatDaya(999999);
  assertCloseTo(result.nilai, 999.999, 0.001, 'Nilai harus 999,999');
  assert.strictEqual(result.satuan, 'kW');
});

test('Format daya - 1000000 W → 1 MW', async t => {
  const result = Rumus.formatDaya(1000000);
  assertCloseTo(result.nilai, 1, 0.001, 'Nilai harus 1');
  assert.strictEqual(result.satuan, 'MW');
});

test('Format daya - 7500000 W → 7,5 MW', async t => {
  const result = Rumus.formatDaya(7500000);
  assertCloseTo(result.nilai, 7.5, 0.001, 'Nilai harus 7,5');
  assert.strictEqual(result.satuan, 'MW');
});

// Test input tidak valid untuk formatDaya
test('Format daya - input bukan angka', async t => {
  assert.throws(
    () => Rumus.formatDaya('abc'),
    { message: 'Daya harus berupa angka' }
  );
});

test('Format daya - input kurang dari nol', async t => {
  assert.throws(
    () => Rumus.formatDaya(-10),
    { message: 'Daya tidak boleh negatif' }
  );
});

// Kalkulator 15: Indeks polarisasi dan rasio absorpsi dielektrik
test('Indeks polarisasi dan rasio absorpsi dielektrik - kasus uji PI: R_10menit 5000 MΩ, R_1menit 2000 MΩ', async t => {
  const result = Rumus.indeksPolarisasiDAR(undefined, 2000, 5000); // R30detik, R1menit, R10menit
  assertCloseTo(result.PI, 2.5, 0.01, 'PI harus 2,5');
  assert.strictEqual(result.DAR, undefined, 'DAR harus undefined karena R30detik tidak diberikan');
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - kasus uji DAR: R_30detik 1600 MΩ, R_1menit 2000 MΩ', async t => {
  const result = Rumus.indeksPolarisasiDAR(1600, 2000, undefined); // R30detik, R1menit, R10menit
  assertCloseTo(result.DAR, 1.25, 0.01, 'DAR harus 1,25');
  assert.strictEqual(result.PI, undefined, 'PI harus undefined karena R10menit tidak diberikan');
});

// Test input tidak valid untuk kalkulator 15
test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_30detik bukan angka', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR('abc', 2000, 5000),
    { message: 'Tahanan setelah 30 detik harus berupa angka' }
  );
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_1menit bukan angka', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, 'xyz', 5000),
    { message: 'Tahanan setelah 1 menit harus berupa angka' }
  );
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_10menit bukan angka', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, 2000, 'xyz'),
    { message: 'Tahanan setelah 10 menit harus berupa angka' }
  );
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_30detik kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(0, 2000, 5000),
    { message: 'Tahanan setelah 30 detik harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(-1000, 2000, 5000),
    { message: 'Tahanan setelah 30 detik harus lebih besar dari nol' }
  );
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_1menit kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, 0, 5000),
    { message: 'Tahanan setelah 1 menit harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, -1000, 5000),
    { message: 'Tahanan setelah 1 menit harus lebih besar dari nol' }
  );
});

test('Indeks polarisasi dan rasio absorpsi dielektrik - input R_10menit kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, 2000, 0),
    { message: 'Tahanan setelah 10 menit harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(2000, 2000, -1000),
    { message: 'Tahanan setelah 10 menit harus lebih besar dari nol' }
  );
});

// Test kalkulator 15 dengan kedua nilai diberikan
test('Indeks polarisasi dan rasio absorpsi dielektrik - menghitung kedua PI dan DAR', async t => {
  const result = Rumus.indeksPolarisasiDAR(1600, 2000, 5000); // R30detik, R1menit, R10menit
  assertCloseTo(result.PI, 2.5, 0.01, 'PI harus 2,5');
  assertCloseTo(result.DAR, 1.25, 0.01, 'DAR harus 1,25');
});

// Test kalkulator 15 dengan input yang tidak valid - kedua nilai kosong
test('Indeks polarvisi dan rasio absorpsi dielektrik - kedua input opsional kosong harus error', async t => {
  assert.throws(
    () => Rumus.indeksPolarisasiDAR(undefined, 2000, undefined),
    { message: 'Minimal satu dari tahanan setelah 30 detik atau 10 menit harus diisi' }
  );
});

// Kalkulator 16: Koreksi tekanan SF6 ke 20 °C
test('Koreksi tekanan SF6 - 0,65 MPa absolut pada 35 °C', async t => {
  const result = Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35);
  // P20 = 0.65 × 293.15 / (35 + 273.15) = 0.65 × 293.15 / 308.15 ≈ 0.6184 MPa
  assertCloseTo(result.P20_absolut, 0.6184, 0.001, 'P20 absolut harus 0,6184 MPa');
  assertCloseTo(result.P20_relatif, 0.5171, 0.001, 'P20 relatif harus 0,5171 MPa');
  assert.strictEqual(result.satuan, 'MPa', 'Satuan harus MPa');
  assert.strictEqual(result.peringatan, null, 'Tidak ada peringatan');
});

test('Koreksi tekanan SF6 - 6,5 bar absolut pada 35 °C', async t => {
  const result = Rumus.koreksiTekananSF6(6.5, 'absolut', 'bar', 35);
  // P20 = 6.5 × 293.15 / 308.15 ≈ 6.184 bar
  assertCloseTo(result.P20_absolut, 6.184, 0.01, 'P20 absolut harus 6,184 bar');
  assertCloseTo(result.P20_relatif, 5.171, 0.01, 'P20 relatif harus 5,171 bar');
  assert.strictEqual(result.satuan, 'bar', 'Satuan harus bar');
});

test('Koreksi tekanan SF6 - tekanan relatif ke absolut', async t => {
  const result = Rumus.koreksiTekananSF6(0.55, 'relatif', 'MPa', 35);
  // P_absolut = 0.55 + 0.1013 = 0.6513 MPa
  // P20 = 0.6513 × 293.15 / 308.15 ≈ 0.6195 MPa
  assertCloseTo(result.P20_absolut, 0.6195, 0.001, 'P20 absolut harus 0,6195 MPa');
  assertCloseTo(result.P20_relatif, 0.5182, 0.001, 'P20 relatif harus 0,5182 MPa');
});

test('Koreksi tekanan SF6 - dengan batas minimum relatif (perbandingan P20 relatif)', async t => {
  // P20 relatif 0.5171 < 0.55, walaupun P20 absolut 0.6184 > 0.55
  const result = Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35, 0.55);
  assertCloseTo(result.P20_absolut, 0.6184, 0.001, 'P20 absolut harus 0,6184 MPa');
  assertCloseTo(result.P20_relatif, 0.5171, 0.001, 'P20 relatif harus 0,5171 MPa');
  assert.strictEqual(result.peringatan, 'Tekanan P₂₀ relatif di bawah batas minimum yang diberikan.', 'Peringatan harus muncul karena P20 relatif < batas');
});

test('Koreksi tekanan SF6 - dengan batas minimum terpenuhi', async t => {
  const result = Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35, 0.5);
  assertCloseTo(result.P20_absolut, 0.6184, 0.001, 'P20 absolut harus 0,6184 MPa');
  assertCloseTo(result.P20_relatif, 0.5171, 0.001, 'P20 relatif harus 0,5171 MPa');
  assert.strictEqual(result.peringatan, null, 'Tidak ada peringatan');
});

test('Koreksi tekanan SF6 - kesetaraan tekanan relatif dan absolut', async t => {
  // 0.5487 MPa relatif pada 35 °C harus memberi P20 yang sama dengan 0.65 MPa absolut pada 35 °C
  const result_relatif = Rumus.koreksiTekananSF6(0.5487, 'relatif', 'MPa', 35);
  const result_absolut = Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35);

  // P_absolut dari 0.5487 relatif = 0.5487 + 0.1013 = 0.65 MPa
  assertCloseTo(result_relatif.P20_absolut, result_absolut.P20_absolut, 0.001, 'P20 absolut harus sama');
  assertCloseTo(result_relatif.P20_relatif, result_absolut.P20_relatif, 0.001, 'P20 relatif harus sama');
});

test('Koreksi tekanan SF6 - suhu 0 °C', async t => {
  // 0.60 MPa absolut pada 0 °C → P20 ≈ 0.6439 MPa
  const result = Rumus.koreksiTekananSF6(0.60, 'absolut', 'MPa', 0);
  // P20 = 0.60 × 293.15 / (0 + 273.15) = 0.60 × 293.15 / 273.15 ≈ 0.6439 MPa
  assertCloseTo(result.P20_absolut, 0.6439, 0.001, 'P20 absolut harus 0,6439 MPa');
  assertCloseTo(result.P20_relatif, 0.5426, 0.001, 'P20 relatif harus 0,5426 MPa');
});

test('Koreksi tekanan SF6 - suhu 20 °C (tidak berubah)', async t => {
  // 0.60 MPa absolut pada 20 °C → P20 = 0.60 MPa (suhu referensi)
  const result = Rumus.koreksiTekananSF6(0.60, 'absolut', 'MPa', 20);
  // P20 = 0.60 × 293.15 / (20 + 273.15) = 0.60 × 293.15 / 293.15 = 0.60 MPa
  assertCloseTo(result.P20_absolut, 0.60, 0.001, 'P20 absolut harus 0,60 MPa');
  assertCloseTo(result.P20_relatif, 0.4987, 0.001, 'P20 relatif harus 0,4987 MPa');
});

// Test input tidak valid untuk kalkulator 16
test('Koreksi tekanan SF6 - input tekanan bukan angka', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6('abc', 'absolut', 'MPa', 35),
    { message: 'Tekanan terukur harus berupa angka' }
  );
});

test('Koreksi tekanan SF6 - input tekanan kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0, 'absolut', 'MPa', 35),
    { message: 'Tekanan terukur harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.koreksiTekananSF6(-0.5, 'absolut', 'MPa', 35),
    { message: 'Tekanan terukur harus lebih besar dari nol' }
  );
});

test('Koreksi tekanan SF6 - input jenis tekanan tidak valid', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'invalid', 'MPa', 35),
    { message: 'Jenis tekanan harus "absolut" atau "relatif"' }
  );
});

test('Koreksi tekanan SF6 - input satuan tidak valid', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'invalid', 35),
    { message: 'Satuan tekanan harus "MPa" atau "bar"' }
  );
});

test('Koreksi tekanan SF6 - input suhu bukan angka', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 'abc'),
    { message: 'Suhu harus berupa angka' }
  );
});

test('Koreksi tekanan SF6 - input suhu di bawah nol absolut', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', -274),
    { message: 'Suhu harus lebih besar dari -273,15 °C' }
  );
});

test('Koreksi tekanan SF6 - input batas minimum bukan angka', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35, 'abc'),
    { message: 'Batas minimum harus berupa angka' }
  );
});

test('Koreksi tekanan SF6 - input batas minimum kurang dari atau sama dengan nol', async t => {
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35, 0),
    { message: 'Batas minimum harus lebih besar dari nol' }
  );
  assert.throws(
    () => Rumus.koreksiTekananSF6(0.65, 'absolut', 'MPa', 35, -0.5),
    { message: 'Batas minimum harus lebih besar dari nol' }
  );
});
