import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Fee } from '../../../models/student/fee.modelinterface';
import { FeeService } from '../../../services/student/fee.service';
@Component({
  selector: 'app-add-edit-student-fee-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-student-fee-dialog.component.html',
  styleUrl: './add-edit-student-fee-dialog.component.scss'
})
export class AddEditStudentFeeDialogComponent {

  fee: Fee = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditStudentFeeDialogComponent>,
    private feeService: FeeService,
    @Inject(MAT_DIALOG_DATA) public data: Fee | null
  ) {
    if (data) {
      this.fee = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.feeService.updateFee(this.fee).subscribe({
        next: (res) => console.log('Fee updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.feeService.craeteStudentFee(this.fee).subscribe({
        next: (res) => console.log('Fee created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.fee);
    
  }

  close() {
    this.dialogRef.close();
  }

}
