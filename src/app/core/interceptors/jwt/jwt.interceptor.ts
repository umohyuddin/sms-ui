import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtService } from '../../services/jwt.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);

  const token = jwtService.getToken();
  if (token) {
    // If token exists, add Authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    // If token does not exist, redirect to login
    router.navigate(['/auth/login']);
    console.warn('No auth token found, redirecting to login');
  }
  return next(req);
};
