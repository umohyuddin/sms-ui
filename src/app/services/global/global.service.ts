import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Institute } from '../../models/institute/institute.model';
import { User } from '../../models/user/user.model';
import { Campus } from '../../models/institute/campus.model';
import { UserRole } from '../../models/user/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = sessionStorage;
    }
    if (this.storage) {
      const userData = this.storage.getItem("user");
      const roleData = this.storage.getItem("role");
      const instituteData = this.storage.getItem("institute");
      const campusData = this.storage.getItem("campus");
      const tokenData = this.storage.getItem("token");
      this.role = roleData ? JSON.parse(roleData) : null;
      this.user = userData ? JSON.parse(userData) : null;
      this.institute = instituteData ? JSON.parse(instituteData) : null;
      this.campus = campusData ? JSON.parse(campusData) : null;
      this.token = tokenData ? JSON.parse(tokenData) : null;
    }
   }
  private storage: Storage | null = null;
  private user: User = new User();
  private institute: Institute = new Institute();
  private campus: Campus = new Campus();
  private token: string = "";
  private role: UserRole = new UserRole();

  getRole(): UserRole{ return this.role; }
  setRole(role: UserRole){
    if (this.storage) {
      this.storage.setItem("role", JSON.stringify(role));
    }
    this.role = role;
  }

  isCoreAdmin(): boolean {
    return this.getRole().roleName?.trim().toLowerCase() === 'core_admin';
  }
  isAdmin(): boolean {
    return this.getRole().roleName?.trim().toLowerCase() === 'admin';
  }

  isCampusAdmin(): boolean {
    return this.getRole().roleName?.trim().toLowerCase() === 'campus_admin';
  }

  isStudent(): boolean {
    return this.getRole().roleName?.trim().toLowerCase() === 'student';
  }

  getInstitute(): Institute {
    return this.institute;
  }

  setInstitute(pInstitute: Institute) {
    if (this.storage) {
      this.storage.setItem("institute", JSON.stringify(pInstitute));
    }
    this.institute = pInstitute;
  }

  setUser(pUser: User) {
    if (this.storage) {
      this.storage.setItem("user", JSON.stringify(pUser));
    }
    this.user = pUser;
  }

  getUser(): User{
    return this.user;
  }

  setCampus(pCampus: Campus){
    if (this.storage) {
      this.storage.setItem("campus", JSON.stringify(pCampus));
    }
    this.campus = pCampus;
  }

  getCampus(): Campus{
    return this.campus;
  }

  setToken(pToken: string){
    if (this.storage) {
      this.storage.setItem("token", JSON.stringify(pToken));
    }
    this.token = pToken;
  }
  getToken(): string{
    return this.token;
  }

  removeData(){
    if (this.storage){
      this.storage.removeItem("token");
      this.storage.removeItem("role");
      this.storage.removeItem("campus");
      this.storage.removeItem("user");
      this.storage.removeItem("institute");
    }
  }
}
