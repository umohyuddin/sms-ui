import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type LoaderType = 'spinner' | 'pulse' | 'skeleton' | 'dots' | 'ring';
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoaderColor = 'primary' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() show: boolean = true;
  @Input() type: LoaderType = 'ring'; // Changed default to ring for better visibility
  @Input() size: LoaderSize = 'lg'; // Changed default to lg
  @Input() color: LoaderColor = 'primary';
  @Input() message?: string;
  @Input() overlay: boolean = true; // Changed default to true for overlay effect
  @Input() fullScreen: boolean = false;
  @Input() skeletonItems: number = 3;

  // For skeleton loader
  get skeletonArray(): number[] {
    return Array(this.skeletonItems).fill(0);
  }

  // Get CSS classes for the loader
  get loaderClasses(): string {
    const baseClasses = ['kt-loader'];

    if (this.type === 'spinner') {
      baseClasses.push('kt-spinner');
      baseClasses.push(`kt-spinner--${this.size === 'xl' ? 'lg' : this.size}`);
      baseClasses.push(`kt-spinner--${this.color}`);
      baseClasses.push('kt-spinner--center');
    }

    return baseClasses.join(' ');
  }

  get containerClasses(): string {
    const classes = ['loader-container'];

    if (this.overlay) {
      classes.push('loader-overlay');
    }

    if (this.fullScreen) {
      classes.push('loader-fullscreen');
    }

    if (!this.show) {
      classes.push('loader-hidden');
    }

    return classes.join(' ');
  }
}
