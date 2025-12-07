import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { AcademicYear, FeeComponent, FeeRateResponse as resoruceResponse } from '../../models/FeeRateResponse';
import { SectionManagementService } from '../../../section-management/services/section-management.service';
import { AcademicYearManagementService } from '../../../tenant-management/services/academic-year-management.service';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { FeeCatalogComponentManagementService } from '../../../fee-catalog-component-management/services/fee-catalog-component-management.service';




@Component({
  selector: 'app-fee-rate-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './fee-rate-create-form.component.html',
  styleUrls: ['./fee-rate-create-form.component.css']
})
export class FeeRateCreateFormComponent {
  createForm!: FormGroup;
  routedId?: string | null = null;
  mode = '';
  standardData: StandardResponse[] = [];
  feeCatalogComponentData?: resoruceResponse;
  campuses: CampusResponse[] = [];
  cities: any[] = [];
  sectionId: string | null = null;
  isEditMode: boolean = false;
  academicYear: AcademicYear[] = [];
  feeCatalogDD: FeeCatalogResponse[] = [];
  feeCompnentDD: FeeComponent []= [];

  constructor(
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private sectionManagementService: SectionManagementService,
    private academicYearManagementService: AcademicYearManagementService,
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeComponentManageService: FeeCatalogComponentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getAcademicYears();
    this.getCampuses();
    this.getFeeCatalogs();
    this.initializeForm();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.sectionId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.sectionId);
      //this.getFeeRateDetails(this.sectionId!);
    } else {
      console.log('Create Mode Activated');
    }
    this.onCampusChange();
    this.onFeecatalogChange();
  }
  onFeecatalogChange() {
    this.createForm.get('feeCatalogId')?.valueChanges.subscribe(feeCatalogId => {
      console.log("Campus changed:", feeCatalogId);

      // Example: Load cities based on province
      this.loadFeeComponentByFeeCatalogId(feeCatalogId);
    });
  }
  loadFeeComponentByFeeCatalogId(feeCatalogId: any) {
 this.feeComponentManageService.getByFeeCatalogId(feeCatalogId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCompnentDD = response.body;
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
  getFeeCatalogs() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogDD = response.body;
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
  getAcademicYears() {
    this.academicYearManagementService.getAcademicYears().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.academicYear = response.body;
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

  onCampusChange() {
    this.createForm.get('campusId')?.valueChanges.subscribe(campusId => {
      console.log("Campus changed:", campusId);

      // Example: Load cities based on province
      this.loadStandardByCampusId(campusId);
    });
  }
  loadStandardByCampusId(campusId: any) {
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardData = response.body;
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
  // getSectionDetails(sectionId: string): void {
  //   this.sectionManagementService.getSectionById(sectionId)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('✅ Request Success Status:', response.status);
  //         console.log('📦 Response Body:', response.body);
  //         this.feeCatalogComponentData = response.body;
  //         console.log('📦 Standard data :', this.feeCatalogComponentData);
  //         // this.createFeeCatalogComponentForm.patchValue({
  //         //   sectionName: this.feeCatalogComponentData?.sectionName,
  //         //   sectionCode: this.feeCatalogComponentData?.sectionCode,
  //         //   description: this.feeCatalogComponentData?.description,
  //         //   campusId: this.feeCatalogComponentData?.standard.campus.id,
  //         //   standardId : this.feeCatalogComponentData?.standard.id
  //         // });
  //       },
  //       error: (error) => {
  //         console.error('❌ Request Error Status:', error.status);
  //         console.error('Message:', error.message);
  //       },
  //       complete: () => {
  //         console.log('🔚 Request Complete');
  //       }
  //     })
  // }

  private getCampuses() {
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.campuses = response.body;
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

  private initializeForm() {
    this.createForm = this.fb.group({
      academicYearId: ['', Validators.required],
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      feeCatalogId: ['', Validators.required],
      feeCatalogComponentId: ['', Validators.required]
    });
  }

  goToFeeRateListing(): void {
    this.router.navigate(ROUTES.FEE.FEE_RATE.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.sectionManagementService.saveSection(this.sectionId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
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

  // //getters
  // get sectionName() {
  //   return this.createFeeCatalogComponentForm.get('sectionName');
  // }

  get academicYearId() {
    return this.createForm.get('academicYearId');
  }
  get campusId() {
    return this.createForm.get('campusId');
  }

  get standardId() {
    return this.createForm.get('standardId');
  }

  get feeCatalogId() {
    return this.createForm.get('feeCatalogId');
  }

  get feeCatalogComponentId(){
    return this.createForm.get('feeCatalogComponentId');
  }
  // get sectionCode() {
  //   return this.createFeeCatalogComponentForm.get('sectionCode');
  // }

  // get description() {
  //   return this.createFeeCatalogComponentForm.get('description');
  // }
}
