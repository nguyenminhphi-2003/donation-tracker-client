import api from './axios';

export const authApi = {
    login: (email: string, password: string) =>
        api.post(
            '/users/login',
            { email, password },
            { withCredentials: true },
        ),

    logout: () => api.get('/users/logout'),

    checkAdmin: () =>
        api.post('/users/check-admin', { withCredentials: true }),
};
