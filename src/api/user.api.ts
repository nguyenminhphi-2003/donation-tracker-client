import api from './axios';

// Define user interface based on the response structure
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    __v?: number;
}

export const userApi = {
    create: async (userData: any) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    
    getById: async (id: string) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    
    update: async (id: string, userData: any) => {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    },
    
    delete: async (id: string) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};