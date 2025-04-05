import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, userApi } from '../../../api/user.api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSave,
    faArrowLeft,
    faEnvelope,
    faIdCard,
    faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function UpdateUser() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<'user' | 'admin'>('user');

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                const response = await userApi.getById(id);
                const userData = response.data.user;

                setUser(userData);

                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setEmail(userData.email);
                setRole(userData.role);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to load user information');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // Form validation
    const validateForm = () => {
        if (!firstName.trim()) {
            setError('First name is required');
            return false;
        }

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
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

            const userData = {
                firstName,
                lastName,
                email,
                role,
            };

            await userApi.update(id, userData);

            navigate('/admin');
        } catch (err: any) {
            console.error('Error updating user:', err);
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink'></div>
            </div>
        );
    }

    if (!user && !loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-red-500 text-xl mb-4'>
                        User not found
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50'>
            <div className='max-w-3xl mx-auto'>
                <div className='flex items-center mb-6'>
                    <button
                        onClick={() => navigate('/admin')}
                        className='mr-4 text-gray-600 hover:text-gray-800'
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 className='text-3xl font-bold text-gray-800'>
                        Edit User
                    </h1>
                </div>

                {error && (
                    <div className='bg-red-50 text-red-700 p-4 rounded-md mb-6'>
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className='bg-white rounded-lg shadow-md p-6'
                >
                    <div className='mb-6'>
                        <label
                            htmlFor='firstName'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            <FontAwesomeIcon
                                icon={faIdCard}
                                className='mr-2 text-primary-pink'
                            />
                            First Name
                        </label>
                        <input
                            type='text'
                            id='firstName'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink'
                        />
                    </div>

                    <div className='mb-6'>
                        <label
                            htmlFor='lastName'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            <FontAwesomeIcon
                                icon={faIdCard}
                                className='mr-2 text-primary-pink'
                            />
                            Last Name
                        </label>
                        <input
                            type='text'
                            id='lastName'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink'
                        />
                    </div>

                    <div className='mb-6'>
                        <label
                            htmlFor='email'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className='mr-2 text-primary-pink'
                            />
                            Email
                        </label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink'
                        />
                    </div>

                    <div className='mb-6'>
                        <label
                            htmlFor='role'
                            className='block text-gray-700 font-medium mb-2'
                        >
                            <FontAwesomeIcon
                                icon={faShieldAlt}
                                className='mr-2 text-primary-pink'
                            />
                            Role
                        </label>
                        <select
                            id='role'
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value as 'user' | 'admin')
                            }
                            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-pink'
                        >
                            <option value='user'>User</option>
                            <option value='admin'>Admin</option>
                        </select>
                    </div>

                    <div className='flex justify-end space-x-4'>
                        <button
                            type='button'
                            onClick={() => navigate('/admin')}
                            className='px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='bg-primary-pink hover:bg-pink-600 text-white px-6 py-3 rounded-md transition duration-200 flex items-center'
                            disabled={saving}
                        >
                            {saving ? (
                                <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2'></div>
                            ) : (
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className='mr-2'
                                />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
