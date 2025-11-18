import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expenses } from '../../../models/expenses/expenses.model';
import { ExpensesService } from '../../../services/expenses/expenses.service';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-add-edit-expenses',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-expenses.component.html',
  styleUrl: './add-edit-expenses.component.scss'
})
export class AddEditExpensesComponent {

  expense: Expenses = new Expenses();
  isSaved: boolean = true;
  constructor(
      private globalService: GlobalService,
      private dialogRef: MatDialogRef<AddEditExpensesComponent>,
      private expensesService: ExpensesService,
      @Inject(MAT_DIALOG_DATA) public data: Expenses | null
    ) {
      if (data) {
        this.expense = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
    }
  
    save() {
      if(this.isSaved)
      {
        this.expensesService.update(this.expense).subscribe({
          next: (res) => console.log('Expense updated:', res),
          error: (err) => console.error(err)
        });
  
      }else{
        this.expense.campusId = this.globalService.getCampus().id??-1;
        this.expensesService.create(this.expense).subscribe({
          next: (res) => console.log('Expense created:', res),
          error: (err) => console.error(err)
        });
      }
       this.dialogRef.close(this.expense);
      
    }
  
    close() {
      this.dialogRef.close();
    }

}
