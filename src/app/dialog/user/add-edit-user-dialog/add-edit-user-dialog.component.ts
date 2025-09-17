import { Component, Inject, OnInit  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { UserRoleService } from '../../../services/user/user-role.service';
import { UserRole } from '../../../models/user/user-role.model';
import { Campus } from '../../../models/institute/campus.model';
import { CampusService } from '../../../services/institute/campus.service';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-add-edit-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrl: './add-edit-user-dialog.component.scss'
})
export class AddEditUserDialogComponent implements OnInit {
  user: User = new User();
  campus: Campus[] = [];
  employee: Employee[] = [];
  userRoles: UserRole[] = [];
  isSaved: boolean = true;

  constructor(
    private userRoleService: UserRoleService,
    private employeeService: EmployeeService,
    private campusService: CampusService,
    private userService: UserService,
    private dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    if (data) {
      this.user = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(): void {
    this.loadRoles();
    this.loadCampus();
    this.loadEmployee();
  }

  loadRoles() {
    this.userRoleService.getAll().subscribe({
      next: (res: UserRole[]) => {
        this.userRoles = res;
      },
      error: (err) => console.error('Failed to load roles', err)
    });
  }

  loadEmployee() {
    this.employeeService.getAllEmployee().subscribe({
      next: (res: Employee[]) => {
        this.employee = res;
      },
      error: (err) => console.error('Failed to load Employee', err)
    });
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
      this.userService.updateUser(this.user).subscribe({
        next: (res) => console.log('user updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.userService.createUser(this.user).subscribe({
        next: (res) => console.log('user created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.employee);
  }

  close() {
    this.dialogRef.close();
  }
}
