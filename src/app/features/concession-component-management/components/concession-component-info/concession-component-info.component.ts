import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ConcessionComponentManagementService } from '../../services/concession-component-management.service';
import { ConcessionComponentResponse } from '../../models/ConcessionComponentResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';


@Component({
  selector: 'app-concession-component-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-component-info.component.html',
  styleUrls: ['./concession-component-info.component.css']
})
export class ConcessionComponentInfoComponent {
  resourceData?: ConcessionComponentResponse;
  routedId!: string;
  URL = '';
  constructor(
    private concessionComponentManagementService: ConcessionComponentManagementService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Campus ID from route:', this.routedId);
    this.getConcessionDetails(this.routedId);
  }

  getConcessionDetails(routedId: string): void {
    this.concessionComponentManagementService.getConcessionComponentById(routedId).subscribe({
      next: (response) => {
        console.log('✅ Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceData = response.body;
        console.log('📦 Campus data :', this.resourceData);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }
  getInitials(name?: string): string {
      return SmsUtil.getInitials(name ?? '');
    }
}
