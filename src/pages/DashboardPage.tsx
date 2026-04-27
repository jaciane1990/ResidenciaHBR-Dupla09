import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiTrendingUp, FiFileText, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiBarChart, FiSettings } from 'react-icons/fi';
import { useAuth, usePermissions } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, signOut, loginHistory } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'OPERADOR':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Liberação de Alunos</h3>
                </div>
                <p className="text-gray-600 mb-4">Libere alunos via biometria ou manualmente</p>
                <button
                  onClick={() => navigate('/liberar-alunos')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                  Liberar Alunos
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiAlertTriangle className="text-orange-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Ocorrências</h3>
                </div>
                <p className="text-gray-600 mb-4">Registre ocorrências do dia a dia</p>
                <button
                  onClick={() => navigate('/ocorrencias')}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-xl hover:bg-orange-700 transition"
                >
                  Registrar Ocorrência
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiCheckCircle className="text-green-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Alunos Ativos Hoje</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">de 28 matriculados</p>
              </div>
            </div>
          </div>
        );

      case 'EMPRESA':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiDollarSign className="text-green-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Faturamento Hoje</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">R$ 1.247,50</p>
                <p className="text-sm text-green-500">+12% vs ontem</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Refeições Servidas</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-500">de 95 previstas</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiBarChart className="text-purple-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios</h3>
                </div>
                <p className="text-gray-600 mb-4">Acesse relatórios e histórico</p>
                <button
                  onClick={() => navigate('/relatorios')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                >
                  Ver Relatórios
                </button>
              </div>
            </div>
          </div>
        );

      case 'FISCAL':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiFileText className="text-blue-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Pagamentos Pendentes</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">validações necessárias</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiCheckCircle className="text-green-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Validar Período</h3>
                </div>
                <p className="text-gray-600 mb-4">Aprove períodos de pagamento</p>
                <button
                  onClick={() => navigate('/validar-periodo')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
                >
                  Validar Período
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiBarChart className="text-purple-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios Fiscais</h3>
                </div>
                <p className="text-gray-600 mb-4">Relatórios para aprovação</p>
                <button
                  onClick={() => navigate('/relatorios-fiscais')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                >
                  Ver Relatórios
                </button>
              </div>
            </div>
          </div>
        );

      case 'GESTOR':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Gerenciar Alunos</h3>
                </div>
                <p className="text-gray-600 mb-4">Cadastrar e editar alunos</p>
                <button
                  onClick={() => navigate('/estudantes')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                  Gerenciar Alunos
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp className="text-green-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Estatísticas</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">94.2%</p>
                <p className="text-sm text-gray-500">taxa de frequência</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiBarChart className="text-purple-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Dashboards</h3>
                </div>
                <p className="text-gray-600 mb-4">Visualizar estatísticas educacionais</p>
                <button
                  onClick={() => navigate('/estatisticas')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                >
                  Ver Dashboards
                </button>
              </div>
            </div>
          </div>
        );

      case 'ADMIN':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiUsers className="text-blue-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Gerenciar Usuários</h3>
                </div>
                <p className="text-gray-600 mb-4">Criar e editar usuários do sistema</p>
                <button
                  onClick={() => navigate('/usuarios')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                >
                  Gerenciar Usuários
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiSettings className="text-gray-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Sistema</h3>
                </div>
                <p className="text-gray-600 mb-4">Configurações do sistema</p>
                <button
                  onClick={() => navigate('/configuracoes')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-xl hover:bg-gray-700 transition"
                >
                  Configurações
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <FiBarChart className="text-purple-500 w-8 h-8" />
                  <h3 className="text-lg font-semibold text-gray-900">Relatórios Gerais</h3>
                </div>
                <p className="text-gray-600 mb-4">Todos os relatórios do sistema</p>
                <button
                  onClick={() => navigate('/relatorios')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
                >
                  Ver Todos
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Login</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {loginHistory.slice(0, 5).map((entry) => (
                  <div key={`${entry.timestamp}-${entry.userId}`} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <div className="flex justify-between items-center gap-2 text-sm text-gray-700">
                      <span>{entry.userName}</span>
                      <span>{entry.method}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                ))}
                {loginHistory.length === 0 && <p className="text-sm text-gray-500">Nenhum histórico de login disponível.</p>}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Perfil não reconhecido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
              >
                <FiLogOut />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {getDashboardContent()}
      </main>
    </div>
  );
}