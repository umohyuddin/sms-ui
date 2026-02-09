import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { SalaryComponentInfoComponent } from '../../components/salary-component-info/salary-component-info.component';

@Component({
  selector: 'app-salary-component-details',
  standalone: true,
  imports: [SalaryComponentInfoComponent],
  templateUrl: './salary-component-details.component.html',
  styleUrl: './salary-component-details.component.css'
})
export class SalaryComponentDetailsComponent {
  routedId: number | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router
  , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routedId = id ? +id : null; // convert string to number
      console.log('Resource ID from URL:', this.routedId);
    });
  }
  goToUpdatePage() {
    if (this.routedId) {
      this.router.navigate(ROUTES.SALARY_COMPONENT.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}
