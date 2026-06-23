import { UserRole } from '../contexts/AuthContext';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
}

export const MOCK_USERS: MockUser[] = [
  // OPERADORES
  {
    id: 'op-001',
    name: 'Operador Maria Silva',
    email: 'operador@teste.com',
    password: 'senha123',
    role: 'OPERADOR',
    permissions: ['students.view', 'students.release', 'occurrences.create']
  },
  {
    id: 'op-002',
    name: 'Operador João Santos',
    email: 'operador2@teste.com',
    password: 'operador2023',
    role: 'OPERADOR',
    permissions: ['students.view', 'students.release', 'occurrences.create']
  },
  // EMPRESA
  {
    id: 'emp-001',
    name: 'Empresa Cantina Ltda',
    email: 'empresa@teste.com',
    password: 'empresa123',
    role: 'EMPRESA',
    permissions: ['dashboard.view', 'reports.view', 'history.view']
  },
  {
    id: 'emp-002',
    name: 'Empresa Fornecedor XYZ',
    email: 'fornecedor@teste.com',
    password: 'fornecedor2023',
    role: 'EMPRESA',
    permissions: ['dashboard.view', 'reports.view', 'history.view']
  },
  // FISCAL (apenas Google)
  {
    id: 'fisc-001',
    name: 'Fiscal João Santos',
    email: 'fiscal@teste.com',
    password: 'fiscal123', // ignorado, usa apenas Google
    role: 'FISCAL',
    permissions: ['reports.view', 'payments.validate', 'periods.close']
  },
  {
    id: 'fisc-002',
    name: 'Fiscal Maria Costa',
    email: 'fiscal2@teste.com',
    password: 'fiscal2023',
    role: 'FISCAL',
    permissions: ['reports.view', 'payments.validate', 'periods.close']
  },
  // GESTOR
  {
    id: 'gest-001',
    name: 'Gestor Ana Costa',
    email: 'gestor@teste.com',
    password: 'gestor123',
    role: 'GESTOR',
    permissions: ['students.create', 'students.edit', 'dashboard.view', 'statistics.view']
  },
  {
    id: 'gest-002',
    name: 'Gestor Carlos Souza',
    email: 'gestor2@teste.com',
    password: 'gestor2023',
    role: 'GESTOR',
    permissions: ['students.create', 'students.edit', 'dashboard.view', 'statistics.view']
  },
  // ADMIN
  {
    id: 'admin-001',
    name: 'Administrador Sistema',
    email: 'admin@teste.com',
    password: 'admin123',
    role: 'ADMIN',
    permissions: ['*']
  },
  {
    id: 'admin-002',
    name: 'Admin Suporte',
    email: 'suporte@teste.com',
    password: 'suporte2023',
    role: 'ADMIN',
    permissions: ['*']
  }
];

const MOCK_DATA_KEY = 'mock-users-db';

/**
 * Inicializa os dados mock no localStorage na primeira execução
 */
export const initializeMockData = () => {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem(MOCK_DATA_KEY);
  if (!existing) {
    localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(MOCK_USERS));
  }
};

/**
 * Obtém todos os usuários mock do localStorage
 */
export const getMockUsers = (): MockUser[] => {
  if (typeof window === 'undefined') return MOCK_USERS;
  
  const stored = localStorage.getItem(MOCK_DATA_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as MockUser[];
    } catch {
      return MOCK_USERS;
    }
  }
  return MOCK_USERS;
};

/**
 * Encontra um usuário mock por email e valida a senha
 */
export const findMockUser = (email: string, password: string): MockUser | null => {
  const users = getMockUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) return null;
  if (user.password !== password) return null;
  
  return user;
};

/**
 * Encontra um usuário mock por email (para login via Google)
 */
export const findMockUserByEmail = (email: string): MockUser | null => {
  const users = getMockUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Adiciona um novo usuário mock ao localStorage
 */
export const addMockUser = (user: MockUser): boolean => {
  if (typeof window === 'undefined') return false;
  
  const users = getMockUsers();
  
  // Verifica se email já existe
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return false;
  }
  
  users.push(user);
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(users));
  return true;
};

/**
 * Resetar dados mock para os padrões originais
 */
export const resetMockData = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MOCK_DATA_KEY, JSON.stringify(MOCK_USERS));
};
