import { Component, Input } from '@angular/core';
import { Tenant } from '../../models/tenant';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-tenant-info',
  standalone: true,
  imports: [CommonModule,MatExpansionModule],
  templateUrl: './tenant-info.component.html',
  styleUrls: ['./tenant-info.component.css']
})
export class TenantInfoComponent {
 @Input() tenantData: Tenant | undefined;
}
