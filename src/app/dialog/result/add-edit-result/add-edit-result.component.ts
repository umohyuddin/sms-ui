import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Result } from '../../../models/class/result.model';
import { ResultService } from '../../../services/result/result.service';
import { GlobalService } from '../../../services/global/global.service';
@Component({
  selector: 'app-add-edit-result',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-result.component.html',
  styleUrl: './add-edit-result.component.scss'
})
export class AddEditResultComponent {
  result: Result = new Result();
  isSaved: boolean = true;
  constructor(
      private globalService: GlobalService,
      private dialogRef: MatDialogRef<AddEditResultComponent>,
      private resultService: ResultService,
      @Inject(MAT_DIALOG_DATA) public data: Result | null
    ) {
      if (data) {
        this.result = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
    }
  
    save() {
      if(this.isSaved)
      {
        this.resultService.update(this.result).subscribe({
          next: (res) => console.log('Result updated:', res),
          error: (err) => console.error(err)
        });
  
      }else{
      
        this.resultService.create(this.result).subscribe({
          next: (res) => console.log('Result created:', res),
          error: (err) => console.error(err)
        });
      }
       this.dialogRef.close(this.result);
      
    }
  
    close() {
      this.dialogRef.close();
    }

}
