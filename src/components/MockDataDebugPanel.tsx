import React, { useState, useEffect } from 'react';
import { getMockUsers, addMockUser, resetMockData, MOCK_USERS } from '../utils/mockData';
import { MockUser } from '../utils/mockData';
import { FiCopy, FiRefreshCw, FiX } from 'react-icons/fi';

export const MockDataDebugPanel = () => {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getMockUsers());
  };

  const handleReset = () => {
    if (window.confirm('Deseja resetar os dados mock para os padrões originais?')) {
      resetMockData();
      loadUsers();
    }
  };

  const handleCopyCredentials = (email: string, password: string, id: string) => {
    const text = `Email: ${email}\nSenha: ${password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition"
        title="Debug: Dados Mock"
      >
        🐛
      </button>

      {/* Painel */}
      {showPanel && (
        <div className="fixed bottom-20 right-4 z-40 bg-white rounded-lg shadow-2xl border border-gray-300 p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Dados Mock</h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Resumo por perfil */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Perfis disponíveis:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>👮 Operador: {users.filter(u => u.role === 'OPERADOR').length} usuários</p>
              <p>🏢 Empresa: {users.filter(u => u.role === 'EMPRESA').length} usuários</p>
              <p>📋 Fiscal: {users.filter(u => u.role === 'FISCAL').length} usuários</p>
              <p>👔 Gestor: {users.filter(u => u.role === 'GESTOR').length} usuários</p>
              <p>👑 Admin: {users.filter(u => u.role === 'ADMIN').length} usuários</p>
            </div>
          </div>

          {/* Lista de usuários */}
          <div className="space-y-2 mb-4">
            {users.map(user => (
              <div key={user.id} className="p-2 bg-gray-100 rounded text-xs border-l-2 border-purple-500">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 mb-1">Perfil: <span className="font-mono">{user.role}</span></p>
                <button
                  onClick={() => handleCopyCredentials(user.email, user.password, user.id)}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 transition"
                >
                  <FiCopy className="w-3 h-3" />
                  {copiedId === user.id ? 'Copiado!' : 'Copiar credenciais'}
                </button>
              </div>
            ))}
          </div>

          {/* Botão Reset */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition text-sm"
          >
            <FiRefreshCw className="w-4 h-4" />
            Resetar dados
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Para produção, remova este painel
          </p>
        </div>
      )}
    </>
  );
};
