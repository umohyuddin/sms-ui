export interface EmployeeDocumentResponseDto {
  id: number;             // Document ID
  employeeId: number;     // Employee ID
  fileName: string;       // Original file name
  filePath: string;       // Path on server or URL
  fileType: string;       // File type: PDF, DOCX, IMAGE, etc.
  documentType: string;   // Document type key: PASSPORT, ID_CARD, etc.
}