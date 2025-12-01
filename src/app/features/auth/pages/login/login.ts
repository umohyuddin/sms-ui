import { ChangeDetectorRef, Component,ViewEncapsulation  } from '@angular/core';
import { LoginRightSection } from '../../components/login-right-section/login-right-section';
import { LoginLeftSection } from '../../components/login-left-section/login-left-section';
@Component({
  selector: 'app-login',
  imports: [LoginRightSection, LoginLeftSection],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
   encapsulation: ViewEncapsulation.None 
})
export class Login {
  spinner = true;

  constructor(private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.spinner = false;
    this.cdr.detectChanges();
  }
}
