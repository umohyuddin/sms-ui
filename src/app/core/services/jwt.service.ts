import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }
   getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  getUserName(): string | null {
    const decoded: any = this.getDecodedToken();
    return decoded ? decoded.name || decoded.username || decoded.sub : null;
  }

  getUserEmail(): string | null {
    const decoded: any = this.getDecodedToken();
    return decoded ? decoded.email : null;
  }

  getUserId(): string | null {
    const decoded: any = this.getDecodedToken();
    return decoded ? decoded.userId : null;
  }

  getRoles(): string[] {
    const decoded: any = this.getDecodedToken();
    return decoded?.roles || [];
  }

   isLoggedIn(): boolean {
    return !!this.getToken(); // true if token exists
  }
}
