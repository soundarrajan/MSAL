import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { TopbarComponent } from './components/navigation/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSubMenuComponent } from './components/navigation/sidebar/menu-items/menu-items.component';
import { AppRoutingModule } from './app-routing.module';
import {
  AppConfig,
  AuthenticationModule,
  BootstrapService,
  CoreModule,
  DefaultModule,
  PrimeNGModule,
  SharedPackagesModule
} from '@shiptech/core';
import { bootstrapApplication } from '../../../../libs/core/src/lib/bootstrap.service';
import { BlankComponent } from './components/blank/blank.component';
import { BreadcrumbComponent } from './components/navigation/breadcrumb/breadcrumb.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AdalInterceptor } from 'adal-angular-wrapper';
import { TokenInterceptor } from '../../../../libs/core/src/lib/interceptors/token-interceptor.service';
import { LoggingModule } from '../../../../libs/core/src/lib/logging/logging.module';
import { environment } from '../environments/environment.prod';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent,
    BlankComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    CoreModule,
    DefaultModule,
    SharedPackagesModule,
    PrimeNGModule,
    AuthenticationModule.forRoot(),
    LoggingModule.forRoot({developmentMode: environment.production})
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
