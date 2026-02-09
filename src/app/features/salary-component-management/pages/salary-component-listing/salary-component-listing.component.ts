import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryComponentListingTableComponent } from '../../components/salary-component-listing-table/salary-component-listing-table.component';

@Component({
  selector: 'app-salary-component-listing',
  imports: [
    CommonModule,
    FormsModule,
    SalaryComponentListingTableComponent
  ],
  templateUrl: './salary-component-listing.component.html',
  styleUrls: ['./salary-component-listing.component.css'],
  standalone: true,
})
export class SalaryComponentListingComponent implements OnInit {
  constructor(private router: Router, private logger: LoggerService) { }

  ngOnInit(): void {}

  goToSalaryComponentCreate(): void {
    this.router.navigate(ROUTES.SALARY_COMPONENT.CREATE);
  }
}
