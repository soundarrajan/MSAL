import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { AuthConfig } from './auth.config';
import { AuthenticationContext } from './authentication-context';

// Note: Workaround angular aot: Function calls are not supported in decorators
export function authContextFactory(): AuthenticationContext {
  return AuthenticationContext.instance;
}

@NgModule()
export class AuthenticationModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthenticationModule,
      providers: [
        AuthConfig,
        AdalService,
        {
          provide: AuthenticationContext,
          useFactory: authContextFactory
        }
      ]
    };
  }
}


