import { Component } from '@angular/core';
import { ModulesCreateFormComponent } from '../../components';

@Component({
  selector: 'app-modules-create',
  standalone: true,
  imports: [ModulesCreateFormComponent],
  templateUrl: './modules-create.component.html',
  styleUrl: './modules-create.component.css'
})
export class ModulesCreateComponent {}
