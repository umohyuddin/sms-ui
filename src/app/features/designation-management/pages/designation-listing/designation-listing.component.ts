import { Component } from '@angular/core';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { DesignationListingTableComponent } from '../../components/designation-listing-table/designation-listing-table.component';

@Component({
  selector: 'app-designation-listing',
  standalone: true,
  imports: [DesignationListingTableComponent],
  templateUrl: './designation-listing.component.html',
  styleUrl: './designation-listing.component.css'
})
export class DesignationListingComponent {

  constructor(private router: Router, private logger: LoggerService) { }
  ngOnInit(): void {}


  goToCreateDesignations(): void {
    this.router.navigate(ROUTES.DESIGNATIONS.CREATE);
  }
}
