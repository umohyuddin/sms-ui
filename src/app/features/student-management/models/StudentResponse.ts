export interface StudentResponse {
  id: number;
  firstName: string;
  fullName: string;
  lastName: string;
  studentCode: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  deleted: boolean;
  deletedAt: string | null;
  status: string;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
  campus: Campus;
  standard: Standard;
  section: Section;
  campusId: number;
  standardId: number;
  sectionId: number;
  academicYearId:number
  feeAssigned:boolean
}

/* ---------------------- CAMPUS ---------------------- */
export interface Campus {
  id: number;
  instituteId: number;
  campusName: string;
  campusCode: string | null;
  contactNumber: string;
  email: string;
  website: string;
  address: string;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  provinceId: number;
  cityId: number;
  province: Province;
  city: City;
  active: boolean;

}

export interface Province {
  id: number;
  code: string | null;
  name: string | null;
  description: string | null;
  isActive: boolean | null;
}

export interface City {
  id: number;
  provinceId: number | null;
  name: string | null;
  code: string | null;
  isActive: boolean | null;
  deleted: boolean | null;
}

/* ---------------------- STANDARD ---------------------- */
export interface Standard {
  id: number;
  standardName: string;
  standardCode: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt: string | null;
  campusId: number;
  campus: Campus;
}

/* ---------------------- SECTION ---------------------- */
export interface Section {
  id: number;
  sectionName: string;
  sectionCode: string | null;
  standard: Standard;
  deleted: boolean;
  deletedAt: string | null;
}



export interface AcademicYear {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
}


export interface AdmissionType {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  deleted: boolean;
}