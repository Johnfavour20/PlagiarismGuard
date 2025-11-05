import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { User } from '../../types.ts';

interface PrivateRouteProps {
  children: React.ReactElement;
  role?: User['role'];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (role && user?.role !== role) {
    // Redirect to their own dashboard if they try to access a page not for their role
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return children;
};

export default PrivateRoute;