import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRole } from '../../../models/user/user-role.model';
import { UserRoleService} from '../../../services/user/user-role.service';
@Component({
  selector: 'app-add-edit-user-role-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-user-role-dialog.component.html',
  styleUrl: './add-edit-user-role-dialog.component.scss'
})
export class AddEditUserRoleDialogComponent {
userRole: UserRole = new UserRole();
isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditUserRoleDialogComponent>,
    private userRoleService: UserRoleService,
    @Inject(MAT_DIALOG_DATA) public data: UserRole | null
  ) {
    if (data) {
      this.userRole = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.userRoleService.update(this.userRole).subscribe({
        next: (res) => console.log('Role updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.userRoleService.create(this.userRole).subscribe({
        next: (res) => console.log('Role created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.userRole);
    
  }

  close() {
    this.dialogRef.close();
  }
}
