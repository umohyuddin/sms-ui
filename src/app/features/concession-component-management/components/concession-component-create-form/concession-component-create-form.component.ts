import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';


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
  concessionComponentCampusForm!: FormGroup;
  routeConcessionConponentId: string | null = null;
  URL = '';
  isEditMode = false;
  concessionComponentData: any;

  constructor(private fb: FormBuilder,
    private consessionComponentManagementService: ConcessionComponentManagementService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();

    this.routeConcessionConponentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routeConcessionConponentId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routeConcessionConponentId);
      this.getConcessionComponentDetails(this.routeConcessionConponentId!);
    } else {
      console.log('Create Mode Activated');
    }
  }



  private initializeForm() {
    this.concessionComponentCampusForm = this.fb.group({
      instituteId: [1, Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      campusName: ['', [Validators.required]],
      campusCode: ['', Validators.maxLength(20)],
      isActive: [true],
      contactNumber: ['', [Validators.required, Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      address: ['']
    });
  }



  goToConcessionList(): void {
    this.router.navigate([ROUTES.CONCESSION.CONCESSION__SUB_TYPE.LIST]);
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.concessionComponentCampusForm.getRawValue());
    if (this.concessionComponentCampusForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.concessionComponentCampusForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.consessionComponentManagementService.saveConcessionComponent(this.routeConcessionConponentId,this.concessionComponentCampusForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(['/Campuss']);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/Campuss']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


  getConcessionComponentDetails(concessionId: string): void {
    this.consessionComponentManagementService.getConcessionComponentById(concessionId).subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.concessionComponentData = response.body;
          console.log('📦 Campus data :', this.concessionComponentData);
          this.concessionComponentCampusForm.patchValue(this.concessionComponentData);
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
  
  goToCampusListing() {
    this.router.navigate(ROUTES.CAMPUS.LIST)
  }


  //getters
  get campusName() {
    return this.concessionComponentCampusForm.get('campusName');
  }

  get contactNumber() {
    return this.concessionComponentCampusForm.get('contactNumber');
  }
  get email() {
    return this.concessionComponentCampusForm.get('email');
  }

  get provinceId() {
    return this.concessionComponentCampusForm.get('provinceId');
  }
  get cityId() {
    return this.concessionComponentCampusForm.get('cityId');
  }
}