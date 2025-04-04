import api from './axios';

export interface Creator {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface Activity {
    _id: string;
    creator: Creator;
    name: string;
    description: string;
    goalAmount: number;
    totalDonations: number;
    status: 'open' | 'closed';
    end_at: string;
    __v: number;
}

export const activityApi = {
    getAll: async () => {
        const response = await api.get('/activities');
        return response.data;
    },
    
    getById: async (id: string) => {
        const response = await api.get(`/activities/${id}`);
        return response.data;
    },
    
    create: async (activity: any) => {
        const response = await api.post('/activities', activity);
        return response.data;
    },
    
    update: async (id: string, activity: any) => {
        const response = await api.put(`/activities/${id}`, activity);
        return response.data;
    },
    
    delete: async (id: string): Promise<void> => {
        await api.delete(`/activities/${id}`);
    }
};
