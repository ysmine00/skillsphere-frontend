import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = () => {
  const user = authService.getCurrentUser();
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the protected component
  return <Outlet />;
};

export default PrivateRoute;