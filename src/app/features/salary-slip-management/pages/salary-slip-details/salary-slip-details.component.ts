import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-salary-slip-details',
  standalone: true,
  imports: [],
  templateUrl: './salary-slip-details.component.html',
  styleUrl: './salary-slip-details.component.css'
})
export class SalarySlipDetailsComponent {
  constructor(private logger: LoggerService) {}
}
