import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargeTypeManagementService } from '../../services/charge-type-management.service';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { PageTexts } from '../../../../core/const/PAGE_TEXT';

@Component({
    selector: 'app-charge-type-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToasterComponent, LoaderComponent],
    templateUrl: './charge-type-create-form.component.html',
    styleUrls: ['./charge-type-create-form.component.css']
})
export class ChargeTypeCreateFormComponent implements OnInit {
    chargeTypeForm: FormGroup;
    isEditMode = false;
    chargeTypeId: string | null = null;
    isLoading = false;
    loadingMessage = '';
    texts = PageTexts.chargeType;

    @ViewChild('toaster') private toaster?: ToasterComponent;

    constructor(
        private fb: FormBuilder,
        private chargeTypeService: ChargeTypeManagementService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.chargeTypeForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            code: ['', [Validators.required, Validators.maxLength(50)]],
            description: ['', [Validators.maxLength(255)]],
            active: [true]
        });
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.chargeTypeId = params.get('id');
            if (this.chargeTypeId) {
                this.isEditMode = true;
                this.loadChargeType();
            }
        });
    }

    private loadChargeType(): void {
        if (!this.chargeTypeId) return;
        this.isLoading = true;
        this.loadingMessage = 'Loading...';
        this.chargeTypeService.getById(this.chargeTypeId).subscribe({
            next: (response) => {
                const data = response.body;
                this.chargeTypeForm.patchValue({
                    name: data.name,
                    code: data.code,
                    description: data.description,
                    active: data.active
                });
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                this.toaster?.show('Failed to load charge type data.', 'error');
            }
        });
    }

    onSubmit(): void {
        if (this.chargeTypeForm.invalid) {
            this.chargeTypeForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.loadingMessage = this.isEditMode ? 'Updating...' : 'Creating...';
        const requestData = this.chargeTypeForm.value;

        const action$ = this.isEditMode && this.chargeTypeId
            ? this.chargeTypeService.update(this.chargeTypeId, requestData)
            : this.chargeTypeService.create(requestData);

        action$.subscribe({
            next: () => {
                this.isLoading = false;
                this.toaster?.show(this.isEditMode ? 'Charge type updated successfully' : 'Charge type created successfully', 'success');
                setTimeout(() => this.router.navigate(ROUTES.FEE.CHARGE_TYPE.LIST), 1500);
            },
            error: (error) => {
                this.isLoading = false;
                this.toaster?.show('Operation failed.', 'error');
                console.error('Submit error:', error);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(ROUTES.FEE.CHARGE_TYPE.LIST);
    }
}
