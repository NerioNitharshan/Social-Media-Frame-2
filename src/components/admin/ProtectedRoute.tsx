import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';
import { ROLE_HIERARCHY, ROLES } from '../../lib/constants';
import type { User } from '../../lib/types';

interface Props {
  children: React.ReactNode;
  requiredRole?: keyof typeof ROLES;
}

export function ProtectedRoute({ children, requiredRole = ROLES.VIEWER }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const hasRequiredRole = ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  if (!hasRequiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}