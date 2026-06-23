import { memo } from 'react';
import { FiEye, FiEdit, FiSlash, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { Student } from '../types/student';

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
  onDelete?: (student: Student) => void;
  canDelete?: boolean;
}

// Row memoizado para evitar re-renders desnecessários de linhas individuais
const StudentRow = memo(function StudentRow({ 
  student, 
  onView, 
  onEdit, 
  onToggleStatus, 
  onDelete, 
  canDelete 
}: {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onToggleStatus: (student: Student) => void;
  onDelete?: (student: Student) => void;
  canDelete?: boolean;
}) {
  return (
    <tr key={student.id} className="hover:bg-slate-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
            {student.photoUrl ? (
              <img 
                src={student.photoUrl} 
                alt={student.name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              student.name.charAt(0)
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{student.name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600">{student.registration}</td>
      <td className="px-6 py-4 text-slate-600">{student.course}</td>
      <td className="px-6 py-4 text-slate-600">{student.grade}</td>
      <td className="px-6 py-4 text-center">
        {student.status === 'ACTIVE' ? (
          <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
            <FiCheckCircle /> Ativo
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-amber-700 font-semibold">
            <FiXCircle /> Inativo
          </span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onView(student)}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-blue-600 hover:text-blue-800 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <FiEye className="w-4 h-4" /> Detalhes
          </button>
          <button
            type="button"
            onClick={() => onEdit(student)}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-slate-600 hover:text-slate-900 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <FiEdit className="w-4 h-4" /> Editar
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(student)}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-amber-600 hover:text-amber-800 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
          >
            <FiSlash className="w-4 h-4" /> {student.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
          </button>
          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(student)}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-2xl text-red-600 hover:text-red-800 text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              <FiTrash2 className="w-4 h-4" /> Excluir
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

const StudentTable = memo(function StudentTable({ students, onView, onEdit, onToggleStatus, onDelete, canDelete }: StudentTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Estudante</th>
            <th className="px-6 py-4">Matrícula</th>
            <th className="px-6 py-4">Curso</th>
            <th className="px-6 py-4">Turma</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                Nenhum estudante encontrado com os filtros aplicados.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onView={onView}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                canDelete={canDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
});

StudentTable.displayName = 'StudentTable';
export default StudentTable;
