import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { FeeCatalogComponentManagementService } from '../../../fee-catalog-component-management/services/fee-catalog-component-management.service';
import { FeeRateManagementService } from '../../services/fee-rate-management.service';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { FeeRateResponse, AcademicYear, FeeComponent } from '../../models/FeeRateResponse';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-fee-rate-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './fee-rate-create-form.component.html',
  styleUrls: ['./fee-rate-create-form.component.css']
})
export class FeeRateCreateFormComponent {
  createForm!: FormGroup;
  resourceData?: FeeRateResponse;
  routedId?: string | null = null;
  isEditMode = false;

  academicYear: AcademicYear[] = [];
  campuses: CampusResponse[] = [];
  standardData: StandardResponse[] = [];
  feeCatalogDD: FeeCatalogResponse[] = [];
  feeCompnentDD: FeeComponent[] = [];

  minDate = new Date().toISOString().split('T')[0];
  private readonly MODULE = 'FeeRate';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private academicYearManagementService: AcademicYearManagementService,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeComponentManageService: FeeCatalogComponentManagementService,
    private feeRateManagementService: FeeRateManagementService
  , private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.initializeForm();
    this.loadDropdownData();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode && this.routedId) {
      this.getFeeRateDetails(this.routedId);
    }

    this.onCampusChange();
    this.onFeecatalogChange();

    // Re-validate date range on change
    this.createForm.get('effectiveFrom')?.valueChanges.subscribe(() => {
      this.createForm.updateValueAndValidity({ onlySelf: false });
    });
    this.createForm.get('effectiveTo')?.valueChanges.subscribe(() => {
      this.createForm.updateValueAndValidity({ onlySelf: false });
    });
    LoggerUtil.groupEnd();
  }

  /** Initialize Reactive Form */
  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createForm = this.fb.group({
      academicYearId: ['', Validators.required],
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      feeCatalogId: ['', Validators.required],
      feeComponentId: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]], // ✅ Only amount, no percentage
      effectiveFrom: [null, Validators.required],
      effectiveTo: [null, Validators.required],
      active: [true]
    }, {
      validators: this.dateRangeValidator('effectiveFrom', 'effectiveTo')
    });
    LoggerUtil.groupEnd();
  }

  /** Load dropdown data: academic years, campuses, fee catalogs */
  private loadDropdownData() {
    this.getAcademicYears();
    this.getCampuses();
    this.getFeeCatalogs();
  }

  /** Dropdown change handlers */
  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      this.loadStandardByCampusId(campusId);
    });
  }

  onFeecatalogChange() {
    this.createForm.get('feeCatalogId')?.valueChanges.subscribe(feeCatalogId => {
      this.loadFeeComponentByFeeCatalogId(feeCatalogId);
    });
  }

  /** Load dependent dropdowns */
  private loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: res => this.standardData = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'Standard', '❌ Failed to load standards', err)
    });
  }

  private loadFeeComponentByFeeCatalogId(feeCatalogId: any) {
    this.feeComponentManageService.getByFeeCatalogId(feeCatalogId).subscribe({
      next: res => this.feeCompnentDD = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'FeeComponent', '❌ Failed to load components', err)
    });
  }

  /** Fetch dropdown options */
  getAcademicYears() {
    this.academicYearManagementService.getAcademicYears().subscribe({
      next: res => this.academicYear = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'AcademicYear', '❌ Failed to load academic years', err)
    });
  }

  getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: res => this.campuses = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'Campus', '❌ Failed to load campuses', err)
    });
  }

  getFeeCatalogs() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: res => this.feeCatalogDD = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'FeeCatalog', '❌ Failed to load fee catalogs', err)
    });
  }

  /** Load existing fee rate for edit mode */
  private getFeeRateDetails(id: string) {
    this.feeRateManagementService.getFeeRateById(id).subscribe({
      next: res => {
        this.resourceData = res.body;
        this.createForm.patchValue({
          academicYearId: this.resourceData?.academicYear.id,
          campusId: this.resourceData?.campus.id,
          standardId: this.resourceData?.standard.id,
          feeCatalogId: this.resourceData?.feeComponent.feeCatalog.id,
          feeComponentId: this.resourceData?.feeComponent.id,
          amount: this.resourceData?.amount, // ✅ amount only
          effectiveFrom: this.resourceData?.effectiveFrom,
          effectiveTo: this.resourceData?.effectiveTo,
          active: this.resourceData?.active
        });
      },
      error: err => LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load fee rate details', err)
    });
  }

  /** Date range validator */
  dateRangeValidator(fromKey: string, toKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fromControl = group.get(fromKey);
      const toControl = group.get(toKey);
      if (!fromControl || !toControl) return null;

      const from = fromControl.value;
      const to = toControl.value;

      if (!from || !to) return null;

      if (new Date(to) < new Date(from)) {
        toControl.setErrors({ ...toControl.errors, invalidDateRange: true });
        return { invalidDateRange: true };
      }

      if (toControl.errors?.['invalidDateRange']) {
        const { invalidDateRange, ...rest } = toControl.errors;
        toControl.setErrors(Object.keys(rest).length ? rest : null);
      }

      return null;
    };
  }

  /** Submit form */
  onSubmit() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createForm.errors);
      return;
    }

    this.feeRateManagementService.saveFeeRate(this.routedId ?? null, this.createForm.getRawValue()).subscribe({
      next: () => this.router.navigate(ROUTES.FEE.FEE_RATE.LIST),
      error: err => LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', err)
    });
  }

  /** Navigation */
  goToFeeRateListing() {
    this.router.navigate(ROUTES.FEE.FEE_RATE.LIST);
  }

  /** Getters for template */
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get feeCatalogId() { return this.createForm.get('feeCatalogId'); }
  get feeComponentId() { return this.createForm.get('feeComponentId'); }
  get amount() { return this.createForm.get('amount'); }
  get effectiveFrom() { return this.createForm.get('effectiveFrom'); }
  get effectiveTo() { return this.createForm.get('effectiveTo'); }
  get active() { return this.createForm.get('active'); }

  /** Validation messages */
  validationMessages: Record<string, any> = {
    academicYearId: { required: 'Academic Year is required.' },
    campusId: { required: 'Campus is required.' },
    standardId: { required: 'Standard is required.' },
    feeCatalogId: { required: 'Fee Catalog is required.' },
    feeComponentId: { required: 'Fee Component is required.' },
    amount: { required: 'Amount is required.', min: 'Amount must be greater than zero.' },
    effectiveFrom: { required: 'Effective From date is required.' },
    effectiveTo: { required: 'Effective To date is required.', invalidDateRange: 'Effective To cannot be before Effective From.' }
  };

  getErrorMessage(controlName: string): string {
    const control = this.createForm.get(controlName);
    if (!control || !control.errors) return '';
    for (const errorKey in control.errors) {
      if (this.validationMessages[controlName]?.[errorKey]) {
        return this.validationMessages[controlName][errorKey];
      }
    }
    return '';
  }
}
