import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Campus } from '../../../../models/institute/campus.model';
import { CampusService } from '../../../../services/institute/campus.service';
@Component({
  selector: 'app-add-edit-campus-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-campus-dialog.component.html',
  styleUrl: './add-edit-campus-dialog.component.scss'
})
export class AddEditCampusDialogComponent {
  isSaved: boolean = true;
  campus: Campus = new Campus();

  constructor(
      private dialogRef: MatDialogRef<AddEditCampusDialogComponent>,
      private campusService: CampusService,
      @Inject(MAT_DIALOG_DATA) public data: Campus | null
    ) {
      if (data) {
        this.campus = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
    }
  
    save() {
      if(this.isSaved)
      {
        this.campusService.updateCampus(this.campus).subscribe({
          next: (res) => console.log('Campus updated:', res),
          error: (err) => console.error(err)
        });
  
      }else{
  
        this.campusService.createCampus(this.campus).subscribe({
          next: (res) => console.log('Campus created:', res),
          error: (err) => console.error(err)
        });
      }
       this.dialogRef.close(this.campus);
      
    }
  
    close() {
      this.dialogRef.close();
    }


}
