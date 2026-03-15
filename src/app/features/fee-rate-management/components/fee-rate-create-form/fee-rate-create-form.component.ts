import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, finalize, forkJoin, of } from 'rxjs';
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
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-fee-rate-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToasterComponent, LoaderComponent],
  templateUrl: './fee-rate-create-form.component.html',
  styleUrls: ['./fee-rate-create-form.component.css']
})
export class FeeRateCreateFormComponent {
  createForm!: FormGroup;
  resourceData?: FeeRateResponse;
  routedId?: string | null = null;
  isEditMode = false;

  isLoading = false;
  loadingMessage = 'Processing...';

  @ViewChild('toaster') toaster!: ToasterComponent;

  currentStep = 1;
  selectedComponent: FeeComponent | null = null;
  slabGroups: any[] = [];
  components: FeeComponent[] = [];


  academicYear: AcademicYear[] = [];
  campuses: CampusResponse[] = [];
  standardData: StandardResponse[] = [];
  feeCatalogDD: FeeCatalogResponse[] = [];
  feeCompnentDD: FeeComponent[] = [];
  refFeeCompnentDD: FeeComponent[] = [];
  selectedRefComponentIds: number[] = [];

  minDate = new Date().toISOString().split('T')[0];
  private destroy$ = new Subject<void>();
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
    , private logger: LoggerService) { }

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
    this.createForm.get('effectiveFrom')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.createForm.updateValueAndValidity({ onlySelf: false });
    });
    this.createForm.get('effectiveTo')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.createForm.updateValueAndValidity({ onlySelf: false });
    });
    LoggerUtil.groupEnd();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      fixedAmount: [null],
      percentageValue: [null],
      percentageOfComponentId: [null],
      referenceCatalogId: [null], // Added for dynamic selection
      unitPrice: [null],
      slabGroupId: [null],
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
    this.createForm.get('campusId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(campusId => {
      this.loadStandardByCampusId(campusId);
    });
  }

  onFeecatalogChange() {
    this.createForm.get('feeCatalogId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(feeCatalogId => {
      this.loadFeeComponentByFeeCatalogId(feeCatalogId);
    });

    this.createForm.get('feeComponentId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(componentId => {
      if (componentId) {
        this.selectedComponent = this.feeCompnentDD.find(c => c.id == componentId) || null;
        this.updateRuleValidators();
      }
    });

    this.createForm.get('referenceCatalogId')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(catalogId => {
      if (catalogId) {
        this.loadRefFeeComponentByCatalogId(catalogId);
      } else {
        this.refFeeCompnentDD = [];
        this.selectedRefComponentIds = [];
      }
    });
  }

  updateRuleValidators() {
    if (!this.selectedComponent) return;

    const chargeTypeCode = this.selectedComponent.chargeType?.code;

    // Clear existing values if not edit mode
    if (!this.isEditMode) {
      this.createForm.patchValue({
        fixedAmount: null,
        percentageValue: null,
        percentageOfComponentId: null,
        unitPrice: null,
        slabGroupId: null
      });
    }

    // Amount/Fixed
    if (chargeTypeCode === 'FIXED') {
      this.createForm.get('fixedAmount')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.createForm.get('fixedAmount')?.clearValidators();
    }

    // Percentage
    if (chargeTypeCode === 'PERCENTAGE') {
      this.createForm.get('percentageValue')?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      this.createForm.get('percentageOfComponentId')?.setValidators([Validators.required]);
    } else {
      this.createForm.get('percentageValue')?.clearValidators();
      this.createForm.get('percentageOfComponentId')?.clearValidators();
    }

    // Unit Price
    if (chargeTypeCode === 'PER_UNIT') {
      this.createForm.get('unitPrice')?.setValidators([Validators.required, Validators.min(0)]);
    } else {
      this.createForm.get('unitPrice')?.clearValidators();
    }

    // Slab
    if (chargeTypeCode === 'SLAB') {
      this.createForm.get('slabGroupId')?.setValidators([Validators.required]);
      this.loadSlabGroups();
    } else {
      this.createForm.get('slabGroupId')?.clearValidators();
    }

    this.createForm.get('fixedAmount')?.updateValueAndValidity();
    this.createForm.get('percentageValue')?.updateValueAndValidity();
    this.createForm.get('percentageOfComponentId')?.updateValueAndValidity();
    this.createForm.get('unitPrice')?.updateValueAndValidity();
    this.createForm.get('slabGroupId')?.updateValueAndValidity();
  }

  loadSlabGroups() {
    this.feeRateManagementService.getFeeSlabGroups().subscribe({
      next: res => this.slabGroups = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'SlabGroups', '❌ Failed to load slab groups', err)
    });
  }


  /** Load dependent dropdowns */
  private loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getStandardsByCampusId(campusId).subscribe({
      next: res => this.standardData = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'Standard', '❌ Failed to load standards', err)
    });
  }

  private loadFeeComponentByFeeCatalogId(feeCatalogId: any) {
    this.feeComponentManageService.getFeeCatalogComponentsByCatalogId(feeCatalogId).subscribe({
      next: res => this.feeCompnentDD = res.body,
      error: err => LoggerUtil.error(this.MODULE, 'FeeComponent', '❌ Failed to load components', err)
    });
  }

  private loadRefFeeComponentByCatalogId(feeCatalogId: any) {
    this.isLoading = true;
    this.feeComponentManageService.getFeeCatalogComponentsByCatalogId(feeCatalogId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => this.refFeeCompnentDD = res.body,
        error: err => LoggerUtil.error(this.MODULE, 'RefFeeComponent', '❌ Failed to load reference components', err)
      });
  }

  toggleReferenceComponent(compId: number) {
    const index = this.selectedRefComponentIds.indexOf(compId);
    if (index > -1) {
      this.selectedRefComponentIds.splice(index, 1);
    } else {
      this.selectedRefComponentIds.push(compId);
    }

    // Update the hidden form control for validation if needed,
    // or just use this array for payload
    this.createForm.get('percentageOfComponentId')?.setValue(this.selectedRefComponentIds.join(','));
  }

  isRefComponentSelected(compId: number): boolean {
    return this.selectedRefComponentIds.includes(compId);
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
    this.isLoading = true;
    this.loadingMessage = 'Fetching rule details...';

    this.feeRateManagementService.getFeeRateById(id).subscribe({
      next: res => {
        const data = res.body;
        if (!data) return;

        this.resourceData = data;
        const campusId = data.campus?.id || (data as any).campusId;
        const catalogId = data.feeComponent?.feeCatalog?.id || (data.feeComponent as any)?.feeCatalogId;

        LoggerUtil.log(this.MODULE, 'EditMode', `Syncing IDs - Campus: ${campusId}, Catalog: ${catalogId}`);

        // Define observables with fallbacks if IDs are missing
        const standardsObs = campusId ?
          this.standardManagemenetService.getStandardsByCampusId(campusId) :
          of({ body: [] });

        const componentsObs = catalogId ?
          this.feeComponentManageService.getFeeCatalogComponentsByCatalogId(catalogId) :
          of({ body: [] });

        // Load dependent data in parallel before patching
        forkJoin({
          standards: standardsObs,
          components: componentsObs
        }).pipe(finalize(() => this.isLoading = false)).subscribe({
          next: result => {
            if (result.standards) this.standardData = result.standards.body;
            if (result.components) this.feeCompnentDD = result.components.body;

            // Patch form without emitting events
            this.createForm.patchValue({
              academicYearId: data.academicYear?.id || (data as any).academicYearId,
              campusId: campusId,
              standardId: data.standard?.id || (data as any).standardId,
              feeCatalogId: catalogId,
              feeComponentId: data.feeComponent?.id || (data as any).feeComponentId,
              fixedAmount: data.fixedAmount,
              percentageValue: data.percentageValue,
              percentageOfComponentId: data.percentageOfComponent?.id || (data as any).percentageOfComponentId,
              unitPrice: data.unitPrice,
              slabGroupId: data.slabGroup?.id || (data as any).slabGroupId,
              effectiveFrom: data.effectiveFrom,
              effectiveTo: data.effectiveTo,
              active: data.active
            }, { emitEvent: false });

            this.selectedComponent = data.feeComponent || null;
            this.updateRuleValidators();
            this.isLoading = false;
          },
          error: err => {
            this.isLoading = false;
            LoggerUtil.error(this.MODULE, 'EditMode', '❌ Failed to load dependent data', err);
            this.toaster.show('Failed to load dependent dropdown data', 'error');
          }
        });
      },
      error: err => {
        this.isLoading = false;
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load fee rate details', err);
        this.toaster.show('Failed to load fee rate details', 'error');
      }
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

      // Detailed validation logging
      const invalidControls = [];
      const controls = this.createForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push({
            name,
            errors: controls[name].errors,
            value: controls[name].value
          });
        }
      }

      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', {
        formErrors: this.createForm.errors,
        invalidControls: invalidControls
      });
      return;
    }

    const formValue = this.createForm.getRawValue();
    const payload: any = {
      academicYearId: formValue.academicYearId,
      campusId: formValue.campusId,
      standardId: formValue.standardId,
      feeComponentId: formValue.feeComponentId,
      chargeTypeId: this.selectedComponent?.chargeType?.id,
      effectiveFrom: formValue.effectiveFrom,
      effectiveTo: formValue.effectiveTo,
      active: formValue.active,
      fixedAmount: formValue.fixedAmount,
      percentageValue: formValue.percentageValue,
      percentageOfComponentId: formValue.percentageOfComponentId,
      unitPrice: formValue.unitPrice,
      slabGroupId: formValue.slabGroupId
    };

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating pricing rule...' : 'Saving pricing rule...';

    this.feeRateManagementService.saveFeeRate(this.routedId ?? null, payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toaster.show(this.isEditMode ? 'Pricing rule updated successfully' : 'Pricing rule created successfully', 'success');
          setTimeout(() => this.router.navigate(ROUTES.FEE.FEE_RATE.LIST), 1500);
        },
        error: err => {
          LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', err);
          this.toaster.show('Failed to save pricing rule', 'error');
        }
      });
  }


  /** Getters for template */
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get campusId() { return this.createForm.get('campusId'); }
  get standardId() { return this.createForm.get('standardId'); }
  get feeCatalogId() { return this.createForm.get('feeCatalogId'); }
  get feeComponentId() { return this.createForm.get('feeComponentId'); }
  get fixedAmount() { return this.createForm.get('fixedAmount'); }
  get percentageValue() { return this.createForm.get('percentageValue'); }
  get percentageOfComponentId() { return this.createForm.get('percentageOfComponentId'); }
  get unitPrice() { return this.createForm.get('unitPrice'); }
  get slabGroupId() { return this.createForm.get('slabGroupId'); }
  get effectiveFrom() { return this.createForm.get('effectiveFrom'); }
  get effectiveTo() { return this.createForm.get('effectiveTo'); }
  get active() { return this.createForm.get('active'); }

  /** Getters for Resolve Names in Preview */
  get selectedCampusName(): string {
    const id = this.createForm.get('campusId')?.value;
    if (!id) return 'Global Coverage';
    return this.campuses.find(c => c.id == id)?.campusName || id;
  }

  get selectedStandardName(): string {
    const id = this.createForm.get('standardId')?.value;
    if (!id) return 'All Grades';
    return this.standardData.find(s => s.id == id)?.standardName || id;
  }

  get selectedAcademicYearName(): string {
    const id = this.createForm.get('academicYearId')?.value;
    if (!id) return 'FY 2026-27';
    return this.academicYear.find(ay => ay.id == id)?.name || 'FY 2026-27';
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.feeCatalogId?.valid && this.feeComponentId?.valid) {
        this.currentStep = 2;
      } else {
        this.feeCatalogId?.markAsTouched();
        this.feeComponentId?.markAsTouched();
      }
    } else if (this.currentStep === 2) {
      const chargeType = this.selectedComponent?.chargeType?.code;
      let isValid = false;
      if (chargeType === 'FIXED') isValid = !!this.fixedAmount?.valid;
      else if (chargeType === 'PERCENTAGE') isValid = !!this.percentageValue?.valid && !!this.percentageOfComponentId?.valid;
      else if (chargeType === 'PER_UNIT') isValid = !!this.unitPrice?.valid;
      else if (chargeType === 'SLAB') isValid = !!this.slabGroupId?.valid;
      else isValid = true; // Conditional

      if (isValid) {
        this.currentStep = 3;
      } else {
        this.createForm.markAllAsTouched();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  goToFeeRateListing() {
    this.router.navigate(ROUTES.FEE.FEE_RATE.LIST);
  }


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
