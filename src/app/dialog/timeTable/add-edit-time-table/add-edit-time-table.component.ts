import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeTable } from '../../../models/class/time-table.model';
import { TimeTableService } from '../../../services/class/time-table.service';

@Component({
  selector: 'app-add-edit-time-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-time-table.component.html',
  styleUrl: './add-edit-time-table.component.scss'
})
export class AddEditTimeTableComponent {
  timeTable: TimeTable = new TimeTable();
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditTimeTableComponent>,
    private timeTableService: TimeTableService,
    @Inject(MAT_DIALOG_DATA) public data: TimeTable | null
  ) {
    if (data) {
      this.timeTable = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }

  save() {
    if(this.isSaved)
    {
      this.timeTableService.update(this.timeTable).subscribe({
        next: (res) => console.log('Time Table updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.timeTableService.create(this.timeTable).subscribe({
        next: (res) => console.log('Time Table created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.timeTable);
    
  }

  close() {
    this.dialogRef.close();
  }

}
