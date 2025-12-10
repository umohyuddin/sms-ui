import { inject, InjectionToken } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/concession-rate-management/services/auth-service';
import { JwtService } from '../services/jwt.service';

/**
 * Injection token to allow tests or the application to control the guard decision.
 * Defaults to true (access allowed).
 */
export const AUTH_GUARD_ALLOW = new InjectionToken<boolean>('AUTH_GUARD_ALLOW', {
  providedIn: 'root',
  factory: () => true,
});


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
   const jwtService = inject(JwtService);
  const allow = inject(AUTH_GUARD_ALLOW);
  console.info('[INFO] authGuard invoked', { route, state, allow });
  if (jwtService.isLoggedIn()) {
    console.info('[INFO] Access granted by authGuard');
    return true;
  }

  console.info('[INFO] Access denied by authGuard, redirecting to /auth/login');
  // navigate and return false when access is denied
  router.navigate(['/auth/login']);
  return false;
};