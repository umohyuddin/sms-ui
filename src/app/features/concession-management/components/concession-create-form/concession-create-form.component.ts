import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ConcessionManagementService } from '../../services/concession-management.service';


@Component({
  selector: 'app-concession-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './concession-create-form.component.html',
  styleUrls: ['./concession-create-form.component.css']
})
export class ConcessionCreateFormComponent {
  concessionCampusForm!: FormGroup;
  routeConcessionId: string | null = null;
  URL = '';
  isEditMode = false;
  concessionData: any;

  constructor(private fb: FormBuilder,
    private consessionManagementService: ConcessionManagementService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();

    this.routeConcessionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.routeConcessionId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.routeConcessionId);
      this.getConcessionDetails(this.routeConcessionId!);
    } else {
      console.log('Create Mode Activated');
    }
  }



  private initializeForm() {
    this.concessionCampusForm = this.fb.group({
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
    this.router.navigate([ROUTES.CONCESSION.CONCESSION_TYPE.LIST]);
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.concessionCampusForm.getRawValue());
    if (this.concessionCampusForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.concessionCampusForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }
    this.consessionManagementService.saveConcession(this.routeConcessionId,this.concessionCampusForm.getRawValue()).subscribe({
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


  getConcessionDetails(concessionId: string): void {
    this.consessionManagementService.getConcessionById(concessionId).subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.concessionData = response.body;
          console.log('📦 Campus data :', this.concessionData);
          this.concessionCampusForm.patchValue(this.concessionData);
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
  private patchDummyData() {
    const dummyPayload = {
      instituteId: 1,

      campusName: 'Dummy Campus',
      campusCode: 'D-002',
      isActive: true,
      contactNumber: '03001234567',
      email: 'dummy@school.com',
      website: 'https://dummy.com',
      address: 'Dummy street, Karachi'
    };

    this.concessionCampusForm.patchValue(dummyPayload);
  }
  goToCampusListing() {
    this.router.navigate(ROUTES.CAMPUS.LIST)
  }


  //getters
  get campusName() {
    return this.concessionCampusForm.get('campusName');
  }

  get contactNumber() {
    return this.concessionCampusForm.get('contactNumber');
  }
  get email() {
    return this.concessionCampusForm.get('email');
  }

  get provinceId() {
    return this.concessionCampusForm.get('provinceId');
  }
  get cityId() {
    return this.concessionCampusForm.get('cityId');
  }
}