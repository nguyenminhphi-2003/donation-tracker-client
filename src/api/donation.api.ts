import api from './axios';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

export interface Activity {
    _id: string;
    name: string;
}

export interface Donation {
    _id: string;
    user: User;
    activity: Activity;
    amount: number;
}

export const donationApi = {
    getMyDonations: async () => {
        const response = await api.get('/donations/my-donations');
        return response.data;
    },

    getAllDonations: async () => {
        const response = await api.get('/donations');
        return response.data;
    },
    
    create: async (activityId: string, amount: number) => {
        const response = await api.post('/donations', { 
            activity: activityId, 
            amount 
        });
        return response.data;
    }
};