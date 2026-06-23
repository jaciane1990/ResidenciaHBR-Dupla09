import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, usePermissions } from '../hooks/useAuth';
import { UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { signed } = useAuth();
  const { hasAnyPermission, hasAnyRole } = usePermissions();

  // Verificar se usuário está logado
  if (!signed) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Verificar permissões se especificadas
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Verificar papéis se especificados
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};