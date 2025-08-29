import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sclass } from '../../../models/course/sclass.modelinterface';
import { SclassService } from '../../../services/course/sclass.service';
@Component({
  selector: 'app-add-edit-class-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-class-dialog.component.html',
  styleUrl: './add-edit-class-dialog.component.scss'
})
export class AddEditClassDialogComponent {

  sclass: Sclass = {};
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditClassDialogComponent>,
    private sclassService: SclassService,
    @Inject(MAT_DIALOG_DATA) public data: Sclass | null
  ) {
    if (data) {
      this.sclass = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.sclassService.updateClass(this.sclass).subscribe({
        next: (res) => console.log('Sclass updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.sclassService.createClass(this.sclass).subscribe({
        next: (res) => console.log('Sclass created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.sclass);
    
  }

  close() {
    this.dialogRef.close();
  }

}
