import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../../services/theme/theme.service';
import { Theme } from '../../models/theme/theme.model';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule,RouterModule,RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
   theme: Theme = {
    id: 1,
    userId: 1,
    name: 'light',
    sidebarBg: 'light',
    sidebarText: 'dark',
    bodyBg: 'light',
    bodyText: 'dark',
    headerBg: 'primary',
    headerText: 'light',
    activeItemBg: 'primary',
    activeItemText: 'light'
  };
  private bootstrapColors: { [key: string]: { color: string; } } = {
    light: { color: '#f8f9fa'},
    dark: { color: '#343a40'},
    primary: { color: '#007bff'},
    secondary: { color: '#6c757d'},
    success: { color: '#28a745' },
    danger: { color: '#dc3545' },
    warning: { color: '#ffc107' },
    info: { color: '#17a2b8'}
  };

  constructor(
    private themeService: ThemeService,
    private globalService: GlobalService
  ){}

  ngOnInit(): void {
    this.loadTheme();
  }
  loadTheme(){
    this.themeService.getThemeByUserId(this.globalService.getUser().id??-1).subscribe({
      next: (res) =>{ this.theme = res; this.applyTheme(); },
      error: (err) => { console.error('Failed to fetch theme.'); }
    })
  }

  applyTheme() {

    const html = document.documentElement;
    // Remove existing theme classes
    html.classList.remove('light-theme', 'dark-theme');
    html.style.removeProperty('--header-bg');
    html.style.removeProperty('--header-text');
    html.style.removeProperty('--sidebar-bg');
    html.style.removeProperty('--sidebar-text');
    html.style.removeProperty('--body-bg');
    html.style.removeProperty('--body-text');
    html.style.removeProperty('--active-item-bg');
    html.style.removeProperty('--active-item-text');

    if (this.theme.name === 'light') {
      html.classList.add('light-theme');
    } else if (this.theme.name === 'dark') {
      html.classList.add('dark-theme');
    } else if (this.theme.name === 'custom') {
      // Apply custom theme by updating :root properties
      const root = document.documentElement;
      root.style.setProperty('--header-bg', this.bootstrapColors[this.theme.headerBg??-1].color);
      root.style.setProperty('--header-text', this.bootstrapColors[this.theme.headerText??-1].color);
      root.style.setProperty('--sidebar-bg', this.bootstrapColors[this.theme.sidebarBg??-1].color);
      root.style.setProperty('--sidebar-text', this.bootstrapColors[this.theme.sidebarText??-1].color);
      root.style.setProperty('--body-bg', this.bootstrapColors[this.theme.bodyBg??-1].color);
      root.style.setProperty('--body-text', this.bootstrapColors[this.theme.bodyText??-1].color);
      root.style.setProperty('--active-item-bg', this.bootstrapColors[this.theme.activeItemBg??-1].color);
      root.style.setProperty('--active-item-text', this.bootstrapColors[this.theme.activeItemText??-1].color);
    }
  }

}
