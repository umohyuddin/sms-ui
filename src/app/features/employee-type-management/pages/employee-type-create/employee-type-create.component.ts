import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { EmployeeAdvanceCreateFormComponent } from '../../../employee-advance-management/components/employee-advance-create-form/employee-advance-create-form.component';
import { EmployeeTypeCreateFormComponent } from '../../components/employee-type-create-form/employee-type-create-form.component';

@Component({
  selector: 'app-employee-type-create',
  standalone: true,
  imports: [EmployeeTypeCreateFormComponent],
  templateUrl: './employee-type-create.component.html',
  styleUrl: './employee-type-create.component.css'
})
export class EmployeeTypeCreateComponent {

}
