import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../core/services/logger.service';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { InstituteResponse } from '../../models/InstituteResponse';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
    selector: 'app-institute-accreditation-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
    templateUrl: './institute-accreditation-create-form.component.html',
    styleUrl: './institute-accreditation-create-form.component.css'
})
export class InstituteAccreditationCreateFormComponent implements OnInit, OnChanges {
    @Input() instituteId?: number;
    @Input() accreditationId?: number;
    @Output() accreditationSaved = new EventEmitter<void>();
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    accreditationForm!: FormGroup;
    institute?: InstituteResponse;

    isSaving = false;
    isLoadingInstitute = false;
    isLoadingAccreditation = false;

    constructor(
        private fb: FormBuilder,
        private schoolProfileManagementService: SchoolProfileManagementService
    , private logger: LoggerService) { }

    ngOnInit(): void {
        this.initializeForm();
        if (this.instituteId) {
            this.applyInstituteId(this.instituteId);
        } else {
            this.loadInstitute();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.accreditationForm) {
            if (changes['instituteId'] && changes['instituteId'].currentValue) {
                this.applyInstituteId(changes['instituteId'].currentValue);
            }
            if (changes['accreditationId'] && changes['accreditationId'].currentValue) {
                this.loadAccreditationForEdit(changes['accreditationId'].currentValue);
            } else if (changes['accreditationId'] && !changes['accreditationId'].currentValue) {
                this.resetForm();
            }
        }
    }

    private initializeForm() {
        this.accreditationForm = this.fb.group({
            instituteId: [null, Validators.required],
            authorityName: ['', [Validators.required, Validators.maxLength(100)]],
            licenseNumber: ['', [Validators.required, Validators.maxLength(100)]],
            validFrom: [null],
            validTo: [null],
            isActive: [true]
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
                console.error('Failed to load institute:', error);
            },
            complete: () => {
                this.isLoadingInstitute = false;
            }
        });
    }

    private applyInstituteId(id?: number) {
        if (id) {
            this.accreditationForm.patchValue({ instituteId: id });
        }
    }

    private loadAccreditationForEdit(accreditationId?: number) {
        if (!accreditationId) return;

        const instituteId = this.instituteId ?? this.accreditationForm.get('instituteId')?.value;
        this.isLoadingAccreditation = true;
        this.schoolProfileManagementService.getInstituteAccreditationById(accreditationId, instituteId).subscribe({
            next: (response) => {
                const data = response.body;
                if (data) {
                    this.accreditationForm.patchValue({
                        instituteId: data.instituteId ?? instituteId,
                        authorityName: data.authorityName,
                        licenseNumber: data.licenseNumber,
                        validFrom: data.validFrom,
                        validTo: data.validTo,
                        isActive: data.isActive
                    });
                }
            },
            error: (error) => {
                this.isLoadingAccreditation = false;
                this.toaster?.show('Failed to load accreditation details.', 'error');
            },
            complete: () => {
                this.isLoadingAccreditation = false;
            }
        });
    }

    onSubmit(): void {
        if (this.accreditationForm.invalid) {
            this.accreditationForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const payload = this.accreditationForm.getRawValue();
        const instituteId = this.instituteId ?? this.accreditationForm.get('instituteId')?.value;

        const request$ = this.accreditationId
            ? this.schoolProfileManagementService.updateInstituteAccreditation(this.accreditationId, payload, instituteId)
            : this.schoolProfileManagementService.createInstituteAccreditation(payload);

        request$.subscribe({
            next: () => {
                this.toaster?.show(this.accreditationId ? 'Accreditation updated successfully.' : 'Accreditation saved successfully.', 'success');
                this.resetForm();
                this.accreditationSaved.emit();
            },
            error: (error) => {
                this.isSaving = false;
                this.toaster?.show('Failed to save accreditation.', 'error');
            },
            complete: () => {
                this.isSaving = false;
            }
        });
    }

    onCancel(): void {
        this.resetForm();
    }

    private resetForm() {
        const instituteId = this.instituteId ?? this.accreditationForm.get('instituteId')?.value;
        this.accreditationForm.reset({
            instituteId: instituteId,
            authorityName: '',
            licenseNumber: '',
            validFrom: null,
            validTo: null,
            isActive: true
        });
        Object.keys(this.accreditationForm.controls).forEach(key => {
            this.accreditationForm.get(key)?.setErrors(null);
        });
    }

    get isLoading(): boolean {
        return this.isSaving || this.isLoadingInstitute || this.isLoadingAccreditation;
    }

    get loadingMessage(): string {
        if (this.isSaving) return 'Saving accreditation...';
        if (this.isLoadingAccreditation) return 'Loading accreditation...';
        if (this.isLoadingInstitute) return 'Loading institute...';
        return 'Loading...';
    }

    validationMessages = {
        authorityName: {
            required: 'Authority name is required.',
            maxlength: 'Authority name cannot exceed 100 characters.'
        },
        licenseNumber: {
            required: 'License number is required.',
            maxlength: 'License number cannot exceed 100 characters.'
        }
    };

    getErrorMessage(controlName: string): string {
        const control = this.accreditationForm.get(controlName);
        if (!control || !control.errors) return '';

        for (const error in control.errors) {
            if (this.validationMessages[controlName as keyof typeof this.validationMessages]?.[error as keyof (typeof this.validationMessages)['authorityName']]) {
                return this.validationMessages[controlName as keyof typeof this.validationMessages][error as keyof (typeof this.validationMessages)['authorityName']];
            }
        }

        return '';
    }

    get authorityName() { return this.accreditationForm.get('authorityName'); }
    get licenseNumber() { return this.accreditationForm.get('licenseNumber'); }
    get validFrom() { return this.accreditationForm.get('validFrom'); }
    get validTo() { return this.accreditationForm.get('validTo'); }
}
