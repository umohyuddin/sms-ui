import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { EmployeeAttendance, EmployeeAttendanceStatistics } from '../../models/employee-attendance.model';

@Component({
  selector: 'app-employee-attendance-listing',
  templateUrl: './employee-attendance-listing.html',
  styleUrls: ['./employee-attendance-listing.css']
})
export class EmployeeAttendanceListing implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  attendanceRecords: EmployeeAttendance[] = [];
  filteredRecords: EmployeeAttendance[] = [];
  
  searchControl = new FormControl('');
  
  filters = {
    departmentId: null as number | null,
    designationId: null as number | null,
    attendanceDate: null as string | null,
    status: '' as string,
    dateFrom: null as string | null,
    dateTo: null as string | null
  };
  
  statistics: EmployeeAttendanceStatistics = {
    totalEmployees: 0,
    present: 0,
    absent: 0,
    leave: 0,
    halfDay: 0,
    attendancePercentage: 0
  };
  
  currentPage = 1;
  pageSize = 25;
  totalItems = 0;
  
  dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'This Month', value: 'thisMonth' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadAttendanceRecords();
    this.subscribeToSearch();
    this.loadTodayStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  loadAttendanceRecords(): void {
    // TODO: Call API service
    this.attendanceRecords = [];
    this.filteredRecords = [...this.attendanceRecords];
    this.totalItems = this.filteredRecords.length;
  }

  loadTodayStatistics(): void {
    // TODO: Call API service
    this.statistics = {
      totalEmployees: 85,
      present: 78,
      absent: 3,
      leave: 2,
      halfDay: 2,
      attendancePercentage: 91.8
    };
  }

  applyFilters(): void {
    let filtered = [...this.attendanceRecords];
    
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.employeeName?.toLowerCase().includes(searchTerm) ||
        record.employeeCode?.toLowerCase().includes(searchTerm) ||
        record.departmentName?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (this.filters.departmentId) {
      filtered = filtered.filter(r => r.employeeId === this.filters.departmentId);
    }
    
    if (this.filters.status) {
      filtered = filtered.filter(r => r.status === this.filters.status);
    }
    
    this.filteredRecords = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filters = {
      departmentId: null,
      designationId: null,
      attendanceDate: null,
      status: '',
      dateFrom: null,
      dateTo: null
    };
    this.searchControl.setValue('');
    this.applyFilters();
  }

  goToMarkAttendance(): void {
    this.router.navigate(['/employee-attendance/mark']);
  }

  selectDateRange(range: string): void {
    const today = new Date();
    let fromDate: Date;
    let toDate = today;
    
    switch (range) {
      case 'today':
        fromDate = today;
        break;
      case 'yesterday':
        fromDate = new Date(today.setDate(today.getDate() - 1));
        toDate = fromDate;
        break;
      case 'thisWeek':
        fromDate = new Date(today.setDate(today.getDate() - today.getDay()));
        break;
      case 'lastWeek':
        const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1));
        fromDate = new Date(lastWeekEnd.setDate(lastWeekEnd.getDate() - 6));
        toDate = lastWeekEnd;
        break;
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      default:
        return;
    }
    
    this.filters.dateFrom = fromDate.toISOString().split('T')[0];
    this.filters.dateTo = toDate.toISOString().split('T')[0];
    this.applyFilters();
  }

  exportAttendance(): void {
    console.log('Export attendance data');
  }

  viewDetails(record: EmployeeAttendance): void {
    console.log('View details:', record);
  }
}
