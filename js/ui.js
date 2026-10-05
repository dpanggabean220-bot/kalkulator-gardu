// logika tampilan: baca input, panggil rumus, tampilkan hasil
document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission for calculator 1
    const form1 = document.getElementById('form1');
    if (form1) {
        form1.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const dayaInput = document.getElementById('daya');
            const teganganInput = document.getElementById('tegangan');
            const hasilDiv = document.getElementById('hasil1');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            dayaInput.classList.remove('error-input');
            teganganInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form1.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const S = parseFloat(dayaInput.value);
                const V = parseFloat(teganganInput.value);

                // Validate empty inputs
                if (isNaN(S) || dayaInput.value.trim() === '') {
                    throw new Error('Daya S harus diisi');
                }
                if (isNaN(V) || teganganInput.value.trim() === '') {
                    throw new Error('Tegangan V harus diisi');
                }

                // Call the rumus function
                const I = Rumus.arusNominal3Fasa(S, V);

                // Format hasil dengan satuan dan locale Indonesia
                const hasilFormatted = I.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' A';

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Arus nominal:</strong> ${hasilFormatted}<br>
                    <strong>Rumus:</strong> I = S × 1000 / (√3 × V)<br>
                    <strong>Perhitungan:</strong> I = ${S} × 1000 / (√3 × ${V}) = ${I.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} A
                `;
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Daya S')) {
                    dayaInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    dayaInput.parentNode.insertBefore(errorElem, dayaInput.nextSibling);
                }
                if (error.message.includes('Tegangan V')) {
                    teganganInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    teganganInput.parentNode.insertBefore(errorElem, teganganInput.nextSibling);
                }

                // Tampilkan juga error umum di hasil div untuk debugging
                hasilDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
                hasilDiv.style.color = '#d32f2f';
            }
        });
    }

    // Handle form submission for calculator 2
    const form2 = document.getElementById('form2');
    if (form2) {
        form2.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const pInput = document.getElementById('dayaAktif');
            const qInput = document.getElementById('dayaReaktif');
            const hasilDiv = document.getElementById('hasil2');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            pInput.classList.remove('error-input');
            qInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form2.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const P = parseFloat(pInput.value);
                const Q = parseFloat(qInput.value);

                // Validate empty inputs
                if (isNaN(P) || pInput.value.trim() === '') {
                    throw new Error('Daya aktif P harus diisi');
                }
                if (isNaN(Q) || qInput.value.trim() === '') {
                    throw new Error('Daya reaktif Q harus diisi');
                }

                // Call the rumus function
                const result = Rumus.segitigaDaya(P, Q);

                // Format hasil dengan satuan dan locale Indonesia
                const sFormatted = result.S.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MVA';
                const cosPhiFormatted = result.cosPhi.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                // Determine beban sifat based on Q value
                let bebanSifat = '';
                if (Q > 0) {
                    bebanSifat = 'lagging (induktif)';
                } else if (Q < 0) {
                    bebanSifat = 'leading (kapasitif)';
                } else {
                    bebanSifat = 'beban resistif murni';
                }

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Daya S:</strong> ${sFormatted}<br>
                    <strong>cos φ:</strong> ${cosPhiFormatted}<br>
                    <strong>Sifat beban:</strong> ${bebanSifat}<br>
                    <strong>Rumus:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;S = √(P² + Q²)<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;cos φ = P / S<br>
                    <strong>Perhitungan:</strong><br>
                    &nbsp;&nbsp;&nbsp;&nbsp;S = √(${P}² + ${Q}²) = ${result.S.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MVA<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;cos φ = ${P} / ${result.S.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${result.cosPhi.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                `;
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Daya aktif P')) {
                    pInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    pInput.parentNode.insertBefore(errorElem, pInput.nextSibling);
                }
                if (error.message.includes('Daya reaktif Q')) {
                    qInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    qInput.parentNode.insertBefore(errorElem, qInput.nextSibling);
                }

                // Tampilkan juga error umum di hasil div untuk debugging
                hasilDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
                hasilDiv.style.color = '#d32f2f';
            }
        });
    }

    // Handle form submission for calculator 3
    const form3 = document.getElementById('form3');
    if (form3) {
        // First, set up mode switching
        const modeRadios = form3.querySelectorAll('input[name="mode3"]');
        const modeContents = {
            mva: document.getElementById('mode-mva'),
            mw_mvar: document.getElementById('mode-mw_mvar'),
            arus: document.getElementById('mode-arus')
        };

        // Function to show the selected mode and hide others
        function showSelectedMode() {
            modeRadios.forEach(radio => {
                if (radio.checked) {
                    const mode = radio.value;
                    // Hide all mode contents
                    Object.values(modeContents).forEach(content => {
                        content.style.display = 'none';
                    });
                    // Show the selected one
                    if (modeContents[mode]) {
                        modeContents[mode].style.display = 'block';
                    }
                }
            });
        }

        // Add event listeners to radio buttons
        modeRadios.forEach(radio => {
            radio.addEventListener('change', showSelectedMode);
        });

        // Initialize the display to the default mode (MVA)
        showSelectedMode();

        // Now handle the form submission
        form3.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the selected mode
            let selectedMode = '';
            modeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedMode = radio.value;
                }
            });

            const hasilDiv = document.getElementById('hasil3');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';

            // Remove any existing error messages from all mode contents
            Object.values(modeContents).forEach(content => {
                const existingErrors = content.querySelectorAll('.error');
                existingErrors.forEach(el => el.remove());
            });

            // Also remove error-input class from all inputs
            const allInputs = form3.querySelectorAll('input[type="number"]');
            allInputs.forEach(input => {
                input.classList.remove('error-input');
            });

            try {
                let persentase;
                let perhitunganDetail = '';

                if (selectedMode === 'mva') {
                    // Mode 1: MVA terukur
                    const s_ukurInput = document.getElementById('s_ukur');
                    const s_ratingInput = document.getElementById('s_rating');

                    // Validate empty inputs
                    if (isNaN(parseFloat(s_ukurInput.value)) || s_ukurInput.value.trim() === '') {
                        throw new Error('Daya terukur S_ukur harus diisi');
                    }
                    if (isNaN(parseFloat(s_ratingInput.value)) || s_ratingInput.value.trim() === '') {
                        throw new Error('Daya rating S_rating harus diisi');
                    }

                    const S_ukur = parseFloat(s_ukurInput.value);
                    const S_rating = parseFloat(s_ratingInput.value);

                    // Validate non-negative for S_ukur and positive for S_rating
                    if (S_ukur < 0) {
                        throw new Error('Daya terukur S_ukur tidak boleh negatif');
                    }
                    if (S_rating <= 0) {
                        throw new Error('Daya rating S_rating harus lebih besar dari nol');
                    }

                    // Call the rumus function
                    persentase = Rumus.persentasePembebananTrafo(S_ukur, S_rating);

                    // Format hasil dengan satuan dan locale Indonesia
                    const persentaseFormatted = persentase.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';

                    // Tampilkan hasil
                    hasilDiv.innerHTML = `
                        <strong>Persentase pembebanan:</strong> ${persentaseFormatted}<br>
                        <strong>Rumus:</strong> % = S_ukur / S_rating × 100<br>
                        <strong>Perhitungan:</strong> % = ${S_ukur} / ${S_rating} × 100 = ${persentase.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
                    `;

                } else if (selectedMode === 'mw_mvar') {
                    // Mode 2: MW dan MVAR
                    const p_ukurInput = document.getElementById('p_ukur');
                    const q_ukurInput = document.getElementById('q_ukur');
                    const s_ratingInput = document.getElementById('s_rating2');

                    // Validate empty inputs
                    if (isNaN(parseFloat(p_ukurInput.value)) || p_ukurInput.value.trim() === '') {
                        throw new Error('Daya aktif P_ukur harus diisi');
                    }
                    if (isNaN(parseFloat(q_ukurInput.value)) || q_ukurInput.value.trim() === '') {
                        throw new Error('Daya reaktif Q_ukur harus diisi');
                    }
                    if (isNaN(parseFloat(s_ratingInput.value)) || s_ratingInput.value.trim() === '') {
                        throw new Error('Daya rating S_rating harus diisi');
                    }

                    const P = parseFloat(p_ukurInput.value);
                    const Q = parseFloat(q_ukurInput.value);
                    const S_rating = parseFloat(s_ratingInput.value);

                    // Validate S_rating positive
                    if (S_rating <= 0) {
                        throw new Error('Daya rating S_rating harus lebih besar dari nol');
                    }

                    // Hitung S terukur menggunakan fungsi segitigaDaya
                    const segitigaResult = Rumus.segitigaDaya(P, Q);
                    const S_ukur = segitigaResult.S;

                    // Hitung persentase pembebanan
                    persentase = Rumus.persentasePembebananTrafo(S_ukur, S_rating);

                    // Format hasil dengan satuan dan locale Indonesia
                    const persentaseFormatted = persentase.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
                    const s_ukurFormatted = S_ukur.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MVA';

                    // Tampilkan hasil
                    hasilDiv.innerHTML = `
                        <strong>Persentase pembebanan:</strong> ${persentaseFormatted}<br>
                        <strong>Rumus:</strong><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;S_ukur = √(P² + Q²)<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;% = S_ukur / S_rating × 100<br>
                        <strong>Perhitungan:</strong><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;S_ukur = √(${P}² + ${Q}²) = ${s_ukurFormatted}<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;% = ${s_ukurFormatted} / ${S_rating} × 100 = ${persentaseFormatted}
                    `;

                } else if (selectedMode === 'arus') {
                    // Mode 3: Arus terukur
                    const arus_ukurInput = document.getElementById('arus_ukur');
                    const tegangan_ukurInput = document.getElementById('tegangan_ukur');
                    const s_ratingInput = document.getElementById('s_rating3');

                    // Validate empty inputs
                    if (isNaN(parseFloat(arus_ukurInput.value)) || arus_ukurInput.value.trim() === '') {
                        throw new Error('Arus terukur I_ukur harus diisi');
                    }
                    if (isNaN(parseFloat(tegangan_ukurInput.value)) || tegangan_ukurInput.value.trim() === '') {
                        throw new Error('Tegangan terukur V_ukur harus diisi');
                    }
                    if (isNaN(parseFloat(s_ratingInput.value)) || s_ratingInput.value.trim() === '') {
                        throw new Error('Daya rating S_rating harus diisi');
                    }

                    const I_ukur = parseFloat(arus_ukurInput.value);
                    const V_ukur = parseFloat(tegangan_ukurInput.value);
                    const S_rating = parseFloat(s_ratingInput.value);

                    // Validate positive for V_ukur and S_rating
                    if (V_ukur <= 0) {
                        throw new Error('Tegangan terukur V_ukur harus lebih besar dari nol');
                    }
                    if (S_rating <= 0) {
                        throw new Error('Daya rating S_rating harus lebih besar dari nol');
                    }

                    // Hitung arus nominal menggunakan fungsi arusNominal3Fasa
                    // Note: arusNominal3Fasa(S, V) expects S in MVA and V in kV, returns I in A
                    const I_nominal = Rumus.arusNominal3Fasa(S_rating, V_ukur);

                    // Hitung persentase pembebanan
                    persentase = (I_ukur / I_nominal) * 100;

                    // Format hasil dengan satuan dan locale Indonesia
                    const persentaseFormatted = persentase.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
                    const i_nominalFormatted = I_nominal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' A';

                    // Tampilkan hasil
                    hasilDiv.innerHTML = `
                        <strong>Persentase pembebanan:</strong> ${persentaseFormatted}<br>
                        <strong>Rumus:</strong><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;I_nominal = S_rating × 1000 / (√3 × V_ukur)<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;% = I_ukur / I_nominal × 100<br>
                        <strong>Perhitungan:</strong><br>
                        &nbsp;&nbsp;&nbsp;&nbsp;I_nominal = ${S_rating} × 1000 / (√3 × ${V_ukur}) = ${i_nominalFormatted}<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;% = ${I_ukur.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${i_nominalFormatted} × 100 = ${persentaseFormatted}
                    `;

                } else {
                    throw new Error('Mode input tidak valid');
                }

                // Tambahkan peringatan jika di atas 100%
                if (persentase > 100) {
                    hasilDiv.innerHTML += '<br><span style="color: #d32f2f; font-weight: bold;">Peringatan: Trafo berbeban lebih</span>';
                }

            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (selectedMode === 'mva') {
                    if (error.message.includes('S_ukur')) {
                        const s_ukurInput = document.getElementById('s_ukur');
                        s_ukurInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        s_ukurInput.parentNode.insertBefore(errorElem, s_ukurInput.nextSibling);
                    }
                    if (error.message.includes('S_rating')) {
                        const s_ratingInput = document.getElementById('s_rating');
                        s_ratingInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        s_ratingInput.parentNode.insertBefore(errorElem, s_ratingInput.nextSibling);
                    }
                } else if (selectedMode === 'mw_mvar') {
                    if (error.message.includes('P_ukur')) {
                        const p_ukurInput = document.getElementById('p_ukur');
                        p_ukurInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        p_ukurInput.parentNode.insertBefore(errorElem, p_ukurInput.nextSibling);
                    }
                    if (error.message.includes('Q_ukur')) {
                        const q_ukurInput = document.getElementById('q_ukur');
                        q_ukurInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        q_ukurInput.parentNode.insertBefore(errorElem, q_ukurInput.nextSibling);
                    }
                    if (error.message.includes('S_rating')) {
                        const s_ratingInput = document.getElementById('s_rating2');
                        s_ratingInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        s_ratingInput.parentNode.insertBefore(errorElem, s_ratingInput.nextSibling);
                    }
                } else if (selectedMode === 'arus') {
                    if (error.message.includes('I_ukur')) {
                        const arus_ukurInput = document.getElementById('arus_ukur');
                        arus_ukurInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        arus_ukurInput.parentNode.insertBefore(errorElem, arus_ukurInput.nextSibling);
                    }
                    if (error.message.includes('V_ukur')) {
                        const tegangan_ukurInput = document.getElementById('tegangan_ukur');
                        tegangan_ukurInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        tegangan_ukurInput.parentNode.insertBefore(errorElem, tegangan_ukurInput.nextSibling);
                    }
                    if (error.message.includes('S_rating')) {
                        const s_ratingInput = document.getElementById('s_rating3');
                        s_ratingInput.classList.add('error-input');
                        const errorElem = document.createElement('div');
                        errorElem.className = 'error';
                        errorElem.textContent = error.message;
                        s_ratingInput.parentNode.insertBefore(errorElem, s_ratingInput.nextSibling);
                    }
                }

                // Tampilkan juga error umum di hasil div untuk debugging
                hasilDiv.innerHTML += '<br><strong>Error:</strong> ' + error.message;
                hasilDiv.style.color = '#d32f2f';
            }
        });
    }

