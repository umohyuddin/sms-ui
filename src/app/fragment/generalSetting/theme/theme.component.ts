import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme/theme.service';
import { Theme } from '../../../models/theme/theme.model';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-theme',
  imports: [FormsModule, CommonModule],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent implements OnInit {
  theme: Theme = new Theme();


  constructor(private themeService: ThemeService,
              private globalService: GlobalService
   ){}
  
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

  ngOnInit(): void {

    this.themeService.getThemeByUserId(this.globalService.getUser().id??-1).subscribe({
      next: (res) =>{ this.theme=res; this.applyTheme(); },
      error: (err) => { console.log('Failed to fetch theme.'); }
    });

    console.log('ThemeSettings initialized. Selected Theme:', this.theme.name);
  }

  changeTheme(ptheme: string) {
    this.theme.name = ptheme;
    this.saveSettings();
    this.applyTheme();
  } 

  saveSettings() {
    if(this.theme.id)
    {
      this.updateTheme();
    }else{
      this.themeService.create(this.theme).subscribe({
          next: (res) => { console.log(res); },
          error: (err) => { console.error(err); }
        })
    }
    this.applyTheme();
  }

  resetDefault() {
    this.theme.headerBg = 'primary';
    this.theme.sidebarBg = 'light';
    this.theme.bodyBg = 'light';
    this.theme.activeItemBg = 'primary';
    this.theme.headerText = 'light';
    this.theme.sidebarText = 'dark';
    this.theme.bodyText = 'dark';
    this.theme.activeItemText = 'dark';

    this.updateTheme();
    this.applyTheme();
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
    console.log(this.theme.name);
  }

  updateTheme() {
    this.themeService.update(this.theme).subscribe({
      next: (res) => { console.log(res); },
      error: (err) => { console.error(err); }
    })
  }

}
