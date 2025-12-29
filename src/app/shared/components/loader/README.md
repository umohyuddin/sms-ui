# Modern Loader Component

A flexible and modern loading component with multiple animation types and customization options.

## Features

- **Multiple Loader Types**: Spinner, Pulse, Dots, Ring, and Skeleton loaders
- **Size Options**: Small, Medium, Large, and Extra Large
- **Color Themes**: Primary, Brand, Success, Warning, Danger, Info, Light, Dark
- **Display Modes**: Inline, Overlay, and Fullscreen
- **Custom Messages**: Optional loading text
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatic dark theme detection

## Usage

### Basic Usage

```html
<!-- Simple spinner -->
<app-loader [show]="isLoading"></app-loader>

<!-- With custom message -->
<app-loader [show]="isLoading" message="Loading data..."></app-loader>
```

### Different Loader Types

```html
<!-- Pulse animation -->
<app-loader [show]="true" type="pulse" message="Processing..."></app-loader>

<!-- Dots animation -->
<app-loader [show]="true" type="dots" color="success"></app-loader>

<!-- Ring animation -->
<app-loader [show]="true" type="ring" size="lg"></app-loader>

<!-- Skeleton loader -->
<app-loader [show]="true" type="skeleton" [skeletonItems]="5"></app-loader>
```

### Overlay and Fullscreen Modes

```html
<!-- Overlay on parent container -->
<app-loader [show]="true" [overlay]="true" message="Saving changes..."></app-loader>

<!-- Fullscreen loader -->
<app-loader [show]="true" [fullScreen]="true" type="spinner" size="xl" color="brand"></app-loader>
```

## API Reference

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `show` | `boolean` | `true` | Controls loader visibility |
| `type` | `LoaderType` | `'spinner'` | Animation type: `'spinner' \| 'pulse' \| 'dots' \| 'ring' \| 'skeleton'` |
| `size` | `LoaderSize` | `'md'` | Size variant: `'sm' \| 'md' \| 'lg' \| 'xl'` |
| `color` | `LoaderColor` | `'primary'` | Color theme: `'primary' \| 'brand' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'light' \| 'dark'` |
| `message` | `string` | `undefined` | Optional loading message |
| `overlay` | `boolean` | `false` | Shows loader as overlay on parent |
| `fullScreen` | `boolean` | `false` | Shows loader as fullscreen overlay |
| `skeletonItems` | `number` | `3` | Number of skeleton items (skeleton type only) |

## Examples

### Loading States

```typescript
export class MyComponent {
  isLoading = false;
  loadingMessage = 'Please wait...';

  loadData() {
    this.isLoading = true;
    this.loadingMessage = 'Fetching data...';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }
}
```

```html
<button (click)="loadData()" [disabled]="isLoading">
  <app-loader *ngIf="isLoading" type="dots" size="sm"></app-loader>
  {{ isLoading ? 'Loading...' : 'Load Data' }}
</button>

<app-loader
  [show]="isLoading"
  type="spinner"
  size="lg"
  color="brand"
  [fullScreen]="true"
  [message]="loadingMessage">
</app-loader>
```

### Skeleton Loading

```html
<div class="user-list">
  <app-loader
    [show]="!users.length"
    type="skeleton"
    [skeletonItems]="5">
  </app-loader>

  <div *ngIf="users.length" class="user-item" *ngFor="let user of users">
    <!-- User content -->
  </div>
</div>
```

## Styling

The component uses CSS custom properties and can be customized by overriding these variables:

```css
:root {
  --loader-primary-color: #5867dd;
  --loader-brand-color: #22b9ff;
  --loader-success-color: #34bfa3;
  --loader-warning-color: #ffb822;
  --loader-danger-color: #fd397a;
  --loader-info-color: #36a3f7;
  --loader-light-color: #ffffff;
  --loader-dark-color: #282a3c;
}
```

## Accessibility

- All loaders include appropriate ARIA attributes
- Screen reader announcements for loading states
- Reduced motion support for users with motion sensitivity preferences
- High contrast support for better visibility

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)