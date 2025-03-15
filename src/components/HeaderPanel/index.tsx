import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

function HeaderPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const cookie = document.cookie;
        console.log(cookie);

        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [location]);

    const handleLogout = async () => {
        await authApi.logout();
        setIsLoggedIn(false);
        document.cookie = 'jwt=loggedout';
        navigate('/');
    };

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl select-none ${isOpen ? 'bg-gray-200' : ''}`}
        >
            <FontAwesomeIcon icon={faBars} />

            <ul
                className={`absolute flex flex-col top-12 right-0 w-48 overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-lg ${isOpen ? 'max-h-64 border border-gray-300' : 'max-h-0'}`}
            >
                <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                    <Link to={'/login'}>All Activities</Link>
                </li>
                <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                    <Link to={'/login'}>My Activities</Link>
                </li>
                <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                    <Link to={'/login'}>My Donations</Link>
                </li>

                {!isLoggedIn ? (
                    <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                        <Link to={'/login'}>Login</Link>
                    </li>
                ) : (
                    <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                        <button
                            className='cursor-pointer'
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default HeaderPanel;
