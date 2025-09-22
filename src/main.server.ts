import { provideServerRendering } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { AppComponent } from './app/app.component';

import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';

const serverConfig: ApplicationConfig = {
    ...appConfig,
  providers: [
    ...appConfig.providers,
    provideServerRendering()
  ]
};

export default function bootstrap(context: any) {
  return bootstrapApplication(AppComponent, {
    providers: [
      ...serverConfig.providers,
    ]
    
  },context );
}

// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';
// import { provideServerRendering } from '@angular/platform-server'; // 1. Import this

// const bootstrap = () =>
//   bootstrapApplication(AppComponent, {
//     ...appConfig,
//     providers: [
//       ...appConfig.providers,
//       provideServerRendering(), // 2. Add this provider to the array
//     ]
//   });

// export default bootstrap;


