import { Form, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { authApi } from '../../api/auth.api';
import { AxiosError } from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        let isValid = true;

        if (!email.trim() || !password.trim()) {
            setErrors('Missing email or password');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const loginToken = await authApi.login(email, password);
                setErrors('');
                document.cookie = `jwt=${loginToken.data.token}`;
                navigate('/');
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    setErrors(
                        error.response?.data?.message || 'An error occurred',
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
                className='rounded-2xl bg-white shadow-md w-1/2 min-h-3/5 flex flex-col items-center'
            >
                <h1 className='text-2xl text-primary-pink font-semibold mt-10 mb-5 uppercase'>
                    Log into your account
                </h1>
                <div className='w-3/5'>
                    <input
                        type='email'
                        className={`bg-gray-100 rounded-md h-10 w-full my-5 px-3 ${errors && 'border-2 border-red-500'}`}
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='w-3/5'>
                    <input
                        type='password'
                        className={`bg-gray-100 rounded-md h-10 w-full my-5 px-3 ${errors && 'border-2 border-red-500'}`}
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errors && (
                    <span className='text-red-500 text-sm font-bold'>
                        {errors}
                    </span>
                )}
                <button
                    type='submit'
                    className='bg-primary-pink text-white mt-5 px-8 py-3 rounded-md transition-transform duration-200 cursor-pointer hover:-translate-y-1 active:opacity-50 flex'
                >
                    Login
                    {isLoading && (
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
                    )}
                </button>
                <div className='mt-6 text-gray-600'>
                    Don't have an account?{' '}
                    <Link
                        to='/signup'
                        className='text-primary-pink hover:underline'
                    >
                        Sign up
                    </Link>
                </div>
            </Form>
        </div>
    );
}
