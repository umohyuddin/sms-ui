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
import { CampusManagementService } from '../../services/campus-management.service';


@Component({
  selector: 'app-campus-create-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './campus-create-form.component.html',
  styleUrls: ['./campus-create-form.component.css']
})
export class CampusCreateFormComponent {
  createCampusForm!: FormGroup;
  routeCampusId?: string;
  URL = '';
  isEditMode = false;
  campusId: string | null = null;
  campusData: any;
  provinces: any[] = [];
  cities: any[] = [];

  constructor(private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService,
    private campusManagementService: CampusManagementService,

  ) { }

  ngOnInit() {

    console.log('Config:', this.appConfig);
    this.URL = this.appConfig.apiBaseUrl;

    this.getProvinces();
    this.initializeForm();

    this.campusId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.campusId;

    if (this.isEditMode) {
      console.log('Edit Mode Activated - Load data for:', this.campusId);
      this.getCampusDetails(this.campusId!);
    } else {
      console.log('Create Mode Activated');
    }


    this.onProvinceChange();

  }

  private getProvinces() {
    this.httpClientService.request<any>(HTTP_METHOD.GET, this.URL + API_ENDPOINTS.LOOKUP.PROVINCE.GET_ALL, {
      observeResponse: true
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.provinces = response.body;
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
    this.createCampusForm = this.fb.group({
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


  onProvinceChange() {
    this.createCampusForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      console.log("Province changed:", provinceId);
      const cityControl = this.createCampusForm.get('cityId');
      // Reset city control
      this.createCampusForm.get('cityId')?.setValue(''); // reset value to null
      this.createCampusForm.get('cityId')?.markAsUntouched();
      this.createCampusForm.get('cityId')?.markAsDirty();
      this.createCampusForm.get('cityId')?.updateValueAndValidity();

      this.loadCitiesByProvince(provinceId);
    });
  }
  loadCitiesByProvince(provinceId: any) {
    this.httpClientService.request<any>(HTTP_METHOD.GET, this.URL + API_ENDPOINTS.LOOKUP.CITIY.GET_BY_PROVINCE_ID(provinceId), {
      observeResponse: true
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.cities = response.body;
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
  // generateCampusCode() {
  //   const timestampCode = Date.now().toString().slice(-6); // last 6 digits of current timestamp
  //   this.createCampusForm.get('CampusCode')?.setValue(timestampCode);
  // }

  goToCampusList(): void {
    this.router.navigate(['/Campuss']);
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.createCampusForm.getRawValue());
    if (this.createCampusForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createCampusForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.campusManagementService.saveCampuse(this.campusId, this.createCampusForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(ROUTES.CAMPUS.LIST);
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


  getCampusDetails(campusId: string): void {
    const url = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_BY_ID(campusId)}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response) => {
          console.log('✅ Success Status:', response.status);
          console.log('📦 Response Body:', response.body);
          this.campusData = response.body;
          this.createCampusForm.patchValue(this.campusData);
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
    return this.createCampusForm.get('campusName');
  }

  get contactNumber() {
    return this.createCampusForm.get('contactNumber');
  }
  get email() {
    return this.createCampusForm.get('email');
  }

  get provinceId() {
    return this.createCampusForm.get('provinceId');
  }
  get cityId() {
    return this.createCampusForm.get('cityId');
  }
}