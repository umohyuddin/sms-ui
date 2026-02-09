import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-listing-table',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-listing-table.component.html',
  styleUrl: './employee-advance-listing-table.component.css'
})
export class EmployeeAdvanceListingTableComponent {
  constructor(private logger: LoggerService) {}
}
