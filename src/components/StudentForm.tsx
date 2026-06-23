import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { FiCamera, FiSave, FiX, FiCrop } from 'react-icons/fi';
import { Student } from '../types/student';

interface StudentFormProps {
  onClose: () => void;
  onSave: (student: Partial<Student>) => void;
  student?: Student;
}

const emptyStudent: Partial<Student> = {
  name: '',
  registration: '',
  birthDate: '',
  course: 'Ensino Médio',
  grade: '',
  status: 'ACTIVE',
  hasBiometry: false,
};

export default memo(function StudentForm({ onClose, onSave, student }: StudentFormProps) {
  const [formData, setFormData] = useState<Partial<Student>>(student ?? emptyStudent);
  const [photoPreview, setPhotoPreview] = useState<string | null>(student?.photoUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (student) {
      setFormData(student);
      setPhotoPreview(student.photoUrl ?? null);
    } else {
      setFormData(emptyStudent);
      setPhotoPreview(null);
    }
  }, [student]);

  const cropImage = useCallback((imageDataUrl: string) => {
    return new Promise<string>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const size = Math.min(image.width, image.height);
        const canvas = document.createElement('canvas');
        const outputSize = 320;
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject('Falha ao criar preview da imagem.');
          return;
        }

        const sx = (image.width - size) / 2;
        const sy = (image.height - size) / 2;
        ctx.drawImage(image, sx, sy, size, size, 0, 0, outputSize, outputSize);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      image.onerror = () => reject('Erro ao carregar imagem.');
      image.src = imageDataUrl;
    });
  }, []);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleCropPhoto = useCallback(async () => {
    if (!photoPreview) return;
    try {
      const cropped = await cropImage(photoPreview);
      setPhotoPreview(cropped);
    } catch (error) {
      console.error(error);
    }
  }, [photoPreview, cropImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação da foto obrigatória
    if (!photoPreview) {
      alert('A foto do estudante é obrigatória.');
      return;
    }

    onSave({
      ...formData,
      birthDate: formData.birthDate ?? '',
      photoUrl: photoPreview ?? undefined,
      status: formData.status ?? 'ACTIVE',
      hasBiometry: formData.hasBiometry ?? false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{student ? 'Editar Estudante' : 'Cadastrar Novo Estudante'}</h2>
            <p className="text-sm text-slate-500">Preencha os dados e faça upload da foto.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-40 h-40 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition overflow-hidden"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <FiCamera className="text-slate-400 mb-2" size={32} />
                    <span className="text-xs font-medium text-slate-500 text-center px-2">Clique para carregar foto</span>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full text-center">
                <button
                  type="button"
                  onClick={handleCropPhoto}
                  disabled={!photoPreview}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiCrop />
                  Ajustar crop
                </button>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Foto obrigatória para identificação visual.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Nome Completo</label>
                  <input
                    required
                    type="text"
                    value={formData.name ?? ''}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Matrícula</label>
                  <input
                    required
                    type="text"
                    value={formData.registration ?? ''}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Data de Nascimento</label>
                  <input
                    required
                    type="date"
                    value={formData.birthDate ?? ''}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Curso</label>
                  <input
                    required
                    type="text"
                    value={formData.course ?? ''}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Turma / Ano</label>
                  <input
                    required
                    type="text"
                    value={formData.grade ?? ''}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Status</label>
                  <select
                    required
                    value={formData.status ?? 'ACTIVE'}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  >
                    <option value="ACTIVE">Ativo</option>
                    <option value="INACTIVE">Inativo</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">Biometria</label>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="checkbox"
                        checked={formData.hasBiometry ?? false}
                        onChange={(e) => setFormData({ ...formData, hasBiometry: e.target.checked })}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600">Cadastrada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-50 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <FiSave />
              Salvar Estudante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
