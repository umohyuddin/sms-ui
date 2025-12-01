import { Component, Input, SimpleChanges } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Tenant } from '../../models/tenant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../../../core/services/app-config.service';


@Component({
  selector: 'app-tenant-create-form',
  standalone: true,
  imports: [MatExpansionModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './tenant-create-form.component.html',
  styleUrls: ['./tenant-create-form.component.css']
})
export class TenantCreateFormComponent {
  academicYearForm!: FormGroup;
  routeTenantId?: string;
  URL = '';
  mode = '';
  tenantData: any;

  constructor(private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private route: ActivatedRoute,
    private router: Router,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {

    console.log('Config:', this.appConfig);
    this.URL = this.appConfig.apiBaseUrl;
    this.initializeForm();
  }


  private initializeForm() {
    this.academicYearForm = this.fb.group({
      id: [null],                           // Primary key - hidden in UI
      name: ['', [Validators.required]],    // e.g., "2024-2025"

      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isCurrent: [false],
    });

  }

  generateTenantCode() {
    const timestampCode = Date.now().toString().slice(-6); // last 6 digits of current timestamp
    this.academicYearForm.get('tenantCode')?.setValue(timestampCode);
  }

  goToTenantList(): void {

    // Navigate to the create tenant page
    this.router.navigate(['/tenants']);
    //window.location.href = '/tenants'; // Adjust the URL as needed
  }
  onSubmit(): void {
    console.log('✅ Tenant Form Data:', this.academicYearForm.getRawValue());
    if (this.academicYearForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.academicYearForm.markAllAsTouched();
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
      requestUrl = `${this.URL}/${this.routeTenantId}`;
    }


    console.log('✅ Tenant Form Data:', this.academicYearForm.getRawValue());
    this.httpClientService.request<any>(requestMethod, requestUrl, {
      observeResponse: true,
      body: this.academicYearForm.getRawValue()
    }).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.router.navigate(['/tenants']);
      },
      error: (error) => {
        console.error('❌ Post Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/tenants']);
      },
      complete: () => {
        console.log('🔚 Post Complete');
      }
    })
  }


 

  //Tenant getters
  get tenantName() {
    return this.academicYearForm.get('tenantName');
  }
  get tenantId() {
    return this.academicYearForm.get('tenantId');
  }
  get tenantCode() {
    return this.academicYearForm.get('tenantCode');
  }

  //keyCloak getters
  get realm() {
    return this.academicYearForm.get('tenantSettings.keyCloak.realm');
  }

  get authServerUrl() {
    return this.academicYearForm.get('tenantSettings.keyCloak.auth-server-url');
  }

  get efServerUrl() {
    return this.academicYearForm.get('tenantSettings.keyCloak.ef-server-url');
  }


  //Mongo getters
  get mongoUserName() {
    return this.academicYearForm.get('tenantSettings.mongo.userName');
  }
  get mongoPassword() {
    return this.academicYearForm.get('tenantSettings.mongo.password');
  }

  //Radis getters
  get userName() {
    return this.academicYearForm.get('tenantSettings.mongo.userName');
  }
  get password() {
    return this.academicYearForm.get('tenantSettings.mongo.password');
  }

  //Dialer getters
  get maxConcurrentCalls() {
    return this.academicYearForm.get('tenantSettings.dialer.maxConcurrentCalls');
  }

  get maxCallTime() {
    return this.academicYearForm.get('tenantSettings.dialer.maxCallTime');
  }

  get callsPerSecond() {
    return this.academicYearForm.get('tenantSettings.dialer.callsPerSecond');
  }

  get serviceIdentifier() {
    return this.academicYearForm.get('tenantSettings.dialer.serviceIdentifier');
  }


  //mediaServer getter
  get wssUrl() {
    return this.academicYearForm.get('tenantSettings.mediaServer.wssUrl');
  }

  get domain() {
    return this.academicYearForm.get('tenantSettings.mediaServer.domain');
  }


  //campaigns getter
  get domainUserName() {
    return this.academicYearForm.get('tenantSettings.campaigns.username');
  }
  get domainPassword() {
    return this.academicYearForm.get('tenantSettings.campaigns.password');
  }
  get domainUrl() {
    return this.academicYearForm.get('tenantSettings.campaigns.url');
  }


  toggleStatus(event: any) {
    const isActive = event.target.checked;
    console.log("isActive", isActive)
    this.academicYearForm.get('tenantSettings.mongo.isManaged')?.setValue(isActive);
  }

  getTenantDetails(tenantId: string): void {

    const url = `${this.URL}/${tenantId}`;
    this.httpClientService
      .request<any>(HTTP_METHOD.GET, url, { observeResponse: true })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('✅ Status:', response.status);
          console.log('📦 Body:', response.body);
          this.tenantData = response.body;
          console.log('Tenant Details:', this.tenantData);
          this.academicYearForm.patchValue(this.tenantData);
        },
        error: (error) => {
          console.error('❌ Error Status:', error.status);
          console.error('Message:', error.message);
        }
      });
  }

  DUMMY_PAYLOAD = {
    tenantName: "testTenant",
    tenantId: "testTenant",
    tenantCode: "101",
    tenantSettings: {
      keyCloak: {
        realm: "testTenant",
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
        userName: "testTenant",
        password: "Test1234!"
      },
      mongo: {
        userName: "testTenant",
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



// Tenant validation failed:
// tenantSettings.fqdn: Path `fqdn` is required.
// tenantSettings.surveys.url: Path `url` is required.
// tenantSettings.surveys.username: Path `username` is required.
// tenantSettings.surveys.password: Path `password` is required.
// tenantSettings.keyCloak.SCOPE_NAME: Path `SCOPE_NAME` is required.