import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { TopbarComponent } from './components/navigation/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSubMenuComponent } from './components/navigation/sidebar/menu-items/menu-items.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule, CoreModule, DefaultModule, PrimeNGModule, SharedPackagesModule } from '@shiptech/core';
import { AppConfig, loadConfiguration } from '../../../../libs/core/src/lib/config/app-config.service';
import { first, tap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidebarComponent,
    AppSubMenuComponent,
    TopbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    CoreModule,
    DefaultModule,
    SharedPackagesModule,
    PrimeNGModule,
    AuthenticationModule.forRoot()
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      multi: true,
      deps: [AppConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(appConfig: AppConfig) {
    appConfig.loaded$
      .pipe(
        tap((config: AppConfig) => LicenseManager.setLicenseKey(config.agGridLicense)),
        first()
      ).subscribe();
  }
}
