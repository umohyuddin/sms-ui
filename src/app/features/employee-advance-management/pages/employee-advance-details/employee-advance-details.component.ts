import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-details',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-details.component.html',
  styleUrl: './employee-advance-details.component.css'
})
export class EmployeeAdvanceDetailsComponent {
  constructor(private logger: LoggerService) {}
}
