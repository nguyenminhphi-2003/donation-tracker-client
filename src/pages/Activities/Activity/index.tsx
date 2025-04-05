import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    activityApi,
    Activity as ActivityType,
} from '../../../api/activity.api';
import { donationApi } from '../../../api/donation.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faUser,
    faInfoCircle,
    faMoneyBillWave,
    faTimes,
    faDollarSign,
} from '@fortawesome/free-solid-svg-icons';

export default function Activity() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Donation Modal State
    const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
    const [donationAmount, setDonationAmount] = useState<string>('');
    const [donationLoading, setDonationLoading] = useState<boolean>(false);
    const [donationError, setDonationError] = useState<string | null>(null);

    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await activityApi.getById(id);
                setActivity(response.data.activity);
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity details');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

    const handleDonationButton = () => {
        if (!isLoggedIn) {
            navigate('/login', {
                state: { from: `/activity/${id}` },
            });
            return;
        }
        setShowDonationModal(true);
    };

    const handleDonationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (
            !donationAmount ||
            isNaN(Number(donationAmount)) ||
            Number(donationAmount) <= 0
        ) {
            setDonationError('Please enter a valid donation amount');
            return;
        }
    
        try {
            setDonationLoading(true);
            setDonationError(null);
    
            const donationValue = Number(donationAmount);
    
            await donationApi.create(id!, donationValue);
    
            const newTotalDonations = activity!.totalDonations + donationValue;
            setActivity({
                ...activity!,
                totalDonations: newTotalDonations,
            });
    
            setDonationAmount('');
            setShowDonationModal(false);
    
            alert('Thank you for your donation!');
        } catch (err) {
            console.error('Error submitting donation:', err);
            setDonationError(
                'Failed to process your donation. Please try again.',
            );
        } finally {
            setDonationLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink'></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-red-500'>Error: {error}</div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-gray-600'>Activity not found</div>
            </div>
        );
    }

    const formattedEndDate = new Date(activity.end_at).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    );

    const progressPercentage =
        (activity.totalDonations / activity.goalAmount) * 100;

    return (
        <div className='min-h-screen p-4 md:p-6 bg-gray-50'>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
                {/* Banner Image */}
                <div className='h-60 relative overflow-hidden'>
                    <img
                        src='https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg'
                        className='w-full h-full object-cover'
                        alt={activity.name}
                    />
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <h1 className='text-4xl font-bold text-white drop-shadow-lg'>
                            {activity.name}
                        </h1>
                    </div>
                </div>

                {/* Activity Details */}
                <div className='p-6'>
                    {/* Status Badge */}
                    <div className='flex justify-end mb-4'>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                activity.status === 'open'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {activity.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Main Info */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <div>
                            <h2 className='text-xl font-semibold mb-4 flex items-center text-gray-800'>
                                <FontAwesomeIcon
                                    icon={faInfoCircle}
                                    className='mr-2 text-primary-pink'
                                />
                                About this activity
                            </h2>
                            <p className='text-gray-700 mb-4'>
                                {activity.description}
                            </p>

                            <div className='flex items-center text-gray-600 mb-3'>
                                <FontAwesomeIcon
                                    icon={faUser}
                                    className='mr-2 text-primary-pink'
                                />
                                <span>
                                    Created by:{' '}
                                    {activity.creator
                                        ? `${activity.creator.firstName} ${activity.creator.lastName}`
                                        : 'Unknown'}
                                </span>
                            </div>

                            <div className='flex items-center text-gray-600'>
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className='mr-2 text-primary-pink'
                                />
                                <span>Ends on: {formattedEndDate}</span>
                            </div>
                        </div>

                        <div>
                            <h2 className='text-xl font-semibold mb-4 flex items-center text-gray-800'>
                                <FontAwesomeIcon
                                    icon={faMoneyBillWave}
                                    className='mr-2 text-primary-pink'
                                />
                                Funding
                            </h2>

                            <div className='bg-gray-50 rounded-lg p-4 border border-gray-100'>
                                <div className='flex justify-between mb-2 font-medium'>
                                    <span>Current Progress</span>
                                    <span className='text-primary-pink'>
                                        ${activity.totalDonations} of $
                                        {activity.goalAmount}
                                    </span>
                                </div>

                                <div className='w-full bg-gray-200 rounded-full h-3 mb-3'>
                                    <div
                                        className='bg-primary-pink h-3 rounded-full transition-all duration-500 ease-in-out'
                                        style={{
                                            width: `${Math.min(progressPercentage, 100)}%`,
                                        }}
                                    ></div>
                                </div>

                                <div className='text-right text-sm text-gray-500'>
                                    {progressPercentage.toFixed(1)}% funded
                                </div>

                                <div className='mt-4'>
                                    <button
                                        className='w-full bg-primary-pink hover:bg-pink-600 text-white py-3 px-4 rounded-md transition duration-200 font-medium'
                                        onClick={() => handleDonationButton()}
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional details */}
                    <div className='mt-8 pt-6 border-t border-gray-200'>
                        <h3 className='text-lg font-semibold mb-3 text-gray-800'>
                            Activity Details
                        </h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='bg-gray-50 p-3 rounded-md'>
                                <div className='text-sm text-gray-500'>ID</div>
                                <div className='font-mono text-xs overflow-hidden overflow-ellipsis'>
                                    {activity._id}
                                </div>
                            </div>
                            <div className='bg-gray-50 p-3 rounded-md'>
                                <div className='text-sm text-gray-500'>
                                    Status
                                </div>
                                <div className='font-medium capitalize'>
                                    {activity.status}
                                </div>
                            </div>
                            <div className='bg-gray-50 p-3 rounded-md'>
                                <div className='text-sm text-gray-500'>
                                    Goal Amount
                                </div>
                                <div className='font-medium'>
                                    ${activity.goalAmount}
                                </div>
                            </div>
                            <div className='bg-gray-50 p-3 rounded-md'>
                                <div className='text-sm text-gray-500'>
                                    Current Donations
                                </div>
                                <div className='font-medium'>
                                    ${activity.totalDonations}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Modal Popup */}
            {showDonationModal && (
                <div className='fixed inset-0 flex items-center justify-center z-50 p-4'>
                    {' '}
                    <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative'>
                        {/* Close button */}
                        <button
                            onClick={() => setShowDonationModal(false)}
                            className='absolute top-4 right-4 text-gray-500 hover:text-gray-800'
                        >
                            <FontAwesomeIcon icon={faTimes} size='lg' />
                        </button>

                        <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                            Make a Donation
                        </h2>

                        {donationError && (
                            <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md'>
                                {donationError}
                            </div>
                        )}

                        <form onSubmit={handleDonationSubmit}>
                            <div className='mb-4'>
                                <label
                                    className='block text-gray-700 mb-2'
                                    htmlFor='amount'
                                >
                                    Donation Amount ($)
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <FontAwesomeIcon
                                            icon={faDollarSign}
                                            className='text-gray-500'
                                        />
                                    </div>
                                    <input
                                        id='amount'
                                        type='number'
                                        min='1'
                                        step='0.01'
                                        placeholder='Enter amount'
                                        className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink'
                                        value={donationAmount}
                                        onChange={(e) =>
                                            setDonationAmount(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className='flex space-x-3'>
                                <button
                                    type='button'
                                    className='flex-1 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200'
                                    onClick={() => setShowDonationModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className='flex-1 bg-primary-pink hover:bg-pink-600 text-white py-3 rounded-md transition duration-200 flex items-center justify-center'
                                    disabled={donationLoading}
                                >
                                    {donationLoading ? (
                                        <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white'></div>
                                    ) : (
                                        'Submit Donation'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
