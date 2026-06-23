import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { MdFingerprint } from 'react-icons/md';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

// Tipo para simular o aluno que "passou a digital"
interface ScannedStudent {
  name: string;
  registration: string;
  photoUrl: string;
  status: 'ALLOWED' | 'DENIED';
  message?: string;
}

export default function OperatorPage() {
  const { user, logReleaseAction } = useAuth();
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<'IDLE' | 'SCANNING' | 'RESULT'>('IDLE');
  const [student, setStudent] = useState<ScannedStudent | null>(null);
  const [manualSearch, setManualSearch] = useState('');

  // FUNÇÃO MOCK: Simula a leitura da digital (Sprint 5)
  const simulateBiometricScan = () => {
    setViewState('SCANNING');
    
    // Simula o tempo de resposta do leitor USB (1.5 segundos)
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% de chance de sucesso para teste
      
      const scanned = isSuccess
        ? {
            name: 'Lucas Oliveira da Silva',
            registration: '20260045',
            photoUrl: 'https://i.pravatar.cc/300?u=lucas',
            status: 'ALLOWED' as const,
          }
        : {
            name: 'Mariana Souza',
            registration: '20260012',
            photoUrl: 'https://i.pravatar.cc/300?u=mariana',
            status: 'DENIED' as const,
            message: 'REFEIÇÃO JÁ REALIZADA HOJE',
          };

      setStudent(scanned);
      setViewState('RESULT');

      logReleaseAction({
        studentName: scanned.name,
        studentRegistration: scanned.registration,
        type: 'BIOMETRIC',
        status: scanned.status,
      });

      if (isSuccess) {
        toast.success('Voucher Liberado!');
      } else {
        toast.error('Acesso Negado');
      }
    }, 1500);
  };

  const resetScanner = () => {
    setViewState('IDLE');
    setStudent(null);
    setManualSearch('');
  };

  const handleManualRelease = () => {
    if (!manualSearch.trim()) {
      toast.error('Digite nome ou matrícula para liberar manualmente.');
      return;
    }

    const name = manualSearch.trim();
    const registration = manualSearch.trim();

    const manualStudent: ScannedStudent = {
      name,
      registration,
      photoUrl: 'https://i.pravatar.cc/300?u=manual',
      status: 'ALLOWED',
    };

    setStudent(manualStudent);
    setViewState('RESULT');
    logReleaseAction({
      studentName: manualStudent.name,
      studentRegistration: manualStudent.registration,
      type: 'MANUAL',
      status: 'ALLOWED',
    });
    toast.success('Liberação manual registrada.');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-6 ${
      viewState === 'RESULT' && student?.status === 'ALLOWED' ? 'bg-green-50' : 
      viewState === 'RESULT' && student?.status === 'DENIED' ? 'bg-red-50' : 'bg-slate-50'
    }`}>
      <Toaster />
      
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <FiArrowLeft /> Voltar
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Validação de Refeição</h1>
              <p className="text-slate-500">Escola Municipal de Tecnologia</p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Operador</span>
            <span className="text-slate-700 font-medium">{user?.name ?? 'Cantina Central'}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LADO ESQUERDO: Scanner / Biometria */}
          <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center justify-center border-2 border-slate-100">
            {viewState === 'IDLE' && (
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <MdFingerprint size={64} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Aguardando Digital</h2>
                <p className="text-slate-500 mb-8">Posicione o dedo do aluno no leitor</p>
                <button 
                  onClick={simulateBiometricScan}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Simular Leitura
                </button>
              </div>
            )}

            {viewState === 'SCANNING' && (
              <div className="text-center">
                <div className="w-32 h-32 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <MdFingerprint size={64} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Processando...</h2>
              </div>
            )}

            {viewState === 'RESULT' && (
              <div className="text-center w-full">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  student?.status === 'ALLOWED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {student?.status === 'ALLOWED' ? <FiCheckCircle size={48} /> : <FiAlertCircle size={48} />}
                </div>
                <h2 className={`text-2xl font-black mb-6 ${
                  student?.status === 'ALLOWED' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {student?.status === 'ALLOWED' ? 'LIBERADO' : 'BLOQUEADO'}
                </h2>
                <button 
                  onClick={resetScanner}
                  className="w-full bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition"
                >
                  PRÓXIMO ALUNO
                </button>
              </div>
            )}
          </div>

          {/* LADO DIREITO: Dados do Aluno / Fallback */}
          <div className="bg-white rounded-3xl shadow-xl p-10 border-2 border-slate-100">
            {student ? (
              <div className="animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-6 mb-8">
                  <img src={student.photoUrl} alt="Foto Aluno" className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-sm" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{student.name}</h3>
                    <p className="text-slate-500">Matrícula: {student.registration}</p>
                  </div>
                </div>
                {student.message && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold text-sm border border-red-100">
                    {student.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Busca Manual (Fallback)</h3>
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Nome ou Matrícula..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                      value={manualSearch}
                      onChange={(e) => setManualSearch(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleManualRelease}
                    className="mt-4 w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
                  >
                    Liberar Manualmente
                  </button>
                </div>
                <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Atenção:</strong> Use o fallback manual apenas se a biometria falhar repetidamente. A foto do aluno aparecerá para confirmação visual obrigatória.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}