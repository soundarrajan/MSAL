import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SmartRoutingModule } from './smart-routing.module';
import { SmartComponent } from './smart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService, LoggingLevel } from './services/config.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginViewComponent } from './login-view/login-view.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    SmartComponent,
    LoginViewComponent
  ],
  imports: [
    SmartRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule 
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [HttpClient, ConfigService],
      multi: true
    },
  ],
  bootstrap: [SmartComponent]
})
export class SmartModule { }

export function loadConfig(http: HttpClient, config: ConfigService): (() => Promise<boolean>) {
  return (): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      http.get('../assets/data/config.json')
        .pipe(
          map((c: ConfigService) => {
            config.loggingLevel = c.loggingLevel;
            resolve(true);
          }),
          catchError(() => {
            config.loggingLevel = LoggingLevel.None;
            resolve(true);
            return of({});
          })
        ).subscribe();
    });
  };
}