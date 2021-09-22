import React from 'react';
import { Redirect } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";

const routes = [
    {
        path: '/app/home',
        exact: true,
        component: () => <Home />
    },
    {
        path: '/app/profile',
        exact: true,
        component: () => <Profile />
    },
    {
        path: '',
        exact: true,
        component: () => <Redirect to="/page-not-found" />
    }
]

export default routes;