import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionManagementService } from '../../../concession-management/services/concession-management.service';
import { ConcessionResponse } from '../../../concession-management/models/ConcessionResponse';
import { ConcessionComponentResponse } from '../../models/ConcessionComponentResponse';


@Component({
  selector: 'app-concession-component-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './concession-component-create-form.component.html',
  styleUrls: ['./concession-component-create-form.component.css']
})
export class ConcessionComponentCreateFormComponent {
   createForm!: FormGroup;
    routedId: string | null = null;
    concessionDD: ConcessionResponse[] = [];
    resourceData?: ConcessionComponentResponse;
    isEditMode: boolean = false;
  
    constructor(
      private ConcessionManagementService: ConcessionManagementService,
      private concessionComponentManagementService: ConcessionComponentManagementService,
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router) { }
  
    ngOnInit() {
  
      this.getConcessionCatalogs();
      this.initializeForm();
      this.routedId = this.route.snapshot.paramMap.get('id');
      this.isEditMode = !!this.routedId;
  
      if (this.isEditMode) {
        console.log('Edit Mode Activated - Load data for:', this.routedId);
        this.getConcessionComponentDetails(this.routedId!);
      } else {
        console.log('Create Mode Activated');
      }
    }
  
    getConcessionComponentDetails(routedId: string): void {
      this.concessionComponentManagementService.getConcessionComponentById(routedId)
        .subscribe({
          next: (response) => {
            console.log('✅ Request Success Status:', response.status);
            console.log('📦 Response Body:', response.body);
            this.resourceData = response.body;
            console.log('📦 Request data :', this.resourceData);
            this.createForm.patchValue({
              discountTypeId: this.resourceData?.discountType.id,
              name: this.resourceData?.name,
              code: this.resourceData?.code,
              description: '',
              isActive : this.resourceData?.isActive
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
  
    private getConcessionCatalogs() {
      this.ConcessionManagementService.getAllConcessions().subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.concessionDD = response.body;
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
        discountTypeId: ['', Validators.required],
        name: ['', Validators.required],
        code: [''],
        description: [''],
        isActive:[true]
      });
    }
  
    goToSectionsList(): void {
      this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST);
    }
    onSubmit(): void {
      console.log('✅ Create Form Data:', this.createForm.getRawValue());
      if (this.createForm.invalid) {
        this.createForm.markAllAsTouched();
        console.warn('❌ Form is invalid');
        return;
      }
  
      this.concessionComponentManagementService.saveConcessionComponent(this.routedId, this.createForm.getRawValue()).subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.router.navigate(ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST);
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
  

// Form Getters
get discountTypeId() {
  return this.createForm.get('discountTypeId');
}

get name() {
  return this.createForm.get('name');
}

get code() {
  return this.createForm.get('code');
}

get description() {
  return this.createForm.get('description');
}

get isActive() {
  return this.createForm.get('isActive');
}

}