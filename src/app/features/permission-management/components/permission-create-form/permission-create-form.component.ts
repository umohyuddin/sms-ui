import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { ModuleResponse } from '../../models/ModuleResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-permission-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './permission-create-form.component.html',
  styleUrl: './permission-create-form.component.css'
})
export class PermissionCreateFormComponent {
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  createPermissionForm!: FormGroup;
  isEditMode = false;
  permissionId: string | null = null;
  permissionData?: PermissionResponse;
  isSaving = false;
  modules: ModuleResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadModules();

    this.permissionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.permissionId;

    if (this.isEditMode && this.permissionId) {
      this.getPermissionDetails(this.permissionId);
    }
  }

  private initializeForm() {
    this.createPermissionForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      name: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      moduleId: [''],
      description: ['', [Validators.maxLength(255)]],
      systemPermission: [false],
      active: [true]
    });
  }

  private loadModules() {
    this.permissionService.getAllModules().subscribe({
      next: (response) => {
        this.modules = response.body || [];
      },
      error: (error) => {
        console.error('❌ Error loading modules:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.createPermissionForm.invalid) {
      this.createPermissionForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = {
      ...this.createPermissionForm.getRawValue(),
      organizationId: this.jwtService.getOrganizationId()
    };

    this.permissionService.savePermission(this.permissionId, payload).subscribe({
      next: () => {
        this.toaster?.show(
          this.isEditMode ? 'Permission updated successfully.' : 'Permission saved successfully.',
          'success'
        );
        setTimeout(() => {
          this.router.navigate(ROUTES.PERMISSIONS.LIST);
        }, 1000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save permission.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  getPermissionDetails(permissionId: string): void {
    this.permissionService.getPermissionById(permissionId).subscribe({
      next: (response) => {
        this.permissionData = response.body;
        if (this.permissionData) {
          this.createPermissionForm.patchValue({
            code: this.permissionData.code,
            name: this.permissionData.name,
            moduleId: this.permissionData.module?.id || '',
            description: this.permissionData.description,
            systemPermission: this.permissionData.systemPermission || false,
            active: this.permissionData.active !== false
          });
          // Disable code field in edit mode
          this.createPermissionForm.get('code')?.disable();
        }
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  goToPermissionsListing() {
    this.router.navigate(ROUTES.PERMISSIONS.LIST);
  }

  get isLoading(): boolean {
    return this.isSaving;
  }

  get loadingMessage(): string {
    return this.isSaving ? 'Saving permission...' : '';
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    code: {
      required: 'Permission Code is required.',
      maxlength: 'Permission Code cannot exceed 100 characters.',
      whitespace: 'Permission Code cannot be empty or whitespace only.'
    },
    name: {
      required: 'Permission Name is required.',
      maxlength: 'Permission Name cannot exceed 100 characters.',
      whitespace: 'Permission Name cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createPermissionForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  get code() { return this.createPermissionForm.get('code'); }
  get name() { return this.createPermissionForm.get('name'); }
  get moduleId() { return this.createPermissionForm.get('moduleId'); }
  get description() { return this.createPermissionForm.get('description'); }
  get systemPermission() { return this.createPermissionForm.get('systemPermission'); }
  get active() { return this.createPermissionForm.get('active'); }
}
