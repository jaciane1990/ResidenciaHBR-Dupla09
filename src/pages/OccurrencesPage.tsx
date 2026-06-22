import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiList } from 'react-icons/fi';

export default function OccurrencesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold"
          >
            <FiArrowLeft /> Voltar
          </button>
          <div className="text-right">
            <p className="text-sm text-slate-500">Registre e acompanhe ocorrências</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-orange-100 text-orange-600">
              <FiAlertCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Ocorrências</h1>
              <p className="text-slate-500">Registre eventos do dia a dia e acompanhe o histórico.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Nenhuma ocorrência registrada</h2>
              <p className="text-sm text-slate-500">Use este espaço para gravar ocorrências como faltas, atrasos ou problemas no refeitório.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full max-w-xs bg-orange-600 text-white py-3 rounded-2xl font-semibold hover:bg-orange-700 transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
