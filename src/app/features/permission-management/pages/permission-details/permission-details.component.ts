import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { PermissionInfoComponent } from '../../components/permission-info/permission-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-permission-details',
  standalone: true,
  imports: [PermissionInfoComponent],
  templateUrl: './permission-details.component.html',
  styleUrl: './permission-details.component.css'
})
export class PermissionDetailsComponent {
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
      this.router.navigate(ROUTES.PERMISSIONS.EDIT(this.routedId.toString()));
    }
  }
}
