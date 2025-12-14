import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogComponentResponse } from '../../models/FeeCatalogComponentResponse';
import { FeeCatalogResponse } from '../../../fee-catalog-management/models/FeeCatalogResponse';
import { FeeCatalogComponentManagementService } from '../../services/fee-catalog-component-management.service';
import { FeeCatalogManagementService } from '../../../fee-catalog-management/services/fee-catalog-management.service';




@Component({
  selector: 'app-fee-catalog-component-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './fee-catalog-component-create-form.component.html',
  styleUrls: ['./fee-catalog-component-create-form.component.css']
})
export class FeeCatalogComponentCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  feeCatalogDD: FeeCatalogResponse[] = [];
  feeCatalogComponentData?: FeeCatalogComponentResponse;
  isEditMode: boolean = false;

  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private feeCatalogComponentManagementService: FeeCatalogComponentManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.getFeeCatalogs();
    this.initializeForm();
    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getFeeComponentDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
  }

  getFeeComponentDetails(routedId: string): void {
    this.feeCatalogComponentManagementService.getFeeCatalogComponentsById(routedId)
      .subscribe({
        next: (response) => {
          console.log('✅ Request Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.feeCatalogComponentData = response.body;
          console.log('📦 Request data :', this.feeCatalogComponentData);
          this.createForm.patchValue({
            feeCatalogId: this.feeCatalogComponentData?.feeCatalog.id,
            componentName: this.feeCatalogComponentData?.componentName,
            componentCode: this.feeCatalogComponentData?.componentCode,
            description: '',
            active : this.feeCatalogComponentData?.active,
            discountable:this.feeCatalogComponentData?.discountable
          });
        },
        error: (error) => {
          console.error('❌ Request Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Request Complete');
        }
      })
  }

  private getFeeCatalogs() {
    this.feeCatalogManagementService.getAllFeeCatalogs().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogDD = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  private initializeForm() {
    this.createForm = this.fb.group({
      feeCatalogId: ['', Validators.required],
      componentName: ['', Validators.required],
      componentCode: [''],
      description: [''],
      active:[true],
      discountable:[false]
    });
  }

  goToSectionsList(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.LIST);
  }
  onSubmit(): void {
    console.log('✅ Create standard Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.feeCatalogComponentManagementService.saveFeeCatalogComponent(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.LIST);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


  // Getters
get feeCatalogId() {
  return this.createForm.get('feeCatalogId');
}

get componentName() {
  return this.createForm.get('componentName');
}

get componentCode() {
  return this.createForm.get('componentCode');
}

get active() {
  return this.createForm.get('active');
}

  get description() {
    return this.createForm.get('description');
  }
}
