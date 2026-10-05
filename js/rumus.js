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

/**
 * Hitung tahanan kabel tembaga pulang-pergi
 * @param {number} L - Panjang kabel satu arah dalam meter
 * @param {number} A - Luas penampang kabel dalam mm²
 * @returns {number} Tahanan kabel pulang-pergi dalam Ω
 * @throws {Error} Jika input tidak valid
 */
Rumus.tahananKabelTembaga = function(L, A) {
    // Validasi input
    if (typeof L !== 'number' || isNaN(L)) {
        throw new Error('Panjang kabel harus berupa angka');
    }
    if (typeof A !== 'number' || isNaN(A)) {
        throw new Error('Luas penampang kabel harus berupa angka');
    }
    if (L <= 0) {
        throw new Error('Panjang kabel harus lebih besar dari nol');
    }
    if (A <= 0) {
        throw new Error('Luas penampang kabel harus lebih besar dari nol');
    }

    // Resistivitas tembaga pada 20 °C: 0,0175 Ω·mm²/m
    const RESISTIVITAS_TEMBAGA = 0.0175;
    // Rumus: R = 2 × L × ρ / A (pulang-pergi)
    const R_kabel = 2 * L * RESISTIVITAS_TEMBAGA / A;
    return R_kabel;
};

/**
 * Hitung arus sekunder CT dan burden
 * @param {number} I_prim - Arus primer CT dalam A
 * @param {number} I_sek_rating - Arus sekunder rating CT dalam A (misal: 1 atau 5)
 * @param {number} I_prim_rating - Arus primer rating CT dalam A
 * @param {number} R_relay - Tahanan relay dalam Ω
 * @param {number} R_kabel - Tahanan kabel total pulang-pergi dalam Ω
 * @param {number} burdenRating - Rating burden CT dalam VA (opsional)
 * @returns {{I_sek: number, VA: number, burdenRating: number, burdenPercent: number}} Objek dengan I_sek (A), VA (VA), burdenRating (VA), dan burdenPercent (%)
 * @throws {Error} Jika input tidak valid
 */
Rumus.arusSekunderCT = function(I_prim, I_sek_rating, I_prim_rating, R_relay, R_kabel, burdenRating) {
    // Validasi input
    if (typeof I_prim !== 'number' || isNaN(I_prim)) {
        throw new Error('Arus primer I_prim harus berupa angka');
    }
    if (typeof I_sek_rating !== 'number' || isNaN(I_sek_rating)) {
        throw new Error('Arus sekunder rating I_sek_rating harus berupa angka');
    }
    if (typeof I_prim_rating !== 'number' || isNaN(I_prim_rating)) {
        throw new Error('Arus primer rating I_prim_rating harus berupa angka');
    }
    if (typeof R_relay !== 'number' || isNaN(R_relay)) {
        throw new Error('Tahanan relay harus berupa angka');
    }
    if (typeof R_kabel !== 'number' || isNaN(R_kabel)) {
        throw new Error('Tahanan kabel harus berupa angka');
    }
    if (I_prim <= 0) {
        throw new Error('Arus primer I_prim harus lebih besar dari nol');
    }
    if (I_sek_rating <= 0) {
        throw new Error('Arus sekunder rating I_sek_rating harus lebih besar dari nol');
    }
    if (I_prim_rating <= 0) {
        throw new Error('Arus primer rating I_prim_rating harus lebih besar dari nol');
    }
    if (R_relay < 0) {
        throw new Error('Tahanan relay tidak boleh negatif');
    }
    if (R_kabel < 0) {
        throw new Error('Tahanan kabel tidak boleh negatif');
    }
    // burdenRating adalah opsional, jika diberikan maka harus valid
    if (burdenRating !== undefined && burdenRating !== null) {
        if (typeof burdenRating !== 'number' || isNaN(burdenRating)) {
            throw new Error('Rating burden CT harus berupa angka');
        }
        if (burdenRating <= 0) {
            throw new Error('Rating burden CT harus lebih besar dari nol');
        }
    }

    const I_sek = I_prim * (I_sek_rating / I_prim_rating);
    const R_total = R_relay + R_kabel;
    const VA = I_sek * I_sek * R_total; // I_sek^2 * R_total

    const result = {
        I_sek: I_sek,
        VA: VA
    };

    // Tambahkan info burden rating jika diberikan
    if (burdenRating !== undefined && burdenRating !== null) {
        result.burdenRating = burdenRating;
        result.burdenPercent = (VA / burdenRating) * 100;
    }

    return result;
};

