import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  MsalBroadcastService,
  MsalInterceptor,
  MsalService
} from '@azure/msal-angular';
import { AuthenticationContext } from './authentication-context';
import { AuthenticationService } from './authentication.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from '../interceptors/authentication-http.interceptor.service.';
import { AuthService } from './auth.service';

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
        AuthService,
        // AuthenticationService,
        {
          provide: AuthenticationContext,
          useFactory: authContextFactory
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthenticationInterceptor,
          multi: true
        }
        // {
        //   provide: HTTP_INTERCEPTORS, // Provides as HTTP Interceptor
        //   useClass: MsalInterceptor,
        //   multi: true
        // }
      ]
    };
  }

  static forFeature(): ModuleWithProviders<any> {
    return {
      ngModule: AuthenticationModule,
      providers: [
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: AuthenticationInterceptor,
        //   multi: true
        // }
        {
          provide: HTTP_INTERCEPTORS, // Provides as HTTP Interceptor
          useClass: MsalInterceptor,
          multi: true
        }
      ]
    };
  }
}
