import { Component } from '@angular/core';
import { FeeCatalogCreateFormComponent } from '../../components/fee-catalog-create-form/fee-catalog-create-form.component';


@Component({
  selector: 'app-fee-catalog-create',
  imports: [
    FeeCatalogCreateFormComponent
  ],
  templateUrl: './fee-catalog-create.html',
  styleUrls: ['./fee-catalog-create.css'],
  standalone: true,
})
export class FeeCatalogCreate {
   constructor() { }
 
}
