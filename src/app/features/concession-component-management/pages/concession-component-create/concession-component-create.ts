import { Component } from '@angular/core';
import { ConcessionComponentCreateFormComponent } from '../../components/concession-component-create-form/concession-component-create-form.component';



@Component({
  selector: 'app-concession-component-create',
  imports: [
    ConcessionComponentCreateFormComponent
  ],
  templateUrl: './concession-component-create.html',
  styleUrls: ['./concession-component-create.css'],
  standalone: true,
})
export class ConcessionComponentCreate {
  constructor() { }

}
