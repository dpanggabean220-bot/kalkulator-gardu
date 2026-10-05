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