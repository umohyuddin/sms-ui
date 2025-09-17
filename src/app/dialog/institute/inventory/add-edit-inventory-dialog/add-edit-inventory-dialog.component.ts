import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inventory } from '../../../../models/institute/inventory.model';
import { InventoryService } from '../../../../services/institute/inventory.service';
import { Campus } from '../../../../models/institute/campus.model';
import { CampusService } from '../../../../services/institute/campus.service';
@Component({
  selector: 'app-add-edit-inventory-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-inventory-dialog.component.html',
  styleUrl: './add-edit-inventory-dialog.component.scss'
})
export class AddEditInventoryDialogComponent implements  OnInit{
  isSaved: boolean = true;
  inventory: Inventory =new Inventory();
  campus: Campus[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddEditInventoryDialogComponent>,
    private inventoryService: InventoryService,
    private campusService: CampusService,
    @Inject(MAT_DIALOG_DATA) public data: Inventory | null
  ) {
    if (data) {
      this.inventory = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadCampus();
  }
  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next: (res: Campus[]) => {
        this.campus = res;
      },
      error: (err) => console.error('Failed to load campus', err)
    });
  }
  save() {
    if(this.isSaved)
    {
      this.inventoryService.updateInventory(this.inventory).subscribe({
        next: (res) => console.log('Inventory updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.inventoryService.createInventory(this.inventory).subscribe({
        next: (res) => console.log('Inventory created:', res),
        error: (err) => console.error(err)
      });
    }
      this.dialogRef.close(this.inventory);
    
  }

  close() {
    this.dialogRef.close();
  }

}
