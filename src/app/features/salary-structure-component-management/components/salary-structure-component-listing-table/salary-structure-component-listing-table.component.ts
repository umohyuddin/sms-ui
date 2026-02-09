import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Pagination } from '../../../../core/pagar/pagination';
import { SalaryStructureComponentService } from '../../services/salary-structure-component.service';
import { A11yModule } from "@angular/cdk/a11y";
import { LoggerService } from '../../../../core/services/logger.service';
import { SalaryStructureDetails } from '../../models/SalaryStructureDetails';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

@Component({
  selector: 'app-salary-structure-component-listing-table',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule, A11yModule],
  templateUrl: './salary-structure-component-listing-table.component.html',
  styleUrls: ['./salary-structure-component-listing-table.component.css']
})
export class SalaryStructureComponentListingTableComponent implements OnInit {
  //pagination: Pagination<SalaryStructureComponent> = new Pagination([], 10);
  searchControl = new FormControl('');
  searchText = '';
  // salaryStructureComponents: SalaryStructureComponent[] = [];
  salaryStructureDetails: SalaryStructureDetails[] = [];
  private destroy$ = new Subject<void>();

  constructor(private router: Router,
    private salaryStructureComponentService: SalaryStructureComponentService,
   private logger: LoggerService) { }

  columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'salaryStructureId', label: 'Structure ID', sortable: true },
    { key: 'componentName', label: 'Component Name', sortable: true },
    { key: 'componentType', label: 'Type', sortable: true },
    { key: 'value', label: 'Value', sortable: true },
    { key: 'isPercentage', label: 'Is Percentage', sortable: false },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.getSalaryStructureComponents();
    //this.subscribeToSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // private subscribeToSearch() {
  //   this.searchControl.valueChanges
  //     .pipe(
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       switchMap(search => this.salaryStructureComponentService.searchSalaryStructureComponents(search || '')),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.salaryStructureComponents = response.body;
  //         this.pagination = new Pagination(this.salaryStructureComponents, 10);
  //       },
  //       error: (error) => {
  //         console.error('Search error:', error);
  //       }
  //     });
  // }

  getSalaryStructureComponents() {
    this.salaryStructureComponentService.getAllSalaryStructureComponents().subscribe({
      next: (response) => {
        console.log('Success Status:', response.status);
        console.log('Response Body:', response.body);
        //this.salaryStructureComponents = response.body;

        this.salaryStructureDetails = response.body;
        //this.pagination = new Pagination(this.salaryStructureComponents, 10);
      },
      error: (error) => {
        console.error('Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('Request Complete');
      }
    })
  }

  editDetails(item: SalaryStructureDetails, event: Event): void {
    event.preventDefault();
    console.log('Editing Component ID:', item.id);
    this.router.navigate(ROUTES.SALARY_STRUCTURE_COMPONENT.EDIT(item.id.toString()));
  }

  assignToEmployee(item: SalaryStructureDetails, event: Event): void {
    event.preventDefault();
    console.log('Editing Component ID:', item.id);
    this.router.navigate(ROUTES.SALARY_STRUCTURE_COMPONENT.ASSIGN_TO_EMPLOYEE(item.id.toString()));
  }


}
