import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ModulesListingTableComponent } from '../../components';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-modules-listing',
  standalone: true,
  imports: [CommonModule, ModulesListingTableComponent],
  templateUrl: './modules-listing.component.html',
  styleUrl: './modules-listing.component.css'
})
export class ModulesListingComponent {
  constructor(private router: Router, private logger: LoggerService) {}

  goToCreateModule(): void {
    this.router.navigate(ROUTES.MODULES.CREATE);
  }
}
