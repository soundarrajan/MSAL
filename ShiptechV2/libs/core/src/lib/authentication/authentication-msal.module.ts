import { ModuleWithProviders, NgModule } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { AuthenticationContext } from './authentication-context';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationAdalInterceptor } from '../interceptors/authentication-adal-http.interceptor.service.';
import { environment } from '@shiptech/environment';
import { AuthService } from './auth.service';
import { AuthenticationMsalInterceptor } from '../interceptors/authentication-msal-http.interceptor.service.';
import { MsalInterceptor } from '@azure/msal-angular';
import { AuthenticationAdalModule } from './authentication-adal.module';

// Note: Workaround angular aot: Function calls are not supported in decorators
export function authContextFactory(): AuthenticationContext {
  return AuthenticationContext.instance;
}

@NgModule()
export class AuthenticationMsalModule {
  static forRoot(): ModuleWithProviders<any> {
    let config: any;
    if (window.location.hostname.includes('cma')) {
      config = {
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
    } else {
      config = {
        ngModule: AuthenticationMsalModule,
        providers: [
          AdalService,
          AuthenticationService,
          AuthService,
          {
            provide: AuthenticationContext,
            useFactory: authContextFactory
          },
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationMsalInterceptor,
            multi: true
          }
        ]
      };
    }
    return config;
  }

  static forFeature(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationMsalModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS, // Provides as HTTP Interceptor
          useClass: MsalInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationMsalInterceptor,
          multi: true
        }
      ]
    };
  }
}
