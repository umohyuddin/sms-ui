import { Component } from '@angular/core';
import { DesignationCreateFormComponent } from '../../components/designation-create-form/designation-create-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { DesignationInfoComponent } from '../../components/designation-info/designation-info.component';

@Component({
  selector: 'app-designation-details',
  standalone: true,
  imports: [DesignationInfoComponent],
  templateUrl: './designation-details.component.html',
  styleUrl: './designation-details.component.css'
})
export class DesignationDetailsComponent {
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
      this.router.navigate(ROUTES.DESIGNATIONS.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}
