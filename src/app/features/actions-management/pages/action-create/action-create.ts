import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionService } from '../../services/action.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ActionCreateFormComponent } from '../../components/action-create-form/action-create-form.component';

@Component({
    selector: 'app-action-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ToasterComponent,
        LoaderComponent,
        ActionCreateFormComponent
    ],
    templateUrl: './action-create.html',
    styleUrl: './action-create.css'
})
export class ActionCreate implements OnInit {
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
        private actionService: ActionService
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
                if (this.isEditMode) {
                    this.actionForm.get('code')?.disable();
                }
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

    noWhitespaceValidator(control: any) {
        if (control.value && !control.value.trim()) return { whitespace: true };
        return null;
    }
}
