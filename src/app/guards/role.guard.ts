import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GlobalService } from '../services/global/global.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private gs: GlobalService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = (route.data['roles'] as string[]).map(r => r.trim().toLowerCase());
    if (allowedRoles.includes(this.gs.getRole().roleName?.trim().toLowerCase() ?? '')) {
      return true;
    }
    this.router.navigate(['/page/404']);
    return false;
  }
}
