import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activityApi } from '../../../api/activity.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, 
    faArrowLeft, 
    faCalendarAlt, 
    faMoneyBillWave,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

export default function UpdateActivity() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

    // Form state
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<'open' | 'closed'>('open');

    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            navigate('/login', { state: { from: `/edit-activity/${id}` } });
        }
    }, [id, navigate]);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!id || !isLoggedIn) return;

            try {
                setLoading(true);
                const response = await activityApi.getById(id);
                const activity = response.data.activity;

                setName(activity.name);
                setDescription(activity.description);
                setGoalAmount(activity.goalAmount.toString());
                
                const date = new Date(activity.end_at);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                setEndDate(`${year}-${month}-${day}`);
                
                setStatus(activity.status);
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity details');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id, isLoggedIn]);

    const validateForm = () => {
        if (!name.trim()) {
            setError('Name is required');
            return false;
        }
        
        if (!description.trim()) {
            setError('Description is required');
            return false;
        }
        
        if (!goalAmount || isNaN(Number(goalAmount)) || Number(goalAmount) <= 0) {
            setError('Goal amount must be a positive number');
            return false;
        }
        
        if (!endDate) {
            setError('End date is required');
            return false;
        }
        
        const selectedDate = new Date(endDate);
        const today = new Date();
        
        if (selectedDate < today) {
            setError('End date cannot be in the past');
            return false;
        }
        
        return true;
    };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormSubmitting(true);
    setError(null);
    
    try {
        const updatedActivity = {
            name,
            description,
            goalAmount: Number(goalAmount),
            end_at: new Date(endDate).toISOString(),
            status
        };
        await activityApi.update(id!, updatedActivity);
        navigate(`/activity/${id}`);
    } catch (err) {
        console.error('Error updating activity:', err);
        setError('Failed to update activity. Please try again.');
    } finally {
        setFormSubmitting(false);
    }
};

    if (!isLoggedIn) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(`/activity/${id}`)}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Activity</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-primary-pink" />
                            Activity Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                            placeholder="Enter activity name"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                            <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-primary-pink" />
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                            placeholder="Describe your activity"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="goalAmount" className="block text-gray-700 font-medium mb-2">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-primary-pink" />
                                Goal Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    id="goalAmount"
                                    value={goalAmount}
                                    onChange={(e) => setGoalAmount(e.target.value)}
                                    className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                                    placeholder="Enter amount"
                                    min="1"
                                    step="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-primary-pink" />
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Status</label>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="open"
                                    checked={status === 'open'}
                                    onChange={() => setStatus('open')}
                                    className="text-primary-pink"
                                />
                                <span className="ml-2">Open</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="closed"
                                    checked={status === 'closed'}
                                    onChange={() => setStatus('closed')}
                                    className="text-primary-pink"
                                />
                                <span className="ml-2">Closed</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/activity/${id}`)}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-pink hover:bg-pink-600 text-white px-6 py-3 rounded-md transition duration-200 flex items-center"
                            disabled={formSubmitting}
                        >
                            {formSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}