// Handle form submission for calculator 6
const form6 = document.getElementById('form6');
if (form6) {
    form6.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const mvascInput = document.getElementById('mvasc');
        const tegangan6Input = document.getElementById('tegangan6');
        const hasilDiv = document.getElementById('hasil6');

        // Clear previous results and errors
        hasilDiv.innerHTML = '';
        mvascInput.classList.remove('error-input');
        tegangan6Input.classList.remove('error-input');

        // Remove any existing error messages
        const existingErrors = form6.querySelectorAll('.error');
        existingErrors.forEach(el => el.remove());

        try {
            const MVA_sc = parseFloat(mvascInput.value);
            const V = parseFloat(tegangan6Input.value);

            // Validate empty inputs
            if (isNaN(MVA_sc) || mvascInput.value.trim() === '') {
                throw new Error('MVA hubung singkat harus diisi');
            }
            if (isNaN(V) || tegangan6Input.value.trim() === '') {
                throw new Error('Tegangan V harus diisi');
            }

            // Call the rumus function
            const I_sc = Rumus.arusHubungSingkatDariMVA(MVA_sc, V);
            const I_sc_kA = I_sc / 1000;

            // Format hasil dengan satuan dan locale Indonesia
            const hasilFormatted_kA = I_sc_kA.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kA';
            const hasilFormatted_A = I_sc.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' A';

            // Tampilkan hasil
            hasilDiv.innerHTML = `
                <strong>Arus hubung singkat:</strong> ${hasilFormatted_kA}<br>
                <small>${hasilFormatted_A}</small><br>
                <strong>Rumus:</strong> I_sc = MVA_sc × 1000 / (√3 × V)<br>
                <strong>Perhitungan:</strong> I_sc = ${MVA_sc} × 1000 / (√3 × ${V}) = ${hasilFormatted_A}
            `;
        } catch (error) {
            // Tampilkan error di dekat kolom yang salah
            if (error.message.includes('MVA hubung singkat')) {
                mvascInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                mvascInput.parentNode.insertBefore(errorElem, mvascInput.nextSibling);
            }
            if (error.message.includes('Tegangan V')) {
                tegangan6Input.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                tegangan6Input.parentNode.insertBefore(errorElem, tegangan6Input.nextSibling);
            }

            // Tampilkan juga error umum di hasil div untuk debugging
            hasilDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
            hasilDiv.style.color = '#d32f2f';
        }
    });
}

