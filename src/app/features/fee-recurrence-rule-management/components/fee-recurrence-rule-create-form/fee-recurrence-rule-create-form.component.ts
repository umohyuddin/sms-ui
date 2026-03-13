import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FeeRecurrenceRuleManagementService } from '../../services/fee-recurrence-rule-management.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerUtil } from '../../../../core/utils/LoggerUtil';

@Component({
    selector: 'app-fee-recurrence-rule-create-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, LoaderComponent, ToasterComponent],
    templateUrl: './fee-recurrence-rule-create-form.component.html',
    styleUrls: ['./fee-recurrence-rule-create-form.component.css']
})
export class FeeRecurrenceRuleCreateFormComponent implements OnInit {
    pageConst = PageTexts;
    ruleForm!: FormGroup;
    isEditMode = false;
    ruleId: string | null = null;
    isLoading = false;
    loadingMessage = '';

    @ViewChild('toaster') private toaster?: ToasterComponent;

    private readonly MODULE = 'FeeRecurrenceRule';
    private readonly COMPONENT = 'FeeRecurrenceRuleForm';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private feeRecurrenceRuleService: FeeRecurrenceRuleManagementService
    ) { }

    ngOnInit() {
        LoggerUtil.group(`📌 [${this.MODULE}] Init`);
        this.initializeForm();

        this.ruleId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.ruleId;

        if (this.isEditMode) {
            this.loadRuleDetails(this.ruleId!);
        }
        LoggerUtil.groupEnd();
    }

    private initializeForm() {
        this.ruleForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(150), this.noWhitespaceValidator]],
            code: ['', [Validators.required, Validators.maxLength(20), this.noWhitespaceValidator]],
            description: ['', [Validators.maxLength(500)]],
            isActive: [true]
        });
    }

    loadRuleDetails(id: string): void {
        this.isLoading = true;
        this.feeRecurrenceRuleService.getFeeRecurrenceRuleById(id).subscribe({
            next: (response) => {
                const data = response.body;
                this.ruleForm.patchValue({
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    isActive: data.isActive
                });
            },
            error: (error: any) => {
                LoggerUtil.error(this.MODULE, 'Details', '❌ Failed to load rule details', error);
                this.toaster?.show('Failed to load rule details.', 'error');
            },
            complete: () => this.isLoading = false
        });
    }

    toggleActive(): void {
        const currentValue = this.ruleForm.get('isActive')?.value;
        this.ruleForm.get('isActive')?.setValue(!currentValue);
    }

    goToRuleListing(): void {
        this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.LIST);
    }

    onSubmit(): void {
        if (this.ruleForm.invalid) {
            this.ruleForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.loadingMessage = this.isEditMode ? 'Updating Rule...' : 'Adding New Rule...';

        this.feeRecurrenceRuleService.saveFeeRecurrenceRule(this.ruleId, this.ruleForm.getRawValue())
            .subscribe({
                next: (response: any) => {
                    const message = response?.body?.message || (this.isEditMode ? 'Rule updated successfully' : 'Rule created successfully');
                    this.toaster?.show(message, 'success');
                    setTimeout(() => {
                        this.router.navigate(ROUTES.FEE.FEE_RECURRENCE_RULE.LIST);
                    }, 1500);
                },
                error: (error: any) => {
                    this.isLoading = false;
                    this.loadingMessage = '';
                    this.toaster?.show('Failed to save rule details.', 'error');
                },
                complete: () => {
                    this.isLoading = false;
                    this.loadingMessage = '';
                }
            });
    }

    noWhitespaceValidator(control: any) {
        if (control.value && typeof control.value === 'string' && !control.value.trim()) return { whitespace: true };
        return null;
    }

    getErrorMessage(controlName: string): string {
        const control = this.ruleForm.get(controlName);
        if (!control || !control.errors) return '';

        if (control.errors['required']) return 'This field is required.';
        if (control.errors['maxlength']) return `Maximum length is ${control.errors['maxlength'].requiredLength} characters.`;
        if (control.errors['whitespace']) return 'Value cannot be whitespace only.';

        return '';
    }
}
