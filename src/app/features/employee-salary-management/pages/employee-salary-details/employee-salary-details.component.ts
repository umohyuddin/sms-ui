import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { EmployeeSalaryInfoComponent } from '../../components/employee-salary-info/employee-salary-info.component';

@Component({
  selector: 'app-employee-salary-details',
  standalone: true,
  imports: [EmployeeSalaryInfoComponent],
  templateUrl: './employee-salary-details.component.html',
  styleUrl: './employee-salary-details.component.css'
})
export class EmployeeSalaryDetailsComponent {

}
