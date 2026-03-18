import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionComponentManagementService } from '../../../concession-component-management/services/concession-component-management.service';
import { ConcessionComponentResponse } from '../../../concession-component-management/models/ConcessionComponentResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-concession-rate-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './concession-rate-create-form.component.html',
  styleUrls: ['./concession-rate-create-form.component.css']
})
export class ConcessionRateCreateFormComponent implements OnInit {
  isLoading = false;
  loadingMessage = '';
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  academicYear: AcademicYearResponse | null = null;
  createForm!: FormGroup;
  routedId: string | null = null;
  isEditMode: boolean = false;

  concessionComponentDD: ConcessionComponentResponse[] = [];
  campuseDD: CampusResponse[] = [];
  concessionTypeDD: ConcessionResponse[] = [];

  private readonly MODULE = 'ConcessionRate';
  private readonly COMPONENT = 'CreateForm';

  constructor(
    private campusManagementService: CampusManagementService,
    private concessionManagementService: ConcessionManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionRateManagementService: ConcessionRateManagementService,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.academicYear = this.configService.getAcademicYear();
    this.initializeForm();
    this.handlePercentageValidation();
    
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.loadDropdowns();
    this.onConcessionTypeChange();
    LoggerUtil.groupEnd();
  }

  private initializeForm() {
    this.createForm = this.fb.group({
      academicYearId: [this.academicYear?.id, Validators.required],
      academicYearName: [this.academicYear?.name],
      discountTypeId: ['', Validators.required],
      discountSubTypeId: ['', Validators.required],
      campusId: [''],
      isPercentage: [{ value: false, disabled: true }],
      value: [0, [Validators.required, Validators.min(0)]],
      effectiveFrom: [{ value: null, disabled: false }, Validators.required],
      effectiveTo: [{ value: null, disabled: false }, Validators.required],
      isActive: [true]
    });
    this.setAcademicYearDates(this.academicYear);
  }

  private setAcademicYearDates(academicYear: AcademicYearResponse | null) {
    if (!academicYear) return;
    this.createForm.patchValue({
      effectiveFrom: academicYear.startDate,
      effectiveTo: academicYear.endDate
    });
  }

  private loadDropdowns() {
    this.isLoading = true;
    this.loadingMessage = 'Loading Options...';
    
    // Load Campuses
    this.campusManagementService.getAllCampuses().subscribe({
      next: (res) => this.campuseDD = res.body || [],
      error: (err) => LoggerUtil.error(this.MODULE, 'Campus', '❌ Failed to load campuses', err)
    });

    // Load Concession Types
    this.concessionManagementService.getActiveConcessions().subscribe({
      next: (res) => {
        this.concessionTypeDD = res.body || [];
      },
      error: (err) => {
        LoggerUtil.error(this.MODULE, 'ConcessionType', '❌ Failed to load concession types', err);
      },
      complete: () => {
        this.isLoading = false;
        
        if (this.isEditMode && this.routedId) {
          this.getConcessionRateDetails(this.routedId);
        }
      }
    });
  }

  onConcessionTypeChange() {
    this.createForm.get('discountTypeId')?.valueChanges.subscribe(discountTypeId => {
      if (!discountTypeId) {
        this.concessionComponentDD = [];
        this.createForm.get('discountSubTypeId')?.setValue('');
        return;
      }
      
      const selectedConcession = this.concessionTypeDD.find((c: any) => c.id == discountTypeId);
      if (selectedConcession) {
        this.createForm.patchValue({ isPercentage: selectedConcession.chargeType?.code === 'PERCENTAGE' }, { emitEvent: true });
      }
      this.loadComponentsByConcessionId(discountTypeId);
    });
  }

  private loadComponentsByConcessionId(concessionTypeId: any, callback?: () => void) {
    this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
      next: (res) => {
        this.concessionComponentDD = res.body || [];
        if (callback) callback();
      },
      error: (err) => LoggerUtil.error(this.MODULE, 'ConcessionComponent', '❌ Failed to load components', err)
    });
  }

  getConcessionRateDetails(routedId: string | number) {
    this.isLoading = true;
    this.loadingMessage = 'Loading details...';
    this.concessionRateManagementService.getConcessionRateById(routedId).subscribe({
      next: (res) => {
        const resourceData = res.body;
        const discountTypeId = resourceData?.discountSubType?.discountType?.id;
        
        this.createForm.patchValue({
          academicYearId: resourceData?.academicYear?.id,
          academicYearName: resourceData?.academicYear?.name,
          campusId: resourceData?.campus?.id || '',
          discountTypeId: discountTypeId,
          value: resourceData?.value,
          isPercentage: resourceData?.isPercentage,
          effectiveFrom: resourceData?.effectiveFrom,
          effectiveTo: resourceData?.effectiveTo,
          isActive: resourceData?.isActive
        }, { emitEvent: false });

        if (discountTypeId) {
          this.loadComponentsByConcessionId(discountTypeId, () => {
             this.createForm.patchValue({ discountSubTypeId: resourceData?.discountSubType?.id }, { emitEvent: false });
             this.isLoading = false;
          });
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load rate', err);
        this.toaster?.show('Failed to load rate details', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const formValue = this.createForm.getRawValue();
    const payload = {
      discountSubTypeId: Number(formValue.discountSubTypeId),
      campusId: formValue.campusId ? Number(formValue.campusId) : null,
      academicYearId: formValue.academicYearId ? Number(formValue.academicYearId) : null,
      value: Number(formValue.value),
      isPercentage: formValue.isPercentage,
      effectiveFrom: formValue.effectiveFrom,
      effectiveTo: formValue.effectiveTo,
      isActive: formValue.isActive
    };

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating Concession Rate...' : 'Adding Concession Rate...';
    
    this.concessionRateManagementService.saveConcessionRate(this.routedId, payload).subscribe({
      next: (res) => {
        const message = res?.body?.message || (this.isEditMode ? 'Updated successfully' : 'Created successfully');
        this.toaster?.show(message, 'success');
        setTimeout(() => this.goToListing(), 1500);
      },
      error: (err) => {
        LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', err);
        this.toaster?.show('Failed to save Concession Rate', 'error');
        this.isLoading = false;
      }
    });
  }

  goToListing(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.LIST);
  }

  private handlePercentageValidation() {
    const valueCtrl = this.createForm.get('value');
    const isPercentageCtrl = this.createForm.get('isPercentage');
    if (!valueCtrl || !isPercentageCtrl) return;

    const updateValidators = () => {
      valueCtrl.clearValidators();
      if (isPercentageCtrl.value) {
        valueCtrl.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      } else {
        valueCtrl.setValidators([Validators.required, Validators.min(1)]);
      }
      valueCtrl.updateValueAndValidity();
    };
    updateValidators();
    isPercentageCtrl.valueChanges.subscribe(() => updateValidators());
  }

  // getters
  get academicYearId() { return this.createForm.get('academicYearId'); }
  get campusId() { return this.createForm.get('campusId'); }
  get discountTypeId() { return this.createForm.get('discountTypeId'); }
  get discountSubTypeId() { return this.createForm.get('discountSubTypeId'); }
  get value() { return this.createForm.get('value'); }
  get effectiveFrom() { return this.createForm.get('effectiveFrom'); }
  get effectiveTo() { return this.createForm.get('effectiveTo'); }
  get isActive() { return this.createForm.get('isActive'); }

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
    value: { required: 'Value is required.', min: 'Value must be greater than zero.', max: 'Percentage cannot exceed 100%.' },
    effectiveFrom: { required: 'Effective From date is required.' },
    effectiveTo: { required: 'Effective To date is required.' }
  };
}
