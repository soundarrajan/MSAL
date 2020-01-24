import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { bootstrapApplication, BootstrapService } from '@shiptech/core/bootstrap.service';
import { LoggingModule } from '@shiptech/core/logging/logging.module';
import { environment } from '@shiptech/environment';
import { BreadcrumbsModule } from '@shiptech/core/ui/components/breadcrumbs/breadcrumbs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { DeveloperToolbarModule } from '@shiptech/core/developer-toolbar/developer-toolbar.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { PrimeNGModule } from '@shiptech/core/ui/primeng.module';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { CoreModule } from '@shiptech/core/core.module';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { TitleModule } from "@shiptech/core/services/title/title.module";

// Note: Currently we're running the application in a sub directory on the IIS (v2), v1 (angular js) runs in the root. They way we'll also share auth cookies
export function getAppBaseHref(doc: Document): string {
  const base = doc.querySelector('base');
  if (!base || !base.href) {
    return '';
  }
  return new URL(base.href).pathname;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  // TODO: Determine which modules should be imported here or in core module
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    PrimeNGModule,
    AuthenticationModule.forRoot(),
    LoggingModule.forRoot({ developmentMode: !environment.production }),
    BreadcrumbsModule,
    TitleModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production, selectorOptions: { injectContainerState: false, suppressErrors: false } }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    DeveloperToolbarModule,
    LoadingBarModule,
    LoadingBarRouterModule
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
