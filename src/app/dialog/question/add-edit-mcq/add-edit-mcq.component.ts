import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Mcq } from '../../../models/question/mcq.model';
import { McqService } from '../../../services/question/mcq.service';
import { GlobalService } from '../../../services/global/global.service';
@Component({
  selector: 'app-add-edit-mcq',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-mcq.component.html',
  styleUrl: './add-edit-mcq.component.scss'
})
export class AddEditMcqComponent {
  mcq: Mcq = new Mcq();
  isSaved: boolean = true;
  constructor(
    private globalService: GlobalService,
    private dialogRef: MatDialogRef<AddEditMcqComponent>,
    private mcqService: McqService,
    @Inject(MAT_DIALOG_DATA) public data: Mcq | null
  ) {
    if (data) {
      this.mcq   = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.mcqService.update(this.mcq).subscribe({
        next: (res) => console.log('MCQ updated:', res),
        error: (err) => console.error(err)
      });

    }else{
      this.mcq.instituteId = this.globalService.getInstitute().id??-1;
      this.mcqService.create(this.mcq).subscribe({
        next: (res) => console.log('MCQ created:', res),
        error: (err) => console.error(err)
      });
    }
      this.dialogRef.close(this.mcq);
    
  }

  close() {
    this.dialogRef.close();
  }
}
