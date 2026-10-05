// SEMUA rumus, fungsi murni, tanpa akses DOM
var Rumus = {};

/**
 * Hitung arus nominal 3 fasa
 * @param {number} S - Daya dalam MVA
 * @param {number} V - Tegangan dalam kV
 * @returns {number} Arus dalam A
 * @throws {Error} Jika input tidak valid
 */
Rumus.arusNominal3Fasa = function(S, V) {
    // Validasi input
    if (typeof S !== 'number' || isNaN(S)) {
        throw new Error('Daya S harus berupa angka');
    }
    if (typeof V !== 'number' || isNaN(V)) {
        throw new Error('Tegangan V harus berupa angka');
    }
    if (S <= 0) {
        throw new Error('Daya S harus lebih besar dari nol');
    }
    if (V <= 0) {
        throw new Error('Tegangan V harus lebih besar dari nol');
    }

    const akar3 = Math.sqrt(3);
    const I = (S * 1000) / (akar3 * V);
    return I;
};

// Supaya bisa diuji dengan Node
if (typeof module !== "undefined") {
    module.exports = Rumus;
}