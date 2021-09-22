import React, { useState } from 'react';
import { Avatar, Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';

import './header.css'

export default function Header(props) {

    return (
        <div className='header-wrapper'>
            <h1>Products</h1>
            <div className='header-right'>
                <div className="dropdown" style={{ marginRight: 32, fontSize: 14 }}>
                    <div className="dropbtn-right" style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt="admin"
                            src={'https://mui.com/static/images/avatar/1.jpg'}
                            sx={{ width: 48, height: 48 }}
                            style={{ border: '2px solid white', marginRight: '1rem', boxShadow: '0 5px 20px 0 rgba(61, 61, 63, 0.2)' }}
                        /><b>Admin</b>
                    </div>
                    <div className="dropdown-content-right">
                        <a href="#">Profile</a>
                        <a href="#">Logout</a>
                    </div>
                </div>
                <Badge className='cursor-hover' badgeContent={'9+'} color="error" style={{ marginRight: 32 }}>
                    <MailIcon style={{ color: '#9B9B9B' }} />
                </Badge>
                <Badge className='cursor-hover' badgeContent={'9+'} color="error" style={{ marginRight: 40 }}>
                    <NotificationsIcon style={{ color: '#9B9B9B' }} />
                </Badge>
            </div>
        </div>
    )
}