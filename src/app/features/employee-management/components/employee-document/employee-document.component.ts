import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { EmployeeDocumentResponseDto } from '../../models/EmployeeDocumentResponseDto';
import { EmployeeResponse } from '../../models/EmployeeResponse';
import { EmployeeManagementService } from '../../services/employee-management.service';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';

@Component({
  selector: 'app-employee-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-document.component.html',
  styleUrl: './employee-document.component.css'
})
export class EmployeeDocumentComponent {
  docsForm!: FormGroup;
  employeeData?: EmployeeResponse;
  routedId!: string;
  docsTypeDD: KeyValueOption[] = [];
  selectedFile: File | null = null;
  fileInvalid: boolean = false;
  docsData: any;
  documentsByType: { [key: string]: EmployeeDocumentResponseDto[] } = {};

  constructor(
    private fb: FormBuilder,
    private employeeManagementService: EmployeeManagementService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService
  , private logger: LoggerService) { }



  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('employee ID from route:', this.routedId);
    this.docsInitializeForm()
    this.docsLookUpData();
    this.getEmployeeAllDocs()
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
    const formData = new FormData();
    formData.append('docKey', this.docsForm.value.docKey);
    formData.append('file', this.selectedFile);
    formData.append('employeeId', this.routedId);

    console.log('Form submitted:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.employeeManagementService.uploadEmployeeDocs(formData).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);

        // This is upload response, NOT full employee
        if (this.employeeData) {
          this.employeeData.profilePicture = response.body.filePath;
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
      }
    });

  }

  groupByDocumentType(docs: EmployeeDocumentResponseDto[]) {
    return docs.reduce((acc: any, doc) => {
      const key = doc.documentType;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(doc);
      return acc;
    }, {});
  }
  getEmployeeAllDocs() {
    this.employeeManagementService.getEmployeeDocs(this.routedId).subscribe({
      next: (response) => {
        console.log('✅ Status:', response.status);
        console.log('📦 Body:', response.body);
        const docs: EmployeeDocumentResponseDto[] = response.body;
        this.documentsByType = this.groupByDocumentType(docs);
        console.log(this.documentsByType);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }

  docsLookUpData() {
    this.employeeManagementService.getDocsMeta()
      .subscribe({
        next: (response) => {
          console.log('  Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
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
      })
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

  fileControl?.markAsTouched();   // ✅ REQUIRED
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

  downloadFile(doc: EmployeeDocumentResponseDto) {
  this.employeeManagementService.downloadEmployeeDocument(doc.id, this.routedId, doc.fileName);
}

  onDocsCancel(): void {
    this.docsForm.reset();
    this.docsForm.markAsPristine();
    this.docsForm.markAsUntouched();
    this.selectedFile = null;
  }
  //getters

  get docKey() { return this.docsForm.get('docKey'); }
}
