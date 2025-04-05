import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
      }
});

api.interceptors.request.use(
    response => response,
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (config) => {
        const cookies = document.cookie.split(';');
        let token = '';
        
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'jwt') {
                token = value;
                break;
            }
        }
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

// https://donation-tracker-api.onrender.com/api/activities