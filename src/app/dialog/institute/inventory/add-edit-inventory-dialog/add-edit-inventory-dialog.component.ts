import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inventory } from '../../../../models/institute/inventory.modelinterface';
import { InventoryService } from '../../../../services/institute/inventory.service';
@Component({
  selector: 'app-add-edit-inventory-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-inventory-dialog.component.html',
  styleUrl: './add-edit-inventory-dialog.component.scss'
})
export class AddEditInventoryDialogComponent {
  isSaved: boolean = true;
  inventory: Inventory ={};

  constructor(
      private dialogRef: MatDialogRef<AddEditInventoryDialogComponent>,
      private inventoryService: InventoryService,
      @Inject(MAT_DIALOG_DATA) public data: Inventory | null
    ) {
      if (data) {
        this.inventory = { ...data };
        this.isSaved = true;
      }else{
        this.isSaved = false;
      }
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
