import { Component } from '@angular/core';
import { PageSubHeaderComponent } from '../../../../shared/components/page-sub-header/page-sub-header.component';
import { DepartmentCreateFormComponent } from '../../components/department-create-form/department-create-form.component';

@Component({
  selector: 'app-department-create',
  standalone: true,
  imports: [PageSubHeaderComponent,DepartmentCreateFormComponent],
  templateUrl: './department-create.component.html',
  styleUrl: './department-create.component.css'
})
export class DepartmentCreateComponent {

}
