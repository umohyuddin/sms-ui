export interface InstituteBoardMemberCreateRequest {
  instituteId: number;
  roleId: number;
  fullName?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  termStart?: string | null;
  termEnd?: string | null;
  isActive?: boolean | null;
}
