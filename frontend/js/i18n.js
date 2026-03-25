const i18n = {
    currentLang: localStorage.getItem('lang') || 'en',
    translations: {},

    async init() {
        await this.loadLanguage(this.currentLang);
        this.updateUI();
        
        // Setup language switch
        const langSwitch = document.getElementById('lang-switch');
        if (langSwitch) {
            langSwitch.value = this.currentLang;
            langSwitch.addEventListener('change', async (e) => {
                await this.changeLanguage(e.target.value);
            });
        }
    },

    async loadLanguage(lang) {
        try {
            const response = await fetch(`i18n/${lang}.json`);
            this.translations = await response.json();
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
        } catch (error) {
            console.error('Failed to load language:', error);
        }
    },

    async changeLanguage(lang) {
        await this.loadLanguage(lang);
        this.updateUI();
        // Optional: reload pages if needed for some content
    },

    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                el.innerText = this.translations[key];
            }
        });
    },

    t(key) {
        return this.translations[key] || key;
    }
};

document.addEventListener('DOMContentLoaded', () => i18n.init());
