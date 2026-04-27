import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiUser, FiBriefcase, FiFileText, FiTrendingUp, FiSettings } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../contexts/AuthContext';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

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

        {/* Role Cards - Improved grid */}
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2 mb-4 sm:mb-6 px-2 sm:px-6 lg:px-0">
          {roleOptions.map((option) => (
            <button
              key={option.role}
              type="button"
              onClick={() => {
                setSelectedRole(option.role);
                setError('');
              }}
              className={`relative group rounded-lg sm:rounded-xl p-1.5 sm:p-2 border transition-all duration-300 flex flex-col items-center justify-center min-h-20 sm:min-h-24 hover:shadow-md ${
                selectedRole === option.role
                  ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-300'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className={`inline-flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl ${option.color} text-white mb-0.5 sm:mb-1 shadow-sm flex-shrink-0`}>
                {option.icon}
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 text-center line-clamp-2 px-0.5">
                {option.title}
              </h3>
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-auto top-full left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-xs rounded-lg p-2 w-48 shadow-xl z-50 mt-2">
                <p className="font-semibold mb-1 text-center">{option.title}</p>
                <p className="leading-tight text-center">{option.description}</p>
              </div>
            </button>
          ))}
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

                {/* Error Message */}
                {error && (
                  <div className="mb-3 p-2 sm:p-3 bg-red-50 border border-red-300 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="grid gap-2 sm:gap-3">
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
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  )}

                  <div className="grid gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                    {canUsePassword && (
                      <button
                        onClick={handleLogin}
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