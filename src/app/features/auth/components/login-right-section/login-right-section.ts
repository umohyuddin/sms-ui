import { Component,HostBinding,ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginForm } from "../login-form/login-form";
@Component({
  selector: 'app-login-right-section',
  imports: [CommonModule, LoginForm],
  standalone: true,
  templateUrl: './login-right-section.html',
  styleUrls: ['./login-right-section.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginRightSection {
  @HostBinding('class') hostClasses = "kt-login__form";
}