/**
 * Konversi kilovolt ke volt
 * @param {number} kV - Tegangan dalam kilovolt
 * @returns {number} Tegangan dalam volt
 * @throws {Error} Jika input tidak valid
 */
Rumus.kVkeV = function(kV) {
    if (typeof kV !== 'number' || isNaN(kV)) {
        throw new Error('Tegangan kV harus berupa angka');
    }
    return kV * 1000;
};

/**
 * Konversi volt ke kilovolt
 * @param {number} V - Tegangan dalam volt
 * @returns {number} Tegangan dalam kilovolt
 * @throws {Error} Jika input tidak valid
 */
Rumus.VkekV = function(V) {
    if (typeof V !== 'number' || isNaN(V)) {
        throw new Error('Tegangan V harus berupa angka');
    }
    return V / 1000;
};

/**
 * Konversi kiloampere ke ampere
 * @param {number} kA - Arus dalam kiloampere
 * @returns {number} Arus dalam ampere
 * @throws {Error} Jika input tidak valid
 */
Rumus.kAkeA = function(kA) {
    if (typeof kA !== 'number' || isNaN(kA)) {
        throw new Error('Arus kA harus berupa angka');
    }
    return kA * 1000;
};

/**
 * Konversi ampere ke kiloampere
 * @param {number} A - Arus dalam ampere
 * @returns {number} Arus dalam kiloampere
 * @throws {Error} Jika input tidak valid
 */
Rumus.AkekA = function(A) {
    if (typeof A !== 'number' || isNaN(A)) {
        throw new Error('Arus A harus berupa angka');
    }
    return A / 1000;
};

/**
 * Konversi megavolt-ampere ke kilovolt-ampere
 * @param {number} MVA - Daya dalam megavolt-ampere
 * @returns {number} Daya dalam kilovolt-ampere
 * @throws {Error} Jika input tidak valid
 */
Rumus.MVaketaVA = function(MVA) {
    if (typeof MVA !== 'number' || isNaN(MVA)) {
        throw new Error('Daya MVA harus berupa angka');
    }
    return MVA * 1000;
};

/**
 * Konversi kilovolt-ampere ke megavolt-ampere
 * @param {number} kVA - Daya dalam kilovolt-ampere
 * @returns {number} Daya dalam megavolt-ampere
 * @throws {Error} Jika input tidak valid
 */
Rumus.kVAkeMVA = function(kVA) {
    if (typeof kVA !== 'number' || isNaN(kVA)) {
        throw new Error('Daya kVA harus berupa angka');
    }
    return kVA / 1000;
};

/**
 * Konversi derajat Celsius ke Kelvin
 * @param {number} C - Suhu dalam derajat Celsius
 * @returns {number} Suhu dalam Kelvin
 * @throws {Error} Jika input tidak valid
 */
Rumus.CkeK = function(C) {
    if (typeof C !== 'number' || isNaN(C)) {
        throw new Error('Suhu Celsius harus berupa angka');
    }
    return C + 273.15;
};

/**
 * Konversi Kelvin ke derajat Celsius
 * @param {number} K - Suhu dalam Kelvin
 * @returns {number} Suhu dalam derajat Celsius
 * @throws {Error} Jika input tidak valid
 */
Rumus.KkeC = function(K) {
    if (typeof K !== 'number' || isNaN(K)) {
        throw new Error('Suhu Kelvin harus berupa angka');
    }
    return K - 273.15;
};

/**
 * Hitung tegangan per posisi tap
 * @param {number} V_nominal - Tegangan nominal dalam kV
 * @param {number} n - Posisi tap (biasa bilangan bulat, bisa positip atau negatif)
 * @param {number} stepPercent - Persentase langkah tap dalam persen
 * @returns {number} Tegangan setelah tap dalam kV
 * @throws {Error} Jika input tidak valid
 */
Rumus.teganganPerPosisiTap = function(V_nominal, n, stepPercent) {
    // Validasi input
    if (typeof V_nominal !== 'number' || isNaN(V_nominal)) {
        throw new Error('Tegangan nominal V_nominal harus berupa angka');
    }
    if (typeof n !== 'number' || isNaN(n)) {
        throw new Error('Posisi tap n harus berupa angka');
    }
    if (typeof stepPercent !== 'number' || isNaN(stepPercent)) {
        throw new Error('Persentase langkah stepPercent harus berupa angka');
    }
    if (V_nominal <= 0) {
        throw new Error('Tegangan nominal V_nominal harus lebih besar dari nol');
    }
    // n bisa nol (tap tengah), jadi tidak perlu validasi khusus untuk nol
    if (stepPercent < 0) {
        throw new Error('Persentase langkah stepPercent tidak boleh negatif');
    }

    const V_tap = V_nominal * (1 + n * stepPercent / 100);
    return V_tap;
};

