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
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
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
    !environment.useAdal
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
    !environment.useAdal ? MsalConfigDynamicModule.forRoot() : []
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useFactory: getAppBaseHref,
      deps: [DOCUMENT]
    },
    !environment.useAdal
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
  bootstrap: [AppComponent, !environment.useAdal ? MsalRedirectComponent : []]
})
export class AppModule {
  constructor() {
    ModuleRegistry.registerModules(AllModules);
  }
}
