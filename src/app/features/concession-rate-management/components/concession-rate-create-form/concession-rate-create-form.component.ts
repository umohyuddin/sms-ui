import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionRateManagementService } from '../../services/concession-rate-management.service';


@Component({
  selector: 'app-concession-rate-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './concession-rate-create-form.component.html',
  styleUrls: ['./concession-rate-create-form.component.css']
})
export class ConcessionRateCreateFormComponent {
  createForm!: FormGroup;
  routedId: string | null = null;
  URL = '';
  isEditMode = false;
  resourceData: any;

  constructor(private fb: FormBuilder,
    private consessionRateManagementService: ConcessionRateManagementService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();

    this.routedId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routedId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routedId);
      this.getConcessionRateDetails(this.routedId!);
    } else {
      console.log('Create Mode Activated');
    }
  }



  private initializeForm() {
    this.createForm = this.fb.group({
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



  goToConcessionRateList(): void {
    this.router.navigate([ROUTES.CONCESSION.CONCESSION_RATE.LIST]);
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.createForm.getRawValue());
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.consessionRateManagementService.saveConcessionComponent(this.routedId,this.createForm.getRawValue()).subscribe({
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


  getConcessionRateDetails(concessionId: string): void {
    this.consessionRateManagementService.getConcessionRateById(concessionId).subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.resourceData = response.body;
          console.log('📦 Campus data :', this.resourceData);
          this.createForm.patchValue(this.resourceData);
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
    return this.createForm.get('campusName');
  }

  get contactNumber() {
    return this.createForm.get('contactNumber');
  }
  get email() {
    return this.createForm.get('email');
  }

  get provinceId() {
    return this.createForm.get('provinceId');
  }
  get cityId() {
    return this.createForm.get('cityId');
  }
}