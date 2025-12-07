import { Component } from '@angular/core';
import { FeeCatalogComponentCreateFormComponent } from '../../components/fee-catalog-component-create-form/fee-catalog-component-create-form.component';

@Component({
  selector: 'app-fee-catalog-component-create',
  imports: [FeeCatalogComponentCreateFormComponent],
  templateUrl: './fee-catalog-component-create.html',
  styleUrls: ['./fee-catalog-component-create.css'],
  standalone: true,
})
export class FeeCatalogComponentCreate {
  constructor() { }

}
