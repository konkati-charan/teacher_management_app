
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component redirects to the register page as the main entry point
const Index = () => {
  return <Navigate to="/register" replace />;
};

export default Index;
