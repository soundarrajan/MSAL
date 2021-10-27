import { InjectionToken, NgModule, APP_INITIALIZER } from '@angular/core';
import {
  IPublicClientApplication,
  PublicClientApplication,
  LogLevel,
  InteractionType
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration
} from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './service/config.service';

const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

export function initializerFactory(env: ConfigService, configUrl: string): any {
  const promise = env.init(configUrl).then(value => {
    console.log('finished getting configurations dynamically.');
  });
  return () => promise;
}

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(
  configService: ConfigService
): IPublicClientApplication {
  const config = JSON.parse(localStorage.getItem('config'));

  return new PublicClientApplication({
    auth: {
      clientId: config.authV2.clientId,
      authority: config.authV2.instance + config.authV2.tenantId,
      redirectUri: '/v2/'
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });
}

export function MSALInterceptorConfigFactory(
  configService: ConfigService
): MsalInterceptorConfiguration {
  const config = JSON.parse(localStorage.getItem('config'));

  const protectedResourceMap = new Map<string, Array<string>>();
  Object.keys(config.authV2.endpoints).forEach(prop => {
    protectedResourceMap.set(prop, config.authV2.scopes);
  });

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect
  };
}

@NgModule({
  providers: [],
  imports: [MsalModule]
})
export class MsalConfigDynamicModule {
  static forRoot(configFile: string) {
    return {
      ngModule: MsalConfigDynamicModule,
      providers: [
        ConfigService,
        { provide: AUTH_CONFIG_URL_TOKEN, useValue: configFile },
        {
          provide: APP_INITIALIZER,
          useFactory: initializerFactory,
          deps: [ConfigService, AUTH_CONFIG_URL_TOKEN],
          multi: true
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory,
          deps: [ConfigService]
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory,
          deps: [ConfigService]
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useFactory: MSALInterceptorConfigFactory,
          deps: [ConfigService]
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true
        }
      ]
    };
  }
}
