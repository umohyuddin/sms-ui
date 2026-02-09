import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { RolesInfoComponent } from '../../components/roles-info/roles-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-roles-details',
  standalone: true,
  imports: [RolesInfoComponent],
  templateUrl: './roles-details.component.html',
  styleUrl: './roles-details.component.css'
})
export class RolesDetailsComponent {
  routedId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  , private logger: LoggerService) {}

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routedId = id ? +id : null;
    });
  }

  goToUpdatePage() {
    if (this.routedId) {
      this.router.navigate(ROUTES.ROLES.EDIT(this.routedId.toString()));
    }
  }
}
