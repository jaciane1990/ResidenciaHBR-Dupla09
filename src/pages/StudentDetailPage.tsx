import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiPlus, FiTrash2 } from 'react-icons/fi';
import { Student } from '../types/student';

const STORAGE_KEY = 'student-management-list';

const loadStudents = (): Student[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Student[];
  } catch {
    return [];
  }
};

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const students = useMemo(() => loadStudents(), [id]);
  const student = students.find((item) => item.id === id);
  const [biometrics, setBiometrics] = useState<string[]>(student?.biometrics ?? []);
  const [newBiometricCode, setNewBiometricCode] = useState('');

  const validateHexCode = (code: string): boolean => {
    return /^[A-Fa-f0-9]{12}$/.test(code);
  };

  const handleAddBiometric = () => {
    if (!newBiometricCode.trim()) return;
    if (!validateHexCode(newBiometricCode)) {
      alert('Código biométrico deve ter exatamente 12 caracteres hexadecimais (0-9, A-F).');
      return;
    }
    if (biometrics.includes(newBiometricCode.toUpperCase())) {
      alert('Este código biométrico já está cadastrado.');
      return;
    }
    if (biometrics.length >= 3) {
      alert('Máximo de 3 códigos biométricos por estudante.');
      return;
    }
    setBiometrics(prev => [...prev, newBiometricCode.toUpperCase()]);
    setNewBiometricCode('');
  };

  const handleRemoveBiometric = (code: string) => {
    setBiometrics(prev => prev.filter(b => b !== code));
  };

  const handleSaveBiometrics = () => {
    if (!student) return;
    const updatedStudents = students.map(s =>
      s.id === student.id ? { ...s, biometrics, hasBiometry: biometrics.length > 0 } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStudents));
    alert('Códigos biométricos salvos com sucesso!');
  };

  if (!student) {
    return (
      <div className="p-8 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-10 shadow-sm border border-slate-200 text-center">
          <p className="text-slate-500 mb-6">Estudante não encontrado. Verifique se o registro ainda existe ou volte para a lista.</p>
          <button
            onClick={() => navigate('/estudantes')}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/estudantes')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <FiArrowLeft /> Voltar
            </button>
            <h1 className="text-3xl font-bold text-slate-800 mt-4">Detalhes do Estudante</h1>
            <p className="text-slate-500">Visualize as informações completas do aluno.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="mx-auto h-48 w-48 rounded-3xl object-cover" />
            ) : (
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-slate-100 text-4xl font-semibold text-slate-500">
                {student.name.charAt(0)}
              </div>
            )}
            <h2 className="mt-6 text-2xl font-bold text-slate-800">{student.name}</h2>
            <p className="mt-1 text-slate-500">Matrícula: {student.registration}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold border border-slate-200">
              {student.status === 'ACTIVE' ? (
                <span className="inline-flex items-center gap-2 text-emerald-600">
                  <FiCheckCircle /> Ativo
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-amber-700">
                  <FiXCircle /> Inativo
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Informações</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-400 mb-2">Curso</p>
                  <p className="font-semibold text-slate-800">{student.course}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-400 mb-2">Turma</p>
                  <p className="font-semibold text-slate-800">{student.grade}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-400 mb-2">Data de Nascimento</p>
                  <p className="font-semibold text-slate-800">{new Date(student.birthDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-400 mb-2">Biometria</p>
                  <p className="font-semibold text-slate-800">{student.hasBiometry ? 'Cadastrada' : 'Pendente'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[.2em] text-slate-400 mb-2">Foto</p>
                  <p className="font-semibold text-slate-800">{student.photoUrl ? 'Disponível' : 'Não cadastrada'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Códigos Biométricos</h3>
              <div className="space-y-4">
                {biometrics.length > 0 ? (
                  <div className="space-y-2">
                    {biometrics.map((code, index) => (
                      <div key={code} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono text-slate-600 bg-white px-3 py-1 rounded-lg border">
                            {code}
                          </span>
                          <span className="text-xs text-slate-500">Código {index + 1}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveBiometric(code)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remover código"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Nenhum código biométrico cadastrado.</p>
                )}

                {biometrics.length < 3 && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBiometricCode}
                      onChange={(e) => setNewBiometricCode(e.target.value.toUpperCase())}
                      placeholder="Digite código hexadecimal (12 caracteres)"
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={12}
                    />
                    <button
                      onClick={handleAddBiometric}
                      className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FiPlus size={16} />
                      Adicionar
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSaveBiometrics}
                  className="w-full bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500 leading-relaxed">
                Esta tela mostra os detalhes do estudante selecionado. Use o botão "Voltar" para retornar à lista e editar o cadastro sempre que necessário.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
