import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Navbar from '../../components/Navbar';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';

export default function Login() {
  const [haveAccount, sethaveAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const data = jwtDecode(token);
      if (data.role === 'admin') {
        navigate('/admin');
      }
      if (data.role === 'user') {
        navigate('/home');
      }
    }
  }, []);

  const haveAccountHandler = () => {
    sethaveAccount(!haveAccount);
  };

  const handleLoginSubmit = event => {
    event.preventDefault();
    sendLoginData(email, password);
  };

  const handleRegisterSubmit = event => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password and confirm password must be the same');
      return;
    }
    sendRegisterData(email, password);
  };

  const sendLoginData = async (email, password) => {
    let data = {
      email: email,
      password: password,
    };

    axios
      .post('http://localhost:8080/login', data)
      .then(response => {
        localStorage.setItem('token', response.data);
        toast.success('Login successful!');
        const data = jwtDecode(response.data);
        if (data.role === 'admin') {
          navigate('/admin');
        }
        if (data.role === 'user') {
          navigate('/home');
        }
      })
      .catch(error => {
        toast.error(error.response.data.message);
      });
  };

  const sendRegisterData = async (email, password) => {
    let data = {
      email: email,
      password: password,
    };

    axios
      .post('http://localhost:8080/register', data)
      .then(response => {
        localStorage.setItem('token', response.data);
        toast.success('Registeration successful!');
        sethaveAccount(true);
      })
      .catch(error => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className='relative flex flex-col justify-center min-h-screen overflow-hidden'>
      <Navbar loginPage={true} />
      <div className='w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl'>
        {haveAccount ? (
          <h1 className='text-3xl font-semibold text-center text-purple-700'>Welcome Back</h1>
        ) : (
          <h1 className='text-3xl font-semibold text-center text-purple-700'>Create Account</h1>
        )}
        <form className='mt-6'>
          <div className='mb-2'>
            <label htmlFor='email' className='block text-sm font-semibold text-gray-800'>
              Email
            </label>
            <input
              type='email'
              className='block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40'
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='password' className='block text-sm font-semibold text-gray-800'>
              Password
            </label>
            <input
              type='password'
              className='block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40'
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {!haveAccount && (
            <div className='mb-2'>
              <label htmlFor='confirm-password' className='block text-sm font-semibold text-gray-800'>
                Confirm Password
              </label>
              <input
                type='password'
                className='block w-full px-4 py-2 mt-2 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40'
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          <a className='text-xs text-purple-600 hover:underline'>Forget Password?</a>
          <div className='mt-6'>
            {haveAccount && (
              <button
                className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
                onClick={handleLoginSubmit}>
                Login
              </button>
            )}
            {!haveAccount && (
              <button
                className='w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600'
                onClick={handleRegisterSubmit}>
                Sign up
              </button>
            )}
          </div>
        </form>

        {haveAccount && (
          <p className='mt-8 text-xs font-light text-center text-gray-700'>
            {' '}
            Don&#39;t have an account?{' '}
            <a className='font-medium text-purple-600 hover:underline cursor-pointer' onClick={haveAccountHandler}>
              Sign up
            </a>
          </p>
        )}
        {!haveAccount && (
          <p className='mt-8 text-xs font-light text-center text-gray-700'>
            {' '}
            Already have an account?{' '}
            <a className='font-medium text-purple-600 hover:underline cursor-pointer' onClick={haveAccountHandler}>
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
