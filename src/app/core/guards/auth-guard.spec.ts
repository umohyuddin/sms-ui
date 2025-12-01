import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard, AUTH_GUARD_ALLOW } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });
  });

  it('should be a function', () => {
    expect(typeof executeGuard).toBe('function');
  });

  it('should allow access (return true) and not navigate', () => {
    const result = executeGuard({} as any, { url: '/some' } as any);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when AUTH_GUARD_ALLOW is false and navigate to login', () => {
    // reset testing module and provide a false flag for this test
    TestBed.resetTestingModule();
    const router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AUTH_GUARD_ALLOW, useValue: false }
      ]
    });

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, { url: '/protected' } as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
