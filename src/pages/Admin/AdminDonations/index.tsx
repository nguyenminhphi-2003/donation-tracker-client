import { useEffect, useState } from 'react';
import { donationApi } from '../../../api/donation.api';

export default function AdminDonations() {
    const [loading, setLoading] = useState<boolean>(true);
    const [donations, setDonations] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await donationApi.getAllDonations();
                setDonations(response.data.donations);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError('Failed to load donations. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-6">
                <div className="text-red-500 mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (donations.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold mb-4">Donation History</h2>
                <p className="text-gray-500">No donations have been made yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Donation History</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {donations.map(donation => (
                            <tr key={donation._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                        {donation.user?.firstName} {donation.user?.lastName}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-gray-500">{donation.activity?.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-green-600 font-medium">${donation.amount}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}