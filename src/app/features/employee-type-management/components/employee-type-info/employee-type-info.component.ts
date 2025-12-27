import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-type-info',
  standalone: true,
  imports: [],
  templateUrl: './employee-type-info.component.html',
  styleUrl: './employee-type-info.component.css'
})
export class EmployeeTypeInfoComponent {
 feeCatalogData?: FeeCatalogResponse;
  routedId!: string;
  constructor(
    private feeCatalogManagementService: FeeCatalogManagementService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogDetails(this.routedId);
  }

  getFeeCatalogDetails(routedId: string): void {
    this.feeCatalogManagementService.getFeeCatalogById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.feeCatalogData = response.body;
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