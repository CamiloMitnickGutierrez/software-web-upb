import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/use.AuthStore';
import type { UserRole } from '../../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const redirectPath = user.role === 'admin' ? '/dashboard' : '/operario';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};