import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { environment } from '@shiptech/environment';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { DeveloperToolbarModule } from '@shiptech/core/developer-toolbar/developer-toolbar.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { CoreModule } from '@shiptech/core/core.module';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { TitleModule } from '@shiptech/core/services/title/title.module';
import { AllModules, ModuleRegistry } from '@ag-grid-enterprise/all-modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shiptech/core/ui/material.module';

// Note: Currently we're running the application in a sub directory on the IIS (v2), v1 (angular js) runs in the root. They way we'll also share auth cookies
export function getAppBaseHref(doc: Document): string {
  const base = doc.querySelector('base');
  if (!base || !base.href) {
    return '';
  }
  return new URL(base.href).pathname;
}

import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG
} from '@azure/msal-angular';
import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication
} from '@azure/msal-browser';
import { BootstrapResolver } from './resolver/bootstrap-resolver';
import { MsalConfigDynamicModule } from './msal-config-dynamic.module';
import {
  bootstrapForMsalApplication,
  BootstrapForMsalService
} from '@shiptech/core/bootstrap-for-msal.service';
import {
  bootstrapForAdalApplication,
  BootstrapForAdalService
} from '@shiptech/core/bootstrap-for-adal.service';

export function getLegacySettings(): string {
  var hostName = window.location.hostname;
  var config = '/config/' + hostName + '.json';
  if (['localhost'].indexOf(hostName) != -1) {
    config = '/config/config.json';
  }
  return config;
}

let legacyConfig = null;

export function MSALInstanceFactory(): IPublicClientApplication {
  const config = JSON.parse(localStorage.getItem('config'));
  const baseOrigin = new URL(window.location.href).origin;
  legacyConfig = config;
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

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const config = JSON.parse(localStorage.getItem('config'));
  legacyConfig = config;
  const protectedResourceMap = new Map<string, Array<string>>();
  Object.keys(legacyConfig.authV2.endpoints).forEach(prop => {
    protectedResourceMap.set(prop, legacyConfig.authV2.scopes);
  });

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

// eslint-disable-next-line @typescript-eslint/tslint/config
export function MSALInterceptConfigFactory() {
  return {
    interactionType: InteractionType.Redirect
  };
}

let useAdal = false;

if (!window.location.hostname.includes('cma')) {
  useAdal = true;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    !useAdal
      ? AuthenticationMsalModule.forRoot()
      : AuthenticationAdalModule.forRoot(),
    LoggingModule.forRoot({ developmentMode: !environment.production }),
    BreadcrumbsModule,
    TitleModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
      selectorOptions: { injectContainerState: false, suppressErrors: false }
    }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    DeveloperToolbarModule,
    LoadingBarRouterModule,
    TitleModule,
    !useAdal ? MsalConfigDynamicModule.forRoot() : []
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getAppBaseHref,
      deps: [DOCUMENT]
    },
    !useAdal
      ? {
          provide: APP_INITIALIZER,
          useFactory: bootstrapForMsalApplication,
          multi: true,
          deps: [BootstrapForMsalService]
        }
      : {
          provide: APP_INITIALIZER,
          useFactory: bootstrapForAdalApplication,
          multi: true,
          deps: [BootstrapForAdalService]
        },
    BootstrapResolver
  ],
  bootstrap: [AppComponent, !useAdal ? MsalRedirectComponent : []]
})
export class AppModule {
  constructor() {
    ModuleRegistry.registerModules(AllModules);
  }
}
