import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiCheck, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import { Student } from '../types/student';

interface CsvImportModalProps {
  onClose: () => void;
  onImport: (students: Partial<Student>[]) => void;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: any }>;
  duplicates: Array<{ row: number; field: string; value: string }>;
}

const CsvImportModal: React.FC<CsvImportModalProps> = ({ onClose, onImport }) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): { headers: string[]; data: any[] } => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = values[i] || '';
      });
      return { ...obj, _rowIndex: index + 2 }; // +2 because of 0-index and header row
    });

    return { headers, data };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const { headers, data } = parseCSV(text);
      setHeaders(headers);
      setCsvData(data);
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const validateHexCode = (code: string): boolean => {
    return /^[0-9A-Fa-f]{8,16}$/.test(code);
  };

  const processImport = async () => {
    setIsProcessing(true);
    const result: ImportResult = { success: 0, errors: [], duplicates: [] };
    const processedStudents: Partial<Student>[] = [];

    // Get existing students for duplicate checking
    const existingStudents = JSON.parse(localStorage.getItem('student-management-list') || '[]');

    for (const row of csvData) {
      try {
        // Validate required fields
        if (!row.name?.trim()) {
          result.errors.push({ row: row._rowIndex, error: 'Nome é obrigatório', data: row });
          continue;
        }
        if (!row.registration?.trim()) {
          result.errors.push({ row: row._rowIndex, error: 'Matrícula é obrigatória', data: row });
          continue;
        }
        if (!row.birthDate?.trim()) {
          result.errors.push({ row: row._rowIndex, error: 'Data de nascimento é obrigatória', data: row });
          continue;
        }

        // Validate birth date format
        const birthDate = new Date(row.birthDate.trim());
        if (isNaN(birthDate.getTime())) {
          result.errors.push({ row: row._rowIndex, error: 'Data de nascimento inválida (formato esperado: YYYY-MM-DD)', data: row });
          continue;
        }

        // Check for duplicates
        const existingByRegistration = existingStudents.find((s: Student) => s.registration === row.registration?.trim());
        if (existingByRegistration) {
          result.duplicates.push({ row: row._rowIndex, field: 'registration', value: row.registration });
          continue;
        }

        // Validate biometrics if provided
        const biometrics: string[] = [];
        if (row.biometric1?.trim()) {
          if (!validateHexCode(row.biometric1.trim())) {
            result.errors.push({ row: row._rowIndex, error: 'Código biométrico 1 inválido (deve ser hexadecimal)', data: row });
            continue;
          }
          biometrics.push(row.biometric1.trim());
        }
        if (row.biometric2?.trim()) {
          if (!validateHexCode(row.biometric2.trim())) {
            result.errors.push({ row: row._rowIndex, error: 'Código biométrico 2 inválido (deve ser hexadecimal)', data: row });
            continue;
          }
          biometrics.push(row.biometric2.trim());
        }
        if (row.biometric3?.trim()) {
          if (!validateHexCode(row.biometric3.trim())) {
            result.errors.push({ row: row._rowIndex, error: 'Código biométrico 3 inválido (deve ser hexadecimal)', data: row });
            continue;
          }
          biometrics.push(row.biometric3.trim());
        }

        // Check for duplicate biometric codes
        const allExistingBiometrics = existingStudents.flatMap((s: Student) => s.biometrics || []);
        const duplicateBiometrics = biometrics.filter(code => allExistingBiometrics.includes(code));
        if (duplicateBiometrics.length > 0) {
          result.duplicates.push({ row: row._rowIndex, field: 'biometric', value: duplicateBiometrics.join(', ') });
          continue;
        }

        const student: Partial<Student> = {
          name: row.name.trim(),
          registration: row.registration.trim(),
          birthDate: row.birthDate.trim(),
          course: row.course?.trim() || 'Não informado',
          grade: row.grade?.trim() || 'Não informado',
          status: 'ACTIVE',
          hasBiometry: biometrics.length > 0,
          biometrics: biometrics,
        };

        processedStudents.push(student);
        result.success++;

      } catch (error) {
        result.errors.push({ row: row._rowIndex, error: 'Erro ao processar linha', data: row });
      }
    }

    setImportResult(result);
    setStep('result');

    if (processedStudents.length > 0) {
      onImport(processedStudents);
    }

    setIsProcessing(false);
  };

  const downloadTemplate = () => {
    const csvContent = `name,registration,birthDate,course,grade,biometric1,biometric2,biometric3
João Silva,2026001,2008-05-15,Ciências Humanas,3º A,ABC123DEF456,DEF789GHI012,GHI345JKL678
Maria Santos,2026002,2009-03-22,Exatas,2º B,BCD234EFG567,EFG890HIJ123,HIJ456KLM789`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_estudantes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Importar Planilha CSV</h2>
            <p className="text-sm text-slate-500">
              {step === 'upload' && 'Selecione um arquivo CSV para importar estudantes'}
              {step === 'preview' && `Preview de ${csvData.length} registros`}
              {step === 'result' && 'Resultado da importação'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8">
          {step === 'upload' && (
            <div className="text-center space-y-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-12 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
              >
                <FiUpload className="mx-auto text-slate-400 text-4xl mb-4" />
                <p className="text-lg font-semibold text-slate-700 mb-2">Clique para selecionar arquivo CSV</p>
                <p className="text-sm text-slate-500">Ou arraste e solte o arquivo aqui</p>
              </div>

              <div className="text-left max-w-md mx-auto">
                <h3 className="font-semibold text-slate-800 mb-2">Formato esperado:</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• name: Nome completo do estudante</li>
                  <li>• registration: Matrícula (obrigatório)</li>
                  <li>• course: Curso</li>
                  <li>• grade: Turma/Ano</li>
                  <li>• biometric1, biometric2, biometric3: Códigos hexadecimais</li>
                </ul>
              </div>

              <button
                onClick={downloadTemplate}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <FiDownload />
                Baixar template CSV
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                className="hidden"
              />
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Preview dos dados ({csvData.length} registros)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {headers.map(header => (
                          <th key={header} className="text-left p-2 font-semibold text-slate-600">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          {headers.map(header => (
                            <td key={header} className="p-2 text-slate-700">{row[header] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvData.length > 5 && (
                    <p className="text-sm text-slate-500 mt-2">... e mais {csvData.length - 5} registros</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-6 py-2 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition"
                >
                  Voltar
                </button>
                <button
                  onClick={processImport}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? 'Processando...' : 'Importar Dados'}
                </button>
              </div>
            </div>
          )}

          {step === 'result' && importResult && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-green-50 rounded-2xl p-6 text-center">
                  <FiCheck className="mx-auto text-green-600 text-2xl mb-2" />
                  <p className="text-2xl font-bold text-green-700">{importResult.success}</p>
                  <p className="text-sm text-green-600">Importados com sucesso</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-6 text-center">
                  <FiAlertTriangle className="mx-auto text-red-600 text-2xl mb-2" />
                  <p className="text-2xl font-bold text-red-700">{importResult.errors.length}</p>
                  <p className="text-sm text-red-600">Erros encontrados</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-6 text-center">
                  <FiAlertTriangle className="mx-auto text-amber-600 text-2xl mb-2" />
                  <p className="text-2xl font-bold text-amber-700">{importResult.duplicates.length}</p>
                  <p className="text-sm text-amber-600">Duplicatas encontradas</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="bg-red-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-red-800 mb-3">Erros encontrados:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        <span className="font-semibold">Linha {error.row}:</span> {error.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.duplicates.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-amber-800 mb-3">Duplicatas encontradas:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {importResult.duplicates.map((duplicate, index) => (
                      <div key={index} className="text-sm text-amber-700">
                        <span className="font-semibold">Linha {duplicate.row}:</span> {duplicate.field} "{duplicate.value}" já existe
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition shadow-lg shadow-blue-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvImportModal;