import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useUserDispatch, loginUser } from "../contexts/UserContext";
import Progress from '../components/Progress';

export default function Login(props) { //func login will dispatch action

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const [error, setError] = useState('');

  const userDispatch = useUserDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    // setLoad(true);
    loginUser(userDispatch, username, password, props.history, setLoad, setError)
    // setLoad(false);
  }

  return (
    <div className='login'>
      <Progress isLoad={load} />
      <div className='login-wrapper'>
        <center>
          <h1 className='text-orange mt-0'>Log in</h1>
          {error && <p style={{ color: '#f63f45' }}><b>{error}</b></p>}
        </center>
        <form onSubmit={onSubmit}>
          <p className='text-gray text-12' style={{ marginBottom: 8 }}>EMAIL</p>
          <input className='login-input m-0 border-none' type='email' value={username} onChange={e => setUsername(e.target.value)} placeholder='email@sample.com' required />
          <p className='text-gray text-12' style={{ marginTop: 20, marginBottom: 8 }}>PASSWORD</p>
          <input className='login-input m-0 border-none' type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Enter password' required />
          <button type='submit' variant="contained" className='btn-max-width' style={{ marginTop: 40 }}>Log in</button>
          <center style={{ marginTop: 32 }} className='text-12 text-white'><Link to='/forgot-password' className='link-custom'>Forgot password</Link></center>
        </form>
      </div >
    </div>
  )
}