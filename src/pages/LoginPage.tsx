import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUser, FiBriefcase, FiFileText, FiTrendingUp, FiSettings, FiEye, FiEyeOff, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../contexts/AuthContext';
import { MOCK_USERS } from '../utils/mockData';
import logoAcesso from '../assets/logoacesso.png';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  permissions: string[];
}

const roleOptions: RoleOption[] = [
  {
    role: 'OPERADOR',
    title: 'Operador',
    description: 'Funcionário da Cantina - Libera alunos e registra ocorrências',
    icon: <FiUser className="w-6 h-6" />,
    color: 'bg-blue-500',
    permissions: ['Liberar alunos (biometria/manual)', 'Ver informações básicas', 'Registrar ocorrências']
  },
  {
    role: 'EMPRESA',
    title: 'Empresa',
    description: 'Cantina/Fornecedor - Visualiza dados para gestão e faturamento',
    icon: <FiBriefcase className="w-6 h-6" />,
    color: 'bg-green-500',
    permissions: ['Dashboard', 'Relatórios', 'Histórico', 'Não edita alunos']
  },
  {
    role: 'FISCAL',
    title: 'Fiscal',
    description: 'Secretaria/Escola - Valida pagamentos e aprova períodos',
    icon: <FiFileText className="w-6 h-6" />,
    color: 'bg-purple-500',
    permissions: ['Ver relatórios', 'Dar baixa/validar período', 'Login via Google']
  },
  {
    role: 'GESTOR',
    title: 'Gestor',
    description: 'Coordenação - Acompanha estatísticas e cadastra alunos',
    icon: <FiTrendingUp className="w-6 h-6" />,
    color: 'bg-orange-500',
    permissions: ['Cadastrar/editar alunos', 'Dashboards visuais', 'Comparações', 'Estatísticas educacionais']
  },
  {
    role: 'ADMIN',
    title: 'Administrador',
    description: 'Sistema - Gerencia usuários e tem acesso total',
    icon: <FiSettings className="w-6 h-6" />,
    color: 'bg-red-500',
    permissions: ['Gerenciar usuários', 'Cadastros', 'Sistema', 'Acesso total', 'Login via Google']
  }
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canUsePassword = selectedRole !== 'FISCAL' && selectedRole !== null;
  const canUseGoogle = selectedRole !== null;
  const isFormValid = selectedRole && email.trim().length > 0 && (canUsePassword ? password.length >= 6 : true);

  const handleLogin = async () => {
    if (!selectedRole || !isFormValid) return;

    setError('');
    setIsLoading(true);

    try {
      await signIn({
        email: email.trim(),
        role: selectedRole,
        method: 'PASSWORD',
        password,
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = (error as Error).message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMsg);
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!selectedRole || !email.trim()) {
      setError('Por favor, insira seu email de Gmail.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await signIn({
        email: email.trim(),
        role: selectedRole,
        method: 'GOOGLE',
      });
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = (error as Error).message || 'Erro ao fazer login via Google. Tente novamente.';
      setError(errorMsg);
      console.error('Erro no login via Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const credentialsByRole = selectedRole
    ? MOCK_USERS.filter((user) => user.role === selectedRole)
    : MOCK_USERS;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (selectedRole === 'FISCAL') {
      await handleGoogleLogin();
    } else {
      await handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center px-3 sm:px-4 py-4 sm:py-6">
      <div className="w-full max-w-6xl">
        {/* Header with Logo */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8 px-2 sm:px-6 lg:px-0">
          <img 
            src={logoAcesso}
            alt="Logo Sistema de Acesso"
            className="w-20 sm:w-24 lg:w-32 h-auto mb-3 sm:mb-4 object-contain"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            Acesso ao Sistema
          </h1>
          <p className="mt-2 text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl">
            Controle de Acesso e Voucher Escolar
          </p>
        </div>

        {/* Role Dropdown Selector */}
        <div className="flex justify-center px-2 sm:px-6 lg:px-0 mb-6">
          <div ref={dropdownRef} className="relative w-full max-w-md">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecione o tipo de acesso
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-blue-400 transition duration-200 focus:outline-none focus:border-blue-500"
            >
              <div className="flex items-center gap-3">
                {selectedRole ? (
                  <>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${roleOptions.find(r => r.role === selectedRole)?.color} text-white`}>
                      {roleOptions.find(r => r.role === selectedRole)?.icon}
                    </div>
                    <span className="text-gray-900 font-medium">{roleOptions.find(r => r.role === selectedRole)?.title}</span>
                  </>
                ) : (
                  <span className="text-gray-500">Escolha um perfil...</span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {roleOptions.map((option, index) => (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(option.role);
                      setIsDropdownOpen(false);
                      setError('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition duration-150 border-b border-gray-200 last:border-b-0 ${
                      selectedRole === option.role ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${option.color} text-white shrink-0`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 text-sm">{option.title}</p>
                      <p className="text-xs text-gray-600">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Login Panel */}
        <div className="flex justify-center px-2 sm:px-6 lg:px-0">
          <div key={selectedRole ?? 'empty'} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-200 w-full max-w-2xl">
            {selectedRole ? (
              <>
                <div className="mb-3 sm:mb-4">
                  <p className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-0.5 sm:mb-1">
                    Acesso Seguro
                  </p>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    Login como {selectedRole === 'OPERADOR' ? 'Operador' : selectedRole === 'EMPRESA' ? 'Empresa' : selectedRole === 'FISCAL' ? 'Fiscal' : selectedRole === 'GESTOR' ? 'Gestor' : 'Administrador'}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-xl">
                    Insira suas credenciais para acessar o painel correspondente ao seu perfil de usuário.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-2 sm:gap-3">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-300 rounded-lg">
                      <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
                      Email {selectedRole === 'FISCAL' || selectedRole === 'ADMIN' ? '(Gmail)' : '(Obrigatório)'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder={selectedRole ? `${selectedRole.toLowerCase()}@exemplo.com` : 'seu@email.com'}
                      disabled={isLoading}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  {canUsePassword && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-0.5 sm:mb-1">
                        Senha (mínimo 6 caracteres)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="••••••••"
                          disabled={isLoading}
                          className="w-full pr-10 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                          tabIndex={-1}
                        >
                          {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    {canUsePassword && (
                      <button
                        type="submit"
                        disabled={isLoading || !isFormValid}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-1.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg text-xs"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Entrando...
                          </>
                        ) : (
                          <>
                            <FiLogIn />
                            Entrar com Usuário e Senha
                          </>
                        )}
                      </button>
                    )}

                    {canUseGoogle && selectedRole === 'FISCAL' && (
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full border-2 border-red-500 text-red-600 font-semibold py-1.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 hover:bg-red-50 disabled:bg-gray-100 disabled:cursor-not-allowed text-xs"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>Entrar com Google</>
                        )}
                      </button>
                    )}

                    {canUseGoogle && selectedRole !== 'FISCAL' && (
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-1.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-xs"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-3 h-3 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>Entrar com Google (Opcional)</>
                        )}
                      </button>
                    )}

                    {selectedRole === 'FISCAL' && (
                      <p className="text-xs text-red-600 text-center font-medium">
                        Fiscais devem usar login via Google institucional.
                      </p>
                    )}
                  </div>

                  {/* Change Role Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole(null);
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    disabled={isLoading}
                    className="mt-1 w-full text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-medium text-xs underline transition"
                  >
                    Mudar perfil
                  </button>
                </form>

                <div className="mt-6 bg-slate-50 rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Credenciais de teste</h3>
                      <p className="text-xs text-slate-500">Use estas credenciais para agilizar o login.</p>
                    </div>
                    {selectedRole && (
                      <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                        {selectedRole}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {credentialsByRole.map((user) => (
                      <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500">{user.role}</span>
                          <span className="text-xs text-slate-400">{user.name}</span>
                        </div>
                        <p className="text-sm text-slate-700 break-all">
                          <span className="font-semibold">Email:</span> {user.email}
                        </p>
                        <p className="text-sm text-slate-700 break-all">
                          <span className="font-semibold">Senha:</span> {user.password}</p>
                        {user.role === 'FISCAL' && (
                          <p className="mt-2 text-xs text-amber-700">
                            Obs.: Fiscais usam login via Google, senha não é verificada.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 sm:py-10 flex items-center justify-center text-center">
                <p className="text-xs text-gray-500">
                  👆 Selecione um perfil acima para fazer login.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}