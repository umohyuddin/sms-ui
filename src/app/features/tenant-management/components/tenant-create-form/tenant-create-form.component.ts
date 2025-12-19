import { Component, Input, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearManagementService } from '../../services/academic-year-management.service';


@Component({
  selector: 'app-tenant-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.css']
})
export class TenantCreateFormComponent {
  academicYearForm!: FormGroup;
  routeTenantId?: string;
  URL = '';
  mode = '';
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder,
    private academicYearService: AcademicYearManagementService,

    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    console.log('Config:', this.appConfig);
    this.URL = this.appConfig.apiBaseUrl;
    this.initializeForm();
    this.academicYearForm.get('startDate')?.valueChanges.subscribe(() => this.generateAcademicYearName());
    this.academicYearForm.get('endDate')?.valueChanges.subscribe(() => this.generateAcademicYearName());
  }


  private initializeForm() {
    this.academicYearForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          this.noWhitespaceValidator
        ]
      ],
      startDate: [
        '',
        [
          Validators.required,
          this.validateStartDate
        ]
      ],
      endDate: [
        '',
        [
          Validators.required,
          this.validateEndDate.bind(this) // Needs access to startDate
        ]
      ],
      isCurrent: [false]
    });
  }


  // Start date cannot be in the past
  validateStartDate(control: any) {
    const today = new Date();
    if (control.value && new Date(control.value) < today) {
      return { pastDate: true };
    }
    return null;
  }

  // End date must be after start date
  validateEndDate(control: any) {
    const startDate = this.academicYearForm?.get('startDate')?.value;
    if (!control.value || !startDate) return null;

    const start = new Date(startDate);
    const end = new Date(control.value);

    // Must be after start date
    if (end <= start) {
      return { beforeStartDate: true };
    }

    // Check if duration is more than 12 months
    const monthsDifference = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (monthsDifference > 12) {
      return { exceeds12Months: true };
    }

    return null;
  }

  goToAcademicYearList() {
    this.router.navigate(['tenants'])
  }

  onSubmit(): void {
    console.log('  Tenant Form Data:', this.academicYearForm.getRawValue());
    if (this.academicYearForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.academicYearForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.academicYearService.createAcademicYear(this.academicYearForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(['/tenants']);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/tenants']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }



  get name() { return this.academicYearForm.get('name'); }
  get startDate() { return this.academicYearForm.get('startDate'); }
  get endDate() { return this.academicYearForm.get('endDate'); }
  get isCurrent() { return this.academicYearForm.get('isCurrent'); }

  validationMessages = {
    name: {
      required: 'Academic Year Name is required.',
      maxlength: 'Academic Year Name cannot exceed 20 characters.',
      whitespace: 'Academic Year Name cannot be empty or whitespace only.'
    },
    startDate: {
      required: 'Start Date is required.',
      pastDate: 'Start Date cannot be in the past.'
    },
    endDate: {
      required: 'End Date is required.',
      beforeStartDate: 'End Date must be after Start Date.',
      exceeds12Months: 'Academic Year cannot be longer than 12 months.'
    }
  };


  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.academicYearForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) {
        return this.validationMessages[controlName][key];
      }
    }

    return '';
  }

  // Whitespace validator
  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) {
      return { whitespace: true };
    }
    return null;
  }

  private generateAcademicYearName() {
    const start = this.academicYearForm.get('startDate')?.value;
    const end = this.academicYearForm.get('endDate')?.value;

    if (start && end) {
      const startYear = new Date(start).getFullYear();
      const endYear = new Date(end).getFullYear();
      const academicYearName = `${startYear}-${endYear}`;
      this.academicYearForm.get('name')?.setValue(academicYearName);
    }
  }
}

