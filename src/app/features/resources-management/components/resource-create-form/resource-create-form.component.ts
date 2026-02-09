import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ResourceService } from '../../services/resource.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ModuleResponse } from '../../../permission-management/models/ModuleResponse';

@Component({
    selector: 'app-resource-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './resource-create-form.component.html',
    styleUrl: './resource-create-form.component.css'
})
export class ResourceCreateFormComponent implements OnInit {
    @Input() resourceId: string | null = null;
    @Input() isEditMode = false;
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    resourceForm!: FormGroup;
    isSaving = false;
    loaderMessage = 'Processing...';
    modules: ModuleResponse[] = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private resourceService: ResourceService
    , private logger: LoggerService) { }

    ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
        this.initializeForm();
        this.loadModules();

        if (this.isEditMode && this.resourceId) {
            this.loadResourceDetails(this.resourceId);
        }
    }

    private initializeForm() {
        this.resourceForm = this.fb.group({
            resourceName: ['', [Validators.required, Validators.maxLength(100), this.noWhitespaceValidator]],
            moduleId: ['', [Validators.required]],
            version: ['v1', [Validators.maxLength(10)]],
            description: ['', [Validators.maxLength(255)]],
            isAuthRequired: [true],
            isActive: [true]
        });
    }

    private loadModules() {
        this.resourceService.getModules().subscribe({
            next: (data) => {
                console.log('✅ Modules loaded:', data);
                this.modules = data || [];
            },
            error: (err) => {
                console.error('❌ Error loading modules:', err);
                this.toaster?.show('Failed to load modules.', 'error');
            }
        });
    }

    private loadResourceDetails(id: string) {
        this.resourceService.getResourceById(id).subscribe({
            next: (data) => {
                this.resourceForm.patchValue({
                    ...data,
                    moduleId: data.module?.id
                });
                console.log('✅ Resource Details loaded:', data);
            },
            error: (err) => {
                console.error('❌ Error loading resource:', err);
                this.toaster?.show('Failed to load resource details.', 'error');
            }
        });
    }

    onSubmit() {
        if (this.resourceForm.invalid) {
            this.resourceForm.markAllAsTouched();
            this.toaster?.show('Please fix validation errors before submitting.', 'error');
            return;
        }

        this.isSaving = true;
        this.loaderMessage = this.isEditMode ? 'Updating Resource...' : 'Creating Resource...';
        const payload = this.resourceForm.getRawValue();

        this.resourceService.saveResource(this.resourceId, payload).subscribe({
            next: () => {
                this.toaster?.show(
                    this.isEditMode ? 'Resource updated successfully.' : 'Resource created successfully.',
                    'success'
                );
                setTimeout(() => this.router.navigate(ROUTES.RESOURCES.LIST), 1000);
            },
            error: (err) => {
                this.isSaving = false;
                this.toaster?.show(
                    this.isEditMode ? 'Failed to update resource.' : 'Failed to create resource.',
                    'error'
                );
                console.error('Save error:', err);
            },
            complete: () => {
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.RESOURCES.LIST);
    }

    noWhitespaceValidator(control: any): { [key: string]: any } | null {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    get resourceName() {
        return this.resourceForm.get('resourceName');
    }

    get moduleId() {
        return this.resourceForm.get('moduleId');
    }

    get version() {
        return this.resourceForm.get('version');
    }

    get description() {
        return this.resourceForm.get('description');
    }

    getErrorMessage(fieldName: string): string {
        const control = this.resourceForm.get(fieldName);
        if (control?.hasError('required')) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        if (control?.hasError('maxlength')) {
            const maxLength = control.getError('maxlength').requiredLength;
            return `Maximum ${maxLength} characters allowed`;
        }
        if (control?.hasError('whitespace')) {
            return 'This field cannot be empty or whitespace only';
        }
        return 'Invalid input';
    }
}
