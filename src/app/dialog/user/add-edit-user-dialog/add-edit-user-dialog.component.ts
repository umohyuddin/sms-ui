import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user/user.model';

@Component({
  selector: 'app-add-edit-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrl: './add-edit-user-dialog.component.scss'
})
export class AddEditUserDialogComponent {
user: User = {};

  constructor(
    private dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    if (data) {
      this.user = { ...data }; // Pre-fill if editing
    }
  }

  save() {
    this.dialogRef.close(this.user);
  }

  close() {
    this.dialogRef.close();
  }
}
