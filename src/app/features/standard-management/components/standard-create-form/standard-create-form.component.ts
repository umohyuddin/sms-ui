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


@Component({
  selector: 'app-standard-create-form',
  standalone: true,
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './standard-create-form.component.html',
  styleUrls: ['./standard-create-form.component.css']
})
export class StandardCreateFormComponent {
  createStandardForm!: FormGroup;
  routestandardId?: string;
  URL = '';
  mode = '';
  standardData: any;
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
        //this.router.navigate(['/standards']);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/standardes']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  private initializeForm() {
    this.createStandardForm = this.fb.group({
      school: [null, Validators.required],
      standardName: ['', [Validators.required, Validators.maxLength(50)]],
      standardCode: ['', Validators.maxLength(20)],
      isActive: [true],
      contact: ['', Validators.maxLength(15)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      website: ['', Validators.maxLength(100)],
      province: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.maxLength(200)]
    });
  }


  onProvinceChange() {
    this.createStandardForm.get('province')?.valueChanges.subscribe(provinceId => {
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
        //this.router.navigate(['/standards']);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
        //this.router.navigate(['/standardes']);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
  // generatestandardCode() {
  //   const timestampCode = Date.now().toString().slice(-6); // last 6 digits of current timestamp
  //   this.createstandardForm.get('standardCode')?.setValue(timestampCode);
  // }

  goTostandardList(): void {

    // Navigate to the create standard page
    this.router.navigate(['/standards']);
    //window.location.href = '/standards'; // Adjust the URL as needed
  }
  onSubmit(): void {
    console.log('✅ standard Form Data:', this.createStandardForm.getRawValue());
    if (this.createStandardForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.createStandardForm.markAllAsTouched();
      console.warn('❌ Form is invalid');
      return;
    }



    let requestMethod: string;
    let requestUrl: string;

    if (this.mode === 'create') {
      requestMethod = HTTP_METHOD.POST;
      requestUrl = this.URL;
    } else {
      requestMethod = HTTP_METHOD.PATCH;
      requestUrl = `${this.URL}/${this.routestandardId}`;
    }


    console.log('✅ standard Form Data:', this.createStandardForm.getRawValue());
    this.httpClientService.request<any>(requestMethod, requestUrl, {
      observeResponse: true,
      body: this.createStandardForm.getRawValue()
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(['/standards']);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/standards']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


  //standard getters
  get standardName() {
    return this.createStandardForm.get('standardName');
  }
  get standardId() {
    return this.createStandardForm.get('standardId');
  }
  get standardCode() {
    return this.createStandardForm.get('standardCode');
  }

  //keyCloak getters
  get realm() {
    return this.createStandardForm.get('standardSettings.keyCloak.realm');
  }

  get authServerUrl() {
    return this.createStandardForm.get('standardSettings.keyCloak.auth-server-url');
  }

  get efServerUrl() {
    return this.createStandardForm.get('standardSettings.keyCloak.ef-server-url');
  }


  //Mongo getters
  get mongoUserName() {
    return this.createStandardForm.get('standardSettings.mongo.userName');
  }
  get mongoPassword() {
    return this.createStandardForm.get('standardSettings.mongo.password');
  }

  //Radis getters
  get userName() {
    return this.createStandardForm.get('standardSettings.mongo.userName');
  }
  get password() {
    return this.createStandardForm.get('standardSettings.mongo.password');
  }

  //Dialer getters
  get maxConcurrentCalls() {
    return this.createStandardForm.get('standardSettings.dialer.maxConcurrentCalls');
  }

  get maxCallTime() {
    return this.createStandardForm.get('standardSettings.dialer.maxCallTime');
  }

  get callsPerSecond() {
    return this.createStandardForm.get('standardSettings.dialer.callsPerSecond');
  }

  get serviceIdentifier() {
    return this.createStandardForm.get('standardSettings.dialer.serviceIdentifier');
  }


  //mediaServer getter
  get wssUrl() {
    return this.createStandardForm.get('standardSettings.mediaServer.wssUrl');
  }

  get domain() {
    return this.createStandardForm.get('standardSettings.mediaServer.domain');
  }


  //campaigns getter
  get domainUserName() {
    return this.createStandardForm.get('standardSettings.campaigns.username');
  }
  get domainPassword() {
    return this.createStandardForm.get('standardSettings.campaigns.password');
  }
  get domainUrl() {
    return this.createStandardForm.get('standardSettings.campaigns.url');
  }


  toggleStatus(event: any) {
    const isActive = event.target.checked;
    console.log("isActive", isActive)
    this.createStandardForm.get('standardSettings.mongo.isManaged')?.setValue(isActive);
  }

  getstandardDetails(standardId: string): void {

    const url = `${this.URL}/${standardId}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.standardData = response.body;
          console.log('standard Details:', this.standardData);
          this.createStandardForm.patchValue(this.standardData);
        },
        error: (error) => {
          console.error('❌ Error Status:', error.status);
          console.error('Message:', error.message);
        }
      });
  }

  DUMMY_PAYLOAD = {
    standardName: "teststandard",
    standardId: "teststandard",
    standardCode: "101",
    standardSettings: {
      keyCloak: {
        realm: "teststandard",
        "auth-server-url": "https://test-server.com/auth/",
        "ef-server-url": "https://test-server.com/unified-admin/",
        "ssl-required": "external",
        resource: "cim",
        "verify-token-audience": false,
        credentials: {
          secret: "12345678-abcd-efgh-ijkl-9876543210ab"
        },
        "use-resource-role-mappings": true,
        "confidential-port": 0,
        "policy-enforcer": {},
        CLIENT_ID: "cim",
        CLIENT_DB_ID: "12345678-abcd-efgh-ijkl-9876543210ab",
        GRANT_TYPE: "password",
        GRANT_TYPE_PAT: "client_credentials",
        USERNAME_ADMIN: "admin",
        PASSWORD_ADMIN: "admin",
        MASTER_USERNAME: "admin",
        MASTER_PASSWORD: "admin",
        SCOPE_NAME: "default-scope",
        "bearer-only": true,
        FINESSE_URL: "https://finesse-test",
        TWILIO_SID: "AC1234567890abcdef1234567890abcdef",
        TWILIO_VERIFY_SID: "VA1234567890abcdef1234567890abcdef",
        TWILIO_AUTH_TOKEN: "abcdef1234567890abcdef1234567890",
        RSA_Server_URL: "https://rsa-server",
        RSA_Client_Key: "client-key",
        RSA_Client_ID: "client-id",
        PASSWORD_EXPIRY_WARNING_LIMIT: 15
      },
      redis: {
        userName: "teststandard",
        password: "Test1234!"
      },
      mongo: {
        userName: "teststandard",
        password: "Test1234!"
      },
      campaigns: {
        url: "http://campaigns-test:1880",
        username: "admin",
        password: "admin"
      },
      surveys: {
        url: "http://surveys-test:1880",
        username: "admin",
        password: "admin"
      },
      finesse: {
        url: "https://finesse-test",
        adminUser: "finesseAdmin",
        adminPass: "finessePass"
      },
      secureLink: {
        linkExpiryTime: 30
      },
      dialer: {
        serviceIdentifier: "9001",
        maxConcurrentCalls: "10",
        maxCallTime: "120",
        callsPerSecond: "20"
      },
      fqdn: "test-server.com",
      subDomain: "test-server"
    },
    status: "Active",
    createdBy: "admin",
    updatedBy: "admin",
    createdAt: "2025-11-03T12:00:00Z",
    updatedAt: "2025-11-03T12:00:00Z"
  };

}



// standard validation failed:
// standardSettings.fqdn: Path `fqdn` is required.
// standardSettings.surveys.url: Path `url` is required.
// standardSettings.surveys.username: Path `username` is required.
// standardSettings.surveys.password: Path `password` is required.
// standardSettings.keyCloak.SCOPE_NAME: Path `SCOPE_NAME` is required.