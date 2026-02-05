import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { InstituteFinancialSettings } from '../../models/InstituteFinancialSettings';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';

@Component({
    selector: 'app-institute-financial-settings-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoaderComponent, ToasterComponent],
    templateUrl: './institute-financial-settings-form.component.html',
    styleUrl: './institute-financial-settings-form.component.css'
})
export class InstituteFinancialSettingsFormComponent implements OnInit {
    @Input() instituteId!: number;
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    financialForm!: FormGroup;
    settingsId?: number;
    currentAcademicYearId?: number;

    isSaving = false;
    isLoading = false;

    currencies: any[] = [];
    taxTypes: any[] = [];

    constructor(
        private fb: FormBuilder,
        private schoolService: SchoolProfileManagementService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadLookups();
        this.loadCurrentYearAndSettings();
    }

    get loadingMessage(): string {
        if (this.isSaving) return 'Saving settings...';
        return 'Loading...';
    }

    private initForm(): void {
        this.financialForm = this.fb.group({
            currencyId: [null, Validators.required],
            languageId: [null],
            locale: ['en-PK', [Validators.required, Validators.maxLength(10)]],
            feeFrequency: ['MONTHLY', Validators.required],
            allowPartialPayments: [false],
            lateFeeApplicable: [false],
            lateFeeType: ['FIXED'],
            lateFeeValue: [0],
            taxApplicable: [false],
            taxTypeId: [null],
            taxIncludedInFee: [false],
            refundsAllowed: [false],
            refundPolicyUrl: ['', Validators.maxLength(255)],
            refundWindowDays: [30],
            maxRefundPercentage: [0, [Validators.min(0), Validators.max(100)]],
            maxRefundAmount: [0, Validators.min(0)],
            invoiceMandatory: [false],
            receiptMandatory: [true],
            isActive: [true]
        });
    }

    private loadLookups(): void {
        this.schoolService.getCurrencies().subscribe({
            next: (res) => this.currencies = res.body || [],
            error: () => console.error('Failed to load currencies')
        });

        this.schoolService.getTaxTypes().subscribe({
            next: (res) => this.taxTypes = res.body || [],
            error: () => console.error('Failed to load tax types')
        });
    }

    private loadCurrentYearAndSettings(): void {
        this.isLoading = true;
        this.schoolService.getCurrentAcademicYear().subscribe({
            next: (yearRes) => {
                this.currentAcademicYearId = yearRes.body?.id;
                if (this.currentAcademicYearId) {
                    this.loadSettings();
                } else {
                    this.isLoading = false;
                    this.toaster?.show('Current academic year not found.', 'error');
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.toaster?.show('Failed to load current academic year.', 'error');
            }
        });
    }

    private loadSettings(): void {
        if (!this.instituteId || !this.currentAcademicYearId) {
            this.isLoading = false;
            return;
        }

        this.schoolService.getFinancialSettings(this.instituteId, this.currentAcademicYearId).subscribe({
            next: (res) => {
                if (res.body) {
                    this.settingsId = res.body.id;
                    this.financialForm.patchValue(res.body);
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                // 404 is expected if not set yet, so don't show error toastr
                if (err.status !== 404) {
                    this.toaster?.show('Failed to load existing settings.', 'error');
                }
            }
        });
    }

    onSubmit(): void {
        if (this.financialForm.invalid) {
            this.financialForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        const payload: InstituteFinancialSettings = {
            ...this.financialForm.value,
            instituteId: this.instituteId,
            academicYearId: this.currentAcademicYearId!
        };

        const request$ = this.settingsId
            ? this.schoolService.updateFinancialSettings(this.settingsId, payload)
            : this.schoolService.createFinancialSettings(payload);

        request$.subscribe({
            next: (res) => {
                if (!this.settingsId) this.settingsId = res.body?.id;
                this.toaster?.show('Financial settings saved successfully.', 'success');
                this.isSaving = false;
            },
            error: (err) => {
                this.isSaving = false;
                this.toaster?.show('Failed to save financial settings.', 'error');
            }
        });
    }
}
