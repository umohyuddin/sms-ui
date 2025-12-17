import { Component } from '@angular/core';
import { EmployeeCreateFormComponent } from '../../components/employee-create-form/employee-create-form.component';

@Component({
  selector: 'app-standard-create',
  imports: [EmployeeCreateFormComponent],
  templateUrl: './employee-create.html',
  styleUrls: ['./employee-create.css'],
  standalone: true,
})
export class EmployeeCreate {
   constructor() { }
 
}
