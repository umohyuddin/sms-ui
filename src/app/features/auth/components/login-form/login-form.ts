import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../concession-rate-management/services/auth-service';
import { ROUTES } from '../../../../core/const/APP_ROUTES';


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginForm {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required]],
      password: ['123456', [Validators.required]]
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.warn('❌ Form is invalid!');
      this.loginForm.markAllAsTouched();
      return;
    }
    const loginData = this.loginForm.value as Login;
    console.log('  Login Data:', loginData);
    this.authService.loginUser(loginData).subscribe({
      next: (response) => {
        console.log('  Login Success Status:', response.status);
        console.log('📦 Login Response Body:', response.body);
        const token = response.body?.accessToken
        if (token) {
          localStorage.setItem('auth_token', token);
          console.log("🔐 JWT token saved:", token);
          this.router.navigate(ROUTES.DASHBAORD.MAIN_DASHBOARD);
        } else {
          console.error("❌ Token not found in response");
        }
      },
      error: (error) => {
        console.error('❌ Login Error Status:', error.status);
        console.error('Message:', error.message);
        this.router.navigate(['/dashboard']);

      },
      complete: () => {
      }
    });
  }

  get f(): any {
    return this.loginForm.controls as any;
  }
}
