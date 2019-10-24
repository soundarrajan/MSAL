import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule, BootstrapService, CoreModule, PrimeNGModule } from '@shiptech/core';
import { bootstrapApplication } from '../../../../libs/core/src/lib/bootstrap.service';
import { LoggingModule } from '../../../../libs/core/src/lib/logging/logging.module';
import { environment } from '../environments/environment.prod';
import { BreadcrumbsModule } from '../../../../libs/core/src/lib/ui/components/breadcrumbs/breadcrumbs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { DeveloperToolbarModule } from '@shiptech/core/developer-toolbar/developer-toolbar.module';
import { QuantityControlModule } from '@shiptech/feature/quantity-control';


@NgModule({
  declarations: [
    AppComponent
  ],
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
    NgxsModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    QuantityControlModule,
    DeveloperToolbarModule
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
