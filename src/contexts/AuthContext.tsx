import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { findMockUser, findMockUserByEmail, initializeMockData } from '../utils/mockData';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'; // Client ID de teste
const GOOGLE_REDIRECT_URI = `${window.location.origin}/oauth/callback`;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

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

const createId = (): string => window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

// OAuth Helper Functions
const generateGoogleAuthUrl = (state?: string): string => {
  // Para demonstração, redirecionar para nossa própria página de simulação OAuth
  // Em produção, isso seria a URL real do Google OAuth
  const params = new URLSearchParams({
    state: state || '',
    demo: 'true', // Indica que é uma demonstração
  });
  return `${window.location.origin}/oauth/simulate?${params.toString()}`;
};

const handleOAuthCallback = async (code: string, state?: string): Promise<User | null> => {
  try {
    // Simulação completa do fluxo OAuth (já que não temos backend)
    // Em produção, isso seria feito no servidor

    // 1. Simular troca de código por token
    console.log('🔄 Trocando código de autorização por token...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay

    // 2. Simular obtenção de informações do usuário do Google
    console.log('📋 Obtendo informações do usuário...');
    const simulatedGoogleUser = {
      id: 'google-user-123',
      email: 'fiscal@teste.com', // Usar email mock para demonstração
      name: 'Fiscal João Santos',
      picture: 'https://i.pravatar.cc/150?u=fiscal',
      verified_email: true,
    };

    // 3. Encontrar usuário mock correspondente
    const mockUser = findMockUserByEmail(simulatedGoogleUser.email);
    if (!mockUser) {
      throw new Error('Email não autorizado no sistema');
    }

    return {
      id: mockUser.id,
      name: simulatedGoogleUser.name,
      email: simulatedGoogleUser.email,
      role: mockUser.role,
      photo: simulatedGoogleUser.picture,
      permissions: mockUser.permissions,
    };
  } catch (error) {
    console.error('Erro no callback OAuth:', error);
    // Fallback para simulação se algo falhar
    const mockUser = findMockUserByEmail('fiscal@teste.com');
    if (mockUser) {
      return {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        permissions: mockUser.permissions,
      };
    }
    return null;
  }
};

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

  const saveToStorage = useCallback(<T,>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }, []);

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

  const processOAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      console.error('Erro no OAuth:', error);
      // Redirecionar para login com erro
      window.location.href = '/login?error=oauth_failed';
      return;
    }

    if (code && state) {
      try {
        let stateData;
        try {
          stateData = JSON.parse(atob(state));
        } catch {
          stateData = { role: 'FISCAL', email: 'fiscal@teste.com' }; // Fallback
        }

        const user = await handleOAuthCallback(code, state);
        if (user) {
          // Verificar se o role corresponde
          if (user.role !== stateData.role) {
            throw new Error(`Este email pertence a um perfil ${user.role}, não ${stateData.role}.`);
          }

          setUser(user);
          saveToStorage(AUTH_USER_KEY, user);

          // Registrar no histórico
          const loginEvent: LoginEvent = {
            id: createId(),
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            method: 'GOOGLE',
            timestamp: new Date().toISOString(),
          };
          const newHistory = [loginEvent, ...loginHistory.slice(0, 9)]; // Mantém apenas os últimos 10
          setLoginHistory(newHistory);
          saveToStorage(LOGIN_HISTORY_KEY, newHistory);

          // Limpar URL e redirecionar
          window.history.replaceState({}, document.title, '/dashboard');
          window.location.href = '/dashboard';
        } else {
          throw new Error('Falha na autenticação OAuth');
        }
      } catch (error) {
        console.error('Erro no processamento OAuth:', error);
        window.location.href = '/login?error=oauth_error';
      }
    }
  };

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

    if (method === 'GOOGLE') {
      // Redirecionar para Google OAuth
      const state = btoa(JSON.stringify({ role, email })); // Codificar estado para manter contexto
      const authUrl = generateGoogleAuthUrl(state);
      window.location.href = authUrl;
      return; // Não continua a execução, pois haverá redirecionamento
    }

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

  const signOut = useCallback(() => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const logReleaseAction = useCallback((release: Omit<ReleaseLog, 'id' | 'timestamp' | 'operatorId' | 'operatorName'>) => {
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
  }, [user, releaseHistory, saveToStorage]);

  // Processar callback OAuth na montagem
  useEffect(() => {
    if (window.location.pathname === '/oauth/callback') {
      processOAuthCallback();
    }
  }, []);

  // Memoizar o value do context para evitar re-renders desnecessários de toda a app
  const value = useMemo(() => ({
    signed: !!user,
    user,
    signIn,
    signOut,
    loginHistory,
    releaseHistory,
    logReleaseAction,
  }), [user, signIn, signOut, loginHistory, releaseHistory, logReleaseAction]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
