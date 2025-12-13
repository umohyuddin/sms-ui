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
  standardData: StandardResponse[] = [];
  sectionData?: SectionResponse;
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
    private router: Router) { }

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
    this.createSectionForm.get('campusId')?.valueChanges.subscribe(campusId => {
      console.log("Campus changed:", campusId);
      this.loadStandardByCampusId(campusId);
    });
  }
  loadStandardByCampusId(campusId: any) {
    this.createSectionForm.get('standardId')?.setValue('')
    this.standardManagemenetService.getCampusById(campusId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.standardData = response.body;
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
  getSectionDetails(sectionId: string): void {
    this.sectionManagementService.getSectionById(sectionId)
      .subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.sectionData = response.body;
          console.log('📦 Standard data :', this.sectionData);
          this.createSectionForm.patchValue({
            sectionName: this.sectionData?.sectionName,
            sectionCode: this.sectionData?.sectionCode,
            description: this.sectionData?.description,
            campusId: this.sectionData?.standard.campus.id,
            standardId: this.sectionData?.standard.id
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
      sectionName: ['', [Validators.required, Validators.maxLength(50)]],
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionCode: ['', [Validators.maxLength(15)]],
      description: ['', Validators.maxLength(500)],
    });
  }

  goToSectionsList(): void {
    this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createSectionForm.getRawValue());
    if (this.createSectionForm.invalid) {
      this.createSectionForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.sectionManagementService.saveSection(this.sectionId, this.createSectionForm.getRawValue()).subscribe({
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
    return this.createSectionForm.get('sectionName');
  }

  get campusId() {
    return this.createSectionForm.get('campusId');
  }

  get standardId() {
    return this.createSectionForm.get('standardId');
  }

  get sectionCode() {
    return this.createSectionForm.get('sectionCode');
  }

  get description() {
    return this.createSectionForm.get('description');
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createSectionForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) {
        return this.validationMessages[controlName][key];
      }
    }

    return '';
  }


  validationMessages = {
    campusId: {
      required: 'Campus is required.'
    },
    standardId: {
      required: 'Standard is required.'
    },
    sectionName: {
      required: 'Section Name is required.',
      maxlength: 'Section Name cannot exceed 50 characters.',
      whitespace: 'Section Name cannot be empty or whitespace only.'
    },
    sectionCode: {
      maxlength: 'Section Code cannot exceed 15 characters.',
      whitespace: 'Section Code cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.'
    }
  };
}
