import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faList, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';
import { userApi } from '../../../api/user.api';
import { activityApi } from '../../../api/activity.api';
import { donationApi } from '../../../api/donation.api';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ 
        users: 0, 
        activities: 0, 
        donations: 0, 
        amount: 0, 
        active: 0, 
        closed: 0 
    });
    
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [users, activities, donations] = await Promise.all([
                    userApi.getAll(),
                    activityApi.getAll(), 
                    donationApi.getAllDonations()
                ]);
                
                const acts = activities.data.activities;
                
                setStats({
                    users: users.data.users.length,
                    activities: acts.length,
                    donations: donations.data.donations.length,
                    amount: donations.data.donations.reduce((sum, d) => sum + d.amount, 0),
                    active: acts.filter(a => a.status === 'open').length,
                    closed: acts.filter(a => a.status === 'closed').length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-pink rounded-full"></div>
    </div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-xl" />
                        <div className="ml-3">
                            <div className="text-sm">Users</div>
                            <div className="text-xl font-bold">{stats.users}</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faList} className="text-purple-500 text-xl" />
                        <div className="ml-3">
                            <div className="text-sm">Activities</div>
                            <div className="text-xl font-bold">{stats.activities}</div>
                            <div className="text-xs">{stats.active} active, {stats.closed} closed</div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-500 text-xl" />
                        <div className="ml-3">
                            <div className="text-sm">Donations</div>
                            <div className="text-xl font-bold">${stats.amount}</div>
                            <div className="text-xs">From {stats.donations} donations</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}