// Handle form submission for calculator 7
const form7 = document.getElementById('form7');
if (form7) {
    form7.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const daya7Input = document.getElementById('daya7');
        const tegangan7Input = document.getElementById('tegangan7');
        const zPercent7Input = document.getElementById('z_percent7');
        const hasilDiv = document.getElementById('hasil7');

        // Clear previous results and errors
        hasilDiv.innerHTML = '';
        daya7Input.classList.remove('error-input');
        tegangan7Input.classList.remove('error-input');
        zPercent7Input.classList.remove('error-input');

        // Remove any existing error messages
        const existingErrors = form7.querySelectorAll('.error');
        existingErrors.forEach(el => el.remove());

        try {
            const S = parseFloat(daya7Input.value);
            const V = parseFloat(tegangan7Input.value);
            const Z_percent = parseFloat(zPercent7Input.value);

            // Validate empty inputs
            if (isNaN(S) || daya7Input.value.trim() === '') {
                throw new Error('Daya S harus diisi');
            }
            if (isNaN(V) || tegangan7Input.value.trim() === '') {
                throw new Error('Tegangan V harus diisi');
            }
            if (isNaN(Z_percent) || zPercent7Input.value.trim() === '') {
                throw new Error('Impedansi Z% harus diisi');
            }

            // Call the rumus function
            const I_sc = Rumus.arusHubungSingkatTerminalTrafo(S, V, Z_percent);
            const I_sc_kA = I_sc / 1000;

            // Format hasil dengan satuan dan locale Indonesia
            const hasilFormatted_kA = I_sc_kA.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kA';
            const hasilFormatted_A = I_sc.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' A';

            // Tampilkan hasil
            hasilDiv.innerHTML = `
                <strong>Arus hubung singkat:</strong> ${hasilFormatted_kA}<br>
                <small>${hasilFormatted_A}</small><br>
                <strong>Rumus:</strong> I_sc = I_nominal × 100 / Z%<br>
                <strong>Perhitungan:</strong> I_sc = ${I_sc.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} A
            `;
        } catch (error) {
            // Tampilkan error di dekat kolom yang salah
            if (error.message.includes('Daya S')) {
                daya7Input.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                daya7Input.parentNode.insertBefore(errorElem, daya7Input.nextSibling);
            }
            if (error.message.includes('Tegangan V')) {
                tegangan7Input.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                tegangan7Input.parentNode.insertBefore(errorElem, tegangan7Input.nextSibling);
            }
            if (error.message.includes('Impedansi Z%')) {
                zPercent7Input.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                zPercent7Input.parentNode.insertBefore(errorElem, zPercent7Input.nextSibling);
            }

            // Tampilkan juga error umum di hasil div untuk debugging
            hasilDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
            hasilDiv.style.color = '#d32f2f';
        }
    });
}

