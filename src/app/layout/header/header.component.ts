import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
    imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  headerBg = 'bg-primary';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
   
  }

  logout() {
    this.authService.logout();      // clear token / session
    this.router.navigate(['/login']); // redirect to login page
  }
}
