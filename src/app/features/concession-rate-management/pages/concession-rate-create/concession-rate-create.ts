import { Component } from '@angular/core';
import { ConcessionRateCreateFormComponent } from '../../components/concession-rate-create-form/concession-rate-create-form.component';



@Component({
  selector: 'app-concession-rate-create',
  imports: [ConcessionRateCreateFormComponent],
  templateUrl: './concession-rate-create.html',
  styleUrls: ['./concession-rate-create.css'],
  standalone: true,
})
export class ConcessionRateCreate {
   constructor() { }
 
}
