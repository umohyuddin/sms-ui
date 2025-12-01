import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login-left-section',
  imports: [CommonModule,LoginForm],
  standalone: true,
  templateUrl: './login-left-section.html',
  styleUrls: ['./login-left-section.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginLeftSection {
  
}
