const soil = {
    async save(data) {
        const errorEl = document.getElementById('soil-error');
        errorEl.innerText = '';

        // Simple client-side validation
        if (data.ph < 0 || data.ph > 14) {
            errorEl.innerText = 'PH must be between 0 and 14';
            return;
        }

        try {
            const result = await api.request('/soil', 'POST', data);
            if (result) {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            errorEl.innerText = error.message;
        }
    },

    async loadDashboard() {
        const resultsList = document.getElementById('results-list');
        const cropsList = document.getElementById('crops-list');

        try {
            const latestSoil = await api.request('/soil/latest');
            if (!latestSoil) {
                resultsList.innerHTML = `<p>${i18n.t('no_data')}</p>`;
                cropsList.innerHTML = `<p>${i18n.t('no_data')}</p>`;
                return;
            }

            // Sanitized Display
            const { ph, nitrogen, phosphorus, potassium, createdAt } = latestSoil;
            resultsList.innerHTML = `
                <div class="stat"><span class="label">pH:</span> <span class="val">${Number(ph).toFixed(1)}</span></div>
                <div class="stat"><span class="label">N:</span> <span class="val">${nitrogen}</span></div>
                <div class="stat"><span class="label">P:</span> <span class="val">${phosphorus}</span></div>
                <div class="stat"><span class="label">K:</span> <span class="val">${potassium}</span></div>
                <p class="timestamp"><small>Updated: ${new Date(createdAt).toLocaleDateString()}</small></p>
            `;

            const cropData = await api.request('/crop/recommend', 'POST', latestSoil);
            if (cropData && cropData.recommendations.length > 0) {
                cropsList.innerHTML = `<ul>${cropData.recommendations.map(c => `<li>${c}</li>`).join('')}</ul>`;
            } else {
                cropsList.innerHTML = `<p>${i18n.t('no_recommendations')}</p>`;
            }

        } catch (error) {
            resultsList.innerHTML = `<p class="error-msg">${error.message}</p>`;
            console.error('Soil load error:', error);
        }
    }
};

// Event listener for soil form
if (document.getElementById('soil-form')) {
    document.getElementById('soil-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
            ph: Number(document.getElementById('ph').value),
            nitrogen: Number(document.getElementById('n').value),
            phosphorus: Number(document.getElementById('p').value),
            potassium: Number(document.getElementById('k').value),
        };
        soil.save(data);
    });
}
