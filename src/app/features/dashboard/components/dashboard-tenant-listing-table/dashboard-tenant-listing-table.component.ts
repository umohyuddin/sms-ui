import { Component, Input, SimpleChanges } from '@angular/core';
import { Tenant } from '../../../tenant-management/models/AcademicYearResponse';
import { Router } from '@angular/router';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard-tenant-listing-table',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule],
  templateUrl: './dashboard-tenant-listing-table.component.html',
  styleUrl: './dashboard-tenant-listing-table.component.css'
})
export class DashboardTenantListingTableComponent {
 
}

