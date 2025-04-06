import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

function Homepage() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const response = await authApi.checkAdmin();
                if (response.data.status === "success" && response.data.data.isAdmin === true) {
                    setIsAdmin(true);
                    navigate('/admin');
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };
        
        checkAdminStatus();
    }, [navigate]); // Removed isAdmin from dependencies to prevent infinite loop

    return (
        <div
            className="
                relative bg-[url('https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/050/Individual_giving_-_Main.png')] bg-cover bg-center h-screen"
        >
            <div className='absolute right-30 top-60 text-center items-center'>
                <h1 className='text-primary-pink text-6xl font-bold'>
                    Sharing is caring
                </h1>

                <div className='text-white text-2xl italic opacity-70 my-4'>
                    <p>Help us to help others</p>
                    <p>by donating to our causes</p>
                </div>

                <Link
                    to='/activities'
                    className='inline-block bg-primary-pink text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition duration-200'
                >
                    Donate Now
                </Link>
            </div>
        </div>
    );
}

export default Homepage;