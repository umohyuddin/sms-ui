import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryComponentCreateFormComponent } from '../../components/salary-component-create-form/salary-component-create-form.component';

@Component({
  selector: 'app-salary-component-create',
  standalone: true,
  imports: [SalaryComponentCreateFormComponent],
  templateUrl: './salary-component-create.component.html',
  styleUrl: './salary-component-create.component.css'
})
export class SalaryComponentCreateComponent {

}
