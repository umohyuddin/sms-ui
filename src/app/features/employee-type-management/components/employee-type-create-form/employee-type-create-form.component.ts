import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeTypeResponse } from '../../models/EmployeeTypeResponse';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';
import { EmployeeTypeService } from '../../services/employee-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { CommonModule } from '@angular/common';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-type-create-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employee-type-create-form.component.html',
  styleUrl: './employee-type-create-form.component.css'
})
export class EmployeeTypeCreateFormComponent {
 createForm!: FormGroup;
  routedId: string | null = null
  isEditMode = false;
  resourceData: EmployeeTypeResponse | null = null;
 
  constructor(private empTypeManagementService: EmployeeTypeService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
   private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
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



  private initializeForm() {
    this.createForm = this.fb.group({
      name: ['', [Validators.required]],
      active: [true],
      description: ['']
    });
  }


  goToFeeCatelogList(): void {
    this.router.navigate(ROUTES.FEE.FEE_CATALOG.LIST);
  }
  onSubmit(): void {
    console.log('  Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.empTypeManagementService.saveEmployeeType(this.routedId, this.createForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
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
    this.empTypeManagementService.getEmployeeTypeId(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
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

  get active() {
    return this.createForm.get('active');
  }
  get description() {
    return this.createForm.get('description');
  }

}
