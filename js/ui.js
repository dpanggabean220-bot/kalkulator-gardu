// logika tampilan: baca input, panggil rumus, tampilkan hasil
document.addEventListener('DOMContentLoaded', function() {
    // Handle mobile navigation toggle
    const navToggles = document.querySelectorAll('.nav-toggle');
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const navCategory = this.parentElement;
            navCategory.classList.toggle('open');
            const isOpen = navCategory.classList.contains('open');
            this.setAttribute('aria-expanded', isOpen);
        });
    });

    // Close menu when a calculator link is clicked (on mobile)
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Only close on mobile screens
            if (window.innerWidth <= 600) {
                const navCategories = document.querySelectorAll('.nav-category');
                navCategories.forEach(category => {
                    category.classList.remove('open');
                    const toggleBtn = category.querySelector('.nav-toggle');
                    if (toggleBtn) {
                        toggleBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });

    // Handle form submission for calculator 1
    const form1 = document.getElementById('form1');
    if (form1) {
        form1.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const dayaInput = document.getElementById('daya1');
            const teganganInput = document.getElementById('tegangan1');
            const hasilDiv = document.getElementById('hasil1');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
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
                hasilDiv.classList.add('visible');
                // Scroll ke hasil; tanpa animasi jika pengguna memilih kurangi gerakan
                const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                hasilDiv.scrollIntoView({ behavior: kurangiGerak ? 'auto' : 'smooth', block: 'center' });
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
            hasilDiv.classList.remove('visible');
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
                hasilDiv.classList.add('visible');
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
            hasilDiv.classList.remove('visible');

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
                    hasilDiv.classList.add('visible');

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
                    hasilDiv.classList.add('visible');

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
                    hasilDiv.classList.add('visible');

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
            hasilDiv.classList.remove('visible');
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
                hasilDiv.classList.add('visible');
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
            hasilDiv.classList.remove('visible');
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
                hasilDiv.classList.add('visible');
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
            hasilDiv.classList.remove('visible');
            iPrimInput.classList.remove('error-input');
            iSekRatingInput.classList.remove('error-input');
            iPrimRatingInput.classList.remove('error-input');
            burdenRatingInput.classList.remove('error-input');

            // Clear error inputs for both cable modes
            const directModeInputs = [
                document.getElementById('tahanan_relay_direct'),
                document.getElementById('tahanan_kabel')
            ];
            directModeInputs.forEach(input => {
                if (input) input.classList.remove('error-input');
            });

            const lengthModeInputs = [
                document.getElementById('tahanan_relay_length'),
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
                    const tahananRelayInput = document.getElementById('tahanan_relay_direct');
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
                    const tahananRelayInput = document.getElementById('tahanan_relay_length');
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
                    &nbsp;&nbsp;&nbsp;&nbsp;R_total = ${R_relay.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + ${R_kabel.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ${(R_relay + R_kabel).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ω<br>
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
                // Error untuk input mode-specific - hanya tampilkan di mode yang aktif
                if (selectedKabelMode === 'direct') {
                    if (error.message.includes('Tahanan relay')) {
                        const tahananRelayInput = document.getElementById('tahanan_relay_direct');
                        if (tahananRelayInput) {
                            tahananRelayInput.classList.add('error-input');
                            const errorElem = document.createElement('div');
                            errorElem.className = 'error';
                            errorElem.textContent = error.message;
                            tahananRelayInput.parentNode.insertBefore(errorElem, tahananRelayInput.nextSibling);
                        }
                    }
                    if (error.message.includes('Tahanan kabel')) {
                        const tahananKabelInput = document.getElementById('tahanan_kabel');
                        if (tahananKabelInput) {
                            tahananKabelInput.classList.add('error-input');
                            const errorElem = document.createElement('div');
                            errorElem.className = 'error';
                            errorElem.textContent = error.message;
                            tahananKabelInput.parentNode.insertBefore(errorElem, tahananKabelInput.nextSibling);
                        }
                    }
                } else if (selectedKabelMode === 'length') {
                    if (error.message.includes('Tahanan relay')) {
                        const tahananRelayInput = document.getElementById('tahanan_relay_length');
                        if (tahananRelayInput) {
                            tahananRelayInput.classList.add('error-input');
                            const errorElem = document.createElement('div');
                            errorElem.className = 'error';
                            errorElem.textContent = error.message;
                            tahananRelayInput.parentNode.insertBefore(errorElem, tahananRelayInput.nextSibling);
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
                }
                if (error.message.includes('Rating burden CT')) {
                    burdenRatingInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    burdenRatingInput.parentNode.insertBefore(errorElem, burdenRatingInput.nextSibling);
                }

            }
        });
    }

    // Handle form submission for calculator 4
    const form4 = document.getElementById('form4');
    if (form4) {
        form4.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const vNominalInput = document.getElementById('v_nominal');
            const tapNInput = document.getElementById('tapen');
            const stepInput = document.getElementById('step');
            const hasilDiv = document.getElementById('hasil4');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            vNominalInput.classList.remove('error-input');
            tapNInput.classList.remove('error-input');
            stepInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form4.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const V_nominal = parseFloat(vNominalInput.value);
                const n = parseFloat(tapNInput.value);
                const stepPercent = parseFloat(stepInput.value);

                // Validate empty inputs
                if (isNaN(V_nominal) || vNominalInput.value.trim() === '') {
                    throw new Error('Tegangan nominal V_nominal harus diisi');
                }
                if (isNaN(n) || tapNInput.value.trim() === '') {
                    throw new Error('Posisi tap n harus diisi');
                }
                if (isNaN(stepPercent) || stepInput.value.trim() === '') {
                    throw new Error('Persentase langkah step harus diisi');
                }

                // Call the rumus function
                const V_tap = Rumus.teganganPerPosisiTap(V_nominal, n, stepPercent);

                // Format hasil dengan satuan dan locale Indonesia
                const vNominalFormatted = V_nominal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kV';
                const vTapFormatted = V_tap.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' kV';

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Tegangan setelah tap:</strong> ${vTapFormatted}<br>
                    <strong>Rumus:</strong> V_tap = V_nominal × (1 + n × step% / 100)<br>
                    <strong>Perhitungan:</strong> V_tap = ${V_nominal} × (1 + ${n} × ${stepPercent} / 100) = ${V_tap.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kV
                `;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Tegangan nominal V_nominal')) {
                    vNominalInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    vNominalInput.parentNode.insertBefore(errorElem, vNominalInput.nextSibling);
                }
                if (error.message.includes('Posisi tap n')) {
                    tapNInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tapNInput.parentNode.insertBefore(errorElem, tapNInput.nextSibling);
                }
                if (error.message.includes('Persentase langkah step')) {
                    stepInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    stepInput.parentNode.insertBefore(errorElem, stepInput.nextSibling);
                }

            }
        });
    }

    // Handle form submission for calculator 5
    const form5 = document.getElementById('form5');
    if (form5) {
        form5.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const dayaInput = document.getElementById('daya5');
            const cosPhi1Input = document.getElementById('cosPhi1');
            const cosPhi2Input = document.getElementById('cosPhi2');
            const hasilDiv = document.getElementById('hasil5');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            dayaInput.classList.remove('error-input');
            cosPhi1Input.classList.remove('error-input');
            cosPhi2Input.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form5.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const P = parseFloat(dayaInput.value);
                const cosPhi1 = parseFloat(cosPhi1Input.value);
                const cosPhi2 = parseFloat(cosPhi2Input.value);

                // Validate empty inputs
                if (isNaN(P) || dayaInput.value.trim() === '') {
                    throw new Error('Daya aktif P harus diisi');
                }
                if (isNaN(cosPhi1) || cosPhi1Input.value.trim() === '') {
                    throw new Error('Faktor daya awal cos φ1 harus diisi');
                }
                if (isNaN(cosPhi2) || cosPhi2Input.value.trim() === '') {
                    throw new Error('Faktor daya target cos φ2 harus diisi');
                }

                // Call the rumus function
                const Qc = Rumus.kapasitorPerbaikanCosPhi(P, cosPhi1, cosPhi2);

                // Format hasil dengan satuan dan locale Indonesia
                const pFormatted = P.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MW';
                const qcFormatted = Qc.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' MVAR';

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Besar kapasitor:</strong> ${qcFormatted}<br>
                    <strong>Rumus:</strong> Qc = P × (tan φ1 − tan φ2)<br>
                    <strong>Perhitungan:</strong> Qc = ${P} × (tan(cos⁻¹(${cosPhi1})) − tan(cos⁻¹(${cosPhi2}))) = ${Qc.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} MVAR
                `;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Daya aktif P')) {
                    dayaInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    dayaInput.parentNode.insertBefore(errorElem, dayaInput.nextSibling);
                }
                if (error.message.includes('Faktor daya awal cos φ1')) {
                    cosPhi1Input.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    cosPhi1Input.parentNode.insertBefore(errorElem, cosPhi1Input.nextSibling);
                }
                if (error.message.includes('Faktor daya target cos φ2')) {
                    cosPhi2Input.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    cosPhi2Input.parentNode.insertBefore(errorElem, cosPhi2Input.nextSibling);
                }
            }
        });
    }

    // Handle form submission for calculator 9
    const form9 = document.getElementById('form9');
    if (form9) {
        // Now handle the form submission
        form9.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the selected curve type
            let selectedCurveType = '';
            const curveTypeRadios = form9.querySelectorAll('input[name="curveType"]');
            curveTypeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedCurveType = radio.value;
                }
            });

            // Get input values
            const tmsInput = document.getElementById('tms');
            const ratioInput = document.getElementById('ratio');
            const hasilDiv = document.getElementById('hasil9');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            tmsInput.classList.remove('error-input');
            ratioInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form9.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const TMS = parseFloat(tmsInput.value);
                const I_over_Is = parseFloat(ratioInput.value);

                // Validate empty inputs
                if (isNaN(TMS) || tmsInput.value.trim() === '') {
                    throw new Error('TMS harus diisi');
                }
                if (isNaN(I_over_Is) || ratioInput.value.trim() === '') {
                    throw new Error('I/I_s harus diisi');
                }

                // Call the rumus function
                const t = Rumus.waktuKerjaRelayOCR(selectedCurveType, TMS, I_over_Is);

                // Format hasil dengan satuan dan locale Indonesia
                const tmsFormatted = TMS.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
                const ratioFormatted = I_over_Is.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

                // Tampilkan hasil
                if (t === null) {
                    hasilDiv.innerHTML = `
                        <strong>Hasil:</strong> Relay tidak bekerja<br>
                        <strong>Rumus:</strong> t = TMS × k / ((I / I_s)^α − 1)<br>
                        <strong>Keterangan:</strong> Karena I/I_s ≤ 1, relay tidak bekerja
                    `;
                } else {
                    const tFormatted = t.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' s';

                    // Get k and alpha values for display
                    let k, alpha;
                    switch (selectedCurveType) {
                        case 'SI': k = 0.14; alpha = 0.02; break;
                        case 'VI': k = 13.5; alpha = 1; break;
                        case 'EI': k = 80; alpha = 2; break;
                    }

                    hasilDiv.innerHTML = `
                        <strong>Waktu kerja:</strong> ${tFormatted}<br>
                        <strong>Rumus:</strong> t = TMS × k / ((I / I_s)^α − 1)<br>
                        <strong>Parameter kurva ${selectedCurveType}:</strong> k = ${k}, α = ${alpha}<br>
                        <strong>Perhitungan:</strong> t = ${TMS} × ${k} / (${I_over_Is}^${alpha} − 1) = ${t.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} s
                    `;
                }
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('TMS harus diisi')) {
                    tmsInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tmsInput.parentNode.insertBefore(errorElem, tmsInput.nextSibling);
                }
                if (error.message.includes('I/I_s harus diisi')) {
                    ratioInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    ratioInput.parentNode.insertBefore(errorElem, ratioInput.nextSibling);
                }
                if (error.message.includes('Jenis kurva harus berupa string')) {
                    // This error comes from the function itself, show in hasil div
                }
                if (error.message.includes('Jenis kurva harus SI, VI, atau EI')) {
                    // This error comes from the function itself, show in hasil div
                }
                if (error.message.includes('TMS harus berupa angka')) {
                    tmsInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tmsInput.parentNode.insertBefore(errorElem, tmsInput.nextSibling);
                }
                if (error.message.includes('I/I_s harus berupa angka')) {
                    ratioInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    ratioInput.parentNode.insertBefore(errorElem, ratioInput.nextSibling);
                }
                if (error.message.includes('TMS harus lebih besar dari nol')) {
                    tmsInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tmsInput.parentNode.insertBefore(errorElem, tmsInput.nextSibling);
                }
                if (error.message.includes('I/I_s harus lebih besar dari nol')) {
                    ratioInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    ratioInput.parentNode.insertBefore(errorElem, ratioInput.nextSibling);
                }
            }
        });
    }

    // Handle form submission for calculator 10 (placeholder - no logic needed yet)
    const form10 = document.getElementById('form10');
    if (form10) {
        form10.addEventListener('submit', function(e) {
            e.preventDefault();
            // Placeholder for future implementation
            const hasilDiv = document.getElementById('hasil10');
            hasilDiv.innerHTML = '<strong>Kalkulator belum diimplementasi</strong>';
            hasilDiv.classList.add('visible');
            hasilDiv.style.color = '#666';
        });
    }

    // Handle form submission for calculator 11
    const form11 = document.getElementById('form11');
    if (form11) {
        form11.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const nilaiGangguanInput = document.getElementById('nilai_gangguan');
            const nilaiPerKmInput = document.getElementById('nilai_per_km');
            const panjangSaluranInput = document.getElementById('panjang_saluran');
            const hasilDiv = document.getElementById('hasil11');

            // Get selected method
            let selectedMetode = 'impedansi'; // default
            const metodeRadios = form11.querySelectorAll('input[name="metode"]');
            metodeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedMetode = radio.value;
                }
            });

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            nilaiGangguanInput.classList.remove('error-input');
            nilaiPerKmInput.classList.remove('error-input');
            panjangSaluranInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form11.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const nilai_gangguan = parseFloat(nilaiGangguanInput.value);
                const nilai_per_km = parseFloat(nilaiPerKmInput.value);
                let panjang_saluran = null;

                // Parse panjang saluran if provided
                if (panjangSaluranInput.value.trim() !== '') {
                    panjang_saluran = parseFloat(panjangSaluranInput.value);
                }

                // Validate empty inputs
                if (isNaN(nilai_gangguan) || nilaiGangguanInput.value.trim() === '') {
                    throw new Error('Nilai gangguan harus diisi');
                }
                if (isNaN(nilai_per_km) || nilaiPerKmInput.value.trim() === '') {
                    throw new Error('Nilai per kilometer harus diisi');
                }

                // Call the rumus function
                const result = Rumus.estimasiLokasiGangguan(nilai_gangguan, nilai_per_km, panjang_saluran, selectedMetode);

                // Format hasil dengan satuan dan locale Indonesia
                const jarakFormatted = result.jarak.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km';

                let persenFormatted = '-';
                let jarakUjungLainFormatted = '-';

                if (result.persen !== null) {
                    persenFormatted = result.persen.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
                }

                if (result.jarak_dari_ujung_lain !== null) {
                    jarakUjungLainFormatted = Math.abs(result.jarak_dari_ujung_lain).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km';
                }

                // Tampilkan hasil
                let hasilHTML = `
                    <strong>Estimasi lokasi gangguan:</strong> ${jarakFormatted}<br>
                    <strong>Metode:</strong> ${selectedMetode === 'impedansi' ? 'Impedansi gangguan |Z|' : 'Reaktansi gangguan X'}<br>
                    <strong>Satuan:</strong> ${selectedMetode === 'impedansi' ? 'Ω' : 'Ω'}<br>
                    <strong>Satuan per km:</strong> ${selectedMetode === 'impedansi' ? 'Ω/km' : 'Ω/km'}<br>
                    <strong>Rumus:</strong> jarak = nilai_gangguan / nilai_per_km<br>
                    <strong>Perhitungan:</strong> jarak = ${nilai_gangguan.toLocaleString('id-ID')} / ${nilai_per_km.toLocaleString('id-ID')} = ${result.jarak.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km
                `;

                if (panjang_saluran !== null) {
                    hasilHTML += `
                        <strong>Persen lokasi gangguan:</strong> ${persenFormatted}<br>
                        <strong>Jarak dari ujung saluran yang lain:</strong> ${jarakUjungLainFormatted}<br>
                    `;

                    // Add warning if applicable
                    if (result.peringatan !== null) {
                        hasilHTML += `<br><span style="color: #d32f2f; font-weight: bold;">${result.peringatan}</span><br>`;
                    }
                }

                hasilDiv.innerHTML = hasilHTML;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Nilai gangguan')) {
                    nilaiGangguanInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    nilaiGangguanInput.parentNode.insertBefore(errorElem, nilaiGangguanInput.nextSibling);
                }
                if (error.message.includes('Nilai per kilometer')) {
                    nilaiPerKmInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    nilaiPerKmInput.parentNode.insertBefore(errorElem, nilaiPerKmInput.nextSibling);
                }
                if (error.message.includes('Panjang saluran')) {
                    panjangSaluranInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    panjangSaluranInput.parentNode.insertBefore(errorElem, panjangSaluranInput.nextSibling);
                }
                if (error.message.includes('Metode harus berupa')) {
                    // This error comes from the function itself, show in hasil div
                }
            }
        });
    }

    // Handle form submission for calculator 12
    const form12 = document.getElementById('form12');
    if (form12) {
        form12.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const arusInput = document.getElementById('arus12');
            const panjangInput = document.getElementById('panjang12');
            const resistansiInput = document.getElementById('resistansi12');
            const reaktansiInput = document.getElementById('reaktansi12');
            const cosPhiInput = document.getElementById('cosPhi12');
            const teganganInput = document.getElementById('tegangan12');
            const hasilDiv = document.getElementById('hasil12');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            arusInput.classList.remove('error-input');
            panjangInput.classList.remove('error-input');
            resistansiInput.classList.remove('error-input');
            reaktansiInput.classList.remove('error-input');
            cosPhiInput.classList.remove('error-input');
            teganganInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form12.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const I = parseFloat(arusInput.value);
                const L = parseFloat(panjangInput.value);
                const R = parseFloat(resistansiInput.value);
                const X = parseFloat(reaktansiInput.value);
                const cosPhi = parseFloat(cosPhiInput.value);
                const V = parseFloat(teganganInput.value);

                // Validate empty inputs
                if (isNaN(I) || arusInput.value.trim() === '') {
                    throw new Error('Arus I harus diisi');
                }
                if (isNaN(L) || panjangInput.value.trim() === '') {
                    throw new Error('Panjang saluran L harus diisi');
                }
                if (isNaN(R) || resistansiInput.value.trim() === '') {
                    throw new Error('Resistansi R harus diisi');
                }
                if (isNaN(X) || reaktansiInput.value.trim() === '') {
                    throw new Error('Reaktansi X harus diisi');
                }
                if (isNaN(cosPhi) || cosPhiInput.value.trim() === '') {
                    throw new Error('Faktor daya cos φ harus diisi');
                }
                if (isNaN(V) || teganganInput.value.trim() === '') {
                    throw new Error('Tegangan V harus diisi');
                }

                // Call the rumus function
                const result = Rumus.dropTeganganSaluran3Fasa(I, L, R, X, cosPhi, V);

                // Format hasil dengan satuan dan locale Indonesia
                const dropTeganganFormatted = result.dropTegangan.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' V';
                const persenFormatted = result.persen.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';

                // Hitung sin φ untuk ditampilkan
                const sinPhi = result.sinPhi;

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Drop tegangan:</strong> ${dropTeganganFormatted}<br>
                    <strong>Persentase drop tegangan:</strong> ${persenFormatted}<br>
                    <strong>Rumus:</strong> ΔV ≈ √3 × I × L × (R cos φ + X sin φ)<br>
                    <strong>Perhitungan:</strong> ΔV ≈ √3 × ${I} × ${L} × (${R} × ${cosPhi.toLocaleString('id-ID')} + ${X} × ${sinPhi.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}) = ${result.dropTegangan.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} V<br>
                    <strong>Nilai sin φ:</strong> ${sinPhi.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                `;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Arus I')) {
                    arusInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    arusInput.parentNode.insertBefore(errorElem, arusInput.nextSibling);
                }
                if (error.message.includes('Panjang saluran L')) {
                    panjangInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    panjangInput.parentNode.insertBefore(errorElem, panjangInput.nextSibling);
                }
                if (error.message.includes('Resistansi R')) {
                    resistansiInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    resistansiInput.parentNode.insertBefore(errorElem, resistansiInput.nextSibling);
                }
                if (error.message.includes('Reaktansi X')) {
                    reaktansiInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    reaktansiInput.parentNode.insertBefore(errorElem, reaktansiInput.nextSibling);
                }
                if (error.message.includes('Faktor daya cos φ')) {
                    cosPhiInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    cosPhiInput.parentNode.insertBefore(errorElem, cosPhiInput.nextSibling);
                }
                if (error.message.includes('Tegangan V')) {
                    teganganInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    teganganInput.parentNode.insertBefore(errorElem, teganganInput.nextSibling);
                }

            }
        });
    }

// Handle form submission for calculator 15
const form15 = document.getElementById('form15');
if (form15) {
    form15.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get input values
        const r30detikInput = document.getElementById('r30detik');
        const r1menitInput = document.getElementById('r1menit');
        const r10menitInput = document.getElementById('r10menit');
        const hasilDiv = document.getElementById('hasil15');

        // Clear previous results and errors
        hasilDiv.innerHTML = '';
        hasilDiv.classList.remove('visible');
        r30detikInput.classList.remove('error-input');
        r1menitInput.classList.remove('error-input');
        r10menitInput.classList.remove('error-input');

        // Remove any existing error messages
        const existingErrors = form15.querySelectorAll('.error');
        existingErrors.forEach(el => el.remove());

        try {
            // Parse input values (empty strings become undefined for optional fields)
            const R30detik = r30detikInput.value.trim() === '' ? undefined : parseFloat(r30detikInput.value);
            const R1menit = parseFloat(r1menitInput.value);
            const R10menit = r10menitInput.value.trim() === '' ? undefined : parseFloat(r10menitInput.value);

            // Validate required input R1menit
            if (isNaN(R1menit) || r1menitInput.value.trim() === '') {
                throw new Error('Tahanan setelah 1 menit harus diisi');
            }

            // Validate optional inputs if provided
            if (R30detik !== undefined && R30detik !== null) {
                if (isNaN(R30detik)) {
                    throw new Error('Tahanan setelah 30 detik harus berupa angka');
                }
                if (R30detik <= 0) {
                    throw new Error('Tahanan setelah 30 detik harus lebih besar dari nol');
                }
            }

            if (R10menit !== undefined && R10menit !== null) {
                if (isNaN(R10menit)) {
                    throw new Error('Tahanan setelah 10 menit harus berupa angka');
                }
                if (R10menit <= 0) {
                    throw new Error('Tahanan setelah 10 menit harus lebih besar dari nol');
                }
            }

            // Validate that minimal satu dari R30detik atau R10menit disediakan
            if ((R30detik === undefined || R30detik === null) &&
                (R10menit === undefined || R10menit === null)) {
                throw new Error('Minimal satu dari tahanan setelah 30 detik atau 10 menit harus diisi');
            }

            // Call the rumus function with new parameter order: R30detik, R1menit, R10menit
            const result = Rumus.indeksPolarisasiDAR(R30detik, R1menit, R10menit);

            // Format hasil dengan locale Indonesia
            const formatResult = (value) => value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            // Tampilkan hasil - hanya tampilkan yang dihitung
            let hasilHTML = '';

            if (result.PI !== undefined) {
                hasilHTML += `<strong>Indeks Polarisasi (PI):</strong> ${formatResult(result.PI)}<br>`;
            }

            if (result.DAR !== undefined) {
                hasilHTML += `<strong>Rasio Absorpsi Dielektrik (DAR):</strong> ${formatResult(result.DAR)}<br>`;
            }

            hasilHTML += `<strong>Rumus:</strong><br>`;
            if (result.PI !== undefined) {
                hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;PI = R₁₀ / R₁<br>`;
            }
            if (result.DAR !== undefined) {
                hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;DAR = R₁ / R₃₀<br>`;
            }

            hasilHTML += `<strong>Perhitungan:</strong><br>`;
            if (result.PI !== undefined) {
                hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;PI = ${R10menit !== undefined && R10menit !== null ? R10menit : 'tidak diisi'} / ${R1menit} = ${formatResult(result.PI)}<br>`;
            }
            if (result.DAR !== undefined) {
                hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;DAR = ${R1menit} / ${R30detik !== undefined && R30detik !== null ? R30detik : 'tidak diisi'} = ${formatResult(result.DAR)}<br>`;
            }

            hasilDiv.innerHTML = hasilHTML;
            hasilDiv.classList.add('visible');
        } catch (error) {
            // Tampilkan error di dekat kolom yang salah
            if (error.message.includes('Tahanan setelah 1 menit')) {
                r1menitInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                r1menitInput.parentNode.insertBefore(errorElem, r1menitInput.nextSibling);
            }
            if (error.message.includes('Tahanan setelah 30 detik')) {
                r30detikInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                r30detikInput.parentNode.insertBefore(errorElem, r30detikInput.nextSibling);
            }
            if (error.message.includes('Tahanan setelah 10 menit')) {
                r10menitInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                r10menitInput.parentNode.insertBefore(errorElem, r10menitInput.nextSibling);
            }
        }
    });
}

// Handle form submission for calculator 18
    const form18 = document.getElementById('form18');
    if (form18) {
        // First, set up mode switching
        const modeRadios = form18.querySelectorAll('input[name="konversiMode"]');
        const nilaiInput = document.getElementById('nilai18');
        const satuan18 = document.getElementById('satuan18');

        // Function to update satuan18 based on selected mode
        function updateSatuanDisplay() {
            modeRadios.forEach(radio => {
                if (radio.checked) {
                    const mode = radio.value;
                    switch (mode) {
                        case 'kVkeV': satuan18.value = 'kV'; break;
                        case 'VkekV': satuan18.value = 'V'; break;
                        case 'kAkeA': satuan18.value = 'kA'; break;
                        case 'AkekA': satuan18.value = 'A'; break;
                        case 'MVaketaVA': satuan18.value = 'MVA'; break;
                        case 'kVAkeMVA': satuan18.value = 'kVA'; break;
                        case 'CkeK': satuan18.value = '°C'; break;
                        case 'KkeC': satuan18.value = 'K'; break;
                    }
                }
            });
        }

        // Add event listeners to radio buttons to update satuan display
        modeRadios.forEach(radio => {
            radio.addEventListener('change', updateSatuanDisplay);
        });

        // Initialize the display to the default mode (kVkeV)
        updateSatuanDisplay();

        // Now handle the form submission
        form18.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get the selected mode
            let selectedMode = '';
            modeRadios.forEach(radio => {
                if (radio.checked) {
                    selectedMode = radio.value;
                }
            });

            const hasilDiv = document.getElementById('hasil18');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            nilaiInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form18.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const nilai = parseFloat(nilaiInput.value);

                // Validate empty input
                if (isNaN(nilai) || nilaiInput.value.trim() === '') {
                    throw new Error('Nilai harus diisi');
                }

                let hasil;
                let dariSatuan, keSatuan;
                let rumus;
                let perhitunganDetail;

                switch (selectedMode) {
                    case 'kVkeV':
                        // Validasi untuk kV ke V
                        if (nilai <= 0) {
                            throw new Error('Nilai kV harus lebih besar dari nol');
                        }
                        hasil = Rumus.kVkeV(nilai);
                        dariSatuan = 'kV';
                        keSatuan = 'V';
                        rumus = 'V = kV × 1000';
                        perhitunganDetail = `${nilai} × 1000 = ${hasil}`;
                        break;
                    case 'VkekV':
                        // Validasi untuk V ke kV
                        if (nilai <= 0) {
                            throw new Error('Nilai V harus lebih besar dari nol');
                        }
                        hasil = Rumus.VkekV(nilai);
                        dariSatuan = 'V';
                        keSatuan = 'kV';
                        rumus = 'kV = V / 1000';
                        perhitunganDetail = `${nilai} / 1000 = ${hasil}`;
                        break;
                    case 'kAkeA':
                        // Validasi untuk kA ke A
                        if (nilai <= 0) {
                            throw new Error('Nilai kA harus lebih besar dari nol');
                        }
                        hasil = Rumus.kAkeA(nilai);
                        dariSatuan = 'kA';
                        keSatuan = 'A';
                        rumus = 'A = kA × 1000';
                        perhitunganDetail = `${nilai} × 1000 = ${hasil}`;
                        break;
                    case 'AkekA':
                        // Validasi untuk A ke kA
                        if (nilai <= 0) {
                            throw new Error('Nilai A harus lebih besar dari nol');
                        }
                        hasil = Rumus.AkekA(nilai);
                        dariSatuan = 'A';
                        keSatuan = 'kA';
                        rumus = 'kA = A / 1000';
                        perhitunganDetail = `${nilai} / 1000 = ${hasil}`;
                        break;
                    case 'MVaketaVA':
                        // Validasi untuk MVA ke kVA
                        if (nilai <= 0) {
                            throw new Error('Nilai MVA harus lebih besar dari nol');
                        }
                        hasil = Rumus.MVaketaVA(nilai);
                        dariSatuan = 'MVA';
                        keSatuan = 'kVA';
                        rumus = 'kVA = MVA × 1000';
                        perhitunganDetail = `${nilai} × 1000 = ${hasil}`;
                        break;
                    case 'kVAkeMVA':
                        // Validasi untuk kVA ke MVA
                        if (nilai <= 0) {
                            throw new Error('Nilai kVA harus lebih besar dari nol');
                        }
                        hasil = Rumus.kVAkeMVA(nilai);
                        dariSatuan = 'kVA';
                        keSatuan = 'MVA';
                        rumus = 'MVA = kVA / 1000';
                        perhitunganDetail = `${nilai} / 1000 = ${hasil}`;
                        break;
                    case 'CkeK':
                        // Validasi untuk °C ke K
                        if (nilai < -273.15) {
                            throw new Error('Nilai Celsius tidak boleh kurang dari -273,15');
                        }
                        hasil = Rumus.CkeK(nilai);
                        dariSatuan = '°C';
                        keSatuan = 'K';
                        rumus = 'K = °C + 273,15';
                        perhitunganDetail = `${nilai} + 273,15 = ${hasil}`;
                        break;
                    case 'KkeC':
                        // Validasi untuk K ke °C
                        if (nilai <= 0) {
                            throw new Error('Nilai Kelvin harus lebih besar dari nol');
                        }
                        hasil = Rumus.KkeC(nilai);
                        dariSatuan = 'K';
                        keSatuan = '°C';
                        rumus = '°C = K - 273,15';
                        perhitunganDetail = `${nilai} - 273,15 = ${hasil}`;
                        break;
                    default:
                        throw new Error('Mode konversi tidak valid');
                }

                // Format hasil dengan satuan dan locale Indonesia
                const nilaiFormatted = nilai.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
                const hasilFormatted = hasil.toLocaleString('id-ID', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Hasil konversi:</strong> ${hasilFormatted} ${keSatuan}<br>
                    <strong>Rumus:</strong> ${rumus}<br>
                    <strong>Perhitungan:</strong> ${nilaiFormatted} ${dariSatuan} = ${hasilFormatted} ${keSatuan}<br>
                    <strong>Detail perhitungan:</strong> ${perhitunganDetail}
                `;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                nilaiInput.classList.add('error-input');
                const errorElem = document.createElement('div');
                errorElem.className = 'error';
                errorElem.textContent = error.message;
                nilaiInput.parentNode.insertBefore(errorElem, nilaiInput.nextSibling);
            }
        });
    }

    // Handle form submission for calculator 13
    const form13 = document.getElementById('form13');
    if (form13) {
        form13.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const arusInput = document.getElementById('arus13');
            const resistansiInput = document.getElementById('resistansi13');
            const panjangInput = document.getElementById('panjang13');
            const hasilDiv = document.getElementById('hasil13');

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            arusInput.classList.remove('error-input');
            resistansiInput.classList.remove('error-input');
            panjangInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form13.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const I = parseFloat(arusInput.value);
                const R = parseFloat(resistansiInput.value);
                const L = parseFloat(panjangInput.value);

                // Validate empty inputs
                if (isNaN(I) || arusInput.value.trim() === '') {
                    throw new Error('Arus I harus diisi');
                }
                if (isNaN(R) || resistansiInput.value.trim() === '') {
                    throw new Error('Resistansi R harus diisi');
                }
                if (isNaN(L) || panjangInput.value.trim() === '') {
                    throw new Error('Panjang saluran L harus diisi');
                }

                // Call the rumus function
                const Ploss = Rumus.rugiDayaSaluran(I, R, L);

                // Format hasil menggunakan fungsi formatDaya dari rumus.js
                const dayaFormatted = Rumus.formatDaya(Ploss);
                const hasilFormatted = dayaFormatted.nilai.toLocaleString('id-ID', {
                    minimumFractionDigits: dayaFormatted.satuan === 'W' ? 0 : 2,
                    maximumFractionDigits: dayaFormatted.satuan === 'W' ? 0 : 2
                }) + ' ' + dayaFormatted.satuan;

                // Tampilkan hasil
                hasilDiv.innerHTML = `
                    <strong>Rugi daya saluran:</strong> ${hasilFormatted}<br>
                    <strong>Rumus:</strong> P_loss = 3 × I² × R × L<br>
                    <strong>Perhitungan:</strong> P_loss = 3 × ${I.toLocaleString('id-ID')}² × ${R.toLocaleString('id-ID')} × ${L.toLocaleString('id-ID')} = ${Ploss.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} W
                `;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Arus I')) {
                    arusInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    arusInput.parentNode.insertBefore(errorElem, arusInput.nextSibling);
                }
                if (error.message.includes('Resistansi R')) {
                    resistansiInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    resistansiInput.parentNode.insertBefore(errorElem, resistansiInput.nextSibling);
                }
                if (error.message.includes('Panjang saluran L')) {
                    panjangInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    panjangInput.parentNode.insertBefore(errorElem, panjangInput.nextSibling);
                }
            }
        });
    }

    // Handle form submission for calculator 16
    const form16 = document.getElementById('form16');
    if (form16) {
        form16.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get input values
            const tekananInput = document.getElementById('tekanan16');
            const suhuInput = document.getElementById('suhu16');
            const batasMinimumInput = document.getElementById('batasMinimum16');
            const hasilDiv = document.getElementById('hasil16');

            // Get selected jenis tekanan
            let selectedJenisTekanan = 'absolut';
            const jenisTekananRadios = form16.querySelectorAll('input[name="jenisTekanan"]');
            jenisTekananRadios.forEach(radio => {
                if (radio.checked) {
                    selectedJenisTekanan = radio.value;
                }
            });

            // Get selected satuan
            let selectedSatuan = 'MPa';
            const satuanRadios = form16.querySelectorAll('input[name="satuan16"]');
            satuanRadios.forEach(radio => {
                if (radio.checked) {
                    selectedSatuan = radio.value;
                }
            });

            // Clear previous results and errors
            hasilDiv.innerHTML = '';
            hasilDiv.classList.remove('visible');
            tekananInput.classList.remove('error-input');
            suhuInput.classList.remove('error-input');
            batasMinimumInput.classList.remove('error-input');

            // Remove any existing error messages
            const existingErrors = form16.querySelectorAll('.error');
            existingErrors.forEach(el => el.remove());

            try {
                const P_ukur = parseFloat(tekananInput.value);
                const T = parseFloat(suhuInput.value);
                let batasMinimum = null;

                // Parse batas minimum if provided
                if (batasMinimumInput.value.trim() !== '') {
                    batasMinimum = parseFloat(batasMinimumInput.value);
                }

                // Validate empty inputs
                if (isNaN(P_ukur) || tekananInput.value.trim() === '') {
                    throw new Error('Tekanan terukur harus diisi');
                }
                if (isNaN(T) || suhuInput.value.trim() === '') {
                    throw new Error('Suhu harus diisi');
                }

                // Call the rumus function
                const result = Rumus.koreksiTekananSF6(P_ukur, selectedJenisTekanan, selectedSatuan, T, batasMinimum);

                // Format hasil dengan satuan dan locale Indonesia
                const p20AbsolutFormatted = result.P20_absolut.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' ' + result.satuan;
                const p20RelatifFormatted = result.P20_relatif.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' ' + result.satuan;

                // Tampilkan hasil
                let hasilHTML = `
                    <strong>Tekanan P₂₀ (absolut):</strong> ${p20AbsolutFormatted}<br>
                    <strong>Tekanan P₂₀ (relatif):</strong> ${p20RelatifFormatted}<br>
                    <strong>Rumus:</strong> P₂₀ = P_absolut × 293,15 / (T + 273,15)<br>
                `;

                // Tampilkan perhitungan detail
                if (selectedJenisTekanan === 'relatif') {
                    const P_atm = selectedSatuan === 'MPa' ? 0.1013 : 1.013;
                    const P_absolut = P_ukur + P_atm;
                    hasilHTML += `<strong>Perhitungan:</strong><br>`;
                    hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;Tekanan atmosfer = ${P_atm.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${selectedSatuan}<br>`;
                    hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;P_absolut = ${P_ukur} + ${P_atm} = ${P_absolut.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${selectedSatuan}<br>`;
                    hasilHTML += `&nbsp;&nbsp;&nbsp;&nbsp;P₂₀ = ${P_absolut.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} × 293,15 / (${T} + 273,15) = ${result.P20_absolut.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${selectedSatuan}<br>`;
                } else {
                    hasilHTML += `<strong>Perhitungan:</strong> P₂₀ = ${P_ukur} × 293,15 / (${T} + 273,15) = ${result.P20_absolut.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${selectedSatuan}<br>`;
                }

                // Tampilkan batas minimum jika diberikan
                if (batasMinimum !== null) {
                    const batasFormatted = batasMinimum.toLocaleString('id-ID', { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' ' + selectedSatuan;
                    hasilHTML += `<strong>Batas minimum dari pabrikan:</strong> ${batasFormatted}<br>`;
                }

                // Tampilkan peringatan jika ada
                if (result.peringatan !== null) {
                    hasilHTML += `<br><span style="color: #d32f2f; font-weight: bold;">${result.peringatan}</span><br>`;
                }

                // Tampilkan catatan
                hasilHTML += `<br><small><em>Pendekatan gas ideal. Acuan resmi tetap kurva koreksi dari pabrikan peralatan.</em></small>`;

                // Tambahkan catatan singkat tentang P20 absolut vs relatif
                hasilHTML += `<br><small><em>P₂₀ absolut diukur terhadap vakum; P₂₀ relatif diukur terhadap tekanan atmosfer. Batas minimum pabrikan dibandingkan dengan P₂₀ relatif.</em></small>`;

                hasilDiv.innerHTML = hasilHTML;
                hasilDiv.classList.add('visible');
            } catch (error) {
                // Tampilkan error di dekat kolom yang salah
                if (error.message.includes('Tekanan terukur')) {
                    tekananInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    tekananInput.parentNode.insertBefore(errorElem, tekananInput.nextSibling);
                }
                if (error.message.includes('Suhu')) {
                    suhuInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    suhuInput.parentNode.insertBefore(errorElem, suhuInput.nextSibling);
                }
                if (error.message.includes('Batas minimum')) {
                    batasMinimumInput.classList.add('error-input');
                    const errorElem = document.createElement('div');
                    errorElem.className = 'error';
                    errorElem.textContent = error.message;
                    batasMinimumInput.parentNode.insertBefore(errorElem, batasMinimumInput.nextSibling);
                }
            }
        });
    }
});
