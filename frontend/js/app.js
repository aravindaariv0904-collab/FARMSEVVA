import i18n from './i18n.js';
import auth from './auth.js';

const app = {
  async init() {
    await i18n.init();
    
    // Global language change listener
    window.addEventListener('languageChanged', (e) => {
        console.log(`Language changed to ${e.detail}`);
    });

    // Check auth for protected routes if needed globally
    // But pages usually handle it on their own scripts.
  }
};

document.addEventListener('DOMContentLoaded', () => app.init());

export default app;
