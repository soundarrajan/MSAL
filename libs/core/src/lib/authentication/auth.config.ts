import { Injectable } from '@angular/core';
import { AppConfig, BootstrapService } from '../config/app-config.service';

// Application specific configuration
@Injectable()
export class AuthConfig {
  constructor(private appConfig: BootstrapService) {}

  public get adalConfig(): adal.Config {
    return {...this.appConfig.appConfig.auth};
  }
}
