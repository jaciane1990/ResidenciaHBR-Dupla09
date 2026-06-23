import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MockDataDebugPanel } from './components/MockDataDebugPanel';

// Lazy load das páginas - Carregam sob demanda
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const StudentsPage = lazy(() => import('./pages/StudentsPage'));
const OperatorPage = lazy(() => import('./pages/OperatorPage'));
const StudentDetailPage = lazy(() => import('./pages/StudentDetailPage'));
const OccurrencesPage = lazy(() => import('./pages/OccurrencesPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

// Componente de loading otimizado
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="space-y-4 w-full max-w-md">
      <div className="flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-center text-gray-600 font-medium">Carregando página...</p>
    </div>
  </div>
);

// Página de simulação OAuth
const OAuthSimulationPage = () => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSimulateLogin = () => {
    setIsProcessing(true);
    // Simular delay do OAuth
    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get('state') || '';
      const callbackUrl = `${window.location.origin}/oauth/callback?code=demo-oauth-code-123&state=${state}`;
      window.location.href = callbackUrl;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header simulando Google */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Google</h1>
            <p className="text-sm text-gray-600">accounts.google.com</p>
          </div>
        </div>

        {/* Card de login simulado */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Fazer login no Sistema de Acesso
          </h2>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Email:</strong> fiscal@teste.com
              </p>
              <p className="text-sm text-gray-700">
                <strong>Permissões solicitadas:</strong> Email, Perfil
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSimulateLogin}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Autorizando...
                </>
              ) : (
                <>
                  <span className="text-white font-bold text-lg mr-1">G</span>
                  Continuar como Fiscal João Santos
                </>
              )}
            </button>

            <button
              onClick={() => window.history.back()}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Esta é uma simulação do login Google OAuth para fins de demonstração.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Página de callback OAuth
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [status, setStatus] = React.useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = React.useState('Processando autenticação...');

  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
          setStatus('error');
          setMessage('Código de autorização não encontrado.');
          return;
        }

        // Simular processamento do OAuth
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fazer login como FISCAL via OAuth
        await signIn({ email: 'fiscal@teste.com', role: 'FISCAL', method: 'GOOGLE' });
        
        setStatus('success');
        setMessage('Autenticação realizada com sucesso!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        setStatus('error');
        setMessage('Erro durante a autenticação.');
      }
    };

    handleCallback();
  }, [signIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-lg text-center">
          {status === 'processing' && (
            <>
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Autenticando...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sucesso!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Erro na Autenticação</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Voltar ao Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Página de erro de autorização
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-lg text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Debug Panel - apenas em desenvolvimento */}
        {false && <MockDataDebugPanel />}
        
        <Routes>
          {/* Rota pública de login */}
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            } 
          />

          {/* Simulação OAuth */}
          <Route path="/oauth/simulate" element={<OAuthSimulationPage />} />

          {/* Callback OAuth */}
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* Página de erro de autorização */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Dashboard - acessível para todos os usuários logados */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Gestão de estudantes - apenas para GESTOR e ADMIN */}
          <Route
            path="/estudantes"
            element={
              <ProtectedRoute requiredRoles={['GESTOR', 'ADMIN']}>
                <Suspense fallback={<PageLoader />}>
                  <StudentsPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Detalhes do estudante - acessível para todos os usuários logados */}
          <Route
            path="/estudantes/:id"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageLoader />}>
                  <StudentDetailPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página do operador - apenas para OPERADOR */}
          <Route
            path="/operador"
            element={
              <ProtectedRoute requiredRoles={['OPERADOR']}>
                <Suspense fallback={<PageLoader />}>
                  <OperatorPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página de liberação de alunos */}
          <Route
            path="/liberar-alunos"
            element={
              <ProtectedRoute requiredRoles={['OPERADOR']}>
                <Suspense fallback={<PageLoader />}>
                  <OperatorPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página de ocorrências */}
          <Route
            path="/ocorrencias"
            element={
              <ProtectedRoute requiredRoles={['OPERADOR', 'EMPRESA', 'GESTOR', 'ADMIN']}>
                <Suspense fallback={<PageLoader />}>
                  <OccurrencesPage />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Página de relatórios */}
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute requiredRoles={['EMPRESA', 'GESTOR', 'ADMIN']}>
                <Suspense fallback={<PageLoader />}>
                  <ReportsPage />
                </Suspense>
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