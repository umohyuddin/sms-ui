import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { FeeComponent } from '../../../fee-rate-management/models/FeeRateResponse';
import { FeeRateManagementService } from '../../../fee-rate-management/services/fee-rate-management.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionComponentManagementService } from '../../../concession-component-management/services/concession-component-management.service';
import { ConcessionComponentResponse } from '../../../concession-component-management/models/ConcessionComponentResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
  selector: 'app-concession-rate-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './concession-rate-create-form.component.html',
  styleUrls: ['./concession-rate-create-form.component.css']
})
export class ConcessionRateCreateFormComponent {
  private readonly MODULE = 'ConcessionRate';
  private readonly COMPONENT = 'ConcessionRateForm';

  academicYear: AcademicYearResponse | null = null;
  createForm!: FormGroup;
  resourceData?: ConcessionRateResponse;
  routedId?: string | null = null;
  isEditMode: boolean = false;

  concessionComponentDD: ConcessionComponentResponse[] = [];
  campuseDD: CampusResponse[] = [];
  concessionTypeDD: ConcessionResponse[] = [];
  feeCompnentDD: FeeComponent[] = [];

  constructor(
    private campusManagementService: CampusManagementService,
    private concessionManagementService: ConcessionManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionRateManagementService: ConcessionRateManagementService,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.academicYear = this.configService.getAcademicYear();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.initializeForm();
    this.handlePercentageValidation();

    this.loadCampuses();
    this.loadConcessionTypes();

    if (this.isEditMode && this.routedId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, '🔹 Loading concession rate details', this.routedId);
      this.getConcessionRateDetails(this.routedId);
    }

    this.onConcessionTypeChange();
    LoggerUtil.groupEnd(); // Init
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createForm = this.fb.group({
      academicYearId: [this.academicYear?.id, Validators.required],
      academicYearName: [this.academicYear?.name, Validators.required],
      discountTypeId: ['', Validators.required],
      discountSubTypeId: ['', Validators.required],
      campusId: ['', Validators.required],
      isPercentage: [{ value: false, disabled: true }, Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      effectiveFrom: [{ value: null, disabled: true }, Validators.required],
      effectiveTo: [{ value: null, disabled: true }, Validators.required],
      active: [true]
    });
    this.setAcademicYearDates(this.academicYear);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd(); // Form Initialization
  }
  private setAcademicYearDates(academicYear: AcademicYearResponse | null) {
    if (!academicYear) return;

    const startDate = academicYear.startDate; // e.g., '2026-01-01'
    const endDate = academicYear.endDate;     // e.g., '2026-12-31'

    this.createForm.patchValue({
      effectiveFrom: startDate,
      effectiveTo: endDate
    });
  }


  private loadCampuses() {
    LoggerUtil.group(`🏫 [${this.MODULE}] Load Campuses`);
    this.campusManagementService.getAllCampuses().subscribe({
      next: (res) => {
        this.campuseDD = res.body;
        LoggerUtil.log(this.MODULE, 'Campus', '📦 Campuses loaded', this.campuseDD);
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'Campus', '❌ Failed to load campuses', err),
      complete: () => LoggerUtil.log(this.MODULE, 'Campus', '🔚 Campus load complete')
    });
    LoggerUtil.groupEnd();
  }

  private subscribeToConcessionTypeChanges() {
    const discountTypeCtrl = this.createForm.get('discountTypeId');
    if (!discountTypeCtrl) return;

    discountTypeCtrl.valueChanges.subscribe(discountTypeId => {
      if (!discountTypeId) return;

      const selectedConcession = this.concessionTypeDD.find(c => c.id == discountTypeId);
      if (selectedConcession) {
        // Automatically set isPercentage based on chargeType
        this.createForm.patchValue({ isPercentage: selectedConcession.chargeType === 'PERCENTAGE' }, { emitEvent: false });
      }

      // Load the corresponding components
      this.loadComponentsByConcessionId(discountTypeId);
    });
  }

