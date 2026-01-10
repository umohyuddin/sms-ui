import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SalaryComponentCreateFormComponent } from '../../../salary-component-management/components/salary-component-create-form/salary-component-create-form.component';
import { SalaryStructureCreateFormComponent } from '../../components/salary-structure-create-form/salary-structure-create-form.component';

@Component({
  selector: 'app-salary-structure-create',
  standalone: true,
  imports: [CommonModule,SalaryStructureCreateFormComponent],
  templateUrl: './salary-structure-create.component.html',
  styleUrl: './salary-structure-create.component.css'
})
export class SalaryStructureCreateComponent {

}
