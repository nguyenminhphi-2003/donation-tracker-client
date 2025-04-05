import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityApi } from '../../../api/activity.api';


export default function AdminActivities() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [activities, setActivities] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await activityApi.getAll();
                setActivities(response.data.activities);
            } catch (err) {
                console.error('Error fetching activities:', err);
                setError('Failed to load activities. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const handleDeleteActivity = async (id: string, name: string) => {
        const confirmed = window.confirm(`Are you sure you want to delete activity: ${name}?`);
        
        if (!confirmed) return;
        
        try {
            setIsDeleting(true);
            
            await activityApi.delete(id);
            
            setActivities(activities.filter(activity => activity._id !== id));
            
            alert('Activity deleted successfully');
        } catch (err) {
            console.error('Error deleting activity:', err);
            alert('Failed to delete activity. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

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

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Manage Activities</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.map(activity => (
                            <tr key={activity._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{activity.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${activity.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {activity.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                            <div 
                                                className="bg-primary-pink h-2.5 rounded-full" 
                                                style={{ width: `${Math.min((activity.totalDonations / activity.goalAmount) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            ${activity.totalDonations} / ${activity.goalAmount}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                        onClick={() => navigate(`/admin/activities/${activity._id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => handleDeleteActivity(activity._id, activity.name)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}