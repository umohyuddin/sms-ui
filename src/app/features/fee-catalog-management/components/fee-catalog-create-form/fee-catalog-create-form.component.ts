import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { FeeCatalogManagementService } from '../../services/fee-catalog-management.service';
import { FeeConfig, KeyValueOption } from '../../models/feeConfig';
import { FeeCatalogResponse } from '../../models/FeeCatalogResponse';


@Component({
  selector: 'app-fee-catalog-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './fee-catalog-create-form.component.html',
  styleUrls: ['./fee-catalog-create-form.component.css']
})
export class FeeCatalogCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null
  isEditMode = false;
  resourceData: FeeCatalogResponse | null = null;
 
  recurrenceRuleOptions: KeyValueOption[] = [];
  chargeTypeOptions: KeyValueOption[]=  [];

  constructor(private feeCatalogManagementService: FeeCatalogManagementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFeeCatalogMeta();
    this.initializeForm();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getFeeCatalogDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
  }

  private getFeeCatalogMeta() {
    this.feeCatalogManagementService.getFeeCatalogMeta().subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.recurrenceRuleOptions = Object.entries(response.body.recurrenceRules).map(
          ([key, label]) => ({ key, label: label as string })
        );

        this.chargeTypeOptions = Object.entries(response.body.chargeTypes).map(
          ([key, label]) => ({ key, label: label as string })
        );
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
      name: ['', [Validators.required]],
      code: ['', Validators.maxLength(20)],
      active: [true],
      chargeType: ['', Validators.required],
      recurrenceRule: ['', Validators.required],
      description: ['']
    });
  }


  goToFeeCatelogList(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.LIST);
  }
  onSubmit(): void {
    console.log('✅ Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.feeCatalogManagementService.saveFeeCatalog(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.FEE.FEE_CATALOG.LIST);
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


  getFeeCatalogDetails(routedId: string): void {
    this.feeCatalogManagementService.getFeeCatalogById(routedId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceData = response.body;
        this.createForm.patchValue(this.resourceData ?? {});
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

  //getters
  get name() {
    return this.createForm.get('name');
  }

  get code() {
    return this.createForm.get('code');
  }

  get active() {
    return this.createForm.get('active');
  }

  get chargeType() {
    return this.createForm.get('chargeType');
  }

  get recurrenceRule() {
    return this.createForm.get('recurrenceRule');
  }

  get description() {
    return this.createForm.get('description');
  }

}
