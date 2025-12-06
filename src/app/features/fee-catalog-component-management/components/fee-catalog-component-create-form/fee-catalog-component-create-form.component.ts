import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { FeeCatalogComponentResponse } from '../../models/FeeCatalogComponentResponse';
import { SectionManagementService } from '../../../section-management/services/section-management.service';




@Component({
  selector: 'app-fee-catalog-component-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './fee-catalog-component-create-form.component.html',
  styleUrls: ['./fee-catalog-component-create-form.component.css']
})
export class FeeCatalogComponentCreateFormComponent {
  createFeeCatalogComponentForm!: FormGroup;
  routeSectionId?: string;
  URL = '';
  mode = '';
  standardData: StandardResponse[]=[];
  feeCatalogComponentData?: FeeCatalogComponentResponse;
  campuses: CampusResponse[] = [];
  cities: any[] = [];
  sectionId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private sectionManagementService: SectionManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    this.getCampuses();
    this.initializeForm();
    this.sectionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.sectionId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.sectionId);
      this.getSectionDetails(this.sectionId!);
    } else {
      console.log('Create Mode Activated');
    }
    this.onCampusChange();
  }

  onCampusChange() {
    this.createFeeCatalogComponentForm.get('campusId')?.valueChanges.subscribe(campusId => {
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
  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId)
      .subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.feeCatalogComponentData = response.body;
          console.log('📦 Standard data :', this.feeCatalogComponentData);
          // this.createFeeCatalogComponentForm.patchValue({
          //   sectionName: this.feeCatalogComponentData?.sectionName,
          //   sectionCode: this.feeCatalogComponentData?.sectionCode,
          //   description: this.feeCatalogComponentData?.description,
          //   campusId: this.feeCatalogComponentData?.standard.campus.id,
          //   standardId : this.feeCatalogComponentData?.standard.id
          // });
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
    this.createFeeCatalogComponentForm = this.fb.group({
      sectionName: ['', Validators.required],
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionCode: [''],
      description: [''],
    });
  }

  goToSectionsList(): void {
    this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createFeeCatalogComponentForm.getRawValue());
    if (this.createFeeCatalogComponentForm.invalid) {
      this.createFeeCatalogComponentForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.sectionManagementService.saveSection(this.sectionId, this.createFeeCatalogComponentForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
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

  //getters
  get sectionName() {
    return this.createFeeCatalogComponentForm.get('sectionName');
  }

  get campusId() {
    return this.createFeeCatalogComponentForm.get('campusId');
  }

  get standardId() {
    return this.createFeeCatalogComponentForm.get('standardId');
  }

  get sectionCode() {
    return this.createFeeCatalogComponentForm.get('sectionCode');
  }

  get description() {
    return this.createFeeCatalogComponentForm.get('description');
  }
}
