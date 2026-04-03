import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Definimos os papéis permitidos no sistema (Segurança)
export type UserRole = 'OPERADOR' | 'FISCAL' | 'ADMIN' | 'EMPRESA';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photo?: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  signIn: (data: { email: string; role: UserRole }) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Função de Login (Aqui você conectará com o Back-end depois)
  async function signIn({ email, role }: { email: string; role: UserRole }) {
    // Simulação de resposta da API
    const response = {
      id: '1',
      name: role === 'FISCAL' ? 'Fiscal João' : 'Operador Maria',
      email: email,
      role: role,
    };

    setUser(response);
    // Dica: Aqui você salvaria o token no localStorage
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nos componentes
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}