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
import { CampusMetaData } from '../../models/CampusMetaData';
import { KeyValueOption } from '../../../../core/models/KeyValueOption';


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
  meta?: CampusMetaData
  createCampusForm!: FormGroup;
  routeCampusId?: string;
  URL = '';
  isEditMode = false;
  campusId: string | null = null;
  campusData: any;
  provinceDD: KeyValueOption[] = [];
  citiesDD: KeyValueOption[] = [];

  constructor(private fb: FormBuilder,
       private appConfig: AppConfigService,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private campusManagementService: CampusManagementService,

  ) { }

  ngOnInit() {

    this.loadCampusMeta();
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


  private initializeForm() {
    this.createCampusForm = this.fb.group({
      instituteId: ['', Validators.required],
      instituteName: ['', Validators.required],
      provinceId: ['', Validators.required],
      cityId: ['', Validators.required],
      campusName: ['', [Validators.required]],
      campusCode: ['', Validators.maxLength(20)],
      active: [true],
      contactNumber: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      address: ['']
    });
  }


  onProvinceChange() {
    this.createCampusForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      console.log("Province changed:", provinceId);
      // Reset city control
      this.createCampusForm.get('cityId')?.setValue(''); // reset value to null
      this.createCampusForm.get('cityId')?.markAsUntouched();
      this.createCampusForm.get('cityId')?.markAsDirty();
      this.createCampusForm.get('cityId')?.updateValueAndValidity();

      this.loadCitiesByProvince(provinceId);
    });
  }
  // loadCitiesByProvince(provinceId: any) {
  //   this.httpClientService.request<any>(HTTP_METHOD.GET, th + API_ENDPOINTS.LOOKUP.CITY.GET_BY_PROVINCE_ID(provinceId), {
  //     observeResponse: true
  //   }).subscribe({
  //     next: (response) => {
  //       console.log('  Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.cities = response.body;
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   });
  // }
  // generateCampusCode() {
  //   const timestampCode = Date.now().toString().slice(-6); // last 6 digits of current timestamp
  //   this.createCampusForm.get('CampusCode')?.setValue(timestampCode);
  // }

  goToCampusList(): void {
    this.router.navigate(['/Campuss']);
  }
  onSubmit(): void {
    console.log('  Campus Form Data:', this.createCampusForm.getRawValue());
    if (this.createCampusForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createCampusForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }

    this.campusManagementService.saveCampuse(this.campusId, this.createCampusForm.getRawValue()).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
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


    private loadCitiesByProvince(provinceId: any, callback?: () => void) {
    if (!provinceId) return;
    this.createCampusForm.get('cityId')?.setValue('');
    this.httpClientService.request<any>(
      HTTP_METHOD.GET,
      this.appConfig.apiBaseUrl + API_ENDPOINTS.LOOKUP.CITY.GET_BY_PROVINCE_ID(provinceId),
      { observeResponse: true }
    ).subscribe({
      next: (response) => {
        this.citiesDD = response.body.map((item: any) => ({
          key: item.id,
          label: item.name
        }));
      },
      error: (error) => console.error(error),
      complete: () => callback?.()
    });
  }



  loadCampusMeta(): void {
    this.campusManagementService.getCampusMeta().subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.meta = response.body;
        this.provinceDD = this.meta?.provinces.map((item: any) => ({
          key: item.id,
          label: item.name
        })) || [];
        this.createCampusForm.patchValue({
          instituteId: this.meta?.institute.id,
          instituteName: this.meta?.institute.name
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


  getCampusDetails(campusId: string): void {
    const url = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.GET_BY_ID(campusId)}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response) => {
          console.log('  Success Status:', response.status);
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