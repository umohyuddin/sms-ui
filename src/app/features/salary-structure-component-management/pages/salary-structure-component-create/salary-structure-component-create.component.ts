import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryComponentCreateFormComponent } from '../../../salary-component-management/components/salary-component-create-form/salary-component-create-form.component';
import { SalaryStructureComponentCreateFormComponent } from '../../components/salary-structure-component-create-form/salary-structure-component-create-form.component';

@Component({
  selector: 'app-salary-structure-component-create',
  standalone: true,
  imports: [SalaryStructureComponentCreateFormComponent],
  templateUrl: './salary-structure-component-create.component.html',
  styleUrl: './salary-structure-component-create.component.css'
})
export class SalaryStructureComponentCreateComponent {

}
