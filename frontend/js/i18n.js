const i18n = {
  currentLang: localStorage.getItem('lang') || 'en',
  translations: {},

  async init() {
    await this.loadTranslations(this.currentLang);
    this.translatePage();
  },

  async loadTranslations(lang) {
    try {
      // For Vanilla JS without a bundler, we can use dynamic imports if the server supports it
      // or just fetch and eval, but dynamic import is cleaner.
      const module = await import(`../i18n/${lang}.js`);
      this.translations = module.default;
      this.currentLang = lang;
      localStorage.setItem('lang', lang);
    } catch (error) {
      console.error(`Could not load translations for ${lang}:`, error);
      // Fallback to English if not already
      if (lang !== 'en') await this.loadTranslations('en');
    }
  },

  translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (this.translations[key]) {
        // If it's an input with placeholder
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
          el.setAttribute('placeholder', this.translations[key]);
        } else {
          el.innerText = this.translations[key];
        }
      }
    });
    
    // Update document title if applicable
    const titleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (titleKey && this.translations[titleKey]) {
        document.title = this.translations[titleKey] + " - Farm Seeva";
    }
  },

  t(key) {
    return this.translations[key] || key;
  },

  async setLanguage(lang) {
    await this.loadTranslations(lang);
    this.translatePage();
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
  }
};

export default i18n;
