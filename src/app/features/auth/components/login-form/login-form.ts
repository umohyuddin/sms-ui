import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { HTTP_METHOD } from '../../../../core/const/HTTP_METHOD';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, LoaderComponent,CommonModule],
  standalone: true,
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginForm {
  isPasswordVisible = false;
  spinner = false;
  loginForm!: FormGroup;
  URL = '';
  constructor(private fb: FormBuilder,
    private router: Router,
    private httpClientService: HttpClientService
  ) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['admin',[Validators.required]],
      password: ['123456789',[Validators.required]],
      rememberMe: [false]
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.warn('❌ Form is invalid!');
      this.loginForm.markAllAsTouched();
      return;
    }
    this.spinner = true;
    const loginData = this.loginForm.value as Login;
    console.log('✅ Login Data:', loginData);
    const url = `${this.URL}`;
     this.router.navigate(['/dashboard']);
    // this.httpClientService.request<any>(HTTP_METHOD.POST, url, {
    //   body: loginData,
    //   observeResponse: true
    // }).subscribe({
    //   next: (response) => {
    //     console.log('✅ Login Success Status:', response.status);
    //     console.log('📦 Login Response Body:', response.body);
    //     this.spinner = true;
    //     this.router.navigate(['/dashboard']);

    //   },
    //   error: (error) => {
    //     console.error('❌ Login Error Status:', error.status);
    //     console.error('Message:', error.message);
    //     this.spinner = true;
    //     this.router.navigate(['/dashboard']);

    //   },
    //   complete: () => {
    //     this.spinner = true;
    //   }
    // });
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
   get f(): any {
    return this.loginForm.controls as any;
  }
}
