import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { FeeRateResponse, FeeComponent } from '../../../fee-rate-management/models/FeeRateResponse';
import { FeeRateManagementService } from '../../../fee-rate-management/services/fee-rate-management.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { AcademicYearResponse } from '../../../tenant-management/models/AcademicYearResponse';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionComponentManagementService } from '../../../concession-component-management/services/concession-component-management.service';
import { ConcessionComponentResponse } from '../../../concession-component-management/models/ConcessionComponentResponse';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';
import { ConcessionRateResponse } from '../../models/ConcessionRateResponse';


@Component({
  selector: 'app-concession-rate-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './concession-rate-create-form.component.html',
  styleUrls: ['./concession-rate-create-form.component.css']
})
export class ConcessionRateCreateFormComponent {
  academicYear: AcademicYearResponse | null = null;
  createForm!: FormGroup;
  resourceData?: ConcessionRateResponse
  routedId?: string | null = null;
  concessionComponentDD: ConcessionComponentResponse[] = [];
  campuseDD: CampusResponse[] = [];
  isEditMode: boolean = false;
  concessionTypeDD: ConcessionResponse[] = [];
  feeCompnentDD: FeeComponent[] = [];

  constructor(
    private campusManagementService: CampusManagementService,
    private concessionManagementService: ConcessionManagementService,
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private concessionRateManagementService: ConcessionRateManagementService,
    private feeRateManagementService: FeeRateManagementService,
    private configService: AppConfigService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.academicYear = this.configService.getAcademicYear();

    this.getCampuses();
    this.getDiscountTypes();

    this.initializeForm();
    this.handlePercentageValidation();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getConcessionRateDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
    this.onConcessionTypeChange();

  }


  getDiscountTypes() {
    this.concessionManagementService.getAllConcessions().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionTypeDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }


  onConcessionTypeChange() {
    this.createForm.get('discountTypeId')?.valueChanges.subscribe(discountTypeId => {
      console.log("Discount changed:", discountTypeId);
      this.loadComponentsByConcessionId(discountTypeId);
    });
  }
  loadComponentsByConcessionId(concessionTypeId: any) {
    this.concessionComponentManagementService.getConcessionComponentsByTypeId(concessionTypeId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.concessionComponentDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  private initializeForm() {
    this.createForm = this.fb.group({
      academicYearId: [this.academicYear?.id, [Validators.required]],
      academicYearName: [this.academicYear?.name, [Validators.required]],
      discountTypeId: ['', [Validators.required]],
      discountSubTypeId: ['', [Validators.required]],
      campusId: ['', [Validators.required]],
      isPercentage: [false, [Validators.required]],
      value: [0, [Validators.required, Validators.min(0)]],
      effectiveFrom: [null, [Validators.required]],
      effectiveTo: [null, [Validators.required]],
      active: [true]
    });
  }


  getConcessionRateDetails(routedId: string): void {
    this.concessionRateManagementService.getConcessionRateById(routedId)
      .subscribe({
        next: (response) => {
          console.log('Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.resourceData = response.body;
          console.log('📦 Request data :', this.resourceData);
          this.createForm.patchValue({
            academicYearId: this.resourceData?.academicYearId,
            campusId: this.resourceData?.campusId,
            discountTypeId: this.resourceData?.discountSubType.discountType.id,
            discountSubTypeId: this.resourceData?.discountSubType.id,
            value: this.resourceData?.value,
            isPercentage: this.resourceData?.isPercentage,
            effectiveFrom: this.resourceData?.effectiveFrom,
            effectiveTo: this.resourceData?.effectiveTo,
            active: this.active
          });
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

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuseDD = response.body;
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



  goToListing(): void {
    this.router.navigate(ROUTES.CONCESSION.CONCESSION_RATE.LIST);
  }
  onSubmit(): void {
    console.log('  Create standard Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.feeRateManagementService.saveFeeRate(this.routedId ?? null, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.FEE.FEE_RATE.LIST);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }



  minDate = new Date().toISOString().split('T')[0]; // Prevent past dates
  //getters
  get academicYearId() {
    return this.createForm.get('academicYearId');
  }
  get campusId() {
    return this.createForm.get('campusId');
  }

  get standardId() {
    return this.createForm.get('standardId');
  }

  get discountTypeId() {
    return this.createForm.get('discountTypeId');
  }

  get discountSubTypeId() {
    return this.createForm.get('discountSubTypeId');
  }

  get value() {
    return this.createForm.get('value');
  }
  get effectiveFrom() {
    return this.createForm.get('effectiveFrom');
  }

  get effectiveTo() {
    return this.createForm.get('effectiveTo');
  }
  get active() {
    return this.createForm.get('active');
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) {
        return this.validationMessages[controlName][key];
      }
    }

    return '';
  }

  private dateRangeValidator(form: AbstractControl) {
    const from = form.get('effectiveFrom')?.value;
    const to = form.get('effectiveTo')?.value;

    if (from && to && new Date(to) < new Date(from)) {
      return { invalidDateRange: true };
    }
    return null;
  }
  private handlePercentageValidation() {
    this.createForm.get('isPercentage')?.valueChanges.subscribe(isPercentage => {
      const valueCtrl = this.createForm.get('value');
      if (!valueCtrl) return;

      valueCtrl.clearValidators();

      if (isPercentage) {
        valueCtrl.setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]);
      } else {
        valueCtrl.setValidators([
          Validators.required,
          Validators.min(1)
        ]);
      }

      valueCtrl.updateValueAndValidity();
    });
  }

  validationMessages = {
    campusId: {
      required: 'Campus is required.'
    },
    discountTypeId: {
      required: 'Concession Type is required.'
    },
    discountSubTypeId: {
      required: 'Concession Component is required.'
    },
    value: {
      required: 'Value is required.',
      min: 'Value must be greater than zero.',
      max: 'Percentage cannot exceed 100%.'
    },
    effectiveFrom: {
      required: 'Effective From date is required.'
    },
    effectiveTo: {
      required: 'Effective To date is required.'
    }
  };


}