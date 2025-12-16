import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { responseInterceptor } from './response.interceptor';

describe('responseInterceptor', () => {
  const interceptorFn: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => responseInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptorFn).toBeTruthy();
  });

  it('logs HttpResponse events and forwards them', (done) => {
    const mockReq = { url: '/api/test' } as any;
    const response = new HttpResponse({ url: '/api/test', status: 200, statusText: 'OK', body: { ok: true } });
    const next = (req: any) => of(response);

    const logSpy = spyOn(console, 'log');

    interceptorFn(mockReq, next).subscribe({
      next: (evt) => {
        // the interceptor should forward the HttpResponse
        expect(evt).toBe(response);
        // and should have logged the API response
        expect(logSpy).toHaveBeenCalled();
        const firstCallArgs = logSpy.calls.argsFor(0);
        expect(firstCallArgs[0]).toBe('  API Response:');
        expect(firstCallArgs[1] && firstCallArgs[1].url).toBe('/api/test');
        expect(firstCallArgs[1] && firstCallArgs[1].status).toBe(200);
        done();
      },
      error: (err) => done.fail(err)
    });
  });

  it('logs HttpErrorResponse on error and rethrows it', (done) => {
    const mockReq = { url: '/api/error' } as any;
    const errorResp = new HttpErrorResponse({ url: '/api/error', status: 500, statusText: 'Server Error', error: { message: 'fail' } });
    const next = (req: any) => throwError(() => errorResp);

    const errorSpy = spyOn(console, 'error');

    interceptorFn(mockReq, next).subscribe({
      next: () => done.fail('should not emit next'),
      error: (err) => {
        // should rethrow the same HttpErrorResponse
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect((err as HttpErrorResponse).status).toBe(500);
        // should have logged the API error
        expect(errorSpy).toHaveBeenCalled();
        const firstCallArgs = errorSpy.calls.argsFor(0);
        expect(firstCallArgs[0]).toBe('❌ API Error:');
        expect(firstCallArgs[1] && firstCallArgs[1].status).toBe(500);
        done();
      }
    });
  });
});
