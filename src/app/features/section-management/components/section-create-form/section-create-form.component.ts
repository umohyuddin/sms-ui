import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementModule } from '../../section-management-module';
import { SectionManagementService } from '../../services/section-management.service';
import { SectionResponse } from '../../models/SectionResponse';



@Component({
  selector: 'app-section-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './section-create-form.component.html',
  styleUrls: ['./section-create-form.component.css']
})
export class SectionCreateFormComponent {
  createSectionForm!: FormGroup;
  routeSectionId?: string;
  URL = '';
  mode = '';
  standardData?: StandardResponse;
    sectionData?: SectionResponse;
  campuses: CampusResponse[] = [];
  cities: any[] = [];
  standardId: string | null = null;
  isEditMode: boolean = false;
  sectionId: string | null = null;

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
  }

  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId)
      .subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.sectionData = response.body;
          console.log('📦 Standard data :', this.sectionData);
          this.createSectionForm.patchValue({
            standardName: this.sectionData?.standardName,
            standardCode: this.sectionData?.standardCode,
            description: this.sectionData?.description,
            campusId: this.sectionData?.campus?.id
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
    this.createSectionForm = this.fb.group({
      standardName: ['', Validators.required],
      standardCode: [''],
      description: [''],
      campusId: ['', Validators.required]
    });
  }

  goTostandardList(): void {
    this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createSectionForm.getRawValue());
    if (this.createSectionForm.invalid) {
      this.createSectionForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.sectionManagementService.saveSection(this.standardId, this.createSectionForm.getRawValue()).subscribe({
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
  get standardName() {
    return this.createSectionForm.get('standardName');
  }

  get standardCode() {
    return this.createSectionForm.get('standardCode');
  }

  get description() {
    return this.createSectionForm.get('description');
  }

  get campusId() {
    return this.createSectionForm.get('campusId');
  }
}
