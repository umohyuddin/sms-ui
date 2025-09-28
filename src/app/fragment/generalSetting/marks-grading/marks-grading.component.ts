import { ChangeDetectionStrategy, Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FailCriteria } from '../../../models/institute/fail-criteria.model';
import { FailCriteriaService } from '../../../services/institute/fail-criteria.service';
import { MarksAndgrading } from '../../../models/institute/marks-andgrading.model';
import { MarksAndGradingService } from '../../../services/institute/marks-and-grading.service';
import { GlobalService } from '../../../services/global/global.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { AddEditMarksAndGradingDialogComponent } from '../../../dialog/settings/add-edit-marks-and-grading-dialog/add-edit-marks-and-grading-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-marks-grading',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './marks-grading.component.html',
  styleUrl: './marks-grading.component.scss'
})
export class MarksGradingComponent implements OnInit {
  grade: MarksAndgrading = new MarksAndgrading();
  gradingList: MarksAndgrading[] = [];
  failCriteria: FailCriteria = new FailCriteria();
  activeTab = signal('marks');

  constructor(
    private globalService: GlobalService,
    private failCriteriaService: FailCriteriaService,
    private marksAndGradingService: MarksAndGradingService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.failCriteriaService.getByInstitute(this.globalService.getInstitute().id??-1).subscribe({
      next: (res) => { this.failCriteria = res; },
      error: (err) => { console.error("Failed to fetch failCriteria.");}
    });

    this.marksAndGradingService.getByInstitute(this.globalService.getInstitute().id??-1).subscribe({
      next: (res) => { this.gradingList = res; },
      error: (err) => { console.error("Failed to fetch grades.");}
    })
  }

  onAddGrade()
  {
    const dialogRef = this.dialog.open(AddEditMarksAndGradingDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gradingList.push(result);
      }
    });

  }
  onEdite(pMarksAndgrading: MarksAndgrading, pIndex: number)
  {
    this.marksAndGradingService.update(pMarksAndgrading).subscribe({
      next: (res) => {
        console.log(res);
        this.gradingList[pIndex] = {...pMarksAndgrading}
      },
      error: (err) => {
        console.error("Failed to update Marks And Grading.");
      }
    })
    
  }

  onDelete(pMarksAndgrading: MarksAndgrading, pIndex: number)
  {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pMarksAndgrading
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.marksAndGradingService.delete(pMarksAndgrading).subscribe({
            next: res => console.log( res),
            error: err => console.error('Failed to delete Marks And grading', err)
          });
        this.gradingList.splice(pIndex,1);
      }
    });

  }

  updateFailCriteria(){
    if(this.failCriteria.id?false:true)
    {
      this.failCriteria.instituteId = this.globalService.getInstitute().id??-1;
      this.failCriteriaService.create(this.failCriteria).subscribe({
        next: (res) =>{
          console.log(res);
        },
        error: (err) => { console.error("Failed to create Fail Criteria.");}
      });

    }else{
      this.failCriteriaService.update(this.failCriteria).subscribe({
        next: (res) =>{
          console.log(res);
        },
        error: (err) => { console.error("Failed to updated Fail Criteria.");}
      });
    }

  }

}
