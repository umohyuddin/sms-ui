import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Institute } from '../../../models/institute/institute.model';
import { InstituteService } from '../../../services/institute/institute.service';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-institute-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './institute-profile.component.html',
  styleUrl: './institute-profile.component.scss'
})
export class InstituteProfileComponent implements OnInit {
  // selectedLogo: string | ArrayBuffer | null = null;
  logoFile: File | null = null;
  institute: Institute = new Institute();
  countries = ['Pakistan', 'India', 'USA', 'UK', 'Canada'];

  constructor(private instituteservice: InstituteService,
              private globalService: GlobalService
  ){}

  ngOnInit(): void {
    this.loadInstitute();
  }

  loadInstitute(){
    this.instituteservice.getIstituteById(this.globalService.getInstitute().instituteId??-1).subscribe({
      next: (res)=> {this.institute = res;},
      error: (err)=> {console.log("failed to fetch institute");}
    })
  }
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.logoFile = input.files[0];
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        let base64String = reader.result as string;

        // Remove prefix like "data:image/jpeg;base64,"
        if (base64String.includes(',')) {
          base64String = base64String.split(',')[1];
        }
          this.institute.logo = base64String;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }
  updateProfile() {
    this.instituteservice.updateIstitute(this.institute).subscribe({
          next: (res) => console.log('Institute updated:', res),
          error: (err) => console.error(err)
        });
  }

}
