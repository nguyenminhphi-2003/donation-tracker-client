import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import Homepage from '../pages/Homepage';
import Login from '../pages/Login';
import Activities from '../pages/Activities';
import Activity from '../pages/Activities/Activity';
import MyActivities from '../pages/Activities/MyActivities';
import UpdateActivity from '../pages/Activities/UpdateActivity';
import CreateActivity from '../pages/Activities/CreateActivity';
import MyDonations from '../pages/Donations/MyDonations';

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
            },
            {
                path: '/activity/:id',
                element: createElement(Activity),
            },
            {
                path: '/my-activities',
                element: createElement(MyActivities),
            },
            {
                path: '/edit-activity/:id',
                element: createElement(UpdateActivity),
            },
            {
                path: '/create-activity',
                element: createElement(CreateActivity),
            },
            {
                path: '/my-donations',
                element: createElement(MyDonations),
            },
        ],
    },
]);
