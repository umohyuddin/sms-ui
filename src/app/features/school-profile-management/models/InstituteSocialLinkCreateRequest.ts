export interface InstituteSocialLinkCreateRequest {
  instituteId: number;
  platform?: string | null;
  url?: string | null;
}
