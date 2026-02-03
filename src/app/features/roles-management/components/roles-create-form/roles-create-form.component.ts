import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-roles-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './roles-create-form.component.html',
  styleUrl: './roles-create-form.component.css'
})
export class RolesCreateFormComponent {
  createRoleForm!: FormGroup;
  isEditMode = false;
  roleId: string | null = null;
  roleData?: RoleResponse;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.initializeForm();

    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.roleId;

    if (this.isEditMode && this.roleId) {
      this.getRoleDetails(this.roleId);
    }
  }

  private initializeForm() {
    this.createRoleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(255), this.noWhitespaceValidator]]
    });
  }

  onSubmit(): void {
    if (this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    this.rolesService.saveRole(this.roleId, this.createRoleForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigate(ROUTES.ROLES.LIST);
      },
      error: (error) => {
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  getRoleDetails(roleId: string): void {
    this.rolesService.getRoleById(roleId).subscribe({
      next: (response) => {
        this.roleData = response.body;
        if (this.roleData) {
          this.createRoleForm.patchValue({
            roleName: this.roleData.name,
            description: this.roleData.description
          });
        }
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  goToRolesListing() {
    this.router.navigate(ROUTES.ROLES.LIST);
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    roleName: {
      required: 'Role Name is required.',
      maxlength: 'Role Name cannot exceed 100 characters.',
      whitespace: 'Role Name cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.',
      whitespace: 'Description cannot be empty or whitespace only.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.createRoleForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  get roleName() { return this.createRoleForm.get('roleName'); }
  get description() { return this.createRoleForm.get('description'); }
}
