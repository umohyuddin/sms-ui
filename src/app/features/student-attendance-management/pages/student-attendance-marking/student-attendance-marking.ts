import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { StudentAttendance, AttendanceMarkingRequest } from '../../models/student-attendance.model';

interface StudentForMarking {
  id: number;
  name: string;
  rollNo: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | null;
  remarks?: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-student-attendance-marking',
  templateUrl: './student-attendance-marking.html',
  styleUrls: ['./student-attendance-marking.css']
})
export class StudentAttendanceMarking implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  
  attendanceDate: Date = new Date();
  standardId: number | null = null;
  sectionId: number | null = null;
  
  students: StudentForMarking[] = [];
  filteredStudents: StudentForMarking[] = [];
  
  searchControl = new FormControl('');
  
  // Quick stats
  stats = {
    total: 0,
    present: 0,
    absent: 0,
    leave: 0,
    unmarked: 0
  };
  
  // Bulk operations
  bulkStatus: 'PRESENT' | 'ABSENT' | 'LEAVE' | null = null;
  
  // Quick filter
  filterStatus: string = 'unmarked'; // all, marked, unmarked (default to unmarked)
  
  // History for undo
  private actionHistory: StudentForMarking[][] = [];
  
  isSaving = false;
  showKeyboardHelp = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get date from route params if available
    const dateParam = this.route.snapshot.paramMap.get('date');
    if (dateParam) {
      this.attendanceDate = new Date(dateParam);
    }
    
    this.searchControl.valueChanges.subscribe(() => {
      this.applyFilters();
    });
    
    // Focus on search input for quick keyboard access
    setTimeout(() => this.searchInput?.nativeElement.focus(), 500);
  }

  // Keyboard shortcuts
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Don't trigger shortcuts when typing in input
    if (event.target instanceof HTMLInputElement && event.target.type !== 'date') {
      return;
    }
    
    // Keyboard shortcuts for quick marking
    // P = Mark Present (filtered student)
    // A = Mark Absent
    // L = Mark Leave
    // C = Clear all
    // U = Undo last action
    // ? = Show help
    // Esc = Toggle keyboard help
    
    switch (event.key.toLowerCase()) {
      case 'p':
        event.preventDefault();
        if (this.filteredStudents.length > 0) {
          this.markAllAs('PRESENT');
        }
        break;
      case 'a':
        event.preventDefault();
        if (this.filteredStudents.length > 0) {
          this.markAllAs('ABSENT');
        }
        break;
      case 'l':
        event.preventDefault();
        if (this.filteredStudents.length > 0) {
          this.markAllAs('LEAVE');
        }
        break;
      case 'c':
        event.preventDefault();
        this.clearAll();
        break;
      case 'u':
        event.preventDefault();
        this.undoLastAction();
        break;
      case '?':
        event.preventDefault();
        this.showKeyboardHelp = !this.showKeyboardHelp;
        break;
      case 'escape':
        this.showKeyboardHelp = false;
        break;
    }
  }

  onContextChange(): void {
    if (this.standardId && this.sectionId) {
      this.loadStudents();
    }
  }

  loadStudents(): void {
    // TODO: Call API to get students for the class
    // Mock data for demonstration
    this.students = [
      { id: 1, name: 'Aarav Sharma', rollNo: '001', status: null },
      { id: 2, name: 'Ananya Verma', rollNo: '002', status: null },
      { id: 3, name: 'Arjun Patel', rollNo: '003', status: null },
      { id: 4, name: 'Diya Singh', rollNo: '004', status: null },
      { id: 5, name: 'Ishaan Kumar', rollNo: '005', status: null },
      { id: 6, name: 'Kavya Reddy', rollNo: '006', status: null },
      { id: 7, name: 'Myra Gupta', rollNo: '007', status: null },
      { id: 8, name: 'Reyansh Joshi', rollNo: '008', status: null },
      { id: 9, name: 'Saanvi Desai', rollNo: '009', status: null },
      { id: 10, name: 'Vihaan Mehta', rollNo: '010', status: null }
    ];
    
    this.filteredStudents = [...this.students];
    this.updateStats();
  }

  markStatus(student: StudentForMarking, status: 'PRESENT' | 'ABSENT' | 'LEAVE'): void {
    // Save to history for undo
    this.saveToHistory();
    student.status = student.status === status ? null : status;
    this.updateStats();
  }

  markAllAs(status: 'PRESENT' | 'ABSENT' | 'LEAVE'): void {
    this.saveToHistory();
    this.filteredStudents.forEach(student => {
      student.status = status;
    });
    this.updateStats();
  }

  private saveToHistory(): void {
    this.actionHistory.push(JSON.parse(JSON.stringify(this.students)));
    // Keep only last 10 actions
    if (this.actionHistory.length > 10) {
      this.actionHistory.shift();
    }
  }

  undoLastAction(): void {
    if (this.actionHistory.length > 0) {
      this.students = this.actionHistory.pop() || this.students;
      this.applyFilters();
      this.updateStats();
    }
  }

  clearAll(): void {
    this.students.forEach(student => {
      student.status = null;
      student.remarks = undefined;
    });
    this.updateStats();
  }

  updateStats(): void {
    this.stats.total = this.students.length;
    this.stats.present = this.students.filter(s => s.status === 'PRESENT').length;
    this.stats.absent = this.students.filter(s => s.status === 'ABSENT').length;
    this.stats.leave = this.students.filter(s => s.status === 'LEAVE').length;
    this.stats.unmarked = this.students.filter(s => s.status === null).length;
  }

  applyFilters(): void {
    let filtered = [...this.students];
    
    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.rollNo.toLowerCase().includes(searchTerm)
      );
    }
    
    // Status filter
    if (this.filterStatus === 'marked') {
      filtered = filtered.filter(s => s.status !== null);
    } else if (this.filterStatus === 'unmarked') {
      filtered = filtered.filter(s => s.status === null);
    }
    
    this.filteredStudents = filtered;
  }

  saveAttendance(): void {
    if (!this.standardId || !this.sectionId) {
      alert('Please select standard and section');
      return;
    }
    
    const unmarked = this.students.filter(s => s.status === null);
    if (unmarked.length > 0) {
      if (!confirm(`${unmarked.length} students are unmarked. Do you want to continue?`)) {
        return;
      }
    }
    
    this.isSaving = true;
    
    // TODO: Call API to save attendance
    const request: AttendanceMarkingRequest = {
      organizationId: 1, // Get from auth service
      standardId: this.standardId,
      sectionId: this.sectionId,
      attendanceDate: this.attendanceDate.toISOString().split('T')[0],
      attendances: this.students
        .filter(s => s.status !== null)
        .map(s => ({
          studentId: s.id,
          status: s.status!,
          remarks: s.remarks
        }))
    };
    
    console.log('Saving attendance:', request);
    
    setTimeout(() => {
      this.isSaving = false;
      alert('Attendance saved successfully!');
      this.router.navigate(['/academic-management/student-attendance']);
    }, 1500);
  }

  cancel(): void {
    if (confirm('Discard unsaved changes?')) {
      this.router.navigate(['/academic-management/student-attendance']);
    }
  }

  getAttendancePercentage(): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.present / this.stats.total) * 100);
  }
}
