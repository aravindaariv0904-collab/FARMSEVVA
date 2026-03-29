class DashboardApp {
    constructor() {
        this.token = localStorage.getItem('token') || 'dev-token';
        this.farmId = localStorage.getItem('farmId') || 'test-farm-id';
        this.farmData = null;
        this.init();
    }

    async init() {
        if (!this.token || this.token === '') {
            this.showToast("Authentication Required", "error");
            setTimeout(() => location.href = '/', 2000);
            return;
        }

        console.log("🌾 Dashboard Initializing with dev mode enabled");
        await this.fetchDashboardData();
        this.bindEvents();
    }

    bindEvents() {
        const sendBtn = document.getElementById('sendChat');
        const input = document.getElementById('chatInput');
        
        const handleSend = async () => {
            const msg = input.value.trim();
            if (!msg) return;
            input.value = '';
            this.appendChat('user', msg);
            await this.callTerraAI(msg);
        };

        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    }

    async fetchDashboardData() {
        try {
            // 1. Fetch Farm & Weather Data
            const weatherRes = await fetch(`/api/weather/forecast?lat=16.3067&lon=80.4365`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const weatherData = await weatherRes.json();
            if (weatherData.success) this.updateWeatherUI(weatherData.data);

            // 2. Fetch Market Prices
            const marketRes = await fetch(`/api/market/prices?region=Kurnool`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const marketData = await marketRes.json();
            if (marketData.success) this.updateMarketUI(marketData.data);

            // 3. Update Basic Farm UI from LocalStorage if available
            const name = localStorage.getItem('farmName') || "Green Valley Farm";
            document.getElementById('displayFarmName').innerText = name;
        } catch (err) {
            this.showToast("Critical API Sync Failed", "error");
            console.error(err);
        }
    }

    updateWeatherUI(data) {
        if (!data || !data.current) return;
        document.getElementById('weatherTemp').innerText = `${Math.round(data.current.temp)}°`;
        document.getElementById('weatherDesc').innerText = data.current.weather[0].main;
        document.getElementById('weatherHumidity').innerText = `${data.current.humidity}%`;
        
        if (data.alerts && data.alerts.length > 0) {
            document.getElementById('weatherWarning').innerText = data.alerts[0].event + " in your area.";
        }
    }

    updateMarketUI(data) {
        if (!data || !data.records) return;
        const list = document.getElementById('market-list');
        list.innerHTML = "";
        data.records.slice(0, 3).forEach(rec => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;";
            div.innerHTML = `
                <span style="font-weight: 700;">${rec.commodity}</span>
                <span style="color: var(--primary);">₹${rec.modal_price} <i class="fa-solid fa-arrow-up"></i></span>
            `;
            list.appendChild(div);
        });
    }

    async callTerraAI(message) {
        const chatDisplay = document.getElementById('chatDisplay');
        try {
            const res = await fetch('/api/terra-ai/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ 
                    message: message,
                    language: "English",
                    conversationHistory: [] // Can be extended for real history
                })
            });
            const data = await res.json();
            if (data.success) {
                this.appendChat('assistant', data.reply);
            } else {
                this.appendChat('assistant', data.message || "I'm having trouble connecting right now.");
            }
        } catch (err) {
            this.appendChat('assistant', "Sorry, I lost connection to the neural grid.");
        }
    }

    appendChat(role, msg) {
        const chatDisplay = document.getElementById('chatDisplay');
        const bubble = document.createElement('div');
        bubble.className = `ai-bubble ${role}`;
        bubble.innerText = msg;
        chatDisplay.appendChild(bubble);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    showToast(msg, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => { window.dashboard = new DashboardApp(); });
