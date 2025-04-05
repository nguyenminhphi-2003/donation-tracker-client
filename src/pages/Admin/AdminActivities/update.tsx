import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { activityApi } from '../../../api/activity.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSave, 
    faArrowLeft, 
    faCalendarAlt, 
    faMoneyBillWave,
    faInfoCircle,
    faImage,
    faToggleOn
} from '@fortawesome/free-solid-svg-icons';

export default function UpdateActivity() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [activity, setActivity] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [goalAmount, setGoalAmount] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<'open' | 'closed'>('open');
    const [image, setImage] = useState<string>('');

    // Fetch activity data
    useEffect(() => {
        const fetchActivity = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                setError(null);
                
                const response = await activityApi.getById(id);
                const activityData = response.data.activity;
                
                setActivity(activityData);
                
                // Initialize form fields
                setName(activityData.name);
                setDescription(activityData.description);
                setGoalAmount(activityData.goalAmount.toString());
                
                // Format the date for input field (YYYY-MM-DD)
                const endDate = new Date(activityData.end_at);
                setEndDate(endDate.toISOString().split('T')[0]);
                
                setStatus(activityData.status);
                setImage(activityData.image || '');
                
            } catch (err) {
                console.error('Error fetching activity:', err);
                setError('Failed to load activity information');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id]);

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
        
        if (!validateForm() || !id) return;
        
        try {
            setSaving(true);
            setError(null);
            
            const activityData = {
                name,
                description,
                goalAmount: Number(goalAmount),
                end_at: new Date(endDate).toISOString(),
                status,
                image: image || 'https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg' // Use default if not provided
            };
            
            await activityApi.update(id, activityData);
            
            // Navigate back to activities list
            navigate('/admin');
        } catch (err: any) {
            console.error('Error updating activity:', err);
            setError(err.response?.data?.message || 'Failed to update activity');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
            </div>
        );
    }

    if (!activity && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">Activity not found</div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Back to Activities
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/admin')}
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
                            
                            {activity && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Current donations: ${activity.totalDonations}
                                </p>
                            )}
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
                        <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                            <FontAwesomeIcon icon={faToggleOn} className="mr-2 text-primary-pink" />
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as 'open' | 'closed')}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {activity?.creator && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500">
                                Created by: {activity.creator.firstName} {activity.creator.lastName}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary-pink hover:bg-pink-600 text-white px-6 py-3 rounded-md transition duration-200 flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
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