/**
 * Hitung kapasitor perbaikan cos φ
 * @param {number} P - Daya aktif dalam MW
 * @param {number} cosPhi1 - Faktor daya awal (0 sampai 1)
 * @param {number} cosPhi2 - Faktor daya target (0 sampai 1)
 * @returns {number} Besar kapasitor yang diperlukan dalam MVAR
 * @throws {Error} Jika input tidak valid
 */
Rumus.kapasitorPerbaikanCosPhi = function(P, cosPhi1, cosPhi2) {
    // Validasi input
    if (typeof P !== 'number' || isNaN(P)) {
        throw new Error('Daya aktif P harus berupa angka');
    }
    if (typeof cosPhi1 !== 'number' || isNaN(cosPhi1)) {
        throw new Error('Faktor daya awal cos φ1 harus berupa angka');
    }
    if (typeof cosPhi2 !== 'number' || isNaN(cosPhi2)) {
        throw new Error('Faktor daya target cos φ2 harus berupa angka');
    }
    if (P <= 0) {
        throw new Error('Daya aktif P harus lebih besar dari nol');
    }
    if (cosPhi1 <= 0 || cosPhi1 > 1) {
        throw new Error('Faktor daya awal cos φ1 harus antara 0 dan 1');
    }
    if (cosPhi2 <= 0 || cosPhi2 > 1) {
        throw new Error('Faktor daya target cos φ2 harus antara 0 dan 1');
    }
    // Pastikan cos φ2 > cos φ1 (perbaikan daya)
    if (cosPhi2 <= cosPhi1) {
        throw new Error('Faktor daya target cos φ2 harus lebih besar dari cos φ1');
    }

    // Hitung tan φ1 dan tan φ2
    const tanPhi1 = Math.tan(Math.acos(cosPhi1));
    const tanPhi2 = Math.tan(Math.acos(cosPhi2));

    // Hitung kapasitor yang diperlukan
    const Qc = P * (tanPhi1 - tanPhi2);
    return Qc;
};

/**
 * Hitung waktu kerja relay OCR, kurva IEC 60255
 * @param {string} curveType - Jenis kurva: 'SI', 'VI', atau 'EI'
 * @param {number} TMS - Time Multiplier Setting
 * @param {number} I_over_Is - Rasio arus masuk terhadap arus set
 * @returns {number} Waktu kerja dalam detik
 * @throws {Error} Jika input tidak valid
 */
Rumus.waktuKerjaRelayOCR = function(curveType, TMS, I_over_Is) {
    // Validasi input
    if (typeof curveType !== 'string') {
        throw new Error('Jenis kurva harus berupa string');
    }
    if (!['SI', 'VI', 'EI'].includes(curveType)) {
        throw new Error('Jenis kurva harus SI, VI, atau EI');
    }
    if (typeof TMS !== 'number' || isNaN(TMS)) {
        throw new Error('TMS harus berupa angka');
    }
    if (typeof I_over_Is !== 'number' || isNaN(I_over_Is)) {
        throw new Error('I/I_s harus berupa angka');
    }
    if (TMS <= 0) {
        throw new Error('TMS harus lebih besar dari nol');
    }
    if (I_over_Is <= 0) {
        throw new Error('I/I_s harus lebih besar dari nol');
    }

    // Jika I/I_s <= 1, relay tidak bekerja
    if (I_over_Is <= 1) {
        return null; // atau bisa kembalikan string "relay tidak bekerja"
    }

    // Parameter k dan α berdasarkan jenis kurva
    let k, alpha;
    switch (curveType) {
        case 'SI': // Standard Inverse
            k = 0.14;
            alpha = 0.02;
            break;
        case 'VI': // Very Inverse
            k = 13.5;
            alpha = 1;
            break;
        case 'EI': // Extremely Inverse
            k = 80;
            alpha = 2;
            break;
        default:
            throw new Error('Jenis kurva tidak valid');
    }

    // Rumus IEC 60255: t = TMS × k / ((I / I_s)^α − 1)
    const t = TMS * k / (Math.pow(I_over_Is, alpha) - 1);
    return t;
};

/**
 * Hitung estimasi lokasi gangguan
 * @param {number} nilai_gangguan - Nilai gangguan (impedansi atau reaktansi) dalam Ω
 * @param {number} nilai_per_km - Nilai per kilometer (impedansi atau reaktansi) dalam Ω/km
 * @param {number} [panjang_saluran] - Panjang saluran dalam km (opsional)
 * @param {string} [metode] - Metode perhitungan: 'impedansi' atau 'reaktansi' (default: 'impedansi')
 * @returns {{jarak: number, persen: number, jarak_dari_ujung_lain: number, metode: string, peringatan: string}} Objek dengan hasil perhitungan
 * @throws {Error} Jika input tidak valid
 */
