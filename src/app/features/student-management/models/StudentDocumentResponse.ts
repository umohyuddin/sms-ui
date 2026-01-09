export interface StudentDocumentResponse {
  id: number;            // Document ID
  studentId: number;     // Student ID
  fileName: string;      // Original file name
  filePath: string;      // Path on server or URL
  fileType: string;      // File type: PDF, DOCX, IMAGE, etc.
  documentType: string;  // Document type key: B_FORM, PASSPORT, etc.
}