import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { StudentAttendance, AttendanceStatistics } from '../../models/student-attendance.model';

@Component({
  selector: 'app-student-attendance-listing',
  templateUrl: './student-attendance-listing.html',
  styleUrls: ['./student-attendance-listing.css']
})
export class StudentAttendanceListing implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  attendanceRecords: StudentAttendance[] = [];
  filteredRecords: StudentAttendance[] = [];

  searchControl = new FormControl('');

  filters = {
    standardId: null as number | null,
    sectionId: null as number | null,
    attendanceDate: null as string | null,
    status: '' as string,
    dateFrom: null as string | null,
    dateTo: null as string | null
  };

  statistics: AttendanceStatistics = {
    totalStudents: 0,
    present: 0,
    absent: 0,
    leave: 0,
    attendancePercentage: 0
  };

  // Pagination
  currentPage = 1;
  pageSize = 25;
  totalItems = 0;

  // Date range shortcuts
  dateRanges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'thisWeek' },
    { label: 'Last Week', value: 'lastWeek' },
    { label: 'This Month', value: 'thisMonth' }
  ];

  constructor(
    private router: Router
  ) { }

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
    // TODO: Call API service to load attendance records based on filters
    this.attendanceRecords = [];
    this.filteredRecords = [];
    this.totalItems = 0;
  }

  loadTodayStatistics(): void {
    // TODO: Call API service to get today's attendance statistics
    this.statistics = {
      totalStudents: 0,
      present: 0,
      absent: 0,
      leave: 0,
      attendancePercentage: 0
    };
  }

  applyFilters(): void {
    let filtered = [...this.attendanceRecords];

    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.studentName?.toLowerCase().includes(searchTerm) ||
        record.studentRollNo?.toLowerCase().includes(searchTerm) ||
        record.standardName?.toLowerCase().includes(searchTerm)
      );
    }

    if (this.filters.standardId) {
      filtered = filtered.filter(r => r.standardId === this.filters.standardId);
    }

    if (this.filters.sectionId) {
      filtered = filtered.filter(r => r.sectionId === this.filters.sectionId);
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
      standardId: null,
      sectionId: null,
      attendanceDate: null,
      status: '',
      dateFrom: null,
      dateTo: null
    };
    this.searchControl.setValue('');
    this.applyFilters();
  }

  goToMarkAttendance(): void {
    this.router.navigate(['/student-attendance/mark']);
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
    // TODO: Implement export functionality
    console.log('Export attendance data');
  }

  viewDetails(record: StudentAttendance): void {
    // TODO: Show attendance details modal
    console.log('View details:', record);
  }
}
