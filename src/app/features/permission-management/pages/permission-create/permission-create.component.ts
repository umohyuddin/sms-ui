import { Component } from '@angular/core';
import { LoggerService } from '../../../../core/services/logger.service';
import { PermissionCreateFormComponent } from '../../components/permission-create-form/permission-create-form.component';

@Component({
  selector: 'app-permission-create',
  standalone: true,
  imports: [PermissionCreateFormComponent],
  templateUrl: './permission-create.component.html',
  styleUrl: './permission-create.component.css'
})
export class PermissionCreateComponent {}
