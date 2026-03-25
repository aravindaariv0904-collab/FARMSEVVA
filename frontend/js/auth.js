const auth = {
    async login(phone) {
        const errorEl = document.getElementById('login-error');
        errorEl.innerText = '';

        // Simple client-side validation
        if (!phone || phone.length < 10) {
            errorEl.innerText = 'Please enter a valid phone number (min 10 digits)';
            return;
        }

        try {
            const result = await api.request('/auth/login', 'POST', { phoneNumber: phone });
            if (result && result.token) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            errorEl.innerText = error.message;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    }
};

// Event listener for login form
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('phone').value.trim();
        auth.login(phone);
    });
}

// Display user phone on dashboard
if (document.getElementById('user-phone')) {
    const user = auth.getCurrentUser();
    if (user && user.phoneNumber) {
        document.getElementById('user-phone').innerText = user.phoneNumber;
    } else {
        // Not actually logged in?
        if (!window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }
}
