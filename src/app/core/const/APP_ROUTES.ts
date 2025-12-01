export const ROUTES = {
  CAMPUS: {
    LIST: ['campuses', 'campus-listing'],
    CREATE: ['campuses', 'campus-create'],
    EDIT: (id: string) => ['campuses', 'campus-edit', id],
    DETAILS: (id: string) => ['campuses', 'campus-details', id],
  }
};