  private loadConcessionTypes() {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Concession Types`);
    this.concessionManagementService.getAllConcessions().subscribe({
      next: (res) => {
        this.concessionTypeDD = res.body || [];
        LoggerUtil.log(this.MODULE, 'ConcessionType', '📦 Concession types loaded', this.concessionTypeDD);

        // Subscribe to dropdown changes for user selection
        this.subscribeToConcessionTypeChanges();

        // Handle edit mode after concessions are loaded
        if (this.isEditMode && this.resourceData) {
          const discountTypeId = this.resourceData.discountSubType.discountType.id;

          // Patch discountTypeId WITHOUT triggering valueChanges
          this.createForm.patchValue({ discountTypeId }, { emitEvent: false });

          // Set isPercentage based on chargeType
          const selectedConcession = this.concessionTypeDD.find(c => c.id === discountTypeId);
          if (selectedConcession) {
            this.createForm.patchValue({ isPercentage: selectedConcession.chargeType === 'PERCENTAGE' }, { emitEvent: false });
          }

          // Load components for edit mode
          this.loadComponentsByConcessionId(discountTypeId, () => {
            // After components loaded, patch discountSubTypeId
            this.createForm.patchValue({ discountSubTypeId: this.resourceData?.discountSubType.id }, { emitEvent: false });
          });
        }
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'ConcessionType', '❌ Failed to load concession types', err)
    });
    LoggerUtil.groupEnd();
  }


  onConcessionTypeChange() {
    LoggerUtil.group(`🔄 [${this.MODULE}] Concession Type Change`);
    this.createForm.get('discountTypeId')?.valueChanges.subscribe(discountTypeId => {
      LoggerUtil.log(this.MODULE, 'ConcessionType', 'Selected discount type ID', discountTypeId);
      this.loadComponentsByConcessionId(discountTypeId);
    });
    LoggerUtil.groupEnd();
  }

  private loadComponentsByConcessionId(concessionTypeId: any, callback?: () => void) {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Concession Components`);
    this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
      next: (res) => {
        this.concessionComponentDD = res.body || [];
        LoggerUtil.log(this.MODULE, 'ConcessionComponent', '📦 Components loaded', this.concessionComponentDD);

        if (callback) callback();
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'ConcessionComponent', '❌ Failed to load components', err),
      complete: () => LoggerUtil.log(this.MODULE, 'ConcessionComponent', '🔚 Load complete')
    });
    LoggerUtil.groupEnd();
  }


  // private loadComponentsByConcessionId(concessionTypeId: any) {
  //   LoggerUtil.group(`📦 [${this.MODULE}] Load Concession Components`);
  //   this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
  //     next: (res) => {
  //       this.concessionComponentDD = res.body;
  //       LoggerUtil.log(this.MODULE, 'ConcessionComponent', '📦 Components loaded', this.concessionComponentDD);
  //     },
  //     error: (err) => LoggerUtil.error(this.MODULE, 'ConcessionComponent', '❌ Failed to load components', err),
  //     complete: () => LoggerUtil.log(this.MODULE, 'ConcessionComponent', '🔚 Load complete')
  //   });
  //   LoggerUtil.groupEnd();
  // }

  getConcessionRateDetails(routedId: string) {
    LoggerUtil.group(`🏷️ [${this.MODULE}] Load Rate Details`);
    this.concessionRateManagementService.getConcessionRateById(routedId).subscribe({
      next: (res) => {
        this.resourceData = res.body;
        LoggerUtil.log(this.MODULE, 'Details', '📦 Concession rate loaded', this.resourceData);

        this.createForm.patchValue({
          academicYearId: this.resourceData?.academicYearId,
          campusId: this.resourceData?.campusId,
          discountTypeId: this.resourceData?.discountSubType.discountType.id,
          discountSubTypeId: this.resourceData?.discountSubType.id,
          value: this.resourceData?.value,
          isPercentage: this.resourceData?.isPercentage,
          effectiveFrom: this.resourceData?.effectiveFrom,
          effectiveTo: this.resourceData?.effectiveTo,
          active: this.resourceData?.isActive
        });
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load rate details', err),
      complete: () => LoggerUtil.log(this.MODULE, 'Details', '🔚 Rate details load complete')
    });
    LoggerUtil.groupEnd();
  }



  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, 'Submit', '📋 Form submit triggered');

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', this.createForm.getRawValue());
    this.concessionRateManagementService.save(this.routedId ?? null, this.createForm.getRawValue()).subscribe({
      next: (res) => {
        LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', res.body);
        LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to list');
        this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.LIST);
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', err),
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
        LoggerUtil.groupEnd();
      }
    });
  }

  goToListing() {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to list');
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.LIST);
  }
  private handlePercentageValidation() {
    this.createForm.get('isPercentage')?.valueChanges.subscribe(isPercentage => {
      const valueCtrl = this.createForm.get('value');
      if (!valueCtrl) return;

      valueCtrl.clearValidators();
      if (isPercentage) {
        valueCtrl.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      } else {
        valueCtrl.setValidators([Validators.required, Validators.min(1)]);
      }
      valueCtrl.updateValueAndValidity();
    });
  }

  minDate = new Date().toISOString().split('T')[0];

  // getters
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get campusId() { return this.createForm.get('campusId'); }
  get discountTypeId() { return this.createForm.get('discountTypeId'); }
  get discountSubTypeId() { return this.createForm.get('discountSubTypeId'); }
  get value() { return this.createForm.get('value'); }
  get effectiveFrom() { return this.createForm.get('effectiveFrom'); }
  get effectiveTo() { return this.createForm.get('effectiveTo'); }
  get active() { return this.createForm.get('active'); }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }
    return '';
  }

  validationMessages = {
    campusId: { required: 'Campus is required.' },
    discountTypeId: { required: 'Concession Type is required.' },
    discountSubTypeId: { required: 'Concession Component is required.' },
    value: {
      required: 'Value is required.',
      min: 'Value must be greater than zero.',
      max: 'Percentage cannot exceed 100%.'
    },
    effectiveFrom: { required: 'Effective From date is required.' },
    effectiveTo: { required: 'Effective To date is required.' }
  };
}
