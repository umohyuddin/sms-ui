export interface InstituteContactCreateRequest {
  instituteId: number;
  contactPersonName?: string | null;
  role?: string | null;
  phone?: string | null;
  email?: string | null;
  isPrimary?: boolean | null;
}
