import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBarChart2, FiFileText } from 'react-icons/fi';

export default function ReportsPage() {
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
            <p className="text-sm text-slate-500">Acesse relatórios de gestão</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-purple-100 text-purple-600">
              <FiBarChart2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
              <p className="text-slate-500">Visualize dados de uso, faturamento e desempenho.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Painel de relatórios</h2>
              <p className="text-sm text-slate-500">Ainda em desenvolvimento, mas você já pode navegar pelo sistema.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full max-w-xs bg-purple-600 text-white py-3 rounded-2xl font-semibold hover:bg-purple-700 transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
