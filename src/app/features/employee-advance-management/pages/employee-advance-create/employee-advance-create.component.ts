import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-create',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-create.component.html',
  styleUrl: './employee-advance-create.component.css'
})
export class EmployeeAdvanceCreateComponent {
  constructor(private logger: LoggerService) {}
}
