import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import localeUk from '@angular/common/locales/uk';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeUk);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
