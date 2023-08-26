import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);

      const user = jwtDecode(token);

      if (adminOnly && user.role === 'admin') {
        setIsAdmin(true);
      }
    } else {
      navigate('/login');
    }
  }, [adminOnly, navigate]);

  const canAccess = isAuthenticated && (!adminOnly || (adminOnly && isAdmin));

  return <div>{canAccess ? children : 'You do not have permission to access this page.'}</div>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
