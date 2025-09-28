import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../services/global/global.service';
import { ConfirmationDialogComponent } from '../../../dialog/confirmation-dialog/confirmation-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BankService } from '../../../services/institute/bank.service';
import { Bank } from '../../../models/institute/bank.model';
@Component({
  selector: 'app-fee-challan-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './fee-challan-details.component.html',
  styleUrl: './fee-challan-details.component.scss'
})
export class FeeChallanDetailsComponent implements OnInit{

  bank: Bank = new Bank();
  banks: Bank[] = [];
  index: number = -1;
  logoFile: File | null = null;

  constructor(
    private globalService: GlobalService,
    private bankService: BankService,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(){
    this.bankService.getByInstitute(this.globalService.getInstitute().id??-1).subscribe({
      next:(res) => {this.banks = res; },
      error:(err) => {console.error("Failed to load banks");}
    })
  }

  onAdd(){
    console.log(this.bank.id);
    if(this.bank.id?false:true){
      this.bank.instituteId = this.globalService.getInstitute().id;
      this.bankService.create(this.bank).subscribe({
        next:(res) => {
          this.banks.push({...this.bank})
          this. resetBank();
        },
        error:(err) => {
          console.error("Failed to save bank detailes");
        }
      });
    }else{
      this.bankService.update(this.bank).subscribe({
        next:(res) => {
          this.banks[this.index] = {...this.bank};
          this. resetBank();
        },
        error: (err) => {
          console.error("Faile to updare bank detales");
        }
      });
    }
    
  }

  onEdite(pBank: Bank, index: number){
    this.index = index;
    this.bank = {...pBank};
  }

  onDelete(pBank: Bank, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pBank
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bankService.delete(pBank).subscribe({
            next: res => console.log('bank Deleted:', res),
            error: err => console.error('Failed to delete bank', err)
          });
        this.banks.splice(index,1);
      }
    });
  }
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoFile = input.files[0];

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        let base64String = reader.result as string;

        // Remove prefix like "data:image/jpeg;base64,"
        if (base64String.includes(',')) {
          base64String = base64String.split(',')[1];
        }
          this.bank.logo = base64String;
      };

      reader.readAsDataURL(this.logoFile);
    }
  }

  resetBank(){
    this.bank = new Bank();
  }
}
