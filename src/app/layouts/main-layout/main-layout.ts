import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MenuUtils } from '../../shared/utils/menuUtil';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayout {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onLogout() {
    this.menuOpen = false;
    // your logout logic here
    console.log('Logout clicked');
    window.location.href = '/auth/login'; // Adjust the URL as needed
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // close menu if click is outside the menu-container
    if (!target.closest('.menu-container')) {
      this.menuOpen = false;
    }
  }

  handleSubmenuAccordion(event: Event) {
    
    const li = (event.target as HTMLElement).closest('.kt-menu__item--submenu') as HTMLElement | null;

    const submenu = MenuUtils.child(li, '.kt-menu__submenu, .kt-menu__inner');

    if (!li || !submenu) return;

    event.preventDefault();

  event.stopPropagation();

    const isOpen = MenuUtils.hasClass(li, 'kt-menu__item--open');
    const slideSpeed = 200;

    if (!isOpen) {

      // Close all siblings
      const container = li.closest('.kt-menu__nav, .kt-menu__subnav') as HTMLElement | null;

      if (container) {
        const openItems = MenuUtils.children(
          container,
          '.kt-menu__item.kt-menu__item--open.kt-menu__item--submenu:not(.kt-menu__item--here):not(.kt-menu__item--open-always)'
        );

        openItems.forEach(openLi => {
          const siblingSub = MenuUtils.child(openLi, '.kt-menu__submenu');
          if (siblingSub) {
            MenuUtils.slideUp(siblingSub, slideSpeed, () => {
              MenuUtils.removeClass(openLi, 'kt-menu__item--open');
            });
          }
        });
      }

      // Open current submenu
      MenuUtils.slideDown(submenu, slideSpeed, () => {
        // scroll update etc.
      });
      MenuUtils.addClass(li, 'kt-menu__item--open');

    } else {

      // Close current submenu
      MenuUtils.slideUp(submenu, slideSpeed, () => {
        // scroll update etc.
      });
      MenuUtils.removeClass(li, 'kt-menu__item--open');
    }
  }
}
