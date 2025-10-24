import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Provide HttpClient and the in-memory web api for demo data
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      InMemoryWebApiModule.forRoot(InMemoryDataService, {
        passThruUnknownUrl: true,
        delay: 300
      })
    )
  ]
};
