
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRadius?: boolean;
}

const ProtectedRoute = ({ children, requireRadius = false }: ProtectedRouteProps) => {
  const { isAuthenticated, radiusVerified } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRadius && !radiusVerified) {
    return <Navigate to="/radius-verification" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
