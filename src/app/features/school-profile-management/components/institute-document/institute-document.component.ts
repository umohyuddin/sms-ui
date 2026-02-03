import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { InstituteDocumentResponseDto } from '../../models/InstituteDocumentResponseDto';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';

@Component({
  selector: 'app-institute-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './institute-document.component.html',
  styleUrl: './institute-document.component.css'
})
export class InstituteDocumentComponent {
  @Input() instituteId?: number;

  docsForm!: FormGroup;
  docsTypeDD: KeyValueOption[] = [];
  selectedFile: File | null = null;
  fileInvalid: boolean = false;
  docsData: any;
  documentsByType: { [key: string]: InstituteDocumentResponseDto[] } = {};

  constructor(
    private fb: FormBuilder,
    private schoolProfileManagementService: SchoolProfileManagementService
  ) { }

  ngOnInit(): void {
    this.docsInitializeForm();
    this.docsLookUpData();
    this.getInstituteAllDocs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId']) {
      this.getInstituteAllDocs();
    }
  }

  private docsInitializeForm() {
    this.docsForm = this.fb.group({
      docKey: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onDocsSubmit() {
    if (this.docsForm.invalid) {
      this.docsForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      this.docsForm.get('file')?.setErrors({ required: true });
      return;
    }

    if (!this.instituteId) {
      this.docsForm.get('docKey')?.setErrors({ required: true });
      return;
    }

    const formData = new FormData();
    formData.append('docKey', this.docsForm.value.docKey);
    formData.append('file', this.selectedFile);
    formData.append('instituteId', this.instituteId.toString());

    this.schoolProfileManagementService.uploadInstituteDocs(formData).subscribe({
      next: (response) => {
        if (response?.body) {
          this.getInstituteAllDocs();
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });
  }

  groupByDocumentType(docs: InstituteDocumentResponseDto[]) {
    return docs.reduce((acc: any, doc) => {
      const key = doc.documentType;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(doc);
      return acc;
    }, {});
  }

  getInstituteAllDocs() {
    if (!this.instituteId) {
      return;
    }

    this.schoolProfileManagementService.getInstituteDocs(this.instituteId).subscribe({
      next: (response) => {
        const docs: InstituteDocumentResponseDto[] = response.body;
        this.documentsByType = this.groupByDocumentType(docs);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  docsLookUpData() {
    this.schoolProfileManagementService.getDocsMeta()
      .subscribe({
        next: (response) => {
          this.docsTypeDD = Object.entries(response.body.docs).map(
            ([key, label]) => ({ key, label: label as string })
          );
        },
        error: (error) => {
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Request Complete');
        }
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    const fileControl = this.docsForm.get('file');

    if (file) {
      this.selectedFile = file;
      fileControl?.setValue(file);
    } else {
      this.selectedFile = null;
      fileControl?.setValue(null);
    }

    fileControl?.markAsTouched();
    fileControl?.updateValueAndValidity();
  }

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
      default: return './assets/media/files/file.svg';
    }
  }

  getFileTypeFromName(fileName?: string | null): string {
    if (!fileName) {
      return 'file';
    }
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : 'file';
  }

  downloadFile(doc: InstituteDocumentResponseDto) {
    if (!this.instituteId) {
      return;
    }

    const fileType = doc.fileType || this.getFileTypeFromName(doc.fileName);
    this.schoolProfileManagementService.downloadInstituteDocument(doc.id, this.instituteId.toString(), doc.fileName || `document_${doc.id}`, fileType);
  }

  onDocsCancel(): void {
    this.docsForm.reset();
    this.docsForm.markAsPristine();
    this.docsForm.markAsUntouched();
    this.selectedFile = null;
  }

  get docKey() { return this.docsForm.get('docKey'); }
}
