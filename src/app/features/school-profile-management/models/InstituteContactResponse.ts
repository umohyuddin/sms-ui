export interface InstituteContactResponse {
  id: number;
  instituteId: number;
  contactPersonName?: string | null;
  role?: {
    id?: number | null;
    name?: string | null;
  } | null;
  phone?: string | null;
  email?: string | null;
  isPrimary?: boolean | null;
}
