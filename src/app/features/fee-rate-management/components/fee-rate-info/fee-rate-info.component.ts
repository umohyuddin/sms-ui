import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-fee-rate-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fee-rate-info.component.html',
  styleUrls: ['./fee-rate-info.component.css']
})
export class FeeRateInfoComponent {
  // sectionData?: FeeCatalogComponentResponse;
  // sectionId!: string;
  // URL = '';
  constructor(
    // private feeCatalogComponentManagementService: FeeCatalogComponentManagementService,
    // private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // this.sectionId = this.route.snapshot.paramMap.get('id') ?? '';
    // console.log('Section ID from route:', this.sectionId);
    //this.getSectionDetails(this.sectionId);
  }

  // getSectionDetails(sectionId: string): void {
  //   this.sectionManagementService.getSectionById(sectionId).subscribe({
  //     next: (response) => {
  //       console.log('✅ Success Status:', response.status);
  //       console.log('📦 Response Body:', response.body);
  //       this.sectionData = response.body;
  //       console.log('📦 Standard data :', this.sectionData);
  //     },
  //     error: (error) => {
  //       console.error('❌ Request Error Status:', error.status);
  //       console.error('Message:', error.message);
  //     },
  //     complete: () => {
  //       console.log('🔚 Request Complete');
  //     }
  //   })
  // }
}