// Handle form submission for calculator 8
const form8 = document.getElementById('form8');
if (form8) {
    // First, set up mode switching for cable input
    const kabelModeRadios = form8.querySelectorAll('input[name="kabelMode"]');
    const kabelModeContents = {
        direct: document.getElementById('kabel-mode-direct'),
        length: document.getElementById('kabel-mode-length')
    };

    // Function to show the selected mode and hide others
    function showSelectedKabelMode() {
        kabelModeRadios.forEach(radio => {
            if (radio.checked) {
                const mode = radio.value;
                // Hide all mode contents
                Object.values(kabelModeContents).forEach(content => {
                    content.style.display = 'none';
                });
                // Show the selected one
                if (kabelModeContents[mode]) {
                    kabelModeContents[mode].style.display = 'block';
                }
            }
        });
    }

    // Add event listeners to radio buttons
    kabelModeRadios.forEach(radio => {
        radio.addEventListener('change', showSelectedKabelMode);
    });

    // Initialize the display to the default mode (direct)
    showSelectedKabelMode();

    form8.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const iPrimInput = document.getElementById('i_prim');
        const iSekRatingInput = document.getElementById('i_sek_rating');
        const iPrimRatingInput = document.getElementById('i_prim_rating');
        const burdenRatingInput = document.getElementById('burden_rating');
        const hasilDiv = document.getElementById('hasil8');

        // Clear previous results and errors
        hasilDiv.innerHTML = '';
        iPrimInput.classList.remove('error-input');
        iSekRatingInput.classList.remove('error-input');
        iPrimRatingInput.classList.remove('error-input');
        burdenRatingInput.classList.remove('error-input');

        // Clear error inputs for both cable modes
        const directModeInputs = [
            document.getElementById('tahanan_relay'),
            document.getElementById('tahanan_kabel')
        ];
        directModeInputs.forEach(input => {
            if (input) input.classList.remove('error-input');
        });

        const lengthModeInputs = [
            document.getElementById('tahanan_relay'),
            document.getElementById('panjang_kabel'),
            document.getElementById('luas_penampang')
        ];
        lengthModeInputs.forEach(input => {
            if (input) input.classList.remove('error-input');
        });

        // Remove any existing error messages
        const existingErrors = form8.querySelectorAll('.error');
        existingErrors.forEach(el => el.remove());

        try {
            const I_prim = parseFloat(iPrimInput.value);
            const I_sek_rating = parseFloat(iSekRatingInput.value);
            const I_prim_rating = parseFloat(iPrimRatingInput.value);

            let burdenRating = null;
            if (burdenRatingInput.value.trim() !== '') {
                burdenRating = parseFloat(burdenRatingInput.value);
                // Validate burden rating if provided
                if (isNaN(burdenRating)) {
                    throw new Error('Rating burden CT harus berupa angka');
                }
                if (burdenRating <= 0) {
                    throw new Error('Rating burden CT harus lebih besar dari nol');
                }
            }

            // Validate empty inputs for primary currents
            if (isNaN(I_prim) || iPrimInput.value.trim() === '') {
                throw new Error('Arus primer I_prim harus diisi');
            }
            if (isNaN(I_sek_rating) || iSekRatingInput.value.trim() === '') {
                throw new Error('Arus sekunder rating I_sek_rating harus diisi');
            }
            if (isNaN(I_prim_rating) || iPrimRatingInput.value.trim() === '') {
                throw new Error('Arus primer rating I_prim_rating harus diisi');
            }

            // Get selected cable mode
            let selectedKabelMode = '';
            kabelModeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedKabelMode = radio.value;
                }
            });

            let R_relay;
            let R_kabel;

            if (selectedKabelMode === 'direct') {
                // Mode 1: Direct input of resistances
                const tahananRelayInput = document.getElementById('tahanan_relay');
                const tahananKabelInput = document.getElementById('tahanan_kabel');

                // Validate empty inputs
                if (isNaN(parseFloat(tahananRelayInput.value)) || tahananRelayInput.value.trim() === '') {
                    throw new Error('Tahanan relay harus diisi');
                }
                if (isNaN(parseFloat(tahananKabelInput.value)) || tahananKabelInput.value.trim() === '') {
                    throw new Error('Tahanan kabel total pulang-pergi harus diisi');
                }

                R_relay = parseFloat(tahananRelayInput.value);
                R_kabel = parseFloat(tahananKabelInput.value);

                // Validate resistance values
                if (R_relay < 0) {
                    throw new Error('Tahanan relay tidak boleh negatif');
                }
                if (R_kabel < 0) {
                    throw new Error('Tahanan kabel tidak boleh negatif');
                }
            } else if (selectedKabelMode === 'length') {
                // Mode 2: Calculate resistance from cable length and cross-section
                const tahananRelayInput = document.getElementById('tahanan_relay');
                const panjangKabelInput = document.getElementById('panjang_kabel');
                const luasPenampangInput = document.getElementById('luas_penampang');

                // Validate empty inputs
                if (isNaN(parseFloat(tahananRelayInput.value)) || tahananRelayInput.value.trim() === '') {
                    throw new Error('Tahanan relay harus diisi');
                }
                if (isNaN(parseFloat(panjangKabelInput.value)) || panjangKabelInput.value.trim() === '') {
                    throw new Error('Panjang kabel satu arah harus diisi');
                }
                if (isNaN(parseFloat(luasPenampangInput.value)) || luasPenampangInput.value.trim() === '') {
                    throw new Error('Luas penampang kabel harus diisi');
                }

                R_relay = parseFloat(tahananRelayInput.value);
                const panjangKabel = parseFloat(panjangKabelInput.value);
                const luasPenampang = parseFloat(luasPenampangInput.value);

                // Validate values
                if (R_relay < 0) {
                    throw new Error('Tahanan relay tidak boleh negatif');
                }
                if (panjangKabel <= 0) {
                    throw new Error('Panjang kabel satu arah harus lebih besar dari nol');
                }
                if (luasPenampang <= 0) {
                    throw new Error('Luas penampang kabel harus lebih besar dari nol');
                }

                // Calculate cable resistance using the rumus function
                R_kabel = Rumus.tahananKabelTembaga(panjangKabel, luasPenampang);
            } else {
                throw new Error('Mode input kabel tidak valid');
            }

            // Call the rumus function
            const result = Rumus.arusSekunderCT(I_prim, I_sek_rating, I_prim_rating, R_relay, R_kabel, burdenRating);

            // Format hasil dengan satuan dan locale Indonesia
            const iSekFormatted = result.I_sek.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' A';
            const vaFormatted = result.VA.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VA';

            // Tampilkan hasil
            let hasilHTML = `
                <strong>Arus sekunder:</strong> ${iSekFormatted}<br>
                <strong>Burden:</strong> ${vaFormatted}<br>
            `;

            // Add burden rating info if provided
            if (burdenRating !== null) {
                const burdenPercentFormatted = result.burdenPercent.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
                const burdenRatingFormatted = burdenRating.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' VA';

                hasilHTML += `<strong>Rating burden CT:</strong> ${burdenRatingFormatted}<br>
                <strong>Persentase pemakaian burden:</strong> ${burdenPercentFormatted}<br>`;

                // Add warning if burden exceeds rating
                if (result.burdenPercent > 100) {
                    hasilHTML += `<br><span style="color: #d32f2f; font-weight: bold;">Peringatan: Burden melebihi rating CT</span><br>`;
                }
            }

            hasilHTML += `
                <strong>Rumus:</strong><br>
                &nbsp;&nbsp;&nbsp;&nbsp;I_sek = I_prim × (I_sek_rating / I_prim_rating)<br>
                &nbsp;&nbsp;&nbsp;&nbsp;R_total = R_relay + R_kabel<br>
                &nbsp;&nbsp;&nbsp;&nbsp;VA = I_sek² × R_total<br>
                <strong>Perhitungan:</strong><br>
                &nbsp;&nbsp;&nbsp;&nbsp;I_sek = ${I_prim} × (${I_sek_rating} / ${I_prim_rating}) = ${result.I_sek.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} A<br>
                &nbsp;&nbsp;&nbsp;&nbsp;R_total = ${R_relay.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${R_kabel.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${(R_relay + R_kabel).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ω<be>
                &nbsp;&nbsp;&nbsp;&nbsp;VA = ${result.I_sek.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}² × ${(R_relay + R_kabel).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${result.VA.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} VA
            `;

            // Add cable resistance calculation info if using length mode
            if (selectedKabelMode === 'length') {
                hasilHTML += `<br><strong>Perhitungan tahanan kabel:</strong><br>
                &nbsp;&nbsp;&nbsp;&nbsp;R_kabel = 2 × L × ρ / A<br>
                &nbsp;&nbsp;&nbsp;&nbsp;R_kabel = 2 × ${panjangKabel} × 0,0175 / ${luasPenampang} = ${R_kabel.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} Ω<br>
                <small>Catatan: Nilai 0,0175 Ω·mm²/m adalah resistivitas tembaga pada 20 °C</small>`;
            }

            hasilDiv.innerHTML = hasilHTML;
        } catch (error) {
            // Tampilkan error di dekat kolom yang salah
            if (error.message.includes('Arus primer I_prim')) {
                iPrimInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                iPrimInput.parentNode.insertBefore(errorElem, iPrimInput.nextSibling);
            }
            if (error.message.includes('Arus sekunder rating I_sek_rating')) {
                iSekRatingInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                iSekRatingInput.parentNode.insertBefore(errorElem, iSekRatingInput.nextSibling);
            }
            if (error.message.includes('Arus primer rating I_prim_rating')) {
                iPrimRatingInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                iPrimRatingInput.parentNode.insertBefore(errorElem, iPrimRatingInput.nextSibling);
            }
            if (error.message.includes('Tahanan relay')) {
                const tahananRelayInput = document.getElementById('tahanan_relay');
                if (tahananRelayInput) {
                    tahananRelayInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tahananRelayInput.parentNode.insertBefore(errorElem, tahananRelayInput.nextSibling);
                }
            }
            if (error.message.includes('Tahanan kabel')) {
                // Check both possible input fields for resistance
                const tahananKabelInput = document.getElementById('tahanan_kabel');
                if (tahananKabelInput) {
                    tahananKabelInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tahananKabelInput.parentNode.insertBefore(errorElem, tahananKabelInput.nextSibling);
                }
            }
            if (error.message.includes('Panjang kabel')) {
                const panjangKabelInput = document.getElementById('panjang_kabel');
                if (panjangKabelInput) {
                    panjangKabelInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    panjangKabelInput.parentNode.insertBefore(errorElem, panjangKabelInput.nextSibling);
                }
            }
            if (error.message.includes('Luas penampang')) {
                const luasPenampangInput = document.getElementById('luas_penampang');
                if (luasPenampangInput) {
                    luasPenampangInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    luasPenampangInput.parentNode.insertBefore(errorElem, luasPenampangInput.nextSibling);
                }
            }
            if (error.message.includes('Rating burden CT')) {
                burdenRatingInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                burdenRatingInput.parentNode.insertBefore(errorElem, burdenRatingInput.nextSibling);
            }

            // Tampilkan juga error umum di hasil div untuk debugging
            hasilDiv.innerHTML = '<strong>Error:</strong> ' + error.message;
            hasilDiv.style.color = '#d32f2f';
        }
    });
}

});

});