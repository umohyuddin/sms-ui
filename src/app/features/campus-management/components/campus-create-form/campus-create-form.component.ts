import { Component, Input, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { API_ENDPOINTS } from '../../../../core/const/API_ENDPOINTS';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-campus-create-form',
  standalone: true,
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './Campus-create-form.component.html',
  styleUrls: ['./Campus-create-form.component.css']
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
    private appConfig: AppConfigService
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
    if (this.appConfig.dummyDataEnablement) {
      this.patchDummyData();
    }

  }




  private getProvinces() {
    this.httpClientService.request<any>(HTTP_METHOD.GET, this.URL + API_ENDPOINTS.LOOKUP.PROVINCE.GET_ALL, {
      observeResponse: true
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.provinces = response.body;
        //this.router.navigate(['/Campuss']);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
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
      campusName: ['', [Validators.required, Validators.maxLength(50)]],
      campusCode: ['', Validators.maxLength(20)],
      isActive: [true],
      contactNumber: ['', Validators.maxLength(15)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      website: ['', Validators.maxLength(100)],
      address: ['', Validators.maxLength(200)]
    });
  }


  onProvinceChange() {
    this.createCampusForm.get('provinceId')?.valueChanges.subscribe(provinceId => {
      console.log("Province changed:", provinceId);

      // Example: Load cities based on province
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
        //this.router.navigate(['/Campuss']);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/Campuses']);
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

    // Navigate to the create Campus page
    this.router.navigate(['/Campuss']);
    //window.location.href = '/Campuss'; // Adjust the URL as needed
  }
  onSubmit(): void {
    console.log('✅ Campus Form Data:', this.createCampusForm.getRawValue());
    if (this.createCampusForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createCampusForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }



    let requestMethod: string;
    let requestUrl: string;

  if (this.isEditMode && this.campusId) {
      requestMethod = HTTP_METHOD.PATCH;
      requestUrl = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.UPDATE}/${this.campusId}`; // or a dedicated UPDATE endpoint
    } else {
      requestMethod = HTTP_METHOD.POST;
      requestUrl = `${this.URL}${API_ENDPOINTS.INSTITUTE.CAMPUSES.CREATE}`;
    }

    console.log('✅ Campus Form Data:', this.createCampusForm.getRawValue());
    this.httpClientService.request<any>(requestMethod, requestUrl, {
      observeResponse: true,
      body: this.createCampusForm.getRawValue()
    }).subscribe({
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


  //Campus getters
  get CampusName() {
    return this.createCampusForm.get('CampusName');
  }
  get CampusId() {
    return this.createCampusForm.get('CampusId');
  }
  get CampusCode() {
    return this.createCampusForm.get('CampusCode');
  }

  //keyCloak getters
  get realm() {
    return this.createCampusForm.get('CampusSettings.keyCloak.realm');
  }

  get authServerUrl() {
    return this.createCampusForm.get('CampusSettings.keyCloak.auth-server-url');
  }

  get efServerUrl() {
    return this.createCampusForm.get('CampusSettings.keyCloak.ef-server-url');
  }


  //Mongo getters
  get mongoUserName() {
    return this.createCampusForm.get('CampusSettings.mongo.userName');
  }
  get mongoPassword() {
    return this.createCampusForm.get('CampusSettings.mongo.password');
  }

  //Radis getters
  get userName() {
    return this.createCampusForm.get('CampusSettings.mongo.userName');
  }
  get password() {
    return this.createCampusForm.get('CampusSettings.mongo.password');
  }

  //Dialer getters
  get maxConcurrentCalls() {
    return this.createCampusForm.get('CampusSettings.dialer.maxConcurrentCalls');
  }

  get maxCallTime() {
    return this.createCampusForm.get('CampusSettings.dialer.maxCallTime');
  }

  get callsPerSecond() {
    return this.createCampusForm.get('CampusSettings.dialer.callsPerSecond');
  }

  get serviceIdentifier() {
    return this.createCampusForm.get('CampusSettings.dialer.serviceIdentifier');
  }


  //mediaServer getter
  get wssUrl() {
    return this.createCampusForm.get('CampusSettings.mediaServer.wssUrl');
  }

  get domain() {
    return this.createCampusForm.get('CampusSettings.mediaServer.domain');
  }


  //campaigns getter
  get domainUserName() {
    return this.createCampusForm.get('CampusSettings.campaigns.username');
  }
  get domainPassword() {
    return this.createCampusForm.get('CampusSettings.campaigns.password');
  }
  get domainUrl() {
    return this.createCampusForm.get('CampusSettings.campaigns.url');
  }


  toggleStatus(event: any) {
    const isActive = event.target.checked;
    console.log("isActive", isActive)
    this.createCampusForm.get('CampusSettings.mongo.isManaged')?.setValue(isActive);
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
          console.log('📦 Campus data :', this.campusData);
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

    this.createCampusForm.patchValue(dummyPayload);
  }
  goToCampusListing(){
    this.router.navigate([ROUTES.CAMPUS.LIST])
  }
}