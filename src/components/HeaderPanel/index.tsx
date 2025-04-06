import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faLock } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth.api';

function HeaderPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const cookie = document.cookie;
        if (cookie && !cookie.includes('loggedout')) {
            setIsLoggedIn(true);

            // Check if user is admin
            const checkAdminStatus = async () => {
                try {
                    const response = await authApi.checkAdmin();
                    if (
                        response.data.status === 'success' &&
                        response.data.data.isAdmin === true
                    ) {
                        setIsAdmin(true);
                    }
                } catch (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                }
            };

            checkAdminStatus();
        } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
        }
    }, [location]);

    const handleLogout = async () => {
        await authApi.logout();
        setIsLoggedIn(false);
        setIsAdmin(false);
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
                className={`absolute flex flex-col top-12 right-0 w-48 overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-lg ${isOpen ? 'max-h-96 border border-gray-300' : 'max-h-0'}`}
            >
                <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                    <Link to={'/activities'}>All Activities</Link>
                </li>

                {isLoggedIn && (
                    <>
                        <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                            <Link to={'/my-activities'}>My Activities</Link>
                        </li>
                        <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                            <Link to={'/my-donations'}>My Donations</Link>
                        </li>

                        {isAdmin && (
                            <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold border-t border-gray-200'>
                                <Link
                                    to={'/admin'}
                                    className='flex items-center'
                                >
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className='mr-2 text-primary-pink'
                                    />
                                    Admin Dashboard
                                </Link>
                            </li>
                        )}
                    </>
                )}

                {!isLoggedIn ? (
                    <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold'>
                        <Link to={'/login'}>Login</Link>
                    </li>
                ) : (
                    <li className='px-4 py-3 transition-transform duration-150 hover:translate-x-1 hover:font-semibold border-t border-gray-200'>
                        <button
                            className='cursor-pointer w-full text-left'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}
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
