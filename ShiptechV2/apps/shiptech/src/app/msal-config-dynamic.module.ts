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

const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1; // Remove this line to use Angular Universal

export function MSALInstanceFactory(): IPublicClientApplication {
  const config = JSON.parse((<any>window).config);
  console.log('msal-config-dynamic', config);

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

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const config = JSON.parse((<any>window).config);

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
  static forRoot() {
    return {
      ngModule: MsalConfigDynamicModule,
      providers: [
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useFactory: MSALInterceptorConfigFactory
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
