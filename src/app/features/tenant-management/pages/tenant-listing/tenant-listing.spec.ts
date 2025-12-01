import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TenantListing } from './tenant-listing';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Tenant } from '../../models/tenant';

describe('TenantListing', () => {
  let component: TenantListing;
  let fixture: ComponentFixture<TenantListing>;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;
  let routerSpy: jasmine.SpyObj<Router>;

 const mockTenants: Tenant[] = [
    {
      "_id": "67ab3b4b839530b90ebc57f8",
  "tenantName": "cim-dev3",
  "tenantCode": "002",
  "tenantId": "cim-dev3",
      "tenantSettings": {
        "keyCloak": {
          "credentials": { "secret": "ef61df80-061c-4c29-b9ac-387e6bf67052" },
          "realm": "expertflow",
          "auth-server-url": "https://cim-dev3.expertflow.com/auth/",
          "ef-server-url": "https://cim-dev3.expertflow.com/unified-admin/",
          "ssl-required": "external",
          "resource": "cim",
          "verify-token-audience": false,
          "use-resource-role-mappings": true,
          "confidential-port": 0,
          "CLIENT_ID": "cim",
          "CLIENT_DB_ID": "ef61df80-061c-4c29-b9ac-387e6bf67052",
          "GRANT_TYPE": "password",
          "GRANT_TYPE_PAT": "client_credentials",
          "USERNAME_ADMIN": "admin",
          "PASSWORD_ADMIN": "admin",
          "SCOPE_NAME": "Any default scope",
          "bearer-only": true,
          "FINESSE_URL": "https://uccx12-5p.ucce.ipcc:8445",
          "TWILIO_SID": "AC99cffb57f6d7e3c3da5f0f149ddc2b47",
          "TWILIO_VERIFY_SID": "VA73622e86ae131799532a804ec9e230e3",
          "TWILIO_AUTH_TOKEN": "31bea9d152d6c1dd053cd4a8481fc234"
        },
        "redis": { "userName": "root", "password": "Expertflow123" },
        "mongo": { "userName": "root", "password": "Expertflow123" },
        "campaigns": { "url": "http://campaigns-test:1880", "username": "admin", "password": "admin" },
        "surveys": { "url": "http://surveys-test:1880", "username": "admin", "password": "admin" },
        "finesse": { "url": "https://finesse-test", "adminUser": "finesseAdmin", "adminPass": "finessePass" },
        "dialer": { "serviceIdentifier": "9001", "maxConcurrentCalls": "10", "maxCallTime": "120", "callsPerSecond": "20" },
        "secureLink": { "linkExpiryTime": 30 },
        "domain": "cim-dev3.expertflow.com",
        "subDomain": "cim-dev3",
        "locale": "en",
        "timeZone": "Asia/Karachi"
      },
      "status": "inActive",
      "createdBy": "admin",
      "updatedBy": "admin",
      "createdAt": "2025-02-11T11:58:03.775Z",
      "updatedAt": "2025-02-11T11:58:03.775Z",
      "__v": 0
    },
    {
      "_id": "67ab3788839530b90ebc57f6",
  "tenantName": "cim-dev",
  "tenantCode": "001",
  "tenantId": "cim-dev",
      "tenantSettings": {
        "keyCloak": {
          "credentials": { "secret": "ef61df80-061c-4c29-b9ac-387e6bf67052" },
          "realm": "expertflow",
          "auth-server-url": "https://cim-dev.expertflow.com/auth/",
          "ef-server-url": "https://cim-dev.expertflow.com/unified-admin/",
          "ssl-required": "external",
          "resource": "cim",
          "verify-token-audience": false,
          "use-resource-role-mappings": true,
          "confidential-port": 0,
          "CLIENT_ID": "cim",
          "CLIENT_DB_ID": "ef61df80-061c-4c29-b9ac-387e6bf67052",
          "GRANT_TYPE": "password",
          "GRANT_TYPE_PAT": "client_credentials",
          "USERNAME_ADMIN": "admin",
          "PASSWORD_ADMIN": "admin",
          "SCOPE_NAME": "Any default scope",
          "bearer-only": true,
          "FINESSE_URL": "https://uccx12-5p.ucce.ipcc:8445",
          "TWILIO_SID": "AC99cffb57f6d7e3c3da5f0f149ddc2b47",
          "TWILIO_VERIFY_SID": "VA73622e86ae131799532a804ec9e230e3",
          "TWILIO_AUTH_TOKEN": "31bea9d152d6c1dd053cd4a8481fc234"
        },
        "redis": { "userName": "root", "password": "Expertflow123" },
        "mongo": { "userName": "root", "password": "Expertflow123" },
        "campaigns": { "url": "http://campaigns-test:1880", "username": "admin", "password": "admin" },
        "surveys": { "url": "http://surveys-test:1880", "username": "admin", "password": "admin" },
        "finesse": { "url": "https://finesse-test", "adminUser": "finesseAdmin", "adminPass": "finessePass" },
        "dialer": { "serviceIdentifier": "9001", "maxConcurrentCalls": "10", "maxCallTime": "120", "callsPerSecond": "20" },
        "secureLink": { "linkExpiryTime": 30 },
        "domain": "cim-dev.expertflow.com",
        "subDomain": "cim-dev",
        "locale": "en",
        "timeZone": "Asia/Karachi"
      },
      "status": "inActive",
      "createdBy": "admin",
      "updatedBy": "admin",
      "createdAt": "2025-02-11T11:42:00.065Z",
      "updatedAt": "2025-02-11T11:42:00.065Z",
      "__v": 0
    }
  ];


  beforeEach(async () => {
    const httpSpy = jasmine.createSpyObj('HttpClientService', ['request']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        TenantListing,          // standalone component
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: HttpClientService, useValue: httpSpy },
        { provide: Router, useValue: rSpy },
      ],
    }).compileComponents();

    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(TenantListing);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tenants on init and update tenants array', fakeAsync(() => {
    const httpResponse = new HttpResponse({ status: 200, body: mockTenants });
    httpClientServiceSpy.request.and.returnValue(of(httpResponse));

    component.ngOnInit();
    tick(); // simulate async

    expect(httpClientServiceSpy.request).toHaveBeenCalledWith('GET', component.URL, { observeResponse: true });
    expect(component.tenants).toEqual(mockTenants);
    expect(component.spinner).toBeFalse();
  }));

  it('should handle error when fetching tenants', fakeAsync(() => {
    const errorResponse = { status: 500, message: 'Server error' };
    httpClientServiceSpy.request.and.returnValue(throwError(() => errorResponse));

    component.ngOnInit();
    tick(); // simulate async

    expect(component.tenants).toEqual([]);
    expect(component.spinner).toBeFalse();
  }));

  it('should navigate to tenant create page', () => {
    component.goToCreateTenant();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tenants/tenant-create']);
  });
});
