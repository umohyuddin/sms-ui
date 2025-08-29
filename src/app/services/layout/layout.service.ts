import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  // current active page component
  private _activePage = new BehaviorSubject<string>('user');
  activePage$ = this._activePage.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  setActivePage(page: string) {
    if (isPlatformBrowser(this.platformId)) {
    this._activePage.next(page);
    }
  }
  getActivePage(): string {
    return this._activePage.getValue();
  }
}
