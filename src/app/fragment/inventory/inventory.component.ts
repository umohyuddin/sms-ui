import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Inventory } from '../../models/institute/inventory.model';
import { InventoryService } from '../../services/institute/inventory.service';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog/confirmation-dialog.component'
import { AddEditInventoryDialogComponent } from '../../dialog/institute/inventory/add-edit-inventory-dialog/add-edit-inventory-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  
  inventories: Inventory[] = [];
  filteredInventory: Inventory[] = [];
  searchTerm = '';
  sortColumn: keyof Inventory | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }


    this.load();

    // Reload if the same route is clicked again
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url.includes('/dashboard/inventory')) {
          this.load();
        }
      });
  }

  load(): void {
    console.log("Load call");
    this.inventoryService.getAllInventory().subscribe({
      next: res => {
        this.inventories = res;
        this.filteredInventory = [...this.inventories];
      },
      error: err => console.error('Failed to load Inventory', err)
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredInventory = this.inventories.filter(
      u => u.itemName?.toLowerCase().includes(term)
    );
    this.sortData(this.sortColumn, true);
  }

  sortData(column: keyof Inventory | '', keepDirection = false): void {
    if (!column) return;
    if (!keepDirection) {
      this.sortDirection = this.sortColumn === column && this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    this.sortColumn = column;

    this.filteredInventory.sort((a, b) => {
      const valA = (a[column] || '').toString().toLowerCase();
      const valB = (b[column] || '').toString().toLowerCase();
      return valA < valB ? (this.sortDirection === 'asc' ? -1 : 1) : valA > valB ? (this.sortDirection === 'asc' ? 1 : -1) : 0;
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(AddEditInventoryDialogComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventories.push(result);
        this.filteredInventory = [...this.inventories];
      }
    });
  }

  onEdit(pInventory: Inventory, index: number) {
    const dialogRef = this.dialog.open(AddEditInventoryDialogComponent, {
      width: '400px',
      data: pInventory
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventories[index] = result;
        this.filteredInventory = [...this.inventories];
      }
    });
  }
  onDelete(pInventory: Inventory, index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: pInventory
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.deleteInventory(pInventory).subscribe({
            next: res => console.log('Inventory Deleted:', res),
            error: err => console.error('Failed to delete Inventory', err)
          });
        this.inventories.splice(index,1);
        this.filteredInventory = [...this.inventories];
      }
    });
  }
}
