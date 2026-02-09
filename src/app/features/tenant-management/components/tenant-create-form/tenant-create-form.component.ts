import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearManagementService } from '../../services/academic-year-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-tenant-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToasterComponent, LoaderComponent],
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.css']
})
export class TenantCreateFormComponent {
  @ViewChild('toaster') toaster!: ToasterComponent;
  loading: boolean = false;
  loaderMessage = 'Processing...';
  academicYearForm!: FormGroup;
  academicYearId: string | null = null;
  isEditMode = false;
  URL = '';
  private readonly MODULE = 'AcademicYear';
  private readonly COMPONENT = 'AcademicYearForm';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private academicYearService: AcademicYearManagementService,
    private appConfig: AppConfigService
  , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.URL = this.appConfig.apiBaseUrl;
    this.academicYearId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.academicYearId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.initializeForm();

    if (this.isEditMode && this.academicYearId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Loading academic year', this.academicYearId);
      this.loadAcademicYear(this.academicYearId);
    }

    // auto-generate name when dates change
    this.academicYearForm.get('startDate')?.valueChanges.subscribe(() => this.generateAcademicYearName());
    this.academicYearForm.get('endDate')?.valueChanges.subscribe(() => this.generateAcademicYearName());
    LoggerUtil.groupEnd(); // Init
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.academicYearForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]],
      startDate: ['', [Validators.required, this.validateStartDate]],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
      code: ['', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]],
      remarks: [''],
      setAsCurrent: [false],
      isCurrent: [false]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }

  private loadAcademicYear(id: string) {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Academic Year`);
    this.academicYearService.getAcademicYearById(id).subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Academic year loaded', response.body);
        this.academicYearForm.patchValue(response.body, { emitEvent: false });
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Failed to load academic year', error);
        this.router.navigate(ROUTES.ACADEMIC_YEAR.LIST);
      },
      complete: () => LoggerUtil.groupEnd()
    });
  }

  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📋 Submit triggered');
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📤 Submitting form data', this.academicYearForm.getRawValue());

    if (this.academicYearForm.invalid) {
      this.academicYearForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Form validation failed', this.academicYearForm.errors);
      this.toaster.show('Please fix validation errors before submitting', 'error');
      LoggerUtil.groupEnd();
      return;
    }

    this.loading = true;
    this.loaderMessage = this.isEditMode ? 'Updating Academic Year...' : 'Creating Academic Year...';
    this.academicYearService.saveAcademicYear(this.academicYearId, this.academicYearForm.getRawValue()).subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Save successful', response.body);
        LoggerUtil.log(this.MODULE, this.COMPONENT, '➡️ Redirecting to list');
        this.toaster.show('Academic Year saved successfully!', 'success');
        this.router.navigate(ROUTES.ACADEMIC_YEAR.LIST);
      },
      error: (error) => {
        this.loading = false;
        LoggerUtil.error(this.MODULE, this.COMPONENT, '❌ Save failed', error)
        this.toaster.show('Failed to save Academic Year. Please try again.', 'error');

      },
      complete: () => {
        this.loading = false; // hide loader
        LoggerUtil.groupEnd();
      }
    });
  }

  goToAcademicYearList() {
    LoggerUtil.log(this.MODULE, this.COMPONENT, '➡️ Redirecting to list');
    this.router.navigate(ROUTES.ACADEMIC_YEAR.LIST);
  }

  // Custom validators
  validateStartDate(control: any) {
    const today = new Date();
    if (control.value && new Date(control.value) < today) return { pastDate: true };
    return null;
  }

  validateEndDate(control: any) {
    const startDate = this.academicYearForm?.get('startDate')?.value;
    if (!control.value || !startDate) return null;

    const start = new Date(startDate);
    const end = new Date(control.value);

    if (end <= start) return { beforeStartDate: true };

    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (monthsDiff > 12) return { exceeds12Months: true };

    return null;
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  private generateAcademicYearName() {
    const start = this.academicYearForm.get('startDate')?.value;
    const end = this.academicYearForm.get('endDate')?.value;

    if (!start || !end) return;

    const startYear = new Date(start).getFullYear();
    const endYear = new Date(end).getFullYear();

    // Name → 2024-2025
    const name = `${startYear}-${endYear}`;

    // Code → AY-2024-25
    const code = `AY-${startYear}-${String(endYear).slice(-2)}`;

    this.academicYearForm.patchValue(
      { name, code },
      { emitEvent: false } // 🚨 avoid infinite loops
    );
  }


  // Getters for easy access
  get name() { return this.academicYearForm.get('name'); }
  get code() { return this.academicYearForm.get('code'); }
  get startDate() { return this.academicYearForm.get('startDate'); }
  get endDate() { return this.academicYearForm.get('endDate'); }
  get remarks() { return this.academicYearForm.get('remarks'); }
  get isCurrent() { return this.academicYearForm.get('isCurrent'); }

  validationMessages = {
    name: {
      required: 'Academic Year name is required.',
      maxlength: 'Academic Year name cannot exceed 50 characters.',
      whitespace: 'Academic Year name cannot be empty or whitespace only.'
    },

    code: {
      required: 'Academic Year code is required.',
      maxlength: 'Academic Year code cannot exceed 20 characters.',
      whitespace: 'Academic Year code cannot be empty or whitespace only.'
    },

    startDate: {
      required: 'Start date is required.',
      pastDate: 'Start date cannot be in the past.'
    },

    endDate: {
      required: 'End date is required.',
      beforeStartDate: 'End date must be after the start date.',
      exceedsMaxDuration: 'Academic year duration cannot exceed the allowed limit.'
    },

    totalMonths: {
      required: 'Total months is required.',
      min: 'Academic year must be at least 1 month.',
      max: 'Academic year cannot exceed 24 months.'
    },

    remarks: {
      maxlength: 'Remarks cannot exceed 255 characters.'
    }
  };


  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.academicYearForm.get(controlName as string);
    if (!control || !control.errors) return '';
    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }
    return '';
  }
}
