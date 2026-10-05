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
});