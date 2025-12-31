/**
 * Protected Route Component
 * Restricts access based on authentication and roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="large" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Check if seller is approved
  if (user?.role === 'seller' && !user?.isApproved && location.pathname.startsWith('/seller')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <span className="text-3xl">⏳</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Pending Approval</h2>
          <p className="text-gray-400">
            Your seller account is awaiting admin approval. You'll be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
