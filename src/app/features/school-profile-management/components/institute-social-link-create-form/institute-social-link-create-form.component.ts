import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { InstituteResponse } from '../../models/InstituteResponse';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
  selector: 'app-institute-social-link-create-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './institute-social-link-create-form.component.html',
  styleUrl: './institute-social-link-create-form.component.css'
})
export class InstituteSocialLinkCreateFormComponent implements OnChanges {
  @Input() instituteId?: number;
  @Input() organizationId?: number;
  @Input() socialLinkId?: number;
  @Output() socialLinkSaved = new EventEmitter<void>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  socialLinkForm!: FormGroup;
  institute?: InstituteResponse;

  socialPlatforms = [
    { name: 'Facebook', value: 'facebook' },
    { name: 'Instagram', value: 'instagram' },
    { name: 'LinkedIn', value: 'linkedin' },
    { name: 'Twitter', value: 'twitter' },
    { name: 'YouTube', value: 'youtube' },
    { name: 'TikTok', value: 'tiktok' },
    { name: 'WhatsApp Business', value: 'whatsapp' },
    { name: 'Pinterest', value: 'pinterest' },
    { name: 'Snapchat', value: 'snapchat' }
  ];

  isSaving = false;
  isLoadingInstitute = false;
  isLoadingSocialLink = false;

  constructor(
    private fb: FormBuilder,
    private schoolProfileManagementService: SchoolProfileManagementService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.applyInstituteId(this.instituteId);
    if (!this.instituteId) {
      this.loadInstitute();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.socialLinkForm) {
      if (changes['instituteId']) {
        this.applyInstituteId(changes['instituteId'].currentValue);
      }
      if (changes['socialLinkId']) {
        this.loadSocialLinkForEdit(changes['socialLinkId'].currentValue);
      }
    }
  }

  private initializeForm() {
    this.socialLinkForm = this.fb.group({
      instituteId: [null, Validators.required],
      platform: ['', [Validators.required, Validators.maxLength(50)]],
      url: ['', [Validators.required, Validators.maxLength(255), this.noWhitespaceValidator]]
    });
  }

  private loadInstitute() {
    this.isLoadingInstitute = true;
    this.schoolProfileManagementService.getInstitute().subscribe({
      next: (response) => {
        this.institute = response.body;
        this.applyInstituteId(this.institute?.id);
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
      this.socialLinkForm.patchValue({ instituteId: id });
    }
  }

  private loadSocialLinkForEdit(socialLinkId?: number) {
    if (!socialLinkId) {
      return;
    }

    const instituteId = this.instituteId ?? this.socialLinkForm.get('instituteId')?.value;
    this.isLoadingSocialLink = true;
    this.schoolProfileManagementService.getInstituteSocialLinkById(socialLinkId, instituteId).subscribe({
      next: (response) => {
        const link = response.body;
        if (link) {
          this.socialLinkForm.patchValue({
            instituteId: link.instituteId ?? instituteId ?? null,
            platform: link.platform ?? '',
            url: link.url ?? ''
          });
        }
      },
      error: (error: any) => {
        this.isLoadingSocialLink = false;
        console.error('❌ Load Social Link Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to load social link.', 'error');
      },
      complete: () => {
        this.isLoadingSocialLink = false;
      }
    });
  }

  onSubmit(): void {
    if (this.socialLinkForm.invalid) {
      this.socialLinkForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.socialLinkForm.getRawValue();
    const instituteId = this.instituteId ?? this.socialLinkForm.get('instituteId')?.value ?? null;
    const request$ = this.socialLinkId
      ? this.schoolProfileManagementService.updateInstituteSocialLink(this.socialLinkId, payload, instituteId)
      : this.schoolProfileManagementService.createInstituteSocialLink(payload);

    request$.subscribe({
      next: () => {
        const idValue = this.socialLinkForm.get('instituteId')?.value ?? null;
        this.socialLinkForm.reset({
          instituteId: idValue,
          platform: '',
          url: ''
        });
        this.socialLinkSaved.emit();
        this.toaster?.show(this.socialLinkId ? 'Social link updated successfully.' : 'Social link saved successfully.', 'success');
      },
      error: (error: any) => {
        this.isSaving = false;
        console.error('❌ Save Error Status:', error.status);
        console.error('Message:', error.message);
        this.toaster?.show('Failed to save social link.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    const instituteId = this.socialLinkForm.get('instituteId')?.value ?? null;
    this.socialLinkForm.reset({
      instituteId,
      platform: '',
      url: ''
    });
    Object.keys(this.socialLinkForm.controls).forEach(key => {
      this.socialLinkForm.get(key)?.setErrors(null);
    });
  }

  get isLoading(): boolean {
    return this.isSaving || this.isLoadingInstitute || this.isLoadingSocialLink;
  }

  get loadingMessage(): string {
    if (this.isSaving) return 'Saving social link...';
    if (this.isLoadingSocialLink) return 'Loading social link...';
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
    platform: {
      required: 'Platform is required.',
      maxlength: 'Platform cannot exceed 50 characters.'
    },
    url: {
      required: 'URL is required.',
      maxlength: 'URL cannot exceed 255 characters.',
      whitespace: 'URL cannot be empty or whitespace only.'
    }
  };

  getErrorMessage(controlName: keyof typeof this.validationMessages): string {
    const control = this.socialLinkForm.get(controlName as string);
    if (!control || !control.errors) return '';

    for (const error in control.errors) {
      const key = error as keyof typeof this.validationMessages[typeof controlName];
      if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
    }

    return '';
  }

  get platform() { return this.socialLinkForm.get('platform'); }
  get url() { return this.socialLinkForm.get('url'); }
}
