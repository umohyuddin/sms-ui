import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-info',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-info.component.html',
  styleUrl: './employee-advance-info.component.css'
})
export class EmployeeAdvanceInfoComponent {
  constructor(private logger: LoggerService) {}
}
