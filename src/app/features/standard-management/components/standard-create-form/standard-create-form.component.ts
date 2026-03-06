import { Component, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { CampusManagementService } from '../../../campus-management/services/campus-management.service';
import { StandardManagementService } from '../../services/standard-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { StandardResponse } from '../../models/standardResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-standard-create-form',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ToasterComponent,
    LoaderComponent
  ],
  templateUrl: './standard-create-form.component.html',
  styleUrls: ['./standard-create-form.component.css']
})
export class StandardCreateFormComponent {
  createStandardForm!: FormGroup;
  standardId: string | null = null;
  isEditMode: boolean = false;
  standardData?: StandardResponse;
  campuses: CampusResponse[] = [];
  private readonly MODULE = 'Standard';
  private readonly COMPONENT = 'StandardForm';

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  isLoading: boolean = false;
  loadingMessage: string = '';

  validationMessages = {
    standardName: {
      required: 'Standard Name is required.',
      whitespace: 'Standard Name cannot be empty or whitespace only.'
    },
    standardCode: {
      maxlength: 'Standard Code cannot exceed 20 characters.',
      whitespace: 'Standard Code cannot be empty.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.',
      whitespace: 'Description cannot be empty.'
    },
    campusId: {
      required: 'Campus selection is required.'
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private campusManagementService: CampusManagementService,
    private standardManagementService: StandardManagementService
    , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    LoggerUtil.group(`📌 [${this.MODULE}] Init`);
    LoggerUtil.log(this.MODULE, this.COMPONENT, '⚙️ Initializing component');

    this.initializeForm();
    this.loadCampuses();

    this.standardId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.standardId;
    LoggerUtil.log(this.MODULE, this.COMPONENT, '📝 Mode detected', this.isEditMode ? 'EDIT' : 'CREATE');

    if (this.isEditMode && this.standardId) {
      this.getStandardDetails(this.standardId);
    }

    LoggerUtil.groupEnd();
  }

  private initializeForm() {
    LoggerUtil.group(`⚙️ [${this.MODULE}] Form Initialization`);
    this.createStandardForm = this.fb.group({
      standardName: ['', [Validators.required, this.noWhitespaceValidator]],
      standardCode: ['', [Validators.maxLength(20), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(500), this.noWhitespaceValidator]],
      campusId: ['', Validators.required]
    });
    LoggerUtil.log(this.MODULE, this.COMPONENT, '✅ Form initialized');
    LoggerUtil.groupEnd();
  }

  private loadCampuses() {
    LoggerUtil.group(`🏫 [${this.MODULE}] Load Campuses`);
    this.isLoading = true;
    this.loadingMessage = 'Loading campuses...';
    this.campusManagementService.getAllCampuses().subscribe({
      next: (response) => {
        this.campuses = response.body;
        LoggerUtil.log(this.MODULE, 'Campuses', '📦 Campuses loaded', this.campuses);
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Campuses', '❌ Failed to load campuses', error);
        this.toaster?.show('Failed to load campuses.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Campuses', '🔚 Load campuses completed');
        this.isLoading = false;
      }
    });
    LoggerUtil.groupEnd();
  }

  private getStandardDetails(standardId: string) {
    LoggerUtil.group(`📦 [${this.MODULE}] Load Standard Details`);
    LoggerUtil.log(this.MODULE, 'Details', '📌 Fetching standard by ID', standardId);
    this.isLoading = true;
    this.loadingMessage = 'Loading standard details...';

    this.standardManagementService.getStandardById(standardId).subscribe({
      next: (response) => {
        this.standardData = response.body;
        LoggerUtil.log(this.MODULE, 'Details', '✅ Standard data loaded', this.standardData);

        this.createStandardForm.patchValue({
          standardName: this.standardData?.standardName,
          standardCode: this.standardData?.standardCode,
          description: this.standardData?.description,
          campusId: this.standardData?.campus?.id
        });
      },
      error: (error) => {
        LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load standard details', error);
        this.toaster?.show('Failed to load standard details.', 'error');
        this.isLoading = false;
      },
      complete: () => {
        LoggerUtil.log(this.MODULE, 'Details', '🔚 Standard details flow completed');
        this.isLoading = false;
      }
    });
    LoggerUtil.groupEnd();
  }

  onSubmit() {
    LoggerUtil.group(`🚀 [${this.MODULE}] Submit`);
    LoggerUtil.log(this.MODULE, 'Submit', '📋 Form submit triggered');

    if (this.createStandardForm.invalid) {
      this.createStandardForm.markAllAsTouched();
      this.toaster?.show('Please fill all required fields correctly.', 'warning');
      LoggerUtil.error(this.MODULE, 'Submit', '❌ Form validation failed', this.createStandardForm.errors);
      LoggerUtil.groupEnd();
      return;
    }

    LoggerUtil.log(this.MODULE, 'Submit', '📤 Submitting form data', this.createStandardForm.getRawValue());
    this.isLoading = true;
    this.loadingMessage = 'Saving standard details...';

    this.standardManagementService.saveStandard(this.standardId, this.createStandardForm.getRawValue())
      .subscribe({
        next: (response) => {
          LoggerUtil.log(this.MODULE, 'Submit', '✅ Save successful', response.body);
          const message = this.isEditMode ? 'Standard details updated successfully.' : 'Standard added successfully.';
          this.toaster?.show(message, 'success');
          setTimeout(() => {
            LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to standard list');
            this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST);
          }, 1500);
        },
        error: (error) => {
          LoggerUtil.error(this.MODULE, 'Submit', '❌ Save failed', error);
          this.toaster?.show('Failed to save standard details.', 'error');
          this.isLoading = false;
        },
        complete: () => {
          LoggerUtil.log(this.MODULE, 'Submit', '🔚 Submit flow completed');
          LoggerUtil.groupEnd();
        }
      });
  }

  goToStandardList() {
    LoggerUtil.log(this.MODULE, 'Navigation', '➡️ Redirecting to standard list');
    this.router.navigate(ROUTES.CAMPUS.STANDARD.LIST);
  }

  // getters
  get standardName() { return this.createStandardForm.get('standardName'); }
  get standardCode() { return this.createStandardForm.get('standardCode'); }
  get description() { return this.createStandardForm.get('description'); }
  get campusId() { return this.createStandardForm.get('campusId'); }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createStandardForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }
}
