import { useEffect, useState } from 'react';
import ActivityItem from '../../components/ActivityItem';
import { activityApi, Activity } from '../../api/activity.api';

export default function Activities() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await activityApi.getAll();
            setActivities(response.data.activities);
        };
        fetchActivities();
    }, []);

    return (
        <div className='min-h-screen flex flex-col items-center'>
            <h1 className='mt-10 text-5xl text-primary-pink'>All Activities</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
                {
                    activities.map((activity: Activity) => (
                        <ActivityItem key={activity._id} activity={activity} />
                    ))
                }
            </div>
        </div>
    );
}
