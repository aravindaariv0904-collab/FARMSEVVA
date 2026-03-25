const config = {
    API_URL: '/api/v1',
};

const api = {
    async request(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${config.API_URL}${endpoint}`, options);
            
            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                console.warn('Session expired. Redirecting to login.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.endsWith('index.html')) {
                    window.location.href = 'index.html';
                }
                return;
            }

            const data = await response.json();
            
            if (!response.ok) {
                // If it's a validation error, it might have 'details' from Zod
                const errorMsg = data.error || (data.details ? 'Validation failed' : 'Request failed');
                const error = new Error(errorMsg);
                error.details = data.details;
                throw error;
            }
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
