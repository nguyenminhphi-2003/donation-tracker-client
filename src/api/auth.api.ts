import api from './axios';

export const authApi = {
    login: (email: string, password: string) =>
        api.post(
            '/users/login',
            { email, password },
            { withCredentials: true },
        ),

    signup: (email: string, password: string, firstName: string, lastName: string) => (
        api.post(
            '/users/signup',
            { email, password, firstName, lastName },
        )
    ),

    logout: () => api.get('/users/logout'),

    checkAdmin: () =>
        api.post('/users/check-admin', { withCredentials: true }),
};
