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
            resourceName: ['', [Validators.required, Validators.maxLength(100)]],
            moduleId: ['', [Validators.required]],
            version: ['v1'],
            description: ['', [Validators.maxLength(255)]],
            isAuthRequired: [true],
            isActive: [true]
        });
    }

    private loadModules() {
        this.resourceService.getModules().subscribe({
            next: (data) => this.modules = data || [],
            error: (err) => console.error('Error loading modules:', err)
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
            return;
        }

        this.isSaving = true;
        const payload = this.resourceForm.getRawValue();

        this.resourceService.saveResource(this.resourceId, payload).subscribe({
            next: () => {
                this.toaster?.show(this.isEditMode ? 'Resource updated' : 'Resource created', 'success');
                setTimeout(() => this.router.navigate(ROUTES.RESOURCES.LIST), 1000);
            },
            error: (err) => {
                this.isSaving = false;
                this.toaster?.show('Error saving resource', 'error');
            }
        });
    }

    onCancel() {
        this.router.navigate(ROUTES.RESOURCES.LIST);
    }
}
