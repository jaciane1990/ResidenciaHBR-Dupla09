import { useContext, useMemo, useCallback } from 'react';
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

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true; // Admin tem tudo
    return user.permissions.includes(permission);
  }, [user?.permissions, user?.id]);

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  const hasRole = useCallback((role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }, [user?.role, user?.id]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return roles.includes(user?.role as UserRole);
  }, [user?.role]);

  // Memoizar o objeto retornado para evitar recriação
  const result = useMemo(() => ({
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    permissions: user?.permissions || [],
    role: user?.role
  }), [hasPermission, hasAnyPermission, hasRole, hasAnyRole, user?.permissions, user?.role, user?.id]);

  return result;
};