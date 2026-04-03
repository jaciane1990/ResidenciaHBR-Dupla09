import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // npm install react-icons
import { Toaster, toast } from 'react-hot-toast'; // npm install react-hot-toast

// --- TIPAGEM (A vantagem do TSX) ---
type UserRole = 'OPERADOR' | 'FISCAL' | 'ADMIN' | 'EMPRESA';

interface User {
  name: string;
  role: UserRole;
}

// --- COMPONENTE DE LOGIN ---
const LoginPage = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && pass) {
      // Simulando login de Operador/Empresa
      onLogin({ name: "Usuário Cantina", role: 'OPERADOR' });
      toast.success("Bem-vindo, Operador!");
    }
  };

  const handleGoogleLogin = () => {
    // Simulando login de Fiscal/Admin
    onLogin({ name: "Fiscal do Estado", role: 'FISCAL' });
    toast.success("Acesso autorizado via Google");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row max-w-4xl overflow-hidden">
        
        {/* Lado Esquerdo: Branding */}
        <div className="bg-blue-600 p-12 text-white flex flex-col justify-center md:w-5/12">
          <h1 className="text-4xl font-bold mb-4">Voucher Escolar 🍎</h1>
          <p className="text-blue-100">Sistema de controle de acesso e monitoramento nutricional.</p>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="p-12 md:w-7/12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Acesse sua conta</h2>
          
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email ou Matrícula</label>
              <input 
                type="text" 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Ex: 2024001"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input 
                type="password" 
                className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg">
              Entrar
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Ou continue com</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition"
          >
            <FcGoogle size={24} />
            Entrar com Google (Fiscais/Admin)
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE DE DASHBOARD (PROTEGIDO) ---
const Dashboard = ({ user, logout }: { user: User, logout: () => void }) => (
  <div className="p-10">
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h1 className="text-3xl font-bold">Olá, {user.name}! 👋</h1>
      <p className="text-gray-600">Seu papel no sistema é: <span className="font-bold text-blue-600">{user.role}</span></p>
      <button 
        onClick={logout}
        className="mt-6 bg-red-100 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-200 transition"
      >
        Sair do Sistema
      </button>
    </div>
  </div>
);

// --- APP PRINCIPAL COM ROTAS ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={setUser} /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} 
        />
        
        {/* Rota para erro 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}