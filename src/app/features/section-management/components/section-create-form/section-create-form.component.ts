import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { StandardResponse } from '../../../standard-management/models/standardResponse';
import { StandardManagementService } from '../../../standard-management/services/standard-management.service';
import { SectionManagementService } from '../../services/section-management.service';
import { SectionResponse } from '../../models/SectionResponse';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-section-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToasterComponent, LoaderComponent],
  templateUrl: './section-create-form.component.html',
  styleUrls: ['./section-create-form.component.css']
})
export class SectionCreateFormComponent {
  createSectionForm!: FormGroup;
  sectionId: string | null = null;
  isEditMode = false;
  campuses: CampusResponse[] = [];
  standardData: StandardResponse[] = [];
  sectionData?: SectionResponse;

  private readonly MODULE = 'Section';
  private readonly COMPONENT = 'SectionForm';

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  isLoading: boolean = false;
  loadingMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private campusManagementService: CampusManagementService,
    private standardManagemenetService: StandardManagementService,
    private sectionManagementService: SectionManagementService
    , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    this.sectionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.sectionId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, 'Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    this.initializeForm();
    this.getCampuses();

    if (this.isEditMode && this.sectionId) {
      LoggerUtil.log(this.MODULE, this.COMPONENT, 'Edit Mode: Loading section details for', this.sectionId);
      this.getSectionDetails(this.sectionId);
    }

    this.onCampusChange();
    LoggerUtil.groupEnd();
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createSectionForm = this.fb.group({
      sectionName: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      campusId: ['', Validators.required],
      standardId: ['', Validators.required],
      sectionCode: ['', [Validators.maxLength(15), this.noWhitespaceValidator]],
      description: ['', Validators.maxLength(500)]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized', this.createSectionForm.value);
    LoggerUtil.groupEnd();
  }

  onCampusChange() {
    LoggerUtil.group(`🌐 [${this.MODULE}] Campus Change Subscription`);
    this.createSectionForm.get('campusId')?.valueChanges.subscribe(campusId => {
      LoggerUtil.log(this.MODULE, 'Campus', 'Campus changed', campusId);
      this.createSectionForm.get('standardId')?.reset('');
      this.loadStandardByCampusId(campusId);
    });
    LoggerUtil.groupEnd();
  }

  private loadStandardByCampusId(campusId: any) {
    if (!campusId) return;

    LoggerUtil.group(`📦 [${this.MODULE}] Load Standards`);
    this.isLoading = true;
    this.loadingMessage = 'Loading standards...';
    this.standardManagemenetService.getStandardsByCampusId(campusId).subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Standards', '✅ Standards loaded', response.body);
        this.standardData = response.body;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Standards', '❌ Failed to load standards', error);
        this.toaster?.show('Failed to load standards.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        LoggerUtil.groupEnd();
      }
    });
  }

  private getCampuses() {
    LoggerUtil.group(`🏫 [${this.MODULE}] Load Campuses`);
    this.isLoading = true;
    this.loadingMessage = 'Loading campuses...';
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Campuses', '✅ Campuses loaded', response.body);
        this.campuses = response.body;
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Campuses', '❌ Failed to load campuses', error);
        this.toaster?.show('Failed to load campuses.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        LoggerUtil.groupEnd();
      }
    });
  }

  getSectionDetails(sectionId: string) {
    LoggerUtil.group(`📌 [${this.MODULE}] Load Section Details`);
    this.isLoading = true;
    this.loadingMessage = 'Loading section details...';
    this.sectionManagementService.getSectionById(sectionId).subscribe({
      next: (response) => {
        LoggerUtil.log(this.MODULE, 'Details', '✅ Section data loaded', response.body);
        this.sectionData = response.body;
        this.createSectionForm.patchValue({
          sectionName: this.sectionData?.sectionName,
          sectionCode: this.sectionData?.sectionCode,
          description: this.sectionData?.description,
          campusId: this.sectionData?.standard.campus.id,
          standardId: this.sectionData?.standard.id
        });
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load section details', error);
        this.toaster?.show('Failed to load section details.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        LoggerUtil.groupEnd();
      }
    });
  }

  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Form Submit`);
    if (this.createSectionForm.invalid) {
      LoggerUtil.warn(this.MODULE, 'Submit', '❌ Form invalid');
      this.createSectionForm.markAllAsTouched();
      this.toaster?.show('Please fill all required fields correctly.', 'warning');
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form', this.createSectionForm.getRawValue());
    this.isLoading = true;
    this.loadingMessage = 'Saving section...';
    this.sectionManagementService.saveSection(this.sectionId, this.createSectionForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, 'Submit', '✅ Section saved successfully', response.body);
          const message = this.isEditMode ? 'Section details updated successfully.' : 'Section added successfully.';
          this.toaster?.show(message, 'success');
          setTimeout(() => {
            this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
          }, 1500);
        },
        error: (error) => {
          LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error);
          this.toaster?.show('Failed to save section.', 'error');
          this.isLoading = false;
        },
        complete: () => {
          LoggerUtil.groupEnd();
        }
      });
  }

  goToSectionsList() {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to sections list');
    this.router.navigate(ROUTES.CAMPUS.SECTION.LIST);
  }

  // Validators
  noWhitespaceValidator(control: any) {
    return control.value && !control.value.trim() ? { whitespace: true } : null;
  }

  // Getters for template
  get sectionName() { return this.createSectionForm.get('sectionName'); }
  get campusId() { return this.createSectionForm.get('campusId'); }
  get standardId() { return this.createSectionForm.get('standardId'); }
  get sectionCode() { return this.createSectionForm.get('sectionCode'); }
  get description() { return this.createSectionForm.get('description'); }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createSectionForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }
    return '';
  }

  validationMessages = {
    campusId: { required: 'Campus is required.' },
    standardId: { required: 'Standard is required.' },
    sectionName: {
      required: 'Section Name is required.',
      maxlength: 'Section Name cannot exceed 50 characters.',
      whitespace: 'Section Name cannot be empty or whitespace only.'
    },
    sectionCode: {
      maxlength: 'Section Code cannot exceed 15 characters.',
      whitespace: 'Section Code cannot be empty or whitespace only.'
    },
    description: { maxlength: 'Description cannot exceed 500 characters.' }
  };
}
