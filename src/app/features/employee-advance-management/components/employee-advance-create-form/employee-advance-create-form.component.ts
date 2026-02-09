import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-create-form',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-create-form.component.html',
  styleUrl: './employee-advance-create-form.component.css'
})
export class EmployeeAdvanceCreateFormComponent {
  constructor(private logger: LoggerService) {}
}
