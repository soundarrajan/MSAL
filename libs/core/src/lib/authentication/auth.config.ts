import { Injectable } from '@angular/core';
import { AppConfig } from '../config/app-config.service';

// Application specific configuration
@Injectable()
export class AuthConfig {
  constructor(private appConfig: AppConfig) {}

  public get adalConfig(): adal.Config {
    return {...this.appConfig.auth};
  }
}
