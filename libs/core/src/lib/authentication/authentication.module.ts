import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { AuthenticationContext } from './authentication-context';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '../interceptors/authentication-http.interceptor.service.';

// Note: Workaround angular aot: Function calls are not supported in decorators
export function authContextFactory(): AuthenticationContext {
  return AuthenticationContext.instance;
}

@NgModule()
export class AuthenticationModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationModule,
      providers: [
        AdalService,
        AuthenticationService,
        {
          provide: AuthenticationContext,
          useFactory: authContextFactory
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationInterceptor,
          multi: true
        }
      ]
    };
  }

  static forFeature(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationInterceptor,
          multi: true
        }
      ]
    };
  }
}
