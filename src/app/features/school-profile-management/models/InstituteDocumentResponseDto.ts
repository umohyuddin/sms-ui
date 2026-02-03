export interface InstituteDocumentResponseDto {
  id: number;
  instituteId: number;
  fileName: string;
  fileUrl?: string | null;
  fileType?: string | null;
  documentType: string;
  expiryDate?: string | null;
}
