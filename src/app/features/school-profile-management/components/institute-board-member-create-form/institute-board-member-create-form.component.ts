import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { InstituteResponse } from '../../models/InstituteResponse';
import { RolesService } from '../../../roles-management/services/roles.service';
import { RoleResponse } from '../../../roles-management/models/RoleResponse';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-institute-board-member-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './institute-board-member-create-form.component.html',
  styleUrl: './institute-board-member-create-form.component.css'
})
export class InstituteBoardMemberCreateFormComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Input() boardMemberId?: number;
  @Output() boardMemberSaved = new EventEmitter<void>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  boardMemberForm!: FormGroup;
  institute?: InstituteResponse;
  roles: RoleResponse[] = [];

  isSaving = false;
  isLoadingInstitute = false;
  isLoadingRoles = false;
  isLoadingBoardMember = false;

  constructor(
    private fb: FormBuilder,
    private schoolProfileManagementService: SchoolProfileManagementService,
    private rolesService: RolesService
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.applyInstituteId(this.instituteId);
    this.loadRolesForOrganization();
    if (!this.instituteId) {
      this.loadInstitute();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.boardMemberForm) {
      if (changes['instituteId']) {
        this.applyInstituteId(changes['instituteId'].currentValue);
      }
      if (changes['boardMemberId']) {
        this.loadBoardMemberForEdit(changes['boardMemberId'].currentValue);
      }
      if (changes['organizationId'] || changes['instituteId']) {
        this.loadRolesForOrganization();
      }
    }
  }

  private initializeForm() {
    this.boardMemberForm = this.fb.group({
      instituteId: [null, Validators.required],
      roleId: [null, Validators.required],
      fullName: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      contactNumber: ['', [Validators.maxLength(20)]],
      termStart: [null],
      termEnd: [null],
      isActive: [true]
    });
  }

  private loadInstitute() {
    this.isLoadingInstitute = true;
    this.schoolProfileManagementService.getInstitute().subscribe({
      next: (response) => {
        this.institute = response.body;
        this.applyInstituteId(this.institute?.id);
        this.loadRolesForOrganization();
      },
      error: (error) => {
        this.isLoadingInstitute = false;
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load institute.', 'error');
      },
      complete: () => {
        this.isLoadingInstitute = false;
      }
    });
  }

  private applyInstituteId(id?: number) {
    if (id) {
      this.boardMemberForm.patchValue({ instituteId: id });
    }
  }

  private loadRolesForOrganization() {
    const orgId = this.organizationId ?? this.instituteId;
    if (!orgId) {
      return;
    }

    this.isLoadingRoles = true;
    this.rolesService.getRolesByOrganizationId(orgId).subscribe({
      next: (response) => {
        this.roles = response.body ?? [];
      },
      error: (error: any) => {
        this.isLoadingRoles = false;
        console.error('❌ Roles Request Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load roles.', 'error');
      },
      complete: () => {
        this.isLoadingRoles = false;
      }
    });
  }

  private loadBoardMemberForEdit(boardMemberId?: number) {
    if (!boardMemberId) {
      return;
    }

    const instituteId = this.instituteId ?? this.boardMemberForm.get('instituteId')?.value;
    this.isLoadingBoardMember = true;
    this.schoolProfileManagementService.getInstituteBoardMemberById(boardMemberId, instituteId).subscribe({
      next: (response) => {
        const member = response.body;
        if (member) {
          this.boardMemberForm.patchValue({
            instituteId: member.instituteId ?? instituteId ?? null,
            roleId: member.roleId ?? null,
            fullName: member.fullName ?? '',
            email: member.email ?? '',
            contactNumber: member.contactNumber ?? '',
            termStart: member.termStart ?? null,
            termEnd: member.termEnd ?? null,
            isActive: member.isActive ?? true
          });
        }
      },
      error: (error: any) => {
        this.isLoadingBoardMember = false;
        console.error('❌ Load Board Member Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load board member.', 'error');
      },
      complete: () => {
        this.isLoadingBoardMember = false;
      }
    });
  }

  onSubmit(): void {
    if (this.boardMemberForm.invalid) {
      this.boardMemberForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.boardMemberForm.getRawValue();
    const instituteId = this.instituteId ?? this.boardMemberForm.get('instituteId')?.value ?? null;
    const request$ = this.boardMemberId
      ? this.schoolProfileManagementService.updateInstituteBoardMember(this.boardMemberId, payload, instituteId)
      : this.schoolProfileManagementService.createInstituteBoardMember(payload);

    request$.subscribe({
      next: () => {
        const idValue = this.boardMemberForm.get('instituteId')?.value ?? null;
        this.boardMemberForm.reset({
          instituteId: idValue,
          roleId: null,
          fullName: '',
          email: '',
          contactNumber: '',
          termStart: null,
          termEnd: null,
          isActive: true
        });
        this.boardMemberSaved.emit();
        this.toaster?.show(this.boardMemberId ? 'Board member updated successfully.' : 'Board member saved successfully.', 'success');
      },
      error: (error: any) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save board member.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    const instituteId = this.boardMemberForm.get('instituteId')?.value ?? null;
    this.boardMemberForm.reset({
      instituteId,
      roleId: null,
      fullName: '',
      email: '',
      contactNumber: '',
      termStart: null,
      termEnd: null,
      isActive: true
    });
    Object.keys(this.boardMemberForm.controls).forEach(key => {
      this.boardMemberForm.get(key)?.setErrors(null);
    });
  }

  get isLoading(): boolean {
    return this.isSaving || this.isLoadingInstitute || this.isLoadingRoles || this.isLoadingBoardMember;
  }

  get loadingMessage(): string {
    if (this.isSaving) return 'Saving board member...';
    if (this.isLoadingBoardMember) return 'Loading board member...';
    if (this.isLoadingRoles) return 'Loading roles...';
    if (this.isLoadingInstitute) return 'Loading institute...';
    return 'Loading...';
  }

  noWhitespaceValidator(control: any) {
    if (control.value && !control.value.trim()) return { whitespace: true };
    return null;
  }

  validationMessages = {
    instituteId: {
      required: 'Institute is required.'
    },
    roleId: {
      required: 'Role is required.'
    },
    fullName: {
      required: 'Full name is required.',
      maxlength: 'Full name cannot exceed 100 characters.',
      whitespace: 'Full name cannot be empty or whitespace only.'
    },
    email: {
      email: 'Please enter a valid email address.',
      maxlength: 'Email cannot exceed 100 characters.'
    },
    contactNumber: {
      maxlength: 'Contact number cannot exceed 20 characters.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.boardMemberForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  get fullName() { return this.boardMemberForm.get('fullName'); }
  get roleId() { return this.boardMemberForm.get('roleId'); }
  get email() { return this.boardMemberForm.get('email'); }
  get contactNumber() { return this.boardMemberForm.get('contactNumber'); }
  get termStart() { return this.boardMemberForm.get('termStart'); }
  get termEnd() { return this.boardMemberForm.get('termEnd'); }
  get isActive() { return this.boardMemberForm.get('isActive'); }
}
