import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { PageLoading } from '@/components/ui/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, accessToken } = useAuthStore();
  const location = useLocation();

  // Check if we have a valid token and user
  const isValidAuth = isAuthenticated && user && accessToken;

  if (isLoading) {
    return <PageLoading text="Checking authentication..." />;
  }

  if (!isValidAuth) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Hook to get redirect path after login
export const useAuthRedirect = () => {
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';
  return from;
};
