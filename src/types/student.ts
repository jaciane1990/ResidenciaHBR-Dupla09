export interface Student {
  id: string;
  registration: string; // Matrícula
  name: string;
  birthDate: string;    // Data de nascimento
  course: string;       // Curso
  grade: string;        // Turma/Ano
  status: 'ACTIVE' | 'INACTIVE';
  photoUrl?: string;
  hasBiometry: boolean;
  biometrics: string[]; // Array de códigos hexadecimais
}
