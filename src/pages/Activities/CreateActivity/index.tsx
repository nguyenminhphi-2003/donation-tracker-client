import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityApi } from '../../../api/activity.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, 
    faArrowLeft, 
    faCalendarAlt, 
    faMoneyBillWave,
    faInfoCircle,
    faImage
} from '@fortawesome/free-solid-svg-icons';

export default function CreateActivity() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [image, setImage] = useState<string>('');

    // Check if user is logged in
    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            navigate('/login', { state: { from: '/create-activity' } });
        }
    }, [navigate]);

    // Form validation
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
        
        // Optional validation for image URL format if provided
        if (image && !image.match(/^(http|https):\/\/[^ "]+$/)) {
            setError('Please enter a valid image URL');
            return false;
        }
        
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const newActivity = {
                name,
                description,
                goalAmount: Number(goalAmount),
                end_at: new Date(endDate).toISOString(),
                totalDonations: 0,
                status: 'open',
                image: image || 'https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg' // Use default if not provided
            };

            const response = await activityApi.create(newActivity);
            
            // Navigate to the newly created activity
            navigate(`/activity/${response.data.activity._id}`);
        } catch (err: any) {
            console.error('Error creating activity:', err);
            setError(err.response?.data?.message || 'Failed to create activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return null; // User will be redirected in useEffect
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/my-activities')}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Create New Activity</h1>
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
                    
                    <div className="mb-6">
                        <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
                            <FontAwesomeIcon icon={faImage} className="mr-2 text-primary-pink" />
                            Image URL (optional)
                        </label>
                        <input
                            type="text"
                            id="image"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Leave empty to use default image
                        </p>
                        
                        {/* Preview image if URL is provided */}
                        {image && (
                            <div className="mt-3 border rounded-md overflow-hidden" style={{ maxWidth: '300px' }}>
                                <img 
                                    src={image} 
                                    alt="Preview" 
                                    className="w-full h-auto"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg';
                                        (e.target as HTMLImageElement).onerror = null;
                                    }}
                                />
                            </div>
                        )}
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

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/my-activities')}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-pink hover:bg-pink-600 text-white px-6 py-3 rounded-md transition duration-200 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            ) : (
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                            )}
                            Create Activity
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}