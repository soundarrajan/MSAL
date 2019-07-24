import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app-config.service';

// Application specific configuration
@Injectable()
export class AuthConfig {
  constructor(private appConfig: AppConfig) {}

  public get adalConfig(): any {
    return {
      tenant: this.appConfig.tenantId,
      clientId: this.appConfig.clientId,
      redirectUri: window.location.origin + '/',
      postLogoutRedirectUri: window.location.origin + '/',
      cacheLocation: 'localStorage'
    };
  }
}
