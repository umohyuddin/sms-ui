import { Component } from '@angular/core';
import { SalaryStructureInfoComponent } from '../../components/salary-structure-info/salary-structure-info.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-salary-structure-details',
  standalone: true,
  imports: [SalaryStructureInfoComponent],
  templateUrl: './salary-structure-details.component.html',
  styleUrl: './salary-structure-details.component.css'
})
export class SalaryStructureDetailsComponent {
  routedId: number | null = null;

  constructor(private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routedId = id ? +id : null; // convert string to number
      console.log('Resource ID from URL:', this.routedId);
    });
  }
  goToUpdatePage() {
    if (this.routedId) {
      this.router.navigate(ROUTES.SALARY_STRUCTURE.EDIT(this.routedId.toString())
        , { queryParams: { field: 'baseSalary' } });
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}
