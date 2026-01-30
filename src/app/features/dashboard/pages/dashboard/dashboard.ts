import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- Add this import
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DiscountRate } from '../../../student-management/models/DiscountRate';
import { DashboardManagementService } from '../../services/dashboard-management.service';
import { DashboardStudentStats } from '../../models/DashboardStudentStats';
import { DashboardFinancial } from '../../models/DashboardFinancial';
import { EmployeeCountByType } from '../../models/EmployeeCountByType';
import { ShowMorePopComponent } from '../../../../shared/components/show-more-pop/show-more-pop.component';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,
    CommonModule,
    ShowMorePopComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {
  totalEmployees = 0;
   employeeCountsByType: EmployeeCountByType[] = [];
  dashboardStudentStats?: DashboardStudentStats
  dashBoardCount: any;
  dashBoardFinancials?:DashboardFinancial
  constructor(private router: Router,
    private dashboardManagementService: DashboardManagementService
  ) { }

  ngOnInit() {
    this.getStudentCounts();
    this.getDashBoardCounts();
    this.getDashBoardFinancials();
     this.getEmployeeCountsByType();
  }


  goToNewAddmission() {
    this.router.navigate(ROUTES.STUDENT.CREATE);
  }


  goToFeeCollector() {
    this.router.navigate(ROUTES.STUDENT.STUDENT_FEE_COLLECTOR);

  }


  private getStudentCounts() {
    this.dashboardManagementService.getStudentDashboardCounts().subscribe({
      next: (response) => {
        console.log('  Request Success Status:', response.status);
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

  private getDashBoardCounts() {
    this.dashboardManagementService.getDashboardCounts().subscribe({
      next: (response) => {
        console.log('  Request Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.dashBoardCount = response.body;
        console.log("Dashboard counts",this.dashBoardCount)
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

    private getDashBoardFinancials() {
    this.dashboardManagementService.getDashboardFinancials().subscribe({
      next: (response) => {
        console.log('  Request Success Status:', response.status);
        console.log('📦 Response Body:', response.body);

        this.dashBoardFinancials = response.body;
        console.log("Dashboard financials",this.dashBoardFinancials)
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

  
   private getEmployeeCountsByType() {
  this.dashboardManagementService.getEmployeeCountByType().subscribe({
    next: (response) => {

      const body = response.body ?? [];

      this.employeeCountsByType = body as EmployeeCountByType[];

      this.totalEmployees = this.employeeCountsByType
        .reduce((sum, item) => sum + Number(item.totalEmployees), 0);

      console.log('👥 Employee count by type:', this.employeeCountsByType);
      console.log('✅ Total Employees:', this.totalEmployees);
    },
    error: (error) => {
      console.error('❌ Employee count error:', error);
    }
  });
}

 formatEmployee(emp: any): string {
    return `${emp.employeeTypeName} (${emp.totalEmployees})`;
  }
}
