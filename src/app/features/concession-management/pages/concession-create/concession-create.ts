import { Component } from '@angular/core';
import { ConcessionCreateFormComponent } from '../../components/concession-create-form/concession-create-form.component';



@Component({
  selector: 'app-concession-create',
  imports: [ConcessionCreateFormComponent],
  templateUrl: './concession-create.html',
  styleUrls: ['./concession-create.css'],
  standalone: true,
})
export class ConcessionCreate {
   constructor() { }
}
