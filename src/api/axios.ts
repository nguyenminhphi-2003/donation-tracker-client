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

export default api;