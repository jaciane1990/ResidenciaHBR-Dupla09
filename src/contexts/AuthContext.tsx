import React, { createContext, useState, useContext, ReactNode } from 'react';
import { findMockUser, findMockUserByEmail, initializeMockData } from '../utils/mockData';

// 1. Definimos os papéis permitidos no sistema (Segurança)
export type UserRole = 'OPERADOR' | 'EMPRESA' | 'FISCAL' | 'GESTOR' | 'ADMIN';
export type LoginMethod = 'PASSWORD' | 'GOOGLE';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photo?: string;
  permissions: string[]; // Permissões específicas do usuário
}

export interface LoginEvent {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  method: LoginMethod;
  timestamp: string;
}

export interface ReleaseLog {
  id: string;
  operatorId: string;
  operatorName: string;
  studentName: string;
  studentRegistration: string;
  type: 'BIOMETRIC' | 'MANUAL';
  status: 'ALLOWED' | 'DENIED';
  timestamp: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn: (data: { email: string; role: UserRole; method: LoginMethod; password?: string }) => Promise<void>;
  signOut: () => void;
  loginHistory: LoginEvent[];
  releaseHistory: ReleaseLog[];
  logReleaseAction: (release: Omit<ReleaseLog, 'id' | 'timestamp' | 'operatorId' | 'operatorName'>) => void;
}

const AUTH_USER_KEY = 'auth-user';
const LOGIN_HISTORY_KEY = 'auth-login-history';
const RELEASE_HISTORY_KEY = 'auth-release-history';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export { AuthContext };
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa dados mock na primeira vez
  React.useEffect(() => {
    initializeMockData();
  }, []);
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  const [loginHistory, setLoginHistory] = useState<LoginEvent[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOGIN_HISTORY_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as LoginEvent[];
    } catch {
      return [];
    }
  });

  const [releaseHistory, setReleaseHistory] = useState<ReleaseLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(RELEASE_HISTORY_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as ReleaseLog[];
    } catch {
      return [];
    }
  });

  const saveToStorage = <T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getPermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'OPERADOR':
        return ['students.view', 'students.release', 'occurrences.create'];
      case 'EMPRESA':
        return ['dashboard.view', 'reports.view', 'history.view'];
      case 'FISCAL':
        return ['reports.view', 'payments.validate', 'periods.close'];
      case 'GESTOR':
        return ['students.create', 'students.edit', 'dashboard.view', 'statistics.view'];
      case 'ADMIN':
        return ['*']; // Acesso total
      default:
        return [];
    }
  };

  const createId = () => window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

  const validateLogin = (role: UserRole, method: LoginMethod, email: string, password?: string) => {
    if (role === 'FISCAL' && method !== 'GOOGLE') {
      throw new Error('Fiscais só podem acessar via Google.');
    }

    if (role === 'OPERADOR' && method !== 'PASSWORD') {
      throw new Error('Operadores devem usar usuário e senha.');
    }

    if (method === 'PASSWORD') {
      if (!email.trim() || !password?.trim()) {
        throw new Error('Email e senha são obrigatórios para login com senha.');
      }
    }
  };

  async function signIn({ email, role, method, password }: { email: string; role: UserRole; method: LoginMethod; password?: string }) {
    validateLogin(role, method, email, password);

    let mockUser;

    if (method === 'PASSWORD') {
      // Valida contra banco de dados local
      mockUser = findMockUser(email, password || '');
      if (!mockUser) {
        throw new Error('Email ou senha inválidos.');
      }
      if (mockUser.role !== role) {
        throw new Error(`Este email pertence a um perfil ${mockUser.role}, não ${role}.`);
      }
    } else if (method === 'GOOGLE') {
      // Valida email (sem verificar senha para Google)
      mockUser = findMockUserByEmail(email);
      if (!mockUser) {
        throw new Error('Email não encontrado no sistema.');
      }
      if (mockUser.role !== role) {
        throw new Error(`Este email pertence a um perfil ${mockUser.role}, não ${role}.`);
      }
    } else {
      throw new Error('Método de login inválido.');
    }

    // Cria ou atualiza o usuário na sessão
    const user: User = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      permissions: mockUser.permissions,
    };

    setUser(user);
    saveToStorage(AUTH_USER_KEY, user);

    // Registra evento de login
    const event: LoginEvent = {
      id: createId(),
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      method,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [event, ...loginHistory].slice(0, 100);
    setLoginHistory(nextHistory);
    saveToStorage(LOGIN_HISTORY_KEY, nextHistory);
  }

  function signOut() {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  const logReleaseAction = (release: Omit<ReleaseLog, 'id' | 'timestamp' | 'operatorId' | 'operatorName'>) => {
    if (!user) return;

    const event: ReleaseLog = {
      id: createId(),
      operatorId: user.id,
      operatorName: user.name,
      timestamp: new Date().toISOString(),
      ...release,
    };

    const nextReleaseHistory = [event, ...releaseHistory].slice(0, 100);
    setReleaseHistory(nextReleaseHistory);
    saveToStorage(RELEASE_HISTORY_KEY, nextReleaseHistory);
  };

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user,
      signIn,
      signOut,
      loginHistory,
      releaseHistory,
      logReleaseAction,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
