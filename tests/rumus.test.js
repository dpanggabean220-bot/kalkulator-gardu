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