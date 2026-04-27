import { useContext } from 'react';
import { AuthContext, UserRole } from '../contexts/AuthContext';

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Hook para verificar permissões
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin tem tudo
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.includes(user?.role as UserRole);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    permissions: user?.permissions || [],
    role: user?.role
  };
};