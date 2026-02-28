import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { InstituteDocumentResponseDto } from '../../models/InstituteDocumentResponseDto';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-institute-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, DeletePopupComponent, ToasterComponent],
  templateUrl: './institute-document.component.html',
  styleUrl: './institute-document.component.css'
})
export class InstituteDocumentComponent {
  @Input() instituteId?: number;
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  @ViewChild('fileInput', { static: false }) fileInput?: ElementRef<HTMLInputElement>;

  docsForm!: FormGroup;
  docsTypeDD: KeyValueOption[] = [];
  selectedFile: File | null = null;
  fileInvalid: boolean = false;
  docsData: any;
  documentsByType: { [key: string]: InstituteDocumentResponseDto[] } = {};
  isLoading = false;
  loadingMessage = '';
  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  constructor(
    private fb: FormBuilder,
    private schoolProfileManagementService: SchoolProfileManagementService,
    private logger: LoggerService
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

    this.isLoading = true;
    this.loadingMessage = 'Uploading Document...';
    this.schoolProfileManagementService.uploadDocument(
      this.instituteId,
      this.docsForm.value.docKey,
      this.selectedFile
    ).subscribe({
      next: (response) => {
        if (response?.body) {
          this.getInstituteAllDocs();
          this.onDocsCancel();
          this.toaster?.show('Document uploaded successfully.', 'success');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Error:', error);
        this.toaster?.show('Failed to upload document.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
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

    this.isLoading = true;
    this.loadingMessage = 'Loading Documents...';
    this.schoolProfileManagementService.getInstituteDocs(this.instituteId).subscribe({
      next: (response) => {
        const docs: InstituteDocumentResponseDto[] = response.body;
        this.documentsByType = this.groupByDocumentType(docs);
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Request Error Status:', error.status);
        this.toaster?.show('Failed to load documents.', 'error');
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
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

      default:
        return './assets/media/files/file.svg';
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

  onDeleteDocument(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.pendingDeleteId = id;
    this.isDeletePopupOpen = true;
  }

  confirmDelete(): void {
    if (!this.pendingDeleteId) {
      this.isDeletePopupOpen = false;
      return;
    }

    this.isDeletePopupOpen = false;
    this.isLoading = true;
    this.loadingMessage = 'Deleting Document...';
    this.schoolProfileManagementService.deleteInstituteDocument(this.pendingDeleteId).subscribe({
      next: (response: any) => {
        this.getInstituteAllDocs();
        const successMessage = response?.body?.message || 'Document deleted successfully.';
        this.toaster?.show(successMessage, 'success');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('❌ Error deleting document:', error);
        this.toaster?.show('Failed to delete document.', 'error');
      }
    });
  }

  cancelDelete(): void {
    this.isDeletePopupOpen = false;
    this.pendingDeleteId = undefined;
  }

  onDocsCancel(): void {
    this.docsForm.reset();
    this.docsForm.markAsPristine();
    this.docsForm.markAsUntouched();
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  get docKey() { return this.docsForm.get('docKey'); }
}
