import {  Component,ViewEncapsulation  } from '@angular/core';
import { LoginRightSection } from '../../components/login-right-section/login-right-section';
import { LoginLeftSection } from '../../components/login-left-section/login-left-section';
import { AppConfigService } from '../../../../core/services/app-config.service';
@Component({
  selector: 'app-login',
  imports: [LoginRightSection, LoginLeftSection],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
   encapsulation: ViewEncapsulation.None 
})
export class Login {
  academicYear: any;
 
  constructor(private configService: AppConfigService) { }
   ngOnInit() {
      this.academicYear = this.configService.getAcademicYear();
    console.log("Loaded academic year:", this.academicYear);
    // const appData = this.cacheService.getConfig();
    // console.log("Static app data:", appData);
  }
}
