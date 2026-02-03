import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-roles-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-info.component.html',
  styleUrl: './roles-info.component.css'
})
export class RolesInfoComponent {
  roleData?: RoleResponse;
  roleId = '';

  constructor(
    private route: ActivatedRoute,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.roleId) {
      this.getRoleDetails(this.roleId);
    }
  }

  getRoleDetails(roleId: string): void {
    this.rolesService.getRoleById(roleId).subscribe({
      next: (response) => {
        this.roleData = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}
