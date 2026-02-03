import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-permission-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './permission-create-form.component.html',
  styleUrl: './permission-create-form.component.css'
})
export class PermissionCreateFormComponent {
  createPermissionForm!: FormGroup;
  isEditMode = false;
  permissionId: string | null = null;
  permissionData?: PermissionResponse;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.permissionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.permissionId;

    if (this.isEditMode && this.permissionId) {
      this.getPermissionDetails(this.permissionId);
    }
  }

  private initializeForm() {
    this.createPermissionForm = this.fb.group({
      permissionName: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      code: ['', [Validators.maxLength(100), this.noWhitespaceValidator]],
      module: ['', [Validators.maxLength(100), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(255), this.noWhitespaceValidator]]
    });
  }

  onSubmit(): void {
    if (this.createPermissionForm.invalid) {
      this.createPermissionForm.markAllAsTouched();
      return;
    }

    this.permissionService.savePermission(this.permissionId, this.createPermissionForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(ROUTES.PERMISSIONS.LIST);
      },
      error: (error) => {
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  getPermissionDetails(permissionId: string): void {
    this.permissionService.getPermissionById(permissionId).subscribe({
      next: (response) => {
        this.permissionData = response.body;
        if (this.permissionData) {
          this.createPermissionForm.patchValue({
            permissionName: this.permissionData.permissionName,
            code: this.permissionData.code,
            module: this.permissionData.module,
            description: this.permissionData.description
          });
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

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    permissionName: {
      required: 'Permission Name is required.',
      maxlength: 'Permission Name cannot exceed 100 characters.',
      whitespace: 'Permission Name cannot be empty or whitespace only.'
    },
    code: {
      maxlength: 'Code cannot exceed 100 characters.',
      whitespace: 'Code cannot be empty or whitespace only.'
    },
    module: {
      maxlength: 'Module cannot exceed 100 characters.',
      whitespace: 'Module cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.',
      whitespace: 'Description cannot be empty or whitespace only.'
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

  get permissionName() { return this.createPermissionForm.get('permissionName'); }
  get code() { return this.createPermissionForm.get('code'); }
  get module() { return this.createPermissionForm.get('module'); }
  get description() { return this.createPermissionForm.get('description'); }
}
