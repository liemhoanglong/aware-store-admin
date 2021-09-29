import React from 'react';
import { Stack } from '@mui/material';
import { Link, useHistory } from "react-router-dom";

import logo from '../../assets/logo.svg';
import OverviewIcon from '../Icon/OverviewIcon';
import OrderIcon from '../Icon/OrderIcon';
import ProductIcon from '../Icon/ProductIcon';
import PaymentIcon from '../Icon/PaymentIcon';
import PromoIcon from '../Icon/PromoIcon';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CategoryIcon from '@mui/icons-material/Category';
import SettingIcon from '../Icon/SettingIcon';
import './sidebar.css'

export default function Sidebar(props) {
  const history = useHistory();

  let pathname = history.location.pathname;

  return (
    <div style={{ width: 220, height: '100vh', borderRight: '1px solid #EDEDED' }}>
      <center style={{ height: '104px' }}>
        <Link to='/'><img src={logo} alt='logo' width='132px' style={{ padding: '32px' }} /></Link>
      </center>
      <Stack spacing={1}>
        <Link to='/' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('overview') ? '-active' : ''}`}>
            <OverviewIcon />Overview
          </div>
        </Link>
        <Link to='/app/orders' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('orders') ? '-active' : ''}`}>
            <OrderIcon />Orders
          </div>
        </Link>
        <Link to='/app/products' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('products') ? '-active' : ''}`}>
            <ProductIcon />Products
          </div>
        </Link>
        <Link to='/app/payments' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('payments') ? '-active' : ''}`}>
            <PaymentIcon />Payments
          </div>
        </Link>
        <Link to='/app/cate-group' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('cate-group') ? '-active' : ''}`}>
            <AccountTreeIcon />Category Group
          </div>
        </Link>
        <Link to='/app/category' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('category') ? '-active' : ''}`}>
            <CategoryIcon />Category
          </div>
        </Link>
        <Link to='/app/color' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('color') ? '-active' : ''}`}>
            <PaletteIcon />Color
          </div>
        </Link>
        <Link to='/app/brand' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('brand') ? '-active' : ''}`}>
            <PromoIcon />Brand
          </div>
        </Link>
        <Link to='/app/setting' className='link-custom'>
          <div className={`sidebar-item${pathname.includes('setting') ? '-active' : ''}`}>
            <SettingIcon />Setting
          </div>
        </Link>
      </Stack>
    </div>
  )
}
