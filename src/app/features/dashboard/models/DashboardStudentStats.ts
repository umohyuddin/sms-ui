export interface DashboardStudentStats {
  totalStudents: number;
  totalMaleStudents: number | null;
  totalFemaleStudents: number | null;
  totalOtherStudents: number | null;
  studentsByCampus: Record<string, number> | null;   // e.g., { "Campus A": 20, "Campus B": 28 }
  studentsByStandard: Record<string, number> | null; // e.g., { "Standard 1": 15, "Standard 2": 33 }
  studentsBySection: Record<string, number> | null;  // e.g., { "Section A": 25, "Section B": 23 }
  studentsRegisteredThisMonth: number;
}

