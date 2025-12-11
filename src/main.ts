import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfigService } from './app/core/services/app-config.service';


export function initApp(config: AppConfigService) {
  return () => config.loadConfig_();
}
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppConfigService],
      multi: true,
    }
  ]
}).catch(err => console.error(err));