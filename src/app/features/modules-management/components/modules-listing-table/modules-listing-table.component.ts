import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { ModulesService } from '../../services/modules.service';
import { ModuleResponse } from '../../models/ModuleResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { DeletePopupComponent } from '../../../../shared/components/delete-popup/delete-popup.component';

@Component({
  selector: 'app-modules-listing-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DeletePopupComponent],
  templateUrl: './modules-listing-table.component.html',
  styleUrl: './modules-listing-table.component.css'
})
export class ModulesListingTableComponent {
  pagination: Pagination<ModuleResponse> = new Pagination([], 10);
  searchControl = new FormControl('');
  modules: ModuleResponse[] = [];
  isDeletePopupOpen = false;
  pendingDeleteId?: number;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private modulesService: ModulesService,
    private jwtService: JwtService
  ) {}

  columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'route', label: 'Route', sortable: false },
    { key: 'actions', label: 'Actions', sortable: true }
  ];

  ngOnInit() {
    this.getModules();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.modulesService.searchModules(search || '')),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.modules = response.body || [];
          this.pagination = new Pagination(this.modules, 10);
        },
        error: (error) => {
          console.error('Search error:', error);
        }
      });
  }

  private getModules() {
    this.modulesService.getAllModules().subscribe({
      next: (response) => {
        this.modules = response.body || [];
        this.pagination = new Pagination(this.modules, 10);
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  viewModuleDetails(module: ModuleResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.MODULES.DETAILS(module.id.toString()));
  }

  editModuleDetails(module: ModuleResponse, event: Event): void {
    event.preventDefault();
    this.router.navigate(ROUTES.MODULES.EDIT(module.id.toString()));
  }

  deleteModule(moduleId: number, event: Event): void {
    event.stopPropagation();
    this.pendingDeleteId = moduleId;
    this.isDeletePopupOpen = true;
  }

  onConfirmDelete(): void {
    if (this.pendingDeleteId !== undefined) {
      this.modulesService.deleteModule(this.pendingDeleteId).subscribe({
        next: () => {
          this.modules = this.modules.filter(m => m.id !== this.pendingDeleteId);
          this.pagination = new Pagination(this.modules, 10);
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
        },
        error: (error) => {
          console.error('❌ Delete Error Status:', error.status);
          console.error('Message:', error.message);
          this.isDeletePopupOpen = false;
          this.pendingDeleteId = undefined;
        }
      });
    }
  }

  onCancelDelete(): void {
    this.isDeletePopupOpen = false;
    this.pendingDeleteId = undefined;
  }

  onPageSizeChange(event: any) {
    const newSize = +event.target.value;
    this.pagination.changePageSize(newSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