Rumus.estimasiLokasiGangguan = function(nilai_gangguan, nilai_per_km, panjang_saluran, metode) {
    // Validasi input
    if (typeof nilai_gangguan !== 'number' || isNaN(nilai_gangguan)) {
        throw new Error('Nilai gangguan harus berupa angka');
    }
    if (typeof nilai_per_km !== 'number' || isNaN(nilai_per_km)) {
        throw new Error('Nilai per kilometer harus berupa angka');
    }
    if (nilai_gangguan < 0) {
        throw new Error('Nilai gangguan tidak boleh negatif');
    }
    if (nilai_per_km <= 0) {
        throw new Error('Nilai per kilometer harus lebih besar dari nol');
    }

    // Set default values
    metode = metode || 'impedansi';
    if (metode !== 'impedansi' && metode !== 'reaktansi') {
        throw new Error('Metode harus berupa \"impedansi\" atau \"reaktansi\"');
    }

    // Hitung jarak
    const jarak = nilai_gangguan / nilai_per_km;

    // Hitung persen dan jarak dari ujung lain jika panjang saluran diberikan
    let persen = null;
    let jarak_dari_ujung_lain = null;
    let peringatan = null;

    if (panjang_saluran !== undefined && panjang_saluran !== null) {
        if (typeof panjang_saluran !== 'number' || isNaN(panjang_saluran)) {
            throw new Error('Panjang saluran harus berupa angka');
        }
        if (panjang_saluran <= 0) {
            throw new Error('Panjang saluran harus lebih besar dari nol');
        }

        persen = (jarak / panjang_saluran) * 100;
        jarak_dari_ujung_lain = panjang_saluran - jarak;

        // Peringatan jika jarak melebihi panjang saluran
        if (jarak > panjang_saluran) {
            peringatan = 'Lokasi di luar panjang saluran. Periksa data atau kemungkinan gangguan di saluran berikutnya.';
        }
    }

    return {
        jarak: jarak,
        persen: persen,
        jarak_dari_ujung_lain: jarak_dari_ujung_lain,
        metode: metode,
        peringatan: peringatan
    };
};

/**
 * Hitung drop tegangan saluran 3 fasa
 * @param {number} I - Arus dalam A
 * @param {number} L - Panjang saluran dalam km
 * @param {number} R - Resistansi per kilometer dalam Ω/km
 * @param {number} X - Reaktansi per kilometer dalam Ω/km
 * @param {number} cosPhi - Faktor daya (cos φ)
 * @param {number} V - Tegangan dalam kV (untuk menghitung persentase drop tegangan)
 * @returns {{dropTegangan: number, persen: number}} Objek dengan drop tegangan dalam V dan persentase terhadap tegangan
 * @throws {Error} Jika input tidak valid
 */
Rumus.dropTeganganSaluran3Fasa = function(I, L, R, X, cosPhi, V) {
    // Validasi input
    if (typeof I !== 'number' || isNaN(I)) {
        throw new Error('Arus I harus berupa angka');
    }
    if (typeof L !== 'number' || isNaN(L)) {
        throw new Error('Panjang saluran L harus berupa angka');
    }
    if (typeof R !== 'number' || isNaN(R)) {
        throw new Error('Resistansi R harus berupa angka');
    }
    if (typeof X !== 'number' || isNaN(X)) {
        throw new Error('Reaktansi X harus berupa angka');
    }
    if (typeof cosPhi !== 'number' || isNaN(cosPhi)) {
        throw new Error('Faktor daya cos φ harus berupa angka');
    }
    if (typeof V !== 'number' || isNaN(V)) {
        throw new Error('Tegangan V harus berupa angka');
    }
    if (I < 0) {
        throw new Error('Arus I tidak boleh negatif');
    }
    if (L <= 0) {
        throw new Error('Panjang saluran L harus lebih besar dari nol');
    }
    if (R < 0) {
        throw new Error('Resistansi R tidak boleh negatif');
    }
    if (X < 0) {
        throw new Error('Reaktansi X tidak boleh negatif');
    }
    if (cosPhi < 0 || cosPhi > 1) {
        throw new Error('Faktor daya cos φ harus antara 0 dan 1');
    }
    if (V <= 0) {
        throw new Error('Tegangan V harus lebih besar dari nol');
    }

    // Hitung sin φ dari cos φ
    // Sin φ = √(1 - cos²φ)
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);

    // Rumus: ΔV ≈ √3 × I × L × (R cos φ + X sin φ)
    const akar3 = Math.sqrt(3);
    const dropTegangan = akar3 * I * L * (R * cosPhi + X * sinPhi);

    // Hitung persentase drop tegangan terhadap tegangan
    // V dalam kV, dropTegangan dalam V, jadi konversi V ke kV untuk perhitungan persen
    const V_kV = V; // Tegangan sudah dalam kV
    const dropTegangan_kV = dropTegangan / 1000; // Konversi drop tegangan dari V ke kV
    const persen = (dropTegangan_kV / V_kV) * 100;

    return {
        dropTegangan: dropTegangan, // dalam volt
        persen: persen // dalam persen
    };
};

