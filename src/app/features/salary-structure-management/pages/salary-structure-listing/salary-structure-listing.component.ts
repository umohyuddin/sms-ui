import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SalaryStructureListingTableComponent } from '../../components/salary-structure-listing-table/salary-structure-listing-table.component';
import { PageSubHeaderComponent } from '../../../../shared/components/page-sub-header/page-sub-header.component';

@Component({
  selector: 'app-salary-structure-listing',
  standalone: true,
  imports: [SalaryStructureListingTableComponent,PageSubHeaderComponent],
  templateUrl: './salary-structure-listing.component.html',
  styleUrl: './salary-structure-listing.component.css'
})
export class SalaryStructureListingComponent {
  constructor(private router: Router, private logger: LoggerService) { }
  ngOnInit(): void { }
  goToCreate(): void {
    this.router.navigate(ROUTES.SALARY_STRUCTURE.CREATE);
  }
}
