import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUpload, FiSearch } from 'react-icons/fi';
import { Student } from '../types/student';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import CsvImportModal from '../components/CsvImportModal';
import { usePermissions } from '../hooks/useAuth';

const STORAGE_KEY = 'student-management-list';

const initialStudents: Student[] = [
  {
    id: '1',
    registration: '2026001',
    name: 'Ana Silva',
    birthDate: '2008-05-15',
    course: 'Ciências Humanas',
    grade: '3º A',
    status: 'ACTIVE',
    hasBiometry: true,
    biometrics: ['ABC123DEF456', 'DEF789GHI012'],
    photoUrl: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '2',
    registration: '2026002',
    name: 'Bruno Gomes',
    birthDate: '2009-03-22',
    course: 'Exatas',
    grade: '2º B',
    status: 'ACTIVE',
    hasBiometry: false,
    biometrics: [],
    photoUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    registration: '2026003',
    name: 'Camila Rocha',
    birthDate: '2010-08-10',
    course: 'Biológicas',
    grade: '1º C',
    status: 'INACTIVE',
    hasBiometry: true,
    biometrics: ['BCD234EFG567', 'EFG890HIJ123', 'HIJ456KLM789'],
    photoUrl: 'https://i.pravatar.cc/150?img=13',
  },
];

const createId = () => window.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 10);

export default function StudentsPage() {
  const navigate = useNavigate();
  const { hasRole } = usePermissions();
  const [students, setStudents] = useState<Student[]>(() => {
    if (typeof window === 'undefined') return initialStudents;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialStudents;
    try {
      return JSON.parse(stored) as Student[];
    } catch {
      return initialStudents;
    }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const uniqueCourses = useMemo(() => Array.from(new Set(students.map((student) => student.course))), [students]);
  const uniqueGrades = useMemo(() => Array.from(new Set(students.map((student) => student.grade))), [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registration.includes(searchTerm);

      const matchesCourse = courseFilter === 'ALL' || student.course === courseFilter;
      const matchesGrade = gradeFilter === 'ALL' || student.grade === gradeFilter;
      const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;

      return matchesSearch && matchesCourse && matchesGrade && matchesStatus;
    });
  }, [students, searchTerm, courseFilter, gradeFilter, statusFilter]);

  const handleSaveStudent = (student: Partial<Student>) => {
    const updatedStudent: Student = {
      id: student.id ?? createId(),
      registration: student.registration?.trim() ?? '',
      name: student.name?.trim() ?? '',
      birthDate: student.birthDate?.trim() ?? '',
      course: student.course?.trim() ?? 'Não informado',
      grade: student.grade?.trim() ?? 'Não informado',
      status: student.status ?? 'ACTIVE',
      photoUrl: student.photoUrl,
      hasBiometry: student.hasBiometry ?? false,
      biometrics: student.biometrics ?? [],
    };

    setStudents((prev) => {
      const index = prev.findIndex((item) => item.id === updatedStudent.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = updatedStudent;
        return next;
      }
      return [updatedStudent, ...prev];
    });
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (student: Student) => {
    setStudents((prev) =>
      prev.map((item) =>
        item.id === student.id ? { ...item, status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : item
      )
    );
  };

  const handleView = (student: Student) => {
    navigate(`/estudantes/${student.id}`);
  };

  const openNewStudent = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleCsvImport = (importedStudents: Partial<Student>[]) => {
    setStudents((prev) => {
      const existingRegistrations = new Set(prev.map(s => s.registration));
      const newStudents = importedStudents
        .filter(s => s.registration && !existingRegistrations.has(s.registration))
        .map(s => ({
          id: s.id ?? createId(),
          registration: s.registration?.trim() ?? '',
          name: s.name?.trim() ?? '',
          birthDate: s.birthDate?.trim() ?? '',
          course: s.course?.trim() ?? 'Não informado',
          grade: s.grade?.trim() ?? 'Não informado',
          status: s.status ?? 'ACTIVE',
          photoUrl: s.photoUrl,
          hasBiometry: s.hasBiometry ?? false,
          biometrics: s.biometrics ?? [],
        } as Student));
      return [...prev, ...newStudents];
    });
    setIsCsvImportModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCsvImportModalOpen(true);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Estudantes</h1>
          <p className="text-slate-500">Cadastre, filtre e visualize os dados dos alunos.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {hasRole('GESTOR') || hasRole('ADMIN') ? (
            <label className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl cursor-pointer hover:bg-slate-50 transition shadow-sm">
              <FiUpload className="text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Importar Lote</span>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          ) : null}
          {hasRole('GESTOR') || hasRole('ADMIN') ? (
            <button
              onClick={openNewStudent}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              <FiPlus />
              Novo Estudante
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.8fr_1.2fr] mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <FiSearch className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou matrícula..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os cursos</option>
            {uniqueCourses.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full p-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todas as turmas</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
            className="w-full p-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Todos os status</option>
            <option value="ACTIVE">Ativos</option>
            <option value="INACTIVE">Inativos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total de estudantes</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{students.length}</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Ativos</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{students.filter((student) => student.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Inativos</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">{students.filter((student) => student.status === 'INACTIVE').length}</p>
        </div>
      </div>

      <StudentTable
        students={filteredStudents}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {isFormOpen && (
        <StudentForm
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveStudent}
          student={editingStudent ?? undefined}
        />
      )}

      {isCsvImportModalOpen && (
        <CsvImportModal
          onClose={() => setIsCsvImportModalOpen(false)}
          onImport={handleCsvImport}
        />
      )}
    </div>
  );
}
