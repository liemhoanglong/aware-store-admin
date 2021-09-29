import React from 'react';
import { Redirect } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import CRUProduct from "./pages/CRUProduct";
import Order from './pages/Order';
import CRUCategroup from './pages/CRUCategroup';
import CRUCate from './pages/CRUCate';
import CRUBrand from './pages/CRUBrand';
import CRUColor from './pages/CRUColor';

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
        component: () => <CRUProduct />
    },
    {
        path: '/app/products/edit-product/:id',
        exact: true,
        component: () => <CRUProduct />
    },
    {
        path: '/app/orders',
        exact: true,
        component: () => <Order />
    },
    {
        path: '/app/categroup',
        exact: true,
        component: () => <CRUCategroup />
    },
    {
        path: '/app/category',
        exact: true,
        component: () => <CRUCate />
    },
    {
        path: '/app/brand',
        exact: true,
        component: () => <CRUBrand />
    },
    {
        path: '/app/color',
        exact: true,
        component: () => <CRUColor />
    },
    {
        path: '',
        exact: true,
        component: () => <Redirect to="/page-not-found" />
    }
]

export default routes;