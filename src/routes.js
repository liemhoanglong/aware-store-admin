import React from 'react';
import { Redirect } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import Order from './pages/Order';

const routes = [
    {
        path: '/app/overview',
        exact: true,
        component: () => <Home />
    },
    {
        path: '/app/profile',
        exact: true,
        component: () => <Profile />
    },
    {
        path: '/app/products',
        exact: true,
        component: () => <Product />
    },
    {
        path: '/app/products/add-product',
        exact: true,
        component: () => <Product />
    },
    {
        path: '/app/products/edit-product/:id',
        exact: true,
        component: () => <Product />
    },
    {
        path: '/app/orders',
        exact: true,
        component: () => <Order />
    },
    {
        path: '',
        exact: true,
        component: () => <Redirect to="/page-not-found" />
    }
]

export default routes;