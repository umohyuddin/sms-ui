import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DepartmentInfoComponent } from '../../components/department-info/department-info.component';
import { PageSubHeaderComponent } from '../../../../shared/components/page-sub-header/page-sub-header.component';

@Component({
  selector: 'app-department-details',
  standalone: true,
  imports: [DepartmentInfoComponent,PageSubHeaderComponent],
  templateUrl: './department-details.component.html',
  styleUrl: './department-details.component.css'
})
export class DepartmentDetailsComponent {
  routedId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.routedId = id ? +id : null; // convert string to number
      console.log('Department ID from URL:', this.routedId);
    });
  }

  goToUpdatePage() {
    if (this.routedId) {
      this.router.navigate(ROUTES.DEPARTMENTS.EDIT(this.routedId.toString()));
    } else {
      console.log('Department ID from URL not found');
    }
  }
}