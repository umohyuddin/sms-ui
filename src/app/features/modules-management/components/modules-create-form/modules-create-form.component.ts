import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '../../services/modules.service';
import { ModuleResponse } from '../../models/ModuleResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-modules-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './modules-create-form.component.html',
  styleUrl: './modules-create-form.component.css'
})
export class ModulesCreateFormComponent {
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  
  createModuleForm!: FormGroup;
  isEditMode = false;
  moduleId: string | null = null;
  moduleData?: ModuleResponse;
  isSaving = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modulesService: ModulesService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.moduleId = this.activatedRoute.snapshot.paramMap.get('id');
    this.isEditMode = !!this.moduleId;

    if (this.isEditMode && this.moduleId) {
      this.getModuleDetails(this.moduleId);
    }
  }

  private initializeForm() {
    this.createModuleForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      name: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(255)]],
      // icon: ['', [Validators.maxLength(50)]],
      // route: ['', [Validators.maxLength(100)]],
      // displayOrder: [null],
      systemModule: [false],
      active: [true]
    });
  }

  onSubmit(): void {
    if (this.createModuleForm.invalid) {
      this.createModuleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Get form data
    const payload = this.createModuleForm.getRawValue();

    console.log('📋 Module Payload:', payload);

    this.modulesService.saveModule(this.moduleId, payload).subscribe({
      next: () => {
        this.toaster?.show(
          this.isEditMode ? 'Module updated successfully.' : 'Module saved successfully.',
          'success'
        );
        setTimeout(() => {
          this.router.navigate(ROUTES.MODULES.LIST);
        }, 1000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save module.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  getModuleDetails(moduleId: string): void {
    this.modulesService.getModuleById(moduleId).subscribe({
      next: (response) => {
        this.moduleData = response.body;
        if (this.moduleData) {
          this.createModuleForm.patchValue({
            code: this.moduleData.code,
            name: this.moduleData.name,
            description: this.moduleData.description,
            icon: this.moduleData.icon,
            route: this.moduleData.route,
            displayOrder: this.moduleData.displayOrder,
            systemModule: this.moduleData.systemModule || false,
            active: this.moduleData.active !== false
          });
        }
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  goToModulesListing() {
    this.router.navigate(ROUTES.MODULES.LIST);
  }

  get isLoading(): boolean {
    return this.isSaving;
  }

  get loadingMessage(): string {
    return this.isSaving ? 'Saving module...' : '';
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages: { [key: string]: any } = {
    code: {
      required: 'Module Code is required.',
      maxlength: 'Module Code cannot exceed 50 characters.',
      whitespace: 'Module Code cannot be empty or whitespace only.'
    },
    name: {
      required: 'Module Name is required.',
      maxlength: 'Module Name cannot exceed 100 characters.',
      whitespace: 'Module Name cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.'
    },
    icon: {
      maxlength: 'Icon cannot exceed 50 characters.'
    },
    route: {
      maxlength: 'Route cannot exceed 100 characters.'
    },
    displayOrder: {
      maxlength: 'Display Order is invalid.'
    },
    systemModule: {},
    active: {}
  };

  getErrorMessage(controlName: string): string {
    const control = this.createModuleForm.get(controlName);
    if (!control) return '';
    
    const messages = this.validationMessages[controlName] || {};
    
    if (control.hasError('required')) {
      return messages.required || 'This field is required.';
    }
    if (control.hasError('maxlength')) {
      return messages.maxlength || 'Exceeded maximum length.';
    }
    if (control.hasError('whitespace')) {
      return messages.whitespace || 'Cannot be empty or whitespace only.';
    }
    return '';
  }

  hasError(controlName: string): boolean {
    const control = this.createModuleForm.get(controlName);
    return (control?.invalid && control?.touched) ?? false;
  }

  get code() {
    return this.createModuleForm.get('code');
  }

  get name() {
    return this.createModuleForm.get('name');
  }

  get description() {
    return this.createModuleForm.get('description');
  }

  get icon() {
    return this.createModuleForm.get('icon');
  }

  get route() {
    return this.createModuleForm.get('route');
  }

  get displayOrder() {
    return this.createModuleForm.get('displayOrder');
  }

  get systemModule() {
    return this.createModuleForm.get('systemModule');
  }

  get active() {
    return this.createModuleForm.get('active');
  }

  getFormControl(controlName: string) {
    return this.createModuleForm.get(controlName);
  }
}
