import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { AuthConfig } from './auth.config';

@NgModule()
export class AuthenticationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        AuthConfig,
        AdalService
      ]
    };
  }
}
