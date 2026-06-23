// hooks/useAuth.ts - OTIMIZADO
// Adicionado useMemo para evitar recálculos de permissões

import { useContext, useMemo } from 'react';
import { AuthContext, UserRole } from '../contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export function usePermissions() {
  const { user } = useAuth();

  // Memoizar permissões para evitar recálculo a cada render
  const permissions = useMemo(() => {
    if (!user) return [];
    return user.permissions;
  }, [user?.id, user?.role]); // Só recalcula se user mudar

  const hasRole = useMemo(() => {
    return (role: UserRole | UserRole[]) => {
      if (!user) return false;
      if (Array.isArray(role)) {
        return role.includes(user.role);
      }
      return user.role === role;
    };
  }, [user?.role]);

  const hasPermission = useMemo(() => {
    return (permission: string) => {
      if (!user) return false;
      if (user.permissions.includes('*')) return true; // ADMIN tem acesso total
      return user.permissions.includes(permission);
    };
  }, [user?.permissions]);

  return {
    permissions,
    hasRole,
    hasPermission,
  };
}

export function useUserRole() {
  const { user } = useAuth();
  return useMemo(() => user?.role, [user?.id, user?.role]);
}

/**
 * MELHORIA:
 * ✅ hasRole agora é memoizado e não recria a cada render
 * ✅ hasPermission também é memoizado
 * ✅ Componentes que usam esses hooks não re-renderizam desnecessariamente
 * 
 * IMPACTO:
 * - Reduz re-renders de componentes que dependem de permissões
 * - Especialmente importante em DashboardPage que renderiza muito
 */
