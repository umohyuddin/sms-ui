import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { EmployeeAttendance, EmployeeAttendanceMarkingRequest } from '../../models/employee-attendance.model';

interface EmployeeForMarking {
  id: number;
  name: string;
  code: string;
  department: string;
  designation: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY' | null;
  remarks?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-employee-attendance-marking',
  templateUrl: './employee-attendance-marking.html',
  styleUrls: ['./employee-attendance-marking.css']
})
export class EmployeeAttendanceMarking implements OnInit {
  attendanceDate: Date = new Date();
  departmentId: number | null = null;
  
  employees: EmployeeForMarking[] = [];
  filteredEmployees: EmployeeForMarking[] = [];
  
  searchControl = new FormControl('');
  
  stats = {
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    halfDay: 0,
    unmarked: 0
  };
  
  filterStatus: string = 'all';
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const dateParam = this.route.snapshot.paramMap.get('date');
    if (dateParam) {
      this.attendanceDate = new Date(dateParam);
    }
    
    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    
    this.loadEmployees();
  }

  loadEmployees(): void {
    // TODO: Call API to get employees
    this.employees = [
      { id: 1, name: 'Rajesh Kumar', code: 'EMP001', department: 'Teaching', designation: 'Senior Teacher', status: null },
      { id: 2, name: 'Priya Sharma', code: 'EMP002', department: 'Teaching', designation: 'Teacher', status: null },
      { id: 3, name: 'Amit Patel', code: 'EMP003', department: 'Administration', designation: 'Admin Officer', status: null },
      { id: 4, name: 'Sneha Verma', code: 'EMP004', department: 'Teaching', designation: 'Teacher', status: null },
      { id: 5, name: 'Vikram Singh', code: 'EMP005', department: 'Support Staff', designation: 'Peon', status: null }
    ];
    
    this.filteredEmployees = [...this.employees];
    this.updateStats();
  }

  markStatus(employee: EmployeeForMarking, status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY'): void {
    employee.status = employee.status === status ? null : status;
    this.updateStats();
  }

  markAllAs(status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'HALF_DAY'): void {
    this.filteredEmployees.forEach(emp => {
      emp.status = status;
    });
    this.updateStats();
  }

  clearAll(): void {
    this.employees.forEach(emp => {
      emp.status = null;
      emp.remarks = undefined;
    });
    this.updateStats();
  }

  updateStats(): void {
    this.stats.total = this.employees.length;
    this.stats.present = this.employees.filter(e => e.status === 'PRESENT').length;
    this.stats.absent = this.employees.filter(e => e.status === 'ABSENT').length;
    this.stats.leave = this.employees.filter(e => e.status === 'LEAVE').length;
    this.stats.halfDay = this.employees.filter(e => e.status === 'HALF_DAY').length;
    this.stats.unmarked = this.employees.filter(e => e.status === null).length;
  }

  applyFilters(): void {
    let filtered = [...this.employees];
    
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm) ||
        e.code.toLowerCase().includes(searchTerm) ||
        e.department.toLowerCase().includes(searchTerm)
      );
    }
    
    if (this.filterStatus === 'marked') {
      filtered = filtered.filter(e => e.status !== null);
    } else if (this.filterStatus === 'unmarked') {
      filtered = filtered.filter(e => e.status === null);
    }
    
    this.filteredEmployees = filtered;
  }

  saveAttendance(): void {
    const unmarked = this.employees.filter(e => e.status === null);
    if (unmarked.length > 0) {
      if (!confirm(`${unmarked.length} employees are unmarked. Do you want to continue?`)) {
        return;
      }
    }
    
    this.isSaving = true;
    
    const request: EmployeeAttendanceMarkingRequest = {
      organizationId: 1,
      attendanceDate: this.attendanceDate.toISOString().split('T')[0],
      attendances: this.employees
        .filter(e => e.status !== null)
        .map(e => ({
          employeeId: e.id,
          status: e.status!,
          remarks: e.remarks
        }))
    };
    
    console.log('Saving attendance:', request);
    
    setTimeout(() => {
      this.isSaving = false;
      alert('Attendance saved successfully!');
      this.router.navigate(['/employee-attendance']);
    }, 1500);
  }

  cancel(): void {
    if (confirm('Discard unsaved changes?')) {
      this.router.navigate(['/employee-attendance']);
    }
  }

  getAttendancePercentage(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.present / this.stats.total) * 100);
  }
}
