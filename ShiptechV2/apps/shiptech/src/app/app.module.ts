import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main.component';
import { SidebarComponent } from './components/navigation/sidebar/sidebar.component';
import { TopbarComponent } from './components/navigation/topbar/topbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSubMenuComponent } from './components/navigation/sidebar/menu-items/menu-items.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule, DefaultModule, PrimeNGModule, SharedPackagesModule } from '@shiptech/core';


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
    CoreModule,
    DefaultModule,
    SharedPackagesModule,
    PrimeNGModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
