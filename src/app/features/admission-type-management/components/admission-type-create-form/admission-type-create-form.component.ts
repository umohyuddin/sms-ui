import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { AdmissionTypeManagementService } from '../../services/admission-type-management.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-admission-type-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './admission-type-create-form.component.html',
  styleUrls: ['./admission-type-create-form.component.css']
})
export class AdmissionTypeCreateFormComponent {
  form!: FormGroup;
  isEditMode = false;
  itemId: string | null = null;
  isLoading = false;
  loadingMessage = '';

  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private admissionTypeService: AdmissionTypeManagementService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.itemId;

    if (this.isEditMode) {
      this.loadDetails(this.itemId!);
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator, Validators.maxLength(150)]],
      code: ['', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(500)]],
      isActive: [true]
    });
  }

  toggleActive(): void {
    const currentValue = this.form.get('isActive')?.value;
    this.form.get('isActive')?.setValue(!currentValue);
  }

  goToListing(): void {
    this.router.navigate(ROUTES.ADMISSION_TYPES.LIST);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loadingMessage = this.isEditMode ? 'Updating Admission Type...' : 'Saving Admission Type...';
    
    this.admissionTypeService.saveAdmissionType(this.itemId, this.form.getRawValue())
      .subscribe({
        next: (response: any) => {
          const message = response?.body?.message || (this.isEditMode ? 'Updated successfully' : 'Created successfully');
          this.toaster?.show(message, 'success');
          setTimeout(() => {
            this.router.navigate(ROUTES.ADMISSION_TYPES.LIST);
          }, 1500);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.loadingMessage = '';
          this.toaster?.show('Failed to save details.', 'error');
        },
        complete: () => {
          this.isLoading = false;
          this.loadingMessage = '';
        }
      });
  }

  loadDetails(id: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading details...';
    this.admissionTypeService.getAdmissionTypeById(id).subscribe({
      next: (response: any) => {
        const data = response.body;
        this.form.patchValue({
          name: data.name,
          code: data.code,
          description: data.description,
          isActive: data.isActive
        });
      },
      error: (error: any) => {
        this.toaster?.show('Failed to load details.', 'error');
      },
      complete: () => this.isLoading = false
    });
  }

  get name() { return this.form.get('name'); }
  get code() { return this.form.get('code'); }
  get description() { return this.form.get('description'); }

  noWhitespaceValidator(control: any) {
    if (control.value && typeof control.value === 'string' && !control.value.trim()) return { whitespace: true };
    return null;
  }

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.form.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  validationMessages = {
    name: {
      required: 'Name is required.',
      maxlength: 'Name cannot exceed 150 characters.',
      whitespace: 'Name cannot be empty.'
    },
    code: {
      required: 'Code is required.',
      maxlength: 'Code cannot exceed 20 characters.',
      whitespace: 'Code cannot be empty.'
    },
    description: {
      maxlength: 'Description cannot exceed 500 characters.'
    }
  };
}
