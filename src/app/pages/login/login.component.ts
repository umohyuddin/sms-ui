import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}
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
        this.router.navigate(['/home']);
        this.error = null;
        console.log('login success');
        console.log(res.data?.attributes?.token);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        console.error('Login failed', err);
      }
    });
  }
  
  goToSignup() {
  this.router.navigate(['/signup']); 
  }

}
