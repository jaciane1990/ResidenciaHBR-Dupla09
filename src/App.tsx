import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MockDataDebugPanel } from './components/MockDataDebugPanel';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import OperatorPage from './pages/OperatorPage';
import StudentDetailPage from './pages/StudentDetailPage';

// Página de erro de autorização
const UnauthorizedPage = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
      <p className="text-gray-600 mb-6">
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
      >
        Voltar
      </button>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Debug Panel - apenas em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && <MockDataDebugPanel />}
        
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Página de erro de autorização */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Dashboard - acessível para todos os usuários logados */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Gestão de estudantes - apenas para GESTOR e ADMIN */}
          <Route
            path="/estudantes"
            element={
              <ProtectedRoute requiredRoles={['GESTOR', 'ADMIN']}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />

          {/* Detalhes do estudante - acessível para todos os usuários logados */}
          <Route
            path="/estudantes/:id"
            element={
              <ProtectedRoute>
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Página do operador - apenas para OPERADOR */}
          <Route
            path="/operador"
            element={
              <ProtectedRoute requiredRoles={['OPERADOR']}>
                <OperatorPage />
              </ProtectedRoute>
            }
          />

          {/* Redirecionamento padrão */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rota catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;