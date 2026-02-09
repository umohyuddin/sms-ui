import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { StudentDocumentResponse } from '../../models/StudentDocumentResponse';
import { StudentManagementService } from '../../services/student-management.service';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-student-documents',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './student-documents.component.html',
  styleUrl: './student-documents.component.css'
})
export class StudentDocumentsComponent {

   @Input() studentId!: string;

  docsForm!: FormGroup;
  docsTypeDD: KeyValueOption[] = [];
  selectedFile: File | null = null;
  documentsByType: { [key: string]: StudentDocumentResponse[] } = {};

  constructor(
    private fb: FormBuilder,
    private studentManagementService: StudentManagementService
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchDocsMeta();
    this.fetchStudentDocs();
  }

  /** Initialize Form */
  private initializeForm() {
    this.docsForm = this.fb.group({
      docKey: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  /** File selected */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.selectedFile = file ?? null;
    const fileControl = this.docsForm.get('file');
    fileControl?.setValue(this.selectedFile);
    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }

  /** Submit document form */
  onDocsSubmit() {
    if (this.docsForm.invalid || !this.selectedFile) {
      this.docsForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('docKey', this.docsForm.value.docKey);
    formData.append('file', this.selectedFile);
    formData.append('studentId', this.studentId);

    this.studentManagementService.uploadStudentDocs(formData).subscribe({
      next: () => {
        this.onDocsCancel();
        this.fetchStudentDocs();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  /** Reset form */
  onDocsCancel() {
    this.docsForm.reset();
    this.selectedFile = null;
  }

  /** Fetch document type metadata */
  private fetchDocsMeta() {
    this.studentManagementService.getDocsMeta().subscribe({
      next: (res) => {
        this.docsTypeDD = Object.entries(res.body.docs).map(
          ([key, label]) => ({ key, label: label as string })
        );
      },
      error: (err) => console.error('Failed to fetch docs meta', err)
    });
  }

  /** Fetch documents of student */
  private fetchStudentDocs() {
    this.studentManagementService.getStudentDocs(this.studentId).subscribe({
      next: (res) => {
        const docs: StudentDocumentResponse[] = res.body;
        this.documentsByType = this.groupByType(docs);
      },
      error: (err) => console.error('Failed to fetch documents', err)
    });
  }

  /** Group documents by type */
  private groupByType(docs: StudentDocumentResponse[]) {
    return docs.reduce((acc: any, doc) => {
      const key = doc.documentType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(doc);
      return acc;
    }, {});
  }

  /** Download document */
   downloadFile(doc: StudentDocumentResponse) {
    this.studentManagementService.downloadStudentDocument(doc.id, this.studentId, doc.fileName);
  }

  /** Get file icon by type */
  getFileIcon(fileType: string): string {
    fileType = fileType.toLowerCase();
    switch (fileType) {
      case 'pdf': return './assets/media/files/pdf.svg';
      case 'jpg':
      case 'jpeg': return './assets/media/files/jpg.svg';
      case 'png': return './assets/media/files/png.svg';
      case 'doc':
      case 'docx': return './assets/media/files/doc.svg';
      case 'js': return './assets/media/files/javascript.svg';
      case 'zip': return './assets/media/files/zip.svg';
      default: return './assets/media/icons/svg/Files/File.svg';
    }
  }

  /** Getter for docKey control */
  get docKey() { return this.docsForm.get('docKey'); }

}
