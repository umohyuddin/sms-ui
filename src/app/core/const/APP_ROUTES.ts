export const ROUTES = {
  AUTH: {
    LOGIN: ['auth/login']
  },
  DASHBAORD: {
    MAIN_DASHBOARD: ['dashboard']
  },

  SCHOOL_PROFILE: {
    LIST: ['school/profile'],
    CREATE: ['school/profile', 'profile-create'],
    EDIT: (id: string) => ['school/profile', 'profile-create', id],
    DETAILS: (id: string) => ['school/profile', 'profile-create', id],
  },

  ACADEMIC_YEAR: {
    LIST: ['academic-years'],
    CREATE: ['academic-years', 'academic-year-create'],
    EDIT: (id: string) => ['academic-years', 'academic-year-edit', id],
    DETAILS: (id: string) => ['academic-years', 'academic-year-details', id]
  },
  CAMPUS: {
    LIST: ['campuses'],
    CREATE: ['campuses', 'campus-create'],
    EDIT: (id: string) => ['campuses', 'campus-edit', id],
    DETAILS: (id: string) => ['campuses', 'campus-details', id],
    STANDARD: {
      LIST: ['campuses/standards'],
      CREATE: ['campuses/standards', 'standard-create'],
      EDIT: (id: string) => ['campuses/standards', 'standard-edit', id],
      DETAILS: (id: string) => ['campuses/standards', 'standard-details', id],
    },
    SECTION: {
      LIST: ['campuses/standards/sections'],
      CREATE: ['campuses/standards/sections', 'section-create'],
      EDIT: (id: string) => ['campuses/standards/sections', 'section-edit', id],
      DETAILS: (id: string) => ['campuses/standards/sections', 'section-details', id],
    }
  },
  DEPARTMENTS: {
    LIST: ['departments'],
    CREATE: ['departments', 'department-create'],
    EDIT: (id: string) => ['departments', 'department-edit', id],
    DETAILS: (id: string) => ['departments', 'department-details', id],
  },
  DESIGNATIONS: {
    LIST: ['designations'],
    CREATE: ['designations', 'designation-create'],
    EDIT: (id: string) => ['designations', 'designation-edit', id],
    DETAILS: (id: string) => ['designations', 'designation-details', id],
  },
  STUDENT: {
    LIST: ['students'],
    CREATE: ['students', 'student-create'],
    EDIT: (id: string) => ['students', 'student-edit', id],
    DETAILS: (id: string) => ['students', 'student-details', id],
    STUDENT_FEE_CALCULATOR: {
      DETAILS: ['students', 'fee-calculator']
    },
    STUDENT_FEE_COLLECTOR: ['students', 'fee-collector']
  },
  EMPLOYEE: {
    LIST: ['employee'],
    CREATE: ['employee', 'employee-create'],
    EDIT: (id: string) => ['employees', 'employee-edit', id],
    DETAILS: (id: string) => ['employee', 'employee-details', id]
  },
  EMPLOYEE_TYPE: {
    LIST: ['employee'],
    CREATE: ['employee', 'employee-create'],
    EDIT: (id: string) => ['employees', 'employee-edit', id],
    DETAILS: (id: string) => ['employee', 'employee-details', id]
  },

  SALARY_STRUCTURE: {
    LIST: ['salary/structure'],
    CREATE: ['salary/structure', 'salary-structure-create'],
    EDIT: (id: string) => ['salary/structure', 'salary-structure-edit', id],
    DETAILS: (id: string) => ['salary/structure', 'salary-structure-details', id],
  },
  SALARY_COMPONENT: {
    LIST: ['salary/components'],
    CREATE: ['salary/components', 'salary-component-create'],
    EDIT: (id: string) => ['salary/components', 'salary-component-edit', id],
    DETAILS: (id: string) => ['salary/components', 'salary-component-details', id],
  },
  FEE: {
    FEE_CATALOG: {
      LIST: ['fee/catalog'],
      CREATE: ['fee/catalog', 'fee-catalog-create'],
      EDIT: (id: string) => ['fee/catalog', 'fee-catalog-edit', id],
      DETAILS: (id: string) => ['fee/catalog', 'fee-catalog-details', id],
    },
    FEE_CATALOG_COMPONENT: {
      LIST: ['fee/catalog/component'],
      CREATE: ['fee/catalog/component', 'fee-catalog-component-create'],
      EDIT: (id: string) => ['fee/catalog/component', 'fee-catalog-component-edit', id],
      DETAILS: (id: string) => ['fee/catalog/component', 'fee-catalog-component-details', id],
    },
    FEE_RATE: {
      LIST: ['fee/catalog/component/rate'],
      CREATE: ['fee/catalog/component/rate', 'fee-rate-create'],
      EDIT: (id: string) => ['fee/catalog/component/rate', 'fee-rate-edit', id],
      DETAILS: (id: string) => ['fee/catalog/component/rate', 'fee-rate-details', id],
    },
  },
  CONCESSION: {
    CONCESSION_TYPE: {
      LIST: ['concession/catalog'],
      CREATE: ['concession/catalog', 'concession-create'],
      EDIT: (id: string) => ['concession/catalog', 'concession-edit', id],
      DETAILS: (id: string) => ['concession/catalog', 'concession-details', id],
    },
    CONCESSION__SUB_TYPE: {
      LIST: ['concession/catalog/component'],
      CREATE: ['concession/catalog/component', 'concession-component-create'],
      EDIT: (id: string) => ['concession/catalog/component', 'concession-component-edit', id],
      DETAILS: (id: string) => ['concession/catalog/component', 'concession-component-details', id],
    },
    CONCESSION_RATE: {
      LIST: ['concession/component/rate'],
      CREATE: ['concession/component/rate', 'concession-rate-create'],
      EDIT: (id: string) => ['concession/component/rate', 'concession-rate-edit', id],
      DETAILS: (id: string) => ['concession/rate', 'concession-rate-details', id],
    },
  }


};

