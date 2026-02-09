import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
    selector: 'app-action-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './action-create.html'
})
export class ActionCreateComponent implements OnInit {
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    actionForm!: FormGroup;
    isEditMode = false;
    actionId: string | null = null;
    isSaving = false;
    loaderMessage = 'Processing...';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private actionService: ActionService,
        private logger: LoggerService
    ) { }

    ngOnInit() {
        this.actionId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.actionId;
        this.initializeForm();

        if (this.isEditMode && this.actionId) {
            this.loadActionDetails(this.actionId);
        }
    }

    private initializeForm() {
        this.actionForm = this.fb.group({
            code: ['', [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator]],
            name: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
            description: ['', [Validators.maxLength(255)]],
            active: [true]
        });
    }

    private loadActionDetails(id: string) {
        this.actionService.getActionById(id).subscribe({
            next: (data) => {
                this.actionForm.patchValue(data);
                this.actionForm.get('code')?.disable();
            },
            error: (err) => console.error('Error loading action:', err)
        });
    }

    onSubmit() {
        if (this.actionForm.invalid) {
            this.actionForm.markAllAsTouched();
            return;
        }

        this.isSaving = true;
        this.loaderMessage = this.isEditMode ? 'Updating Action...' : 'Creating Action...';
        const payload = this.actionForm.getRawValue();

        this.actionService.saveAction(this.actionId, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEditMode ? 'Action updated successfully.' : 'Action created successfully.', 'success');
                setTimeout(() => this.router.navigate(ROUTES.ACTIONS.LIST), 1000);
            },
            error: (err) => {
                this.isSaving = false;
                this.toaster?.show('Failed to save action.', 'error');
                console.error('Error saving action:', err);
            },
            complete: () => {
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.ACTIONS.LIST);
    }

    // Getters
    get code() { return this.actionForm.get('code'); }
    get name() { return this.actionForm.get('name'); }
    get description() { return this.actionForm.get('description'); }

    noWhitespaceValidator(control: any) {
        if (control.value && !control.value.trim()) return { whitespace: true };
        return null;
    }

    getErrorMessage(controlName: keyof typeof this.validationMessages): string {
        const control = this.actionForm.get(controlName as string);
        if (!control || !control.errors) return '';

        for (const error in control.errors) {
            const key = error as keyof typeof this.validationMessages[typeof controlName];
            if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
        }

        return '';
    }

    validationMessages = {
        code: {
            required: 'Action Code is required.',
            maxlength: 'Action Code cannot exceed 50 characters.',
            whitespace: 'Action Code cannot be empty or whitespace only.'
        },
        name: {
            required: 'Action Name is required.',
            maxlength: 'Action Name cannot exceed 100 characters.',
            whitespace: 'Action Name cannot be empty or whitespace only.'
        },
        description: {
            maxlength: 'Description cannot exceed 255 characters.'
        }
    };
}
