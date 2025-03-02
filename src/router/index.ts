import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import Homepage from '../pages/Homepage';
import Login from '../pages/Login';

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
            }
        ]
    },
]);
