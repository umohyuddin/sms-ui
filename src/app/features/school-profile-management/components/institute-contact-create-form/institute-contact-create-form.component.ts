import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { InstituteResponse } from '../../models/InstituteResponse';
import { RolesService } from '../../../roles-management/services/roles.service';
import { RoleResponse } from '../../../roles-management/models/RoleResponse';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-institute-contact-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './institute-contact-create-form.component.html',
  styleUrl: './institute-contact-create-form.component.css'
})
export class InstituteContactCreateFormComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Input() contactId?: number;
  @Output() contactSaved = new EventEmitter<void>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  contactForm!: FormGroup;
  institute?: InstituteResponse;
  roles: RoleResponse[] = [];
  isSaving = false;
  isLoadingInstitute = false;
  isLoadingRoles = false;
  isLoadingContact = false;

  constructor(
    private fb: FormBuilder,
    private schoolProfileManagementService: SchoolProfileManagementService,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    console.log('Create Form Institute ID:', this.instituteId);
    this.initializeForm();
    this.applyInstituteId(this.instituteId);
    this.loadRolesForOrganization();
    if (!this.instituteId) {
      this.loadInstitute();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.contactForm) {
      if (changes['instituteId']) {
        this.applyInstituteId(changes['instituteId'].currentValue);
      }
      if (changes['contactId']) {
        this.loadContactForEdit(changes['contactId'].currentValue);
      }
      if (changes['organizationId'] || changes['instituteId']) {
        this.loadRolesForOrganization();
      }
    }
  }

  private initializeForm() {
    this.contactForm = this.fb.group({
      instituteId: [null, Validators.required],
      contactPersonName: ['', [Validators.required, Validators.maxLength(150), this.noWhitespaceValidator]],
      role: ['', [Validators.maxLength(100), this.noWhitespaceValidator]],
      phone: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^\+?[0-9\s\-()]*$/)]],
      email: ['', [Validators.required, Validators.email]],
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
      this.contactForm.patchValue({ instituteId: id });
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

  private loadContactForEdit(contactId?: number) {
    if (!contactId) {
      return;
    }

    const instituteId = this.instituteId ?? this.contactForm.get('instituteId')?.value;
    this.isLoadingContact = true;
    this.schoolProfileManagementService.getInstituteContactById(contactId, instituteId).subscribe({
      next: (response) => {
        const contact = response.body;
        if (contact) {
          this.contactForm.patchValue({
            instituteId: contact.instituteId ?? instituteId ?? null,
            contactPersonName: contact.contactPersonName ?? '',
            role: contact.role ?? '',
            phone: contact.phone ?? '',
            email: contact.email ?? ''
          });
        }
      },
      error: (error: any) => {
        this.isLoadingContact = false;
        console.error('❌ Load Contact Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load contact.', 'error');
      },
      complete: () => {
        this.isLoadingContact = false;
      }
    });
  }
onCancel() {
  this.contactForm.reset();          // clears all form fields
  //this.contactId = null;             // reset contact ID if editing
  // optionally reset form validation states
  Object.keys(this.contactForm.controls).forEach(key => {
    this.contactForm.get(key)?.setErrors(null);
  });
}

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.contactForm.getRawValue();
    const instituteId = this.instituteId ?? this.contactForm.get('instituteId')?.value ?? null;
    const request$ = this.contactId
      ? this.schoolProfileManagementService.updateInstituteContact(this.contactId, payload, instituteId)
      : this.schoolProfileManagementService.createInstituteContact(payload);

    request$.subscribe({
      next: () => {
        const instituteId = this.contactForm.get('instituteId')?.value ?? null;
        this.contactForm.reset({
          instituteId,
          contactPersonName: '',
          role: '',
          phone: '',
          email: ''
        });
        this.contactSaved.emit();
        this.toaster?.show(this.contactId ? 'Contact updated successfully.' : 'Contact saved successfully.', 'success');
      },
      error: (error: any) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save contact.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  get isLoading(): boolean {
    return this.isSaving || this.isLoadingInstitute || this.isLoadingRoles || this.isLoadingContact;
  }

  get loadingMessage(): string {
    if (this.isSaving) return 'Saving contact...';
    if (this.isLoadingContact) return 'Loading contact...';
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
    contactPersonName: {
      required: 'Contact person name is required.',
      maxlength: 'Contact person name cannot exceed 150 characters.',
      whitespace: 'Contact person name cannot be empty or whitespace only.'
    },
    role: {
      maxlength: 'Role cannot exceed 100 characters.',
      whitespace: 'Role cannot be empty or whitespace only.'
    },
    phone: {
      required: 'Phone is required.',
      maxlength: 'Phone cannot exceed 20 characters.',
      pattern: 'Invalid phone number format.'
    },
    email: {
      required: 'Email is required.',
      email: 'Please enter a valid email address.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.contactForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }


  get contactPersonName() { return this.contactForm.get('contactPersonName'); }
  get role() { return this.contactForm.get('role'); }
  get phone() { return this.contactForm.get('phone'); }
  get email() { return this.contactForm.get('email'); }
}
