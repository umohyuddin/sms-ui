import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';

@Component({
  selector: 'app-permission-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission-info.component.html',
  styleUrl: './permission-info.component.css'
})
export class PermissionInfoComponent {
  permissionData?: PermissionResponse;
  permissionId = '';

  constructor(
    private route: ActivatedRoute,
    private permissionService: PermissionService
  , private logger: LoggerService) { }

  ngOnInit(): void {
    this.permissionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.permissionId) {
      this.getPermissionDetails(this.permissionId);
    }
  }

  getPermissionDetails(permissionId: string): void {
    this.permissionService.getPermissionById(permissionId).subscribe({
      next: (data) => {
        this.permissionData = data;
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
