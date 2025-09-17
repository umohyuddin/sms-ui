import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Institute } from '../../../../models/institute/institute.model';
import { InstituteService } from '../../../../services/institute/institute.service';
@Component({
  selector: 'app-add-edit-institute-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-institute-dialog.component.html',
  styleUrl: './add-edit-institute-dialog.component.scss'
})
export class AddEditInstituteDialogComponent {
  isSaved: boolean = true;
  institute: Institute =new Institute();

  constructor(
      private dialogRef: MatDialogRef<AddEditInstituteDialogComponent>,
      private instituteService: InstituteService,
      @Inject(MAT_DIALOG_DATA) public data: Institute | null
    ) {
      if (data) {
        this.institute = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
    }
  
    save() {
      if(this.isSaved)
      {
        this.instituteService.updateIstitute(this.institute).subscribe({
          next: (res) => console.log('Institute updated:', res),
          error: (err) => console.error(err)
        });
  
      }else{
  
        this.instituteService.createIstitute(this.institute).subscribe({
          next: (res) => console.log('Institute created:', res),
          error: (err) => console.error(err)
        });
      }
       this.dialogRef.close(this.institute);
      
    }
  
    close() {
      this.dialogRef.close();
    }


}
