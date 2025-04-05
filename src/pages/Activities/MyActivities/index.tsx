import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, activityApi } from '../../../api/activity.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPencilAlt,
    faTrash,
    faCalendarAlt,
    faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';

export default function MyActivities() {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            navigate('/login', { state: { from: '/my-activities' } });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchMyActivities = async () => {
            try {
                setLoading(true);
                const response = await activityApi.getMyActivities();
                setActivities(response.data.activities);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load your activities');
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            fetchMyActivities();
        }
    }, [isLoggedIn]);

    const handleDeleteActivity = async (id: string) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this activity?',
        );

        if (!confirmed) return;

        try {
            await activityApi.delete(id);
            setActivities(activities.filter((activity) => activity._id !== id));
        } catch (err) {
            console.error('Error deleting activity:', err);
            alert('Failed to delete activity. Please try again.');
        }
    };

    if (!isLoggedIn) {
        return null;
    }

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
                <div className='text-red-500'>{error}</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-3xl font-bold text-gray-800'>
                        My Activities
                    </h1>
                    <button
                        className='bg-primary-pink hover:bg-pink-600 text-white py-2 px-4 rounded-md transition duration-200 flex items-center'
                        onClick={() => navigate('/create-activity')}
                    >
                        <FontAwesomeIcon icon={faPlus} className='mr-2' />
                        Create New
                    </button>
                </div>

                {activities.length === 0 ? (
                    <div className='bg-white rounded-lg shadow-md p-8 text-center'>
                        <div className='text-gray-400 text-6xl mb-4'>
                            <FontAwesomeIcon icon={faMoneyBillWave} />
                        </div>
                        <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
                            No Activities Yet
                        </h2>
                        <p className='text-gray-500 mb-6'>
                            You haven't created any fundraising activities yet.
                        </p>
                        <button
                            className='bg-primary-pink hover:bg-pink-600 text-white py-2 px-6 rounded-md transition duration-200'
                            onClick={() => navigate('/create-activity')}
                        >
                            Create Your First Activity
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 gap-6'>
                        {activities.map((activity) => (
                            <div
                                key={activity._id}
                                className='bg-white rounded-lg shadow-md overflow-hidden'
                            >
                                <div className='md:flex'>
                                    <div className='md:w-1/4'>
                                        <img
                                            src='https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg'
                                            alt={activity.name}
                                            className='h-full w-full object-cover'
                                        />
                                    </div>
                                    <div className='p-6 md:w-3/4'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h2 className='text-xl font-bold text-gray-800 mb-2'>
                                                    {activity.name}
                                                </h2>
                                                <p className='text-gray-600 mb-4 line-clamp-2'>
                                                    {activity.description}
                                                </p>
                                            </div>
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

                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                            <div className='flex items-center text-gray-600'>
                                                <FontAwesomeIcon
                                                    icon={faCalendarAlt}
                                                    className='mr-2 text-primary-pink'
                                                />
                                                <span>
                                                    Ends:{' '}
                                                    {new Date(
                                                        activity.end_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                            <div className='flex items-center text-gray-600'>
                                                <FontAwesomeIcon
                                                    icon={faMoneyBillWave}
                                                    className='mr-2 text-primary-pink'
                                                />
                                                <span>
                                                    ${activity.totalDonations}{' '}
                                                    of ${activity.goalAmount}{' '}
                                                    raised
                                                </span>
                                            </div>
                                        </div>

                                        <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
                                            <div
                                                className='bg-primary-pink h-2.5 rounded-full'
                                                style={{
                                                    width: `${Math.min((activity.totalDonations / activity.goalAmount) * 100, 100)}%`,
                                                }}
                                            ></div>
                                        </div>

                                        <div className='flex justify-between items-center'>
                                            <Link
                                                to={`/activity/${activity._id}`}
                                                className='text-blue-600 hover:underline'
                                            >
                                                View details
                                            </Link>
                                            <div className='flex space-x-2'>
                                                <button
                                                    className='text-gray-500 hover:text-gray-700 p-2'
                                                    onClick={() =>
                                                        navigate(
                                                            `/edit-activity/${activity._id}`,
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPencilAlt}
                                                    />
                                                </button>
                                                <button
                                                    className='text-red-500 hover:text-red-700 p-2'
                                                    onClick={() =>
                                                        handleDeleteActivity(
                                                            activity._id,
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
