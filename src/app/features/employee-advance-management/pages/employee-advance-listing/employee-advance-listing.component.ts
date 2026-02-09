import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';

@Component({
  selector: 'app-employee-advance-listing',
  standalone: true,
  imports: [],
  templateUrl: './employee-advance-listing.component.html',
  styleUrl: './employee-advance-listing.component.css'
})
export class EmployeeAdvanceListingComponent {
  constructor(private logger: LoggerService) {}
}
