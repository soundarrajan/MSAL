import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getLegacySettings(): string {
  var hostName = window.location.hostname;
  var config = '/config/' + hostName + '.json';
  if (['localhost'].indexOf(hostName) != -1) {
    config = '/config/config.json';
  }
  return config;
}

fetch(getLegacySettings())
  .then(response => response.json())
  .then(config => {
    localStorage.setItem('config', JSON.stringify(config));
    (<any>window).config = config;
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
