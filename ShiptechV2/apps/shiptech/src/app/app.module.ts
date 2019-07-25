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
  bootstrap,
  BootstrapService,
  CoreModule,
  DefaultModule,
  PrimeNGModule,
  SharedPackagesModule
} from '@shiptech/core';


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
      useFactory: bootstrap,
      multi: true,
      deps: [BootstrapService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
