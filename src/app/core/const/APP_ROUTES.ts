export const ROUTES = {
  DASHBAORD: {
    MAIN_DASHBOARD: ['dashboard']
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
  STUDENT: {
    LIST: ['students'],
    CREATE: ['students', 'student-create'],
    EDIT: (id: string) => ['students', 'student-edit', id],
    DETAILS: (id: string) => ['students', 'student-details', id],
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
      LIST: ['concession-rate'],
      CREATE: ['concession-rate', 'concession-rate-create'],
      EDIT: (id: string) => ['concession-rate', 'concession-rate-edit', id],
      DETAILS: (id: string) => ['concession-rate', 'concession-rate-details', id],
    },
  }
};

