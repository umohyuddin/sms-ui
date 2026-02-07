import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { PermissionService } from '../../../permission-management/services/permission.service';
import { PermissionResponse } from '../../../permission-management/models/PermissionResponse';

@Component({
  selector: 'app-roles-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
  templateUrl: './roles-create-form.component.html',
  styleUrl: './roles-create-form.component.css'
})
export class RolesCreateFormComponent implements OnInit {
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  createRoleForm!: FormGroup;
  isEditMode = false;
  roleId: string | null = null;
  roleData?: RoleResponse;
  isSaving = false;
  permissions: PermissionResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private permissionService: PermissionService,
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.loadPermissions();

    this.roleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.roleId;

    if (this.isEditMode && this.roleId) {
      this.getRoleDetails(this.roleId);
    }
  }

  private initializeForm() {
    this.createRoleForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
      name: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      description: ['', [Validators.maxLength(255)]],
      systemRole: [false],
      active: [true],
      permissionIds: [[]]
    });
  }

  private loadPermissions() {
    this.permissionService.getAllPermissions().subscribe({
      next: (data) => this.permissions = data || [],
      error: (err) => console.error('Error loading permissions:', err)
    });
  }

  togglePermission(id: number) {
    const current = this.createRoleForm.get('permissionIds')?.value as number[];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    this.createRoleForm.get('permissionIds')?.setValue([...current]);
  }

  isPermissionSelected(id: number): boolean {
    return (this.createRoleForm.get('permissionIds')?.value as number[]).includes(id);
  }

  onSubmit(): void {
    if (this.createRoleForm.invalid) {
      this.createRoleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Get form data and add organizationId
    const payload = {
      ...this.createRoleForm.getRawValue(),
      organizationId: this.jwtService.getOrganizationId()
    };

    console.log('📋 Role Payload:', payload);

    this.rolesService.saveRole(this.roleId, payload).subscribe({
      next: () => {
        this.toaster?.show(
          this.isEditMode ? 'Role updated successfully.' : 'Role saved successfully.',
          'success'
        );
        setTimeout(() => {
          this.router.navigate(ROUTES.ROLES.LIST);
        }, 1000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save role.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  getRoleDetails(roleId: string): void {
    this.rolesService.getRoleById(roleId).subscribe({
      next: (response) => {
        this.roleData = response.body.data;
        if (this.roleData) {
          const permIds = this.roleData.permissions?.map(p => p.id) || [];
          this.createRoleForm.patchValue({
            code: this.roleData.code,
            name: this.roleData.name,
            description: this.roleData.description,
            systemRole: this.roleData.systemRole || false,
            active: this.roleData.active !== false,
            permissionIds: permIds
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

  get isLoading(): boolean {
    return this.isSaving;
  }

  get loadingMessage(): string {
    return this.isSaving ? 'Saving role...' : '';
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    code: {
      required: 'Role Code is required.',
      maxlength: 'Role Code cannot exceed 50 characters.',
      whitespace: 'Role Code cannot be empty or whitespace only.'
    },
    name: {
      required: 'Role Name is required.',
      maxlength: 'Role Name cannot exceed 100 characters.',
      whitespace: 'Role Name cannot be empty or whitespace only.'
    },
    description: {
      maxlength: 'Description cannot exceed 255 characters.'
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

  get code() { return this.createRoleForm.get('code'); }
  get name() { return this.createRoleForm.get('name'); }
  get description() { return this.createRoleForm.get('description'); }
  get systemRole() { return this.createRoleForm.get('systemRole'); }
  get active() { return this.createRoleForm.get('active'); }
}
