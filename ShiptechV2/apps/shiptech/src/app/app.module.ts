import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {
  bootstrapApplication,
  BootstrapService
} from '@shiptech/core/bootstrap.service';
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
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
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
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent
} from '@azure/msal-angular';

import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication
} from '@azure/msal-browser';
import { BootstrapResolver } from './resolver/bootstrap-resolver';

let legacyConfig = null;

export function MSALInstanceFactory(): IPublicClientApplication {
  const config = JSON.parse(localStorage.getItem('config'));
  const baseOrigin = new URL(window.location.href).origin;
  legacyConfig = config;
  config.authV2.redirectUri = baseOrigin;
  return new PublicClientApplication({
    auth: {
      clientId: config.authV2.clientId,
      authority: config.authV2.instance + config.authV2.tenantId,
      redirectUri: config.authV2.redirectUri
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
    AuthenticationModule.forRoot(),
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
    MsalModule
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getAppBaseHref,
      deps: [DOCUMENT]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: bootstrapApplication,
      multi: true,
      deps: [BootstrapService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
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
    BootstrapResolver
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
  constructor() {
    ModuleRegistry.registerModules(AllModules);
  }
}
