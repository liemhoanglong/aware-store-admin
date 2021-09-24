import React from 'react';
import { Avatar, Badge } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useHistory } from "react-router-dom";

import { logoutUser, useUserDispatch } from "../../contexts/UserContext";
import './header.css'

function capitalizeFirstLetter(string) {
  console.log(string)
  const regex = /-/gi;
  string = string.replace(regex, ' ');
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Header(props) {
  const userDispatch = useUserDispatch();
  let history = useHistory();
  let pathnameSplited = history.location.pathname.split('/');
  console.log(pathnameSplited)
  return (
    <div style={{ height: '80px' }}>
      <div className='header-wrapper'>
        <h1>{capitalizeFirstLetter(pathnameSplited[pathnameSplited.length - 1])}</h1>
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
              <Link to="/app/profile" className='link-custom d-block'>Profile</Link>
              <div className='cursor-hover' onClick={() => logoutUser(userDispatch, history)}>Logout</div>
            </div>
          </div>
          <Badge className='cursor-hover' badgeContent={'9+'} color="error" style={{ marginRight: 32 }}>
            <MailIcon style={{ color: '#9B9B9B' }} />
          </Badge>
          <Badge className='cursor-hover' badgeContent={'9+'} color="error" style={{ marginRight: 30 }}>
            <NotificationsIcon style={{ color: '#9B9B9B' }} />
          </Badge>
        </div>
      </div >
      {pathnameSplited.length > 3 &&
        <>
          <Link className='link-custom' to={`/app/${pathnameSplited[2]}`}><span>{capitalizeFirstLetter(pathnameSplited[2])}</span></Link> / <span>{capitalizeFirstLetter(pathnameSplited[3])}</span>
        </>
      }
    </div >
  )
}