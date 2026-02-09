import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ModulesInfoComponent } from '../../components';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-modules-details',
  standalone: true,
  imports: [ModulesInfoComponent],
  templateUrl: './modules-details.component.html',
  styleUrl: './modules-details.component.css'
})
export class ModulesDetailsComponent {
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
      this.router.navigate(ROUTES.MODULES.EDIT(this.routedId.toString()));
    }
  }
}
