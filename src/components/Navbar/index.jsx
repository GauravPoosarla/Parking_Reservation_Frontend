import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const shouldShowSignOutButton = location.pathname !== '/login';

  return (
    <nav className='bg-purple-700 py-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <div className='text-white text-xl font-semibold'>SpotSaver</div>
        {shouldShowSignOutButton && (
          <button onClick={handleSignOut} className='text-white hover:underline focus:outline-none'>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
