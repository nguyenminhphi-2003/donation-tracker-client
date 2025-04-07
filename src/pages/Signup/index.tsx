import { Form, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../../api/auth.api';
import { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;

        if (!firstName.trim() || !lastName.trim()) {
            setErrors('First name and last name are required');
            isValid = false;
            return isValid;
        }

        if (!email.trim()) {
            setErrors('Email is required');
            isValid = false;
            return isValid;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors('Please enter a valid email address');
            isValid = false;
            return isValid;
        }

        if (!password.trim()) {
            setErrors('Password is required');
            isValid = false;
            return isValid;
        }

        if (password.length < 3) {
            setErrors('Password must be at least 3 characters long');
            isValid = false;
            return isValid;
        }

        if (password !== confirmPassword) {
            setErrors('Passwords do not match');
            isValid = false;
            return isValid;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                await authApi.signup(email, password, firstName, lastName);
                setErrors('');
                navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    setErrors(
                        error.response?.data?.message || 'An error occurred during signup',
                    );
                } else {
                    setErrors('An unexpected error occurred');
                }
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='h-screen flex justify-center items-center bg-gray-100'>
            <Form
                onSubmit={handleSubmit}
                className='rounded-2xl bg-white shadow-md w-1/2 min-h-3/5 flex flex-col items-center py-8'
            >
                <h1 className='text-2xl text-primary-pink font-semibold mb-8 uppercase'>
                    Create your account
                </h1>
                
                <div className='w-3/5'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <FontAwesomeIcon icon={faUser} className='text-gray-400' />
                        </div>
                        <input
                            type='text'
                            className={`bg-gray-100 rounded-md h-12 w-full my-3 px-10 ${errors && errors.includes('name') ? 'border-2 border-red-500' : ''}`}
                            name='firstName'
                            placeholder='First Name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                </div>

                <div className='w-3/5'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <FontAwesomeIcon icon={faUser} className='text-gray-400' />
                        </div>
                        <input
                            type='text'
                            className={`bg-gray-100 rounded-md h-12 w-full my-3 px-10 ${errors && errors.includes('name') ? 'border-2 border-red-500' : ''}`}
                            name='lastName'
                            placeholder='Last Name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>

                <div className='w-3/5'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400' />
                        </div>
                        <input
                            type='email'
                            className={`bg-gray-100 rounded-md h-12 w-full my-3 px-10 ${errors && errors.includes('email') ? 'border-2 border-red-500' : ''}`}
                            name='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className='w-3/5'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <FontAwesomeIcon icon={faLock} className='text-gray-400' />
                        </div>
                        <input
                            type='password'
                            className={`bg-gray-100 rounded-md h-12 w-full my-3 px-10 ${errors && errors.includes('password') ? 'border-2 border-red-500' : ''}`}
                            name='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className='w-3/5'>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                            <FontAwesomeIcon icon={faLock} className='text-gray-400' />
                        </div>
                        <input
                            type='password'
                            className={`bg-gray-100 rounded-md h-12 w-full my-3 px-10 ${errors && errors.includes('password') ? 'border-2 border-red-500' : ''}`}
                            name='confirmPassword'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {errors && (
                    <span className='text-red-500 text-sm font-bold mt-2 mb-3'>
                        {errors}
                    </span>
                )}

                <button
                    type='submit'
                    className='bg-primary-pink text-white mt-5 px-8 py-3 rounded-md transition-transform duration-200 cursor-pointer hover:-translate-y-1 active:opacity-50 flex items-center'
                    disabled={isLoading}
                >
                    Sign up
                    {isLoading ? (
                        <svg
                            className='animate-spin h-5 w-5 text-white ml-2'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                    ) : (
                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                    )}
                </button>

                <div className="mt-6 text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-pink hover:underline">
                        Log in
                    </Link>
                </div>
            </Form>
        </div>
    );
}