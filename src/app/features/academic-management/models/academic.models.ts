// --- 1. Core Academics ---

export interface SubjectGroup {
    id?: number;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
}

export interface Subject {
    id?: number;
    name: string;
    code: string;
    description?: string;
    subjectGroupId: number;
    subjectGroupName?: string;
    isElective: boolean;
    isActive: boolean;
}

export interface StandardSubject {
    standardId: number;
    subjectId: number;
    academicYearId: number;
    subjectName?: string;
    isMandatory: boolean;
}

// --- 2. Scheduling ---

export interface TeacherAssignment {
    id?: number;
    employeeId: number;
    employeeName?: string;
    standardId: number;
    standardName?: string;
    sectionId: number;
    sectionName?: string;
    subjectId: number;
    subjectName?: string;
    academicYearId: number;
    effectiveFrom: string;
    isPrimary: boolean;
    isActive?: boolean;
}

export interface TimetableEntry {
    id?: number;
    standardId: number;
    sectionId: number;
    subjectId: number;
    subjectName?: string;
    teacherId: number;
    teacherName?: string;
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    startTime: string; // HH:mm:ss
    endTime: string;   // HH:mm:ss
    room?: string;
}

// --- 3. Attendance ---

export interface AttendanceRecord {
    id?: number;
    studentId?: number;
    studentName?: string;
    rollNo?: string;
    employeeId?: number;
    attendanceDate: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE' | 'HALFDAY';
    remarks?: string;
    checkInTime?: string;
    checkOutTime?: string;
}

// --- 4. Evaluation ---

export interface ExamType {
    id?: number;
    name: string;
    description?: string;
    isActive: boolean;
}

export interface ExamTerm {
    id?: number;
    name: string;
    academicYearId: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface AssessmentType {
    id?: number;
    name: string;
    category: 'ASSIGNMENT' | 'QUIZ' | 'PROJECT' | 'VIVA';
    isActive: boolean;
}

export interface Exam {
    id?: number;
    name: string;
    examTypeId: number;
    examTermId: number;
    academicYearId: number;
    campusId: number;
    standardId: number;
    sectionId: number;
    startDate: string;
    endDate: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    totalMarks: number;
}

export interface ExamSubject {
    id?: number;
    examId: number;
    subjectId: number;
    subjectName?: string;
    examDate: string;
    startTime: string;
    endTime: string;
    maxMarks: number;
    minPassMarks: number;
    room?: string;
    invigilatorId?: number;
}

export interface Assessment {
    id?: number;
    title: string;
    description?: string;
    assessmentTypeId: number;
    assignmentId?: number; // Link to TeacherSubjectAssignment
    academicYearId: number;
    maxMarks: number;
    dueDate: string;
    isOnline: boolean;
}

export interface StudentAssessment {
    id?: number;
    assessmentId: number;
    studentId: number;
    submissionDate?: string;
    status: 'PENDING' | 'SUBMITTED' | 'EVALUATED' | 'LATE' | 'NOT_SUBMITTED';
    obtainedMarks?: number;
    teacherRemarks?: string;
    evaluatedById?: number;
}

// --- 5. Results ---

export interface StudentExamMarks {
    id?: number;
    examSubjectId: number;
    studentId: number;
    obtainedMarks: number;
    isAbsent: boolean;
    isMalpractice: boolean;
    remarks?: string;
}

export interface ExamWeightage {
    id?: number;
    standardId: number;
    examTypeId: number;
    academicYearId: number;
    weightagePercentage: number;
}

export interface StudentTermResult {
    id?: number;
    studentId: number;
    examTermId: number;
    totalMarksObtained: number;
    totalMaxMarks: number;
    percentage: number;
    grade?: string;
    rank?: number;
    resultStatus: 'PASS' | 'FAIL' | 'PROMOTED' | 'HELD';
}

export interface GradeScale {
    id?: number;
    grade: string;
    minPercentage: number;
    maxPercentage: number;
    description?: string;
    gradePoint?: number;
    isActive: boolean;
}

export interface ReportCard {
    id?: number;
    studentId: number;
    academicYearId: number;
    generationDate: string;
    termResultsSummary?: string;
    attendanceSummary?: string;
    teacherRemarks?: string;
    isPublished: boolean;
}

// --- 6. History & Activity ---

export interface StudentActivity {
    id?: number;
    studentId: number;
    activityType: string;
    activityDate: string;
    description?: string;
    organizationId: number;
}

export interface StudentAcademicHistory {
    id?: number;
    studentId: number;
    standardId: number;
    academicYearId: number;
    resultStatus: string;
    percentage?: number;
    remarks?: string;
}
