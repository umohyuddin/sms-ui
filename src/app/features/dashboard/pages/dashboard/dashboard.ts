import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DiscountRate } from '../../../student-management/models/DiscountRate';
import { DashboardManagementService } from '../../services/dashboard-management.service';
import { DashboardStudentStats } from '../../models/DashboardStudentStats';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  dashboardStudentStats?: DashboardStudentStats
  constructor(private router: Router,
    private dashboardManagementService: DashboardManagementService
  ) { }

  ngOnInit() {
    this.getStudentCounts();
  }
  goToNewAddmission() {
    this.router.navigate(ROUTES.STUDENT.CREATE);
  }


  private getStudentCounts() {
    this.dashboardManagementService.getStudentDashboardCounts().subscribe({
      next: (response) => {
        console.log('✅ Request Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.dashboardStudentStats = response.body; // the raw discount rates
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }
}
