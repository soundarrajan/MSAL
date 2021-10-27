import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { AuthenticationContext } from './authentication-context';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationAdalInterceptor } from '../interceptors/authentication-adal-http.interceptor.service.';

// Note: Workaround angular aot: Function calls are not supported in decorators
export function authContextFactory(): AuthenticationContext {
  return AuthenticationContext.instance;
}

@NgModule()
export class AuthenticationAdalModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationAdalModule,
      providers: [
        AdalService,
        AuthenticationService,
        {
          provide: AuthenticationContext,
          useFactory: authContextFactory
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationAdalInterceptor,
          multi: true
        }
      ]
    };
  }

  static forFeature(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationAdalModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationAdalInterceptor,
          multi: true
        }
      ]
    };
  }
}
