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

export function MSALInstanceFactory(): IPublicClientApplication {
  const config = (<any>window).config;
  console.log('msal-config-dynamic', config);
  if (config.useAdal) {
    return null;
  }
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
  const config = (<any>window).config;
  if (config.useAdal) {
    return null;
  }

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
  const config = (<any>window).config;
  if (config.useAdal) {
    return null;
  }
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
