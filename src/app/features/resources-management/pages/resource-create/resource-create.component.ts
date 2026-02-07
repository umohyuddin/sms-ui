import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../services/resource.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ModuleResponse } from '../../../permission-management/models/ModuleResponse';

@Component({
    selector: 'app-resource-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './resource-create.component.html',
    styleUrl: './resource-create.component.css'
})
export class ResourceCreateComponent implements OnInit {
    @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

    resourceForm!: FormGroup;
    isEditMode = false;
    resourceId: string | null = null;
    isSaving = false;
    loaderMessage = 'Processing...';
    modules: ModuleResponse[] = [];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private resourceService: ResourceService
    ) { }

    ngOnInit() {
        this.resourceId = this.route.snapshot.paramMap.get('id');
        this.isEditMode = !!this.resourceId;
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
            },
            error: (err) => console.error('Error loading resource:', err)
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
                this.toaster?.show('Failed to save resource.', 'error');
                console.error('Error saving resource:', err);
            },
            complete: () => {
                this.isSaving = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.RESOURCES.LIST);
    }

    // Getters
    get resourceName() { return this.resourceForm.get('resourceName'); }
    get moduleId() { return this.resourceForm.get('moduleId'); }
    get version() { return this.resourceForm.get('version'); }
    get description() { return this.resourceForm.get('description'); }

    noWhitespaceValidator(control: any) {
        if (control.value && !control.value.trim()) return { whitespace: true };
        return null;
    }

    getErrorMessage(controlName: keyof typeof this.validationMessages): string {
        const control = this.resourceForm.get(controlName as string);
        if (!control || !control.errors) return '';

        for (const error in control.errors) {
            const key = error as keyof typeof this.validationMessages[typeof controlName];
            if (this.validationMessages[controlName][key]) return this.validationMessages[controlName][key];
        }

        return '';
    }

    validationMessages = {
        resourceName: {
            required: 'Resource Name is required.',
            maxlength: 'Resource Name cannot exceed 100 characters.',
            whitespace: 'Resource Name cannot be empty or whitespace only.'
        },
        moduleId: {
            required: 'Module is required.'
        },
        version: {
            maxlength: 'Version cannot exceed 10 characters.'
        },
        description: {
            maxlength: 'Description cannot exceed 255 characters.'
        }
    };
}
