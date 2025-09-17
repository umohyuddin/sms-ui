import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { GlobalService } from '../../services/global/global.service';
import { UserService } from '../../services/user/user.service';
import { InstituteService } from '../../services/institute/institute.service';
import { CampusService } from '../../services/institute/campus.service';
import { UserRoleService } from '../../services/user/user-role.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  error: string | null = null;

  constructor(private authService: AuthService, 
              private router: Router,
              private globalService: GlobalService,
              private userService: UserService,
              private instituteService: InstituteService,
              private campusService: CampusService,
              private userRoleService: UserRoleService
            ) {}
  ngOnInit(): void {
      // ✅ Automatically logout whenever login page loads
      this.authService.logout();
    }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.data?.attributes?.token);
        this.setData();
        console.log('login success');
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        console.error('Login failed', err);
      }
    });
  }

  setData(){
    //load user
    this.userService.getByUsername(this.email).subscribe({
      next: (res) => {
        this.globalService.setUser(res);
        //load campus
        this.campusService.getCampusById(res.cmpId ? res.cmpId: -1).subscribe({
          next: (res)=>{
            this.globalService.setCampus(res);
            this.loadRole();
            //load institute
            this.instituteService.getIstituteById(res.instituteId ? res.instituteId: -1).subscribe({
              next: (res)=>{
                this.globalService.setInstitute(res);
                this.router.navigate(['/dashboard']);
                this.error = null;
              },
              error: (err) => {
                console.error('Failrd to fetch institute');
              }
            })
          },
          error: (err) => {
            console.error('Failrd to fetch campus');
          }
        })

      },
      error: (err) => {
        console.error('Failrd to fetch user');
      }
    });
    
  }
  loadRole(){
    this.userRoleService.getById(this.globalService.getUser().roleId??-1).subscribe({
      next: (res) => {
        this.globalService.setRole(res);
      },
      error: (err) => { console.log("Failed to fetch user role.") }
    })

  }
  
  goToSignup() {
  this.router.navigate(['/signup']); 
  }

}
