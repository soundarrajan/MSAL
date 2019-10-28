import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { bootstrapApplication, BootstrapService } from '../../../../libs/core/src/lib/bootstrap.service';
import { LoggingModule } from '../../../../libs/core/src/lib/logging/logging.module';
import { environment } from '../environments/environment.prod';
import { BreadcrumbsModule } from '../../../../libs/core/src/lib/ui/components/breadcrumbs/breadcrumbs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { DeveloperToolbarModule } from '@shiptech/core/developer-toolbar/developer-toolbar.module';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { AppErrorHandlingModule } from '@shiptech/core/error-handling/app-error-handling.module';
import { PrimeNGModule } from '@shiptech/core/ui/primeng.module';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { CoreModule } from '@shiptech/core/core.module';


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
    LoggingModule.forRoot({ developmentMode: environment.production }),
    BreadcrumbsModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot(),
    DeveloperToolbarModule,
    LoadingBarModule,
    LoadingBarRouterModule,
  ],
  providers: [
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
