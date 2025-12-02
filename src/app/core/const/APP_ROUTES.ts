export const ROUTES = {
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
    }
  }
};
