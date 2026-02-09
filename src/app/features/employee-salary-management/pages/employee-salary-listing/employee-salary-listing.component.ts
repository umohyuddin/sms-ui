import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { EmployeeSalaryListingTableComponent } from '../../components/employee-salary-listing-table/employee-salary-listing-table.component';

@Component({
  selector: 'app-employee-salary-listing',
  imports: [
    CommonModule,
    FormsModule,
    EmployeeSalaryListingTableComponent
  ],
  templateUrl: './employee-salary-listing.component.html',
  styleUrls: ['./employee-salary-listing.component.css'],
  standalone: true,
})
export class EmployeeSalaryListingComponent implements OnInit {
  constructor(private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {}

  goToEmployeeSalaryCreate(): void {
    // Assuming route exists
    // this.router.navigate(ROUTES.EMPLOYEE.EMPLOYEE_SALARY.CREATE);
  }
}
