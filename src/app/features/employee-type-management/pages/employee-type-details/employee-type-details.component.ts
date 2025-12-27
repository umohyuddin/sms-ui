import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-type-details',
  standalone: true,
  imports: [],
  templateUrl: './employee-type-details.component.html',
  styleUrl: './employee-type-details.component.css'
})
export class EmployeeTypeDetailsComponent {
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
        this.router.navigate(ROUTES.FEE.FEE_CATALOG.EDIT(this.routedId.toString()));
      } else {
        console.log('Resource ID from URL Not Found:');
      }
    }
}