/**
 * Hitung rugi daya saluran
 * @param {number} I - Arus dalam A
 * @param {number} R - Resistansi per kilometer dalam Ω/km
 * @param {number} L - Panjang saluran dalam km
 * @returns {number} Rugi daya dalam watt
 * @throws {Error} Jika input tidak valid
 */
Rumus.rugiDayaSaluran = function(I, R, L) {
    // Validasi input
    if (typeof I !== 'number' || isNaN(I)) {
        throw new Error('Arus I harus berupa angka');
    }
    if (typeof R !== 'number' || isNaN(R)) {
        throw new Error('Resistansi R harus berupa angka');
    }
    if (typeof L !== 'number' || isNaN(L)) {
        throw new Error('Panjang saluran L harus berupa angka');
    }
    if (I < 0) {
        throw new Error('Arus I tidak boleh negatif');
    }
    if (R < 0) {
        throw new Error('Resistansi R tidak boleh negatif');
    }
    if (L <= 0) {
        throw new Error('Panjang saluran L harus lebih besar dari nol');
    }

    // Rumus: P_loss = 3 × I² × R × L
    const P_loss = 3 * I * I * R * L;
    return P_loss;
};

/**
 * Hitung indeks polarisasi dan rasio absorpsi dielektrik
 * @param {number} R30detik - Tahanan setelah 30 detik dalam Ω (opsional)
 * @param {number} R1menit - Tahanan setelah 1 menit dalam Ω (sama dengan R 60 detik, wajib diisi)
 * @param {number} R10menit - Tahanan setelah 10 menit dalam Ω (opsional)
 * @returns {{PI: number, DAR: number}} Objek dengan PI (indeks polarisasi) dan DAR (rasio absorpsi dielektrik)
 * @throws {Error} Jika input tidak valid
 */
Rumus.indeksPolarisasiDAR = function(R30detik, R1menit, R10menit) {
    // Validasi input R1menit (wajib)
    if (typeof R1menit !== 'number' || isNaN(R1menit)) {
        throw new Error('Tahanan setelah 1 menit harus berupa angka');
    }
    if (R1menit <= 0) {
        throw new Error('Tahanan setelah 1 menit harus lebih besar dari nol');
    }

    // Validasi input opsional jika disediakan
    if (R30detik !== undefined && R30detik !== null) {
        if (typeof R30detik !== 'number' || isNaN(R30detik)) {
            throw new Error('Tahanan setelah 30 detik harus berupa angka');
        }
        if (R30detik <= 0) {
            throw new Error('Tahanan setelah 30 detik harus lebih besar dari nol');
        }
    }

    if (R10menit !== undefined && R10menit !== null) {
        if (typeof R10menit !== 'number' || isNaN(R10menit)) {
            throw new Error('Tahanan setelah 10 menit harus berupa angka');
        }
        if (R10menit <= 0) {
            throw new Error('Tahanan setelah 10 menit harus lebih besar dari nol');
        }
    }

    // Validasi bahwa minimal satu dari R30detik atau R10menit disediakan
    if ((R30detik === undefined || R30detik === null) &&
        (R10menit === undefined || R10menit === null)) {
        throw new Error('Minimal satu dari tahanan setelah 30 detik atau 10 menit harus diisi');
    }

    const result = {};

    // Hitung indeks polarisasi jika R10menit disediakan
    if (R10menit !== undefined && R10menit !== null) {
        result.PI = R10menit / R1menit; // Indeks polarisasi = R10menit / R1menit
    }

    // Hitung rasio absorpsi dielektrik jika R30detik disediakan
    if (R30detik !== undefined && R30detik !== null) {
        result.DAR = R1menit / R30detik; // Rasio absorpsi dielektrik = R1menit / R30detik
    }

    return result;
}

// Supaya bisa diuji dengan Node
if (typeof module !== "undefined") {
    module.exports = Rumus;
}