import { Component } from '@angular/core';
import { StudentCreateFormComponent } from '../../components/student-create-form/student-create-form.component';

@Component({
  selector: 'app-standard-create',
  imports: [StudentCreateFormComponent],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.css'],
  standalone: true,
})
export class StudentCreate {
   constructor() { }
 
}
