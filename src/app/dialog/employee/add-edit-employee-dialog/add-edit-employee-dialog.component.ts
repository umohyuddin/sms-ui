import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Employee } from '../../../models/employee/employee.model';
import { EmployeeService} from '../../../services/employee/employee.service';
import { Campus } from '../../../models/institute/campus.model';
import { CampusService } from '../../../services/institute/campus.service';
import { EmployeeRole } from '../../../models/employee/employee-role.model';
import { EmployeeRoleService } from '../../../services/employee/employee-role.service';
import { Department } from '../../../models/institute/department.model';
import { DepartmentService } from '../../../services/institute/department.service';
@Component({
  selector: 'app-add-edit-employee-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-employee-dialog.component.html',
  styleUrl: './add-edit-employee-dialog.component.scss'
})
export class AddEditEmployeeDialogComponent implements OnInit{
  employee: Employee = new Employee();
  campus: Campus[] = [];
  employeeRole: EmployeeRole[] = [];
  department: Department[] = [];
  isSaved: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditEmployeeDialogComponent>,
    private employeeService: EmployeeService,
    private campusService: CampusService,
    private employeeRoleService: EmployeeRoleService,
    private departmentService: DepartmentService,
    @Inject(MAT_DIALOG_DATA) public data: Employee | null
  ) {
    if (data) {
      this.employee = { ...data };
      this.isSaved = true;
    }else{
      this.isSaved = false;
    }
  }
  ngOnInit(){
    this.loadCampus();
    this.loadDepartment();
    this.loadEmployeeRoles();

  }
  loadEmployeeRoles(){
    this.employeeRoleService.getAllEmployeeRole().subscribe({
      next: (res)=>{
        this.employeeRole = res;
      },
      error:(err)=>{
        console.error('Failed to load Employee Role', err);
      }
    });
  }
  loadDepartment(){
    this.departmentService.getAllDeparments().subscribe({
      next: (res) =>{
          this.department = res;
      },
      error: (err) =>{
        console.error('Failed to load department');
      }
    });
  }
  loadCampus() {
    this.campusService.getAllCampus().subscribe({
      next: (res) => {
        this.campus = [...res];
      },
      error: (err) => console.error('Failed to load campus', err)
    });
  }
  save() {
    if(this.isSaved)
    {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: (res) => console.log('Employee updated:', res),
        error: (err) => console.error(err)
      });

    }else{

      this.employeeService.createEmployee(this.employee).subscribe({
        next: (res) => console.log('Employee created:', res),
        error: (err) => console.error(err)
      });
    }
     this.dialogRef.close(this.employee);
    
  }

  close() {
    this.dialogRef.close();
  }

}
