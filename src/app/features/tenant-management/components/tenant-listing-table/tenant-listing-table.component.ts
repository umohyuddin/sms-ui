import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Tenant } from '../../models/tenant';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
@Component({
  selector: 'app-tenant-listing-table',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './tenant-listing-table.component.html',
  styleUrls: ['./tenant-listing-table.component.css']
})
export class TenantListingTableComponent {
  @Input() tenantData: Tenant[] = [];
  URL = '';

  constructor(private router: Router,
    private httpClientService: HttpClientService,
    private appConfig: AppConfigService
  ) { }

  ngOnInit() {
    console.log('API Base URL:', this.appConfig.apiBaseUrl);
    this.URL = this.appConfig.apiBaseUrl;
  }
  columns = [
    // { key: 'id', label: 'Id', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdBy', label: 'Created by', sortable: false },
    { key: 'updatedBy', label: 'Updated by', sortable: false },
    { key: 'updatedAt', label: 'Updated at', sortable: true },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  viewTenantDetails(tenantId: string): void {
    console.log('Viewing details for tenant ID:', tenantId);
    this.router.navigate(['/tenants/tenant-details', tenantId]);
  }

  editTenant(tenant: any, event: Event): void {
    event.stopPropagation();
    console.log('Editing tenant ID:', tenant.tenantId);
    this.router.navigate(['/tenants/tenant-edit', tenant.tenantId]);


  }

  deleteTenant(tenantId: any, event: Event): void {
    event.stopPropagation();

    console.log('Deleting tenant:', tenantId);
    if (confirm('Are you sure you want to delete this tenant?')) {

      this.httpClientService.request<any>(HTTP_METHOD.DELETE, `${this.URL}/${tenantId}`, {
        observeResponse: true
      }).subscribe({
        next: (response) => {
          console.log('✅ Delete Success Status:', response.status);
          console.log('📦 Delete Response Body:', response.body);
          this.tenantData = this.tenantData.filter(t => t.tenantId !== tenantId);
          console.log(`Tenant ${tenantId} deleted successfully`);
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
        },
        complete: () => {
          console.log('🔚 Delete Complete');
        }
      })


    }

  }
}
