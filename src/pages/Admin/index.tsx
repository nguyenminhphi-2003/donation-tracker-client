import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faList, faMoneyBillWave, faChartLine } from '@fortawesome/free-solid-svg-icons';

import AdminUsers from './AdminUsers';
import AdminActivities from './AdminActivities';
import AdminDonations from './AdminDonations';
import AdminDashboard from './AdminDashboard';

enum Tab { Dashboard = 'dashboard', Users = 'users', Activities = 'activities', Donations = 'donations' }

export default function Admin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(Tab.Dashboard);
    
    useEffect(() => {
        setTimeout(() => {
            document.cookie.includes('loggedout') 
                ? navigate('/login') 
                : setLoading(false);
        }, 1000);
    }, [navigate]);

    if (loading) return <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary-pink rounded-full"></div>
    </div>;

    const content = {
        [Tab.Dashboard]: <AdminDashboard />,
        [Tab.Users]: <AdminUsers />,
        [Tab.Activities]: <AdminActivities />,
        [Tab.Donations]: <AdminDonations />
    };

    return (
        <div className="max-w-7xl mx-auto p-4 pt-16">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-800 p-4 text-white">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </div>
                
                <div className="flex border-b overflow-x-auto">
                    {Object.entries({
                        [Tab.Dashboard]: { icon: faChartLine, label: 'Dashboard' },
                        [Tab.Users]: { icon: faUsers, label: 'Users' },
                        [Tab.Activities]: { icon: faList, label: 'Activities' },
                        [Tab.Donations]: { icon: faMoneyBillWave, label: 'Donations' }
                    }).map(([key, { icon, label }]) => (
                        <button 
                            key={key}
                            onClick={() => setActiveTab(key as Tab)}
                            className={`px-4 py-2 ${activeTab === key ? 'border-b-2 border-primary-pink' : ''}`}
                        >
                            <FontAwesomeIcon icon={icon} className="mr-2" />
                            {label}
                        </button>
                    ))}
                </div>
                
                <div className="p-4">
                    {content[activeTab]}
                </div>
            </div>
        </div>
    );
}