import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Donation, donationApi } from '../../../api/donation.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faReceipt,
    faCalendarAlt,
    faMoneyBillWave,
    faTag,
    faArrowLeft,
    faUser
} from '@fortawesome/free-solid-svg-icons';

export default function MyDonations() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Check if user is logged in
    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            navigate('/login', { state: { from: '/my-donations' } });
        }
    }, [navigate]);

    // Fetch donations
    useEffect(() => {
        const fetchMyDonations = async () => {
            try {
                setLoading(true);
                const response = await donationApi.getMyDonations();
                setDonations(response.data.donations);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setError('Failed to load your donations');
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchMyDonations();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null; // User will be redirected in useEffect
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">My Donations</h1>
                </div>

                {donations.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-6xl mb-4">
                            <FontAwesomeIcon icon={faMoneyBillWave} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Donations Yet</h2>
                        <p className="text-gray-500 mb-6">You haven't made any donations yet.</p>
                        <button 
                            className="bg-primary-pink hover:bg-pink-600 text-white py-2 px-6 rounded-md transition duration-200"
                            onClick={() => navigate('/activities')}
                        >
                            Browse Activities
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-xl font-semibold text-gray-800">Donation History</h2>
                            <p className="text-sm text-gray-500">All your contributions in one place</p>
                        </div>
                        
                        <ul className="divide-y divide-gray-200">
                            {donations.map((donation) => {
                                // Format date for display
                                const donationDate = new Date(donation._id.substring(0, 8));
                                const formattedDate = donationDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                });
                                
                                return (
                                    <li key={donation._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                            <div className="mb-4 md:mb-0">
                                                <h3 className="text-lg font-medium text-gray-800 mb-1">
                                                    <Link 
                                                        to={`/activity/${donation.activity._id}`}
                                                        className="hover:text-primary-pink transition-colors"
                                                    >
                                                        {donation.activity.name}
                                                    </Link>
                                                </h3>
                                                
                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faTag} className="mr-2 text-primary-pink" />
                                                        <span>ID: {donation._id.substring(0, 8)}...</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-primary-pink" />
                                                        <span>Date: {formattedDate}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center">
                                                        <FontAwesomeIcon icon={faUser} className="mr-2 text-primary-pink" />
                                                        <span>Donor: {donation.user.firstName} {donation.user.lastName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gray-100 px-4 py-2 rounded-md">
                                                <div className="flex items-center">
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-600" />
                                                    <span className="font-semibold text-green-600">${donation.amount.toFixed(2)}</span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <FontAwesomeIcon icon={faReceipt} className="mr-1" />
                                                    Receipt ID: {donation._id}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        
                        <div className="bg-gray-50 px-6 py-4 text-right">
                            <div className="text-lg font-semibold text-gray-800">
                                Total Donated: ${donations.reduce((total, donation) => total + donation.amount, 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {donations.length} donation{donations.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}