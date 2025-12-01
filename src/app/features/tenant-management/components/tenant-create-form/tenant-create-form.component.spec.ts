import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { TenantCreateFormComponent } from './tenant-create-form.component';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';

describe('TenantCreateFormComponent', () => {
  let component: TenantCreateFormComponent;
  let fixture: ComponentFixture<TenantCreateFormComponent>;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeStub: any;
  let appConfigStub: any;

  beforeEach(async () => {
    httpClientServiceSpy = jasmine.createSpyObj('HttpClientService', ['request']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeStub = { snapshot: { paramMap: { get: (k: string) => '' } } };
    appConfigStub = {
      // keep apiBaseUrl without a trailing slash to match component URL concatenation
      apiBaseUrl: 'https://api.test/tenant',
      getRootDomain: (tenantId: string) => `https://${tenantId}.test-root/`,
      redisPassword: 'redis-pass',
      mongoPassword: 'mongo-pass',
      getCampaignsUrl: (tenantId?: string) => `http://${tenantId || 'default'}-campaigns.test/`
    };

    await TestBed.configureTestingModule({
      imports: [TenantCreateFormComponent, HttpClientTestingModule, NoopAnimationsModule, RouterTestingModule],
      providers: [
        { provide: HttpClientService, useValue: httpClientServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: AppConfigService, useValue: appConfigStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TenantCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // run ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and set create mode when route has no id', () => {
    expect(component.academicYearForm).toBeTruthy();
    expect(component.mode).toBe('create');
    const code = component.academicYearForm.get('tenantCode')?.value;
    expect(typeof code).toBe('string');
    expect(code.length).toBeGreaterThanOrEqual(1);
  });

  it('should update tenantId when tenantName changes', fakeAsync(() => {
    component.academicYearForm.get('tenantName')?.setValue(' Acme Corp ');
    tick();
    expect(component.academicYearForm.get('tenantId')?.value).toBe('Acme Corp');
  }));

  it('goToTenantList should navigate to tenants list', () => {
    component.goToTenantList();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tenants']);
  });

  it('getTenantDetails should patch form on success', fakeAsync(() => {
    const payload = component.DUMMY_PAYLOAD;
    const httpResp = new HttpResponse({ status: 200, body: payload });
    httpClientServiceSpy.request.and.returnValue(of(httpResp));

    component.getTenantDetails('abc');
    tick();

    expect(component.tenantData).toEqual(payload);
    expect(component.academicYearForm.get('tenantName')?.value).toBe(payload.tenantName);
  }));

  it('getTenantDetails should handle error', fakeAsync(() => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error', error: { message: 'fail' } });
    httpClientServiceSpy.request.and.returnValue(throwError(() => error));
    const errorSpy = spyOn(console, 'error');

    component.getTenantDetails('abc');
    tick();

    expect(errorSpy).toHaveBeenCalled();
  }));

  it('onSubmit should POST when mode=create and form valid', fakeAsync(() => {
    // ensure form is valid by patching all required fields
    component.mode = 'create';
    const validPayload = {
      tenantName: 'T',
      tenantId: 'T',
      tenantCode: '123',
      status: 'Active',
      tenantSettings: {
        keyCloak: {
          realm: 'r',
          'auth-server-url': 'https://auth',
          'ef-server-url': 'https://ef'
        },
        mongo: { userName: 'muser', password: 'mpass' },
        campaigns: { username: 'cuser', password: 'cpass', url: 'http://campaigns' },
        dialer: { serviceIdentifier: '9001' }
      }
    };
    component.academicYearForm.patchValue(validPayload);
    const resp = new HttpResponse({ status: 201, body: {} });
    httpClientServiceSpy.request.and.returnValue(of(resp));

    component.onSubmit();
    tick();

    expect(httpClientServiceSpy.request).toHaveBeenCalledWith(HTTP_METHOD.POST, appConfigStub.apiBaseUrl, jasmine.any(Object));
  }));

  it('onSubmit should PATCH when mode=edit', fakeAsync(() => {
    component.mode = 'edit';
    component.routeTenantId = 'xyz';
    const validPayload = {
      tenantName: 'T',
      tenantId: 'T',
      tenantCode: '123',
      status: 'Active',
      tenantSettings: {
        keyCloak: {
          realm: 'r',
          'auth-server-url': 'https://auth',
          'ef-server-url': 'https://ef'
        },
        mongo: { userName: 'muser', password: 'mpass' },
        campaigns: { username: 'cuser', password: 'cpass', url: 'http://campaigns' },
        dialer: { serviceIdentifier: '9001' }
      }
    };
    component.academicYearForm.patchValue(validPayload);
    const resp = new HttpResponse({ status: 200, body: {} });
    httpClientServiceSpy.request.and.returnValue(of(resp));

    component.onSubmit();
    tick();

  expect(httpClientServiceSpy.request).toHaveBeenCalledWith(HTTP_METHOD.PATCH, `${component.URL}/${component.routeTenantId}`, jasmine.any(Object));
  }));

  it('onSubmit should not call API when form invalid', () => {
    component.mode = 'create';
    // make form invalid
    component.academicYearForm.patchValue({ tenantName: '', tenantId: '', tenantCode: '' });
    const spy = httpClientServiceSpy.request.calls.count();

    component.onSubmit();

    expect(httpClientServiceSpy.request.calls.count()).toBe(spy);
  });

  it('onSubmit should handle API error', fakeAsync(() => {
    component.mode = 'create';
    const validPayload = {
      tenantName: 'T',
      tenantId: 'T',
      tenantCode: '123',
      status: 'Active',
      tenantSettings: {
        keyCloak: {
          realm: 'r',
          'auth-server-url': 'https://auth',
          'ef-server-url': 'https://ef'
        },
        mongo: { userName: 'muser', password: 'mpass' },
        campaigns: { username: 'cuser', password: 'cpass', url: 'http://campaigns' },
        dialer: { serviceIdentifier: '9001' }
      }
    };
    component.academicYearForm.patchValue(validPayload);
    const error = new HttpErrorResponse({ status: 400, statusText: 'Bad Request', error: { message: 'bad' } });
    httpClientServiceSpy.request.and.returnValue(throwError(() => error));
    const errorSpy = spyOn(console, 'error');

    component.onSubmit();
    tick();

    expect(errorSpy).toHaveBeenCalled();
  }));
});
