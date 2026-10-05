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

/**
 * Hitung segitiga daya
 * @param {number} P - Daya aktif dalam MW
 * @param {number} Q - Daya reaktif dalam MVAR
 * @returns {{S: number, cosPhi: number}} Objek dengan S (MVA) dan cos φ
 * @throws {Error} Jika input tidak valid
 */
Rumus.segitigaDaya = function(P, Q) {
    // Validasi input
    if (typeof P !== 'number' || isNaN(P)) {
        throw new Error('Daya aktif P harus berupa angka');
    }
    if (typeof Q !== 'number' || isNaN(Q)) {
        throw new Error('Daya reaktif Q harus berupa angka');
    }
    // Jika both P dan Q adalah nol
    if (P === 0 && Q === 0) {
        throw new Error('Daya aktif dan reaktif tidak boleh keduanya nol');
    }

    const S = Math.sqrt(P * P + Q * Q);
    const cosPhi = P / S;

    return {
        S: S,
        cosPhi: cosPhi
    };
};

/**
 * Hitung persentase pembebanan trafo
 * @param {number} S_ukur - Daya terukur dalam MVA
 * @param {number} S_rating - Daya rating trafo dalam MVA
 * @returns {number} Persentase pembebanan
 * @throws {Error} Jika input tidak valid
 */
Rumus.persentasePembebananTrafo = function(S_ukur, S_rating) {
    // Validasi input
    if (typeof S_ukur !== 'number' || isNaN(S_ukur)) {
        throw new Error('Daya terukur S_ukur harus berupa angka');
    }
    if (typeof S_rating !== 'number' || isNaN(S_rating)) {
        throw new Error('Daya rating S_rating harus berupa angka');
    }
    if (S_ukur < 0) {
        throw new Error('Daya terukur S_ukur tidak boleh negatif');
    }
    if (S_rating <= 0) {
        throw new Error('Daya rating S_rating harus lebih besar dari nol');
    }

    const persentase = (S_ukur / S_rating) * 100;
    return persentase;
};

/**
 * Hitung arus hubung singkat dari MVA hubung singkat
 * @param {number} MVA_sc - MVA hubung singkat
 * @param {number} V - Tegangan dalam kV
 * @returns {number} Arus hubung singkat dalam A
 * @throws {Error} Jika input tidak valid
 */
Rumus.arusHubungSingkatDariMVA = function(MVA_sc, V) {
    // Validasi input
    if (typeof MVA_sc !== 'number' || isNaN(MVA_sc)) {
        throw new Error('MVA hubung singkat harus berupa angka');
    }
    if (typeof V !== 'number' || isNaN(V)) {
        throw new Error('Tegangan V harus berupa angka');
    }
    if (MVA_sc <= 0) {
        throw new Error('MVA hubung singkat harus lebih besar dari nol');
    }
    if (V <= 0) {
        throw new Error('Tegangan V harus lebih besar dari nol');
    }

    const akar3 = Math.sqrt(3);
    const I_sc = (MVA_sc * 1000) / (akar3 * V);
    return I_sc;
};

/**
 * Hitung arus hubung singkat di terminal trafo
 * @param {number} S - Daya trafo dalam MVA
 * @param {number} V - Tegangan dalam kV
 * @param {number} Z_percent - Impedansi trafo dalam persen
 * @returns {number} Arus hubung singkat dalam A
 * @throws {Error} Jika input tidak valid
 */
Rumus.arusHubungSingkatTerminalTrafo = function(S, V, Z_percent) {
    // Validasi input
    if (typeof S !== 'number' || isNaN(S)) {
        throw new Error('Daya S harus berupa angka');
    }
    if (typeof V !== 'number' || isNaN(V)) {
        throw new Error('Tegangan V harus berupa angka');
    }
    if (typeof Z_percent !== 'number' || isNaN(Z_percent)) {
        throw new Error('Impedansi Z% harus berupa angka');
    }
    if (S <= 0) {
        throw new Error('Daya S harus lebih besar dari nol');
    }
    if (V <= 0) {
        throw new Error('Tegangan V harus lebih besar dari nol');
    }
    if (Z_percent <= 0) {
        throw new Error('Impedansi Z% harus lebih besar dari nol');
    }

    // Hitung arus nominal terlebih dahulu
    const I_nominal = Rumus.arusNominal3Fasa(S, V);
    // Hitung arus hubung singkat di terminal trafo
    const I_sc = I_nominal * 100 / Z_percent;
    return I_sc;
};

// Supaya bisa diuji dengan Node
if (typeof module !== "undefined") {
    module.exports = Rumus;
}