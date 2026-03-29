import en from '../i18n/en.js';
import te from '../i18n/te.js';
import hi from '../i18n/hi.js';
import kn from '../i18n/kn.js';
import ta from '../i18n/ta.js';
import bn from '../i18n/bn.js';
import mr from '../i18n/mr.js';
import pa from '../i18n/pa.js';
import gu from '../i18n/gu.js';
import ml from '../i18n/ml.js';

const translations = { bn, en, gu, hi, kn, ml, mr, pa, ta, te };

class FarmSeevaApp {
    constructor() {
        this.currentScreen = 1;
        this.lang = 'en';
        this.onboardingData = {
            lang: 'en',
            email: 'farmer@seeva.com',
            token: localStorage.getItem('token') || 'dev-token',
            farmName: '',
            farmId: null,
            location: { lat: 16.3067, lon: 80.4365 },
            boundary: null,
            soil: null,
            crops: [],
            style: 'Single',
            irrigation: 'Drip'
        };
        this.maps = { loc: null, draw: null };
        this.init();
    }

    init() {
        this.bindEvents();
        this.initNeuralMesh();
        this.updateStepper();
        this.loadLanguage(this.lang);
        console.log("🌾 Farm Seeva Full-API Engine Started");
    }

    bindEvents() {
        document.querySelectorAll('[data-next]').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.getAttribute('data-next'));
                this.nextScreen(step);
            });
        });

        document.querySelectorAll('.selection-card[data-lang]').forEach(card => {
            card.addEventListener('click', () => {
                const l = card.getAttribute('data-lang');
                this.setLanguage(l, card);
            });
        });

        const authBtn = document.getElementById('auth-action-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.handleAuth());
        }

        const confirmBoundaryBtn = document.getElementById('confirm-boundary-btn');
        if (confirmBoundaryBtn) {
            confirmBoundaryBtn.addEventListener('click', () => this.handleFarmSetup());
        }
    }

    setLanguage(l, element) {
        this.lang = l;
        this.onboardingData.lang = l;
        document.querySelectorAll('.selection-card[data-lang]').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        this.loadLanguage(l);
    }

    loadLanguage(l) {
        const t = translations[l] || en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });
    }

    async handleAuth() {
        const emailInput = document.getElementById('userEmail');
        const otpInput = document.getElementById('userOTP');
        const otpArea = document.getElementById('otp-area');
        const authBtn = document.getElementById('auth-action-btn');

        if (otpArea.style.display === 'none') {
            const email = emailInput.value;
            if (!email.includes('@')) { this.showToast("Please enter a valid email address"); return; }
            
            authBtn.innerText = "Sending...";
            authBtn.disabled = true;

            try {
                const res = await fetch('/api/v1/auth/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                if (data.success) {
                    this.onboardingData.email = email;
                    otpArea.style.display = 'block';
                    authBtn.innerText = "Verify & Continue";
                    this.showToast("OTP sent successfully", "success");
                    if (data.devMode) { otpInput.value = data.otp; this.showToast(`[Dev Mode] OTP: ${data.otp}`, "success"); }
                } else this.showToast(data.message || "Failed to send OTP");
            } catch (err) { this.showToast("Server Connection Error"); }
            finally { authBtn.disabled = false; }
        } else {
            const otp = otpInput.value;
            authBtn.innerText = "Verifying...";
            authBtn.disabled = true;
            try {
                const res = await fetch('/api/v1/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.onboardingData.email, otp })
                });
                const data = await res.json();
                if (data.success) {
                    this.onboardingData.token = data.token;
                    localStorage.setItem('token', data.token);
                    this.showToast("Welcome!", "success");
                    this.nextScreen(3);
                } else this.showToast(data.message || "Invalid OTP");
            } catch (err) { this.showToast("Server Error"); }
            finally { authBtn.disabled = false; }
        }
    }

    async handleFarmSetup() {
        const farmName = document.getElementById('farmName').value;
        if (!farmName) { this.showToast("Please name your farm"); return; }
        this.onboardingData.farmName = farmName;

        const confirmBtn = document.getElementById('confirm-boundary-btn');
        confirmBtn.innerText = "Creating Farm...";
        confirmBtn.disabled = true;

        try {
            const res = await fetch('/api/v1/farm/setup', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.onboardingData.token}`
                },
                body: JSON.stringify({
                    farmName: this.onboardingData.farmName,
                    location: "Regional District",
                    lat: this.onboardingData.location.lat,
                    lon: this.onboardingData.location.lon,
                    boundary: this.onboardingData.boundary,
                    ph: 0, nitrogen: 0, phosphorus: 0, potassium: 0 // Will fetch later
                })
            });
            const data = await res.json();
            if (data.success) {
                this.onboardingData.farmId = data.farmId;
                this.showToast("✓ Farm Profile Created", "success");
                this.nextScreen(5);
            } else this.showToast(data.message || "Failed to save farm setup");
        } catch (err) { this.showToast("Farm Setup Error"); }
        finally { confirmBtn.disabled = false; confirmBtn.innerText = "Confirm Boundary →"; }
    }

    nextScreen(num) {
        const current = document.getElementById(`screen-${this.currentScreen}`);
        const next = document.getElementById(`screen-${num}`);
        if (current && next) {
            current.classList.add('exit');
            setTimeout(() => {
                current.classList.remove('active', 'exit');
                next.classList.add('active');
                this.currentScreen = num;
                this.updateStepper();
                this.onScreenActive(num);
            }, 600);
        }
    }

    onScreenActive(num) {
        if (num === 3) this.initLocationMap();
        if (num === 4) this.initBoundaryMap();
        if (num === 6) this.fetchSoilData();
        if (num === 9) this.fetchCropRecommendations();
    }

    initLocationMap() {
        if (this.maps.loc) { this.maps.loc.invalidateSize(); return; }
        const container = document.getElementById('map-loc');
        this.maps.loc = L.map(container, { zoomControl: false }).setView([16.3067, 80.4365], 13);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(this.maps.loc);
        const marker = L.marker([16.3067, 80.4365], {
            draggable: true,
            icon: L.divIcon({
                className: 'custom-pin',
                html: "<div style='background:var(--primary); width:14px; height:14px; border-radius:50%; border:3px solid #fff;'></div>",
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            })
        }).addTo(this.maps.loc).on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.onboardingData.location = { lat: pos.lat, lon: pos.lng };
        });
        setTimeout(() => this.maps.loc.invalidateSize(), 300);
    }

    initBoundaryMap() {
        if (this.maps.draw) {
            this.maps.draw.invalidateSize();
            this.maps.draw.setView([this.onboardingData.location.lat, this.onboardingData.location.lon], 18);
            return;
        }
        const container = document.getElementById('map-draw');
        this.maps.draw = L.map(container).setView([this.onboardingData.location.lat, this.onboardingData.location.lon], 18);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(this.maps.draw);
        const drawnItems = new L.FeatureGroup();
        this.maps.draw.addLayer(drawnItems);
        const drawControl = new L.Control.Draw({
            edit: { featureGroup: drawnItems },
            draw: {
                polygon: { allowIntersection: false, shapeOptions: { color: '#10b981' } },
                rect: false, circle: false, marker: false, circlemarker: false, polyline: false
            }
        });
        this.maps.draw.addControl(drawControl);
        this.maps.draw.on(L.Draw.Event.CREATED, (e) => {
            drawnItems.clearLayers();
            drawnItems.addLayer(e.layer);
            document.getElementById('confirm-boundary-btn').disabled = false;
            this.onboardingData.boundary = e.layer.toGeoJSON();
        });
        setTimeout(() => this.maps.draw.invalidateSize(), 300);
    }

    async fetchSoilData() {
        const bar = document.getElementById('fetch-progress-bar');
        const log = document.getElementById('sync-log');
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            if (p > 90) p = 90;
            bar.style.width = `${p}%`;
            if (p === 20) log.innerText = "📡 Connecting to Sentinel-2 Pulse...";
            if (p === 50) log.innerText = "🔍 Resolving Spectral Signatures...";
            if (p === 80) log.innerText = "✅ High-Confidence Soil Profiling Complete";
        }, 80);

        try {
            const res = await fetch(`/api/v1/soil/auto-fetch?farmId=${this.onboardingData.farmId}`, {
                headers: { 'Authorization': `Bearer ${this.onboardingData.token}` }
            });
            const data = await res.json();
            if (data.success) {
                this.onboardingData.soil = data.data;
                clearInterval(interval);
                bar.style.width = '100%';
                setTimeout(() => {
                    this.populateSoilScreen(data.data);
                    this.nextScreen(7);
                }, 800);
            } else this.showToast("Failed to fetch soil data from satellites");
        } catch (err) { this.showToast("Soil Auth-Fetch Error"); }
    }

    populateSoilScreen(soil) {
        // Find elements in screen 7
        const root = document.getElementById('screen-7');
        root.querySelector('p.subtitle').innerText = `Results from the latest orbital pass for ${this.onboardingData.farmName}.`;
        
        const gridItems = root.querySelectorAll('div[style*="background: rgba(255,255,255,0.03)"]');
        gridItems[0].querySelector('p:last-child').innerText = soil.soilType || "Clay/Silt";
        gridItems[1].querySelector('p:last-child').innerText = `${soil.phLevel || 7.0} (Rich)`;
        
        const nitrogenText = root.querySelector('span[style*="color: var(--primary-light)"]');
        nitrogenText.innerText = soil.nitrogenLevel > 1 ? "Optimal" : "Low";
        const nitrogenBar = root.querySelector('div[style*="width: 85%"]');
        nitrogenBar.style.width = `${(soil.nitrogenLevel || 0.8) * 50}%`;
    }

    async fetchCropRecommendations() {
        const bar = document.getElementById('ai-progress-bar');
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            if (p > 95) p = 95;
            bar.style.width = `${p}%`;
        }, 60);

        try {
            const res = await fetch(`/api/v1/crop/recommend?farmId=${this.onboardingData.farmId}`, {
                headers: { 'Authorization': `Bearer ${this.onboardingData.token}` }
            });
            const data = await res.json();
            if (data.success) {
                this.onboardingData.crops = data.recommendations;
                clearInterval(interval);
                bar.style.width = '100%';
                setTimeout(() => {
                    this.populateFinalScreen(data.recommendations);
                    this.nextScreen(10);
                }, 1000);
            } else this.showToast("AI Recommendations failed");
        } catch (err) { this.showToast("AI Simulator Offline"); }
    }

    populateFinalScreen(crops) {
        const root = document.getElementById('screen-10');
        const best = crops[0] || { name: "Sustainable Mix", confidence: 0.95, advice: "General purpose mix." };
        
        root.querySelector('h1').innerText = `Welcome, ${this.onboardingData.email.split('@')[0]}!`;
        const metrics = root.querySelectorAll('p[style*="font-size: 1.5rem"]');
        metrics[0].innerText = `${(best.confidence * 100).toFixed(1)}%`;
        
        const cropBox = root.querySelector('div[style*="background: var(--bg-glass)"]');
        cropBox.querySelector('p:first-child').innerText = best.name;
        cropBox.querySelector('p:last-child').innerText = best.advice;
    }

    updateStepper() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index < this.currentScreen);
        });
    }

    showToast(msg, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    initNeuralMesh() {
        const canvas = document.getElementById('neural-mesh');
        const ctx = canvas.getContext('2d');
        let nodes = [];
        const resize = () => {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            nodes = Array.from({ length: 45 }, () => ({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
            }));
        };
        window.addEventListener('resize', resize);
        resize();
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)'; ctx.lineWidth = 0.5;
            nodes.forEach((n, i) => {
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width) n.vx *= -1; if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
                nodes.slice(i + 1).forEach(n2 => {
                    const d = Math.hypot(n.x - n2.x, n.y - n2.y);
                    if (d < 180) { ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n2.x, n2.y); ctx.stroke(); }
                });
            });
            requestAnimationFrame(animate);
        };
        animate();
    }
}

document.addEventListener('DOMContentLoaded', () => { window.app = new FarmSeevaApp(); });
