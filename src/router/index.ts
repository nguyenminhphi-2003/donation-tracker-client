import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import Homepage from '../pages/Homepage';
import Login from '../pages/Login';
import Activities from '../pages/Activities';

export default createBrowserRouter([
    {
        path: '/',
        element: createElement(App),
        children: [
            {
                path: '/',
                element: createElement(Homepage),
            },
            {
                path: '/login',
                element: createElement(Login),
            },
            {
                path: '/activities',
                element: createElement(Activities),
            }
        ]
    },
]);
