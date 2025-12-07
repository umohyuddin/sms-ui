import { Component } from '@angular/core';
import { FeeRateCreateFormComponent } from '../../components/fee-rate-create-form/fee-rate-create-form.component';

@Component({
  selector: 'app-fee-rate-create',
  imports: [FeeRateCreateFormComponent],
  templateUrl: './fee-rate-create.html',
  styleUrls: ['./fee-rate-create.css'],
  standalone: true,
})
export class FeeRateCreate {
  constructor() { }

}
