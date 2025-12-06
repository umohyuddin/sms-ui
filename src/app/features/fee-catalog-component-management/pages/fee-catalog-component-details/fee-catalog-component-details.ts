import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FeeCatalogComponentInfoComponent } from '../../components/fee-catalog-component-info/fee-catalog-component-info.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';



@Component({
  selector: 'app-fee-catalog-component-details',
  imports: [FeeCatalogComponentInfoComponent
  ],
  templateUrl: './fee-catalog-component-details.html',
  styleUrls: ['./fee-catalog-component-details.css'],
  standalone: true,
})
export class FeeCatalogComponentDetails {
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
      this.router.navigate(ROUTES.FEE.FEE_CATALOG_COMPONENT.EDIT(this.routedId.toString()));
    } else {
      console.log('Resource ID from URL Not Found:');
    }
  }
}


