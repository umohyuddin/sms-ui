import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Institute } from '../../../models/institute/institute.model';
import { InstituteService } from '../../../services/institute/institute.service';
import { Campus } from '../../../models/institute/campus.model';
import { CampusService } from '../../../services/institute/campus.service';
import { GlobalService } from '../../../services/global/global.service'; 

@Component({
  selector: 'app-campus-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campus-profile.component.html',
  styleUrl: './campus-profile.component.scss'
})
export class CampusProfileComponent {
  campus: Campus = new Campus();
  institute: Institute = new Institute();
  cityOptions: string[] = [];
  logoFile: File | null = null;
  provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Capital Territory', 'Azad Kashmir', 'Gilgit Baltistan'];
  cities: { [key: string]: string[] } = {
    'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Gujrat', 'Sheikhupura', 'Sargodha',
               'Bahawalpur', 'Dera Ghazi Khan', 'Jhang', 'Sahiwal', 'Okara', 'Rahim Yar Khan'],
    'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Jacobabad', 'Shikarpur'],
    'KPK': ['Peshawar', 'Mardan', 'Mingora', 'Abbottabad', 'Dera Ismail Khan', 'Kohat', 'Swabi', 'Charsadda'],
    'Balochistan': ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Sibi', 'Zhob', 'Loralai'],
    'Capital Territory': ['Islamabad'],
    'Azad Kashmir': ['Muzaffarabad', 'Mirpur', 'Rawalakot', 'Kotli'],
    'Gilgit Baltistan': ['Gilgit', 'Skardu', 'Hunza', 'Chilas']
  };

  constructor(
    private campusService: CampusService,
    private instituteservice: InstituteService,
    private globalService: GlobalService
  ){}
  ngOnInit(): void {
    this.loadInstitute();
    this.loadCampus();
  }

  loadInstitute(){
    this.instituteservice.getIstituteById(this.globalService.getCampus().id??-1).subscribe({
      next: (res)=> {this.institute = res;},
      error: (err)=> {console.log("failed to fetch institute");}
    })
  }

  loadCampus(){
    this.campusService.getCampusById(1).subscribe({
      next: (res)=> {this.campus = res; this.onProvinceChange();},
      error: (err)=> {console.log("failed to fetch campus");}
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
          this.campus.logo = base64String;
      };

      reader.readAsDataURL(this.logoFile);
    }
  }

  updateProfile() {
    this.campusService.updateCampus(this.campus).subscribe({
          next: (res) => console.log('campus updated:', res),
          error: (err) => console.error(err)
        });
  }
  
  onProvinceChange() {
    if (this.campus.province === '' || !this.campus.province) {
      this.cityOptions = [];
    } else {
      this.cityOptions = this.cities[this.campus.province] || [];
    }
  }
}
