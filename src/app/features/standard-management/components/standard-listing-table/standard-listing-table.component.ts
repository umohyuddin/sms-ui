import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { Standard } from '../../models/standard';

@Component({
  selector: 'app-standard-listing-table',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './standard-listing-table.component.html',
  styleUrls: ['./standard-listing-table.component.css']
})
export class StandardListingTableComponent {
  @Input() standardData: Standard[] = [];
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

  viewstandardDetails(standardId: string): void {
    console.log('Viewing details for standard ID:', standardId);
    this.router.navigate(['/standards/standard-details', standardId]);
  }

  editstandard(standard: any, event: Event): void {
    event.stopPropagation();
    console.log('Editing standard ID:', standard.standardId);
    this.router.navigate(['/standards/standard-edit', standard.standardId]);


  }

  deletestandard(standardId: any, event: Event): void {
    event.stopPropagation();

    console.log('Deleting standard:', standardId);
    if (confirm('Are you sure you want to delete this standard?')) {

      this.httpClientService.request<any>(HTTP_METHOD.DELETE, `${this.URL}/${standardId}`, {
        observeResponse: true
      }).subscribe({
        next: (response) => {
          console.log('✅ Delete Success Status:', response.status);
          console.log('📦 Delete Response Body:', response.body);
          this.standardData = this.standardData.filter(t => t.CampusId !== standardId);
          console.log(`standard ${standardId} deleted successfully`);
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
